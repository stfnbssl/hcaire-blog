import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import Breadcrumb from '../../components/Breadcrumb';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import TableOfContents from '../../components/TableOfContents';
import StubNotice from '../../components/StubNotice';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import AgenticLabel from '../../components/AgenticLabel';

type PageType = 'finalita' | 'concetti' | 'nota-metodologica' | 'riflessioni' | 'interlocuzioni';

const PAGE_META: Record<PageType, { title: string; breadcrumb: string }> = {
  'finalita':          { title: 'Finalità del progetto',           breadcrumb: 'Finalità' },
  'concetti':          { title: 'Concetti strutturali del modello', breadcrumb: 'Concetti strutturali' },
  'nota-metodologica': { title: 'Nota metodologico-lessicale',      breadcrumb: 'Nota metodologica' },
  'riflessioni':       { title: 'Riflessioni',                      breadcrumb: 'Riflessioni' },
  'interlocuzioni':    { title: 'Interlocuzioni disciplinari',      breadcrumb: 'Interlocuzioni' },
};

interface ContentState {
  content: string;
  title?: string;
  isEmpty: boolean;
  extra?: unknown;
}

export default function SviluppoBambinoPage() {
  const location = useLocation();
  const pageType = location.pathname.split('/').pop() as PageType;
  const meta = PAGE_META[pageType];

  const [state, setState] = useState<ContentState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const api = sviluppoBambinoApi;

    const fetchers: Record<PageType, () => Promise<ContentState>> = {
      'finalita': async () => {
        const d = await api.getFinalita();
        return { content: d.content, title: d.title, isEmpty: !d.content };
      },
      'concetti': async () => {
        const d = await api.getConcetti();
        const combined = d.concetti
          .map((c) => `## ${c.title}\n\n${c.content}`)
          .join('\n\n');
        return { content: combined, title: d.title, isEmpty: !combined, extra: d.concetti };
      },
      'nota-metodologica': async () => {
        const d = await api.getNotaMetodologica();
        return { content: d.content, title: d.title, isEmpty: !d.content };
      },
      'riflessioni': async () => {
        const d = await api.getRiflessioni();
        return { content: '', title: 'Riflessioni', isEmpty: false, extra: d.items };
      },
      'interlocuzioni': async () => {
        const d = await api.getInterlocuzioni();
        return { content: '', title: 'Interlocuzioni disciplinari', isEmpty: false, extra: d.ambiti };
      },
    };

    fetchers[pageType]?.()
      .then(setState)
      .catch(() => setState({ content: '', isEmpty: true }))
      .finally(() => setLoading(false));
  }, [pageType]);

  if (!meta) return <div className="max-w-4xl mx-auto px-4 py-12 text-gray-500">Pagina non trovata.</div>;

  return (
    <>
      <SviluppoBambinoNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Sviluppo bambino', to: '/sviluppo-bambino' },
        { label: meta.breadcrumb },
      ]} />

      <div className="flex gap-12">
        <article className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{meta.title}</h1>

          {loading && <div className="h-64 bg-gray-50 animate-pulse rounded-lg" />}

          {state && !loading && (
            <>
              {pageType === 'riflessioni' && (
                <RiflessioniList items={(state.extra as Array<{ title: string; slug: string; isEmpty: boolean }>) ?? []} />
              )}
              {pageType === 'interlocuzioni' && (
                <InterlocuzioniList items={(state.extra as Array<{ title: string; slug: string; count: number }>) ?? []} />
              )}
              {state.isEmpty && pageType !== 'riflessioni' && pageType !== 'interlocuzioni' && (
                <StubNotice parentTo="/sviluppo-bambino" parentLabel="Sviluppo bambino" />
              )}
              {!state.isEmpty && state.content && (
                <>
                  <MarkdownRenderer content={state.content} />
                  <AgenticLabel />
                </>
              )}
              {!state.isEmpty && (pageType === 'riflessioni' || pageType === 'interlocuzioni') && (
                <AgenticLabel />
              )}
            </>
          )}

          <div className="mt-10 pt-8 border-t border-gray-100">
            <Link to="/sviluppo-bambino" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              ← Sviluppo bambino
            </Link>
          </div>
        </article>

        <TableOfContents />
      </div>
    </div>
    </>
  );
}

function RiflessioniList({ items }: { items: Array<{ title: string; slug: string; isEmpty: boolean }> }) {
  if (!items.length) return <p className="text-gray-400">Nessun documento disponibile.</p>;
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.slug} className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${item.isEmpty ? 'bg-gray-200' : 'bg-primary-400'}`} />
          <span className="text-gray-700">{item.title}</span>
          {item.isEmpty && <span className="text-xs text-gray-400 italic">in elaborazione</span>}
        </li>
      ))}
    </ul>
  );
}

function InterlocuzioniList({ items }: { items: Array<{ title: string; slug: string; count: number }> }) {
  if (!items.length) return <p className="text-gray-400">Nessun ambito disponibile.</p>;
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.slug} className="flex items-center gap-3">
          <span className="font-medium text-gray-800">{item.title}</span>
          <span className="text-sm text-gray-400">({item.count} {item.count === 1 ? 'documento' : 'documenti'})</span>
        </li>
      ))}
    </ul>
  );
}
