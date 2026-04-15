import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { getSubscriptionStatus, type SubscriptionStatus } from '../services/subscriptionService';

export function useSubscription() {
  const { getToken, isSignedIn } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!isSignedIn) return;
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      const data = await getSubscriptionStatus(token);
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore');
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, getToken]);

  useEffect(() => {
    if (!isSignedIn) {
      setSubscription(null);
      return;
    }
    fetchStatus();
  }, [isSignedIn, fetchStatus]);

  const isActive       = subscription?.status === 'active' || subscription?.status === 'on_trial';
  const isAbbonato     = isActive && (subscription?.plan === 'abbonato' || subscription?.plan === 'bartleby' || subscription?.plan === 'bartleby_plus');
  const isBartleby     = isActive && (subscription?.plan === 'bartleby' || subscription?.plan === 'bartleby_plus');
  const isBartlebyPlus = isActive && subscription?.plan === 'bartleby_plus';

  return { subscription, loading, error, isActive, isAbbonato, isBartleby, isBartlebyPlus, refresh: fetchStatus };
}
