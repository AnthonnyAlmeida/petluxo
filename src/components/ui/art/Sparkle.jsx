/* PetLuxo — faísca dourada de quatro pontas (arte desktop).
 * O <g> externo posiciona; o interno pisca (transform em CSS substituiria
 * o atributo transform, por isso ficam separados). `r` = raio da ponta. */

import styles from './art.module.css';

const INNER = { 9: 2.4, 8: 2, 7: 2, 6: 1.6 };

function starPath(r) {
  const k = INNER[r] ?? r * 0.27;
  return `M0-${r}L${k}-${k} ${r} 0 ${k} ${k} 0 ${r}-${k} ${k}-${r} 0-${k}-${k}Z`;
}

export function Sparkle({ x, y, r = 8, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={styles.sparkle} style={delay ? { animationDelay: `${delay}s` } : undefined}>
        <path d={starPath(r)} fill="#C6A96B"/>
      </g>
    </g>
  );
}
