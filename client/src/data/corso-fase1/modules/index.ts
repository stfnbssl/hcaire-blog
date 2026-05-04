import type { Module } from '../types';
import { Module00 } from './m00';
import { Module01 } from './m01';
import { Module02 } from './m02';
import { Module03 } from './m03';
import { Module04 } from './m04';
import { Module05 } from './m05';
import { Module06 } from './m06';
import { Module07 } from './m07';

// Ordine di visualizzazione nella sidebar.
// M0: orientamento · M1: il soggetto · M2: gli assi · M3: asse 1 ·
// M4: assi 2-3 · M5: assi 4-5 · M6: asse 6 · M7: epistemologia.
export const MODULES: Module[] = [
  Module00,
  Module01,
  Module02,
  Module03,
  Module04,
  Module05,
  Module06,
  Module07,
];

export const MODULES_BY_ID: Record<string, Module> = MODULES.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<string, Module>,
);
