/* PetLuxo — ProductGallery (imagem principal + fotos adicionais da ficha completa) */

import React from 'react';
import { Icon } from '../../icons.jsx';
import styles from './ProductGallery.module.css';

function useIsMobile(breakpoint = 640) {
  const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth < breakpoint;
  const [isMobile, setIsMobile] = React.useState(getIsMobile);
  React.useEffect(() => {
    const update = () => setIsMobile(getIsMobile());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return isMobile;
}

const ArrowLeft = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16" {...p}>
    <path d="M19 12H5M11 5l-7 7 7 7" />
  </svg>
);
const ArrowRight = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16" {...p}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export function ProductGallery({ images, alt }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [zoomEnabled, setZoomEnabled] = React.useState(false);
  const [zoomPos, setZoomPos] = React.useState({ x: 50, y: 50 });
  const isMobile = useIsMobile();

  const touchStartX = React.useRef(null);
  const touchStartY = React.useRef(null);
  const dragging = React.useRef(false);

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < images.length - 1;

  function goPrev() {
    setActiveIndex((i) => Math.max(i - 1, 0));
  }

  function goNext() {
    setActiveIndex((i) => Math.min(i + 1, images.length - 1));
  }

  function onImageMouseMove(e) {
    if (!zoomEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  }

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    dragging.current = false;
  }

  function onTouchMove(e) {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // Só bloqueia scroll se arrastar mais horizontal que vertical
    if (!dragging.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      dragging.current = true;
    }
    if (dragging.current) e.preventDefault();
  }

  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dragging.current && Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      if (dx > 0) goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
    dragging.current = false;
  }

  if (images.length <= 1) {
    return (
      <div className={styles.gallery}>
        <div className={styles.mainImageWrap}>
          <img src={images[0]} alt={alt} className={styles.mainImage} />
        </div>
      </div>
    );
  }

  const NavArrows = (
    <>
      <button
        type="button"
        className={[styles.navArrow, styles.navArrowLeft].join(' ')}
        onClick={goPrev}
        disabled={!canPrev}
        aria-label="Foto anterior"
      >
        <ArrowLeft />
      </button>
      <button
        type="button"
        className={[styles.navArrow, styles.navArrowRight].join(' ')}
        onClick={goNext}
        disabled={!canNext}
        aria-label="Próxima foto"
      >
        <ArrowRight />
      </button>
    </>
  );

  if (isMobile) {
    return (
      <div className={styles.gallery}>
        <div className={styles.stage}>
          <div
            className={styles.mobileViewport}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className={styles.mobileTrack}
              style={{
                width: `${images.length * 100}%`,
                transform: `translateX(-${(activeIndex / images.length) * 100}%)`,
              }}
            >
              {images.map((src, i) => (
                <div key={src} className={styles.mobileSlide} style={{ width: `${100 / images.length}%` }}>
                  <img src={src} alt={`${alt} — foto ${i + 1}`} className={styles.mainImage} loading={i === 0 ? undefined : 'lazy'} />
                </div>
              ))}
            </div>
          </div>
          {NavArrows}
        </div>
        <div className={styles.dots}>
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={[styles.dot, i === activeIndex && styles.dotActive].filter(Boolean).join(' ')}
              onClick={() => setActiveIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={[styles.gallery, styles.galleryWithThumbs].join(' ')}>
      <div className={styles.thumbs}>
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className={[styles.thumb, i === activeIndex && styles.thumbActive].filter(Boolean).join(' ')}
            onClick={() => setActiveIndex(i)}
            aria-label={`Ver foto ${i + 1}`}
            aria-current={i === activeIndex ? 'true' : undefined}
          >
            <img src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      <div className={styles.stage}>
        <div
          className={[styles.mainImageWrap, zoomEnabled && styles.mainImageWrapZoomActive].filter(Boolean).join(' ')}
          onMouseMove={onImageMouseMove}
        >
          <img src={images[activeIndex]} alt={`${alt} — foto ${activeIndex + 1}`} className={styles.mainImage} />
          <div
            className={styles.zoomOverlay}
            style={{
              backgroundImage: `url(${images[activeIndex]})`,
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
            }}
          />
          <button
            type="button"
            className={[styles.zoomBadge, zoomEnabled && styles.zoomBadgeActive].filter(Boolean).join(' ')}
            onClick={() => setZoomEnabled((z) => !z)}
            aria-pressed={zoomEnabled}
            aria-label={zoomEnabled ? 'Desativar zoom da imagem' : 'Ativar zoom da imagem'}
          >
            <Icon.Search width="14" height="14" />
          </button>
        </div>
        {NavArrows}
      </div>
    </div>
  );
}
