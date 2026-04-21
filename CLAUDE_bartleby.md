# CLAUDE_bartleby.md — Architettura e flusso del sistema Bartleby

## Cos'è Bartleby

Bartleby è il motore di generazione di contenuti di HCAIRE. Riceve una **traccia** (un testo di input: una domanda di un genitore, una richiesta istituzionale, una nota clinica) e produce un **output strutturato** coerente con il modello concettuale HCAIRE — senza riduzionismi, senza rassicurazioni banali, senza allarmismi.

Il nome è un riferimento a "Bartleby, lo scrivano" di Melville: un sistema che non copia, non risponde in automatico, ma elabora.

---

## Knowledge Base — struttura dati

La KB è caricata in MongoDB Atlas (`hcaire_db`) via script seed (`npm run seed:bartleby`), a partire da 13 file JSON in `server/src/data/bartleby/seed/`.

### Entità principali

| Collection MongoDB | Modello | Descrizione |
|---|---|---|
| `bartleby_foundation_documents` | `FoundationDocument` | Documenti fondativi del modello HCAIRE (testi sorgente) |
| `bartleby_concept_nodes` | `ConceptNode` | Nodi concettuali trasversali (es. "apertura al campo", "regolazione") |
| `bartleby_domain_areas` | `DomainArea` | Ambiti di applicazione (genitoriale, clinico, politico-istituzionale, educativo…) |
| `bartleby_area_sheets` | `AreaSheet` | Schede operative per ambito (dimensioni prioritarie, rischi di riduzione, indicatori) |
| `bartleby_skills` | `Skill` | Operazioni del motore (riformulazione traccia, analisi multidimensionale, traduzione output…) |
| `bartleby_output_templates` | `OutputTemplate` | Template strutturali per tipo di output (guida genitoriale, policy brief, nota clinica…) |
| `bartleby_input_traces` | `InputTrace` | Tracce di input sottoposte dagli utenti |
| `bartleby_output_documents` | `OutputDocument` | Documenti generati (output finali) |

### Bridge tables (relazioni M:N)

| Collection | Relazione |
|---|---|
| `bartleby_foundation_document_nodes` | FoundationDocument → ConceptNode |
| `bartleby_area_sheet_nodes` | AreaSheet → ConceptNode (nodi prioritari per ambito) |
| `bartleby_skill_nodes` | Skill → ConceptNode (nodi attivati da una skill) |
| `bartleby_skill_areas` | Skill → DomainArea (ambiti in cui opera una skill) |

---

## Il processo di generazione — Moduli A-F

Ogni output Bartleby viene costruito attraverso sei moduli sequenziali. Questo è il **Motore di Traducibilità HCAIRE**, non una risposta diretta alla domanda.

| Modulo | Nome | Operazione |
|---|---|---|
| **A** | Riformulazione della traccia | Identifica il problema reale implicito, i soggetti, le presupposizioni della traccia e il livello richiesto dell'output |
| **B** | Analisi multidimensionale | Mappa le dimensioni presenti e assenti nella traccia (relazione, corpo/regolazione, affettività, mondo storico-culturale, desiderio/campo intenzionale) |
| **C** | Nodi critici | Identifica i rischi di riduzionismo attivi nella traccia (normativo, diagnostico, frammentazione relazionale…) |
| **D** | Integrazione con il modello | Attiva i ConceptNode rilevanti e le AreaSheet pertinenti all'ambito; produce una lettura integrata |
| **E** | Traduzione verso l'output | Sceglie tono, livello linguistico, struttura; produce il testo finale |
| **F** | Verifica qualità | Valuta coerenza con gli assi del modello, punti di forza e limiti, punteggio indicativo |

Le simulazioni complete (Moduli A-F) sono in `server/src/data/bartleby/simulations/`:
- `Simulazione-01-T-G03.md` — traccia genitoriale, output: guida genitoriale
- `Simulazione-02-T-PI01.md` — traccia politico-istituzionale, output: policy brief

---

## Il ruolo di Claude Cowork

**Claude Cowork** è una sessione Claude Projects (`C:\Users\nnmrd\Documents\Claude\Projects\HCAIRE skills`) in cui:
- È caricata come contesto di progetto tutta la KB HCAIRE (documenti fondativi, nodi, schede, skill)
- Il sistema ha "interiorizzato" il Motore di Traducibilità (Moduli A-F)
- Vengono elaborate manualmente le tracce e prodotte le simulazioni

### Come funziona oggi (Fase 1 — manuale)

