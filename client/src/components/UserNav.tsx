import { useAuth, useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';

export default function UserNav() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { subscription } = useSubscription();

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

  const isActive = subscription?.status === 'active' || subscription?.status === 'on_trial';

  return (
    <div className="flex items-center gap-3">
      {!isActive && (
        <Link
          to="/pricing"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Abbonati
        </Link>
      )}
      {isActive && (
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
          {subscription?.status === 'on_trial' ? 'Trial' : 'Pro'}
        </span>
      )}
      <span className="text-sm text-gray-600 hidden sm:inline">{user?.firstName ?? user?.emailAddresses[0]?.emailAddress}</span>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
