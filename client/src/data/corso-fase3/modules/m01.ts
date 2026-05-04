import { Module } from '../types';
import { CASO_GUIDA_F3 } from '../caso-guida';

const COMPONENTI_CAMPO = [
  {
    id: 'bambino',
    label: 'Bambino',
    descrizione:
      "Soggetto incarnato, temporale e relazionale. Non è l'oggetto dell'intervento F3: è uno dei poli del campo. Modificare il bambino direttamente significa isolare il soggetto dalle condizioni che rendono possibile il suo sviluppo.",
    colore: 'var(--corso-n3)',
    nota:
      'Il bambino non è mai il bersaglio del micro-dispositivo — anche quando il cambiamento osservabile riguarda il suo comportamento.',
  },
  {
    id: 'adulto',
    label: 'Adulto',
    descrizione:
      "Il professionista, il genitore, l'educatore — chiunque condivida il campo con il bambino. Polo del campo su cui l'intervento F3 agisce direttamente: le micro-azioni riguardano quasi sempre una modifica nel comportamento adulto, nel ritmo, nella risposta.",
    colore: 'var(--corso-n2)',
    nota:
      "Il più delle volte il micro-dispositivo F3 chiede qualcosa all'adulto — non al bambino.",
  },
  {
    id: 'contesto',
    label: 'Contesto',
    descrizione:
      "Setting, ritmo, oggetti, struttura dell'incontro, tempo disponibile. Le condizioni materiali e temporali entro cui il campo si organizza. Un micro-dispositivo può agire sul contesto modificando la durata, l'oggetto presente, la disposizione spaziale.",
    colore: 'var(--corso-primary)',
    nota:
      'Un oggetto diverso, una posizione diversa, cinque minuti in più: sono modifiche di contesto che cambiano il campo.',
  },
];

const TRE_PROPRIETA = [
  {
    id: 'integrabile',
    numero: '1',
    nome: 'Breve e integrabile',
    testo:
      'Si inserisce nel contesto professionale reale senza richiedere setting separati, tempi aggiuntivi o strutture dedicate. Un dispositivo che funziona solo in una sessione apposita non è un micro-dispositivo di campo: è un intervento specialistico.',
    test: 'Funziona nel tempo e nel setting in cui già ci troviamo?',
    esempio_ok: 'Cinque minuti durante il bilancio pediatrico.',
    esempio_no: 'Una serie di sedute di stimolazione logopedica settimanale.',
  },
  {
    id: 'reversibile',
    numero: '2',
    nome: 'Non specialistico e reversibile',
    testo:
      'Non richiede una competenza tecnica specialistica per essere applicato. Può essere modificato o interrotto senza danno se il campo non risponde. La reversibilità non è un limite: è la condizione che permette di osservare davvero gli effetti prima di continuare.',
    test: "Se smetto, il campo torna com'era? Posso rivalutare senza conseguenze?",
    esempio_ok: 'Rallentare il ritmo della risposta adulta. Attendere prima di nominare.',
    esempio_no: 'Avviare un programma di training con protocollo fisso.',
  },
  {
    id: 'osservabile',
    numero: '3',
    nome: 'Osservabile nei suoi effetti',
    testo:
      "Produce modificazioni visibili nel campo entro il tempo reale dell'intervento. L'indicatore di risonanza — che cosa ci si aspetta cambi nel campo — viene definito prima dell'azione, non dopo. Se l'effetto non è osservabile, non è possibile rivalutare la CE.",
    test: "Definisco prima cosa cerco. Lo vedo entro il tempo dell'incontro?",
    esempio_ok:
      "La sequenza bambino-adulto si allunga? Il bambino include l'adulto? → Osservabile in cinque minuti.",
    esempio_no:
      '"I risultati si vedranno nel tempo." → Non è un micro-dispositivo di campo.',
  },
];

