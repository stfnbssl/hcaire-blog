import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/sviluppo-bambino/finalita',       label: 'Finalità' },
  { to: '/sviluppo-bambino/metodo',         label: 'Metodo' },
  { to: '/sviluppo-bambino/assi',           label: 'Assi strutturali' },
  { to: '/sviluppo-bambino/interlocuzioni', label: 'Interlocuzioni' },
];

export default function SviluppoBambinoNav() {
  const location = useLocation();

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="flex gap-1 overflow-x-auto py-2" style={{ scrollbarWidth: 'none' }}>
          <Link
            to="/sviluppo-bambino"
            className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              location.pathname === '/sviluppo-bambino'
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            ← Sezione
          </Link>
          <span className="self-center text-gray-200 mx-1">|</span>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                location.pathname.startsWith(link.to)
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
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
