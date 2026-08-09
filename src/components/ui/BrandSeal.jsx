/* PetLuxo — BrandSeal
 * Selo fixo "Por que escolher a PetLuxo?" — bloco de confiança compacto e
 * reutilizável, sem props de produto, mesmo padrão de TrustBadges.jsx.
 *
 * Distinto de Differentials.jsx: aquela é a seção editorial da home (4
 * itens, formato de seção completa). Este é um bloco denso com 6 itens
 * fixos, pensado para caber dentro da ficha de um produto (ProductPage).
 */

import React from 'react';
import styles from './BrandSeal.module.css';

const SEAL_ITEMS = [
  { emoji: '🤎', label: 'Curadoria de produtos premium' },
  { emoji: '🚚', label: 'Envio para todo o Brasil' },
  { emoji: '🛡️', label: 'Compra segura' },
  { emoji: '💬', label: 'Atendimento personalizado' },
  { emoji: '🐾', label: 'Produtos selecionados pensando no conforto do seu pet' },
  { emoji: '✨', label: 'Qualidade e elegância em cada detalhe' },
];

export function BrandSeal() {
  return (
    <div className={styles.seal}>
      <span className={styles.title}>Por que escolher a PetLuxo?</span>
      <div className={styles.grid} role="list">
        {SEAL_ITEMS.map((item) => (
          <div key={item.label} className={styles.item} role="listitem">
            <span className={styles.emoji} aria-hidden="true">{item.emoji}</span>
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
