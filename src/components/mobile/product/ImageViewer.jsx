/* PetLuxo — ImageViewer
 * Visualizador de fotos em tela cheia (role="dialog", aria-modal, foco
 * preso, Esc fecha). Toque na foto alterna entre ajustada à tela e 220%,
 * centralizada no ponto tocado; ampliada, a foto rola com o dedo. A pinça
 * do navegador também funciona (touch-action: pinch-zoom). */

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MIcon } from '../MobileIcons.jsx';
import { useModalFocus } from '../../../hooks/useModalFocus.js';
import styles from './MobileProduct.module.css';

const ZOOM = 2.2;

export function ImageViewer({ images, index, onIndex, onClose, alt }) {
  const [zoomed, setZoomed] = useState(false);
  const focus = useRef({ x: 0.5, y: 0.5 });
  const scroller = useRef(null);
  const panelRef = useModalFocus(true, onClose);
  const total = images.length;

  useEffect(() => setZoomed(false), [index]);

  /* ao ampliar, leva o ponto tocado para o centro da tela */
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (zoomed) {
      el.scrollLeft = focus.current.x * el.clientWidth * ZOOM - el.clientWidth / 2;
      el.scrollTop = focus.current.y * el.clientHeight * ZOOM - el.clientHeight / 2;
    } else {
      el.scrollLeft = 0;
      el.scrollTop = 0;
    }
  }, [zoomed]);

  const toggle = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    focus.current = {
      x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
    };
    setZoomed((z) => !z);
  };

  const go = (d) => onIndex((index + d + total) % total);

  return createPortal(
    <div className={styles.mViewer}>
      <div ref={panelRef} className={styles.mViewerPanel} role="dialog" aria-modal="true" aria-label={`${alt}, foto ${index + 1} de ${total}`} tabIndex={-1}>
        <div ref={scroller} className={styles.mViewerPanel}>
          <div className={[styles.mViewerFrame, zoomed && styles.mViewerFrameZoomed].filter(Boolean).join(' ')} onClick={toggle}>
            <img className={styles.mViewerImg} src={images[index]} alt={`${alt}, ampliada`} draggable="false"/>
          </div>
        </div>
        <button type="button" className={styles.mViewerClose} aria-label="Fechar" onClick={onClose}>
          <MIcon.Close size={20}/>
        </button>
        {total > 1 && (
          <>
            <button type="button" className={[styles.mViewerNav, styles.mViewerPrev].join(' ')} aria-label="Foto anterior" onClick={() => go(-1)}>
              <MIcon.ArrowLeft size={20}/>
            </button>
            <button type="button" className={[styles.mViewerNav, styles.mViewerNext].join(' ')} aria-label="Próxima foto" onClick={() => go(1)}>
              <MIcon.ArrowRight size={20}/>
            </button>
          </>
        )}
        <p className={styles.mViewerHint} aria-hidden="true">Toque para ampliar</p>
      </div>
    </div>,
    document.body
  );
}
