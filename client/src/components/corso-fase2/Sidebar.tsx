import { Module } from '../../data/corso-fase2/types';

interface Props {
  modules: Module[];
  currentModuleId: string;
  onSelect: (moduleId: string) => void;
}

export default function Sidebar({ modules, currentModuleId, onSelect }: Props) {
  return (
    <aside className="cf2-sidebar" aria-label="Moduli del corso">
      <div className="cf2-sidebar__head">
        <div className="cf2-sidebar__eyebrow">Fase 2</div>
        <div className="cf2-sidebar__title">Traduzione interdisciplinare</div>
      </div>
      <ul className="cf2-sidebar__list">
        {modules.map((m) => {
          const isActive = m.id === currentModuleId;
          return (
            <li key={m.id}>
              <button
                type="button"
                className={`cf2-sidebar__item ${isActive ? 'cf2-sidebar__item--active' : ''} ${m.placeholder ? 'cf2-sidebar__item--placeholder' : ''}`}
                onClick={() => onSelect(m.id)}
                style={isActive ? ({ ['--cf2-item-accent' as never]: m.accent } as React.CSSProperties) : undefined}
              >
                <span className="cf2-sidebar__num">M{m.number}</span>
                <span className="cf2-sidebar__name">{m.shortTitle ?? m.title}</span>
                {m.placeholder && <span className="cf2-sidebar__tag">in arrivo</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="cf2-sidebar__foot">
        <p>Corso per professionisti della prima infanzia.</p>
        <p className="cf2-sidebar__foot-muted">Pediatri · educatori · psicologi · coordinatori.</p>
      </div>
    </aside>
  );
}
