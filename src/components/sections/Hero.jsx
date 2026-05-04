/* PetLuxo — Hero */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';
import heroPet from '../../../assets/hero/hero-pet.png';

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow reveal in" style={{marginBottom:36}}>
            <span className="dot"></span>PRODUTOS PARA PETS · QUALIDADE PREMIUM
          </div>
          <h1 className="serif hero-headline">
            <span className="line"><span>Produtos</span></span>
            <span className="line"><span><i className="italic gold-text">premium</i></span></span>
            <span className="line"><span>para o seu pet.</span></span>
          </h1>
          <p className="hero-sub">
            PetLuxo oferece produtos de qualidade para a vida com pets. Elegância, durabilidade e conforto em cada item.
          </p>
          <div className="hero-cta-row">
            <a className="btn btn-primary" href={wa("Olá! Vim do site PetLuxo e gostaria de fazer um pedido.")} target="_blank" rel="noopener">
              <Icon.Wa className="wa-icon"/> Pedir via WhatsApp
              <Icon.ArrowR className="arr"/>
            </a>
            <a className="btn btn-ghost" href="#produtos">
              Ver produtos
            </a>
          </div>
          <div className="hero-meta">
            <div><div className="k serif">Qualidade</div><div className="v">Garantida</div></div>
            <div><div className="k serif">Entrega</div><div className="v">Todo o Brasil</div></div>
            <div><div className="k serif">São Paulo</div><div className="v">Origem</div></div>
          </div>
        </div>

        <div className="hero-stage">
          <div className="stage-ring r3"></div>
          <div className="stage-ring r1"></div>
          <div className="stage-ring r2"></div>
          <div className="logo-card" id="logoCard">
            <img src={heroPet} alt="PetLuxo"/>
            <div className="frame"></div>
            <div className="est">PETLUXO · BR</div>
            <div className="corner-tag">
              Produtos Premium
              <b>PetLuxo &mdash; Para o seu pet</b>
            </div>
          </div>
          <div className="float-card fc1">
            <div className="label">QUALIDADE</div>
            <div className="val serif italic">Materiais selecionados</div>
          </div>
          <div className="float-card fc2">
            <div className="label">ENTREGA · BR</div>
            <div className="val serif italic">Todo o Brasil</div>
          </div>
        </div>
      </div>

      <div className="scroll-cue">
        <span>Role para ver produtos</span>
        <span className="bar"></span>
      </div>
    </section>
  );
}
