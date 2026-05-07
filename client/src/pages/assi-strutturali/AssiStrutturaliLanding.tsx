import { Link } from 'react-router-dom';
import AssiStrutturaliNav from '../../components/AssiStrutturaliNav';

interface Asse {
  number: number;
  slug: string;
  title: string;
  subtitle: string;
  body: string[];
  chapters: string;
  headerBg: string;
  borderAccent: string;
  badgeBg: string;
  subtitleColor: string;
}

const ASSI: Asse[] = [
  {
    number: 1,
    slug: 'asse-1-ontologico-fenomenologico',
    title: 'Ontologico–fenomenologico',
    subtitle: 'Il soggetto prima di ogni funzione',
    body: [
      'Il primo asse pone la domanda più radicale: che tipo di soggetto è l\'essere umano in sviluppo? Non ancora che cosa sa fare, né che cosa deve diventare — ma che cosa è, strutturalmente, prima di ogni descrizione psicologica o educativa.',
      'La risposta non è astratta. Seguendo la tradizione fenomenologica — da Husserl a Merleau-Ponty, da Heidegger a Gadamer — l\'asse mostra che il soggetto in sviluppo è in costituzione permanente: non un insieme di capacità da sviluppare, non un individuo da modellare secondo uno standard, ma un\'esperienza vissuta che si organizza attraverso la corporeità, la temporalità, la relazione e l\'intenzionalità.',
      'Questo asse ha una funzione fondativa per l\'intero modello: ogni errore di concezione qui si propaga in tutte le fasi educative e cliniche successive.',
    ],
    chapters: '8 capitoli — dalla corporeità al campo intenzionale, dalla temporalità vissuta alla regolazione come principio ontologico.',
    headerBg: 'bg-indigo-950',
    borderAccent: 'border-l-indigo-400',
    badgeBg: 'bg-indigo-800',
    subtitleColor: 'text-indigo-300',
  },
  {
    number: 2,
    slug: 'asse-2-affettivo-morale',
    title: 'Affettivo–morale',
    subtitle: 'Come l\'altro diventa interiormente vincolante',
    body: [
      'Il secondo asse affronta una domanda che la psicologia dello sviluppo incontra spesso senza risolverla veramente: come fa l\'altro — un genitore, un educatore, un pari — a diventare qualcosa che conta interiormente per il soggetto in sviluppo, anche quando non è presente fisicamente?',
      'Non si tratta di spiegare l\'attaccamento, né la socializzazione, né l\'acquisizione di regole morali. Si tratta di comprendere la struttura più originaria: il momento in cui l\'altro cessa di essere semplicemente un oggetto dell\'esperienza e diventa una presenza interna che vincola, orienta, pesa.',
      'Su questa struttura si edifica tutto ciò che viene dopo: la capacità di sentire colpa, di riparare, di portare responsabilità. L\'asse mostra come queste dimensioni non siano aggiunte esterne allo sviluppo, ma la sua condizione affettiva fondamentale.',
    ],
    chapters: '8 capitoli — dalla genesi dell\'istanza morale alla colpa come struttura affettiva, dalla riparazione al raccordo con l\'asse normativo.',
    headerBg: 'bg-teal-900',
    borderAccent: 'border-l-teal-400',
    badgeBg: 'bg-teal-700',
    subtitleColor: 'text-teal-300',
  },
  {
    number: 3,
    slug: 'asse-3-normativo-educativo',
    title: 'Normativo–educativo',
    subtitle: 'Orientare senza imporre, giudicare senza arbitrio',
    body: [
      'Il terzo asse entra nel cuore della pratica educativa: come si trasmette un orientamento normativo senza ridurlo né a comando indiscutibile né a opinione soggettiva?',
      'Prima di rispondere, l\'asse compie un lavoro concettuale necessario: distingue norma, normatività e giudizio — tre termini che l\'uso educativo corrente tende a confondere, producendo derive opposte: il moralismo che impone senza motivare, e il relativismo che rinuncia a orientare.',
      'Il risultato è una teoria dell\'autorità educativa fondata non sul potere né sull\'accordo, ma sulla verità educativa: la capacità dell\'adulto di indicare ciò che vale, in modo che il soggetto in sviluppo possa appropriarsene liberamente, non subire una conformità.',
    ],
    chapters: '6 capitoli — dalla distinzione concettuale all\'autorità come responsabilità, dai fallimenti della normatività al limite del giudizio.',
    headerBg: 'bg-violet-950',
    borderAccent: 'border-l-violet-400',
    badgeBg: 'bg-violet-800',
    subtitleColor: 'text-violet-300',
  },
  {
    number: 4,
    slug: 'asse-4-separazione-limite',
    title: 'Separazione e Limite',
    subtitle: 'L\'incontro con ciò che resiste',
    body: [
      'Il quarto asse introduce una discontinuità intenzionale nel modello. Fino a qui, il percorso ha riguardato la costituzione del soggetto, il suo legame con l\'altro, il suo orientamento normativo. Ora entra in scena qualcosa di diverso: ciò che non dipende né dalla regolazione, né dalla relazione, né dalla norma.',
      'Il limite reale — la perdita, la separazione, l\'eccedenza dell\'esperienza rispetto a ciò che si può controllare o riparare — non è un fallimento dello sviluppo. È una struttura dell\'esperienza che, se attraversata, diventa fonte di crescita; se evitata o negata, produce fragilità strutturale.',
      'L\'asse elabora il significato educativo di questa dimensione: non come preparazione al dolore, ma come condizione perché il soggetto possa abitare la realtà senza che ogni ostacolo risulti insopportabile.',
    ],
    chapters: '8 capitoli — dallo statuto del limite reale all\'eccedenza, dalla perdita alla separazione, fino al raccordo con l\'asse del desiderio.',
    headerBg: 'bg-amber-900',
    borderAccent: 'border-l-amber-400',
    badgeBg: 'bg-amber-700',
    subtitleColor: 'text-amber-300',
  },
  {
    number: 5,
    slug: 'asse-5-desiderio',
    title: 'Desiderio',
    subtitle: 'L\'orientamento che sopravvive al limite',
    body: [
      'Dopo aver attraversato il limite reale, il modello incontra una domanda che nessuno dei quattro assi precedenti basta a rispondere: che cosa orienta il soggetto quando non tutto è possibile, quando non tutto è riparabile, quando l\'onnipotenza è stata interrotta?',
      'La risposta è il desiderio — non nel senso del bisogno o dell\'impulso, ma nel senso filosofico più preciso: la struttura soggettiva che consente di restare orientati verso ciò che vale, anche nell\'impossibilità e nella perdita. Senza questa struttura, la norma si riduce a regolazione, il giudizio perde direzione, la responsabilità si svuota di senso.',
      'L\'asse percorre la tradizione filosofica del desiderio — da Platone a Spinoza, da Hegel a Lacan — non per erudizione, ma per mostrare come questa categoria sia irriducibile a qualsiasi descrizione psicologica funzionale.',
    ],
    chapters: '7 capitoli — dallo statuto filosofico alla genealogia del desiderio, dalla fenomenologia del desiderio incarnato alle sue patologie strutturali.',
    headerBg: 'bg-rose-950',
    borderAccent: 'border-l-rose-400',
    badgeBg: 'bg-rose-800',
    subtitleColor: 'text-rose-300',
  },
  {
    number: 6,
    slug: 'asse-6-storico-culturale',
    title: 'Storico–culturale',
    subtitle: 'Il mondo come mediazione strutturale',
    body: [
      'Il sesto asse conclude l\'architettura mostrando come tutto ciò che la precede non esiste in astratto, ma sempre all\'interno di un mondo storico e culturale concreto che non è uno sfondo, ma una mediazione strutturale.',
      'Il soggetto che nasce e cresce non incontra "l\'altro in generale": incontra un padre o una madre in una cultura specifica, con un linguaggio che porta certe distinzioni e ne oscura altre, dentro istituzioni che organizzano il tempo, lo spazio, il valore. Questo mondo non influenza lo sviluppo dall\'esterno: lo costituisce dall\'interno.',
      'L\'asse affronta le implicazioni più urgenti per il presente: come la tecnica digitale, la cultura della performance e le nuove forme di temporalità contemporanea alterano le condizioni stesse in cui i cinque assi precedenti possono dispiegarsi — e come questo richieda risposte educative e istituzionali radicalmente diverse da quelle del passato.',
    ],
    chapters: '7 capitoli — dalla mediazione simbolica alle istituzioni come dispositivi di esperienza, dalla tecnica contemporanea ai rischi strutturali dello sviluppo nel presente.',
    headerBg: 'bg-cyan-950',
    borderAccent: 'border-l-cyan-400',
    badgeBg: 'bg-cyan-800',
    subtitleColor: 'text-cyan-300',
  },
];

