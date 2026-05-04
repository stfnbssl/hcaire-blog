import type { ExpandableCardData, Module } from '../types';
import { SEI_ASSI_BY_ID } from '../sei-assi';

// =============================================================
// Modulo 5 — Assi 4 e 5: Limite e desiderio
// =============================================================

const A4 = SEI_ASSI_BY_ID.a4;
const A5 = SEI_ASSI_BY_ID.a5;

// ─── Forme di A4 e A5 nell'albo illustrato ───────────────────

interface FormaNelLibro {
  id: string;
  forma: string;
  descrizione: string;
  osservabile: string;
}

const A4_FORME: FormaNelLibro[] = [
  {
    id: 'fl1',
    forma: 'La pagina che si volta',
    descrizione:
      "Ogni pagina girata è un limite reale: l'immagine scompare, quella precedente non è più accessibile senza azione. Il bambino incontra la sequenzialità irreversibile dell'albo.",
    osservabile: 'Lo sguardo che insegue la pagina che scompare; il tentativo di tornare indietro.',
  },
  {
    id: 'fl2',
    forma: 'Il libro che si chiude',
    descrizione:
      "La chiusura del libro è la forma più densa di A4 nell'albo: il campo grafico scompare, l'accesso all'immagine è interrotto dal gesto dell'adulto o dal tempo.",
    osservabile: 'Il seguire con lo sguardo il gesto di chiusura; la mano tesa verso il libro chiuso.',
  },
  {
    id: 'fl3',
    forma: "L'immagine che non risponde",
    descrizione:
      "Le figure nell'albo non agiscono: il bambino può indicarle, vocalizzare, toccarle — ma non cambiano. Questa non-responsività è un limite reale, non un difetto dell'oggetto.",
    osservabile: 'Il toccare ripetuto della figura; il vocalizzare verso di essa come si vocalizza verso una persona.',
  },
  {
    id: 'fl4',
    forma: 'La storia che ha una fine',
    descrizione:
      "L'albo ha struttura narrativa con conclusione. Il bambino incontra il limite della narrazione come limite del reale: la storia finisce, non perché qualcuno l'abbia deciso, ma perché ha quella forma.",
    osservabile: 'La reazione alla pagina finale; la richiesta di continuazione o di ri-inizio.',
  },
];

const A5_FORME: FormaNelLibro[] = [
  {
    id: 'fo1',
    forma: 'Il puntare verso il libro',
    descrizione:
      "Il gesto deittico verso l'albo chiuso è orientamento strutturale: il campo si dirige verso il limite incontrato. Non è «volere il libro» come oggetto, ma il campo che si orienta verso il polo significativo.",
    osservabile: "L'indice teso verso il libro; la direzione dello sguardo che anticipa e segue.",
  },
  {
    id: 'fo2',
    forma: 'La richiesta di rilettura',
    descrizione:
      "Chiedere di rileggere l'albo appena finito è la forma più chiara di A5: il campo si orienta nuovamente verso il limite superato. Non è ripetizione per abitudine, ma ri-orientamento strutturale.",
    osservabile: "La vocalizzazione ascendente; il portare il libro all'adulto; il gesto di apertura imitato.",
  },
  {
    id: 'fo3',
    forma: 'La vocalizzazione anticipatoria',
    descrizione:
      "Prima ancora che la pagina si volti, il bambino vocalizza anticipando l'immagine successiva. Il campo si orienta verso ciò che viene, mostrando un desiderio orientato nel tempo.",
    osservabile: "La vocalizzazione che precede il voltare pagina; l'eccitazione motoria anticipatoria.",
  },
  {
    id: 'fo4',
    forma: 'La resistenza strutturale alla chiusura',
    descrizione:
      "Quando il libro si chiude, il bambino mantiene il corpo orientato verso di esso — mano tesa, sguardo fisso, peso in avanti. Non è una protesta: è il campo che continua a mostrare il suo orientamento oltre il limite.",
    osservabile: 'La postura protesa; la mano che non si ritira; assenza di ri-orientamento verso altro.',
  },
];

// ─── Coppia strutturale A4 ↔ A5 ──────────────────────────────

interface PassoCoppia {
  passo: number;
  asse: string;
  colore: string;
  evento: string;
  struttura: string;
}

const PASSI_COPPIA: PassoCoppia[] = [
  {
    passo: 1,
    asse: 'A4',
    colore: '#c0392b',
    evento: 'Il libro si chiude',
    struttura: 'Il campo incontra una discontinuità reale: il limite è là, non negoziabile.',
  },
  {
    passo: 2,
    asse: 'A4 → A5',
    colore: '#a0306a',
    evento: 'Il limite genera direzione',
    struttura: 'La discontinuità produce un polo: il campo si orienta verso di esso.',
  },
  {
    passo: 3,
    asse: 'A5',
    colore: '#8e44ad',
    evento: 'Il bambino tende la mano verso il libro chiuso',
    struttura: "Il desiderio è osservabile: è il campo che si orienta, non «il bambino che vuole».",
  },
  {
    passo: 4,
    asse: 'A5 + A3 + A2',
    colore: '#7d3c98',
    evento: 'La richiesta prende forma',
    struttura: 'Il desiderio usa la norma (A3) e si rivolge all\'altro (A2): il campo si complessifica.',
  },
];

