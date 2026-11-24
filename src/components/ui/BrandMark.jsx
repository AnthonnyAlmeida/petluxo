/* PetLuxo — BrandMark: medalha "PL" + nome da marca (layout desktop).
 * Só a parte visual: quem usa decide se é Link, botão ou texto. A medalha é
 * decorativa; o nome "PetLuxo" fica legível para leitores de tela. */

import { BRAND } from '../../data/siteContent.js';
import styles from './BrandMark.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

export function BrandMark({ size = 'md', seal = true, className }) {
  return (
    <span className={cx(styles.mark, size === 'lg' && styles.lg, className)}>
      {seal && (
        <svg className={styles.seal} viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false">
          <circle cx="20" cy="20" r="18.5" stroke="#C6A96B" strokeWidth="1.5"/>
          <circle cx="20" cy="20" r="14" stroke="#6B1E2B" strokeWidth="1"/>
          <text x="20" y="25" textAnchor="middle" className={styles.sealText}>{BRAND.monogram}</text>
        </svg>
      )}
      <span className={styles.name}>{BRAND.name}</span>
    </span>
  );
}
