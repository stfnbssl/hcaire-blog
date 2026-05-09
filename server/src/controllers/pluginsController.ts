import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Plugin from '../models/Plugin';
import type { ClerkRequest } from '../middleware/clerkAuth';

interface PluginBody {
  name?:             string;
  description?:      string;
  config?:           Record<string, unknown>;
  compatibleSkills?: unknown;
  active?:           boolean;
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

// GET /api/admin/plugins?active=true
export const listPlugins = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.active === 'true')  filter.active = true;
    if (req.query.active === 'false') filter.active = false;
    const items = await Plugin.find(filter).sort({ name: 1 }).lean();
    res.json({ items });
  } catch {
    res.status(500).json({ error: 'Errore recupero plugins' });
  }
};

// GET /api/admin/plugins/:id
export const getPlugin = async (req: Request, res: Response): Promise<void> => {
  try {
    const doc = await Plugin.findById(req.params.id).lean();
    if (!doc) { res.status(404).json({ error: 'Plugin non trovato' }); return; }
    res.json(doc);
  } catch {
    res.status(400).json({ error: 'ID non valido' });
  }
};

// POST /api/admin/plugins
export const createPlugin = async (req: ClerkRequest, res: Response): Promise<void> => {
  const { name, description, config, compatibleSkills, active } = req.body as PluginBody;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ error: 'name obbligatorio' }); return;
  }
  const skills = sanitizeObjectIdArray(compatibleSkills);
  if (!Array.isArray(skills)) {
    res.status(400).json({ error: `compatibleSkills: ${skills.error}` }); return;
  }
  if (config !== undefined && (typeof config !== 'object' || config === null || Array.isArray(config))) {
    res.status(400).json({ error: 'config deve essere un oggetto' }); return;
  }

  try {
    const existing = await Plugin.findOne({ name: name.trim() });
    if (existing) { res.status(409).json({ error: 'Plugin con questo nome già esistente' }); return; }
    const doc = await Plugin.create({
      name:             name.trim(),
      description:      description?.trim() ?? '',
      config:           config ?? {},
      compatibleSkills: skills,
      active:           active !== undefined ? Boolean(active) : true,
    });
    res.status(201).json(doc.toJSON());
  } catch {
    res.status(500).json({ error: 'Errore creazione plugin' });
  }
};

// PUT /api/admin/plugins/:id
export const updatePlugin = async (req: ClerkRequest, res: Response): Promise<void> => {
  const { name, description, config, compatibleSkills, active } = req.body as PluginBody;
  const update: Record<string, unknown> = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'name non valido' }); return;
    }
    update.name = name.trim();
  }
  if (description !== undefined) update.description = String(description).trim();
  if (config !== undefined) {
    if (typeof config !== 'object' || config === null || Array.isArray(config)) {
      res.status(400).json({ error: 'config deve essere un oggetto' }); return;
    }
    update.config = config;
  }
  if (compatibleSkills !== undefined) {
    const skills = sanitizeObjectIdArray(compatibleSkills);
    if (!Array.isArray(skills)) {
      res.status(400).json({ error: `compatibleSkills: ${skills.error}` }); return;
    }
    update.compatibleSkills = skills;
  }
  if (active !== undefined) update.active = Boolean(active);

  try {
    const doc = await Plugin.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!doc) { res.status(404).json({ error: 'Plugin non trovato' }); return; }
    res.json(doc.toJSON());
  } catch {
    res.status(400).json({ error: 'Errore aggiornamento plugin' });
  }
};

// PATCH /api/admin/plugins/:id/toggle
export const togglePlugin = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const doc = await Plugin.findById(req.params.id);
    if (!doc) { res.status(404).json({ error: 'Plugin non trovato' }); return; }
    doc.active = !doc.active;
    await doc.save();
    res.json(doc.toJSON());
  } catch {
    res.status(400).json({ error: 'Errore toggle plugin' });
  }
};

// DELETE /api/admin/plugins/:id
export const deletePlugin = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const doc = await Plugin.findByIdAndDelete(req.params.id);
    if (!doc) { res.status(404).json({ error: 'Plugin non trovato' }); return; }
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: 'Errore eliminazione plugin' });
  }
};
