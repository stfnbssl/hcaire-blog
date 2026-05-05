import { Module } from '../types';
import { CASO_GUIDA_F3 } from '../caso-guida';

// ─── Dati globali del modulo ─────────────────────────────────────────────

const TEMPLATE_F3_CAMPI = [
  {
    numero: 1,
    id: 'ceOrigine',
    label: 'CE di origine',
    domanda: 'Qual è la configurazione del campo da cui partiamo?',
    descrizione:
      "La sintesi grammaticale della CE prodotta in F2. Non una lista di nodi: una frase che descrive il campo come configurazione relazionale dinamica.",
    formato:
      'Frase descrittiva — es. «Campo relazionale forte che sostiene accesso al mondo condiviso simbolico, con esplorazione ridotta ma in espansione.»',
    esempio: CASO_GUIDA_F3.ce.grammaticale,
    errore:
      "Non copiare i nodi uno per uno: serve la lettura d'insieme, non l'elenco.",
    upstream: true,
  },
  {
    numero: 2,
    id: 'nodoDominante',
    label: 'Nodo dominante',
    domanda:
      'Quale nodo, se attivato, muove di più il campo nella direzione evolutiva indicata?',
    descrizione:
      "Il nodo la cui apertura produce la variazione più rilevante per l'abitabilità complessiva del campo. Non è necessariamente il nodo con lo stato più basso. Identificato nella F3 tramite i quattro criteri (M3).",
    formato: 'Codice + nome — es. «N3 — Accesso al mondo condiviso simbolico»',
    esempio: `${CASO_GUIDA_F3.f3.nodoDominante.codice} — ${CASO_GUIDA_F3.f3.nodoDominante.nome}`,
    errore:
      'Non confondere con il nodo di sostegno (N2) o con il nodo in tensione (N4): ognuno ha un ruolo distinto nel template.',
    upstream: true,
  },
  {
    numero: 3,
    id: 'funzione',
    label: 'Funzione',
    domanda: 'Cosa deve fare il dispositivo sul campo?',
    descrizione:
      'Una delle quattro funzioni F3: Stabilizzare / Ampliare / Mediare / Proteggere. Scelta attraverso la sequenza decisionale (M4) a partire da T, A, R, D nella CE. Non si sceglie la tecnica: si sceglie la funzione.',
    formato: 'Enum: STABILIZZARE · AMPLIARE · MEDIARE · PROTEGGERE',
    esempio: CASO_GUIDA_F3.f3.funzione,
    errore:
      'Non nominare una tecnica (es. «lettura dialogica»): la funzione è categoriale, non tecnica.',
    upstream: true,
  },
  {
    numero: 4,
    id: 'campoBersaglio',
    label: 'Campo bersaglio',
    domanda: 'Quale aspetto del campo deve cambiare?',
    descrizione:
      'La condizione relazionale che il dispositivo mira a modificare. Descrive il campo come dovrebbe essere dopo il dispositivo, non come si descrive il bambino o il comportamento atteso. Il soggetto grammaticale è il campo, non il bambino.',
    formato: 'Frase nominale — es. «Stabilità e durata dello scambio condiviso simbolico»',
    esempio: CASO_GUIDA_F3.f3.campoBersaglio,
    errore:
      "«Far sì che il bambino indichi di più» — no: il soggetto non può essere il bambino. «Ampliamento del repertorio verbale» — no: descrive una competenza, non una condizione relazionale.",
    upstream: false,
  },
  {
    numero: 5,
    id: 'microAzioni',
    label: 'Micro-azioni',
    domanda:
      'Quali azioni concrete, osservabili e minime modificano il campo verso il campo bersaglio?',
    descrizione:
      "Lista ordinata di 3–5 azioni. Ogni azione deve essere: breve (realizzabile nella situazione senza ristrutturarla), integrabile (coerente con ciò che il professionista sta già facendo), osservabile (il suo effetto è rilevabile nel campo in tempo reale). Il soggetto è l'adulto o il setting — mai il bambino.",
    formato: 'Lista ordinata, 3–5 voci. Ogni voce: verbo + oggetto relazionale.',
    esempio: CASO_GUIDA_F3.f3.microAzioni.join(' · '),
    errore:
      "«Guidare il bambino a indicare con il dito» → azione sul bambino. «Fare una sessione di 30 minuti di scaffolding» → non è integrabile in un bilancio. Le micro-azioni modificano il comportamento adulto o le condizioni ambientali, non le competenze del bambino.",
    upstream: false,
  },
  {
    numero: 6,
    id: 'tempoReale',
    label: 'Tempo reale',
    domanda: 'In quanto tempo il dispositivo si realizza nel contesto specifico?',
    descrizione:
      'Non il tempo ideale: il tempo effettivamente disponibile nel contesto professionale in cui il dispositivo si inserisce. Il principio del minimo intervento sufficiente si applica anche al tempo: meno è meglio, se produce lo stesso effetto sul campo.',
    formato: 'Stima in minuti o range — es. «5 minuti durante il bilancio pediatrico»',
    esempio: CASO_GUIDA_F3.f3.tempoReale,
    errore:
      'Non sovrastimare il tempo disponibile nel contesto reale. Un dispositivo di 45 minuti non è un micro-dispositivo: è una sessione.',
    upstream: false,
  },
  {
    numero: 7,
    id: 'indicatoreRisonanza',
    label: 'Indicatore di risonanza',
    domanda: 'Come si riconosce che il campo ha risposto al dispositivo?',
    descrizione:
      "L'indicatore di risonanza è un segnale osservabile nel campo — non nel bambino isolato — che indica che il dispositivo ha prodotto un cambiamento nell'esperienza relazionale. Permette di aggiornare la CE dopo l'azione e, se assente, segnala che la funzione o il dispositivo vanno rivalutati.",
    formato: 'Descrizione comportamentale osservabile nel campo (bambino + adulto + contesto)',
    esempio: CASO_GUIDA_F3.f3.indicatoreRisonanza,
    errore:
      "«Il bambino sorride» → segnale del bambino, non del campo. «Il bambino impara a condividere» → obiettivo di sviluppo, non indicatore di risonanza. L'indicatore di risonanza riguarda la qualità dello scambio relazionale, non il progresso del bambino.",
    upstream: false,
  },
];

