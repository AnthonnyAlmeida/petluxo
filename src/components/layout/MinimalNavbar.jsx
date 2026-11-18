/* PetLuxo — MinimalNavbar: header reduzido para a ProductPage.
 * Mostra só a marca (logo + link para a home) — sem menu de seções e sem
 * hambúrguer/drawer, já que não faz sentido oferecer navegação para
 * "Produtos"/"Sobre"/etc. quando o cliente já está numa ficha de produto. */

import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useMediaQuery.js';
import { MobileHeader } from '../mobile/layout/MobileHeader.jsx';
import navStyles from './Navbar.module.css';

export function MinimalNavbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isMobile) return <MobileHeader padded/>;

  return (
    <header className={[navStyles.nav, scrolled && navStyles.navScrolled].filter(Boolean).join(' ')}>
      <div className="wrap">
        <Link to="/" className={navStyles.brandMark}>
          <span className={navStyles.logoDisc}></span>
          <span><b>PETLUXO</b></span>
        </Link>
      </div>
    </header>
  );
}
