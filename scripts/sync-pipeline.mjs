#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const SOURCE_ROOT =
  process.env.PIPELINE_SOURCE ??
  'C:/Users/nnmrd/Documents/Claude/Projects/Sviluppo Bambino/output/produzioni';

const INPUT_ROOT =
  process.env.PIPELINE_INPUT ??
  'C:/Users/nnmrd/Documents/Claude/Projects/Sviluppo Bambino/input/produzioni';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET_ROOT = path.join(REPO_ROOT, 'client', 'public', 'pipeline');
const INDEX_PATH = path.join(TARGET_ROOT, 'pipeline-index.json');
const SERVER_ENV_PATH = path.join(REPO_ROOT, 'server', '.env');

// CLI flags
const CLI_NO_SEED = process.argv.includes('--no-seed');
const CLI_RESET_SEED = process.argv.includes('--reset-seed');

// ---------- file classification ----------

const F2_PATTERNS = [
  { step: 'f2_step_1', prefix: 'theme-discovery' },
  { step: 'f2_step_2', prefix: 'theme-relevance' },
  { step: 'f2_step_3', prefix: 'theme-verification' },
  { step: 'f2_step_4', prefix: 'theme-matrix' },
  { step: 'f2_step_5', prefix: 'output-family' },
];

const F3_PATTERNS = [
  { step: 'f3_step_1',  prefix: 'lettura-configurazionale' },
  { step: 'f3_step_3',  prefix: 'correzione-strutturale' },
  { step: 'f3_step_4',  prefix: 'indistinguibility-test' },
  { step: 'f3_step_5',  prefix: 'audit' },
  { step: 'f3_step_6b', prefix: 'stabilizzazione-proxy', variant: 'b' },
  { step: 'f3_step_6',  prefix: 'stabilizzazione-proxy' },
  { step: 'f3_step_7',  prefix: 'trasferibilità' },
  { step: 'f3_step_8',  prefix: 'adattamento-strutturale' },
  { step: 'f3_step_10', prefix: 'stress-test-dispositivo' },
  { step: 'f3_step_9',  prefix: 'dispositivo' },
  { step: 'f3_step_2',  prefix: 'stress-test' },
];

const ALL_F3_STEPS = [
  'f3_step_1', 'f3_step_2', 'f3_step_3', 'f3_step_4', 'f3_step_5',
  'f3_step_6', 'f3_step_6b', 'f3_step_7', 'f3_step_8', 'f3_step_9', 'f3_step_10',
];

function parseVersion(filename) {
  const m = filename.match(/-v(\d+)(b)?\.json$/i);
  if (!m) return null;
  return { major: parseInt(m[1], 10), variant: m[2] ? 'b' : '' };
}

function classifyF3ByName(filename) {
  for (const p of F3_PATTERNS) {
    if (!filename.startsWith(p.prefix + '-') && !filename.startsWith(p.prefix + '.')) continue;
    const version = parseVersion(filename);
    if (!version) continue;
    if (p.variant === 'b' && version.variant !== 'b') continue;
    if (!p.variant && version.variant === 'b') continue;
    return { step: p.step, version };
  }
  return null;
}

async function classifyF3(folder, filename) {
  const version = parseVersion(filename);
  if (!version) return null;
  try {
    const raw = await fs.readFile(path.join(folder, filename), 'utf8');
    const json = JSON.parse(raw);
    const step = typeof json.step === 'string' ? json.step : null;
    if (step && /^f3_step_\d+b?$/.test(step)) {
      return { step: step === 'f3_step_6' && version.variant === 'b' ? 'f3_step_6b' : step, version };
    }
  } catch {
    // fall through to filename-based
  }
  return classifyF3ByName(filename);
}

async function classifyF2(_folder, filename) {
  for (const p of F2_PATTERNS) {
    if (!filename.startsWith(p.prefix + '-')) continue;
    const version = parseVersion(filename);
    if (!version) continue;
    return { step: p.step, version };
  }
  return null;
}

