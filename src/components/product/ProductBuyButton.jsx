/* PetLuxo — ProductBuyButton
 * Lógica de 3 estados do botão de compra, usada pela
 * ProductPage:
 * 1. badge === 'ESGOTADO'  → botão desabilitado + WhatsApp
 * 2. buyLinks (com tamanho)→ COMPRAR AGORA no link do tamanho ativo + WhatsApp
 * 3. buyLink único         → COMPRAR AGORA direto + WhatsApp
 * 4. nenhum link de compra → apenas WhatsApp
 *
 * HIDE_BUY_CTA: interruptor TEMPORÁRIO que oculta apenas o CTA "COMPRAR
 * AGORA" (links PagBank), mantendo o CTA de WhatsApp exatamente como está.
 * Os links continuam gravados em products.js — só a interface que dá acesso
 * a eles é ocultada. Enquanto o CTA estiver oculto, o WhatsApp dos estados 2
 * e 3 assume o visual do antigo CTA principal (btn btn-primary btn-full), no
 * lugar de styles.waLink. Para reverter: constante para false + restaurar
 * className={styles.waLink} nesses dois WhatsApp.
 * Os estados 1 e 4 não são afetados: não têm CTA "COMPRAR AGORA".
 */
const HIDE_BUY_CTA = true;

import { Icon } from '../../icons.jsx';
import { productWaLink } from '../../lib/productMessage.js';
import '../../styles/buttons.css';
import styles from './ProductBuyButton.module.css';

export function ProductBuyButton({ product, activeBuyLink, selectedSize, activePrice }) {
  const waLink = productWaLink(product, selectedSize, activePrice);

  if (product.badge === 'ESGOTADO') {
    return (
      <>
        <button
          type="button"
          className="btn btn-primary btn-full"
          disabled
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
        {!HIDE_BUY_CTA && (
          <a
            className="btn btn-primary btn-full"
            href={activeBuyLink?.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            COMPRAR AGORA
          </a>
        )}
        <a className="btn btn-primary btn-full btn-raised" href={waLink} target="_blank" rel="noopener noreferrer">
          <Icon.Wa className="wa-icon"/> CONSULTAR VIA WHATSAPP
        </a>
      </>
    );
  }

  if (product.buyLink) {
    return (
      <>
        {!HIDE_BUY_CTA && (
          <a className="btn btn-primary btn-full" href={product.buyLink} target="_blank" rel="noopener noreferrer">
            COMPRAR AGORA
          </a>
        )}
        <a className="btn btn-primary btn-full btn-raised" href={waLink} target="_blank" rel="noopener noreferrer">
          <Icon.Wa className="wa-icon"/> CONSULTAR VIA WHATSAPP
        </a>
      </>
    );
  }

  return (
    <a className="btn btn-primary btn-full btn-raised" href={waLink} target="_blank" rel="noopener noreferrer">
      <Icon.Wa className="wa-icon"/> CONSULTAR VIA WHATSAPP
    </a>
  );
}
