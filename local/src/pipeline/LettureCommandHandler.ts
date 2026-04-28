// Handler dei comandi pipeline Letture (parallela alla pipeline Sviluppo Bambino).
// Ascolta hcaire:letture:commands con BRPOP, dispatch a step.run / step.cancel / step.ping.
// Pubblica eventi su hcaire:letture:events.
//
// Differenze rispetto a PipelineCommandHandler:
//   - canali Redis dedicati
//   - pre-flight su collection `opere` (non `pipeline_step_executions`)
//   - usa LetturePromptComposer (legge da LETTURE_SPECS_ROOT)
//   - input/output path sono già assoluti dal server (no resolver locale)
//   - non espande "assi-strutturali.json" (server passa già i 6 file separati)

import { randomUUID } from 'crypto';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import {
  LETTURE_COMMANDS_KEY,
  LETTURE_EVENTS_CHANNEL,
  LETTURE_OUTPUT_ROOT,
  LETTURE_SPECS_ROOT,
  DEFAULT_TIMEOUT_MS,
  stripPrefix,
} from './lettureConstants.js';
import { LetturePromptComposer } from './LetturePromptComposer.js';
import { CoworkRunner } from './CoworkRunner.js';

interface PipelineMessage<P = Record<string, unknown>> {
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
  input_files: { role: string; path: string }[];
  external_inputs?: { input_id: string; data: Record<string, unknown> }[];
  output_dir: string;
  output_filename: string;
  output_md_filename?: string | null;
  extra_params?: Record<string, unknown>;
  timeout_ms?: number;
}

interface ActiveExecution {
  runner: CoworkRunner;
  command: PipelineMessage<StepRunPayload>;
  startedAt: number;
}

const HANDLER_STARTED_AT = Date.now();
const SERVER_VERSION = '1.0.0';

export class LettureCommandHandler {
  private brpopClient: Redis;
  private pubClient: Redis;
  private composer: LetturePromptComposer;
  private activeExecutions = new Map<string, ActiveExecution>();
  private isRunning = false;

  constructor(redisFactory: () => Redis) {
    this.brpopClient = redisFactory();
    this.pubClient = redisFactory();
    this.composer = new LetturePromptComposer();

    this.brpopClient.on('error',  (err) => console.error('[letture] brpop client error:', err.message));
    this.brpopClient.on('connect', () => console.log('[letture] brpop client connected'));
    this.pubClient.on('error',  (err) => console.error('[letture] pub client error:', err.message));
    this.pubClient.on('connect', () => console.log('[letture] pub client connected'));
  }

