---
title: "Ricerca Assistita da AI: il metodo \"Framework & Deep Dive\""
section: "hcaire"
type: "page"
slug: "ricerca-assistita-ai"
parent: "protocolli"
order: 1
version: "2"
excerpt: "Un protocollo strutturato in 5 fasi per condurre ricerche interdisciplinari con LLM, con strumenti di controllo critico integrati."
---

## **Il metodo "Framework & Deep Dive"**

## **1. Introduzione e finalità**

Il presente metodo propone un uso dei modelli linguistici di grandi dimensioni (LLM) non come semplici generatori di testo, né come sostituti del lavoro scientifico o critico del ricercatore, ma come **strumenti di esplorazione assistita, organizzazione concettuale e interrogazione guidata**.

L'assunto di fondo è che, in progetti ad alta densità teorica o interdisciplinare, il problema non consista soltanto nel reperire informazioni, ma nel farlo in modo **coerente con un quadro concettuale esplicito**, distinguendo con chiarezza tra fondamenti teorici, ipotesi interpretative, traduzioni operative e possibili verifiche.

In questa prospettiva, il metodo mira a ottenere cinque risultati principali:

1. **mantenere l'interazione con l'AI entro un perimetro teorico riconoscibile**;
2. **evitare risposte generiche o epistemologicamente incoerenti** rispetto alla logica del progetto;
3. **mappare in modo ordinato i campi disciplinari pertinenti**;
4. **produrre approfondimenti verticali controllabili**, separando i diversi paradigmi di lettura;
5. **preparare una sintesi finale più solida**, utile per la riflessione teorica, la progettazione operativa e l'eventuale successiva verifica empirica.

Il metodo non pretende dunque di delegare all'AI una funzione di validazione scientifica in senso forte. La sua finalità è piuttosto quella di costruire un **ambiente di ricerca assistita** capace di aumentare chiarezza, ordine, comparabilità e potenza esplorativa del lavoro umano.

## **2. Principio generale del metodo**

L'idea di fondo è semplice: un LLM fornisce risultati tanto più utili quanto più viene collocato entro **vincoli di contesto, compiti ben definiti e procedure di controllo progressivo**.

In assenza di tali vincoli, il modello tende a produrre risposte plausibili ma spesso eccessivamente generiche, concilianti o concettualmente ibride. In presenza, invece, di un quadro di riferimento stabile, di una segmentazione per ambiti e di richieste formulate in modo metodico, esso può diventare uno strumento efficace per:

* articolare distinzioni concettuali;
* individuare linee di convergenza e divergenza tra discipline;
* formulare domande migliori;
* esplicitare presupposti impliciti;
* produrre prime bozze di traduzione tra livelli teorici e livelli operativi.

Il metodo "Framework & Deep Dive" si basa dunque su un principio di **esplorazione disciplinata**: prima si definisce il quadro, poi si delimitano gli ambiti, quindi si approfondiscono separatamente i diversi filoni, infine si procede a una sintesi critica.

## **3. Architettura del protocollo**

## **Fase A. Documento di contesto (Anchor Document)**

Il primo elemento del metodo è il caricamento di un **documento-ancora**, cioè di un testo che espliciti il quadro teorico, le finalità del progetto, il lessico principale e i suoi criteri di fondo.

### **Funzione del documento-ancora**

Il documento-ancora non serve a "dimostrare" il progetto, ma a fornire al modello un **filtro di pertinenza**. In questo modo l'AI non mobilita indiscriminatamente la propria conoscenza statistica, ma viene orientata a selezionare, organizzare e produrre contenuti compatibili con l'impostazione dichiarata del lavoro.

### **Vantaggi**

L'uso del documento-ancora consente di:

* ridurre la dispersione tematica;
* contenere il rischio di risposte standardizzate;
* rendere più trasparente il rapporto tra output e presupposti del progetto;
* favorire la coerenza terminologica e concettuale nelle fasi successive.

### **Nota metodologica**

È importante chiarire che il documento-ancora non costituisce una garanzia di verità, ma un **vincolo di orientamento**. Esso aumenta la coerenza interna del percorso, non sostituisce il lavoro critico di verifica.

## **Fase B. Analisi preliminare e mappatura degli ambiti**

Una volta definito il quadro di riferimento, si chiede al modello di individuare i principali campi del sapere che confinano con il progetto o che possono offrire contributi rilevanti alla sua comprensione, articolazione o discussione.

### **Obiettivo**

