/* PetLuxo — SEO por produto: funções puras (sem HTMLRewriter), testáveis em Node.
 * Usadas por worker/index.js; scripts/check-seo.js as testa. */

import { PRODUCTS } from '../src/data/products.js';

export const SITE = 'https://www.petluxostory.com.br';

const MAX_DESCRIPTION = 155;

/* Reconhece só /produto/<dígitos> (com ou sem barra final).
 * canonical=false se houver zero à esquerda ou barra final. */
export function parseProductPath(pathname) {
  const match = /^\/produto\/(\d+)(\/)?$/.exec(pathname);
  if (!match) return null;
  const digits = match[1];
  const trailingSlash = Boolean(match[2]);
  const leadingZero = String(Number(digits)) !== digits;
  return { id: Number(digits), canonical: !trailingSlash && !leadingZero };
}

/* Mesma regra do ProductPage.jsx: existe e visible !== false. */
export function findVisibleProduct(id) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product || product.visible === false) return null;
  return product;
}

function normalizeSpaces(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim();
}

/* Trunca no limite de palavra, com "…". */
function truncate(text, max) {
  if (text.length <= max) return text;
  const slice = text.slice(0, max + 1);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : text.slice(0, max);
  return cut.replace(/[\s,;:.\-–—]+$/, '') + '…';
}

export function buildProductMeta(product) {
  const base = normalizeSpaces(product.description) || normalizeSpaces(product.subtitle);
  return {
    title: `${product.name} | PetLuxo`,
    description: truncate(base, MAX_DESCRIPTION),
    url: `${SITE}/produto/${product.id}`,
    image: `${SITE}${product.image}`,
  };
}
