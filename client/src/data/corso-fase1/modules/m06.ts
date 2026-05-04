import type { ExpandableCardData, Module } from '../types';
import { SEI_ASSI, SEI_ASSI_BY_ID } from '../sei-assi';

// =============================================================
// Modulo 6 — Asse 6 e la gerarchia strutturale completa
// =============================================================

const A6 = SEI_ASSI_BY_ID.a6;

// ─── Tre dimensioni di A6 ────────────────────────────────────

interface DimensioneA6 {
  id: string;
  nome: string;
  descrizione: string;
  osservabileNelLibro: string;
}

const TRE_DIMENSIONI_A6: DimensioneA6[] = [
  {
    id: 'd1',
    nome: 'Passato incorporato',
    descrizione:
      "Il campo porta tracce delle interazioni precedenti: il bambino che anticipa la pagina sa già cosa viene dopo non per inferenza, ma perché quella sequenza è diventata struttura del campo.",
    osservabileNelLibro:
      'La vocalizzazione che precede la pagina; il dito che punta prima che l\'immagine sia visibile; il gesto di voltare pagina che il bambino ha già interiorizzato.',
  },
  {
    id: 'd2',
    nome: 'Presente situato',
    descrizione:
      "Ogni momento è già situato: non un punto neutro ma un campo con una storia. L'albo «consumato» porta nel presente tutte le letture precedenti, materializzate nel dorso rovinato, nelle pagine con le orecchie.",
    osservabileNelLibro:
      'Il libro portato con familiarità; il modo in cui il bambino lo apre (già sa il verso); il rituale di inizio già consolidato.',
  },
  {
    id: 'd3',
    nome: 'Futuro anticipato',
    descrizione:
      "Il campo si orienta verso possibilità: il bambino che sa dove va a finire la storia orienta già il presente verso la fine. La storicità non è solo retrospettiva — è anche protensione strutturale.",
    osservabileNelLibro:
      'L\'eccitazione crescente verso le pagine «attese»; la resistenza più o meno intensa alla chiusura a seconda di quante pagine restano; il riconoscimento del finale.',
  },
];

// ─── Quattro forme di A6 nell'albo ───────────────────────────

interface FormaA6 {
  id: string;
  forma: string;
  descrizione: string;
  osservabile: string;
}

const A6_FORME: FormaA6[] = [
  {
    id: 'fl1',
    forma: 'La vocalizzazione anticipatoria',
    descrizione:
      "Il bambino vocalizza prima che la pagina successiva sia visibile. Non anticipa per inferenza cognitiva: la sequenza delle immagini è diventata struttura del campo attraverso le letture precedenti. È la storicità che si mostra nel gesto.",
    osservabile: 'La vocalizzazione che precede il voltare pagina; il gesto di indicare un\'immagine non ancora apparsa.',
  },
  {
    id: 'fl2',
    forma: 'Il libro portato con familiarità',
    descrizione:
      "Il bambino che porta all'adulto un albo già letto molte volte non trasporta solo un oggetto: porta una storia di incontri condivisi. Il modo in cui lo prende, lo tiene, lo apre — tutto mostra la sedimentazione delle esperienze precedenti.",
    osservabile: "L'orientamento corretto del libro (sa il verso); l'apertura diretta a una pagina specifica; la postura familiare nell'aprirlo.",
  },
  {
    id: 'fl3',
    forma: 'Il riconoscimento anticipato del finale',
    descrizione:
      "Nelle ultime pagine il bambino cambia tono: più eccitazione, o al contrario resistenza. Sa che sta per finire. Questo sapere non è cognitivo — è la struttura temporale del campo che orienta il presente verso un futuro già «noto».",
    osservabile: 'Il cambio di ritmo corporeo nelle ultime pagine; la resistenza alla chiusura che cresce avvicinandosi alla fine; l\'eccitazione climax per il finale atteso.',
  },
  {
    id: 'fl4',
    forma: 'Il rituale consolidato',
    descrizione:
      "La lettura condivisa non è ogni volta un inizio: ha un rituale (posto fisico, postura, tempo della giornata, frase di inizio) che porta la storia di tutte le letture precedenti. Il rituale è la forma più densa di A6: la storicità del campo istituzionalizzata in rito.",
    osservabile: "L'educatrice sa già dove si siedono; il bambino sa già cosa fare con il proprio corpo; le prime parole della lettura hanno già un tono riconosciuto.",
  },
];

// ─── Catena gerarchica completa A1-A6 ────────────────────────

interface AsseInCatena {
  id: string;
  numero: number;
  nome: string;
  colore: string;
  fonda: string;
  dipendeDa: string;
  condizioneCheOffre: string;
  domandaStrutturale: string;
}

