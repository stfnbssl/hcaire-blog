import { Module } from '../types';
import { CASO_GUIDA_F3 } from '../caso-guida';

// ─── Dati globali del modulo ─────────────────────────────────────────────

const SEI_TIPI_UNIVERSALI = [
  {
    id: 'u1',
    codice: 'U1',
    nome: 'Regolazione',
    colore: 'var(--corso-u1)',
    forma_universale: 'Stabilizzare il registro regolativo del campo',
    descrizione:
      'Azioni che riducono la disorganizzazione del campo intervenendo sul ritmo, sulla prevedibilità, sulla quantità di stimolazione. Non è regolazione del bambino: è regolazione delle condizioni che permettono al bambino di restare nel campo.',
    nodo_tipico: 'N1 — Regolazione',
    colore_nodo: 'var(--corso-n1)',
    funzioni_associate: ['Stabilizzare', 'Proteggere'],
    segnali_indicativi: [
      'N1↓ — campo disorganizzato',
      'T0–T1 — tenuta bassa o critica',
      'A− — campo non abitabile',
      'Contesto ad alto carico percettivo',
    ],
    forme_concrete: [
      "Ridurre il numero di adulti presenti o il volume dell'ambiente",
      'Introdurre ritmo e prevedibilità nella sequenza (es. routine di avvio)',
      'Rallentare i movimenti e abbassare il tono della voce',
      "Ridurre la durata e la complessità dell'interazione",
    ],
    esempio:
      "Durante il bilancio, il bambino si irrigidisce per l'esame fisico. Il pediatra rallenta, abbassa la voce, fa cenno al genitore di avvicinarsi. Il genitore parla al bambino piano, lo tiene. Il campo si riorganizza. Nessun materiale aggiuntivo, nessuna tecnica specifica: solo regolazione delle condizioni relazionali e ambientali del campo.",
    combinazioni_tipiche: ['U5'],
    avvertimento:
      "Non è «calmarlo»: è riorganizzare le condizioni esterne del campo in modo che il sistema bambino-adulto-contesto possa reggere. L'azione è sull'adulto e sul setting, non sul bambino.",
  },
  {
    id: 'u2',
    codice: 'U2',
    nome: 'Sintonizzazione',
    colore: 'var(--corso-u2)',
    forma_universale: "Seguire e rispecchiare l'iniziativa del bambino senza dirigerla",
    descrizione:
      "Azioni che rispecchiano il ritmo, il gesto, la vocalizzazione o l'intenzione del bambino, rendendola condivisibile senza modificarla. La sintonizzazione non corregge, non anticipa, non riempie: crea uno spazio in cui l'esperienza del bambino diventa relazionalmente visibile.",
    nodo_tipico: 'N2 — Campo relazionale / Co-regolazione',
    colore_nodo: 'var(--corso-n2)',
    funzioni_associate: ['Mediare', 'Ampliare'],
    segnali_indicativi: [
      'N2↑ — campo relazionale attivo',
      'R: N2→N3 — transizione in corso',
      'D↗ — espansione in atto',
      'Bambino con iniziativa presente ma risposta adulta direttiva',
    ],
    forme_concrete: [
      'Nominare ciò che il bambino fa, senza commentare o valutare',
      'Attendere la risposta del bambino prima di agire o parlare',
      'Rispecchiare il gesto o la vocalizzazione con variazione minima',
      'Seguire la sequenza del bambino senza anticiparne i passi',
    ],
    esempio:
      "Nel caso-guida: il bambino indica un'immagine e vocalizza. Il genitore nomina ciò che il bambino ha indicato — non un'altra immagine. Aspetta. Il bambino si orienta di nuovo verso il libro, gira pagina. Il genitore aspetta ancora. La sintonizzazione non aggiunge: riflette e lascia spazio perché la sequenza possa continuare.",
    combinazioni_tipiche: ['U4', 'U3'],
    avvertimento:
      "La sintonizzazione non è approvazione né rinforzo. Non si tratta di rispondere «bravo!» — si tratta di rendere l'esperienza del bambino relazionalmente presente. L'adulto non diventa uno specchio passivo: rimane presente e responsivo.",
    casoGuida: true,
  },
  {
    id: 'u3',
    codice: 'U3',
    nome: 'Apertura',
    colore: 'var(--corso-u3)',
    forma_universale: 'Introdurre novità tollerabile che apre il campo a nuove possibilità',
    descrizione:
      "Azioni che ampliano la gamma di esperienze disponibili nel campo, introducendo un elemento nuovo in modo che non produca sovraccarico. L'apertura non è stimolazione generica: è calibrata al campo attuale (T e A devono reggere) e lascia al bambino la scelta se avvicinarsi.",
    nodo_tipico: 'N4 — Apertura · N7 — Desiderio',
    colore_nodo: 'var(--corso-n4)',
    funzioni_associate: ['Ampliare'],
    segnali_indicativi: [
      'N4↓ o N7~ in campo stabile',
      'T2–T3 — tenuta sufficiente',
      'A± o A+ — campo abitabile',
      'D→ — stabilità senza espansione evolutiva',
    ],
    forme_concrete: [
      'Posizionare un oggetto nuovo vicino a quelli familiari senza commentarlo',
      'Introdurre una variazione nella routine (sorpresa tollerabile)',
      'Aprire una possibilità di esplorazione lasciando il bambino libero di avvicinarsi',
      "Ampliare il repertorio dell'adulto (nuovi gesti, nuove modulazioni vocali)",
    ],
    esempio:
      "Al nido, un bambino con buona regolazione ma poco movimento esplorativo. L'educatrice posiziona un oggetto non familiare accanto agli oggetti che il bambino usa di solito. Non lo nomina, non lo mostra. Lascia. Il bambino si avvicina, lo esplora, lo abbandona. Questo è apertura: il campo ha ricevuto una possibilità, non un compito.",
    combinazioni_tipiche: ['U2', 'U6'],
    avvertimento:
      "L'apertura richiede che il campo regga (T2+). Su un campo T0–T1, la novità amplifica la disorganizzazione. La combinazione U3+U1 (apertura su campo stabilizzato) è valida — U3 da sola su T0 è un errore.",
  },
  {
    id: 'u4',
    codice: 'U4',
    nome: 'Mediazione Simbolica',
    colore: 'var(--corso-u4)',
    forma_universale:
      "Usare oggetti, linguaggio o simboli come mediatori dell'esperienza condivisa",
    descrizione:
      "Azioni che trasformano un oggetto, una parola o un'immagine in un mediatore dell'incontro relazionale. Non si usa l'oggetto per istruire il bambino: si usa l'oggetto come ponte tra l'esperienza del bambino e l'esperienza dell'adulto, rendendo lo scambio simbolicamente ricco.",
    nodo_tipico: 'N3 — Mondo condiviso simbolico',
    colore_nodo: 'var(--corso-n3)',
    funzioni_associate: ['Mediare'],
    segnali_indicativi: [
      'N3~ — accesso al mondo condiviso in transizione',
      'R: N2→N3 — campo relazionale spinge verso condivisione simbolica',
      'Oggetto presente nella scena che il bambino ha già indicato o toccato',
    ],
    forme_concrete: [
      "Nominare l'immagine che il bambino indica con una frase breve e condivisibile",
      'Espandere senza correggere: «Sì, il cane — e guarda qui...»',
      "Usare il libro, il gioco o l'oggetto come terreno di incontro, non come materiale didattico",
      'Mantenere il riferimento simbolico condiviso senza sovraccaricarlo di significati',
    ],
    esempio:
      "Nel caso-guida: il libro illustrato non è un testo da leggere e un sussidio didattico. È il mediatore simbolico dell'incontro bambino-genitore. Il genitore nomina le immagini che il bambino indica — non le immagini che lui ritiene importanti. Il libro diventa il campo condiviso dentro il quale si produce la transizione N2→N3.",
    combinazioni_tipiche: ['U2', 'U6'],
    avvertimento:
      "La mediazione simbolica non è insegnamento del linguaggio. Non si tratta di «stimolare il lessico»: si tratta di rendere lo scambio simbolicamente denso e condivisibile. Il bambino non impara parole: esperisce che l'esperienza può essere condivisa.",
    casoGuida: true,
  },
  {
    id: 'u5',
    codice: 'U5',
    nome: 'Limite Generativo',
    colore: 'var(--corso-u5)',
    forma_universale:
      "Stabilire limiti che generano lo spazio dell'esperienza invece di bloccarla",
    descrizione:
      "Azioni che introducono una discontinuità, un confine o una fine — non per bloccare l'esperienza, ma per darle forma. Il limite generativo non è la negazione dell'esperienza: è ciò che la rende possibile come esperienza limitata, finita, e quindi ripetibile. Senza limite, l'esperienza è informe.",
    nodo_tipico: 'N5 — Limite reale · N1 — Regolazione',
    colore_nodo: 'var(--corso-n5)',
    funzioni_associate: ['Proteggere', 'Stabilizzare'],
    segnali_indicativi: [
      'N5~ o N5↓ — il limite è assente o non tollerato',
      'Difficoltà nella transizione tra attività',
      "Assenza di discontinuità: l'esperienza non ha «fine» riconoscibile",
      'Contesto senza struttura temporale riconoscibile',
    ],
    forme_concrete: [
      "Anticipare verbalmente la fine di un'attività prima che avvenga",
      'Introdurre una routine di chiusura riconoscibile (gesto, frase, azione)',
      'Mantenere la discontinuità senza negoziare: il limite è condiviso, non imposto',
      'Lasciare che il bambino esperisca la fine senza sostituirla immediatamente',
    ],
    esempio:
      "Al nido, al momento del riordino, l'educatrice annuncia: «Adesso mettiamo via.» Non aspetta che il bambino finisca — lo anticipa mentre finisce. La sequenza è: annuncio → azione congiunta → pausa → attività successiva. Il limite non è un «no»: è una struttura temporale che l'esperienza può concludere e quindi ricominciare.",
    combinazioni_tipiche: ['U1', 'U2'],
    avvertimento:
      "Il limite generativo non è disciplina. Non si tratta di far obbedire: si tratta di dare forma all'esperienza attraverso la discontinuità. Un limite che produce disorganizzazione non è generativo — richiede prima stabilizzazione (U1) e poi può essere reintrodotto.",
  },
  {
    id: 'u6',
    codice: 'U6',
    nome: 'Riattivazione del Desiderio',
    colore: 'var(--corso-u6)',
    forma_universale: 'Riattivare la dimensione motivazionale quando il campo è stagnante',
    descrizione:
      "Azioni che restituiscono vitalità al campo quando il movimento evolutivo si è fermato: il bambino non esplora, non ha iniziativa, il campo è fermo pur essendo stabile. Non si tratta di «motivare» il bambino: si tratta di modificare le condizioni del campo in modo che il desiderio possa riemergere come orientamento spontaneo verso l'esperienza.",
    nodo_tipico: 'N7 — Desiderio · N4 — Apertura',
    colore_nodo: 'var(--corso-n7)',
    funzioni_associate: ['Ampliare'],
    segnali_indicativi: [
      'N7~ o N7↓ — dimensione motivazionale assente o compressa',
      'Campo stabile ma senza movimento (D→ prolungata)',
      'Iniziativa spontanea del bambino assente o molto ridotta',
      'Adulto che riempie continuamente lo spazio senza lasciare pause',
    ],
    forme_concrete: [
      "Introdurre una pausa nel ritmo adulto per lasciare spazio all'iniziativa del bambino",
      'Presentare una scelta concreta tra due possibilità tollerabili',
      'Creare una situazione incompleta che invita il bambino a completarla',
      'Ridurre la direttività adulta per lasciare emergere il desiderio spontaneo',
    ],
    esempio:
      "Il bambino che al nido non esplora, aspetta, replica. L'educatrice riduce le proposte e lascia una pausa di 30 secondi senza organizzare nulla. Il bambino guarda in giro, si orienta verso un cestino di oggetti. Si avvicina da solo. Non è stata introdotta novità (U3): è stato tolto l'eccesso di offerta perché il desiderio avesse spazio per emergere.",
    combinazioni_tipiche: ['U3', 'U2'],
    avvertimento:
      'La riattivazione del desiderio non è motivazione estrinseca. Non si tratta di premiare o lodare il bambino perché esplori. Si tratta di modificare le condizioni del campo — spesso sottraendo invece di aggiungere — perché il movimento evolutivo possa riattivarsi.',
  },
];

