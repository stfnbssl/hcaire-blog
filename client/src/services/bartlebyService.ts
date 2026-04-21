import { apiRequest } from './apiClient';
import type {
  ConceptNode,
  DomainArea,
  Skill,
  FoundationDocument,
  OutputTemplate,
  OutputDocument,
  InputTrace,
  TraceFormData,
} from '../types/bartleby';

const BASE = '/bartleby';

// ─── Knowledge Base (pubblici) ────────────────────────────────────────────────

export const getConceptNodes = () =>
  apiRequest<ConceptNode[]>(`${BASE}/concept-nodes`);

export const getConceptNodeById = (id: string) =>
  apiRequest<ConceptNode>(`${BASE}/concept-nodes/${id}`);

export const getDomainAreas = () =>
  apiRequest<DomainArea[]>(`${BASE}/domain-areas`);

export const getDomainAreaById = (id: string) =>
  apiRequest<DomainArea>(`${BASE}/domain-areas/${id}`);

export const getSkills = (type?: string) =>
  apiRequest<Skill[]>(`${BASE}/skills${type ? `?type=${type}` : ''}`);

export const getSkillById = (id: string) =>
  apiRequest<Skill>(`${BASE}/skills/${id}`);

export const getFoundationDocuments = () =>
  apiRequest<FoundationDocument[]>(`${BASE}/foundation-documents`);

export const getFoundationDocumentById = (id: string) =>
  apiRequest<FoundationDocument>(`${BASE}/foundation-documents/${id}`);

export const getOutputTemplates = () =>
  apiRequest<OutputTemplate[]>(`${BASE}/output-templates`);

export const getOutputDocuments = () =>
  apiRequest<OutputDocument[]>(`${BASE}/output-documents`);

export const getOutputDocumentById = (id: string) =>
  apiRequest<OutputDocument>(`${BASE}/output-documents/${id}`);

export const getMyOutputDocuments = (token: string) =>
  apiRequest<OutputDocument[]>(`${BASE}/output-documents/mine`, { token });

export const deleteOutputDocument = (id: string, token: string) =>
  apiRequest<{ message: string }>(`${BASE}/output-documents/${id}`, {
    method: 'DELETE',
    token,
  });

// ─── Tracce (richiedono token admin) ─────────────────────────────────────────

export const submitTrace = (data: TraceFormData, token: string) =>
  apiRequest<InputTrace>(`${BASE}/traces`, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });

export const getMyTraces = (token: string) =>
  apiRequest<InputTrace[]>(`${BASE}/traces/mine`, { token });
