import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import LaboratorioNav from '../../components/LaboratorioNav';
import { hcaireApi } from '../../services/staticContentService';
import type { HcaireSection } from '../../types/staticContent';

interface SezioneLab {
  slug: string;
  label: string;
  tagline: string;
  body: string;
  cta: string;
  headerBg: string;
  borderAccent: string;
  subtitleColor: string;
  ctaHover: string;
}

const SEZIONI: SezioneLab[] = [
  {
    slug: 'metodo',
    label: 'Il metodo',
    tagline: 'Tre livelli di lavoro per pensare l\'intelligenza artificiale',
    body: 'Il metodo HCAIRE articola il lavoro su tre livelli compresenti: la fondazione concettuale (le categorie con cui pensare l\'IA in rapporto alle scienze umane), la traduzione interdisciplinare (i protocolli che permettono a discipline diverse di intendersi senza dissolversi) e lo sviluppo di strumenti operativi coerenti con la fondazione.',
    cta: 'Approfondisci il metodo →',
    headerBg: 'bg-indigo-950',
    borderAccent: 'border-l-indigo-400',
    subtitleColor: 'text-indigo-300',
    ctaHover: 'hover:text-indigo-700',
  },
  {
    slug: 'progetti',
    label: 'Progetti',
    tagline: 'Le aree di ricerca attive del laboratorio',
    body: 'I progetti di HCAIRE applicano l\'impianto concettuale e metodologico a domini specifici, conducendo dalla fondazione teorica alla costruzione di strumenti professionali. Il primo progetto è Sviluppo Bambino, un modello strutturale per leggere lo sviluppo umano 0–12 anni.',
    cta: 'Vedi i progetti →',
    headerBg: 'bg-teal-900',
    borderAccent: 'border-l-teal-400',
    subtitleColor: 'text-teal-300',
    ctaHover: 'hover:text-teal-700',
  },
  {
    slug: 'ambiente-editoriale',
    label: 'Ambiente editoriale',
    tagline: 'I luoghi della scrittura del laboratorio',
    body: 'L\'ambiente editoriale comprende il blog, i materiali fondativi e il comitato scientifico-editoriale. L\'editoria non è qui un canale di divulgazione: è uno strumento di pensiero, in cui la forma testuale è parte della costruzione concettuale.',
    cta: 'Esplora l\'ambiente editoriale →',
    headerBg: 'bg-violet-950',
    borderAccent: 'border-l-violet-400',
    subtitleColor: 'text-violet-300',
    ctaHover: 'hover:text-violet-700',
  },
  {
    slug: 'ia-centrata-sull-umano',
    label: 'IA orientata alla comprensione',
    tagline: 'L\'IA come supporto al pensiero, non come sostituto del giudizio',
    body: 'HCAIRE adotta un orientamento preciso nell\'uso degli LLM: l\'intelligenza artificiale è uno strumento per affinare il pensiero, non per sostituire il giudizio professionale o la responsabilità interpretativa. Questo orientamento ha conseguenze concrete sulla progettazione degli strumenti e sui protocolli di interazione con i modelli.',
    cta: 'Leggi l\'orientamento →',
    headerBg: 'bg-amber-900',
    borderAccent: 'border-l-amber-400',
    subtitleColor: 'text-amber-300',
    ctaHover: 'hover:text-amber-700',
  },
  {
    slug: 'agentic-shift',
    label: 'HCAIRE adotta l\'Agentic Shift',
    tagline: 'Il sito stesso come dispositivo agentico',
    body: 'L\'Agentic Shift è il passaggio da modelli di IA conversazionali a sistemi di AI Orchestration in cui agenti specializzati cooperano. Il sito di HCAIRE è realizzato proprio attraverso un\'architettura di questo tipo: mostrare come è fatto il laboratorio è parte del laboratorio.',
    cta: 'Scopri l\'Agentic Shift →',
    headerBg: 'bg-rose-950',
    borderAccent: 'border-l-rose-400',
    subtitleColor: 'text-rose-300',
    ctaHover: 'hover:text-rose-700',
  },
  {
    slug: 'protocolli',
    label: 'Protocolli',
    tagline: 'Le regole d\'interazione con gli LLM',
    body: 'I protocolli HCAIRE sono le regole che guidano l\'interazione con i modelli linguistici nei processi di ricerca e produzione di contenuti, per garantire coerenza concettuale, evitare derive interpretative e mantenere la tracciabilità delle decisioni di traduzione tra livelli disciplinari.',
    cta: 'Consulta i protocolli →',
    headerBg: 'bg-cyan-950',
    borderAccent: 'border-l-cyan-400',
    subtitleColor: 'text-cyan-300',
    ctaHover: 'hover:text-cyan-700',
  },
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
    <div>
      <LaboratorioNav />
      {/* Hero */}
      <div className="bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">
            HCAIRE
          </p>
          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-none tracking-tight">
            Labo<span className="text-sky-300">ratorio</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-200 max-w-2xl leading-relaxed">
            Human Centered Artificial Intelligence Research Environment — un ambiente di ricerca in cui l'intelligenza artificiale è strumento per pensare, non sostituto del giudizio.
          </p>
        </div>
      </div>

      {/* Preamble — testo identitario */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-5/6" />
            </div>
          ) : preamble ? (
            <div className="prose-lg text-gray-700 leading-relaxed">
              <MarkdownRenderer content={preamble.content} />
            </div>
          ) : null}
        </div>
      </div>

      {/* Intro sezioni */}
      <div className="bg-slate-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-5">
            Le sezioni del laboratorio
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            Le aree di lavoro di HCAIRE: dal metodo ai progetti, dall'ambiente editoriale ai protocolli che regolano l'interazione con i modelli linguistici.
          </p>
        </div>
      </div>

      {/* Le 6 sezioni — stile assi-strutturali */}
      {SEZIONI.map((s, idx) => (
        <div key={s.slug} id={`sezione-${s.slug}`}>
          {/* Header colorato */}
          <div className={`${s.headerBg} text-white`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{s.label}</h2>
              <p className={`text-lg sm:text-xl italic ${s.subtitleColor}`}>{s.tagline}</p>
            </div>
          </div>

          {/* Body — alternating bg, border-left accent */}
          <div className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className={`border-l-4 ${s.borderAccent} pl-8 sm:pl-12 py-12 sm:py-16`}>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mb-8">
                  {s.body}
                </p>
                <Link
                  to={`/hcaire/${s.slug}`}
                  className={`text-sm font-medium text-gray-700 ${s.ctaHover} transition-colors`}
                >
                  {s.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Bartleby preview */}
      {bartleby && (
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <div className="rounded-lg bg-slate-900 text-white p-8 sm:p-10 border-l-4 border-sky-400">
              <p className="text-xs font-medium text-sky-300 uppercase tracking-widest mb-4">
                Strumento del laboratorio
              </p>
              <div className="prose prose-invert max-w-none mb-6 [&_*]:text-slate-200 [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_strong]:text-white">
                <MarkdownRenderer content={bartleby.content} />
              </div>
              <Link
                to="/bartleby"
                className="inline-block text-sm font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-md transition-colors"
              >
                Scopri Bartleby →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Ambiente aperto */}
      {ambitoAperto && (
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <div className="border-l-4 border-l-slate-300 pl-8 sm:pl-12">
              <div className="prose-lg text-gray-600 leading-relaxed">
                <MarkdownRenderer content={ambitoAperto.content} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-16" />
    </div>
  );
}
