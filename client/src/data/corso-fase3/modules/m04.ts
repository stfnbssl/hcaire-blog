import { Module } from '../types';
import { CASO_GUIDA_F3 } from '../caso-guida';

// ─── Dati globali del modulo ─────────────────────────────────────────────

const QUATTRO_FUNZIONI = [
  {
    id: 'stabilizzare',
    nome: 'Stabilizzare',
    colore: 'var(--corso-fn-stabilizzare)',
    badge: 'STA',
    azione_sul_campo: 'Ridurre la disorganizzazione in atto',
    quando:
      "Quando il campo è in collasso o sotto forte stress (T0–T1). La priorità è che l'esperienza non si frammenti ulteriormente. Non si lavora su nessun altro nodo finché il campo non regge.",
    nodi_tipici: ['N1', 'N2'],
    segnali_CE: [
      'N1↓ o N2↓',
      'Tenuta T0 o T1 (bassa o critica)',
      'Abitabilità A− (campo non abitabile)',
      'Direzione D↙ (contrazione)',
    ],
    micro_azioni: [
      'Ridurre gli stimoli ambientali: meno input simultanei',
      "Introdurre ritmo e prevedibilità nella sequenza dell'incontro",
      'Presenza adulta regolativa: voce calma, postura stabile, movimenti lenti',
      "Ridurre durata e complessità dell'interazione",
    ],
    esempio:
      "Bilancio pediatrico: durante l'esame fisico il bambino si irrigidisce, piange, cerca il genitore. Il campo si sta disorganizzando (N1↓). Il genitore lo prende, gli parla piano. Il pediatra rallenta e aspetta. Prima di qualsiasi altra cosa il campo deve poter reggere. Questa è stabilizzazione.",
    errore:
      "«Stimolo il bambino per farlo uscire dalla crisi.» L'opposto: durante la disorganizzazione, la stimolazione aumenta il carico. Prima si stabilizza, poi si lavora su altro.",
    non_confondere:
      'Con Proteggere: Stabilizzare risponde a una disorganizzazione già in atto. Proteggere la previene prima che avvenga.',
  },
  {
    id: 'ampliare',
    nome: 'Ampliare',
    colore: 'var(--corso-fn-ampliare)',
    badge: 'AMP',
    azione_sul_campo: "Aumentare l'esplorabilità del campo",
    quando:
      "Quando il campo è stabile e l'abitabilità è buona, ma c'è poco movimento evolutivo. Il bambino potrebbe esplorare ma il campo non gli offre abbastanza apertura, o l'iniziativa spontanea non trova sostegno.",
    nodi_tipici: ['N4', 'N7'],
    segnali_CE: [
      'N4↓ o N7~ in campo stabile',
      'Tenuta T2–T3 (sufficiente o buona)',
      'Abitabilità A± o A+ con D→ (stabilità senza espansione)',
      'N1 e N2 sostenuti: il campo regge',
    ],
    micro_azioni: [
      'Introdurre un elemento nuovo ma tollerabile accanto ai familiari',
      "Sostenere e amplificare l'iniziativa spontanea senza dirigerla",
      'Ridurre leggermente la prevedibilità (sorpresa tollerabile)',
      'Lasciare spazio al bambino per avvicinarsi al nuovo senza pressione',
    ],
    esempio:
      "Al nido, un bambino con buona regolazione (N1~, N2↑) che torna sempre agli stessi oggetti (N7~, N4↓ in campo stabile). L'educatrice posiziona un oggetto nuovo vicino a quelli familiari e aspetta senza commentare. Il bambino si avvicina da solo. Questo è ampliamento.",
    errore:
      "«Amplio il campo anche quando il bambino è agitato.» Se T0–T1, la novità amplifica la disorganizzazione già presente. Ampliare richiede che il campo regga già.",
    non_confondere:
      'Con Mediare: Ampliare apre verso il nuovo (non ancora presente). Mediare sostiene una transizione già avviata tra nodi che ci sono.',
  },
  {
    id: 'mediare',
    nome: 'Mediare',
    colore: 'var(--corso-fn-mediare)',
    badge: 'MED',
    azione_sul_campo: 'Sostenere una transizione già in corso tra nodi',
    quando:
      "Quando una risorsa attiva (↑) sta già spingendo verso un nodo neutro (~) e la relazione R lo indica. Il campo è già in transizione: non si tratta di avviarla, ma di sostenerla perché si completi.",
    nodi_tipici: ['N2→N3', 'N1↔N4'],
    segnali_CE: [
      'R: Nodo↑ → Nodo~ (la transizione è già in corso)',
      'Direzione D↗ (espansione in atto)',
      'Tenuta T2 (fragile ma aperto)',
      'Abitabilità A±',
    ],
    micro_azioni: [
      'Sostenere la sequenza che il bambino ha già avviato senza interromperla',
      'Rallentare il ritmo per lasciare che la transizione si completi',
      "Nominare senza anticipare: l'adulto segue, non guida",
      'Mantenere la continuità dello scambio senza aggiungere elementi nuovi',
    ],
    esempio:
      "Il caso-guida: N2↑ sta già sostenendo N3~. R: N2→N3. La transizione è in corso — il bambino indica, vocalizza, cerca l'adulto. Il genitore rallenta, nomina ciò che il bambino indica, aspetta. Non introduce novità. Non dirige. Sostiene ciò che si sta già muovendo. Questo è mediazione.",
    errore:
      "«Medierò introducendo un elemento nuovo che faciliti il passaggio.» Non è mediazione: è ampliamento. Mediare non aggiunge nulla al campo: sostiene ciò che è già in movimento. Aggiungere elementi nuovi può interrompere la transizione invece di sostenerla.",
    non_confondere:
      'Con Ampliare: Mediare non introduce novità — sostiene una transizione già avviata. Con Stabilizzare: Mediare presuppone un campo abbastanza stabile da poter fare la transizione (almeno T2).',
  },
  {
    id: 'proteggere',
    nome: 'Proteggere',
    colore: 'var(--corso-fn-proteggere)',
    badge: 'PRO',
    azione_sul_campo: 'Prevenire il sovraccarico prima che avvenga',
    quando:
      "Quando il campo è a rischio di collasso per eccesso di stimoli, richieste o aspettative — ma non è ancora disorganizzato. Proteggere è preventiva per definizione: agisce prima che la disorganizzazione avvenga.",
    nodi_tipici: ['N1', 'N4 (con ↓)'],
    segnali_CE: [
      'N1~ con tenuta T1 (fragile)',
      'N4↓ con contesto ad alto carico percettivo',
      'Abitabilità A± con rischio di deterioramento',
      'Contesto: molti adulti, rumore, tempo limitato, procedure complesse',
    ],
    micro_azioni: [
      'Ridurre preventivamente il numero di richieste e interlocutori',
      'Creare o mantenere una zona di minore stimolazione nel contesto',
      "Interrompere l'interazione prima che il bambino si saturi",
      'Anticipare i momenti di carico e prepararli (prevedibilità protettiva)',
    ],
    esempio:
      "Un bambino in un setting affollato con N1~ e N4↓. Prima che N1 scenda a ↓, il professionista riduce il numero di adulti presenti, abbassa il volume dell'ambiente, accorcia la durata dell'esame. Non c'è ancora disorganizzazione — si previene. Questo è protezione.",
    errore:
      '«Proteggo aspettando che il bambino si agiti.» Troppo tardi: è già Stabilizzare. Proteggere è preventiva. Se aspetto che N1 scenda a ↓ per intervenire, la funzione necessaria è cambiata.',
    non_confondere:
      'Con Stabilizzare: Proteggere è preventiva (prima del collasso), Stabilizzare è reattiva (durante o dopo). Il segnale discriminante è lo stato di N1: ~ → Proteggere, ↓ → Stabilizzare.',
  },
];

