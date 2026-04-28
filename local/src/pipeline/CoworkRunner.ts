// CoworkRunner — spawna Cowork (Claude Code CLI) con il prompt composito (D6 §5).
//
// Pattern di spawn riusato da local/src/coworker.ts (article requests):
// `claude --print --dangerously-skip-permissions` con prompt via stdin.
// Cattura stdout riga-per-riga → onLog. Timeout configurabile + cancellazione.
//
// In MOCK_MODE non spawna nulla: scrive un file segnaposto e simula il flusso.

import { spawn, ChildProcess } from 'child_process';
import { promises as fs } from 'fs';
import { join, relative } from 'path';
import readline from 'readline';
import { OUTPUT_ROOT, COWORK_PROJECT_PATH, MOCK_MODE } from './constants.js';

export interface CoworkRunResult {
  output_file: string;
  output_file_relative: string;
  output_data: unknown;
  summary: string | null;
}

export interface CoworkRunnerOptions {
  execution_id: string;
  step_id: string;
  prompt: string;
  output_dir_abs: string;
  output_filename: string;
  timeout_ms: number;
  onLog: (text: string, level: 'info' | 'warn' | 'error') => void;
}

export class CoworkRunner {
  private process: ChildProcess | null = null;
  private isCancelled = false;

  constructor(private opts: CoworkRunnerOptions) {}

  async run(): Promise<CoworkRunResult> {
    await fs.mkdir(this.opts.output_dir_abs, { recursive: true });
    const expectedOutputPath = join(this.opts.output_dir_abs, this.opts.output_filename);
    const startedAtMs = Date.now();

    if (MOCK_MODE) {
      await this._mockRun(expectedOutputPath);
    } else {
      await this._realRun();
    }

    if (this.isCancelled) {
      throw new Error('Esecuzione cancellata');
    }

    // Cerca file: prima il path esatto, poi fallback glob (Cowork può aver
    // sostituito i placeholder come {label} con valori reali e versioned auto).
    let actualPath = expectedOutputPath;
    let usedFallback = false;
    try {
      await fs.access(actualPath);
    } catch {
      const found = await this._findMatchingFile(
        this.opts.output_dir_abs,
        this.opts.output_filename,
        startedAtMs,
      );
      if (!found) {
        throw new Error(
          `Cowork non ha prodotto un file matchando "${this.opts.output_filename}" in ${this.opts.output_dir_abs}`,
        );
      }
      actualPath = found;
      usedFallback = true;
      this.opts.onLog(
        `File esatto non trovato; usato glob fallback: ${actualPath}`,
        'warn',
      );
    }

    const content = await fs.readFile(actualPath, 'utf8');
    let parsedOutput: unknown;
    try {
      parsedOutput = JSON.parse(content);
    } catch {
      throw new Error(`Il file prodotto da Cowork non è JSON valido: ${actualPath}`);
    }

    if (usedFallback) {
      this.opts.onLog(`Output recuperato da glob fallback (${actualPath})`, 'info');
    }

    const relPath = relative(OUTPUT_ROOT, actualPath).replace(/\\/g, '/');
    return { output_file: actualPath, output_file_relative: relPath, output_data: parsedOutput, summary: null };
  }

  // Trova un file in `dir` matchando `filenameWithPlaceholders` (con `{...}` trattati
  // come wildcard `*`), preferendo il file con mtime > startedAt e più recente.
  private async _findMatchingFile(
    dir: string,
    filenameWithPlaceholders: string,
    startedAtMs: number,
  ): Promise<string | null> {
    const wildcard = filenameWithPlaceholders.replace(/\{[^}]+\}/g, '*');
    if (!wildcard.includes('*')) {
      return null; // niente da cercare se non c'è un wildcard
    }
    const escaped = wildcard
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*');
    const re = new RegExp('^' + escaped + '$', 'i');

    let entries: string[];
    try { entries = await fs.readdir(dir); } catch { return null; }

    const candidates: { path: string; mtimeMs: number }[] = [];
    for (const f of entries) {
      if (!re.test(f)) continue;
      try {
        const st = await fs.stat(join(dir, f));
        if (!st.isFile()) continue;
        candidates.push({ path: join(dir, f), mtimeMs: st.mtimeMs });
      } catch { /* skip */ }
    }
    if (candidates.length === 0) return null;

