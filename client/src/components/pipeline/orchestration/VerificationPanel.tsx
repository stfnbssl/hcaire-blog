import { useEffect, useState } from 'react';
import type { VerificaOutcome } from '../../../types/pipeline';

interface VerificationPanelProps {
  executionId: string;
  stepId: string;
  stepLabel: string;
  runNumber?: number;
  outputFile: string | null;     // path relativo a /pipeline/
  onVerify: (outcome: VerificaOutcome, notes: string, feedback: string) => Promise<void>;
  onClose: () => void;
}

export default function VerificationPanel(props: VerificationPanelProps) {
  const [outcome, setOutcome] = useState<VerificaOutcome>('approvato');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  const [output, setOutput] = useState<unknown | null>(null);
  const [loadingOutput, setLoadingOutput] = useState(false);
  const [outputErr, setOutputErr] = useState<string | null>(null);

  useEffect(() => {
    if (!props.outputFile) return;
    setLoadingOutput(true);
    setOutputErr(null);
    fetch(`/pipeline/${props.outputFile}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((j) => setOutput(j))
      .catch((e) => setOutputErr((e as Error).message))
      .finally(() => setLoadingOutput(false));
  }, [props.outputFile]);

  const showRichiede6c = props.stepId === 'f3_step_6b';
  const needsFeedback = outcome !== 'approvato';
  const canSubmit = !submitting && (!needsFeedback || feedback.trim().length > 0);

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitErr(null);
    try {
      await props.onVerify(outcome, notes, feedback);
      props.onClose();
    } catch (e) {
      setSubmitErr((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
          <div>
            <p className="font-semibold text-slate-900">Verifica output</p>
            <p className="text-xs text-slate-500">
              <span className="font-mono">{props.stepId}</span> · {props.stepLabel}
              {props.runNumber ? ` · run #${props.runNumber}` : ''}
            </p>
          </div>
          <button onClick={props.onClose} className="text-slate-400 hover:text-slate-700" aria-label="Chiudi">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Output preview */}
          <section>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Output prodotto</h4>
            {loadingOutput && <p className="text-sm text-slate-500">Caricamento…</p>}
            {outputErr && <p className="text-sm text-red-700">Errore caricamento output: {outputErr}</p>}
            {!loadingOutput && !outputErr && output !== null && (
              <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-md max-h-[40vh] overflow-auto font-mono">
                {JSON.stringify(output, null, 2)}
              </pre>
            )}
            {!props.outputFile && (
              <p className="text-sm text-slate-500 italic">Nessun output file disponibile (lo step potrebbe non averne ancora prodotto uno).</p>
            )}
          </section>

          {/* Esito */}
          <section>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Esito della verifica</h4>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">
                <input type="radio" checked={outcome === 'approvato'} onChange={() => setOutcome('approvato')} className="mt-1" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Approvato</p>
                  <p className="text-xs text-slate-500">Lo step è verificato. Sblocca gli step dipendenti.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer">
                <input type="radio" checked={outcome === 'richiede_correzione'} onChange={() => setOutcome('richiede_correzione')} className="mt-1" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Richiede correzione</p>
                  <p className="text-xs text-slate-500">Lo step va ri-eseguito con feedback. Step dipendenti rimangono bloccati.</p>
                </div>
              </label>
              {showRichiede6c && (
                <label className="flex items-start gap-3 p-3 border border-amber-200 bg-amber-50 rounded-md hover:bg-amber-100 cursor-pointer">
                  <input type="radio" checked={outcome === 'richiede_6c'} onChange={() => setOutcome('richiede_6c')} className="mt-1" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Richiede integrazione (6c)</p>
                    <p className="text-xs text-amber-800">Specifico per f3_step_6b: la verifica indica un aggiornamento strutturale del dispositivo.</p>
                  </div>
                </label>
              )}
            </div>
          </section>

          {/* Note */}
          <section>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Note (opzionale)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
          </section>

          {/* Feedback obbligatorio */}
          {needsFeedback && (
            <section>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Motivazione *</label>
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="Obbligatoria se non approvato" />
            </section>
          )}

        </div>

        {submitErr && (
          <div className="px-4 pt-3 flex-shrink-0">
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
              <p className="font-semibold mb-1">Errore durante la verifica</p>
              <p>{submitErr}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 p-4 border-t border-slate-200 flex-shrink-0">
          <button onClick={props.onClose} className="text-sm px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Annulla</button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="text-sm px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
          >Conferma verifica →</button>
        </div>
      </div>
    </div>
  );
}
