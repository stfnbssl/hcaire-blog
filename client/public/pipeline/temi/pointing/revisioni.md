# Revisioni — tema: pointing (dominio clinico)

Questo file documenta le decisioni episodiche emerse durante l'esecuzione della pipeline F3 per il tema pointing. Non contiene criteri strutturali generali (che restano nei verifica.md degli step) ma la storia delle correzioni specifiche a questo tema.

---

## f3-step-2 → f3-step-3 (stress test → correzione strutturale)

Il dispositivo iniziale aveva un proxy basato su **intonazione vocalizzazione** (qualità dell'intonazione vocale nel segnale di pointing). Il test di indistinguibilità ha rivelato che due casi strutturalmente opposti (campo aperto vs. campo chiuso) non erano distinguibili sulla base di quel proxy: entrambi potevano avere intonazione simile.

**Correzione applicata**: sostituzione del proxy con **co-orientamento finale bilaterale vs. chiusura unilaterale** — se entrambi i partecipanti si co-orientano verso l'oggetto nella fase finale [F] della sequenza, o solo uno dei due.

**Problema residuo identificato**: il proxy richiedeva informazione sulla fase finale che le descrizioni testuali cliniche standard non contengono sistematicamente (la fase [F] non è registrata di default). Il dispositivo corretto integra questa fragilità nelle regole di non-classificabilità.

---

## f3-step-6 → f3-step-6-B → f3-step-6-C (stabilizzazione proxy)

Il proxy del co-orientamento bilaterale era **parzialmente resistente**: resisteva al test di indistinguibilità testuale ma restava vulnerabile all'assenza di documentazione della fase [F] nelle osservazioni cliniche reali.

**f3-step-6-B** (forma operativa): il proxy è stato trasformato in forma operativa con condizioni esplicite di applicabilità e non-applicabilità, e con output distinti tra `non_classificabile` (dato assente) e `ambiguo` (dato presente ma non discriminante). Questo è il passaggio concettuale centrale: il dispositivo auto-limitante produce `non_classificabile` invece di classificare forzatamente.

**f3-step-6-C** (integrazione nel dispositivo corretto): il proxy stabilizzato è stato integrato nel file `correzione-strutturale-clinico-v2.json` aggiungendo tre nuovi campi al dispositivo: `observability_requirements`, `non_classifiability_rules`, `operative_proxies`.

**Principio consolidato**: "Il dispositivo non è applicabile se non sono documentate le condizioni minime di osservabilità del proxy decisivo."

---

## Note per iterazioni future

Il dispositivo del pointing è il dispositivo **sorgente** per la costruzione di nuovi dispositivi via F3. Qualsiasi nuovo tema che utilizzi f3-step-7 (trasferibilità) deve fare riferimento a `correzione-strutturale-clinico-v2.json` come dispositivo validato, non a versioni precedenti.

Il limite principale documentato: il proxy richiede documentazione della fase [F] che nelle descrizioni testuali cliniche standard non è presente — il dispositivo produce sistematicamente `non_classificabile` in quei contesti, che è la risposta corretta, non un difetto.

---

## f3-step-7 — Specializzazione dominio clinico (neuropsviluppo, 9-24 mesi)

Eseguito f3-step-7 per la specificazione del dispositivo pointing al dominio clinico specializzato (neuropsviluppo, osservazione precoce caregiver-bambino, 9-24 mesi). Il dispositivo sorgente era già costruito nel dominio clinico generale; lo step ha valutato la specializzazione di contesto.

**Verdetto**: `trasferibile_con_adattamenti` — struttura configurazionale integrale, adattamenti limitati alla gestione delle varianti contestuali del setting clinico.

**Step-8 saltato**: gli adattamenti non richiedono ricostruzione dei blocchi strutturali (corporeità, bridge, proxy rimangono validi). Step-8 serve per nuovi temi, non per specializzazioni di dominio.

**4 adattamenti identificati**:
1. `ncr_5`: pointing sollecitato/routinizzato → proxy non applicabile (la co-orientazione era già pre-strutturata dall'adulto)
2. Warning `uso_diagnostico`: rischio specifico del dominio neuropsviluppo (pointing come red flag per ASD, milestone evolutiva)
3. Access point `setting clinico semi-strutturato`: condizione minima di 10 minuti liberi, documentazione modalità emergenza per ogni episodio
4. Non_permitted_transformation: uso come voce di screening o scala di sviluppo (M-CHAT, CSBS, ecc.)

**Input archiviato in**: `input/produzioni/temi/pointing/f3-step-7-contesto-clinico.json`

---

## f3-step-9 — Dispositivo completo pointing clinico neuropsviluppo

Prodotto `dispositivo-pointing-clinico-neuropsviluppo-v1.json` integrando il dispositivo sorgente con i 4 adattamenti da step-7 e il proxy stabilizzato da step-6B.

**Struttura finale**:
- 5 dimensioni reading_focus (invarianti dal sorgente, con specifiche contestuali per il dominio clinico)
- 5 access points (4 sorgente + 1 nuovo: setting semi-strutturato clinico)
- 5 ncr (4 sorgente + ncr_5 per pointing sollecitato/routinizzato)
- 5 interpretive_warnings (4 sorgente + uso_diagnostico)
- 6 non_permitted_transformations (5 sorgente + uso come screening)
- Proxy `co-orientamento finale bilaterale vs. chiusura unilaterale` nella versione definitiva da step-6B

**Validazione strutturale**: tutti i check passano (logica configurazionale preservata, no inferenze, no circolarità, proxy osservabile, self-limiting).

**File**: `output/produzioni/temi/pointing/dispositivo-pointing-clinico-neuropsviluppo-v1.json`

---

## f3-step-10 — Stress test dispositivo pointing clinico neuropsviluppo

Eseguito stress test su `dispositivo-pointing-clinico-neuropsviluppo-v1.json` con 6 casi (5 categorie standard + caso_5 sdoppiato in 5a/5b per il quasi indistinguibile).

**Verdetto globale**: `robustezza alta` — dispositivo supera lo stress test.

**Risultati per caso**:
- `caso_1` (assente): regge — localizza discontinuità a livello campo, resiste alla riduzione diagnostica
- `caso_2` (parziale): regge — distingue risposta registrativa da partecipativa, ncr_2 si applica correttamente
- `caso_3` (chiudente): regge — rileva risposta chiudente dietro comportamento apparentemente positivo, proxy produce 'predeterminato'
- `caso_4` (scripted/sollecitato): regge — ncr_5 blocca il pointing sollecitato da protocollo CSBS prima del proxy
- `caso_5a` (configurazionale reale): regge — proxy produce 'aperto', triangolazione completa
- `caso_5b` (routinizzato mascherato): `regge_con_riserva` — doppia copertura ncr_5+ncr_2 funziona, ma limite rilevato

**2 correzioni richieste** (non bloccanti, da integrare nel dispositivo):
1. **NCR_5 da articolare in 5a/5b**: distinguere pointing sollecitato (domanda diretta) da pointing in contesto routinizzato (struttura interattiva nota). Entrambi → non_classificabile, ma la distinzione aiuta il clinico nel riconoscimento.
2. **obs_req_4 esteso**: aggiungere 'contesto contestuale dell'episodio' — se il bambino usa materiale già noto dalla storia della relazione con quel setting.

**Natura delle correzioni**: affinamenti di chiarezza operativa, non problemi strutturali. Il dispositivo già copre entrambi i casi attraverso ncr_5 o ncr_2 — le correzioni rendono il percorso più esplicito per il clinico.

**File**: `output/produzioni/temi/pointing/stress-test-pointing-clinico-v1.json`
