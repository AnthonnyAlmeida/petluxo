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
          <div className="placeholder-mark">
            <span>
              IMAGEM DO PRODUTO · 4:5
              <b>Produto em Destaque</b>
            </span>
          </div>
          <div className="featured-price">
            <div className="small">A PARTIR DE</div>
            <div className="v">Consulte</div>
          </div>
        </div>
        <div className="featured-info">
          <div className="section-tag reveal d1">
            <span className="num">01</span><span className="line"></span><span>PRODUTO EM DESTAQUE</span>
          </div>
          <h2 className="serif reveal d2">
            Produto <i className="italic gold-text">em Destaque</i><br/>
            <span style={{fontSize:"0.5em", color:"var(--ink-soft)"}}>descrição do produto</span>
          </h2>
          <p className="reveal d3">
            Espaço reservado para a descrição do produto em destaque. Substitua por informações reais sobre materiais, tamanhos e características.
          </p>
          <div className="spec-list reveal d4">
            <div className="spec-row"><span className="k">Material</span><span className="v">A definir</span></div>
            <div className="spec-row"><span className="k">Tamanhos</span><span className="v">A definir</span></div>
            <div className="spec-row"><span className="k">Disponibilidade</span><span className="v">Consultar via WhatsApp</span></div>
          </div>
          <div className="reveal d5" style={{display:"flex", gap:14, flexWrap:"wrap"}}>
            <a className="btn btn-primary" href={wa("Olá! Tenho interesse no produto em destaque.")} target="_blank" rel="noopener">
              <Icon.Wa className="wa-icon"/> Consultar via WhatsApp <Icon.ArrowR className="arr"/>
            </a>
            <a className="btn btn-ghost" href="#produtos">Ver todos os produtos</a>
          </div>
        </div>
      </div>
    </section>
  );
}
