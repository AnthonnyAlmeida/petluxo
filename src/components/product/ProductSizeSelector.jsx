/* PetLuxo — ProductSizeSelector
 * Seletor de tamanho para produtos com buyLinks. Compartilhado entre
 * ProductModal e ProductPage.
 */

import React from 'react';
import styles from './ProductSizeSelector.module.css';

export function ProductSizeSelector({ buyLinks, selectedSize, onSelect }) {
  if (!buyLinks?.length) return null;

  return (
    <div className={styles.sizeSelector}>
      <span className={styles.sizeSelectorLabel}>Selecione o tamanho:</span>
      <div className={styles.sizeSelectorBtns}>
        {buyLinks.map((bl) => (
          <button
            key={bl.size}
            type="button"
            className={[styles.sizeBtn, selectedSize === bl.size && styles.sizeBtnActive].filter(Boolean).join(' ')}
            onClick={() => onSelect(bl.size)}
          >
            {bl.size}
          </button>
        ))}
      </div>
    </div>
  );
}
