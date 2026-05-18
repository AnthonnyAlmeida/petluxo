/* PetLuxo — Navbar */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';
import styles from './Navbar.module.css';

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={[styles.nav, scrolled && styles.navScrolled].filter(Boolean).join(' ')}>
      <div className={['wrap', styles.navInner].filter(Boolean).join(' ')}>
        <nav className={styles.navLeft}>
          <a href="#produtos" className={styles.navLink}>Produtos</a>
          <a href="#sobre" className={styles.navLink}>Sobre</a>
          <a href="#faq" className={styles.navLink}>FAQ</a>
          <a href="#contato" className={styles.navLink}>Contato</a>
        </nav>
        <a href="/" className={styles.brandMark}>
          <span className={styles.logoDisc}></span>
          <span><b>PETLUXO</b></span>
        </a>
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
        <a
          className={['btn', 'btn-primary', styles.navDrawerCta].filter(Boolean).join(' ')}
          href={wa("Olá! Vim do site PetLuxo e gostaria de mais informações.")}
          target="_blank"
          rel="noopener"
          onClick={close}
        >
          <Icon.Wa className="wa-icon"/> Falar no WhatsApp
        </a>
      </div>
    </header>
  );
}
