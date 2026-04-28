import { API_URL } from '../utils/constants';
import type {
  PipelineIndex,
  DeviceSnapshot,
  TemaIndexEntry,
  CanonicalDeviceShape,
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

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${PIPELINE_BASE}/${path}`);
  if (!res.ok) throw new Error(`Pipeline fetch failed: ${path} (${res.status})`);
  return res.json();
}

// L'indice arriva ora dall'API backend (D4 §10): MongoDB è la sorgente di verità.
// I file statici degli artefatti continuano a essere serviti da /pipeline/.
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

// Step 6-B produces a stabilized operative_proxy that replaces the one in the device.
// The file uses `required_observations` at the top level instead of `observability_requirements`.
type F3Step6bRaw = {
  step: 'f3_step_6b';
  operative_proxy?: OperativeProxy;
  required_observations?: ObservabilityRequirement[];
  observability_requirements?: ObservabilityRequirement[];
  non_classifiability_rules?: NonClassifiabilityRule[];
};

function applyStep6bOverride(device: DeviceSnapshot, step6b: F3Step6bRaw): DeviceSnapshot {
  const next = { ...device };
  if (step6b.operative_proxy) {
    next.operative_proxies = [step6b.operative_proxy];
  }
  const obs = step6b.observability_requirements ?? step6b.required_observations;
  if (obs?.length) {
    next.observability_requirements = obs;
  }
  if (step6b.non_classifiability_rules?.length) {
    next.non_classifiability_rules = step6b.non_classifiability_rules;
  }
  return next;
}

export async function fetchStressTest(tema: TemaIndexEntry): Promise<F3Step10Raw | null> {
  const file = tema.files.f3_step_10;
  if (!file) return null;
  return fetchJson<F3Step10Raw>(file);
}

export async function fetchCorrectionsLog(tema: TemaIndexEntry): Promise<Array<{ step: string; entries: CorrectionEntry[] }>> {
  const out: Array<{ step: string; entries: CorrectionEntry[] }> = [];
  for (const step of ['f3_step_3', 'f3_step_6', 'f3_step_8'] as const) {
    const file = tema.files[step];
    if (!file) continue;
    try {
      const raw = await fetchJson<{ corrections_log?: CorrectionEntry[] }>(file);
      if (raw.corrections_log && raw.corrections_log.length > 0) {
        out.push({ step, entries: raw.corrections_log });
      }
    } catch {
      // skip missing/malformed
    }
  }
  return out;
}

export async function fetchRevisioni(tema: TemaIndexEntry): Promise<string | null> {
  if (!tema.revisioni_file) return null;
  const res = await fetch(`${PIPELINE_BASE}/${tema.revisioni_file}`);
  if (!res.ok) return null;
  return res.text();
}

export async function fetchExternalInput(path: string): Promise<unknown> {
  return fetchJson<unknown>(path);
}

export async function fetchDevice(tema: TemaIndexEntry): Promise<DeviceSnapshot | null> {
  if (!tema.canonical_device) return null;
  const raw = await fetchJson<unknown>(tema.canonical_device.file);
  let device = extractDevice(raw, tema.canonical_device.shape);
  const step6bFile = tema.files.f3_step_6b;
  if (step6bFile) {
    try {
      const s6b = await fetchJson<F3Step6bRaw>(step6bFile);
      device = applyStep6bOverride(device, s6b);
    } catch {
      // step 6-B optional override; ignore if missing
    }
  }
  return device;
}
