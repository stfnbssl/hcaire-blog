import type {
  ExpandableCardData,
  GuardrailControl,
  Module,
} from '../types';
import { CASO_GUIDA_F1 } from '../caso-guida';

// =============================================================
// Dati globali del Modulo 1 — "Il bambino come soggetto"
// =============================================================

interface ImmagineBambino {
  id: string;
  etichetta: string;
  titolo: string;
  colore: string;
  sfondo: string;
  presupposto: string;
  conseguenzaStrumenti: string;
  notaProspettiva: string;
  esempio: string;
  isAdottata?: boolean;
}

const TRE_IMMAGINI_BAMBINO: ImmagineBambino[] = [
  {
    id: 'a',
    etichetta: 'A',
    titolo: "L'organismo che accumula competenze",
    colore: '#e74c3c',
    sfondo: '#fdecea',
    presupposto:
      "Lo sviluppo è un processo di accumulo progressivo: competenze, capacità, prestazioni. Il bambino cresce aggiungendo — e ciò che non ha ancora è ciò che deve acquisire.",
    conseguenzaStrumenti:
      "Gli strumenti misurano ciò che c'è e ciò che manca rispetto a una norma di riferimento. Il confronto con soglie è strutturale: senza normativa, lo strumento non funziona.",
    notaProspettiva:
      "Lo sguardo si dispone naturalmente verso la distanza dalla norma. La domanda implicita tende a essere «ce la fa?» o «è in ritardo?», anche quando il professionista non vorrebbe formularla così.",
    esempio:
      "«Ha un vocabolario di 50 parole a 18 mesi, nella norma.» — La descrizione è quantitativa e normativa: utile per il piano del monitoraggio, ma non dice come l'esperienza linguistica del bambino prende forma in quel campo.",
  },
  {
    id: 'b',
    etichetta: 'B',
    titolo: "L'insieme di funzioni in maturazione",
    colore: '#e67e22',
    sfondo: '#fef3e2',
    presupposto:
      "Lo sviluppo è il dispiegarsi sequenziale di funzioni relativamente autonome: motricità, linguaggio, cognizione, emozione. Ognuna ha la sua traiettoria, i suoi indicatori, i suoi specialisti.",
    conseguenzaStrumenti:
      "Gli strumenti sono settoriali per costruzione: valutano una funzione per volta. L'integrazione fra domini è un passaggio aggiunto successivamente, non una struttura originaria.",
    notaProspettiva:
      "Lo sguardo si organizza per profili funzionali. Un bambino reale non vive separatamente il piano linguistico e quello relazionale, ma gli strumenti li trattano come dimensioni indipendenti — l'integrazione è un compito che ricade poi sul professionista.",
    esempio:
      "«Buona cognizione, linguaggio nella norma bassa, qualche difficoltà motoria.» — Tre profili paralleli, ciascuno informativo nel proprio dominio. La configurazione complessiva del bambino-in-situazione non viene tematizzata da nessuno dei tre.",
  },
  {
    id: 'c',
    etichetta: 'C',
    titolo: 'Il soggetto incarnato, temporale e relazionale',
    colore: '#6c63ff',
    sfondo: '#f0eeff',
    presupposto:
      "Lo sviluppo è la traiettoria aperta di un soggetto incarnato in un campo di esperienze e relazioni. Non si accumula e non matura: diviene, attraverso un campo che è condizione strutturale del suo divenire.",
    conseguenzaStrumenti:
      "Gli strumenti leggono configurazioni relazionali ed esperienziali. Non confrontano con norma: descrivono la forma che l'esperienza ha assunto in un momento dato, in quel campo, con quegli adulti. Possono farlo senza punteggi, senza soglie, senza diagnosi.",
    notaProspettiva:
      "Questa è l'assunzione su cui poggia tutto il progetto. Le immagini A e B restano rilevanti perché sono presenti — implicitamente o esplicitamente — in molti strumenti in uso: riconoscerle è la condizione per poterle integrare.",
    esempio:
      "«Il bambino e il genitore costruiscono un campo di scambio simbolico attorno al libro. La condivisione è presente ma dipende fortemente dalla risposta adulta: configurazione evolutivamente aperta.» — Strutturale, relazionale, non normativa.",
    isAdottata: true,
  },
];

