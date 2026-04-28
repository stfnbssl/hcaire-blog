// Controller per la sezione "Letture":
// - endpoint pubblici: lista opere pubblicate (step_5d completato) e dettaglio
// - endpoint admin: CRUD su opere + metadati (esecuzione step in fase 2)
//
// Nota: in questa fase l'esecuzione degli step (POST /run) NON è ancora implementata.
// Sarà aggiunta in fase 2 quando integriamo il bus Redis e il command handler.

import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import Opera, {
  IOpera,
  IOperaPipeline,
  LETTURE_STEP_IDS,
  LETTURE_TIPOLOGIE,
  LETTURE_STATI,
  LettureStepId,
  OperaStato,
  OperaTipologia,
} from '../models/Opera';
import { resolveUniqueSlug } from '../utils/lettureSlug';
import {
  avanzamento,
  buildInvalidationUpdate,
  calcolaStato,
  isStepEnabled,
  LETTURE_PREREQUISITES,
} from '../utils/lettureStato';
import {
  addPrefix,
  LETTURE_ASSI_DIR,
  LETTURE_STEP_MD_FILENAME,
  outputDirFor,
  outputJsonPathFor,
  outputMdPathFor,
} from '../utils/lettureSteps';
import { getLettureMessageBus } from '../services/lettureMessageBus';
import path from 'path';
import { promises as fs } from 'fs';

// ---------- helpers ----------

function isTipologia(v: unknown): v is OperaTipologia {
  return typeof v === 'string' && (LETTURE_TIPOLOGIE as string[]).includes(v);
}

function isStato(v: unknown): v is OperaStato {
  return typeof v === 'string' && (LETTURE_STATI as string[]).includes(v);
}

