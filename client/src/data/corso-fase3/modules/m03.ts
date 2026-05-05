import { Module } from '../types';
import { CASO_GUIDA_F3 } from '../caso-guida';

// ─── Dati globali del modulo ─────────────────────────────────────────────

const TRE_CATEGORIE_NODI = [
  {
    id: 'sostenuto',
    stato: '↑',
    statoClass: 'up',
    statoColor: 'var(--corso-valid)',
    nome: 'Nodo sostenuto',
    ruolo_f2: 'Il campo regge bene su questa dimensione.',
    ruolo_f3:
      "Risorsa disponibile. Non è il punto di lavoro: è il terreno su cui si costruisce il dispositivo. Lavorare su un nodo sostenuto è spreco di energia e può destabilizzare ciò che già funziona.",
    domanda: 'Come posso usare questa risorsa per sostenere il nodo dominante?',
    esempio_caso:
      "N2↑ nel caso-guida: il campo relazionale è solido. Non si lavora su N2 — si usa N2 come leva per aprire N3.",
  },
  {
    id: 'neutro',
    stato: '~',
    statoClass: 'neu',
    statoColor: 'var(--corso-warning)',
    nome: 'Nodo neutro',
    ruolo_f2: 'Il campo non è né rinforzato né limitato su questa dimensione.',
    ruolo_f3:
      'Zona di possibile movimento. È il candidato principale per il nodo dominante: ha lo spazio per muoversi e non è già in tensione. Con un intervento lieve, può passare da ~ a una configurazione più aperta.',
    domanda: 'Questo nodo neutro può muoversi? Ci sono risorse che lo sostengono?',
    esempio_caso:
      "N3~ nel caso-guida: l'accesso al mondo condiviso è presente ma discontinuo. C'è spazio di movimento — e N2↑ come risorsa.",
  },
  {
    id: 'limitante',
    stato: '↓',
    statoClass: 'down',
    statoColor: 'var(--corso-invalid)',
    nome: 'Nodo limitante',
    ruolo_f2: 'Il campo è in tensione su questa dimensione.',
    ruolo_f3:
      'Tensione da rispettare. Non è automaticamente il punto di lavoro. Va considerata per non esacerbarla: il dispositivo non deve aumentare il carico su un nodo già in difficoltà. In certi casi può essere il nodo dominante — ma solo se soddisfa anche gli altri criteri.',
    domanda: 'Il dispositivo che costruisco aggrava questa tensione?',
    esempio_caso:
      "N4↓ nel caso-guida: l'esplorazione è ridotta. Non è il punto di lavoro: è un vincolo. Il dispositivo non deve aumentare il carico percettivo del campo.",
  },
];

const CRITERI_NODO_DOMINANTE = [
  {
    id: 'c1',
    numero: '①',
    colore: 'var(--corso-n2)',
    criterio: 'Il campo si sta già muovendo verso di lui',
    spiegazione:
      "La relazione dominante (R) nella CE indica il verso dell'energia del campo: quale nodo sostiene quale altro. Se R punta verso un nodo ~, quel nodo è il candidato privilegiato: il campo ha già iniziato la transizione.",
    segnale: 'R: Nodo↑ → questo nodo',
    caso_guida:
      'R: N2→N3. Il campo si sta già muovendo verso N3. La risorsa (N2↑) sta "spingendo" nella direzione giusta. Il dispositivo non deve creare il movimento: deve sostenerlo.',
  },
  {
    id: 'c2',
    numero: '②',
    colore: 'var(--corso-n3)',
    criterio: 'Una risorsa attiva può sostenerlo',
    spiegazione:
      "Il nodo dominante funziona come punto di lavoro solo se c'è almeno un nodo ↑ disponibile che può sostenerne l'attivazione. Un nodo ~ senza risorse di sostegno richiede un intervento più pesante — fuori dal perimetro del micro-dispositivo.",
    segnale: 'Esiste almeno un nodo ↑ collegato tramite R',
    caso_guida:
      "N2↑ è la risorsa che sostiene N3~. Il campo relazionale attivo è la condizione che rende possibile l'accesso al mondo condiviso. Senza N2↑, N3 non avrebbe terreno su cui muoversi.",
  },
  {
    id: 'c3',
    numero: '③',
    colore: 'var(--corso-f3)',
    criterio: 'La sua attivazione è coerente con la direzione D',
    spiegazione:
      'La direzione evolutiva (D) indica dove il campo si sta muovendo. Il nodo dominante deve essere coerente con quella direzione: la sua attivazione deve accompagnare o accelerare il movimento, non contradirlo.',
    segnale: 'D punta nella direzione in cui questo nodo può aprirsi',
    caso_guida:
      'D↗ (espansione in corso). N3 in espansione è coerente con D↗. Lavorare su N4↓ (che è in contrazione) contrasterebbe la direzione evolutiva: si spingerebbe in senso opposto a dove il campo si sta muovendo.',
  },
  {
    id: 'c4',
    numero: '④',
    colore: 'var(--corso-n5)',
    criterio: 'La sua attivazione non esacerba i nodi in tensione',
    spiegazione:
      "Il dispositivo che attiva il nodo dominante non deve aumentare il carico su nodi già limitanti (↓). Se l'attivazione del candidato produce sovraccarico su un nodo ↓, quel candidato va riconsiderato. Principio: non aggiungere tensione dove c'è già tensione.",
    segnale: 'Nessun nodo ↓ risulta ulteriormente compromesso',
    caso_guida:
      "Attivare N3 (aumentando la stabilità dello scambio condiviso) non esacerba N4↓. Uno scambio più stabile e guidato riduce il carico percettivo dell'ambiente — e questo favorisce marginalmente, non ostacola, l'esplorazione.",
  },
];

