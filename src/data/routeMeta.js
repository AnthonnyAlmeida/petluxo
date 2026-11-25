/* PetLuxo — título, descrição e URL de cada rota estática (exceto a home, cujos
 * valores estão no index.html). Fonte única: o Worker (worker/index.js) reescreve
 * o head do HTML inicial com estes dados e o cliente (useDocumentHead) os aplica
 * na navegação interna. `noindex` marca rotas que não devem ser indexadas. */

export const ROUTE_META = {
  '/produtos': {
    title: 'Produtos | PetLuxo — Camas, coleiras de couro e acessórios premium',
    description:
      'Catálogo PetLuxo: camas de luxo, coleiras de couro, comedouros e acessórios premium para cães e gatos. Escolha pela categoria e compre via WhatsApp.',
  },
  '/buscar': {
    noindex: true,
  },
  '/politica-de-privacidade': {
    title: 'Política de Privacidade | PetLuxo',
    description:
      'Como a PetLuxo trata seus dados pessoais: coleta, uso, compartilhamento, cookies, base legal e seus direitos como titular (LGPD).',
  },
  '/politica-de-troca-e-devolucao': {
    title: 'Política de Troca e Devolução | PetLuxo',
    description:
      'Política de troca e devolução da PetLuxo: modalidades e como solicitar pelo atendimento no WhatsApp.',
  },
  '/politica-de-frete-e-entrega': {
    title: 'Política de Frete e Entrega | PetLuxo',
    description:
      'Política de frete e entrega da PetLuxo: prazo e frete são informados no atendimento pelo WhatsApp, antes da confirmação do pedido.',
  },
  '/termos-de-uso': {
    title: 'Termos de Uso | PetLuxo',
    description:
      'Termos de uso do site da PetLuxo: uso do conteúdo, responsabilidades e foro.',
  },
};

/* Aceita barra final. Devolve { path, ...meta } ou null. */
export function getRouteMeta(pathname) {
  const path = /^\/.*[^/]\/$/.test(pathname) ? pathname.slice(0, -1) : pathname;
  const meta = ROUTE_META[path];
  return meta ? { path, ...meta } : null;
}
