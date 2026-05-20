/* PetLuxo — Story */

import React from 'react';
import sobreImg from '../../../assets/sobre_nos/sobre_nos.webp';
import styles from './Story.module.css';

export function Story() {
  return (
    <section className={styles.story} id="sobre">
      <div className={['wrap', styles.storyGrid].filter(Boolean).join(' ')}>
        <div className="reveal">
          <div className={styles.storyArt}>
            <img
              src={sobreImg}
              alt="Sobre a PetLuxo"
              style={{width:"100%", height:"100%", objectFit:"cover", display:"block"}}
            />
          </div>
        </div>

        <div className={styles.storyText}>
          <div className="section-tag reveal">
            <span className="num">03</span><span className="line"></span><span>SOBRE NÓS</span>
          </div>
          <p className={[styles.manifesto, 'reveal'].filter(Boolean).join(' ')}>
            Nascida da paixão por pets. Construída com propósito.
          </p>
          <h2 className="serif reveal d1">
            Onde o amor<br/><i className="italic gold-text">encontra o luxo</i><br/>que seu pet merece.
          </h2>
          <p className={[styles.lead, 'reveal', 'd2'].filter(Boolean).join(' ')}>
            A PetLuxo nasceu de um lugar genuíno — o amor pelos animais que fazem parte da nossa família e a vontade de oferecer a eles o melhor que existe.
          </p>
          <p className="reveal d3">
            Somos uma curadoria criteriosa de produtos sofisticados, funcionais e esteticamente refinados, pensados para tutores que enxergam seus pets como membros da família e não abrem mão de qualidade, design e exclusividade.
          </p>
          <p className="reveal d3">
            Cada peça da nossa coleção é escolhida com atenção aos detalhes: materiais nobres, acabamento impecável e aquele toque especial que transforma o dia a dia em uma experiência única.
          </p>
          <p className={[styles.assinatura, 'reveal', 'd4'].filter(Boolean).join(' ')}>
            Com carinho — Equipe PetLuxo
          </p>
        </div>
      </div>
    </section>
  );
}
