/* PetLuxo — Featured */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';

export function Featured() {
  return (
    <section className="featured section-pad">
      <div className="wrap featured-grid">
        <div className="featured-stage reveal">
          <span className="featured-tag">DESTAQUE</span>
          <img
            className="featured-img"
            src="/images/products/produtodestaquepetluxo.jpeg"
            alt="Sofá PetLuxo Essence"
          />
          <div className="featured-price">
            <div className="small">A PARTIR DE</div>
            <div className="v">R$ 497,00</div>
          </div>
        </div>
        <div className="featured-info">
          <div className="section-tag reveal d1">
            <span className="num">01</span><span className="line"></span><span>PRODUTO EM DESTAQUE</span>
          </div>
          <h2 className="serif reveal d2">
            Sofá PetLuxo <i className="italic gold-text">Essence</i>
          </h2>
          <p className="featured-subtitle reveal d3">Conforto e Sofisticação para o Seu Pet</p>
          <p className="reveal d4">
            Seu pet merece um espaço tão especial quanto ele é. O Sofá Essence foi criado para quem não abre mão do bom gosto, nem para os membros mais peludos da família.
          </p>
          <div className="reveal d5" style={{display:"flex", gap:14, flexWrap:"wrap"}}>
            <a className="btn btn-primary" href={wa("Olá! Tenho interesse no Sofá PetLuxo Essence.")} target="_blank" rel="noopener">
              <Icon.Wa className="wa-icon"/> Consultar via WhatsApp <Icon.ArrowR className="arr"/>
            </a>
            <a className="btn btn-ghost" href="#produtos">Ver todos os produtos</a>
          </div>
        </div>
      </div>
    </section>
  );
}
