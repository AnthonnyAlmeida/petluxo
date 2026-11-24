/* PetLuxo — SectionTag: rótulo de seção do layout desktop
 * ("02 —— NOSSOS PRODUTOS"). Número e fio dourado são opcionais. */

import styles from './SectionTag.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

export function SectionTag({ num, line = true, tone = 'light', className, children }) {
  return (
    <div className={cx(styles.tag, tone === 'dark' && styles.dark, className)}>
      {num && <span>{num}</span>}
      {line && <span className={styles.line} aria-hidden="true"></span>}
      <span>{children}</span>
    </div>
  );
}
