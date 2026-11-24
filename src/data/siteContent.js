/* PetLuxo — Textos institucionais do site
 * Fonte única dos textos usados pelo layout desktop e pelo mobile (hero,
 * sobre nós, diferenciais, FAQ, rodapé e mensagens do WhatsApp). FAQ,
 * diferenciais e rodapé estão em revisão jurídica: alterar só com o texto
 * aprovado. Os textos das políticas ficam nas próprias páginas. */

export const HERO = {
  eyebrow: 'CURADORIA EXCLUSIVA · PARA QUEM EXIGE O MELHOR',
  titleStart: 'O luxo que',
  titleAccent: 'ele merece,',
  titleEnd: 'a elegância que você aprecia.',
  sub: 'Cada peça da nossa coleção é selecionada com rigor, para pets que vivem com o mesmo padrão que seus donos.',
};

export const STORY = {
  tag: 'SOBRE NÓS',
  manifesto: 'Nascida da paixão por pets. Construída com propósito.',
  titleStart: 'Onde o amor',
  titleAccent: 'encontra o luxo',
  titleEnd: 'que seu pet merece.',
  lead: 'A PetLuxo nasceu de um lugar genuíno — o amor pelos animais que fazem parte da nossa família e a vontade de oferecer a eles o melhor que existe.',
  paragraphs: [
    'Somos uma curadoria criteriosa de produtos sofisticados, funcionais e esteticamente refinados, pensados para tutores que enxergam seus pets como membros da família e não abrem mão de qualidade, design e exclusividade.',
    'Cada peça da nossa coleção é escolhida com atenção aos detalhes: materiais nobres, acabamento impecável e aquele toque especial que transforma o dia a dia em uma experiência única.',
  ],
  signature: 'Com carinho — Equipe PetLuxo',
};

export const DIFFERENTIALS_TAG = 'POR QUE ESCOLHER A PETLUXO';

export const DIFFERENTIALS = [
  { num: '01', title: 'Qualidade garantida', body: 'Produtos selecionados com atenção à qualidade dos materiais, durabilidade e conforto para o seu animal.' },
  { num: '02', title: 'Atendimento via WhatsApp', body: 'Tire suas dúvidas e acompanhe seu pedido pelo WhatsApp. Atendimento direto, rápido e personalizado.' },
  { num: '03', title: 'Entrega em todo o Brasil', body: 'Enviamos para qualquer cidade do Brasil com embalagem cuidadosa e rastreamento garantido.' },
  { num: '04', title: 'Curadoria premium', body: 'Cada produto é selecionado com um olhar criterioso: design refinado, materiais nobres e aquele toque especial que transforma o dia a dia em uma experiência única.' },
];

export const FAQ_TEXT = {
  label: 'DÚVIDAS FREQUENTES',
  title: 'Perguntas Frequentes',
  subtitle: 'Tire suas dúvidas antes de comprar',
  moreTitle: 'Tem outra dúvida?',
};

/* `a: null` marca a resposta com link para a Política de Troca (TROCA_ANSWER). */
export const FAQS = [
  {
    q: 'Os produtos são confortáveis para pets sensíveis?',
    a: 'Sim! Todos os produtos são selecionados pensando em conforto, segurança e bem-estar, com materiais de qualidade para uso diário.',
  },
  {
    q: 'Como acompanho meu pedido?',
    a: 'Quando existir, enviaremos o código de rastreamento pelo WhatsApp após o despacho. Em caso de dúvida, entre em contato pelo WhatsApp.',
  },
  {
    q: 'Os produtos podem ser lavados?',
    a: 'Sim. Os produtos PetLuxo são feitos com materiais de fácil limpeza e higienização. Dúvidas específicas? Fale com a gente pelo WhatsApp.',
  },
  {
    q: 'Quanto tempo leva a entrega?',
    a: 'O prazo varia conforme o produto e o fornecedor e é informado no atendimento, antes da confirmação do pedido.',
  },
  {
    q: 'Posso trocar o produto?',
    a: null,
  },
  {
    q: 'Os produtos são iguais às fotos?',
    a: 'Sim. Trabalhamos para apresentar imagens fiéis aos produtos, garantindo que o que você vê é o que você recebe.',
  },
  {
    q: 'Como sei qual tamanho de cama escolher para o meu pet?',
    a: 'Recomendamos medir o comprimento do seu pet de focinho a cauda e adicionar cerca de 20cm para garantir conforto total. Nossos produtos com variação de tamanho indicam as medidas de cada opção. Em caso de dúvida, fale com a gente pelo WhatsApp — adoramos ajudar!',
  },
];