const SEGNALI_CE_FUNZIONE = [
  {
    id: 'sta',
    segnale: 'N1↓ o N2↓ · T0–T1 · A− · D↙',
    funzione: 'STA',
    funzioneNome: 'Stabilizzare',
    colore: 'var(--corso-fn-stabilizzare)',
    motivazione:
      "Il campo è in collasso o ci va vicino. La priorità assoluta è che l'esperienza non si frammenti. Nessun altro lavoro prima di questo.",
  },
  {
    id: 'amp',
    segnale: 'N4↓ o N7~ in T2–T3 · A± o A+ · D→',
    funzione: 'AMP',
    funzioneNome: 'Ampliare',
    colore: 'var(--corso-fn-ampliare)',
    motivazione:
      "Il campo regge ma è fermo. C'è abitabilità senza espansione. Si apre il campo verso possibilità nuove che il bambino può esplorare in sicurezza.",
  },
  {
    id: 'med',
    segnale: 'R: Nodo↑→Nodo~ · D↗ · T2 · A±',
    funzione: 'MED',
    funzioneNome: 'Mediare',
    colore: 'var(--corso-fn-mediare)',
    motivazione:
      'Una transizione è già in corso. Il campo si sta muovendo da solo: si accompagna, non si forza. Aggiungere troppo interromperebbe il movimento.',
  },
  {
    id: 'pro',
    segnale: 'N1~ con T1 · N4↓ · contesto ad alto carico',
    funzione: 'PRO',
    funzioneNome: 'Proteggere',
    colore: 'var(--corso-fn-proteggere)',
    motivazione:
      'Il campo non è ancora in crisi ma è esposto. Si interviene preventivamente prima che N1 scenda o che il sovraccarico produca disorganizzazione.',
  },
];

