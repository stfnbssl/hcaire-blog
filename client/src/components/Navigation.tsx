import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth, useUser, SignInButton } from '@clerk/clerk-react';
import { useFetchNavigation } from '../hooks/useFetchNavigation';
import { NavigationItem } from '../types/navigation';
import UserNav from './UserNav';
import { useSubscription } from '../hooks/useSubscription';
import { useSiteConfig } from '../context/SiteConfigContext';
import logo from '../assets/logo.svg';

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
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="group flex items-center shrink-0">
            <img
              src={logo}
              alt="HCAIRE logo"
              className="h-10 w-auto transition group-hover:opacity-90"
            />
          </Link>

          {/* Desktop: nav links + agentic badge tucked below in the same 64px row */}
          <div className="hidden md:flex flex-col items-end justify-center gap-0.5">
            <nav className="flex items-center gap-5 text-sm text-neutral-600">
              <NavLink to="/hcaire"           active={location.pathname.startsWith('/hcaire')}>Laboratorio</NavLink>
              <NavLink to="/assi-strutturali" active={location.pathname.startsWith('/assi-strutturali')}>Assi Strutturali</NavLink>
              <NavLink to="/metodo"           active={location.pathname.startsWith('/metodo')}>Metodo</NavLink>
              <NavLink to="/progetti"         active={location.pathname.startsWith('/progetti') || location.pathname.startsWith('/sviluppo-bambino') || location.pathname.startsWith('/anthropos')}>Progetti</NavLink>
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
              <NavLink to="/letture" active={location.pathname.startsWith('/letture')}>Letture critiche</NavLink>
              {isAdmin && (
                <NavLink to="/admin" active={location.pathname.startsWith('/admin')}>
                  Admin
                </NavLink>
              )}
              <UserNav />
            </nav>
            <span className="text-[10px] leading-none text-neutral-400">
              Contenuti generati da Agenti AI{' '}
              <Link to="/hcaire/agentic-shift" className="underline hover:text-neutral-700 transition-colors">
                Scopri di più →
              </Link>
            </span>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-neutral-600 hover:text-neutral-900"
            onClick={() => setOpen(!open)}
          >
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
          <div className="md:hidden pb-4 space-y-1 border-t border-neutral-200 pt-2">
            <MobileNavLink to="/hcaire"           onClick={() => setOpen(false)}>Laboratorio</MobileNavLink>
            <MobileNavLink to="/assi-strutturali" onClick={() => setOpen(false)}>Assi Strutturali</MobileNavLink>
            <MobileNavLink to="/metodo"           onClick={() => setOpen(false)}>Metodo</MobileNavLink>
            <MobileNavLink to="/progetti"         onClick={() => setOpen(false)}>Progetti</MobileNavLink>
            {items.map((item) => (
              <MobileNavLink key={item._id} to={navPath(item)} onClick={() => setOpen(false)}>
                {item.titolo}
              </MobileNavLink>
            ))}
            {(isBartleby || isAdmin) && (
              <MobileNavLink to="/bartleby" onClick={() => setOpen(false)}>Bartleby</MobileNavLink>
            )}
            <MobileNavLink to="/letture" onClick={() => setOpen(false)}>Letture critiche</MobileNavLink>
            {isAdmin && (
              <MobileNavLink to="/admin" onClick={() => setOpen(false)}>Admin</MobileNavLink>
            )}
            <div className="border-t border-neutral-200 pt-2 mt-2">
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
                        className="w-full text-sm font-medium bg-neutral-900 text-white px-3 py-2 rounded-xl hover:bg-black transition-colors"
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
    </header>
  );
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`text-sm transition-colors hover:text-neutral-900 ${
        active ? 'text-neutral-900 font-medium' : 'text-neutral-600'
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
      className="block px-2 py-2 text-sm text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-md"
    >
      {children}
    </Link>
  );
}
