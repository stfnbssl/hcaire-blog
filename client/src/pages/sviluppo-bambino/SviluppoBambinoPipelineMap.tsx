import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoProduzioniNav from '../../components/SviluppoBambinoProduzioniNav';
import SviluppoBambinoPipelineNav from '../../components/SviluppoBambinoPipelineNav';
import { fetchPipelineIndex } from '../../services/pipelineService';
import { pipelineOrchestratorService } from '../../services/pipelineOrchestratorService';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import type {
  PipelineIndex,
  PipelineStepId,
  TemaIndexEntry,
  RicercaIndexEntry,
  PipelineContextDoc,
  TemaAmbito,
} from '../../types/pipeline';

const F2_STEPS: PipelineStepId[] = [
  'f2_step_2', 'f2_step_2a', 'f2_step_3', 'f2_step_4', 'f2_step_4b', 'f2_step_5', 'f2_step_6',
];

const F3_STEPS: PipelineStepId[] = [
  'f3_step_1', 'f3_step_2', 'f3_step_3', 'f3_step_4', 'f3_step_5',
];

const STEP_LABEL: Record<PipelineStepId, string> = {
  f2_step_2: 'Rilevanza',
  f2_step_2a: 'Verifica nodi',
  f2_step_3: 'Verifica',
  f2_step_4: 'Matrice',
  f2_step_4b: 'CE prototipica',
  f2_step_5: 'Output family',
  f2_step_6: 'Output-tipo vuoto',
  f3_step_1: 'Nodo + funzione',
  f3_step_2: 'Micro-dispositivo',
  f3_step_3: 'Stress test e correzione',
  f3_step_4: 'Coerenza F3',
  f3_step_5: 'Output-tipo contestualizzato',
};

function ProgressBar({ steps, completed, color }: { steps: PipelineStepId[]; completed: Set<string>; color: 'sky' | 'emerald' | 'slate' }) {
  const colorClass = color === 'sky' ? 'bg-sky-400' : color === 'emerald' ? 'bg-emerald-400' : 'bg-slate-300';
  return (
    <div className="flex gap-0.5">
      {steps.map((s) => {
        const done = completed.has(s);
        return (
          <div
            key={s}
            title={`${STEP_LABEL[s]}${done ? ' — completato' : ' — non eseguito'}`}
            className={`h-1.5 flex-1 rounded-sm ${done ? colorClass : 'bg-slate-200'}`}
          />
        );
      })}
    </div>
  );
}

// Riga compatta della colonna sinistra. Click = seleziona la ricerca a destra.
// Densità target: una riga = una linea (~32px) per visualizzarne una decina senza scroll.
function RicercaRow({ ricerca, selected, onSelect }: {
  ricerca: RicercaIndexEntry;
  selected: boolean;
  onSelect: () => void;
}) {
  const total = F2_STEPS.length;
  const done = ricerca.steps_completed.length;
  const isComplete = done >= total;
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-md border px-2.5 py-1.5 transition-colors flex items-center gap-2 ${
        selected
          ? 'border-sky-400 bg-sky-50 ring-1 ring-sky-200'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <span
        className={`flex-shrink-0 inline-block w-1.5 h-1.5 rounded-full ${
          isComplete ? 'bg-emerald-400' : done > 0 ? 'bg-sky-400' : 'bg-slate-300'
        }`}
        aria-hidden
      />
      <p className={`flex-1 min-w-0 text-sm leading-tight truncate ${selected ? 'text-sky-900 font-medium' : 'text-slate-900'}`}>
        {ricerca.label}
      </p>
      <span className="flex-shrink-0 text-xs text-slate-400 font-mono tabular-nums">
        {done}/{total}
      </span>
    </button>
  );
}