// Riassunto leggero di un'opera per la lista pubblica e per la lista admin.
// `output` e `testo` non vengono inclusi (troppo pesanti).
function summary(o: IOpera) {
  const av = avanzamento(o.pipeline);
  const stepStatuses = LETTURE_STEP_IDS.reduce<Record<string, string>>((acc, id) => {
    acc[id] = o.pipeline[id].stato;
    return acc;
  }, {});
  return {
    slug: o.slug,
    titolo: o.titolo,
    autore: o.autore,
    anno: o.anno,
    tipologia: o.tipologia,
    lingua_originale: o.lingua_originale,
    stato: o.stato,
    priorita: o.priorita,
    note_di_ingresso: o.note_di_ingresso,
    avanzamento: av,
    step_stati: stepStatuses,
    pubblicata_il: o.pipeline.step_5d.completato_il,
    testi_disponibili: {
      articolo: o.pipeline.step_5d.stato === 'completato',
      resoconto: o.pipeline.step_5e.stato === 'completato',
      saggio: o.pipeline.step_5f.stato === 'completato',
    },
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

// ---------- API pubbliche ----------

// GET /api/letture
// Lista opere con articolo finale completato, ordinate per data discendente.
export async function listOperePubbliche(_req: Request, res: Response): Promise<void> {
  try {
    const opere = await Opera.find(
      { 'pipeline.step_5d.stato': 'completato' },
      // Escludo i campi pesanti: solo cosa serve all'indice pubblico.
      {
        slug: 1, titolo: 1, autore: 1, anno: 1, tipologia: 1,
        'pipeline.step_5d.completato_il': 1,
        'pipeline.step_5d.stato': 1,
        'pipeline.step_5e.stato': 1,
        'pipeline.step_5f.stato': 1,
      },
    )
      .sort({ 'pipeline.step_5d.completato_il': -1 })
      .lean();

    res.json(opere.map((o) => ({
      slug: o.slug,
      titolo: o.titolo,
      autore: o.autore,
      anno: o.anno ?? null,
      tipologia: o.tipologia,
      pubblicata_il: o.pipeline?.step_5d?.completato_il ?? null,
      ha_resoconto: o.pipeline?.step_5e?.stato === 'completato',
      ha_saggio:    o.pipeline?.step_5f?.stato === 'completato',
    })));
  } catch (err) {
    console.error('[letture] listOperePubbliche error:', err);
    res.status(500).json({ error: 'Errore nel recupero delle letture' });
  }
}

// GET /api/letture/:slug
// Dettaglio opera pubblica: dati bibliografici + testi Markdown disponibili.
export async function getOperaPubblica(req: Request, res: Response): Promise<void> {
  try {
    const opera = await Opera.findOne(
      { slug: req.params.slug, 'pipeline.step_5d.stato': 'completato' },
      {
        slug: 1, titolo: 1, autore: 1, anno: 1, tipologia: 1, lingua_originale: 1,
        'pipeline.step_5d.testo': 1,
        'pipeline.step_5d.completato_il': 1,
        'pipeline.step_5e.testo': 1,
        'pipeline.step_5e.stato': 1,
        'pipeline.step_5e.completato_il': 1,
        'pipeline.step_5f.testo': 1,
        'pipeline.step_5f.stato': 1,
        'pipeline.step_5f.completato_il': 1,
      },
    ).lean();

    if (!opera) {
      res.status(404).json({ error: 'Opera non trovata' });
      return;
    }

    res.json({
      slug: opera.slug,
      titolo: opera.titolo,
      autore: opera.autore,
      anno: opera.anno ?? null,
      tipologia: opera.tipologia,
      lingua_originale: opera.lingua_originale ?? null,
      pubblicata_il: opera.pipeline?.step_5d?.completato_il ?? null,
      articolo: opera.pipeline?.step_5d?.testo ?? null,
      resoconto: opera.pipeline?.step_5e?.stato === 'completato'
        ? { testo: opera.pipeline.step_5e.testo, completato_il: opera.pipeline.step_5e.completato_il }
        : null,
      saggio: opera.pipeline?.step_5f?.stato === 'completato'
        ? { testo: opera.pipeline.step_5f.testo, completato_il: opera.pipeline.step_5f.completato_il }
        : null,
    });
  } catch (err) {
    console.error('[letture] getOperaPubblica error:', err);
    res.status(500).json({ error: 'Errore nel recupero dell\'opera' });
  }
}

// ---------- API admin ----------

// GET /api/admin/letture
// Lista completa con filtri opzionali (stato, tipologia, priorita).
// Campi pesanti (output, testo) esclusi.
export async function listOpereAdmin(req: Request, res: Response): Promise<void> {
  try {
    const filter: Record<string, unknown> = {};
    if (typeof req.query.stato === 'string' && isStato(req.query.stato)) {
      filter.stato = req.query.stato;
    }
    if (typeof req.query.tipologia === 'string' && isTipologia(req.query.tipologia)) {
      filter.tipologia = req.query.tipologia;
    }
    if (typeof req.query.priorita === 'string') {
      const p = parseInt(req.query.priorita, 10);
      if (!Number.isNaN(p) && p >= 1 && p <= 5) filter.priorita = p;
    }

    // Esclusione campi pesanti via projection negativa.
    const projection = LETTURE_STEP_IDS.reduce<Record<string, 0>>((acc, id) => {
      acc[`pipeline.${id}.output`] = 0;
      return acc;
    }, {});
    projection['pipeline.step_5d.testo'] = 0;
    projection['pipeline.step_5e.testo'] = 0;
    projection['pipeline.step_5f.testo'] = 0;

    const opere = await Opera.find(filter, projection)
      // Mongo: i null vengono PRIMA in asc; per "in coda" è invece atteso che le opere
      // SENZA priorità finiscano in fondo. Soluzione: ordino prima per "ha priorità"
      // (boolean simulato via $exists) — ma .sort di Mongoose non lo fa pulitamente,
      // quindi ordino in due passi: priorita asc (nulls last via aggregation più avanti),
      // per ora lasciamo asc e accettiamo nulls first; la UI può evidenziare le righe.
      .sort({ priorita: 1, createdAt: -1 })
      .lean();

    res.json(opere.map((o) => summary(o as unknown as IOpera)));
  } catch (err) {
    console.error('[letture] listOpereAdmin error:', err);
    res.status(500).json({ error: 'Errore nel recupero della lista opere' });
  }
}

// GET /api/admin/letture/:slug
// Dettaglio admin completo (incluso output di ogni step).
export async function getOperaAdmin(req: Request, res: Response): Promise<void> {
  try {
    const opera = await Opera.findOne({ slug: req.params.slug }).lean();
    if (!opera) {
      res.status(404).json({ error: 'Opera non trovata' });
      return;
    }
    res.json(opera);
  } catch (err) {
    console.error('[letture] getOperaAdmin error:', err);
    res.status(500).json({ error: 'Errore nel recupero dell\'opera' });
  }
}

// POST /api/admin/letture
// Crea opera: genera slug univoco, inizializza pipeline a non_avviato, stato in_attesa.
export async function createOpera(req: Request, res: Response): Promise<void> {
  try {
    const {
      titolo,
      autore,
      anno,
      tipologia,
      lingua_originale,
      priorita,
      note_di_ingresso,
    } = req.body ?? {};

    // Validazione minima — i campi obbligatori sono forzati a livello di schema,
    // ma fallisce con 500 invece di 400 senza questo check.
    if (typeof titolo !== 'string' || titolo.trim().length === 0) {
      res.status(400).json({ error: 'Il campo `titolo` è obbligatorio' });
      return;
    }
    if (typeof autore !== 'string' || autore.trim().length === 0) {
      res.status(400).json({ error: 'Il campo `autore` è obbligatorio' });
      return;
    }
    if (!isTipologia(tipologia)) {
      res.status(400).json({ error: `Tipologia non valida (ammesse: ${LETTURE_TIPOLOGIE.join(', ')})` });
      return;
    }

    const slug = await resolveUniqueSlug(autore, titolo);

    const opera = await Opera.create({
      slug,
      titolo: titolo.trim(),
      autore: autore.trim(),
      anno: typeof anno === 'number' ? anno : null,
      tipologia,
      lingua_originale: typeof lingua_originale === 'string' && lingua_originale.trim()
        ? lingua_originale.trim()
        : null,
      stato: 'in_attesa',
      priorita: typeof priorita === 'number' && priorita >= 1 && priorita <= 5 ? priorita : null,
      note_di_ingresso: typeof note_di_ingresso === 'string' ? note_di_ingresso : '',
    });

    res.status(201).json(opera.toObject());
  } catch (err) {
    console.error('[letture] createOpera error:', err);
    res.status(500).json({ error: 'Errore nella creazione dell\'opera' });
  }
}

// PATCH /api/admin/letture/:slug
// Aggiorna i metadati. NON tocca i campi `pipeline`.
// Se viene passato `stato`, è l'admin che lo sta forzando manualmente — rispettiamo.
export async function updateOpera(req: Request, res: Response): Promise<void> {
  try {
    const allowed: Array<keyof IOpera> = [
      'titolo', 'autore', 'anno', 'tipologia', 'lingua_originale',
      'priorita', 'note_di_ingresso', 'stato',
    ];
    const update: Record<string, unknown> = {};
    for (const k of allowed) {
      if (k in (req.body ?? {})) update[k as string] = req.body[k];
    }

    if ('tipologia' in update && !isTipologia(update.tipologia)) {
      res.status(400).json({ error: 'Tipologia non valida' });
      return;
    }
    if ('stato' in update && !isStato(update.stato)) {
      res.status(400).json({ error: 'Stato non valido' });
      return;
    }
    if ('priorita' in update) {
      const p = update.priorita;
      if (p !== null && !(typeof p === 'number' && p >= 1 && p <= 5)) {
        res.status(400).json({ error: 'Priorità deve essere 1-5 oppure null' });
        return;
      }
    }

    const opera = await Opera.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: update },
      { new: true },
    ).lean();

    if (!opera) {
      res.status(404).json({ error: 'Opera non trovata' });
      return;
    }

    // Se l'admin non ha forzato uno stato, ricalcoliamo da pipeline (per coerenza,
    // anche se in questa fase la pipeline non viene modificata da queste API).
    if (!('stato' in update)) {
      const pipeline = opera.pipeline as unknown as IOperaPipeline;
      const nuovo = calcolaStato(pipeline, opera.stato);
      if (nuovo !== opera.stato) {
        opera.stato = nuovo;
        await Opera.updateOne({ slug: req.params.slug }, { $set: { stato: nuovo } });
      }
    }

    res.json(opera);
  } catch (err) {
    console.error('[letture] updateOpera error:', err);
    res.status(500).json({ error: 'Errore nell\'aggiornamento dell\'opera' });
  }
}

