import {
  Module,
  ExpandableCardData,
  ChipAccordionItem,
} from '../types';

const SETTE_PROPRIETA = [
  {
    id: 'p1',
    numero: '1',
    nome: 'Multi-asseità costitutiva',
    testo:
      "Coinvolge simultaneamente almeno tre assi strutturali. Se appartiene a un asse solo, non è un Nodo — è una dimensione di quell'asse.",
    test: 'Quanti assi sono contemporaneamente attivi in questa configurazione?',
  },
  {
    id: 'p2',
    numero: '2',
    nome: 'Emergenza non riducibile',
    testo:
      'Produce configurazioni che non sono la somma dei singoli assi. Il tutto è strutturalmente diverso dalle parti: quello che emerge non sarebbe visibile guardando un asse alla volta.',
    test:
      "Questa configurazione si vede già nel singolo asse, o appare solo dall'intreccio?",
  },
  {
    id: 'p3',
    numero: '3',
    nome: 'Traducibilità interrogabile',
    testo:
      'Genera domande professionali reali, osservabili e discutibili tra discipline diverse. Se non produce domande concrete per il professionista, non è un Nodo.',
    test:
      'Questo Nodo genera almeno tre domande usabili in contesti professionali diversi?',
  },
  {
    id: 'p4',
    numero: '4',
    nome: 'Neutralità normativa',
    testo:
      'Non dice cosa fare, non valuta adeguatezza, non definisce normalità. Può descrivere configurazioni fragili o disorganizzate senza per questo prescrivere o classificare.',
    test:
      'Questo Nodo può essere letto senza implicare cosa si deve fare?',
  },
  {
    id: 'p5',
    numero: '5',
    nome: 'Generatività operativa',
    testo:
      'Permette la costruzione di operatori di lettura e famiglie di output diverse. Se non genera nulla in direzione della Fase 3, manca di questa proprietà.',
    test:
      'Da questo Nodo posso ricavare operatori, template e famiglie di output?',
  },
  {
    id: 'p6',
    numero: '6',
    nome: 'Ricorrenza strutturale',
    testo:
      'È una modalità organizzativa ricorrente dello sviluppo, non un evento episodico. Si riscontra in situazioni molto diverse mantenendo la stessa struttura di fondo.',
    test:
      'Questa configurazione è riconoscibile in ambulatorio, al nido, a casa e in ricerca?',
  },
  {
    id: 'p7',
    numero: '7',
    nome: 'Necessità architetturale',
    testo:
      'La sua assenza produce un vuoto teorico nel modello. Se lo si rimuove, il framework perde qualcosa di essenziale — non si può semplicemente sostituirlo con un altro Nodo.',
    test:
      'Se tolgo questo Nodo, il modello perde la capacità di rendere conto di qualcosa di strutturalmente rilevante?',
  },
];

