/* PetLuxo — Página 404 */

import React from 'react';

export function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound-inner">
        <div className="notfound-num serif">404</div>
        <h1 className="serif notfound-title">
          Página não<br/><i className="italic gold-text">encontrada.</i>
        </h1>
        <p className="notfound-sub">
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
