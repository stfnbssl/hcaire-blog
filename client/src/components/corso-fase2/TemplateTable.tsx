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
    <div className="cf2-tpl">
      <div className="cf2-tpl__header">
        <div className="cf2-tpl__chip">
          <span className="cf2-tpl__chip-label">Template</span>
          <span>{header.titolo}</span>
        </div>
        {header.nodo && (
          <div className="cf2-tpl__chip">
            <span className="cf2-tpl__chip-label">Nodo</span>
            <span>{header.nodo}</span>
          </div>
        )}
        {header.concettoPonte && (
          <div className="cf2-tpl__chip">
            <span className="cf2-tpl__chip-label">Concetto-ponte</span>
            <span>{header.concettoPonte}</span>
          </div>
        )}
      </div>

      <div className="cf2-tpl__controls">
        <button type="button" className="cf2-tpl__action" onClick={toggleAll}>
          {allFilled ? 'Nascondi compilazione' : 'Mostra compilazione caso-guida'}
        </button>
        <span className="cf2-tpl__hint">Oppure clicca su una riga per compilarla singolarmente.</span>
      </div>

      <div className="cf2-tpl__rows">
        {sezioni.map((s) => {
          const isFilled = filled.has(s.numero);
          return (
            <button
              key={s.numero}
              type="button"
              className={`cf2-tpl__row ${isFilled ? 'cf2-tpl__row--filled' : ''}`}
              onClick={() => toggleRow(s.numero)}
              aria-pressed={isFilled}
            >
              <span className="cf2-tpl__num">{s.numero}</span>
              <div className="cf2-tpl__meta">
                <span className="cf2-tpl__sezione">{s.sezione}</span>
                <em className="cf2-tpl__domanda">{s.domanda}</em>
              </div>
              <div className="cf2-tpl__campo">
                {isFilled ? (
                  <span className="cf2-tpl__campo-filled">{s.compilazione}</span>
                ) : (
                  <span className="cf2-tpl__campo-empty">{s.campoVuoto}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="cf2-tpl__formula">
        <div className="cf2-tpl__formula-head">
          <span>Formula di sintesi</span>
          <button
            type="button"
            className="cf2-tpl__action cf2-tpl__action--ghost"
            onClick={() => setFormulaFilled((v) => !v)}
          >
            {formulaFilled ? 'Mostra modello vuoto' : 'Mostra formula compilata'}
          </button>
        </div>
        <p className={`cf2-tpl__formula-body ${formulaFilled ? 'cf2-tpl__formula-body--filled' : ''}`}>
          <em>{formulaFilled ? formulaCompilata : formulaSintesi}</em>
        </p>
      </div>
    </div>
  );
}
