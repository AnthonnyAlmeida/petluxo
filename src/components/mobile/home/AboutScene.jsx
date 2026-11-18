/* PetLuxo — AboutScene
 * "Sobre nós" com os textos do site (src/data/siteContent.js). A rosácea
 * guilloché inclina e os olhos do cachorro seguem o dedo/ponteiro, com
 * coordenadas relativas aos olhos (getBoundingClientRect). "Ler mais"
 * expande o restante do texto; recolhido, ele continua no DOM. */

import { useRef, useState } from 'react';
import { MIcon } from '../MobileIcons.jsx';
import { STORY } from '../../../data/siteContent.js';
import ui from '../ui/MobileUI.module.css';
import styles from './AboutScene.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');
const clamp1 = (v) => Math.round(Math.max(-1, Math.min(1, v)) * 100) / 100;
const ELLIPSE_ANGLES = Array.from({ length: 36 }, (_, i) => i * 5);

/* posição dos olhos dentro do SVG do cachorro, em px (viewBox 44 78 152 104 → 124 × 85) */
const EYE_X = ((120 - 44) / 152) * 124;
const EYE_Y = ((121 - 78) / 104) * 85;

function Guilloche() {
  return (
    <svg className={styles.mAboutArt} viewBox="0 0 390 300" fill="none" stroke="#D4BC85" aria-hidden="true" focusable="false">
      <g transform="translate(195 150)">
        <g className={styles.mGuilTilt}>
          <g className={styles.mGuil} strokeWidth="0.6" strokeOpacity="0.5">
            {ELLIPSE_ANGLES.map((a) => (
              <ellipse key={a} cx="0" cy="0" rx="112" ry="40" transform={`rotate(${a})`}/>
            ))}
          </g>
        </g>
        <circle r="116" strokeWidth="0.8" strokeOpacity="0.5"/>
        <circle r="122" strokeWidth="0.5" strokeOpacity="0.25"/>
        <circle r="40" fill="#2A2522" strokeWidth="1"/>
        <circle r="35" strokeWidth="0.5" strokeOpacity="0.6"/>
        <text x="0" y="13" textAnchor="middle" fill="#D4BC85" stroke="none" className={styles.mAboutMono}>P</text>
      </g>
    </svg>
  );
}

function Dog({ dogRef }) {
  return (
    <div className={styles.mDogWindow}>
      <svg ref={dogRef} className={styles.mDog} viewBox="44 78 152 104" aria-hidden="true" focusable="false">
        <g fill="#F8F6F3" stroke="#B08968" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <g className={styles.mDogHead}>
            <g className={styles.mDogEarL}><path d="M80 100 C56 96 46 128 58 156 C64 166 76 156 80 138"/></g>
            <g className={styles.mDogEarR}><path d="M160 100 C184 96 194 128 182 156 C176 166 164 156 160 138"/></g>
            <path d="M78 118 C78 78 162 78 162 118 C162 142 156 162 144 172 C136 184 104 184 96 172 C84 162 78 142 78 118 Z"/>
            <path fill="none" strokeWidth="1.5" d="M97 109 C101 105 107 105 111 109 M129 109 C133 105 139 105 143 109"/>
            <path fill="#6B1E2B" stroke="none" d="M109 152 C109 146 131 146 131 152 C131 160 122 164 120 164 C118 164 109 160 109 152 Z"/>
            <path fill="none" d="M120 164 V172 M120 172 C114 179 106 177 104 171 M120 172 C126 179 134 177 136 171"/>
            <g className={styles.mDogBlink}>
              <g className={styles.mDogLook}>
                <circle cx="104" cy="121" r="3.6" fill="#2A2522" stroke="none"/>
                <circle cx="136" cy="121" r="3.6" fill="#2A2522" stroke="none"/>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

export function AboutScene() {
  const [open, setOpen] = useState(false);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const dogRef = useRef(null);

  const follow = (e) => {
    const r = dogRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = clamp1((e.clientX - (r.left + EYE_X)) / 160);
    const y = clamp1((e.clientY - (r.top + EYE_Y)) / 160);
    setLook((prev) => (prev.x === x && prev.y === y ? prev : { x, y }));
  };

  return (
    <section
      className={styles.mAbout}
      style={{ '--dvx': look.x, '--dvy': look.y }}
      onPointerMove={follow}
      onPointerDown={follow}
      aria-labelledby="m-about-title"
    >
      <div className={styles.mAboutGlow} aria-hidden="true"></div>
      <Guilloche/>
      <div className={styles.mAboutSpacer} aria-hidden="true"></div>

      <div className={styles.mAboutSheet}>
        <Dog dogRef={dogRef}/>

        <p className={ui.mEyebrow}><span className={ui.mEyebrowDot} aria-hidden="true"></span>Sobre nós</p>
        <h2 id="m-about-title" className={styles.mAboutTitle}>
          {STORY.titleStart} <em>{STORY.titleAccent}</em> {STORY.titleEnd}
        </h2>
        <p className={styles.mAboutLead}>{STORY.lead}</p>

        <div id="m-about-more" className={cx(styles.mAboutMore, open && styles.mAboutMoreOpen)}>
          <div className={styles.mAboutMoreInner}>
            {STORY.paragraphs.map((t) => <p key={t} className={styles.mAboutText}>{t}</p>)}
            <p className={styles.mAboutSign}>{STORY.signature}</p>
          </div>
        </div>

        <button
          type="button"
          className={styles.mAboutToggle}
          aria-expanded={open}
          aria-controls="m-about-more"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Ler menos' : 'Ler mais'}
          <MIcon.ChevronUp className={cx(styles.mAboutChevron, open && styles.mAboutChevronOpen)}/>
        </button>
      </div>
    </section>
  );
}
