/* PetLuxo — Story */

import React from 'react';
import sobreImg from '../../../assets/sobre_nos/foto_sobre_nos.jpeg';

export function Story() {
  return (
    <section className="story" id="sobre">
      <div className="wrap story-grid">
        <div className="reveal">
          <div className="story-art">
            <img
              src={sobreImg}
              alt="Sobre a PetLuxo"
              style={{width:"100%", height:"100%", objectFit:"cover", display:"block"}}
            />
          </div>
        </div>

        <div className="story-text">
          <div className="section-tag reveal">
            <span className="num">03</span><span className="line"></span><span>SOBRE NÓS</span>
          </div>
          <h2 className="serif reveal d1">
            Onde o amor<br/><i className="italic gold-text">encontra o luxo</i><br/>que seu pet merece.
          </h2>
          <p className="lead reveal d2">
            Na PetLuxo, acreditamos que o cuidado com os nossos pets vai muito além do básico. É uma expressão de amor, estilo e atenção aos detalhes.
          </p>
          <p className="reveal d3">
            Somos uma curadoria apaixonada por selecionar produtos exclusivos, sofisticados e funcionais, pensados para proporcionar conforto, bem-estar e elegância aos pets que fazem parte da família.
          </p>
          <p className="reveal d3">
            Cada item da nossa coleção é escolhido com um olhar criterioso, unindo design refinado, qualidade superior e aquele toque especial que transforma o dia a dia em uma experiência única.
          </p>
        </div>
      </div>
    </section>
  );
}
