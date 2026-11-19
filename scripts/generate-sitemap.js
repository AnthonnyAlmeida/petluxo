/* PetLuxo — gera dist/sitemap.xml no build (home, catálogo /produtos e produtos visíveis).
 * Sobrescreve o sitemap que o Vite copiou de public/. Roda depois do vite build. */

import { existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { PRODUCTS } from '../src/data/products.js';

const SITE = 'https://www.petluxostory.com.br';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

if (!existsSync(dist)) {
  console.error('generate-sitemap: dist/ não existe (rode vite build antes).');
  process.exit(1);
}

const urls = [
  `${SITE}/`,
  `${SITE}/produtos`,
  ...PRODUCTS.filter((p) => p.visible !== false)
    .sort((a, b) => a.id - b.id)
    .map((p) => `${SITE}/produto/${p.id}`),
];

if (urls.length < 3) {
  console.error(`generate-sitemap: apenas ${urls.length} URL(s); esperado ao menos 3.`);
  process.exit(1);
}

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url>\n    <loc>${u}</loc>\n  </url>\n`).join('') +
  '</urlset>\n';

writeFileSync(resolve(dist, 'sitemap.xml'), xml);
console.log(`generate-sitemap: ${urls.length} URLs em dist/sitemap.xml`);
