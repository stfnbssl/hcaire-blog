import {
  Module,
  ExpandableCardData,
  CEBuilderTexts,
  CEPreset,
  ProgressiveRevealItem,
} from '../types';

const NODE_COLORS: Record<string, string> = {
  N1: '#e67e22',
  N2: '#27ae60',
  N3: '#2980b9',
  N4: '#8e44ad',
  N5: '#e74c3c',
  N6: '#16a085',
  N7: '#f39c12',
};
const STATE_COLORS: Record<string, string> = {
  '↑': '#27ae60',
  '~': '#2980b9',
  '↓': '#e67e22',
  '!': '#e74c3c',
  '?': '#95a5a6',
};
function stateBadges(states: Record<string, string>): string {
  return Object.entries(states)
    .map(
      ([n, s]) =>
        `<span class="cf2-state" style="--node-color: ${NODE_COLORS[n]}; --state-color: ${STATE_COLORS[s]};"><span class="cf2-state__node">${n}</span><span class="cf2-state__sym">${s}</span></span>`,
    )
    .join('');
}

const CINQUE_DIMENSIONI: ExpandableCardData[] = [
  {
    id: 'S',
    color: '#16a085',
    badge: 'S',
    title: 'Stato dei nodi',
    summary: 'Come stanno funzionando i nodi in questo momento.',
    detail: `
      <p>Lo stato non è un punteggio e non è permanente. Descrive il modo in cui ciascun Nodo Trasversale si manifesta nel campo osservato. Non riguarda il bambino in sé, ma la qualità della sua esperienza nel contesto.</p>
      <table class="cf2-table">
        <thead><tr><th>Codice</th><th>Significato</th><th>Note</th></tr></thead>
        <tbody>
          <tr><td><strong style="color: #27ae60;">↑</strong></td><td>Espansivo</td><td>Il nodo si esprime con piena disponibilità nel campo</td></tr>
          <tr><td><strong style="color: #2980b9;">~</strong></td><td>Stabile</td><td>Il nodo è funzionante ma non in fase espansiva</td></tr>
          <tr><td><strong style="color: #e67e22;">↓</strong></td><td>Ristretto</td><td>Il nodo mostra contrazione o ridotta espressione</td></tr>
          <tr><td><strong style="color: #e74c3c;">!</strong></td><td>Disorganizzato</td><td>Perde coerenza interna; segnale di attenzione</td></tr>
          <tr><td><strong style="color: #95a5a6;">?</strong></td><td>Non leggibile</td><td>Insufficiente osservazione per descrivere lo stato</td></tr>
        </tbody>
      </table>
      <p class="cf2-card__hint cf2-card__hint--accent"><strong>Esempio</strong> · <code>N1~ N2↑ N3~ N4↓ N5~ N6~ N7~</code></p>
    `,
  },
  {
    id: 'R',
    color: '#2980b9',
    badge: 'R',
    title: 'Relazioni dominanti',
    summary: 'Come i nodi interagiscono tra loro nel campo.',
    detail: `
      <p>Non tutti i nodi hanno lo stesso peso in ogni configurazione. La dimensione R identifica le relazioni strutturalmente attive — quelle che organizzano il funzionamento complessivo del campo. Una CE può avere una o più relazioni dominanti.</p>
      <table class="cf2-table">
        <thead><tr><th>Codice</th><th>Tipo</th><th>Note</th></tr></thead>
        <tbody>
          <tr><td><strong style="color: #27ae60;">CPL</strong></td><td>Sostegno</td><td>Un nodo espansivo amplifica la disponibilità di un altro</td></tr>
          <tr><td><strong style="color: #e74c3c;">VIN</strong></td><td>Vincolo</td><td>Un nodo ristretto limita l'espressione di un altro</td></tr>
          <tr><td><strong style="color: #2980b9;">MED</strong></td><td>Mediazione</td><td>Un nodo orienta e traduce l'attività di un altro</td></tr>
          <tr><td><strong style="color: #e67e22;">CMP</strong></td><td>Compensazione</td><td>Un nodo stabile bilancia la fragilità di un altro</td></tr>
        </tbody>
      </table>
      <p class="cf2-card__hint cf2-card__hint--accent"><strong>Esempio</strong> · <code>N2→N3 (MED), N7→N3 (CPL), N2→N1 (CMP)</code></p>
    `,
  },
  {
    id: 'D',
    color: '#27ae60',
    badge: 'D',
    title: 'Direzione dinamica',
    summary: 'La traiettoria evolutiva del campo.',
    detail: `
      <p>La direzione non descrive un miglioramento o un peggioramento: descrive il movimento della configurazione nel tempo osservato. Una configurazione ↘ può essere gestibile; una ↗ può essere fragile. Dipende dal campo.</p>
      <table class="cf2-table">
        <thead><tr><th>Codice</th><th>Significato</th><th>Note</th></tr></thead>
        <tbody>
          <tr><td><strong style="color: #27ae60;">↗</strong></td><td>Espansione</td><td>Il campo si apre verso nuove possibilità evolutive</td></tr>
          <tr><td><strong style="color: #2980b9;">→</strong></td><td>Stabilizzazione</td><td>Il campo mantiene la sua forma; nessun movimento netto</td></tr>
          <tr><td><strong style="color: #e74c3c;">↘</strong></td><td>Restringimento</td><td>Il campo si chiude; riduzione delle possibilità</td></tr>
        </tbody>
      </table>
      <p class="cf2-card__hint cf2-card__hint--accent"><strong>Esempio</strong> · <code>↗</code></p>
    `,
  },
  {
    id: 'T',
    color: '#e67e22',
    badge: 'T',
    title: 'Stabilità temporale',
    summary: 'Frequenza e continuità con cui si manifesta la configurazione.',
    detail: `
      <p>La stabilità non è sinonimo di rigidità: descrive se la configurazione è un fenomeno isolato, uno schema ricorrente, o una forma strutturata nel tempo. Questo orienta l'attenzione del professionista sulla soglia di intervento.</p>
      <table class="cf2-table">
        <thead><tr><th>Codice</th><th>Significato</th><th>Note</th></tr></thead>
        <tbody>
          <tr><td><strong style="color: #95a5a6;">T1</strong></td><td>Situazionale</td><td>Osservata in questo momento specifico; non confermata</td></tr>
          <tr><td><strong style="color: #e67e22;">T2</strong></td><td>Ricorrente</td><td>Si manifesta in più occasioni simili</td></tr>
          <tr><td><strong style="color: #e74c3c;">T3</strong></td><td>Stabilizzata</td><td>Schema consolidato nel tempo; richiede attenzione continuativa</td></tr>
        </tbody>
      </table>
      <p class="cf2-card__hint cf2-card__hint--accent"><strong>Esempio</strong> · <code>T2</code></p>
    `,
  },
  {
    id: 'A',
    color: '#8e44ad',
    badge: 'A',
    title: 'Abitabilità esperienziale',
    summary: 'Qualità complessiva del campo come spazio evolutivo.',
    detail: `
      <p>L'abitabilità non è una valutazione del bambino o dell'adulto. È una stima della qualità del campo come spazio evolutivo. Deriva dalla normatività intrinseca dello sviluppo — non da norme esterne, prescrizioni o confronti.</p>
      <table class="cf2-table">
        <thead><tr><th>Codice</th><th>Significato</th><th>Note</th></tr></thead>
        <tbody>
          <tr><td><strong style="color: #27ae60;">A+</strong></td><td>Alta abitabilità</td><td>Il campo offre condizioni favorevoli all'esperienza evolutiva</td></tr>
          <tr><td><strong style="color: #e67e22;">A±</strong></td><td>Fragile</td><td>Campo attivo ma con elementi di fragilità; monitorare</td></tr>
          <tr><td><strong style="color: #e74c3c;">A−</strong></td><td>Rischio collasso</td><td>Il campo è a rischio di cedere; richiede attenzione</td></tr>
        </tbody>
      </table>
      <p class="cf2-card__hint cf2-card__hint--accent"><strong>Esempio</strong> · <code>A±</code></p>
    `,
  },
];

