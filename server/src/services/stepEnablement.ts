// Logica pura di valutazione abilitazione step (D4 §9).
// Nessuna dipendenza da Mongoose: input via parametri, testabile in isolamento.

import type { StepConfig, StepConfigInputPipeline } from './stepConfigService';

export type StepStatusLike =
  | 'non_avviato' | 'attende_input' | 'attende_decisione'
  | 'in_coda' | 'in_esecuzione'
  | 'completato' | 'in_verifica' | 'verificato'
  | 'richiede_correzione' | 'saltato' | 'fallito';

export interface EnablementStepState {
  status: StepStatusLike;
}

export type HumanDecisionType = 'f2_to_f3_tema_selection' | 'step7_context_selection';

export interface EnablementContext {
  step_states?: Record<string, EnablementStepState> | null;
  pending_decision?: { type: HumanDecisionType } | null;
}

export type BlockingReason =
  | { type: 'dependency'; step_id: string; required_status: 'completato' | 'verificato'; current_status: StepStatusLike }
  | { type: 'missing_input'; input_id: string; label: string }
  | { type: 'pending_decision'; decision_type: HumanDecisionType };

export interface EnablementResult {
  enabled: boolean;
  blocking_reasons: BlockingReason[];
}

// Mappa tra decisione pendente e gli step che essa blocca.
// f2_to_f3_tema_selection blocca f3_step_1 (la decisione "quale tema in F3" precede la sua lettura).
// step7_context_selection blocca f3_step_7 finché l'operatore non conferma il contesto.
const DECISION_BLOCKS_STEP: Record<HumanDecisionType, string[]> = {
  f2_to_f3_tema_selection: ['f3_step_1'],
  step7_context_selection: ['f3_step_7'],
};

const ACCEPTABLE_FOR_VERIFICATO: StepStatusLike[] = ['verificato', 'saltato'];
const ACCEPTABLE_FOR_COMPLETATO: StepStatusLike[] = ['completato', 'verificato', 'saltato'];

function getStateStatus(
  context: EnablementContext,
  stepId: string,
): StepStatusLike {
  return context.step_states?.[stepId]?.status ?? 'non_avviato';
}

function pickPipelineInputs(stepConfig: StepConfig, context: EnablementContext): StepConfigInputPipeline[] {
  // Per step 9 esistono due varianti di input dipendenti dallo skip o no di step 8.
  // Sceglie inputs_pipeline_skip_8 se step 8 risulta saltato, altrimenti inputs_pipeline_standard.
  // Per gli altri step usa inputs_pipeline.
  if (stepConfig.id === 'f3_step_9') {
    const step8 = getStateStatus(context, 'f3_step_8');
    if (step8 === 'saltato') return stepConfig.inputs_pipeline_skip_8 ?? [];
    return stepConfig.inputs_pipeline_standard ?? [];
  }
  return stepConfig.inputs_pipeline ?? [];
}

// Risolve il marker virtuale f3_step_3_or_6c: privilegia 6c se completato/verificato,
// altrimenti ricade su step 3.
function resolveVirtualStepRef(
  ref: string,
  context: EnablementContext,
): string {
  if (ref !== 'f3_step_3_or_6c') return ref;
  const step6cStatus = getStateStatus(context, 'f3_step_6c');
  if (step6cStatus === 'completato' || step6cStatus === 'verificato') return 'f3_step_6c';
  return 'f3_step_3';
}

export function evaluateStepEnablement(
  context: EnablementContext,
  stepConfig: StepConfig,
  providedInputIds: Set<string>,
): EnablementResult {
  const reasons: BlockingReason[] = [];

  // 1. Dipendenze pipeline
  const pipelineInputs = pickPipelineInputs(stepConfig, context);
  for (const dep of pipelineInputs) {
    if (!dep.required) continue;
    const requiredStatus: 'completato' | 'verificato' = dep.requires_verifica ? 'verificato' : 'completato';
    const acceptable = requiredStatus === 'verificato'
      ? ACCEPTABLE_FOR_VERIFICATO
      : ACCEPTABLE_FOR_COMPLETATO;

    const resolvedStepId = resolveVirtualStepRef(dep.step, context);
    const currentStatus = getStateStatus(context, resolvedStepId);

    if (!acceptable.includes(currentStatus)) {
      reasons.push({
        type: 'dependency',
        step_id: dep.step,
        required_status: requiredStatus,
        current_status: currentStatus,
      });
    }
  }

  // 2. Input esterni obbligatori
  const requiredInputs = (stepConfig.inputs_esterni ?? []).filter((i) => i.type === 'esterno_obbligatorio');
  for (const inputConfig of requiredInputs) {
    if (!providedInputIds.has(inputConfig.id)) {
      reasons.push({
        type: 'missing_input',
        input_id: inputConfig.id,
        label: inputConfig.label,
      });
    }
  }

  // 3. Decisione pendente bloccante
  if (context.pending_decision) {
    const blockedSteps = DECISION_BLOCKS_STEP[context.pending_decision.type] ?? [];
    if (blockedSteps.includes(stepConfig.id)) {
      reasons.push({
        type: 'pending_decision',
        decision_type: context.pending_decision.type,
      });
    }
  }

  return { enabled: reasons.length === 0, blocking_reasons: reasons };
}
