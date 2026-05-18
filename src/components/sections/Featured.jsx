/* PetLuxo — Featured */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { PRODUCTS } from '../../data/products.js';
import '../../styles/buttons.css';
import styles from './Featured.module.css';

export function Featured() {
  return (
    <section className={[styles.featured, 'section-pad'].filter(Boolean).join(' ')}>
      <div className={['wrap', styles.featuredGrid].filter(Boolean).join(' ')}>
        <div className={[styles.featuredStage, 'reveal'].filter(Boolean).join(' ')}>
          <span className={styles.featuredTag}>DESTAQUE</span>
          <img
            className={styles.featuredImg}
            src="/images/products/sofa-ortopedico.webp"
            alt="Sofá Ortopédico Lounge PetLuxo™"
          />
          <div className={styles.featuredPrice}>
            <div className="small">A PARTIR DE</div>
            <div className="v">R$ 349,90</div>
          </div>
        </div>
        <div className={styles.featuredInfo}>
          <div className="section-tag reveal d1">
            <span className="num">01</span><span className="line"></span><span>PRODUTO EM DESTAQUE</span>
          </div>
          <h2 className="serif reveal d2">
            Sofá Ortopédico Lounge <i className="italic gold-text">PetLuxo™</i>
          </h2>
          <p className={[styles.featuredSubtitle, 'reveal', 'd3'].filter(Boolean).join(' ')}>Conforto sofisticado para pets que merecem o extraordinário.</p>
          <p className="reveal d4">
            Transforme os momentos de descanso do seu pet em uma verdadeira experiência de conforto premium. Design moderno, estrutura ortopédica e acabamento sofisticado para ambientes refinados.
          </p>
          <div className="reveal d5" style={{display:"flex", gap:14, flexWrap:"wrap"}}>
            <a className="btn btn-primary" href={PRODUCTS.find(p => p.id === 13)?.buyLink} target="_blank" rel="noopener">
              COMPRAR AGORA <Icon.ArrowR className="arr"/>
            </a>
            <a className="btn btn-ghost" href="#produtos">VER TODOS OS PRODUTOS</a>
          </div>
        </div>
      </div>
    </section>
  );
}
