import { Link } from 'react-router-dom';

export default function AnthroposLanding() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-amber-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-medium uppercase tracking-wide text-amber-200 bg-amber-900/60 px-2 py-0.5 rounded">
              In elaborazione
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-none tracking-tight">
            <span className="text-amber-300">Anthropos</span>
          </h1>
          <p className="text-xl sm:text-2xl text-amber-100 max-w-2xl leading-relaxed">
            Configurazione evolutiva dell'umano: trasformazione nel tempo della topologia degli assi strutturali.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-12">
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Dalla struttura alle configurazioni storiche</h2>
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>
              Gli assi strutturali sono permanenti, ma le loro configurazioni variano nel corso della vita.
              <strong> Anthropos</strong> è il progetto che descrive questa variazione: la configurazione
              evolutiva del soggetto come trasformazione nel tempo della topologia degli assi strutturali.
            </p>
            <p>
              "Topologia" è qui usato in senso analogo a quello matematico: descrive le proprietà di una
              struttura che rimangono invarianti sotto trasformazioni continue. Gli assi strutturali sono
              l'invariante; le configurazioni storiche sono le trasformazioni. Ciò che cambia nelle diverse
              fasi della vita non è la presenza degli assi ma la loro densità, articolazione, possibilità
              espressive e mediazioni simboliche.
            </p>
            <p>
              Anthropos copre l'intero arco della vita umana: infanzia, adolescenza, età adulta,
              genitorialità, crisi, transizioni esistenziali, invecchiamento. Le finestre temporali di
              Anthropos non coincidono necessariamente con l'età anagrafica: esistono <em>finestre
              esistenziali</em> (lutto, malattia, transizione identitaria, innamoramento) che riconfigurano
              gli assi indipendentemente dall'età.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Finestre temporali</h2>
          <p className="text-gray-700 leading-relaxed">
            Le <strong>finestre temporali</strong> sono l'unità di analisi del piano temporale. Descrivono
            configurazioni storiche del campo: come si distribuisce la responsabilità tra soggetto e
            ambiente, quali assi sono più plastici, quali soglie trasformative sono attive, quali rischi
            interpretativi sono prevalenti. Una finestra temporale non si "supera": le sue configurazioni
            permangono, trasformate, nelle fasi successive.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Linee evolutive parallele</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            All'interno di ciascuna finestra, lo sviluppo del soggetto si dispiega attraverso <strong>linee
            evolutive parallele</strong>: traiettorie parzialmente autonome ma reciprocamente dipendenti,
            ciascuna corrispondente alla configurazione storica di uno o più assi strutturali.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="py-2 pr-4">Linea</th>
                  <th className="py-2 pr-4">Asse strutturale dominante</th>
                  <th className="py-2">Traiettoria</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">Corporea</td><td className="py-2 pr-4">Corporeità</td><td className="py-2">Dalla regolazione esterna all'autoregolazione simbolicamente mediata</td></tr>
                <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">Attentiva</td><td className="py-2 pr-4">Corporeità / Relazionalità</td><td className="py-2">Dall'orientamento verso stimoli salienti all'attenzione guidata da racconto e regola</td></tr>
                <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">Intersoggettiva</td><td className="py-2 pr-4">Relazionalità</td><td className="py-2">Dall'adulto regolatore corporeo all'interlocutore garante di senso</td></tr>
                <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">Simbolica</td><td className="py-2 pr-4">Mediazione storico-culturale</td><td className="py-2">Dal proto-simbolico incarnato alla rete semeiotica</td></tr>
                <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">Desiderante</td><td className="py-2 pr-4">Desiderio</td><td className="py-2">Dal bisogno corporeo al desiderio narrativo e progettuale</td></tr>
                <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">Normativa</td><td className="py-2 pr-4">Normatività</td><td className="py-2">Dalla regolarità ritmica all'interiorizzazione critica della norma</td></tr>
                <tr className="border-b border-gray-100"><td className="py-2 pr-4 font-medium">Linguistica</td><td className="py-2 pr-4">Mediazione storico-culturale</td><td className="py-2">Dalla vocalità relazionale al linguaggio come pensiero e autoregolazione</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Culturale-istituzionale</td><td className="py-2 pr-4">Mediazione storico-culturale / Normatività</td><td className="py-2">Dall'immersione in pratiche familiari alla partecipazione a istituzioni simboliche</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 leading-relaxed mt-6 text-sm italic">
            Le linee non procedono in modo sincronizzato. Hanno velocità, soglie e dipendenze proprie.
            Una funzione non termina quando inizia la successiva: continua a operare sotto le acquisizioni
            successive.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Milestone di convergenza</h2>
          <p className="text-gray-700 leading-relaxed">
            I fenomeni evolutivi rilevanti non appartengono a una sola linea: sono <strong>milestone di
            convergenza</strong>, punti in cui più linee si incontrano producendo una riconfigurazione del
            campo. Una milestone di convergenza non è una prestazione osservabile né un'abilità isolata:
            è una trasformazione strutturale che modifica le possibilità dell'esperienza del soggetto.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Dipendenze strutturali</h2>
          <p className="text-gray-700 leading-relaxed">
            Le milestone sono connesse da <strong>dipendenze strutturali</strong>: alcune trasformazioni
            presuppongono altre come condizioni di possibilità, non come prerequisiti cronologici assoluti.
            La rete di dipendenze descrive la logica interna dello sviluppo senza ridurla a sequenza rigida.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
          <Link to="/progetti" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
            ← Tutti i progetti
          </Link>
          <span className="text-xs text-gray-400 italic">
            Progetto in elaborazione — contenuti in evoluzione
          </span>
        </div>
      </div>
    </div>
  );
}
