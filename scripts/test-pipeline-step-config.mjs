#!/usr/bin/env node
// Test di coerenza per server/pipeline-step-config.json
// Esegue con: node --test scripts/test-pipeline-step-config.mjs
//          o: npm run test:pipeline-config

import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = path.join(REPO_ROOT, 'server', 'pipeline-step-config.json');

// Marker speciali ammessi nel campo "step" che NON sono step reali del grafo.
const VIRTUAL_STEP_REFS = new Set(['f3_step_3_or_6c']);
// Marker speciali ammessi in "blocks" che NON sono step reali (sono punti di decisione umana).
const VIRTUAL_BLOCK_TARGETS = new Set(['[human_decision] → f3_step_1']);

const config = JSON.parse(await fs.readFile(CONFIG_PATH, 'utf8'));

const steps = config.steps;
const stepIds = new Set(steps.map((s) => s.id));

function collectPipelineInputs(step) {
  // Step normali → inputs_pipeline. Step 9 → inputs_pipeline_standard + inputs_pipeline_skip_8.
  const buckets = [
    step.inputs_pipeline,
    step.inputs_pipeline_standard,
    step.inputs_pipeline_skip_8,
  ].filter(Array.isArray);
  return buckets.flat();
}

test('config: parses correctly and has steps[]', () => {
  assert.ok(Array.isArray(steps), 'steps deve essere un array');
  assert.ok(steps.length > 0, 'steps non deve essere vuoto');
});

test('step.id: unico in tutta la config', () => {
  const seen = new Map();
  for (const s of steps) {
    if (seen.has(s.id)) {
      assert.fail(`step id duplicato: ${s.id}`);
    }
    seen.set(s.id, true);
  }
});

test('step: chiavi obbligatorie presenti (id, label, phase, output_prefix)', () => {
  for (const s of steps) {
    assert.ok(s.id, `step senza id`);
    assert.ok(s.label, `step ${s.id} senza label`);
    assert.ok(s.phase === 'F2' || s.phase === 'F3', `step ${s.id} phase non valida: ${s.phase}`);
    assert.ok(s.output_prefix, `step ${s.id} senza output_prefix`);
  }
});

test('inputs_pipeline: ogni step referenziato esiste o è un marker virtuale', () => {
  for (const s of steps) {
    for (const inp of collectPipelineInputs(s)) {
      assert.ok(inp.step, `step ${s.id}: input pipeline senza campo "step"`);
      const isReal = stepIds.has(inp.step);
      const isVirtual = VIRTUAL_STEP_REFS.has(inp.step);
      assert.ok(
        isReal || isVirtual,
        `step ${s.id}: input pipeline punta a step inesistente "${inp.step}"`,
      );
    }
  }
});

test('inputs_pipeline: requires_verifica solo su step di provenienza con verifica:true', () => {
  for (const s of steps) {
    for (const inp of collectPipelineInputs(s)) {
      if (!inp.requires_verifica) continue;
      if (VIRTUAL_STEP_REFS.has(inp.step)) continue; // marker virtuali: skip
      const upstream = steps.find((x) => x.id === inp.step);
      assert.ok(upstream, `step ${s.id}: upstream "${inp.step}" non trovato`);
      assert.equal(
        upstream.verifica,
        true,
        `step ${s.id}: requires_verifica:true su "${inp.step}" che però ha verifica:false`,
      );
    }
  }
});

test('blocks: ogni target esiste o è un marker virtuale', () => {
  for (const s of steps) {
    if (!Array.isArray(s.blocks)) continue;
    for (const target of s.blocks) {
      const isReal = stepIds.has(target);
      const isVirtual = VIRTUAL_BLOCK_TARGETS.has(target);
      assert.ok(
        isReal || isVirtual,
        `step ${s.id}: blocks contiene target sconosciuto "${target}"`,
      );
    }
  }
});

test('inputs_esterni: id unico per step', () => {
  for (const s of steps) {
    if (!Array.isArray(s.inputs_esterni)) continue;
    const ids = s.inputs_esterni.map((e) => e.id);
    const unique = new Set(ids);
    assert.equal(unique.size, ids.length, `step ${s.id}: inputs_esterni con id duplicato`);
  }
});

test('inputs_esterni: type è uno dei valori ammessi', () => {
  const allowed = new Set(['esterno_obbligatorio', 'esterno_facoltativo']);
  for (const s of steps) {
    if (!Array.isArray(s.inputs_esterni)) continue;
    for (const e of s.inputs_esterni) {
      assert.ok(
        allowed.has(e.type),
        `step ${s.id}: inputs_esterni "${e.id}" ha type non valido "${e.type}"`,
      );
    }
  }
});

test('grafo: nessun ciclo nelle dipendenze pipeline (DFS)', () => {
  // Costruisce adjacency: stepId -> step ids che dipendono da stepId (cioè lo hanno in inputs_pipeline)
  // Equivalente a: arco diretto upstream -> downstream
  const adj = new Map();
  for (const s of steps) adj.set(s.id, []);

  for (const s of steps) {
    for (const inp of collectPipelineInputs(s)) {
      if (VIRTUAL_STEP_REFS.has(inp.step)) continue;
      if (!adj.has(inp.step)) continue;
      adj.get(inp.step).push(s.id);
    }
  }

  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map();
  for (const id of adj.keys()) color.set(id, WHITE);

  function visit(node, stack) {
    color.set(node, GRAY);
    for (const next of adj.get(node) ?? []) {
      const c = color.get(next);
      if (c === GRAY) {
        assert.fail(`ciclo rilevato: ${[...stack, node, next].join(' → ')}`);
      }
      if (c === WHITE) visit(next, [...stack, node]);
    }
    color.set(node, BLACK);
  }

  for (const id of adj.keys()) {
    if (color.get(id) === WHITE) visit(id, []);
  }
});

test('can_skip:true ⇒ skip_condition presente', () => {
  for (const s of steps) {
    if (!s.can_skip) continue;
    assert.ok(
      typeof s.skip_condition === 'string' && s.skip_condition.length > 0,
      `step ${s.id}: can_skip:true ma manca skip_condition`,
    );
  }
});

test('output_path_template: contiene il segmento di fase corretto', () => {
  for (const s of steps) {
    assert.ok(s.output_path_template, `step ${s.id}: output_path_template mancante`);
    if (s.phase === 'F2') {
      assert.ok(
        s.output_path_template.startsWith('ricerche/'),
        `step ${s.id}: F2 dovrebbe scrivere sotto ricerche/, trovato "${s.output_path_template}"`,
      );
    } else if (s.phase === 'F3') {
      assert.ok(
        s.output_path_template.startsWith('temi/'),
        `step ${s.id}: F3 dovrebbe scrivere sotto temi/, trovato "${s.output_path_template}"`,
      );
    }
  }
});

test('overrides (step 6b): contiene esattamente i tre campi noti', () => {
  const s6b = steps.find((x) => x.id === 'f3_step_6b');
  assert.ok(s6b, 'step f3_step_6b non trovato');
  assert.deepEqual(
    [...s6b.overrides].sort(),
    ['non_classifiability_rules', 'observability_requirements', 'operative_proxies'],
    'step 6b overrides non corrispondono allo override atteso del proxy nel device finale',
  );
});