const ERRORI_IDENTIFICAZIONE = [
  {
    id: 'e1',
    numero: '1',
    titolo: 'Il nodo dominante è il nodo ↓ più basso',
    esempio_errato:
      '«N4↓ è il nodo con lo stato più basso. Quindi lavoro su N4.»',
    problema:
      "Il nodo ↓ indica una tensione nel campo — non il luogo in cui il campo può muoversi con un intervento leggero. N4↓ dice: l'esplorazione è sotto pressione. Non dice: è qui che devi intervenire.",
    conseguenza:
      'Un dispositivo centrato su N4 (es. introdurre nuovi stimoli esplorativi) aumenterebbe il carico su un campo già fragile (T2). Risultato probabile: disorganizzazione, non apertura.',
    corretto:
      'N3~ con R: N2→N3 soddisfa tutti e quattro i criteri. N4↓ è un vincolo da rispettare — non il punto di lavoro.',
  },
  {
    id: 'e2',
    numero: '2',
    titolo: 'Il nodo dominante si sceglie dal sintomo',
    esempio_errato:
      '«Il bambino non parla ancora abbastanza. Lavoro su N3 perché c\'è un problema linguistico.»',
    problema:
      'Il nodo dominante non si sceglie dal sintomo osservato: emerge dalla lettura della CE. Il risultato può coincidere — ma il percorso è diverso, e la coincidenza non è garantita. Partire dal sintomo bypassa la lettura configurazionale.',
    conseguenza:
      "Se il ritardo linguistico fosse prodotto da N1↓ (regolazione fragile che impedisce l'accesso allo scambio) anziché da N3~, un dispositivo centrato su N3 sarebbe fuori bersaglio: lavora sull'effetto, non sulla causa.",
    corretto:
      'La CE prima. Sempre. Il nodo dominante emerge dalla struttura configurazionale — non dall\'osservazione del sintomo.',
  },
  {
    id: 'e3',
    numero: '3',
    titolo: 'Si lavora su più nodi contemporaneamente',
    esempio_errato:
      '«Ho tre nodi da migliorare: N3, N4 e N1. Creo un dispositivo che li lavora tutti.»',
    problema:
      'Un micro-dispositivo che cerca di attivare più nodi contemporaneamente perde precisione, diventa incoerente e smette di soddisfare le tre proprietà: non è più breve, non è più reversibile, non produce un indicatore di risonanza osservabile e distinto.',
    conseguenza:
      "Multi-nodo → programma d'intervento. Non è un micro-dispositivo di campo: è un piano terapeutico. Fuori dal perimetro metodologico di F3.",
    corretto:
      "Un nodo dominante. Una funzione. Un dispositivo. Una rivalutazione. Se serve un secondo ciclo, si rivaluta la CE e si sceglie il prossimo.",
  },
];

