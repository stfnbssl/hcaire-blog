import { Module } from '../types';
import { CASO_GUIDA } from '../caso-guida';

export const Module00: Module = {
  id: 'm00',
  number: 0,
  title: "Orientamento nell'architettura",
  shortTitle: 'Orientamento',
  accent: '#1a6b8a',
  slides: [
    // ─── 0.1 ──────────────────────────────────────────────────────────
    {
      id: 'm00-s01',
      type: 'narrative',
      title: 'Il problema di partenza',
      content: `
        <div class="corso-narrative corso-narrative--centered">
          <blockquote class="corso-quote">
            <p>Un bambino di 20 mesi guarda un libro illustrato insieme alla madre.</p>
            <p>Indica una figura, vocalizza, poi guarda la madre.</p>
            <p>Lei nomina la figura e sorride.</p>
            <p class="corso-quote__cta"><strong>Come leggiamo questa scena?</strong></p>
          </blockquote>

          <div class="corso-chips">
            <div class="corso-chip"><span class="corso-chip__icon">🩺</span><span class="corso-chip__label">Il pediatra</span><span class="corso-chip__sub">«Competenza linguistica nella norma?»</span></div>
            <div class="corso-chip"><span class="corso-chip__icon">📚</span><span class="corso-chip__label">L'educatore</span><span class="corso-chip__sub">«Attenzione sostenuta?»</span></div>
            <div class="corso-chip"><span class="corso-chip__icon">👨‍👩‍👧</span><span class="corso-chip__label">Il genitore</span><span class="corso-chip__sub">«Capisce già le immagini?»</span></div>
          </div>

          <p class="corso-narrative__caption">
            Tre osservatori, tre linguaggi, tre domande diverse — sulla stessa scena.
          </p>
        </div>
      `,
      notes:
        'Questo caso attraverserà tutto il corso. Lo ritroveremo in ogni modulo.',
    },

    // ─── 0.2 ──────────────────────────────────────────────────────────
    {
      id: 'm00-s02',
      type: 'diagram',
      title: 'Un metodo in tre fasi',
      subtitle: "L'architettura del metodo",
      interactive: {
        kind: 'expandable-cards',
        layout: 'vertical',
        multiOpen: true,
        defaultOpen: ['f2'],
        cards: [
          {
            id: 'f1',
            color: '#6c63ff',
            badge: 'F1',
            title: 'Fondazione ontologica',
            summary: '«Cosa è lo sviluppo»',
            detail: `
              <p><strong>Funzione</strong> · Stabilisce <em>che tipo di realtà</em> è lo sviluppo infantile e <em>che tipo di soggetto</em> è il bambino.</p>
              <p><strong>Output verso F2</strong> · I sei assi strutturali come condizioni di possibilità.</p>
              <p class="corso-card__hint">Non produce strumenti. Fonda i vincoli.</p>
            `,
          },
          {
            id: 'f2',
            color: '#1a6b8a',
            badge: 'F2',
            title: 'Traduzione interdisciplinare',
            summary: '«Come si rende leggibile» — siamo qui',
            detail: `
              <p><strong>Funzione</strong> · Rende lo sviluppo <strong>leggibile</strong> nei contesti professionali senza perderne la complessità.</p>
              <p><strong>Input</strong> · gli assi strutturali della F1.</p>
              <p><strong>Output</strong> · condizioni di traducibilità (Nodi, Matrice, Grammatica).</p>
              <p class="corso-card__hint corso-card__hint--accent">Regola fondamentale: <strong>F2 produce leggibilità, non azione.</strong></p>
            `,
          },
          {
            id: 'f3',
            color: '#2d9cdb',
            badge: 'F3',
            title: 'Strumenti operativi',
            summary: '«Come si agisce»',
            detail: `
              <p><strong>Funzione</strong> · Trasforma la leggibilità in micro-azioni coerenti senza produrre protocolli, diagnosi o prescrizioni.</p>
              <p>Richiede F2 come prerequisito. La decisione disciplinare resta fuori dal metodo.</p>
            `,
          },
        ],
      },
      content: `
        <div class="corso-fase-keywords">
          <span><strong>DEFINISCE</strong></span>
          <span class="corso-fase-keywords__sep">→</span>
          <span><strong>RENDE LEGGIBILE</strong></span>
          <span class="corso-fase-keywords__sep">→</span>
          <span><strong>RENDE POSSIBILE L'AZIONE</strong></span>
        </div>
      `,
    },

    // ─── 0.3 ──────────────────────────────────────────────────────────
    {
      id: 'm00-s03',
      type: 'standard',
      title: 'Da dove veniamo: la Fase 1',
      subtitle: 'Gli assi strutturali di sviluppo',
      content: `
        <div class="corso-two-col corso-two-col--40-60">
          <div class="corso-col">
            <p>Il metodo assume un'ontologia specifica: il bambino non è un organismo che accumula competenze, né un insieme di funzioni che maturano in sequenza.</p>
            <p>È un <strong>soggetto incarnato, temporale e relazionale</strong>.</p>
            <p>Gli assi strutturali non sono fasi da attraversare né competenze da misurare. Sono le <strong>dimensioni sempre attive</strong> dell'esperienza in sviluppo.</p>
          </div>
          <div class="corso-col">
            <table class="corso-table corso-table--axes">
              <thead>
                <tr><th>#</th><th>Asse</th><th>Domanda guida</th></tr>
              </thead>
              <tbody>
                <tr class="corso-table__row--highlight">
                  <td>1</td>
                  <td>Ontologico-fenomenologico</td>
                  <td>Come abita il bambino l'esperienza?</td>
                </tr>
                <tr><td>2</td><td>Affettivo-morale</td><td>Come riconosce l'altro come portatore di esperienza propria?</td></tr>
                <tr><td>3</td><td>Normativo-educativo</td><td>Come emerge la capacità di orientare l'azione secondo criteri condivisi?</td></tr>
                <tr><td>4</td><td>Separazione e limite reale</td><td>Come incontra la resistenza del reale?</td></tr>
                <tr><td>5</td><td>Desiderio</td><td>Come si orienta verso possibilità che eccedono il presente?</td></tr>
                <tr><td>6</td><td>Rapporto con il mondo storico-culturale</td><td>Come entra nella partecipazione al mondo condiviso?</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      `,
      notes:
        'Gli assi sono strutture interpretative, non variabili empiriche. Non si misurano: orientano la costruzione degli strumenti.',
    },

    // ─── 0.4 ──────────────────────────────────────────────────────────
    {
      id: 'm00-s04',
      type: 'standard',
      title: 'Cosa fa la Fase 2',
      subtitle: 'Il cuore metodologico',
      content: `
        <div class="corso-section">
          <blockquote class="corso-blockquote corso-blockquote--accent-f2">
            «Costruire condizioni di traducibilità tra livelli disciplinari differenti senza perdita dello statuto teorico originario.»
          </blockquote>
          <p>La F2 occupa il <strong>cuore metodologico</strong> dell'intero progetto. Non produce ancora strumenti operativi. Il suo scopo è uno solo: rendere lo sviluppo <strong>leggibile</strong> ai professionisti di discipline diverse.</p>
        </div>

        <hr class="corso-divider" />

        <div class="corso-two-col">
          <div class="corso-box corso-box--valid">
            <div class="corso-box__title">✓ F2 produce</div>
            <ul>
              <li>Leggibilità strutturale</li>
              <li>Domande professionali condivisibili</li>
              <li>Configurazioni osservative</li>
              <li>Condizioni per costruire strumenti</li>
            </ul>
          </div>
          <div class="corso-box corso-box--invalid">
            <div class="corso-box__title">✗ F2 non produce</div>
            <ul>
              <li>Strumenti operativi</li>
              <li>Protocolli d'intervento</li>
              <li>Diagnosi</li>
              <li>Prescrizioni educative</li>
            </ul>
          </div>
        </div>

        <p class="corso-emph corso-emph--center">La F2 separa esplicitamente osservazione e decisione operativa.</p>
      `,
    },

    // ─── 0.5 ──────────────────────────────────────────────────────────
    {
      id: 'm00-s05',
      type: 'narrative',
      title: 'Il nostro caso-guida',
      subtitle: 'Una lettura condivisa in ambulatorio',
      content: `
        <div class="corso-narrative">
          <div class="corso-scena">
            ${CASO_GUIDA.scena
              .split('\n\n')
              .map((p) => `<p><em>${p.trim()}</em></p>`)
              .join('')}
          </div>

          <h3 class="corso-narrative__h3">Come la leggono le discipline</h3>
          <table class="corso-table corso-table--readings">
            <thead>
              <tr><th>Disciplina</th><th>Lettura comune</th><th>Cosa resta in ombra</th></tr>
            </thead>
            <tbody>
              <tr><td>🩺 Pediatria</td><td>«Competenza linguistica nella norma»</td><td>Il piano della prestazione è in primo piano; il campo relazionale che la sostiene resta sullo sfondo</td></tr>
              <tr><td>📚 Pedagogia</td><td>«Buona attenzione sostenuta»</td><td>La funzione cognitiva è ben colta; la dimensione di scambio fra bambino e adulto non viene tematizzata</td></tr>
              <tr><td>🧠 NPI</td><td>«Assenza di segnali di allerta»</td><td>Lo sguardo clinico esclude il rischio; non è il suo compito descrivere la configurazione evolutiva positiva</td></tr>
            </tbody>
          </table>
          <p class="corso-narrative__caption">Ogni disciplina opera legittimamente una propria focalizzazione. Il problema non è la focalizzazione in sé, ma la difficoltà di mettere in relazione gli sguardi quando ognuno parla solo il proprio linguaggio.</p>

          <p class="corso-question">Come integriamo questi sguardi senza perdere ampiezza?</p>
          <p class="corso-narrative__caption">Questo è il problema che la Fase 2 affronta — non sostituendo le letture disciplinari, ma offrendo una cornice che permetta di metterle in relazione. Torneremo su questa scena in ogni modulo.</p>
        </div>
      `,
    },
  ],
};
