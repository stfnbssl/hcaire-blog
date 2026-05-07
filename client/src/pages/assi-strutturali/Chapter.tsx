import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarkdownRenderer, { type RilevanzaMap } from '../../components/MarkdownRenderer';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import type { Chapter } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import AssiStrutturaliNav from '../../components/AssiStrutturaliNav';
import PrevNext from '../../components/PrevNext';
import TableOfContents from '../../components/TableOfContents';
import StubNotice from '../../components/StubNotice';
import AgenticLabel from '../../components/AgenticLabel';

interface RilevanzaSource {
  autori: { id: string; nome: string; rilevanza: string }[];
  libri: { id: string; titolo: string; rilevanza: string }[];
}

const RILEVANZA_FILES = [
  '/data/sviluppo-bambino-rilevanza-giorno-1.json',
];

async function loadRilevanzaMap(): Promise<RilevanzaMap> {
  const map: RilevanzaMap = {};
  await Promise.all(
    RILEVANZA_FILES.map((url) =>
      fetch(url)
        .then<RilevanzaSource>((r) => r.json())
        .then((data) => {
          data.autori.forEach((a) => { map[a.id] = { label: a.nome, rilevanza: a.rilevanza }; });
          data.libri.forEach((l) => { map[l.id] = { label: l.titolo, rilevanza: l.rilevanza }; });
        })
        .catch(() => {/* skip missing files */}),
    ),
  );
  return map;
}

export default function ChapterPage() {
  const { asseSlug = '', chapterSlug = '' } = useParams<{ asseSlug: string; chapterSlug: string }>();
  const [data, setData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [rilevanzaMap, setRilevanzaMap] = useState<RilevanzaMap | undefined>(undefined);

  useEffect(() => {
    loadRilevanzaMap().then(setRilevanzaMap);
  }, []);

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

          {data && !loading && (
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

              {data.isEmpty ? (
                <StubNotice
                  parentTo={`/assi-strutturali/${asseSlug}`}
                  parentLabel={fm?.asse ?? 'Asse'}
                />
              ) : (
                <>
                  <MarkdownRenderer content={data.content.replace(/^\s*#[^#][^\n]*\n?/, '')} rilevanzaMap={rilevanzaMap} />
                  <AgenticLabel />
                </>
              )}

              {fm && (
                <>
                  <PrevNext
                    prevSlug={fm.prev ?? undefined}
                    nextSlug={fm.next ?? undefined}
                    baseUrl={`/assi-strutturali/${asseSlug}`}
                  />
                  <div className="mt-4 text-center">
                    <Link
                      to={`/assi-strutturali/${asseSlug}`}
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
