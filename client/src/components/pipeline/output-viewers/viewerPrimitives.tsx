// Primitive UI condivise tra i viewer strutturati degli output di pipeline
// (F2OutputViewer, F3OutputViewer, …). Tenute qui per evitare duplicazione e
// preservare l'estetica unica dei viewer.

import React from 'react';

// Render difensivo: se arriva un oggetto/array dove ci si aspettava una stringa,
// lo serializziamo invece di lasciar crashare React. I viewer sono dichiarativi
// rispetto a schemi che a volte gli agenti non rispettano.
function safeRender(value: React.ReactNode): React.ReactNode {
  if (value === null || value === undefined) return value;
  if (typeof value === 'object' && !React.isValidElement(value) && !Array.isArray(value)) {
    try {
      return <code className="text-xs font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded">{JSON.stringify(value)}</code>;
    } catch {
      return String(value);
    }
  }
  return value;
}

export const RELEVANCE_COLORS: Record<string, string> = {
  forte:           'bg-emerald-100 text-emerald-800 border-emerald-200',
  plausibile:      'bg-sky-100 text-sky-800 border-sky-200',
  da_verificare:   'bg-amber-100 text-amber-800 border-amber-200',
  confermato:      'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected:        'bg-slate-100 text-slate-500 border-slate-200',
  secondary:       'bg-blue-50 text-blue-700 border-blue-200',
  derived:         'bg-purple-100 text-purple-800 border-purple-200',
  // colori per stati/configurazioni F3
  presente:        'bg-emerald-100 text-emerald-800 border-emerald-200',
  assente:         'bg-slate-100 text-slate-500 border-slate-200',
  distorta:        'bg-rose-100 text-rose-800 border-rose-200',
  oscillante:      'bg-amber-100 text-amber-800 border-amber-200',
  condiviso:       'bg-emerald-100 text-emerald-800 border-emerald-200',
  'tentato-unilaterale': 'bg-amber-100 text-amber-800 border-amber-200',
  'tentato-in-attesa':   'bg-sky-100 text-sky-800 border-sky-200',
  aperto:          'bg-emerald-100 text-emerald-800 border-emerald-200',
  predeterminato:  'bg-rose-100 text-rose-800 border-rose-200',
  ambiguo:         'bg-amber-100 text-amber-800 border-amber-200',
  // outcome audit
  corretto:        'bg-emerald-100 text-emerald-800 border-emerald-200',
  reale:           'bg-emerald-100 text-emerald-800 border-emerald-200',
  giustificata:    'bg-emerald-100 text-emerald-800 border-emerald-200',
  coerente:        'bg-emerald-100 text-emerald-800 border-emerald-200',
  completo:        'bg-emerald-100 text-emerald-800 border-emerald-200',
  gestito:         'bg-emerald-100 text-emerald-800 border-emerald-200',
  parzialmente_validi: 'bg-amber-100 text-amber-800 border-amber-200',
  proxy_decisivo_reversibile: 'bg-amber-100 text-amber-800 border-amber-200',
  // case_type stress test
  assenza_configurazione:    'bg-slate-100 text-slate-700 border-slate-200',
  configurazione_parziale:   'bg-amber-100 text-amber-800 border-amber-200',
  configurazione_distorta:   'bg-rose-100 text-rose-800 border-rose-200',
  configurazione_oscillante: 'bg-sky-100 text-sky-800 border-sky-200',
  configurazione_reale:      'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export function Chip({ children, color = 'slate', className = '' }: { children: React.ReactNode; color?: string; className?: string }) {
  const cls = RELEVANCE_COLORS[color] ?? 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded border ${cls} ${className}`}>{safeRender(children)}</span>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-sm font-semibold text-slate-900 mt-5 mb-2">{children}</h4>;
}

export function Subtle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-slate-500 italic">{children}</p>;
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{safeRender(children)}</p>;
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-slate-200 bg-white p-4 ${className}`}>{children}</div>;
}

export function KeyValue({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[minmax(160px,auto)_1fr] gap-x-3 gap-y-0.5 py-1">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</div>
      <div className="text-sm text-slate-700 leading-relaxed">{safeRender(value)}</div>
    </div>
  );
}

