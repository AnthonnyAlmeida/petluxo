/* PetLuxo — useDocumentHead
 * Ajusta no cliente o <title>, a meta description, o canonical e o robots da
 * rota atual e restaura os valores anteriores ao sair dela. Serve às rotas que
 * o Worker de SEO não reescreve (só /produto/* é reescrita no servidor), por
 * isso só vale para quem executa JavaScript (o Google executa). */

import { useEffect } from 'react';

const SITE = 'https://www.petluxostory.com.br';

/* Cria (ou reaproveita) a tag e devolve uma função que desfaz a alteração. */
function setTag(selector, create, attr, value) {
  let el = document.head.querySelector(selector);
  const created = !el;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  const previous = el.getAttribute(attr);
  el.setAttribute(attr, value);
  return () => {
    if (created) el.remove();
    else if (previous === null) el.removeAttribute(attr);
    else el.setAttribute(attr, previous);
  };
}

const metaByName = (name) => () => {
  const el = document.createElement('meta');
  el.setAttribute('name', name);
  return el;
};
const metaByProperty = (property) => () => {
  const el = document.createElement('meta');
  el.setAttribute('property', property);
  return el;
};

export function useDocumentHead({ title, description, path, robots }) {
  useEffect(() => {
    const undo = [];
    const previousTitle = document.title;

    if (title) {
      document.title = title;
      undo.push(() => { document.title = previousTitle; });
      undo.push(setTag('meta[property="og:title"]', metaByProperty('og:title'), 'content', title));
      undo.push(setTag('meta[name="twitter:title"]', metaByName('twitter:title'), 'content', title));
    }
    if (description) {
      undo.push(setTag('meta[name="description"]', metaByName('description'), 'content', description));
      undo.push(setTag('meta[property="og:description"]', metaByProperty('og:description'), 'content', description));
      undo.push(setTag('meta[name="twitter:description"]', metaByName('twitter:description'), 'content', description));
    }
    if (path) {
      const url = `${SITE}${path}`;
      undo.push(setTag('link[rel="canonical"]', () => {
        const el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        return el;
      }, 'href', url));
      undo.push(setTag('meta[property="og:url"]', metaByProperty('og:url'), 'content', url));
    }
    if (robots) {
      undo.push(setTag('meta[name="robots"]', metaByName('robots'), 'content', robots));
    }

    return () => undo.reverse().forEach((fn) => fn());
  }, [title, description, path, robots]);
}
