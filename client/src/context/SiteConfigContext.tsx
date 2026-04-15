import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getSiteConfig, type SiteStatus } from '../services/siteConfigService';

interface SiteConfigContextValue {
  siteStatus: SiteStatus;
  isTestMode: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [siteStatus, setSiteStatus] = useState<SiteStatus>('test');
  const [loading, setLoading]       = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      const data = await getSiteConfig();
      setSiteStatus(data.status);
    } catch {
      // In caso di errore mantiene 'test' (modalità più permissiva)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  return (
    <SiteConfigContext.Provider value={{
      siteStatus,
      isTestMode: siteStatus === 'test',
      loading,
      refresh: fetchConfig,
    }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error('useSiteConfig must be used inside SiteConfigProvider');
  return ctx;
}
