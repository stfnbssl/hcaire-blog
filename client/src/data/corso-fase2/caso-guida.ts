// Caso-guida del corso (filo rosso). Lo stesso oggetto deve essere usato
// da tutti i moduli che fanno riferimento alla scena della lettura
// condivisa adulto-bambino. Mantiene parità con `window.CASO_GUIDA` della
// sorgente standalone HTML/JS.

export const CASO_GUIDA = {
  titolo: 'Lettura condivisa adulto-bambino',
  scena: `Durante un bilancio di salute, il pediatra propone per alcuni minuti una breve situazione di lettura condivisa. Il bambino ha circa 18-24 mesi. È presente un genitore. Sul tavolo c'è un piccolo libro illustrato con immagini semplici: animali, oggetti familiari, figure umane.

Il bambino prende il libro, lo apre, guarda alcune immagini, indica una figura, vocalizza qualcosa e guarda l'adulto. Il genitore nomina l'immagine, sorride, aspetta. Il bambino torna a guardare il libro, gira pagina, poi mostra un'altra figura all'adulto.`,
  pipeline: {
    campo:
      'Bilancio pediatrico, bambino 18-24 mesi, genitore, libro illustrato, 3-5 min.',
    concettoPonte: 'Accesso al mondo condiviso',
    nodo: 'N3 — Accesso al mondo condiviso simbolico',
    domandeProf: [
      "Il bambino usa l'oggetto come occasione di scambio con l'adulto?",
      "C'è alternanza di sguardo tra libro e adulto?",
      'Il gesto apre una relazione o rimane azione solitaria?',
    ],
    operatoreTriadico: {
      campo:
        "Il bambino e l'adulto si orientano verso qualcosa di comune (il libro), con gesto, sguardo e parola che si intrecciano.",
      posizione:
        "Il bambino indica, mostra, vocalizza: c'è iniziativa soggettiva e non solo reazione all'adulto.",
      limite:
        "Il bambino accetta di condividere il controllo del libro con l'adulto; la sequenza si interrompe e riprende.",
    },
    ce: {
      S: { N1: '~', N2: '↑', N3: '~', N4: '↓', N5: '~', N6: '~', N7: '~' },
      R: 'N2→N3 (MED)',
      D: '↗',
      T: 'T2',
      A: 'A±',
    },
    ceNaturale:
      'Campo relazionale forte che sostiene accesso al mondo condiviso, con esplorazione ridotta ma in espansione. Configurazione fragile ma evolutivamente aperta.',
  },
} as const;