const SETTE_NODI = [
  {
    id: 'n1',
    numero: 'N1',
    colore: '#e67e22',
    nome: "Regolazione / Integrazione dell'esperienza",
    struttura:
      'Capacità del sistema bambino-ambiente di mantenere continuità esperienziale nel tempo davanti a stimoli, frustrazioni, cambiamenti o sovraccarichi.',
    assi: ['1', '2', '4'],
    domande: [
      "L'esperienza si mantiene o collassa?",
      'Il genitore riesce a sostenere una ripresa del campo?',
      'La regolazione avviene solo per contenimento fisico o anche attraverso voce, sguardo, ritmo?',
      'Dopo il momento critico, il bambino può recuperare disponibilità al contesto?',
    ],
    situazione:
      "Durante una visita pediatrica, il bambino viene spogliato per l'esame. Si irrigidisce, piange, cerca il genitore. Il genitore lo prende in braccio, gli parla piano. Dopo alcuni momenti il bambino guarda il pediatra e consente di proseguire.",
    lettura_valida:
      "L'esperienza si disorganizza durante il passaggio corporeo della visita, ma il campo relazionale permette una ripresa parziale. La regolazione non è autonoma, ma è sostenuta dalla presenza adulta.",
    errore:
      '«Il bambino è poco collaborativo.» — Moralizza e attribuisce un tratto stabile. N1 chiede invece: che cosa succede all\'esperienza quando aumenta il carico?',
    famiglie: [
      'Osservativa: traccia su sequenze di disorganizzazione e recupero',
      'Formativa: per pediatri su regolazione e clima ambulatoriale',
      'Restitutiva: linguaggio per il genitore sul pianto senza colpevolizzazione',
      'Organizzativa: rendere la visita più abitabile',
    ],
  },
  {
    id: 'n2',
    numero: 'N2',
    colore: '#27ae60',
    nome: 'Campo relazionale / Co-regolazione',
    struttura:
      'Organizzazione reciproca degli stati tra bambino e ambiente umano: il modo in cui adulto e bambino si modulano, si amplificano, si interrompono o si sostengono reciprocamente.',
    assi: ['1', '2', '3'],
    domande: [
      'Il campo sostiene, amplifica o disorganizza?',
      "Il bambino può usare l'adulto come sostegno senza perdere iniziativa?",
      "La risposta adulta sostituisce l'azione del bambino o la rende nuovamente possibile?",
      "Il campo relazionale permette di trasformare la frustrazione in prosecuzione dell'esperienza?",
    ],
    situazione:
      "Al nido, un bambino non riesce a infilare un pezzo in un gioco a incastro. Si agita e guarda l'educatrice. Lei si avvicina, dice: «È difficile, proviamo a girarlo?». Il bambino prova di nuovo. Quando entra, sorride.",
    lettura_valida:
      "Il campo relazionale sostiene la continuità dell'esperienza: l'adulto riconosce la difficoltà, non si sostituisce, e permette al bambino di restare soggetto dell'azione.",
    errore:
      "«L'educatrice è brava perché aiuta nel modo giusto.» — Valutativo. In F2 non si giudica l'adulto: si descrive la configurazione relazionale.",
    famiglie: [
      'Formativa: differenza tra sostegno e sostituzione',
      'Osservativa: scheda neutra sulle forme di co-regolazione',
      'Restitutiva: traccia per parlare con genitori o educatori',
      'Ricerca: confronto qualitativo di sequenze adulto-bambino',
    ],
  },
  {
    id: 'n3',
    numero: 'N3',
    colore: '#2980b9',
    nome: 'Accesso al mondo condiviso simbolico',
    struttura:
      'Transizione da azione individuale a significato condiviso. Non coincide con il linguaggio o il pointing, anche se può manifestarsi attraverso questi fenomeni.',
    assi: ['1', '2', '5', '6'],
    domande: [
      "Il bambino condivide o usa l'altro?",
      "L'oggetto diventa comune o resta solo manipolato?",
      'Il gesto del bambino apre uno scambio?',
      'La parola adulta sostiene il mondo condiviso o lo sostituisce?',
      "Il bambino cerca risposta dell'adulto o lo usa solo in modo funzionale?",
    ],
    situazione:
      'Durante la lettura di un libro illustrato, il bambino indica un cane, vocalizza «bau», guarda il genitore e torna a guardare la figura. Il genitore risponde: «Sì, è un cane!». Il bambino sorride e indica di nuovo.',
    lettura_valida:
      "Il bambino trasforma l'immagine del libro in un'occasione di scambio: guarda, indica, vocalizza e cerca la risposta dell'adulto. Il libro diventa mediatore di mondo.",
    errore:
      '«Sa indicare» o «Ha buone competenze referenziali.» — Il pointing può essere manifestazione del Nodo, ma non è il Nodo. Riduce una configurazione strutturale a un comportamento.',
    famiglie: [
      'Osservativa: scheda su sequenze di mondo condiviso',
      'Formativa: leggere la condivisione oltre il linguaggio',
      'Restitutiva: parlare ai genitori dell\'indicare e del mostrare',
      'Ricerca: analisi micro-sequenze libro-gesto-sguardo',
    ],
  },
  {
    id: 'n4',
    numero: 'N4',
    colore: '#8e44ad',
    nome: 'Apertura / Esplorabilità del mondo',
    struttura:
      'Equilibrio tra sicurezza relazionale e possibilità di espansione. Come il bambino si orienta verso un mondo che eccede la situazione presente senza perdere il riferimento relazionale.',
    assi: ['1', '4', '5'],
    domande: [
      'Il bambino può esplorare mantenendo un riferimento relazionale?',
      "La vicinanza all'adulto blocca o sostiene l'apertura?",
      'Il mondo nuovo è affrontato come minaccia, possibilità o campo saturo?',
      "L'esplorazione procede per cicli di andata e ritorno?",
    ],
    situazione:
      'Un bambino entra per la prima volta al nido. Resta vicino al genitore, poi si avvicina a un cesto di oggetti, ne prende uno, torna verso il genitore. Dopo alcuni minuti, esplora una zona più ampia.',
    lettura_valida:
      "L'esplorazione si costruisce attraverso cicli brevi di allontanamento e ritorno: il riferimento adulto non sostituisce l'apertura al mondo, ma la rende possibile.",
    errore:
      '«Il bambino è timido.» — Trasforma una configurazione situata in un tratto psicologico stabile. N4 chiede: quanto il mondo è esplorabile per questo bambino, in questa situazione, con questi sostegni?',
    famiglie: [
      "Pedagogica: leggere l'inserimento al nido",
      'Genitoriale: comprendere andate e ritorni',
      "Osservativa: griglia neutra sull'esplorazione situata",
      'Organizzativa: predisposizione degli spazi',
    ],
  },
  {
    id: 'n5',
    numero: 'N5',
    colore: '#e74c3c',
    nome: 'Separazione / Limite reale',
    struttura:
      "Incontro tra l'intenzionalità del bambino e la resistenza del reale. Se il limite può diventare forma, confine, mediazione — o se produce solo interruzione e ritiro.",
    assi: ['2', '3', '4'],
    domande: [
      'Il limite organizza o collassa?',
      'Il genitore riesce a porre il limite senza ritirare la relazione?',
      'Il bambino può protestare senza perdere completamente il contatto?',
      'Dopo il limite, esiste una possibilità di ripresa?',
      'Il limite genera apprendimento o ritiro?',
    ],
    situazione:
      "A casa, il bambino vuole un oggetto fragile. Il genitore dice «No». Il bambino protesta, piange brevemente, guarda il genitore. Il genitore offre un altro oggetto. Dopo un'esitazione, il bambino lo prende e riprende il gioco.",
    lettura_valida:
      'Il limite produce una rottura breve, ma non distrugge il campo: la protesta del bambino resta dentro una relazione che può offrire continuità e riorganizzazione.',
    errore:
      '«Il bambino fa i capricci.» — Moralizza e cancella la funzione strutturale del limite. N5 non chiede se il bambino obbedisce, ma come il campo regge l\'incontro con la resistenza del reale.',
    famiglie: [
      'Restitutiva: parlare del limite senza colpevolizzare',
      'Formativa: distinguere limite organizzante e distruttivo',
      'Genitoriale: osservare le sequenze di rottura e ripresa',
      'Educativa: riflessioni su regole, confini, continuità relazionale',
    ],
  },
  {
    id: 'n6',
    numero: 'N6',
    colore: '#16a085',
    nome: 'Continuità temporale del Sé nascente',
    struttura:
      "Persistenza dell'esperienza attraverso discontinuità, interruzioni, frustrazioni. La possibilità che il bambino non sia ogni volta ricominciato da zero dall'evento che interrompe.",
    assi: ['1', '2', '5'],
    domande: [
      'Il bambino riprende dopo fratture?',
      "Dopo l'interruzione, la sequenza può riprendere?",
      "L'adulto nomina la frattura senza cancellarla?",
      'La nuova azione conserva un legame con quella precedente?',
      'La perdita distrugge il campo o apre una ricostruzione?',
    ],
    situazione:
      "Durante un gioco con costruzioni, una torre cade. Il bambino resta immobile, si lamenta. L'adulto dice: «È caduta. Possiamo rifarla». Il bambino prende un pezzo, poi un altro, ricomincia più lento. Poi indica la torre nuova e guarda l'adulto.",
    lettura_valida:
      "La caduta interrompe l'azione, ma non cancella la continuità dell'esperienza: attraverso la mediazione adulta, il bambino riprende il filo e ricostruisce una direzione.",
    errore:
      '«Il bambino non tollera la frustrazione.» — Troppo generale e tendenzialmente psicologizzante. N6 chiede di osservare se e come l\'esperienza può continuare dopo una frattura.',
    famiglie: [
      'Osservativa: tracce sulle sequenze interruzione-ripresa',
      'Formativa: frustrazione, continuità e ricostruzione',
      'Restitutiva: valorizzare il «riprendere» più che il «riuscire»',
      'Ricerca: micro-sequenze di rottura e recupero',
    ],
  },
  {
    id: 'n7',
    numero: 'N7',
    colore: '#f39c12',
    nome: "Desiderio / Direzione dell'esperienza",
    struttura:
      "Orientamento attivo verso possibilità significative. Non è preferenza, motivazione o scelta: è la direzione che l'esperienza assume quando qualcosa acquista valore per il bambino.",
    assi: ['1', '5', '6'],
    domande: [
      "L'iniziativa è presente?",
      "L'azione del bambino mostra una direzione o resta dispersa?",
      'Qualcosa nel campo acquisisce valore?',
      'Il bambino può sostenere una sequenza orientata?',
      "C'è saturazione? C'è ritiro? C'è espansione?",
    ],
    situazione:
      "In una stanza con molti giochi, il bambino passa rapidamente da un oggetto all'altro. Poi vede una cucina giocattolo, si ferma, apre uno sportello, fa finta di mescolare. Quando l'adulto dice «Stai cucinando?», il bambino sorride e porge il cucchiaio.",
    lettura_valida:
      "Dopo una fase dispersa, il bambino trova una direzione nell'azione simbolica: l'oggetto acquista valore, la sequenza si stabilizza, l'adulto viene incluso nel gioco.",
    errore:
      '«Al bambino piace giocare con la cucina.» — Può essere vero, ma è troppo povero. N7 non riguarda solo una preferenza: riguarda l\'emergere di una direzione significativa dell\'esperienza.',
    famiglie: [
      "Osservativa: traccia sulle forme dell'iniziativa",
      "Pedagogica: interesse, gioco e direzione dell'esperienza",
      'Genitoriale: valore delle iniziative spontanee',
      'Formativa: differenza tra stimolare e riconoscere',
    ],
  },
];

