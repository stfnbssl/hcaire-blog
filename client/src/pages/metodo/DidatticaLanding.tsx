import { Link } from 'react-router-dom';
import MetodoNav from '../../components/MetodoNav';

interface Presentazione {
  fase: 'F1' | 'F2' | 'F3';
  titolo: string;
  sottotitolo: string;
  descrizione: string;
  destinatari: string;
  to?: string;
  status: 'disponibile' | 'in-arrivo';
  headerBg: string;
  borderAccent: string;
  badgeBg: string;
  taglineColor: string;
}

const PRESENTAZIONI: Presentazione[] = [
  {
    fase: 'F1',
    titolo: 'Fondazione ontologica',
    sottotitolo: 'Cosa è lo sviluppo, prima ancora di come si misura',
    descrizione:
      "La presentazione introduce la fondazione del metodo: una ontologia esplicita del soggetto come incarnato, temporale e relazionale, e i sei assi strutturali che ne orientano la lettura. Non costruisce strumenti — pone le condizioni che li rendono possibili.",
    destinatari: 'Pediatri, educatori, psicologi, coordinatori di servizi.',
    to: '/metodo/didattica/fondazione-ontologica/m00/1',
    status: 'disponibile',
    headerBg: 'bg-indigo-950',
    borderAccent: 'border-l-indigo-400',
    badgeBg: 'bg-indigo-800',
    taglineColor: 'text-indigo-300',
  },
  {
    fase: 'F2',
    titolo: 'Traduzione interdisciplinare',
    sottotitolo: 'Rendere lo sviluppo leggibile fra discipline',
    descrizione:
      "La presentazione costruisce la pipeline metodologica della Fase 2: come tradurre i concetti fondativi in un linguaggio condivisibile fra pediatria, pedagogia, psicologia, NPI, counseling. Sette operatori, otto controlli di coerenza, una grammatica configurazionale.",
    destinatari: 'Stessi destinatari della Fase 1, con un focus sulla lettura interdisciplinare.',
    to: '/metodo/didattica/traduzione-interdisciplinare/m00/1',
    status: 'disponibile',
    headerBg: 'bg-teal-900',
    borderAccent: 'border-l-teal-400',
    badgeBg: 'bg-teal-700',
    taglineColor: 'text-teal-300',
  },
  {
    fase: 'F3',
    titolo: 'Strumenti operativi contestualizzati',
    sottotitolo: 'Dalla leggibilità all\'azione contestualizzata',
    descrizione:
      "La presentazione affronta la Fase 3: come la leggibilità prodotta dalla F2 si traduce in micro-dispositivi di campo situati. Identificazione del nodo dominante, scelta della funzione (stabilizzare / ampliare / mediare / proteggere), costruzione del template — mantenendo la decisione disciplinare fuori dal metodo.",
    destinatari: 'Professionisti che progettano strumenti e dispositivi nei propri contesti.',
    to: '/metodo/didattica/strumenti-operativi-contestualizzati/m00/1',
    status: 'disponibile',
    headerBg: 'bg-sky-900',
    borderAccent: 'border-l-sky-400',
    badgeBg: 'bg-sky-700',
    taglineColor: 'text-sky-300',
  },
];

export default function DidatticaLanding() {
  return (
    <div>
      <MetodoNav />

      {/* Hero */}
      <div className="bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">
            Metodo HCAIRE
          </p>
          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-none tracking-tight">
            <span className="text-indigo-300">Didattica</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-200 max-w-2xl leading-relaxed">
            Tre presentazioni in sequenza per attraversare l'architettura del metodo: la fondazione ontologica, la traduzione interdisciplinare, gli strumenti operativi.
          </p>
        </div>
      </div>

      {/* Apertura narrativa */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 max-w-3xl">
            Le presentazioni di questa sezione utilizzano come esempi tematiche proprie del progetto <Link to="/sviluppo-bambino" className="text-primary-700 hover:underline">Sviluppo Bambino</Link> — il primo dominio applicativo attivo — ma il metodo che esse illustrano vale per HCAIRE nel suo complesso. Le configurazioni mostrate sull'infanzia sono il caso più visibile di una struttura che si applica a ogni finestra evolutiva.
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 max-w-3xl">
            Le presentazioni seguono la stessa architettura in tre fasi del metodo. Ogni fase ha una funzione distinta e non sostituisce le altre: <strong>F1 fonda</strong> i vincoli ontologici dello sviluppo, <strong>F2 rende leggibili</strong> le configurazioni a discipline diverse, <strong>F3 produce strumenti</strong> contestualizzati. La distinzione non è gerarchica: è di livello — ognuna risponde a una domanda diversa.
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            Il filo rosso è una stessa scena clinica — una breve <em>lettura condivisa</em> bambino-adulto durante un bilancio pediatrico — riluminata da fasi diverse. La scena non cambia: cambia la domanda con cui la si guarda.
          </p>
        </div>
      </div>

      {/* Tre presentazioni */}
      {PRESENTAZIONI.map((pres, idx) => (
        <div key={pres.fase}>
          <div className={`${pres.headerBg} text-white`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
              <div className="flex items-start gap-5">
                <span className={`flex-shrink-0 ${pres.badgeBg} text-white text-xs font-bold px-3 py-1 rounded-md mt-1.5`}>
                  Fase {pres.fase.replace('F', '')}
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 leading-snug">{pres.titolo}</h2>
                  <p className={`text-base italic ${pres.taglineColor}`}>{pres.sottotitolo}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className={`border-l-4 ${pres.borderAccent} pl-8 sm:pl-12 py-12 sm:py-14`}>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mb-5">
                  {pres.descrizione}
                </p>
                <p className="text-sm text-gray-500 italic max-w-2xl mb-7">
                  Destinatari · {pres.destinatari}
                </p>
                <div className="flex items-center gap-3">
                  {pres.status === 'disponibile' && pres.to ? (
                    <Link
                      to={pres.to}
                      className="inline-flex items-center px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
                    >
                      Apri la presentazione →
                    </Link>
                  ) : (
                    <span className="inline-flex items-center px-5 py-2.5 bg-gray-200 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed">
                      In arrivo
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Footer narrativo */}
      <div className="bg-slate-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <p className="text-sm text-gray-500 max-w-3xl">
            Le presentazioni sono progettate come dispositivi di lettura, non come protocolli formativi. Ogni modulo presenta domande, configurazioni e criteri — lascia alla disciplina del lettore il momento decisionale.
          </p>
        </div>
      </div>
    </div>
  );
}
