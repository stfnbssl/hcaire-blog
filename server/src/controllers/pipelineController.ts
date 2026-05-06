import path from 'path';
import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import mongoose from 'mongoose';
import PipelineContext, { ITemaAmbito } from '../models/PipelineContext';
import PipelineStepExecution from '../models/PipelineStepExecution';
import PipelineExternalInput from '../models/PipelineExternalInput';
import { getPipelineIndex } from '../services/pipelineService';
import { loadStepConfig, getStepConfigById } from '../services/stepConfigService';
import { evaluateStepEnablement } from '../services/stepEnablement';
import { getPipelineMessageBus } from '../services/messageBus';
import { buildF2ToF3Decision } from '../services/pipelineEventSubscriber';

const PIPELINE_PUBLIC_DIR = process.env.PIPELINE_PUBLIC_DIR
  ?? path.resolve(__dirname, '..', '..', '..', 'client', 'public', 'pipeline');

// ---------- envelope ----------

function ok(res: Response, status: number, data: unknown) {
  return res.status(status).json({ ok: true, data });
}

function err(res: Response, status: number, code: string, message: string, detail: unknown = null) {
  return res.status(status).json({ ok: false, error: { code, message, detail } });
}

// ---------- GET /api/pipeline/index ----------

export async function getIndex(_req: Request, res: Response) {
  try {
    const index = await getPipelineIndex();
    return ok(res, 200, index);
  } catch (e) {
    console.error('[pipeline] getIndex error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel recupero dell\'indice', null);
  }
}

// ---------- GET /api/pipeline/step-config ----------

export async function getStepConfig(_req: Request, res: Response) {
  try {
    const config = await loadStepConfig();
    return ok(res, 200, { steps: config.steps });
  } catch (e) {
    console.error('[pipeline] getStepConfig error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel caricamento della step config', null);
  }
}

// ---------- GET /api/pipeline/temi/:temaId ----------

export async function getTema(req: Request, res: Response) {
  const { temaId } = req.params;
  try {
    const context = await PipelineContext.findOne({ context_id: temaId, context_type: 'tema' });
    if (!context) {
      return err(res, 404, 'CONTEXT_NOT_FOUND', `Tema "${temaId}" non trovato`);
    }
    const [stepConfigDoc, externalInputs] = await Promise.all([
      loadStepConfig(),
      PipelineExternalInput.find({ context_id: temaId, is_superseded: false }).lean(),
    ]);
    const stepConfig = stepConfigDoc.steps.filter((s) => s.phase === 'F3');
    return ok(res, 200, {
      context,
      step_config: stepConfig,
      external_inputs: externalInputs,
    });
  } catch (e) {
    console.error('[pipeline] getTema error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel recupero del tema', null);
  }
}

// ---------- GET /api/pipeline/ricerche/:ricercaId ----------

export async function getRicerca(req: Request, res: Response) {
  const { ricercaId } = req.params;
  try {
    const context = await PipelineContext.findOne({ context_id: ricercaId, context_type: 'ricerca' });
    if (!context) {
      return err(res, 404, 'CONTEXT_NOT_FOUND', `Ricerca "${ricercaId}" non trovata`);
    }
    const [stepConfigDoc, externalInputs] = await Promise.all([
      loadStepConfig(),
      PipelineExternalInput.find({ context_id: ricercaId, is_superseded: false }).lean(),
    ]);
    const stepConfig = stepConfigDoc.steps.filter((s) => s.phase === 'F2');
    return ok(res, 200, {
      context,
      step_config: stepConfig,
      external_inputs: externalInputs,
    });
  } catch (e) {
    console.error('[pipeline] getRicerca error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel recupero della ricerca', null);
  }
}

// ---------- GET /api/pipeline/executions/:executionId/output ----------

export async function getExecutionOutput(req: Request, res: Response) {
  const { executionId } = req.params;
  try {
    if (!mongoose.isValidObjectId(executionId)) {
      return err(res, 404, 'EXECUTION_NOT_FOUND', 'execution_id non valido');
    }
    const exec = await PipelineStepExecution.findById(executionId, {
      output_data: 1, output_file: 1, step_id: 1, context_id: 1, run_number: 1, status: 1, completed_at: 1,
    }).lean();
    if (!exec) return err(res, 404, 'EXECUTION_NOT_FOUND', 'Execution non trovata');
    if (exec.output_data === null || exec.output_data === undefined) {
      return err(res, 404, 'OUTPUT_NOT_AVAILABLE',
        'Output non ancora disponibile per questa execution. Possibile esecuzione precedente alla feature di mirroring.');
    }
    return ok(res, 200, {
      execution_id: String(exec._id),
      step_id: exec.step_id,
      context_id: exec.context_id,
      run_number: exec.run_number,
      status: exec.status,
      completed_at: exec.completed_at,
      output_file: exec.output_file,
      output_data: exec.output_data,
    });
  } catch (e) {
    console.error('[pipeline] getExecutionOutput error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel recupero output');
  }
}

// ---------- GET /api/pipeline/contexts/:contextId/steps/:stepId/output ----------
// Ritorna l'output_data dell'ultima execution dello step per un context (tema o ricerca).
// Sostituisce la lettura diretta dei file statici in client/public/pipeline/...:
// Mongo è la sorgente di verità.

export async function getContextStepOutput(req: Request, res: Response) {
  const { contextId, stepId } = req.params;
  try {
    const ctx = await PipelineContext.findOne(
      { context_id: contextId },
      { step_states: 1 },
    ).lean();
    if (!ctx) return err(res, 404, 'CONTEXT_NOT_FOUND', `Context "${contextId}" non trovato`);

    const states = (ctx.step_states ?? {}) as Record<string, { last_execution_id?: unknown; output_file?: string | null }>;
    const state = states[stepId];
    if (!state || !state.last_execution_id) {
      return err(res, 404, 'OUTPUT_NOT_AVAILABLE', `Nessuna execution per lo step "${stepId}"`);
    }
    const exec = await PipelineStepExecution.findById(state.last_execution_id, {
      output_data: 1, output_file: 1, step_id: 1, context_id: 1, run_number: 1, status: 1, completed_at: 1,
    }).lean();
    if (!exec || exec.output_data === null || exec.output_data === undefined) {
      return err(res, 404, 'OUTPUT_NOT_AVAILABLE',
        'Output non disponibile per questa execution. Possibile esecuzione precedente al mirroring su Mongo.');
    }
    return ok(res, 200, {
      execution_id: String(exec._id),
      step_id: exec.step_id,
      context_id: exec.context_id,
      run_number: exec.run_number,
      status: exec.status,
      completed_at: exec.completed_at,
      output_file: exec.output_file,
      output_data: exec.output_data,
    });
  } catch (e) {
    console.error('[pipeline] getContextStepOutput error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel recupero output');
  }
}

// ---------- GET /api/pipeline/temi/:temaId/steps/:stepId/history ----------

export async function getStepHistory(req: Request, res: Response) {
  const { temaId, stepId } = req.params;
  try {
    const executions = await PipelineStepExecution.find(
      { context_id: temaId, step_id: stepId },
    ).sort({ run_number: -1 }).lean();
    return ok(res, 200, { executions });
  } catch (e) {
    console.error('[pipeline] getStepHistory error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel recupero dello storico', null);
  }
}

// ============================================================================
// Endpoint di orchestrazione (admin) — D4 §3
// ============================================================================

