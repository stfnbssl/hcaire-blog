import { Link } from 'react-router-dom';

interface Progetto {
  slug: string;
  to: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'attivo' | 'in-arrivo';
}

const PROGETTI: Progetto[] = [
  {
    slug: 'sviluppo-bambino',
    to: '/sviluppo-bambino',
    title: 'Sviluppo Bambino',
    subtitle: 'Un modello strutturale per leggere lo sviluppo umano 0–12 anni',
    description:
      'Il primo progetto di HCAIRE: un\'architettura concettuale condivisibile tra discipline — filosofia, psicologia, pedagogia, clinica — articolata in finalità, metodo, interlocuzioni e produzioni.',
    status: 'attivo',
  },
];

const PLACEHOLDER_COUNT = 2;

export default function Progetti() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-none tracking-tight">
            Progetti
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl leading-relaxed">
            I progetti di ricerca di HCAIRE: percorsi di elaborazione concettuale che applicano gli assi strutturali a domini specifici.
          </p>
        </div>
      </div>

      {/* Lista progetti */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid sm:grid-cols-2 gap-5">
          {PROGETTI.map((p) => (
            <Link
              key={p.slug}
              to={p.to}
              className="group block rounded-lg border border-gray-200 p-6 hover:border-primary-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Attivo
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 mb-2">
                {p.title}
              </h2>
              <p className="text-sm italic text-gray-500 mb-3">{p.subtitle}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
              <span className="inline-block mt-4 text-sm font-medium text-primary-600 group-hover:text-primary-800 transition-colors">
                Esplora il progetto →
              </span>
            </Link>
          ))}

          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <div
              key={`placeholder-${i}`}
              className="block rounded-lg border border-dashed border-gray-200 p-6 bg-gray-50/50"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  In arrivo
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-400 mb-2">Prossimo progetto</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Nuovi progetti di ricerca in preparazione. Saranno annunciati man mano che le elaborazioni raggiungono una forma condivisibile.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
