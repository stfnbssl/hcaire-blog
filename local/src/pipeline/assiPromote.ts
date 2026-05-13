// Pipeline post-Cowork: lettura staging → validazione Ajv → promozione atomica
// nei `precompiled/` del repo → upsert Mongo → trigger `npm run assi:archivio`.
//
// Garanzia: i file in `precompiled/` (source of truth) vengono sovrascritti SOLO
// se TUTTI E SEI i file di staging passano la validazione. In caso di fallimento
// dopo l'inizio della promozione, viene tentato un rollback dai backup.

import { promises as fs } from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import mongoose from 'mongoose';
import {
  AXES_STAGING_DIR,
  AXES_PRECOMPILED_DIR,
  AXES_BACKUPS_TO_KEEP,
  EXPECTED_AXIS_IDS,
  SERVER_DIR,
  AxisId,
} from './assiConstants.js';
import { validateAsse } from './assiSchemaValidator.js';

export type LogLevel = 'info' | 'warn' | 'error';
export type LogFn = (text: string, level?: LogLevel) => void;

export interface PromoteResult {
  axes_updated: AxisId[];
  backup_dir: string | null;
}

export async function assiPromote(opts: { executionId: string; onLog: LogFn }): Promise<PromoteResult> {
  const { onLog } = opts;

  // 1. Lettura + parsing dei 6 file di staging.
  onLog(`Lettura staging: ${AXES_STAGING_DIR}`);
  const stagingData: Record<AxisId, unknown> = {} as Record<AxisId, unknown>;
  for (const axisId of EXPECTED_AXIS_IDS) {
    const filePath = path.join(AXES_STAGING_DIR, `${axisId}.json`);
    let raw: string;
    try {
      raw = await fs.readFile(filePath, 'utf8');
    } catch (err) {
      throw new Error(`File staging mancante o non leggibile: ${filePath} — ${(err as Error).message}`);
    }
    try {
      stagingData[axisId] = JSON.parse(raw);
    } catch (err) {
      throw new Error(`File staging non è JSON valido: ${filePath} — ${(err as Error).message}`);
    }
    onLog(`  ✓ letto ${axisId}.json (${raw.length} byte)`);
  }

  // 2. Validazione Ajv di tutti i file. Raccogliamo TUTTI gli errori prima di
  //    fallire — più utile per il debug rispetto a fermarsi al primo.
  onLog('Validazione contro assi-fase-1.json…');
  const validationFailures: { axisId: AxisId; errors: string[] }[] = [];
  for (const axisId of EXPECTED_AXIS_IDS) {
    const data = stagingData[axisId];
    const result = await validateAsse(data);
    if (!result.valid) {
      validationFailures.push({ axisId, errors: result.errors });
      onLog(`  ✗ ${axisId}: ${result.errors.length} errore/i`, 'error');
      for (const e of result.errors.slice(0, 5)) onLog(`      ${e}`, 'error');
      if (result.errors.length > 5) onLog(`      … e altri ${result.errors.length - 5}`, 'error');
    } else {
      // Coerenza axis_id ↔ filename
      const declaredId = (data as { axis_id?: unknown }).axis_id;
      if (declaredId !== axisId) {
        validationFailures.push({
          axisId,
          errors: [`axis_id nel file ("${declaredId}") non corrisponde al filename (${axisId})`],
        });
        onLog(`  ✗ ${axisId}: axis_id mismatch (${declaredId})`, 'error');
      } else {
        onLog(`  ✓ ${axisId} valido`);
      }
    }
  }

  if (validationFailures.length > 0) {
    throw new Error(
      `Validazione fallita per ${validationFailures.length}/6 assi — i file in ${AXES_PRECOMPILED_DIR} NON sono stati toccati. ` +
      `Staging preservata in ${AXES_STAGING_DIR} per debug.`,
    );
  }

  // 3. Promozione atomica con backup.
  await fs.mkdir(AXES_PRECOMPILED_DIR, { recursive: true });
  const backupDir = path.join(AXES_PRECOMPILED_DIR, `.backup-${stampDir()}`);
  await fs.mkdir(backupDir, { recursive: true });
  onLog(`Backup precompiled correnti in ${backupDir}`);

  const promoted: AxisId[] = [];
  try {
    for (const axisId of EXPECTED_AXIS_IDS) {
      const targetPath = path.join(AXES_PRECOMPILED_DIR, `${axisId}.json`);
      const backupPath = path.join(backupDir, `${axisId}.json`);
      // Backup (skip se il file non esisteva ancora)
      try {
        await fs.copyFile(targetPath, backupPath);
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
      }
      // Scrittura nuova (overwrite con copyFile è atomico per file singolo su Windows)
      const stagingPath = path.join(AXES_STAGING_DIR, `${axisId}.json`);
      await fs.copyFile(stagingPath, targetPath);
      promoted.push(axisId);
    }
    onLog(`Promossi ${promoted.length} file in ${AXES_PRECOMPILED_DIR}`);
  } catch (err) {
    onLog(`Errore durante la promozione, tento rollback dai backup…`, 'error');
    for (const axisId of promoted) {
      const targetPath = path.join(AXES_PRECOMPILED_DIR, `${axisId}.json`);
      const backupPath = path.join(backupDir, `${axisId}.json`);
      try {
        await fs.copyFile(backupPath, targetPath);
        onLog(`  ↩ rollback ${axisId}`);
      } catch (rerr) {
        const code = (rerr as NodeJS.ErrnoException).code;
        if (code === 'ENOENT') {
          // Backup non esiste perché il file non c'era prima: lo cancello.
          try { await fs.unlink(targetPath); } catch { /* ignore */ }
          onLog(`  ↩ rimosso ${axisId} (non esisteva prima)`);
        } else {
          onLog(`  ✗ rollback ${axisId} fallito: ${(rerr as Error).message}`, 'error');
        }
      }
    }
    throw new Error(`Promozione interrotta: ${(err as Error).message}`);
  }

  // 4. Upsert su MongoDB.
  onLog('Upsert su collection `assi_strutturali`…');
  const db = mongoose.connection.db;
  if (!db || mongoose.connection.readyState !== 1) {
    throw new Error('Connessione MongoDB non attiva: impossibile fare upsert');
  }
  const collection = db.collection('assi_strutturali');
  const now = new Date();
  for (const axisId of EXPECTED_AXIS_IDS) {
    const data = stagingData[axisId] as Record<string, unknown>;
    await collection.updateOne(
      { axis_id: axisId },
      {
        $set: { ...data, _last_rebuilt: now, _source_version: stampDir() },
        $setOnInsert: { createdAt: now },
        $currentDate: { updatedAt: true },
      },
      { upsert: true },
    );
    onLog(`  ✓ upsert ${axisId}`);
  }

  // 5. Trigger `npm run assi:archivio` per rigenerare archivio-collegamenti.json.
  onLog('Lancio `npm run assi:archivio`…');
  try {
    await runArchivio(onLog);
    onLog('archivio-collegamenti.json aggiornato');
  } catch (err) {
    // L'archivio è derivato: un fallimento qui non invalida il rebuild.
    onLog(`Warning: npm run assi:archivio fallito (rebuild comunque valido): ${(err as Error).message}`, 'warn');
  }

  // 6. Cleanup backup oltre la soglia.
  await pruneOldBackups(onLog);

  return { axes_updated: [...EXPECTED_AXIS_IDS], backup_dir: backupDir };
}

