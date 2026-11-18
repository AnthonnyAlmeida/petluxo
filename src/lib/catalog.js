/* PetLuxo — Consultas ao catálogo
 * Regras de exibição compartilhadas entre o layout desktop e o mobile:
 * visibilidade, ordem por categoryOrder, mais vendidos, destaque, busca e
 * preços. Só lê src/data/products.js (o painel admin reescreve aquele
 * arquivo; nada aqui depende do formato dele além dos campos existentes). */

import { CATEGORIES, PRODUCTS } from '../data/products.js';

export const isVisible = (p) => p.visible !== false;

export const VISIBLE_PRODUCTS = PRODUCTS.filter(isVisible);

/* Produtos visíveis de uma categoria, do maior para o menor peso. */
export function productsInCategory(categoryId) {
  return VISIBLE_PRODUCTS
    .filter((p) => p.category.includes(categoryId))
    .sort((a, b) => (b.categoryOrder?.[categoryId] ?? 0) - (a.categoryOrder?.[categoryId] ?? 0));
}

export const BEST_SELLERS = productsInCategory('mais-vendidos');

/* Categorias visíveis que têm ao menos um produto visível, na ordem de CATEGORIES. */
export const CATEGORIES_WITH_PRODUCTS = CATEGORIES.filter(
  (cat) => cat.visible !== false && VISIBLE_PRODUCTS.some((p) => p.category.includes(cat.id))
);

export function categoryLabel(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId)?.label ?? '';
}

/* Peso usado para ordenar listas que misturam categorias (grade filtrada). */
const maxCategoryWeight = (p) => Math.max(...Object.values(p.categoryOrder ?? {}), 0);

/* Remove acentos e caixa para comparar textos ("refugio" encontra "Refúgio"). */
export const normalizeText = (t) =>
  String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/* Busca por todas as palavras em name, shortName, rótulos de categoria e
 * tags; opcionalmente restrita a uma categoria. Ordena pelo maior peso de
 * categoria do produto. */
export function searchProducts(query = '', categoryId = null) {
  const words = normalizeText(query).trim().split(/\s+/).filter(Boolean);
  return VISIBLE_PRODUCTS
    .filter((p) => {
      if (categoryId && !p.category.includes(categoryId)) return false;
      if (!words.length) return true;
      const catLabels = p.category.map(categoryLabel).join(' ');
      const searchable = normalizeText([p.name, p.shortName, catLabels, ...(p.tags || [])].join(' '));
      return words.every((w) => searchable.includes(w));
    })
    .sort((a, b) => maxCategoryWeight(b) - maxCategoryWeight(a));
}

export function getFeaturedProduct() {
  return PRODUCTS.find((p) => p.featured === true && isVisible(p)) ?? null;
}

export function parsePriceValue(str) {
  return parseFloat(String(str).replace(/[^\d,]/g, '').replace(',', '.'));
}

/* Menor preço de `prices` (ou `price` quando não há variações). */
export function lowestPrice(product) {
  if (!product.prices?.length) return product.price;
  return product.prices.reduce((min, p) =>
    parsePriceValue(p.price) < parsePriceValue(min.price) ? p : min
  ).price;
}
