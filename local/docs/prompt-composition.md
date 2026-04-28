# Composizione del prompt inviato a Cowork

> Documentazione operativa di come il server locale (`local/`) costruisce il prompt che viene poi passato a **Cowork** (Claude Code CLI) per eseguire uno step della pipeline `Sviluppo Bambino`.
>
> Utile per diagnosticare problemi step-specifici (es. `f3_step_9`) capendo **esattamente quale CLAUDE.md viene letto, da dove, e che trasformazioni subisce** prima di finire nel prompt.

---

## 1. Flusso end-to-end (in 5 passi)

```
Backend (Railway)              Local server                    Cowork (Claude Code CLI)
─────────────────              ────────────                    ────────────────────────
LPUSH command su      ──►  PipelineCommandHandler         ──►  spawn `claude --print
hcaire:pipeline:commands     ↓                                 --dangerously-skip-permissions`
                             PromptComposer.compose()           con prompt da stdin
                             ↓
                             CoworkRunner.run()           ──►  scrive output JSON
                             ↓                                 in OUTPUT_ROOT/...
                             PUBLISH eventi su
                             hcaire:pipeline:events
```

I tre blocchi che compongono il prompt finale (`PromptComposer.compose`, `local/src/pipeline/PromptComposer.ts:29`):

1. **CONTESTO INPUT** — file di input elencati con path assoluti, contenuto inline se < 50 KB.
2. **ISTRUZIONI STEP** — il `CLAUDE.md` dello step, **ripulito** (vedi §4).
3. **DIRETTIVA OUTPUT** — nome file e cartella espliciti, ha priorità su qualsiasi path nel CLAUDE.md.

I tre blocchi sono uniti con `\n\n` e passati interi a Cowork via stdin (`CoworkRunner._realRun`, `local/src/pipeline/CoworkRunner.ts:160`).

---

## 2. File coinvolti nel server locale

| File | Ruolo |
|---|---|
| `local/src/pipeline/constants.ts` | Mappa `step_id → cartella` e `step_id → nome CLAUDE.md`; root path su disco |
| `local/src/pipeline/PromptComposer.ts` | Costruzione dei 3 blocchi del prompt + cleanup CLAUDE.md |
| `local/src/pipeline/CoworkRunner.ts` | Spawn di `claude` (CLI), cattura stdout, fallback file output |
| `local/src/pipeline/PipelineCommandHandler.ts` | Loop BRPOP, dispatch comandi, risoluzione path relativi → assoluti |

---

## 3. Da dove viene letto il CLAUDE.md di uno step

Risoluzione effettuata in `PromptComposer._loadAndCleanClaudeMd` (`local/src/pipeline/PromptComposer.ts:96`):

```
claudePath = STEPS_ROOT / STEP_FOLDER_MAP[step_id] / STEP_CLAUDE_FILE_MAP[step_id]
```

Dove:

- **`STEPS_ROOT`** (`constants.ts:7`) = `process.env.PIPELINE_STEPS_ROOT`
  default: `C:/Users/nnmrd/Documents/Claude/Projects/Sviluppo Bambino/input/produzioni`

- **`STEP_FOLDER_MAP`** (`constants.ts:32`) — mapping completo:

  | step_id | cartella |
  |---|---|
  | `f2_step_1` | `f2-step-1-ricerca-temi` |
  | `f2_step_2` | `f2-step-2-rilevanza-strutturale` |
  | `f2_step_3` | `f2-step-3-verifica-strutturale` |
  | `f2_step_4` | `f2-step-4-micro-matrice` |
  | `f2_step_5` | `f2-step-5-output-family` |
  | `f3_step_1` | `f3-step-1-dispositivo-lettura` |
  | `f3_step_2` | `f3-step-2-stress-test` |
  | `f3_step_3` | `f3-step-3-correzione-strutturale` |
  | `f3_step_4` | `f3-step-4-indistinguibilità` |
  | `f3_step_5` | `f3-step-5-audit` |
  | `f3_step_6` / `6b` / `6c` | `f3-step-6-stabilizzazione-proxy` (stessa cartella, file diverso) |
  | `f3_step_7` | `f3-step-7-trasferibilità-dispositivo` |
  | `f3_step_8` | `f3-step-8-adattamento-strutturale` |
  | **`f3_step_9`** | **`f3-step-9-dispositivo-completo`** |
  | `f3_step_10` | `f3-step-10-stress-test-dispositivo` |

- **`STEP_CLAUDE_FILE_MAP`** (`constants.ts:53`) — solo per varianti nella stessa cartella:

  | step_id | nome file |
  |---|---|
  | `f3_step_6` | `CLAUDE.md` |
  | `f3_step_6b` | `CLAUDE-B.md` |
  | `f3_step_6c` | `CLAUDE-C.md` |

  Per tutti gli altri step (compreso `f3_step_9`) il default è **`CLAUDE.md`**.

