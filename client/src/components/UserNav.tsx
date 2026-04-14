import { useAuth, useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';

const PLAN_LABEL: Record<string, string> = {
  abbonato:      'Abbonato',
  bartleby:      'Bartleby',
  bartleby_plus: 'Bartleby+',
};

export default function UserNav() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { subscription, isActive } = useSubscription();

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

  const isAdmin = user?.publicMetadata?.role === 'admin';
  const planKey = subscription?.plan ?? 'none';
  const label   = planKey !== 'none'
    ? (subscription?.status === 'on_trial' ? 'Trial' : PLAN_LABEL[planKey] ?? 'Pro')
    : null;

  return (
    <div className="flex items-center gap-3">
      {!isActive && !isAdmin && (
        <Link
          to="/pricing"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Abbonati
        </Link>
      )}
      {isActive && label && (
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
          {label}
        </span>
      )}
      <span className="text-sm text-gray-600 hidden sm:inline">
        {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}
      </span>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
