import { useState } from 'react';
import { CASO_GUIDA_F3 } from '../../data/corso-fase3/caso-guida';

interface TemplateState {
  ceOrigine: string;
  nodoDominante: string;
  funzione: string;
  campoBersaglio: string;
  microAzioni: string[];
  tempoReale: string;
  indicatoreRisonanza: string;
}

const FUNZIONI = [
  { id: 'STABILIZZARE', badge: 'STA', nome: 'Stabilizzare', azione: 'Ridurre la disorganizzazione in atto', colore: 'var(--corso-fn-stabilizzare)' },
  { id: 'AMPLIARE', badge: 'AMP', nome: 'Ampliare', azione: "Aumentare l'esplorabilità del campo", colore: 'var(--corso-fn-ampliare)' },
  { id: 'MEDIAZIONE', badge: 'MED', nome: 'Mediare', azione: 'Sostenere una transizione già in corso', colore: 'var(--corso-fn-mediare)' },
  { id: 'PROTEGGERE', badge: 'PRO', nome: 'Proteggere', azione: 'Prevenire il sovraccarico prima che avvenga', colore: 'var(--corso-fn-proteggere)' },
];

const DEFAULT_TEMPLATE: TemplateState = {
  ceOrigine: CASO_GUIDA_F3.ce.grammaticale,
  nodoDominante: `${CASO_GUIDA_F3.f3.nodoDominante.codice} — ${CASO_GUIDA_F3.f3.nodoDominante.nome}`,
  funzione: CASO_GUIDA_F3.f3.funzione,
  campoBersaglio: CASO_GUIDA_F3.f3.campoBersaglio,
  microAzioni: [...CASO_GUIDA_F3.f3.microAzioni],
  tempoReale: CASO_GUIDA_F3.f3.tempoReale,
  indicatoreRisonanza: CASO_GUIDA_F3.f3.indicatoreRisonanza,
};

const STEPS = [
  {
    id: 1,
    label: 'CE di origine',
    domanda: 'Descrivi la CE di partenza in una frase:',
    aiuto: "Non è una lista di nodi: è la lettura del campo come configurazione relazionale.",
  },
  {
    id: 2,
    label: 'Nodo dominante',
    domanda: 'Quale nodo, se attivato, muove il campo nella direzione evolutiva?',
    aiuto: "Ricorda: non è necessariamente il nodo più basso. È quello la cui attivazione fa la differenza.",
  },
  {
    id: 3,
    label: 'Funzione',
    domanda: 'Cosa deve fare il dispositivo sul campo?',
    aiuto: "Una delle quattro funzioni F3. La tecnica viene dopo, non ora.",
  },
  {
    id: 4,
    label: 'Campo bersaglio',
    domanda: 'Quale condizione relazionale deve cambiare?',
    aiuto: "Il soggetto è il campo — non il bambino. «Stabilità dello scambio condiviso» → sì. «Il bambino condivide di più» → no.",
  },
  {
    id: 5,
    label: 'Micro-azioni',
    domanda: 'Quali azioni concrete modificano il campo? (3–5)',
    aiuto: "Ogni azione ha come soggetto un adulto o una condizione — non il bambino.",
  },
  {
    id: 6,
    label: 'Tempo reale',
    domanda: 'In quanto tempo il dispositivo si realizza nel contesto reale?',
    aiuto: "Non il tempo ideale: il tempo che il contesto effettivamente permette.",
  },
  {
    id: 7,
    label: 'Indicatore di risonanza',
    domanda: 'Come si riconosce che il campo ha risposto?',
    aiuto: "Non un progresso del bambino: una qualità dello scambio relazionale osservabile in tempo reale.",
  },
];

function generaDescrizioneNaturale(state: TemplateState): string {
  const microAzioniTesto = state.microAzioni
    .map((a, i) => `${i + 1}. ${a}`)
    .join('\n');
  return (
    `In questa configurazione — ${state.ceOrigine} — ` +
    `l'azione si orienta verso ${state.nodoDominante}, ` +
    `con funzione ${state.funzione.toUpperCase()}. ` +
    `Il campo bersaglio è: ${state.campoBersaglio}. ` +
    `Le micro-azioni contestualizzate sono:\n${microAzioniTesto}\n` +
    `Il dispositivo si realizza in ${state.tempoReale}. ` +
    `Il campo ha risposto quando: ${state.indicatoreRisonanza}.`
  );
}

