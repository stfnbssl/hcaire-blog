// PipelineMessageBus — protocollo Redis per orchestrazione pipeline (D3 §9).
// Backend → server locale: LPUSH su hcaire:pipeline:commands.
// Server locale → backend: PUBLISH su hcaire:pipeline:events.

import crypto from 'crypto';
import Redis from 'ioredis';
import { getRedisClient } from '../config/redis';

const COMMANDS_KEY = process.env.REDIS_PIPELINE_COMMANDS_KEY ?? 'hcaire:pipeline:commands';
const EVENTS_CHANNEL = process.env.REDIS_PIPELINE_EVENTS_CHANNEL ?? 'hcaire:pipeline:events';
const DEFAULT_TIMEOUT_MS = parseInt(process.env.PIPELINE_DEFAULT_TIMEOUT_MS ?? '300000', 10);
const PING_TIMEOUT_MS = 5000;

export type CommandType =
  | 'pipeline.step.run'
  | 'pipeline.step.cancel'
  | 'pipeline.step.ping';

export type EventType =
  | 'pipeline.step.started'
  | 'pipeline.step.log'
  | 'pipeline.step.completed'
  | 'pipeline.step.failed'
  | 'pipeline.step.cancelled'
  | 'pipeline.step.pong';

export interface PipelineMessage<P = Record<string, unknown>> {
  type: CommandType | EventType;
  message_id: string;
  timestamp: string;
  execution_id: string;
  context_id: string;
  step_id: string;
  run_number: number;
  payload: P;
}

export interface StepRunParams {
  execution_id: string;
  context_id: string;
  step_id: string;
  run_number: number;
  prompt_file: string;
  input_files: { role: string; path: string }[];
  external_inputs?: { input_id: string; data: Record<string, unknown> }[];
  output_dir: string;
  output_filename: string;
  extra_params?: Record<string, unknown>;
  timeout_ms?: number;
  verifica_required?: boolean;
}

export interface PongInfo {
  active: boolean;
  active_executions: number;
  uptime_seconds: number;
  server_version: string;
}

export type EventHandler = (msg: PipelineMessage) => Promise<void> | void;

class PipelineMessageBus {
  private subClient: Redis | null = null;
  private subscribed = false;
  private handlers: Set<EventHandler> = new Set();

  // ---------- Pub side: usa il client condiviso ----------

  private get pub(): Redis {
    return getRedisClient();
  }

  // ---------- Sub side: connessione separata (richiesto da Redis) ----------

  private async ensureSubscribed(): Promise<void> {
    if (this.subscribed && this.subClient) return;
    // duplicate(): copia delle opzioni, connessione separata. Pattern raccomandato ioredis.
    this.subClient = this.pub.duplicate({ lazyConnect: false });
    this.subClient.on('error', (err) => console.error('[PipelineMessageBus] sub error:', err.message));
    await this.subClient.subscribe(EVENTS_CHANNEL);
    this.subClient.on('message', (channel, payload) => {
      if (channel !== EVENTS_CHANNEL) return;
      let msg: PipelineMessage;
      try {
        msg = JSON.parse(payload) as PipelineMessage;
      } catch (e) {
        console.error('[PipelineMessageBus] malformed event:', payload);
        return;
      }
      // Esegui tutti gli handler — non bloccarne uno se altri lanciano.
      for (const h of this.handlers) {
        Promise.resolve(h(msg)).catch((err) => {
          console.error('[PipelineMessageBus] handler error:', err);
        });
      }
    });
    this.subscribed = true;
  }

  // ---------- API pubblica ----------

  async sendStepRun(params: StepRunParams): Promise<void> {
    const msg: PipelineMessage = {
      type: 'pipeline.step.run',
      message_id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      execution_id: params.execution_id,
      context_id: params.context_id,
      step_id: params.step_id,
      run_number: params.run_number,
      payload: {
        prompt_file: params.prompt_file,
        input_files: params.input_files,
        external_inputs: params.external_inputs ?? [],
        output_dir: params.output_dir,
        output_filename: params.output_filename,
        extra_params: params.extra_params ?? {},
        timeout_ms: params.timeout_ms ?? DEFAULT_TIMEOUT_MS,
        verifica_required: params.verifica_required ?? false,
      },
    };
    await this.pub.lpush(COMMANDS_KEY, JSON.stringify(msg));
  }

  async sendStepCancel(executionId: string, reason: string, context: { context_id: string; step_id: string; run_number: number }): Promise<void> {
    const msg: PipelineMessage = {
      type: 'pipeline.step.cancel',
      message_id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      execution_id: executionId,
      context_id: context.context_id,
      step_id: context.step_id,
      run_number: context.run_number,
      payload: { reason },
    };
    await this.pub.lpush(COMMANDS_KEY, JSON.stringify(msg));
  }

  async ping(timeoutMs: number = PING_TIMEOUT_MS): Promise<PongInfo> {
    await this.ensureSubscribed();
    const pingId = crypto.randomUUID();

    const pongPromise = new Promise<PongInfo>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.handlers.delete(handler);
        reject(new Error(`Ping timeout dopo ${timeoutMs}ms`));
      }, timeoutMs);

      const handler: EventHandler = (msg) => {
        if (msg.type !== 'pipeline.step.pong') return;
        clearTimeout(timer);
        this.handlers.delete(handler);
        const p = msg.payload as Record<string, unknown>;
        resolve({
          active: true,
          active_executions: typeof p.active_executions === 'number' ? p.active_executions : 0,
          uptime_seconds: typeof p.uptime_seconds === 'number' ? p.uptime_seconds : 0,
          server_version: typeof p.server_version === 'string' ? p.server_version : 'unknown',
        });
      };
      this.handlers.add(handler);
    });

    const pingMsg: PipelineMessage = {
      type: 'pipeline.step.ping',
      message_id: pingId,
      timestamp: new Date().toISOString(),
      execution_id: 'ping',
      context_id: 'ping',
      step_id: 'ping',
      run_number: 0,
      payload: { reply_expected: true },
    };
    await this.pub.lpush(COMMANDS_KEY, JSON.stringify(pingMsg));

    return pongPromise;
  }

  onEvent(handler: EventHandler): void {
    this.handlers.add(handler);
    // Avvia il subscribe in modo lazy. Errori di subscribe loggati ma non bloccanti.
    this.ensureSubscribed().catch((err) => {
      console.error('[PipelineMessageBus] ensureSubscribed failed:', err);
    });
  }

  offEvent(handler: EventHandler): void {
    this.handlers.delete(handler);
  }
}

let busInstance: PipelineMessageBus | null = null;

export function getPipelineMessageBus(): PipelineMessageBus {
  if (!busInstance) busInstance = new PipelineMessageBus();
  return busInstance;
}
