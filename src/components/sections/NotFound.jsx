/* PetLuxo — Página 404 */

import React from 'react';
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
        <a className="btn btn-primary" href="/">
          Voltar para a home
        </a>
      </div>
    </div>
  );
}
