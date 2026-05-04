import type { ExpandableCardData, Module } from '../types';
import { CASO_GUIDA_F1 } from '../caso-guida';

// =============================================================
// Modulo 0 — Perché una fondazione?
// =============================================================

interface Osservatore {
  id: string;
  icona: string;
  disciplina: string;
  letturaComune: string;
  domandaImplicita: string;
  assunzioneImplicita: string;
  cosaRestaInOmbra: string;
  registroPrevalente: string;
  colore: string;
  sfondo: string;
}

const TRE_OSSERVATORI: Osservatore[] = [
  {
    id: 'pediatra',
    icona: '🩺',
    disciplina: 'Pediatra',
    letturaComune: '«Competenza linguistica nella norma?»',
    domandaImplicita: "Ha raggiunto le tappe di sviluppo attese per l'età?",
    assunzioneImplicita:
      "Lo sviluppo è un processo di accumulo di competenze misurabili rispetto a una norma di riferimento. Il bambino è l'unità di analisi: lo si valuta individualmente, rispetto a una traiettoria standard. Il campo relazionale è considerato rilevante ma non costitutivo dell'oggetto di osservazione.",
    cosaRestaInOmbra:
      "Il campo relazionale che rende possibile o difficile lo scambio resta sullo sfondo. Il libro come oggetto culturale non viene tematizzato. La struttura dello scambio non entra nell'output: viene letta soprattutto la prestazione del bambino in quel momento.",
    registroPrevalente: 'Registro normativo',
    colore: '#1a6b8a',
    sfondo: '#e8f4f8',
  },
  {
    id: 'educatore',
    icona: '📚',
    disciplina: 'Educatore',
    letturaComune: '«Buona attenzione sostenuta?»',
    domandaImplicita: "Il bambino riesce a mantenere l'attenzione su un compito cognitivo?",
    assunzioneImplicita:
      "Lo sviluppo è il dispiegarsi di funzioni cognitive relativamente autonome. L'attenzione è una funzione valutabile indipendentemente dal campo relazionale e dall'oggetto culturale. Quello che si vede è un comportamento del bambino, considerato di per sé più che come configurazione del campo.",
    cosaRestaInOmbra:
      "Il fatto che il bambino non stia «prestando attenzione» ma stia costruendo un mondo condiviso con l'adulto resta sullo sfondo. La dipendenza dell'attenzione dal campo non viene tematizzata. La qualità dello scambio simbolico fra i due soggetti non entra nell'osservazione.",
    registroPrevalente: 'Registro funzionale',
    colore: '#2d6a4f',
    sfondo: '#d8f3dc',
  },
  {
    id: 'npi',
    icona: '🧠',
    disciplina: 'Neuropsichiatra · Psicologo',
    letturaComune: '«Assenza di segnali di allerta?»',
    domandaImplicita: 'Il comportamento del bambino è nella norma o indica un rischio?',
    assunzioneImplicita:
      "Lo sguardo clinico è orientato dalla ricerca di segnali di scarto rispetto a traiettorie standard. È il suo compito specifico: escludere o segnalare un possibile rischio. Il campo relazionale è considerato variabile di contesto — importante, ma non l'oggetto principale dell'osservazione clinica.",
    cosaRestaInOmbra:
      "Lo sguardo è disposto verso ciò che potrebbe non andare; ciò che funziona — la qualità del campo condiviso, la ricchezza dello scambio simbolico, la struttura della relazione — non rientra nel mandato specifico. Non è un difetto della disciplina: è la natura della sua focalizzazione.",
    registroPrevalente: 'Registro clinico',
    colore: '#8e44ad',
    sfondo: '#f3e8f9',
  },
];

