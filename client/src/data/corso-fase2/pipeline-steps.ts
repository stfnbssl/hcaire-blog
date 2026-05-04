import { PipelineStep } from './types';

// Dati canonici dei nove step della pipeline di traducibilità.
// Sono usati sia da `PipelineAnimator` (rendering) sia dalle slide del
// Modulo 2 (sorgente di verità per glossario e caso-guida).
export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'f1',
    label: 'F1 — Fondazione ontologica',
    sublabel: 'Assi strutturali + tesi + criteri',
    type: 'foundation',
    color: '#6c63ff',
    control: null,
    glossario: null,
    casoGuida:
      'Il bambino è un soggetto incarnato, relazionale, temporale. Il libro non è un oggetto di prestazione: è un mediatore di mondo.',
  },
  {
    id: 'op1',
    label: '① Campo di lavoro',
    sublabel: 'Contesto reale / dispositivo / popolazione',
    type: 'operator',
    color: '#2d6a4f',
    control: {
      code: 'C0',
      label: 'Vincolo di contesto',
      domanda: 'Cosa è osservabile? Cosa è decidibile?',
    },
    glossario:
      'Definisce oggetto reale, vincoli, tempi, attori. Delimita cosa si può osservare e cosa non è direttamente accessibile.',
    casoGuida:
      'Bilancio pediatrico · bambino 18-24 mesi · genitore presente · libro illustrato · 3-5 minuti. Osservabili: corpo, sguardo, gesto, vocalizzazione. Non osservabili: motivazione interna, competenza stabile.',
  },
  {
    id: 'op2',
    label: '② Concetto-ponte',
    sublabel: 'Linguaggio del progetto ↔ linguaggio disciplinare',
    type: 'operator',
    color: '#2d6a4f',
    control: {
      code: 'C1',
      label: 'Non-riduzionismo',
      domanda:
        'Mantiene la funzione strutturale? È osservabile senza ridursi a variabile?',
    },
    glossario:
      "Rende compatibili linguaggi disciplinari mantenendo l'ampiezza del concetto originario. Non è una semplificazione: è una traduzione che conserva la struttura. Il termine «non-riduzionismo» è qui un tecnicismo metodologico — riguarda la condizione del concetto-ponte (non deve coincidere con una singola variabile disciplinare) e non costituisce un giudizio sulle discipline, ognuna delle quali opera legittimamente la propria focalizzazione.",
    casoGuida:
      'Concetto-ponte: "Accesso al mondo condiviso". Non "attenzione condivisa" (troppo specifico) né "sviluppo simbolico" (troppo astratto). Mantiene insieme corpo, gesto, relazione e significato.',
  },
  {
    id: 'op3',
    label: '③ Nodo trasversale',
    sublabel: 'Formulazione strutturale multi-asse',
    type: 'operator',
    color: '#2d6a4f',
    control: {
      code: 'C2',
      label: 'Attraversamento',
      domanda: 'Collega più assi? Integra corpo, relazione e senso?',
    },
    glossario:
      'È il "motore" strutturale che attraversa assi e discipline. Non è un caso clinico, non è una variabile. È la configurazione teorica che rende intelligibili le dinamiche trasformative.',
    casoGuida:
      'Nodo attivo: N3 — Accesso al mondo condiviso simbolico (Assi 1, 2, 5, 6). Nodo di supporto: N2 — Campo relazionale / Co-regolazione (Assi 1, 2, 3).',
  },
  {
    id: 'op4',
    label: '④ Domande professionali',
    sublabel: 'Interrogabili in contesti reali · non diagnostiche',
    type: 'operator',
    color: '#2d6a4f',
    control: {
      code: 'C3',
      label: 'Non-diagnostico',
      domanda: 'Leggibilità senza classificazione o prescrizione?',
    },
    glossario:
      'Trasformano il Nodo in interrogazioni usabili da pediatra, educatore, genitore. Devono essere osservabili, condivisibili tra discipline, prive di giudizio.',
    casoGuida:
      "• Il bambino usa l'oggetto come occasione di scambio con l'adulto?\n• C'è alternanza di sguardo tra libro e adulto?\n• Il gesto apre una relazione o rimane azione solitaria?",
  },
  {
    id: 'op5',
    label: '⑤ Operatore di lettura',
    sublabel: 'Dati osservativi → configurazione di sviluppo',
    type: 'operator',
    color: '#2d6a4f',
    control: {
      code: 'C4',
      label: 'Separazione',
      domanda: 'Descrive configurazioni senza imporre decisioni?',
    },
    glossario:
      'La struttura mentale attraverso cui il professionista organizza ciò che vede. Non è una griglia. È la forma applicativa del Nodo. Tre domande simultanee: Campo condiviso / Posizione soggettiva / Rapporto con il limite.',
    casoGuida:
      "Campo: adulto e bambino si orientano verso un oggetto comune con gesto, sguardo, parola. Posizione: il bambino indica e mostra — c'è iniziativa soggettiva. Limite: il bambino accetta di condividere il controllo del libro.",
  },
  {
    id: 'op6',
    label: '⑥ Famiglie di output',
    sublabel: 'Osservativi / Formativi / Accompagnamento / Ricerca',
    type: 'operator',
    color: '#2d6a4f',
    control: {
      code: 'C5',
      label: 'Scalabilità',
      domanda: 'Più destinatari, stessa grammatica?',
    },
    glossario:
      'Classi di prodotti possibili senza costruire ancora strumenti specifici. Ogni famiglia ha destinatari, funzione e forma diversi — ma tutti derivano dalla stessa configurazione evolutiva.',
    casoGuida:
      'Osservativo: scheda di lettura per il pediatra. Formativo: modulo per educatori su lettura condivisa. Accompagnamento: restituzione ai genitori. Ricerca: protocollo longitudinale.',
  },
  {
    id: 'op7',
    label: '⑦ Output-tipo vuoto',
    sublabel: 'Template riusabile · prova di completezza',
    type: 'operator',
    color: '#2d6a4f',
    control: {
      code: 'C6',
      label: 'Completezza',
      domanda: 'Template riusabile? Campi minimi? Linguaggio neutro?',
    },
    glossario:
      "Struttura compilabile che deriva dall'operatore di lettura ma non è ancora uno strumento. Non contiene indicatori prefissati, criteri valutativi, prescrizioni. Serve a verificare che la catena regge prima di costruire lo strumento reale.",
    casoGuida:
      'Template: "Lettura di una situazione di mondo condiviso". Sezioni: campo osservato · domande triadiche · configurazione risultante · note per F3. Nessuna età, tecnica o giudizio.',
  },
  {
    id: 'f3',
    label: 'F3 — Strumento contestualizzato',
    sublabel: 'Workflow e artefatti · responsabilità disciplinare esplicita',
    type: 'output',
    color: '#2d9cdb',
    control: {
      code: 'C7',
      label: 'Responsabilità',
      domanda: 'La decisione clinica/educativa è fuori dal metodo?',
    },
    glossario: null,
    casoGuida:
      'In ambulatorio: protocollo osservativo per bilancio 18 mesi. In educazione: griglia per l\'educatrice al nido. Per i genitori: scheda narrativa di restituzione. La decisione su cosa fare spetta alla disciplina, non al metodo.',
  },
];

// Mappa di accesso rapido per id.
export const PIPELINE_STEPS_BY_ID: Record<string, PipelineStep> =
  PIPELINE_STEPS.reduce(
    (acc, s) => {
      acc[s.id] = s;
      return acc;
    },
    {} as Record<string, PipelineStep>,
  );