Lo scopo di questa fase non è validare automaticamente il progetto, ma costruire una **mappa ragionata delle discipline, dei paradigmi e dei linguaggi scientifici o teorici** con cui esso può entrare in relazione.

### **Esito atteso**

Il risultato di questa fase è una lista argomentata di ambiti pertinenti, ad esempio:

* neuroscienze;
* infant research;
* psicologia dello sviluppo;
* teoria dei sistemi dinamici;
* epistemologia della complessità;
* fenomenologia;
* teoria dell'attaccamento;
* pedagogia relazionale;
* antropologia dello sviluppo.

### **Valore della mappatura**

La mappatura ha valore:

* **esplorativo**, perché amplia il campo delle connessioni possibili;
* **ordinativo**, perché distingue i livelli e i registri del discorso;
* **strategico**, perché consente di decidere dove effettuare gli approfondimenti successivi.

Essa non equivale ancora a una validazione, ma costituisce una **prima strutturazione del terreno di ricerca**.

## **Fase C. Generazione di meta-prompt specialistici**

Invece di porre immediatamente domande di approfondimento, il metodo prevede una fase intermedia in cui si chiede al modello di **progettare i prompt più adatti** per interrogare in modo serio uno specifico ambito.

### **Razionale**

Questo passaggio sfrutta una capacità spesso molto utile degli LLM: quella di riformulare una domanda generica in una richiesta più disciplinata, tecnicamente precisa e concettualmente più informata.

### **Vantaggi**

La generazione di meta-prompt permette di:

* introdurre terminologia specialistica pertinente;
* far emergere autori, scuole o concetti che l'utente non aveva ancora esplicitato;
* evitare domande troppo ampie o vaghe;
* costruire richieste già orientate alla distinzione tra teoria, evidenze, limiti e implicazioni.

### **Limite da tenere presente**

Il meta-prompting non garantisce di per sé maggiore verità. Può aumentare la qualità formale dell'interrogazione, ma deve essere sempre sottoposto a controllo umano, perché l'AI tende talvolta a formulare prompt ottimali per la propria fluida performance discorsiva, non necessariamente per il massimo rigore critico.

Per questa ragione, il meta-prompt va considerato come **strumento di raffinazione**, non come certificazione metodologica.

## **Fase D. Esecuzione in chat distinte ("siloing")**

Una delle scelte più importanti del metodo consiste nel dedicare una chat separata a ciascun ambito di approfondimento.

### **Procedura**

Per ogni dominio selezionato si apre una conversazione autonoma, nella quale vengono inseriti:

* il riferimento al framework iniziale;
* il prompt specialistico costruito nella fase precedente;
* eventuali istruzioni sul taglio dell'analisi;
* la richiesta di distinguere con chiarezza autori, concetti, evidenze, limiti e ricadute operative.

### **Funzione del siloing**

Il siloing serve a ridurre:

* la contaminazione tra paradigmi eterogenei;
* la confusione terminologica;
* la tendenza del modello a produrre sintesi premature;
* il rischio che una prospettiva inglobi indebitamente le altre.

Una chat dedicata consente invece di saturare la finestra contestuale con un solo quadro di riferimento, migliorando profondità, coerenza locale e tracciabilità dell'argomentazione.

### **Avvertenza critica**

Il siloing, tuttavia, non va idealizzato. Se da un lato riduce il rumore di fondo, dall'altro può creare **micro-ambienti autoreferenziali**, nei quali ciascun ambito tende a leggere il progetto secondo la propria logica. Per questo motivo il siloing è metodologicamente utile solo se sarà seguito, più avanti, da una fase di confronto inter-silos, in cui le tensioni e le divergenze vengano rese esplicite.

## **Fase E. Approfondimento multi-step**

Ogni approfondimento non dovrebbe essere richiesto in un solo passaggio, ma articolato in più fasi successive.

### **Struttura consigliata**

Un possibile schema è il seguente:

1. **inquadramento del campo**
   * che cosa studia;
   * quali concetti lo caratterizzano;
   * quali autori o correnti sono centrali;
2. **analisi del rapporto con il progetto**
   * convergenze;
   * divergenze;
   * punti di sostegno;
   * possibili attriti;
3. **traduzione operativa o progettuale**
   * quali implicazioni concrete si possono trarre;
   * quali cautele occorrono;
   * quali limiti restano aperti.

### **Perché funziona**

La struttura multi-step permette di:

* evitare risposte troppo compresse;
* controllare ogni segmento dell'analisi;
* correggere la direzione prima che l'elaborazione diventi troppo estesa;
* distinguere meglio il descrittivo dall'interpretativo e dall'operativo.

