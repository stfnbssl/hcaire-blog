import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import type { ModelloIndex } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';

export default function SviluppoBambinoModello() {
  const [data, setData] = useState<ModelloIndex | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sviluppoBambinoApi.getModello()
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
        { label: 'Il modello a sei assi' },
      ]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Il modello a sei assi</h1>
      <p className="text-gray-500 mb-10">Sei dimensioni strutturali, sempre compresenti, dello sviluppo del soggetto.</p>

      {loading && (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {data && !loading && (
        <div className="space-y-4">
          {data.assi.map((asse) => (
            <div key={asse.slug} className="rounded-lg border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 mb-2">{asse.title}</h2>
                  <div className="line-clamp-3">
                    <MarkdownRenderer content={asse.content.split('\n\n').slice(0, 2).join('\n\n')} />
                  </div>
                </div>
                <div className="shrink-0 flex flex-col gap-2 text-right">
                  <Link
                    to={`/sviluppo-bambino/modello/${asse.slug}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-800 whitespace-nowrap"
                  >
                    Leggi →
                  </Link>
                  <Link
                    to={`/sviluppo-bambino/assi/${asse.slug}`}
                    className="text-xs text-gray-400 hover:text-gray-600 whitespace-nowrap"
                  >
                    Capitoli
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 pt-8 border-t border-gray-100">
        <Link to="/sviluppo-bambino" className="text-sm text-gray-500 hover:text-gray-800">
          ← Sviluppo bambino
        </Link>
      </div>
    </div>
    </>
  );
}
