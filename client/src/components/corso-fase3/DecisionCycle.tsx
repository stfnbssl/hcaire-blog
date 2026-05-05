import { useState } from 'react';

interface CycleNode {
  id: string;
  label: string;
  fase: 'F2' | 'F3' | 'AGISCI' | 'OSSERVA';
  colore: string;
  descrizione: string;
  domanda: string;
  nota?: string;
}

const NODES: CycleNode[] = [
  {
    id: 'osserva',
    label: 'OSSERVA',
    fase: 'F2',
    colore: 'var(--corso-f2)',
    descrizione:
      "Punto d'ingresso del ciclo: cosa accade nel campo bambino-adulto-contesto in questo momento? L'osservazione è già configurazionale — guarda il campo, non il bambino isolato.",
    domanda: 'Cosa vedo nel campo, in questo momento?',
    nota: "L'osservazione non è neutra: è già orientata da F1/F2 — guarda configurazioni, non comportamenti.",
  },
  {
    id: 'leggi',
    label: 'LEGGI (CE)',
    fase: 'F2',
    colore: 'var(--corso-f2)',
    descrizione:
      "L'osservazione viene tradotta nella Configurazione Evolutiva: nodi (N1–N7), relazione dominante (R), direzione (D), tenuta (T), abitabilità (A). La CE è una lettura strutturale del campo.",
    domanda: 'Qual è la struttura del campo che sto osservando?',
    nota: 'In tempo reale, la CE non viene scritta: viene formulata mentalmente come habitus di lettura.',
  },
  {
    id: 'orienta',
    label: 'ORIENTA (funzione)',
    fase: 'F3',
    colore: 'var(--corso-f3)',
    descrizione:
      "Dal nodo dominante e dalla CE emerge la funzione: Stabilizzare, Ampliare, Mediare o Proteggere. La funzione orienta — non prescrive — la scelta del dispositivo.",
    domanda:
      "Qual è l'azione che, in questo campo, aumenta l'abitabilità nella direzione D?",
    nota: 'Non si sceglie la tecnica: si sceglie la funzione.',
  },
  {
    id: 'agisci',
    label: 'AGISCI (dispositivo)',
    fase: 'AGISCI',
    colore: 'var(--corso-module-accent)',
    descrizione:
      'Il micro-dispositivo concreto entra nel campo: micro-azioni dell\'adulto, modifiche del setting, ritmo, attesa. Breve, integrabile, reversibile, osservabile nei suoi effetti.',
    domanda: 'Qual è la versione minima che realizza la funzione in questo contesto?',
    nota: 'Il principio del minimo intervento sufficiente non è rinuncia: è precisione.',
  },
  {
    id: 'osservaDiNuovo',
    label: 'OSSERVA DI NUOVO',
    fase: 'OSSERVA',
    colore: 'var(--corso-module-accent)',
    descrizione:
      "Dopo l'azione, l'osservazione riprende: l'indicatore di risonanza è presente? Il campo ha risposto? Se sì, la CE si aggiorna. Se no, si rientra in OSSERVA con la lettura aggiornata.",
    domanda: "Il campo ha risposto? L'indicatore di risonanza è osservabile?",
    nota: "Assenza di risonanza non significa fallimento del bambino: significa segnale di riallineamento. Si rilegge — non si insiste.",
  },
];

// Posizioni dei 5 nodi su un pentagono regolare (centro 200, raggio 140).
const PENTAGON = NODES.map((n, i) => {
  const angle = (i * 2 * Math.PI) / NODES.length - Math.PI / 2;
  return {
    ...n,
    x: 200 + 140 * Math.cos(angle),
    y: 200 + 140 * Math.sin(angle),
  };
});

export default function DecisionCycle() {
  const [selected, setSelected] = useState<string>('orienta');
  const node = PENTAGON.find((n) => n.id === selected) ?? PENTAGON[2];

  return (
    <div className="corso-dc">
      <div className="corso-dc__layout">
        <div className="corso-dc__cycle">
          <svg viewBox="0 0 400 400" className="corso-dc__svg" aria-hidden="true">
            <defs>
              <marker
                id="dc-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="var(--corso-text-muted)" />
              </marker>
              <marker
                id="dc-arrow-accent"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="var(--corso-module-accent)" />
              </marker>
            </defs>

            {/* Frecce tra nodi (curve tra coppie consecutive). */}
            {PENTAGON.map((n, i) => {
              const next = PENTAGON[(i + 1) % PENTAGON.length];
              const isClose = i === PENTAGON.length - 1; // ultima freccia: rientro
              const cx = (n.x + next.x) / 2;
              const cy = (n.y + next.y) / 2;
              // sposta il punto di controllo verso il centro per la curva
              const ctrlX = cx + (200 - cx) * 0.25;
              const ctrlY = cy + (200 - cy) * 0.25;
              return (
                <path
                  key={`arc-${i}`}
                  d={`M ${n.x} ${n.y} Q ${ctrlX} ${ctrlY} ${next.x} ${next.y}`}
                  stroke={
                    isClose ? 'var(--corso-module-accent)' : 'var(--corso-text-muted)'
                  }
                  strokeWidth={isClose ? 2.5 : 1.5}
                  fill="none"
                  markerEnd={
                    isClose ? 'url(#dc-arrow-accent)' : 'url(#dc-arrow)'
                  }
                  strokeDasharray={isClose ? '0' : '4 3'}
                  opacity={isClose ? 1 : 0.7}
                />
              );
            })}

            {/* Etichetta centrale "ciclo". */}
            <text
              x="200"
              y="200"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--corso-text-muted)"
              fontStyle="italic"
              fontSize="13"
            >
              ciclo decisionale
            </text>
          </svg>

          {/* Nodi sovrapposti come pulsanti. */}
          <div className="corso-dc__nodes">
            {PENTAGON.map((n) => {
              const isSelected = n.id === selected;
              return (
                <button
                  key={n.id}
                  type="button"
                  className={`corso-dc__node ${isSelected ? 'corso-dc__node--selected' : ''}`}
                  style={
                    {
                      ['--corso-dc-color' as never]: n.colore,
                      left: `${(n.x / 400) * 100}%`,
                      top: `${(n.y / 400) * 100}%`,
                    } as React.CSSProperties
                  }
                  onClick={() => setSelected(n.id)}
                  aria-pressed={isSelected}
                  aria-label={n.label}
                >
                  <span className="corso-dc__node-label">{n.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="corso-dc__panel" aria-live="polite">
          <header
            className="corso-dc__panel-head"
            style={{ ['--corso-dc-color' as never]: node.colore } as React.CSSProperties}
          >
            <span className="corso-dc__panel-badge">{node.label}</span>
            <span className="corso-dc__panel-fase">{node.fase}</span>
          </header>
          <div className="corso-dc__panel-body">
            <p className="corso-dc__panel-desc">{node.descrizione}</p>
            <div className="corso-dc__panel-q">
              <span className="corso-dc__panel-lab">Domanda guida</span>
              <p>
                <em>«{node.domanda}»</em>
              </p>
            </div>
            {node.nota && (
              <div className="corso-dc__panel-nota">
                <span className="corso-dc__panel-lab">Nota</span>
                <p>{node.nota}</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      <p className="corso-dc__hint">
        Clicca su uno dei cinque nodi del ciclo per leggerne la funzione.
      </p>
    </div>
  );
}
