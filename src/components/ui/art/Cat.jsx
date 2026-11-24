/* PetLuxo — gato sentado na almofada (arte desktop, coordenadas da Hero
 * 520 × 650). Usado pela Hero e pela CTA (que recorta com outro viewBox).
 * `swish`: 'slow' | 'fast' balança a cauda; `nod`: 'once' | 'loop' acena a
 * cabeça; `blink`: 'fast' pisca duas vezes (senão pisca a cada 6s). */

import styles from './art.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

export function Cat({ swish = null, nod = null, blink = null }) {
  return (
    <g>
      <ellipse cx="380" cy="552" rx="80" ry="20" fill="#6B1E2B"/>
      <ellipse cx="380" cy="543" rx="70" ry="16" fill="#7A2A38"/>
      <g className={cx(styles.catTail, swish === 'slow' && styles.catSwish, swish === 'fast' && styles.catSwishFast)}>
        <path d="M420 534C474 534 484 474 452 450" fill="none" stroke="#2A2522" strokeWidth="14" strokeLinecap="round"/>
      </g>
      <ellipse cx="380" cy="494" rx="44" ry="56" fill="#2A2522"/>
      <ellipse cx="380" cy="478" rx="14" ry="24" fill="#EFE7DC"/>
      <g className={cx(nod === 'once' && styles.catNodOnce, nod === 'loop' && styles.catNodLoop)}>
        <path d="M347 394L344 358 372 380Z" fill="#2A2522"/>
        <path d="M413 394L416 358 388 380Z" fill="#2A2522"/>
        <path d="M351 386L350 368 363 380Z" fill="#6B1E2B"/>
        <path d="M409 386L410 368 397 380Z" fill="#6B1E2B"/>
        <circle cx="380" cy="414" r="38" fill="#2A2522"/>
        <g className={cx(styles.catEyes, blink === 'fast' && styles.catBlinkFast)}>
          <ellipse cx="366" cy="412" rx="6.5" ry="8.5" fill="#C6A96B"/>
          <ellipse cx="394" cy="412" rx="6.5" ry="8.5" fill="#C6A96B"/>
          <ellipse cx="366" cy="412" rx="2" ry="6" fill="#2A2522"/>
          <ellipse cx="394" cy="412" rx="2" ry="6" fill="#2A2522"/>
        </g>
        <path d="M376 428L384 428 380 433Z" fill="#B08968"/>
        <path d="M356 430L338 426M356 435L338 438M404 430L422 426M404 435L422 438" stroke="#E8DED2" strokeWidth="1.2" strokeLinecap="round"/>
      </g>
      <path d="M349 446Q380 460 411 446" fill="none" stroke="#C6A96B" strokeWidth="6" strokeLinecap="round"/>
    </g>
  );
}
