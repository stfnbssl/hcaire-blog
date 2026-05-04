import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AnnotatedSceneConfig } from '../../data/corso-fase1/types';

interface Props {
  config: AnnotatedSceneConfig;
}

export default function AnnotatedScene({ config }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const annotationsById = useMemo(() => {
    const map: Record<string, AnnotatedSceneConfig['annotations'][number]> = {};
    for (const a of config.annotations) map[a.id] = a;
    return map;
  }, [config.annotations]);

  const handleClick = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  // Attiva i listener sui <span class="corso-anno" data-anno-id="..."> presenti nel sceneHtml.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const triggers = Array.from(
      root.querySelectorAll<HTMLElement>('span.corso-anno[data-anno-id]'),
    );

    const onClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const id = target.dataset.annoId;
      if (id) handleClick(id);
    };

    triggers.forEach((t) => {
      t.setAttribute('role', 'button');
      t.setAttribute('tabindex', '0');
      t.addEventListener('click', onClick);
      // Colore della sottolineatura punteggiata
      const id = t.dataset.annoId;
      if (id) {
        const a = annotationsById[id];
        if (a) {
          t.style.setProperty('--corso-anno-color', a.colore);
        }
      }
    });

    return () => {
      triggers.forEach((t) => t.removeEventListener('click', onClick));
    };
  }, [annotationsById, handleClick, config.sceneHtml]);

  // Aggiorna la classe "attiva" degli span
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>('span.corso-anno[data-anno-id]').forEach((t) => {
      const id = t.dataset.annoId;
      if (id === activeId) t.classList.add('corso-anno--active');
      else t.classList.remove('corso-anno--active');
    });
  }, [activeId]);

  const active = activeId ? annotationsById[activeId] : null;

  return (
    <div className="corso-annotated-scene">
      {config.istruzione && (
        <p className="corso-annotated-scene__hint">{config.istruzione}</p>
      )}

      <div
        ref={containerRef}
        className="corso-annotated-scene__text"
        dangerouslySetInnerHTML={{ __html: config.sceneHtml }}
      />

      {active && (
        <div
          className="corso-annotated-scene__panel"
          role="region"
          aria-label={`Annotazione: ${active.label}`}
          style={{ borderLeftColor: active.colore }}
        >
          <div className="corso-annotated-scene__panel-head">
            <span
              className="corso-annotated-scene__badge"
              style={{ background: active.colore }}
            >
              {active.label}
            </span>
            {active.asse && (
              <span className="corso-annotated-scene__asse">{active.asse}</span>
            )}
            <button
              type="button"
              className="corso-annotated-scene__close"
              aria-label="Chiudi annotazione"
              onClick={() => setActiveId(null)}
            >
              ×
            </button>
          </div>
          <p className="corso-annotated-scene__body">{active.annotazione}</p>
        </div>
      )}
    </div>
  );
}
