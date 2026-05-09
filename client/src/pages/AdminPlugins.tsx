import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPlugins,
  fetchSkills,
  createPlugin,
  updatePlugin,
  togglePlugin,
  deletePlugin,
} from '../services/jobsService';
import type { Plugin } from '@shared/types/jobs';

interface EditState {
  mode: 'create' | 'edit';
  id?: string;
  name: string;
  description: string;
  configText: string;       // editor JSON come stringa
  compatibleSkills: string[];
  active: boolean;
}

const EMPTY: EditState = {
  mode: 'create',
  name: '',
  description: '',
  configText: '{}',
  compatibleSkills: [],
  active: true,
};

export default function AdminPlugins() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<EditState | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function token(): Promise<string> {
    const t = await getToken();
    if (!t) throw new Error('Sessione scaduta');
    return t;
  }

  const pluginsQ = useQuery({
    queryKey: ['admin', 'plugins'],
    queryFn: async () => fetchPlugins(await token()),
  });

  const skillsQ = useQuery({
    queryKey: ['admin', 'skills'],
    queryFn: async () => fetchSkills(await token()),
  });

  const saveM = useMutation({
    mutationFn: async (state: EditState) => {
      const t = await token();
      let config: Record<string, unknown>;
      try {
        config = JSON.parse(state.configText || '{}');
        if (typeof config !== 'object' || config === null || Array.isArray(config)) {
          throw new Error('config deve essere un oggetto JSON');
        }
      } catch (e) {
        throw new Error('JSON config non valido: ' + (e as Error).message);
      }
      const payload = {
        name: state.name.trim(),
        description: state.description.trim(),
        config,
        compatibleSkills: state.compatibleSkills,
        active: state.active,
      };
      return state.mode === 'create'
        ? createPlugin(t, payload)
        : updatePlugin(t, state.id!, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'plugins'] });
      setEditing(null);
      setError(null);
    },
    onError: (e: Error) => setError(e.message),
  });

  const toggleM = useMutation({
    mutationFn: async (id: string) => togglePlugin(await token(), id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'plugins'] }),
    onError: (e: Error) => setError(e.message),
  });

  const deleteM = useMutation({
    mutationFn: async (id: string) => deletePlugin(await token(), id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'plugins'] }),
    onError: (e: Error) => setError(e.message),
  });

  const startEdit = (p: Plugin) => setEditing({
    mode: 'edit',
    id: p._id,
    name: p.name,
    description: p.description,
    configText: JSON.stringify(p.config ?? {}, null, 2),
    compatibleSkills: p.compatibleSkills,
    active: p.active,
  });

  const items = pluginsQ.data ?? [];
  const skills = skillsQ.data ?? [];
  const skillNameById = new Map(skills.map((s) => [s._id, s.name]));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plugins</h1>
          <p className="text-sm text-gray-500 mt-1">
            Moduli aggiuntivi che estendono o configurano le skill (es. formattazione bibliografica, caricatori di contesto).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ ...EMPTY })}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Nuovo plugin
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {pluginsQ.isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Skills compatibili</th>
                <th className="px-4 py-3">Stato</th>
                <th className="px-4 py-3 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                    Nessun plugin. Crea il primo.
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {p.name}
                      {p.description && (
                        <p className="text-xs text-gray-500 font-normal mt-0.5">{p.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.compatibleSkills.length === 0 ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {p.compatibleSkills.map((id) => (
                            <span key={id} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                              {skillNameById.get(id) ?? id.slice(-6)}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleM.mutate(p._id)}
                        className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                          p.active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {p.active ? 'attivo' : 'inattivo'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="text-primary-600 hover:text-primary-800 mr-3"
                      >
                        Modifica
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Eliminare plugin "${p.name}"?`)) deleteM.mutate(p._id);
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
        <PluginEditModal
          state={editing}
          setState={setEditing}
          allSkills={skills}
          onSave={() => saveM.mutate(editing)}
          saving={saveM.isPending}
        />
      )}
    </div>
  );
}

function PluginEditModal({
  state, setState, allSkills, onSave, saving,
}: {
  state: EditState;
  setState: (s: EditState | null) => void;
  allSkills: { _id: string; name: string }[];
  onSave: () => void;
  saving: boolean;
}) {
  const toggleSkill = (id: string) => {
    const next = state.compatibleSkills.includes(id)
      ? state.compatibleSkills.filter((s) => s !== id)
      : [...state.compatibleSkills, id];
    setState({ ...state, compatibleSkills: next });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-8 px-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 my-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {state.mode === 'create' ? 'Nuovo plugin' : `Modifica: ${state.name}`}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nome</label>
            <input
              type="text"
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
              placeholder="es. bibliography-formatter"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary-500"
            />
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
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Config (JSON)
            </label>
            <textarea
              rows={8}
              value={state.configText}
              onChange={(e) => setState({ ...state, configText: e.target.value })}
              spellCheck={false}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
              Skills compatibili
            </label>
            {allSkills.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Nessuna skill disponibile. Crea prima una skill.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allSkills.map((s) => {
                  const checked = state.compatibleSkills.includes(s._id);
                  return (
                    <button
                      key={s._id}
                      type="button"
                      onClick={() => toggleSkill(s._id)}
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

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={state.active}
              onChange={(e) => setState({ ...state, active: e.target.checked })}
            />
            Attivo
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
