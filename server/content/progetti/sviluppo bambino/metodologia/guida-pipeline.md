# Guida alla pipeline F2/F3 — Laboratorio HCAIRE

> **Destinatario**: ricercatore che governa la pipeline.
> Questo documento non sostituisce i `CLAUDE.md` degli step (istruzioni operative per l'agente) ma li affianca come riferimento interpretativo: spiega perché ogni step esiste, quali decisioni spettano al ricercatore, quali comportamenti aspettarsi e dove stare attenti.

---

## Parte 0 — Architettura generale

### Due fasi, due logiche

La pipeline è articolata in due fasi con logiche complementari.

**F2 — Ricerca e modellizzazione tematica** esplora e valida un insieme di temi strutturalmente significativi. Lavora in modalità *multi-tema*: ogni step può prendere in input e produrre in output uno o più temi in parallelo, tutti dentro un wrapper `{ "step": "...", "results": [...] }`. Il risultato finale di F2 non è un tema, ma una *famiglia* di temi analizzati e orientati verso possibili usi.

**F3 — Costruzione del dispositivo configurazionale** costruisce, testa e trasferisce un dispositivo di lettura per *un singolo tema* alla volta. Ogni cartella di tema in `output/produzioni/temi/[nome-tema]/` contiene tutti i file F3 di quel tema. Il passaggio da array (F2) a singolo (F3) è una decisione del ricercatore, non della pipeline.

### Il confine tra F2 e F3

Il confine non è automatico. Al termine di F2 (dopo f2-step-5), il ricercatore ha in mano una o più *famiglie di output*: strutture che dicono cosa diventa possibile vedere con ciascun tema, in quali domini, con quale rischio di riduzione. La scelta di quale tema portare in F3 — e in quale ordine — è una decisione metodologica umana, orientata da `meta_notes.next_step_orientation` in f2-step-5 ma non determinata da essa.

Una volta scelto il tema, F3 costruisce il dispositivo per quel tema. Se successivamente si vuole costruire un dispositivo per un secondo tema, si rientra in F3 con quel tema (a partire da f3-step-7, se il dispositivo sorgente è già disponibile).

### Input esterni: dove il ricercatore deve intervenire

La pipeline è progettata per richiedere il minimo di intervento esterno — il resto è trasformazione strutturale che deve emergere dai dati. I punti in cui l'intervento è necessario o possibile sono questi:

| Step | Tipo | Cosa fornire | Effetto se omesso |
|---|---|---|---|
| **f2-step-2** | obbligatorio | Quale/i tema/i portare avanti dall'array di f2-step-1 | L'agente prende tutti i temi disponibili — comportamento corretto strutturalmente ma non sempre desiderato |
| **f3-step-7** | obbligatorio | Nuovo tema target e dominio applicativo | Il dispositivo risultante è strutturalmente corretto ma operativamente inutilizzabile (vincolo di realtà aperto) |
| **f3-step-10** | obbligatorio (strategico) | Casi critici specifici del dominio | L'agente costruisce casi autonomamente: il test è valido ma non testa fragilità specifiche del dominio reale |
| **f3-step-6** | facoltativo | Livello di severità del test di non-reversibilità (debole/forte) | Default: test debole — l'agente costruisce le contro-letture in autonomia |
| **f3-step-8** | facoltativo (raro) | Livello di specificità del dispositivo finale | Default: livello emergente dalla fenomenologia — meglio non intervenire salvo necessità |

**Principio**: più l'input è precoce e preciso (f2-step-2), più alta è la generatività della pipeline. Un tema mal definito o un contesto ambiguo produce dispositivi strutturalmente fragili anche con un'esecuzione perfetta degli step successivi.

### Come leggere questo documento

Per ogni step la scheda è organizzata in sezioni fisse: *Funzione* (perché esiste), *Decisione del ricercatore* (cosa spetta a lui), *Comportamento atteso* (range normale dell'output), *Punti di attenzione* (dove stare attenti), *Verifica* (se presente), *Confine verso il prossimo step*.

Le sezioni marcate **⚠ Attenzione** segnalano comportamenti che possono sorprendere o errori ricorrenti dell'agente.

---

## Parte 1 — Fase F2: ricerca e modellizzazione tematica

### Struttura dell'output F2

Ogni run di F2 è associata a una ricerca. La ricerca prende il nome definito in f2-step-1 e diventa una cartella autonoma in `output/produzioni/ricerche/`. Al termine dei cinque step, la cartella contiene:

```
output/produzioni/ricerche/[nome-ricerca]/
  theme-discovery-vN.json      ← f2-step-1
  theme-relevance-vN.json      ← f2-step-2
  theme-verification-vN.json   ← f2-step-3
  theme-matrix-vN.json         ← f2-step-4
  output-family-vN.json        ← f2-step-5
```

Tutti i file tranne il primo usano il wrapper multi-tema: `{ "step": "...", "results": [ { "theme_id": "...", ... }, ... ] }`. Il numero di elementi in `results` dipende da quanti temi il ricercatore ha scelto di portare avanti.

---

### f2-step-1 — Ricerca temi

**Funzione.** Individua e formula temi candidati strutturalmente significativi a partire da fonti esterne (letteratura, fonti istituzionali, policy) filtrate attraverso i sei assi strutturali. Lo step non sceglie il tema "giusto": produce un array di candidati con valutazione iniziale di pertinenza e segnalazione dei rischi di cattiva definizione.

**Decisione del ricercatore.** Nessun input esterno obbligatorio durante l'esecuzione. La decisione spetta al ricercatore *dopo*: guardare l'array prodotto, valutare i candidati e scegliere quale/i portare in f2-step-2. Questa scelta può avvenire immediatamente oppure dopo una lettura critica dell'output.

**Comportamento atteso.** L'agente produce tipicamente 5–15 temi candidati, ciascuno con: etichetta, descrizione strutturale, assi plausibilmente coinvolti, rischi di definizione. I temi sono formulati in modo non operativo — non "intervento sul pointing" ma "pointing precoce come atto di apertura condivisa del campo intenzionale".

**⚠ Punti di attenzione.**

- *Temi troppo generici*: un tema come "comunicazione precoce" o "relazione educativa" non è un oggetto ontologico valido — è una categoria, non un atto. L'agente dovrebbe segnalarlo come debole, ma se non lo fa il ricercatore deve riconoscerlo e riformulare prima di passare a f2-step-2.
- *Temi troppo operativi*: "training al pointing" o "protocollo di osservazione" non sono temi strutturali. Vanno esclusi.
- *Assi indicati in f2-step-1 sono provvisori*: lo step 1 segnala assi *plausibili*, non li conferma. La verifica strutturale avviene in step 2 e 3.

**Verifica.** Non presente. La selezione dei temi candidati è validata direttamente dal ricercatore.

**Confine verso f2-step-2.** Prima di procedere, il ricercatore deve avere scelto esplicitamente quale/i tema/i portare avanti e deve essere in grado di formularlo come atto o fenomeno specifico, osservabile, strutturalmente leggibile.

---

### f2-step-2 — Rilevanza strutturale

**Funzione.** Costruisce la prima mappa esplorativa degli assi, nodi e concetti-ponte per i temi selezionati. Non dimostra — esplora. Il risultato è un'ipotesi plausibile, non una configurazione definitiva: tutto è ancora aperto a revisione in f2-step-3.

**Decisione del ricercatore.** Il ricercatore deve dichiarare esplicitamente, prima di eseguire questo step, quale/i tema/i portare avanti. Il CLAUDE.md di f2-step-2 lo chiama *INPUT ESTERNO OBBLIGATORIO* e specifica che questa scelta "non è delegabile all'agente". Il tema deve essere un atto o fenomeno specifico (es. "pointing precoce", "richiesta di aiuto", "offerta spontanea") — non una categoria o un'area tematica.

**Comportamento atteso.** Per ogni tema selezionato, l'agente produce: assi candidati con livello di rilevanza (forte / plausibile / da_verificare), 5–10 nodi strutturali candidati, 2–4 concetti-ponte. L'output è un array — se si portano avanti 3 temi, `results` avrà 3 elementi.

**⚠ Punti di attenzione.**

- *Comportamento multi-tema*: se il ricercatore non specifica esplicitamente quale tema vuole analizzare, l'agente tende a prendere *tutti* i candidati prodotti da f2-step-1. Questo è strutturalmente corretto (il sistema è progettato per lavorare su più temi in parallelo) ma può produrre un output molto più ampio del previsto. **Se si vuole lavorare su un solo tema, dichiararlo esplicitamente nel prompt**.

- *Soglia di attivazione per temi micro*: i temi circoscritti (gesti puntuali, atti brevi come il pointing) richiedono una soglia più alta per gli "assi alti" (Asse 2 affettivo-morale, Asse 3 normativo-educativo, Asse 5). L'agente tende a sovra-strutturare temi micro, attivando assi che il fenomeno non giustifica. Se l'output sembra troppo denso per un atto puntuale, è probabile che alcuni assi vadano riportati da "plausibile" a "da_verificare" o eliminati.

- *ZPD e nodi troppo generali*: nodi come "zona di sviluppo prossimale" o "scaffolding" sono teoricamente applicabili a quasi tutto — e per questo non sono discriminanti. Se compaiono, verificare che superino entrambi i test: (1) il tema è pensabile senza questo nodo? (2) questo nodo distingue il tema da altri fenomeni simili? Se la risposta è "sì" alla prima e "no" alla seconda, il nodo è da rimuovere o declassare.

- *Concetti-ponte come nodi mascherati*: un concetto-ponte valido descrive una trasformazione tra assi (chi trasforma cosa, attraverso quale processo). Se un ponte si limita a nominare la co-presenza di due assi ("corpo e simbolo si intrecciano nel pointing") è descrittivo, non trasformativo, e non soddisfa la funzione di ponte. Deve essere riformulato o eliminato.

**Verifica.** Presente (`verifica.md`). Applicarla prima di procedere a f2-step-3. La verifica controlla sistematicamente: sovra-strutturazione degli assi, nodi troppo generali, ponti non trasformativi, violazione della distinzione nodo/concetto-ponte. Spesso prescrive una micro-revisione dello step 2 prima di passare allo step 3 — non è un passaggio automatico.

**Confine verso f2-step-3.** Prima di procedere, l'output di f2-step-2 deve aver superato la verifica. Se la verifica ha prescritto correzioni, applicarle e produrre una versione rivista dell'output prima di procedere.

---

### f2-step-3 — Verifica strutturale

**Funzione.** Trasforma l'ipotesi esplorativa di f2-step-2 in una configurazione strutturalmente fondata: riduce, raffina, seleziona. Il principio guida è "STEP 2 apre possibilità, STEP 3 crea vincoli". Il compito è *selezionare*, non accumulare — mantenere tutto per prudenza è un errore.

**Decisione del ricercatore.** Nessun input esterno necessario. Lo step lavora sull'output di f2-step-2 già verificato.

**Comportamento atteso.** Per ogni tema: massimo 2–3 assi confermati (gli altri vanno in `rejected_axes` con motivazione), 4–7 nodi confermati (gli altri in `secondary_nodes` o `rejected_nodes`), concetti-ponte verificati e eventualmente ridotti. L'output include anche una `synthetic_formulation` — una descrizione compatta della logica strutturale del tema.

**⚠ Punti di attenzione.**

- *Riduzione è il compito, non l'effetto collaterale*: l'agente tende a mantenere più elementi di quanti servano, giustificando le inclusioni con "potrebbe essere rilevante". Questo è sbagliato. Un asse che non supera i tre test (necessità, specificità, non-ridondanza) deve essere escluso, anche se ha una plausibilità teorica. La selezione aggressiva è la norma, non un fallimento.

- *Nodi secondari non sono un archivio*: i nodi secondari (presenti ma non strutturalmente necessari) devono essere al massimo 2. Se superano questo numero, il ricercatore deve rivalutare se alcuni di essi meritino di essere riclassificati come confermati o eliminati del tutto.

- *La verifica è incorporata nello step*: a differenza di f2-step-2, non c'è un file `verifica.md` separato. Lo step include già meccanismi di auto-verifica (i tre test per ogni nodo, i criteri di conferma per gli assi). Il ricercatore deve però leggere l'output criticamente e verificare che la `synthetic_formulation` catturi davvero la specificità del tema e non sia una descrizione generica.

**Confine verso f2-step-4.** Il `theme-verification-vN.json` prodotto da questo step è la base strutturale su cui poggiano tutti gli step successivi di F2 e la costruzione del dispositivo in F3. Gli `id` dei nodi confermati devono essere riportati esattamente negli step successivi — qualsiasi riformulazione introduce errori di tracciabilità. Prima di procedere, verificare che `confirmed_nodes` contenga gli `id` precisi dei nodi (non etichette leggibili derivate).

---

### f2-step-4 — Micro-matrice

**Funzione.** Articola la configurazione strutturale selezionata in f2-step-3 in una micro-matrice interrogabile: descrive come i nodi interagiscono tra loro, quale funzione specifica svolge ciascun asse nel tema, come i concetti-ponte connettono i livelli, quali tensioni strutturali genera la configurazione, e quali domande strutturali apre. La micro-matrice non dice cosa fare — dice cosa sta succedendo strutturalmente.

**Decisione del ricercatore.** Nessun input esterno necessario. Lo step è integralmente derivato da f2-step-3.

**Comportamento atteso.** Per ogni tema: `core_configuration` (logica e formula sintetica della configurazione), `axis_articulation` (funzione specifica di ciascun asse confermato), `bridge_integration` (come ogni concetto-ponte connette gli assi: tipo `connettivo` o `organizzativo`), `structural_tensions` (tensioni irriducibili generate dalla configurazione), `structural_questions` (domande che la matrice apre), `translation_potential` (domini in cui la configurazione è traducibile in usi).

**⚠ Punti di attenzione.**

- *Uso dei nodi*: la micro-matrice deve usare esclusivamente i `node_id` confermati in f2-step-3. Nessuna riformulazione leggibile è ammessa (es. "co-presenza" al posto di "co-regolazione-esperienziale"). Se l'agente introduce riformulazioni, correggerle prima di procedere — la tracciabilità del sistema dipende da questo.

- *Le tensioni non sono problemi*: le tensioni strutturali non segnalano limiti del modello — segnalano la complessità irriducibile del fenomeno. Un tema senza tensioni è probabilmente troppo semplificato. Le tensioni sono il motore interpretativo che rende la micro-matrice utile in F3 e in f2-step-5.

- *`translation_potential` orienta f2-step-5*: i domini identificati qui come candidati alla traducibilità devono essere ripresi da f2-step-5 — lo step 5 non può introdurre domini nuovi. Se mancano domini importanti, è preferibile completarli qui piuttosto che forzarli in step 5.

**Verifica.** Non presente come file separato.

**Confine verso f2-step-5.** Verificare che `translation_potential` contenga almeno 2–3 domini plausibili con motivazione strutturale. Lo step 5 lavorerà esattamente su quei domini.

---

### f2-step-5 — Famiglia di output

**Funzione.** Traduce la micro-matrice in una famiglia di possibili direzioni di uso del modello — non ancora strumenti operativi, ma tipi di uso strutturato che la configurazione rende possibili. Ogni famiglia di output è collegata esplicitamente ad assi, nodi e tensioni specifici della micro-matrice: senza questo collegamento l'output non è verificabile e perde valore epistemologico.

**Decisione del ricercatore.** Nessun input esterno necessario durante l'esecuzione. La decisione importante avviene *dopo* questo step: quale/i tema/i portare in F3 e con quale priorità. Lo step produce un campo `meta_notes.next_step_orientation` che orienta questa scelta ma non la determina.

**Comportamento atteso.** Per ogni tema: 3–5 famiglie di output corrispondenti ai domini di `translation_potential` di f2-step-4, con eventuale aggiunta di un dominio inter-dominio. Per ogni famiglia: `domain`, `output_type` (forma vincolata: "lettura configurazionale di…", "analisi della struttura di…", "orientamento alla qualità di…", "interrogazione strutturale su…"), `structural_basis` (assi, nodi, tensioni attivate), `value_added` (cosa diventa visibile che prima non lo era), `reduction_risk` (come il modello potrebbe essere banalizzato nell'uso), `meta_notes` sull'intera famiglia.

**⚠ Punti di attenzione.**

- *I nodi devono essere id esatti*: lo stesso vincolo di f2-step-4 vale qui con la stessa criticità. `structural_basis.nodes` deve contenere solo i `node_id` presenti in `confirmed_nodes` di f2-step-3. Se l'agente usa riformulazioni leggibili (es. "co-presenza" invece di "co-regolazione-esperienziale"), correggerle. Il campo opzionale `node_interpretation` è disponibile per contestualizzare come il nodo entra in quel dominio specifico, senza sostituirne l'identificatore.

- *`output_type` non è un'azione*: la forma dell'`output_type` è vincolata a descrivere una funzione del modello, non un comportamento del professionista. Se l'agente produce formulazioni come "come fare X" o "strategie per Y", lo step ha scivolato verso il prescrittivo — correggerle.

- *Le tensioni attivate sono il cuore*: un output che non attiva almeno una tensione strutturale è debole. Le tensioni rendono visibile perché la configurazione è rilevante per quel dominio e perché non è riducibile a una soluzione semplice. Verificare che siano presenti e collegate correttamente.

- *`reduction_risk` non è una nota di cautela*: il rischio di riduzione non è un avvertimento generico ("attenzione a non banalizzare") — è un'analisi strutturale della forma più probabile di scivolamento verso il prescrittivo o il banale, specifica per quel dominio. Un `reduction_risk` vago non è utile né in F3 né nella costruzione degli strumenti.

**Verifica.** Presente (`verifica.md`). Applicarla prima di passare a F3. La verifica controlla in particolare: violazioni del vincolo sui nodi, `output_type` prescrittivi, `value_added` che descrivono miglioramenti operativi invece di spostamenti di sguardo.

**⚠ Confine F2 → F3 — decisione del ricercatore.**

Completato f2-step-5 e applicata la verifica, il ricercatore si trova davanti alla scelta più significativa del percorso: quale tema portare in F3, in quale dominio, con quale priorità.

Questa scelta non è automatica. Gli elementi disponibili per orientarla sono:

- `meta_notes.next_step_orientation` di f2-step-5: quali famiglie di output sono più mature per lo sviluppo di strumenti operativi, quali richiedono ulteriore elaborazione
- `meta_notes.limitations`: cosa non è stato tradotto in output e perché
- La valutazione complessiva della `device_robustness` attesa: quanto la configurazione strutturale del tema sostiene un dispositivo operativamente solido

**F3 lavora su un tema per volta.** Il passaggio dall'array F2 al tema singolo F3 deve essere dichiarato esplicitamente: quale `theme_id` si porta avanti, in quale dominio applicativo si costruirà il dispositivo (questa informazione sarà l'input esterno obbligatorio di f3-step-7).

Se si vogliono costruire dispositivi per più temi, si rientra in F3 separatamente per ciascuno — ogni tema ha la propria cartella autonoma in `output/produzioni/temi/`.

---

## Parte 2 — Fase F3: costruzione del dispositivo configurazionale

### Architettura di F3 in due archi

F3 non è un percorso lineare da uno step al successivo: è articolata in due archi con funzioni distinte.

**Arco A — Costruzione e stabilizzazione (step 1–6b)**: parte dalla micro-matrice e dalla famiglia di output di F2, sceglie un dominio specifico e costruisce un dispositivo di lettura configurazionale per quel tema in quel dominio. Lo stress-testa, lo corregge, ne verifica la capacità discriminativa, e infine stabilizza il proxy chiave rendendolo epistemicamente robusto e auto-limitante. Al termine di questo arco il dispositivo è pronto — ma ancora legato al tema originario (es. pointing precoce) e al dominio in cui è stato costruito.

**Arco B — Trasferimento (step 7–10)**: applica il dispositivo stabilizzato a un nuovo tema e/o un nuovo dominio. Non costruisce da zero: valuta la trasferibilità strutturale, adatta i contenuti specifici, ricostruisce il dispositivo completo per il nuovo tema, e lo stress-testa nuovamente. Il risultato è un dispositivo indipendente, con la propria cartella in `output/produzioni/temi/[nome-nuovo-tema]/`.

Questa architettura a due archi è la ragione per cui F3 è concettualmente asimmetrica rispetto a F2: F2 lavora su molti temi in parallelo (logica di scoperta), F3 lavora su un tema alla volta — prima per costruire un dispositivo di riferimento epistemicamente controllato, poi per trasferirlo.

---

### Struttura dell'output F3

Ogni tema elaborato in F3 ha una cartella autonoma. Al termine dei dieci step, la cartella del tema originario contiene:

```
output/produzioni/temi/[nome-tema]/
  lettura-configurazionale-{domain}-v2.json       ← f3-step-1
  stress-test-{domain}-v2.json                    ← f3-step-2
  correzione-strutturale-{domain}-v2.json         ← f3-step-3
  indistinguibility-test-{domain}-v2.json         ← f3-step-4
  audit-{domain}-v2.json                          ← f3-step-5
  stabilizzazione-proxy-{domain}-v1.json          ← f3-step-6
  stabilizzazione-proxy-{domain}-v1b.json         ← f3-step-6b
  trasferibilita-{domain}-{tema-target}-v1.json   ← f3-step-7
```

La cartella del nuovo tema (arco B) contiene:

```
output/produzioni/temi/[nome-nuovo-tema]/
  adattamento-strutturale-{domain}-{tema-target}-v1.json   ← f3-step-8
  dispositivo-{tema-target}-{domain}-v1.json               ← f3-step-9
  stress-test-{tema-target}-{domain}-v1.json               ← f3-step-10
```

---

### f3-step-1 — Dispositivo di lettura configurazionale

**Funzione.** Trasforma la micro-matrice di f2-step-4 in un dispositivo di lettura contestualizzato per un dominio professionale specifico. Non produce strumenti — produce la condizione di possibilità degli strumenti: rende leggibile la struttura del tema nel dominio scelto, senza prescrivere comportamenti. È il primo prodotto concreto di F3 e definisce l'architettura che tutti gli step successivi testeranno, correggeranno o trasferiranno.

**Decisione del ricercatore.** Il ricercatore deve dichiarare esplicitamente quale dominio applicativo elaborare (es. `clinico`, `educativo`). Questa scelta è orientata da `translation_potential` in f2-step-4 — i domini candidati sono già stati identificati lì. Lo step non va eseguito su tutti i domini insieme: ogni esecuzione produce un dispositivo per un dominio, e ogni dispositivo è una traiettoria di sviluppo separata.

**Comportamento atteso.** L'agente produce un dispositivo articolato in: `function` (spostamento di sguardo prodotto nel dominio), `reading_focus` (3–5 dimensioni strutturali leggibili nel dominio, ciascuna con le quattro forme: presente / assente / distorta / oscillante), `access_points` (2–4 contesti reali in cui la configurazione può emergere, ciascuno con esplicita possibilità di fallimento strutturale), `structural_questions` (4–7 domande di cui almeno 2–3 ancorate a segnali grezzi osservabili), `interpretive_warnings` (2–4 rischi di distorsione nell'uso), `non_permitted_transformations` (limiti formulati come conseguenze strutturali attive, non come clausole proibitive).

**⚠ Punti di attenzione.**

- *Dimensioni troppo stabili*: ogni dimensione del `reading_focus` deve esplicitare esplicitamente le quattro forme di manifestazione (presente, assente, distorta, oscillante). Un dispositivo che descrive solo la forma piena è teoricamente corretto ma fragile nella pratica: le configurazioni reali sono discontinue. Se l'agente omette le forme degradate, il dispositivo risulta "troppo pulito" e non funzionale in contesto reale.

- *Access points senza fallimento*: ogni access point deve includere la possibilità che la configurazione non emerga, emerga parzialmente o venga interrotta — anche dall'intervento del professionista stesso. Un access point che descrive solo la situazione ottimale è irreale.

- *Domande già da operatore formato*: lo step deve includere almeno 2–3 domande ancorate a segnali grezzi osservabili elementari (es. "il bambino indica ma non guarda verso l'adulto"). Non è semplificazione: è il punto di ingresso nella struttura per chi non ha ancora la lettura configurazionale.

- *Non_permitted_transformations come clausole legali*: ogni limite d'uso va formulato come conseguenza strutturale attiva ("quando usato come diagnosi, la struttura configurazionale collassa in classificazione"), non come divieto passivo. La forma attiva rende visibile perché il limite esiste — non è un confine esterno ma una proprietà interna del dispositivo.

**Verifica.** Presente (`verifica.md`). Il giudizio atteso dal sistema è "strutturalmente corretto" ma con quattro problemi ricorrenti: dimensioni iper-coerenti (mancano le forme degradate), access points privi di fallimento strutturale, domande troppo raffinate senza segnali grezzi, non_permitted_transformations passive invece di attive. La verifica orienta le correzioni da apportare prima di passare a f3-step-2.

**Confine verso f3-step-2.** Il dispositivo deve essere stato verificato e le quattro correzioni tipiche applicate. In particolare, ogni dimensione deve esplicitare le quattro forme di manifestazione e ogni access point deve includere il fallimento strutturale. Questi elementi non sono dettagli stilistici: sono condizioni di usabilità operativa che f3-step-2 testerà attivamente.

---

### f3-step-2 — Stress test strutturale

**Funzione.** Mette il dispositivo di lettura (f3-step-1) sotto pressione sistematica attraverso cinque tipologie di casi limite. Il compito non è dimostrare che il dispositivo funziona — è trovare dove smette di funzionare. I punti di rottura identificati qui sono il risultato principale dello step e l'input diretto per la correzione strutturale in f3-step-3.

**Decisione del ricercatore.** Nessun input esterno durante l'esecuzione. I casi sono costruiti dall'agente in autonomia a partire dal dispositivo. Il ricercatore deve però leggere criticamente l'output e verificare che i casi siano davvero sfidanti: se tutti risultano leggibili con bassa ambiguità, lo stress test non è abbastanza severo.

**Comportamento atteso.** Cinque casi obbligatori, uno per tipo: `assenza_configurazione` (nessun livello si attiva), `configurazione_parziale` (alcuni livelli presenti, altri assenti), `configurazione_distorta` (i livelli si attivano ma in forma alterata), `configurazione_oscillante` (la configurazione è intermittente), `configurazione_apparente` (falso positivo strutturale: forma piena in superficie, nessuna struttura reale). Per ogni caso: descrizione concreta e plausibile, lettura con il dispositivo, punto di rottura se presente, rischi di mislettura (senza dispositivo e con dispositivo usato male).

**⚠ Punti di attenzione.**

- *Il caso `configurazione_apparente` è il più critico*: è quello in cui il dispositivo rischia di fallire silenziosamente — producendo una lettura apparentemente coerente su una configurazione che non lo è. Se questo caso non mette davvero in difficoltà il dispositivo, è costruito male. Il ricercatore deve verificare che il caso sia strutturalmente sofisticato, non appena superficialmente positivo.

- *Casi costruiti per dimostrare, non per sfidare*: l'errore più frequente è costruire casi che il dispositivo legge facilmente. Uno stress test utile costruisce casi plausibili in contesto reale e deliberatamente sfidanti. Se l'agente produce casi "puliti", il ricercatore può chiedere di rendere ciascuno più borderline.

- *Il punto di rottura è informazione strutturale*: la localizzazione di dove e perché il dispositivo si rompe non è un difetto da nascondere — è la mappa delle correzioni da fare in f3-step-3. Un output che non identifica nessun punto di rottura è sospetto.

**Verifica.** Non presente come file separato. Il ricercatore valuta direttamente se i casi sono abbastanza sfidanti e se i punti di rottura sono stati identificati con precisione.

**Confine verso f3-step-3.** L'output dello stress test deve identificare con chiarezza: dove il dispositivo funziona, dove produce ambiguità, dove si rompe completamente. Questi tre livelli sono la base per le correzioni strutturali di f3-step-3.

---

### f3-step-3 — Correzione strutturale

**Funzione.** Produce una versione corretta del dispositivo integrando le debolezze identificate nello stress test. Non è una riscrittura né un'espansione: è un intervento chirurgico su quattro problemi strutturali specifici che emergono sistematicamente dallo stress test. La logica è "più preciso, più discriminativo, più robusto sotto stress" — non "più completo o più ricco".

**Decisione del ricercatore.** Nessun input esterno necessario. Lo step lavora direttamente sui due file precedenti.

**Comportamento atteso.** Quattro correzioni obbligatorie: (1) stati del campo intenzionale — superare la logica binaria presente/assente introducendo almeno tre stati (assente / tentato / condiviso); (2) articolazione della co-regolazione — differenziare internamente il nodo in cinque livelli funzionali (assente / registrativa / partecipativa / trasformativa / chiudente), senza introdurre nuovi nodi; (3) bridge — introdurre condizioni di osservabilità indiretta che distinguano passaggio trasformativo aperto da passaggio predeterminato (script), tramite proxy strutturali non ridotti a indicatori comportamentali; (4) scala temporale — distinguere lettura episodio, lettura sequenza e lettura struttura relazionale, senza aggregazioni quantitative.

**⚠ Punti di attenzione.**

- *I livelli di co-regolazione non sono una scala di qualità*: assente → chiudente non è un percorso da peggio a meglio. Ogni livello descrive una funzione strutturale distinta (apertura del campo, sostegno, trasformazione, chiusura). L'agente tende a trattarli come scala crescente — correggere questa deriva con forza.

- *Il bridge non si riduce a indicatori comportamentali*: le condizioni di osservabilità indiretta del bridge sono proxy strutturali, non metriche. La distinzione passaggio-aperto / passaggio-predeterminato deve essere visibile strutturalmente, non misurata comportamentalmente. Per ogni classificazione è obbligatorio indicare: proxy decisivo, grado di osservabilità, status della classificazione (netta / probabile / ambigua) e condizioni in cui la classificazione deve diventare ambigua.

- *La scala temporale non usa conteggi*: passare dal livello episodio al livello sequenza non significa contare quante volte emerge la configurazione. Significa descrivere se l'oscillazione è casuale o sistematica, a quali condizioni contestuali è legata, e quando la lettura deve restare al livello episodico perché le condizioni non sono identificabili.

**Verifica.** Incorporata nello step (non c'è un file separato). L'auto-verifica è strutturata: i quattro vincoli aggiuntivi (A–D nel CLAUDE.md) rendono esplicito per ogni correzione cosa costituisce errore. Il ricercatore deve però leggere il risultato e verificare che la `synthetic_formulation` del dispositivo catturi davvero la specificità del tema — non sia diventata più generica per effetto delle correzioni.

**Confine verso f3-step-4.** Il dispositivo corretto è la base del test di indistinguibilità. Prima di procedere, verificare che il bridge sia effettivamente articolato con proxy strutturali e condizioni di classificazione — perché f3-step-4 testerà esattamente la capacità del bridge di distinguere configurazioni strutturalmente diverse che hanno forma comportamentale quasi identica.

---

### f3-step-4 — Stress test di indistinguibilità apparente

**Funzione.** Testa il limite critico del dispositivo corretto: riesce a distinguere forma da struttura quando la forma comportamentale è quasi identica? Lo step genera due casi volutamente indistinguibili a lettura fenomenica — uno con configurazione reale (passaggio aperto), uno con configurazione apparente (passaggio predeterminato / script) — e verifica se il dispositivo li discrimina su base strutturale ancorata alla configurazione. Non è un test di funzionamento generale: è il test del punto più vulnerabile del dispositivo.

**Decisione del ricercatore.** Nessun input esterno necessario. I due casi sono costruiti dall'agente con un vincolo preciso: i comportamenti osservabili devono essere il più possibile sovrapponibili, la differenza deve emergere solo a livello strutturale.

**Comportamento atteso.** Due casi: `configurazione_reale` (passaggio aperto, co-produzione genuina) e `configurazione_apparente` (passaggio predeterminato, script). Per ogni caso: descrizione fenomenica, osservazione strutturale dei nodi, analisi esplicita del proxy con triangolazione completa (proxy presenti, direzione non tautologica, contro-indicatore reale, confutazione del contro-indicatore, proxy_confidence, classification_status, condizioni di ambiguità), lettura alternativa possibile, capacità discriminativa del dispositivo, rischio di fallimento su questo caso specifico. Analisi comparativa dei due casi. Verdetto: il dispositivo discrimina su base strutturale?

**⚠ Punti di attenzione.**

- *La triangolazione deve essere reale, non nominale*: non basta che i campi della proxy_analysis siano compilati — devono fare lavoro logico reale. Un contro-indicatore debole o irrilevante non è una triangolazione. Un rebuttal che aggira il contro-indicatore invece di rispondergli non è una confutazione. Il ricercatore deve leggere la triangolazione come un ragionamento, non come una checklist.

- *Il verdetto deve seguire i proxy, non le aspettative*: se i due casi sono distinguibili solo attraverso inferenze esterne alla configurazione (stati mentali, contesto non osservabile), il verdetto deve essere dichiarato negativo. L'errore più comune è produrre un verdetto favorevole con una triangolazione insufficiente. Il risultato "VALIDATO CON RISERVA METODOLOGICA ESPLICITA" è un esito corretto e serio — non un fallimento.

- *Proxy_confidence e classification_status devono corrispondere*: proxy_confidence alta → classification_status netta; media → probabile; bassa → ambigua. Una classificazione netta con proxy di media osservabilità è un errore strutturale che f3-step-5 rileverà.

**Verifica.** Presente (`verifica.md`). Fissa una regola stabile: ogni classificazione strutturale deve indicare proxy decisivo, proxy_confidence, classification_status e condizioni in cui la classificazione deve diventare ambigua. La riserva metodologica esplicita non indebolisce il dispositivo: lo rende più serio.

**Confine verso f3-step-5.** L'output di f3-step-4 viene passato integralmente all'audit metodologico di f3-step-5, che verificherà se la triangolazione è reale o superficiale, se i proxy sono ancorati alla configurazione osservabile e non a stati mentali inferiti, e se la classification_status è coerente con la proxy_confidence.

---

### f3-step-5 — Audit metodologico

**Funzione.** Verifica se il metodo richiesto in f3-step-4 è stato realmente applicato — non se i risultati sono plausibili clinicamente, ma se l'analisi è epistemicamente corretta. Il compito è controllare la qualità della triangolazione, l'ancoraggio dei proxy all'osservabile, la coerenza tra proxy e classificazione. I problemi rilevati non sono difetti da nascondere: sono il risultato principale dell'audit, che orienta revisioni o segnala fragilità strutturali da dichiarare.

**Decisione del ricercatore.** Nessun input esterno necessario. L'agente opera sul file di f3-step-4 già prodotto.

**Comportamento atteso.** Undici verifiche strutturate: completezza formale, triangolazione (reale / superficiale / assente), validità dei proxy con vincolo di evidenza locale (ogni proxy deve essere ancorato a un elemento specifico della case_description, non della observed_configuration — altrimenti c'è rischio di circolarità), contro-lettura del proxy decisivo, coerenza proxy→classificazione, giustificazione della proxy_confidence, corrispondenza proxy_confidence↔classification_status, gestione dell'ambiguità, rischio di falso positivo, discriminazione reale (robusta / fragile / apparente), dipendenza dall'osservatore, dipendenza critica da proxy singolo. Verdetto finale: robusto / accettabile / fragile / non_valido.

**⚠ Punti di attenzione.**

- *L'auditor lavora a livello evidenziale, non dichiarativo*: non basta dire "il proxy è osservabile". Bisogna indicare esattamente quale elemento della case_description lo supporta. Se il proxy è ancorato alla observed_configuration invece che alla case_description, il sistema si supporta da solo — circolarità che invalida la lettura.

- *La contro-lettura del proxy decisivo è obbligatoria*: per il proxy su cui poggia la discriminazione, l'auditor deve verificare se lo stesso elemento potrebbe sostenere la classificazione opposta. Se la risposta è sì e questo non viene problematizzato, la discriminazione è più fragile di quanto dichiarato.

- *Dipendenza da proxy singolo*: se la discriminazione tra i due casi dipende da un solo proxy con confidence media o bassa, è obbligatorio dichiararlo esplicitamente. Non invalida la classificazione, ma riduce il grado di robustezza dell'intera discriminazione. Il verdetto "ACCETTABILE CON FRAGILITÀ STRUTTURALE NON ANCORA FORMALIZZATA" è una possibilità prevista e metodologicamente onesta.

**Verifica.** Presente (`verifica.md`). Identifica tre upgrade chiave che l'agente deve applicare: vincolo di evidenza locale, vincolo di contro-lettura, vincolo di dipendenza critica. Un audit che non li applica è "corretto ma non completamente critico verso se stesso".

**Confine verso f3-step-6.** L'audit può identificare problemi che richiedono revisione di f3-step-4 prima di procedere. Se il verdetto è "non_valido", è necessario tornare a f3-step-4 e correggere. Se è "fragile" o "accettabile", il ricercatore valuta se procedere con la fragilità dichiarata o revisare prima. In ogni caso, le fragilità identificate dall'audit orientano direttamente il lavoro di stabilizzazione del proxy in f3-step-6: la debolezza da correggere è già stata localizzata con precisione.

---

### f3-step-6 — Stabilizzazione del proxy (due passi)

**Funzione.** Stabilizza epistemicamente il proxy chiave del dispositivo. Lo stress test e l'audit hanno mostrato dove il proxy è fragile: reversibile, circolare, dipendente da inferenze non osservabili. Questo step lo ricostruisce in forma più robusta (passo 6a) e poi ne definisce le condizioni di applicabilità e non-applicabilità (passo 6b), dotando il dispositivo di una proprietà fondamentale: la capacità di non funzionare quando non deve funzionare.

Lo step è strutturato in due passi distinti con due CLAUDE.md separati — devono essere eseguiti in sequenza, non in parallelo.

**Decisione del ricercatore.** Input esterno **facoltativo** in f3-step-6a: il livello di severità del test di non-reversibilità. Il test può essere debole (default — l'agente costruisce le contro-letture in autonomia) o forte (il ricercatore fornisce contro-letture basate su casistica reale del dominio, varianti limite osservate nella pratica). La differenza non è di rigore logico ma di ancoraggio empirico: un test forte portato da chi conosce il dominio può smontare proxy che sembrano robusti sulla carta. Nessun input esterno in f3-step-6b.

**Comportamento atteso — passo 6a.** L'agente: (1) diagnostica il proxy attuale (perché è reversibile, dove introduce inferenze, dove perde ancoraggio fenomenico); (2) scompone il proxy in componenti osservabili (struttura temporale o relazionale A–B–C, non evento singolo); (3) costruisce un nuovo proxy che sia descrivibile come sequenza osservabile, verificabile senza sapere la classificazione, discriminante tra struttura aperta e chiusa; (4) esegue il test di non-reversibilità (costruisce una contro-lettura forte, risponde ad essa; se il proxy non regge, lo modifica o ne aggiunge un secondo); (5) verifica l'ancoraggio di ogni elemento del proxy alla case_description. Criterio di successo: il proxy non dipende dalla classificazione, non richiede inferenze mentali, non è invertibile facilmente, è leggibile come struttura dell'interazione non come comportamento isolato. Se queste condizioni non sono soddisfatte, l'agente deve dichiarare FALLIMENTO e spiegare perché.

**Comportamento atteso — passo 6b.** Partendo dal proxy ricostruito in 6a, l'agente: (1) identifica tutte le variabili osservative necessarie per applicarlo; (2) le classifica per tipo (direttamente osservabile / con mediazione / non osservabile) e livello di dipendenza dall'osservatore; (3) definisce le condizioni di applicabilità (elenco minimo, tutte necessarie); (4) definisce le condizioni di non-applicabilità (anche una sola mancante blocca l'applicazione); (5) specifica l'esito corretto in caso di dati insufficienti (non_classificabile / ambiguo / sospeso — con distinzione obbligatoria: "ambiguo" = dato presente ma non discriminante; "non_classificabile" = dato necessario assente); (6) riscrive il proxy in versione operativa completa.

**⚠ Punti di attenzione.**

- *Il proxy ricostruito in 6a non è ancora stabile*: 6a costruisce un proxy più robusto ma spesso ancora parzialmente reversibile. Il passo 6b non è un'aggiunta opzionale — è la parte che trasforma il proxy in uno strumento epistemicamente controllato. Senza le condizioni di non-applicabilità, il dispositivo produce inevitabilmente falsi positivi su dati insufficienti.

- *"Ambiguo" e "non_classificabile" sono esiti validi e distinti*: il sistema deve essere in grado di restituire entrambi. Un dispositivo che classifica sempre, anche con dati incompleti, non è robusto — è incauto. La formula chiave da fissare: "il dispositivo non è applicabile se non sono documentate le condizioni minime di osservabilità del proxy decisivo".

- *Errore da evitare in 6a*: trattare il proxy come comportamento puntuale. Il proxy deve descrivere una struttura temporale o relazionale — almeno tre momenti in sequenza (A–B–C) con relazione strutturale tra loro. Un proxy su un singolo evento è per definizione fragile.

**Verifica.** Presente (`verifica.md`). Il criterio di successo per 6b è sintetico e rigoroso: il risultato è valido solo se impedisce applicazioni su dati incompleti, non introduce nuove inferenze, rende esplicito quando NON decidere, ed è utilizzabile senza accesso alla observed_configuration (non in modo circolare).

**Confine verso f3-step-7.** Al termine di 6b il dispositivo è stabilizzato: ha un proxy robusto con condizioni di applicabilità esplicite. Questo dispositivo stabilizzato è il "dispositivo sorgente" da cui parte il trasferimento. Prima di procedere al trasferimento, il ricercatore deve avere scelto il nuovo tema e il dominio applicativo — questa è la decisione metodologica che apre l'arco B di F3.

---

### f3-step-7 — Trasferibilità del dispositivo

**Funzione.** Valuta se il dispositivo stabilizzato può essere trasferito a un nuovo tema e/o dominio prima di costruire il nuovo dispositivo. Non costruisce subito il nuovo dispositivo: prima mappa cosa è trasferibile integralmente, cosa richiede adattamento, e cosa non è trasferibile. Questo passaggio di valutazione preventiva evita di costruire un dispositivo su basi instabili.

**Decisione del ricercatore.** Input esterno **obbligatorio**: il ricercatore deve dichiarare esplicitamente (1) il nuovo tema (atto o fenomeno specifico) su cui si vuole trasferire il dispositivo, se diverso dal tema originario, e (2) il dominio applicativo. Questo definisce il **vincolo di realtà** del nuovo dispositivo: le condizioni di osservabilità disponibili, i rischi normativi specifici del dominio, il tipo di interlocutori professionali. Non specificare il dominio equivale a lasciare aperto il vincolo di realtà — il dispositivo risultante sarebbe strutturalmente corretto ma operativamente inutilizzabile.

**Comportamento atteso.** Per ogni elemento del dispositivo sorgente (core_configuration, assi, nodi, bridge, reading_focus, proxy operativi, requisiti di osservabilità, regole di non-classificabilità), l'agente indica: trasferibile integralmente / trasferibile con adattamento / non trasferibile. Identifica gli elementi specifici del tema originario che non possono essere esportati senza deformare il nuovo tema. Verifica se il nuovo tema possiede una configurazione comparabile, un passaggio trasformativo analogo, condizioni osservabili simili, rischi di falso positivo simili. Verifica i rischi di riduzione nel nuovo dominio (checklist, protocollo, diagnosi, valutazione normativa). Produce un verdetto di trasferibilità: trasferibile / trasferibile con adattamenti / trasferibilità debole / non trasferibile. Include anche due micro-casi (configurazione_reale e configurazione_apparente nel nuovo tema) come test preliminare.

**⚠ Punti di attenzione.**

- *Non costruire subito il nuovo dispositivo*: il rischio è saltare la valutazione di trasferibilità e portare proxy e strutture del tema originario nel nuovo tema come se fossero universali. Il proxy del pointing precoce non è automaticamente applicabile alla richiesta di aiuto — la struttura corporea, il tipo di passaggio trasformativo, le condizioni di osservabilità sono parzialmente diverse. f3-step-7 serve esattamente a non commettere questo errore.

- *Il verdetto di trasferibilità orienta l'ampiezza del lavoro in f3-step-8*: "trasferibile integralmente" significa poco lavoro di adattamento; "trasferibilità debole" significa che f3-step-8 dovrà ricostruire quasi da zero, e che il passaggio al nuovo tema è più una nuova costruzione che un trasferimento.

**Verifica.** Non presente come file separato.

**Confine verso f3-step-8.** Il ricercatore deve avere letto il verdetto di trasferibilità e approvato la selezione degli elementi trasferibili. Gli elementi "non trasferibili" non vanno portati in f3-step-8 anche se sembrano utili: il nuovo tema ha la propria struttura fenomenologica, che deve emergere autonomamente.

---

### f3-step-8 — Adattamento strutturale

**Funzione.** Costruisce la base strutturale del nuovo dispositivo — non il dispositivo completo, ma i suoi elementi fondanti: la corporeità specifica del nuovo atto, il bridge ridefinito per il nuovo tema, un primo proxy operativo testato, i requisiti di osservabilità, le regole di non-classificabilità. F3-step-9 prenderà questi elementi e costruirà il dispositivo completo integrando tutto.

**Decisione del ricercatore.** Input esterno **facoltativo** (raramente necessario): il livello di specificità del dispositivo finale. Il default è che l'agente determini autonomamente il livello di granularità che emerge naturalmente dalla fenomenologia del nuovo tema. Intervenire sulla specificità è giustificato solo in casi particolari (dominio con vincoli osservativi molto ristretti, necessità di massimizzare la trasferibilità, uso operativo immediato). Il rischio dell'intervento prematuro è guidare la costruzione verso preferenze del ricercatore invece di lasciare emergere la struttura dal tema.

**Comportamento atteso.** Quattro blocchi obbligatori: (1) `new_corporeity` — forma corporea tipica del nuovo atto, osservabile, distinta da altri atti, non ridotta a comportamento isolato; (2) `new_bridge` — passaggio trasformativo ridefinito per il nuovo tema, formulato come trasformazione relazionale osservabile (no formulazioni psicologiche), con distinzione esplicita tra stato iniziale, stato trasformato, forma aperta e forma predeterminata; (3) `new_proxy` — un proxy osservabile, non circolare, testato con test di non-reversibilità (se il test mostra che è reversibile, va modificato prima di procedere), diadico, ancorato alla sequenza dell'interazione; (4) `observability_requirements` e `non_classifiability_rules`.

**⚠ Punti di attenzione.**

- *Errore principale: trasformare il nuovo tema in una variante del tema originario*: la struttura deve essere ricostruita a partire dalla fenomenologia specifica del nuovo atto, non importata dal tema precedente. La corporeità della richiesta di aiuto non è la corporeità del pointing; il bridge non è lo stesso bridge. L'agente tende a replicare la struttura precedente con terminologia adattata — il ricercatore deve verificare che ogni elemento emerga genuinamente dal nuovo tema.

- *Il proxy deve attraversare il test di non-reversibilità prima di procedere*: se il test in 6a ha insegnato qualcosa, è che un proxy reversibile produce falsi positivi strutturali. Se il proxy costruito in questo step è solo "parzialmente_resistente", il sistema lo dice esplicitamente e chiede di trovare il punto non-reversibile prima di andare avanti — tipicamente spostando il discriminante dalla continuazione diadica (facilmente mimabile dallo scaffolding routinizzato) all'ingresso valutativo vs. ingresso esecutivo dell'adulto, che avviene prima della risposta e non è mimabile dallo script.

**Verifica.** Presente (`verifica.md`). Il feedback tipico identifica tre aree di successo (corporeità come configurazione osservabile, bridge isomorfo, proxy come struttura post-risposta) e un problema ricorrente: il proxy è corretto logicamente ma dipende da informazione sequenziale non sempre osservabile, e non supera pienamente il test di non-reversibilità. La verifica prescrive di trovare l'asimmetria strutturale non mimabile dallo script e di promuoverla a cuore del proxy, non a rafforzamento.

**Confine verso f3-step-9.** I quattro blocchi costruiti in questo step sono l'input diretto di f3-step-9. Prima di procedere: il proxy deve essere stabile (non parzialmente reversibile), il bridge deve distinguere forma aperta da forma predeterminata in modo osservabile, la corporeità deve essere genuinamente specifica del nuovo atto e non una variante del tema originario.

---

### f3-step-9 — Dispositivo completo

**Funzione.** Sintetizza operativamente il dispositivo completo per il nuovo tema, integrando tutto ciò che è stato costruito e stabilizzato negli step precedenti (3–8). Non introduce innovazione libera: ogni elemento deve essere derivato, adattato o integrato da quanto già prodotto. È il "punto di verità" del metodo: se il dispositivo regge qui, il trasferimento è riuscito; se collassa, significa che la stabilizzazione non era reale.

**Decisione del ricercatore.** Nessun input esterno necessario. Lo step lavora integralmente su materiale già prodotto.

**Comportamento atteso.** Undici sezioni obbligatorie: identità del dispositivo (con funzione che esplicita spostamento di sguardo e "cieco clinico" che colma), struttura di riferimento (core_configuration adattata, assi invariati, nodi con adattamenti dichiarati, bridge_concept nuovo), reading_focus con cinque dimensioni (base corporea, campo intenzionale a quattro stati, co-regolazione a cinque livelli, mediazione simbolica adattata, struttura del passaggio trasformativo con bridge e proxy integrati — con vincolo forte: la dimensione deve essere leggibile senza usare il proxy, che serve solo per classificare il bridge), access_points specifici per il nuovo tema con possibilità di fallimento, structural_questions, proxy operativo formalizzato (con output ammessi: aperto / predeterminato / non_classificabile / ambiguo), requisiti di osservabilità, regole di non-classificabilità (con distinzione obbligatoria non_classificabile vs. ambiguo), interpretive_warnings, non_permitted_transformations, validazione strutturale (checklist finale a cinque punti).

**⚠ Punti di attenzione.**

- *No inferenze, senza eccezioni*: lo step non ammette formulazioni tipo "il bambino vuole", "l'adulto capisce", "il bambino si aspetta". Solo struttura osservabile. L'agente tende a scivolare verso il linguaggio psicologico quando il tema è relazionale — correggere sistematicamente.

- *No normatività*: non introdurre adeguato/inadeguato, migliore/peggiore, autonomia/dipendenza come giudizio. Specialmente per temi come la richiesta di aiuto, il rischio è che il dispositivo diventi implicitamente valutativo sul livello di autonomia del bambino o sull'adeguatezza del caregiver.

- *La dimensione del passaggio trasformativo non usa il proxy per descrivere*: il proxy classifica il bridge, non lo descrive. La dimensione deve essere leggibile strutturalmente senza riferimento al proxy. Questo è un vincolo forte che l'agente viola spesso — leggere con attenzione quella sezione nell'output.

- *Auto-limitazione*: il dispositivo deve smettere di funzionare quando i dati non ci sono. Se la validazione strutturale dichiara `self_limiting: false`, c'è un problema da correggere prima di procedere.

**Verifica.** Non presente come file separato. La checklist di validazione strutturale finale è la verifica incorporata. Il ricercatore deve leggerla come esito metodologico, non come lista di spunta.

**Confine verso f3-step-10.** Il dispositivo completo è il materiale su cui lo stress test finale opera. Prima di procedere, la checklist di validazione deve avere tutti e cinque i punti soddisfatti. In particolare, `no_circularity` e `self_limiting` sono i più critici: un dispositivo circolare o che non sa quando fermarsi non supera lo stress test.

---

### f3-step-10 — Stress test del dispositivo completo

**Funzione.** Ultima verifica del dispositivo costruito per il nuovo tema: cinque casi critici che testano se il dispositivo legge correttamente configurazioni assenti, parziali, chiudenti e apparenti, se applica correttamente il proxy, se restituisce "non_classificabile" quando mancano dati, e se non produce falsi positivi configurazionali. A differenza di f3-step-2 (che testava il dispositivo di lettura grezzo), questo step testa il dispositivo completo e stabilizzato — il test è quindi più severo e orientato verso i rischi specifici del nuovo tema e del nuovo dominio.

**Decisione del ricercatore.** Input esterno **obbligatorio** (strategico): i casi critici del dominio. I casi costruiti dall'agente in autonomia sono strutturalmente plausibili ma generici. I casi forniti dal ricercatore che conosce il dominio reale sono strutturalmente più forti perché riflettono varianti limite osservate nella pratica, costruiscono ambiguità reali (non solo logiche), e forzano il dispositivo su casi che la teoria non anticipa. Il ricercatore può fornire i casi come testo narrativo nella richiesta; l'agente li integra nei cinque slot standard mantenendo la struttura di output. Se nessun caso è fornito, l'agente li costruisce in autonomia ma il test potrebbe non rilevare fragilità specifiche del dominio.

**Comportamento atteso.** Cinque casi obbligatori: configurazione assente, configurazione parziale, configurazione chiudente, configurazione apparente/scripted, caso quasi indistinguibile (ingresso valutativo reale vs. ingresso esecutivo mascherato). Per ogni caso: descrizione, configurazione osservata, applicabilità del proxy, lettura del dispositivo, punto di rottura eventuale, rischio di falsa lettura, esito (il dispositivo regge o fallisce).

**⚠ Punti di attenzione.**

- *Se manca la finestra pre-risposta, l'output deve essere non_classificabile*: questo è un vincolo assoluto legato alla struttura del proxy costruito in f3-step-8. Se il proxy richiede l'osservazione dell'ingresso valutativo dell'adulto e questa informazione non è presente nella descrizione del caso, il dispositivo non può classificare — non deve forzare una lettura.

- *Cercare almeno un caso in cui il dispositivo rischia un falso positivo*: il caso di configurazione apparente/scripted è costruito esattamente per questo. Se il dispositivo lo legge come configurazione reale, c'è un problema di discriminazione che deve essere dichiarato.

- *Il criterio di successo è composito*: il dispositivo supera il test solo se non classifica quando i dati non bastano, distingue risposta partecipativa da risposta chiudente, distingue ingresso valutativo reale da esecuzione diretta mascherata, dichiara ambiguità quando il proxy non discrimina, e non trasforma il tema in giudizio normativo (es. giudizio di autonomia o dipendenza del bambino).

**Verifica.** Non presente come file separato. Il ricercatore valuta l'esito complessivo come giudizio metodologico: il dispositivo è operativamente valido per il dominio dichiarato?

**Confine post-F3.** Al termine di f3-step-10 il dispositivo per il nuovo tema è completo e testato. Il ricercatore decide se: (a) considerare il dispositivo validato e procedere alla sua eventuale formalizzazione per l'uso operativo, (b) identificare fragilità residue che richiedono un'ulteriore iterazione su specifici step, (c) usare questo dispositivo come nuovo "dispositivo sorgente" per un ulteriore trasferimento a un terzo tema, rientrando in F3 a partire da f3-step-7.

---

## Appendice — Errori ricorrenti e come riconoscerli

Questa sezione raccoglie gli errori più frequenti osservati nell'esecuzione della pipeline, indipendentemente dallo step in cui si manifestano.

**L'agente prende tutti i temi invece di quelli selezionati.** Avviene tipicamente in f2-step-2 quando il ricercatore non specifica esplicitamente quale tema portare avanti. Riconoscibile: `results` contiene più temi di quanti il ricercatore intendesse analizzare. Soluzione: rieseguire lo step con indicazione esplicita del tema nel prompt.

**Nodi con id non corrispondenti ai confermati in f2-step-3.** Avviene in f2-step-4 e f2-step-5 quando l'agente riformula i nodi in linguaggio più leggibile. Riconoscibile: i valori in `structural_basis.nodes` non corrispondono esattamente agli `id` in `confirmed_nodes` del file `theme-verification-vN.json`. Soluzione: correggere manualmente i valori prima di procedere allo step successivo, usando il campo `node_interpretation` per contestualizzare.

**Sovra-strutturazione di temi micro.** Avviene in f2-step-2 quando l'agente attiva Asse 2, Asse 3 o Asse 5 per temi circoscritti (gesti, atti puntuali). Riconoscibile: la `selection_rationale` cita questi assi come "plausibili" per un fenomeno che non richiede strutturalmente interiorizzazione, normatività o campo desiderabile. Soluzione: applicare la verifica e declassare o eliminare gli assi non giustificati.

**`output_type` prescrittivi in f2-step-5.** Avviene quando l'agente formula i tipi di output come azioni invece di funzioni. Riconoscibile: `output_type` contiene "come fare", "strategie per", "consigli su". Soluzione: riformulare nella forma vincolata ("lettura configurazionale di…", "analisi della struttura di…").

**Concetti-ponte descrittivi invece di trasformativi.** Avviene in f2-step-2 quando l'agente include ponti che nominano la co-presenza di due assi senza descrivere il processo trasformativo. Riconoscibile: il ponte non risponde a "chi trasforma cosa, attraverso quale processo, con quale esito". Soluzione: riformulare o eliminare.

**Passaggio prematuro da F2 a F3 senza selezione esplicita del tema.** Avviene quando si entra in f3-step-1 senza aver dichiarato quale tema portare avanti e in quale dominio costruire il dispositivo. Riconoscibile: f3-step-7 non riesce a operare perché il vincolo di realtà non è stato definito. Soluzione: tornare al confine F2→F3, scegliere il tema e il dominio applicativo, documentare la scelta prima di procedere.

**Funzione.** Trasforma la micro-matrice di f2-step-4 in un dispositivo di lettura contestualizzato per un dominio professionale specifico. Non produce strumenti — produce la condizione di possibilità degli strumenti: rende leggibile la struttura del tema nel dominio scelto, senza prescrivere comportamenti. È il primo prodotto concreto di F3 e definisce l'architettura che tutti gli step successivi testeranno, correggeranno o trasferiranno.

**Decisione del ricercatore.** Il ricercatore deve dichiarare esplicitamente quale dominio applicativo elaborare (es. `clinico`, `educativo`). Questa scelta è orientata da `translation_potential` in f2-step-4 — i domini candidati sono già stati identificati lì. Lo step non va eseguito su tutti i domini insieme: ogni esecuzione produce un dispositivo per un dominio, e ogni dispositivo è una traiettoria di sviluppo separata.

**Comportamento atteso.** L'agente produce un dispositivo articolato in: `function` (spostamento di sguardo prodotto nel dominio), `reading_focus` (3–5 dimensioni strutturali leggibili nel dominio, ciascuna con le quattro forme: presente / assente / distorta / oscillante), `access_points` (2–4 contesti reali in cui la configurazione può emergere, ciascuno con esplicita possibilità di fallimento strutturale), `structural_questions` (4–7 domande di cui almeno 2–3 ancorate a segnali grezzi osservabili), `interpretive_warnings` (2–4 rischi di distorsione nell'uso), `non_permitted_transformations` (limiti formulati come conseguenze strutturali attive, non come clausole proibitive).

**⚠ Punti di attenzione.**

- *Dimensioni troppo stabili*: ogni dimensione del `reading_focus` deve esplicitare le quattro forme di manifestazione (presente, assente, distorta, oscillante). Un dispositivo che descrive solo la forma piena è teoricamente corretto ma fragile nella pratica: le configurazioni reali sono discontinue. Se l'agente omette le forme degradate, il dispositivo risulta "troppo pulito" e non funzionale in contesto reale.

- *Access points senza fallimento*: ogni access point deve includere la possibilità che la configurazione non emerga, emerga parzialmente o venga interrotta — anche dall'intervento del professionista stesso. Un access point che descrive solo la situazione ottimale è irreale.

- *Domande già da operatore formato*: lo step deve includere almeno 2–3 domande ancorate a segnali grezzi osservabili elementari (es. "il bambino indica ma non guarda verso l'adulto"). Non è semplificazione: è il punto di ingresso nella struttura per chi non ha ancora la lettura configurazionale.

- *Non_permitted_transformations come clausole legali*: ogni limite d'uso va formulato come conseguenza strutturale attiva ("quando usato come diagnosi, la struttura configurazionale collassa in classificazione"), non come divieto passivo. La forma attiva rende visibile perché il limite esiste — non è un confine esterno ma una proprietà interna del dispositivo.

**Verifica.** Presente (`verifica.md`). Il giudizio atteso è "strutturalmente corretto" con quattro problemi ricorrenti: dimensioni iper-coerenti (mancano le forme degradate), access points privi di fallimento strutturale, domande troppo raffinate senza segnali grezzi, non_permitted_transformations passive invece di attive. La verifica orienta le correzioni da apportare prima di passare a f3-step-2.

**Confine verso f3-step-2.** Il dispositivo deve essere stato verificato e le quattro correzioni tipiche applicate. In particolare, ogni dimensione deve esplicitare le quattro forme di manifestazione e ogni access point deve includere il fallimento strutturale. Questi elementi non sono dettagli stilistici: sono condizioni di usabilità operativa che f3-step-2 testerà attivamente.

---

### f3-step-2 — Stress test strutturale

**Funzione.** Mette il dispositivo di lettura (f3-step-1) sotto pressione sistematica attraverso cinque tipologie di casi limite. Il compito non è dimostrare che il dispositivo funziona — è trovare dove smette di funzionare. I punti di rottura identificati qui sono il risultato principale dello step e l'input diretto per la correzione strutturale in f3-step-3.

**Decisione del ricercatore.** Nessun input esterno durante l'esecuzione. I casi sono costruiti dall'agente in autonomia a partire dal dispositivo. Il ricercatore deve però leggere criticamente l'output e verificare che i casi siano davvero sfidanti: se tutti risultano leggibili con bassa ambiguità, lo stress test non è abbastanza severo.

**Comportamento atteso.** Cinque casi obbligatori, uno per tipo: `assenza_configurazione` (nessun livello si attiva), `configurazione_parziale` (alcuni livelli presenti, altri assenti), `configurazione_distorta` (i livelli si attivano ma in forma alterata), `configurazione_oscillante` (la configurazione è intermittente), `configurazione_apparente` (falso positivo strutturale: forma piena in superficie, nessuna struttura reale). Per ogni caso: descrizione concreta e plausibile, lettura con il dispositivo, punto di rottura se presente, rischi di mislettura (senza dispositivo e con dispositivo usato male).

**⚠ Punti di attenzione.**

- *Il caso `configurazione_apparente` è il più critico*: è quello in cui il dispositivo rischia di fallire silenziosamente — producendo una lettura apparentemente coerente su una configurazione che non lo è. Se questo caso non mette davvero in difficoltà il dispositivo, è costruito male. Il ricercatore deve verificare che il caso sia strutturalmente sofisticato, non appena superficialmente positivo.

- *Casi costruiti per dimostrare, non per sfidare*: l'errore più frequente è costruire casi che il dispositivo legge facilmente. Uno stress test utile costruisce casi plausibili in contesto reale e deliberatamente sfidanti. Se l'agente produce casi "puliti", il ricercatore può chiedere di rendere ciascuno più borderline.

- *Il punto di rottura è informazione strutturale*: la localizzazione di dove e perché il dispositivo si rompe non è un difetto da nascondere — è la mappa delle correzioni da fare in f3-step-3. Un output che non identifica nessun punto di rottura è sospetto.

**Verifica.** Non presente come file separato. Il ricercatore valuta direttamente se i casi sono abbastanza sfidanti e se i punti di rottura sono stati identificati con precisione.

**Confine verso f3-step-3.** L'output dello stress test deve identificare con chiarezza: dove il dispositivo funziona, dove produce ambiguità, dove si rompe completamente. Questi tre livelli sono la base per le correzioni strutturali di f3-step-3.

---

### f3-step-3 — Correzione strutturale

**Funzione.** Produce una versione corretta del dispositivo integrando le debolezze identificate nello stress test. Non è una riscrittura né un'espansione: è un intervento chirurgico su quattro problemi strutturali specifici che emergono sistematicamente dallo stress test. La logica è "più preciso, più discriminativo, più robusto sotto stress" — non "più completo o più ricco".

**Decisione del ricercatore.** Nessun input esterno necessario. Lo step lavora direttamente sui due file precedenti.

**Comportamento atteso.** Quattro correzioni obbligatorie: (1) stati del campo intenzionale — superare la logica binaria presente/assente introducendo almeno tre stati (assente / tentato / condiviso); (2) articolazione della co-regolazione — differenziare internamente il nodo in cinque livelli funzionali (assente / registrativa / partecipativa / trasformativa / chiudente), senza introdurre nuovi nodi; (3) bridge — introdurre condizioni di osservabilità indiretta che distinguano passaggio trasformativo aperto da passaggio predeterminato (script), tramite proxy strutturali non ridotti a indicatori comportamentali; (4) scala temporale — distinguere lettura episodio, lettura sequenza e lettura struttura relazionale, senza aggregazioni quantitative.

**⚠ Punti di attenzione.**

- *I livelli di co-regolazione non sono una scala di qualità*: assente → chiudente non è un percorso da peggio a meglio. Ogni livello descrive una funzione strutturale distinta (apertura del campo, sostegno, trasformazione, chiusura). L'agente tende a trattarli come scala crescente — correggere questa deriva con forza.

- *Il bridge non si riduce a indicatori comportamentali*: le condizioni di osservabilità indiretta del bridge sono proxy strutturali, non metriche. La distinzione passaggio-aperto / passaggio-predeterminato deve essere visibile strutturalmente, non misurata comportamentalmente. Per ogni classificazione è obbligatorio indicare: proxy decisivo, grado di osservabilità, status della classificazione (netta / probabile / ambigua) e condizioni in cui la classificazione deve diventare ambigua.

- *La scala temporale non usa conteggi*: passare dal livello episodio al livello sequenza non significa contare quante volte emerge la configurazione. Significa descrivere se l'oscillazione è casuale o sistematica, a quali condizioni contestuali è legata, e quando la lettura deve restare al livello episodico perché le condizioni non sono identificabili.

**Verifica.** Incorporata nello step (non c'è un file separato). I quattro vincoli aggiuntivi (A–D nel CLAUDE.md) rendono esplicito per ogni correzione cosa costituisce errore. Il ricercatore deve verificare che la `synthetic_formulation` del dispositivo catturi davvero la specificità del tema — non sia diventata più generica per effetto delle correzioni.

**Confine verso f3-step-4.** Il dispositivo corretto è la base del test di indistinguibilità. Prima di procedere, verificare che il bridge sia effettivamente articolato con proxy strutturali e condizioni di classificazione — perché f3-step-4 testerà esattamente la capacità del bridge di distinguere configurazioni strutturalmente diverse che hanno forma comportamentale quasi identica.

---

### f3-step-4 — Stress test di indistinguibilità apparente

**Funzione.** Testa il limite critico del dispositivo corretto: riesce a distinguere forma da struttura quando la forma comportamentale è quasi identica? Lo step genera due casi volutamente indistinguibili a lettura fenomenica — uno con configurazione reale (passaggio aperto), uno con configurazione apparente (passaggio predeterminato / script) — e verifica se il dispositivo li discrimina su base strutturale ancorata alla configurazione. Non è un test di funzionamento generale: è il test del punto più vulnerabile del dispositivo.

**Decisione del ricercatore.** Nessun input esterno necessario. I due casi sono costruiti dall'agente con un vincolo preciso: i comportamenti osservabili devono essere il più possibile sovrapponibili, la differenza deve emergere solo a livello strutturale.

**Comportamento atteso.** Due casi: `configurazione_reale` (passaggio aperto, co-produzione genuina) e `configurazione_apparente` (passaggio predeterminato, script). Per ogni caso: descrizione fenomenica, osservazione strutturale dei nodi, analisi esplicita del proxy con triangolazione completa (proxy presenti, direzione non tautologica, contro-indicatore reale, confutazione del contro-indicatore, proxy_confidence, classification_status, condizioni di ambiguità), lettura alternativa possibile, capacità discriminativa del dispositivo, rischio di fallimento su questo caso specifico. Analisi comparativa dei due casi. Verdetto: il dispositivo discrimina su base strutturale?

**⚠ Punti di attenzione.**

- *La triangolazione deve essere reale, non nominale*: non basta che i campi della proxy_analysis siano compilati — devono fare lavoro logico reale. Un contro-indicatore debole o irrilevante non è una triangolazione. Un rebuttal che aggira il contro-indicatore invece di rispondergli non è una confutazione. Il ricercatore deve leggere la triangolazione come un ragionamento, non come una checklist.

- *Il verdetto deve seguire i proxy, non le aspettative*: se i due casi sono distinguibili solo attraverso inferenze esterne alla configurazione (stati mentali, contesto non osservabile), il verdetto deve essere dichiarato negativo. Il risultato "VALIDATO CON RISERVA METODOLOGICA ESPLICITA" è un esito corretto e serio — non un fallimento.

- *Proxy_confidence e classification_status devono corrispondere*: proxy_confidence alta → classification_status netta; media → probabile; bassa → ambigua. Una classificazione netta con proxy di media osservabilità è un errore strutturale che f3-step-5 rileverà.

**Verifica.** Presente (`verifica.md`). Fissa una regola stabile: ogni classificazione strutturale deve indicare proxy decisivo, proxy_confidence, classification_status e condizioni in cui la classificazione deve diventare ambigua. La riserva metodologica esplicita non indebolisce il dispositivo: lo rende più serio.

**Confine verso f3-step-5.** L'output di f3-step-4 viene passato integralmente all'audit metodologico di f3-step-5, che verificherà se la triangolazione è reale o superficiale, se i proxy sono ancorati alla configurazione osservabile e non a stati mentali inferiti, e se la classification_status è coerente con la proxy_confidence.

---

### f3-step-5 — Audit metodologico

**Funzione.** Verifica se il metodo richiesto in f3-step-4 è stato realmente applicato — non se i risultati sono plausibili clinicamente, ma se l'analisi è epistemicamente corretta. Il compito è controllare la qualità della triangolazione, l'ancoraggio dei proxy all'osservabile, la coerenza tra proxy e classificazione. I problemi rilevati non sono difetti da nascondere: sono il risultato principale dell'audit.

**Decisione del ricercatore.** Nessun input esterno necessario. L'agente opera sul file di f3-step-4 già prodotto.

**Comportamento atteso.** Undici verifiche strutturate: completezza formale, triangolazione (reale / superficiale / assente), validità dei proxy con vincolo di evidenza locale (ogni proxy deve essere ancorato a un elemento specifico della case_description, non della observed_configuration — altrimenti c'è rischio di circolarità), contro-lettura del proxy decisivo, coerenza proxy→classificazione, giustificazione della proxy_confidence, corrispondenza proxy_confidence↔classification_status, gestione dell'ambiguità, rischio di falso positivo, discriminazione reale (robusta / fragile / apparente), dipendenza dall'osservatore, dipendenza critica da proxy singolo. Verdetto finale: robusto / accettabile / fragile / non_valido.

**⚠ Punti di attenzione.**

- *L'auditor lavora a livello evidenziale, non dichiarativo*: non basta dire "il proxy è osservabile". Bisogna indicare esattamente quale elemento della case_description lo supporta. Se il proxy è ancorato alla observed_configuration invece che alla case_description, il sistema si supporta da solo — circolarità che invalida la lettura.

- *La contro-lettura del proxy decisivo è obbligatoria*: per il proxy su cui poggia la discriminazione, l'auditor deve verificare se lo stesso elemento potrebbe sostenere la classificazione opposta. Se la risposta è sì e questo non viene problematizzato, la discriminazione è più fragile di quanto dichiarato.

- *Dipendenza da proxy singolo*: se la discriminazione dipende da un solo proxy con confidence media o bassa, è obbligatorio dichiararlo esplicitamente. Non invalida la classificazione, ma riduce il grado di robustezza dell'intera discriminazione. Il verdetto "ACCETTABILE CON FRAGILITÀ STRUTTURALE NON ANCORA FORMALIZZATA" è una possibilità prevista e metodologicamente onesta.

**Verifica.** Presente (`verifica.md`). Identifica tre upgrade chiave: vincolo di evidenza locale, vincolo di contro-lettura, vincolo di dipendenza critica. Un audit che non li applica è "corretto ma non completamente critico verso se stesso".

**Confine verso f3-step-6.** L'audit può identificare problemi che richiedono revisione di f3-step-4. Se il verdetto è "non_valido", è necessario tornare a f3-step-4 e correggere. Se è "fragile" o "accettabile", il ricercatore valuta se procedere con la fragilità dichiarata o revisare prima. In ogni caso, le fragilità identificate dall'audit orientano direttamente il lavoro di stabilizzazione del proxy in f3-step-6: la debolezza da correggere è già stata localizzata con precisione.

---

### f3-step-6 — Stabilizzazione del proxy (due passi)

**Funzione.** Stabilizza epistemicamente il proxy chiave del dispositivo. Lo stress test e l'audit hanno mostrato dove il proxy è fragile: reversibile, circolare, dipendente da inferenze non osservabili. Questo step lo ricostruisce in forma più robusta (passo 6a) e poi ne definisce le condizioni di applicabilità e non-applicabilità (passo 6b), dotando il dispositivo di una proprietà fondamentale: la capacità di non funzionare quando non deve funzionare.

Lo step è strutturato in due passi distinti con due CLAUDE.md separati (`CLAUDE.md` per 6a, `CLAUDE-B.md` per 6b) — devono essere eseguiti in sequenza, non in parallelo.

**Decisione del ricercatore.** Input esterno **facoltativo** in f3-step-6a: il livello di severità del test di non-reversibilità. Il test può essere debole (default — l'agente costruisce le contro-letture in autonomia) o forte (il ricercatore fornisce contro-letture basate su casistica reale del dominio, varianti limite osservate nella pratica). La differenza non è di rigore logico ma di ancoraggio empirico: un test forte portato da chi conosce il dominio può smontare proxy che sembrano robusti sulla carta. Nessun input esterno in f3-step-6b.

**Comportamento atteso — passo 6a.** L'agente: (1) diagnostica il proxy attuale (perché è reversibile, dove introduce inferenze, dove perde ancoraggio fenomenico); (2) scompone il proxy in componenti osservabili (struttura temporale o relazionale A–B–C, non evento singolo); (3) costruisce un nuovo proxy descrivibile come sequenza osservabile, verificabile senza sapere la classificazione, discriminante tra struttura aperta e chiusa; (4) esegue il test di non-reversibilità (costruisce una contro-lettura forte, risponde ad essa; se il proxy non regge, lo modifica o ne aggiunge un secondo); (5) verifica l'ancoraggio di ogni elemento del proxy alla case_description. Criterio di successo: il proxy non dipende dalla classificazione, non richiede inferenze mentali, non è invertibile facilmente, è leggibile come struttura dell'interazione non come comportamento isolato. Se queste condizioni non sono soddisfatte, l'agente deve dichiarare FALLIMENTO e spiegare perché.

**Comportamento atteso — passo 6b.** Partendo dal proxy ricostruito in 6a, l'agente: (1) identifica tutte le variabili osservative necessarie per applicarlo; (2) le classifica per tipo (direttamente osservabile / con mediazione / non osservabile) e livello di dipendenza dall'osservatore; (3) definisce le condizioni di applicabilità (elenco minimo, tutte necessarie); (4) definisce le condizioni di non-applicabilità (anche una sola mancante blocca l'applicazione); (5) specifica l'esito corretto in caso di dati insufficienti — con distinzione obbligatoria: "ambiguo" = dato presente ma non discriminante; "non_classificabile" = dato necessario assente; (6) riscrive il proxy in versione operativa completa.

**⚠ Punti di attenzione.**

- *Il passo 6b non è opzionale*: 6a costruisce un proxy più robusto ma spesso ancora parzialmente reversibile. Senza le condizioni di non-applicabilità di 6b, il dispositivo produce inevitabilmente falsi positivi su dati insufficienti. La formula chiave da fissare: "il dispositivo non è applicabile se non sono documentate le condizioni minime di osservabilità del proxy decisivo".

- *"Ambiguo" e "non_classificabile" sono esiti validi e distinti*: un dispositivo che classifica sempre, anche con dati incompleti, non è robusto — è incauto.

- *Errore da evitare in 6a*: trattare il proxy come comportamento puntuale. Il proxy deve descrivere una struttura temporale o relazionale — almeno tre momenti in sequenza (A–B–C) con relazione strutturale tra loro.

**Verifica.** Presente (`verifica.md`). Il risultato di 6b è valido solo se impedisce applicazioni su dati incompleti, non introduce nuove inferenze, rende esplicito quando NON decidere, ed è utilizzabile senza accesso alla observed_configuration.

**Confine verso f3-step-7.** Al termine di 6b il dispositivo è stabilizzato: ha un proxy robusto con condizioni di applicabilità esplicite. Questo dispositivo stabilizzato è il "dispositivo sorgente" da cui parte il trasferimento. Prima di procedere, il ricercatore deve avere scelto il nuovo tema e il dominio applicativo — questa è la decisione metodologica che apre l'arco B di F3.

---

### f3-step-7 — Trasferibilità del dispositivo

**Funzione.** Valuta se il dispositivo stabilizzato può essere trasferito a un nuovo tema e/o dominio prima di costruire il nuovo dispositivo. Non costruisce subito il nuovo dispositivo: prima mappa cosa è trasferibile integralmente, cosa richiede adattamento, e cosa non è trasferibile. Questo passaggio di valutazione preventiva evita di costruire un dispositivo su basi instabili.

**Decisione del ricercatore.** Input esterno **obbligatorio**: il ricercatore deve dichiarare esplicitamente (1) il nuovo tema (atto o fenomeno specifico) su cui si vuole trasferire il dispositivo e (2) il dominio applicativo. Questo definisce il **vincolo di realtà** del nuovo dispositivo: le condizioni di osservabilità disponibili, i rischi normativi specifici del dominio, il tipo di interlocutori professionali. Non specificare il dominio equivale a lasciare aperto il vincolo di realtà — il dispositivo risultante sarebbe strutturalmente corretto ma operativamente inutilizzabile.

**Comportamento atteso.** Per ogni elemento del dispositivo sorgente (core_configuration, assi, nodi, bridge, reading_focus, proxy operativi, requisiti di osservabilità, regole di non-classificabilità), l'agente indica: trasferibile integralmente / trasferibile con adattamento / non trasferibile. Identifica gli elementi specifici del tema originario che non possono essere esportati senza deformare il nuovo tema. Verifica se il nuovo tema possiede una configurazione comparabile, un passaggio trasformativo analogo, condizioni osservabili simili, rischi di falso positivo simili. Verifica i rischi di riduzione nel nuovo dominio (checklist, protocollo, diagnosi, valutazione normativa). Produce un verdetto di trasferibilità: trasferibile / trasferibile con adattamenti / trasferibilità debole / non trasferibile. Include due micro-casi (configurazione_reale e configurazione_apparente nel nuovo tema) come test preliminare.

**⚠ Punti di attenzione.**

- *Non costruire subito il nuovo dispositivo*: il rischio è saltare la valutazione e portare proxy e strutture del tema originario nel nuovo tema come se fossero universali. Il proxy del pointing precoce non è automaticamente applicabile alla richiesta di aiuto — la struttura corporea, il tipo di passaggio trasformativo, le condizioni di osservabilità sono parzialmente diverse. f3-step-7 serve esattamente a non commettere questo errore.

- *Il verdetto di trasferibilità orienta l'ampiezza del lavoro in f3-step-8*: "trasferibile integralmente" significa poco adattamento; "trasferibilità debole" significa che f3-step-8 dovrà ricostruire quasi da zero.

**Verifica.** Non presente come file separato.

**Confine verso f3-step-8.** Il ricercatore deve avere letto il verdetto di trasferibilità e approvato la selezione degli elementi trasferibili. Gli elementi "non trasferibili" non vanno portati in f3-step-8: il nuovo tema ha la propria struttura fenomenologica, che deve emergere autonomamente.

---

### f3-step-8 — Adattamento strutturale

**Funzione.** Costruisce la base strutturale del nuovo dispositivo — non il dispositivo completo, ma i suoi elementi fondanti: la corporeità specifica del nuovo atto, il bridge ridefinito per il nuovo tema, un primo proxy operativo testato, i requisiti di osservabilità, le regole di non-classificabilità. F3-step-9 prenderà questi elementi e costruirà il dispositivo completo.

**Decisione del ricercatore.** Input esterno **facoltativo** (raramente necessario): il livello di specificità del dispositivo finale. Il default è che l'agente determini autonomamente il livello di granularità che emerge dalla fenomenologia del nuovo tema. Intervenire è giustificato solo in casi particolari (dominio con vincoli osservativi molto ristretti, necessità di massimizzare la trasferibilità, uso operativo immediato). Il rischio dell'intervento prematuro è guidare la costruzione verso preferenze del ricercatore invece di lasciare emergere la struttura dal tema.

**Comportamento atteso.** Quattro blocchi obbligatori: (1) `new_corporeity` — forma corporea tipica del nuovo atto, osservabile, distinta da altri atti, non ridotta a comportamento isolato; (2) `new_bridge` — passaggio trasformativo ridefinito come trasformazione relazionale osservabile (no formulazioni psicologiche), con distinzione esplicita tra stato iniziale, stato trasformato, forma aperta e forma predeterminata; (3) `new_proxy` — un proxy osservabile, non circolare, testato con test di non-reversibilità, diadico, ancorato alla sequenza dell'interazione; (4) `observability_requirements` e `non_classifiability_rules`.

**⚠ Punti di attenzione.**

- *Errore principale: trasformare il nuovo tema in una variante del tema originario*: la struttura deve emergere dalla fenomenologia specifica del nuovo atto, non essere importata. La corporeità della richiesta di aiuto non è quella del pointing; il bridge non è lo stesso bridge. L'agente tende a replicare la struttura precedente con terminologia adattata — il ricercatore deve verificare che ogni elemento emerga genuinamente dal nuovo tema.

- *Il proxy deve attraversare il test di non-reversibilità prima di procedere*: se il proxy è solo "parzialmente_resistente", il sistema lo dichiara e chiede di trovare il punto non-reversibile — tipicamente spostando il discriminante dalla continuazione diadica (facilmente mimabile dallo scaffolding routinizzato) all'ingresso valutativo vs. ingresso esecutivo dell'adulto, che avviene prima della risposta e non è mimabile dallo script.

**Verifica.** Presente (`verifica.md`). Il feedback tipico identifica tre aree di successo (corporeità come configurazione osservabile, bridge isomorfo, proxy come struttura temporale) e un problema ricorrente: il proxy dipende da informazione sequenziale non sempre osservabile e non supera pienamente il test di non-reversibilità. La verifica prescrive di trovare l'asimmetria strutturale non mimabile dallo script e di promuoverla a cuore del proxy.

**Confine verso f3-step-9.** I quattro blocchi costruiti in questo step sono l'input diretto di f3-step-9. Prima di procedere: il proxy deve essere stabile, il bridge deve distinguere forma aperta da forma predeterminata in modo osservabile, la corporeità deve essere genuinamente specifica del nuovo atto.

---

### f3-step-9 — Dispositivo completo

**Funzione.** Sintetizza operativamente il dispositivo completo per il nuovo tema, integrando tutto ciò che è stato costruito e stabilizzato negli step precedenti (3–8). Non introduce innovazione libera: ogni elemento deve essere derivato, adattato o integrato. È il "punto di verità" del metodo: se il dispositivo regge qui, il trasferimento è riuscito; se collassa, significa che la stabilizzazione non era reale.

**Decisione del ricercatore.** Nessun input esterno necessario. Lo step lavora integralmente su materiale già prodotto.

**Comportamento atteso.** Undici sezioni obbligatorie: identità del dispositivo (con funzione che esplicita spostamento di sguardo e "cieco" colmato nel dominio), struttura di riferimento (core_configuration adattata, assi invariati, nodi con adattamenti dichiarati, bridge_concept nuovo), reading_focus con cinque dimensioni (base corporea, campo intenzionale a quattro stati, co-regolazione a cinque livelli, mediazione simbolica adattata, struttura del passaggio trasformativo con bridge e proxy integrati — con vincolo forte: la dimensione deve essere leggibile senza usare il proxy, che serve solo per classificare il bridge), access_points specifici con possibilità di fallimento, structural_questions, proxy operativo formalizzato (output ammessi: aperto / predeterminato / non_classificabile / ambiguo), requisiti di osservabilità, regole di non-classificabilità (con distinzione obbligatoria non_classificabile vs. ambiguo), interpretive_warnings, non_permitted_transformations, validazione strutturale finale (checklist a cinque punti).

**⚠ Punti di attenzione.**

- *No inferenze, senza eccezioni*: lo step non ammette "il bambino vuole", "l'adulto capisce", "il bambino si aspetta". Solo struttura osservabile. L'agente tende a scivolare verso il linguaggio psicologico quando il tema è relazionale.

- *No normatività*: non introdurre adeguato/inadeguato, migliore/peggiore, autonomia/dipendenza come giudizio. Specialmente per temi come la richiesta di aiuto, il rischio è che il dispositivo diventi implicitamente valutativo sul livello di autonomia del bambino o sull'adeguatezza del caregiver.

- *La dimensione del passaggio trasformativo non usa il proxy per descrivere*: il proxy classifica il bridge, non lo descrive. La dimensione deve essere leggibile strutturalmente senza riferimento al proxy. Questo è un vincolo forte che l'agente viola spesso.

- *Auto-limitazione*: se la validazione strutturale finale dichiara `self_limiting: false`, c'è un problema da correggere prima di procedere.

**Verifica.** Non presente come file separato. La checklist di validazione strutturale finale è la verifica incorporata.

**Confine verso f3-step-10.** Prima di procedere, la checklist di validazione deve avere tutti e cinque i punti soddisfatti. In particolare, `no_circularity` e `self_limiting` sono i più critici.

---

### f3-step-10 — Stress test del dispositivo completo

**Funzione.** Ultima verifica del dispositivo costruito per il nuovo tema: cinque casi critici che testano se il dispositivo legge correttamente configurazioni assenti, parziali, chiudenti e apparenti, se applica correttamente il proxy, se restituisce "non_classificabile" quando mancano dati, e se non produce falsi positivi configurazionali. A differenza di f3-step-2 (che testava il dispositivo di lettura grezzo), questo step testa il dispositivo completo e stabilizzato — il test è quindi più severo e orientato ai rischi specifici del nuovo tema e dominio.

**Decisione del ricercatore.** Input esterno **obbligatorio** (strategico): i casi critici del dominio. I casi costruiti dall'agente in autonomia sono strutturalmente plausibili ma generici. I casi forniti dal ricercatore che conosce il dominio reale sono strutturalmente più forti perché riflettono varianti limite osservate nella pratica, costruiscono ambiguità reali e forzano il dispositivo su casi che la teoria non anticipa. Il ricercatore può fornire i casi come testo narrativo nella richiesta; l'agente li integra nei cinque slot standard. Se nessun caso è fornito, l'agente li costruisce in autonomia ma il test potrebbe non rilevare fragilità specifiche del dominio.

**Comportamento atteso.** Cinque casi obbligatori: configurazione assente, configurazione parziale, configurazione chiudente, configurazione apparente/scripted, caso quasi indistinguibile (ingresso valutativo reale vs. ingresso esecutivo mascherato). Per ogni caso: descrizione, configurazione osservata, applicabilità del proxy, lettura del dispositivo, punto di rottura eventuale, rischio di falsa lettura, esito (il dispositivo regge o fallisce).

**⚠ Punti di attenzione.**

- *Se manca la finestra pre-risposta, l'output deve essere non_classificabile*: questo è un vincolo assoluto legato alla struttura del proxy. Se il proxy richiede l'osservazione dell'ingresso valutativo dell'adulto e questa informazione è assente, il dispositivo non può classificare.

- *Cercare almeno un caso in cui il dispositivo rischia un falso positivo*: il caso di configurazione apparente/scripted è costruito esattamente per questo. Se il dispositivo lo legge come configurazione reale, c'è un problema di discriminazione da dichiarare.

- *Il criterio di successo è composito*: il dispositivo supera il test solo se non classifica quando i dati non bastano, distingue risposta partecipativa da risposta chiudente, distingue ingresso valutativo reale da esecuzione diretta mascherata, dichiara ambiguità quando il proxy non discrimina, e non trasforma il tema in giudizio normativo.

**Verifica.** Non presente come file separato. Il ricercatore valuta l'esito complessivo come giudizio metodologico: il dispositivo è operativamente valido per il dominio dichiarato?

**Confine post-F3.** Al termine di f3-step-10 il dispositivo per il nuovo tema è completo e testato. Il ricercatore decide se: (a) considerare il dispositivo validato e procedere alla sua eventuale formalizzazione per l'uso operativo, (b) identificare fragilità residue che richiedono un'ulteriore iterazione su specifici step, (c) usare questo dispositivo come nuovo "dispositivo sorgente" per un ulteriore trasferimento a un terzo tema, rientrando in F3 a partire da f3-step-7.

---

## Appendice — Errori ricorrenti e come riconoscerli

Questa sezione raccoglie gli errori più frequenti osservati nell'esecuzione della pipeline, indipendentemente dallo step in cui si manifestano.

**L'agente prende tutti i temi invece di quelli selezionati.** Avviene tipicamente in f2-step-2 quando il ricercatore non specifica esplicitamente quale tema portare avanti. Riconoscibile: `results` contiene più temi di quanti il ricercatore intendesse analizzare. Soluzione: rieseguire lo step con indicazione esplicita del tema nel prompt.

**Nodi con id non corrispondenti ai confermati in f2-step-3.** Avviene in f2-step-4 e f2-step-5 quando l'agente riformula i nodi in linguaggio più leggibile. Riconoscibile: i valori in `structural_basis.nodes` non corrispondono esattamente agli `id` in `confirmed_nodes` del file `theme-verification-vN.json`. Soluzione: correggere manualmente i valori prima di procedere allo step successivo, usando il campo `node_interpretation` per contestualizzare.

**Sovra-strutturazione di temi micro.** Avviene in f2-step-2 quando l'agente attiva Asse 2, Asse 3 o Asse 5 per temi circoscritti (gesti, atti puntuali). Riconoscibile: la `selection_rationale` cita questi assi come "plausibili" per un fenomeno che non richiede strutturalmente interiorizzazione, normatività o campo desiderabile. Soluzione: applicare la verifica e declassare o eliminare gli assi non giustificati.

**`output_type` prescrittivi in f2-step-5.** Avviene quando l'agente formula i tipi di output come azioni invece di funzioni. Riconoscibile: `output_type` contiene "come fare", "strategie per", "consigli su". Soluzione: riformulare nella forma vincolata ("lettura configurazionale di…", "analisi della struttura di…").

**Concetti-ponte descrittivi invece di trasformativi.** Avviene in f2-step-2 quando l'agente include ponti che nominano la co-presenza di due assi senza descrivere il processo trasformativo. Riconoscibile: il ponte non risponde a "chi trasforma cosa, attraverso quale processo, con quale esito". Soluzione: riformulare o eliminare.

**Passaggio prematuro da F2 a F3 senza selezione esplicita del tema.** Avviene quando si entra in f3-step-1 senza aver dichiarato quale tema portare avanti e in quale dominio costruire il dispositivo. Riconoscibile: f3-step-7 non riesce a operare perché il vincolo di realtà non è stato definito. Soluzione: tornare al confine F2→F3, scegliere il tema e il dominio applicativo, documentare la scelta prima di procedere.

**Proxy reversibile portato in avanti senza dichiarazione di fragilità.** Avviene in f3-step-6a quando il test di non-reversibilità produce "parzialmente_resistente" e l'agente procede ugualmente senza dichiararlo. Riconoscibile: f3-step-10 non riesce a distinguere configurazione reale da configurazione apparente e il verdetto finale è inattendibile. Soluzione: tornare a f3-step-6a, identificare l'asimmetria strutturale non mimabile dallo script, e promuoverla a cuore del proxy prima di procedere.

**Trasferimento di proxy del tema originario al nuovo tema senza adattamento.** Avviene in f3-step-8 quando l'agente importa struttura e proxy del tema precedente riformulando la terminologia invece di ricostruire a partire dalla fenomenologia del nuovo atto. Riconoscibile: la corporeità del nuovo tema è descritta come variante del tema originario, non come configurazione propria. Soluzione: verificare che ogni elemento del nuovo dispositivo emerga genuinamente dal nuovo tema — non sia un calco adattato.
