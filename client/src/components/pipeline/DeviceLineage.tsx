import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { PipelineStepId, TemaIndexEntry, ExternalInput } from '../../types/pipeline';

const STEP_NAME: Record<PipelineStepId, string> = {
  f2_step_2: 'Rilevanza',
  f2_step_2a: 'Verifica nodi trasversali',
  f2_step_3: 'Verifica',
  f2_step_4: 'Matrice',
  f2_step_4b: 'CE prototipica',
  f2_step_5: 'Output family',
  f2_step_6: 'Output-tipo vuoto',
  f3_step_1: 'Lettura configurazionale',
  f3_step_2: 'Stress test',
  f3_step_3: 'Correzione strutturale',
  f3_step_4: 'Indistinguibility test',
  f3_step_5: 'Audit',
  f3_step_6: 'Proxy (rimozione)',
  f3_step_6b: 'Proxy stabilizzato',
  f3_step_7: 'Trasferibilità',
  f3_step_8: 'Adattamento strutturale',
  f3_step_9: 'Dispositivo completo',
  f3_step_10: 'Stress test dispositivo',
};

const INPUT_TYPE_COLOR: Record<string, string> = {
  pipeline: 'bg-slate-100 text-slate-700 border-slate-200',
  esterno_obbligatorio: 'bg-blue-100 text-blue-800 border-blue-200',
  esterno_facoltativo: 'bg-sky-100 text-sky-800 border-sky-200',
  dispositivo_sorgente: 'bg-purple-100 text-purple-800 border-purple-200',
};

const INPUT_TYPE_LABEL: Record<string, string> = {
  pipeline: 'pipeline',
  esterno_obbligatorio: 'esterno',
  esterno_facoltativo: 'esterno opz.',
  dispositivo_sorgente: 'dispositivo sorgente',
};

const F3_STEP_ORDER: PipelineStepId[] = [
  'f3_step_1', 'f3_step_2', 'f3_step_3', 'f3_step_4', 'f3_step_5',
  'f3_step_6', 'f3_step_6b', 'f3_step_7', 'f3_step_8', 'f3_step_9', 'f3_step_10',
];

// Heuristic mapping of pipeline inputs for each step.
function inferPipelineInputs(step: PipelineStepId, files: Partial<Record<PipelineStepId, string>>): PipelineStepId[] {
  const has = (s: PipelineStepId) => !!files[s];
  switch (step) {
    case 'f3_step_1':  return [];
    case 'f3_step_2':  return has('f3_step_1') ? ['f3_step_1'] : [];
    case 'f3_step_3':  return [has('f3_step_1') && 'f3_step_1', has('f3_step_2') && 'f3_step_2'].filter(Boolean) as PipelineStepId[];
    case 'f3_step_4':  return has('f3_step_3') ? ['f3_step_3'] : [];
    case 'f3_step_5':  return has('f3_step_3') ? ['f3_step_3'] : [];
    case 'f3_step_6':  return [has('f3_step_4') && 'f3_step_4', has('f3_step_5') && 'f3_step_5'].filter(Boolean) as PipelineStepId[];
    case 'f3_step_6b': return has('f3_step_6') ? ['f3_step_6'] : [];
    case 'f3_step_7':  return [has('f3_step_3') && 'f3_step_3', has('f3_step_6b') && 'f3_step_6b'].filter(Boolean) as PipelineStepId[];
    case 'f3_step_8':  return has('f3_step_7') ? ['f3_step_7'] : [];
    case 'f3_step_9':  return [has('f3_step_3') && 'f3_step_3', has('f3_step_6b') && 'f3_step_6b', has('f3_step_7') && 'f3_step_7', has('f3_step_8') && 'f3_step_8'].filter(Boolean) as PipelineStepId[];
    case 'f3_step_10': return has('f3_step_9') ? ['f3_step_9'] : has('f3_step_3') ? ['f3_step_3'] : [];
    default: return [];
  }
}

function shortFileName(path: string): string {
  return path.split('/').pop() ?? path;
}

function ExternalBadge({ ei }: { ei: ExternalInput }) {
  return (
    <div className={`text-xs font-medium px-2.5 py-1 rounded border ${INPUT_TYPE_COLOR[ei.type] ?? INPUT_TYPE_COLOR.pipeline}`}>
      <span className="opacity-70 mr-1">[{INPUT_TYPE_LABEL[ei.type] ?? ei.type}]</span>
      {ei.label}
    </div>
  );
}

function PipelineInputBadge({ step, filename }: { step: PipelineStepId; filename: string }) {
  return (
    <div className={`text-xs font-medium px-2.5 py-1 rounded border ${INPUT_TYPE_COLOR.pipeline}`}>
      <span className="opacity-70 mr-1">[pipeline]</span>
      <span className="font-mono">{step}</span>
      <span className="ml-1.5 text-slate-500">{shortFileName(filename)}</span>
    </div>
  );
}

