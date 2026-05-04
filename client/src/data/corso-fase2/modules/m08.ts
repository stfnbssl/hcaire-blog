import { Module, ExpandableCardData, TemplateTableSection } from '../types';

const CRITERI_VALIDITA: Array<ExpandableCardData & { tipo: string; tipoColor: string }> = [
  { id: 'c1', tipo: 'strutturale', tipoColor: '#27ae60', color: '#27ae60', badge: '1', title: 'È compilabile', summary: 'Il template ha sezioni reali, con domande guida e spazio per le risposte.', detail: '<p>Il template ha sezioni reali, con domande guida e spazio per le risposte.</p>' },
  { id: 'c2', tipo: 'strutturale', tipoColor: '#27ae60', color: '#27ae60', badge: '2', title: 'Resta neutro', summary: 'Nessuna sezione porta implicita una valutazione positiva o negativa.', detail: '<p>Nessuna sezione porta implicita una valutazione positiva o negativa.</p>' },
  { id: 'c3', tipo: 'limite', tipoColor: '#e74c3c', color: '#e74c3c', badge: '3', title: 'Non assegna punteggi', summary: 'Nessuna scala, nessun valore numerico, nessun 0-1-2.', detail: '<p>Nessuna scala, nessun valore numerico, nessun 0-1-2.</p>' },
  { id: 'c4', tipo: 'limite', tipoColor: '#e74c3c', color: '#e74c3c', badge: '4', title: 'Non contiene soglie', summary: 'Non dice «se X allora Y». Non definisce né normali né patologici.', detail: '<p>Non dice «se X allora Y». Non definisce né normali né patologici.</p>' },
  { id: 'c5', tipo: 'limite', tipoColor: '#e74c3c', color: '#e74c3c', badge: '5', title: 'Non formula diagnosi', summary: 'Non usa categorie diagnostiche; non orienta verso etichette cliniche.', detail: '<p>Non usa categorie diagnostiche; non orienta verso etichette cliniche.</p>' },
  { id: 'c6', tipo: 'limite', tipoColor: '#e74c3c', color: '#e74c3c', badge: '6', title: 'Non prescrive azioni', summary: 'Non dice cosa fare. Non orienta l\'intervento. Non consiglia.', detail: '<p>Non dice cosa fare. Non orienta l\'intervento. Non consiglia.</p>' },
  { id: 'c7', tipo: 'limite', tipoColor: '#e74c3c', color: '#e74c3c', badge: '7', title: 'Non giudica bambino, adulto o servizio', summary: 'Nessuna valutazione implicita sulla famiglia, sul professionista o sul contesto.', detail: '<p>Nessuna valutazione implicita sulla famiglia, sul professionista o sul contesto.</p>' },
  { id: 'c8', tipo: 'metodologico', tipoColor: '#2980b9', color: '#2980b9', badge: '8', title: 'Distingue osservazione e interpretazione', summary: 'Sezioni separate: «cosa si vede» e «come si legge». Non mischiate.', detail: '<p>Sezioni separate: «cosa si vede» e «come si legge». Non mischiate.</p>' },
  { id: 'c9', tipo: 'metodologico', tipoColor: '#2980b9', color: '#2980b9', badge: '9', title: 'Lascia spazio a domande aperte', summary: 'Include una sezione esplicita «cosa non è ancora leggibile».', detail: '<p>Include una sezione esplicita «cosa non è ancora leggibile».</p>' },
  { id: 'c10', tipo: 'strutturale', tipoColor: '#27ae60', color: '#27ae60', badge: '10', title: 'Può essere adattato in Fase 3', summary: 'La struttura è abbastanza generica da reggere contesti diversi.', detail: '<p>La struttura è abbastanza generica da reggere contesti diversi senza essere riscritta da zero.</p>' },
];

// Aggiunge la chip "tipo" al detail HTML.
const CRITERI_CARDS: ExpandableCardData[] = CRITERI_VALIDITA.map((c) => ({
  ...c,
  detail: `${c.detail}<p style="margin-top: 8px;"><span style="background: ${c.tipoColor}; color: white; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 3px 8px; border-radius: 3px;">${c.tipo}</span></p>`,
}));