// Slug kebab-case dal label del context: lowercase, diacritici rimossi (NFD), non-alfanumerici
// collassati in `-`, trim ai bordi. Serve per i template che includono `{label}` (f3_step_9/10),
// in modo che il filename arrivi a Cowork già completamente risolto e identico ad ogni run.
function slugifyLabel(label: string): string {
  return label
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveOutputPath(
  template: string,
  contextId: string,
  runNumber: number,
  contextType: 'tema' | 'ricerca',
  contextLabel: string,
): string {
  const idKey = contextType === 'tema' ? '{tema_id}' : '{ricerca_id}';
  const labelSlug = slugifyLabel(contextLabel);
  return template
    .split(idKey).join(contextId)
    .split('{label}').join(labelSlug)
    .split('{N+1}').join(String(runNumber + 1))
    .split('{N}').join(String(runNumber));
}

function resolveAbsPath(relPath: string): string {
  return path.join(PIPELINE_PUBLIC_DIR, relPath);
}

interface ExecPlan {
  inputFiles: { role: string; path: string }[];
  externalInputs: { input_id: string; data: Record<string, unknown> }[];
  outputFilenameRel: string;
  outputDirAbs: string;
  outputFilenameOnly: string;
  promptFile: string;
}

async function buildExecutionPlan(
  contextDoc: InstanceType<typeof PipelineContext>,
  stepConfig: NonNullable<Awaited<ReturnType<typeof getStepConfigById>>>,
  runNumber: number,
): Promise<ExecPlan> {
  const stepStates = (contextDoc.step_states ?? {}) as Record<string, { status: string; output_file: string | null }>;

  let pipelineInputs = stepConfig.inputs_pipeline ?? [];
  if (stepConfig.id === 'f3_step_9') {
    const step8Status = stepStates.f3_step_8?.status;
    pipelineInputs = step8Status === 'saltato'
      ? (stepConfig.inputs_pipeline_skip_8 ?? [])
      : (stepConfig.inputs_pipeline_standard ?? []);
  }

  // Path RELATIVI: il backend non conosce il filesystem del server locale (Railway ↔ macchina utente).
  // Il server locale risolve questi path rispetto a COWORK_PIPELINE_DIR / COWORK_PIPELINE_INPUTS_DIR.
  const inputFiles: { role: string; path: string }[] = [];
  for (const dep of pipelineInputs) {
    if (!dep.required) continue;
    let resolvedStepId = dep.step;
    if (dep.step === 'f3_step_3_or_6c') {
      resolvedStepId = stepStates.f3_step_6c?.output_file ? 'f3_step_6c' : 'f3_step_3';
    }
    const file = stepStates[resolvedStepId]?.output_file;
    if (file) inputFiles.push({ role: dep.role, path: file });
  }

  if (stepConfig.inputs_dispositivo_sorgente && contextDoc.dispositivo_sorgente) {
    inputFiles.push({ role: 'dispositivo-sorgente', path: contextDoc.dispositivo_sorgente.file });
  }

  // Gli input esterni viaggiano come DATI inline nel payload del comando, non come file paths.
  // Il file su disco (postStepInput.save_to_file) è scritto sul FS del backend (Railway) e
  // NON è raggiungibile da Cowork sulla macchina locale: spingere il path produrrebbe ENOENT.
  // Il PromptComposer mostra i data sotto "INPUT FORNITI DAL RICERCATORE".
  const externalInputDocs = await PipelineExternalInput.find({
    context_id: contextDoc.context_id,
    step_id: stepConfig.id,
    is_superseded: false,
  }).lean();
  const externalInputs = externalInputDocs.map((inp) => ({
    input_id: inp.input_id,
    data: (inp.data ?? {}) as Record<string, unknown>,
  }));

  for (const struct of stepConfig.inputs_strutturali ?? []) {
    inputFiles.push({ role: 'strutturale', path: `strutturali/${struct}` });
  }

  const outputRel = resolveOutputPath(
    stepConfig.output_path_template,
    contextDoc.context_id,
    runNumber,
    contextDoc.context_type as 'tema' | 'ricerca',
    contextDoc.label ?? contextDoc.context_id,
  );
  // outputDir e outputFilename sono espressi come "outputDirRel" (path relativo) — il server
  // locale risolverà rispetto a COWORK_PIPELINE_DIR.
  return {
    inputFiles,
    externalInputs,
    outputFilenameRel: outputRel,
    outputDirAbs: path.posix.dirname(outputRel),
    outputFilenameOnly: path.posix.basename(outputRel),
    promptFile: `${stepConfig.id}/CLAUDE.md`,
  };
}

// POST /api/pipeline/temi/:temaId/steps/:stepId/run
export async function runStep(req: Request, res: Response) {
  const { temaId, stepId } = req.params;
  const { extra_params, timeout_ms } = (req.body ?? {}) as { extra_params?: Record<string, unknown>; timeout_ms?: number };

  try {
    const contextDoc = await PipelineContext.findOne({ context_id: temaId });
    if (!contextDoc) return err(res, 404, 'CONTEXT_NOT_FOUND', `Context "${temaId}" non trovato`);

    const stepConfig = await getStepConfigById(stepId);
    if (!stepConfig) return err(res, 404, 'STEP_NOT_FOUND', `Step "${stepId}" non valido`);

    const stepState = (contextDoc.step_states as Record<string, { status: string }> | undefined)?.[stepId];
    if (stepState && (stepState.status === 'in_coda' || stepState.status === 'in_esecuzione')) {
      return err(res, 409, 'STEP_ALREADY_RUNNING', `Step "${stepId}" è già ${stepState.status}`);
    }

    const provided = await PipelineExternalInput.find(
      { context_id: temaId, step_id: stepId, is_superseded: false },
      { input_id: 1 },
    ).lean();
    const providedSet = new Set(provided.map((p) => p.input_id));

    const enablement = evaluateStepEnablement(
      contextDoc as unknown as Parameters<typeof evaluateStepEnablement>[0],
      stepConfig,
      providedSet,
    );
    if (!enablement.enabled) {
      const dependencies = enablement.blocking_reasons.filter((r) => r.type === 'dependency');
      const missingInputs = enablement.blocking_reasons.filter((r) => r.type === 'missing_input');
      const decisions = enablement.blocking_reasons.filter((r) => r.type === 'pending_decision');
      if (dependencies.length > 0) {
        return err(res, 422, 'STEP_DEPENDENCIES_UNMET', `Dipendenze non soddisfatte per ${stepId}`, {
          missing: dependencies, missing_inputs: missingInputs, pending_decisions: decisions,
        });
      }
      if (missingInputs.length > 0) {
        return err(res, 422, 'STEP_INPUTS_MISSING', `Input esterni mancanti per ${stepId}`, { missing: missingInputs });
      }
      return err(res, 422, 'STEP_BLOCKED', `Step ${stepId} bloccato`, { reasons: enablement.blocking_reasons });
    }

    const lastExec = await PipelineStepExecution
      .findOne({ context_id: temaId, step_id: stepId })
      .sort({ run_number: -1 })
      .lean();
    const runNumber = (lastExec?.run_number ?? 0) + 1;

    const plan = await buildExecutionPlan(contextDoc, stepConfig, runNumber);

    const executionDoc = await PipelineStepExecution.create({
      context_type: contextDoc.context_type,
      context_id: contextDoc.context_id,
      step_id: stepId,
      run_number: runNumber,
      status: 'in_coda',
      created_at: new Date(),
      inputs: {
        pipeline: [],
        esterni: provided.map((p) => ({
          input_id: p.input_id,
          external_input_doc_id: new mongoose.Types.ObjectId(String(p._id)),
          file: null,
        })),
        strutturali: stepConfig.inputs_strutturali ?? [],
        dispositivo_sorgente: contextDoc.dispositivo_sorgente
          ? { tema_id: contextDoc.dispositivo_sorgente.tema_id, file: contextDoc.dispositivo_sorgente.file }
          : null,
      },
      verifica_required: stepConfig.verifica === true,
    });

    await PipelineContext.updateOne(
      { context_id: temaId },
      {
        $set: {
          [`step_states.${stepId}.status`]: 'in_coda',
          [`step_states.${stepId}.current_run`]: runNumber,
          [`step_states.${stepId}.last_execution_id`]: executionDoc._id,
          [`step_states.${stepId}.updated_at`]: new Date(),
        },
        $addToSet: { steps_in_progress: stepId },
        $pull: { steps_failed: stepId },
      },
    );

    const bus = getPipelineMessageBus();
    try {
      await bus.sendStepRun({
        execution_id: String(executionDoc._id),
        context_id: contextDoc.context_id,
        step_id: stepId,
        run_number: runNumber,
        prompt_file: plan.promptFile,
        input_files: plan.inputFiles,
        external_inputs: plan.externalInputs,
        output_dir: plan.outputDirAbs,
        output_filename: plan.outputFilenameOnly,
        extra_params: extra_params ?? {},
        timeout_ms,
        verifica_required: stepConfig.verifica === true,
      });
    } catch (busErr) {
      console.error('[pipeline] sendStepRun error:', busErr);
    }

    return ok(res, 202, {
      execution_id: String(executionDoc._id),
      run_number: runNumber,
      status: 'in_coda',
    });
  } catch (e) {
    console.error('[pipeline] runStep error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel lancio dello step');
  }
}

// DELETE /api/pipeline/executions/:executionId
export async function cancelExecution(req: Request, res: Response) {
  const { executionId } = req.params;
  const { reason } = (req.body ?? {}) as { reason?: string };
  try {
    if (!mongoose.isValidObjectId(executionId)) {
      return err(res, 404, 'EXECUTION_NOT_FOUND', 'execution_id non valido');
    }
    const execDoc = await PipelineStepExecution.findById(executionId);
    if (!execDoc) return err(res, 404, 'EXECUTION_NOT_FOUND', 'Execution non trovata');
    if (execDoc.status !== 'in_coda' && execDoc.status !== 'in_esecuzione') {
      return err(res, 409, 'EXECUTION_NOT_RUNNING', `Execution in stato "${execDoc.status}", non cancellabile`);
    }

    const wasInQueue = execDoc.status === 'in_coda';
    const now = new Date();

    // Tenta sempre di mandare il cancel al server locale (per il caso in_esecuzione e per
    // pulire eventuali active executions). Se Redis è giù il LPUSH fallisce: lo logghiamo
    // ma proseguiamo con l'aggiornamento diretto Mongo (caso in_coda), così il frontend vede
    // subito lo stato corretto.
    try {
      const bus = getPipelineMessageBus();
      await bus.sendStepCancel(String(execDoc._id), reason ?? 'cancellazione richiesta', {
        context_id: execDoc.context_id,
        step_id: execDoc.step_id,
        run_number: execDoc.run_number,
      });
    } catch (busErr) {
      console.warn('[pipeline] cancelExecution: LPUSH cancel fallito:', (busErr as Error).message);
    }

    // Per execution ancora in_coda: aggiorna direttamente Mongo a 'non_avviato'.
    // Non c'è bisogno di aspettare l'evento dal server locale: il messaggio di run è ancora
    // in coda, e — quando il server locale lo leggerà — il proprio _handleStepRun farà
    // verifica che lo status non sia più 'in_coda' (vedi PipelineCommandHandler) e scarterà.
    if (wasInQueue) {
      execDoc.status = 'non_avviato';
      execDoc.completed_at = now;
      await execDoc.save();
      await PipelineContext.updateOne(
        { context_id: execDoc.context_id },
        {
          $set: {
            [`step_states.${execDoc.step_id}.status`]: 'non_avviato',
            [`step_states.${execDoc.step_id}.updated_at`]: now,
          },
          $pull: { steps_in_progress: execDoc.step_id },
        },
      );
    }

    return ok(res, 202, {
      execution_id: String(execDoc._id),
      status: wasInQueue ? 'cancellazione_eseguita' : 'cancellazione_inviata',
    });
  } catch (e) {
    console.error('[pipeline] cancelExecution error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nella cancellazione');
  }
}

async function computeUnlockedSteps(contextId: string): Promise<string[]> {
  const ctxDoc = await PipelineContext.findOne({ context_id: contextId });
  const cfgDoc = await loadStepConfig();
  if (!ctxDoc) return [];
  const unlocked: string[] = [];
  for (const candidate of cfgDoc.steps) {
    const candProvided = await PipelineExternalInput.find(
      { context_id: contextId, step_id: candidate.id, is_superseded: false },
      { input_id: 1 },
    ).lean();
    const r = evaluateStepEnablement(
      ctxDoc as unknown as Parameters<typeof evaluateStepEnablement>[0],
      candidate,
      new Set(candProvided.map((p) => p.input_id)),
    );
    const candStatus = (ctxDoc.step_states as Record<string, { status: string }> | undefined)?.[candidate.id]?.status ?? 'non_avviato';
    if (r.enabled && (candStatus === 'non_avviato' || candStatus === 'attende_input')) {
      unlocked.push(candidate.id);
    }
  }
  return unlocked;
}

// POST /api/pipeline/executions/:executionId/verify
export async function verifyExecution(req: Request, res: Response) {
  const { executionId } = req.params;
  const auth = getAuth(req);
  const userId = auth.userId ?? null;
  const { outcome, notes, feedback } = (req.body ?? {}) as {
    outcome?: 'approvato' | 'richiede_correzione' | 'richiede_6c';
    notes?: string;
    feedback?: string;
  };

  try {
    if (!mongoose.isValidObjectId(executionId)) {
      return err(res, 404, 'EXECUTION_NOT_FOUND', 'execution_id non valido');
    }
    if (!outcome || !['approvato', 'richiede_correzione', 'richiede_6c'].includes(outcome)) {
      return err(res, 400, 'INVALID_OUTCOME', 'outcome deve essere approvato | richiede_correzione | richiede_6c');
    }

    const execDoc = await PipelineStepExecution.findById(executionId);
    if (!execDoc) return err(res, 404, 'EXECUTION_NOT_FOUND', 'Execution non trovata');
    if (execDoc.status !== 'in_verifica') {
      return err(res, 409, 'EXECUTION_NOT_IN_VERIFICA', `Execution in stato "${execDoc.status}", non verificabile`);
    }

    const newStatus = outcome === 'richiede_correzione' ? 'richiede_correzione' : 'verificato';
    const now = new Date();

    execDoc.status = newStatus;
    execDoc.verified_at = now;
    execDoc.verified_by = userId;
    execDoc.verifica_outcome = outcome;
    execDoc.verifica_notes = notes ?? null;
    execDoc.verifica_feedback = feedback ?? null;
    await execDoc.save();

    await PipelineContext.updateOne(
      { context_id: execDoc.context_id },
      {
        $set: {
          [`step_states.${execDoc.step_id}.status`]: newStatus,
          [`step_states.${execDoc.step_id}.verifica_outcome`]: outcome,
          [`step_states.${execDoc.step_id}.updated_at`]: now,
        },
        ...(newStatus === 'verificato'
          ? { $addToSet: { steps_completed: execDoc.step_id }, $pull: { steps_in_progress: execDoc.step_id, steps_failed: execDoc.step_id } }
          : { $addToSet: { steps_failed: execDoc.step_id }, $pull: { steps_in_progress: execDoc.step_id } }),
      },
    );

    if (outcome === 'richiede_6c') {
      await PipelineContext.updateOne(
        { context_id: execDoc.context_id },
        {
          $set: {
            pending_decision: {
              type: 'step7_context_selection',
              step_from: execDoc.step_id,
              step_to: 'f3_step_6c',
              description: 'La verifica di step 6b richiede integrazione strutturale. Confermare esecuzione di step 6c.',
              options: null,
              created_at: now,
              decided_at: null,
              decided_by: null,
              decision: null,
            },
          },
        },
      );
    }

    // Trigger F2 → F3 spostato in pipelineEventSubscriber.ts:populateF2ToF3Decision —
    // ora si attiva al completamento di f2_step_6 (ultimo step della sequenza lineare
    // v2.3+ 2 → 2a → 3 → 4 → 4b → 5 → 6), non più a f2_step_5 verificato. Garanzia: a
    // quel punto tutti e sette gli step F2 sono in stato terminale (eseguiti o saltati).

    const unlocked = newStatus === 'verificato' ? await computeUnlockedSteps(execDoc.context_id) : [];

    return ok(res, 200, { execution_id: String(execDoc._id), new_status: newStatus, unlocked_steps: unlocked });
  } catch (e) {
    console.error('[pipeline] verifyExecution error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nella verifica');
  }
}

// ============================================================================
// Endpoint input esterni — D4 §4
// ============================================================================

// GET /api/pipeline/temi/:temaId/steps/:stepId/inputs
export async function getStepInputs(req: Request, res: Response) {
  const { temaId, stepId } = req.params;
  try {
    const stepConfig = await getStepConfigById(stepId);
    if (!stepConfig) return err(res, 404, 'STEP_NOT_FOUND', `Step "${stepId}" non valido`);

    const inputs = await PipelineExternalInput.find({
      context_id: temaId, step_id: stepId, is_superseded: false,
    }).lean();

    const requiredIds = (stepConfig.inputs_esterni ?? [])
      .filter((i) => i.type === 'esterno_obbligatorio')
      .map((i) => i.id);
    const providedIds = new Set(inputs.map((i) => i.input_id));
    const allRequiredProvided = requiredIds.every((id) => providedIds.has(id));

    return ok(res, 200, {
      inputs,
      step_config_inputs: stepConfig.inputs_esterni ?? [],
      all_required_provided: allRequiredProvided,
    });
  } catch (e) {
    console.error('[pipeline] getStepInputs error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel recupero degli input');
  }
}

// POST /api/pipeline/temi/:temaId/steps/:stepId/inputs
export async function postStepInput(req: Request, res: Response) {
  const { temaId, stepId } = req.params;
  const auth = getAuth(req);
  const userId = auth.userId ?? 'unknown';
  const { input_id, data, save_to_file } = (req.body ?? {}) as {
    input_id?: string;
    data?: Record<string, unknown>;
    save_to_file?: boolean;
  };

  try {
    if (!input_id || typeof input_id !== 'string') {
      return err(res, 400, 'INVALID_INPUT_ID', 'Campo "input_id" obbligatorio');
    }
    if (!data || typeof data !== 'object') {
      return err(res, 400, 'INVALID_DATA', 'Campo "data" obbligatorio (object)');
    }

    const stepConfig = await getStepConfigById(stepId);
    if (!stepConfig) return err(res, 404, 'STEP_NOT_FOUND', `Step "${stepId}" non valido`);

    const inputCfg = (stepConfig.inputs_esterni ?? []).find((i) => i.id === input_id);
    if (!inputCfg) {
      return err(res, 400, 'INVALID_INPUT_ID', `input_id "${input_id}" non valido per step "${stepId}"`);
    }

    const contextDoc = await PipelineContext.findOne({ context_id: temaId });
    if (!contextDoc) return err(res, 404, 'CONTEXT_NOT_FOUND', `Context "${temaId}" non trovato`);

    // Marca superseded l'eventuale precedente
    const newDocId = new mongoose.Types.ObjectId();
    await PipelineExternalInput.updateMany(
      { context_id: temaId, step_id: stepId, input_id, is_superseded: false },
      { $set: { is_superseded: true, superseded_by: newDocId } },
    );

    // Salvataggio opzionale su disco
    let filePath: string | null = null;
    const shouldSaveFile = save_to_file !== false; // default true
    if (shouldSaveFile) {
      const folderRel = `inputs/${contextDoc.context_type === 'tema' ? 'temi' : 'ricerche'}/${temaId}`;
      const fileName = `${stepId.replace(/_/g, '-')}-${input_id.replace(/_/g, '-')}.json`;
      const folderAbs = resolveAbsPath(folderRel);
      const fileAbs = path.join(folderAbs, fileName);
      try {
        const fs = await import('fs/promises');
        await fs.mkdir(folderAbs, { recursive: true });
        await fs.writeFile(fileAbs, JSON.stringify(data, null, 2), 'utf8');
        filePath = `${folderRel}/${fileName}`;
      } catch (writeErr) {
        console.warn('[pipeline] write file fallita:', writeErr);
      }
    }

    await PipelineExternalInput.create({
      _id: newDocId,
      context_type: contextDoc.context_type,
      context_id: temaId,
      step_id: stepId,
      input_id,
      label: inputCfg.label,
      provided_by: userId,
      provided_at: new Date(),
      data,
      file_path: filePath,
      is_superseded: false,
      superseded_by: null,
    });

    // Calcola se ora tutti gli input obbligatori sono presenti
    const stillProvided = await PipelineExternalInput.find(
      { context_id: temaId, step_id: stepId, is_superseded: false },
      { input_id: 1 },
    ).lean();
    const providedSet = new Set(stillProvided.map((p) => p.input_id));
    const requiredIds = (stepConfig.inputs_esterni ?? [])
      .filter((i) => i.type === 'esterno_obbligatorio')
      .map((i) => i.id);
    const allRequiredProvided = requiredIds.every((id) => providedSet.has(id));

    return ok(res, 201, {
      input_id,
      external_input_doc_id: String(newDocId),
      file_path: filePath,
      all_required_provided: allRequiredProvided,
    });
  } catch (e) {
    console.error('[pipeline] postStepInput error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel salvataggio input');
  }
}

// DELETE /api/pipeline/external-inputs/:inputDocId
export async function deleteExternalInput(req: Request, res: Response) {
  const { inputDocId } = req.params;
  try {
    if (!mongoose.isValidObjectId(inputDocId)) {
      return err(res, 404, 'EXTERNAL_INPUT_NOT_FOUND', 'inputDocId non valido');
    }
    const inp = await PipelineExternalInput.findById(inputDocId);
    if (!inp) return err(res, 404, 'EXTERNAL_INPUT_NOT_FOUND', 'External input non trovato');
    if (inp.is_superseded) {
      return ok(res, 200, { input_doc_id: inputDocId, superseded: true });
    }
    inp.is_superseded = true;
    await inp.save();
    return ok(res, 200, { input_doc_id: inputDocId, superseded: true });
  } catch (e) {
    console.error('[pipeline] deleteExternalInput error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nell\'invalidazione input');
  }
}

// ============================================================================
// Endpoint decisioni umane — D4 §5
// ============================================================================

// GET /api/pipeline/temi/:temaId/pending-decision
export async function getTemaPendingDecision(req: Request, res: Response) {
  const { temaId } = req.params;
  try {
    const ctx = await PipelineContext.findOne({ context_id: temaId, context_type: 'tema' }, { pending_decision: 1 });
    if (!ctx) return err(res, 404, 'CONTEXT_NOT_FOUND', `Tema "${temaId}" non trovato`);
    return ok(res, 200, { decision: ctx.pending_decision ?? null });
  } catch (e) {
    console.error('[pipeline] getTemaPendingDecision error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel recupero decisione');
  }
}

// GET /api/pipeline/ricerche/:ricercaId/pending-decision
export async function getRicercaPendingDecision(req: Request, res: Response) {
  const { ricercaId } = req.params;
  try {
    const ctx = await PipelineContext.findOne({ context_id: ricercaId, context_type: 'ricerca' }, { pending_decision: 1 });
    if (!ctx) return err(res, 404, 'CONTEXT_NOT_FOUND', `Ricerca "${ricercaId}" non trovata`);
    return ok(res, 200, { decision: ctx.pending_decision ?? null });
  } catch (e) {
    console.error('[pipeline] getRicercaPendingDecision error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel recupero decisione');
  }
}

// POST /api/pipeline/ricerche/:ricercaId/decisions — F2→F3 tema selection
export async function postRicercaDecision(req: Request, res: Response) {
  const { ricercaId } = req.params;
  const auth = getAuth(req);
  const userId = auth.userId ?? 'unknown';
  const body = (req.body ?? {}) as {
    decision_type?: 'f2_to_f3_tema_selection';
    selected_theme?: { theme_id: string; label: string; from_step: string; from_file: string };
    dispositivo_sorgente?: { tema_id: string; file: string; device_id: string };
  };

  try {
    if (body.decision_type !== 'f2_to_f3_tema_selection') {
      return err(res, 400, 'INVALID_DECISION_TYPE', 'decision_type deve essere f2_to_f3_tema_selection');
    }
    if (!body.selected_theme?.theme_id || !body.selected_theme.label) {
      return err(res, 400, 'INVALID_SELECTED_THEME', 'selected_theme.theme_id e label obbligatori');
    }

    const ricercaCtx = await PipelineContext.findOne({ context_id: ricercaId, context_type: 'ricerca' });
    if (!ricercaCtx) return err(res, 404, 'CONTEXT_NOT_FOUND', `Ricerca "${ricercaId}" non trovata`);

    if (!ricercaCtx.pending_decision || ricercaCtx.pending_decision.type !== 'f2_to_f3_tema_selection') {
      return err(res, 409, 'DECISION_NOT_PENDING', 'Nessuna decisione F2→F3 pendente per questa ricerca');
    }

    const newTemaId = body.selected_theme.theme_id;
    const exists = await PipelineContext.findOne({ context_id: newTemaId });
    if (exists) {
      return err(res, 409, 'CONTEXT_ALREADY_EXISTS', `Context "${newTemaId}" già esistente`);
    }

    const now = new Date();
    // Snapshot degli step F2 della ricerca nel nuovo tema: l'enablement di f3_step_1
    // richiede f2_step_5 verificato e buildExecutionPlan legge l'output_file degli step F2
    // dagli step_states del tema. Senza questa copia il tema parte "F2 vuoto" e step 1 non parte.
    const ricercaStepStates = (ricercaCtx.step_states ?? {}) as Record<string, unknown>;
    const inheritedF2States: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(ricercaStepStates)) {
      if (k.startsWith('f2_')) inheritedF2States[k] = v;
    }
    const ricercaStepsCompleted = (ricercaCtx.steps_completed ?? []).filter((s) => s.startsWith('f2_'));

    const newTema = await PipelineContext.create({
      context_type: 'tema',
      context_id: newTemaId,
      label: body.selected_theme.label,
      theme_id: body.selected_theme.theme_id,
      ricerca_origine: ricercaId,
      dispositivo_sorgente: body.dispositivo_sorgente ?? null,
      step_states: inheritedF2States,
      pending_decision: null,
      steps_completed: ricercaStepsCompleted,
      steps_in_progress: [],
      steps_failed: [],
      robustezza: null,
      correzioni_residue: 0,
      has_revisioni: false,
    });

    // Risolvi decisione sulla ricerca
    await PipelineContext.updateOne(
      { context_id: ricercaId },
      {
        $set: {
          pending_decision: null,
          'pending_decision_history': {
            type: 'f2_to_f3_tema_selection',
            decided_at: now,
            decided_by: userId,
            decision: body.selected_theme,
          },
        },
      },
    );

    return ok(res, 201, { created_tema_id: newTemaId, tema_context: newTema });
  } catch (e) {
    console.error('[pipeline] postRicercaDecision error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nella registrazione decisione');
  }
}

