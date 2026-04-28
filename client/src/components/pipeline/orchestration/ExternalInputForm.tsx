import { useEffect, useState } from 'react';
import type { ExternalInputConfig, PipelineExternalInputDoc } from '../../../types/pipeline';

interface ExternalInputFormProps {
  stepId: string;
  contextId?: string;
  inputConfig: ExternalInputConfig[];
  existingInputs: PipelineExternalInputDoc[];
  onSubmit: (inputId: string, data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}

interface GenericField {
  id: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  defaultValue?: string;
}

// Form hardcoded per step 7 (contesto/ambito)
function ContextForm({ initial, onSubmit, onClose }: {
  initial: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    target_domain: (initial.target_domain as string) ?? 'clinico',
    target_subdomain: (initial.target_subdomain as string) ?? '',
    age_range: (initial.age_range as string) ?? '',
    setting: (initial.setting as string) ?? '',
    observer_profile: (initial.observer_profile as string) ?? '',
    notes: (initial.notes as string) ?? '',
  });
  const [submitting, setSubmitting] = useState(false);

  const valid = form.target_domain && form.target_subdomain && form.age_range && form.setting && form.observer_profile;

  return (
    <div className="space-y-3">
      <Field label="Dominio target *">
        <select
          value={form.target_domain}
          onChange={(e) => setForm({ ...form, target_domain: e.target.value })}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="clinico">Clinico</option>
          <option value="educativo">Educativo</option>
          <option value="formazione">Formazione</option>
          <option value="politiche">Politiche</option>
        </select>
      </Field>
      <Field label="Sottodominio *"><Input value={form.target_subdomain} onChange={(v) => setForm({ ...form, target_subdomain: v })} placeholder="es. neuropsviluppo" /></Field>
      <Field label="Fascia d'età *"><Input value={form.age_range} onChange={(v) => setForm({ ...form, age_range: v })} placeholder="es. 9-24 mesi" /></Field>
      <Field label="Setting *"><Input value={form.setting} onChange={(v) => setForm({ ...form, setting: v })} placeholder="es. ambulatorio, setting semi-strutturato" /></Field>
      <Field label="Profilo osservatore *"><Input value={form.observer_profile} onChange={(v) => setForm({ ...form, observer_profile: v })} placeholder="es. logopedista, neuropsichiatra infantile" /></Field>
      <Field label="Note (opzionale)"><Textarea value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} rows={2} /></Field>
      <FormFooter
        valid={!!valid && !submitting}
        onClose={onClose}
        onSubmit={async () => {
          setSubmitting(true);
          try { await onSubmit(form); } finally { setSubmitting(false); }
        }}
      />
    </div>
  );
}

// Form per step 10 (5 casi)
const CASE_TYPES = ['assente', 'parziale', 'chiudente', 'apparente_scripted', 'quasi_indistinguibile'];
const CASE_LABELS: Record<string, string> = {
  assente: 'Assente',
  parziale: 'Parziale',
  chiudente: 'Chiudente',
  apparente_scripted: 'Apparente / scripted',
  quasi_indistinguibile: 'Quasi indistinguibile',
};

