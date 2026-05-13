// Modale "Crea nuovo autore/libro" usata dall'editor capitolo.
// Versione ridotta del form di /admin/catalogo: solo i campi minimi
// (nome/titolo + immagine + rilevanza per sviluppo-bambino).
// Per editing avanzato si rimanda a /admin/catalogo.

import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  createAuthor,
  createBook,
  uploadAuthorImage,
  uploadBookImage,
} from '../../services/catalogAdminService';

interface Props {
  kind: 'author' | 'book';
  initialName?: string;
  onClose: () => void;
  /** chiamato dopo creazione riuscita con l'id (slug) del nuovo record */
  onCreated: (id: string) => void;
}

const SVILUPPO_BAMBINO = 'sviluppo-bambino';

export default function QuickCreateCatalogItem({
  kind,
  initialName = '',
  onClose,
  onCreated,
}: Props): JSX.Element {
  const { getToken } = useAuth();
  const [name, setName] = useState(initialName);
  const [rilevanza, setRilevanza] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (): Promise<void> => {
    if (!name.trim()) {
      setError(kind === 'author' ? 'Nome obbligatorio' : 'Titolo obbligatorio');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const projectsPayload = [
        { projectId: SVILUPPO_BAMBINO, rilevanza: rilevanza.trim() },
      ];

      let createdId: string;
      if (kind === 'author') {
        const res = await createAuthor(token, {
          nome: name.trim(),
          projects: projectsPayload,
        });
        createdId = res.author.id;
        if (file) await uploadAuthorImage(token, createdId, file);
      } else {
        const res = await createBook(token, {
          titolo: name.trim(),
          projects: projectsPayload,
        });
        createdId = res.book.id;
        if (file) await uploadBookImage(token, createdId, file);
      }

      onCreated(createdId);
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/30" onClick={onClose} aria-hidden="true" />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-md bg-white rounded-lg shadow-2xl border border-slate-200">
        <header className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between rounded-t-lg">
          <h3 className="text-sm font-semibold text-slate-900">
            Nuovo {kind === 'author' ? 'autore' : 'libro'}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 text-xl leading-none"
            aria-label="Chiudi"
          >
            ×
          </button>
        </header>
        <div className="p-5 space-y-3">
          {error && (
            <div className="p-2 rounded bg-rose-50 text-rose-800 text-xs border border-rose-200">{error}</div>
          )}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              {kind === 'author' ? 'Nome' : 'Titolo'} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-2 py-1.5 border border-slate-300 rounded"
              autoFocus
            />
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              id slug derivato automaticamente
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              {kind === 'author' ? 'Immagine ritratto' : 'Copertina'} (opzionale)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Rilevanza per progetto (opzionale)
            </label>
            <textarea
              value={rilevanza}
              onChange={(e) => setRilevanza(e.target.value)}
              rows={3}
              placeholder="testo della rilevanza per sviluppo-bambino…"
              className="w-full text-xs px-2 py-1 border border-slate-300 rounded"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Editing completo (bio, wikipedia, tag, multi-progetto) via /admin/catalogo
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="text-sm px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100"
            >
              Annulla
            </button>
            <button
              onClick={() => void handleSubmit()}
              disabled={saving || !name.trim()}
              className="text-sm px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium"
            >
              {saving ? 'Creazione…' : 'Crea'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
