import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import type { AsseChapters } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';

export default function SviluppoBambinoAsseChapters() {
  const { asseSlug = '' } = useParams<{ asseSlug: string }>();
  const [data, setData] = useState<AsseChapters | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    sviluppoBambinoApi.getAsseChapters(asseSlug)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [asseSlug]);

  return (
    <>
      <SviluppoBambinoNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Sviluppo bambino', to: '/sviluppo-bambino' },
        { label: 'Assi strutturali', to: '/sviluppo-bambino/assi' },
        { label: data?.title ?? asseSlug },
      ]} />

      {loading && <div className="h-48 bg-gray-50 animate-pulse rounded-lg" />}

      {data && !loading && (
        <>
          <div className="mb-2 text-sm text-gray-400">
            <Link
              to={`/sviluppo-bambino/modello/${asseSlug}`}
              className="hover:text-primary-600 transition-colors"
            >
              ↑ Leggi la sintesi di questo asse
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{data.title}</h1>

          <ol className="space-y-3">
            {data.chapters.map((ch) => (
              <li key={ch.slug}>
                <Link
                  to={`/sviluppo-bambino/assi/${asseSlug}/${ch.slug}`}
                  className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all group"
                >
                  <span className="text-gray-400 font-mono text-sm mt-0.5 shrink-0">
                    {ch.chapter}.
                  </span>
                  <span className="text-gray-800 group-hover:text-primary-700 transition-colors">
                    {ch.title}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </>
      )}

      <div className="mt-10 pt-8 border-t border-gray-100">
        <Link to="/sviluppo-bambino/assi" className="text-sm text-gray-500 hover:text-gray-800">
          ← Tutti gli assi
        </Link>
      </div>
    </div>
    </>
  );
}
