import { Module } from '../types';
import { CASO_GUIDA_F3 } from '../caso-guida';

// ─── Dati globali del modulo ─────────────────────────────────────────────

const QUATTRO_DOMANDE = [
  {
    id: 'd1',
    numero: 'D1',
    domanda: 'Dove si restringe il campo?',
    sottotitolo: 'La lettura della limitazione',
    spiegazione:
      'Non «qual è il problema del bambino» — ma «dove il campo riduce la propria abitabilità?». La domanda è relazionale: la restrizione è sempre una configurazione del campo, non una proprietà isolata del bambino. D1 emerge dalla lettura di T, A e dei nodi ↓ nella CE.',
    nel_caso_guida:
      "La restrizione è nella durata della sequenza condivisa: N3~ non si stabilizza autonomamente. N4↓ segnala che l'esplorazione è ridotta. T2 indica fragilità strutturale. Il campo regge ma non consolida.",
    errore_tipico:
      '«Qual è il problema di questo bambino?» Il soggetto grammaticale sbagliato: la restrizione non appartiene al bambino — è una proprietà configurazionale del campo.',
  },
  {
    id: 'd2',
    numero: 'D2',
    domanda: 'Cosa funziona già?',
    sottotitolo: 'La lettura delle risorse',
    spiegazione:
      'Prima di cercare cosa non va, leggere cosa regge. I nodi ↑ e i segnali di tenuta (T2+) indicano le risorse su cui il dispositivo può appoggiarsi. Un dispositivo che ignora le risorse esistenti ricostruisce dal basso ciò che il campo ha già. D2 emerge dalla lettura di N↑, T, A+ nella CE.',
    nel_caso_guida:
      'N2↑: il campo relazionale è solido, il genitore co-regola attivamente. R: N2→N3 indica che la risorsa sta già spingendo nella direzione giusta. D↗: il campo è in espansione. Nessuna ricostruzione necessaria — c\'è terreno su cui appoggiarsi.',
    errore_tipico:
      "Saltare D2 e passare direttamente a D3. Progettare l'azione senza conoscere le risorse porta a dispositivi che lavorano in parallelo al campo invece di appoggiarsi su ciò che già funziona.",
  },
  {
    id: 'd3',
    numero: 'D3',
    domanda: "Qual è l'azione che aumenta l'abitabilità?",
    sottotitolo: "La scelta dell'orientamento",
    spiegazione:
      "Non «cosa sarebbe bello fare» — ma «quale azione, in questo campo specifico, con queste risorse, nella direzione D indicata dalla CE, produce un aumento dell'abitabilità?» D3 è la domanda della funzione: orienta verso Stabilizzare, Ampliare, Mediare o Proteggere in base alle risposte a D1 e D2. Non prescrive il dispositivo: orienta la scelta della funzione.",
    nel_caso_guida:
      'T2 + R: N2→N3 + D↗ → MEDIAZIONE. La transizione è già in corso e va sostenuta — non avviata (Ampliare), non contenuta (Stabilizzare), non prevenuta (Proteggere). Il campo ha bisogno di accompagnamento, non di novità.',
    errore_tipico:
      'Rispondere a D3 prima di D1 e D2. La domanda «cosa fare?» senza aver letto la restrizione e le risorse porta a scegliere la funzione per abitudine o per preferenza professionale — non per lettura del campo.',
  },
  {
    id: 'd4',
    numero: 'D4',
    domanda: 'Qual è il minimo intervento sufficiente?',
    sottotitolo: 'Il principio della parsimonia',
    spiegazione:
      "Una volta identificata la funzione (D3), la quarta domanda chiede: qual è la versione più semplice, più breve, più integrabile che realizza quella funzione in questo campo? Il principio del minimo intervento sufficiente non è rinuncia: è precisione. Interventi più complessi rischiano di sovraordinare l'azione professionale al campo invece di inserirsi in esso.",
    nel_caso_guida:
      "Il minimo è modificare il ritmo adulto nella scena già in corso — non aggiungere materiali, non cambiare setting, non introdurre tecniche. Cinque minuti durante il bilancio pediatrico, con il libro già presente. Il dispositivo è interno alla scena.",
    errore_tipico:
      '«Se un dispositivo semplice funziona, uno più elaborato funzionerà meglio.» No: un dispositivo sovradimensionato rispetto al campo può produrre nuove restrizioni. Il minimo non è il meno ambizioso — è il più calibrato.',
  },
];