    // Preferisci file scritti durante questa esecuzione (con tolleranza di -5s per drift)
    const fresh = candidates.filter((c) => c.mtimeMs >= startedAtMs - 5000);
    const pool = fresh.length > 0 ? fresh : candidates;
    pool.sort((a, b) => b.mtimeMs - a.mtimeMs);
    return pool[0].path;
  }

  async cancel(): Promise<void> {
    this.isCancelled = true;
    this._killProcess();
  }

  // ---------- modalità mock ----------

  private async _mockRun(expectedOutputPath: string): Promise<void> {
    const lines = [
      `[mock] avvio step ${this.opts.step_id} (exec ${this.opts.execution_id})`,
      `[mock] prompt composito: ${this.opts.prompt.length} caratteri`,
      `[mock] output target: ${expectedOutputPath}`,
      `[mock] elaborazione simulata in corso…`,
    ];
    for (const t of lines) {
      if (this.isCancelled) return;
      await new Promise((r) => setTimeout(r, 300));
      this.opts.onLog(t, 'info');
    }
    await fs.writeFile(expectedOutputPath, JSON.stringify({
      step: this.opts.step_id,
      execution_id: this.opts.execution_id,
      generated_by: 'CoworkRunner-mock',
      generated_at: new Date().toISOString(),
      note: 'Output simulato. Disattivare PIPELINE_MOCK_MODE per invocazione reale.',
    }, null, 2), 'utf8');
    this.opts.onLog(`[mock] file scritto: ${expectedOutputPath}`, 'info');
  }

  // ---------- modalità reale ----------

  private async _realRun(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const args = this._buildCoworkArgs();
      const startedAt = Date.now();

      this.opts.onLog(
        `Avvio Cowork (claude ${args.params.join(' ')}) — l'elaborazione può richiedere alcuni minuti senza output intermedio.`,
        'info',
      );

      // shell:true su Windows è necessario per risolvere `claude` come .cmd in PATH,
      // ma con args in array genera DEP0190. Soluzione: shell:true solo su Win32 +
      // params concatenati come stringa.
      const isWin = process.platform === 'win32';
      this.process = isWin
        ? spawn(`${args.command} ${args.params.join(' ')}`, [], {
            shell: true,
            cwd: args.cwd,
            env: { ...process.env, ...args.env },
            stdio: ['pipe', 'pipe', 'pipe'],
          })
        : spawn(args.command, args.params, {
            cwd: args.cwd,
            env: { ...process.env, ...args.env },
            stdio: ['pipe', 'pipe', 'pipe'],
          });

      this.process.stdin?.write(this.opts.prompt);
      this.process.stdin?.end();

      let stderrBuffer = '';
      let stdoutByteCount = 0;
      let stdoutLineCount = 0;

      // Heartbeat ogni 20s: feedback al frontend che il processo è vivo
      const heartbeat = setInterval(() => {
        const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
        this.opts.onLog(
          `Cowork in esecuzione da ${elapsedSec}s — ricevuti ${stdoutLineCount} log line, ${stdoutByteCount} byte`,
          'info',
        );
      }, 20000);

      if (this.process.stdout) {
        // Cattura raw bytes per il conteggio
        this.process.stdout.on('data', (chunk: Buffer) => {
          stdoutByteCount += chunk.length;
        });
        // Cattura riga-per-riga per i log strutturati
        const rl = readline.createInterface({ input: this.process.stdout });
        rl.on('line', (line) => {
          stdoutLineCount++;
          if (line.trim()) this.opts.onLog(line, 'info');
        });
      }

      this.process.stderr?.on('data', (data: Buffer) => {
        const text = data.toString();
        stderrBuffer += text;
        if (text.trim()) this.opts.onLog(text.trim(), 'warn');
      });

      const timer = setTimeout(() => {
        clearInterval(heartbeat);
        this.opts.onLog(`Timeout dopo ${this.opts.timeout_ms}ms — processo terminato`, 'error');
        this._killProcess();
        reject(new Error(`Timeout: nessuna risposta dopo ${Math.round(this.opts.timeout_ms / 1000)}s`));
      }, this.opts.timeout_ms);

      this.process.on('close', (code) => {
        clearTimeout(timer);
        clearInterval(heartbeat);
        const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);
        this.opts.onLog(
          `Cowork terminato (exit ${code}) dopo ${elapsedSec}s — ${stdoutLineCount} log line, ${stdoutByteCount} byte di output.`,
          code === 0 ? 'info' : 'error',
        );
        if (this.isCancelled) {
          resolve();
          return;
        }
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Cowork terminato con exit code ${code}. Stderr: ${stderrBuffer.slice(-500)}`));
        }
      });

      this.process.on('error', (err) => {
        clearTimeout(timer);
        clearInterval(heartbeat);
        reject(new Error(`Impossibile avviare Cowork: ${err.message}`));
      });
    });
  }

  // Argomenti di spawn — replica del pattern usato da coworker.ts (article requests).
  // Se Cowork espone una CLI alternativa, modificare qui.
  private _buildCoworkArgs(): { command: string; params: string[]; cwd: string; env: Record<string, string> } {
    return {
      command: 'claude',
      params: ['--print', '--dangerously-skip-permissions'],
      cwd: COWORK_PROJECT_PATH,
      env: {},
    };
  }

  private _killProcess(): void {
    if (this.process && !this.process.killed && this.process.pid) {
      try {
        process.kill(this.process.pid, 'SIGTERM');
        const pid = this.process.pid;
        setTimeout(() => {
          if (this.process && !this.process.killed) {
            try { process.kill(pid, 'SIGKILL'); } catch { /* ignore */ }
          }
        }, 3000);
      } catch {
        // processo già terminato
      }
    }
  }
}
