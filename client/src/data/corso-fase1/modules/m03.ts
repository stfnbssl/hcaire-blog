import type {
  ChipAccordionItem,
  ExpandableCardData,
  Module,
} from '../types';
import { CASO_GUIDA_F1 } from '../caso-guida';
import { SEI_ASSI_BY_ID } from '../sei-assi';

// =============================================================
// Modulo 3 — Asse 1: Abitare l'esperienza
// =============================================================

const A1 = SEI_ASSI_BY_ID.a1;

// ─── Verbi alternativi ad «abitare» ──────────────────────────

interface ContrarioAbitare {
  id: string;
  parola: string;
  perche: string;
}

const CONTRARI_ABITARE: ContrarioAbitare[] = [
  {
    id: 'percepire',
    parola: 'percepire',
    perche:
      "«Percepire» descrive il bambino come ricevitore di stimoli dall'esterno. Il bambino percepisce il libro. Ma «abitare» significa qualcosa di più: il bambino esiste nell'esperienza del libro come in un luogo che lo contiene e che lui stesso contribuisce a costruire. Non è un meccanismo di input — è un soggetto in un campo.",
  },
  {
    id: 'reagire',
    parola: 'reagire',
    perche:
      "«Reagire» descrive il bambino come sistema di risposta a stimoli: la voce del genitore produce una risposta nel bambino. Ma «abitare» significa che il bambino non risponde dall'esterno — è dentro l'esperienza, ne è parte costitutiva. La reazione presuppone una separazione fra bambino e campo che «abitare» dissolve.",
  },
  {
    id: 'processare',
    parola: 'processare',
    perche:
      "«Processare» è il termine delle neuroscienze computazionali: il cervello del bambino processa l'informazione sensoriale. Ma «abitare» significa che l'esperienza non è un dato da elaborare — è un campo in cui si esiste. Il processamento avviene dentro un soggetto incarnato, non è il soggetto stesso.",
  },
  {
    id: 'subire',
    parola: 'subire',
    perche:
      "«Subire» descrive il bambino come passivo di fronte all'esperienza: la visita pediatrica è qualcosa che gli capita. Ma «abitare» implica una forma di presenza attiva — anche fragile, anche disorganizzata — che è diversa dalla pura passività. Un bambino che piange e cerca il genitore non sta subendo: sta abitando quella difficoltà, anche se faticosamente.",
  },
];

const CONTRARI_ITEMS: ChipAccordionItem[] = CONTRARI_ABITARE.map((c) => ({
  id: c.id,
  label: `≠ ${c.parola}`,
  bodyHtml: `
    <p style="margin: 0 0 8px;"><strong style="color: var(--corso-text-muted); text-transform: uppercase; font-size: 0.78rem; letter-spacing: 0.06em;">Perché non basta</strong></p>
    <p style="margin: 0;">${c.perche}</p>
  `,
}));

// ─── Cosa diventano gli altri assi senza A1 ──────────────────

interface SenzaAsse1 {
  asseId: string;
  cosaDiventa: string;
}

const SENZA_A1: SenzaAsse1[] = [
  {
    asseId: 'a2',
    cosaDiventa:
      "Il riconoscimento dell'altro tende a essere letto come «risposta empatica» o «coordinazione comportamentale» — non come riconoscimento fra soggetti.",
  },
  {
    asseId: 'a3',
    cosaDiventa:
      "La normatività emergente tende a essere letta come «compliance a regole esterne» o «condizionamento» — non come orientamento interno condiviso.",
  },
  {
    asseId: 'a4',
    cosaDiventa:
      "L'incontro con il limite tende a essere letto come «regolazione emotiva» o «tolleranza alla frustrazione» — non come discontinuità strutturale dell'esperienza.",
  },
  {
    asseId: 'a5',
    cosaDiventa:
      "Il desiderio tende a essere letto come «preferenza» o «motivazione estrinseca» — non come direzione dell'esperienza di un soggetto.",
  },
  {
    asseId: 'a6',
    cosaDiventa:
      "La partecipazione culturale tende a essere letta come «apprendimento di competenze culturali» o «esposizione a stimoli» — non come co-costruzione di mondo condiviso.",
  },
];

// ─── Tre dimensioni di Asse 1 ─────────────────────────────────

interface DimensioneA1 {
  id: 'corpo' | 'relazione' | 'mondo';
  nome: string;
  icona: string;
  titolo: string;
  testo: string;
  implicazione: string;
  domandaProfessionale: string;
  esempioCaso: string;
}

const TRE_DIMENSIONI_A1: DimensioneA1[] = [
  {
    id: 'corpo',
    nome: 'Corpo',
    icona: '⬡',
    titolo: 'Il corpo come modo di essere nel mondo',
    testo:
      "Il bambino non usa il corpo per fare esperienza — è il corpo che fa esperienza. Il corpo non è lo strumento di un soggetto che sta altrove: è la condizione stessa dell'esistenza del soggetto. La postura, il ritmo, il tono muscolare, il gesto non sono espressioni esterne di stati interni — sono il modo in cui il bambino è presente in quel campo, in quel momento.",
    implicazione:
      "Osservare il bambino «attraverso» il corpo — cercandovi segnali di stati cognitivi o emotivi interni — è già una scelta di registro. Asse 1 propone di osservare il corpo come il luogo in cui l'esperienza si organizza, non come il mezzo attraverso cui si esprime.",
    domandaProfessionale:
      "Come si organizza il corpo del bambino in questo campo? La postura apre o chiude verso l'adulto? Il ritmo corporeo è regolato o frammentato?",
    esempioCaso:
      "Nella scena di lettura: la postura del bambino orientata verso il libro e verso l'adulto non è un comportamento volontario — è il modo in cui il bambino è incarnato in quel campo di scambio. Il corpo organizza l'intenzione prima che ci sia un'intenzione esplicita.",
  },
  {
    id: 'relazione',
    nome: 'Relazione',
    icona: '⟺',
    titolo: "La relazione come struttura dell'esperienza",
    testo:
      "La relazione non è qualcosa che il bambino «ha» con l'adulto: è la struttura stessa dell'esperienza del bambino. Il campo relazionale non è lo sfondo su cui il bambino si muove — è la condizione che rende possibile l'esperienza stessa. Senza un campo relazionale strutturato, l'esperienza non si organizza — si frammenta.",
    implicazione:
      "L'osservazione rilevante non è mai «il bambino isolato»: è sempre il bambino in un campo. La qualità del campo relazionale non è una variabile di contesto da controllare — è parte costitutiva dell'oggetto di osservazione.",
    domandaProfessionale:
      "Come è fatto il campo relazionale che circonda questo bambino in questo momento? Sostiene, amplifica o frammenta l'esperienza?",
    esempioCaso:
      "Nella scena: il genitore che «aspetta» non è solo un comportamento dell'adulto — è la forma in cui il campo relazionale si rende disponibile a ricevere l'iniziativa del bambino. Senza questa disponibilità, il gesto del bambino cambia struttura.",
  },
  {
    id: 'mondo',
    nome: 'Mondo',
    icona: '◎',
    titolo: 'Il mondo come orizzonte di significato',
    testo:
      "Il bambino non percepisce un ambiente neutro di stimoli: abita un mondo già carico di significato. Il libro illustrato non è uno stimolo visivo — è un oggetto che porta con sé pratiche, convenzioni, storie. Il gesto del genitore non è un input comportamentale — è un atto che ha senso in un orizzonte culturale condiviso. L'esperienza è sempre esperienza-in-un-mondo.",
    implicazione:
      "Il «mondo» non è l'insieme degli oggetti fisici presenti in una stanza. È l'orizzonte di significato in cui l'esperienza ha senso. Diversi campi relazionali producono mondi diversi per lo stesso bambino — e mondi diversi rendono accessibili esperienze diverse.",
    domandaProfessionale:
      'Che tipo di mondo questo campo relazionale rende accessibile al bambino? È un mondo esplorabile, prevedibile, condivisibile?',
    esempioCaso:
      "Il libro nella scena non è neutro: è già un oggetto che appartiene a un mondo condiviso di pratiche di lettura, di nominazione, di scambio simbolico. Il bambino non «scopre» il libro — entra in un mondo in cui il libro ha già un senso.",
  },
];

