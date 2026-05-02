import { ComparisonPanelConfig } from '../../data/corso-fase2/types';

interface Props {
  config: ComparisonPanelConfig;
}

export default function ComparisonPanel({ config }: Props) {
  const { valid, invalid, label } = config;

  return (
    <div className="cf2-cmp">
      {label && <div className="cf2-cmp__label">{label}</div>}

      <div className="cf2-cmp__grid">
        <section className="cf2-cmp__col cf2-cmp__col--valid">
          <header className="cf2-cmp__head">
            <span className="cf2-cmp__icon" aria-hidden>✓</span>
            <h3 className="cf2-cmp__title">{valid.title}</h3>
          </header>
          {valid.content && (
            <div
              className="cf2-cmp__content"
              dangerouslySetInnerHTML={{ __html: valid.content }}
            />
          )}
          {valid.items && valid.items.length > 0 && (
            <ul className="cf2-cmp__list">
              {valid.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="cf2-cmp__col cf2-cmp__col--invalid">
          <header className="cf2-cmp__head">
            <span className="cf2-cmp__icon" aria-hidden>✗</span>
            <h3 className="cf2-cmp__title">{invalid.title}</h3>
          </header>
          {invalid.content && (
            <div
              className="cf2-cmp__content"
              dangerouslySetInnerHTML={{ __html: invalid.content }}
            />
          )}
          {invalid.items && invalid.items.length > 0 && (
            <ul className="cf2-cmp__items">
              {invalid.items.map((item, i) => (
                <li key={i} className="cf2-cmp__item">
                  <span className="cf2-cmp__item-text">{item.text}</span>
                  {item.problem && (
                    <span className="cf2-cmp__item-problem">{item.problem}</span>
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