const BUILDER_TEXTS: CEBuilderTexts = {
  nodi: {
    N1: {
      '↑': 'presenza piena e attiva nel campo',
      '~': 'presenza stabile nel campo',
      '↓': 'presenza fragile o discontinua nel campo',
      '!': 'presenza disorganizzata nel campo',
    },
    N2: {
      '↑': 'campo relazionale espansivo',
      '~': 'campo relazionale stabile',
      '↓': 'campo relazionale fragile',
      '!': 'campo relazionale incoerente',
    },
    N3: {
      '↑': 'accesso al mondo condiviso pienamente espresso',
      '~': 'accesso al mondo condiviso presente',
      '↓': 'accesso al mondo condiviso ridotto',
      '!': 'accesso al mondo condiviso compromesso',
    },
    N4: {
      '↑': 'esplorazione attiva e diversificata',
      '~': 'esplorazione funzionante',
      '↓': 'esplorazione ridotta o contenuta',
      '!': 'esplorazione disorganizzata',
    },
    N5: {
      '↑': 'limite fluido e adattivo',
      '~': 'limite stabile',
      '↓': 'limite rigido o ridotto',
      '!': 'limite caotico',
    },
    N6: {
      '↑': 'continuità piena dopo le fratture',
      '~': 'continuità presente',
      '↓': 'continuità ridotta',
      '!': 'continuità compromessa',
    },
    N7: {
      '↑': 'agentività piena ed espressa',
      '~': 'agentività presente',
      '↓': 'agentività ridotta o poco espressa',
      '!': 'agentività frammentata',
    },
  },
  relazioni: {
    CPL: 'sostegno reciproco tra nodi',
    VIN: "vincolo che limita l'espansione",
    MED: 'mediazione che orienta lo sviluppo',
    CMP: 'compensazione che bilancia la fragilità',
  },
  direzioni: {
    '↗': 'in espansione evolutiva',
    '→': 'in stabilizzazione',
    '↘': 'in restringimento',
  },
  stabilita: {
    T1: 'osservazione situazionale',
    T2: 'schema ricorrente',
    T3: 'configurazione stabilizzata nel tempo',
  },
  abitabilita: {
    'A+': 'alta abitabilità esperienziale',
    'A±': 'configurazione fragile ma evolutivamente aperta',
    'A−': 'rischio di collasso esperienziale',
  },
};

