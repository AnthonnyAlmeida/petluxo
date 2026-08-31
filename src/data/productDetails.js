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
    gallery: [
      '/images/products/espreguicadeira-madeira-dobravel/principal.webp',
      '/images/products/espreguicadeira-madeira-dobravel/espreguicadeira-madeira-dobravel-2.webp',
      '/images/products/espreguicadeira-madeira-dobravel/espreguicadeira-madeira-dobravel-3.webp',
      '/images/products/espreguicadeira-madeira-dobravel/espreguicadeira-madeira-dobravel-4.webp',
      '/images/products/espreguicadeira-madeira-dobravel/espreguicadeira-madeira-dobravel-5.webp',
      '/images/products/espreguicadeira-madeira-dobravel/espreguicadeira-madeira-dobravel-6.webp',
      '/images/products/espreguicadeira-madeira-dobravel/espreguicadeira-madeira-dobravel-7.webp',
    ],
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
  6: {
    specs: {
      tamanho: 'M / Pequeno',
      dimensoes: '60 × 60 × 75 cm',
      material: 'Poliéster',
      formato: 'Quadrado',
      indicacaoUso: 'Cães de pequeno porte e gatos',
    },
    whatsIncluded: [
      'Cabana/tenda',
      'Colchão com fibra siliconada',
      'Colchão com abertura em zíper para retirada do enchimento',
      'Tapete decorativo, que também pode ser usado para os potes de alimentação',
      'Almofada em formato de ossinho',
      'Bandeirolas decorativas para acabamento',
    ],
    careInstructions: 'Produto desmontável e lavável — pode ser lavado à máquina em ciclo de menor duração. Não é à prova d\'água. Personalizável. O colchão pode ser utilizado no inverno para deixar o refúgio mais aconchegante; no verão, pode ser retirado para proporcionar mais espaço e ventilação, mantendo o pet protegido do contato direto com o chão.',
  },
  16: {
    specs: {
      tipo: 'Comedouro elevado',
      material: 'Tigela em cerâmica com suporte de madeira',
      cor: 'Branco',
      modelos: 'Disponível com 1 ou 2 tigelas',
      caracteristicas: 'Design elevado, cerâmica resistente e fácil de higienizar',
      indicacaoUso: 'Cães de diferentes portes, conforme o tamanho escolhido',
      estilo: 'Sofisticado, moderno e elegante',
      diametroTigela: '15,5 cm (800ml) / 18,5 cm (1200ml) / 21 cm (1800ml)',
      seguranca: 'Material atóxico e livre de substâncias químicas de alta preocupação',
      materialSuporte: 'Madeira maciça de acácia, com verniz atóxico transparente, à prova d\'água e resistente a mofo',
      design: 'Parede interna curva que evita acúmulo de resíduos de ração no fundo da tigela',
      ajusteAltura: 'No modelo com 2 tigelas, o suporte permite reposicionar uma tigela à frente ou atrás, elevando-a em até 8,9 cm ou 5,5 cm, conforme a posição',
    },
    sizeChart: [
      { size: '800 ml', height: '16,5 cm', length: '—', width: '20 cm', weight: '—' },
      { size: '1.200 ml', height: '20 cm', length: '—', width: '23 cm', weight: '—' },
      { size: '1.800 ml', height: '24 cm', length: '—', width: '26,5 cm', weight: '—' },
    ],
  },
};
