// Bus Redis dedicato alla pipeline Letture (canali separati da quelli di Sviluppo Bambino).
// Backend → server locale: LPUSH su hcaire:letture:commands.
// Server locale → backend: PUBLISH su hcaire:letture:events.
//
// Struttura dei messaggi identica a `messageBus.ts` per riutilizzare convenzioni e tipi.

import crypto from 'crypto';
import Redis from 'ioredis';
import { getRedisClient } from '../config/redis';

const COMMANDS_KEY  = process.env.REDIS_LETTURE_COMMANDS_KEY  ?? 'hcaire:letture:commands';
const EVENTS_CHANNEL = process.env.REDIS_LETTURE_EVENTS_CHANNEL ?? 'hcaire:letture:events';
const DEFAULT_TIMEOUT_MS = parseInt(process.env.PIPELINE_DEFAULT_TIMEOUT_MS ?? '300000', 10);
const PING_TIMEOUT_MS = 5000;

export type LettureCommandType =
  | 'pipeline.step.run'
  | 'pipeline.step.cancel'
  | 'pipeline.step.ping';

export type LettureEventType =
  | 'pipeline.step.started'
  | 'pipeline.step.log'
  | 'pipeline.step.completed'
  | 'pipeline.step.failed'
  | 'pipeline.step.cancelled'
  | 'pipeline.step.pong';

export interface LettureMessage<P = Record<string, unknown>> {
  type: LettureCommandType | LettureEventType;
  message_id: string;
  timestamp: string;
  execution_id: string;
  context_id: string;     // slug dell'opera
  step_id: string;         // wire id: `lett_step_X`
  run_number: number;
  payload: P;
}

export interface LettureStepRunParams {
  execution_id: string;
  context_id: string;
  step_id: string;          // wire id (`lett_step_X`)
  run_number: number;
  input_files: { role: string; path: string }[];
  external_inputs?: { input_id: string; data: Record<string, unknown> }[];
  output_dir: string;
  output_filename: string;
  output_md_filename?: string | null;
  extra_params?: Record<string, unknown>;
  timeout_ms?: number;
}

export interface LetturePongInfo {
  active: boolean;
  active_executions: number;
  uptime_seconds: number;
  server_version: string;
}

export type LettureEventHandler = (msg: LettureMessage) => Promise<void> | void;

class LettureMessageBus {
  private subClient: Redis | null = null;
  private subscribed = false;
  private handlers: Set<LettureEventHandler> = new Set();

  private get pub(): Redis {
    return getRedisClient();
  }

  private async ensureSubscribed(): Promise<void> {
    if (this.subscribed && this.subClient) return;
    this.subClient = this.pub.duplicate({ lazyConnect: false });
    this.subClient.on('error', (err) => console.error('[LettureMessageBus] sub error:', err.message));
    await this.subClient.subscribe(EVENTS_CHANNEL);
    this.subClient.on('message', (channel, payload) => {
      if (channel !== EVENTS_CHANNEL) return;
      let msg: LettureMessage;
      try {
        msg = JSON.parse(payload) as LettureMessage;
      } catch {
        console.error('[LettureMessageBus] malformed event:', payload);
        return;
      }
      for (const h of this.handlers) {
        Promise.resolve(h(msg)).catch((err) => {
          console.error('[LettureMessageBus] handler error:', err);
        });
      }
    });
    this.subscribed = true;
  }

  async sendStepRun(params: LettureStepRunParams): Promise<void> {
    const msg: LettureMessage = {
      type: 'pipeline.step.run',
      message_id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      execution_id: params.execution_id,
      context_id: params.context_id,
      step_id: params.step_id,
      run_number: params.run_number,
      payload: {
        input_files: params.input_files,
        external_inputs: params.external_inputs ?? [],
        output_dir: params.output_dir,
        output_filename: params.output_filename,
        output_md_filename: params.output_md_filename ?? null,
        extra_params: params.extra_params ?? {},
        timeout_ms: params.timeout_ms ?? DEFAULT_TIMEOUT_MS,
      },
    };
    await this.pub.lpush(COMMANDS_KEY, JSON.stringify(msg));
  }

  async sendStepCancel(
    executionId: string,
    reason: string,
    context: { context_id: string; step_id: string; run_number: number },
  ): Promise<void> {
    const msg: LettureMessage = {
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

  async ping(timeoutMs: number = PING_TIMEOUT_MS): Promise<LetturePongInfo> {
    await this.ensureSubscribed();
    const pingId = crypto.randomUUID();

    const pongPromise = new Promise<LetturePongInfo>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.handlers.delete(handler);
        reject(new Error(`Ping letture timeout dopo ${timeoutMs}ms`));
      }, timeoutMs);

      const handler: LettureEventHandler = (msg) => {
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

    const pingMsg: LettureMessage = {
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

  onEvent(handler: LettureEventHandler): void {
    this.handlers.add(handler);
    this.ensureSubscribed().catch((err) => {
      console.error('[LettureMessageBus] ensureSubscribed failed:', err);
    });
  }

  offEvent(handler: LettureEventHandler): void {
    this.handlers.delete(handler);
  }
}

let busInstance: LettureMessageBus | null = null;

export function getLettureMessageBus(): LettureMessageBus {
  if (!busInstance) busInstance = new LettureMessageBus();
  return busInstance;
}
