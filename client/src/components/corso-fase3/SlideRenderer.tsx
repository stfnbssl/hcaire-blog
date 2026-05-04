import { Slide } from '../../data/corso-fase3/types';
// Riusa i componenti React già definiti per il corso F2: i loro `config`
// sono strutturalmente identici ai tipi F3 corrispondenti.
import ChipAccordion from '../corso-fase2/ChipAccordion';
import ComparisonPanel from '../corso-fase2/ComparisonPanel';
import ExpandableCards from '../corso-fase2/ExpandableCards';
import GuardrailBadge from '../corso-fase2/GuardrailBadge';
import PipelineAnimator from '../corso-fase2/PipelineAnimator';
import ProgressiveReveal from '../corso-fase2/ProgressiveReveal';

interface Props {
  slide: Slide;
}

export default function SlideRenderer({ slide }: Props) {
  const i = slide.interactive;

  return (
    <article className={`corso-slide corso-slide--${slide.type}`} key={slide.id}>
      <header className="corso-slide__head">
        {slide.subtitle && <div className="corso-slide__eyebrow">{slide.subtitle}</div>}
        <h1 className="corso-slide__title">{slide.title}</h1>
      </header>

      <div className="corso-slide__body">
        {slide.intro && (
          <div
            className="corso-slide__intro"
            dangerouslySetInnerHTML={{ __html: slide.intro }}
          />
        )}

        {i?.kind === 'expandable-cards' && <ExpandableCards config={i} />}
        {i?.kind === 'comparison-panel' && <ComparisonPanel config={i} />}
        {i?.kind === 'pipeline-animator' && <PipelineAnimator config={i} />}
        {i?.kind === 'progressive-reveal' && <ProgressiveReveal config={i} />}
        {i?.kind === 'chip-accordion' && <ChipAccordion config={i} />}
        {/* I componenti specifici di F3 (ce-display, f3-builder, decision-cycle)
            saranno aggiunti quando i moduli M2+ li richiederanno. */}

        {slide.comparison && (
          <ComparisonPanel
            config={{ kind: 'comparison-panel', ...slide.comparison }}
          />
        )}

        {slide.content && (
          <div
            className="corso-slide__content"
            dangerouslySetInnerHTML={{ __html: slide.content }}
          />
        )}
      </div>

      {slide.guardrail && (
        <footer className="corso-slide__guardrail">
          <GuardrailBadge control={slide.guardrail} />
        </footer>
      )}

      {slide.notes && !slide.guardrail && (
        <footer className="corso-slide__notes">{slide.notes}</footer>
      )}
    </article>
  );
}
