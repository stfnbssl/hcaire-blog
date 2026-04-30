import MarkdownRenderer from './MarkdownRenderer';
import { useT } from '../context/SiteContentContext';

interface TProps {
  /** Chiave i18n (es. "laboratorio.sezioni.metodo.body") */
  id:        string;
  /** Fallback se il valore non è in DB né in JSON */
  fallback?: string;
  /** Se true, renderizza il valore come markdown */
  markdown?: boolean;
  /** Classe CSS opzionale (per il wrapping del markdown o text plain) */
  className?: string;
}

/**
 * Componente per render testi i18n.
 * - <T id="key" fallback="..." />            → plain text
 * - <T id="key" markdown fallback="..." />   → markdown via MarkdownRenderer
 *
 * La prop `markdown` riflette l'intento del designer della pagina.
 * Il campo `type` salvato nel DB è metadata per l'admin UI.
 */
export default function T({ id, fallback, markdown, className }: TProps) {
  const t = useT();
  const value = t(id, fallback);

  if (markdown) {
    return (
      <div className={className}>
        <MarkdownRenderer content={value} />
      </div>
    );
  }
  return className ? <span className={className}>{value}</span> : <>{value}</>;
}
