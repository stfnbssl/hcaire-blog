import { spawn }         from 'child_process';
import { writeFileSync } from 'fs';
import { join }          from 'path';
import mongoose          from 'mongoose';

// ── Mongoose schemas (locale) ─────────────────────────────────────────────────

const InputTraceSchema = new mongoose.Schema(
  {
    bartlebyId: String,
    user_id: String,
    raw_text: { type: String, required: true },
    context_notes: String,
    target_output_type: String,
    requested_area_id: String,
    status: { type: String, default: 'pending' },
  },
  { collection: 'bartleby_input_traces', timestamps: true }
);

const WorkflowLogSchema = new mongoose.Schema(
  {
    traceId: String, testoPreview: String, workflow_type: String,
    step: String, actor: String, message: String, requestStatus: String,
  },
  { timestamps: true, collection: 'workflow-logs' }
);

const OutputDocumentSchema = new mongoose.Schema(
  {
    bartlebyId: String, input_trace_id: String, user_id: String,
    output_type: String, title: String, body: String, body_summary: String,
    audience: String, area_id: String, activated_nodes: [String],
    skills_used: [String], evaluation: mongoose.Schema.Types.Mixed,
    status: String, version: String, created_at: String,
  },
  { collection: 'bartleby_output_documents' }
);

const InputTrace    = (mongoose.models['BwInputTrace']    as mongoose.Model<mongoose.Document>) ?? mongoose.model('BwInputTrace',    InputTraceSchema);
const WorkflowLog   = (mongoose.models['BwWorkflowLog']   as mongoose.Model<mongoose.Document>) ?? mongoose.model('BwWorkflowLog',   WorkflowLogSchema);
const OutputDocument = (mongoose.models['BwOutputDocument'] as mongoose.Model<mongoose.Document>) ?? mongoose.model('BwOutputDocument', OutputDocumentSchema);

// ── Logging e salvataggio diretti su MongoDB ──────────────────────────────────

function traceFilter(traceId: string) {
  return /^[a-f\d]{24}$/i.test(traceId)
    ? { _id: new mongoose.Types.ObjectId(traceId) }
    : { bartlebyId: traceId };
}

async function logStep(
  traceId: string,
  step: string,
  actor: string,
  message: string,
  requestStatus?: string,
): Promise<void> {
  try {
    const trace = await InputTrace.findOne(traceFilter(traceId))
      .select('raw_text status').lean() as { raw_text?: string; status?: string } | null;

    const raw          = trace?.raw_text ?? '';
    const testoPreview = raw.length > 80 ? raw.slice(0, 80) + '…' : raw;
    const status       = requestStatus ?? trace?.status ?? 'pending';

    await WorkflowLog.create({
      traceId, testoPreview, workflow_type: 'bartleby',
      step, actor, message, requestStatus: status,
    });

    if (requestStatus) {
      await InputTrace.updateOne(traceFilter(traceId), { status: requestStatus });
    }

    console.log(`[BartlebyWorker] [${step}] ${message}`);
  } catch (err) {
    console.error(`[BartlebyWorker] Errore logStep(${step}):`, err);
  }
}

async function saveOutputDocument(doc: Record<string, unknown>): Promise<void> {
  const existing = await OutputDocument.findOne({ bartlebyId: doc.bartlebyId });
  if (existing) throw new Error(`OutputDocument ${doc.bartlebyId} già esistente`);
  await OutputDocument.create(doc);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateOutputId(): string {
  const ts  = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 6);
  return `od-${ts}-${rnd}`;
}

function parseClaudeResponse(text: string): Record<string, unknown> {
  // Prova blocco ```json ... ```
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch { /* continua */ }
  }
  // Prova il primo oggetto JSON ben formato nel testo
  const start = text.indexOf('{');
  const end   = text.lastIndexOf('}');
  if (start !== -1 && end > start) {
    return JSON.parse(text.slice(start, end + 1));
  }
  throw new Error('Impossibile estrarre JSON dalla risposta Claude');
}

// ── Main worker function ──────────────────────────────────────────────────────