/* Aviso de entrega único (decisão: constante, não campo por produto).
 * Texto padrão do advogado, 2026-11-19. */
export const DELIVERY_NOTE = 'Prazo e frete informados no atendimento pelo WhatsApp, antes da confirmação do pedido.';

export const TROCA_ANSWER = {
  before: 'Sim! Aceitamos trocas em até 7 dias corridos após o recebimento. Em caso de defeito de fabricação, o prazo é de 90 dias. Consulte nossa ',
  linkText: 'Política de Troca e Devolução',
  to: '/politica-de-troca-e-devolucao',
  after: ' para mais detalhes.',
};

export const POLICY_LINKS = [
  { to: '/politica-de-privacidade', label: 'Política de Privacidade' },
  { to: '/politica-de-troca-e-devolucao', label: 'Troca e Devolução' },
  { to: '/politica-de-frete-e-entrega', label: 'Frete e Entrega' },
  { to: '/termos-de-uso', label: 'Termos de Uso' },
];

export const FOOTER = {
  tagline: 'Sofisticação e conforto para quem ama seus pets.',
  policiesTitle: 'Políticas',
  contactTitle: 'Contato',
  cookiePrefs: 'Preferências de cookies',
  email: 'petluxo.service@gmail.com',
  instagram: 'https://www.instagram.com/pettluxo_/',
  legal: '© 2026 PETLUXO · CNPJ 23.833.930/0001-21',
};

export const WA_MESSAGES = {
  general: 'Olá! Vim do site PetLuxo e gostaria de mais informações.',
  question: 'Olá! Tenho uma dúvida sobre os produtos PetLuxo.',
  searching: 'Olá! Estou procurando um produto específico na PetLuxo.',
  product: (name) => `Olá! Gostaria de mais informações sobre "${name}".`,
};

/* Abre o banner de consentimento (escutado por AnalyticsConsent.jsx). */
export function openConsentPreferences() {
  window.dispatchEvent(new CustomEvent('petluxo:open-consent'));
}

/* ===================== Layout desktop (≥ 768px) =====================
 * Constantes do redesign desktop (desenho aprovado em 2026-11-23). São
 * aditivas: o mobile não as usa. Textos já existentes no código foram
 * movidos para cá sem alteração; os demais vêm do desenho. */

export const BRAND = { name: 'PetLuxo', monogram: 'PL' };

/* Telefone formatado para exibição: a mesma string das páginas de
 * Troca, Frete e Termos ("WhatsApp: (61) 99406-3917"). */
export const CONTACT = { phoneDisplay: '(61) 99406-3917' };

export const NAV_TEXT = {
  ariaLabel: 'Principal',
  whatsapp: 'Falar no WhatsApp',
  openMenu: 'Abrir menu',
  closeMenu: 'Fechar menu',
};

/* Âncoras da home: rótulos do desenho, ids atuais das seções. */
export const NAV_LINKS = [
  { href: '#produtos', label: 'Coleção' },
  { href: '#sobre', label: 'Sobre nós' },
  { href: '#diferenciais', label: 'Diferenciais' },
  { href: '#contato', label: 'Contato' },
  { href: '#faq', label: 'Dúvidas' },
];

export const HERO_DESKTOP = {
  cta: 'Ver produtos',
  secondary: 'Conheça a PetLuxo',
  hint: 'Toque na medalha, no cachorro ou no gato',
  artLabel: 'Ilustração: uma medalha dourada pendurada, um cachorro e um gato sentados em um arco',
  medalLabel: 'Girar a medalha PetLuxo',
  dogLabel: 'Fazer carinho no cachorro',
  catLabel: 'Fazer carinho no gato',
};

