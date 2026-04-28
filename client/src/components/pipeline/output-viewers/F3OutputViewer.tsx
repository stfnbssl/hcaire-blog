// Viewer strutturato per gli output della Fase 3 (f3_step_1 … f3_step_5).
// Stesso pattern di F2OutputViewer: dispatcher su step_id + sub-componenti per ogni step.
// Step 6, 6b, 6c, 7, 8, 9, 10 verranno aggiunti man mano che arrivano output reali.

import { useState } from 'react';
import {
  Chip, SectionTitle, Subtle, Prose, Card, KeyValue, BulletList, ThemeTabs, CalloutBox,
} from './viewerPrimitives';

// ───── helpers comuni F3 ─────

interface StructuralReference {
  core_configuration?: string;
  axes?: string[];
  nodes?: string[];
  bridge_concepts?: string[];
}

function StructuralReferenceBlock({ sr }: { sr?: StructuralReference }) {
  if (!sr) return null;
  return (
    <div className="rounded-md bg-slate-50 border border-slate-200 p-3 my-3 text-sm">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Riferimento strutturale</p>
      {sr.core_configuration && <Prose>{sr.core_configuration}</Prose>}
      <div className="mt-2 space-y-1">
        {sr.axes && sr.axes.length > 0 && (
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-slate-500">assi:</span>
            <span className="flex flex-wrap gap-1">{sr.axes.map((a, i) => <Chip key={i}>{a}</Chip>)}</span>
          </div>
        )}
        {sr.nodes && sr.nodes.length > 0 && (
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-slate-500">nodi:</span>
            <span className="flex flex-wrap gap-1">{sr.nodes.map((n, i) => <Chip key={i}>{n}</Chip>)}</span>
          </div>
        )}
        {sr.bridge_concepts && sr.bridge_concepts.length > 0 && (
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-slate-500">concetti-ponte:</span>
            <span className="flex flex-wrap gap-1">{sr.bridge_concepts.map((b, i) => <Chip color="derived" key={i}>{b}</Chip>)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ───── step 1: lettura-configurazionale ─────

interface FieldState {
  state: string;
  structural_signature?: string;
  boundary_with_adjacent?: string;
}

interface CoRegulationFunction {
  function: string;
  structural_role?: string;
  discrimination_from_adjacent?: string;
}

interface PassageClass {
  class?: string;
  structural_signature?: string;
  proxies?: string[] | { proxy?: string; description?: string }[];
  [k: string]: unknown;
}

interface ReadingFocusItem {
  dimension: string;
  description?: string;
  field_states?: FieldState[];
  co_regulation_functions?: CoRegulationFunction[];
  passage_classes?: PassageClass[];
  ambiguity_clause?: string;
  non_scalar_clause?: string;
}

interface InterpretiveWarning {
  risk_type?: string;
  description?: string;
}

interface AccessPoint {
  label?: string;
  description?: string;
}

interface Step1Result {
  device_id?: string;
  theme_id?: string;
  domain?: string;
  device_type?: string;
  function?: string;
  structural_reference?: StructuralReference;
  reading_focus?: ReadingFocusItem[];
  access_points?: AccessPoint[];
  structural_questions?: string[];
  interpretive_warnings?: InterpretiveWarning[];
  non_permitted_transformations?: string[];
}

interface Step1Data {
  domain_selected?: string;
  results?: Step1Result[];
}

function ReadingFocusBlock({ items }: { items?: ReadingFocusItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details key={i} className="rounded-md border border-slate-200 bg-white" open={i === 0}>
          <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50">
            {item.dimension}
          </summary>
          <div className="px-3 pb-3 pt-1 space-y-2">
            {item.description && <Prose>{item.description}</Prose>}

            {item.field_states && item.field_states.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-semibold text-slate-600 mb-1.5">Stati del campo</p>
                <div className="space-y-1.5">
                  {item.field_states.map((fs, j) => (
                    <div key={j} className="border-l-2 border-slate-300 pl-2 text-xs">
                      <Chip color={fs.state}>{fs.state}</Chip>
                      {fs.structural_signature && <p className="text-slate-700 leading-relaxed mt-1">{fs.structural_signature}</p>}
                      {fs.boundary_with_adjacent && <p className="text-slate-500 italic mt-1">↳ confine: {fs.boundary_with_adjacent}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.co_regulation_functions && item.co_regulation_functions.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-semibold text-slate-600 mb-1.5">Funzioni co-regolatorie</p>
                <div className="space-y-1.5">
                  {item.co_regulation_functions.map((cr, j) => (
                    <div key={j} className="border-l-2 border-slate-300 pl-2 text-xs">
                      <Chip>{cr.function}</Chip>
                      {cr.structural_role && <p className="text-slate-700 leading-relaxed mt-1">{cr.structural_role}</p>}
                      {cr.discrimination_from_adjacent && <p className="text-slate-500 italic mt-1">↳ {cr.discrimination_from_adjacent}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.passage_classes && item.passage_classes.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-semibold text-slate-600 mb-1.5">Classi del passaggio</p>
                <div className="space-y-1.5">
                  {item.passage_classes.map((pc, j) => (
                    <div key={j} className="border-l-2 border-slate-300 pl-2 text-xs">
                      {pc.class && <Chip color={pc.class}>{pc.class}</Chip>}
                      {pc.structural_signature && <p className="text-slate-700 leading-relaxed mt-1">{pc.structural_signature}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.ambiguity_clause && (
              <CalloutBox title="Clausola di ambiguità" tone="amber">
                <Prose>{item.ambiguity_clause}</Prose>
              </CalloutBox>
            )}
            {item.non_scalar_clause && (
              <CalloutBox title="Clausola non-scalare" tone="sky">
                <Prose>{item.non_scalar_clause}</Prose>
              </CalloutBox>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

function Step1Viewer({ data }: { data: Step1Data }) {
  const results = data.results ?? [];
  const [active, setActive] = useState(0);
  const r = results[active];
  if (!r) return <Subtle>Nessun risultato.</Subtle>;

  return (
    <div className="space-y-4">
      {data.domain_selected && (
        <div className="text-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-2">Dominio:</span>
          <Chip>{data.domain_selected}</Chip>
        </div>
      )}
      <ThemeTabs
        themes={results.map((x, i) => ({ theme_id: x.theme_id ?? String(i), label: x.theme_id ?? `Risultato ${i + 1}` }))}
        activeIdx={active}
        onChange={setActive}
      />
      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h3 className="font-semibold text-slate-900">{r.device_id ?? r.theme_id ?? 'Dispositivo'}</h3>
          {r.device_type && <Chip>{r.device_type.replace(/_/g, ' ')}</Chip>}
          {r.domain && <Chip color="secondary">{r.domain}</Chip>}
        </div>

        {r.function && (
          <CalloutBox title="Funzione del dispositivo" tone="emerald">
            <Prose>{r.function}</Prose>
          </CalloutBox>
        )}

        <StructuralReferenceBlock sr={r.structural_reference} />

        {r.reading_focus && r.reading_focus.length > 0 && (
          <>
            <SectionTitle>Reading focus ({r.reading_focus.length})</SectionTitle>
            <ReadingFocusBlock items={r.reading_focus} />
          </>
        )}

        {r.access_points && r.access_points.length > 0 && (
          <>
            <SectionTitle>Punti di accesso ({r.access_points.length})</SectionTitle>
            <div className="space-y-2">
              {r.access_points.map((ap, i) => (
                <div key={i} className="border-l-2 border-emerald-300 pl-3">
                  <p className="text-sm font-medium text-slate-900">{ap.label}</p>
                  {ap.description && <Prose>{ap.description}</Prose>}
                </div>
              ))}
            </div>
          </>
        )}

        {r.structural_questions && r.structural_questions.length > 0 && (
          <>
            <SectionTitle>Domande strutturali ({r.structural_questions.length})</SectionTitle>
            <BulletList items={r.structural_questions} />
          </>
        )}

        {r.interpretive_warnings && r.interpretive_warnings.length > 0 && (
          <>
            <SectionTitle>Avvertenze interpretative</SectionTitle>
            <div className="space-y-2">
              {r.interpretive_warnings.map((w, i) => (
                <div key={i} className="rounded border border-rose-200 bg-rose-50 p-3 text-sm">
                  {w.risk_type && <Chip color="distorta" className="mb-1">{w.risk_type.replace(/_/g, ' ')}</Chip>}
                  {w.description && <Prose>{w.description}</Prose>}
                </div>
              ))}
            </div>
          </>
        )}

        {r.non_permitted_transformations && r.non_permitted_transformations.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-xs font-semibold text-slate-600">
              Trasformazioni non permesse ({r.non_permitted_transformations.length})
            </summary>
            <div className="mt-2 space-y-2">
              {r.non_permitted_transformations.map((t, i) => (
                <div key={i} className="border-l-2 border-rose-300 pl-3 text-sm text-slate-700 leading-relaxed">{t}</div>
              ))}
            </div>
          </details>
        )}
      </Card>
    </div>
  );
}

// ───── step 2: stress-test ─────

interface ObservedConfiguration {
  // Forma compatta v2 (livello/stato come chiavi)
  corporeita?: string | { state?: string; structural_description?: string };
  campo_intenzionale?: string | { state?: string; structural_description?: string; who_opens?: string; who_enters?: string; duration_of_co_presence?: string };
  co_regolazione?: string | { function?: string; structural_description?: string };
  mediazione_simbolica?: string | { state?: string; structural_description?: string };
  passaggio_trasformativo?: { class?: string; structural_description?: string };
  [k: string]: unknown;
}

interface DevicePerformance {
  readable?: boolean;
  what_it_reads?: string;
  what_becomes_unclear?: string;
  ambiguity_level?: 'basso' | 'medio' | 'alto' | string;
}

interface BreakingPoint {
  present?: boolean;
  where?: string;
  why?: string;
}

interface DiscriminativeValue {
  what_distinguishes_this_case?: string;
  device_can_distinguish?: boolean;
}

interface MisreadingRisks {
  without_device?: string;
  with_device_misused?: string;
}

interface Step2Case {
  case_id?: string;
  case_type?: string;
  case_description?: string;
  observed_configuration?: ObservedConfiguration;
  device_performance?: DevicePerformance;
  breaking_point?: BreakingPoint;
  discriminative_value?: DiscriminativeValue;
  misreading_risks?: MisreadingRisks;
}

interface Step2Data {
  theme_id?: string;
  domain?: string;
  device_id?: string;
  stress_test_results?: Step2Case[];
  // tollero anche varianti future
  cases?: Step2Case[];
}

function ObservedConfigBlock({ oc }: { oc?: ObservedConfiguration }) {
  if (!oc) return null;
  const renderEntry = (key: string, val: unknown) => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') {
      return <KeyValue key={key} label={key.replace(/_/g, ' ')} value={<Prose>{val}</Prose>} />;
    }
    if (typeof val === 'object') {
      const obj = val as Record<string, unknown>;
      const stateOrFn = (obj.state ?? obj.function) as string | undefined;
      const desc = (obj.structural_description ?? obj.structural_signature) as string | undefined;
      return (
        <div key={key} className="grid grid-cols-1 sm:grid-cols-[minmax(160px,auto)_1fr] gap-x-3 gap-y-0.5 py-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{key.replace(/_/g, ' ')}</div>
          <div className="text-sm text-slate-700 leading-relaxed">
            {stateOrFn && <Chip color={stateOrFn} className="mr-2 mb-1">{stateOrFn}</Chip>}
            {desc && <Prose>{desc}</Prose>}
            {Object.entries(obj)
              .filter(([k]) => !['state', 'function', 'structural_description', 'structural_signature'].includes(k))
              .map(([k, v]) => typeof v === 'string'
                ? <p key={k} className="text-xs text-slate-500 mt-1"><span className="font-semibold">{k.replace(/_/g, ' ')}:</span> {v}</p>
                : null)}
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="mt-2">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Configurazione osservata</p>
      {Object.entries(oc).map(([k, v]) => renderEntry(k, v))}
    </div>
  );
}

function Step2Viewer({ data }: { data: Step2Data }) {
  const cases = data.stress_test_results ?? data.cases ?? [];
  const [active, setActive] = useState(0);
  const c = cases[active];
  if (!c) return <Subtle>Nessun caso.</Subtle>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {data.theme_id && <Chip>{data.theme_id}</Chip>}
        {data.domain && <Chip color="secondary">{data.domain}</Chip>}
        {data.device_id && <span className="text-xs text-slate-500 font-mono">{data.device_id}</span>}
      </div>
      <ThemeTabs
        themes={cases.map((x, i) => ({ theme_id: x.case_id ?? String(i), label: x.case_id ?? `Caso ${i + 1}` }))}
        activeIdx={active}
        onChange={setActive}
      />
      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h3 className="font-semibold text-slate-900">{c.case_id}</h3>
          {c.case_type && <Chip color={c.case_type}>{c.case_type.replace(/_/g, ' ')}</Chip>}
        </div>
        {c.case_description && (
          <CalloutBox title="Descrizione del caso" tone="slate">
            <Prose>{c.case_description}</Prose>
          </CalloutBox>
        )}

        <ObservedConfigBlock oc={c.observed_configuration} />

        {c.device_performance && (
          <>
            <SectionTitle>Performance del dispositivo</SectionTitle>
            <div className="space-y-1">
              {c.device_performance.readable !== undefined && (
                <div className="flex items-center gap-2">
                  <Chip color={c.device_performance.readable ? 'presente' : 'assente'}>
                    {c.device_performance.readable ? 'leggibile' : 'non leggibile'}
                  </Chip>
                  {c.device_performance.ambiguity_level && (
                    <Chip color={c.device_performance.ambiguity_level === 'basso' ? 'presente' : c.device_performance.ambiguity_level === 'alto' ? 'distorta' : 'oscillante'}>
                      ambiguità: {c.device_performance.ambiguity_level}
                    </Chip>
                  )}
                </div>
              )}
              {c.device_performance.what_it_reads && (
                <KeyValue label="Cosa legge" value={<Prose>{c.device_performance.what_it_reads}</Prose>} />
              )}
              {c.device_performance.what_becomes_unclear && (
                <KeyValue label="Cosa resta poco chiaro" value={<Prose>{c.device_performance.what_becomes_unclear}</Prose>} />
              )}
            </div>
          </>
        )}

        {c.breaking_point && (
          <>
            <SectionTitle>Breaking point</SectionTitle>
            <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm">
              <Chip color={c.breaking_point.present ? 'distorta' : 'presente'} className="mb-2">
                {c.breaking_point.present ? 'presente' : 'assente'}
              </Chip>
              {c.breaking_point.where && <KeyValue label="Dove" value={<Prose>{c.breaking_point.where}</Prose>} />}
              {c.breaking_point.why && <KeyValue label="Perché" value={<Prose>{c.breaking_point.why}</Prose>} />}
            </div>
          </>
        )}

        {c.discriminative_value && (
          <>
            <SectionTitle>Valore discriminativo</SectionTitle>
            <div className="space-y-1">
              {c.discriminative_value.device_can_distinguish !== undefined && (
                <Chip color={c.discriminative_value.device_can_distinguish ? 'presente' : 'assente'}>
                  {c.discriminative_value.device_can_distinguish ? 'distingue' : 'non distingue'}
                </Chip>
              )}
              {c.discriminative_value.what_distinguishes_this_case && (
                <Prose>{c.discriminative_value.what_distinguishes_this_case}</Prose>
              )}
            </div>
          </>
        )}

        {c.misreading_risks && (
          <>
            <SectionTitle>Rischi di misreading</SectionTitle>
            <div className="space-y-2">
              {c.misreading_risks.without_device && (
                <div className="rounded border-l-4 border-rose-300 bg-rose-50 p-2 text-sm">
                  <p className="text-xs font-semibold text-rose-800 mb-1">Senza dispositivo</p>
                  <Prose>{c.misreading_risks.without_device}</Prose>
                </div>
              )}
              {c.misreading_risks.with_device_misused && (
                <div className="rounded border-l-4 border-amber-300 bg-amber-50 p-2 text-sm">
                  <p className="text-xs font-semibold text-amber-800 mb-1">Con dispositivo usato male</p>
                  <Prose>{c.misreading_risks.with_device_misused}</Prose>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

// ───── step 3: correzione-strutturale ─────

interface StructuralCorrection {
  correction_id?: string;
  target?: string;
  intervention?: string;
}

interface Step3Result extends Step1Result {
  structural_corrections_applied?: StructuralCorrection[];
}

interface Step3Data {
  version?: string;
  based_on?: { device_v1?: string; stress_test_reference?: string };
  domain_selected?: string;
  results?: Step3Result[];
}

function Step3Viewer({ data }: { data: Step3Data }) {
  const results = data.results ?? [];
  const [active, setActive] = useState(0);
  const r = results[active];
  if (!r) return <Subtle>Nessun risultato.</Subtle>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {data.version && <Chip>{data.version}</Chip>}
        {data.domain_selected && <Chip color="secondary">{data.domain_selected}</Chip>}
        {data.based_on?.device_v1 && (
          <span className="text-xs text-slate-500 font-mono">basato su: {data.based_on.device_v1}</span>
        )}
      </div>
      <ThemeTabs
        themes={results.map((x, i) => ({ theme_id: x.theme_id ?? String(i), label: x.theme_id ?? `Risultato ${i + 1}` }))}
        activeIdx={active}
        onChange={setActive}
      />
      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h3 className="font-semibold text-slate-900">{r.device_id ?? r.theme_id}</h3>
          {r.device_type && <Chip>{r.device_type.replace(/_/g, ' ')}</Chip>}
        </div>

        {r.function && (
          <CalloutBox title="Funzione (corretta)" tone="emerald">
            <Prose>{r.function}</Prose>
          </CalloutBox>
        )}

        <StructuralReferenceBlock sr={r.structural_reference} />

        {r.structural_corrections_applied && r.structural_corrections_applied.length > 0 && (
          <>
            <SectionTitle>Correzioni strutturali applicate ({r.structural_corrections_applied.length})</SectionTitle>
            <div className="space-y-2">
              {r.structural_corrections_applied.map((c, i) => (
                <div key={i} className="rounded border border-sky-200 bg-sky-50 p-3 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Chip color="secondary">{c.correction_id}</Chip>
                  </div>
                  {c.target && <KeyValue label="Target" value={c.target} />}
                  {c.intervention && <KeyValue label="Intervento" value={<Prose>{c.intervention}</Prose>} />}
                </div>
              ))}
            </div>
          </>
        )}

        {r.reading_focus && r.reading_focus.length > 0 && (
          <>
            <SectionTitle>Reading focus aggiornato ({r.reading_focus.length})</SectionTitle>
            <ReadingFocusBlock items={r.reading_focus} />
          </>
        )}

        {r.access_points && r.access_points.length > 0 && (
          <>
            <SectionTitle>Punti di accesso ({r.access_points.length})</SectionTitle>
            <div className="space-y-2">
              {r.access_points.map((ap, i) => (
                <div key={i} className="border-l-2 border-emerald-300 pl-3">
                  <p className="text-sm font-medium text-slate-900">{ap.label}</p>
                  {ap.description && <Prose>{ap.description}</Prose>}
                </div>
              ))}
            </div>
          </>
        )}

        {r.structural_questions && r.structural_questions.length > 0 && (
          <>
            <SectionTitle>Domande strutturali ({r.structural_questions.length})</SectionTitle>
            <BulletList items={r.structural_questions} />
          </>
        )}

        {r.interpretive_warnings && r.interpretive_warnings.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-xs font-semibold text-slate-600">
              Avvertenze interpretative ({r.interpretive_warnings.length})
            </summary>
            <div className="mt-2 space-y-2">
              {r.interpretive_warnings.map((w, i) => (
                <div key={i} className="rounded border border-rose-200 bg-rose-50 p-3 text-sm">
                  {w.risk_type && <Chip color="distorta" className="mb-1">{w.risk_type.replace(/_/g, ' ')}</Chip>}
                  {w.description && <Prose>{w.description}</Prose>}
                </div>
              ))}
            </div>
          </details>
        )}

        {r.non_permitted_transformations && r.non_permitted_transformations.length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-semibold text-slate-600">
              Trasformazioni non permesse ({r.non_permitted_transformations.length})
            </summary>
            <div className="mt-2 space-y-2">
              {r.non_permitted_transformations.map((t, i) => (
                <div key={i} className="border-l-2 border-rose-300 pl-3 text-sm text-slate-700 leading-relaxed">{t}</div>
              ))}
            </div>
          </details>
        )}
      </Card>
    </div>
  );
}

// ───── step 4: indistinguibility-test ─────

interface ProxyEvidence {
  proxy?: string;
  evidence_in_case?: string;
  indicates?: string;
}

interface ProxyAnalysis {
  applied_class?: string;
  proxies_present?: ProxyEvidence[];
  why_proxies_indicate_openness?: string;
  mandatory_counter_indicator?: { potential_alternative_reading?: string; why_discarded?: string };
  proxy_confidence?: { decisive_proxy?: string; observability?: string; observability_rationale?: string };
  classification_status?: string;
  classification_status_rationale?: string;
  ambiguity_conditions?: string[];
  classification?: string;
}

interface Step4Case {
  case_id?: string;
  case_type?: string;
  label?: string;
  narrative_thick_description?: string;
  observed_configuration?: ObservedConfiguration;
  proxy_analysis?: ProxyAnalysis;
  alternative_interpretation?: { could_be_read_as?: string; rationale?: string };
  device_discrimination?: { device_distinguishes_this_case?: boolean; discriminating_dimension?: string; discriminating_basis?: string; secondary_support?: string };
  failure_risk?: { conditions_under_which_device_would_fail_on_this_case?: string[] };
}

interface SharedSurface {
  description?: string;
  observable_sequence?: string[];
  what_is_NOT_distinguishable_at_this_level?: string;
}

interface Step4Data {
  version?: string;
  test_type?: string;
  based_on?: { device?: string; step_reference?: string };
  domain?: string;
  shared_behavioral_surface?: SharedSurface;
  cases?: Step4Case[];
}

function Step4Viewer({ data }: { data: Step4Data }) {
  const cases = data.cases ?? [];
  const [active, setActive] = useState(0);
  const c = cases[active];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {data.version && <Chip>{data.version}</Chip>}
        {data.test_type && <Chip color="secondary">{data.test_type.replace(/_/g, ' ')}</Chip>}
        {data.domain && <Chip color="secondary">{data.domain}</Chip>}
        {data.based_on?.device && <span className="text-xs text-slate-500 font-mono">device: {data.based_on.device}</span>}
      </div>

      {data.shared_behavioral_surface && (
        <details className="rounded-md border border-slate-200 bg-slate-50 p-3" open>
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">Superficie comportamentale condivisa</summary>
          <div className="mt-2 space-y-2 text-sm">
            {data.shared_behavioral_surface.description && <Prose>{data.shared_behavioral_surface.description}</Prose>}
            {data.shared_behavioral_surface.observable_sequence && (
              <KeyValue label="Sequenza osservabile" value={<BulletList items={data.shared_behavioral_surface.observable_sequence} />} />
            )}
            {data.shared_behavioral_surface.what_is_NOT_distinguishable_at_this_level && (
              <KeyValue label="Non distinguibile a questo livello" value={<Prose>{data.shared_behavioral_surface.what_is_NOT_distinguishable_at_this_level}</Prose>} />
            )}
          </div>
        </details>
      )}

      <ThemeTabs
        themes={cases.map((x, i) => ({ theme_id: x.case_id ?? String(i), label: x.case_id ?? `Caso ${i + 1}` }))}
        activeIdx={active}
        onChange={setActive}
      />

      {!c && <Subtle>Nessun caso.</Subtle>}
      {c && (
        <Card>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="font-semibold text-slate-900">{c.case_id}</h3>
            {c.case_type && <Chip color={c.case_type}>{c.case_type.replace(/_/g, ' ')}</Chip>}
          </div>
          {c.label && <p className="text-sm text-slate-600 mb-2">{c.label}</p>}

          {c.narrative_thick_description && (
            <CalloutBox title="Narrative thick description" tone="slate">
              <Prose>{c.narrative_thick_description}</Prose>
            </CalloutBox>
          )}

          <ObservedConfigBlock oc={c.observed_configuration} />

          {c.proxy_analysis && (
            <>
              <SectionTitle>Analisi dei proxy</SectionTitle>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {c.proxy_analysis.classification && (
                    <Chip color={c.proxy_analysis.classification}>classificazione: {c.proxy_analysis.classification}</Chip>
                  )}
                  {c.proxy_analysis.classification_status && (
                    <Chip>{c.proxy_analysis.classification_status}</Chip>
                  )}
                  {c.proxy_analysis.applied_class && c.proxy_analysis.applied_class !== c.proxy_analysis.classification && (
                    <span className="text-xs text-slate-500">classe applicata: {c.proxy_analysis.applied_class}</span>
                  )}
                </div>

                {c.proxy_analysis.proxies_present && c.proxy_analysis.proxies_present.length > 0 && (
                  <div className="space-y-1.5 mt-2">
                    {c.proxy_analysis.proxies_present.map((p, i) => (
                      <div key={i} className="border-l-2 border-emerald-300 pl-3 text-sm">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-900">{p.proxy}</span>
                          {p.indicates && <Chip color={p.indicates}>{p.indicates}</Chip>}
                        </div>
                        {p.evidence_in_case && <p className="text-slate-700 leading-relaxed mt-1 italic">{p.evidence_in_case}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {c.proxy_analysis.why_proxies_indicate_openness && (
                  <KeyValue label="Perché i proxy indicano apertura" value={<Prose>{c.proxy_analysis.why_proxies_indicate_openness}</Prose>} />
                )}

                {c.proxy_analysis.mandatory_counter_indicator && (
                  <CalloutBox title="Contro-indicatore obbligatorio" tone="amber">
                    {c.proxy_analysis.mandatory_counter_indicator.potential_alternative_reading && (
                      <KeyValue label="Lettura alternativa" value={<Prose>{c.proxy_analysis.mandatory_counter_indicator.potential_alternative_reading}</Prose>} />
                    )}
                    {c.proxy_analysis.mandatory_counter_indicator.why_discarded && (
                      <KeyValue label="Perché scartata" value={<Prose>{c.proxy_analysis.mandatory_counter_indicator.why_discarded}</Prose>} />
                    )}
                  </CalloutBox>
                )}

                {c.proxy_analysis.proxy_confidence && (
                  <div className="text-xs space-y-0.5 mt-2">
                    {c.proxy_analysis.proxy_confidence.decisive_proxy && (
                      <p><span className="font-semibold text-slate-600">proxy decisivo:</span> {c.proxy_analysis.proxy_confidence.decisive_proxy}</p>
                    )}
                    {c.proxy_analysis.proxy_confidence.observability && (
                      <p><span className="font-semibold text-slate-600">osservabilità:</span> <Chip>{c.proxy_analysis.proxy_confidence.observability}</Chip></p>
                    )}
                    {c.proxy_analysis.proxy_confidence.observability_rationale && (
                      <p className="text-slate-600 italic mt-1">{c.proxy_analysis.proxy_confidence.observability_rationale}</p>
                    )}
                  </div>
                )}

                {c.proxy_analysis.ambiguity_conditions && c.proxy_analysis.ambiguity_conditions.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-semibold text-slate-600">
                      Condizioni di ambiguità ({c.proxy_analysis.ambiguity_conditions.length})
                    </summary>
                    <div className="mt-2"><BulletList items={c.proxy_analysis.ambiguity_conditions} /></div>
                  </details>
                )}
              </div>
            </>
          )}

          {c.alternative_interpretation && (
            <>
              <SectionTitle>Interpretazione alternativa</SectionTitle>
              <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm">
                {c.alternative_interpretation.could_be_read_as && (
                  <KeyValue label="Potrebbe essere letto come" value={<Chip color={c.alternative_interpretation.could_be_read_as}>{c.alternative_interpretation.could_be_read_as}</Chip>} />
                )}
                {c.alternative_interpretation.rationale && (
                  <KeyValue label="Ragionamento" value={<Prose>{c.alternative_interpretation.rationale}</Prose>} />
                )}
              </div>
            </>
          )}

          {c.device_discrimination && (
            <>
              <SectionTitle>Discriminazione del dispositivo</SectionTitle>
              <div className="space-y-1">
                {c.device_discrimination.device_distinguishes_this_case !== undefined && (
                  <Chip color={c.device_discrimination.device_distinguishes_this_case ? 'presente' : 'assente'}>
                    {c.device_discrimination.device_distinguishes_this_case ? 'distingue il caso' : 'non distingue'}
                  </Chip>
                )}
                {c.device_discrimination.discriminating_dimension && (
                  <KeyValue label="Dimensione discriminante" value={c.device_discrimination.discriminating_dimension} />
                )}
                {c.device_discrimination.discriminating_basis && (
                  <KeyValue label="Base" value={<Prose>{c.device_discrimination.discriminating_basis}</Prose>} />
                )}
                {c.device_discrimination.secondary_support && (
                  <KeyValue label="Supporto secondario" value={<Prose>{c.device_discrimination.secondary_support}</Prose>} />
                )}
              </div>
            </>
          )}

          {c.failure_risk?.conditions_under_which_device_would_fail_on_this_case && c.failure_risk.conditions_under_which_device_would_fail_on_this_case.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer text-xs font-semibold text-rose-700">
                Condizioni di fallimento del dispositivo ({c.failure_risk.conditions_under_which_device_would_fail_on_this_case.length})
              </summary>
              <div className="mt-2"><BulletList items={c.failure_risk.conditions_under_which_device_would_fail_on_this_case} /></div>
            </details>
          )}
        </Card>
      )}
    </div>
  );
}

// ───── step 5: audit ─────

interface CheckBlock {
  result?: string;
  [k: string]: unknown;
}

interface Step5CaseAudit {
  case_id?: string;
  case_label?: string;
  applied_classification?: string;
  applied_classification_status?: string;
  checks?: Record<string, CheckBlock>;
  case_level_assessment?: string;
}

interface Step5Data {
  version?: string;
  audit_type?: string;
  audited_artifact?: { step?: string; version?: string; device_under_test?: string; domain?: string };
  audit_scope_clause?: string;
  case_audits?: Step5CaseAudit[];
  // tollero forme meno strutturate
  global_assessment?: string;
  recommendations?: string[];
}

function CheckEntry({ name, block }: { name: string; block: CheckBlock }) {
  const result = block.result;
  return (
    <details className="rounded border border-slate-200 bg-white">
      <summary className="cursor-pointer px-3 py-2 text-sm flex items-center gap-2">
        <span className="font-medium text-slate-900">{name.replace(/_/g, ' ')}</span>
        {result && <Chip color={result}>{result.replace(/_/g, ' ')}</Chip>}
      </summary>
      <div className="px-3 pb-3 pt-1 text-xs space-y-1.5">
        {Object.entries(block).filter(([k]) => k !== 'result').map(([k, v]) => {
          if (v === null || v === undefined) return null;
          if (typeof v === 'string') {
            return <KeyValue key={k} label={k.replace(/_/g, ' ')} value={<Prose>{v}</Prose>} />;
          }
          if (Array.isArray(v)) {
            const items = v.map((x) => typeof x === 'string' ? x : JSON.stringify(x));
            return <KeyValue key={k} label={k.replace(/_/g, ' ')} value={<BulletList items={items} />} />;
          }
          if (typeof v === 'object') {
            return (
              <details key={k} className="text-xs">
                <summary className="cursor-pointer text-slate-600 font-semibold">{k.replace(/_/g, ' ')}</summary>
                <pre className="mt-1 p-2 bg-slate-50 rounded text-[11px] overflow-auto whitespace-pre-wrap">{JSON.stringify(v, null, 2)}</pre>
              </details>
            );
          }
          return null;
        })}
      </div>
    </details>
  );
}

function Step5Viewer({ data }: { data: Step5Data }) {
  const audits = data.case_audits ?? [];
  const [active, setActive] = useState(0);
  const a = audits[active];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {data.version && <Chip>{data.version}</Chip>}
        {data.audit_type && <Chip color="secondary">{data.audit_type.replace(/_/g, ' ')}</Chip>}
        {data.audited_artifact?.device_under_test && (
          <span className="text-xs text-slate-500 font-mono">DUT: {data.audited_artifact.device_under_test}</span>
        )}
        {data.audited_artifact?.step && (
          <span className="text-xs text-slate-500">step: {data.audited_artifact.step}</span>
        )}
      </div>

      {data.audit_scope_clause && (
        <CalloutBox title="Scope dell'audit" tone="slate">
          <Prose>{data.audit_scope_clause}</Prose>
        </CalloutBox>
      )}

      <ThemeTabs
        themes={audits.map((x, i) => ({ theme_id: x.case_id ?? String(i), label: x.case_id ?? `Audit ${i + 1}` }))}
        activeIdx={active}
        onChange={setActive}
      />

      {!a && <Subtle>Nessun audit di caso.</Subtle>}
      {a && (
        <Card>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{a.case_id}</h3>
            {a.applied_classification && (
              <Chip color={a.applied_classification}>classe: {a.applied_classification}</Chip>
            )}
            {a.applied_classification_status && <Chip>{a.applied_classification_status}</Chip>}
          </div>
          {a.case_label && <p className="text-sm text-slate-600 mb-2">{a.case_label}</p>}

          {a.checks && Object.keys(a.checks).length > 0 && (
            <>
              <SectionTitle>Verifiche ({Object.keys(a.checks).length})</SectionTitle>
              <div className="space-y-1.5">
                {Object.entries(a.checks).map(([name, block]) => (
                  <CheckEntry key={name} name={name} block={block} />
                ))}
              </div>
            </>
          )}

          {a.case_level_assessment && (
            <CalloutBox title="Assessment del caso" tone="emerald">
              <Prose>{a.case_level_assessment}</Prose>
            </CalloutBox>
          )}
        </Card>
      )}

      {data.global_assessment && (
        <CalloutBox title="Assessment globale" tone="emerald">
          <Prose>{data.global_assessment}</Prose>
        </CalloutBox>
      )}

      {data.recommendations && data.recommendations.length > 0 && (
        <div>
          <SectionTitle>Raccomandazioni</SectionTitle>
          <BulletList items={data.recommendations} />
        </div>
      )}
    </div>
  );
}

// ───── helpers condivisi step 6+ ─────

function BoolCheck({ label, value, note }: { label: string; value?: boolean; note?: string }) {
  const ok = value === true;
  const ko = value === false;
  return (
    <div className="text-sm py-0.5">
      <div className="flex items-start gap-2">
        <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${
          ok ? 'bg-emerald-100 text-emerald-700' : ko ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-400'
        }`}>{ok ? '✓' : ko ? '✗' : '·'}</span>
        <span className={ko ? 'text-rose-800' : 'text-slate-700'}>{label}</span>
      </div>
      {note && <p className="text-xs text-slate-500 italic ml-6 mt-0.5">{note}</p>}
    </div>
  );
}

function NonReversibilityTestBlock({ test }: {
  test?: { counter_reading?: string; rebuttal?: string; result?: string; result_notes?: string };
}) {
  if (!test) return null;
  const colorMap: Record<string, string> = {
    resiste: 'forte', resistente: 'forte',
    parzialmente_resistente: 'da_verificare',
    non_resiste: 'distorta', non_resistente: 'distorta',
  };
  return (
    <div>
      <SectionTitle>Test di non-reversibilità</SectionTitle>
      <Card>
        {test.counter_reading && <KeyValue label="Contro-lettura" value={<Prose>{test.counter_reading}</Prose>} />}
        {test.rebuttal && <KeyValue label="Risposta" value={<Prose>{test.rebuttal}</Prose>} />}
        {test.result && (
          <div className="mt-2">
            <Chip color={colorMap[test.result] ?? 'slate'}>esito: {test.result.replace(/_/g, ' ')}</Chip>
          </div>
        )}
        {test.result_notes && (
          <div className="mt-2"><Subtle>{test.result_notes}</Subtle></div>
        )}
      </Card>
    </div>
  );
}

// ───── step 6: stabilizzazione-proxy (proxy_stabilization) ─────

interface AnchorCheckItem {
  element?: string;
  source?: string;
  evidence?: string;
  observer_dependency?: string;
  notes?: string;
}

interface Step6Data {
  step?: string;
  theme_id?: string;
  domain?: string;
  source_output_id?: string;
  target_proxy?: string;
  original_proxy_issues?: { reversibility?: string; circularity?: string; non_observability?: string };
  structural_decomposition?: { notes?: string; sequence?: string[]; observation?: string };
  new_proxy?: {
    name?: string; structure?: string; rationale?: string;
    observable_sequence?: string[]; discriminating_element?: string;
    anchor_requirement?: string;
  };
  non_reversibility_test?: { counter_reading?: string; rebuttal?: string; result?: string; result_notes?: string };
  anchor_check?: AnchorCheckItem[];
  case_description_gap?: {
    missing_in_current_descriptions?: string;
    required_formulation_open?: string;
    required_formulation_predetermined?: string;
  };
  final_assessment?: {
    is_more_robust?: boolean; robustness_improvement?: string; remaining_weakness?: string;
    failure_declared?: boolean; failure_reason?: string;
  };
}

const ANCHOR_SOURCE_COLORS: Record<string, string> = {
  case_description:        'forte',
  osservabile:             'plausibile',
  observed_configuration:  'distorta',
  inferenza_esterna:       'distorta',
};

const OBSERVER_DEPENDENCY_COLORS: Record<string, string> = {
  bassa: 'forte',
  media: 'da_verificare',
  alta:  'distorta',
};

function Step6Viewer({ data }: { data: Step6Data }) {
  const issues = data.original_proxy_issues;
  const dec = data.structural_decomposition;
  const np = data.new_proxy;
  const ac = data.anchor_check ?? [];
  const gap = data.case_description_gap;
  const fa = data.final_assessment;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {data.theme_id && <Chip>{data.theme_id}</Chip>}
        {data.domain && <Chip color="secondary">{data.domain}</Chip>}
        {data.source_output_id && (
          <span className="text-xs text-slate-500 font-mono">basato su: {data.source_output_id}</span>
        )}
      </div>

      {data.target_proxy && (
        <CalloutBox title="Proxy originale (target di stabilizzazione)" tone="amber">
          <Prose>{data.target_proxy}</Prose>
        </CalloutBox>
      )}

      {issues && (
        <div>
          <SectionTitle>Problemi del proxy originale</SectionTitle>
          <Card>
            {issues.reversibility && <KeyValue label="Reversibilità" value={<Prose>{issues.reversibility}</Prose>} />}
            {issues.circularity && <KeyValue label="Circolarità" value={<Prose>{issues.circularity}</Prose>} />}
            {issues.non_observability && <KeyValue label="Non osservabilità" value={<Prose>{issues.non_observability}</Prose>} />}
          </Card>
        </div>
      )}

      {dec && (dec.notes || dec.sequence?.length || dec.observation) && (
        <div>
          <SectionTitle>Scomposizione strutturale</SectionTitle>
          <Card>
            {dec.notes && <Prose>{dec.notes}</Prose>}
            {dec.sequence && dec.sequence.length > 0 && (
              <div className="mt-2"><KeyValue label="Sequenza" value={<BulletList items={dec.sequence} />} /></div>
            )}
            {dec.observation && <KeyValue label="Osservazione" value={<Prose>{dec.observation}</Prose>} />}
          </Card>
        </div>
      )}

      {np && (
        <div>
          <SectionTitle>Nuovo proxy</SectionTitle>
          <Card>
            {np.name && <h4 className="font-semibold text-slate-900">{np.name}</h4>}
            {np.structure && <KeyValue label="Struttura" value={<Prose>{np.structure}</Prose>} />}
            {np.rationale && <KeyValue label="Razionale" value={<Prose>{np.rationale}</Prose>} />}
            {np.observable_sequence && np.observable_sequence.length > 0 && (
              <KeyValue label="Sequenza osservabile" value={<BulletList items={np.observable_sequence} />} />
            )}
            {np.discriminating_element && (
              <KeyValue label="Elemento discriminante" value={<Prose>{np.discriminating_element}</Prose>} />
            )}
            {np.anchor_requirement && (
              <KeyValue label="Requisito di ancoraggio" value={<Prose>{np.anchor_requirement}</Prose>} />
            )}
          </Card>
        </div>
      )}

      <NonReversibilityTestBlock test={data.non_reversibility_test} />

      {ac.length > 0 && (
        <div>
          <SectionTitle>Verifica di ancoraggio ({ac.length})</SectionTitle>
          <div className="space-y-2">
            {ac.map((a, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium text-slate-900 text-sm">{a.element ?? '—'}</span>
                  {a.source && <Chip color={ANCHOR_SOURCE_COLORS[a.source] ?? 'slate'}>{a.source.replace(/_/g, ' ')}</Chip>}
                  {a.observer_dependency && (
                    <Chip color={OBSERVER_DEPENDENCY_COLORS[a.observer_dependency] ?? 'slate'}>
                      dip. osservatore: {a.observer_dependency}
                    </Chip>
                  )}
                </div>
                {a.evidence && <KeyValue label="Evidenza" value={<Prose>{a.evidence}</Prose>} />}
                {a.notes && <Subtle>{a.notes}</Subtle>}
              </Card>
            ))}
          </div>
        </div>
      )}

      {gap && (gap.missing_in_current_descriptions || gap.required_formulation_open || gap.required_formulation_predetermined) && (
        <div>
          <SectionTitle>Gap nella case description</SectionTitle>
          <Card>
            {gap.missing_in_current_descriptions && (
              <KeyValue label="Informazione mancante" value={<Prose>{gap.missing_in_current_descriptions}</Prose>} />
            )}
            {gap.required_formulation_open && (
              <KeyValue label="Formulazione richiesta (aperta)" value={<Prose>{gap.required_formulation_open}</Prose>} />
            )}
            {gap.required_formulation_predetermined && (
              <KeyValue label="Formulazione richiesta (predeterminata)" value={<Prose>{gap.required_formulation_predetermined}</Prose>} />
            )}
          </Card>
        </div>
      )}

      {fa && (
        <CalloutBox
          title="Valutazione finale"
          tone={fa.failure_declared ? 'rose' : fa.is_more_robust ? 'emerald' : 'amber'}
        >
          <BoolCheck label="Il nuovo proxy è strutturalmente più robusto" value={fa.is_more_robust} />
          {fa.robustness_improvement && (
            <div className="mt-1"><KeyValue label="Miglioramento" value={<Prose>{fa.robustness_improvement}</Prose>} /></div>
          )}
          {fa.remaining_weakness && (
            <div className="mt-1"><KeyValue label="Debolezza residua" value={<Prose>{fa.remaining_weakness}</Prose>} /></div>
          )}
          {fa.failure_declared && (
            <div className="mt-2 pt-2 border-t border-rose-200">
              <Chip color="distorta">FALLIMENTO DICHIARATO</Chip>
              {fa.failure_reason && <p className="text-sm text-rose-900 mt-1">{fa.failure_reason}</p>}
            </div>
          )}
        </CalloutBox>
      )}
    </div>
  );
}

// ───── step 6b: stabilizzazione-proxy/b (proxy operativo) ─────

interface RequiredObservation {
  id?: string;
  label?: string;
  description?: string;
  type?: string;
  type_notes?: string;
  observer_dependency?: string;
  observer_dependency_notes?: string;
}

interface OperativeProxyDetail {
  proxy_id?: string;
  dimension?: string;
  proxy_name?: string;
  what_it_measures?: string;
  required_observations?: string[];
  applicability_conditions?: string[];
  non_applicability_conditions?: string[];
  allowed_outputs?: string[];
  decision_logic?: string;
  epistemic_limit?: string;
}

interface Step6bData {
  step?: string;
  theme_id?: string;
  domain?: string;
  source_output_id?: string;
  required_observations?: RequiredObservation[];
  variable_classification_summary?: {
    directly_observable?: string[];
    observable_with_mediation?: string[];
    not_observable?: string[];
    note?: string;
  };
  applicability_conditions?: string[];
  non_applicability_conditions?: string[];
  insufficient_data_output?: { result?: string; rationale?: string; what_not_to_do?: string };
  operative_proxy?: OperativeProxyDetail;
}

const OBSERVABILITY_TYPE_COLORS: Record<string, string> = {
  direttamente_osservabile:    'forte',
  diretto:                     'forte',
  osservabile_con_mediazione:  'plausibile',
  con_mediazione:              'plausibile',
  non_osservabile:             'distorta',
};

function OperativeProxyBlock({ p }: { p?: OperativeProxyDetail }) {
  if (!p) return null;
  return (
    <Card>
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <h4 className="font-semibold text-slate-900">{p.proxy_name ?? 'Proxy'}</h4>
        {p.proxy_id && <span className="text-xs font-mono text-slate-400">{p.proxy_id}</span>}
        {p.dimension && <Chip color="derived">{p.dimension}</Chip>}
      </div>
      {p.what_it_measures && <KeyValue label="Cosa misura" value={<Prose>{p.what_it_measures}</Prose>} />}
      {p.required_observations && p.required_observations.length > 0 && (
        <KeyValue label="Osservazioni richieste" value={<BulletList items={p.required_observations} />} />
      )}
      {p.applicability_conditions && p.applicability_conditions.length > 0 && (
        <KeyValue label="Condizioni di applicabilità" value={<BulletList items={p.applicability_conditions} />} />
      )}
      {p.non_applicability_conditions && p.non_applicability_conditions.length > 0 && (
        <KeyValue label="Condizioni di non-applicabilità" value={<BulletList items={p.non_applicability_conditions} />} />
      )}
      {p.allowed_outputs && p.allowed_outputs.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Output ammessi</p>
          <div className="flex flex-wrap gap-1">
            {p.allowed_outputs.map((o, i) => (
              <Chip key={i} color={o === 'aperto' ? 'aperto' : o === 'predeterminato' ? 'predeterminato' : o === 'ambiguo' ? 'ambiguo' : 'assente'}>
                {o.replace(/_/g, ' ')}
              </Chip>
            ))}
          </div>
        </div>
      )}
      {p.decision_logic && <KeyValue label="Logica decisionale" value={<Prose>{p.decision_logic}</Prose>} />}
      {p.epistemic_limit && <KeyValue label="Limite epistemico" value={<Prose>{p.epistemic_limit}</Prose>} />}
    </Card>
  );
}

function Step6bViewer({ data }: { data: Step6bData }) {
  const obs = data.required_observations ?? [];
  const vcs = data.variable_classification_summary;
  const ido = data.insufficient_data_output;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {data.theme_id && <Chip>{data.theme_id}</Chip>}
        {data.domain && <Chip color="secondary">{data.domain}</Chip>}
        {data.source_output_id && (
          <span className="text-xs text-slate-500 font-mono">basato su: {data.source_output_id}</span>
        )}
      </div>

      {obs.length > 0 && (
        <div>
          <SectionTitle>Osservazioni richieste ({obs.length})</SectionTitle>
          <div className="space-y-2">
            {obs.map((o, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {o.id && <span className="text-xs font-mono text-slate-400">{o.id}</span>}
                  <span className="font-medium text-slate-900 text-sm">{o.label ?? '—'}</span>
                  {o.type && <Chip color={OBSERVABILITY_TYPE_COLORS[o.type] ?? 'slate'}>{o.type.replace(/_/g, ' ')}</Chip>}
                  {o.observer_dependency && (
                    <Chip color={OBSERVER_DEPENDENCY_COLORS[o.observer_dependency] ?? 'slate'}>
                      dip. osserv: {o.observer_dependency}
                    </Chip>
                  )}
                </div>
                {o.description && <Prose>{o.description}</Prose>}
                {o.type_notes && <Subtle>tipo: {o.type_notes}</Subtle>}
                {o.observer_dependency_notes && <Subtle>dipendenza: {o.observer_dependency_notes}</Subtle>}
              </Card>
            ))}
          </div>
        </div>
      )}

      {vcs && (
        <div>
          <SectionTitle>Riepilogo variabili</SectionTitle>
          <Card>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div>
                <p className="font-semibold text-emerald-800 mb-1">Direttamente osservabili ({vcs.directly_observable?.length ?? 0})</p>
                {vcs.directly_observable && vcs.directly_observable.length > 0 ? (
                  <div className="flex flex-wrap gap-1">{vcs.directly_observable.map((v, i) => <Chip key={i} color="forte">{v}</Chip>)}</div>
                ) : <Subtle>nessuna</Subtle>}
              </div>
              <div>
                <p className="font-semibold text-sky-800 mb-1">Con mediazione ({vcs.observable_with_mediation?.length ?? 0})</p>
                {vcs.observable_with_mediation && vcs.observable_with_mediation.length > 0 ? (
                  <div className="flex flex-wrap gap-1">{vcs.observable_with_mediation.map((v, i) => <Chip key={i} color="plausibile">{v}</Chip>)}</div>
                ) : <Subtle>nessuna</Subtle>}
              </div>
              <div>
                <p className="font-semibold text-rose-800 mb-1">Non osservabili ({vcs.not_observable?.length ?? 0})</p>
                {vcs.not_observable && vcs.not_observable.length > 0 ? (
                  <div className="flex flex-wrap gap-1">{vcs.not_observable.map((v, i) => <Chip key={i} color="distorta">{v}</Chip>)}</div>
                ) : <Subtle>nessuna</Subtle>}
              </div>
            </div>
            {vcs.note && <div className="mt-2"><Subtle>{vcs.note}</Subtle></div>}
          </Card>
        </div>
      )}

      {data.applicability_conditions && data.applicability_conditions.length > 0 && (
        <div>
          <SectionTitle>Condizioni di applicabilità ({data.applicability_conditions.length})</SectionTitle>
          <Card><BulletList items={data.applicability_conditions} /></Card>
        </div>
      )}

      {data.non_applicability_conditions && data.non_applicability_conditions.length > 0 && (
        <div>
          <SectionTitle>Condizioni di non-applicabilità ({data.non_applicability_conditions.length})</SectionTitle>
          <Card><BulletList items={data.non_applicability_conditions} /></Card>
        </div>
      )}

      {ido && (
        <div>
          <SectionTitle>Esito su dati insufficienti</SectionTitle>
          <Card>
            {ido.result && <Chip color={ido.result === 'non_classificabile' ? 'assente' : 'ambiguo'}>{ido.result.replace(/_/g, ' ')}</Chip>}
            {ido.rationale && <div className="mt-2"><KeyValue label="Razionale" value={<Prose>{ido.rationale}</Prose>} /></div>}
            {ido.what_not_to_do && <KeyValue label="Cosa NON fare" value={<Prose>{ido.what_not_to_do}</Prose>} />}
          </Card>
        </div>
      )}

      {data.operative_proxy && (
        <div>
          <SectionTitle>Proxy operativo finale</SectionTitle>
          <OperativeProxyBlock p={data.operative_proxy} />
        </div>
      )}
    </div>
  );
}

// ───── step 6b (schema alternativo verboso "step_N_*") ─────

interface Step6bAltVariable {
  id?: string;
  nome?: string;
  descrizione?: string;
  necessaria_per?: string;
}

interface Step6bAltClassification {
  id?: string;
  ['tipo_osservabilità']?: string;
  dipendenza_osservatore?: string;
  note?: string;
}

interface Step6bAltCondition {
  id?: string;
  condizione?: string;
  variabili_coinvolte?: string[];
  criterio_di_verifica?: string;
  esempio?: string;
  esito_richiesto?: string;
  nota_aggiuntiva?: string;
}

interface Step6bAltCriterion {
  soddisfatto?: boolean;
  rationale?: string;
}

interface Step6bAltData {
  step?: string;
  version?: string;
  operation_type?: string;
  domain?: string;
  based_on?: Record<string, string>;
  framing?: Record<string, string>;
  step_1_variabili_osservative_necessarie?: { rationale?: string; variabili?: Step6bAltVariable[] };
  step_2_classificazione_variabili?: { rationale?: string; classificazione?: Step6bAltClassification[] };
  ['step_3_condizioni_di_applicabilità']?: { header?: string; condizioni?: Step6bAltCondition[]; regola_globale?: string };
  ['step_4_condizioni_di_non_applicabilità']?: { header?: string; condizioni?: Step6bAltCondition[]; regola_globale?: string };
  step_5_esito_in_caso_di_dati_insufficienti?: {
    esito_richiesto?: string;
    natura_dell_esito?: string;
    differenza_rispetto_a_ambiguo?: string;
    ['perché_il_dispositivo_NON_deve_classificare']?: string[];
    obblighi_associati_all_esito_non_classificabile?: string[];
    tabella_esiti_possibili?: Record<string, string>;
  };
  step_6_proxy_operativo?: OperativeProxyDetail;
  step_7_verifica_criteri_di_successo?: Record<string, Step6bAltCriterion>;
  final_note?: Record<string, string>;
}

function humanizeKey(k: string): string {
  return k.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

function Step6bAltViewer({ data }: { data: Step6bAltData }) {
  const variabili = data.step_1_variabili_osservative_necessarie?.variabili ?? [];
  const classMap = new Map<string, Step6bAltClassification>(
    (data.step_2_classificazione_variabili?.classificazione ?? [])
      .filter((c) => c.id)
      .map((c) => [c.id as string, c]),
  );
  const appCond = data['step_3_condizioni_di_applicabilità'];
  const nonAppCond = data['step_4_condizioni_di_non_applicabilità'];
  const ido = data.step_5_esito_in_caso_di_dati_insufficienti;
  const proxy = data.step_6_proxy_operativo;
  const criteri = data.step_7_verifica_criteri_di_successo;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {data.version && <Chip>{data.version}</Chip>}
        {data.domain && <Chip color="secondary">{data.domain}</Chip>}
        {data.operation_type && (
          <span className="text-xs text-slate-500 font-mono">{data.operation_type}</span>
        )}
      </div>

      {data.based_on && Object.keys(data.based_on).length > 0 && (
        <div>
          <SectionTitle>Basato su</SectionTitle>
          <Card>
            {Object.entries(data.based_on).map(([k, v]) => (
              <KeyValue key={k} label={humanizeKey(k)} value={<Prose>{v}</Prose>} />
            ))}
          </Card>
        </div>
      )}

      {data.framing && Object.keys(data.framing).length > 0 && (
        <div>
          <SectionTitle>Framing</SectionTitle>
          <Card>
            {Object.entries(data.framing).map(([k, v]) => (
              <KeyValue key={k} label={humanizeKey(k)} value={<Prose>{v}</Prose>} />
            ))}
          </Card>
        </div>
      )}

      {variabili.length > 0 && (
        <div>
          <SectionTitle>Variabili osservative necessarie ({variabili.length})</SectionTitle>
          {data.step_1_variabili_osservative_necessarie?.rationale && (
            <div className="mb-2"><Subtle>{data.step_1_variabili_osservative_necessarie.rationale}</Subtle></div>
          )}
          <div className="space-y-2">
            {variabili.map((v, i) => {
              const c = v.id ? classMap.get(v.id) : undefined;
              const tipo = c?.['tipo_osservabilità'];
              const dep = c?.dipendenza_osservatore;
              const tipoColor = tipo
                ? (tipo.includes('non') ? 'distorta'
                  : tipo.includes('mediazione') ? 'plausibile'
                  : tipo.includes('direttamente') ? 'forte'
                  : 'slate')
                : 'slate';
              return (
                <Card key={i}>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {v.id && <span className="text-xs font-mono text-slate-400">{v.id}</span>}
                    <span className="font-medium text-slate-900 text-sm">{v.nome ?? '—'}</span>
                    {tipo && <Chip color={tipoColor}>{tipo}</Chip>}
                    {dep && (
                      <Chip color={OBSERVER_DEPENDENCY_COLORS[dep] ?? 'slate'}>
                        dip. osserv: {dep}
                      </Chip>
                    )}
                  </div>
                  {v.descrizione && <Prose>{v.descrizione}</Prose>}
                  {v.necessaria_per && <Subtle>necessaria per: {v.necessaria_per}</Subtle>}
                  {c?.note && <Subtle>nota: {c.note}</Subtle>}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {appCond?.condizioni && appCond.condizioni.length > 0 && (
        <div>
          <SectionTitle>Condizioni di applicabilità ({appCond.condizioni.length})</SectionTitle>
          {appCond.header && <div className="mb-2"><Subtle>{appCond.header}</Subtle></div>}
          <div className="space-y-2">
            {appCond.condizioni.map((c, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {c.id && <span className="text-xs font-mono text-slate-400">{c.id}</span>}
                </div>
                {c.condizione && <Prose>{c.condizione}</Prose>}
                {c.variabili_coinvolte && c.variabili_coinvolte.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.variabili_coinvolte.map((vid, j) => <Chip key={j}>{vid}</Chip>)}
                  </div>
                )}
                {c.criterio_di_verifica && <Subtle>criterio: {c.criterio_di_verifica}</Subtle>}
              </Card>
            ))}
          </div>
          {appCond.regola_globale && <div className="mt-2"><Subtle>{appCond.regola_globale}</Subtle></div>}
        </div>
      )}

      {nonAppCond?.condizioni && nonAppCond.condizioni.length > 0 && (
        <div>
          <SectionTitle>Condizioni di non-applicabilità ({nonAppCond.condizioni.length})</SectionTitle>
          {nonAppCond.header && <div className="mb-2"><Subtle>{nonAppCond.header}</Subtle></div>}
          <div className="space-y-2">
            {nonAppCond.condizioni.map((c, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {c.id && <span className="text-xs font-mono text-slate-400">{c.id}</span>}
                  {c.esito_richiesto && (
                    <Chip color={c.esito_richiesto === 'non_classificabile' ? 'assente' : 'ambiguo'}>
                      {c.esito_richiesto.replace(/_/g, ' ')}
                    </Chip>
                  )}
                </div>
                {c.condizione && <Prose>{c.condizione}</Prose>}
                {c.esempio && <Subtle>esempio: {c.esempio}</Subtle>}
                {c.nota_aggiuntiva && <Subtle>nota: {c.nota_aggiuntiva}</Subtle>}
              </Card>
            ))}
          </div>
          {nonAppCond.regola_globale && <div className="mt-2"><Subtle>{nonAppCond.regola_globale}</Subtle></div>}
        </div>
      )}

      {ido && (
        <div>
          <SectionTitle>Esito su dati insufficienti</SectionTitle>
          <Card>
            {ido.esito_richiesto && (
              <Chip color={ido.esito_richiesto === 'non_classificabile' ? 'assente' : 'ambiguo'}>
                {ido.esito_richiesto.replace(/_/g, ' ')}
              </Chip>
            )}
            {ido.natura_dell_esito && <div className="mt-2"><KeyValue label="Natura dell'esito" value={<Prose>{ido.natura_dell_esito}</Prose>} /></div>}
            {ido.differenza_rispetto_a_ambiguo && (
              <KeyValue label="Differenza rispetto ad ambiguo" value={<Prose>{ido.differenza_rispetto_a_ambiguo}</Prose>} />
            )}
            {ido['perché_il_dispositivo_NON_deve_classificare'] && ido['perché_il_dispositivo_NON_deve_classificare'].length > 0 && (
              <KeyValue label="Perché non classificare" value={<BulletList items={ido['perché_il_dispositivo_NON_deve_classificare']} />} />
            )}
            {ido.obblighi_associati_all_esito_non_classificabile && ido.obblighi_associati_all_esito_non_classificabile.length > 0 && (
              <KeyValue label="Obblighi associati" value={<BulletList items={ido.obblighi_associati_all_esito_non_classificabile} />} />
            )}
            {ido.tabella_esiti_possibili && Object.keys(ido.tabella_esiti_possibili).length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Tabella esiti possibili</p>
                <div className="space-y-1">
                  {Object.entries(ido.tabella_esiti_possibili).map(([k, v]) => (
                    <KeyValue key={k} label={k.replace(/_/g, ' ')} value={<Prose>{v}</Prose>} />
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {proxy && (
        <div>
          <SectionTitle>Proxy operativo finale</SectionTitle>
          <OperativeProxyBlock p={proxy} />
        </div>
      )}

      {criteri && Object.keys(criteri).length > 0 && (
        <div>
          <SectionTitle>Verifica criteri di successo</SectionTitle>
          <div className="space-y-2">
            {Object.entries(criteri).map(([k, c]) => (
              <Card key={k}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium text-slate-900 text-sm">{humanizeKey(k)}</span>
                  {typeof c.soddisfatto === 'boolean' && (
                    <Chip color={c.soddisfatto ? 'forte' : 'distorta'}>
                      {c.soddisfatto ? 'soddisfatto' : 'non soddisfatto'}
                    </Chip>
                  )}
                </div>
                {c.rationale && <Prose>{c.rationale}</Prose>}
              </Card>
            ))}
          </div>
        </div>
      )}

      {data.final_note && Object.keys(data.final_note).length > 0 && (
        <div>
          <SectionTitle>Nota finale</SectionTitle>
          <Card>
            {Object.entries(data.final_note).map(([k, v]) => (
              <KeyValue key={k} label={humanizeKey(k)} value={<Prose>{v}</Prose>} />
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

function pickStep6bViewer(d: Record<string, unknown>) {
  const hasAltShape = d.step_6_proxy_operativo !== undefined
    || d.step_1_variabili_osservative_necessarie !== undefined
    || d['step_3_condizioni_di_applicabilità'] !== undefined;
  if (hasAltShape) return <Step6bAltViewer data={d as Step6bAltData} />;
  return <Step6bViewer data={d as Step6bData} />;
}

// ───── step 7: trasferibilità ─────

const TRANSFER_VERDICT_COLORS: Record<string, string> = {
  trasferibile:                'forte',
  trasferibile_con_adattamenti:'plausibile',
  trasferibilita_debole:       'da_verificare',
  non_trasferibile:            'distorta',
};

const TRANSFER_STATUS_COLORS: Record<string, string> = {
  integrale:        'forte',
  con_adattamento:  'plausibile',
  non_trasferibile: 'distorta',
  riutilizzabile:   'forte',
  adattabile:       'plausibile',
  da_scartare:      'distorta',
};

const RECOMMENDATION_COLORS: Record<string, string> = {
  procedere_a_nuovo_dispositivo: 'forte',
  raffinare_prima:               'da_verificare',
  non_procedere:                 'distorta',
};

interface TransferableElement {
  element?: string;
  transfer_status?: string;
  reason?: string;
}

interface ThemeSpecificElement {
  element?: string;
  why_specific?: string;
  risk_if_transferred?: string;
}

interface ProxyAssessmentItem {
  proxy_name?: string;
  status?: string;
  reason?: string;
  required_new_observations?: string[];
}

interface ReductionRiskItem {
  risk_type?: string;
  description?: string;
  mitigation?: string;
}

interface Step7TargetObject {
  target_theme?: string;
  target_domain?: string;
  input_status?: string;
  rationale_della_scelta?: string;
}

interface Step7Data {
  step?: string;
  source_device_id?: string;
  target_theme_or_domain?: string | Step7TargetObject;
  input_context_file?: string;
  transferability_assessment?: { overall_verdict?: string; reason?: string };
  transferable_elements?: TransferableElement[];
  theme_specific_elements?: ThemeSpecificElement[];
  proxy_assessment?: ProxyAssessmentItem[];
  observability_check?: {
    minimum_observations_available?: boolean;
    missing_observations?: string[];
    non_classifiability_risks?: string[];
  };
  reduction_risks?: ReductionRiskItem[];
  domain_specific_adaptations_required?: {
    new_non_classifiability_rule?: string;
    new_interpretive_warning?: string;
    new_access_point?: string;
    new_non_permitted_transformation?: string;
  };
  next_step_recommendation?: {
    recommendation?: string; reason?: string;
    skip_step_8?: boolean; skip_step_8_reason?: string;
  };
}

function Step7Viewer({ data }: { data: Step7Data }) {
  const ta = data.transferability_assessment;
  const elems = data.transferable_elements ?? [];
  const specifici = data.theme_specific_elements ?? [];
  const proxy = data.proxy_assessment ?? [];
  const oc = data.observability_check;
  const risks = data.reduction_risks ?? [];
  const dsa = data.domain_specific_adaptations_required;
  const ns = data.next_step_recommendation;

  const target = data.target_theme_or_domain;
  const targetIsObject = target !== null && typeof target === 'object';
  const targetObj = targetIsObject ? (target as Step7TargetObject) : null;
  const targetSummary = targetIsObject
    ? [targetObj?.target_theme, targetObj?.target_domain].filter(Boolean).join(' · ')
    : (target as string | undefined);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {data.source_device_id && <span className="text-xs text-slate-500 font-mono">device: {data.source_device_id}</span>}
        {targetSummary && <Chip color="secondary">→ {targetSummary}</Chip>}
      </div>

      {targetObj && (targetObj.input_status || targetObj.rationale_della_scelta) && (
        <Card>
          {targetObj.input_status && <KeyValue label="Stato input" value={targetObj.input_status} />}
          {targetObj.rationale_della_scelta && (
            <KeyValue label="Razionale della scelta" value={<Prose>{targetObj.rationale_della_scelta}</Prose>} />
          )}
        </Card>
      )}

      {ta && (
        <CalloutBox
          title="Verdetto di trasferibilità"
          tone={ta.overall_verdict === 'non_trasferibile' ? 'rose' : ta.overall_verdict === 'trasferibile' ? 'emerald' : 'sky'}
        >
          {ta.overall_verdict && (
            <Chip color={TRANSFER_VERDICT_COLORS[ta.overall_verdict] ?? 'slate'}>
              {ta.overall_verdict.replace(/_/g, ' ')}
            </Chip>
          )}
          {ta.reason && <div className="mt-2"><Prose>{ta.reason}</Prose></div>}
        </CalloutBox>
      )}

      {elems.length > 0 && (
        <div>
          <SectionTitle>Elementi trasferibili ({elems.length})</SectionTitle>
          <div className="space-y-1.5">
            {elems.map((e, i) => (
              <div key={i} className="border-l-2 border-slate-300 pl-3 py-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-slate-900 text-sm">{e.element ?? '—'}</span>
                  {e.transfer_status && (
                    <Chip color={TRANSFER_STATUS_COLORS[e.transfer_status] ?? 'slate'}>
                      {e.transfer_status.replace(/_/g, ' ')}
                    </Chip>
                  )}
                </div>
                {e.reason && <Prose>{e.reason}</Prose>}
              </div>
            ))}
          </div>
        </div>
      )}

      {specifici.length > 0 && (
        <div>
          <SectionTitle>Elementi specifici del tema originario ({specifici.length})</SectionTitle>
          <div className="space-y-1.5">
            {specifici.map((s, i) => (
              <Card key={i}>
                <p className="font-medium text-slate-900 text-sm">{s.element ?? '—'}</p>
                {s.why_specific && <KeyValue label="Perché specifico" value={<Prose>{s.why_specific}</Prose>} />}
                {s.risk_if_transferred && <KeyValue label="Rischio se trasferito" value={<Prose>{s.risk_if_transferred}</Prose>} />}
              </Card>
            ))}
          </div>
        </div>
      )}

      {proxy.length > 0 && (
        <div>
          <SectionTitle>Valutazione proxy ({proxy.length})</SectionTitle>
          <div className="space-y-1.5">
            {proxy.map((p, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium text-slate-900 text-sm">{p.proxy_name ?? '—'}</span>
                  {p.status && (
                    <Chip color={TRANSFER_STATUS_COLORS[p.status] ?? 'slate'}>{p.status.replace(/_/g, ' ')}</Chip>
                  )}
                </div>
                {p.reason && <Prose>{p.reason}</Prose>}
                {p.required_new_observations && p.required_new_observations.length > 0 && (
                  <KeyValue label="Nuove osservazioni richieste" value={<BulletList items={p.required_new_observations} />} />
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {oc && (
        <div>
          <SectionTitle>Verifica osservabilità</SectionTitle>
          <Card>
            <BoolCheck
              label="Osservazioni minime disponibili nel nuovo contesto"
              value={oc.minimum_observations_available}
            />
            {oc.missing_observations && oc.missing_observations.length > 0 && (
              <div className="mt-2"><KeyValue label="Osservazioni mancanti" value={<BulletList items={oc.missing_observations} />} /></div>
            )}
            {oc.non_classifiability_risks && oc.non_classifiability_risks.length > 0 && (
              <KeyValue label="Rischi di non-classificabilità" value={<BulletList items={oc.non_classifiability_risks} />} />
            )}
          </Card>
        </div>
      )}

      {risks.length > 0 && (
        <div>
          <SectionTitle>Rischi di riduzione ({risks.length})</SectionTitle>
          <div className="space-y-1.5">
            {risks.map((r, i) => (
              <CalloutBox key={i} title={(r.risk_type ?? 'rischio').replace(/_/g, ' ')} tone="rose">
                {r.description && <Prose>{r.description}</Prose>}
                {r.mitigation && <div className="mt-2"><KeyValue label="Mitigazione" value={<Prose>{r.mitigation}</Prose>} /></div>}
              </CalloutBox>
            ))}
          </div>
        </div>
      )}

      {dsa && (dsa.new_non_classifiability_rule || dsa.new_interpretive_warning || dsa.new_access_point || dsa.new_non_permitted_transformation) && (
        <div>
          <SectionTitle>Adattamenti specifici al dominio (anticipati)</SectionTitle>
          <Card>
            {dsa.new_non_classifiability_rule && <KeyValue label="Nuova regola di non-classificabilità" value={<Prose>{dsa.new_non_classifiability_rule}</Prose>} />}
            {dsa.new_interpretive_warning && <KeyValue label="Nuovo warning interpretativo" value={<Prose>{dsa.new_interpretive_warning}</Prose>} />}
            {dsa.new_access_point && <KeyValue label="Nuovo access point" value={<Prose>{dsa.new_access_point}</Prose>} />}
            {dsa.new_non_permitted_transformation && <KeyValue label="Nuova trasformazione non permessa" value={<Prose>{dsa.new_non_permitted_transformation}</Prose>} />}
          </Card>
        </div>
      )}

      {ns && (
        <CalloutBox
          title="Raccomandazione operativa"
          tone={ns.recommendation === 'non_procedere' ? 'rose' : ns.recommendation === 'procedere_a_nuovo_dispositivo' ? 'emerald' : 'amber'}
        >
          {ns.recommendation && (
            <Chip color={RECOMMENDATION_COLORS[ns.recommendation] ?? 'slate'}>{ns.recommendation.replace(/_/g, ' ')}</Chip>
          )}
          {ns.reason && <div className="mt-2"><Prose>{ns.reason}</Prose></div>}
          {ns.skip_step_8 && (
            <div className="mt-2 pt-2 border-t border-current border-opacity-20">
              <Chip color="derived">skip step 8</Chip>
              {ns.skip_step_8_reason && <p className="text-sm mt-1">{ns.skip_step_8_reason}</p>}
            </div>
          )}
        </CalloutBox>
      )}
    </div>
  );
}

// ───── step 8: adattamento-strutturale ─────

interface ObservabilityRequirement {
  id?: string;
  label?: string;
  description?: string;
  type?: string;
  type_notes?: string;
  observer_dependency?: string;
  required_for_proxy?: boolean;
  protocol_note?: string;
}

interface NonClassifiabilityRule {
  id?: string;
  dimension?: string;
  trigger?: string;
  required_output?: string;
  rationale?: string;
}

interface Step8Data {
  step?: string;
  version?: string;
  source_device_id?: string;
  target_theme?: string;
  revision_note?: string;
  new_corporeity?: {
    description?: string; structural_features?: string[];
    differences_from_source_theme?: string; observer_dependency?: string;
  };
  new_bridge?: {
    from?: string; to?: string; process_description?: string;
    open_form?: string; predetermined_form?: string;
  };
  new_proxy?: {
    name?: string; what_it_measures?: string;
    observable_sequence?: string[]; discriminating_element?: string;
  };
  non_reversibility_test?: { counter_reading?: string; rebuttal?: string; result?: string; result_notes?: string };
  observability_requirements?: ObservabilityRequirement[];
  non_classifiability_rules?: NonClassifiabilityRule[];
  structural_consistency_check?: {
    configurational_logic_preserved?: boolean; configurational_logic_notes?: string;
    no_psychological_inference?: boolean; no_psychological_inference_notes?: string;
    no_circularity?: boolean; no_circularity_notes?: string;
    proxy_observable?: boolean; proxy_observable_notes?: string;
    proxy_not_reused_from_source?: boolean; proxy_not_reused_notes?: string;
    improvement_over_v1?: string;
  };
}

function ObservabilityRequirementsBlock({ items }: { items?: ObservabilityRequirement[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-2">
      {items.map((o, i) => (
        <Card key={i}>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {o.id && <span className="text-xs font-mono text-slate-400">{o.id}</span>}
            <span className="font-medium text-slate-900 text-sm">{o.label ?? o.description?.slice(0, 60) ?? '—'}</span>
            {o.type && <Chip color={OBSERVABILITY_TYPE_COLORS[o.type] ?? 'slate'}>{o.type.replace(/_/g, ' ')}</Chip>}
            {o.observer_dependency && (
              <Chip color={OBSERVER_DEPENDENCY_COLORS[o.observer_dependency] ?? 'slate'}>
                dip. osserv: {o.observer_dependency}
              </Chip>
            )}
            {o.required_for_proxy && <Chip color="forte">richiesto</Chip>}
          </div>
          {o.label && o.description && <Prose>{o.description}</Prose>}
          {o.type_notes && <Subtle>{o.type_notes}</Subtle>}
          {o.protocol_note && <KeyValue label="Nota protocollo" value={<Prose>{o.protocol_note}</Prose>} />}
        </Card>
      ))}
    </div>
  );
}

function NonClassifiabilityRulesBlock({ items }: { items?: NonClassifiabilityRule[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-1.5">
      {items.map((r, i) => (
        <div key={i} className="border-l-2 border-amber-300 pl-3 py-1">
          <div className="flex items-center gap-2 flex-wrap">
            {r.id && <span className="text-xs font-mono text-slate-400">{r.id}</span>}
            {r.dimension && <Chip color="derived">{r.dimension}</Chip>}
            {r.required_output && (
              <Chip color={r.required_output === 'non_classificabile' ? 'assente' : 'ambiguo'}>
                {r.required_output.replace(/_/g, ' ')}
              </Chip>
            )}
          </div>
          {r.trigger && <KeyValue label="Trigger" value={<Prose>{r.trigger}</Prose>} />}
          {r.rationale && <KeyValue label="Razionale" value={<Prose>{r.rationale}</Prose>} />}
        </div>
      ))}
    </div>
  );
}

function Step8Viewer({ data }: { data: Step8Data }) {
  const c = data.new_corporeity;
  const b = data.new_bridge;
  const np = data.new_proxy;
  const obs = data.observability_requirements ?? [];
  const ncr = data.non_classifiability_rules ?? [];
  const sc = data.structural_consistency_check;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {data.version && <Chip>{data.version}</Chip>}
        {data.target_theme && <Chip color="secondary">→ {data.target_theme}</Chip>}
        {data.source_device_id && <span className="text-xs text-slate-500 font-mono">da: {data.source_device_id}</span>}
      </div>

      {data.revision_note && <Subtle>{data.revision_note}</Subtle>}

      {c && (
        <div>
          <SectionTitle>Nuova corporeità</SectionTitle>
          <Card>
            {c.description && <Prose>{c.description}</Prose>}
            {c.structural_features && c.structural_features.length > 0 && (
              <KeyValue label="Caratteristiche strutturali" value={<BulletList items={c.structural_features} />} />
            )}
            {c.differences_from_source_theme && (
              <KeyValue label="Differenze dal tema originario" value={<Prose>{c.differences_from_source_theme}</Prose>} />
            )}
            {c.observer_dependency && (
              <div className="mt-2">
                <Chip color={OBSERVER_DEPENDENCY_COLORS[c.observer_dependency] ?? 'slate'}>
                  dip. osservatore: {c.observer_dependency}
                </Chip>
              </div>
            )}
          </Card>
        </div>
      )}

      {b && (
        <div>
          <SectionTitle>Nuovo bridge</SectionTitle>
          <Card>
            {(b.from || b.to) && (
              <div className="flex items-center gap-2 mb-2 text-sm">
                {b.from && <Chip>{b.from}</Chip>}
                <span className="text-slate-400">→</span>
                {b.to && <Chip color="derived">{b.to}</Chip>}
              </div>
            )}
            {b.process_description && <KeyValue label="Processo" value={<Prose>{b.process_description}</Prose>} />}
            {b.open_form && <KeyValue label="Forma aperta" value={<Prose>{b.open_form}</Prose>} />}
            {b.predetermined_form && <KeyValue label="Forma predeterminata" value={<Prose>{b.predetermined_form}</Prose>} />}
          </Card>
        </div>
      )}

      {np && (
        <div>
          <SectionTitle>Nuovo proxy</SectionTitle>
          <Card>
            {np.name && <h4 className="font-semibold text-slate-900">{np.name}</h4>}
            {np.what_it_measures && <KeyValue label="Cosa misura" value={<Prose>{np.what_it_measures}</Prose>} />}
            {np.observable_sequence && np.observable_sequence.length > 0 && (
              <KeyValue label="Sequenza osservabile" value={<BulletList items={np.observable_sequence} />} />
            )}
            {np.discriminating_element && (
              <KeyValue label="Elemento discriminante" value={<Prose>{np.discriminating_element}</Prose>} />
            )}
          </Card>
        </div>
      )}

      <NonReversibilityTestBlock test={data.non_reversibility_test} />

      {obs.length > 0 && (
        <div>
          <SectionTitle>Requisiti di osservabilità ({obs.length})</SectionTitle>
          <ObservabilityRequirementsBlock items={obs} />
        </div>
      )}

      {ncr.length > 0 && (
        <div>
          <SectionTitle>Regole di non-classificabilità ({ncr.length})</SectionTitle>
          <NonClassifiabilityRulesBlock items={ncr} />
        </div>
      )}

      {sc && (
        <div>
          <SectionTitle>Verifica coerenza strutturale</SectionTitle>
          <Card>
            <BoolCheck label="Logica configurazionale preservata" value={sc.configurational_logic_preserved} note={sc.configurational_logic_notes} />
            <BoolCheck label="Nessuna inferenza psicologica" value={sc.no_psychological_inference} note={sc.no_psychological_inference_notes} />
            <BoolCheck label="Nessuna circolarità" value={sc.no_circularity} note={sc.no_circularity_notes} />
            <BoolCheck label="Proxy osservabile" value={sc.proxy_observable} note={sc.proxy_observable_notes} />
            {sc.proxy_not_reused_from_source !== undefined && (
              <BoolCheck label="Proxy non riutilizzato dal tema sorgente" value={sc.proxy_not_reused_from_source} note={sc.proxy_not_reused_notes} />
            )}
            {sc.improvement_over_v1 && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <KeyValue label="Miglioramento rispetto a v1" value={<Prose>{sc.improvement_over_v1}</Prose>} />
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

// ───── step 9: dispositivo-completo ─────

interface DeviceComplete {
  device_id?: string;
  theme_id?: string;
  domain?: string;
  device_type?: string;
  function?: string;
  structural_reference?: StructuralReference;
  reading_focus?: ReadingFocusItem[];
  access_points?: AccessPoint[];
  structural_questions?: string[];
  operative_proxies?: OperativeProxyDetail[];
  observability_requirements?: ObservabilityRequirement[];
  non_classifiability_rules?: NonClassifiabilityRule[];
  interpretive_warnings?: InterpretiveWarning[];
  non_permitted_transformations?: string[];
  validation_structural_check?: {
    configurational_logic_preserved?: boolean; configurational_logic_notes?: string;
    no_psychological_inference?: boolean; no_psychological_inference_notes?: string;
    no_circularity?: boolean; no_circularity_notes?: string;
    proxy_observable?: boolean; proxy_observable_notes?: string;
    self_limiting?: boolean; self_limiting_notes?: string;
  };
}

interface Step9Data {
  step?: string;
  device?: DeviceComplete;
  final_assessment?: string;
}

function Step9Viewer({ data }: { data: Step9Data }) {
  const dev = data.device;
  if (!dev) return <Subtle>Dispositivo non disponibile.</Subtle>;
  const v = dev.validation_structural_check;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <h3 className="font-semibold text-slate-900">{dev.device_id ?? 'Dispositivo'}</h3>
          {dev.device_type && <Chip>{dev.device_type.replace(/_/g, ' ')}</Chip>}
          {dev.theme_id && <Chip color="derived">{dev.theme_id}</Chip>}
          {dev.domain && <Chip color="secondary">{dev.domain}</Chip>}
        </div>
        {dev.function && (
          <CalloutBox title="Funzione" tone="emerald">
            <Prose>{dev.function}</Prose>
          </CalloutBox>
        )}
      </Card>

      <StructuralReferenceBlock sr={dev.structural_reference} />

      {dev.reading_focus && dev.reading_focus.length > 0 && (
        <div>
          <SectionTitle>Reading focus ({dev.reading_focus.length} dimensioni)</SectionTitle>
          <ReadingFocusBlock items={dev.reading_focus} />
        </div>
      )}

      {dev.access_points && dev.access_points.length > 0 && (
        <div>
          <SectionTitle>Access points ({dev.access_points.length})</SectionTitle>
          <div className="space-y-2">
            {dev.access_points.map((ap, i) => (
              <div key={i} className="border-l-2 border-emerald-300 pl-3">
                <p className="text-sm font-medium text-slate-900">{ap.label}</p>
                {ap.description && <Prose>{ap.description}</Prose>}
              </div>
            ))}
          </div>
        </div>
      )}

      {dev.structural_questions && dev.structural_questions.length > 0 && (
        <div>
          <SectionTitle>Domande strutturali ({dev.structural_questions.length})</SectionTitle>
          <BulletList items={dev.structural_questions} />
        </div>
      )}

      {dev.operative_proxies && dev.operative_proxies.length > 0 && (
        <div>
          <SectionTitle>Proxy operativi ({dev.operative_proxies.length})</SectionTitle>
          <div className="space-y-2">
            {dev.operative_proxies.map((p, i) => <OperativeProxyBlock key={i} p={p} />)}
          </div>
        </div>
      )}

      {dev.observability_requirements && dev.observability_requirements.length > 0 && (
        <div>
          <SectionTitle>Requisiti di osservabilità ({dev.observability_requirements.length})</SectionTitle>
          <ObservabilityRequirementsBlock items={dev.observability_requirements} />
        </div>
      )}

      {dev.non_classifiability_rules && dev.non_classifiability_rules.length > 0 && (
        <div>
          <SectionTitle>Regole di non-classificabilità ({dev.non_classifiability_rules.length})</SectionTitle>
          <NonClassifiabilityRulesBlock items={dev.non_classifiability_rules} />
        </div>
      )}

      {dev.interpretive_warnings && dev.interpretive_warnings.length > 0 && (
        <div>
          <SectionTitle>Avvertenze interpretative ({dev.interpretive_warnings.length})</SectionTitle>
          <div className="space-y-2">
            {dev.interpretive_warnings.map((w, i) => (
              <div key={i} className="rounded border border-rose-200 bg-rose-50 p-3 text-sm">
                {w.risk_type && <Chip color="distorta" className="mb-1">{w.risk_type.replace(/_/g, ' ')}</Chip>}
                {w.description && <Prose>{w.description}</Prose>}
              </div>
            ))}
          </div>
        </div>
      )}

      {dev.non_permitted_transformations && dev.non_permitted_transformations.length > 0 && (
        <details className="rounded border border-rose-200 bg-rose-50 p-3">
          <summary className="cursor-pointer text-xs font-semibold text-rose-700">
            Trasformazioni non permesse ({dev.non_permitted_transformations.length})
          </summary>
          <div className="mt-2 space-y-1">
            {dev.non_permitted_transformations.map((t, i) => (
              <p key={i} className="text-sm text-slate-700 leading-relaxed border-l-2 border-rose-300 pl-2">{t}</p>
            ))}
          </div>
        </details>
      )}

      {v && (
        <div>
          <SectionTitle>Validazione strutturale</SectionTitle>
          <Card>
            <BoolCheck label="Logica configurazionale preservata" value={v.configurational_logic_preserved} note={v.configurational_logic_notes} />
            <BoolCheck label="Nessuna inferenza psicologica" value={v.no_psychological_inference} note={v.no_psychological_inference_notes} />
            <BoolCheck label="Nessuna circolarità" value={v.no_circularity} note={v.no_circularity_notes} />
            <BoolCheck label="Proxy osservabile" value={v.proxy_observable} note={v.proxy_observable_notes} />
            <BoolCheck label="Self-limiting (produce non_classificabile su dati assenti)" value={v.self_limiting} note={v.self_limiting_notes} />
          </Card>
        </div>
      )}

      {data.final_assessment && (
        <CalloutBox title="Valutazione finale" tone="slate">
          <Prose>{data.final_assessment}</Prose>
        </CalloutBox>
      )}
    </div>
  );
}

// ───── step 10: stress-test-dispositivo ─────

const CASE_TYPE_COLORS: Record<string, string> = {
  configurazione_assente:     'assenza_configurazione',
  configurazione_parziale:    'configurazione_parziale',
  configurazione_chiudente:   'configurazione_distorta',
  configurazione_apparente:   'configurazione_oscillante',
  caso_quasi_indistinguibile: 'configurazione_oscillante',
};

const VERDICT_COLORS: Record<string, string> = {
  regge:              'forte',
  regge_con_riserva:  'da_verificare',
  fallisce:           'distorta',
};

const ROBUSTNESS_COLORS: Record<string, string> = {
  alta:  'forte',
  media: 'da_verificare',
  bassa: 'distorta',
};

const PROXY_OUTPUT_COLORS: Record<string, string> = {
  aperto:           'aperto',
  predeterminato:   'predeterminato',
  ambiguo:          'ambiguo',
  non_classificabile: 'assente',
};

const AMBIGUITY_COLORS: Record<string, string> = {
  basso: 'forte',
  medio: 'da_verificare',
  alto:  'distorta',
};

interface Step10Case {
  case_id?: string;
  case_type?: string;
  case_description?: string;
  observed_configuration?: {
    corporeity?: string; field?: string; co_regulation?: string;
    symbolic_mediation?: string; transformative_passage?: string;
  };
  proxy_application?: {
    applicable?: boolean; reason?: string;
    required_observations_present?: string[];
    missing_observations?: string[];
    proxy_output?: string;
  };
  device_performance?: {
    readable?: boolean; what_it_reads?: string;
    what_becomes_unclear?: string; ambiguity_level?: string;
  };
  breaking_point?: { present?: boolean; where?: string; why?: string };
  false_positive_risk?: { risk_present?: boolean; description?: string; mitigation?: string };
  test_verdict?: string;
}

interface Step10Data {
  step?: string;
  device_id?: string;
  stress_test_results?: Step10Case[];
  global_assessment?: {
    device_robustness?: string;
    main_strengths?: string[];
    main_weaknesses?: string[];
    required_corrections?: string[];
  };
}

function ObservedConfigGrid({ oc }: { oc?: Step10Case['observed_configuration'] }) {
  if (!oc) return null;
  const fields: { label: string; value?: string }[] = [
    { label: 'corporeità', value: oc.corporeity },
    { label: 'campo', value: oc.field },
    { label: 'co-regolazione', value: oc.co_regulation },
    { label: 'mediazione simbolica', value: oc.symbolic_mediation },
    { label: 'passaggio trasformativo', value: oc.transformative_passage },
  ];
  const filled = fields.filter((f) => f.value);
  if (filled.length === 0) return null;
  return (
    <div className="grid sm:grid-cols-2 gap-2 mt-2">
      {filled.map((f, i) => (
        <div key={i} className="rounded border border-slate-200 bg-slate-50 p-2 text-xs">
          <p className="font-semibold text-slate-600 uppercase tracking-wide mb-0.5">{f.label}</p>
          <p className="text-slate-700 leading-relaxed">{f.value}</p>
        </div>
      ))}
    </div>
  );
}

function Step10Viewer({ data }: { data: Step10Data }) {
  const cases = data.stress_test_results ?? [];
  const ga = data.global_assessment;
  const [active, setActive] = useState(0);
  const c = cases[active];

  const verdictCount = {
    regge: cases.filter((x) => x.test_verdict === 'regge').length,
    regge_con_riserva: cases.filter((x) => x.test_verdict === 'regge_con_riserva').length,
    fallisce: cases.filter((x) => x.test_verdict === 'fallisce').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {data.device_id && <span className="text-xs text-slate-500 font-mono">device: {data.device_id}</span>}
        <span className="text-xs text-slate-500 ml-auto">
          {verdictCount.regge > 0 && <Chip color="forte" className="mr-1">{verdictCount.regge} regge</Chip>}
          {verdictCount.regge_con_riserva > 0 && <Chip color="da_verificare" className="mr-1">{verdictCount.regge_con_riserva} con riserva</Chip>}
          {verdictCount.fallisce > 0 && <Chip color="distorta">{verdictCount.fallisce} fallisce</Chip>}
        </span>
      </div>

      {ga && (
        <CalloutBox
          title="Valutazione globale"
          tone={ga.device_robustness === 'bassa' ? 'rose' : ga.device_robustness === 'alta' ? 'emerald' : 'amber'}
        >
          {ga.device_robustness && (
            <Chip color={ROBUSTNESS_COLORS[ga.device_robustness] ?? 'slate'}>
              robustezza: {ga.device_robustness}
            </Chip>
          )}
          {ga.main_strengths && ga.main_strengths.length > 0 && (
            <div className="mt-2"><KeyValue label="Punti di forza" value={<BulletList items={ga.main_strengths} />} /></div>
          )}
          {ga.main_weaknesses && ga.main_weaknesses.length > 0 && (
            <KeyValue label="Debolezze" value={<BulletList items={ga.main_weaknesses} />} />
          )}
          {ga.required_corrections && ga.required_corrections.length > 0 && (
            <KeyValue label="Correzioni necessarie" value={<BulletList items={ga.required_corrections} />} />
          )}
        </CalloutBox>
      )}

      {cases.length > 0 && (
        <div>
          <SectionTitle>Casi di stress test ({cases.length})</SectionTitle>
          <ThemeTabs
            themes={cases.map((x, i) => ({ theme_id: x.case_id ?? String(i), label: x.case_id ?? `Caso ${i + 1}` }))}
            activeIdx={active}
            onChange={setActive}
          />
          {c && (
            <Card>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h4 className="font-semibold text-slate-900">{c.case_id}</h4>
                {c.case_type && (
                  <Chip color={CASE_TYPE_COLORS[c.case_type] ?? 'slate'}>
                    {c.case_type.replace(/_/g, ' ')}
                  </Chip>
                )}
                {c.test_verdict && (
                  <Chip color={VERDICT_COLORS[c.test_verdict] ?? 'slate'} className="ml-auto">
                    {c.test_verdict.replace(/_/g, ' ')}
                  </Chip>
                )}
              </div>

              {c.case_description && (
                <details className="mb-3">
                  <summary className="cursor-pointer text-xs font-semibold text-slate-600">Descrizione del caso</summary>
                  <div className="mt-2"><Prose>{c.case_description}</Prose></div>
                </details>
              )}

              <SectionTitle>Configurazione osservata</SectionTitle>
              <ObservedConfigGrid oc={c.observed_configuration} />

              {c.proxy_application && (
                <>
                  <SectionTitle>Applicazione del proxy</SectionTitle>
                  <div className="rounded border border-slate-200 p-3 bg-slate-50">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <BoolCheck label="Proxy applicabile" value={c.proxy_application.applicable} />
                      {c.proxy_application.proxy_output && (
                        <Chip color={PROXY_OUTPUT_COLORS[c.proxy_application.proxy_output] ?? 'slate'} className="ml-auto">
                          output: {c.proxy_application.proxy_output.replace(/_/g, ' ')}
                        </Chip>
                      )}
                    </div>
                    {c.proxy_application.reason && <Prose>{c.proxy_application.reason}</Prose>}
                    {c.proxy_application.required_observations_present && c.proxy_application.required_observations_present.length > 0 && (
                      <KeyValue label="Osserv. presenti" value={<BulletList items={c.proxy_application.required_observations_present} />} />
                    )}
                    {c.proxy_application.missing_observations && c.proxy_application.missing_observations.length > 0 && (
                      <KeyValue label="Osserv. mancanti" value={<BulletList items={c.proxy_application.missing_observations} />} />
                    )}
                  </div>
                </>
              )}

              {c.device_performance && (
                <>
                  <SectionTitle>Performance del dispositivo</SectionTitle>
                  <div className="rounded border border-slate-200 p-3">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <BoolCheck label="Caso leggibile" value={c.device_performance.readable} />
                      {c.device_performance.ambiguity_level && (
                        <Chip color={AMBIGUITY_COLORS[c.device_performance.ambiguity_level] ?? 'slate'} className="ml-auto">
                          ambiguità: {c.device_performance.ambiguity_level}
                        </Chip>
                      )}
                    </div>
                    {c.device_performance.what_it_reads && (
                      <KeyValue label="Cosa legge" value={<Prose>{c.device_performance.what_it_reads}</Prose>} />
                    )}
                    {c.device_performance.what_becomes_unclear && (
                      <KeyValue label="Cosa resta oscuro" value={<Prose>{c.device_performance.what_becomes_unclear}</Prose>} />
                    )}
                  </div>
                </>
              )}

              {c.breaking_point && c.breaking_point.present && (
                <CalloutBox title="Breaking point" tone="rose">
                  {c.breaking_point.where && <KeyValue label="Dove" value={<Prose>{c.breaking_point.where}</Prose>} />}
                  {c.breaking_point.why && <KeyValue label="Perché" value={<Prose>{c.breaking_point.why}</Prose>} />}
                </CalloutBox>
              )}

              {c.false_positive_risk && c.false_positive_risk.risk_present && (
                <CalloutBox title="Rischio falso positivo" tone="amber">
                  {c.false_positive_risk.description && <Prose>{c.false_positive_risk.description}</Prose>}
                  {c.false_positive_risk.mitigation && (
                    <div className="mt-2"><KeyValue label="Mitigazione" value={<Prose>{c.false_positive_risk.mitigation}</Prose>} /></div>
                  )}
                </CalloutBox>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ───── correzione-strutturale (f3_step_3 e f3_step_6c) ─────
// Lo schema reale ha forma { step, theme_id, domain, source_device_id,
// corrections_log[], corrected_device_id, corrected_device }.
// Il vecchio Step3Viewer si aspettava data.results[] — schema diverso.

interface CorrectionEntry {
  breaking_point_ref?: string;
  breaking_point_summary?: string;
  correction_type?: string;
  correction_scope?: string;
  correction_description?: string;
  rationale?: string;
}

interface CorrectionLogData {
  step?: string;
  theme_id?: string;
  domain?: string;
  source_device_id?: string;
  corrections_log?: CorrectionEntry[];
  corrected_device_id?: string;
  corrected_device?: DeviceComplete;
}

const CORRECTION_TYPE_COLORS: Record<string, string> = {
  applicata:           'forte',
  non_applicata:       'rejected',
  parzialmente_applicata: 'da_verificare',
};

function Step3CorrectionViewer({ data }: { data: CorrectionLogData }) {
  const log = data.corrections_log ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {data.theme_id && <Chip>{data.theme_id}</Chip>}
        {data.domain && <Chip color="secondary">{data.domain}</Chip>}
        {data.source_device_id && (
          <span className="text-xs text-slate-500 font-mono">da: {data.source_device_id}</span>
        )}
        {data.corrected_device_id && (
          <span className="text-xs text-slate-500 font-mono">→ {data.corrected_device_id}</span>
        )}
      </div>

      {log.length > 0 && (
        <div>
          <SectionTitle>Correzioni applicate ({log.length})</SectionTitle>
          <div className="space-y-2">
            {log.map((c, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {c.breaking_point_ref && (
                    <span className="text-xs font-mono text-slate-400">{c.breaking_point_ref}</span>
                  )}
                  {c.correction_type && (
                    <Chip color={CORRECTION_TYPE_COLORS[c.correction_type] ?? 'slate'}>
                      {c.correction_type.replace(/_/g, ' ')}
                    </Chip>
                  )}
                  {c.correction_scope && <Chip color="derived">{c.correction_scope.replace(/_/g, ' ')}</Chip>}
                </div>
                {c.breaking_point_summary && (
                  <KeyValue label="Breaking point" value={<Prose>{c.breaking_point_summary}</Prose>} />
                )}
                {c.correction_description && (
                  <KeyValue label="Descrizione correzione" value={<Prose>{c.correction_description}</Prose>} />
                )}
                {c.rationale && (
                  <KeyValue label="Razionale" value={<Prose>{c.rationale}</Prose>} />
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {data.corrected_device && (
        <div>
          <SectionTitle>Dispositivo corretto</SectionTitle>
          <Step9Viewer data={{ device: data.corrected_device }} />
        </div>
      )}
    </div>
  );
}

// ───── dispatcher ─────

export interface F3OutputViewerProps {
  stepId: string;
  data: unknown;
}

const F3_VIEWER_STEPS = ['1', '2', '3', '4', '5', '6', '6b', '6c', '7', '8', '9', '10'];

// Rilevamento di shape: lo schema "vecchio" usa data.results[], quello nuovo
// usa data.corrections_log + data.corrected_device.
function pickStep3Viewer(d: Record<string, unknown>) {
  const hasNewShape = Array.isArray(d.corrections_log) || (d.corrected_device !== undefined && d.corrected_device !== null);
  if (hasNewShape) return <Step3CorrectionViewer data={d as CorrectionLogData} />;
  return <Step3Viewer data={d as Step3Data} />;
}

export default function F3OutputViewer({ stepId, data }: F3OutputViewerProps) {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;

  switch (stepId) {
    case 'f3_step_1':  return <Step1Viewer  data={d as Step1Data} />;
    case 'f3_step_2':  return <Step2Viewer  data={d as Step2Data} />;
    case 'f3_step_3':  return pickStep3Viewer(d);
    case 'f3_step_4':  return <Step4Viewer  data={d as Step4Data} />;
    case 'f3_step_5':  return <Step5Viewer  data={d as Step5Data} />;
    case 'f3_step_6':  return <Step6Viewer  data={d as Step6Data} />;
    case 'f3_step_6b': return pickStep6bViewer(d);
    case 'f3_step_6c': return pickStep3Viewer(d);
    case 'f3_step_7':  return <Step7Viewer  data={d as Step7Data} />;
    case 'f3_step_8':  return <Step8Viewer  data={d as Step8Data} />;
    case 'f3_step_9':  return <Step9Viewer  data={d as Step9Data} />;
    case 'f3_step_10': return <Step10Viewer data={d as Step10Data} />;
    default: return null;
  }
}

export function hasF3Viewer(stepId: string): boolean {
  if (!stepId.startsWith('f3_step_')) return false;
  return F3_VIEWER_STEPS.includes(stepId.slice('f3_step_'.length));
}
