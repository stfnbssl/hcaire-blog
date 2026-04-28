import { useEffect, useMemo, useState } from 'react';
import { pipelineOrchestratorService } from '../../../services/pipelineOrchestratorService';
import F2OutputViewer, { hasF2Viewer } from '../output-viewers/F2OutputViewer';
import F3OutputViewer, { hasF3Viewer } from '../output-viewers/F3OutputViewer';

interface ExecutionOutputViewerProps {
  executionId: string;
  stepId: string;
  stepLabel: string;
  runNumber?: number;
  onClose: () => void;
}

export default function ExecutionOutputViewer({
  executionId, stepId, stepLabel, runNumber, onClose,
}: ExecutionOutputViewerProps) {
  const [data, setData]   = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [outputFile, setOutputFile] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const structuredAvailable = useMemo(() => hasF2Viewer(stepId) || hasF3Viewer(stepId), [stepId]);
  const [viewMode, setViewMode] = useState<'structured' | 'json'>(structuredAvailable ? 'structured' : 'json');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    pipelineOrchestratorService.getExecutionOutput(executionId)
      .then((res) => {
        if (!mounted) return;
        setData(res.output_data);
        setOutputFile(res.output_file);
        setError(null);
      })
      .catch((e) => {
        if (!mounted) return;
        const status = (e as { status?: number }).status;
        const msg = (e as Error).message;
        setError(status === 404
          ? 'Output non disponibile per questa execution. Forse è una run precedente al mirroring su MongoDB.'
          : msg);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [executionId]);

  const pretty = data !== null && data !== undefined ? JSON.stringify(data, null, 2) : '';

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pretty);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-5 my-8 flex flex-col" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
        <div className="flex items-start justify-between mb-3 flex-shrink-0">
          <div>
            <h3 className="font-semibold text-slate-900">Output di {stepLabel}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {stepId}{runNumber ? ` · run #${runNumber}` : ''}
              {outputFile && <span className="ml-2 text-slate-400">— {outputFile}</span>}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Chiudi">✕</button>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-400" />
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex items-center gap-2 mb-3 flex-shrink-0">
              {structuredAvailable && (
                <div className="inline-flex rounded-md border border-slate-300 overflow-hidden">
                  <button
                    onClick={() => setViewMode('structured')}
                    className={`text-xs px-2.5 py-1 transition-colors ${viewMode === 'structured' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                  >Vista</button>
                  <button
                    onClick={() => setViewMode('json')}
                    className={`text-xs px-2.5 py-1 transition-colors ${viewMode === 'json' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                  >JSON</button>
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
            {viewMode === 'json' && (
              <pre className="flex-1 overflow-auto bg-slate-900 text-slate-100 text-xs font-mono p-4 rounded-md leading-relaxed">
                {pretty}
              </pre>
            )}
            {viewMode === 'structured' && (
              <div className="flex-1 overflow-auto bg-white">
                {hasF2Viewer(stepId) && <F2OutputViewer stepId={stepId} data={data} />}
                {hasF3Viewer(stepId) && <F3OutputViewer stepId={stepId} data={data} />}
              </div>
            )}
          </>
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
