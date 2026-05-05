/* PetLuxo — ProductGrid (Carousel) */

import React from 'react';
import { ProductCard } from './ProductCard.jsx';

function usePerView() {
  const getPerView = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };
  const [perView, setPerView] = React.useState(getPerView);
  React.useEffect(() => {
    const update = () => setPerView(getPerView());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return perView;
}

export function ProductGrid({ products, onQuick, resetKey, title }) {
  const perView = usePerView();
  const totalPages = Math.ceil(products.length / perView);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => { setIndex(0); }, [resetKey]);
  React.useEffect(() => {
    setIndex(prev => Math.min(prev, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  const canPrev = index > 0;
  const canNext = index < totalPages - 1;
  const showControls = totalPages > 1;

  // Touch / swipe
  const touchStartX = React.useRef(null);
  const touchStartY = React.useRef(null);
  const dragging = React.useRef(false);

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
      if (dx < 0 && canNext) setIndex(i => i + 1);
      if (dx > 0 && canPrev) setIndex(i => i - 1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
    dragging.current = false;
  }

  const ArrowLeft = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="16" height="16">
      <path d="M19 12H5M11 5l-7 7 7 7"/>
    </svg>
  );
  const ArrowRight = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="16" height="16">
      <path d="M5 12h14M13 5l7 7-7 7"/>
    </svg>
  );

  return (
    <div className={`carousel${products.length < perView ? ' carousel--single' : ''}`}>
      {title && <h3 className="carousel-title">{title}</h3>}
      <div className="carousel-outer">
        {showControls && (
          <button
            className="carousel-arrow carousel-arrow-side carousel-arrow-side--prev"
            onClick={() => setIndex(i => i - 1)}
            disabled={!canPrev}
            aria-label="Anterior"
          >{ArrowLeft}</button>
        )}
        <div
          className="carousel-viewport"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="carousel-track"
            style={{
              width: `${(products.length / perView) * 100}%`,
              transform: `translateX(-${(index * perView / products.length) * 100}%)`,
            }}
          >
            {products.map((p, i) => (
              <div
                key={p.id}
                className="carousel-item"
                style={{ width: `${100 / products.length}%` }}
              >
                <ProductCard product={p} index={i} onQuick={onQuick} />
              </div>
            ))}
          </div>
        </div>
        {showControls && (
          <button
            className="carousel-arrow carousel-arrow-side carousel-arrow-side--next"
            onClick={() => setIndex(i => i + 1)}
            disabled={!canNext}
            aria-label="Próximo"
          >{ArrowRight}</button>
        )}
      </div>
      {showControls && (
        <div className="carousel-controls">
          <button
            className="carousel-arrow"
            onClick={() => setIndex(i => i - 1)}
            disabled={!canPrev}
            aria-label="Anterior"
          >{ArrowLeft}</button>
          <div className="carousel-dots">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === index ? ' active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Página ${i + 1}`}
              />
            ))}
          </div>
          <button
            className="carousel-arrow"
            onClick={() => setIndex(i => i + 1)}
            disabled={!canNext}
            aria-label="Próximo"
          >{ArrowRight}</button>
        </div>
      )}
    </div>
  );
}
