import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoProduzioniNav from '../../components/SviluppoBambinoProduzioniNav';
import SviluppoBambinoPipelineNav from '../../components/SviluppoBambinoPipelineNav';
import DeviceLineage from '../../components/pipeline/DeviceLineage';
import CorrectionsLog from '../../components/pipeline/CorrectionsLog';
import ProcessNarrative from '../../components/pipeline/ProcessNarrative';
import OrchestrationPanel from '../../components/pipeline/orchestration/OrchestrationPanel';
import GuidaPipelinePanel from '../../components/pipeline/GuidaPipelinePanel';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { usePipelineOrchestration } from '../../hooks/usePipelineOrchestration';
import {
  fetchPipelineIndex,
  fetchCorrectionsLog,
  fetchRevisioni,
} from '../../services/pipelineService';
import type {
  TemaIndexEntry,
  CorrectionEntry,
} from '../../types/pipeline';

type Section = 'overview' | 'lineage' | 'corrections' | 'narrative' | 'esegui' | 'guida';

const ROBUSTEZZA_COLOR: Record<string, string> = {
  alta: 'bg-emerald-100 text-emerald-800',
  media: 'bg-orange-100 text-orange-800',
  bassa: 'bg-red-100 text-red-800',
};

function Chip({ children, color = 'slate' }: { children: React.ReactNode; color?: 'slate' | 'emerald' | 'orange' | 'red' | 'purple' }) {
  const cmap = {
    slate: 'bg-slate-100 text-slate-700',
    emerald: 'bg-emerald-100 text-emerald-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
  };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded ${cmap[color]}`}>{children}</span>;
}

function StepQuickLinks({ tema }: { tema: TemaIndexEntry }) {
  const canonical = tema.canonical_device !== null;
  const hasStressTest = !!tema.files.f3_step_10;
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <Link
        to={`/sviluppo-bambino/produzioni/pipeline/temi/${tema.id}/dispositivo`}
        className={`rounded-lg border p-4 transition-colors ${
          canonical
            ? 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm'
            : 'border-slate-200 bg-slate-50 opacity-60 pointer-events-none'
        }`}
      >
        <p className="font-semibold text-slate-900 mb-1">Dispositivo</p>
        <p className="text-xs text-slate-500">
          {canonical ? 'Vista strutturale del device finale' : 'Non ancora costruito'}
        </p>
      </Link>
      <Link
        to={`/sviluppo-bambino/produzioni/pipeline/temi/${tema.id}/stress-test`}
        className={`rounded-lg border p-4 transition-colors ${
          hasStressTest
            ? 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm'
            : 'border-slate-200 bg-slate-50 opacity-60 pointer-events-none'
        }`}
      >
        <p className="font-semibold text-slate-900 mb-1">Stress test</p>
        <p className="text-xs text-slate-500">
          {hasStressTest ? `Casi di test + robustezza: ${tema.robustezza ?? '—'}` : 'Non eseguito'}
        </p>
      </Link>
    </div>
  );
}

export default function SviluppoBambinoPipelineDeviceOverview() {
  const { temaId } = useParams<{ temaId: string }>();
  const isAdmin = useIsAdmin();
  const orchestration = usePipelineOrchestration({ contextId: temaId ?? '', contextType: 'tema' });
  const [tema, setTema] = useState<TemaIndexEntry | null>(null);
  const [corrections, setCorrections] = useState<Array<{ step: string; entries: CorrectionEntry[] }>>([]);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [section, setSection] = useState<Section>('overview');
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
        const [corr, md] = await Promise.all([
          fetchCorrectionsLog(t),
          fetchRevisioni(t),
        ]);
        if (mounted) {
          setCorrections(corr);
          setMarkdown(md);
        }
      } catch (e) {
        if (mounted) setError((e as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [temaId]);

  const sections: Array<{ id: Section; label: string; available: boolean }> = [
    { id: 'overview', label: 'Panoramica', available: true },
    { id: 'lineage', label: 'Provenienza', available: true },
    { id: 'corrections', label: 'Correzioni', available: corrections.length > 0 },
    { id: 'narrative', label: 'Storia', available: !!markdown },
    ...(isAdmin ? [{ id: 'esegui' as Section, label: 'Esegui', available: true }] : []),
    { id: 'guida' as Section, label: 'Guida', available: true },
  ];

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
          <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">
            {tema?.label ?? 'Tema'}
          </h1>
          <p className="text-slate-400 text-sm font-mono mb-4">{temaId}</p>
          {tema && (
            <div className="flex flex-wrap gap-2">
              {tema.robustezza && (
                <span className={`text-xs font-bold px-3 py-1 rounded ${ROBUSTEZZA_COLOR[tema.robustezza] ?? 'bg-slate-200 text-slate-800'}`}>
                  Robustezza: {tema.robustezza}
                </span>
              )}
              <Chip color="slate">{tema.steps_completed.length} step eseguiti</Chip>
              {(tema.steps_skipped?.length ?? 0) > 0 && (
                <Chip color="slate">{tema.steps_skipped!.length} saltato</Chip>
              )}
              {(tema.correzioni_residue ?? 0) > 0 && (
                <Chip color="orange">{tema.correzioni_residue} correzioni residue</Chip>
              )}
              {tema.dispositivo_sorgente && (
                <Chip color="purple">
                  derivato da {tema.dispositivo_sorgente.tema_id}
                </Chip>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section tabs */}
      {tema && (
        <div className="sticky top-[9rem] z-10 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex gap-1 overflow-x-auto py-2" style={{ scrollbarWidth: 'none' }}>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  disabled={!s.available}
                  className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                    !s.available
                      ? 'text-slate-300 cursor-not-allowed'
                      : section === s.id
                        ? 'bg-slate-900 text-white font-medium'
                        : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400" />
          </div>
        )}

        {tema && !loading && (
          <div className="max-w-4xl">
            {section === 'overview' && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Accesso rapido</h2>
                  <StepQuickLinks tema={tema} />
                </section>

                {tema.ricerca_origine && (
                  <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Ricerca di origine</h2>
                    <p className="text-sm text-slate-600 mb-2">
                      Questo tema proviene dalla ricerca F2{' '}
                      <Link
                        to={`/sviluppo-bambino/produzioni/pipeline/ricerche/${encodeURIComponent(tema.ricerca_origine)}`}
                        className="font-mono text-emerald-700 hover:text-emerald-900 underline decoration-dotted"
                      >
                        {tema.ricerca_origine}
                      </Link>
                      {tema.theme_id && (
                        <> come tema <span className="font-mono text-slate-800">{tema.theme_id}</span></>
                      )}
                      .
                    </p>
                  </section>
                )}

                <section>
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Step eseguiti</h2>
                  <DeviceLineage tema={tema} />
                </section>
              </div>
            )}

            {section === 'lineage' && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Provenienza e derivazione</h2>
                <p className="text-sm text-slate-500 mb-6 max-w-2xl">
                  Ogni step espandibile mostra i file di input pipeline, gli input esterni forniti dal ricercatore,
                  il dispositivo sorgente (se il tema deriva da un altro) e il file di output prodotto.
                </p>
                <DeviceLineage tema={tema} />
              </div>
            )}

            {section === 'corrections' && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Fratture e correzioni</h2>
                <p className="text-sm text-slate-500 mb-6 max-w-2xl">
                  Episodi in cui uno stress test ha rivelato un punto di rottura del dispositivo,
                  con la correzione applicata (o rinviata) e il razionale.
                </p>
                <CorrectionsLog groups={corrections} />
              </div>
            )}

            {section === 'narrative' && markdown && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Storia decisionale</h2>
                <p className="text-sm text-slate-500 mb-6 max-w-2xl">
                  Dalle note di revisione del tema: quali decisioni episodiche hanno reso questo dispositivo quello che è.
                </p>
                <ProcessNarrative markdown={markdown} />
              </div>
            )}

            {section === 'esegui' && isAdmin && temaId && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Orchestrazione</h2>
                <p className="text-sm text-slate-500 mb-6 max-w-2xl">
                  Lancia, monitora e verifica gli step della pipeline F3 per questo tema. Le azioni richiedono ruolo admin.
                </p>
                <OrchestrationPanel temaId={temaId} orchestration={orchestration} />
              </div>
            )}

            {section === 'guida' && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Guida alla pipeline</h2>
                <p className="text-sm text-slate-500 mb-6 max-w-2xl">
                  Riferimento interpretativo per il ricercatore: perché ogni step esiste, quali decisioni spettano a te, comportamenti attesi e punti di attenzione.
                </p>
                <GuidaPipelinePanel />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="h-16" />
    </div>
  );
}
