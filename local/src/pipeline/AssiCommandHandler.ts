// Handler dei comandi rebuild Assi Strutturali.
// Ascolta hcaire:assi:commands con BRPOP. Per ogni comando assi.rebuild:
//   1. pre-flight su AssiRebuildExecution (status === 'in_coda')
//   2. publish started → compone prompt → spawn Cowork → cattura log
//   3. exit 0 → assiPromote() (validazione + promozione + upsert + archivio)
//   4. publish completed (con axes_updated) o failed
//
// Modello più semplice rispetto a LettureCommandHandler:
//   - un solo tipo di comando (assi.rebuild), no step.cancel/ping
//   - nessun output_file/output_data: l'output è la collection Mongo aggiornata

import { randomUUID } from 'crypto';
import { spawn, ChildProcess } from 'child_process';
import { promises as fs } from 'fs';
import readline from 'readline';
import path from 'path';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import {
  ASSI_COMMANDS_KEY,
  ASSI_EVENTS_CHANNEL,
  COWORK_ASSI_PATH,
  AXES_STAGING_DIR,
  AXES_PRECOMPILED_DIR,
  ASSI_DEFAULT_TIMEOUT_MS,
  ASSI_MOCK_MODE,
  EXPECTED_AXIS_IDS,
} from './assiConstants.js';
import { AssiPromptComposer } from './AssiPromptComposer.js';
import { assiPromote } from './assiPromote.js';

interface AssiMessage<P = Record<string, unknown>> {
  type: string;
  message_id: string;
  timestamp: string;
  execution_id: string;
  payload: P;
}

export class AssiCommandHandler {
  private brpopClient: Redis;
  private pubClient: Redis;
  private composer = new AssiPromptComposer();
  private isRunning = false;
  private activeProc: ChildProcess | null = null;
  private activeExecutionId: string | null = null;

  constructor(redisFactory: () => Redis) {
    this.brpopClient = redisFactory();
    this.pubClient = redisFactory();
    this.brpopClient.on('error',  (err) => console.error('[assi] brpop client error:', err.message));
    this.brpopClient.on('connect', () => console.log('[assi] brpop client connected'));
    this.pubClient.on('error',  (err) => console.error('[assi] pub client error:', err.message));
    this.pubClient.on('connect', () => console.log('[assi] pub client connected'));
  }

