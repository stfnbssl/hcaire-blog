import { Link } from 'react-router-dom';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';

interface Obiettivo {
  n: number;
  title: string;
  tagline: string;
  body: string[];
  link?: { to: string; label: string };
  headerBg: string;
  borderAccent: string;
  badgeBg: string;
  taglineColor: string;
}

const OBIETTIVI: Obiettivo[] = [
  {
    n: 1,
    title: 'Costruire una grammatica concettuale dello sviluppo',
    tagline: 'Rendere pensabile ciò che le pratiche presuppongono senza esplicitarlo',
    body: [
      'Il primo obiettivo è elaborare un quadro concettuale esplicito che renda pensabile lo sviluppo umano nelle sue condizioni di possibilità — ciò che deve essere vero affinché lo sviluppo possa avvenire — evitando riduzioni funzionalistiche, prestazionali o puramente adattive.',
      'Ogni pratica educativa, clinica o istituzionale porta con sé presupposti ontologici e antropologici impliciti: un\'idea di chi è il bambino, di cosa conta nel suo sviluppo, di che cosa significa crescere bene. Quando questi presupposti restano impliciti, diventano invisibili e non possono essere messi a confronto, corretti o condivisi. Il progetto li rende espliciti e li organizza in un sistema coerente di categorie interpretative capaci di sostenere una lettura strutturale e non frammentata dell\'esperienza di crescita.',
      'Il nucleo di questa grammatica è il modello dei sei assi strutturali di sviluppo: dimensioni costitutive dell\'esperienza del bambino che precedono e fondano qualsiasi descrizione specialistica.',
    ],
    link: { to: '/sviluppo-bambino/assi', label: 'Gli assi strutturali →' },
    headerBg: 'bg-indigo-950',
    borderAccent: 'border-l-indigo-400',
    badgeBg: 'bg-indigo-800',
    taglineColor: 'text-indigo-300',
  },
  {
    n: 2,
    title: 'Rendere possibile un dialogo interdisciplinare controllato',
    tagline: 'Non unificare le discipline: permettergli di intendersi',
    body: [
      'Il secondo obiettivo è costruire condizioni di traducibilità tra linguaggi disciplinari diversi — clinico, educativo, pedagogico, istituzionale — evitando sia la sovrapposizione impropria dei piani sia la frammentazione dei saperi.',
      'La finalità non è unificare le discipline, né affermare che «dicono tutte la stessa cosa». È permettere un confronto concettualmente fondato, in cui i concetti possano circolare da un linguaggio all\'altro mantenendo il proprio statuto e i propri limiti. Un pediatra e un educatore che parlano dello stesso bambino devono poter capirsi senza che uno dei due debba rinunciare alla propria prospettiva professionale.',
      'Questo obiettivo è perseguito attraverso la metodologia di traduzione interdisciplinare che costituisce la Fase 2 del progetto: una pipeline strutturata che garantisce la coerenza concettuale nel passaggio tra livelli disciplinari diversi.',
    ],
    link: { to: '/sviluppo-bambino/metodo', label: 'Il metodo →' },
    headerBg: 'bg-teal-900',
    borderAccent: 'border-l-teal-400',
    badgeBg: 'bg-teal-700',
    taglineColor: 'text-teal-300',
  },
  {
    n: 3,
    title: 'Fondare la progettazione di strumenti professionali contestualizzati',
    tagline: 'Strumenti che nascono da una comprensione, non da un protocollo',
    body: [
      'Il terzo obiettivo è rendere possibile la costruzione di strumenti operativi coerenti con la complessità dello sviluppo umano — strumenti che possano essere usati da pediatri, educatori, assistenti sociali e altri professionisti nei contesti ordinari di cura e educazione.',
      'Il progetto non intende produrre protocolli o standard universali. Intende offrire una base concettuale e metodologica che consenta di progettare strumenti situati — adatti a contesti specifici, orientati alla lettura e all\'accompagnamento dello sviluppo, senza ridurlo a indicatori o classificazioni. Uno strumento fondato in questo modo non dice al professionista cosa fare: lo aiuta a vedere cosa sta succedendo.',
      'Il progetto si colloca principalmente nei primi due livelli della produzione di conoscenza sullo sviluppo umano: la fondazione concettuale e la progettazione metodologica degli strumenti, lasciando alla ricerca empirica il compito di produrre evidenze e verifiche sperimentali.',
    ],
    link: { to: '/sviluppo-bambino/interlocuzioni', label: 'Le interlocuzioni →' },
    headerBg: 'bg-violet-950',
    borderAccent: 'border-l-violet-400',
    badgeBg: 'bg-violet-800',
    taglineColor: 'text-violet-300',
  },
  {
    n: 4,
    title: 'Costruire un sistema cognitivo di supporto basato su AI',
    tagline: "Un'architettura progettata anche per la generazione assistita di output",
    body: [
      'Il quarto obiettivo anticipa una dimensione del progetto che lo distingue dalla maggior parte dei framework teorici tradizionali: l\'impianto concettuale e la metodologia di traduzione sono pensati anche come guida per sistemi di supporto cognitivo avanzato, inclusi strumenti basati su intelligenza artificiale.',
      "L'obiettivo non è automatizzare la produzione di strumenti né sostituire il giudizio professionale: è garantire che la generazione assistita di output — schede, materiali formativi, griglie di osservazione, testi di comunicazione — rimanga coerente con la fondazione teorica del progetto, senza produrre automatismi decisionali o semplificazioni che tradiscano la complessità dell'oggetto.",
      "Il progetto è concepito come un'architettura capace di sostenere nel tempo questa funzione, con criteri espliciti di coerenza e di verifica.",
    ],
    headerBg: 'bg-amber-900',
    borderAccent: 'border-l-amber-400',
    badgeBg: 'bg-amber-700',
    taglineColor: 'text-amber-300',
  },
  {
    n: 5,
    title: 'Garantire coerenza e responsabilità nel tempo',
    tagline: 'Un riferimento stabile che rimane aperto alla revisione',
    body: [
      'Il quinto obiettivo riguarda la continuità del progetto nel tempo: la capacità di costituire un riferimento stabile per pratiche e decisioni, senza chiudersi in un modello definitivo che non può essere corretto o adattato.',
      'La finalità non è la cristallizzazione di un sistema, ma la costruzione di un impianto capace di orientare pratiche e decisioni mantenendo la centralità del soggetto in sviluppo e la responsabilità di chi opera nei contesti educativi, clinici e istituzionali.',
      "Questo richiede processi espliciti di revisione, verifica e adattamento degli strumenti prodotti — e una cultura di progetto che consideri l'apertura alla correzione come un valore, non come un segno di incompletezza.",
    ],
    headerBg: 'bg-rose-950',
    borderAccent: 'border-l-rose-400',
    badgeBg: 'bg-rose-800',
    taglineColor: 'text-rose-300',
  },
];