// ─── Catena strutturale fino ad A5 ────────────────────────────

interface AsseCatena {
  id: string;
  numero: number;
  nome: string;
  colore: string;
  ruoloNellaCatena: string;
  attivo: boolean;
}

const CATENA_M5: AsseCatena[] = [
  {
    id: 'a1',
    numero: 1,
    nome: "Abitare l'esperienza",
    colore: '#1a6b8a',
    ruoloNellaCatena:
      'Il bambino incontra il limite corporalmente: lo sente nella postura, nel peso, nel gesto che non completa. Senza A1, il limite resterebbe un\'astrazione cognitiva.',
    attivo: true,
  },
  {
    id: 'a2',
    numero: 2,
    nome: 'Alterità',
    colore: '#2d6a4f',
    ruoloNellaCatena:
      'Il limite emerge in un campo di alterità: non è il bambino solo contro il reale, ma il campo relazionale che produce e contiene la discontinuità.',
    attivo: true,
  },
  {
    id: 'a3',
    numero: 3,
    nome: 'Normatività emergente',
    colore: '#27ae60',
    ruoloNellaCatena:
      'Il desiderio prende forma normativamente riconoscibile: il bambino si orienta con gesti e vocalizzazioni che hanno struttura condivisa.',
    attivo: true,
  },
  {
    id: 'a4',
    numero: 4,
    nome: 'Limite reale',
    colore: '#c0392b',
    ruoloNellaCatena:
      'Produce il polo verso cui il desiderio si orienta. Fonda A5.',
    attivo: true,
  },
  {
    id: 'a5',
    numero: 5,
    nome: 'Desiderio come orientamento',
    colore: '#8e44ad',
    ruoloNellaCatena:
      'La tensione strutturale che emerge dal limite. Dipende da A4 e si esprime attraverso A3 verso A2.',
    attivo: true,
  },
  {
    id: 'a6',
    numero: 6,
    nome: 'Mondo storico-culturale',
    colore: '#95a5a6',
    ruoloNellaCatena: 'Verrà analizzato nel modulo successivo.',
    attivo: false,
  },
];

// ─── Quattro letture mono-registro tipiche A4/A5 ─────────────

interface LetturaMonoM5 {
  id: string;
  asse: 'A4' | 'A5';
  tipo: string;
  etichetta: string;
  colore: string;
  descrizione: string;
  esempioMonoRegistro: string;
  letturaStrutturale: string;
  cosaRestaInOmbra: string;
}