const TEMPLATE_SEZIONI: TemplateTableSection[] = [
  {
    numero: 1,
    sezione: 'Situazione',
    domanda: 'In quale contesto avviene la sequenza?',
    campoVuoto: 'Contesto, attori, oggetto, durata',
    compilazione:
      'Bilancio pediatrico. Bambino 18-24 mesi, genitore presente, libro illustrato. Durata: 3-5 minuti.',
  },
  {
    numero: 2,
    sezione: 'Oggetto mediatore',
    domanda: 'Che cosa sta tra adulto e bambino?',
    campoVuoto: 'Libro, gioco, immagine, evento, altro',
    compilazione:
      'Libro illustrato con immagini semplici (animali, oggetti familiari, figure umane).',
  },
  {
    numero: 3,
    sezione: 'Campo condiviso',
    domanda: "L'oggetto diventa comune? Si costruisce un orientamento reciproco?",
    campoVuoto: 'Descrizione osservativa — non valutativa',
    compilazione:
      "Presente. Il bambino indica una figura e guarda l'adulto; il genitore nomina, sorride, attende. Alternanza di sguardo verso libro e adulto.",
  },
  {
    numero: 4,
    sezione: 'Iniziativa del bambino',
    domanda: "Il bambino introduce qualcosa di proprio nell'interazione?",
    campoVuoto: 'Gesti, sguardi, vocalizzi, scelte, rifiuti',
    compilazione:
      "Sì: indica una figura, vocalizza, gira pagina autonomamente, mostra un'altra figura all'adulto.",
  },
  {
    numero: 5,
    sezione: 'Risposta adulta',
    domanda: "L'adulto sostiene, segue, anticipa o dirige?",
    campoVuoto: 'Descrizione neutrale del comportamento adulto',
    compilazione:
      "L'adulto nomina l'immagine indicata, sorride, aspetta la risposta del bambino prima di procedere.",
  },
  {
    numero: 6,
    sezione: 'Continuità',
    domanda: 'Lo scambio si mantiene, si interrompe, si riprende?',
    campoVuoto: 'Sequenze di mantenimento / interruzione / ripresa',
    compilazione:
      'Sequenza breve ma stabile. Il bambino gira pagina (interruzione) e introduce nuova figura (ripresa).',
  },
  {
    numero: 7,
    sezione: 'Rapporto con il limite',
    domanda: 'Come vengono vissute attese, cambi di pagina, proposte adulte?',
    campoVuoto: 'Descrizione — integrabile / destabilizzante',
    compilazione:
      'Il bambino accetta di condividere il controllo del libro; la sequenza si interrompe e riprende. Limite integrabile.',
  },
  {
    numero: 8,
    sezione: 'Configurazione leggibile',
    domanda: 'Che forma assume complessivamente il campo?',
    campoVuoto: 'Sintesi non diagnostica — CE o descrizione strutturale',
    compilazione:
      'Campo condiviso presente ma fragile. Accesso al mondo condiviso sostenuto dalla relazione, non ancora autonomamente stabile. CE: N2↑ N3~ N4↓ | D: ↗ | A: A±',
  },
  {
    numero: 9,
    sezione: 'Domande aperte',
    domanda: 'Che cosa resta da osservare meglio?',
    campoVuoto: 'Questioni non risolte — per osservazioni successive',
    compilazione:
      'Come si comporta il campo con un adulto meno responsivo? Cosa accade quando il bambino è più stanco o meno regolato?',
  },
  {
    numero: 10,
    sezione: 'Possibili destinazioni',
    domanda: 'A quale famiglia di output può servire questo template compilato?',
    campoVuoto: 'Osservativa · Formativa · Restitutiva · Ricerca · Organizzativa · AI-assistita',
    compilazione:
      'Osservativa (scheda bilancio) + Formativa (micro-modulo pediatri/DBS) + Organizzativa (protocollo leggero).',
  },
];

const FORMULA_VUOTA =
  "In questa situazione, il campo condiviso appare _______; l'iniziativa del bambino si manifesta attraverso _______; la risposta adulta tende a _______; la continuità dello scambio è _______; il rapporto con il limite appare _______. La configurazione complessiva suggerisce _______.";

