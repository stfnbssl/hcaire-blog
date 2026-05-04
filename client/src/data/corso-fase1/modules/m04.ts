import type { ExpandableCardData, Module } from '../types';
import { SEI_ASSI_BY_ID } from '../sei-assi';

// =============================================================
// Modulo 4 — Assi 2 e 3: Alterità e normatività
// =============================================================

const A2 = SEI_ASSI_BY_ID.a2;
const A3 = SEI_ASSI_BY_ID.a3;

// ─── Tre modalità di relazione (A2) ──────────────────────────

interface ModalitaRelazione {
  id: string;
  nome: string;
  colore: string;
  sfondo: string;
  descrizione: string;
  osservabile: string;
  asseChip: string | null;
}

const MODALITA_RELAZIONE: ModalitaRelazione[] = [
  {
    id: 'fusione',
    nome: 'Fusione',
    colore: '#e74c3c',
    sfondo: '#fdecea',
    descrizione:
      "L'altro non ha ancora un'esperienza separata dalla propria: l'adulto è un prolungamento del bambino, un'estensione del suo campo di azione. Non c'è ancora «un altro» — c'è un campo indistinto in cui il bambino è il centro.",
    osservabile:
      'Il bambino tratta l\'adulto come se dovesse rispondere automaticamente a ogni suo stato: non cerca conferma, non aspetta risposta — si aspetta sincronia immediata. Quando la sincronia non arriva, il campo collassa.',
    asseChip: null,
  },
  {
    id: 'uso',
    nome: 'Uso',
    colore: '#e67e22',
    sfondo: '#fef3e2',
    descrizione:
      "L'altro è riconosciuto come distinto — ma come strumento, non come soggetto. Il bambino usa l'adulto per raggiungere un fine: lo trascina, lo indica, lo orienta. C'è già distinzione, ma non ancora riconoscimento dell'esperienza interna dell'altro.",
    osservabile:
      "Il bambino si avvicina all'adulto quando ha bisogno di qualcosa e si allontana quando lo ha ottenuto. Lo sguardo è funzionale: cerca la mano, non il volto. L'adulto è mezzo, non interlocutore.",
    asseChip: null,
  },
  {
    id: 'riconoscimento',
    nome: 'Riconoscimento',
    colore: '#2d6a4f',
    sfondo: '#d8f3dc',
    descrizione:
      "L'altro è riconosciuto come portatore di un'esperienza propria: ha un interno, una prospettiva, una risposta che non è automatica ma è sua. Il bambino cerca l'adulto non per usarlo ma per condividere qualcosa con lui — con un soggetto che avrà la propria reazione a ciò che viene condiviso.",
    osservabile:
      "Il bambino guarda il volto dell'adulto, non solo la mano. Aspetta la risposta — non la mera esecuzione. Modifica il proprio comportamento in base all'espressione dell'adulto, non solo alla sua azione. Cerca conferma, non solo assistenza.",
    asseChip: 'A2',
  },
];

// ─── Le tre forme di normatività emergente (A3) ──────────────

interface FormaNormativita {
  id: string;
  nome: string;
  descrizione: string;
  esempio: string;
  visibileQuando: string;
}

const TRE_FORME_NORMATIVITA: FormaNormativita[] = [
  {
    id: 'scambio',
    nome: 'Criteri dello scambio',
    descrizione:
      "La struttura implicita dell'interazione: chi parla quando, chi aspetta, chi inizia. Il bambino che impara a «non interrompere» o ad «aspettare il proprio turno» non sta solo seguendo una regola: sta sviluppando internamente un senso del ritmo dello scambio come campo normativo condiviso.",
    esempio:
      "Nella scena di lettura: il bambino indica → aspetta → l'adulto risponde → il bambino riprende. Nessuno ha insegnato al bambino questo schema: è emerso dall'interno dello scambio stesso, reso possibile dal campo relazionale che lo sosteneva.",
    visibileQuando:
      "Il bambino aspetta spontaneamente la risposta dell'adulto prima di continuare — senza che gli venga chiesto di aspettare.",
  },
  {
    id: 'oggetti',
    nome: 'Criteri di spazio e oggetti',
    descrizione:
      "L'orientamento verso ciò che è «di chi» e «come si trattano le cose». Non le regole esplicite di proprietà, ma il senso emergente che gli oggetti hanno una posizione in un campo condiviso — e che modificarli ha conseguenze per l'altro.",
    esempio:
      "Il bambino che restituisce spontaneamente un oggetto all'altro bambino — non perché l'adulto lo dice, ma perché ha sviluppato il senso che quell'oggetto appartiene a quel campo condiviso — mostra A3 in azione.",
    visibileQuando:
      "Il bambino modifica il proprio comportamento sugli oggetti in risposta all'espressione (non alla parola) dell'altro.",
  },
  {
    id: 'significato',
    nome: 'Criteri di significato condiviso',
    descrizione:
      "La normatività più sottile: il bambino orienta la propria azione secondo ciò che «conta» nel campo condiviso. Non solo cosa si fa, ma come si fa in un modo che sia riconoscibile e valido per l'altro. Il bambino inizia a fare le cose «come si fanno» — non per imitazione, ma perché ha sviluppato un senso interno della forma corretta.",
    esempio:
      "Il bambino che usa il cucchiaio in modo riconoscibile — non come strumento qualsiasi ma come «cucchiaio» con la sua forma culturale di uso — mostra A3 nell'incontro con il mondo storico-culturale (che poi diventa A6).",
    visibileQuando:
      "Il bambino si corregge spontaneamente quando la propria azione non corrisponde alla forma attesa — senza intervento dell'adulto.",
  },
];