const CE_CASO_GUIDA: CEPreset = {
  S: { N1: '~', N2: '↑', N3: '~', N4: '↓', N5: '~', N6: '~', N7: '~' },
  R: 'MED',
  D: '↗',
  T: 'T2',
  A: 'A±',
};

const DECODIFICA_STEPS: ProgressiveRevealItem[] = [
  {
    id: 's1',
    badge: '1',
    title: 'Dimensione S — Stato dei nodi',
    bodyHtml: `
      <div style="margin: 8px 0;">${stateBadges({ N1: '~', N2: '↑', N3: '~', N4: '↓', N5: '~', N6: '~', N7: '~' })}</div>
      <p><strong>Domanda</strong> · Quale Nodo è in stato espansivo? Cosa significa per il campo della lettura condivisa?</p>
      <details>
        <summary style="cursor: pointer; color: var(--cf2-module-accent); font-weight: 600;">Mostra risposta</summary>
        <p><strong>N2↑</strong> — Il campo relazionale tra bambino e adulto è espansivo. Non è il bambino a essere «più bravo»: è la qualità della relazione in questo contesto specifico che facilita lo scambio.</p>
      </details>
    `,
  },
  {
    id: 's2',
    badge: '2',
    title: 'Dimensione R — Relazioni dominanti',
    bodyHtml: `
      <p style="font-family: 'JetBrains Mono', monospace; background: var(--cf2-bg); padding: 8px 12px; border-radius: var(--cf2-radius-sm);">N2→N3 (MED), N7→N3 (CPL), N2→N1 (CMP)</p>
      <p><strong>Domanda</strong> · Tre relazioni dominanti. Quale ti sembra la più importante strutturalmente?</p>
      <details>
        <summary style="cursor: pointer; color: var(--cf2-module-accent); font-weight: 600;">Mostra risposta</summary>
        <p><strong>N2→N3 (MED)</strong> è la relazione cardine: la forza della relazione adulto-bambino orienta e rende possibile l'accesso al mondo condiviso simbolico. Senza N2↑, N3 resterebbe stabile ma non si espanderebbe.</p>
      </details>
    `,
  },
  {
    id: 's3',
    badge: '3',
    title: 'Dimensione D — Direzione',
    bodyHtml: `
      <p style="font-family: 'JetBrains Mono', monospace; background: var(--cf2-bg); padding: 8px 12px; border-radius: var(--cf2-radius-sm);">D: ↗</p>
      <p><strong>Domanda</strong> · Il campo è in espansione. Ma N4 è ↓ (esplorazione ridotta). Come stanno insieme queste due informazioni?</p>
      <details>
        <summary style="cursor: pointer; color: var(--cf2-module-accent); font-weight: 600;">Mostra risposta</summary>
        <p>Non si contraddicono. L'espansione ↗ riguarda la <em>direzione complessiva del campo</em>, non lo stato di ogni singolo nodo. N4↓ segnala un'area di attenzione, ma la relazione (N2↑, MED) sostiene comunque un movimento evolutivo aperto.</p>
      </details>
    `,
  },
  {
    id: 's4',
    badge: '4',
    title: 'Dimensioni T e A',
    bodyHtml: `
      <p style="font-family: 'JetBrains Mono', monospace; background: var(--cf2-bg); padding: 8px 12px; border-radius: var(--cf2-radius-sm);">T: T2 &nbsp;·&nbsp; A: A±</p>
      <p><strong>Domanda</strong> · Schema ricorrente (T2) e abitabilità fragile (A±). Cosa orienta il professionista?</p>
      <details>
        <summary style="cursor: pointer; color: var(--cf2-module-accent); font-weight: 600;">Mostra risposta</summary>
        <p>T2 significa che questo pattern si è già osservato in bilanci precedenti: non è un'impressione isolata. A± segnala un campo che funziona ma mostra fragilità. Insieme: <strong>monitorare</strong>, non intervenire in modo direttivo. La CE non prescrive nulla.</p>
      </details>
    `,
  },
  {
    id: 's5',
    badge: '5',
    title: 'Testo naturale completo',
    bodyHtml: `
      <div class="cf2-box cf2-box--valid" style="border-color: #16a085; background: #e8f8f5;">
        <p><em>«Campo relazionale espansivo che orienta e sostiene l'accesso al mondo condiviso, con esplorazione ancora ridotta. La configurazione è fragile ma con direzione evolutiva aperta.»</em></p>
      </div>
      <p style="color: #27ae60; font-size: 0.9rem; margin-top: 8px;">✓ Hai letto una CE completa. Ora puoi tornare al CEBuilder e costruirne una diversa.</p>
    `,
  },
];