// Adatta SETTE_PROPRIETA al formato ExpandableCards.
const PROPRIETA_CARDS: ExpandableCardData[] = SETTE_PROPRIETA.map((p) => ({
  id: p.id,
  badge: p.numero,
  title: p.nome,
  summary: p.testo.split('. ')[0] + '.',
  detail: `
    <p>${p.testo}</p>
    <div class="cf2-card__hint cf2-card__hint--accent"><strong>Test</strong> · <em>${p.test}</em></div>
  `,
}));

// Render comune di un Nodo come card espandibile (per slide 3.6 e 3.7).
function nodoCard(n: (typeof SETTE_NODI)[number]): ExpandableCardData {
  const assiBadges = n.assi
    .map(
      (a) =>
        `<span class="cf2-guardrail__code" style="background: var(--cf2-bg); padding: 2px 8px; border-radius: 4px; margin-right: 4px;">Asse ${a}</span>`,
    )
    .join('');
  const domandeList = n.domande.map((d) => `<li>${d}</li>`).join('');
  const famiglieList = n.famiglie.map((f) => `<li>${f}</li>`).join('');

  return {
    id: n.id,
    color: n.colore,
    badge: n.numero,
    title: n.nome,
    summary: n.struttura,
    detail: `
      <div class="cf2-scena" style="margin-bottom: 14px;">
        <p><strong>Situazione concreta</strong></p>
        <p>${n.situazione}</p>
      </div>

      <p><strong>Assi attivati</strong> · ${assiBadges}</p>

      <p><strong>Domande professionali</strong></p>
      <ul>${domandeList}</ul>

      <div class="cf2-box cf2-box--valid" style="margin: 12px 0;">
        <div class="cf2-box__title">✓ Lettura valida</div>
        <p style="margin: 8px 0 0;"><em>${n.lettura_valida}</em></p>
      </div>

      <div class="cf2-box cf2-box--invalid" style="margin: 12px 0;">
        <div class="cf2-box__title">⚠ Errore da evitare</div>
        <p style="margin: 8px 0 0;">${n.errore}</p>
      </div>

      <p><strong>Famiglie di output</strong></p>
      <ul>${famiglieList}</ul>
    `,
  };
}