// ─── Continuità / discontinuità ──────────────────────────────

interface FormaContinuita {
  id: string;
  tipo: string;
  colore: string;
  sfondo: string;
  descrizione: string;
  osservabile: string;
  domanda: string;
}

const FORME_CONTINUITA: FormaContinuita[] = [
  {
    id: 'sostenuta',
    tipo: 'Continuità sostenuta',
    colore: '#27ae60',
    sfondo: '#eafaf1',
    descrizione:
      "L'esperienza si mantiene attraverso le pause, le interruzioni, i cambiamenti. Il bambino può «tornare» a ciò che stava facendo dopo un'interruzione. La traiettoria dell'esperienza è riconoscibile nel tempo — non è una serie di episodi slegati.",
    osservabile:
      "Il bambino riprende il gioco dopo che l'adulto lo ha interrotto. Gira pagina e continua la sequenza della lettura. Dopo il pianto, torna alla situazione con qualcosa della situazione precedente ancora vivo.",
    domanda: "L'esperienza ha un filo che si mantiene? Il bambino «riprende» o «ricomincia»?",
  },
  {
    id: 'fragile',
    tipo: 'Continuità fragile',
    colore: '#f39c12',
    sfondo: '#fef9e7',
    descrizione:
      "L'esperienza si mantiene con fatica: le interruzioni producono una rottura parziale, il ritorno è possibile ma richiede sostegno adulto. La traiettoria esiste ma dipende fortemente dalla disponibilità del campo a supportarla.",
    osservabile:
      "Il bambino torna alla situazione solo se l'adulto lo aiuta a ritrovarla. La sequenza si interrompe frequentemente e riprende con qualcosa di perso. Il campo deve «ricordare» per il bambino ciò che stava facendo.",
    domanda: "L'esperienza riprende con sostegno adulto? Il campo compensa la fragilità della continuità?",
  },
  {
    id: 'interrotta',
    tipo: 'Continuità interrotta',
    colore: '#e74c3c',
    sfondo: '#fdecea',
    descrizione:
      "Le interruzioni producono una rottura: il bambino non riprende il filo, ogni episodio è separato dai precedenti. L'esperienza non ha una traiettoria riconoscibile — è una serie di momenti slegati. Il campo non riesce a sostenere la continuità.",
    osservabile:
      "Ogni interruzione azzera: il bambino non torna a ciò che stava facendo. La sequenza di scambio si dissolve a ogni pausa. Il campo non produce abbastanza struttura per sostenere la continuità dell'esperienza.",
    domanda: "L'esperienza si azzera a ogni interruzione? Il campo è abbastanza strutturato da sostenere la continuità?",
  },
];

// ─── Cinque contesti professionali ───────────────────────────

interface ContestoA1 {
  id: string;
  contesto: string;
  icona: string;
  colore: string;
  domandeOperative: string[];
  cosaSiVede: string;
  guardrailNo: string;
  guardrailSi: string;
}

