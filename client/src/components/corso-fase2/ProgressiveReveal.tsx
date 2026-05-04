import { useEffect, useState } from 'react';
import { ProgressiveRevealConfig } from '../../data/corso-fase2/types';

interface Props {
  config: ProgressiveRevealConfig;
}

export default function ProgressiveReveal({ config }: Props) {
  const { items, conclusionHtml, ctaShow = 'Mostra prossimo elemento' } = config;
  const [revealed, setRevealed] = useState(1);

  // Reset al cambio di config (cambio slide).
  useEffect(() => {
    setRevealed(1);
  }, [config]);

  const total = items.length;
  const allRevealed = revealed >= total;

  return (
    <div className="corso-reveal">
      <div className="corso-reveal__items">
        {items.slice(0, revealed).map((item) => (
          <article key={item.id} className="corso-reveal__item">
            {item.badge && <span className="corso-reveal__badge">{item.badge}</span>}
            <div className="corso-reveal__body">
              <h3 className="corso-reveal__title">{item.title}</h3>
              <div
                className="corso-reveal__content"
                dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
              />
            </div>
          </article>
        ))}
      </div>

      {!allRevealed ? (
        <div className="corso-reveal__controls">
          <button
            type="button"
            className="corso-reveal__btn"
            onClick={() => setRevealed((r) => Math.min(r + 1, total))}
          >
            {ctaShow} <span className="corso-reveal__counter">{revealed} / {total}</span>
          </button>
        </div>
      ) : (
        conclusionHtml && (
          <>
            <hr className="corso-divider" />
            <div
              className="corso-reveal__conclusion"
              dangerouslySetInnerHTML={{ __html: conclusionHtml }}
            />
          </>
        )
      )}
    </div>
  );
}