const NODI_1_4_CARDS = SETTE_NODI.slice(0, 4).map(nodoCard);
const NODI_5_7_CARDS = SETTE_NODI.slice(4).map(nodoCard);

const DEFINIZIONE_CHIPS: ChipAccordionItem[] = [
  {
    id: 'configurazione',
    label: 'configurazione ontogenetica',
    bodyHtml:
      '<p>Non è un evento casuale: è un modo in cui lo sviluppo si organizza strutturalmente, ricorrente in bambini di età, contesti e culture diverse.</p>',
  },
  {
    id: 'co-organizzano',
    label: 'più assi si co-organizzano',
    bodyHtml:
      "<p>Non appartiene a un asse solo. Emerge dall'intreccio simultaneo di almeno tre assi strutturali.</p>",
  },
  {
    id: 'emergente',
    label: 'trasformazione emergente',
    bodyHtml:
      '<p>Quello che produce non è la somma degli assi coinvolti. È qualcosa di nuovo che appare solo quando quegli assi lavorano insieme.</p>',
  },
  {
    id: 'necessaria',
    label: 'strutturalmente necessaria',
    bodyHtml:
      '<p>Non è accessoria: la sua assenza produce un vuoto teorico. Il modello non può rendere conto di quel fenomeno senza di essa.</p>',
  },
  {
    id: 'traducibile',
    label: 'potenzialmente traducibile',
    bodyHtml:
      '<p>Può diventare interrogabile da discipline diverse. Genera domande professionali usabili in ambulatorio, al nido, a casa, in ricerca.</p>',
  },
];

