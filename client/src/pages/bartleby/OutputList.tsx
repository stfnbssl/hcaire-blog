import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import BartlebyNav from '../../components/bartleby/BartlebyNav';
import { getOutputDocuments, getMyOutputDocuments, deleteOutputDocument } from '../../services/bartlebyService';
import type { OutputDocument } from '../../types/bartleby';

const OUTPUT_TYPE_LABELS: Record<string, string> = {
  'guida-genitoriale':      'Guida gen.',
  'nota-clinico-riflessiva':'Nota clinica',
  'guida-educativa':        'Guida educ.',
  'griglia-osservazionale': 'Griglia',
  'analisi-di-caso':        'Analisi caso',
  'policy-brief':           'Policy brief',
  'articolo-riflessione':   'Articolo',
};

function sortByDate(outputs: OutputDocument[]): OutputDocument[] {
  return [...outputs].sort((a, b) => {
    const da = a.created_at ? new Date(a.created_at).getTime() : 0;
    const db = b.created_at ? new Date(b.created_at).getTime() : 0;
    return db - da;
  });
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('it-IT', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

type Tab = 'all' | 'mine';

export default function OutputList() {
  const { isSignedIn }  = useUser();
  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const [tab, setTab]         = useState<Tab>('all');
  const [outputs, setOutputs] = useState<OutputDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: OutputDocument[];
      if (tab === 'mine') {
        const token = await getToken();
        if (!token) throw new Error('Token non disponibile');
        data = await getMyOutputDocuments(token);
      } else {
        data = await getOutputDocuments();
      }
      setOutputs(sortByDate(data));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [tab, getToken]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (e: React.MouseEvent, outputId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Eliminare questo output?')) return;
    setDeleting(outputId);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token non disponibile');
      await deleteOutputDocument(outputId, token);
      setOutputs((prev) => prev.filter((o) => o.bartlebyId !== outputId));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  const canDelete = (output: OutputDocument) =>
    isAdmin || (!!userId && output.user_id === userId);

  return (
    <div>
      <BartlebyNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Output generati</h1>
        <p className="text-slate-500 mb-6 text-sm">
          Documenti prodotti dal sistema Bartleby su tracce reali o di riferimento.
        </p>

        {isSignedIn && (
          <div className="flex gap-1 mb-5 border-b border-slate-200">
            {(['all', 'mine'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  tab === t
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {t === 'all' ? 'Tutti' : 'I miei'}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600" />
          </div>
        )}
        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-4 py-3">{error}</p>
        )}

        {!loading && !error && (
          outputs.length === 0 ? (
            <p className="text-slate-500 text-sm">
              {tab === 'mine' ? 'Non hai ancora output generati.' : 'Nessun output disponibile.'}
            </p>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {outputs.map((output) => (
                <div key={output.bartlebyId} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 group">
                  {/* Link principale */}
                  <Link
                    to={`/bartleby/outputs/${output.bartlebyId}`}
                    className="flex-1 flex items-center gap-3 min-w-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate leading-snug">
                        {output.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">
                          {OUTPUT_TYPE_LABELS[output.output_type] ?? output.output_type}
                        </span>
                        {output.audience && (
                          <span className="text-xs bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">
                            {output.audience}
                          </span>
                        )}
                        {output.evaluation?.score != null && (
                          <span className="text-xs bg-green-100 text-green-700 rounded px-1.5 py-0.5">
                            {output.evaluation.score}/10
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-xs text-slate-400 shrink-0 hidden sm:block">
                      {formatDate(output.created_at)}
                    </span>

                    <span className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0 text-xs">
                      →
                    </span>
                  </Link>

                  {/* Pulsante elimina */}
                  {canDelete(output) && (
                    <button
                      onClick={(e) => handleDelete(e, output.bartlebyId)}
                      disabled={deleting === output.bartlebyId}
                      title="Elimina output"
                      className="shrink-0 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
                    >
                      {deleting === output.bartlebyId ? (
                        <span className="block h-4 w-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
