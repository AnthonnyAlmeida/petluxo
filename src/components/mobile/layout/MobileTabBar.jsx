/* PetLuxo — MobileTabBar
 * Barra inferior fixa do layout mobile. Enquanto montada, reserva a altura
 * dela no fim da página (useReserveBottomBar). "Buscar" chama onSearch. */

import { Link, useLocation } from 'react-router-dom';
import { useReserveBottomBar } from '../../../hooks/useReserveBottomBar.js';
import { MIcon } from '../MobileIcons.jsx';
import { wa } from '../../../lib/whatsapp.js';
import { WA_MESSAGES } from '../../../data/siteContent.js';
import styles from './MobileTabBar.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

export function MobileTabBar({ onSearch, searchOpen = false, onHomeClick }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/' && !searchOpen;
  const isCatalog = pathname === '/produtos' && !searchOpen;
  useReserveBottomBar();

  return (
    <>
      <nav className={styles.mTabBar} aria-label="Navegação principal">
        <Link
          to="/"
          className={cx(styles.mTab, isHome && styles.mTabActive)}
          aria-current={isHome ? 'page' : undefined}
          onClick={onHomeClick}
        >
          <MIcon.Home/>
          <span>Início</span>
        </Link>
        <Link
          to="/produtos"
          className={cx(styles.mTab, isCatalog && styles.mTabActive)}
          aria-current={isCatalog ? 'page' : undefined}
        >
          <MIcon.Grid/>
          <span>Produtos</span>
        </Link>
        <button
          type="button"
          className={cx(styles.mTab, searchOpen && styles.mTabActive)}
          aria-expanded={searchOpen}
          onClick={onSearch}
        >
          <MIcon.Search/>
          <span>Buscar</span>
        </button>
        <a
          className={cx(styles.mTab, styles.mTabWa)}
          href={wa(WA_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar pelo WhatsApp"
        >
          <span className={styles.mTabPill} aria-hidden="true"><MIcon.Wa size={18}/></span>
          <span>WhatsApp</span>
        </a>
      </nav>
    </>
  );
}