const FORMULA_COMPILATA =
  "In questa situazione, il campo condiviso appare presente ma discontinuo; l'iniziativa del bambino si manifesta attraverso indicazione e alternanza di sguardo; la risposta adulta tende a sostenere quando attende, ma a interrompere quando anticipa; la continuità dello scambio è fragile ma recuperabile; il rapporto con il limite appare tollerabile se mediato dall'adulto. La configurazione complessiva suggerisce un accesso al mondo condiviso sostenuto dalla relazione ma non ancora autonomamente stabile.";

// Mini-pipeline (8.1) come HTML statico.
function miniPipelineHTML(): string {
  const steps = [
    { code: 'F1', label: 'Fondazione', dim: true, phase: true },
    { code: '1', label: 'Campo', dim: true },
    { code: '2', label: 'Concetto-ponte', dim: true },
    { code: '3', label: 'Nodo', dim: true },
    { code: '4', label: 'Domande', dim: true },
    { code: '5', label: 'Operatore', dim: true },
    { code: '6', label: 'Famiglie', dim: true },
    { code: '7', label: 'Output-tipo', current: true },
    { code: 'F3', label: 'Strumento', dim: true, phase: true },
  ];
  return steps
    .map((s, i) => {
      const sep = i > 0 ? '<span style="color: var(--corso-text-muted); margin: 0 4px;">→</span>' : '';
      const style = s.current
        ? 'background: #27ae60; color: white; font-weight: 700;'
        : s.phase
          ? 'background: var(--corso-bg); color: var(--corso-text-2); border: 1px solid var(--corso-border); font-weight: 700; opacity: 0.8;'
          : 'background: var(--corso-bg); color: var(--corso-text-muted); opacity: 0.7;';
      return `${sep}<span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: var(--corso-radius-sm); font-size: 0.78rem; font-family: 'JetBrains Mono', monospace; ${style}"><strong>${s.code}</strong> <span style="font-family: inherit;">${s.label}</span></span>`;
    })
    .join('');
}

