// Viewer strutturato per gli output della Fase 2 — pipeline v2.x.
// Riceve il JSON parsato + lo step_id e dispatcha al sub-componente giusto.
// Per output non riconosciuti ritorna null (chi chiama mostra JSON di fallback).
//
// Step coperti: f2_step_2, 2a, 3, 4, 4b, 5, 6.
// f2_step_1 (theme-discovery) è stato rimosso dalla pipeline (sostituito
// dall'Archivio temi); Step1Viewer è LEGACY e non più dispatchato.

import { useState } from 'react';
import {
  Chip, SectionTitle, Subtle, Prose, Card, KeyValue, BulletList, ThemeTabs,
  ConfirmedRejectedColumns, CalloutBox,
} from './viewerPrimitives';

// ───── step 1: theme-discovery (LEGACY, non più dispatchato) ─────

interface Step1Theme {
  theme_label_provisional?: string;
  starting_point?: string;
  structural_focus?: string;
  what_it_is?: string;
  what_it_is_not?: string;
  why_it_matters?: string;
  source_signals?: { source_type?: string; reference?: string; signal?: string }[] | string[];
  possible_axes_involved?: { axis_id: string; axis_name?: string; relevance_level?: string; reason?: string }[];
  possible_structural_nodes?: { node?: string; from_axis?: string; relevance?: string }[] | string[];
  possible_bridge_concepts?: { concept?: string; connects_axes?: string[] }[] | string[];
  definition_draft?: string;
  definition_risks?: string[] | string;
  exploratory_priority?: string;
  pilot_suitability?: string;
  human_review_notes?: string;
}

interface Step1Data {
  research_scope?: {
    project_goal?: string;
    source_types_consulted?: string[];
    selection_criteria?: string[];
    notes?: string;
  };
  candidate_themes?: Step1Theme[];
  global_notes?: string;
}

