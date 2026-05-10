// Tipi condivisi tra server e client per la gestione di Skills, Plugins,
// JobDefinitions e JobRequests. Usati per il payload API: i Document
// Mongoose lato server hanno proprie interfacce in /server/src/models/.

export type SkillCategory = 'search' | 'write';

export type SkillParameterType = 'string' | 'number' | 'boolean' | 'array';

export interface SkillParameter {
  name: string;
  type: SkillParameterType;
  required: boolean;
  description: string;
  defaultValue?: unknown;
}

export interface Skill {
  _id: string;
  name: string;
  description: string;
  category: SkillCategory;
  parameters: SkillParameter[];
  claudeMdRef?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Plugin {
  _id: string;
  name: string;
  description: string;
  config: Record<string, unknown>;
  compatibleSkills: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type JobType = 'research' | 'write' | 'research-and-write';

export interface JobDefinition {
  _id: string;
  name: string;
  type: JobType;
  description: string;
  skills: string[];
  plugins: string[];
  defaultParams: Record<string, unknown>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface JobRequest {
  _id: string;
  jobDefinitionId: string;
  params: Record<string, unknown>;
  status: JobStatus;
  result?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// DTO per la creazione (omette i campi gestiti dal server)
export type SkillCreateInput = Omit<Skill, '_id' | 'createdAt' | 'updatedAt'>;
export type PluginCreateInput = Omit<Plugin, '_id' | 'createdAt' | 'updatedAt'>;
export type JobDefinitionCreateInput = Omit<JobDefinition, '_id' | 'createdAt' | 'updatedAt'>;
export type JobRequestCreateInput = Pick<JobRequest, 'jobDefinitionId' | 'params'>;
