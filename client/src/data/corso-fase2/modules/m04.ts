import {
  Module,
  MatrixAxis,
  MatrixCell,
  ProgressiveRevealItem,
} from '../types';

const QUATTRO_CONTESTI: MatrixAxis[] = [
  {
    id: 'C',
    label: 'Clinico',
    sublabel: 'pediatra · NPI · psicologo',
    color: '#2980b9',
    icon: '🩺',
  },
  {
    id: 'P',
    label: 'Pedagogico',
    sublabel: 'educatore · pedagogista',
    color: '#27ae60',
    icon: '📚',
  },
  {
    id: 'G',
    label: 'Genitoriale',
    sublabel: 'genitori · caregiver',
    color: '#e67e22',
    icon: '👨‍👩‍👧',
  },
  {
    id: 'I',
    label: 'Istituzionale',
    sublabel: 'coordinatori · servizi',
    color: '#8e44ad',
    icon: '🏛',
  },
];

const NODI_RIGHE: MatrixAxis[] = [
  { id: 'n1', label: 'N1', sublabel: 'Regolazione', color: '#e67e22' },
  { id: 'n2', label: 'N2', sublabel: 'Co-regolazione', color: '#27ae60' },
  { id: 'n3', label: 'N3', sublabel: 'Mondo condiviso', color: '#2980b9' },
  { id: 'n4', label: 'N4', sublabel: 'Apertura', color: '#8e44ad' },
  { id: 'n5', label: 'N5', sublabel: 'Limite reale', color: '#e74c3c' },
  { id: 'n6', label: 'N6', sublabel: 'Continuità', color: '#16a085' },
  { id: 'n7', label: 'N7', sublabel: 'Desiderio', color: '#f39c12' },
];