const TRE_IMMAGINI_CARDS: ExpandableCardData[] = TRE_IMMAGINI_BAMBINO.map((im) => ({
  id: im.id,
  badge: im.etichetta,
  color: im.colore,
  title: im.titolo,
  summary: im.presupposto,
  detail: `
    <div class="corso-section" style="background: ${im.sfondo}; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Cosa assume</p>
      <p style="margin: 0;">${im.presupposto}</p>
    </div>
    <div class="corso-section" style="margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Cosa produce</p>
      <p style="margin: 0;">${im.conseguenzaStrumenti}</p>
    </div>
    <div class="corso-section" style="background: ${im.isAdottata ? '#e8f8f5' : im.sfondo}; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">${im.isAdottata ? 'Assunzione adottata' : 'Cosa resta in ombra'}</p>
      <p style="margin: 0;">${im.notaProspettiva}</p>
    </div>
    <div class="corso-section" style="background: var(--corso-primary-light); padding: 14px 18px; border-radius: var(--corso-radius-sm);">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Esempio</p>
      <p style="margin: 0; font-style: italic;">${im.esempio}</p>
    </div>
  `,
}));

// ─────────────────────────────────────────────────────────────
// Tre dimensioni del soggetto — usate dalle slide 1.2/1.3/1.4
// ─────────────────────────────────────────────────────────────

interface DimensioneSoggetto {
  id: 'incarnato' | 'temporale' | 'relazionale';
  nome: string;
  colore: string;
  titoloParziale: string;
  titoloOntologico: string;
  testoParziale: string;
  testoOntologico: string;
  conseguenza: string;
  esempioCaso: string;
}

const DIMENSIONI_SOGGETTO: DimensioneSoggetto[] = [
  {
    id: 'incarnato',
    nome: 'Incarnato',
    colore: '#5c35a0',
    titoloParziale: 'Il corpo come strumento',
    titoloOntologico: 'Il corpo come modo di essere nel mondo',
    testoParziale:
      "Il bambino usa il corpo per percepire, per agire, per comunicare. Il corpo è il mezzo attraverso cui le funzioni cognitive, linguistiche ed emotive si esprimono verso il mondo esterno.",
    testoOntologico:
      "Il bambino è il suo corpo in relazione. Il corpo non è lo strumento dell'esperienza — è la condizione dell'esperienza. Non c'è un «bambino» separato dal corpo che lo abita: c'è un soggetto incarnato che esiste nel mondo attraverso il proprio corpo, prima ancora di agire su di esso.",
    conseguenza:
      "Una formulazione che separa il «bambino» dal suo corpo (es. «ha buone capacità cognitive nonostante la difficoltà motoria») opera una distinzione utile sul piano funzionale, ma non corrisponde al modo in cui il soggetto reale vive l'esperienza. Il corpo non è un piano tecnico accanto agli altri: è il soggetto stesso in una delle sue dimensioni costitutive.",
    esempioCaso:
      "Nella scena di lettura: la postura orientata verso il libro, il gesto dell'indicare, il voltarsi verso l'adulto — non sono comportamenti che il bambino produce: sono il modo in cui il bambino è presente in quel campo.",
  },
  {
    id: 'temporale',
    nome: 'Temporale',
    colore: '#5c35a0',
    titoloParziale: 'Lo sviluppo come accumulo nel tempo',
    titoloOntologico: 'Lo sviluppo come traiettoria aperta',
    testoParziale:
      "Lo sviluppo avviene nel tempo: il bambino cresce, acquisisce, progredisce. Il tempo è lo sfondo in cui le competenze si accumulano e le funzioni si dispiegano. Si può misurare a che punto è arrivato.",
    testoOntologico:
      "Il bambino è temporale: la sua esistenza si costituisce nel tempo come apertura verso possibilità future non ancora determinate. Non c'è una forma di arrivo rispetto a cui misurare il presente. Nessuna configurazione evolutiva è definitiva. Lo sviluppo non produce un prodotto finale — produce traiettorie, sempre aperte, sempre reversibili, sempre situate.",
    conseguenza:
      "Non esiste una «forma finale» rispetto a cui misurare il bambino presente. Ogni configurazione è situata nel tempo e nello spazio relazionale. La lettura non è un bilancio di accumulo: è la descrizione di una traiettoria in un momento.",
    esempioCaso:
      "Il bambino di 20 mesi nella scena: la sua capacità di condividere il simbolico non è una tappa raggiunta o mancata — è una configurazione che si sta organizzando, in questo campo, con questo adulto, in questo momento. Potrebbe essere diversa domani.",
  },
  {
    id: 'relazionale',
    nome: 'Relazionale',
    colore: '#5c35a0',
    titoloParziale: 'Il campo relazionale come sfondo',
    titoloOntologico: 'Il campo relazionale come condizione strutturale',
    testoParziale:
      "Il bambino si sviluppa in un contesto relazionale. Le relazioni influenzano, supportano o ostacolano lo sviluppo. L'ambiente affettivo è importante — ma il bambino rimane l'unità di analisi: si può valutarlo anche da solo, anche senza il genitore, anche in una stanza standardizzata.",
    testoOntologico:
      "Il bambino non si sviluppa nonostante il campo relazionale — si sviluppa attraverso di esso come condizione strutturale. Il campo non è lo sfondo su cui il bambino si muove: è la condizione di possibilità del suo sviluppo. Non c'è un soggetto separabile dal campo: c'è sempre un soggetto-in-relazione.",
    conseguenza:
      "L'oggetto di osservazione pertinente non è il bambino isolato, ma la configurazione relazionale ed esperienziale in cui il bambino esiste. Una lettura che non include il campo relazionale come parte dell'oggetto di osservazione non è scorretta in sé — ma poggia su un'ontologia diversa da quella del progetto, e produce informazioni di natura differente.",
    esempioCaso:
      "Nella scena di lettura: non «il bambino indica una figura» ma «il bambino indica in un campo in cui l'adulto è disponibile alla risposta». La struttura dell'azione cambia a seconda di come è fatto il campo.",
  },
];

