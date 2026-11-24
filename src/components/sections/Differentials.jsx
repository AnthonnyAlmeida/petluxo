/* PetLuxo — Differentials (layout desktop, ≥ 768px)
 * Seção escura: lista dos quatro DIFFERENTIALS (um aberto por vez, o
 * primeiro por padrão) e, ao lado, quatro medalhas penduradas num trilho.
 * Escolher na lista ou na medalha seleciona o mesmo item: a medalha desce,
 * ganha o dourado cheio e dá um balanço. */

import { useState } from 'react';
import { DIFFERENTIALS as DIFFS, DIFFERENTIALS_TAG, DIFFERENTIALS_TITLE } from '../../data/siteContent.js';
import { SectionTag } from '../ui/SectionTag.jsx';
import { Sparkle } from '../ui/art/Sparkle.jsx';
import { useSvgId } from '../ui/art/svgId.js';
import art from '../ui/art/art.module.css';
import styles from './Differentials.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

/* Na ordem de DIFFERENTIALS: qualidade (check), atendimento (balão),
 * entrega (pino), curadoria (diamante). x = posição no trilho. */
const MEDALS = [
  { x: 80, hit: styles.med0, delay: '0s', icon: <path d="M-12 1L-4 9L13-9"/> },
  { x: 200, hit: styles.med1, delay: '0.7s', icon: <path d="M-14-11H14Q18-11 18-7V5Q18 9 14 9H-3L-11 16V9H-14Q-18 9-18 5V-7Q-18-11-14-11Z"/> },
  { x: 320, hit: styles.med2, delay: '1.4s', icon: <><path d="M0 15C-9 5-11-1-11-6A11 11 0 0 1 11-6C11-1 9 5 0 15Z"/><circle cx="0" cy="-6" r="4"/></> },
  { x: 440, hit: styles.med3, delay: '2.1s', icon: <path d="M-14-4L-8-12H8L14-4 0 14Z M-14-4H14 M-4-4L0-12 4-4 M-4-4L0 14 4-4"/> },
];

function MedalRail({ sel, onPick }) {
  const gold = useSvgId('diffGold');
  return (
    <div className={styles.art}>
      <span className={styles.frame} aria-hidden="true"></span>
      {MEDALS.map((m, i) => (
        <button
          key={m.x}
          type="button"
          className={cx(styles.medHit, m.hit)}
          aria-label={DIFFS[i].title}
          aria-pressed={sel === i}
          onClick={() => onPick(i)}
        />
      ))}
      <svg className={styles.artSvg} viewBox="0 0 520 400" role="img" aria-label={DIFFERENTIALS_TITLE.artLabel}>
        <defs>
          <radialGradient id={gold} cx="35%" cy="30%" r="80%">
            <stop offset="0" className={art.stopLight}/>
            <stop offset="1" stopColor="#C6A96B"/>
          </radialGradient>
        </defs>
        <path d="M36 40H484" stroke="#C6A96B" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="36" cy="40" r="6" fill="#C6A96B"/>
        <circle cx="484" cy="40" r="6" fill="#C6A96B"/>
        {MEDALS.map((m, i) => {
          const on = sel === i;
          return (
            <g key={m.x} className={cx(styles.mo, on && styles.moOn)}>
              <g className={cx(styles.mi, on && styles.miOn)} style={{ animationDelay: on ? '0s' : m.delay }}>
                <path d={`M${m.x} 40V130`} stroke="#C6A96B" strokeWidth="1.5"/>
                <circle
                  cx={m.x}
                  cy="168"
                  r="38"
                  fill={on ? `url(#${gold})` : 'rgba(198,169,107,0.14)'}
                  stroke="#C6A96B"
                  strokeWidth="1.2"
                />
                <circle cx={m.x} cy="168" r="31" fill="none" stroke="#F8F6F3" strokeWidth="0.8" opacity="0.5"/>
                <g transform={`translate(${m.x} 168) scale(1.35)`}>
                  <g className={cx(styles.ic, on && styles.icOn)}>{m.icon}</g>
                </g>
              </g>
            </g>
          );
        })}
        <Sparkle x={50} y={330} r={8}/>
        <Sparkle x={470} y={350} r={6} delay={1.3}/>
      </svg>
      <p className={styles.caption} aria-hidden="true">
        <span className={styles.capIdx}>{DIFFS[sel].num} / {String(DIFFS.length).padStart(2, '0')}</span>
        <span className={styles.capTitle}>{DIFFS[sel].title}</span>
      </p>
    </div>
  );
}

export function Differentials() {
  const [sel, setSel] = useState(0);

  return (
    <section className={styles.diffs} id="diferenciais" aria-labelledby="diffs-title">
      <div className={cx('wrap', styles.inner)}>
        <div className={styles.head}>
          <h2 id="diffs-title" className={cx(styles.title, 'reveal')}>
            {DIFFERENTIALS_TITLE.start} <em>{DIFFERENTIALS_TITLE.accent}</em>
          </h2>
          <SectionTag num="04" tone="dark" className="reveal d1">{DIFFERENTIALS_TAG}</SectionTag>
        </div>

        <div className={styles.body}>
          <div className={cx(styles.list, 'reveal', 'd2')}>
            {DIFFS.map((d, i) => {
              const on = sel === i;
              return (
                <div key={d.num} className={styles.item}>
                  <h3 className={styles.itemHeading}>
                    <button
                      type="button"
                      className={cx(styles.itemBtn, on && styles.itemBtnOn)}
                      aria-expanded={on}
                      aria-controls={`diff-body-${d.num}`}
                      onClick={() => setSel(i)}
                    >
                      <span className={styles.num} aria-hidden="true">{d.num}</span>
                      <span className={styles.itemTitle}>{d.title}</span>
                    </button>
                  </h3>
                  <p id={`diff-body-${d.num}`} className={styles.itemBody} hidden={!on}>{d.body}</p>
                </div>
              );
            })}
          </div>

          <div className={cx(styles.artCol, 'reveal', 'd3')}>
            <MedalRail sel={sel} onPick={setSel}/>
          </div>
        </div>
      </div>
    </section>
  );
}
