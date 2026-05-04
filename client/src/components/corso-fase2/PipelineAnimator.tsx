import { useState } from 'react';
import { PipelineAnimatorConfig, PipelineStep } from '../../data/corso-fase2/types';

interface Props {
  config: PipelineAnimatorConfig;
}

function stepClass(
  step: PipelineStep,
  highlightId?: string,
  completedIds?: string[],
  dimmedIds?: string[],
): string {
  const cls = ['corso-pipe__step', `corso-pipe__step--${step.type}`];
  if (highlightId && step.id === highlightId) cls.push('corso-pipe__step--active');
  if (completedIds?.includes(step.id)) cls.push('corso-pipe__step--done');
  if (dimmedIds?.includes(step.id)) cls.push('corso-pipe__step--dim');
  return cls.join(' ');
}

export default function PipelineAnimator({ config }: Props) {
  const { steps, highlightId, completedIds, dimmedIds, variant = 'full' } = config;
  const [openId, setOpenId] = useState<string | null>(highlightId ?? null);

  const openStep = openId ? steps.find((s) => s.id === openId) : null;

  if (variant === 'compact-side') {
    return (
      <div className="corso-pipe corso-pipe--side" aria-hidden>
        <ol className="corso-pipe__list">
          {steps.map((s) => (
            <li
              key={s.id}
              className={stepClass(s, highlightId, completedIds, dimmedIds)}
              style={s.color ? ({ ['--corso-step-color' as never]: s.color } as React.CSSProperties) : undefined}
            >
              <span className="corso-pipe__bullet" />
              <span className="corso-pipe__label">{s.label}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  // Variante 'full': pipeline verticale interattiva con pannello descrittivo.
  return (
    <div className="corso-pipe corso-pipe--full">
      <ol className="corso-pipe__list">
        {steps.map((s) => (
          <li
            key={s.id}
            className={`${stepClass(s, highlightId, completedIds, dimmedIds)} ${openId === s.id ? 'corso-pipe__step--open' : ''}`}
            style={s.color ? ({ ['--corso-step-color' as never]: s.color } as React.CSSProperties) : undefined}
          >
            <button
              type="button"
              className="corso-pipe__btn"
              onClick={() => setOpenId(openId === s.id ? null : s.id)}
              aria-expanded={openId === s.id}
            >
              <span className="corso-pipe__bullet" />
              <span className="corso-pipe__labels">
                <span className="corso-pipe__label">{s.label}</span>
                {s.sublabel && <span className="corso-pipe__sublabel">{s.sublabel}</span>}
              </span>
              {s.control && (
                <span className="corso-pipe__control" title={s.control.label}>
                  {s.control.code}
                </span>
              )}
            </button>
          </li>
        ))}
      </ol>

      <aside className="corso-pipe__panel" aria-live="polite">
        {openStep ? (
          <div className="corso-pipe__panel-body">
            <header className="corso-pipe__panel-head">
              <span
                className="corso-pipe__panel-badge"
                style={openStep.color ? { background: openStep.color } : undefined}
              >
                {openStep.label}
              </span>
              {openStep.sublabel && (
                <span className="corso-pipe__panel-sub">{openStep.sublabel}</span>
              )}
            </header>
            {openStep.glossario && (
              <p className="corso-pipe__panel-text">{openStep.glossario}</p>
            )}
            {openStep.control && (
              <div className="corso-pipe__panel-control">
                <strong>{openStep.control.code} — {openStep.control.label}</strong>
                {openStep.control.domanda && (
                  <em className="corso-pipe__panel-control-domanda">{openStep.control.domanda}</em>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="corso-pipe__panel-hint">Clicca su uno step per leggerne la funzione.</p>
        )}
      </aside>
    </div>
  );
}
