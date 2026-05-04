/* PetLuxo — Navbar */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <nav className="nav-left">
          <a href="#produtos" className="nav-link">Produtos</a>
          <a href="#sobre" className="nav-link">Sobre</a>
          <a href="#contato" className="nav-link">Contato</a>
        </nav>
        <a href="#" className="brand-mark">
          <span className="logo-disc"></span>
          <span><b>PETLUXO</b></span>
        </a>
        <div className="nav-right">
          <a className="btn btn-primary" href={wa("Olá! Vim do site PetLuxo e gostaria de mais informações.")} target="_blank" rel="noopener" style={{padding:"10px 18px", fontSize:11}}>
            <Icon.Wa className="wa-icon"/> WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
