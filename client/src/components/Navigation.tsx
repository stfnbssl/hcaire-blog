import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useFetchNavigation } from '../hooks/useFetchNavigation';
import { NavigationItem } from '../types/navigation';
import { APP_NAME } from '../utils/constants';

function navPath(item: NavigationItem): string {
  return item.isSpecial ? `/${item.slug}` : `/blog/${item.slug}`;
}

export default function Navigation() {
  const { items } = useFetchNavigation();
  const location  = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary-700">
            {APP_NAME}
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" active={location.pathname === '/'}>Home</NavLink>
            {items.map((item) => (
              <NavLink key={item._id} to={navPath(item)} active={location.pathname === navPath(item)}>
                {item.titolo}
              </NavLink>
            ))}
          </div>

          {/* Hamburger */}
          <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900" onClick={() => setOpen(!open)}>
            <span className="sr-only">Apri menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-1 border-t border-gray-100 pt-2">
            <MobileNavLink to="/" onClick={() => setOpen(false)}>Home</MobileNavLink>
            {items.map((item) => (
              <MobileNavLink key={item._id} to={navPath(item)} onClick={() => setOpen(false)}>
                {item.titolo}
              </MobileNavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        active ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-2 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
    >
      {children}
    </Link>
  );
}
