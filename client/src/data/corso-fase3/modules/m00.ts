import { Module } from '../types';
import { CASO_GUIDA_F3, PIANO_CORSO_F3 } from '../caso-guida';

const TRE_RESPONSABILITA = [
  {
    id: 'f2',
    livello: 'F2 — Metodo',
    funzione: 'Rende leggibile',
    descrizione:
      'Produce la Configurazione Evolutiva: una descrizione strutturale del campo bambino-adulto-contesto. Non interviene, non decide, non prescrive.',
    output: 'Configurazione Evolutiva (CE)',
    colore: 'var(--corso-f2)',
  },
  {
    id: 'f3',
    livello: 'F3 — Professionista guidato dal metodo',
    funzione: 'Valuta e orienta',
    descrizione:
      "Identifica il nodo dominante, sceglie la funzione dell'azione, costruisce il micro-dispositivo contestualizzato. La responsabilità operativa è sua.",
    output: 'Micro-dispositivo di campo',
    colore: 'var(--corso-f3)',
  },
  {
    id: 'disciplina',
    livello: 'Disciplina',
    funzione: 'Decide',
    descrizione:
      'Assume la responsabilità professionale della scelta finale. Il metodo orienta la decisione — non si sostituisce ad essa.',
    output: 'Decisione disciplinare',
    colore: 'var(--corso-primary)',
  },
];

const F3_PRODUCE = [
  'Micro-dispositivi di campo contestualizzati',
  "Identificazione della funzione dell'intervento (stabilizzare / ampliare / mediare / proteggere)",
  'Template F3 compilabili',
  'Output-tipo vuoto',
  'Logica decisionale non prescrittiva',
];

const F3_NON_PRODUCE = [
  'Diagnosi',
  "Protocolli d'intervento standardizzati",
  'Prescrizioni terapeutiche o educative',
  'Raccomandazioni universali',
  "Trattamenti o piani d'azione prefissati",
];

// HTML helper per le tre card "responsabilità".
const treResponsabilitaHtml = `
  <div class="corso-three-col">
    ${TRE_RESPONSABILITA.map(
      (r) => `
        <div class="corso-resp-card ${r.id === 'f3' ? 'corso-resp-card--focus' : ''}" style="border-top-color: ${r.colore};">
          <div class="corso-resp-card__lev">${r.livello}</div>
          <div class="corso-resp-card__fn">${r.funzione}</div>
          <p class="corso-resp-card__desc">${r.descrizione}</p>
          <div class="corso-resp-card__out"><em>Output:</em> ${r.output}</div>
        </div>
      `,
    ).join('')}
  </div>
`;

// HTML del diagramma F1 → F2 → F3 (verticale, F3 attiva).
const fasiStackHtml = `
  <div class="corso-fasi-stack">
    <div class="corso-fasi-stack__node" style="--corso-fase-color: var(--corso-f1);">
      <span class="corso-fasi-stack__badge">F1</span>
      <div>
        <div class="corso-fasi-stack__title">Fondazione ontologica</div>
        <div class="corso-fasi-stack__sub">«Cosa è lo sviluppo» — prerequisito completato</div>
      </div>
      <span class="corso-fasi-stack__here" style="color: var(--corso-f1);">✓ alle spalle</span>
    </div>
    <div class="corso-fasi-stack__arrow" aria-hidden="true">↓</div>
    <div class="corso-fasi-stack__node" style="--corso-fase-color: var(--corso-f2);">
      <span class="corso-fasi-stack__badge">F2</span>
      <div>
        <div class="corso-fasi-stack__title">Traduzione interdisciplinare</div>
        <div class="corso-fasi-stack__sub">«Come si rende leggibile» — prerequisito completato</div>
      </div>
      <span class="corso-fasi-stack__here" style="color: var(--corso-f2);">✓ CE in mano</span>
    </div>
    <div class="corso-fasi-stack__arrow" aria-hidden="true">↓</div>
    <div class="corso-fasi-stack__node corso-fasi-stack__node--active" style="--corso-fase-color: var(--corso-f3);">
      <span class="corso-fasi-stack__badge">F3</span>
      <div>
        <div class="corso-fasi-stack__title">Strumenti operativi contestualizzati</div>
        <div class="corso-fasi-stack__sub">«Come si agisce» — siamo qui</div>
      </div>
      <span class="corso-fasi-stack__here">← Siamo qui</span>
    </div>
  </div>
`;

