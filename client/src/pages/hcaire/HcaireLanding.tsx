import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { hcaireApi } from '../../services/staticContentService';
import type { HcaireSection } from '../../types/staticContent';

const NAV_SECTIONS = [
  { slug: 'metodo',                label: 'Il metodo',                     excerpt: 'Tre livelli di lavoro: fondazione concettuale, traduzione interdisciplinare, sviluppo di strumenti.' },
  { slug: 'progetti',              label: 'Progetti',                      excerpt: 'I progetti di ricerca di HCAIRE.' },
  { slug: 'ambiente-editoriale',   label: 'Ambiente editoriale',           excerpt: 'Blog editoriale, materiali fondativi e comitato scientifico-editoriale.' },
  { slug: 'ia-centrata-sull-umano',label: 'IA orientata alla comprensione', excerpt: 'L\'IA in HCAIRE come supporto al pensiero, non come sostituto del giudizio.' },
  { slug: 'agentic-shift',         label: 'HCAIRE adotta l\'Agentic Shift', excerpt: 'Il sito è realizzato tramite un sistema di AI Orchestration. Cos\'è l\'Agentic Shift e come orienta il lavoro di HCAIRE.' },
  { slug: 'protocolli',            label: 'Protocolli',                     excerpt: 'I protocolli metodologici che guidano l\'interazione con gli LLM nei processi di ricerca e produzione dei contenuti di HCAIRE.' },
];

export default function HcaireLanding() {
  const [sections, setSections] = useState<HcaireSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hcaireApi.getIndex()
      .then((data) => setSections(data.sections))
      .catch(() => setSections([]))
      .finally(() => setLoading(false));
  }, []);

  const preamble = sections.find((s) => s.slug === '__preamble__' || s.title === '__preamble__');
  const bartleby = sections.find((s) => s.slug === 'bartleby-preview');
  const ambitoAperto = sections.find((s) => s.slug === 'ambiente-aperto');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">HCAIRE</h1>
        <p className="text-lg text-gray-500 font-light">Human Centered Artificial Intelligence Research Environment</p>
      </header>

      {/* Testo identitario */}
      {loading ? (
        <div className="h-24 bg-gray-50 animate-pulse rounded-lg mb-12" />
      ) : preamble ? (
        <div className="mb-12">
          <MarkdownRenderer content={preamble.content} />
        </div>
      ) : null}

      {/* Card navigazione sezioni */}
      <section className="grid sm:grid-cols-2 gap-4 mb-12">
        {NAV_SECTIONS.map((s) => (
          <Link
            key={s.slug}
            to={`/hcaire/${s.slug}`}
            className="block rounded-lg border border-gray-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all group"
          >
            <h2 className="font-semibold text-gray-900 group-hover:text-primary-700 mb-1">{s.label}</h2>
            <p className="text-sm text-gray-500 leading-snug">{s.excerpt}</p>
          </Link>
        ))}
      </section>

      {/* Bartleby preview */}
      {bartleby && (
        <section className="mb-10 rounded-lg bg-gray-50 p-6 border border-gray-100">
          <div className="mb-4">
            <MarkdownRenderer content={bartleby.content} />
          </div>
          <Link
            to="/bartleby"
            className="inline-block text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
          >
            Scopri Bartleby →
          </Link>
        </section>
      )}

      {/* Ambiente aperto */}
      {ambitoAperto && (
        <footer className="border-t border-gray-100 pt-8">
          <MarkdownRenderer content={ambitoAperto.content} />
        </footer>
      )}
    </div>
  );
}
