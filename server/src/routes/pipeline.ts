import { Router } from 'express';
import { requireAdmin } from '../middleware/clerkAuth';
import {
  getIndex,
  getStepConfig,
  getTema,
  getRicerca,
  getStepHistory,
  runStep,
  cancelExecution,
  verifyExecution,
  skipStep,
  resetStep,
  getExecutionOutput,
  getStepInputs,
  postStepInput,
  deleteExternalInput,
  getTemaPendingDecision,
  getRicercaPendingDecision,
  postRicercaDecision,
  postTemaDecision,
  streamExecutionLogs,
  createRicerca,
  getSystemStatus,
} from '../controllers/pipelineController';

const router = Router();

// ---- Endpoint di lettura (public) — D4 §2 ----
router.get('/index', getIndex);
router.get('/step-config', getStepConfig);
router.get('/temi/:temaId', getTema);
router.get('/ricerche/:ricercaId', getRicerca);
router.get('/temi/:temaId/steps/:stepId/history', getStepHistory);
router.get('/executions/:executionId/output', getExecutionOutput);

// ---- Endpoint di orchestrazione (admin) — D4 §3 ----
router.post('/temi/:temaId/steps/:stepId/run', requireAdmin, runStep);
router.delete('/executions/:executionId', requireAdmin, cancelExecution);
router.post('/executions/:executionId/verify', requireAdmin, verifyExecution);
router.post('/temi/:temaId/steps/:stepId/skip', requireAdmin, skipStep);
router.post('/temi/:temaId/steps/:stepId/reset', requireAdmin, resetStep);

// ---- Endpoint input esterni — D4 §4 ----
router.get('/temi/:temaId/steps/:stepId/inputs', getStepInputs);
router.post('/temi/:temaId/steps/:stepId/inputs', requireAdmin, postStepInput);
router.delete('/external-inputs/:inputDocId', requireAdmin, deleteExternalInput);

// ---- Endpoint decisioni umane — D4 §5 ----
router.get('/temi/:temaId/pending-decision', getTemaPendingDecision);
router.get('/ricerche/:ricercaId/pending-decision', getRicercaPendingDecision);
router.post('/ricerche/:ricercaId/decisions', requireAdmin, postRicercaDecision);
router.post('/temi/:temaId/decisions', requireAdmin, postTemaDecision);

// ---- SSE log streaming — D4 §6 ----
router.get('/executions/:executionId/logs', streamExecutionLogs);

// ---- Endpoint contestuali — D4 §7 ----
router.post('/ricerche', requireAdmin, createRicerca);
router.get('/system/status', requireAdmin, getSystemStatus);

export default router;
