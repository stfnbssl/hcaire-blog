import { Link } from 'react-router-dom';

export default function BartlebyLanding() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <p className="text-sm font-medium text-sky-300 uppercase tracking-widest mb-6">
            Strumento del laboratorio
          </p>
          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-none tracking-tight">
            Bart<span className="text-sky-300">leby</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-200 max-w-2xl leading-relaxed">
            Un assistente che traduce situazioni concrete in dispositivi di lavoro, attraverso una base di conoscenza strutturata sullo sviluppo del bambino.
          </p>
        </div>
      </div>

      {/* Header sezione */}
      <div className="bg-sky-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Cosa fa Bartleby</h2>
          <p className="text-lg sm:text-xl italic text-sky-300">
            Dalla traccia al dispositivo, con piena trasparenza della catena decisionale
          </p>
        </div>
      </div>

      {/* Body — descrizione */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="border-l-4 border-l-sky-400 pl-8 sm:pl-12 py-12 sm:py-16">
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mb-5">
              Bartleby riceve una <strong>traccia</strong> — un comportamento osservato, una domanda, un contesto educativo o clinico — e la elabora attivando i nodi concettuali e le skill fondative pertinenti all'ambito.
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mb-5">
              Il risultato è un <strong>output differenziato</strong>: una guida operativa, una nota clinica, un policy brief — sempre accompagnato dalla tracciabilità delle decisioni che lo hanno generato.
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mb-8">
              Lo strumento è riservato agli abbonati. Gli amministratori hanno accesso anche alla console di sottomissione tracce e all'archivio degli output generati.
            </p>
            <Link
              to="/bartleby/console"
              className="inline-block text-sm font-medium bg-sky-700 hover:bg-sky-800 text-white px-6 py-3 rounded-md transition-colors"
            >
              Vai alla console →
            </Link>
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
