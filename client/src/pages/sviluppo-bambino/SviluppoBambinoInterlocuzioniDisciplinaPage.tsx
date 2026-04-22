import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import type { DisciplinaDetail } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoInterlocuzioniNav from '../../components/SviluppoBambinoInterlocuzioniNav';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import TableOfContents from '../../components/TableOfContents';
import AgenticLabel from '../../components/AgenticLabel';

const SESSION_LABEL: Record<string, string> = {
  A: 'Bio-relazionale',
  B: 'Clinico-contestuale',
  C: 'Metodologico-integrativa',
};

export default function SviluppoBambinoInterlocuzioniDisciplinaPage() {
  const { disciplinaSlug = '' } = useParams<{ disciplinaSlug: string }>();
  const [data, setData] = useState<DisciplinaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    sviluppoBambinoApi.getInterlocuzioneDisciplina(disciplinaSlug)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [disciplinaSlug]);

  return (
    <>
      <SviluppoBambinoNav />
      <SviluppoBambinoInterlocuzioniNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[
          { label: 'Home', to: '/' },
          { label: 'Sviluppo bambino', to: '/sviluppo-bambino' },
          { label: 'Interlocuzioni', to: '/sviluppo-bambino/interlocuzioni' },
          { label: 'Le discipline', to: '/sviluppo-bambino/interlocuzioni/discipline' },
          { label: data?.disciplina ?? disciplinaSlug },
        ]} />

        <div className="flex gap-12">
          <article className="flex-1 min-w-0">
            {loading && <div className="h-96 bg-gray-50 animate-pulse rounded-lg" />}

            {data && !loading && (
              <>
                <header className="mb-8">
                  <p className="text-sm text-indigo-500 font-medium mb-1">
                    Sessione {data.sessione} · {SESSION_LABEL[data.sessione]}
                    {data.assi.length > 0 && (
                      <span className="ml-3 text-gray-400 font-normal">
                        Assi {data.assi.join(', ')}
                      </span>
                    )}
                  </p>
                  <h1 className="text-3xl font-bold text-gray-900">{data.disciplina}</h1>
                </header>

                <MarkdownRenderer content={data.content} />
                <AgenticLabel />

                <nav className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between gap-4">
                  {data.prev ? (
                    <Link
                      to={`/sviluppo-bambino/interlocuzioni/discipline/${data.prev}`}
                      className="text-sm text-gray-500 hover:text-indigo-700 transition-colors"
                    >
                      ← {data.prevLabel ?? 'Disciplina precedente'}
                    </Link>
                  ) : <span />}
                  <Link
                    to="/sviluppo-bambino/interlocuzioni/discipline"
                    className="text-sm text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"
                  >
                    Tutte le discipline
                  </Link>
                  {data.next ? (
                    <Link
                      to={`/sviluppo-bambino/interlocuzioni/discipline/${data.next}`}
                      className="text-sm text-gray-500 hover:text-indigo-700 transition-colors text-right"
                    >
                      {data.nextLabel ?? 'Disciplina successiva'} →
                    </Link>
                  ) : <span />}
                </nav>
              </>
            )}

            {!loading && !data && (
              <div className="text-gray-500">
                <p>Disciplina non trovata.</p>
                <Link
                  to="/sviluppo-bambino/interlocuzioni/discipline"
                  className="text-sm text-indigo-600 hover:underline mt-2 inline-block"
                >
                  ← Tutte le discipline
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
