/* PetLuxo — Hero (layout desktop, ≥ 768px)
 * Texto de HERO à esquerda; à direita, a arte em arco com a medalha "PL",
 * o cachorro e o gato. Cada um tem um botão transparente por cima: hover e
 * foco animam (estado `hover`), o clique dispara a reação (estado `act`,
 * que dura ACT_MS e remonta cachorro e gato com `key` para poder repetir; a
 * medalha reinicia a própria animação por contador, sem remontar). A faixa
 * de confiança vem logo abaixo. */

import { useEffect, useRef, useState } from 'react';
import { useHoverState } from '../../hooks/useHoverState.js';
import { Icon } from '../../icons.jsx';
import { HERO, HERO_DESKTOP, HERO_META } from '../../data/siteContent.js';
import { SectionTag } from '../ui/SectionTag.jsx';
import { Medal } from '../ui/art/Medal.jsx';
import { Dog } from '../ui/art/Dog.jsx';
import { Cat } from '../ui/art/Cat.jsx';
import { Sparkle } from '../ui/art/Sparkle.jsx';
import { useSvgId } from '../ui/art/svgId.js';
import { TrustStrip } from './TrustStrip.jsx';
import '../../styles/buttons.css';
import styles from './Hero.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

const ACT_MS = 1600;

const SPARKLES = [
  { x: 96, y: 150, r: 9, delay: 0 },
  { x: 420, y: 118, r: 7, delay: 1.1 },
  { x: 452, y: 250, r: 9, delay: 2.2 },
  { x: 64, y: 300, r: 6, delay: 1.7 },
];

const HITS = [
  { id: 'medal', className: styles.hitMedal, label: HERO_DESKTOP.medalLabel },
  { id: 'dog', className: styles.hitDog, label: HERO_DESKTOP.dogLabel },
  { id: 'cat', className: styles.hitCat, label: HERO_DESKTOP.catLabel },
];

function HeroArt() {
  const [hover, bindHover] = useHoverState();
  const [act, setAct] = useState(null);
  const [actN, setActN] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [medalKick, setMedalKick] = useState(0);
  const timer = useRef(null);
  const clip = useSvgId('heroArch');
  const glow = useSvgId('heroGlow');

  useEffect(() => () => clearTimeout(timer.current), []);

  const trigger = (id) => {
    if (id === 'medal') {
      setFlipped((f) => !f);
      setMedalKick((n) => n + 1);
      return;
    }
    setAct(id);
    setActN((n) => n + 1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAct(null), ACT_MS);
  };

  const keyFor = (id) => (act === id ? `${id}-${actN}` : id);
  const busy = (id) => hover === id || act === id;

  return (
    <div className={styles.artCol}>
      <div className={styles.art}>
        {HITS.map((h) => (
          <button
            key={h.id}
            type="button"
            className={cx(styles.hit, h.className)}
            aria-label={h.label}
            onClick={() => trigger(h.id)}
            {...bindHover(h.id)}
          />
        ))}
        <svg className={styles.artSvg} viewBox="0 0 520 650" role="img" aria-label={HERO_DESKTOP.artLabel}>
          <defs>
            <clipPath id={clip}><path d="M0 650V260A260 260 0 0 1 520 260V650Z"/></clipPath>
            <radialGradient id={glow} cx="50%" cy="30%" r="70%">
              <stop offset="0" stopColor="#F8F6F3"/>
              <stop offset="1" stopColor="#E8DED2"/>
            </radialGradient>
          </defs>
          <g clipPath={`url(#${clip})`}>
            <rect width="520" height="650" fill={`url(#${glow})`}/>
            <rect y="548" width="520" height="102" fill="#D9CBB9"/>
            <ellipse cx="260" cy="560" rx="250" ry="26" fill="#E8DED2"/>
          </g>
          <path className={styles.trail} d="M28 618C130 598 196 640 290 606S452 590 494 532" fill="none" stroke="#C6A96B" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 9"/>
          {SPARKLES.map((s) => <Sparkle key={`${s.x}-${s.y}`} {...s}/>)}
          <Medal hover={hover === 'medal'} kick={medalKick} flipped={flipped}/>
          <Dog key={keyFor('dog')} wag={busy('dog')} tilt={act === 'dog' ? 'once' : null}/>
          <Cat
            key={keyFor('cat')}
            swish={busy('cat') ? 'slow' : null}
            nod={act === 'cat' ? 'once' : null}
            blink={act === 'cat' ? 'fast' : null}
          />
        </svg>
        <span className={styles.arch} aria-hidden="true"></span>
      </div>
      <p className={styles.hint}>{HERO_DESKTOP.hint}</p>
    </div>
  );
}

export function Hero() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={cx('wrap', styles.grid)}>
          <div className={styles.text}>
            <SectionTag>{HERO.eyebrow}</SectionTag>
            <h1 id="hero-title" className={styles.title}>
              {HERO.titleStart} <em>{HERO.titleAccent}</em> {HERO.titleEnd}
            </h1>
            <p className={styles.sub}>{HERO.sub}</p>
            <div className={styles.ctaRow}>
              <a className="btn btn-primary" href="#produtos">
                {HERO_DESKTOP.cta}
                <Icon.ArrowR/>
              </a>
              <a className={styles.linkCta} href="#sobre">{HERO_DESKTOP.secondary}</a>
            </div>
            <dl className={styles.meta}>
              {HERO_META.map((m) => (
                <div key={m.k}>
                  <dt>{m.k}</dt>
                  <dd>{m.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroArt/>
        </div>
      </section>
      <TrustStrip/>
    </>
  );
}
