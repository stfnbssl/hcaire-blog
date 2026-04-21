import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import FoundationDocument from '../models/bartleby/FoundationDocument';
import ConceptNode from '../models/bartleby/ConceptNode';
import DomainArea from '../models/bartleby/DomainArea';
import AreaSheet from '../models/bartleby/AreaSheet';
import Skill from '../models/bartleby/Skill';
import OutputTemplate from '../models/bartleby/OutputTemplate';
import InputTrace from '../models/bartleby/InputTrace';
import OutputDocument from '../models/bartleby/OutputDocument';
import WorkflowLog from '../models/WorkflowLog';
import {
  FoundationDocumentNode,
  AreaSheetNode,
  SkillNode,
  SkillArea,
} from '../models/bartleby/BridgeTables';
import { ClerkRequest, checkIsAdmin } from '../middleware/clerkAuth';
import { logBartlebyWorkflow } from '../services/workflowLogger';
import type { LogStep, LogActor } from '../models/ArticleRequest';
import { getRedisClient, CHANNEL_BARTLEBY_TRACE_NEW } from '../config/redis';

// ─── Knowledge Base (pubblici) ────────────────────────────────────────────────

export const getConceptNodes = async (_req: Request, res: Response): Promise<void> => {
  const nodes = await ConceptNode.find().select('-__v').lean();
  res.json(nodes);
};

export const getConceptNodeById = async (req: Request, res: Response): Promise<void> => {
  const node = await ConceptNode.findOne({ bartlebyId: req.params.id }).select('-__v').lean();
  if (!node) { res.status(404).json({ error: 'Nodo non trovato' }); return; }

  // Ambiti in cui il nodo è prioritario
  const asnLinks = await AreaSheetNode.find({ concept_node_id: req.params.id }).lean();
  const areaSheetIds = asnLinks.map((l) => l.area_sheet_id);
  const areaSheets = await AreaSheet.find({ bartlebyId: { $in: areaSheetIds } })
    .select('bartlebyId title domain_area_id').lean();

  // Skill collegate
  const snLinks = await SkillNode.find({ concept_node_id: req.params.id }).lean();
  const skillIds = snLinks.map((l) => l.skill_id);
  const skills = await Skill.find({ bartlebyId: { $in: skillIds } })
    .select('bartlebyId name slug skill_type description').lean();

  // Output esemplificativi
  const outputs = await OutputDocument.find({ activated_nodes: req.params.id })
    .select('bartlebyId title output_type audience created_at').lean();

  res.json({ ...node, related_area_sheets: areaSheets, related_skills: skills, example_outputs: outputs });
};

export const getDomainAreas = async (_req: Request, res: Response): Promise<void> => {
  const areas = await DomainArea.find().select('-__v').lean();
  res.json(areas);
};

export const getDomainAreaById = async (req: Request, res: Response): Promise<void> => {
  const area = await DomainArea.findOne({ bartlebyId: req.params.id }).select('-__v').lean();
  if (!area) { res.status(404).json({ error: 'Ambito non trovato' }); return; }

  const sheet = await AreaSheet.findOne({ domain_area_id: req.params.id }).select('-__v').lean();

  // Nodi prioritari per questo ambito
  let priorityNodes: unknown[] = [];
  if (sheet) {
    const asnLinks = await AreaSheetNode.find({ area_sheet_id: (sheet as { bartlebyId: string }).bartlebyId }).lean();
    const nodeIds = asnLinks.map((l) => l.concept_node_id);
    priorityNodes = await ConceptNode.find({ bartlebyId: { $in: nodeIds } })
      .select('bartlebyId name slug priority_level').lean();
  }

  res.json({ ...area, area_sheet: sheet, priority_nodes: priorityNodes });
};

export const getSkills = async (req: Request, res: Response): Promise<void> => {
  const filter: Record<string, unknown> = {};
  if (req.query.type) filter.skill_type = req.query.type;
  const skills = await Skill.find(filter).select('-__v -instruction_payload').lean();
  res.json(skills);
};

