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
import { Module09 } from './m09';

// Ordine di visualizzazione nella sidebar. Coincide con l'ordine didattico
// del corso: M0 (orientamento), M1 (anomalie), M2 (pipeline), M3 (Nodo),
// M4 (Matrice), M5 (Dinamica), M6 (Grammatica), M7 (Operatore),
// M8 (Output-tipo), M9 (caso-guida completo).
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
  Module09,
];

// Mappa id → modulo per i deep-link.
export const MODULES_BY_ID: Record<string, Module> = MODULES.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<string, Module>,
);
