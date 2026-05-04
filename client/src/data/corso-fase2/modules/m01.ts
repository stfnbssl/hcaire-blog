import { Module, FlipCardData, ProgressiveRevealItem } from '../types';

const TRE_ANOMALIE: ProgressiveRevealItem[] = [
  {
    id: 'riduzione-psicologica',
    badge: '01',
    title: 'Riduzione psicologica',
    bodyHtml: `
      <p>Il termine «riduzione» è qui usato in senso tecnico-metodologico: indica il passaggio per cui un concetto strutturale dell'esperienza del bambino viene <strong>ricondotto a un tratto individuale</strong> — una caratteristica della sua personalità, del suo temperamento, del suo funzionamento interno. Non è un giudizio sui professionisti: è la descrizione di un effetto che può prodursi nel passaggio diretto fra linguaggi disciplinari.</p>
      <div class="corso-reveal__examples">
        <div class="corso-reveal__ex corso-reveal__ex--bad"><span class="corso-reveal__ex-mark">✗</span><em>«Il bambino ha scarsa capacità di attenzione condivisa.»</em></div>
        <div class="corso-reveal__ex corso-reveal__ex--good"><span class="corso-reveal__ex-mark">✓</span><em>«In questa sequenza il campo condiviso si interrompe rapidamente e richiede forte sostegno adulto per riorganizzarsi.»</em></div>
      </div>
      <p class="corso-reveal__loss"><strong>Cosa resta in ombra</strong> · Il campo relazionale che sostiene lo scambio. Lo sguardo si concentra sul bambino isolato, mentre la configurazione che rende possibile (o difficile) la sua azione non viene tematizzata.</p>
    `,
  },
  {
    id: 'tecnicizzazione-precoce',
    badge: '02',
    title: 'Tecnicizzazione precoce',
    bodyHtml: `
      <p>Un concetto interpretativo — che serve a leggere una situazione — viene tradotto direttamente in <strong>procedura d'intervento</strong>: cosa fare, quando, con quali passi. È un passaggio frequente quando le pressioni operative sono forti: la lettura e la decisione tendono naturalmente a saldarsi. La F2 propone di tenerle distinte come due momenti professionalmente distinti.</p>
      <div class="corso-reveal__examples">
        <div class="corso-reveal__ex corso-reveal__ex--bad"><span class="corso-reveal__ex-mark">✗</span><em>«Occorre proporre al genitore un training sulla lettura dialogica.»</em></div>
        <div class="corso-reveal__ex corso-reveal__ex--good"><span class="corso-reveal__ex-mark">✓</span><em>«La situazione suggerisce una configurazione in cui il campo relazionale sostiene l'accesso al mondo condiviso, ma la continuità temporale dello scambio resta fragile.»</em></div>
      </div>
      <p class="corso-reveal__loss"><strong>Cosa resta in ombra</strong> · Lo spazio della comprensione condivisa fra discipline. Quando la lettura e l'azione coincidono, il momento in cui più sguardi possono incontrarsi sulla stessa configurazione tende a non aprirsi.</p>
    `,
  },
  {
    id: 'normativita-implicita',
    badge: '03',
    title: 'Normatività implicita',
    bodyHtml: `
      <p>Una descrizione del funzionamento evolutivo si carica, spesso senza che ce ne accorgiamo, di un <strong>contenuto prescrittivo</strong>: suggerisce ciò che è atteso, adeguato, auspicabile. È una soglia sottile — molte formulazioni utili sul piano clinico o pedagogico contengono questa componente. Renderla esplicita aiuta a distinguere quando si sta descrivendo e quando si sta orientando l'azione.</p>
      <div class="corso-reveal__examples">
        <div class="corso-reveal__ex corso-reveal__ex--bad"><span class="corso-reveal__ex-mark">✗</span><em>«L'adulto deve rallentare, attendere tre secondi e poi nominare l'immagine.»</em></div>
        <div class="corso-reveal__ex corso-reveal__ex--good"><span class="corso-reveal__ex-mark">✓</span><em>«Quando l'adulto accelera la sequenza, il bambino interrompe lo scambio; quando attende, il bambino riprende a indicare e vocalizzare.»</em></div>
      </div>
      <p class="corso-reveal__loss"><strong>Cosa resta in ombra</strong> · La differenza fra ciò che si vede e ciò che si raccomanda. Una descrizione che incorpora una norma rende difficile per altri professionisti leggere la stessa scena con un'altra grammatica.</p>
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
      perche: "Isola una funzione e lascia in ombra il campo relazionale: l'esperienza viene letta principalmente sul piano della prestazione cognitiva.",
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
  title: 'Il problema della traduzione fra discipline',
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
        <div class="corso-narrative">
          <div class="corso-scena">
            <p><em>Il bambino indica una figura del libro. Vocalizza. Guarda la madre. Lei sorride e nomina l'immagine.</em></p>
          </div>

          <h3 class="corso-narrative__h3">Quattro discipline, quattro domande</h3>
          <div class="corso-chips">
            <div class="corso-chip"><span class="corso-chip__icon">🩺</span><span class="corso-chip__label">Pediatria</span><span class="corso-chip__sub">«È nella norma per 18 mesi?»</span></div>
            <div class="corso-chip"><span class="corso-chip__icon">📚</span><span class="corso-chip__label">Pedagogia</span><span class="corso-chip__sub">«L'ambiente è stimolante?»</span></div>
            <div class="corso-chip"><span class="corso-chip__icon">🧠</span><span class="corso-chip__label">NPI</span><span class="corso-chip__sub">«Ci sono segnali d'allerta?»</span></div>
            <div class="corso-chip"><span class="corso-chip__icon">👨‍👩‍👧</span><span class="corso-chip__label">Counseling</span><span class="corso-chip__sub">«Il legame genitore-bambino funziona?»</span></div>
          </div>

          <p class="corso-emph corso-emph--center">Quattro sguardi legittimi. Quattro linguaggi diversi. Ognuno coglie un aspetto reale della scena.</p>
          <p class="corso-narrative__caption">Quando il passaggio fra un linguaggio e l'altro avviene per traduzione diretta — senza un livello intermedio condiviso — possono insorgere alcuni effetti tipici, che chiamiamo «anomalie» in senso strutturale: non difetti delle discipline, ma effetti di interfaccia.</p>

          <p class="corso-question">Quali effetti?</p>
        </div>
      `,
    },

    // ─── 1.2 ──────────────────────────────────────────────────────────
    {
      id: 'm01-s02',
      type: 'interactive',
      title: 'Tre anomalie strutturali da prevenire',
      subtitle: 'Effetti tipici del passaggio diretto fra linguaggi',
      intro: `
        <p>Le «anomalie» qui descritte non sono errori imputabili a una disciplina, ma <strong>effetti strutturali di interfaccia</strong>: emergono quando concetti che hanno una funzione dentro un linguaggio vengono trasferiti in un altro senza un livello intermedio condiviso. Riconoscerle è ciò che permette alla F2 di costruire un terreno comune fra sguardi diversi.</p>
      `,
      interactive: {
        kind: 'progressive-reveal',
        items: TRE_ANOMALIE,
        ctaShow: 'Mostra prossima anomalia',
        conclusionHtml: `
          <blockquote class="corso-blockquote">«Le tre anomalie hanno un'origine comune: il passaggio diretto fra discipline senza un livello intermedio che ne preservi la struttura. La F2 non corregge gli sguardi disciplinari: offre il livello in cui possono incontrarsi.»</blockquote>
        `,
      },
    },

    // ─── 1.3 ──────────────────────────────────────────────────────────
    {
      id: 'm01-s03',
      type: 'standard',
      title: 'Cosa significa tradurre fra discipline',
      subtitle: 'La definizione operativa',
      content: `
        <div class="corso-section">
          <blockquote class="corso-blockquote">«Il processo mediante cui un concetto mantiene la propria funzione strutturale pur cambiando linguaggio disciplinare.»</blockquote>
          <p class="corso-narrative__caption" style="text-align: right;">— F2 · Traduzione Interdisciplinare</p>
          <p>La parola chiave è <strong>funzione strutturale</strong>: non si chiede che il concetto rimanga identico (sarebbe impossibile tra discipline diverse), ma che <strong>conservi il lavoro che fa</strong> nella comprensione del fenomeno.</p>
        </div>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3">Traduzione ≠ semplificazione</h3>
        <table class="corso-table">
          <thead>
            <tr><th></th><th>Cosa è</th><th>Cosa fa</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Semplificazione</strong></td><td>Togliere complessità</td><td><em>«Spiego in modo facile»</em></td></tr>
            <tr><td><strong>Adattamento</strong></td><td>Cambiare il concetto per renderlo familiare</td><td><em>«Uso un termine equivalente»</em></td></tr>
            <tr class="corso-table__row--highlight"><td><strong>Traduzione strutturale</strong></td><td>Cambiare linguaggio mantenendo la funzione</td><td><em>«Uso un altro linguaggio che fa lo stesso lavoro»</em></td></tr>
          </tbody>
        </table>

        <hr class="corso-divider" />

        <div class="corso-section">
          <h3 class="corso-narrative__h3">Esempio: tre livelli di linguaggio, stessa funzione</h3>
          <div class="corso-cards corso-cards--vertical">
            <div class="corso-card corso-card--open" style="--corso-card-accent: #6c63ff;">
              <div class="corso-card__head"><span class="corso-card__badge" style="background: #6c63ff;">F1</span><span class="corso-card__title">«Soggetto incarnato, relazionale, temporale»</span></div>
            </div>
            <p class="corso-emph corso-emph--center" style="color: var(--corso-text-muted);">↓ traduzione strutturale</p>
            <div class="corso-card corso-card--open" style="--corso-card-accent: #1a6b8a;">
              <div class="corso-card__head"><span class="corso-card__badge" style="background: #1a6b8a;">F2</span><span class="corso-card__title">«Il bambino entra in un campo di esperienza condivisibile»</span></div>
            </div>
            <p class="corso-emph corso-emph--center" style="color: var(--corso-text-muted);">↓ traduzione strutturale</p>
            <div class="corso-card corso-card--open" style="--corso-card-accent: #124f67;">
              <div class="corso-card__head"><span class="corso-card__badge" style="background: #124f67;">F2</span><span class="corso-card__title">«Il bambino usa il libro come occasione di scambio con l'adulto»</span></div>
            </div>
          </div>
          <p class="corso-narrative__caption">La funzione strutturale è conservata: il bambino come soggetto relazionale che abita un campo.</p>
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
          headers: ['Formulazione mono-registro', 'Formulazione condivisibile fra discipline'],
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
        <div class="corso-narrative corso-narrative--centered">
          <blockquote class="corso-quote">
            <p>«Un esempio valido della Fase 2 non dice ancora che cosa fare.</p>
            <p class="corso-quote__cta">Mostra che cosa diventa leggibile.»</p>
          </blockquote>
          <p>Questo è il criterio che raccoglie tutti gli altri. La F2 produce <strong>leggibilità strutturale</strong> — non azione, non diagnosi, non giudizio.</p>
        </div>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3">Le tre anomalie e il contributo della F2</h3>
        <table class="corso-table">
          <thead>
            <tr><th>Anomalia strutturale</th><th>Effetto di interfaccia</th><th>Contributo della F2</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Riduzione psicologica</strong></td><td>Il concetto strutturale viene ricondotto a un tratto del bambino</td><td>Mantiene il campo relazionale come unità di osservazione</td></tr>
            <tr><td><strong>Tecnicizzazione precoce</strong></td><td>La lettura e la decisione operativa si saldano in un unico passaggio</td><td>Tiene distinte osservazione e decisione, lasciando alla disciplina la responsabilità della seconda</td></tr>
            <tr><td><strong>Normatività implicita</strong></td><td>La descrizione incorpora un contenuto prescrittivo</td><td>Produce configurazioni leggibili, lasciando esplicito il momento normativo</td></tr>
          </tbody>
        </table>

        <hr class="corso-divider" />

        <div class="corso-narrative corso-narrative--centered">
          <p class="corso-narrative__caption">Come si costruisce concretamente la leggibilità? Attraverso una sequenza precisa di sette operatori.</p>
          <p class="corso-emph corso-emph--center">→ Modulo 2 — La pipeline di traducibilità</p>
        </div>
      `,
      notes:
        'Nel Modulo 2 vedrai come ogni operatore della pipeline è progettato per prevenire esattamente una di queste anomalie.',
    },
  ],
};