// HTML della tabella CE per la slide finale del modulo.
const ceTableHtml = (() => {
  const ce = CASO_GUIDA_F3.ce;
  const letture = CASO_GUIDA_F3.letturaNodi;
  const stateClass = (s: string) => {
    if (s === '↑') return 'corso-ce-table__state--up';
    if (s === '↓') return 'corso-ce-table__state--down';
    return 'corso-ce-table__state--neu';
  };
  const rowClass = (s: string) => {
    if (s === '↑') return 'corso-ce-table__row--up';
    if (s === '↓') return 'corso-ce-table__row--down';
    return '';
  };
  const rows = (Object.keys(ce.nodi) as Array<keyof typeof ce.nodi>)
    .map((codice) => {
      const n = ce.nodi[codice];
      const lettura = letture[codice as string] ?? '';
      return `
        <tr class="${rowClass(n.stato)}">
          <td class="corso-ce-table__node">
            <span class="corso-ce-table__node-dot" style="background: ${n.colore};"></span>
            ${codice} — ${n.label}
          </td>
          <td class="corso-ce-table__state ${stateClass(n.stato)}">${n.stato}</td>
          <td>${lettura}</td>
        </tr>
      `;
    })
    .join('');
  return `
    <table class="corso-ce-table">
      <thead>
        <tr><th>Nodo</th><th>Stato</th><th>Lettura*</th></tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <div class="corso-ce-summary">
      <span><strong>Relazione dominante:</strong> ${ce.relazione} — il campo relazionale sostiene l'accesso al mondo condiviso</span>
      <span><strong>Direzione:</strong> ${ce.direzione} espansione in corso</span>
      <span><strong>Tenuta:</strong> ${ce.tenuta} — fragile ma evolutivamente aperta</span>
      <span><strong>Abitabilità:</strong> ${ce.abitabilita} — moderata</span>
    </div>
  `;
})();

// Strip orizzontale dei moduli successivi.
const pathChipsHtml = PIANO_CORSO_F3.slice(2)
  .map(
    (m) => `
      <span class="corso-path-chip" style="--corso-path-color: ${m.colore};" title="${m.titolo} — ${m.slide} slide">
        <span class="corso-path-chip__num">M${m.id.slice(1)}</span>
        ${m.titolo}
      </span>
    `,
  )
  .join('<span class="corso-path-arrow" aria-hidden="true">→</span>');

