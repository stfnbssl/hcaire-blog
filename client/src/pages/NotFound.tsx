import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-bold text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Pagina non trovata</h2>
      <p className="text-gray-600 mb-8">La pagina che stai cercando non esiste.</p>
      <Link
        to="/"
        className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
      >
        Torna alla home
      </Link>
    </div>
  );
}
