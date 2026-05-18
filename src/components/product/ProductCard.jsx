/* PetLuxo — ProductCard */

import React from 'react';
import { Icon } from '../../icons.jsx';
import styles from './ProductCard.module.css';

export function ProductCard({ product, index, onQuick }) {
  return (
    <article className={[styles.product, 'reveal', `d${(index % 5) + 1}`].filter(Boolean).join(' ')} onClick={() => onQuick(product)}>
      <div className={styles.stage}>
        <button className={styles.qaBtn} aria-label="Visualizar"><Icon.Plus/></button>
        <img src={product.image} alt={product.name} className={styles.productImg} loading="lazy" />
        {product.badge && (
          <span className={styles.badge}>{product.badge}</span>
        )}
      </div>
      <div className={styles.meta}>
        <div className={styles.name}>{product.shortName || product.name}</div>
        <div className={styles.priceCol}>
          {product.originalPrice && (
            <span className={styles.priceOriginal}>{product.originalPrice}</span>
          )}
          <div className={styles.price}>{product.price}</div>
          <small className={styles.priceVia}>
            {product.buyLink || product.buyLinks ? 'COMPRAR AGORA' : 'VIA WHATSAPP'}
          </small>
        </div>
      </div>
    </article>
  );
}
