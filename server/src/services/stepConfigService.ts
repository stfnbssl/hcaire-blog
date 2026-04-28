import path from 'path';
import { promises as fs } from 'fs';

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

const CONFIG_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'client',
  'public',
  'pipeline',
  'pipeline-step-config.json',
);

let cached: PipelineStepConfig | null = null;
let cachedById: Map<string, StepConfig> | null = null;

export async function loadStepConfig(): Promise<PipelineStepConfig> {
  if (cached) return cached;
  const raw = await fs.readFile(CONFIG_PATH, 'utf8');
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