const CASO_GUIDA_M1 = {
  adulto: [
    'Rallentare il ritmo: attendere che la sequenza del bambino si completi prima di rispondere',
    "Nominare ciò che il bambino indica — non ciò che si vorrebbe che indicasse",
    "Ridurre le domande dirette (\"Cos'è questo?\") che interrompono l'iniziativa del bambino",
    'Tenere le mani ferme: non girare le pagine, non indicare prima del bambino',
  ],
  contesto: [
    "Proporre il libro solo quando il campo relazionale è già regolato (non all'inizio della visita)",
    'Ridurre le interruzioni esterne nel momento della lettura condivisa',
    "Scegliere un libro con immagini semplici e ben distanziate (meno conflitti per l'attenzione)",
  ],
  bambino_non_target:
    'Nessuna micro-azione riguarda direttamente il bambino. Non si chiede al bambino di indicare, di nominare, di guardare. Si modificano le condizioni del campo — il bambino risponde (o non risponde) a quelle condizioni.',
};

// SVG triangolo dei tre poli (decorativo, statico).
const triangleSvg = `
  <svg viewBox="0 0 360 220" class="corso-campo-triangle" role="img" aria-label="Campo relazionale: triangolo con i tre poli Bambino, Adulto, Contesto">
    <defs>
      <marker id="f3m1-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="var(--corso-text-muted)" />
      </marker>
    </defs>
    <line x1="180" y1="50" x2="80"  y2="170" stroke="var(--corso-text-muted)" stroke-width="1.5" marker-end="url(#f3m1-arr)" marker-start="url(#f3m1-arr)" />
    <line x1="180" y1="50" x2="280" y2="170" stroke="var(--corso-text-muted)" stroke-width="1.5" marker-end="url(#f3m1-arr)" marker-start="url(#f3m1-arr)" />
    <line x1="80"  y1="170" x2="280" y2="170" stroke="var(--corso-text-muted)" stroke-width="1.5" marker-end="url(#f3m1-arr)" marker-start="url(#f3m1-arr)" />
    <text x="180" y="118" text-anchor="middle" class="corso-campo-triangle__center">campo relazionale</text>
    <g>
      <circle cx="180" cy="50"  r="22" fill="var(--corso-n3)" />
      <text x="180" y="55" text-anchor="middle" class="corso-campo-triangle__lab">Bambino</text>
    </g>
    <g>
      <circle cx="80" cy="170" r="22" fill="var(--corso-n2)" />
      <text x="80" y="175" text-anchor="middle" class="corso-campo-triangle__lab">Adulto</text>
    </g>
    <g>
      <circle cx="280" cy="170" r="22" fill="var(--corso-primary)" />
      <text x="280" y="175" text-anchor="middle" class="corso-campo-triangle__lab">Contesto</text>
    </g>
  </svg>
`;

