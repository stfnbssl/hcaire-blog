import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hcaireApi } from '../../services/staticContentService';
import type { HcaireSection } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import LaboratorioNav from '../../components/LaboratorioNav';
import TableOfContents from '../../components/TableOfContents';
import StubNotice from '../../components/StubNotice';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import AgenticLabel from '../../components/AgenticLabel';

const SECTION_LABELS: Record<string, string> = {
  'manifesto':              'Il manifesto di HCAIRE',
  'metodo':                 'Il metodo HCAIRE',
  'progetti':               'Progetti',
  'ambiente-editoriale':    'Ambiente editoriale',
  'ia-centrata-sull-umano': 'IA orientata alla comprensione',
  'agentic-shift':          "HCAIRE adotta l'Agentic Shift",
};

export default function HcairePage() {
  const { section = '' } = useParams<{ section: string }>();
  const [data, setData] = useState<HcaireSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    hcaireApi.getSection(section)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [section]);

  const label = SECTION_LABELS[section] ?? data?.title ?? section;

  return (
    <>
      <LaboratorioNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Laboratorio', to: '/hcaire' },
        { label: label },
      ]} />

      <div className="flex gap-12">
        <article className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{label}</h1>

          {loading && <div className="h-48 bg-gray-50 animate-pulse rounded-lg" />}
          {error && <p className="text-red-500">Errore nel caricamento del contenuto.</p>}

          {data && !loading && (
            data.isEmpty
              ? <StubNotice parentTo="/hcaire" parentLabel="HCAIRE" />
              : <>
                  <MarkdownRenderer content={data.content} />
                  <AgenticLabel />
                </>
          )}

          {section === 'progetti' && (
            <div className="mt-8">
              <Link
                to="/sviluppo-bambino"
                className="block rounded-lg border border-gray-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 mb-1">Sviluppo bambino</h3>
                <p className="text-sm text-gray-500">Un modello strutturale dello sviluppo umano 0–12 anni articolato in sei assi.</p>
                <span className="mt-2 inline-block text-sm text-primary-600">Entra →</span>
              </Link>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-gray-100">
            <Link to="/hcaire" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              ← Torna al Laboratorio
            </Link>
          </div>
        </article>

        <TableOfContents />
      </div>
    </div>
    </>
  );
}