// ---------- label helpers ----------

function prettifyLabel(id, stripPrefix = null) {
  let s = id;
  if (stripPrefix) s = s.replace(stripPrefix, '');
  s = s.replace(/[-_]+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------- scan ----------

async function scanFolder(folder, classify) {
  const entries = await fs.readdir(folder, { withFileTypes: true });
  const candidates = new Map();
  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith('.json')) continue;
    const c = await classify(folder, e.name);
    if (!c) continue;
    const prev = candidates.get(c.step);
    if (!prev || c.version.major > prev.version.major) {
      candidates.set(c.step, { filename: e.name, version: c.version });
    }
  }
  return candidates;
}

async function readJson(absPath) {
  try {
    return JSON.parse(await fs.readFile(absPath, 'utf8'));
  } catch {
    return null;
  }
}

// ---------- F2 scan ----------

async function scanRicerche() {
  const root = path.join(SOURCE_ROOT, 'ricerche');
  const dirs = await fs.readdir(root, { withFileTypes: true }).catch(() => []);
  const out = [];
  // theme_id -> ricerca_id map, built from step 2+ files
  const themeToRicerca = new Map();
  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const id = d.name;
    const candidates = await scanFolder(path.join(root, id), classifyF2);
    if (candidates.size === 0) continue;
    const files = {};
    for (const [step, { filename }] of candidates) {
      files[step] = `ricerche/${id}/${filename}`;
    }
    // derive theme_ids by scanning theme-relevance (step 2) if present
    const relFile = files.f2_step_2;
    if (relFile) {
      const json = await readJson(path.join(SOURCE_ROOT, relFile));
      if (json?.results && Array.isArray(json.results)) {
        for (const r of json.results) {
          if (typeof r.theme_id === 'string') {
            themeToRicerca.set(r.theme_id, id);
          }
        }
      }
    }
    out.push({
      id,
      label: prettifyLabel(id, /^ricerca-\d+-/),
      steps_completed: [...candidates.keys()].sort(),
      files,
    });
  }
  return { ricerche: out, themeToRicerca };
}

// ---------- F3 scan (two-pass) ----------

function pickCanonicalDevice(files) {
  if (files.f3_step_9) return { file: files.f3_step_9, shape: 'device' };
  if (files.f3_step_3) return { file: files.f3_step_3, shape: 'corrected_device' };
  if (files.f3_step_1) return { file: files.f3_step_1, shape: 'result_0' };
  return null;
}

// Extract device_ids present in a step file (varies by step shape).
function extractDeviceIds(json) {
  if (!json || typeof json !== 'object') return [];
  const ids = [];
  if (json.device && typeof json.device.device_id === 'string') ids.push(json.device.device_id);
  if (json.corrected_device && typeof json.corrected_device.device_id === 'string') ids.push(json.corrected_device.device_id);
  if (Array.isArray(json.results)) {
    for (const r of json.results) {
      if (r && typeof r.device_id === 'string') ids.push(r.device_id);
    }
  }
  if (typeof json.device_id === 'string') ids.push(json.device_id);
  if (typeof json.corrected_device_id === 'string') ids.push(json.corrected_device_id);
  return ids;
}

function extractThemeId(json) {
  if (!json) return null;
  if (typeof json.theme_id === 'string') return json.theme_id;
  if (json.device && typeof json.device.theme_id === 'string') return json.device.theme_id;
  if (json.corrected_device && typeof json.corrected_device.theme_id === 'string') return json.corrected_device.theme_id;
  if (Array.isArray(json.results) && json.results[0] && typeof json.results[0].theme_id === 'string') return json.results[0].theme_id;
  return null;
}

function countResidualCorrections(json) {
  if (!json || !Array.isArray(json.corrections_log)) return 0;
  return json.corrections_log.filter((c) => c?.correction_type && c.correction_type !== 'applicata').length;
}

// ---------- revisioni.md parsing ----------