const CINQUE_CONTESTI: ContestoA1[] = [
  {
    id: 'ctx1',
    contesto: 'Ambulatorio pediatrico',
    icona: '🩺',
    colore: '#1a6b8a',
    domandeOperative: [
      "Come si organizza l'esperienza del bambino durante la visita? Il campo regge l'intensità della situazione?",
      "Il bambino può «tornare» a una forma di disponibilità dopo la fase più invasiva della visita?",
      "Il genitore contribuisce a mantenere la continuità dell'esperienza o aumenta la disorganizzazione?",
      "Cosa segnala il corpo del bambino sulla qualità dell'esperienza in quel momento?",
    ],
    cosaSiVede:
      "Il bambino che si irrigidisce durante lo spogliarsi e poi ritrova disponibilità quando il genitore parla piano: è Asse 1 in azione: il campo regge la discontinuità e permette la ripresa. Il bambino che rimane in stato di allerta per tutta la visita — anche dopo la parte invasiva — mostra un campo che non sostiene la ripresa.",
    guardrailNo: '«il bambino è poco collaborativo» o «è ansioso»',
    guardrailSi: "«il campo della visita non sostiene la ripresa dell'esperienza dopo la fase invasiva»",
  },
  {
    id: 'ctx2',
    contesto: 'Nido / scuola dell\'infanzia',
    icona: '🏫',
    colore: '#2d6a4f',
    domandeOperative: [
      "Il bambino abita lo spazio del nido o lo subisce? C'è una presenza incarnata nel campo?",
      "L'esperienza del bambino ha continuità durante la giornata o si frammenta nei passaggi?",
      "I momenti di transizione (ingresso, pasto, sonno) interrompono o strutturano l'esperienza?",
      "L'educatrice è parte del campo che sostiene l'esperienza o è esterna a essa?",
    ],
    cosaSiVede:
      "Il bambino che all'ingresso riesce a «prendere il campo» — orientarsi nello spazio, riconoscere gli oggetti, ritrovare la propria posizione — mostra un Asse 1 sostenuto dall'ambiente. Il bambino che non riesce a «entrare» nel campo del nido dopo settimane mostra che il campo non ha ancora la struttura per rendersi abitabile.",
    guardrailNo: '«il bambino ha difficoltà di inserimento» o «non si adatta»',
    guardrailSi: '«il campo del nido non è ancora sufficientemente strutturato da permettere al bambino di abitarlo»',
  },
  {
    id: 'ctx3',
    contesto: 'Counseling genitoriale',
    icona: '👥',
    colore: '#8e44ad',
    domandeOperative: [
      'Il genitore percepisce il bambino come soggetto della propria esperienza — o come portatore di comportamenti da gestire?',
      "Il genitore è consapevole di essere parte del campo che struttura (o frammenta) l'esperienza del bambino?",
      "La narrativa del genitore include il campo relazionale, o isola il bambino come unità di analisi?",
      "Cosa cambia nell'esperienza del bambino quando cambia il modo in cui il genitore è presente?",
    ],
    cosaSiVede:
      "Un genitore che descrive il figlio in termini di «fa questo / non fa quello» sta leggendo comportamenti, non esperienza. Un genitore che dice «quando mi avvicino così lui si calma» sta già leggendo il campo — è lì che si lavora. La domanda operativa per il counseling: come accompagnare il genitore a diventare lettore del campo, oltre che gestore di comportamenti.",
    guardrailNo: '«il genitore non capisce il bambino»',
    guardrailSi: "«il genitore non ha ancora gli strumenti per leggere il campo relazionale come condizione dell'esperienza del bambino»",
  },
  {
    id: 'ctx4',
    contesto: 'Supervisione d\'équipe',
    icona: '👁',
    colore: '#d35400',
    domandeOperative: [
      "Quando l'équipe discute un bambino, sta descrivendo l'esperienza del bambino o i suoi comportamenti?",
      "Il linguaggio dell'équipe include il campo relazionale come parte dell'oggetto di discussione?",
      "I professionisti si riconoscono come parte del campo che struttura l'esperienza del bambino?",
      'Come cambia la lettura del caso se si sposta l\'attenzione dal bambino al campo?',
    ],
    cosaSiVede:
      "Una supervisione che usa Asse 1 non discute «il bambino X»: discute «il campo in cui X esiste in quel servizio». La differenza nel linguaggio è la differenza fra «X ha difficoltà di regolazione» e «il campo del servizio non produce le condizioni per cui X possa organizzare la propria esperienza». La seconda apre possibilità di intervento; la prima le chiude.",
    guardrailNo: '«questo bambino è difficile da gestire»',
    guardrailSi: "«il campo del servizio non ha ancora trovato la forma per sostenere l'esperienza di questo bambino»",
  },
  {
    id: 'ctx5',
    contesto: 'Ricerca sullo sviluppo',
    icona: '🔬',
    colore: '#4a5568',
    domandeOperative: [
      'Il disegno di ricerca include il campo relazionale come variabile strutturale o solo come controllo?',
      'I costrutti misurati descrivono funzioni del bambino isolato o configurazioni del campo?',
      "Le procedure di osservazione permettono di leggere la qualità dell'esperienza o solo la frequenza dei comportamenti?",
      'I risultati vengono attribuiti al bambino o alla configurazione campo-bambino-contesto?',
    ],
    cosaSiVede:
      "La ricerca che usa Asse 1 come frame teorico produce disegni diversi: invece di misurare «la competenza di X in Y bambini», misura «la configurazione del campo in cui X emerge o non emerge». Il soggetto della ricerca non è il bambino — è la configurazione relazionale. Questo cambia il tipo di dati raccolti, le procedure di analisi e il tipo di conclusioni possibili.",
    guardrailNo: '«i bambini del gruppo X mostrano maggiore Y»',
    guardrailSi: "«nei campi relazionali con le caratteristiche Z, l'esperienza Y risulta più accessibile»",
  },
];

const CONTESTI_CARDS: ExpandableCardData[] = CINQUE_CONTESTI.map((c) => ({
  id: c.id,
  badge: c.icona,
  color: c.colore,
  title: c.contesto,
  summary: c.domandeOperative[0],
  detail: `
    <div class="corso-section" style="margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Domande operative</p>
      <ul style="margin: 0; padding-left: 20px;">
        ${c.domandeOperative.map((d) => `<li style="margin-bottom: 4px;">${d}</li>`).join('')}
      </ul>
    </div>
    <div class="corso-section" style="background: var(--corso-primary-light); padding: 12px 16px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Come si legge in questo contesto</p>
      <p style="margin: 0;">${c.cosaSiVede}</p>
    </div>
    <div class="corso-two-col">
      <div class="corso-box corso-box--invalid">
        <div class="corso-box__title">Da evitare</div>
        <p style="font-style: italic;">${c.guardrailNo}</p>
      </div>
      <div class="corso-box corso-box--valid">
        <div class="corso-box__title">Riformulazione</div>
        <p style="font-style: italic;">${c.guardrailSi}</p>
      </div>
    </div>
  `,
}));

// ─── Concetti-ponte nelle discipline ─────────────────────────

interface ConcettoPonte {
  termine: string;
  connessione: string;
  rischio: string;
}

interface DisciplinaPonte {
  id: string;
  nome: string;
  colore: string;
  concetti: ConcettoPonte[];
}