// ─── Tabella norma esterna vs. normatività emergente ─────────

interface RigaNorma {
  id: string;
  aspetto: string;
  normaEsterna: string;
  normativitaEmergente: string;
}

const NORMA_VS_NORMATIVITA: RigaNorma[] = [
  {
    id: 'd1',
    aspetto: 'Origine',
    normaEsterna: "Viene dall'esterno: l'adulto definisce cosa è permesso e cosa no.",
    normativitaEmergente:
      "Emerge dall'interno del campo relazionale: il bambino sviluppa internamente un orientamento verso criteri condivisi.",
  },
  {
    id: 'd2',
    aspetto: 'Motivazione',
    normaEsterna:
      'Si segue per obbedienza, paura delle conseguenze o ricerca di approvazione.',
    normativitaEmergente:
      "Si segue perché il bambino ha interiorizzato la struttura dello scambio come campo con i propri criteri.",
  },
  {
    id: 'd3',
    aspetto: 'Cosa si osserva',
    normaEsterna: 'Il comportamento del bambino: si adegua o non si adegua alla norma.',
    normativitaEmergente:
      'La qualità del campo: come si stanno organizzando i criteri condivisi fra bambino e adulto.',
  },
  {
    id: 'd4',
    aspetto: 'Cosa si chiede al professionista',
    normaEsterna: 'Stabilire, comunicare e far rispettare le norme.',
    normativitaEmergente:
      "Creare le condizioni di campo in cui la normatività possa emergere dall'interno.",
  },
  {
    id: 'd5',
    aspetto: 'Conseguenza se assente',
    normaEsterna: 'Il bambino «non rispetta le regole» — intervento disciplinare.',
    normativitaEmergente:
      'Il campo non produce le condizioni perché la normatività emerga — riflessione sul campo relazionale.',
  },
  {
    id: 'd6',
    aspetto: 'Esempio nel caso-guida',
    normaEsterna:
      "Nessuno — nella scena non si vedono norme imposte. Il libro non ha regole d'uso esplicite.",
    normativitaEmergente:
      "Il bambino aspetta la risposta dell'adulto prima di girare pagina: nessuno gliel'ha chiesto — è emerso dall'interno dello scambio.",
  },
];

// ─── Quattro letture mono-registro tipiche (A2 e A3) ─────────

interface LetturaMonoRegistroM4 {
  id: string;
  asse: 'A2' | 'A3';
  tipo: string;
  colore: string;
  descrizione: string;
  esempioMonoRegistro: string;
  letturaStrutturale: string;
  cosaRestaInOmbra: string;
}

const LETTURE_MONO_M4: LetturaMonoRegistroM4[] = [
  {
    id: 'e1',
    asse: 'A2',
    tipo: 'Lettura per empatia',
    colore: '#e74c3c',
    descrizione:
      "Asse 2 viene letto principalmente come «capacità empatica» del bambino: leggere le emozioni degli altri, condividere gli stati affettivi, mostrare preoccupazione per chi piange. L'empatia è una manifestazione possibile di A2 — ma A2 è più strutturale: riguarda il riconoscimento dell'altro come soggetto con un'esperienza propria, indipendentemente dal contenuto emotivo di quella esperienza.",
    esempioMonoRegistro: '«Il bambino mostra buona empatia: consola il compagno che piange.»',
    letturaStrutturale:
      "«Il bambino riconosce nel compagno un soggetto con un'esperienza propria (la sofferenza) e vi risponde — questo è il livello strutturale di A2 di cui l'empatia è una manifestazione situata.»",
    cosaRestaInOmbra:
      "La lettura per empatia rende A2 dipendente dal contenuto emotivo visibile: si osserva solo quando c'è un'emozione esplicita da leggere. Ma A2 è attivo anche quando non c'è emozione evidente — nella qualità ordinaria dello scambio, nel modo in cui il bambino cerca la risposta soggettiva dell'adulto durante la lettura del libro.",
  },
  {
    id: 'e2',
    asse: 'A2',
    tipo: 'Lettura per compliance sociale',
    colore: '#e67e22',
    descrizione:
      "Il riconoscimento dell'altro viene letto come comportamento socialmente adeguato: il bambino che saluta, che condivide i giocattoli, che aspetta il turno. Ma questi comportamenti possono essere prodotti anche senza il riconoscimento dell'altro come soggetto — per apprendimento, per imitazione, per evitamento del conflitto.",
    esempioMonoRegistro:
      '«Il bambino ha buone abilità sociali: saluta, condivide, aspetta il turno.»',
    letturaStrutturale:
      "«Il bambino mostra comportamenti socialmente adeguati — ma A2 chiede qualcosa di più: il bambino cerca nell'altro una risposta soggettiva o solo una risposta funzionale? Guarda il volto o solo la mano?»",
    cosaRestaInOmbra:
      "Resta in ombra la domanda strutturale di A2: non «cosa fa il bambino con gli altri» ma «come il bambino abita il campo relazionale con gli altri» — se c'è riconoscimento reciproco o solo coordinazione di comportamenti.",
  },
  {
    id: 'e3',
    asse: 'A3',
    tipo: 'Lettura per obbedienza',
    colore: '#2c3e50',
    descrizione:
      "La normatività emergente viene letta come rispetto delle regole: il bambino «obbedisce» o «non obbedisce». Ma obbedienza e normatività emergente sono strutturalmente diverse: l'obbedienza può avvenire senza nessuna interiorizzazione — il bambino esegue perché c'è una conseguenza. La normatività emergente viene dall'interno.",
    esempioMonoRegistro:
      "«Il bambino rispetta le regole del gruppo e obbedisce alle indicazioni dell'educatrice.»",
    letturaStrutturale:
      '«La domanda di A3 non è se il bambino obbedisce — è se sta sviluppando internamente un orientamento verso i criteri condivisi del campo. Si corregge da solo? Si accorge quando la struttura dello scambio si rompe? Propone soluzioni normative?»',
    cosaRestaInOmbra:
      "La lettura per obbedienza sposta l'intervento sul bambino (rinforzo del comportamento corretto) invece che sul campo (creazione delle condizioni perché la normatività emerga dall'interno). Le conseguenze pratiche sono opposte.",
  },
  {
    id: 'e4',
    asse: 'A3',
    tipo: 'Lettura morale',
    colore: '#8e44ad',
    descrizione:
      "La normatività emergente viene trasformata in una valutazione del bambino o del genitore. Il bambino «è educato» o «non ha limiti». Il genitore «mette limiti» o «non riesce a gestire». Asse 3 propone invece una lettura descrittiva: come si sta organizzando la normatività nel campo relazionale, senza giudicare nessuna delle persone coinvolte.",
    esempioMonoRegistro:
      '«Il bambino non ha limiti: il genitore non riesce a gestirlo.»',
    letturaStrutturale:
      "«Il campo non produce ancora le condizioni perché la normatività emerga dall'interno: i criteri non sono condivisi, il bambino non li ha ancora interiorizzati come propri. La domanda è: cosa nel campo impedisce questo processo?»",
    cosaRestaInOmbra:
      'La lettura morale chiude il caso: il bambino «è così» e il genitore «non sa fare». La lettura strutturale lo riapre: quali condizioni del campo possiamo modificare perché la normatività possa emergere?',
  },
];