function parseSkippedFromMarkdown(md) {
  if (!md) return [];
  const out = [];
  // Patterns to match:
  // "**Step-8 saltato**: ..."
  // "**Step 8 saltato**: ..."
  // "**step-8 saltato**: ..."
  const re = /\*\*Step[-\s]?(\d+b?)\s+saltato\*\*:?\s*([^\n\r]+)/gi;
  let m;
  while ((m = re.exec(md)) !== null) {
    const stepNum = m[1].toLowerCase();
    out.push({
      step: `f3_step_${stepNum}`,
      reason: m[2].trim(),
    });
  }
  return out;
}

// ---------- external inputs ----------

async function scanExternalInputs(temaId) {
  const folder = path.join(INPUT_ROOT, 'temi', temaId);
  try {
    const entries = await fs.readdir(folder, { withFileTypes: true });
    const out = [];
    for (const e of entries) {
      if (!e.isFile() || !e.name.endsWith('.json')) continue;
      // Match "f3-step-N-*.json" or "f3_step_N-*.json"
      const m = e.name.match(/^f3[-_]step[-_](\d+b?)[-_]([^.]+)\.json$/i);
      if (!m) continue;
      out.push({
        step: `f3_step_${m[1].toLowerCase()}`,
        file: `inputs/temi/${temaId}/${e.name}`,
        type: 'esterno_obbligatorio',
        label: prettifyLabel(m[2]),
      });
    }
    return out;
  } catch {
    return [];
  }
}

// ---------- F3 temi main ----------

async function scanTemi({ themeToRicerca }) {
  const root = path.join(SOURCE_ROOT, 'temi');
  const dirs = await fs.readdir(root, { withFileTypes: true }).catch(() => []);

  // Pass 1: discover files and basic metadata per tema.
  const temi = [];
  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const id = d.name;
    const candidates = await scanFolder(path.join(root, id), classifyF3);
    if (candidates.size === 0) continue;
    const files = {};
    for (const [step, { filename }] of candidates) {
      files[step] = `temi/${id}/${filename}`;
    }
    temi.push({
      id,
      label: prettifyLabel(id),
      steps_completed: [...candidates.keys()].sort((a, b) => {
        const an = parseInt(a.replace(/^f3_step_/, '').replace('b', '.5'), 10) || 0;
        const bn = parseInt(b.replace(/^f3_step_/, '').replace('b', '.5'), 10) || 0;
        return an - bn;
      }),
      files,
      canonical_device: pickCanonicalDevice(files),
    });
  }

  // Pass 2: build device_id -> {tema_id, file} lookup by reading every F3 file.
  const deviceLookup = new Map(); // device_id -> { tema_id, file }
  for (const t of temi) {
    for (const [_step, rel] of Object.entries(t.files)) {
      const json = await readJson(path.join(SOURCE_ROOT, rel));
      for (const did of extractDeviceIds(json)) {
        if (!deviceLookup.has(did)) {
          deviceLookup.set(did, { tema_id: t.id, file: rel });
        }
      }
    }
  }

  // Pass 3: derive derivations per tema.
  const enriched = [];
  for (const t of temi) {
    // theme_id from any device file
    let themeId = null;
    for (const step of ['f3_step_9', 'f3_step_3', 'f3_step_1', 'f3_step_7']) {
      if (!t.files[step]) continue;
      const json = await readJson(path.join(SOURCE_ROOT, t.files[step]));
      themeId = extractThemeId(json);
      if (themeId) break;
    }
    const ricercaOrigine = themeId ? themeToRicerca.get(themeId) ?? null : null;

    // dispositivo_sorgente from step 7 source_device_id
    let dispositivoSorgente = null;
    if (t.files.f3_step_7) {
      const json = await readJson(path.join(SOURCE_ROOT, t.files.f3_step_7));
      const srcId = json?.source_device_id ?? null;
      if (srcId) {
        const found = deviceLookup.get(srcId);
        if (found && found.tema_id !== t.id) {
          dispositivoSorgente = { tema_id: found.tema_id, file: found.file, device_id: srcId };
        }
      }
    }

    // correzioni_residue (sum across step 3, step 6, step 8)
    let correzioniResidue = 0;
    for (const step of ['f3_step_3', 'f3_step_6', 'f3_step_8']) {
      if (!t.files[step]) continue;
      const json = await readJson(path.join(SOURCE_ROOT, t.files[step]));
      correzioniResidue += countResidualCorrections(json);
    }

    // robustezza from step 10
    let robustezza = null;
    if (t.files.f3_step_10) {
      const json = await readJson(path.join(SOURCE_ROOT, t.files.f3_step_10));
      robustezza = json?.global_assessment?.device_robustness ?? null;
    }

    // revisioni.md
    const revisioniAbs = path.join(SOURCE_ROOT, 'temi', t.id, 'revisioni.md');
    let revisioniContent = null;
    try { revisioniContent = await fs.readFile(revisioniAbs, 'utf8'); } catch { /* absent */ }
    const stepsSkipped = parseSkippedFromMarkdown(revisioniContent);

    // external_inputs from input/produzioni/temi/[id]/
    const externalInputs = await scanExternalInputs(t.id);

    enriched.push({
      ...t,
      theme_id: themeId,
      ricerca_origine: ricercaOrigine,
      dispositivo_sorgente: dispositivoSorgente,
      steps_skipped: stepsSkipped,
      external_inputs: externalInputs,
      robustezza,
      correzioni_residue: correzioniResidue,
      has_revisioni: revisioniContent !== null,
      revisioni_file: revisioniContent !== null ? `temi/${t.id}/revisioni.md` : null,
    });
  }

  return enriched;
}

