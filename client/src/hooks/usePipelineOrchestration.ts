import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { pipelineOrchestratorService } from '../services/pipelineOrchestratorService';
import type {
  PipelineContextDoc,
  StepConfig,
  PipelineExternalInputDoc,
  EnrichedStepState,
  StepAction,
  ExecutionStatus,
  VerificaOutcome,
  RunStepResult,
  VerifyResult,
  MissingDependency,
  MissingExternalInput,
  TemaSelectionPayload,
} from '../types/pipeline';

const ACTIVE_STATUSES: ExecutionStatus[] = ['in_coda', 'in_esecuzione'];
const DEFAULT_POLLING_MS = 5000;

interface UsePipelineOrchestrationOptions {
  contextId: string;
  contextType: 'tema' | 'ricerca';
  pollingIntervalMs?: number;
}

interface UsePipelineOrchestrationResult {
  context: PipelineContextDoc | null;
  stepConfig: StepConfig[];
  externalInputs: PipelineExternalInputDoc[];
  isLoading: boolean;
  error: string | null;
  stepStates: Record<string, EnrichedStepState>;

  refresh: () => Promise<void>;

  runStep: (stepId: string, extraParams?: Record<string, unknown>) => Promise<RunStepResult>;
  cancelExecution: (executionId: string) => Promise<void>;
  verifyExecution: (executionId: string, outcome: VerificaOutcome, notes?: string, feedback?: string) => Promise<VerifyResult>;
  skipStep: (stepId: string, reason: string) => Promise<void>;
  resetStep: (stepId: string) => Promise<void>;
  submitExternalInput: (stepId: string, inputId: string, data: Record<string, unknown>) => Promise<void>;
  submitTemaDecision: (confirmed: boolean, notes?: string) => Promise<void>;
  submitRicercaDecision: (ricercaId: string, payload: TemaSelectionPayload) => Promise<void>;
}

// Replica della logica evaluateStepEnablement del backend (D4 §9), sufficientemente
// fedele per derivare l'action UI senza chiamare il backend.
function computeEnablement(
  context: PipelineContextDoc,
  stepCfg: StepConfig,
  providedInputIds: Set<string>,
): { enabled: boolean; missing_pipeline_deps: MissingDependency[]; missing_external_inputs: MissingExternalInput[]; blocked_by_decision: boolean } {
  const stepStates = context.step_states ?? {};

  let pipelineInputs = stepCfg.inputs_pipeline ?? [];
  if (stepCfg.id === 'f3_step_9') {
    const step8 = stepStates['f3_step_8']?.status;
    pipelineInputs = step8 === 'saltato' ? (stepCfg.inputs_pipeline_skip_8 ?? []) : (stepCfg.inputs_pipeline_standard ?? []);
  }

  const missing_pipeline_deps: MissingDependency[] = [];
  for (const dep of pipelineInputs) {
    if (!dep.required) continue;
    const requiredStatus: 'completato' | 'verificato' = dep.requires_verifica ? 'verificato' : 'completato';
    const acceptable = requiredStatus === 'verificato'
      ? ['verificato', 'saltato']
      : ['completato', 'verificato', 'saltato'];

    let resolvedStepId = dep.step;
    if (dep.step === 'f3_step_3_or_6c') {
      const s6c = stepStates['f3_step_6c']?.status;
      resolvedStepId = (s6c === 'completato' || s6c === 'verificato') ? 'f3_step_6c' : 'f3_step_3';
    }
    const currentStatus = stepStates[resolvedStepId]?.status ?? 'non_avviato';
    if (!acceptable.includes(currentStatus)) {
      missing_pipeline_deps.push({ step_id: dep.step, required_status: requiredStatus, current_status: currentStatus });
    }
  }

  const requiredInputs = (stepCfg.inputs_esterni ?? []).filter((i) => i.type === 'esterno_obbligatorio');
  const missing_external_inputs: MissingExternalInput[] = [];
  for (const inp of requiredInputs) {
    if (!providedInputIds.has(inp.id)) {
      missing_external_inputs.push({ input_id: inp.id, label: inp.label });
    }
  }

  let blocked_by_decision = false;
  if (context.pending_decision) {
    const map: Record<string, string[]> = {
      f2_to_f3_tema_selection: ['f3_step_1'],
      step7_context_selection: ['f3_step_7'],
    };
    const blocked = map[context.pending_decision.type] ?? [];
    if (blocked.includes(stepCfg.id)) blocked_by_decision = true;
  }

  return {
    enabled: missing_pipeline_deps.length === 0 && missing_external_inputs.length === 0 && !blocked_by_decision,
    missing_pipeline_deps,
    missing_external_inputs,
    blocked_by_decision,
  };
}

// Replica della logica di resetStep del backend (server/src/controllers/pipelineController.ts):
// uno step è rollback-abile se è in stato terminale e nessuno step a valle (che dipende da lui)
// è in stato avanzato. Forza naturalmente il rollback in ordine inverso.
const RESETTABLE_STATUSES: ExecutionStatus[] = ['completato', 'verificato', 'saltato', 'richiede_correzione', 'fallito', 'in_verifica'];
const NEUTRAL_DOWNSTREAM_STATUSES: ExecutionStatus[] = ['non_avviato', 'attende_input', 'attende_decisione'];