export default function DeviceLineage({ tema }: { tema: TemaIndexEntry }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const skippedMap = useMemo(() => {
    const m = new Map<string, string>();
    (tema.steps_skipped ?? []).forEach((s) => m.set(s.step, s.reason));
    return m;
  }, [tema.steps_skipped]);

  const externalByStep = useMemo(() => {
    const m = new Map<string, ExternalInput[]>();
    (tema.external_inputs ?? []).forEach((ei) => {
      const arr = m.get(ei.step) ?? [];
      arr.push(ei);
      m.set(ei.step, arr);
    });
    return m;
  }, [tema.external_inputs]);

  const stepsOfInterest = F3_STEP_ORDER.filter((s) => tema.files[s] || skippedMap.has(s));

  function toggle(step: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(step)) next.delete(step); else next.add(step);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {/* Top: external attribution */}
      {(tema.dispositivo_sorgente || tema.ricerca_origine) && (
        <div className="rounded-lg border-2 border-dashed border-slate-200 bg-white p-4 mb-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Origine</p>
          <div className="flex flex-wrap gap-2">
            {tema.ricerca_origine && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded border ${INPUT_TYPE_COLOR.pipeline}`}>
                Ricerca: <span className="font-mono">{tema.ricerca_origine}</span>
              </span>
            )}
            {tema.dispositivo_sorgente && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded border ${INPUT_TYPE_COLOR.dispositivo_sorgente}`}>
                Dispositivo sorgente: <Link to={`/sviluppo-bambino/produzioni/pipeline/temi/${tema.dispositivo_sorgente.tema_id}`} className="font-mono underline">{tema.dispositivo_sorgente.tema_id}</Link>
              </span>
            )}
          </div>
        </div>
      )}

      {stepsOfInterest.map((step, i) => {
        const file = tema.files[step];
        const isSkipped = skippedMap.has(step);
        const skipReason = skippedMap.get(step);
        const pipelineInputs = file ? inferPipelineInputs(step, tema.files) : [];
        const externalInputs = externalByStep.get(step) ?? [];
        const isSourceDeviceInput = step === 'f3_step_7' && tema.dispositivo_sorgente;
        const isExpanded = expanded.has(step);
        const hasDetails = pipelineInputs.length > 0 || externalInputs.length > 0 || isSourceDeviceInput;

        return (
          <div key={step} className="relative">
            {i > 0 && (
              <div className="absolute left-8 -top-3 h-3 w-px bg-slate-300" aria-hidden />
            )}
            <div className={`rounded-lg border bg-white ${isSkipped ? 'border-dashed border-slate-300 opacity-70' : 'border-slate-200'}`}>
              <button
                onClick={() => hasDetails && toggle(step)}
                className={`w-full text-left px-5 py-3 flex items-center gap-4 ${hasDetails ? 'hover:bg-slate-50' : ''}`}
                disabled={!hasDetails}
              >
                <span className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
                  {step.replace(/^f3_step_/, '')}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">{STEP_NAME[step]}</p>
                  {file ? (
                    <p className="text-xs text-slate-500 font-mono truncate">{shortFileName(file)}</p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">saltato — {skipReason}</p>
                  )}
                </div>
                {hasDetails && (
                  <span className={`flex-shrink-0 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                )}
              </button>

              {isExpanded && hasDetails && (
                <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/70 space-y-4">
                  {(pipelineInputs.length > 0 || isSourceDeviceInput) && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Input pipeline</p>
                      <div className="flex flex-wrap gap-2">
                        {isSourceDeviceInput && tema.dispositivo_sorgente && (
                          <div className={`text-xs font-medium px-2.5 py-1 rounded border ${INPUT_TYPE_COLOR.dispositivo_sorgente}`}>
                            <span className="opacity-70 mr-1">[dispositivo sorgente]</span>
                            {tema.dispositivo_sorgente.tema_id} · <span className="font-mono">{shortFileName(tema.dispositivo_sorgente.file)}</span>
                          </div>
                        )}
                        {pipelineInputs.map((pi) => (
                          <PipelineInputBadge key={pi} step={pi} filename={tema.files[pi] ?? ''} />
                        ))}
                      </div>
                    </div>
                  )}

                  {externalInputs.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Input esterni forniti dal ricercatore</p>
                      <div className="flex flex-wrap gap-2">
                        {externalInputs.map((ei, idx) => <ExternalBadge key={idx} ei={ei} />)}
                      </div>
                    </div>
                  )}

                  {file && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Output prodotto</p>
                      <span className="text-xs font-mono text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded">
                        {shortFileName(file)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
