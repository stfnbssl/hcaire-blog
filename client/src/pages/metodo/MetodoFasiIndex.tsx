import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { metodoApi } from '../../services/staticContentService';
import type { FasiIndex } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import MetodoNav from '../../components/MetodoNav';

export default function MetodoFasiIndex() {
  const [data, setData] = useState<FasiIndex | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    metodoApi.getMetodoFasiIndex()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <MetodoNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[
          { label: 'Home', to: '/' },
          { label: 'Metodo', to: '/metodo' },
          { label: 'Le fasi' },
        ]} />

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Le fasi del metodo</h1>
        <p className="text-gray-500 mb-10">
          Il percorso metodologico si articola in fasi progressive, dalla fondazione ontologica
          agli strumenti operativi contestualizzati.
        </p>

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-lg" />
            ))}
          </div>
        )}

        {data && !loading && (
          <ol className="space-y-3">
            {data.fasi.map((fase) => (
              <li key={fase.slug}>
                <Link
                  to={`/metodo/fasi/${fase.slug}`}
                  className="flex items-start gap-5 p-5 rounded-lg border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all group"
                >
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm group-hover:bg-indigo-100 transition-colors">
                    F{fase.numero}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors mb-1">
                      {fase.title}
                    </h2>
                    <p className="text-sm text-gray-500 leading-snug">{fase.excerpt}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-10 pt-8 border-t border-gray-100">
          <Link to="/metodo" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
            ← Il metodo
          </Link>
        </div>
      </div>
    </>
  );
}
