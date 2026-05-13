// Validatore Ajv per i JSON degli Assi Strutturali (schema assi-fase-1.json).
// Lazy load + cache. Se lo schema non è leggibile, validate() fallisce subito
// (no skip silenzioso: questo è un flusso di sola promozione).

import { promises as fs } from 'fs';
// Lo schema usa $schema=draft/2020-12, quindi serve il preset Ajv2020
// (l'Ajv di default supporta solo fino a draft-07 senza meta-schema aggiuntivo).
import Ajv2020 from 'ajv/dist/2020.js';
import type { ValidateFunction, ErrorObject } from 'ajv';
import { AXES_SCHEMA_PATH } from './assiConstants.js';

export interface AssiValidationResult {
  valid: boolean;
  errors: string[];
}

let cachedValidator: ValidateFunction | null = null;

async function loadValidator(): Promise<ValidateFunction> {
  if (cachedValidator) return cachedValidator;
  const raw = await fs.readFile(AXES_SCHEMA_PATH, 'utf8');
  const schema = JSON.parse(raw);
  // Una nuova istanza Ajv ad ogni load. Lo schema ha un $id che, in caso di reload,
  // collide con quello registrato in una istanza riusata ("already exists").
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  cachedValidator = ajv.compile(schema);
  return cachedValidator;
}

function formatErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors) return [];
  return errors.map((e) => `${e.instancePath || '/'} ${e.message ?? '(errore)'}`);
}

export async function validateAsse(data: unknown): Promise<AssiValidationResult> {
  let validator: ValidateFunction;
  try {
    validator = await loadValidator();
  } catch (err) {
    return {
      valid: false,
      errors: [`Schema non caricabile (${AXES_SCHEMA_PATH}): ${(err as Error).message}`],
    };
  }
  const ok = validator(data);
  return { valid: ok, errors: ok ? [] : formatErrors(validator.errors) };
}

export function clearAssiValidatorCache(): void {
  cachedValidator = null;
}