function StressTestCasesForm({ initial, onSubmit, onClose }: {
  initial: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}) {
  const [temaId, setTemaId] = useState((initial.tema_id as string) ?? '');
  const [domain, setDomain] = useState((initial.domain as string) ?? '');
  const [cases, setCases] = useState<Record<string, string>>(() => {
    const arr = (initial.cases as Array<{ case_type: string; case_description: string }> | undefined) ?? [];
    const map: Record<string, string> = {};
    for (const t of CASE_TYPES) {
      const found = arr.find((c) => c.case_type === t);
      map[t] = found?.case_description ?? '';
    }
    return map;
  });
  const [submitting, setSubmitting] = useState(false);

  const valid = !!(temaId && domain && CASE_TYPES.every((t) => cases[t]?.trim()));

  return (
    <div className="space-y-3">
      <Field label="Tema id *"><Input value={temaId} onChange={setTemaId} placeholder="es. pointing" /></Field>
      <Field label="Dominio *"><Input value={domain} onChange={setDomain} placeholder="es. clinico" /></Field>
      <p className="text-xs text-slate-500 mt-2">5 casi critici, uno per tipo. Tutti obbligatori.</p>
      {CASE_TYPES.map((t, i) => (
        <details key={t} open={i === 0} className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">
            Caso {i + 1}: {CASE_LABELS[t]}
          </summary>
          <Textarea
            value={cases[t]}
            onChange={(v) => setCases({ ...cases, [t]: v })}
            rows={3}
            placeholder="Descrivere la situazione…"
          />
        </details>
      ))}
      <FormFooter
        valid={valid && !submitting}
        onClose={onClose}
        onSubmit={async () => {
          setSubmitting(true);
          try {
            await onSubmit({
              tema_id: temaId,
              domain,
              cases: CASE_TYPES.map((t, i) => ({
                case_id: `caso_${String(i + 1).padStart(2, '0')}`,
                case_type: t,
                case_description: cases[t],
              })),
            });
          } finally { setSubmitting(false); }
        }}
      />
    </div>
  );
}

// Form per step 2 / step 1 (testo libero / multi-campo)
function GenericObjectForm({ fields, initial, onSubmit, onClose }: {
  fields: GenericField[];
  initial: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    for (const f of fields) {
      const existing = initial[f.id] as string | undefined;
      out[f.id] = existing ?? f.defaultValue ?? '';
    }
    return out;
  });
  const [submitting, setSubmitting] = useState(false);
  const valid = fields.every((f) => !f.required || form[f.id]?.trim());
  return (
    <div className="space-y-3">
      {fields.map((f) => (
        <Field key={f.id} label={`${f.label}${f.required ? ' *' : ''}`} description={f.description}>
          {f.multiline
            ? <Textarea value={form[f.id]} onChange={(v) => setForm({ ...form, [f.id]: v })} rows={3} placeholder={f.placeholder} />
            : <Input    value={form[f.id]} onChange={(v) => setForm({ ...form, [f.id]: v })} placeholder={f.placeholder} />
          }
        </Field>
      ))}
      <FormFooter
        valid={valid && !submitting}
        onClose={onClose}
        onSubmit={async () => {
          setSubmitting(true);
          try { await onSubmit(form); } finally { setSubmitting(false); }
        }}
      />
    </div>
  );
}