const LETTURE_M4_CARDS: ExpandableCardData[] = LETTURE_MONO_M4.map((l) => ({
  id: l.id,
  badge: l.asse,
  color: l.asse === 'A2' ? '#2d6a4f' : '#27ae60',
  title: l.tipo,
  summary: l.descrizione,
  detail: `
    <div class="corso-section" style="background: #fdecea; border-left: 3px solid #e74c3c; padding: 12px 16px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #c0392b; margin: 0 0 6px;">Esempio mono-registro</p>
      <p style="margin: 0; font-style: italic;">${l.esempioMonoRegistro}</p>
    </div>
    <div class="corso-section" style="background: #eafaf1; border-left: 3px solid #27ae60; padding: 12px 16px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #1b8842; margin: 0 0 6px;">Lettura strutturale alternativa</p>
      <p style="margin: 0; font-style: italic;">${l.letturaStrutturale}</p>
    </div>
    <div class="corso-section" style="background: var(--corso-primary-light); border-left: 3px solid #2d6a4f; padding: 12px 16px; border-radius: var(--corso-radius-sm);">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #2d6a4f; margin: 0 0 6px;">Cosa resta in ombra</p>
      <p style="margin: 0;">${l.cosaRestaInOmbra}</p>
    </div>
  `,
}));

// ─── Annotazioni caso-guida (lente A2 + A3) ──────────────────

const SCENA_M4_HTML = `
  <p>Durante un bilancio di salute, il pediatra propone per alcuni minuti una breve situazione di lettura condivisa. Il bambino ha circa 18-24 mesi. È presente un genitore. Sul tavolo c'è un piccolo libro illustrato con immagini semplici: animali, oggetti familiari, figure umane.</p>
  <p>Il bambino prende il libro, lo apre, guarda alcune immagini, <span class="corso-anno" data-anno-id="m4-a1">indica una figura, vocalizza qualcosa e guarda l'adulto.</span> <span class="corso-anno" data-anno-id="m4-a2">Il genitore nomina l'immagine, sorride, aspetta.</span> <span class="corso-anno" data-anno-id="m4-a3">Il bambino torna a guardare il libro,</span> <span class="corso-anno" data-anno-id="m4-a4">gira pagina,</span> poi <span class="corso-anno" data-anno-id="m4-a5">mostra un'altra figura all'adulto.</span></p>
`;

