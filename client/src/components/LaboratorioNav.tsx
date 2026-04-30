import { Link, useLocation } from 'react-router-dom';
import { useT } from '../context/SiteContentContext';

const NAV_LINKS = [
  { to: '/hcaire/manifesto',              key: 'laboratorio.nav.manifesto',            fallback: 'Manifesto' },
  { to: '/hcaire/metodo',                 key: 'laboratorio.nav.metodo',               fallback: 'Metodo' },
  { to: '/hcaire/progetti',               key: 'laboratorio.nav.progetti',             fallback: 'Progetti' },
  { to: '/hcaire/ambiente-editoriale',    key: 'laboratorio.nav.ambiente-editoriale',  fallback: 'Ambiente editoriale' },
  { to: '/hcaire/agentic-shift',          key: 'laboratorio.nav.agentic-shift',        fallback: 'Agentic Shift' },
  { to: '/hcaire/protocolli',             key: 'laboratorio.nav.protocolli',           fallback: 'Protocolli' },
];

export default function LaboratorioNav() {
  const location = useLocation();
  const t = useT();

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
            {t('laboratorio.nav.back', '← Laboratorio')}
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
              {t(link.key, link.fallback)}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
