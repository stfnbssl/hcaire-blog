import { Link } from 'react-router-dom';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoInterlocuzioniNav from '../../components/SviluppoBambinoInterlocuzioniNav';

const SESSIONI = [
  {
    id: 'A',
    label: 'Bio-relazionale',
    tagline: 'Le strutture biologiche e relazionali di base dello sviluppo',
    discipline: [
      { slug: 'infant-research',             nome: 'Infant Research' },
      { slug: 'neuroscienze-dello-sviluppo', nome: 'Neuroscienze dello Sviluppo' },
      { slug: 'sistemi-dinamici',            nome: 'Teoria dei Sistemi Dinamici' },
      { slug: 'teoria-dellattaccamento',     nome: "Teoria dell'Attaccamento" },
    ],
    headerBg: 'bg-indigo-950',
    borderAccent: 'border-l-indigo-400',
    badgeBg: 'bg-indigo-800',
    taglineColor: 'text-indigo-300',
  },
  {
    id: 'B',
    label: 'Clinico-contestuale',
    tagline: 'I contesti reali di vita, servizio e cura in cui lo sviluppo avviene',
    discipline: [
      { slug: 'psicopatologia-dello-sviluppo', nome: 'Psicopatologia dello Sviluppo' },
      { slug: 'ecologia-dello-sviluppo',       nome: 'Ecologia dello Sviluppo' },
      { slug: 'pediatria-per-lo-sviluppo',     nome: 'Pediatria per lo Sviluppo' },
      { slug: 'psicologia-di-comunita',        nome: 'Psicologia di Comunità' },
    ],
    headerBg: 'bg-teal-900',
    borderAccent: 'border-l-teal-400',
    badgeBg: 'bg-teal-700',
    taglineColor: 'text-teal-300',
  },
  {
    id: 'C',
    label: 'Metodologico-integrativa',
    tagline: 'Grammatiche trasversali per pensare la complessità dello sviluppo come sistema',
    discipline: [
      { slug: 'epistemologia-della-complessita', nome: 'Epistemologia della Complessità' },
      { slug: 'sistemi-motivazionali',           nome: 'Sistemi Motivazionali' },
      { slug: 'free-energy-principle',           nome: 'Free Energy Principle' },
    ],
    headerBg: 'bg-violet-950',
    borderAccent: 'border-l-violet-400',
    badgeBg: 'bg-violet-800',
    taglineColor: 'text-violet-300',
  },
];

const SCHEDA_SEZIONI = [
  { n: '1', label: 'Identificazione del riferimento disciplinare' },
  { n: '2', label: 'Statuto epistemologico del contributo' },
  { n: '3', label: 'Punti di ingresso nel modello degli assi' },
  { n: '4', label: 'Contributi effettivi al modello' },
  { n: '5', label: 'Limiti del contributo rispetto al modello' },
  { n: '6', label: 'Prospettiva degli strumenti operativi' },
];

