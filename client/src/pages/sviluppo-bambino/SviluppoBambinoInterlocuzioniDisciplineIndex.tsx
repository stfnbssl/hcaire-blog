import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import type { InterlocuzioniIndex } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoInterlocuzioniNav from '../../components/SviluppoBambinoInterlocuzioniNav';

const SESSION_COLORS: Record<string, { badge: string; ring: string }> = {
  A: { badge: 'bg-indigo-50 text-indigo-700', ring: 'hover:border-indigo-200' },
  B: { badge: 'bg-teal-50 text-teal-700',     ring: 'hover:border-teal-200'   },
  C: { badge: 'bg-violet-50 text-violet-700', ring: 'hover:border-violet-200' },
};

export default function SviluppoBambinoInterlocuzioniDisciplineIndex() {
  const [data, setData] = useState<InterlocuzioniIndex | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sviluppoBambinoApi.getInterlocuzioniIndex()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SviluppoBambinoNav />
      <SviluppoBambinoInterlocuzioniNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[
          { label: 'Home', to: '/' },
          { label: 'Sviluppo bambino', to: '/sviluppo-bambino' },
          { label: 'Interlocuzioni', to: '/sviluppo-bambino/interlocuzioni' },
          { label: 'Le discipline' },
        ]} />

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Le undici discipline</h1>
        <p className="text-gray-500 mb-10">
          Tre famiglie di discipline, tre sguardi sullo sviluppo — in dialogo critico con il modello degli assi.
        </p>

        {loading && (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 w-40 bg-gray-100 animate-pulse rounded" />
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-16 bg-gray-50 animate-pulse rounded-lg" />
                ))}
              </div>
            ))}
          </div>
        )}

        {data && !loading && (
          <div className="space-y-12">
            {data.sessioni.map((sessione) => {
              const colors = SESSION_COLORS[sessione.id] ?? SESSION_COLORS['A'];
              return (
                <section key={sessione.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${colors.badge}`}>
                      Sessione {sessione.id}
                    </span>
                    <h2 className="font-semibold text-gray-700">{sessione.label}</h2>
                  </div>

                  <ol className="space-y-2">
                    {sessione.discipline.map((d) => (
                      <li key={d.slug}>
                        <Link
                          to={`/sviluppo-bambino/interlocuzioni/discipline/${d.slug}`}
                          className={`flex items-start justify-between gap-4 p-4 rounded-lg border border-gray-100 ${colors.ring} hover:shadow-sm transition-all group`}
                        >
                          <span className="text-gray-800 group-hover:text-gray-900 font-medium transition-colors">
                            {d.disciplina}
                          </span>
                          <span className="flex-shrink-0 text-xs text-gray-400 mt-0.5">
                            Assi {d.assi.join(', ')}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-gray-100">
          <Link to="/sviluppo-bambino/interlocuzioni" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
            ← Interlocuzioni
          </Link>
        </div>
      </div>
    </>
  );
}
