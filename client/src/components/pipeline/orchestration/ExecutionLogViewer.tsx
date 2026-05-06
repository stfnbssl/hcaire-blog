import { useEffect, useRef, useState } from 'react';
import { useExecutionLogs } from '../../../hooks/useExecutionLogs';

interface ExecutionLogViewerProps {
  executionId: string;
  stepId: string;
  stepLabel: string;
  runNumber?: number;
  onClose: () => void;
  onGoToVerify?: () => void;
}

const LEVEL_COLOR: Record<string, string> = {
  info: 'text-slate-200',
  warn: 'text-amber-300',
  error: 'text-red-300',
};

export default function ExecutionLogViewer(props: ExecutionLogViewerProps) {
  const { logs, status, isConnected, isFinished, error, failureError } = useExecutionLogs(props.executionId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll quando arrivano nuove righe (se l'utente non ha scrollato manualmente).
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Chiusura con ESC come fallback al bottone.
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') props.onClose();
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [props]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
    setAutoScroll(atBottom);
  }

  function copyLog() {
    const text = logs.map((l) => `${l.ts} ${l.level.toUpperCase().padEnd(5)} ${l.text}`).join('\n');
    void navigator.clipboard.writeText(text);
  }

  const isCompleted = status === 'completato' || status === 'verificato';
  const isInVerifica = status === 'in_verifica';
  const isFailed = status === 'fallito';

  return (
    <div className="fixed top-16 bottom-0 right-0 z-[60] w-full sm:max-w-2xl bg-slate-900 text-slate-100 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div>
          <p className="text-sm font-semibold">{props.stepLabel} <span className="text-slate-400 font-mono text-xs">{props.stepId}</span></p>
          <p className="text-xs text-slate-400">
            {props.runNumber ? `Run #${props.runNumber} · ` : ''}
            {!isFinished && isConnected && <span className="text-blue-300">● live</span>}
            {!isFinished && !isConnected && !error && <span className="text-amber-300">● connecting…</span>}
            {isFinished && <span className="text-emerald-300">● done</span>}
            {error && <span className="text-red-300">● {error}</span>}
            {status && <span className="ml-2">stato: {status}</span>}
          </p>
        </div>
        <button
          onClick={props.onClose}
          className="flex-shrink-0 flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:border-slate-500 transition-colors"
          aria-label="Chiudi pannello log"
          title="Chiudi (ESC)"
        >
          <span className="text-base leading-none">✕</span>
          <span>Chiudi</span>
        </button>
      </div>

      {/* Banner errore se la run è fallita */}
      {failureError && (
        <div className="border-b border-red-700 bg-red-950/60 px-4 py-3 flex-shrink-0">
          <p className="text-xs font-semibold text-red-300 mb-1 font-sans">
            ✗ Errore — fonte: {failureError.source}
          </p>
          <p className="text-sm text-red-100 leading-relaxed font-sans whitespace-pre-wrap">
            {failureError.message}
          </p>
          {failureError.detail && (
            <details className="mt-2">
              <summary className="text-xs text-red-300 cursor-pointer font-sans hover:text-red-200">Dettaglio tecnico</summary>
              <pre className="mt-2 text-xs text-red-200 whitespace-pre-wrap break-all">{failureError.detail}</pre>
            </details>
          )}
        </div>
      )}

      {/* Log */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 font-mono text-xs space-y-0.5"
      >
        {logs.length === 0 && (
          <p className="text-slate-500 italic">Nessun log al momento. In attesa di output dal server locale…</p>
        )}
        {logs.map((l, i) => (
          <div key={i} className={LEVEL_COLOR[l.level] ?? LEVEL_COLOR.info}>
            <span className="text-slate-500 mr-2">{new Date(l.ts).toLocaleTimeString('it-IT', { hour12: false })}</span>
            <span className="text-slate-500 mr-2">{l.level.toUpperCase().padEnd(5)}</span>
            <span className="whitespace-pre-wrap">{l.text}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 p-3 flex items-center gap-2 flex-wrap">
        {!autoScroll && !isFinished && (
          <button
            onClick={() => setAutoScroll(true)}
            className="text-xs px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200"
          >
            ↓ Riprendi auto-scroll
          </button>
        )}
        <button onClick={copyLog} className="text-xs px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200">Copia log</button>
        <div className="flex-1" />
        {isFinished && isCompleted && (
          <span className="text-emerald-300 text-sm">✓ Completato</span>
        )}
        {isFinished && isInVerifica && props.onGoToVerify && (
          <button
            onClick={props.onGoToVerify}
            className="text-xs px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white"
          >Vai alla verifica →</button>
        )}
        {isFinished && isFailed && (
          <span className="text-red-300 text-sm">✗ Fallito</span>
        )}
      </div>
    </div>
  );
}