const MATRICE: Record<string, Record<string, MatrixCell>> = {
  n1: {
    C: {
      domanda: "Il bambino recupera dopo sovraccarico? L'esperienza si mantiene o collassa?",
      lettura: 'Il bambino si disorganizza durante la visita ma il campo relazionale permette una ripresa. La regolazione non è autonoma, ma è sostenuta dalla presenza adulta.',
      errore: '«È poco collaborativo.»',
      output: 'Traccia osservativa per bilancio; formazione per pediatri sul clima ambulatoriale.',
    },
    P: {
      domanda: "Il contesto sostiene o sovraccarica l'esperienza del bambino?",
      lettura: "Le routine di gruppo amplificano o attenuano la disorganizzazione? C'è spazio per il recupero?",
      errore: '«È iperattivo / non sta fermo.»',
      output: "Scheda riflessiva sull'ambiente; formazione su regolazione e setting educativo.",
    },
    G: {
      domanda: 'Come aiuto mio figlio a ritrovare calma senza sostituirmi completamente?',
      lettura: 'Non si tratta solo di «calmarlo»: si tratta di sostenere una ripresa dall\'interno, senza togliergli la possibilità di regolarsi.',
      errore: '«Piange sempre per niente.»',
      output: 'Linguaggio restitutivo; domande-guida per il genitore.',
    },
    I: {
      domanda: 'Le routine del servizio riducono o aumentano la frammentazione esperienziale?',
      lettura: 'I passaggi tra attività, gli spazi, i tempi: quanto sovraccaricano o sostengono la continuità esperienziale dei bambini?',
      errore: '«Servirebbe più disciplina / struttura.»',
      output: "Criteri di progettazione delle routine; formazione d'équipe.",
    },
  },
  n2: {
    C: {
      domanda: 'Lo scambio adulto-bambino regola o amplifica la difficoltà?',
      lettura: 'Il genitore in ambulatorio sostiene la sequenza oppure si sostituisce o si ritira? Il campo relazionale rende la visita più o meno abitabile?',
      errore: '«I genitori sono ansiosi.»',
      output: 'Traccia osservativa sulla co-regolazione; formazione sulla restituzione ai genitori.',
    },
    P: {
      domanda: "L'adulto sostiene l'azione del bambino senza sostituirsi?",
      lettura: "L'educatrice riconosce la difficoltà, non si sostituisce, permette al bambino di restare soggetto. Il campo relazionale continua.",
      errore: '«L\'educatrice è brava / sbagliata.»',
      output: 'Formazione sulla differenza tra sostegno e sostituzione; scheda neutra di co-regolazione.',
    },
    G: {
      domanda: 'Mi sento in sintonia con mio figlio o spesso in lotta?',
      lettura: 'Non è una questione di bravo/cattivo genitore: è la qualità del campo relazionale che sostiene o no l\'esperienza del bambino.',
      errore: '«Non mi obbedisce mai.»',
      output: 'Restituzione narrativa; traccia per il colloquio con i genitori.',
    },
    I: {
      domanda: 'Il servizio protegge la relazione adulto-bambino o la burocratizza?',
      lettura: "Le procedure, i passaggi di consegna, i tempi dell'équipe: favoriscono o interrompono le relazioni di co-regolazione tra adulti e bambini?",
      errore: '«Basta seguire il protocollo.»',
      output: 'Criteri organizzativi per équipe; formazione sulla relazione nei servizi.',
    },
  },
  n3: {
    C: {
      domanda: 'Il gesto, lo sguardo o la vocalizzazione aprono condivisione con l\'adulto?',
      lettura: "Il bambino non si limita a manipolare il libro: indica, cerca lo sguardo dell'adulto, sembra attendere risposta. Accesso al mondo condiviso presente, mediato da gesto, sguardo e parola.",
      errore: '«Buona attenzione condivisa» come etichetta competenziale.',
      output: 'Traccia osservativa per bilancio di salute; micro-formazione per pediatri.',
    },
    P: {
      domanda: "L'attività genera partecipazione condivisa o resta esecuzione guidata dall'adulto?",
      lettura: 'Il bambino partecipa quando può scegliere, indicare, ricevere risposta. Non trasmissione: costruzione di campo comune.',
      errore: '«Il bambino segue bene l\'attività.»',
      output: 'Traccia per osservare letture in piccolo gruppo; formazione educatori.',
    },
    G: {
      domanda: 'In quali momenti mio figlio cerca di condividere qualcosa con me?',
      lettura: "Quando il bambino indica e guarda il genitore, non sta solo «riconoscendo»: sta invitando l'adulto a entrare nello stesso piccolo mondo.",
      errore: '«Devo insegnargli più parole.»',
      output: 'Scheda restitutiva breve; domande-guida per il genitore; materiali Dialogic Book Sharing.',
    },
    I: {
      domanda: 'Le routine del servizio creano occasioni di partecipazione simbolica o riducono l\'interazione a prestazione?',
      lettura: "Ambulatorio, nido, servizio territoriale: predisporre oggetti, tempi e setting rende più probabile l'emergere di piccoli campi condivisi adulto-bambino.",
      errore: '«Bisogna introdurre un protocollo obbligatorio di lettura.»',
      output: 'Criteri per setting più leggibili; tracce organizzative per libro, gioco, relazione nei servizi.',
    },
  },
  n4: {
    C: {
      domanda: 'Curiosità presente, evitamento o ritiro?',
      lettura: "Il bambino esplora l'ambulatorio o si chiude? Usa il genitore come base sicura o è incollato/distaccato?",
      errore: '«È timido / è iperattivo.»',
      output: 'Osservazione dello stile esplorativo; note per il bilancio.',
    },
    P: {
      domanda: "L'ambiente è esplorabile o produce ansia?",
      lettura: 'Lo spazio, i materiali, le routine permettono cicli di avvicinamento e ritorno? O il contesto satura/inibisce l\'esplorazione?',
      errore: '«Non sta mai fermo / non esplora.»',
      output: "Scheda riflessiva sull'ambiente educativo; criteri di progettazione degli spazi.",
    },
    G: {
      domanda: 'Proteggo troppo o lascio spazio sufficiente per esplorare?',
      lettura: "L'esplorazione non è pericolosità: è la modalità con cui il bambino abita il mondo. Il riferimento relazionale non la blocca — la rende possibile.",
      errore: '«Non vuole allontanarsi da me» (letto come problema anziché configurazione).',
      output: "Linguaggio restitutivo sull'esplorazione; domande per il genitore.",
    },
    I: {
      domanda: 'Gli spazi del servizio consentono sperimentazione sicura?',
      lettura: 'I setting sono progettati per l\'esplorazione o per il controllo? Quanto permettono cicli di iniziativa e ritorno relazionale?',
      errore: '«I bambini devono stare nei loro spazi.»',
      output: "Criteri architettonici e organizzativi; formazione d'équipe sull'esplorazione.",
    },
  },
  n5: {
    C: {
      domanda: 'Il limite rompe o riorganizza il campo relazionale?',
      lettura: 'La frustrazione della visita (attesa, spogliazione, esame) è tollerabile? Il bambino può protestare e riprendere? Il campo non si distrugge al primo ostacolo.',
      errore: '«Non tollera la frustrazione / fa i capricci.»',
      output: 'Scheda osservativa sulle sequenze di rottura-ripresa; formazione sul limite in ambulatorio.',
    },
    P: {
      domanda: "La regola organizza l'esperienza o la schiaccia?",
      lettura: "La norma introdotta dall'adulto aiuta a strutturare il campo? O produce solo obbedienza-disobbedienza senza apprendimento?",
      errore: '«Non rispetta le regole.»',
      output: 'Formazione su limite organizzante vs. distruttivo; scheda riflessiva.',
    },
    G: {
      domanda: 'Posso dire no a mio figlio senza che il rapporto si rompa?',
      lettura: 'Il «no» non riguarda l\'obbedienza: riguarda se il campo relazionale può reggere la resistenza del reale e riorganizzarsi. La protesta breve che si risolve non è un problema.',
      errore: '«Devo essere più duro / devo cedere di più.»',
      output: 'Linguaggio restitutivo sul limite; domande-guida per il colloquio con genitori.',
    },
    I: {
      domanda: 'Le procedure del servizio sono limiti abitabili o pura interdizione?',
      lettura: 'Regole, vincoli organizzativi, protocolli: possono essere limiti che strutturano il campo, non solo obblighi che lo frammentano.',
      errore: '«Il protocollo non si discute.»',
      output: 'Criteri per procedure flessibili; formazione sul limite istituzionale.',
    },
  },
  n6: {
    C: {
      domanda: 'Dopo la frattura, il bambino riprende?',
      lettura: 'Regressioni, crisi, momenti di interruzione: sono recuperabili? Il bambino torna a una continuità esperienziale sufficiente dopo l\'evento stressante?',
      errore: '«Non tollera le interruzioni / è instabile.»',
      output: 'Traccia sulle sequenze interruzione-ripresa; formazione sulla continuità in ambito clinico.',
    },
    P: {
      domanda: "L'apprendimento è cumulativo o si azzera ogni volta?",
      lettura: "Il bambino porta con sé qualcosa da una esperienza all'altra? O ogni sessione di gioco/apprendimento ricomincia da zero?",
      errore: '«Non ricorda / non apprende.»',
      output: 'Scheda riflessiva sulla continuità educativa; formazione su memoria esperienziale.',
    },
    G: {
      domanda: 'Dopo una crisi, riusciamo a ritrovare il filo del rapporto?',
      lettura: 'Non si tratta di «superare» le difficoltà: si tratta di riprendere una direzione comune. La continuità non è assenza di conflitto, ma possibilità di riprendere.',
      errore: '«Non dimentica mai / porta rancore.»',
      output: 'Linguaggio restitutivo sulla ripresa dopo frattura; domande-guida per genitori.',
    },
    I: {
      domanda: 'I percorsi del servizio sono longitudinali o episodici?',
      lettura: 'Il servizio mantiene una continuità nel tempo con il bambino e la famiglia? O ogni accesso è una prestazione senza memoria del precedente?',
      errore: '«Ogni visita/accesso è indipendente.»',
      output: "Criteri per la continuità dei percorsi; formazione sull'integrazione longitudinale.",
    },
  },
  n7: {
    C: {
      domanda: "L'azione del bambino mostra una direzione propria?",
      lettura: "Durante la visita, il bambino manifesta iniziative spontanee, interessi, orientamenti? Oppure si adatta solo alle proposte dell'adulto?",
      errore: '«Ha buona motivazione.»',
      output: "Traccia sull'iniziativa; note per il bilancio.",
    },
    P: {
      domanda: 'Il contesto sostiene le direzioni emergenti del bambino?',
      lettura: "L'educazione non solo trasmette: riconosce e amplifica le direzioni che il bambino sta già costruendo. C'è spazio per l'iniziativa?",
      errore: '«Bisogna aumentare la motivazione.»',
      output: 'Formazione su desiderio, interesse e progettazione educativa.',
    },
    G: {
      domanda: 'Dove vedo mio figlio andare verso qualcosa con intensità?',
      lettura: "Non è solo una preferenza: è la direzione che l'esperienza prende quando qualcosa acquista valore. Il genitore può imparare a riconoscerla e amplificarla senza impadronirsene.",
      errore: '«Gli piace quel gioco» (troppo povero).',
      output: "Guida per genitori sull'iniziativa; scheda restitutiva.",
    },
    I: {
      domanda: "Il servizio alimenta l'agency del bambino o produce conformità?",
      lettura: "Un servizio orientato allo sviluppo non propone solo attività: predispone condizioni in cui l'iniziativa del bambino possa essere riconosciuta, sostenuta e tradotta in esperienza condivisa.",
      errore: '«Serve un catalogo di attività motivanti.»',
      output: 'Criteri di progettazione degli ambienti; revisione delle routine; formazione su agency.',
    },
  },
};