const LETTURE_M5: LetturaMonoM5[] = [
  {
    id: 'e1',
    asse: 'A4',
    tipo: 'Lettura psicologica del limite',
    etichetta: 'Limite → frustrazione emotiva',
    colore: '#c0392b',
    descrizione:
      "Il limite reale viene letto come evento emotivo: il bambino «si frustra», «non tollera l'attesa», «ha bassa soglia di frustrazione». L'analisi si sposta dall'osservabile strutturale all'inferenza sullo stato interno.",
    esempioMonoRegistro:
      '«Quando chiudo il libro piange sempre. Ha difficoltà a gestire la frustrazione.»',
    letturaStrutturale:
      "«Il campo mostra un bambino nell'incontro con il limite reale (A4): la reazione è l'orientamento del campo verso il polo perduto, non la prova di una difficoltà emotiva.»",
    cosaRestaInOmbra:
      "La differenza fra «incontrare un limite» (strutturale) e «essere frustrati» (psicologico). Il primo è un osservabile; il secondo è un'inferenza che richiede dati e cornici diverse.",
  },
  {
    id: 'e2',
    asse: 'A4',
    tipo: 'Lettura pedagogica del limite',
    etichetta: 'Limite → regola da insegnare',
    colore: '#c0392b',
    descrizione:
      "Il limite strutturale viene sostituito da una regola normativa: «dobbiamo insegnare che i libri non si strappano», «deve imparare che quando finisce, finisce». La norma esterna si sovrappone al limite come fatto strutturale del campo.",
    esempioMonoRegistro:
      "«Ogni volta che chiudo l'albo lo uso come momento per insegnargli che bisogna accettare quando le cose finiscono.»",
    letturaStrutturale:
      "«Il bambino già incontra il limite come struttura del reale (A4). Sovrapporgli una norma esterna non aggiunge nulla strutturalmente: sposta l'analisi dal campo al comportamento.»",
    cosaRestaInOmbra:
      "La possibilità di osservare come il bambino incontra il limite (con quale forma corporale, relazionale, temporale) prima di trasformarlo in occasione pedagogica.",
  },
  {
    id: 'e3',
    asse: 'A5',
    tipo: 'Lettura comportamentale del desiderio',
    etichetta: 'Desiderio → capriccio o abitudine',
    colore: '#8e44ad',
    descrizione:
      "L'orientamento strutturale del campo viene letto come comportamento individuale problematico: «vuole sempre rileggere lo stesso libro», «fa i capricci quando smettiamo», «si è fissato». La strutturalità del desiderio resta in ombra.",
    esempioMonoRegistro:
      '«Ogni sera vuole che gli rileggiamo lo stesso albo almeno tre volte. È diventato un capriccio.»',
    letturaStrutturale:
      "«Il campo mostra un orientamento strutturale stabile verso un oggetto significativo (A5). La ripetizione non è capriccio: è il desiderio che si orienta con consistenza verso qualcosa che ha valore strutturale nel campo.»",
    cosaRestaInOmbra:
      "La possibilità di riconoscere nel desiderio ripetuto un indicatore strutturale positivo: il campo ha poli di orientamento stabili, il desiderio ha forma riconoscibile, l'adulto è riconosciuto come agente.",
  },
  {
    id: 'e4',
    asse: 'A5',
    tipo: 'Lettura cognitivista del desiderio',
    etichetta: 'Desiderio → preferenza per stimoli',
    colore: '#8e44ad',
    descrizione:
      "Il desiderio viene spiegato attraverso le proprietà dell'oggetto: «preferisce questo libro perché ha i colori vivaci», «gli piace perché c'è il cane e lui ha un cane». La strutturalità del desiderio viene ricondotta a stimulus-response.",
    esempioMonoRegistro:
      '«Preferisce gli albi con molti colori e animali. È la sua preferenza cognitiva.»',
    letturaStrutturale:
      "«Il campo mostra un orientamento (A5) che non si spiega solo con le proprietà dell'oggetto. L'albo è un polo di desiderio perché è stato abitato (A1) in un campo di alterità (A2) con forme riconoscibili (A3): non perché abbia certi colori.»",
    cosaRestaInOmbra:
      "La dimensione strutturale e relazionale del desiderio: il bambino non si orienta verso un oggetto-stimolo, ma verso un polo che ha acquisito valore nel campo.",
  },
];

