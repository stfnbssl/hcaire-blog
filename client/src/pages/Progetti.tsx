import { Link } from 'react-router-dom';

interface Progetto {
  slug: string;
  to: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'attivo' | 'in-elaborazione' | 'in-arrivo';
}

const PROGETTI: Progetto[] = [
  {
    slug: 'anthropos',
    to: '/anthropos',
    title: 'Anthropos',
    subtitle: 'Configurazione evolutiva dell\'umano lungo l\'intero arco della vita',
    description:
      'Il piano temporale-evolutivo di HCAIRE: trasformazione nel tempo della topologia degli assi strutturali. Finestre temporali, linee evolutive parallele, milestone di convergenza e dipendenze strutturali.',
    status: 'in-elaborazione',
  },
  {
    slug: 'sviluppo-bambino',
    to: '/sviluppo-bambino',
    title: 'Sviluppo Bambino',
    subtitle: 'Primo dominio applicativo di Anthropos — finestra 0–12 anni',
    description:
      'L\'infanzia come osservatorio privilegiato del fondamento ontologico: 50 schede-concetto e 215 relazioni tipizzate per leggere la configurazione evolutiva del campo bambino.',
    status: 'attivo',
  },
];

interface DominioPrevisto {
  title: string;
  description: string;
}

const DOMINI_PREVISTI: DominioPrevisto[] = [
  { title: 'Adolescenza',           description: 'Ristrutturazione identitaria, corpo, norma, gruppo.' },
  { title: 'Genitorialità',         description: 'Riorganizzazione degli assi nell\'incontro con la dipendenza del figlio.' },
  { title: 'Educazione',            description: 'Mediazione istituzionale della traduzione culturale.' },
  { title: 'Clinica',               description: 'Difficoltà di configurazione degli assi come oggetto di lettura e intervento.' },
  { title: 'Aging',                 description: 'Riorganizzazione degli assi nella riduzione delle possibilità corporee e sociali.' },
  { title: 'AI & Human Development', description: 'Sistemi artificiali come strumenti di navigazione dell\'architettura.' },
];

const STATUS_BADGE: Record<Progetto['status'], { label: string; classes: string }> = {
  'attivo':           { label: 'Attivo',          classes: 'text-emerald-700 bg-emerald-50' },
  'in-elaborazione':  { label: 'In elaborazione', classes: 'text-amber-700 bg-amber-50' },
  'in-arrivo':        { label: 'In arrivo',       classes: 'text-gray-600 bg-gray-100' },
};

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
            Archivio dei domini applicativi attivi e previsti: applicazioni dell'architettura di HCAIRE
            a finestre temporali e contesti specifici.
          </p>
        </div>
      </div>

      {/* Introduzione concettuale */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
        <p className="text-gray-700 leading-relaxed">
          L'architettura teorica di HCAIRE si articola su tre piani: gli <Link to="/assi-strutturali" className="text-primary-700 hover:underline">assi strutturali</Link> (fondamento
          ontologico), <Link to="/anthropos" className="text-primary-700 hover:underline">Anthropos</Link> (configurazione evolutiva dell'umano) e i
          domini applicativi specializzati. Ciascun dominio lavora sulla stessa struttura teorica
          applicata a una configurazione storica particolare.
        </p>
      </div>

      {/* Lista progetti */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 gap-5">
          {PROGETTI.map((p) => {
            const badge = STATUS_BADGE[p.status];
            return (
              <Link
                key={p.slug}
                to={p.to}
                className="group block rounded-lg border border-gray-200 p-6 hover:border-primary-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium uppercase tracking-wide px-2 py-0.5 rounded ${badge.classes}`}>
                    {badge.label}
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
            );
          })}
        </div>

        {/* Domini previsti */}
        <div className="mt-16">
          <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500 mb-5">
            Altri domini previsti
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DOMINI_PREVISTI.map((d) => (
              <div
                key={d.title}
                className="block rounded-lg border border-dashed border-gray-200 p-5 bg-gray-50/50"
              >
                <h3 className="text-base font-semibold text-gray-500 mb-1">{d.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
