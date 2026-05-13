// Bus Redis dedicato al rebuild degli Assi Strutturali (canali separati da letture/produzioni).
// Backend → server locale: LPUSH su hcaire:assi:commands.
// Server locale → backend: PUBLISH su hcaire:assi:events.
//
// Differenze rispetto a lettureMessageBus:
//   - un solo tipo di comando (assi.rebuild): operazione singola, no step multipli
//   - nessuna struttura context_id/step_id/run_number — solo execution_id
//   - upsert su Mongo lo fa il worker locale (Railway non vede i file): il server
//     riceve direttamente axes_updated nell'evento completed

import crypto from 'crypto';
import Redis from 'ioredis';
import { getRedisClient } from '../config/redis';

const COMMANDS_KEY  = process.env.REDIS_ASSI_COMMANDS_KEY  ?? 'hcaire:assi:commands';
const EVENTS_CHANNEL = process.env.REDIS_ASSI_EVENTS_CHANNEL ?? 'hcaire:assi:events';

export type AssiCommandType = 'assi.rebuild';

export type AssiEventType =
  | 'assi.rebuild.started'
  | 'assi.rebuild.log'
  | 'assi.rebuild.completed'
  | 'assi.rebuild.failed';

export interface AssiMessage<P = Record<string, unknown>> {
  type: AssiCommandType | AssiEventType;
  message_id: string;
  timestamp: string;
  execution_id: string;
  payload: P;
}

export type AssiEventHandler = (msg: AssiMessage) => Promise<void> | void;

class AssiMessageBus {
  private subClient: Redis | null = null;
  private subscribed = false;
  private handlers: Set<AssiEventHandler> = new Set();

  private get pub(): Redis {
    return getRedisClient();
  }

  private async ensureSubscribed(): Promise<void> {
    if (this.subscribed && this.subClient) return;
    this.subClient = this.pub.duplicate({ lazyConnect: false });
    this.subClient.on('error', (err) => console.error('[AssiMessageBus] sub error:', err.message));
    await this.subClient.subscribe(EVENTS_CHANNEL);
    this.subClient.on('message', (channel, payload) => {
      if (channel !== EVENTS_CHANNEL) return;
      let msg: AssiMessage;
      try {
        msg = JSON.parse(payload) as AssiMessage;
      } catch {
        console.error('[AssiMessageBus] malformed event:', payload);
        return;
      }
      for (const h of this.handlers) {
        Promise.resolve(h(msg)).catch((err) => {
          console.error('[AssiMessageBus] handler error:', err);
        });
      }
    });
    this.subscribed = true;
  }

  async sendRebuild(executionId: string): Promise<void> {
    const msg: AssiMessage = {
      type: 'assi.rebuild',
      message_id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      execution_id: executionId,
      payload: {},
    };
    await this.pub.lpush(COMMANDS_KEY, JSON.stringify(msg));
  }

  onEvent(handler: AssiEventHandler): void {
    this.handlers.add(handler);
    this.ensureSubscribed().catch((err) => {
      console.error('[AssiMessageBus] ensureSubscribed failed:', err);
    });
  }

  offEvent(handler: AssiEventHandler): void {
    this.handlers.delete(handler);
  }
}

let busInstance: AssiMessageBus | null = null;

export function getAssiMessageBus(): AssiMessageBus {
  if (!busInstance) busInstance = new AssiMessageBus();
  return busInstance;
}
