// Subscriber degli eventi della pipeline Letture (parallelo a pipelineEventSubscriber).
// Ascolta hcaire:letture:events e aggiorna la collection `opere`:
//   - started   → stato step `in_esecuzione`, started_at = now, log_lines = []
//   - log       → push log_lines (buffered)
//   - completed → valida output via Ajv, legge .md (5d/5e/5f), persiste, ricalcola stato opera
//   - failed    → persiste errore
//   - cancelled → riporta lo stato a `non_avviato`
//
// Watchdog: replica la logica di pipelineEventSubscriber — execution che superano
// MAX_EXECUTION_MS senza eventi vengono marcate `errore` con motivo "timeout".

import { promises as fs } from 'fs';
import Opera, { LettureStepId, LETTURE_STEP_IDS_CON_TESTO } from '../models/Opera';
import { getLettureMessageBus, LettureMessage } from './lettureMessageBus';
import {
  stripPrefix,
  outputMdPathFor,
  isEditorialStep as _unusedIsEditorial,
} from '../utils/lettureSteps';
import { calcolaStato } from '../utils/lettureStato';
import { validateStepOutput } from './lettureSchemaValidator';

void _unusedIsEditorial; // soppresso

const WATCHDOG_INTERVAL_MS = parseInt(process.env.PIPELINE_WATCHDOG_INTERVAL_MS ?? String(5 * 60 * 1000), 10);
const DEFAULT_TIMEOUT_MS   = parseInt(process.env.PIPELINE_DEFAULT_TIMEOUT_MS ?? '600000', 10);
const GRACE_MS             = parseInt(process.env.PIPELINE_WATCHDOG_GRACE_MS ?? '60000', 10);
const MAX_EXECUTION_MS     = DEFAULT_TIMEOUT_MS + GRACE_MS;

const MAX_LOG_LINES_PER_STEP = 500;

// ---------- log buffering (stesso pattern del subscriber Sviluppo Bambino) ----------

interface LogBufferEntry {
  buffer: { ts: Date; text: string; level: 'info' | 'warn' | 'error' }[];
  timer: NodeJS.Timeout | null;
}
const logBuffers = new Map<string, LogBufferEntry>(); // chiave: `${slug}|${stepId}`
const FLUSH_AFTER_LINES = 20;
const FLUSH_AFTER_MS = 2000;

async function flushLogBuffer(key: string): Promise<void> {
  const entry = logBuffers.get(key);
  if (!entry || entry.buffer.length === 0) return;
  const lines = entry.buffer.splice(0);
  if (entry.timer) {
    clearTimeout(entry.timer);
    entry.timer = null;
  }
  const [slug, stepId] = key.split('|');
  try {
    await Opera.updateOne(
      { slug },
      {
        $push: {
          [`pipeline.${stepId}.log_lines`]: { $each: lines, $slice: -MAX_LOG_LINES_PER_STEP },
        },
      },
    );
  } catch (e) {
    console.error('[letture-events] flush log error:', e);
  }
}

function bufferLog(key: string, line: { ts: Date; text: string; level: 'info' | 'warn' | 'error' }): void {
  let entry = logBuffers.get(key);
  if (!entry) {
    entry = { buffer: [], timer: null };
    logBuffers.set(key, entry);
  }
  entry.buffer.push(line);
  if (entry.buffer.length >= FLUSH_AFTER_LINES) {
    void flushLogBuffer(key);
    return;
  }
  if (!entry.timer) {
    entry.timer = setTimeout(() => void flushLogBuffer(key), FLUSH_AFTER_MS);
  }
}

// ---------- helpers di update ----------

async function recomputeOperaStato(slug: string): Promise<void> {
  const o = await Opera.findOne({ slug }, { stato: 1, pipeline: 1 }).lean();
  if (!o) return;
  const nuovo = calcolaStato(o.pipeline as never, o.stato);
  if (nuovo !== o.stato) {
    await Opera.updateOne({ slug }, { $set: { stato: nuovo } });
  }
}

// ---------- handlers per tipo di evento ----------

