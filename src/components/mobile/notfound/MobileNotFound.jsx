/* PetLuxo — MobileNotFound (404 abaixo de 768px)
 * Trilha de pegadas que se perde + "?", com os botões para a home e para
 * /produtos (Link do react-router). Rotas inexistentes e produtos
 * inexistentes ou ocultos caem aqui. */

import { Link } from 'react-router-dom';
import { MobileTabBar } from '../layout/MobileTabBar.jsx';
import { Paw } from '../ui/Paw.jsx';
import ui from '../ui/MobileUI.module.css';
import styles from './MobileNotFound.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

const STEPS = [[70, 330, 25], [112, 282, 25], [148, 326, 25], [196, 274, 22], [236, 318, 18], [286, 262, 10]];

export function MobileNotFound() {
  return (
    <>
      <main className={styles.mNf}>
        <div className={styles.mNfGlow} aria-hidden="true"></div>

        <svg className={styles.mNfArt} viewBox="0 0 390 400" aria-hidden="true" focusable="false">
          <path
            className={styles.mNfTrail}
            d="M30 350 C110 360 150 250 230 290 S330 230 352 150"
            fill="none"
            stroke="#C6A96B"
            strokeWidth="1"
            strokeOpacity="0.45"
            strokeDasharray="2 7"
          />
          {STEPS.map(([x, y, r], i) => (
            <Paw key={x} x={x} y={y} rotate={r} className={styles.mNfStep} style={{ animationDelay: `${i * 0.5}s` }}/>
          ))}
          <g className={styles.mNfQ}><text x="330" y="150">?</text></g>
        </svg>

        <div className={styles.mNfBody}>
          <p className={ui.mEyebrow}><span className={ui.mEyebrowDot} aria-hidden="true"></span>Erro 404</p>
          <h1 className={styles.mNfTitle}>Esta página <em>se perdeu</em> pelo caminho.</h1>
          <p className={styles.mNfText}>O endereço pode ter mudado ou não existir mais. Vamos te levar de volta.</p>
          <div className={styles.mNfActions}>
            <Link to="/" className={cx(ui.mBtn, ui.mBtnPrimary, ui.mBtnLs12)}>Voltar ao início</Link>
            <Link to="/produtos" className={cx(ui.mBtn, ui.mBtnOutline, ui.mBtnLs12)}>Ver produtos</Link>
          </div>
        </div>
      </main>
      <MobileTabBar/>
    </>
  );
}
