import { Router } from 'express';
import { authenticateClerk, requireAdmin } from '../middleware/clerkAuth';
import { authenticateApiKey } from '../middleware/apiKeyAuth';
import {
  getConceptNodes,
  getConceptNodeById,
  getDomainAreas,
  getDomainAreaById,
  getSkills,
  getSkillById,
  getFoundationDocuments,
  getFoundationDocumentById,
  getOutputTemplates,
  getOutputDocuments,
  getOutputDocumentById,
  createOutputDocument,
  getMyOutputDocuments,
  deleteOutputDocument,
  submitTrace,
  getMyTraces,
  addBartlebyLog,
  getBartlebyLogs,
} from '../controllers/bartlebyController';

const router = Router();

// ─── KB pubblica ──────────────────────────────────────────────────────────────
router.get('/concept-nodes',              getConceptNodes);
router.get('/concept-nodes/:id',          getConceptNodeById);
router.get('/domain-areas',               getDomainAreas);
router.get('/domain-areas/:id',           getDomainAreaById);
router.get('/skills',                     getSkills);
router.get('/skills/:id',                 getSkillById);
router.get('/foundation-documents',       getFoundationDocuments);
router.get('/foundation-documents/:id',   getFoundationDocumentById);
router.get('/output-templates',           getOutputTemplates);
router.get('/output-documents',           getOutputDocuments);

// ─── Output Documents (protetti) - prima del parametrico /:id ────────────────
router.post('/output-documents',          authenticateApiKey, createOutputDocument);
router.get('/output-documents/mine',      authenticateClerk, getMyOutputDocuments);

// ─── Output Documents (pubblici, parametrici) ────────────────────────────────
router.get('/output-documents/:id',       getOutputDocumentById);
router.delete('/output-documents/:id',    authenticateClerk, deleteOutputDocument);

// ─── Trace + Log ─────────────────────────────────────────────────────────────
router.post('/traces',           authenticateClerk, requireAdmin, submitTrace);
router.get('/traces/mine',       authenticateClerk, requireAdmin, getMyTraces);
router.post('/traces/:id/log',   authenticateApiKey, addBartlebyLog);
router.get('/logs',              authenticateClerk, requireAdmin, getBartlebyLogs);

export default router;
