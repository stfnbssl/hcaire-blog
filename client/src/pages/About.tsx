import { useFetchContent } from '../hooks/useFetchContent';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function About() {
  const { content, loading, error } = useFetchContent('about');

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {loading && (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      )}
      {error && <p className="text-center py-16 text-red-600">Errore: {error}</p>}
      {content && (
        <article>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{content.titolo}</h1>
          <MarkdownRenderer content={content.contenuto} />
        </article>
      )}
    </main>
  );
}