const ERRORI_FUNZIONE = [
  {
    id: 'ef1',
    numero: '①',
    errore: 'Ampliare quando il campo è fragile (T0–T1)',
    situazione:
      'Il bambino è in difficoltà, agitato o disorganizzato. Il professionista introduce novità per «stimolarlo».',
    cosa_succede:
      "La novità aumenta il carico su un campo già sotto stress. L'agitazione peggiora.",
    funzione_corretta: { badge: 'STA', nome: 'Stabilizzare', colore: 'var(--corso-fn-stabilizzare)' },
    funzione_corretta_text: 'Prima che il campo regga, non si aggiunge nulla.',
  },
  {
    id: 'ef2',
    numero: '②',
    errore: 'Stabilizzare quando il campo è già regolato (T2–T3)',
    situazione:
      "Il campo è stabile e l'abitabilità è buona. Il professionista riduce comunque la complessità e introduce routine eccessive.",
    cosa_succede:
      'Stagnazione. Il bambino non ha stimolo per muoversi. Il campo si «addormenta» invece di espandersi.',
    funzione_corretta: { badge: 'AMP/MED', nome: 'Ampliare o Mediare', colore: 'var(--corso-fn-ampliare)' },
    funzione_corretta_text: 'A seconda dei nodi e di R.',
  },
  {
    id: 'ef3',
    numero: '③',
    errore: 'Mediare senza che R indichi la transizione',
    situazione:
      'Il professionista sceglie un nodo ~ come «obiettivo» e cerca di mediare un passaggio verso di lui — ma R non punta in quella direzione e D non è coerente.',
    cosa_succede:
      "Si «medierebbe» una transizione che il campo non ha avviato. Il dispositivo è privo di aggancio: non trova risonanza.",
    funzione_corretta: { badge: 'CE', nome: 'Rivalutare la CE', colore: 'var(--corso-text-muted)' },
    funzione_corretta_text:
      'Se la transizione non è in corso, la funzione è Ampliare (per avviarla) o Stabilizzare (se il campo non regge).',
  },
  {
    id: 'ef4',
    numero: '④',
    errore: 'Confondere Proteggere e Stabilizzare sul timing',
    situazione:
      'Il bambino si è già disorganizzato. Il professionista riduce gli stimoli preventivamente — ma la disorganizzazione è già in atto.',
    cosa_succede:
      'Le misure preventive non bastano quando la crisi è già iniziata. Si perde tempo prezioso di regolazione attiva.',
    funzione_corretta: { badge: 'STA', nome: 'Stabilizzare', colore: 'var(--corso-fn-stabilizzare)' },
    funzione_corretta_text: 'La disorganizzazione è in atto. Proteggere vale prima, non durante.',
  },
];

