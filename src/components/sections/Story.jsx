/* PetLuxo — Story / Sobre nós (layout desktop, ≥ 768px)
 * À esquerda, a arte "curadoria": coração numa medalha, rodeado pelos
 * quatro pilares (STORY_PILLARS). Cada pilar é um botão; o escolhido acende
 * o nó, desenha o fio até o centro e aparece na legenda. À direita, os
 * textos de STORY, sem alteração. */

import { useState } from 'react';
import { STORY, STORY_ART, STORY_PILLARS } from '../../data/siteContent.js';
import { SectionTag } from '../ui/SectionTag.jsx';
import { Sparkle } from '../ui/art/Sparkle.jsx';
import styles from './Story.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

/* Nós na ordem de STORY_PILLARS: topo, direita, base, esquerda. */
const NODES = [
  { x: 260, y: 110, line: 'M260 188V140', btn: styles.node0, icon: (
    <path d="M-14-4L-8-12H8L14-4 0 14Z M-14-4H14 M-4-4L0-12 4-4 M-4-4L0 14 4-4" strokeLinejoin="round" strokeLinecap="round"/>
  ) },
  { x: 400, y: 250, line: 'M322 250H370', btn: styles.node1, icon: (
    <g strokeLinecap="round">
      <rect x="-16" y="-12" width="32" height="24" rx="6"/>
      <rect x="-10.5" y="-6.5" width="21" height="13" rx="3" strokeDasharray="3 3"/>
    </g>
  ) },
  { x: 260, y: 390, line: 'M260 312V360', btn: styles.node2, icon: (
    <path d="M0-14L3.5-3.5 14 0 3.5 3.5 0 14-3.5 3.5-14 0-3.5-3.5Z" strokeLinejoin="round"/>
  ) },
  { x: 120, y: 250, line: 'M198 250H150', btn: styles.node3, icon: (
    <g strokeLinecap="round">
      <ellipse cx="0" cy="6" rx="8" ry="6.5"/>
      <circle cx="-10" cy="-3" r="3.3"/>
      <circle cx="-3.6" cy="-10" r="3.3"/>
      <circle cx="3.6" cy="-10" r="3.3"/>
      <circle cx="10" cy="-3" r="3.3"/>
    </g>
  ) },
];

const SPARKLES = [
  { x: 70, y: 90, r: 8, delay: 0 },
  { x: 452, y: 130, r: 6, delay: 1.4 },
  { x: 440, y: 430, r: 8, delay: 2.4 },
];

const pad = (n) => String(n).padStart(2, '0');

function StoryArt() {
  const [sel, setSel] = useState(0);

  return (
    <div className={styles.art}>
      <span className={styles.frame} aria-hidden="true"></span>
      {NODES.map((n, i) => (
        <button
          key={STORY_PILLARS[i]}
          type="button"
          className={cx(styles.nodeBtn, n.btn)}
          aria-pressed={sel === i}
          aria-label={STORY_PILLARS[i]}
          onClick={() => setSel(i)}
        />
      ))}
      <svg className={styles.artSvg} viewBox="0 0 520 600" role="img" aria-label={STORY_ART.artLabel}>
        <g className={styles.orbit}>
          <circle cx="260" cy="250" r="200" fill="none" stroke="#C6A96B" strokeWidth="1" strokeDasharray="2 9" strokeLinecap="round"/>
        </g>
        <circle cx="260" cy="250" r="140" fill="none" stroke="#C6A96B" strokeWidth="1"/>
        {NODES.map((n, i) => (
          <path key={n.line} className={cx(styles.ln, sel === i && styles.lnOn)} d={n.line} stroke="#C6A96B" strokeWidth="2" strokeLinecap="round" fill="none"/>
        ))}
        <circle cx="260" cy="250" r="62" fill="#F8F6F3" stroke="#C6A96B" strokeWidth="1.5"/>
        <circle cx="260" cy="250" r="54" fill="none" stroke="#C6A96B" strokeWidth="0.8" opacity="0.7"/>
        <g className={styles.heart}>
          <path d="M260 282C214 252 208 216 232 204 247 196 258 204 260 214 262 204 273 196 288 204 312 216 306 252 260 282Z" fill="#6B1E2B"/>
        </g>
        {NODES.map((n, i) => (
          <g key={`${n.x}-${n.y}`} transform={`translate(${n.x} ${n.y})`}>
            <circle className={cx(styles.nc, sel === i && styles.ncOn)} r="30" fill="#F8F6F3" stroke="#C6A96B" strokeWidth="1.5"/>
            <g fill="none" stroke="#2A2522" strokeWidth="1.6">{n.icon}</g>
          </g>
        ))}
        {SPARKLES.map((s) => <Sparkle key={`${s.x}-${s.y}`} {...s}/>)}
      </svg>
      <p className={styles.caption} aria-live="polite">
        <span className={styles.capIdx}>{STORY_ART.caption} · {pad(sel + 1)} / {pad(NODES.length)}</span>
        <span className={styles.capTitle}>{STORY_PILLARS[sel]}</span>
      </p>
    </div>
  );
}

export function Story() {
  return (
    <section className={styles.story} id="sobre" aria-labelledby="story-title">
      <div className={cx('wrap', styles.grid)}>
        <div className={cx(styles.artCol, 'reveal')}>
          <StoryArt/>
        </div>

        <div className={styles.text}>
          <SectionTag num="03" className="reveal">{STORY.tag}</SectionTag>
          <p className={cx(styles.manifesto, 'reveal')}>{STORY.manifesto}</p>
          <h2 id="story-title" className={cx(styles.title, 'reveal', 'd1')}>
            {STORY.titleStart} <em>{STORY.titleAccent}</em> {STORY.titleEnd}
          </h2>
          <p className={cx(styles.lead, 'reveal', 'd2')}>{STORY.lead}</p>
          {STORY.paragraphs.map((text) => (
            <p key={text} className={cx(styles.body, 'reveal', 'd3')}>{text}</p>
          ))}
          <p className={cx(styles.signature, 'reveal', 'd4')}>{STORY.signature}</p>
        </div>
      </div>
    </section>
  );
}
