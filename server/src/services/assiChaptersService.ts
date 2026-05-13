// Service business-logic per i capitoli degli assi (Fase A 2026-05-11).
//
// Funzioni:
//   - updateChapterContent: PATCH lato Mongo (body + metadata) + side-effects:
//       a) bump _revision_count, _last_edited, _last_edited_by
//       b) ricalcolo sezioni dal body
//       c) auto-export verso normalized/*.md (dual-write, fire-and-forget)
//   - validateReferences: integrità body ↔ references ↔ footnotes
//
// La validazione blocca il PATCH se il body ha {{ref:rX}} non in references
// o se references puntano a footnoteId non in footnotes.

import GithubSlugger from 'github-slugger';
import AssiChapter, { IAssiChapter, IReference, IFootnote } from '../models/AssiChapter';
import { exportChapterToMd } from '../scripts/exportAssiChapterToMd';

export interface UpdateChapterInput {
  body?: string;
  title?: string;
  references?: IReference[];
  footnotes?: IFootnote[];
  is_published?: boolean;
}

export interface ValidationIssue {
  kind: 'missing_ref' | 'orphan_ref' | 'missing_footnote' | 'orphan_footnote' | 'duplicate_ref' | 'duplicate_footnote';
  detail: string;
}

const REF_TOKEN_RE = /\{\{ref:(r\d+)\}\}/g;

export function validateReferences(
  body: string,
  references: IReference[],
  footnotes: IFootnote[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // ID univoci
  const refIds = new Set<string>();
  for (const r of references) {
    if (refIds.has(r.id)) issues.push({ kind: 'duplicate_ref', detail: `reference duplicata: ${r.id}` });
    refIds.add(r.id);
  }
  const fnIds = new Set<string>();
  for (const f of footnotes) {
    if (fnIds.has(f.id)) issues.push({ kind: 'duplicate_footnote', detail: `footnote duplicata: ${f.id}` });
    fnIds.add(f.id);
  }

  // Token nel body → reference esistente
  const tokensInBody = new Set<string>();
  let m: RegExpExecArray | null;
  REF_TOKEN_RE.lastIndex = 0;
  while ((m = REF_TOKEN_RE.exec(body)) !== null) {
    tokensInBody.add(m[1]);
  }
  for (const t of tokensInBody) {
    if (!refIds.has(t)) issues.push({ kind: 'missing_ref', detail: `body cita {{ref:${t}}} ma non c'è references[${t}]` });
  }
  for (const r of references) {
    if (!tokensInBody.has(r.id)) issues.push({ kind: 'orphan_ref', detail: `references[${r.id}] non è usato nel body` });
  }

  // references.footnoteId → footnote esistente
  for (const r of references) {
    if (!fnIds.has(r.footnoteId)) issues.push({ kind: 'missing_footnote', detail: `reference ${r.id} punta a ${r.footnoteId} mancante` });
  }
  const usedFnIds = new Set(references.map((r) => r.footnoteId));
  for (const f of footnotes) {
    if (!usedFnIds.has(f.id)) issues.push({ kind: 'orphan_footnote', detail: `footnote ${f.id} non è puntata da nessuna reference` });
  }

  return issues;
}

function extractSections(body: string): { anchor: string; title: string; order: number }[] {
  const slugger = new GithubSlugger();
  const sections: { anchor: string; title: string; order: number }[] = [];
  const re = /^##\s+(.+?)\s*$/gm;
  let m: RegExpExecArray | null;
  let order = 0;
  while ((m = re.exec(body)) !== null) {
    const title = m[1].trim();
    if (!title) continue;
    sections.push({ anchor: slugger.slug(title), title, order: order++ });
  }
  return sections;
}

export interface UpdateChapterResult {
  chapter: IAssiChapter;
  exported_to: string | null;       // path del .md scritto (null se export fallito)
  export_error: string | null;
}

/**
 * PATCH un capitolo. Lancia Error con `.issues?: ValidationIssue[]` se la
 * validazione references/body fallisce.
 */
export async function updateChapterContent(
  axisSlug: string,
  slug: string,
  input: UpdateChapterInput,
  editedBy: string | null,
): Promise<UpdateChapterResult> {
  const existing = await AssiChapter.findOne({ axis_slug: axisSlug, slug });
  if (!existing) throw new Error('Capitolo non trovato');

  // Calcolo i valori finali (input ha priorità)
  const finalBody = input.body ?? existing.body;
  const finalRefs = input.references ?? existing.references;
  const finalFootnotes = input.footnotes ?? existing.footnotes;

  // Validazione integrità riferimenti
  const issues = validateReferences(finalBody, finalRefs, finalFootnotes);
  const blocking = issues.filter((i) =>
    i.kind === 'missing_ref' || i.kind === 'missing_footnote' ||
    i.kind === 'duplicate_ref' || i.kind === 'duplicate_footnote',
  );
  if (blocking.length > 0) {
    const err = new Error(`Validazione references fallita: ${blocking.map((b) => b.detail).join('; ')}`);
    (err as Error & { issues?: ValidationIssue[] }).issues = issues;
    throw err;
  }

  // Aggiornamento
  existing.body = finalBody;
  if (input.title !== undefined) existing.title = input.title;
  existing.references = finalRefs;
  existing.footnotes = finalFootnotes;
  if (input.is_published !== undefined) existing.is_published = input.is_published;
  existing.sections = extractSections(finalBody);
  existing._last_edited = new Date();
  existing._last_edited_by = editedBy;
  existing._revision_count = (existing._revision_count ?? 0) + 1;

  await existing.save();

  // Dual-write: rigenera il .md in normalized/. Fire-and-forget con error capture.
  let exportedPath: string | null = null;
  let exportError: string | null = null;
  try {
    exportedPath = await exportChapterToMd(existing);
  } catch (err) {
    exportError = (err as Error).message;
    console.warn(`[assi-chapters] dual-write export fallito per ${axisSlug}/${slug}: ${exportError}`);
  }

  return { chapter: existing, exported_to: exportedPath, export_error: exportError };
}
