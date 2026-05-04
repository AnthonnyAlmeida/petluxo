/* PetLuxo — ProductModal (Quick View) */

import React from 'react';
import { PlaceholderArt } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';

export function ProductModal({ product, onClose }) {
  if (!product) return null;
  return (
    <div className={`modal ${product ? "show" : ""}`} onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-art">
          <div className="ph">
            <div style={{textAlign:"center"}}>
              <div style={{marginBottom:14, color:"var(--caramelo)"}}>{PlaceholderArt[product.art]}</div>
              {product.tag}
            </div>
          </div>
        </div>
        <div className="modal-info">
          <div className="eyebrow" style={{marginBottom:14}}><span className="dot"></span>{product.tag}</div>
          <h3 className="serif">{product.name}</h3>
          <div className="price serif">{product.price}</div>
          <p>{product.sub}. Entre em contato pelo WhatsApp para mais informações sobre tamanhos, disponibilidade e preços.</p>
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
