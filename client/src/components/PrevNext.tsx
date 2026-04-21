import { Link } from 'react-router-dom';

interface Props {
  prevSlug?: string | null;
  prevLabel?: string;
  nextSlug?: string | null;
  nextLabel?: string;
  baseUrl: string;
}

export default function PrevNext({ prevSlug, prevLabel, nextSlug, nextLabel, baseUrl }: Props) {
  return (
    <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
      <div>
        {prevSlug ? (
          <Link
            to={`${baseUrl}/${prevSlug}`}
            className="group flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            <span className="text-lg">←</span>
            <span>{prevLabel ?? 'Precedente'}</span>
          </Link>
        ) : (
          <span className="text-sm text-gray-300">← Precedente</span>
        )}
      </div>
      <div>
        {nextSlug ? (
          <Link
            to={`${baseUrl}/${nextSlug}`}
            className="group flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            <span>{nextLabel ?? 'Successivo'}</span>
            <span className="text-lg">→</span>
          </Link>
        ) : (
          <span className="text-sm text-gray-300">Successivo →</span>
        )}
      </div>
    </div>
  );
}
