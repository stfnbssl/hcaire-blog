// Tipi per il Corso "Fase 1 — Fondazione Ontologica".
// Riusa i tipi di F2 dove possibile e aggiunge la configurazione
// del componente AnnotatedScene specifico di F1.

import type {
  ChipAccordionConfig,
  ComparisonPanelConfig,
  ExpandableCardsConfig,
  GuardrailControl,
  InteractiveMatrixConfig,
  ProgressiveRevealConfig,
  SlideType,
} from '../corso-fase2/types';

export type {
  ChipAccordionConfig,
  ChipAccordionItem,
  ComparisonItem,
  ComparisonPanelConfig,
  ExpandableCardData,
  ExpandableCardsConfig,
  GuardrailControl,
  InteractiveMatrixConfig,
  MatrixAxis,
  MatrixCell,
  ProgressiveRevealConfig,
  ProgressiveRevealItem,
  SlideType,
} from '../corso-fase2/types';

// Componente specifico F1: scena del caso-guida con frasi annotate cliccabili.
export interface AnnotatedSceneAnnotation {
  id: string;
  /** Frase esatta da evidenziare. */
  estratto: string;
  /** Etichetta breve mostrata sul badge del pannello. */
  label: string;
  /** Colore del badge e dell'evidenziazione. */
  colore: string;
  /** Testo dell'annotazione che appare nel pannello. */
  annotazione: string;
  /** Asse di riferimento mostrato in piccolo. */
  asse?: string;
}

export interface AnnotatedSceneConfig {
  kind: 'annotated-scene';
  /** HTML pre-costruito della scena, con <span class="corso-anno" data-anno-id="..."> sui frammenti annotabili. */
  sceneHtml: string;
  annotations: AnnotatedSceneAnnotation[];
  /** Testo di istruzione iniziale mostrato sopra la scena. */
  istruzione?: string;
}

export type InteractiveConfig =
  | ExpandableCardsConfig
  | ComparisonPanelConfig
  | ProgressiveRevealConfig
  | ChipAccordionConfig
  | InteractiveMatrixConfig
  | AnnotatedSceneConfig;

/** Mini-breadcrumb orizzontale opzionale (es. "Incarnato · Temporale · Relazionale"). */
export interface DimensionBreadcrumbStep {
  id: string;
  label: string;
}

export interface DimensionBreadcrumbConfig {
  steps: DimensionBreadcrumbStep[];
  currentId: string;
}

export interface Slide {
  id: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  /** HTML breve mostrato sopra al componente interattivo. */
  intro?: string;
  /** Contenuto HTML "statico". */
  content?: string;
  /** Configurazione componente interattivo. */
  interactive?: InteractiveConfig;
  /** Slide di tipo comparison: shortcut per non passare da `interactive`. */
  comparison?: Omit<ComparisonPanelConfig, 'kind'>;
  /** Mini-breadcrumb dimensionale (slide 1.2-1.4 della F1). */
  dimensionBreadcrumb?: DimensionBreadcrumbConfig;
  notes?: string;
  guardrail?: GuardrailControl;
}

export interface Module {
  id: string;            // es. "m01"
  number: number;        // es. 1
  title: string;
  shortTitle?: string;
  accent: string;        // colore CSS
  slides: Slide[];
  /** Se true il modulo è solo placeholder (in arrivo). */
  placeholder?: boolean;
}
