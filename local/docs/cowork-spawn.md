# Lancio di Cowork da uno step della pipeline "Produzioni Sviluppo Bambino"

> Documentazione operativa di **come e dove** viene avviato Cowork (Claude Code CLI) quando il ricercatore preme "Lancia" su uno step della pipeline F2/F3 sul frontend.
>
> Complementare a [`prompt-composition.md`](./prompt-composition.md), che descrive cosa finisce nel prompt; questo file descrive **il trasporto del comando** e il **processo Cowork** vero e proprio (eseguibile, argomenti, working directory, stdio).

---

## 1. Architettura a due processi

Il backend Express su Railway **non spawna mai Cowork**: pubblica un comando su Redis e attende eventi. Lo spawn vero avviene nel processo `local/` in esecuzione sulla macchina dell'utente.

```
┌──────────────────────┐        Redis Cloud (eu-west3)        ┌──────────────────────┐
│  Backend (Railway)   │   LPUSH hcaire:pipeline:commands     │  Local agent         │
│  server/             │ ───────────────────────────────────► │  local/              │
│  Express + Mongo     │                                      │  BRPOP + spawn       │
│                      │ ◄─────────────────────────────────── │                      │
└──────────────────────┘   PUBLISH hcaire:pipeline:events     └──────────┬───────────┘
                                                                         │ child_process.spawn
                                                                         ▼
                                                              ┌──────────────────────┐
                                                              │  claude (Cowork CLI) │
                                                              │  cwd =               │
                                                              │  COWORK_PROJECT_PATH │
                                                              └──────────────────────┘
```

Conseguenze pratiche:

- Se `local/` non è in esecuzione, lo step resta in `in_coda` finché il watchdog del backend non lo fallisce per timeout (default `PIPELINE_DEFAULT_TIMEOUT_MS + PIPELINE_WATCHDOG_GRACE_MS`, vedi `server/src/services/pipelineEventSubscriber.ts:16-18`).
- Il backend **non conosce il filesystem locale**: tutti i path inviati nel comando sono **relativi**; è `local/` a risolverli rispetto a `STEPS_ROOT`/`OUTPUT_ROOT`/`INPUTS_ROOT` (vedi `server/src/controllers/pipelineController.ts:248-263`).

---

## 2. Lato backend — dal click al LPUSH

### 2.1 Endpoint REST

`POST /api/pipeline/temi/:temaId/steps/:stepId/run` (per i temi F2/F3) e l'analogo per le ricerche → handler `runStep` in `server/src/controllers/pipelineController.ts:299`.

### 2.2 Sequenza dentro `runStep`

1. Carica `PipelineContext` (`temaId`) e `getStepConfigById(stepId)` (legge `server/pipeline-step-config.json`).
2. Verifica enablement con `evaluateStepEnablement` — dipendenze pipeline, input esterni, decisioni pendenti.
3. Calcola `runNumber = (last.run_number ?? 0) + 1`.
4. `buildExecutionPlan` (`pipelineController.ts:236`) costruisce:
   - `inputFiles[]`: file di input pipeline (`output_file` degli step a monte) + file strutturali sotto `strutturali/...` + opzionale `dispositivo-sorgente`.
   - `externalInputs[]`: input forniti dal ricercatore — viaggiano **come dato JSON inline**, non come file path (i file generati lato Railway non sono raggiungibili da Cowork).
   - `outputFilenameRel` / `outputDirAbs` / `outputFilenameOnly`: ricavati dal template `output_path_template` con sostituzione di `{tema_id}`, `{ricerca_id}`, `{label}`, `{N}`, `{N+1}`.
   - `promptFile = "<step_id>/CLAUDE.md"` (riferimento simbolico — risolto poi dal local).
5. Crea il documento `PipelineStepExecution` con `status: 'in_coda'` e aggiorna `step_states.{step_id}` su `PipelineContext`.
6. **`bus.sendStepRun(...)`** → `LPUSH` su `hcaire:pipeline:commands` (`server/src/services/messageBus.ts:102`). Restituisce `202 Accepted` con `execution_id`.

### 2.3 Forma del messaggio sul Redis

Channel: `hcaire:pipeline:commands` (lista, `LPUSH`/`BRPOP`). Override via `REDIS_PIPELINE_COMMANDS_KEY`.

