/* PetLuxo — ProductModal (Quick View) */

import React, { useState, useEffect } from 'react';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';

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
              <div className="size-selector">
                <span className="size-selector__label">Selecione o tamanho:</span>
                <div className="size-selector__btns">
                  {product.buyLinks.map((bl) => (
                    <button
                      key={bl.size}
                      className={`size-btn${selectedSize === bl.size ? ' --active' : ''}`}
                      onClick={() => setSelectedSize(bl.size)}
                    >
                      {bl.size}
                    </button>
                  ))}
                </div>
              </div>
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
                <a className="btn btn-outline btn-full" href={wa(`Olá! Gostaria de mais informações sobre "${product.name}".`)} target="_blank" rel="noopener noreferrer">
                  <Icon.Wa className="wa-icon"/> CONSULTAR VIA WHATSAPP
                </a>
              </>
            ) : product.buyLink ? (
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
