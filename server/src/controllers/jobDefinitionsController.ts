import { Request, Response } from 'express';
import { Types } from 'mongoose';
import JobDefinition from '../models/JobDefinition';
import type { ClerkRequest } from '../middleware/clerkAuth';
import type { JobType } from '../shared/types/jobs';

const VALID_TYPES: JobType[] = ['research', 'write', 'research-and-write'];

interface JobDefinitionBody {
  name?:          string;
  type?:          string;
  description?:   string;
  skills?:        unknown;
  plugins?:       unknown;
  defaultParams?: Record<string, unknown>;
  active?:        boolean;
}

function sanitizeObjectIdArray(input: unknown): Types.ObjectId[] | { error: string } {
  if (input === undefined) return [];
  if (!Array.isArray(input)) return { error: 'array atteso' };
  const out: Types.ObjectId[] = [];
  for (const v of input) {
    if (typeof v !== 'string' || !Types.ObjectId.isValid(v)) {
      return { error: `ObjectId non valido: ${String(v)}` };
    }
    out.push(new Types.ObjectId(v));
  }
  return out;
}

// GET /api/admin/job-definitions?active=true
export const listJobDefinitions = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.active === 'true')  filter.active = true;
    if (req.query.active === 'false') filter.active = false;
    const items = await JobDefinition.find(filter).sort({ name: 1 }).lean();
    res.json({ items });
  } catch {
    res.status(500).json({ error: 'Errore recupero job definitions' });
  }
};

// GET /api/admin/job-definitions/:id
export const getJobDefinition = async (req: Request, res: Response): Promise<void> => {
  try {
    const doc = await JobDefinition.findById(req.params.id).lean();
    if (!doc) { res.status(404).json({ error: 'Job definition non trovata' }); return; }
    res.json(doc);
  } catch {
    res.status(400).json({ error: 'ID non valido' });
  }
};

// POST /api/admin/job-definitions
export const createJobDefinition = async (req: ClerkRequest, res: Response): Promise<void> => {
  const { name, type, description, skills, plugins, defaultParams, active } = req.body as JobDefinitionBody;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ error: 'name obbligatorio' }); return;
  }
  if (!type || !VALID_TYPES.includes(type as JobType)) {
    res.status(400).json({ error: 'type non valido (research | write | research-and-write)' }); return;
  }
  const skillIds = sanitizeObjectIdArray(skills);
  if (!Array.isArray(skillIds)) { res.status(400).json({ error: `skills: ${skillIds.error}` }); return; }
  const pluginIds = sanitizeObjectIdArray(plugins);
  if (!Array.isArray(pluginIds)) { res.status(400).json({ error: `plugins: ${pluginIds.error}` }); return; }
  if (defaultParams !== undefined && (typeof defaultParams !== 'object' || defaultParams === null || Array.isArray(defaultParams))) {
    res.status(400).json({ error: 'defaultParams deve essere un oggetto' }); return;
  }

  try {
    const existing = await JobDefinition.findOne({ name: name.trim() });
    if (existing) { res.status(409).json({ error: 'Job definition con questo nome già esistente' }); return; }
    const doc = await JobDefinition.create({
      name:          name.trim(),
      type,
      description:   description?.trim() ?? '',
      skills:        skillIds,
      plugins:       pluginIds,
      defaultParams: defaultParams ?? {},
      active:        active !== undefined ? Boolean(active) : true,
    });
    res.status(201).json(doc.toJSON());
  } catch {
    res.status(500).json({ error: 'Errore creazione job definition' });
  }
};

// PUT /api/admin/job-definitions/:id
export const updateJobDefinition = async (req: ClerkRequest, res: Response): Promise<void> => {
  const { name, type, description, skills, plugins, defaultParams, active } = req.body as JobDefinitionBody;
  const update: Record<string, unknown> = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'name non valido' }); return;
    }
    update.name = name.trim();
  }
  if (type !== undefined) {
    if (!VALID_TYPES.includes(type as JobType)) {
      res.status(400).json({ error: 'type non valido' }); return;
    }
    update.type = type;
  }
  if (description !== undefined) update.description = String(description).trim();
  if (skills !== undefined) {
    const ids = sanitizeObjectIdArray(skills);
    if (!Array.isArray(ids)) { res.status(400).json({ error: `skills: ${ids.error}` }); return; }
    update.skills = ids;
  }
  if (plugins !== undefined) {
    const ids = sanitizeObjectIdArray(plugins);
    if (!Array.isArray(ids)) { res.status(400).json({ error: `plugins: ${ids.error}` }); return; }
    update.plugins = ids;
  }
  if (defaultParams !== undefined) {
    if (typeof defaultParams !== 'object' || defaultParams === null || Array.isArray(defaultParams)) {
      res.status(400).json({ error: 'defaultParams deve essere un oggetto' }); return;
    }
    update.defaultParams = defaultParams;
  }
  if (active !== undefined) update.active = Boolean(active);

  try {
    const doc = await JobDefinition.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!doc) { res.status(404).json({ error: 'Job definition non trovata' }); return; }
    res.json(doc.toJSON());
  } catch {
    res.status(400).json({ error: 'Errore aggiornamento job definition' });
  }
};

// DELETE /api/admin/job-definitions/:id
export const deleteJobDefinition = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const doc = await JobDefinition.findByIdAndDelete(req.params.id);
    if (!doc) { res.status(404).json({ error: 'Job definition non trovata' }); return; }
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: 'Errore eliminazione job definition' });
  }
};