const OSSERVATORI_CARDS: ExpandableCardData[] = TRE_OSSERVATORI.map((o) => ({
  id: o.id,
  badge: o.icona,
  color: o.colore,
  title: `${o.disciplina} · ${o.letturaComune}`,
  summary: o.domandaImplicita,
  detail: `
    <div class="corso-section" style="background: ${o.sfondo}; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Cosa assume implicitamente</p>
      <p style="margin: 0;">${o.assunzioneImplicita}</p>
    </div>
    <div class="corso-section" style="border-left: 3px solid #d35400; background: #fef5ec; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Cosa resta in ombra</p>
      <p style="margin: 0;">${o.cosaRestaInOmbra}</p>
    </div>
    <div style="text-align: right;">
      <span style="display: inline-block; background: ${o.colore}; color: white; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em; padding: 4px 10px; border-radius: 4px;">${o.registroPrevalente}</span>
    </div>
  `,
}));

// ─── Cosa fa F1 / cosa non fa ────────────────────────────────

interface VoceFaNonFa {
  testo: string;
  nota: string;
}

const F1_PRODUCE: VoceFaNonFa[] = [
  {
    testo: "Un'ontologia del soggetto in sviluppo",
    nota: 'Il bambino come soggetto incarnato, temporale e relazionale — non come organismo o insieme di funzioni.',
  },
  {
    testo: 'I sei assi strutturali di sviluppo',
    nota: 'Dimensioni sempre attive — non fasi da attraversare né competenze da acquisire.',
  },
  {
    testo: 'Un sistema di vincoli che preserva ampiezza dello sguardo',
    nota: "Ogni guardrail di F2 e F3 deriva da un'assunzione di F1. La fondazione agisce come rete di sicurezza metodologica, non come critica alle discipline.",
  },
  {
    testo: 'Le condizioni di possibilità per F2',
    nota: 'Gli assi non si usano direttamente — rendono possibile la costruzione dei Nodi e della Matrice di F2.',
  },
];

const F1_NON_PRODUCE: VoceFaNonFa[] = [
  {
    testo: 'Strumenti operativi',
    nota: 'F1 non produce nulla che si possa usare direttamente in ambulatorio, al nido o in counseling.',
  },
  {
    testo: 'Domande osservative dirette',
    nota: 'Le domande professionali nascono in F2. F1 produce le domande che orientano la costruzione di quelle domande.',
  },
  {
    testo: 'Indicatori o criteri di valutazione',
    nota: 'F1 è rigorosamente pre-normativo: non definisce soglie, livelli, profili o categorie di rischio.',
  },
  {
    testo: 'Diagnosi o prescrizioni',
    nota: 'Nessun asse strutturale dice al professionista cosa fare. La decisione operativa rimane sempre fuori dal metodo.',
  },
];

// ─── Mappa degli 8 moduli del corso F1 ───────────────────────

interface ModuloCorso {
  id: string;
  numero: string;
  titoloBreve: string;
  titoloEsteso: string;
  colore: string;
  introduce: string;
  slide: number;
  attivo?: boolean;
}

const MAPPA_MODULI: ModuloCorso[] = [
  {
    id: 'm0',
    numero: 'M0',
    titoloBreve: 'Orientamento',
    titoloEsteso: 'Perché una fondazione?',
    colore: '#6c63ff',
    introduce: "Il problema delle assunzioni implicite e l'architettura del metodo.",
    slide: 5,
    attivo: true,
  },
  {
    id: 'm1',
    numero: 'M1',
    titoloBreve: 'Il soggetto',
    titoloEsteso: 'Il bambino come soggetto',
    colore: '#5c35a0',
    introduce: "L'ontologia del soggetto incarnato, temporale e relazionale. Il guardrail fondativo.",
    slide: 7,
  },
  {
    id: 'm2',
    numero: 'M2',
    titoloBreve: 'Architettura',
    titoloEsteso: 'Gli assi strutturali: logica e architettura',
    colore: '#4a5568',
    introduce: 'Cosa sono gli assi, la gerarchia strutturale, le quattro proprietà, la differenza con le competenze.',
    slide: 7,
  },
  {
    id: 'm3',
    numero: 'M3',
    titoloBreve: 'Asse 1',
    titoloEsteso: "Asse 1 — Abitare l'esperienza",
    colore: '#1a6b8a',
    introduce: "Il soggetto incarnato: come il bambino abita l'esperienza. Asse fondativo di tutti gli altri.",
    slide: 8,
  },
  {
    id: 'm4',
    numero: 'M4',
    titoloBreve: 'Assi 2-3',
    titoloEsteso: 'Assi 2 e 3 — Alterità e normatività',
    colore: '#2d6a4f',
    introduce: "Il riconoscimento dell'altro come soggetto. L'emergenza interna della normatività.",
    slide: 7,
  },
  {
    id: 'm5',
    numero: 'M5',
    titoloBreve: 'Assi 4-5',
    titoloEsteso: 'Assi 4 e 5 — Limite reale e desiderio',
    colore: '#c0392b',
    introduce: "L'incontro con la resistenza del reale. Il desiderio come direzione, non come carenza.",
    slide: 7,
  },
  {
    id: 'm6',
    numero: 'M6',
    titoloBreve: 'Asse 6',
    titoloEsteso: 'Asse 6 e la gerarchia completa',
    colore: '#d35400',
    introduce: 'La partecipazione al mondo storico-culturale. Il sistema degli assi come mappa relazionale.',
    slide: 7,
  },
  {
    id: 'm7',
    numero: 'M7',
    titoloBreve: 'Epistemologia',
    titoloEsteso: 'Statuto epistemologico e passaggio a F2',
    colore: '#2c3e50',
    introduce: 'Gli assi come strutture interpretative. La circolazione controllata. Il ponte verso F2.',
    slide: 7,
  },
];