const CATENA_COMPLETA: AsseInCatena[] = [
  {
    id: 'a1',
    numero: 1,
    nome: "Abitare l'esperienza",
    colore: '#1a6b8a',
    fonda: 'A2 — indirettamente tutti',
    dipendeDa: '—',
    condizioneCheOffre:
      "Il bambino è nel campo come soggetto incarnato: percepisce, sente, si orienta corporalmente. Senza questa fondazione, nessun altro asse ha materiale su cui operare.",
    domandaStrutturale: 'Il bambino abita questa esperienza o ne è ai margini?',
  },
  {
    id: 'a2',
    numero: 2,
    nome: 'Alterità',
    colore: '#2d6a4f',
    fonda: 'A3',
    dipendeDa: 'A1',
    condizioneCheOffre:
      "Il campo si struttura come relazione: c'è un altro riconosciuto come tale. L'alterità non è aggiunta dall'esterno ma emerge dall'incontro. Senza A2, non c'è campo relazionale in cui A3 possa emergere.",
    domandaStrutturale: "L'altro è riconosciuto come alterità o come prolungamento del sé?",
  },
  {
    id: 'a3',
    numero: 3,
    nome: 'Normatività emergente',
    colore: '#27ae60',
    fonda: 'A4 e A5',
    dipendeDa: 'A1, A2',
    condizioneCheOffre:
      "Il campo produce forme condivise di scambio: gesti, vocalizzazioni, strutture di alternanza che entrambi i partecipanti riconoscono. Senza A3, il campo non ha forma — è incontro ma non comunicazione.",
    domandaStrutturale: 'Lo scambio ha forme normativamente riconoscibili o è caotico/unidirezionale?',
  },
  {
    id: 'a4',
    numero: 4,
    nome: 'Limite reale',
    colore: '#c0392b',
    fonda: 'A5',
    dipendeDa: 'A1, A2',
    condizioneCheOffre:
      "Il campo incontra discontinuità strutturali: ciò che è e non cambia. Il limite non è imposto dall'adulto ma emerge dalla struttura del reale. Senza A4, non c'è polo verso cui il desiderio possa orientarsi.",
    domandaStrutturale: 'Il campo contiene limiti reali? Come vengono incontrati?',
  },
  {
    id: 'a5',
    numero: 5,
    nome: 'Desiderio come orientamento',
    colore: '#8e44ad',
    fonda: 'A6',
    dipendeDa: 'A4, A3',
    condizioneCheOffre:
      "Il campo mostra un orientamento strutturale verso poli significativi. Il desiderio non è mancanza interna ma tensione osservabile: il campo si dirige. Senza A5, A6 non avrebbe dove collocare la storicità — storia di cosa?",
    domandaStrutturale: 'Il campo mostra orientamento verso poli stabili? Il desiderio ha forma riconoscibile?',
  },
  {
    id: 'a6',
    numero: 6,
    nome: 'Storicità e temporalità',
    colore: '#d35400',
    fonda: '—',
    dipendeDa: 'A1, A2, A3, A4, A5',
    condizioneCheOffre:
      "Il campo è temporalmente situato: porta una storia e si orienta verso un futuro. L'osservazione non è mai un primo incontro — è sempre già inserita in una sequenza. A6 integra e situa tutti gli assi precedenti nel tempo.",
    domandaStrutturale: 'Qual è la storia di questo campo? Cosa porta con sé il momento osservato?',
  },
];

// ─── Tre equivoci sulla gerarchia ────────────────────────────

interface Equivoco {
  id: string;
  equivoco: string;
  risposta: string;
  analogia: string;
}

const TRE_EQUIVOCI: Equivoco[] = [
  {
    id: 'eq1',
    equivoco: '«A6 è l\'asse più importante perché è l\'ultimo»',
    risposta:
      "A6 è il più complesso perché dipende da tutti gli altri. Non è il più importante: è il più integrato. Senza A1, A6 non esiste.",
    analogia:
      "La volta di un arco non è la pietra più importante: è quella che tiene le altre insieme, ma dipende da ciascuna di esse.",
  },
  {
    id: 'eq2',
    equivoco: '«Un bambino che mostra molti indicatori di A6 è "più sviluppato"»',
    risposta:
      "Gli assi non misurano. La presenza osservabile di A6 non indica uno sviluppo superiore: indica che il campo ha una storia. Un bambino appena inserito in un contesto ha meno storia in quel campo — non meno struttura.",
    analogia:
      "Un libro appena aperto ha meno orecchie alle pagine di uno letto cento volte. Non è un libro migliore o peggiore.",
  },
  {
    id: 'eq3',
    equivoco: '«La gerarchia è una sequenza di sviluppo: prima A1, poi A2…»',
    risposta:
      "La gerarchia è strutturale, non temporale. Non si «completa A1 prima di passare ad A2». Tutti gli assi sono operativi dal primo incontro. La sequenza descrive dipendenze logiche, non tappe.",
    analogia:
      "Una fondazione non precede temporalmente i muri: li rende possibili. Ma in una casa finita, tutto coesiste.",
  },
];

const EQUIVOCI_CARDS: ExpandableCardData[] = TRE_EQUIVOCI.map((e) => ({
  id: e.id,
  badge: e.id.toUpperCase().replace('EQ', 'EQ '),
  color: '#d35400',
  title: e.equivoco,
  summary: '',
  detail: `
    <div class="corso-section" style="margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Risposta</p>
      <p style="margin: 0;">${e.risposta}</p>
    </div>
    <div class="corso-section" style="background: #fef9e7; border-left: 3px solid #f1c40f; padding: 12px 16px; border-radius: var(--corso-radius-sm);">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #b7950b; margin: 0 0 6px;">Analogia</p>
      <p style="margin: 0; font-style: italic;">${e.analogia}</p>
    </div>
  `,
}));

// ─── Quattro letture mono-registro di A6 ─────────────────────

interface LetturaMonoM6 {
  id: string;
  tipo: string;
  etichetta: string;
  colore: string;
  descrizione: string;
  esempioMonoRegistro: string;
  letturaStrutturale: string;
  cosaRestaInOmbra: string;
}