const ERRORI_DECISIONALI = [
  {
    id: 'ed1',
    numero: '①',
    titoloBreve: 'Senza CE',
    titolo: 'Decidere senza leggere la CE',
    descrizione:
      "L'azione viene scelta sulla base di categorie preesistenti (diagnosi, protocollo standard, preferenza tecnica) senza che la CE abbia orientato la scelta della funzione.",
    meccanismo:
      'Il professionista ha già una risposta prima che D1 venga posta. La CE, se prodotta, serve per giustificare la scelta già fatta — non per orientarla.',
    conseguenza:
      'Il dispositivo è coerente con la categoria, non con il campo. Può produrre effetti inappropriati: stabilizzare un campo che andrebbe ampliato, ampliare un campo che andrebbe protetto.',
    antidoto:
      'Porre D1 prima di qualsiasi altra domanda. La risposta a D1 deve emergere dalla CE, non da ipotesi cliniche sul bambino.',
  },
  {
    id: 'ed2',
    numero: '②',
    titoloBreve: 'Insistere',
    titolo: "Insistere quando l'indicatore di risonanza è assente",
    descrizione:
      'Il dispositivo viene applicato ripetutamente anche quando il campo non risponde — aumentando intensità, frequenza o durata della stessa azione.',
    meccanismo:
      'Il professionista interpreta l\'assenza di risposta come insufficienza del dispositivo («non ne abbiamo fatto abbastanza») invece che come segnale di riallineamento da leggere.',
    conseguenza:
      'Il campo può rispondere con chiusura, rifiuto o aumento della disorganizzazione. Si entra in un ciclo in cui il dispositivo errato viene potenziato invece di essere rivalutato.',
    antidoto:
      "L'assenza dell'indicatore di risonanza è un segnale di rientro: tornare a D1 con la CE aggiornata. Non si insiste: si rilegge.",
  },
  {
    id: 'ed3',
    numero: '③',
    titoloBreve: 'Sintomo per nodo',
    titolo: 'Confondere il nodo bersaglio con il sintomo presentato',
    descrizione:
      'Il nodo dominante viene identificato con il comportamento che il bambino esprime — il sintomo visibile — invece che con il nodo la cui attivazione muove il campo.',
    meccanismo:
      'Il professionista risponde a D1 («dove si restringe il campo?») descrivendo il comportamento del bambino invece della configurazione del campo. Il nodo dominante diventa «il bambino che non parla» invece di «N3 come condizione di accesso al mondo condiviso».',
    conseguenza:
      'Il dispositivo punta al sintomo, non al campo. Non produce effetti sulla configurazione relazionale perché non ha agganciato il nodo giusto.',
    antidoto:
      'Riformulare D1 in termini di configurazione del campo: non «il bambino che X» ma «il campo in cui X non è disponibile».',
  },
  {
    id: 'ed4',
    numero: '④',
    titoloBreve: 'Ciclo lineare',
    titolo: 'Usare il ciclo una volta sola',
    descrizione:
      "Il ciclo decisionale viene applicato una volta — all'inizio del lavoro — e il dispositivo scelto viene mantenuto invariato anche quando il campo cambia.",
    meccanismo:
      'Il professionista tratta il ciclo come un protocollo di avvio invece che come una struttura ricorrente. La CE non viene aggiornata dopo l\'applicazione del dispositivo.',
    conseguenza:
      'Il dispositivo perde progressivamente coerenza con il campo reale. Continua ad agire su una configurazione che non esiste più. Il campo si muove; il dispositivo rimane fermo.',
    antidoto:
      'Il ciclo non è lineare: torna su se stesso. Dopo ogni applicazione, il passo OSSERVA DI NUOVO richiede di rileggere il campo e aggiornare la CE — anche parzialmente.',
  },
];