  async start(): Promise<void> {
    this.isRunning = true;
    console.log(`[letture] In ascolto su "${LETTURE_COMMANDS_KEY}"`);
    console.log(`[letture] SPECS_ROOT  = ${LETTURE_SPECS_ROOT}`);
    console.log(`[letture] OUTPUT_ROOT = ${LETTURE_OUTPUT_ROOT}`);

    void (async () => {
      while (this.isRunning) {
        try {
          const result = await this.brpopClient.brpop(LETTURE_COMMANDS_KEY, 0);
          if (!result) continue;
          const [, raw] = result;
          let cmd: PipelineMessage;
          try {
            cmd = JSON.parse(raw) as PipelineMessage;
          } catch {
            console.error('[letture] messaggio malformato:', raw.slice(0, 200));
            continue;
          }
          void this._handleCommand(cmd).catch((err) => {
            console.error('[letture] errore non gestito:', err);
          });
        } catch (err) {
          if (!this.isRunning) break;
          console.error('[letture] errore BRPOP loop:', (err as Error).message);
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
        console.warn('[letture] tipo comando non riconosciuto:', cmd.type);
    }
  }

  // ---------- step.run ----------

  private async _handleStepRun(cmd: PipelineMessage<StepRunPayload>): Promise<void> {
    const { execution_id, step_id, context_id, run_number, payload } = cmd;
    const stepDoc = stripPrefix(step_id); // es. "step_3" — usato per Mongo + Composer

    if (this.activeExecutions.has(execution_id)) {
      console.warn(`[letture] execution ${execution_id} già attiva — duplicato ignorato`);
      return;
    }

    // Pre-flight: lo stato dello step nell'opera potrebbe essere cambiato (cancellazione,
    // re-trigger). Saltiamo se non è più `in_coda`.
    try {
      const db = mongoose.connection.db;
      if (mongoose.connection.readyState === 1 && db) {
        const opera = await db
          .collection('opere')
          .findOne(
            { slug: context_id },
            { projection: { [`pipeline.${stepDoc}.stato`]: 1 } },
          );
        const stato = opera?.pipeline?.[stepDoc]?.stato;
        if (stato && stato !== 'in_coda') {
          console.warn(`[letture] step ${stepDoc} di "${context_id}" in stato "${stato}" — comando ignorato`);
          return;
        }
      }
    } catch (err) {
      console.warn('[letture] pre-flight check fallito (procedo lo stesso):', (err as Error).message);
    }

    console.log(`[letture] step.run: ${stepDoc} / ${context_id} / run #${run_number} (exec ${execution_id})`);

    // 1. Componi prompt
    const promptPrefix = typeof payload.extra_params?.prompt_prefix === 'string'
      ? payload.extra_params.prompt_prefix as string
      : null;

    let prompt: string;
    try {
      prompt = await this.composer.compose({
        step_id,
        context_id,
        run_number,
        input_files: payload.input_files,
        external_inputs: payload.external_inputs ?? [],
        prompt_prefix: promptPrefix,
        output_dir_abs: payload.output_dir,
        output_filename: payload.output_filename,
        output_md_filename: payload.output_md_filename ?? null,
      });
    } catch (err) {
      await this._publishFailed(cmd, 'sistema', `Errore composizione prompt: ${(err as Error).message}`);
      return;
    }

    // 2. Crea runner
    const runner = new CoworkRunner({
      execution_id,
      step_id: stepDoc,
      prompt,
      output_dir_abs: payload.output_dir,
      output_filename: payload.output_filename,
      timeout_ms: payload.timeout_ms ?? DEFAULT_TIMEOUT_MS,
      onLog: (text, level) => { void this._publish(cmd, 'pipeline.step.log', { text, level }); },
    });

    this.activeExecutions.set(execution_id, { runner, command: cmd, startedAt: Date.now() });

    // 3. started
    await this._publish(cmd, 'pipeline.step.started', { cowork_session_id: null });

    // 4. Riepilogo human-readable degli input
    this._logInputSummary(cmd, {
      step_id: stepDoc,
      run_number,
      input_files: payload.input_files,
      external_inputs: payload.external_inputs ?? [],
      prompt_prefix: promptPrefix,
      output_dir: payload.output_dir,
      output_filename: payload.output_filename,
      output_md_filename: payload.output_md_filename ?? null,
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
        // Se questo step produce anche un .md, segnaliamo il filename atteso al server
        // — il server lo legge dal filesystem condiviso e lo persiste su Mongo.
        output_md_filename: payload.output_md_filename ?? null,
      });
      await this._notifyTelegram(`✅ letture: step ${stepDoc} completato per ${context_id}`);
    } catch (err) {
      this.activeExecutions.delete(execution_id);
      const e = err as Error;
      const isTimeout = e.message.toLowerCase().includes('timeout');
      await this._publishFailed(cmd, isTimeout ? 'timeout' : 'cowork', e.message);
      await this._notifyTelegram(`❌ letture: step ${stepDoc} fallito per ${context_id}: ${e.message.slice(0, 200)}`);
    }
  }

  // ---------- step.cancel ----------

  private async _handleStepCancel(cmd: PipelineMessage<{ reason: string }>): Promise<void> {
    const active = this.activeExecutions.get(cmd.execution_id);
    if (!active) {
      console.log(`[letture] cancel ignorato: execution ${cmd.execution_id} non attiva`);
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
      const subs = await this.pubClient.publish(LETTURE_EVENTS_CHANNEL, JSON.stringify(event));
      if (type !== 'pipeline.step.log') {
        console.log(`[letture] PUBLISH ${type} → ${subs} subscriber(s) — exec ${base.execution_id?.slice(0, 8)}`);
      }
    } catch (err) {
      console.error(`[letture] PUBLISH ${type} FALLITO:`, (err as Error).message);
      throw err;
    }
  }

  private async _publishFailed(
    cmd: PipelineMessage<unknown>,
    source: 'cowork' | 'sistema' | 'timeout',
    message: string,
  ): Promise<void> {
    console.error(`[letture] step ${cmd.step_id} fallito (${source}): ${message}`);
    await this._publish(cmd, 'pipeline.step.failed', {
      error_source: source,
      error_message: message,
      error_detail: null,
    });
  }

  private _logInputSummary(
    cmd: PipelineMessage<unknown>,
    info: {
      step_id: string;
      run_number: number;
      input_files: { role: string; path: string }[];
      external_inputs: { input_id: string; data: Record<string, unknown> }[];
      prompt_prefix: string | null;
      output_dir: string;
      output_filename: string;
      output_md_filename: string | null;
      prompt_length: number;
    },
  ): void {
    const log = (text: string, level: 'info' | 'warn' | 'error' = 'info') => {
      void this._publish(cmd, 'pipeline.step.log', { text, level });
    };
    const truncate = (s: string, max: number): string => (s.length > max ? s.slice(0, max - 1) + '…' : s);

    log(`━━━ parametri ricevuti per ${info.step_id} (run #${info.run_number}) ━━━`);
    if (info.prompt_prefix) {
      log(`• metadati opera: ${truncate(info.prompt_prefix.replace(/\n/g, ' | '), 200)}`);
    }
    if (info.input_files.length === 0) {
      log('• nessun file di input');
    } else {
      log(`• file di input (${info.input_files.length}):`);
      for (const f of info.input_files) log(`    [${f.role}]  ${f.path}`);
    }
    if (info.external_inputs.length > 0) {
      log(`• input dal sistema (${info.external_inputs.length}):`);
      for (const ei of info.external_inputs) log(`    ${ei.input_id}`);
    }
    log(`• output JSON: ${info.output_dir}/${info.output_filename}`);
    if (info.output_md_filename) log(`• output MD:   ${info.output_dir}/${info.output_md_filename}`);
    log(`• prompt composto: ${info.prompt_length.toLocaleString('it-IT')} caratteri`);
    log('━━━ fine parametri ━━━');
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
      console.error('[letture] telegram error:', (err as Error).message);
    }
  }
}
