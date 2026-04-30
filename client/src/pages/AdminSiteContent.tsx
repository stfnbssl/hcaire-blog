import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  fetchAdminSiteContent,
  createSiteContent,
  updateSiteContent,
  deleteSiteContent,
  syncSiteContentFromDefaults,
  SUPPORTED_LANGS,
  type SiteContentItem,
  type SupportedLang,
  type ContentType,
  type UpsertPayload,
} from '../services/siteContentService';
import { useSiteContent } from '../context/SiteContentContext';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface EditingState {
  mode:        'create' | 'edit';
  key:         string;
  namespace:   string;
  type:        ContentType;
  description: string;
  translations: Partial<Record<SupportedLang, string>>;
}

const EMPTY_EDIT: EditingState = {
  mode:         'create',
  key:          '',
  namespace:    'common',
  type:         'plain',
  description:  '',
  translations: { it: '' },
};

export default function AdminSiteContent() {
  const { getToken } = useAuth();
  const { refresh: refreshContext } = useSiteContent();

  const [items, setItems]     = useState<SiteContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [filter, setFilter]   = useState('');
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [saving, setSaving]   = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const data = await fetchAdminSiteContent(token);
      setItems(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = items.filter((it) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      it.key.toLowerCase().includes(q) ||
      it.namespace.toLowerCase().includes(q) ||
      Object.values(it.translations).some((v) => v?.toLowerCase().includes(q))
    );
  });

  const startCreate = () => setEditing({ ...EMPTY_EDIT });
  const startEdit = (item: SiteContentItem) => setEditing({
    mode:         'edit',
    key:          item.key,
    namespace:    item.namespace,
    type:         item.type ?? 'plain',
    description:  item.description ?? '',
    translations: { ...item.translations },
  });
  const cancelEdit = () => setEditing(null);

  const save = async () => {
    if (!editing) return;
    if (!editing.key.trim()) {
      setError('La chiave è obbligatoria');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const payload: UpsertPayload = {
        namespace:    editing.namespace,
        type:         editing.type,
        description:  editing.description,
        translations: editing.translations,
      };
      if (editing.mode === 'create') {
        await createSiteContent(token, { ...payload, key: editing.key.trim() });
      } else {
        await updateSiteContent(token, editing.key, payload);
      }
      setEditing(null);
      await load();
      await refreshContext();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const sync = async () => {
    setSyncing(true);
    setSyncMsg(null);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const result = await syncSiteContentFromDefaults(token);
      setSyncMsg(`Importate ${result.created} nuove chiavi (${result.skipped} già presenti, ${result.total} totali nei JSON).`);
      await load();
      await refreshContext();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  const remove = async (key: string) => {
    if (!confirm(`Eliminare la chiave "${key}"?`)) return;
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      await deleteSiteContent(token, key);
      await load();
      await refreshContext();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testi del sito</h1>
          <p className="text-sm text-gray-500 mt-1">
            Stringhe esternalizzate caricate al boot dell'app. Le modifiche sono visibili dopo refresh della pagina.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void sync()}
            disabled={syncing}
            className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            title="Importa nel DB tutte le chiavi presenti nei file JSON di default ma non ancora in MongoDB"
          >
            {syncing ? 'Importazione…' : 'Importa default dai JSON'}
          </button>
          <button
            type="button"
            onClick={startCreate}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Nuova chiave
          </button>
        </div>
      </div>

      {syncMsg && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md px-4 py-3 text-sm">
          {syncMsg}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtra per chiave, namespace, valore…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-96 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
        />
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Chiave</th>
                <th className="px-4 py-3">NS</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">IT</th>
                <th className="px-4 py-3">EN</th>
                <th className="px-4 py-3 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    Nessuna chiave. {filter ? 'Modifica il filtro o' : ''} crea la prima.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.key} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700 whitespace-nowrap">{item.key}</td>
                    <td className="px-4 py-3 text-gray-500">{item.namespace}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                        item.type === 'markdown'
                          ? 'bg-violet-50 text-violet-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.type ?? 'plain'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-md truncate">{item.translations.it ?? <em className="text-gray-300">vuoto</em>}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-md truncate">{item.translations.en ?? <em className="text-gray-300">—</em>}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="text-primary-600 hover:text-primary-800 mr-3"
                      >
                        Modifica
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(item.key)}
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

      {/* Modal di edit */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-8 px-4 overflow-y-auto">
          <div className={`bg-white rounded-lg shadow-xl w-full p-6 my-8 ${
            editing.type === 'markdown' ? 'max-w-5xl' : 'max-w-2xl'
          }`}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editing.mode === 'create' ? 'Nuova chiave' : `Modifica: ${editing.key}`}
            </h2>

            <div className="space-y-4">
              {editing.mode === 'create' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Chiave</label>
                  <input
                    type="text"
                    value={editing.key}
                    onChange={(e) => setEditing({ ...editing, key: e.target.value })}
                    placeholder="es. laboratorio.sezioni.metodo.body"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Namespace</label>
                  <input
                    type="text"
                    value={editing.namespace}
                    onChange={(e) => setEditing({ ...editing, namespace: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Tipo</label>
                  <div className="flex gap-3 pt-2">
                    <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="content-type"
                        value="plain"
                        checked={editing.type === 'plain'}
                        onChange={() => setEditing({ ...editing, type: 'plain' })}
                      />
                      Plain
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="content-type"
                        value="markdown"
                        checked={editing.type === 'markdown'}
                        onChange={() => setEditing({ ...editing, type: 'markdown' })}
                      />
                      Markdown
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Descrizione (opz.)</label>
                  <input
                    type="text"
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Dove viene usata"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              {SUPPORTED_LANGS.map((lang) => {
                const value = editing.translations[lang] ?? '';
                const isMarkdown = editing.type === 'markdown';
                return (
                  <div key={lang}>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                      Traduzione — {lang.toUpperCase()}
                    </label>
                    {isMarkdown ? (
                      <div className="grid grid-cols-2 gap-3">
                        <textarea
                          rows={12}
                          value={value}
                          onChange={(e) => setEditing({
                            ...editing,
                            translations: { ...editing.translations, [lang]: e.target.value },
                          })}
                          placeholder="Markdown — usa **bold**, *italic*, [link](url), liste, ecc."
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary-500"
                        />
                        <div className="border border-gray-200 rounded-md px-4 py-3 bg-gray-50 overflow-y-auto" style={{ maxHeight: '20rem' }}>
                          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Anteprima</p>
                          {value ? (
                            <div className="prose prose-sm max-w-none">
                              <MarkdownRenderer content={value} />
                            </div>
                          ) : (
                            <p className="text-sm text-gray-300 italic">L'anteprima apparirà qui</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <textarea
                        rows={2}
                        value={value}
                        onChange={(e) => setEditing({
                          ...editing,
                          translations: { ...editing.translations, [lang]: e.target.value },
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium disabled:opacity-50"
              >
                {saving ? 'Salvataggio…' : 'Salva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