// ---- Tema-Ambiti (bridge F2 → F3 con relazione 1→n) ------------------------
// Una ricerca F2 produce un tema (output-tipo-vuoto, passaporto). Il tema può
// essere applicato a più ambiti operativi (clinico/educativo/...). Ogni ambito
// genera una pipeline F3 indipendente. Gli ambiti sono embedded sul context
// `ricerca`, sotto la chiave del theme_id.

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function isValidAmbitoData(d: unknown): d is { target_domain: string; target_subdomain: string; age_range: string; setting: string; observer_profile: string; notes?: string } {
  if (!d || typeof d !== 'object') return false;
  const o = d as Record<string, unknown>;
  const validDomains = ['clinico', 'educativo', 'formazione', 'politiche'];
  return (
    typeof o.target_domain === 'string' && validDomains.includes(o.target_domain) &&
    typeof o.target_subdomain === 'string' && o.target_subdomain.trim().length > 0 &&
    typeof o.age_range === 'string' && o.age_range.trim().length > 0 &&
    typeof o.setting === 'string' && o.setting.trim().length > 0 &&
    typeof o.observer_profile === 'string' && o.observer_profile.trim().length > 0 &&
    (o.notes === undefined || typeof o.notes === 'string')
  );
}

async function loadRicercaForAmbiti(ricercaId: string) {
  const ctx = await PipelineContext.findOne({ context_id: ricercaId, context_type: 'ricerca' });
  return ctx;
}

