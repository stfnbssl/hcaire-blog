// Tipi per il Corso "Fase 3 — Strumenti Operativi Contestualizzati".
// Mantiene parità con la sorgente standalone HTML/JS in
// ../HCAIRE Slides/F3/. Dove possibile, riutilizza i tipi della F2
// (componenti come ExpandableCards, ComparisonPanel, GuardrailBadge sono
// strutturalmente compatibili con quelli della F2 e vengono importati
// dai componenti React di corso-fase2).

import type {
  ExpandableCardsConfig,
  ComparisonPanelConfig,
  PipelineAnimatorConfig,
  ProgressiveRevealConfig,
  ChipAccordionConfig,
  GuardrailControl,
} from '../corso-fase2/types';

export type {
  ExpandableCardsConfig,
  ComparisonPanelConfig,
  PipelineAnimatorConfig,
  ProgressiveRevealConfig,
  ChipAccordionConfig,
  GuardrailControl,
};

export type SlideType =
  | 'narrative'
  | 'standard'
  | 'diagram'
  | 'comparison'
  | 'interactive';

// ─── Configurazioni interattive specifiche di F3 ─────────────────────────

/**
 * Renderizza una Configurazione Evolutiva (CE) come tabella compatta.
 * `highlights` evidenzia opzionalmente uno o più nodi.
 */
export interface CEDisplayConfig {
  kind: 'ce-display';
  /** Codici dei nodi da evidenziare visivamente (es. ['N3', 'N2']). */
  highlights?: string[];
  /** Se true mostra solo la tabella, senza riepilogo R/D/T/A. */
  compact?: boolean;
  /** Override del titolo sopra la tabella. */
  titolo?: string;
}

/**
 * Builder interattivo del Template F3 (Modulo 5). Permette di costruire
 * un micro-dispositivo di campo a partire dalla CE del caso-guida.
 */
export interface F3BuilderConfig {
  kind: 'f3-builder';
}

/**
 * Schema circolare animato del Ciclo Decisionale Breve
 * (OSSERVA → LEGGI → ORIENTA → AGISCI → OSSERVA). Modulo 7.
 */
export interface DecisionCycleConfig {
  kind: 'decision-cycle';
}

export type InteractiveConfig =
  | ExpandableCardsConfig
  | ComparisonPanelConfig
  | PipelineAnimatorConfig
  | ProgressiveRevealConfig
  | ChipAccordionConfig
  | CEDisplayConfig
  | F3BuilderConfig
  | DecisionCycleConfig;

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
  /** Shortcut per slide di tipo comparison. */
  comparison?: Omit<ComparisonPanelConfig, 'kind'>;
  notes?: string;
  guardrail?: GuardrailControl;
}

export interface Module {
  id: string;            // es. "m00"
  number: number;        // es. 0
  title: string;         // es. "Orientamento F3"
  shortTitle?: string;   // es. "Orientamento"
  accent: string;        // colore CSS (hex)
  slides: Slide[];
  /** Se true il modulo è solo placeholder (in arrivo). */
  placeholder?: boolean;
}