const SEQUENZA_DECISIONALE = [
  {
    id: 's1',
    passo: '①',
    titolo: 'Leggi T e A nella CE',
    domanda: 'Il campo regge? Qual è l\'abitabilità?',
    rami: [
      {
        condizione: 'T0–T1 o A−',
        esito: 'Stabilizzare è la prima priorità. Stop.',
        badge: 'STA',
        colore: 'var(--corso-fn-stabilizzare)',
        tipo: 'funzione' as const,
      },
      {
        condizione: 'T1 + contesto ad alto carico',
        esito: 'Proteggere preventivamente.',
        badge: 'PRO',
        colore: 'var(--corso-fn-proteggere)',
        tipo: 'funzione' as const,
      },
      {
        condizione: 'T2–T3 e A± o A+',
        esito: 'Continua al passo ②',
        badge: '↓',
        colore: 'var(--corso-text-muted)',
        tipo: 'next' as const,
      },
    ],
  },
  {
    id: 's2',
    passo: '②',
    titolo: 'Leggi R e D nella CE',
    domanda: "C'è una transizione già in corso?",
    rami: [
      {
        condizione: 'R: Nodo↑ → Nodo~ e D↗',
        esito: 'Mediare: la transizione è avviata. Accompagnala.',
        badge: 'MED',
        colore: 'var(--corso-fn-mediare)',
        tipo: 'funzione' as const,
      },
      {
        condizione: 'R assente o D→ o D↙',
        esito: 'Continua al passo ③',
        badge: '↓',
        colore: 'var(--corso-text-muted)',
        tipo: 'next' as const,
      },
    ],
  },
  {
    id: 's3',
    passo: '③',
    titolo: 'Leggi N4 e N7 nella CE',
    domanda: 'Il campo è stabile ma poco espansivo?',
    rami: [
      {
        condizione: 'N4↓ o N7~ in campo stabile con D→',
        esito: 'Ampliare: il campo è pronto per muoversi ma non si muove.',
        badge: 'AMP',
        colore: 'var(--corso-fn-ampliare)',
        tipo: 'funzione' as const,
      },
      {
        condizione: 'N4 e N7 già sostenuti',
        esito: "Rivaluta il nodo dominante. La CE può richiedere un'altra lettura.",
        badge: '↺',
        colore: 'var(--corso-text-muted)',
        tipo: 'rivalutare' as const,
      },
    ],
  },
];

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

const indiceFunzioniHtml = `
  <div class="corso-m4-fn-index" role="presentation">
    ${QUATTRO_FUNZIONI.map(
      (f) => `
        <span class="corso-m4-fn-chip" style="--corso-fn-color: ${f.colore};">
          <span class="corso-m4-fn-chip__dot"></span>
          <strong>${f.badge}</strong> ${f.nome}
        </span>
      `,
    ).join('')}
  </div>
`;

// ─── Modulo ──────────────────────────────────────────────────────────────

