import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import type { Author, Book, CitationsIndex } from '@shared/types/assi';
import Breadcrumb from '../../components/Breadcrumb';
import AssiStrutturaliNav from '../../components/AssiStrutturaliNav';

type Tab = 'autori' | 'libri';
type SortMode = 'frequenza' | 'alfabetico';

interface DetailTarget {
  kind: 'author' | 'book';
  id: string;
  label: string;
  rilevanza: string;
  image: string;
  citingChapters: { asseSlug: string; chapterSlug: string; chapterTitle: string; asseTitle: string; chapterNumber: number; asseNumber: number }[];
}

export default function BibliografiaPage() {
  const [authors, setAuthors] = useState<Author[] | null>(null);
  const [books, setBooks] = useState<Book[] | null>(null);
  const [citations, setCitations] = useState<CitationsIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [tab, setTab] = useState<Tab>('autori');
  const [sort, setSort] = useState<SortMode>('frequenza');
  const [filter, setFilter] = useState('');
  const [detail, setDetail] = useState<DetailTarget | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      sviluppoBambinoApi.getCatalogoAuthors(),
      sviluppoBambinoApi.getCatalogoBooks(),
      sviluppoBambinoApi.getCitations(),
    ])
      .then(([a, b, c]) => {
        setAuthors(a.authors);
        setBooks(b.books);
        setCitations(c);
      })
      .catch((e) => setErrorMsg(`Caricamento fallito: ${(e as Error).message}`))
      .finally(() => setLoading(false));
  }, []);

  const authorRows = useMemo(() => {
    if (!authors || !citations) return [];
    return authors
      .map((a) => ({
        kind: 'author' as const,
        id: a.id,
        label: a.nome,
        image: a.image,
        rilevanza: a.rilevanza,
        citingCount: citations.authors[a.id]?.length ?? 0,
      }))
      .filter((r) => filter === '' || r.label.toLowerCase().includes(filter.toLowerCase()))
      .sort((x, y) => {
        if (sort === 'frequenza') {
          if (y.citingCount !== x.citingCount) return y.citingCount - x.citingCount;
          return x.label.localeCompare(y.label, 'it');
        }
        return x.label.localeCompare(y.label, 'it');
      });
  }, [authors, citations, sort, filter]);

  const bookRows = useMemo(() => {
    if (!books || !citations) return [];
    return books
      .map((b) => ({
        kind: 'book' as const,
        id: b.id,
        label: b.titolo,
        image: b.cover,
        rilevanza: b.rilevanza,
        citingCount: citations.books[b.id]?.length ?? 0,
      }))
      .filter((r) => filter === '' || r.label.toLowerCase().includes(filter.toLowerCase()))
      .sort((x, y) => {
        if (sort === 'frequenza') {
          if (y.citingCount !== x.citingCount) return y.citingCount - x.citingCount;
          return x.label.localeCompare(y.label, 'it');
        }
        return x.label.localeCompare(y.label, 'it');
      });
  }, [books, citations, sort, filter]);

  const rows = tab === 'autori' ? authorRows : bookRows;

  const openDetail = (row: typeof authorRows[number] | typeof bookRows[number]) => {
    if (!citations) return;
    const list =
      row.kind === 'author' ? citations.authors[row.id] ?? [] : citations.books[row.id] ?? [];
    setDetail({
      kind: row.kind,
      id: row.id,
      label: row.label,
      image: row.image,
      rilevanza: row.rilevanza,
      citingChapters: list,
    });
  };

  const totalAutori = authors?.length ?? 0;
  const totalLibri = books?.length ?? 0;
  const citatiAutori = useMemo(
    () => (citations ? Object.keys(citations.authors).length : 0),
    [citations],
  );
  const citatiLibri = useMemo(
    () => (citations ? Object.keys(citations.books).length : 0),
    [citations],
  );

  return (
    <>
      <AssiStrutturaliNav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[
          { label: 'Home', to: '/' },
          { label: 'Assi strutturali', to: '/assi-strutturali' },
          { label: 'Bibliografia' },
        ]} />

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Bibliografia</h1>
        <p className="text-gray-500 mb-2">
          Autori e libri citati nei capitoli degli assi strutturali, con il numero di capitoli che vi fanno riferimento.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Catalogo: {totalAutori} autori ({citatiAutori} citati), {totalLibri} libri ({citatiLibri} citati).
        </p>

        {/* tab + filtri */}
        <div className="flex flex-wrap items-center gap-3 mb-6 pb-3 border-b border-gray-100">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['autori', 'libri'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'autori' ? `Autori (${authorRows.length})` : `Libri (${bookRows.length})`}
              </button>
            ))}
          </div>

          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="filtra…"
            className="flex-1 min-w-[160px] max-w-[280px] px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-primary-400"
          />

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>ordina per</span>
            <button
              onClick={() => setSort('frequenza')}
              className={sort === 'frequenza' ? 'text-primary-600 font-medium' : 'hover:text-gray-700'}
            >
              frequenza
            </button>
            <span className="text-gray-300">·</span>
            <button
              onClick={() => setSort('alfabetico')}
              className={sort === 'alfabetico' ? 'text-primary-600 font-medium' : 'hover:text-gray-700'}
            >
              alfabetico
            </button>
          </div>
        </div>

        {loading && <div className="h-96 bg-gray-50 animate-pulse rounded-lg" />}

        {!loading && errorMsg && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{errorMsg}</div>
        )}

        {!loading && !errorMsg && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rows.map((row) => {
              const isOrphan = row.citingCount === 0;
              return (
                <li key={`${row.kind}-${row.id}`}>
                  <button
                    onClick={() => openDetail(row)}
                    className="w-full text-left flex gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={row.image}
                      alt={row.label}
                      className={tab === 'autori' ? 'h-16 w-16 rounded object-cover bg-gray-100 shrink-0' : 'h-20 w-14 object-cover bg-gray-100 shrink-0 shadow-sm'}
                      onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.2'; }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 leading-tight">{row.label}</p>
                      <p className={`text-xs mt-1 ${isOrphan ? 'text-gray-400' : 'text-primary-600'}`}>
                        {isOrphan ? 'non citato nei capitoli' : `${row.citingCount} ${row.citingCount === 1 ? 'capitolo' : 'capitoli'}`}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {!loading && !errorMsg && rows.length === 0 && (
          <p className="text-gray-400 text-sm mt-6">Nessuna voce corrisponde al filtro.</p>
        )}
      </div>

      {detail && (
        <DetailPanel target={detail} onClose={() => setDetail(null)} />
      )}
    </>
  );
}

function DetailPanel({ target, onClose }: { target: DetailTarget; onClose: () => void }) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="fixed right-0 top-0 z-50 h-full w-full md:w-[480px] bg-white shadow-2xl border-l border-gray-200 flex flex-col">
        <header className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
              {target.kind === 'author' ? 'Autore' : 'Libro'}
            </p>
            <h2 className="text-base font-semibold text-gray-900 leading-tight">{target.label}</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 mt-0.5 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 text-xl leading-none"
            aria-label="Chiudi"
          >
            ×
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-5 flex-1">
          <div className="flex gap-4 mb-5">
            <img
              src={target.image}
              alt={target.label}
              className={target.kind === 'author' ? 'h-24 w-24 rounded object-cover bg-gray-100 shrink-0' : 'h-32 w-22 object-cover bg-gray-100 shrink-0 shadow'}
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.2'; }}
            />
            <div className="text-xs text-gray-500 leading-relaxed">
              <p className="text-gray-700 mb-2">
                {target.citingChapters.length === 0
                  ? 'Nessun capitolo lo cita esplicitamente con un riferimento grafico.'
                  : `Citato in ${target.citingChapters.length} ${target.citingChapters.length === 1 ? 'capitolo' : 'capitoli'}.`}
              </p>
            </div>
          </div>

          <section className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Rilevanza per il progetto</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{target.rilevanza}</p>
          </section>

          {target.citingChapters.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Capitoli che lo citano</h3>
              <ul className="space-y-2">
                {target.citingChapters.map((ch) => (
                  <li key={`${ch.asseSlug}-${ch.chapterSlug}`}>
                    <Link
                      to={`/assi-strutturali/${ch.asseSlug}/${ch.chapterSlug}`}
                      onClick={onClose}
                      className="block group text-sm hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded transition-colors"
                    >
                      <p className="text-gray-900 group-hover:text-primary-700">{ch.chapterTitle}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{ch.asseTitle} · Capitolo {ch.chapterNumber}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </aside>
    </>
  );
}
