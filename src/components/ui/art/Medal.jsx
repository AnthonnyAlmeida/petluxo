/* PetLuxo — medalha "PL" da Hero (arte desktop, coordenadas 520 × 650).
 * Balança sempre; `hover` acelera; `kick` (contador de cliques; 0 = nenhum)
 * dá o tranco e gira a face a cada incremento, sem remontar o SVG: a animação
 * alterna entre duas cópias (par/ímpar) para reiniciar. `flipped` mostra a
 * patinha; a troca de face é uma transição com atraso, na metade do giro. */

import { BRAND } from '../../../data/siteContent.js';
import { useSvgId } from './svgId.js';
import styles from './art.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

export function Medal({ hover = false, kick = 0, flipped = false }) {
  const gold = useSvgId('medalGold');
  const odd = kick % 2 === 1;
  return (
    <g className={cx(styles.medal, hover && styles.medalHover, flipped && styles.flipped)}>
      <defs>
        <radialGradient id={gold} cx="35%" cy="30%" r="80%">
          <stop offset="0" className={styles.stopLight}/>
          <stop offset="1" stopColor="#C6A96B"/>
        </radialGradient>
      </defs>
      <g className={cx(styles.medalKick, kick > 0 && (odd ? styles.medalSwingA : styles.medalSwingB))}>
        <path d="M260 0V124" stroke="#C6A96B" strokeWidth="2"/>
        <circle cx="260" cy="128" r="5" fill="#C6A96B"/>
        <g className={cx(styles.medalFace, kick > 0 && (odd ? styles.medalFlipA : styles.medalFlipB))}>
          <circle cx="260" cy="182" r="58" fill={`url(#${gold})`}/>
          <circle cx="260" cy="182" r="48" fill="none" stroke="#F8F6F3" strokeWidth="1.5" opacity="0.8"/>
          <circle cx="260" cy="182" r="58" fill="none" stroke="#6B1E2B" strokeWidth="1"/>
          <g className={styles.faceA}>
            <text x="260" y="198" textAnchor="middle" className={styles.monogram}>{BRAND.monogram}</text>
          </g>
          <g className={styles.faceB} fill="#6B1E2B">
            <ellipse cx="260" cy="194" rx="17" ry="14"/>
            <ellipse cx="232" cy="170" rx="7" ry="9" transform="rotate(-20 232 170)"/>
            <ellipse cx="250" cy="156" rx="7" ry="9" transform="rotate(-6 250 156)"/>
            <ellipse cx="270" cy="156" rx="7" ry="9" transform="rotate(6 270 156)"/>
            <ellipse cx="288" cy="170" rx="7" ry="9" transform="rotate(20 288 170)"/>
          </g>
        </g>
      </g>
    </g>
  );
}
