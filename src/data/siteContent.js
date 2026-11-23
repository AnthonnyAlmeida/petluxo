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
