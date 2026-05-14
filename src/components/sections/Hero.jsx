/* PetLuxo — Hero */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { TrustBadges } from '../ui/TrustBadges.jsx';
import heroImg from '../../../assets/hero/image-hero.png';

export function Hero() {
  return (
    <>
      <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow reveal in" style={{marginBottom:36}}>
            <span className="dot"></span>CURADORIA EXCLUSIVA · PARA QUEM EXIGE O MELHOR
          </div>
          <h1 className="serif hero-headline">
            <span className="line"><span>O luxo que</span></span>
            <span className="line"><span><i className="italic gold-text">ele merece,</i></span></span>
            <span className="line"><span>a elegância que você aprecia.</span></span>
          </h1>
          <p className="hero-sub">
            Cada peça da nossa coleção é selecionada com rigor, para pets que vivem com o mesmo padrão que seus donos.
          </p>
          <div className="hero-cta-row">
            <a className="btn btn-primary" href="#produtos">
              Ver produtos
              <Icon.ArrowR className="arr"/>
            </a>
          </div>
          <div className="hero-meta">
            <div><div className="k serif">Qualidade</div><div className="v">PREMIUM</div></div>
            <div><div className="k serif">Entrega</div><div className="v">TODO O BRASIL</div></div>
            <div><div className="k serif">Compra</div><div className="v">100% ONLINE</div></div>
          </div>
        </div>

        <div className="hero-stage">
          <div className="stage-ring r3"></div>
          <div className="stage-ring r1"></div>
          <div className="stage-ring r2"></div>
          <div className="logo-card" id="logoCard">
            <img src={heroImg} alt="PetLuxo"/>
            <div className="frame"></div>
            <div className="est">PETLUXO · BR</div>
            <div className="corner-tag">
              Produtos Premium
              <b>PetLuxo &mdash; Para o seu pet</b>
            </div>
          </div>
          <div className="float-card fc1">
            <div className="label">QUALIDADE</div>
            <div className="val serif italic">Curadoria exclusiva</div>
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
    <TrustBadges variant="banner" />
    </>
  );
}