const ANNOTAZIONI_M4 = [
  {
    id: 'm4-a1',
    estratto: "indica una figura, vocalizza qualcosa e guarda l'adulto",
    label: 'Cerca il soggetto',
    colore: '#2d6a4f',
    annotazione:
      "«Guarda l'adulto» — non guarda la mano, non guarda dove sta andando, non guarda il risultato dell'azione. Guarda il volto. È la domanda di A2 in azione: il bambino cerca nell'adulto un soggetto che abbia la propria risposta all'immagine indicata — non un'eco, non una macchina di conferma. Cerca l'altro come altro.",
    asse: "A2 — Riconoscimento dell'alterità",
  },
  {
    id: 'm4-a2',
    estratto: "Il genitore nomina l'immagine, sorride, aspetta",
    label: 'Soggetto + struttura',
    colore: '#2d8a6f',
    annotazione:
      "«Aspetta» — non solo nomina e sorride: aspetta. L'aspettare del genitore non è silenzio passivo: è il modo in cui il genitore si posiziona come soggetto che riconosce il bambino come iniziatore (A2). E insieme (A3): offre la struttura normativa dello scambio — «ora tocca a te riprendere» — senza imporla. La normatività è offerta, non prescritta.",
    asse: 'A2 + A3 — Riconoscimento e normatività intrecciati',
  },
  {
    id: 'm4-a3',
    estratto: 'Il bambino torna a guardare il libro',
    label: 'Il turno torna',
    colore: '#27ae60',
    annotazione:
      "«Il bambino torna a guardare il libro» — raccoglie il turno che il genitore ha restituito. Questo è A3 visibile come normatività emergente: nessuno ha detto al bambino che ora tocca a lui riprendere — lui sa che tocca a lui perché la struttura dello scambio lo indica dall'interno. Il turno non è assegnato: è riconosciuto.",
    asse: "A3 — Normatività emergente: il turno riconosciuto dall'interno",
  },
  {
    id: 'm4-a4',
    estratto: 'gira pagina',
    label: 'Iniziativa nel campo condiviso',
    colore: '#27ae60',
    annotazione:
      "«Gira pagina» — non chiede permesso, non aspetta istruzioni. Ma non è nemmeno indifferente al campo: il bambino sa (A3) che girare pagina è un'azione legittima in questo scambio, e sa (A2) che il genitore avrà la propria risposta alla nuova pagina. L'iniziativa è autonoma e relazionale insieme.",
    asse: 'A3 — Iniziativa normativa autonoma nel campo condiviso',
  },
  {
    id: 'm4-a5',
    estratto: "mostra un'altra figura all'adulto",
    label: 'Il ciclo si rinnova',
    colore: '#2d8a6f',
    annotazione:
      "«Mostra un'altra figura all'adulto» — il ciclo si rinnova: indicare → aspettare la risposta soggettiva → riprendere. La struttura dello scambio è stabile non perché imposta, ma perché entrambi la riconoscono dall'interno (A3). E il bambino cerca di nuovo il soggetto (A2): non mostra la figura a se stesso — la mostra all'adulto che avrà la propria risposta.",
    asse: 'A2 + A3 — Il ciclo come normatività fra soggetti',
  },
];

// ─── Sintesi ciclo alternanza ────────────────────────────────

interface PassoCiclo {
  passo: number;
  attore: string;
  azione: string;
  asse: string;
  asseColore: string;
  note: string;
}

const SCHEMA_CICLO: PassoCiclo[] = [
  {
    passo: 1,
    attore: 'Bambino',
    azione: "Indica e guarda l'adulto",
    asse: 'A2',
    asseColore: '#2d6a4f',
    note: 'Cerca il soggetto — non il robot di risposta',
  },
  {
    passo: 2,
    attore: 'Genitore',
    azione: 'Nomina, sorride, aspetta',
    asse: 'A2 + A3',
    asseColore: '#2d8a6f',
    note: 'Risponde come soggetto (A2) e offre la struttura (A3)',
  },
  {
    passo: 3,
    attore: 'Bambino',
    azione: 'Torna al libro, gira pagina',
    asse: 'A3',
    asseColore: '#27ae60',
    note: "Raccoglie il turno riconoscendo la struttura dall'interno",
  },
  {
    passo: 4,
    attore: 'Bambino',
    azione: "Mostra un'altra figura",
    asse: 'A2 + A3',
    asseColore: '#2d8a6f',
    note: 'Rinnova il ciclo: cerca ancora il soggetto nella struttura condivisa',
  },
];

// =============================================================
// Slide
// =============================================================

