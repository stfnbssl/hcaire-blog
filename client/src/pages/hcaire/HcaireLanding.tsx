import { Link } from 'react-router-dom';
import LaboratorioNav from '../../components/LaboratorioNav';
import T from '../../components/T';
import { useT } from '../../context/SiteContentContext';
import { useIsAdmin } from '../../hooks/useIsAdmin';

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
  adminOnly?: boolean;
  /** Override del path di destinazione del CTA; di default è `/hcaire/${slug}`. */
  to?: string;
}

const SEZIONI: SezioneLab[] = [
  {
    slug: 'manifesto',
    label: 'Manifesto',
    tagline: 'Esplicitare i quadri della ricerca, governare il contesto dell\'AI',
    body: 'HCAIRE è un laboratorio per la sperimentazione dell\'applicazione dell\'intelligenza artificiale alle scienze umane. Opera all\'intersezione tra fenomenologia, psicologia dello sviluppo, semiotica, neuroscienze affettive, clinica e pedagogia.\n\nLo studio scientifico dello sviluppo umano interagisce sempre con quadri antropologici, filosofici e normativi che orientano la lettura dei dati empirici. Il manifesto teorico di HCAIRE chiede di esplicitare questi quadri come condizione del rigore della ricerca, non come aggiunta esterna ad essa. È a partire da qui che si pone il problema specifico dell\'AI nelle scienze umane: per usarla bene bisogna governare la memoria di contesto — scopo, lessico, riferimenti, vincoli. La qualità di ciò che il modello restituisce dipende dalla qualità del contesto che gli viene affidato.',
    cta: 'Leggi i manifesti →',
    headerBg: 'bg-amber-900',
    borderAccent: 'border-l-amber-400',
    subtitleColor: 'text-amber-300',
    ctaHover: 'hover:text-amber-700',
  },
  {
    slug: 'metodo',
    label: 'Il metodo',
    tagline: 'Traduzione interdisciplinare, operatori di lettura, famiglie di output',
    body: 'Il metodo trasversale di HCAIRE costruisce un linguaggio comune fra discipline (psicologia, fenomenologia, neuroscienze, semiotica, clinica, pedagogia) senza ridurre il sapere di ciascuna. Si articola in traduzione interdisciplinare (concetti di secondo livello — i *nodi trasversali* — che descrivono la struttura comune a partire da linguaggi differenti), operatori di lettura (lenti teoriche che rendono visibili dimensioni del campo relazionale, non scale di valutazione), e famiglie di output istanziate in strumenti contestualizzati nella Fase 2.\n\nI sistemi LLM non sono qui un ausilio: sono componenti attive dello sviluppo del progetto, che navigano il corpus come memoria di contesto strutturata.',
    cta: 'Approfondisci il metodo →',
    to: '/metodo',
    headerBg: 'bg-indigo-950',
    borderAccent: 'border-l-indigo-400',
    subtitleColor: 'text-indigo-300',
    ctaHover: 'hover:text-indigo-700',
  },
  {
    slug: 'progetti',
    label: 'Progetti',
    tagline: 'Anthropos, Sviluppo Bambino e gli altri domini applicativi',
    body: 'L\'architettura teorica di HCAIRE si articola su tre piani: un piano ontologico-strutturale (gli *assi strutturali* — le dimensioni permanenti della struttura soggettiva), un piano temporale-evolutivo (**Anthropos**, la configurazione evolutiva dell\'umano lungo l\'intero arco della vita), un piano operativo-contestuale (i *domini applicativi* — a partire da **Sviluppo Bambino**, finestra 0–12 anni).\n\nCiascun dominio lavora sulla stessa struttura teorica applicata a una configurazione storica particolare. Domini ulteriori previsti: adolescenza, genitorialità, educazione, clinica, aging, AI & Human Development.',
    cta: 'Vedi i progetti →',
    to: '/progetti',
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
    adminOnly: true,
  },
];

export default function HcaireLanding() {
  const t = useT();
  const isAdmin = useIsAdmin();
  const visibleSezioni = SEZIONI.filter((s) => !s.adminOnly || isAdmin);

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

      {/* Sezioni — stile assi-strutturali */}
      {visibleSezioni.map((s, idx) => (
        <div key={s.slug} id={`sezione-${s.slug}`}>
          {/* Header colorato */}
          <div className={`${s.headerBg} text-white`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                {t(`laboratorio.sezioni.${s.slug}.label`, s.label)}
              </h2>
              <p className={`text-lg sm:text-xl italic ${s.subtitleColor}`}>
                {t(`laboratorio.sezioni.${s.slug}.tagline`, s.tagline)}
              </p>
            </div>
          </div>

          {/* Body — alternating bg, border-left accent */}
          <div className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className={`border-l-4 ${s.borderAccent} pl-8 sm:pl-12 py-12 sm:py-16`}>
                <T
                  id={`laboratorio.sezioni.${s.slug}.body`}
                  fallback={s.body}
                  markdown
                  className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mb-8 prose prose-sm sm:prose-base max-w-none"
                />
                <Link
                  to={s.to ?? `/hcaire/${s.slug}`}
                  className={`text-sm font-medium text-gray-700 ${s.ctaHover} transition-colors`}
                >
                  {t(`laboratorio.sezioni.${s.slug}.cta`, s.cta)}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Bartleby preview */}
      {/* Strumenti del laboratorio */}
      <div className="bg-slate-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-6">
          {/* Bartleby */}
          <div className="rounded-lg bg-white p-8 sm:p-10 border border-gray-200 border-l-4 border-l-sky-400 shadow-sm">
            <p className="text-xs font-medium text-sky-700 uppercase tracking-widest mb-4">
              Strumento del laboratorio
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Bartleby</h3>
            <p className="text-base text-gray-700 leading-relaxed mb-6 max-w-2xl">
              Un assistente che traduce situazioni concrete in dispositivi di lavoro, attraverso una base di conoscenza strutturata sullo sviluppo del bambino. Riservato agli abbonati.
            </p>
            <Link
              to="/bartleby"
              className="inline-block text-sm font-medium bg-sky-700 hover:bg-sky-800 text-white px-5 py-2.5 rounded-md transition-colors"
            >
              Scopri Bartleby →
            </Link>
          </div>

          {/* Letture critiche */}
          <div className="rounded-lg bg-white p-8 sm:p-10 border border-gray-200 border-l-4 border-l-amber-400 shadow-sm">
            <p className="text-xs font-medium text-amber-700 uppercase tracking-widest mb-4">
              Strumento del laboratorio
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Letture critiche</h3>
            <p className="text-base text-gray-700 leading-relaxed mb-6 max-w-2xl">
              Letture critiche di opere culturali — romanzi, racconti, film e altri testi — costruite a partire da una pipeline analitica multi-stadio. Strumenti per orientare lo sguardo, non recensioni.
            </p>
            <Link
              to="/letture"
              className="inline-block text-sm font-medium bg-amber-700 hover:bg-amber-800 text-white px-5 py-2.5 rounded-md transition-colors"
            >
              Vedi le letture critiche →
            </Link>
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