const DIM_BREADCRUMB_STEPS = [
  { id: 'incarnato', label: 'Incarnato' },
  { id: 'temporale', label: 'Temporale' },
  { id: 'relazionale', label: 'Relazionale' },
];

// ─────────────────────────────────────────────────────────────
// Conseguenze operative — slide 1.5
// ─────────────────────────────────────────────────────────────

interface ConseguenzaOperativa {
  id: string;
  dimensione: string;
  parziale: string;
  ontologico: string;
  esempio: string;
}

const CONSEGUENZE_OPERATIVE: ConseguenzaOperativa[] = [
  {
    id: 'co1',
    dimensione: 'Cosa si osserva',
    parziale:
      "Il bambino: le sue prestazioni, i suoi comportamenti, le sue risposte agli stimoli. L'adulto è considerato variabile di contesto.",
    ontologico:
      "La configurazione relazionale ed esperienziale: come bambino e adulto co-costruiscono il campo, come l'esperienza si organizza, qual è la qualità dello scambio. L'adulto è parte strutturale dell'oggetto di osservazione.",
    esempio:
      "Non «quante parole produce a 18 mesi», ma «come si organizza lo scambio simbolico fra questo bambino e questo adulto in questa situazione».",
  },
  {
    id: 'co2',
    dimensione: 'Come si costruisce uno strumento',
    parziale:
      "Si operazionalizzano le competenze da misurare, si definiscono soglie normative di riferimento, si producono punteggi comparabili. La norma è il cuore dello strumento.",
    ontologico:
      "Si costruiscono strutture di lettura che descrivono configurazioni senza soglie né punteggi. La domanda è «che forma ha l'esperienza in questo campo?» — non «quanto è sviluppato il bambino rispetto alla norma?».",
    esempio:
      "Non una checklist di competenze con range normativi, ma un operatore di lettura che descrive la qualità del campo bambino-adulto e le sue condizioni di abitabilità.",
  },
  {
    id: 'co3',
    dimensione: 'Come si restituisce',
    parziale:
      "«Il bambino è nella norma / mostra un ritardo in… / ha raggiunto le tappe attese.» Il riferimento implicito è una norma esterna; la formulazione descrive il bambino in termini di distanza da una soglia.",
    ontologico:
      "«In questa situazione, il campo mostra… Bambino e genitore costruiscono uno scambio caratterizzato da… La configurazione è evolutivamente aperta perché…» Il riferimento è la struttura del campo, non una norma astratta.",
    esempio:
      "Non «competenza linguistica nella norma bassa», ma «lo scambio simbolico è presente ma dipende fortemente dalla risposta adulta: la condivisione è accessibile ma fragile in assenza di sostegno».",
  },
  {
    id: 'co4',
    dimensione: 'Cosa si tiene fuori',
    parziale:
      "Il piano della valutazione normativa porta con sé un giudizio implicito: ogni confronto con la norma produce una distanza, e quindi una valutazione di adeguatezza. Il professionista si trova spesso a fungere da custode di soglie, anche quando non è il suo compito.",
    ontologico:
      "Nessun output descrive il bambino in termini di distanza da una norma. Nessun output prescrive cosa fare. Il professionista resta lettore di configurazioni e di traiettorie evolutive; la decisione operativa appartiene alla sua disciplina, non al metodo.",
    esempio:
      "Il pediatra non chiude il bilancio con «nella norma» o «da monitorare»: apre una descrizione di come lo sviluppo si sta organizzando in quel campo relazionale, e tiene la decisione operativa nello spazio della propria responsabilità clinica.",
  },
];

