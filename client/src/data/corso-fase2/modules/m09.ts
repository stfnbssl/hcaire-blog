import { Module, PipelineTopbarStep } from '../types';

const TOPBAR_STEPS: PipelineTopbarStep[] = [
  { id: 'F1', label: 'F1', color: '#1a6b8a' },
  { id: 'campo', label: '1 Campo', color: '#2d6a4f' },
  { id: 'concetto', label: '2 Concetto', color: '#6c63ff' },
  { id: 'nodo', label: '3 Nodo', color: '#e67e22' },
  { id: 'domande', label: '4 Domande', color: '#2980b9' },
  { id: 'operatore', label: '5 Operatore', color: '#d35400' },
  { id: 'famiglie', label: '6 Famiglie', color: '#27ae60' },
  { id: 'template', label: '7 Template', color: '#27ae60' },
  { id: 'CE', label: 'CE', color: '#16a085' },
  { id: 'F3', label: 'F3', color: '#2d9cdb' },
];

const topbar = (currentId: string) => ({ steps: TOPBAR_STEPS, currentId });

export const Module09: Module = {
  id: 'm09',
  number: 9,
  title: 'Pipeline completa: il caso-guida',
  shortTitle: 'Caso-guida',
  accent: '#c0392b',
  slides: [
    // ─── 9.1 ──────────────────────────────────────────────────────────
    {
      id: 'm09-s01',
      type: 'standard',
      title: 'Pipeline completa',
      subtitle: "Il caso-guida dall'inizio alla fine",
      content: `
        <p>Nei moduli precedenti hai attraversato ogni passaggio della Fase 2 separatamente. Ora li percorri tutti insieme, in sequenza, usando il caso-guida come filo continuo. La scena è sempre la stessa: un bambino di 18-24 mesi, un genitore, un libro illustrato, un bilancio pediatrico.</p>

        <div class="corso-scena" style="border-left-color: #c0392b; max-width: 720px; margin: 16px auto;">
          <p style="font-style: italic; line-height: 1.8;"><em>Durante un bilancio di salute, il pediatra propone una breve situazione di lettura condivisa. Il bambino prende il libro, lo apre, indica una figura, vocalizza qualcosa e guarda l'adulto. Il genitore nomina l'immagine, sorride, aspetta. Il bambino gira pagina, poi mostra un'altra figura all'adulto.</em></p>
        </div>

        <h3 class="corso-narrative__h3" style="text-align: center;">La mappa della pipeline</h3>
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4px; margin: 12px 0;">
          ${TOPBAR_STEPS.map(
            (s, i) =>
              `${i > 0 ? '<span style="color: var(--corso-text-muted); margin: 0 2px;">→</span>' : ''}<span style="background: ${s.color}; color: white; padding: 4px 10px; border-radius: var(--corso-radius-sm); font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; font-weight: 700;">${s.label}</span>`,
          ).join('')}
        </div>

        <p class="corso-narrative__caption" style="text-align: center;">Ogni passo produce qualcosa di preciso. Ogni guardrail controlla che non si faccia troppo presto.</p>
      `,
    },

    // ─── 9.2 ──────────────────────────────────────────────────────────
    {
      id: 'm09-s02',
      type: 'standard',
      title: 'Fondamento ontologico (F1)',
      subtitle: 'La tesi da cui tutto parte',
      pipelineTopbar: topbar('F1'),
      content: `
        <p>Prima che la pipeline cominci, c'è una scelta teorica. Il metodo assume che il bambino non sia riducibile a una somma di funzioni isolate: è un soggetto incarnato, relazionale, temporalmente situato, che costruisce progressivamente la capacità di abitare un mondo condiviso.</p>

        <blockquote class="corso-blockquote" style="border-left-color: #1a6b8a;">
          Il bambino non «ha» competenze che si sommano.<br/>
          <strong>Abita</strong> situazioni che possono diventare campo di esperienza condivisa.
        </blockquote>

        <h3 class="corso-narrative__h3">Come cambia la lettura</h3>
        <table class="corso-table">
          <thead><tr><th>Senza F1</th><th>Con F1</th></tr></thead>
          <tbody>
            <tr><td style="color: var(--corso-text-muted); text-decoration: line-through;">«Il bambino sa indicare»</td><td style="color: #1a6b8a;">«Il bambino usa il gesto per aprire uno scambio con l'adulto»</td></tr>
            <tr><td style="color: var(--corso-text-muted); text-decoration: line-through;">«Il bambino ha buone competenze linguistiche»</td><td style="color: #1a6b8a;">«Il libro diventa mediatore di un campo comune»</td></tr>
            <tr><td style="color: var(--corso-text-muted); text-decoration: line-through;">«Il bambino non presta attenzione»</td><td style="color: #1a6b8a;">«Il campo condiviso fatica a stabilizzarsi in questa sequenza»</td></tr>
          </tbody>
        </table>

        <p class="corso-narrative__caption">Da questa tesi, la pipeline può cominciare.</p>
      `,
    },

    // ─── 9.3 ──────────────────────────────────────────────────────────
    {
      id: 'm09-s03',
      type: 'diagram',
      title: 'Passo 1 — Campo di lavoro',
      subtitle: 'Delimitare il contesto osservativo',
      pipelineTopbar: topbar('campo'),
      content: `
        <div class="corso-two-col corso-two-col--40-60" style="grid-template-columns: 1.4fr 1fr;">
          <div class="corso-col">
            <table class="corso-table">
              <thead><tr><th>Elemento</th><th>Caso-guida</th></tr></thead>
              <tbody>
                <tr><td><strong>Contesto</strong></td><td>Ambulatorio pediatrico / casa / nido</td></tr>
                <tr><td><strong>Attori</strong></td><td>Bambino 18-24m, genitore, eventualmente pediatra</td></tr>
                <tr><td><strong>Oggetto mediatore</strong></td><td>Libro illustrato</td></tr>
                <tr><td><strong>Tempo</strong></td><td>3-5 minuti</td></tr>
                <tr><td><strong>Osservabile</strong></td><td>Corpo, sguardo, gesto, voce, alternanza adulto-oggetto</td></tr>
                <tr style="background: var(--corso-bg);"><td><strong>Non osservabile</strong></td><td>Motivazione interna, competenza stabile, intenzione profonda</td></tr>
              </tbody>
            </table>
          </div>
          <div class="corso-col">
            <div class="corso-box corso-box--valid" style="border-color: #2d6a4f; background: #eafaf1;">
              <div class="corso-box__title" style="color: #2d6a4f;">Cosa produce</div>
              <p>Il campo di lavoro definisce <strong>dove</strong>, <strong>con chi</strong> e <strong>con quali vincoli</strong> il metodo può operare. Non è ancora il tema — è il luogo.</p>
            </div>
            <p class="corso-narrative__caption" style="font-style: italic; margin-top: 12px;">«Posso immaginare una scena osservabile? Se no, non siamo ancora davanti a un campo di lavoro.»</p>
          </div>
        </div>
      `,
      guardrail: {
        code: 'C0',
        label: 'Vincolo di contesto',
        text: 'Cosa è osservabile? Cosa è decidibile nel campo?',
      },
    },

    // ─── 9.4 ──────────────────────────────────────────────────────────
    {
      id: 'm09-s04',
      type: 'comparison',
      title: 'Passo 2 — Concetto-ponte',
      subtitle: 'Tradurre conservando ampiezza',
      pipelineTopbar: topbar('concetto'),
      intro: `
        <div class="corso-box corso-box--valid" style="border-color: #6c63ff; background: #ece9ff;">
          <div class="corso-box__title" style="color: #6c63ff;">Concetto-ponte</div>
          <p style="font-size: 1.1rem;"><strong>«Accesso al mondo condiviso»</strong></p>
          <p class="corso-narrative__caption">Non «attenzione condivisa» (resterebbe nel solo registro psicologico). «Accesso al mondo condiviso» mantiene l'ampiezza ontologica: corpo, gesto, parola, attesa e significato culturale tenuti insieme.</p>
        </div>
      `,
      comparison: {
        valid: {
          title: 'Formulazione valida',
          content: `<p><em>«Il bambino usa il libro come occasione per entrare con l'adulto in un campo condiviso di sguardo, gesto, voce e significato.»</em></p>`,
        },
        invalid: {
          title: 'Formulazioni mono-registro',
          items: [
            { text: '«Il bambino presta attenzione»', problem: 'resta sul piano della funzione attentiva' },
            { text: '«Il bambino sa indicare»', problem: 'isola il comportamento dal campo che lo sostiene' },
            { text: '«Il genitore stimola bene»', problem: "sposta lo sguardo sul giudizio dell'adulto" },
          ],
        },
      },
      guardrail: {
        code: 'C1',
        label: 'Non-riduzionismo',
        text: 'Il concetto-ponte mantiene la funzione strutturale ed è osservabile in almeno due discipline diverse?',
      },
    },

    // ─── 9.5 ──────────────────────────────────────────────────────────
    {
      id: 'm09-s05',
      type: 'diagram',
      title: 'Passo 3 — Nodo trasversale',
      subtitle: 'N3 — Accesso al mondo condiviso simbolico',
      pipelineTopbar: topbar('nodo'),
      content: `
        <div class="corso-two-col">
          <div class="corso-col">
            <div class="corso-card corso-card--open" style="--corso-card-accent: #e67e22;">
              <div class="corso-card__head"><span class="corso-card__badge">N3</span><span class="corso-card__title">Accesso al mondo condiviso simbolico</span></div>
              <div class="corso-card__body">
                <p><em>Nella lettura condivisa, il bambino può trasformare il libro in un luogo di accesso al mondo comune, attraverso l'intreccio tra gesto, sguardo, voce adulta, interesse e significato culturale.</em></p>
              </div>
            </div>
            <p class="corso-narrative__caption">Il libro non è solo un oggetto. È un <strong>mediatore di mondo</strong>: permette al bambino e all'adulto di orientarsi verso qualcosa che sta tra loro.</p>
          </div>

          <div class="corso-col">
            <table class="corso-table">
              <thead><tr><th>Asse</th><th>Presenza</th></tr></thead>
              <tbody>
                <tr><td><strong>A1</strong> Ontologico</td><td>Corpo, sguardo, postura, orientamento</td></tr>
                <tr><td><strong>A2</strong> Affettivo-morale</td><td>Il clima relazionale sostiene o ostacola</td></tr>
                <tr><td><strong>A5</strong> Desiderio</td><td>Alcune immagini attraggono e orientano</td></tr>
                <tr><td><strong>A6</strong> Storico-culturale</td><td>Il libro introduce un mondo simbolico</td></tr>
              </tbody>
            </table>
            <p class="corso-narrative__caption" style="margin-top: 8px;">4 assi su 6 attivati — è un nodo, non una variabile singola.</p>
          </div>
        </div>
      `,
      guardrail: {
        code: 'C2',
        label: 'Attraversamento',
        text: 'Il nodo collega più assi? Integra corpo, relazione e senso?',
      },
    },

    // ─── 9.6 ──────────────────────────────────────────────────────────
    {
      id: 'm09-s06',
      type: 'standard',
      title: 'Passo 4 — Domande professionali',
      subtitle: 'Rendere il nodo interrogabile in contesti reali',
      pipelineTopbar: topbar('domande'),
      content: `
        <div class="corso-two-col">
          <div class="corso-box corso-box--valid">
            <div class="corso-box__title">Domande valide — lettura condivisa</div>
            <ul>
              <li>«Il libro diventa oggetto comune o resta in uso parallelo?» <em style="color: var(--corso-text-muted); font-size: 0.85rem;">— legge la qualità del campo</em></li>
              <li>«C'è alternanza di sguardo tra libro e adulto?» <em style="color: var(--corso-text-muted); font-size: 0.85rem;">— osservabile direttamente</em></li>
              <li>«Il gesto apre una relazione o rimane azione solitaria?» <em style="color: var(--corso-text-muted); font-size: 0.85rem;">— distingue azione da comunicazione</em></li>
              <li>«Lo scambio si mantiene, si interrompe, si riprende?» <em style="color: var(--corso-text-muted); font-size: 0.85rem;">— legge la continuità</em></li>
              <li>«Il bambino introduce qualcosa di proprio o risponde solo all'adulto?» <em style="color: var(--corso-text-muted); font-size: 0.85rem;">— legge la posizione soggettiva</em></li>
            </ul>
          </div>
          <div class="corso-box corso-box--invalid">
            <div class="corso-box__title">Domande da evitare</div>
            <ul>
              <li>«Il bambino è in ritardo?» <strong style="color: var(--corso-invalid);">— diagnostica</strong></li>
              <li>«Il genitore legge bene?» <strong style="color: var(--corso-invalid);">— valutativa</strong></li>
              <li>«Bisogna insegnare al genitore?» <strong style="color: var(--corso-invalid);">— già operativa</strong></li>
            </ul>
          </div>
        </div>
      `,
      guardrail: {
        code: 'C3',
        label: 'Non-diagnostico',
        text: 'Le domande producono leggibilità senza classificazione o prescrizione?',
      },
    },

    // ─── 9.7 ──────────────────────────────────────────────────────────
    {
      id: 'm09-s07',
      type: 'diagram',
      title: 'Passo 5 — Operatore di lettura',
      subtitle: 'Tre domande strutturali per organizzare ciò che si vede',
      pipelineTopbar: topbar('operatore'),
      content: `
        <div class="corso-cards corso-cards--grid">
          <div class="corso-card corso-card--open" style="--corso-card-accent: #16a085;">
            <div class="corso-card__head"><span class="corso-card__badge">1</span><span class="corso-card__title">Campo condiviso</span></div>
            <div class="corso-card__body"><p><em>«Il bambino e l'adulto si orientano verso qualcosa di comune (il libro), con gesto, sguardo e parola che si intrecciano.»</em></p></div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #8e44ad;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #8e44ad;">2</span><span class="corso-card__title">Posizione soggettiva</span></div>
            <div class="corso-card__body"><p><em>«Il bambino indica, mostra, vocalizza: c'è iniziativa soggettiva e non solo reazione all'adulto.»</em></p></div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #d35400;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #d35400;">3</span><span class="corso-card__title">Rapporto con il limite</span></div>
            <div class="corso-card__body"><p><em>«Il bambino accetta di condividere il controllo del libro con l'adulto; la sequenza si interrompe e riprende.»</em></p></div>
          </div>
        </div>

        <hr class="corso-divider" />

        <div class="corso-box corso-box--valid" style="border-color: #c0392b; background: #fdedec;">
          <div class="corso-box__title" style="color: #c0392b;">Lettura sintetica</div>
          <p><em>«Campo condiviso presente ma fragile: il bambino cerca l'adulto attraverso gesto e sguardo, prende iniziativa su alcune figure, ma la continuità dello scambio dipende molto dalla capacità dell'adulto di attendere e seguire il ritmo del bambino.»</em></p>
        </div>
      `,
      guardrail: {
        code: 'C4',
        label: 'Separazione',
        text: 'Questa lettura non dice ancora che cosa fare. Organizza la leggibilità.',
      },
    },

    // ─── 9.8 ──────────────────────────────────────────────────────────
    {
      id: 'm09-s08',
      type: 'standard',
      title: 'Passo 6 — Famiglie di output',
      subtitle: 'La stessa grammatica genera prodotti diversi',
      pipelineTopbar: topbar('famiglie'),
      content: `
        <div class="corso-cards corso-cards--grid">
          <div class="corso-card corso-card--open" style="--corso-card-accent: #2980b9;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #2980b9;">1</span><span class="corso-card__title">Osservativa</span></div>
            <div class="corso-card__body"><p>Scheda di osservazione della lettura condivisa</p></div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #16a085;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #16a085;">2</span><span class="corso-card__title">Formativa</span></div>
            <div class="corso-card__body"><p>Micro-modulo per pediatri o educatori</p></div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #8e44ad;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #8e44ad;">3</span><span class="corso-card__title">Restitutiva</span></div>
            <div class="corso-card__body"><p>Traccia di colloquio con il genitore</p></div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #27ae60;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #27ae60;">4</span><span class="corso-card__title">Ricerca</span></div>
            <div class="corso-card__body"><p>Griglia per confrontare sequenze video</p></div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #c0392b;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #c0392b;">5</span><span class="corso-card__title">Organizzativa</span></div>
            <div class="corso-card__body"><p>Protocollo per i bilanci di salute</p></div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #7f8c8d;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #7f8c8d;">6</span><span class="corso-card__title">AI-assistita</span></div>
            <div class="corso-card__body"><p>Prompt per analizzare trascrizioni</p></div>
          </div>
        </div>

        <p class="corso-narrative__caption">Sei famiglie, un solo nodo, un solo concetto-ponte. La <strong>scalabilità</strong> è la prova che il nodo è davvero trasversale.</p>
      `,
      guardrail: {
        code: 'C5',
        label: 'Scalabilità',
        text: 'Più destinatari, stessa grammatica — funziona in ambulatorio, nido, casa, ricerca.',
      },
    },

    // ─── 9.9 ──────────────────────────────────────────────────────────
    {
      id: 'm09-s09',
      type: 'diagram',
      title: 'Passo 7 — Output-tipo vuoto',
      subtitle: 'Lo stampo riusabile — ultimo passo di F2',
      pipelineTopbar: topbar('template'),
      content: `
        <h3 class="corso-narrative__h3">Scheda vuota di leggibilità del mondo condiviso</h3>

        <details>
          <summary style="cursor: pointer; font-weight: 600; color: #27ae60; padding: 8px 12px; border: 1px dashed var(--corso-border); border-radius: var(--corso-radius-sm); display: inline-block;">Mostra formula compilata</summary>

          <div class="corso-box corso-box--valid" style="border-color: #27ae60; background: #eafaf1; margin-top: 12px;">
            <p><em>«In questa situazione, il campo condiviso appare presente ma discontinuo; l'iniziativa del bambino si manifesta attraverso indicazione e alternanza di sguardo; la risposta adulta tende a sostenere quando attende, ma a interrompere quando anticipa; la continuità dello scambio è fragile ma recuperabile; il rapporto con il limite appare tollerabile se mediato dall'adulto. La configurazione complessiva suggerisce un accesso al mondo condiviso sostenuto dalla relazione ma non ancora autonomamente stabile.»</em></p>
          </div>
        </details>

        <pre style="background: var(--corso-bg); border: 1px solid var(--corso-border); border-left: 4px solid #27ae60; border-radius: var(--corso-radius-md); padding: 16px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.85rem; line-height: 1.7; margin-top: 12px; white-space: pre-wrap;">In questa situazione, il campo condiviso appare _______; l'iniziativa del bambino si manifesta attraverso _______; la risposta adulta tende a _______; la continuità dello scambio è _______; il rapporto con il limite appare _______. La configurazione complessiva suggerisce _______.</pre>

        <hr class="corso-divider" />

        <p class="corso-emph corso-emph--center">Il template è completo. F2 si ferma qui.</p>

        <div class="corso-two-col">
          <div class="corso-guardrail">
            <span class="corso-guardrail__icon" aria-hidden>🛡</span>
            <div class="corso-guardrail__body">
              <div class="corso-guardrail__head">
                <span class="corso-guardrail__code">C6</span>
                <span class="corso-guardrail__label">Completezza</span>
              </div>
              <p class="corso-guardrail__text">Il template è riusabile, resta vuoto, non prescrive, non valuta, non assegna punteggi.</p>
            </div>
          </div>
          <div class="corso-guardrail">
            <span class="corso-guardrail__icon" aria-hidden>🛡</span>
            <div class="corso-guardrail__body">
              <div class="corso-guardrail__head">
                <span class="corso-guardrail__code">C7</span>
                <span class="corso-guardrail__label">Responsabilità</span>
              </div>
              <p class="corso-guardrail__text">La decisione operativa appartiene a F3 e alle responsabilità disciplinari specifiche.</p>
            </div>
          </div>
        </div>
      `,
    },

    // ─── 9.10 ─────────────────────────────────────────────────────────
    {
      id: 'm09-s10',
      type: 'diagram',
      title: 'Configurazione Evolutiva del caso-guida',
      subtitle: 'Il prodotto grammaticale della pipeline',
      pipelineTopbar: topbar('CE'),
      content: `
        <div class="corso-two-col">
          <div class="corso-col">
            <pre style="background: var(--corso-bg); border: 1px solid var(--corso-border); border-left: 4px solid #16a085; border-radius: var(--corso-radius-md); padding: 16px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.92rem; line-height: 2; margin: 0;">CE =
  S: <span style="color: #2980b9;">N1~</span> <span style="color: #27ae60;">N2↑</span> <span style="color: #2980b9;">N3~</span> <span style="color: #e67e22;">N4↓</span> <span style="color: #2980b9;">N5~ N6~ N7~</span>
  R: <span style="color: #2980b9;">N2→N3 (MED)</span>
     <span style="color: #27ae60;">N7→N3 (CPL)</span>
     <span style="color: #e67e22;">N2→N1 (CMP)</span>
  D: <span style="color: #27ae60;">↗</span>
  T: T2
  A: A±
</pre>
          </div>

          <div class="corso-col">
            <div class="corso-box corso-box--valid" style="border-color: #16a085; background: #e8f8f5;">
              <div class="corso-box__title" style="color: #16a085;">Testo naturale</div>
              <p><em>«Campo relazionale espansivo che orienta e sostiene l'accesso al mondo condiviso, con esplorazione ancora ridotta. La configurazione è fragile ma con direzione evolutiva aperta.»</em></p>
            </div>

            <div style="margin-top: 12px;">
              <h3 class="corso-narrative__h3">Lettura sintetica</h3>
              <p>In questa situazione, l'accesso al mondo condiviso è possibile, sostenuto dalla relazione, ma non ancora pienamente stabile.</p>
            </div>

            <p class="corso-narrative__caption">Questa CE non dice che il bambino è competente. Non dice che è in difficoltà. Dice come il campo relazionale funziona <em>in questo momento specifico</em>.</p>

            <div class="corso-chip" style="background: #e8f8f5; border-color: #16a085; margin-top: 8px;">
              <span class="corso-chip__label">Regola</span>
              <span class="corso-chip__sub">La configurazione descrive il campo, non il bambino.</span>
            </div>
          </div>
        </div>
      `,
    },

    // ─── 9.11 ─────────────────────────────────────────────────────────
    {
      id: 'm09-s11',
      type: 'narrative',
      title: 'La soglia',
      subtitle: 'F2 produce la forma · F3 la riempie',
      pipelineTopbar: topbar('F3'),
      content: `
        <p>La Fase 2 si ferma qui. Ha prodotto leggibilità — non ha prescritto nulla. Ciò che viene dopo appartiene alle responsabilità disciplinari di ciascun professionista e al contesto specifico in cui opererà lo strumento.</p>

        <h3 class="corso-narrative__h3">Strumenti possibili in F3</h3>
        <table class="corso-table">
          <thead><tr><th>Contesto</th><th>Strumento possibile</th></tr></thead>
          <tbody>
            <tr><td><strong>Clinico</strong></td><td>Scheda breve per osservare la lettura condivisa nei bilanci di salute</td></tr>
            <tr><td><strong>Pedagogico</strong></td><td>Traccia per educatori del nido su libro e campo condiviso</td></tr>
            <tr><td><strong>Genitoriale</strong></td><td>Scheda semplice per aiutare il genitore a riconoscere i momenti di condivisione</td></tr>
            <tr><td><strong>Ricerca</strong></td><td>Griglia per codifica qualitativa di brevi video</td></tr>
            <tr><td><strong>Formativo</strong></td><td>Micro-caso per formazione di pediatri o volontari DBS/NPL</td></tr>
            <tr><td><strong>AI-assistito</strong></td><td>Prompt per trasformare descrizioni narrative in configurazioni leggibili</td></tr>
          </tbody>
        </table>

        <hr class="corso-divider" />

        <div class="corso-box corso-box--invalid" style="border-color: #f39c12; background: #fef9e7;">
          <div class="corso-box__title" style="color: #f39c12;">Cosa F2 non ha ancora fatto</div>
          <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.88rem;">Punteggi · Soglie · Protocolli operativi · Istruzioni per l'adulto · Raccomandazioni cliniche · Classificazioni del bambino</p>
        </div>
      `,
      guardrail: {
        code: 'C7',
        label: 'Responsabilità',
        text: 'La decisione clinica/educativa è fuori dal metodo. F2 non prescrive, non gestisce, non interviene.',
      },
    },

    // ─── 9.12 ─────────────────────────────────────────────────────────
    {
      id: 'm09-s12',
      type: 'narrative',
      title: 'Cosa ha reso possibile la Fase 2',
      subtitle: 'Nove motivi per cui questo esempio funziona',
      content: `
        <p>Questo percorso non è stato costruito attorno alla lettura condivisa perché è una tecnica educativa o una buona pratica. Ma perché è una <strong>situazione privilegiata di traducibilità</strong>: attraverso il libro, il bambino può mostrare come accede a un mondo comune.</p>

        <ol class="corso-card__body" style="font-size: 0.95rem; line-height: 1.8; padding-left: 24px;">
          <li>Parte da una situazione semplice e osservabile</li>
          <li>Conserva il riferimento alla fondazione ontologica</li>
          <li>Mantiene insieme i registri (linguaggio, attenzione, comportamento) anziché farli coincidere uno per uno con il fenomeno</li>
          <li>Mostra la multi-asseità del nodo</li>
          <li>Produce domande professionali non diagnostiche</li>
          <li>Costruisce un operatore di lettura strutturato</li>
          <li>Genera famiglie di output diverse con la stessa grammatica</li>
          <li>Arriva a un template vuoto riusabile</li>
          <li>Resta sulla soglia di F3 senza oltrepassarla</li>
        </ol>

        <hr class="corso-divider" />

        <div class="corso-box corso-box--valid" style="border-color: #c0392b; background: #fdedec; padding: 24px; margin-top: 16px;">
          <p style="text-align: center; line-height: 2; margin: 0;">
            La Fase 2 rende leggibile l'intreccio tra corpo, relazione, desiderio, simbolo e cultura.<br/>
            <em>Non dice ancora che cosa fare.</em><br/>
            <strong style="font-size: 1.1rem;">Mostra che cosa diventa visibile.</strong>
          </p>
        </div>

        <p class="corso-emph corso-emph--center" style="margin-top: 16px;">Da qui, la Fase 3 può costruire — con responsabilità.</p>
      `,
    },
  ],
};