const TIPI_BY_CODE = SEI_TIPI_UNIVERSALI.reduce(
  (acc, t) => {
    acc[t.codice] = t;
    return acc;
  },
  {} as Record<string, (typeof SEI_TIPI_UNIVERSALI)[number]>,
);

const MATRICE_FUNZIONE_TIPO = [
  {
    funzione: 'Stabilizzare',
    badge: 'STA',
    funzione_colore: 'var(--corso-fn-stabilizzare)',
    tipi_principali: ['U1', 'U5'],
    tipi_secondari: [] as string[],
    logica:
      "Stabilizzare richiede ridurre la disorganizzazione (U1: Regolazione) e dare forma all'esperienza attraverso la discontinuità (U5: Limite Generativo). I due tipi si combinano frequentemente in contesti di alta instabilità.",
    nota: 'U5 in contesto di stabilizzazione è il limite che contiene, non che apre: il limite come protezione.',
  },
  {
    funzione: 'Ampliare',
    badge: 'AMP',
    funzione_colore: 'var(--corso-fn-ampliare)',
    tipi_principali: ['U3', 'U6'],
    tipi_secondari: ['U2'],
    logica:
      "Ampliare introduce possibilità nuove (U3: Apertura) e riattiva il desiderio di esplorazione (U6). La sintonizzazione (U2) spesso accompagna l'apertura: l'adulto segue l'avvicinamento del bambino alla novità.",
    nota:
      "U2 è secondario nell'ampliamento: serve a sostenere l'esplorazione che U3 ha aperto, non ad aprire.",
  },
  {
    funzione: 'Mediare',
    badge: 'MED',
    funzione_colore: 'var(--corso-fn-mediare)',
    tipi_principali: ['U2', 'U4'],
    tipi_secondari: [] as string[],
    logica:
      "Mediare sostiene una transizione già in corso: la sintonizzazione (U2) segue il ritmo del bambino senza dirigerlo, la mediazione simbolica (U4) usa oggetti o linguaggio come terreno condiviso dell'incontro. La combinazione U2+U4 è la più frequente nelle situazioni di mediazione.",
    nota:
      'Caso-guida: la lettura condivisa adulto-bambino (DBS) è U2+U4. La sintonizzazione segue il bambino; il libro è il mediatore simbolico.',
    casoGuida: true,
  },
  {
    funzione: 'Proteggere',
    badge: 'PRO',
    funzione_colore: 'var(--corso-fn-proteggere)',
    tipi_principali: ['U5', 'U1'],
    tipi_secondari: [] as string[],
    logica:
      'Proteggere previene il sovraccarico: il limite generativo (U5) riduce le richieste e le aspettative prima che producano disorganizzazione, la regolazione (U1) mantiene il registro del campo in condizioni di bassa stimolazione preventiva.',
    nota:
      'La differenza tra Stabilizzare e Proteggere si riflette nei tipi: stessa coppia U1+U5, ma U5 in Proteggere è preventivo — riduce prima che la crisi avvenga.',
  },
];

