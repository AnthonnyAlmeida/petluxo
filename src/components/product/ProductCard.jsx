/* PetLuxo — ProductCard */

import React from 'react';
import { Icon } from '../../icons.jsx';

export function ProductCard({ product, index, onQuick }) {
  return (
    <article className={`product reveal d${(index % 5) + 1}`} onClick={() => onQuick(product)}>
      <div className="stage">
        <button className="qa-btn" aria-label="Visualizar"><Icon.Plus/></button>
        <img src={product.image} alt={product.name} className="product-img" />
        {product.badge && (
          <span className="badge">{product.badge}</span>
        )}
      </div>
      <div className="meta">
        <div className="name">{product.name}</div>
        <div className="price-col">
          {product.originalPrice && (
            <span className="price-original">{product.originalPrice}</span>
          )}
          <div className="price">{product.price}<small>via WhatsApp</small></div>
        </div>
      </div>
    </article>
  );
}