export const Module03: Module = {
  id: 'm03',
  number: 3,
  title: 'Il Nodo Trasversale',
  shortTitle: 'Nodo',
  accent: '#e67e22',
  slides: [
    // ─── 3.1 ──────────────────────────────────────────────────────────
    {
      id: 'm03-s01',
      type: 'standard',
      title: 'Tra la fondazione e la pratica',
      subtitle: 'Perché serve un livello intermedio',
      content: `
        <div class="cf2-cards cf2-cards--vertical">
          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #6c63ff; opacity: 0.85;">
            <div class="cf2-card__head">
              <span class="cf2-card__badge" style="background: #6c63ff;">F1</span>
              <span class="cf2-card__title">La fondazione è astratta — non si usa direttamente</span>
            </div>
            <div class="cf2-card__body">
              <p>Gli assi strutturali descrivono dimensioni dello sviluppo con precisione ontologica. Ma proprio per questo <strong>non si usano direttamente nel lavoro professionale</strong>.</p>
              <p>Un pediatra non può concludere una visita scrivendo «Asse 1 presente, Asse 4 in tensione». Un educatore non può osservare un bambino usando «Asse 5 — Desiderio» come categoria operativa.</p>
            </div>
          </div>

          <p class="cf2-emph cf2-emph--center" style="color: var(--cf2-text-muted);">↓ Come si passa dalla fondazione alla leggibilità professionale senza perdere complessità?</p>

          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #e67e22;">
            <div class="cf2-card__head">
              <span class="cf2-card__badge">NODO</span>
              <span class="cf2-card__title">Il livello intermedio</span>
            </div>
            <div class="cf2-card__body">
              <p>Il <strong>Nodo Trasversale</strong> si colloca tra la struttura ontologica (assi) e i dispositivi operativi (Fase 3). È il punto dove:</p>
              <ul>
                <li>più assi si incontrano in una <strong>configurazione riconoscibile</strong></li>
                <li>la configurazione diventa <strong>interrogabile</strong> da professionisti di discipline diverse</li>
                <li>la complessità ontologica non viene perduta ma <strong>tradotta</strong></li>
              </ul>
            </div>
          </div>

          <p class="cf2-emph cf2-emph--center" style="color: var(--cf2-text-muted);">↓ Senza il Nodo, riduzione · tecnicizzazione · normatività implicita (M1)</p>

          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #2d9cdb; opacity: 0.85;">
            <div class="cf2-card__head">
              <span class="cf2-card__badge" style="background: #2d9cdb;">F3</span>
              <span class="cf2-card__title">Gli strumenti operativi</span>
            </div>
            <div class="cf2-card__body">
              <p>Senza il Nodo, il passaggio agli strumenti operativi produce le tre anomalie viste nel Modulo 1.</p>
            </div>
          </div>
        </div>
      `,
      notes:
        "Il Nodo non è un nuovo asse, non è un'entità aggiuntiva, non è un meccanismo causale. È una configurazione teorica che rende intelligibili dinamiche già presenti negli assi — e le rende interrogabili.",
    },

    // ─── 3.2 ──────────────────────────────────────────────────────────
    {
      id: 'm03-s02',
      type: 'standard',
      title: "Cos'è un Nodo Trasversale",
      subtitle: 'La definizione canonica',
      intro: `
        <blockquote class="cf2-quote" style="text-align: center;">
          <p>«Un Nodo Trasversale è una <strong>configurazione ontogenetica</strong> ricorrente in cui <strong>più assi strutturali si co-organizzano</strong> producendo una <strong>trasformazione emergente</strong> e <strong>strutturalmente necessaria</strong>, fenomenicamente densa e <strong>potenzialmente traducibile</strong>.»</p>
        </blockquote>
        <p class="cf2-narrative__caption" style="text-align: center;">Clicca su una parola-chiave per leggerne la funzione nella definizione.</p>
      `,
      interactive: {
        kind: 'chip-accordion',
        items: DEFINIZIONE_CHIPS,
      },
      content: `
        <hr class="cf2-divider" />
        <h3 class="cf2-narrative__h3" style="text-align: center;">Tre cose che il Nodo non è</h3>
        <div class="cf2-chips">
          <div class="cf2-chip" style="border-color: var(--cf2-invalid);"><span class="cf2-chip__icon">✗</span><span class="cf2-chip__label">Non è un nuovo asse</span></div>
          <div class="cf2-chip" style="border-color: var(--cf2-invalid);"><span class="cf2-chip__icon">✗</span><span class="cf2-chip__label">Non è un meccanismo causale</span></div>
          <div class="cf2-chip" style="border-color: var(--cf2-invalid);"><span class="cf2-chip__icon">✗</span><span class="cf2-chip__label">Non è un caso clinico</span></div>
        </div>
        <p class="cf2-emph cf2-emph--center">È la forma in cui assi già definiti si rendono leggibili come configurazione.</p>
      `,
    },

    // ─── 3.3 ──────────────────────────────────────────────────────────
    {
      id: 'm03-s03',
      type: 'interactive',
      title: 'Sette proprietà, tutte necessarie',
      subtitle: 'Un Nodo è valido solo se le soddisfa tutte',
      interactive: {
        kind: 'expandable-cards',
        cards: PROPRIETA_CARDS,
        layout: 'grid',
        multiOpen: true,
      },
      content: `
        <hr class="cf2-divider" />
        <p class="cf2-emph cf2-emph--center">Un elemento è considerato Nodo solo se soddisfa <strong>tutte e sette</strong> le condizioni.</p>
        <p class="cf2-narrative__caption" style="text-align: center;">Se manca anche una sola, è qualcosa di diverso — un asse, un dominio, una variabile, un comportamento.</p>
      `,
      notes:
        'Le sette proprietà si applicano anche come criteri di verifica durante la costruzione della pipeline: se il Nodo scelto non soddisfa tutte e sette, la catena di traducibilità non regge.',
    },

    // ─── 3.4 ──────────────────────────────────────────────────────────
    {
      id: 'm03-s04',
      type: 'comparison',
      title: 'Asse e Nodo non sono la stessa cosa',
      subtitle: 'Una distinzione strutturalmente necessaria',
      intro: `
        <p>La distinzione non è accademica. Confondere Asse e Nodo porta a due errori opposti:</p>
        <ul>
          <li>trattare un Nodo come se fosse una <strong>dimensione permanente e solitaria</strong> (e perderne la multi-asseità)</li>
          <li>trattare un asse come se fosse un <strong>evento situato</strong> (e perderne la funzione fondativa)</li>
        </ul>
      `,
      content: `
        <table class="cf2-table">
          <thead>
            <tr><th></th><th>Asse</th><th>Nodo</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Natura</strong></td><td>Dimensione strutturale permanente</td><td>Configurazione ricorrente</td></tr>
            <tr><td><strong>Funzione</strong></td><td>Condizione di possibilità</td><td>Evento strutturato ad alta densità</td></tr>
            <tr><td><strong>Temporalità</strong></td><td>Sempre attivo</td><td>Processo situato in un campo specifico</td></tr>
            <tr><td><strong>Soggetto</strong></td><td>Descrive il campo dello sviluppo</td><td>Rende visibile l'interazione degli assi nel campo</td></tr>
            <tr><td><strong>Relazione</strong></td><td>Non presuppone gli assi successivi</td><td>Presuppone almeno tre assi contemporaneamente</td></tr>
            <tr><td><strong>Forma</strong></td><td>Costante</td><td>Emergente</td></tr>
          </tbody>
        </table>

        <hr class="cf2-divider" />

        <h3 class="cf2-narrative__h3">Esempio</h3>
        <div class="cf2-two-col">
          <div class="cf2-box cf2-box--valid">
            <div class="cf2-box__title">Asse 2 — Affettivo-morale</div>
            <p>Sempre presente. Descrive come il bambino riconosce l'altro come portatore di esperienza propria. Non compare e scompare: orienta tutte le relazioni del bambino lungo tutto lo sviluppo.</p>
          </div>
          <div class="cf2-box cf2-box--valid" style="border-color: #27ae60;">
            <div class="cf2-box__title" style="color: #27ae60;">N2 — Campo relazionale / Co-regolazione</div>
            <p>Appare quando Asse 1, Asse 2 e Asse 3 si co-organizzano in una configurazione specifica: la modulazione reciproca degli stati tra bambino e adulto. Non è sempre «attivato»: è una configurazione che si osserva in situazioni concrete.</p>
          </div>
        </div>

        <p class="cf2-emph cf2-emph--center">Sempre presente → probabilmente è un asse.<br/>Emerge da più assi in una situazione specifica → probabilmente è un Nodo.</p>
      `,
    },

    // ─── 3.5 ──────────────────────────────────────────────────────────
    {
      id: 'm03-s05',
      type: 'standard',
      title: 'Nodo → contesti → domande',
      subtitle: 'Non il contrario',
      content: `
        <div class="cf2-section">
          <p>Il progetto segue una logica strutturale precisa, che distingue questo metodo da una raccolta di buone pratiche.</p>
        </div>

        <div class="cf2-cards cf2-cards--vertical">
          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #e67e22;">
            <div class="cf2-card__head">
              <span class="cf2-card__badge">NODO</span>
              <span class="cf2-card__title">Configurazione strutturale</span>
            </div>
          </div>
          <p class="cf2-emph cf2-emph--center" style="color: var(--cf2-text-muted);">↓ interroga</p>
          <div class="cf2-chips">
            <div class="cf2-chip"><span class="cf2-chip__icon">🩺</span><span class="cf2-chip__label">Clinico</span><span class="cf2-chip__sub">domanda specifica</span></div>
            <div class="cf2-chip"><span class="cf2-chip__icon">📚</span><span class="cf2-chip__label">Pedagogico</span><span class="cf2-chip__sub">domanda specifica</span></div>
            <div class="cf2-chip"><span class="cf2-chip__icon">👨‍👩‍👧</span><span class="cf2-chip__label">Genitoriale</span><span class="cf2-chip__sub">domanda specifica</span></div>
            <div class="cf2-chip"><span class="cf2-chip__icon">🏛</span><span class="cf2-chip__label">Istituzionale</span><span class="cf2-chip__sub">domanda specifica</span></div>
          </div>
          <p class="cf2-emph cf2-emph--center">I contesti non definiscono lo sviluppo: <strong>interrogano strutture già definite</strong>.</p>
        </div>

        <hr class="cf2-divider" />

        <div class="cf2-two-col">
          <div class="cf2-box cf2-box--valid">
            <div class="cf2-box__title">✓ Logica del metodo</div>
            <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; margin: 8px 0;">NODO → contesti → domande</p>
            <p>I Nodi vengono definiti <em>prima</em> delle contestualizzazioni applicative: chi guarda lo sviluppo da discipline diverse legge la stessa configurazione con linguaggi diversi, senza che ogni disciplina si inventi il proprio modello.</p>
          </div>
          <div class="cf2-box cf2-box--invalid">
            <div class="cf2-box__title">✗ Logica da evitare</div>
            <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; margin: 8px 0;">contesti → nodi diversi</p>
            <p>Se ogni contesto produce i propri Nodi, si ottiene frammentazione e colonizzazione disciplinare. La pediatria osserva «regolazione», la pedagogia osserva «cura», il counseling osserva «attaccamento» — e non si parlano più.</p>
          </div>
        </div>

        <p class="cf2-narrative__caption">I sette Nodi non sono stati ricavati dai casi clinici, dai contesti educativi o dalle pratiche genitoriali. Sono stati definiti a partire dalla struttura del modello — poi applicati ai diversi contesti. Questo li rende <strong>trasversali</strong>: lo stesso N3 genera domande diverse in ambulatorio, al nido, a casa e nei servizi, ma la struttura del Nodo resta identica.</p>
      `,
    },

    // ─── 3.6 ──────────────────────────────────────────────────────────
    {
      id: 'm03-s06',
      type: 'interactive',
      title: 'I sette Nodi Trasversali — parte I',
      subtitle: 'N1 · N2 · N3 · N4',
      interactive: {
        kind: 'expandable-cards',
        cards: NODI_1_4_CARDS,
        layout: 'vertical',
        multiOpen: true,
      },
      notes: 'N5 · N6 · N7 nella slide successiva.',
    },

    // ─── 3.7 ──────────────────────────────────────────────────────────
    {
      id: 'm03-s07',
      type: 'interactive',
      title: 'I sette Nodi Trasversali — parte II',
      subtitle: 'N5 · N6 · N7',
      interactive: {
        kind: 'expandable-cards',
        cards: NODI_5_7_CARDS,
        layout: 'vertical',
        multiOpen: true,
      },
      content: `
        <hr class="cf2-divider" />
        <details>
          <summary style="cursor: pointer; font-weight: 600; color: var(--cf2-module-accent); padding: 10px; border: 1px dashed var(--cf2-border); border-radius: var(--cf2-radius-sm);">
            Mostra la sintesi comparativa dei 7 Nodi
          </summary>
          <table class="cf2-table" style="margin-top: 12px;">
            <thead>
              <tr><th>Nodo</th><th>Situazione esemplare</th><th>Domanda guida</th><th>Errore tipico</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>N1</strong> Regolazione</td><td>Bambino alla visita pediatrica</td><td>L'esperienza si mantiene o collassa?</td><td>«È poco collaborativo»</td></tr>
              <tr><td><strong>N2</strong> Co-regolazione</td><td>Bambino al gioco con l'educatrice</td><td>Il campo sostiene o amplifica?</td><td>«L'educatrice è brava/sbagliata»</td></tr>
              <tr><td><strong>N3</strong> Mondo condiviso</td><td>Bambino col libro e il genitore</td><td>L'oggetto diventa comune?</td><td>«Sa indicare»</td></tr>
              <tr><td><strong>N4</strong> Apertura</td><td>Bambino che entra al nido</td><td>Il mondo è esplorabile?</td><td>«È timido»</td></tr>
              <tr><td><strong>N5</strong> Limite reale</td><td>Bambino davanti a un «no»</td><td>Il limite organizza o collassa?</td><td>«Fa i capricci»</td></tr>
              <tr><td><strong>N6</strong> Continuità</td><td>Torre che cade e si ricostruisce</td><td>Riprende dopo fratture?</td><td>«Non tollera la frustrazione»</td></tr>
              <tr><td><strong>N7</strong> Desiderio</td><td>Bambino che trova direzione</td><td>C'è iniziativa? saturazione?</td><td>«Gli piace la cucina»</td></tr>
            </tbody>
          </table>
        </details>
      `,
    },

    // ─── 3.8 ──────────────────────────────────────────────────────────
    {
      id: 'm03-s08',
      type: 'diagram',
      title: "I sette Nodi nell'architettura del modello",
      subtitle: 'Invarianti strutturali e assi coinvolti',
      content: `
        <p class="cf2-narrative__caption" style="text-align: center;">
          <em>Assi · dimensioni sempre attive</em> · <em>Nodi · configurazioni ricorrenti dell'intreccio</em>
        </p>

        <table class="cf2-table" style="text-align: center;">
          <thead>
            <tr>
              <th style="text-align: left;">Nodo</th>
              <th>A1</th><th>A2</th><th>A3</th><th>A4</th><th>A5</th><th>A6</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="text-align: left;"><strong style="color: #e67e22;">N1</strong> Regolazione</td><td>●</td><td>●</td><td>·</td><td>●</td><td>·</td><td>·</td></tr>
            <tr><td style="text-align: left;"><strong style="color: #27ae60;">N2</strong> Co-regolazione</td><td>●</td><td>●</td><td>●</td><td>·</td><td>·</td><td>·</td></tr>
            <tr><td style="text-align: left;"><strong style="color: #2980b9;">N3</strong> Mondo condiviso</td><td>●</td><td>●</td><td>·</td><td>·</td><td>●</td><td>●</td></tr>
            <tr><td style="text-align: left;"><strong style="color: #8e44ad;">N4</strong> Apertura</td><td>●</td><td>·</td><td>·</td><td>●</td><td>●</td><td>·</td></tr>
            <tr><td style="text-align: left;"><strong style="color: #e74c3c;">N5</strong> Limite reale</td><td>·</td><td>●</td><td>●</td><td>●</td><td>·</td><td>·</td></tr>
            <tr><td style="text-align: left;"><strong style="color: #16a085;">N6</strong> Continuità</td><td>●</td><td>●</td><td>·</td><td>·</td><td>●</td><td>·</td></tr>
            <tr><td style="text-align: left;"><strong style="color: #f39c12;">N7</strong> Desiderio</td><td>●</td><td>·</td><td>·</td><td>·</td><td>●</td><td>●</td></tr>
          </tbody>
        </table>

        <p class="cf2-narrative__caption" style="text-align: center; font-size: 0.85rem;">
          ● asse attivato dal Nodo &nbsp;·&nbsp; · asse non coinvolto
        </p>

        <p class="cf2-emph cf2-emph--center">I sette Nodi sono <strong>invarianti strutturali</strong>: non cambiano passando tra contesti professionali. Cambia solo il tipo di domanda, il livello di osservazione, il tipo di output.</p>
      `,
    },

    // ─── 3.9 ──────────────────────────────────────────────────────────
    {
      id: 'm03-s09',
      type: 'narrative',
      title: 'N3 nel caso della lettura condivisa',
      subtitle: 'Come il Nodo più rilevante si manifesta nella scena',
      content: `
        <div class="cf2-scena">
          <p><em>«Il bambino prende il libro, lo apre, guarda alcune immagini, indica una figura, vocalizza qualcosa e guarda l'adulto. Il genitore nomina l'immagine, sorride, aspetta. Il bambino torna a guardare il libro, gira pagina, poi mostra un'altra figura all'adulto.»</em></p>
        </div>

        <h3 class="cf2-narrative__h3">Perché N3?</h3>
        <p>Nella scena il bambino non sta solo guardando un libro: sta tentando di <em>trasformare l'immagine in un'occasione di scambio</em>.</p>
        <ul>
          <li>Il libro non è un oggetto da manipolare → è un <strong>mediatore di mondo</strong></li>
          <li>Il gesto di indicare non è un riflesso → è un <strong>atto di condivisione</strong></li>
          <li>La vocalizzazione non è rumore → è <strong>invito all'altro</strong></li>
          <li>L'alternanza di sguardo non è distrazione → è <strong>ricerca di conferma nel campo comune</strong></li>
        </ul>

        <hr class="cf2-divider" />

        <div class="cf2-two-col">
          <div class="cf2-col">
            <h3 class="cf2-narrative__h3">Gli assi attivati</h3>
            <ul>
              <li><strong>Asse 1</strong> — Il corpo (postura, orientamento, gesto) organizza l'esperienza</li>
              <li><strong>Asse 2</strong> — La risposta del genitore sostiene il campo</li>
              <li><strong>Asse 5</strong> — L'interesse del bambino orienta l'iniziativa</li>
              <li><strong>Asse 6</strong> — Il libro introduce un mondo simbolico-culturale condiviso</li>
            </ul>
            <p class="cf2-narrative__caption">Sono attivi tutti e quattro gli assi che definiscono N3. L'emergenza è riconoscibile.</p>
          </div>
          <div class="cf2-col">
            <h3 class="cf2-narrative__h3">N2 come Nodo di sostegno</h3>
            <p>N2 (Campo relazionale / Co-regolazione) è presente in secondo piano: senza co-regolazione tra adulto e bambino, l'accesso al mondo condiviso non si produce.</p>
            <p>Il genitore che nomina, sorride e aspetta non sta solo «stimolando» — sta <strong>mantenendo il campo</strong> che rende possibile la condivisione.</p>
            <p class="cf2-narrative__caption" style="font-family: 'JetBrains Mono', monospace; font-size: 0.82rem;">Sostegno: N2 → N3</p>
          </div>
        </div>

        <hr class="cf2-divider" />

        <h3 class="cf2-narrative__h3">Due letture a confronto</h3>
        <div class="cf2-two-col">
          <div class="cf2-box cf2-box--invalid">
            <div class="cf2-box__title">Lettura riduttiva</div>
            <ul>
              <li>«Il bambino sa indicare»</li>
              <li>«Il genitore stimola bene»</li>
              <li>«Buon livello di sviluppo linguistico»</li>
              <li>«Il bambino presta attenzione al libro»</li>
            </ul>
          </div>
          <div class="cf2-box cf2-box--valid">
            <div class="cf2-box__title">Lettura N3</div>
            <ul>
              <li>«Il gesto apre uno scambio con l'adulto»</li>
              <li>«Il campo relazionale sostiene l'accesso al simbolico»</li>
              <li>«La sequenza mostra N3 presente ma uso discontinuo»</li>
              <li>«Il bambino usa il libro come mediatore verso un campo condiviso»</li>
            </ul>
          </div>
        </div>

        <p class="cf2-emph cf2-emph--center" style="margin-top: 16px;">→ Modulo 4 — La Matrice Nodo × Contesto</p>
      `,
      notes:
        'Nel Modulo 4 vedremo come questo stesso Nodo — N3 — genera domande completamente diverse quando cambia il contesto professionale. Il Nodo resta invariante; la prospettiva si trasforma.',
    },
  ],
};
