import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
  deleteOpera,
  getOperaAdmin,
  runStep,
  updateOpera,
  type UpdateOperaInput,
} from '../services/lettureService';
import {
  isStepEnabled,
  isStepActive,
  operaHasActiveStep,
  LETTURE_INVALIDATION_MAP,
  LETTURE_PREREQUISITES,
  LETTURE_STATI,
  LETTURE_STEP_LABELS,
  LETTURE_TIPOLOGIE,
  type LettureStepId,
  type Opera,
  type OperaStato,
  type OperaStepStato,
  type OperaTipologia,
} from '../types/letture';
import LettureOutputModal from '../components/letture/LettureOutputModal';
import { hasLettureViewer } from '../components/letture/LettureOutputViewer';

const POLLING_INTERVAL_MS = 2000;

const STEPS_ANALITICA: LettureStepId[] = ['step_1', 'step_2', 'step_3', 'step_4'];
const STEPS_EDITORIALE: LettureStepId[] = ['step_5a', 'step_5b', 'step_5c', 'step_5d', 'step_5e', 'step_5f'];

export default function AdminLetturaDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { getToken } = useAuth();

  const [opera, setOpera] = useState<Opera | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patchPending, setPatchPending] = useState(false);
  const [runningStep, setRunningStep] = useState<LettureStepId | null>(null);
  const [cascadeStep, setCascadeStep] = useState<LettureStepId | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Set<LettureStepId>>(new Set());
  const [outputStep, setOutputStep] = useState<LettureStepId | null>(null);

  const fetchOpera = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error('Token Clerk non disponibile');
      const o = await getOperaAdmin(token, slug);
      setOpera(o);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [getToken, slug]);

  // Caricamento iniziale
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void (async () => {
      await fetchOpera();
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [fetchOpera]);

  // Polling: attivo solo se almeno uno step è in_coda/in_esecuzione.
  const hasActive = useMemo(() => {
    return opera ? operaHasActiveStep(opera.pipeline) : false;
  }, [opera]);

  const fetchRef = useRef(fetchOpera);
  useEffect(() => { fetchRef.current = fetchOpera; }, [fetchOpera]);

  useEffect(() => {
    if (!hasActive) return;
    const t = setInterval(() => { void fetchRef.current(); }, POLLING_INTERVAL_MS);
    return () => clearInterval(t);
  }, [hasActive]);

  const handlePatch = useCallback(async (patch: UpdateOperaInput) => {
    setPatchPending(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token Clerk non disponibile');
      const o = await updateOpera(token, slug, patch);
      setOpera(o);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPatchPending(false);
    }
  }, [getToken, slug]);

  const handleRun = useCallback(async (stepId: LettureStepId) => {
    setRunningStep(stepId);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token Clerk non disponibile');
      await runStep(token, slug, stepId);
      await fetchOpera();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRunningStep(null);
      setCascadeStep(null);
    }
  }, [getToken, slug, fetchOpera]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm(`Eliminare definitivamente l'opera "${opera?.titolo}"?`)) return;
    try {
      const token = await getToken();
      if (!token) throw new Error('Token Clerk non disponibile');
      await deleteOpera(token, slug);
      window.location.href = '/admin/letture';
    } catch (e) {
      setError((e as Error).message);
    }
  }, [getToken, slug, opera]);

  function toggleLog(stepId: LettureStepId) {
    setExpandedLogs((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId); else next.add(stepId);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400" />
      </div>
    );
  }
  if (!opera) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600 mb-4">Opera non trovata.</p>
        <Link to="/admin/letture" className="text-emerald-700 underline text-sm">← Torna all'elenco</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/admin/letture" className="text-sm text-slate-500 hover:text-slate-700">← Torna all'elenco</Link>

      <Header opera={opera} onPatch={handlePatch} patchPending={patchPending} onDelete={handleDelete} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md px-4 py-3 my-4 text-sm">
          {error}
        </div>
      )}

      {hasActive && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-md px-4 py-2 mb-4 text-xs flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Pipeline in esecuzione — aggiornamento automatico ogni {POLLING_INTERVAL_MS / 1000}s.
        </div>
      )}

      <PipelinePanel
        title="Pipeline analitica (step 1–4)"
        opera={opera}
        steps={STEPS_ANALITICA}
        runningStep={runningStep}
        expandedLogs={expandedLogs}
        onRun={handleRun}
        onAskRerun={(s) => setCascadeStep(s)}
        onToggleLog={toggleLog}
        onViewOutput={(s) => setOutputStep(s)}
      />

      <PipelinePanel
        title="Pipeline editoriale (step 5A–5F)"
        opera={opera}
        steps={STEPS_EDITORIALE}
        runningStep={runningStep}
        expandedLogs={expandedLogs}
        onRun={handleRun}
        onAskRerun={(s) => setCascadeStep(s)}
        onToggleLog={toggleLog}
        onViewOutput={(s) => setOutputStep(s)}
      />

      <TextiPanel opera={opera} />

      {cascadeStep && (
        <CascadeModal
          stepId={cascadeStep}
          opera={opera}
          onCancel={() => setCascadeStep(null)}
          onConfirm={() => void handleRun(cascadeStep)}
          loading={runningStep === cascadeStep}
        />
      )}

      {outputStep && (
        <LettureOutputModal
          stepId={outputStep}
          stepLabel={LETTURE_STEP_LABELS[outputStep]}
          data={opera.pipeline[outputStep].output}
          onClose={() => setOutputStep(null)}
        />
      )}
    </div>
  );
}

