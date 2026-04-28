import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { createOpera } from '../services/lettureService';
import { LETTURE_TIPOLOGIE, type OperaTipologia } from '../types/letture';

export default function AdminLetturaNuova() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [titolo, setTitolo] = useState('');
  const [autore, setAutore] = useState('');
  const [tipologia, setTipologia] = useState<OperaTipologia>('romanzo');
  const [anno, setAnno] = useState('');
  const [linguaOriginale, setLinguaOriginale] = useState('');
  const [priorita, setPriorita] = useState<string>('');
  const [note, setNote] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = titolo.trim().length > 0 && autore.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token Clerk non disponibile');
      const opera = await createOpera(token, {
        titolo: titolo.trim(),
        autore: autore.trim(),
        tipologia,
        anno: anno ? parseInt(anno, 10) : null,
        lingua_originale: linguaOriginale.trim() || null,
        priorita: priorita ? parseInt(priorita, 10) : null,
        note_di_ingresso: note,
      });
      navigate(`/admin/letture/${encodeURIComponent(opera.slug)}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/admin/letture" className="text-sm text-slate-500 hover:text-slate-700">← Torna all'elenco</Link>
      <h1 className="text-2xl font-bold text-slate-900 mt-3 mb-6">Nuova opera</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <Field label="Titolo *">
          <input
            type="text" required value={titolo} onChange={(e) => setTitolo(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            placeholder="Es. Il Gattopardo"
          />
        </Field>
        <Field label="Autore *">
          <input
            type="text" required value={autore} onChange={(e) => setAutore(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            placeholder="Es. Tomasi di Lampedusa"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tipologia *">
            <select
              value={tipologia}
              onChange={(e) => setTipologia(e.target.value as OperaTipologia)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              {LETTURE_TIPOLOGIE.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Anno">
            <input
              type="number" value={anno} onChange={(e) => setAnno(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              placeholder="Es. 1958"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Lingua originale">
            <input
              type="text" value={linguaOriginale} onChange={(e) => setLinguaOriginale(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              placeholder="Es. italiano"
            />
          </Field>
          <Field label="Priorità (1 alta — 5 bassa)">
            <select
              value={priorita} onChange={(e) => setPriorita(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="">— nessuna —</option>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Note di ingresso" description="Contesto, motivazione, materiali disponibili.">
          <textarea
            value={note} onChange={(e) => setNote(e.target.value)} rows={4}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
        </Field>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-400 italic">
            Lo slug viene generato automaticamente da autore e titolo.
          </p>
          <div className="flex gap-2">
            <Link
              to="/admin/letture"
              className="text-sm px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Annulla
            </Link>
            <button
              type="submit" disabled={!valid || submitting}
              className="text-sm px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 font-medium"
            >
              {submitting ? 'Creazione…' : 'Crea opera'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
      {description && <p className="text-xs text-slate-500 mb-1.5">{description}</p>}
      {children}
    </div>
  );
}
