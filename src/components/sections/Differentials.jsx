/* PetLuxo — Differentials */

import { Icon } from '../../icons.jsx';
import { DIFFERENTIALS as DIFFS, DIFFERENTIALS_TAG } from '../../data/siteContent.js';
import styles from './Differentials.module.css';

export function Differentials() {
  return (
    <section className={[styles.diffs, 'section-pad'].filter(Boolean).join(' ')} id="diferenciais">
      <div className="wrap">
        <div className={['section-tag', 'reveal'].filter(Boolean).join(' ')}>
          <span className="num" style={{color:"var(--dourado)"}}>04</span>
          <span className="line" style={{background:"var(--dourado)"}}></span>
          <span>{DIFFERENTIALS_TAG}</span>
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
