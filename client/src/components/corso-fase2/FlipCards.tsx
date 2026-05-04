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

  const gridStyle = { ['--corso-flip-cols' as never]: String(cols) } as React.CSSProperties;

  return (
    <div className="corso-flip">
      <div className="corso-flip__controls">
        <button type="button" className="corso-flip__action" onClick={flipAll}>
          {allFlipped ? 'Torna al fronte' : 'Gira tutte'}
        </button>
      </div>

      <div className="corso-flip__grid" style={gridStyle}>
        {cards.map((card) => {
          const isFlipped = flipped.has(card.id);
          return (
            <button
              key={card.id}
              type="button"
              className={`corso-flip__card ${isFlipped ? 'corso-flip__card--flipped' : ''}`}
              onClick={() => toggleCard(card.id)}
              aria-pressed={isFlipped}
            >
              <div className="corso-flip__inner">
                <div className="corso-flip__face corso-flip__face--front">
                  {card.number && <span className="corso-flip__num">{card.number}</span>}
                  <span className="corso-flip__title">{card.title}</span>
                  {card.question && <em className="corso-flip__q">{card.question}</em>}
                  <span className="corso-flip__hint" aria-hidden>â†© gira</span>
                </div>
                <div className="corso-flip__face corso-flip__face--back">
                  <div className="corso-flip__back-section corso-flip__back-section--valid">
                    <span className="corso-flip__back-label">âœ“ Valido</span>
                    <p className="corso-flip__back-text">{card.valid.text}</p>
                    {card.valid.perche && (
                      <em className="corso-flip__back-perche">{card.valid.perche}</em>
                    )}
                  </div>
                  <div className="corso-flip__back-section corso-flip__back-section--invalid">
                    <span className="corso-flip__back-label">âœ— Non valido</span>
                    <p className="corso-flip__back-text">{card.invalid.text}</p>
                    {card.invalid.perche && (
                      <em className="corso-flip__back-perche">{card.invalid.perche}</em>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {reformulationTable && (
        <div className="corso-flip__table">
          <button
            type="button"
            className="corso-flip__table-toggle"
            onClick={() => setTableOpen((v) => !v)}
            aria-expanded={tableOpen}
          >
            <span aria-hidden>{tableOpen ? 'âˆ’' : '+'}</span> {reformulationTable.title}
          </button>
          {tableOpen && (
            <table className="corso-table">
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
