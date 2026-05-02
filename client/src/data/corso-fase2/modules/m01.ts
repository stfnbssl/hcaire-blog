import { Module, FlipCardData, ProgressiveRevealItem } from '../types';

const TRE_ANOMALIE: ProgressiveRevealItem[] = [
  {
    id: 'riduzione-psicologica',
    badge: '01',
    title: 'Riduzione psicologica',
    bodyHtml: `
      <p>Un concetto ontologico — che riguarda la struttura dell'esperienza del bambino — viene trasformato in un <strong>tratto individuale</strong>: una caratteristica della sua personalità, del suo temperamento, del suo funzionamento interno.</p>
      <div class="cf2-reveal__examples">
        <div class="cf2-reveal__ex cf2-reveal__ex--bad"><span class="cf2-reveal__ex-mark">✗</span><em>«Il bambino ha scarsa capacità di attenzione condivisa.»</em></div>
        <div class="cf2-reveal__ex cf2-reveal__ex--good"><span class="cf2-reveal__ex-mark">✓</span><em>«In questa sequenza il campo condiviso si interrompe rapidamente e richiede forte sostegno adulto per riorganizzarsi.»</em></div>
      </div>
      <p class="cf2-reveal__loss"><strong>Cosa si perde</strong> · Il campo relazionale sparisce. Resta solo il bambino con le sue caratteristiche.</p>
    `,
  },
  {
    id: 'tecnicizzazione-precoce',
    badge: '02',
    title: 'Tecnicizzazione precoce',
    bodyHtml: `
      <p>Un concetto interpretativo — che serve a leggere una situazione — viene trasformato in <strong>procedura d'intervento</strong>: cosa fare, quando, con quali passi.</p>
      <div class="cf2-reveal__examples">
        <div class="cf2-reveal__ex cf2-reveal__ex--bad"><span class="cf2-reveal__ex-mark">✗</span><em>«Occorre proporre al genitore un training sulla lettura dialogica.»</em></div>
        <div class="cf2-reveal__ex cf2-reveal__ex--good"><span class="cf2-reveal__ex-mark">✓</span><em>«La situazione suggerisce una configurazione in cui il campo relazionale sostiene l'accesso al mondo condiviso, ma la continuità temporale dello scambio resta fragile.»</em></div>
      </div>
      <p class="cf2-reveal__loss"><strong>Cosa si perde</strong> · La lettura della configurazione salta. Si va direttamente all'azione senza passare per la comprensione.</p>
    `,
  },
  {
    id: 'normativita-implicita',
    badge: '03',
    title: 'Normatività implicita',
    bodyHtml: `
      <p>Una descrizione del funzionamento evolutivo diventa implicitamente <strong>prescrizione</strong>: suggerisce cosa è normale, cosa è adeguato, cosa dovrebbe succedere.</p>
      <div class="cf2-reveal__examples">
        <div class="cf2-reveal__ex cf2-reveal__ex--bad"><span class="cf2-reveal__ex-mark">✗</span><em>«L'adulto deve rallentare, attendere tre secondi e poi nominare l'immagine.»</em></div>
        <div class="cf2-reveal__ex cf2-reveal__ex--good"><span class="cf2-reveal__ex-mark">✓</span><em>«Quando l'adulto accelera troppo la sequenza, il bambino interrompe lo scambio; quando attende, il bambino riprende a indicare e vocalizzare.»</em></div>
      </div>
      <p class="cf2-reveal__loss"><strong>Cosa si perde</strong> · La descrizione si trasforma in norma. Il professionista si trova a dire cosa si deve fare, non cosa si vede.</p>
    `,
  },
];