// Riga della colonna destra: un ambito (promosso o no).
function AmbitoRow({ ambito, tema }: {
  ambito: TemaAmbito;
  tema: TemaIndexEntry | null;
}) {
  const completed = useMemo(() => new Set(tema?.steps_completed ?? []), [tema]);
  const promoted = ambito.promoted_to_f3 && ambito.promoted_tema_id;
  const headerNode = (
    <>
      <div className="flex items-baseline justify-between gap-2 mb-0.5">
        <p className="text-sm font-medium text-slate-900 leading-tight truncate">{ambito.label}</p>
        <span className="flex-shrink-0 text-xs text-slate-400 font-mono">
          {promoted ? `${tema?.steps_completed.length ?? 0}/${F3_STEPS.length}` : '— / —'}
        </span>
      </div>
      <p className="text-xs text-slate-500 leading-tight">
        <span className="capitalize">{ambito.data.target_domain}</span>
        {ambito.data.target_subdomain && <> · {ambito.data.target_subdomain}</>}
        {ambito.data.age_range && <> · {ambito.data.age_range}</>}
        {ambito.data.setting && <> · {ambito.data.setting}</>}
      </p>
      <div className="mt-1.5">
        {promoted
          ? <ProgressBar steps={F3_STEPS} completed={completed} color="emerald" />
          : <p className="text-xs text-slate-400 italic">Pipeline F3 non ancora aperta</p>
        }
      </div>
      {tema?.robustezza && (
        <span className="inline-block text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded mt-1.5">
          robustezza: {tema.robustezza}
        </span>
      )}
    </>
  );
  if (promoted && ambito.promoted_tema_id) {
    return (
      <Link
        to={`/sviluppo-bambino/produzioni/pipeline/temi/${encodeURIComponent(ambito.promoted_tema_id)}`}
        className="block rounded-md border border-slate-200 bg-white px-3 py-2 hover:border-slate-300 hover:shadow-sm transition-colors"
      >
        {headerNode}
      </Link>
    );
  }
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2">
      {headerNode}
    </div>
  );
}

// Riga "legacy": tema F3 esistente non collegato ad alcun ambito (tema creato col vecchio bridge).
function LegacyTemaRow({ tema }: { tema: TemaIndexEntry }) {
  const completed = useMemo(() => new Set(tema.steps_completed), [tema.steps_completed]);
  return (
    <Link
      to={`/sviluppo-bambino/produzioni/pipeline/temi/${encodeURIComponent(tema.id)}`}
      className="block rounded-md border border-slate-200 bg-white px-3 py-2 hover:border-slate-300 hover:shadow-sm transition-colors"
    >
      <div className="flex items-baseline justify-between gap-2 mb-0.5">
        <p className="text-sm font-medium text-slate-900 leading-tight truncate">{tema.label}</p>
        <span className="flex-shrink-0 text-xs text-slate-400 font-mono">
          {tema.steps_completed.length}/{F3_STEPS.length}
        </span>
      </div>
      <p className="text-xs text-slate-500 font-mono leading-tight truncate">{tema.id}</p>
      <div className="mt-1.5">
        <ProgressBar steps={F3_STEPS} completed={completed} color="emerald" />
      </div>
    </Link>
  );
}

