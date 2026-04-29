import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { hcaireApi } from '../../services/staticContentService';
import type { HcaireSection } from '../../types/staticContent';
import Breadcrumb from '../../components/Breadcrumb';
import LaboratorioNav from '../../components/LaboratorioNav';
import MarkdownRenderer from '../../components/MarkdownRenderer';

const PROTOCOLS = [
  {
    slug: 'ricerca-assistita-ai',
    title: 'Ricerca Assistita da AI: il metodo "Framework & Deep Dive"',
    excerpt: 'Un protocollo strutturato in 5 fasi per condurre ricerche interdisciplinari con LLM, con strumenti di controllo critico integrati.',
  },
];

export default function HcaireProtocolliLanding() {
  const [data, setData] = useState<HcaireSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hcaireApi.getSection('protocolli')
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <LaboratorioNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Laboratorio', to: '/hcaire' },
        { label: 'Protocolli' },
      ]} />

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Protocolli</h1>
        <p className="text-base text-gray-500 font-light">Strumenti metodologici per la ricerca assistita da AI</p>
      </header>

      {loading && <div className="h-48 bg-gray-50 animate-pulse rounded-lg mb-10" />}

      {data && !loading && (
        <div className="mb-10 prose-sm prose text-gray-700 max-w-none">
          <MarkdownRenderer content={data.content} />
        </div>
      )}

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Protocolli disponibili</h2>
        <div className="grid gap-4">
          {PROTOCOLS.map((p) => (
            <Link
              key={p.slug}
              to={`/hcaire/protocolli/${p.slug}`}
              className="block rounded-lg border border-gray-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 mb-1">{p.title}</h3>
              <p className="text-sm text-gray-500 leading-snug">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-10 pt-8 border-t border-gray-100">
        <Link to="/hcaire" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          ← Torna al Laboratorio
        </Link>
      </div>
    </div>
    </>
  );
}
