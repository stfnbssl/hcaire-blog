import { Request, Response } from 'express';
import Skill from '../models/Skill';
import type { ClerkRequest } from '../middleware/clerkAuth';
import type {
  SkillCategory,
  SkillParameter,
  SkillParameterType,
} from '../shared/types/jobs';

const VALID_CATEGORIES: SkillCategory[] = ['search', 'write'];
const VALID_PARAM_TYPES: SkillParameterType[] = ['string', 'number', 'boolean', 'array'];

interface SkillBody {
  name?:        string;
  description?: string;
  category?:    string;
  parameters?:  unknown;
  claudeMdRef?: string;
  active?:      boolean;
}

function sanitizeParameters(input: unknown): SkillParameter[] | { error: string } {
  if (input === undefined) return [];
  if (!Array.isArray(input)) return { error: 'parameters deve essere un array' };
  const out: SkillParameter[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== 'object') return { error: 'parametro non valido' };
    const p = raw as Record<string, unknown>;
    const name = typeof p.name === 'string' ? p.name.trim() : '';
    if (!name) return { error: 'parameters[].name obbligatorio' };
    const type = typeof p.type === 'string' && VALID_PARAM_TYPES.includes(p.type as SkillParameterType)
      ? (p.type as SkillParameterType)
      : null;
    if (!type) return { error: `parameters[].type non valido per "${name}"` };
    out.push({
      name,
      type,
      required:     Boolean(p.required),
      description:  typeof p.description === 'string' ? p.description : '',
      defaultValue: p.defaultValue,
    });
  }
  return out;
}

// GET /api/admin/skills?active=true
export const listSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.active === 'true')  filter.active = true;
    if (req.query.active === 'false') filter.active = false;
    const items = await Skill.find(filter).sort({ name: 1 }).lean();
    res.json({ items });
  } catch {
    res.status(500).json({ error: 'Errore recupero skills' });
  }
};

// GET /api/admin/skills/:id
export const getSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const doc = await Skill.findById(req.params.id).lean();
    if (!doc) { res.status(404).json({ error: 'Skill non trovata' }); return; }
    res.json(doc);
  } catch {
    res.status(400).json({ error: 'ID non valido' });
  }
};

// POST /api/admin/skills
export const createSkill = async (req: ClerkRequest, res: Response): Promise<void> => {
  const { name, description, category, parameters, claudeMdRef, active } = req.body as SkillBody;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ error: 'name obbligatorio' });
    return;
  }
  if (!category || !VALID_CATEGORIES.includes(category as SkillCategory)) {
    res.status(400).json({ error: 'category non valida (search | write)' });
    return;
  }
  const params = sanitizeParameters(parameters);
  if (!Array.isArray(params)) { res.status(400).json({ error: params.error }); return; }

  try {
    const existing = await Skill.findOne({ name: name.trim() });
    if (existing) { res.status(409).json({ error: 'Skill con questo nome già esistente' }); return; }
    const doc = await Skill.create({
      name:        name.trim(),
      description: description?.trim() ?? '',
      category,
      parameters:  params,
      claudeMdRef: claudeMdRef?.trim() || undefined,
      active:      active !== undefined ? Boolean(active) : true,
    });
    res.status(201).json(doc.toJSON());
  } catch {
    res.status(500).json({ error: 'Errore creazione skill' });
  }
};

// PUT /api/admin/skills/:id
export const updateSkill = async (req: ClerkRequest, res: Response): Promise<void> => {
  const { name, description, category, parameters, claudeMdRef, active } = req.body as SkillBody;
  const update: Record<string, unknown> = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'name non valido' }); return;
    }
    update.name = name.trim();
  }
  if (description !== undefined) update.description = String(description).trim();
  if (category !== undefined) {
    if (!VALID_CATEGORIES.includes(category as SkillCategory)) {
      res.status(400).json({ error: 'category non valida' }); return;
    }
    update.category = category;
  }
  if (parameters !== undefined) {
    const params = sanitizeParameters(parameters);
    if (!Array.isArray(params)) { res.status(400).json({ error: params.error }); return; }
    update.parameters = params;
  }
  if (claudeMdRef !== undefined) update.claudeMdRef = claudeMdRef?.trim() || undefined;
  if (active !== undefined) update.active = Boolean(active);

  try {
    const doc = await Skill.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!doc) { res.status(404).json({ error: 'Skill non trovata' }); return; }
    res.json(doc.toJSON());
  } catch {
    res.status(400).json({ error: 'Errore aggiornamento skill' });
  }
};

// PATCH /api/admin/skills/:id/toggle
export const toggleSkill = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const doc = await Skill.findById(req.params.id);
    if (!doc) { res.status(404).json({ error: 'Skill non trovata' }); return; }
    doc.active = !doc.active;
    await doc.save();
    res.json(doc.toJSON());
  } catch {
    res.status(400).json({ error: 'Errore toggle skill' });
  }
};

// DELETE /api/admin/skills/:id
export const deleteSkill = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const doc = await Skill.findByIdAndDelete(req.params.id);
    if (!doc) { res.status(404).json({ error: 'Skill non trovata' }); return; }
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: 'Errore eliminazione skill' });
  }
};