const LETTURE_M6: LetturaMonoM6[] = [
  {
    id: 'e1',
    tipo: 'Lettura biografica',
    etichetta: 'A6 → anamnesi e storia clinica',
    colore: '#d35400',
    descrizione:
      "La storicità strutturale viene confusa con la raccolta di informazioni biografiche: «per capire questo bambino devo sapere la sua storia». A6 non chiede di risalire al passato biografico — chiede di riconoscere che il campo porta già con sé la sua storia, osservabile nel presente.",
    esempioMonoRegistro:
      '«Prima di osservare come legge, ho bisogno di sapere da quando frequenta il nido, se ci sono stati cambiamenti in famiglia, che tipo di attaccamento ha…»',
    letturaStrutturale:
      "«Il campo porta già la propria storia: il modo in cui porta il libro, come lo apre, la vocalizzazione anticipatoria — sono tracce della storicità del campo, osservabili senza raccogliere informazioni pregresse.»",
    cosaRestaInOmbra:
      "La storicità come struttura del presente. Si cerca il passato dietro il campo, mentre A6 chiede di leggere il passato nel campo.",
  },
  {
    id: 'e2',
    tipo: 'Lettura evolutiva',
    etichetta: 'A6 → milestone e tappe di sviluppo',
    colore: '#d35400',
    descrizione:
      "La dimensione temporale di A6 viene letta come collocazione su una scala evolutiva: «a 20 mesi dovrebbe già…», «questo comportamento è tipico della fase…». A6 non è una metrica di avanzamento evolutivo: è la struttura temporale del campo specifico che osserviamo.",
    esempioMonoRegistro:
      '«La vocalizzazione anticipatoria è normale a questa età? È un indicatore di sviluppo linguistico nella norma?»',
    letturaStrutturale:
      "«La vocalizzazione anticipatoria mostra che il campo ha una storia: questo bambino in questo contesto con questi adulti ha costruito una storia di lettura condivisa. Non indica uno stadio evolutivo.»",
    cosaRestaInOmbra:
      "La specificità del campo. La domanda evolutiva è legittima ma appartiene a F2, non a F1. F1 legge la struttura del campo, non il posto del bambino su una curva normativa.",
  },
  {
    id: 'e3',
    tipo: 'Lettura eziologica',
    etichetta: 'A6 → storia come trauma o causa',
    colore: '#d35400',
    descrizione:
      "La storicità viene attivata solo quando il campo mostra difficoltà: «ha avuto questa difficoltà perché nella sua storia c'è stato X». A6 non è un asse causale: la storia del campo non spiega le difficoltà, ne mostra la struttura temporale.",
    esempioMonoRegistro:
      '«Se questo bambino fatica a stare in un\'attività di lettura, dobbiamo chiederci cosa è successo nella sua storia.»',
    letturaStrutturale:
      "«Il campo mostra una storia di incontri con la lettura condivisa che ha prodotto questa forma. La storicità non spiega — situa. Chiede: cosa porta questo campo? Non: quale evento ha causato questa difficoltà?»",
    cosaRestaInOmbra:
      "La neutralità strutturale di A6. Lo si trasforma in strumento di indagine causale quando è invece uno strumento di lettura strutturale del presente.",
  },
  {
    id: 'e4',
    tipo: 'A-storicismo',
    etichetta: "Osservazione senza storia: il «momento zero»",
    colore: '#7f3d00',
    descrizione:
      "L'altro estremo: trattare ogni osservazione come se fosse un primo incontro, senza storia. «Osservo solo quello che vedo adesso.» Questo è l'a-storicismo strutturale: lasciare in ombra il fatto che il campo porta sempre con sé una sedimentazione.",
    esempioMonoRegistro:
      '«Non voglio sapere niente di questo bambino prima di osservarlo: guardo solo quello che fa adesso, senza pregiudizi.»',
    letturaStrutturale:
      "«Non c'è osservazione senza storia: anche l'osservazione del primo incontro è già storicamente situata (chi sei tu come professionista, che storia ha il setting, cosa porta il bambino dal suo contesto di origine). A6 non è pregiudizio — è struttura.»",
    cosaRestaInOmbra:
      "La possibilità di leggere il campo come campo: ogni campo ha già una storia che è strutturalmente presente, non aggiunta dall'osservatore.",
  },
];

const LETTURE_M6_CARDS: ExpandableCardData[] = LETTURE_M6.map((l) => ({
  id: l.id,
  badge: l.id.toUpperCase(),
  color: l.colore,
  title: l.etichetta,
  summary: l.descrizione,
  detail: `
    <div class="corso-section" style="background: #fdecea; border-left: 3px solid #e74c3c; padding: 12px 16px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #c0392b; margin: 0 0 6px;">Esempio mono-registro</p>
      <p style="margin: 0; font-style: italic;">${l.esempioMonoRegistro}</p>
    </div>
    <div class="corso-section" style="background: #eafaf1; border-left: 3px solid #27ae60; padding: 12px 16px; border-radius: var(--corso-radius-sm); margin-bottom: 12px;">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #1b8842; margin: 0 0 6px;">Lettura strutturale</p>
      <p style="margin: 0; font-style: italic;">${l.letturaStrutturale}</p>
    </div>
    <div class="corso-section" style="background: var(--corso-bg); border-left: 3px solid #4a5568; padding: 12px 16px; border-radius: var(--corso-radius-sm);">
      <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #4a5568; margin: 0 0 6px;">Cosa resta in ombra</p>
      <p style="margin: 0;">${l.cosaRestaInOmbra}</p>
    </div>
  `,
}));

