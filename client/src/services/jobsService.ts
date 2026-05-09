import { apiRequest } from './apiClient';
import type {
  Skill,
  Plugin,
  JobDefinition,
  JobRequest,
  SkillCreateInput,
  PluginCreateInput,
  JobDefinitionCreateInput,
  JobRequestCreateInput,
} from '@shared/types/jobs';

// ─── Skills ──────────────────────────────────────────────────────────

export async function fetchSkills(token: string, activeOnly = false): Promise<Skill[]> {
  const qs = activeOnly ? '?active=true' : '';
  const { items } = await apiRequest<{ items: Skill[] }>(`/admin/skills${qs}`, { token });
  return items;
}

export async function createSkill(token: string, payload: SkillCreateInput): Promise<Skill> {
  return apiRequest<Skill>('/admin/skills', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export async function updateSkill(token: string, id: string, payload: Partial<SkillCreateInput>): Promise<Skill> {
  return apiRequest<Skill>(`/admin/skills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    token,
  });
}

export async function toggleSkill(token: string, id: string): Promise<Skill> {
  return apiRequest<Skill>(`/admin/skills/${id}/toggle`, { method: 'PATCH', token });
}

export async function deleteSkill(token: string, id: string): Promise<void> {
  await apiRequest<{ ok: boolean }>(`/admin/skills/${id}`, { method: 'DELETE', token });
}

// ─── Plugins ─────────────────────────────────────────────────────────

export async function fetchPlugins(token: string, activeOnly = false): Promise<Plugin[]> {
  const qs = activeOnly ? '?active=true' : '';
  const { items } = await apiRequest<{ items: Plugin[] }>(`/admin/plugins${qs}`, { token });
  return items;
}

export async function createPlugin(token: string, payload: PluginCreateInput): Promise<Plugin> {
  return apiRequest<Plugin>('/admin/plugins', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export async function updatePlugin(token: string, id: string, payload: Partial<PluginCreateInput>): Promise<Plugin> {
  return apiRequest<Plugin>(`/admin/plugins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    token,
  });
}

export async function togglePlugin(token: string, id: string): Promise<Plugin> {
  return apiRequest<Plugin>(`/admin/plugins/${id}/toggle`, { method: 'PATCH', token });
}

export async function deletePlugin(token: string, id: string): Promise<void> {
  await apiRequest<{ ok: boolean }>(`/admin/plugins/${id}`, { method: 'DELETE', token });
}

// ─── Job Definitions ─────────────────────────────────────────────────

export async function fetchJobDefinitions(token: string, activeOnly = false): Promise<JobDefinition[]> {
  const qs = activeOnly ? '?active=true' : '';
  const { items } = await apiRequest<{ items: JobDefinition[] }>(`/admin/job-definitions${qs}`, { token });
  return items;
}

export async function createJobDefinition(token: string, payload: JobDefinitionCreateInput): Promise<JobDefinition> {
  return apiRequest<JobDefinition>('/admin/job-definitions', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export async function updateJobDefinition(token: string, id: string, payload: Partial<JobDefinitionCreateInput>): Promise<JobDefinition> {
  return apiRequest<JobDefinition>(`/admin/job-definitions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    token,
  });
}

export async function deleteJobDefinition(token: string, id: string): Promise<void> {
  await apiRequest<{ ok: boolean }>(`/admin/job-definitions/${id}`, { method: 'DELETE', token });
}

// ─── Job Requests ────────────────────────────────────────────────────

export async function fetchJobRequests(token: string, status?: string): Promise<JobRequest[]> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  const { items } = await apiRequest<{ items: JobRequest[] }>(`/admin/job-requests${qs}`, { token });
  return items;
}

export async function fetchJobRequest(token: string, id: string): Promise<JobRequest> {
  return apiRequest<JobRequest>(`/admin/job-requests/${id}`, { token });
}

export async function createJobRequest(token: string, payload: JobRequestCreateInput): Promise<JobRequest> {
  return apiRequest<JobRequest>('/admin/job-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export async function deleteJobRequest(token: string, id: string): Promise<void> {
  await apiRequest<{ ok: boolean }>(`/admin/job-requests/${id}`, { method: 'DELETE', token });
}
