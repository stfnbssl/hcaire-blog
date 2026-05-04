import type { ExpandableCardData, Module } from '../types';
import { SEI_ASSI, SEI_ASSI_BY_ID } from '../sei-assi';

// =============================================================
// Modulo 7 — Statuto epistemologico e passaggio a F2
// =============================================================

// ─── Tre proprietà della lettura strutturale ─────────────────

interface ProprietaStruttura {
  id: string;
  nome: string;
  sottotitolo: string;
  descrizione: string;
  esempioCorretto: string;
  esempioScorretto: string;
  percheConta: string;
}

const TRE_PROPRIETA: ProprietaStruttura[] = [
  {
    id: 'p1',
    nome: 'Relazionale',
    sottotitolo: 'La lettura è sempre del campo, mai del bambino isolato',
    descrizione:
      "Una lettura strutturale descrive il campo — il sistema relazionale composto da bambino, adulto, oggetti, spazio, tempo. Non è possibile produrre una lettura strutturale F1 di un bambino isolato: non esistono assi «del bambino», esistono assi «del campo».",
    esempioCorretto:
      'Il campo della lettura condivisa mostra A1 attivo: il bambino abita corporalmente lo spazio del libro.',
    esempioScorretto: 'Il bambino mostra un buon livello di A1.',
    percheConta:
      'Questa proprietà preserva l\'ampiezza dello sguardo: F1 non produce profili individuali. Produce letture di campo.',
  },
  {
    id: 'p2',
    nome: 'Non-valutativa',
    sottotitolo: 'Gli assi non misurano: illuminano struttura',
    descrizione:
      "La presenza o assenza di un asse nel campo non è una valutazione positiva o negativa. A6 molto visibile non è «meglio» di A6 poco visibile: significa che il campo ha una storia sedimentata, tutto qui. F1 non produce giudizi — produce descrizioni strutturali.",
    esempioCorretto: 'In questo campo A3 è poco visibile: le forme di scambio sono ancora in costruzione.',
    esempioScorretto: 'Questo bambino ha un A3 basso: c\'è un deficit nella normatività emergente.',
    percheConta:
      "Questa proprietà tiene F1 fuori dall'uso diagnostico improprio: non misura, non norma, non stabilisce soglie.",
  },
  {
    id: 'p3',
    nome: 'Non-causale',
    sottotitolo: 'F1 descrive strutture, non origini',
    descrizione:
      "La lettura strutturale dice come è fatto il campo adesso, non perché è fatto così. Non risponde a «perché questo bambino fa X»: risponde a «che struttura ha il campo in cui X si produce». Le spiegazioni causali appartengono ad altri framework — clinici, neurobiologici, biografici.",
    esempioCorretto: 'Il campo mostra A4 incontrato con resistenza prolungata: la discontinuità produce un orientamento intenso (A5 molto visibile).',
    esempioScorretto: 'Questo bambino incontra i limiti con difficoltà probabilmente a causa di un attaccamento ansioso.',
    percheConta:
      "Questa proprietà evita inferenze premature: F1 non spiega le cause dei fenomeni — li struttura, lasciando alle altre fasi del metodo HCAIRE il compito dell'analisi causale.",
  },
];

const PROPRIETA_CARDS: ExpandableCardData[] = TRE_PROPRIETA.map((p, i) => ({
  id: p.id,
  badge: `P${i + 1}`,
  color: '#2c3e50',
  title: p.nome,
  summary: p.sottotitolo,
  detail: `
    <div class="corso-section" style="margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Descrizione</p>
      <p style="margin: 0;">${p.descrizione}</p>
    </div>
    <div class="corso-two-col" style="margin-bottom: 12px;">
      <div class="corso-box corso-box--valid">
        <div class="corso-box__title">✓ Coerente</div>
        <p style="margin: 0; font-style: italic;">${p.esempioCorretto}</p>
      </div>
      <div class="corso-box corso-box--invalid">
        <div class="corso-box__title">✗ Non coerente</div>
        <p style="margin: 0; font-style: italic;">${p.esempioScorretto}</p>
      </div>
    </div>
    <div class="corso-section" style="background: var(--corso-primary-light); border-left: 3px solid #2c3e50; padding: 12px 16px; border-radius: var(--corso-radius-sm);">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #2c3e50; margin: 0 0 6px;">Perché conta</p>
      <p style="margin: 0; font-style: italic;">${p.percheConta}</p>
    </div>
  `,
}));

// ─── Tre limiti costitutivi di F1 ────────────────────────────

interface LimiteF1 {
  id: string;
  limite: string;
  descrizione: string;
  perchePunto: string;
  cosaFaInvece: string;
  rischio: string;
}

