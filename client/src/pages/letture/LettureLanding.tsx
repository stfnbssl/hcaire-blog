import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLetturePubbliche, type OperaPubblicaSummary } from '../../services/lettureService';

export default function LettureLanding() {
  const [opere, setOpere] = useState<OperaPubblicaSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const list = await fetchLetturePubbliche();
        if (!cancelled) setOpere(list);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900">Letture</h1>
          <p className="text-gray-600 mt-3 text-lg max-w-2xl">
            Letture critiche di opere culturali — romanzi, racconti, film e altri testi —
            costruite a partire da una pipeline analitica multi-stadio.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
          </div>
        ) : opere.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Nessuna lettura pubblicata al momento.</p>
            <p className="text-gray-400 text-sm mt-2">Le opere appariranno qui non appena la revisione finale sarà completata.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {opere.map((o) => (
              <li key={o.slug}>
                <Link
                  to={`/letture/${encodeURIComponent(o.slug)}`}
                  className="block bg-white border border-gray-200 rounded-lg p-5 hover:border-primary-400 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-700">
                        {o.titolo}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {o.autore}{o.anno ? ` · ${o.anno}` : ''}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 capitalize">
                          {o.tipologia}
                        </span>
                        {o.ha_resoconto && (
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            + resoconto del processo
                          </span>
                        )}
                        {o.ha_saggio && (
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            + saggio integrato
                          </span>
                        )}
                      </div>
                    </div>
                    {o.pubblicata_il && (
                      <time className="text-xs text-gray-400 flex-shrink-0">
                        {formatDate(o.pubblicata_il)}
                      </time>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
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
