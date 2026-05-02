import { useEffect, useRef, useState } from 'react';
import { InteractiveMatrixConfig } from '../../data/corso-fase2/types';

interface Props {
  config: InteractiveMatrixConfig;
}

interface OpenCell {
  rowId: string;
  colId: string;
  rect: DOMRect;
}

const POPOVER_W = 360;
const POPOVER_MAX_H = 380;
const PAD = 12;

function computePopoverStyle(rect: DOMRect): React.CSSProperties {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Preferisci a destra della cella; se non c'è spazio passa a sinistra,
  // altrimenti centra orizzontalmente sopra/sotto.
  let left = rect.right + 8;
  if (left + POPOVER_W + PAD > vw) {
    const leftAlt = rect.left - POPOVER_W - 8;
    if (leftAlt >= PAD) {
      left = leftAlt;
    } else {
      left = Math.max(PAD, Math.min(vw - POPOVER_W - PAD, rect.left));
    }
  }

  // Allinea in verticale alla cella, ma vincola al viewport.
  let top = rect.top;
  if (top + POPOVER_MAX_H + PAD > vh) {
    top = Math.max(PAD, vh - POPOVER_MAX_H - PAD);
  }

  return {
    position: 'fixed',
    top,
    left,
    width: POPOVER_W,
    maxHeight: POPOVER_MAX_H,
  };
}

export default function InteractiveMatrix({ config }: Props) {
  const { rows, cols, cells } = config;
  const [openCell, setOpenCell] = useState<OpenCell | null>(null);
  const [filterCol, setFilterCol] = useState<string | null>(null);
  const [filterRow, setFilterRow] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpenCell(null);
    setFilterCol(null);
    setFilterRow(null);
  }, [config]);

  // Chiudi il popover su resize o ESC; su scroll solo se proviene da fuori
  // dal popover (così la rotella e lo scrollbar interni continuano a funzionare).
  useEffect(() => {
    if (!openCell) return;
    const close = () => setOpenCell(null);
    const onScroll = (e: Event) => {
      const target = e.target as Node | null;
      if (target && popoverRef.current?.contains(target)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', close);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [openCell]);

  const open = openCell
    ? {
        row: rows.find((r) => r.id === openCell.rowId),
        col: cols.find((c) => c.id === openCell.colId),
        cell: cells[openCell.rowId]?.[openCell.colId],
        key: `${openCell.rowId}:${openCell.colId}`,
        style: computePopoverStyle(openCell.rect),
      }
    : null;

  const isDim = (rowId: string, colId: string): boolean => {
    if (filterCol && filterCol !== colId) return true;
    if (filterRow && filterRow !== rowId) return true;
    return false;
  };

  const handleCellClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    rowId: string,
    colId: string,
  ) => {
    const key = `${rowId}:${colId}`;
    if (open?.key === key) {
      setOpenCell(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setOpenCell({ rowId, colId, rect });
  };

  const gridStyle = {
    gridTemplateColumns: `minmax(160px, 1.2fr) repeat(${cols.length}, minmax(180px, 1fr))`,
  } as React.CSSProperties;

  return (
    <div className="cf2-matrix">
      <div className="cf2-matrix__filters">
        <span className="cf2-matrix__filters-label">Filtra per contesto:</span>
        {cols.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`cf2-matrix__filter ${filterCol === c.id ? 'cf2-matrix__filter--active' : ''}`}
            style={c.color ? ({ ['--cf2-mx-color' as never]: c.color } as React.CSSProperties) : undefined}
            onClick={() => setFilterCol(filterCol === c.id ? null : c.id)}
          >
            {c.icon && <span aria-hidden>{c.icon}</span>} {c.label}
          </button>
        ))}
      </div>

      <div className="cf2-matrix__scroll">
        <div className="cf2-matrix__grid" style={gridStyle}>
          <div className="cf2-matrix__corner" />
          {cols.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`cf2-matrix__col-head ${filterCol === c.id ? 'cf2-matrix__col-head--active' : ''}`}
              style={c.color ? ({ ['--cf2-mx-color' as never]: c.color } as React.CSSProperties) : undefined}
              onClick={() => setFilterCol(filterCol === c.id ? null : c.id)}
              title={`Filtra: ${c.label}`}
            >
              {c.icon && <span className="cf2-matrix__col-icon" aria-hidden>{c.icon}</span>}
              <span className="cf2-matrix__col-label">{c.label}</span>
              {c.sublabel && <span className="cf2-matrix__col-sub">{c.sublabel}</span>}
            </button>
          ))}

          {rows.map((r) => (
            <div key={r.id} style={{ display: 'contents' }}>
              <button
                type="button"
                className={`cf2-matrix__row-head ${filterRow === r.id ? 'cf2-matrix__row-head--active' : ''}`}
                style={r.color ? ({ ['--cf2-mx-color' as never]: r.color } as React.CSSProperties) : undefined}
                onClick={() => setFilterRow(filterRow === r.id ? null : r.id)}
                title={`Filtra: ${r.label}`}
              >
                <span className="cf2-matrix__row-badge">{r.label}</span>
                {r.sublabel && <span className="cf2-matrix__row-sub">{r.sublabel}</span>}
              </button>
              {cols.map((c) => {
                const cell = cells[r.id]?.[c.id];
                const key = `${r.id}:${c.id}`;
                const dim = isDim(r.id, c.id);
                return (
                  <button
                    key={key}
                    type="button"
                    className={`cf2-matrix__cell ${dim ? 'cf2-matrix__cell--dim' : ''} ${open?.key === key ? 'cf2-matrix__cell--open' : ''}`}
                    onClick={(e) => handleCellClick(e, r.id, c.id)}
                    disabled={!cell}
                  >
                    {cell?.domanda ?? '—'}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {open && open.cell && open.row && open.col && (
        <>
          <div
            className="cf2-matrix__popover-backdrop"
            onClick={() => setOpenCell(null)}
            aria-hidden
          />
          <div
            ref={popoverRef}
            className="cf2-matrix__popover"
            style={open.style}
            role="dialog"
            aria-label="Dettaglio cella matrice"
          >
            <header className="cf2-matrix__popover-head">
              <span
                className="cf2-matrix__panel-badge"
                style={open.row.color ? { background: open.row.color } : undefined}
              >
                {open.row.label}
              </span>
              <span className="cf2-matrix__panel-sep">×</span>
              <span
                className="cf2-matrix__panel-badge"
                style={open.col.color ? { background: open.col.color } : undefined}
              >
                {open.col.icon} {open.col.label}
              </span>
              <button
                type="button"
                className="cf2-matrix__panel-close"
                onClick={() => setOpenCell(null)}
                aria-label="Chiudi pannello"
              >
                ✕
              </button>
            </header>
            <div className="cf2-matrix__popover-body">
              <section>
                <h4>Domanda professionale</h4>
                <p>{open.cell.domanda}</p>
              </section>
              {open.cell.lettura && (
                <section className="cf2-matrix__panel-section--valid">
                  <h4>✓ Lettura valida</h4>
                  <p><em>{open.cell.lettura}</em></p>
                </section>
              )}
              {open.cell.errore && (
                <section className="cf2-matrix__panel-section--invalid">
                  <h4>⚠ Errore da evitare</h4>
                  <p>{open.cell.errore}</p>
                </section>
              )}
              {open.cell.output && (
                <section>
                  <h4>Output possibile</h4>
                  <p>{open.cell.output}</p>
                </section>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