function computeRollbackability(
  stepCfg: StepConfig,
  stepStates: Record<string, { status: ExecutionStatus }>,
  currentStatus: ExecutionStatus,
  allConfigs: StepConfig[],
): { rollbackable: boolean; blocked_by: { step_id: string; status: ExecutionStatus }[] } {
  if (!RESETTABLE_STATUSES.includes(currentStatus)) {
    return { rollbackable: false, blocked_by: [] };
  }
  const blocked_by: { step_id: string; status: ExecutionStatus }[] = [];
  for (const other of allConfigs) {
    if (other.id === stepCfg.id) continue;
    let deps = other.inputs_pipeline ?? [];
    if (other.id === 'f3_step_9') {
      const step8 = stepStates['f3_step_8']?.status;
      deps = step8 === 'saltato' ? (other.inputs_pipeline_skip_8 ?? []) : (other.inputs_pipeline_standard ?? []);
    }
    const dependsOnTarget = deps.some((d) => {
      if (d.step === stepCfg.id) return true;
      if (d.step === 'f3_step_3_or_6c') {
        const s6c = stepStates['f3_step_6c']?.status;
        const resolved = (s6c === 'completato' || s6c === 'verificato') ? 'f3_step_6c' : 'f3_step_3';
        return resolved === stepCfg.id;
      }
      return false;
    });
    if (!dependsOnTarget) continue;
    const otherStatus = stepStates[other.id]?.status ?? 'non_avviato';
    if (!NEUTRAL_DOWNSTREAM_STATUSES.includes(otherStatus)) {
      blocked_by.push({ step_id: other.id, status: otherStatus });
    }
  }
  return { rollbackable: blocked_by.length === 0, blocked_by };
}

function deriveAction(
  status: ExecutionStatus,
  enabled: boolean,
  missingDeps: number,
  missingInputs: number,
  blockedByDecision: boolean,
  verifica_required: boolean,
): StepAction {
  if (status === 'in_esecuzione') return 'view_logs';
  if (status === 'in_coda') return 'cancel';
  if (status === 'in_verifica') return 'verify';
  if (status === 'fallito' || status === 'richiede_correzione') return 'relaunch';
  if (status === 'completato') return verifica_required ? 'verify' : 'none';
  if (status === 'verificato' || status === 'saltato') return 'none';
  // status: non_avviato | attende_input | attende_decisione
  if (blockedByDecision || status === 'attende_decisione') return 'decide';
  if (enabled) return 'launch';
  if (missingDeps > 0) return 'awaiting_deps';
  if (missingInputs > 0) return 'provide_input';
  return 'awaiting_deps';
}

