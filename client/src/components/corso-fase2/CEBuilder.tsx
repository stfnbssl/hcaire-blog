import { useEffect, useMemo, useState } from 'react';
import { CEBuilderConfig, CEPreset } from '../../data/corso-fase2/types';

interface Props {
  config: CEBuilderConfig;
}

const NODES = ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'];

const STATES = [
  { code: '↑', label: 'Espansivo', color: '#27ae60' },
  { code: '~', label: 'Stabile', color: '#2980b9' },
  { code: '↓', label: 'Ristretto', color: '#e67e22' },
  { code: '!', label: 'Disorganizzato', color: '#e74c3c' },
  { code: '?', label: 'Non leggibile', color: '#95a5a6' },
];

const RELATIONS = [
  { code: 'CPL', label: 'Sostegno', color: '#27ae60' },
  { code: 'VIN', label: 'Vincolo', color: '#e74c3c' },
  { code: 'MED', label: 'Mediazione', color: '#2980b9' },
  { code: 'CMP', label: 'Compensazione', color: '#e67e22' },
];

const DIRECTIONS = [
  { code: '↗', label: 'Espansione', color: '#27ae60' },
  { code: '→', label: 'Stabilizzazione', color: '#2980b9' },
  { code: '↘', label: 'Restringimento', color: '#e74c3c' },
];

const STABILITY = [
  { code: 'T1', label: 'Situazionale', color: '#95a5a6' },
  { code: 'T2', label: 'Ricorrente', color: '#e67e22' },
  { code: 'T3', label: 'Stabilizzata', color: '#e74c3c' },
];

const HABITABILITY = [
  { code: 'A+', label: 'Alta', color: '#27ae60' },
  { code: 'A±', label: 'Fragile', color: '#e67e22' },
  { code: 'A−', label: 'Rischio', color: '#e74c3c' },
];

const DEFAULT_CE: CEPreset = {
  S: { N1: '~', N2: '~', N3: '~', N4: '~', N5: '~', N6: '~', N7: '~' },
  R: null,
  D: '→',
  T: 'T1',
  A: 'A±',
};

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

function generaTestoNaturale(ce: CEPreset, texts: CEBuilderConfig['texts']): string {
  // 1. Frammenti dei Nodi non-stabili e non-non-leggibili.
  const nodiSalienti = NODES.map((n) => {
    const stato = ce.S[n];
    if (!stato || stato === '?' || stato === '~') return null;
    return texts.nodi[n]?.[stato] ?? null;
  }).filter(Boolean) as string[];

  const nodoPrincipale =
    nodiSalienti.length > 0
      ? nodiSalienti.slice(0, 2).join(', ')
      : texts.nodi.N2?.['~'] ?? 'campo stabile';

  const frammenti: string[] = [capitalize(nodoPrincipale)];

  if (ce.R && texts.relazioni[ce.R]) {
    frammenti.push(`con ${texts.relazioni[ce.R]}`);
  }

  if (texts.direzioni[ce.D]) {
    frammenti.push(texts.direzioni[ce.D]);
  }

  const frase1 = frammenti.join(', ') + '.';
  const t = texts.stabilita[ce.T] || '';
  const a = texts.abitabilita[ce.A] || '';
  const frase2 = t || a ? `${capitalize(t)}${t && a ? '; ' : ''}${a}.` : '';
  return [frase1, frase2].filter(Boolean).join(' ');
}

function formatCEBlock(ce: CEPreset): string {
  const sLine = NODES.map((n) => `${n}${ce.S[n] ?? '?'}`).join(' ');
  const rLine = ce.R ?? '—';
  return `CE =
  S: ${sLine}
  R: ${rLine}
  D: ${ce.D}
  T: ${ce.T}
  A: ${ce.A}`;
}