Essa è particolarmente utile nei contesti in cui il progetto richiede una mediazione tra livelli molto diversi: teorico, clinico, educativo, organizzativo o applicativo.

## **4. Fase trasversale di controllo critico**

Per rendere il protocollo più robusto, è opportuno affiancare alle fasi di esplorazione anche una fase sistematica di controllo critico.

## **4.1. Test del contrasto (Red Teaming)**

In una chat separata si chiede al modello di assumere la prospettiva di un critico teoricamente competente ma non allineato al framework.

### **Esempi**

* analizza il progetto da un punto di vista puramente biomedico;
* evidenzia le obiezioni che potrebbe sollevare un ricercatore sperimentale;
* mostra dove il framework rischia di essere troppo interpretativo;
* individua i punti in cui le traduzioni operative sembrano eccedere le premesse.

### **Funzione**

Il red teaming aiuta a:

* prevenire l'auto-conferma;
* preparare difese teoriche più solide;
* individuare punti deboli, ambiguità o salti logici;
* distinguere ciò che è ben fondato da ciò che è ancora solo promettente.

## **4.2. Audit delle affermazioni**

Dopo ogni approfondimento, è utile chiedere una restituzione tabellare delle principali affermazioni emerse, classificandole secondo il loro statuto.

### **Schema suggerito**

Per ogni affermazione:

* formulazione sintetica;
* natura: descrittiva / interpretativa / speculativa / operativa;
* grado di supporto: forte / medio / debole;
* riferimenti teorici o bibliografici;
* possibili obiezioni;
* eventuale necessità di verifica esterna.

### **Utilità**

Questa fase aiuta a evitare un problema frequente dell'interazione con gli LLM: la fusione, in un unico flusso retorico, di elementi eterogenei per statuto epistemico.

## **4.3. Verifica dei riferimenti e delle attribuzioni**

Quando il modello richiama autori, opere, esperimenti o scuole teoriche, è opportuno chiedere che venga sempre specificato, almeno in modo sintetico, **quale contributo di quell'autore sia pertinente all'affermazione formulata**.

### **Obiettivo**

Non si tratta solo di ottenere citazioni, ma di ridurre:

* confusioni tra autori affini;
* attribuzioni imprecise;
* sintesi troppo libere;
* riferimenti plausibili ma non esatti.

### **Buona pratica**

È utile distinguere sempre tra:

* riferimento verificato;
* riferimento probabile da controllare;
* ricostruzione interpretativa non attribuibile letteralmente.

Questa distinzione aumenta la trasparenza e rende il lavoro più utilizzabile in contesti formali.

## **5. Sintesi inter-silos e integrazione finale**

Una volta completati gli approfondimenti verticali, il metodo prevede una fase finale di integrazione.

### **Obiettivo**

L'obiettivo non è armonizzare artificialmente tutti i risultati, ma costruire una sintesi che:

* raccolga i contributi rilevanti di ciascun ambito;
* metta in luce convergenze e divergenze;
* espliciti i punti di conflitto teorico;
* distingua con chiarezza i livelli del discorso.

### **Materiali di input**

Per ogni silo è consigliabile raccogliere:

* le definizioni chiave;
* gli autori principali;
* le tesi che sostengono il progetto;
* le tesi che lo problematizzano;
* le implicazioni operative;
* i limiti o le verifiche ancora necessarie.

### **Esito atteso**

La sintesi finale dovrebbe produrre un documento capace di restituire:

1. la struttura generale del quadro;
2. le discipline rilevanti e il loro contributo;
3. i nodi critici emersi;
4. le ipotesi operative plausibili;
5. le questioni che richiedono ulteriore verifica teorica o empirica.

La sintesi, in altri termini, non è la semplice somma dei silos, ma il luogo in cui il progetto acquista una forma più matura, più controllata e più comunicabile.

## **6. Distinzione dei livelli epistemici**

Per evitare equivoci, il protocollo richiede di distinguere sempre almeno quattro livelli:

### **1. Coerenza interna al framework**

Riguarda la compatibilità di un'affermazione con i presupposti teorici del progetto.

### **2. Compatibilità con letteratura e tradizioni disciplinari**

Riguarda il rapporto tra il progetto e i principali riferimenti teorici o scientifici rilevanti.

### **3. Forza inferenziale**

Riguarda la solidità del passaggio logico da certe premesse a certe conclusioni o implicazioni.

