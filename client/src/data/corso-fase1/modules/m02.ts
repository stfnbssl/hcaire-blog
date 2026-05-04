import type { ExpandableCardData, Module } from '../types';
import { CASO_GUIDA_F1 } from '../caso-guida';
import { SEI_ASSI, SEI_ASSI_BY_ID } from '../sei-assi';

// =============================================================
// Modulo 2 — Gli assi strutturali: logica e architettura
// =============================================================

// ─── Quattro proprietà degli assi ───────────────────────────

interface ProprietaAsse {
  id: string;
  numero: string;
  nome: string;
  sommario: string;
  testo: string;
  test: string;
  implicazione: string;
  esempio: string;
}

const QUATTRO_PROPRIETA: ProprietaAsse[] = [
  {
    id: 'p1',
    numero: '1',
    nome: 'Compresenza',
    sommario:
      'Tutti e sei gli assi sono attivi simultaneamente in qualsiasi momento dello sviluppo.',
    testo:
      "Tutti e sei gli assi sono attivi e compresenti lungo tutto l'arco evolutivo: non si attivano a turno, non si sostituiscono, non si «completano». In un qualsiasi momento dello sviluppo del bambino tutti e sei stanno funzionando — anche se non con uguale salienza, e anche se non tutti sono egualmente visibili nell'osservazione.",
    test:
      'In questa scena sto leggendo un solo asse o sto ignorando gli altri cinque che sono comunque attivi?',
    implicazione:
      "Nessuno strumento può «misurare un asse alla volta» come se gli altri fossero assenti. Ogni configurazione osservativa deve tener conto che gli altri assi stanno operando — anche se la slide o lo strumento ne mette a fuoco uno in particolare.",
    esempio:
      "Durante la lettura condivisa, Asse 1 (come il bambino abita il campo), Asse 2 (riconosce il genitore come soggetto), Asse 3 (partecipa a una struttura con criteri impliciti), Asse 4 (incontra il limite delle pagine), Asse 5 (ha una direzione verso il prossimo scambio) e Asse 6 (usa il libro come oggetto culturale) sono tutti attivi insieme.",
  },
  {
    id: 'p2',
    numero: '2',
    nome: 'Dipendenza strutturale',
    sommario:
      'Gli assi successivi presuppongono i precedenti; Asse 1 non richiede la presenza degli altri.',
    testo:
      "Esiste una gerarchia strutturale — non valutativa né cronologica — che indica dipendenze logiche fra le dimensioni. Asse 2 non può funzionare senza Asse 1. Asse 6 presuppone tutti gli assi precedenti. Ma Asse 1 non richiede la presenza di nessun altro asse per funzionare: è fondativo in senso assoluto. La gerarchia non dice quale asse è «più importante»: dice quale asse è condizione logica degli altri.",
    test:
      "Se rimuovo Asse 1 da questa lettura, l'asse che sto usando regge ancora? Se no, lo sto presupponendo senza dirlo.",
    implicazione:
      "La gerarchia ha conseguenze sulla costruzione degli strumenti: uno strumento che lavora su Asse 3 (normatività) deve poter rendere conto di Asse 1 e Asse 2 come condizioni di sfondo — anche se non li «misura» esplicitamente.",
    esempio:
      "Un educatore che osserva la normatività emergente in un bambino (Asse 3) sta implicitamente presupponendo che il bambino abiti un'esperienza (Asse 1) e riconosca l'altro come soggetto (Asse 2). Se queste condizioni mancano, quello che osserva non è normatività emergente: è qualcosa d'altro.",
  },
  {
    id: 'p3',
    numero: '3',
    nome: 'Variabilità relativa',
    sommario:
      'Il peso di ciascun asse non è costante: varia per momento, contesto e configurazione.',
    testo:
      "Il peso di ciascun asse non è costante lungo lo sviluppo né fra situazioni diverse. In alcuni momenti o contesti un asse è più saliente, più sollecitato, più visibile. Un bambino che incontra il limite (Asse 4 saliente) in una situazione di scarsa regolazione (Asse 1 fragile) si trova in una configurazione diversa rispetto a uno che incontra lo stesso limite in un campo relazionale solido. Gli assi non cambiano: cambia il loro peso relativo nel campo specifico.",
    test:
      'Sto descrivendo la variabilità come proprietà del bambino o come configurazione situata di questo campo in questo momento?',
    implicazione:
      "La variabilità relativa rende impossibile qualsiasi «profilo d'asse» stabile: un bambino non ha «Asse 4 debole» come tratto — ha una configurazione in cui Asse 4 risulta particolarmente sollecitato in quel campo specifico. La descrizione è sempre situata.",
    esempio:
      "Lo stesso bambino può mostrare Asse 5 (desiderio) molto saliente al nido con l'educatrice preferita, e Asse 1 (organizzazione dell'esperienza) fragile durante la visita pediatrica. Non è incoerente: sono due configurazioni diverse, in due campi diversi.",
  },
  {
    id: 'p4',
    numero: '4',
    nome: 'Non-esclusività disciplinare',
    sommario:
      'Nessun asse appartiene a una sola disciplina: ogni asse è leggibile da tutte.',
    testo:
      "Nessun asse appartiene a una sola disciplina. Asse 2 (riconoscimento dell'alterità) non è «la psicologia»: la pediatria lo legge nella qualità del contatto genitore-bambino durante la visita, la neuropsichiatria nella capacità di intersoggettività, la pedagogia nelle forme di riconoscimento fra pari al nido. Ogni asse attraversa tutti i contesti professionali — con linguaggi diversi, ma attraverso la stessa struttura.",
    test:
      'Sto assegnando questo asse a una disciplina specifica, o sto mantenendo la sua trasversalità?',
    implicazione:
      "La non-esclusività è la condizione che rende possibile il dialogo interdisciplinare in F2: se ogni asse appartenesse a una sola disciplina, la traduzione sarebbe impossibile. Gli assi sono il livello in cui le discipline si possono incontrare — prima di articolarsi nei propri strumenti.",
    esempio:
      "Asse 6 (mondo storico-culturale) non è «la pedagogia». Il pediatra lo legge nell'uso del libro durante il bilancio, il neurologo nella capacità di condivisione referenziale, il counsellor nelle pratiche culturali della famiglia, l'educatore nelle forme di partecipazione al gruppo.",
  },
];

