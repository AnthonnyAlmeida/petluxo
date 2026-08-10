/* PetLuxo — MinimalNavbar: header reduzido para a ProductPage.
 * Mostra só a marca (logo + link para a home) — sem menu de seções e sem
 * hambúrguer/drawer, já que não faz sentido oferecer navegação para
 * "Produtos"/"Sobre"/etc. quando o cliente já está numa ficha de produto. */

import React from 'react';
import navStyles from './Navbar.module.css';

export function MinimalNavbar() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={[navStyles.nav, scrolled && navStyles.navScrolled].filter(Boolean).join(' ')}>
      <div className="wrap">
        <a href="/" className={navStyles.brandMark}>
          <span className={navStyles.logoDisc}></span>
          <span><b>PETLUXO</b></span>
        </a>
      </div>
    </header>
  );
}
