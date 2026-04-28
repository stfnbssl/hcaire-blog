import { Link } from 'react-router-dom';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';
import SviluppoBambinoProduzioniNav from '../../components/SviluppoBambinoProduzioniNav';

export default function SviluppoBambinoProduzioniLanding() {
  return (
    <div>
      <SviluppoBambinoNav />
      <SviluppoBambinoProduzioniNav />

      {/* Hero */}
      <div className="bg-amber-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-none tracking-tight">
            Le <span className="text-amber-300">produzioni</span>
          </h1>
          <p className="text-xl sm:text-2xl text-amber-100 max-w-2xl leading-relaxed mb-4">
            Elaborazioni costruite applicando il metodo. Non sintesi disciplinari: traduzioni operative del modello degli assi in forme fruibili.
          </p>
          <p className="text-base text-amber-300/70 max-w-xl leading-relaxed mb-10">
            Ogni produzione parte da un tema empiricamente fondato, attraversa gli assi strutturali pertinenti e arriva a strumenti, riflessioni o materiali che possono raggiungere professionisti, educatori e famiglie.
          </p>
          <Link
            to="/sviluppo-bambino/produzioni/temi"
            className="inline-block text-sm font-medium bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/30 px-5 py-2.5 rounded-md transition-colors"
          >
            Esplora i temi →
          </Link>
        </div>
      </div>

      {/* Cos'è una produzione */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6">
            Il progetto Sviluppo Bambino ha costruito un modello teorico: gli assi strutturali, il metodo, le interlocuzioni disciplinari. Ma un modello teorico non è ancora uno strumento. Le produzioni sono il passaggio successivo — il luogo in cui il modello incontra il reale.
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 max-w-3xl">
            Una produzione non è una semplificazione del modello né una sua applicazione meccanica. È una traduzione: il processo attraverso cui un tema concreto — rilevante nelle fonti empiriche e nelle pratiche professionali — viene letto con gli strumenti del modello, e da quella lettura emerge qualcosa di operativamente fruibile.
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            Il punto di partenza non è mai il modello ma sempre un tema empiricamente fondato: ciò che la ricerca segnala come rilevante, ciò che i professionisti incontrano sul campo, ciò che le famiglie vivono nei primi anni. Il modello fornisce la grammatica per leggerlo in modo strutturalmente preciso.
          </p>
        </div>
      </div>

      {/* Come funziona il processo */}
      <div className="bg-amber-50 border-b border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-950 mb-10">
            Il processo produttivo
          </h2>
          <div className="space-y-8 max-w-3xl">
            {[
              {
                step: '1',
                title: 'Ricognizione dei temi',
                body: 'Partendo dalle fonti — report istituzionali, letteratura scientifica recente, studi empirici — si identificano i temi con densità strutturale: fenomeni che la ricerca segnala come rilevanti e che aprono domande sui processi fondativi del soggetto, non solo su comportamenti osservabili.',
              },
              {
                step: '2',
                title: 'Attraversamento degli assi',
                body: 'Per ciascun tema si costruisce una micro-matrice di traduzione interdisciplinare: quale regione del modello viene interrogata da quel tema? Quali assi sono coinvolti? Dove il linguaggio disciplinare rischia di distorcere ciò che il modello vuole proteggere?',
              },
              {
                step: '3',
                title: 'Elaborazione delle produzioni',
                body: 'Dal lavoro sugli assi emergono produzioni specifiche: riflessioni concettuali, schede operative, materiali di formazione, contributi a pratiche professionali. La forma dipende dal tema e dal destinatario.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-5">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white text-sm font-bold flex items-center justify-center">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold text-amber-950 mb-2">{item.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* I temi */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Da dove partiamo
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-3xl">
            La fase attuale — Fase 2 del metodo — ha prodotto una prima ricognizione di dieci temi candidati. Sono temi che la ricerca internazionale segnala come strutturalmente rilevanti per lo sviluppo precoce, che attraversano più assi del modello e che non si riducono a strumenti, protocolli o categorie diagnostiche già esistenti.
          </p>
          <p className="text-base text-gray-500 leading-relaxed mb-10 max-w-3xl">
            Questi temi non sono ancora produzioni: sono i fuochi esplorativi da cui le produzioni possono emergere. La loro valutazione — quale affrontare per primo, in quale forma, per quale destinatario — è parte del lavoro che segue.
          </p>
          <Link
            to="/sviluppo-bambino/produzioni/temi"
            className="inline-block text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md transition-colors"
          >
            Vai ai temi candidati →
          </Link>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
