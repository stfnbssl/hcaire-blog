import path from 'path';
import { promises as fs, existsSync } from 'fs';

export interface StepConfigInputPipeline {
  step: string;
  role: string;
  required: boolean;
  requires_verifica?: boolean;
  note?: string;
}

export interface StepConfigInputEsterno {
  id: string;
  label: string;
  type: 'esterno_obbligatorio' | 'esterno_facoltativo';
  schema?: string | null;
  values?: string[];
  default?: string;
  file_template?: string;
  note?: string;
}

export interface StepConfigDispositivoSorgente {
  required: boolean | string;
  description: string;
  path_template: string;
}

export interface StepConfig {
  id: string;
  label: string;
  phase: 'F2' | 'F3';
  output_prefix: string;
  output_suffix?: string;
  output_path_template: string;
  note?: string;
  // Step normali usano inputs_pipeline; step 9 usa inputs_pipeline_standard / inputs_pipeline_skip_8
  inputs_pipeline?: StepConfigInputPipeline[];
  inputs_pipeline_standard?: StepConfigInputPipeline[];
  inputs_pipeline_skip_8?: StepConfigInputPipeline[];
  inputs_strutturali?: string[];
  inputs_dispositivo_sorgente?: StepConfigDispositivoSorgente;
  inputs_esterni?: StepConfigInputEsterno[];
  verifica: boolean;
  overrides?: string[];
  can_skip: boolean;
  skip_condition?: string;
  blocks?: string[];
}

export interface PipelineStepConfig {
  $schema_version?: string;
  description?: string;
  steps: StepConfig[];
}

// Risolve il path della step config provando, in ordine:
//   1. PIPELINE_STEP_CONFIG_PATH (env, override esplicito)
//   2. <server>/dist/pipeline-step-config.json — copiato dal postbuild (deploy cloud)
//   3. <server>/pipeline-step-config.json — eventuale copia in server/ (fallback)
//   4. <repo>/client/public/pipeline/pipeline-step-config.json — sviluppo locale
function resolveConfigPath(): string {
  if (process.env.PIPELINE_STEP_CONFIG_PATH) {
    return process.env.PIPELINE_STEP_CONFIG_PATH;
  }
  const candidates = [
    path.resolve(__dirname, '..', 'pipeline-step-config.json'),
    path.resolve(__dirname, '..', '..', 'pipeline-step-config.json'),
    path.resolve(__dirname, '..', '..', '..', 'client', 'public', 'pipeline', 'pipeline-step-config.json'),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  // Restituisce comunque l'ultimo (path repo) per generare un errore chiaro a fs.readFile.
  return candidates[candidates.length - 1];
}

let cached: PipelineStepConfig | null = null;
let cachedById: Map<string, StepConfig> | null = null;

export async function loadStepConfig(): Promise<PipelineStepConfig> {
  if (cached) return cached;
  const configPath = resolveConfigPath();
  let raw: string;
  try {
    raw = await fs.readFile(configPath, 'utf8');
  } catch (e) {
    throw new Error(
      `Impossibile leggere pipeline-step-config.json (${configPath}): ${(e as Error).message}. ` +
      `Imposta PIPELINE_STEP_CONFIG_PATH oppure verifica il postbuild di server/.`,
    );
  }
  const parsed = JSON.parse(raw) as PipelineStepConfig;
  if (!Array.isArray(parsed.steps)) {
    throw new Error(`pipeline-step-config.json invalido: manca array "steps"`);
  }
  cached = parsed;
  cachedById = new Map(parsed.steps.map((s) => [s.id, s]));
  return cached;
}

export async function getStepConfigById(stepId: string): Promise<StepConfig | null> {
  await loadStepConfig();
  return cachedById?.get(stepId) ?? null;
}

export function clearStepConfigCache(): void {
  cached = null;
  cachedById = null;
}
