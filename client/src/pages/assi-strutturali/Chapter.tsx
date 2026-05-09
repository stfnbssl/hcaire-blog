import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StructuredChapterRenderer from '../../components/StructuredChapterRenderer';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import type { ChapterDocument, Author, Book, CitationsIndex } from '@shared/types/assi';
import Breadcrumb from '../../components/Breadcrumb';
import AssiStrutturaliNav from '../../components/AssiStrutturaliNav';
import PrevNext from '../../components/PrevNext';
import TableOfContents from '../../components/TableOfContents';
import AgenticLabel from '../../components/AgenticLabel';

export default function ChapterPage() {
  const { asseSlug = '', chapterSlug = '' } = useParams<{ asseSlug: string; chapterSlug: string }>();
  const [doc, setDoc] = useState<ChapterDocument | null>(null);
  const [authors, setAuthors] = useState<Author[] | null>(null);
  const [books, setBooks] = useState<Book[] | null>(null);
  const [citations, setCitations] = useState<CitationsIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErrorMsg(null);

    Promise.all([
      sviluppoBambinoApi.getChapter(asseSlug, chapterSlug),
      sviluppoBambinoApi.getCatalogoAuthors(),
      sviluppoBambinoApi.getCatalogoBooks(),
      sviluppoBambinoApi.getCitations(),
    ])
      .then(([chDoc, authorsFile, booksFile, citationsIdx]) => {
        setDoc(chDoc);
        setAuthors(authorsFile.authors);
        setBooks(booksFile.books);
        setCitations(citationsIdx);
      })
      .catch((e) => {
        setDoc(null);
        setErrorMsg(
          'Impossibile caricare il capitolo. Verifica che il backend abbia eseguito la conversione (`npm run assi:convert -- --write`). ' +
            `Dettagli: ${(e as Error).message}`,
        );
      })
      .finally(() => setLoading(false));
  }, [asseSlug, chapterSlug]);

  const fm = doc?.frontmatter;

  return (
    <>
      <AssiStrutturaliNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[
          { label: 'Home', to: '/' },
          { label: 'Assi strutturali', to: '/assi-strutturali' },
          { label: 'Capitoli', to: '/assi-strutturali/capitoli' },
          { label: fm?.asse ?? asseSlug, to: `/assi-strutturali/${asseSlug}` },
          { label: fm?.title ?? chapterSlug },
        ]} />

        <div className="flex gap-12">
          <article className="flex-1 min-w-0">
            {loading && <div className="h-96 bg-gray-50 animate-pulse rounded-lg" />}

            {!loading && errorMsg && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                {errorMsg}
              </div>
            )}

            {!loading && !errorMsg && doc && authors && books && (
              <>
                {fm && (
                  <header className="mb-8">
                    <p className="text-sm text-gray-400 mb-1">
                      Capitolo {fm.chapter} ·{' '}
                      <Link
                        to={`/assi-strutturali/${asseSlug}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {fm.asse}
                      </Link>
                    </p>
                    <h1 className="text-3xl font-bold text-gray-900">{fm.title}</h1>
                  </header>
                )}

                <StructuredChapterRenderer
                  doc={doc}
                  authors={authors}
                  books={books}
                  citations={citations ?? undefined}
                />
                <AgenticLabel />

                <PrevNext
                  prevSlug={fm?.prev ?? undefined}
                  nextSlug={fm?.next ?? undefined}
                  baseUrl={`/assi-strutturali/${asseSlug}`}
                />
                <div className="mt-4 text-center">
                  <Link
                    to={`/assi-strutturali/${asseSlug}`}
                    className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    Tutti i capitoli di {fm?.asse}
                  </Link>
                </div>
              </>
            )}
          </article>

          <TableOfContents />
        </div>
      </div>
    </>
  );
}
