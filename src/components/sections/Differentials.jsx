/* PetLuxo — Differentials */

import React from 'react';
import { Icon } from '../../icons.jsx';

const DIFFS = [
  { num: "01", title: "Qualidade garantida",          body: "Produtos selecionados com atenção à qualidade dos materiais, durabilidade e conforto para o seu animal." },
  { num: "02", title: "Atendimento via WhatsApp",      body: "Tire suas dúvidas e acompanhe seu pedido pelo WhatsApp. Atendimento direto, rápido e personalizado." },
  { num: "03", title: "Entrega em todo o Brasil",      body: "Enviamos para qualquer cidade do Brasil com embalagem cuidadosa e rastreamento garantido." },
  { num: "04", title: "Produtos para toda rotina",     body: "Coleiras, camas, acessórios, higiene e mais. Tudo que o seu pet precisa no dia a dia." },
];

export function Differentials() {
  return (
    <section className="diffs section-pad" id="diferenciais">
      <div className="wrap">
        <div className="section-tag reveal">
          <span className="num" style={{color:"var(--dourado)"}}>04</span>
          <span className="line" style={{background:"var(--dourado)"}}></span>
          <span>POR QUE ESCOLHER A PETLUXO</span>
        </div>
        <h2 className="serif reveal d1">
          Quatro motivos.<br/>
          <i className="italic" style={{color:"var(--dourado)"}}>Para comprar agora.</i>
        </h2>
        <div className="diff-grid">
          {DIFFS.map((d, i) => (
            <div key={d.num} className={`diff-item reveal d${i + 1}`}>
              <div className="num">{d.num} / 04</div>
              <h3 className="serif">{d.title}</h3>
              <p>{d.body}</p>
              <div className="arr"><Icon.ArrowUp/></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
