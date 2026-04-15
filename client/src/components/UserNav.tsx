import { useAuth, useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';
import { useSiteConfig } from '../context/SiteConfigContext';

const PLAN_LABEL: Record<string, string> = {
  abbonato:      'Abbonato',
  bartleby:      'Bartleby',
  bartleby_plus: 'Bartleby+',
};

function AccountIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );
}

function PricingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.077 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.077-2.354-1.253V5z" clipRule="evenodd" />
    </svg>
  );
}

export default function UserNav() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { subscription, isActive } = useSubscription();
  const { isTestMode } = useSiteConfig();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <Link
          to="/pricing"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Prezzi
        </Link>
        <SignInButton mode="modal">
          <button className="text-sm font-medium bg-primary-600 text-white px-3 py-1.5 rounded-md hover:bg-primary-700 transition-colors">
            Accedi
          </button>
        </SignInButton>
      </div>
    );
  }

  const isAdmin  = user?.publicMetadata?.role === 'admin';
  const planKey  = subscription?.plan ?? 'none';
  const isTrial  = subscription?.status === 'on_trial';
  const planLabel = isActive && planKey !== 'none'
    ? (isTrial ? 'Trial' : (PLAN_LABEL[planKey] ?? 'Pro'))
    : null;

  return (
    <div className="flex items-center gap-3">
      {/* Badge piano attivo — link a /account */}
      {isActive && planLabel && (
        <Link
          to="/account"
          className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium hover:bg-green-200 transition-colors"
        >
          {planLabel}
        </Link>
      )}
      {/* Pulsante Abbonati — solo se non abbonato e non in test mode */}
      {!isActive && !isAdmin && !isTestMode && (
        <Link
          to="/pricing"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Abbonati
        </Link>
      )}
      <UserButton afterSignOutUrl="/">
        <UserButton.MenuItems>
          <UserButton.Link
            label={planLabel ? `Piano: ${planLabel}` : 'Il mio account'}
            href="/account"
            labelIcon={<AccountIcon />}
          />
          {!isActive && !isAdmin && !isTestMode && (
            <UserButton.Link
              label="Abbonati"
              href="/pricing"
              labelIcon={<PricingIcon />}
            />
          )}
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
}
