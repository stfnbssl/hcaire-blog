import { useEffect, useState } from 'react';
import MarkdownRenderer from '../MarkdownRenderer';
import { sviluppoBambinoApi } from '../../services/staticContentService';

export default function GuidaPipelinePanel() {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    sviluppoBambinoApi.getProduzioniGuidaPipeline()
      .then((res) => { if (mounted) setContent(res.content); })
      .catch((e) => { if (mounted) setError((e as Error).message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
        Errore nel caricamento della guida: {error}
      </div>
    );
  }
  if (!content) return null;

  return (
    <div className="prose prose-slate max-w-none">
      <MarkdownRenderer content={content} />
    </div>
  );
}
