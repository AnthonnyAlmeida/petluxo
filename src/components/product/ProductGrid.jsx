/* PetLuxo — ProductGrid (carrossel do layout desktop)
 * perView 1 (< 640px), 2 (< 1024px), 3; trilha com translateX; swipe com
 * limiar de 50px. Cabeçalho com o título e os pontos de página; setas nas
 * laterais. Com poucos produtos (≤ perView), os cards ficam centralizados
 * sem controles. A geometria vai para o CSS por variáveis (--n, --pv, --i). */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { ProductCard } from './ProductCard.jsx';
import styles from './ProductGrid.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

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

/* `titleAs`: nível do título do carrossel (h3 sob o h2 da home; h2 sob o h1 de /produtos). */
export function ProductGrid({ products, resetKey, title, titleAs: Title = 'h3' }) {
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
  const few = products.length <= perView;

  /* Tab/foco num card fora da página atual: o navegador rolaria o viewport
   * (overflow hidden) e desalinharia a trilha. Vai para a página do item e
   * zera o scroll do viewport; o movimento passa a ser só o do translateX. */
  const viewportRef = React.useRef(null);

  function onItemFocus(i) {
    if (few) return;
    setIndex(Math.min(Math.floor(i / perView), totalPages - 1));
    const vp = viewportRef.current;
    if (vp) vp.scrollLeft = 0;
  }

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

  return (
    <div className={styles.carousel}>
      <div className={styles.head}>
        {title && <Title className={styles.title}>{title}</Title>}
        {showControls && (
          <div className={styles.dots}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                className={styles.dot}
                onClick={() => setIndex(i)}
                aria-label={`Página ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
              >
                <span className={cx(styles.dotBar, i === index && styles.dotBarOn)}></span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.row}>
        {showControls && (
          <button
            type="button"
            className={styles.arrow}
            onClick={() => setIndex(i => i - 1)}
            disabled={!canPrev}
            aria-label="Anterior"
          ><Icon.ArrowL/></button>
        )}
        <div
          ref={viewportRef}
          className={styles.viewport}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className={cx(styles.track, few && styles.trackFew)}
            style={{ '--n': products.length, '--pv': perView, '--i': index }}
          >
            {products.map((p, i) => (
              <div key={p.id} className={styles.item} onFocus={() => onItemFocus(i)}>
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </div>
        {showControls && (
          <button
            type="button"
            className={styles.arrow}
            onClick={() => setIndex(i => i + 1)}
            disabled={!canNext}
            aria-label="Próximo"
          ><Icon.ArrowR/></button>
        )}
      </div>
    </div>
  );
}