export async function processBartlebyTrace(payload: {
  traceId: string;
  userId?: string;
  outputType?: string;
  areaId?: string;
}): Promise<void> {
  const { traceId, userId } = payload;
  console.log(`[BartlebyWorker] Inizio elaborazione traccia ${traceId}`);

  // 1. Carica InputTrace da MongoDB
  let trace: Record<string, unknown> | null;
  try {
    trace = await InputTrace.findOne({
      $or: [
        { _id: traceId.match(/^[a-f\d]{24}$/i) ? new mongoose.Types.ObjectId(traceId) : null },
        { bartlebyId: traceId },
      ],
    }).lean() as Record<string, unknown> | null;

    if (!trace) throw new Error(`InputTrace non trovata: ${traceId}`);
  } catch (err) {
    await logStep(traceId, 'worker_error', 'worker', `Traccia non trovata: ${(err as Error).message}`, 'error');
    return;
  }

  // 2. Scrivi input_bartleby.md nel progetto Cowork
  const projectPath = process.env.BARTLEBY_PROJECT_PATH
    ?? process.env.COWORK_PROJECT_PATH
    ?? process.cwd();

  const inputFile = join(projectPath, 'input_bartleby.md');

  const rawText      = String(trace.raw_text ?? '');
  const contextNotes = trace.context_notes     ? `\n**Note di contesto:** ${trace.context_notes}` : '';
  const outputType   = trace.target_output_type ? `\n**Tipo di output richiesto:** ${trace.target_output_type}` : '';
  const areaHint     = trace.requested_area_id  ? `\n**Ambito preferito:** ${trace.requested_area_id}` : '';

  const fileContent = `# Traccia Bartleby — ${traceId}

## Testo della traccia

${rawText}${contextNotes}${outputType}${areaHint}
`;

  try {
    writeFileSync(inputFile, fileContent, 'utf-8');
    console.log(`[BartlebyWorker] Traccia scritta su ${inputFile}`);
  } catch (err) {
    await logStep(traceId, 'worker_error', 'worker', `Errore scrittura file: ${(err as Error).message}`, 'error');
    return;
  }

  // 3. Prompt per Claude Code
  const prompt = `Leggi la traccia in input_bartleby.md ed elaborala seguendo il Motore di Traducibilità HCAIRE (Moduli A-F).

Produci un singolo oggetto JSON valido con questi campi:
- title (string): titolo dell'output
- output_type (string): es. "guida-genitoriale", "policy-brief", "nota-clinico-riflessiva"
- audience (string): es. "genitore", "clinico", "decisore-istituzionale"
- area_id (string): bartlebyId dell'area DomainArea più pertinente
- body (string): testo completo in Markdown (800-2000 parole)
- body_summary (string): riassunto in 2-3 frasi (max 300 caratteri)
- activated_nodes (array di string): bartlebyId dei ConceptNode attivati
- skills_used (array di string): bartlebyId delle Skill usate
- evaluation (object): { score: number|null, notes: string, status: string }

Rispondi SOLO con il JSON, senza testo aggiuntivo.`;

  // 4. Spawna Claude Code
  await logStep(traceId, 'claude_called', 'worker', 'Claude Code avviato per elaborazione traccia', 'processing');

  await new Promise<void>((resolve) => {
    let stdout = '';
    let stderr = '';

    const proc = spawn('claude', ['--print', '--dangerously-skip-permissions'], {
      shell: true,
      cwd:   projectPath,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    proc.stdin?.write(prompt + '\n');
    proc.stdin?.end();

    proc.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
      process.stdout.write(chunk);
    });
    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
      process.stderr.write(chunk);
    });

    proc.on('close', async (code) => {
      if (code !== 0) {
        const msg = `Claude Code terminato con codice ${code}${stderr ? ': ' + stderr.slice(0, 200) : ''}`;
        await logStep(traceId, 'worker_error', 'worker', msg, 'error');
        resolve();
        return;
      }

      // 5. Parsa risposta JSON
      let parsed: Record<string, unknown>;
      try {
        parsed = parseClaudeResponse(stdout);
      } catch (err) {
        await logStep(traceId, 'worker_error', 'worker', `Errore parsing JSON: ${(err as Error).message}`, 'error');
        console.error('[BartlebyWorker] Output raw (primi 500 chars):', stdout.slice(0, 500));
        resolve();
        return;
      }

      // 6. Salva OutputDocument
      const inputTraceId = (trace!.bartlebyId as string | undefined) ?? traceId;

      const outputDoc = {
        bartlebyId:      generateOutputId(),
        input_trace_id:  inputTraceId,
        user_id:         userId ?? (trace!.user_id as string | undefined),
        output_type:     parsed.output_type  ?? 'output-generico',
        title:           parsed.title        ?? 'Output senza titolo',
        body:            parsed.body         ?? '',
        body_summary:    parsed.body_summary,
        audience:        parsed.audience,
        area_id:         parsed.area_id,
        activated_nodes: Array.isArray(parsed.activated_nodes) ? parsed.activated_nodes : [],
        skills_used:     Array.isArray(parsed.skills_used)     ? parsed.skills_used     : [],
        evaluation:      parsed.evaluation,
        status:          'revisionato',
        version:         '1.0',
        created_at:      new Date().toISOString(),
      };

      try {
        await saveOutputDocument(outputDoc);
        console.log(`[BartlebyWorker] OutputDocument salvato: ${outputDoc.bartlebyId}`);
      } catch (err) {
        await logStep(traceId, 'worker_error', 'worker', `Errore salvataggio output: ${(err as Error).message}`, 'error');
        resolve();
        return;
      }

      await logStep(
        traceId,
        'output_saved',
        'worker',
        `Output "${outputDoc.title}" salvato (${outputDoc.bartlebyId})`,
        'done',
      );

      console.log(`[BartlebyWorker] Completato: ${traceId} → ${outputDoc.bartlebyId}`);
      resolve();
    });

    proc.on('error', async (err) => {
      await logStep(traceId, 'worker_error', 'worker', `Errore spawn: ${err.message}`, 'error');
      resolve();
    });
  });
}
