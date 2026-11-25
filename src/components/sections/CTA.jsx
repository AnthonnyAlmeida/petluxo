/* PetLuxo — CTA final (layout desktop, ≥ 768px, id="contato")
 * Anéis dourados ao fundo, chamada central e dois botões. O cachorro (à
 * esquerda) e o gato (à direita) são os mesmos da Hero: reagem ao hover, ao
 * foco e ao toque nos botões (estado `mode`, de `useHoverState`): "Ver
 * produtos" anima o cachorro, "Falar via WhatsApp" anima o gato e mostra o
 * balão de conversa. */

import { useHoverState } from '../../hooks/useHoverState.js';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';
import { CTA_TEXT } from '../../data/siteContent.js';
import { Dog } from '../ui/art/Dog.jsx';
import { Cat } from '../ui/art/Cat.jsx';
import '../../styles/buttons.css';
import styles from './CTA.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

export function CTA() {
  const [mode, react] = useHoverState();

  return (
    <section className={cx(styles.cta, mode && styles.ctaActive)} id="contato" aria-labelledby="cta-title">
      <svg className={styles.rings} viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
        <g className={styles.ringsG}>
          <circle cx="500" cy="500" r="470" fill="none" stroke="#D9CBB9" strokeWidth="1"/>
          <circle cx="500" cy="500" r="370" fill="none" stroke="#D9CBB9" strokeWidth="1"/>
          <circle cx="500" cy="500" r="270" fill="none" stroke="#C6A96B" strokeWidth="1" opacity="0.6"/>
        </g>
        <g className={styles.orbit}>
          <circle cx="500" cy="500" r="320" fill="none" stroke="#C6A96B" strokeWidth="1" strokeDasharray="2 10" strokeLinecap="round"/>
          <circle cx="500" cy="180" r="6" fill="#C6A96B"/>
        </g>
      </svg>

      <div className={styles.content}>
        <p className={cx(styles.eyebrow, 'reveal')}>
          <span className={styles.eyebrowDot} aria-hidden="true"></span>
          {CTA_TEXT.eyebrow}
        </p>
        <h2 id="cta-title" className={cx(styles.title, 'reveal', 'd1')}>
          {CTA_TEXT.titleStart}<br/>
          <em>{CTA_TEXT.titleAccent}</em>
        </h2>
        <p className={cx(styles.sub, 'reveal', 'd2')}>{CTA_TEXT.sub}</p>
        <div className={cx(styles.row, 'reveal', 'd3')}>
          <a className="btn btn-primary btn-raised" href="#produtos" {...react('shop')}>
            {CTA_TEXT.shop}
            <Icon.ArrowR/>
          </a>
          <a
            className="btn btn-gold"
            href={wa(CTA_TEXT.waMessage)} data-wa-origin="cta"
            target="_blank"
            rel="noopener noreferrer"
            {...react('chat')}
          >
            <Icon.Wa className="wa-icon"/>
            {CTA_TEXT.chat}
          </a>
        </div>
        <ul className={cx(styles.meta, 'reveal', 'd4')}>
          {CTA_TEXT.meta.map((m) => (
            <li key={m}><span className={styles.metaDot} aria-hidden="true"></span>{m}</li>
          ))}
        </ul>
      </div>

      <svg className={styles.dog} viewBox="40 330 230 250" role="img" aria-label={CTA_TEXT.dogLabel}>
        <ellipse cx="150" cy="574" rx="100" ry="9" fill="#2A2522" opacity="0.08"/>
        <Dog wag={mode === 'shop'} tilt={mode === 'shop' ? 'loop' : null}/>
      </svg>

      <svg className={styles.cat} viewBox="296 292 200 290" role="img" aria-label={CTA_TEXT.catLabel}>
        <g className={cx(styles.bubble, mode === 'chat' && styles.bubbleOn)}>
          <rect x="318" y="298" width="104" height="44" rx="18" fill="#F8F6F3" stroke="#C6A96B" strokeWidth="1.5"/>
          <path d="M340 340L334 356L358 342Z" fill="#F8F6F3" stroke="#C6A96B" strokeWidth="1.5" strokeLinejoin="round"/>
          <rect x="334" y="338" width="30" height="6" fill="#F8F6F3"/>
          <circle cx="346" cy="320" r="5" fill="#2A2522"/>
          <circle cx="370" cy="320" r="5" fill="#2A2522"/>
          <circle cx="394" cy="320" r="5" fill="#2A2522"/>
        </g>
        <Cat swish={mode === 'chat' ? 'fast' : null} nod={mode === 'chat' ? 'loop' : null}/>
      </svg>
    </section>
  );
}
