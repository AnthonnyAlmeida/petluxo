/* PetLuxo — FeaturedScene
 * Produto com `featured: true` (o primeiro visível). Foto, preço "a partir
 * de", nome, subtítulo, descrição (3 linhas) e WhatsApp. O gato sentado na
 * borda da folha ronrona ao toque. */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MIcon } from '../MobileIcons.jsx';
import { getFeaturedProduct, lowestPrice } from '../../../lib/catalog.js';
import { wa } from '../../../lib/whatsapp.js';
import { WA_MESSAGES } from '../../../data/siteContent.js';
import ui from '../ui/MobileUI.module.css';
import styles from './FeaturedScene.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

function Cat({ happy }) {
  return (
    <svg className={cx(styles.mCat, happy && styles.mCatHappy)} viewBox="204 62 158 238" aria-hidden="true" focusable="false">
      <g fill="#F8F6F3" stroke="#B08968" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <g className={styles.mCatTail}><path fill="none" d="M310 288 C342 292 354 252 338 228 C329 214 316 220 322 234"/></g>
        <g className={styles.mCatBreathe}>
          <path d="M232 172 C222 204 214 240 216 292 H308 C310 240 302 204 292 172 Z"/>
          <path fill="none" d="M250 228 L249 292"/>
          <path fill="none" d="M274 228 L275 292"/>
          <path fill="none" stroke="#C6A96B" d="M233 188 C250 203 274 203 291 188"/>
          <circle cx="262" cy="204" r="4.5" fill="none" stroke="#C6A96B"/>
          <g className={styles.mCatHead}>
            <path d="M226 112 L222 78 L250 98 Z"/>
            <g className={styles.mCatEarR}><path d="M298 112 L302 78 L274 98 Z"/></g>
            <path d="M222 138 C222 106 232 98 262 98 C292 98 302 106 302 138 C302 166 286 180 262 180 C238 180 222 166 222 138 Z"/>
            <path fill="none" strokeWidth="1.6" d="M238 158 L206 151 M238 164 L206 166 M286 158 L318 151 M286 164 L318 166"/>
            <path fill="none" d="M262 160 V165 M262 165 C258 170 252 168 250 164 M262 165 C266 170 272 168 274 164"/>
            <path fill="#6B1E2B" stroke="none" d="M257 153 L267 153 L262 160 Z"/>
            <g className={styles.mCatBlink}>
              <path fill="none" strokeWidth="1.8" d="M236 138 C241 130 251 130 256 138 C251 146 241 146 236 138 Z"/>
              <path fill="none" strokeWidth="1.8" d="M268 138 C273 130 283 130 288 138 C283 146 273 146 268 138 Z"/>
              <ellipse cx="246" cy="138" rx="2" ry="4.2" fill="#2A2522" stroke="none"/>
              <ellipse cx="278" cy="138" rx="2" ry="4.2" fill="#2A2522" stroke="none"/>
            </g>
          </g>
        </g>
        <g className={styles.mCatHeart}><path fill="#6B1E2B" stroke="none" d="M262 66 C252 54 240 68 262 84 C284 68 272 54 262 66 Z"/></g>
      </g>
    </svg>
  );
}

export function FeaturedScene() {
  const product = getFeaturedProduct();
  const [happy, setHappy] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!product) return null;

  const petCat = () => {
    setHappy(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setHappy(false), 1800);
  };

  const href = `/produto/${product.id}`;

  return (
    <section className={styles.mFeat} aria-labelledby="m-feat-title">
      <div className={styles.mFeatMedia}>
        <img className={styles.mFeatImg} src={product.image} alt={product.name} loading="lazy" decoding="async"/>
        <span className={styles.mFeatTag}>DESTAQUE</span>
        <div className={styles.mFeatPrice}>
          {product.prices?.length > 0 && <div className={styles.mFeatPriceLabel}>A partir de</div>}
          <div className={styles.mFeatPriceValue}>{lowestPrice(product)}</div>
        </div>
      </div>

      <div className={styles.mFeatSheet}>
        <button type="button" className={styles.mCatBtn} aria-label="Fazer carinho no gato" onClick={petCat}>
          <Cat happy={happy}/>
        </button>

        <p className={ui.mEyebrow}><span className={ui.mEyebrowDot} aria-hidden="true"></span>Produto em destaque</p>
        <h2 id="m-feat-title" className={styles.mFeatTitle}>
          <Link to={href} className={styles.mFeatTitleLink}>{product.shortName || product.name}</Link>
        </h2>
        {product.subtitle && <p className={styles.mFeatSub}>{product.subtitle}</p>}
        <p className={styles.mFeatDesc}>{product.description}</p>
        <a
          className={cx(ui.mBtn, ui.mBtnPrimary, styles.mFeatCta)}
          href={wa(WA_MESSAGES.product(product.name))}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MIcon.Wa/>
          Consultar via WhatsApp
        </a>
      </div>
    </section>
  );
}
