/* PetLuxo — FAQ (layout desktop, ≥ 768px, id="faq")
 * À esquerda: cabeçalho (FAQ_TEXT), a campainha de balcão com o gato (o
 * clique "toca": a campainha treme, as ondas saem e o gato aperta com a
 * pata) e o contato. À direita: os sete FAQS em acordeão de um item aberto
 * por vez, o primeiro aberto por padrão. */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHoverState } from '../../hooks/useHoverState.js';
import { wa } from '../../lib/whatsapp.js';
import { splitLastWord } from '../../lib/text.js';
import { FAQS, FAQ_DESKTOP, FAQ_TEXT, FOOTER, TROCA_ANSWER, WA_MESSAGES } from '../../data/siteContent.js';
import { SectionTag } from '../ui/SectionTag.jsx';
import { Icon } from '../../icons.jsx';
import { Sparkle } from '../ui/art/Sparkle.jsx';
import { useSvgId } from '../ui/art/svgId.js';
import art from '../ui/art/art.module.css';
import styles from './FAQ.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');
const RING_MS = 1800;

const TROCA_ANSWER_JSX = (
  <>
    {TROCA_ANSWER.before}
    <Link to={TROCA_ANSWER.to} className={styles.link}>
      {TROCA_ANSWER.linkText}
    </Link>
    {TROCA_ANSWER.after}
  </>
);

function BellScene() {
  const [ringN, setRingN] = useState(0);
  const [ringing, setRinging] = useState(false);
  const [hoverId, bindHover] = useHoverState();
  const hover = hoverId !== null;
  const timer = useRef(null);
  const gold = useSvgId('bellGold');

  useEffect(() => () => clearTimeout(timer.current), []);

  const ring = () => {
    setRinging(true);
    setRingN((n) => n + 1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setRinging(false), RING_MS);
  };

  return (
    <div className={cx(styles.art, ringing && styles.ringing, hover && !ringing && styles.hovering)}>
      <span className={styles.frame} aria-hidden="true"></span>
      <button
        type="button"
        className={styles.bellHit}
        aria-label={FAQ_DESKTOP.bellLabel}
        onClick={ring}
        {...bindHover('bell')}
      />
      <svg key={ringN} className={styles.artSvg} viewBox="0 0 400 270" role="img" aria-label={FAQ_DESKTOP.artLabel}>
        <defs>
          <radialGradient id={gold} cx="35%" cy="25%" r="85%">
            <stop offset="0" className={art.stopLight}/>
            <stop offset="1" stopColor="#C6A96B"/>
          </radialGradient>
        </defs>
        <rect x="10" y="222" width="380" height="38" fill="rgba(198,169,107,0.16)"/>
        <path d="M10 222H390" stroke="#C6A96B" strokeWidth="1.5"/>
        <circle className={cx(styles.ripple, styles.ripple1)} cx="170" cy="190" r="56" fill="none" stroke="#C6A96B" strokeWidth="2"/>
        <circle className={cx(styles.ripple, styles.ripple2)} cx="170" cy="190" r="56" fill="none" stroke="#C6A96B" strokeWidth="1.5"/>
        <g className={styles.bell}>
          <ellipse cx="170" cy="218" rx="66" ry="9" fill={`url(#${gold})`} stroke="#8E7440" strokeWidth="0.8"/>
          <path d="M116 214A54 54 0 0 1 224 214Z" fill={`url(#${gold})`} stroke="#8E7440" strokeWidth="0.8"/>
          <path d="M132 190A42 42 0 0 1 160 166" fill="none" stroke="#F8F6F3" strokeWidth="4" strokeLinecap="round" opacity="0.6"/>
          <rect x="166" y="154" width="8" height="10" fill="#C6A96B"/>
          <circle className={styles.knob} cx="170" cy="151" r="8" fill={`url(#${gold})`} stroke="#8E7440" strokeWidth="0.8"/>
        </g>
        <g className={styles.cat}>
          <path d="M324 216C362 216 372 172 346 152" fill="none" stroke="#2A2522" strokeWidth="12" strokeLinecap="round"/>
          <ellipse cx="290" cy="172" rx="36" ry="46" fill="#2A2522"/>
          <ellipse cx="290" cy="166" rx="11" ry="20" fill="#EFE7DC"/>
          <path d="M264 98L261 66 285 86Z" fill="#2A2522"/>
          <path d="M316 98L319 66 295 86Z" fill="#2A2522"/>
          <path d="M267 92L266 74 279 86Z" fill="#6B1E2B"/>
          <path d="M313 92L314 74 301 86Z" fill="#6B1E2B"/>
          <circle cx="290" cy="112" r="32" fill="#2A2522"/>
          <g className={art.catEyes}>
            <ellipse cx="279" cy="110" rx="5.5" ry="7.5" fill="#C6A96B"/>
            <ellipse cx="301" cy="110" rx="5.5" ry="7.5" fill="#C6A96B"/>
            <ellipse cx="279" cy="110" rx="1.8" ry="5.2" fill="#2A2522"/>
            <ellipse cx="301" cy="110" rx="1.8" ry="5.2" fill="#2A2522"/>
          </g>
          <path d="M286 122L294 122 290 127Z" fill="#B08968"/>
          <path d="M270 124L254 120M270 128L254 132M310 124L326 120M310 128L326 132" stroke="#E8DED2" strokeWidth="1" strokeLinecap="round"/>
          <path d="M265 140Q290 152 315 140" fill="none" stroke="#C6A96B" strokeWidth="5" strokeLinecap="round"/>
          <circle cx="290" cy="150" r="5.5" fill={`url(#${gold})`}/>
          <path className={styles.pawRest} d="M268 190L262 214" fill="none" stroke="#2A2522" strokeWidth="13" strokeLinecap="round"/>
          <g className={styles.pawPress}>
            <path d="M266 176L192 152" fill="none" stroke="#2A2522" strokeWidth="13" strokeLinecap="round"/>
            <ellipse cx="187" cy="150" rx="9" ry="8" fill="#2A2522"/>
          </g>
        </g>
        <Sparkle x={48} y={70} r={8}/>
        <Sparkle x={360} y={50} r={6} delay={1.4}/>
      </svg>
      <p className={styles.hint}>{FAQ_DESKTOP.bellHint}</p>
    </div>
  );
}

