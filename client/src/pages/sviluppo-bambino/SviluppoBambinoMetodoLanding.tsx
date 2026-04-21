import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import type { MetodoLandingResponse } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import MarkdownRenderer from '../../components/MarkdownRenderer';

export default function SviluppoBambinoMetodoLanding() {
  const [data, setData] = useState<MetodoLandingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sviluppoBambinoApi.getMetodo()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SviluppoBambinoNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Sviluppo bambino', to: '/sviluppo-bambino' },
        { label: 'Il metodo' },
      ]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Il metodo</h1>

      {loading && <div className="h-48 bg-gray-50 animate-pulse rounded-lg mb-8" />}

      {data && !loading && (
        <>
          {data.content && (
            <div className="mb-10 prose prose-gray max-w-none">
              <MarkdownRenderer content={data.content} />
            </div>
          )}

          <section className="grid sm:grid-cols-3 gap-4 mb-10">
            {data.groups.map((g) => (
              <Link
                key={g.slug}
                to={`/sviluppo-bambino/metodo/${g.slug}`}
                className="block rounded-lg border border-gray-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all group"
              >
                <h2 className="font-semibold text-gray-900 group-hover:text-primary-700 mb-1 text-sm leading-snug">{g.title}</h2>
                <p className="text-xs text-gray-500 leading-snug">{g.excerpt}</p>
              </Link>
            ))}
          </section>
        </>
      )}

      <div className="mt-4 pt-6 border-t border-gray-100">
        <Link to="/sviluppo-bambino" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          ← Sviluppo bambino
        </Link>
      </div>
    </div>
    </>
  );
}