```jsonc
{
  "type": "pipeline.step.run",
  "message_id": "<uuid>",
  "timestamp": "2026-05-07T10:30:00.000Z",
  "execution_id": "<ObjectId stringa>",
  "context_id": "tema-...",
  "step_id": "f2_step_3",
  "run_number": 4,
  "payload": {
    "prompt_file": "f2_step_3/CLAUDE.md",
    "input_files": [
      { "role": "theme-relevance",   "path": "ricerche/<id>/theme-relevance-v3.json" },
      { "role": "node-verification", "path": "ricerche/<id>/node-verification-v1.json" },
      { "role": "strutturale",       "path": "strutturali/assi-strutturali.json" }
    ],
    "external_inputs": [],
    "output_dir": "ricerche/<id>",
    "output_filename": "theme-verification-v4.json",
    "extra_params": {},
    "timeout_ms": 600000,
    "verifica_required": false
  }
}
```

I tipi di messaggio gestiti sono `pipeline.step.run`, `pipeline.step.cancel`, `pipeline.step.ping` (vedi `messageBus.ts:14-17`).

---

## 3. Lato local — dal BRPOP allo `spawn`

Il processo `local/` (entrypoint `local/src/index.ts`) avvia tre subscriber:

- `article:new` / `bartleby:trace:new` → coworker articoli/Bartleby (non oggetto di questo doc).
- `PipelineCommandHandler` → pipeline **Sviluppo Bambino** (`local/src/index.ts:142-143`).
- `LettureCommandHandler` → pipeline Letture (parallela, stessi pattern).

### 3.1 BRPOP loop

`PipelineCommandHandler.start()` (`local/src/pipeline/PipelineCommandHandler.ts:78`) avvia un loop fire-and-forget che fa `BRPOP hcaire:pipeline:commands 0` su una **connessione Redis dedicata** (BRPOP è bloccante — non si può condividere col client che fa PUBLISH). Per ogni messaggio dispatcha a `_handleStepRun` / `_handleStepCancel` / `_handlePing`.

### 3.2 `_handleStepRun` — preparazione

`PipelineCommandHandler.ts:136-256`:

