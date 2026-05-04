/* PetLuxo — CTA */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';

export function CTA() {
  return (
    <section className="cta section-pad" id="contato">
      <div className="cta-orn">
        <div className="ring r3"></div>
        <div className="ring r2"></div>
        <div className="ring r1"></div>
      </div>
      <div className="wrap cta-content">
        <div className="eyebrow reveal" style={{justifyContent:"center", display:"inline-flex"}}>
          <span className="dot"></span>ATENDIMENTO VIA WHATSAPP · SEG–SÁB
        </div>
        <h2 className="serif reveal d1">
          Pronto para<br/>
          <i className="italic gold-text">fazer seu pedido?</i>
        </h2>
        <p className="reveal d2">
          Entre em contato pelo WhatsApp. Respondemos rapidamente com informações sobre produtos, preços e entrega.
        </p>
        <div className="cta-row reveal d3">
          <a className="btn btn-primary" href={wa("Olá! Vim do site PetLuxo e gostaria de fazer um pedido.")} target="_blank" rel="noopener">
            <Icon.Wa className="wa-icon"/> Falar via WhatsApp <Icon.ArrowR className="arr"/>
          </a>
          <a className="btn btn-gold" href="#produtos">Ver produtos</a>
        </div>
        <div className="cta-meta reveal d4">
          <span><span className="dotg"></span>Resposta rápida</span>
          <span><span className="dotg"></span>Entrega em todo o Brasil</span>
          <span><span className="dotg"></span>Pagamento seguro</span>
        </div>
      </div>
    </section>
  );
}
