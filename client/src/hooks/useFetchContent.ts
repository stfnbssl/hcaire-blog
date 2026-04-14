import { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import { Content, PaginatedResponse } from '../types/content';

export function useFetchContent(slug: string, getToken?: () => Promise<string | null>) {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const token = getToken ? await getToken() : null;
        const data  = await contentService.getBySlug(slug, token ?? undefined);
        setContent(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Errore caricamento');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return { content, loading, error };
}

export function useFetchContentList(page = 1) {
  const [result,  setResult]  = useState<PaginatedResponse<Content> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    contentService
      .getAll(page)
      .then(setResult)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  return { result, loading, error };
}
