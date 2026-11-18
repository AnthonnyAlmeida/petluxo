/* PetLuxo — MobileHome
 * Home do layout mobile (< 768px): hero (medalha), Destaque, Sobre nós,
 * Diferenciais e Dúvidas, mais o rodapé, no MESMO container rolável, com
 * altura da área útil (100dvh menos a barra inferior) e
 * scroll-snap-type: y proximity. Todo o conteúdo fica no DOM.
 *
 * Trilha dourada: uma linha na borda direita que se desenha conforme o
 * progresso de rolagem do container (stroke-dashoffset), com um marcador.
 * A rolagem atualiza o SVG direto no DOM, sem re-render. */

import { useCallback, useEffect, useRef, useState } from 'react';
import { MobileHero } from './MobileHero.jsx';
import { FeaturedScene } from './FeaturedScene.jsx';
import { AboutScene } from './AboutScene.jsx';
import { DifferentialsScene } from './DifferentialsScene.jsx';
import { FaqScene } from './FaqScene.jsx';
import { MobileFooter } from '../layout/MobileFooter.jsx';
import { MobileTabBar } from '../layout/MobileTabBar.jsx';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery.js';
import styles from './MobileHome.module.css';

const DESIGN_H = 760; // altura da área útil no artboard (844 − 84)
const TRAIL_LEN = 720;

/* curva da trilha do design (artboard de 760px), escalada para a altura real */
function trailPath(h) {
  const k = h / DESIGN_H;
  const y = (v) => Math.round(v * k * 10) / 10;
  return `M374 ${y(40)} C378 ${y(110)} 370 ${y(170)} 374 ${y(230)} S378 ${y(350)} 374 ${y(410)} S370 ${y(530)} 374 ${y(590)} S378 ${y(680)} 374 ${y(740)}`;
}

export default function MobileHome() {
  const pagerRef = useRef(null);
  const pathRef = useRef(null);
  const markerRef = useRef(null);
  const frame = useRef(0);
  const [height, setHeight] = useState(DESIGN_H);
  const reduced = usePrefersReducedMotion();

  const paint = useCallback(() => {
    const el = pagerRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const p = max > 0 ? Math.max(0, Math.min(1, el.scrollTop / max)) : 0;
    const k = el.clientHeight / DESIGN_H;
    pathRef.current?.setAttribute('stroke-dashoffset', String(Math.round(TRAIL_LEN * (1 - p))));
    markerRef.current?.setAttribute('transform', `translate(374 ${Math.round((40 + p * 700) * k)})`);
  }, []);

  useEffect(() => {
    const el = pagerRef.current;
    if (!el) return undefined;
    const onScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(paint);
    };
    el.addEventListener('scroll', onScroll, { passive: true });

    let ro;
    const measure = () => {
      setHeight(el.clientHeight || DESIGN_H);
      paint();
    };
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
      // o conteúdo muda de altura (ex.: "Ler mais"): refaz o progresso
      Array.from(el.children).forEach((child) => ro.observe(child));
    } else {
      window.addEventListener('resize', measure);
    }
    measure();

    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame.current);
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', measure);
    };
  }, [paint]);

  /* Logo e "Início" na própria home: voltam ao topo do container. */
  const toTop = useCallback((e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    pagerRef.current?.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }, [reduced]);

  return (
    <>
      <div className={styles.mHome}>
        <div ref={pagerRef} className={styles.mPager}>
          <main className={styles.mPagerMain}>
            <MobileHero onBrandClick={toTop}/>
            <FeaturedScene/>
            <AboutScene/>
            <DifferentialsScene/>
            <FaqScene/>
          </main>
          <MobileFooter/>
        </div>

        <svg className={styles.mTrail} viewBox={`358 0 32 ${height}`} preserveAspectRatio="xMaxYMin meet" aria-hidden="true" focusable="false">
          <path
            ref={pathRef}
            d={trailPath(height)}
            fill="none"
            stroke="#C6A96B"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeOpacity="0.9"
            pathLength={TRAIL_LEN}
            strokeDasharray={TRAIL_LEN}
            strokeDashoffset={TRAIL_LEN}
          />
          <g ref={markerRef} transform={`translate(374 ${Math.round(40 * height / DESIGN_H)})`}>
            <circle className={styles.mTrailHalo} r="5" fill="#C6A96B"/>
            <circle r="4.5" fill="#F8F6F3" stroke="#C6A96B" strokeWidth="1.6"/>
          </g>
        </svg>
      </div>
      <MobileTabBar onHomeClick={toTop}/>
    </>
  );
}
