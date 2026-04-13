import { useState, useEffect } from 'react';
import { apiRequest } from '../services/apiClient';
import { NavigationItem } from '../types/navigation';

export function useFetchNavigation() {
  const [items,   setItems]   = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    apiRequest<NavigationItem[]>('/navigation')
      .then(setItems)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
}
