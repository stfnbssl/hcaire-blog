import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchOperaPubblica, type OperaPubblicaDetail } from '../../services/lettureService';
import MarkdownRenderer from '../../components/MarkdownRenderer';

type TabId = 'articolo' | 'resoconto' | 'saggio';

export default function LetturaDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const [opera, setOpera] = useState<OperaPubblicaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('articolo');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const o = await fetchOperaPubblica(slug);
        if (!cancelled) setOpera(o);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  // Tab disponibili in funzione di ciò che è stato pubblicato.
  const tabs = useMemo(() => {
    if (!opera) return [];
    const list: { id: TabId; label: string; available: boolean }[] = [
      { id: 'articolo',  label: 'Articolo',                      available: opera.articolo !== null },
      { id: 'resoconto', label: 'Resoconto del processo',         available: opera.resoconto !== null && opera.resoconto.testo !== null },
      { id: 'saggio',    label: 'Saggio integrato',               available: opera.saggio !== null && opera.saggio.testo !== null },
    ];
    return list.filter((t) => t.available);
  }, [opera]);

  // Se il tab attivo non è più disponibile (es. cambio opera), ripiega sul primo.
  useEffect(() => {
    if (tabs.length === 0) return;
    if (!tabs.some((t) => t.id === activeTab)) setActiveTab(tabs[0].id);
  }, [tabs, activeTab]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !opera) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-600">{error ?? 'Lettura non trovata.'}</p>
        <Link to="/letture" className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700 underline">
          ← Torna all'elenco delle letture
        </Link>
      </div>
    );
  }

  const currentText =
    activeTab === 'articolo' ? opera.articolo :
    activeTab === 'resoconto' ? opera.resoconto?.testo ?? null :
    activeTab === 'saggio' ? opera.saggio?.testo ?? null :
    null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero opera */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link to="/letture" className="text-sm text-gray-500 hover:text-gray-700">← Letture</Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">{opera.titolo}</h1>
          <p className="text-gray-700 text-lg mt-1">{opera.autore}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-sm text-gray-500">
            {opera.anno && <span>{opera.anno}</span>}
            {opera.anno && <span>·</span>}
            <span className="capitalize">{opera.tipologia}</span>
            {opera.lingua_originale && (
              <>
                <span>·</span>
                <span>lingua originale: {opera.lingua_originale}</span>
              </>
            )}
            {opera.pubblicata_il && (
              <>
                <span>·</span>
                <span>pubblicata il {formatDate(opera.pubblicata_il)}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      {tabs.length > 1 && (
        <div className="sticky top-16 bg-white border-b border-gray-200 z-30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto py-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`text-sm font-medium px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                    activeTab === t.id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contenuto */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {currentText ? (
          <article className="prose-container">
            <MarkdownRenderer content={currentText} />
          </article>
        ) : (
          <p className="text-gray-500 text-center py-12">Contenuto non disponibile.</p>
        )}
      </main>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return iso; }
}
