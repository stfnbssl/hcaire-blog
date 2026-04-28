import { useEffect, useRef, useState } from 'react';
import StepStatusBadge from './StepStatusBadge';
import type { EnrichedStepState, StepAction } from '../../../types/pipeline';

interface StepRowProps {
  state: EnrichedStepState;
  onLaunch: () => void;
  onCancel: () => void;
  onVerify: () => void;
  onProvideInput: () => void;
  onViewLogs: () => void;
  onSkip: () => void;
  onDecide: () => void;
  onShowHistory: () => void;
  onRollback: () => void;
  onViewOutput: () => void;
}

const ACTION_BUTTONS: Record<StepAction, { label: string; className: string } | null> = {
  launch:        { label: 'Lancia',           className: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  provide_input: { label: 'Fornisci input',   className: 'border border-blue-500 text-blue-700 hover:bg-blue-50' },
  awaiting_deps: { label: 'In attesa',        className: 'border border-slate-300 text-slate-400 cursor-not-allowed' },
  cancel:        { label: 'Annulla',          className: 'border border-red-400 text-red-700 hover:bg-red-50' },
  view_logs:     { label: 'Vedi log',         className: 'border border-blue-500 text-blue-700 hover:bg-blue-50' },
  verify:        { label: 'Verifica output',  className: 'bg-amber-500 hover:bg-amber-600 text-white' },
  relaunch:      { label: 'Rilancia',         className: 'border border-orange-500 text-orange-700 hover:bg-orange-50' },
  decide:        { label: 'Prendi decisione', className: 'bg-amber-500 hover:bg-amber-600 text-white' },
  none:          null,
};

export default function StepRow(props: StepRowProps) {
  const { state } = props;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Chiusura del menu su click esterno + ESC
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [menuOpen]);

  const btn = ACTION_BUTTONS[state.action];
  const isDisabled = state.action === 'awaiting_deps';

  function handlePrimary() {
    switch (state.action) {
      case 'launch':         return props.onLaunch();
      case 'provide_input':  return props.onProvideInput();
      case 'cancel':         return props.onCancel();
      case 'view_logs':      return props.onViewLogs();
      case 'verify':         return props.onVerify();
      case 'relaunch':       return props.onLaunch();
      case 'decide':         return props.onDecide();
      default: return;
    }
  }

  const showHistoryItem = state.status === 'completato' || state.status === 'verificato' || state.status === 'fallito' || state.status === 'richiede_correzione' || state.status === 'saltato';
  const showSkipItem = state.can_skip && (state.status === 'non_avviato' || state.status === 'attende_input');
  const isInTerminal = state.status === 'completato' || state.status === 'verificato' || state.status === 'saltato' || state.status === 'richiede_correzione' || state.status === 'fallito' || state.status === 'in_verifica';
  const showRollbackItem = isInTerminal;
  // Vedi output: solo per step che hanno prodotto un risultato e per cui esiste un'execution.
  // Esclude `saltato` (no output reale) e `fallito` (no output valido).
  const showViewOutputItem = !!state.last_execution_id && (
    state.status === 'completato' || state.status === 'verificato' || state.status === 'in_verifica' || state.status === 'richiede_correzione'
  );
  // Vedi log: per qualsiasi execution già avviata (incluso fallito, completato, ecc.) tranne
  // mentre è ancora in_esecuzione (lì il log è già accessibile dal pulsante primario).
  const showViewLogsItem = !!state.last_execution_id
    && state.status !== 'in_esecuzione'
    && state.status !== 'non_avviato'
    && state.status !== 'attende_input'
    && state.status !== 'attende_decisione';
  const rollbackDisabled = !state.is_rollbackable;
  const rollbackTitle = rollbackDisabled && state.rollback_blocked_by.length > 0
    ? `Bloccato da: ${state.rollback_blocked_by.map((b) => `${b.step_id} (${b.status})`).join(', ')}. Annulla prima quegli step.`
    : undefined;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3 flex-wrap">
        <StepStatusBadge status={state.status} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">{state.label}</p>
          <p className="text-xs text-slate-500 font-mono">{state.step_id}{state.current_run > 0 ? ` · run #${state.current_run}` : ''}</p>
        </div>
        {state.verifica_required && (
          <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">verifica richiesta</span>
        )}
        {btn && (
          <button
            onClick={handlePrimary}
            disabled={isDisabled}
            className={`text-sm px-3 py-1.5 rounded-md transition-colors ${btn.className}`}
            title={isDisabled && state.missing_pipeline_deps.length > 0
              ? state.missing_pipeline_deps.map((d) => `${d.step_id} (richiede ${d.required_status} — attuale ${d.current_status})`).join('\n')
              : undefined}
          >
            {btn.label}
          </button>
        )}
        {/* Cancel mentre in esecuzione: il primario è "Vedi log", aggiungo un secondario per
            terminare la run di Cowork. Backend e local server già supportano (SIGTERM al
            processo claude via CoworkRunner.cancel). */}
        {state.status === 'in_esecuzione' && (
          <button
            onClick={props.onCancel}
            className="text-sm px-3 py-1.5 rounded-md border border-red-400 text-red-700 hover:bg-red-50 transition-colors"
            title="Termina il processo Cowork in corso"
          >
            Annulla
          </button>
        )}
        {(showHistoryItem || showSkipItem || showRollbackItem || showViewOutputItem || showViewLogsItem) && (
          <div className="relative" ref={menuContainerRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="text-slate-400 hover:text-slate-700 px-2 py-1 rounded-md"
              aria-label="Altre azioni"
            >▾</button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-md shadow-md z-20 text-sm">
                {showViewOutputItem && (
                  <button
                    onClick={() => { setMenuOpen(false); props.onViewOutput(); }}
                    className="block w-full text-left px-3 py-2 hover:bg-slate-50"
                  >Vedi output</button>
                )}
                {showViewLogsItem && (
                  <button
                    onClick={() => { setMenuOpen(false); props.onViewLogs(); }}
                    className="block w-full text-left px-3 py-2 hover:bg-slate-50"
                  >Vedi log</button>
                )}
                {showSkipItem && (
                  <button
                    onClick={() => { setMenuOpen(false); props.onSkip(); }}
                    className="block w-full text-left px-3 py-2 hover:bg-slate-50"
                  >Salta step</button>
                )}
                {showHistoryItem && (
                  <button
                    onClick={() => { setMenuOpen(false); props.onShowHistory(); }}
                    className="block w-full text-left px-3 py-2 hover:bg-slate-50"
                  >Vedi storico run</button>
                )}
                {showRollbackItem && (
                  <button
                    onClick={() => { if (rollbackDisabled) return; setMenuOpen(false); props.onRollback(); }}
                    disabled={rollbackDisabled}
                    title={rollbackTitle}
                    className={`block w-full text-left px-3 py-2 ${rollbackDisabled ? 'text-slate-300 cursor-not-allowed' : 'text-red-700 hover:bg-red-50'}`}
                  >Annulla esecuzione{rollbackDisabled ? ' (bloccato)' : ''}</button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Blocking reasons */}
      {(state.action === 'awaiting_deps' && state.missing_pipeline_deps.length > 0) && (
        <div className="mt-3 rounded-md bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700">
          <p className="font-semibold mb-1">⚠ In attesa di:</p>
          <ul className="space-y-0.5 ml-4 list-disc">
            {state.missing_pipeline_deps.map((d) => (
              <li key={d.step_id}>
                <span className="font-mono">{d.step_id}</span> (richiede: <em>{d.required_status}</em> — attuale: <em>{d.current_status}</em>)
              </li>
            ))}
          </ul>
        </div>
      )}

      {(state.action === 'provide_input' && state.missing_external_inputs.length > 0) && (
        <div className="mt-3 rounded-md bg-blue-50 border border-blue-200 p-3 text-xs text-slate-700">
          <p className="font-semibold mb-1">✎ Input richiesti prima del lancio:</p>
          <ul className="space-y-0.5 ml-4 list-disc">
            {state.missing_external_inputs.map((i) => (
              <li key={i.input_id}>{i.label}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
