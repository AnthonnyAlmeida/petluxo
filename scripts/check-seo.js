/* PetLuxo — checagens de SEO (assert do Node, sem framework).
 * Rode depois do build: npm run build && npm run test:seo
 * (não usar sufixo .test.js/.spec.js: o Playwright pegaria o arquivo). */

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { PRODUCTS } from '../src/data/products.js';
import { SITE, parseProductPath, findVisibleProduct, buildProductMeta } from '../worker/seo.js';

let passed = 0;
function check(name, fn) {
  fn();
  passed += 1;
  console.log(`ok  ${name}`);
}

check('parseProductPath /produto/44', () =>
  assert.deepEqual(parseProductPath('/produto/44'), { id: 44, canonical: true }));
check('parseProductPath /produto/44/', () =>
  assert.deepEqual(parseProductPath('/produto/44/'), { id: 44, canonical: false }));
check('parseProductPath /produto/044', () =>
  assert.deepEqual(parseProductPath('/produto/044'), { id: 44, canonical: false }));
for (const bad of ['/produto/', '/produto/abc', '/produto/44/x', '/politica-de-privacidade']) {
  check(`parseProductPath ${bad} => null`, () => assert.equal(parseProductPath(bad), null));
}

check('findVisibleProduct 44 existe', () => assert.equal(findVisibleProduct(44)?.id, 44));
check('findVisibleProduct 999 não existe', () => assert.equal(findVisibleProduct(999), null));
check('findVisibleProduct 1 oculto', () => assert.equal(findVisibleProduct(1), null));
check('findVisibleProduct 14 visível sem ficha', () => assert.equal(findVisibleProduct(14)?.id, 14));

check('buildProductMeta 44', () => {
  const m = buildProductMeta(findVisibleProduct(44));
  assert.equal(m.title, 'Peitoral Élan Signature | PetLuxo');
  assert.equal(m.url, `${SITE}/produto/44`);
  assert.equal(m.image, `${SITE}/images/products/peitoral-elan-signature/principal.webp`);
  assert.ok(m.description.length <= 160, `descrição com ${m.description.length} caracteres`);
  assert.ok(m.description.endsWith('…'));
  const body = m.description.slice(0, -1);
  const original = findVisibleProduct(44).description.replace(/\s+/g, ' ').trim();
  const next = original.charAt(body.length);
  assert.ok(original.startsWith(body), 'descrição deve ser prefixo do original');
  assert.ok(next === ' ' || next === '', 'corte no meio de palavra');
});

check('buildProductMeta: toda descrição visível <= 160 e sem vazio', () => {
  for (const p of PRODUCTS.filter((x) => x.visible !== false)) {
    const m = buildProductMeta(p);
    assert.ok(m.description.length > 0, `id ${p.id} sem descrição`);
    assert.ok(m.description.length <= 160, `id ${p.id} com ${m.description.length}`);
  }
});

const sitemapPath = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'sitemap.xml');
assert.ok(existsSync(sitemapPath), 'dist/sitemap.xml não existe: rode npm run build antes');
const xml = readFileSync(sitemapPath, 'utf8');
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const visible = PRODUCTS.filter((p) => p.visible !== false);

check('sitemap: contagem = visíveis + 1', () => assert.equal(locs.length, visible.length + 1));
check('sitemap: contém a home', () => assert.ok(locs.includes(`${SITE}/`)));
check('sitemap: nenhum oculto', () => {
  for (const p of PRODUCTS.filter((x) => x.visible === false)) {
    assert.ok(!locs.includes(`${SITE}/produto/${p.id}`), `oculto ${p.id} no sitemap`);
  }
});
check('sitemap: sem lastmod/changefreq/priority', () =>
  assert.ok(!/lastmod|changefreq|priority/.test(xml)));

console.log(`\n${passed} checagens passaram.`);
