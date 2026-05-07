// Viewer strutturato per gli output della Fase 3 — pipeline v3.1 (D8).
// 5 sub-viewer allineati agli schemi attivi:
//   f3_step_1 — Nodo dominante e funzione
//   f3_step_2 — Micro-dispositivo di campo
//   f3_step_3 — Stress test e correzione
//   f3_step_4 — Verifica di coerenza F3
//   f3_step_5 — Output-tipo contestualizzato
//
// I sub-viewer pre-D7 (lettura-configurazionale, indistinguibility-test,
// stabilizzazione-proxy, trasferibilità, adattamento-strutturale, dispositivo
// completo, stress-test-dispositivo) sono stati rimossi insieme alla pipeline
// che li produceva. Per gli output legacy in client/public/pipeline/temi/ il
// dispatcher cade nel fallback JSON di ExecutionOutputViewer.

import {
  Card, Chip, KeyValue, Prose, SectionTitle, Subtle, BulletList, CalloutBox,
} from './viewerPrimitives';

// ───────────────────────────────────────────────────────────────
// helpers comuni
// ───────────────────────────────────────────────────────────────

const CHECK_OUTCOME_COLOR: Record<string, string> = {
  'sì':            'forte',
  'no':            'distorta',
  'ambiguo':       'ambiguo',
};

const STRESS_VERDICT_COLOR: Record<string, string> = {
  robusto:     'forte',
  accettabile: 'plausibile',
  fragile:     'ambiguo',
  non_valido:  'distorta',
};

const COHERENCE_VERDICT_COLOR: Record<string, string> = {
  valido:               'forte',
  richiede_revisione:   'ambiguo',
  fuori_modello:        'distorta',
};

const CHECK_RESULT_COLOR: Record<string, string> = {
  passa:               'forte',
  passa_con_riserve:   'ambiguo',
  non_passa:           'distorta',
};

const FUNCTION_TYPE_COLOR: Record<string, string> = {
  stabilizzare: 'forte',
  ampliare:     'plausibile',
  mediare:      'secondary',
  proteggere:   'derived',
};

const NODE_STATUS_COLOR: Record<string, string> = {
  sostenuto:   'forte',
  neutro:      'rejected',
  'co-fragile': 'ambiguo',
};

