import { Module } from '../types';
import { Module00 } from './m00';
import { Module01 } from './m01';

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
  placeholder('m02', 2, "Dalla CE allo strumento", 'CE → strumento', '#0e8f7f'),
  placeholder('m03', 3, 'Il nodo dominante', 'Nodo dominante', '#e67e22'),
  placeholder('m04', 4, 'Le quattro funzioni', 'Quattro funzioni', '#3498db'),
  placeholder('m05', 5, 'Il micro-dispositivo', 'Micro-dispositivo', '#2d6a4f'),
  placeholder('m06', 6, 'La tipologia U1–U6', 'Tipologia U1–U6', '#16a085'),
  placeholder('m07', 7, 'Logica decisionale', 'Logica decisionale', '#c0392b'),
  placeholder('m08', 8, 'Pipeline F3 completa', 'Pipeline completa', '#1a6b8a'),
];

export const MODULES_BY_ID: Record<string, Module> = MODULES.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<string, Module>,
);
