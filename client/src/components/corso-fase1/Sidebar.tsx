import type { Module } from '../../data/corso-fase1/types';

interface Props {
  modules: Module[];
  currentModuleId: string;
  onSelect: (moduleId: string) => void;
}

export default function Sidebar({ modules, currentModuleId, onSelect }: Props) {
  return (
    <aside className="corso-sidebar" aria-label="Moduli del corso">
      <div className="corso-sidebar__head">
        <div className="corso-sidebar__eyebrow">Fase 1</div>
        <div className="corso-sidebar__title">Fondazione ontologica</div>
      </div>
      <ul className="corso-sidebar__list">
        {modules.map((m) => {
          const isActive = m.id === currentModuleId;
          return (
            <li key={m.id}>
              <button
                type="button"
                className={`corso-sidebar__item ${isActive ? 'corso-sidebar__item--active' : ''} ${m.placeholder ? 'corso-sidebar__item--placeholder' : ''}`}
                onClick={() => onSelect(m.id)}
                style={isActive ? ({ ['--corso-item-accent' as never]: m.accent } as React.CSSProperties) : undefined}
              >
                <span className="corso-sidebar__num">M{m.number}</span>
                <span className="corso-sidebar__name">{m.shortTitle ?? m.title}</span>
                {m.placeholder && <span className="corso-sidebar__tag">in arrivo</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="corso-sidebar__foot">
        <p>Corso per professionisti della prima infanzia.</p>
        <p className="corso-sidebar__foot-muted">Pediatri · educatori · psicologi · coordinatori.</p>
      </div>
    </aside>
  );
}
