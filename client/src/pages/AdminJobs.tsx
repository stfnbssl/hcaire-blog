import { useMemo, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchJobDefinitions,
  fetchJobRequests,
  createJobRequest,
  deleteJobRequest,
} from '../services/jobsService';
import type { JobRequest, JobStatus } from '@shared/types/jobs';

const STATUS_LABELS: Record<JobStatus, { label: string; cls: string }> = {
  pending:    { label: 'in attesa',  cls: 'bg-amber-50 text-amber-700' },
  processing: { label: 'in corso',   cls: 'bg-sky-50 text-sky-700' },
  completed:  { label: 'completato', cls: 'bg-emerald-50 text-emerald-700' },
  failed:     { label: 'fallito',    cls: 'bg-red-50 text-red-700' },
};

export default function AdminJobs() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  const [selectedDefId, setSelectedDefId] = useState('');
  const [paramsText, setParamsText] = useState('{}');
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<JobRequest | null>(null);

  async function token(): Promise<string> {
    const t = await getToken();
    if (!t) throw new Error('Sessione scaduta');
    return t;
  }

  const defsQ = useQuery({
    queryKey: ['admin', 'job-definitions'],
    queryFn: async () => fetchJobDefinitions(await token(), true),
  });

  const requestsQ = useQuery({
    queryKey: ['admin', 'job-requests'],
    queryFn: async () => fetchJobRequests(await token()),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      // polling se almeno un job non è in stato terminale
      const live = data.some((r) => r.status === 'pending' || r.status === 'processing');
      return live ? 3_000 : false;
    },
  });

  const launchM = useMutation({
    mutationFn: async () => {
      if (!selectedDefId) throw new Error('Seleziona una job definition');
      let params: Record<string, unknown>;
      try {
        params = JSON.parse(paramsText || '{}');
        if (typeof params !== 'object' || params === null || Array.isArray(params)) {
          throw new Error('params deve essere un oggetto');
        }
      } catch (e) {
        throw new Error('JSON params non valido: ' + (e as Error).message);
      }
      return createJobRequest(await token(), { jobDefinitionId: selectedDefId, params });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'job-requests'] });
      setError(null);
    },
    onError: (e: Error) => setError(e.message),
  });

  const deleteM = useMutation({
    mutationFn: async (id: string) => deleteJobRequest(await token(), id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'job-requests'] }),
    onError: (e: Error) => setError(e.message),
  });

  const defs = defsQ.data ?? [];
  const requests = requestsQ.data ?? [];
  const defNameById = useMemo(
    () => new Map(defs.map((d) => [d._id, d.name])),
    [defs]
  );

  const onSelectDef = (id: string) => {
    setSelectedDefId(id);
    const def = defs.find((d) => d._id === id);
    setParamsText(JSON.stringify(def?.defaultParams ?? {}, null, 2));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Lancia esecuzioni a partire da una job definition. La consegna a Co-work via Redis sarà attivata in fase successiva — per ora i job vengono creati in stato <em>pending</em>.
        </p>
      </div>

      <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-4 py-3 text-sm">
        <strong>Integrazione Co-work non ancora attiva.</strong> Le richieste create resteranno <em>pending</em> finché non sarà collegato il publisher Redis.
      </div>

      <section className="mb-10 border border-gray-200 rounded-lg p-5 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Lancia un job</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Job definition</label>
            <select
              value={selectedDefId}
              onChange={(e) => onSelectDef(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary-500"
            >
              <option value="">— seleziona —</option>
              {defs.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.type})
                </option>
              ))}
            </select>
            {defs.length === 0 && !defsQ.isLoading && (
              <p className="text-xs text-gray-400 italic mt-1">Nessuna job definition attiva.</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Parametri (JSON)
            </label>
            <textarea
              rows={6}
              value={paramsText}
              onChange={(e) => setParamsText(e.target.value)}
              spellCheck={false}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button
            type="button"
            onClick={() => launchM.mutate()}
            disabled={launchM.isPending || !selectedDefId}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {launchM.isPending ? 'Invio…' : 'Lancia job'}
          </button>
        </div>
      </section>

      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Richieste recenti</h2>

      {requestsQ.isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Definizione</th>
                <th className="px-4 py-3">Stato</th>
                <th className="px-4 py-3">Creato</th>
                <th className="px-4 py-3">Completato</th>
                <th className="px-4 py-3 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    Nessuna richiesta finora.
                  </td>
                </tr>
              ) : (
                requests.map((r) => {
                  const sl = STATUS_LABELS[r.status];
                  return (
                    <tr key={r._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">
                        {defNameById.get(r.jobDefinitionId) ?? <span className="text-gray-400 italic">def. eliminata</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${sl.cls}`}>
                          {sl.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(r.createdAt).toLocaleString('it-IT')}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {r.completedAt ? new Date(r.completedAt).toLocaleString('it-IT') : '—'}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setViewing(r)}
                          className="text-primary-600 hover:text-primary-800 mr-3"
                        >
                          Dettagli
                        </button>
                        {r.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Eliminare questa richiesta in attesa?')) deleteM.mutate(r._id);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            Elimina
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <JobDetailModal job={viewing} defName={defNameById.get(viewing.jobDefinitionId)} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}

function JobDetailModal({
  job, defName, onClose,
}: {
  job: JobRequest;
  defName: string | undefined;
  onClose: () => void;
}) {
  const sl = STATUS_LABELS[job.status];
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-8 px-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 my-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{defName ?? 'Definizione eliminata'}</h2>
            <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded ${sl.cls}`}>
              {sl.label}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
          <dt className="text-gray-500">Job request ID</dt>
          <dd className="font-mono text-xs text-gray-700">{job._id}</dd>
          <dt className="text-gray-500">Creato</dt>
          <dd>{new Date(job.createdAt).toLocaleString('it-IT')}</dd>
          <dt className="text-gray-500">Aggiornato</dt>
          <dd>{new Date(job.updatedAt).toLocaleString('it-IT')}</dd>
          {job.completedAt && (
            <>
              <dt className="text-gray-500">Completato</dt>
              <dd>{new Date(job.completedAt).toLocaleString('it-IT')}</dd>
            </>
          )}
        </dl>

        <Section title="Parametri">
          <pre className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs font-mono overflow-x-auto">
            {JSON.stringify(job.params, null, 2)}
          </pre>
        </Section>

        {job.error && (
          <Section title="Errore">
            <pre className="bg-red-50 border border-red-200 rounded-md p-3 text-xs font-mono text-red-800 whitespace-pre-wrap">
              {job.error}
            </pre>
          </Section>
        )}

        {job.result && (
          <Section title="Risultato">
            <pre className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs whitespace-pre-wrap">
              {job.result}
            </pre>
          </Section>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{title}</h3>
      {children}
    </div>
  );
}