export const Module08: Module = {
  id: 'm08',
  number: 8,
  title: "L'Output-tipo vuoto",
  shortTitle: 'Template',
  accent: '#27ae60',
  slides: [
    // ─── 8.1 ──────────────────────────────────────────────────────────
    {
      id: 'm08-s01',
      type: 'standard',
      title: "L'output-tipo vuoto",
      subtitle: 'Ultimo passo di F2 — prova di completezza della traduzione',
      content: `
        <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: var(--corso-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;">Pipeline F2 · Passo 7 di 7 · Guardrail C6</p>

        <p>La traduzione interdisciplinare è completa quando è possibile costruire un template riutilizzabile — una forma che organizza la leggibilità senza ancora diventare strumento operativo. Questo è l'output-tipo vuoto: lo stampo da cui nasce l'azione di Fase 3.</p>

        <blockquote class="corso-blockquote" style="border-left-color: #27ae60; background: #eafaf1;">L'output-tipo vuoto è uno <strong>stampo riusabile</strong>. Non è ancora lo strumento contestualizzato. <strong>Non contiene criteri diagnostici, prescrizioni, soglie o punteggi.</strong></blockquote>

        <div class="corso-chips">
          <div class="corso-chip" style="background: #eafaf1; border-color: #27ae60;"><span class="corso-chip__icon">✓</span><span class="corso-chip__label">Verifica</span><span class="corso-chip__sub">la completezza della catena di traducibilità</span></div>
          <div class="corso-chip" style="background: #eafaf1; border-color: #27ae60;"><span class="corso-chip__icon">📐</span><span class="corso-chip__label">Organizza</span><span class="corso-chip__sub">la leggibilità del campo osservato</span></div>
          <div class="corso-chip" style="background: #eafaf1; border-color: #27ae60;"><span class="corso-chip__icon">🌉</span><span class="corso-chip__label">Prepara</span><span class="corso-chip__sub">la struttura per i riempimenti di F3</span></div>
        </div>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3">Posizione nella pipeline</h3>
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 2px; line-height: 2;">
          ${miniPipelineHTML()}
        </div>
      `,
      guardrail: {
        code: 'C6',
        label: 'Completezza',
        text: 'Il template è completo se può essere usato come base per futuri strumenti, ma resta ancora vuoto: non prescrive, non valuta, non assegna punteggi.',
      },
    },

    // ─── 8.2 ──────────────────────────────────────────────────────────
    {
      id: 'm08-s02',
      type: 'interactive',
      title: 'Quando un template è valido?',
      subtitle: '10 criteri di completezza e neutralità',
      intro: `
        <p>Tre tipi di criteri convergono sulla validità del template: <strong style="color: #27ae60;">strutturali</strong> (forma del template), <strong style="color: #e74c3c;">limite</strong> (cosa il template si rifiuta di fare), <strong style="color: #2980b9;">metodologici</strong> (distinzioni operative). Clicca per leggere la verifica operativa di ciascuno.</p>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: CRITERI_CARDS,
        layout: 'grid',
        multiOpen: true,
      },
      content: `
        <hr class="corso-divider" />
        <div class="corso-box corso-box--valid" style="border-color: #27ae60; background: #eafaf1;">
          <p style="margin: 0; text-align: center; font-size: 1.1rem;"><strong>«Il template vuoto organizza la lettura, non decide l'intervento.»</strong></p>
        </div>
      `,
    },

    // ─── 8.3 ──────────────────────────────────────────────────────────
    {
      id: 'm08-s03',
      type: 'interactive',
      title: 'Scheda vuota di leggibilità del mondo condiviso',
      subtitle: 'Template applicato al caso-guida — sezioni compilabili',
      intro: `
        <p>Lo stesso template, con due viste: la <strong>forma vuota</strong> (cosa si chiede di osservare) e la <strong>compilazione</strong> sul caso-guida (come si compilerebbe). Clicca su una riga per cambiarne lo stato, oppure usa il bottone globale per passare in blocco.</p>
      `,
      interactive: {
        kind: 'template-table',
        header: {
          titolo: 'Scheda vuota di leggibilità del mondo condiviso',
          nodo: 'N3 — Accesso al mondo condiviso simbolico',
          concettoPonte: 'Accesso al mondo condiviso',
        },
        sezioni: TEMPLATE_SEZIONI,
        formulaSintesi: FORMULA_VUOTA,
        formulaCompilata: FORMULA_COMPILATA,
      },
    },

    // ─── 8.4 ──────────────────────────────────────────────────────────
    {
      id: 'm08-s04',
      type: 'comparison',
      title: 'Due forme, due funzioni',
      subtitle: 'Template F2 e strumento F3 a confronto',
      content: `
        <table class="corso-table">
          <thead>
            <tr>
              <th>Aspetto</th>
              <th style="background: #eafaf1; color: #27ae60;">Template vuoto · F2</th>
              <th style="background: #fef9e7; color: #f39c12;">Strumento contestualizzato · F3</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><strong>Funzione</strong></td><td style="color: #1e8449;">Organizzare la leggibilità</td><td style="color: #d35400;">Guidare un uso concreto</td></tr>
            <tr><td><strong>Contesto</strong></td><td style="color: #1e8449;">Generico o semi-generico</td><td style="color: #d35400;">Specifico e definito</td></tr>
            <tr><td><strong>Destinatario</strong></td><td style="color: #1e8449;">Non ancora definitivo</td><td style="color: #d35400;">Definito</td></tr>
            <tr><td><strong>Indicatori</strong></td><td style="color: #1e8449;">Aperti</td><td style="color: #d35400;">Stabilizzati</td></tr>
            <tr><td><strong>Punteggi</strong></td><td style="color: #1e8449;">Assenti</td><td style="color: #d35400;">Possibili, se giustificati</td></tr>
            <tr><td><strong>Istruzioni</strong></td><td style="color: #1e8449;">Assenti</td><td style="color: #d35400;">Presenti</td></tr>
            <tr><td><strong>Validazione</strong></td><td style="color: #1e8449;">Non richiesta come strumento</td><td style="color: #d35400;">Necessaria se usato formalmente</td></tr>
            <tr><td><strong>Responsabilità</strong></td><td style="color: #1e8449;">Metodologica</td><td style="color: #d35400;">Professionale / istituzionale</td></tr>
            <tr><td><strong>Output</strong></td><td style="color: #1e8449;">Configurazione leggibile</td><td style="color: #d35400;">Scheda, protocollo, guida, modulo</td></tr>
          </tbody>
        </table>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3">Tre formulazioni della stessa regola</h3>
        <div class="corso-cards corso-cards--vertical">
          <div class="corso-card corso-card--open" style="--corso-card-accent: #27ae60;">
            <div class="corso-card__head"><span class="corso-card__badge">1</span><span class="corso-card__title">Formulazione operativa</span></div>
            <div class="corso-card__body"><p><em>«Il template vuoto organizza la lettura, non decide l'intervento.»</em></p></div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #27ae60;">
            <div class="corso-card__head"><span class="corso-card__badge">2</span><span class="corso-card__title">Formulazione critica</span></div>
            <div class="corso-card__body"><p><em>«Il template vuoto non è uno strumento debole: è uno strumento <strong>trattenuto</strong>.»</em></p></div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #27ae60;">
            <div class="corso-card__head"><span class="corso-card__badge">3</span><span class="corso-card__title">Formulazione tecnica</span></div>
            <div class="corso-card__body"><p><em>«L'output-tipo vuoto è la <strong>prova che la traduzione è completa</strong>, non la prova che l'intervento è già definito.»</em></p></div>
          </div>
        </div>

        <hr class="corso-divider" />

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
              <p class="corso-guardrail__text">La decisione operativa appartiene a F3 e alle responsabilità disciplinari specifiche. F2 produce solo la grammatica di traducibilità.</p>
            </div>
          </div>
        </div>
      `,
    },

    // ─── 8.5 ──────────────────────────────────────────────────────────
    {
      id: 'm08-s05',
      type: 'narrative',
      title: 'Da qui, si costruisce',
      subtitle: 'Le famiglie di output e la soglia verso Fase 3',
      content: `
        <p>Il template vuoto mostra che la traduzione è riuscita. Ora è possibile costruire. Ogni famiglia di output è una <strong>classe di prodotti possibili</strong> — non ancora uno strumento definitivo, ma la direzione che lo strumento prenderà in Fase 3.</p>

        <h3 class="corso-narrative__h3">Sette famiglie di output</h3>
        <table class="corso-table">
          <thead><tr><th>Famiglia</th><th>Possibile forma</th></tr></thead>
          <tbody>
            <tr><td><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #2980b9; margin-right: 8px;"></span><strong>Osservativa</strong></td><td>Scheda di osservazione della lettura condivisa</td></tr>
            <tr><td><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #16a085; margin-right: 8px;"></span><strong>Formativa</strong></td><td>Micro-modulo per pediatri o educatori</td></tr>
            <tr><td><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #8e44ad; margin-right: 8px;"></span><strong>Restitutiva</strong></td><td>Traccia di colloquio con il genitore</td></tr>
            <tr><td><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #d35400; margin-right: 8px;"></span><strong>Riflessiva</strong></td><td>Domande guida per l'adulto di riferimento</td></tr>
            <tr><td><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27ae60; margin-right: 8px;"></span><strong>Ricerca</strong></td><td>Griglia per confrontare sequenze video</td></tr>
            <tr><td><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #c0392b; margin-right: 8px;"></span><strong>Organizzativa</strong></td><td>Protocollo per inserire la lettura nei bilanci di salute</td></tr>
            <tr><td><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #7f8c8d; margin-right: 8px;"></span><strong>AI-assistita</strong></td><td>Prompt per analizzare trascrizioni o descrizioni di sequenze</td></tr>
          </tbody>
        </table>

        <hr class="corso-divider" />
        <p class="corso-emph corso-emph--center" style="color: var(--corso-text-muted); letter-spacing: 0.1em;">— Soglia F3 —</p>

        <h3 class="corso-narrative__h3">Strumenti possibili in F3 — caso-guida</h3>
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

        <p class="corso-narrative__caption">F2 si ferma qui. La costruzione degli strumenti, la definizione dei protocolli, la validazione: tutto questo appartiene alla responsabilità disciplinare di F3.</p>

        <hr class="corso-divider" />

        <div class="corso-box corso-box--valid" style="border-color: #27ae60; background: #eafaf1;">
          <p style="margin: 0; text-align: center; line-height: 2; font-size: 1.05rem;">
            La <strong>Fase 2</strong> ha prodotto <strong>leggibilità</strong>.<br/>
            La <strong>Fase 3</strong> produce <strong>azione</strong>.<br/>
            Il <strong>template vuoto</strong> è il punto di passaggio.
          </p>
        </div>
      `,
    },
  ],
};