const ESERCIZIO_N5G: ProgressiveRevealItem[] = [
  {
    id: 'domanda',
    badge: '1',
    title: 'Domanda professionale valida',
    bodyHtml: `
      <div class="corso-box corso-box--valid">
        <p style="margin: 0 0 8px;"><strong>«Posso dire no a mio figlio senza che il rapporto si rompa?»</strong></p>
        <p style="margin: 0; font-size: 0.9rem; color: var(--corso-text-2);"><em>Perché è valida</em>: è osservabile, è nel linguaggio del genitore, non implica un giudizio («sono un buon/cattivo genitore»), e apre una riflessione sulla configurazione relazionale — non dà una risposta.</p>
      </div>
    `,
  },
  {
    id: 'lettura',
    badge: '2',
    title: 'Lettura metodologicamente valida',
    bodyHtml: `
      <div class="corso-scena">
        <p><em>Il «no» non riguarda l'obbedienza: riguarda se il campo relazionale può reggere la resistenza del reale e riorganizzarsi. La protesta breve che si risolve non è un problema — è il segno che il limite è abitabile.</em></p>
      </div>
      <div class="corso-box corso-box--invalid" style="margin-top: 12px;">
        <div class="corso-box__title">⚠ Errori da evitare</div>
        <ul>
          <li>«Devo essere più duro» — moralizza sul genitore</li>
          <li>«Devo cedere di più» — moralizza in senso opposto</li>
        </ul>
        <p style="margin: 8px 0 0; font-size: 0.88rem;">Entrambi spostano l'attenzione dal campo al giudizio.</p>
      </div>
      <p class="corso-narrative__caption" style="margin-top: 12px;"><strong>Output possibile</strong>: linguaggio restitutivo sul limite; domande-guida per il colloquio con genitori.</p>
    `,
  },
];

