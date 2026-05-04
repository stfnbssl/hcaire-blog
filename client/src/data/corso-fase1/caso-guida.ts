// Caso-guida del corso Fase 1 — la stessa scena di F2, estesa con
// letture per asse e annotazioni puntuali per il componente AnnotatedScene.

import type { AnnotatedSceneAnnotation, GuardrailControl } from './types';

export interface LetturaPerAsse {
  asse: string;
  colore: string;
  domanda: string;
  lettura: string;
  notaParziale: string;
}

export interface ChipDescrittore {
  label: string;
  color: string;
}

export const CASO_GUIDA_F1 = {
  titolo: 'Lettura condivisa adulto-bambino',

  scena:
    "Durante un bilancio di salute, il pediatra propone per alcuni minuti " +
    "una breve situazione di lettura condivisa. Il bambino ha circa 18-24 mesi. " +
    "È presente un genitore. Sul tavolo c'è un piccolo libro illustrato con " +
    "immagini semplici: animali, oggetti familiari, figure umane. Il bambino " +
    "prende il libro, lo apre, guarda alcune immagini, indica una figura, " +
    "vocalizza qualcosa e guarda l'adulto. Il genitore nomina l'immagine, " +
    "sorride, aspetta. Il bambino torna a guardare il libro, gira pagina, " +
    "poi mostra un'altra figura all'adulto.",

  letture_per_asse: {
    a1: {
      asse: 'Asse 1 — Ontologico-fenomenologico',
      colore: '#6c63ff',
      domanda: 'Come abita il bambino questa esperienza?',
      lettura:
        "Il corpo del bambino organizza l'esperienza prima di qualsiasi atto " +
        "intenzionale esplicito: la postura orientata verso il libro, il ritmo " +
        "dell'alternanza sguardo-gesto, la continuità della sequenza nonostante " +
        "le pause — sono il modo in cui il bambino è presente in quel campo, " +
        "non comportamenti che produce.",
      notaParziale:
        "Lettura mono-registro: «il bambino presta attenzione al libro». " +
        "Resta sul piano della funzione attentiva, lasciando in ombra il modo " +
        "in cui il bambino abita il campo.",
    } as LetturaPerAsse,
    a2: {
      asse: 'Asse 2 — Affettivo-morale',
      colore: '#2d6a4f',
      domanda: "Come riconosce il bambino l'adulto come portatore di esperienza propria?",
      lettura:
        "Quando il bambino indica una figura e guarda l'adulto, non sta " +
        "cercando conferma di una prestazione: sta cercando un altro soggetto " +
        "che abbia un'esperienza propria della stessa immagine. Il «guarda " +
        "l'adulto» è un atto di riconoscimento dell'alterità, non un controllo " +
        "sociale.",
      notaParziale:
        "Lettura mono-registro: «il bambino cerca approvazione». Il " +
        "riconoscimento dell'alterità viene letto come bisogno di conferma.",
    } as LetturaPerAsse,
    a3: {
      asse: 'Asse 3 — Normativo-educativo',
      colore: '#27ae60',
      domanda: "Come emerge la capacità di orientare l'azione secondo criteri condivisi?",
      lettura:
        "L'alternanza dei turni — il bambino indica, l'adulto risponde, il " +
        "bambino riprende — non è obbedienza a una regola esterna: è l'emergenza " +
        "interna di una normativa condivisa dello scambio. Il bambino «aspetta» " +
        "la risposta adulta perché partecipa a una forma di scambio che ha già " +
        "interni i propri criteri.",
      notaParziale:
        "Lettura mono-registro: «segue le regole del gioco». La normatività " +
        "emergente viene letta come conformità a regole imposte dall'esterno.",
    } as LetturaPerAsse,
    a4: {
      asse: 'Asse 4 — Separazione e limite reale',
      colore: '#c0392b',
      domanda: "Come incontra il bambino la resistenza del reale?",
      lettura:
        "Il libro ha pagine finite, immagini che non si muovono, una sequenza " +
        "che non è controllabile completamente dal bambino. Il bambino incontra " +
        "il limite dell'oggetto — e lo abita: gira pagina, sceglie, torna. Il " +
        "limite non disorganizza il campo: lo struttura.",
      notaParziale:
        "In questa scena il limite non si manifesta come ostacolo: questo è già " +
        "un dato. Una scena in cui il limite emerge e collassa è diversa da " +
        "una in cui il limite struttura il campo.",
    } as LetturaPerAsse,
    a5: {
      asse: 'Asse 5 — Desiderio',
      colore: '#e67e22',
      domanda: "Come si orienta il bambino verso possibilità che eccedono il presente?",
      lettura:
        "Il mostrare una nuova figura all'adulto non è ripetizione: è apertura " +
        "verso una nuova possibilità di scambio. Il bambino non è saturo: ha " +
        "una direzione, un'iniziativa, un orientamento che eccede la situazione " +
        "presente. Il desiderio si vede nella sequenza — non in un singolo atto.",
      notaParziale:
        "Lettura mono-registro: «il bambino è interessato al libro». La " +
        "direzione dell'esperienza viene letta come preferenza per uno stimolo.",
    } as LetturaPerAsse,
    a6: {
      asse: 'Asse 6 — Rapporto con il mondo storico-culturale',
      colore: '#d35400',
      domanda: "Come entra il bambino nella partecipazione al mondo condiviso?",
      lettura:
        "Il libro illustrato non è uno stimolo visivo o un task cognitivo: è " +
        "un oggetto storico-culturale che porta con sé pratiche, convenzioni, " +
        "storie condivise. Il bambino non sta guardando immagini — sta entrando " +
        "in un modo di stare con l'adulto che ha la forma della cultura: indicare, " +
        "nominare, condividere significati.",
      notaParziale:
        "Lettura mono-registro: «il bambino riconosce le immagini». La " +
        "partecipazione culturale viene letta come capacità di riconoscimento " +
        "percettivo.",
    } as LetturaPerAsse,
  },

  /** Annotazioni puntuali per il componente AnnotatedScene (slide 1.6). */
  annotazioni: [
    {
      id: 'a1',
      estratto: 'Il bambino prende il libro',
      label: 'Incarnato',
      colore: '#5c35a0',
      annotazione:
        "Il prendere non è l'esecuzione di un compito motorio: è il modo " +
        "incarnato in cui il bambino si orienta verso l'oggetto. Il corpo " +
        "organizza l'intenzione prima che ci sia un'intenzione esplicita.",
      asse: 'Asse 1 — Ontologico-fenomenologico',
    },
    {
      id: 'a2',
      estratto: "indica una figura, vocalizza qualcosa e guarda l'adulto",
      label: 'Relazionale',
      colore: '#1a6b8a',
      annotazione:
        "L'azione si completa solo nel campo: indicare, vocalizzare e guardare " +
        "l'adulto non sono tre comportamenti separati — sono un unico atto " +
        "relazionale che ha senso solo se c'è un campo disponibile a riceverlo.",
      asse: 'Relazionale — il campo come condizione',
    },
    {
      id: 'a3',
      estratto: "Il genitore nomina l'immagine, sorride, aspetta",
      label: 'Campo come condizione',
      colore: '#2d6a4f',
      annotazione:
        "Il «aspetta» del genitore non è passività: è la forma in cui il campo " +
        "si rende disponibile a ricevere l'iniziativa del bambino. Senza questa " +
        "disponibilità strutturale, il gesto del bambino cambia significato.",
      asse: "Asse 2 — Riconoscimento dell'alterità",
    },
    {
      id: 'a4',
      estratto: 'Il bambino torna a guardare il libro, gira pagina',
      label: 'Temporale',
      colore: '#d35400',
      annotazione:
        "La sequenza ha continuità: dopo la risposta dell'adulto, il bambino " +
        "prosegue la traiettoria — non ricomincia da zero. Il tornare al libro " +
        "è il filo temporale dell'esperienza che si mantiene attraverso " +
        "l'interruzione dello scambio.",
      asse: 'Temporale — traiettoria aperta',
    },
    {
      id: 'a5',
      estratto: "poi mostra un'altra figura all'adulto",
      label: 'Direzione',
      colore: '#e67e22',
      annotazione:
        "Il mostrare una nuova figura non è ripetizione: è la direzione della " +
        "traiettoria che si apre. Il bambino ha un orientamento che eccede la " +
        "situazione presente — e lo porta verso il campo condiviso.",
      asse: 'Asse 5 — Desiderio come direzione',
    },
  ] as AnnotatedSceneAnnotation[],

  lettura_parziale:
    "«Il bambino di 20 mesi mostra competenze linguistiche nella norma: " +
    "indica, vocalizza, usa il gesto di pointing. Attenzione sostenuta " +
    "adeguata all'età. Il genitore stimola adeguatamente.»",

  lettura_ontologica:
    "«Il campo relazionale è disponibile alla risposta: bambino e adulto " +
    "costruiscono uno scambio attorno a un oggetto comune. Il bambino apre " +
    "l'interazione e l'adulto la sostiene senza dirigerla. La configurazione " +
    "è evolutivamente aperta.»",

  chip_parziali: [
    { label: 'prestazionale', color: '#e74c3c' },
    { label: 'normativa', color: '#e67e22' },
    { label: 'individua il bambino come unità', color: '#c0392b' },
  ] as ChipDescrittore[],

  chip_ontologici: [
    { label: 'configurazionale', color: '#6c63ff' },
    { label: 'relazionale', color: '#2d6a4f' },
    { label: 'descrive il campo', color: '#27ae60' },
  ] as ChipDescrittore[],

  guardrail: {
    code: 'G-F1',
    label: 'Guardrail fondativo — Fase 1',
    text:
      "Ogni output derivato da questo framework deve poter essere usato senza " +
      "descrivere il bambino come individuo isolato dal campo. Se una " +
      "descrizione ha senso solo riferita al bambino separato dal campo, " +
      "non è coerente con i fondamenti del progetto.",
  } as GuardrailControl,
};