const LETTURE_M5_CARDS: ExpandableCardData[] = LETTURE_M5.map((l) => ({
  id: l.id,
  badge: l.asse,
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

// ─── Annotazioni caso-guida M5 ───────────────────────────────

const SCENA_M5_HTML = `
  <p>L'educatrice arriva all'ultima pagina dell'albo. <span class="corso-anno" data-anno-id="m5-a4-1">Chiude il libro con un gesto lento</span>, posandolo sul tavolo. Il bambino, seduto di fronte a lei, <span class="corso-anno" data-anno-id="m5-a1-1">segue il movimento con lo sguardo e con il corpo</span> — il peso che si sposta leggermente in avanti, le mani che smettono di muoversi. Un momento di pausa nel campo.</p>

  <p>Poi il bambino <span class="corso-anno" data-anno-id="m5-a5-1">tende la mano verso il libro chiuso</span>. <span class="corso-anno" data-anno-id="m5-a5-2">Emette una vocalizzazione ascendente</span>, breve, orientata: non verso il tavolo, ma verso l'educatrice. Lei incontra lo sguardo: «Ancora?».</p>

  <p>Il bambino <span class="corso-anno" data-anno-id="m5-a4-2">non distoglie la mano dal libro</span> — il limite è là, reale, chiuso, sul tavolo. <span class="corso-anno" data-anno-id="m5-a5-3">Sposta il peso del corpo in avanti</span>: tutto l'orientamento del campo converge sull'albo. L'educatrice riapre alla prima pagina.</p>
`;

const ANNOTAZIONI_M5 = [
  {
    id: 'm5-a4-1',
    estratto: 'Chiude il libro con un gesto lento',
    label: 'A4 — Limite reale',
    colore: '#c0392b',
    annotazione:
      "La chiusura del libro è il limite reale per eccellenza nell'albo: il campo grafico scompare, l'accesso all'immagine è interrotto. Non è una regola, non è una sanzione — è la struttura dell'oggetto che si manifesta nel gesto.",
    asse: 'A4 — Limite reale',
  },
  {
    id: 'm5-a1-1',
    estratto: 'segue il movimento con lo sguardo e con il corpo',
    label: 'A1 — Incarnato',
    colore: '#1a6b8a',
    annotazione:
      "Il bambino incontra il limite prima di tutto corporalmente: il peso che si sposta, le mani che si fermano. A1 è la fondazione: il limite reale (A4) è percepito corporalmente, non astrattamente elaborato.",
    asse: "A1 — Abitare l'esperienza (sostegno strutturale)",
  },
  {
    id: 'm5-a5-1',
    estratto: 'tende la mano verso il libro chiuso',
    label: 'A5 — Orientamento',
    colore: '#8e44ad',
    annotazione:
      "La mano tesa verso il libro chiuso è il desiderio reso osservabile: il campo si orienta verso il limite incontrato. Non è «volere il libro» come oggetto — è la direzione strutturale del campo dopo l'incontro con A4.",
    asse: 'A5 — Desiderio come orientamento',
  },
  {
    id: 'm5-a5-2',
    estratto: 'Emette una vocalizzazione ascendente',
    label: 'A5 + A3 — Desiderio con forma',
    colore: '#a05bb5',
    annotazione:
      "La vocalizzazione ascendente è il desiderio che prende forma normativamente riconoscibile (A3): non un suono casuale, ma un pattern prosodico che il campo adulto-bambino ha co-costruito come richiesta. Il desiderio (A5) si esprime attraverso la norma emergente (A3).",
    asse: 'A5 + A3 — Desiderio espresso in forma condivisa',
  },
  {
    id: 'm5-a4-2',
    estratto: 'non distoglie la mano dal libro',
    label: 'A4 — Il limite permane',
    colore: '#c0392b',
    annotazione:
      "Il libro è ancora chiuso: il limite non è scomparso con il desiderio. L'analisi strutturale mostra due assi simultanei — il limite (A4) resta reale mentre il desiderio (A5) si orienta verso di esso. Non si escludono: coesistono.",
    asse: 'A4 — Limite reale (simultaneo ad A5)',
  },
  {
    id: 'm5-a5-3',
    estratto: 'Sposta il peso del corpo in avanti',
    label: 'A5 — Il campo si orienta',
    colore: '#8e44ad',
    annotazione:
      "Lo spostamento del peso è orientamento incarnato (A1+A5): non solo la mano, ma tutto il corpo del bambino esprime la direzione del campo. Il desiderio non è nella testa — è nel campo, osservabile nella postura, nel peso, nella tensione muscolare.",
    asse: 'A5 — Orientamento incarnato del campo',
  },
];

// ─── Helper: card "forma nel libro" ──────────────────────────

function formaCard(f: FormaNelLibro, colore: string): string {
  return `
    <div class="corso-card corso-card--open" style="--corso-card-accent: ${colore};">
      <div class="corso-card__head">
        <span class="corso-card__title">${f.forma}</span>
      </div>
      <div class="corso-card__body">
        <p style="margin: 0 0 10px;">${f.descrizione}</p>
        <div style="background: var(--corso-bg); padding: 8px 12px; border-radius: var(--corso-radius-sm);">
          <p style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 4px;">Osservabile</p>
          <p style="margin: 0; font-size: 0.88rem; font-style: italic;">${f.osservabile}</p>
        </div>
      </div>
    </div>
  `;
}

// =============================================================
// Slide
// =============================================================

export const Module05: Module = {
  id: 'm05',
  number: 5,
  title: 'Assi 4 e 5 — Limite reale e desiderio',
  shortTitle: 'Assi 4-5',
  accent: '#c0392b',
  slides: [
    // ─── 5.1 ──────────────────────────────────────────────
    {
      id: 'm05-s01',
      type: 'standard',
      title: 'Frustrazione o struttura?',
      subtitle: 'Il problema di leggere il momento',
      content: `
        <div class="corso-scena" style="border-left: 4px solid #c0392b; background: #fdecea; padding: 18px 22px; border-radius: var(--corso-radius-sm);">
          <p style="font-style: italic; margin: 0; line-height: 1.7; font-size: 1.05rem;">Il bambino tende la mano verso il libro appena chiuso e vocalizza verso l'educatrice. <strong>Come leggiamo questo momento?</strong></p>
        </div>

        <div class="corso-two-col" style="margin-top: 20px;">
          <div class="corso-box" style="border-left: 3px solid #c0392b; background: #fdecea; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #c0392b;">Lettura comune</div>
            <ul style="margin: 8px 0 12px; padding-left: 20px; font-style: italic;">
              <li>«Non vuole smettere»</li>
              <li>«Si è abituato»</li>
              <li>«È un capriccio»</li>
              <li>«Lo stiamo viziando a forza di rileggere?»</li>
            </ul>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              <span style="background: #e74c3c; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">stato interno</span>
              <span style="background: #c0392b; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">comportamento</span>
            </div>
          </div>

          <div class="corso-box" style="border-left: 3px solid #8e44ad; background: #f5eef8; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #8e44ad;">Cosa questa lettura lascia in ombra</div>
            <ul style="margin: 8px 0 12px; padding-left: 20px;">
              <li>Il limite come struttura del reale</li>
              <li>Il desiderio come orientamento del campo</li>
              <li>La relazione fra «finire» e «volere»</li>
              <li>La capacità di incontrare il reale e di mantenersi orientati verso di esso</li>
            </ul>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              <span style="background: #8e44ad; color: white; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 3px;">struttura</span>
            </div>
          </div>
        </div>

        <p class="corso-emph corso-emph--center" style="margin-top: 20px;">→ Questi due piani strutturali hanno un nome: <strong>A4</strong> e <strong>A5</strong>.</p>
      `,
      notes:
        "La slide entra deliberatamente da una formulazione comune («è un capriccio») per creare il bisogno di un'alternativa strutturale. Le letture comuni non sono incompetenti: sono linguaggi che restano sul piano dello stato interno o del comportamento. A4 e A5 propongono un piano diverso, complementare, sulla struttura del campo.",
    },

    // ─── 5.2 ──────────────────────────────────────────────
    {
      id: 'm05-s02',
      type: 'standard',
      title: 'Asse 4 — Limite reale',
      subtitle: "Verbo chiave: incontrare (non subire, non scontrarsi, non evitare, non superare)",
      content: `
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="display: inline-block; background: #c0392b; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px; margin-right: 10px;">A4</span>
          <span style="font-size: 1.6rem; font-weight: 700; color: #c0392b; letter-spacing: 0.04em;">INCONTRARE</span>
          <p style="font-size: 0.85rem; color: var(--corso-text-muted); margin: 6px 0 0; font-style: italic;">≠ subire · scontrarsi · evitare · superare</p>
        </div>

        <blockquote class="corso-blockquote" style="border-left-color: #c0392b; background: #fdecea; font-size: 1.15rem; line-height: 1.6;">
          «Il limite reale è la <strong>discontinuità strutturale del campo</strong>: ciò che è e non cambia indipendentemente dall'intenzione o dall'investimento del bambino. Non è un confine imposto dall'esterno né una mancanza da colmare, ma la condizione entro cui il desiderio trova direzione.»
        </blockquote>

        <div class="corso-two-col">
          <div class="corso-box corso-box--invalid">
            <div class="corso-box__title">Non è</div>
            <ul style="margin: 6px 0; padding-left: 18px; font-size: 0.9rem;">
              <li>la frustrazione emotiva conseguente al limite</li>
              <li>la regola stabilita dall'adulto</li>
              <li>l'ostacolo da superare o negoziare</li>
              <li>il trauma da evitare</li>
              <li>il «no» educativo</li>
            </ul>
          </div>
          <div class="corso-box corso-box--valid" style="border-color: #c0392b; background: #fdecea;">
            <div class="corso-box__title" style="color: #c0392b;">È</div>
            <ul style="margin: 6px 0; padding-left: 18px; font-size: 0.9rem;">
              <li>la discontinuità strutturale che il campo presenta</li>
              <li>la resistenza del reale all'investimento</li>
              <li>la condizione che rende possibile l'orientamento (A5)</li>
              <li>un dato strutturale, non una valutazione</li>
            </ul>
          </div>
        </div>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3">Quattro forme di A4 nell'albo illustrato</h3>
        <div class="corso-cards corso-cards--grid" style="grid-template-columns: repeat(2, 1fr); gap: 12px;">
          ${A4_FORME.map((f) => formaCard(f, '#c0392b')).join('')}
        </div>

        <hr class="corso-divider" />

        <div class="corso-section" style="background: var(--corso-primary-light); border-left: 4px solid #1a6b8a; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
          <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Dipendenze strutturali</p>
          <p style="margin: 0;"><strong>A4 ← A1</strong>: il limite è incontrato corporalmente — il bambino lo percepisce con il corpo prima di rappresentarlo. <strong>A4 ← A2</strong>: il limite emerge come limite in un campo di alterità — non è il bambino solo che incontra il muro, ma il campo bambino-adulto-oggetto che produce la discontinuità.</p>
        </div>
      `,
      guardrail: { code: 'G-A4', label: 'Guardrail Asse 4', text: A4.guardrail },
      notes:
        "A4 non misura la tolleranza alla frustrazione né la capacità di accettare i limiti. Descrive la struttura del campo: ci sono o non ci sono discontinuità reali, e come il bambino le incontra.",
    },

    // ─── 5.3 ──────────────────────────────────────────────
    {
      id: 'm05-s03',
      type: 'standard',
      title: 'Asse 5 — Desiderio come orientamento',
      subtitle: 'Verbo chiave: orientarsi (non mancare, non bramare, non pretendere, non dipendere)',
      content: `
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="display: inline-block; background: #8e44ad; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px; margin-right: 10px;">A5</span>
          <span style="font-size: 1.6rem; font-weight: 700; color: #8e44ad; letter-spacing: 0.04em;">ORIENTARSI</span>
          <p style="font-size: 0.85rem; color: var(--corso-text-muted); margin: 6px 0 0; font-style: italic;">≠ mancare · bramare · pretendere · dipendere</p>
        </div>

        <blockquote class="corso-blockquote" style="border-left-color: #8e44ad; background: #f5eef8; font-size: 1.15rem; line-height: 1.6;">
          «Il desiderio è la <strong>direzione strutturale del campo</strong> verso qualcosa di significativo. Non descrive uno stato interno del bambino (ciò che gli manca o vuole), ma una tensione osservabile: il campo si orienta. Il desiderio non è assenza di qualcosa, ma presenza di una direzione.»
        </blockquote>

        <div class="corso-two-col">
          <div class="corso-box corso-box--invalid">
            <div class="corso-box__title">Non è</div>
            <ul style="margin: 6px 0; padding-left: 18px; font-size: 0.9rem;">
              <li>la volontà soggettiva di avere qualcosa</li>
              <li>il capriccio o il bisogno non regolato</li>
              <li>la preferenza individuale per uno stimolo</li>
              <li>la mancanza da colmare</li>
              <li>l'attaccamento a un oggetto specifico</li>
            </ul>
          </div>
          <div class="corso-box corso-box--valid" style="border-color: #8e44ad; background: #f5eef8;">
            <div class="corso-box__title" style="color: #8e44ad;">È</div>
            <ul style="margin: 6px 0; padding-left: 18px; font-size: 0.9rem;">
              <li>l'orientamento strutturale del campo verso un polo</li>
              <li>la tensione attiva che il campo esprime</li>
              <li>la direzione che il limite (A4) rende possibile</li>
              <li>un osservabile strutturale, non uno stato interno</li>
            </ul>
          </div>
        </div>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3">Quattro forme di A5 nell'albo illustrato</h3>
        <div class="corso-cards corso-cards--grid" style="grid-template-columns: repeat(2, 1fr); gap: 12px;">
          ${A5_FORME.map((f) => formaCard(f, '#8e44ad')).join('')}
        </div>

        <hr class="corso-divider" />

        <div class="corso-section" style="background: var(--corso-primary-light); border-left: 4px solid #1a6b8a; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
          <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Dipendenze strutturali</p>
          <p style="margin: 0;"><strong>A5 ← A4</strong>: il desiderio si orienta verso qualcosa perché esiste un limite reale — senza la discontinuità di A4 non c'è una direzione verso cui orientarsi. Il limite non si oppone al desiderio: lo istituisce. <strong>A5 ← A3</strong>: la forma del desiderio è normativamente riconoscibile — il bambino non si orienta in modo caotico, ma con gesti e vocalizzazioni che hanno forma condivisa.</p>
        </div>
      `,
      guardrail: { code: 'G-A5', label: 'Guardrail Asse 5', text: A5.guardrail },
      notes:
        "A5 non misura la forza del desiderio né la sua appropriatezza. Descrive la struttura del campo: c'è un orientamento, ha forma osservabile, e dipende da un limite (A4) e da una norma emergente (A3).",
    },

    // ─── 5.4 ──────────────────────────────────────────────
    {
      id: 'm05-s04',
      type: 'diagram',
      title: 'La coppia strutturale',
      subtitle: 'Il limite non si oppone al desiderio: lo istituisce',
      content: `
        <p style="text-align: center; font-size: 1.15rem; margin: 8px 0 24px; color: var(--corso-text); font-weight: 500;">A4 e A5 non sono opposti — sono <strong>complementari strutturalmente</strong>. Senza una discontinuità reale, non c'è un polo verso cui il campo possa orientarsi.</p>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; align-items: stretch; margin: 20px 0;">
          ${PASSI_COPPIA.map((p, i) => `
            <div style="display: flex; flex-direction: column;">
              <div style="background: ${p.colore}; color: white; padding: 10px 12px; border-radius: ${i === 0 ? 'var(--corso-radius-sm) 0 0 0' : i === PASSI_COPPIA.length - 1 ? '0 var(--corso-radius-sm) 0 0' : '0'}; text-align: center;">
                <div style="font-size: 0.72rem; opacity: 0.9; letter-spacing: 0.06em;">PASSO ${p.passo}</div>
                <div style="font-size: 0.85rem; font-weight: 700; margin-top: 2px;">${p.asse}</div>
              </div>
              <div style="background: ${p.colore}11; border: 1px solid ${p.colore}55; border-top: none; padding: 14px 12px; flex: 1; ${i === 0 ? 'border-radius: 0 0 0 var(--corso-radius-sm);' : ''} ${i === PASSI_COPPIA.length - 1 ? 'border-radius: 0 0 var(--corso-radius-sm) 0;' : ''}">
                <p style="font-weight: 700; margin: 0 0 8px; color: ${p.colore}; font-size: 0.95rem;">${p.evento}</p>
                <p style="margin: 0; font-size: 0.85rem; line-height: 1.5;">${p.struttura}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <hr class="corso-divider" />

        <div class="corso-section" style="background: #fff3f3; border: 1px dashed #c0392b; padding: 16px 20px; border-radius: var(--corso-radius-sm);">
          <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #c0392b; margin: 0 0 8px; font-weight: 700;">Contro-intuizione</p>
          <p style="margin: 0 0 8px;"><strong>La cultura comune</strong>: più limite → meno desiderio.</p>
          <p style="margin: 0;"><strong>La lettura strutturale</strong>: il limite istituisce il desiderio. Senza A4 non c'è polo verso cui A5 possa orientarsi.</p>
        </div>

        <div class="corso-section" style="background: var(--corso-primary-light); border-left: 4px solid #1a6b8a; padding: 14px 18px; border-radius: var(--corso-radius-sm); margin-top: 16px;">
          <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--corso-text-muted); margin: 0 0 6px;">Esempio nel caso-guida</p>
          <p style="margin: 0 0 6px;"><strong>Chiusura del libro (A4)</strong> → <strong>mano tesa + vocalizzazione (A5)</strong></p>
          <p style="margin: 0; font-size: 0.92rem;">Il gesto di chiudere non blocca: produce la direzione. Il bambino sa verso cosa orientarsi <em>perché il libro è là</em> — chiuso, reale, presente nel suo limite.</p>
        </div>
      `,
      notes:
        "La «contro-intuizione» è il momento didatticamente più pregnante della slide: rovescia l'opposizione comune fra limite e desiderio. È utile esplicitarla: senza A4 (limite reale), A5 (orientamento) non ha un polo. La frase «il limite istituisce il desiderio» riassume tutta la coppia strutturale.",
    },

    // ─── 5.5 ──────────────────────────────────────────────
    {
      id: 'm05-s05',
      type: 'diagram',
      title: 'A4 e A5 nella catena strutturale',
      subtitle: 'Dal corpo al desiderio — come si regge la catena',
      content: `
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; align-items: stretch; margin: 20px 0;">
          ${CATENA_M5.map((a, i) => `
            <div style="display: flex; flex-direction: column; opacity: ${a.attivo ? 1 : 0.5};">
              <div style="background: ${a.colore}; color: white; padding: 12px 8px; border-radius: var(--corso-radius-sm) var(--corso-radius-sm) 0 0; text-align: center;">
                <div style="font-size: 1.2rem; font-weight: 700;">A${a.numero}</div>
                <div style="font-size: 0.72rem; margin-top: 2px;">${a.nome}</div>
              </div>
              <div style="background: ${a.colore}11; border: 1px solid ${a.colore}55; border-top: none; padding: 10px 10px; flex: 1; border-radius: 0 0 var(--corso-radius-sm) var(--corso-radius-sm);">
                <p style="margin: 0; font-size: 0.78rem; line-height: 1.45; color: var(--corso-text-2);">${a.ruoloNellaCatena}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin: -8px 0 20px; text-align: center; color: var(--corso-text-muted); font-size: 0.85rem;">
          <div>↓</div><div>↓</div><div>↓</div><div>↓</div><div>↓</div><div></div>
        </div>

        <hr class="corso-divider" />

        <div class="corso-section" style="background: var(--corso-primary-light); border-left: 4px solid #c0392b; padding: 16px 20px; border-radius: var(--corso-radius-sm);">
          <p style="margin: 0 0 8px; font-weight: 600;">La gerarchia è strutturale, non valutativa.</p>
          <p style="margin: 0;">A5 non è «più importante» di A1: dipende da A1. Ogni asse è condizione del successivo. La catena <strong>A1 → A2 → A3 → A4 → A5</strong> mostra come l'orientamento del desiderio (A5) sia possibile solo se sono in funzione gli assi precedenti — e perché lavorare su A5 senza A4 (o su A4 senza A1) sia metodologicamente debole.</p>
        </div>

        <p class="corso-narrative__caption" style="text-align: center; margin-top: 16px;">A6 — Mondo storico-culturale: sarà analizzato nel Modulo 6.</p>
      `,
      notes:
        "Differenza dalla pipeline di M2: lì la catena mostrava la struttura logica degli assi in astratto. Qui mostra le dipendenze specifiche di A4 e A5: ogni casella spiega come quell'asse fonda i successivi nell'esperienza concreta dell'albo illustrato.",
    },

    // ─── 5.6 ──────────────────────────────────────────────
    {
      id: 'm05-s06',
      type: 'interactive',
      title: 'Quattro letture mono-registro da riconoscere',
      subtitle: 'Due per asse — quando la struttura del campo resta in ombra',
      intro: `
        <p>Quando A4 e A5 non vengono tematizzati esplicitamente, lo sguardo si dispone naturalmente lungo registri specifici: lo stato emotivo, la regola educativa, il capriccio, la preferenza per stimoli. Riconoscerli serve a renderli visibili come scelte interpretative — e a tenere aperta la possibilità di letture strutturali complementari.</p>
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          <span style="display: inline-flex; align-items: center; background: #c0392b; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px;">A4 — Limite reale</span>
          <span style="display: inline-flex; align-items: center; background: #8e44ad; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px;">A5 — Desiderio come orientamento</span>
        </div>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: LETTURE_M5_CARDS,
        layout: 'grid',
      },
      content: `
        <hr class="corso-divider" />
        <p class="corso-emph corso-emph--center" style="font-size: 1.05rem;">Nessuna di queste letture è incompetente: sono linguaggi che servono a scopi precisi. Diventano mono-registro quando assorbono interamente lo sguardo — e la struttura del campo (A4 e A5) resta in ombra.</p>
      `,
      notes:
        "Esercizio in formazione: leggere una scheda di osservazione scritta in registro psicologico/comportamentale e riscriverla con le domande di A4 (quali discontinuità il campo presenta?) e A5 (verso quali poli il campo si orienta?). La riscrittura non cambia i fatti — cambia ciò che si ritiene rilevante e quindi cosa diventa possibile fare.",
    },

    // ─── 5.7 ──────────────────────────────────────────────
    {
      id: 'm05-s07',
      type: 'narrative',
      title: 'Il bambino che vuole ancora',
      subtitle: 'La scena annotata — A4 e A5 nel campo',
      intro: `
        <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 12px;">
          <span style="display: inline-flex; align-items: center; background: #c0392b; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px;">A4 — Limite reale</span>
          <span style="display: inline-flex; align-items: center; background: #8e44ad; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px;">A5 — Desiderio</span>
          <span style="display: inline-flex; align-items: center; background: #a05bb5; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px;">A5 + A3 — Forma condivisa</span>
          <span style="display: inline-flex; align-items: center; background: #1a6b8a; color: white; font-size: 0.78rem; font-weight: 700; padding: 4px 12px; border-radius: 4px;">A1 — Sostegno incarnato</span>
        </div>
      `,
      interactive: {
        kind: 'annotated-scene',
        sceneHtml: SCENA_M5_HTML,
        annotations: ANNOTAZIONI_M5,
        istruzione: 'Clicca sulle frasi evidenziate per leggere la scena attraverso A4 e A5 (con sostegno di A1 e A3).',
      },
      content: `
        <hr class="corso-divider" />
        <h3 class="corso-narrative__h3" style="text-align: center;">Cosa rende osservabili A4 e A5 nel campo</h3>
        <div class="corso-two-col">
          <div class="corso-box" style="border-left: 3px solid #c0392b; background: #fdecea; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #c0392b;">A4 nel campo</div>
            <ul style="margin: 6px 0; padding-left: 18px;">
              <li>Libro che si chiude</li>
              <li>Limite che permane oltre il desiderio</li>
              <li>Discontinuità non negoziabile dal bambino</li>
            </ul>
          </div>
          <div class="corso-box" style="border-left: 3px solid #8e44ad; background: #f5eef8; padding: 14px 18px; border-radius: var(--corso-radius-sm);">
            <div class="corso-box__title" style="color: #8e44ad;">A5 nel campo</div>
            <ul style="margin: 6px 0; padding-left: 18px;">
              <li>Mano tesa verso il libro chiuso</li>
              <li>Vocalizzazione ascendente con forma riconoscibile</li>
              <li>Peso del corpo orientato in avanti</li>
            </ul>
          </div>
        </div>

        <p class="corso-narrative__caption" style="text-align: center; margin-top: 20px;">Nel Modulo 6 entreremo in <strong>A6</strong> — Mondo storico-culturale — e vedremo come l'albo illustrato non sia solo «un libro», ma un oggetto culturale che porta con sé pratiche, convenzioni, mondi condivisi.</p>

        <div style="text-align: center; margin-top: 16px;">
          <span style="display: inline-block; padding: 8px 16px; border: 1px solid var(--corso-border); border-radius: var(--corso-radius-sm); color: var(--corso-text-2); font-size: 0.9rem;">→ Modulo 6 — Asse 6: Il mondo storico-culturale</span>
        </div>
      `,
      guardrail: {
        code: 'G-M5',
        label: 'Guardrail M5 — A4 e A5 sono strutture del campo',
        text:
          "A4 e A5 descrivono strutture del campo, non stati interni del bambino. «Incontrare un limite» non equivale a «essere frustrati». «Orientarsi con desiderio» non equivale a «volere qualcosa». Le strutture sono osservabili nel campo; gli stati interni sono inferenze che richiedono dati e cornici diverse.",
      },
      notes:
        "Connessione con M4: il bambino che chiede la rilettura dell'albo è lo stesso bambino che abbiamo visto nell'alternanza dei turni. Chi ha completato M4 riconosce A2 (rivolgersi all'adulto) e A3 (la vocalizzazione come forma condivisa). Qui la stessa scena viene illuminata attraverso A4 e A5.",
    },
  ],
};
