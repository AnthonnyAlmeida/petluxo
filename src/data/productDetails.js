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

export const PRODUCT_DETAILS = {
  8: {
    gallery: [
      '/images/products/bolsa-transporte-petluxo/principal.webp',
      '/images/products/bolsa-transporte-petluxo/bolsa-transporte-petluxo-2.webp',
      '/images/products/bolsa-transporte-petluxo/bolsa-transporte-petluxo-3.webp',
      '/images/products/bolsa-transporte-petluxo/bolsa-transporte-petluxo-4.webp',
    ],
    specs: {
      materialExterno: 'Couro sintético premium de alta qualidade',
      forracaoInterna: 'Material impermeável, resistente e de fácil higienização',
      estrutura: 'Base rígida removível para maior estabilidade e conforto',
      ventilacao: 'Laterais em tela respirável que proporcionam excelente circulação de ar',
      seguranca: 'Guia interna para prender à coleira, oferecendo mais segurança durante o transporte',
      tipoAlcas: 'Alça de mão e alça transversal removível e ajustável',
      fechamento: 'Zíper reforçado de alta durabilidade',
      indicacaoUso: 'Cães e gatos de pequeno porte',
    },
    sizeChart: [
      { size: 'P', height: '27 cm', length: '40 cm', width: '20 cm', weight: 'Indicado para pets de até 5 kg' },
      { size: 'M', height: '27 cm', length: '40 cm', width: '25 cm', weight: 'Indicado para pets entre 5 e 6 kg' },
      { size: 'G', height: 'Consulte disponibilidade', length: 'Consulte disponibilidade', width: 'Consulte disponibilidade', weight: 'Assim que confirmarmos as medidas com o fornecedor, substituímos por uma ficha completa' },
    ],
    howToChooseSize: 'Mais importante do que o peso do pet são suas medidas. Recomendamos medir: altura sentado; comprimento do focinho até a base da cauda. Seu pet deve conseguir permanecer confortável dentro da bolsa durante todo o transporte. Sempre confira as medidas antes da compra.',
    whatsIncluded: [
      'Bolsa Transporte PetLuxo',
      'Base removível reforçada',
      'Tapete interno macio',
      'Alça transversal regulável',
    ],
    careInstructions: 'Limpe utilizando pano macio levemente umedecido e detergente neutro. Não utilize álcool, solventes ou produtos abrasivos. Armazene em local seco e protegido da luz solar direta. As tonalidades podem sofrer pequenas variações conforme o lote de fabricação ou a configuração da tela do dispositivo.',
    airTravelNote: 'Este modelo pode ser utilizado em viagens aéreas, porém recomendamos consultar previamente a companhia aérea, pois cada empresa possui regras específicas para dimensões e transporte de animais.',
    warranty: 'Garantia contra defeitos de fabricação.',
    faq: [
      { question: 'A bolsa acompanha alça transversal?', answer: 'Sim. Todos os modelos acompanham alça transversal ajustável e removível.' },
      { question: 'O fundo é removível?', answer: 'Sim. A base é reforçada e removível para facilitar a limpeza.' },
      { question: 'Possui trava de segurança?', answer: 'Sim. Conta com guia interna para prender à coleira durante o transporte.' },
      { question: 'Posso transportar gatos?', answer: 'Sim. A bolsa é indicada para cães e gatos de pequeno porte.' },
      { question: 'É confortável para viagens?', answer: 'Sim. O interior acolchoado, a ventilação lateral e a base estruturada proporcionam maior conforto ao pet.' },
      { question: 'Posso personalizar com o nome do meu pet?', answer: 'Consulte a disponibilidade deste serviço para o modelo escolhido.' },
    ],
  },
  37: {
    specs: {
      estrutura: 'Madeira',
      superficieArranhador: 'Sisal',
      capacidade: 'Até 5 kg',
      montagem: 'Simples, sem necessidade de ferramentas',
      ajusteAltura: '3 níveis de altura ajustáveis',
      dimensoes: '60 × 35 × 40 cm',
      peso: '1 kg',
    },
  },
};
