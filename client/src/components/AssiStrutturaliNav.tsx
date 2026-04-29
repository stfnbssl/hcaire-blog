import { Link, useLocation } from 'react-router-dom';

const PAGE_LINKS = [
  { to: '/assi-strutturali',          label: 'Panoramica', exact: true },
  { to: '/assi-strutturali/capitoli', label: 'Capitoli',   exact: false },
];

export default function AssiStrutturaliNav() {
  const location = useLocation();

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="flex gap-1 overflow-x-auto py-2" style={{ scrollbarWidth: 'none' }}>
          {PAGE_LINKS.map((link) => {
            const active = link.exact
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
