/* PetLuxo — Hero */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { TrustBadges } from '../ui/TrustBadges.jsx';
import heroImg from '../../../assets/hero/image-hero.webp';
import '../../styles/buttons.css';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <>
      <section className={styles.hero}>
      <div className={['wrap', styles.heroGrid].join(' ')}>
        <div>
          <div className="eyebrow reveal in" style={{marginBottom:36}}>
            <span className="dot"></span>CURADORIA EXCLUSIVA · PARA QUEM EXIGE O MELHOR
          </div>
          <h1 className={['serif', styles.heroHeadline].join(' ')}>
            <span className={styles.line}><span>O luxo que</span></span>
            <span className={styles.line}><span><i className="italic gold-text">ele merece,</i></span></span>
            <span className={styles.line}><span>a elegância que você aprecia.</span></span>
          </h1>
          <p className={styles.heroSub}>
            Cada peça da nossa coleção é selecionada com rigor, para pets que vivem com o mesmo padrão que seus donos.
          </p>
          <div className={styles.heroCtaRow}>
            <a className="btn btn-primary" href="#produtos">
              Ver produtos
              <Icon.ArrowR className="arr"/>
            </a>
          </div>
          <div className={styles.heroMeta}>
            <div><div className={[styles.k, 'serif'].join(' ')}>Qualidade</div><div className={styles.v}>PREMIUM</div></div>
            <div><div className={[styles.k, 'serif'].join(' ')}>Entrega</div><div className={styles.v}>TODO O BRASIL</div></div>
            <div><div className={[styles.k, 'serif'].join(' ')}>Compra</div><div className={styles.v}>100% ONLINE</div></div>
          </div>
        </div>

        <div className={styles.heroStage}>
          <div className={[styles.stageRing, styles.r3].join(' ')}></div>
          <div className={[styles.stageRing, styles.r1].join(' ')}></div>
          <div className={[styles.stageRing, styles.r2].join(' ')}></div>
          <div className={styles.logoCard} id="logoCard">
            <img src={heroImg} alt="PetLuxo"/>
            <div className={styles.frame}></div>
          </div>
          <div className={[styles.floatCard, styles.fc1].join(' ')}>
            <div className={styles.label}>QUALIDADE</div>
            <div className={[styles.val, 'serif', 'italic'].join(' ')}>Curadoria exclusiva</div>
          </div>
          <div className={[styles.floatCard, styles.fc2].join(' ')}>
            <div className={styles.label}>ENTREGA · BR</div>
            <div className={[styles.val, 'serif', 'italic'].join(' ')}>Todo o Brasil</div>
          </div>
        </div>
      </div>

      <div className={styles.scrollCue}>
        <span>Role para ver produtos</span>
        <span className={styles.bar}></span>
      </div>
    </section>
    <TrustBadges variant="banner" />
    </>
  );
}
