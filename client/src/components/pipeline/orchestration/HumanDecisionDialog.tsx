import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { HumanDecision, PipelineContextDoc, TemaAmbito, TemaAmbitoData } from '../../../types/pipeline';
import type { UsePipelineOrchestrationResult } from './types';

interface HumanDecisionDialogProps {
  decision: HumanDecision;
  context: PipelineContextDoc;
  orchestration: UsePipelineOrchestrationResult;
  onSubmitContextDecision: (confirmed: boolean, notes: string) => Promise<void>;
  onClose: () => void;
}

export default function HumanDecisionDialog(props: HumanDecisionDialogProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full my-8 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
          <p className="font-semibold text-slate-900">
            {props.decision.type === 'f2_to_f3_tema_selection' && 'Da F2 a F3 — definisci e seleziona ambito'}
            {props.decision.type === 'step7_context_selection' && 'Definizione contesto del dispositivo'}
          </p>
          <button onClick={props.onClose} className="text-slate-400 hover:text-slate-700" aria-label="Chiudi">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {props.decision.type === 'f2_to_f3_tema_selection' && (
            <AmbitiBridgeVariant
              decision={props.decision}
              context={props.context}
              orchestration={props.orchestration}
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

// ---------- variante 1: bridge F2 → F3 con ambiti (1→n) ----------

interface ThemeOption {
  theme_id: string;
  label?: string;
  structural_assessment?: string;
}

function AmbitiBridgeVariant({ decision, context, orchestration, onClose }: {
  decision: HumanDecision;
  context: PipelineContextDoc;
  orchestration: UsePipelineOrchestrationResult;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  // La ricerca F2 è monotematica per costruzione: prendiamo il primo (e unico)
  // theme dall'output di f2_step_5 propagato in decision.options.
  const themeOptions = (decision.options ?? []) as unknown as ThemeOption[];
  const theme = themeOptions[0] ?? null;
  const themeId = theme?.theme_id ?? '';
  const themeLabel = theme?.label ?? themeId;

  const ambiti: TemaAmbito[] = themeId
    ? (context.tema_ambiti?.[themeId] ?? [])
    : [];

  const [editingId, setEditingId] = useState<string | null>(null); // ambito_id in editing, '__new__' per nuovo
  const [busyAmbitoId, setBusyAmbitoId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!theme || !themeId) {
    return (
      <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-3">
        Nessun tema candidato disponibile da F2. Controlla l'output di f2_step_5.
      </div>
    );
  }

  async function handleSaveAmbito(payload: { ambito_id: string; label: string; data: TemaAmbitoData }, isNew: boolean, originalId?: string) {
    setErr(null);
    setBusyAmbitoId(isNew ? '__new__' : (originalId ?? null));
    try {
      if (isNew) {
        await orchestration.createTemaAmbito(themeId, payload);
      } else if (originalId) {
        await orchestration.updateTemaAmbito(themeId, originalId, { label: payload.label, data: payload.data });
      }
      setEditingId(null);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusyAmbitoId(null);
    }
  }

  async function handleDelete(ambitoId: string) {
    if (!confirm('Eliminare questo ambito? L\'azione è irreversibile.')) return;
    setErr(null);
    setBusyAmbitoId(ambitoId);
    try {
      await orchestration.deleteTemaAmbito(themeId, ambitoId);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusyAmbitoId(null);
    }
  }

  async function handlePromote(ambitoId: string) {
    setErr(null);
    setBusyAmbitoId(ambitoId);
    try {
      const r = await orchestration.promoteTemaAmbito(themeId, ambitoId);
      if (r.tema_id) {
        onClose();
        navigate(`/sviluppo-bambino/produzioni/pipeline/temi/${encodeURIComponent(r.tema_id)}`);
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusyAmbitoId(null);
    }
  }

  function handleGoToTema(temaId: string) {
    onClose();
    navigate(`/sviluppo-bambino/produzioni/pipeline/temi/${encodeURIComponent(temaId)}`);
  }

  async function handleDismiss() {
    if (!confirm('Chiudere questa decisione? Il banner non riapparirà più. Potrai sempre riaprire i temi F3 dalla mappa.')) return;
    setErr(null);
    try {
      await orchestration.dismissRicercaDecision();
      onClose();
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header tema */}
      <section className="rounded-md bg-slate-50 border border-slate-200 p-3">
        <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-0.5">Tema F2 corrente</p>
        <p className="text-sm font-semibold text-slate-900">{themeLabel}</p>
        <p className="text-xs text-slate-500 font-mono">{themeId}</p>
        {theme.structural_assessment && (
          <p className="text-xs text-slate-600 mt-1">{theme.structural_assessment}</p>
        )}
      </section>

      {/* Ambiti */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-800">Ambiti definiti per questo tema</h3>
          {ambiti.length > 0 && editingId !== '__new__' && (
            <button
              onClick={() => setEditingId('__new__')}
              className="text-xs px-2.5 py-1 rounded-md border border-emerald-500 text-emerald-700 hover:bg-emerald-50"
            >+ Aggiungi ambito</button>
          )}
        </div>

        {ambiti.length === 0 && editingId !== '__new__' && (
          <div className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-600">
            Nessun ambito definito. Crea il primo per aprire una pipeline F3.
            <div className="mt-2">
              <button
                onClick={() => setEditingId('__new__')}
                className="text-xs px-2.5 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
              >+ Aggiungi primo ambito</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {ambiti.map((a) => (
            <div key={a.ambito_id} className="rounded-md border border-slate-200">
              {editingId === a.ambito_id ? (
                <AmbitoForm
                  initial={a}
                  themeId={themeId}
                  ambitiAll={ambiti}
                  busy={busyAmbitoId === a.ambito_id}
                  onCancel={() => setEditingId(null)}
                  onSave={(payload) => handleSaveAmbito(payload, false, a.ambito_id)}
                />
              ) : (
                <AmbitoCard
                  ambito={a}
                  busy={busyAmbitoId === a.ambito_id}
                  onEdit={() => setEditingId(a.ambito_id)}
                  onDelete={() => handleDelete(a.ambito_id)}
                  onPromote={() => handlePromote(a.ambito_id)}
                  onGoToTema={(temaId) => handleGoToTema(temaId)}
                />
              )}
            </div>
          ))}

          {editingId === '__new__' && (
            <div className="rounded-md border border-emerald-300 bg-emerald-50/30">
              <AmbitoForm
                themeId={themeId}
                ambitiAll={ambiti}
                busy={busyAmbitoId === '__new__'}
                onCancel={() => setEditingId(null)}
                onSave={(payload) => handleSaveAmbito(payload, true)}
              />
            </div>
          )}
        </div>
      </section>

      {err && <p className="text-sm text-red-700">{err}</p>}

      <div className="flex justify-between items-center pt-3 border-t border-slate-200">
        <button
          onClick={handleDismiss}
          className="text-xs px-3 py-1.5 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"
          title="Archivia la decisione: il banner non comparirà più"
        >Concluso (chiudi banner)</button>
        <button onClick={onClose} className="text-sm px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Chiudi</button>
      </div>
    </div>
  );
}

// Card di un ambito esistente (lettura). Le azioni promote/edit/delete sono inline.
function AmbitoCard({ ambito, busy, onEdit, onDelete, onPromote, onGoToTema }: {
  ambito: TemaAmbito;
  busy: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPromote: () => void;
  onGoToTema: (temaId: string) => void;
}) {
  const promoted = ambito.promoted_to_f3 && ambito.promoted_tema_id;
  return (
    <div className="p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{ambito.label}</p>
          <p className="text-xs text-slate-500 font-mono">{ambito.ambito_id}</p>
          <p className="text-xs text-slate-600 mt-1">
            <span className="capitalize">{ambito.data.target_domain}</span>
            {ambito.data.target_subdomain && <> · {ambito.data.target_subdomain}</>}
            {ambito.data.age_range && <> · {ambito.data.age_range}</>}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {ambito.data.setting} · {ambito.data.observer_profile}
          </p>
          {ambito.data.notes && <p className="text-xs text-slate-500 mt-1 italic">{ambito.data.notes}</p>}
          {promoted && (
            <p className="text-xs text-emerald-700 mt-2 font-mono">
              → tema F3: {ambito.promoted_tema_id}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {promoted ? (
            <button
              onClick={() => onGoToTema(ambito.promoted_tema_id!)}
              disabled={busy}
              className="text-xs px-2.5 py-1.5 rounded-md bg-slate-700 text-white hover:bg-slate-800 disabled:opacity-50"
            >Vai al tema F3 →</button>
          ) : (
            <button
              onClick={onPromote}
              disabled={busy}
              className="text-xs px-2.5 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >Apri pipeline F3 →</button>
          )}
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              disabled={busy || !!promoted}
              title={promoted ? 'Ambito già promosso, non modificabile' : 'Modifica'}
              className="text-xs px-2 py-1 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >Modifica</button>
            <button
              onClick={onDelete}
              disabled={busy || !!promoted}
              title={promoted ? 'Ambito già promosso, non eliminabile' : 'Elimina'}
              className="text-xs px-2 py-1 rounded-md border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >Elimina</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Form di creazione/modifica ambito. Stessi campi di f3_step_7 + ambito_id/label.
function AmbitoForm({ initial, themeId, ambitiAll, busy, onCancel, onSave }: {
  initial?: TemaAmbito;
  themeId: string;
  ambitiAll: TemaAmbito[];
  busy: boolean;
  onCancel: () => void;
  onSave: (payload: { ambito_id: string; label: string; data: TemaAmbitoData }) => void;
}) {
  const isNew = !initial;
  const [ambitoId, setAmbitoId] = useState(initial?.ambito_id ?? '');
  const [label, setLabel] = useState(initial?.label ?? '');
  const [data, setData] = useState<TemaAmbitoData>(initial?.data ?? {
    target_domain: 'clinico',
    target_subdomain: '',
    age_range: '',
    setting: '',
    observer_profile: '',
    notes: '',
  });

  const slugOk = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(ambitoId.trim());
  const idCollision = isNew && ambitiAll.some((a) => a.ambito_id === ambitoId.trim());
  const dataValid = !!(data.target_subdomain.trim() && data.age_range.trim() && data.setting.trim() && data.observer_profile.trim());
  const valid = slugOk && !idCollision && label.trim().length > 0 && dataValid;

  const futureTemaId = ambitoId && slugOk ? `${themeId}--${ambitoId}` : null;

  return (
    <div className="p-3 space-y-3">
      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
        {isNew ? 'Nuovo ambito' : `Modifica "${initial?.label}"`}
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">ID ambito *</label>
          <input
            type="text"
            value={ambitoId}
            onChange={(e) => setAmbitoId(e.target.value.toLowerCase())}
            disabled={!isNew}
            className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 text-sm font-mono disabled:bg-slate-100 disabled:text-slate-500"
            placeholder="es. clinico-neuropsviluppo"
          />
          {ambitoId && !slugOk && <p className="text-xs text-red-600 mt-1">Solo a-z, 0-9, trattini.</p>}
          {idCollision && <p className="text-xs text-red-600 mt-1">ID già in uso per questo tema.</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Label *</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 text-sm"
            placeholder="es. Clinico — neuropsviluppo"
          />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-3">
        <p className="text-xs font-medium text-slate-700 mb-2">
          Contesto operativo (input di f3_step_7 — pre-popolato all'apertura della pipeline)
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-600 mb-1">Dominio target *</label>
            <select
              value={data.target_domain}
              onChange={(e) => setData({ ...data, target_domain: e.target.value as TemaAmbitoData['target_domain'] })}
              className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 text-sm bg-white"
            >
              <option value="clinico">Clinico</option>
              <option value="educativo">Educativo</option>
              <option value="formazione">Formazione</option>
              <option value="politiche">Politiche</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Sottodominio *</label>
            <input type="text" value={data.target_subdomain} onChange={(e) => setData({ ...data, target_subdomain: e.target.value })}
              className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 text-sm" placeholder="es. neuropsviluppo" />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Fascia d'età *</label>
            <input type="text" value={data.age_range} onChange={(e) => setData({ ...data, age_range: e.target.value })}
              className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 text-sm" placeholder="es. 9–24 mesi" />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Setting *</label>
            <input type="text" value={data.setting} onChange={(e) => setData({ ...data, setting: e.target.value })}
              className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 text-sm" placeholder="es. ambulatorio" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-600 mb-1">Profilo osservatore *</label>
            <input type="text" value={data.observer_profile} onChange={(e) => setData({ ...data, observer_profile: e.target.value })}
              className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 text-sm" placeholder="es. neuropsichiatra infantile" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-600 mb-1">Note (opzionale)</label>
            <textarea value={data.notes ?? ''} onChange={(e) => setData({ ...data, notes: e.target.value })} rows={2}
              className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 text-sm" />
          </div>
        </div>
      </div>

      {futureTemaId && (
        <p className="text-xs text-slate-500">
          Tema F3 risultante (al momento dell'apertura): <span className="font-mono text-slate-700">{futureTemaId}</span>
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
        <button onClick={onCancel} disabled={busy}
          className="text-xs px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50">
          Annulla
        </button>
        <button
          onClick={() => onSave({ ambito_id: ambitoId.trim(), label: label.trim(), data })}
          disabled={!valid || busy}
          className="text-xs px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >{busy ? 'Salvataggio…' : (isNew ? 'Crea ambito' : 'Salva modifiche')}</button>
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