const LIMITI_F1: LimiteF1[] = [
  {
    id: 'l1',
    limite: 'F1 non diagnostica',
    descrizione:
      "F1 non produce diagnosi cliniche, funzionali o evolutive. Gli assi strutturali non sono criteri diagnostici: non misurano competenze, non stabiliscono soglie, non collocano il bambino in categorie nosografiche.",
    perchePunto:
      'F1 non diagnostica perché non è uno strumento diagnostico: è uno strumento di lettura ontologica. La diagnosi richiede confronto con norme, campioni, scale — F1 non lavora su quel piano. Chi vuole diagnosticare ha bisogno di altri strumenti (F2, F3, protocolli clinici specifici).',
    cosaFaInvece:
      'F1 produce una descrizione strutturale del campo che può alimentare il processo diagnostico senza sostituirlo.',
    rischio:
      "Usare i sei assi come check-list («A1: presente / A3: carente») equivale a trasformare F1 in uno strumento di screening — uso scorretto che ne snatura la funzione.",
  },
  {
    id: 'l2',
    limite: 'F1 non prescrive',
    descrizione:
      "F1 non dice cosa fare. Non produce indicazioni terapeutiche, educative, riabilitative. La lettura strutturale del campo non implica automaticamente un intervento.",
    perchePunto:
      "F1 non prescrive perché la fondazione ontologica precede la decisione pratica — non la determina. Sapere che A2 è in consolidamento in un campo non dice ancora nulla su come intervenire: dipende dal contesto, dalla fase HCAIRE, dagli obiettivi specifici.",
    cosaFaInvece:
      "F1 produce la base su cui F2 può analizzare il funzionamento delle pratiche di cura, e da lì — con F3 e oltre — si costruiscono le indicazioni operative.",
    rischio:
      "Leggere una presenza debole di A5 come indicazione a «stimolare il desiderio» è un uso prescrittivo scorretto: F1 descrive, non prescrive.",
  },
  {
    id: 'l3',
    limite: 'F1 non spiega causalmente',
    descrizione:
      "F1 non risponde alla domanda «perché». Non spiega perché un bambino mostra certi pattern, non identifica cause di difficoltà, non ricostruisce catene eziologiche.",
    perchePunto:
      "F1 non spiega perché la lettura strutturale è sincronica, non diacronica: descrive come è fatto il campo adesso, non come ci è arrivato. Le spiegazioni causali — neurobiologiche, relazionali, biografiche — appartengono ad altri livelli dell'analisi HCAIRE.",
    cosaFaInvece:
      "F1 produce la struttura del campo che le spiegazioni causali potranno poi tentare di spiegare. Prima si descrive cosa c'è; poi si cerca perché c'è.",
    rischio:
      "Costruire inferenze causali dalla lettura strutturale («A4 incontrato con difficoltà → probabilmente trauma pregresso») è un salto epistemologico che F1 non autorizza.",
  },
];

const LIMITI_CARDS: ExpandableCardData[] = LIMITI_F1.map((l, i) => ({
  id: l.id,
  badge: `L${i + 1}`,
  color: '#2c3e50',
  title: l.limite,
  summary: l.descrizione,
  detail: `
    <div class="corso-section" style="background: #eafaf1; border-left: 3px solid #27ae60; padding: 12px 16px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #1b8842; margin: 0 0 6px;">Perché non è un difetto</p>
      <p style="margin: 0;">${l.perchePunto}</p>
    </div>
    <div class="corso-section" style="background: var(--corso-bg); border-left: 3px solid #4a5568; padding: 12px 16px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #4a5568; margin: 0 0 6px;">Cosa fa invece</p>
      <p style="margin: 0;">${l.cosaFaInvece}</p>
    </div>
    <div class="corso-section" style="background: #fef5ec; border-left: 3px solid #d35400; padding: 12px 16px; border-radius: var(--corso-radius-sm);">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #d35400; margin: 0 0 6px;">Rischio da evitare</p>
      <p style="margin: 0; font-style: italic;">${l.rischio}</p>
    </div>
  `,
}));

// ─── Passaggio a F2 ───────────────────────────────────────────

interface BridgeF1F2 {
  id: string;
  daF1: string;
  permetteAF2: string;
}

const BRIDGES: BridgeF1F2[] = [
  {
    id: 'c1',
    daF1: 'Il bambino come soggetto (M1)',
    permetteAF2:
      'F2 può analizzare le pratiche di cura sapendo che si rivolgono a un soggetto incarnato, relazionale e temporale — non a un organismo da riparare o a un comportamento da correggere.',
  },
  {
    id: 'c2',
    daF1: 'I sei assi strutturali (M2-M6)',
    permetteAF2:
      "F2 ha un vocabolario preciso per descrivere cosa accade nel campo quando una pratica di cura interviene: quali assi attiva, quali lascia in ombra, come modifica la struttura relazionale.",
  },
  {
    id: 'c3',
    daF1: 'Lo statuto epistemologico (M7)',
    permetteAF2:
      'F2 sa di lavorare su letture strutturali, non su diagnosi. Può analizzare le pratiche senza pretendere di spiegarne le cause o prescriverne i risultati.',
  },
];

