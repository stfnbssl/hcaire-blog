import { Module } from '../types';
import { Module00 } from './m00';
import { Module01 } from './m01';
import { Module02 } from './m02';
import { Module03 } from './m03';
import { Module04 } from './m04';
import { Module05 } from './m05';
import { Module06 } from './m06';
import { Module07 } from './m07';
import { Module08 } from './m08';

// Placeholder per i moduli M1–M8 ancora da costruire. Vengono mostrati
// nella sidebar come "in arrivo" finché non vengono implementati.
const placeholder = (
  id: string,
  number: number,
  title: string,
  shortTitle: string,
  accent: string,
): Module => ({
  id,
  number,
  title,
  shortTitle,
  accent,
  placeholder: true,
  slides: [
    {
      id: `${id}-placeholder`,
      type: 'narrative',
      title: `${title} — in arrivo`,
      content: `
        <div class="corso-narrative corso-narrative--centered">
          <p>Modulo in costruzione.</p>
          <p class="corso-narrative__caption">Il contenuto di questo modulo sarà disponibile prossimamente.</p>
        </div>
      `,
    },
  ],
});

export const MODULES: Module[] = [
  Module00,
  Module01,
  Module02,
  Module03,
  Module04,
  Module05,
  Module06,
  Module07,
  Module08,
];

export const MODULES_BY_ID: Record<string, Module> = MODULES.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<string, Module>,
);
