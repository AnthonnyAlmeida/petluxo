/* PetLuxo — Featured */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { PRODUCTS } from '../../data/products.js';

export function Featured() {
  return (
    <section className="featured section-pad">
      <div className="wrap featured-grid">
        <div className="featured-stage reveal">
          <span className="featured-tag">DESTAQUE</span>
          <img
            className="featured-img"
            src="/images/products/sofa-ortopedico.jpeg"
            alt="Sofá Ortopédico Lounge PetLuxo™"
          />
          <div className="featured-price">
            <div className="small">A PARTIR DE</div>
            <div className="v">R$ 349,90</div>
          </div>
        </div>
        <div className="featured-info">
          <div className="section-tag reveal d1">
            <span className="num">01</span><span className="line"></span><span>PRODUTO EM DESTAQUE</span>
          </div>
          <h2 className="serif reveal d2">
            Sofá Ortopédico Lounge <i className="italic gold-text">PetLuxo™</i>
          </h2>
          <p className="featured-subtitle reveal d3">Conforto sofisticado para pets que merecem o extraordinário.</p>
          <p className="reveal d4">
            Transforme os momentos de descanso do seu pet em uma verdadeira experiência de conforto premium. Design moderno, estrutura ortopédica e acabamento sofisticado para ambientes refinados.
          </p>
          <div className="reveal d5" style={{display:"flex", gap:14, flexWrap:"wrap"}}>
            <a className="btn btn-primary" href={PRODUCTS.find(p => p.id === 13)?.buyLink} target="_blank" rel="noopener">
              COMPRAR AGORA <Icon.ArrowR className="arr"/>
            </a>
            <a className="btn btn-ghost" href="#produtos">VER TODOS OS PRODUTOS</a>
          </div>
        </div>
      </div>
    </section>
  );
}