const MICRO_AZIONI_CRITERI = [
  {
    id: 'breve',
    label: 'Breve e integrabile',
    descrizione:
      "Realizzabile nella situazione senza ristrutturarla. Il professionista non ha bisogno di interrompere quello che sta facendo: il dispositivo si inserisce nel flusso già in corso.",
    test: 'Posso farlo adesso, qui, con quello che ho?',
    esempio_ok: 'Rallentare il ritmo del commento e aspettare la risposta del bambino.',
    esempio_no: 'Organizzare una sessione separata di lettura condivisa di 20 minuti.',
  },
  {
    id: 'non-specialistico',
    label: 'Non specialistico e reversibile',
    descrizione:
      'Non richiede formazione specifica per essere eseguito, e può essere interrotto senza conseguenze negative se il campo non risponde. Non produce dipendenza o effetti collaterali strutturali.',
    test: 'Se smetto, il campo torna alla sua condizione precedente senza danni?',
    esempio_ok: "Il genitore segue l'iniziativa del bambino invece di dirigerla.",
    esempio_no: 'Prescrivere una terapia logopedica bi-settimanale di 12 sessioni.',
  },
  {
    id: 'osservabile',
    label: 'Osservabile nei suoi effetti',
    descrizione:
      "L'effetto del dispositivo è rilevabile nel campo in tempo reale. Non si tratta di valutare il bambino: si tratta di leggere come il campo risponde all'azione. L'indicatore di risonanza permette di decidere se continuare o rivalutare.",
    test: 'Sono in grado di vedere se il campo sta rispondendo?',
    esempio_ok: 'La sequenza bambino-adulto si allunga: il bambino non interrompe lo scambio.',
    esempio_no: '«Il bambino migliorerà nel tempo» — non osservabile in tempo reale.',
  },
];

