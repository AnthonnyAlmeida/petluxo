/* PetLuxo — TrustBadges: garantias sob o botão de compra da ficha
 * (layout desktop). Ícones de traço vinho + rótulo em mono caixa alta. */

import { Icon } from '../../icons.jsx';
import styles from './TrustBadges.module.css';

const BADGES_BANNER = [
  { Icon: Icon.Lock, label: 'Compra Segura' },
  { Icon: Icon.Return, label: 'Troca em 7 dias' },
  { Icon: Icon.Box, label: 'Entrega Rastreada' },
  { Icon: Icon.Wa, label: 'Atendimento Humanizado' },
];

export function TrustBadges() {
  return (
    <ul className={styles.badges} aria-label="Garantias de compra">
      {BADGES_BANNER.map(({ Icon: BadgeIcon, label }) => (
        <li key={label} className={styles.badge}>
          <BadgeIcon className={styles.icon} width="14" height="14"/>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
