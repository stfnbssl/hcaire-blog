// Test unit per evaluateStepEnablement (D4 §9).
// Esecuzione: node --no-warnings --test --experimental-strip-types server/src/services/__tests__/stepEnablement.test.ts

import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateStepEnablement } from '../stepEnablement.ts';
import type { StepConfig } from '../stepConfigService.ts';

// Helper: costruisce uno step config minimo per i test (no I/O).
function step(id: string, opts: Partial<StepConfig> = {}): StepConfig {
  return {
    id,
    label: id,
    phase: id.startsWith('f2') ? 'F2' : 'F3',
    output_prefix: id,
    output_path_template: `temi/{tema_id}/${id}.json`,
    verifica: false,
    can_skip: false,
    ...opts,
  };
}

const NO_INPUTS = new Set<string>();

// ---------- dipendenze pipeline ----------

test('enablement: nessuna dipendenza, nessun input → enabled', () => {
  const cfg = step('f2_step_1');
  const result = evaluateStepEnablement({}, cfg, NO_INPUTS);
  assert.equal(result.enabled, true);
  assert.deepEqual(result.blocking_reasons, []);
});

test('enablement: dipendenza required completato → enabled', () => {
  const cfg = step('f3_step_3', {
    inputs_pipeline: [
      { step: 'f3_step_1', role: 'lettura', required: true },
      { step: 'f3_step_2', role: 'stress', required: true },
    ],
  });
  const ctx = {
    step_states: {
      f3_step_1: { status: 'completato' as const },
      f3_step_2: { status: 'completato' as const },
    },
  };
  assert.equal(evaluateStepEnablement(ctx, cfg, NO_INPUTS).enabled, true);
});

test('enablement: dipendenza required mancante → blocked, ragione dependency', () => {
  const cfg = step('f3_step_3', {
    inputs_pipeline: [{ step: 'f3_step_1', role: 'lettura', required: true }],
  });
  const result = evaluateStepEnablement({}, cfg, NO_INPUTS);
  assert.equal(result.enabled, false);
  assert.equal(result.blocking_reasons.length, 1);
  assert.deepEqual(result.blocking_reasons[0], {
    type: 'dependency',
    step_id: 'f3_step_1',
    required_status: 'completato',
    current_status: 'non_avviato',
  });
});

test('enablement: dipendenza required, status fallito → blocked', () => {
  const cfg = step('f3_step_3', {
    inputs_pipeline: [{ step: 'f3_step_1', role: 'lettura', required: true }],
  });
  const ctx = { step_states: { f3_step_1: { status: 'fallito' as const } } };
  const result = evaluateStepEnablement(ctx, cfg, NO_INPUTS);
  assert.equal(result.enabled, false);
  assert.equal(result.blocking_reasons[0].type, 'dependency');
});

test('enablement: requires_verifica:true accetta solo verificato/saltato', () => {
  const cfg = step('f3_step_5', {
    inputs_pipeline: [
      { step: 'f3_step_4', role: 'indist', required: true, requires_verifica: true },
    ],
  });
  // status completato NON basta perché serve verificato
  const ctxCompletato = { step_states: { f3_step_4: { status: 'completato' as const } } };
  const r1 = evaluateStepEnablement(ctxCompletato, cfg, NO_INPUTS);
  assert.equal(r1.enabled, false);
  assert.equal(r1.blocking_reasons[0].type, 'dependency');
  assert.equal((r1.blocking_reasons[0] as { required_status: string }).required_status, 'verificato');

  // status verificato basta
  const ctxVerificato = { step_states: { f3_step_4: { status: 'verificato' as const } } };
  assert.equal(evaluateStepEnablement(ctxVerificato, cfg, NO_INPUTS).enabled, true);
});

test('enablement: dipendenza required:false ignorata', () => {
  const cfg = step('f3_step_X', {
    inputs_pipeline: [{ step: 'f3_step_Y', role: 'opt', required: false }],
  });
  assert.equal(evaluateStepEnablement({}, cfg, NO_INPUTS).enabled, true);
});

test('enablement: status saltato accettato come dipendenza soddisfatta', () => {
  // Caso reale: f3_step_9 dipende da f3_step_8 (verificato), ma se step 8 è saltato accetta lo skip.
  const cfg = step('f3_step_X', {
    inputs_pipeline: [{ step: 'f3_step_8', role: 'adapt', required: true, requires_verifica: true }],
  });
  const ctx = { step_states: { f3_step_8: { status: 'saltato' as const } } };
  assert.equal(evaluateStepEnablement(ctx, cfg, NO_INPUTS).enabled, true);
});

// ---------- biforcazione step 9 ----------

test('enablement: f3_step_9 con step 8 verificato → usa inputs_pipeline_standard', () => {
  const cfg = step('f3_step_9', {
    inputs_pipeline_standard: [
      { step: 'f3_step_6b', role: 'proxy-b', required: true },
      { step: 'f3_step_8', role: 'adapt', required: true, requires_verifica: true },
    ],
    inputs_pipeline_skip_8: [
      { step: 'f3_step_3_or_6c', role: 'corr', required: true },
      { step: 'f3_step_6b', role: 'proxy-b', required: true },
      { step: 'f3_step_7', role: 'trasf', required: true },
    ],
  });
  const ctx = {
    step_states: {
      f3_step_8: { status: 'verificato' as const },
      f3_step_6b: { status: 'completato' as const },
    },
  };
  // standard: 8 verificato + 6b completato → enabled
  assert.equal(evaluateStepEnablement(ctx, cfg, NO_INPUTS).enabled, true);
});

