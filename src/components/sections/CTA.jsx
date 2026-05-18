/* PetLuxo — CTA */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';
import '../../styles/buttons.css';
import styles from './CTA.module.css';

export function CTA() {
  return (
    <section className={[styles.cta, 'section-pad'].filter(Boolean).join(' ')} id="contato">
      <div className={styles.ctaOrn}>
        <div className={[styles.ring, styles.r3].filter(Boolean).join(' ')}></div>
        <div className={[styles.ring, styles.r2].filter(Boolean).join(' ')}></div>
        <div className={[styles.ring, styles.r1].filter(Boolean).join(' ')}></div>
      </div>
      <div className={[styles.ctaContent, 'wrap'].filter(Boolean).join(' ')}>
        <div className="eyebrow reveal" style={{justifyContent:"center", display:"inline-flex"}}>
          <span className="dot"></span>COMPRA SEGURA · ENTREGA EM TODO O BRASIL
        </div>
        <h2 className="serif reveal d1">
          Pronto para<br/>
          <i className="italic gold-text">começar a comprar?</i>
        </h2>
        <p className="reveal d2">
          Explore nossa coleção e finalize sua compra com segurança. Dúvidas? Estamos no WhatsApp.
        </p>
        <div className={[styles.ctaRow, 'reveal d3'].filter(Boolean).join(' ')}>
          <a className="btn btn-primary" href="#produtos">
            VER PRODUTOS <Icon.ArrowR className="arr"/>
          </a>
          <a className="btn btn-gold" href={wa("Olá! Gostaria de tirar uma dúvida sobre os produtos PetLuxo.")} target="_blank" rel="noopener">
            <Icon.Wa className="wa-icon"/> FALAR VIA WHATSAPP
          </a>
        </div>
        <div className={[styles.ctaMeta, 'reveal d4'].filter(Boolean).join(' ')}>
          <span><span className={styles.dotg}></span>Resposta rápida</span>
          <span><span className={styles.dotg}></span>Entrega em todo o Brasil</span>
          <span><span className={styles.dotg}></span>Pagamento seguro</span>
        </div>
      </div>
    </section>
  );
}