export const getSkillById = async (req: Request, res: Response): Promise<void> => {
  const skill = await Skill.findOne({ bartlebyId: req.params.id }).select('-__v').lean();
  if (!skill) { res.status(404).json({ error: 'Skill non trovata' }); return; }

  // Nodi collegati
  const snLinks = await SkillNode.find({ skill_id: req.params.id }).lean();
  const nodeIds = snLinks.map((l) => l.concept_node_id);
  const nodes = await ConceptNode.find({ bartlebyId: { $in: nodeIds } })
    .select('bartlebyId name slug priority_level').lean();

  // Ambiti in cui opera
  const saLinks = await SkillArea.find({ skill_id: req.params.id }).lean();
  const areaIds = saLinks.map((l) => l.domain_area_id);
  const areas = await DomainArea.find({ bartlebyId: { $in: areaIds } })
    .select('bartlebyId name slug').lean();

  res.json({ ...skill, related_nodes: nodes, related_areas: areas });
};

export const getFoundationDocuments = async (_req: Request, res: Response): Promise<void> => {
  const docs = await FoundationDocument.find().select('-__v -body').lean();
  res.json(docs);
};

export const getFoundationDocumentById = async (req: Request, res: Response): Promise<void> => {
  const doc = await FoundationDocument.findOne({ bartlebyId: req.params.id }).select('-__v').lean();
  if (!doc) { res.status(404).json({ error: 'Documento non trovato' }); return; }

  // Nodi generati da questo documento
  const fdnLinks = await FoundationDocumentNode.find({ foundation_document_id: req.params.id }).lean();
  const nodeIds = fdnLinks.map((l) => l.concept_node_id);
  const nodes = await ConceptNode.find({ bartlebyId: { $in: nodeIds } })
    .select('bartlebyId name slug priority_level').lean();

  res.json({ ...doc, generated_nodes: nodes });
};

export const getOutputTemplates = async (_req: Request, res: Response): Promise<void> => {
  const templates = await OutputTemplate.find().select('-__v').lean();
  res.json(templates);
};

// ─── Output Documents (pubblici) ─────────────────────────────────────────────

export const getOutputDocuments = async (_req: Request, res: Response): Promise<void> => {
  const outputs = await OutputDocument.find()
    .select('bartlebyId title output_type audience area_id activated_nodes skills_used status version created_at evaluation user_id')
    .lean();
  res.json(outputs);
};

export const getOutputDocumentById = async (req: Request, res: Response): Promise<void> => {
  const output = await OutputDocument.findOne({ bartlebyId: req.params.id }).select('-__v').lean();
  if (!output) { res.status(404).json({ error: 'Output non trovato' }); return; }

  const typedOutput = output as {
    input_trace_id: string;
    area_id: string;
    activated_nodes: string[];
    skills_used: string[];
  };

  // Traccia di origine
  const tid = typedOutput.input_trace_id;
  const trace = await InputTrace.findOne({
    $or: [
      { bartlebyId: tid },
      { corpus_id: tid },
      ...(tid?.match(/^[a-f\d]{24}$/i) ? [{ _id: tid }] : []),
    ],
  }).select('-__v').lean();

  // Ambito
  const area = await DomainArea.findOne({ bartlebyId: typedOutput.area_id })
    .select('bartlebyId name slug').lean();

  // Nodi attivati (con dettaglio)
  const activatedNodes = await ConceptNode.find({ bartlebyId: { $in: typedOutput.activated_nodes } })
    .select('bartlebyId name slug definition priority_level').lean();

  // Skill usate (con dettaglio)
  const skillsUsed = await Skill.find({ bartlebyId: { $in: typedOutput.skills_used } })
    .select('bartlebyId name slug skill_type description').lean();

  res.json({ ...output, trace, area, activated_nodes_detail: activatedNodes, skills_used_detail: skillsUsed });
};

// ─── Input Traces (protetto: solo admin) ─────────────────────────────────────

export const submitTrace = async (req: ClerkRequest, res: Response): Promise<void> => {
  const { raw_text, context_notes, target_output_type, requested_area_id } = req.body as {
    raw_text: string;
    context_notes?: string;
    target_output_type?: string;
    requested_area_id?: string;
  };

  if (!raw_text?.trim()) {
    res.status(400).json({ error: 'raw_text è obbligatorio' });
    return;
  }

  const trace = await InputTrace.create({
    user_id: req.clerkUserId,
    raw_text: raw_text.trim(),
    context_notes: context_notes?.trim(),
    target_output_type,
    requested_area_id,
    status: 'pending',
  });

  const traceId = trace._id.toString();
  await logBartlebyWorkflow(traceId, 'trace_submitted', 'server', 'Traccia salvata', 'pending');

  try {
    const redis = getRedisClient();
    const payload = JSON.stringify({
      traceId,
      userId: req.clerkUserId,
      outputType: target_output_type,
      areaId: requested_area_id,
    });
    await redis.publish(CHANNEL_BARTLEBY_TRACE_NEW, payload);
    await logBartlebyWorkflow(traceId, 'trace_queued', 'server', 'Job pubblicato su Redis', 'pending');
  } catch (err) {
    console.error('[bartlebyController] Errore pubblicazione Redis:', err);
    // Non bloccare la risposta — la traccia è già salvata
  }

  res.status(201).json(trace);
};