const CRITERI_VALIDITA: FlipCardData[] = [
  {
    id: 'c01',
    number: '1',
    title: 'Ancoraggio alla Fase 1',
    question: 'Il concetto fondativo è ancora riconoscibile?',
    valid: {
      text: "Il bambino entra, attraverso corpo, sguardo, gesto e relazione, in un campo di esperienza condivisibile con l'adulto.",
      perche: 'Resta riconoscibile il fondamento: soggetto incarnato, relazionale, orientato al mondo.',
    },
    invalid: {
      text: 'Il bambino ha buona attenzione visiva.',
      perche: "Isola una funzione, perde il campo relazionale, riduce l'esperienza a prestazione cognitiva.",
    },
  },
  {
    id: 'c02',
    number: '2',
    title: 'Osservabilità situata',
    question: 'Chi, dove, cosa, con quali vincoli?',
    valid: {
      text: 'Durante un bilancio dei 18 mesi, il pediatra osserva il bambino mentre sfoglia un libro col genitore: guarda figure, vocalizza, indica un animale e alterna lo sguardo tra libro e adulto.',
      perche: 'Ha contesto, attori, oggetto e osservabili precisi.',
    },
    invalid: {
      text: 'Il bambino sviluppa il simbolico attraverso la relazione.',
      perche: 'Idea generale corretta, ma manca il campo osservativo: non è ancora un esempio metodologico.',
    },
  },
  {
    id: 'c03',
    number: '3',
    title: 'Non-diagnosticità',
    question: 'Evita ogni etichetta — clinica, psicologica o morale?',
    valid: {
      text: "Il bambino entra nel campo condiviso solo per brevi sequenze; l'adulto sostiene l'attenzione nominando le figure, ma il passaggio tra libro, gesto e sguardo resta discontinuo.",
      perche: 'Descrive una configurazione fragile senza classificarla né prescrivere.',
    },
    invalid: {
      text: "Il bambino presenta un ritardo dell'attenzione condivisa.",
      perche: 'Anticipa una classificazione clinica. Non appartiene alla Fase 2.',
    },
  },
  {
    id: 'c04',
    number: '4',
    title: 'Neutralità normativa',
    question: 'Descrive o prescrive?',
    valid: {
      text: "Quando l'adulto accelera la sequenza, il bambino interrompe lo scambio; quando l'adulto attende, il bambino riprende a indicare e vocalizzare.",
      perche: 'Osserva una relazione tra comportamenti senza dire cosa si deve fare.',
    },
    invalid: {
      text: "L'adulto deve rallentare, attendere tre secondi e poi nominare l'immagine.",
      perche: 'Può diventare uno strumento in F3, ma in F2 è prematura: trasforma la lettura in prescrizione.',
    },
  },
  {
    id: 'c05',
    number: '5',
    title: 'Multi-asseità',
    question: "Mostra l'intreccio di più assi strutturali?",
    valid: {
      text: "Il corpo è orientato verso libro e adulto; la relazione sostiene l'attenzione; il gesto indica qualcosa di condivisibile; il desiderio appare come interesse verso alcune figure; il linguaggio adulto introduce un mondo simbolico comune.",
      perche: 'Intreccio di Asse 1 (corpo), Asse 2 (relazione), Asse 5 (desiderio), Asse 6 (mondo simbolico).',
    },
    invalid: {
      text: 'Il bambino indica correttamente tre figure.',
      perche: 'Dato comportamentale utile ma mono-dimensionale: non mostra la configurazione multi-asse.',
    },
  },
  {
    id: 'c06',
    number: '6',
    title: 'Traducibilità interdisciplinare',
    question: 'Può essere letto da discipline diverse senza appartenere a nessuna in esclusiva?',
    valid: {
      text: "Il bambino trasforma l'immagine del libro in un'occasione di scambio: guarda, indica, vocalizza e cerca la risposta dell'adulto.",
      perche: 'Parla a pediatria, psicologia, pedagogia e relazione genitoriale.',
    },
    invalid: {
      text: 'Il bambino mostra competenze referenziali proto-dichiarative adeguate.',
      perche: 'Formulazione specialistica: tecnicamente utile, ma non funziona come traduzione interdisciplinare.',
    },
  },
  {
    id: 'c07',
    number: '7',
    title: 'Separazione leggibilità / azione',
    question: 'Produce maggiore capacità di vedere — non ancora una decisione?',
    valid: {
      text: 'La situazione suggerisce una configurazione in cui il campo relazionale sostiene il mondo condiviso, ma la continuità temporale dello scambio resta fragile.',
      perche: 'Aumenta la comprensione. Non dice ancora cosa fare.',
    },
    invalid: {
      text: 'Occorre proporre al genitore un training sulla lettura dialogica.',
      perche: "È già una decisione d'intervento. Può venire dopo, ma non è compito della Fase 2.",
    },
  },
  {
    id: 'c08',
    number: '8',
    title: 'Anti-inferenza',
    question: 'Distingui ciò che si osserva da ciò che si interpreta?',
    valid: {
      text: "Il bambino allontana il libro, guarda verso la porta e non risponde alla proposta dell'adulto. In questa sequenza il campo condiviso non si stabilizza.",
      perche: 'Descrive comportamenti osservabili e nomina la configurazione risultante — senza inferire stati interni.',
    },
    invalid: {
      text: 'Il bambino non è interessato alla lettura.',
      perche: 'Inferenza troppo rapida: potrebbe essere stanco, sovraccarico, distratto o attratto da altro.',
    },
  },
  {
    id: 'c09',
    number: '9',
    title: 'Reversibilità',
    question: 'Configurazione situata o tratto stabile del bambino?',
    valid: {
      text: "In questa sequenza il bambino fatica a mantenere il campo condiviso, ma lo recupera quando l'adulto rallenta e segue il suo gesto.",
      perche: 'La configurazione è situata, temporanea, modificabile. Non fissa il bambino.',
    },
    invalid: {
      text: "Il bambino non sa condividere l'attenzione.",
      perche: 'Trasforma una configurazione osservata in un tratto del bambino. Viola il principio di reversibilità.',
    },
  },
  {
    id: 'c10',
    number: '10',
    title: 'Protezione dal moralismo',
    question: "Evita giudizi impliciti sull'adulto, sul bambino o sulla famiglia?",
    valid: {
      text: "L'adulto tende a guidare la sequenza; il bambino partecipa soprattutto quando può scegliere la figura da guardare.",
      perche: 'Descrive la dinamica relazionale senza valutare chi sbaglia o chi fa bene.',
    },
    invalid: {
      text: "L'adulto è troppo direttivo e non lascia spazio al bambino.",
      perche: 'Può cogliere qualcosa di reale, ma la formula è giudicante. Non appartiene alla Fase 2.',
    },
  },
];

