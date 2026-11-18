/* PetLuxo — DifferentialsScene
 * Os 4 diferenciais do site como stories. O avanço automático acontece no
 * fim da animação de 5s da barra ativa (animationend), então pausar a barra
 * pausa o avanço: fica pausado quando a cena sai da tela
 * (IntersectionObserver), quando a aba fica oculta e com
 * prefers-reduced-motion. Toque na lateral esquerda (35%) volta; no resto,
 * avança. Os 4 textos ficam no DOM (os inativos com `hidden`). */

import { useEffect, useRef, useState } from 'react';
import { MIcon } from '../MobileIcons.jsx';
import { DIFFERENTIALS, DIFFERENTIALS_TAG } from '../../../data/siteContent.js';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery.js';
import ui from '../ui/MobileUI.module.css';
import styles from './DifferentialsScene.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');
const N = DIFFERENTIALS.length;
const d = (s) => ({ '--d': s });

const ICONS = [
  // 01 — diamante: qualidade
  () => (
    <svg viewBox="0 0 120 120" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path className={styles.mDiffDraw} d="M34 30 H86 L104 54 L60 100 L16 54 Z"/>
      <path className={styles.mDiffDraw} style={d('0.3s')} d="M16 54 H104"/>
      <path className={styles.mDiffDraw} style={d('0.4s')} d="M34 30 L44 54 L60 100 L76 54 L86 30"/>
      <path className={styles.mDiffDraw} style={d('0.5s')} d="M44 54 L60 30 L76 54"/>
      <g className={styles.mDiffTwinkle}><path d="M102 8 V24 M94 16 H110"/></g>
      <g className={styles.mDiffTwinkle} style={{ animationDelay: '0.9s' }}><path d="M16 18 V28 M11 23 H21"/></g>
    </svg>
  ),
  // 02 — balão com pata: atendimento
  () => (
    <svg viewBox="0 0 120 120" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path className={styles.mDiffDraw} d="M26 24 H94 Q106 24 106 36 V70 Q106 82 94 82 H58 L38 100 V82 H26 Q14 82 14 70 V36 Q14 24 26 24 Z"/>
      <g className={styles.mDiffBounce}>
        <path className={styles.mDiffDraw} style={d('0.5s')} d="M60 58 C52 58 48 65 53 68 C56 70 64 70 67 68 C72 65 68 58 60 58 Z"/>
        <circle className={styles.mDiffDraw} style={d('0.7s')} cx="48" cy="49" r="4"/>
        <circle className={styles.mDiffDraw} style={d('0.8s')} cx="55" cy="42" r="4"/>
        <circle className={styles.mDiffDraw} style={d('0.9s')} cx="65" cy="42" r="4"/>
        <circle className={styles.mDiffDraw} style={d('1s')} cx="72" cy="49" r="4"/>
      </g>
    </svg>
  ),
  // 03 — caixa: entrega
  () => (
    <svg viewBox="0 0 120 120" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path className={styles.mDiffDraw} d="M60 14 L102 34 V78 L60 98 L18 78 V34 Z"/>
      <path className={styles.mDiffDraw} style={d('0.3s')} d="M18 34 L60 54 L102 34"/>
      <path className={styles.mDiffDraw} style={d('0.4s')} d="M60 54 V98"/>
      <path className={styles.mDiffDraw} style={d('0.6s')} d="M39 24 L81 44"/>
      <path className={styles.mDiffFlow} d="M10 110 H110"/>
    </svg>
  ),
  // 04 — estrela: curadoria
  () => (
    <svg viewBox="0 0 120 120" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <g className={styles.mDiffSpin}>
        <path className={styles.mDiffDraw} d="M104 60 L78.5 67.7 L91.1 91.1 L67.7 78.5 L60 104 L52.3 78.5 L28.9 91.1 L41.5 67.7 L16 60 L41.5 52.3 L28.9 28.9 L52.3 41.5 L60 16 L67.7 41.5 L91.1 28.9 L78.5 52.3 Z"/>
      </g>
      <circle className={styles.mDiffDraw} style={d('0.6s')} cx="60" cy="60" r="9"/>
      <circle className={styles.mDiffDraw} style={d('0.8s')} cx="60" cy="60" r="52" strokeOpacity="0.4"/>
    </svg>
  ),
];

export function DifferentialsScene() {
  const [story, setStory] = useState(0);
  const [run, setRun] = useState(0); // reinicia a barra ativa a cada navegação
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const go = (n) => {
    setStory(((n % N) + N) % N);
    setRun((r) => r + 1);
  };

  const playing = inView && pageVisible && !reduced;

  const onTap = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const left = (e.clientX - r.left) / r.width < 0.35;
    go(story + (left ? -1 : 1));
  };

  return (
    <section
      ref={sectionRef}
      className={cx(styles.mDiff, !playing && styles.mDiffPaused)}
      aria-labelledby="m-diff-title"
      aria-roledescription="carrossel"
    >
      <div className={styles.mDiffTap} onClick={onTap} aria-hidden="true"></div>

      <div className={styles.mDiffSegs} aria-hidden="true">
        {DIFFERENTIALS.map((item, i) => (
          <div key={item.num} className={styles.mDiffSeg}>
            <span
              key={i === story ? `run-${run}` : 'idle'}
              className={cx(
                styles.mDiffSegFill,
                i < story && styles.mDiffSegDone,
                i === story && styles.mDiffSegRun
              )}
              onAnimationEnd={i === story ? () => go(story + 1) : undefined}
            ></span>
          </div>
        ))}
      </div>

      <h2 id="m-diff-title" className={cx(ui.mEyebrow, styles.mDiffTag)}>
        <span className={ui.mEyebrowDot} aria-hidden="true"></span>
        {DIFFERENTIALS_TAG}
      </h2>

      <div className={styles.mDiffSlides}>
        {DIFFERENTIALS.map((item, i) => {
          const Ico = ICONS[i % ICONS.length];
          const active = i === story;
          return (
            <article
              key={item.num}
              className={styles.mDiffSlide}
              hidden={!active}
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${N}`}
            >
              <div className={styles.mDiffIco}>{active && <Ico key={run}/>}</div>
              <div className={styles.mDiffNum}>{item.num} / {String(N).padStart(2, '0')}</div>
              <h3 className={styles.mDiffTitle}>{item.title}</h3>
              <p className={styles.mDiffBody}>{item.body}</p>
            </article>
          );
        })}
      </div>

      <div className={styles.mDiffNav}>
        <button type="button" className={cx(styles.mDiffBtn, styles.mDiffPrev)} aria-label="Motivo anterior" onClick={() => go(story - 1)}>
          <MIcon.ArrowLeft size={20}/>
        </button>
        <span className={styles.mDiffHint} aria-hidden="true">Toque para avançar</span>
        <button type="button" className={cx(styles.mDiffBtn, styles.mDiffNext)} aria-label="Próximo motivo" onClick={() => go(story + 1)}>
          <MIcon.ArrowRight size={20}/>
        </button>
      </div>
    </section>
  );
}