const DOMANDE_F2 = [
  'Come si struttura questa pratica di cura nel campo degli assi?',
  "Quali assi la pratica di cura attiva, rafforza o lascia in ombra?",
  "Come si trasforma il campo prima, durante e dopo l'intervento?",
  'Il setting di cura crea le condizioni per i sei assi o ne ostacola qualcuno?',
];

const DOMANDE_F3_OLTRE = [
  'Questa pratica è efficace per questo bambino?',
  'Qual è il trattamento indicato?',
  "Come si modifica la diagnosi alla luce dell'osservazione?",
];

// ─── Tre scenari per il guardrail ─────────────────────────────

interface ScenarioGuardrail {
  id: string;
  contesto: string;
  violazione: string;
  compliance: string;
  cosaCambia: string;
}

const SCENARI_GUARDRAIL: ScenarioGuardrail[] = [
  {
    id: 's1',
    contesto: 'Pediatra · restituzione post-visita',
    violazione:
      'Lorenzo mostra un A1 buono ma A3 in fase di consolidamento. Il desiderio (A5) è presente ma non ancora ben strutturato.',
    compliance:
      "Il campo della visita pediatrica mostra un bambino che abita corporalmente lo spazio (A1 attivo) in un contesto per lui nuovo, con forme di scambio ancora in costruzione con questa persona (A3 in consolidamento) e orientamento prevalente verso l'uscita (A5 verso il limite della situazione). Non c'è nulla di patologico: è la struttura di un campo di primo incontro.",
    cosaCambia:
      'La violazione descrive il bambino come se gli assi fossero sue proprietà permanenti. La compliance descrive il campo di questa situazione — reversibile, contestuale, strutturale.',
  },
  {
    id: 's2',
    contesto: 'Educatrice · documentazione',
    violazione:
      "Sofia è una bambina che abita bene l'esperienza ma ha ancora difficoltà con l'alterità. Fatica a riconoscere l'altro come davvero diverso da sé.",
    compliance:
      "Il campo delle attività di lettura condivisa mostra Sofia che abita corporalmente lo spazio del libro (A1 molto visibile) in un campo di alterità con l'educatrice ancora in fase di co-costruzione (A2 in consolidamento). Nelle attività individuali con materiali strutturati A2 appare più consolidata.",
    cosaCambia:
      "La violazione trasforma un'osservazione di campo in un tratto della bambina. La compliance specifica il campo e lascia aperta la variabilità contestuale.",
  },
  {
    id: 's3',
    contesto: 'Neuropsichiatra infantile · colloquio con i genitori',
    violazione:
      "Il profilo strutturale di Marco mostra A1 nella norma, A4 con qualche rigidità e A5 molto elevato. Questo potrebbe indicare una difficoltà nell'incontro con il reale.",
    compliance:
      "F1 non produce profili individuali né confronti con norme. Le letture di campo prodotte durante le osservazioni mostrano che i campi in cui Marco è inserito hanno strutture diverse: nel campo familiare A5 è molto visibile (orientamento forte verso oggetti e attività familiari), nel campo clinico A4 è più presente (molti limiti nuovi da incontrare). Queste osservazioni alimentano l'analisi ma non costituiscono di per sé un profilo diagnostico.",
    cosaCambia:
      'La violazione usa F1 per costruire un profilo — uso strutturalmente scorretto. La compliance specifica che F1 produce letture di campo plurali, non un profilo individuale.',
  },
];

const SCENARI_CARDS: ExpandableCardData[] = SCENARI_GUARDRAIL.map((s, i) => ({
  id: s.id,
  badge: `S${i + 1}`,
  color: '#2c3e50',
  title: s.contesto,
  summary: '',
  detail: `
    <div class="corso-section" style="background: #fdecea; border-left: 3px solid #c0392b; padding: 12px 16px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #c0392b; margin: 0 0 6px;">Violazione</p>
      <p style="margin: 0; font-style: italic;">${s.violazione}</p>
    </div>
    <div class="corso-section" style="background: #eafaf1; border-left: 3px solid #27ae60; padding: 12px 16px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #1b8842; margin: 0 0 6px;">Coerente con G-F1</p>
      <p style="margin: 0; font-style: italic;">${s.compliance}</p>
    </div>
    <div class="corso-section" style="background: var(--corso-primary-light); border-left: 3px solid #2c3e50; padding: 12px 16px; border-radius: var(--corso-radius-sm);">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #2c3e50; margin: 0 0 6px;">Cosa cambia</p>
      <p style="margin: 0;">${s.cosaCambia}</p>
    </div>
  `,
}));

// ─── Annotazioni caso-guida M7 (esacromatica) ────────────────