// ─── Annotazioni caso-guida M6 ───────────────────────────────

const SCENA_M6_HTML = `
  <p>Il bambino attraversa la stanza portando tra le braccia <span class="corso-anno" data-anno-id="m6-a6-1">l'albo con il dorso consumato</span> — quello con l'orso che dorme. <span class="corso-anno" data-anno-id="m6-a6-2">Lo porta già orientato nel verso giusto</span>, copertina in su, come ha imparato a fare. L'educatrice lo vede arrivare e <span class="corso-anno" data-anno-id="m6-a6-3">sposta già il cuscino per fare posto</span>: sa cosa viene dopo.</p>

  <p>Si siedono. L'educatrice apre alla prima pagina. Il bambino, <span class="corso-anno" data-anno-id="m6-a6-4">prima ancora che l'immagine sia completamente visibile</span>, emette una vocalizzazione breve e ascendente — già sa cosa c'è: l'orso tra gli alberi. A metà libro, arriva la pagina con la luna. <span class="corso-anno" data-anno-id="m6-a6-5">Il bambino alza il dito verso l'angolo in alto a destra</span> prima che l'educatrice dica qualcosa: è sempre lì, la luna, su quella pagina.</p>

  <p>Ultima pagina. L'orso dorme. <span class="corso-anno" data-anno-id="m6-a6-6">Il bambino abbassa la voce</span> — anche lui, come l'educatrice ha sempre fatto, come se l'orso potesse sentire. Il campo ha costruito questa forma insieme, lettura dopo lettura.</p>
`;

const ANNOTAZIONI_M6 = [
  {
    id: 'm6-a6-1',
    estratto: "l'albo con il dorso consumato",
    label: 'A6 — Storicità (oggetto)',
    colore: '#d35400',
    annotazione:
      "Il dorso consumato è la storicità del campo resa materialmente visibile: ogni lettura ha lasciato una traccia sull'oggetto. Il bambino porta non solo il libro ma tutte le letture che quel libro incorpora.",
    asse: 'A6 — Storicità incorporata nell\'oggetto',
  },
  {
    id: 'm6-a6-2',
    estratto: 'Lo porta già orientato nel verso giusto',
    label: 'A6 + A1 — Storicità incarnata',
    colore: '#a04a1a',
    annotazione:
      "Portarlo «nel verso giusto» non è una competenza acquisita astrattamente: è la forma che le letture precedenti hanno sedimentato nel campo. Il bambino ha interiorizzato la struttura dell'oggetto attraverso la ripetizione situata. La postura corretta (A1) porta in sé la storia (A6).",
    asse: 'A6 + A1 — Storicità sedimentata nel corpo',
  },
  {
    id: 'm6-a6-3',
    estratto: 'sposta già il cuscino per fare posto',
    label: 'A6 — Storicità del campo (lato adulto)',
    colore: '#d35400',
    annotazione:
      "L'educatrice che anticipa il gesto mostra la storicità del campo dal lato adulto: anche lei porta la storia delle letture precedenti. A6 non è solo nel bambino — è nel campo relazionale, nei suoi due poli.",
    asse: 'A6 — La storicità è del campo, non solo del bambino',
  },
  {
    id: 'm6-a6-4',
    estratto: "prima ancora che l'immagine sia completamente visibile",
    label: 'A6 — Vocalizzazione anticipatoria',
    colore: '#d35400',
    annotazione:
      "Vocalizzare prima che l'immagine sia visibile è la forma più pura di A6 osservabile nell'albo: la sequenza delle immagini è diventata struttura del campo. Non è memoria cognitiva — è il campo che porta la propria storia nel gesto.",
    asse: 'A6 — Storicità nel gesto anticipatorio',
  },
  {
    id: 'm6-a6-5',
    estratto: "Il bambino alza il dito verso l'angolo in alto a destra",
    label: 'A6 + A1 — Anticipazione spaziale',
    colore: '#a04a1a',
    annotazione:
      "Il dito verso l'angolo dove «sarà» la luna anticipa nello spazio un'immagine non ancora visibile. Il campo porta la struttura spaziale delle pagine passate nel momento presente: storicità incarnata.",
    asse: 'A6 + A1 — Storicità nella postura spaziale',
  },
  {
    id: 'm6-a6-6',
    estratto: 'Il bambino abbassa la voce',
    label: 'A6 + A3 — Forma co-costruita',
    colore: '#a06a30',
    annotazione:
      "Abbassare la voce come fa l'educatrice è la forma più intensa di storicità: il bambino ha incorporato una prassi del campo che non ha imparato esplicitamente, ma ha assorbito lettura dopo lettura. Il campo ha prodotto questa norma condivisa (A3) attraverso il tempo (A6).",
    asse: 'A6 + A3 — Norma emergente come sedimentazione storica',
  },
];

// ─── Helper ──────────────────────────────────────────────────

function asseChip(asseId: string): string {
  const a = SEI_ASSI_BY_ID[asseId];
  if (!a) return '';
  return `<span style="display: inline-flex; align-items: center; background: ${a.colore}; color: white; font-size: 0.74rem; font-weight: 700; padding: 3px 10px; border-radius: 4px; margin-right: 4px;">A${a.numero}</span>`;
}

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

