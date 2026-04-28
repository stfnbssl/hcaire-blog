import { Link, useLocation, useParams } from 'react-router-dom';

type Crumb = { to: string; label: string };

export default function SviluppoBambinoPipelineNav() {
  const location = useLocation();
  const params = useParams();
  const path = location.pathname;

  const crumbs: Crumb[] = [
    { to: '/sviluppo-bambino/produzioni/pipeline', label: 'Mappa' },
  ];

  if (params.ricercaId) {
    crumbs.push({
      to: `/sviluppo-bambino/produzioni/pipeline/ricerche/${params.ricercaId}`,
      label: `Ricerca: ${params.ricercaId.replace(/^ricerca-\d+-/, '').replace(/-/g, ' ')}`,
    });
  }

  if (params.temaId) {
    crumbs.push({
      to: `/sviluppo-bambino/produzioni/pipeline/temi/${params.temaId}`,
      label: `Tema: ${params.temaId.replace(/-/g, ' ')}`,
    });
    if (path.endsWith('/dispositivo')) {
      crumbs.push({
        to: `/sviluppo-bambino/produzioni/pipeline/temi/${params.temaId}/dispositivo`,
        label: 'Dispositivo',
      });
    } else if (path.endsWith('/stress-test')) {
      crumbs.push({
        to: `/sviluppo-bambino/produzioni/pipeline/temi/${params.temaId}/stress-test`,
        label: 'Stress test',
      });
    } else if (path.endsWith('/proxy')) {
      crumbs.push({
        to: `/sviluppo-bambino/produzioni/pipeline/temi/${params.temaId}/proxy`,
        label: 'Proxy evolution',
      });
    }
  }

  return (
    <div className="sticky top-[9rem] z-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-1 overflow-x-auto py-1.5" style={{ scrollbarWidth: 'none' }}>
          {crumbs.map((c, i) => (
            <div key={c.to} className="flex items-center gap-1 flex-shrink-0">
              {i > 0 && <span className="text-slate-300">/</span>}
              <Link
                to={c.to}
                className={`text-xs px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                  path === c.to
                    ? 'bg-slate-200 text-slate-800 font-medium'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {c.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
