// Calcolo automatico dello stato dell'opera + mappa di cascata invalidazione.
//
// Regola (da spec, sezione "Calcolo automatico del campo `stato`"):
//   - Tutti gli step `non_avviato`                           → `in_attesa`
//   - Almeno uno `in_coda` / `in_esecuzione` / `completato` /
//     `errore`, ma non tutti completati                       → `in_corso`
//   - Tutti e 10 gli step `completato`                        → `completata`
//   - `sospesa` è settata manualmente dall'admin: il calcolo
//     non la sovrascrive mai.

import {
  IOperaPipeline,
  LETTURE_STEP_IDS,
  LettureStepId,
  OperaStato,
  OperaStepStato,
} from '../models/Opera';

// Mappa cascata: step_id → step_id da invalidare quando lo step a monte viene rieseguito.
// L'invalidazione è transitiva e qui pre-calcolata.
export const LETTURE_INVALIDATION_MAP: Record<LettureStepId, LettureStepId[]> = {
  step_1:  ['step_2', 'step_3', 'step_4', 'step_5a', 'step_5b', 'step_5c', 'step_5d', 'step_5e', 'step_5f'],
  step_2:  ['step_3', 'step_4', 'step_5a', 'step_5b', 'step_5c', 'step_5d', 'step_5e', 'step_5f'],
  step_3:  ['step_4', 'step_5a', 'step_5b', 'step_5c', 'step_5d', 'step_5e', 'step_5f'],
  step_4:  ['step_5a', 'step_5b', 'step_5c', 'step_5d', 'step_5e', 'step_5f'],
  step_5a: ['step_5b', 'step_5c', 'step_5d', 'step_5e', 'step_5f'],
  step_5b: ['step_5c', 'step_5d', 'step_5e', 'step_5f'],
  step_5c: ['step_5d', 'step_5e', 'step_5f'],
  step_5d: ['step_5e', 'step_5f'],
  step_5e: ['step_5f'],
  step_5f: [],
};

// Prerequisiti per abilitare l'esecuzione di uno step (tutti devono essere `completato`).
export const LETTURE_PREREQUISITES: Record<LettureStepId, LettureStepId[]> = {
  step_1:  [],
  step_2:  ['step_1'],
  step_3:  ['step_1', 'step_2'],
  step_4:  ['step_1', 'step_2', 'step_3'],
  step_5a: ['step_1', 'step_2', 'step_3', 'step_4'],
  step_5b: ['step_5a'],
  step_5c: ['step_5b'],
  step_5d: ['step_5c'],
  step_5e: ['step_5d'],
  step_5f: ['step_5d', 'step_5e'],
};

export function isStepEnabled(pipeline: IOperaPipeline, stepId: LettureStepId): boolean {
  const prereq = LETTURE_PREREQUISITES[stepId];
  return prereq.every((p) => pipeline[p].stato === 'completato');
}

function statiCorrenti(pipeline: IOperaPipeline): OperaStepStato[] {
  return LETTURE_STEP_IDS.map((id) => pipeline[id].stato);
}

// Calcola lo stato derivato a partire dalla pipeline. Non sovrascrive `sospesa`:
// il chiamante deve passare lo stato corrente per poter restituire `sospesa` invariato.
export function calcolaStato(pipeline: IOperaPipeline, statoCorrente: OperaStato): OperaStato {
  if (statoCorrente === 'sospesa') return 'sospesa';

  const stati = statiCorrenti(pipeline);
  if (stati.every((s) => s === 'completato')) return 'completata';
  if (stati.every((s) => s === 'non_avviato')) return 'in_attesa';
  return 'in_corso';
}

// Numero di step completati (per indicatore di avanzamento N/10 nella UI admin).
export function avanzamento(pipeline: IOperaPipeline): { completati: number; totale: number } {
  const stati = statiCorrenti(pipeline);
  return {
    completati: stati.filter((s) => s === 'completato').length,
    totale: LETTURE_STEP_IDS.length,
  };
}

// Costruisce lo `$set` di MongoDB per resettare gli step a valle di `stepId` (cascata),
// più lo step stesso se richiesto. Usato dal controller di /run quando si riesegue
// uno step già completato/in errore.
export function buildInvalidationUpdate(
  fromStepId: LettureStepId,
  options: { includeSelf?: boolean } = {},
): Record<string, unknown> {
  const targets = [...LETTURE_INVALIDATION_MAP[fromStepId]];
  if (options.includeSelf) targets.unshift(fromStepId);

  const update: Record<string, unknown> = {};
  for (const id of targets) {
    update[`pipeline.${id}.stato`] = 'non_avviato';
    update[`pipeline.${id}.completato_il`] = null;
    update[`pipeline.${id}.started_at`] = null;
    update[`pipeline.${id}.output`] = null;
    update[`pipeline.${id}.errore`] = null;
    update[`pipeline.${id}.log_lines`] = [];
    if (id === 'step_5d' || id === 'step_5e' || id === 'step_5f') {
      update[`pipeline.${id}.testo`] = null;
    }
  }
  return update;
}
