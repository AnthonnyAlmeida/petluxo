/* PetLuxo — TrustStrip: faixa de confiança logo abaixo da Hero (desktop).
 * Os quatro títulos de DIFFERENTIALS (mesmo texto da seção Diferenciais),
 * cada um com um ícone de traço. */

import { Icon } from '../../icons.jsx';
import { DIFFERENTIALS, TRUST_STRIP_LABEL } from '../../data/siteContent.js';
import styles from './TrustStrip.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

/* Na ordem de DIFFERENTIALS: qualidade, atendimento, entrega, curadoria. */
const ICONS = [Icon.Shield, Icon.Wa, Icon.Truck, Icon.Star];

export function TrustStrip() {
  return (
    <section className={styles.strip} aria-label={TRUST_STRIP_LABEL}>
      <ul className={cx('wrap', styles.grid)}>
        {DIFFERENTIALS.map((d, i) => {
          const TrustIcon = ICONS[i] ?? Icon.Star; // item novo nos dados: ícone padrão
          return (
            <li key={d.num} className={styles.item}>
              <span className={styles.icon}><TrustIcon width="20" height="20" strokeWidth="1.5"/></span>
              <span className={styles.label}>{d.title}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
