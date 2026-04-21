import { Link } from 'react-router-dom';

export default function AgenticLabel() {
  return (
    <p className="agentic-label mt-6 text-xs italic text-gray-400 leading-relaxed">
      Contenuto generato tramite Agentic Workflow e revisionato da un operatore umano.{' '}
      <Link to="/hcaire/agentic-shift" className="underline hover:text-gray-600 transition-colors">
        Scopri di più →
      </Link>
    </p>
  );
}
