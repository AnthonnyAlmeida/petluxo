/* PetLuxo — Differentials */

import React from 'react';
import { Icon } from '../../icons.jsx';
import styles from './Differentials.module.css';

const DIFFS = [
  { num: "01", title: "Qualidade garantida",          body: "Produtos selecionados com atenção à qualidade dos materiais, durabilidade e conforto para o seu animal." },
  { num: "02", title: "Atendimento via WhatsApp",      body: "Tire suas dúvidas e acompanhe seu pedido pelo WhatsApp. Atendimento direto, rápido e personalizado." },
  { num: "03", title: "Entrega em todo o Brasil",      body: "Enviamos para qualquer cidade do Brasil com embalagem cuidadosa e rastreamento garantido." },
  { num: "04", title: "Curadoria premium",     body: "Cada produto é selecionado com um olhar criterioso: design refinado, materiais nobres e aquele toque especial que transforma o dia a dia em uma experiência única." },
];

export function Differentials() {
  return (
    <section className={[styles.diffs, 'section-pad'].filter(Boolean).join(' ')} id="diferenciais">
      <div className="wrap">
        <div className={['section-tag', 'reveal'].filter(Boolean).join(' ')}>
          <span className="num" style={{color:"var(--dourado)"}}>04</span>
          <span className="line" style={{background:"var(--dourado)"}}></span>
          <span>POR QUE ESCOLHER A PETLUXO</span>
        </div>
        <h2 className={['serif', 'reveal', 'd1'].filter(Boolean).join(' ')}>
          Quatro motivos.<br/>
          <i className="italic" style={{color:"var(--dourado)"}}>Para comprar agora.</i>
        </h2>
        <div className={styles.diffGrid}>
          {DIFFS.map((d, i) => (
            <div key={d.num} className={[styles.diffItem, 'reveal', `d${i + 1}`].filter(Boolean).join(' ')}>
              <div className={styles.num}>{d.num} / 04</div>
              <h3 className="serif">{d.title}</h3>
              <p>{d.body}</p>
              <div className={styles.arr}><Icon.ArrowUp/></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