function stampDir(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

async function pruneOldBackups(onLog: LogFn): Promise<void> {
  let entries: string[];
  try {
    entries = await fs.readdir(AXES_PRECOMPILED_DIR);
  } catch {
    return;
  }
  const backups = entries
    .filter((name) => name.startsWith('.backup-'))
    .map((name) => path.join(AXES_PRECOMPILED_DIR, name));

  if (backups.length <= AXES_BACKUPS_TO_KEEP) return;

  const withStat: { p: string; mtime: number }[] = [];
  for (const p of backups) {
    try {
      const st = await fs.stat(p);
      if (st.isDirectory()) withStat.push({ p, mtime: st.mtimeMs });
    } catch { /* skip */ }
  }
  withStat.sort((a, b) => b.mtime - a.mtime); // più recenti prima
  const toDelete = withStat.slice(AXES_BACKUPS_TO_KEEP);
  for (const { p } of toDelete) {
    try {
      await fs.rm(p, { recursive: true, force: true });
      onLog(`Backup vecchio rimosso: ${path.basename(p)}`);
    } catch (err) {
      onLog(`Cleanup backup ${p} fallito: ${(err as Error).message}`, 'warn');
    }
  }
}

function runArchivio(onLog: LogFn): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const isWin = process.platform === 'win32';
    const cmd = 'npm';
    const args = ['run', 'assi:archivio'];
    const proc = isWin
      ? spawn(`${cmd} ${args.join(' ')}`, [], { shell: true, cwd: SERVER_DIR, stdio: ['ignore', 'pipe', 'pipe'] })
      : spawn(cmd, args, { cwd: SERVER_DIR, stdio: ['ignore', 'pipe', 'pipe'] });

    let stderrBuf = '';
    proc.stdout?.on('data', (chunk: Buffer) => {
      for (const line of chunk.toString().split(/\r?\n/)) {
        if (line.trim()) onLog(`[archivio] ${line}`);
      }
    });
    proc.stderr?.on('data', (chunk: Buffer) => {
      const text = chunk.toString();
      stderrBuf += text;
      for (const line of text.split(/\r?\n/)) {
        if (line.trim()) onLog(`[archivio] ${line}`, 'warn');
      }
    });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`assi:archivio exit ${code}. Stderr: ${stderrBuf.slice(-300)}`));
    });
    proc.on('error', (err) => reject(err));
  });
}
