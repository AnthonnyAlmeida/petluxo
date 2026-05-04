/* PetLuxo — Story */

import React from 'react';

export function Story() {
  return (
    <section className="story" id="sobre">
      <div className="wrap story-grid">
        <div style={{position:"relative"}} className="reveal">
          <div className="story-art">
            <div className="ph-label">
              <span>IMAGEM DA MARCA · 4:5
                <b>PetLuxo</b>
              </span>
            </div>
          </div>
          <div className="story-overlap">
            <div className="quote-mark">&ldquo;</div>
            <p>Qualidade e cuidado em cada produto, porque o seu pet merece o melhor.</p>
            <div className="src">— PETLUXO</div>
          </div>
        </div>

        <div className="story-text">
          <div className="section-tag reveal">
            <span className="num">03</span><span className="line"></span><span>SOBRE NÓS</span>
          </div>
          <h2 className="serif reveal d1">
            Produtos de<br/><i className="italic gold-text">qualidade</i><br/>para pets.
          </h2>
          <p className="lead reveal d2">
            A PetLuxo oferece uma seleção de produtos premium para a vida com pets, com foco em qualidade, durabilidade e estilo.
          </p>
          <p className="reveal d3">
            Trabalhamos com materiais de qualidade e atenção ao detalhe em cada produto. Nossa missão é oferecer o melhor para o seu animal.
          </p>
          <p className="reveal d3">
            Atendimento direto e personalizado via WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}
