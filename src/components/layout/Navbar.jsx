/* PetLuxo — Navbar (layout desktop, ≥ 768px)
 * Fixa no topo, com altura --nav-h e fundo com blur depois de rolar.
 * A partir de 1024px: marca, âncoras da home e WhatsApp numa linha. Abaixo
 * (iPad retrato): marca, WhatsApp e hambúrguer com gaveta de âncoras.
 * Abaixo de 768px: MobileChrome (cabeçalho + barra inferior do mobile). */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';
import { NAV_LINKS, NAV_TEXT, WA_MESSAGES } from '../../data/siteContent.js';
import { useIsMobile, usePrefersReducedMotion } from '../../hooks/useMediaQuery.js';
import { MobileChrome } from '../mobile/layout/MobileChrome.jsx';
import { BrandMark } from '../ui/BrandMark.jsx';
import '../../styles/buttons.css';
import styles from './Navbar.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const reduceMotion = usePrefersReducedMotion();
  const burgerRef = React.useRef(null);
  const drawerRef = React.useRef(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Gaveta aberta: Esc fecha e devolve o foco ao hambúrguer; toque ou clique
   * fora da gaveta e do hambúrguer também fecha (o foco fica onde o clique
   * o levou). Clicar num link da gaveta fecha por `close`. */
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      burgerRef.current?.focus();
    };
    const onPointerDown = (e) => {
      const t = e.target;
      if (drawerRef.current?.contains(t) || burgerRef.current?.contains(t)) return;
      setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  /* Na home o Link não troca de rota (ScrollToTop não dispara), então o clique
   * simples no logo rola ao topo. Cliques com tecla modificadora ou botão
   * não principal ficam com o navegador (nova aba/janela). */
  const onBrandClick = (e) => {
    if (pathname !== '/') return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  /* Abaixo de 768px: cabeçalho só com a marca + barra inferior. */
  if (isMobile) return <MobileChrome/>;

  return (
    <header className={cx(styles.nav, (scrolled || open) && styles.navScrolled)}>
      <div className={cx('wrap', styles.inner)}>
        <Link to="/" className={styles.brand} onClick={onBrandClick}>
          <BrandMark/>
        </Link>

        <nav aria-label={NAV_TEXT.ariaLabel} className={styles.links}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.link}>{l.label}</a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a
            className="btn btn-ghost btn-sm"
            href={wa(WA_MESSAGES.general)} data-wa-origin="navbar"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon.Wa className="wa-icon"/>
            {NAV_TEXT.whatsapp}
          </a>
          <button
            ref={burgerRef}
            type="button"
            className={cx(styles.burger, open && styles.burgerOpen)}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? NAV_TEXT.closeMenu : NAV_TEXT.openMenu}
            aria-expanded={open}
            aria-controls="nav-drawer"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div id="nav-drawer" ref={drawerRef} className={cx(styles.drawer, open && styles.drawerOpen)}>
        <nav aria-label={NAV_TEXT.ariaLabel} className={cx('wrap', styles.drawerLinks)}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.drawerLink} onClick={close}>{l.label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}
