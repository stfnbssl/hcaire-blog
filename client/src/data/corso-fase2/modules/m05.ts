import {
  Module,
  GraphNode,
  GraphRelation,
  GraphRelationType,
} from '../types';

// Colori canonici dei Nodi (allineati con M3/M4).
const NODE_COLORS: Record<string, string> = {
  N1: '#e67e22',
  N2: '#27ae60',
  N3: '#2980b9',
  N4: '#8e44ad',
  N5: '#e74c3c',
  N6: '#16a085',
  N7: '#f39c12',
};

// Colori per i codici di stato CE.
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

const TIPI_RELAZIONE: GraphRelationType[] = [
  {
    id: 'CPL',
    label: 'Sostegno',
    description: "Un Nodo rende possibile l'attivazione di un altro.",
    color: '#27ae60',
    style: 'solid',
  },
  {
    id: 'VIN',
    label: 'Vincolo',
    description: 'Due Nodi si limitano reciprocamente.',
    color: '#e74c3c',
    style: 'dashed',
  },
  {
    id: 'MED',
    label: 'Mediazione',
    description: 'Un Nodo coordina e collega due domini diversi.',
    color: '#2980b9',
    style: 'solid',
  },
  {
    id: 'CMP',
    label: 'Compensazione',
    description: 'Un Nodo sostiene parzialmente la fragilità di un altro.',
    color: '#e67e22',
    style: 'dotted',
  },
];

const NODI_GRAFO: GraphNode[] = [
  { id: 'N1', label: 'N1', sublabel: 'Regolazione', color: NODE_COLORS.N1, x: 50, y: 15 },
  { id: 'N2', label: 'N2', sublabel: 'Co-regolazione', color: NODE_COLORS.N2, x: 85, y: 45 },
  { id: 'N3', label: 'N3', sublabel: 'Mondo condiviso', color: NODE_COLORS.N3, x: 65, y: 90 },
  { id: 'N4', label: 'N4', sublabel: 'Apertura', color: NODE_COLORS.N4, x: 15, y: 45 },
  { id: 'N5', label: 'N5', sublabel: 'Limite reale', color: NODE_COLORS.N5, x: 90, y: 80 },
  { id: 'N6', label: 'N6', sublabel: 'Continuità', color: NODE_COLORS.N6, x: 10, y: 80 },
  { id: 'N7', label: 'N7', sublabel: 'Desiderio', color: NODE_COLORS.N7, x: 50, y: 50 },
];

const RELAZIONI_GRAFO: GraphRelation[] = [
  { from: 'N1', to: 'N4', type: 'CPL' },
  { from: 'N4', to: 'N7', type: 'CPL' },
  { from: 'N7', to: 'N3', type: 'CPL' },
  { from: 'N5', to: 'N7', type: 'VIN', bidirectional: true },
  { from: 'N5', to: 'N6', type: 'VIN' },
  { from: 'N2', to: 'N3', type: 'MED' },
  { from: 'N2', to: 'N1', type: 'CMP' },
];

