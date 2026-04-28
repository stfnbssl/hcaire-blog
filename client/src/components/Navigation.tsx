import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth, useUser, SignInButton } from '@clerk/clerk-react';
import { useFetchNavigation } from '../hooks/useFetchNavigation';
import { NavigationItem } from '../types/navigation';
import { APP_NAME } from '../utils/constants';
import UserNav from './UserNav';
import { useSubscription } from '../hooks/useSubscription';
import { useSiteConfig } from '../context/SiteConfigContext';

function navPath(item: NavigationItem): string {
  return item.isSpecial ? `/${item.slug}` : `/blog/${item.slug}`;
}

export default function Navigation() {
  const { items } = useFetchNavigation();
  const location  = useLocation();
  const [open, setOpen] = useState(false);
  const { isBartleby, isActive } = useSubscription();
  const { isSignedIn } = useAuth();
  const { isTestMode } = useSiteConfig();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

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
            <NavLink to="/hcaire" active={location.pathname.startsWith('/hcaire')}>HCAIRE</NavLink>
            <NavLink to="/sviluppo-bambino" active={location.pathname.startsWith('/sviluppo-bambino')}>Sviluppo bambino</NavLink>
            <NavLink to="/letture" active={location.pathname.startsWith('/letture')}>Letture</NavLink>
            {items.map((item) => (
              <NavLink key={item._id} to={navPath(item)} active={location.pathname === navPath(item)}>
                {item.titolo}
              </NavLink>
            ))}
            {(isBartleby || isAdmin) && (
              <NavLink to="/bartleby" active={location.pathname.startsWith('/bartleby')}>
                Bartleby
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" active={location.pathname.startsWith('/admin')}>
                Admin
              </NavLink>
            )}
            <UserNav />
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

        {/* Badge agentico — desktop only, mobile handled by footer */}
        <div className="hidden md:flex justify-end pb-1">
          <span className="agentic-badge text-xs text-gray-400">
            Contenuti generati da Agenti AI{' '}
            <Link to="/hcaire/agentic-shift" className="underline hover:text-gray-600 transition-colors">
              Scopri di più →
            </Link>
          </span>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-1 border-t border-gray-100 pt-2">
            <MobileNavLink to="/" onClick={() => setOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/hcaire" onClick={() => setOpen(false)}>HCAIRE</MobileNavLink>
            <MobileNavLink to="/sviluppo-bambino" onClick={() => setOpen(false)}>Sviluppo bambino</MobileNavLink>
            <MobileNavLink to="/letture" onClick={() => setOpen(false)}>Letture</MobileNavLink>
            {items.map((item) => (
              <MobileNavLink key={item._id} to={navPath(item)} onClick={() => setOpen(false)}>
                {item.titolo}
              </MobileNavLink>
            ))}
            {(isBartleby || isAdmin) && (
              <MobileNavLink to="/bartleby" onClick={() => setOpen(false)}>Bartleby</MobileNavLink>
            )}
            {isAdmin && (
              <MobileNavLink to="/admin" onClick={() => setOpen(false)}>Admin</MobileNavLink>
            )}
            {/* Separatore e voci utente */}
            <div className="border-t border-gray-100 pt-2 mt-2">
              {isSignedIn ? (
                <>
                  <MobileNavLink to="/account" onClick={() => setOpen(false)}>Il mio account</MobileNavLink>
                  {!isActive && !isAdmin && !isTestMode && (
                    <MobileNavLink to="/pricing" onClick={() => setOpen(false)}>Abbonati</MobileNavLink>
                  )}
                </>
              ) : (
                <>
                  <MobileNavLink to="/pricing" onClick={() => setOpen(false)}>Prezzi</MobileNavLink>
                  <div className="px-2 py-2">
                    <SignInButton mode="modal">
                      <button
                        onClick={() => setOpen(false)}
                        className="w-full text-sm font-medium bg-primary-600 text-white px-3 py-1.5 rounded-md hover:bg-primary-700 transition-colors"
                      >
                        Accedi
                      </button>
                    </SignInButton>
                  </div>
                </>
              )}
            </div>
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
