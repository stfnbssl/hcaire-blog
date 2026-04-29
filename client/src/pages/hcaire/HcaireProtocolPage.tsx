import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hcaireApi } from '../../services/staticContentService';
import type { HcaireSection } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import LaboratorioNav from '../../components/LaboratorioNav';
import TableOfContents from '../../components/TableOfContents';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import AgenticLabel from '../../components/AgenticLabel';

const SECTION_TITLES: Record<string, string> = {
  'ricerca-assistita-ai': 'Ricerca Assistita da AI',
};

function splitAtWorkflow(content: string): { before: string; workflow: string; after: string } {
  const workflowMarker = '\n## **9.';
  const afterWorkflowMarker = '\n## **10.';
  const wi = content.indexOf(workflowMarker);
  if (wi === -1) return { before: content, workflow: '', after: '' };
  const ai = content.indexOf(afterWorkflowMarker, wi + 1);
  if (ai === -1) return { before: content.slice(0, wi), workflow: content.slice(wi), after: '' };
  return {
    before: content.slice(0, wi),
    workflow: content.slice(wi, ai),
    after: content.slice(ai),
  };
}

export default function HcaireProtocolPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const [data, setData] = useState<HcaireSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    hcaireApi.getSubsection('protocolli', slug)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const breadcrumbLabel = SECTION_TITLES[slug] ?? data?.title ?? slug;
  const version = data?.frontmatter?.version as string | undefined;

  const { before, workflow, after } = data?.content
    ? splitAtWorkflow(data.content)
    : { before: '', workflow: '', after: '' };

  return (
    <>
      <LaboratorioNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Laboratorio', to: '/hcaire' },
        { label: 'Protocolli', to: '/hcaire/protocolli' },
        { label: breadcrumbLabel },
      ]} />

      <div className="flex gap-12">
        <article className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{data?.title ?? breadcrumbLabel}</h1>

          {/* InfoBox utilizzo */}
          <div className="infobox-usage mb-8 rounded border border-gray-200 bg-gray-50 px-5 py-4 text-sm italic text-gray-600">
            Questo protocollo è progettato per essere eseguito da agenti AI in workflow automatizzati,
            oppure da operatori del comitato scientifico-editoriale tramite interazione diretta con un modello linguistico.
          </div>

          {loading && <div className="h-96 bg-gray-50 animate-pulse rounded-lg" />}
          {error && <p className="text-red-500">Errore nel caricamento del contenuto.</p>}

          {data && !loading && !data.isEmpty && (
            <>
              <MarkdownRenderer content={before} />

              {workflow && (
                <div className="protocol-workflow my-8 rounded-lg border-l-4 border-primary-400 bg-primary-50 px-6 py-5">
                  <MarkdownRenderer content={workflow} />
                </div>
              )}

              {after && <MarkdownRenderer content={after} />}

              <AgenticLabel />

              {version && (
                <p className="mt-4 text-xs text-gray-400 italic">
                  Versione {version} — ultima revisione: 2026-04-19
                </p>
              )}
            </>
          )}

          <div className="mt-10 pt-8 border-t border-gray-100">
            <Link to="/hcaire/protocolli" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              ← Torna ai Protocolli
            </Link>
          </div>
        </article>

        <TableOfContents />
      </div>
    </div>
    </>
  );
}
