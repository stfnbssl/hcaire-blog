/**
 * Seed script per caricare i dati Bartleby in MongoDB.
 * Idempotente: skippa le collection già popolate.
 * Uso: npx ts-node src/scripts/seedBartleby.ts
 */
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB } from '../config/db';
import FoundationDocument from '../models/bartleby/FoundationDocument';
import ConceptNode from '../models/bartleby/ConceptNode';
import DomainArea from '../models/bartleby/DomainArea';
import AreaSheet from '../models/bartleby/AreaSheet';
import Skill from '../models/bartleby/Skill';
import OutputTemplate from '../models/bartleby/OutputTemplate';
import InputTrace from '../models/bartleby/InputTrace';
import OutputDocument from '../models/bartleby/OutputDocument';
import {
  FoundationDocumentNode,
  AreaSheetNode,
  SkillNode,
  SkillArea,
} from '../models/bartleby/BridgeTables';

const SEED_DIR  = path.resolve(__dirname, '../data/bartleby/seed');
const SIM_DIR   = path.resolve(__dirname, '../data/bartleby/simulations');

function readJson<T>(filename: string): T[] {
  return JSON.parse(fs.readFileSync(path.join(SEED_DIR, filename), 'utf-8')) as T[];
}

function readMarkdown(filename: string): string {
  return fs.readFileSync(path.join(SIM_DIR, filename), 'utf-8');
}

async function seedCollection(
  name: string,
  Model: { countDocuments(): Promise<number>; insertMany(docs: unknown[]): Promise<unknown> },
  docs: Record<string, unknown>[],
  transform?: (doc: Record<string, unknown>) => Record<string, unknown>
): Promise<void> {
  const count = await Model.countDocuments();
  if (count > 0) {
    console.log(`[seed] ${name}: già presente (${count} record), skip.`);
    return;
  }
  const mapped = docs.map((doc) => {
    const base: Record<string, unknown> = transform ? transform(doc) : { ...doc };
    // Rinomina 'id' → 'bartlebyId' per i modelli principali
    if (base.id) {
      base.bartlebyId = base.id;
      delete base.id;
    }
    return base;
  });
  await Model.insertMany(mapped);
  console.log(`[seed] ${name}: inseriti ${mapped.length} record.`);
}

async function main() {
  await connectDB();
  console.log('[seed] Connesso a MongoDB. Inizio seed Bartleby...\n');

  // 1. FoundationDocuments
  const fdDocs = readJson<Record<string, unknown>>('foundation_documents.json');
  await seedCollection('FoundationDocuments', FoundationDocument, fdDocs);

  // 2. ConceptNodes
  const cnDocs = readJson<Record<string, unknown>>('concept_nodes.json');
  await seedCollection('ConceptNodes', ConceptNode, cnDocs);

  // 3. DomainAreas
  const daDocs = readJson<Record<string, unknown>>('domain_areas.json');
  await seedCollection('DomainAreas', DomainArea, daDocs);

  // 4. AreaSheets
  const asDocs = readJson<Record<string, unknown>>('area_sheets.json');
  await seedCollection('AreaSheets', AreaSheet, asDocs);

  // 5. Skills
  const skDocs = readJson<Record<string, unknown>>('skills.json');
  await seedCollection('Skills', Skill, skDocs);

  // 6. OutputTemplates
  const otDocs = readJson<Record<string, unknown>>('output_templates.json');
  await seedCollection('OutputTemplates', OutputTemplate, otDocs);

  // 7. InputTraces
  const itDocs = readJson<Record<string, unknown>>('input_traces.json');
  await seedCollection('InputTraces', InputTrace, itDocs, (doc) => ({
    ...doc,
    bartlebyId: doc.id ?? doc.corpus_id,
  }));

  // 8. OutputDocuments — inietta body dal file .md
  const odDocs = readJson<Record<string, unknown>>('output_documents.json');
  const simMap: Record<string, string> = {
    'od-001': readMarkdown('Simulazione-01-T-G03.md'),
    'od-002': readMarkdown('Simulazione-02-T-PI01.md'),
  };
  await seedCollection('OutputDocuments', OutputDocument, odDocs, (doc) => ({
    ...doc,
    body: simMap[(doc.id as string)] ?? '',
  }));

  // 9. Bridge: FoundationDocumentNodes
  const fdnDocs = readJson<Record<string, unknown>>('foundation_document_nodes.json');
  const fdnCount = await FoundationDocumentNode.countDocuments();
  if (fdnCount === 0) {
    await FoundationDocumentNode.insertMany(fdnDocs);
    console.log(`[seed] FoundationDocumentNodes: inseriti ${fdnDocs.length} record.`);
  } else {
    console.log(`[seed] FoundationDocumentNodes: già presente, skip.`);
  }

  // 10. Bridge: AreaSheetNodes
  const asnDocs = readJson<Record<string, unknown>>('area_sheet_nodes.json');
  const asnCount = await AreaSheetNode.countDocuments();
  if (asnCount === 0) {
    await AreaSheetNode.insertMany(asnDocs);
    console.log(`[seed] AreaSheetNodes: inseriti ${asnDocs.length} record.`);
  } else {
    console.log(`[seed] AreaSheetNodes: già presente, skip.`);
  }

  // 11. Bridge: SkillNodes
  const snDocs = readJson<Record<string, unknown>>('skill_nodes.json');
  const snCount = await SkillNode.countDocuments();
  if (snCount === 0) {
    await SkillNode.insertMany(snDocs);
    console.log(`[seed] SkillNodes: inseriti ${snDocs.length} record.`);
  } else {
    console.log(`[seed] SkillNodes: già presente, skip.`);
  }

  // 12. Bridge: SkillAreas
  const saDocs = readJson<Record<string, unknown>>('skill_areas.json');
  const saCount = await SkillArea.countDocuments();
  if (saCount === 0) {
    await SkillArea.insertMany(saDocs);
    console.log(`[seed] SkillAreas: inseriti ${saDocs.length} record.`);
  } else {
    console.log(`[seed] SkillAreas: già presente, skip.`);
  }

  console.log('\n[seed] Seed Bartleby completato.');
  process.exit(0);
}

main().catch((err) => {
  console.error('[seed] Errore:', err);
  process.exit(1);
});
