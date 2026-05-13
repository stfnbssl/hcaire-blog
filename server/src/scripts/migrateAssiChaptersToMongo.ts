/**
 * Migrazione run-once: legge i 44 capitoli JSON in
 *   server/content/progetti/sviluppo bambino/assi strutturali/json/<asse>/<cap>.json
 * e fa upsert nella collection MongoDB `assi_chapters` (Fase A 2026-05-11).
 *
 * Idempotente: rilanciandolo aggiorna i campi senza duplicare. Imposta
 * `_last_imported` ma NON modifica `_last_edited` (che resta a null finché
 * l'admin non edita il capitolo).
 *
 * Uso:
 *   ts-node src/scripts/migrateAssiChaptersToMongo.ts
 *   ts-node src/scripts/migrateAssiChaptersToMongo.ts --dry-run
 */

import '../loadEnv';
import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';
import GithubSlugger from 'github-slugger';
import AssiChapter from '../models/AssiChapter';
import type { ChapterDocument } from '../shared/types/assi';

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const JSON_DIR = path.join(
  REPO_ROOT, 'server', 'content', 'progetti', 'sviluppo bambino',
  'assi strutturali', 'json',
);

// ── helpers ────────────────────────────────────────────────────────────────

function listSubdirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

function listJsonFiles(dir: string): string[] {
  return fs.readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.json'))
    .sort();
}

function extractSections(body: string): { anchor: string; title: string; order: number }[] {
  const slugger = new GithubSlugger();
  const sections: { anchor: string; title: string; order: number }[] = [];
  // Match `## titolo` a inizio riga, NON dentro a code blocks.
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

function basenameOfSource(sourceFile: string | undefined): string | null {
  if (!sourceFile) return null;
  // Il _meta.sourceFile è relativo al repo root con separatori posix.
  return path.basename(sourceFile);
}

// ── migrazione ─────────────────────────────────────────────────────────────

interface CliArgs { dryRun: boolean; }

function parseArgs(argv: string[]): CliArgs {
  return { dryRun: argv.includes('--dry-run') };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  const password = process.env.MONGODB_PASSWORD;
  const url = process.env.MONGODB_URL?.replace('{password}', password ?? '').replace('/?', '/hcaire_db?');
  if (!url) throw new Error('MONGODB_URL non configurata');
  await mongoose.connect(url);
  console.log('[migrate] Mongo connesso');

  let upserted = 0;
  let totalSections = 0;

  try {
    const asseDirs = listSubdirs(JSON_DIR);
    if (asseDirs.length === 0) {
      console.warn(`[migrate] Nessuna sottocartella in ${JSON_DIR}. Lancia prima 'npm run assi:convert -- --write'.`);
      return;
    }

    for (const asseFolder of asseDirs) {
      const dir = path.join(JSON_DIR, asseFolder);
      const files = listJsonFiles(dir);
      console.log(`[migrate] ${asseFolder}: ${files.length} capitoli`);

      for (const f of files) {
        const raw = fs.readFileSync(path.join(dir, f), 'utf8');
        const doc = JSON.parse(raw) as ChapterDocument;
        const fm = doc.frontmatter;

        const sections = extractSections(doc.body);
        totalSections += sections.length;

        const sourceFilename = basenameOfSource(doc._meta?.sourceFile) ?? f.replace(/\.json$/i, '.md');

        const update = {
          axis_slug: fm.asse_slug,
          axis_folder: fm.asse,
          axis_number: fm.asse_number,
          slug: fm.slug,
          chapter_number: fm.chapter,
          order: fm.order,
          title: fm.title,
          body: doc.body,
          references: doc.references,
          footnotes: doc.footnotes,
          sections,
          prev_slug: fm.prev,
          next_slug: fm.next,
          source_filename: sourceFilename,
          _last_imported: new Date(),
        };

        if (args.dryRun) {
          console.log(`  [dry] ${fm.asse_slug}/${fm.slug} (${sections.length} sezioni)`);
        } else {
          await AssiChapter.updateOne(
            { axis_slug: fm.asse_slug, slug: fm.slug },
            {
              $set: update,
              $setOnInsert: { is_published: true, _revision_count: 0 },
            },
            { upsert: true },
          );
          upserted++;
        }
      }
    }

    console.log(`[migrate] ${args.dryRun ? '(dry-run) ' : ''}${upserted} capitoli upsert, ${totalSections} sezioni totali`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => { console.error('[migrate] ERROR:', err); process.exit(1); });