export default function AssiStrutturaliLanding() {
  return (
    <div>
      <AssiStrutturaliNav />

      {/* Hero */}
      <div className="bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-none tracking-tight">
            Gli <span className="text-indigo-300">assi strutturali</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-200 max-w-2xl leading-relaxed mb-10">
            Le sei dimensioni costitutive dell'esperienza umana in sviluppo: non tappe evolutive, ma strutture dell'esperienza che ne rendono possibile la forma.
          </p>
          <Link
            to="/assi-strutturali/capitoli"
            className="inline-block text-sm font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-md transition-colors"
          >
            Vai all'indice dei capitoli →
          </Link>
        </div>
      </div>

      {/* Intro — full text block */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6">
            Ogni essere umano cresce. Ma in che senso, esattamente, "cresce"?
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 max-w-3xl">
            Non basta rispondere con le tappe dello sviluppo psicomotorio, né con i traguardi cognitivi, né con l'acquisizione progressiva di competenze sociali. Tutte queste risposte, per quanto utili, presuppongono qualcosa che non spiegano: che tipo di soggetto si sviluppa, e in virtù di quali strutture fondamentali la sua esperienza prende forma.
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            Il laboratorio HCAIRE ha elaborato una risposta sistematica a questa domanda. Il cuore di questa risposta è un'architettura concettuale articolata in <strong>sei assi strutturali di sviluppo</strong>: dimensioni costitutive dell'esperienza umana che non si sostituiscono alle teorie psicologiche esistenti, ma le precedono e le fondano. Lo sviluppo del bambino è il dominio in cui questi assi sono stati per primi messi a punto, e resta il caso d'uso più articolato; ma la loro portata riguarda l'intero sviluppo umano.
          </p>
        </div>
      </div>

      {/* Architecture note — full text, slightly tinted */}
      <div className="bg-slate-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            L'architettura degli assi: logica e funzione
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-5 max-w-3xl">
            Gli assi strutturali non sono sei argomenti indipendenti. Formano una sequenza coerente in cui ogni asse <strong>presuppone il precedente e apre la strada al successivo</strong>.
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-5 max-w-3xl">
            Il percorso parte dalla domanda più fondamentale — che cosa è il soggetto prima di ogni qualificazione — e procede attraverso la genesi affettiva del legame con l'altro, la possibilità del giudizio normativo, l'incontro con i limiti reali dell'esperienza, la struttura del desiderio come orientamento al possibile, fino alla mediazione storico-culturale che dà forma concreta a tutto ciò che precede.
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            Non si tratta di una sequenza cronologica, né di stadi evolutivi. È un'architettura: ogni livello è logicamente necessario agli altri. Per ciascun asse il progetto ha prodotto <strong>un corpo di capitoli tematici</strong>: in tutto <strong>44 capitoli</strong>, per un totale di oltre 300.000 caratteri di elaborazione teorica.
          </p>
        </div>
      </div>

      {/* The 6 assi */}
      {ASSI.map((asse, idx) => (
        <div key={asse.slug} id={`asse-${asse.number}`}>
          {/* Asse header — landing-page style with color */}
          <div className={`${asse.headerBg} text-white`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
              <div className="flex items-start gap-5">
                <span className={`flex-shrink-0 ${asse.badgeBg} text-white text-sm font-bold px-3 py-1 rounded-md mt-1`}>
                  Asse {asse.number}
                </span>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">{asse.title}</h2>
                  <p className={`text-lg sm:text-xl italic ${asse.subtitleColor}`}>{asse.subtitle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Asse body — full text */}
          <div className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className={`border-l-4 ${asse.borderAccent} pl-8 sm:pl-12 py-12 sm:py-16`}>
                {asse.body.map((para, i) => (
                  <p key={i} className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mb-5 last:mb-0">
                    {para}
                  </p>
                ))}
                <p className="mt-8 text-sm text-gray-400 italic">{asse.chapters}</p>
                <div className="mt-6 flex gap-4">
                  <Link
                    to={`/assi-strutturali/${asse.slug}`}
                    className="text-sm font-medium text-gray-700 hover:text-indigo-700 transition-colors"
                  >
                    Indice capitoli →
                  </Link>
                  <Link
                    to={`/sviluppo-bambino/modello/${asse.slug}`}
                    className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    Sintesi asse ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Closing — full text */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Perché questi capitoli</h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-5 max-w-3xl">
            Il lavoro di elaborazione degli assi strutturali non è una raccolta di saggi teorici. È il tentativo di costruire un <strong>linguaggio condiviso</strong> tra discipline — filosofia, psicologia, pedagogia, clinica.
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-5 max-w-3xl">
            Ciascun capitolo nasce da una domanda precisa, risponde con rigore concettuale, e si chiude aprendo verso il successivo. Il risultato è una mappa dell'esperienza umana in sviluppo che può orientare educatori, clinici, ricercatori e progettisti di servizi, come strumento per vedere con più chiarezza.
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            I capitoli sono accompagnati da riferimenti alle figure dei pensatori che hanno contribuito a elaborare ciascuna dimensione — da Merleau-Ponty a Winnicott, da Vygotskij a Gadamer, da Arendt a Freud — con i loro testi fondamentali, perché la teoria non sia ornamento ma radice visibile del pensiero.
          </p>
          <div className="mt-10">
            <Link
              to="/assi-strutturali/capitoli"
              className="inline-block text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              Leggi i capitoli →
            </Link>
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
