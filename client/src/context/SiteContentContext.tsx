import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  fetchSiteContent,
  type SiteContentItem,
  type SupportedLang,
  DEFAULT_LANG,
} from '../services/siteContentService';

const CACHE_KEY = 'siteContent_v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1h

interface CachedPayload {
  items:    SiteContentItem[];
  storedAt: number;
}

type StringMap = Record<string, string>;
type AllLangsMap = Partial<Record<SupportedLang, StringMap>>;

interface SiteContentContextValue {
  lang:    SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t:       (key: string, fallback?: string) => string;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

function readCache(): CachedPayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedPayload;
    if (!parsed.storedAt || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(items: SiteContentItem[]): void {
  try {
    const payload: CachedPayload = { items, storedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    /* quota exceeded — ignore */
  }
}

function itemsToMap(items: SiteContentItem[]): AllLangsMap {
  const out: AllLangsMap = {};
  for (const item of items) {
    for (const [lang, value] of Object.entries(item.translations)) {
      if (typeof value !== 'string') continue;
      const langMap = (out[lang as SupportedLang] ??= {});
      langMap[item.key] = value;
    }
  }
  return out;
}

async function loadJsonDefaults(lang: SupportedLang): Promise<StringMap> {
  try {
    const res = await fetch(`/locales/${lang}/common.json`);
    if (!res.ok) return {};
    return (await res.json()) as StringMap;
  } catch {
    return {};
  }
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [lang, setLang]               = useState<SupportedLang>(DEFAULT_LANG);
  const [defaults, setDefaults]       = useState<StringMap>({});
  const [overrides, setOverrides]     = useState<AllLangsMap>(() => {
    const cached = readCache();
    return cached ? itemsToMap(cached.items) : {};
  });
  const [loading, setLoading]         = useState(true);
  const fetchedRef = useRef(false);

  // Carica i default JSON (bundled) per la lingua corrente
  useEffect(() => {
    let cancelled = false;
    loadJsonDefaults(lang).then((map) => {
      if (!cancelled) setDefaults(map);
    });
    return () => { cancelled = true; };
  }, [lang]);

  // Fetch DB overlay all'init (e su refresh manuale)
  const refresh = async (): Promise<void> => {
    try {
      const items = await fetchSiteContent();
      writeCache(items);
      setOverrides(itemsToMap(items));
    } catch {
      // se DB down: rimangono i default JSON / cache precedente
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const cached = readCache();
    const fresh = cached && (Date.now() - cached.storedAt) < CACHE_TTL_MS;
    if (fresh) {
      setLoading(false);
      // refresh in background per aggiornare la cache
      void refresh();
    } else {
      void refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = (key: string, fallback?: string): string => {
    const dbValue = overrides[lang]?.[key];
    if (typeof dbValue === 'string' && dbValue.length > 0) return dbValue;
    const defaultValue = defaults[key];
    if (typeof defaultValue === 'string' && defaultValue.length > 0) return defaultValue;
    return fallback ?? key;
  };

  return (
    <SiteContentContext.Provider value={{ lang, setLang, t, loading, refresh }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useT must be used inside SiteContentProvider');
  return ctx.t;
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContent must be used inside SiteContentProvider');
  return ctx;
}
