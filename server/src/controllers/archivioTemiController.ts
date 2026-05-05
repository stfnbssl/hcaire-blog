import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import Tema, {
  ITema,
  TEMA_STATI,
  TEMA_STATI_EDITABILI_ARCHIVIO,
  TEMA_STATI_PROMUOVIBILI,
  TemaAsse,
  TemaStato,
} from '../models/Tema';

// ---------- envelope ----------

function ok(res: Response, status: number, data: unknown) {
  return res.status(status).json({ ok: true, data });
}

function err(res: Response, status: number, code: string, message: string, detail: unknown = null) {
  return res.status(status).json({ ok: false, error: { code, message, detail } });
}

// ---------- helpers ----------

const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

function isValidStato(v: unknown): v is TemaStato {
  return typeof v === 'string' && (TEMA_STATI as string[]).includes(v);
}

function sanitizeAsse(v: unknown): TemaAsse | null {
  if (typeof v !== 'string') return null;
  if (['asse_1', 'asse_2', 'asse_3', 'asse_4', 'asse_5', 'asse_6'].includes(v)) {
    return v as TemaAsse;
  }
  return null;
}

function sanitizeFonti(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
}

// ---------- GET /api/archivio/temi ----------

export async function listTemi(req: Request, res: Response) {
  try {
    const statoQuery = req.query.stato as string | undefined;
    const filter: Record<string, unknown> = {};
    if (statoQuery && isValidStato(statoQuery)) {
      filter.stato = statoQuery;
    }

    const temi = await Tema.find(filter).sort({ updatedAt: -1 }).lean();
    return ok(res, 200, { temi });
  } catch (e) {
    console.error('[archivio] listTemi error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel recupero dei temi');
  }
}

// ---------- GET /api/archivio/temi/:temaId ----------

export async function getTema(req: Request, res: Response) {
  try {
    const { temaId } = req.params;
    const tema = await Tema.findOne({ tema_id: temaId }).lean();
    if (!tema) return err(res, 404, 'TEMA_NOT_FOUND', `Tema "${temaId}" non trovato`);
    return ok(res, 200, { tema });
  } catch (e) {
    console.error('[archivio] getTema error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nel recupero del tema');
  }
}

// ---------- POST /api/archivio/temi ----------

interface TemaInputBody {
  tema_id?: string;
  label?: string;
  stato?: string;
  descrizione?: string;
  fonti?: unknown;
  asse_dominante?: unknown;
  note_ricercatore?: string;
}

export async function createTema(req: Request, res: Response) {
  try {
    const body = (req.body ?? {}) as TemaInputBody;

    if (!body.tema_id || typeof body.tema_id !== 'string') {
      return err(res, 400, 'INVALID_TEMA_ID', 'Campo "tema_id" obbligatorio (string)');
    }
    if (!SLUG_RE.test(body.tema_id)) {
      return err(res, 400, 'INVALID_TEMA_ID_FORMAT', 'tema_id deve essere kebab-case (a-z, 0-9, -)');
    }
    if (!body.label || typeof body.label !== 'string') {
      return err(res, 400, 'INVALID_LABEL', 'Campo "label" obbligatorio (string)');
    }

    const stato: TemaStato = isValidStato(body.stato) && (TEMA_STATI_EDITABILI_ARCHIVIO as string[]).includes(body.stato)
      ? body.stato
      : 'bozza';

    const exists = await Tema.findOne({ tema_id: body.tema_id });
    if (exists) {
      return err(res, 409, 'TEMA_ALREADY_EXISTS', `Tema "${body.tema_id}" già esistente`);
    }

    const created = await Tema.create({
      tema_id: body.tema_id,
      label: body.label,
      stato,
      descrizione: typeof body.descrizione === 'string' ? body.descrizione : '',
      fonti: sanitizeFonti(body.fonti),
      asse_dominante: sanitizeAsse(body.asse_dominante),
      note_ricercatore: typeof body.note_ricercatore === 'string' ? body.note_ricercatore : '',
    });

    return ok(res, 201, { tema: created });
  } catch (e) {
    console.error('[archivio] createTema error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nella creazione del tema');
  }
}

// ---------- PUT /api/archivio/temi/:temaId ----------

