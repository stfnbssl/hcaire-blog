import { Link, useLocation } from 'react-router-dom';

const PAGE_LINKS = [
  { to: '/sviluppo-bambino/produzioni/temi', label: 'Temi' },
  { to: '/sviluppo-bambino/produzioni/pipeline', label: 'Pipeline' },
];

export default function SviluppoBambinoProduzioniNav() {
  const location = useLocation();
  const onRoot = location.pathname === '/sviluppo-bambino/produzioni';

  return (
    <div className="sticky top-[6.5rem] z-30 bg-amber-50 border-b border-amber-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-1 overflow-x-auto py-1.5" style={{ scrollbarWidth: 'none' }}>
          <Link
            to="/sviluppo-bambino"
            className="flex-shrink-0 text-xs px-3 py-1 rounded-md text-amber-400 hover:text-amber-700 hover:bg-amber-100 transition-colors whitespace-nowrap"
          >
            ← Sviluppo bambino
          </Link>

          <span className="self-center text-amber-300 mx-1">/</span>

          <Link
            to="/sviluppo-bambino/produzioni"
            className={`flex-shrink-0 text-xs px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
              onRoot
                ? 'bg-amber-100 text-amber-800 font-medium'
                : 'text-amber-600 hover:text-amber-900 hover:bg-amber-100'
            }`}
          >
            Produzioni
          </Link>

          <span className="self-center text-amber-300 mx-1">|</span>

          {PAGE_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex-shrink-0 text-xs px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                location.pathname.startsWith(link.to)
                  ? 'bg-amber-100 text-amber-800 font-medium'
                  : 'text-amber-600 hover:text-amber-900 hover:bg-amber-100'
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