const DISCIPLINE_PONTE: DisciplinaPonte[] = [
  {
    id: 'd1',
    nome: 'Psicologia dello sviluppo',
    colore: '#6c63ff',
    concetti: [
      {
        termine: 'Senso di sé nucleare (Stern)',
        connessione:
          "Il «senso di sé nucleare» di Stern — l'esperienza preriflessiva di essere un agente con un corpo, un affetto e una continuità nel tempo — è la formulazione psicologica più vicina ad Asse 1. Non è identico all'asse (che è più ampio e strutturale), ma la direzione è la stessa.",
        rischio:
          "Stringere Asse 1 al «senso di sé» come costrutto psicologico individuale, lasciando in ombra la dimensione relazionale e corporea costitutiva.",
      },
      {
        termine: 'Soggettività emergente',
        connessione:
          "La soggettività emergente non è una competenza che si acquisisce ma una struttura che si organizza progressivamente nel campo relazionale. Vicina ad Asse 1, ma il rischio è trattarla come tappa piuttosto che come dimensione sempre attiva.",
        rischio:
          'Fare della soggettività una tappa dello sviluppo («il bambino acquisisce la soggettività») invece che una struttura sempre in organizzazione.',
      },
    ],
  },
  {
    id: 'd2',
    nome: 'Pediatria',
    colore: '#1a6b8a',
    concetti: [
      {
        termine: 'Qualità della presenza',
        connessione:
          "Il pediatra che descrive «un bambino presente» o «un bambino che non c'è» sta usando un linguaggio che si avvicina ad Asse 1: la presenza non è un comportamento misurabile, è una qualità dell'abitare il campo. È un concetto clinico informale ma strutturalmente pertinente.",
        rischio:
          'Trattare la «qualità della presenza» come indicatore di un deficit neurologico specifico, invece che come lettura della configurazione del campo.',
      },
      {
        termine: 'Regolazione fisiologica nel contesto relazionale',
        connessione:
          "La ricerca sulla regolazione fisiologica in contesto relazionale (variabilità della frequenza cardiaca, cortisolo, sistemi di risposta allo stress) si avvicina ad Asse 1 quando include il campo relazionale come variabile strutturale — non solo come moderatore.",
        rischio:
          'Fermarsi ai parametri fisiologici senza includere il campo relazionale come condizione costitutiva.',
      },
    ],
  },
  {
    id: 'd3',
    nome: 'Neuropsichiatria infantile',
    colore: '#8e44ad',
    concetti: [
      {
        termine: 'Integrazione sensoriale (Ayres)',
        connessione:
          "Il framework dell'integrazione sensoriale descrive come il sistema nervoso organizza le informazioni sensoriali per produrre risposte adattive. Si avvicina ad Asse 1 nella misura in cui descrive l'organizzazione dell'esperienza — ma resta dentro un paradigma di processamento individuale, senza il campo relazionale.",
        rischio:
          "Sovrapporre Asse 1 e integrazione sensoriale: il primo descrive l'abitare l'esperienza in un campo relazionale; il secondo descrive il processamento sensoriale del sistema nervoso individuale.",
      },
      {
        termine: "Organizzazione dell'esperienza soggettiva",
        connessione:
          "In NPI clinica, la distinzione fra «bambino che organizza l'esperienza» e «bambino frammentato nell'esperienza» è un giudizio clinico fondamentale che precede qualsiasi diagnosi. Questo è esattamente il livello di Asse 1 — anche se raramente viene reso esplicito come tale.",
        rischio:
          "Saltare dalla frammentazione dell'esperienza a una diagnosi senza passare per la lettura del campo relazionale che produce o non produce quella frammentazione.",
      },
    ],
  },
  {
    id: 'd4',
    nome: 'Pedagogia / Educazione',
    colore: '#27ae60',
    concetti: [
      {
        termine: "Abitabilità dell'ambiente educativo",
        connessione:
          "La domanda pedagogica «questo ambiente è abitabile per questo bambino?» è una traduzione diretta di Asse 1 nel contesto educativo. L'abitabilità dell'ambiente non è una proprietà dello spazio fisico: è la qualità del campo relazionale che quell'ambiente produce.",
        rischio:
          "Trattare l'abitabilità come problema di arredamento o di stimolazione sensoriale, lasciando in ombra la dimensione relazionale costitutiva.",
      },
      {
        termine: 'Partecipazione vs. esecuzione',
        connessione:
          "La distinzione fra un bambino che «partecipa» e un bambino che «esegue» è una lettura implicita di Asse 1: partecipare significa abitare l'esperienza dell'attività dal proprio interno; eseguire significa produrre comportamenti richiesti dall'esterno senza abitarli.",
        rischio:
          "Misurare la partecipazione come comportamento osservabile (alza la mano, risponde alle domande) invece che come qualità dell'esperienza.",
      },
    ],
  },
  {
    id: 'd5',
    nome: 'Neuroscienze',
    colore: '#c0392b',
    concetti: [
      {
        termine: 'Embodied cognition',
        connessione:
          "Il paradigma dell'embodied cognition afferma che la cognizione non avviene «nel cervello» separato dal corpo, ma è strutturata dalla corporalità del soggetto e dalla sua interazione con l'ambiente. È la traduzione neuroscientifica più vicina alla dimensione «incarnato» di Asse 1.",
        rischio:
          "Sintetizzare l'embodied cognition come «il corpo influenza la cognizione» invece di «il corpo è la condizione dell'esperienza» — perdendo la radicalità della proposta.",
      },
      {
        termine: 'Predictive processing e interoception',
        connessione:
          "Il framework del predictive processing descrive come il cervello costruisce modelli predittivi del proprio stato corporeo e del mondo. L'interoception — la percezione degli stati corporei interni — è un correlato neuroscientifico di quello che Asse 1 descrive come «abitare incarnato». Ma il framework resta dentro un paradigma di processamento individuale.",
        rischio:
          'Identificare Asse 1 con un meccanismo neurale (interoception, predictive processing) invece che con la struttura dell\'esperienza soggettiva del bambino-in-campo.',
      },
    ],
  },
];

