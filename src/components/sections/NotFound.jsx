/* PetLuxo — Página 404 (layout desktop)
 * "4 [medalha] 4": a medalha balança no lugar do zero e, no clique, vira
 * (patinha ↔ "?"); um gato sentado ao lado. Textos atuais em
 * NOT_FOUND_TEXT, botões para a home e para /produtos.
 * NotFoundPage: abaixo de 768px a tela mobile; acima, MinimalNavbar +
 * NotFound + Footer. */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MinimalNavbar } from '../layout/MinimalNavbar.jsx';
import { Footer } from '../layout/Footer.jsx';
import { useIsMobile } from '../../hooks/useMediaQuery.js';
import { MobileNotFound } from '../mobile/notfound/MobileNotFound.jsx';
import { NOT_FOUND_TEXT } from '../../data/siteContent.js';
import { useSvgId } from '../ui/art/svgId.js';
import '../../styles/buttons.css';
import art from '../ui/art/art.module.css';
import styles from './NotFound.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

function NotFoundArt() {
  const [flipped, setFlipped] = useState(false);
  const gold = useSvgId('nfGold');

  return (
    <div className={cx(styles.art, flipped && styles.flipped)}>
      <button
        type="button"
        className={styles.hit}
        aria-label={NOT_FOUND_TEXT.medalLabel}
        aria-pressed={flipped}
        onClick={() => setFlipped((f) => !f)}
      />
      <svg className={styles.artSvg} viewBox="0 0 640 290" role="img" aria-label={NOT_FOUND_TEXT.artLabel}>
        <defs>
          <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" className={art.stopLight}/>
            <stop offset=".5" stopColor="#C6A96B"/>
            <stop offset="1" stopColor="#B08968"/>
          </linearGradient>
        </defs>
        <text x="40" y="250" className={styles.digit} fill={`url(#${gold})`}>4</text>
        <text x="372" y="250" className={styles.digit} fill={`url(#${gold})`}>4</text>
        <g className={styles.sway}>
          <line x1="320" y1="0" x2="320" y2="62" stroke="#C6A96B" strokeWidth="2"/>
          <g className={styles.flip}>
            <circle cx="320" cy="152" r="92" fill={`url(#${gold})`}/>
            <circle cx="320" cy="152" r="78" fill="none" stroke="#F8F6F3" strokeOpacity=".7" strokeWidth="1.5"/>
            <circle cx="320" cy="152" r="70" fill="#F8F6F3" fillOpacity=".14"/>
            <circle cx="320" cy="62" r="7" fill="none" stroke="#B08968" strokeWidth="2.5"/>
            <g className={styles.faceA} fill="#6B1E2B">
              <ellipse cx="320" cy="170" rx="24" ry="19"/>
              <ellipse cx="288" cy="140" rx="9" ry="12" transform="rotate(-18 288 140)"/>
              <ellipse cx="308" cy="124" rx="9" ry="13"/>
              <ellipse cx="332" cy="124" rx="9" ry="13"/>
              <ellipse cx="352" cy="140" rx="9" ry="12" transform="rotate(18 352 140)"/>
            </g>
            <g className={styles.faceB} transform="translate(640 0) scale(-1 1)">
              <text x="320" y="190" textAnchor="middle" className={styles.question}>?</text>
            </g>
          </g>
        </g>
        <g>
          <path className={styles.tail} d="M606 262 C 640 262 648 222 626 206" fill="none" stroke="#2A2522" strokeWidth="9" strokeLinecap="round"/>
          <path d="M548 266 C 540 226 552 196 576 190 C 600 196 612 226 604 266 Z" fill="#2A2522"/>
          <circle cx="576" cy="170" r="24" fill="#2A2522"/>
          <path d="M556 158 L554 132 L572 148 Z" fill="#2A2522"/>
          <path d="M596 158 L598 132 L580 148 Z" fill="#2A2522"/>
          <ellipse className={styles.eye} cx="567" cy="170" rx="4" ry="5.5"/>
          <ellipse className={styles.eye} cx="585" cy="170" rx="4" ry="5.5"/>
          <path d="M576 176 l-3 3 h6 z" fill="#B08968"/>
        </g>
      </svg>
    </div>
  );
}

export function NotFound() {
  return (
    <div className={styles.notfound}>
      <div className={styles.inner}>
        <NotFoundArt/>
        <p className={styles.hint}>{NOT_FOUND_TEXT.hint}</p>
        <h1 className={styles.title}>
          {NOT_FOUND_TEXT.titleStart} <em>{NOT_FOUND_TEXT.titleAccent}</em>
        </h1>
        <p className={styles.sub}>
          {NOT_FOUND_TEXT.lines[0]}<br/>
          {NOT_FOUND_TEXT.lines[1]}
        </p>
        <div className={styles.actions}>
          <Link className="btn btn-primary btn-raised" to="/">{NOT_FOUND_TEXT.home}</Link>
          <Link className="btn btn-ghost" to="/produtos">{NOT_FOUND_TEXT.products}</Link>
        </div>
      </div>
    </div>
  );
}

/* Página 404 completa: abaixo de 768px a tela mobile (sem Navbar/Footer
 * próprios); acima, MinimalNavbar + NotFound + Footer. */
export function NotFoundPage() {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileNotFound/>;
  return (
    <>
      <MinimalNavbar/>
      <main><NotFound/></main>
      <Footer/>
    </>
  );
}