export const HERO_META = [
  { k: 'Qualidade', v: 'PREMIUM' },
  { k: 'Entrega', v: 'TODO O BRASIL' },
  { k: 'Compra', v: '100% ONLINE' },
];

export const TRUST_STRIP_LABEL = 'Por que escolher a PetLuxo';

export const FEATURED_TEXT = {
  tag: 'PRODUTO EM DESTAQUE',
  from: 'A PARTIR DE',
  cta: 'CONSULTAR VIA WHATSAPP',
  peekLabel: 'Gato espiando atrás da foto',
};

/* Sobre nós: as quatro marcas da curadoria (arte interativa). */
export const STORY_PILLARS = [
  'Materiais nobres',
  'Acabamento impecável',
  'Design e exclusividade',
  'Pets são da família',
];

export const STORY_ART = {
  caption: 'Curadoria',
  artLabel: 'Um coração dentro de uma medalha dourada, rodeado por quatro marcas da curadoria PetLuxo',
};

export const DIFFERENTIALS_TITLE = {
  start: 'Quatro motivos.',
  accent: 'Para comprar agora.',
  artLabel: 'Quatro medalhas douradas penduradas em um trilho: qualidade, atendimento, entrega e curadoria. A escolhida desce e se destaca.',
};

export const CTA_TEXT = {
  eyebrow: 'COMPRA SEGURA · ENTREGA EM TODO O BRASIL',
  titleStart: 'Pronto para',
  titleAccent: 'começar a comprar?',
  sub: 'Explore nossa coleção e finalize sua compra com segurança. Dúvidas? Estamos no WhatsApp.',
  shop: 'VER PRODUTOS',
  chat: 'FALAR VIA WHATSAPP',
  waMessage: 'Olá! Gostaria de tirar uma dúvida sobre os produtos PetLuxo.',
  meta: ['Resposta rápida', 'Entrega em todo o Brasil', 'Pagamento seguro'],
  dogLabel: 'Cachorro sentado, atento aos botões',
  catLabel: 'Gato sentado em uma almofada, atento aos botões',
};

export const FAQ_DESKTOP = {
  num: '06',
  moreBefore: 'Fale pelo',
  moreWa: 'WhatsApp',
  moreMid: 'ou pelo e-mail',
  bellHint: 'Toque na campainha',
  bellLabel: 'Tocar a campainha de atendimento',
  artLabel: 'Uma campainha dourada de balcão e um gato sentado ao lado, pronto para tocá-la',
};

export const PRODUCT_PAGE_TEXT = {
  back: 'Voltar para a loja',
  tabsLabel: 'Sobre a peça',
  tabDescription: 'Descrição',
  tabHighlights: 'Destaques',
  detailsStart: 'Detalhes',
  detailsAccent: 'da peça',
};

/* Selo "Por que escolher a PetLuxo?" da ficha (antes fixo em BrandSeal.jsx). */
export const BRAND_SEAL = {
  title: 'Por que escolher a PetLuxo?',
  items: [
    'Curadoria de produtos premium',
    'Envio para todo o Brasil',
    'Compra segura',
    'Atendimento personalizado',
    'Produtos selecionados pensando no conforto do seu pet',
    'Qualidade e elegância em cada detalhe',
  ],
};

export const FOOTER_DESKTOP = {
  whatsapp: 'Falar no WhatsApp',
  instagram: 'Instagram',
};

export const POLICY_TEXT = {
  back: 'Voltar para a loja',
  eyebrow: 'Transparência',
  titleStart: 'Nossas',
  titleAccent: 'políticas',
  updatedPrefix: 'Última atualização:',
  helpTitle: 'Ficou com dúvida?',
  whatsappPrefix: 'WhatsApp:',
  navLabel: 'Navegação das políticas',
};

export const NOT_FOUND_TEXT = {
  titleStart: 'Página não',
  titleAccent: 'encontrada.',
  lines: [
    'A página que você procura não existe ou foi movida.',
    'Volte para a home e explore nossos produtos.',
  ],
  home: 'Voltar para a home',
  products: 'Ver produtos',
  hint: 'Toque na medalha',
  medalLabel: 'Virar a medalha',
  artLabel: '404 com uma medalha dourada no lugar do zero e um gato sentado ao lado',
};
