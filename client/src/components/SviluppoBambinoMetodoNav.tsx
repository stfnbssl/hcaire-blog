import { Link, useLocation } from 'react-router-dom';

const PAGE_LINKS = [
  { to: '/sviluppo-bambino/metodo/introduzione',        label: 'Introduzione' },
  { to: '/sviluppo-bambino/metodo/fasi',                label: 'Fasi' },
  { to: '/sviluppo-bambino/metodo/ricerca-scientifica', label: 'Ricerca scientifica' },
  { to: '/sviluppo-bambino/metodo/rapporto-con-ia',     label: 'Rapporto con l\'IA' },
];

export default function SviluppoBambinoMetodoNav() {
  const location = useLocation();
  const onMetodoRoot = location.pathname === '/sviluppo-bambino/metodo';

  return (
    <div className="sticky top-[6.5rem] z-30 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-1 overflow-x-auto py-1.5" style={{ scrollbarWidth: 'none' }}>
          {/* Back to section */}
          <Link
            to="/sviluppo-bambino"
            className="flex-shrink-0 text-xs px-3 py-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            ← Sviluppo bambino
          </Link>

          <span className="self-center text-slate-300 mx-1">/</span>

          {/* Metodo entry */}
          <Link
            to="/sviluppo-bambino/metodo"
            className={`flex-shrink-0 text-xs px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
              onMetodoRoot
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Metodo
          </Link>

          <span className="self-center text-slate-300 mx-1">|</span>

          {/* Sub-pages */}
          {PAGE_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex-shrink-0 text-xs px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                location.pathname.startsWith(link.to)
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