export const Module06: Module = {
  id: 'm06',
  number: 6,
  title: 'La Grammatica delle Configurazioni',
  shortTitle: 'Grammatica',
  accent: '#16a085',
  slides: [
    // ─── 6.1 ──────────────────────────────────────────────────────────
    {
      id: 'm06-s01',
      type: 'standard',
      title: 'La Configurazione Evolutiva',
      subtitle: 'Descrivere senza classificare',
      content: `
        <p>Quando la Fase 2 è completa, il professionista dispone di un linguaggio strutturato per descrivere ciò che ha osservato. Non una diagnosi. Non una valutazione. Una <strong>forma</strong>: la Configurazione Evolutiva.</p>

        <blockquote class="cf2-blockquote" style="border-left-color: #16a085; background: #e8f8f5;">«Una <strong>Configurazione Evolutiva</strong> è la forma temporaneamente stabile assunta dalla dinamica tra Nodi Trasversali in un determinato campo relazionale.»</blockquote>

        <div class="cf2-chips">
          <div class="cf2-chip" style="background: #e8f8f5; border-color: #16a085;"><span class="cf2-chip__icon">📍</span><span class="cf2-chip__label">Situata</span><span class="cf2-chip__sub">dipende dal campo, dall'adulto, dal contesto</span></div>
          <div class="cf2-chip" style="background: #e8f8f5; border-color: #16a085;"><span class="cf2-chip__icon">🔄</span><span class="cf2-chip__label">Reversibile</span><span class="cf2-chip__sub">può cambiare; non è una sentenza</span></div>
          <div class="cf2-chip" style="background: #e8f8f5; border-color: #16a085;"><span class="cf2-chip__icon">📈</span><span class="cf2-chip__label">Dinamica</span><span class="cf2-chip__sub">descrive movimento, non stato fisso</span></div>
        </div>

        <p class="cf2-narrative__caption">Una CE non dice cosa è il bambino. Dice come il campo relazionale funziona in questo momento. Questo è il senso preciso di «produrre leggibilità» — l'obiettivo della Fase 2.</p>
      `,
    },

    // ─── 6.2 ──────────────────────────────────────────────────────────
    {
      id: 'm06-s02',
      type: 'interactive',
      title: 'Cinque dimensioni',
      subtitle: 'I parametri della grammatica configurazionale',
      intro: `
        <p>Una CE è composta da cinque dimensioni: <strong>S</strong>tato, <strong>R</strong>elazioni, <strong>D</strong>irezione, stabilità <strong>T</strong>emporale, <strong>A</strong>bitabilità. Clicca ogni card per esplorare codici, significati ed esempi (puoi tenerne aperte più contemporaneamente).</p>
      `,
      interactive: {
        kind: 'expandable-cards',
        cards: CINQUE_DIMENSIONI,
        layout: 'grid',
        multiOpen: true,
      },
    },

    // ─── 6.3 ──────────────────────────────────────────────────────────
    {
      id: 'm06-s03',
      type: 'diagram',
      title: 'La forma completa',
      subtitle: 'CE del caso-guida annotata',
      content: `
        <div class="cf2-two-col">
          <div class="cf2-col">
            <h3 class="cf2-narrative__h3">Blocco CE</h3>
            <pre style="background: var(--cf2-bg); border: 1px solid var(--cf2-border); border-left: 4px solid #16a085; border-radius: var(--cf2-radius-md); padding: 16px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.92rem; line-height: 2; margin: 0;">CE =
  <span title="Stato funzionale di ciascun nodo nel campo">S: <span style="color: #2980b9;">N1~</span> <span style="color: #27ae60;">N2↑</span> <span style="color: #2980b9;">N3~</span> <span style="color: #e67e22;">N4↓</span> <span style="color: #2980b9;">N5~ N6~ N7~</span></span>
  <span title="Relazioni dominanti tra nodi">R: N2→N3 (MED), N7→N3 (CPL), N2→N1 (CMP)</span>
  <span title="Traiettoria evolutiva: espansione">D: <span style="color: #27ae60;">↗</span></span>
  <span title="Schema ricorrente, osservato in più bilanci">T: T2</span>
  <span title="Campo fragile ma evolutivamente aperto">A: A±</span>
</pre>
            <p class="cf2-narrative__caption">Passa il mouse sopra ogni riga per leggerne il significato.</p>
          </div>

          <div class="cf2-col">
            <h3 class="cf2-narrative__h3">Testo naturale</h3>
            <div class="cf2-box cf2-box--valid" style="border-color: #16a085; background: #e8f8f5;">
              <p><em>«Campo relazionale espansivo che orienta e sostiene l'accesso al mondo condiviso, con esplorazione ancora ridotta. La configurazione è fragile ma con direzione evolutiva aperta.»</em></p>
            </div>

            <div class="cf2-chip" style="margin-top: 12px;">
              <span class="cf2-chip__icon">🩺</span>
              <span class="cf2-chip__label">Contesto</span>
              <span class="cf2-chip__sub">Bilancio pediatrico · 18-24 mesi · 3-5 minuti di lettura condivisa con genitore presente</span>
            </div>

            <p class="cf2-narrative__caption">Il testo naturale non è una diagnosi. È la restituzione leggibile della struttura — per il professionista, non per la famiglia.</p>
          </div>
        </div>
      `,
    },

    // ─── 6.4 ──────────────────────────────────────────────────────────
    {
      id: 'm06-s04',
      type: 'interactive',
      title: 'Costruisci una CE',
      subtitle: 'Usa il costruttore per esplorare la grammatica',
      intro: `
        <p>Seleziona uno stato per ciascun Nodo, scegli una relazione dominante, direzione, stabilità e abitabilità. Il blocco CE e il testo naturale si aggiornano in tempo reale. Usa <em>«Carica caso-guida»</em> per partire dalla CE del bilancio pediatrico, oppure <em>«Reset»</em> per ricominciare con tutti i nodi a <code>~</code>.</p>
      `,
      interactive: {
        kind: 'ce-builder',
        texts: BUILDER_TEXTS,
        preset: CE_CASO_GUIDA,
        presetLabel: 'Carica caso-guida',
      },
    },

    // ─── 6.5 ──────────────────────────────────────────────────────────
    {
      id: 'm06-s05',
      type: 'comparison',
      title: 'Una sola regola',
      subtitle: 'Il limite epistemologico della grammatica configurazionale',
      intro: `
        <blockquote class="cf2-blockquote" style="border-left-color: #16a085; background: #e8f8f5; font-size: 1.2rem;">
          «La configurazione descrive il campo, non attribuisce proprietà al bambino.»
        </blockquote>
      `,
      comparison: {
        valid: {
          title: 'Una CE è',
          items: [
            'Una descrizione del campo relazionale in un momento situato',
            'Uno strumento di leggibilità per il professionista',
            'Una forma reversibile e dinamica — mai definitiva',
            'Il prodotto finale della Fase 2',
          ],
        },
        invalid: {
          title: 'Una CE non è',
          items: [
            { text: 'Una diagnosi o classificazione del bambino' },
            { text: "Un giudizio sulla famiglia o sull'adulto di riferimento" },
            { text: 'Un piano di intervento (spetta a F3)' },
            { text: 'Una misura di normalità o patologia' },
          ],
        },
      },
      content: `
        <p class="cf2-narrative__caption">Questa regola non è una cautela etica aggiuntiva: è strutturalmente necessaria. Una CE che descrivesse il bambino non sarebbe più una CE — sarebbe una diagnosi. Il metodo non prevede diagnosi.</p>
      `,
    },

    // ─── 6.6 ──────────────────────────────────────────────────────────
    {
      id: 'm06-s06',
      type: 'interactive',
      title: 'Leggiamo la CE del caso-guida',
      subtitle: 'Decodifica guidata passo per passo',
      intro: `
        <pre style="background: var(--cf2-bg); border: 1px solid var(--cf2-border); border-left: 4px solid #16a085; border-radius: var(--cf2-radius-md); padding: 16px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.88rem; line-height: 1.7; margin: 0 0 12px;">CE =
  S: N1~ N2↑ N3~ N4↓ N5~ N6~ N7~
  R: N2→N3 (MED), N7→N3 (CPL), N2→N1 (CMP)
  D: ↗
  T: T2
  A: A±</pre>
        <p>Decodifichiamo la CE una dimensione per volta. Ad ogni passo c'è una domanda riflessiva: prova a rispondere prima di aprire <em>«Mostra risposta»</em>.</p>
      `,
      interactive: {
        kind: 'progressive-reveal',
        items: DECODIFICA_STEPS,
        ctaShow: 'Passo successivo',
        conclusionHtml: `
          <p class="cf2-emph cf2-emph--center">→ Modulo 7 — Costruzione di un Output-tipo vuoto</p>
        `,
      },
    },

    // ─── 6.7 ──────────────────────────────────────────────────────────
    {
      id: 'm06-s07',
      type: 'narrative',
      title: 'Cosa ha prodotto la Fase 2',
      subtitle: "Dalla leggibilità all'azione",
      content: `
        <p>La Fase 2 ha tradotto le strutture di F1 in un linguaggio professionale condiviso. Abbiamo attraversato sette nodi, costruito operatori di lettura, esplorato le relazioni configurazionali e imparato a descrivere senza classificare. Il prodotto finale è la CE: una forma grammaticale, non una sentenza.</p>

        <h3 class="cf2-narrative__h3">Cosa ha prodotto F2</h3>
        <div class="cf2-cards cf2-cards--vertical">
          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #16a085;">
            <div class="cf2-card__head"><span class="cf2-card__badge">🔍</span><span class="cf2-card__title">Operatori di lettura</span></div>
            <div class="cf2-card__body"><p>Domande strutturali che organizzano l'osservazione professionale, situate nei contesti reali.</p></div>
          </div>
          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #16a085;">
            <div class="cf2-card__head"><span class="cf2-card__badge">📐</span><span class="cf2-card__title">Configurazioni Evolutive</span></div>
            <div class="cf2-card__body"><p>Descrizioni comparabili e reversibili del campo, scritte con la grammatica S/R/D/T/A.</p></div>
          </div>
          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #16a085;">
            <div class="cf2-card__head"><span class="cf2-card__badge">🌉</span><span class="cf2-card__title">Linguaggio condiviso</span></div>
            <div class="cf2-card__body"><p>Traducibile in pediatria, NPI, educazione, counseling — senza colonizzazione disciplinare.</p></div>
          </div>
        </div>

        <hr class="cf2-divider" />
        <p class="cf2-emph cf2-emph--center" style="color: var(--cf2-text-muted); letter-spacing: 0.1em;">— Soglia F3 —</p>

        <p>La Fase 3 riempie le forme prodotte da F2. Ogni contesto (clinico, educativo, familiare, istituzionale) produce uno <strong>strumento contestualizzato</strong> diverso dallo stesso output-tipo — non una tecnica diversa, ma un'applicazione situata della stessa grammatica.</p>

        <div class="cf2-box cf2-box--valid" style="border-color: #f1c40f; background: #fef9e7;">
          <p style="margin: 0; text-align: center; font-size: 1.05rem;"><strong>F2 produce leggibilità · F3 produce azione · La CE è il punto di passaggio.</strong></p>
        </div>

        <p class="cf2-narrative__caption">Nel caso-guida la CE <code>A±, T2, ↗</code> indica che il bilancio pediatrico non richiede un intervento direttivo, ma un protocollo di monitoraggio condiviso con la famiglia — questo è il compito di F3.</p>
      `,
    },
  ],
};
