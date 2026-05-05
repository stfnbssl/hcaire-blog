import { Module } from '../types';
import { CASO_GUIDA_F3 } from '../caso-guida';

// ─── Dati globali del modulo ─────────────────────────────────────────────

interface PipelineStepData {
  id: string;
  label: string;
  sublabel: string;
  type: 'foundation' | 'operator' | 'output';
  color: string;
  fase: 'F2' | 'F3';
  approfondito?: string;
  descrizione: string;
  casoGuida: string;
}

const PIPELINE_F3: PipelineStepData[] = [
  {
    id: 'osservazioni',
    label: '① Osservazioni',
    sublabel: 'La scena, il campo, il comportamento osservato',
    type: 'foundation',
    color: 'var(--corso-primary)',
    fase: 'F2',
    descrizione:
      "Il punto di partenza: ciò che è osservabile nel campo bambino-adulto-contesto. Non «il comportamento del bambino» come unità isolata — la configurazione dell'incontro. Cosa vedo? Cosa accade nel campo?",
    casoGuida:
      "Il bambino prende il libro, lo apre, guarda alcune immagini, indica una figura, vocalizza, guarda l'adulto. Il genitore nomina l'immagine, sorride, aspetta. Il bambino torna al libro, gira pagina, mostra un'altra figura. Contesto: bilancio pediatrico · bambino 18-24 mesi · 3-5 minuti.",
  },
  {
    id: 'operatore',
    label: '② Operatore di lettura',
    sublabel: 'Operatore triadico — Campo / Posizione / Limite',
    type: 'operator',
    color: 'var(--corso-f2)',
    fase: 'F2',
    descrizione:
      'Lo strumento concettuale prodotto in F2 che organizza le osservazioni. Tre dimensioni simultanee: Campo condiviso, Posizione soggettiva, Rapporto con il limite. Non è una griglia: è la forma in cui il professionista vede.',
    casoGuida:
      "Campo: bambino e adulto si orientano verso il libro come oggetto comune (gesto + sguardo + parola). Posizione: il bambino indica e mostra — c'è iniziativa soggettiva. Limite: il bambino accetta di condividere il controllo del libro; la sequenza si interrompe e riprende senza collasso.",
  },
  {
    id: 'ce',
    label: '③ Configurazione Evolutiva (CE)',
    sublabel: 'Struttura del campo: nodi · direzione · tenuta · abitabilità',
    type: 'operator',
    color: 'var(--corso-f2)',
    fase: 'F2',
    descrizione:
      "L'output della F2: la descrizione strutturale del campo. Non descrive il bambino: descrive la configurazione relazionale in cui il bambino esiste in quel momento. Contiene il materiale grezzo con cui F3 lavora.",
    casoGuida:
      'N1~ · N2↑ · N3~ · N4↓ · N5~ · N6~ · N7~  ·  R: N2→N3 (MED)  ·  D: ↗  ·  T: T2  ·  A: A±  ·  «Campo relazionale forte che sostiene accesso al mondo condiviso, con esplorazione ridotta ma in espansione. Configurazione fragile ma evolutivamente aperta.»',
  },
  {
    id: 'nodo-dominante',
    label: '④ Nodo dominante',
    sublabel: 'Non il nodo più basso — quello che muove di più il campo',
    type: 'operator',
    color: 'var(--corso-f3)',
    fase: 'F3',
    approfondito: 'M3',
    descrizione:
      "Il primo passo F3: identificare il nodo la cui attivazione produce il cambiamento più rilevante per l'abitabilità del campo nella direzione evolutiva indicata (D). Non è automatico: richiede lettura della CE per l'azione.",
    casoGuida:
      "N3 (Accesso al mondo condiviso simbolico). Non N4↓ — che ha lo stato più basso — perché in questo contesto e con questa direzione (D↗), è N3 la porta verso cui il campo si sta già muovendo. N2↑ è la risorsa di sostegno. N4↓ è una tensione da non esacerbare, non il punto di lavoro.",
  },
  {
    id: 'funzione',
    label: "⑤ Funzione dell'azione",
    sublabel: 'Stabilizzare / Ampliare / Mediare / Proteggere',
    type: 'operator',
    color: 'var(--corso-f3)',
    fase: 'F3',
    approfondito: 'M4',
    descrizione:
      'Il secondo passo F3: scegliere la funzione che il dispositivo svolge sul campo. Non si sceglie la tecnica — si sceglie la funzione. La funzione orienta tutta la costruzione del dispositivo. Approfondita nel Modulo 4.',
    casoGuida:
      'MEDIAZIONE — coordinare N2 (↑, risorsa) e N3 (~, zona di lavoro). Non stabilizzare: il campo non è in collasso (T2, non T0). Non ampliare: N4↓ sconsiglia di forzare ulteriore apertura. Mediare: sostenere la transizione già in corso N2→N3.',
  },
  {
    id: 'dispositivo',
    label: '⑥ Micro-dispositivo contestualizzato',
    sublabel: 'Breve · integrabile · non specialistico · osservabile',
    type: 'output',
    color: 'var(--corso-module-accent)',
    fase: 'F3',
    approfondito: 'M5',
    descrizione:
      'Il terzo passo F3: il dispositivo concreto che modifica il campo relazionale di esperienza. Nasce dalla funzione, non dalla tecnica. Deve soddisfare le tre proprietà (M1): breve e integrabile, non specialistico e reversibile, osservabile nei suoi effetti.',
    casoGuida:
      "Il genitore segue l'interesse del bambino, nomina ciò che indica, attende, espande senza correggere. Il pediatra osserva senza interrompere la sequenza. Tempo: 5 minuti nel bilancio pediatrico. Indicatore di risonanza: la sequenza bambino-adulto si allunga e il bambino include l'adulto con sguardo + gesto + vocalizzazione.",
  },
];

