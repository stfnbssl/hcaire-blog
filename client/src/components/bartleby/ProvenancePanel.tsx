import { Link } from 'react-router-dom';
import type { OutputDocument } from '../../types/bartleby';

interface Props {
  output: OutputDocument;
}

export default function ProvenancePanel({ output }: Props) {
  return (
    <div className="space-y-5 text-sm">

      {/* ── Traccia originale ─────────────────────────────────────────── */}
      {output.trace && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
            Traccia
          </h3>
          <blockquote className="border-l-2 border-slate-300 pl-3 text-slate-700 italic leading-relaxed">
            {output.trace.raw_text}
          </blockquote>

          {output.trace.context_notes && (
            <div className="mt-2">
              <span className="text-xs font-medium text-slate-500">Note di contesto — </span>
              <span className="text-slate-600">{output.trace.context_notes}</span>
            </div>
          )}
          {output.trace.target_output_type && (
            <div className="mt-1">
              <span className="text-xs font-medium text-slate-500">Tipo richiesto — </span>
              <span className="text-slate-600">{output.trace.target_output_type}</span>
            </div>
          )}
          {output.trace.requested_area_id && (
            <div className="mt-1">
              <span className="text-xs font-medium text-slate-500">Ambito richiesto — </span>
              <span className="text-slate-600">{output.trace.requested_area_id}</span>
            </div>
          )}
        </section>
      )}

      {/* ── Ambito rilevato ───────────────────────────────────────────── */}
      {output.area && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Ambito</h3>
          <Link
            to={`/bartleby/knowledge-base/domain-areas/${output.area.bartlebyId}`}
            className="text-slate-700 font-medium hover:text-slate-900 underline underline-offset-2"
          >
            {output.area.name}
          </Link>
        </section>
      )}

      {/* ── Nodi attivati ─────────────────────────────────────────────── */}
      {output.activated_nodes_detail && output.activated_nodes_detail.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
            Nodi trasversali attivati
          </h3>
          <ul className="space-y-1">
            {output.activated_nodes_detail.map((node) => (
              <li key={node.bartlebyId}>
                <Link
                  to={`/bartleby/knowledge-base/concept-nodes/${node.bartlebyId}`}
                  className="text-slate-700 hover:text-slate-900 underline underline-offset-2"
                >
                  {node.name}
                </Link>
                {node.priority_level && (
                  <span className="ml-2 text-xs text-slate-400">{node.priority_level}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Skill usate ───────────────────────────────────────────────── */}
      {output.skills_used_detail && output.skills_used_detail.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
            Skill utilizzate
          </h3>
          <ul className="space-y-1">
            {output.skills_used_detail.map((skill) => (
              <li key={skill.bartlebyId} className="flex items-start gap-2">
                <span className="mt-0.5 inline-block text-xs bg-slate-200 text-slate-600 rounded px-1.5 py-0.5 shrink-0">
                  {skill.skill_type}
                </span>
                <Link
                  to={`/bartleby/knowledge-base/skills/${skill.bartlebyId}`}
                  className="text-slate-700 hover:text-slate-900 underline underline-offset-2"
                >
                  {skill.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Tipo output ───────────────────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Tipo di output</h3>
        <span className="text-slate-700">{output.output_type}</span>
        {output.audience && (
          <span className="ml-2 text-xs bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">
            {output.audience}
          </span>
        )}
      </section>

      {/* ── Valutazione ───────────────────────────────────────────────── */}
      {output.evaluation?.notes && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Valutazione</h3>
          {output.evaluation.score != null && (
            <p className="font-semibold text-slate-800 mb-0.5">{output.evaluation.score}/10</p>
          )}
          <p className="text-slate-600 leading-relaxed">{output.evaluation.notes}</p>
          {output.evaluation.status && (
            <span className="mt-1 inline-block text-xs bg-slate-100 text-slate-500 rounded px-1.5 py-0.5">
              {output.evaluation.status}
            </span>
          )}
        </section>
      )}
    </div>
  );
}
