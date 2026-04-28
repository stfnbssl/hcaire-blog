// Tipi della sezione Letture — devono restare allineati con server/src/models/Opera.ts
// e server/src/controllers/lettureController.ts.

export type OperaStato = 'in_attesa' | 'in_corso' | 'completata' | 'sospesa';
export type OperaStepStato = 'non_avviato' | 'in_coda' | 'in_esecuzione' | 'completato' | 'errore';
export type OperaTipologia = 'romanzo' | 'racconto' | 'film' | 'opera teatrale' | 'saggio narrativo' | 'altro';

export const LETTURE_TIPOLOGIE: OperaTipologia[] = [
  'romanzo', 'racconto', 'film', 'opera teatrale', 'saggio narrativo', 'altro',
];

export const LETTURE_STATI: OperaStato[] = ['in_attesa', 'in_corso', 'completata', 'sospesa'];

export const LETTURE_STEP_IDS = [
  'step_1', 'step_2', 'step_3', 'step_4',
  'step_5a', 'step_5b', 'step_5c', 'step_5d', 'step_5e', 'step_5f',
] as const;
export type LettureStepId = typeof LETTURE_STEP_IDS[number];

// Cascata invalidazione (mirror della mappa server-side, usata dalla modale di conferma).
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

export const LETTURE_STEP_LABELS: Record<LettureStepId, string> = {
  step_1:  'Dossier contenutistico',
  step_2:  'Lettura libera orientata',
  step_3:  'Lettura strutturata per assi',
  step_4:  'Saggio critico — revisione',
  step_5a: 'Selezione editoriale',
  step_5b: 'Scaletta',
  step_5c: 'Stesura',
  step_5d: 'Revisione finale (articolo)',
  step_5e: 'Resoconto del processo',
  step_5f: 'Saggio integrato',
};

// ---------- shape delle response API ----------

export interface OperaLogLine {
  ts: string;
  text: string;
  level: 'info' | 'warn' | 'error';
}

export interface OperaStepBase {
  stato: OperaStepStato;
  completato_il: string | null;
  started_at: string | null;
  output: unknown;
  errore: string | null;
  log_lines: OperaLogLine[];
}

export interface OperaStepConTesto extends OperaStepBase {
  testo: string | null;
}

export interface OperaPipeline {
  step_1: OperaStepBase;
  step_2: OperaStepBase;
  step_3: OperaStepBase;
  step_4: OperaStepBase;
  step_5a: OperaStepBase;
  step_5b: OperaStepBase;
  step_5c: OperaStepBase;
  step_5d: OperaStepConTesto;
  step_5e: OperaStepConTesto;
  step_5f: OperaStepConTesto;
}

export interface Opera {
  slug: string;
  titolo: string;
  autore: string;
  anno: number | null;
  tipologia: OperaTipologia;
  lingua_originale: string | null;
  stato: OperaStato;
  priorita: number | null;
  note_di_ingresso: string;
  pipeline: OperaPipeline;
  createdAt: string;
  updatedAt: string;
}

// Riepilogo restituito dalla lista admin (output e testo esclusi).
export interface OperaSummary {
  slug: string;
  titolo: string;
  autore: string;
  anno: number | null;
  tipologia: OperaTipologia;
  lingua_originale: string | null;
  stato: OperaStato;
  priorita: number | null;
  note_di_ingresso: string;
  avanzamento: { completati: number; totale: number };
  step_stati: Record<LettureStepId, OperaStepStato>;
  pubblicata_il: string | null;
  testi_disponibili: { articolo: boolean; resoconto: boolean; saggio: boolean };
  createdAt: string;
  updatedAt: string;
}

export interface RunStepResponse {
  execution_id: string;
  slug: string;
  step_id: LettureStepId;
  status: 'in_coda';
}

// ---------- helpers UI ----------

export function isStepEnabled(pipeline: OperaPipeline, stepId: LettureStepId): boolean {
  return LETTURE_PREREQUISITES[stepId].every(
    (p) => pipeline[p].stato === 'completato',
  );
}

export function isStepActive(stato: OperaStepStato): boolean {
  return stato === 'in_coda' || stato === 'in_esecuzione';
}

export function operaHasActiveStep(pipeline: OperaPipeline): boolean {
  return LETTURE_STEP_IDS.some((id) => isStepActive(pipeline[id].stato));
}