export function usePipelineOrchestration(opts: UsePipelineOrchestrationOptions): UsePipelineOrchestrationResult {
  const { contextId, contextType, pollingIntervalMs = DEFAULT_POLLING_MS } = opts;
  const { getToken } = useAuth();

  const [context, setContext] = useState<PipelineContextDoc | null>(null);
  const [stepConfig, setStepConfig] = useState<StepConfig[]>([]);
  const [externalInputs, setExternalInputs] = useState<PipelineExternalInputDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchTema = useCallback(async () => {
    try {
      const data = contextType === 'ricerca'
        ? await pipelineOrchestratorService.getRicerca(contextId)
        : await pipelineOrchestratorService.getTema(contextId);
      if (!mountedRef.current) return;
      setContext(data.context);
      setStepConfig(data.step_config);
      setExternalInputs(data.external_inputs);
      setError(null);
    } catch (e) {
      if (!mountedRef.current) return;
      setError((e as Error).message);
    }
  }, [contextId, contextType]);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    fetchTema().finally(() => mountedRef.current && setIsLoading(false));
  }, [fetchTema]);

  // Stato derivato per il polling
  const hasActiveSteps = useMemo(() => {
    if (!context) return false;
    return Object.values(context.step_states ?? {}).some((s) => ACTIVE_STATUSES.includes(s.status));
  }, [context]);

  // Polling auto-spegnente
  useEffect(() => {
    if (!hasActiveSteps) return;
    const t = setInterval(() => { void fetchTema(); }, pollingIntervalMs);
    return () => clearInterval(t);
  }, [hasActiveSteps, pollingIntervalMs, fetchTema]);

  // stepStates arricchiti
  const stepStates = useMemo<Record<string, EnrichedStepState>>(() => {
    if (!context) return {};
    const result: Record<string, EnrichedStepState> = {};
    const providedByStep: Record<string, Set<string>> = {};
    for (const inp of externalInputs) {
      if (!providedByStep[inp.step_id]) providedByStep[inp.step_id] = new Set();
      providedByStep[inp.step_id].add(inp.input_id);
    }
    // Snapshot statuses (per la lookup in computeRollbackability)
    const statusesByStep: Record<string, { status: ExecutionStatus }> = {};
    for (const [k, v] of Object.entries(context.step_states ?? {})) {
      statusesByStep[k] = { status: v.status };
    }
    for (const cfg of stepConfig) {
      const docState = context.step_states?.[cfg.id];
      const status: ExecutionStatus = docState?.status ?? 'non_avviato';
      const provided = providedByStep[cfg.id] ?? new Set<string>();
      const en = computeEnablement(context, cfg, provided);
      const action = deriveAction(
        status, en.enabled, en.missing_pipeline_deps.length, en.missing_external_inputs.length, en.blocked_by_decision, cfg.verifica,
      );
      const rb = computeRollbackability(cfg, statusesByStep, status, stepConfig);
      result[cfg.id] = {
        step_id: cfg.id,
        label: cfg.label,
        phase: cfg.phase,
        verifica_required: cfg.verifica,
        can_skip: cfg.can_skip,
        missing_pipeline_deps: en.missing_pipeline_deps,
        missing_external_inputs: en.missing_external_inputs,
        is_launchable: en.enabled,
        action,
        status,
        current_run: docState?.current_run ?? 0,
        last_execution_id: docState?.last_execution_id ?? null,
        output_file: docState?.output_file ?? null,
        verifica_outcome: docState?.verifica_outcome ?? null,
        updated_at: docState?.updated_at ?? '',
        is_rollbackable: rb.rollbackable,
        rollback_blocked_by: rb.blocked_by,
      };
    }
    return result;
  }, [context, stepConfig, externalInputs]);

  // ---- Azioni ----

  const runStep = useCallback(async (stepId: string, extraParams: Record<string, unknown> = {}): Promise<RunStepResult> => {
    // Aggiornamento ottimistico: status → in_coda
    setContext((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        step_states: {
          ...prev.step_states,
          [stepId]: { ...(prev.step_states?.[stepId] ?? { current_run: 0, last_execution_id: null, output_file: null, verifica_outcome: null, updated_at: '' }), status: 'in_coda' },
        },
      };
    });
    const result = await pipelineOrchestratorService.runStep(contextId, stepId, extraParams, getToken);
    await fetchTema();
    return result;
  }, [contextId, getToken, fetchTema]);

  const cancelExecution = useCallback(async (executionId: string) => {
    await pipelineOrchestratorService.cancelExecution(executionId, '', getToken);
    await fetchTema();
  }, [getToken, fetchTema]);

  const verifyExecution = useCallback(async (executionId: string, outcome: VerificaOutcome, notes = '', feedback = '') => {
    const result = await pipelineOrchestratorService.verifyExecution(executionId, outcome, notes, feedback, getToken);
    await fetchTema();
    return result;
  }, [getToken, fetchTema]);

  const skipStep = useCallback(async (stepId: string, reason: string) => {
    await pipelineOrchestratorService.skipStep(contextId, stepId, reason, getToken);
    await fetchTema();
  }, [contextId, getToken, fetchTema]);

  const resetStep = useCallback(async (stepId: string) => {
    // Aggiornamento ottimistico: status → non_avviato così il menu nasconde subito
    // "Annulla esecuzione" e l'utente non può cliccarlo due volte mentre il fetch viaggia.
    setContext((prev) => {
      if (!prev) return prev;
      const prevState = prev.step_states?.[stepId] ?? {
        current_run: 0, last_execution_id: null, output_file: null, verifica_outcome: null, updated_at: '',
      };
      return {
        ...prev,
        step_states: {
          ...prev.step_states,
          [stepId]: {
            ...prevState,
            status: 'non_avviato',
            current_run: 0,
            last_execution_id: null,
            output_file: null,
            verifica_outcome: null,
          },
        },
      };
    });
    try {
      await pipelineOrchestratorService.resetStep(contextId, stepId, getToken);
    } catch (e) {
      // Su errore, riallinea allo stato reale del backend prima di rilanciare
      await fetchTema();
      throw e;
    }
    await fetchTema();
  }, [contextId, getToken, fetchTema]);

  const submitExternalInput = useCallback(async (stepId: string, inputId: string, data: Record<string, unknown>) => {
    await pipelineOrchestratorService.submitExternalInput(contextId, stepId, inputId, data, getToken);
    await fetchTema();
  }, [contextId, getToken, fetchTema]);

  const submitTemaDecision = useCallback(async (confirmed: boolean, notes = '') => {
    await pipelineOrchestratorService.submitContextDecision(contextId, confirmed, notes, getToken);
    await fetchTema();
  }, [contextId, getToken, fetchTema]);

  const submitRicercaDecision = useCallback(async (ricercaId: string, payload: TemaSelectionPayload) => {
    await pipelineOrchestratorService.submitTemaSelection(ricercaId, payload, getToken);
    await fetchTema();
  }, [getToken, fetchTema]);

  const refresh = useCallback(async () => { await fetchTema(); }, [fetchTema]);

  return {
    context,
    stepConfig,
    externalInputs,
    isLoading,
    error,
    stepStates,
    refresh,
    runStep,
    cancelExecution,
    verifyExecution,
    skipStep,
    resetStep,
    submitExternalInput,
    submitTemaDecision,
    submitRicercaDecision,
  };
}
