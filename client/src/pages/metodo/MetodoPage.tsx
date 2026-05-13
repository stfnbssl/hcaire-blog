import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { metodoApi } from '../../services/staticContentService';
import type { MetodoPageResponse } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import MetodoNav from '../../components/MetodoNav';
import TableOfContents from '../../components/TableOfContents';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import PrevNext from '../../components/PrevNext';
import AgenticLabel from '../../components/AgenticLabel';

type PageKey =
  | 'introduzione'
  | 'ricerca-scientifica'
  | 'rapporto-con-ia';

interface PageMeta {
  title: string;
  fetcher: () => Promise<MetodoPageResponse>;
  breadcrumb: Array<{ label: string; to?: string }>;
  parentTo: string;
  parentLabel: string;
  prevNextBase: string;
}

const PAGE_META: Record<PageKey, PageMeta> = {
  'introduzione': {
    title: 'Introduzione alla metodologia',
    fetcher: () => metodoApi.getMetodoIntroduzione(),
    breadcrumb: [
      { label: 'Home', to: '/' },
      { label: 'Metodo', to: '/metodo' },
      { label: 'Introduzione' },
    ],
    parentTo: '/metodo',
    parentLabel: 'Il metodo',
    prevNextBase: '/metodo',
  },
  'ricerca-scientifica': {
    title: 'Rapporto con la ricerca scientifica',
    fetcher: () => metodoApi.getMetodoRicercaScientifica(),
    breadcrumb: [
      { label: 'Home', to: '/' },
      { label: 'Metodo', to: '/metodo' },
      { label: 'Ricerca scientifica' },
    ],
    parentTo: '/metodo',
    parentLabel: 'Il metodo',
    prevNextBase: '/metodo',
  },
  'rapporto-con-ia': {
    title: 'Rapporto con l\'intelligenza artificiale',
    fetcher: () => metodoApi.getMetodoRapportoConIA(),
    breadcrumb: [
      { label: 'Home', to: '/' },
      { label: 'Metodo', to: '/metodo' },
      { label: 'Rapporto con l\'intelligenza artificiale' },
    ],
    parentTo: '/metodo',
    parentLabel: 'Il metodo',
    prevNextBase: '/metodo',
  },
};

export default function MetodoPage() {
  const { pageSlug = '' } = useParams<{ pageSlug: string }>();
  const location = useLocation();
  const key = (pageSlug || location.pathname.split('/').filter(Boolean).pop()) as PageKey;
  const meta = PAGE_META[key];

  const [data, setData] = useState<MetodoPageResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!meta) return;
    setLoading(true);
    meta.fetcher()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [key]);

  if (!meta) return <div className="max-w-3xl mx-auto px-4 py-12 text-gray-500">Pagina non trovata.</div>;

  return (
    <>
      <MetodoNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={meta.breadcrumb} />

        <div className="flex gap-12">
          <article className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{data?.title ?? meta.title}</h1>

            {loading && <div className="h-96 bg-gray-50 animate-pulse rounded-lg" />}

            {data && !loading && (
              <>
                <MarkdownRenderer content={data.content} />
                <AgenticLabel />

                {(data.prev || data.next) && (
                  <PrevNext
                    prevSlug={data.prev ?? undefined}
                    nextSlug={data.next ?? undefined}
                    baseUrl={meta.prevNextBase}
                  />
                )}
              </>
            )}

            <div className="mt-10 pt-8 border-t border-gray-100">
              <Link to={meta.parentTo} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
                ← {meta.parentLabel}
              </Link>
            </div>
          </article>

          <TableOfContents />
        </div>
      </div>
    </>
  );
}
