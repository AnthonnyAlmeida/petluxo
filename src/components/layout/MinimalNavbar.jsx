/* PetLuxo — MinimalNavbar: cabeçalho reduzido (ficha, políticas, 404).
 * Marca (Link para a home) e WhatsApp, sem âncoras de seção nem hambúrguer,
 * já que elas só existem na home. Mesmo estilo e altura (--nav-h) da
 * Navbar. Abaixo de 768px: MobileHeader. */

import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';
import { NAV_TEXT, WA_MESSAGES } from '../../data/siteContent.js';
import { useIsMobile } from '../../hooks/useMediaQuery.js';
import { MobileHeader } from '../mobile/layout/MobileHeader.jsx';
import { BrandMark } from '../ui/BrandMark.jsx';
import '../../styles/buttons.css';
import navStyles from './Navbar.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

export function MinimalNavbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isMobile) return <MobileHeader padded/>;

  return (
    <header className={cx(navStyles.nav, scrolled && navStyles.navScrolled)}>
      <div className={cx('wrap', navStyles.inner)}>
        <Link to="/" className={navStyles.brand}>
          <BrandMark/>
        </Link>
        <a
          className="btn btn-ghost btn-sm"
          href={wa(WA_MESSAGES.general)} data-wa-origin="navbar"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon.Wa className="wa-icon"/>
          {NAV_TEXT.whatsapp}
        </a>
      </div>
    </header>
  );
}