```
Utente (Stefano) → Claude Cowork
  └─ Fornisce traccia + contesto
  └─ Claude elabora Moduli A-F
  └─ Produce il file .md della simulazione
  └─ Stefano salva in server/src/data/bartleby/simulations/
  └─ npm run seed:bartleby → carica in MongoDB
  └─ Webapp espone l'output su /bartleby/outputs
```

L'"accordo" con Cowork avviene nella sessione Projects: il sistema ha già tutto il modello HCAIRE in contesto, conosce le skill, i nodi, le schede di ambito. La risposta non viene "improvvisata" ma costruita attraverso i moduli, con riferimento esplicito agli strumenti della KB.

### Come funzionerà (Fase 2 — pipeline automatica)

```
Utente webapp
  └─ Compila TraceForm → POST /api/bartleby/traces
  └─ Server salva InputTrace (status: "pending")
  └─ Server pubblica job su Redis queue

Redis (Cloud GCP eu-west3)
  └─ Job in coda: { traceId, userId, outputType, areaId }

Worker locale (da implementare)
  └─ Legge job dalla coda Redis
  └─ Recupera da MongoDB:
      - InputTrace (raw_text, context_notes, target_output_type)
      - AreaSheet dell'ambito richiesto
      - ConceptNodes prioritari dell'ambito
      - Skills pertinenti
      - OutputTemplate per il tipo richiesto
  └─ Costruisce il prompt per Claude API:
      - System: modello HCAIRE + Motore di Traducibilità (Moduli A-F)
      - User: traccia + contesto + KB rilevante (estratta da MongoDB)
  └─ Chiama Claude API (claude-sonnet-4-6 o claude-opus-4-6)
  └─ Claude elabora → produce output strutturato
  └─ Worker parsa la risposta, estrae campi (title, body, activated_nodes, skills_used…)
  └─ POST /api/bartleby/output-documents → salva OutputDocument in MongoDB
  └─ Aggiorna InputTrace status → "completed"

Utente webapp
  └─ GET /api/bartleby/output-documents/mine → lista output personali
  └─ GET /api/bartleby/output-documents/:id → legge output
  └─ DELETE /api/bartleby/output-documents/:id → cancella output
```

La differenza rispetto alla Fase 1: il prompt per Claude API **non** carica tutta la KB, ma solo la porzione rilevante per quella traccia (ambito + nodi + skill pertinenti), estratta da MongoDB. La KB completa rimane in Cowork come riferimento di sviluppo e validazione.

---

## API Endpoints

### Pubblici (nessuna autenticazione)

```
GET  /api/bartleby/concept-nodes
GET  /api/bartleby/concept-nodes/:id
GET  /api/bartleby/domain-areas
GET  /api/bartleby/domain-areas/:id
GET  /api/bartleby/skills
GET  /api/bartleby/skills/:id
GET  /api/bartleby/foundation-documents
GET  /api/bartleby/foundation-documents/:id
GET  /api/bartleby/output-templates
GET  /api/bartleby/output-documents          # lista tutti gli output
GET  /api/bartleby/output-documents/:id      # dettaglio output (con traccia, area, nodi, skill)
```

### Protetti — utente autenticato (Clerk)

```
GET    /api/bartleby/output-documents/mine   # solo i miei output (filtro per user_id)
DELETE /api/bartleby/output-documents/:id    # cancella (solo owner o admin)
```

### Protetti — solo admin

```
POST /api/bartleby/output-documents          # salva nuovo output (chiamato dalla pipeline/worker)
POST /api/bartleby/traces                    # sottomette traccia
GET  /api/bartleby/traces/mine               # le mie tracce
GET  /api/bartleby/logs                      # log pipeline Bartleby (visibili anche in /admin/workflow)
```

### Protetti — API key (`COWORK_API_KEY`, chiamati dal worker)

```
POST /api/bartleby/traces/:id/log            # aggiunge evento al log (step, actor, message, requestStatus)
```

---

## Log pipeline — step e notifiche

Ogni evento della pipeline viene scritto in MongoDB (`workflow-logs`) con `workflow_type: 'bartleby'` e visibile in `/admin/workflow` (tab "Bartleby").

| Step | Actor | Quando | Aggiorna status traccia |
|---|---|---|---|
| `trace_submitted` | `server` | POST /traces ricevuto | `pending` |
| `trace_queued` | `server` | Job pubblicato su Redis | `pending` |
| `worker_started` | `worker` | Worker ha preso il job | `processing` |
| `claude_called` | `worker` | Chiamata Claude API inviata | `processing` |
| `output_saved` | `worker` | OutputDocument salvato in MongoDB | `done` |
| `worker_error` | `worker` | Qualsiasi errore nel worker | `error` |

