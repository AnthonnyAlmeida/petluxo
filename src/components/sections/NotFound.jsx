/* PetLuxo — Página 404 */

import { Link } from 'react-router-dom';
import { Navbar } from '../layout/Navbar.jsx';
import { Footer } from '../layout/Footer.jsx';
import { useIsMobile } from '../../hooks/useMediaQuery.js';
import { MobileNotFound } from '../mobile/notfound/MobileNotFound.jsx';
import '../../styles/buttons.css';
import styles from './NotFound.module.css';

export function NotFound() {
  return (
    <div className={styles.notfound}>
      <div className={styles.notfoundInner}>
        <div className={[styles.notfoundNum, 'serif'].filter(Boolean).join(' ')}>404</div>
        <h1 className={['serif', styles.notfoundTitle].filter(Boolean).join(' ')}>
          Página não<br/><i className="italic gold-text">encontrada.</i>
        </h1>
        <p className={styles.notfoundSub}>
          A página que você procura não existe ou foi movida.<br/>
          Volte para a home e explore nossos produtos.
        </p>
        <Link className="btn btn-primary" to="/">
          Voltar para a home
        </Link>
      </div>
    </div>
  );
}

/* Página 404 completa: abaixo de 768px a tela mobile (sem Navbar/Footer
 * próprios); acima, Navbar + NotFound + Footer. */
export function NotFoundPage() {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileNotFound/>;
  return (
    <>
      <Navbar/>
      <main><NotFound/></main>
      <Footer/>
    </>
  );
}
