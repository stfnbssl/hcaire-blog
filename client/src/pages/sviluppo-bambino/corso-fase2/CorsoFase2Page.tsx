import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SviluppoBambinoNav from '../../../components/SviluppoBambinoNav';
import Sidebar from '../../../components/corso-fase2/Sidebar';
import SlideRenderer from '../../../components/corso-fase2/SlideRenderer';
import { MODULES, MODULES_BY_ID } from '../../../data/corso-fase2/modules';
import '../../../styles/corso-fase2.css';

const BASE_PATH = '/sviluppo-bambino/traduzione-interdisciplinare';

function buildPath(moduleId: string, slideIndex: number): string {
  return `${BASE_PATH}/${moduleId}/${slideIndex + 1}`;
}

export default function CorsoFase2Page() {
  const navigate = useNavigate();
  const params = useParams<{ moduleId?: string; slideId?: string }>();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentModuleId = params.moduleId && MODULES_BY_ID[params.moduleId]
    ? params.moduleId
    : MODULES[0].id;

  const currentModule = MODULES_BY_ID[currentModuleId];

  // 1-based slide index nelle URL, 0-based internamente.
  const requestedIndex = params.slideId ? parseInt(params.slideId, 10) - 1 : 0;
  const currentSlideIndex = Number.isFinite(requestedIndex)
    && requestedIndex >= 0
    && requestedIndex < currentModule.slides.length
      ? requestedIndex
      : 0;

  const currentSlide = currentModule.slides[currentSlideIndex];

  const flatPosition = useMemo(() => {
    let absolute = 0;
    let total = 0;
    for (const m of MODULES) {
      if (m.id === currentModuleId) absolute += currentSlideIndex;
      else if (MODULES.indexOf(m) < MODULES.indexOf(currentModule)) absolute += m.slides.length;
      total += m.slides.length;
    }
    return { absolute, total };
  }, [currentModuleId, currentSlideIndex, currentModule]);

  const goToSlide = useCallback(
    (moduleId: string, slideIndex: number) => {
      navigate(buildPath(moduleId, slideIndex));
    },
    [navigate],
  );

  const goPrev = useCallback(() => {
    if (currentSlideIndex > 0) {
      goToSlide(currentModuleId, currentSlideIndex - 1);
      return;
    }
    const moduleIdx = MODULES.findIndex((m) => m.id === currentModuleId);
    if (moduleIdx > 0) {
      const prevModule = MODULES[moduleIdx - 1];
      goToSlide(prevModule.id, prevModule.slides.length - 1);
    }
  }, [currentModuleId, currentSlideIndex, goToSlide]);

  const goNext = useCallback(() => {
    if (currentSlideIndex < currentModule.slides.length - 1) {
      goToSlide(currentModuleId, currentSlideIndex + 1);
      return;
    }
    const moduleIdx = MODULES.findIndex((m) => m.id === currentModuleId);
    if (moduleIdx < MODULES.length - 1) {
      goToSlide(MODULES[moduleIdx + 1].id, 0);
    }
  }, [currentModule, currentModuleId, currentSlideIndex, goToSlide]);

  const isFirstSlideOfCourse =
    currentModuleId === MODULES[0].id && currentSlideIndex === 0;
  const isLastSlideOfCourse =
    currentModuleId === MODULES[MODULES.length - 1].id &&
    currentSlideIndex === currentModule.slides.length - 1;

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (rootRef.current) {
      void rootRef.current.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(document.fullscreenElement === rootRef.current);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Keybindings: ← → per navigare, 0–9 per saltare ai moduli.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (/^[0-9]$/.test(e.key)) {
        const target = MODULES.find((m) => m.number === parseInt(e.key, 10));
        if (target) {
          e.preventDefault();
          goToSlide(target.id, 0);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, goToSlide, toggleFullscreen]);

  // Imposta il colore accent dinamico del modulo come variabile CSS.
  const rootStyle = { ['--cf2-module-accent' as never]: currentModule.accent } as React.CSSProperties;

  return (
    <div>
      <SviluppoBambinoNav />
      <div ref={rootRef} className="corso-fase2-root" style={rootStyle}>
        <div className="cf2-topbar">
          <div className="cf2-topbar__left">
            <span className="cf2-topbar__module">M{currentModule.number}</span>
            <span className="cf2-topbar__title">{currentModule.title}</span>
          </div>
          <div className="cf2-topbar__progress" aria-hidden>
            {Array.from({ length: flatPosition.total }).map((_, i) => (
              <span
                key={i}
                className={`cf2-topbar__dot ${i === flatPosition.absolute ? 'cf2-topbar__dot--active' : ''} ${i < flatPosition.absolute ? 'cf2-topbar__dot--past' : ''}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="cf2-topbar__fs"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Esci da schermo intero' : 'Schermo intero'}
            title={isFullscreen ? 'Esci da schermo intero (F)' : 'Schermo intero (F)'}
          >
            {isFullscreen ? '⤡' : '⛶'}
          </button>
        </div>

        <div className="cf2-layout">
          <Sidebar
            modules={MODULES}
            currentModuleId={currentModuleId}
            onSelect={(moduleId) => goToSlide(moduleId, 0)}
          />

          <div className="cf2-main-wrap">
            <button
              type="button"
              className="cf2-nav cf2-nav--prev"
              onClick={goPrev}
              disabled={isFirstSlideOfCourse}
              aria-label="Slide precedente"
            >
              ←
            </button>

            <main className="cf2-main" aria-live="polite">
              <SlideRenderer slide={currentSlide} />
            </main>

            <button
              type="button"
              className="cf2-nav cf2-nav--next"
              onClick={goNext}
              disabled={isLastSlideOfCourse}
              aria-label="Slide successiva"
            >
              →
            </button>
          </div>
        </div>

        <div className="cf2-controls">
          <div className="cf2-controls__dots" aria-hidden>
            {currentModule.slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`cf2-controls__dot ${i === currentSlideIndex ? 'cf2-controls__dot--active' : ''}`}
                onClick={() => goToSlide(currentModuleId, i)}
                aria-label={`Vai alla slide ${i + 1} di ${currentModule.slides.length}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