export const getMyTraces = async (req: ClerkRequest, res: Response): Promise<void> => {
  const traces = await InputTrace.find({ user_id: req.clerkUserId })
    .sort({ createdAt: -1 })
    .select('-__v')
    .lean();
  res.json(traces);
};

// ─── Output Documents (protetti) ─────────────────────────────────────────────

export const createOutputDocument = async (req: ClerkRequest, res: Response): Promise<void> => {
  const {
    bartlebyId, input_trace_id, generation_plan_id, user_id,
    output_type, title, body, body_summary, audience, area_id,
    activated_nodes, skills_used, evaluation, status, version, created_at,
  } = req.body as {
    bartlebyId: string;
    input_trace_id: string;
    generation_plan_id?: string;
    user_id?: string;
    output_type: string;
    title: string;
    body: string;
    body_summary?: string;
    audience?: string;
    area_id?: string;
    activated_nodes?: string[];
    skills_used?: string[];
    evaluation?: unknown;
    status?: string;
    version?: string;
    created_at?: string;
  };

  if (!bartlebyId || !input_trace_id || !output_type || !title || !body) {
    res.status(400).json({ error: 'Campi obbligatori mancanti: bartlebyId, input_trace_id, output_type, title, body' });
    return;
  }

  const existing = await OutputDocument.findOne({ bartlebyId });
  if (existing) {
    res.status(409).json({ error: `OutputDocument con bartlebyId "${bartlebyId}" già esistente` });
    return;
  }

  const doc = await OutputDocument.create({
    bartlebyId, input_trace_id, generation_plan_id, user_id,
    output_type, title, body, body_summary, audience, area_id,
    activated_nodes: activated_nodes ?? [],
    skills_used: skills_used ?? [],
    evaluation,
    status: status ?? 'revisionato',
    version: version ?? '1.0',
    created_at,
  });

  res.status(201).json(doc);
};

export const getMyOutputDocuments = async (req: Request, res: Response): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: 'Autenticazione richiesta' });
    return;
  }

  const outputs = await OutputDocument.find({ user_id: userId })
    .sort({ _id: -1 })
    .select('bartlebyId title output_type audience area_id activated_nodes skills_used status version created_at evaluation body_summary')
    .lean();

  res.json(outputs);
};

// ─── Workflow log Bartleby (chiamato dal worker via API key) ─────────────────

export const addBartlebyLog = async (req: Request, res: Response): Promise<void> => {
  const traceId = req.params.id;
  const { step, actor, message, requestStatus } = req.body as {
    step: LogStep;
    actor: LogActor;
    message: string;
    requestStatus?: string;
  };

  if (!step || !actor || !message) {
    res.status(400).json({ error: 'step, actor e message sono obbligatori' });
    return;
  }

  await logBartlebyWorkflow(traceId, step, actor, message, requestStatus);
  res.json({ ok: true });
};

export const getBartlebyLogs = async (req: Request, res: Response): Promise<void> => {
  const limit = Math.min(parseInt(req.query.limit as string) || 200, 500);
  const traceId = req.query.traceId as string | undefined;

  const filter: Record<string, unknown> = { workflow_type: 'bartleby' };
  if (traceId) filter.traceId = traceId;

  const logs = await WorkflowLog.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit);
  res.json(logs);
};

export const deleteOutputDocument = async (req: Request, res: Response): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: 'Autenticazione richiesta' });
    return;
  }

  const output = await OutputDocument.findOne({ bartlebyId: req.params.id }).lean();
  if (!output) {
    res.status(404).json({ error: 'Output non trovato' });
    return;
  }

  const isOwner = (output as { user_id?: string }).user_id === userId;
  const isAdmin = await checkIsAdmin(userId);

  if (!isOwner && !isAdmin) {
    res.status(403).json({ error: 'Non autorizzato a eliminare questo output' });
    return;
  }

  await OutputDocument.deleteOne({ bartlebyId: req.params.id });
  res.json({ message: 'Output eliminato' });
};