export const Module06: Module = {
  id: 'm06',
  number: 6,
  title: 'Asse 6 e la gerarchia completa',
  shortTitle: 'Asse 6',
  accent: '#d35400',
  slides: [
    // ─── 6.1 ──────────────────────────────────────────────
    {
      id: 'm06-s01',
      type: 'standard',
      title: 'La stessa scena, una domanda diversa',
      subtitle: 'Quando è cominciato? La domanda temporale del campo',
      content: `
        <div class="corso-scena" style="border-left: 4px solid #d35400; background: #fef0e7; padding: 18px 22px; border-radius: var(--corso-radius-sm);">
          <p style="font-style: italic; margin: 0; line-height: 1.7; font-size: 1.05rem;">«Il bambino vocalizza prima ancora che l'immagine sia visibile. Sa già cosa viene dopo.»</p>
        </div>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3">Due domande a confronto</h3>
        <div class="corso-two-col" style="margin-top: 12px;">
          <div class="corso-box" style="border-left: 3px solid #c0392b; background: #fdecea; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #c0392b;">Domanda comune</div>
            <ul style="margin: 8px 0; padding-left: 20px; font-style: italic;">
              <li>«Ha buona memoria?»</li>
              <li>«È un bambino attento?»</li>
              <li>«Impara in fretta?»</li>
            </ul>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
              <span style="background: #e74c3c; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">individuali</span>
              <span style="background: #c0392b; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">competenze</span>
            </div>
          </div>

          <div class="corso-box" style="border-left: 3px solid #d35400; background: #fef0e7; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #d35400;">Domanda strutturale</div>
            <ul style="margin: 8px 0; padding-left: 20px; font-style: italic;">
              <li>«Quando è cominciato questo campo?»</li>
              <li>«Cosa porta con sé questo momento?»</li>
              <li>«Quali letture precedenti sono presenti in questo gesto?»</li>
            </ul>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
              <span style="background: #d35400; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">strutturali</span>
              <span style="background: #a04a1a; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">temporalità del campo</span>
            </div>
          </div>
        </div>

        <hr class="corso-divider" />

        <div class="corso-section" style="background: #fef0e7; border-left: 4px solid #d35400; padding: 16px 20px; border-radius: var(--corso-radius-sm);">
          <p style="margin: 0 0 8px;">La prima domanda guarda al bambino. La seconda guarda al campo nel tempo.</p>
          <p style="margin: 0; font-weight: 600; color: #d35400;">Questa differenza ha un nome: <strong>Asse 6</strong>.</p>
        </div>
      `,
      notes:
        "La slide entra deliberatamente da formulazioni comuni («ha buona memoria?») per creare il bisogno di una domanda strutturale. Le domande comuni non sono incompetenti: appartengono al piano delle competenze individuali. A6 propone un piano diverso, complementare, sulla storicità del campo.",
    },

    // ─── 6.2 ──────────────────────────────────────────────
    {
      id: 'm06-s02',
      type: 'standard',
      title: 'Asse 6 — Storicità e temporalità',
      subtitle: 'Verbo chiave: situarsi (non cominciare da zero, non istantanizzarsi, non azzerare)',
      content: `
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="display: inline-block; background: #d35400; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px; margin-right: 10px;">A6</span>
          <span style="font-size: 1.6rem; font-weight: 700; color: #d35400; letter-spacing: 0.04em;">SITUARSI</span>
          <p style="font-size: 0.85rem; color: var(--corso-text-muted); margin: 6px 0 0; font-style: italic;">≠ cominciare da zero · istantanizzarsi · azzerare · presentificare</p>
        </div>

        <blockquote class="corso-blockquote" style="border-left-color: #d35400; background: #fef0e7; font-size: 1.15rem; line-height: 1.6;">
          «La storicità è la <strong>struttura temporale del campo</strong>: il momento osservato non è mai un inizio, ma porta con sé una storia e si orienta verso un futuro possibile. Non è la biografia del bambino né la sequenza dei milestone, ma il fatto strutturale che ogni campo ha passato e futuro incorporati nel presente.»
        </blockquote>

        <div class="corso-two-col">
          <div class="corso-box corso-box--invalid">
            <div class="corso-box__title">Non è</div>
            <ul style="margin: 6px 0; padding-left: 18px; font-size: 0.9rem;">
              <li>l'anamnesi o la storia clinica del bambino</li>
              <li>la sequenza degli stadi evolutivi</li>
              <li>la memoria autobiografica del bambino</li>
              <li>il peso del trauma passato</li>
              <li>la progressione cronologica delle acquisizioni</li>
            </ul>
          </div>
          <div class="corso-box corso-box--valid" style="border-color: #d35400; background: #fef0e7;">
            <div class="corso-box__title" style="color: #d35400;">È</div>
            <ul style="margin: 6px 0; padding-left: 18px; font-size: 0.9rem;">
              <li>la struttura temporale del campo: presente che porta passato e futuro</li>
              <li>il fatto che ogni osservazione è sempre già una ri-osservazione</li>
              <li>la sedimentazione delle forme di campo precedenti</li>
              <li>l'orientamento del campo verso possibilità future</li>
              <li>una dimensione strutturale, non un contenuto biografico</li>
            </ul>
          </div>
        </div>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3">Tre dimensioni di A6</h3>
        <div class="corso-cards corso-cards--grid" style="grid-template-columns: repeat(3, 1fr); gap: 12px;">
          ${TRE_DIMENSIONI_A6.map((d, i) => `
            <div class="corso-card corso-card--open" style="--corso-card-accent: #d35400;">
              <div class="corso-card__head">
                <span class="corso-card__badge" style="background: #d35400;">${i + 1}</span>
                <span class="corso-card__title">${d.nome}</span>
              </div>
              <div class="corso-card__body">
                <p style="margin: 0 0 10px;">${d.descrizione}</p>
                <div style="background: var(--corso-bg); padding: 8px 12px; border-radius: var(--corso-radius-sm);">
                  <p style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 4px;">Osservabile nel libro</p>
                  <p style="margin: 0; font-size: 0.85rem; font-style: italic;">${d.osservabileNelLibro}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3">Quattro forme di A6 nell'albo illustrato</h3>
        <div class="corso-cards corso-cards--grid" style="grid-template-columns: repeat(2, 1fr); gap: 12px;">
          ${A6_FORME.map((f) => `
            <div class="corso-card corso-card--open" style="--corso-card-accent: #d35400;">
              <div class="corso-card__head"><span class="corso-card__title">${f.forma}</span></div>
              <div class="corso-card__body">
                <p style="margin: 0 0 10px;">${f.descrizione}</p>
                <div style="background: var(--corso-bg); padding: 8px 12px; border-radius: var(--corso-radius-sm);">
                  <p style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 4px;">Osservabile</p>
                  <p style="margin: 0; font-size: 0.85rem; font-style: italic;">${f.osservabile}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="corso-section" style="background: var(--corso-primary-light); border-left: 4px solid #1a6b8a; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-top: 16px;">
          <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Dipendenza strutturale</p>
          <p style="margin: 0;">A6 è il sesto asse perché per situarsi temporalmente il campo deve già: <strong>abitare l'esperienza (A1)</strong>, <strong>riconoscere l'alterità (A2)</strong>, <strong>scambiare forme normativamente condivise (A3)</strong>, <strong>incontrare limiti reali (A4)</strong>, <strong>orientarsi con desiderio (A5)</strong>. La storicità integra e situa tutti gli assi precedenti nel tempo.</p>
        </div>
      `,
      guardrail: { code: 'G-A6', label: 'Guardrail Asse 6', text: A6.guardrail },
      notes:
        "A6 non chiede di raccogliere la storia biografica del bambino. Chiede di riconoscere che il campo ha sempre già una storia strutturale — osservabile nel presente senza necessità di risalire al passato.",
    },

    // ─── 6.3 ──────────────────────────────────────────────
    {
      id: 'm06-s03',
      type: 'diagram',
      title: 'Sei assi. Una struttura. Un campo.',
      subtitle: 'La gerarchia strutturale completa',
      content: `
        <p style="text-align: center; font-size: 1.1rem; margin: 8px 0 24px; color: var(--corso-text); font-weight: 500;">Per la prima volta nel corso, tutti e sei gli assi appaiono insieme. La sequenza A1 → A6 descrive condizioni di possibilità, non gradi di importanza: ogni asse è condizione strutturale del successivo.</p>

        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; align-items: stretch; margin: 16px 0;">
          ${CATENA_COMPLETA.map((a) => `
            <div style="display: flex; flex-direction: column;">
              <div style="background: ${a.colore}; color: white; padding: 12px 8px; border-radius: var(--corso-radius-sm) var(--corso-radius-sm) 0 0; text-align: center;">
                <div style="font-size: 1.2rem; font-weight: 700;">A${a.numero}</div>
                <div style="font-size: 0.7rem; margin-top: 2px;">${a.nome}</div>
              </div>
              <div style="background: ${a.colore}11; border: 1px solid ${a.colore}55; border-top: none; padding: 10px 10px; flex: 1; border-radius: 0 0 var(--corso-radius-sm) var(--corso-radius-sm); font-size: 0.78rem;">
                <p style="margin: 0 0 6px;"><strong>Fonda</strong>: ${a.fonda}</p>
                <p style="margin: 0; color: var(--corso-text-2);"><strong>Dipende da</strong>: ${a.dipendeDa}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin: -8px 0 20px; text-align: center; color: var(--corso-text-muted); font-size: 0.85rem;">
          <div>↓</div><div>↓</div><div>↓</div><div>↓</div><div>↓</div><div></div>
        </div>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3">Le sei domande strutturali — una per asse</h3>
        <div class="corso-cards corso-cards--vertical">
          ${CATENA_COMPLETA.map((a) => `
            <div class="corso-card corso-card--open" style="--corso-card-accent: ${a.colore};">
              <div class="corso-card__body">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                  <span style="background: ${a.colore}; color: white; font-size: 0.74rem; font-weight: 700; padding: 3px 10px; border-radius: 4px;">A${a.numero}</span>
                  <span style="font-weight: 700; color: ${a.colore};">${a.nome}</span>
                </div>
                <p style="margin: 0 0 6px; font-style: italic; color: var(--corso-text);">«${a.domandaStrutturale}»</p>
                <p style="margin: 0; font-size: 0.88rem; color: var(--corso-text-2);">${a.condizioneCheOffre}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <hr class="corso-divider" />

        <div class="corso-section" style="background: var(--corso-bg); border-left: 4px solid #d35400; padding: 16px 20px; border-radius: var(--corso-radius-sm);">
          <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 8px;">Co-presenza nel campo</p>
          <p style="margin: 0 0 10px;">Nel campo osservato, tutti e sei gli assi sono <strong>simultaneamente attivi</strong>. Esempio: il bambino che porta il libro familiare all'educatrice mostra insieme:</p>
          <p style="margin: 0; line-height: 1.9;">
            ${asseChip('a1')} corpo che porta &nbsp;·&nbsp;
            ${asseChip('a2')} verso l'adulto &nbsp;·&nbsp;
            ${asseChip('a3')} con gesto riconoscibile &nbsp;·&nbsp;
            ${asseChip('a4')} libro come limite &nbsp;·&nbsp;
            ${asseChip('a5')} orientamento attivo &nbsp;·&nbsp;
            ${asseChip('a6')} familiarità sedimentata
          </p>
        </div>

        <p class="corso-narrative__caption" style="text-align: center; margin-top: 12px;">La freccia → descrive dipendenza strutturale, non sequenza osservativa.</p>
      `,
      notes:
        "Slide culminante del corso: tutti e sei i colori degli assi appaiono insieme. La distinzione fra «dipendenza strutturale» e «sequenza osservativa» è cruciale — viene rinforzata in 6.4 (equivoco 3) e in 6.7 (sintesi).",
    },

    // ─── 6.4 ──────────────────────────────────────────────
    {
      id: 'm06-s04',
      type: 'interactive',
      title: 'L\'ordine è strutturale, non valutativo',
      subtitle: 'Tre equivoci da sciogliere',
      intro: `
        <div class="corso-section" style="background: #fef0e7; border-left: 4px solid #d35400; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-bottom: 16px;">
          <p style="margin: 0; font-size: 1rem;">La sequenza A1 → A6 indica <strong>dipendenza strutturale</strong>, non importanza crescente. A1 non è meno importante di A6: A6 non sarebbe possibile senza A1.</p>
        </div>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: EQUIVOCI_CARDS,
        layout: 'vertical',
      },
      content: `
        <hr class="corso-divider" />
        <div class="corso-section" style="background: var(--corso-primary-light); border-left: 4px solid #1a6b8a; padding: 16px 20px; border-radius: var(--corso-radius-sm);">
          <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 8px;">Schema corretto</p>
          <p style="margin: 0 0 6px;">«A1 <strong>fonda</strong> A2» (≠ «A1 viene prima di A2 nello sviluppo»)</p>
          <p style="margin: 0;">«A6 <strong>integra</strong> A1-A5» (≠ «A6 è la fase finale di un percorso»)</p>
        </div>
      `,
      notes:
        "Le analogie (volta dell'arco, libro consumato, fondazione/muri) sono il momento didatticamente più potente di questa slide. Sono visivamente distinte (sfondo giallo pallido) per essere ricordate.",
    },

    // ─── 6.5 ──────────────────────────────────────────────
    {
      id: 'm06-s05',
      type: 'interactive',
      title: 'Quattro letture mono-registro di A6',
      subtitle: 'Quando la storicità del campo resta in ombra',
      intro: `
        <p>Asse 6 è particolarmente esposto a tre letture mono-registro classiche (lettura biografica, evolutiva, eziologica) e a una <em>lettura assente</em> — l'a-storicismo che tratta ogni osservazione come un primo incontro. Riconoscere queste tendenze non è criticarle: serve a renderle visibili e a tenere aperta la lettura strutturale di A6.</p>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: LETTURE_M6_CARDS,
        layout: 'grid',
      },
      content: `
        <hr class="corso-divider" />
        <p class="corso-emph corso-emph--center" style="font-size: 1.05rem;">La <strong>lettura biografica</strong>, la <strong>evolutiva</strong> e la <strong>eziologica</strong> sono linguaggi professionali legittimi che servono a scopi precisi (anamnesi, screening, indagine causale). Diventano mono-registro quando assorbono interamente lo sguardo, e la storicità strutturale del campo presente resta in ombra.</p>
      `,
      notes:
        "L'errore E4 (a-storicismo) è di tipo opposto agli altri tre: non distorce A6, lo nega. La card E4 ha colore più scuro per segnalare visivamente la differenza.",
    },

    // ─── 6.6 ──────────────────────────────────────────────
    {
      id: 'm06-s06',
      type: 'narrative',
      title: 'Il campo porta la sua storia',
      subtitle: 'La scena annotata attraverso A6',
      intro: `
        <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 12px;">
          <span style="display: inline-flex; align-items: center; background: #d35400; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px;">A6 — Storicità</span>
          <span style="display: inline-flex; align-items: center; background: #a04a1a; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px;">A6 + A1 — Storicità incarnata</span>
          <span style="display: inline-flex; align-items: center; background: #a06a30; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px;">A6 + A3 — Storicità + norma</span>
        </div>
      `,
      interactive: {
        kind: 'annotated-scene',
        sceneHtml: SCENA_M6_HTML,
        annotations: ANNOTAZIONI_M6,
        istruzione: "Clicca sulle frasi evidenziate per leggere la scena attraverso A6 (con sostegno di A1 e A3 in due annotazioni).",
      },
      content: `
        <hr class="corso-divider" />
        <div class="corso-section" style="background: #fef0e7; border-left: 4px solid #d35400; padding: 16px 20px; border-radius: var(--corso-radius-sm);">
          <p style="margin: 0 0 6px; font-weight: 600;">Questa scena non è la prima.</p>
          <p style="margin: 0;">È sempre già una <strong>ri-lettura</strong>. Il dorso consumato del libro, l'orientamento immediato del bambino, il cuscino spostato dall'educatrice, la voce abbassata sull'ultima pagina — sono tutte tracce della storia che il campo porta con sé. Non c'è bisogno di risalire al passato per leggerla: il passato è già lì, nel gesto presente.</p>
        </div>
      `,
      notes:
        "La scena è volutamente «monocromatica A6»: la maggior parte delle annotazioni leggono solo A6. Due annotazioni mostrano la storicità intrecciata con A1 (incarnazione) e A3 (norma emergente) per rendere visibile come A6 integri gli altri assi.",
    },

    // ─── 6.7 ──────────────────────────────────────────────
    {
      id: 'm06-s07',
      type: 'standard',
      title: 'Sei assi strutturali — la fondazione è completa',
      subtitle: 'Sei verbi, una mappa del campo',
      content: `
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin: 16px 0 8px;">
          ${SEI_ASSI.map((a) => `
            <div style="text-align: center;">
              <div style="background: ${a.colore}; color: white; padding: 14px 8px; border-radius: var(--corso-radius-md); margin-bottom: 8px;">
                <div style="font-size: 1.4rem; font-weight: 700;">A${a.numero}</div>
                <div style="font-size: 0.7rem; opacity: 0.9; margin-top: 2px;">${a.nomeBreve}</div>
              </div>
              <p style="margin: 0; font-size: 1.1rem; font-weight: 700; color: ${a.colore}; letter-spacing: 0.04em; font-variant: small-caps;">${VERBI_CHIAVE[a.id]}</p>
            </div>
          `).join('')}
        </div>

        <p class="corso-narrative__caption" style="text-align: center; margin: 8px 0 24px;">L'intera architettura F1 in sei verbi: il bambino <strong>abita</strong> l'esperienza, <strong>riconosce</strong> l'altro, <strong>scambia</strong> in forme condivise, <strong>incontra</strong> il limite reale, si <strong>orienta</strong> con desiderio, si <strong>situa</strong> nella storia del campo.</p>

        <hr class="corso-divider" />

        <div class="corso-section" style="background: #d8f3dc; border-left: 5px solid #2d6a4f; padding: 20px 24px; border-radius: var(--corso-radius-md);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <span style="background: #2d6a4f; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 10px; border-radius: 4px;">G-M6</span>
            <span style="font-size: 1.05rem; font-weight: 600; color: #1b4332;">Guardrail Modulo 6</span>
          </div>
          <p style="margin: 0 0 10px; color: #1b4332;">A6 non chiede di raccogliere la storia biografica del bambino né di collocarlo in una sequenza evolutiva. Chiede di riconoscere che il campo osservato porta sempre già una storia strutturale — leggibile nel presente senza risalire al passato. <strong>La storicità è del campo, non del bambino isolato.</strong></p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
            <div style="background: #fdecea; border-left: 3px solid #c0392b; padding: 10px 14px; border-radius: var(--corso-radius-sm);">
              <p style="margin: 0; font-size: 0.78rem; color: #c0392b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Da evitare</p>
              <p style="margin: 6px 0 0; font-style: italic; font-size: 0.9rem;">«Per capire come legge devo sapere quando hanno cominciato, cosa leggono di solito, se c'è stato qualche cambiamento in famiglia ultimamente.»</p>
            </div>
            <div style="background: #eafaf1; border-left: 3px solid #27ae60; padding: 10px 14px; border-radius: var(--corso-radius-sm);">
              <p style="margin: 0; font-size: 0.78rem; color: #1b8842; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Coerente con A6</p>
              <p style="margin: 6px 0 0; font-style: italic; font-size: 0.9rem;">«Il modo in cui porta il libro, come lo apre, la vocalizzazione anticipatoria — il campo mostra già la propria storia. Posso leggere la storicità senza raccogliere informazioni pregresse.»</p>
            </div>
          </div>
        </div>

        <hr class="corso-divider" />

        <div class="corso-section" style="background: var(--corso-bg); border: 1px dashed var(--corso-border); padding: 18px 22px; border-radius: var(--corso-radius-md);">
          <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 8px;">Prossimo modulo · M7</p>
          <p style="margin: 0 0 6px; font-weight: 600;">Abbiamo costruito la fondazione ontologica.</p>
          <p style="margin: 0; color: var(--corso-text-2); font-style: italic;">Cosa ne possiamo fare? Qual è il suo statuto epistemologico? E come passa a F2?</p>
          <div style="text-align: center; margin-top: 14px;">
            <span style="display: inline-block; padding: 8px 16px; border: 1px solid var(--corso-border); border-radius: var(--corso-radius-sm); color: var(--corso-text-2); font-size: 0.9rem; background: var(--corso-surface);">→ Modulo 7 — Statuto epistemologico e passaggio a F2</span>
          </div>
        </div>
      `,
      notes:
        "La slide chiude M6 e tutta la parte «assi strutturali» (M2-M6). I sei verbi sono la sintesi verbale dell'intera architettura F1: citabili fuori contesto come immagine riassuntiva. Il box M7 è volutamente sobrio e neutro (grigio): M7 è il modulo epistemologico e non ha un asse strutturale proprio.",
    },
  ],
};