// ---------- copy ----------

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyFromSource(rel, sourceRoot = SOURCE_ROOT) {
  const src = path.join(sourceRoot, rel);
  const dst = path.join(TARGET_ROOT, rel);
  await ensureDir(path.dirname(dst));
  await fs.copyFile(src, dst);
}

async function clearTarget() {
  // Cancella solo le directory rigenerate dallo script + l'index.
  // Preserva file scritti a mano nel target (es. pipeline-step-config.json).
  await ensureDir(TARGET_ROOT);
  for (const sub of ['ricerche', 'temi', 'inputs']) {
    await fs.rm(path.join(TARGET_ROOT, sub), { recursive: true, force: true });
  }
  await fs.rm(INDEX_PATH, { force: true });
}

// ---------- MongoDB seed (D2 §7) ----------

async function loadStepConfig() {
  const configPath = path.join(TARGET_ROOT, 'pipeline-step-config.json');
  try {
    return JSON.parse(await fs.readFile(configPath, 'utf8'));
  } catch (err) {
    console.warn(`[sync-pipeline] step config non trovato a ${configPath}: ${err.message}`);
    return null;
  }
}

async function connectMongo() {
  dotenv.config({ path: SERVER_ENV_PATH });
  const password = process.env.MONGODB_PASSWORD;
  const urlTemplate = process.env.MONGODB_URL;
  if (!password || !urlTemplate) {
    throw new Error('MONGODB_PASSWORD e MONGODB_URL devono essere definiti in server/.env');
  }
  const mongoUrl = urlTemplate
    .replace('{password}', password)
    .replace('/?', '/hcaire_db?');
  await mongoose.connect(mongoUrl);
}

async function disconnectMongo() {
  try { await mongoose.disconnect(); } catch { /* ignore */ }
}

async function safeMtime(absPath) {
  try { return (await fs.stat(absPath)).mtime; } catch { return new Date(); }
}

function lookupExternalInputId(stepCfg, ei) {
  // Cerca l'input esterno obbligatorio nel config dello step. Quando ce n'è uno solo
  // (caso più frequente: contesto_ambito per step 7, casi_stress_test per step 10) lo restituisce.
  if (!stepCfg || !Array.isArray(stepCfg.inputs_esterni)) return null;
  const obbligatori = stepCfg.inputs_esterni.filter((e) => e.type === 'esterno_obbligatorio');
  if (obbligatori.length === 1) return obbligatori[0].id;
  // Se ce ne sono più di uno, fallback sul label parsato dal nome file (best-effort).
  const slug = ei.label?.toLowerCase().replace(/\s+/g, '_') ?? null;
  const match = obbligatori.find((e) => e.id === slug);
  return match ? match.id : (obbligatori[0]?.id ?? null);
}