const SCENA_M7_HTML = `
  <p>Il bambino attraversa la stanza <span class="corso-anno" data-anno-id="m7-a1-1">portando il peso del corpo in avanti</span>, l'albo stretto tra le braccia. <span class="corso-anno" data-anno-id="m7-a6-1">Lo porta già orientato nel verso giusto</span>. Arriva all'educatrice e <span class="corso-anno" data-anno-id="m7-a2-1">glielo porge</span> — non lo lascia cadere, non lo lancia: lo consegna, guardandola.</p>

  <p>Si siedono. L'educatrice apre alla prima pagina. Il bambino, <span class="corso-anno" data-anno-id="m7-a6-2">prima ancora che l'immagine sia visibile</span>, emette una vocalizzazione breve. <span class="corso-anno" data-anno-id="m7-a3-1">L'educatrice risponde con la stessa intonazione</span>: hanno già un modo di cominciare. A metà lettura, <span class="corso-anno" data-anno-id="m7-a4-1">l'educatrice chiude il libro un istante</span> per aggiustare la posizione. Il bambino <span class="corso-anno" data-anno-id="m7-a5-1">tende immediatamente la mano verso il libro chiuso</span> e vocalizza verso di lei. Lei riapre. Il campo riprende.</p>

  <p>Ultima pagina. <span class="corso-anno" data-anno-id="m7-a6-3">Il bambino abbassa la voce come ha imparato a fare</span>. L'educatrice chiude. Un momento. Poi il bambino <span class="corso-anno" data-anno-id="m7-a5-2">porta il libro verso di lei ancora una volta</span> — <span class="corso-anno" data-anno-id="m7-a3-2">con la stessa forma di prima</span>, la stessa vocalizzazione ascendente. Il campo conosce questa richiesta.</p>
`;

const ANNOTAZIONI_M7 = [
  {
    id: 'm7-a1-1',
    estratto: 'portando il peso del corpo in avanti',
    label: "A1 — Abitare l'esperienza",
    colore: '#1a6b8a',
    annotazione:
      "Il peso del corpo in avanti è A1: il bambino abita corporalmente il movimento verso l'altro e verso il libro. Non è un gesto intenzionale astratto — è il campo incarnato che si orienta.",
    asse: "A1 — Abitare l'esperienza",
  },
  {
    id: 'm7-a6-1',
    estratto: 'Lo porta già orientato nel verso giusto',
    label: 'A6 — Storicità',
    colore: '#d35400',
    annotazione:
      "Portare il libro «nel verso giusto» è la storicità del campo incarnata nel gesto: le letture precedenti hanno sedimentato questa forma. Il bambino non sta imparando a tenere il libro — lo tiene già come lo ha sempre tenuto con questa educatrice.",
    asse: 'A6 — Storicità sedimentata nel gesto',
  },
  {
    id: 'm7-a2-1',
    estratto: 'glielo porge',
    label: 'A2 — Alterità',
    colore: '#2d6a4f',
    annotazione:
      "Consegnare guardando è il riconoscimento dell'alterità: il libro non viene depositato ma dato — e il bambino guarda mentre lo fa. L'educatrice è riconosciuta come alterità che riceve, non come superficie su cui appoggiare.",
    asse: 'A2 — Riconoscimento dell\'alterità',
  },
  {
    id: 'm7-a6-2',
    estratto: "prima ancora che l'immagine sia visibile",
    label: 'A6 — Anticipazione',
    colore: '#d35400',
    annotazione:
      "Vocalizzare prima che l'immagine sia visibile è la forma più pura di A6: la sequenza è già struttura del campo. Il bambino porta il futuro nel presente perché il passato glielo ha consegnato come forma.",
    asse: 'A6 — Storicità nel gesto anticipatorio',
  },
  {
    id: 'm7-a3-1',
    estratto: "L'educatrice risponde con la stessa intonazione",
    label: 'A3 — Normatività emergente',
    colore: '#27ae60',
    annotazione:
      "L'educatrice che risponde con la stessa intonazione mostra A3 in azione: hanno costruito insieme una forma di scambio riconoscibile. Non è imitazione né abitudine: è la normatività emergente del campo — una forma condivisa che entrambi riconoscono come «il nostro modo di cominciare».",
    asse: 'A3 — Normatività emergente nello scambio',
  },
  {
    id: 'm7-a4-1',
    estratto: "l'educatrice chiude il libro un istante",
    label: 'A4 — Limite reale',
    colore: '#c0392b',
    annotazione:
      "La chiusura del libro — anche momentanea, anche accidentale — è il limite reale: il campo grafico scompare, il flusso della lettura si interrompe. A4 è strutturale: non dipende dall'intenzione dell'adulto.",
    asse: 'A4 — Limite reale (anche incidentale)',
  },
  {
    id: 'm7-a5-1',
    estratto: 'tende immediatamente la mano verso il libro chiuso',
    label: 'A5 — Desiderio come orientamento',
    colore: '#8e44ad',
    annotazione:
      "La mano tesa immediatamente verso il libro chiuso è A5 nella sua forma più rapida: il desiderio si orienta verso il limite nel momento stesso in cui il limite si produce. Non c'è attesa, non c'è elaborazione — il campo si orienta.",
    asse: 'A5 — Orientamento del campo verso il polo perduto',
  },
  {
    id: 'm7-a6-3',
    estratto: 'Il bambino abbassa la voce come ha imparato a fare',
    label: 'A6 + A3 — Forma co-costruita',
    colore: '#a06a30',
    annotazione:
      "Abbassare la voce «come ha imparato a fare» è la storicità nella sua forma più intensa: una prassi del campo co-costruita lettura dopo lettura, ora incorporata. Il bambino non imita — ha fatto propria una forma del campo. La norma emergente (A3) è qui osservabile come sedimentazione storica (A6).",
    asse: 'A6 + A3 — Norma emergente sedimentata storicamente',
  },
  {
    id: 'm7-a5-2',
    estratto: 'porta il libro verso di lei ancora una volta',
    label: 'A5 — Richiesta di rilettura',
    colore: '#8e44ad',
    annotazione:
      "Portare ancora il libro dopo la chiusura finale è il desiderio orientato verso il polo significativo che ha incontrato il limite (A4). Il campo si orienta nuovamente: non verso un oggetto qualsiasi, ma verso questo libro, in questo campo, con questa persona.",
    asse: 'A5 — Riorientamento dopo il limite finale',
  },
  {
    id: 'm7-a3-2',
    estratto: 'con la stessa forma di prima',
    label: 'A3 + A6 — Stessa forma riconosciuta',
    colore: '#7da640',
    annotazione:
      "Usare «la stessa forma di prima» non è ripetizione meccanica: è la normatività emergente in azione. Il bambino sa che questa forma funziona in questo campo — la usa perché l'ha imparata come forma efficace di richiesta. Il campo la riconosce. La forma normativamente riconoscibile (A3) porta la storia delle richieste precedenti (A6).",
    asse: 'A3 + A6 — Forma normativa con storia',
  },
];

