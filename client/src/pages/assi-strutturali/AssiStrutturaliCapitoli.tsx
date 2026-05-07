import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import type { AssiIndex } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import AssiStrutturaliNav from '../../components/AssiStrutturaliNav';

export default function SviluppoBambinoAssi() {
  const [data, setData] = useState<AssiIndex | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sviluppoBambinoApi.getAssiIndex()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AssiStrutturaliNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Assi strutturali', to: '/assi-strutturali' },
        { label: 'Capitoli' },
      ]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Gli assi strutturali</h1>
      <p className="text-gray-500 mb-2">La versione integrale, capitolo per capitolo, del modello a sei assi.</p>
      <p className="text-sm text-gray-400 mb-10">
        Per la panoramica sintetica degli assi, vai a{' '}
        <Link to="/sviluppo-bambino/modello" className="text-primary-600 hover:underline">Il modello a sei assi</Link>.
      </p>

      {loading && (
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-gray-50 animate-pulse rounded-lg" />)}
        </div>
      )}

      {data && !loading && (
        <div className="space-y-8">
          {data.assi.map((asse) => (
            <section key={asse.slug}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800">{asse.title}</h2>
                <Link
                  to={`/assi-strutturali/${asse.slug}`}
                  className="text-sm text-gray-400 hover:text-primary-600 transition-colors"
                >
                  {asse.chapterCount} capitoli →
                </Link>
              </div>
              <ol className="space-y-1.5 pl-4 border-l-2 border-gray-100">
                {asse.chapters.map((ch) => (
                  <li key={ch.slug}>
                    <Link
                      to={`/assi-strutturali/${asse.slug}/${ch.slug}`}
                      className="text-sm text-gray-600 hover:text-primary-700 transition-colors"
                    >
                      <span className="text-gray-400 mr-2">{ch.chapter}.</span>
                      {ch.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}

      <div className="mt-10 pt-8 border-t border-gray-100">
        <Link to="/assi-strutturali" className="text-sm text-gray-500 hover:text-gray-800">
          ← Assi strutturali
        </Link>
      </div>
    </div>
    </>
  );
}