// GET /api/pipeline/ricerche/:ricercaId/temi/:themeId/ambiti
export async function listTemaAmbiti(req: Request, res: Response) {
  const { ricercaId, themeId } = req.params;
  try {
    const ctx = await loadRicercaForAmbiti(ricercaId);
    if (!ctx) return err(res, 404, 'CONTEXT_NOT_FOUND', `Ricerca "${ricercaId}" non trovata`);
    const ambiti = ((ctx.tema_ambiti ?? {}) as Record<string, unknown[]>)[themeId] ?? [];
    return ok(res, 200, { ricerca_id: ricercaId, theme_id: themeId, ambiti });
  } catch (e) {
    console.error('[pipeline] listTemaAmbiti error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore lettura ambiti');
  }
}

// POST /api/pipeline/ricerche/:ricercaId/temi/:themeId/ambiti
export async function createTemaAmbito(req: Request, res: Response) {
  const { ricercaId, themeId } = req.params;
  const auth = getAuth(req);
  const userId = auth.userId ?? 'unknown';
  const body = (req.body ?? {}) as { ambito_id?: string; label?: string; data?: unknown };
  try {
    if (!body.ambito_id || !SLUG_RE.test(body.ambito_id)) {
      return err(res, 400, 'INVALID_AMBITO_ID', 'ambito_id obbligatorio in formato kebab-case');
    }
    if (!body.label || body.label.trim().length === 0) {
      return err(res, 400, 'INVALID_LABEL', 'label obbligatoria');
    }
    if (!isValidAmbitoData(body.data)) {
      return err(res, 400, 'INVALID_DATA', 'data deve contenere target_domain, target_subdomain, age_range, setting, observer_profile');
    }
    const ctx = await loadRicercaForAmbiti(ricercaId);
    if (!ctx) return err(res, 404, 'CONTEXT_NOT_FOUND', `Ricerca "${ricercaId}" non trovata`);

    const ambitiAll = (ctx.tema_ambiti ?? {}) as Record<string, Array<{ ambito_id: string }>>;
    const existing = ambitiAll[themeId] ?? [];
    if (existing.some((a) => a.ambito_id === body.ambito_id)) {
      return err(res, 409, 'AMBITO_ALREADY_EXISTS', `ambito_id "${body.ambito_id}" già presente per il tema`);
    }

    const newAmbito = {
      ambito_id: body.ambito_id,
      label: body.label.trim(),
      data: body.data,
      created_at: new Date(),
      created_by: userId,
      promoted_to_f3: false,
      promoted_tema_id: null,
    };
    const updated = { ...ambitiAll, [themeId]: [...existing, newAmbito] };
    await PipelineContext.updateOne({ context_id: ricercaId }, { $set: { tema_ambiti: updated } });
    return ok(res, 201, { ambito: newAmbito });
  } catch (e) {
    console.error('[pipeline] createTemaAmbito error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore creazione ambito');
  }
}

