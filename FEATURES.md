# HCAIRE Blog — Feature Requests

Questo file traccia le funzionalità pianificate o in valutazione.
Aggiornare lo stato man mano che vengono implementate.

---

## Stato possibili: `idea` | `pianificato` | `in corso` | `completato`

---

## [FEAT-001] Carica articolo da file (import da Cowork)

**Stato**: `completato`
**Priorità**: alta

### Contesto
Gli articoli vengono prodotti con uno strumento esterno chiamato **Cowork**, che genera una cartella per ogni articolo contenente:
- `articolo.md` — testo dell'articolo in formato Markdown
- `metadata.json` — metadati strutturati dell'articolo

### Struttura `metadata.json` attesa
```json
{
  "slug": "nome-articolo",
  "titolo": "Titolo Articolo",
  "descrizione": "Breve descrizione per preview",
  "categoria": "tutorial",
  "tags": ["tag1", "tag2"]
}
```

### Funzionalità richiesta
Aggiungere nella Admin Dashboard un pulsante **"Carica articolo"** affianco al pulsante "Nuovo articolo".

**Flusso utente:**
1. L'utente clicca "Carica articolo"
2. Si apre un file picker per selezionare `articolo.md`
3. Il programma legge il contenuto Markdown del file selezionato
4. Il programma cerca e legge automaticamente `metadata.json` nella stessa cartella (se disponibile)
5. I campi del form (titolo, slug, descrizione, categoria, tags, contenuto) vengono pre-compilati
6. L'utente può rivedere/modificare prima di pubblicare

### Note tecniche
- Il file picker deve accettare solo `.md`
- La lettura di `metadata.json` dalla stessa directory dipende dalla File System Access API (browser moderno) o va gestita con un secondo input file
- Valutare se usare `<input type="file">` classico (due input separati: uno per `.md`, uno per `.json`) oppure la **File System Access API** (`showOpenFilePicker`) per leggere entrambi i file dalla stessa cartella con una sola selezione
- Pre-compilare tutti i campi ma lasciare `isPublished: false` di default per permettere revisione prima della pubblicazione

### Componenti coinvolti
- `client/src/pages/AdminDashboard.tsx` — aggiungere pulsante e logica di import
- Eventuale nuovo componente `client/src/components/ArticleImporter.tsx`
- Nessuna modifica backend necessaria (usa gli endpoint POST esistenti)

## [FEAT-002] Listener Telegram → append traccia articolo su file

**Stato**: `completato`
**Priorità**: alta

### Contesto
Primo step di un workflow Zero-Touch per la gestione del blog.
L'utente invia un testo su Telegram ("seme" dell'articolo); il bot lo appende al file di input di Cowork,
che poi gestirà la generazione autonoma e il push sul blog.

### Flusso
1. Il bot riceve un messaggio di testo su Telegram
2. Verifica che il mittente sia l'utente autorizzato (`TELEGRAM_ID`)
3. Appende al file `COWORK_FILE_ARTICOLO` il blocco:
   ```
   ```
   ===== NUOVO ARTICOLO =====
   ```
   <testo del messaggio>
   ```
4. Risponde su Telegram con "Traccia salvata."

### Decisioni tecniche
- **Append** (non sovrascrittura): permette di accumulare più tracce; la cancellazione avverrà tramite messaggi Telegram separati in future feature
- **Integrazione**: il bot gira nello stesso processo del server Express (avviato in `connectDB().then(...)`)
- **Libreria**: `telegraf`
- **Avvio condizionale**: se una delle tre variabili env mancano, il bot non parte ma il server continua normalmente

### Variabili d'ambiente (server/.env)
```
TELEGRAM_TOKEN=your_telegram_bot_token
TELEGRAM_ID=your_telegram_user_id
COWORK_FILE_ARTICOLO=C:\Users\nnmrd\Documents\Claude\Projects\Articoli per hcaire blog\input_articoli.md
```

### Componenti coinvolti
- `server/src/services/telegramBot.ts` — nuovo servizio bot
- `server/src/index.ts` — import e chiamata `startTelegramBot()` dopo DB connect
- `server/.env.example` — aggiunta variabili Telegram

## [FEAT-003] Trigger generazione articoli via Telegram → Cowork

**Stato**: `completato`
**Priorità**: alta

### Contesto
Secondo step del workflow Zero-Touch. Dopo aver inviato le tracce degli articoli via Telegram (FEAT-002),
l'utente può inviare un comando testuale per avviare la generazione autonoma degli articoli tramite
Claude Code CLI nel progetto Cowork ("Articoli per hcaire blog").

### Flusso
1. L'utente invia su Telegram un messaggio che contiene una parola chiave di generazione
   e la parola "articol*" (es. "genera articoli", "crea articolo", "scrivi gli articoli")
2. Il bot risponde subito: "Generazione avviata... ti avviso quando ho finito."
3. Il server lancia Claude Code CLI in background nella directory del progetto Cowork:
   ```
   claude --print "crea gli articoli descritti in input_articoli.md" --dangerously-skip-permissions
   ```
4. Al termine, il bot risponde su Telegram:
   - Successo: "Articoli generati con successo."
   - Errore: "Errore durante la generazione: <dettaglio>"