const PROPRIETA_CARDS: ExpandableCardData[] = QUATTRO_PROPRIETA.map((p) => ({
  id: p.id,
  badge: p.numero,
  color: '#4a5568',
  title: p.nome,
  summary: p.sommario,
  detail: `
    <div class="corso-section" style="margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Definizione</p>
      <p style="margin: 0;">${p.testo}</p>
    </div>
    <div class="corso-section" style="background: var(--corso-primary-light); padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Cosa significa per gli strumenti</p>
      <p style="margin: 0;">${p.implicazione}</p>
    </div>
    <div class="corso-section" style="margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Esempio</p>
      <p style="margin: 0; font-style: italic;">${p.esempio}</p>
    </div>
    <div class="corso-section" style="background: #f5f6f8; border-left: 3px solid #4a5568; padding: 12px 16px; border-radius: var(--corso-radius-sm);">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Domanda-test</p>
      <p style="margin: 0; font-style: italic;">${p.test}</p>
    </div>
  `,
}));

// ─── Confronto Asse vs. Competenza ──────────────────────────

interface RigaConfronto {
  id: string;
  dimensione: string;
  asse: string;
  competenza: string;
}

const CONFRONTO_RIGHE: RigaConfronto[] = [
  {
    id: 'r1',
    dimensione: 'Natura',
    asse: 'Struttura interpretativa — sempre attiva, non si acquisisce',
    competenza: 'Abilità o capacità — si acquisisce, si consolida, si può misurare',
  },
  {
    id: 'r2',
    dimensione: 'Temporalità',
    asse:
      'Non arriva e non scompare: si trasforma nel peso relativo ma resta sempre presente',
    competenza:
      'Segue una traiettoria: assente → emergente → consolidata → automatizzata',
  },
  {
    id: 'r3',
    dimensione: 'Relazione con la norma',
    asse: 'Non ha soglie normative: non esiste un «livello adeguato di Asse 3»',
    competenza:
      'Ha soglie normative per età: una competenza può essere «nella norma» o «in ritardo»',
  },
  {
    id: 'r4',
    dimensione: 'Funzione negli strumenti',
    asse:
      'Orienta la costruzione degli strumenti; non è operazionalizzato direttamente',
    competenza:
      'È operazionalizzata direttamente: è ciò che lo strumento misura o valuta',
  },
  {
    id: 'r5',
    dimensione: 'Soggetto grammaticale',
    asse:
      'Descrive il campo relazionale ed esperienziale in cui il bambino esiste',
    competenza:
      'Descrive il bambino individuale («il bambino sa / riesce a / ha raggiunto»)',
  },
  {
    id: 'r6',
    dimensione: 'Esempio concreto',
    asse:
      "«Come il bambino abita lo scambio con l'adulto attorno al libro» (Asse 1 + Asse 6)",
    competenza:
      '«Competenza referenziale: usa il pointing per condividere informazioni» (tappa 18 mesi)',
  },
];

