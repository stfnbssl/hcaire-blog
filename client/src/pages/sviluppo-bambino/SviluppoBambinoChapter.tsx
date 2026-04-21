import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import type { Chapter } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import PrevNext from '../../components/PrevNext';
import TableOfContents from '../../components/TableOfContents';
import StubNotice from '../../components/StubNotice';
import AgenticLabel from '../../components/AgenticLabel';

export default function SviluppoBambinoChapter() {
  const { asseSlug = '', chapterSlug = '' } = useParams<{ asseSlug: string; chapterSlug: string }>();
  const [data, setData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    sviluppoBambinoApi.getChapter(asseSlug, chapterSlug)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [asseSlug, chapterSlug]);

  const fm = data?.frontmatter;

  return (
    <>
      <SviluppoBambinoNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Sviluppo bambino', to: '/sviluppo-bambino' },
        { label: 'Assi strutturali', to: '/sviluppo-bambino/assi' },
        { label: fm?.asse ?? asseSlug, to: `/sviluppo-bambino/assi/${asseSlug}` },
        { label: fm?.title ?? chapterSlug },
      ]} />

      <div className="flex gap-12">
        <article className="flex-1 min-w-0">
          {loading && <div className="h-96 bg-gray-50 animate-pulse rounded-lg" />}

          {data && !loading && (
            <>
              {fm && (
                <header className="mb-8">
                  <p className="text-sm text-gray-400 mb-1">
                    Capitolo {fm.chapter} ·{' '}
                    <Link
                      to={`/sviluppo-bambino/assi/${asseSlug}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {fm.asse}
                    </Link>
                  </p>
                  <h1 className="text-3xl font-bold text-gray-900">{fm.title}</h1>
                </header>
              )}

              {data.isEmpty ? (
                <StubNotice
                  parentTo={`/sviluppo-bambino/assi/${asseSlug}`}
                  parentLabel={fm?.asse ?? 'Asse'}
                />
              ) : (
                <>
                  <MarkdownRenderer content={data.content} />
                  <AgenticLabel />
                </>
              )}

              {fm && (
                <>
                  <PrevNext
                    prevSlug={fm.prev ?? undefined}
                    nextSlug={fm.next ?? undefined}
                    baseUrl={`/sviluppo-bambino/assi/${asseSlug}`}
                  />
                  <div className="mt-4 text-center">
                    <Link
                      to={`/sviluppo-bambino/assi/${asseSlug}`}
                      className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      Tutti i capitoli di {fm.asse}
                    </Link>
                  </div>
                </>
              )}
            </>
          )}
        </article>

        <TableOfContents />
      </div>
    </div>
    </>
  );
}