### **4. Verifica empirica o operativa**

Riguarda la possibilità di controllare, testare, osservare o applicare in modo valutabile quanto emerso.

Questa distinzione è essenziale perché consente di evitare una confusione molto frequente: quella tra **coerenza concettuale**, **plausibilità teorica** e **validazione empirica**.

Gli LLM possono offrire un contributo significativo soprattutto nei primi tre livelli; il quarto richiede invece dispositivi ulteriori, metodologicamente esterni alla sola interazione linguistica.

## **7. Criteri di qualità del metodo**

Un'applicazione del protocollo può dirsi ben riuscita quando produce almeno i seguenti esiti:

* chiarezza sul quadro teorico di partenza;
* mappatura non casuale degli ambiti pertinenti;
* approfondimenti verticali sufficientemente distinti;
* emersione non solo di conferme, ma anche di obiezioni e limiti;
* distinzione tra dato, interpretazione, ipotesi e applicazione;
* sintesi finale capace di integrare senza cancellare le differenze;
* tracciabilità delle affermazioni più importanti;
* individuazione dei punti che richiedono controllo ulteriore.

Il valore del metodo non dipende quindi dalla sola brillantezza delle risposte ottenute, ma dalla **qualità della procedura di selezione, articolazione e controllo**.

## **8. Limiti del protocollo**

Per quanto utile, il metodo presenta limiti che devono essere esplicitati.

### **1. Rischio di coerenza apparente**

Un LLM può produrre testi molto coerenti sul piano formale anche quando il supporto teorico o empirico è debole.

### **2. Rischio di autoreferenzialità**

La costruzione di meta-prompt e la segmentazione per silos possono aumentare l'ordine del lavoro, ma anche rinforzare alcune premesse senza metterle davvero alla prova.

### **3. Rischio di attribuzioni imprecise**

Autori, opere e riferimenti possono essere richiamati in modo plausibile ma non sempre accurato.

### **4. Rischio di salto dall'analisi all'operatività**

Il passaggio da un quadro teorico a una proposta concreta deve sempre essere giustificato esplicitamente e non dato per scontato.

### **5. Assenza di validazione automatica**

Il metodo non sostituisce la ricerca empirica, la revisione della letteratura, il confronto tra pari, la costruzione di indicatori o la valutazione sperimentale.

Esplicitare questi limiti non indebolisce il metodo; al contrario, lo rende più credibile.

## **9. Workflow operativo sintetico**

1. **Caricare il documento-ancora** contenente quadro teorico, finalità, lessico e criteri del progetto.
2. **Richiedere una mappatura degli ambiti pertinenti**, distinguendo i diversi livelli disciplinari.
3. **Far costruire meta-prompt specialistici** per ciascun ambito selezionato.
4. **Aprire chat distinte** per i singoli approfondimenti verticali.
5. **Condurre ogni approfondimento in più passaggi**, con checkpoints intermedi.
6. **Affiancare una fase di controllo critico**, comprendente red teaming, audit delle affermazioni e verifica dei riferimenti.
7. **Raccogliere i risultati dei singoli silos** in una sintesi finale integrata.
8. **Distinguere esplicitamente** tra coerenza interna, compatibilità teorica, forza inferenziale e verifica empirica.
9. **Produrre un output finale** che includa anche limiti, obiezioni e piste di approfondimento ulteriore.

## **10. Conclusione**

Il metodo "Framework & Deep Dive" non è un dispositivo di produzione automatica della verità, ma un **protocollo di ricerca assistita** pensato per migliorare il rapporto tra quadro teorico, esplorazione interdisciplinare e controllo critico nell'uso degli LLM.

La sua utilità consiste nel rendere l'interazione con l'AI meno casuale, meno impressionistica e meno dipendente dalla sola abilità conversazionale, trasformandola in un processo più ordinato, più trasparente e più metodicamente consapevole.

Usato correttamente, esso può aiutare il ricercatore a:

* chiarire i presupposti del proprio progetto;
* interrogare meglio i campi disciplinari rilevanti;
* far emergere nodi problematici spesso trascurati;
* costruire sintesi più robuste;
* preparare con maggiore lucidità la fase successiva della verifica teorica, operativa o empirica.

Il contributo dell'AI, in questo quadro, non consiste nel sostituire il giudizio umano, ma nel **potenziarne l'organizzazione, la capacità comparativa e la fecondità esplorativa**, entro una procedura che ne limiti le derive più note e ne valorizzi le potenzialità effettive.
