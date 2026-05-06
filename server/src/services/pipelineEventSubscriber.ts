// Event subscriber + watchdog (D3 §4 e §6).
// Ascolta hcaire:pipeline:events e aggiorna MongoDB (started/log/completed/failed/cancelled).
// Cron in-process ogni 5 min per executions abbandonate.

import path from 'path';
import { promises as fs } from 'fs';
import PipelineContext from '../models/PipelineContext';
import PipelineStepExecution from '../models/PipelineStepExecution';
import { getPipelineMessageBus, PipelineMessage } from './messageBus';
import { getStepConfigById } from './stepConfigService';

const PIPELINE_PUBLIC_DIR = process.env.PIPELINE_PUBLIC_DIR
  ?? path.resolve(__dirname, '..', '..', '..', 'client', 'public', 'pipeline');

const WATCHDOG_INTERVAL_MS = parseInt(process.env.PIPELINE_WATCHDOG_INTERVAL_MS ?? String(5 * 60 * 1000), 10);
const DEFAULT_TIMEOUT_MS = parseInt(process.env.PIPELINE_DEFAULT_TIMEOUT_MS ?? '600000', 10);
const GRACE_MS = parseInt(process.env.PIPELINE_WATCHDOG_GRACE_MS ?? '60000', 10);
const MAX_EXECUTION_MS = DEFAULT_TIMEOUT_MS + GRACE_MS;

// ---------- log throttling (D3 §4.2) ----------

interface LogBufferEntry {
  buffer: { ts: Date; text: string; level: 'info' | 'warn' | 'error' }[];
  timer: NodeJS.Timeout | null;
}
const logBuffers = new Map<string, LogBufferEntry>();
const FLUSH_AFTER_LINES = 20;
const FLUSH_AFTER_MS = 2000;

async function flushLogBuffer(executionId: string) {
  const entry = logBuffers.get(executionId);
  if (!entry || entry.buffer.length === 0) return;
  const lines = entry.buffer.splice(0);
  if (entry.timer) {
    clearTimeout(entry.timer);
    entry.timer = null;
  }
  try {
    await PipelineStepExecution.updateOne(
      { _id: executionId },
      { $push: { log_lines: { $each: lines } } },
    );
  } catch (e) {
    console.error('[pipeline-events] flush log error:', e);
  }
}

