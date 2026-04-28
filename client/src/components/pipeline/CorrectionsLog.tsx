import type { CorrectionEntry } from '../../types/pipeline';

const STEP_LABEL: Record<string, string> = {
  f3_step_3: 'Correzione strutturale',
  f3_step_6: 'Stabilizzazione proxy',
  f3_step_8: 'Adattamento strutturale',
};

const CORRECTION_TYPE_COLOR: Record<string, string> = {
  applicata: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rinviata: 'bg-slate-100 text-slate-600 border-slate-200',
  non_applicata: 'bg-slate-200 text-slate-700 border-slate-300',
};

function CorrectionItem({ c, idx }: { c: CorrectionEntry; idx: number }) {
  const isApplied = c.correction_type === 'applicata';
  return (
    <div className="flex flex-col gap-2">
      {/* Frattura */}
      <div className="rounded-lg border border-red-200 bg-red-50/60 p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <p className="text-xs font-bold text-red-700 uppercase tracking-wider">
            Frattura {idx + 1}
            {c.breaking_point_ref && <span className="ml-2 font-mono bg-red-100 px-1.5 py-0.5 rounded text-red-800 text-[10px]">{c.breaking_point_ref}</span>}
          </p>
          {c.correction_scope && (
            <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded">
              scope: {c.correction_scope}
            </span>
          )}
        </div>
        {c.breaking_point_summary && (
          <p className="text-sm text-slate-700 leading-relaxed">{c.breaking_point_summary}</p>
        )}
      </div>

      {/* Arrow */}
      <div className="flex items-center gap-2 pl-4">
        <span className="text-slate-300">↓</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded border ${CORRECTION_TYPE_COLOR[c.correction_type] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
          {c.correction_type.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Correzione */}
      <div className={`rounded-lg border p-4 ${isApplied ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-slate-50/80'}`}>
        <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isApplied ? 'text-emerald-700' : 'text-slate-600'}`}>
          {isApplied ? 'Correzione applicata' : 'Correzione non applicata'}
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">{c.correction_description}</p>
      </div>

      {/* Razionale */}
      {c.rationale && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Razionale</p>
          <p className="text-sm text-slate-600 leading-relaxed italic">{c.rationale}</p>
        </div>
      )}
    </div>
  );
}

export default function CorrectionsLog({
  groups,
  highlightBreakingPointRef,
}: {
  groups: Array<{ step: string; entries: CorrectionEntry[] }>;
  highlightBreakingPointRef?: string | null;
}) {
  if (groups.length === 0) {
    return <p className="text-sm text-slate-500 italic">Nessuna correzione registrata.</p>;
  }
  return (
    <div className="space-y-10">
      {groups.map((g) => (
        <section key={g.step}>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xs font-mono text-slate-400">{g.step}</span>
            <h3 className="text-sm font-bold text-slate-800">{STEP_LABEL[g.step] ?? g.step}</h3>
            <span className="text-xs text-slate-400">— {g.entries.length} correzion{g.entries.length === 1 ? 'e' : 'i'}</span>
          </div>
          <div className="space-y-8">
            {g.entries.map((c, i) => {
              const isHighlighted = highlightBreakingPointRef && c.breaking_point_ref === highlightBreakingPointRef;
              return (
                <div
                  key={i}
                  id={c.breaking_point_ref ? `correction-${c.breaking_point_ref}` : undefined}
                  className={isHighlighted ? 'ring-2 ring-amber-400 rounded-lg p-2 -m-2' : ''}
                >
                  <CorrectionItem c={c} idx={i} />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