function Step1Viewer({ data }: { data: Step1Data }) {
  const themes = data.candidate_themes ?? [];
  const [active, setActive] = useState(0);
  const t = themes[active];

  return (
    <div className="space-y-6">
      {data.research_scope && (
        <details className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">Research scope</summary>
          <div className="mt-3 space-y-2">
            {data.research_scope.project_goal && <KeyValue label="Obiettivo" value={<Prose>{data.research_scope.project_goal}</Prose>} />}
            {data.research_scope.source_types_consulted && (
              <KeyValue label="Fonti consultate" value={<BulletList items={data.research_scope.source_types_consulted} />} />
            )}
            {data.research_scope.selection_criteria && (
              <KeyValue label="Criteri di selezione" value={<BulletList items={data.research_scope.selection_criteria} />} />
            )}
            {data.research_scope.notes && <KeyValue label="Note" value={<Prose>{data.research_scope.notes}</Prose>} />}
          </div>
        </details>
      )}

      <div>
        <SectionTitle>{themes.length} tema/i candidati</SectionTitle>
        <ThemeTabs
          themes={themes.map((th, i) => ({ theme_id: String(i), label: th.theme_label_provisional ?? `Tema ${i + 1}` }))}
          activeIdx={active}
          onChange={setActive}
        />
        {t && (
          <Card>
            <div className="flex items-start gap-3 mb-3">
              <h3 className="font-semibold text-slate-900 flex-1">{t.theme_label_provisional ?? 'Tema'}</h3>
              {t.exploratory_priority && <Chip color={t.exploratory_priority.toLowerCase().includes('alta') ? 'forte' : 'plausibile'}>priorità: {t.exploratory_priority}</Chip>}
              {t.pilot_suitability && <Chip>pilot: {t.pilot_suitability}</Chip>}
            </div>
            {t.starting_point && <KeyValue label="Punto di partenza" value={<Prose>{t.starting_point}</Prose>} />}
            {t.structural_focus && <KeyValue label="Focus strutturale" value={<Prose>{t.structural_focus}</Prose>} />}
            {t.what_it_is && <KeyValue label="Cos'è" value={<Prose>{t.what_it_is}</Prose>} />}
            {t.what_it_is_not && <KeyValue label="Cos'non è" value={<Prose>{t.what_it_is_not}</Prose>} />}
            {t.why_it_matters && <KeyValue label="Perché conta" value={<Prose>{t.why_it_matters}</Prose>} />}
            {t.definition_draft && <KeyValue label="Definizione draft" value={<Prose>{t.definition_draft}</Prose>} />}

            {t.possible_axes_involved && t.possible_axes_involved.length > 0 && (
              <div className="mt-4">
                <SectionTitle>Assi candidati</SectionTitle>
                <div className="flex flex-wrap gap-1.5">
                  {t.possible_axes_involved.map((a, i) => (
                    <span key={i} title={a.reason} className="cursor-help">
                      <Chip color={a.relevance_level ?? 'plausibile'}>{a.axis_name ?? a.axis_id} · {a.relevance_level ?? '?'}</Chip>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {t.possible_structural_nodes && (
              <div className="mt-4">
                <SectionTitle>Nodi strutturali possibili</SectionTitle>
                <BulletList items={(t.possible_structural_nodes as Array<string | { node?: string; from_axis?: string; relevance?: string }>).map((n) => {
                  if (typeof n === 'string') return n;
                  return `${n.node ?? '?'}${n.from_axis ? ` (da ${n.from_axis}` : ''}${n.relevance ? `, ${n.relevance}` : ''}${n.from_axis ? ')' : ''}`;
                })} />
              </div>
            )}

            {t.possible_bridge_concepts && (
              <div className="mt-4">
                <SectionTitle>Concetti-ponte possibili</SectionTitle>
                <BulletList items={(t.possible_bridge_concepts as Array<string | { concept?: string; connects_axes?: string[] }>).map((b) => {
                  if (typeof b === 'string') return b;
                  return `${b.concept ?? '?'}${b.connects_axes?.length ? ` (collega: ${b.connects_axes.join(', ')})` : ''}`;
                })} />
              </div>
            )}

            {t.source_signals && (
              <details className="mt-4">
                <summary className="cursor-pointer text-xs font-semibold text-slate-600">Fonti & segnali</summary>
                <div className="mt-2">
                  <BulletList items={(t.source_signals as Array<string | { source_type?: string; reference?: string; signal?: string }>).map((s) => {
                    if (typeof s === 'string') return s;
                    return `${s.source_type ? `[${s.source_type}] ` : ''}${s.reference ?? ''}${s.signal ? ` — ${s.signal}` : ''}`;
                  })} />
                </div>
              </details>
            )}

            {t.human_review_notes && (
              <div className="mt-4 p-3 rounded bg-amber-50 border border-amber-200">
                <p className="text-xs font-semibold text-amber-800 mb-1">Note per revisione umana</p>
                <Prose>{t.human_review_notes}</Prose>
              </div>
            )}
          </Card>
        )}
      </div>

      {data.global_notes && (
        <div>
          <SectionTitle>Note globali</SectionTitle>
          <Prose>{data.global_notes}</Prose>
        </div>
      )}
    </div>
  );
}

// ───── step 2: theme-relevance ─────

interface NodeItem {
  // Schema canonico
  node_id?: string;
  node_label?: string;
  source_axis?: string;
  source_axis_name?: string;
  // Tollero anche varianti viste in dati storici
  id?: string;
  label?: string;
  from_axis?: string;
  relevance_level?: string;
  is_derived?: boolean;
  reason?: string;
  rejection_reason?: string;
  role?: string;
}

interface BridgeItem {
  concept_label?: string;
  linked_axes?: string[];
  linked_nodes?: string[];
  // Tollero varianti
  id?: string;
  label?: string;
  connects_axes?: string[];
  relevance_level?: string;
  is_derived?: boolean;
  reason?: string;
  rejection_reason?: string;
  role?: string;
  function?: string;
  type?: string;
  description?: string;
}

function nodeLabel(n: NodeItem): string {
  return n.node_label ?? n.label ?? n.node_id ?? n.id ?? '?';
}
function nodeAxis(n: NodeItem): string | undefined {
  return n.source_axis_name ?? n.source_axis ?? n.from_axis;
}
function bridgeLabel(b: BridgeItem): string {
  return b.concept_label ?? b.label ?? b.id ?? '?';
}
function bridgeAxes(b: BridgeItem): string[] | undefined {
  return b.linked_axes ?? b.connects_axes;
}

interface Step2Result {
  theme_id: string;
  candidate_axes?: { axis_id: string; axis_name?: string; relevance_level?: string; reason?: string }[];
  candidate_nodes?: NodeItem[];
  candidate_bridge_concepts?: BridgeItem[];
  theme_structure_assessment?: { type?: string; notes?: string };
  selection_rationale?: string;
  notes_for_review?: string;
}

function Step2Viewer({ data }: { data: { results?: Step2Result[] } }) {
  const results = data.results ?? [];
  const [active, setActive] = useState(0);
  const r = results[active];
  if (!r) return <Subtle>Nessun risultato.</Subtle>;

  return (
    <div className="space-y-4">
      <ThemeTabs themes={results.map((x) => ({ theme_id: x.theme_id }))} activeIdx={active} onChange={setActive} />
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-slate-900">{r.theme_id}</h3>
          {r.theme_structure_assessment?.type && <Chip>{r.theme_structure_assessment.type.replace(/_/g, ' ')}</Chip>}
        </div>
        {r.theme_structure_assessment?.notes && <Subtle>{r.theme_structure_assessment.notes}</Subtle>}

        {r.candidate_axes && r.candidate_axes.length > 0 && (
          <>
            <SectionTitle>Assi candidati</SectionTitle>
            <div className="space-y-2">
              {r.candidate_axes.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Chip color={a.relevance_level ?? 'plausibile'} className="flex-shrink-0">{a.relevance_level ?? '?'}</Chip>
                  <div className="text-sm">
                    <span className="font-medium text-slate-900">{a.axis_name ?? a.axis_id}</span>
                    {a.reason && <p className="text-slate-600 leading-relaxed">{a.reason}</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {r.candidate_nodes && r.candidate_nodes.length > 0 && (
          <>
            <SectionTitle>Nodi candidati ({r.candidate_nodes.length})</SectionTitle>
            <div className="space-y-2">
              {r.candidate_nodes.map((n, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Chip color={n.relevance_level ?? 'plausibile'} className="flex-shrink-0">{n.relevance_level ?? '?'}</Chip>
                  {n.is_derived && <Chip color="derived" className="flex-shrink-0">derivato</Chip>}
                  <div className="text-sm flex-1">
                    <span className="font-medium text-slate-900">{nodeLabel(n)}</span>
                    {nodeAxis(n) && <span className="text-slate-500 ml-1">— {nodeAxis(n)}</span>}
                    {n.reason && <p className="text-slate-600 leading-relaxed mt-0.5">{n.reason}</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {r.candidate_bridge_concepts && r.candidate_bridge_concepts.length > 0 && (
          <>
            <SectionTitle>Concetti-ponte ({r.candidate_bridge_concepts.length})</SectionTitle>
            <div className="space-y-2">
              {r.candidate_bridge_concepts.map((b, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium text-slate-900">{bridgeLabel(b)}</span>
                  {bridgeAxes(b) && <span className="text-slate-500 ml-2">↔ {bridgeAxes(b)!.join(' / ')}</span>}
                  {b.linked_nodes && b.linked_nodes.length > 0 && (
                    <span className="text-slate-400 ml-2 text-xs">[nodi: {b.linked_nodes.join(', ')}]</span>
                  )}
                  {b.is_derived && <Chip color="derived" className="ml-2">derivato</Chip>}
                  {b.reason && <p className="text-slate-600 leading-relaxed mt-0.5">{b.reason}</p>}
                </div>
              ))}
            </div>
          </>
        )}

        {r.selection_rationale && (
          <>
            <SectionTitle>Selection rationale</SectionTitle>
            <Prose>{r.selection_rationale}</Prose>
          </>
        )}

        {r.notes_for_review && (
          <div className="mt-4 p-3 rounded bg-amber-50 border border-amber-200">
            <p className="text-xs font-semibold text-amber-800 mb-1">Note per revisione</p>
            <Prose>{r.notes_for_review}</Prose>
          </div>
        )}
      </Card>
    </div>
  );
}

// ───── step 3: theme-verification ─────

interface Step3Result {
  theme_id: string;
  confirmed_axes?: { axis_id: string; axis_name?: string; role?: string; reason?: string }[];
  rejected_axes?: { axis_id: string; axis_name?: string; rejection_reason?: string }[];
  confirmed_nodes?: NodeItem[];
  secondary_nodes?: NodeItem[];
  rejected_nodes?: NodeItem[];
  confirmed_bridge_concepts?: BridgeItem[];
  rejected_bridge_concepts?: BridgeItem[];
  structural_configuration?: { type?: string; description?: string } | string;
  synthetic_formulation?: string;
  selection_rationale?: string;
  critical_notes?: string[] | string;
}

function Step3Viewer({ data }: { data: { results?: Step3Result[] } }) {
  const results = data.results ?? [];
  const [active, setActive] = useState(0);
  const r = results[active];
  if (!r) return <Subtle>Nessun risultato.</Subtle>;

  return (
    <div className="space-y-4">
      <ThemeTabs themes={results.map((x) => ({ theme_id: x.theme_id }))} activeIdx={active} onChange={setActive} />
      <Card>
        <h3 className="font-semibold text-slate-900 mb-2">{r.theme_id}</h3>

        {r.synthetic_formulation && (
          <div className="rounded bg-slate-50 border-l-4 border-slate-400 p-3 my-3">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Formulazione sintetica</p>
            <Prose>{r.synthetic_formulation}</Prose>
          </div>
        )}

        <SectionTitle>Assi</SectionTitle>
        <ConfirmedRejectedColumns
          confirmed={(r.confirmed_axes ?? []).map((a) => ({ id: a.axis_id, label: a.axis_name ?? a.axis_id, subtitle: a.role, description: a.reason }))}
          rejected={(r.rejected_axes ?? []).map((a) => ({ id: a.axis_id, label: a.axis_name ?? a.axis_id, description: a.rejection_reason }))}
        />

        <SectionTitle>Nodi</SectionTitle>
        <ConfirmedRejectedColumns
          confirmed={(r.confirmed_nodes ?? []).map((n) => ({ id: n.node_id ?? n.id ?? '', label: nodeLabel(n), subtitle: nodeAxis(n) ?? n.role, description: n.reason }))}
          rejected={(r.rejected_nodes ?? []).map((n) => ({ id: n.node_id ?? n.id ?? '', label: nodeLabel(n), description: n.rejection_reason }))}
          secondary={(r.secondary_nodes ?? []).map((n) => ({ id: n.node_id ?? n.id ?? '', label: nodeLabel(n), description: n.reason }))}
        />

        <SectionTitle>Concetti-ponte</SectionTitle>
        <ConfirmedRejectedColumns
          confirmed={(r.confirmed_bridge_concepts ?? []).map((b) => ({
            id: bridgeLabel(b), label: bridgeLabel(b),
            subtitle: bridgeAxes(b)?.join(' ↔ '),
            description: b.role ?? b.reason,
          }))}
          rejected={(r.rejected_bridge_concepts ?? []).map((b) => ({ id: bridgeLabel(b), label: bridgeLabel(b), description: b.rejection_reason }))}
        />

        {r.structural_configuration && (
          <>
            <SectionTitle>Configurazione strutturale</SectionTitle>
            {typeof r.structural_configuration === 'string' ? (
              <Prose>{r.structural_configuration}</Prose>
            ) : (
              <>
                {r.structural_configuration.type && <Chip className="mb-2">{r.structural_configuration.type.replace(/_/g, ' ')}</Chip>}
                {r.structural_configuration.description && <Prose>{r.structural_configuration.description}</Prose>}
              </>
            )}
          </>
        )}

        {r.selection_rationale && (
          <details className="mt-4">
            <summary className="cursor-pointer text-xs font-semibold text-slate-600">Selection rationale</summary>
            <div className="mt-2"><Prose>{r.selection_rationale}</Prose></div>
          </details>
        )}

        {r.critical_notes && (
          <div className="mt-4 p-3 rounded bg-amber-50 border border-amber-200">
            <p className="text-xs font-semibold text-amber-800 mb-1">Note critiche</p>
            {Array.isArray(r.critical_notes)
              ? <BulletList items={r.critical_notes} />
              : <Prose>{r.critical_notes}</Prose>}
          </div>
        )}
      </Card>
    </div>
  );
}

// ───── step 4: theme-matrix ─────

interface Step4Result {
  theme_id: string;
  core_configuration?: { description?: string; structure_logic?: string };
  axes_articulation?: { axis_id: string; axis_name?: string; function_in_theme?: string; specific_contribution?: string }[];
  bridge_integration?: BridgeItem[];
  structural_tensions?: { tension?: string; description?: string }[] | string[];
  structural_questions?: string[];
  translation_potential?: { domain?: string; reason?: string }[] | string;
  configuration_summary?: string;
}

function Step4Viewer({ data }: { data: { results?: Step4Result[] } }) {
  const results = data.results ?? [];
  const [active, setActive] = useState(0);
  const r = results[active];
  if (!r) return <Subtle>Nessun risultato.</Subtle>;

  return (
    <div className="space-y-4">
      <ThemeTabs themes={results.map((x) => ({ theme_id: x.theme_id }))} activeIdx={active} onChange={setActive} />
      <Card>
        <h3 className="font-semibold text-slate-900 mb-2">{r.theme_id}</h3>

        {r.core_configuration && (
          <div className="rounded bg-emerald-50 border-l-4 border-emerald-400 p-3 my-3">
            <p className="text-xs font-semibold text-emerald-800 uppercase mb-1">Core configuration</p>
            {r.core_configuration.description && <Prose>{r.core_configuration.description}</Prose>}
            {r.core_configuration.structure_logic && (
              <p className="text-xs text-emerald-900 mt-2 italic">→ {r.core_configuration.structure_logic}</p>
            )}
          </div>
        )}

        {r.axes_articulation && r.axes_articulation.length > 0 && (
          <>
            <SectionTitle>Articolazione degli assi</SectionTitle>
            <div className="space-y-3">
              {r.axes_articulation.map((a, i) => (
                <div key={i} className="border-l-2 border-slate-300 pl-3">
                  <p className="font-medium text-slate-900 text-sm">{a.axis_name ?? a.axis_id}</p>
                  {a.function_in_theme && <KeyValue label="Funzione" value={<Prose>{a.function_in_theme}</Prose>} />}
                  {a.specific_contribution && <KeyValue label="Contributo" value={<Prose>{a.specific_contribution}</Prose>} />}
                </div>
              ))}
            </div>
          </>
        )}

        {r.bridge_integration && r.bridge_integration.length > 0 && (
          <>
            <SectionTitle>Integrazione concetti-ponte</SectionTitle>
            <div className="space-y-2">
              {r.bridge_integration.map((b, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium text-slate-900">{bridgeLabel(b)}</span>
                  {bridgeAxes(b) && <span className="text-slate-500 ml-2">↔ {bridgeAxes(b)!.join(' / ')}</span>}
                  {b.linked_nodes && b.linked_nodes.length > 0 && (
                    <span className="text-slate-400 ml-2 text-xs">[nodi: {b.linked_nodes.join(', ')}]</span>
                  )}
                  {b.type && <Chip className="ml-2">{b.type}</Chip>}
                  {(b.function ?? b.description ?? b.reason) && (
                    <p className="text-slate-600 leading-relaxed mt-0.5">{b.function ?? b.description ?? b.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {r.structural_tensions && r.structural_tensions.length > 0 && (
          <>
            <SectionTitle>Tensioni strutturali</SectionTitle>
            <BulletList items={(r.structural_tensions as Array<string | { tension?: string; description?: string }>).map((t) => {
              if (typeof t === 'string') return t;
              return t.description ? `${t.tension ?? ''} — ${t.description}` : (t.tension ?? '');
            })} />
          </>
        )}

        {r.structural_questions && r.structural_questions.length > 0 && (
          <>
            <SectionTitle>Domande strutturali</SectionTitle>
            <BulletList items={r.structural_questions} />
          </>
        )}

        {r.translation_potential && (
          <>
            <SectionTitle>Potenziale di traduzione</SectionTitle>
            {typeof r.translation_potential === 'string' ? (
              <Prose>{r.translation_potential}</Prose>
            ) : (
              <div className="space-y-2">
                {r.translation_potential.map((tp, i) => (
                  <div key={i} className="text-sm">
                    <Chip className="mr-2">{tp.domain ?? '?'}</Chip>
                    {tp.reason && <span className="text-slate-700 leading-relaxed">{tp.reason}</span>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {r.configuration_summary && (
          <details className="mt-4">
            <summary className="cursor-pointer text-xs font-semibold text-slate-600">Sintesi configurazionale</summary>
            <div className="mt-2"><Prose>{r.configuration_summary}</Prose></div>
          </details>
        )}
      </Card>
    </div>
  );
}

// ───── step 5: output-family ─────

interface Step5Family {
  domain?: string;
  output_type?: string;
  description?: string;
  structural_basis?: { axes?: string[]; nodes?: string[]; tensions?: string[]; node_interpretation?: string };
  value_added?: string;
  reduction_risk?: string;
  // tollero varianti viste in dati storici
  risks?: string | string[];
  who_can_use?: string;
}

interface Step5Result {
  theme_id: string;
  output_families?: Step5Family[];
  meta_notes?: string | {
    next_step_orientation?: string;
    coherence_with_structure?: string;
    limitations?: string;
  };
}

const DOMAIN_COLORS: Record<string, string> = {
  clinico:   'bg-rose-50 border-rose-200 text-rose-900',
  educativo: 'bg-amber-50 border-amber-200 text-amber-900',
  formazione:'bg-purple-50 border-purple-200 text-purple-900',
  politiche: 'bg-blue-50 border-blue-200 text-blue-900',
};

function Step5Viewer({ data }: { data: { results?: Step5Result[] } }) {
  const results = data.results ?? [];
  const [active, setActive] = useState(0);
  const r = results[active];
  if (!r) return <Subtle>Nessun risultato.</Subtle>;

  return (
    <div className="space-y-4">
      <ThemeTabs themes={results.map((x) => ({ theme_id: x.theme_id }))} activeIdx={active} onChange={setActive} />
      <div>
        <h3 className="font-semibold text-slate-900 mb-2">{r.theme_id}</h3>

        {r.output_families && r.output_families.length > 0 && (
          <div className="space-y-3">
            {r.output_families.map((f, i) => {
              const dc = DOMAIN_COLORS[(f.domain ?? '').toLowerCase()] ?? 'bg-slate-50 border-slate-200 text-slate-900';
              return (
                <div key={i} className={`rounded-lg border p-4 ${dc}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide">{f.domain ?? 'dominio'}</span>
                    {f.output_type && <span className="text-sm font-medium">— {f.output_type}</span>}
                  </div>
                  {f.description && <Prose>{f.description}</Prose>}

                  {f.structural_basis && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-semibold opacity-80">Base strutturale</summary>
                      <div className="mt-2 space-y-1 text-xs">
                        {f.structural_basis.axes && <KeyValue label="Assi" value={f.structural_basis.axes.join(', ')} />}
                        {f.structural_basis.nodes && <KeyValue label="Nodi" value={f.structural_basis.nodes.join(', ')} />}
                        {f.structural_basis.tensions && <KeyValue label="Tensioni" value={f.structural_basis.tensions.join('; ')} />}
                        {f.structural_basis.node_interpretation && (
                          <KeyValue label="Interpretazione" value={<Prose>{f.structural_basis.node_interpretation}</Prose>} />
                        )}
                      </div>
                    </details>
                  )}

                  {f.value_added && <KeyValue label="Valore aggiunto" value={<Prose>{f.value_added}</Prose>} />}
                  {f.who_can_use && <KeyValue label="Chi può usarlo" value={<Prose>{f.who_can_use}</Prose>} />}
                  {f.reduction_risk && <KeyValue label="Rischio di riduzione" value={<Prose>{f.reduction_risk}</Prose>} />}
                  {f.risks && (
                    <KeyValue label="Rischi" value={
                      Array.isArray(f.risks) ? <BulletList items={f.risks} /> : <Prose>{f.risks}</Prose>
                    } />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {r.meta_notes && (
          <div className="mt-4 p-3 rounded bg-slate-50 border border-slate-200 space-y-2">
            <p className="text-xs font-semibold text-slate-700">Meta note</p>
            {typeof r.meta_notes === 'string' ? (
              <Prose>{r.meta_notes}</Prose>
            ) : (
              <>
                {r.meta_notes.coherence_with_structure && (
                  <KeyValue label="Coerenza con la struttura" value={<Prose>{r.meta_notes.coherence_with_structure}</Prose>} />
                )}
                {r.meta_notes.limitations && (
                  <KeyValue label="Limitazioni" value={<Prose>{r.meta_notes.limitations}</Prose>} />
                )}
                {r.meta_notes.next_step_orientation && (
                  <KeyValue label="Orientamento per F3" value={<Prose>{r.meta_notes.next_step_orientation}</Prose>} />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ───── step 2a: node-verification (verifica nodi trasversali) ─────

interface Step2aCanonicalMapping {
  canonical_node_id: 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | 'N6' | 'N7';
  type: 'identico' | 'istanza' | 'parziale';
  rationale: string;
}

interface Step2aNodeMapping {
  node_id: string;
  node_label: string;
  axes: number[];
  canonical_mapping: Step2aCanonicalMapping | null;
}

interface Step2aActivatedCanonical {
  canonical_node_id: string;
  coverage_type: 'piena' | 'parziale';
  covered_by: string[];
}

interface Step2aAbsentCanonical {
  canonical_node_id: string;
  structural_reason: string;
}

interface Step2aPureDerived {
  node_id: string;
  derivation_justification: string;
}

interface Step2aResult {
  theme_id: string;
  node_mappings: Step2aNodeMapping[];
  activated_canonical_nodes: Step2aActivatedCanonical[];
  absent_canonical_nodes: Step2aAbsentCanonical[];
  pure_derived_nodes: Step2aPureDerived[];
  canonical_configuration_assessment: {
    plausibility: 'sì' | 'no' | 'parzialmente';
    plausibility_notes: string;
    missing_relations_notes: string;
    coverage_adequacy: string;
  };
}

const MAPPING_TYPE_COLOR: Record<string, string> = {
  identico: 'forte',
  istanza:  'plausibile',
  parziale: 'ambiguo',
};

const PLAUSIBILITY_COLOR: Record<string, string> = {
  'sì':           'forte',
  'no':           'distorta',
  'parzialmente': 'ambiguo',
};

const COVERAGE_COLOR: Record<string, string> = {
  piena:    'forte',
  parziale: 'ambiguo',
};

function Step2aViewer({ data }: { data: { results?: Step2aResult[] } }) {
  const results = data.results ?? [];
  const [active, setActive] = useState(0);
  const r = results[active];
  if (!r) return <Subtle>Nessun risultato disponibile</Subtle>;

  return (
    <div className="space-y-4">
      <ThemeTabs themes={results.map((t) => ({ theme_id: t.theme_id }))} activeIdx={active} onChange={setActive} />

      <CalloutBox
        title="Plausibilità configurazionale"
        tone={r.canonical_configuration_assessment.plausibility === 'sì' ? 'emerald' : r.canonical_configuration_assessment.plausibility === 'no' ? 'rose' : 'amber'}
      >
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Chip color={PLAUSIBILITY_COLOR[r.canonical_configuration_assessment.plausibility] ?? 'slate'}>
            {r.canonical_configuration_assessment.plausibility}
          </Chip>
        </div>
        <KeyValue label="Plausibilità" value={<Prose>{r.canonical_configuration_assessment.plausibility_notes}</Prose>} />
        <KeyValue label="Relazioni mancanti" value={<Prose>{r.canonical_configuration_assessment.missing_relations_notes}</Prose>} />
        <KeyValue label="Adeguatezza copertura" value={<Prose>{r.canonical_configuration_assessment.coverage_adequacy}</Prose>} />
      </CalloutBox>

      <Card>
        <SectionTitle>Mappatura dei nodi candidati ({r.node_mappings.length})</SectionTitle>
        <div className="space-y-2">
          {r.node_mappings.map((m, i) => (
            <div key={i} className="border-l-2 border-slate-300 pl-3 py-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xs font-mono text-slate-400">{m.node_id}</span>
                <span className="text-sm font-medium text-slate-900">{m.node_label}</span>
                <span className="text-xs text-slate-500">assi: {m.axes.join(', ')}</span>
              </div>
              {m.canonical_mapping ? (
                <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs text-slate-500">→</span>
                  <span className="text-xs font-mono text-slate-700">{m.canonical_mapping.canonical_node_id}</span>
                  <Chip color={MAPPING_TYPE_COLOR[m.canonical_mapping.type] ?? 'slate'}>{m.canonical_mapping.type}</Chip>
                  <span className="text-xs text-slate-600 italic">{m.canonical_mapping.rationale}</span>
                </div>
              ) : (
                <div className="mt-1 text-xs text-slate-500 italic">→ derivato puro (nessun canonico)</div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-3">
        <Card>
          <SectionTitle>Canonici attivati ({r.activated_canonical_nodes.length})</SectionTitle>
          <div className="space-y-1.5">
            {r.activated_canonical_nodes.length === 0 && <Subtle>nessuno</Subtle>}
            {r.activated_canonical_nodes.map((a, i) => (
              <div key={i} className="text-sm flex items-baseline gap-2 flex-wrap">
                <span className="font-mono text-slate-700">{a.canonical_node_id}</span>
                <Chip color={COVERAGE_COLOR[a.coverage_type] ?? 'slate'}>{a.coverage_type}</Chip>
                <span className="text-xs text-slate-500">via {a.covered_by.join(', ')}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Canonici assenti ({r.absent_canonical_nodes.length})</SectionTitle>
          <div className="space-y-1.5">
            {r.absent_canonical_nodes.length === 0 && <Subtle>nessuno</Subtle>}
            {r.absent_canonical_nodes.map((a, i) => (
              <div key={i} className="text-sm">
                <span className="font-mono text-slate-700 mr-2">{a.canonical_node_id}</span>
                <span className="text-xs text-slate-600 italic">{a.structural_reason}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {r.pure_derived_nodes.length > 0 && (
        <Card>
          <SectionTitle>Nodi derivati puri ({r.pure_derived_nodes.length})</SectionTitle>
          <div className="space-y-1.5">
            {r.pure_derived_nodes.map((p, i) => (
              <div key={i} className="text-sm">
                <span className="font-mono text-slate-700 mr-2">{p.node_id}</span>
                <span className="text-xs text-slate-600 italic">{p.derivation_justification}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ───── step 4b: ce-prototipica ─────

interface Step4bNodeState {
  node_id: 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | 'N6' | 'N7';
  state: '↑' | '~' | '↓' | '!' | '?';
  rationale: string;
}

interface Step4bNodeRelation {
  from_node: string;
  to_node: string;
  relation_type: 'CPL' | 'VIN' | 'MED' | 'CMP';
  rationale: string;
}

interface Step4bCE {
  S: Step4bNodeState[];
  R: Step4bNodeRelation[];
  D: '↗' | '→' | '↘';
  T: 'T1' | 'T2' | 'T3';
  A: 'A+' | 'A±' | 'A-';
}

interface Step4bVariant {
  variant_name: string;
  modified_dimension: 'S' | 'R' | 'D' | 'T' | 'A';
  modification_description: string;
  structural_description: string;
}

interface Step4bResult {
  theme_id: string;
  ce_prototipica: Step4bCE;
  ce_notation: string;
  ce_natural_language: string;
  ce_variants: Step4bVariant[];
  derivation_notes: string;
}

const RELATION_LABEL: Record<string, string> = {
  CPL: 'sostegno',
  VIN: 'vincolo',
  MED: 'mediazione',
  CMP: 'compensazione',
};

const STATE_COLOR: Record<string, string> = {
  '↑': 'forte',
  '~': 'plausibile',
  '↓': 'ambiguo',
  '!': 'distorta',
  '?': 'rejected',
};

function Step4bViewer({ data }: { data: { results?: Step4bResult[] } }) {
  const results = data.results ?? [];
  const [active, setActive] = useState(0);
  const r = results[active];
  if (!r) return <Subtle>Nessun risultato disponibile</Subtle>;
  const ce = r.ce_prototipica;

  return (
    <div className="space-y-4">
      <ThemeTabs themes={results.map((t) => ({ theme_id: t.theme_id }))} activeIdx={active} onChange={setActive} />

      <CalloutBox title="Notazione CE" tone="slate">
        <code className="text-sm font-mono text-slate-800 whitespace-pre-wrap break-words">{r.ce_notation}</code>
      </CalloutBox>

      <Card>
        <SectionTitle>Linguaggio naturale</SectionTitle>
        <Prose>{r.ce_natural_language}</Prose>
      </Card>

      <Card>
        <SectionTitle>Stato dei nodi (S)</SectionTitle>
        <div className="space-y-1.5">
          {ce.S.map((s, i) => (
            <div key={i} className="flex items-baseline gap-2 text-sm flex-wrap">
              <span className="font-mono text-slate-700">{s.node_id}</span>
              <Chip color={STATE_COLOR[s.state] ?? 'slate'}>{s.state}</Chip>
              <span className="text-xs text-slate-600 italic">{s.rationale}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>Relazioni dominanti (R)</SectionTitle>
        <div className="space-y-1.5">
          {ce.R.map((rel, i) => (
            <div key={i} className="text-sm">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-mono text-slate-700">{rel.from_node} → {rel.to_node}</span>
                <Chip color="derived">{rel.relation_type} · {RELATION_LABEL[rel.relation_type] ?? ''}</Chip>
              </div>
              <p className="text-xs text-slate-600 italic mt-0.5 ml-1">{rel.rationale}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>Dimensioni</SectionTitle>
        <div className="grid sm:grid-cols-3 gap-2">
          <KeyValue label="Direzione (D)" value={<span className="text-2xl">{ce.D}</span>} />
          <KeyValue label="Stabilità (T)" value={<Chip>{ce.T}</Chip>} />
          <KeyValue label="Abitabilità (A)" value={<Chip color={ce.A === 'A+' ? 'forte' : ce.A === 'A-' ? 'distorta' : 'ambiguo'}>{ce.A}</Chip>} />
        </div>
      </Card>

      <Card>
        <SectionTitle>Varianti ({r.ce_variants.length})</SectionTitle>
        <div className="space-y-2">
          {r.ce_variants.map((v, i) => (
            <div key={i} className="border-l-2 border-purple-300 pl-3 py-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-medium text-slate-900">{v.variant_name}</span>
                <Chip color="derived">modifica: {v.modified_dimension}</Chip>
              </div>
              <KeyValue label="Modifica" value={<Prose>{v.modification_description}</Prose>} />
              <KeyValue label="Descrizione strutturale" value={<Prose>{v.structural_description}</Prose>} />
            </div>
          ))}
        </div>
      </Card>

      {r.derivation_notes && (
        <CalloutBox title="Note di derivazione" tone="sky"><Prose>{r.derivation_notes}</Prose></CalloutBox>
      )}
    </div>
  );
}

// ───── step 6: output-tipo-vuoto (passaporto del tema) ─────

interface Step6StructuralReference {
  confirmed_nodes: string[];
  canonical_nodes_active: string[];
  ce_reference: string;
}

interface Step6CampoCondiviso {
  forma_prevalente: 'condiviso' | 'parallelo' | 'frammentato';
  elementi_sostenenti: string[];
  elementi_ostacolanti: string[];
  segnali_accesso: string[];
}

interface Step6PosizioneSoggettiva {
  modalita_prototipica: 'emergenza_di_posizione' | 'reattività' | 'evitamento' | 'oscillazione';
  funzione_adulto: string;
  permanenza_nel_legame: string;
  forme_degradate: string[];
}

interface Step6RapportoConLimite {
  presenza: 'sì' | 'no' | 'condizionalmente';
  forma_del_limite: string;
  reazione_strutturale: 'A+' | 'A±' | 'A-';
  nominazione: string;
}

interface Step6IpotesiSostegno {
  direzione: 'campo_condiviso' | 'posizione_soggettiva' | 'limite_nominabile';
  descrizione_strutturale: string;
  nodo_principale: string;
}

interface Step6TipologiaUniversale {
  id: 'U1' | 'U2' | 'U3' | 'U4' | 'U5' | 'U6';
  label: string;
  pertinenza: string;
}

interface Step6Result {
  theme_id: string;
  structural_reference: Step6StructuralReference;
  campo_condiviso: Step6CampoCondiviso;
  posizione_soggettiva: Step6PosizioneSoggettiva;
  rapporto_con_limite: Step6RapportoConLimite;
  configurazione_complessiva: string;
  ipotesi_sostegno: Step6IpotesiSostegno[];
  tipologia_universale: Step6TipologiaUniversale[];
}

const FORMA_CAMPO_COLOR: Record<string, string> = {
  condiviso:   'forte',
  parallelo:   'ambiguo',
  frammentato: 'distorta',
};

const PRESENZA_LIMITE_COLOR: Record<string, string> = {
  'sì':              'forte',
  'no':              'distorta',
  condizionalmente:  'ambiguo',
};

function Step6Viewer({ data }: { data: { results?: Step6Result[] } }) {
  const results = data.results ?? [];
  const [active, setActive] = useState(0);
  const r = results[active];
  if (!r) return <Subtle>Nessun risultato disponibile</Subtle>;

  return (
    <div className="space-y-4">
      <ThemeTabs themes={results.map((t) => ({ theme_id: t.theme_id }))} activeIdx={active} onChange={setActive} />

      <CalloutBox title="Configurazione complessiva" tone="emerald">
        <Prose>{r.configurazione_complessiva}</Prose>
      </CalloutBox>

      <details className="rounded-md border border-slate-200 bg-slate-50">
        <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100">
          Riferimento strutturale
        </summary>
        <div className="px-3 pb-3 pt-1">
          <KeyValue
            label="Nodi confermati"
            value={<div className="flex flex-wrap gap-1">{r.structural_reference.confirmed_nodes.map((n) => <Chip key={n}>{n}</Chip>)}</div>}
          />
          <KeyValue
            label="Canonici attivi"
            value={<div className="flex flex-wrap gap-1">{r.structural_reference.canonical_nodes_active.map((n) => <Chip key={n} color="derived">{n}</Chip>)}</div>}
          />
          <KeyValue label="CE di riferimento" value={<code className="text-xs font-mono text-slate-700">{r.structural_reference.ce_reference}</code>} />
        </div>
      </details>

      <Card>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base font-bold text-slate-900">A</span>
          <SectionTitle>Campo condiviso</SectionTitle>
        </div>
        <KeyValue
          label="Forma prevalente"
          value={<Chip color={FORMA_CAMPO_COLOR[r.campo_condiviso.forma_prevalente] ?? 'slate'}>{r.campo_condiviso.forma_prevalente}</Chip>}
        />
        <div className="grid sm:grid-cols-2 gap-3 mt-2">
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">Sostenenti</p>
            <BulletList items={r.campo_condiviso.elementi_sostenenti} empty="nessuno" />
          </div>
          <div>
            <p className="text-xs font-semibold text-rose-700 uppercase tracking-wide mb-1">Ostacolanti</p>
            <BulletList items={r.campo_condiviso.elementi_ostacolanti} empty="nessuno" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Segnali di accesso</p>
          <BulletList items={r.campo_condiviso.segnali_accesso} empty="nessuno" />
        </div>
      </Card>

      <Card>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base font-bold text-slate-900">B</span>
          <SectionTitle>Posizione soggettiva</SectionTitle>
        </div>
        <KeyValue label="Modalità prototipica" value={<Chip>{r.posizione_soggettiva.modalita_prototipica.replace(/_/g, ' ')}</Chip>} />
        <KeyValue label="Funzione dell'adulto" value={<Prose>{r.posizione_soggettiva.funzione_adulto}</Prose>} />
        <KeyValue label="Permanenza nel legame" value={<Prose>{r.posizione_soggettiva.permanenza_nel_legame}</Prose>} />
        <div className="mt-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Forme degradate</p>
          <BulletList items={r.posizione_soggettiva.forme_degradate} empty="nessuna" />
        </div>
      </Card>

      <Card>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base font-bold text-slate-900">C</span>
          <SectionTitle>Rapporto con il limite</SectionTitle>
        </div>
        <KeyValue
          label="Presenza"
          value={<Chip color={PRESENZA_LIMITE_COLOR[r.rapporto_con_limite.presenza] ?? 'slate'}>{r.rapporto_con_limite.presenza}</Chip>}
        />
        <KeyValue label="Forma del limite" value={<Prose>{r.rapporto_con_limite.forma_del_limite}</Prose>} />
        <KeyValue
          label="Reazione strutturale"
          value={<Chip color={r.rapporto_con_limite.reazione_strutturale === 'A+' ? 'forte' : r.rapporto_con_limite.reazione_strutturale === 'A-' ? 'distorta' : 'ambiguo'}>{r.rapporto_con_limite.reazione_strutturale}</Chip>}
        />
        <KeyValue label="Nominazione" value={<Prose>{r.rapporto_con_limite.nominazione}</Prose>} />
      </Card>

      <Card>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base font-bold text-slate-900">E</span>
          <SectionTitle>Ipotesi di sostegno ({r.ipotesi_sostegno.length})</SectionTitle>
        </div>
        <div className="space-y-2">
          {r.ipotesi_sostegno.map((ip, i) => (
            <div key={i} className="border-l-2 border-blue-300 pl-3 py-1">
              <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                <Chip color="secondary">{ip.direzione.replace(/_/g, ' ')}</Chip>
                <span className="text-xs font-mono text-slate-600">nodo: {ip.nodo_principale}</span>
              </div>
              <Prose>{ip.descrizione_strutturale}</Prose>
            </div>
          ))}
        </div>
      </Card>

      {r.tipologia_universale.length > 0 && (
        <Card>
          <SectionTitle>Tipologia universale ({r.tipologia_universale.length})</SectionTitle>
          <div className="space-y-2">
            {r.tipologia_universale.map((u) => (
              <div key={u.id} className="text-sm">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <Chip color="derived">{u.id}</Chip>
                  <span className="font-medium text-slate-900">{u.label}</span>
                </div>
                <p className="text-xs text-slate-600 italic ml-1">{u.pertinenza}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ───── dispatcher ─────

export interface F2OutputViewerProps {
  stepId: string;
  data: unknown;
}

export default function F2OutputViewer({ stepId, data }: F2OutputViewerProps) {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;

  switch (stepId) {
    case 'f2_step_2':
      return <Step2Viewer data={d as { results?: Step2Result[] }} />;
    case 'f2_step_2a':
      return <Step2aViewer data={d as { results?: Step2aResult[] }} />;
    case 'f2_step_3':
      return <Step3Viewer data={d as { results?: Step3Result[] }} />;
    case 'f2_step_4':
      return <Step4Viewer data={d as { results?: Step4Result[] }} />;
    case 'f2_step_4b':
      return <Step4bViewer data={d as { results?: Step4bResult[] }} />;
    case 'f2_step_5':
      return <Step5Viewer data={d as { results?: Step5Result[] }} />;
    case 'f2_step_6':
      return <Step6Viewer data={d as { results?: Step6Result[] }} />;
    default:
      return null;
  }
}

export function hasF2Viewer(stepId: string): boolean {
  return stepId.startsWith('f2_step_')
    && ['2', '2a', '3', '4', '4b', '5', '6'].includes(stepId.slice('f2_step_'.length));
}