export async function updateTema(req: Request, res: Response) {
  try {
    const { temaId } = req.params;
    const body = (req.body ?? {}) as TemaInputBody;

    const current = await Tema.findOne({ tema_id: temaId });
    if (!current) return err(res, 404, 'TEMA_NOT_FOUND', `Tema "${temaId}" non trovato`);

    if (!(TEMA_STATI_EDITABILI_ARCHIVIO as string[]).includes(current.stato)) {
      return err(
        res,
        409,
        'TEMA_NOT_EDITABLE',
        `Tema in stato "${current.stato}", non modificabile dall'Archivio. Modificabile solo in: ${TEMA_STATI_EDITABILI_ARCHIVIO.join(', ')}`,
      );
    }

    // Aggiornamento parziale: campi non presenti nel body non vengono toccati.
    const update: Record<string, unknown> = {};
    if (typeof body.label === 'string' && body.label.trim().length > 0) update.label = body.label.trim();
    if (typeof body.descrizione === 'string') update.descrizione = body.descrizione;
    if (body.fonti !== undefined) update.fonti = sanitizeFonti(body.fonti);
    if (body.asse_dominante !== undefined) update.asse_dominante = sanitizeAsse(body.asse_dominante);
    if (typeof body.note_ricercatore === 'string') update.note_ricercatore = body.note_ricercatore;

    // Lo stato è modificabile solo all'interno degli stati editabili (bozza ↔ maturo).
    if (isValidStato(body.stato) && (TEMA_STATI_EDITABILI_ARCHIVIO as string[]).includes(body.stato)) {
      update.stato = body.stato;
    }

    const updated = await Tema.findOneAndUpdate(
      { tema_id: temaId },
      { $set: update },
      { new: true, runValidators: true },
    ).lean();

    return ok(res, 200, { tema: updated });
  } catch (e) {
    console.error('[archivio] updateTema error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nell\'aggiornamento del tema');
  }
}

// ---------- DELETE /api/archivio/temi/:temaId ----------

export async function deleteTema(req: Request, res: Response) {
  try {
    const { temaId } = req.params;
    const current = await Tema.findOne({ tema_id: temaId });
    if (!current) return err(res, 404, 'TEMA_NOT_FOUND', `Tema "${temaId}" non trovato`);

    if (!(TEMA_STATI_EDITABILI_ARCHIVIO as string[]).includes(current.stato)) {
      return err(
        res,
        409,
        'TEMA_NOT_DELETABLE',
        `Tema in stato "${current.stato}", non eliminabile dall'Archivio. Solo i temi bozza/maturo sono eliminabili.`,
      );
    }

    await Tema.deleteOne({ tema_id: temaId });
    return ok(res, 200, { tema_id: temaId, deleted: true });
  } catch (e) {
    console.error('[archivio] deleteTema error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nell\'eliminazione del tema');
  }
}

// ---------- POST /api/archivio/temi/:temaId/promuovi ----------

export async function promuoveTema(req: Request, res: Response) {
  try {
    const { temaId } = req.params;
    const auth = getAuth(req);
    const userId = auth.userId ?? 'unknown';

    const current = await Tema.findOne({ tema_id: temaId });
    if (!current) return err(res, 404, 'TEMA_NOT_FOUND', `Tema "${temaId}" non trovato`);

    if (!(TEMA_STATI_PROMUOVIBILI as string[]).includes(current.stato)) {
      return err(
        res,
        409,
        'TEMA_NOT_PROMUOVIBILE',
        `Tema in stato "${current.stato}", non promuovibile. Promuovibile solo in stato: ${TEMA_STATI_PROMUOVIBILI.join(', ')}`,
      );
    }

    const now = new Date();
    const updated = await Tema.findOneAndUpdate(
      { tema_id: temaId },
      { $set: { stato: 'promosso', promosso_at: now } },
      { new: true },
    ).lean();

    console.log(`[archivio] tema "${temaId}" promosso da ${userId} a stato 'promosso'`);
    return ok(res, 200, { tema: updated });
  } catch (e) {
    console.error('[archivio] promuoveTema error:', e);
    return err(res, 500, 'INTERNAL_ERROR', 'Errore nella promozione del tema');
  }
}