const DISCIPLINE_ITEMS: ChipAccordionItem[] = DISCIPLINE_PONTE.map((d) => ({
  id: d.id,
  label: d.nome,
  bodyHtml: `
    <div class="corso-two-col">
      ${d.concetti.map((c) => `
        <div class="corso-section" style="background: var(--corso-bg); border-left: 3px solid ${d.colore}; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
          <p style="font-weight: 700; color: ${d.colore}; margin: 0 0 8px; font-size: 0.95rem;">${c.termine}</p>
          <p style="margin: 0 0 12px; font-size: 0.9rem;">${c.connessione}</p>
          <div style="background: #fef5ec; border-left: 3px solid #d35400; padding: 8px 12px; border-radius: var(--corso-radius-sm);">
            <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: #d35400; margin: 0 0 4px; font-weight: 600;">Punto di attenzione</p>
            <p style="margin: 0; font-size: 0.88rem;">${c.rischio}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `,
}));

// ─── Quattro letture mono-registro tipiche ───────────────────

interface LetturaMonoRegistro {
  id: string;
  tipo: string;
  colore: string;
  descrizione: string;
  esempioMonoRegistro: string;
  letturaStrutturale: string;
  cosaRestaInOmbra: string;
}

const LETTURE_MONO_REGISTRO: LetturaMonoRegistro[] = [
  {
    id: 'e1',
    tipo: 'Lettura per deficit specifico',
    colore: '#e74c3c',
    descrizione:
      "Una difficoltà nell'organizzazione dell'esperienza viene letta principalmente come deficit di una funzione specifica — disturbo dell'attenzione, difficoltà di processamento sensoriale, ritardo cognitivo.",
    esempioMonoRegistro:
      '«Il bambino non riesce a stare fermo durante la visita: potrebbe esserci un disturbo dell\'attenzione.»',
    letturaStrutturale:
      "«Il campo della visita pediatrica non produce le condizioni per cui questo bambino possa organizzare la propria esperienza: il carico sensoriale e relazionale è troppo alto rispetto alle risorse di regolazione disponibili nel campo.»",
    cosaRestaInOmbra:
      "Il campo. La difficoltà viene attribuita al bambino come caratteristica stabile, mentre la lettura strutturale la legge come configurazione situata. La conseguenza pratica è che l'intervento si orienta verso il bambino invece che verso le condizioni che rendono l'esperienza difficile da abitare.",
  },
  {
    id: 'e2',
    tipo: 'Lettura comportamentale',
    colore: '#e67e22',
    descrizione:
      "L'esperienza del bambino viene tradotta direttamente in comportamenti osservabili e misurabili: frequenza, durata, intensità. La qualità dell'esperienza — la sua forma interna, la sua continuità, il suo orientamento — resta in ombra.",
    esempioMonoRegistro:
      '«Il bambino ha mostrato 3 episodi di pianto della durata media di 2 minuti durante la visita.»',
    letturaStrutturale:
      "«Il campo della visita ha prodotto tre momenti di disorganizzazione dell'esperienza; in due dei tre il bambino ha ripreso disponibilità dopo la risposta del genitore; nel terzo la disorganizzazione è rimasta per tutto il resto della visita.»",
    cosaRestaInOmbra:
      "La struttura dell'esperienza. I tre episodi diventano equivalenti (sono tutti «pianto») invece di essere diversi per qualità (il primo ha una ripresa, il terzo no). La continuità — che è esattamente ciò che Asse 1 chiede — diventa difficile da osservare.",
  },
  {
    id: 'e3',
    tipo: 'Lettura cognitiva',
    colore: '#8e44ad',
    descrizione:
      "L'abitare l'esperienza viene letto principalmente come funzione cognitiva: attenzione, memoria, funzioni esecutive. Il corpo, la relazione e il mondo — le tre dimensioni di Asse 1 — restano sullo sfondo del «funzionamento cognitivo».",
    esempioMonoRegistro:
      '«Il bambino mostra buona attenzione sostenuta e memoria di lavoro adeguata per l\'età.»',
    letturaStrutturale:
      "«Il bambino abita il campo del nido con continuità nelle situazioni di scambio diadico con l'adulto; la continuità si frammenta nei momenti di attività di gruppo non strutturata.»",
    cosaRestaInOmbra:
      "La situazionalità. Le «funzioni cognitive» appaiono come proprietà stabili del bambino, mentre la lettura strutturale rivela che la stessa «funzione» varia radicalmente a seconda del campo. Questa variabilità è spesso l'informazione più utile per il professionista.",
  },
  {
    id: 'e4',
    tipo: 'Lettura morale',
    colore: '#2c3e50',
    descrizione:
      "La difficoltà nell'abitare l'esperienza viene trasformata in una valutazione del bambino o del genitore: il bambino «non si impegna», «non vuole collaborare»; il genitore «non gestisce bene», «non mette limiti».",
    esempioMonoRegistro:
      '«Il bambino durante la visita non collabora e il genitore non riesce a contenerlo.»',
    letturaStrutturale:
      "«Il campo della visita produce una disorganizzazione dell'esperienza che il bambino non riesce ad abitare; il campo relazionale disponibile (genitore + pediatra) non trova nell'immediato la forma per sostenere la ripresa.»",
    cosaRestaInOmbra:
      "La dimensione strutturale. Le difficoltà diventano tratti di personalità o mancanze di volontà; la conseguenza pratica è che nessuna delle persone presenti — bambino, genitore, pediatra — si sente in grado di fare qualcosa di diverso. La lettura strutturale apre possibilità di modifica del campo.",
  },
];

const LETTURE_CARDS: ExpandableCardData[] = LETTURE_MONO_REGISTRO.map((l) => ({
  id: l.id,
  badge: l.id.toUpperCase(),
  color: l.colore,
  title: l.tipo,
  summary: l.descrizione,
  detail: `
    <div class="corso-section" style="background: #fdecea; border-left: 3px solid #e74c3c; padding: 12px 16px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #c0392b; margin: 0 0 6px;">Esempio mono-registro</p>
      <p style="margin: 0; font-style: italic;">${l.esempioMonoRegistro}</p>
    </div>
    <div class="corso-section" style="background: #eafaf1; border-left: 3px solid #27ae60; padding: 12px 16px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #1b8842; margin: 0 0 6px;">Lettura strutturale alternativa</p>
      <p style="margin: 0; font-style: italic;">${l.letturaStrutturale}</p>
    </div>
    <div class="corso-section" style="background: var(--corso-primary-light); border-left: 3px solid #1a6b8a; padding: 12px 16px; border-radius: var(--corso-radius-sm);">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #1a6b8a; margin: 0 0 6px;">Cosa resta in ombra</p>
      <p style="margin: 0;">${l.cosaRestaInOmbra}</p>
    </div>
  `,
}));

// ─── Annotazioni caso-guida (lente A1) ───────────────────────

const SCENA_M3_HTML = `
  <p>Durante un bilancio di salute, il pediatra propone per alcuni minuti una breve situazione di lettura condivisa. Il bambino ha circa 18-24 mesi. È presente un genitore. Sul tavolo c'è un piccolo libro illustrato con immagini semplici: animali, oggetti familiari, figure umane.</p>
  <p><span class="corso-anno" data-anno-id="m3-a1">Il bambino prende il libro, lo apre,</span> guarda alcune immagini, <span class="corso-anno" data-anno-id="m3-a2">indica una figura, vocalizza qualcosa</span> e guarda l'adulto. <span class="corso-anno" data-anno-id="m3-a3">Il genitore nomina l'immagine, sorride, aspetta.</span> <span class="corso-anno" data-anno-id="m3-a4">Il bambino torna a guardare il libro, gira pagina,</span> poi <span class="corso-anno" data-anno-id="m3-a5">mostra un'altra figura all'adulto.</span></p>
`;

const ANNOTAZIONI_M3 = [
  {
    id: 'm3-a1',
    estratto: 'Il bambino prende il libro, lo apre',
    label: 'Corpo che abita',
    colore: '#1a6b8a',
    annotazione:
      "Il prendere e l'aprire non sono atti motori separati dall'esperienza: sono il modo incarnato in cui il bambino si orienta verso quel campo. Il corpo organizza l'apertura verso l'oggetto-mondo prima che ci sia un'intenzione esplicita formulabile. Questo è il bambino che abita, non che «usa» il libro.",
    asse: 'A1 — Corpo come modo di essere',
  },
  {
    id: 'm3-a2',
    estratto: 'indica una figura, vocalizza qualcosa',
    label: 'Esperienza in atto',
    colore: '#1a6b8a',
    annotazione:
      "Il gesto di indicare e la vocalizzazione non sono due comportamenti separati (motorio + comunicativo): sono un unico atto dell'esperienza incarnata. Il bambino non «indica» e poi «vocalizza» — è in una configurazione corporea-relazionale che produce gesto e voce insieme come forma dell'abitare quel campo.",
    asse: 'A1 — Corpo, relazione, mondo intrecciati',
  },
  {
    id: 'm3-a3',
    estratto: "Il genitore nomina l'immagine, sorride, aspetta",
    label: 'Campo che sostiene',
    colore: '#1a6b8a',
    annotazione:
      "«Aspetta» è il modo in cui il campo relazionale si struttura per sostenere la continuità dell'esperienza del bambino. L'aspettare del genitore non è un comportamento passivo: è la forma attiva con cui il campo si rende disponibile a ricevere l'esperienza del bambino invece di sovrapporsi ad essa.",
    asse: 'A1 — Campo relazionale come condizione',
  },
  {
    id: 'm3-a4',
    estratto: 'Il bambino torna a guardare il libro, gira pagina',
    label: 'Continuità del filo',
    colore: '#1a6b8a',
    annotazione:
      "«Torna a guardare» — non ricomincia da zero. L'esperienza ha un filo che si mantiene attraverso lo scambio con l'adulto. Il girare pagina è un atto di continuità dell'esperienza: il bambino riprende il campo del libro dopo la parentesi relazionale con l'adulto. Questo è Asse 1 visibile come continuità.",
    asse: "A1 — Continuità dell'esperienza",
  },
  {
    id: 'm3-a5',
    estratto: "mostra un'altra figura all'adulto",
    label: 'Traiettoria aperta',
    colore: '#1a6b8a',
    annotazione:
      "«Un'altra figura» — non la stessa. La traiettoria dell'esperienza si apre verso qualcosa di nuovo. Il bambino non è saturato, non è nel loop: ha una direzione che lo porta verso una nuova possibilità di scambio. La traiettoria è aperta — e il campo è strutturato abbastanza da sostenerla.",
    asse: "A1 — Traiettoria aperta dell'esperienza",
  },
];

// ─── Helper ──────────────────────────────────────────────────

function asseChip(asseId: string): string {
  const a = SEI_ASSI_BY_ID[asseId];
  if (!a) return '';
  return `<span style="display: inline-flex; align-items: center; background: ${a.colore}; color: white; font-size: 0.74rem; font-weight: 700; padding: 3px 10px; border-radius: 4px;">A${a.numero}</span>`;
}

// =============================================================
// Slide
// =============================================================

export const Module03: Module = {
  id: 'm03',
  number: 3,
  title: "Asse 1 — Abitare l'esperienza",
  shortTitle: 'Asse 1',
  accent: '#1a6b8a',
  slides: [
    // ─── 3.1 ──────────────────────────────────────────────
    {
      id: 'm03-s01',
      type: 'standard',
      title: 'Il fondamento del fondamento',
      subtitle: 'Perché Asse 1 viene prima di tutti gli altri',
      content: `
        <div class="corso-section">
          <p>Asse 1 ha funzione fondativa perché chiarisce <strong>che tipo di soggetto</strong> è il bambino prima di qualsiasi altra domanda. Senza questa chiarezza, tutti gli altri assi rischiano di descrivere funzioni di un organismo invece di dimensioni di un soggetto.</p>
        </div>

        <div class="corso-section" style="background: var(--corso-primary-light); border-left: 4px solid #1a6b8a; padding: 16px 20px; border-radius: var(--corso-radius-sm); margin: 16px 0;">
          <p style="margin: 0; font-size: 1.05rem; line-height: 1.6;">Senza Asse 1, gli altri cinque assi descrivono <strong>funzioni di un organismo</strong> — non <strong>dimensioni di un soggetto</strong>.</p>
        </div>

        <h3 class="corso-narrative__h3">Cosa accade agli altri assi senza A1</h3>
        <div class="corso-cards corso-cards--vertical">
          ${SENZA_A1.map((s) => {
            const a = SEI_ASSI_BY_ID[s.asseId];
            return `
              <div class="corso-card corso-card--open" style="--corso-card-accent: ${a.colore}; background: #fef9f9;">
                <div class="corso-card__body">
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                    ${asseChip(s.asseId)}
                    <span style="font-weight: 700; color: ${a.colore};">${a.nome}</span>
                  </div>
                  <p style="margin: 0; font-style: italic;">${s.cosaDiventa}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <p class="corso-narrative__caption" style="margin-top: 16px; text-align: center;">A1 è condizione logica di tutti gli altri — non li precede nel tempo: li fonda nella struttura.</p>
      `,
      notes:
        "La dipendenza strutturale non significa che A1 venga «prima» nello sviluppo del bambino. Significa che qualsiasi osservazione che usa A2, A3, A4, A5 o A6 sta presupponendo A1 — anche quando non lo dice. Questo modulo rende esplicita quella presupposizione.",
    },

    // ─── 3.2 ──────────────────────────────────────────────
    {
      id: 'm03-s02',
      type: 'narrative',
      title: 'La domanda guida di Asse 1',
      subtitle: 'Prima di capire cosa fa il bambino, chiediamoci come lo fa',
      content: `
        <blockquote class="corso-blockquote" style="border-left-color: #1a6b8a; background: var(--corso-primary-light); font-size: 1.4rem; line-height: 1.5; text-align: center; padding: 28px 24px;">
          «In che modo il bambino riesce ad <strong style="text-decoration: underline dotted #1a6b8a; text-underline-offset: 6px; text-decoration-thickness: 2px;">abitare</strong> l'esperienza che sta vivendo?»
        </blockquote>

        <p class="corso-narrative__caption" style="text-align: center; margin: 12px 0 24px;">«Abitare» non è una metafora decorativa. Esplora i chip per vedere da cosa si distingue.</p>
      `,
      interactive: {
        kind: 'chip-accordion',
        items: CONTRARI_ITEMS,
      },
      intro: `
        <p style="text-align: center; color: var(--corso-text-muted); font-size: 0.9rem;">Quattro verbi vicini, ciascuno parziale rispetto a ciò che «abitare» indica.</p>
      `,
      notes:
        "La domanda guida non è un indicatore da rispondere sì/no: è un orientamento dell'osservazione. Non esiste un bambino che «non abita» la propria esperienza — esistono campi che rendono l'abitare più o meno possibile, più o meno continuo, più o meno sostenuto. La domanda chiede come — non se.",
    },

    // ─── 3.3 ──────────────────────────────────────────────
    {
      id: 'm03-s03',
      type: 'diagram',
      title: 'Tre dimensioni intrecciate',
      subtitle: 'Non tre componenti separati — un unico nodo strutturale',
      intro: `
        <p>Asse 1 descrive il bambino come soggetto <strong>incarnato, relazionale e nel-mondo</strong>. Queste tre parole non sono aggettivi indipendenti: descrivono un unico modo di esistere. Le distinguiamo per chiarezza espositiva — la realtà è che sono sempre già intrecciate.</p>
      `,
      content: `
        <div style="display: flex; justify-content: center; margin: 20px 0;">
          <svg viewBox="0 0 320 280" style="width: 100%; max-width: 360px; height: auto;" aria-label="Tre dimensioni di Asse 1">
            <defs>
              <radialGradient id="a1grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#1a6b8a" stop-opacity="0.7"/>
                <stop offset="100%" stop-color="#1a6b8a" stop-opacity="0.4"/>
              </radialGradient>
            </defs>
            <circle cx="115" cy="100" r="90" fill="#1a6b8a" fill-opacity="0.22" stroke="#1a6b8a" stroke-opacity="0.5"/>
            <circle cx="205" cy="100" r="90" fill="#1a6b8a" fill-opacity="0.22" stroke="#1a6b8a" stroke-opacity="0.5"/>
            <circle cx="160" cy="180" r="90" fill="#1a6b8a" fill-opacity="0.22" stroke="#1a6b8a" stroke-opacity="0.5"/>
            <text x="80" y="60" font-size="14" font-weight="700" fill="#1a6b8a">CORPO</text>
            <text x="220" y="60" font-size="14" font-weight="700" fill="#1a6b8a">RELAZIONE</text>
            <text x="135" y="260" font-size="14" font-weight="700" fill="#1a6b8a">MONDO</text>
            <text x="160" y="135" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">Abitare</text>
            <text x="160" y="152" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">l'esperienza</text>
          </svg>
        </div>

        <p class="corso-narrative__caption" style="text-align: center; margin-bottom: 24px;">Le tre dimensioni non si «combinano»: sono sempre già intrecciate. Separarle analiticamente è una semplificazione necessaria — non una descrizione della realtà.</p>

        <div class="corso-cards corso-cards--vertical">
          ${TRE_DIMENSIONI_A1.map((d) => `
            <div class="corso-card corso-card--open" style="--corso-card-accent: #1a6b8a;">
              <div class="corso-card__head">
                <span class="corso-card__badge" style="background: #1a6b8a; font-size: 1.1rem;">${d.icona}</span>
                <span class="corso-card__title">${d.titolo}</span>
              </div>
              <div class="corso-card__body">
                <p>${d.testo}</p>
                <div style="background: var(--corso-bg); border-left: 3px solid #1a6b8a; padding: 10px 14px; border-radius: var(--corso-radius-sm); margin: 12px 0;">
                  <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--corso-text-muted); margin: 0 0 4px;">Implicazione</p>
                  <p style="margin: 0; font-size: 0.92rem;">${d.implicazione}</p>
                </div>
                <p style="font-style: italic; color: var(--corso-text-2); margin: 8px 0 4px;"><strong>Domanda professionale</strong> · ${d.domandaProfessionale}</p>
                <div style="background: var(--corso-primary-light); padding: 10px 14px; border-radius: var(--corso-radius-sm); margin-top: 8px;">
                  <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--corso-text-muted); margin: 0 0 4px;">Nel caso-guida</p>
                  <p style="margin: 0; font-size: 0.92rem; font-style: italic;">${d.esempioCaso}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `,
      notes:
        "Il diagramma di Venn è un'approssimazione: suggerisce tre dimensioni separate con zone di sovrapposizione. In realtà Asse 1 descrive qualcosa di più radicale: non ci sono tre dimensioni che si sovrappongono — c'è un unico modo di essere soggetto che è sempre già incarnato, relazionale e nel-mondo. La separazione analitica serve all'apprendimento, non alla descrizione.",
    },

    // ─── 3.4 ──────────────────────────────────────────────
    {
      id: 'm03-s04',
      type: 'standard',
      title: "L'esperienza si mantiene — o si frammenta",
      subtitle: 'La continuità come manifestazione principale di Asse 1 nel lavoro professionale',
      content: `
        <div class="corso-section">
          <p>Una delle manifestazioni più visibili di Asse 1 nel lavoro professionale è la capacità dell'esperienza di mantenersi attraverso le discontinuità: interruzioni, cambiamenti, frustrazioni, transizioni. Un bambino il cui Asse 1 è ben sostenuto nel campo non riparte da zero ogni volta che qualcosa si interrompe — riprende il filo. Un bambino il cui Asse 1 è fragile in quel campo perde il filo: ogni interruzione è come ricominciare da capo.</p>
        </div>

        <div class="corso-cards corso-cards--grid" style="grid-template-columns: repeat(3, 1fr); gap: 14px;">
          ${FORME_CONTINUITA.map((f) => `
            <div class="corso-card corso-card--open" style="--corso-card-accent: ${f.colore}; background: ${f.sfondo};">
              <div class="corso-card__head">
                <span class="corso-card__badge" style="background: ${f.colore};">${f.tipo}</span>
              </div>
              <div class="corso-card__body">
                <p style="margin: 0 0 12px;">${f.descrizione}</p>
                <div style="background: var(--corso-surface); padding: 10px 12px; border-radius: var(--corso-radius-sm); margin-bottom: 10px;">
                  <p style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 4px;">Come si vede</p>
                  <p style="margin: 0; font-size: 0.88rem; font-style: italic;">${f.osservabile}</p>
                </div>
                <p style="margin: 0; font-size: 0.88rem;"><strong>Domanda</strong> · ${f.domanda}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="text-align: center; color: var(--corso-text-muted); margin: 18px 0; font-size: 0.9rem;">
          Continuità sostenuta &nbsp; ←→ &nbsp; Continuità fragile &nbsp; ←→ &nbsp; Continuità interrotta
          <p style="margin: 4px 0 0; font-size: 0.78rem; font-style: italic;">La direzione dipende dal campo, non dal bambino: il campo può spostarsi in entrambi i sensi.</p>
        </div>

        <div class="corso-section" style="border-left: 4px solid #f39c12; background: #fef9e7; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-top: 16px;">
          <p style="margin: 0;">Le tre forme non sono diagnosi e non descrivono il bambino come individuo: descrivono la <strong>configurazione del campo</strong> in un momento specifico. Lo stesso bambino può mostrare continuità sostenuta al nido con l'educatrice di riferimento e continuità interrotta durante la visita pediatrica. Il campo fa la differenza.</p>
        </div>
      `,
      notes:
        "La continuità dell'esperienza è visibile nel lavoro professionale senza strumenti specialistici: basta spostare l'attenzione dai comportamenti del bambino alla traiettoria dell'esperienza. «Il bambino riprende?» è una delle domande più semplici e più informative che Asse 1 suggerisce.",
    },

    // ─── 3.5 ──────────────────────────────────────────────
    {
      id: 'm03-s05',
      type: 'interactive',
      title: 'Asse 1 nei cinque contesti professionali',
      subtitle: 'Le stesse domande — linguaggi diversi',
      intro: `
        <p>Asse 1 non cambia passando da un contesto all'altro. Cambiano il linguaggio in cui le domande vengono poste, il tipo di situazione in cui si manifestano, il tipo di risposta professionale che diventa possibile.</p>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: CONTESTI_CARDS,
        layout: 'vertical',
      },
      notes:
        "Le cinque domande operative per contesto non sono un elenco da memorizzare: sono esempi del tipo di domanda che Asse 1 genera. Il professionista che ha interiorizzato Asse 1 produce domande simili spontaneamente — senza bisogno di consultare un elenco.",
    },

    // ─── 3.6 ──────────────────────────────────────────────
    {
      id: 'm03-s06',
      type: 'interactive',
      title: 'Asse 1 nei linguaggi delle discipline',
      subtitle: 'Come ogni disciplina si avvicina a Asse 1 — e dove rischia di restringerlo',
      intro: `
        <p>Asse 1 non appartiene a nessuna disciplina specifica: <strong>attraversa tutte le discipline</strong> che si occupano dello sviluppo. Ogni disciplina ha i propri concetti-ponte — termini che, nel proprio linguaggio, si avvicinano a ciò che Asse 1 descrive. Conoscerli serve a riconoscere quando una disciplina sta «parlando di Asse 1» senza dirlo esplicitamente — e a tradurre fra linguaggi diversi senza perdere la struttura.</p>
        <p class="corso-narrative__caption"><strong>Nota terminologica</strong> · I «punti di attenzione» segnalati per ogni concetto non sono critiche alle discipline. Indicano dove il termine, nel proprio linguaggio specifico, può perdere parte della struttura più ampia che Asse 1 descrive: una focalizzazione legittima che, se assunta come unica, lascia in ombra altre dimensioni.</p>
      `,
      interactive: {
        kind: 'chip-accordion',
        items: DISCIPLINE_ITEMS,
      },
      content: `
        <div class="corso-section" style="background: var(--corso-primary-light); border-left: 4px solid #1a6b8a; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-top: 20px;">
          <p style="margin: 0;">I concetti-ponte non sono sinonimi di Asse 1: sono <strong>traduzioni parziali</strong> in linguaggi disciplinari specifici. Il loro valore è pratico: permettono al professionista di riconoscere quando la propria disciplina sta «parlando di Asse 1» — e di tenere presente la struttura più ampia che il proprio linguaggio non cattura completamente.</p>
        </div>
      `,
      notes:
        "Ogni disciplina ha le proprie focalizzazioni caratteristiche: il registro normativo per la pediatria, il registro clinico per la NPI, il registro funzionale per la pedagogia. Asse 1 non sostituisce questi linguaggi — fornisce un livello strutturale comune da cui possono confrontarsi.",
    },

    // ─── 3.7 ──────────────────────────────────────────────
    {
      id: 'm03-s07',
      type: 'interactive',
      title: 'Quattro letture mono-registro da riconoscere',
      subtitle: 'Cosa resta in ombra quando Asse 1 non viene tematizzato',
      intro: `
        <p>Quando Asse 1 non entra esplicitamente nell'osservazione, lo sguardo si dispone naturalmente lungo registri specifici: il deficit, il comportamento, la cognizione, il giudizio morale. Riconoscere questi registri non è criticarli — è renderli visibili come scelte interpretative, non come descrizioni neutre della realtà.</p>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: LETTURE_CARDS,
        layout: 'grid',
      },
      content: `
        <hr class="corso-divider" />
        <p class="corso-emph corso-emph--center" style="font-size: 1.05rem;">Nessuna di queste formulazioni è «sbagliata» in assoluto: sono linguaggi professionali competenti che servono a scopi precisi. Diventano letture mono-registro quando sono l'unica disponibile — quando manca un livello strutturale da cui partire.</p>
      `,
      notes:
        "Il riconoscimento delle letture mono-registro non serve a criticare i colleghi di altre discipline: serve a riconoscere i propri automatismi linguistici. Ogni professionista ha le proprie focalizzazioni caratteristiche, legate al proprio training e ai propri strumenti. Asse 1 non le elimina — le rende visibili e integrabili.",
    },

    // ─── 3.8 ──────────────────────────────────────────────
    {
      id: 'm03-s08',
      type: 'narrative',
      title: 'La scena di lettura — vista da Asse 1',
      subtitle: 'Come cambia la domanda quando si abita il framework',
      interactive: {
        kind: 'annotated-scene',
        sceneHtml: SCENA_M3_HTML,
        annotations: ANNOTAZIONI_M3,
        istruzione: 'Clicca sulle frasi evidenziate per leggere la scena attraverso Asse 1.',
      },
      content: `
        <hr class="corso-divider" />
        <h3 class="corso-narrative__h3" style="text-align: center;">La stessa scena — due domande diverse</h3>

        <div class="corso-two-col">
          <div class="corso-box" style="border-left: 3px solid #c0392b; background: #fdecea; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #c0392b;">Senza Asse 1</div>
            <p style="font-style: italic; margin: 8px 0;">«Il bambino di 20 mesi mostra pointing, vocalizzazione e attenzione condivisa adeguati all'età. La qualità dello scambio con il genitore è buona.»</p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
              <span style="background: #e74c3c; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">prestazionale</span>
              <span style="background: #c0392b; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">individuale</span>
              <span style="background: #e67e22; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">normativa implicita</span>
            </div>
          </div>
          <div class="corso-box corso-box--valid" style="border-color: #1a6b8a; background: var(--corso-primary-light);">
            <div class="corso-box__title" style="color: #1a6b8a;">Con Asse 1</div>
            <p style="font-style: italic; margin: 8px 0;">«Il bambino abita il campo della lettura con continuità: il corpo è orientato verso il libro e verso l'adulto, il filo dell'esperienza si mantiene attraverso lo scambio, la traiettoria è aperta verso nuove possibilità. Il campo relazionale sostiene l'abitare.»</p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
              <span style="background: #1a6b8a; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">strutturale</span>
              <span style="background: #2d6a4f; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">configurazionale</span>
              <span style="background: #27ae60; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">descrive il campo</span>
            </div>
          </div>
        </div>

        <p class="corso-narrative__caption" style="text-align: center; margin-top: 20px;">Nel Modulo 4 aggiungeremo a questa lettura le lenti di Asse 2 e Asse 3: vedremo come la stessa scena rivela altri strati strutturali quando si guarda al riconoscimento dell'alterità e alla normatività emergente dello scambio.</p>

        <div style="text-align: center; margin-top: 16px;">
          <span style="display: inline-block; padding: 8px 16px; border: 1px solid var(--corso-border); border-radius: var(--corso-radius-sm); color: var(--corso-text-2); font-size: 0.9rem;">→ Modulo 4 — Assi 2 e 3: Alterità e normatività</span>
        </div>
      `,
      guardrail: {
        code: 'G-A1',
        label: 'Guardrail Asse 1',
        text: A1.guardrail,
      },
      notes:
        "Questa è la prima volta che il componente AnnotatedScene viene usato in modalità «mono-asse»: tutte le annotazioni leggono la scena attraverso Asse 1. Nel Modulo 7, la stessa scena verrà riletta con tutti e sei gli assi insieme — come chiusura dell'intero percorso di F1.",
    },
  ],
};