// PUT /api/pipeline/ricerche/:ricercaId/temi/:themeId/ambiti/:ambitoId
export async function updateTemaAmbito(req: Request, res: Response) {
  const { ricercaId, themeId, ambitoId } = req.params;
  const body = (req.body ?? {}) as { label?: string; data?: unknown };
  try {
    const ctx = await loadRicercaForAmbiti(ricercaId);
    if (!ctx) return err(res, 404, 'CONTEXT_NOT_FOUND', `Ricerca "${ricercaId}" non trovata`);
    const ambitiAll = (ctx.tema_ambiti ?? {}) as Record<string, ITemaAmbito[]>;
    const list = ambitiAll[themeId] ?? [];
    const idx = list.findIndex((a) => a.ambito_id === ambitoId);
    if (idx < 0) return err(res, 404, 'AMBITO_NOT_FOUND', `ambito "${ambitoId}" non trovato`);
    if (list[idx].promoted_to_f3) {
      return err(res, 409, 'AMBITO_ALREADY_PROMOTED', 'ambito già promosso a F3, non modificabile');
    }
    const updatedAmbito: ITemaAmbito = { ...list[idx] };
    if (typeof body.label === 'string' && body.label.trim().length > 0) updatedAmbito.label = body.label.trim();
    if (body.data !== undefined) {
      if (!isValidAmbitoData(body.data)) return err(res, 400, 'INVALID_DATA', 'data non valida');
      updatedAmbito.data = body.data as ITemaAmbito['data'];
    }
    const newList = [...list]; newList[idx] = updatedAmbito;
    await PipelineContext.updateOne(
      { context_id: ricercaId },
      { $set: { tema_ambiti: { ...ambitiAll, [themeId]: newList } } },
    );
    return ok(res, 200, { ambito: updatedAmbito });
  } catch (e) {
    console.error('[pipeline] updateTemaAmbito error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore aggiornamento ambito');
  }
}

