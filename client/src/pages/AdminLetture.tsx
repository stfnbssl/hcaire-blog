import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { listOpereAdmin } from '../services/lettureService';
import {
  LETTURE_STATI,
  LETTURE_STEP_IDS,
  LETTURE_TIPOLOGIE,
  type OperaStato,
  type OperaTipologia,
  type OperaSummary,
} from '../types/letture';

export default function AdminLetture() {
  const { getToken } = useAuth();
  const [opere, setOpere] = useState<OperaSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtroStato, setFiltroStato] = useState<OperaStato | ''>('');
  const [filtroTipologia, setFiltroTipologia] = useState<OperaTipologia | ''>('');
  const [filtroPriorita, setFiltroPriorita] = useState<string>('');

  const fetchData = useMemo(() => async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token Clerk non disponibile');
      const res = await listOpereAdmin(token, {
        ...(filtroStato ? { stato: filtroStato } : {}),
        ...(filtroTipologia ? { tipologia: filtroTipologia } : {}),
        ...(filtroPriorita ? { priorita: parseInt(filtroPriorita, 10) } : {}),
      });
      setOpere(res);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [getToken, filtroStato, filtroTipologia, filtroPriorita]);

  useEffect(() => { void fetchData(); }, [fetchData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Letture</h1>
          <p className="text-sm text-slate-500 mt-1">Gestione opere e pipeline analitica/editoriale.</p>
        </div>
        <Link
          to="/admin/letture/nuova"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-md font-medium"
        >
          + Nuova opera
        </Link>
      </div>

      {/* Filtri */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 flex flex-wrap gap-4">
        <FilterField label="Stato">
          <select
            value={filtroStato}
            onChange={(e) => setFiltroStato(e.target.value as OperaStato | '')}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white"
          >
            <option value="">— tutti —</option>
            {LETTURE_STATI.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </FilterField>
        <FilterField label="Tipologia">
          <select
            value={filtroTipologia}
            onChange={(e) => setFiltroTipologia(e.target.value as OperaTipologia | '')}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white"
          >
            <option value="">— tutte —</option>
            {LETTURE_TIPOLOGIE.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </FilterField>
        <FilterField label="Priorità">
          <select
            value={filtroPriorita}
            onChange={(e) => setFiltroPriorita(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white"
          >
            <option value="">— tutte —</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </FilterField>
        {(filtroStato || filtroTipologia || filtroPriorita) && (
          <button
            onClick={() => { setFiltroStato(''); setFiltroTipologia(''); setFiltroPriorita(''); }}
            className="text-sm text-slate-600 underline self-end pb-1.5"
          >
            azzera filtri
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md px-4 py-3 mb-4 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400" />
        </div>
      ) : opere.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">Nessuna opera presente.</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <Th>Titolo</Th>
                <Th>Autore</Th>
                <Th>Tipologia</Th>
                <Th>Stato</Th>
                <Th>Prio.</Th>
                <Th>Avanzamento</Th>
                <Th>Inserita</Th>
              </tr>
            </thead>
            <tbody>
              {opere.map((o) => (
                <tr key={o.slug} className="border-t border-slate-200 hover:bg-slate-50">
                  <Td>
                    <Link to={`/admin/letture/${encodeURIComponent(o.slug)}`} className="text-emerald-700 hover:underline font-medium">
                      {o.titolo}
                    </Link>
                    <div className="text-xs text-slate-400 font-mono">{o.slug}</div>
                  </Td>
                  <Td>{o.autore}</Td>
                  <Td className="text-slate-600">{o.tipologia}</Td>
                  <Td><StatoBadge stato={o.stato} /></Td>
                  <Td className="text-slate-700">{o.priorita ?? '—'}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 tabular-nums">
                        {o.avanzamento.completati}/{o.avanzamento.totale}
                      </span>
                      <StepDotGrid stepStati={o.step_stati} />
                    </div>
                  </Td>
                  <Td className="text-slate-500 text-xs whitespace-nowrap">{formatDate(o.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------- componenti locali ----------

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-2.5 font-medium text-xs uppercase tracking-wide">{children}</th>;
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-2.5 ${className}`}>{children}</td>;
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function StatoBadge({ stato }: { stato: OperaStato }) {
  const styles: Record<OperaStato, string> = {
    in_attesa:  'bg-slate-100 text-slate-700 border-slate-300',
    in_corso:   'bg-amber-50 text-amber-800 border-amber-300',
    completata: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    sospesa:    'bg-red-50 text-red-800 border-red-300',
  };
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded border ${styles[stato]}`}>
      {stato.replace('_', ' ')}
    </span>
  );
}

function StepDotGrid({ stepStati }: { stepStati: OperaSummary['step_stati'] }) {
  return (
    <div className="flex gap-0.5">
      {LETTURE_STEP_IDS.map((id) => {
        const s = stepStati[id];
        const color =
          s === 'completato' ? 'bg-emerald-500' :
          s === 'in_esecuzione' ? 'bg-amber-400 animate-pulse' :
          s === 'in_coda' ? 'bg-amber-300' :
          s === 'errore' ? 'bg-red-500' :
          'bg-slate-300';
        return <span key={id} title={`${id}: ${s}`} className={`inline-block w-2 h-2 rounded-full ${color}`} />;
      })}
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('it-IT', { year: 'numeric', month: 'short', day: '2-digit' });
  } catch {
    return iso;
  }
}
