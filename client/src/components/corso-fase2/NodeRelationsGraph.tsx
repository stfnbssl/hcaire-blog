import { useEffect, useMemo, useState } from 'react';
import { NodeRelationsConfig } from '../../data/corso-fase2/types';

interface Props {
  config: NodeRelationsConfig;
}

const VB_W = 600;
const VB_H = 400;
const NODE_R = 30;
const MX = 120; // margine sinistro/destro nel viewBox
const MY = 80;  // margine alto/basso

function project(x: number, y: number): { cx: number; cy: number } {
  // Mappa x,y (0-100) sull'area utile [MX, VB_W-MX] × [MY, VB_H-MY].
  const cx = MX + (x / 100) * (VB_W - 2 * MX);
  const cy = MY + (y / 100) * (VB_H - 2 * MY);
  return { cx, cy };
}

function dashFor(style?: 'solid' | 'dashed' | 'dotted'): string | undefined {
  if (style === 'dashed') return '8 4';
  if (style === 'dotted') return '2 4';
  return undefined;
}

export default function NodeRelationsGraph({ config }: Props) {
  const { nodes, relations, relationTypes } = config;
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);

  useEffect(() => {
    setActiveNode(null);
    setActiveType(null);
  }, [config]);

  const positions = useMemo(() => {
    const map: Record<string, { cx: number; cy: number }> = {};
    nodes.forEach((n) => {
      map[n.id] = project(n.x, n.y);
    });
    return map;
  }, [nodes]);

  const typeById = useMemo(() => {
    const map: Record<string, (typeof relationTypes)[number]> = {};
    relationTypes.forEach((t) => (map[t.id] = t));
    return map;
  }, [relationTypes]);

  const isRelDim = (rel: typeof relations[number]): boolean => {
    if (activeType && rel.type !== activeType) return true;
    if (activeNode && rel.from !== activeNode && rel.to !== activeNode) return true;
    return false;
  };

  const isNodeDim = (id: string): boolean => {
    if (activeNode && activeNode !== id) {
      // se è collegato al nodo attivo, non sbiadire
      const connected = relations.some(
        (r) => (r.from === activeNode && r.to === id) || (r.to === activeNode && r.from === id),
      );
      if (!connected) return true;
    }
    return false;
  };

  return (
    <div className="cf2-noderel">
      <div className="cf2-noderel__legend">
        <span className="cf2-noderel__legend-label">Tipo di relazione:</span>
        {relationTypes.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`cf2-noderel__legend-item ${activeType === t.id ? 'cf2-noderel__legend-item--active' : ''}`}
            style={{ ['--cf2-rel-color' as never]: t.color } as React.CSSProperties}
            onClick={() => setActiveType(activeType === t.id ? null : t.id)}
            title={t.description}
          >
            <svg width="28" height="10" aria-hidden>
              <line
                x1="2"
                y1="5"
                x2="26"
                y2="5"
                stroke={t.color}
                strokeWidth={t.style === 'solid' ? 3 : 2}
                strokeDasharray={dashFor(t.style)}
              />
            </svg>
            <strong>{t.id}</strong> · {t.label}
          </button>
        ))}
        {(activeType || activeNode) && (
          <button
            type="button"
            className="cf2-noderel__legend-clear"
            onClick={() => {
              setActiveType(null);
              setActiveNode(null);
            }}
          >
            ✕ rimuovi filtri
          </button>
        )}
      </div>

      <div className="cf2-noderel__svg-wrap">
        <svg
          className="cf2-noderel__svg"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Grafo delle relazioni tra Nodi"
        >
          <defs>
            {relationTypes.map((t) => (
              <marker
                key={t.id}
                id={`cf2-arrow-${t.id}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" fill={t.color} />
              </marker>
            ))}
          </defs>

          {relations.map((rel, i) => {
            const a = positions[rel.from];
            const b = positions[rel.to];
            if (!a || !b) return null;
            const t = typeById[rel.type];
            if (!t) return null;
            const dx = b.cx - a.cx;
            const dy = b.cy - a.cy;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const ux = dx / dist;
            const uy = dy / dist;
            const startX = a.cx + ux * NODE_R;
            const startY = a.cy + uy * NODE_R;
            const endX = b.cx - ux * NODE_R;
            const endY = b.cy - uy * NODE_R;
            const dim = isRelDim(rel);
            return (
              <line
                key={i}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={t.color}
                strokeWidth={t.style === 'solid' ? 3.5 : 2.5}
                strokeDasharray={dashFor(t.style)}
                opacity={dim ? 0.12 : 0.85}
                markerEnd={`url(#cf2-arrow-${t.id})`}
                markerStart={rel.bidirectional ? `url(#cf2-arrow-${t.id})` : undefined}
                style={{ transition: 'opacity 200ms' }}
              />
            );
          })}

          {nodes.map((n) => {
            const p = positions[n.id];
            const isActive = activeNode === n.id;
            const dim = isNodeDim(n.id);
            return (
              <g
                key={n.id}
                onClick={() => setActiveNode(activeNode === n.id ? null : n.id)}
                style={{ cursor: 'pointer', opacity: dim ? 0.25 : 1, transition: 'opacity 200ms' }}
              >
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={NODE_R}
                  fill={n.color}
                  stroke={isActive ? '#1e2a3a' : 'rgba(0,0,0,0.1)'}
                  strokeWidth={isActive ? 3 : 1.5}
                />
                <text
                  x={p.cx}
                  y={p.cy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
                  fontSize="14"
                  fill="#fff"
                >
                  {n.label}
                </text>
                {n.sublabel && (
                  <text
                    x={p.cx}
                    y={p.cy + NODE_R + 16}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#4a5568"
                    fontWeight="600"
                  >
                    {n.sublabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <p className="cf2-noderel__hint">
        Clicca un Nodo per evidenziare le sue relazioni · clicca un tipo nella legenda per filtrare.
      </p>
    </div>
  );
}