// ---------- Header ----------

function Header({
  opera, onPatch, patchPending, onDelete,
}: {
  opera: Opera;
  onPatch: (patch: UpdateOperaInput) => void;
  patchPending: boolean;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mt-3 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{opera.titolo}</h1>
          <p className="text-slate-600 mt-0.5">{opera.autore}{opera.anno ? ` · ${opera.anno}` : ''}</p>
          <p className="text-xs text-slate-400 font-mono mt-1">{opera.slug}</p>
        </div>
        <button
          onClick={onDelete}
          className="text-xs text-red-600 hover:text-red-800 hover:underline"
        >
          Elimina opera
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
        <InlineField label="Stato">
          <select
            value={opera.stato}
            disabled={patchPending}
            onChange={(e) => onPatch({ stato: e.target.value as OperaStato })}
            className="text-sm border border-slate-300 rounded px-2 py-1 bg-white"
          >
            {LETTURE_STATI.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </InlineField>
        <InlineField label="Priorità">
          <select
            value={opera.priorita ?? ''}
            disabled={patchPending}
            onChange={(e) => onPatch({ priorita: e.target.value ? parseInt(e.target.value, 10) : null })}
            className="text-sm border border-slate-300 rounded px-2 py-1 bg-white"
          >
            <option value="">—</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </InlineField>
        <InlineField label="Tipologia">
          <select
            value={opera.tipologia}
            disabled={patchPending}
            onChange={(e) => onPatch({ tipologia: e.target.value as OperaTipologia })}
            className="text-sm border border-slate-300 rounded px-2 py-1 bg-white"
          >
            {LETTURE_TIPOLOGIE.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </InlineField>
        <InlineField label="Lingua orig.">
          <span className="text-sm text-slate-700">{opera.lingua_originale ?? '—'}</span>
        </InlineField>
      </div>

      {opera.note_di_ingresso && (
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-slate-600 font-medium">Note di ingresso</summary>
          <p className="mt-2 text-slate-700 whitespace-pre-wrap">{opera.note_di_ingresso}</p>
        </details>
      )}
    </div>
  );
}

function InlineField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</div>
      {children}
    </div>
  );
}

// ---------- Pipeline panel ----------

function PipelinePanel({
  title, opera, steps, runningStep, expandedLogs, onRun, onAskRerun, onToggleLog, onViewOutput,
}: {
  title: string;
  opera: Opera;
  steps: LettureStepId[];
  runningStep: LettureStepId | null;
  expandedLogs: Set<LettureStepId>;
  onRun: (s: LettureStepId) => void;
  onAskRerun: (s: LettureStepId) => void;
  onToggleLog: (s: LettureStepId) => void;
  onViewOutput: (s: LettureStepId) => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>
      <div className="space-y-2">
        {steps.map((stepId) => (
          <StepRow
            key={stepId}
            stepId={stepId}
            opera={opera}
            running={runningStep === stepId}
            disabled={runningStep !== null && runningStep !== stepId}
            logExpanded={expandedLogs.has(stepId)}
            onRun={onRun}
            onAskRerun={onAskRerun}
            onToggleLog={onToggleLog}
            onViewOutput={onViewOutput}
          />
        ))}
      </div>
    </div>
  );
}