async function handleStarted(msg: LettureMessage): Promise<void> {
  const slug = msg.context_id;
  const stepId = stripPrefix(msg.step_id) as LettureStepId;
  await Opera.updateOne(
    { slug },
    {
      $set: {
        [`pipeline.${stepId}.stato`]: 'in_esecuzione',
        [`pipeline.${stepId}.started_at`]: new Date(),
        [`pipeline.${stepId}.log_lines`]: [],
        [`pipeline.${stepId}.errore`]: null,
      },
    },
  );
  await recomputeOperaStato(slug);
}

function handleLog(msg: LettureMessage): void {
  const slug = msg.context_id;
  const stepId = stripPrefix(msg.step_id);
  const p = msg.payload as Record<string, unknown>;
  const text = typeof p.text === 'string' ? p.text : '';
  const level = (p.level === 'warn' || p.level === 'error') ? p.level : 'info';
  bufferLog(`${slug}|${stepId}`, { ts: new Date(), text, level });
}

async function handleCompleted(msg: LettureMessage): Promise<void> {
  const slug = msg.context_id;
  const stepId = stripPrefix(msg.step_id) as LettureStepId;
  await flushLogBuffer(`${slug}|${stepId}`);

  const p = msg.payload as Record<string, unknown>;
  const outputData = 'output_data' in p ? p.output_data : null;

  // 1. Validazione Ajv
  const validation = await validateStepOutput(stepId, outputData);
  if (!validation.valid) {
    const detail = validation.errors.slice(0, 5).join(' | ');
    await markErrore(slug, stepId, `Output non conforme allo schema: ${detail || 'errore generico'}`);
    return;
  }

  // 2. Letture .md (solo per 5d/5e/5f)
  let testo: string | null = null;
  if (LETTURE_STEP_IDS_CON_TESTO.includes(stepId)) {
    const mdPath = outputMdPathFor(slug, stepId);
    if (mdPath) {
      try {
        testo = await fs.readFile(mdPath, 'utf8');
      } catch (err) {
        await markErrore(slug, stepId, `File Markdown atteso non leggibile (${mdPath}): ${(err as Error).message}`);
        return;
      }
    }
  }

  const now = new Date();
  const update: Record<string, unknown> = {
    [`pipeline.${stepId}.stato`]: 'completato',
    [`pipeline.${stepId}.completato_il`]: now,
    [`pipeline.${stepId}.output`]: outputData,
    [`pipeline.${stepId}.errore`]: null,
  };
  if (testo !== null) update[`pipeline.${stepId}.testo`] = testo;
  if (validation.skipped) {
    bufferLog(`${slug}|${stepId}`, {
      ts: now, level: 'warn',
      text: `[validatore] schema non disponibile, validazione saltata per ${stepId}`,
    });
  }
  await Opera.updateOne({ slug }, { $set: update });
  await flushLogBuffer(`${slug}|${stepId}`);
  await recomputeOperaStato(slug);
}

async function handleFailed(msg: LettureMessage): Promise<void> {
  const slug = msg.context_id;
  const stepId = stripPrefix(msg.step_id) as LettureStepId;
  await flushLogBuffer(`${slug}|${stepId}`);
  const p = msg.payload as Record<string, unknown>;
  const errorMessage = typeof p.error_message === 'string' ? p.error_message : 'errore sconosciuto';
  await markErrore(slug, stepId, errorMessage);
}

async function handleCancelled(msg: LettureMessage): Promise<void> {
  const slug = msg.context_id;
  const stepId = stripPrefix(msg.step_id) as LettureStepId;
  await flushLogBuffer(`${slug}|${stepId}`);
  await Opera.updateOne(
    { slug },
    {
      $set: {
        [`pipeline.${stepId}.stato`]: 'non_avviato',
        [`pipeline.${stepId}.started_at`]: null,
        [`pipeline.${stepId}.errore`]: null,
      },
    },
  );
  await recomputeOperaStato(slug);
}