const CICLO_CASO_GUIDA = [
  {
    id: 'osserva',
    label: 'OSSERVA',
    fase: 'F2',
    colore: 'var(--corso-f2)',
    contenuto:
      "La scena: bilancio pediatrico. Bambino 18–24 mesi, genitore presente, libro illustrato sul tavolo. Il bambino prende il libro, indica immagini, vocalizza, cerca lo sguardo dell'adulto. Il genitore risponde, nomina, aspetta. Il pediatra osserva. Il campo è attivo: c'è scambio. Ma la sequenza si interrompe prima che si consolidi — il bambino non mantiene il filo del ciclo.",
  },
  {
    id: 'leggi',
    label: 'LEGGI (CE)',
    fase: 'F2',
    colore: 'var(--corso-f2)',
    contenuto:
      'CE: N1~ N2↑ N3~ N4↓. R: N2→N3. D↗. T2. A±. Campo relazionale forte (N2↑) che sostiene accesso al mondo condiviso (N3~), con esplorazione ridotta (N4↓). Configurazione fragile ma evolutivamente aperta.',
    highlight: ['N2', 'N3', 'N4'],
  },
  {
    id: 'orienta',
    label: 'ORIENTA (funzione)',
    fase: 'F3',
    colore: 'var(--corso-f3)',
    contenuto:
      'D1: La restrizione è nella durata della sequenza condivisa — N3 non si stabilizza. D2: La risorsa è N2↑: il campo relazionale regge. Il genitore risponde. D3: T2 e R: N2→N3 e D↗ → MEDIAZIONE: sostenere la transizione già in corso. D4: Il minimo è modificare il ritmo adulto nella scena — non aggiungere materiali.',
    badges: ['D1', 'D2', 'D3', 'D4'],
    funzione: { badge: 'MED', nome: 'Mediazione', colore: 'var(--corso-fn-mediare)' },
  },
  {
    id: 'agisci',
    label: 'AGISCI (micro-dispositivo)',
    fase: 'F3',
    colore: 'var(--corso-f3)',
    contenuto:
      "Funzione: MEDIAZIONE. Il genitore segue l'interesse del bambino, nomina con ritmo lento, attende, espande senza correggere. Il pediatra osserva senza interrompere. Tempo reale: 5 minuti nel bilancio.",
    tipi: [
      { codice: 'U2', nome: 'Sintonizzazione', colore: 'var(--corso-u2)' },
      { codice: 'U4', nome: 'Mediazione Simbolica', colore: 'var(--corso-u4)' },
    ],
  },
  {
    id: 'osservaDiNuovo',
    label: 'OSSERVA DI NUOVO',
    fase: 'OSSERVA',
    colore: 'var(--corso-module-accent)',
    contenuto:
      "Indicatore di risonanza: il bambino include l'adulto nella sequenza con sguardo condiviso, gesto e vocalizzazione integrati. La sequenza si allunga — non termina al primo giro. Se presente → la CE si aggiorna: N3 si stabilizza, T tende a T3. Se assente → rientrare a D1 con la CE aggiornata.",
    indicatore: CASO_GUIDA_F3.f3.indicatoreRisonanza,
    rientro: true,
  },
];

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

// ─── Modulo ──────────────────────────────────────────────────────────────

