import { ComparisonPanelConfig } from '../../data/corso-fase2/types';

interface Props {
  config: ComparisonPanelConfig;
}

export default function ComparisonPanel({ config }: Props) {
  const { valid, invalid, label } = config;

  return (
    <div className="corso-cmp">
      {label && <div className="corso-cmp__label">{label}</div>}

      <div className="corso-cmp__grid">
        <section className="corso-cmp__col corso-cmp__col--valid">
          <header className="corso-cmp__head">
            <span className="corso-cmp__icon" aria-hidden>âœ“</span>
            <h3 className="corso-cmp__title">{valid.title}</h3>
          </header>
          {valid.content && (
            <div
              className="corso-cmp__content"
              dangerouslySetInnerHTML={{ __html: valid.content }}
            />
          )}
          {valid.items && valid.items.length > 0 && (
            <ul className="corso-cmp__list">
              {valid.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="corso-cmp__col corso-cmp__col--invalid">
          <header className="corso-cmp__head">
            <span className="corso-cmp__icon" aria-hidden>âœ—</span>
            <h3 className="corso-cmp__title">{invalid.title}</h3>
          </header>
          {invalid.content && (
            <div
              className="corso-cmp__content"
              dangerouslySetInnerHTML={{ __html: invalid.content }}
            />
          )}
          {invalid.items && invalid.items.length > 0 && (
            <ul className="corso-cmp__items">
              {invalid.items.map((item, i) => (
                <li key={i} className="corso-cmp__item">
                  <span className="corso-cmp__item-text">{item.text}</span>
                  {item.problem && (
                    <span className="corso-cmp__item-problem">{item.problem}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