// Field/Input/Textarea/FormFooter helpers
function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>
      {description && <p className="text-xs text-slate-500 mb-1.5 leading-relaxed">{description}</p>}
      {children}
    </div>
  );
}
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />;
}
function Textarea({ value, onChange, rows = 3, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />;
}
function FormFooter({ valid, onClose, onSubmit }: { valid: boolean; onClose: () => void; onSubmit: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 pt-2">
      <p className="text-xs text-slate-400 italic">Alla conferma lo step viene avviato.</p>
      <div className="flex gap-2">
        <button onClick={onClose} className="text-sm px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Annulla</button>
        <button onClick={onSubmit} disabled={!valid} className="text-sm px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50">Avvia step</button>
      </div>
    </div>
  );
}

export default function ExternalInputForm({ stepId, contextId, inputConfig, existingInputs, onSubmit, onClose }: ExternalInputFormProps) {
  // Identifica l'input obbligatorio: 1 o 0 per step (per ora gestiamo solo 1).
  const required = inputConfig.find((i) => i.type === 'esterno_obbligatorio');
  const [activeId, setActiveId] = useState<string | null>(required?.id ?? inputConfig[0]?.id ?? null);

  useEffect(() => {
    if (!activeId && inputConfig.length > 0) setActiveId(inputConfig[0].id);
  }, [inputConfig, activeId]);

  const existing = existingInputs.find((i) => i.input_id === activeId);
  const initial = (existing?.data as Record<string, unknown>) ?? {};

  if (!activeId) {
    return (
      <Modal title={`Nessun input richiesto per ${stepId}`} onClose={onClose}>
        <p className="text-sm text-slate-500">Lo step non richiede input esterni.</p>
      </Modal>
    );
  }

  async function handleSubmit(data: Record<string, unknown>) {
    if (!activeId) return;
    await onSubmit(activeId, data);
    onClose();
  }

  return (
    <Modal title={`Configura e avvia ${stepId}`} onClose={onClose}>
      {stepId === 'f3_step_7' && <ContextForm initial={initial} onSubmit={handleSubmit} onClose={onClose} />}
      {stepId === 'f3_step_10' && <StressTestCasesForm initial={initial} onSubmit={handleSubmit} onClose={onClose} />}
      {stepId === 'f2_step_2' && (
        <GenericObjectForm
          fields={[
            {
              id: 'tema_scelto',
              label: 'Tema scelto',
              required: true,
              description: 'Il tema (atto o fenomeno specifico) selezionato fra i candidati di step 1. Es: "pointing precoce", "richiesta di aiuto", "offerta spontanea". Evita formulazioni troppo generiche ("comunicazione precoce") o troppo operative ("training al pointing").',
              placeholder: 'es. pointing precoce',
            },
            {
              id: 'descrizione',
              label: 'Descrizione',
              multiline: true,
              description: 'Cos\'è il fenomeno in 1-2 frasi: situazione tipica, attori coinvolti, dinamica osservabile.',
              placeholder: 'es. Atto comunicativo precoce in cui il bambino indica con il dito un oggetto…',
            },
            {
              id: 'motivazione_selezione',
              label: 'Motivazione della selezione',
              multiline: true,
              description: 'Perché hai scelto questo tema fra i candidati di step 1: rilevanza strutturale, ricchezza interdisciplinare, perché è insieme raro e prototipico.',
              placeholder: 'es. Tema strutturalmente denso che attraversa più assi…',
            },
            {
              id: 'ricerca_id',
              label: 'Ricerca id',
              required: true,
              description: 'Identificatore della ricerca F2 di appartenenza (= context_id della ricerca corrente). Pre-compilato automaticamente: modificarlo solo se sai cosa stai facendo.',
              defaultValue: contextId,
            },
          ]}
          initial={initial}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      )}
      {stepId === 'f3_step_1' && (
        <GenericObjectForm
          fields={[
            {
              id: 'theme_id',
              label: 'Theme id',
              required: true,
              description: 'Identificatore del tema (= context_id del tema corrente). Pre-compilato automaticamente.',
              defaultValue: contextId,
            },
            {
              id: 'label',
              label: 'Label',
              required: true,
              description: 'Etichetta umana del tema, mostrata nelle viste di pipeline.',
              placeholder: 'es. Pointing precoce',
            },
            {
              id: 'provenienza_ricerca',
              label: 'Provenienza ricerca',
              description: 'Quale ricerca F2 ha generato questo tema (opzionale, se proviene da F2).',
              placeholder: 'es. ricerca-01-comunicazione-precoce',
            },
            {
              id: 'provenienza_step',
              label: 'Provenienza step',
              description: 'In quale step della ricerca F2 è stato selezionato questo tema (opzionale).',
              placeholder: 'es. f2_step_5',
            },
          ]}
          initial={initial}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      )}
      {!['f3_step_7', 'f3_step_10', 'f2_step_2', 'f3_step_1'].includes(stepId) && (
        <FallbackJsonForm initial={initial} onSubmit={handleSubmit} onClose={onClose} />
      )}
    </Modal>
  );
}

function FallbackJsonForm({ initial, onSubmit, onClose }: {
  initial: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}) {
  const [text, setText] = useState(() => JSON.stringify(initial, null, 2));
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">JSON libero (form schema-driven non ancora implementato per questo step).</p>
      <textarea value={text} onChange={(e) => { setText(e.target.value); setError(null); }} rows={10} className="w-full font-mono text-xs border border-slate-300 rounded-md px-3 py-2" />
      {error && <p className="text-xs text-red-700">{error}</p>}
      <FormFooter
        valid={!!text.trim()}
        onClose={onClose}
        onSubmit={async () => {
          try {
            const parsed = JSON.parse(text) as Record<string, unknown>;
            await onSubmit(parsed);
          } catch (e) {
            setError(`JSON non valido: ${(e as Error).message}`);
          }
        }}
      />
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-5 my-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Chiudi">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