// DELETE /api/admin/letture/:slug
// Elimina l'opera. (Filesystem cleanup non implementato: i file su disco restano,
// rimossi manualmente o con una task di pulizia separata.)
export async function deleteOpera(req: Request, res: Response): Promise<void> {
  try {
    const result = await Opera.deleteOne({ slug: req.params.slug });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Opera non trovata' });
      return;
    }
    res.status(204).end();
  } catch (err) {
    console.error('[letture] deleteOpera error:', err);
    res.status(500).json({ error: 'Errore nella cancellazione dell\'opera' });
  }
}

// ---------- esecuzione step (Fase 2) ----------

function isLettureStepId(v: unknown): v is LettureStepId {
  return typeof v === 'string' && (LETTURE_STEP_IDS as readonly string[]).includes(v);
}

// Costruisce gli input_files (role + path assoluto) per uno step, in base alla tabella
// della spec. Path puntano a file su filesystem condiviso server/local (vedi
// PIPELINE_OUTPUT_ROOT_LETTURE per la root).
async function buildInputFilesForStep(
  slug: string,
  stepId: LettureStepId,
): Promise<{ role: string; path: string }[]> {
  const filesByStep: Record<LettureStepId, () => string> = {
    step_1:  () => outputJsonPathFor(slug, 'step_1'),
    step_2:  () => outputJsonPathFor(slug, 'step_2'),
    step_3:  () => outputJsonPathFor(slug, 'step_3'),
    step_4:  () => outputJsonPathFor(slug, 'step_4'),
    step_5a: () => outputJsonPathFor(slug, 'step_5a'),
    step_5b: () => outputJsonPathFor(slug, 'step_5b'),
    step_5c: () => outputJsonPathFor(slug, 'step_5c'),
    step_5d: () => outputJsonPathFor(slug, 'step_5d'),
    step_5e: () => outputJsonPathFor(slug, 'step_5e'),
    step_5f: () => outputJsonPathFor(slug, 'step_5f'),
  };

  const refs = (ids: LettureStepId[]) =>
    ids.map((id) => ({ role: id, path: filesByStep[id]() }));

  // Special: step_3 include i 6 assi precompilati come role "asse_N".
  const assiInputs = async () => {
    const inputs: { role: string; path: string }[] = [];
    for (let n = 1; n <= 6; n++) {
      inputs.push({ role: `asse_${n}`, path: path.join(LETTURE_ASSI_DIR, `asse_${n}.json`) });
    }
    return inputs;
  };

  // Tabella input per step (vedi spec § "Input/output per step").
  switch (stepId) {
    case 'step_1':
      return [];
    case 'step_2':
      return refs(['step_1']);
    case 'step_3':
      return [...refs(['step_1', 'step_2']), ...(await assiInputs())];
    case 'step_4':
      return refs(['step_1', 'step_2', 'step_3']);
    case 'step_5a':
      return refs(['step_1', 'step_2', 'step_3', 'step_4']);
    case 'step_5b':
      return refs(['step_5a', 'step_1', 'step_2', 'step_3', 'step_4']);
    case 'step_5c':
      return refs(['step_5b', 'step_5a', 'step_1', 'step_2', 'step_3', 'step_4']);
    case 'step_5d':
      return refs(['step_5c', 'step_5b', 'step_5a', 'step_4']);
    case 'step_5e':
      return refs(['step_5d', 'step_1', 'step_2', 'step_3', 'step_4']);
    case 'step_5f': {
      // Articolo (5d.md) + resoconto (5e.md) come ruoli speciali, più contesto step_1..4.
      const md5d = outputMdPathFor(slug, 'step_5d');
      const md5e = outputMdPathFor(slug, 'step_5e');
      const inputs: { role: string; path: string }[] = [];
      if (md5d) inputs.push({ role: 'articolo', path: md5d });
      if (md5e) inputs.push({ role: 'resoconto', path: md5e });
      inputs.push(...refs(['step_1', 'step_2', 'step_3', 'step_4']));
      return inputs;
    }
  }
}

