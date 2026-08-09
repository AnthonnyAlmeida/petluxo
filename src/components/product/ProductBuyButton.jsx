/* PetLuxo — ProductBuyButton
 * Lógica de 3 estados do botão de compra, compartilhada entre ProductModal
 * e ProductPage:
 * 1. badge === 'ESGOTADO'  → botão desabilitado + WhatsApp
 * 2. buyLinks (com tamanho)→ COMPRAR AGORA no link do tamanho ativo + WhatsApp
 * 3. buyLink único         → COMPRAR AGORA direto + WhatsApp
 * 4. nenhum link de compra → apenas WhatsApp
 */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';
import '../../styles/buttons.css';
import styles from './ProductBuyButton.module.css';

export function ProductBuyButton({ product, activeBuyLink }) {
  const waLink = wa(`Olá! Gostaria de mais informações sobre "${product.name}".`);

  if (product.badge === 'ESGOTADO') {
    return (
      <>
        <button
          className="btn btn-primary btn-full"
          disabled
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
        >
          ESGOTADO
        </button>
        <a className={styles.waLink} href={waLink} target="_blank" rel="noopener noreferrer">
          <Icon.Wa className="wa-icon"/> CONSULTAR VIA WHATSAPP
        </a>
      </>
    );
  }

  if (product.buyLinks) {
    return (
      <>
        <a
          className="btn btn-primary btn-full"
          href={activeBuyLink?.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          COMPRAR AGORA
        </a>
        <a className={styles.waLink} href={waLink} target="_blank" rel="noopener noreferrer">
          <Icon.Wa className="wa-icon"/> CONSULTAR VIA WHATSAPP
        </a>
      </>
    );
  }

  if (product.buyLink) {
    return (
      <>
        <a className="btn btn-primary btn-full" href={product.buyLink} target="_blank" rel="noopener noreferrer">
          COMPRAR AGORA
        </a>
        <a className={styles.waLink} href={waLink} target="_blank" rel="noopener noreferrer">
          <Icon.Wa className="wa-icon"/> CONSULTAR VIA WHATSAPP
        </a>
      </>
    );
  }

  return (
    <a className="btn btn-primary btn-full" href={waLink} target="_blank" rel="noopener noreferrer">
      <Icon.Wa className="wa-icon"/> CONSULTAR VIA WHATSAPP
    </a>
  );
}