// =============================================================
// Slide
// =============================================================

export const Module00: Module = {
  id: 'm00',
  number: 0,
  title: 'Perché una fondazione?',
  shortTitle: 'Orientamento',
  accent: '#6c63ff',
  slides: [
    // ─── 0.1 ──────────────────────────────────────────────
    {
      id: 'm00-s01',
      type: 'narrative',
      title: 'La stessa scena, tre osservatori',
      content: `
        <div class="corso-scena" style="border-left: 4px solid var(--corso-primary); background: var(--corso-primary-light); padding: 18px 22px; border-radius: var(--corso-radius-sm);">
          <p style="font-style: italic; margin: 0; line-height: 1.7; font-size: 1.05rem;">${CASO_GUIDA_F1.scena}</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px;">
          ${TRE_OSSERVATORI.map((o) => `
            <div style="background: ${o.sfondo}; border: 1px solid ${o.colore}; border-radius: var(--corso-radius-sm); padding: 14px 16px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="font-size: 1.2rem;">${o.icona}</span>
                <span style="font-weight: 700; color: ${o.colore};">${o.disciplina}</span>
              </div>
              <p style="margin: 0; font-style: italic; color: var(--corso-text-2); font-size: 0.92rem;">${o.letturaComune}</p>
            </div>
          `).join('')}
        </div>

        <p class="corso-emph corso-emph--center" style="margin-top: 20px;">Tre osservatori, tre domande diverse — sulla stessa scena.</p>
        <p class="corso-narrative__caption" style="text-align: center;">Le domande non sono il problema. Il problema sono le assunzioni implicite che le producono.</p>
      `,
    },

    // ─── 0.1b — assunzioni implicite (separata per leggibilità) ──
    {
      id: 'm00-s02',
      type: 'interactive',
      title: 'Cosa sta assumendo ciascuno?',
      subtitle: 'Le assunzioni implicite dietro le domande',
      intro: `
        <p>Le tre domande della slide precedente non sono sbagliate — sono <strong>professionalmente legittime</strong>. Ognuna nasce però da un'assunzione implicita su cosa è lo sviluppo e chi è il bambino. Espandi le card per vedere quale registro orienta lo sguardo di ciascun osservatore.</p>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: OSSERVATORI_CARDS,
        layout: 'vertical',
        multiOpen: true,
      },
      content: `
        <hr class="corso-divider" />
        <p class="corso-emph corso-emph--center" style="font-size: 1.1rem;">Il problema non è che le domande siano sbagliate — sono domande competenti, professionali, legittime.</p>
        <p class="corso-emph corso-emph--center">Il problema è che nascono da assunzioni implicite su cosa è lo sviluppo e chi è il bambino.</p>
        <p class="corso-narrative__caption" style="text-align: center; margin-top: 12px;">Rendere esplicite quelle assunzioni è il compito della Fase 1.</p>
      `,
      notes:
        "Questo modulo apre con la stessa scena del corso F2 — ma con una domanda diversa. In F2 la domanda era: «come leggiamo questa scena integrando i registri disciplinari?» In F1 la domanda è: «cosa sta assumendo implicitamente chiunque la guardi?» Sono due livelli diversi dello stesso problema.",
    },

    // ─── 0.2 ──────────────────────────────────────────────
    {
      id: 'm00-s03',
      type: 'diagram',
      title: 'Un metodo in tre fasi',
      subtitle: 'Vista da F1',
      content: `
        <div class="corso-cards corso-cards--vertical">
          <div class="corso-card corso-card--open" style="--corso-card-accent: #6c63ff; border-width: 2px;">
            <div class="corso-card__head">
              <span class="corso-card__badge" style="background: #6c63ff;">F1</span>
              <span class="corso-card__title">Fondazione ontologica <span style="display: inline-block; background: #6c63ff; color: white; font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 3px; margin-left: 8px;">SIAMO QUI</span></span>
            </div>
            <div class="corso-card__body">
              <p style="font-style: italic; font-size: 1.1rem; color: var(--corso-text); margin: 0 0 12px;">«Che tipo di realtà è lo sviluppo? Che tipo di soggetto è il bambino?»</p>
              <p><strong>Funzione</strong> · Stabilisce che tipo di realtà è lo sviluppo infantile e che tipo di soggetto è il bambino. Definisce i vincoli concettuali che rendono possibile qualsiasi strumento successivo.</p>
              <p><strong>Input</strong> · Nessuno — è il punto di partenza del framework.</p>
              <p><strong>Output verso F2</strong> · I sei assi strutturali come condizioni di possibilità.</p>
            </div>
          </div>

          <div style="text-align: center; color: var(--corso-text-muted); font-size: 0.85rem; margin: 4px 0;">↓</div>

          <div class="corso-card corso-card--open" style="--corso-card-accent: #1a6b8a; opacity: 0.78;">
            <div class="corso-card__head">
              <span class="corso-card__badge" style="background: #1a6b8a;">F2</span>
              <span class="corso-card__title">Traduzione interdisciplinare</span>
            </div>
            <div class="corso-card__body">
              <p style="font-style: italic; color: var(--corso-text-2); margin: 0 0 8px;">«Come si rende leggibile lo sviluppo fra discipline?»</p>
              <p>Costruisce condizioni di traducibilità fra livelli disciplinari differenti senza perdita dello statuto teorico originario. Rende lo sviluppo leggibile nei contesti professionali.</p>
              <p style="font-size: 0.82rem; color: var(--corso-text-muted); margin-top: 8px;">Il corso F2 — Traduzione interdisciplinare è già disponibile come applicazione separata.</p>
            </div>
          </div>

          <div style="text-align: center; color: var(--corso-text-muted); font-size: 0.85rem; margin: 4px 0;">↓</div>

          <div class="corso-card corso-card--open" style="--corso-card-accent: #2d9cdb; opacity: 0.78;">
            <div class="corso-card__head">
              <span class="corso-card__badge" style="background: #2d9cdb;">F3</span>
              <span class="corso-card__title">Strumenti operativi</span>
            </div>
            <div class="corso-card__body">
              <p style="font-style: italic; color: var(--corso-text-2); margin: 0 0 8px;">«Come si agisce coerentemente con la struttura dello sviluppo?»</p>
              <p>Trasforma la leggibilità prodotta da F2 in micro-azioni coerenti senza produrre protocolli, diagnosi o prescrizioni. Richiede F2 come prerequisito.</p>
              <p style="font-size: 0.82rem; color: var(--corso-text-muted); margin-top: 8px;">La decisione clinica o educativa resta fuori dal metodo.</p>
            </div>
          </div>
        </div>

        <hr class="corso-divider" />

        <div class="corso-fase-keywords" style="justify-content: center;">
          <span style="background: #6c63ff; color: white; padding: 6px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 700;">DEFINISCE</span>
          <span class="corso-fase-keywords__sep">→</span>
          <span style="background: #1a6b8a; color: white; padding: 6px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 700;">RENDE LEGGIBILE</span>
          <span class="corso-fase-keywords__sep">→</span>
          <span style="background: #2d9cdb; color: white; padding: 6px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 700;">RENDE POSSIBILE L'AZIONE</span>
        </div>
      `,
      notes:
        'In F2 questo schema appariva con F2 evidenziata come «siamo qui». Qui è F1 ad essere al centro. Non è ridondanza: F1 e F2 sono due corsi autonomi che esplorano due livelli diversi del metodo. Si possono seguire in ordine o separatamente — ma F1 è la radice da cui F2 trae i propri vincoli.',
    },

    // ─── 0.3 ──────────────────────────────────────────────
    {
      id: 'm00-s04',
      type: 'standard',
      title: 'Cosa fa F1',
      subtitle: 'E cosa non fa — una distinzione utile per tutto il corso',
      content: `
        <div class="corso-two-col">
          <div class="corso-box corso-box--valid">
            <div class="corso-box__title">✓ F1 produce</div>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${F1_PRODUCE.map((p) => `
                <li style="padding: 10px 0; border-bottom: 1px solid rgba(39,174,96,0.18);">
                  <p style="margin: 0 0 4px; font-weight: 600; color: var(--corso-text);">${p.testo}</p>
                  <p style="margin: 0; font-size: 0.88rem; color: var(--corso-text-2); line-height: 1.5;">${p.nota}</p>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="corso-box corso-box--invalid">
            <div class="corso-box__title">✗ F1 non produce</div>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${F1_NON_PRODUCE.map((p) => `
                <li style="padding: 10px 0; border-bottom: 1px solid rgba(231,76,60,0.18);">
                  <p style="margin: 0 0 4px; font-weight: 600; color: var(--corso-text);">${p.testo}</p>
                  <p style="margin: 0; font-size: 0.88rem; color: var(--corso-text-2); line-height: 1.5;">${p.nota}</p>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <hr class="corso-divider" />

        <p class="corso-emph corso-emph--center" style="font-size: 1.1rem;">F1 resta sullo sfondo di tutto il resto del metodo — non come contenuto da applicare, ma come insieme di vincoli che proteggono l'ampiezza dello sguardo.</p>
        <p class="corso-narrative__caption" style="text-align: center;">Ogni volta che uno strumento di F3 rischia di trasformare l'abitabilità in punteggio, o il campo relazionale in comportamento del bambino — è la fondazione ontologica a segnalare lo scarto.</p>
      `,
      notes:
        'La distinzione fra ciò che F1 produce e ciò che non produce non è una limitazione: è la condizione che rende il framework metodologicamente coerente. Un framework che produce tutto — fondazione, leggibilità, strumenti, diagnosi — non ha livelli distinti e perde i guardrail fra un livello e l\'altro.',
    },

    // ─── 0.4 ──────────────────────────────────────────────
    {
      id: 'm00-s05',
      type: 'narrative',
      title: 'La domanda fondativa',
      content: `
        <div style="text-align: center; padding: 40px 20px 30px;">
          <p style="font-size: 2.4rem; font-weight: 700; color: var(--corso-text); line-height: 1.25; margin: 0 0 16px; letter-spacing: -0.01em;">Che tipo di realtà è lo sviluppo infantile?</p>
          <p style="font-size: 2rem; font-weight: 600; color: var(--corso-text); line-height: 1.3; margin: 0;">Che tipo di soggetto è il bambino?</p>
        </div>

        <hr style="width: 60px; border: none; border-top: 1px solid var(--corso-border); margin: 32px auto;" />

        <div style="max-width: 640px; margin: 0 auto; text-align: center;">
          <p style="font-size: 1.05rem; color: var(--corso-text-2); line-height: 1.7; margin: 0 0 16px;">Prima di costruire qualsiasi strumento, prima di scegliere qualsiasi metodo di osservazione, prima di formare un professionista a riconoscere qualcosa — bisogna rispondere a queste domande.</p>
          <p style="font-size: 1.05rem; color: var(--corso-text-2); line-height: 1.7; margin: 0 0 28px;">Non esplicitamente. Non sempre. Ma implicitamente: ogni strumento già le risponde — nel modo in cui è costruito.</p>
          <p style="font-size: 0.95rem; color: var(--corso-text-muted); font-style: italic; margin: 0;">Rendere esplicita questa risposta è il compito della Fase 1.</p>
        </div>
      `,
      notes:
        'Questa slide non ha interattività. È pensata per stare con una domanda. La velocità della navigazione è nelle mani di chi segue il corso — ma questa slide è pensata per essere lenta.',
    },

    // ─── 0.5 ──────────────────────────────────────────────
    {
      id: 'm00-s06',
      type: 'diagram',
      title: 'Il corso che costruiremo insieme',
      subtitle: 'Otto moduli, una progressione',
      content: `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
          ${MAPPA_MODULI.map((m) => `
            <div style="background: var(--corso-surface); border: ${m.attivo ? '2px' : '1px'} solid ${m.colore}; border-radius: var(--corso-radius-md); padding: 14px 16px; ${m.attivo ? `background: ${m.colore}11;` : ''}">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="display: inline-block; background: ${m.colore}; color: white; font-size: 0.78rem; font-weight: 700; padding: 3px 10px; border-radius: 4px;">${m.numero}</span>
                  <span style="font-weight: 700; color: var(--corso-text);">${m.titoloBreve}</span>
                  ${m.attivo ? `<span style="font-size: 0.7rem; background: ${m.colore}; color: white; padding: 2px 8px; border-radius: 3px; font-weight: 700;">SIAMO QUI</span>` : ''}
                </div>
                <span style="font-size: 0.72rem; color: var(--corso-text-muted); background: var(--corso-bg); padding: 3px 8px; border-radius: 999px;">${m.slide} slide</span>
              </div>
              <p style="margin: 0 0 4px; font-size: 0.88rem; font-weight: 600; color: var(--corso-text);">${m.titoloEsteso}</p>
              <p style="margin: 0; font-size: 0.85rem; color: var(--corso-text-2); line-height: 1.5;">${m.introduce}</p>
            </div>
          `).join('')}
        </div>

        <hr class="corso-divider" />

        <div class="corso-two-col" style="grid-template-columns: 1fr 2fr; gap: 20px;">
          <div style="background: var(--corso-bg); padding: 14px 16px; border-radius: var(--corso-radius-sm); font-size: 0.88rem; line-height: 1.55; color: var(--corso-text-2);">
            <strong>Caso-guida</strong> · La scena della lettura condivisa appare in ogni modulo. Non si aggiunge contenuto alla scena: cambia la domanda con cui la si guarda.
          </div>
          <div style="border-left: 4px solid #6c63ff; background: var(--corso-primary-light); padding: 14px 18px; border-radius: var(--corso-radius-sm); font-size: 0.92rem; line-height: 1.55;">
            <strong>Progressione</strong> · Ogni modulo è autonomo e si può rileggere singolarmente. La progressione ha però una logica: M1 pone la domanda ontologica, M2 introduce il sistema degli assi, M3-M6 approfondiscono ciascun asse, M7 chiude il cerchio epistemologico e prepara il passaggio a F2.
          </div>
        </div>

        <p class="corso-emph corso-emph--center" style="margin-top: 20px;">La Fase 1 non produce strumenti. Produce la possibilità di costruirli bene.</p>

        <div style="text-align: center; margin-top: 16px;">
          <span style="display: inline-block; padding: 8px 16px; border: 1px solid var(--corso-border); border-radius: var(--corso-radius-sm); color: var(--corso-text-2); font-size: 0.9rem;">→ Modulo 1 — Il bambino come soggetto</span>
        </div>
      `,
      notes:
        'Le card della mappa sono informative, non link di navigazione. La navigazione fra moduli avviene dalla sidebar.',
    },
  ],
};
