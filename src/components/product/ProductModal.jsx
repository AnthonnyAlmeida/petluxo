/* PetLuxo — ProductModal (Quick View) */

import React, { useState, useEffect } from 'react';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';
import { TrustBadges } from '../ui/TrustBadges.jsx';
import '../../styles/buttons.css';
import styles from './ProductModal.module.css';

export function ProductModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (product?.buyLinks?.length) {
      setSelectedSize(product.buyLinks[0].size);
    } else {
      setSelectedSize(null);
    }
  }, [product]);

  if (!product) return null;

  const activeBuyLink = product.buyLinks?.find((bl) => bl.size === selectedSize);
  const activePrice = product.prices?.find((p) => p.size === selectedSize);

  return (
    <div className={[styles.modal, product && styles.modalShow].filter(Boolean).join(' ')} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>×</button>
        <div className={styles.modalArt}>
          <img src={product.image} alt={product.name} className={styles.modalImg} />
        </div>
        <div className={styles.modalInfo}>
          <div className={styles.modalInfoHeader}>
            <h3 className="serif">{product.name}</h3>
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
              <div className={styles.sizeSelector}>
                <span className={styles.sizeSelectorLabel}>Selecione o tamanho:</span>
                <div className={styles.sizeSelectorBtns}>
                  {product.buyLinks.map((bl) => (
                    <button
                      key={bl.size}
                      className={[styles.sizeBtn, selectedSize === bl.size && styles.sizeBtnActive].filter(Boolean).join(' ')}
                      onClick={() => setSelectedSize(bl.size)}
                    >
                      {bl.size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={styles.modalScroll}>
            <p>{product.description}</p>
            {product.bullets && product.bullets.length > 0 && (
              <ul className={styles.modalBullets}>
                {product.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            )}
          </div>
          <div className={[styles.modalInfoFooter, styles.modalBtnStack].join(' ')}>
            {product.buyLinks ? (
              <>
                <a
                  className="btn btn-primary btn-full"
                  href={activeBuyLink?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  COMPRAR AGORA
                </a>
                <a className={styles.modalWaLink} href={wa(`Olá! Gostaria de mais informações sobre "${product.name}".`)} target="_blank" rel="noopener noreferrer">
                  <Icon.Wa className="wa-icon"/> CONSULTAR VIA WHATSAPP
                </a>
              </>
            ) : product.buyLink ? (
              <>
                <a className="btn btn-primary btn-full" href={product.buyLink} target="_blank" rel="noopener noreferrer">
                  COMPRAR AGORA
                </a>
                <a className={styles.modalWaLink} href={wa(`Olá! Gostaria de mais informações sobre "${product.name}".`)} target="_blank" rel="noopener noreferrer">
                  <Icon.Wa className="wa-icon"/> CONSULTAR VIA WHATSAPP
                </a>
              </>
            ) : (
              <a className="btn btn-primary btn-full" href={wa(`Olá! Gostaria de mais informações sobre "${product.name}".`)} target="_blank" rel="noopener noreferrer">
                <Icon.Wa className="wa-icon"/> CONSULTAR VIA WHATSAPP
              </a>
            )}
            <TrustBadges variant="modal" />
          </div>
        </div>
      </div>
    </div>
  );
}
