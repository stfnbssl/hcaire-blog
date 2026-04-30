import { NavLink } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';

const ADMIN_LINKS = [
  { to: '/admin',               label: 'Dashboard',   end: true  },
  { to: '/admin/workflow',      label: 'Workflow Log', end: false },
  { to: '/admin/requests',      label: 'Richieste',    end: false },
  { to: '/admin/letture',       label: 'Letture',      end: false },
  { to: '/admin/site-config',   label: 'Stato sito',   end: false },
  { to: '/admin/testi',         label: 'Testi',        end: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-12">
          <div className="flex gap-1">
            {ADMIN_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-gray-900'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
      <div className="flex-grow">{children}</div>
    </div>
  );
}
