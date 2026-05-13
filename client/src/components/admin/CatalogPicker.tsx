// Autocomplete picker per autori o libri del catalogo.
// Usa gli endpoint admin /api/admin/catalog/{authors,books} con search live.
// Emette l'id dell'elemento scelto (slug) via onPick.

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { listAuthors, listBooks } from '../../services/catalogAdminService';
import type { CatalogAuthor, CatalogBook } from '../../types/catalog';

interface PickerItem {
  id: string;
  label: string;
  imageUrl: string | null;
}

interface Props {
  kind: 'author' | 'book';
  onPick: (id: string) => void;
  onCreateNew?: (initialQuery: string) => void;
  /** ids da escludere dai risultati (es. già scelti) */
  excludeIds?: string[];
  placeholder?: string;
}

export default function CatalogPicker({
  kind,
  onPick,
  onCreateNew,
  excludeIds = [],
  placeholder,
}: Props): JSX.Element {
  const { getToken } = useAuth();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<PickerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce della query
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 200);
    return () => clearTimeout(id);
  }, [query]);

  // Fetch risultati
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) throw new Error('Sessione scaduta');
        if (kind === 'author') {
          const res = await listAuthors(token, { q: debouncedQuery || undefined, limit: 12 });
          if (cancelled) return;
          setResults(res.items.map((a: CatalogAuthor) => ({
            id: a.id,
            label: a.nome,
            imageUrl: a.image_url,
          })));
        } else {
          const res = await listBooks(token, { q: debouncedQuery || undefined, limit: 12 });
          if (cancelled) return;
          setResults(res.items.map((b: CatalogBook) => ({
            id: b.id,
            label: b.titolo,
            imageUrl: b.cover_url,
          })));
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [debouncedQuery, kind, open, getToken]);

  // Chiudi su click fuori
  useEffect(() => {
    if (!open) return;
    const onClick = (ev: MouseEvent) => {
      if (!containerRef.current?.contains(ev.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const filtered = results.filter((r) => !excludeIds.includes(r.id));

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder ?? (kind === 'author' ? 'cerca autore…' : 'cerca libro…')}
        className="w-full text-xs px-2 py-1 border border-slate-300 rounded"
      />
      {open && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded shadow-lg max-h-72 overflow-y-auto">
          {loading && <div className="px-2 py-1.5 text-xs text-slate-500">Caricamento…</div>}
          {error && <div className="px-2 py-1.5 text-xs text-rose-700">{error}</div>}
          {!loading && !error && filtered.length === 0 && (
            <div className="px-2 py-1.5 text-xs text-slate-400 italic">Nessun risultato</div>
          )}
          {filtered.map((r) => (
            <button
              key={r.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onPick(r.id);
                setQuery('');
                setOpen(false);
              }}
              className="w-full text-left flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
            >
              {r.imageUrl ? (
                <img
                  src={r.imageUrl}
                  alt=""
                  className={kind === 'author' ? 'h-8 w-8 rounded object-cover bg-slate-100 shrink-0' : 'h-10 w-7 object-cover bg-slate-100 shrink-0'}
                />
              ) : (
                <div className={`bg-slate-100 shrink-0 ${kind === 'author' ? 'h-8 w-8 rounded' : 'h-10 w-7'}`} />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-900 truncate">{r.label}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{r.id}</p>
              </div>
            </button>
          ))}
          {onCreateNew && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onCreateNew(query); setOpen(false); }}
              className="w-full text-left px-2 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 border-t border-slate-200 font-medium"
            >
              + Crea nuovo {kind === 'author' ? 'autore' : 'libro'}{query ? `: "${query}"` : ''}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
