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

export function ProductGrid({ products, onQuick, resetKey }) {
  const perView = usePerView();
  const totalPages = Math.ceil(products.length / perView);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => { setIndex(0); }, [resetKey]);
  React.useEffect(() => {
    setIndex(prev => Math.min(prev, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  const canPrev = index > 0;
  const canNext = index < totalPages - 1;

  return (
    <div className="carousel">
      <div className="carousel-outer">
        <div className="carousel-viewport">
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
      </div>
      <div className="carousel-controls">
        <button
          className="carousel-arrow"
          onClick={() => setIndex(i => i - 1)}
          disabled={!canPrev}
          aria-label="Anterior"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="16" height="16">
            <path d="M19 12H5M11 5l-7 7 7 7"/>
          </svg>
        </button>
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
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="16" height="16">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