export const Module07: Module = {
  id: 'm07',
  number: 7,
  title: 'Logica decisionale',
  shortTitle: 'Logica decisionale',
  accent: '#c0392b',
  slides: [
    // ─── 7.1 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m07-01',
      type: 'standard',
      title: "F3 orienta la decisione — non la prende",
      subtitle: 'Il ruolo del professionista nella logica decisionale',
      content: `
        <p class="corso-emph corso-emph--center" style="font-size: 1.1rem; margin: 18px auto 6px; max-width: 720px;">
          F3 produce quattro cose: una <strong>lettura del campo</strong> (CE), un <strong>nodo dominante</strong>, una <strong>funzione</strong>, un <strong>dispositivo</strong>.
        </p>
        <p class="corso-emph corso-emph--center" style="font-style: italic; font-size: 1.05rem; color: var(--corso-module-accent); margin-bottom: 22px;">
          Non produce: la decisione di applicare il dispositivo.
        </p>

        <div class="corso-m7-levels">
          <div class="corso-m7-level" style="--corso-level-color: var(--corso-f2);">
            <div class="corso-m7-level__lab">Livello della lettura (F2)</div>
            <p>La CE descrive la configurazione del campo.</p>
            <p class="corso-m7-level__sub"><em>Non prescrive: descrive.</em></p>
          </div>
          <div class="corso-m7-arrow" aria-hidden="true">↓</div>
          <div class="corso-m7-level" style="--corso-level-color: var(--corso-f3);">
            <div class="corso-m7-level__lab">Livello dell'orientamento (F3)</div>
            <p>Il nodo dominante e la funzione orientano la scelta del dispositivo.</p>
            <p class="corso-m7-level__sub"><em>Non prescrivono: orientano.</em></p>
          </div>
          <div class="corso-m7-arrow" aria-hidden="true">↓</div>
          <div class="corso-m7-level corso-m7-level--main" style="--corso-level-color: var(--corso-module-accent);">
            <div class="corso-m7-level__lab">Livello della decisione professionale</div>
            <p>Il professionista legge il campo reale in tempo reale e decide se, quando e come applicare il dispositivo.</p>
            <p class="corso-m7-level__sub"><em>Questo livello non è automatizzabile: è situato, responsabile, disciplinare.</em></p>
          </div>
        </div>

        <div class="corso-callout corso-callout--accent-f3" style="margin-top: 22px;">
          <p>Se F3 orienta ma non decide, <strong>come si decide in tempo reale?</strong> Come si pone la domanda giusta al momento giusto, con il bambino davanti, in un contesto che non aspetta?</p>
          <p style="font-style: italic;">Questo è il contenuto di M7: la logica decisionale come <strong>struttura di domande</strong> — non come algoritmo.</p>
        </div>
      `,
      guardrail: {
        code: 'C-F3-70',
        label: 'La responsabilità della decisione è professionale',
        text:
          'F3 non sostituisce il giudizio professionale situato. Produce vincoli di coerenza metodologica — non obblighi. La responsabilità della scelta finale appartiene al professionista nella sua disciplina.',
      },
    },

    // ─── 7.2 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m07-02',
      type: 'standard',
      title: 'Quattro domande, in ordine',
      subtitle: 'La struttura della logica decisionale F3',
      content: `
        <p class="corso-narrative__caption" style="text-align: center; margin-bottom: 18px;">
          La logica decisionale di F3 si struttura in quattro domande sequenziali. Ognuna dipende dalla risposta alla precedente. Saltare una domanda o invertire l'ordine produce errori decisionali — che esploriamo nella slide successiva.
        </p>

        <div class="corso-m7-domande">
          ${QUATTRO_DOMANDE.map(
            (d, i) => `
              <div class="corso-m7-domanda">
                <div class="corso-m7-domanda__head">
                  <span class="corso-m7-domanda__badge">${d.numero}</span>
                  <div>
                    <h3 class="corso-m7-domanda__q">${d.domanda}</h3>
                    <p class="corso-m7-domanda__sub"><em>${d.sottotitolo}</em></p>
                  </div>
                </div>
                <p class="corso-m7-domanda__exp">${d.spiegazione}</p>

                <div class="corso-m7-domanda__caso">
                  <span class="corso-m7-domanda__lab">Nel caso-guida</span>
                  <p>${d.nel_caso_guida}</p>
                </div>

                <div class="corso-m7-domanda__err">
                  <span class="corso-m7-domanda__lab">Errore tipico</span>
                  <p><em>${d.errore_tipico}</em></p>
                </div>
              </div>
              ${
                i < QUATTRO_DOMANDE.length - 1
                  ? `<div class="corso-m7-connector">
                      <span class="corso-m7-connector__arrow">↓</span>
                      <span class="corso-m7-connector__txt">${
                        ['Conoscendo la restrizione...', 'Conoscendo le risorse...', 'Scelta la funzione...'][i]
                      }</span>
                    </div>`
                  : ''
              }
            `,
          ).join('')}
        </div>
      `,
      guardrail: {
        code: 'C-F3-71',
        label: "L'ordine delle domande non è arbitrario",
        text:
          "D3 (qual è l'azione che aumenta l'abitabilità?) può essere posta solo dopo D1 e D2. Senza conoscere la restrizione e le risorse, la risposta a D3 è una preferenza — non una lettura del campo.",
      },
    },

    // ─── 7.3 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m07-03',
      type: 'diagram',
      title: 'Il ciclo che non finisce',
      subtitle: "Dalla CE all'azione — e di nuovo all'osservazione",
      intro: `
        <p class="corso-narrative__caption" style="text-align: center; margin-bottom: 14px;">
          Il <strong>Ciclo Decisionale Breve</strong> è la struttura operativa che integra le quattro domande in un percorso circolare. Non è lineare: il suo ultimo passo (OSSERVA DI NUOVO) riapre il primo.
        </p>
      `,
      interactive: {
        kind: 'decision-cycle',
      },
      content: `
        <div class="corso-callout corso-callout--accent-f3" style="margin-top: 18px;">
          <p>Il ciclo non è un algoritmo: è una <strong>struttura di attenzione</strong>. Ogni professionista lo percorre con velocità e profondità diverse a seconda del contesto, del tempo disponibile, della familiarità con il campo.</p>
          <ul style="margin: 8px 0 0 20px; padding: 0;">
            <li>In un bilancio pediatrico di 20 minuti, il ciclo può durare 2–3 minuti.</li>
            <li>In una consultazione di valutazione, può durare una sessione intera.</li>
          </ul>
          <p style="font-style: italic; margin-top: 8px;">Indicazione temporale di riferimento: <strong>5–10 minuti</strong> nel contesto professionale reale.</p>
        </div>
      `,
      notes:
        'Nel contesto di emergenza regolativa (campo T0), il ciclo si comprima: OSSERVA → valuta T → AGISCI con Stabilizzare. Le quattro domande D1–D4 non sempre richiedono formulazione esplicita — la struttura può essere percorsa tacitamente.',
    },

    // ─── 7.4 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m07-04',
      type: 'narrative',
      title: 'Il ciclo applicato al bilancio pediatrico',
      subtitle: 'Cinque passi, cinque minuti, un campo che risponde',
      content: `
        <div class="corso-callout">
          ${CASO_GUIDA_F3.scena
            .split('\n\n')
            .map((p) => `<p><em>${p.trim()}</em></p>`)
            .join('')}
        </div>

        <div class="corso-m7-ciclo-steps">
          ${CICLO_CASO_GUIDA.map(
            (step, i) => `
              <div class="corso-m7-ciclo-step ${step.rientro ? 'corso-m7-ciclo-step--rientro' : ''}" style="--corso-step-color: ${step.colore};">
                <div class="corso-m7-ciclo-step__marker">
                  <span class="corso-m7-ciclo-step__bullet"></span>
                  ${i < CICLO_CASO_GUIDA.length - 1 ? '<span class="corso-m7-ciclo-step__line"></span>' : ''}
                </div>
                <div class="corso-m7-ciclo-step__body">
                  <div class="corso-m7-ciclo-step__head">
                    <span class="corso-m7-ciclo-step__badge">${step.label}</span>
                    <span class="corso-m7-ciclo-step__fase corso-m7-ciclo-step__fase--${step.fase.toLowerCase()}">${step.fase === 'OSSERVA' ? 'rientro' : step.fase}</span>
                  </div>
                  <p class="corso-m7-ciclo-step__txt">${step.contenuto}</p>

                  ${
                    step.id === 'leggi'
                      ? `<div class="corso-m7-ciclo-step__ce">${ceTableHtml(step.highlight ?? [])}</div>`
                      : ''
                  }

                  ${
                    step.id === 'orienta'
                      ? `<div class="corso-m7-ciclo-step__chips">
                          ${step.badges!
                            .map((b) => `<span class="corso-m7-ciclo-step__d-badge">${b}</span>`)
                            .join('<span class="corso-m7-ciclo-step__sep">→</span>')}
                          <span class="corso-m7-ciclo-step__sep">→</span>
                          <span class="corso-m7-ciclo-step__fn-badge" style="background: ${step.funzione!.colore};">
                            ${step.funzione!.badge} ${step.funzione!.nome}
                          </span>
                        </div>`
                      : ''
                  }

                  ${
                    step.id === 'agisci'
                      ? `<div class="corso-m7-ciclo-step__chips">
                          ${step
                            .tipi!.map(
                              (t) =>
                                `<span class="corso-m7-ciclo-step__u-badge" style="--corso-tipo-color: ${t.colore};">${t.codice} ${t.nome}</span>`,
                            )
                            .join('')}
                        </div>`
                      : ''
                  }

                  ${
                    step.id === 'osservaDiNuovo'
                      ? `<div class="corso-m7-ciclo-step__indicatore">
                          <span class="corso-m7-ciclo-step__indicatore-lab">Indicatore di risonanza</span>
                          <p>${step.indicatore}</p>
                          <span class="corso-m7-ciclo-step__loop">↺ Se assente → rientrare a D1 con la CE aggiornata</span>
                        </div>`
                      : ''
                  }
                </div>
              </div>
            `,
          ).join('')}
        </div>
      `,
      notes:
        'In questo caso il ciclo porta a una risposta al passo 3 (ORIENTA). In altri casi il ciclo può ripartire più volte prima che l\'azione sia identificata — specialmente quando la CE è parziale o i segnali sono ambigui.',
    },

    // ─── 7.5 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m07-05',
      type: 'standard',
      title: 'Quando il ciclo si inceppa',
      subtitle: 'Quattro errori ricorrenti nella logica decisionale',
      content: `
        <div class="corso-m7-err-index">
          ${ERRORI_DECISIONALI.map(
            (e) => `<span class="corso-m7-err-chip">${e.numero} ${e.titoloBreve}</span>`,
          ).join('')}
        </div>

        <div class="corso-m7-err-stack">
          ${ERRORI_DECISIONALI.map(
            (e) => `
              <article class="corso-m7-err-card">
                <header class="corso-m7-err-card__head">
                  <span class="corso-m7-err-card__num">${e.numero}</span>
                  <h3 class="corso-m7-err-card__title">${e.titolo}</h3>
                </header>
                <div class="corso-m7-err-card__body">
                  <div class="corso-m7-err-card__row">
                    <span class="corso-m7-err-card__lab">Descrizione</span>
                    <p>${e.descrizione}</p>
                  </div>
                  <div class="corso-m7-err-card__row corso-m7-err-card__row--mech">
                    <span class="corso-m7-err-card__lab">Meccanismo</span>
                    <p>${e.meccanismo}</p>
                  </div>
                  <div class="corso-m7-err-card__row corso-m7-err-card__row--cons">
                    <span class="corso-m7-err-card__lab">Conseguenza</span>
                    <p>${e.conseguenza}</p>
                  </div>
                  <div class="corso-m7-err-card__row corso-m7-err-card__row--ant">
                    <span class="corso-m7-err-card__lab">↺ Antidoto</span>
                    <p>${e.antidoto}</p>
                  </div>
                </div>
              </article>
            `,
          ).join('')}
        </div>

        <p class="corso-narrative__caption" style="text-align: center; margin-top: 18px; max-width: 760px; margin-left: auto; margin-right: auto; line-height: 1.6;">
          Questi quattro errori condividono una radice comune: il ciclo viene percorso in modo lineare (una volta sola, in un'unica direzione) invece che circolare. L'antidoto non è fare il ciclo «meglio» — è fare il ciclo <strong>di nuovo</strong>, a partire dall'osservazione aggiornata.
        </p>
      `,
    },

    // ─── 7.6 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m07-06',
      type: 'comparison',
      title: 'Non un esecutore di protocolli',
      subtitle: 'Il professionista come lettore adattivo del campo',
      content: `
        <div class="corso-cmp2">
          <section class="corso-cmp2__col corso-cmp2__col--left">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab">Logica del protocollo</span>
              <h3 class="corso-cmp2__title">Il professionista come esecutore</h3>
            </header>
            <ul class="corso-cmp2__items">
              <li><div class="corso-cmp2__item-text">Applica una sequenza predefinita indipendentemente dal campo</div></li>
              <li><div class="corso-cmp2__item-text">Valuta il successo in base alla fedeltà al protocollo, non alla risposta del campo</div></li>
              <li><div class="corso-cmp2__item-text">Aumenta la dose se il campo non risponde: più sessioni, più intensità</div></li>
            </ul>
            <p class="corso-cmp2__foot-note">Non è un approccio sbagliato: è un approccio diverso, con una logica propria. Ma non è la logica di F3.</p>
          </section>

          <section class="corso-cmp2__col" style="border-top-color: var(--corso-module-accent); background: color-mix(in srgb, var(--corso-module-accent) 5%, transparent);">
            <header class="corso-cmp2__head">
              <span class="corso-cmp2__lab" style="color: var(--corso-module-accent);">Logica del ciclo adattivo</span>
              <h3 class="corso-cmp2__title">Il professionista come regolatore di campo</h3>
            </header>
            <ul class="corso-cmp2__items">
              <li><div class="corso-cmp2__item-text">Legge il campo prima di agire, durante l'azione, e dopo l'azione</div></li>
              <li><div class="corso-cmp2__item-text">Valuta il successo in base alla risposta del campo (indicatore di risonanza), non al dispositivo in sé</div></li>
              <li><div class="corso-cmp2__item-text">Se il campo non risponde, rivaluta la CE — non insiste</div></li>
            </ul>
            <p class="corso-cmp2__foot-note" style="color: var(--corso-module-accent);">Il professionista di F3 non è meno tecnico: ha una competenza tecnica più raffinata — quella di leggere il campo e modificare il dispositivo in base alla risposta.</p>
          </section>
        </div>

        <div class="corso-m7-comp">
          <div class="corso-m7-comp-card">
            <div class="corso-m7-comp-card__num">1</div>
            <div class="corso-m7-comp-card__lab">Competenza di lettura</div>
            <p>Leggere una CE in meno di tre minuti e identificare il nodo dominante e la funzione.</p>
            <p class="corso-m7-comp-card__sub"><em>Non richiede sessioni separate: si integra nell'osservazione professionale già in atto.</em></p>
          </div>
          <div class="corso-m7-comp-card">
            <div class="corso-m7-comp-card__num">2</div>
            <div class="corso-m7-comp-card__lab">Competenza di azione minima</div>
            <p>Scegliere il dispositivo più semplice che realizza la funzione.</p>
            <p class="corso-m7-comp-card__sub"><em>Resistere alla tentazione di fare di più quando meno è sufficiente.</em></p>
          </div>
          <div class="corso-m7-comp-card">
            <div class="corso-m7-comp-card__num">3</div>
            <div class="corso-m7-comp-card__lab">Competenza di aggiornamento</div>
            <p>Riconoscere quando l'indicatore di risonanza è assente e rientrare nel ciclo.</p>
            <p class="corso-m7-comp-card__sub"><em>Non interpretare l'assenza di risposta come fallimento del bambino — come segnale di riallineamento.</em></p>
          </div>
        </div>

        <p class="corso-narrative__caption" style="text-align: center; margin-top: 18px; max-width: 800px; margin-left: auto; margin-right: auto;">
          Questa descrizione del professionista di F3 non prescinde dalla formazione disciplinare: la <strong>aggiunge</strong>. Il pediatra resta pediatra; l'educatrice resta educatrice. F3 offre un vocabolario di lettura del campo che si integra in ciascuna professione senza sostituirne il corpus tecnico.
        </p>
      `,
    },

    // ─── 7.7 ─────────────────────────────────────────────────────────────
    {
      id: 'f3-m07-07',
      type: 'narrative',
      title: 'La pipeline è completa',
      subtitle: 'Dalla CE osservata al micro-dispositivo contestualizzato',
      content: `
        <div class="corso-m7-pipeline">
          <span class="corso-m7-pipeline__chip corso-m7-pipeline__chip--f2">Osservazione</span>
          <span class="corso-m7-pipeline__arr">→</span>
          <span class="corso-m7-pipeline__chip corso-m7-pipeline__chip--f2">CE</span>
          <span class="corso-m7-pipeline__arr">→</span>
          <span class="corso-m7-pipeline__chip corso-m7-pipeline__chip--f3">Nodo dominante</span>
          <span class="corso-m7-pipeline__arr">→</span>
          <span class="corso-m7-pipeline__chip corso-m7-pipeline__chip--f3">Funzione</span>
          <span class="corso-m7-pipeline__arr">→</span>
          <span class="corso-m7-pipeline__chip corso-m7-pipeline__chip--f3">Tipo U</span>
          <span class="corso-m7-pipeline__arr">→</span>
          <span class="corso-m7-pipeline__chip corso-m7-pipeline__chip--final">Micro-dispositivo</span>
          <span class="corso-m7-pipeline__arr">→</span>
          <span class="corso-m7-pipeline__chip corso-m7-pipeline__chip--final">Indicatore risonanza</span>
          <span class="corso-m7-pipeline__loop" aria-hidden="true">↺ rientro a Osservazione</span>
        </div>

        <p class="corso-narrative__caption" style="text-align: center; margin-top: 8px;">
          I moduli M0–M7 hanno costruito questa pipeline pezzo per pezzo.<br/>
          <strong>M8 la percorre per intero in un unico movimento.</strong>
        </p>

        <div class="corso-callout corso-callout--accent-f3" style="margin-top: 22px;">
          <p>Nel <strong>Modulo 8</strong> — l'ultimo — non introduciamo nuovi concetti.</p>
          <p>Prendiamo il caso-guida dall'inizio: dalla scena osservata durante il bilancio pediatrico. E lo portiamo fino in fondo: CE, nodo dominante, funzione, template, tipo universale, ciclo decisionale, indicatore di risonanza.</p>
          <p style="font-style: italic;">Tutto insieme. In sequenza. Con la stessa densità del lavoro professionale reale.</p>
        </div>

        <blockquote class="corso-blockquote" style="border-left-color: var(--corso-module-accent); margin: 26px auto; max-width: 760px;">
          «Cosa rimane dopo M8?»<br/>
          Un vocabolario per leggere il campo.<br/>
          Una struttura per decidere in situazione.<br/>
          Un principio: <strong>lo strumento non corregge il bambino — modifica il campo.</strong>
        </blockquote>

        <p class="corso-emph corso-emph--center" style="font-style: italic; margin-top: 18px; max-width: 720px; margin-left: auto; margin-right: auto;">
          Con questi strumenti, ogni nuova scena può diventare una CE. Ogni CE può diventare un dispositivo. Ogni dispositivo può tornare a essere osservazione.
        </p>

        <div class="corso-m3-next">
          <span class="corso-m3-next__arrow">→</span>
          <span class="corso-m3-next__lab">Modulo 8 — Pipeline F3 completa</span>
        </div>
      `,
    },
  ],
};
