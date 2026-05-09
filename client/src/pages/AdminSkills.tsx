import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSkills,
  createSkill,
  updateSkill,
  toggleSkill,
  deleteSkill,
} from '../services/jobsService';
import type {
  Skill,
  SkillCategory,
  SkillParameter,
  SkillParameterType,
} from '@shared/types/jobs';

const PARAM_TYPES: SkillParameterType[] = ['string', 'number', 'boolean', 'array'];
const CATEGORIES: SkillCategory[] = ['search', 'write'];

interface EditState {
  mode: 'create' | 'edit';
  id?: string;
  name: string;
  description: string;
  category: SkillCategory;
  claudeMdRef: string;
  parameters: SkillParameter[];
  active: boolean;
}

const EMPTY: EditState = {
  mode: 'create',
  name: '',
  description: '',
  category: 'search',
  claudeMdRef: '',
  parameters: [],
  active: true,
};

export default function AdminSkills() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<EditState | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function token(): Promise<string> {
    const t = await getToken();
    if (!t) throw new Error('Sessione scaduta');
    return t;
  }

  const skillsQ = useQuery({
    queryKey: ['admin', 'skills'],
    queryFn: async () => fetchSkills(await token()),
  });

  const saveM = useMutation({
    mutationFn: async (state: EditState) => {
      const t = await token();
      const payload = {
        name: state.name.trim(),
        description: state.description.trim(),
        category: state.category,
        claudeMdRef: state.claudeMdRef.trim() || undefined,
        parameters: state.parameters,
        active: state.active,
      };
      return state.mode === 'create'
        ? createSkill(t, payload)
        : updateSkill(t, state.id!, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'skills'] });
      setEditing(null);
      setError(null);
    },
    onError: (e: Error) => setError(e.message),
  });

  const toggleM = useMutation({
    mutationFn: async (id: string) => toggleSkill(await token(), id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'skills'] }),
    onError: (e: Error) => setError(e.message),
  });

  const deleteM = useMutation({
    mutationFn: async (id: string) => deleteSkill(await token(), id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'skills'] }),
    onError: (e: Error) => setError(e.message),
  });

  const startEdit = (s: Skill) => setEditing({
    mode: 'edit',
    id: s._id,
    name: s.name,
    description: s.description,
    category: s.category,
    claudeMdRef: s.claudeMdRef ?? '',
    parameters: [...s.parameters],
    active: s.active,
  });

  const items = skillsQ.data ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
          <p className="text-sm text-gray-500 mt-1">
            Skill di ricerca/scrittura riutilizzabili dai job. Sono passate a Co-work al momento dell'esecuzione.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ ...EMPTY })}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Nuova skill
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {skillsQ.isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Parametri</th>
                <th className="px-4 py-3">CLAUDE.md</th>
                <th className="px-4 py-3">Stato</th>
                <th className="px-4 py-3 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    Nessuna skill. Crea la prima.
                  </td>
                </tr>
              ) : (
                items.map((s) => (
                  <tr key={s._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {s.name}
                      {s.description && (
                        <p className="text-xs text-gray-500 font-normal mt-0.5">{s.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                        s.category === 'search'
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {s.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.parameters.length}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                      {s.claudeMdRef || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleM.mutate(s._id)}
                        className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                          s.active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {s.active ? 'attiva' : 'inattiva'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => startEdit(s)}
                        className="text-primary-600 hover:text-primary-800 mr-3"
                      >
                        Modifica
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Eliminare skill "${s.name}"?`)) deleteM.mutate(s._id);
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
        <SkillEditModal
          state={editing}
          setState={setEditing}
          onSave={() => saveM.mutate(editing)}
          saving={saveM.isPending}
        />
      )}
    </div>
  );
}

function SkillEditModal({
  state, setState, onSave, saving,
}: {
  state: EditState;
  setState: (s: EditState | null) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const updateParam = (i: number, patch: Partial<SkillParameter>) => {
    const params = [...state.parameters];
    params[i] = { ...params[i], ...patch };
    setState({ ...state, parameters: params });
  };
  const addParam = () => setState({
    ...state,
    parameters: [...state.parameters, { name: '', type: 'string', required: false, description: '' }],
  });
  const removeParam = (i: number) => setState({
    ...state,
    parameters: state.parameters.filter((_, idx) => idx !== i),
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-8 px-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 my-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {state.mode === 'create' ? 'Nuova skill' : `Modifica: ${state.name}`}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nome">
              <input
                type="text"
                value={state.name}
                onChange={(e) => setState({ ...state, name: e.target.value })}
                placeholder="es. search-obsidian"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary-500"
              />
            </Field>
            <Field label="Categoria">
              <div className="flex gap-3 pt-2">
                {CATEGORIES.map((c) => (
                  <label key={c} className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="skill-cat"
                      checked={state.category === c}
                      onChange={() => setState({ ...state, category: c })}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </Field>
          </div>

          <Field label="Descrizione">
            <textarea
              rows={2}
              value={state.description}
              onChange={(e) => setState({ ...state, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            />
          </Field>

          <Field label="Riferimento CLAUDE.md (opzionale)">
            <input
              type="text"
              value={state.claudeMdRef}
              onChange={(e) => setState({ ...state, claudeMdRef: e.target.value })}
              placeholder="path o id del file CLAUDE.md associato"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary-500"
            />
          </Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase">Parametri</label>
              <button
                type="button"
                onClick={addParam}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                + Aggiungi parametro
              </button>
            </div>
            {state.parameters.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Nessun parametro definito.</p>
            ) : (
              <div className="space-y-2">
                {state.parameters.map((p, i) => (
                  <div key={i} className="border border-gray-200 rounded-md p-3 grid grid-cols-12 gap-2 items-start">
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => updateParam(i, { name: e.target.value })}
                      placeholder="name"
                      className="col-span-3 border border-gray-300 rounded px-2 py-1 text-sm font-mono"
                    />
                    <select
                      value={p.type}
                      onChange={(e) => updateParam(i, { type: e.target.value as SkillParameterType })}
                      className="col-span-2 border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {PARAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input
                      type="text"
                      value={p.description}
                      onChange={(e) => updateParam(i, { description: e.target.value })}
                      placeholder="descrizione"
                      className="col-span-5 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <label className="col-span-1 inline-flex items-center gap-1 text-xs text-gray-600 pt-1">
                      <input
                        type="checkbox"
                        checked={p.required}
                        onChange={(e) => updateParam(i, { required: e.target.checked })}
                      />
                      req
                    </label>
                    <button
                      type="button"
                      onClick={() => removeParam(i)}
                      className="col-span-1 text-red-600 hover:text-red-800 text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{label}</label>
      {children}
    </div>
  );
}
