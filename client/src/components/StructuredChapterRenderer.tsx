import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type {
  ChapterDocument,
  ChapterRef,
  CitationsIndex,
  Reference,
  Footnote,
  Author,
  Book,
} from '@shared/types/assi';

interface Props {
  doc: ChapterDocument;
  authors: Author[];
  books: Book[];
  /** opzionale: indice citazioni per mostrare "vedi capitoli che lo citano" */
  citations?: CitationsIndex;
}

interface RilevanzaTarget {
  kind: 'author' | 'book';
  id: string;
  label: string;
  rilevanza: string;
}

// ── stili condivisi per le immagini ref (replicano quelli inline del vecchio md) ─

const PORTRAIT_STYLE: React.CSSProperties = {
  height: 104,
  verticalAlign: 'middle',
  borderRadius: '5%',
  margin: '0 4px 0 2px',
  boxShadow: '0 1px 3px rgba(0,0,0,.25)',
  cursor: 'pointer',
};

const COVER_STYLE: React.CSSProperties = {
  height: 208,
  verticalAlign: 'middle',
  margin: '0 4px 0 2px',
  boxShadow: '0 1px 4px rgba(0,0,0,.3)',
  cursor: 'pointer',
};

// ── pannello rilevanza (layout identico a quello esistente in MarkdownRenderer) ─

