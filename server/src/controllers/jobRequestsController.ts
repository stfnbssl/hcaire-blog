import { Request, Response } from 'express';
import { Types } from 'mongoose';
import JobRequest from '../models/JobRequest';
import JobDefinition from '../models/JobDefinition';
import type { ClerkRequest } from '../middleware/clerkAuth';
import type { JobStatus } from '../../../shared/types/jobs';

const VALID_STATUS: JobStatus[] = ['pending', 'processing', 'completed', 'failed'];

interface JobRequestBody {
  jobDefinitionId?: string;
  params?:          Record<string, unknown>;
}

// GET /api/admin/job-requests?status=pending
export const listJobRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (typeof req.query.status === 'string' && VALID_STATUS.includes(req.query.status as JobStatus)) {
      filter.status = req.query.status;
    }
    const items = await JobRequest.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ items });
  } catch {
    res.status(500).json({ error: 'Errore recupero job requests' });
  }
};

// GET /api/admin/job-requests/:id
export const getJobRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const doc = await JobRequest.findById(req.params.id).lean();
    if (!doc) { res.status(404).json({ error: 'Job request non trovata' }); return; }
    res.json(doc);
  } catch {
    res.status(400).json({ error: 'ID non valido' });
  }
};

// POST /api/admin/job-requests
// Crea record con status='pending'. Integrazione Redis/Co-work in fase successiva.
export const createJobRequest = async (req: ClerkRequest, res: Response): Promise<void> => {
  const { jobDefinitionId, params } = req.body as JobRequestBody;

  if (!jobDefinitionId || typeof jobDefinitionId !== 'string' || !Types.ObjectId.isValid(jobDefinitionId)) {
    res.status(400).json({ error: 'jobDefinitionId non valido' }); return;
  }
  if (params !== undefined && (typeof params !== 'object' || params === null || Array.isArray(params))) {
    res.status(400).json({ error: 'params deve essere un oggetto' }); return;
  }

  try {
    const jobDef = await JobDefinition.findById(jobDefinitionId).lean();
    if (!jobDef) { res.status(404).json({ error: 'Job definition non trovata' }); return; }
    if (!jobDef.active) { res.status(400).json({ error: 'Job definition non attiva' }); return; }

    const doc = await JobRequest.create({
      jobDefinitionId,
      params: params ?? {},
      status: 'pending',
    });
    // TODO: pubblicare su Redis canale `job:request` quando integrazione Co-work sarà attiva
    res.status(201).json(doc.toJSON());
  } catch {
    res.status(500).json({ error: 'Errore creazione job request' });
  }
};

// DELETE /api/admin/job-requests/:id  — solo se ancora pending
export const deleteJobRequest = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const doc = await JobRequest.findById(req.params.id);
    if (!doc) { res.status(404).json({ error: 'Job request non trovata' }); return; }
    if (doc.status !== 'pending') {
      res.status(409).json({ error: 'Eliminabile solo se in stato pending' }); return;
    }
    await doc.deleteOne();
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: 'Errore eliminazione job request' });
  }
};
