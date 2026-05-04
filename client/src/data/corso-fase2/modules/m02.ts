import { Module } from '../types';
import { PIPELINE_STEPS } from '../pipeline-steps';

const ALL_OPS = ['op1', 'op2', 'op3', 'op4', 'op5', 'op6', 'op7'];

export const Module02: Module = {
  id: 'm02',
  number: 2,
  title: 'La Pipeline di Traducibilità',
  shortTitle: 'Pipeline',
  accent: '#2d6a4f',
  slides: [
    // ─── 2.1 ──────────────────────────────────────────────────────────
    {
      id: 'm02-s01',
      type: 'diagram',
      title: 'La pipeline di traducibilità',
      subtitle: 'Sette operatori tra F1 e F3',
      interactive: {
        kind: 'pipeline-animator',
        steps: PIPELINE_STEPS,
        variant: 'full',
        dimmedIds: ALL_OPS,
      },
      content: `
        <div class="corso-section">
          <h3 class="corso-narrative__h3">Principio della pipeline</h3>
          <p>La traduzione interdisciplinare non è libera: avviene attraverso una <strong>sequenza stabile di sette operatori</strong>, ognuno con un vincolo di coerenza che ne protegge l'integrità.</p>
          <ul>
            <li>Ogni operatore ha una <strong>funzione precisa</strong></li>
            <li>Ha un <strong>controllo (guard-rail)</strong> che verifica l'integrità del passaggio</li>
            <li>Si applica allo stesso modo in tutti i contesti professionali</li>
          </ul>
        </div>
      `,
      notes:
        'La pipeline completa applicata al caso-guida è nel Modulo 9. Qui impariamo i singoli operatori.',
    },

    // ─── 2.2 ──────────────────────────────────────────────────────────
    {
      id: 'm02-s02',
      type: 'standard',
      title: 'Ogni passaggio ha un vincolo',
      subtitle: 'I controlli di coerenza C0–C7',
      content: `
        <div class="corso-section">
          <p>La pipeline non è un elenco di suggerimenti. È una struttura vincolata: ogni passaggio tra un operatore e il successivo è protetto da un <strong>controllo di coerenza</strong> che previene un errore specifico.</p>
          <blockquote class="corso-blockquote">«Se il controllo non passa, la catena non avanza. Non si salta un operatore per arrivare prima al risultato.»</blockquote>
        </div>

        <table class="corso-table">
          <thead>
            <tr><th>Passo</th><th>Controllo</th><th>Errore prevenuto</th></tr>
          </thead>
          <tbody>
            <tr><td>Campo di lavoro</td><td><strong>C0</strong> — Vincolo di contesto</td><td>Osservazioni vaghe o non delimitabili</td></tr>
            <tr><td>Concetto-ponte</td><td><strong>C1</strong> — Non-riduzionismo</td><td>Concetti che, nel passaggio fra discipline, si stringono fino a diventare una singola variabile</td></tr>
            <tr><td>Nodo trasversale</td><td><strong>C2</strong> — Attraversamento</td><td>Nodi mono-asse, senza emergenza</td></tr>
            <tr><td>Domande professionali</td><td><strong>C3</strong> — Non-diagnostico</td><td>Domande classificatorie o prescrittive</td></tr>
            <tr><td>Operatore di lettura</td><td><strong>C4</strong> — Separazione</td><td>Lettura che impone decisioni operative</td></tr>
            <tr><td>Famiglie di output</td><td><strong>C5</strong> — Scalabilità</td><td>Output valido solo per una disciplina</td></tr>
            <tr><td>Output-tipo vuoto</td><td><strong>C6</strong> — Completezza</td><td>Template incompleto o con giudizi impliciti</td></tr>
            <tr><td>Strumento contestualizzato</td><td><strong>C7</strong> — Responsabilità</td><td>Il metodo che decide al posto della disciplina</td></tr>
          </tbody>
        </table>
      `,
    },

    // ─── 2.3 ──────────────────────────────────────────────────────────
    {
      id: 'm02-s03',
      type: 'standard',
      title: '① Campo di lavoro',
      subtitle: 'Cosa osserviamo, dove, con chi, per quanto tempo',
      pipelineSide: { highlightId: 'op1' },
      content: `
        <div class="corso-two-col">
          <div class="corso-col">
            <p><strong>Funzione</strong> · il campo di lavoro delimita il contesto concreto entro cui il concetto fondativo viene osservato e reso interrogabile.</p>
            <p>Risponde a quattro domande:</p>
            <ul>
              <li><strong>Dove?</strong> — il contesto fisico e istituzionale</li>
              <li><strong>Chi?</strong> — gli attori (bambino, adulto, osservatore)</li>
              <li><strong>Cosa?</strong> — l'oggetto mediatore o il dispositivo</li>
              <li><strong>Quanto?</strong> — il tempo disponibile e i vincoli</li>
            </ul>
            <p><strong>Regola fondamentale</strong>: il campo deve essere delimitato. «Sviluppo simbolico del bambino» non è un campo di lavoro — è un tema.</p>
          </div>
          <div class="corso-col">
            <div class="corso-scena">
              <p><strong>Caso: Lettura condivisa</strong></p>
              <table class="corso-table">
                <tbody>
                  <tr><td><strong>Contesto</strong></td><td>Ambulatorio pediatrico / casa / nido</td></tr>
                  <tr><td><strong>Età</strong></td><td>18-24 mesi</td></tr>
                  <tr><td><strong>Attori</strong></td><td>Bambino · genitore · eventualmente pediatra</td></tr>
                  <tr><td><strong>Oggetto</strong></td><td>Libro illustrato con immagini semplici</td></tr>
                  <tr><td><strong>Tempo</strong></td><td>3-5 minuti</td></tr>
                  <tr><td><strong>Osservabili</strong></td><td>Corpo, sguardo, gesto, vocalizzazione, alternanza, iniziativa</td></tr>
                  <tr><td><strong>Non osservabili</strong></td><td>Motivazione interna, intenzione psicologica, competenza stabile</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `,
      guardrail: {
        code: 'C0',
        label: 'Vincolo di contesto',
        text: 'La situazione è valida perché è delimitata. Non «sviluppo simbolico» in genere, ma questa situazione, con questi attori, in questo tempo.',
      },
    },

    // ─── 2.4 ──────────────────────────────────────────────────────────
    {
      id: 'm02-s04',
      type: 'comparison',
      title: '② Concetto-ponte',
      subtitle: 'Tradurre conservando ampiezza',
      pipelineSide: { highlightId: 'op2', completedIds: ['op1'] },
      intro: `
        <p>Il concetto-ponte rende compatibili linguaggi disciplinari mantenendo aperta l'ampiezza del concetto originario. Non è una semplificazione: è una traduzione che <strong>conserva la funzione strutturale</strong> del concetto.</p>
        <p class="corso-narrative__caption"><strong>Nota terminologica</strong> · Il controllo associato si chiama <em>«Non-riduzionismo»</em>. È un tecnicismo metodologico — indica la condizione per cui il concetto, attraversando un linguaggio disciplinare, non si stringe fino a coincidere con una singola variabile di quella disciplina. Non è un giudizio sulle discipline: ognuna opera legittimamente la propria focalizzazione. Il controllo serve al concetto-ponte, che per sua funzione deve restare attraversabile da più sguardi.</p>
      `,
      comparison: {
        valid: {
          title: '«Accesso al mondo condiviso»',
          content: `
            <p>Il concetto-ponte mantiene insieme:</p>
            <ul>
              <li>il <strong>corpo</strong> (orientamento fisico verso l'oggetto)</li>
              <li>la <strong>relazione</strong> (l'altro come partecipe)</li>
              <li>il <strong>gesto</strong> (come apertura verso il comune)</li>
              <li>il <strong>significato</strong> (il libro come mediatore culturale)</li>
            </ul>
            <p>Può essere usato da pediatra, educatore e genitore senza che nessuno debba rinunciare al proprio quadro.</p>
          `,
        },
        invalid: {
          title: 'Formulazioni mono-registro',
          items: [
            { text: '«Il bambino presta attenzione al libro»', problem: 'Registro neuropsicologico · resta sulla funzione attentiva' },
            { text: '«Il bambino sa indicare»', problem: 'Registro evolutivo · isola un comportamento' },
            { text: '«Il bambino conosce le figure»', problem: 'Registro cognitivo · resta sul riconoscimento' },
            { text: '«Il genitore stimola adeguatamente»', problem: "Registro educativo · sposta lo sguardo sul giudizio dell'adulto" },
            { text: '«Sviluppo simbolico nella norma»', problem: 'Registro clinico · anticipa la classificazione' },
          ],
        },
      },
      guardrail: {
        code: 'C1',
        label: 'Non-riduzionismo',
        text: 'Il concetto-ponte è valido se mantiene insieme corpo, relazione, oggetto, gesto, parola e significato. Non deve coincidere con una singola variabile disciplinare.',
      },
    },

    // ─── 2.5 ──────────────────────────────────────────────────────────
    {
      id: 'm02-s05',
      type: 'standard',
      title: '③ Nodo Trasversale',
      subtitle: 'Il motore strutturale della traduzione',
      pipelineSide: { highlightId: 'op3', completedIds: ['op1', 'op2'] },
      content: `
        <div class="corso-section">
          <p>Il Nodo Trasversale è la <strong>configurazione teorica</strong> che rende intelligibili le dinamiche trasformative generate dalla co-attivazione di più assi strutturali.</p>
          <p>Non è un nuovo asse. Non è un meccanismo causale. È il <strong>punto di trasformazione</strong> nella pipeline: dove si passa da coerenza teorica a interrogabilità professionale.</p>
          <p class="corso-narrative__caption">Il Modulo 3 è dedicato interamente ai Nodi. Qui ne vediamo la funzione nella pipeline.</p>
        </div>

        <hr class="corso-divider" />

        <div class="corso-cards corso-cards--vertical">
          <div class="corso-card corso-card--open" style="--corso-card-accent: #2d6a4f;">
            <div class="corso-card__head">
              <span class="corso-card__badge">N3</span>
              <span class="corso-card__title">Accesso al mondo condiviso simbolico <em style="font-weight: 400; color: var(--corso-text-muted);">— nodo principale</em></span>
            </div>
            <div class="corso-card__body">
              <p><strong>Struttura</strong>: transizione da azione individuale a significato condiviso.</p>
              <p><strong>Assi coinvolti</strong>: <span class="corso-guardrail__code">A1</span> · <span class="corso-guardrail__code">A2</span> · <span class="corso-guardrail__code">A5</span> · <span class="corso-guardrail__code">A6</span></p>
              <ul>
                <li>Il libro non è solo un oggetto: è un <strong>mediatore di mondo</strong></li>
                <li>Il bambino non «presta attenzione»: <em>entra in un campo condiviso</em></li>
                <li>Coinvolge corpo (A1), relazione (A2), desiderio (A5) e mondo culturale (A6)</li>
              </ul>
            </div>
          </div>

          <div class="corso-card" style="--corso-card-accent: #718096;">
            <div class="corso-card__head">
              <span class="corso-card__badge" style="background: #718096;">N2</span>
              <span class="corso-card__title">Campo relazionale / Co-regolazione <em style="font-weight: 400; color: var(--corso-text-muted);">— nodo di supporto</em></span>
            </div>
            <div class="corso-card__body">
              <p>Il N3 non si attiva senza un campo relazionale funzionante. N2 lo sostiene: senza co-regolazione tra adulto e bambino, l'accesso al mondo condiviso non è possibile.</p>
            </div>
          </div>
        </div>
      `,
      guardrail: {
        code: 'C2',
        label: 'Attraversamento',
        text: 'Il Nodo è valido se collega più assi contemporaneamente e produce una configurazione non riducibile alla somma dei singoli assi.',
      },
    },

    // ─── 2.6 ──────────────────────────────────────────────────────────
    {
      id: 'm02-s06',
      type: 'standard',
      title: '④ Domande professionali',
      subtitle: 'Rendere il Nodo interrogabile nei contesti reali',
      pipelineSide: { highlightId: 'op4', completedIds: ['op1', 'op2', 'op3'] },
      content: `
        <div class="corso-section">
          <p>Le domande professionali trasformano il Nodo in interrogazioni <strong>usabili da qualsiasi professionista</strong> nel proprio contesto, senza che diventi uno strumento diagnostico. Devono essere:</p>
          <ul>
            <li><strong>osservabili</strong> — si risponde guardando, non testando</li>
            <li><strong>condivisibili</strong> tra discipline diverse</li>
            <li><strong>prive di giudizio</strong> — non implicano una risposta «giusta»</li>
            <li><strong>non classificatorie</strong> — non portano a un'etichetta</li>
          </ul>
        </div>

        <div class="corso-two-col">
          <div class="corso-box corso-box--valid">
            <div class="corso-box__title">✓ Domande valide</div>
            <ul>
              <li>Il bambino usa il libro come <strong>occasione di scambio</strong> con l'adulto?</li>
              <li>C'è <strong>alternanza di sguardo</strong> tra libro e adulto?</li>
              <li>Il gesto di indicare <strong>apre una relazione</strong> o rimane azione solitaria?</li>
              <li>L'adulto <strong>aspetta</strong> o anticipa sempre la risposta del bambino?</li>
              <li>Il bambino <strong>riprende il contatto</strong> dopo una breve interruzione?</li>
            </ul>
          </div>
          <div class="corso-box corso-box--invalid">
            <div class="corso-box__title">✗ Formulazioni da evitare</div>
            <ul>
              <li>«Il bambino ha deficit di attenzione?» <em style="color: var(--corso-text-muted)">— già classificatorio: appartiene a F3</em></li>
              <li>«Il genitore stimola adeguatamente?» <em style="color: var(--corso-text-muted)">— giudicante</em></li>
              <li>«Il bambino è nella norma per questa età?» <em style="color: var(--corso-text-muted)">— normativo</em></li>
              <li>«Serve una valutazione neuropsichiatrica?» <em style="color: var(--corso-text-muted)">— anticipa F3</em></li>
              <li>«Il bambino capisce quello che diciamo?» <em style="color: var(--corso-text-muted)">— non osservabile</em></li>
            </ul>
          </div>
        </div>
      `,
      guardrail: {
        code: 'C3',
        label: 'Non-diagnostico',
        text: 'Una domanda professionale valida può essere posta da un pediatra, un educatore e un genitore — e nessuno dei tre deve sentirsi fuori posto nell\'ascoltare la risposta.',
      },
    },

    // ─── 2.7 ──────────────────────────────────────────────────────────
    {
      id: 'm02-s07',
      type: 'standard',
      title: '⑤ Operatore di lettura',
      subtitle: "La struttura mentale che organizza l'osservazione",
      pipelineSide: {
        highlightId: 'op5',
        completedIds: ['op1', 'op2', 'op3', 'op4'],
      },
      content: `
        <div class="corso-section">
          <p>L'operatore di lettura non è una griglia, non è un modulo, non è una checklist. È la <strong>forma applicativa del Nodo</strong> nella mente del professionista che osserva: come organizza ciò che vede prima ancora di scrivere qualcosa.</p>
          <p>La forma più stabile è l'<strong>Operatore Triadico</strong>: ogni situazione viene letta attraverso tre domande strutturali simultanee.</p>
        </div>

        <div class="corso-cards corso-cards--grid">
          <div class="corso-card corso-card--open" style="--corso-card-accent: #2d6a4f;">
            <div class="corso-card__head">
              <span class="corso-card__badge">1</span>
              <span class="corso-card__title">Campo condiviso</span>
              <span class="corso-card__chevron">·</span>
            </div>
            <div class="corso-card__body">
              <p><em>Qui si sta costruendo un mondo comune o solo esecuzione parallela?</em></p>
              <p class="corso-card__hint">Il bambino e l'adulto si orientano insieme verso il libro — c'è un «noi» che guarda qualcosa di comune.</p>
            </div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #2d6a4f;">
            <div class="corso-card__head">
              <span class="corso-card__badge">2</span>
              <span class="corso-card__title">Posizione soggettiva</span>
              <span class="corso-card__chevron">·</span>
            </div>
            <div class="corso-card__body">
              <p><em>C'è emergenza di posizione nel valore o solo reazione/adattamento?</em></p>
              <p class="corso-card__hint">Il bambino indica, mostra, vocalizza — c'è iniziativa e non solo risposta agli stimoli dell'adulto.</p>
            </div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #2d6a4f;">
            <div class="corso-card__head">
              <span class="corso-card__badge">3</span>
              <span class="corso-card__title">Rapporto con il limite</span>
              <span class="corso-card__chevron">·</span>
            </div>
            <div class="corso-card__body">
              <p><em>Il limite è abitabile o distrugge il campo?</em></p>
              <p class="corso-card__hint">Il bambino accetta di condividere il controllo del libro; la sequenza si interrompe e riprende senza disorganizzazione.</p>
            </div>
          </div>
        </div>

        <blockquote class="corso-blockquote">«Il campo si organizza: c'è orientamento comune verso un oggetto mediatore, iniziativa del bambino nel mostrare, e capacità di riprendere dopo brevi interruzioni. La configurazione è fragile (uso discontinuo) ma evolutivamente aperta.»</blockquote>
      `,
      guardrail: {
        code: 'C4',
        label: 'Separazione',
        text: 'L\'operatore descrive configurazioni. Non dice cosa fare. Non prescrive. Non diagnostica.',
      },
    },

    // ─── 2.8 ──────────────────────────────────────────────────────────
    {
      id: 'm02-s08',
      type: 'standard',
      title: '⑥ Famiglie di output',
      subtitle: 'Stessa grammatica, destinatari diversi',
      pipelineSide: {
        highlightId: 'op6',
        completedIds: ['op1', 'op2', 'op3', 'op4', 'op5'],
      },
      content: `
        <div class="corso-section">
          <p>Le famiglie di output sono <strong>classi di prodotti possibili</strong> — non ancora strumenti. La stessa configurazione evolutiva può generare output diversi per destinatari diversi, ma con <strong>la stessa grammatica</strong>.</p>
          <p>Ogni famiglia ha destinatari, funzione e forma diversi — ma tutte derivano dalla stessa configurazione evolutiva prodotta dall'Operatore di lettura.</p>
        </div>

        <table class="corso-table">
          <thead>
            <tr><th>Famiglia</th><th>Destinatario</th><th>Funzione</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Osservativa</strong></td><td>Professionista (pediatra, educatore)</td><td>Struttura ciò che vede</td></tr>
            <tr><td><strong>Formativa</strong></td><td>Team / équipe</td><td>Trasferisce la lettura</td></tr>
            <tr><td><strong>Accompagnamento</strong></td><td>Genitore</td><td>Restituisce in linguaggio accessibile</td></tr>
            <tr><td><strong>Ricerca</strong></td><td>Ricercatore</td><td>Standardizza per comparazioni</td></tr>
          </tbody>
        </table>

        <p class="corso-emph corso-emph--center">Stessa struttura. Quattro usi. Zero prescrizioni.</p>
      `,
      guardrail: {
        code: 'C5',
        label: 'Scalabilità',
        text: 'L\'output è valido se la stessa configurazione evolutiva può generare prodotti per destinatari diversi senza cambiare grammatica.',
      },
    },

    // ─── 2.9 ──────────────────────────────────────────────────────────
    {
      id: 'm02-s09',
      type: 'standard',
      title: '⑦ Output-tipo vuoto',
      subtitle: 'Template riusabile · prova di completezza',
      pipelineSide: {
        highlightId: 'op7',
        completedIds: ['op1', 'op2', 'op3', 'op4', 'op5', 'op6'],
      },
      content: `
        <div class="corso-section">
          <p>L'output-tipo vuoto è la <strong>struttura compilabile</strong> che deriva dall'operatore di lettura ma <strong>non è ancora uno strumento</strong>. Non contiene indicatori prefissati, criteri valutativi, prescrizioni.</p>
          <p>Serve a <strong>verificare che la catena regge</strong> prima di costruire lo strumento reale: se un campo non si riesce a compilare in modo neutro, la pipeline ha un problema a monte.</p>
        </div>

        <pre style="background: var(--corso-bg); border: 1px solid var(--corso-border); border-radius: var(--corso-radius-md); padding: 16px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.82rem; line-height: 1.5; overflow-x: auto;">
Titolo del template:  Lettura di una situazione di mondo condiviso
Scopo:                Descrivere come si organizza il campo di esperienza
                      condivisa senza classificare né prescrivere.
─────────────────────────────────────────────────────────
Sezione 1 — Campo osservato        [testo libero]
Sezione 2 — Campo condiviso        [testo libero]
Sezione 3 — Posizione soggettiva   [testo libero]
Sezione 4 — Rapporto con il limite [testo libero]
Sezione 5 — Configurazione (CE)    [codifica strutturale]
Sezione 6 — Note per F3            [solo annotazioni, no prescrizioni]
─────────────────────────────────────────────────────────
Non compilare: età standard · soglie · diagnosi · indicazioni terapeutiche
        </pre>

        <p class="corso-narrative__caption">Il template è la <strong>prova che la traduzione è riuscita</strong>: se ogni sezione si lascia compilare in linguaggio neutro e osservativo, la pipeline ha tenuto.</p>
      `,
      guardrail: {
        code: 'C6',
        label: 'Completezza',
        text: 'Il template è valido se ha campi minimi, linguaggio neutro e nessun indicatore prefissato. È riusabile in contesti diversi a parità di grammatica.',
      },
    },

    // ─── 2.10 ─────────────────────────────────────────────────────────
    {
      id: 'm02-s10',
      type: 'standard',
      title: 'La soglia verso la Fase 3',
      subtitle: 'Dove finisce F2 e dove inizia la responsabilità disciplinare',
      pipelineSide: {
        completedIds: ['f1', ...ALL_OPS, 'f3'],
      },
      content: `
        <div class="corso-section">
          <p>La catena è completa. Il professionista dispone di una <strong>Configurazione Evolutiva</strong> e di un template pronto. La F2 ha fatto il suo lavoro.</p>
        </div>

        <table class="corso-table">
          <thead>
            <tr><th>Livello</th><th>Chi</th><th>Funzione</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>F2 — Metodo</strong></td><td>Il framework</td><td>Rende leggibile</td></tr>
            <tr><td><strong>F3 — Professionista</strong></td><td>Pediatra / educatore / équipe</td><td>Valuta e produce il dispositivo</td></tr>
            <tr><td><strong>Disciplina</strong></td><td>La professione specifica</td><td>Assume la decisione finale</td></tr>
          </tbody>
        </table>

        <p class="corso-emph corso-emph--center"><strong>Il metodo orienta. Non decide.</strong></p>

        <hr class="corso-divider" />

        <div class="corso-scena">
          <p><strong>Dal caso «lettura condivisa», in F3 potrebbero nascere:</strong></p>
          <ul>
            <li>Protocollo osservativo per il bilancio dei 18 mesi</li>
            <li>Griglia per l'educatrice al nido (lettura condivisa come attività osservativa)</li>
            <li>Scheda narrativa per i genitori (restituzione accessibile)</li>
            <li>Protocollo di ricerca longitudinale</li>
          </ul>
          <p class="corso-card__hint">Nessuno di questi strumenti è ancora la F2. La F2 ha reso possibile costruirli in modo coerente.</p>
        </div>

        <p class="corso-narrative__caption" style="text-align: center;">Nel Modulo 3 approfondiremo i Nodi Trasversali — il cuore della pipeline.</p>
      `,
      guardrail: {
        code: 'C7',
        label: 'Responsabilità',
        text: 'La decisione clinica o educativa è sempre fuori dal metodo. Il professionista usa la leggibilità prodotta dalla F2 per decidere — con la propria responsabilità disciplinare.',
      },
    },
  ],
};
