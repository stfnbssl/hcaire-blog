import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/hcaire/metodo',                 label: 'Metodo' },
  { to: '/hcaire/progetti',               label: 'Progetti' },
  { to: '/hcaire/ambiente-editoriale',    label: 'Ambiente editoriale' },
  { to: '/hcaire/ia-centrata-sull-umano', label: 'IA orientata' },
  { to: '/hcaire/agentic-shift',          label: 'Agentic Shift' },
  { to: '/hcaire/protocolli',             label: 'Protocolli' },
];

export default function LaboratorioNav() {
  const location = useLocation();

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="flex gap-1 overflow-x-auto py-2" style={{ scrollbarWidth: 'none' }}>
          <Link
            to="/hcaire"
            className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              location.pathname === '/hcaire'
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            ← Laboratorio
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
