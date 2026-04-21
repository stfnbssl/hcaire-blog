import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/bartleby',               label: 'Invia traccia',    exact: true },
  { to: '/bartleby/knowledge-base', label: 'Knowledge Base',  exact: false },
  { to: '/bartleby/outputs',        label: 'Output generati', exact: false },
];

export default function BartlebyNav() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto py-1">
          {links.map(({ to, label, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
