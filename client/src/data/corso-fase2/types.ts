// Tipi per il Corso "Fase 2 — Traduzione Interdisciplinare".
// La forma dati è mantenuta in parallelo con la sorgente standalone HTML/JS
// (cartella ../HCAIRE Slides/), in modo da rendere meccanico il porting di
// nuovi moduli: copiare il file mXX.js, rinominarlo .ts e aggiungere il tipo.

export type SlideType =
  | 'narrative'
  | 'standard'
  | 'diagram'
  | 'comparison'
  | 'interactive';

export interface GuardrailControl {
  code: string;          // es. "C0"
  label: string;         // es. "Vincolo di contesto"
  text?: string;         // testo del badge in footer
  domanda?: string;      // domanda di controllo (versione lunga)
}

// Dati per i componenti interattivi riutilizzabili.

export interface ExpandableCardData {
  id: string;
  color?: string;
  badge?: string;
  title: string;
  summary?: string;
  detail: string;        // HTML
}

export interface ExpandableCardsConfig {
  kind: 'expandable-cards';
  cards: ExpandableCardData[];
  multiOpen?: boolean;
  defaultOpen?: string[]; // id delle card aperte all'entrata
  layout?: 'vertical' | 'horizontal' | 'grid';
}

export interface ComparisonItem {
  text: string;
  problem?: string;
}

export interface ComparisonPanelConfig {
  kind: 'comparison-panel';
  label?: string;
  valid: {
    title: string;
    content?: string;      // HTML — opzionale: alcune slide hanno solo `items`
    items?: string[];
  };
  invalid: {
    title: string;
    content?: string;      // HTML
    items?: ComparisonItem[];
  };
}

export interface PipelineStep {
  id: string;
  label: string;
  sublabel?: string;
  type: 'foundation' | 'operator' | 'output';
  color?: string;
  control?: GuardrailControl | null;
  glossario?: string | null;
  casoGuida?: string;
}

export interface PipelineAnimatorConfig {
  kind: 'pipeline-animator';
  steps: PipelineStep[];
  highlightId?: string;     // step evidenziato
  completedIds?: string[];  // step già completati
  dimmedIds?: string[];     // step a opacità ridotta (panoramica)
  variant?: 'full' | 'compact-side'; // layout
}

export interface ProgressiveRevealItem {
  id: string;
  badge?: string;
  title: string;
  bodyHtml: string;
}

export interface ProgressiveRevealConfig {
  kind: 'progressive-reveal';
  items: ProgressiveRevealItem[];
  conclusionHtml?: string;
  ctaShow?: string;
}

export interface FlipCardData {
  id: string;
  number?: string;
  title: string;
  question?: string;
  valid: { text: string; perche?: string };
  invalid: { text: string; perche?: string };
}

export interface FlipCardsConfig {
  kind: 'flip-cards';
  cards: FlipCardData[];
  cols?: number;
  reformulationTable?: {
    title: string;
    headers: [string, string];
    rows: [string, string][];
  };
}

export interface ChipAccordionItem {
  id: string;
  label: string;
  bodyHtml: string;
}

export interface ChipAccordionConfig {
  kind: 'chip-accordion';
  items: ChipAccordionItem[];
}

export interface MatrixAxis {
  id: string;
  label: string;
  sublabel?: string;
  color?: string;
  icon?: string;
}

export interface MatrixCell {
  domanda: string;
  lettura?: string;
  errore?: string;
  output?: string;
}

export interface InteractiveMatrixConfig {
  kind: 'interactive-matrix';
  rows: MatrixAxis[];
  cols: MatrixAxis[];
  /** Indicizzato come [rowId][colId]. */
  cells: Record<string, Record<string, MatrixCell>>;
}

export interface GraphNode {
  id: string;
  label: string;
  sublabel?: string;
  color: string;
  /** Coordinate normalizzate (0-100) sul viewBox. */
  x: number;
  y: number;
}

