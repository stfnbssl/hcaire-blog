import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoProduzioniNav from '../../components/SviluppoBambinoProduzioniNav';
import SviluppoBambinoPipelineNav from '../../components/SviluppoBambinoPipelineNav';
import { fetchPipelineIndex, fetchStressTest } from '../../services/pipelineService';
import type { F3Step10Raw, StressTestCase, TemaIndexEntry } from '../../types/pipeline';

const VERDICT_COLOR: Record<string, string> = {
  regge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  regge_con_riserva: 'bg-orange-100 text-orange-800 border-orange-200',
  fallisce: 'bg-red-100 text-red-800 border-red-200',
};

const ROBUSTEZZA_COLOR: Record<string, string> = {
  alta: 'bg-emerald-100 text-emerald-800',
  media: 'bg-orange-100 text-orange-800',
  bassa: 'bg-red-100 text-red-800',
};

const AMBIGUITY_COLOR: Record<string, string> = {
  basso: 'bg-emerald-100 text-emerald-800',
  medio: 'bg-orange-100 text-orange-800',
  alto: 'bg-red-100 text-red-800',
};

const PROXY_OUTPUT_COLOR: Record<string, string> = {
  aperto: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  predeterminato: 'bg-orange-100 text-orange-800 border-orange-200',
  ambiguo: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  non_classificabile: 'bg-slate-100 text-slate-600 border-slate-200',
};