export default function SviluppoBambinoInterlocuzioniLanding() {
  return (
    <div>
      <SviluppoBambinoNav />
      <SviluppoBambinoInterlocuzioniNav />

      {/* Hero */}
      <div className="bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-none tracking-tight">
            Le <span className="text-indigo-300">interlocuzioni</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-200 max-w-2xl leading-relaxed mb-4">
            Undici discipline in dialogo con il progetto. Nessuna lo fonda: tutte contribuiscono.
          </p>
          <p className="text-base text-slate-400 max-w-xl leading-relaxed mb-10">
            La ricerca sullo sviluppo sa moltissimo. Il progetto costruisce il livello in cui quel sapere diventa usabile insieme.
          </p>
          <Link
            to="/sviluppo-bambino/interlocuzioni/discipline"
            className="inline-block text-sm font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-md transition-colors"
          >
            Vai alle undici discipline →
          </Link>
        </div>
      </div>

      {/* Apertura — full text */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6">
            Il problema non è la mancanza di conoscenze scientifiche sullo sviluppo del bambino. Negli ultimi cinquant'anni, neuroscienze, teoria dell'attaccamento, ricerca sull'infante, psicopatologia dello sviluppo hanno prodotto conoscenze straordinarie.
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 max-w-3xl">
            Il problema è usarle insieme senza che nessuna sopprima le altre. Ogni disciplina produce conoscenze genuine ma parziali. Le neuroscienze descrivono i meccanismi biologici ma non la normatività. La teoria dell'attaccamento descrive la relazione precoce ma non il desiderio. La psicopatologia descrive le traiettorie ma non la struttura soggettiva.
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            Il modello degli assi strutturali costruisce il livello di astrazione che consente a ciascuna disciplina di contribuire alla propria regione di pertinenza senza pretendere di spiegare l'intero. Le interlocuzioni documentano questo processo disciplina per disciplina.
          </p>
        </div>
      </div>

      {/* Tre sessioni */}
      {SESSIONI.map((sessione, idx) => (
        <div key={sessione.id}>
          <div className={`${sessione.headerBg} text-white`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
              <div className="flex items-start gap-5">
                <span className={`flex-shrink-0 ${sessione.badgeBg} text-white text-xs font-bold px-3 py-1 rounded-md mt-1`}>
                  Sessione {sessione.id}
                </span>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-1">{sessione.label}</h2>
                  <p className={`text-base italic ${sessione.taglineColor}`}>{sessione.tagline}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className={`border-l-4 ${sessione.borderAccent} pl-8 sm:pl-12 py-10 sm:py-12`}>
                <ul className="space-y-3">
                  {sessione.discipline.map((d) => (
                    <li key={d.slug}>
                      <Link
                        to={`/sviluppo-bambino/interlocuzioni/discipline/${d.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        <span className="text-gray-300 group-hover:text-indigo-400 transition-colors text-lg leading-none">→</span>
                        <span className="text-base sm:text-lg font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">
                          {d.nome}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    to="/sviluppo-bambino/interlocuzioni/discipline"
                    className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    Vai all'indice completo →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Come funziona una scheda — full text */}
      <div className="bg-slate-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            Come funziona una scheda di interlocuzione
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-3xl">
            Le schede non sono rassegne bibliografiche né endorsement teorici. Sono analisi strutturate che per ciascuna disciplina documentano il doppio movimento fondamentale: raccogliere ciò che essa sa fare meglio, e identificare dove il suo linguaggio rischia di distorcere ciò che il progetto vuole proteggere.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
            {SCHEDA_SEZIONI.map((s) => (
              <div key={s.n} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">
                  {s.n}
                </span>
                <span className="text-sm text-gray-700 leading-snug">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cosa emerge — full text */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10">
            Cosa emerge dall'insieme
          </h2>

          <div className="space-y-10 max-w-3xl">
            <div className="border-l-4 border-amber-400 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Nessuna disciplina risponde alle domande normative
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Tutte le undici discipline concordano su un punto: nessuna di esse può dire cosa vale, cosa è bene, come si orienta il bambino verso il bene. Tutte descrivono come lo sviluppo avviene, quali condizioni lo favoriscono, quali traiettorie porta — ma nessuna risponde alla domanda su cosa vale. Questa assenza non è un difetto delle discipline: è una caratteristica strutturale delle scienze descrittive. Il progetto occupa questo spazio con gli strumenti dell'Asse 3.
              </p>
            </div>

            <div className="border-l-4 border-emerald-400 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                La convergenza sull'inizio: i primi anni come priorità
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Da discipline molto diverse — neuroscienze, attaccamento, sistemi dinamici, pediatria — emerge una convergenza sorprendente: i primi anni di vita sono la finestra temporale più rilevante per qualsiasi intervento preventivo. Questa convergenza non viene da una sola teoria: viene da tradizioni metodologicamente indipendenti, e rafforza la logica preventiva del progetto in modo pluridisciplinare.
              </p>
            </div>

            <div className="border-l-4 border-slate-300 pl-6">
              <p className="text-sm text-gray-500 italic leading-relaxed">
                <strong className="text-gray-700 not-italic">Nota epistemologica:</strong> il modello degli assi strutturali non è derivato da nessuna teoria scientifica dello sviluppo, ma da un'analisi filosofico-concettuale di ciò che non può mancare alla comprensione del soggetto umano che si sviluppa. Le discipline scientifiche vengono in un secondo momento: non come fondamenta, ma come interlocutori che rafforzano alcune regioni del modello e vengono a loro volta interrogati sui propri limiti.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              to="/sviluppo-bambino/interlocuzioni/discipline"
              className="inline-block text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              Esplora le undici discipline →
            </Link>
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
