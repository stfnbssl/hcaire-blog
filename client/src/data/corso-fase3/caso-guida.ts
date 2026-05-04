// Caso-guida del corso F3 (filo rosso). A differenza di F1 e F2, in F3
// l'oggetto è completo fin dall'inizio: contiene la scena base, la CE
// prodotta dalla F2 e tutti i dati prodotti dall'applicazione della F3.
// I moduli lo svelano progressivamente ai partecipanti, ma il dato è
// disponibile per tutti i moduli dall'avvio.

export interface CENodo {
  stato: '↑' | '↓' | '~' | '!' | '?';
  label: string;
  /** Variabile CSS (es. 'var(--corso-n2)') o colore esadecimale. */
  colore: string;
}

export interface CEData {
  nodi: Record<string, CENodo>;
  relazione: string;
  direzione: string;
  tenuta: string;
  abitabilita: string;
  grammaticale: string;
}

export const CASO_GUIDA_F3 = {
  titolo: 'Lettura condivisa adulto-bambino',
  scena: `Durante un bilancio di salute, il pediatra propone per alcuni minuti una breve situazione di lettura condivisa. Il bambino ha circa 18-24 mesi. È presente un genitore. Sul tavolo c'è un piccolo libro illustrato con immagini semplici: animali, oggetti familiari, figure umane.

Il bambino prende il libro, lo apre, guarda alcune immagini, indica una figura, vocalizza qualcosa e guarda l'adulto. Il genitore nomina l'immagine, sorride, aspetta. Il bambino torna a guardare il libro, gira pagina, poi mostra un'altra figura all'adulto.`,

  // ─── CE prodotta dalla F2 (input di F3) ─────────────────────────────────
  ce: {
    nodi: {
      N1: { stato: '~', label: 'Regolazione', colore: 'var(--corso-n1)' },
      N2: { stato: '↑', label: 'Campo relazionale', colore: 'var(--corso-n2)' },
      N3: { stato: '~', label: 'Mondo condiviso', colore: 'var(--corso-n3)' },
      N4: { stato: '↓', label: 'Apertura / Esplorazione', colore: 'var(--corso-n4)' },
      N5: { stato: '~', label: 'Limite reale', colore: 'var(--corso-n5)' },
      N6: { stato: '~', label: 'Continuità', colore: 'var(--corso-n6)' },
      N7: { stato: '~', label: 'Desiderio', colore: 'var(--corso-n7)' },
    },
    relazione: 'N2→N3 (MED)',
    direzione: '↗',
    tenuta: 'T2',
    abitabilita: 'A±',
    grammaticale:
      'Campo relazionale forte che sostiene accesso al mondo condiviso simbolico, con esplorazione ridotta ma in espansione. Configurazione fragile ma evolutivamente aperta.',
  } satisfies CEData,

  // ─── Letture sintetiche dei nodi (per la slide di apertura) ─────────────
  letturaNodi: {
    N1: 'Il campo non collassa, non è particolarmente stabile.',
    N2: 'Il genitore co-regola attivamente — risorsa principale.',
    N3: "L'accesso al simbolico è presente ma discontinuo.",
    N4: "L'esplorazione autonoma è ridotta nel contesto del bilancio.",
    N5: 'Il limite non è un tema dominante nella scena.',
    N6: 'La sequenza si interrompe e riprende — sufficiente.',
    N7: "L'iniziativa è presente ma non direzionata.",
  } as Record<string, string>,

  // ─── Applicazione F3 al caso-guida ──────────────────────────────────────
  f3: {
    nodoDominante: {
      codice: 'N3',
      nome: 'Accesso al mondo condiviso simbolico',
      colore: 'var(--corso-n3)',
      motivazione:
        "N3 è il nodo la cui apertura muove il campo nella direzione evolutiva indicata (D↗). Non è il nodo con lo stato più basso numericamente (N4↓), ma è quello la cui attivazione produce il cambiamento più rilevante per l'abitabilità complessiva del campo.",
    },
    nodoSostegno: {
      codice: 'N2',
      nome: 'Campo relazionale / Co-regolazione',
      colore: 'var(--corso-n2)',
      ruolo:
        "N2 è sostenuto (↑) e costituisce la risorsa su cui si appoggia l'intervento: senza co-regolazione attiva, l'accesso al mondo condiviso non si produce.",
    },
    nodoInTensione: {
      codice: 'N4',
      nome: 'Apertura / Esplorazione del mondo',
      colore: 'var(--corso-n4)',
      nota:
        "N4↓ è il nodo limitante secondario. Non è il target dell'intervento in questo contesto, ma va tenuto presente: un dispositivo che sovraccarica il campo riduce ulteriormente l'esplorabilità.",
    },

    funzione: 'MEDIAZIONE',
    funzioneColore: 'var(--corso-fn-mediare)',
    funzioneDescrizione:
      'Coordinare N2 (attivo, ↑) e N3 (neutro, ~), stabilizzando le condizioni che rendono possibile l\'accesso al mondo condiviso simbolico. Non stabilizzare (il campo non è in collasso), non ampliare (sarebbe prematuro con N4↓), ma mediare la transizione già in corso.',

    campoBersaglio: 'Stabilità e durata dello scambio condiviso simbolico',
    microAzioni: [
      "Il genitore segue l'interesse del bambino senza anticiparlo né dirigerlo",
      "Nomina ciò che il bambino indica, con voce calma e ritmo lento",
      "Attende la risposta del bambino senza riempire il silenzio",
      'Espande senza correggere ("Sì, il cane — e guarda qui...")',
      "Il pediatra osserva senza interrompere la sequenza bambino-genitore",
    ],
    tempoReale: '5 minuti durante il bilancio pediatrico',
    indicatoreRisonanza:
      "Il bambino include l'adulto nella sequenza con sguardo condiviso, gesto e vocalizzazione integrati. La sequenza si allunga: non termina al primo giro.",

    tipoUniversale: ['U2', 'U4'] as const,
    tipoUniversaleNome: 'Sintonizzazione (U2) + Mediazione Simbolica (U4)',

    outputTipo: {
      A: "Il bambino orienta il libro verso l'adulto: il mondo appare condiviso ma discontinuo. L'alternanza di sguardo è presente; la sequenza di scambio si interrompe e non sempre riprende autonomamente.",
      B: "Emergenza di posizione riconoscibile: il bambino indica, vocalizza, cerca la risposta dell'adulto. La permanenza nel legame è presente ma non ancora stabile — dipende dalla qualità della risposta adulta.",
      C: 'Limite tollerato: la condivisione si interrompe e può riprendere. Non collassa. La "fine" della sequenza non produce disorganizzazione.',
      D: 'In questa situazione il campo appare strutturato prevalentemente come accesso intermittente al mondo condiviso simbolico, con campo relazionale attivo come sostegno e apertura esplorativa ridotta.',
      E: 'Rafforzare la stabilità del campo condiviso sostenendo la sequenza del bambino senza anticiparne i gesti. Non ampliare (rischio di sovraccarico), non correggere, ma rendere lo scambio più duraturo.',
    },
  },

  guardrail: {
    code: 'C-F3',
    label: 'Vincolo metodologico — Fase 3',
    text: "Lo strumento F3 non corregge il bambino: modifica il campo relazionale di esperienza. Se un dispositivo ha senso solo riferito al bambino separato dal campo, è metodologicamente scorretto.",
  },
} as const;

// Mappa dei moduli del corso F3 (per chip di percorso, sidebar ecc.).
export const PIANO_CORSO_F3 = [
  { id: 'm00', titolo: 'Orientamento F3', slide: 5, colore: '#2d9cdb' },
  { id: 'm01', titolo: 'Il principio del campo', slide: 6, colore: '#1e8bc3' },
  { id: 'm02', titolo: 'Dalla CE allo strumento', slide: 7, colore: '#0e8f7f' },
  { id: 'm03', titolo: 'Il nodo dominante', slide: 6, colore: '#e67e22' },
  { id: 'm04', titolo: 'Le quattro funzioni', slide: 7, colore: '#3498db' },
  { id: 'm05', titolo: 'Il micro-dispositivo', slide: 8, colore: '#2d6a4f' },
  { id: 'm06', titolo: 'La tipologia U1–U6', slide: 8, colore: '#16a085' },
  { id: 'm07', titolo: 'Logica decisionale', slide: 7, colore: '#c0392b' },
  { id: 'm08', titolo: 'Pipeline F3 completa', slide: 7, colore: '#1a6b8a' },
] as const;
