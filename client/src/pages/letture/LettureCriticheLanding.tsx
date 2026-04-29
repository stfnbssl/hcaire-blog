import { Link } from 'react-router-dom';

export default function LettureCriticheLanding() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-stone-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <p className="text-sm font-medium text-amber-300 uppercase tracking-widest mb-6">
            Ambiente editoriale
          </p>
          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-none tracking-tight">
            Letture <span className="text-amber-300">critiche</span>
          </h1>
          <p className="text-xl sm:text-2xl text-stone-200 max-w-2xl leading-relaxed">
            Letture critiche di opere culturali — romanzi, racconti, film e altri testi — costruite a partire da una pipeline analitica multi-stadio.
          </p>
        </div>
      </div>

      {/* Header sezione */}
      <div className="bg-amber-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Cosa sono le letture critiche</h2>
          <p className="text-lg sm:text-xl italic text-amber-300">
            Non recensioni, ma percorsi di lettura strutturati
          </p>
        </div>
      </div>

      {/* Body — descrizione */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="border-l-4 border-l-amber-400 pl-8 sm:pl-12 py-12 sm:py-16">
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mb-5">
              Ogni lettura critica nasce da un <strong>percorso analitico in più stadi</strong>: dall'inquadramento dell'opera all'analisi delle sue strutture, dalle interlocuzioni con la tradizione critica fino alla restituzione editoriale.
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mb-5">
              Il risultato non è una recensione né un commento occasionale, ma uno <strong>strumento di lettura</strong> — un dispositivo che orienta lo sguardo del lettore sulle dimensioni strutturali dell'opera senza sostituirsi alla sua esperienza.
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mb-8">
              L'archivio comprende romanzi, racconti, film e altri testi della cultura. Per ciascuna opera è disponibile la lettura critica e, quando previsto, il resoconto del processo analitico e il saggio integrato.
            </p>
            <Link
              to="/letture/elenco"
              className="inline-block text-sm font-medium bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-md transition-colors"
            >
              Vedi le letture pubblicate →
            </Link>
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