export const Module01: Module = {
  id: 'm01',
  number: 1,
  title: 'Il principio del campo',
  shortTitle: 'Principio del campo',
  accent: '#1e8bc3',
  slides: [
    // ─── 1.1 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m01-01',
      type: 'standard',
      title: 'Dopo la CE, cosa si fa?',
      subtitle: 'Il punto di partenza di ogni strumento',
      content: `
        <div class="corso-two-col corso-two-col--40-60">
          <div class="corso-pane">
            <div class="corso-pane__eyebrow">La risposta naturale</div>
            <p>Il professionista ha in mano la CE. Sa che il campo relazionale è attivo (N2↑), che l'accesso al mondo condiviso è presente ma discontinuo (N3~), che l'esplorazione è ridotta (N4↓).</p>
            <p>La risposta che spesso emerge per prima è questa:</p>
            <blockquote class="corso-blockquote">
              «Bisogna lavorare sul bambino. Stimolarlo. Aumentare la frequenza del gesto di indicare. Migliorare il linguaggio.»
            </blockquote>
            <p>Questo impulso è comprensibile: parla il linguaggio dei programmi di intervento precoce, della stimolazione cognitiva, del training di competenze.</p>
          </div>
          <div class="corso-pane corso-pane--accent">
            <div class="corso-pane__eyebrow">Il problema metodologico</div>
            <p>Questa risposta poggia su un'assunzione implicita: che il bambino sia un'unità isolabile su cui si può intervenire direttamente.</p>
            <p>La Fase 1 ha posto un vincolo diverso: il bambino non è un organismo che accumula competenze — è un soggetto incarnato, temporale e relazionale. Il suo sviluppo non avviene <em>nonostante</em> il campo relazionale: avviene <em>attraverso</em> di esso.</p>
            <p>Agire sul bambino isolato dalla configurazione relazionale significa agire sull'effetto senza toccare le condizioni che lo producono.</p>
          </div>
        </div>

        <div class="corso-axis-arrow" aria-hidden="true">
          <span class="corso-axis-arrow__side corso-axis-arrow__side--left">Azione sul bambino</span>
          <span class="corso-axis-arrow__sep">←  ?  →</span>
          <span class="corso-axis-arrow__side corso-axis-arrow__side--right">Modifica del campo</span>
        </div>
        <p class="corso-narrative__caption">La Fase 3 risponde a questa domanda in modo preciso. Non è una scelta etica: è una scelta metodologica.</p>
      `,
      notes:
        "La risposta naturale non è sbagliata in assoluto: è fuori modello rispetto a questo framework. Il Modulo 1 spiega perché e propone l'alternativa.",
    },

    // ─── 1.2 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m01-02',
      type: 'standard',
      title: "Un'eredità dalla Fase 1",
      subtitle: 'Perché non si agisce sul bambino isolato',
      content: `
        <blockquote class="corso-blockquote" style="border-left-color: var(--corso-f1);">
          «Il bambino non è un organismo che accumula competenze né un insieme di funzioni che maturano in sequenza. È un soggetto incarnato, temporale e relazionale, la cui esistenza è costitutivamente dipendente da un campo di esperienze e relazioni che non può essere separato da lui senza perderne il senso.»
          <footer class="corso-blockquote__src">← F1 — Fondazione ontologica</footer>
        </blockquote>

        <div class="corso-num-list">
          <div class="corso-num-item">
            <span class="corso-num-item__n" style="color: var(--corso-f1);">①</span>
            <div>
              <div class="corso-num-item__title">Il campo non è lo sfondo</div>
              <p>Il campo relazionale non è il contesto in cui lo sviluppo avviene: è la <strong>condizione</strong> che lo rende possibile. Lo sviluppo bambino-adulto-contesto non è descrivibile come sviluppo del bambino più il suo ambiente.</p>
            </div>
          </div>
          <div class="corso-num-item">
            <span class="corso-num-item__n" style="color: var(--corso-f1);">②</span>
            <div>
              <div class="corso-num-item__title">L'oggetto di osservazione pertinente è la configurazione</div>
              <p>Ciò che si osserva non è il bambino isolato (le sue competenze, i suoi comportamenti, il suo sviluppo individuale) ma la configurazione relazionale in cui il bambino esiste in quel momento.</p>
            </div>
          </div>
          <div class="corso-num-item">
            <span class="corso-num-item__n" style="color: var(--corso-f1);">③</span>
            <div>
              <div class="corso-num-item__title">Lo strumento deve agire sulla configurazione</div>
              <p>Un dispositivo che osserva e modifica il bambino come unità indipendente non è semplicemente incompleto: è metodologicamente incoerente rispetto ai fondamenti del progetto. F3 eredita questo vincolo direttamente.</p>
            </div>
          </div>
        </div>

        <p class="corso-emph corso-emph--center" style="color: var(--corso-f3); margin-top: 18px;">
          <em>Lo strumento F3 non corregge il bambino: modifica il campo relazionale di esperienza.</em>
        </p>
        <p class="corso-narrative__caption">Questa non è una posizione etica. È la conseguenza operativa dell'Asse 1.</p>
      `,
      guardrail: {
        code: 'C-F3-10',
        label: 'Vincolo fondativo',
        text:
          'Un dispositivo F3 che ha senso solo riferito al bambino separato dal campo — "il bambino deve fare X" — non è coerente con il metodo. Il soggetto grammaticale delle micro-azioni è sempre il campo, non il bambino.',
      },
    },

    // ─── 1.3 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m01-03',
      type: 'diagram',
      title: 'Il campo relazionale di esperienza',
      subtitle: 'I tre poli e le loro relazioni',
      intro: `
        <div class="corso-campo-triangle__wrap">
          ${triangleSvg}
          <p class="corso-narrative__caption">Il campo non è la somma di tre elementi: è la configurazione delle relazioni tra loro.</p>
        </div>
      `,
      interactive: {
        kind: 'chip-accordion',
        items: COMPONENTI_CAMPO.map((c) => ({
          id: c.id,
          label: c.label,
          bodyHtml: `
            <p>${c.descrizione}</p>
            <p style="margin-top: 8px; font-style: italic; color: var(--corso-text-muted);">${c.nota}</p>
          `,
        })),
      },
      content: `
        <div class="corso-campo-roles">
          <div class="corso-campo-role">
            <span class="corso-campo-role__dot" style="background: var(--corso-n3);"></span>
            <strong>Bambino</strong> — non è il bersaglio dell'azione
          </div>
          <div class="corso-campo-role">
            <span class="corso-campo-role__dot" style="background: var(--corso-n2);"></span>
            <strong>Adulto</strong> — il polo più direttamente modificabile
          </div>
          <div class="corso-campo-role">
            <span class="corso-campo-role__dot" style="background: var(--corso-primary);"></span>
            <strong>Contesto</strong> — setting, ritmo, oggetti: modifiche possibili e immediate
          </div>
        </div>
        <p class="corso-narrative__caption">Il micro-dispositivo F3 agisce sul polo adulto e/o sul contesto. Il bambino risponde alla modificazione del campo — non è il destinatario delle istruzioni.</p>
      `,
      notes:
        'Nel caso-guida: il pediatra e il genitore sono il polo adulto. Il bilancio pediatrico e il libro illustrato sono il contesto. Nessuna micro-azione riguarderà direttamente il bambino.',
    },

    // ─── 1.4 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m01-04',
      type: 'comparison',
      title: 'Azione sul bambino o modifica del campo',
      subtitle: 'Una distinzione strutturalmente necessaria',
      content: `
        <div class="corso-cmp2">
          <section class="corso-cmp2__col corso-cmp2__col--left">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab">Azione sul bambino</span>
              <h3 class="corso-cmp2__title">Il bambino come bersaglio</h3>
            </header>
            <ul class="corso-cmp2__items">
              <li>
                <div class="corso-cmp2__item-text">Insegnare al bambino a indicare</div>
                <div class="corso-cmp2__item-note">Il gesto di indicare emerge dal campo condiviso — non è un'abilità isolabile da allenare.</div>
              </li>
              <li>
                <div class="corso-cmp2__item-text">Stimolare il linguaggio del bambino</div>
                <div class="corso-cmp2__item-note">Il linguaggio emerge nello scambio relazionale. Stimolarlo direttamente bypassa le condizioni che lo rendono possibile.</div>
              </li>
              <li>
                <div class="corso-cmp2__item-text">Aumentare la frequenza di un comportamento target</div>
                <div class="corso-cmp2__item-note">Prende il comportamento come unità di intervento e perde di vista la configurazione relazionale che lo produce.</div>
              </li>
            </ul>
            <p class="corso-cmp2__foot-note">Queste azioni non sono sbagliate in assoluto. Il punto è che non sono strumenti F3: agiscono sul soggetto isolato, non sul campo.</p>
          </section>

          <section class="corso-cmp2__col corso-cmp2__col--right">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab" style="color: var(--corso-f3);">Modifica del campo relazionale</span>
              <h3 class="corso-cmp2__title">Il campo come bersaglio</h3>
            </header>
            <ul class="corso-cmp2__items">
              <li>
                <div class="corso-cmp2__item-text">Rallentare il ritmo dell'adulto perché il gesto del bambino trovi uno spazio di risposta</div>
                <div class="corso-cmp2__item-note">Agisce sulla condizione relazionale che rende possibile il gesto — non sul gesto stesso.</div>
              </li>
              <li>
                <div class="corso-cmp2__item-text">Aumentare la stabilità dello scambio condiviso così che il bambino possa mantenere l'iniziativa</div>
                <div class="corso-cmp2__item-note">Il linguaggio emerge quando il campo è stabile. Si lavora sul campo, non sul bambino.</div>
              </li>
              <li>
                <div class="corso-cmp2__item-text">Creare le condizioni perché la sequenza del bambino possa completarsi</div>
                <div class="corso-cmp2__item-note">L'unità di intervento è la configurazione relazionale, non il singolo comportamento osservato.</div>
              </li>
            </ul>
          </section>
        </div>

        <div class="corso-cmp2__footer">
          <span class="corso-cmp2__footer-lab">Principio operativo fondamentale</span>
          <p>«Lo strumento F3 non corregge il bambino: modifica il campo relazionale di esperienza in cui il bambino esiste.»</p>
        </div>

        <p class="corso-narrative__caption" style="margin-top: 14px;">
          Le azioni della colonna sinistra non sono necessariamente sbagliate in altri framework. Il punto è che non sono strumenti F3: presuppongono il bambino come unità isolabile di intervento, il che non è coerente con i fondamenti di questo metodo.
        </p>
      `,
    },

    // ─── 1.5 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m01-05',
      type: 'interactive',
      title: "Cosa rende un'azione un micro-dispositivo di campo",
      subtitle: 'Tre proprietà, tutte necessarie',
      interactive: {
        kind: 'expandable-cards',
        layout: 'vertical',
        multiOpen: true,
        defaultOpen: ['integrabile'],
        cards: TRE_PROPRIETA.map((p) => ({
          id: p.id,
          color: 'var(--corso-module-accent)',
          badge: p.numero,
          title: p.nome,
          summary: p.test,
          detail: `
            <p>${p.testo}</p>
            <div class="corso-prop-examples">
              <div class="corso-prop-examples__chip corso-prop-examples__chip--ok">
                <span class="corso-prop-examples__icon">✓</span>
                <div>
                  <span class="corso-prop-examples__lab">Esempio</span>
                  <p>${p.esempio_ok}</p>
                </div>
              </div>
              <div class="corso-prop-examples__chip corso-prop-examples__chip--no">
                <span class="corso-prop-examples__icon">✗</span>
                <div>
                  <span class="corso-prop-examples__lab">Fuori perimetro</span>
                  <p>${p.esempio_no}</p>
                </div>
              </div>
            </div>
          `,
        })),
      },
      content: `
        <p class="corso-emph corso-emph--center" style="margin-top: 8px;">
          <em>Un'azione che non rispetta anche una sola di queste proprietà non è un micro-dispositivo di campo: è un'altra cosa (un protocollo, una tecnica, un training). Non è sbagliata in assoluto — è fuori dal perimetro di F3.</em>
        </p>
      `,
      guardrail: {
        code: 'C-F3-11',
        label: 'Vincolo di scala',
        text:
          'F3 produce micro-dispositivi, non programmi. Se il dispositivo richiede più incontri, setting separati o competenza tecnica specialistica per essere applicato, va riconsiderato alla luce di queste tre proprietà.',
      },
    },

    // ─── 1.6 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m01-06',
      type: 'narrative',
      title: 'Cosa si modifica nel bilancio pediatrico',
      subtitle: 'Applicazione del principio al caso-guida',
      content: `
        <div class="corso-narrative">
          <div class="corso-scena">
            ${CASO_GUIDA_F3.scena
              .split('\n\n')
              .map((p) => `<p><em>${p.trim()}</em></p>`)
              .join('')}
          </div>

          <h3 class="corso-narrative__h3">Il campo in questo caso ha tre poli. Cosa può cambiare?</h3>

          <div class="corso-two-col corso-two-col--40-60">
            <div class="corso-pane">
              <div class="corso-pane__eyebrow" style="color: var(--corso-n2);">Polo adulto · cosa cambia</div>
              <ul class="corso-arrow-list">
                ${CASO_GUIDA_M1.adulto.map((a) => `<li>${a}</li>`).join('')}
              </ul>
            </div>
            <div class="corso-pane">
              <div class="corso-pane__eyebrow" style="color: var(--corso-primary);">Polo contesto · setting e oggetti</div>
              <ul class="corso-arrow-list">
                ${CASO_GUIDA_M1.contesto.map((c) => `<li>${c}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="corso-bambino-box">
            <div class="corso-bambino-box__eyebrow">Il bambino nel dispositivo</div>
            <p><em>${CASO_GUIDA_M1.bambino_non_target}</em></p>
            <p class="corso-narrative__caption">Il bambino risponderà (o non risponderà) alla modificazione del campo. Questa risposta è l'indicatore di risonanza che guiderà la rivalutazione della CE nel Modulo 2.</p>
          </div>

          <p class="corso-emph corso-emph--center" style="margin-top: 24px;">
            <em>Nella prossima sezione vediamo come questa scena si traduce in una pipeline di trasformazione: dalla CE al dispositivo, passo per passo.</em>
          </p>
        </div>
      `,
      notes: 'Prossimo modulo: M2 — Dalla CE allo strumento.',
    },
  ],
};
