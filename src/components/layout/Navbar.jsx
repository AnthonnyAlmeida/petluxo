/* PetLuxo — Navbar */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';

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
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <nav className="nav-left">
          <a href="#produtos" className="nav-link">Produtos</a>
          <a href="#sobre" className="nav-link">Sobre</a>
          <a href="#contato" className="nav-link">Contato</a>
        </nav>
        <a href="/" className="brand-mark">
          <span className="logo-disc"></span>
          <span><b>PETLUXO</b></span>
        </a>
        <div className="nav-right">
          <a className="btn btn-primary" href={wa("Olá! Vim do site PetLuxo e gostaria de mais informações.")} target="_blank" rel="noopener" style={{padding:"10px 18px", fontSize:11}}>
            <Icon.Wa className="wa-icon"/> WhatsApp
          </a>
        </div>
        <button
          className={`nav-burger${open ? " open" : ""}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`nav-drawer${open ? " open" : ""}`} aria-hidden={!open}>
        <nav className="nav-drawer-links">
          <a href="#produtos" className="nav-drawer-link" onClick={close}>Produtos</a>
          <a href="#sobre" className="nav-drawer-link" onClick={close}>Sobre</a>
          <a href="#contato" className="nav-drawer-link" onClick={close}>Contato</a>
        </nav>
        <a
          className="btn btn-primary nav-drawer-cta"
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