export function BulletList({ items, empty }: { items: (string | React.ReactNode)[]; empty?: string }) {
  if (!items || items.length === 0) {
    return empty ? <Subtle>{empty}</Subtle> : null;
  }
  return (
    <ul className="list-disc ml-5 text-sm text-slate-700 space-y-1">
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ul>
  );
}

// Tab nav per selezionare l'item corrente quando l'output ha results[] / cases[] / etc.
export function ThemeTabs({ themes, activeIdx, onChange }: {
  themes: { theme_id: string; label?: string }[];
  activeIdx: number;
  onChange: (i: number) => void;
}) {
  if (themes.length <= 1) return null;
  return (
    <div className="flex gap-1 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
      {themes.map((t, i) => (
        <button
          key={t.theme_id ?? i}
          onClick={() => onChange(i)}
          className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-md transition-colors ${
            i === activeIdx
              ? 'bg-slate-900 text-white font-medium'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t.label ?? t.theme_id}
        </button>
      ))}
    </div>
  );
}

// Layout a due colonne per "confermati / respinti", riusato in step 3 F2.
export function ConfirmedRejectedColumns({ confirmed, rejected, secondary }: {
  confirmed: { id: string; label: string; subtitle?: string; description?: string }[];
  rejected: { id: string; label: string; description?: string }[];
  secondary?: { id: string; label: string; description?: string }[];
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-3 mt-2">
      <div>
        <p className="text-xs font-semibold text-emerald-800 mb-1.5">Confermati ({confirmed.length})</p>
        <div className="space-y-1.5">
          {confirmed.length === 0 && <Subtle>nessuno</Subtle>}
          {confirmed.map((c, i) => (
            <div key={i} className="text-xs border-l-2 border-emerald-300 pl-2">
              <p className="font-medium text-slate-900">{c.label}</p>
              {c.subtitle && <p className="text-slate-500">{c.subtitle}</p>}
              {c.description && <p className="text-slate-600 leading-relaxed mt-0.5">{c.description}</p>}
            </div>
          ))}
        </div>
        {secondary && secondary.length > 0 && (
          <>
            <p className="text-xs font-semibold text-blue-800 mt-3 mb-1.5">Secondari ({secondary.length})</p>
            <div className="space-y-1.5">
              {secondary.map((s, i) => (
                <div key={i} className="text-xs border-l-2 border-blue-300 pl-2">
                  <p className="font-medium text-slate-900">{s.label}</p>
                  {s.description && <p className="text-slate-600 leading-relaxed mt-0.5">{s.description}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-1.5">Respinti ({rejected.length})</p>
        <div className="space-y-1.5">
          {rejected.length === 0 && <Subtle>nessuno</Subtle>}
          {rejected.map((c, i) => (
            <div key={i} className="text-xs border-l-2 border-slate-200 pl-2 opacity-80">
              <p className="font-medium text-slate-700">{c.label}</p>
              {c.description && <p className="text-slate-500 leading-relaxed mt-0.5 italic">{c.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Riquadro evidenziato per blocchi di sintesi/note: titolo piccolo + corpo prose.
export function CalloutBox({ title, children, tone = 'slate' }: {
  title: string;
  children: React.ReactNode;
  tone?: 'slate' | 'emerald' | 'amber' | 'rose' | 'sky' | 'blue';
}) {
  const tones: Record<string, string> = {
    slate:   'bg-slate-50 border-slate-300 text-slate-800',
    emerald: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    amber:   'bg-amber-50 border-amber-300 text-amber-900',
    rose:    'bg-rose-50 border-rose-300 text-rose-900',
    sky:     'bg-sky-50 border-sky-300 text-sky-900',
    blue:    'bg-blue-50 border-blue-300 text-blue-900',
  };
  const cls = tones[tone] ?? tones.slate;
  return (
    <div className={`rounded border-l-4 p-3 my-3 ${cls}`}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-1 opacity-80">{title}</p>
      {children}
    </div>
  );
}
