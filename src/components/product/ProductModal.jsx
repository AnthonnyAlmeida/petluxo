/* PetLuxo — ProductModal (Quick View) */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';

export function ProductModal({ product, onClose }) {
  if (!product) return null;
  return (
    <div className={`modal ${product ? "show" : ""}`} onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-art">
          <img src={product.image} alt={product.name} className="modal-img" />
        </div>
        <div className="modal-info">
          <h3 className="serif">{product.name}</h3>
          {product.originalPrice && (
            <div className="modal-price-original">{product.originalPrice}</div>
          )}
          <div className="price serif">{product.price}</div>
          <p>{product.description}</p>
          {product.bullets && product.bullets.length > 0 && (
            <ul className="modal-bullets">
              {product.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
          <div className="row">
            <a className="btn btn-primary" href={wa(`Olá! Gostaria de mais informações sobre "${product.name}".`)} target="_blank" rel="noopener">
              <Icon.Wa className="wa-icon"/> Consultar
            </a>
            <button className="btn btn-ghost" onClick={onClose}>Continuar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
