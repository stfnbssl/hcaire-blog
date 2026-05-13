// Costanti per il rebuild Assi Strutturali (canali e path dedicati, separati da
// produzioni e letture).

import path from 'path';

// ---------- canali Redis ----------

export const ASSI_COMMANDS_KEY   = process.env.REDIS_ASSI_COMMANDS_KEY   ?? 'hcaire:assi:commands';
export const ASSI_EVENTS_CHANNEL = process.env.REDIS_ASSI_EVENTS_CHANNEL ?? 'hcaire:assi:events';

// ---------- filesystem ----------

// Cartella di lavoro Cowork (cwd dello spawn): dedicata al preprocessing assi.
export const COWORK_ASSI_PATH = process.env.COWORK_ASSI_PATH
  ?? 'C:/my/claude/claude-cowork/Sviluppo Bambino';

// Sorgente: 6 sottocartelle con i .md dei capitoli, già nel repo.
export const NORMALIZED_AXES_DIR = process.env.NORMALIZED_AXES_DIR
  ?? 'C:/my/projects/hcaire-blog/server/content/progetti/sviluppo bambino/assi strutturali/normalized';

// Staging: dove Cowork scrive i 6 JSON, FUORI dal repo. Letti poi da assiPromote
// per validazione + promozione atomica nei `precompiled/` del repo.
export const AXES_STAGING_DIR = process.env.AXES_STAGING_DIR
  ?? path.join(COWORK_ASSI_PATH, 'output', 'assi-strutturali', 'staging');

// Source of truth: 6 JSON nel repo. Sovrascritti solo dopo validazione OK di tutti
// e sei i file di staging.
export const AXES_PRECOMPILED_DIR = process.env.AXES_PRECOMPILED_DIR
  ?? 'C:/my/projects/hcaire-blog/server/content/progetti/sviluppo bambino/assi strutturali/precompiled';

// JSON Schema (Ajv) usato dal validatore.
export const AXES_SCHEMA_PATH = process.env.AXES_SCHEMA_PATH
  ?? path.join(COWORK_ASSI_PATH, 'input', 'assi strutturali', 'preprocessing', 'assi-fase-1.json');

// CLAUDE.md letto come prompt da AssiPromptComposer.
export const AXES_CLAUDE_MD_PATH = process.env.AXES_CLAUDE_MD_PATH
  ?? path.join(COWORK_ASSI_PATH, 'input', 'assi strutturali', 'preprocessing', 'CLAUDE.md');

// Root del server (cwd per `npm run assi:archivio` post-rebuild).
export const SERVER_DIR = process.env.ASSI_SERVER_DIR
  ?? 'C:/my/projects/hcaire-blog/server';

// Timeout default per il rebuild. Osservato 2026-05-11: ~8 min per asse → 60 min/6 assi.
export const ASSI_DEFAULT_TIMEOUT_MS = parseInt(
  process.env.ASSI_DEFAULT_TIMEOUT_MS ?? String(60 * 60 * 1000),
  10,
);

// Modalità mock: salta lo spawn di Cowork e scrive 6 file di staging finti
// copiando i precompiled correnti (utile per testare promozione + upsert senza Cowork).
export const ASSI_MOCK_MODE = (process.env.ASSI_MOCK_MODE ?? 'false').toLowerCase() === 'true';

// Backup precedenti da conservare (oltre questo numero vengono cancellati).
export const AXES_BACKUPS_TO_KEEP = parseInt(process.env.AXES_BACKUPS_TO_KEEP ?? '3', 10);

// I 6 axis_id attesi: il rebuild deve produrre tutti e 6 i file per essere valido.
export const EXPECTED_AXIS_IDS = ['asse_1', 'asse_2', 'asse_3', 'asse_4', 'asse_5', 'asse_6'] as const;
export type AxisId = typeof EXPECTED_AXIS_IDS[number];
