// Costanti condivise dal modulo pipeline (D6 §2).

import { dirname, join } from 'path';

export const COMMANDS_KEY = process.env.REDIS_PIPELINE_COMMANDS_KEY ?? 'hcaire:pipeline:commands';
export const EVENTS_CHANNEL = process.env.REDIS_PIPELINE_EVENTS_CHANNEL ?? 'hcaire:pipeline:events';

// Cartella dove vivono i CLAUDE.md degli step (input/produzioni)
export const STEPS_ROOT = process.env.PIPELINE_STEPS_ROOT
  ?? 'C:/Users/nnmrd/Documents/Claude/Projects/Sviluppo Bambino/input/produzioni';

// Cartella dove Cowork scrive gli output JSON
export const OUTPUT_ROOT = process.env.PIPELINE_OUTPUT_ROOT
  ?? 'C:/Users/nnmrd/Documents/Claude/Projects/Sviluppo Bambino/output/produzioni';

// Cartella dei 6 file precompilati degli assi strutturali (asse_1.json … asse_6.json).
// Usata per espandere l'input logico "assi-strutturali.json" in 6 file reali prima
// dell'invio a Cowork. Default: sibling di OUTPUT_ROOT (output/assi-strutturali/precompiled).
export const PRECOMPILED_AXES_DIR = process.env.PIPELINE_PRECOMPILED_AXES_DIR
  ?? join(dirname(OUTPUT_ROOT), 'assi-strutturali', 'precompiled');

// Cartella degli input esterni forniti dal ricercatore (in genere coincide con STEPS_ROOT)
export const INPUTS_ROOT = process.env.PIPELINE_INPUTS_ROOT ?? STEPS_ROOT;

// Cartella di lavoro Cowork (cwd dello spawn) — riusiamo l'env già usata da coworker.ts
export const COWORK_PROJECT_PATH = process.env.COWORK_SVILUPPO_BAMBINO_PATH
  ?? process.env.COWORK_PROJECT_PATH
  ?? STEPS_ROOT;

export const DEFAULT_TIMEOUT_MS = parseInt(process.env.PIPELINE_DEFAULT_TIMEOUT_MS ?? '300000', 10);
export const INLINE_FILE_THRESHOLD_BYTES = 50 * 1024;

// Modalità mock: salta lo spawn di Cowork e scrive un file segnaposto.
// Utile per testare end-to-end Redis/MongoDB/UI senza Cowork CLI.
export const MOCK_MODE = (process.env.PIPELINE_MOCK_MODE ?? 'true').toLowerCase() === 'true';

export const SERVER_VERSION = '1.0.0';

// step_id → cartella sotto STEPS_ROOT (D6 §2)
// f2_step_1 rimosso: la discovery temi è ora gestita dall'Archivio temi.
export const STEP_FOLDER_MAP: Record<string, string> = {
  'f2_step_2':  'f2-step-2-rilevanza-strutturale',
  'f2_step_2a': 'f2-step-2a-verifica-nodi-trasversali',
  'f2_step_3':  'f2-step-3-verifica-strutturale',
  'f2_step_4':  'f2-step-4-micro-matrice',
  'f2_step_4b': 'f2-step-4b-ce-prototipica',
  'f2_step_5':  'f2-step-5-output-family',
  'f2_step_6':  'f2-step-6-output-tipo-vuoto',
  'f3_step_1':  'f3-step-1-dispositivo-lettura',
  'f3_step_2':  'f3-step-2-stress-test',
  'f3_step_3':  'f3-step-3-correzione-strutturale',
  'f3_step_4':  'f3-step-4-indistinguibilità',
  'f3_step_5':  'f3-step-5-audit',
  'f3_step_6':  'f3-step-6-stabilizzazione-proxy',
  'f3_step_6b': 'f3-step-6-stabilizzazione-proxy',
  'f3_step_6c': 'f3-step-6-stabilizzazione-proxy',
  'f3_step_7':  'f3-step-7-trasferibilità-dispositivo',
  'f3_step_8':  'f3-step-8-adattamento-strutturale',
  'f3_step_9':  'f3-step-9-dispositivo-completo',
  'f3_step_10': 'f3-step-10-stress-test-dispositivo',
};

// Per varianti del CLAUDE.md nelle stessa cartella (es. step 6/6b/6c)
export const STEP_CLAUDE_FILE_MAP: Record<string, string> = {
  'f3_step_6':  'CLAUDE.md',
  'f3_step_6b': 'CLAUDE-B.md',
  'f3_step_6c': 'CLAUDE-C.md',
};