const COMBINAZIONI = [
  {
    id: 'u2u4',
    a: 'U2',
    b: 'U4',
    titolo: 'Sintonizzazione + Mediazione Simbolica',
    descrizione:
      'Il genitore segue il bambino (U2) usando il libro come terreno condiviso (U4).',
    funzione: 'MEDIARE',
    funzioneColore: 'var(--corso-fn-mediare)',
    nota: 'La transizione N2→N3 si realizza nell\'incontro sintonizzato intorno all\'oggetto simbolico.',
    casoGuida: true,
  },
  {
    id: 'u1u5',
    a: 'U1',
    b: 'U5',
    titolo: 'Regolazione + Limite Generativo',
    descrizione:
      'Il professionista riduce il carico (U1) e introduce una struttura temporale riconoscibile (U5).',
    funzione: 'STABILIZZARE / PROTEGGERE',
    funzioneColore: 'var(--corso-fn-stabilizzare)',
    nota: 'Campo in alta instabilità che ha bisogno di reggere.',
  },
  {
    id: 'u3u2',
    a: 'U3',
    b: 'U2',
    titolo: 'Apertura + Sintonizzazione',
    descrizione:
      'Si introduce una possibilità nuova (U3) e si segue la risposta del bambino senza dirigerla (U2).',
    funzione: 'AMPLIARE',
    funzioneColore: 'var(--corso-fn-ampliare)',
    nota: "Il campo regge — si apre verso nuove possibilità accompagnando l'avvicinamento del bambino.",
  },
  {
    id: 'u6u3',
    a: 'U6',
    b: 'U3',
    titolo: 'Riattivazione del Desiderio + Apertura',
    descrizione:
      "Si riduce l'offerta adulta (U6) e si introduce una possibilità esplorativa (U3).",
    funzione: 'AMPLIARE',
    funzioneColore: 'var(--corso-fn-ampliare)',
    nota: 'Il campo è fermo non per mancanza di stabilità ma per eccesso di direttività adulta.',
  },
];

