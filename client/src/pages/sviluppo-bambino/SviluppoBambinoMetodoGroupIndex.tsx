import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import type { MetodoGroupIndexResponse } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';

type GroupSlug = 'introduzione' | 'ricerca-scientifica';

const GROUP_META: Record<GroupSlug, {
  label: string;
  breadcrumb: string;
  fetcher: () => Promise<MetodoGroupIndexResponse>;
}> = {
  'introduzione': {
    label: 'Introduzione al progetto',
    breadcrumb: 'Introduzione al progetto',
    fetcher: () => sviluppoBambinoApi.getMetodoIntroduzione(),
  },
  'ricerca-scientifica': {
    label: 'Rapporto con la ricerca scientifica',
    breadcrumb: 'Rapporto con la ricerca scientifica',
    fetcher: () => sviluppoBambinoApi.getMetodoRicercaScientifica(),
  },
};

export default function SviluppoBambinoMetodoGroupIndex() {
  const location = useLocation();
  const groupSlug = location.pathname.split('/').filter(Boolean).pop() as GroupSlug;
  const meta = GROUP_META[groupSlug];

  const [data, setData] = useState<MetodoGroupIndexResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!meta) return;
    setLoading(true);
    meta.fetcher()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [groupSlug]);

  if (!meta) return <div className="max-w-3xl mx-auto px-4 py-12 text-gray-500">Pagina non trovata.</div>;

  return (
    <>
      <SviluppoBambinoNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Sviluppo bambino', to: '/sviluppo-bambino' },
        { label: 'Il metodo', to: '/sviluppo-bambino/metodo' },
        { label: meta.breadcrumb },
      ]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-8">{meta.label}</h1>

      {loading && <div className="h-32 bg-gray-50 animate-pulse rounded-lg mb-8" />}

      {data && !loading && (
        <section className="grid sm:grid-cols-2 gap-4 mb-10">
          {data.pages.map((p) => (
            <Link
              key={p.slug}
              to={`/sviluppo-bambino/metodo/${groupSlug}/${p.slug}`}
              className="block rounded-lg border border-gray-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all group"
            >
              <h2 className="font-semibold text-gray-900 group-hover:text-primary-700 mb-1">{p.title}</h2>
              <p className="text-sm text-gray-500 leading-snug">{p.excerpt}</p>
            </Link>
          ))}
        </section>
      )}

      <div className="mt-4 pt-6 border-t border-gray-100">
        <Link to="/sviluppo-bambino/metodo" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          ← Il metodo
        </Link>
      </div>
    </div>
    </>
  );
}