### Esempio per `f3_step_9`

Il file letto in modalità default (env `PIPELINE_STEPS_ROOT` non override) è:

```
C:/Users/nnmrd/Documents/Claude/Projects/Sviluppo Bambino/input/produzioni/f3-step-9-dispositivo-completo/CLAUDE.md
```

> Per cambiare il contenuto delle istruzioni inviate a Cowork per `f3_step_9`, **il file da editare è quello sopra**, non il sorgente del server. Il server lo rilegge a ogni esecuzione.

### Fallback se il file non esiste

In `_loadAndCleanClaudeMd` (`PromptComposer.ts:108-118`), se il file mappato non esiste **e** il filename mappato non era già `CLAUDE.md`, il composer cade su `<cartella>/CLAUDE.md`. Se anche quello manca, errore esplicito che finisce in `pipeline.step.failed` con `error_source = "sistema"`.

---

## 4. Trasformazioni applicate al CLAUDE.md prima dell'invio

Eseguite in due fasi successive. Sono **silenziose**: nel CLAUDE.md su disco le sezioni rimangono per la lettura umana, ma vengono modificate al volo prima dell'invio.

### Fase A — Inline dello schema di output (`_inlineSchemaSection`, `PromptComposer.ts:135`)

Convenzione: ogni CLAUDE.md degli step F3 da 3 a 10 contiene una sezione

```
### Schema
`<path al file *.schema.json>`
```

dove il path punta a un file accanto al CLAUDE.md (stessa cartella). La pipeline:

1. Estrae il path dalla prima coppia di backtick nella sezione.
2. Tenta di leggerlo nell'ordine: (a) path così com'è (assoluto), (b) `<cartella del CLAUDE.md>/<basename>` (fallback per path relativi o per env diverse).
3. Valida che il contenuto sia JSON ben formato.
4. **Sostituisce l'intera sezione `### Schema`** con un blocco che inlinia lo schema in fenced JSON e dichiara esplicitamente l'obbligo per Cowork di rispettarlo.

Se lo schema **non è leggibile o non è JSON valido** la pipeline alza un errore esplicito (`Schema referenziato dal CLAUDE.md non leggibile o non JSON valido. Tentativi: …`) e l'esecuzione finisce in `pipeline.step.failed` con `error_source = "sistema"`. Questo è intenzionale: meglio fallire qui che lasciare Cowork produrre un output fuori-schema in silenzio.

Step coperti dalla convenzione (verificato): `f3_step_3`, `f3_step_6` (CLAUDE.md → `proxy-stabilization-schema.json`, CLAUDE-B.md → `proxy-operativo-schema.json`), `f3_step_7`, `f3_step_8`, `f3_step_9`, `f3_step_10`. Step senza sezione `### Schema` passano invariati.

> **Importante**: questa fase **deve girare prima** di Fase B, altrimenti la regex dei path Windows distruggerebbe il riferimento allo schema.

### Fase B — Pulizia testuale (`_cleanClaudeMd`, `PromptComposer.ts:180`)

| Trasformazione | Regex / logica | Motivazione |
|---|---|---|
| **Rimozione sezione "Salvataggio"** | `/###\s*(Salvataggio\|SALVATAGGIO\|Output\s*path\|OUTPUT\s*PATH)[\s\S]*?(?=\n###\|\n---\|\n##\|$)/gi` | Il path di output è imposto dal Blocco 3, le istruzioni umane confonderebbero Cowork |
| **Sostituzione path Windows hardcoded** | Backtick + `[A-Z]:\...` → `[path gestito automaticamente dal sistema]` | Evita che Cowork scriva o legga in path manuali. **Non distrugge più i riferimenti a schema** (già consumati in Fase A). |
| **Caso speciale `f3_step_10`** | Sostituisce il blocco `"cases": [...]` con un puntatore al Blocco 1 | I casi reali arrivano via `external_inputs`, non via template |

A monte viene anteposto un header:

```
---
ISTRUZIONI STEP (esecuzione automatica — i file di input sono già elencati sopra)
---
```

---

## 5. Risoluzione path degli input (Blocco 1)

`PipelineCommandHandler._resolveLocalPath` (`local/src/pipeline/PipelineCommandHandler.ts`) traduce i path **relativi** che arrivano dal backend in path **assoluti** sul disco locale, prima di passarli al composer:

