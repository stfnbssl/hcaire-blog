import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoProduzioniNav from '../../components/SviluppoBambinoProduzioniNav';
import SviluppoBambinoPipelineNav from '../../components/SviluppoBambinoPipelineNav';
import OrchestrationPanel from '../../components/pipeline/orchestration/OrchestrationPanel';
import GuidaPipelinePanel from '../../components/pipeline/GuidaPipelinePanel';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { usePipelineOrchestration } from '../../hooks/usePipelineOrchestration';
import { fetchPipelineIndex } from '../../services/pipelineService';
import type { TemaIndexEntry } from '../../types/pipeline';

type Section = 'esegui' | 'guida';

export default function SviluppoBambinoPipelineRicercaOverview() {
  const { ricercaId } = useParams<{ ricercaId: string }>();
  const isAdmin = useIsAdmin();
  const orchestration = usePipelineOrchestration({
    contextId: ricercaId ?? '',
    contextType: 'ricerca',
  });
  const [section, setSection] = useState<Section>('esegui');
  const [derivedTemi, setDerivedTemi] = useState<TemaIndexEntry[]>([]);

  const ctx = orchestration.context;

  // Fetch dei temi figli (quelli con ricerca_origine = ricercaId)
  useEffect(() => {
    if (!ricercaId) return;
    let mounted = true;
    fetchPipelineIndex()
      .then((idx) => {
        if (!mounted) return;
        setDerivedTemi(idx.temi.filter((t) => t.ricerca_origine === ricercaId));
      })
      .catch(() => { /* non bloccante: la lista resta vuota */ });
    return () => { mounted = false; };
  }, [ricercaId, ctx?.steps_completed.length]);

  const sections: Array<{ id: Section; label: string; available: boolean }> = [
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
            {ctx?.label ?? 'Ricerca tematica'}
          </h1>
          <p className="text-slate-400 text-sm font-mono mb-4">{ricercaId}</p>
          {ctx && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {ctx.steps_completed.length}/5 step F2 eseguiti
              </span>
              {ctx.pending_decision && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Decisione pendente
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section tabs */}
      {ctx && (
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
        {!isAdmin && section === 'esegui' && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Le azioni di orchestrazione richiedono ruolo admin. Sei in modalità sola lettura.
          </div>
        )}

        {orchestration.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 mb-4">
            {orchestration.error}
          </div>
        )}

        {orchestration.isLoading && !ctx && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400" />
          </div>
        )}

        {ctx && ricercaId && (
          <div className="max-w-4xl">
            {section === 'esegui' && isAdmin && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Orchestrazione F2</h2>
                <p className="text-sm text-slate-500 mb-6 max-w-2xl">
                  Lancia, monitora e verifica gli step della ricerca tematica F2. Step 1 produce i temi candidati;
                  step 2-5 li raffinano fino alla output family. Al termine si decide il tema con cui aprire F3.
                </p>
                <OrchestrationPanel temaId={ricercaId} orchestration={orchestration} />

                {derivedTemi.length > 0 && (
                  <section className="mt-10">
                    <h3 className="text-base font-bold text-slate-900 mb-2">Temi derivati ({derivedTemi.length})</h3>
                    <p className="text-sm text-slate-500 mb-4 max-w-2xl">
                      Temi della Fase 3 sviluppati a partire da questa ricerca (link `ricerca_origine`).
                    </p>
                    <div className="space-y-2">
                      {derivedTemi.map((t) => (
                        <Link
                          key={t.id}
                          to={`/sviluppo-bambino/produzioni/pipeline/temi/${t.id}`}
                          className="block rounded-md border border-slate-200 bg-white p-3 hover:border-slate-300 hover:shadow-sm transition-colors"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">{t.label}</p>
                              <p className="text-xs text-slate-500 font-mono">{t.id}</p>
                            </div>
                            <span className="text-xs text-slate-500 flex-shrink-0">
                              {t.steps_completed.length} step F3 eseguiti
                              {t.robustezza && ` · robustezza ${t.robustezza}`}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
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
