import { useState } from 'react';
import type { HumanDecision, PipelineContextDoc, TemaSelectionPayload } from '../../../types/pipeline';

interface HumanDecisionDialogProps {
  decision: HumanDecision;
  context: PipelineContextDoc;
  onSubmitTemaSelection: (ricercaId: string, payload: TemaSelectionPayload) => Promise<void>;
  onSubmitContextDecision: (confirmed: boolean, notes: string) => Promise<void>;
  onClose: () => void;
}

export default function HumanDecisionDialog(props: HumanDecisionDialogProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
          <p className="font-semibold text-slate-900">
            {props.decision.type === 'f2_to_f3_tema_selection' && 'Selezione tema da portare in F3'}
            {props.decision.type === 'step7_context_selection' && 'Definizione contesto del dispositivo'}
          </p>
          <button onClick={props.onClose} className="text-slate-400 hover:text-slate-700" aria-label="Chiudi">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {props.decision.type === 'f2_to_f3_tema_selection' && (
            <TemaSelectionVariant
              decision={props.decision}
              context={props.context}
              onSubmit={async (payload) => {
                await props.onSubmitTemaSelection(props.context.context_id, payload);
                props.onClose();
              }}
              onClose={props.onClose}
            />
          )}
          {props.decision.type === 'step7_context_selection' && (
            <ContextSelectionVariant
              decision={props.decision}
              onSubmit={async (confirmed, notes) => {
                await props.onSubmitContextDecision(confirmed, notes);
                props.onClose();
              }}
              onClose={props.onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- variante 1: F2 → F3 tema selection ----------

interface TemaOption {
  theme_id: string;
  label?: string;
  structural_assessment?: string;
  [k: string]: unknown;
}

function TemaSelectionVariant({ decision, context, onSubmit, onClose }: {
  decision: HumanDecision;
  context: PipelineContextDoc;
  onSubmit: (payload: TemaSelectionPayload) => Promise<void>;
  onClose: () => void;
}) {
  const options = (decision.options ?? []) as TemaOption[];
  const [selectedThemeId, setSelectedThemeId] = useState<string>(options[0]?.theme_id ?? '');
  const [contextId, setContextId] = useState<string>(options[0]?.theme_id ?? '');
  const [label, setLabel] = useState<string>(options[0]?.label ?? '');
  const [isDerived, setIsDerived] = useState(false);
  const [sourceTemaId, setSourceTemaId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function selectOption(theme_id: string) {
    setSelectedThemeId(theme_id);
    const opt = options.find((o) => o.theme_id === theme_id);
    if (opt) {
      setContextId(opt.theme_id);
      setLabel(opt.label ?? opt.theme_id);
    }
  }

  const valid = !!(selectedThemeId && contextId.trim() && label.trim() && /^[a-z0-9_-]+$/.test(contextId.trim()) && (!isDerived || sourceTemaId.trim()));

  async function handleSubmit() {
    setSubmitting(true);
    setErr(null);
    try {
      await onSubmit({
        selected_theme: {
          theme_id: contextId.trim(),
          label: label.trim(),
          from_step: decision.step_from,
          from_file: '',
        },
        ...(isDerived ? { dispositivo_sorgente: { tema_id: sourceTemaId.trim(), file: '', device_id: '' } } : {}),
      });
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Dalla ricerca <span className="font-mono text-slate-800">{context.context_id}</span> sono disponibili
        i seguenti temi candidati. Seleziona quello da portare in F3.
      </p>

      {options.length === 0 && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-3">
          Nessuna opzione pre-popolata. Inserisci manualmente i parametri sotto.
        </p>
      )}

      {options.length > 0 && (
        <div className="space-y-1.5 max-h-60 overflow-y-auto border border-slate-200 rounded-md p-2">
          {options.map((o) => (
            <label key={o.theme_id} className={`flex items-start gap-3 p-2 rounded-md cursor-pointer ${selectedThemeId === o.theme_id ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-slate-50'}`}>
              <input type="radio" checked={selectedThemeId === o.theme_id} onChange={() => selectOption(o.theme_id)} className="mt-1" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{o.label ?? o.theme_id}</p>
                <p className="text-xs text-slate-500 font-mono">{o.theme_id}</p>
                {o.structural_assessment && <p className="text-xs text-slate-600 mt-0.5">{o.structural_assessment}</p>}
              </div>
            </label>
          ))}
        </div>
      )}

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isDerived} onChange={(e) => setIsDerived(e.target.checked)} />
          <span className="text-slate-700">Derivato da un dispositivo esistente</span>
        </label>
        {isDerived && (
          <input
            type="text"
            value={sourceTemaId}
            onChange={(e) => setSourceTemaId(e.target.value)}
            placeholder="ID tema sorgente (es. pointing)"
            className="mt-2 w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">ID tema da creare *</label>
          <input
            type="text"
            value={contextId}
            onChange={(e) => setContextId(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm font-mono"
            placeholder="kebab-case"
          />
          <p className="text-xs text-slate-500 mt-1">Solo a-z, 0-9, trattini e underscore.</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Label *</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      {err && <p className="text-sm text-red-700">{err}</p>}

      <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
        <button onClick={onClose} className="text-sm px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Annulla</button>
        <button
          onClick={handleSubmit}
          disabled={!valid || submitting}
          className="text-sm px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
        >Conferma e crea tema →</button>
      </div>
    </div>
  );
}

// ---------- variante 2: step 7 context selection ----------

function ContextSelectionVariant({ decision, onSubmit, onClose }: {
  decision: HumanDecision;
  onSubmit: (confirmed: boolean, notes: string) => Promise<void>;
  onClose: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setErr(null);
    try {
      await onSubmit(confirmed, notes);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
        <p className="font-semibold mb-1">Decisione strutturale</p>
        <p>{decision.description}</p>
        <p className="mt-2 text-amber-800">
          Questa scelta definisce il vincolo di realtà del dispositivo finale. Non è un parametro tecnico —
          è una decisione di ricerca con implicazioni strutturali.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Note (opzionale)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          placeholder="Considerazioni sulla decisione…"
        />
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1" />
        <span className="text-slate-700">
          Confermo che questa scelta è corretta e voglio procedere.
        </span>
      </label>

      {err && <p className="text-sm text-red-700">{err}</p>}

      <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
        <button onClick={onClose} className="text-sm px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Annulla</button>
        <button
          onClick={handleSubmit}
          disabled={!confirmed || submitting}
          className="text-sm px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50"
        >Conferma e prosegui →</button>
      </div>
    </div>
  );
}
