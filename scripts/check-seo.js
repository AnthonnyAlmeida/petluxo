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
  assert.ok(m.description.endsWith('.'), 'descrição deve terminar em ponto');
  assert.ok(!m.description.includes('…'), 'não deve ter reticências');
  const original = findVisibleProduct(44).description.replace(/\s+/g, ' ').trim();
  assert.ok(original.startsWith(m.description), 'descrição deve ser prefixo do original');
});

check('buildProductMeta: toda descrição visível <= 160 e sem vazio', () => {
  for (const p of PRODUCTS.filter((x) => x.visible !== false)) {
    const m = buildProductMeta(p);
    assert.ok(m.description.length > 0, `id ${p.id} sem descrição`);
    assert.ok(m.description.length <= 160, `id ${p.id} com ${m.description.length}`);
  }
});

check('buildProductMeta: não corta dentro de número (2.0, 3.5 kg)', () => {
  const desc = 'Bolsa de transporte versão 2.0 com estrutura reforçada para pets de até 3.5 kg e ventilação lateral ampla para viagens longas de carro ou avião com mais conforto e segurança';
  assert.ok(desc.length > 155, 'texto sintético precisa ter mais de 155 caracteres');
  const m = buildProductMeta({ id: 9999, name: 'Teste', image: '/x.webp', description: desc });
  assert.ok(m.description.endsWith('…'), `deveria cortar por palavra: ${m.description}`);
  assert.ok(m.description.length <= 160);
  assert.ok(!/\d\.…?$/.test(m.description), 'cortou dentro de número');
  assert.ok(desc.startsWith(m.description.slice(0, -1)), 'deve ser prefixo do original');
});

check('buildProductMeta: toda descrição visível termina em fim de frase válido ou "…"', () => {
  for (const p of PRODUCTS.filter((x) => x.visible !== false)) {
    const m = buildProductMeta(p);
    const original = (p.description || p.subtitle || '').replace(/\s+/g, ' ').trim();
    const d = m.description;
    assert.ok(d.length >= 1 && d.length <= 160, `id ${p.id} com ${d.length}`);
    if (d.endsWith('…')) {
      assert.ok(original.startsWith(d.slice(0, -1)), `id ${p.id}: não é prefixo`);
    } else {
      assert.ok(/[.!?]$/.test(d), `id ${p.id}: não termina em . ! ? nem …`);
      assert.ok(original.startsWith(d), `id ${p.id}: não é prefixo`);
      const next = original.charAt(d.length);
      assert.ok(next === ' ' || next === '', `id ${p.id}: caractere seguinte "${next}"`);
    }
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
