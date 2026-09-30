/* PetLuxo — ProductSizeSelector
 * Seletor de variação para produtos com buyLinks. Compartilhado entre
 * ProductModal e ProductPage.
 *
 * `variationType` é opcional e defaulta para tamanho ('tamanho'/'cor').
 * Quando 'cor', os botões passam a exibir um swatch com a cor medida do
 * produto (campo `color` de cada buyLink) ao lado do nome da variação —
 * o texto exibido continua sendo `buyLink.size` ('Cinza', 'Rosa', 'Tam. M'…),
 * sem prefixo de "Tam." para cor.
 */

import React from 'react';
import styles from './ProductSizeSelector.module.css';

export function ProductSizeSelector({ buyLinks, selectedSize, onSelect, variationType }) {
  if (!buyLinks?.length) return null;

  const isColor = variationType === 'cor';

  return (
    <div className={styles.sizeSelector}>
      <span className={styles.sizeSelectorLabel}>{isColor ? 'Selecione a cor:' : 'Selecione o tamanho:'}</span>
      <div className={styles.sizeSelectorBtns}>
        {buyLinks.map((bl) => (
          <button
            key={bl.size}
            type="button"
            className={[styles.sizeBtn, selectedSize === bl.size && styles.sizeBtnActive].filter(Boolean).join(' ')}
            onClick={() => onSelect(bl.size)}
            aria-pressed={selectedSize === bl.size}
          >
            {isColor && bl.color && <span className={styles.swatch} style={{ background: bl.color }}/>}
            {bl.size}
          </button>
        ))}
      </div>
    </div>
  );
}