function StepRow({
  stepId, opera, running, disabled, logExpanded,
  onRun, onAskRerun, onToggleLog, onViewOutput,
}: {
  stepId: LettureStepId;
  opera: Opera;
  running: boolean;
  disabled: boolean;
  logExpanded: boolean;
  onRun: (s: LettureStepId) => void;
  onAskRerun: (s: LettureStepId) => void;
  onToggleLog: (s: LettureStepId) => void;
  onViewOutput: (s: LettureStepId) => void;
}) {
  const step = opera.pipeline[stepId];
  const enabled = isStepEnabled(opera.pipeline, stepId);
  const active = isStepActive(step.stato);
  const prereqMissing = LETTURE_PREREQUISITES[stepId].filter(
    (p) => opera.pipeline[p].stato !== 'completato',
  );

  let action: React.ReactNode;
  if (active) {
    action = <span className="text-xs text-amber-700 font-medium">{step.stato.replace('_', ' ')}…</span>;
  } else if (step.stato === 'completato') {
    action = (
      <button
        onClick={() => onAskRerun(stepId)}
        disabled={disabled || running}
        className="text-xs px-3 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        Riesegui
      </button>
    );
  } else {
    action = (
      <button
        onClick={() => onRun(stepId)}
        disabled={!enabled || disabled || running}
        className="text-xs px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
        title={!enabled ? `Mancano: ${prereqMissing.join(', ')}` : undefined}
      >
        {running ? 'Avvio…' : 'Esegui'}
      </button>
    );
  }

  return (
    <div className="border border-slate-200 rounded-md">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <StepDot stato={step.stato} />
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-800 truncate">
              {LETTURE_STEP_LABELS[stepId]}
              <span className="text-slate-400 font-normal ml-2 text-xs font-mono">{stepId}</span>
            </div>
            <div className="text-xs text-slate-500">
              {step.completato_il ? `Completato il ${formatDateTime(step.completato_il)}` :
                step.started_at ? `Avviato il ${formatDateTime(step.started_at)}` :
                !enabled ? `Mancano: ${prereqMissing.join(', ')}` : '—'}
            </div>
            {step.errore && (
              <div className="text-xs text-red-700 mt-0.5 truncate" title={step.errore}>
                Errore: {step.errore}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {step.output !== null && step.output !== undefined && hasLettureViewer(stepId) && (
            <button
              onClick={() => onViewOutput(stepId)}
              className="text-xs text-emerald-700 hover:text-emerald-800 underline"
            >
              vedi output
            </button>
          )}
          {step.log_lines.length > 0 && (
            <button
              onClick={() => onToggleLog(stepId)}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              {logExpanded ? 'nascondi log' : `log (${step.log_lines.length})`}
            </button>
          )}
          {action}
        </div>
      </div>
      {logExpanded && step.log_lines.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50 px-3 py-2 max-h-64 overflow-y-auto">
          <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
            {step.log_lines.map((l, i) => (
              <div key={i} className={l.level === 'error' ? 'text-red-700' : l.level === 'warn' ? 'text-amber-700' : ''}>
                <span className="text-slate-400">[{formatTime(l.ts)}]</span> {l.text}
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
}

function StepDot({ stato }: { stato: OperaStepStato }) {
  const color =
    stato === 'completato' ? 'bg-emerald-500' :
    stato === 'in_esecuzione' ? 'bg-amber-400 animate-pulse' :
    stato === 'in_coda' ? 'bg-amber-300' :
    stato === 'errore' ? 'bg-red-500' :
    'bg-slate-300';
  return <span className={`inline-block w-3 h-3 rounded-full flex-shrink-0 ${color}`} />;
}

// ---------- Testi (anteprima) ----------

function TextiPanel({ opera }: { opera: Opera }) {
  const tabs: { id: 'articolo' | 'resoconto' | 'saggio'; label: string; testo: string | null }[] = [
    { id: 'articolo',  label: 'Articolo (5D)',     testo: opera.pipeline.step_5d.testo },
    { id: 'resoconto', label: 'Resoconto (5E)',    testo: opera.pipeline.step_5e.testo },
    { id: 'saggio',    label: 'Saggio integrato (5F)', testo: opera.pipeline.step_5f.testo },
  ];
  const available = tabs.filter((t) => t.testo);
  const [active, setActive] = useState<typeof tabs[number]['id'] | null>(available[0]?.id ?? null);

  if (available.length === 0) return null;
  const current = tabs.find((t) => t.id === active);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Anteprima testi</h2>
        <div className="flex gap-1">
          {available.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`text-xs px-2.5 py-1 rounded ${
                active === t.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {current?.testo && (
        <pre className="text-sm whitespace-pre-wrap text-slate-800 max-h-[600px] overflow-y-auto p-4 bg-slate-50 rounded">
          {current.testo}
        </pre>
      )}
    </div>
  );
}

// ---------- Modale conferma riesecuzione ----------

function CascadeModal({
  stepId, opera, onCancel, onConfirm, loading,
}: {
  stepId: LettureStepId;
  opera: Opera;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  // Mostro solo gli step a valle che sono attualmente non `non_avviato`
  // (gli altri non perdono nulla).
  const downstream = LETTURE_INVALIDATION_MAP[stepId].filter(
    (id) => opera.pipeline[id].stato !== 'non_avviato',
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="font-semibold text-slate-900 text-lg mb-2">
          Riesegui {LETTURE_STEP_LABELS[stepId]}?
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Lo step verrà rilanciato. Anche gli step seguenti, attualmente in stato non iniziale, verranno
          azzerati e dovranno essere rieseguiti.
        </p>
        {downstream.length > 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
            <div className="text-xs font-semibold text-amber-900 mb-1.5">
              Step che verranno azzerati ({downstream.length}):
            </div>
            <ul className="text-xs text-amber-900 space-y-0.5">
              {downstream.map((id) => (
                <li key={id} className="flex items-center gap-1.5">
                  <StepDot stato={opera.pipeline[id].stato} />
                  <span>{LETTURE_STEP_LABELS[id]}</span>
                  <span className="text-amber-700">({opera.pipeline[id].stato})</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-slate-500 mb-4 italic">
            Nessuno step a valle è attualmente avanzato — la riesecuzione non azzererà nulla d'altro.
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel} disabled={loading}
            className="text-sm px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm} disabled={loading}
            className="text-sm px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 font-medium"
          >
            {loading ? 'Avvio…' : 'Conferma riesecuzione'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- helpers ----------

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('it-IT', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}
function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch { return iso; }
}
