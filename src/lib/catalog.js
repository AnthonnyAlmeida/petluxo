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

/* Rótulo de categoria exibido no card: a primeira categoria do produto que
 * não seja "mais-vendidos" (que já aparece como selo). */
export function primaryCategoryLabel(product) {
  const id = product.category.find((c) => c !== 'mais-vendidos') ?? product.category[0];
  return categoryLabel(id);
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

/* Ordem do catálogo "Todos": cada categoria na ordem de CATEGORIES, seus
 * produtos por categoryOrder, sem repetir produto que já apareceu. */
function catalogOrder() {
  const seen = new Set();
  const out = [];
  CATEGORIES_WITH_PRODUCTS.forEach((cat) => {
    productsInCategory(cat.id).forEach((p) => {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        out.push(p);
      }
    });
  });
  return out;
}

/* Lista do catálogo mobile: sem busca, "Todos" segue a ordem do site e uma
 * categoria segue o peso dela; com busca, vale a ordem de searchProducts
 * (maior peso de categoria) dentro da categoria escolhida, se houver. */
export function catalogList(query = '', categoryId = null) {
  if (query.trim()) return searchProducts(query, categoryId);
  return categoryId ? productsInCategory(categoryId) : catalogOrder();
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

/* Separa o prefixo "a partir de" do valor ("a partir de R$ 394,00"). */
export function splitPricePrefix(price) {
  const m = /^\s*(a partir de)\s+(.*)$/i.exec(String(price ?? ''));
  return m ? { prefix: m[1], value: m[2] } : { prefix: null, value: price };
}
