import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { listChapters, exportAllChapters } from '../services/assiChaptersAdminService';
import type { AssiChapterSummary } from '../types/assiChapter';

const ASSI = [
  { slug: 'asse-1-ontologico-fenomenologico', label: 'Asse 1 · Ontologico-fenomenologico' },
  { slug: 'asse-2-affettivo-morale',          label: 'Asse 2 · Affettivo-morale' },
  { slug: 'asse-3-normativo-educativo',       label: 'Asse 3 · Normativo-educativo' },
  { slug: 'asse-4-separazione-e-limite',      label: 'Asse 4 · Separazione e Limite' },
  { slug: 'asse-5-desiderio',                 label: 'Asse 5 · Desiderio' },
  { slug: 'asse-6-storico-culturale',         label: 'Asse 6 · Storico-culturale' },
];

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' });
}

export default function AdminAssiChapters() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<AssiChapterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterAxis, setFilterAxis] = useState<string>('');
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const res = await listChapters(token, filterAxis || undefined);
      setItems(res.items);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [getToken, filterAxis]);

  useEffect(() => { void fetchList(); }, [fetchList]);

  const handleExportAll = async (): Promise<void> => {
    if (!window.confirm('Rigenerare tutti i 44 .md in normalized/ partendo dalla collection Mongo?')) return;
    setExporting(true);
    setExportMsg(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Sessione scaduta');
      const res = await exportAllChapters(token);
      setExportMsg(`✓ ${res.exported_count} file esportati${res.errors.length > 0 ? `, ${res.errors.length} errori` : ''}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setExporting(false);
    }
  };

  const grouped = useMemo(() => {
    const map = new Map<string, AssiChapterSummary[]>();
    for (const c of items) {
      const arr = map.get(c.axis_slug) ?? [];
      arr.push(c);
      map.set(c.axis_slug, arr);
    }
    return map;
  }, [items]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Capitoli assi strutturali</h1>
          <p className="text-sm text-slate-500 mt-1">
            44 capitoli su MongoDB <code>assi_chapters</code> (source-of-truth). I .md in <code>normalized/</code> sono backup git, rigenerati automaticamente ad ogni salvataggio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterAxis}
            onChange={(e) => setFilterAxis(e.target.value)}
            className="text-sm border border-slate-300 rounded px-2 py-1.5"
          >
            <option value="">Tutti gli assi</option>
            {ASSI.map((a) => <option key={a.slug} value={a.slug}>{a.label}</option>)}
          </select>
          <button
            onClick={() => void handleExportAll()}
            disabled={exporting}
            className="text-sm px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-50"
            title="Rigenera tutti i .md partendo da Mongo"
          >
            {exporting ? 'Export…' : '↻ Esporta tutti in git'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-rose-50 text-rose-800 text-sm border border-rose-200">{error}</div>
      )}
      {exportMsg && (
        <div className="mb-4 p-3 rounded bg-emerald-50 text-emerald-800 text-sm border border-emerald-200">{exportMsg}</div>
      )}

      {loading ? (
        <div className="text-slate-500">Caricamento…</div>
      ) : items.length === 0 ? (
        <div className="text-slate-500 italic">
          Nessun capitolo in MongoDB. Lancia <code>npm run assi:migrate-chapters --workspace=server</code> per popolare.
        </div>
      ) : (
        ASSI
          .filter((a) => !filterAxis || a.slug === filterAxis)
          .map((axis) => {
            const arr = grouped.get(axis.slug) ?? [];
            if (arr.length === 0) return null;
            return (
              <section key={axis.slug} className="mb-8">
                <h2 className="text-lg font-semibold text-slate-700 mb-2">
                  {axis.label} <span className="text-sm font-normal text-slate-400">({arr.length})</span>
                </h2>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600 text-left">
                      <tr>
                        <th className="px-4 py-2 font-medium w-12">#</th>
                        <th className="px-4 py-2 font-medium">Titolo</th>
                        <th className="px-4 py-2 font-medium">Pubblicato</th>
                        <th className="px-4 py-2 font-medium">Ultima modifica</th>
                        <th className="px-4 py-2 font-medium">Rev</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {arr.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50">
                          <td className="px-4 py-2 text-slate-500 font-mono text-xs">{c.chapter_number}</td>
                          <td className="px-4 py-2">
                            <Link
                              to={`/admin/assi/capitoli/${c.axis_slug}/${c.slug}`}
                              className="text-emerald-700 hover:underline font-medium"
                            >
                              {c.title}
                            </Link>
                          </td>
                          <td className="px-4 py-2 text-xs">
                            {c.is_published
                              ? <span className="text-emerald-700">sì</span>
                              : <span className="text-slate-400">no</span>}
                          </td>
                          <td className="px-4 py-2 text-slate-500 text-xs">{fmtDate(c._last_edited)}</td>
                          <td className="px-4 py-2 text-slate-500 text-xs">{c._revision_count ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })
      )}
    </div>
  );
}