function RilevanzaPanel({
  target,
  citingChapters,
  currentChapterSlug,
  onClose,
}: {
  target: RilevanzaTarget;
  /** capitoli che citano questo autore/libro, già escluso il corrente */
  citingChapters: ChapterRef[];
  /** slug del capitolo attualmente aperto (per filtrarlo dalla lista) */
  currentChapterSlug: string;
  onClose: () => void;
}) {
  const others = citingChapters.filter((c) => c.chapterSlug !== currentChapterSlug);
  return (
    <div
      className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50
                 w-full md:w-[420px] max-h-[68vh]
                 bg-white md:rounded-xl shadow-2xl border border-gray-200
                 flex flex-col overflow-hidden"
    >
      <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 shrink-0 bg-gray-50 md:rounded-t-xl">
        <div className="min-w-0 pr-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
            {target.kind === 'author' ? 'Autore' : 'Libro'} — rilevanza per il progetto
          </p>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{target.label}</h3>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors text-base leading-none"
          aria-label="Chiudi"
        >
          ×
        </button>
      </div>
      <div className="overflow-y-auto px-5 py-4">
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{target.rilevanza}</p>

        {others.length > 0 && (
          <section className="mt-5 pt-4 border-t border-gray-100">
            <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Altri capitoli che lo citano
            </h4>
            <ul className="space-y-1.5">
              {others.map((ch) => (
                <li key={`${ch.asseSlug}-${ch.chapterSlug}`}>
                  <Link
                    to={`/assi-strutturali/${ch.asseSlug}/${ch.chapterSlug}`}
                    onClick={onClose}
                    className="block text-xs hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors"
                  >
                    <span className="text-gray-800">{ch.chapterTitle}</span>
                    <span className="text-gray-400 ml-1.5">— {ch.asseTitle}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

// ── marker che sostituisce ogni token {{ref:rN}} ────────────────────────────

interface ReferenceMarkerProps {
  reference: Reference;
  footnote: Footnote | undefined;
  authorById: Map<string, Author>;
  bookById: Map<string, Book>;
  onAuthorClick: (a: Author) => void;
  onBookClick: (b: Book) => void;
}

function ReferenceMarker({
  reference,
  footnote,
  authorById,
  bookById,
  onAuthorClick,
  onBookClick,
}: ReferenceMarkerProps) {
  const refAuthors = reference.authorIds
    .map((id) => authorById.get(id))
    .filter((a): a is Author => Boolean(a));
  const refBooks = reference.bookIds
    .map((id) => bookById.get(id))
    .filter((b): b is Book => Boolean(b));

  return (
    <span className="cite-ref-inline">
      {refAuthors.map((a) => (
        <img
          key={`a-${a.id}`}
          src={a.image}
          alt={a.nome}
          title={`${a.nome} — clicca per la rilevanza nel progetto`}
          style={PORTRAIT_STYLE}
          onClick={() => onAuthorClick(a)}
        />
      ))}
      {refBooks.map((b) => (
        <img
          key={`b-${b.id}`}
          src={b.cover}
          alt={b.titolo}
          title={`${b.titolo} — clicca per la rilevanza nel progetto`}
          style={COVER_STYLE}
          onClick={() => onBookClick(b)}
        />
      ))}
      {footnote && (
        <sup className="ml-0.5">
          <a
            id={`fnref-${reference.id}`}
            href={`#${footnote.id}`}
            className="text-primary-600 hover:text-primary-700 no-underline"
          >
            [{footnote.num}]
          </a>
        </sup>
      )}
    </span>
  );
}

// ── stili base per il body markdown (allineati al vecchio MarkdownRenderer) ──

const baseComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-700">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
  a: ({ href, children, ...rest }) => {
    const isInternal = !href || href.startsWith('#');
    return (
      <a
        href={href}
        className="text-primary-600 hover:text-primary-700 underline"
        {...(!isInternal && { target: '_blank', rel: 'noopener noreferrer' })}
        {...rest}
      >
        {children}
      </a>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 my-4">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">{children}</ol>
  ),
};

// ── renderer principale ──────────────────────────────────────────────────────

export default function StructuredChapterRenderer({ doc, authors, books, citations }: Props) {
  const [activeTarget, setActiveTarget] = useState<RilevanzaTarget | null>(null);
  const activeTargetRef = useRef<RilevanzaTarget | null>(null);
  activeTargetRef.current = activeTarget;

  const authorById = useMemo(() => {
    const m = new Map<string, Author>();
    for (const a of authors) m.set(a.id, a);
    return m;
  }, [authors]);

  const bookById = useMemo(() => {
    const m = new Map<string, Book>();
    for (const b of books) m.set(b.id, b);
    return m;
  }, [books]);

  const refsById = useMemo(() => {
    const m = new Map<string, Reference>();
    for (const r of doc.references) m.set(r.id, r);
    return m;
  }, [doc.references]);

  const footnoteById = useMemo(() => {
    const m = new Map<string, Footnote>();
    for (const f of doc.footnotes) m.set(f.id, f);
    return m;
  }, [doc.footnotes]);

  // Trasforma {{ref:rN}} in <span class="cite-ref" data-ref="rN"></span>:
  // rehypeRaw passa lo span al componente custom che lo riconosce e renderizza
  // il `ReferenceMarker` al suo posto. Mantenere lo span vuoto evita il rendering
  // di un nodo testo finto al suo interno.
  const processedBody = useMemo(() => {
    return doc.body.replace(/\{\{ref:(r\d+)\}\}/g, (_match, refId: string) => {
      return `<span class="cite-ref" data-ref="${refId}"></span>`;
    });
  }, [doc.body]);

  const handleAuthorClick = (a: Author) => {
    const target: RilevanzaTarget = {
      kind: 'author',
      id: a.id,
      label: a.nome,
      rilevanza: a.rilevanza,
    };
    const cur = activeTargetRef.current;
    setActiveTarget(cur && cur.kind === 'author' && cur.id === a.id ? null : target);
  };

  const handleBookClick = (b: Book) => {
    const target: RilevanzaTarget = {
      kind: 'book',
      id: b.id,
      label: b.titolo,
      rilevanza: b.rilevanza,
    };
    const cur = activeTargetRef.current;
    setActiveTarget(cur && cur.kind === 'book' && cur.id === b.id ? null : target);
  };

  const components = useMemo<Components>(() => {
    return {
      ...baseComponents,
      span: ({ children, className, ...rest }) => {
        const dataRef = (rest as Record<string, unknown>)['data-ref'];
        if (typeof dataRef === 'string' && className?.includes('cite-ref')) {
          const reference = refsById.get(dataRef);
          if (reference) {
            const footnote = footnoteById.get(reference.footnoteId);
            return (
              <ReferenceMarker
                reference={reference}
                footnote={footnote}
                authorById={authorById}
                bookById={bookById}
                onAuthorClick={handleAuthorClick}
                onBookClick={handleBookClick}
              />
            );
          }
        }
        return (
          <span className={className} {...rest}>
            {children}
          </span>
        );
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refsById, footnoteById, authorById, bookById]);

  return (
    <div className="mt-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {processedBody}
      </ReactMarkdown>

      {doc.footnotes.length > 0 && (
        <section className="mt-12 pt-6 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Note</h3>
          <ol className="space-y-3 text-sm text-gray-500">
            {doc.footnotes.map((f) => {
              const firstRefId = doc.references.find((r) => r.footnoteId === f.id)?.id;
              return (
                <li key={f.id} id={f.id} className="leading-relaxed flex gap-3">
                  <span className="shrink-0 text-gray-400 font-mono">{f.num}.</span>
                  <div className="flex-1 min-w-0">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <span>{children}</span>,
                      }}
                    >
                      {f.text}
                    </ReactMarkdown>
                    {firstRefId && (
                      <a
                        href={`#fnref-${firstRefId}`}
                        className="ml-2 text-primary-600 hover:text-primary-700 no-underline"
                        aria-label="Torna al riferimento"
                      >
                        ↩
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {activeTarget && (
        <RilevanzaPanel
          target={activeTarget}
          citingChapters={
            citations
              ? activeTarget.kind === 'author'
                ? citations.authors[activeTarget.id] ?? []
                : citations.books[activeTarget.id] ?? []
              : []
          }
          currentChapterSlug={doc.frontmatter.slug}
          onClose={() => setActiveTarget(null)}
        />
      )}
    </div>
  );
}
