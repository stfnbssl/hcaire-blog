import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { listAssi, getAsse } from '../services/assiAdminService';
import type { AsseStrutturale } from '../types/assiAdmin';

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' });
}

function StatusBadge({ status }: { status: AsseStrutturale['status'] }): JSX.Element {
  const cls =
    status === 'consolidato' ? 'bg-emerald-100 text-emerald-800' :
    status === 'in_revisione' ? 'bg-amber-100 text-amber-800' :
    'bg-slate-100 text-slate-700';
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{status}</span>;
}

export default function AdminAssi() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<AsseStrutturale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AsseStrutturale | null>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const res = await listAssi(token);
      setItems(res.items);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { void fetchList(); }, [fetchList]);

  const openDetail = async (axisId: string): Promise<void> => {
    setSelectedLoading(true);
    setSelected(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const full = await getAsse(token, axisId);
      setSelected(full);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSelectedLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assi strutturali</h1>
          <p className="text-sm text-slate-500 mt-1">
            Sei schede di fondazione concettuale dei capitoli "Sviluppo bambino". Per rigenerare i contenuti vai a{' '}
            <a href="/admin/assi/rebuild" className="text-emerald-700 hover:underline">Rebuild & log</a>.
          </p>
        </div>
        <button
          onClick={() => void fetchList()}
          className="text-sm px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50"
        >
          Aggiorna
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-rose-50 text-rose-800 text-sm border border-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-500">Caricamento…</div>
      ) : items.length === 0 ? (
        <div className="text-slate-500 italic">
          Nessun asse in MongoDB. Lancia un{' '}
          <a href="/admin/assi/rebuild" className="text-emerald-700 hover:underline">rebuild</a>{' '}
          per popolarli.
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">ID</th>
                <th className="px-4 py-2 font-medium">Nome</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Versione</th>
                <th className="px-4 py-2 font-medium">Ultimo rebuild</th>
                <th className="px-4 py-2 font-medium">Revisione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((a) => (
                <tr
                  key={a.axis_id}
                  onClick={() => void openDetail(a.axis_id)}
                  className="hover:bg-slate-50 cursor-pointer"
                >
                  <td className="px-4 py-2 font-mono text-xs text-slate-500">{a.axis_id}</td>
                  <td className="px-4 py-2 text-slate-900 font-medium">{a.axis_name}</td>
                  <td className="px-4 py-2"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-2 text-slate-600">{a.version}</td>
                  <td className="px-4 py-2 text-slate-600">{fmtDate(a._last_rebuilt)}</td>
                  <td className="px-4 py-2">
                    {a.compilation_notes?.needs_human_review ? (
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded">richiede revisione</span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer dettaglio */}
      {(selected || selectedLoading) && (
        <Drawer onClose={() => { setSelected(null); }}>
          {selectedLoading && <div className="text-slate-500 p-6">Caricamento…</div>}
          {selected && <AsseDetail asse={selected} />}
        </Drawer>
      )}
    </div>
  );
}

function Drawer({ onClose, children }: { onClose: () => void; children: React.ReactNode }): JSX.Element {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-500">Dettaglio asse</span>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 text-sm"
          >
            Chiudi ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <section className="mb-6">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">{title}</h3>
      <div className="text-sm text-slate-800">{children}</div>
    </section>
  );
}

function AsseDetail({ asse }: { asse: AsseStrutturale }): JSX.Element {
  return (
    <article>
      <header className="mb-5">
        <div className="text-xs font-mono text-slate-500">{asse.axis_id} · {asse.version}</div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">{asse.axis_name}</h2>
        <div className="mt-2 flex items-center gap-3">
          <StatusBadge status={asse.status} />
          <span className="text-xs text-slate-500">Ultimo rebuild: {fmtDate(asse._last_rebuilt)}</span>
        </div>
      </header>

      <Section title="Funzione strutturale">
        <p className="leading-relaxed">{asse.structural_function}</p>
      </Section>

      <Section title={`Processi (${asse.core_processes.length})`}>
        <ul className="space-y-2">
          {asse.core_processes.map((p, i) => (
            <li key={i}>
              <div className="font-medium">{p.name}</div>
              <div className="text-slate-600">{p.description}</div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={`Concetti-ponte (${asse.bridge_concepts.length})`}>
        <ul className="space-y-2">
          {asse.bridge_concepts.map((b, i) => (
            <li key={i}>
              <div className="font-medium">{b.concept}</div>
              <div className="text-slate-600">{b.definition}</div>
              {b.linked_nodes && b.linked_nodes.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {b.linked_nodes.map((n, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">{n}</span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={`Nodi strutturali (${asse.structural_nodes.length})`}>
        <ul className="space-y-1">
          {asse.structural_nodes.map((n, i) => (
            <li key={i}>
              <span className="font-medium">{n.node}</span>
              <span className="text-slate-600"> — {n.short_definition}</span>
            </li>
          ))}
        </ul>
      </Section>

      {asse.internal_articulations.length > 0 && (
        <Section title={`Articolazioni interne (${asse.internal_articulations.length})`}>
          <ul className="space-y-2">
            {asse.internal_articulations.map((a, i) => (
              <li key={i}>
                <div className="font-medium">{a.section}</div>
                <div className="text-slate-600">{a.function}</div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title={`Rischi di riduzione (${asse.reduction_risks.length})`}>
        <ul className="space-y-2">
          {asse.reduction_risks.map((r, i) => (
            <li key={i}>
              <div className="font-medium">{r.type}</div>
              <div className="text-slate-600">{r.description}</div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Domande strutturali">
        <ul className="list-disc pl-5 space-y-1">
          {asse.structural_questions.map((q, i) => <li key={i}>{q}</li>)}
        </ul>
      </Section>

      <Section title="Vincoli metodologici">
        <ul className="list-disc pl-5 space-y-1">
          {asse.methodological_constraints.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </Section>

      <Section title="Note di compilazione">
        <div className="space-y-1">
          <div>Confidenza: <span className="font-medium">{asse.compilation_notes.confidence_level}</span></div>
          <div>Revisione necessaria: <span className="font-medium">{asse.compilation_notes.needs_human_review ? 'sì' : 'no'}</span></div>
          {asse.compilation_notes.notes && (
            <div className="text-slate-600 mt-1">{asse.compilation_notes.notes}</div>
          )}
          {asse.compilation_notes.open_issues && asse.compilation_notes.open_issues.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-slate-500 mb-1">Open issues:</div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                {asse.compilation_notes.open_issues.map((iss, i) => <li key={i}>{iss}</li>)}
              </ul>
            </div>
          )}
        </div>
      </Section>
    </article>
  );
}
