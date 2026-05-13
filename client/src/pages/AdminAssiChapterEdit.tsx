import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import StructuredChapterRenderer from '../components/StructuredChapterRenderer';
import ChapterRefsPanel from '../components/admin/ChapterRefsPanel';
import { getChapter, updateChapter, validateChapter } from '../services/assiChaptersAdminService';
import { sviluppoBambinoApi } from '../services/staticContentService';
import type { AssiChapter, ValidationIssue } from '../types/assiChapter';
import type { Author, Book, ChapterDocument, Reference, Footnote } from '@shared/types/assi';

type RightPaneMode = 'preview' | 'refs';

function fmtDate(iso: string | null): string {
  if (!iso) return 'mai';
  return new Date(iso).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' });
}

export default function AdminAssiChapterEdit() {
  const { axisSlug = '', slug = '' } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState<AssiChapter | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // edit state
  const [bodyDraft, setBodyDraft] = useState<string>('');
  const [titleDraft, setTitleDraft] = useState<string>('');
  const [refsJson, setRefsJson] = useState<string>('');
  const [footnotesJson, setFootnotesJson] = useState<string>('');
  const [refsJsonError, setRefsJsonError] = useState<string | null>(null);
  const [footnotesJsonError, setFootnotesJsonError] = useState<string | null>(null);

  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [showRefsPanel, setShowRefsPanel] = useState(false);
  const [rightPaneMode, setRightPaneMode] = useState<RightPaneMode>('preview');

  // ── caricamento ──────────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const [c, authorsRes, booksRes] = await Promise.all([
        getChapter(token, axisSlug, slug),
        sviluppoBambinoApi.getCatalogoAuthors().catch(() => ({ authors: [] as Author[] })),
        sviluppoBambinoApi.getCatalogoBooks().catch(() => ({ books: [] as Book[] })),
      ]);
      setChapter(c);
      setBodyDraft(c.body);
      setTitleDraft(c.title);
      setRefsJson(JSON.stringify(c.references, null, 2));
      setFootnotesJson(JSON.stringify(c.footnotes, null, 2));
      setAuthors((authorsRes.authors ?? []) as Author[]);
      setBooks((booksRes.books ?? []) as Book[]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [axisSlug, slug, getToken]);

  useEffect(() => { void fetchAll(); }, [fetchAll]);

  // ── catalogo reload (dopo quick-create di autore/libro) ──────────────────

  const reloadCatalog = useCallback(async () => {
    try {
      const [authorsRes, booksRes] = await Promise.all([
        sviluppoBambinoApi.getCatalogoAuthors(),
        sviluppoBambinoApi.getCatalogoBooks(),
      ]);
      setAuthors((authorsRes.authors ?? []) as Author[]);
      setBooks((booksRes.books ?? []) as Book[]);
    } catch (e) {
      console.warn('[chapter-edit] reload catalogo fallito:', (e as Error).message);
    }
  }, []);

  // ── parsing strutturato di refs/footnotes per il pannello ────────────────

  const parsedReferences = useMemo<Reference[]>(() => {
    if (refsJsonError) return chapter?.references ?? [];
    try {
      const parsed = JSON.parse(refsJson);
      return Array.isArray(parsed) ? (parsed as Reference[]) : [];
    } catch {
      return chapter?.references ?? [];
    }
  }, [refsJson, refsJsonError, chapter]);

  const parsedFootnotes = useMemo<Footnote[]>(() => {
    if (footnotesJsonError) return chapter?.footnotes ?? [];
    try {
      const parsed = JSON.parse(footnotesJson);
      return Array.isArray(parsed) ? (parsed as Footnote[]) : [];
    } catch {
      return chapter?.footnotes ?? [];
    }
  }, [footnotesJson, footnotesJsonError, chapter]);

  const handleStructuredRefsChange = useCallback((refs: Reference[]) => {
    setRefsJson(JSON.stringify(refs, null, 2));
  }, []);

  const handleStructuredFootnotesChange = useCallback((fns: Footnote[]) => {
    setFootnotesJson(JSON.stringify(fns, null, 2));
  }, []);

  // ── preview doc (debounced) ──────────────────────────────────────────────

  const [previewBody, setPreviewBody] = useState<string>('');
  useEffect(() => {
    const id = setTimeout(() => setPreviewBody(bodyDraft), 400);
    return () => clearTimeout(id);
  }, [bodyDraft]);

  const previewDoc = useMemo<ChapterDocument | null>(() => {
    if (!chapter) return null;
    let parsedRefs = chapter.references;
    let parsedFns = chapter.footnotes;
    try { parsedRefs = JSON.parse(refsJson); } catch { /* keep existing if invalid */ }
    try { parsedFns = JSON.parse(footnotesJson); } catch { /* keep existing if invalid */ }
    return {
      frontmatter: {
        title: titleDraft || chapter.title,
        asse: chapter.axis_folder,
        asse_number: chapter.axis_number,
        asse_slug: chapter.axis_slug,
        chapter: chapter.chapter_number,
        order: chapter.order,
        slug: chapter.slug,
        prev: chapter.prev_slug,
        next: chapter.next_slug,
      },
      body: previewBody,
      references: parsedRefs,
      footnotes: parsedFns,
    };
  }, [chapter, previewBody, refsJson, footnotesJson, titleDraft]);

  // ── validazione JSON live ────────────────────────────────────────────────

  useEffect(() => {
    try { JSON.parse(refsJson); setRefsJsonError(null); }
    catch (e) { setRefsJsonError((e as Error).message); }
  }, [refsJson]);

  useEffect(() => {
    try { JSON.parse(footnotesJson); setFootnotesJsonError(null); }
    catch (e) { setFootnotesJsonError((e as Error).message); }
  }, [footnotesJson]);

  // ── salva ────────────────────────────────────────────────────────────────

  const isDirty = useMemo(() => {
    if (!chapter) return false;
    return bodyDraft !== chapter.body
        || titleDraft !== chapter.title
        || refsJson !== JSON.stringify(chapter.references, null, 2)
        || footnotesJson !== JSON.stringify(chapter.footnotes, null, 2);
  }, [chapter, bodyDraft, titleDraft, refsJson, footnotesJson]);

  const handleSave = async (): Promise<void> => {
    if (refsJsonError || footnotesJsonError) {
      setError('JSON non valido nei pannelli references/footnotes');
      return;
    }
    setSaving(true);
    setError(null);
    setSaveMsg(null);
    setIssues([]);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const res = await updateChapter(token, axisSlug, slug, {
        body: bodyDraft,
        title: titleDraft,
        references: JSON.parse(refsJson),
        footnotes: JSON.parse(footnotesJson),
      });
      setChapter(res.chapter);
      setBodyDraft(res.chapter.body);
      setTitleDraft(res.chapter.title);
      setRefsJson(JSON.stringify(res.chapter.references, null, 2));
      setFootnotesJson(JSON.stringify(res.chapter.footnotes, null, 2));
      const exportInfo = res.exported_to
        ? `\nEsportato in ${res.exported_to}`
        : res.export_error
          ? `\n⚠ Export verso git fallito: ${res.export_error}`
          : '';
      setSaveMsg(`✓ Salvato (rev #${res.chapter._revision_count})${exportInfo}`);
    } catch (e) {
      const err = e as Error & { issues?: ValidationIssue[] };
      setError(err.message);
      if (err.issues) setIssues(err.issues);
    } finally {
      setSaving(false);
    }
  };

  const handleValidate = async (): Promise<void> => {
    if (refsJsonError || footnotesJsonError) {
      setError('JSON non valido nei pannelli references/footnotes');
      return;
    }
    setError(null);
    setSaveMsg(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const res = await validateChapter(token, axisSlug, slug, {
        body: bodyDraft,
        references: JSON.parse(refsJson),
        footnotes: JSON.parse(footnotesJson),
      });
      setIssues(res.issues);
      setSaveMsg(res.valid
        ? `✓ Validazione OK${res.issues.length > 0 ? ` (${res.issues.length} warning)` : ''}`
        : '✗ Validazione fallita — vedi sotto');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  // ── render ───────────────────────────────────────────────────────────────

  if (loading) {
    return <div className="p-8 text-slate-500">Caricamento…</div>;
  }
  if (!chapter) {
    return <div className="p-8 text-rose-700">Capitolo non trovato. <Link to="/admin/assi/capitoli" className="underline">Torna alla lista</Link></div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      {/* Header sticky */}
      <header className="border-b border-slate-200 bg-white px-6 py-3 shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-xs text-slate-500 mb-0.5">
              <Link to="/admin/assi/capitoli" className="hover:underline">Capitoli</Link>
              {' / '}
              <span className="font-mono">{chapter.axis_slug}</span>
              {' / '}
              <span className="font-mono">{chapter.slug}</span>
            </div>
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              className="text-xl font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none w-full"
            />
            <div className="text-xs text-slate-500 mt-1">
              cap. {chapter.chapter_number} · rev #{chapter._revision_count} · ultima modifica {fmtDate(chapter._last_edited)}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowRefsPanel((v) => !v)}
              className="text-sm px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50"
            >
              {showRefsPanel ? 'Nascondi refs' : `Refs (${chapter.references.length})`}
            </button>
            <button
              onClick={() => void handleValidate()}
              className="text-sm px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50"
            >
              Valida
            </button>
            <button
              onClick={() => void handleSave()}
              disabled={saving || !isDirty || !!refsJsonError || !!footnotesJsonError}
              className="text-sm px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium"
            >
              {saving ? 'Salvataggio…' : isDirty ? 'Salva' : 'Salvato'}
            </button>
          </div>
        </div>
        {(error || saveMsg) && (
          <div className="mt-2 text-sm">
            {error && <span className="text-rose-700 whitespace-pre-wrap">{error}</span>}
            {saveMsg && !error && <span className="text-emerald-700 whitespace-pre-wrap">{saveMsg}</span>}
          </div>
        )}
        {issues.length > 0 && (
          <div className="mt-2 p-2 rounded bg-amber-50 border border-amber-200 text-xs text-amber-900 max-h-32 overflow-y-auto">
            <strong>{issues.length} issue:</strong>
            <ul className="list-disc pl-5 mt-1 space-y-0.5">
              {issues.map((i, idx) => <li key={idx}><span className="font-mono">{i.kind}</span>: {i.detail}</li>)}
            </ul>
          </div>
        )}
      </header>

      {/* Split: source + preview */}
      <div className="flex-1 flex min-h-0">
        <div className="w-1/2 border-r border-slate-200 flex flex-col min-w-0">
          <div className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 border-b border-slate-200 shrink-0">
            Sorgente markdown · {bodyDraft.length} caratteri
          </div>
          <div className="flex-1 overflow-auto">
            <CodeMirror
              value={bodyDraft}
              onChange={(v) => setBodyDraft(v)}
              extensions={[markdown(), EditorView.lineWrapping]}
              theme="light"
              basicSetup={{ lineNumbers: true, foldGutter: false }}
              height="100%"
              style={{ fontSize: 13, fontFamily: 'ui-monospace, monospace' }}
            />
          </div>
        </div>

        <div className="w-1/2 flex flex-col min-w-0">
          <div className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 border-b border-slate-200 shrink-0 flex items-center justify-between">
            <div className="flex bg-white border border-slate-300 rounded overflow-hidden">
              {(['preview', 'refs'] as RightPaneMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setRightPaneMode(m)}
                  className={`px-2.5 py-0.5 text-xs transition-colors ${
                    rightPaneMode === m
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {m === 'preview' ? 'Anteprima' : `Riferimenti (${parsedReferences.length})`}
                </button>
              ))}
            </div>
            <span className="text-slate-400">
              {rightPaneMode === 'preview' ? 'debounced 400ms' : `${parsedFootnotes.length} footnotes`}
            </span>
          </div>
          <div className="flex-1 overflow-auto bg-white">
            {rightPaneMode === 'preview' ? (
              previewDoc ? (
                <div className="px-6 py-4">
                  <StructuredChapterRenderer
                    doc={previewDoc}
                    authors={authors}
                    books={books}
                  />
                </div>
              ) : (
                <div className="p-6 text-slate-400">No preview</div>
              )
            ) : (
              <ChapterRefsPanel
                references={parsedReferences}
                footnotes={parsedFootnotes}
                authors={authors}
                books={books}
                bodyText={bodyDraft}
                onReferencesChange={handleStructuredRefsChange}
                onFootnotesChange={handleStructuredFootnotesChange}
                onCatalogChanged={() => void reloadCatalog()}
              />
            )}
          </div>
        </div>
      </div>

      {/* Panel refs/footnotes (collassabile) */}
      {showRefsPanel && (
        <div className="border-t border-slate-200 bg-slate-50 max-h-[40vh] overflow-auto">
          <div className="grid grid-cols-2 gap-4 p-4">
            <div>
              <div className="text-xs font-medium text-slate-700 mb-1 flex items-center justify-between">
                <span>references[] (JSON)</span>
                {refsJsonError && <span className="text-rose-700">✗ {refsJsonError.slice(0, 60)}</span>}
              </div>
              <textarea
                value={refsJson}
                onChange={(e) => setRefsJson(e.target.value)}
                className={`w-full h-72 text-xs font-mono p-2 border rounded ${refsJsonError ? 'border-rose-400' : 'border-slate-300'}`}
              />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-700 mb-1 flex items-center justify-between">
                <span>footnotes[] (JSON)</span>
                {footnotesJsonError && <span className="text-rose-700">✗ {footnotesJsonError.slice(0, 60)}</span>}
              </div>
              <textarea
                value={footnotesJson}
                onChange={(e) => setFootnotesJson(e.target.value)}
                className={`w-full h-72 text-xs font-mono p-2 border rounded ${footnotesJsonError ? 'border-rose-400' : 'border-slate-300'}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