export const Module04: Module = {
  id: 'm04',
  number: 4,
  title: 'Le quattro funzioni',
  shortTitle: 'Quattro funzioni',
  accent: '#3498db',
  slides: [
    // ─── 4.1 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m04-01',
      type: 'comparison',
      title: 'La domanda sbagliata e quella giusta',
      subtitle: 'Il punto di partenza di ogni strumento F3',
      content: `
        <div class="corso-cmp2">
          <section class="corso-cmp2__col corso-cmp2__col--left">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab">La domanda per tecnica</span>
              <h3 class="corso-cmp2__title">«Quale tecnica uso?»</h3>
            </header>
            <ul class="corso-cmp2__items">
              <li><div class="corso-cmp2__item-text">«Uso la lettura dialogica? Il play-based therapy? Lo scaffolding?»</div></li>
              <li><div class="corso-cmp2__item-text">«Qual è il protocollo indicato per questo caso?»</div></li>
              <li><div class="corso-cmp2__item-text">«Cosa funziona di solito con bambini come questo?»</div></li>
            </ul>
            <p class="corso-cmp2__foot-note">Il punto di partenza è la tecnica. La CE serve, se serve, per giustificare la scelta già fatta.</p>
          </section>

          <section class="corso-cmp2__col corso-cmp2__col--right">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab" style="color: var(--corso-f3);">La domanda per funzione</span>
              <h3 class="corso-cmp2__title">«Quale funzione deve svolgere il dispositivo?»</h3>
            </header>
            <ul class="corso-cmp2__items">
              <li><div class="corso-cmp2__item-text">«Questo campo deve essere stabilizzato, ampliato, mediato o protetto?»</div></li>
              <li><div class="corso-cmp2__item-text">«Cosa deve fare il dispositivo sul campo — non come si chiama?»</div></li>
              <li><div class="corso-cmp2__item-text">«La funzione nasce dal nodo dominante e dalla CE — poi si sceglie il dispositivo.»</div></li>
            </ul>
            <p class="corso-cmp2__foot-note" style="color: var(--corso-f3);">La CE orienta la funzione. La funzione orienta il dispositivo. La tecnica viene ultima — se viene.</p>
          </section>
        </div>

        <div class="corso-cmp2__footer">
          <span class="corso-cmp2__footer-lab">Principio del Modulo 4</span>
          <p>«Lo strumento nasce scegliendo la funzione, non la tecnica.»</p>
          <p style="font-weight: 400; font-size: 0.92rem; margin-top: 6px;">La stessa funzione (es. Mediare) può essere svolta da dispositivi molto diversi: lettura dialogica, gioco imitativo, routine di nomina condivisa. Ciò che li accomuna non è la forma ma la funzione che svolgono sul campo.</p>
        </div>

        <div class="corso-m4-flow">
          <span class="corso-m4-flow__step">CE + nodo dominante</span>
          <span class="corso-m4-flow__arrow">→</span>
          <span class="corso-m4-flow__step corso-m4-flow__step--accent">FUNZIONE</span>
          <span class="corso-m4-flow__arrow">→</span>
          <span class="corso-m4-flow__step">Dispositivo</span>
          <span class="corso-m4-flow__arrow">→</span>
          <span class="corso-m4-flow__step corso-m4-flow__step--muted">Tecnica (se utile)</span>
          <span class="corso-m4-flow__here">↑ qui si decide</span>
        </div>
      `,
      notes:
        'In questo modulo impariamo le quattro funzioni. Il Modulo 5 costruisce il dispositivo a partire da esse.',
    },

    // ─── 4.2 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m04-02',
      type: 'interactive',
      title: 'Quattro funzioni, una logica',
      subtitle: 'Cosa può fare un dispositivo F3 sul campo',
      intro: indiceFunzioniHtml,
      interactive: {
        kind: 'expandable-cards',
        layout: 'vertical',
        multiOpen: false,
        defaultOpen: ['mediare'],
        cards: QUATTRO_FUNZIONI.map((f) => ({
          id: f.id,
          color: f.colore,
          badge: f.badge,
          title: f.nome,
          summary: f.azione_sul_campo,
          detail: `
            <div class="corso-m4-fncard">
              <div class="corso-m4-fncard__quando" style="border-left-color: ${f.colore};">
                <span class="corso-m4-fncard__lab">Quando si usa</span>
                <p>${f.quando}</p>
              </div>

              <div class="corso-m4-fncard__signals">
                <span class="corso-m4-fncard__lab">Segnali nella CE</span>
                <div class="corso-m4-fncard__chips">
                  ${f.segnali_CE.map((s) => `<span class="corso-m4-fncard__chip">${s}</span>`).join('')}
                </div>
              </div>

              <div class="corso-m4-fncard__actions">
                <span class="corso-m4-fncard__lab">Micro-azioni tipiche</span>
                <ol>
                  ${f.micro_azioni.map((a) => `<li>${a}</li>`).join('')}
                </ol>
              </div>

              <div class="corso-m4-fncard__example">
                <span class="corso-m4-fncard__lab">Esempio</span>
                <p><em>${f.esempio}</em></p>
              </div>

              <div class="corso-m4-fncard__warn">
                <div>
                  <span class="corso-m4-fncard__warn-lab">Errore tipico</span>
                  <p>${f.errore}</p>
                </div>
                <div>
                  <span class="corso-m4-fncard__warn-lab">Non confondere con</span>
                  <p>${f.non_confondere}</p>
                </div>
              </div>

              <div class="corso-m4-fncard__nodi">
                <span class="corso-m4-fncard__lab">Nodi tipici</span>
                ${f.nodi_tipici.map((n) => `<code>${n}</code>`).join(' · ')}
              </div>
            </div>
          `,
        })),
      },
      notes:
        'Le quattro funzioni non sono esaustive di tutto ciò che un professionista può fare — sono le quattro forme legittime di azione nel perimetro metodologico di F3.',
    },

    // ─── 4.3 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m04-03',
      type: 'standard',
      title: 'Come la CE orienta la scelta',
      subtitle: 'Quattro segnali, quattro funzioni',
      content: `
        <div class="corso-m4-rule-intro">
          <p>La funzione non si sceglie dall'esterno della CE: <strong>emerge da ciò che la CE contiene</strong>. Quattro configurazioni di segnali corrispondono alle quattro funzioni.</p>
          <p class="corso-emph corso-emph--center" style="font-style: italic;">Non è una regola meccanica: è un orientamento. La lettura configurazionale richiede sempre giudizio professionale.</p>
        </div>

        <table class="corso-m4-signals-table">
          <thead>
            <tr>
              <th>Segnali nella CE</th>
              <th>Funzione</th>
              <th>Motivazione</th>
            </tr>
          </thead>
          <tbody>
            ${SEGNALI_CE_FUNZIONE.map(
              (s) => `
                <tr style="--corso-fn-color: ${s.colore};">
                  <td><code class="corso-m4-signals-table__sig">${s.segnale}</code></td>
                  <td>
                    <span class="corso-m4-signals-table__badge">${s.funzione}</span>
                    <span class="corso-m4-signals-table__nome">${s.funzioneNome}</span>
                  </td>
                  <td class="corso-m4-signals-table__mot">${s.motivazione}</td>
                </tr>
              `,
            ).join('')}
          </tbody>
        </table>

        <div class="corso-m3-rule" style="margin-top: 18px;">
          <div class="corso-m3-rule__head">Se ci sono più segnali presenti contemporaneamente</div>
          <p style="margin: 4px 0 10px;">Ordine di priorità:</p>
          <ol class="corso-m4-priority">
            <li><strong style="color: var(--corso-fn-stabilizzare);">Stabilizzare</strong> — sempre prima, se T0–T1 o A−. Nessun altro lavoro prima.</li>
            <li><strong style="color: var(--corso-fn-proteggere);">Proteggere</strong> — subito dopo, se il campo è a rischio imminente.</li>
            <li><strong style="color: var(--corso-fn-mediare);">Mediare</strong> — se il campo regge e R indica una transizione in corso.</li>
            <li><strong style="color: var(--corso-fn-ampliare);">Ampliare</strong> — se il campo regge, R non indica transizioni e D→.</li>
          </ol>
          <p style="font-style: italic; margin-top: 10px; font-size: 0.92rem; color: var(--corso-text-muted);">La priorità non è una gerarchia di valore: è una sequenza logica. Stabilizzare prima di ampliare non significa che stabilizzare sia «più importante» — significa che un campo instabile non può ampliare.</p>
        </div>
      `,
      guardrail: {
        code: 'C-F3-40',
        label: 'Non invertire la sequenza',
        text:
          'Un dispositivo che amplia su un campo T0 produce disorganizzazione. Un dispositivo che stabilizza un campo T3 produce stagnazione. La funzione e la tenuta devono essere coerenti.',
      },
    },

    // ─── 4.4 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m04-04',
      type: 'standard',
      title: 'Quando la funzione è sbagliata',
      subtitle: 'Quattro errori e cosa producono nel campo',
      content: `
        <p class="corso-narrative__caption" style="text-align: center; margin-bottom: 14px; font-style: italic;">
          Quattro errori ricorrenti nella scelta della funzione:
        </p>

        <div class="corso-m4-err-stack">
          ${ERRORI_FUNZIONE.map(
            (e) => `
              <article class="corso-m4-err-card">
                <header class="corso-m4-err-card__head">
                  <span class="corso-m4-err-card__num">${e.numero}</span>
                  <h3 class="corso-m4-err-card__title">${e.errore}</h3>
                </header>
                <div class="corso-m4-err-card__body">
                  <div class="corso-m4-err-card__row">
                    <span class="corso-m4-err-card__lab">Situazione</span>
                    <p>${e.situazione}</p>
                  </div>
                  <div class="corso-m4-err-card__row corso-m4-err-card__row--effect">
                    <span class="corso-m4-err-card__lab">Cosa succede</span>
                    <p>${e.cosa_succede}</p>
                  </div>
                  <div class="corso-m4-err-card__row corso-m4-err-card__row--ok">
                    <span class="corso-m4-err-card__lab">Funzione corretta</span>
                    <div>
                      <span class="corso-m4-err-card__chip" style="--corso-fn-color: ${e.funzione_corretta.colore};">
                        ${e.funzione_corretta.badge} · ${e.funzione_corretta.nome}
                      </span>
                      <p>${e.funzione_corretta_text}</p>
                    </div>
                  </div>
                </div>
              </article>
            `,
          ).join('')}
        </div>

        <p class="corso-narrative__caption" style="text-align: center; margin-top: 18px; max-width: 760px; margin-left: auto; margin-right: auto; line-height: 1.6;">
          Questi errori hanno quasi sempre la stessa radice: la funzione viene scelta prima di aver letto la CE, oppure la CE viene letta ma non il segnale rilevante (T, R, D). L'antidoto è la sequenza decisionale — che vediamo nella slide successiva.
        </p>
      `,
    },

    // ─── 4.5 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m04-05',
      type: 'diagram',
      title: 'Tre domande, in ordine',
      subtitle: 'Dalla CE alla funzione: una sequenza, non un algoritmo',
      content: `
        <div class="corso-m4-tree">
          ${SEQUENZA_DECISIONALE.map(
            (step, i) => `
              <div class="corso-m4-tree__node">
                <div class="corso-m4-tree__head">
                  <span class="corso-m4-tree__num">${step.passo}</span>
                  <div>
                    <h3 class="corso-m4-tree__title">${step.titolo}</h3>
                    <p class="corso-m4-tree__q"><em>«${step.domanda}»</em></p>
                  </div>
                </div>
                <div class="corso-m4-tree__branches">
                  ${step.rami
                    .map(
                      (r) => `
                        <div class="corso-m4-tree__branch corso-m4-tree__branch--${r.tipo}" style="--corso-branch-color: ${r.colore};">
                          <span class="corso-m4-tree__cond">${r.condizione}</span>
                          <span class="corso-m4-tree__arrow" aria-hidden="true">→</span>
                          <span class="corso-m4-tree__esito">
                            <span class="corso-m4-tree__badge">${r.badge}</span>
                            ${r.esito}
                          </span>
                        </div>
                      `,
                    )
                    .join('')}
                </div>
              </div>
              ${
                i < SEQUENZA_DECISIONALE.length - 1
                  ? '<div class="corso-m4-tree__connector" aria-hidden="true">▼</div>'
                  : ''
              }
            `,
          ).join('')}
        </div>

        <div class="corso-m3-rule" style="margin-top: 22px;">
          <div class="corso-m3-rule__head">Sequenza, non algoritmo</div>
          <p>Questa sequenza è un orientamento, non un algoritmo. Non sostituisce il giudizio professionale situato: lo struttura. Una CE può avere segnali misti o ambigui — in quei casi la sequenza aiuta a identificare quale segnale è più rilevante nel contesto specifico.</p>
          <p>Se la sequenza non porta a una risposta chiara, il passo successivo è rivalutare la CE — non forzare una funzione.</p>
        </div>
      `,
      notes:
        'Nel caso-guida, la sequenza porta direttamente a MEDIAZIONE: T2 (campo fragile ma aperto) → passo ②: R: N2→N3 e D↗ → Mediare.',
    },

    // ─── 4.6 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m04-06',
      type: 'narrative',
      title: 'La scelta nel caso-guida',
      subtitle: 'Applicare la sequenza decisionale al bilancio pediatrico',
      content: `
        <div class="corso-two-col corso-two-col--45-55 corso-m4-caso">
          <div class="corso-m4-caso__left">
            <div class="corso-m3-cebox">
              <div class="corso-m3-cebox__lab">CE del caso-guida</div>
              ${ceTableHtml(['N2', 'N3', 'N4'])}
            </div>

            <div class="corso-m4-caso__seq">
              <div class="corso-m4-caso__seq-lab">Sequenza decisionale applicata</div>
              <div class="corso-m4-caso__step">
                <span class="corso-m4-caso__step-num">①</span>
                <p>T2 e A±: il campo regge. Non è T0–T1. Niente <em>Stabilizzare</em> come priorità immediata.</p>
              </div>
              <div class="corso-m4-caso__step corso-m4-caso__step--match">
                <span class="corso-m4-caso__step-num">②</span>
                <p>R: N2→N3 · D↗: la transizione è già in corso. <strong>→ MEDIARE</strong>.</p>
              </div>
              <div class="corso-m4-caso__step corso-m4-caso__step--skip">
                <span class="corso-m4-caso__step-num">③</span>
                <p>Non necessario: la risposta è arrivata al passo ②.</p>
              </div>
            </div>

            <div class="corso-m4-caso__result">
              <span class="corso-m4-caso__result-lab">Funzione scelta</span>
              <span class="corso-m4-caso__result-badge">MED · Mediare</span>
            </div>
          </div>

          <div class="corso-m4-caso__right">
            <h3 class="corso-m4-caso__heading" style="color: var(--corso-fn-mediare);">MEDIAZIONE</h3>

            <div class="corso-m4-caso__section corso-m4-caso__section--main">
              <span class="corso-m4-caso__section-lab">Cosa fa sul campo</span>
              <p>Coordina N2 (↑, risorsa attiva) e N3 (~, zona di movimento). Sostiene la transizione già avviata dalla relazione R: N2→N3. <strong>Non crea il movimento: lo accompagna.</strong></p>
            </div>

            <div class="corso-m4-caso__section corso-m4-caso__section--why-not">
              <span class="corso-m4-caso__section-lab">Perché non Ampliare</span>
              <p>N4↓ sconsiglia di aggiungere novità al campo. Ampliare su un campo con N4↓ aumenta il carico esplorativo in un nodo già in tensione.</p>
            </div>

            <div class="corso-m4-caso__section corso-m4-caso__section--why-not">
              <span class="corso-m4-caso__section-lab">Perché non Stabilizzare</span>
              <p>T2 e A± indicano che il campo regge. Stabilizzare un campo che non è in crisi produce stagnazione: si ridurrebbe la complessità di un campo che ha invece lo spazio per muoversi.</p>
            </div>

            <div class="corso-m3-rule" style="margin-top: 14px;">
              <div class="corso-m3-rule__head">Cosa dice e cosa non dice ancora</div>
              <p>MEDIAZIONE è la funzione. Dice <strong>cosa deve fare il dispositivo</strong>: sostenere la transizione N2→N3 rallentando il ritmo adulto e lasciando spazio alla sequenza del bambino.</p>
              <p>Non dice ancora <em>come</em>. Non nomina tecniche. Non prescrive sequenze precise.</p>
              <p style="font-style: italic;">Il dispositivo — le micro-azioni concrete — si costruisce nel <strong>Modulo 5</strong>.</p>
            </div>
          </div>
        </div>
      `,
      notes:
        'La funzione MEDIAZIONE è coerente con il tipo universale U2+U4 (Sintonizzazione + Mediazione Simbolica). Il collegamento tra funzione e tipo universale verrà esplorato nel Modulo 6.',
    },

    // ─── 4.7 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m04-07',
      type: 'standard',
      title: 'La funzione non è il dispositivo',
      subtitle: 'Cosa rimane da fare dopo aver scelto la funzione',
      content: `
        <div class="corso-two-col" style="margin-top: 8px;">
          <div class="corso-m4-distinct">
            <div class="corso-m4-distinct__lab">La funzione</div>
            <ul>
              <li>Definisce <strong>cosa</strong> il dispositivo deve fare al campo</li>
              <li>È una categoria: Stabilizzare / Ampliare / Mediare / Proteggere</li>
              <li>Nasce dalla CE e dal nodo dominante</li>
              <li>È la stessa indipendentemente da chi la esegue e in quale contesto</li>
            </ul>
          </div>
          <div class="corso-m4-distinct corso-m4-distinct--device">
            <div class="corso-m4-distinct__lab">Il dispositivo</div>
            <ul>
              <li>Definisce <strong>come</strong> la funzione si realizza in questo campo specifico</li>
              <li>È contestuale: cambia con il professionista, il bambino, il setting, il tempo</li>
              <li>Nasce dalla funzione — non dalla tecnica</li>
              <li>Ha le tre proprietà: breve, reversibile, osservabile</li>
            </ul>
          </div>
        </div>

        <p class="corso-emph corso-emph--center" style="margin: 18px 0 8px; font-style: italic;">
          ↓
        </p>
        <p class="corso-emph corso-emph--center" style="font-style: italic;">
          La stessa funzione (MEDIARE) può diventare dispositivi molto diversi:
        </p>

        <div class="corso-m4-devices">
          <div class="corso-m4-devices__chip">
            <strong>Dialogic Book Sharing</strong>
            <span>il genitore segue, nomina, aspetta</span>
          </div>
          <div class="corso-m4-devices__chip">
            <strong>Gioco imitativo</strong>
            <span>l'educatrice replica il gesto del bambino senza dirigere</span>
          </div>
          <div class="corso-m4-devices__chip">
            <strong>Routine di nomina condivisa</strong>
            <span>il pediatra rallenta e lascia spazio al bambino</span>
          </div>
        </div>
        <p class="corso-narrative__caption" style="text-align: center; margin-top: 8px; font-style: italic;">
          Stessa funzione. Tre contesti. Tre dispositivi. Stessa grammatica.
        </p>

        <blockquote class="corso-blockquote" style="border-left-color: var(--corso-f3); margin: 26px auto; max-width: 720px;">
          «Strumenti diversi possono nascere dalla stessa funzione. La stessa funzione può servire configurazioni diverse. Lo strumento non è una soluzione: è un regolatore di campo.»
        </blockquote>

        <p class="corso-emph corso-emph--center" style="font-style: italic; margin-top: 22px; font-size: 1.08rem;">
          Nel prossimo modulo costruiamo il dispositivo: il Template F3, le micro-azioni, l'output-tipo, la verifica di coerenza.
        </p>
        <div class="corso-m3-next">
          <span class="corso-m3-next__arrow">→</span>
          <span class="corso-m3-next__lab">Modulo 5 — Il micro-dispositivo</span>
        </div>
      `,
    },
  ],
};
