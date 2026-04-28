// Test unit per le funzioni pure di pipelineMappers.ts
// Esecuzione: node --test --experimental-strip-types server/src/services/__tests__/pipelineMappers.test.ts

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filesFromStepStates,
  pickCanonicalDevice,
  sortF3Steps,
  mapRicercaContext,
  mapTemaContext,
} from '../pipelineMappers.ts';

// ---------- filesFromStepStates ----------

test('filesFromStepStates: ritorna mappa step→file solo per step con output_file', () => {
  const result = filesFromStepStates({
    f3_step_1: { status: 'verificato', output_file: 'temi/x/lettura-v1.json' },
    f3_step_2: { status: 'completato', output_file: null },
    f3_step_3: { status: 'in_esecuzione', output_file: undefined },
    f3_step_4: { status: 'verificato', output_file: 'temi/x/indist-v1.json' },
  });
  assert.deepEqual(result, {
    f3_step_1: 'temi/x/lettura-v1.json',
    f3_step_4: 'temi/x/indist-v1.json',
  });
});

test('filesFromStepStates: ritorna {} per step_states null/undefined/{}', () => {
  assert.deepEqual(filesFromStepStates(null), {});
  assert.deepEqual(filesFromStepStates(undefined), {});
  assert.deepEqual(filesFromStepStates({}), {});
});

// ---------- pickCanonicalDevice ----------

test('pickCanonicalDevice: priorità step 9 (shape: device)', () => {
  const result = pickCanonicalDevice({
    f3_step_1: 'a.json',
    f3_step_3: 'b.json',
    f3_step_9: 'c.json',
  });
  assert.deepEqual(result, { file: 'c.json', shape: 'device' });
});

test('pickCanonicalDevice: fallback step 3 (shape: corrected_device) se step 9 mancante', () => {
  const result = pickCanonicalDevice({ f3_step_1: 'a.json', f3_step_3: 'b.json' });
  assert.deepEqual(result, { file: 'b.json', shape: 'corrected_device' });
});

test('pickCanonicalDevice: fallback step 1 (shape: result_0) se 9 e 3 mancano', () => {
  const result = pickCanonicalDevice({ f3_step_1: 'a.json' });
  assert.deepEqual(result, { file: 'a.json', shape: 'result_0' });
});

test('pickCanonicalDevice: null se nessun candidato presente', () => {
  assert.equal(pickCanonicalDevice({}), null);
  assert.equal(pickCanonicalDevice({ f3_step_2: 'x.json' }), null);
});

// ---------- sortF3Steps ----------

test('sortF3Steps: F2 prima di F3', () => {
  const result = sortF3Steps(['f3_step_1', 'f2_step_5', 'f3_step_2', 'f2_step_1']);
  assert.deepEqual(result, ['f2_step_1', 'f2_step_5', 'f3_step_1', 'f3_step_2']);
});

test('sortF3Steps: ordine numerico crescente, 6b dopo 6, 6c dopo 6b', () => {
  const result = sortF3Steps([
    'f3_step_10', 'f3_step_2', 'f3_step_6c', 'f3_step_6', 'f3_step_6b', 'f3_step_1',
  ]);
  assert.deepEqual(result, [
    'f3_step_1', 'f3_step_2', 'f3_step_6', 'f3_step_6b', 'f3_step_6c', 'f3_step_10',
  ]);
});

test('sortF3Steps: input non riconosciuti scendono in localeCompare', () => {
  const result = sortF3Steps(['zeta', 'alpha', 'f3_step_1']);
  // i due fuori-formato finiscono in posizione stabile via localeCompare
  assert.equal(result.includes('alpha'), true);
  assert.equal(result.includes('zeta'), true);
  assert.equal(result.includes('f3_step_1'), true);
});

// ---------- mapRicercaContext ----------

