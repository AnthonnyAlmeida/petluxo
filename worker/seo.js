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

const MIN_SENTENCE = 60;

/* Palavras que não podem encerrar a frase (artigos, conjunções, preposições). */
const DANGLING_WORDS = new Set(['a', 'o', 'as', 'os', 'um', 'uma', 'e', 'ou', 'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'nos', 'nas', 'com', 'para', 'por', 'pelo', 'pela', 'que', 'ao', 'à']);
const TRAILING_PUNCT = /[\s,;:.\-–—]+$/;

/* Remove pontuação/espaço pendentes e, em seguida, palavras de ligação do final, repetindo. */
function trimDangling(text) {
  let out = text.replace(TRAILING_PUNCT, '');
  for (;;) {
    const i = out.lastIndexOf(' ');
    if (i < 0 || !DANGLING_WORDS.has(out.slice(i + 1).toLowerCase())) return out;
    out = out.slice(0, i).replace(TRAILING_PUNCT, '');
  }
}

/* Cabe inteiro: usa inteiro. Senão, corta no último fim de frase dentro de `max`
   (se tiver pelo menos MIN_SENTENCE caracteres); senão, corta por palavra com "…".
   Fim de frase: ".", "!" ou "?" seguido de espaço no texto original (assim "2.0" e "3.5 kg" não cortam). */
function truncate(text, max) {
  if (text.length <= max) return text;
  for (let i = max - 1; i + 1 >= MIN_SENTENCE; i -= 1) {
    const c = text[i];
    if ((c === '.' || c === '!' || c === '?') && text[i + 1] === ' ') return text.slice(0, i + 1);
  }
  const slice = text.slice(0, max + 1);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : text.slice(0, max);
  return trimDangling(cut) + '…';
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
