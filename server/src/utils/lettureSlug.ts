// Generatore di slug per opere — convenzione: {cognome}_{titolo}
// con disambiguazione `-2`, `-3` in caso di collisione.

import Opera from '../models/Opera';

const MAX_TITLE_TOKENS = 6;

// Combining diacritical marks (rimossi dopo NFD).
const COMBINING_MARKS_RE = /[̀-ͯ]/g;
// Apostrofi tipografici e dritti.
const APOSTROPHES_RE = /[‘’']/g;

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(COMBINING_MARKS_RE, '')
    .toLowerCase()
    .replace(APOSTROPHES_RE, ' ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function lastWord(s: string): string {
  const norm = normalize(s);
  if (!norm) return '';
  const tokens = norm.split(' ');
  return tokens[tokens.length - 1];
}

function slugifyTitle(s: string): string {
  const tokens = normalize(s).split(' ').filter(Boolean);
  return tokens.slice(0, MAX_TITLE_TOKENS).join('-');
}

// Costruisce lo slug base; non controlla collisioni.
export function buildSlugBase(autore: string, titolo: string): string {
  const cognome = lastWord(autore) || 'autore';
  const titoloSlug = slugifyTitle(titolo) || 'opera';
  return `${cognome}_${titoloSlug}`;
}

// Risolve eventuali collisioni interrogando MongoDB. Se `baseSlug` è libero
// lo restituisce; altrimenti aggiunge `-2`, `-3`, ... fino al primo libero.
export async function resolveUniqueSlug(autore: string, titolo: string): Promise<string> {
  const base = buildSlugBase(autore, titolo);

  const existing = await Opera.find(
    { slug: { $regex: `^${escapeRegex(base)}(-\\d+)?$` } },
    { slug: 1, _id: 0 },
  ).lean();

  if (existing.length === 0) return base;

  const taken = new Set(existing.map((d) => d.slug));
  if (!taken.has(base)) return base;

  for (let n = 2; n < 1000; n++) {
    const candidate = `${base}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${base}-${Date.now()}`;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