function bufferLog(executionId: string, line: { ts: Date; text: string; level: 'info' | 'warn' | 'error' }) {
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

// ---------- helpers di update ----------

async function copyOutputToPublic(absSourceFile: string, outputFileRel: string): Promise<void> {
  const dst = path.join(PIPELINE_PUBLIC_DIR, outputFileRel);
  if (path.resolve(absSourceFile) === path.resolve(dst)) return;
  try {
    await fs.mkdir(path.dirname(dst), { recursive: true });
    await fs.copyFile(absSourceFile, dst);
  } catch (e) {
    console.error('[pipeline-events] copy output failed:', e);
  }
}

// v3.0 (D7): rimossa `applyOverrideStep6b`. Nel modello F3 ridotto non esiste
// più f3_step_6b né la nozione di "override del dispositivo dopo verifica 6b":
// il dispositivo è prodotto e corretto entro f3_step_3 (Stress test e correzione)
// e non subisce più sostituzioni ex post. La nozione di canonical_device del context,
// se servirà, viene aggiornata con un'unica scrittura alla verifica di f3_step_4.

// ---------- handler eventi ----------

async function handleStarted(msg: PipelineMessage) {
  const now = new Date();
  await PipelineStepExecution.updateOne(
    { _id: msg.execution_id },
    {
      $set: {
        status: 'in_esecuzione',
        started_at: now,
        cowork_session_id: (msg.payload as Record<string, unknown>).cowork_session_id ?? null,
      },
    },
  );
  await PipelineContext.updateOne(
    { context_id: msg.context_id },
    {
      $set: {
        [`step_states.${msg.step_id}.status`]: 'in_esecuzione',
        [`step_states.${msg.step_id}.updated_at`]: now,
      },
    },
  );
}

function handleLog(msg: PipelineMessage) {
  const p = msg.payload as Record<string, unknown>;
  const text = typeof p.text === 'string' ? p.text : '';
  const level = (p.level === 'warn' || p.level === 'error') ? p.level : 'info';
  bufferLog(msg.execution_id, { ts: new Date(), text, level });
}

async function handleCompleted(msg: PipelineMessage) {
  await flushLogBuffer(msg.execution_id);
  const p = msg.payload as Record<string, unknown>;
  // Source of truth = step config (D1). Il payload del server locale è un fallback
  // (non ci si fida: se la pipeline è stata lanciata prima dei fix, il flag potrebbe essere sbagliato).
  const stepCfg = await getStepConfigById(msg.step_id);
  const verificaRequired = stepCfg?.verifica === true || Boolean(p.verifica_required);
  const newStatus = verificaRequired ? 'in_verifica' : 'completato';
  const outputFileRel = typeof p.output_file_relative === 'string' ? p.output_file_relative : null;
  const outputFileAbs = typeof p.output_file === 'string' ? p.output_file : null;
  const now = new Date();

  if (outputFileAbs && outputFileRel) {
    await copyOutputToPublic(outputFileAbs, outputFileRel);
  }

  // Embed dell'output JSON parsato così il frontend può consultarlo via API
  // senza dover raggiungere il filesystem locale dell'utente.
  const outputData = 'output_data' in p ? p.output_data : null;
  await PipelineStepExecution.updateOne(
    { _id: msg.execution_id },
    { $set: { status: newStatus, completed_at: now, output_file: outputFileRel, output_data: outputData } },
  );

  const ctxUpdate: Record<string, unknown> = {
    [`step_states.${msg.step_id}.status`]: newStatus,
    [`step_states.${msg.step_id}.output_file`]: outputFileRel,
    [`step_states.${msg.step_id}.updated_at`]: now,
  };

  // Trigger F2 → F3: quando f2_step_6 (ultimo step della sequenza lineare v2.3+:
  // 2 → 2a → 3 → 4 → 4b → 5 → 6) raggiunge terminal, tutti i sette step F2 sono
  // per costruzione in stato terminale. Il pending_decision viene incluso nello
  // stesso $set della transizione di status: questo garantisce che il polling
  // del frontend, alla prima fetch dopo il completamento, veda atomicamente sia
  // lo step `completato` sia il banner di decisione — senza la finestra di race
  // che richiedeva un reload manuale.
  if (msg.step_id === 'f2_step_6' && newStatus === 'completato') {
    ctxUpdate.pending_decision = await buildF2ToF3Decision(msg.context_id, 'f2_step_6', now);
  }

  await PipelineContext.updateOne(
    { context_id: msg.context_id },
    {
      $set: ctxUpdate,
      ...(newStatus === 'completato'
        ? { $addToSet: { steps_completed: msg.step_id }, $pull: { steps_in_progress: msg.step_id } }
        : { $pull: { steps_in_progress: msg.step_id } }),
    },
  );

  // v3.0 (D7): rimosso il branch su f3_step_6b → applyOverrideStep6b.
}

// Costruisce il payload pending_decision per la transizione F2 → F3 leggendo i
// theme_id dall'ultima run verificata di f2_step_5 (è lì che vivono le output
// families con i candidati). Esposta come funzione pura affinché chiamanti
// distinti (handleCompleted in questo file, skipStep in pipelineController)
// possano includerla nella stessa $set Mongo che porta lo step a terminal,
// evitando race window di lettura tra i due update.
export async function buildF2ToF3Decision(
  contextId: string,
  stepFrom: string,
  now: Date,
): Promise<Record<string, unknown>> {
  const step5Exec = await PipelineStepExecution.findOne({
    context_id: contextId,
    step_id: 'f2_step_5',
    status: 'verificato',
  }).sort({ run_number: -1 });
  const out = step5Exec?.output_data as { results?: { theme_id?: string }[] } | null | undefined;
  const options = (out?.results ?? [])
    .filter((r) => typeof r?.theme_id === 'string' && r.theme_id)
    .map((r) => ({ theme_id: r.theme_id as string, label: r.theme_id as string }));
  return {
    type: 'f2_to_f3_tema_selection',
    step_from: stepFrom,
    step_to: 'f3_step_1',
    description: 'Seleziona il tema della output family da portare in F3 per costruire il dispositivo configurazionale.',
    options,
    created_at: now,
    decided_at: null,
    decided_by: null,
    decision: null,
  };
}

async function handleFailed(msg: PipelineMessage) {
  await flushLogBuffer(msg.execution_id);
  const p = msg.payload as Record<string, unknown>;
  const now = new Date();
  await PipelineStepExecution.updateOne(
    { _id: msg.execution_id },
    {
      $set: {
        status: 'fallito',
        completed_at: now,
        error: {
          message: typeof p.error_message === 'string' ? p.error_message : 'errore sconosciuto',
          source: p.error_source === 'cowork' || p.error_source === 'sistema' || p.error_source === 'timeout'
            ? p.error_source : 'sistema',
          detail: typeof p.error_detail === 'string' ? p.error_detail : null,
        },
      },
    },
  );
  await PipelineContext.updateOne(
    { context_id: msg.context_id },
    {
      $set: {
        [`step_states.${msg.step_id}.status`]: 'fallito',
        [`step_states.${msg.step_id}.updated_at`]: now,
      },
      $addToSet: { steps_failed: msg.step_id },
      $pull: { steps_in_progress: msg.step_id },
    },
  );
}

async function handleCancelled(msg: PipelineMessage) {
  await flushLogBuffer(msg.execution_id);
  const now = new Date();
  await PipelineStepExecution.updateOne(
    { _id: msg.execution_id },
    { $set: { status: 'non_avviato', completed_at: now } },
  );
  await PipelineContext.updateOne(
    { context_id: msg.context_id },
    {
      $set: {
        [`step_states.${msg.step_id}.status`]: 'non_avviato',
        [`step_states.${msg.step_id}.updated_at`]: now,
      },
      $pull: { steps_in_progress: msg.step_id },
    },
  );
}

// ---------- event entry point ----------

async function dispatchEvent(msg: PipelineMessage) {
  switch (msg.type) {
    case 'pipeline.step.started': return handleStarted(msg);
    case 'pipeline.step.log': return handleLog(msg);
    case 'pipeline.step.completed': return handleCompleted(msg);
    case 'pipeline.step.failed': return handleFailed(msg);
    case 'pipeline.step.cancelled': return handleCancelled(msg);
    case 'pipeline.step.pong': return; // gestito da ping()
    default: return;
  }
}

let started = false;

export function startPipelineEventSubscriber(): void {
  if (started) return;
  started = true;
  const bus = getPipelineMessageBus();
  bus.onEvent((msg) => {
    dispatchEvent(msg).catch((err) => console.error('[pipeline-events] dispatch error:', err));
  });
  console.log('[pipeline-events] subscriber attivo');
}

// ---------- watchdog (D3 §6) ----------

async function watchdogTick() {
  const threshold = new Date(Date.now() - MAX_EXECUTION_MS);
  const stale = await PipelineStepExecution.find({
    status: { $in: ['in_coda', 'in_esecuzione'] },
    $or: [
      { started_at: { $lt: threshold } },
      { started_at: null, created_at: { $lt: threshold } },
    ],
  }).lean();

  for (const exec of stale) {
    console.warn(`[pipeline-watchdog] execution stale: ${exec._id} (${exec.context_id}/${exec.step_id})`);
    await PipelineStepExecution.updateOne(
      { _id: exec._id },
      {
        $set: {
          status: 'fallito',
          completed_at: new Date(),
          error: {
            message: 'Watchdog: nessun evento ricevuto oltre la soglia',
            source: 'timeout',
            detail: null,
          },
        },
      },
    );
    await PipelineContext.updateOne(
      { context_id: exec.context_id },
      {
        $set: {
          [`step_states.${exec.step_id}.status`]: 'fallito',
          [`step_states.${exec.step_id}.updated_at`]: new Date(),
        },
        $addToSet: { steps_failed: exec.step_id },
        $pull: { steps_in_progress: exec.step_id },
      },
    );
  }
}

let watchdogTimer: NodeJS.Timeout | null = null;
export function startPipelineWatchdog(): void {
  if (watchdogTimer) return;
  watchdogTimer = setInterval(() => {
    watchdogTick().catch((err) => console.error('[pipeline-watchdog] error:', err));
  }, WATCHDOG_INTERVAL_MS);
  console.log(`[pipeline-watchdog] attivo (intervallo ${WATCHDOG_INTERVAL_MS}ms, soglia ${MAX_EXECUTION_MS}ms)`);
}

export function stopPipelineWatchdog(): void {
  if (watchdogTimer) {
    clearInterval(watchdogTimer);
    watchdogTimer = null;
  }
}
