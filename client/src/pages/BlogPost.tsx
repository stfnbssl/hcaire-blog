import { useParams, Link } from 'react-router-dom';
import { useFetchContent } from '../hooks/useFetchContent';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function BlogPost() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { content, loading, error } = useFetchContent(slug);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/" className="text-primary-600 hover:text-primary-700 text-sm mb-8 inline-flex items-center gap-1">
        ← Torna alla home
      </Link>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      )}

      {error && (
        <div className="text-center py-16">
          <p className="text-red-600 mb-4">Errore: {error}</p>
          <Link to="/" className="text-primary-600 hover:underline">Torna alla home</Link>
        </div>
      )}

      {content && (
        <article>
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
              <span className="capitalize">{content.categoria}</span>
              <span>·</span>
              <span>
                {new Date(content.createdAt).toLocaleDateString('it-IT', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
              <span>·</span>
              <span>{content.autore}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{content.titolo}</h1>
            {content.descrizione && (
              <p className="text-xl text-gray-600">{content.descrizione}</p>
            )}
            {content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {content.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>
          <MarkdownRenderer content={content.contenuto} />
        </article>
      )}
    </main>
  );
}