test('mapRicercaContext: mappa context ricerca, steps_completed dai files', () => {
  const result = mapRicercaContext({
    context_id: 'ricerca-99-test',
    label: 'Test',
    step_states: {
      f2_step_1: { status: 'verificato', output_file: 'ricerche/r/td-v1.json' },
      f2_step_3: { status: 'verificato', output_file: 'ricerche/r/tv-v1.json' },
      f2_step_2: { status: 'in_esecuzione', output_file: null },
    },
  });
  assert.deepEqual(result, {
    id: 'ricerca-99-test',
    label: 'Test',
    steps_completed: ['f2_step_1', 'f2_step_3'],
    files: {
      f2_step_1: 'ricerche/r/td-v1.json',
      f2_step_3: 'ricerche/r/tv-v1.json',
    },
  });
});

// ---------- mapTemaContext ----------

test('mapTemaContext: tema completo con dispositivo + skipped + external inputs', () => {
  const result = mapTemaContext(
    {
      context_id: 'pointing',
      label: 'Pointing',
      theme_id: 'tema_01',
      ricerca_origine: 'ricerca-02',
      dispositivo_sorgente: null,
      step_states: {
        f3_step_1: { status: 'verificato', output_file: 'temi/pointing/lettura-v1.json' },
        f3_step_9: { status: 'verificato', output_file: 'temi/pointing/dispositivo-v1.json' },
        f3_step_8: { status: 'saltato', output_file: null },
      },
      robustezza: 'alta',
      correzioni_residue: 0,
      has_revisioni: true,
    },
    [{ step_id: 'f3_step_8', skip_reason: 'specializzazione di dominio' }],
    [{ step_id: 'f3_step_7', label: 'Contesto clinico', file_path: 'inputs/temi/pointing/c.json' }],
  );

  assert.equal(result.id, 'pointing');
  assert.equal(result.theme_id, 'tema_01');
  assert.equal(result.ricerca_origine, 'ricerca-02');
  assert.equal(result.dispositivo_sorgente, null);
  assert.equal(result.robustezza, 'alta');
  assert.equal(result.has_revisioni, true);
  assert.equal(result.revisioni_file, 'temi/pointing/revisioni.md');
  assert.deepEqual(result.canonical_device, { file: 'temi/pointing/dispositivo-v1.json', shape: 'device' });
  // steps_completed esclude i saltati (questi vivono in steps_skipped)
  assert.deepEqual(result.steps_completed, ['f3_step_1', 'f3_step_9']);
  assert.deepEqual(result.steps_skipped, [{ step: 'f3_step_8', reason: 'specializzazione di dominio' }]);
  assert.deepEqual(result.external_inputs, [{
    step: 'f3_step_7',
    file: 'inputs/temi/pointing/c.json',
    type: 'esterno_obbligatorio',
    label: 'Contesto clinico',
  }]);
});

test('mapTemaContext: dispositivo_sorgente popolato per tema derivato', () => {
  const result = mapTemaContext(
    {
      context_id: 'richiesta-aiuto-clinico',
      label: 'Richiesta aiuto clinico',
      theme_id: 'tema_richiesta',
      dispositivo_sorgente: {
        tema_id: 'pointing',
        file: 'temi/pointing/correzione-strutturale-v1.json',
        device_id: 'dev-pointing-corrected',
      },
      step_states: {},
      has_revisioni: false,
    },
    [],
    [],
  );
  assert.deepEqual(result.dispositivo_sorgente, {
    tema_id: 'pointing',
    file: 'temi/pointing/correzione-strutturale-v1.json',
    device_id: 'dev-pointing-corrected',
  });
  assert.equal(result.revisioni_file, null);
  assert.equal(result.canonical_device, null);
  assert.equal(result.has_revisioni, false);
});

test('mapTemaContext: campi opzionali assenti → default sensibili', () => {
  const result = mapTemaContext(
    { context_id: 'minimal', label: 'Minimal', step_states: {} },
    [],
    [],
  );
  assert.equal(result.theme_id, null);
  assert.equal(result.ricerca_origine, null);
  assert.equal(result.dispositivo_sorgente, null);
  assert.equal(result.robustezza, null);
  assert.equal(result.correzioni_residue, 0);
  assert.equal(result.has_revisioni, false);
  assert.equal(result.revisioni_file, null);
  assert.deepEqual(result.steps_completed, []);
  assert.deepEqual(result.files, {});
});