// ─── Mediazione F1 → F2 → F3 → ricerca empirica ─────────────

interface LivelloMediazione {
  id: string;
  livello: string;
  label: string;
  sublabel: string;
  colore: string;
  descrizione: string;
}

const MEDIAZIONE_LIVELLI: LivelloMediazione[] = [
  {
    id: 'l1',
    livello: 'Livello 1',
    label: 'Assi strutturali (F1)',
    sublabel: "Strutture interpretative — orientano l'osservazione",
    colore: '#6c63ff',
    descrizione:
      "I sei assi definiscono le dimensioni strutturali dell'esperienza del soggetto in sviluppo. Non si usano direttamente nel lavoro professionale: fondano i vincoli che rendono possibile qualsiasi strumento successivo.",
  },
  {
    id: 'l2',
    livello: 'Livello 2',
    label: 'Nodi Trasversali e Matrice (F2)',
    sublabel: 'Configurazioni traducibili — rendono leggibile il campo',
    colore: '#1a6b8a',
    descrizione:
      "I sette Nodi Trasversali sono configurazioni in cui più assi si co-organizzano producendo qualcosa di osservabile e interrogabile da discipline diverse. La Matrice li traduce nei linguaggi professionali. Questo è il livello intermedio che rende possibile il passaggio agli strumenti.",
  },
  {
    id: 'l3',
    livello: 'Livello 3',
    label: 'Strumenti operativi (F3)',
    sublabel: "Dispositivi contestualizzati — rendono possibile l'azione",
    colore: '#2d9cdb',
    descrizione:
      "Gli strumenti di F3 nascono dalla grammatica configurazionale di F2, che a sua volta porta in sé i vincoli di F1. Ogni strumento — anche il più operativo — porta in sé la fondazione ontologica come guardrail implicito.",
  },
  {
    id: 'l4',
    livello: 'Livello 4',
    label: 'Ricerca empirica',
    sublabel: 'Validazione degli strumenti — non degli assi',
    colore: '#4a5568',
    descrizione:
      "La verificabilità empirica riguarda gli strumenti costruiti nel quadro dei Nodi e della Matrice — non gli assi direttamente. La ricerca non «misura gli assi»: valida se gli strumenti costruiti nel loro quadro funzionano nei contesti reali.",
  },
];

// ─── Annotazioni caso-guida per M02 ──────────────────────────

interface AnnotazioneCasoM2 {
  id: string;
  estratto: string;
  assiAttivi: string[];
  annotazione: string;
  notaCompresenza: string;
}