async function markErrore(slug: string, stepId: LettureStepId, message: string): Promise<void> {
  await Opera.updateOne(
    { slug },
    {
      $set: {
        [`pipeline.${stepId}.stato`]: 'errore',
        [`pipeline.${stepId}.completato_il`]: new Date(),
        [`pipeline.${stepId}.errore`]: message,
      },
    },
  );
  await recomputeOperaStato(slug);
}

// ---------- entry point ----------

async function dispatchEvent(msg: LettureMessage): Promise<void> {
  switch (msg.type) {
    case 'pipeline.step.started':   return handleStarted(msg);
    case 'pipeline.step.log':       return handleLog(msg);
    case 'pipeline.step.completed': return handleCompleted(msg);
    case 'pipeline.step.failed':    return handleFailed(msg);
    case 'pipeline.step.cancelled': return handleCancelled(msg);
    case 'pipeline.step.pong':      return;
    default: return;
  }
}

let started = false;

export function startLettureEventSubscriber(): void {
  if (started) return;
  started = true;
  const bus = getLettureMessageBus();
  bus.onEvent((msg) => {
    dispatchEvent(msg).catch((err) => console.error('[letture-events] dispatch error:', err));
  });
  console.log('[letture-events] subscriber attivo');
}

// ---------- watchdog ----------

async function watchdogTick(): Promise<void> {
  const threshold = new Date(Date.now() - MAX_EXECUTION_MS);

  // Cerco opere con almeno uno step in_coda/in_esecuzione e started_at oltre soglia.
  const opere = await Opera.find(
    {
      $or: [
        { 'pipeline.step_1.stato':  { $in: ['in_coda', 'in_esecuzione'] } },
        { 'pipeline.step_2.stato':  { $in: ['in_coda', 'in_esecuzione'] } },
        { 'pipeline.step_3.stato':  { $in: ['in_coda', 'in_esecuzione'] } },
        { 'pipeline.step_4.stato':  { $in: ['in_coda', 'in_esecuzione'] } },
        { 'pipeline.step_5a.stato': { $in: ['in_coda', 'in_esecuzione'] } },
        { 'pipeline.step_5b.stato': { $in: ['in_coda', 'in_esecuzione'] } },
        { 'pipeline.step_5c.stato': { $in: ['in_coda', 'in_esecuzione'] } },
        { 'pipeline.step_5d.stato': { $in: ['in_coda', 'in_esecuzione'] } },
        { 'pipeline.step_5e.stato': { $in: ['in_coda', 'in_esecuzione'] } },
        { 'pipeline.step_5f.stato': { $in: ['in_coda', 'in_esecuzione'] } },
      ],
    },
    { slug: 1, pipeline: 1 },
  ).lean();

  for (const o of opere) {
    for (const stepId of [
      'step_1', 'step_2', 'step_3', 'step_4',
      'step_5a', 'step_5b', 'step_5c', 'step_5d', 'step_5e', 'step_5f',
    ] as LettureStepId[]) {
      const s = o.pipeline?.[stepId];
      if (!s) continue;
      if (s.stato !== 'in_coda' && s.stato !== 'in_esecuzione') continue;
      const startedAt = s.started_at ? new Date(s.started_at as unknown as string) : null;
      if (!startedAt || startedAt > threshold) continue;
      console.warn(`[letture-watchdog] step stale: ${o.slug}/${stepId}`);
      await markErrore(o.slug, stepId, 'Watchdog: nessun evento ricevuto oltre la soglia');
    }
  }
}

let watchdogTimer: NodeJS.Timeout | null = null;
export function startLettureWatchdog(): void {
  if (watchdogTimer) return;
  watchdogTimer = setInterval(() => {
    watchdogTick().catch((err) => console.error('[letture-watchdog] error:', err));
  }, WATCHDOG_INTERVAL_MS);
  console.log(`[letture-watchdog] attivo (intervallo ${WATCHDOG_INTERVAL_MS}ms, soglia ${MAX_EXECUTION_MS}ms)`);
}

export function stopLettureWatchdog(): void {
  if (watchdogTimer) {
    clearInterval(watchdogTimer);
    watchdogTimer = null;
  }
}