export function FAQ() {
  const [open, setOpen] = useState(0);
  const toggle = (i) => setOpen((prev) => (prev === i ? -1 : i));
  const [titleStart, titleAccent] = splitLastWord(FAQ_TEXT.title);

  return (
    <section className={styles.faq} id="faq" aria-labelledby="faq-title">
      <div className={cx('wrap', styles.grid)}>
        <div className={cx(styles.side, 'reveal')}>
          <SectionTag num={FAQ_DESKTOP.num}>{FAQ_TEXT.label}</SectionTag>
          <h2 id="faq-title" className={styles.title}>
            {titleStart} <em>{titleAccent}</em>
          </h2>
          <p className={styles.subtitle}>{FAQ_TEXT.subtitle}</p>
          <BellScene/>
          <p className={styles.more}>
            {FAQ_TEXT.moreTitle} {FAQ_DESKTOP.moreBefore}{' '}
            <a href={wa(WA_MESSAGES.question)} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {FAQ_DESKTOP.moreWa}
            </a>
            {' '}{FAQ_DESKTOP.moreMid}{' '}
            <a href={`mailto:${FOOTER.email}`} className={styles.link}>{FOOTER.email}</a>
          </p>
        </div>

        <div className={cx(styles.list, 'reveal', 'd1')}>
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={styles.item}>
                <h3 className={styles.itemHeading}>
                  <button
                    type="button"
                    className={styles.question}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => toggle(i)}
                  >
                    <span>{item.q}</span>
                    <Icon.Plus className={cx(styles.icon, isOpen && styles.iconOpen)}/>
                  </button>
                </h3>
                <div id={`faq-answer-${i}`} className={styles.answer} hidden={!isOpen}>
                  <p>{item.a !== null ? item.a : TROCA_ANSWER_JSX}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