| Prefisso del path ricevuto | Risoluzione |
|---|---|
| Già assoluto (`C:\...` o `/...`) | Invariato |
| `inputs/<rest>` | `INPUTS_ROOT/<rest>` (rimuove `inputs/`) |
| `strutturali/<rest>` | `STEPS_ROOT/strutturali/<rest>` |
| qualsiasi altro | `OUTPUT_ROOT/<path>` |

Roots di default (override via env):

- `INPUTS_ROOT` = `PIPELINE_INPUTS_ROOT` ?? `STEPS_ROOT`
- `OUTPUT_ROOT` = `PIPELINE_OUTPUT_ROOT` (default `…/output/produzioni`)
- `PRECOMPILED_AXES_DIR` = `PIPELINE_PRECOMPILED_AXES_DIR` ?? `<dirname(OUTPUT_ROOT)>/assi-strutturali/precompiled`

### Espansione speciale: `assi-strutturali.json`

Gli step F2 dichiarano nel config `inputs_strutturali: ["assi-strutturali.json"]` (singolo file logico) mentre sul disco esistono **6 file separati** `asse_1.json … asse_6.json` in `PRECOMPILED_AXES_DIR`.

Quando `_handleStepRun` incontra un input file con basename `assi-strutturali.json`, sostituisce quell'entry con **6 entry**, una per ogni `asse_N.json` letto da `PRECOMPILED_AXES_DIR` (vedi `_expandPrecompiledAxes`). Il PromptComposer poi inlinea tutti i 6 file (ognuno è ~15 KB, ben sotto la soglia di 50 KB).

Conseguenza utile: nel CLAUDE.md di step 2 la sezione `### JSON precompilati dei sei assi` può continuare a citare la cartella con un path Windows-assoluto in backtick — la regex di cleanup la cancellerà ma Cowork ha già tutti e 6 i file inlined nel Blocco 1.

Se la cartella manca o non contiene file `asse_*.json`, l'esecuzione fallisce con `error_source = "sistema"` e messaggio esplicito.

Per ogni file di input il composer (`_buildInputBlock`, `PromptComposer.ts:36`):

1. Stampa la riga `• [role]  <path assoluto>`.
2. Se il file è ≤ **50 KB** (`INLINE_FILE_THRESHOLD_BYTES`) e parsabile come JSON, **inietta l'intero contenuto** dentro un fence ```` ```json ```` indentato.
3. Altrimenti scrive `(file > 50KB — leggi direttamente dal path)`: Cowork dovrà aprirlo con i suoi tool.

Eventuali `external_inputs` (forniti dal ricercatore) e `dispositivo_sorgente` vengono accodati nello stesso blocco.

---

## 6. Direttiva output (Blocco 3)

`_buildOutputBlock` (`PromptComposer.ts:214`) emette un blocco fisso:

```
---
DIRETTIVA OUTPUT (ha priorità su qualsiasi percorso menzionato sopra)

Salva il risultato con queste specifiche esatte:
• Nome file:  <output_filename>
• Cartella:   <output_dir_abs>
• Formato:    JSON valido, nessun testo prima o dopo il JSON
• Encoding:   UTF-8

Non creare sottocartelle aggiuntive.
Quando hai scritto il file, termina la risposta.
---
```

`output_dir_abs` viene calcolato da `_handleStepRun` (`PipelineCommandHandler.ts:169`):

```
output_dir_abs = isAbsolute(payload.output_dir)
  ? payload.output_dir
  : OUTPUT_ROOT / payload.output_dir
```

Se Cowork salva con un nome che differisce (es. ha sostituito un placeholder `{label}` con un valore reale), `CoworkRunner._findMatchingFile` (`CoworkRunner.ts:94`) tenta un fallback glob trattando `{...}` come `*`, preferendo file con mtime ≥ `startedAt - 5s`.

---

## 7. Variabili d'ambiente rilevanti

Tutte definite in `local/.env` (vedi `local/.env.example`):

| Env | Default | Effetto |
|---|---|---|
| `PIPELINE_STEPS_ROOT` | `…/Sviluppo Bambino/input/produzioni` | Dove vivono i `CLAUDE.md` degli step |
| `PIPELINE_OUTPUT_ROOT` | `…/Sviluppo Bambino/output/produzioni` | Dove Cowork scrive i JSON |
| `PIPELINE_INPUTS_ROOT` | = `STEPS_ROOT` | Risoluzione prefisso `inputs/` |
| `COWORK_SVILUPPO_BAMBINO_PATH` | = `STEPS_ROOT` | `cwd` dello spawn `claude` |
| `PIPELINE_DEFAULT_TIMEOUT_MS` | `300000` (5 min) | Timeout dello spawn |
| `PIPELINE_MOCK_MODE` | `true` | `true` = scrive un file finto, **non** spawna Cowork |