export default function CEBuilder({ config }: Props) {
  const [ce, setCe] = useState<CEPreset>(config.preset ?? DEFAULT_CE);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCe(config.preset ?? DEFAULT_CE);
  }, [config]);

  const block = useMemo(() => formatCEBlock(ce), [ce]);
  const naturalText = useMemo(
    () => generaTestoNaturale(ce, config.texts),
    [ce, config.texts],
  );

  const setNodeState = (nodeId: string, state: string) => {
    setCe((prev) => ({ ...prev, S: { ...prev.S, [nodeId]: state } }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(block);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API può fallire (es. file:// o iframe senza permesso); silenzioso.
    }
  };

  const loadPreset = () => {
    if (config.preset) setCe(config.preset);
  };

  const reset = () => setCe(DEFAULT_CE);

  return (
    <div className="corso-ceb">
      <div className="corso-ceb__panes">
        <div className="corso-ceb__selectors">
          <div className="corso-ceb__actions">
            {config.preset && (
              <button
                type="button"
                className="corso-ceb__action corso-ceb__action--ghost"
                onClick={loadPreset}
              >
                {config.presetLabel ?? 'Carica preset'}
              </button>
            )}
            <button
              type="button"
              className="corso-ceb__action corso-ceb__action--ghost"
              onClick={reset}
            >
              Reset
            </button>
          </div>

          <div className="corso-ceb__group">
            <div className="corso-ceb__group-head">
              <span className="corso-ceb__group-code">S</span>
              <span className="corso-ceb__group-name">Stato dei nodi</span>
            </div>
            <div className="corso-ceb__nodes">
              {NODES.map((n) => (
                <div key={n} className="corso-ceb__node-row">
                  <span className="corso-ceb__node-label">{n}</span>
                  <div className="corso-ceb__radio-group">
                    {STATES.map((s) => {
                      const active = ce.S[n] === s.code;
                      return (
                        <button
                          key={s.code}
                          type="button"
                          className={`corso-ceb__radio ${active ? 'corso-ceb__radio--active' : ''}`}
                          style={
                            active
                              ? ({
                                  background: s.color,
                                  borderColor: s.color,
                                } as React.CSSProperties)
                              : undefined
                          }
                          onClick={() => setNodeState(n, s.code)}
                          title={s.label}
                          aria-pressed={active}
                        >
                          {s.code}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="corso-ceb__group">
            <div className="corso-ceb__group-head">
              <span className="corso-ceb__group-code">R</span>
              <span className="corso-ceb__group-name">Relazione dominante</span>
            </div>
            <div className="corso-ceb__radio-group">
              <button
                type="button"
                className={`corso-ceb__radio corso-ceb__radio--wide ${ce.R === null ? 'corso-ceb__radio--active' : ''}`}
                onClick={() => setCe((p) => ({ ...p, R: null }))}
                aria-pressed={ce.R === null}
              >
                — nessuna
              </button>
              {RELATIONS.map((r) => {
                const active = ce.R === r.code;
                return (
                  <button
                    key={r.code}
                    type="button"
                    className={`corso-ceb__radio corso-ceb__radio--wide ${active ? 'corso-ceb__radio--active' : ''}`}
                    style={
                      active
                        ? ({ background: r.color, borderColor: r.color } as React.CSSProperties)
                        : undefined
                    }
                    onClick={() => setCe((p) => ({ ...p, R: r.code }))}
                    title={r.label}
                    aria-pressed={active}
                  >
                    {r.code}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="corso-ceb__row-group">
            <div className="corso-ceb__group corso-ceb__group--inline">
              <div className="corso-ceb__group-head">
                <span className="corso-ceb__group-code">D</span>
                <span className="corso-ceb__group-name">Direzione</span>
              </div>
              <div className="corso-ceb__radio-group">
                {DIRECTIONS.map((d) => {
                  const active = ce.D === d.code;
                  return (
                    <button
                      key={d.code}
                      type="button"
                      className={`corso-ceb__radio ${active ? 'corso-ceb__radio--active' : ''}`}
                      style={
                        active
                          ? ({ background: d.color, borderColor: d.color } as React.CSSProperties)
                          : undefined
                      }
                      onClick={() => setCe((p) => ({ ...p, D: d.code }))}
                      title={d.label}
                      aria-pressed={active}
                    >
                      {d.code}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="corso-ceb__group corso-ceb__group--inline">
              <div className="corso-ceb__group-head">
                <span className="corso-ceb__group-code">T</span>
                <span className="corso-ceb__group-name">Stabilità</span>
              </div>
              <div className="corso-ceb__radio-group">
                {STABILITY.map((t) => {
                  const active = ce.T === t.code;
                  return (
                    <button
                      key={t.code}
                      type="button"
                      className={`corso-ceb__radio ${active ? 'corso-ceb__radio--active' : ''}`}
                      style={
                        active
                          ? ({ background: t.color, borderColor: t.color } as React.CSSProperties)
                          : undefined
                      }
                      onClick={() => setCe((p) => ({ ...p, T: t.code }))}
                      title={t.label}
                      aria-pressed={active}
                    >
                      {t.code}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="corso-ceb__group corso-ceb__group--inline">
              <div className="corso-ceb__group-head">
                <span className="corso-ceb__group-code">A</span>
                <span className="corso-ceb__group-name">Abitabilità</span>
              </div>
              <div className="corso-ceb__radio-group">
                {HABITABILITY.map((a) => {
                  const active = ce.A === a.code;
                  return (
                    <button
                      key={a.code}
                      type="button"
                      className={`corso-ceb__radio ${active ? 'corso-ceb__radio--active' : ''}`}
                      style={
                        active
                          ? ({ background: a.color, borderColor: a.color } as React.CSSProperties)
                          : undefined
                      }
                      onClick={() => setCe((p) => ({ ...p, A: a.code }))}
                      title={a.label}
                      aria-pressed={active}
                    >
                      {a.code}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="corso-ceb__output">
          <div className="corso-ceb__output-head">
            <span>CE risultante</span>
            <button
              type="button"
              className="corso-ceb__action"
              onClick={handleCopy}
              disabled={copied}
            >
              {copied ? '✓ Copiato' : 'Copia CE'}
            </button>
          </div>
          <pre className="corso-ceb__block">{block}</pre>

          <div className="corso-ceb__natural">
            <span className="corso-ceb__natural-label">Testo naturale</span>
            <p>
              <em>{naturalText}</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