### Parole chiave riconosciute
Il comando viene riconosciuto se il messaggio contiene una di queste parole d'azione:
`genera`, `crea`, `scrivi`, `produci` — seguita (entro ~30 caratteri) da `articol*`

I messaggi che non corrispondono al pattern vengono trattati normalmente come tracce (FEAT-002).

### Comportamento post-generazione (configurato in Cowork CLAUDE.md)
Aggiungere al CLAUDE.md del progetto Cowork la seguente sezione:

```markdown
## Post-generazione

Al termine dell'elaborazione di tutti gli articoli in `input_articoli.md`:

1. Crea la cartella `trace articoli creati/` nella directory del progetto se non esiste
2. Salva una copia di `input_articoli.md` in `trace articoli creati/` con nome `YYYY-MM-DD_HH-MM-SS_input.md`
3. Svuota completamente `input_articoli.md` (lascialo vuoto, non eliminarlo)

Esegui questi passi solo se la generazione è completata senza errori critici.
```

### Decisioni tecniche
- **Claude Code CLI**: il server usa `child_process.spawn` per invocare `claude --print` nella cwd del progetto Cowork
- **`--dangerously-skip-permissions`**: necessario per esecuzione non interattiva (nessun prompt di conferma)
- **Risposta asincrona**: il bot conferma l'avvio immediatamente, poi notifica al termine (la generazione può richiedere minuti)
- **Priorità comandi**: il controllo `isGeneraCommand` viene eseguito prima dell'append traccia, così i comandi di generazione non vengono scritti in `input_articoli.md`

### Variabili d'ambiente (server/.env)
```
COWORK_PROJECT_PATH=C:\Users\nnmrd\Documents\Claude\Projects\Articoli per hcaire blog
```

### Componenti coinvolti
- `server/src/services/telegramBot.ts` — aggiunta funzione `isGeneraCommand` e `runCowork`
- `server/.env.example` — aggiunta variabile `COWORK_PROJECT_PATH`

## [FEAT-004] Pubblicazione immediata via Cowork

**Stato**: `completato`
**Priorità**: alta

### Contesto
Terzo step del workflow Zero-Touch. Se l'utente aggiunge "e pubblica" al comando di generazione,
Cowork esegue la pubblicazione automatica degli articoli sul blog tramite API, rendendoli
immediatamente visibili (`isPublished: true`).

### Flusso
1. L'utente invia su Telegram: "genera articoli e pubblica" (o varianti con scrivi/crea/produci)
2. Il bot risponde: "Generazione e pubblicazione avviate... ti avviso quando ho finito."
3. Il server lancia Claude Code CLI con il prompt esteso:
   ```
   claude --print "crea gli articoli descritti in input_articoli.md e pubblicali sul blog" --dangerously-skip-permissions
   ```
4. Cowork genera gli articoli e per ciascuno fa `POST /api/contents/import` con il contenuto
5. Al termine il bot risponde: "Articoli generati e pubblicati con successo."

### Endpoint di import (server)
```
POST /api/contents/import
Authorization: Bearer <COWORK_API_KEY>
Content-Type: application/json

{
  "slug": "nome-articolo",
  "titolo": "Titolo Articolo",
  "descrizione": "Breve descrizione",
  "contenuto": "# Titolo\n\nContenuto markdown...",
  "autore": "stfnbssl",
  "categoria": "tutorial",
  "tags": ["tag1", "tag2"],
  "isPublished": true,
  "isPinned": false
}
```
- Autenticazione tramite API key statica (separata dal JWT della Admin Dashboard)
- Riusa il controller `createContent` esistente

### Istruzioni da aggiungere al CLAUDE.md di Cowork
```markdown
## Pubblicazione articoli sul blog

Quando il prompt contiene "pubblicali sul blog", dopo aver generato ogni articolo
esegui una richiesta HTTP per pubblicarlo:

- **Endpoint**: POST http://localhost:3018/api/contents/import
- **Header**: Authorization: Bearer <valore di COWORK_API_KEY>
- **Body**: JSON con i campi: slug, titolo, descrizione, contenuto, autore, categoria, tags
  - isPublished: true
  - isPinned: false
  - autore: "stfnbssl"

Usa `curl` per la richiesta:
```bash
curl -s -X POST http://localhost:3018/api/contents/import \
  -H "Authorization: Bearer <COWORK_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{ ...json articolo... }'
```

Se la risposta è HTTP 201, la pubblicazione è avvenuta con successo.
Se la risposta è HTTP 400 con "Slug già esistente", l'articolo è già pubblicato — prosegui.
Per altri errori, segnalali nel report finale.
```

### Variabili d'ambiente (server/.env)
```
COWORK_API_KEY=your_random_secret_key
```
Generare con: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Componenti coinvolti
- `server/src/middleware/apiKeyAuth.ts` — nuovo middleware autenticazione API key
- `server/src/routes/content.ts` — aggiunta route `POST /import` con `authenticateApiKey`
- `server/src/services/telegramBot.ts` — aggiunta rilevazione "e pubblica", prompt differenziato
- `server/.env.example` — aggiunta `COWORK_API_KEY`