const COMBINAZIONI_INCOERENTI = [
  {
    sigla: 'U3 + U1 su campo T0',
    spiegazione:
      "L'apertura richiede che il campo regga. Combinare apertura e regolazione su un campo T0 non funziona: la regolazione deve precedere, non accompagnare.",
  },
  {
    sigla: 'U4 + U5 senza U2',
    spiegazione:
      "La mediazione simbolica senza sintonizzazione diventa insegnamento. L'oggetto si carica di significati adulti invece di diventare terreno condiviso. U2 è il prerequisito di U4.",
  },
];

const CASO_GUIDA_M6 = {
  u2: {
    codice: 'U2',
    nome: 'Sintonizzazione',
    colore: 'var(--corso-u2)',
    come_si_manifesta:
      "Il genitore segue il bambino: nomina ciò che lui ha indicato, non ciò che il genitore ritiene importante. Attende dopo ogni risposta. Non anticipa. Non riempie il silenzio. Il ritmo è del bambino — l'adulto si sincronizza su di esso.",
    micro_azioni: [
      CASO_GUIDA_F3.f3.microAzioni[0],
      CASO_GUIDA_F3.f3.microAzioni[1],
      CASO_GUIDA_F3.f3.microAzioni[2],
    ],
  },
  u4: {
    codice: 'U4',
    nome: 'Mediazione Simbolica',
    colore: 'var(--corso-u4)',
    come_si_manifesta:
      "Il libro illustrato non è un materiale didattico: è il mediatore. Le immagini diventano il terreno condiviso dell'incontro. Il genitore usa il linguaggio per rendere l'immagine condivisibile — «Sì, il cane — e guarda qui...» — senza trasformarlo in lezione.",
    micro_azioni: [CASO_GUIDA_F3.f3.microAzioni[3]],
  },
  perche_non_u3:
    'U3 (Apertura) sarebbe inappropriato: N4↓ sconsiglia di introdurre novità. Ampliare su un campo con esplorazione già ridotta aumenta il carico su un nodo in tensione.',
  perche_non_u6:
    "U6 (Riattivazione del Desiderio) non è indicato: il bambino ha già iniziativa presente (indica, vocalizza, cerca l'adulto). Il desiderio non è assente — è il campo che non lo sostiene abbastanza.",
  perche_non_u1_u5:
    'U1 e U5 (Regolazione e Limite Generativo) non sono il focus: il campo non è in disorganizzazione (N1~, T2). Non serve stabilizzare né proteggere — serve sostenere la transizione già in corso.',
};

// ─── Helpers ─────────────────────────────────────────────────────────────

const stateClass = (s: string) => {
  if (s === '↑') return 'corso-ce-table__state--up';
  if (s === '↓') return 'corso-ce-table__state--down';
  return 'corso-ce-table__state--neu';
};

const ceTableHtml = (highlights: string[] = []) => {
  const ce = CASO_GUIDA_F3.ce;
  const labels = CASO_GUIDA_F3.letturaNodi;
  const set = new Set(highlights);
  const rows = (Object.keys(ce.nodi) as Array<keyof typeof ce.nodi>)
    .map((codice) => {
      const n = ce.nodi[codice];
      const isHl = set.has(codice as string);
      const lettura = labels[codice as string] ?? '';
      const rowCls = isHl ? 'corso-ce-row--highlight' : 'corso-ce-row--dim';
      const styleAttr = isHl
        ? `style="--corso-ce-row-color: ${n.colore}; background: color-mix(in srgb, ${n.colore} 12%, transparent);"`
        : '';
      return `
        <tr class="${rowCls}" ${styleAttr}>
          <td class="corso-ce-table__node">
            <span class="corso-ce-table__node-dot" style="background: ${n.colore};"></span>
            ${codice} — ${n.label}
          </td>
          <td class="corso-ce-table__state ${stateClass(n.stato)}">${n.stato}</td>
          <td class="corso-ce-table__lett">${lettura}</td>
        </tr>
      `;
    })
    .join('');
  return `
    <table class="corso-ce-table corso-ce-table--m3">
      <thead>
        <tr><th>Nodo</th><th>Stato</th><th>Lettura</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="corso-ce-summary corso-ce-summary--compact">
      <span><strong>R:</strong> ${ce.relazione}</span>
      <span><strong>D:</strong> ${ce.direzione}</span>
      <span><strong>T:</strong> ${ce.tenuta}</span>
      <span><strong>A:</strong> ${ce.abitabilita}</span>
    </div>
  `;
};

const indiceTipiHtml = `
  <div class="corso-m6-tipi-index" role="presentation">
    ${SEI_TIPI_UNIVERSALI.map(
      (t) => `
        <span class="corso-m6-tipo-chip" style="--corso-tipo-color: ${t.colore};">
          <span class="corso-m6-tipo-chip__dot"></span>
          <strong>${t.codice}</strong> ${t.nome}
          ${t.casoGuida ? '<span class="corso-m6-tipo-chip__star" title="Caso-guida">★</span>' : ''}
        </span>
      `,
    ).join('')}
  </div>
`;

// ─── Modulo ──────────────────────────────────────────────────────────────