export default function SviluppoBambinoPipelineMap() {
  const [index, setIndex] = useState<PipelineIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRicercaId, setSelectedRicercaId] = useState<string | null>(null);
  const [selectedRicercaCtx, setSelectedRicercaCtx] = useState<PipelineContextDoc | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const isAdmin = useIsAdmin();

  // 1) Fetch dell'indice (lista ricerche + temi)
  useEffect(() => {
    let mounted = true;
    fetchPipelineIndex()
      .then((data) => {
        if (!mounted) return;
        setIndex(data);
        // Auto-seleziona la prima ricerca per non lasciare il pannello destro vuoto.
        if (data.ricerche.length > 0) {
          setSelectedRicercaId((curr) => curr ?? data.ricerche[0].id);
        }
      })
      .catch((e) => { if (mounted) setError(e.message); });
    return () => { mounted = false; };
  }, []);

  // 2) Fetch del context completo della ricerca selezionata (porta dietro tema_ambiti).
  useEffect(() => {
    if (!selectedRicercaId) { setSelectedRicercaCtx(null); return; }
    let cancelled = false;
    setLoadingDetail(true);
    setSelectedRicercaCtx(null);
    pipelineOrchestratorService.getRicerca(selectedRicercaId)
      .then((data) => { if (!cancelled) setSelectedRicercaCtx(data.context); })
      .catch(() => { if (!cancelled) setSelectedRicercaCtx(null); })
      .finally(() => { if (!cancelled) setLoadingDetail(false); });
    return () => { cancelled = true; };
  }, [selectedRicercaId]);

  // Deriva: il tema corrente della ricerca (se c'è); ambiti associati; temi figli (per resolve F3 progress).
  const detail = useMemo(() => {
    if (!selectedRicercaCtx || !index) return null;
    const ambitiMap = (selectedRicercaCtx.tema_ambiti ?? {}) as Record<string, TemaAmbito[]>;
    const themeIds = Object.keys(ambitiMap);
    // La ricerca è monotematica: prendiamo il primo (e in pratica unico) theme_id.
    const themeId = themeIds[0] ?? selectedRicercaCtx.theme_id ?? null;
    const ambiti = themeId ? (ambitiMap[themeId] ?? []) : [];
    const temaById = new Map(index.temi.map((t) => [t.id, t]));
    // Temi "legacy": creati col vecchio bridge, hanno ricerca_origine ma non un ambito.
    const promotedTemaIds = new Set(ambiti.map((a) => a.promoted_tema_id).filter(Boolean) as string[]);
    const legacyTemi = index.temi.filter((t) =>
      t.ricerca_origine === selectedRicercaId && !promotedTemaIds.has(t.id),
    );
    return { themeId, ambiti, temaById, legacyTemi };
  }, [selectedRicercaCtx, index, selectedRicercaId]);

  return (
    <div>
      <SviluppoBambinoNav />
      <SviluppoBambinoProduzioniNav />
      <SviluppoBambinoPipelineNav />

      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight">Pipeline</h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
            Ricerche tematiche (F2) a sinistra, ambiti operativi del tema selezionato (F3) a destra.
            Ogni ambito apre una pipeline F3 indipendente: stesso tema, contesti diversi.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 mb-6">
            Errore nel caricamento dell'index: {error}
          </div>
        )}

        {!index && !error && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400" />
          </div>
        )}

        {index && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* COLONNA SINISTRA: ricerche (master) */}
            <section>
              <div className="flex items-baseline justify-between mb-1">
                <h2 className="text-base font-bold text-slate-900">Ricerche tematiche (F2)</h2>
                {isAdmin && (
                  <Link
                    to="/sviluppo-bambino/produzioni/pipeline/nuova-ricerca"
                    className="text-xs px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
                  >+ Nuova ricerca</Link>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-3">{F2_STEPS.length} step per ricerca</p>
              <div className="space-y-1.5">
                {index.ricerche.map((r) => (
                  <RicercaRow
                    key={r.id}
                    ricerca={r}
                    selected={r.id === selectedRicercaId}
                    onSelect={() => setSelectedRicercaId(r.id)}
                  />
                ))}
                {index.ricerche.length === 0 && (
                  <p className="text-sm text-slate-500 italic">
                    Nessuna ricerca attiva. {isAdmin && 'Clicca "Nuova ricerca" per crearne una.'}
                  </p>
                )}
              </div>
            </section>

            {/* COLONNA DESTRA: ambiti del tema selezionato (detail) */}
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-1">Ambiti del tema selezionato</h2>
              <p className="text-xs text-slate-500 mb-3">{F3_STEPS.length} step per pipeline F3 (1 per ambito)</p>

              {!selectedRicercaId && (
                <p className="text-sm text-slate-500 italic">Seleziona una ricerca a sinistra.</p>
              )}

              {selectedRicercaId && loadingDetail && (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-400" />
                </div>
              )}

              {selectedRicercaId && !loadingDetail && detail && (
                <>
                  {detail.ambiti.length === 0 && detail.legacyTemi.length === 0 && (
                    <div className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                      Nessun ambito definito per questo tema. Apri il banner di decisione F2→F3
                      sulla pagina della ricerca per crearne uno.
                    </div>
                  )}

                  {detail.ambiti.length > 0 && (
                    <div className="space-y-1.5">
                      {detail.ambiti.map((a) => (
                        <AmbitoRow
                          key={a.ambito_id}
                          ambito={a}
                          tema={a.promoted_tema_id ? (detail.temaById.get(a.promoted_tema_id) ?? null) : null}
                        />
                      ))}
                    </div>
                  )}

                  {detail.legacyTemi.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-1.5">
                        Temi legacy (senza ambito)
                      </p>
                      <div className="space-y-1.5">
                        {detail.legacyTemi.map((t) => <LegacyTemaRow key={t.id} tema={t} />)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}

        <p className="text-xs text-slate-400 mt-10 italic">
          Vista densa progettata per desktop. Su mobile le due colonne si impilano.
        </p>
      </div>

      <div className="h-16" />
    </div>
  );
}