const OUTPUT_TIPO_STRUTTURA = [
  {
    sezione: 'A',
    titolo: 'Campo condiviso',
    domanda:
      "Cosa è condiviso tra bambino e adulto in questa situazione? Come funziona l'incontro?",
    descrizione:
      'Descrive la qualità dello spazio relazionale in atto: cosa è percepito insieme, come è organizzata la presenza reciproca. Non descrive il bambino, ma il campo nella sua struttura presente.',
    focus: "La configurazione attuale dello scambio — cos'è attivo, cos'è assente.",
    esempio: CASO_GUIDA_F3.f3.outputTipo.A,
    nota: 'Il campo condiviso non è «buono» o «cattivo»: è strutturato in un certo modo. La sezione descrive quella struttura senza valutarla.',
  },
  {
    sezione: 'B',
    titolo: 'Posizione soggettiva',
    domanda:
      "Qual è la posizione del bambino in questa configurazione? Come si situa rispetto all'altro e all'oggetto?",
    descrizione:
      "Descrive la posizione che il bambino occupa nel campo relazionale: come si orienta verso l'adulto, verso l'oggetto, verso l'esperienza. Non è una descrizione di competenze o deficit: è la lettura di come il soggetto è presente in quel campo specifico.",
    focus: 'Iniziativa, orientamento, risposta — nel campo, non isolati.',
    esempio: CASO_GUIDA_F3.f3.outputTipo.B,
    nota: 'Non confondere la posizione soggettiva con il profilo evolutivo. Non si valuta il bambino: si descrive come è situato in quel campo adesso.',
  },
  {
    sezione: 'C',
    titolo: 'Rapporto con il limite',
    domanda:
      'Come il bambino si confronta con i limiti della situazione (fine dello scambio, transizione, no, attesa)?',
    descrizione:
      "Descrive come il bambino si rapporta alle discontinuità del campo: l'interruzione dello scambio, il ritardo della risposta, la fine dell'attività. Non è un giudizio sulla tolleranza alla frustrazione: è la lettura di come il limite è vissuto nel campo relazionale.",
    focus: 'La discontinuità: come si affronta, come si riprende, cosa succede nel campo.',
    esempio: CASO_GUIDA_F3.f3.outputTipo.C,
    nota: 'Il «limite» in F3 è strutturale, non normativo: non si valuta se il bambino sa «gestire la frustrazione» — si descrive come il limite è presente o assente nel campo osservato.',
  },
  {
    sezione: 'D',
    titolo: 'Configurazione complessiva',
    domanda: "Come si può descrivere sinteticamente il campo nella sua configurazione d'insieme?",
    descrizione:
      'La descrizione sintetica del campo come totalità: quali forze sono attive, qual è la struttura dominante dell\'esperienza relazionale, come si colloca rispetto alla direzione evolutiva. È la sezione che integra le tre precedenti in un\'immagine complessiva.',
    focus: 'La sintesi configurazionale — non la lista dei problemi.',
    esempio: CASO_GUIDA_F3.f3.outputTipo.D,
    nota: 'La sezione D deve poter essere letta da sola: deve dare un\'immagine del campo comprensibile anche senza le sezioni precedenti. È il «riassunto esecutivo» dell\'output-tipo.',
  },
  {
    sezione: 'E',
    titolo: 'Ipotesi di sostegno',
    domanda:
      "Cosa può essere sostenuto? Qual è l'azione minima che aumenta l'abitabilità del campo?",
    descrizione:
      "La proposta operativa che emerge dalla lettura del campo: non una prescrizione, ma un'ipotesi di intervento coerente con la configurazione descritta nelle sezioni A–D. Prende la forma di micro-azioni contestualizzate nel perimetro F3.",
    focus: 'La proposta minima — funzione + campo bersaglio + micro-azioni essenziali.',
    esempio: CASO_GUIDA_F3.f3.outputTipo.E,
    nota: "La sezione E è un'ipotesi, non una prescrizione. Deve rimanere coerente con ciò che è stato descritto in A–D: non introduce elementi nuovi che non siano stati osservati nel campo.",
  },
];

const VERIFICA_COERENZA = [
  {
    numero: 1,
    domanda:
      'Il campo bersaglio e le micro-azioni hanno come soggetto il campo relazionale, non il bambino isolato?',
    indicatore:
      'Le micro-azioni modificano comportamenti adulti o condizioni ambientali — non prescrivono al bambino cosa fare.',
    errore_tipico: '«Il bambino deve imparare a...» · «Stimolare il bambino a...»',
    check_caso: { ok: true, nota: 'Tutte le micro-azioni hanno come soggetto il genitore o il pediatra.' },
  },
  {
    numero: 2,
    domanda: 'Il dispositivo è applicabile senza diagnosi clinica?',
    indicatore:
      'Il template non fa riferimento a etichette diagnostiche né le richiede per essere applicato. È valido per qualsiasi configurazione relazionale con quei segnali CE.',
    errore_tipico: '«Applicabile a bambini con...» · «In presenza di diagnosi di...»',
    check_caso: { ok: true, nota: 'Bilancio pediatrico standard, nessuna etichetta diagnostica richiesta.' },
  },
  {
    numero: 3,
    domanda: 'Ogni micro-azione è osservabile nel campo in tempo reale?',
    indicatore:
      "Posso vedere mentre accade se l'azione è in corso e se il campo sta rispondendo. Non richiede strumenti di valutazione differita.",
    errore_tipico: '«Nel lungo periodo si vedrà...» · «Alla fine del percorso...»',
    check_caso: { ok: true, nota: "Effetti visibili entro i 5 minuti dell'incontro." },
  },
  {
    numero: 4,
    domanda:
      "L'indicatore di risonanza è leggibile come risposta del campo — non come progresso del bambino?",
    indicatore:
      "L'indicatore descrive la qualità dello scambio relazionale: durata, qualità, struttura dell'incontro. Non misura competenze.",
    errore_tipico: '«Il bambino sa ora...» · «Ha migliorato la sua capacità di...»',
    check_caso: { ok: true, nota: 'Allungamento della sequenza, integrazione sguardo + gesto + voce.' },
  },
  {
    numero: 5,
    domanda:
      "Se l'indicatore di risonanza è assente, il template permette di rivalutare la CE?",
    indicatore:
      'Un dispositivo F3 non si insiste: se il campo non risponde, si torna alla CE e si rivaluta la lettura. Il template non presuppone che il campo debba rispondere in un certo modo.',
    errore_tipico: '«Se non funziona, aumentare la frequenza del dispositivo.» · «Insistere per almeno X sessioni.»',
    check_caso: { ok: true, nota: 'Reversibile e leggero: assenza di risonanza → rivalutazione CE.' },
  },
];