export const Module04: Module = {
  id: 'm04',
  number: 4,
  title: 'Assi 2 e 3 — Alterità e normatività',
  shortTitle: 'Assi 2-3',
  accent: '#2d6a4f',
  slides: [
    // ─── 4.1 ──────────────────────────────────────────────
    {
      id: 'm04-s01',
      type: 'standard',
      title: 'Dall\'indistinto al riconoscimento',
      subtitle: 'Asse 2 descrive una delle trasformazioni strutturali più decisive dello sviluppo',
      content: `
        <div class="corso-section">
          <p>Prima di presentare Asse 2, il problema che descrive: lo sviluppo inizia in un campo in cui non c'è ancora un «altro» riconoscibile come soggetto con la propria esperienza. Il bambino piccolo non è in relazione con qualcuno: è in un campo. La trasformazione che Asse 2 descrive non è «acquisire abilità sociali» — è qualcosa di più radicale: la comparsa dell'altro come soggetto nell'orizzonte del bambino.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 8px; align-items: stretch; margin: 24px 0;">
          ${MODALITA_RELAZIONE.map((m, i) => `
            <div style="background: ${m.sfondo}; border: 1px solid ${m.colore}; border-radius: var(--corso-radius-md); padding: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <span style="background: ${m.colore}; color: white; font-size: 0.8rem; font-weight: 700; padding: 4px 10px; border-radius: 4px;">${m.nome}</span>
                ${m.asseChip ? `<span style="background: ${m.colore}; color: white; font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 3px;">${m.asseChip}</span>` : ''}
              </div>
              <p style="margin: 0 0 12px; font-size: 0.92rem;">${m.descrizione}</p>
              <div style="background: var(--corso-surface); padding: 8px 12px; border-radius: var(--corso-radius-sm);">
                <p style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 4px;">Come si vede</p>
                <p style="margin: 0; font-size: 0.85rem; font-style: italic;">${m.osservabile}</p>
              </div>
            </div>
            ${i < MODALITA_RELAZIONE.length - 1 ? '<div style="display: flex; align-items: center; justify-content: center; color: var(--corso-text-muted); font-size: 1.4rem;">→</div>' : ''}
          `).join('')}
        </div>

        <p class="corso-narrative__caption" style="text-align: center;">Direzione dello sviluppo — non una tappa da superare: una struttura in progressiva organizzazione.</p>
      `,
      notes:
        "Le tre modalità non sono stadi sequenziali che si attraversano e si lasciano: sono configurazioni che coesistono. Un bambino di 18 mesi può mostrare tutte e tre a seconda del campo, del momento, dell'adulto. Asse 2 chiede: quale modalità è prevalente in questo campo in questo momento?",
    },

    // ─── 4.2 ──────────────────────────────────────────────
    {
      id: 'm04-s02',
      type: 'standard',
      title: "Asse 2 — Riconoscimento dell'alterità",
      subtitle: 'La domanda guida e il concetto chiave',
      content: `
        <blockquote class="corso-blockquote" style="border-left-color: #2d6a4f; background: #d8f3dc; font-size: 1.4rem; line-height: 1.5; text-align: center; padding: 24px 22px;">
          «${A2.domandaGuida}»
        </blockquote>
        <p class="corso-narrative__caption" style="text-align: center; margin: 8px 0 24px;">Non «quanto è socievole il bambino?» Non «ha buone abilità relazionali?» La domanda è strutturale: come il bambino abita il campo relazionale con qualcuno che ha un'esperienza sua.</p>

        <h3 class="corso-narrative__h3">Il concetto chiave: <em>non-fusionalità</em></h3>

        <div class="corso-cards corso-cards--vertical">
          <div class="corso-card corso-card--open" style="--corso-card-accent: #2d6a4f;">
            <div class="corso-card__head"><span class="corso-card__title">Definizione</span></div>
            <div class="corso-card__body">
              <p>La non-fusionalità non è freddezza, distanza o autonomia precoce. È la capacità di mantenere una relazione con qualcuno che ha un'esperienza propria — diversa dalla propria — senza che questa differenza distrugga il campo. È la condizione per qualsiasi relazione che non sia fusione o uso.</p>
            </div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #2d6a4f;">
            <div class="corso-card__head"><span class="corso-card__title">Perché è strutturalmente importante</span></div>
            <div class="corso-card__body">
              <p>Un bambino che non ha ancora sviluppato la non-fusionalità non può tollerare che l'adulto abbia una prospettiva diversa dalla propria: ogni disaccordo è vissuto come abbandono o tradimento. Un bambino con non-fusionalità consolidata può vivere la differenza dell'altro come una risorsa — qualcosa che arricchisce il campo invece di minacciarlo.</p>
            </div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #e74c3c; background: #fdecea;">
            <div class="corso-card__head"><span class="corso-card__title">Confusione frequente</span></div>
            <div class="corso-card__body">
              <p>Confondere la non-fusionalità con l'autonomia: un bambino «autonomo» può essere semplicemente in modalità «uso» — tratta l'adulto come strumento efficiente. La non-fusionalità riguarda la <strong>qualità</strong> della relazione, non la <strong>quantità</strong> di dipendenza.</p>
            </div>
          </div>
        </div>

        <hr class="corso-divider" />

        <div class="corso-section" style="background: var(--corso-primary-light); border-left: 4px solid #1a6b8a; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
          <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Perché A2 presuppone A1</p>
          <p style="margin: 0;">Solo un soggetto incarnato può riconoscere un altro soggetto incarnato. Asse 2 presuppone Asse 1: se il bambino non abita la propria esperienza come soggetto, non può riconoscere nell'altro un soggetto con la propria esperienza. La relazione fra i due assi non è solo logica — è fenomenologica: è attraverso il proprio corpo in relazione che il bambino incontra il corpo dell'altro come soggetto.</p>
        </div>
      `,
      guardrail: { code: 'G-A2', label: 'Guardrail Asse 2', text: A2.guardrail },
      notes:
        "«Non-fusionalità» non significa distanza affettiva. Un bambino molto attaccato al genitore, che lo cerca e lo vuole vicino, può avere una non-fusionalità ben sviluppata — se cerca nel genitore un soggetto con la propria risposta. Un bambino apparentemente «indipendente» può essere in modalità «uso» — tratta l'adulto come strumento efficiente senza riconoscerne l'interiorità.",
    },

    // ─── 4.3 ──────────────────────────────────────────────
    {
      id: 'm04-s03',
      type: 'standard',
      title: 'Asse 3 — Normatività emergente',
      subtitle: "Non la norma che viene dall'esterno — quella che emerge dall'interno del campo",
      content: `
        <blockquote class="corso-blockquote" style="border-left-color: #27ae60; background: #eafaf1; font-size: 1.4rem; line-height: 1.5; text-align: center; padding: 24px 22px;">
          «${A3.domandaGuida}»
        </blockquote>

        <div class="corso-two-col" style="grid-template-columns: 35% 65%; gap: 20px; align-items: start;">
          <div>
            <h3 class="corso-narrative__h3">Cosa significa «emergenza»</h3>
            <p>«Emergenza» non è metafora: descrive un processo strutturale preciso. La normatività emerge quando il bambino non segue semplicemente una regola imposta dall'esterno — sviluppa internamente la capacità di orientare la propria azione secondo criteri che sono condivisi con l'altro. Non è apprendimento di regole: è costituzione interna di un orientamento.</p>

            <div class="corso-section" style="background: #fdecea; border-left: 3px solid #e74c3c; padding: 12px 16px; border-radius: var(--corso-radius-sm); margin-top: 12px;">
              <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #c0392b; margin: 0 0 6px;">A3 non è</p>
              <ul style="margin: 0; padding-left: 18px; font-size: 0.9rem;">
                <li>Obbedienza: seguire regole imposte per evitare conseguenze</li>
                <li>Conformità: adattarsi al comportamento degli altri per accettazione</li>
                <li>Apprendimento di norme: memorizzare cosa è permesso</li>
                <li>Morale: il giudizio su ciò che è bene o male è un livello successivo</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 class="corso-narrative__h3">Tre forme in cui la normatività emerge</h3>
            <div class="corso-cards corso-cards--vertical">
              ${TRE_FORME_NORMATIVITA.map((f, i) => `
                <div class="corso-card corso-card--open" style="--corso-card-accent: #27ae60;">
                  <div class="corso-card__head">
                    <span class="corso-card__badge" style="background: #27ae60;">${i + 1}</span>
                    <span class="corso-card__title">${f.nome}</span>
                  </div>
                  <div class="corso-card__body">
                    <p style="margin: 0 0 8px; font-size: 0.92rem;">${f.descrizione}</p>
                    <p style="margin: 0 0 8px; font-size: 0.88rem; font-style: italic; color: var(--corso-text-2);"><strong>Esempio</strong> · ${f.esempio}</p>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--corso-text-muted);"><strong>Visibile quando</strong> · ${f.visibileQuando}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <hr class="corso-divider" />

        <div class="corso-section" style="background: var(--corso-primary-light); border-left: 4px solid #1a6b8a; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
          <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Perché A3 presuppone A1 e A2</p>
          <p style="margin: 0;">Asse 3 presuppone sia Asse 1 sia Asse 2. Non si può sviluppare la capacità di orientare l'azione secondo criteri condivisi senza: <strong>(a)</strong> abitare la propria esperienza come soggetto (A1) — perché i criteri devono essere interiorizzati da un soggetto, non solo eseguiti da un organismo; <strong>(b)</strong> riconoscere l'altro come portatore di esperienza propria (A2) — perché i criteri sono condivisi con qualcuno che ha la propria prospettiva sul «modo giusto» di fare le cose.</p>
        </div>
      `,
      guardrail: { code: 'G-A3', label: 'Guardrail Asse 3', text: A3.guardrail },
      notes:
        "La «differenza chiave» fra norma esterna e normatività emergente è approfondita nella slide successiva. Questa slide stabilisce solo il livello strutturale di A3: non il comportamento del bambino rispetto alle regole, ma il processo interno attraverso cui si organizzano i criteri condivisi.",
    },

    // ─── 4.4 ──────────────────────────────────────────────
    {
      id: 'm04-s04',
      type: 'standard',
      title: 'Norma imposta e normatività emergente',
      subtitle: "Una distinzione che cambia l'oggetto di osservazione",
      content: `
        <p>La distinzione non è che la norma esterna sia sbagliata e la normatività emergente sia giusta. In molti contesti le norme esterne sono necessarie e utili. La distinzione riguarda <strong>l'oggetto di osservazione</strong>: Asse 3 guarda alla normatività emergente — quella che il bambino sviluppa dall'interno del campo. Una lettura che vede solo la norma esterna lascia in ombra questo livello.</p>

        <table class="corso-table" style="margin-top: 12px;">
          <thead>
            <tr>
              <th style="width: 24%;">Aspetto</th>
              <th style="width: 38%;"><span style="display: inline-block; background: #718096; color: white; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 3px; margin-right: 6px;">EST</span>Norma imposta (esterna)</th>
              <th style="width: 38%;"><span style="display: inline-block; background: #27ae60; color: white; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 3px; margin-right: 6px;">A3</span>Normatività emergente</th>
            </tr>
          </thead>
          <tbody>
            ${NORMA_VS_NORMATIVITA.map((r) => {
              const isExample = r.id === 'd6';
              const rowClass = isExample ? ' class="corso-table__row--highlight"' : '';
              return `<tr${rowClass}><td><strong>${r.aspetto}</strong></td><td>${r.normaEsterna}</td><td>${r.normativitaEmergente}</td></tr>`;
            }).join('')}
          </tbody>
        </table>

        <hr class="corso-divider" />

        <div class="corso-box" style="border-left: 4px solid #2d6a4f; background: var(--corso-surface); padding: 16px 20px; border-radius: var(--corso-radius-sm);">
          <p style="margin: 0; font-size: 1rem; line-height: 1.6;">L'utilità in supervisione: quando un'équipe discute «come far rispettare le regole a questo bambino», la distinzione fra norma esterna e normatività emergente sposta la domanda verso «quali condizioni di campo permettono alla normatività di emergere dall'interno?» — un punto di vista diverso, con conseguenze pratiche differenti.</p>
        </div>
      `,
      notes:
        "L'uso più potente di questa distinzione è nelle situazioni di apparente «trasgressione»: prima di chiedere «perché il bambino non rispetta la regola?» chiediamoci «la struttura dello scambio in questo campo è abbastanza riconoscibile dall'interno perché la normatività possa emergere?»",
    },

    // ─── 4.5 ──────────────────────────────────────────────
    {
      id: 'm04-s05',
      type: 'diagram',
      title: 'Perché A3 dipende da A2',
      subtitle: 'I criteri condivisi sono condivisi con qualcuno',
      content: `
        <div class="corso-two-col" style="grid-template-columns: 55% 45%; gap: 20px;">
          <div>
            <p style="font-size: 1.1rem; line-height: 1.6; font-weight: 500; color: var(--corso-text);">I criteri condivisi di Asse 3 sono condivisi <em>con qualcuno</em>. Quel qualcuno deve essere riconosciuto come soggetto con la propria esperienza — Asse 2. Senza il riconoscimento dell'altro come portatore di esperienza propria, i «criteri condivisi» diventano regole di coordinazione — non normatività emergente.</p>

            <div class="corso-section" style="background: #fdecea; border-left: 3px solid #e74c3c; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-top: 16px;">
              <p style="font-weight: 700; color: #c0392b; margin: 0 0 8px;">Senza Asse 2: coordinazione, non normatività</p>
              <p style="margin: 0 0 10px;">Un bambino che segue le regole di scambio senza riconoscere l'altro come soggetto con la propria esperienza non sta sviluppando normatività: sta apprendendo la forma esteriore dello scambio senza la sua struttura interna. È la differenza fra «so che bisogna aspettare il turno» e «aspetto perché l'altro ha qualcosa da dire che è suo».</p>
              <ul style="margin: 0; padding-left: 18px; font-size: 0.88rem; font-style: italic;">
                <li style="margin-bottom: 6px;">Il bambino che aspetta il turno in modo meccanico — senza guardare l'adulto, senza registrare la risposta — mostra la forma di A3 senza il sostegno di A2.</li>
                <li>Il bambino che si adegua alle regole del gruppo per evitare conflitti — senza mostrare interesse per l'esperienza degli altri — mostra compliance (norma esterna) senza normatività emergente (A3) e senza riconoscimento dell'alterità (A2).</li>
              </ul>
            </div>

            <div class="corso-section" style="background: #eafaf1; border-left: 3px solid #27ae60; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-top: 12px;">
              <p style="font-weight: 700; color: #1b8842; margin: 0 0 8px;">Con Asse 2: normatività come incontro di soggetti</p>
              <p style="margin: 0 0 10px;">Quando A2 è presente, i criteri condivisi hanno una qualità diversa: sono criteri condivisi con qualcuno che ha la propria prospettiva. Aspettare il turno non è seguire una regola — è fare spazio all'altro perché l'altro ha qualcosa di suo da portare.</p>
              <ul style="margin: 0; padding-left: 18px; font-size: 0.88rem; font-style: italic;">
                <li style="margin-bottom: 6px;">Il bambino che aspetta guardando il volto dell'adulto — registrando la risposta, modificando il proprio comportamento in base a essa — mostra A2 e A3 intrecciati.</li>
                <li>Nella scena di lettura: il bambino indica, guarda l'adulto, aspetta. L'attesa non è meccanica: il bambino guarda il volto del genitore, aspettando una risposta soggettiva — non una conferma automatica.</li>
              </ul>
            </div>
          </div>

          <div>
            <div class="corso-cards corso-cards--vertical">
              <div class="corso-card corso-card--open" style="--corso-card-accent: #6c63ff; background: #f0eeff;">
                <div class="corso-card__head">
                  <span class="corso-card__badge" style="background: #6c63ff;">A1</span>
                  <span class="corso-card__title">Incarnato</span>
                </div>
                <div class="corso-card__body">
                  <p style="margin: 0; font-style: italic; font-size: 0.9rem;">Abitare l'esperienza</p>
                </div>
              </div>
              <div style="text-align: center; color: var(--corso-text-muted); font-size: 0.78rem;">↓ <em>fonda</em></div>
              <div class="corso-card corso-card--open" style="--corso-card-accent: #2d6a4f; background: #d8f3dc;">
                <div class="corso-card__head">
                  <span class="corso-card__badge" style="background: #2d6a4f;">A2</span>
                  <span class="corso-card__title">Alterità</span>
                </div>
                <div class="corso-card__body">
                  <p style="margin: 0; font-style: italic; font-size: 0.9rem;">Riconoscere l'altro come soggetto</p>
                </div>
              </div>
              <div style="text-align: center; color: var(--corso-text-muted); font-size: 0.78rem;">↓ <em>rende possibile</em></div>
              <div class="corso-card corso-card--open" style="--corso-card-accent: #27ae60; background: #eafaf1;">
                <div class="corso-card__head">
                  <span class="corso-card__badge" style="background: #27ae60;">A3</span>
                  <span class="corso-card__title">Normatività</span>
                </div>
                <div class="corso-card__body">
                  <p style="margin: 0; font-style: italic; font-size: 0.9rem;">Criteri condivisi con un soggetto</p>
                </div>
              </div>
            </div>

            <p class="corso-narrative__caption" style="margin-top: 16px;">La catena A1→A2→A3 non è cronologica: i tre assi sono sempre compresenti. La dipendenza strutturale è però reale: se A2 è fragile in un campo, la normatività che emerge in quel campo non ha la qualità di A3 — è coordinazione.</p>
          </div>
        </div>
      `,
      notes:
        "Nella pratica clinica: quando un bambino mostra difficoltà nel rispettare i criteri dello scambio (A3 fragile), la domanda di A2 va sempre posta prima — il bambino sta riconoscendo l'altro come soggetto con la propria prospettiva? Se no, lavorare sulla qualità del campo relazionale (A2) è il passaggio che può rendere possibile l'emergenza della normatività (A3).",
    },

    // ─── 4.6 ──────────────────────────────────────────────
    {
      id: 'm04-s06',
      type: 'interactive',
      title: 'Quattro letture mono-registro da riconoscere',
      subtitle: 'Due per asse — le più frequenti nel lavoro professionale',
      intro: `
        <p>Quando A2 e A3 non vengono tematizzati esplicitamente, lo sguardo si dispone naturalmente lungo registri specifici — empatia, compliance sociale, obbedienza, valutazione morale. Riconoscere questi registri non è criticarli: serve a renderli visibili come scelte interpretative, e a tenere aperta la possibilità di letture strutturali complementari.</p>
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          <span style="display: inline-flex; align-items: center; gap: 6px; background: #2d6a4f; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px;">A2 — Affettivo-morale</span>
          <span style="display: inline-flex; align-items: center; gap: 6px; background: #27ae60; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px;">A3 — Normativo-educativo</span>
        </div>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: LETTURE_M4_CARDS,
        layout: 'grid',
      },
      content: `
        <hr class="corso-divider" />
        <p class="corso-emph corso-emph--center" style="font-size: 1.05rem;">Nessuna di queste letture è incompetente: sono linguaggi professionali legittimi che servono a scopi precisi. Diventano mono-registro quando non c'è un livello strutturale da cui leggerle — quando la «compliance sociale» è tutto ciò che si vede, e il riconoscimento dell'alterità resta in ombra.</p>
      `,
      notes:
        "Un esercizio utile in formazione: prendere una descrizione di un bambino scritta con linguaggio di A2 stretto a empatia o compliance, e riscriverla con la domanda strutturale di A2. La riscrittura non cambia i fatti — cambia cosa si ritiene rilevante osservare, e quindi cosa diventa possibile fare.",
    },

    // ─── 4.7 ──────────────────────────────────────────────
    {
      id: 'm04-s07',
      type: 'narrative',
      title: 'La scena di lettura — vista da A2 e A3',
      subtitle: 'Il turn-taking come finestra su due strutture simultanee',
      intro: `
        <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 12px;">
          <span style="display: inline-flex; align-items: center; background: #2d6a4f; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px;">A2 — Alterità</span>
          <span style="display: inline-flex; align-items: center; background: #2d8a6f; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px;">A2 + A3 — Intrecciati</span>
          <span style="display: inline-flex; align-items: center; background: #27ae60; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px;">A3 — Normatività</span>
        </div>
      `,
      interactive: {
        kind: 'annotated-scene',
        sceneHtml: SCENA_M4_HTML,
        annotations: ANNOTAZIONI_M4,
        istruzione: 'Clicca sulle frasi evidenziate per leggere la scena attraverso A2 e A3.',
      },
      content: `
        <hr class="corso-divider" />
        <h3 class="corso-narrative__h3">Il ciclo in quattro passi</h3>
        <table class="corso-table">
          <thead>
            <tr><th style="width: 8%;">Passo</th><th style="width: 18%;">Attore</th><th style="width: 28%;">Azione</th><th style="width: 14%;">Asse</th><th>Note</th></tr>
          </thead>
          <tbody>
            ${SCHEMA_CICLO.map((p) => `
              <tr>
                <td><strong>${p.passo}</strong></td>
                <td>${p.attore}</td>
                <td>${p.azione}</td>
                <td><span style="display: inline-block; background: ${p.asseColore}; color: white; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 3px;">${p.asse}</span></td>
                <td style="font-size: 0.9rem; color: var(--corso-text-2);">${p.note}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p class="corso-narrative__caption" style="margin-top: 12px;">Questo ciclo di quattro passi è la manifestazione più chiara di A2 e A3 intrecciati nella scena. Non è un'analisi astratta: è leggibile da qualsiasi professionista che sappia dove guardare. La chiave è spostare l'attenzione dal «cosa fa il bambino» al «come è strutturato lo scambio fra bambino e adulto».</p>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3" style="text-align: center;">La stessa scena — due tipi di lettura</h3>
        <div class="corso-two-col">
          <div class="corso-box" style="border-left: 3px solid #c0392b; background: #fdecea; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #c0392b;">Senza A2 e A3</div>
            <p style="font-style: italic; margin: 8px 0;">«Il bambino mostra buone abilità comunicative: usa il pointing, vocalizza, aspetta il turno. Il genitore risponde in modo adeguato.»</p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
              <span style="background: #e74c3c; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">comportamentale</span>
              <span style="background: #c0392b; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">individuale</span>
              <span style="background: #e67e22; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">abilità come traguardo</span>
            </div>
          </div>
          <div class="corso-box corso-box--valid" style="border-color: #2d6a4f; background: #d8f3dc;">
            <div class="corso-box__title" style="color: #2d6a4f;">Con A2 e A3</div>
            <p style="font-style: italic; margin: 8px 0;">«Il bambino cerca nell'adulto un soggetto che abbia la propria risposta all'immagine (A2). Lo scambio si organizza secondo una struttura di turni che nessuno ha imposto — emersa dall'interno del campo (A3). Normatività e riconoscimento sono intrecciati: il turno è riconosciuto perché l'altro è riconosciuto.»</p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
              <span style="background: #2d6a4f; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">strutturale</span>
              <span style="background: #2d8a6f; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">configurazionale</span>
              <span style="background: #27ae60; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">normatività come incontro</span>
            </div>
          </div>
        </div>

        <p class="corso-narrative__caption" style="text-align: center; margin-top: 20px;">Nel Modulo 5 leggeremo la stessa scena attraverso Assi 4 e 5: il limite che il libro pone (non ha infinite pagine, le immagini non rispondono come vuole il bambino) e il desiderio che orienta la direzione dello scambio oltre il presente.</p>

        <div style="text-align: center; margin-top: 16px;">
          <span style="display: inline-block; padding: 8px 16px; border: 1px solid var(--corso-border); border-radius: var(--corso-radius-sm); color: var(--corso-text-2); font-size: 0.9rem;">→ Modulo 5 — Assi 4 e 5: Limite reale e desiderio</span>
        </div>
      `,
      notes:
        "L'alternanza dei turni è un fenomeno osservabile da qualsiasi professionista — senza strumenti, senza scale, senza protocolli. La chiave è sapere cosa guardare: non la frequenza dei turni, non la loro durata, ma la qualità — se il bambino cerca il soggetto o l'eco, se la struttura emerge dall'interno o è imposta dall'esterno.",
    },
  ],
};
