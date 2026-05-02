import { Module, ExpandableCardData } from '../types';

const TRIADE_CARDS: ExpandableCardData[] = [
  {
    id: 'campo',
    color: '#16a085',
    badge: '1',
    title: 'Campo condiviso',
    summary: '«Qui si sta costruendo un mondo comune o solo esecuzione parallela?»',
    detail: `
      <p>Il campo condiviso non è semplice vicinanza fisica. È la qualità dell'<strong>orientamento reciproco</strong>: bambino e adulto si rivolgono insieme verso qualcosa, costruendo un riferimento condiviso. Senza campo condiviso, gesti e parole rimangono azioni parallele senza costruire scambio.</p>

      <div class="cf2-two-col">
        <div class="cf2-box cf2-box--valid">
          <div class="cf2-box__title">✓ Segnali di campo presente</div>
          <ul>
            <li>Il bambino indica e guarda l'adulto (gesto proto-dichiarativo)</li>
            <li>Adulto e bambino si orientano insieme verso la stessa immagine</li>
            <li>C'è alternanza di sguardo tra oggetto e partner</li>
            <li>Il bambino porta un oggetto all'adulto come condivisione</li>
          </ul>
        </div>
        <div class="cf2-box cf2-box--invalid">
          <div class="cf2-box__title">✗ Segnali di campo assente</div>
          <ul>
            <li>Il bambino usa l'oggetto senza cercare l'adulto</li>
            <li>L'adulto nomina ma non attende la risposta del bambino</li>
            <li>Le azioni si svolgono in parallelo senza intrecciare sguardi</li>
          </ul>
        </div>
      </div>

      <div class="cf2-scena" style="border-left-color: #16a085; background: #e8f8f5; margin-top: 12px;">
        <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--cf2-text-muted); margin: 0 0 4px;">Nel caso-guida</p>
        <p style="margin: 0;"><em>Il bambino e l'adulto si orientano verso qualcosa di comune (il libro), con gesto, sguardo e parola che si intrecciano.</em></p>
      </div>
    `,
  },
  {
    id: 'posizione',
    color: '#8e44ad',
    badge: '2',
    title: 'Posizione soggettiva',
    summary: '«Il bambino prende posizione dentro l\'esperienza o reagisce soltanto alle proposte dell\'adulto?»',
    detail: `
      <p>La posizione soggettiva non è autonomia totale né ribellione all'adulto. È la presenza di un'<strong>iniziativa che parte dal bambino</strong> — una scelta, una preferenza, un gesto che apre la sequenza piuttosto che risponderle. Anche un rifiuto può essere un indicatore di posizione.</p>

      <div class="cf2-two-col">
        <div class="cf2-box cf2-box--valid" style="border-color: #8e44ad; background: #f3edf7;">
          <div class="cf2-box__title" style="color: #8e44ad;">✓ Segnali di posizione presente</div>
          <ul>
            <li>Sceglie una pagina o torna su una figura</li>
            <li>Vocalizza davanti a un'immagine prima che l'adulto nomini</li>
            <li>Porta il libro all'adulto (iniziativa di condivisione)</li>
            <li>Respinge una proposta dell'adulto e ne introduce un'altra</li>
          </ul>
        </div>
        <div class="cf2-box cf2-box--invalid">
          <div class="cf2-box__title">✗ Segnali di posizione assente</div>
          <ul>
            <li>Il bambino segue passivamente la proposta adulta senza iniziativa</li>
            <li>Ogni azione è una risposta/adattamento senza apertura autonoma</li>
            <li>Il bambino imita ma non trasforma ciò che imita</li>
          </ul>
        </div>
      </div>

      <div class="cf2-scena" style="border-left-color: #8e44ad; background: #f3edf7; margin-top: 12px;">
        <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--cf2-text-muted); margin: 0 0 4px;">Nel caso-guida</p>
        <p style="margin: 0;"><em>Il bambino indica, mostra, vocalizza: c'è iniziativa soggettiva e non solo reazione all'adulto.</em></p>
      </div>
    `,
  },
  {
    id: 'limite',
    color: '#d35400',
    badge: '3',
    title: 'Rapporto con il limite',
    summary: '«Le interruzioni, le attese e i passaggi distruggono il campo o possono essere integrati?»',
    detail: `
      <p>Il limite è inevitabile nell'interazione: un adulto che gira pagina, una pausa, una proposta diversa. Non si valuta se il bambino «tollera bene» il limite nel senso comportamentale. Si osserva se il limite può essere <strong>integrato nel campo condiviso</strong> o lo destabilizza fino a interrompere lo scambio.</p>

      <div class="cf2-two-col">
        <div class="cf2-box cf2-box--valid" style="border-color: #d35400; background: #fef0e7;">
          <div class="cf2-box__title" style="color: #d35400;">✓ Limite integrabile</div>
          <ul>
            <li>Il bambino accetta una pausa e poi riprende l'interazione</li>
            <li>Tollera che l'adulto nomini qualcosa di diverso da ciò che guarda</li>
            <li>Usa il genitore per recuperare lo scambio dopo un'interruzione</li>
            <li>Il cambio di pagina non distrugge il campo — viene negoziato</li>
          </ul>
        </div>
        <div class="cf2-box cf2-box--invalid">
          <div class="cf2-box__title">✗ Limite destabilizzante</div>
          <ul>
            <li>Il bambino chiude il libro e si allontana senza recupero</li>
            <li>Ogni proposta dell'adulto produce protesta o ritiro</li>
            <li>Il limite produce iperattivazione o collasso dell'attenzione</li>
          </ul>
        </div>
      </div>

      <div class="cf2-scena" style="border-left-color: #d35400; background: #fef0e7; margin-top: 12px;">
        <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--cf2-text-muted); margin: 0 0 4px;">Nel caso-guida</p>
        <p style="margin: 0;"><em>Il bambino accetta di condividere il controllo del libro con l'adulto; la sequenza si interrompe e riprende.</em></p>
      </div>
    `,
  },
];

