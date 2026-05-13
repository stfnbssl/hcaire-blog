// Pagina admin standalone per la gestione del catalogo authors/books.
// Indipendente dall'editor capitolo: serve a gestire il catalogo "a freddo".
// Fase 5 catalogo Mongo (2026-05-12).

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  listAuthors,
  listBooks,
  getAuthor,
  getBook,
  createAuthor,
  createBook,
  updateAuthor,
  updateBook,
  deleteAuthor,
  deleteBook,
  uploadAuthorImage,
  uploadBookImage,
  deleteAuthorImage,
  deleteBookImage,
} from '../services/catalogAdminService';
import type {
  CatalogAuthor,
  CatalogBook,
  CitingChapter,
  ProjectScope,
} from '../types/catalog';

type Tab = 'authors' | 'books';

const SVILUPPO_BAMBINO = 'sviluppo-bambino';

export default function AdminCatalogo(): JSX.Element {
  const [tab, setTab] = useState<Tab>('authors');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(id);
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Catalogo · Autori e Libri</h1>
        <p className="text-sm text-slate-500 mt-1">
          Catalogo globale (collection <code>authors</code>/<code>books</code> su MongoDB). Le immagini vivono su Cloudflare R2.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3 mb-6 pb-3 border-b border-slate-200">
        <div className="flex bg-slate-100 rounded-lg p-1">
          {(['authors', 'books'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === 'authors' ? 'Autori' : 'Libri'}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tab === 'authors' ? 'cerca per nome o id…' : 'cerca per titolo o id…'}
          className="flex-1 min-w-[200px] max-w-[360px] px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-emerald-500"
        />
      </div>

      {tab === 'authors' ? (
        <AuthorsPanel q={debouncedSearch} />
      ) : (
        <BooksPanel q={debouncedSearch} />
      )}
    </div>
  );
}

// ── pannello AUTORI ────────────────────────────────────────────────────────

