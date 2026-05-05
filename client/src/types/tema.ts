// Tipi del tema (collection `temi`) — vedi server/src/models/Tema.ts.
// In questa fase MVP supportano solo l'Archivio. Estensione runtime
// (step_states, pending_decision, ecc.) arriverà col Laboratorio.

export type TemaStato =
  | 'bozza'
  | 'maturo'
  | 'promosso'
  | 'f2_in_corso'
  | 'f2_verificata'
  | 'parcheggiato'
  | 'abbandonato'
  | 'archiviato';

export const TEMA_STATI: TemaStato[] = [
  'bozza', 'maturo', 'promosso',
  'f2_in_corso', 'f2_verificata',
  'parcheggiato', 'abbandonato', 'archiviato',
];

export const TEMA_STATI_EDITABILI_ARCHIVIO: TemaStato[] = ['bozza', 'maturo'];
export const TEMA_STATI_PROMUOVIBILI:        TemaStato[] = ['maturo'];

export const TEMA_STATO_LABEL: Record<TemaStato, string> = {
  bozza:        'Bozza',
  maturo:       'Maturo',
  promosso:     'Promosso',
  f2_in_corso:  'F2 in corso',
  f2_verificata: 'F2 verificata',
  parcheggiato: 'Parcheggiato',
  abbandonato:  'Abbandonato',
  archiviato:   'Archiviato',
};

export const TEMA_ASSI = ['asse_1', 'asse_2', 'asse_3', 'asse_4', 'asse_5', 'asse_6'] as const;
export type TemaAsse = typeof TEMA_ASSI[number];

export const TEMA_ASSE_LABEL: Record<TemaAsse, string> = {
  asse_1: 'Asse 1 — Ontologico–fenomenologico',
  asse_2: 'Asse 2 — Affettivo–morale',
  asse_3: 'Asse 3 — Cognitivo–rappresentazionale',
  asse_4: 'Asse 4 — Linguistico–simbolico',
  asse_5: 'Asse 5 — Sociale–relazionale',
  asse_6: 'Asse 6 — Storico–culturale',
};

export interface Tema {
  _id?: string;
  tema_id: string;
  label: string;
  stato: TemaStato;
  descrizione: string;
  fonti: string[];
  asse_dominante: TemaAsse | null;
  note_ricercatore: string;
  promosso_at:    string | null;
  parcheggiato_at: string | null;
  abbandonato_at:  string | null;
  archiviato_at:   string | null;
  createdAt: string;
  updatedAt: string;
}

// Payload per create/update — sottoinsieme dei campi modificabili.
export interface TemaFormData {
  tema_id: string;
  label: string;
  stato: TemaStato;
  descrizione: string;
  fonti: string[];
  asse_dominante: TemaAsse | null;
  note_ricercatore: string;
}