  async start(): Promise<void> {
    this.isRunning = true;
    console.log(`[assi] In ascolto su "${ASSI_COMMANDS_KEY}"`);
    console.log(`[assi] COWORK_ASSI_PATH    = ${COWORK_ASSI_PATH}`);
    console.log(`[assi] AXES_STAGING_DIR    = ${AXES_STAGING_DIR}`);
    console.log(`[assi] AXES_PRECOMPILED_DIR= ${AXES_PRECOMPILED_DIR}`);
    if (ASSI_MOCK_MODE) console.log(`[assi] ASSI_MOCK_MODE=true (Cowork non verrà spawnato)`);

    void (async () => {
      while (this.isRunning) {
        try {
          const result = await this.brpopClient.brpop(ASSI_COMMANDS_KEY, 0);
          if (!result) continue;
          const [, raw] = result;
          let cmd: AssiMessage;
          try {
            cmd = JSON.parse(raw) as AssiMessage;
          } catch {
            console.error('[assi] messaggio malformato:', raw.slice(0, 200));
            continue;
          }
          void this._handleCommand(cmd).catch((err) => {
            console.error('[assi] errore non gestito:', err);
          });
        } catch (err) {
          if (!this.isRunning) break;
          console.error('[assi] errore BRPOP loop:', (err as Error).message);
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    })();
  }

  stop(): void {
    this.isRunning = false;
    void this.brpopClient.disconnect();
    void this.pubClient.disconnect();
  }

  // ---------- dispatch ----------

  private async _handleCommand(cmd: AssiMessage): Promise<void> {
    if (cmd.type !== 'assi.rebuild') {
      console.warn('[assi] tipo comando non riconosciuto:', cmd.type);
      return;
    }
    await this._runRebuild(cmd);
  }

  // ---------- rebuild ----------

  private async _runRebuild(cmd: AssiMessage): Promise<void> {
    const { execution_id } = cmd;
    console.log(`[assi] rebuild richiesto: exec ${execution_id}`);

    // Pre-flight: solo se in_coda procediamo. Lo stato potrebbe essere cambiato
    // (es. cancellato dall'admin, watchdog timeout).
    try {
      const db = mongoose.connection.db;
      if (mongoose.connection.readyState === 1 && db) {
        const doc = await db
          .collection('assi_rebuild_executions')
          .findOne({ _id: new mongoose.Types.ObjectId(execution_id) }, { projection: { status: 1 } });
        if (!doc) {
          console.warn(`[assi] execution ${execution_id} non trovata in Mongo — skip`);
          return;
        }
        if (doc.status !== 'in_coda') {
          console.warn(`[assi] execution ${execution_id} in stato "${doc.status}" — skip`);
          return;
        }
      }
    } catch (err) {
      console.warn('[assi] pre-flight check fallito (procedo lo stesso):', (err as Error).message);
    }

    if (this.activeExecutionId) {
      console.warn(`[assi] altra execution attiva (${this.activeExecutionId}) — duplicato ignorato`);
      return;
    }
    this.activeExecutionId = execution_id;

    const logFn = (text: string, level: 'info' | 'warn' | 'error' = 'info'): void => {
      void this._publish(execution_id, 'assi.rebuild.log', { text, level });
    };

    await this._publish(execution_id, 'assi.rebuild.started', { cowork_path: COWORK_ASSI_PATH });

    try {
      // 1. Componi prompt
      let prompt: string;
      try {
        prompt = await this.composer.compose();
      } catch (err) {
        throw new Error(`Composizione prompt fallita: ${(err as Error).message}`);
      }
      logFn(`Prompt composto: ${prompt.length} caratteri`);
      logFn(`Sorgenti normalized: lette direttamente da Cowork dal disco`);
      logFn(`Output Cowork (staging): ${AXES_STAGING_DIR}`);

      // 2. Prepara staging (svuota se esiste, ricrea cartella)
      await this._prepareStagingDir(logFn);

      // 3. Esegui Cowork (o mock)
      if (ASSI_MOCK_MODE) {
        await this._runMockCowork(logFn);
      } else {
        await this._runCowork(prompt, logFn);
      }

      // 4. Promozione: validazione → backup → write → upsert → archivio
      const result = await assiPromote({ executionId: execution_id, onLog: logFn });

      // 5. Notifica completed
      await this._publish(execution_id, 'assi.rebuild.completed', {
        axes_updated: result.axes_updated,
        backup_dir: result.backup_dir,
      });
      await this._notifyTelegram(`✅ assi: rebuild completato (${result.axes_updated.length}/6 assi)`);
    } catch (err) {
      const e = err as Error;
      console.error(`[assi] rebuild ${execution_id} fallito:`, e.message);
      await this._publish(execution_id, 'assi.rebuild.failed', {
        error_message: e.message,
      });
      await this._notifyTelegram(`❌ assi: rebuild fallito: ${e.message.slice(0, 200)}`);
    } finally {
      this.activeExecutionId = null;
      this.activeProc = null;
    }
  }

  // ---------- staging ----------

  private async _prepareStagingDir(onLog: (text: string, level?: 'info'|'warn'|'error') => void): Promise<void> {
    try {
      await fs.rm(AXES_STAGING_DIR, { recursive: true, force: true });
    } catch (err) {
      onLog(`Pulizia staging warning: ${(err as Error).message}`, 'warn');
    }
    await fs.mkdir(AXES_STAGING_DIR, { recursive: true });
    onLog(`Staging dir pronta: ${AXES_STAGING_DIR}`);
  }

  // ---------- mock mode ----------
  // Copia i precompiled correnti nella staging come se Cowork li avesse appena prodotti.
  // Utile per testare validazione + promozione + upsert + archivio senza Cowork.

  private async _runMockCowork(onLog: (text: string, level?: 'info'|'warn'|'error') => void): Promise<void> {
    onLog('[mock] copio i precompiled correnti in staging come segnaposti…');
    for (const axisId of EXPECTED_AXIS_IDS) {
      const src = path.join(AXES_PRECOMPILED_DIR, `${axisId}.json`);
      const dst = path.join(AXES_STAGING_DIR, `${axisId}.json`);
      try {
        await fs.copyFile(src, dst);
        onLog(`  ✓ copiato ${axisId}.json`);
      } catch (err) {
        throw new Error(`[mock] copia ${axisId} fallita: ${(err as Error).message}`);
      }
    }
    onLog('[mock] simulazione Cowork completata');
  }

  // ---------- real spawn Cowork ----------

  private _runCowork(
    prompt: string,
    onLog: (text: string, level?: 'info'|'warn'|'error') => void,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const isWin = process.platform === 'win32';
      const command = 'claude';
      const params = ['--print', '--dangerously-skip-permissions'];

      onLog(`Avvio Cowork (claude ${params.join(' ')}) — può richiedere alcuni minuti senza output intermedio.`);
      const startedAt = Date.now();

      this.activeProc = isWin
        ? spawn(`${command} ${params.join(' ')}`, [], {
            shell: true,
            cwd: COWORK_ASSI_PATH,
            env: { ...process.env },
            stdio: ['pipe', 'pipe', 'pipe'],
          })
        : spawn(command, params, {
            cwd: COWORK_ASSI_PATH,
            env: { ...process.env },
            stdio: ['pipe', 'pipe', 'pipe'],
          });

      this.activeProc.stdin?.write(prompt);
      this.activeProc.stdin?.end();

      let stderrBuf = '';
      let stdoutLines = 0;
      let stdoutBytes = 0;

      const heartbeat = setInterval(() => {
        const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
        onLog(`Cowork in esecuzione da ${elapsedSec}s — ${stdoutLines} log line, ${stdoutBytes} byte`);
      }, 20000);

      if (this.activeProc.stdout) {
        this.activeProc.stdout.on('data', (chunk: Buffer) => { stdoutBytes += chunk.length; });
        const rl = readline.createInterface({ input: this.activeProc.stdout });
        rl.on('line', (line) => {
          stdoutLines++;
          if (line.trim()) onLog(line);
        });
      }

      this.activeProc.stderr?.on('data', (data: Buffer) => {
        const text = data.toString();
        stderrBuf += text;
        if (text.trim()) onLog(text.trim(), 'warn');
      });

      const timer = setTimeout(() => {
        clearInterval(heartbeat);
        onLog(`Timeout dopo ${ASSI_DEFAULT_TIMEOUT_MS}ms — termino il processo`, 'error');
        this._killActiveProc();
        reject(new Error(`Timeout: nessuna risposta dopo ${Math.round(ASSI_DEFAULT_TIMEOUT_MS / 1000)}s`));
      }, ASSI_DEFAULT_TIMEOUT_MS);

      this.activeProc.on('close', (code) => {
        clearTimeout(timer);
        clearInterval(heartbeat);
        const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);
        onLog(
          `Cowork terminato (exit ${code}) dopo ${elapsedSec}s — ${stdoutLines} log line, ${stdoutBytes} byte`,
          code === 0 ? 'info' : 'error',
        );
        if (code === 0) resolve();
        else reject(new Error(`Cowork exit ${code}. Stderr: ${stderrBuf.slice(-500)}`));
      });

      this.activeProc.on('error', (err) => {
        clearTimeout(timer);
        clearInterval(heartbeat);
        reject(new Error(`Impossibile avviare Cowork: ${err.message}`));
      });
    });
  }

  private _killActiveProc(): void {
    const proc = this.activeProc;
    if (!proc || proc.killed || !proc.pid) return;
    try {
      process.kill(proc.pid, 'SIGTERM');
      const pid = proc.pid;
      setTimeout(() => {
        if (this.activeProc && !this.activeProc.killed) {
          try { process.kill(pid, 'SIGKILL'); } catch { /* ignore */ }
        }
      }, 3000);
    } catch {
      // già terminato
    }
  }

  // ---------- publish ----------

  private async _publish(
    executionId: string,
    type: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    const event = {
      type,
      message_id: randomUUID(),
      timestamp: new Date().toISOString(),
      execution_id: executionId,
      payload,
    };
    try {
      const subs = await this.pubClient.publish(ASSI_EVENTS_CHANNEL, JSON.stringify(event));
      if (type !== 'assi.rebuild.log') {
        console.log(`[assi] PUBLISH ${type} → ${subs} subscriber(s) — exec ${executionId.slice(0, 8)}`);
      }
    } catch (err) {
      console.error(`[assi] PUBLISH ${type} FALLITO:`, (err as Error).message);
    }
  }

  // ---------- notify ----------

  private async _notifyTelegram(text: string): Promise<void> {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_ID;
    if (!token || !chatId) return;
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
    } catch (err) {
      console.error('[assi] telegram error:', (err as Error).message);
    }
  }
}
