/* PetLuxo — Mensagem de WhatsApp de um produto
 * Mesmo texto no botão da ficha (ProductBuyButton) e na barra de compra do
 * layout mobile: nome, variação ("Tamanho: X"/"Cor: X") quando há buyLinks,
 * preço ativo (ou price) e link absoluto da ficha. */

import { wa } from './whatsapp.js';
import { WA_MESSAGES } from '../data/siteContent.js';

export function productWaLink(product, selectedSize, activePrice) {
  let variationText = '';
  if (product.buyLinks && selectedSize) {
    variationText =
      product.variationType === 'cor' ? `Cor: ${selectedSize}` : `Tamanho: ${selectedSize}`;
  }
  const priceText = activePrice ? activePrice.price : product.price;
  const productLink = `${window.location.origin}/produto/${product.id}`;
  const message = `${WA_MESSAGES.product(product.name)}${variationText ? `\n\n${variationText}` : ''}\nPreço: ${priceText}\nLink: ${productLink}`;
  return wa(message);
}
