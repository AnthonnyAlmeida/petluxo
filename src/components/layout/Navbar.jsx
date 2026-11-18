/* PetLuxo — Navbar */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';
import '../../styles/buttons.css';
import styles from './Navbar.module.css';

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { pathname } = useLocation();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  /* Na home o Link não troca de rota (ScrollToTop não dispara), então o clique
   * simples no logo rola ao topo. Cliques com tecla modificadora ou botão
   * não principal ficam com o navegador (nova aba/janela). */
  const onBrandClick = (e) => {
    if (pathname !== '/') return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={[styles.nav, scrolled && styles.navScrolled].filter(Boolean).join(' ')}>
      <div className={['wrap', styles.navInner].filter(Boolean).join(' ')}>
        <nav className={styles.navLeft}>
          <a href="#produtos" className={styles.navLink}>Produtos</a>
          <a href="#sobre" className={styles.navLink}>Sobre</a>
          <a href="#faq" className={styles.navLink}>FAQ</a>
          <a href="#contato" className={styles.navLink}>Contato</a>
        </nav>
        <Link to="/" className={styles.brandMark} onClick={onBrandClick}>
          <span className={styles.logoDisc}></span>
          <span><b>PETLUXO</b></span>
        </Link>
        <div className={styles.navRight}>
          <a className="btn btn-primary" href={wa("Olá! Vim do site PetLuxo e gostaria de mais informações.")} target="_blank" rel="noopener" style={{padding:"10px 18px", fontSize:11}}>
            <Icon.Wa className="wa-icon"/> WhatsApp
          </a>
        </div>
        <button
          className={[styles.navBurger, open && styles.navBurgerOpen].filter(Boolean).join(' ')}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={[styles.navDrawer, open && styles.navDrawerOpen].filter(Boolean).join(' ')} aria-hidden={!open}>
        <nav className={styles.navDrawerLinks}>
          <a href="#produtos" className={styles.navDrawerLink} onClick={close}>Produtos</a>
          <a href="#sobre" className={styles.navDrawerLink} onClick={close}>Sobre</a>
          <a href="#faq" className={styles.navDrawerLink} onClick={close}>FAQ</a>
          <a href="#contato" className={styles.navDrawerLink} onClick={close}>Contato</a>
        </nav>
      </div>
    </header>
  );
}
