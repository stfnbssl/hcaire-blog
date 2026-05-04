import type { Slide } from '../../data/corso-fase1/types';
import ChipAccordion from '../corso-fase2/ChipAccordion';
import ComparisonPanel from '../corso-fase2/ComparisonPanel';
import ExpandableCards from '../corso-fase2/ExpandableCards';
import GuardrailBadge from '../corso-fase2/GuardrailBadge';
import InteractiveMatrix from '../corso-fase2/InteractiveMatrix';
import ProgressiveReveal from '../corso-fase2/ProgressiveReveal';
import AnnotatedScene from './AnnotatedScene';

interface Props {
  slide: Slide;
}

export default function SlideRenderer({ slide }: Props) {
  const breadcrumb = slide.dimensionBreadcrumb;

  return (
    <article className={`corso-slide corso-slide--${slide.type}`} key={slide.id}>
      {breadcrumb && (
        <div className="corso-dim-breadcrumb" aria-label="Dimensione corrente">
          {breadcrumb.steps.map((s) => (
            <span
              key={s.id}
              className={`corso-dim-breadcrumb__step ${s.id === breadcrumb.currentId ? 'corso-dim-breadcrumb__step--active' : ''}`}
            >
              {s.label}
            </span>
          ))}
        </div>
      )}

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
        {slide.interactive?.kind === 'expandable-cards' && (
          <ExpandableCards config={slide.interactive} />
        )}
        {slide.interactive?.kind === 'comparison-panel' && (
          <ComparisonPanel config={slide.interactive} />
        )}
        {slide.interactive?.kind === 'progressive-reveal' && (
          <ProgressiveReveal config={slide.interactive} />
        )}
        {slide.interactive?.kind === 'chip-accordion' && (
          <ChipAccordion config={slide.interactive} />
        )}
        {slide.interactive?.kind === 'interactive-matrix' && (
          <InteractiveMatrix config={slide.interactive} />
        )}
        {slide.interactive?.kind === 'annotated-scene' && (
          <AnnotatedScene config={slide.interactive} />
        )}
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
