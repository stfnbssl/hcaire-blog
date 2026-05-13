// Pannello strutturato per editare references[] e footnotes[] di un capitolo.
// Sostituisce la preview a destra dell'editor capitolo quando il toggle è
// su "Riferimenti". Le modifiche si propagano via onReferencesChange/
// onFootnotesChange e verranno salvate insieme al body quando l'utente
// preme "Salva" del capitolo.

import { useMemo, useState } from 'react';
import CatalogPicker from './CatalogPicker';
import QuickCreateCatalogItem from './QuickCreateCatalogItem';
import type { Author, Book, Reference, Footnote } from '@shared/types/assi';

interface Props {
  references: Reference[];
  footnotes: Footnote[];
  authors: Author[];
  books: Book[];
  bodyText: string;
  onReferencesChange: (refs: Reference[]) => void;
  onFootnotesChange: (fns: Footnote[]) => void;
  /** chiamato dopo aver creato un nuovo autore/libro nel catalogo, per ricaricare authors/books */
  onCatalogChanged: () => void;
}

// ── utility id ────────────────────────────────────────────────────────────

function nextRefId(existing: Reference[]): string {
  const nums = existing
    .map((r) => {
      const m = r.id.match(/^r(\d+)$/);
      return m ? Number(m[1]) : 0;
    })
    .filter((n) => Number.isFinite(n));
  const max = nums.length === 0 ? 0 : Math.max(...nums);
  return `r${max + 1}`;
}

function nextFootnoteId(existing: Footnote[]): { id: string; num: string } {
  const nums = existing
    .map((f) => {
      const m = f.id.match(/^fn-?(\d+)$/);
      return m ? Number(m[1]) : 0;
    })
    .filter((n) => Number.isFinite(n));
  const max = nums.length === 0 ? 0 : Math.max(...nums);
  const next = max + 1;
  return { id: `fn-${next}`, num: String(next) };
}

// ── pannello principale ────────────────────────────────────────────────────