const CONSEGUENZE_CARDS: ExpandableCardData[] = CONSEGUENZE_OPERATIVE.map((c) => ({
  id: c.id,
  badge: c.id.toUpperCase(),
  color: '#5c35a0',
  title: c.dimensione,
  summary: '',
  detail: `
    <div class="corso-two-col" style="margin-bottom: 12px;">
      <div class="corso-box corso-box--invalid">
        <div class="corso-box__title">Con le immagini A–B</div>
        <p>${c.parziale}</p>
      </div>
      <div class="corso-box corso-box--valid" style="border-color: #5c35a0; background: #f0eeff;">
        <div class="corso-box__title" style="color: #5c35a0;">Con l'immagine C</div>
        <p>${c.ontologico}</p>
      </div>
    </div>
    <div class="corso-section" style="background: var(--corso-primary-light); padding: 12px 16px; border-radius: var(--corso-radius-sm);">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Esempio del cambiamento</p>
      <p style="margin: 0; font-style: italic;">${c.esempio}</p>
    </div>
  `,
}));

// ─────────────────────────────────────────────────────────────
// Scene HTML pre-costruito per la slide 1.6 — annotazioni cliccabili
// ─────────────────────────────────────────────────────────────

const SCENA_M16_HTML = `
  <p>Durante un bilancio di salute, il pediatra propone per alcuni minuti una breve situazione di lettura condivisa. Il bambino ha circa 18-24 mesi. È presente un genitore. Sul tavolo c'è un piccolo libro illustrato con immagini semplici: animali, oggetti familiari, figure umane.</p>
  <p><span class="corso-anno" data-anno-id="a1">Il bambino prende il libro</span>, lo apre, guarda alcune immagini, <span class="corso-anno" data-anno-id="a2">indica una figura, vocalizza qualcosa e guarda l'adulto</span>. <span class="corso-anno" data-anno-id="a3">Il genitore nomina l'immagine, sorride, aspetta</span>. <span class="corso-anno" data-anno-id="a4">Il bambino torna a guardare il libro, gira pagina</span>, <span class="corso-anno" data-anno-id="a5">poi mostra un'altra figura all'adulto</span>.</p>
`;

// ─────────────────────────────────────────────────────────────
// Guardrail fondativo — slide 1.7
// ─────────────────────────────────────────────────────────────

const GUARDRAIL_M1: GuardrailControl = {
  ...CASO_GUIDA_F1.guardrail,
};

