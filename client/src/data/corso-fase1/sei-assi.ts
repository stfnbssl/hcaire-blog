// Sorgente master dei sei assi strutturali — usata da M02 e dai moduli M03-M07.
// In F1 (corso "Fondazione ontologica") gli assi sono dimensioni interpretative,
// non variabili da misurare.

export interface AsseStrutturale {
  id: string;          // 'a1' … 'a6'
  numero: number;      // 1 … 6
  nome: string;
  nomeBreve: string;
  colore: string;
  sfondo: string;
  domandaGuida: string;
  funzioneStrutturale: string;
  /** Id degli assi che questo presuppone come condizione strutturale. */
  dipendenze: string[];
  contestoClinico: string;
  contestoPedagogico: string;
  contestoGenitoriale: string;
  /** Lettura mono-registro tipica da cui l'asse aiuta a tenersi a distanza. */
  letturaMonoRegistro: string;
  guardrail: string;
}

export const SEI_ASSI: AsseStrutturale[] = [
  {
    id: 'a1',
    numero: 1,
    nome: 'Ontologico-fenomenologico',
    nomeBreve: "Abitare l'esperienza",
    colore: '#6c63ff',
    sfondo: '#f0eeff',
    domandaGuida:
      "In che modo il bambino abita l'esperienza che sta vivendo?",
    funzioneStrutturale:
      "Chiarisce che tipo di soggetto è il bambino: incarnato, temporale, relazionale. Stabilisce il principio per cui ogni asse successivo è possibile. Ha funzione fondativa: tutti gli altri assi lo presuppongono. Senza Asse 1, il bambino sarebbe un organismo che processa stimoli — non un soggetto che abita l'esperienza.",
    dipendenze: [],
    contestoClinico:
      "Come si organizza l'esperienza del bambino durante la visita? Il campo regge?",
    contestoPedagogico:
      "Il bambino abita l'ambiente del nido o lo subisce?",
    contestoGenitoriale:
      "Il genitore sente il bambino come soggetto della propria esperienza?",
    letturaMonoRegistro:
      "Una difficoltà di organizzazione dell'esperienza viene letta come specifico deficit funzionale, lasciando in ombra il piano dell'abitare il campo.",
    guardrail:
      "Nessun output derivato da Asse 1 può descrivere il bambino separato dal campo in cui abita l'esperienza.",
  },
  {
    id: 'a2',
    numero: 2,
    nome: 'Affettivo-morale',
    nomeBreve: "Riconoscimento dell'alterità",
    colore: '#2d6a4f',
    sfondo: '#d8f3dc',
    domandaGuida:
      "Come riconosce il bambino l'altro come portatore di un'esperienza propria?",
    funzioneStrutturale:
      "Introduce progressivamente la dimensione dell'alterità come istanza interna. Il riconoscimento dell'altro come portatore di un'esperienza propria — non sovrapponibile alla propria — è la condizione per qualsiasi relazione non fusionale. Presuppone Asse 1: solo un soggetto incarnato può riconoscere un altro soggetto incarnato.",
    dipendenze: ['a1'],
    contestoClinico:
      "Il bambino cerca l'adulto come altro soggetto o lo usa come strumento?",
    contestoPedagogico:
      "L'educatore è percepito come portatore di un'esperienza propria o come funzione?",
    contestoGenitoriale:
      "Il genitore riconosce nel bambino un soggetto con la propria esperienza?",
    letturaMonoRegistro:
      "Il riconoscimento dell'altro viene letto principalmente come empatia, lettura delle emozioni o compliance sociale; il piano strutturale dell'alterità resta sullo sfondo.",
    guardrail:
      "Nessun output derivato da Asse 2 può descrivere la relazione in termini di «stimolo-risposta» tra soggetti o come semplice coordinazione di comportamenti.",
  },
  {
    id: 'a3',
    numero: 3,
    nome: 'Normativo-educativo',
    nomeBreve: 'Normatività emergente',
    colore: '#27ae60',
    sfondo: '#eafaf1',
    domandaGuida:
      "Come emerge la capacità di orientare l'azione secondo criteri condivisi?",
    funzioneStrutturale:
      "Introduce la possibilità del giudizio e della responsabilità. Non la norma imposta dall'esterno, ma l'emergenza interna della capacità di orientare l'azione secondo criteri condivisi. Presuppone Asse 2: non si orienta l'azione secondo criteri condivisi senza aver prima riconosciuto l'altro come portatore di esperienza propria.",
    dipendenze: ['a1', 'a2'],
    contestoClinico:
      "Il bambino partecipa a strutture di scambio con criteri impliciti condivisi?",
    contestoPedagogico:
      "Le regole del gruppo sono normatività condivisa o imposizione esterna?",
    contestoGenitoriale:
      "Il bambino percepisce i limiti come criteri relazionali o come arbitrio?",
    letturaMonoRegistro:
      "La normatività emergente viene letta come obbedienza, compliance o rispetto di regole imposte; resta in ombra l'aspetto di criterio interno condiviso.",
    guardrail:
      "Nessun output derivato da Asse 3 può contenere giudizi di valore sul rispetto o mancato rispetto di norme da parte del bambino.",
  },
  {
    id: 'a4',
    numero: 4,
    nome: 'Separazione e limite reale',
    nomeBreve: 'Incontro con il reale',
    colore: '#c0392b',
    sfondo: '#fdecea',
    domandaGuida:
      'Come incontra il bambino la resistenza del reale?',
    funzioneStrutturale:
      "Introduce una discontinuità strutturale: il reale come eccedenza che interrompe ogni fantasia di regolazione totale. L'incontro con il limite non è un fallimento dello sviluppo, ma una condizione del suo proseguimento. Presuppone gli assi precedenti: senza Asse 1-2-3, il limite non può essere incontrato come strutturante — diventa solo interruzione.",
    dipendenze: ['a1', 'a2', 'a3'],
    contestoClinico:
      'Il bambino incontra il limite della visita come strutturante o come distruttivo?',
    contestoPedagogico:
      "Il confine del gruppo organizza o schiaccia l'esperienza del bambino?",
    contestoGenitoriale:
      'Il «no» del genitore genera apprendimento o ritiro dalla relazione?',
    letturaMonoRegistro:
      "L'incontro con il limite viene letto come indicatore di difficoltà di regolazione emotiva o di bassa tolleranza alla frustrazione, lasciando in ombra la sua funzione strutturante.",
    guardrail:
      "Nessun output derivato da Asse 4 può moralizzare il comportamento del bambino davanti al limite («fa i capricci», «è testardo»).",
  },
  {
    id: 'a5',
    numero: 5,
    nome: 'Desiderio',
    nomeBreve: "Direzione dell'esperienza",
    colore: '#e67e22',
    sfondo: '#fef3e2',
    domandaGuida:
      "Come si orienta il bambino verso possibilità che eccedono il presente?",
    funzioneStrutturale:
      "Riorganizza l'orientamento del soggetto dopo l'incontro con il limite. Il desiderio non è carenza ma direzione: la capacità del bambino di proiettarsi verso un mondo che eccede la situazione presente. Dipende da Asse 4: solo un soggetto che ha incontrato la resistenza del reale può sviluppare una direzione propria che non sia mera reazione.",
    dipendenze: ['a1', 'a4'],
    contestoClinico:
      "Il bambino mostra iniziativa spontanea? C'è una direzione nell'azione?",
    contestoPedagogico:
      "Il bambino ha interessi propri o è orientato solo da ciò che l'adulto propone?",
    contestoGenitoriale:
      "Il genitore riconosce la direzione del bambino o la legge come capriccio?",
    letturaMonoRegistro:
      "Il desiderio viene letto come preferenza, motivazione estrinseca o interesse per uno stimolo specifico; la direzione strutturale dell'esperienza non viene tematizzata.",
    guardrail:
      "Nessun output derivato da Asse 5 può descrivere l'iniziativa del bambino come semplice preferenza («gli piace», «vuole») senza leggere la direzione strutturale dell'esperienza.",
  },
  {
    id: 'a6',
    numero: 6,
    nome: 'Rapporto con il mondo storico-culturale',
    nomeBreve: 'Partecipazione al mondo condiviso',
    colore: '#d35400',
    sfondo: '#fef0e7',
    domandaGuida:
      'Come entra il bambino nella partecipazione al mondo condiviso?',
    funzioneStrutturale:
      "Non fonda nuove strutture, ma traduce e mette alla prova tutte le precedenti nel mondo concreto — linguaggi, istituzioni, pratiche, oggetti culturali. È il livello in cui lo sviluppo diventa partecipazione al mondo condiviso. Presuppone tutti gli altri assi: senza di essi, la partecipazione è esecuzione, non co-costruzione.",
    dipendenze: ['a1', 'a2', 'a3', 'a4', 'a5'],
    contestoClinico:
      'Il bambino usa gli oggetti culturali come mediatori di mondo condiviso?',
    contestoPedagogico:
      "L'apprendimento è partecipazione al mondo comune o esecuzione di compiti?",
    contestoGenitoriale:
      'Il bambino entra nella cultura della famiglia o vi viene solo esposto?',
    letturaMonoRegistro:
      "La partecipazione al mondo culturale viene letta come competenze linguistiche, riconoscimento di simboli o performance cognitive; il piano della co-costruzione resta sullo sfondo.",
    guardrail:
      "Nessun output derivato da Asse 6 può descrivere la partecipazione al mondo condiviso esclusivamente come prestazione misurabile (vocabolario, riconoscimento, denominazione).",
  },
];

export const SEI_ASSI_BY_ID: Record<string, AsseStrutturale> = SEI_ASSI.reduce(
  (acc, a) => {
    acc[a.id] = a;
    return acc;
  },
  {} as Record<string, AsseStrutturale>,
);
