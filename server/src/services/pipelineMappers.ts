// Funzioni pure di mapping da PipelineContext a TemaIndexEntry/RicercaIndexEntry.
// Non dipende da Mongoose: tutti i dati arrivano via parametri.
// Logica isolata per permettere test unit senza connessione DB.

export type CanonicalDeviceShape = 'device' | 'corrected_device' | 'result_0';

export interface MapperStepState {
  status: string;
  output_file?: string | null;
}

export interface MapperContextShared {
  context_id: string;
  label: string;
  step_states?: Record<string, MapperStepState> | null;
}

export interface MapperContextTema extends MapperContextShared {
  theme_id?: string | null;
  ricerca_origine?: string | null;
  dispositivo_sorgente?: { tema_id: string; file: string; device_id: string } | null;
  robustezza?: string | null;
  correzioni_residue?: number;
  has_revisioni?: boolean;
}

export interface MapperSkippedExec {
  step_id: string;
  skip_reason?: string | null;
}

export interface MapperExternalInput {
  step_id: string;
  label: string;
  file_path?: string | null;
}

export interface RicercaIndexEntry {
  id: string;
  label: string;
  steps_completed: string[];
  files: Record<string, string>;
}

export interface TemaIndexEntry {
  id: string;
  label: string;
  steps_completed: string[];
  files: Record<string, string>;
  canonical_device: { file: string; shape: CanonicalDeviceShape } | null;
  theme_id: string | null;
  ricerca_origine: string | null;
  dispositivo_sorgente: { tema_id: string; file: string; device_id: string } | null;
  steps_skipped: { step: string; reason: string }[];
  external_inputs: { step: string; file: string; type: string; label: string }[];
  robustezza: string | null;
  correzioni_residue: number;
  has_revisioni: boolean;
  revisioni_file: string | null;
}

// ---------- helpers puri ----------

export function filesFromStepStates(
  stepStates: Record<string, MapperStepState> | null | undefined,
): Record<string, string> {
  const out: Record<string, string> = {};
  if (!stepStates) return out;
  for (const [stepId, state] of Object.entries(stepStates)) {
    if (state?.output_file) out[stepId] = state.output_file;
  }
  return out;
}

export function pickCanonicalDevice(
  files: Record<string, string>,
): { file: string; shape: CanonicalDeviceShape } | null {
  // v3.0 (D7): pipeline F3 ridotta. Priorità: f3_step_4 (verdetto coerenza,
  // dispositivo finalizzato) → f3_step_3 (stress test/correzione, dispositivo
  // post-correzione se presente) → f3_step_2 (micro-dispositivo iniziale).
  if (files.f3_step_4) return { file: files.f3_step_4, shape: 'device' };
  if (files.f3_step_3) return { file: files.f3_step_3, shape: 'corrected_device' };
  if (files.f3_step_2) return { file: files.f3_step_2, shape: 'result_0' };
  return null;
}

export function sortF3Steps(stepIds: string[]): string[] {
  // Ordine: prima F2, poi F3, numerico crescente. 2a → 2.5, 4b → 4.5 (suffissi
  // F2 ancora in uso). I suffissi b/c di F3 sono stati eliminati in v3.0 (D7)
  // ma il pattern resta tollerante.
  return [...stepIds].sort((a, b) => {
    const re = /^(f2|f3)_step_(\d+)(a|b|c)?$/;
    const ma = a.match(re);
    const mb = b.match(re);
    if (!ma || !mb) return a.localeCompare(b);
    const phaseRank = (p: string) => (p === 'f2' ? 0 : 1);
    const pa = phaseRank(ma[1]);
    const pb = phaseRank(mb[1]);
    if (pa !== pb) return pa - pb;
    const suffOffset = (s?: string) => (s === 'a' ? 0.5 : s === 'b' ? 0.5 : s === 'c' ? 0.6 : 0);
    const na = parseInt(ma[2], 10) + suffOffset(ma[3]);
    const nb = parseInt(mb[2], 10) + suffOffset(mb[3]);
    return na - nb;
  });
}

// ---------- mapper puri ----------

export function mapRicercaContext(ctx: MapperContextShared): RicercaIndexEntry {
  const files = filesFromStepStates(ctx.step_states);
  return {
    id: ctx.context_id,
    label: ctx.label,
    steps_completed: sortF3Steps(Object.keys(files)),
    files,
  };
}

export function mapTemaContext(
  ctx: MapperContextTema,
  skippedExecs: MapperSkippedExec[],
  externalInputs: MapperExternalInput[],
): TemaIndexEntry {
  const files = filesFromStepStates(ctx.step_states);
  return {
    id: ctx.context_id,
    label: ctx.label,
    steps_completed: sortF3Steps(Object.keys(files)),
    files,
    canonical_device: pickCanonicalDevice(files),
    theme_id: ctx.theme_id ?? null,
    ricerca_origine: ctx.ricerca_origine ?? null,
    dispositivo_sorgente: ctx.dispositivo_sorgente
      ? {
          tema_id: ctx.dispositivo_sorgente.tema_id,
          file: ctx.dispositivo_sorgente.file,
          device_id: ctx.dispositivo_sorgente.device_id,
        }
      : null,
    steps_skipped: skippedExecs.map((e) => ({ step: e.step_id, reason: e.skip_reason ?? '' })),
    external_inputs: externalInputs.map((i) => ({
      step: i.step_id,
      file: i.file_path ?? '',
      type: 'esterno_obbligatorio',
      label: i.label,
    })),
    robustezza: ctx.robustezza ?? null,
    correzioni_residue: ctx.correzioni_residue ?? 0,
    has_revisioni: ctx.has_revisioni ?? false,
    revisioni_file: ctx.has_revisioni ? `temi/${ctx.context_id}/revisioni.md` : null,
  };
}
