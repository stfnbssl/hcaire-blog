import { NavLink, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { useState, useEffect, useMemo } from 'react';

interface SubItem {
  label: string;
  to: string;
  end?: boolean;
  external?: boolean;
}

interface Group {
  id: string;
  label: string;
  items: SubItem[];
}

const GROUPS: Group[] = [
  {
    id: 'articoli',
    label: 'Articoli blog',
    items: [
      { label: 'Dashboard',     to: '/admin', end: true },
      { label: 'Workflow log',  to: '/admin/workflow' },
      { label: 'Richieste',     to: '/admin/requests' },
    ],
  },
  {
    id: 'letture',
    label: 'Letture',
    items: [
      { label: 'Opere',         to: '/admin/letture', end: true },
    ],
  },
  {
    id: 'assi',
    label: 'Assi strutturali',
    items: [
      { label: 'Lista assi',    to: '/admin/assi', end: true },
      { label: 'Capitoli',      to: '/admin/assi/capitoli' },
      { label: 'Catalogo',      to: '/admin/catalogo' },
      { label: 'Rebuild & log', to: '/admin/assi/rebuild' },
    ],
  },
  {
    id: 'skills',
    label: 'Skills & jobs',
    items: [
      { label: 'Skills',          to: '/admin/skills' },
      { label: 'Plugins',         to: '/admin/plugins' },
      { label: 'Job Definitions', to: '/admin/job-definitions' },
      { label: 'Jobs',            to: '/admin/jobs' },
    ],
  },
  {
    id: 'sito',
    label: 'Sito',
    items: [
      { label: 'Configurazione', to: '/admin/site-config' },
      { label: 'Testi',          to: '/admin/testi' },
      { label: 'Servizi',        to: '/admin/servizi' },
    ],
  },
  {
    id: 'docs',
    label: 'Documentazione',
    items: [
      { label: 'hcaire-docs ↗', to: 'https://stfnbssl.github.io/hcaire-docs/', external: true },
    ],
  },
];

function isItemActive(pathname: string, item: SubItem): boolean {
  if (item.external) return false;
  return item.end ? pathname === item.to : pathname.startsWith(item.to);
}

function isGroupActive(pathname: string, group: Group): boolean {
  return group.items.some((it) => isItemActive(pathname, it));
}

function Sidebar(): JSX.Element {
  const location = useLocation();
  const activeGroupId = useMemo(
    () => GROUPS.find((g) => isGroupActive(location.pathname, g))?.id ?? 'articoli',
    [location.pathname],
  );

  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set([activeGroupId]));

  useEffect(() => {
    setOpenGroups((prev) => {
      if (prev.has(activeGroupId)) return prev;
      const next = new Set(prev);
      next.add(activeGroupId);
      return next;
    });
  }, [activeGroupId]);

  const toggleGroup = (id: string): void => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-slate-50 min-h-[calc(100vh-3rem)]">
      <nav className="py-4 text-sm">
        {GROUPS.map((group) => {
          const open = openGroups.has(group.id);
          const active = isGroupActive(location.pathname, group);
          return (
            <div key={group.id} className="mb-1">
              <button
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center justify-between px-4 py-2 text-left font-medium transition-colors ${
                  active ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{group.label}</span>
                <span className="text-xs text-slate-400">{open ? '▾' : '▸'}</span>
              </button>
              {open && (
                <ul className="ml-2 mt-0.5 mb-1 space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      {item.external ? (
                        <a
                          href={item.to}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block pl-6 pr-3 py-1.5 border-l-2 border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <NavLink
                          to={item.to}
                          end={item.end}
                          className={({ isActive }) =>
                            `block pl-6 pr-3 py-1.5 border-l-2 transition-colors ${
                              isActive
                                ? 'border-emerald-500 bg-white text-slate-900 font-medium'
                                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
          <span className="text-sm font-medium text-gray-300">Admin · HCAIRE</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      <div className="flex-grow flex">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