export interface GraphRelation {
  from: string;
  to: string;
  type: string;          // es. "CPL", "VIN", "MED", "CMP"
  label?: string;
  bidirectional?: boolean;
}

export interface GraphRelationType {
  id: string;
  label: string;
  description?: string;
  color: string;
  /** Stile della linea SVG. */
  style?: 'solid' | 'dashed' | 'dotted';
}

export interface NodeRelationsConfig {
  kind: 'node-relations';
  nodes: GraphNode[];
  relations: GraphRelation[];
  relationTypes: GraphRelationType[];
}

export interface CEBuilderTexts {
  /** Frammento da usare per ogni Nodo (Nx) per ogni stato (↑ ~ ↓ ! ?). */
  nodi: Record<string, Record<string, string>>;
  relazioni: Record<string, string>;
  direzioni: Record<string, string>;
  stabilita: Record<string, string>;
  abitabilita: Record<string, string>;
}

export interface CEPreset {
  S: Record<string, string>;
  /** Codice della relazione dominante (CPL/VIN/MED/CMP) o null. */
  R: string | null;
  D: string;
  T: string;
  A: string;
}

export interface CEBuilderConfig {
  kind: 'ce-builder';
  texts: CEBuilderTexts;
  preset?: CEPreset;
  presetLabel?: string;
}

export interface TemplateTableSection {
  numero: number;
  sezione: string;
  domanda: string;
  campoVuoto: string;
  compilazione: string;
}

export interface TemplateTableConfig {
  kind: 'template-table';
  header: {
    titolo: string;
    nodo?: string;
    concettoPonte?: string;
  };
  sezioni: TemplateTableSection[];
  formulaSintesi: string;
  formulaCompilata: string;
}

export type InteractiveConfig =
  | ExpandableCardsConfig
  | ComparisonPanelConfig
  | PipelineAnimatorConfig
  | ProgressiveRevealConfig
  | FlipCardsConfig
  | ChipAccordionConfig
  | InteractiveMatrixConfig
  | NodeRelationsConfig
  | CEBuilderConfig
  | TemplateTableConfig;

/** Configurazione barra laterale "pipeline" mostrata accanto al body della slide. */
export interface PipelineSideConfig {
  /** Id dello step da evidenziare (passo corrente). */
  highlightId?: string;
  /** Id degli step già completati (verde tenue). */
  completedIds?: string[];
  /** Step a opacità ridotta (panoramica). */
  dimmedIds?: string[];
}

export interface PipelineTopbarStep {
  id: string;
  label: string;
  color?: string;
}

/** Barra di progresso orizzontale persistente (Modulo 9). */
export interface PipelineTopbarConfig {
  steps: PipelineTopbarStep[];
  /** Id dello step corrente. Gli step prima di esso sono "visited", quelli dopo "upcoming". */
  currentId: string;
}

export interface Slide {
  id: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  /** HTML breve mostrato sopra al componente interattivo (es. introduzione a una comparison). */
  intro?: string;
  /** Contenuto HTML "statico". Per le slide interattive si usa `interactive`. */
  content?: string;
  /** Configurazione componente interattivo (per slide di tipo interactive/diagram/comparison). */
  interactive?: InteractiveConfig;
  /** Slide di tipo comparison: shortcut per non passare da `interactive`. */
  comparison?: Omit<ComparisonPanelConfig, 'kind'>;
  /** Pipeline come barra laterale a sinistra del body (slide operatori M2). */
  pipelineSide?: PipelineSideConfig;
  /** Barra orizzontale di progresso pipeline persistente (Modulo 9). */
  pipelineTopbar?: PipelineTopbarConfig;
  notes?: string;
  guardrail?: GuardrailControl;
}

export interface Module {
  id: string;            // es. "m00"
  number: number;        // es. 0
  title: string;         // es. "Orientamento nell'architettura"
  shortTitle?: string;   // es. "Orientamento"
  accent: string;        // colore CSS (hex)
  slides: Slide[];
  /** Se true il modulo è solo placeholder (in arrivo). */
  placeholder?: boolean;
}
