/* PetLuxo — Worker de SEO por produto e de 404 real.
 * Roda em tudo, menos nos arquivos estáticos (assets.run_worker_first no
 * wrangler.jsonc, com exclusões). Rota estática do app → shell 200; qualquer
 * outro caminho → shell com 404 + noindex (o fallback de SPA dos assets
 * devolveria 200). Para /produto/*, reescreve o head do shell HTML (index.html) para produto válido e devolve
 * 404 + noindex para produto inexistente/oculto ou formato inválido.
 * O app React continua montando normalmente (NotFound incluso). */

import { getRouteMeta } from '../src/data/routeMeta.js';
import { parseProductPath, findVisibleProduct, buildProductMeta, buildProductJsonLd, jsonLdScript, isStaticRoute, SITE } from './seo.js';

const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=63072000',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cache-Control': 'public, max-age=0, must-revalidate',
};

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function withHeaders(response, extra = {}) {
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('etag');
  headers.delete('last-modified');
  for (const [k, v] of Object.entries({ ...SECURITY_HEADERS, ...extra })) headers.set(k, v);
  return headers;
}

function finish(request, body, status, headers) {
  const isHead = request.method === 'HEAD';
  return new Response(isHead ? null : body, { status, headers });
}

async function fetchShell(request, env) {
  // GET na raiz, sem headers condicionais (nunca receber 304).
  const shellUrl = new URL('/', request.url);
  return env.ASSETS.fetch(new Request(shellUrl, { method: 'GET' }));
}

function setContent(rewriter, selector, value) {
  rewriter.on(selector, {
    element(el) {
      el.setAttribute('content', value);
    },
  });
}

function rewriteProduct(shell, meta, product) {
  const productName = product.name;
  const rewriter = new HTMLRewriter();
  rewriter.on('title', {
    element(el) {
      el.setInnerContent(meta.title);
    },
  });
  setContent(rewriter, 'meta[name="description"]', meta.description);
  setContent(rewriter, 'meta[property="og:title"]', meta.title);
  setContent(rewriter, 'meta[property="og:description"]', meta.description);
  setContent(rewriter, 'meta[property="og:url"]', meta.url);
  setContent(rewriter, 'meta[property="og:image"]', meta.image);
  setContent(rewriter, 'meta[property="og:image:alt"]', productName);
  setContent(rewriter, 'meta[name="twitter:title"]', meta.title);
  setContent(rewriter, 'meta[name="twitter:description"]', meta.description);
  setContent(rewriter, 'meta[name="twitter:image"]', meta.image);
  for (const prop of ['og:image:width', 'og:image:height', 'og:image:type']) {
    rewriter.on(`meta[property="${prop}"]`, {
      element(el) {
        el.remove();
      },
    });
  }
  rewriter.on('head', {
    element(el) {
      // url vem de SITE + id numérico; escapado por precaução.
      el.append(`<link rel="canonical" href="${escapeAttr(meta.url)}"/>`, { html: true });
      const jsonLd = buildProductJsonLd(product);
      if (jsonLd) el.append(jsonLdScript(jsonLd), { html: true });
    },
  });
  return rewriter.transform(shell);
}

/* Rota estática: só título, descrição e canonical (a imagem social da home vale). */
function rewriteRoute(shell, { title, description, path }) {
  const url = `${SITE}${path}`;
  const rewriter = new HTMLRewriter();
  rewriter.on('title', {
    element(el) {
      el.setInnerContent(title);
    },
  });
  setContent(rewriter, 'meta[name="description"]', description);
  setContent(rewriter, 'meta[property="og:title"]', title);
  setContent(rewriter, 'meta[property="og:description"]', description);
  setContent(rewriter, 'meta[property="og:url"]', url);
  setContent(rewriter, 'meta[name="twitter:title"]', title);
  setContent(rewriter, 'meta[name="twitter:description"]', description);
  rewriter.on('head', {
    element(el) {
      el.append(`<link rel="canonical" href="${escapeAttr(url)}"/>`, { html: true });
    },
  });
  return rewriter.transform(shell);
}

function rewriteNoindex(shell) {
  const rewriter = new HTMLRewriter();
  rewriter.on('meta[name="robots"]', {
    element(el) {
      el.setAttribute('content', 'noindex');
    },
  });
  return rewriter.transform(shell);
}

export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return env.ASSETS.fetch(request);
    }

    const url = new URL(request.url);

    // Rota estática do app: shell 200; título/descrição/canonical próprios
    // (ou noindex) para as rotas com dados em src/data/routeMeta.js.
    if (isStaticRoute(url.pathname)) {
      const routeMeta = getRouteMeta(url.pathname);
      if (!routeMeta) return env.ASSETS.fetch(request);
      const shell = await fetchShell(request, env);
      if (!shell.ok) return shell;
      if (routeMeta.noindex) {
        return finish(request, rewriteNoindex(shell).body, 200, withHeaders(shell, { 'X-Robots-Tag': 'noindex' }));
      }
      return finish(request, rewriteRoute(shell, routeMeta).body, 200, withHeaders(shell));
    }

    const parsed = parseProductPath(url.pathname);
    const product = parsed ? findVisibleProduct(parsed.id) : null;

    // Caso B: produto válido, formato não canônico → 301 preservando a query.
    if (parsed && product && !parsed.canonical) {
      const location = `${url.origin}/produto/${product.id}${url.search}`;
      const headers = new Headers(SECURITY_HEADERS);
      headers.set('Location', location);
      return finish(request, null, 301, headers);
    }

    const shell = await fetchShell(request, env);
    if (!shell.ok) return shell;

    // Caso A: não parseável, inexistente ou oculto → shell com 404 + noindex.
    if (!parsed || !product) {
      const headers = withHeaders(shell, { 'X-Robots-Tag': 'noindex' });
      return finish(request, rewriteNoindex(shell).body, 404, headers);
    }

    // Caso C: produto válido e canônico.
    const meta = buildProductMeta(product);
    const headers = withHeaders(shell);
    return finish(request, rewriteProduct(shell, meta, product).body, 200, headers);
  },
};