const LETTURA_CE_PER_AZIONE = [
  {
    id: 'sostenuto',
    elemento: 'Nodo ↑ (sostenuto)',
    chip: '↑',
    chipClass: 'up',
    colore: 'var(--corso-valid)',
    lettura_f2: 'Il campo regge su questa dimensione.',
    lettura_f3:
      'Risorsa disponibile — su cui costruire il dispositivo. Non è il punto di lavoro: è il terreno.',
    esempio:
      'N2↑ nel caso-guida: il campo relazionale è la risorsa che il dispositivo usa come leva.',
  },
  {
    id: 'neutro',
    elemento: 'Nodo ~ (neutro)',
    chip: '~',
    chipClass: 'neu',
    colore: 'var(--corso-warning)',
    lettura_f2: 'Il campo non è né rinforzato né limitato su questa dimensione.',
    lettura_f3:
      'Zona di possibile movimento — il candidato principale per il nodo dominante. È lo spazio in cui il campo può muoversi con un intervento lieve.',
    esempio:
      'N3~ nel caso-guida: la condivisione del mondo simbolico è presente ma non stabile. È qui che si lavora.',
  },
  {
    id: 'limitante',
    elemento: 'Nodo ↓ (limitante)',
    chip: '↓',
    chipClass: 'down',
    colore: 'var(--corso-invalid)',
    lettura_f2: 'Il campo è in tensione su questa dimensione.',
    lettura_f3:
      'Tensione da considerare — ma non necessariamente il punto di lavoro. Va tenuta presente per non esacerbarla con il dispositivo.',
    esempio:
      "N4↓ nel caso-guida: l'esplorazione è ridotta. Un dispositivo che sovraccarica il campo ridurrebbe ulteriormente N4. Va evitato, non «riparato».",
  },
  {
    id: 'r',
    elemento: 'Relazione dominante (R)',
    chip: 'R',
    chipClass: 'meta',
    colore: 'var(--corso-f2)',
    lettura_f2:
      "Il nodo che sostiene e il nodo che viene sostenuto: la direzione dell'energia del campo.",
    lettura_f3:
      "Orienta la scelta della funzione: se R è già N2→N3, la funzione è mediare quella transizione — non crearne un'altra.",
    esempio:
      'R: N2→N3 nel caso-guida suggerisce MEDIAZIONE: la risorsa (N2) sta già spingendo verso la zona di lavoro (N3).',
  },
  {
    id: 'd',
    elemento: 'Direzione (D)',
    chip: 'D',
    chipClass: 'meta',
    colore: 'var(--corso-f3)',
    lettura_f2:
      'La traiettoria evolutiva del campo: espansione ↗, contrazione ↙, stabilità →, incertezza ↔.',
    lettura_f3:
      'Vincolo sulla funzione: D↗ esclude stabilizzare come scelta principale. Il campo è già in espansione — si accompagna, non si ferma.',
    esempio:
      'D↗ nel caso-guida: il campo si sta espandendo. Stabilizzare sarebbe incongruente. Mediare è coerente con la direzione.',
  },
  {
    id: 't',
    elemento: 'Tenuta (T)',
    chip: 'T',
    chipClass: 'meta',
    colore: 'var(--corso-text-muted)',
    lettura_f2:
      'La solidità strutturale della configurazione: da T0 (collasso) a T3 (robusta).',
    lettura_f3:
      'Indica la fragilità del campo e orienta la scelta della funzione e della scala del dispositivo. T2 = fragile ma aperta: il dispositivo deve essere leggero, non destabilizzante.',
    esempio:
      'T2 nel caso-guida: la configurazione è fragile. Un micro-dispositivo lieve (5 minuti, modifica del ritmo) è appropriato. Un intervento intensivo sarebbe controindicato.',
  },
  {
    id: 'a',
    elemento: 'Abitabilità (A)',
    chip: 'A',
    chipClass: 'meta',
    colore: 'var(--corso-primary)',
    lettura_f2:
      "La qualità dell'esperienza nel campo: da A− (non abitabile) a A+ (pienamente abitabile).",
    lettura_f3:
      "Indica l'urgenza relativa dell'intervento. A± = abitabilità moderata: non è un'emergenza, ma c'è spazio e motivazione per intervenire.",
    esempio:
      'A± nel caso-guida: il campo è abbastanza abitabile da permettere una lettura condivisa. Non è in crisi — è un campo su cui un dispositivo leggero può fare differenza.',
  },
];

