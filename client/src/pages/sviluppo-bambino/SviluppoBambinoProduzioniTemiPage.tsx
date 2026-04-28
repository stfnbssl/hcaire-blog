import { useState } from 'react';
import rawData from '../../data/theme-discovery-v1.json';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoProduzioniNav from '../../components/SviluppoBambinoProduzioniNav';

type Priority = 'alta' | 'media' | 'bassa';

type Theme = {
  theme_label_provisional: string;
  starting_point: string;
  structural_focus: string;
  what_it_is: string;
  what_it_is_not: string;
  why_it_matters: string;
  definition_draft: string;
  definition_risks: string[];
  exploratory_priority: Priority;
  pilot_suitability: Priority;
  human_review_notes: string;
  possible_axes_involved: { axis_id: string; axis_name: string; reason: string }[];
  possible_structural_nodes: string[];
  possible_bridge_concepts: string[];
  source_signals: { source_type: string; source_title: string; signal_summary: string; recency_relevance: string }[];
};

const THEMES = rawData.candidate_themes as Theme[];

const PRIORITY_BADGE: Record<Priority, string> = {
  alta: 'bg-emerald-100 text-emerald-700',
  media: 'bg-amber-100 text-amber-700',
  bassa: 'bg-gray-100 text-gray-500',
};

const AXIS_COLOR: Record<string, string> = {
  asse_1: 'bg-indigo-50 text-indigo-700',
  asse_2: 'bg-rose-50 text-rose-700',
  asse_3: 'bg-amber-50 text-amber-700',
  asse_4: 'bg-orange-50 text-orange-700',
  asse_5: 'bg-purple-50 text-purple-700',
  asse_6: 'bg-teal-50 text-teal-700',
};

