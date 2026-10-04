/* PetLuxo — ProductCard */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../icons.jsx';
import { PRODUCT_DETAILS } from '../../data/productDetails.js';
import styles from './ProductCard.module.css';

export function ProductCard({ product, index, onQuick }) {
  const navigate = useNavigate();
  const hasFullDetails = Boolean(PRODUCT_DETAILS[product.id]);
  const handleClick = () => {
    if (hasFullDetails) {
      navigate(`/produto/${product.id}`);
    } else {
      onQuick(product);
    }
  };

  return (
    <article className={[styles.product, 'reveal', `d${(index % 5) + 1}`].filter(Boolean).join(' ')} onClick={handleClick}>
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
          {/* Legenda TEMPORÁRIA: enquanto o PagBank estiver desativado
              (HIDE_BUY_CTA em ProductBuyButton.jsx), todo o fluxo é WhatsApp. */}
          <small className={styles.priceVia}>
            VIA WHATSAPP
          </small>
        </div>
      </div>
    </article>
  );
}
