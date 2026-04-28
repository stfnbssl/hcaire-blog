// PipelineCommandHandler — D6 §3.
// BRPOP loop su hcaire:pipeline:commands, dispatch a step.run / step.cancel / step.ping.
// Pubblica eventi su hcaire:pipeline:events.

import { promises as fs } from 'fs';
import { basename, join, isAbsolute } from 'path';
import { randomUUID } from 'crypto';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import {
  COMMANDS_KEY,
  EVENTS_CHANNEL,
  OUTPUT_ROOT,
  INPUTS_ROOT,
  STEPS_ROOT,
  PRECOMPILED_AXES_DIR,
  DEFAULT_TIMEOUT_MS,
  SERVER_VERSION,
} from './constants.js';
import { PromptComposer } from './PromptComposer.js';
import { CoworkRunner } from './CoworkRunner.js';

export interface PipelineMessage<P = Record<string, unknown>> {
  type: string;
  message_id: string;
  timestamp: string;
  execution_id: string;
  context_id: string;
  step_id: string;
  run_number: number;
  payload: P;
}

interface StepRunPayload {
  prompt_file?: string;
  input_files: { role: string; path: string }[];
  output_dir: string;
  output_filename: string;
  extra_params?: Record<string, unknown>;
  timeout_ms?: number;
  verifica_required?: boolean;
  external_inputs?: { input_id: string; data: Record<string, unknown> }[];
  dispositivo_sorgente?: { tema_id: string; file: string } | null;
}

interface ActiveExecution {
  runner: CoworkRunner;
  command: PipelineMessage<StepRunPayload>;
  startedAt: number;
}

const HANDLER_STARTED_AT = Date.now();

export class PipelineCommandHandler {
  private brpopClient: Redis;
  private pubClient: Redis;
  private composer: PromptComposer;
  private activeExecutions = new Map<string, ActiveExecution>();
  private isRunning = false;

  constructor(redisFactory: () => Redis) {
    // Due connection separate: BRPOP è bloccante, PUBLISH non può convivere
    this.brpopClient = redisFactory();
    this.pubClient = redisFactory();
    this.composer = new PromptComposer();

    this.brpopClient.on('error',  (err) => console.error('[pipeline] brpop client error:', err.message));
    this.brpopClient.on('connect', () => console.log('[pipeline] brpop client connected'));
    this.brpopClient.on('ready',   () => console.log('[pipeline] brpop client READY'));
    this.brpopClient.on('end',     () => console.warn('[pipeline] brpop client disconnected (end)'));

    this.pubClient.on('error',  (err) => console.error('[pipeline] pub client error:', err.message));
    this.pubClient.on('connect', () => console.log('[pipeline] pub client connected'));
    this.pubClient.on('ready',   () => console.log('[pipeline] pub client READY'));
    this.pubClient.on('end',     () => console.warn('[pipeline] pub client disconnected (end)'));
  }