export const Module06: Module = {
  id: 'm06',
  number: 6,
  title: 'La tipologia U1–U6',
  shortTitle: 'Tipologia U1–U6',
  accent: '#16a085',
  slides: [
    // ─── 6.1 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m06-01',
      type: 'standard',
      title: 'Oltre la funzione: le forme universali',
      subtitle: 'Lo stesso dispositivo può essere descritto in due modi',
      content: `
        <div class="corso-m6-intro-flow">
          <span class="corso-m6-intro-chip" style="background: var(--corso-fn-mediare);">MEDIAZIONE</span>
          <span class="corso-m6-intro-arrow">→</span>
          <span class="corso-m6-intro-chip corso-m6-intro-chip--neutral">Template F3 compilato</span>
        </div>
        <p class="corso-narrative__caption" style="text-align: center; margin-top: 6px;">
          Sappiamo la funzione. Sappiamo le micro-azioni. Sappiamo il campo bersaglio e l'indicatore di risonanza. <strong>Il dispositivo è pronto.</strong>
        </p>

        <div class="corso-m5-question" style="margin: 28px 0;">
          <p class="corso-m5-question__q">«Ma cosa sta facendo, più in profondità, questo dispositivo?»</p>
          <p class="corso-m5-question__sub">Seguire il bambino senza dirigerlo. Usare il libro come terreno condiviso.<br/>Questi sono gesti tecnici contestuali — e al tempo stesso forme universali.</p>
        </div>

        <div class="corso-two-col">
          <div class="corso-m4-distinct">
            <div class="corso-m4-distinct__lab">Il livello della funzione</div>
            <ul>
              <li>Descrive <strong>cosa</strong> il dispositivo fa al campo (Stabilizzare / Ampliare / Mediare / Proteggere)</li>
              <li>È contestuale alla CE: varia al variare della configurazione</li>
              <li>Risponde alla domanda: <em>quale funzione ha questa azione sul campo?</em></li>
            </ul>
          </div>
          <div class="corso-m4-distinct corso-m4-distinct--device">
            <div class="corso-m4-distinct__lab">Il livello del tipo universale</div>
            <ul>
              <li>Descrive la <strong>forma</strong> dell'azione come modalità di sostegno dell'esperienza</li>
              <li>È trasversale ai contesti, ai professionisti, alle popolazioni</li>
              <li>Risponde alla domanda: <em>quale forma prende il sostegno del campo in questa azione?</em></li>
            </ul>
          </div>
        </div>

        <p class="corso-emph corso-emph--center" style="margin: 18px 0 6px; font-style: italic; font-size: 1.02rem;">
          Un dispositivo si descrive sempre a entrambi i livelli.<br/>
          La funzione orienta la scelta; il tipo universale descrive la forma che l'azione prende nel campo.
        </p>
      `,
      notes:
        "La Tipologia U non è una classificazione di tecniche: è un vocabolario per descrivere le forme dell'incontro relazionale. La stessa forma (es. U2: Sintonizzazione) può essere espressa da dispositivi molto diversi in contesti molto diversi.",
    },

    // ─── 6.2 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m06-02',
      type: 'diagram',
      title: 'Sei forme, una mappa',
      subtitle: 'U1–U6: le forme universali di sostegno del campo relazionale',
      content: `
        <div class="corso-m6-map-wrap">
          <div class="corso-m6-map-axis corso-m6-map-axis--left" aria-hidden="true">← Campo più stabile</div>
          <div class="corso-m6-map">
            ${SEI_TIPI_UNIVERSALI.map(
              (t) => `
                <div class="corso-m6-map-card" style="--corso-tipo-color: ${t.colore}; --corso-nodo-color: ${t.colore_nodo};">
                  ${t.casoGuida ? '<span class="corso-m6-map-card__star" title="Caso-guida">★ caso-guida</span>' : ''}
                  <div class="corso-m6-map-card__head">
                    <span class="corso-m6-map-card__code">${t.codice}</span>
                    <span class="corso-m6-map-card__name">${t.nome}</span>
                  </div>
                  <p class="corso-m6-map-card__forma"><em>${t.forma_universale}</em></p>
                  <span class="corso-m6-map-card__nodo">${t.nodo_tipico}</span>
                </div>
              `,
            ).join('')}
          </div>
          <div class="corso-m6-map-axis corso-m6-map-axis--right" aria-hidden="true">Campo in movimento →</div>
        </div>

        <div class="corso-two-col" style="margin-top: 18px;">
          <div class="corso-m6-mapnote">
            <div class="corso-m6-mapnote__lab">Non sono gerarchici</div>
            <p>I sei tipi non hanno priorità intrinseca. U1 non è «più importante» di U6: la rilevanza dipende dalla CE. In contesti diversi, tipi diversi sono primari.</p>
          </div>
          <div class="corso-m6-mapnote">
            <div class="corso-m6-mapnote__lab">Non sono esclusivi</div>
            <p>I dispositivi reali combinano quasi sempre due tipi. La combinazione non è un'eccezione: è la norma. La Tipologia U descrive forme che si intrecciano nell'azione concreta.</p>
          </div>
        </div>
      `,
      notes:
        "Nella slide successiva esploriamo ogni tipo nel dettaglio. La mappa qui è solo orientamento: non classificare le azioni in un unico tipo prima di aver letto il campo.",
    },

    // ─── 6.3 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m06-03',
      type: 'interactive',
      title: 'U1–U6: il dettaglio',
      subtitle: 'Sei forme di sostegno, sei domande al campo',
      intro: indiceTipiHtml,
      interactive: {
        kind: 'expandable-cards',
        layout: 'vertical',
        multiOpen: false,
        defaultOpen: ['u2'],
        cards: SEI_TIPI_UNIVERSALI.map((t) => ({
          id: t.id,
          color: t.colore,
          badge: t.codice,
          title: t.nome,
          summary: t.forma_universale,
          detail: `
            <div class="corso-m6-card">
              <div class="corso-m6-card__forma">
                <span class="corso-m6-card__lab">Forma universale</span>
                <p>${t.descrizione}</p>
              </div>

              <div class="corso-m6-card__signals">
                <span class="corso-m6-card__lab">Quando emerge nella CE — segnali indicativi</span>
                <div class="corso-m6-card__chips">
                  ${t.segnali_indicativi.map((s) => `<span class="corso-m6-card__chip">${s}</span>`).join('')}
                </div>
              </div>

              <div class="corso-m6-card__forme">
                <span class="corso-m6-card__lab">Come si manifesta — forme concrete</span>
                <ol>
                  ${t.forme_concrete.map((f) => `<li>${f}</li>`).join('')}
                </ol>
              </div>

              <div class="corso-m6-card__example">
                <span class="corso-m6-card__lab">Esempio</span>
                <p><em>${t.esempio}</em></p>
              </div>

              <div class="corso-m6-card__warn">
                <div>
                  <span class="corso-m6-card__warn-lab">Si combina con</span>
                  <div class="corso-m6-card__combo">
                    ${t.combinazioni_tipiche
                      .map((c) => {
                        const tt = TIPI_BY_CODE[c];
                        return `<span class="corso-m6-card__combo-chip" style="--corso-tipo-color: ${tt?.colore ?? 'var(--corso-text-muted)'};">${c} ${tt?.nome ?? ''}</span>`;
                      })
                      .join('')}
                  </div>
                </div>
                <div>
                  <span class="corso-m6-card__warn-lab">Avvertimento</span>
                  <p>${t.avvertimento}</p>
                </div>
              </div>

              <div class="corso-m6-card__nodi">
                <span class="corso-m6-card__lab">Nodo tipico</span>
                <span class="corso-m6-card__nodo-chip" style="--corso-nodo-color: ${t.colore_nodo};">${t.nodo_tipico}</span>
              </div>

              <div class="corso-m6-card__nodi">
                <span class="corso-m6-card__lab">Funzioni associate</span>
                ${t.funzioni_associate.map((f) => `<span class="corso-m6-card__fn">${f}</span>`).join(' · ')}
              </div>
            </div>
          `,
        })),
      },
      guardrail: {
        code: 'C-F3-60',
        label: 'I tipi descrivono forme, non tecniche',
        text:
          "U2 (Sintonizzazione) non è la «Tecnica della Sintonizzazione». È una forma che può essere espressa da gesti, parole, movimenti, silenzi. I tipi descrivono la grammatica dell'azione — non il suo vocabolario tecnico.",
      },
    },

    // ─── 6.4 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m06-04',
      type: 'standard',
      title: 'Come funzione e tipo si collegano',
      subtitle: 'Non una regola meccanica: un orientamento tendenziale',
      content: `
        <p class="corso-m4-rule-intro" style="text-align: left;">
          La scelta della <strong>funzione</strong> (M4) orienta, ma non determina, il <strong>tipo universale</strong>. La stessa funzione può esprimersi attraverso tipi diversi a seconda del campo specifico.
        </p>
        <p class="corso-narrative__caption" style="font-style: italic; text-align: center; margin-bottom: 12px;">
          La matrice qui sotto è tendenziale: indica le associazioni più frequenti, non le uniche possibili.
        </p>

        <table class="corso-m6-matrix">
          <thead>
            <tr>
              <th>Funzione</th>
              <th>Tipi principali</th>
              <th>Tipi secondari</th>
              <th>Logica</th>
            </tr>
          </thead>
          <tbody>
            ${MATRICE_FUNZIONE_TIPO.map(
              (m) => `
                <tr class="${m.casoGuida ? 'corso-m6-matrix__row--caso' : ''}" style="--corso-fn-color: ${m.funzione_colore};">
                  <td>
                    <span class="corso-m6-matrix__badge">${m.badge}</span>
                    <span class="corso-m6-matrix__nome">${m.funzione}</span>
                    ${m.casoGuida ? '<span class="corso-m6-matrix__star">★ caso-guida</span>' : ''}
                  </td>
                  <td>
                    <div class="corso-m6-matrix__chips">
                      ${m.tipi_principali
                        .map((c) => {
                          const tt = TIPI_BY_CODE[c];
                          return `<span class="corso-m6-matrix__u" style="--corso-tipo-color: ${tt?.colore};">${c}</span>`;
                        })
                        .join('')}
                    </div>
                  </td>
                  <td>
                    ${
                      m.tipi_secondari.length
                        ? `<div class="corso-m6-matrix__chips">${m.tipi_secondari
                            .map((c) => {
                              const tt = TIPI_BY_CODE[c];
                              return `<span class="corso-m6-matrix__u corso-m6-matrix__u--sec" style="--corso-tipo-color: ${tt?.colore};">${c}</span>`;
                            })
                            .join('')}</div>`
                        : '<span class="corso-m6-matrix__none">—</span>'
                    }
                  </td>
                  <td>
                    <p class="corso-m6-matrix__logic">${m.logica}</p>
                    <p class="corso-m6-matrix__nota"><em>${m.nota}</em></p>
                  </td>
                </tr>
              `,
            ).join('')}
          </tbody>
        </table>

        <div class="corso-m3-rule" style="margin-top: 18px;">
          <div class="corso-m3-rule__head">La matrice non è un algoritmo</div>
          <p>Casi reali producono configurazioni in cui:</p>
          <ul>
            <li>la funzione scelta suggerisce U1, ma il campo specifico richiede U5</li>
            <li>la funzione è Mediare, ma il campo ha anche bisogno di U1 per reggere</li>
            <li>due funzioni co-presenti richiedono tipi che normalmente non si combinano</li>
          </ul>
          <p style="font-style: italic;">In questi casi, la lettura del campo prevale sulla matrice. La matrice è utile per orientarsi — non per sostituire la lettura.</p>
        </div>
      `,
      notes:
        'Nel caso-guida: funzione MEDIAZIONE → tipi principali U2+U4. La matrice lo indica correttamente. La slide successiva mostra perché.',
    },

    // ─── 6.5 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m06-05',
      type: 'standard',
      title: 'I tipi si combinano',
      subtitle: 'Perché i dispositivi reali esprimono quasi sempre più di un tipo',
      content: `
        <p class="corso-m4-rule-intro" style="text-align: center;">
          Un dispositivo F3 reale raramente esprime un tipo universale in stato puro.<br/>
          Quasi sempre <strong>due tipi si intrecciano</strong>: uno principale, uno di supporto.
        </p>
        <p class="corso-narrative__caption" style="text-align: center; font-style: italic; margin-bottom: 14px;">
          Questo non è un difetto — è la natura dell'azione relazionale contestualizzata.
        </p>

        <div class="corso-m6-combos">
          ${COMBINAZIONI.map(
            (c) => {
              const ta = TIPI_BY_CODE[c.a];
              const tb = TIPI_BY_CODE[c.b];
              return `
                <div class="corso-m6-combo ${c.casoGuida ? 'corso-m6-combo--caso' : ''}">
                  ${c.casoGuida ? '<span class="corso-m6-combo__star">★ Caso-guida DBS</span>' : ''}
                  <div class="corso-m6-combo__chips">
                    <span class="corso-m6-combo__chip" style="--corso-tipo-color: ${ta?.colore};">${c.a}</span>
                    <span class="corso-m6-combo__plus">+</span>
                    <span class="corso-m6-combo__chip" style="--corso-tipo-color: ${tb?.colore};">${c.b}</span>
                  </div>
                  <h3 class="corso-m6-combo__title">${c.titolo}</h3>
                  <p class="corso-m6-combo__desc">${c.descrizione}</p>
                  <div class="corso-m6-combo__fn">
                    <span class="corso-m6-combo__fn-lab">Funzione</span>
                    <span class="corso-m6-combo__fn-badge" style="background: ${c.funzioneColore};">${c.funzione}</span>
                  </div>
                  <p class="corso-m6-combo__nota"><em>${c.nota}</em></p>
                </div>
              `;
            },
          ).join('')}
        </div>

        <div class="corso-m6-incoerenti">
          <div class="corso-m6-incoerenti__head">Combinazioni incoerenti</div>
          ${COMBINAZIONI_INCOERENTI.map(
            (c) => `
              <div class="corso-m6-incoerente">
                <code class="corso-m6-incoerente__sigla">${c.sigla}</code>
                <p>${c.spiegazione}</p>
              </div>
            `,
          ).join('')}
        </div>

        <p class="corso-narrative__caption" style="text-align: center; font-style: italic; margin-top: 14px;">
          Le combinazioni si descrivono sempre partendo dal tipo principale e indicando il secondario come «di supporto». Nel caso-guida: U2 principale, U4 secondario — anche se nella scena sono difficilmente separabili.
        </p>
      `,
    },

    // ─── 6.6 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m06-06',
      type: 'narrative',
      title: 'La lettura condivisa come U2 + U4',
      subtitle: 'Perché il Dialogic Book Sharing esprime Sintonizzazione e Mediazione Simbolica',
      content: `
        <div class="corso-two-col corso-two-col--40-60 corso-m6-caso">
          <div>
            <div class="corso-m3-cebox">
              <div class="corso-m3-cebox__lab">CE del caso-guida</div>
              ${ceTableHtml(['N2', 'N3'])}
            </div>
            <div class="corso-m6-caso__fn">
              <span class="corso-m6-caso__fn-badge" style="background: var(--corso-fn-mediare);">MED · Mediazione</span>
              <p>La funzione è già stata scelta (M4). I tipi universali descrivono la forma che <strong>MEDIAZIONE</strong> prende in questa scena specifica.</p>
            </div>
          </div>

          <div class="corso-m6-caso__right">
            <div class="corso-m6-caso__block" style="--corso-tipo-color: var(--corso-u2);">
              <div class="corso-m6-caso__block-head">
                <span class="corso-m6-caso__block-badge">U2</span>
                <h3>Sintonizzazione</h3>
              </div>
              <p class="corso-m6-caso__manif">${CASO_GUIDA_M6.u2.come_si_manifesta}</p>
              <div class="corso-m6-caso__azioni">
                <span class="corso-m6-caso__azioni-lab">Micro-azioni corrispondenti</span>
                <ol>
                  ${CASO_GUIDA_M6.u2.micro_azioni.map((a) => `<li>${a}</li>`).join('')}
                </ol>
              </div>
            </div>

            <div class="corso-m6-caso__block" style="--corso-tipo-color: var(--corso-u4);">
              <div class="corso-m6-caso__block-head">
                <span class="corso-m6-caso__block-badge">U4</span>
                <h3>Mediazione Simbolica</h3>
              </div>
              <p class="corso-m6-caso__manif">${CASO_GUIDA_M6.u4.come_si_manifesta}</p>
              <div class="corso-m6-caso__azioni">
                <span class="corso-m6-caso__azioni-lab">Micro-azioni corrispondenti</span>
                <ol>
                  ${CASO_GUIDA_M6.u4.micro_azioni.map((a) => `<li>${a}</li>`).join('')}
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div class="corso-m6-caso__why-not">
          <div class="corso-m6-caso__why-not-head">Perché non U3, U6, U1, U5</div>
          <p>${CASO_GUIDA_M6.perche_non_u3}</p>
          <p>${CASO_GUIDA_M6.perche_non_u6}</p>
          <p>${CASO_GUIDA_M6.perche_non_u1_u5}</p>
        </div>

        <div class="corso-callout corso-callout--accent-f3" style="margin-top: 18px;">
          <p>U2 e U4 non sono nomi di tecniche: <strong>descrivono cosa fa questa scena al campo</strong>.</p>
          <p>Il genitore che segue il bambino è U2 perché la sua azione produce sintonizzazione. Il libro che diventa terreno condiviso è U4 perché la sua presenza trasforma l'oggetto in mediatore dell'incontro.</p>
          <p style="font-style: italic;">La stessa forma U2+U4 potrebbe realizzarsi in un gioco imitativo, in una routine di pasti, in una passeggiata. <strong>La forma è universale — il dispositivo è contestuale.</strong></p>
        </div>
      `,
    },

    // ─── 6.7 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m06-07',
      type: 'comparison',
      title: 'La Tipologia U non è un catalogo',
      subtitle: 'Il rischio di usare i tipi universali nel modo sbagliato',
      content: `
        <div class="corso-cmp2">
          <section class="corso-cmp2__col corso-cmp2__col--left">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab">Catalogo di tecniche</span>
              <h3 class="corso-cmp2__title">Il tipo come tecnica da applicare</h3>
            </header>
            <ul class="corso-cmp2__items">
              <li><div class="corso-cmp2__item-text">«Per questo bambino uso U2 — applico la Tecnica della Sintonizzazione.»</div></li>
              <li><div class="corso-cmp2__item-text">«La Tipologia dice U4: uso il libro con questa procedura specifica.»</div></li>
              <li><div class="corso-cmp2__item-text">«Ho scelto U2+U4 per tutti i casi di questo tipo.»</div></li>
            </ul>
            <p class="corso-cmp2__foot-note">Trattare i tipi come tecniche pre-confezionate perde il punto: i tipi descrivono <em>forme</em> — non prescrivono azioni. «Usare U2» non dice nulla su cosa fare: dice solo qual è la forma dell'azione.</p>
          </section>

          <section class="corso-cmp2__col" style="border-top-color: var(--corso-module-accent); background: color-mix(in srgb, var(--corso-module-accent) 4%, transparent);">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab" style="color: var(--corso-module-accent);">Vocabolario di lettura</span>
              <h3 class="corso-cmp2__title">Il tipo come descrizione della forma dell'azione</h3>
            </header>
            <ul class="corso-cmp2__items">
              <li><div class="corso-cmp2__item-text">«Questa azione esprime U2 perché segue il ritmo del bambino senza dirigerlo.»</div></li>
              <li><div class="corso-cmp2__item-text">«Il dispositivo è U4: l'oggetto funziona da mediatore simbolico dell'incontro.»</div></li>
              <li><div class="corso-cmp2__item-text">«La combinazione U2+U4 descrive questa scena specifica — potrebbe non valere per un'altra scena con la stessa funzione.»</div></li>
            </ul>
            <p class="corso-cmp2__foot-note" style="color: var(--corso-module-accent);">I tipi sono un vocabolario condiviso tra professionisti: permettono di descrivere la forma dell'azione in modo riconoscibile, trasversale alle discipline e ai contesti.</p>
          </section>
        </div>

        <div class="corso-cmp2__footer">
          <span class="corso-cmp2__footer-lab">Cosa risponde la Tipologia U</span>
          <p>La Tipologia U non risponde alla domanda «cosa fare?» (questo è compito del Template F3 e della scelta della funzione). Risponde alla domanda «come descrivere la forma di ciò che si fa?» — e questa è una domanda diversa.</p>
        </div>
      `,
      guardrail: {
        code: 'C-F3-61',
        label: 'Il tipo non sostituisce la lettura del campo',
        text:
          'Scegliere un tipo universale prima di leggere la CE è un errore. I tipi emergono dalla lettura della funzione e del campo bersaglio — non dalla classificazione del bambino o della situazione.',
      },
    },

    // ─── 6.8 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m06-08',
      type: 'standard',
      title: 'La Tipologia U come linguaggio tra professionisti',
      subtitle: 'Cosa resta dopo aver descritto il dispositivo per tipo universale',
      content: `
        <p class="corso-emph corso-emph--center" style="font-size: 1.15rem; font-style: italic; margin: 18px auto 28px; max-width: 720px;">
          «La Tipologia U permette di parlare delle forme dell'azione relazionale al di là delle discipline, delle tecniche, dei protocolli.»
        </p>

        <div class="corso-m6-props">
          <div class="corso-m6-prop">
            <div class="corso-m6-prop__num">1</div>
            <div class="corso-m6-prop__lab">Trasversale</div>
            <p>U2 (Sintonizzazione) è riconoscibile in un bilancio pediatrico, in una sessione logopedica, in un'attività di nido, in una consultazione con la famiglia.</p>
            <p class="corso-m6-prop__sub"><em>La stessa forma, contesti diversi.</em></p>
          </div>
          <div class="corso-m6-prop">
            <div class="corso-m6-prop__num">2</div>
            <div class="corso-m6-prop__lab">Non diagnostico</div>
            <p>I tipi non classificano il bambino: descrivono la forma del sostegno.</p>
            <p class="corso-m6-prop__sub"><em>Non «bambini che hanno bisogno di U2» — ma «questa situazione richiede un'azione con forma U2».</em></p>
          </div>
          <div class="corso-m6-prop">
            <div class="corso-m6-prop__num">3</div>
            <div class="corso-m6-prop__lab">Aggiornabile</div>
            <p>Una CE aggiornata dopo il dispositivo può indicare che il tipo principale è cambiato.</p>
            <p class="corso-m6-prop__sub"><em>Non si insiste: si rilegge il campo e, se necessario, si cambia forma.</em></p>
          </div>
        </div>

        <div class="corso-callout corso-callout--accent-f3" style="margin-top: 22px;">
          <p>Abbiamo ora tutti gli elementi del micro-dispositivo:</p>
          <p style="font-style: italic;">la <strong>funzione</strong> (M4) → il <strong>template</strong> con le micro-azioni (M5) → la <strong>forma universale</strong> (M6).</p>
          <p>Nel Modulo 7 affrontiamo la domanda che sta sotto tutto questo: <strong>chi decide?</strong> Come si decide in tempo reale, nel contesto professionale, con il bambino davanti?</p>
          <p style="font-style: italic;">La logica decisionale è il ponte tra la CE prodotta dalla F2 e l'azione nella scena.</p>
        </div>

        <div class="corso-m3-next">
          <span class="corso-m3-next__arrow">→</span>
          <span class="corso-m3-next__lab">Modulo 7 — Logica decisionale</span>
        </div>
      `,
    },
  ],
};