const ANALISI_PASSI = [
  {
    chip: '①',
    criterio: 'Il campo si sta muovendo verso quale nodo?',
    risposta:
      "R: N2→N3. L'energia del campo si muove già verso N3. Non verso N4, non verso N1. Verso N3.",
    esito: 'N3 candidato: ✓',
    esitoTipo: 'ok' as const,
  },
  {
    chip: '②',
    criterio: "C'è una risorsa che può sostenerlo?",
    risposta:
      "N2↑ è la risorsa di sostegno. È N2 che R indica come nodo sostenente per N3. Il campo relazionale attivo è la condizione per l'accesso al simbolico.",
    esito: 'N3 candidato: ✓',
    esitoTipo: 'ok' as const,
  },
  {
    chip: '③',
    criterio: 'La sua attivazione è coerente con D?',
    risposta:
      "D↗: il campo è in espansione. Attivare N3 (accesso al mondo condiviso) è espansione. Lavorare su N4↓ (che è in contrazione) contraddirebbe D↗.",
    esito: 'N3 candidato: ✓ — N4 escluso',
    esitoTipo: 'ok' as const,
  },
  {
    chip: '④',
    criterio: 'La sua attivazione esacerba N4↓?',
    risposta:
      'Un dispositivo che aumenta la stabilità dello scambio condiviso non aumenta il carico esplorativo del campo. Anzi: uno scambio guidato e contenuto riduce la dispersione.',
    esito: 'N3 candidato: ✓',
    esitoTipo: 'ok' as const,
  },
  {
    chip: '✓',
    criterio: 'Conclusione',
    risposta:
      'N3 soddisfa tutti e quattro i criteri. N4↓ non soddisfa ③ (contraddice D↗) né ④ (rischio di esacerbazione). N3 è il nodo dominante.',
    esito: 'N3 — Nodo dominante confermato',
    esitoTipo: 'final' as const,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────

const stateClass = (s: string) => {
  if (s === '↑') return 'corso-ce-table__state--up';
  if (s === '↓') return 'corso-ce-table__state--down';
  return 'corso-ce-table__state--neu';
};

/**
 * Tabella CE con highlights opzionali. Le righe non evidenziate sono
 * deemphasize (opacity ridotta), quelle evidenziate hanno bordo sinistro
 * solido nel colore del nodo.
 */
const ceTableHtml = (highlights: string[] = []) => {
  const ce = CASO_GUIDA_F3.ce;
  const labels = CASO_GUIDA_F3.letturaNodi;
  const set = new Set(highlights);
  const rows = (Object.keys(ce.nodi) as Array<keyof typeof ce.nodi>)
    .map((codice) => {
      const n = ce.nodi[codice];
      const isHl = set.has(codice as string);
      const lettura = labels[codice as string] ?? '';
      const rowCls = isHl
        ? 'corso-ce-row--highlight'
        : 'corso-ce-row--dim';
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

// ─── Modulo ──────────────────────────────────────────────────────────────

export const Module03: Module = {
  id: 'm03',
  number: 3,
  title: 'Il nodo dominante',
  shortTitle: 'Nodo dominante',
  accent: '#e67e22',
  slides: [
    // ─── 3.1 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m03-01',
      type: 'standard',
      title: 'Il nodo su cui intervenire non è il nodo più critico',
      subtitle: 'Una distinzione anti-intuitiva',
      content: `
        <div class="corso-two-col corso-two-col--45-55">
          <div class="corso-pane">
            <div class="corso-pane__eyebrow">Il ragionamento naturale</div>
            <p>Il professionista guarda la CE. Vede uno stato così:</p>
            <pre class="corso-ce-mini">N1 ~   N2 ↑   N3 ~
N4 ↓   N5 ~   N6 ~   N7 ~</pre>
            <p>La conclusione spontanea:</p>
            <blockquote class="corso-blockquote">
              «N4 è il nodo più basso. Il problema è lì. Intervengo su N4.»
            </blockquote>
            <p>Questo ragionamento è intuitivo, lineare, familiare. È il ragionamento della diagnostica: si individua il deficit, si interviene sul deficit.</p>
          </div>
          <div class="corso-pane corso-pane--accent">
            <div class="corso-pane__eyebrow">Il ragionamento F3</div>
            <p>Il nodo dominante <strong>non è necessariamente</strong> il nodo con lo stato più basso.</p>
            <p>È il nodo la cui <strong>attivazione produce il cambiamento più rilevante</strong> per l'abitabilità del campo nella direzione evolutiva indicata (D).</p>
            <p>In questa CE, il nodo dominante è <strong>N3</strong> — non N4.</p>
            <p>Perché? Quattro criteri lo determinano:</p>
            <ul class="corso-arrow-list">
              <li>Il campo si sta già muovendo verso N3 (R: N2→N3)</li>
              <li>C'è una risorsa attiva che può sostenerlo (N2↑)</li>
              <li>La sua attivazione è coerente con D↗</li>
              <li>Non esacerba N4↓</li>
            </ul>
            <p>N4↓ è una <em>tensione da rispettare</em>, non il punto di lavoro.</p>
          </div>
        </div>

        <div class="corso-axis-arrow" aria-hidden="true">
          <span class="corso-axis-arrow__side corso-axis-arrow__side--left">Nodo più basso</span>
          <span class="corso-axis-arrow__sep">≠</span>
          <span class="corso-axis-arrow__side corso-axis-arrow__side--right">Nodo dominante</span>
        </div>
        <p class="corso-narrative__caption" style="text-align: center; font-style: italic;">Questa distinzione è il cuore del Modulo 3.</p>
      `,
      notes:
        "Confondere il nodo più basso con il nodo dominante è l'errore più frequente nell'applicazione di F3. Questo modulo costruisce i criteri per evitarlo.",
    },

    // ─── 3.2 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m03-02',
      type: 'interactive',
      title: 'Cosa legge F3 nella CE',
      subtitle: 'Tre ruoli, non tre stati',
      intro: `
        <div class="corso-m3-cebox">
          <div class="corso-m3-cebox__lab">CE del caso-guida</div>
          ${ceTableHtml(['N2', 'N3', 'N4'])}
          <p class="corso-narrative__caption" style="text-align: center; margin-top: 8px;">La stessa CE. Ma F3 non vede stati: vede ruoli.</p>
        </div>
        <p class="corso-emph corso-emph--center" style="font-style: italic; margin-top: 14px;">Stessa notazione (↑ ↓ ~). Lettura diversa.</p>
      `,
      interactive: {
        kind: 'expandable-cards',
        layout: 'vertical',
        multiOpen: true,
        defaultOpen: ['neutro'],
        cards: TRE_CATEGORIE_NODI.map((c) => ({
          id: c.id,
          color: c.statoColor,
          badge: c.stato,
          title: c.nome,
          summary: c.domanda,
          detail: `
            <p style="margin: 0 0 10px;">${c.ruolo_f3}</p>
            <div class="corso-m3-roleblock">
              <span class="corso-m3-roleblock__lab">In F2:</span>
              <span class="corso-m3-roleblock__txt">${c.ruolo_f2}</span>
            </div>
            <div class="corso-m3-caseblock">
              <span class="corso-m3-caseblock__lab">Nel caso-guida:</span>
              <p>${c.esempio_caso}</p>
            </div>
          `,
        })),
      },
      guardrail: {
        code: 'C-F3-30',
        label: 'Inversione del ruolo',
        text:
          "Un nodo ↓ letto come «punto di lavoro» anziché come «tensione da rispettare» è l'inversione più comune. Un nodo ↑ lavorato come se fosse fragile spreca la risorsa disponibile.",
      },
    },

    // ─── 3.3 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m03-03',
      type: 'standard',
      title: 'Come si identifica il nodo dominante',
      subtitle: 'Quattro criteri da soddisfare tutti',
      content: `
        <div class="corso-criterion-list">
          ${CRITERI_NODO_DOMINANTE.map(
            (c, i) => `
              <div class="corso-criterion-block ${
                i === CRITERI_NODO_DOMINANTE.length - 1
                  ? 'corso-criterion-block--last'
                  : ''
              }">
                <div class="corso-criterion-block__head">
                  <span class="corso-criterion-block__num" style="color: ${c.colore};">${c.numero}</span>
                  <h3 class="corso-criterion-block__title">${c.criterio}</h3>
                </div>
                <p class="corso-criterion-block__desc">${c.spiegazione}</p>
                <div class="corso-criterion-block__chip">
                  <span class="corso-criterion-block__chip-lab">Segnale</span>
                  <code>${c.segnale}</code>
                </div>
                <div class="corso-criterion-block__case">
                  <span class="corso-criterion-block__case-lab">Nel caso-guida</span>
                  <p>${c.caso_guida}</p>
                </div>
              </div>
              ${
                i === 2
                  ? `<p class="corso-narrative__caption" style="text-align: center; font-style: italic; margin: 8px 0 12px;">I criteri non sono una checklist da compilare in ordine: sono condizioni simultanee. Un nodo che soddisfa ① e ② ma viola ③ o ④ non è il nodo dominante.</p>`
                  : ''
              }
            `,
          ).join('')}
        </div>

        <div class="corso-m3-rule">
          <div class="corso-m3-rule__head">Il nodo dominante è:</div>
          <p>Il nodo ~ verso cui il campo si sta già muovendo (R), sostenuto da una risorsa disponibile (↑), coerente con la direzione evolutiva (D), la cui attivazione non esacerba le tensioni esistenti (↓).</p>
          <div class="corso-m3-rule__head corso-m3-rule__head--neg">Non è:</div>
          <ul>
            <li>Il nodo con lo stato più basso</li>
            <li>Il nodo scelto dal sintomo osservato</li>
            <li>Il nodo che il professionista vuole migliorare</li>
          </ul>
        </div>
      `,
      notes:
        "Nella maggior parte delle CE ben formate, il nodo dominante è un nodo ~. Se tutti i nodi ~ soddisfano i criteri, scegliere quello indicato da R. Se nessun nodo ~ li soddisfa, è possibile che la CE necessiti di rivalutazione.",
    },

    // ─── 3.4 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m03-04',
      type: 'interactive',
      title: 'Gli errori più frequenti',
      subtitle: "Cosa succede quando l'identificazione va storta",
      interactive: {
        kind: 'expandable-cards',
        layout: 'vertical',
        multiOpen: false,
        cards: ERRORI_IDENTIFICAZIONE.map((e) => ({
          id: e.id,
          color: 'var(--corso-invalid)',
          badge: e.numero,
          title: e.titolo,
          summary: e.esempio_errato,
          detail: `
            <div class="corso-m3-err-section corso-m3-err-section--prob">
              <span class="corso-m3-err-section__lab">Problema</span>
              <p>${e.problema}</p>
            </div>
            <div class="corso-m3-err-section corso-m3-err-section--cons">
              <span class="corso-m3-err-section__lab">Conseguenza</span>
              <p>${e.conseguenza}</p>
            </div>
            <div class="corso-m3-err-section corso-m3-err-section--ok">
              <span class="corso-m3-err-section__lab">✓ Lettura corretta</span>
              <p>${e.corretto}</p>
            </div>
          `,
        })),
      },
      content: `
        <p class="corso-narrative__caption" style="text-align: center; font-style: italic; margin: 14px 0;">
          Questi errori non indicano incompetenza professionale: riflettono abitudini di pensiero consolidate (deficit-based, multitasking, pattern-matching rapido) che il metodo chiede di sospendere temporaneamente per costruire la lettura configurazionale.
        </p>
      `,
      guardrail: {
        code: 'C-F3-31',
        label: 'Il ciclo che si chiude',
        text:
          'Se il dispositivo F3 costruito non produce l\'indicatore di risonanza atteso, la prima domanda non è «il dispositivo era sbagliato?» ma «il nodo dominante era corretto?». L\'errore di identificazione si manifesta sempre come assenza di risonanza.',
      },
    },

    // ─── 3.5 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m03-05',
      type: 'interactive',
      title: 'Applicare i quattro criteri',
      subtitle: 'La scelta del nodo dominante nel caso-guida — passo per passo',
      intro: `
        <div class="corso-two-col corso-two-col--40-60 corso-m3-analysis">
          <div class="corso-m3-cebox">
            <div class="corso-m3-cebox__lab">CE del caso-guida</div>
            ${ceTableHtml(['N2', 'N3', 'N4'])}
            <div class="corso-m3-roles">
              <span class="corso-m3-role" style="--corso-role-color: var(--corso-n2);">
                <strong>N2↑</strong> Risorsa
              </span>
              <span class="corso-m3-role" style="--corso-role-color: var(--corso-n3);">
                <strong>N3~</strong> Candidato dominante
              </span>
              <span class="corso-m3-role" style="--corso-role-color: var(--corso-n4);">
                <strong>N4↓</strong> Tensione
              </span>
            </div>
          </div>

          <div class="corso-m3-steps">
            <div class="corso-m3-steps__lab">Quattro criteri applicati</div>
            ${ANALISI_PASSI.map(
              (p) => `
                <div class="corso-m3-step ${p.esitoTipo === 'final' ? 'corso-m3-step--final' : ''}">
                  <div class="corso-m3-step__head">
                    <span class="corso-m3-step__chip ${p.esitoTipo === 'final' ? 'corso-m3-step__chip--final' : ''}">${p.chip}</span>
                    <span class="corso-m3-step__crit">${p.criterio}</span>
                  </div>
                  <p class="corso-m3-step__txt">${p.risposta}</p>
                  <div class="corso-m3-step__esito corso-m3-step__esito--${p.esitoTipo}">${p.esito}</div>
                </div>
              `,
            ).join('')}
          </div>
        </div>
      `,
      notes:
        "In contesto reale, questa analisi non viene eseguita per iscritto: il professionista la interiorizza come habitus di lettura. Il corso la rende esplicita per permettere di costruirla consapevolmente.",
    },

    // ─── 3.6 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m03-06',
      type: 'standard',
      title: "Non un problema da risolvere. Un'apertura da sostenere.",
      subtitle: 'Una riformulazione che cambia il dispositivo',
      content: `
        <div class="corso-m3-reframe">
          <blockquote class="corso-m3-reframe__bq corso-m3-reframe__bq--bad">
            «N3 è il nodo su cui c'è un problema. Lo devo migliorare.»
          </blockquote>
          <span class="corso-m3-reframe__arrow" aria-hidden="true">→</span>
          <blockquote class="corso-m3-reframe__bq corso-m3-reframe__bq--good">
            «N3 è l'apertura attraverso cui il campo può muoversi. La sostengo.»
          </blockquote>
        </div>
        <p class="corso-emph corso-emph--center" style="font-style: italic; margin: 6px 0 22px;">La differenza non è semantica. Cambia il dispositivo.</p>

        <div class="corso-cmp2">
          <section class="corso-cmp2__col corso-cmp2__col--left">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab">Se N3 è un problema</span>
              <h3 class="corso-cmp2__title">Il dispositivo lavora sul nodo</h3>
            </header>
            <ul class="corso-cmp2__items">
              <li><div class="corso-cmp2__item-text">L'obiettivo del dispositivo è far migliorare N3</div></li>
              <li><div class="corso-cmp2__item-text">Si misura il successo su N3 («ora il bambino indica di più?»)</div></li>
              <li><div class="corso-cmp2__item-text">Il dispositivo tende a lavorare direttamente su N3 (stimolazione)</div></li>
              <li><div class="corso-cmp2__item-text">Si perde di vista il campo (N2 come risorsa, N4 come vincolo)</div></li>
            </ul>
          </section>

          <section class="corso-cmp2__col corso-cmp2__col--right">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab" style="color: var(--corso-f3);">Se N3 è un'apertura</span>
              <h3 class="corso-cmp2__title">Il dispositivo sostiene il campo</h3>
            </header>
            <ul class="corso-cmp2__items">
              <li><div class="corso-cmp2__item-text">L'obiettivo è sostenere le condizioni in cui N3 si muove</div></li>
              <li><div class="corso-cmp2__item-text">Si misura il successo sul campo («lo scambio si allunga? l'adulto risponde meglio?»)</div></li>
              <li><div class="corso-cmp2__item-text">Il dispositivo agisce su N2 (risorsa) e sul contesto (ritmo, modalità)</div></li>
              <li><div class="corso-cmp2__item-text">N4 viene rispettato: non si aggiunge carico</div></li>
            </ul>
          </section>
        </div>

        <div class="corso-m3-synth">
          <div class="corso-m3-synth__head">Il nodo dominante indica</div>
          <ul>
            <li><strong>Dove</strong> il campo ha uno spazio di movimento</li>
            <li><strong>Verso cosa</strong> il dispositivo orienta l'energia disponibile</li>
            <li><strong>Quali risorse</strong> il dispositivo può usare</li>
            <li><strong>Quali tensioni</strong> il dispositivo deve rispettare</li>
          </ul>
          <p class="corso-m3-synth__neg">Non indica: <em>cosa il bambino deve imparare</em> né <em>cosa manca al campo</em>.</p>
        </div>

        <p class="corso-emph corso-emph--center" style="font-style: italic; margin-top: 26px; font-size: 1.08rem;">
          Il nodo dominante è identificato. Il passo successivo è scegliere la funzione dell'azione: cosa fa il dispositivo su quel nodo, con quelle risorse, in quella direzione.
        </p>
        <div class="corso-m3-next">
          <span class="corso-m3-next__arrow">→</span>
          <span class="corso-m3-next__lab">Modulo 4 — Le quattro funzioni</span>
        </div>
      `,
    },
  ],
};
