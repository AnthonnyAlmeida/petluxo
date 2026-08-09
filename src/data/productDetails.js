/* PetLuxo — Conteúdo expandido de produtos (ficha completa)
 *
 * Indexado por `id` de produto (o mesmo id usado em src/data/products.js).
 * Arquivo separado de products.js de propósito — products.js é escrito
 * diretamente pelo painel administrativo externo ao repositório, então o
 * conteúdo expandido fica isolado aqui para nunca ser sobrescrito por ele.
 *
 * Cada produto adiciona sua própria entrada de forma independente, um por
 * vez, sem tocar em products.js. Produto sem entrada aqui simplesmente não
 * tem ficha completa — ProductPage e ProductModal tratam isso como opcional
 * e não renderizam nenhuma seção vazia.
 *
 * Schema e decisão de arquitetura completos em docs/PRODUCT_EXPANSION.md.
 */

export const PRODUCT_DETAILS = {};
