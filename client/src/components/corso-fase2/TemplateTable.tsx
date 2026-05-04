import { useEffect, useState } from 'react';
import { TemplateTableConfig } from '../../data/corso-fase2/types';

interface Props {
  config: TemplateTableConfig;
}

export default function TemplateTable({ config }: Props) {
  const { header, sezioni, formulaSintesi, formulaCompilata } = config;
  const [filled, setFilled] = useState<Set<number>>(new Set());
  const [formulaFilled, setFormulaFilled] = useState(false);

  useEffect(() => {
    setFilled(new Set());
    setFormulaFilled(false);
  }, [config]);

  const allFilled = sezioni.every((s) => filled.has(s.numero));

  const toggleAll = () => {
    if (allFilled) {
      setFilled(new Set());
      setFormulaFilled(false);
    } else {
      setFilled(new Set(sezioni.map((s) => s.numero)));
      setFormulaFilled(true);
    }
  };

  const toggleRow = (numero: number) => {
    setFilled((prev) => {
      const next = new Set(prev);
      if (next.has(numero)) next.delete(numero);
      else next.add(numero);
      return next;
    });
  };

  return (
    <div className="corso-tpl">
      <div className="corso-tpl__header">
        <div className="corso-tpl__chip">
          <span className="corso-tpl__chip-label">Template</span>
          <span>{header.titolo}</span>
        </div>
        {header.nodo && (
          <div className="corso-tpl__chip">
            <span className="corso-tpl__chip-label">Nodo</span>
            <span>{header.nodo}</span>
          </div>
        )}
        {header.concettoPonte && (
          <div className="corso-tpl__chip">
            <span className="corso-tpl__chip-label">Concetto-ponte</span>
            <span>{header.concettoPonte}</span>
          </div>
        )}
      </div>

      <div className="corso-tpl__controls">
        <button type="button" className="corso-tpl__action" onClick={toggleAll}>
          {allFilled ? 'Nascondi compilazione' : 'Mostra compilazione caso-guida'}
        </button>
        <span className="corso-tpl__hint">Oppure clicca su una riga per compilarla singolarmente.</span>
      </div>

      <div className="corso-tpl__rows">
        {sezioni.map((s) => {
          const isFilled = filled.has(s.numero);
          return (
            <button
              key={s.numero}
              type="button"
              className={`corso-tpl__row ${isFilled ? 'corso-tpl__row--filled' : ''}`}
              onClick={() => toggleRow(s.numero)}
              aria-pressed={isFilled}
            >
              <span className="corso-tpl__num">{s.numero}</span>
              <div className="corso-tpl__meta">
                <span className="corso-tpl__sezione">{s.sezione}</span>
                <em className="corso-tpl__domanda">{s.domanda}</em>
              </div>
              <div className="corso-tpl__campo">
                {isFilled ? (
                  <span className="corso-tpl__campo-filled">{s.compilazione}</span>
                ) : (
                  <span className="corso-tpl__campo-empty">{s.campoVuoto}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="corso-tpl__formula">
        <div className="corso-tpl__formula-head">
          <span>Formula di sintesi</span>
          <button
            type="button"
            className="corso-tpl__action corso-tpl__action--ghost"
            onClick={() => setFormulaFilled((v) => !v)}
          >
            {formulaFilled ? 'Mostra modello vuoto' : 'Mostra formula compilata'}
          </button>
        </div>
        <p className={`corso-tpl__formula-body ${formulaFilled ? 'corso-tpl__formula-body--filled' : ''}`}>
          <em>{formulaFilled ? formulaCompilata : formulaSintesi}</em>
        </p>
      </div>
    </div>
  );
}
