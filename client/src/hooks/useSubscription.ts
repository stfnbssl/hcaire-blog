import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { getSubscriptionStatus, type SubscriptionStatus } from '../services/subscriptionService';

export function useSubscription() {
  const { getToken, isSignedIn } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      setSubscription(null);
      return;
    }

    let cancelled = false;

    async function fetchStatus() {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token || cancelled) return;
        const data = await getSubscriptionStatus(token);
        if (!cancelled) setSubscription(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Errore');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStatus();
    return () => { cancelled = true; };
  }, [isSignedIn, getToken]);

  const isActive      = subscription?.status === 'active' || subscription?.status === 'on_trial';
  const isAbbonato    = isActive && (subscription?.plan === 'abbonato' || subscription?.plan === 'bartleby' || subscription?.plan === 'bartleby_plus');
  const isBartleby    = isActive && (subscription?.plan === 'bartleby' || subscription?.plan === 'bartleby_plus');
  const isBartlebyPlus = isActive && subscription?.plan === 'bartleby_plus';

  return { subscription, loading, error, isActive, isAbbonato, isBartleby, isBartlebyPlus };
}
