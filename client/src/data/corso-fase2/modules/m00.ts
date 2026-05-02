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
        <div class="cf2-narrative cf2-narrative--centered">
          <blockquote class="cf2-quote">
            <p>Un bambino di 20 mesi guarda un libro illustrato insieme alla madre.</p>
            <p>Indica una figura, vocalizza, poi guarda la madre.</p>
            <p>Lei nomina la figura e sorride.</p>
            <p class="cf2-quote__cta"><strong>Come leggiamo questa scena?</strong></p>
          </blockquote>

          <div class="cf2-chips">
            <div class="cf2-chip"><span class="cf2-chip__icon">🩺</span><span class="cf2-chip__label">Il pediatra</span><span class="cf2-chip__sub">«Competenza linguistica nella norma?»</span></div>
            <div class="cf2-chip"><span class="cf2-chip__icon">📚</span><span class="cf2-chip__label">L'educatore</span><span class="cf2-chip__sub">«Attenzione sostenuta?»</span></div>
            <div class="cf2-chip"><span class="cf2-chip__icon">👨‍👩‍👧</span><span class="cf2-chip__label">Il genitore</span><span class="cf2-chip__sub">«Capisce già le immagini?»</span></div>
          </div>

          <p class="cf2-narrative__caption">
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
              <p class="cf2-card__hint">Non produce strumenti. Fonda i vincoli.</p>
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
              <p class="cf2-card__hint cf2-card__hint--accent">Regola fondamentale: <strong>F2 produce leggibilità, non azione.</strong></p>
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
        <div class="cf2-fase-keywords">
          <span><strong>DEFINISCE</strong></span>
          <span class="cf2-fase-keywords__sep">→</span>
          <span><strong>RENDE LEGGIBILE</strong></span>
          <span class="cf2-fase-keywords__sep">→</span>
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
        <div class="cf2-two-col cf2-two-col--40-60">
          <div class="cf2-col">
            <p>Il metodo assume un'ontologia specifica: il bambino non è un organismo che accumula competenze, né un insieme di funzioni che maturano in sequenza.</p>
            <p>È un <strong>soggetto incarnato, temporale e relazionale</strong>.</p>
            <p>Gli assi strutturali non sono fasi da attraversare né competenze da misurare. Sono le <strong>dimensioni sempre attive</strong> dell'esperienza in sviluppo.</p>
          </div>
          <div class="cf2-col">
            <table class="cf2-table cf2-table--axes">
              <thead>
                <tr><th>#</th><th>Asse</th><th>Domanda guida</th></tr>
              </thead>
              <tbody>
                <tr class="cf2-table__row--highlight">
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
        <div class="cf2-section">
          <blockquote class="cf2-blockquote cf2-blockquote--accent-f2">
            «Costruire condizioni di traducibilità tra livelli disciplinari differenti senza perdita dello statuto teorico originario.»
          </blockquote>
          <p>La F2 occupa il <strong>cuore metodologico</strong> dell'intero progetto. Non produce ancora strumenti operativi. Il suo scopo è uno solo: rendere lo sviluppo <strong>leggibile</strong> ai professionisti di discipline diverse.</p>
        </div>

        <hr class="cf2-divider" />

        <div class="cf2-two-col">
          <div class="cf2-box cf2-box--valid">
            <div class="cf2-box__title">✓ F2 produce</div>
            <ul>
              <li>Leggibilità strutturale</li>
              <li>Domande professionali condivisibili</li>
              <li>Configurazioni osservative</li>
              <li>Condizioni per costruire strumenti</li>
            </ul>
          </div>
          <div class="cf2-box cf2-box--invalid">
            <div class="cf2-box__title">✗ F2 non produce</div>
            <ul>
              <li>Strumenti operativi</li>
              <li>Protocolli d'intervento</li>
              <li>Diagnosi</li>
              <li>Prescrizioni educative</li>
            </ul>
          </div>
        </div>

        <p class="cf2-emph cf2-emph--center">La F2 separa esplicitamente osservazione e decisione operativa.</p>
      `,
    },

    // ─── 0.5 ──────────────────────────────────────────────────────────
    {
      id: 'm00-s05',
      type: 'narrative',
      title: 'Il nostro caso-guida',
      subtitle: 'Una lettura condivisa in ambulatorio',
      content: `
        <div class="cf2-narrative">
          <div class="cf2-scena">
            ${CASO_GUIDA.scena
              .split('\n\n')
              .map((p) => `<p><em>${p.trim()}</em></p>`)
              .join('')}
          </div>

          <h3 class="cf2-narrative__h3">Come la leggono le discipline</h3>
          <table class="cf2-table cf2-table--readings">
            <thead>
              <tr><th>Disciplina</th><th>Lettura comune</th><th>Problema</th></tr>
            </thead>
            <tbody>
              <tr><td>🩺 Pediatria</td><td>«Competenza linguistica nella norma»</td><td>Riduce a prestazione</td></tr>
              <tr><td>📚 Pedagogia</td><td>«Buona attenzione sostenuta»</td><td>Riduce a funzione cognitiva</td></tr>
              <tr><td>🧠 NPI</td><td>«Assenza di segnali di allerta»</td><td>Riduce a esclusione del deficit</td></tr>
            </tbody>
          </table>

          <p class="cf2-question">Come leggiamo questa scena senza ridurla?</p>
          <p class="cf2-narrative__caption">Questo è il problema che la Fase 2 risolve. Torneremo su questa scena in ogni modulo.</p>
        </div>
      `,
    },
  ],
};