function CaseDetail({ c }: { c: StressTestCase }) {
  const dims = [
    { key: 'corporeity', label: 'Corporeità' },
    { key: 'field', label: 'Campo intenzionale' },
    { key: 'co_regulation', label: 'Co-regolazione' },
    { key: 'symbolic_mediation', label: 'Mediazione simbolica' },
    { key: 'transformative_passage', label: 'Passaggio trasformativo' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">{c.case_id}</span>
          <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded font-medium">
            {c.case_type.replace(/_/g, ' ')}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${VERDICT_COLOR[c.test_verdict] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
            {c.test_verdict.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{c.case_description}</p>
      </div>

      {/* Observed configuration */}
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Configurazione osservata</h3>
        <div className="rounded-lg border border-slate-200 divide-y divide-slate-100 bg-white">
          {dims.map((d) => {
            const val = c.observed_configuration[d.key];
            if (!val) return null;
            return (
              <div key={d.key} className="px-4 py-3">
                <p className="text-xs font-semibold text-slate-600 mb-1">{d.label}</p>
                <p className="text-sm text-slate-700 leading-relaxed">{val}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Proxy application */}
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Applicazione del proxy</h3>
        <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${c.proxy_application.applicable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
              {c.proxy_application.applicable ? '✓ applicabile' : '✗ non applicabile'}
            </span>
            {c.proxy_application.proxy_output && (
              <span className={`text-sm font-medium px-3 py-1 rounded-md border ${PROXY_OUTPUT_COLOR[c.proxy_application.proxy_output] ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                {c.proxy_application.proxy_output}
              </span>
            )}
          </div>
          {c.proxy_application.reason && (
            <p className="text-sm text-slate-600 leading-relaxed italic">{c.proxy_application.reason}</p>
          )}
          {c.proxy_application.required_observations_present && c.proxy_application.required_observations_present.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1.5">Osservazioni presenti</p>
              <ul className="space-y-1">
                {c.proxy_application.required_observations_present.map((o, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-700">
                    <span className="text-emerald-500">✓</span><span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {c.proxy_application.missing_observations && c.proxy_application.missing_observations.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-1.5">Osservazioni mancanti</p>
              <ul className="space-y-1">
                {c.proxy_application.missing_observations.map((o, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-700">
                    <span className="text-red-400">✗</span><span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Device performance */}
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Performance del dispositivo</h3>
        <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${c.device_performance.readable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              {c.device_performance.readable ? '✓ leggibile' : '✗ non leggibile'}
            </span>
            {c.device_performance.ambiguity_level && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${AMBIGUITY_COLOR[c.device_performance.ambiguity_level] ?? 'bg-slate-100 text-slate-700'}`}>
                ambiguità: {c.device_performance.ambiguity_level}
              </span>
            )}
          </div>
          {c.device_performance.what_it_reads && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1">Cosa legge</p>
              <p className="text-sm text-slate-700 leading-relaxed">{c.device_performance.what_it_reads}</p>
            </div>
          )}
          {c.device_performance.what_becomes_unclear && (
            <div className="rounded-md bg-yellow-50 border border-yellow-100 p-3">
              <p className="text-xs font-semibold text-yellow-800 mb-1">Cosa rimane non chiaro</p>
              <p className="text-sm text-slate-700 leading-relaxed">{c.device_performance.what_becomes_unclear}</p>
            </div>
          )}
        </div>
      </section>

      {/* Breaking point */}
      {c.breaking_point.present && (
        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Punto di rottura</h3>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 space-y-2">
            {c.breaking_point.where && (
              <p className="text-sm text-slate-800"><span className="font-semibold">Dove: </span>{c.breaking_point.where}</p>
            )}
            {c.breaking_point.why && (
              <p className="text-sm text-slate-700 leading-relaxed"><span className="font-semibold">Perché: </span>{c.breaking_point.why}</p>
            )}
          </div>
        </section>
      )}

      {/* False positive risk */}
      {c.false_positive_risk.risk_present && (
        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Rischio falso positivo</h3>
          <div className="rounded-lg border border-red-200 bg-red-50/60 p-4 space-y-2">
            {c.false_positive_risk.description && (
              <p className="text-sm text-slate-700 leading-relaxed">{c.false_positive_risk.description}</p>
            )}
            {c.false_positive_risk.mitigation && (
              <div>
                <p className="text-xs font-semibold text-red-800 uppercase tracking-wider mb-1">Mitigazione</p>
                <p className="text-sm text-slate-700 leading-relaxed">{c.false_positive_risk.mitigation}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default function SviluppoBambinoPipelineStressTest() {
  const { temaId } = useParams<{ temaId: string }>();
  const [tema, setTema] = useState<TemaIndexEntry | null>(null);
  const [data, setData] = useState<F3Step10Raw | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const index = await fetchPipelineIndex();
        const t = index.temi.find((x) => x.id === temaId);
        if (!t) throw new Error(`Tema non trovato: ${temaId}`);
        if (mounted) setTema(t);
        const d = await fetchStressTest(t);
        if (mounted) setData(d);
      } catch (e) {
        if (mounted) setError((e as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [temaId]);

  const cases = useMemo(() => data?.stress_test_results ?? [], [data]);
  const selectedCase = cases[selectedIdx];

  return (
    <div>
      <SviluppoBambinoNav />
      <SviluppoBambinoProduzioniNav />
      <SviluppoBambinoPipelineNav />

      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <Link to="/sviluppo-bambino/produzioni/pipeline" className="text-xs text-slate-400 hover:text-slate-200 mb-3 inline-block">
            ← Mappa pipeline
          </Link>
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">Stress test</h1>
              <p className="text-slate-400 text-sm">
                {tema?.label} <span className="font-mono text-slate-500">· {temaId}</span>
              </p>
            </div>
            {data?.global_assessment?.device_robustness && (
              <span className={`text-sm font-bold px-4 py-2 rounded-md ${ROBUSTEZZA_COLOR[data.global_assessment.device_robustness] ?? 'bg-slate-200 text-slate-800'}`}>
                Robustezza: {data.global_assessment.device_robustness}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400" />
          </div>
        )}

        {!loading && !error && !data && (
          <p className="text-sm text-slate-500 italic py-20 text-center">
            Stress test non ancora eseguito per questo tema.
          </p>
        )}

        {data && cases.length > 0 && (
          <>
            {/* Mobile toggle */}
            <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex gap-2 mb-4 -mx-4 sm:-mx-6">
              <button
                onClick={() => setMobileView('list')}
                className={`text-sm px-3 py-1.5 rounded-md ${
                  mobileView === 'list' ? 'bg-slate-100 text-slate-800 font-medium' : 'text-slate-500'
                }`}
              >
                Casi ({cases.length})
              </button>
              <button
                onClick={() => setMobileView('detail')}
                className={`text-sm px-3 py-1.5 rounded-md flex-1 text-left truncate ${
                  mobileView === 'detail' ? 'bg-slate-100 text-slate-800 font-medium' : 'text-slate-500'
                }`}
              >
                {selectedCase?.case_id}
              </button>
            </div>

            <div className="flex gap-6 items-start">
              {/* Sidebar */}
              <aside className={`w-full md:w-72 flex-shrink-0 md:sticky md:top-44 ${mobileView === 'detail' ? 'hidden md:block' : 'block'}`}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
                  {cases.length} casi
                </p>
                <div className="space-y-1">
                  {cases.map((c, idx) => (
                    <button
                      key={c.case_id}
                      onClick={() => { setSelectedIdx(idx); setMobileView('detail'); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all border ${
                        idx === selectedIdx
                          ? 'bg-slate-100 border-slate-300'
                          : 'border-transparent hover:bg-slate-50 hover:border-slate-100'
                      }`}
                    >
                      <p className={`text-sm font-medium leading-snug mb-1 ${idx === selectedIdx ? 'text-slate-900' : 'text-slate-700'}`}>
                        {c.case_id}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-slate-500">{c.case_type.replace(/_/g, ' ')}</span>
                      </div>
                      <span className={`inline-block mt-2 text-xs font-medium px-1.5 py-0.5 rounded border ${VERDICT_COLOR[c.test_verdict] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {c.test_verdict.replace(/_/g, ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </aside>

              {/* Detail */}
              <div className={`flex-1 min-w-0 ${mobileView === 'list' ? 'hidden md:block' : 'block'}`}>
                {selectedCase && <CaseDetail c={selectedCase} />}
              </div>
            </div>

            {/* Global assessment footer */}
            {data.global_assessment && (
              <section className="mt-16 pt-8 border-t border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Valutazione globale</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {data.global_assessment.main_strengths && data.global_assessment.main_strengths.length > 0 && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">Punti di forza</p>
                      <ul className="space-y-2">
                        {data.global_assessment.main_strengths.map((s, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-700">
                            <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                            <span className="leading-relaxed">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.global_assessment.main_weaknesses && data.global_assessment.main_weaknesses.length > 0 && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-4">
                      <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-3">Debolezze</p>
                      <ul className="space-y-2">
                        {data.global_assessment.main_weaknesses.map((s, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-700">
                            <span className="text-orange-500 flex-shrink-0 mt-0.5">⚠</span>
                            <span className="leading-relaxed">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.global_assessment.required_corrections && data.global_assessment.required_corrections.length > 0 && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Correzioni richieste</p>
                      <ul className="space-y-2">
                        {data.global_assessment.required_corrections.map((s, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-700">
                            <span className="text-slate-400 flex-shrink-0 mt-0.5">→</span>
                            <span className="leading-relaxed">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <div className="h-16" />
    </div>
  );
}
