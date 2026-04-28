import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoProduzioniNav from '../../components/SviluppoBambinoProduzioniNav';
import SviluppoBambinoPipelineNav from '../../components/SviluppoBambinoPipelineNav';
import { fetchPipelineIndex, fetchDevice } from '../../services/pipelineService';
import type { DeviceSnapshot, TemaIndexEntry, OperativeProxy } from '../../types/pipeline';

const OUTPUT_COLOR: Record<string, string> = {
  aperto: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  predeterminato: 'bg-orange-100 text-orange-800 border-orange-200',
  ambiguo: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  non_classificabile: 'bg-slate-100 text-slate-600 border-slate-200',
};

const WARNING_ICON: Record<string, string> = {
  comportamentismo: '🔴',
  normatività: '🟠',
  tecnicismo: '🟡',
  riduzione_cognitiva: '🔵',
  tecnicismo_riabilitativo: '🟣',
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function ValidationCheck({ ok, label, notes }: { ok?: boolean; label: string; notes?: string }) {
  if (ok === undefined) return null;
  return (
    <div className="flex gap-3 py-2 border-b border-slate-100 last:border-b-0">
      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
        ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
      }`}>
        {ok ? '✓' : '✗'}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {notes && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notes}</p>}
      </div>
    </div>
  );
}

function ProxySection({ proxy }: { proxy: OperativeProxy }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-900">{proxy.proxy_name}</h3>
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cosa misura</p>
        <p className="text-sm text-slate-700 leading-relaxed">{proxy.what_it_measures}</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Logica di decisione</p>
        <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono bg-slate-50 p-4 rounded border border-slate-100 leading-relaxed">
{proxy.decision_logic}
        </pre>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Output ammessi</p>
        <div className="flex flex-wrap gap-2">
          {proxy.allowed_outputs.map((o) => (
            <span
              key={o}
              className={`text-sm font-medium px-3 py-1 rounded-md border ${
                OUTPUT_COLOR[o] ?? 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {o}
            </span>
          ))}
        </div>
      </div>

      {proxy.applicability_conditions && proxy.applicability_conditions.length > 0 && (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-5">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">Condizioni di applicabilità</p>
          <ul className="space-y-2">
            {proxy.applicability_conditions.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {proxy.non_applicability_conditions && proxy.non_applicability_conditions.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Condizioni di non-applicabilità</p>
          <ul className="space-y-2">
            {proxy.non_applicability_conditions.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="text-slate-400 flex-shrink-0 mt-0.5">→</span>
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {proxy.epistemic_limit && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Limite epistemico</p>
          <p className="text-sm text-slate-700 leading-relaxed">{proxy.epistemic_limit}</p>
        </div>
      )}
    </div>
  );
}

function DeviceView({ device }: { device: DeviceSnapshot }) {
  // Difensivo: il file potrebbe non rispettare lo schema canonico.
  const isShapeValid = Array.isArray(device.reading_focus)
    && Array.isArray(device.operative_proxies)
    && Array.isArray(device.observability_requirements);

  const dimSections = useMemo(
    () => (Array.isArray(device.reading_focus)
      ? device.reading_focus.map((r) => ({ id: slugify(r.dimension), label: r.dimension }))
      : []),
    [device.reading_focus],
  );

  if (!isShapeValid) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-5">
        <p className="font-semibold text-amber-900 mb-2">Formato dispositivo non standard</p>
        <p className="text-sm text-amber-800 mb-3">
          Il file di output non rispetta lo schema canonico di un dispositivo (campi attesi:
          <code className="mx-1 bg-amber-100 px-1 rounded">reading_focus</code>,
          <code className="mx-1 bg-amber-100 px-1 rounded">operative_proxies</code>,
          <code className="mx-1 bg-amber-100 px-1 rounded">observability_requirements</code>
          come array di oggetti). Probabilmente il prompt CLAUDE.md dello step ha generato
          una variante (es. con chiavi italiane o struttura ad oggetto). Va allineato
          allo schema dei dispositivi esistenti.
        </p>
        <details className="text-xs text-amber-900">
          <summary className="cursor-pointer hover:underline">Mostra struttura ricevuta</summary>
          <pre className="mt-2 bg-white border border-amber-200 p-3 rounded max-h-96 overflow-auto whitespace-pre-wrap">
            {JSON.stringify(device, null, 2).slice(0, 5000)}
          </pre>
        </details>
      </div>
    );
  }

  const hasProxy = device.operative_proxies.length > 0;
  const hasObs = device.observability_requirements.length > 0;
  const hasNcr = device.non_classifiability_rules.length > 0;
  const hasWarnings = device.interpretive_warnings.length > 0;
  const hasNonPermitted = device.non_permitted_transformations.length > 0;
  const hasValidation = device.validation_structural_check !== undefined;

  return (
    <div className="flex gap-8 items-start">
      {/* Nav rail */}
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-44">
        <nav className="space-y-0.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Dimensioni</p>
          {dimSections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="block px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md"
            >
              {s.label}
            </a>
          ))}
          <div className="border-t border-slate-100 my-2" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Operatività</p>
          {hasProxy && <a href="#proxy" className="block px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md">Proxy operativo</a>}
          {hasObs && <a href="#osservabilita" className="block px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md">Osservabilità</a>}
          {hasNcr && <a href="#non-classificabilita" className="block px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md">Non classificabilità</a>}
          {hasWarnings && <a href="#warning" className="block px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md">Warning interpretativi</a>}
          {hasNonPermitted && <a href="#vietate" className="block px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md">Trasformazioni vietate</a>}
          {hasValidation && <>
            <div className="border-t border-slate-100 my-2" />
            <a href="#validazione" className="block px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50 rounded-md font-medium">✓ Validazione strutturale</a>
          </>}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 space-y-12">
        {/* Function */}
        <section>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Funzione del dispositivo</h2>
          <p className="text-base text-slate-700 leading-relaxed">{device.function}</p>
        </section>

        {/* Structural reference */}
        <section>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Configurazione nucleare</h2>
          <p className="text-sm italic text-slate-600 leading-relaxed border-l-4 border-slate-300 pl-4 mb-4">
            {device.structural_reference.core_configuration}
          </p>
          <div className="flex flex-wrap gap-2">
            {device.structural_reference.axes.map((a) => (
              <span key={a} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
                {a.replace('asse_', 'Asse ')}
              </span>
            ))}
            {device.structural_reference.nodes.map((n) => (
              <span key={n} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {n}
              </span>
            ))}
            {device.structural_reference.bridge_concepts.map((b, i) => (
              <span key={i} className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-medium">
                ↔ {b}
              </span>
            ))}
          </div>
        </section>

        {/* Dimensions */}
        {device.reading_focus.map((r, i) => (
          <section key={i} id={slugify(r.dimension)} className="scroll-mt-44">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-xs font-bold text-slate-400 font-mono">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="text-xl font-bold text-slate-900">{r.dimension}</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{r.description}</p>
          </section>
        ))}

        {/* Structural questions */}
        {device.structural_questions.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Domande strutturali</h2>
            <ol className="space-y-4">
              {device.structural_questions.map((q, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 text-xs text-slate-400 font-mono pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-sm text-slate-700 leading-relaxed italic">{q}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Proxy */}
        {hasProxy && (
          <section id="proxy" className="scroll-mt-44">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Proxy operativo</h2>
            {device.operative_proxies.map((p, i) => <ProxySection key={p.proxy_id ?? i} proxy={p} />)}
          </section>
        )}

        {/* Osservabilità */}
        {hasObs && (
          <section id="osservabilita" className="scroll-mt-44">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Osservabilità richieste</h2>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold text-slate-700 text-xs uppercase tracking-wider">ID</th>
                    <th className="text-left px-4 py-2 font-semibold text-slate-700 text-xs uppercase tracking-wider">Label</th>
                    <th className="text-left px-4 py-2 font-semibold text-slate-700 text-xs uppercase tracking-wider hidden md:table-cell">Tipo</th>
                    <th className="text-left px-4 py-2 font-semibold text-slate-700 text-xs uppercase tracking-wider hidden md:table-cell">Dipendenza</th>
                    <th className="text-left px-4 py-2 font-semibold text-slate-700 text-xs uppercase tracking-wider">Richiesto</th>
                  </tr>
                </thead>
                <tbody>
                  {device.observability_requirements.map((o) => (
                    <tr key={o.id} className={`border-t border-slate-100 ${o.required_for_proxy ? 'bg-amber-50/40' : ''}`}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500 align-top">{o.id}</td>
                      <td className="px-4 py-3 align-top">
                        <p className="font-medium text-slate-800">{o.label}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{o.description}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 align-top hidden md:table-cell">{o.type}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 align-top hidden md:table-cell">{o.observer_dependency}</td>
                      <td className="px-4 py-3 align-top">
                        {o.required_for_proxy ? (
                          <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded">sì</span>
                        ) : (
                          <span className="text-xs text-slate-400">no</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Non classificabilità */}
        {hasNcr && (
          <section id="non-classificabilita" className="scroll-mt-44">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Regole di non-classificabilità</h2>
            <p className="text-xs text-slate-500 italic mb-4">
              Dato assente (<span className="bg-slate-100 text-slate-600 px-1.5 rounded">non_classificabile</span>) ≠ dato presente ma non discriminante (<span className="bg-yellow-100 text-yellow-800 px-1.5 rounded">ambiguo</span>)
            </p>
            <div className="space-y-3">
              {device.non_classifiability_rules.map((r) => (
                <div key={r.id} className={`rounded-lg border p-4 ${
                  r.required_output === 'ambiguo'
                    ? 'border-yellow-200 bg-yellow-50/50'
                    : 'border-slate-200 bg-slate-50/70'
                }`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm font-medium text-slate-800 flex-1">{r.trigger}</p>
                    <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded ${
                      r.required_output === 'ambiguo'
                        ? 'bg-yellow-200 text-yellow-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      → {r.required_output}
                    </span>
                  </div>
                  {(r.rationale || r.description) && (
                    <p className="text-xs text-slate-600 leading-relaxed">{r.rationale ?? r.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Warning */}
        {hasWarnings && (
          <section id="warning" className="scroll-mt-44">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Warning interpretativi</h2>
            <div className="space-y-3">
              {device.interpretive_warnings.map((w, i) => (
                <details key={i} className="rounded-lg border border-slate-200 bg-white group">
                  <summary className="cursor-pointer px-4 py-3 flex items-center gap-3 list-none">
                    <span className="text-base">{WARNING_ICON[w.risk_type] ?? '⚠️'}</span>
                    <span className="text-sm font-medium text-slate-800 flex-1">{w.risk_type.replace(/_/g, ' ')}</span>
                    <span className="text-slate-300 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{w.description}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Trasformazioni vietate */}
        {hasNonPermitted && (
          <section id="vietate" className="scroll-mt-44">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Trasformazioni non permesse</h2>
            <ul className="space-y-3">
              {device.non_permitted_transformations.map((t, i) => (
                <li key={i} className="flex gap-3 rounded-lg border border-red-100 bg-red-50/40 p-4">
                  <span className="flex-shrink-0 text-red-400 mt-0.5">⊘</span>
                  <span className="text-sm text-slate-700 leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Validazione */}
        {hasValidation && device.validation_structural_check && (
          <section id="validazione" className="scroll-mt-44">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Validazione strutturale</h2>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-5">
              <ValidationCheck
                ok={device.validation_structural_check.configurational_logic_preserved}
                label="Logica configurazionale preservata"
                notes={device.validation_structural_check.configurational_logic_notes}
              />
              <ValidationCheck
                ok={device.validation_structural_check.no_psychological_inference}
                label="Nessuna inferenza psicologica"
                notes={device.validation_structural_check.no_psychological_inference_notes}
              />
              <ValidationCheck
                ok={device.validation_structural_check.no_circularity}
                label="Nessuna circolarità"
                notes={device.validation_structural_check.no_circularity_notes}
              />
              <ValidationCheck
                ok={device.validation_structural_check.proxy_observable}
                label="Proxy osservabile"
                notes={device.validation_structural_check.proxy_observable_notes}
              />
              <ValidationCheck
                ok={device.validation_structural_check.self_limiting}
                label="Self-limiting"
                notes={device.validation_structural_check.self_limiting_notes}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function SviluppoBambinoPipelineDeviceViewer() {
  const { temaId } = useParams<{ temaId: string }>();
  const [tema, setTema] = useState<TemaIndexEntry | null>(null);
  const [device, setDevice] = useState<DeviceSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const index = await fetchPipelineIndex();
        const t = index.temi.find((x) => x.id === temaId);
        if (!t) throw new Error(`Tema non trovato: ${temaId}`);
        if (mounted) setTema(t);
        const d = await fetchDevice(t);
        if (mounted) setDevice(d);
      } catch (e) {
        if (mounted) setError((e as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [temaId]);

  return (
    <div>
      <SviluppoBambinoNav />
      <SviluppoBambinoProduzioniNav />
      <SviluppoBambinoPipelineNav />

      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <Link
            to="/sviluppo-bambino/produzioni/pipeline"
            className="text-xs text-slate-400 hover:text-slate-200 mb-3 inline-block"
          >
            ← Mappa pipeline
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">
            {tema?.label ?? 'Dispositivo'}
          </h1>
          <p className="text-slate-400 text-sm font-mono">{temaId}</p>
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

        {!loading && !error && !device && (
          <p className="text-sm text-slate-500 italic py-20 text-center">
            Dispositivo non ancora costruito per questo tema.
          </p>
        )}

        {device && <DeviceView device={device} />}
      </div>

      <div className="h-16" />
    </div>
  );
}