export const Module00: Module = {
  id: 'm00',
  number: 0,
  title: 'Orientamento F3',
  shortTitle: 'Orientamento',
  accent: '#2d9cdb',
  slides: [
    // ─── 0.1 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m00-01',
      type: 'narrative',
      title: 'Da qui si agisce',
      content: `
        <div class="corso-narrative corso-narrative--centered">
          <div class="corso-callout">
            <p><em>Alla fine della Fase 2, il professionista ha in mano una Configurazione Evolutiva.</em></p>
            <p><em>Sa leggere la situazione. Sa descrivere il campo. Sa quali nodi sono attivi, quali in tensione.</em></p>
            <p class="corso-callout__cta">Adesso cosa fa?</p>
          </div>

          <hr class="corso-divider" />

          <p>La Fase 2 ha fatto il suo lavoro: ha trasformato un'osservazione in una descrizione strutturata del campo evolutivo. Ha prodotto leggibilità senza produrre azione.</p>
          <p>La <strong>Fase 3</strong> inizia esattamente qui: nel momento in cui la leggibilità deve orientare qualcosa di reale.</p>

          <div class="corso-q-chips">
            <span class="corso-q-chip">Quale nodo è dominante in questo campo?</span>
            <span class="corso-q-chip">Quale funzione può aumentare l'abitabilità?</span>
            <span class="corso-q-chip">Quale dispositivo è coerente con questa configurazione?</span>
          </div>

          <p class="corso-narrative__caption">Questo corso risponde a queste tre domande — sul caso-guida che abbiamo già incontrato.</p>
        </div>
      `,
      notes:
        'F3 non ricomincia da zero: riceve da F2 e trasforma. Il prerequisito è aver lavorato la Configurazione Evolutiva.',
    },

    // ─── 0.2 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m00-02',
      type: 'diagram',
      title: "L'architettura del metodo: siamo qui",
      content: `
        ${fasiStackHtml}
        <div class="corso-fase-keywords" style="margin-top: 28px;">
          <span><strong>DEFINISCE</strong></span>
          <span class="corso-fase-keywords__sep">→</span>
          <span><strong>RENDE LEGGIBILE</strong></span>
          <span class="corso-fase-keywords__sep">→</span>
          <span><strong>RENDE POSSIBILE L'AZIONE</strong></span>
        </div>
      `,
      notes:
        'F1 stabilisce i vincoli ontologici, F2 rende lo sviluppo leggibile come Configurazione Evolutiva, F3 trasforma la leggibilità in micro-azioni coerenti.',
    },

    // ─── 0.3 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m00-03',
      type: 'standard',
      title: 'Chi fa cosa',
      subtitle: 'Una distinzione strutturalmente necessaria',
      content: `
        <p>Trasformare la leggibilità in azione solleva una domanda che il metodo deve rispondere esplicitamente:</p>
        <p class="corso-emph corso-emph--center"><em>Chi decide cosa fare?</em></p>
        <p>Se risponde solo il metodo, il professionista esegue una procedura. Se risponde solo la disciplina, la lettura configurazionale non orienta nulla. Il metodo propone una <strong>terza via</strong>: la responsabilità è distribuita su tre livelli distinti, ciascuno con una funzione specifica.</p>

        ${treResponsabilitaHtml}

        <blockquote class="corso-blockquote" style="border-left-color: var(--corso-f3);">
          «Il metodo non decide. Orienta la decisione.»
        </blockquote>
        <p>La responsabilità disciplinare — che si tratti del pediatra, dell'educatore o dello psicologo — non viene assorbita dal metodo. F3 produce gli strumenti per decidere bene; la decisione finale è e rimane professionale.</p>
      `,
      notes:
        "Questa distinzione non è formale: è la garanzia che F3 non diventi un protocollo prescrittivo.",
    },

    // ─── 0.4 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m00-04',
      type: 'standard',
      title: 'Cosa produce la Fase 3',
      subtitle: 'E cosa rimane fuori',
      content: `
        <blockquote class="corso-blockquote" style="border-left-color: var(--corso-f3);">
          «Trasformare la leggibilità configurazionale in micro-azioni coerenti senza produrre protocolli, diagnosi o prescrizioni.»
        </blockquote>

        <hr class="corso-divider" />

        <div class="corso-two-col">
          <div class="corso-box corso-box--valid">
            <div class="corso-box__title">✓ F3 produce</div>
            <ul>
              ${F3_PRODUCE.map((v) => `<li>${v}</li>`).join('')}
            </ul>
          </div>
          <div class="corso-box corso-box--invalid">
            <div class="corso-box__title">✗ F3 non produce</div>
            <ul>
              ${F3_NON_PRODUCE.map((v) => `<li>${v}</li>`).join('')}
            </ul>
          </div>
        </div>

        <p class="corso-emph corso-emph--center"><em>F3 modifica il campo relazionale di esperienza. Non corregge il bambino.</em></p>
      `,
      guardrail: {
        code: 'C-F3',
        label: 'Vincolo fondamentale',
        text:
          'Se uno strumento prodotto in F3 richiede diagnosi, attribuisce tratti stabili al bambino, o prescrive sequenze obbligate di azioni, non è coerente con il metodo.',
      },
    },

    // ─── 0.5 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m00-05',
      type: 'narrative',
      title: 'Il caso-guida in mano',
      subtitle: 'La CE che abbiamo prodotto in F2',
      content: `
        <div class="corso-narrative">
          <div class="corso-scena">
            ${CASO_GUIDA_F3.scena
              .split('\n\n')
              .map((p) => `<p><em>${p.trim()}</em></p>`)
              .join('')}
          </div>

          <h3 class="corso-narrative__h3">La Configurazione Evolutiva — output della F2</h3>
          ${ceTableHtml}
          <p class="corso-narrative__caption" style="margin-top: 8px;">*Le letture riportate qui sono sintesi. Il Modulo 2 mostrerà come si legge una CE in chiave F3.</p>

          <div class="corso-ce-grammaticale">${CASO_GUIDA_F3.ce.grammaticale}</div>

          <h3 class="corso-narrative__h3" style="margin-top: 28px;">Il percorso del corso</h3>
          <p>In questo corso questa CE diventa il materiale di lavoro di ogni modulo:</p>
          <div class="corso-path-chips">
            ${pathChipsHtml}
          </div>
          <p class="corso-narrative__caption">Il caso-guida resta invariante. Ogni modulo aggiunge un pezzo.</p>

          <p class="corso-emph corso-emph--center" style="margin-top: 28px;"><em>La CE è in mano. Il corso inizia da qui.</em></p>
        </div>
      `,
      notes:
        "Prossimo modulo: M1 — Il principio del campo. Lo strumento F3 non corregge il bambino: modifica il campo relazionale di esperienza.",
    },
  ],
};
