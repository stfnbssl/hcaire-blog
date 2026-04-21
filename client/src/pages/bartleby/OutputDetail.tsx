import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import BartlebyNav from '../../components/bartleby/BartlebyNav';
import ProvenancePanel from '../../components/bartleby/ProvenancePanel';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { getOutputDocumentById, deleteOutputDocument } from '../../services/bartlebyService';
import type { OutputDocument } from '../../types/bartleby';

type Tab = 'output' | 'provenance';

const OUTPUT_TYPE_LABELS: Record<string, string> = {
  'guida-genitoriale':      'Guida genitoriale',
  'nota-clinico-riflessiva':'Nota clinica riflessiva',
  'guida-educativa':        'Guida educativa',
  'griglia-osservazionale': 'Griglia osservazionale',
  'analisi-di-caso':        'Analisi di caso',
  'policy-brief':           'Policy brief',
  'articolo-riflessione':   'Articolo di riflessione',
};

function formatDate(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('it-IT', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

export default function OutputDetail() {
  const { id }               = useParams<{ id: string }>();
  const navigate             = useNavigate();
  const { user }             = useUser();
  const { getToken, userId } = useAuth();

  const [output, setOutput]   = useState<OutputDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [tab, setTab]         = useState<Tab>('output');
  const [deleting, setDeleting]   = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isAdmin  = user?.publicMetadata?.role === 'admin';
  const isOwner  = !!userId && output?.user_id === userId;
  const canDelete = isAdmin || isOwner;

  useEffect(() => {
    if (!id) return;
    getOutputDocumentById(id)
      .then(setOutput)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!output || !window.confirm(`Eliminare "${output.title}"?`)) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token non disponibile');
      await deleteOutputDocument(output.bartlebyId, token);
      navigate('/bartleby/outputs');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Errore durante l\'eliminazione');
      setDeleting(false);
    }
  };

  return (
    <div>
      <BartlebyNav />

      {loading && (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600" />
        </div>
      )}
      {error && (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <Link to="/bartleby/outputs" className="mt-4 inline-block text-sm text-slate-500 hover:text-slate-700">
            ← Torna agli output
          </Link>
        </div>
      )}

      {!loading && !error && output && (
        <>
          {/* ── Mini navbar specifica dell'output ─────────────────────── */}
          <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-11">

                {/* Breadcrumb + tabs */}
                <div className="flex items-center gap-1 min-w-0">
                  <Link
                    to="/bartleby/outputs"
                    className="text-xs text-slate-400 hover:text-slate-600 shrink-0"
                  >
                    ← Output
                  </Link>
                  <span className="text-slate-200 mx-1 shrink-0">/</span>

                  {/* Tabs */}
                  <div className="flex items-center gap-0.5">
                    <TabButton active={tab === 'output'} onClick={() => setTab('output')}>
                      Testo
                    </TabButton>
                    <TabButton active={tab === 'provenance'} onClick={() => setTab('provenance')}>
                      Come è stato generato
                    </TabButton>
                  </div>
                </div>

                {/* Azioni */}
                <div className="flex items-center gap-3 shrink-0">
                  {output.evaluation?.score != null && (
                    <span className="hidden sm:inline-block text-xs bg-green-100 text-green-700 rounded px-2 py-0.5">
                      {output.evaluation.score}/10
                    </span>
                  )}
                  {canDelete && (
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                    >
                      {deleting ? 'Eliminazione…' : 'Elimina'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Contenuto ─────────────────────────────────────────────── */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {deleteError && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-4 py-2 mb-6">
                {deleteError}
              </p>
            )}

            {/* Intestazione comune a entrambi i tab */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs bg-slate-100 text-slate-600 rounded px-2 py-0.5">
                  {OUTPUT_TYPE_LABELS[output.output_type] ?? output.output_type}
                </span>
                {output.audience && (
                  <span className="text-xs bg-slate-100 text-slate-600 rounded px-2 py-0.5">
                    {output.audience}
                  </span>
                )}
                {output.created_at && (
                  <span className="text-xs text-slate-400">{formatDate(output.created_at)}</span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 leading-snug">
                {output.title}
              </h1>
            </div>

            {/* Tab: Testo */}
            {tab === 'output' && (
              <MarkdownRenderer content={output.body} />
            )}

            {/* Tab: Provenienza */}
            {tab === 'provenance' && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <ProvenancePanel output={output} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function TabButton({
  active, onClick, children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
        active
          ? 'border-slate-800 text-slate-900'
          : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      {children}
    </button>
  );
}
