import { Link } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-3">
        <p className="footer-agentic-notice text-xs text-gray-500">
          Sviluppo Agentico: Questo sito è realizzato tramite processi di AI Orchestration.{' '}
          <Link to="/hcaire/agentic-shift" className="underline hover:text-gray-300 transition-colors">
            Scopri di più →
          </Link>
        </p>
        <p className="text-sm">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