// DELETE /api/pipeline/ricerche/:ricercaId/temi/:themeId/ambiti/:ambitoId
export async function deleteTemaAmbito(req: Request, res: Response) {
  const { ricercaId, themeId, ambitoId } = req.params;
  try {
    const ctx = await loadRicercaForAmbiti(ricercaId);
    if (!ctx) return err(res, 404, 'CONTEXT_NOT_FOUND', `Ricerca "${ricercaId}" non trovata`);
    const ambitiAll = (ctx.tema_ambiti ?? {}) as Record<string, Array<{ ambito_id: string; promoted_to_f3: boolean }>>;
    const list = ambitiAll[themeId] ?? [];
    const target = list.find((a) => a.ambito_id === ambitoId);
    if (!target) return err(res, 404, 'AMBITO_NOT_FOUND', `ambito "${ambitoId}" non trovato`);
    if (target.promoted_to_f3) {
      return err(res, 409, 'AMBITO_ALREADY_PROMOTED', 'ambito già promosso a F3, non eliminabile');
    }
    const newList = list.filter((a) => a.ambito_id !== ambitoId);
    await PipelineContext.updateOne(
      { context_id: ricercaId },
      { $set: { tema_ambiti: { ...ambitiAll, [themeId]: newList } } },
    );
    return ok(res, 200, { deleted: ambitoId });
  } catch (e) {
    console.error('[pipeline] deleteTemaAmbito error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore eliminazione ambito');
  }
}

// POST /api/pipeline/ricerche/:ricercaId/temi/:themeId/ambiti/:ambitoId/promote
// Crea il tema F3 (tema_id = `${theme}--${ambito}`), eredita gli step_states F2
// dalla ricerca, e pre-popola PipelineExternalInput di f3_step_7 con i dati
// dell'ambito (così il form di step 7 sarà già compilato). NON azzera il
// pending_decision: l'utente può tornare per promuovere altri ambiti.
export async function promoteTemaAmbito(req: Request, res: Response) {
  const { ricercaId, themeId, ambitoId } = req.params;
  const auth = getAuth(req);
  const userId = auth.userId ?? 'unknown';
  try {
    const ctx = await loadRicercaForAmbiti(ricercaId);
    if (!ctx) return err(res, 404, 'CONTEXT_NOT_FOUND', `Ricerca "${ricercaId}" non trovata`);
    const ambitiAll = (ctx.tema_ambiti ?? {}) as Record<string, ITemaAmbito[]>;
    const list = ambitiAll[themeId] ?? [];
    const idx = list.findIndex((a) => a.ambito_id === ambitoId);
    if (idx < 0) return err(res, 404, 'AMBITO_NOT_FOUND', `ambito "${ambitoId}" non trovato`);
    const ambito = list[idx];
    if (ambito.promoted_to_f3 && ambito.promoted_tema_id) {
      return ok(res, 200, { already_promoted: true, tema_id: ambito.promoted_tema_id });
    }

    // Slug del theme: il themeId ricevuto è già in kebab-case (proviene dall'output
    // di f2_step_5/6); lo manteniamo verbatim. Composizione: `theme--ambito`.
    if (!SLUG_RE.test(themeId)) {
      return err(res, 400, 'INVALID_THEME_ID', `theme_id "${themeId}" non in formato kebab-case`);
    }
    const newTemaId = `${themeId}--${ambitoId}`;
    const exists = await PipelineContext.findOne({ context_id: newTemaId });
    if (exists) {
      return err(res, 409, 'CONTEXT_ALREADY_EXISTS', `Context "${newTemaId}" già esistente`);
    }

    // Eredita step_states F2 (vedi postRicercaDecision per la motivazione: l'enablement
    // di f3_step_1 richiede f2_step_5 verificato e buildExecutionPlan legge gli output_file
    // F2 dagli step_states del tema).
    const ricercaStepStates = (ctx.step_states ?? {}) as Record<string, unknown>;
    const inheritedF2States: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(ricercaStepStates)) {
      if (k.startsWith('f2_')) inheritedF2States[k] = v;
    }
    const ricercaStepsCompleted = (ctx.steps_completed ?? []).filter((s) => s.startsWith('f2_'));

    const newTema = await PipelineContext.create({
      context_type: 'tema',
      context_id: newTemaId,
      label: `${(ctx.label ?? themeId)} — ${ambito.label}`,
      theme_id: themeId,
      ricerca_origine: ricercaId,
      dispositivo_sorgente: null,
      step_states: inheritedF2States,
      pending_decision: null,
      tema_ambiti: {},
      steps_completed: ricercaStepsCompleted,
      steps_in_progress: [],
      steps_failed: [],
      robustezza: null,
      correzioni_residue: 0,
      has_revisioni: false,
    });

    // Pre-popola PipelineExternalInput per f3_step_7 con i dati dell'ambito.
    // Salviamo anche il file su disco per coerenza con postStepInput.
    const folderRel = `inputs/temi/${newTemaId}`;
    const fileName = `f3-step-7-contesto-ambito.json`;
    const folderAbs = resolveAbsPath(folderRel);
    const fileAbs = path.join(folderAbs, fileName);
    let filePath: string | null = null;
    try {
      const fs = await import('fs/promises');
      await fs.mkdir(folderAbs, { recursive: true });
      await fs.writeFile(fileAbs, JSON.stringify(ambito.data, null, 2), 'utf8');
      filePath = `${folderRel}/${fileName}`;
    } catch (writeErr) {
      console.warn('[pipeline] write ambito file fallita:', writeErr);
    }

    await PipelineExternalInput.create({
      context_type: 'tema',
      context_id: newTemaId,
      step_id: 'f3_step_7',
      input_id: 'contesto_ambito',
      label: 'Contesto/ambito target',
      provided_by: userId,
      provided_at: new Date(),
      data: ambito.data,
      file_path: filePath,
      is_superseded: false,
      superseded_by: null,
    });

    // Marca l'ambito come promosso (mutazione della lista embedded sulla ricerca).
    const updatedAmbito = { ...ambito, promoted_to_f3: true, promoted_tema_id: newTemaId };
    const newList = [...list]; newList[idx] = updatedAmbito;
    await PipelineContext.updateOne(
      { context_id: ricercaId },
      { $set: { tema_ambiti: { ...ambitiAll, [themeId]: newList } } },
    );

    return ok(res, 201, { created_tema_id: newTemaId, tema_context: newTema, ambito: updatedAmbito });
  } catch (e) {
    console.error('[pipeline] promoteTemaAmbito error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore promozione ambito');
  }
}

