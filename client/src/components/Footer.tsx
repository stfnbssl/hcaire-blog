import { Link } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-slate-200 mt-auto">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold text-neutral-900 font-serif">{APP_NAME}</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600">
            Human Centered Artificial Intelligence Research Environment dedicato
            allo studio di modelli human-centered, traduzione interdisciplinare
            e strumenti operativi supportati dall'intelligenza artificiale.
          </p>
          <p className="footer-agentic-notice mt-4 text-xs text-neutral-500">
            Sviluppo Agentico: Questo sito è realizzato tramite processi di AI Orchestration.{' '}
            <Link to="/hcaire/agentic-shift" className="underline hover:text-neutral-800 transition-colors">
              Scopri di più →
            </Link>
          </p>
        </div>

        <div className="text-sm text-neutral-600">
          <p className="font-semibold text-neutral-900 font-serif">Navigazione</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/hcaire"           className="hover:text-neutral-900">Laboratorio</Link>
            <Link to="/assi-strutturali" className="hover:text-neutral-900">Assi Strutturali</Link>
            <Link to="/progetti"         className="hover:text-neutral-900">Progetti</Link>
            <Link to="/letture"          className="hover:text-neutral-900">Letture critiche</Link>
            <Link to="/about"            className="hover:text-neutral-900">About</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-300/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-sm text-neutral-500">
          <span>Reggio Emilia</span>
          <span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