const CONFRONTO_ERRORE = {
  sinistra: [
    {
      sintomo: '«Il bambino non indica»',
      azione_errata: 'Training sul gesto di pointing',
      problema:
        'Il pointing è un fenomeno di superficie. Intervenire su di esso non tocca il nodo (N3) che lo rende possibile.',
    },
    {
      sintomo: '«Il bambino non parla ancora»',
      azione_errata: 'Stimolazione linguistica diretta',
      problema:
        'Il linguaggio emerge dallo scambio condiviso stabile. Lavorare sulla produzione verbale salta la configurazione che la produce.',
    },
    {
      sintomo: '«Il bambino è agitato durante la visita»',
      azione_errata: 'Strategie di gestione comportamentale',
      problema:
        "L'agitazione è la manifestazione di una configurazione (N1↓ in un campo non regolato). Gestire il comportamento non tocca la configurazione.",
    },
  ],
  destra: [
    {
      nodo: 'N3 (Mondo condiviso) ~ in campo con N2↑',
      colore: 'var(--corso-n3)',
      lettura:
        'Il gesto emerge quando il campo condiviso è stabile e sostenuto. La risorsa (N2) è già attiva.',
      azione:
        'Mediare: aumentare la stabilità dello scambio condiviso perché la sequenza bambino-adulto si allunghi.',
    },
    {
      nodo: 'N3 ~ con R: N2→N3 e D↗',
      colore: 'var(--corso-n3)',
      lettura:
        'Il campo si sta già muovendo nella direzione giusta. Il linguaggio verrà quando N3 si stabilizza.',
      azione:
        'Non stimolare la produzione verbale. Sostenere il campo in cui il linguaggio può emergere.',
    },
    {
      nodo: 'N1↓ in campo con T2',
      colore: 'var(--corso-n1)',
      lettura:
        'Il campo è fragile e la regolazione è sotto stress. Prima di qualsiasi altra cosa, il campo deve poter reggere.',
      azione:
        "Stabilizzare: agire su ritmo e prevedibilità dell'incontro prima di lavorare su qualsiasi altro nodo.",
    },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────

const pipelineHtml = (mode: 'abstract' | 'caso') => {
  const blocks = PIPELINE_F3.map((s, i) => {
    const isBoundary = i === 3; // entra in F3 al quarto step
    const fasiClass =
      s.fase === 'F2' ? 'corso-m2-pipe-step--f2' : 'corso-m2-pipe-step--f3';
    const text = mode === 'abstract' ? s.descrizione : s.casoGuida;
    const approfondito =
      mode === 'caso' && s.approfondito
        ? `<span class="corso-m2-pipe-step__appro">— Approfondito in ${s.approfondito}</span>`
        : '';
    const boundary = isBoundary
      ? `
        <div class="corso-m2-pipe-boundary">
          <span class="corso-m2-pipe-boundary__lab corso-m2-pipe-boundary__lab--top">F2 — prodotto nel corso precedente</span>
          <span class="corso-m2-pipe-boundary__line" aria-hidden="true"></span>
          <span class="corso-m2-pipe-boundary__lab corso-m2-pipe-boundary__lab--bot">F3 — stiamo costruendo questo</span>
        </div>
      `
      : '';
    return `
      ${boundary}
      <div class="corso-m2-pipe-step ${fasiClass} corso-m2-pipe-step--${s.type}" style="--corso-step-color: ${s.color};">
        <div class="corso-m2-pipe-step__head">
          <span class="corso-m2-pipe-step__badge">${s.label}</span>
          <span class="corso-m2-pipe-step__sub">${s.sublabel}</span>
        </div>
        <p class="corso-m2-pipe-step__text">${text}</p>
        <div class="corso-m2-pipe-step__foot">
          <span class="corso-m2-pipe-step__fase corso-m2-pipe-step__fase--${s.fase.toLowerCase()}">${s.fase}</span>
          ${approfondito}
        </div>
      </div>
    `;
  }).join('');

  const legend = `
    <div class="corso-m2-pipe-legend">
      <span class="corso-m2-pipe-legend__chip" style="--c: var(--corso-primary);">● Input</span>
      <span class="corso-m2-pipe-legend__chip" style="--c: var(--corso-f2);">● Operatori F2</span>
      <span class="corso-m2-pipe-legend__chip" style="--c: var(--corso-f3);">● Operatori F3</span>
      <span class="corso-m2-pipe-legend__chip" style="--c: var(--corso-module-accent);">● Output</span>
    </div>
  `;

  return `
    <div class="corso-m2-pipe ${mode === 'caso' ? 'corso-m2-pipe--caso' : 'corso-m2-pipe--abstract'}">
      ${blocks}
    </div>
    ${legend}
  `;
};

// ─── Modulo ──────────────────────────────────────────────────────────────

export const Module02: Module = {
  id: 'm02',
  number: 2,
  title: 'Dalla CE allo strumento',
  shortTitle: 'CE → strumento',
  accent: '#0e8f7f',
  slides: [
    // ─── 2.1 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m02-01',
      type: 'narrative',
      title: 'Un output che diventa un input',
      subtitle: 'Il passaggio F2 → F3',
      content: `
        <div class="corso-narrative corso-narrative--centered">
          <div class="corso-callout corso-callout--accent-f3">
            <p style="font-size: 1.15rem;"><em>Alla fine della Fase 2, il professionista ha in mano una Configurazione Evolutiva.</em></p>
            <p class="corso-callout__cta" style="font-size: 1.05rem;">Non è la fine di un percorso — è l'inizio di un altro.</p>
          </div>

          <div class="corso-m2-cebox-container">
            <div class="corso-m2-cebox-container__head">La CE contiene:</div>
            <div class="corso-two-col">
              <div class="corso-pane">
                <div class="corso-pane__eyebrow">Ciò che la CE descrive</div>
                <ul class="corso-arrow-list">
                  <li>Lo stato di ciascun nodo (↑ sostenuto · ~ neutro · ↓ limitante)</li>
                  <li>La relazione dominante tra nodi</li>
                  <li>La direzione evolutiva del campo</li>
                  <li>La tenuta strutturale e l'abitabilità</li>
                </ul>
              </div>
              <div class="corso-pane corso-pane--accent">
                <div class="corso-pane__eyebrow">Ciò che la CE non contiene ancora</div>
                <ul class="corso-arrow-list">
                  <li>Il nodo su cui intervenire</li>
                  <li>La funzione dell'azione</li>
                  <li>Il dispositivo contestualizzato</li>
                  <li>La decisione del professionista</li>
                </ul>
              </div>
            </div>
            <p class="corso-narrative__caption" style="text-align: center; margin-top: 14px; font-style: italic;">La CE produce leggibilità. F3 prende questa leggibilità e la trasforma in orientamento per l'azione.</p>
          </div>

          <blockquote class="corso-blockquote" style="border-left-color: var(--corso-f3); margin: 22px auto; max-width: 720px;">
            «Da questa configurazione, verso dove si può andare? Cosa nel campo può muoversi, con quale funzione, in quale direzione?»
          </blockquote>
          <p class="corso-narrative__caption" style="text-align: center;">Questa è la domanda che la pipeline F3 risponde — in tre passi.</p>
        </div>
      `,
      notes:
        'In questo modulo vediamo la pipeline nella sua struttura completa. I moduli 3, 4 e 5 approfondiscono ciascun passo.',
    },

    // ─── 2.2 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m02-02',
      type: 'diagram',
      title: 'La pipeline F3',
      subtitle: "Dall'osservazione al micro-dispositivo",
      content: `
        <p class="corso-narrative__caption" style="text-align: center; margin-bottom: 14px;">
          I sei passi della trasformazione: i primi tre sono prodotto della F2, gli ultimi tre sono il territorio della F3.
        </p>
        ${pipelineHtml('abstract')}
      `,
      notes:
        'I passi 1–3 sono il territorio della F2 — già percorso. I passi 4–6 sono il territorio della F3 — il corso da qui in poi.',
    },

    // ─── 2.3 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m02-03',
      type: 'interactive',
      title: 'La CE è un testo da leggere due volte',
      subtitle: "Cosa cerca F3 in una Configurazione Evolutiva",
      intro: `
        <div class="corso-m2-rule-intro">
          <p>F2 legge la CE per <strong>descrivere</strong> lo stato del campo.<br/>
          F3 rilegge la stessa CE per capire dove il campo può <strong>muoversi</strong>.</p>
          <p class="corso-emph corso-emph--center" style="font-style: italic;">Stessa CE. Due domande diverse. Due letture diverse.</p>
        </div>
      `,
      interactive: {
        kind: 'expandable-cards',
        layout: 'vertical',
        multiOpen: true,
        defaultOpen: ['neutro'],
        cards: LETTURA_CE_PER_AZIONE.map((r) => ({
          id: r.id,
          color: r.colore,
          badge: r.chip,
          title: r.elemento,
          summary: r.lettura_f3,
          detail: `
            <div class="corso-m2-lettura">
              <div class="corso-m2-lettura__row">
                <span class="corso-m2-lettura__lab corso-m2-lettura__lab--f2">F2 — «Che stato?»</span>
                <p>${r.lettura_f2}</p>
              </div>
              <div class="corso-m2-lettura__row">
                <span class="corso-m2-lettura__lab corso-m2-lettura__lab--f3">F3 — «Cosa fa?»</span>
                <p>${r.lettura_f3}</p>
              </div>
              <div class="corso-m2-lettura__case">
                <span class="corso-m2-lettura__case-lab">Nel caso-guida</span>
                <p>${r.esempio}</p>
              </div>
            </div>
          `,
        })),
      },
      content: `
        <div class="corso-m3-rule" style="margin-top: 18px;">
          <div class="corso-m3-rule__head">Regola di lettura F3</div>
          <ul>
            <li>I nodi <strong>↑</strong> sono <em>risorse</em> — su di loro si costruisce il dispositivo</li>
            <li>I nodi <strong>~</strong> sono <em>zone di movimento</em> — il nodo dominante si cerca qui</li>
            <li>I nodi <strong>↓</strong> sono <em>tensioni</em> — non sono automaticamente il punto di lavoro; vanno rispettati per non esacerbarli</li>
            <li>La <strong>relazione R</strong> orienta la funzione</li>
            <li>La <strong>direzione D</strong> vincola la scelta: D↗ esclude stabilizzare come prima opzione</li>
            <li>La <strong>tenuta T</strong> calibra la scala del dispositivo</li>
          </ul>
        </div>
      `,
      guardrail: {
        code: 'C-F3-20',
        label: 'Errore di lettura tipico',
        text:
          'Il nodo dominante non è il nodo con lo stato più basso. Un nodo ↓ può essere una tensione da non esacerbare, non il punto di lavoro. Confondere i due porta a dispositivi controproducenti.',
      },
    },

    // ─── 2.4 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m02-04',
      type: 'comparison',
      title: 'La stessa CE, due letture',
      subtitle: 'F2 e F3 davanti alla stessa Configurazione Evolutiva',
      content: `
        <div class="corso-m2-dualread" aria-hidden="true">
          <span class="corso-m2-dualread__src">CE</span>
          <div class="corso-m2-dualread__lines">
            <div class="corso-m2-dualread__line">
              <span class="corso-m2-dualread__lab">legge</span>
              <span class="corso-m2-dualread__arrow">───────▶</span>
              <span class="corso-m2-dualread__dest corso-m2-dualread__dest--f2">F2: «Questo campo è...»</span>
            </div>
            <div class="corso-m2-dualread__line">
              <span class="corso-m2-dualread__lab">rilegge</span>
              <span class="corso-m2-dualread__arrow">───────▶</span>
              <span class="corso-m2-dualread__dest corso-m2-dualread__dest--f3">F3: «Questo campo può...»</span>
            </div>
          </div>
        </div>

        <div class="corso-cmp2">
          <section class="corso-cmp2__col" style="border-top-color: var(--corso-f2); background: rgba(26, 107, 138, 0.04);">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab" style="color: var(--corso-f2);">Lettura F2 — per la descrizione</span>
              <h3 class="corso-cmp2__title">Che stato ha il campo?</h3>
            </header>
            <p class="corso-m2-cmp__q">«Come è organizzata questa configurazione?»</p>
            <ul class="corso-cmp2__items">
              <li><div class="corso-cmp2__item-text">Descrizione strutturale del campo (CE)</div></li>
              <li><div class="corso-cmp2__item-text">Stato di ciascun nodo (↑ ↓ ~)</div></li>
              <li><div class="corso-cmp2__item-text">Relazione dominante tra nodi</div></li>
              <li><div class="corso-cmp2__item-text">Direzione evolutiva, tenuta, abitabilità</div></li>
              <li><div class="corso-cmp2__item-text">Linguaggio condivisibile tra discipline</div></li>
            </ul>
            <p class="corso-cmp2__foot-note">F2 non risponde alla domanda: «Cosa faccio?»</p>
          </section>

          <section class="corso-cmp2__col corso-cmp2__col--right">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab" style="color: var(--corso-f3);">Lettura F3 — per l'azione</span>
              <h3 class="corso-cmp2__title">Dove può muoversi il campo?</h3>
            </header>
            <p class="corso-m2-cmp__q">«Da questa configurazione, verso dove si può andare?»</p>
            <ul class="corso-cmp2__items">
              <li><div class="corso-cmp2__item-text">Identificazione del nodo dominante (M3)</div></li>
              <li><div class="corso-cmp2__item-text">Scelta della funzione dell'azione (M4)</div></li>
              <li><div class="corso-cmp2__item-text">Costruzione del micro-dispositivo (M5)</div></li>
              <li><div class="corso-cmp2__item-text">Template F3 e output-tipo (M5)</div></li>
              <li><div class="corso-cmp2__item-text">Logica decisionale (M7)</div></li>
            </ul>
            <p class="corso-cmp2__foot-note">F3 non modifica la CE: la legge in chiave operativa.</p>
          </section>
        </div>

        <div class="corso-cmp2__footer">
          <span class="corso-cmp2__footer-lab">Stessa sorgente, due letture</span>
          <p>La stessa CE viene letta due volte: prima in F2 (cosa è questo campo?), poi in F3 (dove può andare questo campo?). La lettura F3 non invalida quella F2 — la usa come punto di partenza.</p>
        </div>
      `,
    },

    // ─── 2.5 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m02-05',
      type: 'comparison',
      title: 'Dal sintomo al nodo, non il contrario',
      subtitle: 'L\'errore che svuota la pipeline',
      content: `
        <div class="corso-cmp2">
          <section class="corso-cmp2__col corso-cmp2__col--left">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab">Partire dal sintomo</span>
              <h3 class="corso-cmp2__title">Il sintomo come punto di partenza</h3>
            </header>
            <ul class="corso-cmp2__items corso-m2-err-list">
              ${CONFRONTO_ERRORE.sinistra
                .map(
                  (it) => `
                    <li>
                      <div class="corso-m2-err-item__sintomo">${it.sintomo}</div>
                      <div class="corso-m2-err-item__azione">
                        <span class="corso-m2-err-item__lab">Risposta frequente</span>
                        ${it.azione_errata}
                      </div>
                      <div class="corso-m2-err-item__problema">
                        <span aria-hidden="true">⚠</span> ${it.problema}
                      </div>
                    </li>
                  `,
                )
                .join('')}
            </ul>
          </section>

          <section class="corso-cmp2__col corso-cmp2__col--right">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab" style="color: var(--corso-f3);">Partire dal nodo</span>
              <h3 class="corso-cmp2__title">Il nodo come punto di partenza</h3>
            </header>
            <ul class="corso-cmp2__items corso-m2-good-list">
              ${CONFRONTO_ERRORE.destra
                .map(
                  (it) => `
                    <li>
                      <div class="corso-m2-good-item__nodo" style="--corso-good-color: ${it.colore};">${it.nodo}</div>
                      <div class="corso-m2-good-item__lettura">${it.lettura}</div>
                      <div class="corso-m2-good-item__azione">
                        <span class="corso-m2-good-item__lab">F3</span>
                        ${it.azione}
                      </div>
                    </li>
                  `,
                )
                .join('')}
            </ul>
          </section>
        </div>

        <p class="corso-narrative__caption" style="text-align: center; margin-top: 18px; max-width: 760px; margin-left: auto; margin-right: auto; line-height: 1.6;">
          Il sintomo è l'effetto visibile di una configurazione. Intervenire sul sintomo significa agire sull'effetto senza modificare le condizioni che lo producono. La pipeline F3 parte dall'osservazione del campo e percorre la catena fino al dispositivo — non parte dall'effetto cercando la causa.
        </p>
      `,
      guardrail: {
        code: 'C-F3-21',
        label: 'Errore della corsia rapida',
        text:
          'Vedere un comportamento problematico e costruire un dispositivo diretto su quel comportamento — saltando CE, nodo dominante e funzione — non è F3. È la «corsia rapida» che bypassa la leggibilità e ricade nella tecnicizzazione precoce identificata in F2.',
      },
    },

    // ─── 2.6 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m02-06',
      type: 'interactive',
      title: 'La pipeline applicata',
      subtitle: 'Il caso-guida passo per passo',
      content: `
        <div class="corso-m2-scena">
          <span class="corso-m2-scena__lab">Scena</span>
          <em>${CASO_GUIDA_F3.scena.split('\n\n')[0]} […]</em>
        </div>

        ${pipelineHtml('caso')}
      `,
      notes:
        'Nei prossimi tre moduli (M3, M4, M5) ogni step F3 verrà approfondito singolarmente. Qui vediamo la forma completa: la pipeline come struttura, il caso-guida come materiale.',
    },

    // ─── 2.7 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m02-07',
      type: 'standard',
      title: "F2 produce leggibilità. F3 orienta l'azione.",
      subtitle: 'Il confine che non si deve attraversare al contrario',
      content: `
        <blockquote class="corso-blockquote" style="border-left-color: var(--corso-f3); max-width: 760px; margin: 12px auto 24px;">
          «La CE prodotta da F2 è un input per F3, non un prodotto che F3 può riscrivere. F3 legge la CE per l'azione — non la modifica per adattarla all'azione desiderata.»
        </blockquote>

        <div class="corso-two-col">
          <div class="corso-m2-illegit">
            <div class="corso-m2-illegit__num">①</div>
            <div class="corso-m2-illegit__head">Direzione illegittima — da F3 verso F2</div>
            <div class="corso-m2-illegit__quote">«La CE dice N3~, ma io voglio lavorare su N4. Rileggere la CE come se N4 fosse il nodo dominante.»</div>
            <div class="corso-m2-illegit__problem">
              <span class="corso-m2-illegit__lab">Problema</span>
              Si modifica la descrizione per adattarla all'intervento già deciso. La leggibilità viene sacrificata all'azione.
            </div>
          </div>
          <div class="corso-m2-illegit">
            <div class="corso-m2-illegit__num">②</div>
            <div class="corso-m2-illegit__head">Saltare F2 per arrivare a F3</div>
            <div class="corso-m2-illegit__quote">«Non ho una CE formale ma so che il bambino ha difficoltà linguistiche. Costruisco direttamente il dispositivo.»</div>
            <div class="corso-m2-illegit__problem">
              <span class="corso-m2-illegit__lab">Problema</span>
              Senza CE non c'è nodo dominante fondato. Il dispositivo poggia su un sintomo, non su una configurazione.
            </div>
          </div>
        </div>

        <div class="corso-m3-rule" style="margin-top: 22px;">
          <div class="corso-m3-rule__head">La pipeline funziona in una sola direzione</div>
          <p>F1 → F2 → F3: ogni fase riceve dall'anteriore e produce per la successiva.</p>
          <p>Tornare indietro a modificare la CE per renderla compatibile con l'azione che si vuole fare è l'errore metodologico più grave di F3: trasforma la leggibilità in giustificazione post-hoc.</p>
          <p style="font-style: italic; margin-top: 10px;">Il confine F2/F3 non è una formalità procedurale — è la garanzia che l'azione professionale poggia su una lettura strutturale fondata, non sull'intenzione del professionista.</p>
        </div>

        <p class="corso-emph corso-emph--center" style="font-style: italic; font-size: 1.08rem; margin-top: 26px;">
          La pipeline è chiara. Il confine è solido. Da qui in poi si percorre il lato F3 della pipeline — passo per passo.
        </p>
        <div class="corso-m3-next">
          <span class="corso-m3-next__arrow">→</span>
          <span class="corso-m3-next__lab">Modulo 3 — Il nodo dominante</span>
        </div>
      `,
    },
  ],
};