// POST /api/pipeline/ricerche/:ricercaId/decisions/dismiss — chiude esplicitamente
// il pending_decision F2→F3. Da chiamare quando il ricercatore considera concluse
// le promozioni di ambiti per la ricerca.
export async function dismissRicercaDecision(req: Request, res: Response) {
  const { ricercaId } = req.params;
  const auth = getAuth(req);
  const userId = auth.userId ?? 'unknown';
  try {
    const ctx = await loadRicercaForAmbiti(ricercaId);
    if (!ctx) return err(res, 404, 'CONTEXT_NOT_FOUND', `Ricerca "${ricercaId}" non trovata`);
    if (!ctx.pending_decision) {
      return ok(res, 200, { already_dismissed: true });
    }
    const now = new Date();
    await PipelineContext.updateOne(
      { context_id: ricercaId },
      {
        $set: {
          pending_decision: null,
          'pending_decision_history': {
            type: ctx.pending_decision.type,
            decided_at: now,
            decided_by: userId,
            decision: { dismissed: true },
          },
        },
      },
    );
    return ok(res, 200, { dismissed: true });
  } catch (e) {
    console.error('[pipeline] dismissRicercaDecision error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore chiusura decisione');
  }
}

// POST /api/pipeline/temi/:temaId/decisions — conferma decisione su tema
export async function postTemaDecision(req: Request, res: Response) {
  const { temaId } = req.params;
  const auth = getAuth(req);
  const userId = auth.userId ?? 'unknown';
  const body = (req.body ?? {}) as {
    decision_type?: 'step7_context_selection';
    confirmed?: boolean;
    notes?: string;
  };

  try {
    if (body.decision_type !== 'step7_context_selection') {
      return err(res, 400, 'INVALID_DECISION_TYPE', 'decision_type deve essere step7_context_selection');
    }
    if (body.confirmed !== true) {
      return err(res, 400, 'NOT_CONFIRMED', 'confirmed deve essere true');
    }

    const ctx = await PipelineContext.findOne({ context_id: temaId, context_type: 'tema' });
    if (!ctx) return err(res, 404, 'CONTEXT_NOT_FOUND', `Tema "${temaId}" non trovato`);

    if (!ctx.pending_decision) {
      return err(res, 409, 'DECISION_NOT_PENDING', 'Nessuna decisione pendente');
    }

    const now = new Date();
    await PipelineContext.updateOne(
      { context_id: temaId },
      {
        $set: {
          pending_decision: null,
          'pending_decision_history': {
            type: ctx.pending_decision.type,
            decided_at: now,
            decided_by: userId,
            decision: { confirmed: true, notes: body.notes ?? null },
          },
        },
      },
    );

    // Verifica se lo step7 è ora lanciabile
    let stepNowLaunchable = false;
    const stepCfg = await getStepConfigById('f3_step_7');
    if (stepCfg) {
      const reloaded = await PipelineContext.findOne({ context_id: temaId });
      if (reloaded) {
        const provided = await PipelineExternalInput.find(
          { context_id: temaId, step_id: 'f3_step_7', is_superseded: false },
          { input_id: 1 },
        ).lean();
        const r = evaluateStepEnablement(
          reloaded as unknown as Parameters<typeof evaluateStepEnablement>[0],
          stepCfg,
          new Set(provided.map((p) => p.input_id)),
        );
        stepNowLaunchable = r.enabled;
      }
    }

    return ok(res, 200, { decision_resolved: true, step_now_launchable: stepNowLaunchable });
  } catch (e) {
    console.error('[pipeline] postTemaDecision error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nella registrazione decisione');
  }
}

// ============================================================================
// Endpoint contestuali — D4 §7
// ============================================================================

// POST /api/pipeline/ricerche
export async function createRicerca(req: Request, res: Response) {
  const { ricerca_id, label } = (req.body ?? {}) as { ricerca_id?: string; label?: string };
  try {
    if (!ricerca_id || typeof ricerca_id !== 'string') {
      return err(res, 400, 'INVALID_RICERCA_ID', 'ricerca_id obbligatorio (string)');
    }
    if (!label || typeof label !== 'string') {
      return err(res, 400, 'INVALID_LABEL', 'label obbligatorio (string)');
    }
    if (!/^[a-z0-9-]+$/.test(ricerca_id)) {
      return err(res, 400, 'INVALID_RICERCA_ID_FORMAT', 'ricerca_id deve essere kebab-case (a-z, 0-9, -)');
    }
    const exists = await PipelineContext.findOne({ context_id: ricerca_id });
    if (exists) {
      return err(res, 409, 'CONTEXT_ALREADY_EXISTS', `Context "${ricerca_id}" già esistente`);
    }
    const created = await PipelineContext.create({
      context_type: 'ricerca',
      context_id: ricerca_id,
      label,
      theme_id: null,
      ricerca_origine: null,
      dispositivo_sorgente: null,
      step_states: {},
      pending_decision: null,
      steps_completed: [],
      steps_in_progress: [],
      steps_failed: [],
      robustezza: null,
      correzioni_residue: 0,
      has_revisioni: false,
    });
    return ok(res, 201, { context: created });
  } catch (e) {
    console.error('[pipeline] createRicerca error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nella creazione ricerca');
  }
}

// GET /api/pipeline/system/status
export async function getSystemStatus(_req: Request, res: Response) {
  try {
    const bus = getPipelineMessageBus();
    const pong = await bus.ping(5000);
    return ok(res, 200, {
      cowork_server: {
        active: pong.active,
        active_executions: pong.active_executions,
        uptime_seconds: pong.uptime_seconds,
        server_version: pong.server_version,
      },
    });
  } catch (e) {
    console.error('[pipeline] getSystemStatus ping error:', (e as Error).message);
    return err(res, 503, 'COWORK_UNAVAILABLE', 'Server Cowork non raggiungibile. Verificare che il server locale sia in esecuzione.');
  }
}

// ============================================================================
// SSE — log streaming (D4 §6)
// ============================================================================

// GET /api/pipeline/executions/:executionId/logs
export async function streamExecutionLogs(req: Request, res: Response) {
  const { executionId } = req.params;

  if (!mongoose.isValidObjectId(executionId)) {
    return err(res, 404, 'EXECUTION_NOT_FOUND', 'execution_id non valido');
  }
  const execDoc = await PipelineStepExecution.findById(executionId);
  if (!execDoc) return err(res, 404, 'EXECUTION_NOT_FOUND', 'Execution non trovata');

  // SSE headers
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  const send = (event: string, data: unknown) => {
    if (res.writableEnded) return;
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Burst iniziale: log storici
  for (const line of execDoc.log_lines ?? []) {
    send('log', { ts: line.ts, text: line.text, level: line.level });
  }

  // Se già terminata: status + done immediato. Per fallito, allega anche l'errore
  // persistito sul doc execution così il viewer può mostrarlo dopo un reload.
  const TERMINAL = ['completato', 'in_verifica', 'verificato', 'richiede_correzione', 'saltato', 'fallito'];
  if (TERMINAL.includes(execDoc.status)) {
    const errPayload = execDoc.error ? {
      message: execDoc.error.message,
      source: execDoc.error.source,
      detail: execDoc.error.detail ?? null,
    } : null;
    send('status', {
      status: execDoc.status,
      output_file: execDoc.output_file,
      error: errPayload,
    });
    send('done', {});
    res.end();
    return;
  }

  // Subscribe agli eventi del messageBus, filtrato per execution_id
  const bus = getPipelineMessageBus();
  const handler = (msg: { type: string; execution_id: string; payload: Record<string, unknown> }) => {
    if (msg.execution_id !== String(execDoc._id)) return;
    if (msg.type === 'pipeline.step.log') {
      send('log', { ts: new Date().toISOString(), text: msg.payload.text, level: msg.payload.level ?? 'info' });
    } else if (msg.type === 'pipeline.step.completed') {
      send('status', { status: msg.payload.verifica_required ? 'in_verifica' : 'completato', output_file: msg.payload.output_file_relative });
      send('done', {});
      cleanup();
    } else if (msg.type === 'pipeline.step.failed') {
      // Normalizza la forma dell'errore (live event ha error_*; doc Mongo ha message/source/detail)
      const p = msg.payload as Record<string, unknown>;
      send('status', {
        status: 'fallito',
        error: {
          message: typeof p.error_message === 'string' ? p.error_message : 'Errore sconosciuto',
          source:  typeof p.error_source === 'string' ? p.error_source : 'sistema',
          detail:  typeof p.error_detail === 'string' ? p.error_detail : null,
        },
      });
      send('done', {});
      cleanup();
    } else if (msg.type === 'pipeline.step.cancelled') {
      send('status', { status: 'non_avviato', reason: msg.payload.reason });
      send('done', {});
      cleanup();
    } else if (msg.type === 'pipeline.step.started') {
      send('status', { status: 'in_esecuzione' });
    }
  };

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    bus.offEvent(handler);
    if (!res.writableEnded) res.end();
  };

  bus.onEvent(handler);
  req.on('close', cleanup);
  req.on('end', cleanup);
}

