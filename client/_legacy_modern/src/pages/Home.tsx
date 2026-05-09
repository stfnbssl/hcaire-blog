import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetchContentList } from '../hooks/useFetchContent';
import Header from '../components/Header';
import { APP_NAME_LABEL } from '../utils/constants';

export default function Home() {
  const [page, setPage] = useState(1);
  const { result, loading, error } = useFetchContentList(page);

  const totalPages = result?.pagination.totalPages ?? 1;

  return (
    <div>
      <Header title={APP_NAME_LABEL} subtitle="Articoli, guide e pensieri" />
      <main className="max-w-6xl mx-auto px-4 py-12">
        {loading && <Spinner />}
        {error && <ErrorMessage message={error} />}
        {result && result.data.length === 0 && (
          <p className="text-center text-gray-500 py-16">Nessun articolo pubblicato.</p>
        )}
        {result && result.data.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {result.data.map((post) => (
                <Link key={post._id} to={`/blog/${post.slug}`}>
                  <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      {post.isPinned && (
                        <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                          In evidenza
                        </span>
                      )}
                      {post.accessType === 'plus' && (
                        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                          Per abbonati
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.titolo}</h2>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{post.descrizione}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="capitalize">{post.categoria}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('it-IT')}</span>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  // Mostra al massimo 5 pagine centrate sulla corrente
  const range = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i);

  const delta   = 2;
  const left    = Math.max(1, page - delta);
  const right   = Math.min(totalPages, page + delta);
  const pages   = range(left, right);

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <PageBtn disabled={page <= 1} onClick={() => onChange(page - 1)} label="←" />

      {left > 1 && (
        <>
          <PageBtn onClick={() => onChange(1)} label="1" />
          {left > 2 && <span className="px-1 text-gray-400 text-sm">…</span>}
        </>
      )}

      {pages.map((p) => (
        <PageBtn
          key={p}
          onClick={() => onChange(p)}
          label={String(p)}
          active={p === page}
        />
      ))}

      {right < totalPages && (
        <>
          {right < totalPages - 1 && <span className="px-1 text-gray-400 text-sm">…</span>}
          <PageBtn onClick={() => onChange(totalPages)} label={String(totalPages)} />
        </>
      )}

      <PageBtn disabled={page >= totalPages} onClick={() => onChange(page + 1)} label="→" />
    </div>
  );
}

function PageBtn({
  label,
  onClick,
  disabled,
  active,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[2rem] h-8 px-2 rounded text-sm font-medium transition-colors
        ${active
          ? 'bg-primary-600 text-white'
          : disabled
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      {label}
    </button>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-center py-16 text-red-600">
      Errore nel caricamento: {message}
    </div>
  );
}