async function readJsonSafe(absPath) {
  try { return JSON.parse(await fs.readFile(absPath, 'utf8')); } catch { return null; }
}

async function seedContext({
  contextsCol, executionsCol, inputsCol,
  ctx, contextType, stepById,
}) {
  const now = new Date();

  // 1) Pre-genera _id per ogni execution dello step (un'unica run = run_number 1).
  const stepIds = Object.keys(ctx.files);
  const executionIdByStep = new Map(
    stepIds.map((sid) => [sid, new mongoose.Types.ObjectId()]),
  );

  // 2) Pre-genera _id per ogni external input (solo per i temi).
  const externalInputs = Array.isArray(ctx.external_inputs) ? ctx.external_inputs : [];
  const externalInputDocs = [];
  for (const ei of externalInputs) {
    const stepCfg = stepById.get(ei.step);
    const inputId = lookupExternalInputId(stepCfg, ei);
    if (!inputId) continue;
    const diskRel = ei.file.replace(/^inputs\//, '');
    const absPath = path.join(INPUT_ROOT, diskRel);
    const data = (await readJsonSafe(absPath)) ?? {};
    const providedAt = await safeMtime(absPath);
    externalInputDocs.push({
      _id: new mongoose.Types.ObjectId(),
      context_type: contextType,
      context_id: ctx.id,
      step_id: ei.step,
      input_id: inputId,
      label: ei.label,
      provided_by: 'seed',
      provided_at: providedAt,
      data,
      file_path: ei.file,
      is_superseded: false,
      superseded_by: null,
    });
  }

  // 3) Upsert idempotente degli external inputs.
  for (const doc of externalInputDocs) {
    await inputsCol.updateOne(
      { context_id: doc.context_id, step_id: doc.step_id, input_id: doc.input_id, is_superseded: false },
      { $setOnInsert: doc },
      { upsert: true },
    );
  }
  const externalsByStep = new Map();
  for (const doc of externalInputDocs) {
    const arr = externalsByStep.get(doc.step_id) ?? [];
    arr.push(doc);
    externalsByStep.set(doc.step_id, arr);
  }

  // 4) Costruisci ed upserta una execution per ogni file presente.
  for (const stepId of stepIds) {
    const relFile = ctx.files[stepId];
    const absFile = path.join(SOURCE_ROOT, relFile);
    const mtime = await safeMtime(absFile);
    const stepCfg = stepById.get(stepId);

    const esterniRefs = (externalsByStep.get(stepId) ?? []).map((e) => ({
      input_id: e.input_id,
      external_input_doc_id: e._id,
      file: e.file_path ?? null,
    }));

    const execDoc = {
      _id: executionIdByStep.get(stepId),
      context_type: contextType,
      context_id: ctx.id,
      step_id: stepId,
      run_number: 1,
      status: 'verificato',
      created_at: mtime,
      started_at: mtime,
      completed_at: mtime,
      verified_at: mtime,
      verified_by: 'seed',
      inputs: {
        pipeline: [],
        esterni: esterniRefs,
        strutturali: stepCfg?.inputs_strutturali ?? [],
        dispositivo_sorgente: null,
      },
      output_file: relFile,
      cowork_message_id: null,
      cowork_session_id: null,
      log_lines: [],
      error: null,
      verifica_required: stepCfg?.verifica === true,
      verifica_notes: null,
      verifica_outcome: stepCfg?.verifica === true ? 'approvato' : null,
      verifica_feedback: null,
      is_skipped: false,
      skip_reason: null,
    };

    await executionsCol.updateOne(
      { context_id: execDoc.context_id, step_id: execDoc.step_id, run_number: execDoc.run_number },
      { $setOnInsert: execDoc },
      { upsert: true },
    );
  }

  // 5) Step saltati registrati in revisioni.md → execution con status 'saltato'.
  const skippedExecutionIds = new Map();
  for (const sk of ctx.steps_skipped ?? []) {
    const execId = new mongoose.Types.ObjectId();
    skippedExecutionIds.set(sk.step, execId);
    const skippedDoc = {
      _id: execId,
      context_type: contextType,
      context_id: ctx.id,
      step_id: sk.step,
      run_number: 1,
      status: 'saltato',
      created_at: now,
      started_at: null,
      completed_at: null,
      verified_at: null,
      verified_by: null,
      inputs: { pipeline: [], esterni: [], strutturali: [], dispositivo_sorgente: null },
      output_file: null,
      cowork_message_id: null,
      cowork_session_id: null,
      log_lines: [],
      error: null,
      verifica_required: false,
      verifica_notes: null,
      verifica_outcome: null,
      verifica_feedback: null,
      is_skipped: true,
      skip_reason: sk.reason,
    };
    await executionsCol.updateOne(
      { context_id: skippedDoc.context_id, step_id: skippedDoc.step_id, run_number: skippedDoc.run_number },
      { $setOnInsert: skippedDoc },
      { upsert: true },
    );
  }

  // 6) Costruisci step_states per il context.
  const stepStates = {};
  for (const stepId of stepIds) {
    const stepCfg = stepById.get(stepId);
    const verified = stepCfg?.verifica === true ? 'approvato' : null;
    stepStates[stepId] = {
      status: 'verificato',
      current_run: 1,
      last_execution_id: executionIdByStep.get(stepId),
      output_file: ctx.files[stepId],
      verifica_outcome: verified,
      updated_at: await safeMtime(path.join(SOURCE_ROOT, ctx.files[stepId])),
    };
  }
  for (const sk of ctx.steps_skipped ?? []) {
    stepStates[sk.step] = {
      status: 'saltato',
      current_run: 1,
      last_execution_id: skippedExecutionIds.get(sk.step) ?? null,
      output_file: null,
      verifica_outcome: null,
      updated_at: now,
    };
  }

  const stepsCompletedSet = new Set([...stepIds, ...(ctx.steps_skipped ?? []).map((s) => s.step)]);

  const contextDoc = {
    context_type: contextType,
    context_id: ctx.id,
    label: ctx.label,
    theme_id: ctx.theme_id ?? null,
    ricerca_origine: ctx.ricerca_origine ?? null,
    dispositivo_sorgente: ctx.dispositivo_sorgente ?? null,
    step_states: stepStates,
    pending_decision: null,
    steps_completed: [...stepsCompletedSet],
    steps_in_progress: [],
    steps_failed: [],
    robustezza: ctx.robustezza ?? null,
    correzioni_residue: ctx.correzioni_residue ?? 0,
    has_revisioni: ctx.has_revisioni ?? false,
    createdAt: now,
    updatedAt: now,
  };

  await contextsCol.updateOne(
    { context_id: contextDoc.context_id },
    { $setOnInsert: contextDoc },
    { upsert: true },
  );
}

async function seedMongo({ ricerche, temi }) {
  const stepConfig = await loadStepConfig();
  if (!stepConfig) {
    console.warn('[sync-pipeline] seed saltato: pipeline-step-config.json non disponibile');
    return;
  }
  const stepById = new Map(stepConfig.steps.map((s) => [s.id, s]));

  const db = mongoose.connection.db;
  const contextsCol = db.collection('pipeline_contexts');
  const executionsCol = db.collection('pipeline_step_executions');
  const inputsCol = db.collection('pipeline_external_inputs');

  if (CLI_RESET_SEED) {
    console.log('[sync-pipeline] --reset-seed: cancello documenti esistenti nelle 3 collection');
    await Promise.all([
      contextsCol.deleteMany({}),
      executionsCol.deleteMany({}),
      inputsCol.deleteMany({}),
    ]);
  }

  for (const r of ricerche) {
    await seedContext({ contextsCol, executionsCol, inputsCol, ctx: r, contextType: 'ricerca', stepById });
  }
  for (const t of temi) {
    await seedContext({ contextsCol, executionsCol, inputsCol, ctx: t, contextType: 'tema', stepById });
  }

  const [ctxCount, execCount, inputCount] = await Promise.all([
    contextsCol.countDocuments({}),
    executionsCol.countDocuments({}),
    inputsCol.countDocuments({}),
  ]);
  console.log(
    `[sync-pipeline] seed done — contexts: ${ctxCount}, executions: ${execCount}, external_inputs: ${inputCount}`,
  );
}

// ---------- main ----------

async function main() {
  console.log(`[sync-pipeline] source: ${SOURCE_ROOT}`);
  console.log(`[sync-pipeline] input:  ${INPUT_ROOT}`);
  console.log(`[sync-pipeline] target: ${TARGET_ROOT}`);

  try {
    await fs.access(SOURCE_ROOT);
  } catch {
    console.error(`[sync-pipeline] source folder not found: ${SOURCE_ROOT}`);
    process.exit(1);
  }

  await clearTarget();

  const { ricerche, themeToRicerca } = await scanRicerche();
  const temi = await scanTemi({ themeToRicerca });

  // Copy pipeline JSONs
  const filesToCopy = [
    ...ricerche.flatMap(r => Object.values(r.files)),
    ...temi.flatMap(t => Object.values(t.files)),
  ];
  for (const rel of filesToCopy) {
    await copyFromSource(rel);
  }

  // Copy external input files
  const externalFiles = temi.flatMap(t => t.external_inputs.map(ei => ei.file));
  for (const rel of externalFiles) {
    // external files live under INPUT_ROOT with rel = "inputs/temi/<id>/<file>"
    // but on disk they are under INPUT_ROOT at "temi/<id>/<file>" (strip "inputs/")
    const diskRel = rel.replace(/^inputs\//, '');
    const src = path.join(INPUT_ROOT, diskRel);
    const dst = path.join(TARGET_ROOT, rel);
    await ensureDir(path.dirname(dst));
    try { await fs.copyFile(src, dst); } catch (e) { console.warn(`[sync-pipeline] skip missing input: ${src}`); }
  }

  // Copy revisioni.md per tema
  for (const t of temi) {
    if (!t.revisioni_file) continue;
    await copyFromSource(t.revisioni_file);
  }

  const index = {
    generated_at: new Date().toISOString(),
    ricerche,
    temi,
  };

  await fs.writeFile(INDEX_PATH, JSON.stringify(index, null, 2), 'utf8');

  console.log(
    `[sync-pipeline] done — ${ricerche.length} ricerche, ${temi.length} temi, ${filesToCopy.length + externalFiles.length} files`,
  );

  // ----- MongoDB seed (idempotente) -----
  if (CLI_NO_SEED) {
    console.log('[sync-pipeline] --no-seed: salto la fase di seed MongoDB');
    return;
  }
  if (!process.env.MONGODB_PASSWORD || !process.env.MONGODB_URL) {
    // Tenta dotenv solo per verificare la presenza delle env. La connessione vera carica dotenv.
    dotenv.config({ path: SERVER_ENV_PATH });
  }
  if (!process.env.MONGODB_PASSWORD || !process.env.MONGODB_URL) {
    console.warn('[sync-pipeline] seed saltato: MONGODB_PASSWORD/MONGODB_URL non disponibili (server/.env)');
    return;
  }
  try {
    await connectMongo();
    await seedMongo({ ricerche, temi });
  } catch (err) {
    console.warn(`[sync-pipeline] seed MongoDB fallito: ${err.message}`);
  } finally {
    await disconnectMongo();
  }
}

main().catch(err => {
  console.error('[sync-pipeline] error:', err);
  disconnectMongo().finally(() => process.exit(1));
});