// POST /api/pipeline/temi/:temaId/steps/:stepId/reset
// Riporta uno step da uno stato terminale a "non_avviato" così che possa essere rilanciato.
// Vincolo: nessuno step a valle (che dipenda da questo step) può essere in stato avanzato —
// l'utente deve fare rollback in ordine inverso per evitare di lasciare downstream con input stale.
export async function resetStep(req: Request, res: Response) {
  const { temaId, stepId } = req.params;

  const RESETTABLE_STATUSES = ['completato', 'verificato', 'saltato', 'richiede_correzione', 'fallito', 'in_verifica'];
  const NEUTRAL_DOWNSTREAM = ['non_avviato', 'attende_input', 'attende_decisione'];

  try {
    const contextDoc = await PipelineContext.findOne({ context_id: temaId });
    if (!contextDoc) return err(res, 404, 'CONTEXT_NOT_FOUND', `Context "${temaId}" non trovato`);

    const cfgDoc = await loadStepConfig();
    const stepConfig = cfgDoc.steps.find((s) => s.id === stepId);
    if (!stepConfig) return err(res, 404, 'STEP_NOT_FOUND', `Step "${stepId}" non valido`);

    const stepStates = (contextDoc.step_states ?? {}) as Record<string, { status: string }>;
    const currentStatus = stepStates[stepId]?.status ?? 'non_avviato';

    if (!RESETTABLE_STATUSES.includes(currentStatus)) {
      return err(
        res,
        409,
        'STEP_NOT_RESETTABLE',
        `Step "${stepId}" in stato "${currentStatus}", non resettabile. Annullare prima un'eventuale esecuzione attiva.`,
      );
    }

    // Trova step a valle che dipendono da stepId (replica della logica di pickPipelineInputs +
    // resolveVirtualStepRef di stepEnablement.ts) e blocca se uno di loro non è in stato neutro.
    const blockingDownstream: { step_id: string; status: string }[] = [];
    for (const other of cfgDoc.steps) {
      if (other.id === stepId) continue;
      let deps = other.inputs_pipeline ?? [];
      if (other.id === 'f3_step_9') {
        const step8Status = stepStates['f3_step_8']?.status;
        deps = step8Status === 'saltato' ? (other.inputs_pipeline_skip_8 ?? []) : (other.inputs_pipeline_standard ?? []);
      }
      const dependsOnTarget = deps.some((d) => {
        if (d.step === stepId) return true;
        if (d.step === 'f3_step_3_or_6c') {
          const s6c = stepStates['f3_step_6c']?.status;
          const resolved = (s6c === 'completato' || s6c === 'verificato') ? 'f3_step_6c' : 'f3_step_3';
          return resolved === stepId;
        }
        return false;
      });
      if (!dependsOnTarget) continue;
      const otherStatus = stepStates[other.id]?.status ?? 'non_avviato';
      if (!NEUTRAL_DOWNSTREAM.includes(otherStatus)) {
        blockingDownstream.push({ step_id: other.id, status: otherStatus });
      }
    }
    if (blockingDownstream.length > 0) {
      return err(
        res,
        409,
        'STEP_HAS_DEPENDENTS',
        `Step "${stepId}" ha step a valle non resettati. Resettali prima in ordine inverso.`,
        { blocking: blockingDownstream },
      );
    }

    const now = new Date();
    await PipelineContext.updateOne(
      { context_id: temaId },
      {
        $set: {
          [`step_states.${stepId}.status`]: 'non_avviato',
          [`step_states.${stepId}.current_run`]: 0,
          [`step_states.${stepId}.last_execution_id`]: null,
          [`step_states.${stepId}.output_file`]: null,
          [`step_states.${stepId}.verifica_outcome`]: null,
          [`step_states.${stepId}.updated_at`]: now,
        },
        $pull: {
          steps_completed: stepId,
          steps_in_progress: stepId,
          steps_failed: stepId,
        },
      },
    );

    const unlocked = await computeUnlockedSteps(temaId);
    return ok(res, 200, { step_id: stepId, new_status: 'non_avviato', unlocked_steps: unlocked });
  } catch (e) {
    console.error('[pipeline] resetStep error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel reset dello step');
  }
}

// POST /api/pipeline/temi/:temaId/steps/:stepId/skip
export async function skipStep(req: Request, res: Response) {
  const { temaId, stepId } = req.params;
  const { reason } = (req.body ?? {}) as { reason?: string };

  try {
    if (!reason || reason.trim().length === 0) {
      return err(res, 400, 'MISSING_REASON', 'Campo "reason" obbligatorio per lo skip');
    }
    const contextDoc = await PipelineContext.findOne({ context_id: temaId });
    if (!contextDoc) return err(res, 404, 'CONTEXT_NOT_FOUND', `Context "${temaId}" non trovato`);

    const stepConfig = await getStepConfigById(stepId);
    if (!stepConfig) return err(res, 404, 'STEP_NOT_FOUND', `Step "${stepId}" non valido`);

    if (!stepConfig.can_skip) {
      return err(res, 422, 'STEP_NOT_SKIPPABLE', `Step "${stepId}" non è skippabile`);
    }

    const stepState = (contextDoc.step_states as Record<string, { status: string }> | undefined)?.[stepId];
    if (stepState && stepState.status !== 'non_avviato' && stepState.status !== 'attende_input') {
      return err(res, 409, 'STEP_NOT_SKIPPABLE_NOW', `Step "${stepId}" in stato "${stepState.status}", non skippabile`);
    }

    const now = new Date();
    const lastExec = await PipelineStepExecution
      .findOne({ context_id: temaId, step_id: stepId })
      .sort({ run_number: -1 })
      .lean();
    const runNumber = (lastExec?.run_number ?? 0) + 1;

    const execDoc = await PipelineStepExecution.create({
      context_type: contextDoc.context_type,
      context_id: contextDoc.context_id,
      step_id: stepId,
      run_number: runNumber,
      status: 'saltato',
      created_at: now,
      is_skipped: true,
      skip_reason: reason,
    });

    const setUpdate: Record<string, unknown> = {
      [`step_states.${stepId}.status`]: 'saltato',
      [`step_states.${stepId}.current_run`]: runNumber,
      [`step_states.${stepId}.last_execution_id`]: execDoc._id,
      [`step_states.${stepId}.updated_at`]: now,
    };

    // Se in futuro l'ultimo step F2 (f2_step_6) dovesse diventare skippabile,
    // il banner di decisione F2 → F3 deve apparire atomicamente con la
    // transizione a 'saltato' — stessa garanzia anti-race del completamento
    // (vedi pipelineEventSubscriber.ts:handleCompleted).
    if (stepId === 'f2_step_6') {
      setUpdate.pending_decision = await buildF2ToF3Decision(temaId, 'f2_step_6', now);
    }

    await PipelineContext.updateOne(
      { context_id: temaId },
      {
        $set: setUpdate,
        $addToSet: { steps_completed: stepId },
        $pull: { steps_in_progress: stepId, steps_failed: stepId },
      },
    );

    const unlocked = await computeUnlockedSteps(temaId);
    return ok(res, 200, { step_id: stepId, status: 'saltato', unlocked_steps: unlocked });
  } catch (e) {
    console.error('[pipeline] skipStep error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nello skip');
  }
}
