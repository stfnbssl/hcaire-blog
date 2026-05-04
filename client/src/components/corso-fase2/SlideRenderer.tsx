import { Slide } from '../../data/corso-fase2/types';
import { PIPELINE_STEPS } from '../../data/corso-fase2/pipeline-steps';
import CEBuilder from './CEBuilder';
import ChipAccordion from './ChipAccordion';
import ComparisonPanel from './ComparisonPanel';
import ExpandableCards from './ExpandableCards';
import FlipCards from './FlipCards';
import GuardrailBadge from './GuardrailBadge';
import InteractiveMatrix from './InteractiveMatrix';
import NodeRelationsGraph from './NodeRelationsGraph';
import PipelineAnimator from './PipelineAnimator';
import ProgressiveReveal from './ProgressiveReveal';
import TemplateTable from './TemplateTable';

interface Props {
  slide: Slide;
}

export default function SlideRenderer({ slide }: Props) {
  const hasAside = Boolean(slide.pipelineSide);

  const bodyInner = (
    <>
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
      {slide.interactive?.kind === 'pipeline-animator' && (
        <PipelineAnimator config={slide.interactive} />
      )}
      {slide.interactive?.kind === 'progressive-reveal' && (
        <ProgressiveReveal config={slide.interactive} />
      )}
      {slide.interactive?.kind === 'flip-cards' && (
        <FlipCards config={slide.interactive} />
      )}
      {slide.interactive?.kind === 'chip-accordion' && (
        <ChipAccordion config={slide.interactive} />
      )}
      {slide.interactive?.kind === 'interactive-matrix' && (
        <InteractiveMatrix config={slide.interactive} />
      )}
      {slide.interactive?.kind === 'node-relations' && (
        <NodeRelationsGraph config={slide.interactive} />
      )}
      {slide.interactive?.kind === 'ce-builder' && (
        <CEBuilder config={slide.interactive} />
      )}
      {slide.interactive?.kind === 'template-table' && (
        <TemplateTable config={slide.interactive} />
      )}
      {slide.comparison && (
        <ComparisonPanel config={{ kind: 'comparison-panel', ...slide.comparison }} />
      )}
      {slide.content && (
        <div
          className="corso-slide__content"
          dangerouslySetInnerHTML={{ __html: slide.content }}
        />
      )}
    </>
  );

  const topbar = slide.pipelineTopbar;
  const currentIdx = topbar
    ? topbar.steps.findIndex((s) => s.id === topbar.currentId)
    : -1;

  return (
    <article className={`corso-slide corso-slide--${slide.type}`} key={slide.id}>
      {topbar && (
        <div className="corso-pipe-topbar" aria-label="Progresso pipeline">
          {topbar.steps.map((s, i) => {
            const state =
              i === currentIdx ? 'current' : i < currentIdx ? 'visited' : 'upcoming';
            return (
              <span
                key={s.id}
                className={`corso-pipe-topbar__step corso-pipe-topbar__step--${state}`}
                style={
                  s.color && state === 'current'
                    ? ({ background: s.color, borderColor: s.color } as React.CSSProperties)
                    : undefined
                }
              >
                {s.label}
              </span>
            );
          })}
        </div>
      )}

      <header className="corso-slide__head">
        {slide.subtitle && <div className="corso-slide__eyebrow">{slide.subtitle}</div>}
        <h1 className="corso-slide__title">{slide.title}</h1>
      </header>

      {hasAside ? (
        <div className="corso-slide__body corso-slide__body--with-aside">
          <aside className="corso-slide__aside">
            <PipelineAnimator
              config={{
                kind: 'pipeline-animator',
                steps: PIPELINE_STEPS,
                variant: 'compact-side',
                highlightId: slide.pipelineSide!.highlightId,
                completedIds: slide.pipelineSide!.completedIds,
                dimmedIds: slide.pipelineSide!.dimmedIds,
              }}
            />
          </aside>
          <div className="corso-slide__content-area">{bodyInner}</div>
        </div>
      ) : (
        <div className="corso-slide__body">{bodyInner}</div>
      )}

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