**Notifica Telegram:** `worker_error` scatena automaticamente un messaggio Telegram all'utente autorizzato (`TELEGRAM_ID`) con traceId, step e messaggio di errore.

Il worker chiama `POST /api/bartleby/traces/:id/log` con API key (`COWORK_API_KEY`) per registrare ogni step. Il campo `:id` è il `bartlebyId` oppure l'`_id` MongoDB della traccia.

## Schema OutputDocument

```typescript
{
  bartlebyId: string;          // ID univoco (es. "od-001")
  input_trace_id: string;      // bartlebyId della InputTrace sorgente
  generation_plan_id?: string; // futuro: id del piano di generazione
  user_id?: string;            // Clerk userId dell'utente che ha richiesto l'output
  output_type: string;         // "guida-genitoriale" | "policy-brief" | "nota-clinico-riflessiva" | …
  title: string;
  body: string;                // testo finale in Markdown
  body_summary?: string;       // riassunto per la lista (card)
  audience: string;            // "genitore" | "clinico" | "decisore-istituzionale" | …
  area_id: string;             // bartlebyId della DomainArea
  activated_nodes: string[];   // bartlebyId dei ConceptNode attivati nel processo
  skills_used: string[];       // bartlebyId delle Skill usate
  evaluation?: {
    score: number | null;      // punteggio qualità (0-10, null = non ancora valutato)
    notes: string;
    status: string;            // "aperta a revisione" | "approvata" | …
  };
  status: string;              // "revisionato" | "bozza" | …
  version: string;             // "1.0"
  created_at?: string;         // data ISO
}
```

---

## Struttura frontend

```
/bartleby                          → BartlebyHome (landing + TraceForm)
/bartleby/knowledge-base           → KnowledgeBase (tabs: nodi / ambiti / skill / fondativi)
/bartleby/knowledge-base/:section/:itemId  → drill-down su singolo elemento
/bartleby/outputs                  → OutputList (tab "Tutti" + "I miei" per utenti autenticati)
/bartleby/outputs/:id              → OutputDetail (corpo Markdown + ProvenancePanel + pulsante Elimina)
```

La navigazione Bartleby è visibile solo ad admin e abbonati Bartleby (`isBartleby || isAdmin`, verificato in `SubscriptionContext`).

---

## Stato implementazione

### Fase 1 — Completata (2026-04-16)
- [x] Modelli Mongoose per tutti gli enti KB
- [x] Script seed idempotente (`npm run seed:bartleby`)
- [x] API pubblica KB + OutputDocuments
- [x] Frontend: BartlebyHome, KnowledgeBase, OutputList, OutputDetail
- [x] TraceForm (submit tracce, solo admin)
- [x] ProvenancePanel (mostra traccia sorgente, ambito, nodi attivati, skill usate)
- [x] OutputDocument: POST (admin), GET /mine (utente), DELETE (owner/admin)
- [x] 2 simulazioni complete seed in MongoDB

### Fase 2 — Da fare
- [ ] Worker Redis: legge job da coda, chiama Claude API, salva OutputDocument
- [ ] Prompt engineering: sistema per costruire il prompt per Claude con KB parziale estratta da MongoDB
- [ ] Gestione stato polling lato client: InputTrace status → "pending" → "processing" → "completed"
- [ ] Abbonamenti Bartleby: attivazione accesso sezione (struttura già in SubscriptionContext)
- [ ] Seed batch 2: `translation_rules`, `user_customization_profiles`, `governance_decisions`, `source_documents`

---

## Note per lo sviluppo

- I JSON seed sono in `server/src/data/bartleby/seed/` — copiati da `C:\Users\nnmrd\Documents\Claude\Projects\HCAIRE skills\Bartleby\data\`
- Le simulazioni .md sono in `server/src/data/bartleby/simulations/` — prodotte manualmente in Claude Cowork
- `instruction_payload` delle Skill è `Schema.Types.Mixed` — contiene JSON strutturato (istruzione operativa per il motore)
- Auth: Clerk ovunque — nessun JWT legacy in questa sezione
- Il pulsante "Elimina" su OutputDetail è visibile solo se `user.publicMetadata.role === 'admin'` oppure `output.user_id === userId`
- La route `GET /output-documents/mine` è dichiarata **prima** di `GET /output-documents/:id` per evitare conflict Express
