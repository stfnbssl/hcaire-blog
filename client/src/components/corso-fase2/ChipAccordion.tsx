import { useEffect, useState } from 'react';
import { ChipAccordionConfig } from '../../data/corso-fase2/types';

interface Props {
  config: ChipAccordionConfig;
}

export default function ChipAccordion({ config }: Props) {
  const { items } = config;
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setOpenId(null);
  }, [config]);

  const open = openId ? items.find((i) => i.id === openId) : null;

  return (
    <div className="cf2-chip-acc">
      <div className="cf2-chip-acc__chips">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`cf2-chip-acc__chip ${openId === item.id ? 'cf2-chip-acc__chip--active' : ''}`}
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            aria-expanded={openId === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>
      {open && (
        <div
          className="cf2-chip-acc__panel"
          dangerouslySetInnerHTML={{ __html: open.bodyHtml }}
        />
      )}
    </div>
  );
}