export const Module01: Module = {
  id: 'm01',
  number: 1,
  title: 'Il problema della traduzione senza riduzione',
  shortTitle: 'Traduzione',
  accent: '#6c63ff',
  slides: [
    // ─── 1.1 ──────────────────────────────────────────────────────────
    {
      id: 'm01-s01',
      type: 'narrative',
      title: 'Il problema di partenza',
      subtitle: 'Più linguaggi, stessa scena',
      content: `
        <div class="cf2-narrative">
          <div class="cf2-scena">
            <p><em>Il bambino indica una figura del libro. Vocalizza. Guarda la madre. Lei sorride e nomina l'immagine.</em></p>
          </div>

          <h3 class="cf2-narrative__h3">Quattro discipline, quattro domande</h3>
          <div class="cf2-chips">
            <div class="cf2-chip"><span class="cf2-chip__icon">🩺</span><span class="cf2-chip__label">Pediatria</span><span class="cf2-chip__sub">«È nella norma per 18 mesi?»</span></div>
            <div class="cf2-chip"><span class="cf2-chip__icon">📚</span><span class="cf2-chip__label">Pedagogia</span><span class="cf2-chip__sub">«L'ambiente è stimolante?»</span></div>
            <div class="cf2-chip"><span class="cf2-chip__icon">🧠</span><span class="cf2-chip__label">NPI</span><span class="cf2-chip__sub">«Ci sono segnali d'allerta?»</span></div>
            <div class="cf2-chip"><span class="cf2-chip__icon">👨‍👩‍👧</span><span class="cf2-chip__label">Counseling</span><span class="cf2-chip__sub">«Il legame genitore-bambino funziona?»</span></div>
          </div>

          <p class="cf2-emph cf2-emph--center">Quattro sguardi legittimi. Quattro linguaggi diversi. Nessuno sbagliato.</p>
          <p class="cf2-narrative__caption">Ma se ognuno legge solo con il proprio linguaggio, il passaggio dall'uno all'altro rischia di produrre errori. La traduzione diretta tra discipline — senza un livello intermedio — genera anomalie.</p>

          <p class="cf2-question">Quali anomalie?</p>
        </div>
      `,
    },

    // ─── 1.2 ──────────────────────────────────────────────────────────
    {
      id: 'm01-s02',
      type: 'interactive',
      title: 'Tre anomalie da prevenire',
      subtitle: 'Cosa accade quando si salta la traduzione',
      interactive: {
        kind: 'progressive-reveal',
        items: TRE_ANOMALIE,
        ctaShow: 'Mostra prossima anomalia',
        conclusionHtml: `
          <blockquote class="cf2-blockquote">«Le tre anomalie hanno un'origine comune: il passaggio diretto tra discipline senza un livello intermedio che protegga la struttura del concetto.»</blockquote>
        `,
      },
    },

    // ─── 1.3 ──────────────────────────────────────────────────────────
    {
      id: 'm01-s03',
      type: 'standard',
      title: 'Cosa significa tradurre senza ridurre',
      subtitle: 'La definizione operativa',
      content: `
        <div class="cf2-section">
          <blockquote class="cf2-blockquote">«Il processo mediante cui un concetto mantiene la propria funzione strutturale pur cambiando linguaggio disciplinare.»</blockquote>
          <p class="cf2-narrative__caption" style="text-align: right;">— F2 · Traduzione Interdisciplinare</p>
          <p>La parola chiave è <strong>funzione strutturale</strong>: non si chiede che il concetto rimanga identico (sarebbe impossibile tra discipline diverse), ma che <strong>conservi il lavoro che fa</strong> nella comprensione del fenomeno.</p>
        </div>

        <hr class="cf2-divider" />

        <h3 class="cf2-narrative__h3">Traduzione ≠ semplificazione</h3>
        <table class="cf2-table">
          <thead>
            <tr><th></th><th>Cosa è</th><th>Cosa fa</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Semplificazione</strong></td><td>Togliere complessità</td><td><em>«Spiego in modo facile»</em></td></tr>
            <tr><td><strong>Adattamento</strong></td><td>Cambiare il concetto per renderlo familiare</td><td><em>«Uso un termine equivalente»</em></td></tr>
            <tr class="cf2-table__row--highlight"><td><strong>Traduzione strutturale</strong></td><td>Cambiare linguaggio mantenendo la funzione</td><td><em>«Uso un altro linguaggio che fa lo stesso lavoro»</em></td></tr>
          </tbody>
        </table>

        <hr class="cf2-divider" />

        <div class="cf2-section">
          <h3 class="cf2-narrative__h3">Esempio: tre livelli di linguaggio, stessa funzione</h3>
          <div class="cf2-cards cf2-cards--vertical">
            <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #6c63ff;">
              <div class="cf2-card__head"><span class="cf2-card__badge" style="background: #6c63ff;">F1</span><span class="cf2-card__title">«Soggetto incarnato, relazionale, temporale»</span></div>
            </div>
            <p class="cf2-emph cf2-emph--center" style="color: var(--cf2-text-muted);">↓ traduzione strutturale</p>
            <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #1a6b8a;">
              <div class="cf2-card__head"><span class="cf2-card__badge" style="background: #1a6b8a;">F2</span><span class="cf2-card__title">«Il bambino entra in un campo di esperienza condivisibile»</span></div>
            </div>
            <p class="cf2-emph cf2-emph--center" style="color: var(--cf2-text-muted);">↓ traduzione strutturale</p>
            <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #124f67;">
              <div class="cf2-card__head"><span class="cf2-card__badge" style="background: #124f67;">F2</span><span class="cf2-card__title">«Il bambino usa il libro come occasione di scambio con l'adulto»</span></div>
            </div>
          </div>
          <p class="cf2-narrative__caption">La funzione strutturale è conservata: il bambino come soggetto relazionale che abita un campo.</p>
        </div>
      `,
      notes:
        "La traduzione interdisciplinare non è un compromesso: è un'operazione metodologica precisa con criteri verificabili.",
    },

    // ─── 1.4 ──────────────────────────────────────────────────────────
    {
      id: 'm01-s04',
      type: 'interactive',
      title: 'Come si riconosce una traduzione valida',
      subtitle: 'Dieci criteri con esempi dal caso-guida',
      intro: `
        <p>Ogni criterio è una <strong>flip-card</strong>: sul fronte la domanda guida, sul retro un esempio valido e uno non valido. Clicca per girare la singola card, oppure usa <em>«Gira tutte»</em> per la lettura sinottica.</p>
      `,
      interactive: {
        kind: 'flip-cards',
        cards: CRITERI_VALIDITA,
        cols: 5,
        reformulationTable: {
          title: 'Tabella di riformulazione rapida',
          headers: ['Formulazione riduttiva', 'Formulazione metodologicamente valida'],
          rows: [
            [
              'Il bambino ha scarsa attenzione',
              'Il campo condiviso si interrompe rapidamente e richiede forte sostegno adulto',
            ],
            [
              'Il genitore stimola poco',
              "L'adulto offre poche aperture allo scambio, ma risponde quando il bambino prende iniziativa",
            ],
            [
              'Il bambino non parla',
              'La partecipazione simbolica avviene più attraverso gesto e sguardo che attraverso parola',
            ],
            [
              'Il bambino è oppositivo',
              'Il limite produce rottura del campo e fatica di recupero relazionale',
            ],
            [
              'Il bambino è bravo',
              'La sequenza mostra buona integrazione tra orientamento corporeo, relazione e iniziativa',
            ],
          ],
        },
      },
    },

    // ─── 1.5 ──────────────────────────────────────────────────────────
    {
      id: 'm01-s05',
      type: 'narrative',
      title: 'Il criterio in una frase',
      content: `
        <div class="cf2-narrative cf2-narrative--centered">
          <blockquote class="cf2-quote">
            <p>«Un esempio valido della Fase 2 non dice ancora che cosa fare.</p>
            <p class="cf2-quote__cta">Mostra che cosa diventa leggibile.»</p>
          </blockquote>
          <p>Questo è il criterio che raccoglie tutti gli altri. La F2 produce <strong>leggibilità strutturale</strong> — non azione, non diagnosi, non giudizio.</p>
        </div>

        <hr class="cf2-divider" />

        <h3 class="cf2-narrative__h3">Le tre anomalie e la protezione F2</h3>
        <table class="cf2-table">
          <thead>
            <tr><th>Anomalia</th><th>Errore</th><th>Protezione F2</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Riduzione psicologica</strong></td><td>Il concetto diventa tratto del bambino</td><td>Mantiene il campo relazionale come unità di osservazione</td></tr>
            <tr><td><strong>Tecnicizzazione precoce</strong></td><td>La lettura diventa procedura</td><td>Separa esplicitamente osservazione e decisione operativa</td></tr>
            <tr><td><strong>Normatività implicita</strong></td><td>La descrizione diventa prescrizione</td><td>Produce configurazioni, non norme</td></tr>
          </tbody>
        </table>

        <hr class="cf2-divider" />

        <div class="cf2-narrative cf2-narrative--centered">
          <p class="cf2-narrative__caption">Come si costruisce concretamente la leggibilità? Attraverso una sequenza precisa di sette operatori.</p>
          <p class="cf2-emph cf2-emph--center">→ Modulo 2 — La pipeline di traducibilità</p>
        </div>
      `,
      notes:
        'Nel Modulo 2 vedrai come ogni operatore della pipeline è progettato per prevenire esattamente una di queste anomalie.',
    },
  ],
};
