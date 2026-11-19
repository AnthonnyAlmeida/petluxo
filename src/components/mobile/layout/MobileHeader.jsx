/* PetLuxo — MobileHeader: logo circular + PETLUXO, link para a home. */

import { Link } from 'react-router-dom';
import styles from './MobileHeader.module.css';

export function MobileBrand({ onClick }) {
  return (
    <Link to="/" className={styles.mBrand} onClick={onClick} aria-label="PetLuxo, página inicial">
      <span className={styles.mBrandDisc} aria-hidden="true"></span>
      <span className={styles.mBrandName} aria-hidden="true">PETLUXO</span>
    </Link>
  );
}

export function MobileHeader({ padded = false, onBrandClick }) {
  return (
    <header className={[styles.mHeader, padded && styles.mHeaderPadded].filter(Boolean).join(' ')}>
      <MobileBrand onClick={onBrandClick}/>
    </header>
  );
}
