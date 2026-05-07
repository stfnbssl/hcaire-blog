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

export const DEFAULT_TIMEOUT_MS = parseInt(process.env.PIPELINE_DEFAULT_TIMEOUT_MS ?? '600000', 10);
export const INLINE_FILE_THRESHOLD_BYTES = 50 * 1024;

// Modalità mock: salta lo spawn di Cowork e scrive un file segnaposto.
// Utile per testare end-to-end Redis/MongoDB/UI senza Cowork CLI.
export const MOCK_MODE = (process.env.PIPELINE_MOCK_MODE ?? 'true').toLowerCase() === 'true';

export const SERVER_VERSION = '1.0.0';

// step_id → cartella sotto STEPS_ROOT (D6 §2)
// f2_step_1 rimosso: la discovery temi è ora gestita dall'Archivio temi.
// v3.0 (D7): pipeline F3 ridotta da 11 a 5 step. Le vecchie cartelle
// f3-step-{1-dispositivo-lettura, 2-stress-test, 3-correzione-strutturale,
// 4-indistinguibilità, 5-audit, 6-stabilizzazione-proxy, 7-trasferibilità-dispositivo,
// 8-adattamento-strutturale, 9-dispositivo-completo, 10-stress-test-dispositivo}
// vanno rimosse manualmente dal filesystem Cowork (vedi D7 §3.1).
export const STEP_FOLDER_MAP: Record<string, string> = {
  'f2_step_2':  'f2-step-2-rilevanza-strutturale',
  'f2_step_2a': 'f2-step-2a-verifica-nodi-trasversali',
  'f2_step_3':  'f2-step-3-verifica-strutturale',
  'f2_step_4':  'f2-step-4-micro-matrice',
  'f2_step_4b': 'f2-step-4b-ce-prototipica',
  'f2_step_5':  'f2-step-5-output-family',
  'f2_step_6':  'f2-step-6-output-tipo-vuoto',
  'f3_step_1':  'f3-step-1-nodo-funzione',
  'f3_step_2':  'f3-step-2-micro-dispositivo',
  'f3_step_3':  'f3-step-3-stress-test',
  'f3_step_4':  'f3-step-4-coerenza',
  'f3_step_5':  'f3-step-5-output-tipo-contestualizzato',
};

// v3.0 (D7): rimosse le varianti CLAUDE-B.md / CLAUDE-C.md di vecchio f3_step_6.
// Tutti gli step ora usano il CLAUDE.md di default (resolver fallback in PromptComposer).
export const STEP_CLAUDE_FILE_MAP: Record<string, string> = {};
