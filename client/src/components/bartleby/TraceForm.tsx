import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { submitTrace } from '../../services/bartlebyService';
import type { TraceFormData, DomainArea, OutputTemplate } from '../../types/bartleby';

interface Props {
  domainAreas: DomainArea[];
  outputTemplates: OutputTemplate[];
  onSuccess?: () => void;
}

export default function TraceForm({ domainAreas, outputTemplates, onSuccess }: Props) {
  const { getToken } = useAuth();
  const [form, setForm]       = useState<TraceFormData>({ raw_text: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!form.raw_text.trim()) { setError('Inserisci il testo della traccia.'); return; }
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Autenticazione richiesta');
      const trace = await submitTrace(form, token);
      sessionStorage.setItem('bartleby_pending_trace', trace._id);
      setSuccess(true);
      setForm({ raw_text: '' });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nella sottomissione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error   && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">{error}</p>}
      {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-3">Traccia inviata. Il sistema la elaborerà a breve.</p>}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Descrivi la situazione <span className="text-red-500">*</span>
        </label>
        <textarea
          name="raw_text"
          rows={6}
          value={form.raw_text}
          onChange={handleChange}
          placeholder="Descrivi liberamente la situazione, il comportamento, la domanda o il contesto su cui vuoi un output HCAIRE..."
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Note di contesto</label>
        <textarea
          name="context_notes"
          rows={3}
          value={form.context_notes ?? ''}
          onChange={handleChange}
          placeholder="Età del bambino, setting (casa, scuola, ambulatorio...), informazioni aggiuntive rilevanti..."
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ambito (opzionale)</label>
          <select
            name="requested_area_id"
            value={form.requested_area_id ?? ''}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-600"
          >
            <option value="">— scegli ambito —</option>
            {domainAreas.map((a) => (
              <option key={a.bartlebyId} value={a.bartlebyId}>{a.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo di output (opzionale)</label>
          <select
            name="target_output_type"
            value={form.target_output_type ?? ''}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-600"
          >
            <option value="">— scegli tipo —</option>
            {outputTemplates.map((t) => (
              <option key={t.bartlebyId} value={t.slug}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Invio in corso...' : 'Invia traccia'}
      </button>
    </form>
  );
}