export const Module05: Module = {
  id: 'm05',
  number: 5,
  title: 'La Dinamica tra Nodi',
  shortTitle: 'Dinamica',
  accent: '#8e44ad',
  slides: [
    // ─── 5.1 ──────────────────────────────────────────────────────────
    {
      id: 'm05-s01',
      type: 'standard',
      title: 'Lo sviluppo è una configurazione',
      subtitle: 'Non una somma di Nodi',
      content: `
        <blockquote class="cf2-blockquote">«Lo stato evolutivo di un bambino corrisponde a una configurazione di Nodi simultaneamente attivi, non alla loro somma.»</blockquote>

        <p>I sette Nodi Trasversali non sono indipendenti. Lo sviluppo è un'<strong>organizzazione dinamica</strong> dell'esperienza: ogni Nodo influenza gli altri, ne rende possibili alcuni, ne limita altri, ne compensa altri ancora.</p>
        <p class="cf2-narrative__caption">Guardare un Nodo alla volta è come ascoltare un accordo una nota alla volta: si perde la musica.</p>

        <hr class="cf2-divider" />

        <h3 class="cf2-narrative__h3">Tre conseguenze operative</h3>
        <div class="cf2-cards cf2-cards--grid">
          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #8e44ad;">
            <div class="cf2-card__head"><span class="cf2-card__badge">🔍</span><span class="cf2-card__title">Per la lettura</span></div>
            <div class="cf2-card__body"><p><em>Nessun Nodo, da solo, identifica il rischio o la risorsa. È la configurazione che parla.</em></p></div>
          </div>
          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #8e44ad;">
            <div class="cf2-card__head"><span class="cf2-card__badge">🎯</span><span class="cf2-card__title">Per l'intervento</span></div>
            <div class="cf2-card__body"><p><em>L'intervento non si rivolge al «Nodo debole»: si rivolge alla configurazione. Si sostiene il campo, non si «riparano» i Nodi.</em></p></div>
          </div>
          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #8e44ad;">
            <div class="cf2-card__head"><span class="cf2-card__badge">🗣</span><span class="cf2-card__title">Per la comunicazione</span></div>
            <div class="cf2-card__body"><p><em>Due professionisti che leggono Nodi diversi non si contraddicono: descrivono aspetti della stessa configurazione.</em></p></div>
          </div>
        </div>
      `,
      notes:
        'Questo è il motivo per cui il metodo non diagnostica: individua traiettorie. La traiettoria dipende dalla configurazione, non da un Nodo singolo.',
    },

    // ─── 5.2 ──────────────────────────────────────────────────────────
    {
      id: 'm05-s02',
      type: 'diagram',
      title: 'Quattro tipi di relazione tra Nodi',
      subtitle: 'Come i Nodi si influenzano reciprocamente',
      intro: `
        <p>Le relazioni tra Nodi si dividono in quattro famiglie. Clicca un tipo nella legenda per filtrare, oppure clicca un Nodo del grafo per evidenziare le sue connessioni.</p>
      `,
      interactive: {
        kind: 'node-relations',
        nodes: NODI_GRAFO,
        relations: RELAZIONI_GRAFO,
        relationTypes: TIPI_RELAZIONE,
      },
      content: `
        <hr class="cf2-divider" />
        <table class="cf2-table">
          <thead>
            <tr><th>Tipo</th><th>Definizione</th><th>Esempio dal grafo</th></tr>
          </thead>
          <tbody>
            <tr><td><strong style="color: #27ae60;">CPL</strong> Sostegno</td><td>Un Nodo rende possibile l'attivazione di un altro</td><td>N1 → N4 → N7 (regolazione abilita esplorazione, esplorazione abilita desiderio)</td></tr>
            <tr><td><strong style="color: #e74c3c;">VIN</strong> Vincolo</td><td>Due Nodi si limitano reciprocamente</td><td>N5 ↔ N7 (il limite dà forma al desiderio; troppo limite lo schiaccia, niente limite lo disorganizza)</td></tr>
            <tr><td><strong style="color: #2980b9;">MED</strong> Mediazione</td><td>Un Nodo coordina due domini</td><td>N2 → N3 (la co-regolazione media l'accesso al mondo simbolico)</td></tr>
            <tr><td><strong style="color: #e67e22;">CMP</strong> Compensazione</td><td>Un Nodo sostiene parzialmente la fragilità di un altro</td><td>N2 → N1 (campo relazionale forte sostiene una regolazione fragile)</td></tr>
          </tbody>
        </table>
      `,
    },

    // ─── 5.3 ──────────────────────────────────────────────────────────
    {
      id: 'm05-s03',
      type: 'standard',
      title: 'CPL e VIN — Sostegno e Vincolo',
      subtitle: 'Come i Nodi si abilitano e si limitano reciprocamente',
      content: `
        <h3 class="cf2-narrative__h3" style="color: #27ae60;">CPL — Sostegno</h3>
        <p><em>Un Nodo rende possibile l'attivazione di un altro. Non è causalità diretta: è condizione di possibilità.</em></p>

        <div class="cf2-scena" style="border-left-color: #27ae60; background: #e7f7ed;">
          <p style="font-family: 'JetBrains Mono', monospace; text-align: center; font-size: 1.1rem; margin: 0;">
            <strong>N1 Regolazione</strong> ──CPL──▶ <strong>N4 Apertura</strong> ──CPL──▶ <strong>N7 Desiderio</strong>
          </p>
        </div>

        <ul>
          <li><strong>N1 → N4</strong>: esplorare richiede di non essere sopraffatti dall'esperienza. Senza regolazione stabile, il bambino non ha le risorse per avvicinarsi a ciò che non conosce.</li>
          <li><strong>N4 → N7</strong>: il desiderio nasce nell'incontro con un mondo aperto. Senza esplorazione, l'iniziativa non trova dove andare.</li>
          <li><strong>Implicazione</strong>: N1 fragile → N4 ridotto → N7 basso. La catena si rompe alla radice, ma l'effetto si vede all'altro capo.</li>
        </ul>

        <p class="cf2-narrative__caption">In questa catena N1 non «causa» direttamente N7. Ma la sua fragilità si propaga attraverso N4. Per questo il bambino con bassa iniziativa spesso non ha «un problema di desiderio»: ha un problema di regolazione.</p>

        <hr class="cf2-divider" />

        <h3 class="cf2-narrative__h3" style="color: #e74c3c;">VIN — Vincolo</h3>
        <p><em>Un Nodo limita fisiologicamente un altro, in entrambe le direzioni. Il vincolo non è patologico: è strutturale.</em></p>

        <div class="cf2-scena" style="border-left-color: #e74c3c; background: #fdecea;">
          <p style="font-family: 'JetBrains Mono', monospace; text-align: center; font-size: 1.1rem; margin: 0;">
            <strong>N5 Limite reale</strong> ◀──VIN──▶ <strong>N7 Desiderio</strong>
          </p>
        </div>

        <table class="cf2-table">
          <thead>
            <tr><th>Scenario</th><th>N5</th><th>N7</th><th>Risultato</th></tr>
          </thead>
          <tbody>
            <tr><td>Limite assente / caotico</td><td>!</td><td>!</td><td>Desiderio disorganizzato, impulsività</td></tr>
            <tr><td>Limite eccessivo / rigido</td><td>↑ dominante</td><td>↓</td><td>Ritiro, inibizione dell'iniziativa</td></tr>
            <tr class="cf2-table__row--highlight"><td>Limite abitabile</td><td>~</td><td>~</td><td>Desiderio orientato, iniziativa stabile</td></tr>
          </tbody>
        </table>

        <p class="cf2-narrative__caption">Il VIN tra N5 e N7 mostra perché il limite non è «il nemico del desiderio»: il limite ben calibrato è ciò che dà forma al desiderio.</p>
      `,
    },

    // ─── 5.4 ──────────────────────────────────────────────────────────
    {
      id: 'm05-s04',
      type: 'standard',
      title: 'MED e CMP — Mediazione e Compensazione',
      subtitle: 'Come i Nodi coordinano e si sostituiscono parzialmente',
      content: `
        <h3 class="cf2-narrative__h3" style="color: #2980b9;">MED — Mediazione</h3>
        <p><em>Un Nodo coordina due domini diversi rendendone possibile la connessione. Senza di esso, i due rimangono disconnessi.</em></p>

        <div class="cf2-scena" style="border-left-color: #2980b9; background: #e8f4f8;">
          <p style="font-family: 'JetBrains Mono', monospace; text-align: center; font-size: 1.1rem; margin: 0;">
            <strong>N2 Campo relazionale</strong> ──MED──▶ <strong>N3 Mondo condiviso</strong>
          </p>
        </div>

        <p>Il simbolico non emerge nel vuoto. Emerge dentro una relazione che lo sostiene. Senza un campo relazionale funzionante (N2), l'accesso al mondo condiviso (N3) rimane frammentato, funzionale, o assente.</p>

        <p>Nella lettura condivisa: il bambino non «sviluppa il linguaggio» da solo. È la qualità dello scambio adulto-bambino (N2) che media il passaggio dal gesto individuale al significato condiviso (N3). Se N2 è incoerente — l'adulto non risponde, anticipa sempre, si distrae — N3 non si stabilizza.</p>

        <div class="cf2-box cf2-box--valid" style="border-color: #2980b9; background: #e8f4f8;">
          <div class="cf2-box__title" style="color: #2980b9;">Pattern frequente</div>
          <p>Bambini con competenze simboliche presenti ma discontinue. Non è che «N3 non funziona»: è che N2 non offre mediazione stabile. L'intervento non va su N3 (linguaggio, indicare, condividere) — va su N2 (la qualità del campo relazionale).</p>
        </div>

        <hr class="cf2-divider" />

        <h3 class="cf2-narrative__h3" style="color: #e67e22;">CMP — Compensazione</h3>
        <p><em>Un Nodo sostiene parzialmente una fragilità in un altro, rendendo il campo abitabile anche in presenza di difficoltà.</em></p>

        <div class="cf2-scena" style="border-left-color: #e67e22; background: #fef5ec;">
          <p style="font-family: 'JetBrains Mono', monospace; text-align: center; font-size: 1.05rem; margin: 0;">
            <strong>N2↑ Campo relazionale forte</strong> ──CMP──▶ <strong>N1↓ Regolazione fragile</strong><br/>
            <span style="color: var(--cf2-text-muted); font-size: 0.85rem;">il campo diventa più abitabile</span>
          </p>
        </div>

        <p>Una relazione adulta solida e coerente (N2↑) può compensare una regolazione interna fragile (N1↓): il bambino si regola attraverso l'adulto, anche quando non riesce ancora a farlo autonomamente.</p>

        <div class="cf2-two-col">
          <div class="cf2-box cf2-box--valid" style="border-color: #e67e22; background: #fef5ec;">
            <div class="cf2-box__title" style="color: #e67e22;">1. Non annulla il problema</div>
            <p>N1 resta fragile. La compensazione rende il campo abitabile oggi, ma non sostituisce il lavoro su N1 nel tempo.</p>
          </div>
          <div class="cf2-box cf2-box--valid" style="border-color: #e67e22; background: #fef5ec;">
            <div class="cf2-box__title" style="color: #e67e22;">2. Cambia la lettura del rischio</div>
            <p>Un bambino con N1↓ ma N2↑ ha risorse che non emergono se si guarda solo N1. La lettura deficit-based perde la compensazione.</p>
          </div>
        </div>

        <p class="cf2-emph cf2-emph--center">Per questo la configurazione è l'unità di lettura — non il singolo Nodo.</p>
      `,
    },

    // ─── 5.5 ──────────────────────────────────────────────────────────
    {
      id: 'm05-s05',
      type: 'standard',
      title: 'Quattro configurazioni tipiche',
      subtitle: 'A · B · C · D',
      content: `
        <div class="cf2-cards cf2-cards--grid">
          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #27ae60;">
            <div class="cf2-card__head">
              <span class="cf2-card__badge">A</span>
              <span class="cf2-card__title">Espansiva integrata</span>
            </div>
            <div class="cf2-card__body">
              <div style="margin: 8px 0;">${stateBadges({ N1: '↑', N2: '↑', N3: '↑', N4: '↑', N5: '~', N6: '~', N7: '↑' })}</div>
              <p style="font-size: 0.85rem; color: var(--cf2-text-muted); font-family: 'JetBrains Mono', monospace;"><strong>R</strong>: CPL prevalente · <strong>D</strong>: ↗ · <strong>T</strong>: T2 · <strong>A</strong>: A+</p>
              <p>Campo espansivo, alta abitabilità. I Nodi si sostengono in una dinamica di apertura verso maggiore complessità esperienziale.</p>
              <p><em>Il bambino esplora, condivide, desidera, regola e si relaziona in modo integrato. Non è assenza di difficoltà: è presenza di risorse.</em></p>
              <p class="cf2-card__hint">Contesti familiari/educativi funzionanti; prevenzione universale.</p>
            </div>
          </div>

          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #f39c12;">
            <div class="cf2-card__head">
              <span class="cf2-card__badge" style="background: #f39c12;">B</span>
              <span class="cf2-card__title">Accesso situazionale</span>
            </div>
            <div class="cf2-card__body">
              <div style="margin: 8px 0;">${stateBadges({ N1: '~', N2: '~', N3: '~', N4: '~', N5: '~', N6: '~', N7: '~' })}</div>
              <p style="font-size: 0.85rem; color: var(--cf2-text-muted); font-family: 'JetBrains Mono', monospace;"><strong>R</strong>: MED fragile (N2→N3 discontinuo) · <strong>D</strong>: → · <strong>T</strong>: T1 · <strong>A</strong>: A±</p>
              <p>Competenze presenti ma uso discontinuo. N3 visibile nelle sequenze supportate, ma N1 e N2 instabili rendono l'accesso fragile.</p>
              <p><em>Non è patologia: è una configurazione che richiede attenzione. Le competenze ci sono — serve accompagnamento affinché si stabilizzino.</em></p>
              <p class="cf2-card__hint">Frequente nei bilanci pediatrici; zona di osservazione preventiva.</p>
            </div>
          </div>

          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #e67e22;">
            <div class="cf2-card__head">
              <span class="cf2-card__badge" style="background: #e67e22;">C</span>
              <span class="cf2-card__title">Campo ristretto</span>
            </div>
            <div class="cf2-card__body">
              <div style="margin: 8px 0;">${stateBadges({ N1: '↓', N2: '~', N3: '~', N4: '↓', N5: '~', N6: '~', N7: '↓' })}</div>
              <p style="font-size: 0.85rem; color: var(--cf2-text-muted); font-family: 'JetBrains Mono', monospace;"><strong>R</strong>: CPL mancato (N1↓ → N4 → N7) · <strong>D</strong>: ↘ · <strong>T</strong>: T2 · <strong>A</strong>: A±</p>
              <p>Una fragilità in N1 si propaga per sostegno mancato. Il bambino mostra bassa iniziativa, esplora poco, usa l'adulto in modo funzionale.</p>
              <p><em>Può passare inosservato perché il bambino non è «difficile». È la zona preventiva critica: il campo è abitabile ma non espansivo.</em></p>
              <p class="cf2-card__hint">Zona preventiva critica; richiede lettura attenta.</p>
            </div>
          </div>

          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #e74c3c;">
            <div class="cf2-card__head">
              <span class="cf2-card__badge" style="background: #e74c3c;">D</span>
              <span class="cf2-card__title">Disorganizzazione</span>
            </div>
            <div class="cf2-card__body">
              <div style="margin: 8px 0;">${stateBadges({ N1: '↓', N2: '!', N3: '↓', N4: '↓', N5: '!', N6: '↓', N7: '?' })}</div>
              <p style="font-size: 0.85rem; color: var(--cf2-text-muted); font-family: 'JetBrains Mono', monospace;"><strong>R</strong>: relazioni interrotte/caotiche · <strong>D</strong>: ↘ collasso · <strong>T</strong>: T3 · <strong>A</strong>: A−</p>
              <p>Collasso dell'esperienza. N1 fragile impedisce la regolazione, N2 incoerente non offre sostegno, N5 caotico distrugge il campo invece di strutturarlo.</p>
              <p><em>La configurazione non descrive il bambino: descrive un campo che non riesce più a sostenere lo sviluppo. L'intervento riguarda il campo, non solo il bambino.</em></p>
              <p class="cf2-card__hint">Soglia NPI/clinica; richiede valutazione specialistica.</p>
            </div>
          </div>
        </div>

        <hr class="cf2-divider" />

        <h3 class="cf2-narrative__h3">Legenda dei codici di stato</h3>
        <div class="cf2-chips">
          <div class="cf2-chip" style="border-left: 4px solid #27ae60;"><span class="cf2-chip__label">↑ Espansivo</span></div>
          <div class="cf2-chip" style="border-left: 4px solid #2980b9;"><span class="cf2-chip__label">~ Stabile</span></div>
          <div class="cf2-chip" style="border-left: 4px solid #e67e22;"><span class="cf2-chip__label">↓ Ristretto</span></div>
          <div class="cf2-chip" style="border-left: 4px solid #e74c3c;"><span class="cf2-chip__label">! Disorganizzato</span></div>
          <div class="cf2-chip" style="border-left: 4px solid #95a5a6;"><span class="cf2-chip__label">? Non leggibile</span></div>
        </div>
      `,
    },

    // ─── 5.6 ──────────────────────────────────────────────────────────
    {
      id: 'm05-s06',
      type: 'standard',
      title: 'È la configurazione che legge il rischio',
      subtitle: 'Non il singolo Nodo',
      content: `
        <blockquote class="cf2-blockquote">«Nessun Nodo, da solo, identifica il rischio: lo fa la configurazione.»</blockquote>
        <p class="cf2-narrative__caption">Questo è il motivo per cui il metodo non diagnostica — individua traiettorie.</p>

        <hr class="cf2-divider" />

        <h3 class="cf2-narrative__h3">Stesso Nodo (N3), tre configurazioni, tre traiettorie</h3>

        <div class="cf2-cards cf2-cards--vertical">
          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #27ae60;">
            <div class="cf2-card__head"><span class="cf2-card__badge">A</span><span class="cf2-card__title">N3↑ in campo integrato</span></div>
            <div class="cf2-card__body">
              <div style="margin: 4px 0;">${stateBadges({ N1: '↑', N2: '↑', N3: '↑', N4: '↑', N7: '↑' })}</div>
              <p>N3 espansivo in campo integrato. Il bambino partecipa pienamente al mondo condiviso. Nessun segnale di attenzione.</p>
            </div>
          </div>

          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #f39c12;">
            <div class="cf2-card__head"><span class="cf2-card__badge" style="background: #f39c12;">B</span><span class="cf2-card__title">N3~ presente ma discontinuo</span></div>
            <div class="cf2-card__body">
              <div style="margin: 4px 0;">${stateBadges({ N1: '~', N2: '~', N3: '~', N4: '~', N7: '~' })}</div>
              <p>N3 presente ma discontinuo. Il bambino accede al mondo condiviso nelle sequenze strutturate, ma non lo stabilizza. Zona di osservazione.</p>
            </div>
          </div>

          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #e74c3c;">
            <div class="cf2-card__head"><span class="cf2-card__badge" style="background: #e74c3c;">D</span><span class="cf2-card__title">N3↓ in campo disorganizzato</span></div>
            <div class="cf2-card__body">
              <div style="margin: 4px 0;">${stateBadges({ N1: '↓', N2: '!', N3: '↓', N4: '↓', N7: '?' })}</div>
              <p>N3 ristretto in campo disorganizzato. L'accesso al mondo condiviso è compromesso non perché «N3 sia rotto», ma perché il campo relazionale non lo sostiene più.</p>
            </div>
          </div>
        </div>

        <p class="cf2-emph cf2-emph--center">Stesso Nodo. Tre configurazioni. Tre traiettorie completamente diverse.</p>

        <hr class="cf2-divider" />

        <div class="cf2-two-col">
          <div class="cf2-box cf2-box--valid">
            <div class="cf2-box__title">✓ Cosa la configurazione permette</div>
            <ul>
              <li>Leggere risorse e fragilità insieme</li>
              <li>Identificare compensazioni (N2↑ con N1↓)</li>
              <li>Non confondere la manifestazione con la causa</li>
              <li>Orientare l'intervento sul campo, non sul sintomo</li>
            </ul>
          </div>
          <div class="cf2-box cf2-box--invalid">
            <div class="cf2-box__title">✗ Cosa evita</div>
            <ul>
              <li>Diagnosticare dal Nodo singolo</li>
              <li>Patologizzare configurazioni che hanno risorse</li>
              <li>Perdere la compensazione</li>
              <li>Confondere discontinuità con deficit</li>
            </ul>
          </div>
        </div>
      `,
    },

    // ─── 5.7 ──────────────────────────────────────────────────────────
    {
      id: 'm05-s07',
      type: 'narrative',
      title: 'Il caso-guida nella dinamica dei Nodi',
      subtitle: 'La lettura condivisa come configurazione B — accesso situazionale',
      content: `
        <div class="cf2-scena">
          <p><em>Il bambino prende il libro, lo apre, guarda alcune immagini, indica una figura, vocalizza e guarda l'adulto. Il genitore nomina l'immagine, sorride, aspetta. Il bambino torna a guardare il libro, gira pagina, poi mostra un'altra figura all'adulto.</em></p>
        </div>

        <h3 class="cf2-narrative__h3">La configurazione</h3>
        <div style="text-align: center; margin: 12px 0;">
          ${stateBadges({ N1: '~', N2: '↑', N3: '~', N4: '↓', N5: '~', N6: '~', N7: '~' })}
        </div>

        <ul>
          <li><strong>N2↑</strong> · Il genitore nomina, sorride, aspetta — campo relazionale attivo</li>
          <li><strong>N3~</strong> · Il bambino indica, vocalizza, alterna sguardo — accesso presente ma non stabilizzato</li>
          <li><strong>N4↓</strong> · Esplorazione ridotta: il bambino non si allontana, resta nella sequenza strutturata</li>
          <li><strong>N7~</strong> · Interesse per alcune figure — desiderio presente ma dipendente dalla struttura</li>
        </ul>

        <hr class="cf2-divider" />

        <h3 class="cf2-narrative__h3">Le relazioni attive</h3>
        <div class="cf2-cards cf2-cards--vertical">
          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #2980b9;">
            <div class="cf2-card__head"><span class="cf2-card__badge">N2 → N3</span><span class="cf2-card__title">MED · Mediazione</span></div>
            <div class="cf2-card__body"><p>La co-regolazione del genitore (attende, risponde, sostiene) media l'accesso al mondo condiviso. Quando il genitore anticipa o cambia ritmo, N3 si interrompe.</p></div>
          </div>
          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #27ae60;">
            <div class="cf2-card__head"><span class="cf2-card__badge" style="background: #27ae60;">N7 → N3</span><span class="cf2-card__title">CPL · Sostegno</span></div>
            <div class="cf2-card__body"><p>L'interesse del bambino per alcune figure sostiene i momenti di accesso condiviso. Le sequenze più ricche avvengono sulle figure che lo attraggono.</p></div>
          </div>
          <div class="cf2-card cf2-card--open" style="--cf2-card-accent: #e67e22;">
            <div class="cf2-card__head"><span class="cf2-card__badge" style="background: #e67e22;">N2 compensa N1</span><span class="cf2-card__title">CMP · Compensazione</span></div>
            <div class="cf2-card__body"><p>La regolazione non è ancora autonoma — il bambino si regola attraverso il campo adulto. La co-presenza del genitore è condizione dell'esperienza.</p></div>
          </div>
        </div>

        <hr class="cf2-divider" />

        <div class="cf2-box cf2-box--valid" style="border-color: #f39c12; background: #fef5ec;">
          <div class="cf2-box__title" style="color: #f39c12;">Configurazione B — Accesso situazionale</div>
          <p>La lettura condivisa mostra N3 presente nelle sequenze supportate dall'adulto, ma non ancora stabilizzato in modo autonomo. N1 e N2 sono base sufficiente ma fragile: quando l'adulto cambia ritmo o anticipa, la sequenza si interrompe.</p>
          <p><em>Non è un problema: è una configurazione evolutivamente aperta (A±, D: ↗). Il campo può espandersi con accompagnamento.</em></p>
        </div>

        <h3 class="cf2-narrative__h3">CE dal caso-guida</h3>
        <pre style="background: var(--cf2-bg); border: 1px solid var(--cf2-border); border-radius: var(--cf2-radius-md); padding: 16px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.85rem; line-height: 1.55; overflow-x: auto;">
CE =
  S: N1~ N2↑ N3~ N4↓ N5~ N6~ N7~
  R: N2→N3 (MED), N7→N3 (CPL), N2→N1 (CMP)
  D: ↗
  T: T1/T2
  A: A±
        </pre>

        <p class="cf2-narrative__caption"><em>Traduzione naturale</em>: Campo relazionale forte che media l'accesso al mondo condiviso; il desiderio del bambino orienta le sequenze più ricche; la regolazione è sostenuta dall'adulto più che autonoma; la configurazione è fragile ma evolutivamente aperta.</p>

        <p class="cf2-emph cf2-emph--center" style="margin-top: 16px;">→ Modulo 6 — La Grammatica delle Configurazioni</p>
      `,
      notes:
        'Nel Modulo 6 costruiremo la Grammatica delle Configurazioni: il sistema formale che permette di scrivere, leggere e comunicare le CE tra professionisti.',
    },
  ],
};
