/* PetLuxo — BrandSeal: faixa "Por que escolher a PetLuxo?" da ficha
 * (layout desktop). Seis itens fixos (BRAND_SEAL) com ícones de traço.
 * Distinto de Differentials.jsx (seção editorial da home). */

import { Icon } from '../../icons.jsx';
import { BRAND_SEAL } from '../../data/siteContent.js';
import styles from './BrandSeal.module.css';

/* Na ordem de BRAND_SEAL.items: curadoria, envio, compra segura,
 * atendimento, conforto, qualidade. */
const ICONS = [Icon.Star, Icon.Truck, Icon.Shield, Icon.Wa, Icon.Heart, Icon.Rays];

export function BrandSeal() {
  return (
    <div className={styles.seal}>
      <h2 className={styles.title}>{BRAND_SEAL.title}</h2>
      <ul className={styles.grid}>
        {BRAND_SEAL.items.map((label, i) => {
          const SealIcon = ICONS[i] ?? Icon.Star; // item novo nos dados: ícone padrão
          return (
            <li key={label} className={styles.item}>
              <span className={styles.icon}><SealIcon width="20" height="20" strokeWidth="1.5"/></span>
              <span className={styles.label}>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