const SEZIONI_HCAIRE = [
  {
    label: 'Gli assi strutturali',
    desc: 'La grammatica concettuale fondamentale: 44 capitoli che elaborano in profondità le sei dimensioni costitutive dello sviluppo.',
    to: '/sviluppo-bambino/assi',
    obiettivi: '1',
  },
  {
    label: 'Il metodo',
    desc: 'La metodologia di traduzione interdisciplinare e la logica degli strumenti: dalla pipeline di traducibilità alla costruzione degli strumenti operativi.',
    to: '/sviluppo-bambino/metodo',
    obiettivi: '2, 3',
  },
  {
    label: 'Le interlocuzioni',
    desc: 'Il dialogo critico con undici tradizioni di ricerca: convergenze, limiti e indicazioni operative per ciascuna disciplina.',
    to: '/sviluppo-bambino/interlocuzioni',
    obiettivi: '1, 2',
  },
];

export default function SviluppoBambinoFinalitaLanding() {
  return (
    <div>
      <SviluppoBambinoNav />

      {/* Hero */}
      <div className="bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">
            Sviluppo Bambino
          </p>
          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-none tracking-tight">
            Natura e <span className="text-indigo-300">finalità</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-200 max-w-2xl leading-relaxed">
            Non un'altra teoria dello sviluppo. Un'architettura concettuale capace di rendere pensabile lo sviluppo nella sua complessità — e di fondare su questa comprensione un dialogo genuino tra discipline.
          </p>
        </div>
      </div>

      {/* Apertura narrativa — full text */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 font-medium">
            Da dove nasce un progetto come questo?
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 max-w-3xl">
            Da una constatazione che chiunque lavori con i bambini — pediatri, educatori, psicologi, assistenti sociali — tende a riconoscere non appena viene formulata: <strong>sappiamo molte cose sullo sviluppo del bambino, ma facciamo fatica a usarle insieme</strong>. Le neuroscienze descrivono i meccanismi biologici; la teoria dell'attaccamento descrive la relazione precoce; la pedagogia orienta la pratica educativa; la clinica interviene quando qualcosa non va. Ciascuna disciplina ha un proprio linguaggio, una propria logica, un proprio modo di vedere il bambino — e spesso non riesce a parlare con le altre senza semplificare o perdere qualcosa di essenziale.
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            Il progetto Sviluppo Bambino nasce per costruire il livello che manca: <strong>non un'altra teoria dello sviluppo, non un nuovo protocollo clinico, ma un'architettura concettuale</strong> capace di rendere pensabile lo sviluppo in tutta la sua complessità — e di fondare su questa comprensione un dialogo genuino tra discipline e una progettazione coerente di strumenti operativi. In questa prospettiva, il progetto è un <strong>dispositivo di costruzione di intelligibilità e di strumenti</strong>: si colloca a un livello metodologico che precede e orienta la costruzione di strumenti e programmi di ricerca empirica, senza porsi in alternativa ad essi.
          </p>
        </div>
      </div>

      {/* Intro obiettivi — full text, tinted */}
      <div className="bg-slate-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-5">
            Cinque obiettivi, un'architettura coerente
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            Il progetto non persegue obiettivi paralleli e separati. I cinque obiettivi che seguono formano un'architettura in cui ciascuno presuppone i precedenti e apre la strada ai successivi: la grammatica concettuale rende possibile il dialogo interdisciplinare, che a sua volta fonda la progettazione degli strumenti, che richiede un sistema di supporto cognitivo, che deve essere guidato da un riferimento stabile nel tempo.
          </p>
        </div>
      </div>

      {/* Cinque obiettivi */}
      {OBIETTIVI.map((ob, idx) => (
        <div key={ob.n}>
          {/* Header colorato — stile landing */}
          <div className={`${ob.headerBg} text-white`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
              <div className="flex items-start gap-5">
                <span className={`flex-shrink-0 ${ob.badgeBg} text-white text-xs font-bold px-3 py-1 rounded-md mt-1.5`}>
                  Obiettivo {ob.n}
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 leading-snug">{ob.title}</h2>
                  <p className={`text-base italic ${ob.taglineColor}`}>{ob.tagline}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Corpo — testo articolo */}
          <div className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className={`border-l-4 ${ob.borderAccent} pl-8 sm:pl-12 py-12 sm:py-14`}>
                {ob.body.map((para, i) => (
                  <p key={i} className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mb-5 last:mb-0">
                    {para}
                  </p>
                ))}
                {ob.link && (
                  <div className="mt-7">
                    <Link
                      to={ob.link.to}
                      className="text-sm font-medium text-gray-700 hover:text-indigo-700 transition-colors"
                    >
                      {ob.link.label}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Il progetto nel sistema HCAIRE */}
      <div className="bg-slate-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Il progetto nel sistema HCAIRE
          </h2>
          <p className="text-base text-gray-500 mb-10 max-w-2xl leading-relaxed">
            Le finalità descritte si realizzano attraverso un'architettura articolata in sezioni, ciascuna con una propria funzione.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {SEZIONI_HCAIRE.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="group flex flex-col p-5 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors text-sm">
                    {s.label}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                    Ob. {s.obiettivi}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed flex-1">{s.desc}</p>
                <span className="mt-4 text-xs text-indigo-600 group-hover:text-indigo-800 transition-colors">
                  Esplora →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
