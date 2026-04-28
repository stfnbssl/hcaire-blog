// Modale di anteprima output per uno step della pipeline Letture.
// Riceve i dati già caricati (da opera.pipeline.step_X.output) — nessun fetch interno.
// Toggle Vista strutturata / JSON, copia negli appunti, conteggio caratteri.

import { useMemo, useState } from 'react';
import LettureOutputViewer, { hasLettureViewer } from './LettureOutputViewer';

interface LettureOutputModalProps {
  stepId: string;
  stepLabel: string;
  data: unknown;
  onClose: () => void;
}

export default function LettureOutputModal({
  stepId, stepLabel, data, onClose,
}: LettureOutputModalProps) {
  const structuredAvailable = useMemo(() => hasLettureViewer(stepId), [stepId]);
  const [viewMode, setViewMode] = useState<'structured' | 'json'>(
    structuredAvailable ? 'structured' : 'json',
  );
  const [copied, setCopied] = useState(false);

  const pretty = useMemo(
    () => (data !== null && data !== undefined ? JSON.stringify(data, null, 2) : ''),
    [data],
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pretty);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-5 my-8 flex flex-col"
        style={{ maxHeight: 'calc(100vh - 4rem)' }}
      >
        <div className="flex items-start justify-between mb-3 flex-shrink-0">
          <div>
            <h3 className="font-semibold text-slate-900">Output di {stepLabel}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{stepId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Chiudi"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
          {structuredAvailable && (
            <div className="inline-flex rounded-md border border-slate-300 overflow-hidden">
              <button
                onClick={() => setViewMode('structured')}
                className={`text-xs px-2.5 py-1 transition-colors ${
                  viewMode === 'structured' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Vista
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`text-xs px-2.5 py-1 transition-colors ${
                  viewMode === 'json' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                JSON
              </button>
            </div>
          )}
          <button
            onClick={handleCopy}
            className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            {copied ? '✓ Copiato' : 'Copia JSON'}
          </button>
          <span className="text-xs text-slate-400">
            {pretty.length.toLocaleString('it-IT')} caratteri
          </span>
        </div>

        {data === null || data === undefined ? (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-500 italic">
            Output non disponibile.
          </div>
        ) : viewMode === 'json' ? (
          <pre className="flex-1 overflow-auto bg-slate-900 text-slate-100 text-xs font-mono p-4 rounded-md leading-relaxed">
            {pretty}
          </pre>
        ) : (
          <div className="flex-1 overflow-auto bg-white">
            <LettureOutputViewer stepId={stepId} data={data} />
          </div>
        )}

        <div className="flex justify-end pt-3 mt-2 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