// Costruisce il prompt_prefix per lo step_1 (metadati dell'opera).
// Per gli altri step ritorna null (gli input vivono nei file).
function buildPromptPrefix(opera: IOpera, stepId: LettureStepId): string | null {
  if (stepId !== 'step_1') return null;
  const lines = [
    `Titolo: ${opera.titolo}`,
    `Autore: ${opera.autore}`,
    `Tipologia: ${opera.tipologia}`,
  ];
  if (opera.anno !== null && opera.anno !== undefined) lines.push(`Anno: ${opera.anno}`);
  if (opera.lingua_originale) lines.push(`Lingua originale: ${opera.lingua_originale}`);
  if (opera.note_di_ingresso && opera.note_di_ingresso.trim()) {
    lines.push(`Note: ${opera.note_di_ingresso.trim()}`);
  }
  return lines.join('\n');
}

// POST /api/admin/letture/:slug/steps/:step_id/run
// Avvia uno step. Se lo step è già `completato` o `errore`, applica prima la cascata
// di invalidazione e poi reimposta lo step a `in_coda`.
export async function runStep(req: Request, res: Response): Promise<void> {
  try {
    const slug = req.params.slug;
    const stepId = req.params.step_id;

    if (!isLettureStepId(stepId)) {
      res.status(400).json({ error: `step_id non valido: ${stepId}` });
      return;
    }

    const opera = await Opera.findOne({ slug });
    if (!opera) {
      res.status(404).json({ error: 'Opera non trovata' });
      return;
    }

    // Verifica prerequisiti (tutti gli step richiesti devono essere `completato`).
    if (!isStepEnabled(opera.pipeline, stepId)) {
      const mancanti = LETTURE_PREREQUISITES[stepId].filter(
        (p) => opera.pipeline[p].stato !== 'completato',
      );
      res.status(400).json({
        error: 'Prerequisiti non soddisfatti',
        prerequisiti_mancanti: mancanti,
      });
      return;
    }

    // Stato corrente dello step: se in_coda/in_esecuzione → 409 (già in lavorazione).
    const statoCorrente = opera.pipeline[stepId].stato;
    if (statoCorrente === 'in_coda' || statoCorrente === 'in_esecuzione') {
      res.status(409).json({ error: `Step ${stepId} già in lavorazione (${statoCorrente})` });
      return;
    }

    // Re-esecuzione di uno step già completato/errore: applica cascata prima di marcare in_coda.
    const update: Record<string, unknown> = {};
    if (statoCorrente === 'completato' || statoCorrente === 'errore') {
      Object.assign(update, buildInvalidationUpdate(stepId, { includeSelf: true }));
    }
    update[`pipeline.${stepId}.stato`] = 'in_coda';
    update[`pipeline.${stepId}.started_at`] = null;
    update[`pipeline.${stepId}.errore`] = null;
    update[`pipeline.${stepId}.log_lines`] = [];
    await Opera.updateOne({ slug }, { $set: update });

    // Ricalcola stato opera dopo l'update.
    const refreshed = await Opera.findOne({ slug }).lean();
    if (refreshed) {
      const nuovo = calcolaStato(refreshed.pipeline as IOperaPipeline, refreshed.stato);
      if (nuovo !== refreshed.stato) {
        await Opera.updateOne({ slug }, { $set: { stato: nuovo } });
      }
    }

    // Costruisci output_dir, filename e md_filename
    const outputDir = outputDirFor(slug, stepId);
    try { await fs.mkdir(outputDir, { recursive: true }); } catch { /* non bloccante */ }

    const outputFilename = path.basename(outputJsonPathFor(slug, stepId));
    const mdFilename = LETTURE_STEP_MD_FILENAME[stepId] ?? null;

    // Costruisci input_files
    const inputFiles = await buildInputFilesForStep(slug, stepId);
    const promptPrefix = buildPromptPrefix(opera, stepId);

    const executionId = randomUUID();
    const runNumber = 1; // niente versionamento in questa fase: ogni run sovrascrive

    await getLettureMessageBus().sendStepRun({
      execution_id: executionId,
      context_id: slug,
      step_id: addPrefix(stepId),
      run_number: runNumber,
      input_files: inputFiles,
      output_dir: outputDir,
      output_filename: outputFilename,
      output_md_filename: mdFilename,
      extra_params: promptPrefix ? { prompt_prefix: promptPrefix } : {},
    });

    res.status(202).json({
      execution_id: executionId,
      slug,
      step_id: stepId,
      status: 'in_coda',
    });
  } catch (err) {
    console.error('[letture] runStep error:', err);
    res.status(500).json({ error: 'Errore nell\'avvio dello step' });
  }
}

// GET /api/admin/letture/:slug/steps/:step_id
// Stato e log di un singolo step.
export async function getStep(req: Request, res: Response): Promise<void> {
  try {
    const slug = req.params.slug;
    const stepId = req.params.step_id;
    if (!isLettureStepId(stepId)) {
      res.status(400).json({ error: `step_id non valido: ${stepId}` });
      return;
    }
    const opera = await Opera.findOne({ slug }, { [`pipeline.${stepId}`]: 1, slug: 1 }).lean();
    if (!opera) {
      res.status(404).json({ error: 'Opera non trovata' });
      return;
    }
    res.json({ slug: opera.slug, step_id: stepId, ...opera.pipeline[stepId] });
  } catch (err) {
    console.error('[letture] getStep error:', err);
    res.status(500).json({ error: 'Errore nel recupero dello step' });
  }
}

