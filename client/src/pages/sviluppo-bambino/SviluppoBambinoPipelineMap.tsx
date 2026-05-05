import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoProduzioniNav from '../../components/SviluppoBambinoProduzioniNav';
import SviluppoBambinoPipelineNav from '../../components/SviluppoBambinoPipelineNav';
import { fetchPipelineIndex } from '../../services/pipelineService';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import type { PipelineIndex, PipelineStepId, TemaIndexEntry } from '../../types/pipeline';

const F3_STEPS: PipelineStepId[] = [
  'f3_step_1', 'f3_step_2', 'f3_step_3', 'f3_step_4', 'f3_step_5',
  'f3_step_6', 'f3_step_6b', 'f3_step_7', 'f3_step_8', 'f3_step_9', 'f3_step_10',
];

const STEP_LABEL: Record<PipelineStepId, string> = {
  f2_step_2: 'Rilevanza',
  f2_step_2a: 'Verifica nodi',
  f2_step_3: 'Verifica',
  f2_step_4: 'Matrice',
  f2_step_4b: 'CE prototipica',
  f2_step_5: 'Output family',
  f2_step_6: 'Output-tipo vuoto',
  f3_step_1: 'Lettura',
  f3_step_2: 'Stress test',
  f3_step_3: 'Correzione',
  f3_step_4: 'Indistinguibility',
  f3_step_5: 'Audit',
  f3_step_6: 'Proxy',
  f3_step_6b: 'Proxy stabilizzato',
  f3_step_7: 'Trasferibilità',
  f3_step_8: 'Adattamento',
  f3_step_9: 'Dispositivo',
  f3_step_10: 'Stress test dispositivo',
};

function StepBar({ tema }: { tema: TemaIndexEntry }) {
  const done = new Set(tema.steps_completed);
  return (
    <div className="flex gap-0.5 mt-3">
      {F3_STEPS.map((step) => {
        const isDone = done.has(step);
        return (
          <div
            key={step}
            title={`${STEP_LABEL[step]}${isDone ? ' — completato' : ' — non eseguito'}`}
            className={`h-2 flex-1 rounded-sm ${
              isDone ? 'bg-emerald-400' : 'bg-slate-200'
            }`}
          />
        );
      })}
    </div>
  );
}

function TemaCard({ tema }: { tema: TemaIndexEntry }) {
  const hasDevice = tema.canonical_device !== null;
  const content = (
    <div className={`rounded-lg border p-5 transition-colors ${
      hasDevice
        ? 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
        : 'border-slate-200 bg-slate-50'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="font-semibold text-slate-900 leading-snug">{tema.label}</h3>
        <span className="flex-shrink-0 text-xs text-slate-400 font-mono">
          {tema.steps_completed.length}/{F3_STEPS.length}
        </span>
      </div>
      <p className="text-xs text-slate-500 font-mono">{tema.id}</p>
      <StepBar tema={tema} />
      <div className="flex flex-wrap gap-1.5 mt-3">
        {tema.robustezza && (
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded">
            robustezza: {tema.robustezza}
          </span>
        )}
        {tema.dispositivo_sorgente && (
          <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-1.5 py-0.5 rounded">
            deriva da {tema.dispositivo_sorgente.tema_id}
          </span>
        )}
        {!hasDevice && (
          <span className="text-xs text-slate-400 italic">Dispositivo non ancora costruito</span>
        )}
      </div>
    </div>
  );
  return (
    <Link to={`/sviluppo-bambino/produzioni/pipeline/temi/${tema.id}`} className="block">
      {content}
    </Link>
  );
}

function RicercaCard({ ricerca }: { ricerca: PipelineIndex['ricerche'][number] }) {
  return (
    <Link
      to={`/sviluppo-bambino/produzioni/pipeline/ricerche/${ricerca.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="font-semibold text-slate-900 leading-snug">{ricerca.label}</h3>
        <span className="flex-shrink-0 text-xs text-slate-400 font-mono">
          {ricerca.steps_completed.length}/5
        </span>
      </div>
      <p className="text-xs text-slate-500 font-mono">{ricerca.id}</p>
      <div className="flex gap-0.5 mt-3">
        {(['f2_step_1', 'f2_step_2', 'f2_step_3', 'f2_step_4', 'f2_step_5'] as PipelineStepId[]).map((s) => {
          const done = ricerca.steps_completed.includes(s);
          return (
            <div
              key={s}
              title={`${STEP_LABEL[s]}${done ? ' — completato' : ' — non eseguito'}`}
              className={`h-2 flex-1 rounded-sm ${done ? 'bg-sky-400' : 'bg-slate-200'}`}
            />
          );
        })}
      </div>
    </Link>
  );
}

export default function SviluppoBambinoPipelineMap() {
  const [index, setIndex] = useState<PipelineIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = useIsAdmin();

  useEffect(() => {
    let mounted = true;
    fetchPipelineIndex()
      .then((data) => { if (mounted) setIndex(data); })
      .catch((e) => { if (mounted) setError(e.message); });
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <SviluppoBambinoNav />
      <SviluppoBambinoProduzioniNav />
      <SviluppoBambinoPipelineNav />

      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight">
            Pipeline
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
            Ricerche tematiche (F2) e dispositivi configurazionali (F3) prodotti applicando il metodo. Ogni cartella rappresenta uno stato della pipeline e i suoi step completati.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 mb-8">
            Errore nel caricamento dell'index: {error}
          </div>
        )}

        {!index && !error && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400" />
          </div>
        )}

        {index && (
          <div className="grid md:grid-cols-2 gap-8">
            <section>
              <div className="flex items-baseline justify-between mb-1">
                <h2 className="text-lg font-bold text-slate-900">Ricerche tematiche</h2>
                {isAdmin && (
                  <Link
                    to="/sviluppo-bambino/produzioni/pipeline/nuova-ricerca"
                    className="text-xs px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    + Nuova ricerca
                  </Link>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-5">F2 — 5 step per ricerca</p>
              <div className="space-y-3">
                {index.ricerche.map((r) => (
                  <RicercaCard key={r.id} ricerca={r} />
                ))}
                {index.ricerche.length === 0 && (
                  <p className="text-sm text-slate-500 italic">
                    Nessuna ricerca attiva. {isAdmin && 'Clicca "Nuova ricerca" per crearne una.'}
                  </p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Dispositivi</h2>
              <p className="text-sm text-slate-500 mb-5">F3 — 10 step per tema</p>
              <div className="space-y-3">
                {index.temi.map((t) => (
                  <TemaCard key={t.id} tema={t} />
                ))}
              </div>
            </section>
          </div>
        )}

        <p className="text-xs text-slate-400 mt-12 italic">
          Vista densa progettata per desktop. Su mobile il dettaglio richiede schermo largo.
        </p>
      </div>

      <div className="h-16" />
    </div>
  );
}