const ANNOTAZIONI_CASO_M2: AnnotazioneCasoM2[] = [
  {
    id: 'c1',
    estratto: 'Il bambino prende il libro, lo apre',
    assiAttivi: ['a1', 'a5'],
    annotazione:
      "A1: il corpo organizza l'orientamento verso l'oggetto prima di qualsiasi atto riflessivo. A5: c'è già una direzione — non apre il libro a caso, ma come apertura verso una possibilità di scambio.",
    notaCompresenza:
      'Anche A2, A3, A6 sono attivi — ma A1 e A5 sono i più salienti in questo gesto.',
  },
  {
    id: 'c2',
    estratto: "indica una figura, vocalizza qualcosa e guarda l'adulto",
    assiAttivi: ['a2', 'a3', 'a6'],
    annotazione:
      "A2: il guardare l'adulto è riconoscimento dell'altro come soggetto. A3: l'alternanza gesto-attesa rispetta una struttura di scambio con criteri impliciti. A6: la figura del libro diventa mediatore di mondo condiviso.",
    notaCompresenza:
      'A1 è la condizione di sfondo: senza A1, questo gesto complesso non sarebbe possibile.',
  },
  {
    id: 'c3',
    estratto: "Il genitore nomina l'immagine, sorride, aspetta",
    assiAttivi: ['a2', 'a3'],
    annotazione:
      "A2 (lato adulto): il genitore riconosce il bambino come soggetto che ha aperto uno scambio — non risponde al comportamento, risponde all'intenzione. A3: l'aspettare del genitore è la forma in cui la struttura normativa dello scambio viene rispettata e offerta come modello.",
    notaCompresenza:
      'Questo gesto adulto mostra come gli assi non descrivano solo il bambino, ma il campo relazionale.',
  },
  {
    id: 'c4',
    estratto: 'Il bambino torna a guardare il libro, gira pagina',
    assiAttivi: ['a4', 'a1'],
    annotazione:
      "A4: il libro ha un limite strutturale (pagine finite, non modificabili dal bambino). Il girare pagina è l'incontro con questo limite — e la sua integrazione come struttura dell'esperienza, non come ostacolo. A1: la continuità della sequenza si mantiene attraverso l'interruzione.",
    notaCompresenza:
      'A5 è già orientato verso la prossima pagina: il limite diventa apertura.',
  },
  {
    id: 'c5',
    estratto: "poi mostra un'altra figura all'adulto",
    assiAttivi: ['a5', 'a6'],
    annotazione:
      "A5: c'è una nuova direzione — non ripetizione ma espansione verso una nuova possibilità di scambio. A6: il libro come oggetto culturale continua a fungere da mediatore di partecipazione al mondo condiviso.",
    notaCompresenza:
      'Tutti e sei gli assi sono attivi nella chiusura della sequenza: la scena è un esempio di compresenza totale.',
  },
];

// ─── Helper HTML ─────────────────────────────────────────────

function asseBadge(asseId: string): string {
  const a = SEI_ASSI_BY_ID[asseId];
  if (!a) return '';
  return `<span style="display: inline-flex; align-items: center; gap: 4px; background: ${a.colore}; color: white; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em; padding: 3px 8px; border-radius: 4px; margin-right: 4px;">A${a.numero}</span>`;
}

function gerarchiaBlocco(asse: typeof SEI_ASSI[number]): string {
  const dipChips = asse.dipendenze.length === 0
    ? `<span style="font-size: 0.78rem; color: var(--corso-text-muted); font-style: italic;">Fondativo — non presuppone altri assi</span>`
    : `<span style="font-size: 0.78rem; color: var(--corso-text-muted); margin-right: 6px;">presuppone:</span>${asse.dipendenze.map(asseBadge).join('')}`;

  return `
    <div class="corso-card corso-card--open" style="--corso-card-accent: ${asse.colore}; background: ${asse.sfondo};">
      <div class="corso-card__head">
        <span class="corso-card__badge" style="background: ${asse.colore};">A${asse.numero}</span>
        <span class="corso-card__title">${asse.nome} <em style="font-weight: 400; color: var(--corso-text-muted);">— ${asse.nomeBreve}</em></span>
      </div>
      <div class="corso-card__body">
        <p style="font-style: italic; color: var(--corso-text-2); margin: 0 0 6px;">${asse.domandaGuida}</p>
        <p style="margin: 0;">${dipChips}</p>
      </div>
    </div>
  `;
}

function frecciaPresuppone(): string {
  return `<div style="text-align: center; color: var(--corso-text-muted); font-size: 0.85rem; margin: 4px 0; line-height: 1;">↓<br/><span style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em;">presuppone</span></div>`;
}

const ASSE_CARDS: ExpandableCardData[] = SEI_ASSI.map((a) => {
  const dipText =
    a.dipendenze.length === 0
      ? '<em style="color: var(--corso-text-muted);">Fondativo — non presuppone altri assi</em>'
      : a.dipendenze.map(asseBadge).join('');
  return {
    id: a.id,
    badge: `A${a.numero}`,
    color: a.colore,
    title: `${a.nome} — ${a.nomeBreve}`,
    summary: a.domandaGuida,
    detail: `
      <div class="corso-section" style="margin-bottom: 12px;">
        <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Funzione strutturale</p>
        <p style="margin: 0;">${a.funzioneStrutturale}</p>
      </div>
      <div class="corso-section" style="background: ${a.sfondo}; padding: 12px 16px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
        <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Dipendenze</p>
        <p style="margin: 0;">${dipText}</p>
      </div>
      <div class="corso-section" style="background: #fef5ec; border-left: 3px solid #d35400; padding: 12px 16px; border-radius: var(--corso-radius-sm);">
        <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Lettura mono-registro tipica</p>
        <p style="margin: 0;">${a.letturaMonoRegistro}</p>
      </div>
    `,
  };
});

