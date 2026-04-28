// Validatore Ajv per gli output della pipeline Letture.
// Carica gli schema da `server/schemas/letture/*.schema.json` (vedi spec).
// Cache lazy: il compilatore di un dato step viene costruito al primo uso.

import { promises as fs } from 'fs';
import path from 'path';
import Ajv, { ValidateFunction, ErrorObject } from 'ajv';
import { LettureStepId } from '../models/Opera';
import { LETTURE_STEP_SCHEMA_FILE, LETTURE_SCHEMAS_DIR } from '../utils/lettureSteps';

// In dev gli schema potrebbero non essere ancora copiati. STRICT=false → warning + skip;
// STRICT=true → validation fallisce (utile in produzione).
const STRICT = (process.env.PIPELINE_LETTURE_VALIDATE_STRICT ?? 'false').toLowerCase() === 'true';

export interface ValidationResult {
  valid: boolean;
  skipped: boolean;        // true se schema mancante (modalità non-strict)
  errors: string[];
}

const ajv = new Ajv({ allErrors: true, strict: false });

// Cache: step_id → { validator | null }. null = schema mancante (loggato una volta sola).
const cache = new Map<LettureStepId, ValidateFunction | null>();

async function loadValidator(stepId: LettureStepId): Promise<ValidateFunction | null> {
  if (cache.has(stepId)) return cache.get(stepId) ?? null;

  const filename = LETTURE_STEP_SCHEMA_FILE[stepId];
  const filepath = path.join(LETTURE_SCHEMAS_DIR, filename);

  try {
    const raw = await fs.readFile(filepath, 'utf8');
    const parsed = JSON.parse(raw);
    const fn = ajv.compile(parsed);
    cache.set(stepId, fn);
    return fn;
  } catch (err) {
    console.warn(
      `[letture-validator] schema mancante o non valido per ${stepId} (${filepath}): ${(err as Error).message}` +
      (STRICT ? ' (STRICT=true → validazione fallirà)' : ' (STRICT=false → validazione saltata)'),
    );
    cache.set(stepId, null);
    return null;
  }
}

function formatErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors) return [];
  return errors.map((e) => {
    const where = e.instancePath || '/';
    return `${where} ${e.message ?? '(errore)'}`;
  });
}

export async function validateStepOutput(
  stepId: LettureStepId,
  data: unknown,
): Promise<ValidationResult> {
  const validator = await loadValidator(stepId);
  if (!validator) {
    if (STRICT) {
      return {
        valid: false,
        skipped: false,
        errors: [`Schema non disponibile per lo step ${stepId} (PIPELINE_LETTURE_VALIDATE_STRICT=true)`],
      };
    }
    return { valid: true, skipped: true, errors: [] };
  }
  const ok = validator(data);
  return {
    valid: ok,
    skipped: false,
    errors: ok ? [] : formatErrors(validator.errors),
  };
}

// Per i test e per ricaricare gli schema dopo una copia in produzione.
export function clearLettureValidatorCache(): void {
  cache.clear();
}
