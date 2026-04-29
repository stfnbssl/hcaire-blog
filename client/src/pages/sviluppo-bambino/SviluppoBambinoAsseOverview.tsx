import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import type { AsseOverview } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import PrevNext from '../../components/PrevNext';
import TableOfContents from '../../components/TableOfContents';

export default function SviluppoBambinoAsseOverview() {
  const { asseSlug = '' } = useParams<{ asseSlug: string }>();
  const [data, setData] = useState<AsseOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    sviluppoBambinoApi.getModelloAsse(asseSlug)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [asseSlug]);

  return (
    <>
      <SviluppoBambinoNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Sviluppo bambino', to: '/sviluppo-bambino' },
        { label: 'Il modello', to: '/sviluppo-bambino/modello' },
        { label: data?.title ?? asseSlug },
      ]} />

      <div className="flex gap-12">
        <article className="flex-1 min-w-0">
          {loading && <div className="h-64 bg-gray-50 animate-pulse rounded-lg" />}

          {data && !loading && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">{data.title}</h1>

              <MarkdownRenderer content={data.content} />

              {/* Link ai capitoli */}
              <div className="mt-8 rounded-lg bg-gray-50 border border-gray-100 p-5">
                <p className="text-sm text-gray-600 mb-3">Leggi i capitoli integrali di questo asse</p>
                <Link
                  to={`/assi-strutturali/${asseSlug}`}
                  className="font-medium text-primary-600 hover:text-primary-800 transition-colors"
                >
                  Assi strutturali – {data.title} →
                </Link>
              </div>

              <PrevNext
                prevSlug={data.prev ?? undefined}
                nextSlug={data.next ?? undefined}
                baseUrl="/sviluppo-bambino/modello"
              />
            </>
          )}

          <div className="mt-6">
            <Link to="/sviluppo-bambino/modello" className="text-sm text-gray-500 hover:text-gray-800">
              ← Il modello a sei assi
            </Link>
          </div>
        </article>

        <TableOfContents />
      </div>
    </div>
    </>
  );
}
