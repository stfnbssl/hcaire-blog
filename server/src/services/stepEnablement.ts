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

// v3.0 (D7): rimosso `f2_to_f3_tema_selection` (selezione tema gestita lato archivio
// temi → bridge F2). `step7_context_selection` non più applicabile (vecchio f3_step_7
// eliminato). Tipo mantenuto come riserva per future decisioni umane modali.
export type HumanDecisionType = never;

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

const ACCEPTABLE_FOR_VERIFICATO: StepStatusLike[] = ['verificato', 'saltato'];
const ACCEPTABLE_FOR_COMPLETATO: StepStatusLike[] = ['completato', 'verificato', 'saltato'];

function getStateStatus(
  context: EnablementContext,
  stepId: string,
): StepStatusLike {
  return context.step_states?.[stepId]?.status ?? 'non_avviato';
}

export function evaluateStepEnablement(
  context: EnablementContext,
  stepConfig: StepConfig,
  providedInputIds: Set<string>,
): EnablementResult {
  const reasons: BlockingReason[] = [];

  // 1. Dipendenze pipeline (modello r3: lineare semplice, nessuna biforcazione/virtual ref)
  const pipelineInputs: StepConfigInputPipeline[] = stepConfig.inputs_pipeline ?? [];
  for (const dep of pipelineInputs) {
    if (!dep.required) continue;
    const requiredStatus: 'completato' | 'verificato' = dep.requires_verifica ? 'verificato' : 'completato';
    const acceptable = requiredStatus === 'verificato'
      ? ACCEPTABLE_FOR_VERIFICATO
      : ACCEPTABLE_FOR_COMPLETATO;

    const currentStatus = getStateStatus(context, dep.step);

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

  // 3. Decisione pendente bloccante: nessun caso attivo nel modello r3 (HumanDecisionType
  //    è ora `never`). Branch lasciato come scaffolding per future decisioni umane modali.

  return { enabled: reasons.length === 0, blocking_reasons: reasons };
}
