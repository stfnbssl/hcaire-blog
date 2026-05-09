import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchJobDefinitions,
  fetchSkills,
  fetchPlugins,
  createJobDefinition,
  updateJobDefinition,
  deleteJobDefinition,
} from '../services/jobsService';
import type { JobDefinition, JobType } from '@shared/types/jobs';

const JOB_TYPES: JobType[] = ['research', 'write', 'research-and-write'];

interface EditState {
  mode: 'create' | 'edit';
  id?: string;
  name: string;
  type: JobType;
  description: string;
  skills: string[];
  plugins: string[];
  defaultParamsText: string;
  active: boolean;
}

const EMPTY: EditState = {
  mode: 'create',
  name: '',
  type: 'research',
  description: '',
  skills: [],
  plugins: [],
  defaultParamsText: '{}',
  active: true,
};

export default function AdminJobDefinitions() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<EditState | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function token(): Promise<string> {
    const t = await getToken();
    if (!t) throw new Error('Sessione scaduta');
    return t;
  }

  const defsQ = useQuery({
    queryKey: ['admin', 'job-definitions'],
    queryFn: async () => fetchJobDefinitions(await token()),
  });
  const skillsQ = useQuery({
    queryKey: ['admin', 'skills'],
    queryFn: async () => fetchSkills(await token()),
  });
  const pluginsQ = useQuery({
    queryKey: ['admin', 'plugins'],
    queryFn: async () => fetchPlugins(await token()),
  });

  const saveM = useMutation({
    mutationFn: async (state: EditState) => {
      const t = await token();
      let defaultParams: Record<string, unknown>;
      try {
        defaultParams = JSON.parse(state.defaultParamsText || '{}');
        if (typeof defaultParams !== 'object' || defaultParams === null || Array.isArray(defaultParams)) {
          throw new Error('defaultParams deve essere un oggetto');
        }
      } catch (e) {
        throw new Error('JSON defaultParams non valido: ' + (e as Error).message);
      }
      const payload = {
        name: state.name.trim(),
        type: state.type,
        description: state.description.trim(),
        skills: state.skills,
        plugins: state.plugins,
        defaultParams,
        active: state.active,
      };
      return state.mode === 'create'
        ? createJobDefinition(t, payload)
        : updateJobDefinition(t, state.id!, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'job-definitions'] });
      setEditing(null);
      setError(null);
    },
    onError: (e: Error) => setError(e.message),
  });

  const deleteM = useMutation({
    mutationFn: async (id: string) => deleteJobDefinition(await token(), id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'job-definitions'] }),
    onError: (e: Error) => setError(e.message),
  });

  const startEdit = (d: JobDefinition) => setEditing({
    mode: 'edit',
    id: d._id,
    name: d.name,
    type: d.type,
    description: d.description,
    skills: d.skills,
    plugins: d.plugins,
    defaultParamsText: JSON.stringify(d.defaultParams ?? {}, null, 2),
    active: d.active,
  });

  const items   = defsQ.data ?? [];
  const skills  = skillsQ.data ?? [];
  const plugins = pluginsQ.data ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Definitions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Template di job che combinano skills, plugins e parametri di default. Usati per lanciare nuove esecuzioni.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ ...EMPTY })}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Nuova definizione
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {defsQ.isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Skills</th>
                <th className="px-4 py-3">Plugins</th>
                <th className="px-4 py-3">Stato</th>
                <th className="px-4 py-3 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    Nessuna job definition. Crea la prima.
                  </td>
                </tr>
              ) : (
                items.map((d) => (
                  <tr key={d._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {d.name}
                      {d.description && (
                        <p className="text-xs text-gray-500 font-normal mt-0.5">{d.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {d.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{d.skills.length}</td>
                    <td className="px-4 py-3 text-gray-600">{d.plugins.length}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                        d.active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {d.active ? 'attiva' : 'inattiva'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => startEdit(d)}
                        className="text-primary-600 hover:text-primary-800 mr-3"
                      >
                        Modifica
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Eliminare definizione "${d.name}"?`)) deleteM.mutate(d._id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <DefEditModal
          state={editing}
          setState={setEditing}
          allSkills={skills}
          allPlugins={plugins}
          onSave={() => saveM.mutate(editing)}
          saving={saveM.isPending}
        />
      )}
    </div>
  );
}

function DefEditModal({
  state, setState, allSkills, allPlugins, onSave, saving,
}: {
  state: EditState;
  setState: (s: EditState | null) => void;
  allSkills: { _id: string; name: string }[];
  allPlugins: { _id: string; name: string }[];
  onSave: () => void;
  saving: boolean;
}) {
  const toggleId = (key: 'skills' | 'plugins', id: string) => {
    const cur = state[key];
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    setState({ ...state, [key]: next });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-8 px-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 my-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {state.mode === 'create' ? 'Nuova job definition' : `Modifica: ${state.name}`}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nome</label>
              <input
                type="text"
                value={state.name}
                onChange={(e) => setState({ ...state, name: e.target.value })}
                placeholder="es. Saggio filosofico con ricerca Obsidian"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Tipo</label>
              <select
                value={state.type}
                onChange={(e) => setState({ ...state, type: e.target.value as JobType })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              >
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Descrizione</label>
            <textarea
              rows={2}
              value={state.description}
              onChange={(e) => setState({ ...state, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Skills</label>
            {allSkills.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Nessuna skill disponibile.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allSkills.map((s) => {
                  const checked = state.skills.includes(s._id);
                  return (
                    <button
                      key={s._id}
                      type="button"
                      onClick={() => toggleId('skills', s._id)}
                      className={`text-xs px-3 py-1 rounded-full border ${
                        checked
                          ? 'bg-primary-50 border-primary-300 text-primary-700'
                          : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Plugins</label>
            {allPlugins.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Nessun plugin disponibile.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allPlugins.map((p) => {
                  const checked = state.plugins.includes(p._id);
                  return (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => toggleId('plugins', p._id)}
                      className={`text-xs px-3 py-1 rounded-full border ${
                        checked
                          ? 'bg-primary-50 border-primary-300 text-primary-700'
                          : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Parametri di default (JSON)
            </label>
            <textarea
              rows={6}
              value={state.defaultParamsText}
              onChange={(e) => setState({ ...state, defaultParamsText: e.target.value })}
              spellCheck={false}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary-500"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={state.active}
              onChange={(e) => setState({ ...state, active: e.target.checked })}
            />
            Attiva
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setState(null)}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving || !state.name.trim()}
            className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium disabled:opacity-50"
          >
            {saving ? 'Salvataggio…' : 'Salva'}
          </button>
        </div>
      </div>
    </div>
  );
}
