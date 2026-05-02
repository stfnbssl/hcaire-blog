import { useEffect, useState } from 'react';
import { ExpandableCardsConfig } from '../../data/corso-fase2/types';

export default function ExpandableCards({ config }: { config: ExpandableCardsConfig }) {
  const { cards, multiOpen = false, defaultOpen = [], layout = 'vertical' } = config;
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen));

  // Reset apertura quando cambia il config (es. cambio slide).
  useEffect(() => {
    setOpen(new Set(defaultOpen));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(multiOpen ? prev : []);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={`cf2-cards cf2-cards--${layout}`}>
      {cards.map((card) => {
        const isOpen = open.has(card.id);
        return (
          <article
            key={card.id}
            className={`cf2-card ${isOpen ? 'cf2-card--open' : ''}`}
            style={card.color ? ({ ['--cf2-card-accent' as never]: card.color } as React.CSSProperties) : undefined}
          >
            <button
              type="button"
              className="cf2-card__head"
              onClick={() => toggle(card.id)}
              aria-expanded={isOpen}
            >
              {card.badge && <span className="cf2-card__badge">{card.badge}</span>}
              <span className="cf2-card__title">{card.title}</span>
              {card.summary && <span className="cf2-card__summary">{card.summary}</span>}
              <span className="cf2-card__chevron" aria-hidden>{isOpen ? '–' : '+'}</span>
            </button>
            {isOpen && (
              <div className="cf2-card__body" dangerouslySetInnerHTML={{ __html: card.detail }} />
            )}
          </article>
        );
      })}
    </div>
  );
}