1. **Dedup** sull'`execution_id` (mappa `activeExecutions`).
2. **Pre-flight Mongo**: rilegge il documento `pipeline_step_executions`. Se lo status non è più `in_coda` (es. l'utente ha annullato mentre il messaggio era in coda), il comando viene ignorato senza spawn.
3. **Risoluzione path** dei file di input: `_resolveLocalPath` (`PipelineCommandHandler.ts:415`) mappa i path relativi del comando ai root locali:
   - assoluto → invariato
   - `inputs/...` → `INPUTS_ROOT + <resto>` (rimuovendo `inputs/` perché su disco la struttura non lo include)
   - `strutturali/...` → `STEPS_ROOT/strutturali/...`
   - altrimenti → `OUTPUT_ROOT/<path>`
4. **Espansione assi precompilati**: se un input punta a `assi-strutturali.json`, viene sostituito dai 6 file `asse_1.json … asse_6.json` letti da `PRECOMPILED_AXES_DIR` (`PipelineCommandHandler.ts:389`).
5. **Composizione prompt** via `PromptComposer.compose(...)` — vedi `prompt-composition.md` per i dettagli.
6. **Costruzione del runner**:
   ```ts
   new CoworkRunner({
     execution_id, step_id,
     prompt,                     // stringa unica composta dai 3 blocchi
     output_dir_abs,             // assoluto, già risolto
     output_filename,
     timeout_ms: payload.timeout_ms ?? DEFAULT_TIMEOUT_MS,
     onLog: (text, level) => publish('pipeline.step.log', { text, level }),
   });
   ```
7. **PUBLISH `pipeline.step.started`** + log riepilogo parametri ricevuti (`_logInputSummary`).
8. `runner.run()` → spawn vero.

### 3.3 Lo spawn — comando, argomenti, cwd

Tutto il dettaglio dello spawn vive in `local/src/pipeline/CoworkRunner.ts`.

**Comando e argomenti** (`CoworkRunner.ts:260-267`):

```ts
{
  command: 'claude',
  params: ['--print', '--dangerously-skip-permissions'],
  cwd:    COWORK_PROJECT_PATH,
  env:    {},   // poi mergiato con process.env in spawn()
}
```

- `claude` è la CLI di Claude Code installata sul sistema (Cowork); risolta via `PATH`.
- `--print` = output non-interattivo, stampa il risultato e termina.
- `--dangerously-skip-permissions` = nessun prompt di permessi (richiesto perché il processo è non-interattivo e deve scrivere file nella sua working directory).

**Working directory** (`local/src/pipeline/constants.ts:25-28`):

```ts
COWORK_PROJECT_PATH =
     process.env.COWORK_SVILUPPO_BAMBINO_PATH
  ?? process.env.COWORK_PROJECT_PATH
  ?? STEPS_ROOT;
```

Catena di fallback (la prima env var definita vince):

| Env var | Default `.env.example` |
|---|---|
| `COWORK_SVILUPPO_BAMBINO_PATH` | `C:\Users\nnmrd\Documents\Claude\Projects\Sviluppo Bambino` |
| `COWORK_PROJECT_PATH` | `C:\Users\nnmrd\Documents\Claude\Projects\Articoli per hcaire blog` *(non per la pipeline)* |
| `STEPS_ROOT` (fallback finale) | `C:\Users\nnmrd\Documents\Claude\Projects\Sviluppo Bambino\input\produzioni` |

In configurazione standard la **cwd di Cowork è quindi `…\Sviluppo Bambino`** (la radice del progetto Cowork), non `input\produzioni`. Questo è importante perché:
- Il `CLAUDE.md` di progetto che Cowork legge automaticamente è quello in `…\Sviluppo Bambino\CLAUDE.md`.
- I path scritti dentro i CLAUDE.md degli step sono relativi a questa radice.
- Gli output, invece, vengono scritti in `output_dir_abs` (path **assoluto** già risolto sotto `OUTPUT_ROOT = …\Sviluppo Bambino\output\produzioni`), quindi la cwd non influenza la destinazione finale dell'output.

**Forma di `spawn`** (`CoworkRunner.ts:175-187`): differenziata per piattaforma per via di un cap di Node 20+:

- **Windows**: `shell: true` + comando concatenato come stringa singola (`claude --print --dangerously-skip-permissions`). Necessario per risolvere `claude.cmd` in `PATH`; `shell: true` con `params` come array genera `DEP0190`.
- **POSIX**: `shell: false`, `params` come array, normale.

**stdio**: `['pipe', 'pipe', 'pipe']`. Il prompt composto viene scritto sullo stdin e poi `stdin.end()` (`CoworkRunner.ts:189-190`).

**Env**: `{ ...process.env, ...args.env }` (`CoworkRunner.ts:181, 186`). `args.env` è attualmente `{}`: Cowork eredita tutto l'ambiente del processo `local/`, inclusi eventuali `ANTHROPIC_API_KEY`, `PATH`, ecc.

### 3.4 Cattura output e timeout

- **stdout**: doppia lettura — un listener su `data` per contare i byte, e un `readline.createInterface` per emettere ogni riga come evento `pipeline.step.log` (`CoworkRunner.ts:205-216`).
- **stderr**: bufferizzato e ribattuto come log livello `warn`; gli ultimi 500 caratteri finiscono nel messaggio di errore se l'exit code è ≠ 0 (`CoworkRunner.ts:218-222, 246`).
- **Heartbeat ogni 20 s**: `Cowork in esecuzione da Ns — ricevuti X log line, Y byte` (`CoworkRunner.ts:197-203`). Serve a far capire al frontend che il processo è vivo durante step lunghi senza output intermedio.
- **Timeout**: `setTimeout(..., timeout_ms)`. Allo scadere, `_killProcess` invia `SIGTERM` e dopo 3 s `SIGKILL` (`CoworkRunner.ts:269-283`).

### 3.5 Recupero del file di output

Dopo il `close` di Cowork (`CoworkRunner.ts:38-92`):

1. Cerca il file esatto a `output_dir_abs/output_filename`.
2. Se non c'è, attiva un **fallback glob**: il `output_filename` può contenere placeholder tipo `{label}` che Cowork ha sostituito con valori reali; `_findMatchingFile` (`CoworkRunner.ts:96-129`) trasforma i `{...}` in `*`, costruisce una regex e prende il file più recente con `mtime ≥ start - 5s`. Logga warn.
3. Legge e **valida JSON** del contenuto (errore se non è JSON valido).
4. Calcola `output_file_relative = relative(OUTPUT_ROOT, actualPath)` con separatori `/`.
5. Pubblica `pipeline.step.completed` con `output_file`, `output_file_relative`, `output_data` (parsed) e `verifica_required`.

### 3.6 Eventi pubblicati

Channel: `hcaire:pipeline:events` (PUBLISH/SUBSCRIBE). Override via `REDIS_PIPELINE_EVENTS_CHANNEL`.

| Evento | Quando |
|---|---|
| `pipeline.step.started` | dopo che il runner è creato e inserito in `activeExecutions` |
| `pipeline.step.log` | per ogni riga stdout / stderr non vuota + heartbeat + riepilogo input |
| `pipeline.step.completed` | exit `0` + file output letto e parsato |
| `pipeline.step.failed` | exit ≠ 0, timeout, errore composizione prompt, errore filesystem (`error_source` ∈ `cowork`/`sistema`/`timeout`) |
| `pipeline.step.cancelled` | dopo `pipeline.step.cancel` ricevuto e `runner.cancel()` |
| `pipeline.step.pong` | risposta a `pipeline.step.ping` (uptime + active executions) |

Il subscriber backend è `server/src/services/pipelineEventSubscriber.ts`: aggiorna `PipelineStepExecution` e `PipelineContext` su Mongo (con throttling dei log: flush a 20 righe o 2 s, vedi `pipelineEventSubscriber.ts:27-28`).

---

## 4. Mock mode

`PIPELINE_MOCK_MODE=true` (default in `.env.example`) → `CoworkRunner._mockRun` (`CoworkRunner.ts:138-158`):

- Nessun `spawn`. La CLI `claude` non è richiesta.
- 4 righe di log fittizie con delay 300 ms.
- Scrive un file JSON segnaposto a `expectedOutputPath` con `generated_by: 'CoworkRunner-mock'`.
- Il resto del flusso (parsing JSON, evento `completed`, scrittura Mongo) è **identico** a quello reale.

Si usa per testare end-to-end Redis/Mongo/UI senza dipendere da Cowork.

---

## 5. Variabili d'ambiente rilevanti

| Var | Default | Effetto |
|---|---|---|
| `COWORK_SVILUPPO_BAMBINO_PATH` | — | **cwd** dello spawn (vince su `COWORK_PROJECT_PATH` e `STEPS_ROOT`) |
| `COWORK_PROJECT_PATH` | — | cwd fallback (originariamente per articoli) |
| `PIPELINE_STEPS_ROOT` | `…\input\produzioni` | radice dei `<step_id>/CLAUDE.md` e degli input strutturali |
| `PIPELINE_OUTPUT_ROOT` | `…\output\produzioni` | radice dove vengono scritti i JSON di output |
| `PIPELINE_INPUTS_ROOT` | `= STEPS_ROOT` | radice degli input esterni |
| `PIPELINE_PRECOMPILED_AXES_DIR` | `…\output\assi-strutturali\precompiled` | espansione `assi-strutturali.json` → 6 file |
| `PIPELINE_DEFAULT_TIMEOUT_MS` | `600000` (5 min) | timeout dello spawn se il comando non lo specifica |
| `PIPELINE_MOCK_MODE` | `true` | salta lo spawn, scrive file segnaposto |
| `REDIS_PIPELINE_COMMANDS_KEY` | `hcaire:pipeline:commands` | lista LPUSH/BRPOP |
| `REDIS_PIPELINE_EVENTS_CHANNEL` | `hcaire:pipeline:events` | channel PUBLISH/SUBSCRIBE |

Anche lato server c'è una propria copia delle prime due env (`messageBus.ts:9-10`); devono coincidere altrimenti messaggi e eventi finiscono su channel diversi.

---

## 6. Punti di ingresso codice (riassunto)

| Cosa | File:linea |
|---|---|
| Endpoint REST `runStep` | `server/src/controllers/pipelineController.ts:299` |
| Costruzione execution plan | `server/src/controllers/pipelineController.ts:236` |
| LPUSH del comando | `server/src/services/messageBus.ts:102` |
| Subscriber eventi (lato Mongo) | `server/src/services/pipelineEventSubscriber.ts:269` |
| BRPOP loop e dispatch | `local/src/pipeline/PipelineCommandHandler.ts:78,121` |
| `_handleStepRun` (preparazione) | `local/src/pipeline/PipelineCommandHandler.ts:136` |
| Resolver path locali | `local/src/pipeline/PipelineCommandHandler.ts:415` |
| Composizione prompt | `local/src/pipeline/PromptComposer.ts:29` |
| Spawn di `claude` | `local/src/pipeline/CoworkRunner.ts:162` |
| Argomenti CLI + cwd | `local/src/pipeline/CoworkRunner.ts:260` |
| Mock mode | `local/src/pipeline/CoworkRunner.ts:138` |
| Costanti / env mapping | `local/src/pipeline/constants.ts` |
