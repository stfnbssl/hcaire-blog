# Avviare una nuova ricerca

---

## Cosa stai per fare

Stai avviando una **ricerca strutturale tematica**: un processo guidato che esplora la letteratura scientifica e istituzionale per individuare fenomeni osservabili dello sviluppo del bambino degni di analisi approfondita.

Il sistema leggerà le fonti, selezionerà temi candidati, ne valuterà la rilevanza strutturale e produrrà un documento di lavoro che potrai revisionare prima di procedere alle fasi successive.

Non stai scegliendo un tema adesso — stai avviando un processo di esplorazione. Il risultato sarà una mappa di temi candidati, non una risposta definitiva.

---

## ID della ricerca

L'**ID ricerca** è un identificatore breve che userai per ritrovare tutti i documenti prodotti in questa ricerca: file di output, micro-matrici, dispositivi.

**Come sceglierlo:**

- usa lettere minuscole e trattini (es. `lettura-condivisa-0-3`, `sguardo-congiunto-digitale`, `pointing-clinico-2026`)
- deve essere descrittivo ma non troppo lungo (3–6 parole)
- deve essere unico: non usare un ID già usato in ricerche precedenti
- evita nomi generici come `ricerca-1` o `test`: ti renderanno difficile orientarti tra i file in futuro

---

## Note di indirizzo (opzionale)

Le **note di indirizzo** sono un testo libero che puoi scrivere per orientare il lavoro dell'agente. Non sono obbligatorie, ma se le scrivi bene rendono la ricerca molto più mirata.

### A cosa servono

L'agente di ricerca esplora autonomamente le fonti e valuta i temi secondo criteri strutturali fissi. Le note non cambiano questi criteri — cambiano il *fuoco*: su cosa concentrarsi, cosa privilegiare, cosa escludere.

Le note ti permettono di:

- **focalizzare un contesto** — se il tuo interesse è specificamente il setting clinico, o la fascia 0–3, o i contesti educativi informali, dillo. L'agente darà più peso ai temi rilevanti per quel contesto.
- **indicare aree di interesse prioritario** — se vuoi esplorare soprattutto il corpo, il gesto, la ritualità, dillo. L'agente orienterà la selezione in quella direzione.
- **escludere domini** — se una certa area (es. uso dei dispositivi digitali, o temi già ampiamente trattati in ricerche precedenti) non ti interessa in questo ciclo, puoi escluderla esplicitamente.
- **segnalare un fenomeno specifico** — se hai già un'idea di dove vuoi arrivare (es. "sono interessato a qualcosa che riguarda la richiesta di aiuto"), puoi indicarlo come punto di partenza, non come vincolo definitivo.

### Cosa le note non possono fare

- **Non sostituiscono la valutazione strutturale.** Se l'agente trova che un tema è debole strutturalmente, lo segnala anche se corrisponde a una tua preferenza. Le note orientano, non decidono.
- **Non devono essere troppo prescrittive.** Scrivere "trova il tema X" trasforma la ricerca in una conferma di ciò che sai già. Il valore della pipeline è nell'esplorazione sistematica, non nella validazione di scelte già fatte.
- **Non devono sostituire il tuo giudizio finale.** L'output della ricerca è sempre sottoposto alla tua revisione prima di procedere allo step successivo.

---

## Esempi

### Note efficaci

> *"Privilegiare temi osservabili in episodi interattivi brevi e circoscritti, in contesti clinici 0–3. Sono particolarmente interessato a fenomeni che riguardano la regolazione corporea nella diade. Escludere temi legati all'uso di dispositivi digitali."*

Questa nota è utile perché: indica un contesto specifico (clinico 0–3), un livello di analisi (episodi brevi), un'area di interesse (regolazione corporea), un'esclusione esplicita (digitale).

> *"Sono interessato a temi che si collocano alla soglia tra Asse 1 (corporeo-esperienziale) e Asse 6 (simbolico-culturale). In questa ricerca voglio esplorare in particolare fenomeni di transizione dal corporeo al simbolico."*

Questa nota è utile perché: usa il linguaggio del modello per orientare la struttura, indica una zona di interesse precisa, lascia all'agente la scelta del tema specifico.

> *"Evitare temi già affrontati nelle ricerche 'richiesta-aiuto-2025' e 'pointing-precoce-2025'. Privilegiare temi nuovi per il progetto, con potenziale per lo sviluppo di dispositivi nel dominio educativo."*

Questa nota è utile perché: indica esclusioni contestualizzate (non generiche), aggiunge un'indicazione di destinazione applicativa senza essere prescrittiva.

---

### Note poco efficaci

> *"Fammi una ricerca sul pointing."*

Questa nota è problematica perché: presuppone già la risposta, trasforma la ricerca in una conferma. Se vuoi esplorare il pointing, usa la nota precedente (indicare un fenomeno come *punto di partenza*, non come vincolo definitivo).

> *"Trova i temi più importanti per lo sviluppo del bambino."*

Questa nota è inutile perché: è già l'obiettivo implicito della ricerca. Non aggiunge nessun fuoco, nessun vincolo, nessuna priorità.

> *"Considera tutti gli assi strutturali."*

Questa nota è ridondante perché: è già ciò che l'agente fa per default. Non aggiunge informazione utile.

---

## Cosa succede alle tue note

Le note vengono inserite nel documento di avvio della ricerca (`research_scope.notes`) e influenzano:

1. **la selezione delle fonti da esplorare** — l'agente dà priorità a fonti pertinenti al contesto indicato
2. **la valutazione della rilevanza dei temi** — i temi vengono valutati anche rispetto al fuoco indicato
3. **le note globali dell'output** — l'agente segnala esplicitamente come le tue indicazioni hanno orientato le scelte

Le note **non vengono mai interpretate come vincoli assoluti**: l'agente può segnalare se un tema molto forte emerge al di fuori del fuoco indicato, proponendolo come candidato anche se non corrisponde pienamente alle tue note.

---

## Dopo l'avvio

Una volta confermato l'ID e inviato il prompt, il sistema avvierà la ricerca. Il processo richiede tempo (esplorazione di fonti, valutazione strutturale, produzione dell'output JSON).

Al termine riceverai una notifica. Potrai poi **revisionare i temi candidati** e scegliere quali portare avanti nella fase successiva di analisi strutturale.