const PROPRIETA_CARDS: ExpandableCardData[] = [
  {
    id: 'non-riduttivo',
    color: '#16a085',
    title: 'Non riduttivo',
    summary: 'Mantiene la complessità strutturale dell\'esperienza, non la riduce a una causa singola.',
    detail: `
      <p>L'operatore non semplifica il comportamento osservato in un'unica causa. Non riduce a biologia, a comportamento, a cognitivo isolato. Mantiene la complessità strutturale dell'esperienza.</p>
      <div class="cf2-section" style="background: var(--cf2-bg); padding: 12px 16px; border-radius: var(--cf2-radius-sm);">
        <p style="text-decoration: line-through; color: var(--cf2-text-muted); margin: 0 0 6px;"><strong>✗</strong> «Il bambino non presta attenzione»</p>
        <p style="color: #16a085; margin: 0;"><strong>✓</strong> «Il campo condiviso si stabilizza solo in alcune sequenze e dipende dalla qualità del sostegno adulto»</p>
      </div>
    `,
  },
  {
    id: 'non-moralizzante',
    color: '#e67e22',
    title: 'Non moralizzante',
    summary: 'Non giudica la famiglia né l\'adulto di riferimento. Legge il campo, non la prestazione.',
    detail: `
      <p>L'operatore non giudica la famiglia né l'adulto di riferimento. Non produce valutazioni su «quanto bene» l'adulto si è comportato. Legge il campo relazionale come sistema, non come prestazione.</p>
      <div class="cf2-section" style="background: var(--cf2-bg); padding: 12px 16px; border-radius: var(--cf2-radius-sm);">
        <p style="text-decoration: line-through; color: var(--cf2-text-muted); margin: 0 0 6px;"><strong>✗</strong> «Il genitore non è abbastanza responsivo»</p>
        <p style="color: #e67e22; margin: 0;"><strong>✓</strong> «Il campo condiviso richiede un rallentamento adulto per stabilizzarsi»</p>
      </div>
    `,
  },
  {
    id: 'non-patologizzante',
    color: '#e74c3c',
    title: 'Non patologizzante',
    summary: 'Descrive configurazioni funzionali, non sintomi. Non etichetta il bambino.',
    detail: `
      <p>L'operatore descrive configurazioni funzionali, non sintomi. Non etichetta il bambino con categorie diagnostiche. Una posizione soggettiva assente è un dato osservativo, non una diagnosi.</p>
      <div class="cf2-section" style="background: var(--cf2-bg); padding: 12px 16px; border-radius: var(--cf2-radius-sm);">
        <p style="text-decoration: line-through; color: var(--cf2-text-muted); margin: 0 0 6px;"><strong>✗</strong> «Assenza di attenzione condivisa — segnale di rischio DSA»</p>
        <p style="color: #e74c3c; margin: 0;"><strong>✓</strong> «La posizione soggettiva non è emersa in questa sequenza specifica»</p>
      </div>
    `,
  },
  {
    id: 'sistemico',
    color: '#2980b9',
    title: 'Sistemico',
    summary: 'Include sempre adulto e contesto nel campo di lettura. Non isola il comportamento del bambino.',
    detail: `
      <p>L'operatore include sempre adulto e contesto nel campo di lettura. Non isola il comportamento del bambino. Il campo condiviso, la posizione e il limite si leggono sempre nella triade <strong>bambino–adulto–situazione</strong>.</p>
      <div class="cf2-section" style="background: var(--cf2-bg); padding: 12px 16px; border-radius: var(--cf2-radius-sm);">
        <p style="text-decoration: line-through; color: var(--cf2-text-muted); margin: 0 0 6px;"><strong>✗</strong> «Il bambino non interagisce»</p>
        <p style="color: #2980b9; margin: 0;"><strong>✓</strong> «In questa situazione, con questo adulto, la costruzione del campo condiviso è fragile»</p>
      </div>
    `,
  },
  {
    id: 'trasversale',
    color: '#8e44ad',
    title: 'Trasversale',
    summary: 'Lo stesso operatore funziona in contesti diversi — distingue un operatore da una checklist.',
    detail: `
      <p>Lo stesso operatore funziona in contesti diversi — ambulatorio pediatrico, nido, casa, consultorio. Non è progettato per un solo setting. Questo è il criterio che distingue un <strong>operatore</strong> da una <strong>checklist specifica</strong>.</p>
      <div class="cf2-section" style="background: var(--cf2-bg); padding: 12px 16px; border-radius: var(--cf2-radius-sm); border-left: 3px solid #8e44ad;">
        <p style="margin: 0;">La domanda <em>«si sta costruendo un campo condiviso?»</em> vale in un bilancio pediatrico come in una osservazione educativa come in un colloquio familiare.</p>
      </div>
    `,
  },
];