function ContextHeader({ tema_id, domain, context_label }: {
  tema_id?: string; domain?: string; context_label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3 text-sm">
      {tema_id && <Chip>{tema_id}</Chip>}
      {domain && <Chip color="secondary">{domain}</Chip>}
      {context_label && (
        <span className="text-xs text-slate-500 italic">contesto: {context_label}</span>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// f3_step_1 — Nodo dominante e funzione
// ───────────────────────────────────────────────────────────────

interface CheckOutcome { value: 'sì' | 'no' | 'ambiguo'; motivation?: string | null; }

interface Step1Result {
  dominant_node: {
    node_id: string;
    node_label: string;
    dominance_motivation: string;
    other_nodes_status: { node_id: string; status: 'sostenuto' | 'neutro' | 'co-fragile'; note?: string | null }[];
  };
  function: {
    function_type: 'stabilizzare' | 'ampliare' | 'mediare' | 'proteggere';
    function_motivation: string;
  };
  target_field: {
    field_label: string;
    field_motivation: string;
  };
  coherence_check: {
    node_in_confirmed: CheckOutcome;
    function_in_closed_set: CheckOutcome;
    function_coherent_with_node: CheckOutcome;
    target_field_specific: CheckOutcome;
  };
}

interface Step1Data {
  tema_id?: string;
  domain_selected?: string;
  context_label?: string;
  researcher_notes?: string | null;
  results?: Step1Result[];
}

const STEP1_CHECK_LABEL: Record<keyof Step1Result['coherence_check'], string> = {
  node_in_confirmed:           'Nodo dominante in elenco confermato',
  function_in_closed_set:      'Funzione nell\'insieme chiuso (4 funzioni)',
  function_coherent_with_node: 'Funzione coerente con il nodo dominante',
  target_field_specific:       'Campo bersaglio specifico (non generico)',
};

function Step1Viewer({ data }: { data: Step1Data }) {
  const r = data.results?.[0];
  if (!r) return <Subtle>Nessun risultato disponibile</Subtle>;
  const checks = r.coherence_check;

  return (
    <div className="space-y-4">
      <ContextHeader tema_id={data.tema_id} domain={data.domain_selected} context_label={data.context_label} />

      <Card>
        <SectionTitle>Nodo dominante</SectionTitle>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-slate-500">{r.dominant_node.node_id}</span>
          <span className="text-base font-semibold text-slate-900">{r.dominant_node.node_label}</span>
        </div>
        <KeyValue label="Motivazione di dominanza" value={<Prose>{r.dominant_node.dominance_motivation}</Prose>} />
        {r.dominant_node.other_nodes_status?.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Altri nodi</p>
            <div className="space-y-1">
              {r.dominant_node.other_nodes_status.map((n, i) => (
                <div key={i} className="flex items-baseline gap-2 text-sm">
                  <span className="text-xs font-mono text-slate-400">{n.node_id}</span>
                  <Chip color={NODE_STATUS_COLOR[n.status] ?? 'slate'}>{n.status}</Chip>
                  {n.note && <span className="text-xs text-slate-600 italic">— {n.note}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle>Funzione</SectionTitle>
        <div className="mb-2">
          <Chip color={FUNCTION_TYPE_COLOR[r.function.function_type] ?? 'slate'}>{r.function.function_type}</Chip>
        </div>
        <KeyValue label="Motivazione" value={<Prose>{r.function.function_motivation}</Prose>} />
      </Card>

      <Card>
        <SectionTitle>Campo bersaglio</SectionTitle>
        <KeyValue label="Etichetta" value={<span className="font-medium text-slate-900">{r.target_field.field_label}</span>} />
        <KeyValue label="Motivazione" value={<Prose>{r.target_field.field_motivation}</Prose>} />
      </Card>

      <Card>
        <SectionTitle>Verifica di coerenza</SectionTitle>
        <div className="space-y-2">
          {(Object.keys(STEP1_CHECK_LABEL) as (keyof Step1Result['coherence_check'])[]).map((k) => {
            const c = checks?.[k];
            if (!c) return null;
            return (
              <div key={k} className="flex items-baseline gap-2 text-sm">
                <Chip color={CHECK_OUTCOME_COLOR[c.value] ?? 'slate'}>{c.value}</Chip>
                <span className="font-medium text-slate-800">{STEP1_CHECK_LABEL[k]}</span>
                {c.motivation && <span className="text-xs text-slate-600 italic">— {c.motivation}</span>}
              </div>
            );
          })}
        </div>
      </Card>

      {data.researcher_notes && (
        <CalloutBox title="Note del ricercatore" tone="sky"><Prose>{data.researcher_notes}</Prose></CalloutBox>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// f3_step_2 — Micro-dispositivo di campo
// ───────────────────────────────────────────────────────────────

interface MicroAction {
  id: string;
  description: string;
  observable_effect: string;
  reversibility_note: string;
}

interface NonApplicabilityRule {
  trigger: string;
  required_outcome: 'non_classificabile' | 'ambiguo' | 'sospendere';
  rationale: string;
}

interface Step2Result {
  ce_origin: string;
  dominant_node_ref: { node_id: string; node_label: string };
  function_ref: { function_type: 'stabilizzare' | 'ampliare' | 'mediare' | 'proteggere' };
  target_field_ref: { field_label: string };
  micro_actions: MicroAction[];
  real_time: { duration_label: string; time_motivation?: string | null };
  resonance_indicator: string;
  universal_form: { forms: string[]; combination_motivation?: string | null };
  non_applicability: NonApplicabilityRule[];
  synthesis: string;
}

interface Step2Data {
  tema_id?: string;
  domain_selected?: string;
  results?: Step2Result[];
}

function MicroActionsTable({ actions }: { actions: MicroAction[] }) {
  return (
    <div className="space-y-2">
      {actions.map((a) => (
        <Card key={a.id} className="!p-3">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xs font-mono text-slate-400">{a.id}</span>
            <span className="text-sm font-medium text-slate-900">{a.description}</span>
          </div>
          <KeyValue label="Effetto osservabile" value={<Prose>{a.observable_effect}</Prose>} />
          <KeyValue label="Reversibilità" value={<Prose>{a.reversibility_note}</Prose>} />
        </Card>
      ))}
    </div>
  );
}

function NonApplicabilityList({ rules }: { rules: NonApplicabilityRule[] }) {
  if (!rules || rules.length === 0) return <Subtle>nessuna regola</Subtle>;
  return (
    <div className="space-y-2">
      {rules.map((r, i) => (
        <div key={i} className="border-l-2 border-amber-300 pl-3 py-1 text-sm">
          <div className="flex items-baseline gap-2 mb-0.5">
            <Chip color="ambiguo">{r.required_outcome}</Chip>
          </div>
          <KeyValue label="Trigger" value={<Prose>{r.trigger}</Prose>} />
          <KeyValue label="Razionale" value={<Prose>{r.rationale}</Prose>} />
        </div>
      ))}
    </div>
  );
}

function Step2Viewer({ data }: { data: Step2Data }) {
  const r = data.results?.[0];
  if (!r) return <Subtle>Nessun risultato disponibile</Subtle>;

  return (
    <div className="space-y-4">
      <ContextHeader tema_id={data.tema_id} domain={data.domain_selected} />

      <CalloutBox title="Sintesi del dispositivo" tone="emerald"><Prose>{r.synthesis}</Prose></CalloutBox>

      <Card>
        <SectionTitle>Riferimenti strutturali</SectionTitle>
        <KeyValue label="CE di origine" value={<Prose>{r.ce_origin}</Prose>} />
        <KeyValue
          label="Nodo dominante"
          value={<><span className="text-xs font-mono text-slate-400 mr-1">{r.dominant_node_ref.node_id}</span>{r.dominant_node_ref.node_label}</>}
        />
        <KeyValue
          label="Funzione"
          value={<Chip color={FUNCTION_TYPE_COLOR[r.function_ref.function_type] ?? 'slate'}>{r.function_ref.function_type}</Chip>}
        />
        <KeyValue label="Campo bersaglio" value={r.target_field_ref.field_label} />
      </Card>

      <Card>
        <SectionTitle>Micro-azioni ({r.micro_actions.length})</SectionTitle>
        <MicroActionsTable actions={r.micro_actions} />
      </Card>

      <Card>
        <SectionTitle>Tempo reale</SectionTitle>
        <KeyValue label="Durata" value={r.real_time.duration_label} />
        {r.real_time.time_motivation && (
          <KeyValue label="Motivazione" value={<Prose>{r.real_time.time_motivation}</Prose>} />
        )}
      </Card>

      <Card>
        <SectionTitle>Indicatore di risonanza</SectionTitle>
        <Prose>{r.resonance_indicator}</Prose>
      </Card>

      <Card>
        <SectionTitle>Forma universale</SectionTitle>
        <div className="flex flex-wrap gap-1 mb-2">
          {r.universal_form.forms.map((f) => <Chip key={f} color="derived">{f}</Chip>)}
        </div>
        {r.universal_form.combination_motivation && (
          <Prose>{r.universal_form.combination_motivation}</Prose>
        )}
      </Card>

      <Card>
        <SectionTitle>Condizioni di non-applicabilità</SectionTitle>
        <NonApplicabilityList rules={r.non_applicability} />
      </Card>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// f3_step_3 — Stress test e correzione
// ───────────────────────────────────────────────────────────────

const CASE_TYPE_LABEL: Record<string, string> = {
  assenza_configurazione:                'Assenza di configurazione',
  configurazione_parziale:               'Configurazione parziale',
  configurazione_distorta_chiudente:     'Configurazione distorta-chiudente',
  configurazione_oscillante:             'Configurazione oscillante',
  configurazione_apparente_indistinguibile: 'Apparente indistinguibilità',
};

const AMBIGUITY_COLOR: Record<string, string> = {
  basso:  'forte',
  medio:  'ambiguo',
  alto:   'distorta',
};

interface StressCase {
  case_type: keyof typeof CASE_TYPE_LABEL | string;
  case_description: string;
  device_application: {
    observed_configuration: string;
    device_behavior: {
      readability: string;
      ambiguity_level: 'basso' | 'medio' | 'alto';
      what_becomes_unclear?: string | null;
    };
    breaking_point: {
      present: boolean;
      where?: string | null;
      why?: string | null;
      is_structural?: boolean | null;
    };
    non_applicability_triggered?: { trigger_id: string; outcome: string } | null;
    mislettura_risk: { without_device: string; with_device_misused: string };
  };
}

interface DeviceCorrection {
  triggered_by_breaking_points?: string[];
  corrected_micro_actions?: MicroAction[];
  corrected_non_applicability?: NonApplicabilityRule[];
  corrected_universal_form?: { forms: string[]; combination_motivation?: string | null } | null;
  corrected_resonance_indicator?: string | null;
  correction_blocked_reason?: string | null;
}

interface Step3Result {
  researcher_provided_cases?: boolean | null;
  cases: StressCase[];
  stress_test_verdict: {
    cases_passed: number;
    breaking_points_count: number;
    apparente_indistinguibile_outcome: 'discriminato' | 'non_discriminato' | 'discriminazione_dipendente_dall_osservatore';
    verdict: 'robusto' | 'accettabile' | 'fragile' | 'non_valido';
  };
  device_correction?: DeviceCorrection | null;
}

interface Step3Data {
  tema_id?: string;
  domain_selected?: string;
  results?: Step3Result[];
}

function StressCaseCard({ c }: { c: StressCase }) {
  const da = c.device_application;
  return (
    <Card>
      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
        <span className="text-sm font-semibold text-slate-900">{CASE_TYPE_LABEL[c.case_type as string] ?? c.case_type}</span>
        <Chip color={AMBIGUITY_COLOR[da.device_behavior.ambiguity_level] ?? 'slate'}>
          ambiguità: {da.device_behavior.ambiguity_level}
        </Chip>
        {da.breaking_point.present && (
          <Chip color={da.breaking_point.is_structural ? 'distorta' : 'ambiguo'}>
            {da.breaking_point.is_structural ? 'breaking point strutturale' : 'breaking point'}
          </Chip>
        )}
      </div>
      <KeyValue label="Descrizione del caso" value={<Prose>{c.case_description}</Prose>} />
      <KeyValue label="Configurazione osservata" value={<Prose>{da.observed_configuration}</Prose>} />
      <KeyValue label="Leggibilità" value={<Prose>{da.device_behavior.readability}</Prose>} />
      {da.device_behavior.what_becomes_unclear && (
        <KeyValue label="Cosa diventa oscuro" value={<Prose>{da.device_behavior.what_becomes_unclear}</Prose>} />
      )}
      {da.breaking_point.present && (
        <div className="mt-2 border-l-2 border-rose-300 pl-3 py-1">
          {da.breaking_point.where && <KeyValue label="Dove" value={<Prose>{da.breaking_point.where}</Prose>} />}
          {da.breaking_point.why && <KeyValue label="Perché" value={<Prose>{da.breaking_point.why}</Prose>} />}
        </div>
      )}
      {da.non_applicability_triggered && (
        <div className="mt-2">
          <KeyValue
            label="Non-applicabilità attivata"
            value={
              <span className="inline-flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">{da.non_applicability_triggered.trigger_id}</span>
                <Chip color="ambiguo">{da.non_applicability_triggered.outcome}</Chip>
              </span>
            }
          />
        </div>
      )}
      <div className="mt-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Rischio di mislettura</p>
        <KeyValue label="Senza dispositivo" value={<Prose>{da.mislettura_risk.without_device}</Prose>} />
        <KeyValue label="Con dispositivo male usato" value={<Prose>{da.mislettura_risk.with_device_misused}</Prose>} />
      </div>
    </Card>
  );
}

function DeviceCorrectionBlock({ correction }: { correction: DeviceCorrection }) {
  if (correction.correction_blocked_reason) {
    return (
      <CalloutBox title="Correzione non applicata" tone="rose">
        <Prose>{correction.correction_blocked_reason}</Prose>
      </CalloutBox>
    );
  }
  return (
    <Card>
      <SectionTitle>Correzione del dispositivo</SectionTitle>
      {correction.triggered_by_breaking_points && correction.triggered_by_breaking_points.length > 0 && (
        <KeyValue
          label="Innescata da"
          value={<div className="flex flex-wrap gap-1">{correction.triggered_by_breaking_points.map((bp, i) => <Chip key={i} color="distorta">{bp}</Chip>)}</div>}
        />
      )}
      {correction.corrected_micro_actions && correction.corrected_micro_actions.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Micro-azioni corrette</p>
          <MicroActionsTable actions={correction.corrected_micro_actions} />
        </div>
      )}
      {correction.corrected_non_applicability && correction.corrected_non_applicability.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Non-applicabilità corrette</p>
          <NonApplicabilityList rules={correction.corrected_non_applicability} />
        </div>
      )}
      {correction.corrected_universal_form && (
        <KeyValue
          label="Forma universale corretta"
          value={<div className="flex flex-wrap gap-1">{correction.corrected_universal_form.forms.map((f) => <Chip key={f} color="derived">{f}</Chip>)}</div>}
        />
      )}
      {correction.corrected_resonance_indicator && (
        <KeyValue label="Risonanza corretta" value={<Prose>{correction.corrected_resonance_indicator}</Prose>} />
      )}
    </Card>
  );
}

function Step3Viewer({ data }: { data: Step3Data }) {
  const r = data.results?.[0];
  if (!r) return <Subtle>Nessun risultato disponibile</Subtle>;
  const v = r.stress_test_verdict;

  return (
    <div className="space-y-4">
      <ContextHeader tema_id={data.tema_id} domain={data.domain_selected} />

      <CalloutBox
        title="Verdetto stress test"
        tone={v.verdict === 'robusto' ? 'emerald' : v.verdict === 'non_valido' ? 'rose' : v.verdict === 'fragile' ? 'amber' : 'sky'}
      >
        <div className="flex items-center gap-3 text-sm">
          <Chip color={STRESS_VERDICT_COLOR[v.verdict] ?? 'slate'}>{v.verdict}</Chip>
          <span className="text-slate-700">{v.cases_passed}/5 passati · {v.breaking_points_count} breaking point</span>
        </div>
        <div className="mt-2 text-xs text-slate-600">
          Apparente indistinguibilità: <span className="font-medium">{v.apparente_indistinguibile_outcome.replace(/_/g, ' ')}</span>
        </div>
      </CalloutBox>

      <div>
        <SectionTitle>5 casi tipologici</SectionTitle>
        {r.researcher_provided_cases !== null && r.researcher_provided_cases !== undefined && (
          <Subtle>
            {r.researcher_provided_cases ? 'Casi forniti dal ricercatore' : 'Casi generati dall\'agente'}
          </Subtle>
        )}
        <div className="space-y-3 mt-2">
          {r.cases.map((c, i) => <StressCaseCard key={i} c={c} />)}
        </div>
      </div>

      {r.device_correction && <DeviceCorrectionBlock correction={r.device_correction} />}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// f3_step_4 — Verifica di coerenza F3 (10 check)
// ───────────────────────────────────────────────────────────────

interface CoherenceCheck {
  id: string;
  label: string;
  outcome: 'passa' | 'passa_con_riserve' | 'non_passa';
  motivation: string;
}

interface Step4Result {
  checks: CoherenceCheck[];
  final_verdict: {
    total_checks: number;
    passed: number;
    passed_with_reserves: number;
    failed: number;
    verdict: 'valido' | 'richiede_revisione' | 'fuori_modello';
    critical_failures?: string[];
    recommended_restart_step?: string | null;
  };
}

interface Step4Data {
  tema_id?: string;
  domain_selected?: string;
  results?: Step4Result[];
}

function Step4Viewer({ data }: { data: Step4Data }) {
  const r = data.results?.[0];
  if (!r) return <Subtle>Nessun risultato disponibile</Subtle>;
  const fv = r.final_verdict;

  return (
    <div className="space-y-4">
      <ContextHeader tema_id={data.tema_id} domain={data.domain_selected} />

      <CalloutBox
        title="Verdetto finale"
        tone={fv.verdict === 'valido' ? 'emerald' : fv.verdict === 'fuori_modello' ? 'rose' : 'amber'}
      >
        <div className="flex items-center gap-3 text-sm flex-wrap">
          <Chip color={COHERENCE_VERDICT_COLOR[fv.verdict] ?? 'slate'}>{fv.verdict.replace(/_/g, ' ')}</Chip>
          <span className="text-slate-700">
            {fv.passed} passa · {fv.passed_with_reserves} con riserve · {fv.failed} falliti
            <span className="text-slate-400"> / {fv.total_checks}</span>
          </span>
        </div>
        {fv.critical_failures && fv.critical_failures.length > 0 && (
          <div className="mt-2 flex items-center gap-1 flex-wrap">
            <span className="text-xs text-rose-700 font-semibold">Falliti critici:</span>
            {fv.critical_failures.map((id) => <Chip key={id} color="distorta">{id}</Chip>)}
          </div>
        )}
        {fv.recommended_restart_step && (
          <div className="mt-2 text-xs text-slate-700">
            Restart consigliato a: <span className="font-mono font-semibold">{fv.recommended_restart_step}</span>
          </div>
        )}
      </CalloutBox>

      <div>
        <SectionTitle>Checklist normativa ({r.checks.length} controlli)</SectionTitle>
        <div className="space-y-2">
          {r.checks.map((c) => (
            <Card key={c.id} className="!p-3">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-mono text-slate-500">{c.id}</span>
                <Chip color={CHECK_RESULT_COLOR[c.outcome] ?? 'slate'}>{c.outcome.replace(/_/g, ' ')}</Chip>
                <span className="text-sm font-medium text-slate-900">{c.label}</span>
              </div>
              <KeyValue label="Motivazione" value={<Prose>{c.motivation}</Prose>} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// f3_step_5 — Output-tipo contestualizzato (D8)
// ───────────────────────────────────────────────────────────────

interface OutputTipoSection {
  section_id: 'A' | 'B' | 'C' | 'D' | 'E' | string;
  section_label: string;
  domain_examples: string[];
  linguistic_frame: string;
  decisional_nodes: string[];
}

interface Step5Result {
  sections: OutputTipoSection[];
  narrative_synthesis: string;
  orientative_direction: string;
  dispositivo_ref: {
    device_synthesis: string;
    function_type: 'stabilizzare' | 'ampliare' | 'mediare' | 'proteggere';
    real_time: string;
    resonance_indicator: string;
  };
  operator_note?: string | null;
}

interface Step5Data {
  tema_id?: string;
  domain_selected?: string;
  context_label?: string;
  results?: Step5Result[];
}

function OutputTipoSectionCard({ s }: { s: OutputTipoSection }) {
  return (
    <Card>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-base font-bold text-slate-900">{s.section_id}</span>
        <span className="text-sm font-medium text-slate-700">{s.section_label}</span>
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Esempi nel dominio</p>
          <BulletList items={s.domain_examples} empty="nessun esempio" />
        </div>
        <KeyValue label="Inquadramento linguistico" value={<Prose>{s.linguistic_frame}</Prose>} />
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Nodi decisionali</p>
          <BulletList items={s.decisional_nodes} empty="nessun nodo" />
        </div>
      </div>
    </Card>
  );
}

function Step5Viewer({ data }: { data: Step5Data }) {
  const r = data.results?.[0];
  if (!r) return <Subtle>Nessun risultato disponibile</Subtle>;

  return (
    <div className="space-y-4">
      <ContextHeader tema_id={data.tema_id} domain={data.domain_selected} context_label={data.context_label} />

      <CalloutBox title="Sintesi narrativa" tone="emerald">
        <Prose>{r.narrative_synthesis}</Prose>
      </CalloutBox>

      <CalloutBox title="Direzione orientativa" tone="sky">
        <Prose>{r.orientative_direction}</Prose>
      </CalloutBox>

      <div>
        <SectionTitle>Sezioni A–E</SectionTitle>
        <div className="space-y-3">
          {r.sections.map((s) => <OutputTipoSectionCard key={s.section_id} s={s} />)}
        </div>
      </div>

      <details className="rounded-md border border-slate-200 bg-slate-50">
        <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100">
          Riferimento al dispositivo
        </summary>
        <div className="px-3 pb-3 pt-1">
          <KeyValue label="Sintesi" value={<Prose>{r.dispositivo_ref.device_synthesis}</Prose>} />
          <KeyValue
            label="Funzione"
            value={<Chip color={FUNCTION_TYPE_COLOR[r.dispositivo_ref.function_type] ?? 'slate'}>{r.dispositivo_ref.function_type}</Chip>}
          />
          <KeyValue label="Tempo reale" value={r.dispositivo_ref.real_time} />
          <KeyValue label="Indicatore di risonanza" value={<Prose>{r.dispositivo_ref.resonance_indicator}</Prose>} />
        </div>
      </details>

      {r.operator_note && (
        <CalloutBox title="Nota dell'operatore" tone="amber"><Prose>{r.operator_note}</Prose></CalloutBox>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// dispatcher
// ───────────────────────────────────────────────────────────────

export interface F3OutputViewerProps {
  stepId: string;
  data: unknown;
}

const F3_VIEWER_STEPS = ['1', '2', '3', '4', '5'];

export default function F3OutputViewer({ stepId, data }: F3OutputViewerProps) {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;

  switch (stepId) {
    case 'f3_step_1': return <Step1Viewer data={d as Step1Data} />;
    case 'f3_step_2': return <Step2Viewer data={d as Step2Data} />;
    case 'f3_step_3': return <Step3Viewer data={d as Step3Data} />;
    case 'f3_step_4': return <Step4Viewer data={d as Step4Data} />;
    case 'f3_step_5': return <Step5Viewer data={d as Step5Data} />;
    default: return null;
  }
}

export function hasF3Viewer(stepId: string): boolean {
  if (!stepId.startsWith('f3_step_')) return false;
  return F3_VIEWER_STEPS.includes(stepId.slice('f3_step_'.length));
}
