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
          <div className="modal-info-header">
            <h3 className="serif">{product.name}</h3>
            {product.originalPrice && (
              <div className="modal-price-original">{product.originalPrice}</div>
            )}
            {product.prices ? (
              <div className="price serif">
                {product.prices.map((p, i) => (
                  <div key={i}>{p.size} — {p.price}</div>
                ))}
              </div>
            ) : (
              <div className="price serif">{product.price}</div>
            )}
          </div>
          <div className="modal-scroll">
            <p>{product.description}</p>
            {product.bullets && product.bullets.length > 0 && (
              <ul className="modal-bullets">
                {product.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            )}
          </div>
          <div className="modal-info-footer modal-btn-stack">
            {product.buyLink && !product.prices ? (
              <>
                <a className="btn btn-primary btn-full" href={product.buyLink} target="_blank" rel="noopener noreferrer">
                  COMPRAR AGORA
                </a>
                <a className="btn btn-outline btn-full" href={wa(`Olá! Gostaria de mais informações sobre "${product.name}".`)} target="_blank" rel="noopener noreferrer">
                  <Icon.Wa className="wa-icon"/> CONSULTAR VIA WHATSAPP
                </a>
              </>
            ) : (
              <a className="btn btn-primary btn-full" href={wa(`Olá! Gostaria de mais informações sobre "${product.name}".`)} target="_blank" rel="noopener noreferrer">
                <Icon.Wa className="wa-icon"/> CONSULTAR VIA WHATSAPP
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
