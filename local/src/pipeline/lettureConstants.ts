// Costanti dedicate alla pipeline Letture (parallela a quella di Sviluppo Bambino).
// Canali Redis e percorsi sono separati: nessuna interferenza con `constants.ts`.

import { join } from 'path';

// ---------- canali Redis ----------

export const LETTURE_COMMANDS_KEY  = process.env.REDIS_LETTURE_COMMANDS_KEY  ?? 'hcaire:letture:commands';
export const LETTURE_EVENTS_CHANNEL = process.env.REDIS_LETTURE_EVENTS_CHANNEL ?? 'hcaire:letture:events';

// ---------- filesystem ----------

// Cartella che ospita i CLAUDE.md (e gli schema.json di riferimento) di pipeline-0 e pipeline-1.
// Default basato sul desktop di sviluppo del project owner.
export const LETTURE_SPECS_ROOT = process.env.PIPELINE_SPECS_ROOT_LETTURE
  ?? 'C:/Users/nnmrd/Documents/Claude/Projects/HCAIRE Cultura';

// Cartella dove Cowork scrive i file di output. Letture: <root>/<slug>/  (step 1-4)
// e <root>/<slug>/editorial/  (step 5a-5f).
export const LETTURE_OUTPUT_ROOT = process.env.PIPELINE_OUTPUT_ROOT_LETTURE
  ?? 'C:/Users/nnmrd/Documents/Claude/Projects/HCAIRE Cultura/letture';

// Cartella dei 6 assi strutturali precompilati (input dello step 3).
// In dev: condivisi con Sviluppo Bambino. In prod: copiati in server/schemas/letture/assi/.
export const LETTURE_ASSI_DIR = process.env.PIPELINE_LETTURE_ASSI_DIR
  ?? 'C:/Users/nnmrd/Documents/Claude/Projects/Sviluppo Bambino/output/assi-strutturali/precompiled';

// File `stile-editoriale.md` letto da Cowork agli step 5C–5F. Inlinato nel prompt
// se presente; ignorato in silenzio se mancante.
export const LETTURE_STILE_EDITORIALE_PATH = process.env.PIPELINE_LETTURE_STILE_PATH
  ?? join(LETTURE_SPECS_ROOT, 'pipeline-1', 'stile-editoriale.md');

// Riusiamo la cwd di Cowork già configurata per Sviluppo Bambino se presente,
// altrimenti il root degli specs di Letture.
export const LETTURE_COWORK_PROJECT_PATH = process.env.COWORK_LETTURE_PATH
  ?? process.env.COWORK_PROJECT_PATH
  ?? LETTURE_SPECS_ROOT;

// Riuso le stesse soglie generali della pipeline Sviluppo Bambino.
export const DEFAULT_TIMEOUT_MS = parseInt(process.env.PIPELINE_DEFAULT_TIMEOUT_MS ?? '300000', 10);
export const INLINE_FILE_THRESHOLD_BYTES = 50 * 1024;
export const MOCK_MODE = (process.env.PIPELINE_MOCK_MODE ?? 'true').toLowerCase() === 'true';

// ---------- mappatura step ----------

// Wire identifiers (su Redis): `lett_step_*`. Il documento Opera usa solo il suffisso
// (`step_1`, `step_5d`) — convertiamo via stripPrefix() / addPrefix().
export const LETTURE_STEP_IDS = [
  'step_1', 'step_2', 'step_3', 'step_4',
  'step_5a', 'step_5b', 'step_5c', 'step_5d', 'step_5e', 'step_5f',
] as const;
export type LettureStepId = typeof LETTURE_STEP_IDS[number];

export const LETT_PREFIX = 'lett_';
export function stripPrefix(wireStepId: string): string {
  return wireStepId.startsWith(LETT_PREFIX) ? wireStepId.slice(LETT_PREFIX.length) : wireStepId;
}
export function addPrefix(stepId: string): string {
  return stepId.startsWith(LETT_PREFIX) ? stepId : LETT_PREFIX + stepId;
}

// Cartella dello step (relativa a LETTURE_SPECS_ROOT) che contiene CLAUDE.md + schema.json.
export const LETTURE_STEP_FOLDER_MAP: Record<LettureStepId, string> = {
  step_1:  'pipeline-0/step-1-dossier-contenutistico',
  step_2:  'pipeline-0/step-2-lettura-libera-orientata',
  step_3:  'pipeline-0/step-3-lettura-strutturata-per-assi',
  step_4:  'pipeline-0/step-4-saggio-critico-revisione',
  step_5a: 'pipeline-1/step-5a-selezione-editoriale',
  step_5b: 'pipeline-1/step-5b-scaletta',
  step_5c: 'pipeline-1/step-5c-stesura',
  step_5d: 'pipeline-1/step-5d-revisione-finale',
  step_5e: 'pipeline-1/step-5e-resoconto-processo',
  step_5f: 'pipeline-1/step-5f-saggio-integrato',
};

// Filename JSON che Cowork deve produrre. Il server costruisce gli input_files
// usando questi nomi, quindi vanno mantenuti coerenti tra server e local.
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

// Step che producono Markdown affiancato al JSON.
export const LETTURE_STEP_MD_FILENAME: Partial<Record<LettureStepId, string>> = {
  step_5d: 'articolo-finale.md',
  step_5e: 'resoconto-processo.md',
  step_5f: 'saggio-integrato.md',
};

export function isEditorialStep(stepId: LettureStepId | string): boolean {
  return stepId === 'step_5a' || stepId === 'step_5b' || stepId === 'step_5c'
      || stepId === 'step_5d' || stepId === 'step_5e' || stepId === 'step_5f';
}

// Cartella di output per uno step di una specifica opera. Step 1-4 sotto {slug}/,
// step 5a-5f sotto {slug}/editorial/.
export function outputDirFor(slug: string, stepId: LettureStepId | string): string {
  return isEditorialStep(stepId)
    ? join(LETTURE_OUTPUT_ROOT, slug, 'editorial')
    : join(LETTURE_OUTPUT_ROOT, slug);
}
