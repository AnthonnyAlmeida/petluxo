/* PetLuxo — ProductGallery (galeria da ficha, layout desktop)
 * ≥ 640px: miniaturas na vertical à esquerda, foto principal 5:4 com setas,
 * contador e zoom por hover (escala 1.35 a partir do ponto do cursor) em
 * ponteiro fino. Em toque (pointer: coarse), o toque na foto abre o
 * lightbox (React.lazy). < 640px: carrossel arrastável com pontos (na prática
 * só alcançável abaixo de 768px, onde a ficha mobile assume). */

import React from 'react';
import { Icon } from '../../icons.jsx';
import styles from './ProductGallery.module.css';

const ProductLightbox = React.lazy(() => import('./ProductLightbox.jsx'));

const cx = (...c) => c.filter(Boolean).join(' ');

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

// Sinal moderno para "o input primário é touch" — independente do
// breakpoint de largura acima (que só decide layout: miniaturas vs
// carrossel). Um tablet/notebook touch em paisagem pode ter isMobile=false
// e isTouch=true; uma janela desktop estreitada com mouse pode ter
// isMobile=true e isTouch=false.
function usePointerCoarse() {
  const getIsCoarse = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const [isCoarse, setIsCoarse] = React.useState(getIsCoarse);
  React.useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
    const update = () => setIsCoarse(mql.matches);
    if (mql.addEventListener) mql.addEventListener('change', update);
    else mql.addListener(update);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', update);
      else mql.removeListener(update);
    };
  }, []);
  return isCoarse;
}

const clamp = (v) => Math.min(100, Math.max(0, v));

export function ProductGallery({ images, alt }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [zoom, setZoom] = React.useState(null);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);
  const isMobile = useIsMobile();
  const isTouch = usePointerCoarse();

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

  function openLightbox(i) {
    setLightboxIndex(i);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function handleLightboxIndexChange(i) {
    setLightboxIndex(i);
    setActiveIndex(i);
  }

  /* Zoom por hover: só com ponteiro fino; a origem acompanha o cursor. */
  function onZoomMove(e) {
    if (isTouch) return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: clamp(((e.clientX - r.left) / r.width) * 100),
      y: clamp(((e.clientY - r.top) / r.height) * 100),
    });
  }

  function onZoomLeave() {
    setZoom(null);
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
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    if (dragging.current && Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      if (dx > 0) goPrev();
    } else if (isTouch && !dragging.current && Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      // Deslocamento desprezível em ambos os eixos = toque real, não swipe
      // nem scroll vertical da página com o dedo sobre a imagem.
      openLightbox(activeIndex);
    }

    touchStartX.current = null;
    touchStartY.current = null;
    dragging.current = false;
  }

  const LightboxPortal = isTouch && (
    <React.Suspense fallback={null}>
      <ProductLightbox
        open={lightboxOpen}
        close={closeLightbox}
        images={images}
        index={lightboxIndex}
        alt={alt}
        onIndexChange={handleLightboxIndexChange}
      />
    </React.Suspense>
  );

  const mainImage = (index, imgAlt) => (
    <div
      className={cx(styles.mainImageWrap, !isTouch && styles.zoomable, zoom && styles.zoomOn)}
      style={zoom ? { '--zx': `${zoom.x}%`, '--zy': `${zoom.y}%` } : undefined}
      onMouseMove={onZoomMove}
      onMouseLeave={onZoomLeave}
      onClick={isTouch ? () => openLightbox(index) : undefined}
      onKeyDown={isTouch ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      } : undefined}
      role={isTouch ? 'button' : undefined}
      tabIndex={isTouch ? 0 : undefined}
      aria-label={isTouch ? 'Ampliar foto' : undefined}
    >
      <img src={images[index]} alt={imgAlt} className={styles.mainImage} />
    </div>
  );

  let content;

  if (images.length <= 1) {
    content = (
      <div className={styles.gallery}>
        <div className={styles.stage}>{mainImage(0, alt)}</div>
      </div>
    );
  } else {
    const NavArrows = (
      <>
        <button
          type="button"
          className={cx(styles.navArrow, styles.navArrowLeft)}
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Foto anterior"
        >
          <Icon.ArrowL />
        </button>
        <button
          type="button"
          className={cx(styles.navArrow, styles.navArrowRight)}
          onClick={goNext}
          disabled={!canNext}
          aria-label="Próxima foto"
        >
          <Icon.ArrowR />
        </button>
      </>
    );

    if (isMobile) {
      content = (
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
                style={{ '--n': images.length, '--i': activeIndex }}
              >
                {images.map((src, i) => (
                  <div key={src} className={styles.mobileSlide}>
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
                className={cx(styles.dot, i === activeIndex && styles.dotActive)}
                onClick={() => setActiveIndex(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      );
    } else {
      content = (
        <div className={cx(styles.gallery, styles.galleryWithThumbs)}>
          <div className={styles.thumbs}>
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                className={cx(styles.thumb, i === activeIndex && styles.thumbActive)}
                onClick={() => setActiveIndex(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === activeIndex ? 'true' : undefined}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
          <div className={styles.stage}>
            {mainImage(activeIndex, `${alt} — foto ${activeIndex + 1}`)}
            {NavArrows}
            <span className={styles.counter} aria-hidden="true">{activeIndex + 1} / {images.length}</span>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      {content}
      {LightboxPortal}
    </>
  );
}
