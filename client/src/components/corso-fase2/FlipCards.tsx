import { useEffect, useState } from 'react';
import { FlipCardsConfig } from '../../data/corso-fase2/types';

interface Props {
  config: FlipCardsConfig;
}

export default function FlipCards({ config }: Props) {
  const { cards, cols = 5, reformulationTable } = config;
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [tableOpen, setTableOpen] = useState(false);

  useEffect(() => {
    setFlipped(new Set());
    setTableOpen(false);
  }, [config]);

  const toggleCard = (id: string) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allFlipped = cards.every((c) => flipped.has(c.id));

  const flipAll = () => {
    if (allFlipped) {
      setFlipped(new Set());
    } else {
      setFlipped(new Set(cards.map((c) => c.id)));
    }
  };

  const gridStyle = { ['--cf2-flip-cols' as never]: String(cols) } as React.CSSProperties;

  return (
    <div className="cf2-flip">
      <div className="cf2-flip__controls">
        <button type="button" className="cf2-flip__action" onClick={flipAll}>
          {allFlipped ? 'Torna al fronte' : 'Gira tutte'}
        </button>
      </div>

      <div className="cf2-flip__grid" style={gridStyle}>
        {cards.map((card) => {
          const isFlipped = flipped.has(card.id);
          return (
            <button
              key={card.id}
              type="button"
              className={`cf2-flip__card ${isFlipped ? 'cf2-flip__card--flipped' : ''}`}
              onClick={() => toggleCard(card.id)}
              aria-pressed={isFlipped}
            >
              <div className="cf2-flip__inner">
                <div className="cf2-flip__face cf2-flip__face--front">
                  {card.number && <span className="cf2-flip__num">{card.number}</span>}
                  <span className="cf2-flip__title">{card.title}</span>
                  {card.question && <em className="cf2-flip__q">{card.question}</em>}
                  <span className="cf2-flip__hint" aria-hidden>↩ gira</span>
                </div>
                <div className="cf2-flip__face cf2-flip__face--back">
                  <div className="cf2-flip__back-section cf2-flip__back-section--valid">
                    <span className="cf2-flip__back-label">✓ Valido</span>
                    <p className="cf2-flip__back-text">{card.valid.text}</p>
                    {card.valid.perche && (
                      <em className="cf2-flip__back-perche">{card.valid.perche}</em>
                    )}
                  </div>
                  <div className="cf2-flip__back-section cf2-flip__back-section--invalid">
                    <span className="cf2-flip__back-label">✗ Non valido</span>
                    <p className="cf2-flip__back-text">{card.invalid.text}</p>
                    {card.invalid.perche && (
                      <em className="cf2-flip__back-perche">{card.invalid.perche}</em>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {reformulationTable && (
        <div className="cf2-flip__table">
          <button
            type="button"
            className="cf2-flip__table-toggle"
            onClick={() => setTableOpen((v) => !v)}
            aria-expanded={tableOpen}
          >
            <span aria-hidden>{tableOpen ? '−' : '+'}</span> {reformulationTable.title}
          </button>
          {tableOpen && (
            <table className="cf2-table">
              <thead>
                <tr>
                  <th>{reformulationTable.headers[0]}</th>
                  <th>{reformulationTable.headers[1]}</th>
                </tr>
              </thead>
              <tbody>
                {reformulationTable.rows.map((row, i) => (
                  <tr key={i}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
