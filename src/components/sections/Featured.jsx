/* PetLuxo — Featured */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { PRODUCTS } from '../../data/products.js';
import '../../styles/buttons.css';
import styles from './Featured.module.css';

function parsePriceValue(str) {
  return parseFloat(str.replace(/[^\d,]/g, '').replace(',', '.'));
}

function renderName(name) {
  const trademark = 'PetLuxo™';
  const idx = name.indexOf(trademark);
  if (idx === -1) return name;
  const before = name.slice(0, idx);
  const after = name.slice(idx + trademark.length);
  return (
    <>
      {before}<i className="italic gold-text">{trademark}</i>{after}
    </>
  );
}

export function Featured() {
  const product = PRODUCTS.find(p => p.featured === true);
  if (!product) return null;

  const lowestPrice = product.prices
    ? product.prices.reduce((min, p) => parsePriceValue(p.price) < parsePriceValue(min.price) ? p : min).price
    : product.price;
  const buyHref = product.buyLink || product.buyLinks?.[0]?.link;

  return (
    <section className={[styles.featured, 'section-pad'].filter(Boolean).join(' ')}>
      <div className={['wrap', styles.featuredGrid].filter(Boolean).join(' ')}>
        <div className={[styles.featuredStage, 'reveal'].filter(Boolean).join(' ')}>
          <span className={styles.featuredTag}>DESTAQUE</span>
          <img
            className={styles.featuredImg}
            src={product.image}
            alt={product.name}
          />
          <div className={styles.featuredPrice}>
            {product.prices && <div className="small">A PARTIR DE</div>}
            <div className="v">{lowestPrice}</div>
          </div>
        </div>
        <div className={styles.featuredInfo}>
          <div className="section-tag reveal d1">
            <span className="num">01</span><span className="line"></span><span>PRODUTO EM DESTAQUE</span>
          </div>
          <h2 className="serif reveal d2">
            {renderName(product.name)}
          </h2>
          <p className={[styles.featuredSubtitle, 'reveal', 'd3'].filter(Boolean).join(' ')}>{product.subtitle}</p>
          <p className="reveal d4">
            {product.description}
          </p>
          <div className="reveal d5" style={{display:"flex", gap:14, flexWrap:"wrap"}}>
            <a className="btn btn-primary" href={buyHref} target="_blank" rel="noopener">
              COMPRAR AGORA <Icon.ArrowR className="arr"/>
            </a>
            <a className="btn btn-ghost" href="#produtos">VER TODOS OS PRODUTOS</a>
          </div>
        </div>
      </div>
    </section>
  );
}
