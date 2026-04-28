// Pagina dedicata di avvio di una nuova ricerca tematica F2.
// Differenze dal vecchio modal:
//   - testo esplicativo lungo (server/content/.../nuova-ricerca-temi.md)
//   - 2 campi: ID + Note di indirizzo (textarea)
//   - "Avvia la ricerca" fa 3 chiamate in sequenza:
//     1) createRicerca (POST /pipeline/ricerche)
//     2) submitExternalInput per research_scope (solo se note non vuote)
//     3) runStep f2_step_1
// Il pulsante della PipelineMap punta ora a questa pagina (Link) — l'innesco non cambia.

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoProduzioniNav from '../../components/SviluppoBambinoProduzioniNav';
import SviluppoBambinoPipelineNav from '../../components/SviluppoBambinoPipelineNav';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { sviluppoBambinoApi } from '../../services/staticContentService';
import { pipelineOrchestratorService } from '../../services/pipelineOrchestratorService';

type LaunchStage = 'idle' | 'creating' | 'attaching_notes' | 'launching' | 'done';

function deriveLabel(id: string): string {
  const base = id.trim().replace(/-/g, ' ').trim();
  if (!base) return '';
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export default function SviluppoBambinoPipelineNuovaRicerca() {
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [explainer, setExplainer]   = useState<string | null>(null);
  const [explainerErr, setExplainerErr] = useState<string | null>(null);

  const [ricercaId, setRicercaId] = useState('');
  const [notes, setNotes]         = useState('');
  const [stage, setStage]         = useState<LaunchStage>('idle');
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    sviluppoBambinoApi.getProduzioniNuovaRicercaInfo()
      .then((res) => { if (mounted) setExplainer(res.content); })
      .catch((e) => { if (mounted) setExplainerErr((e as Error).message); });
    return () => { mounted = false; };
  }, []);

  const idTrimmed = ricercaId.trim();
  const idValid = /^[a-z0-9-]+$/.test(idTrimmed) && idTrimmed.length >= 3 && !idTrimmed.startsWith('-') && !idTrimmed.endsWith('-');
  const valid = idValid && stage === 'idle';

  async function handleSubmit() {
    setSubmitErr(null);
    const id    = idTrimmed;
    const label = deriveLabel(id);
    const trimmedNotes = notes.trim();

    try {
      // 1. Crea il context
      setStage('creating');
      await pipelineOrchestratorService.createRicerca(id, label, getToken);

      // 2. Allega le note se presenti (input esterno research_scope)
      if (trimmedNotes.length > 0) {
        setStage('attaching_notes');
        await pipelineOrchestratorService.submitExternalInput(
          id, 'f2_step_1', 'research_scope', { notes: trimmedNotes }, getToken,
        );
      }

      // 3. Lancia step 1
      setStage('launching');
      await pipelineOrchestratorService.runStep(id, 'f2_step_1', {}, getToken);

      setStage('done');
      navigate(`/sviluppo-bambino/produzioni/pipeline/ricerche/${encodeURIComponent(id)}`);
    } catch (e) {
      const errMsg = (e as Error).message;
      const stageLabel = stage === 'creating' ? 'creazione ricerca'
        : stage === 'attaching_notes' ? 'invio note di indirizzo'
        : stage === 'launching' ? 'avvio step 1'
        : 'esecuzione';
      setSubmitErr(`Errore durante ${stageLabel}: ${errMsg}`);
      setStage('idle');
    }
  }

  if (!isAdmin) {
    return (
      <div>
        <SviluppoBambinoNav />
        <SviluppoBambinoProduzioniNav />
        <SviluppoBambinoPipelineNav />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            La creazione di una nuova ricerca richiede ruolo admin.
          </div>
        </div>
      </div>
    );
  }

  const submitLabel =
    stage === 'creating'         ? 'Creazione ricerca…' :
    stage === 'attaching_notes'  ? 'Invio note…' :
    stage === 'launching'        ? 'Avvio step 1…' :
    stage === 'done'             ? 'Completato →' :
                                   'Avvia la ricerca';

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
          <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">Nuova ricerca tematica</h1>
          <p className="text-slate-400 text-sm">Avvio guidato di un ciclo F2 a partire da Step 1 (Discovery).</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[1fr_auto] gap-8">
        {/* Sezione esplicativa */}
        <div className="prose prose-slate max-w-none order-2 lg:order-1">
          {explainerErr && (
            <div className="not-prose rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              Testo esplicativo non disponibile: {explainerErr}
            </div>
          )}
          {!explainer && !explainerErr && (
            <div className="not-prose flex justify-center py-10">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-400" />
            </div>
          )}
          {explainer && <MarkdownRenderer content={explainer} />}
        </div>

        {/* Form sticky a destra (su desktop) o sopra (su mobile) */}
        <div className="order-1 lg:order-2 lg:w-[360px] lg:sticky lg:top-[10rem] self-start">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Form di avvio</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ID ricerca *</label>
                <input
                  type="text"
                  value={ricercaId}
                  onChange={(e) => setRicercaId(e.target.value.toLowerCase())}
                  placeholder="es. lettura-condivisa-0-3"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm font-mono"
                  disabled={stage !== 'idle'}
                />
                <p className={`text-xs mt-1 ${ricercaId && !idValid ? 'text-red-700' : 'text-slate-500'}`}>
                  Identifica questa ricerca in modo univoco. Solo a-z, 0-9, trattini. Min 3 caratteri.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Note di indirizzo (opzionale)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  placeholder="Es. Privilegiare temi osservabili in episodi brevi in contesti clinici 0–3. Sono interessato a fenomeni di regolazione corporea nella diade…"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm leading-relaxed"
                  disabled={stage !== 'idle'}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Orientano il fuoco della ricerca senza vincolarla. Vedi gli esempi nella sezione esplicativa.
                </p>
              </div>

              {submitErr && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                  {submitErr}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!valid}
                className="w-full text-sm font-medium px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors"
              >
                {submitLabel}
              </button>

              <p className="text-xs text-slate-400 leading-relaxed">
                "Avvia la ricerca" crea il context, allega le note (se presenti) come <span className="font-mono">research_scope</span>, e lancia subito Step 1. Il processo richiede tempo: una volta avviato, sarai reindirizzato sulla pagina della ricerca dove monitorare i log.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
