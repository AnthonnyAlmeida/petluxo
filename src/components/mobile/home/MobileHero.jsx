/* PetLuxo — MobileHero
 * Hero da home mobile: medalha de coleira em ouro pendurada numa corrente.
 * Balança sempre; o toque a faz balançar mais forte (alternando o sentido),
 * ela inclina para o lado do dedo e o brilho atravessa o metal. Coordenadas
 * do ponteiro relativas ao elemento; touch-action: pan-y não bloqueia a
 * rolagem vertical. */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MobileHeader } from '../layout/MobileHeader.jsx';
import { MIcon } from '../MobileIcons.jsx';
import { HERO } from '../../../data/siteContent.js';
import ui from '../ui/MobileUI.module.css';
import styles from './MobileHero.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

function leanFrom(e) {
  const r = e.currentTarget.getBoundingClientRect();
  if (!r.width) return 0;
  const v = ((e.clientX - r.left) / r.width - 0.5) * 2;
  return Math.round(Math.max(-1, Math.min(1, v)) * 100) / 100;
}

function Medal({ kickClass }) {
  return (
    <svg className={styles.mHeroSvg} viewBox="0 0 372 320" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="plMedalGold" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#F1E3B8"/>
          <stop offset="0.35" stopColor="#D4BC85"/>
          <stop offset="0.7" stopColor="#B8995A"/>
          <stop offset="1" stopColor="#9E8148"/>
        </linearGradient>
        <linearGradient id="plMedalShine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0"/>
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.75"/>
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0"/>
        </linearGradient>
        <clipPath id="plMedalDisc"><circle cx="0" cy="104" r="62"/></clipPath>
      </defs>

      {/* anéis finos e ponto em órbita */}
      <circle cx="186" cy="176" r="150" fill="none" stroke="#C6A96B" strokeOpacity="0.38" strokeWidth="1"/>
      <circle cx="186" cy="176" r="118" fill="none" stroke="#C6A96B" strokeOpacity="0.24" strokeWidth="1"/>
      <g className={styles.mMedalOrbit}><circle cx="186" cy="26" r="3" fill="#C6A96B"/></g>

      {/* corrente: dois fios pontilhados que descem até o argolão */}
      <path d="M-6 8 C66 30 140 66 177 94" fill="none" stroke="#C6A96B" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.1 5"/>
      <path d="M378 8 C306 30 232 66 195 94" fill="none" stroke="#C6A96B" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.1 5"/>
      <ellipse cx="186" cy="296" rx="58" ry="4" fill="#B08968" fillOpacity="0.16"/>

      {/* medalha: g externo inclina para o dedo; g interno balança */}
      <g className={styles.mMedalLean}>
        <g className={cx(styles.mMedalSwing, kickClass)}>
          <g className={styles.mMedalDrop}>
            <circle cx="186" cy="96" r="9" fill="none" stroke="url(#plMedalGold)" strokeWidth="2.4"/>
            <circle cx="186" cy="112" r="6" fill="none" stroke="url(#plMedalGold)" strokeWidth="2.2"/>
            <circle cx="186" cy="176" r="62" fill="url(#plMedalGold)"/>
            <circle cx="186" cy="176" r="62" fill="none" stroke="#F6EBC8" strokeOpacity="0.8" strokeWidth="1"/>
            <circle cx="186" cy="176" r="54" fill="none" stroke="#7A6232" strokeOpacity="0.55" strokeWidth="0.9"/>
            <circle cx="186" cy="176" r="50" fill="none" stroke="#F6EBC8" strokeOpacity="0.6" strokeWidth="0.6"/>

            {/* monograma gravado */}
            <text x="187" y="195" textAnchor="middle" fill="#F6EBC8" fillOpacity="0.75" className={styles.mHeroP}>P</text>
            <text x="186" y="194" textAnchor="middle" fill="#6E5829" className={styles.mHeroP}>P</text>
            <text x="186" y="226" textAnchor="middle" fill="#6E5829" fillOpacity="0.85" className={styles.mHeroBrand}>PETLUXO</text>

            {/* brilho que atravessa o metal */}
            <g clipPath="url(#plMedalDisc)" transform="translate(186 72)">
              <rect className={styles.mMedalShine} x="-120" y="0" width="46" height="208" fill="url(#plMedalShine)" transform="skewX(-18)"/>
            </g>
          </g>
        </g>
      </g>

      {/* faíscas discretas */}
      <g className={styles.mMedalSpark}>
        <path d="M270 118 V138 M260 128 H280" fill="none" stroke="#D4BC85" strokeWidth="1.2" strokeLinecap="round"/>
      </g>
      <g className={cx(styles.mMedalSpark, styles.mMedalSparkLate)}>
        <path d="M96 232 V244 M90 238 H102" fill="none" stroke="#D4BC85" strokeWidth="1.2" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

export function MobileHero({ onBrandClick }) {
  const [tx, setTx] = useState(0);
  const [kick, setKick] = useState(0);
  const [kickOn, setKickOn] = useState(false);
  const [touched, setTouched] = useState(false);
  const kickTimer = useRef(null);
  const resetTimer = useRef(null);

  useEffect(() => () => {
    clearTimeout(kickTimer.current);
    clearTimeout(resetTimer.current);
  }, []);

  const swing = (lean) => {
    setTx(lean);
    setTouched(true);
    setKick((k) => k + 1);
    setKickOn(true);
    clearTimeout(kickTimer.current);
    kickTimer.current = setTimeout(() => setKickOn(false), 3000);
  };

  const release = () => {
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setTx(0), 900);
  };

  const onPointerMove = (e) => {
    clearTimeout(resetTimer.current);
    setTx(leanFrom(e));
  };

  const onPointerDown = (e) => swing(leanFrom(e));

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      swing(0);
    }
  };

  const kickClass = kickOn ? (kick % 2 ? styles.mMedalK1 : styles.mMedalK2) : '';

  return (
    <section className={styles.mHero} aria-labelledby="m-hero-title">
      <MobileHeader onBrandClick={onBrandClick}/>
      <div className={styles.mHeroMain}>
        <p className={cx(ui.mEyebrow, styles.mHeroEyebrow)}>
          <span className={ui.mEyebrowDot} aria-hidden="true"></span>
          <span>{HERO.eyebrow}</span>
        </p>

        <h1 id="m-hero-title" className={styles.mHeroTitle}>
          {HERO.titleStart} <em>{HERO.titleAccent}</em> {HERO.titleEnd}
        </h1>

        <p className={styles.mHeroSub}>{HERO.sub}</p>

        <div className={styles.mHeroStage}>
          <div
            className={styles.mHeroArt}
            style={{ '--tx': tx }}
            role="button"
            tabIndex={0}
            aria-label="Balançar a medalha PetLuxo"
            onPointerMove={onPointerMove}
            onPointerDown={onPointerDown}
            onPointerUp={release}
            onPointerLeave={release}
            onPointerCancel={release}
            onKeyDown={onKeyDown}
          >
            <Medal kickClass={kickClass}/>
          </div>

          {!touched && (
            <p className={styles.mHeroHint}>
              <MIcon.Tap/>
              Toque na medalha
            </p>
          )}
        </div>

        <Link to="/produtos" className={cx(ui.mBtn, ui.mBtnPrimary, ui.mBtnShadow, styles.mHeroCta)}>
          Ver produtos
          <MIcon.ArrowRight/>
        </Link>
      </div>
    </section>
  );
}
