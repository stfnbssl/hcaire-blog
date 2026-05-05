import { Module } from '../types';
import { CASO_GUIDA_F3 } from '../caso-guida';

// ─── Helpers ─────────────────────────────────────────────────────────────

const stateClass = (s: string) => {
  if (s === '↑') return 'corso-ce-table__state--up';
  if (s === '↓') return 'corso-ce-table__state--down';
  return 'corso-ce-table__state--neu';
};

const ceTableHtml = (highlights: string[] = []) => {
  const ce = CASO_GUIDA_F3.ce;
  const labels = CASO_GUIDA_F3.letturaNodi;
  const set = new Set(highlights);
  const rows = (Object.keys(ce.nodi) as Array<keyof typeof ce.nodi>)
    .map((codice) => {
      const n = ce.nodi[codice];
      const isHl = set.has(codice as string);
      const lettura = labels[codice as string] ?? '';
      const rowCls = isHl ? 'corso-ce-row--highlight' : 'corso-ce-row--dim';
      const styleAttr = isHl
        ? `style="--corso-ce-row-color: ${n.colore}; background: color-mix(in srgb, ${n.colore} 12%, transparent);"`
        : '';
      return `
        <tr class="${rowCls}" ${styleAttr}>
          <td class="corso-ce-table__node">
            <span class="corso-ce-table__node-dot" style="background: ${n.colore};"></span>
            ${codice} — ${n.label}
          </td>
          <td class="corso-ce-table__state ${stateClass(n.stato)}">${n.stato}</td>
          <td class="corso-ce-table__lett">${lettura}</td>
        </tr>
      `;
    })
    .join('');
  return `
    <table class="corso-ce-table corso-ce-table--m3">
      <thead>
        <tr><th>Nodo</th><th>Stato</th><th>Lettura</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="corso-ce-summary corso-ce-summary--compact">
      <span><strong>R:</strong> ${ce.relazione}</span>
      <span><strong>D:</strong> ${ce.direzione}</span>
      <span><strong>T:</strong> ${ce.tenuta}</span>
      <span><strong>A:</strong> ${ce.abitabilita}</span>
    </div>
  `;
};

// ─── Aggregato pipeline caso-guida ───────────────────────────────────────

const PIPELINE_STEPS = [
  {
    id: 'scena',
    label: '① Scena',
    sublabel: 'Bilancio pediatrico, libro illustrato',
    fase: 'F2' as const,
    colore: 'var(--corso-primary)',
    dato: 'Bambino 18–24 mesi · genitore presente · 3–5 minuti',
  },
  {
    id: 'ce',
    label: '② CE',
    sublabel: 'Configurazione Evolutiva',
    fase: 'F2' as const,
    colore: 'var(--corso-f2)',
    dato: 'N1~ N2↑ N3~ N4↓ · R: N2→N3 · D↗ · T2 · A±',
  },
  {
    id: 'nodo',
    label: '③ Nodo dominante',
    sublabel: 'Quello che muove di più il campo',
    fase: 'F3' as const,
    colore: 'var(--corso-f3)',
    dato: `${CASO_GUIDA_F3.f3.nodoDominante.codice} — ${CASO_GUIDA_F3.f3.nodoDominante.nome}`,
  },
  {
    id: 'funzione',
    label: '④ Funzione',
    sublabel: 'Stabilizzare / Ampliare / Mediare / Proteggere',
    fase: 'F3' as const,
    colore: 'var(--corso-f3)',
    dato: 'MEDIAZIONE',
    funzioneColore: 'var(--corso-fn-mediare)',
  },
  {
    id: 'template',
    label: '⑤ Template',
    sublabel: 'Campo bersaglio + 5 micro-azioni',
    fase: 'F3' as const,
    colore: 'var(--corso-f3)',
    dato: '5 micro-azioni · 5 minuti · campo bersaglio definito',
  },
  {
    id: 'tipo',
    label: '⑥ Tipo U',
    sublabel: 'Forma universale dell\'azione',
    fase: 'F3' as const,
    colore: 'var(--corso-f3)',
    dato: 'U2 Sintonizzazione + U4 Mediazione Simbolica',
  },
  {
    id: 'verifica',
    label: '⑦ Verifica',
    sublabel: 'Coerenza e indicatore di risonanza',
    fase: 'F3' as const,
    colore: 'var(--corso-module-accent)',
    dato: 'Coerente con il perimetro F3 · indicatore atteso definito',
  },
];