// ─── Modulo ──────────────────────────────────────────────────────────────

export const Module05: Module = {
  id: 'm05',
  number: 5,
  title: 'Il micro-dispositivo',
  shortTitle: 'Micro-dispositivo',
  accent: '#2d6a4f',
  slides: [
    // ─── 5.1 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m05-01',
      type: 'standard',
      title: 'La funzione non è ancora il dispositivo',
      subtitle: 'Cosa manca per passare da «Mediare» a cinque micro-azioni in cinque minuti',
      content: `
        <div class="corso-callout" style="border-left-color: var(--corso-fn-mediare);">
          <p><em>Nel Modulo 4 abbiamo scelto la funzione: <strong>MEDIAZIONE</strong>. Sappiamo cosa deve fare il dispositivo: sostenere la transizione N2→N3, rallentando il ritmo adulto e lasciando spazio alla sequenza del bambino.</em></p>
          <p class="corso-callout__cta" style="font-size: 1.1rem;">Non sappiamo ancora come.</p>
        </div>

        <div class="corso-m5-question">
          <p class="corso-m5-question__q">«Come si costruisce un dispositivo F3?»</p>
          <p class="corso-m5-question__sub">Dall'orientamento funzionale al template.<br/>Dal template alle micro-azioni contestualizzate nel campo reale.</p>
        </div>

        <div class="corso-m5-flow">
          <div class="corso-m5-flow__step">
            <span class="corso-m5-flow__num">1</span>
            <strong>Template F3</strong>
            <span class="corso-m5-flow__sub">7 campi</span>
          </div>
          <span class="corso-m5-flow__arrow">→</span>
          <div class="corso-m5-flow__step">
            <span class="corso-m5-flow__num">2</span>
            <strong>Micro-azioni</strong>
            <span class="corso-m5-flow__sub">3–5 azioni</span>
          </div>
          <span class="corso-m5-flow__arrow">→</span>
          <div class="corso-m5-flow__step">
            <span class="corso-m5-flow__num">3</span>
            <strong>Output-tipo</strong>
            <span class="corso-m5-flow__sub">5 sezioni</span>
          </div>
          <span class="corso-m5-flow__arrow">→</span>
          <div class="corso-m5-flow__step">
            <span class="corso-m5-flow__num">4</span>
            <strong>Verifica coerenza</strong>
            <span class="corso-m5-flow__sub">5 domande</span>
          </div>
        </div>
        <p class="corso-narrative__caption" style="text-align: center; margin-top: 10px; font-style: italic;">
          Questi quattro strumenti formano insieme il micro-dispositivo di campo. Non sono liste da compilare: sono domande da porre al campo.
        </p>
      `,
      guardrail: {
        code: 'C-F3-50',
        label: 'Il dispositivo nasce dal campo',
        text:
          'Il Template F3 non si compila a partire da un manuale di tecniche. Si compila a partire dalla CE. Ogni campo diverso produce un template diverso — anche con la stessa funzione.',
      },
    },

    // ─── 5.2 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m05-02',
      type: 'interactive',
      title: 'Sette campi, una struttura',
      subtitle: 'La grammatica del micro-dispositivo di campo',
      intro: `
        <p class="corso-narrative__caption" style="text-align: center; margin-bottom: 14px;">
          I campi 1–3 (CE, nodo dominante, funzione) arrivano dai passaggi precedenti di F3 — la compilazione vera e propria inizia dal campo 4.
        </p>
      `,
      interactive: {
        kind: 'expandable-cards',
        layout: 'vertical',
        multiOpen: false,
        defaultOpen: ['campoBersaglio'],
        cards: TEMPLATE_F3_CAMPI.map((c) => ({
          id: c.id,
          color: 'var(--corso-module-accent)',
          badge: String(c.numero),
          title: c.label,
          summary: c.upstream
            ? '← già definito a monte (F2/F3)'
            : c.domanda,
          detail: `
            <div class="corso-m5-field">
              <p class="corso-m5-field__q"><em>«${c.domanda}»</em></p>
              <p class="corso-m5-field__desc">${c.descrizione}</p>

              <div class="corso-m5-field__formato">
                <span class="corso-m5-field__lab">Formato atteso</span>
                <code>${c.formato}</code>
              </div>

              <div class="corso-m5-field__example">
                <span class="corso-m5-field__lab">Esempio caso-guida</span>
                <p>${c.esempio}</p>
              </div>

              <div class="corso-m5-field__error">
                <span class="corso-m5-field__lab">Errore tipico</span>
                <p>${c.errore}</p>
              </div>
            </div>
          `,
        })),
      },
      notes:
        'I campi 1–3 sono già stati prodotti dai passaggi precedenti di F3. La compilazione del template inizia di fatto dai campi 4–7.',
    },

    // ─── 5.3 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m05-03',
      type: 'comparison',
      title: 'La grammatica delle micro-azioni',
      subtitle: 'Tre proprietà, tre test, tre distinzioni',
      content: `
        <div class="corso-m5-criteri">
          ${MICRO_AZIONI_CRITERI.map(
            (c, i) => `
              <div class="corso-m5-criterio">
                <div class="corso-m5-criterio__num">${i + 1}</div>
                <div class="corso-m5-criterio__lab">${c.label}</div>
                <p class="corso-m5-criterio__desc">${c.descrizione}</p>
                <div class="corso-m5-criterio__test"><em>«${c.test}»</em></div>
                <div class="corso-m5-criterio__ex corso-m5-criterio__ex--ok">
                  <span>✓</span><span>${c.esempio_ok}</span>
                </div>
                <div class="corso-m5-criterio__ex corso-m5-criterio__ex--no">
                  <span>✗</span><span>${c.esempio_no}</span>
                </div>
              </div>
            `,
          ).join('')}
        </div>

        <div class="corso-cmp2" style="margin-top: 18px;">
          <section class="corso-cmp2__col corso-cmp2__col--left">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab">Azione sul bambino</span>
              <h3 class="corso-cmp2__title">Il bambino come soggetto dell'azione</h3>
            </header>
            <ul class="corso-cmp2__items">
              <li><div class="corso-cmp2__item-text">«Guidare il bambino a indicare con il dito»</div></li>
              <li><div class="corso-cmp2__item-text">«Insegnare al bambino a nominare le immagini»</div></li>
              <li><div class="corso-cmp2__item-text">«Stimolare il bambino a vocalizzare»</div></li>
              <li><div class="corso-cmp2__item-text">«Far fare al bambino una sequenza di tre gesti»</div></li>
            </ul>
            <p class="corso-cmp2__foot-note">Queste azioni non sono sbagliate come azioni — ma non sono micro-azioni F3: non modificano il campo, modificano il bambino.</p>
          </section>

          <section class="corso-cmp2__col" style="border-top-color: var(--corso-module-accent); background: color-mix(in srgb, var(--corso-module-accent) 4%, transparent);">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab" style="color: var(--corso-module-accent);">Azione sul campo</span>
              <h3 class="corso-cmp2__title">Il campo come soggetto dell'azione</h3>
            </header>
            <ul class="corso-cmp2__items">
              <li><div class="corso-cmp2__item-text">«Il genitore segue l'interesse del bambino senza anticiparlo»</div></li>
              <li><div class="corso-cmp2__item-text">«Nomina ciò che il bambino indica, con voce calma e ritmo lento»</div></li>
              <li><div class="corso-cmp2__item-text">«Attende la risposta del bambino senza riempire il silenzio»</div></li>
              <li><div class="corso-cmp2__item-text">«Il pediatra osserva senza interrompere la sequenza bambino-genitore»</div></li>
            </ul>
            <p class="corso-cmp2__foot-note" style="color: var(--corso-module-accent);">Ogni azione ha come soggetto l'adulto o il contesto: modifica le condizioni in cui il bambino è presente, non il bambino stesso.</p>
          </section>
        </div>

        <div class="corso-cmp2__footer">
          <span class="corso-cmp2__footer-lab">Test grammaticale</span>
          <p>«Il soggetto è un adulto o una condizione ambientale — non il bambino?» Se il bambino è soggetto, l'azione è fuori perimetro F3.</p>
        </div>
      `,
      guardrail: {
        code: 'C-F3-51',
        label: 'Il soggetto delle micro-azioni',
        text:
          "Se una micro-azione descrive ciò che deve fare il bambino, non è una micro-azione F3. Il soggetto dell'azione è sempre l'adulto, il setting, le condizioni relazionali.",
      },
    },

    // ─── 5.4 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m05-04',
      type: 'interactive',
      title: "L'output-tipo: leggere il campo per sostenerlo",
      subtitle: 'Cinque sezioni, una struttura di lettura condivisa',
      intro: `
        <p class="corso-narrative__caption" style="margin-bottom: 14px;">
          L'output-tipo vuoto è una pre-struttura di lettura: non prescrive cosa scrivere, ma orienta l'attenzione verso le dimensioni rilevanti del campo. È condivisibile con altri professionisti perché usa un vocabolario comune.
        </p>
      `,
      interactive: {
        kind: 'expandable-cards',
        layout: 'vertical',
        multiOpen: false,
        defaultOpen: ['A'],
        cards: OUTPUT_TIPO_STRUTTURA.map((s) => ({
          id: s.sezione,
          color: 'var(--corso-module-accent)',
          badge: s.sezione,
          title: s.titolo,
          summary: s.focus,
          detail: `
            <div class="corso-m5-output">
              <p class="corso-m5-output__q"><em>«${s.domanda}»</em></p>
              <p class="corso-m5-output__desc">${s.descrizione}</p>

              <div class="corso-m5-output__example">
                <span class="corso-m5-output__lab">Esempio — caso-guida DBS</span>
                <p><em>${s.esempio}</em></p>
              </div>

              <div class="corso-m5-output__nota">
                <span class="corso-m5-output__lab">Nota metodologica</span>
                <p>${s.nota}</p>
              </div>
            </div>
          `,
        })),
      },
      content: `
        <div class="corso-m5-output-flow">
          <div class="corso-m5-output-flow__lab">Le cinque sezioni non sono indipendenti</div>
          <div class="corso-m5-output-flow__chain">
            <span class="corso-m5-output-flow__chip">A — campo</span>
            <span class="corso-m5-output-flow__arr">→</span>
            <span class="corso-m5-output-flow__chip">B — bambino nel campo</span>
            <span class="corso-m5-output-flow__arr">→</span>
            <span class="corso-m5-output-flow__chip">C — limite</span>
            <span class="corso-m5-output-flow__arr">→</span>
            <span class="corso-m5-output-flow__chip">D — sintesi</span>
            <span class="corso-m5-output-flow__arr corso-m5-output-flow__arr--strong">⇒</span>
            <span class="corso-m5-output-flow__chip corso-m5-output-flow__chip--final">E — ipotesi</span>
          </div>
        </div>
      `,
      notes:
        "L'output-tipo non è un formulario da consegnare: è uno strumento di lettura condivisa. La sezione E è un'ipotesi — non una prescrizione. Se il campo cambia, l'ipotesi va aggiornata.",
    },

    // ─── 5.5 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m05-05',
      type: 'standard',
      title: 'Prima di applicare il dispositivo: cinque domande',
      subtitle: 'La verifica di coerenza metodologica del Template F3',
      content: `
        <p class="corso-m5-rule-intro">
          Prima che un Template F3 sia pronto per essere applicato, cinque domande verificano che il dispositivo sia coerente con il perimetro metodologico di F3.
        </p>
        <p class="corso-narrative__caption" style="font-style: italic; text-align: center; margin-bottom: 18px;">
          Non sono criteri formali: sono domande di lettura. Un «no» a qualsiasi domanda non invalida il lavoro — indica dove rileggere la CE o riformulare il campo bersaglio.
        </p>

        <div class="corso-m5-checklist">
          ${VERIFICA_COERENZA.map(
            (v) => `
              <div class="corso-m5-check">
                <div class="corso-m5-check__head">
                  <span class="corso-m5-check__tick" aria-hidden="true">✓</span>
                  <span class="corso-m5-check__num">${v.numero}</span>
                  <h3 class="corso-m5-check__q">${v.domanda}</h3>
                </div>
                <div class="corso-m5-check__row">
                  <span class="corso-m5-check__lab">Indicatore</span>
                  <p>${v.indicatore}</p>
                </div>
                <div class="corso-m5-check__row corso-m5-check__row--err">
                  <span class="corso-m5-check__lab">Errore tipico</span>
                  <p><em>${v.errore_tipico}</em></p>
                </div>
                <div class="corso-m5-check__caso">
                  <span class="corso-m5-check__caso-chip">✓ Nel caso-guida</span>
                  <span>${v.check_caso.nota}</span>
                </div>
              </div>
            `,
          ).join('')}
        </div>

        <blockquote class="corso-blockquote" style="border-left-color: var(--corso-guard); margin: 24px auto; max-width: 760px;">
          «Un dispositivo F3 è coerente quando non parla del bambino ma del campo; quando non prescrive ma propone; quando, se il campo non risponde, permette di rivalutare invece di insistere.»
        </blockquote>
      `,
      guardrail: {
        code: 'C-F3-52',
        label: 'Indicatore di risonanza assente → rivalutare, non insistere',
        text:
          "Se il campo non risponde al dispositivo, il passo corretto è tornare alla CE e rivalutare la lettura — non aumentare l'intensità o la frequenza dello stesso dispositivo. Il dispositivo F3 è un'ipotesi di campo, non un protocollo.",
      },
    },

    // ─── 5.6 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m05-06',
      type: 'narrative',
      title: 'Il Template F3 del caso-guida: dalla CE al dispositivo',
      subtitle: 'Dialogic Book Sharing durante il bilancio pediatrico — micro-dispositivo MEDIAZIONE',
      content: `
        <div class="corso-m5-compiled">
          <section class="corso-m5-compiled__col">
            <header class="corso-m5-compiled__head">
              <h3>Template F3</h3>
              <span class="corso-m5-compiled__chip" style="background: var(--corso-fn-mediare);">MED</span>
            </header>
            <div class="corso-m5-compiled__rows">
              <div class="corso-m5-compiled__row"><span class="corso-m5-compiled__num">1</span><div><span class="corso-m5-compiled__lab">CE di origine</span><p>${CASO_GUIDA_F3.ce.grammaticale}</p></div></div>
              <div class="corso-m5-compiled__row"><span class="corso-m5-compiled__num">2</span><div><span class="corso-m5-compiled__lab">Nodo dominante</span><p>${CASO_GUIDA_F3.f3.nodoDominante.codice} — ${CASO_GUIDA_F3.f3.nodoDominante.nome}</p></div></div>
              <div class="corso-m5-compiled__row"><span class="corso-m5-compiled__num">3</span><div><span class="corso-m5-compiled__lab">Funzione</span><p><strong style="color: var(--corso-fn-mediare);">${CASO_GUIDA_F3.f3.funzione}</strong></p></div></div>
              <div class="corso-m5-compiled__row"><span class="corso-m5-compiled__num">4</span><div><span class="corso-m5-compiled__lab">Campo bersaglio</span><p>${CASO_GUIDA_F3.f3.campoBersaglio}</p></div></div>
              <div class="corso-m5-compiled__row"><span class="corso-m5-compiled__num">5</span><div><span class="corso-m5-compiled__lab">Micro-azioni</span><ol class="corso-m5-compiled__list">${CASO_GUIDA_F3.f3.microAzioni
                .map((a) => `<li>${a}</li>`)
                .join('')}</ol></div></div>
              <div class="corso-m5-compiled__row"><span class="corso-m5-compiled__num">6</span><div><span class="corso-m5-compiled__lab">Tempo reale</span><p>${CASO_GUIDA_F3.f3.tempoReale}</p></div></div>
              <div class="corso-m5-compiled__row"><span class="corso-m5-compiled__num">7</span><div><span class="corso-m5-compiled__lab">Indicatore di risonanza</span><p>${CASO_GUIDA_F3.f3.indicatoreRisonanza}</p></div></div>
            </div>
          </section>

          <section class="corso-m5-compiled__col">
            <header class="corso-m5-compiled__head">
              <h3>Output-tipo</h3>
              <div class="corso-m5-compiled__sezioni">
                ${['A', 'B', 'C', 'D', 'E']
                  .map((s) => `<span class="corso-m5-compiled__sez">${s}</span>`)
                  .join('')}
              </div>
            </header>
            <div class="corso-m5-compiled__rows">
              ${(['A', 'B', 'C', 'D', 'E'] as const)
                .map(
                  (sez) => `
                    <div class="corso-m5-compiled__row corso-m5-compiled__row--out ${
                      sez === 'E' ? 'corso-m5-compiled__row--out-e' : ''
                    }">
                      <span class="corso-m5-compiled__sez-lab">${sez}</span>
                      <p>${CASO_GUIDA_F3.f3.outputTipo[sez]}</p>
                    </div>
                  `,
                )
                .join('')}
            </div>
          </section>
        </div>

        <div class="corso-m5-coh-strip">
          <div class="corso-m5-coh-strip__lab">Verifica di coerenza</div>
          <div class="corso-m5-coh-strip__chips">
            ${VERIFICA_COERENZA.map(
              (v) => `
                <span class="corso-m5-coh-chip">
                  <span class="corso-m5-coh-chip__tick">✓</span>
                  <strong>${v.numero}.</strong> ${v.check_caso.nota}
                </span>
              `,
            ).join('')}
          </div>
          <p class="corso-narrative__caption" style="text-align: center; margin-top: 8px; font-style: italic;">
            Tutte e cinque le domande di verifica ricevono risposta affermativa. Il dispositivo è pronto per essere applicato.
          </p>
        </div>

        <div class="corso-callout corso-callout--accent-f3" style="margin-top: 18px;">
          <p>Questo template è il prodotto della pipeline F3 applicata al caso-guida: partendo dalla CE prodotta in F2, identificando N3 come nodo dominante, scegliendo MEDIAZIONE come funzione, costruendo cinque micro-azioni osservabili nel bilancio pediatrico.</p>
          <p style="font-style: italic;">Il dispositivo non prescrive: orienta. Il pediatra e il genitore rimangono i protagonisti della scena.</p>
        </div>
      `,
      notes:
        'Nel Modulo 6 vedremo come lo stesso template si ricollega alla Tipologia Universale: le micro-azioni del caso-guida esprimono U2 (Sintonizzazione) e U4 (Mediazione Simbolica).',
    },

    // ─── 5.7 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m05-07',
      type: 'interactive',
      title: 'Il tuo Template F3',
      subtitle: 'Costruisci passo per passo un micro-dispositivo di campo',
      intro: `
        <p class="corso-narrative__caption" style="text-align: center; margin-bottom: 12px;">
          Il builder è pre-compilato con i dati del caso-guida. Modifica ogni campo per sperimentare configurazioni diverse — il pulsante <em>«↺ Ripristina caso-guida»</em> riporta ai valori originali.
        </p>
      `,
      interactive: {
        kind: 'f3-builder',
      },
    },

    // ─── 5.8 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m05-08',
      type: 'standard',
      title: "Non una soluzione: un'ipotesi",
      subtitle: 'Cosa resta aperto dopo aver costruito il dispositivo',
      content: `
        <div class="corso-two-col">
          <div class="corso-m4-distinct">
            <div class="corso-m4-distinct__lab">Il protocollo</div>
            <ul>
              <li>Prescrive una sequenza di azioni da seguire</li>
              <li>Ha una logica interna indipendente dal campo specifico</li>
              <li>Se il campo non risponde, si insiste o si aumenta la dose</li>
              <li>Valuta il bambino alla fine del percorso</li>
            </ul>
          </div>
          <div class="corso-m4-distinct corso-m4-distinct--device">
            <div class="corso-m4-distinct__lab">Il micro-dispositivo F3</div>
            <ul>
              <li>Propone un'ipotesi di intervento coerente con questa CE</li>
              <li>Nasce dal campo specifico e per quel campo</li>
              <li>Se il campo non risponde, si rivaluta la CE — non si insiste</li>
              <li>Aggiorna la lettura del campo dopo ogni azione</li>
            </ul>
          </div>
        </div>
        <p class="corso-narrative__caption" style="text-align: center; font-style: italic; margin: 14px auto; max-width: 720px;">
          Questa differenza non è terminologica: è strutturale. Un dispositivo F3 che si comporta come un protocollo ha perso il suo principio costitutivo.
        </p>

        <div class="corso-m5-cycle">
          <div class="corso-m5-cycle__node">
            <span class="corso-m5-cycle__lab">Osserva il campo</span>
          </div>
          <span class="corso-m5-cycle__arr">→</span>
          <div class="corso-m5-cycle__node">
            <span class="corso-m5-cycle__lab">Applica il dispositivo</span>
          </div>
          <span class="corso-m5-cycle__arr">→</span>
          <div class="corso-m5-cycle__node">
            <span class="corso-m5-cycle__lab">Rileva la risposta</span>
          </div>
          <span class="corso-m5-cycle__arr">→</span>
          <div class="corso-m5-cycle__node corso-m5-cycle__node--ce">
            <span class="corso-m5-cycle__lab">Aggiorna la CE</span>
          </div>
          <span class="corso-m5-cycle__loop" aria-hidden="true">↺ ricomincia</span>
        </div>
        <p class="corso-narrative__caption" style="text-align: center; font-style: italic; margin-top: 6px;">
          Il dispositivo non chiude il processo: lo rilancia. Ogni applicazione produce nuova osservabilità. La CE dopo il dispositivo è diversa dalla CE prima.
        </p>

        <div class="corso-callout corso-callout--accent-f3" style="margin-top: 22px;">
          <p>Abbiamo costruito il template. Abbiamo compilato l'output-tipo. Abbiamo verificato la coerenza.</p>
          <p>Il dispositivo del caso-guida si può descrivere in modo diverso: non solo come <strong>MEDIAZIONE</strong> per N3, ma come espressione di due forme universali di sostegno del campo — <strong>U2</strong> (Sintonizzazione) e <strong>U4</strong> (Mediazione Simbolica).</p>
          <p style="font-style: italic;">Nel Modulo 6 vedremo la <strong>Tipologia Universale</strong>: sei forme che ritornano in qualsiasi campo, con qualsiasi funzione, in qualsiasi contesto professionale.</p>
        </div>

        <div class="corso-m3-next">
          <span class="corso-m3-next__arrow">→</span>
          <span class="corso-m3-next__lab">Modulo 6 — La tipologia U1–U6</span>
        </div>
      `,
    },
  ],
};