export const Module07: Module = {
  id: 'm07',
  number: 7,
  title: "L'Operatore di Lettura",
  shortTitle: 'Operatore',
  accent: '#d35400',
  slides: [
    // ─── 7.1 ──────────────────────────────────────────────────────────
    {
      id: 'm07-s01',
      type: 'comparison',
      title: "L'Operatore di Lettura",
      subtitle: 'Una forma mentale, non uno strumento',
      intro: `
        <p>Il professionista che ha attraversato F2 dispone di nodi, domande e configurazioni. Ma come li usa davanti a una situazione reale? Come organizza ciò che vede senza già valutarlo, classificarlo o prescrivere?</p>
        <p class="cf2-emph">L'operatore di lettura è la risposta a questa domanda.</p>

        <blockquote class="cf2-blockquote" style="border-left-color: #d35400; background: #fef0e7;">L'operatore di lettura è la <strong>struttura mentale</strong> attraverso cui il professionista organizza ciò che vede. <strong>Non è una griglia. Non è un modulo. Non è una checklist.</strong> È la forma applicativa del Nodo — senza diventare strumento.</blockquote>
      `,
      comparison: {
        valid: {
          title: 'Un operatore di lettura è',
          items: [
            'Una forma mentale strutturata',
            "Un modo di organizzare l'osservazione",
            'Applicabile prima di costruire strumenti',
            'Reversibile e situato nel campo',
          ],
        },
        invalid: {
          title: 'Un operatore di lettura non è',
          items: [
            { text: 'Una scheda da compilare' },
            { text: 'Un criterio di valutazione' },
            { text: 'Uno strumento già pronto' },
            { text: 'Una classificazione del bambino' },
          ],
        },
      },
      content: `
        <p class="cf2-narrative__caption">Un operatore di lettura produce <strong>leggibilità</strong>. Non produce azione. L'azione è compito di F3.</p>
      `,
    },

    // ─── 7.2 ──────────────────────────────────────────────────────────
    {
      id: 'm07-s02',
      type: 'interactive',
      title: 'Tre domande strutturali',
      subtitle: 'Campo · Posizione · Limite',
      intro: `
        <p class="cf2-emph cf2-emph--center" style="color: var(--cf2-text-muted);">Ogni situazione = Campo + Posizione + Limite</p>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: TRIADE_CARDS,
        layout: 'vertical',
        multiOpen: false,
      },
    },

    // ─── 7.3 ──────────────────────────────────────────────────────────
    {
      id: 'm07-s03',
      type: 'diagram',
      title: 'Lettura della scena',
      subtitle: "L'operatore triadico applicato alla lettura condivisa",
      content: `
        <div class="cf2-cards cf2-cards--grid">
          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #16a085;">
            <div class="cf2-card__head"><span class="cf2-card__badge">1</span><span class="cf2-card__title">Campo condiviso</span></div>
            <div class="cf2-card__body">
              <p><em>Il bambino e l'adulto si orientano verso qualcosa di comune (il libro), con gesto, sguardo e parola che si intrecciano.</em></p>
              <p style="background: #16a085; color: white; padding: 4px 10px; border-radius: 4px; display: inline-block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8px;">Campo · presente</p>
            </div>
          </div>

          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #8e44ad;">
            <div class="cf2-card__head"><span class="cf2-card__badge" style="background: #8e44ad;">2</span><span class="cf2-card__title">Posizione soggettiva</span></div>
            <div class="cf2-card__body">
              <p><em>Il bambino indica, mostra, vocalizza: c'è iniziativa soggettiva e non solo reazione all'adulto.</em></p>
              <p style="background: #8e44ad; color: white; padding: 4px 10px; border-radius: 4px; display: inline-block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8px;">Posizione · emergente</p>
            </div>
          </div>

          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #d35400;">
            <div class="cf2-card__head"><span class="cf2-card__badge" style="background: #d35400;">3</span><span class="cf2-card__title">Rapporto con il limite</span></div>
            <div class="cf2-card__body">
              <p><em>Il bambino accetta di condividere il controllo del libro con l'adulto; la sequenza si interrompe e riprende.</em></p>
              <p style="background: #d35400; color: white; padding: 4px 10px; border-radius: 4px; display: inline-block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8px;">Limite · integrabile</p>
            </div>
          </div>
        </div>

        <hr class="cf2-divider" />

        <h3 class="cf2-narrative__h3">Lettura sintetica</h3>
        <div class="cf2-box cf2-box--valid" style="border-color: #d35400; background: #fef0e7;">
          <p><em>«Campo condiviso presente ma fragile: il bambino cerca l'adulto attraverso gesto e sguardo, prende iniziativa su alcune figure, ma la continuità dello scambio dipende molto dalla capacità dell'adulto di attendere e seguire il ritmo del bambino.»</em></p>
        </div>
      `,
      guardrail: {
        code: 'C4',
        label: 'Separazione',
        text: 'Questa lettura non dice ancora che cosa fare. Non prescrive un intervento. Organizza la leggibilità.',
      },
    },

    // ─── 7.4 ──────────────────────────────────────────────────────────
    {
      id: 'm07-s04',
      type: 'standard',
      title: 'Cinque criteri di validità',
      subtitle: 'Come riconoscere un operatore che funziona',
      intro: `
        <p>Un operatore di lettura non è valido per il fatto stesso di essere applicato. Cinque proprietà ne definiscono la qualità: clicca ogni criterio per leggere la riformulazione corretta a partire da una formulazione tipica da evitare.</p>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: PROPRIETA_CARDS,
        layout: 'vertical',
        multiOpen: true,
      },
    },

    // ─── 7.5 ──────────────────────────────────────────────────────────
    {
      id: 'm07-s05',
      type: 'diagram',
      title: 'Da osservazione a configurazione',
      subtitle: "Come l'operatore triadico produce la CE",
      content: `
        <div class="cf2-two-col cf2-two-col--40-60">
          <div class="cf2-col">
            <div class="cf2-cards cf2-cards--vertical">
              <div class="cf2-card cf2-card--open" style="--cf2-card-accent: var(--cf2-text-muted); opacity: 0.7;">
                <div class="cf2-card__head">
                  <span class="cf2-card__badge" style="background: var(--cf2-text-muted);">4</span>
                  <span class="cf2-card__title">Domande professionali</span>
                </div>
                <div class="cf2-card__body" style="font-size: 0.85rem;"><p><em>«Il bambino usa l'oggetto come occasione di scambio con l'adulto?»</em></p></div>
              </div>

              <p class="cf2-emph cf2-emph--center" style="color: var(--cf2-text-muted); margin: 0;">↓ applica l'operatore triadico</p>

              <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #d35400; box-shadow: 0 0 0 2px #d35400; background: #fef0e7;">
                <div class="cf2-card__head">
                  <span class="cf2-card__badge">◆ 5</span>
                  <span class="cf2-card__title">Operatore triadico — qui</span>
                </div>
                <div class="cf2-card__body" style="font-size: 0.85rem;">
                  <p><strong>Campo condiviso · Posizione · Limite</strong></p>
                  <p>→ Lettura sintetica del campo</p>
                </div>
              </div>

              <p class="cf2-emph cf2-emph--center" style="color: var(--cf2-text-muted); margin: 0;">↓ produce</p>

              <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #16a085;">
                <div class="cf2-card__head">
                  <span class="cf2-card__badge" style="background: #16a085;">CE</span>
                  <span class="cf2-card__title">Configurazione Evolutiva (M6)</span>
                </div>
                <div class="cf2-card__body" style="font-size: 0.82rem; font-family: 'JetBrains Mono', monospace;"><p>S: N1~ N2↑ N3~ N4↓… · D: ↗ · A: A±</p></div>
              </div>

              <p class="cf2-emph cf2-emph--center" style="color: var(--cf2-text-muted); margin: 0;">↓ apre a</p>

              <div class="cf2-card cf2-card--open" style="--cf2-card-accent: var(--cf2-text-muted); opacity: 0.7;">
                <div class="cf2-card__head">
                  <span class="cf2-card__badge" style="background: var(--cf2-text-muted);">6</span>
                  <span class="cf2-card__title">Famiglie di output (M8)</span>
                </div>
                <div class="cf2-card__body" style="font-size: 0.85rem;"><p>Osservativa · Formativa · Restitutiva…</p></div>
              </div>
            </div>
          </div>

          <div class="cf2-col">
            <div class="cf2-section">
              <p>L'operatore triadico <strong>non sostituisce</strong> la CE: la <strong>produce</strong>. Le tre domande strutturali (campo, posizione, limite) organizzano l'osservazione in una forma che può poi essere grammaticalizzata — tradotta nella notazione CE del Modulo 6.</p>
              <p>Non è un passaggio automatico: richiede la presenza del professionista nel campo. Ma è un passaggio <strong>strutturato</strong> — non soggettivo, non impressionistico.</p>
            </div>

            <div class="cf2-box cf2-box--valid" style="border-color: #d35400; background: #fef0e7;">
              <p style="margin: 0;">Il passo 6 — famiglie di output — parte da qui. <strong>F3 costruisce gli strumenti. F2 produce la forma.</strong></p>
            </div>

            <p class="cf2-emph cf2-emph--center" style="margin-top: 16px;">→ Modulo 8 — Famiglie di output e Output-tipo</p>
          </div>
        </div>
      `,
    },
  ],
};
