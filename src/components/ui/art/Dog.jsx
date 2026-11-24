/* PetLuxo — cachorro sentado (arte desktop, coordenadas da Hero 520 × 650).
 * Usado pela Hero e pela CTA (que recorta com outro viewBox).
 * `wag`: rabo abanando; `tilt`: 'once' | 'loop' inclina a cabeça. */

import { useSvgId } from './svgId.js';
import styles from './art.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

export function Dog({ wag = false, tilt = null }) {
  const gold = useSvgId('dogGold');
  return (
    <g>
      <defs>
        <radialGradient id={gold} cx="35%" cy="30%" r="80%">
          <stop offset="0" className={styles.stopLight}/>
          <stop offset="1" stopColor="#C6A96B"/>
        </radialGradient>
      </defs>
      <g className={cx(styles.dogTail, wag && styles.dogWag)}>
        <path d="M96 528C60 520 44 490 52 462" fill="none" stroke="#B08968" strokeWidth="18" strokeLinecap="round"/>
      </g>
      <ellipse cx="150" cy="480" rx="62" ry="86" fill="#B08968"/>
      <ellipse cx="98" cy="530" rx="40" ry="34" fill="#A07A59"/>
      <ellipse cx="152" cy="505" rx="34" ry="56" fill="#EFE7DC"/>
      <rect x="120" y="520" width="24" height="44" rx="12" fill="#B08968"/>
      <rect x="158" y="520" width="24" height="44" rx="12" fill="#B08968"/>
      <ellipse cx="132" cy="564" rx="17" ry="9" fill="#EFE7DC"/>
      <ellipse cx="170" cy="564" rx="17" ry="9" fill="#EFE7DC"/>
      <g className={cx(styles.dogHead, tilt === 'once' && styles.dogTiltOnce, tilt === 'loop' && styles.dogTiltLoop)}>
        <path d="M104 345C78 352 76 412 100 420 112 402 112 366 114 345Z" fill="#8C6A4C"/>
        <path d="M196 345C222 352 224 412 200 420 188 402 188 366 186 345Z" fill="#8C6A4C"/>
        <ellipse cx="150" cy="370" rx="52" ry="46" fill="#B08968"/>
        <ellipse cx="150" cy="388" rx="28" ry="22" fill="#EFE7DC"/>
        <ellipse cx="150" cy="378" rx="9" ry="6" fill="#2A2522"/>
        <circle cx="130" cy="360" r="5" fill="#2A2522"/>
        <circle cx="170" cy="360" r="5" fill="#2A2522"/>
        <circle cx="131.5" cy="358" r="1.6" fill="#F8F6F3"/>
        <circle cx="171.5" cy="358" r="1.6" fill="#F8F6F3"/>
        <path d="M141 396Q150 403 159 396" fill="none" stroke="#2A2522" strokeWidth="2" strokeLinecap="round"/>
      </g>
      <path d="M110 424Q150 446 190 424" fill="none" stroke="#6B1E2B" strokeWidth="10" strokeLinecap="round"/>
      <circle cx="150" cy="442" r="9" fill={`url(#${gold})`} stroke="#6B1E2B" strokeWidth="1"/>
    </g>
  );
}
