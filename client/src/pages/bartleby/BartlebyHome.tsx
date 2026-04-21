import { useEffect, useState, useCallback, useRef } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import BartlebyNav from '../../components/bartleby/BartlebyNav';
import TraceForm from '../../components/bartleby/TraceForm';
import { getDomainAreas, getOutputTemplates, getMyTraces } from '../../services/bartlebyService';
import type { DomainArea, OutputTemplate, InputTrace } from '../../types/bartleby';

const PENDING_KEY = 'bartleby_pending_trace';
const POLL_MS     = 10_000;

const STATUS_LABEL: Record<string, string> = {
  pending:    'In coda...',
  processing: 'In elaborazione...',
  done:       'Completata',
  error:      'Errore',
};

export default function BartlebyHome() {
  const { user }     = useUser();
  const { getToken } = useAuth();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const [domainAreas, setDomainAreas]         = useState<DomainArea[]>([]);
  const [outputTemplates, setOutputTemplates] = useState<OutputTemplate[]>([]);
  const [loading, setLoading]                 = useState(true);

  // traccia pending
  const [pendingTrace, setPendingTrace] = useState<InputTrace | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Carica domainAreas + templates
  useEffect(() => {
    Promise.all([getDomainAreas(), getOutputTemplates()])
      .then(([areas, templates]) => {
        setDomainAreas(areas);
        setOutputTemplates(templates);
      })
      .finally(() => setLoading(false));
  }, []);

  // Polling stato traccia pending
  const checkPending = useCallback(async () => {
    const pendingId = sessionStorage.getItem(PENDING_KEY);
    if (!pendingId) {
      setPendingTrace(null);
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      return;
    }
    try {
      const token = await getToken();
      if (!token) return;
      const traces = await getMyTraces(token);
      const trace  = traces.find((t) => t._id === pendingId);
      if (!trace) {
        sessionStorage.removeItem(PENDING_KEY);
        setPendingTrace(null);
        return;
      }
      setPendingTrace(trace);
      if (trace.status === 'done' || trace.status === 'error') {
        sessionStorage.removeItem(PENDING_KEY);
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      }
    } catch { /* silenzioso */ }
  }, [getToken]);

  useEffect(() => {
    if (!isAdmin) return;
    const pendingId = sessionStorage.getItem(PENDING_KEY);
    if (!pendingId) return;

    checkPending();
    intervalRef.current = setInterval(checkPending, POLL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAdmin, checkPending]);

  // Quando TraceForm ha successo, avvia il polling
  const handleTraceSuccess = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    checkPending();
    intervalRef.current = setInterval(checkPending, POLL_MS);
  };

  const isPending = pendingTrace && (pendingTrace.status === 'pending' || pendingTrace.status === 'processing');

  return (
    <div>
      <BartlebyNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Intestazione */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Bartleby</h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Bartleby trasforma situazioni concrete in output differenziati attraverso una base di
            conoscenza strutturata sul bambino e il suo sviluppo.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-700">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">Dai una traccia</p>
              <p className="text-slate-500">
                Descrivi una situazione: un comportamento, una domanda, un contesto.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">Il sistema interpreta</p>
              <p className="text-slate-500">
                Attiva nodi concettuali e skill fondative appropriate all'ambito.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">Ricevi un output</p>
              <p className="text-slate-500">
                Guida, nota clinica, policy brief — con piena trasparenza della catena decisionale.
              </p>
            </div>
          </div>
        </div>

        {/* Form o messaggio */}
        {isAdmin ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-5">Nuova traccia</h2>

            {/* Banner traccia in attesa */}
            {isPending && (
              <div className="mb-5 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <span className="inline-block h-3 w-3 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <div className="text-sm text-amber-800 min-w-0">
                  <span className="font-semibold">Traccia in elaborazione — </span>
                  <span>{STATUS_LABEL[pendingTrace.status] ?? pendingTrace.status}</span>
                  <p className="mt-0.5 text-amber-700 truncate">
                    {pendingTrace.raw_text.slice(0, 100)}{pendingTrace.raw_text.length > 100 ? '…' : ''}
                  </p>
                </div>
              </div>
            )}

            {/* Banner traccia completata / errore */}
            {pendingTrace && pendingTrace.status === 'done' && (
              <div className="mb-5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                Elaborazione completata. L'output è disponibile in{' '}
                <a href="/bartleby/outputs" className="underline font-medium">Output generati</a>.
              </div>
            )}
            {pendingTrace && pendingTrace.status === 'error' && (
              <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                L'elaborazione ha restituito un errore. Puoi inviare una nuova traccia.
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600" />
              </div>
            ) : (
              <div className={isPending ? 'opacity-50 pointer-events-none select-none' : ''}>
                {isPending && (
                  <p className="text-xs text-amber-700 mb-3 italic">
                    Invio disabilitato mentre una traccia è in elaborazione.
                  </p>
                )}
                <TraceForm
                  domainAreas={domainAreas}
                  outputTemplates={outputTemplates}
                  onSuccess={handleTraceSuccess}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-sm text-amber-800">
            <p className="font-semibold mb-1">Accesso riservato</p>
            <p>La sottomissione di tracce è disponibile per gli utenti con abbonamento Bartleby.</p>
          </div>
        )}
      </div>
    </div>
  );
}