function AuthorsPanel({ q }: { q: string }): JSX.Element {
  const { getToken } = useAuth();
  const [items, setItems] = useState<CatalogAuthor[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const res = await listAuthors(token, { q: q || undefined, limit: 300 });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [getToken, q]);

  useEffect(() => { void fetchList(); }, [fetchList]);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">
          {loading ? 'Caricamento…' : `${items.length} di ${total} autori`}
        </p>
        <button
          onClick={() => setEditingId('new')}
          className="text-sm px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
        >
          + Nuovo autore
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-rose-50 text-rose-800 text-sm border border-rose-200">{error}</div>
      )}

      {!loading && items.length === 0 && (
        <p className="text-slate-400 text-sm italic">Nessun autore corrisponde alla ricerca.</p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((a) => (
          <li key={a.id}>
            <button
              onClick={() => setEditingId(a.id)}
              className="w-full text-left flex gap-3 p-3 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-slate-50 transition-colors"
            >
              {a.image_url ? (
                <img
                  src={a.image_url}
                  alt={a.nome}
                  className="h-16 w-16 rounded object-cover bg-slate-100 shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.2'; }}
                />
              ) : (
                <div className="h-16 w-16 rounded bg-slate-100 shrink-0 flex items-center justify-center text-slate-300 text-xs">
                  no img
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 leading-tight">{a.nome}</p>
                <p className="text-xs text-slate-400 mt-0.5 font-mono truncate">{a.id}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {a.projects.length} {a.projects.length === 1 ? 'progetto' : 'progetti'}
                  {a.tags.length > 0 && ` · ${a.tags.length} tag`}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {editingId && (
        <AuthorEditor
          authorId={editingId === 'new' ? null : editingId}
          onClose={(changed) => {
            setEditingId(null);
            if (changed) void fetchList();
          }}
        />
      )}
    </>
  );
}

// ── pannello LIBRI ─────────────────────────────────────────────────────────

function BooksPanel({ q }: { q: string }): JSX.Element {
  const { getToken } = useAuth();
  const [items, setItems] = useState<CatalogBook[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const res = await listBooks(token, { q: q || undefined, limit: 300 });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [getToken, q]);

  useEffect(() => { void fetchList(); }, [fetchList]);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">
          {loading ? 'Caricamento…' : `${items.length} di ${total} libri`}
        </p>
        <button
          onClick={() => setEditingId('new')}
          className="text-sm px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
        >
          + Nuovo libro
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-rose-50 text-rose-800 text-sm border border-rose-200">{error}</div>
      )}

      {!loading && items.length === 0 && (
        <p className="text-slate-400 text-sm italic">Nessun libro corrisponde alla ricerca.</p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((b) => (
          <li key={b.id}>
            <button
              onClick={() => setEditingId(b.id)}
              className="w-full text-left flex gap-3 p-3 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-slate-50 transition-colors"
            >
              {b.cover_url ? (
                <img
                  src={b.cover_url}
                  alt={b.titolo}
                  className="h-20 w-14 object-cover bg-slate-100 shrink-0 shadow-sm"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.2'; }}
                />
              ) : (
                <div className="h-20 w-14 bg-slate-100 shrink-0 flex items-center justify-center text-slate-300 text-xs">
                  no cover
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 leading-tight">{b.titolo}</p>
                <p className="text-xs text-slate-400 mt-0.5 font-mono truncate">{b.id}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {b.autoreIds.length > 0 && `${b.autoreIds.length} autore${b.autoreIds.length > 1 ? 'i' : ''}`}
                  {b.anno && ` · ${b.anno}`}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {editingId && (
        <BookEditor
          bookId={editingId === 'new' ? null : editingId}
          onClose={(changed) => {
            setEditingId(null);
            if (changed) void fetchList();
          }}
        />
      )}
    </>
  );
}

// ── editor AUTORE (drawer) ─────────────────────────────────────────────────

function AuthorEditor({
  authorId,
  onClose,
}: {
  authorId: string | null;
  onClose: (changed: boolean) => void;
}): JSX.Element {
  const { getToken } = useAuth();
  const isNew = authorId === null;

  const [author, setAuthor] = useState<CatalogAuthor | null>(null);
  const [citing, setCiting] = useState<CitingChapter[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // draft fields
  const [idDraft, setIdDraft] = useState('');
  const [nome, setNome] = useState('');
  const [birthYear, setBirthYear] = useState<string>('');
  const [deathYear, setDeathYear] = useState<string>('');
  const [bioShort, setBioShort] = useState('');
  const [wikipedia, setWikipedia] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [projects, setProjects] = useState<ProjectScope[]>([
    { projectId: SVILUPPO_BAMBINO, rilevanza: '' },
  ]);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('Sessione scaduta');
        const res = await getAuthor(token, authorId);
        if (cancelled) return;
        setAuthor(res.author);
        setCiting(res.citing);
        setIdDraft(res.author.id);
        setNome(res.author.nome);
        setBirthYear(res.author.birth_year != null ? String(res.author.birth_year) : '');
        setDeathYear(res.author.death_year != null ? String(res.author.death_year) : '');
        setBioShort(res.author.bio_short ?? '');
        setWikipedia(res.author.wikipedia ?? '');
        setTagsText(res.author.tags.join(', '));
        setProjects(
          res.author.projects.length > 0
            ? res.author.projects
            : [{ projectId: SVILUPPO_BAMBINO, rilevanza: '' }],
        );
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [authorId, isNew, getToken]);

  const buildPayload = () => ({
    nome: nome.trim(),
    birth_year: birthYear.trim() ? Number(birthYear) : null,
    death_year: deathYear.trim() ? Number(deathYear) : null,
    bio_short: bioShort.trim() || null,
    wikipedia: wikipedia.trim() || null,
    tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
    projects: projects
      .filter((p) => p.projectId.trim())
      .map((p) => ({ projectId: p.projectId.trim(), rilevanza: p.rilevanza })),
  });

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      if (isNew) {
        const res = await createAuthor(token, {
          ...buildPayload(),
          ...(idDraft.trim() ? { id: idDraft.trim() } : {}),
        });
        setAuthor(res.author);
        setIdDraft(res.author.id);
      } else if (author) {
        const res = await updateAuthor(token, author.id, buildPayload());
        setAuthor(res.author);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!author) return;
    const force = citing.length > 0;
    const msg = force
      ? `L'autore è citato in ${citing.length} capitoli. Cancellare COMUNQUE? (verrà rimosso anche dalle reference dei capitoli)`
      : `Cancellare l'autore "${author.nome}"?`;
    if (!window.confirm(msg)) return;
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      await deleteAuthor(token, author.id, force);
      onClose(true);
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<void> => {
    if (!author) return;
    setUploadingImage(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const res = await uploadAuthorImage(token, author.id, file);
      setAuthor(res.author);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async (): Promise<void> => {
    if (!author || !author.image_r2_key) return;
    if (!window.confirm('Rimuovere l\'immagine?')) return;
    setUploadingImage(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const res = await deleteAuthorImage(token, author.id);
      setAuthor(res.author);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <DrawerShell onClose={() => onClose(!!author && !isNew)} title={isNew ? 'Nuovo autore' : author?.nome ?? '…'}>
      {loading ? (
        <p className="text-slate-500 text-sm">Caricamento…</p>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="p-2 rounded bg-rose-50 text-rose-800 text-xs border border-rose-200">{error}</div>
          )}

          {/* Immagine */}
          {!isNew && author && (
            <section>
              <Label>Immagine ritratto</Label>
              <div className="flex items-start gap-3">
                {author.image_url ? (
                  <img
                    src={author.image_url}
                    alt={author.nome}
                    className="h-28 w-28 rounded object-cover bg-slate-100 shrink-0"
                  />
                ) : (
                  <div className="h-28 w-28 rounded bg-slate-100 shrink-0 flex items-center justify-center text-slate-300 text-xs">
                    no img
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleImageUpload(f);
                      e.target.value = '';
                    }}
                    disabled={uploadingImage}
                    className="text-xs"
                  />
                  {author.image_r2_key && (
                    <button
                      type="button"
                      onClick={() => void handleImageDelete()}
                      disabled={uploadingImage}
                      className="text-xs text-rose-700 hover:underline w-fit"
                    >
                      Rimuovi immagine
                    </button>
                  )}
                  {uploadingImage && <p className="text-xs text-slate-500">Upload…</p>}
                </div>
              </div>
            </section>
          )}

          <section>
            <Label>id (slug)</Label>
            <input
              type="text"
              value={idDraft}
              onChange={(e) => setIdDraft(e.target.value)}
              disabled={!isNew}
              placeholder={isNew ? '(auto da nome)' : ''}
              className="w-full text-sm font-mono px-2 py-1 border border-slate-300 rounded disabled:bg-slate-50"
            />
          </section>

          <section>
            <Label>Nome *</Label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
            />
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div>
              <Label>Anno nascita</Label>
              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
              />
            </div>
            <div>
              <Label>Anno morte</Label>
              <input
                type="number"
                value={deathYear}
                onChange={(e) => setDeathYear(e.target.value)}
                className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
              />
            </div>
          </section>

          <section>
            <Label>Bio breve</Label>
            <textarea
              value={bioShort}
              onChange={(e) => setBioShort(e.target.value)}
              rows={2}
              className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
            />
          </section>

          <section>
            <Label>Wikipedia URL</Label>
            <input
              type="url"
              value={wikipedia}
              onChange={(e) => setWikipedia(e.target.value)}
              className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
            />
          </section>

          <section>
            <Label>Tags (separati da virgola)</Label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
            />
          </section>

          <ProjectsEditor projects={projects} onChange={setProjects} />

          {!isNew && citing.length > 0 && (
            <section>
              <Label>Citato in {citing.length} {citing.length === 1 ? 'capitolo' : 'capitoli'}</Label>
              <ul className="text-xs text-slate-600 space-y-0.5 max-h-40 overflow-y-auto border border-slate-200 rounded p-2 bg-slate-50">
                {citing.map((c) => (
                  <li key={`${c.axis_slug}-${c.slug}`}>
                    <a
                      href={`/admin/assi/capitoli/${c.axis_slug}/${c.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      <span className="text-slate-400">Asse {c.axis_number}.{c.chapter_number}</span> · {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <button
              onClick={() => void handleSave()}
              disabled={saving || !nome.trim()}
              className="text-sm px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium"
            >
              {saving ? 'Salvataggio…' : isNew ? 'Crea' : 'Salva'}
            </button>
            {!isNew && (
              <button
                onClick={() => void handleDelete()}
                disabled={saving}
                className="text-sm text-rose-700 hover:underline"
              >
                Elimina
              </button>
            )}
          </div>
        </div>
      )}
    </DrawerShell>
  );
}

// ── editor LIBRO (drawer) ──────────────────────────────────────────────────

function BookEditor({
  bookId,
  onClose,
}: {
  bookId: string | null;
  onClose: (changed: boolean) => void;
}): JSX.Element {
  const { getToken } = useAuth();
  const isNew = bookId === null;

  const [book, setBook] = useState<CatalogBook | null>(null);
  const [citing, setCiting] = useState<CitingChapter[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [idDraft, setIdDraft] = useState('');
  const [titolo, setTitolo] = useState('');
  const [titoloOriginale, setTitoloOriginale] = useState('');
  const [anno, setAnno] = useState<string>('');
  const [editore, setEditore] = useState('');
  const [autoreIdsText, setAutoreIdsText] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [projects, setProjects] = useState<ProjectScope[]>([
    { projectId: SVILUPPO_BAMBINO, rilevanza: '' },
  ]);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('Sessione scaduta');
        const res = await getBook(token, bookId);
        if (cancelled) return;
        setBook(res.book);
        setCiting(res.citing);
        setIdDraft(res.book.id);
        setTitolo(res.book.titolo);
        setTitoloOriginale(res.book.titolo_originale ?? '');
        setAnno(res.book.anno != null ? String(res.book.anno) : '');
        setEditore(res.book.editore ?? '');
        setAutoreIdsText(res.book.autoreIds.join(', '));
        setTagsText(res.book.tags.join(', '));
        setProjects(
          res.book.projects.length > 0
            ? res.book.projects
            : [{ projectId: SVILUPPO_BAMBINO, rilevanza: '' }],
        );
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [bookId, isNew, getToken]);

  const buildPayload = () => ({
    titolo: titolo.trim(),
    titolo_originale: titoloOriginale.trim() || null,
    autoreIds: autoreIdsText.split(',').map((t) => t.trim()).filter(Boolean),
    anno: anno.trim() ? Number(anno) : null,
    editore: editore.trim() || null,
    tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
    projects: projects
      .filter((p) => p.projectId.trim())
      .map((p) => ({ projectId: p.projectId.trim(), rilevanza: p.rilevanza })),
  });

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      if (isNew) {
        const res = await createBook(token, {
          ...buildPayload(),
          ...(idDraft.trim() ? { id: idDraft.trim() } : {}),
        });
        setBook(res.book);
        setIdDraft(res.book.id);
      } else if (book) {
        const res = await updateBook(token, book.id, buildPayload());
        setBook(res.book);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!book) return;
    const force = citing.length > 0;
    const msg = force
      ? `Il libro è citato in ${citing.length} capitoli. Cancellare COMUNQUE?`
      : `Cancellare il libro "${book.titolo}"?`;
    if (!window.confirm(msg)) return;
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      await deleteBook(token, book.id, force);
      onClose(true);
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<void> => {
    if (!book) return;
    setUploadingImage(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const res = await uploadBookImage(token, book.id, file);
      setBook(res.book);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async (): Promise<void> => {
    if (!book || !book.cover_r2_key) return;
    if (!window.confirm('Rimuovere la copertina?')) return;
    setUploadingImage(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const res = await deleteBookImage(token, book.id);
      setBook(res.book);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <DrawerShell onClose={() => onClose(!!book && !isNew)} title={isNew ? 'Nuovo libro' : book?.titolo ?? '…'}>
      {loading ? (
        <p className="text-slate-500 text-sm">Caricamento…</p>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="p-2 rounded bg-rose-50 text-rose-800 text-xs border border-rose-200">{error}</div>
          )}

          {!isNew && book && (
            <section>
              <Label>Copertina</Label>
              <div className="flex items-start gap-3">
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt={book.titolo}
                    className="h-36 w-24 object-cover bg-slate-100 shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="h-36 w-24 bg-slate-100 shrink-0 flex items-center justify-center text-slate-300 text-xs">
                    no cover
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleImageUpload(f);
                      e.target.value = '';
                    }}
                    disabled={uploadingImage}
                    className="text-xs"
                  />
                  {book.cover_r2_key && (
                    <button
                      type="button"
                      onClick={() => void handleImageDelete()}
                      disabled={uploadingImage}
                      className="text-xs text-rose-700 hover:underline w-fit"
                    >
                      Rimuovi copertina
                    </button>
                  )}
                  {uploadingImage && <p className="text-xs text-slate-500">Upload…</p>}
                </div>
              </div>
            </section>
          )}

          <section>
            <Label>id (slug)</Label>
            <input
              type="text"
              value={idDraft}
              onChange={(e) => setIdDraft(e.target.value)}
              disabled={!isNew}
              placeholder={isNew ? '(auto da titolo)' : ''}
              className="w-full text-sm font-mono px-2 py-1 border border-slate-300 rounded disabled:bg-slate-50"
            />
          </section>

          <section>
            <Label>Titolo *</Label>
            <input
              type="text"
              value={titolo}
              onChange={(e) => setTitolo(e.target.value)}
              className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
            />
          </section>

          <section>
            <Label>Titolo originale</Label>
            <input
              type="text"
              value={titoloOriginale}
              onChange={(e) => setTitoloOriginale(e.target.value)}
              className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
            />
          </section>

          <section>
            <Label>Autori (slug separati da virgola)</Label>
            <input
              type="text"
              value={autoreIdsText}
              onChange={(e) => setAutoreIdsText(e.target.value)}
              placeholder="es. maurice-merleau-ponty, edmund-husserl"
              className="w-full text-sm font-mono px-2 py-1 border border-slate-300 rounded"
            />
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div>
              <Label>Anno</Label>
              <input
                type="number"
                value={anno}
                onChange={(e) => setAnno(e.target.value)}
                className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
              />
            </div>
            <div>
              <Label>Editore</Label>
              <input
                type="text"
                value={editore}
                onChange={(e) => setEditore(e.target.value)}
                className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
              />
            </div>
          </section>

          <section>
            <Label>Tags (separati da virgola)</Label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className="w-full text-sm px-2 py-1 border border-slate-300 rounded"
            />
          </section>

          <ProjectsEditor projects={projects} onChange={setProjects} />

          {!isNew && citing.length > 0 && (
            <section>
              <Label>Citato in {citing.length} {citing.length === 1 ? 'capitolo' : 'capitoli'}</Label>
              <ul className="text-xs text-slate-600 space-y-0.5 max-h-40 overflow-y-auto border border-slate-200 rounded p-2 bg-slate-50">
                {citing.map((c) => (
                  <li key={`${c.axis_slug}-${c.slug}`}>
                    <a
                      href={`/admin/assi/capitoli/${c.axis_slug}/${c.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      <span className="text-slate-400">Asse {c.axis_number}.{c.chapter_number}</span> · {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <button
              onClick={() => void handleSave()}
              disabled={saving || !titolo.trim()}
              className="text-sm px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium"
            >
              {saving ? 'Salvataggio…' : isNew ? 'Crea' : 'Salva'}
            </button>
            {!isNew && (
              <button
                onClick={() => void handleDelete()}
                disabled={saving}
                className="text-sm text-rose-700 hover:underline"
              >
                Elimina
              </button>
            )}
          </div>
        </div>
      )}
    </DrawerShell>
  );
}

// ── shell drawer + sub-componenti ──────────────────────────────────────────

function DrawerShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}): JSX.Element {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} aria-hidden="true" />
      <aside className="fixed right-0 top-0 z-50 h-full w-full md:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col">
        <header className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-3 shrink-0">
          <h2 className="text-base font-semibold text-slate-900 leading-tight truncate">{title}</h2>
          <button
            onClick={onClose}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 text-xl leading-none"
            aria-label="Chiudi"
          >
            ×
          </button>
        </header>
        <div className="overflow-y-auto px-5 py-4 flex-1">{children}</div>
      </aside>
    </>
  );
}

function Label({ children }: { children: React.ReactNode }): JSX.Element {
  return <label className="block text-xs font-medium text-slate-600 mb-1">{children}</label>;
}

function ProjectsEditor({
  projects,
  onChange,
}: {
  projects: ProjectScope[];
  onChange: (p: ProjectScope[]) => void;
}): JSX.Element {
  const update = (i: number, patch: Partial<ProjectScope>): void => {
    const next = [...projects];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const remove = (i: number): void => {
    onChange(projects.filter((_, idx) => idx !== i));
  };
  const add = (): void => {
    onChange([...projects, { projectId: '', rilevanza: '' }]);
  };
  return (
    <section>
      <div className="flex items-center justify-between mb-1">
        <Label>Rilevanza per progetto</Label>
        <button type="button" onClick={add} className="text-xs text-emerald-700 hover:underline">
          + aggiungi
        </button>
      </div>
      <div className="space-y-2">
        {projects.map((p, i) => (
          <div key={i} className="border border-slate-200 rounded p-2 bg-slate-50">
            <div className="flex items-center gap-2 mb-1">
              <input
                type="text"
                value={p.projectId}
                onChange={(e) => update(i, { projectId: e.target.value })}
                placeholder="projectId (es. sviluppo-bambino)"
                className="flex-1 text-xs font-mono px-2 py-1 border border-slate-300 rounded bg-white"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-xs text-rose-700 hover:underline shrink-0"
                title="Rimuovi"
              >
                ✕
              </button>
            </div>
            <textarea
              value={p.rilevanza}
              onChange={(e) => update(i, { rilevanza: e.target.value })}
              rows={4}
              placeholder="testo di rilevanza per il progetto…"
              className="w-full text-xs px-2 py-1 border border-slate-300 rounded bg-white"
            />
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-xs text-slate-400 italic">Nessun progetto associato.</p>
        )}
      </div>
    </section>
  );
}