> Con `PIPELINE_MOCK_MODE=true` non viene effettuato nessuno spawn reale: il prompt **viene composto correttamente** ma non raggiunge Cowork. Per verificare il prompt reale per `f3_step_9` si possono aggiungere log in `_realRun` (es. salvataggio del prompt su file temporaneo prima del `stdin.write`).

---

## 8. Quick-check per diagnosticare uno step (es. `f3_step_9`)

1. **Verifica esistenza CLAUDE.md**:
   `…/input/produzioni/f3-step-9-dispositivo-completo/CLAUDE.md` esiste?
2. **Verifica esistenza dello schema** (se lo step ha sezione `### Schema`): il file `*.schema.json` referenziato è presente nella stessa cartella del CLAUDE.md ed è JSON valido? Se no → `pipeline.step.failed` con `error_source = "sistema"`.
3. **Leggi il CLAUDE.md**: contiene una sezione `### Salvataggio` o `### Output path`? Sì → verrà rimossa. La rimozione consuma fino al successivo `###`/`##`/`---` o EOF, **attenzione a sezioni separator-less**.
4. **Path Windows non in backtick**: la regex sostituisce solo path tra backtick. Path scritti in chiaro (es. nel mezzo di una frase) **passano intatti** e possono confondere Cowork. Riferimenti allo schema in backtick sono safe perché consumati in Fase A.
5. **Input file inline**: se il backend invia un file > 50 KB, il contenuto **non** viene iniettato. Cowork deve poterlo aprire dal path → l'env `COWORK_SVILUPPO_BAMBINO_PATH` (cwd) deve permetterlo.
6. **Output filename con `{placeholder}`**: il fallback glob li traduce in `*`. Se il file non viene trovato neppure così, errore `Cowork non ha prodotto un file matchando "..."`.
7. **Mock mode**: per testare la pipeline reale serve `PIPELINE_MOCK_MODE=false` in `local/.env`.

---

## 9. Convenzione: schema di output accanto al CLAUDE.md

Per ogni step F3 che produce JSON strutturato il CLAUDE.md include una sezione:

```
### Schema
`<path>/<nome-schema>.json`
```

**Regole della convenzione**:

- Il file schema deve vivere **nella stessa cartella del CLAUDE.md** (la pipeline, in fallback, lo cerca lì usando il `basename` del path referenziato).
- Il file deve essere **JSON ben formato** (validato con `JSON.parse`).
- Il path nel CLAUDE.md può essere assoluto Windows in backtick (per leggibilità umana fuori dalla pipeline) — la pipeline lo consuma e sostituisce con lo schema inlined prima del cleanup.
- Lo schema viene **sempre inlinato in toto**, indipendentemente dalla dimensione (a differenza degli `input_files` che hanno la soglia di 50 KB).

**Mappa schema → step** (verificato 2026-04-27):

| step_id | file schema |
|---|---|
| `f3_step_3` | `structural-correction-schema.json` |
| `f3_step_6` | `proxy-stabilization-schema.json` |
| `f3_step_6b` | `proxy-operativo-schema.json` |
| `f3_step_7` | `transferability-schema.json` |
| `f3_step_8` | `structural-adaptation-schema.json` |
| `f3_step_9` | `complete-device-schema.json` |
| `f3_step_10` | `stress-test-device-schema.json` |

> Per modificare lo schema atteso da Cowork per uno step basta editare il file `*.schema.json` nella cartella dello step. Il server lo rilegge a ogni run.

---

## 10. Dove guardare per modificare il comportamento

| Modifica desiderata | File |
|---|---|
| Cambiare le istruzioni inviate a Cowork per uno step | Il `CLAUDE.md` su disco in `STEPS_ROOT/<cartella step>/` |
| Cambiare lo schema di output di uno step | Il file `*.schema.json` accanto al CLAUDE.md |
| Aggiungere/rimuovere uno step dal mapping | `local/src/pipeline/constants.ts` (`STEP_FOLDER_MAP`) |
| Cambiare le regole di cleanup del CLAUDE.md | `local/src/pipeline/PromptComposer.ts` (`_cleanClaudeMd`) |
| Cambiare la logica di inlining schema | `local/src/pipeline/PromptComposer.ts` (`_inlineSchemaSection`) |
| Cambiare la soglia di inlining file di input | `INLINE_FILE_THRESHOLD_BYTES` in `constants.ts` |
| Cambiare l'invocazione della CLI Cowork | `CoworkRunner._buildCoworkArgs` (`CoworkRunner.ts:258`) |
| Cambiare la convenzione di risoluzione path input | `PipelineCommandHandler._resolveLocalPath` |