export default function F3Builder() {
  const [state, setState] = useState<TemplateState>(DEFAULT_TEMPLATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setState(DEFAULT_TEMPLATE);
    setCurrentStep(1);
    setShowResult(false);
  };

  const updateField = <K extends keyof TemplateState>(key: K, value: TemplateState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const updateMicroAzione = (i: number, value: string) => {
    setState((prev) => {
      const next = [...prev.microAzioni];
      next[i] = value;
      return { ...prev, microAzioni: next };
    });
  };

  const addMicroAzione = () => {
    if (state.microAzioni.length >= 5) return;
    setState((prev) => ({ ...prev, microAzioni: [...prev.microAzioni, ''] }));
  };

  const removeMicroAzione = (i: number) => {
    if (state.microAzioni.length <= 3) return;
    setState((prev) => ({
      ...prev,
      microAzioni: prev.microAzioni.filter((_, idx) => idx !== i),
    }));
  };

  const next = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const prev = () => {
    if (showResult) {
      setShowResult(false);
      return;
    }
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(generaDescrizioneNaturale(state));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const step = STEPS[currentStep - 1];

  return (
    <div className="corso-f3b">
      <header className="corso-f3b__bar">
        <div className="corso-f3b__steps" aria-label={`Passo ${currentStep} di ${STEPS.length}`}>
          {STEPS.map((s) => (
            <span
              key={s.id}
              className={`corso-f3b__dot ${
                s.id === currentStep && !showResult ? 'corso-f3b__dot--current' : ''
              } ${s.id < currentStep || showResult ? 'corso-f3b__dot--done' : ''}`}
              title={`${s.id}. ${s.label}`}
            />
          ))}
          {showResult && <span className="corso-f3b__dot corso-f3b__dot--current corso-f3b__dot--final">✓</span>}
        </div>
        <button type="button" className="corso-f3b__reset" onClick={reset}>
          ↺ Ripristina caso-guida
        </button>
      </header>

      {!showResult && (
        <div className="corso-f3b__panel">
          <div className="corso-f3b__head">
            <span className="corso-f3b__num">{currentStep}</span>
            <div>
              <h3 className="corso-f3b__label">{step.label}</h3>
              <p className="corso-f3b__q"><em>{step.domanda}</em></p>
            </div>
          </div>

          <div className="corso-f3b__field">
            {currentStep === 1 && (
              <textarea
                className="corso-f3b__textarea"
                value={state.ceOrigine}
                onChange={(e) => updateField('ceOrigine', e.target.value)}
                rows={3}
              />
            )}
            {currentStep === 2 && (
              <input
                type="text"
                className="corso-f3b__input"
                value={state.nodoDominante}
                onChange={(e) => updateField('nodoDominante', e.target.value)}
              />
            )}
            {currentStep === 3 && (
              <div className="corso-f3b__fn-grid">
                {FUNZIONI.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`corso-f3b__fn-card ${state.funzione === f.id ? 'corso-f3b__fn-card--selected' : ''}`}
                    style={{ ['--corso-fn-color' as never]: f.colore } as React.CSSProperties}
                    onClick={() => updateField('funzione', f.id)}
                    aria-pressed={state.funzione === f.id}
                  >
                    <span className="corso-f3b__fn-badge">{f.badge}</span>
                    <span className="corso-f3b__fn-name">{f.nome}</span>
                    <span className="corso-f3b__fn-azione">{f.azione}</span>
                  </button>
                ))}
              </div>
            )}
            {currentStep === 4 && (
              <input
                type="text"
                className="corso-f3b__input"
                value={state.campoBersaglio}
                onChange={(e) => updateField('campoBersaglio', e.target.value)}
              />
            )}
            {currentStep === 5 && (
              <div className="corso-f3b__list">
                {state.microAzioni.map((a, i) => (
                  <div key={i} className="corso-f3b__list-row">
                    <span className="corso-f3b__list-num">{i + 1}.</span>
                    <input
                      type="text"
                      className="corso-f3b__input"
                      value={a}
                      onChange={(e) => updateMicroAzione(i, e.target.value)}
                    />
                    <button
                      type="button"
                      className="corso-f3b__list-rm"
                      onClick={() => removeMicroAzione(i)}
                      disabled={state.microAzioni.length <= 3}
                      aria-label={`Rimuovi azione ${i + 1}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="corso-f3b__list-add"
                  onClick={addMicroAzione}
                  disabled={state.microAzioni.length >= 5}
                >
                  + Aggiungi azione ({state.microAzioni.length}/5)
                </button>
              </div>
            )}
            {currentStep === 6 && (
              <input
                type="text"
                className="corso-f3b__input"
                value={state.tempoReale}
                onChange={(e) => updateField('tempoReale', e.target.value)}
              />
            )}
            {currentStep === 7 && (
              <textarea
                className="corso-f3b__textarea"
                value={state.indicatoreRisonanza}
                onChange={(e) => updateField('indicatoreRisonanza', e.target.value)}
                rows={3}
              />
            )}
          </div>

          <p className="corso-f3b__help">{step.aiuto}</p>

          <div className="corso-f3b__nav">
            <button
              type="button"
              className="corso-f3b__btn corso-f3b__btn--ghost"
              onClick={prev}
              disabled={currentStep === 1}
            >
              ← Indietro
            </button>
            <span className="corso-f3b__progress">
              Passo {currentStep} di {STEPS.length}
            </span>
            <button
              type="button"
              className="corso-f3b__btn corso-f3b__btn--primary"
              onClick={next}
            >
              {currentStep === STEPS.length ? 'Componi descrizione →' : 'Avanti →'}
            </button>
          </div>
        </div>
      )}

      {showResult && (
        <div className="corso-f3b__result">
          <header className="corso-f3b__result-head">
            <h3>Descrizione naturale del dispositivo</h3>
            <button type="button" className="corso-f3b__btn corso-f3b__btn--ghost" onClick={prev}>
              ← Modifica
            </button>
          </header>
          <pre className="corso-f3b__result-text">{generaDescrizioneNaturale(state)}</pre>
          <div className="corso-f3b__result-actions">
            <button type="button" className="corso-f3b__btn corso-f3b__btn--primary" onClick={copy}>
              {copied ? '✓ Copiato' : 'Copia descrizione'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
