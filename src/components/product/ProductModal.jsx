/* PetLuxo — ProductModal (Quick View) */

import React from 'react';
import { Link } from 'react-router-dom';
import { TrustBadges } from '../ui/TrustBadges.jsx';
import { PRODUCT_DETAILS } from '../../data/productDetails.js';
import { useProductBuy } from '../../hooks/useProductBuy.js';
import { ProductSizeSelector } from './ProductSizeSelector.jsx';
import { ProductBuyButton } from './ProductBuyButton.jsx';
import styles from './ProductModal.module.css';

export function ProductModal({ product, onClose }) {
  const { selectedSize, setSelectedSize, activeBuyLink, activePrice } = useProductBuy(product);

  if (!product) return null;

  const hasFullDetails = Boolean(PRODUCT_DETAILS[product.id]);

  return (
    <div className={[styles.modal, product && styles.modalShow].filter(Boolean).join(' ')} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>×</button>
        <div className={styles.modalArt}>
          <img src={product.image} alt={product.name} className={styles.modalImg} />
        </div>
        <div className={styles.modalInfo}>
          <div className={styles.modalInfoHeader}>
            <h3 className="serif">{product.shortName || product.name}</h3>
            {product.originalPrice && (
              <div className={styles.modalPriceOriginal}>{product.originalPrice}</div>
            )}
            {product.prices ? (
              <div className="price serif">
                {product.buyLinks && selectedSize
                  ? activePrice
                    ? <div>{activePrice.size} — {activePrice.price}</div>
                    : null
                  : product.prices.map((p, i) => (
                      <div key={i}>{p.size} — {p.price}</div>
                    ))
                }
              </div>
            ) : (
              <div className="price serif">{product.price}</div>
            )}
            {product.buyLinks && (
              <ProductSizeSelector buyLinks={product.buyLinks} selectedSize={selectedSize} onSelect={setSelectedSize} />
            )}
          </div>
          <div className={styles.modalScroll}>
            <p>{product.description}</p>
            {product.bullets && product.bullets.length > 0 && (
              <ul className={styles.modalBullets}>
                {product.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            )}
            {hasFullDetails && (
              <Link to={`/produto/${product.id}`} className={styles.fullDetailsLink} onClick={onClose}>
                Ver ficha completa →
              </Link>
            )}
          </div>
          <div className={[styles.modalInfoFooter, styles.modalBtnStack].join(' ')}>
            <ProductBuyButton product={product} activeBuyLink={activeBuyLink} />
            <TrustBadges variant="modal" />
          </div>
        </div>
      </div>
    </div>
  );
}