// =============================================================
// Slide
// =============================================================

export const Module02: Module = {
  id: 'm02',
  number: 2,
  title: 'Gli assi strutturali — logica e architettura',
  shortTitle: 'Assi',
  accent: '#4a5568',
  slides: [
    // ─── 2.1 ──────────────────────────────────────────────
    {
      id: 'm02-s01',
      type: 'standard',
      title: 'Dimensioni, non fasi',
      subtitle: 'Un chiarimento che cambia tutto',
      content: `
        <div class="corso-section">
          <p>Prima di presentare i sei assi è necessario chiarire cosa <strong>non</strong> sono. Tre parole vengono usate spesso come se fossero intercambiabili: <em>fase</em>, <em>competenza</em>, <em>dimensione strutturale</em>. Non lo sono. La distinzione non è una preferenza terminologica: ha conseguenze dirette sulla forma degli strumenti che si possono costruire.</p>
        </div>

        <div class="corso-cards corso-cards--grid" style="grid-template-columns: repeat(3, 1fr);">
          <div class="corso-card corso-card--open" style="--corso-card-accent: #c0392b; background: #fdecea;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #c0392b;">FASE</span></div>
            <div class="corso-card__body">
              <p>Un periodo dello sviluppo che si attraversa e si lascia alle spalle. La fase orale, la fase senso-motoria, la fase di attaccamento ansioso.</p>
              <p style="font-style: italic; color: var(--corso-text-2);">Si entra. Si attraversa. Si lascia.</p>
              <p>Una volta conclusa la fase, il bambino è diverso. Le fasi seguono una sequenza necessaria. Il bambino «è in» una fase: la fase lo descrive come posizione su una scala temporale.</p>
            </div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #e67e22; background: #fef3e2;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #e67e22;">COMPETENZA</span></div>
            <div class="corso-card__body">
              <p>Un'abilità specifica che si acquisisce, si consolida e si può valutare. Il pointing, la permanenza dell'oggetto, il linguaggio referenziale.</p>
              <p style="font-style: italic; color: var(--corso-text-2);">Si acquisisce. Si consolida. Si misura.</p>
              <p>Una competenza ha soglie attese a una certa età. Il bambino «ha» o «non ha» una competenza: la competenza lo misura rispetto a una norma.</p>
            </div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #6c63ff; background: #f0eeff; border-width: 2px;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #6c63ff;">ASSE STRUTTURALE</span></div>
            <div class="corso-card__body">
              <p>Una dimensione sempre attiva lungo tutto lo sviluppo. Il modo in cui il bambino abita l'esperienza. Il riconoscimento dell'alterità. Il desiderio come direzione.</p>
              <p style="font-style: italic; color: var(--corso-text-2);">Non si entra. Non si supera. Non si misura.</p>
              <p>Un asse non «arriva» e poi scompare — c'era prima ed è ancora qui. Non ha soglie normative. Il bambino non «è in» un asse: l'asse descrive una dimensione strutturale di ciò che sta vivendo.</p>
            </div>
          </div>
        </div>

        <hr class="corso-divider" />

        <div class="corso-section" style="background: var(--corso-primary-light); border-left: 4px solid #4a5568; padding: 18px 22px; border-radius: var(--corso-radius-sm);">
          <p style="margin: 0; font-size: 1.05rem; line-height: 1.6;">Gli assi strutturali di sviluppo sono <strong>dimensioni</strong>, non fasi. Non rappresentano tappe da attraversare né competenze da acquisire. Descrivono ciò che è strutturalmente in gioco nell'esperienza del bambino — in qualsiasi momento, in qualsiasi contesto.</p>
        </div>
      `,
      notes:
        "La sovrapposizione più frequente è quella fra «dimensione» e «competenza»: molti strumenti usano il termine «dimensione» per indicare ciò che funziona in realtà come competenza valutata su scala normativa. La differenza si vede dalla domanda implicita: «il bambino ce la fa?» orienta verso la competenza; «come si organizza il campo?» orienta verso l'asse strutturale.",
    },

    // ─── 2.2 ──────────────────────────────────────────────
    {
      id: 'm02-s02',
      type: 'diagram',
      title: 'La gerarchia strutturale',
      subtitle: 'Dipendenze logiche — non cronologiche, non valutative',
      intro: `
        <p>Gli assi sono organizzati da una gerarchia di <strong>dipendenza logica</strong>: ciascun asse presuppone i precedenti come condizione strutturale. La gerarchia non dice quale asse è «più importante» — dice quale è condizione di possibilità degli altri. Tutti e sei restano sempre attivi simultaneamente.</p>
      `,
      content: `
        <div class="corso-cards corso-cards--vertical">
          ${gerarchiaBlocco(SEI_ASSI[0])}
          ${frecciaPresuppone()}
          ${gerarchiaBlocco(SEI_ASSI[1])}
          ${frecciaPresuppone()}
          ${gerarchiaBlocco(SEI_ASSI[2])}
          ${frecciaPresuppone()}
          ${gerarchiaBlocco(SEI_ASSI[3])}
          ${frecciaPresuppone()}
          ${gerarchiaBlocco(SEI_ASSI[4])}
          ${frecciaPresuppone()}
          ${gerarchiaBlocco(SEI_ASSI[5])}
        </div>

        <div class="corso-two-col" style="margin-top: 20px;">
          <p style="font-size: 0.85rem; color: var(--corso-text-muted); margin: 0;"><strong>↓ Dipendenza logica</strong> — A2 presuppone A1, non viceversa.</p>
          <p style="font-size: 0.85rem; color: var(--corso-text-muted); margin: 0; text-align: right;"><strong>≠ Sequenza temporale</strong> — tutti e sei gli assi sono attivi simultaneamente.</p>
        </div>
      `,
      notes:
        "Una conseguenza pratica: chi osserva A6 (partecipazione al mondo culturale) sta implicitamente presupponendo A1-A5 come condizioni di sfondo. Se A1 è fragile in quel campo, l'accesso a A6 sarà compromesso — indipendentemente dalle «competenze culturali» del bambino.",
    },

    // ─── 2.3 ──────────────────────────────────────────────
    {
      id: 'm02-s03',
      type: 'interactive',
      title: 'Quattro proprietà degli assi',
      subtitle: "Come funzionano nell'architettura del modello",
      intro: `
        <p>Gli assi non sono entità isolate: hanno <strong>quattro proprietà sistemiche</strong> che ne governano l'uso. Conoscerle è la condizione per non farne un uso scorretto — anche quando le definizioni sembrano chiare.</p>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: PROPRIETA_CARDS,
        layout: 'grid',
        multiOpen: true,
      },
      content: `
        <hr class="corso-divider" />
        <p class="corso-emph corso-emph--center">Le quattro proprietà non sono indipendenti: la compresenza dipende dalla dipendenza strutturale; la variabilità relativa è possibile perché gli assi sono strutture non esclusive. Il sistema funziona come insieme.</p>
      `,
      notes:
        "Queste quattro proprietà tornano in ogni modulo successivo come criteri impliciti: quando un modulo mostra come un asse si manifesta in un contesto specifico, sta operando all'interno della variabilità relativa (proprietà 3) e della non-esclusività disciplinare (proprietà 4).",
    },

    // ─── 2.4 ──────────────────────────────────────────────
    {
      id: 'm02-s04',
      type: 'standard',
      title: 'Asse e competenza non sono la stessa cosa',
      subtitle: 'Una distinzione che cambia la forma degli strumenti',
      content: `
        <div class="corso-section">
          <p>La distinzione non è accademica. Molti strumenti usano il termine «dimensione dello sviluppo» per indicare ciò che funziona di fatto come competenza valutata su scala normativa. Lo strumento <em>sembra</em> leggere la struttura dello sviluppo, ma misura prestazioni e produce punteggi: il piano del giudizio normativo entra implicitamente nell'output.</p>
        </div>

        <table class="corso-table" style="margin-top: 12px;">
          <thead>
            <tr>
              <th style="width: 22%;">Dimensione</th>
              <th style="width: 39%;"><span style="display: inline-block; background: #6c63ff; color: white; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 3px; margin-right: 6px;">ASSE</span>Asse strutturale</th>
              <th style="width: 39%;"><span style="display: inline-block; background: #718096; color: white; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 3px; margin-right: 6px;">COMP</span>Competenza</th>
            </tr>
          </thead>
          <tbody>
            ${CONFRONTO_RIGHE.map((r) => {
              const isExample = r.id === 'r6';
              const rowStyle = isExample
                ? ' class="corso-table__row--highlight"'
                : '';
              return `<tr${rowStyle}><td><strong>${r.dimensione}</strong></td><td>${r.asse}</td><td>${r.competenza}</td></tr>`;
            }).join('')}
          </tbody>
        </table>

        <hr class="corso-divider" />

        <div class="corso-box" style="border-left: 4px solid #4a5568; background: var(--corso-surface); padding: 16px 20px; border-radius: var(--corso-radius-sm);">
          <p style="margin: 0; font-size: 1rem; line-height: 1.6;">La distinzione non è teorica: chi confonde asse e competenza costruisce strumenti che <em>sembrano</em> leggere la struttura dello sviluppo ma in realtà misurano prestazioni. Il risultato è normativo anche quando non si intende esserlo.</p>
        </div>
      `,
      notes:
        "Esercizio mentale: prendi qualsiasi strumento di valutazione dello sviluppo che hai usato. Chiedi: le sue «dimensioni» hanno soglie normative per età? Se sì, sono competenze — non assi strutturali. Il metodo non sostituisce quegli strumenti: costruisce un livello diverso, sopra e prima di essi.",
    },

    // ─── 2.5 ──────────────────────────────────────────────
    {
      id: 'm02-s05',
      type: 'interactive',
      title: 'I sei assi strutturali',
      subtitle: "Panoramica d'insieme prima dell'approfondimento",
      intro: `
        <p>I sei assi presentati come elenco apribile. Ogni asse mostra la <strong>domanda guida</strong> che lo rende interrogabile e — espandendolo — la sua funzione strutturale, le dipendenze e la lettura mono-registro tipica da cui aiuta a tenersi a distanza.</p>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: ASSE_CARDS,
        layout: 'vertical',
        defaultOpen: ['a1'],
      },
      content: `
        <p class="corso-narrative__caption" style="margin-top: 16px;">I moduli M3-M7 approfondiranno ciascun asse (o coppia di assi) con le letture per contesto professionale, i concetti-ponte e il caso-guida. Questa panoramica è il punto di partenza: torna qui se in un modulo successivo perdi il filo della gerarchia.</p>
      `,
      notes:
        "La domanda guida di ogni asse non è un indicatore da valutare: è la forma in cui l'asse diventa interrogabile da un professionista. Nei moduli successivi vedremo come da ciascuna domanda guida nascano domande professionali diverse nei contesti clinico, pedagogico, genitoriale e istituzionale.",
    },

    // ─── 2.6 ──────────────────────────────────────────────
    {
      id: 'm02-s06',
      type: 'diagram',
      title: 'Dalla fondazione agli strumenti',
      subtitle: 'La mediazione necessaria',
      intro: `
        <p>Gli assi non si trasformano direttamente in strumenti: passano attraverso un livello intermedio (i Nodi Trasversali e la Matrice di F2) che li rende leggibili nei contesti reali. Questa <strong>mediazione</strong> non è un limite tecnico — è la garanzia metodologica che la complessità ontologica non venga sacrificata alla misurabilità immediata.</p>
      `,
      content: `
        <div class="corso-cards corso-cards--vertical">
          ${MEDIAZIONE_LIVELLI.map((l, i) => {
            const isCurrent = l.id === 'l1';
            const arrow = i < MEDIAZIONE_LIVELLI.length - 1
              ? `<div style="text-align: center; color: var(--corso-text-muted); font-size: 0.85rem; margin: 4px 0; line-height: 1;">↓</div>`
              : '';
            const currentChip = isCurrent
              ? `<span style="display: inline-block; background: var(--corso-f1, #6c63ff); color: white; font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 3px; margin-left: 8px;">SIAMO QUI</span>`
              : '';
            return `
              <div class="corso-card corso-card--open" style="--corso-card-accent: ${l.colore};${isCurrent ? ' border-width: 2px;' : ''}">
                <div class="corso-card__head">
                  <span class="corso-card__badge" style="background: ${l.colore};">${l.livello}</span>
                  <span class="corso-card__title">${l.label}${currentChip}</span>
                </div>
                <div class="corso-card__body">
                  <p style="font-style: italic; color: var(--corso-text-2); margin: 0 0 8px;">${l.sublabel}</p>
                  <p style="margin: 0;">${l.descrizione}</p>
                </div>
              </div>
              ${arrow}
            `;
          }).join('')}
        </div>

        <hr class="corso-divider" />

        <div class="corso-fase-keywords" style="justify-content: center;">
          <span style="background: #6c63ff; color: white; padding: 6px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 700;">FONDA I VINCOLI</span>
          <span class="corso-fase-keywords__sep">→</span>
          <span style="background: #1a6b8a; color: white; padding: 6px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 700;">RENDE LEGGIBILE</span>
          <span class="corso-fase-keywords__sep">→</span>
          <span style="background: #2d9cdb; color: white; padding: 6px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 700;">RENDE POSSIBILE L'AZIONE</span>
        </div>

        <div class="corso-section" style="background: var(--corso-primary-light); border-left: 4px solid #4a5568; padding: 16px 20px; border-radius: var(--corso-radius-sm); margin-top: 20px;">
          <p style="margin: 0; line-height: 1.6;">La mediazione non è un limite tecnico del metodo: è una <strong>garanzia metodologica</strong>. Se gli assi si usassero direttamente come strumenti, la complessità ontologica dello sviluppo verrebbe sacrificata alla misurabilità immediata. La mediazione impedisce che questo accada.</p>
        </div>
      `,
      notes:
        "Questa slide anticipa l'intero percorso F1→F2→F3. Nei moduli successivi vedremo come gli assi si trasformano in condizioni di possibilità per i Nodi Trasversali di F2. Questa è la freccia che il corso F1 prepara: non ancora il passaggio, ma le fondamenta da cui il passaggio diventa possibile.",
    },

    // ─── 2.7 ──────────────────────────────────────────────
    {
      id: 'm02-s07',
      type: 'narrative',
      title: 'La scena e i sei assi',
      subtitle: 'Una prima lettura strutturata',
      content: `
        <div class="corso-scena" style="border-left: 4px solid var(--corso-primary); background: var(--corso-primary-light); padding: 18px 22px; border-radius: var(--corso-radius-sm);">
          <p style="font-style: italic; margin: 0; line-height: 1.7;">${CASO_GUIDA_F1.scena}</p>
        </div>

        <p class="corso-narrative__caption" style="margin: 8px 0 24px;">Il testo non cambia nei moduli successivi. Cambieranno le domande con cui lo guardiamo.</p>

        <h3 class="corso-narrative__h3">Cinque momenti, sei assi compresenti</h3>

        <div class="corso-cards corso-cards--vertical">
          ${ANNOTAZIONI_CASO_M2.map((a) => `
            <div class="corso-card corso-card--open" style="--corso-card-accent: #4a5568;">
              <div class="corso-card__body">
                <div style="margin-bottom: 8px;">
                  ${a.assiAttivi.map(asseBadge).join('')}
                </div>
                <p style="font-style: italic; color: var(--corso-text-2); margin: 0 0 8px;">«${a.estratto}»</p>
                <p style="margin: 0 0 8px;">${a.annotazione}</p>
                <p style="font-size: 0.82rem; color: var(--corso-text-muted); margin: 0;"><strong>Compresenza</strong> · ${a.notaCompresenza}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3" style="text-align: center;">In questa scena sono attivi:</h3>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 16px 0;">
          ${SEI_ASSI.map((a) => `<span style="display: inline-flex; align-items: center; gap: 6px; background: ${a.colore}; color: white; font-size: 0.82rem; font-weight: 600; padding: 6px 12px; border-radius: 6px;"><strong>A${a.numero}</strong> ${a.nomeBreve}</span>`).join('')}
        </div>

        <p class="corso-emph corso-emph--center" style="margin-top: 16px;">Non è una scena «ricca di stimoli» — è una scena in cui tutte le dimensioni strutturali dello sviluppo sono leggibili. Questo è ciò che la rende un caso-guida efficace.</p>

        <p class="corso-narrative__caption" style="text-align: center; margin-top: 24px;">Nei prossimi moduli ciascun asse verrà approfondito singolarmente. Ogni volta torneremo su questa scena con una sola lente — senza dimenticare che le altre cinque sono sempre attive.</p>

        <div style="text-align: center; margin-top: 20px;">
          <span style="display: inline-block; padding: 8px 16px; border: 1px solid var(--corso-border); border-radius: var(--corso-radius-sm); color: var(--corso-text-2); font-size: 0.9rem;">→ Modulo 3 — Asse 1: Abitare l'esperienza</span>
        </div>
      `,
      notes:
        "Questa lettura per annotazioni è volutamente parziale: non è un'analisi esaustiva della scena. È un'introduzione alla pratica della lettura per assi — che verrà approfondita, asse per asse, nei moduli M3-M6.",
    },
  ],
};