function ThemeDetail({ theme }: { theme: Theme }) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${PRIORITY_BADGE[theme.exploratory_priority]}`}>
            Priorità: {theme.exploratory_priority}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${PRIORITY_BADGE[theme.pilot_suitability]}`}>
            Pilota: {theme.pilot_suitability}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-amber-950 mb-4 leading-snug">
          {theme.theme_label_provisional}
        </h2>
        <p className="text-sm italic text-amber-800 leading-relaxed border-l-4 border-amber-400 pl-4">
          {theme.definition_draft}
        </p>
      </div>

      {/* Cos'è / Cos'è non */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-5">
          <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">Cos'è</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{theme.what_it_is}</p>
        </div>
        <div className="rounded-lg border border-red-100 bg-red-50 p-5">
          <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3">Cos'è non</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{theme.what_it_is_not}</p>
        </div>
      </div>

      {/* Punto di partenza */}
      <div className="rounded-lg border border-gray-100 bg-white p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Punto di partenza</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{theme.starting_point}</p>
      </div>

      {/* Focus strutturale */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Focus strutturale</h3>
        <p className="text-sm text-slate-700 leading-relaxed">{theme.structural_focus}</p>
      </div>

      {/* Perché conta */}
      <div className="rounded-lg border border-sky-100 bg-sky-50 p-5">
        <h3 className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-3">Perché conta</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{theme.why_it_matters}</p>
      </div>

      {/* Assi coinvolti */}
      <div className="rounded-lg border border-gray-100 bg-white p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Assi strutturali coinvolti</h3>
        <div className="space-y-4">
          {theme.possible_axes_involved.map((ax) => (
            <div key={ax.axis_id} className="flex gap-3">
              <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded h-fit mt-0.5 ${AXIS_COLOR[ax.axis_id] ?? 'bg-gray-100 text-gray-600'}`}>
                {ax.axis_id.replace('asse_', 'Asse ')}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{ax.axis_name}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{ax.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nodi e concetti ponte */}
      <div className="rounded-lg border border-gray-100 bg-white p-5">
        <div className="mb-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nodi strutturali</h3>
          <div className="flex flex-wrap gap-1.5">
            {theme.possible_structural_nodes.map((node) => (
              <span key={node} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
                {node}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Concetti ponte</h3>
          <div className="flex flex-wrap gap-1.5">
            {theme.possible_bridge_concepts.map((c) => (
              <span key={c} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Fonti */}
      <div className="rounded-lg border border-gray-100 bg-white p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Segnali fonte</h3>
        <div className="space-y-4">
          {theme.source_signals.map((s, i) => (
            <div key={i} className="flex gap-3">
              <span className={`flex-shrink-0 text-xs font-medium px-1.5 py-0.5 rounded h-fit mt-0.5 ${s.source_type === 'web_search' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                {s.source_type === 'web_search' ? 'web' : 'ref'}
              </span>
              <div>
                <p className="text-xs font-semibold text-gray-800 leading-snug">{s.source_title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{s.signal_summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rischi */}
      <div className="rounded-lg border border-orange-100 bg-orange-50 p-5">
        <h3 className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-3">Rischi di derivazione</h3>
        <ul className="space-y-2.5">
          {theme.definition_risks.map((r, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-gray-700">
              <span className="text-orange-400 flex-shrink-0 mt-0.5">⚠</span>
              <span className="leading-relaxed">{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Note di revisione */}
      <div className="rounded-lg border border-gray-100 bg-gray-50 p-5">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Note di revisione</h3>
        <p className="text-sm text-gray-600 italic leading-relaxed">{theme.human_review_notes}</p>
      </div>
    </div>
  );
}

export default function SviluppoBambinoProduzioniTemiPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  function selectTheme(idx: number) {
    setSelectedIdx(idx);
    setMobileView('detail');
  }

  return (
    <div>
      <SviluppoBambinoNav />
      <SviluppoBambinoProduzioniNav />

      {/* Header */}
      <div className="bg-amber-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight">
            Temi
          </h1>
          <p className="text-amber-200 text-base sm:text-lg max-w-2xl leading-relaxed">
            Dieci temi candidati per le prime produzioni. Seleziona un tema per esplorarne la densità strutturale, le fonti e il potenziale operativo.
          </p>
        </div>
      </div>

      {/* Mobile toggle bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2 flex gap-2 sticky top-[6.5rem] z-20">
        <button
          onClick={() => setMobileView('list')}
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            mobileView === 'list' ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          Lista ({THEMES.length})
        </button>
        <button
          onClick={() => setMobileView('detail')}
          className={`text-sm px-3 py-1.5 rounded-md transition-colors flex-1 text-left truncate ${
            mobileView === 'detail' ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          {THEMES[selectedIdx].theme_label_provisional}
        </button>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 items-start">

          {/* Left: theme list */}
          <div className={`w-full md:w-72 lg:w-80 flex-shrink-0 md:sticky md:top-40 ${mobileView === 'detail' ? 'hidden md:block' : 'block'}`}>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider px-1 mb-2">
              {THEMES.length} temi
            </p>
            <div className="space-y-1">
              {THEMES.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => selectTheme(idx)}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-all border ${
                    idx === selectedIdx
                      ? 'bg-amber-50 border-amber-200 shadow-sm'
                      : 'border-transparent hover:bg-gray-50 hover:border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`flex-shrink-0 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      idx === selectedIdx ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium leading-snug ${idx === selectedIdx ? 'text-amber-900' : 'text-gray-700'}`}>
                        {t.theme_label_provisional}
                      </p>
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${PRIORITY_BADGE[t.exploratory_priority]}`}>
                          P: {t.exploratory_priority}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${PRIORITY_BADGE[t.pilot_suitability]}`}>
                          Pilota: {t.pilot_suitability}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: detail */}
          <div className={`flex-1 min-w-0 ${mobileView === 'list' ? 'hidden md:block' : 'block'}`}>
            <ThemeDetail theme={THEMES[selectedIdx]} />
          </div>

        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