const GUARDRAIL_VIOLAZIONI: string[] = [
  '«Il bambino ha un vocabolario di X parole.» — Descrive la prestazione linguistica isolata dal campo in cui il linguaggio emerge e viene usato.',
  '«Il bambino è poco collaborativo.» — Attribuisce un tratto stabile all\'individuo senza descrivere la configurazione relazionale in cui si trova.',
  '«Sviluppo cognitivo nella norma.» — Isola una funzione dal soggetto incarnato che la vive in un campo specifico.',
];

const GUARDRAIL_RISPETTO: string[] = [
  '«In questa situazione, il campo permette al bambino di condividere un oggetto simbolico con l\'adulto.» — Descrive la configurazione relazionale.',
  '«La sequenza di scambio si mantiene quando l\'adulto risponde in modo non direttivo.» — Specifica le condizioni del campo.',
  '«La regolazione dell\'esperienza dipende fortemente dalla presenza adulta: non è ancora autosufficiente.» — Legge il campo, non il bambino isolato.',
];

// =============================================================
// Modulo 1 — Slide
// =============================================================

export const Module01: Module = {
  id: 'm01',
  number: 1,
  title: 'Il bambino come soggetto',
  shortTitle: 'Soggetto',
  accent: '#5c35a0',
  slides: [
    // ─── 1.1 ──────────────────────────────────────────────
    {
      id: 'm01-s01',
      type: 'interactive',
      title: 'Tre immagini del bambino',
      subtitle: 'Prima di costruire strumenti: cosa si assume?',
      intro: `
        <p>Le immagini <strong>A</strong> e <strong>B</strong> descrivono assunzioni diffuse, presenti — implicitamente o esplicitamente — in molti strumenti attualmente in uso. L'immagine <strong>C</strong> è l'assunzione che questo corso costruirà. <em>Apri le tre card in sequenza per confrontarle.</em></p>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: TRE_IMMAGINI_CARDS,
        layout: 'horizontal',
        defaultOpen: ['a'],
      },
      notes:
        "Queste non sono posizioni teoriche equivalenti. Il progetto adotta la terza. Le prime due restano rilevanti perché sono le assunzioni implicite di molti strumenti attualmente in uso: riconoscerle è la condizione per poterle integrare.",
    },

    // ─── 1.2 ──────────────────────────────────────────────
    {
      id: 'm01-s02',
      type: 'comparison',
      title: 'Incarnato',
      subtitle: 'Il corpo come modo di essere nel mondo',
      dimensionBreadcrumb: { steps: DIM_BREADCRUMB_STEPS, currentId: 'incarnato' },
      intro: `
        <p>Due modi di pensare il rapporto fra il bambino e il proprio corpo. Non si escludono — il primo descrive il piano funzionale, il secondo il piano ontologico. Il progetto adotta il secondo come condizione strutturale.</p>
      `,
      comparison: {
        valid: {
          title: DIMENSIONI_SOGGETTO[0].titoloOntologico,
          content: `<p>${DIMENSIONI_SOGGETTO[0].testoOntologico}</p>`,
        },
        invalid: {
          title: DIMENSIONI_SOGGETTO[0].titoloParziale,
          content: `<p>${DIMENSIONI_SOGGETTO[0].testoParziale}</p>`,
        },
      },
      content: `
        <hr class="corso-divider" />
        <div class="corso-two-col">
          <div class="corso-box corso-box--valid" style="border-color: #5c35a0; background: #f0eeff;">
            <div class="corso-box__title" style="color: #5c35a0;">Cosa cambia nel lavoro</div>
            <p>${DIMENSIONI_SOGGETTO[0].conseguenza}</p>
          </div>
          <div class="corso-box" style="border-left: 3px solid #d35400; background: #fef5ec; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #d35400;">Nel caso-guida</div>
            <p style="font-style: italic;">${DIMENSIONI_SOGGETTO[0].esempioCaso}</p>
          </div>
        </div>
      `,
      notes:
        "La distinzione non è solo concettuale: orienta cosa si chiede in una valutazione, come si scrive una restituzione, cosa si considera rilevante osservare. Un bambino «con difficoltà motorie» e un bambino «il cui corpo fatica a organizzarsi nella relazione» sono la stessa persona descritta con due ontologie diverse.",
    },

    // ─── 1.3 ──────────────────────────────────────────────
    {
      id: 'm01-s03',
      type: 'standard',
      title: 'Temporale',
      subtitle: 'Lo sviluppo come traiettoria aperta',
      dimensionBreadcrumb: { steps: DIM_BREADCRUMB_STEPS, currentId: 'temporale' },
      content: `
        <div class="corso-two-col">
          <div class="corso-col">
            <div class="corso-box" style="border-left: 3px solid #718096; background: #f5f6f8; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
              <div class="corso-box__title" style="color: #4a5568;">Accumulo</div>
              <p>${DIMENSIONI_SOGGETTO[1].testoParziale}</p>
            </div>
            <div class="corso-box corso-box--valid" style="border-color: #5c35a0; background: #f0eeff;">
              <div class="corso-box__title" style="color: #5c35a0;">Traiettoria</div>
              <p>${DIMENSIONI_SOGGETTO[1].testoOntologico}</p>
            </div>
          </div>
          <div class="corso-col">
            <div class="corso-section" style="background: var(--corso-surface); border: 1px solid var(--corso-border); border-radius: var(--corso-radius-md); padding: 20px;">
              <p style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 8px;">Accumulo lineare</p>
              <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; margin: 4px 0;">●──●──●──●──● → forma finale</p>
              <p style="font-size: 0.78rem; color: var(--corso-text-muted); margin: 0 0 18px;">Tappa raggiunta · tappa mancata</p>
              <hr class="corso-divider" />
              <p style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 12px 0 8px;">Traiettoria aperta</p>
              <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; margin: 4px 0;">─────╮      ╭──→ ?</p>
              <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; margin: 4px 0;">          ╰──┤</p>
              <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; margin: 4px 0;">              ╰──→ ?</p>
              <p style="font-size: 0.78rem; color: var(--corso-text-muted); margin: 8px 0 0;">Configurazione in movimento — nessun punto di arrivo</p>
            </div>
          </div>
        </div>

        <hr class="corso-divider" />

        <div class="corso-cards corso-cards--grid">
          <div class="corso-card corso-card--open" style="--corso-card-accent: #5c35a0;">
            <div class="corso-card__head"><span class="corso-card__title">Nessuna configurazione è definitiva</span></div>
            <div class="corso-card__body"><p>Reversibile, dinamica, situata. La lettura di oggi non descrive il bambino: descrive il campo in questo momento.</p></div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #5c35a0;">
            <div class="corso-card__head"><span class="corso-card__title">Non c'è una forma di arrivo</span></div>
            <div class="corso-card__body"><p>Nessuno strumento può misurare la distanza da un'architettura che non esiste. La domanda «è in ritardo?» presuppone una linea di arrivo che il modello non ammette.</p></div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #5c35a0;">
            <div class="corso-card__head"><span class="corso-card__title">Il tempo non è sfondo, è struttura</span></div>
            <div class="corso-card__body"><p>Il bambino non si sviluppa nel tempo come in un contenitore: la temporalità è una dimensione costitutiva del suo essere soggetto.</p></div>
          </div>
        </div>

        <div class="corso-box" style="border-left: 3px solid #d35400; background: #fef5ec; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-top: 16px;">
          <div class="corso-box__title" style="color: #d35400;">Nel caso-guida</div>
          <p style="font-style: italic;">${DIMENSIONI_SOGGETTO[1].esempioCaso}</p>
        </div>
      `,
      notes:
        "L'apertura della traiettoria non è una limitazione degli strumenti — è una proprietà dello sviluppo. Il metodo non rinuncia alla precisione: rinuncia alla normatività. Le descrizioni sono precise, strutturate e metodicamente fondate — ma non misurano distanze da un'architettura di arrivo che non esiste.",
    },

    // ─── 1.4 ──────────────────────────────────────────────
    {
      id: 'm01-s04',
      type: 'standard',
      title: 'Relazionale',
      subtitle: 'Il campo relazionale come condizione strutturale',
      dimensionBreadcrumb: { steps: DIM_BREADCRUMB_STEPS, currentId: 'relazionale' },
      content: `
        <blockquote class="corso-blockquote" style="border-left-color: #5c35a0; background: #f0eeff; font-size: 1.2rem; line-height: 1.6;">
          «Il bambino non si sviluppa nonostante il campo relazionale, né attraverso di esso come se fosse un ambiente separato: si sviluppa costitutivamente come <strong>soggetto-in-relazione</strong>.»
        </blockquote>

        <div class="corso-two-col">
          <div class="corso-box" style="border-left: 3px solid #e74c3c; background: #fdecea; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #c0392b;">Il campo come sfondo</div>
            <p>${DIMENSIONI_SOGGETTO[2].testoParziale}</p>
          </div>
          <div class="corso-box corso-box--valid" style="border-color: #5c35a0; background: #f0eeff;">
            <div class="corso-box__title" style="color: #5c35a0;">Il campo come condizione strutturale</div>
            <p>${DIMENSIONI_SOGGETTO[2].testoOntologico}</p>
          </div>
        </div>

        <hr class="corso-divider" />

        <div class="corso-section" style="background: var(--corso-primary-light); border-left: 4px solid #5c35a0; padding: 20px 24px; border-radius: var(--corso-radius-sm);">
          <p style="margin: 0; font-size: 1.05rem; line-height: 1.6;">L'oggetto di osservazione pertinente non è il bambino isolato, ma la <strong>configurazione relazionale ed esperienziale</strong> in cui il bambino esiste. Una lettura che non include il campo relazionale come parte dell'oggetto di osservazione non è scorretta in sé — ma poggia su un'ontologia diversa da quella del progetto, e produce informazioni di natura differente.</p>
        </div>

        <div class="corso-box" style="border-left: 3px solid #d35400; background: #fef5ec; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-top: 16px;">
          <div class="corso-box__title" style="color: #d35400;">Nel caso-guida</div>
          <p style="font-style: italic;">${DIMENSIONI_SOGGETTO[2].esempioCaso}</p>
        </div>
      `,
      guardrail: GUARDRAIL_M1,
      notes:
        "Questa non è un'indicazione di stile, ma una condizione strutturale del metodo: vale sempre. Una lettura che esclude il campo relazionale produce un altro tipo di informazione — utile per altri scopi, ma non sostituibile a quella che il progetto vuole costruire.",
    },

    // ─── 1.5 ──────────────────────────────────────────────
    {
      id: 'm01-s05',
      type: 'interactive',
      title: 'Cosa cambia nella pratica',
      subtitle: "Dall'ontologia all'osservazione, agli strumenti, alla restituzione",
      intro: `
        <p>Quattro dimensioni in cui l'assunzione ontologica si traduce in pratica professionale. Espandi ogni card per vedere il confronto fra le due prospettive e un esempio del cambiamento.</p>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: CONSEGUENZE_CARDS,
        layout: 'vertical',
        multiOpen: true,
      },
      content: `
        <hr class="corso-divider" />
        <p class="corso-emph corso-emph--center">Queste quattro dimensioni non sono modifiche superficiali di linguaggio. Richiedono uno strumento costruito su basi diverse — un framework diverso. Questo è esattamente ciò che il metodo costruisce.</p>
      `,
      notes:
        "Le conseguenze operative non emergono automaticamente dall'assunzione ontologica: richiedono che la Fase 2 costruisca gli strumenti di traduzione (Nodi, Matrice, Grammatica) e la Fase 3 li renda operativi nei contesti professionali. M1 stabilisce il punto di partenza; il resto del corso costruirà il percorso.",
    },

    // ─── 1.6 ──────────────────────────────────────────────
    {
      id: 'm01-s06',
      type: 'narrative',
      title: 'Il bambino come soggetto',
      subtitle: 'La stessa scena, letta con lenti diverse',
      interactive: {
        kind: 'annotated-scene',
        sceneHtml: SCENA_M16_HTML,
        annotations: CASO_GUIDA_F1.annotazioni,
        istruzione: 'Clicca sulle parole evidenziate per vedere come si leggono le tre dimensioni del soggetto.',
      },
      content: `
        <hr class="corso-divider" />
        <h3 class="corso-narrative__h3">Due letture a confronto</h3>
        <div class="corso-two-col">
          <div class="corso-box" style="border-left: 3px solid #e74c3c; background: #fdecea; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #c0392b;">Lettura mono-registro</div>
            <p style="font-style: italic;">${CASO_GUIDA_F1.lettura_parziale}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
              ${CASO_GUIDA_F1.chip_parziali.map((c) => `<span style="background: ${c.color}; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">${c.label}</span>`).join('')}
            </div>
          </div>
          <div class="corso-box corso-box--valid" style="border-color: #5c35a0; background: #f0eeff;">
            <div class="corso-box__title" style="color: #5c35a0;">Lettura ontologica</div>
            <p style="font-style: italic;">${CASO_GUIDA_F1.lettura_ontologica}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
              ${CASO_GUIDA_F1.chip_ontologici.map((c) => `<span style="background: ${c.color}; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">${c.label}</span>`).join('')}
            </div>
          </div>
        </div>
      `,
      notes:
        "Questo sarà il modo in cui il caso-guida ci accompagnerà per tutti e sette i moduli di F1: la stessa scena, riluminata ogni volta da una lente diversa. Non si aggiunge contenuto alla scena — si cambia la domanda con cui la si guarda.",
    },

    // ─── 1.7 ──────────────────────────────────────────────
    {
      id: 'm01-s07',
      type: 'standard',
      title: 'Il guardrail che attraversa tutto il corso',
      subtitle: 'Una regola strutturale, non un\'indicazione di stile',
      content: `
        <div class="corso-section" style="background: #d8f3dc; border-left: 5px solid #2d6a4f; padding: 24px 28px; border-radius: var(--corso-radius-md); margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <span style="background: #2d6a4f; color: white; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 10px; border-radius: 4px;">${GUARDRAIL_M1.code}</span>
            <span style="font-size: 1.05rem; font-weight: 600; color: #1b4332;">${GUARDRAIL_M1.label}</span>
          </div>
          <p style="margin: 0; font-size: 1.05rem; line-height: 1.6; color: #1b4332;">${GUARDRAIL_M1.text}</p>
        </div>

        <div class="corso-two-col">
          <div class="corso-box corso-box--invalid">
            <div class="corso-box__title">Formulazioni che il guardrail intercetta</div>
            <ul>
              ${GUARDRAIL_VIOLAZIONI.map((v) => `<li>${v}</li>`).join('')}
            </ul>
          </div>
          <div class="corso-box corso-box--valid">
            <div class="corso-box__title">Formulazioni coerenti con il guardrail</div>
            <ul>
              ${GUARDRAIL_RISPETTO.map((v) => `<li>${v}</li>`).join('')}
            </ul>
          </div>
        </div>

        <hr class="corso-divider" />

        <p class="corso-emph corso-emph--center">Il guardrail non è una raccomandazione di buona prassi: è un vincolo strutturale che deriva dall'ontologia del soggetto stabilita in questo modulo. Ogni strumento costruito nel framework — in F2 come in F3 — viene verificato rispetto a esso.</p>

        <p class="corso-narrative__caption" style="text-align: center; margin-top: 12px;">Nei moduli successivi vedremo come questo vincolo si traduce nei sei assi strutturali di sviluppo — e come ciascun asse porta con sé il proprio guardrail specifico.</p>

        <div style="text-align: center; margin-top: 24px;">
          <span style="display: inline-block; padding: 8px 16px; border: 1px solid var(--corso-border); border-radius: var(--corso-radius-sm); color: var(--corso-text-2); font-size: 0.9rem;">→ Modulo 2 — Gli assi strutturali: logica e architettura</span>
        </div>
      `,
      guardrail: GUARDRAIL_M1,
      notes:
        "Il guardrail G-F1 agisce come vincolo di coerenza su tutto il framework: dal primo asse strutturale (M3) all'ultimo strumento operativo (F3). Ogni volta che uno strumento descrive il bambino come individuo isolato — senza campo, senza relazione, senza contesto — è questo vincolo a segnalare lo scarto.",
    },
  ],
};