  async start(): Promise<void> {
    this.isRunning = true;
    console.log(`[pipeline] In ascolto su "${COMMANDS_KEY}"`);
    console.log(`[pipeline] STEPS_ROOT  = ${STEPS_ROOT}`);
    console.log(`[pipeline] OUTPUT_ROOT = ${OUTPUT_ROOT}`);

    await this._cleanupOrphanedTempFiles();

    // Loop fire-and-forget; non bloccare il chiamante
    void (async () => {
      while (this.isRunning) {
        try {
          const result = await this.brpopClient.brpop(COMMANDS_KEY, 0);
          if (!result) continue;
          const [, raw] = result;
          let cmd: PipelineMessage;
          try {
            cmd = JSON.parse(raw) as PipelineMessage;
          } catch {
            console.error('[pipeline] messaggio malformato:', raw.slice(0, 200));
            continue;
          }
          // Dispatch asincrono — non blocca il loop
          void this._handleCommand(cmd).catch((err) => {
            console.error('[pipeline] errore non gestito nel command handler:', err);
          });
        } catch (err) {
          if (!this.isRunning) break;
          console.error('[pipeline] errore BRPOP loop:', (err as Error).message);
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

  private async _handleCommand(cmd: PipelineMessage): Promise<void> {
    switch (cmd.type) {
      case 'pipeline.step.run':
        return this._handleStepRun(cmd as unknown as PipelineMessage<StepRunPayload>);
      case 'pipeline.step.cancel':
        return this._handleStepCancel(cmd as unknown as PipelineMessage<{ reason: string }>);
      case 'pipeline.step.ping':
        return this._handlePing(cmd);
      default:
        console.warn('[pipeline] tipo comando non riconosciuto:', cmd.type);
    }
  }

  // ---------- step.run ----------

  private async _handleStepRun(cmd: PipelineMessage<StepRunPayload>): Promise<void> {
    const { execution_id, step_id, context_id, run_number, payload } = cmd;

    // Dedup
    if (this.activeExecutions.has(execution_id)) {
      console.warn(`[pipeline] execution ${execution_id} già attiva — duplicato BRPOP ignorato`);
      await this._publish(cmd, 'pipeline.step.started', { cowork_session_id: null, note: 'duplicate' });
      return;
    }

    // Pre-flight: l'execution potrebbe essere stata cancellata dal backend mentre il
    // messaggio era in coda. Verifica MongoDB: se status non è 'in_coda', salta.
    try {
      const db = mongoose.connection.db;
      if (mongoose.connection.readyState === 1 && db && mongoose.isValidObjectId(execution_id)) {
        const exec = await db
          .collection('pipeline_step_executions')
          .findOne({ _id: new mongoose.Types.ObjectId(execution_id) }, { projection: { status: 1 } });
        if (exec && exec.status !== 'in_coda') {
          console.warn(`[pipeline] execution ${execution_id} in stato "${exec.status}" — comando step.run ignorato`);
          return;
        }
      }
    } catch (err) {
      console.warn('[pipeline] pre-flight Mongo check fallito (procedo lo stesso):', (err as Error).message);
    }

    console.log(`[pipeline] step.run: ${step_id} / ${context_id} / run #${run_number} (exec ${execution_id})`);

    // 1. Risolvi i path relativi → assoluti rispetto ai root locali, con espansione speciale
    //    di "assi-strutturali.json" nei 6 file precompilati (asse_1..asse_6) — vedi
    //    _expandPrecompiledAxes per la motivazione.
    const inputFilesAbs: { role: string; path: string }[] = [];
    for (const f of payload.input_files) {
      const resolved = this._resolveLocalPath(f.path);
      if (basename(resolved).toLowerCase() === 'assi-strutturali.json') {
        try {
          const axes = await this._expandPrecompiledAxes(f.role);
          inputFilesAbs.push(...axes);
        } catch (e) {
          await this._publishFailed(cmd, 'sistema', `Espansione assi precompilati fallita: ${(e as Error).message}`);
          return;
        }
      } else {
        inputFilesAbs.push({ role: f.role, path: resolved });
      }
    }
    const outputDirAbs = isAbsolute(payload.output_dir)
      ? payload.output_dir
      : join(OUTPUT_ROOT, payload.output_dir);
    const dispositivoSorgenteAbs = payload.dispositivo_sorgente
      ? { tema_id: payload.dispositivo_sorgente.tema_id, file: this._resolveLocalPath(payload.dispositivo_sorgente.file) }
      : null;

    // 2. Componi prompt
    let prompt: string;
    try {
      prompt = await this.composer.compose({
        step_id,
        context_id,
        run_number,
        input_files: inputFilesAbs,
        external_inputs: payload.external_inputs ?? [],
        dispositivo_sorgente: dispositivoSorgenteAbs,
        output_dir_abs: outputDirAbs,
        output_filename: payload.output_filename,
      });
    } catch (err) {
      await this._publishFailed(cmd, 'sistema', `Errore composizione prompt: ${(err as Error).message}`);
      return;
    }

    // 3. Crea runner Cowork
    const runner = new CoworkRunner({
      execution_id,
      step_id,
      prompt,
      output_dir_abs: outputDirAbs,
      output_filename: payload.output_filename,
      timeout_ms: payload.timeout_ms ?? DEFAULT_TIMEOUT_MS,
      onLog: (text, level) => { void this._publish(cmd, 'pipeline.step.log', { text, level }); },
    });

    this.activeExecutions.set(execution_id, { runner, command: cmd, startedAt: Date.now() });

    // 4. started
    await this._publish(cmd, 'pipeline.step.started', { cowork_session_id: null });

    // 4b. Riepilogo parametri ricevuti — visibile nel log live così il ricercatore può
    //     verificare cosa è arrivato a Cowork prima che inizino i log dell'agente.
    this._logInputSummary(cmd, {
      step_id,
      run_number,
      input_files: inputFilesAbs,
      external_inputs: payload.external_inputs ?? [],
      dispositivo_sorgente: dispositivoSorgenteAbs,
      output_dir: outputDirAbs,
      output_filename: payload.output_filename,
      prompt_length: prompt.length,
    });

    // 5. esegui
    try {
      const result = await runner.run();
      this.activeExecutions.delete(execution_id);
      await this._publish(cmd, 'pipeline.step.completed', {
        output_file: result.output_file,
        output_file_relative: result.output_file_relative,
        output_data: result.output_data,
        verifica_required: payload.verifica_required ?? false,
        summary: result.summary,
      });
      await this._notifyTelegram(`✅ step ${step_id} completato per ${context_id}${payload.verifica_required ? ' — richiede verifica' : ''}`);
    } catch (err) {
      this.activeExecutions.delete(execution_id);
      const e = err as Error;
      const isTimeout = e.message.toLowerCase().includes('timeout');
      await this._publishFailed(cmd, isTimeout ? 'timeout' : 'cowork', e.message);
      await this._notifyTelegram(`❌ step ${step_id} fallito per ${context_id}: ${e.message.slice(0, 200)}`);
    }
  }

  // ---------- step.cancel ----------

  private async _handleStepCancel(cmd: PipelineMessage<{ reason: string }>): Promise<void> {
    const active = this.activeExecutions.get(cmd.execution_id);
    if (!active) {
      console.log(`[pipeline] cancel ignorato: execution ${cmd.execution_id} non attiva`);
      return;
    }
    await active.runner.cancel();
    this.activeExecutions.delete(cmd.execution_id);
    await this._publish(cmd, 'pipeline.step.cancelled', { reason: cmd.payload.reason });
  }

  // ---------- step.ping ----------

  private async _handlePing(cmd: PipelineMessage): Promise<void> {
    await this._publish(cmd, 'pipeline.step.pong', {
      server_version: SERVER_VERSION,
      active_executions: this.activeExecutions.size,
      uptime_seconds: Math.floor((Date.now() - HANDLER_STARTED_AT) / 1000),
    });
  }

  // ---------- helpers ----------

  private async _publish(
    base: PipelineMessage<unknown>,
    type: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    const event = {
      type,
      message_id: randomUUID(),
      timestamp: new Date().toISOString(),
      execution_id: base.execution_id,
      context_id: base.context_id,
      step_id: base.step_id,
      run_number: base.run_number,
      payload,
    };
    try {
      const subscribers = await this.pubClient.publish(EVENTS_CHANNEL, JSON.stringify(event));
      if (type !== 'pipeline.step.log') {
        console.log(`[pipeline] PUBLISH ${type} → ${subscribers} subscriber(s) — exec ${base.execution_id?.slice(0, 8)}`);
      }
    } catch (err) {
      console.error(`[pipeline] PUBLISH ${type} FALLITO:`, (err as Error).message);
      throw err;
    }
  }

  private async _publishFailed(
    cmd: PipelineMessage<unknown>,
    source: 'cowork' | 'sistema' | 'timeout',
    message: string,
  ): Promise<void> {
    console.error(`[pipeline] step ${cmd.step_id} fallito (${source}): ${message}`);
    await this._publish(cmd, 'pipeline.step.failed', {
      error_source: source,
      error_message: message,
      error_detail: null,
      partial_output_file: null,
    });
  }

  // Pubblica un riepilogo human-readable degli input ricevuti come righe di log.
  // Compaiono nel log viewer subito dopo "started" così il ricercatore vede cosa è
  // effettivamente arrivato all'agente (utile dopo i bug di forma o di delivery).
  private _logInputSummary(
    cmd: PipelineMessage<unknown>,
    info: {
      step_id: string;
      run_number: number;
      input_files: { role: string; path: string }[];
      external_inputs: { input_id: string; data: Record<string, unknown> }[];
      dispositivo_sorgente: { tema_id: string; file: string } | null;
      output_dir: string;
      output_filename: string;
      prompt_length: number;
    },
  ): void {
    const log = (text: string, level: 'info' | 'warn' | 'error' = 'info') => {
      void this._publish(cmd, 'pipeline.step.log', { text, level });
    };
    const truncate = (s: string, max: number): string => (s.length > max ? s.slice(0, max - 1) + '…' : s);

    log(`━━━ parametri ricevuti per ${info.step_id} (run #${info.run_number}) ━━━`);

    if (info.input_files.length === 0) {
      log('• nessun file di input pipeline');
    } else {
      log(`• file di input pipeline (${info.input_files.length}):`);
      for (const f of info.input_files) {
        log(`    [${f.role}]  ${f.path}`);
      }
    }

    if (info.external_inputs.length === 0) {
      log('• nessun input fornito dal ricercatore');
    } else {
      log(`• input forniti dal ricercatore (${info.external_inputs.length}):`);
      for (const ei of info.external_inputs) {
        log(`    ${ei.input_id}:`);
        for (const [k, v] of Object.entries(ei.data ?? {})) {
          let val: string;
          if (v === null || v === undefined) val = 'null';
          else if (typeof v === 'string') val = truncate(v, 200);
          else val = truncate(JSON.stringify(v), 200);
          log(`        ${k}: ${val}`);
        }
      }
    }

    if (info.dispositivo_sorgente) {
      log(`• dispositivo sorgente: tema=${info.dispositivo_sorgente.tema_id} file=${info.dispositivo_sorgente.file}`);
    }

    log(`• output target: ${info.output_dir}/${info.output_filename}`);
    log(`• prompt composto: ${info.prompt_length.toLocaleString('it-IT')} caratteri`);
    log('━━━ fine parametri ━━━');
  }

  // Espande l'input logico "assi-strutturali.json" nei 6 file reali precompilati.
  //
  // Contesto: gli step F2 dichiarano `inputs_strutturali: ["assi-strutturali.json"]` (singolo file
  // logico) mentre sul disco esistono 6 file separati `asse_1.json … asse_6.json` in
  // PRECOMPILED_AXES_DIR. Inoltre i CLAUDE.md degli step F2 menzionano la cartella precompiled
  // con un path Windows-assoluto in backtick, che la regex di cleanup del PromptComposer
  // sostituisce. Per evitare che Cowork resti senza assi, qui sostituiamo la singola entry con
  // 6 entry pointing ai file reali — il PromptComposer le inlinerà tutte (ogni file è ~15KB,
  // sotto la soglia di 50KB).
  private async _expandPrecompiledAxes(role: string): Promise<{ role: string; path: string }[]> {
    let entries: string[];
    try {
      entries = await fs.readdir(PRECOMPILED_AXES_DIR);
    } catch (err) {
      throw new Error(`Cartella assi precompilati non leggibile (${PRECOMPILED_AXES_DIR}): ${(err as Error).message}`);
    }
    const axisFiles = entries
      .filter((e) => /^asse_\d+\.json$/i.test(e))
      .sort();
    if (axisFiles.length === 0) {
      throw new Error(`Nessun file asse_*.json in ${PRECOMPILED_AXES_DIR}`);
    }
    return axisFiles.map((name) => ({
      role,
      path: join(PRECOMPILED_AXES_DIR, name),
    }));
  }

  // Risolve un path inviato dal backend (relativo) → path assoluto sul filesystem locale.
  // Convenzioni:
  //   - se path è già assoluto → ritorna invariato
  //   - prefisso "inputs/<rest>" → INPUTS_ROOT + "<rest senza-prefisso>" se la struttura di
  //     INPUTS_ROOT non include la cartella "inputs/", altrimenti INPUTS_ROOT/<path>
  //   - prefisso "strutturali/<rest>" → STEPS_ROOT/strutturali/<rest>
  //   - altrimenti → OUTPUT_ROOT/<path>
  private _resolveLocalPath(rel: string): string {
    if (isAbsolute(rel)) return rel;
    const normalized = rel.replace(/\\/g, '/');
    if (normalized.startsWith('inputs/')) {
      // Convenzione: INPUTS_ROOT punta a "input/produzioni" e i file vivono sotto
      // "input/produzioni/temi/.../file.json" (NO prefisso "inputs/" sul disco).
      return join(INPUTS_ROOT, normalized.replace(/^inputs\//, ''));
    }
    if (normalized.startsWith('strutturali/')) {
      return join(STEPS_ROOT, normalized);
    }
    return join(OUTPUT_ROOT, normalized);
  }

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
      console.error('[pipeline] telegram error:', (err as Error).message);
    }
  }

  private async _cleanupOrphanedTempFiles(): Promise<void> {
    // Future: pulisce file pipeline-*.md temporanei lasciati da sessioni interrotte
    // (CoworkRunner attuale non scrive su tmpdir, ma il pattern è documentato in D6 §7).
  }
}
