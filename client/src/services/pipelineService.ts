import { API_URL } from '../utils/constants';
import type {
  PipelineIndex,
  DeviceSnapshot,
  TemaIndexEntry,
  CanonicalDeviceShape,
  PipelineStepId,
  F3Step1Raw,
  F3Step3Raw,
  F3Step9Raw,
  F3Step10Raw,
  CorrectionEntry,
  OperativeProxy,
  ObservabilityRequirement,
  NonClassifiabilityRule,
} from '../types/pipeline';

const PIPELINE_BASE = '/pipeline';

// Carica l'output_data dell'ultima execution di uno step direttamente da Mongo.
// Sostituisce le letture statiche di /pipeline/temi/.../step-output-vN.json.
// Ritorna null su 404 (step non eseguito o output non ancora mirrorato).
async function fetchStepOutput<T>(contextId: string, stepId: PipelineStepId): Promise<T | null> {
  const res = await fetch(
    `${API_URL}/pipeline/contexts/${encodeURIComponent(contextId)}/steps/${stepId}/output`,
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Step output fetch failed: ${stepId} (${res.status})`);
  const body = await res.json();
  if (!body?.ok) throw new Error(body?.error?.message ?? 'Pipeline output API error');
  return body.data.output_data as T;
}

// L'indice arriva ora dall'API backend (D4 §10): MongoDB è la sorgente di verità.
export async function fetchPipelineIndex(): Promise<PipelineIndex> {
  const res = await fetch(`${API_URL}/pipeline/index`);
  if (!res.ok) throw new Error(`Pipeline index fetch failed (${res.status})`);
  const body = await res.json();
  if (!body?.ok) throw new Error(body?.error?.message ?? 'Pipeline index API error');
  return body.data as PipelineIndex;
}

function extractDevice(raw: unknown, shape: CanonicalDeviceShape): DeviceSnapshot {
  if (shape === 'device') {
    const r = raw as F3Step9Raw;
    const d = r.device;
    return normalizeDevice({
      ...d,
      operative_proxies: d.operative_proxies ?? [],
      observability_requirements: d.observability_requirements ?? [],
      non_classifiability_rules: d.non_classifiability_rules ?? [],
    });
  }
  if (shape === 'corrected_device') {
    const r = raw as F3Step3Raw;
    const d = r.corrected_device;
    return normalizeDevice({
      ...d,
      operative_proxies: (d as any).operative_proxies ?? [],
      observability_requirements: d.observability_requirements ?? [],
      non_classifiability_rules: d.non_classifiability_rules ?? [],
    });
  }
  const r = raw as F3Step1Raw;
  const d = r.results[0];
  const op = d.operative_proxy;
  return normalizeDevice({
    device_id: d.device_id,
    theme_id: d.theme_id,
    domain: d.domain,
    device_type: d.device_type,
    function: d.function,
    structural_reference: d.structural_reference,
    reading_focus: d.reading_focus,
    access_points: d.access_points,
    structural_questions: d.structural_questions,
    interpretive_warnings: d.interpretive_warnings,
    non_permitted_transformations: d.non_permitted_transformations,
    operative_proxies: op ? [op] : [],
    observability_requirements: d.observability_requirements ?? [],
    non_classifiability_rules: d.non_classifiability_rules ?? [],
    validation_structural_check: d.validation_structural_check,
  });
}

function normalizeDevice(d: DeviceSnapshot): DeviceSnapshot {
  return {
    ...d,
    operative_proxies: d.operative_proxies ?? [],
    observability_requirements: d.observability_requirements ?? [],
    non_classifiability_rules: d.non_classifiability_rules ?? [],
  };
}

// v3.0 (D7): rimosse F3Step6bRaw e applyStep6bOverride — vecchio f3_step_6b non
// esiste più, il dispositivo è prodotto in un unico passaggio (f3_step_2) con
// eventuale correzione in f3_step_3. Tipi importati `OperativeProxy`,
// `ObservabilityRequirement`, `NonClassifiabilityRule` restano disponibili per
// i viewer di temi storici.

export async function fetchStressTest(tema: TemaIndexEntry): Promise<F3Step10Raw | null> {
  // v3.0 (D7): lo stress test è ora prodotto da f3_step_3 (Stress test e correzione).
  // Il vecchio f3_step_10 è stato rimosso. Lo schema del nuovo output non coincide
  // con F3Step10Raw — il consumer (viewer pagine) potrebbe necessitare aggiornamento;
  // restituiamo unknown-as-F3Step10Raw per non rompere TypeScript senza un nuovo tipo.
  if (!tema.files.f3_step_3) return null;
  return fetchStepOutput<F3Step10Raw>(tema.id, 'f3_step_3');
}

export async function fetchCorrectionsLog(tema: TemaIndexEntry): Promise<Array<{ step: string; entries: CorrectionEntry[] }>> {
  // v3.0 (D7): l'unico step che produce correzioni è ora f3_step_3 (correzione
  // condizionale del dispositivo se i breaking point sono strutturali).
  const out: Array<{ step: string; entries: CorrectionEntry[] }> = [];
  if (!tema.files.f3_step_3) return out;
  try {
    const raw = await fetchStepOutput<{ corrections_log?: CorrectionEntry[] }>(tema.id, 'f3_step_3');
    if (raw?.corrections_log && raw.corrections_log.length > 0) {
      out.push({ step: 'f3_step_3', entries: raw.corrections_log });
    }
  } catch {
    // skip missing/malformed
  }
  return out;
}

// NB: revisioni.md non è ancora mirrorata in Mongo per le Produzioni — sarà oggetto di PR2.
// Resta la lettura statica per ora; sul cloud restituisce null se il file non è presente.
export async function fetchRevisioni(tema: TemaIndexEntry): Promise<string | null> {
  if (!tema.revisioni_file) return null;
  const res = await fetch(`${PIPELINE_BASE}/${tema.revisioni_file}`);
  if (!res.ok) return null;
  return res.text();
}

// Mappa shape → step_id (v3.0 / D7: allineata con pickCanonicalDevice lato server,
// che ora privilegia f3_step_4 → f3_step_3 → f3_step_2).
function shapeToStepId(shape: CanonicalDeviceShape): PipelineStepId {
  if (shape === 'device') return 'f3_step_4';
  if (shape === 'corrected_device') return 'f3_step_3';
  return 'f3_step_2';
}

export async function fetchDevice(tema: TemaIndexEntry): Promise<DeviceSnapshot | null> {
  if (!tema.canonical_device) return null;
  const raw = await fetchStepOutput<unknown>(tema.id, shapeToStepId(tema.canonical_device.shape));
  if (!raw) return null;
  const device = extractDevice(raw, tema.canonical_device.shape);
  // v3.0 (D7): rimosso il branch di override f3_step_6b — non esiste più.
  return device;
}