// ─── Sei verbi chiave ────────────────────────────────────────

const VERBI_CHIAVE: Record<string, string> = {
  a1: 'abitare',
  a2: 'riconoscere',
  a3: 'scambiare',
  a4: 'incontrare',
  a5: 'orientarsi',
  a6: 'situarsi',
};

// =============================================================
// Slide
// =============================================================

export const Module07: Module = {
  id: 'm07',
  number: 7,
  title: 'Statuto epistemologico e passaggio a F2',
  shortTitle: 'Epistemologia',
  accent: '#2c3e50',
  slides: [
    // ─── 7.1 ──────────────────────────────────────────────
    {
      id: 'm07-s01',
      type: 'standard',
      title: 'Prima e dopo: la stessa scena, uno sguardo diverso',
      subtitle: "Cosa è cambiato nel modo di osservare?",
      content: `
        <div class="corso-scena" style="border-left: 4px solid #2c3e50; background: var(--corso-bg); padding: 18px 22px; border-radius: var(--corso-radius-sm);">
          <p style="font-style: italic; margin: 0; line-height: 1.7; font-size: 1.05rem;">«Il bambino tende la mano verso il libro chiuso e vocalizza verso l'educatrice.»</p>
        </div>

        <div class="corso-two-col" style="margin-top: 20px;">
          <div class="corso-box" style="border-left: 3px solid #4a5568; background: var(--corso-surface); padding: 16px 20px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #4a5568;">Prima di F1</div>
            <ul style="margin: 8px 0; padding-left: 20px; font-style: italic;">
              <li>«Non vuole smettere»</li>
              <li>«È un capriccio»</li>
              <li>«Ha voglia di ancora»</li>
              <li>«Va gestito»</li>
            </ul>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
              <span style="background: #4a5568; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">comportamento</span>
              <span style="background: #718096; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">stato interno</span>
            </div>
            <p style="margin: 12px 0 0; font-size: 0.85rem; color: var(--corso-text-muted);">→ Resta in ombra: la struttura del campo</p>
          </div>

          <div class="corso-box" style="border-left: 3px solid #2c3e50; background: #eef1f4; padding: 16px 20px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #2c3e50;">Con F1</div>
            <p style="margin: 8px 0;">Il campo mostra <strong style="color: #c0392b;">A4</strong> (limite reale: libro chiuso) e <strong style="color: #8e44ad;">A5</strong> (desiderio orientato: mano tesa, vocalizzazione verso l'adulto — <strong style="color: #2d6a4f;">A2</strong> riconosciuta).</p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
              <span style="background: #2c3e50; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">struttura</span>
              <span style="background: #34495e; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">campo</span>
              <span style="background: #2d6a4f; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">relazionale</span>
            </div>
            <p style="margin: 12px 0 0; font-size: 0.85rem; color: var(--corso-text-muted);">→ Diventa visibile: la struttura del campo</p>
          </div>
        </div>

        <hr class="corso-divider" />

        <p class="corso-narrative__caption" style="text-align: center; font-size: 0.95rem;">La colonna «Prima di F1» non è caricaturale: usa le letture più comuni — quelle che ogni professionista riconosce come proprie. La colonna «Con F1» non è superiore: è semplicemente <em>diversa</em>. Non si è imparato a osservare meglio — si è imparato a osservare il campo.</p>
      `,
      notes:
        'Il modulo 7 entra dalla pratica concreta, non dalla teoria. La domanda epistemologica «che tipo di sapere stiamo producendo?» riceve una risposta indiretta: si mostra cosa cambia quando si ha F1 a disposizione. Il tono deve essere rispettoso delle letture pre-F1, non trionfalistico.',
    },

    // ─── 7.2 ──────────────────────────────────────────────
    {
      id: 'm07-s02',
      type: 'interactive',
      title: 'Il campo mostra…',
      subtitle: 'Statuto epistemologico della lettura strutturale',
      content: `
        <div style="text-align: center; padding: 30px 20px; background: var(--corso-bg); border: 2px solid #2c3e50; border-radius: var(--corso-radius-md); margin-bottom: 20px;">
          <p style="font-size: 2rem; font-weight: 700; color: #2c3e50; margin: 0 0 12px; font-style: italic;">«Il campo mostra…»</p>
          <p style="font-size: 0.95rem; color: var(--corso-text-muted); margin: 4px 0;">Non: «il bambino è…»</p>
          <p style="font-size: 0.95rem; color: var(--corso-text-muted); margin: 4px 0;">Non: «la situazione dimostra che…»</p>
          <p style="font-size: 0.95rem; color: var(--corso-text-muted); margin: 4px 0;">Non: «secondo la mia interpretazione…»</p>
        </div>

        <p style="text-align: center; font-size: 1rem; line-height: 1.6; color: var(--corso-text-2); margin: 0 0 24px;">Questa formula non è un vezzo stilistico: è una <strong>posizione epistemologica</strong>. Dire «il campo mostra» significa che la lettura strutturale si colloca fra la pura descrizione fenomenologica («ho osservato che…») e la spiegazione causale («questo succede perché…»). Né solo descrizione né spiegazione: <strong>lettura strutturale</strong>.</p>
      `,
      intro: `
        <h3 class="corso-narrative__h3" style="text-align: center;">Tre proprietà della lettura strutturale</h3>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: PROPRIETA_CARDS,
        layout: 'horizontal',
      },
      notes:
        "Il box «Il campo mostra…» è la formula-cardine di tutto F1. Le tre proprietà (relazionale / non-valutativa / non-causale) non sono separabili: insieme definiscono la posizione epistemologica del corso. La proprietà relazionale era già presente nel guardrail G-F1; le altre due sono esplicitate per la prima volta in M7.",
    },

    // ─── 7.3 ──────────────────────────────────────────────
    {
      id: 'm07-s03',
      type: 'interactive',
      title: 'Tre cose che F1 non può fare',
      subtitle: 'I limiti costitutivi — e perché non sono difetti',
      intro: `
        <div class="corso-section" style="background: #eef1f4; border-left: 4px solid #2c3e50; padding: 16px 20px; border-radius: var(--corso-radius-sm); margin-bottom: 20px;">
          <p style="margin: 0;">I limiti di F1 non sono difetti: sono <strong>scelte strutturali</strong>. F1 è uno strumento specifico — usarlo bene significa sapere dove finisce. Ogni limite ha la sua ragione (perché non è un difetto), una funzione alternativa (cosa fa invece) e un rischio specifico (cosa evitare).</p>
        </div>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: LIMITI_CARDS,
        layout: 'vertical',
      },
      notes:
        "Il campo «rischio da evitare» è il più operativo della slide: mostra concretamente cosa succede quando F1 viene usato oltre i suoi limiti. Tre casi tipici: F1 usato come check-list di screening, come fonte di prescrizioni, come strumento eziologico.",
    },

    // ─── 7.4 ──────────────────────────────────────────────
    {
      id: 'm07-s04',
      type: 'diagram',
      title: 'Il passaggio a F2',
      subtitle: "Dalla fondazione all'analisi delle pratiche di cura",
      content: `
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: stretch; margin: 16px 0 24px;">
          <div style="background: #6c63ff; color: white; padding: 24px 20px; border-radius: var(--corso-radius-md); text-align: center;">
            <div style="font-size: 2rem; font-weight: 700;">F1</div>
            <p style="margin: 4px 0 8px; font-size: 0.9rem; opacity: 0.95;">Fondazione ontologica</p>
            <p style="margin: 0; font-style: italic; font-size: 1rem;">«Il campo è…»</p>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; color: var(--corso-text-muted); font-size: 2rem;">→</div>
          <div style="background: #1a6b8a; color: white; padding: 24px 20px; border-radius: var(--corso-radius-md); text-align: center;">
            <div style="font-size: 2rem; font-weight: 700;">F2</div>
            <p style="margin: 4px 0 8px; font-size: 0.9rem; opacity: 0.95;">Analisi delle pratiche di cura</p>
            <p style="margin: 0; font-style: italic; font-size: 1rem;">«Come la cura agisce nel campo»</p>
          </div>
        </div>

        <p style="text-align: center; color: var(--corso-text-2); margin: 0 0 24px; font-style: italic;">F1 costruisce la mappa del territorio; F2 analizza come ci si muove in quel territorio con pratiche specifiche di cura.</p>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3">Cosa F1 porta a F2 — tre ponti</h3>
        <div class="corso-cards corso-cards--vertical">
          ${BRIDGES.map((b, i) => `
            <div class="corso-card corso-card--open" style="--corso-card-accent: #2c3e50;">
              <div class="corso-card__body">
                <div style="display: grid; grid-template-columns: 1fr auto 2fr; gap: 12px; align-items: center;">
                  <div>
                    <p style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 4px;">Da F1 (M${i + 1})</p>
                    <p style="margin: 0; font-weight: 700; color: #2c3e50;">${b.daF1}</p>
                  </div>
                  <div style="font-size: 1.4rem; color: var(--corso-text-muted);">→</div>
                  <div>
                    <p style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 4px;">Permette a F2</p>
                    <p style="margin: 0;">${b.permetteAF2}</p>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3">Quali domande appartengono a quale fase?</h3>
        <div class="corso-two-col">
          <div class="corso-box" style="border-left: 3px solid #1a6b8a; background: #e8f4f8; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #1a6b8a;">F2 può chiedere</div>
            <ul style="margin: 6px 0; padding-left: 18px; font-size: 0.9rem;">
              ${DOMANDE_F2.map((d) => `<li>${d}</li>`).join('')}
            </ul>
          </div>
          <div class="corso-box" style="border-left: 3px solid #2d9cdb; background: #e8f4fb; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #2d9cdb;">Solo F3 e oltre possono</div>
            <ul style="margin: 6px 0; padding-left: 18px; font-size: 0.9rem;">
              ${DOMANDE_F3_OLTRE.map((d) => `<li>${d}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="corso-section" style="background: var(--corso-bg); border: 1px dashed #2c3e50; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-top: 16px; text-align: center;">
          <p style="margin: 0; font-weight: 600; color: #2c3e50; font-size: 1.05rem;">F1 finisce dove comincia la prescrizione.</p>
        </div>
      `,
      notes:
        "F2 non viene descritto in dettaglio: il professionista sta per entrarci. Bastano la metafora (mappa/movimento) e la distinzione fra le domande di F2 e quelle di F3 e oltre. Il box conclusivo «F1 finisce dove comincia la prescrizione» è il confine epistemologico più operativo del modulo.",
    },

    // ─── 7.5 ──────────────────────────────────────────────
    {
      id: 'm07-s05',
      type: 'narrative',
      title: 'La scena letta con tutti e sei gli assi',
      subtitle: 'Una scena, una struttura completa',
      intro: `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px;">
          ${SEI_ASSI.map((a) => `
            <span style="display: inline-flex; align-items: center; gap: 6px; background: ${a.colore}; color: white; font-size: 0.74rem; font-weight: 700; padding: 4px 10px; border-radius: 4px; justify-content: center;">A${a.numero} · ${a.nomeBreve}</span>
          `).join('')}
        </div>
        <p style="text-align: center; font-size: 0.88rem; color: var(--corso-text-muted); margin: 0 0 8px;">Le annotazioni miste (A6+A3) usano un colore intermedio.</p>
      `,
      interactive: {
        kind: 'annotated-scene',
        sceneHtml: SCENA_M7_HTML,
        annotations: ANNOTAZIONI_M7,
        istruzione: 'Clicca sulle frasi evidenziate: 10 letture, tutti e sei gli assi simultaneamente attivi.',
      },
      content: `
        <hr class="corso-divider" />
        <div class="corso-section" style="background: var(--corso-primary-light); border-left: 4px solid #2c3e50; padding: 16px 20px; border-radius: var(--corso-radius-sm);">
          <p style="margin: 0 0 6px; font-weight: 600;">Tutti gli assi sono co-presenti.</p>
          <p style="margin: 0;">La sequenza con cui li hai esplorati nei moduli (A1 → A6) non è l'ordine in cui compaiono nel campo: nel campo <strong>compaiono tutti insieme</strong>. La gerarchia è strutturale (condizioni di possibilità), non osservativa (sequenza temporale).</p>
        </div>
      `,
      notes:
        "Scena più ricca del corso: 10 annotazioni, 6 assi, 2 badge doppi (A6+A3 e A3+A6). Costruita per essere vista tutta insieme come campo, non per essere analizzata asse per asse — quel lavoro è già stato fatto nei moduli precedenti.",
    },

    // ─── 7.6 ──────────────────────────────────────────────
    {
      id: 'm07-s06',
      type: 'interactive',
      title: 'Il guardrail come pratica professionale',
      subtitle: 'Tre scenari concreti — pediatra, educatrice, neuropsichiatra',
      content: `
        <div class="corso-section" style="background: #d8f3dc; border-left: 5px solid #2d6a4f; padding: 20px 24px; border-radius: var(--corso-radius-md); margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <span style="background: #2d6a4f; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 10px; border-radius: 4px;">G-F1</span>
            <span style="font-size: 1.05rem; font-weight: 600; color: #1b4332;">Guardrail fondativo del corso F1</span>
          </div>
          <p style="margin: 0; color: #1b4332; line-height: 1.6;">Ogni output di F1 deve essere utilizzabile senza descrivere il bambino come individuo isolato. Questo non significa lasciare in ombra l'individualità del bambino: significa che lo strumento F1 non produce descrizioni individuali. Produce <strong>letture di campo</strong>. Un output di F1 che descriva solo il bambino — senza il campo relazionale in cui si trova — non è coerente con la fondazione ontologica.</p>
        </div>

        <div class="corso-section" style="background: #fef9e7; border: 1px solid #f1c40f; border-radius: var(--corso-radius-sm); padding: 14px 18px; margin-bottom: 20px;">
          <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #b7950b; margin: 0 0 6px; font-weight: 700;">Test pratico</p>
          <p style="margin: 0; font-style: italic;">Prendi l'output che stai per produrre e cancella mentalmente tutti i riferimenti al bambino. Se rimane qualcosa di significativo (la struttura del campo, le relazioni fra gli assi, le condizioni di possibilità), l'output era strutturale. Se non rimane nulla, era una descrizione individuale.</p>
        </div>
      `,
      intro: `
        <h3 class="corso-narrative__h3">Tre scenari professionali</h3>
        <p class="corso-narrative__caption">Ogni card mostra una violazione tipica e la riformulazione coerente con G-F1. Apri quella più vicina alla tua pratica.</p>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: SCENARI_CARDS,
        layout: 'vertical',
      },
      notes:
        "Unica slide del corso in cui il guardrail viene applicato a tre contesti professionali distinti (pediatra, educatrice, neuropsichiatra). La riconoscibilità è il punto: non esempi astratti, ma situazioni che ogni professionista 0-6 ha già vissuto.",
    },

    // ─── 7.7 ──────────────────────────────────────────────
    {
      id: 'm07-s07',
      type: 'narrative',
      title: 'La fondazione è posta',
      subtitle: 'Sei verbi per uno sguardo diverso',
      content: `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px 24px; margin: 20px 0 12px; max-width: 720px; margin-left: auto; margin-right: auto;">
          ${SEI_ASSI.map((a) => `
            <div style="text-align: center;">
              <span style="display: inline-block; background: ${a.colore}; color: white; font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 3px; margin-bottom: 6px;">A${a.numero}</span>
              <p style="margin: 0; font-size: 1.6rem; font-weight: 600; color: ${a.colore}; letter-spacing: 0.03em; font-variant: small-caps;">${VERBI_CHIAVE[a.id]}</p>
            </div>
          `).join('')}
        </div>

        <hr class="corso-divider" />

        <div style="max-width: 640px; margin: 24px auto; text-align: center;">
          <p style="font-size: 1.15rem; line-height: 1.7; color: var(--corso-text); margin: 0 0 16px; font-weight: 500;">F1 non ha insegnato a osservare meglio.</p>
          <p style="font-size: 1.05rem; line-height: 1.7; color: var(--corso-text-2); margin: 0;">Ha insegnato a osservare diversamente: <strong>il campo invece del bambino</strong>, <strong>la struttura invece del comportamento</strong>, <strong>la lettura invece della valutazione</strong>. Questo cambiamento non si misura in competenze acquisite — si misura nelle domande che ora si pongono in modo diverso.</p>
        </div>

        <hr class="corso-divider" />

        <div style="background: var(--corso-bg); border: 2px solid #2c3e50; border-radius: var(--corso-radius-md); padding: 28px 32px; margin: 24px 0; text-align: center;">
          <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--corso-text-muted); margin: 0 0 12px;">Domanda finale</p>
          <p style="font-size: 1.4rem; line-height: 1.5; color: #2c3e50; margin: 0; font-weight: 500; font-style: italic;">«Quando osservi un bambino e un adulto leggere insieme, cosa vedi adesso che non vedevi prima?»</p>
        </div>

        <div class="corso-section" style="background: var(--corso-surface); border: 1px dashed var(--corso-border); padding: 18px 22px; border-radius: var(--corso-radius-md); margin-top: 24px;">
          <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 8px;">Verso F2</p>
          <p style="margin: 0; color: var(--corso-text-2); font-size: 0.92rem;">F2 analizzerà come le pratiche di cura si strutturano in questo campo. <strong>Porta con te il vocabolario: ne avrai bisogno.</strong></p>
          <div style="text-align: center; margin-top: 12px;">
            <span style="display: inline-block; padding: 8px 16px; border: 1px solid var(--corso-border); border-radius: var(--corso-radius-sm); color: var(--corso-text-2); font-size: 0.9rem; background: var(--corso-bg);">→ F2 — Analisi delle pratiche di cura nel campo ontologico</span>
          </div>
        </div>
      `,
      notes:
        "Slide di chiusura silenziosa. Nessun nuovo contenuto: solo la sintesi definitiva. I sei verbi nei colori dei loro assi sono l'immagine riassuntiva del corso, citabile fuori contesto. La domanda finale non è un prompt interattivo — è una domanda da lasciare aperta.",
    },
  ],
};