test('enablement: f3_step_9 con step 8 saltato → usa inputs_pipeline_skip_8', () => {
  const cfg = step('f3_step_9', {
    inputs_pipeline_standard: [
      { step: 'f3_step_8', role: 'adapt', required: true, requires_verifica: true },
    ],
    inputs_pipeline_skip_8: [
      { step: 'f3_step_3_or_6c', role: 'corr', required: true },
      { step: 'f3_step_6b', role: 'proxy-b', required: true },
      { step: 'f3_step_7', role: 'trasf', required: true },
    ],
  });
  const ctx = {
    step_states: {
      f3_step_8: { status: 'saltato' as const },
      f3_step_3: { status: 'completato' as const },
      f3_step_6b: { status: 'completato' as const },
      f3_step_7: { status: 'completato' as const },
    },
  };
  // skip_8: 3 + 6b + 7 tutti completati → enabled
  assert.equal(evaluateStepEnablement(ctx, cfg, NO_INPUTS).enabled, true);
});

// ---------- marker virtuale f3_step_3_or_6c ----------

test('enablement: f3_step_3_or_6c risolve a f3_step_6c se disponibile', () => {
  const cfg = step('f3_step_7', {
    inputs_pipeline: [{ step: 'f3_step_3_or_6c', role: 'corr', required: true }],
  });
  // 6c verificato → ok, anche se 3 non c'è
  const ctx6c = { step_states: { f3_step_6c: { status: 'verificato' as const } } };
  assert.equal(evaluateStepEnablement(ctx6c, cfg, NO_INPUTS).enabled, true);

  // solo 3 → ok (fallback)
  const ctx3 = { step_states: { f3_step_3: { status: 'completato' as const } } };
  assert.equal(evaluateStepEnablement(ctx3, cfg, NO_INPUTS).enabled, true);

  // nessuno → blocked
  const r = evaluateStepEnablement({}, cfg, NO_INPUTS);
  assert.equal(r.enabled, false);
  assert.equal((r.blocking_reasons[0] as { step_id: string }).step_id, 'f3_step_3_or_6c');
});

// ---------- input esterni ----------

test('enablement: input esterno obbligatorio mancante → blocked, ragione missing_input', () => {
  const cfg = step('f3_step_7', {
    inputs_pipeline: [{ step: 'f3_step_3', role: 'corr', required: true }],
    inputs_esterni: [
      { id: 'contesto_ambito', label: 'Contesto/ambito target', type: 'esterno_obbligatorio' },
    ],
  });
  const ctx = { step_states: { f3_step_3: { status: 'completato' as const } } };
  const r = evaluateStepEnablement(ctx, cfg, NO_INPUTS);
  assert.equal(r.enabled, false);
  assert.equal(r.blocking_reasons.length, 1);
  assert.deepEqual(r.blocking_reasons[0], {
    type: 'missing_input',
    input_id: 'contesto_ambito',
    label: 'Contesto/ambito target',
  });
});

test('enablement: input esterno obbligatorio fornito → enabled', () => {
  const cfg = step('f3_step_7', {
    inputs_esterni: [
      { id: 'contesto_ambito', label: 'Contesto/ambito target', type: 'esterno_obbligatorio' },
    ],
  });
  const provided = new Set(['contesto_ambito']);
  assert.equal(evaluateStepEnablement({}, cfg, provided).enabled, true);
});

test('enablement: input esterno facoltativo non blocca anche se mancante', () => {
  const cfg = step('f3_step_6', {
    inputs_esterni: [
      { id: 'severita_test', label: 'Severità', type: 'esterno_facoltativo' },
    ],
  });
  assert.equal(evaluateStepEnablement({}, cfg, NO_INPUTS).enabled, true);
});

// ---------- pending_decision ----------

test('enablement: pending_decision f2_to_f3 blocca f3_step_1', () => {
  const cfg = step('f3_step_1');
  const ctx = { pending_decision: { type: 'f2_to_f3_tema_selection' as const } };
  const r = evaluateStepEnablement(ctx, cfg, NO_INPUTS);
  assert.equal(r.enabled, false);
  assert.deepEqual(r.blocking_reasons[0], {
    type: 'pending_decision',
    decision_type: 'f2_to_f3_tema_selection',
  });
});

test('enablement: pending_decision step7 blocca f3_step_7', () => {
  const cfg = step('f3_step_7');
  const ctx = { pending_decision: { type: 'step7_context_selection' as const } };
  const r = evaluateStepEnablement(ctx, cfg, NO_INPUTS);
  assert.equal(r.enabled, false);
  assert.equal(r.blocking_reasons[0].type, 'pending_decision');
});

test('enablement: pending_decision non blocca step non interessati', () => {
  const cfg = step('f3_step_3');
  const ctx = { pending_decision: { type: 'f2_to_f3_tema_selection' as const } };
  // pending_decision di tipo F2→F3 non blocca step F3 interni come step 3
  assert.equal(evaluateStepEnablement(ctx, cfg, NO_INPUTS).enabled, true);
});

// ---------- accumulo di motivi ----------

test('enablement: dipendenze + input mancanti accumulati come blocking_reasons', () => {
  const cfg = step('f3_step_7', {
    inputs_pipeline: [
      { step: 'f3_step_6b', role: 'proxy-b', required: true, requires_verifica: true },
    ],
    inputs_esterni: [
      { id: 'contesto_ambito', label: 'Contesto', type: 'esterno_obbligatorio' },
    ],
  });
  const r = evaluateStepEnablement({}, cfg, NO_INPUTS);
  assert.equal(r.enabled, false);
  assert.equal(r.blocking_reasons.length, 2);
  const types = r.blocking_reasons.map((b) => b.type).sort();
  assert.deepEqual(types, ['dependency', 'missing_input']);
});
