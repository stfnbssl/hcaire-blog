// Mappe condivise tra controller (build dei comandi) e subscriber (lettura output).
// Mantenere allineate con `local/src/pipeline/lettureConstants.ts`.
//
// Convenzione step_id:
//   - sul wire Redis → `lett_step_X`
//   - nel documento `Opera`     → `step_X` (stripPrefix)

import path from 'path';
import { LettureStepId } from '../models/Opera';

// ---------- prefix wire/doc ----------

export const LETT_PREFIX = 'lett_';

export function stripPrefix(wireStepId: string): string {
  return wireStepId.startsWith(LETT_PREFIX) ? wireStepId.slice(LETT_PREFIX.length) : wireStepId;
}
export function addPrefix(stepId: string): string {
  return stepId.startsWith(LETT_PREFIX) ? stepId : LETT_PREFIX + stepId;
}

// ---------- filename JSON prodotti da Cowork ----------

export const LETTURE_STEP_OUTPUT_FILENAME: Record<LettureStepId, string> = {
  step_1:  'step-1-dossier-contenutistico.json',
  step_2:  'step-2-lettura-libera-orientata.json',
  step_3:  'step-3-lettura-strutturata-per-assi.json',
  step_4:  'step-4-saggio-critico-revisione.json',
  step_5a: 'step-5a-selezione-editoriale.json',
  step_5b: 'step-5b-scaletta.json',
  step_5c: 'step-5c-stesura.json',
  step_5d: 'step-5d-revisione-finale.json',
  step_5e: 'step-5e-resoconto-processo.json',
  step_5f: 'step-5f-saggio-integrato.json',
};

// ---------- filename Markdown affiancato (solo 5d/5e/5f) ----------

export const LETTURE_STEP_MD_FILENAME: Partial<Record<LettureStepId, string>> = {
  step_5d: 'articolo-finale.md',
  step_5e: 'resoconto-processo.md',
  step_5f: 'saggio-integrato.md',
};

// ---------- schema JSON file (per Ajv) ----------

export const LETTURE_STEP_SCHEMA_FILE: Record<LettureStepId, string> = {
  step_1:  'step-1-dossier-contenutistico.schema.json',
  step_2:  'step-2-lettura-libera-orientata.schema.json',
  step_3:  'step-3-lettura-strutturata-per-assi.schema.json',
  step_4:  'step-4-saggio-critico-revisione.schema.json',
  step_5a: 'step-5a-selezione-editoriale.schema.json',
  step_5b: 'step-5b-scaletta.schema.json',
  step_5c: 'step-5c-stesura.schema.json',
  step_5d: 'step-5d-revisione-finale.schema.json',
  step_5e: 'step-5e-resoconto-processo.schema.json',
  step_5f: 'step-5f-saggio-integrato.schema.json',
};

// ---------- cartelle ----------

// Root degli output Cowork. Mongo è source of truth, ma il file system è
// dove server e local si sincronizzano per scrivere/leggere file. In dev coincidono;
// in prod va configurato un percorso condiviso.
export const LETTURE_OUTPUT_ROOT = process.env.PIPELINE_OUTPUT_ROOT_LETTURE
  ?? 'C:/Users/nnmrd/Documents/Claude/Projects/HCAIRE Cultura/letture';

// Cartella dei 6 assi precompilati (input dello step_3).
// Default: condivisi con Sviluppo Bambino (precompiled).
export const LETTURE_ASSI_DIR = process.env.PIPELINE_LETTURE_ASSI_DIR
  ?? 'C:/Users/nnmrd/Documents/Claude/Projects/Sviluppo Bambino/output/assi-strutturali/precompiled';

// Schemas Ajv (validazione output Cowork).
export const LETTURE_SCHEMAS_DIR = path.resolve(__dirname, '..', '..', 'schemas', 'letture');

export function isEditorialStep(stepId: LettureStepId | string): boolean {
  return stepId === 'step_5a' || stepId === 'step_5b' || stepId === 'step_5c'
      || stepId === 'step_5d' || stepId === 'step_5e' || stepId === 'step_5f';
}

// Cartella di output di uno step per una specifica opera.
export function outputDirFor(slug: string, stepId: LettureStepId | string): string {
  return isEditorialStep(stepId)
    ? path.join(LETTURE_OUTPUT_ROOT, slug, 'editorial')
    : path.join(LETTURE_OUTPUT_ROOT, slug);
}

// Path assoluto del file JSON prodotto da uno step.
export function outputJsonPathFor(slug: string, stepId: LettureStepId): string {
  return path.join(outputDirFor(slug, stepId), LETTURE_STEP_OUTPUT_FILENAME[stepId]);
}

// Path assoluto del file Markdown prodotto da uno step (null se step non lo produce).
export function outputMdPathFor(slug: string, stepId: LettureStepId): string | null {
  const md = LETTURE_STEP_MD_FILENAME[stepId];
  if (!md) return null;
  return path.join(outputDirFor(slug, stepId), md);
}