export default function ChapterRefsPanel({
  references,
  footnotes,
  authors,
  books,
  bodyText,
  onReferencesChange,
  onFootnotesChange,
  onCatalogChanged,
}: Props): JSX.Element {
  const [quickCreate, setQuickCreate] = useState<
    | { kind: 'author'; initialQuery: string; targetRefIndex: number }
    | { kind: 'book'; initialQuery: string; targetRefIndex: number }
    | null
  >(null);

  const authorById = useMemo(() => new Map(authors.map((a) => [a.id, a])), [authors]);
  const bookById = useMemo(() => new Map(books.map((b) => [b.id, b])), [books]);

  // Token presenti nel body: utile per evidenziare reference orfane / non inserite.
  const tokensInBody = useMemo(() => {
    const set = new Set<string>();
    const re = /\{\{ref:(r\d+)\}\}/g;
    let m;
    while ((m = re.exec(bodyText)) !== null) set.add(m[1]);
    return set;
  }, [bodyText]);

  // ── references ops ──────────────────────────────────────────────────────

  const addReference = (): void => {
    const id = nextRefId(references);
    onReferencesChange([
      ...references,
      { id, footnoteId: '', authorIds: [], bookIds: [] },
    ]);
  };

  const updateReference = (i: number, patch: Partial<Reference>): void => {
    const next = [...references];
    next[i] = { ...next[i], ...patch };
    onReferencesChange(next);
  };

  const removeReference = (i: number): void => {
    onReferencesChange(references.filter((_, idx) => idx !== i));
  };

  // ── footnotes ops ───────────────────────────────────────────────────────

  const addFootnote = (): void => {
    const { id, num } = nextFootnoteId(footnotes);
    onFootnotesChange([...footnotes, { id, num, text: '' }]);
  };

  const updateFootnote = (i: number, patch: Partial<Footnote>): void => {
    const next = [...footnotes];
    next[i] = { ...next[i], ...patch };
    onFootnotesChange(next);
  };

  const removeFootnote = (i: number): void => {
    onFootnotesChange(footnotes.filter((_, idx) => idx !== i));
  };

  return (
    <div className="p-4 space-y-6">
      {/* ── References ──────────────────────────────────────────────────── */}
      <section>
        <header className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">
            References <span className="text-slate-400 font-normal">({references.length})</span>
          </h3>
          <button
            onClick={addReference}
            className="text-xs px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            + Aggiungi
          </button>
        </header>

        {references.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Nessuna reference. Aggiungine una per inserire un riferimento bibliografico nel testo.</p>
        ) : (
          <ul className="space-y-2">
            {references.map((ref, i) => {
              const token = `{{ref:${ref.id}}}`;
              const inBody = tokensInBody.has(ref.id);
              const footnote = footnotes.find((f) => f.id === ref.footnoteId);
              return (
                <li key={ref.id} className="border border-slate-200 rounded p-3 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">{ref.id}</code>
                      <button
                        type="button"
                        onClick={() => void navigator.clipboard.writeText(token)}
                        className="text-[10px] text-slate-500 hover:text-emerald-700 hover:underline"
                        title="Copia il token da incollare nel body"
                      >
                        copia {token}
                      </button>
                      {!inBody && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800"
                          title="Il token non compare nel body"
                        >
                          orfana
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeReference(i)}
                      className="text-xs text-rose-700 hover:underline shrink-0"
                    >
                      Elimina
                    </button>
                  </div>

                  {/* Autori */}
                  <div className="mb-2">
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Autori</p>
                    <Chips
                      ids={ref.authorIds}
                      lookup={(id) => {
                        const a = authorById.get(id);
                        return a ? { label: a.nome, image: a.image } : null;
                      }}
                      kind="author"
                      onRemove={(id) => updateReference(i, {
                        authorIds: ref.authorIds.filter((x) => x !== id),
                      })}
                    />
                    <CatalogPicker
                      kind="author"
                      excludeIds={ref.authorIds}
                      onPick={(id) => updateReference(i, {
                        authorIds: [...ref.authorIds, id],
                      })}
                      onCreateNew={(q) => setQuickCreate({ kind: 'author', initialQuery: q, targetRefIndex: i })}
                    />
                  </div>

                  {/* Libri */}
                  <div className="mb-2">
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Libri</p>
                    <Chips
                      ids={ref.bookIds}
                      lookup={(id) => {
                        const b = bookById.get(id);
                        return b ? { label: b.titolo, image: b.cover } : null;
                      }}
                      kind="book"
                      onRemove={(id) => updateReference(i, {
                        bookIds: ref.bookIds.filter((x) => x !== id),
                      })}
                    />
                    <CatalogPicker
                      kind="book"
                      excludeIds={ref.bookIds}
                      onPick={(id) => updateReference(i, {
                        bookIds: [...ref.bookIds, id],
                      })}
                      onCreateNew={(q) => setQuickCreate({ kind: 'book', initialQuery: q, targetRefIndex: i })}
                    />
                  </div>

                  {/* Footnote */}
                  <div>
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Footnote collegata</p>
                    <select
                      value={ref.footnoteId}
                      onChange={(e) => updateReference(i, { footnoteId: e.target.value })}
                      className="w-full text-xs px-2 py-1 border border-slate-300 rounded bg-white"
                    >
                      <option value="">— nessuna —</option>
                      {footnotes.map((f) => (
                        <option key={f.id} value={f.id}>
                          [{f.num}] {f.text.slice(0, 60)}{f.text.length > 60 ? '…' : ''}
                        </option>
                      ))}
                    </select>
                    {ref.footnoteId && !footnote && (
                      <p className="text-[10px] text-rose-700 mt-1">⚠ footnoteId punta a una footnote inesistente</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Footnotes ───────────────────────────────────────────────────── */}
      <section>
        <header className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Footnotes <span className="text-slate-400 font-normal">({footnotes.length})</span>
          </h3>
          <button
            onClick={addFootnote}
            className="text-xs px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            + Aggiungi
          </button>
        </header>

        {footnotes.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Nessuna footnote.</p>
        ) : (
          <ul className="space-y-2">
            {footnotes.map((fn, i) => {
              const usedByRefs = references.filter((r) => r.footnoteId === fn.id);
              return (
                <li key={fn.id} className="border border-slate-200 rounded p-3 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">{fn.id}</code>
                      <span className="text-[10px] text-slate-500">
                        usata da {usedByRefs.length} ref
                        {usedByRefs.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFootnote(i)}
                      className="text-xs text-rose-700 hover:underline"
                    >
                      Elimina
                    </button>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="shrink-0 w-12">
                      <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Num</p>
                      <input
                        type="text"
                        value={fn.num}
                        onChange={(e) => updateFootnote(i, { num: e.target.value })}
                        className="w-full text-xs text-center px-1 py-1 border border-slate-300 rounded font-mono"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Testo (markdown)</p>
                      <textarea
                        value={fn.text}
                        onChange={(e) => updateFootnote(i, { text: e.target.value })}
                        rows={3}
                        className="w-full text-xs px-2 py-1 border border-slate-300 rounded font-sans"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Quick create modal ──────────────────────────────────────────── */}
      {quickCreate && (
        <QuickCreateCatalogItem
          kind={quickCreate.kind}
          initialName={quickCreate.initialQuery}
          onClose={() => setQuickCreate(null)}
          onCreated={(newId) => {
            // Aggiunge l'id alla reference che ha aperto il modal
            const i = quickCreate.targetRefIndex;
            const ref = references[i];
            if (ref) {
              if (quickCreate.kind === 'author' && !ref.authorIds.includes(newId)) {
                updateReference(i, { authorIds: [...ref.authorIds, newId] });
              } else if (quickCreate.kind === 'book' && !ref.bookIds.includes(newId)) {
                updateReference(i, { bookIds: [...ref.bookIds, newId] });
              }
            }
            onCatalogChanged();
          }}
        />
      )}
    </div>
  );
}

// ── chip list per autori/libri già scelti su una reference ─────────────────

function Chips({
  ids,
  lookup,
  kind,
  onRemove,
}: {
  ids: string[];
  lookup: (id: string) => { label: string; image: string } | null;
  kind: 'author' | 'book';
  onRemove: (id: string) => void;
}): JSX.Element {
  if (ids.length === 0) return <></>;
  return (
    <div className="flex flex-wrap gap-1.5 mb-1.5">
      {ids.map((id) => {
        const item = lookup(id);
        return (
          <span
            key={id}
            className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-slate-100 border border-slate-200"
            title={id}
          >
            {item?.image ? (
              <img
                src={item.image}
                alt=""
                className={kind === 'author' ? 'h-5 w-5 rounded-full object-cover' : 'h-6 w-4 object-cover'}
              />
            ) : (
              <span className="h-5 w-5 rounded-full bg-slate-200 inline-block" />
            )}
            <span className="text-xs text-slate-800 max-w-[160px] truncate">
              {item ? item.label : <span className="text-rose-700 font-mono">⚠ {id}</span>}
            </span>
            <button
              type="button"
              onClick={() => onRemove(id)}
              className="text-slate-400 hover:text-rose-700 leading-none"
              aria-label="Rimuovi"
            >
              ×
            </button>
          </span>
        );
      })}
    </div>
  );
}
