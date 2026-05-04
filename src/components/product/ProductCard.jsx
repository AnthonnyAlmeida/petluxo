/* PetLuxo — ProductCard */

import React from 'react';
import { Icon, PlaceholderArt } from '../../icons.jsx';

export function ProductCard({ product, index, onQuick }) {
  return (
    <article className={`product reveal d${(index % 5) + 1}`} onClick={() => onQuick(product)}>
      <div className="stage">
        <span className="num">Nº 0{product.id}</span>
        <button className="qa-btn" aria-label="Visualizar"><Icon.Plus/></button>
        <div className="placeholder">
          {PlaceholderArt[product.art]}
          <span className="ph-label">{product.tag}</span>
        </div>
        {product.badge && (
          <span className={`badge ${product.badge === "ATELIER" ? "gold" : ""}`}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="meta">
        <div>
          <div className="name">{product.name}<small>{product.sub}</small></div>
        </div>
        <div className="price">{product.price}<small>via WhatsApp</small></div>
      </div>
    </article>
  );
}
