import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import type { FaseDetail } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoMetodoNav from '../../components/SviluppoBambinoMetodoNav';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import TableOfContents from '../../components/TableOfContents';
import AgenticLabel from '../../components/AgenticLabel';

export default function SviluppoBambinoMetodoFasePage() {
  const { faseSlug = '' } = useParams<{ faseSlug: string }>();
  const [data, setData] = useState<FaseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    sviluppoBambinoApi.getMetodoFase(faseSlug)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [faseSlug]);

  return (
    <>
      <SviluppoBambinoNav />
      <SviluppoBambinoMetodoNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[
          { label: 'Home', to: '/' },
          { label: 'Sviluppo bambino', to: '/sviluppo-bambino' },
          { label: 'Il metodo', to: '/sviluppo-bambino/metodo' },
          { label: 'Le fasi', to: '/sviluppo-bambino/metodo/fasi' },
          { label: data ? `Fase ${data.numero}` : faseSlug },
        ]} />

        <div className="flex gap-12">
          <article className="flex-1 min-w-0">
            {loading && <div className="h-96 bg-gray-50 animate-pulse rounded-lg" />}

            {data && !loading && (
              <>
                <header className="mb-8">
                  <p className="text-sm text-indigo-500 font-medium mb-1">Fase {data.numero}</p>
                  <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
                </header>

                <MarkdownRenderer content={data.content} />
                <AgenticLabel />

                <nav className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between gap-4">
                  {data.prev ? (
                    <Link
                      to={`/sviluppo-bambino/metodo/fasi/${data.prev}`}
                      className="text-sm text-gray-500 hover:text-indigo-700 transition-colors"
                    >
                      ← Fase precedente
                    </Link>
                  ) : <span />}
                  <Link
                    to="/sviluppo-bambino/metodo/fasi"
                    className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    Tutte le fasi
                  </Link>
                  {data.next ? (
                    <Link
                      to={`/sviluppo-bambino/metodo/fasi/${data.next}`}
                      className="text-sm text-gray-500 hover:text-indigo-700 transition-colors"
                    >
                      Fase successiva →
                    </Link>
                  ) : <span />}
                </nav>
              </>
            )}

            {!loading && !data && (
              <div className="text-gray-500">
                <p>Fase non trovata.</p>
                <Link to="/sviluppo-bambino/metodo/fasi" className="text-sm text-indigo-600 hover:underline mt-2 inline-block">
                  ← Tutte le fasi
                </Link>
              </div>
            )}
          </article>

          <TableOfContents />
        </div>
      </div>
    </>
  );
}
