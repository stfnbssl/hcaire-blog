import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  listRebuildExecutions,
  getRebuildExecution,
  triggerRebuild,
} from '../services/assiAdminService';
import type { AssiRebuildExecution, AssiRebuildExecutionSummary } from '../types/assiAdmin';

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'medium' });
}

function fmtDuration(start: string | null, end: string | null): string {
  if (!start || !end) return '—';
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (ms < 0) return '—';
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${m}m ${rs}s`;
}

function StatusPill({ status }: { status: AssiRebuildExecutionSummary['status'] }): JSX.Element {
  const cls =
    status === 'completato'   ? 'bg-emerald-100 text-emerald-800' :
    status === 'in_esecuzione' ? 'bg-blue-100 text-blue-800 animate-pulse' :
    status === 'in_coda'       ? 'bg-slate-100 text-slate-700' :
    'bg-rose-100 text-rose-800';
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{status.replace('_', ' ')}</span>;
}

export default function AdminAssiRebuild() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<AssiRebuildExecutionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triggering, setTriggering] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<AssiRebuildExecution | null>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const pollRef = useRef<number | null>(null);

  const hasActiveRebuild = items.some(
    (e) => e.status === 'in_coda' || e.status === 'in_esecuzione',
  );

  const fetchList = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const res = await listRebuildExecutions(token);
      setItems(res.items);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [getToken]);

  const fetchDetail = useCallback(async (id: string): Promise<AssiRebuildExecution | null> => {
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      return await getRebuildExecution(token, id);
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
  }, [getToken]);

  // Carico la lista al mount.
  useEffect(() => {
    void (async () => {
      setLoading(true);
      await fetchList();
      setLoading(false);
    })();
  }, [fetchList]);

  // Polling automatico (ogni 3s) finché c'è un rebuild attivo.
  useEffect(() => {
    if (!hasActiveRebuild) {
      if (pollRef.current !== null) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }
    if (pollRef.current !== null) return;
    pollRef.current = window.setInterval(() => {
      void fetchList();
      if (selectedId) {
        void fetchDetail(selectedId).then((d) => { if (d) setSelected(d); });
      }
    }, 3000);
    return () => {
      if (pollRef.current !== null) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [hasActiveRebuild, selectedId, fetchList, fetchDetail]);

  const handleTrigger = async (): Promise<void> => {
    if (!window.confirm('Lanciare un nuovo rebuild degli assi? Cowork verrà spawnato e impiegherà alcuni minuti.')) return;
    setTriggering(true);
    setError(null);
    setInfo(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const res = await triggerRebuild(token);
      setInfo(`Rebuild messo in coda: ${res.execution_id}`);
      await fetchList();
      // Apro il drawer del nuovo rebuild
      setSelectedId(res.execution_id);
      const d = await fetchDetail(res.execution_id);
      if (d) setSelected(d);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setTriggering(false);
    }
  };

  const openDetail = async (id: string): Promise<void> => {
    setSelectedId(id);
    setSelectedLoading(true);
    setSelected(null);
    const d = await fetchDetail(id);
    if (d) setSelected(d);
    setSelectedLoading(false);
  };

  const closeDetail = (): void => {
    setSelectedId(null);
    setSelected(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rebuild assi & log</h1>
          <p className="text-sm text-slate-500 mt-1">
            Rigenerazione delle 6 schede asse a partire dai capitoli markdown. Il rebuild
            usa Cowork (~9 min) e aggiorna sia i file <code>precompiled/</code> nel repo sia la
            collection MongoDB <code>assi_strutturali</code>, poi rilancia automaticamente{' '}
            <code>npm run assi:archivio</code>.
          </p>
        </div>
        <button
          onClick={() => void handleTrigger()}
          disabled={triggering || hasActiveRebuild}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-md font-medium"
          title={hasActiveRebuild ? 'Un rebuild è già in corso' : undefined}
        >
          {triggering ? 'Pubblicazione…' : hasActiveRebuild ? 'Rebuild in corso…' : '↻ Lancia rebuild'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-rose-50 text-rose-800 text-sm border border-rose-200">
          {error}
        </div>
      )}
      {info && (
        <div className="mb-4 p-3 rounded bg-emerald-50 text-emerald-800 text-sm border border-emerald-200">
          {info}
        </div>
      )}

      {loading ? (
        <div className="text-slate-500">Caricamento…</div>
      ) : items.length === 0 ? (
        <div className="text-slate-500 italic">Nessuna esecuzione finora.</div>
      ) : (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Stato</th>
                <th className="px-4 py-2 font-medium">Lanciato il</th>
                <th className="px-4 py-2 font-medium">Durata</th>
                <th className="px-4 py-2 font-medium">Assi aggiornati</th>
                <th className="px-4 py-2 font-medium">Triggered by</th>
                <th className="px-4 py-2 font-medium">Errore</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((e) => (
                <tr
                  key={e._id}
                  onClick={() => void openDetail(e._id)}
                  className="hover:bg-slate-50 cursor-pointer"
                >
                  <td className="px-4 py-2"><StatusPill status={e.status} /></td>
                  <td className="px-4 py-2 text-slate-600">{fmtDate(e.triggered_at)}</td>
                  <td className="px-4 py-2 text-slate-600">
                    {fmtDuration(e.started_at ?? e.triggered_at, e.completed_at)}
                  </td>
                  <td className="px-4 py-2 text-slate-600">
                    {e.axes_updated.length > 0 ? `${e.axes_updated.length}/6` : '—'}
                  </td>
                  <td className="px-4 py-2 text-slate-500 text-xs">
                    {e.triggered_by ? e.triggered_by.slice(0, 12) + '…' : 'sistema'}
                  </td>
                  <td className="px-4 py-2 text-rose-700 text-xs truncate max-w-xs">
                    {e.error || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(selected || selectedLoading) && (
        <Drawer onClose={closeDetail}>
          {selectedLoading && <div className="text-slate-500 p-6">Caricamento…</div>}
          {selected && <ExecutionDetail execution={selected} />}
        </Drawer>
      )}
    </div>
  );
}

function Drawer({ onClose, children }: { onClose: () => void; children: React.ReactNode }): JSX.Element {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-xl flex flex-col">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
          <span className="text-sm text-slate-500">Dettaglio esecuzione</span>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 text-sm">Chiudi ✕</button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
}

function ExecutionDetail({ execution }: { execution: AssiRebuildExecution }): JSX.Element {
  return (
    <article>
      <header className="mb-4 space-y-1">
        <div className="text-xs font-mono text-slate-500">{execution._id}</div>
        <div className="flex items-center gap-3">
          <StatusPill status={execution.status} />
          <span className="text-xs text-slate-500">
            Lanciato {fmtDate(execution.triggered_at)} · Durata {fmtDuration(execution.started_at ?? execution.triggered_at, execution.completed_at)}
          </span>
        </div>
        {execution.axes_updated.length > 0 && (
          <div className="text-sm">
            Assi aggiornati: <span className="font-mono text-emerald-700">{execution.axes_updated.join(', ')}</span>
          </div>
        )}
        {execution.error && (
          <div className="mt-2 p-2 rounded bg-rose-50 text-rose-800 text-sm border border-rose-200 whitespace-pre-wrap">
            {execution.error}
          </div>
        )}
      </header>

      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
        Log ({execution.log_lines.length})
      </h3>
      <div className="bg-slate-900 text-slate-100 rounded-md p-3 font-mono text-xs leading-relaxed max-h-[60vh] overflow-y-auto">
        {execution.log_lines.length === 0 ? (
          <div className="text-slate-500">Nessuna riga di log.</div>
        ) : (
          execution.log_lines.map((ln, i) => {
            const color =
              ln.level === 'error' ? 'text-rose-300' :
              ln.level === 'warn'  ? 'text-amber-300' :
              'text-slate-200';
            return (
              <div key={i} className={`${color} whitespace-pre-wrap`}>
                <span className="text-slate-500 mr-2">
                  {new Date(ln.ts).toLocaleTimeString('it-IT')}
                </span>
                {ln.text}
              </div>
            );
          })
        )}
      </div>
    </article>
  );
}