const VERIFICA_SINTESI = [
  { check: 'Soggetto = campo, non bambino', nota: 'Micro-azioni con soggetto adulto/setting' },
  { check: 'Applicabile senza diagnosi', nota: 'Bilancio pediatrico standard' },
  { check: 'Osservabile in tempo reale', nota: 'Effetti visibili nei 5 minuti' },
  { check: 'Indicatore = risposta del campo', nota: 'Allungamento sequenza, non competenze' },
  { check: 'Permette di rivalutare la CE', nota: 'Reversibile · assenza risonanza → rilettura' },
];

// ─── Modulo ──────────────────────────────────────────────────────────────

export const Module08: Module = {
  id: 'm08',
  number: 8,
  title: 'Pipeline F3 completa',
  shortTitle: 'Pipeline completa',
  accent: '#1a6b8a',
  slides: [
    // ─── 8.1 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m08-01',
      type: 'narrative',
      title: 'Ripartiamo dalla scena',
      subtitle: 'Tutto quello che abbiamo imparato — in una scena di cinque minuti',
      content: `
        <div class="corso-callout">
          ${CASO_GUIDA_F3.scena
            .split('\n\n')
            .map((p) => `<p><em>${p.trim()}</em></p>`)
            .join('')}
        </div>

        <div class="corso-m8-tre-fasi">
          <div class="corso-m8-fase" style="--corso-fase-color: var(--corso-f1);">
            <div class="corso-m8-fase__lab">F1 — Fondazione</div>
            <p>Sei assi ontologici</p>
            <p class="corso-m8-fase__sub">Come leggere il soggetto nel campo</p>
          </div>
          <span class="corso-m8-fase-arrow">→</span>
          <div class="corso-m8-fase" style="--corso-fase-color: var(--corso-f2);">
            <div class="corso-m8-fase__lab">F2 — CE</div>
            <p>N1~ N2↑ N3~ N4↓</p>
            <p class="corso-m8-fase__sub">R: N2→N3 · D↗ · T2 · A±</p>
          </div>
          <span class="corso-m8-fase-arrow">→</span>
          <div class="corso-m8-fase corso-m8-fase--focus" style="--corso-fase-color: var(--corso-f3);">
            <div class="corso-m8-fase__lab">F3 — Dispositivo</div>
            <p>MEDIAZIONE · U2 + U4</p>
            <p class="corso-m8-fase__sub">Template compilato</p>
          </div>
        </div>
        <p class="corso-narrative__caption" style="text-align: center; font-style: italic; margin-top: 6px;">
          Questa scena è stata lavorata tre volte. Ogni fase ha aggiunto uno strato di lettura.<br/>
          Adesso la percorriamo in F3 dall'inizio alla fine — senza fermarci.
        </p>

        <div class="corso-callout corso-callout--accent-f3" style="margin-top: 22px;">
          <p><strong>M8 non introduce nuovi concetti.</strong> Percorre la pipeline F3 completa applicata al caso-guida: sette passi, dal campo osservato al micro-dispositivo contestualizzato.</p>
          <p style="font-style: italic;">Ogni slide di M8 corrisponde a un passo della pipeline. Al termine, il caso-guida è completo — e la pipeline è percorribile mentalmente su qualsiasi nuovo caso.</p>
        </div>

        <div class="corso-m8-mini-pipe">
          ${PIPELINE_STEPS.map(
            (s, i) => `
              <span class="corso-m8-mini-chip" style="--corso-step-color: ${s.colore};">${s.label.replace(/^[①②③④⑤⑥⑦] /, '')}</span>
              ${i < PIPELINE_STEPS.length - 1 ? '<span class="corso-m8-mini-arr">→</span>' : ''}
            `,
          ).join('')}
        </div>
      `,
    },

    // ─── 8.2 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m08-02',
      type: 'diagram',
      title: 'Osservare e leggere',
      subtitle: "Dall'osservazione della scena alla Configurazione Evolutiva",
      content: `
        <div class="corso-two-col corso-two-col--40-60 corso-m8-passo12">
          <div class="corso-m8-area">
            <div class="corso-m8-area__head">
              <span class="corso-m8-area__num">①</span>
              <h3>Osservare</h3>
            </div>
            <p class="corso-m8-area__lab">Cosa si osserva nel campo</p>
            <ol class="corso-m8-osservazioni">
              <li>Il bambino orienta il libro verso l'adulto, indica immagini, vocalizza e cerca lo sguardo.</li>
              <li>Il genitore risponde con nome, sorriso, attesa. Il campo relazionale è attivo.</li>
              <li>La sequenza si interrompe: il bambino non mantiene il filo del ciclo condiviso.</li>
            </ol>
            <div class="corso-m8-letturaImm">
              <span class="corso-m8-area__lab">Lettura immediata</span>
              <p><em>Il campo non è in collasso (T non è T0). C'è scambio. Ma la sequenza condivisa si esaurisce prima di consolidarsi.</em></p>
            </div>
          </div>

          <div class="corso-m8-area">
            <div class="corso-m8-area__head">
              <span class="corso-m8-area__num">②</span>
              <h3>Leggere (CE)</h3>
            </div>
            ${ceTableHtml(['N2', 'N3', 'N4'])}

            <div class="corso-m8-letture">
              <div class="corso-m8-lettura corso-m8-lettura--up">
                <span class="corso-m8-lettura__lab">Risorsa attiva</span>
                <p><strong>N2↑</strong> — il campo relazionale regge. Base di lavoro disponibile.</p>
              </div>
              <div class="corso-m8-lettura corso-m8-lettura--neu">
                <span class="corso-m8-lettura__lab">Zona di movimento</span>
                <p><strong>N3~</strong> — accesso al mondo condiviso in transizione. R: N2→N3.</p>
              </div>
              <div class="corso-m8-lettura corso-m8-lettura--down">
                <span class="corso-m8-lettura__lab">Nodo in tensione</span>
                <p><strong>N4↓</strong> — esplorazione ridotta. Non è il target in questo contesto.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="corso-m8-bridge">
          <span>F2</span>
          <span class="corso-m8-bridge__arr">→</span>
          <span>F3</span>
        </div>
      `,
      notes:
        "La CE è l'output di F2, l'input di F3. In questo corso la CE era già disponibile dall'inizio — nella pratica professionale, questo passaggio richiede l'applicazione dell'operatore triadico F2.",
    },

    // ─── 8.3 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m08-03',
      type: 'standard',
      title: 'Identificare e orientare',
      subtitle: "Dal nodo dominante alla funzione dell'azione",
      content: `
        <div class="corso-m8-area">
          <div class="corso-m8-area__head">
            <span class="corso-m8-area__num">③</span>
            <h3>Nodo dominante</h3>
          </div>

          <div class="corso-m8-nodi">
            <div class="corso-m8-nodo corso-m8-nodo--main" style="--corso-nodo-color: var(--corso-n3);">
              <span class="corso-m8-nodo__role">NODO DOMINANTE</span>
              <span class="corso-m8-nodo__badge">N3 · Mondo condiviso</span>
              <p>La sua apertura muove il campo verso D↗.<br/>R: N2→N3 indica che la transizione è già in corso.<br/>Attivare N3 produce il cambiamento più rilevante per l'abitabilità del campo.</p>
            </div>
            <div class="corso-m8-nodo" style="--corso-nodo-color: var(--corso-n2);">
              <span class="corso-m8-nodo__role">NODO DI SOSTEGNO</span>
              <span class="corso-m8-nodo__badge">N2 · Campo relazionale</span>
              <p>N2↑ è la risorsa su cui si appoggia il dispositivo. Senza co-regolazione attiva l'accesso a N3 non si produce.</p>
            </div>
            <div class="corso-m8-nodo corso-m8-nodo--tens" style="--corso-nodo-color: var(--corso-n4);">
              <span class="corso-m8-nodo__role">NODO IN TENSIONE</span>
              <span class="corso-m8-nodo__badge">N4 · Apertura</span>
              <p>N4↓ è il nodo limitante secondario. Non è il target: il bilancio non è il contesto per lavorare l'esplorazione. Va tenuto presente: non sovraccaricare il campo.</p>
            </div>
          </div>
        </div>

        <div class="corso-m8-area" style="margin-top: 22px;">
          <div class="corso-m8-area__head">
            <span class="corso-m8-area__num">④</span>
            <h3>Funzione</h3>
          </div>

          <div class="corso-m8-fn-seq">
            <div class="corso-m8-fn-step">
              <code>T2 · A±</code>
              <span class="corso-m8-fn-step__txt">Il campo regge → niente STA/PRO</span>
            </div>
            <span class="corso-m8-fn-arr">→</span>
            <div class="corso-m8-fn-step">
              <code>R: N2→N3 · D↗</code>
              <span class="corso-m8-fn-step__txt">Transizione in corso → MED</span>
            </div>
            <span class="corso-m8-fn-arr">→</span>
            <div class="corso-m8-fn-step corso-m8-fn-step--final" style="background: var(--corso-fn-mediare); color: #fff;">
              <strong>MEDIAZIONE</strong>
            </div>
          </div>

          <p class="corso-m8-fn-desc" style="color: var(--corso-fn-mediare);">
            <em>Sostenere la transizione N2→N3 già in corso — non avviarla, non ampliarla, non stabilizzare un campo che non è in crisi.</em>
          </p>
        </div>
      `,
    },

    // ─── 8.4 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m08-04',
      type: 'standard',
      title: 'Costruire il dispositivo',
      subtitle: 'Il Template F3 del caso-guida compilato',
      content: `
        <div class="corso-m8-chain">
          <span class="corso-m8-chain__chip" style="border-color: var(--corso-f2);">CE</span>
          <span class="corso-m8-chain__arr">→</span>
          <span class="corso-m8-chain__chip" style="border-color: var(--corso-n3);">N3 nodo dom.</span>
          <span class="corso-m8-chain__arr">→</span>
          <span class="corso-m8-chain__chip" style="border-color: var(--corso-fn-mediare); background: color-mix(in srgb, var(--corso-fn-mediare) 8%, transparent);">MED funzione</span>
          <span class="corso-m8-chain__arr">→</span>
          <span class="corso-m8-chain__chip corso-m8-chain__chip--final">Template F3</span>
        </div>

        <table class="corso-m8-tpl">
          <tbody>
            <tr>
              <th>CE di origine</th>
              <td>${CASO_GUIDA_F3.ce.grammaticale}</td>
            </tr>
            <tr>
              <th>Nodo dominante</th>
              <td><strong>${CASO_GUIDA_F3.f3.nodoDominante.codice}</strong> — ${CASO_GUIDA_F3.f3.nodoDominante.nome}</td>
            </tr>
            <tr class="corso-m8-tpl__fn">
              <th>Funzione</th>
              <td>
                <span class="corso-m8-tpl__fn-badge">MED · ${CASO_GUIDA_F3.f3.funzione}</span>
              </td>
            </tr>
            <tr>
              <th>Campo bersaglio</th>
              <td>${CASO_GUIDA_F3.f3.campoBersaglio}</td>
            </tr>
            <tr>
              <th>Micro-azioni</th>
              <td>
                <ol class="corso-m8-tpl__list">
                  ${CASO_GUIDA_F3.f3.microAzioni.map((a) => `<li>${a}</li>`).join('')}
                </ol>
              </td>
            </tr>
            <tr>
              <th>Tempo reale</th>
              <td>${CASO_GUIDA_F3.f3.tempoReale}</td>
            </tr>
            <tr>
              <th>Indicatore<br/>di risonanza</th>
              <td>${CASO_GUIDA_F3.f3.indicatoreRisonanza}</td>
            </tr>
          </tbody>
        </table>

        <div class="corso-m8-tipi-finali">
          <span class="corso-m8-tipo-badge" style="--corso-tipo-color: var(--corso-u2);">U2 · Sintonizzazione</span>
          <span class="corso-m8-tipi-finali__plus">+</span>
          <span class="corso-m8-tipo-badge" style="--corso-tipo-color: var(--corso-u4);">U4 · Mediazione Simbolica</span>
        </div>
        <p class="corso-narrative__caption" style="text-align: center; margin-top: 6px;">
          Il dispositivo esprime <strong>U2</strong> perché segue il bambino senza dirigerlo, e <strong>U4</strong> perché usa il libro come mediatore simbolico dell'incontro.
        </p>
      `,
      guardrail: {
        code: 'C-F3-80',
        label: 'Il template descrive il campo — non il bambino',
        text:
          "Ogni voce del template ha come soggetto il campo relazionale o l'adulto. «Il bambino deve...» non compare: non è la grammatica di F3.",
      },
    },

    // ─── 8.5 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m08-05',
      type: 'standard',
      title: 'Verificare la coerenza',
      subtitle: 'Il dispositivo rispetta il perimetro metodologico di F3?',
      content: `
        <div class="corso-two-col corso-two-col--45-55 corso-m8-verifica">
          <div class="corso-m8-area">
            <div class="corso-m8-area__head">
              <span class="corso-m8-area__num corso-m8-area__num--sub">⑥a</span>
              <h3>Verifica di coerenza</h3>
            </div>
            <ul class="corso-m8-verifica-list">
              ${VERIFICA_SINTESI.map(
                (v, i) => `
                  <li>
                    <span class="corso-m8-verifica-tick">✓</span>
                    <div>
                      <span class="corso-m8-verifica-q"><strong>${i + 1}.</strong> ${v.check}</span>
                      <span class="corso-m8-verifica-nota">${v.nota}</span>
                    </div>
                  </li>
                `,
              ).join('')}
            </ul>
            <p class="corso-m8-verifica-conclusione">
              <strong>✓ Tutte le domande di verifica ricevono risposta affermativa.</strong><br/>
              Il dispositivo è coerente con il perimetro metodologico di F3.
            </p>
          </div>

          <div class="corso-m8-area">
            <div class="corso-m8-area__head">
              <span class="corso-m8-area__num corso-m8-area__num--sub">⑥b</span>
              <h3>Output-tipo compilato</h3>
            </div>
            <div class="corso-m8-output">
              ${(['A', 'B', 'C', 'D', 'E'] as const)
                .map(
                  (sez, i) => `
                    <div class="corso-m8-output-row ${sez === 'E' ? 'corso-m8-output-row--final' : ''}">
                      <span class="corso-m8-output-badge">${sez}</span>
                      <p>${CASO_GUIDA_F3.f3.outputTipo[sez]}</p>
                    </div>
                    ${i < 4 ? '<div class="corso-m8-output-div" aria-hidden="true"></div>' : ''}
                  `,
                )
                .join('')}
            </div>
          </div>
        </div>

        <div class="corso-callout" style="margin-top: 18px;">
          <p>La <strong>verifica di coerenza</strong> assicura che il dispositivo sia nel perimetro F3. L'<strong>output-tipo</strong> trasforma la lettura del campo in un documento condivisibile tra professionisti.</p>
          <p style="font-style: italic;">I due strumenti non si sostituiscono: il primo verifica l'azione, il secondo descrive il campo.</p>
        </div>
      `,
    },

    // ─── 8.6 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m08-06',
      type: 'diagram',
      title: 'Tutto insieme',
      subtitle: "La pipeline F3 del caso-guida — dall'osservazione al dispositivo",
      content: `
        <div class="corso-m8-fullpipe">
          ${PIPELINE_STEPS.map(
            (s, i) => `
              <div class="corso-m8-fullpipe-step" style="--corso-step-color: ${s.colore};">
                <div class="corso-m8-fullpipe-step__head">
                  <span class="corso-m8-fullpipe-step__badge">${s.label}</span>
                  <span class="corso-m8-fullpipe-step__sub">${s.sublabel}</span>
                  <span class="corso-m8-fullpipe-step__fase corso-m8-fullpipe-step__fase--${s.fase.toLowerCase()}">${s.fase}</span>
                </div>
                <div class="corso-m8-fullpipe-step__data">
                  ${
                    s.id === 'funzione'
                      ? `<span class="corso-m8-fullpipe-step__fn-badge" style="background: ${s.funzioneColore};">MED · ${s.dato}</span>`
                      : `<code>${s.dato}</code>`
                  }
                </div>
              </div>
              ${
                i < PIPELINE_STEPS.length - 1
                  ? '<div class="corso-m8-fullpipe-arr" aria-hidden="true">↓</div>'
                  : ''
              }
            `,
          ).join('')}
        </div>

        <div class="corso-m8-properties">
          <div class="corso-m8-property">
            <span class="corso-m8-property__lab">Breve</span>
            <span class="corso-m8-property__val">5 minuti nel bilancio</span>
          </div>
          <div class="corso-m8-property">
            <span class="corso-m8-property__lab">Integrabile</span>
            <span class="corso-m8-property__val">nella scena già in corso, senza ristrutturarla</span>
          </div>
          <div class="corso-m8-property">
            <span class="corso-m8-property__lab">Osservabile</span>
            <span class="corso-m8-property__val">indicatore di risonanza presente/assente in tempo reale</span>
          </div>
        </div>
      `,
      guardrail: {
        code: 'C-F3-81',
        label: 'La pipeline è un orientamento, non un algoritmo',
        text:
          'I sei passi non sono sempre percorsi nell\'ordine esatto. In contesti di alta instabilità (T0), il ciclo si comprime: si osserva, si stabilizza, si osserva di nuovo. La pipeline descrive la logica del metodo — non prescrive una sequenza temporale rigida.',
      },
    },

    // ─── 8.7 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m08-07',
      type: 'narrative',
      title: 'Cosa rimane dopo F3',
      subtitle: 'Chiusura del corso',
      content: `
        <div class="corso-m8-cycle-final">
          <div class="corso-m8-cycle-final__phases">
            <div class="corso-m8-cycle-final__phase" style="--corso-fase-color: var(--corso-f1);">F1<br/><span>Fondazione</span></div>
            <div class="corso-m8-cycle-final__phase" style="--corso-fase-color: var(--corso-f2);">F2<br/><span>Traduzione</span></div>
            <div class="corso-m8-cycle-final__phase" style="--corso-fase-color: var(--corso-f3);">F3<br/><span>Strumenti</span></div>
          </div>
          <div class="corso-m8-cycle-final__loop">
            <div class="corso-m8-cycle-final__node">Campo osservato</div>
            <span class="corso-m8-cycle-final__arr">↓</span>
            <div class="corso-m8-cycle-final__node">CE prodotta</div>
            <span class="corso-m8-cycle-final__arr">↓</span>
            <div class="corso-m8-cycle-final__node">Micro-dispositivo</div>
            <span class="corso-m8-cycle-final__arr">↓</span>
            <div class="corso-m8-cycle-final__node corso-m8-cycle-final__node--ce">Campo aggiornato</div>
            <span class="corso-m8-cycle-final__loop-back" aria-hidden="true">↺ ricomincia</span>
          </div>
        </div>

        <div class="corso-m8-resta">
          <div class="corso-m8-resta-card">
            <div class="corso-m8-resta-card__num">1</div>
            <div class="corso-m8-resta-card__lab">Un vocabolario</div>
            <p>CE, nodo dominante, funzione, tipo universale: non sono concetti da memorizzare — sono parole per descrivere ciò che accade nel campo relazionale in modo comunicabile tra professionisti.</p>
          </div>
          <div class="corso-m8-resta-card">
            <div class="corso-m8-resta-card__num">2</div>
            <div class="corso-m8-resta-card__lab">Una struttura di domande</div>
            <p>D1–D4 e il Ciclo Decisionale Breve non prescrivono cosa fare: orientano l'attenzione verso il punto del campo in cui un'azione minima può produrre il cambiamento più rilevante.</p>
          </div>
          <div class="corso-m8-resta-card">
            <div class="corso-m8-resta-card__num">3</div>
            <div class="corso-m8-resta-card__lab">Un principio</div>
            <p><strong>Lo strumento non corregge il bambino: modifica il campo relazionale di esperienza.</strong></p>
            <p class="corso-m8-resta-card__sub"><em>Questo principio non è etico — è metodologico. Emerge dall'Asse 1 di F1 e attraversa tutte e tre le fasi.</em></p>
          </div>
        </div>

        <blockquote class="corso-blockquote corso-m8-quote" style="border-left-color: var(--corso-f3);">
          «Ogni nuova scena può diventare una CE.<br/>
          Ogni CE può diventare un dispositivo.<br/>
          Ogni dispositivo può tornare a essere osservazione.»
        </blockquote>

        <p class="corso-narrative__caption" style="text-align: center; margin: 24px 0; font-style: italic; font-size: 1rem;">
          Il caso-guida finisce qui. Il campo — no.
        </p>

        <div class="corso-m8-firma">
          <span class="corso-m8-firma__badge" style="background: var(--corso-f1);">F1</span>
          <span class="corso-m8-firma__badge" style="background: var(--corso-f2);">F2</span>
          <span class="corso-m8-firma__badge" style="background: var(--corso-f3);">F3</span>
        </div>
        <p class="corso-narrative__caption" style="text-align: center; margin-top: 6px; font-size: 0.85rem;">
          Fondazione Ontologica · Traduzione Interdisciplinare · Strumenti Operativi Contestualizzati
        </p>
      `,
    },
  ],
};