export const Module04: Module = {
  id: 'm04',
  number: 4,
  title: 'La Matrice Nodo × Contesto',
  shortTitle: 'Matrice',
  accent: '#2980b9',
  slides: [
    // ─── 4.1 ──────────────────────────────────────────────────────────
    {
      id: 'm04-s01',
      type: 'standard',
      title: 'La stessa struttura, quattro sguardi',
      subtitle: 'Nodo invariante · Contesto come prospettiva',
      content: `
        <blockquote class="corso-blockquote">«I Nodi Trasversali sono invarianti strutturali: non cambiano passando tra contesti professionali. Cambia solo il tipo di domanda, il livello di osservazione, il tipo di output.»</blockquote>

        <div class="corso-section">
          <p>La Matrice Nodo × Contesto formalizza questa relazione. Si legge così:</p>
          <ul>
            <li><strong>Riga</strong> · un Nodo (invariante: sempre lo stesso, in qualsiasi contesto)</li>
            <li><strong>Colonna</strong> · un contesto (prospettiva di interrogazione: cambia chi guarda, come, perché)</li>
            <li><strong>Cella</strong> · la domanda professionale che nasce dall'incrocio</li>
          </ul>
        </div>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3" style="text-align: center;">Esempio: N3 nei quattro contesti</h3>
        <div class="corso-cards corso-cards--grid">
          <div class="corso-card corso-card--open" style="--corso-card-accent: #2980b9;">
            <div class="corso-card__head"><span class="corso-card__badge">🩺 C</span><span class="corso-card__title">Clinico</span></div>
            <div class="corso-card__body"><p><em>Il gesto apre condivisione?</em></p></div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #27ae60;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #27ae60;">📚 P</span><span class="corso-card__title">Pedagogico</span></div>
            <div class="corso-card__body"><p><em>L'attività genera partecipazione?</em></p></div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #e67e22;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #e67e22;">👨‍👩‍👧 G</span><span class="corso-card__title">Genitoriale</span></div>
            <div class="corso-card__body"><p><em>Mio figlio cerca di condividere qualcosa?</em></p></div>
          </div>
          <div class="corso-card corso-card--open" style="--corso-card-accent: #8e44ad;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #8e44ad;">🏛 I</span><span class="corso-card__title">Istituzionale</span></div>
            <div class="corso-card__body"><p><em>Il servizio crea partecipazione o prestazione?</em></p></div>
          </div>
        </div>

        <p class="corso-emph corso-emph--center">Il contesto cambia la domanda, non il Nodo.</p>
        <p class="corso-narrative__caption" style="text-align: center;">Clinico, pedagogico, genitoriale e istituzionale non vedono cose diverse: vedono lo stesso processo da responsabilità diverse.</p>
      `,
    },

    // ─── 4.2 ──────────────────────────────────────────────────────────
    {
      id: 'm04-s02',
      type: 'standard',
      title: 'I quattro contesti stabili',
      subtitle: 'Chi interroga · da dove · con quali responsabilità',
      content: `
        <div class="corso-cards corso-cards--vertical">
          <div class="corso-card corso-card--open" style="--corso-card-accent: #2980b9;">
            <div class="corso-card__head">
              <span class="corso-card__badge">🩺 C</span>
              <span class="corso-card__title">Clinico</span>
            </div>
            <div class="corso-card__body">
              <p><strong>Attori</strong> · Pediatra, NPI, psicologo, medico</p>
              <p><strong>Prospettiva</strong> · Osservazione clinica situata: come si presenta il bambino in questo setting? Quali configurazioni sono leggibili durante la visita o il colloquio?</p>
              <div class="corso-two-col">
                <div class="corso-box corso-box--invalid"><div class="corso-box__title">✗ Errore tipico</div><p>Trasformare ogni configurazione in sospetto diagnostico.</p></div>
                <div class="corso-box corso-box--valid"><div class="corso-box__title">✓ Correzione F2</div><p>Descrivere prima la forma della configurazione, poi distinguere se servono approfondimenti.</p></div>
              </div>
            </div>
          </div>

          <div class="corso-card corso-card--open" style="--corso-card-accent: #27ae60;">
            <div class="corso-card__head">
              <span class="corso-card__badge" style="background: #27ae60;">📚 P</span>
              <span class="corso-card__title">Pedagogico-educativo</span>
            </div>
            <div class="corso-card__body">
              <p><strong>Attori</strong> · Educatore al nido, insegnante, pedagogista</p>
              <p><strong>Prospettiva</strong> · Il contesto di apprendimento e cura: come l'ambiente, le routine e la relazione educativa sostengono o ostacolano lo sviluppo?</p>
              <div class="corso-two-col">
                <div class="corso-box corso-box--invalid"><div class="corso-box__title">✗ Errore tipico</div><p>Trasformare ogni lettura in tecnica educativa.</p></div>
                <div class="corso-box corso-box--valid"><div class="corso-box__title">✓ Correzione F2</div><p>Mantenere uno spazio riflessivo tra osservazione, interpretazione e progettazione.</p></div>
              </div>
            </div>
          </div>

          <div class="corso-card corso-card--open" style="--corso-card-accent: #e67e22;">
            <div class="corso-card__head">
              <span class="corso-card__badge" style="background: #e67e22;">👨‍👩‍👧 G</span>
              <span class="corso-card__title">Genitoriale</span>
            </div>
            <div class="corso-card__body">
              <p><strong>Attori</strong> · Genitori, famiglia, caregiver primari</p>
              <p><strong>Prospettiva</strong> · La relazione quotidiana: cosa vede il genitore? Come può riconoscere le configurazioni senza sentirsi valutato?</p>
              <div class="corso-two-col">
                <div class="corso-box corso-box--invalid"><div class="corso-box__title">✗ Errore tipico</div><p>Trasformare la lettura in colpa o prestazione genitoriale.</p></div>
                <div class="corso-box corso-box--valid"><div class="corso-box__title">✓ Correzione F2</div><p>Usare un linguaggio che aumenti la capacità di vedere, non il senso di inadeguatezza.</p></div>
              </div>
            </div>
          </div>

          <div class="corso-card corso-card--open" style="--corso-card-accent: #8e44ad;">
            <div class="corso-card__head">
              <span class="corso-card__badge" style="background: #8e44ad;">🏛 I</span>
              <span class="corso-card__title">Istituzionale / Servizi</span>
            </div>
            <div class="corso-card__body">
              <p><strong>Attori</strong> · Coordinatori, responsabili di servizio, équipe multiprofessionali, rete dei servizi</p>
              <p><strong>Prospettiva</strong> · L'organizzazione dei servizi: le strutture, le routine e le procedure facilitano o ostacolano le condizioni per lo sviluppo?</p>
              <div class="corso-two-col">
                <div class="corso-box corso-box--invalid"><div class="corso-box__title">✗ Errore tipico</div><p>Trasformare la metodologia in procedura standardizzata.</p></div>
                <div class="corso-box corso-box--valid"><div class="corso-box__title">✓ Correzione F2</div><p>Usare i Nodi come criteri di leggibilità, non come adempimenti.</p></div>
              </div>
            </div>
          </div>
        </div>
      `,
      notes:
        'Il contesto Genitoriale è speciale: il linguaggio deve essere accessibile e non valutante. Non si chiedono al genitore osservazioni professionali — si offre un frame per riconoscere ciò che già vede.',
    },

    // ─── 4.3 ──────────────────────────────────────────────────────────
    {
      id: 'm04-s03',
      type: 'interactive',
      title: 'La Matrice Nodo × Contesto',
      subtitle: '7 Nodi · 4 contesti · 28 domande professionali',
      intro: `
        <p>Clicca su una <strong>cella</strong> per leggere la domanda completa, la lettura valida, l'errore tipico e l'output possibile. Usa i <strong>filtri</strong> per isolare un contesto, oppure clicca sulla testata di un Nodo per concentrarti su una riga.</p>
      `,
      interactive: {
        kind: 'interactive-matrix',
        rows: NODI_RIGHE,
        cols: QUATTRO_CONTESTI,
        cells: MATRICE,
      },
    },

    // ─── 4.4 ──────────────────────────────────────────────────────────
    {
      id: 'm04-s04',
      type: 'standard',
      title: 'Lo stesso Nodo, quattro sguardi',
      subtitle: 'N3 — Accesso al mondo condiviso · attraverso i quattro contesti',
      content: `
        <div class="corso-scena">
          <p><em>Un bambino di circa 20 mesi guarda un libro illustrato con un adulto. Indica una figura, vocalizza, guarda l'adulto, attende una risposta. L'adulto nomina l'immagine e il bambino torna a indicarla.</em></p>
          <p><strong>Nodo attivo</strong> · <span class="corso-guardrail__code" style="background: #2980b9; color: white;">N3</span> Accesso al mondo condiviso simbolico</p>
        </div>

        <div class="corso-cards corso-cards--grid">
          <div class="corso-card corso-card--open" style="--corso-card-accent: #2980b9;">
            <div class="corso-card__head"><span class="corso-card__badge">🩺 C</span><span class="corso-card__title">Clinico</span></div>
            <div class="corso-card__body">
              <p><strong>Chi osserva</strong> · il pediatra durante il bilancio di salute</p>
              <p><strong>Domanda</strong> · <em>«Il gesto, lo sguardo o la vocalizzazione aprono condivisione con l'adulto?»</em></p>
              <p><strong>Lettura</strong> · Il bambino indica, cerca lo sguardo, attende risposta. Accesso al mondo condiviso presente, mediato da gesto e parola.</p>
              <p style="font-size: 0.85rem; color: var(--corso-invalid);"><strong>Errore</strong> · «Buona attenzione condivisa» (etichetta competenziale)</p>
              <p style="font-size: 0.85rem; color: var(--corso-text-muted);"><strong>Output</strong> · traccia osservativa per bilancio</p>
            </div>
          </div>

          <div class="corso-card corso-card--open" style="--corso-card-accent: #27ae60;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #27ae60;">📚 P</span><span class="corso-card__title">Pedagogico</span></div>
            <div class="corso-card__body">
              <p><strong>Chi osserva</strong> · l'educatrice durante la lettura al nido</p>
              <p><strong>Domanda</strong> · <em>«Il libro diventa occasione di partecipazione o resta esecuzione guidata dall'adulto?»</em></p>
              <p><strong>Lettura</strong> · Il bambino partecipa quando può scegliere, indicare, ricevere risposta. Costruzione di campo comune.</p>
              <p style="font-size: 0.85rem; color: var(--corso-invalid);"><strong>Errore</strong> · «Il bambino segue bene l'attività» (adesione, non partecipazione)</p>
              <p style="font-size: 0.85rem; color: var(--corso-text-muted);"><strong>Output</strong> · traccia per lettura in piccolo gruppo</p>
            </div>
          </div>

          <div class="corso-card corso-card--open" style="--corso-card-accent: #e67e22;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #e67e22;">👨‍👩‍👧 G</span><span class="corso-card__title">Genitoriale</span></div>
            <div class="corso-card__body">
              <p><strong>Chi osserva</strong> · il genitore a casa, durante la lettura o il gioco</p>
              <p><strong>Domanda</strong> · <em>«In quali momenti mio figlio cerca di condividere qualcosa con me?»</em></p>
              <p><strong>Lettura</strong> · Quando indica e guarda il genitore, non riconosce solo l'immagine: invita l'adulto nello stesso piccolo mondo.</p>
              <p style="font-size: 0.85rem; color: var(--corso-invalid);"><strong>Errore</strong> · «Devo insegnargli più parole» (sposta sulla prestazione)</p>
              <p style="font-size: 0.85rem; color: var(--corso-text-muted);"><strong>Output</strong> · scheda restitutiva; Dialogic Book Sharing</p>
            </div>
          </div>

          <div class="corso-card corso-card--open" style="--corso-card-accent: #8e44ad;">
            <div class="corso-card__head"><span class="corso-card__badge" style="background: #8e44ad;">🏛 I</span><span class="corso-card__title">Istituzionale</span></div>
            <div class="corso-card__body">
              <p><strong>Chi osserva</strong> · il coordinatore / responsabile del servizio</p>
              <p><strong>Domanda</strong> · <em>«Le routine del servizio creano occasioni di partecipazione simbolica o riducono l'interazione a prestazione?»</em></p>
              <p><strong>Lettura</strong> · Predisporre oggetti, tempi, setting rende più probabile l'emergere di campi condivisi.</p>
              <p style="font-size: 0.85rem; color: var(--corso-invalid);"><strong>Errore</strong> · «Bisogna introdurre un protocollo di lettura obbligatorio» (già F3)</p>
              <p style="font-size: 0.85rem; color: var(--corso-text-muted);"><strong>Output</strong> · criteri per setting; tracce organizzative</p>
            </div>
          </div>
        </div>
      `,
    },

    // ─── 4.5 ──────────────────────────────────────────────────────────
    {
      id: 'm04-s05',
      type: 'comparison',
      title: 'La regola della matrice',
      subtitle: 'Invariante vs. variabile',
      intro: `
        <blockquote class="corso-quote" style="text-align: center;"><p>«Il contesto cambia la domanda, non il Nodo.»</p></blockquote>
        <p class="corso-narrative__caption" style="text-align: center;">Clinico, pedagogico, genitoriale e istituzionale non vedono cose diverse: vedono lo stesso processo da responsabilità diverse.</p>
      `,
      content: `
        <table class="corso-table">
          <thead>
            <tr><th></th><th>Non cambia mai</th><th>Cambia sempre</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Il Nodo</strong></td><td>Struttura, definizione, assi coinvolti, proprietà</td><td>—</td></tr>
            <tr><td><strong>La grammatica</strong></td><td>Tipo di domanda (osservativa, non diagnostica, non prescrittiva)</td><td>—</td></tr>
            <tr><td><strong>Il principio</strong></td><td>F2 produce leggibilità, non azione</td><td>—</td></tr>
            <tr><td><strong>La domanda</strong></td><td>—</td><td>Il linguaggio (clinico / educativo / accessibile / organizzativo)</td></tr>
            <tr><td><strong>Il livello</strong></td><td>—</td><td>Chi osserva e in quale situazione</td></tr>
            <tr><td><strong>L'output</strong></td><td>—</td><td>Tipo di artefatto (scheda / traccia / restituzione / criteri)</td></tr>
            <tr><td><strong>La responsabilità</strong></td><td>—</td><td>Ciascuna disciplina decide con la propria responsabilità</td></tr>
          </tbody>
        </table>

        <hr class="corso-divider" />

        <h3 class="corso-narrative__h3">I quattro errori tipici (uno per contesto)</h3>
        <div class="corso-chips">
          <div class="corso-chip" style="border-color: #2980b9;"><span class="corso-chip__icon">🩺</span><span class="corso-chip__label">Clinico</span><span class="corso-chip__sub">→ ogni configurazione diventa sospetto diagnostico</span></div>
          <div class="corso-chip" style="border-color: #27ae60;"><span class="corso-chip__icon">📚</span><span class="corso-chip__label">Pedagogico</span><span class="corso-chip__sub">→ ogni lettura diventa tecnica educativa</span></div>
          <div class="corso-chip" style="border-color: #e67e22;"><span class="corso-chip__icon">👨‍👩‍👧</span><span class="corso-chip__label">Genitoriale</span><span class="corso-chip__sub">→ ogni osservazione diventa giudizio</span></div>
          <div class="corso-chip" style="border-color: #8e44ad;"><span class="corso-chip__icon">🏛</span><span class="corso-chip__label">Istituzionale</span><span class="corso-chip__sub">→ ogni Nodo diventa procedura</span></div>
        </div>

        <p class="corso-narrative__caption">Questi errori non derivano dalla malafede professionale: derivano dall'assenza di un livello intermedio. La Matrice è quel livello.</p>
      `,
    },

    // ─── 4.6 ──────────────────────────────────────────────────────────
    {
      id: 'm04-s06',
      type: 'interactive',
      title: 'Prova tu',
      subtitle: 'N5 — Separazione / Limite reale · Contesto Genitoriale',
      intro: `
        <div class="corso-scena">
          <p><em>A casa, il bambino vuole prendere un oggetto fragile. Il genitore dice «no» e sposta l'oggetto. Il bambino protesta, piange brevemente, poi guarda il genitore. L'adulto resta presente e propone un altro oggetto manipolabile.</em></p>
          <p>
            <span class="corso-guardrail__code" style="background: #e74c3c; color: white;">N5</span> Separazione / Limite reale
            &nbsp;·&nbsp;
            <span class="corso-guardrail__code" style="background: #e67e22; color: white;">G</span> Contesto Genitoriale
          </p>
        </div>

        <div class="corso-section">
          <p>N5 riguarda l'incontro tra l'intenzionalità del bambino e la resistenza del reale. La domanda strutturale è: <em>il limite organizza o collassa il campo?</em></p>
          <p class="corso-narrative__caption">Ora prova a tradurla nel linguaggio del contesto Genitoriale. Come la direbbe un genitore a se stesso? Quando hai una formulazione, clicca per vedere la risposta.</p>
        </div>
      `,
      interactive: {
        kind: 'progressive-reveal',
        items: ESERCIZIO_N5G,
        ctaShow: 'Mostra il prossimo passo',
        conclusionHtml: `
          <p class="corso-narrative__caption" style="text-align: center;">Hai visto come lo stesso Nodo (N5) genera una domanda completamente diversa se cambia il contesto.</p>
          <p class="corso-emph corso-emph--center">→ Modulo 5 — La Dinamica tra Nodi</p>
        `,
      },
      notes:
        'Nel Modulo 5 vedremo come i Nodi non sono solo interrogabili singolarmente: si relazionano tra loro, si sostengono, si vincolano — e insieme formano configurazioni.',
    },
  ],
};
