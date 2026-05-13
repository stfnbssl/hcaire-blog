// Subscriber degli eventi del rebuild Assi Strutturali.
// Ascolta hcaire:assi:events e aggiorna AssiRebuildExecution.
//
//   - started   → status=in_esecuzione, started_at=now
//   - log       → push log_lines (buffered)
//   - completed → status=completato, completed_at=now, axes_updated=[...]
//   - failed    → status=fallito, completed_at=now, error=...
//
// NB: a differenza di letture, l'upsert su `assi_strutturali` lo fa il worker locale
// (Railway non vede il filesystem). Qui aggiorniamo solo l'execution tracking.

import AssiRebuildExecution from '../models/AssiRebuildExecution';
import { getAssiMessageBus, AssiMessage } from './assiMessageBus';
import mongoose from 'mongoose';

const WATCHDOG_INTERVAL_MS = parseInt(process.env.ASSI_WATCHDOG_INTERVAL_MS ?? String(5 * 60 * 1000), 10);
const DEFAULT_TIMEOUT_MS   = parseInt(process.env.ASSI_DEFAULT_TIMEOUT_MS ?? String(60 * 60 * 1000), 10);
const GRACE_MS             = parseInt(process.env.ASSI_WATCHDOG_GRACE_MS ?? '60000', 10);
const MAX_EXECUTION_MS     = DEFAULT_TIMEOUT_MS + GRACE_MS;

const MAX_LOG_LINES = 2000;

// ---------- log buffering ----------

interface LogBufferEntry {
  buffer: { ts: Date; text: string; level: 'info' | 'warn' | 'error' }[];
  timer: NodeJS.Timeout | null;
}
const logBuffers = new Map<string, LogBufferEntry>(); // chiave: execution_id
const FLUSH_AFTER_LINES = 20;
const FLUSH_AFTER_MS = 2000;

async function flushLogBuffer(executionId: string): Promise<void> {
  const entry = logBuffers.get(executionId);
  if (!entry || entry.buffer.length === 0) return;
  const lines = entry.buffer.splice(0);
  if (entry.timer) {
    clearTimeout(entry.timer);
    entry.timer = null;
  }
  try {
    await AssiRebuildExecution.updateOne(
      { _id: executionId },
      { $push: { log_lines: { $each: lines, $slice: -MAX_LOG_LINES } } },
    );
  } catch (e) {
    console.error('[assi-events] flush log error:', e);
  }
}

function bufferLog(executionId: string, line: { ts: Date; text: string; level: 'info' | 'warn' | 'error' }): void {
  let entry = logBuffers.get(executionId);
  if (!entry) {
    entry = { buffer: [], timer: null };
    logBuffers.set(executionId, entry);
  }
  entry.buffer.push(line);
  if (entry.buffer.length >= FLUSH_AFTER_LINES) {
    void flushLogBuffer(executionId);
    return;
  }
  if (!entry.timer) {
    entry.timer = setTimeout(() => void flushLogBuffer(executionId), FLUSH_AFTER_MS);
  }
}

// ---------- handlers ----------

function toObjectId(id: string): mongoose.Types.ObjectId | null {
  try { return new mongoose.Types.ObjectId(id); } catch { return null; }
}

async function handleStarted(msg: AssiMessage): Promise<void> {
  const id = toObjectId(msg.execution_id);
  if (!id) return;
  await AssiRebuildExecution.updateOne(
    { _id: id },
    { $set: { status: 'in_esecuzione', started_at: new Date(), error: null } },
  );
}

function handleLog(msg: AssiMessage): void {
  const p = msg.payload as Record<string, unknown>;
  const text = typeof p.text === 'string' ? p.text : '';
  const level = (p.level === 'warn' || p.level === 'error') ? p.level : 'info';
  bufferLog(msg.execution_id, { ts: new Date(), text, level });
}

async function handleCompleted(msg: AssiMessage): Promise<void> {
  await flushLogBuffer(msg.execution_id);
  const id = toObjectId(msg.execution_id);
  if (!id) return;
  const p = msg.payload as Record<string, unknown>;
  const axesUpdated = Array.isArray(p.axes_updated)
    ? (p.axes_updated as unknown[]).filter((x): x is string => typeof x === 'string')
    : [];
  await AssiRebuildExecution.updateOne(
    { _id: id },
    {
      $set: {
        status: 'completato',
        completed_at: new Date(),
        axes_updated: axesUpdated,
        error: null,
      },
    },
  );
}

async function handleFailed(msg: AssiMessage): Promise<void> {
  await flushLogBuffer(msg.execution_id);
  const id = toObjectId(msg.execution_id);
  if (!id) return;
  const p = msg.payload as Record<string, unknown>;
  const errorMessage = typeof p.error_message === 'string' ? p.error_message : 'errore sconosciuto';
  await AssiRebuildExecution.updateOne(
    { _id: id },
    { $set: { status: 'fallito', completed_at: new Date(), error: errorMessage } },
  );
}

// ---------- entry point ----------

async function dispatchEvent(msg: AssiMessage): Promise<void> {
  switch (msg.type) {
    case 'assi.rebuild.started':   return handleStarted(msg);
    case 'assi.rebuild.log':       return handleLog(msg);
    case 'assi.rebuild.completed': return handleCompleted(msg);
    case 'assi.rebuild.failed':    return handleFailed(msg);
    default: return;
  }
}

let started = false;

export function startAssiEventSubscriber(): void {
  if (started) return;
  started = true;
  const bus = getAssiMessageBus();
  bus.onEvent((msg) => {
    dispatchEvent(msg).catch((err) => console.error('[assi-events] dispatch error:', err));
  });
  console.log('[assi-events] subscriber attivo');
}

// ---------- watchdog ----------

async function watchdogTick(): Promise<void> {
  const threshold = new Date(Date.now() - MAX_EXECUTION_MS);
  const stale = await AssiRebuildExecution.find(
    {
      status: { $in: ['in_coda', 'in_esecuzione'] },
      triggered_at: { $lt: threshold },
    },
    { _id: 1 },
  ).lean();
  for (const e of stale) {
    console.warn(`[assi-watchdog] execution stale: ${e._id}`);
    await AssiRebuildExecution.updateOne(
      { _id: e._id },
      {
        $set: {
          status: 'fallito',
          completed_at: new Date(),
          error: 'Watchdog: nessun evento ricevuto oltre la soglia',
        },
      },
    );
  }
}

let watchdogTimer: NodeJS.Timeout | null = null;
export function startAssiWatchdog(): void {
  if (watchdogTimer) return;
  watchdogTimer = setInterval(() => {
    watchdogTick().catch((err) => console.error('[assi-watchdog] error:', err));
  }, WATCHDOG_INTERVAL_MS);
  console.log(`[assi-watchdog] attivo (intervallo ${WATCHDOG_INTERVAL_MS}ms, soglia ${MAX_EXECUTION_MS}ms)`);
}

export function stopAssiWatchdog(): void {
  if (watchdogTimer) {
    clearInterval(watchdogTimer);
    watchdogTimer = null;
  }
}
