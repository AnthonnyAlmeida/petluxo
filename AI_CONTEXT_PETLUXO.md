# PetLuxo — Contexto do Projeto

Snapshot técnico do estado atual do código. E-commerce institucional (site estático, sem backend e sem banco de dados) para produtos premium de pets. Catálogo, busca, filtro e visualização de produto são resolvidos inteiramente no front-end.

**O fluxo de compra é o PagBank, com o CTA temporariamente oculto.** Os links `buyLink`/`buyLinks` continuam gravados em `products.js` e continuam sendo o caminho de compra pretendido; o que existe hoje é um interruptor de interface (`HIDE_BUY_CTA`) que esconde o botão "COMPRAR AGORA" e joga todo o tráfego para o WhatsApp. Ver [Fluxo de compra](#fluxo-de-compra).

- **Produção:** https://petluxostory.com.br
- **Instagram:** @petluxostory
- **Hospedagem:** Vercel (plano Hobby), deploy automático a cada push em `main`

## Stack

- **React 18.3.1** (componentes funcionais + hooks, sem gerenciador de estado externo)
- **React Router DOM 7** (`BrowserRouter` em `src/main.jsx`, rotas declaradas em `src/app/page.jsx`)
- **Vite 6** como bundler/dev server
- **CSS Modules** por componente — não há framework de UI
- Sem TypeScript — projeto 100% JavaScript (`.jsx`/`.js`)
- **`yet-another-react-lightbox`** (^3.32.2, com o plugin oficial `Zoom`) — única dependência de UI de terceiros, usada exclusivamente pelo `ProductLightbox`. Carregada sob demanda via `React.lazy`, só para quem tem dispositivo touch.

Scripts (`package.json`): `npm run dev` (porta 5173, `--host` liberado em `vite.config.js`), `npm run build`, `npm run preview`.

## Estrutura de pastas

```
petluxo/
├── index.html                  # Shell HTML: meta tags, Open Graph, Twitter Card, Google Analytics (gtag)
├── assets/                     # Imagens bundadas pelo Vite (fora de public/, importadas por caminho)
│   ├── logo.webp
│   ├── hero/image-hero.webp    # Usada por Hero.jsx
│   └── sobre_nos/              # foto_sobre_nos.webp, sobre_nos.webp
├── public/
│   ├── favicon.ico / favicon.svg
│   ├── og-image.png
│   ├── robots.txt / sitemap.xml
│   ├── 404.html                # Guarda o pathname em sessionStorage e redireciona (suporte a SPA na Vercel)
│   └── images/
│       ├── brand/
│       └── products/           # Uma pasta por produto (slug kebab-case) — ver seção própria
├── src/
│   ├── main.jsx                # Entry point: monta <App/>, inicializa o FAB do WhatsApp, restaura o path
│   │                           # do 404.html, instala a lógica global de bloqueio/reset de pinch-zoom
│   ├── app/
│   │   ├── page.jsx            # Rotas + HomePage (todas as seções)
│   │   ├── ScrollToTop.jsx     # Reseta o scroll a cada troca de rota
│   │   └── DevTweaks.jsx       # Painel de ajustes visuais, só em dev
│   ├── components/
│   │   ├── layout/              # Navbar (com drawer mobile), MinimalNavbar (só ProductPage), Footer
│   │   ├── product/             # ProductCard, ProductGrid, ProductModal, ProductGallery, ProductLightbox,
│   │   │                        # ProductSizeSelector, ProductBuyButton
│   │   ├── sections/            # Hero, Featured, Products, Story, Differentials, CTA, FAQ, NotFound
│   │   ├── pages/               # ProductPage (/produto/:id) + PrivacyPage, ReturnPolicyPage,
│   │   │                        # ShippingPolicyPage, TermsPage
│   │   └── ui/                  # Button, Container, Section, TrustBadges, Accordion, BrandSeal,
│   │                            # CategorySelector (bottom sheet de categoria no mobile)
│   ├── data/
│   │   ├── products.js          # Fonte de verdade do catálogo (CATEGORIES + PRODUCTS)
│   │   └── productDetails.js    # Conteúdo expandido de produtos, indexado por id
│   ├── hooks/
│   │   ├── useScroll.js         # useScrollEffects: scroll-reveal + paralaxe do logo na Hero
│   │   └── useProductBuy.js     # Variação selecionada + link/preço ativos
│   ├── lib/whatsapp.js          # Geração de links wa.me
│   ├── icons.jsx                # Ícones SVG inline
│   ├── tweaks-panel.jsx         # Componentes do painel de dev (TweaksPanel, TweakSection, TweakRadio,
│   │                            # TweakToggle, useTweaks)
│   └── styles/
│       ├── variables.css        # Design tokens
│       ├── globals.css          # Reset + utilitárias globais
│       ├── animations.css       # @keyframes globais
│       └── buttons.css          # Estilos de .btn e variantes
└── docs/
    ├── CHECKOUT_ARCHITECTURE.md # Plano (não implementado) de carrinho + Mercado Pago + Neon + Melhor Envio
    ├── CSS_MIGRATION.md
    ├── DECISIONS.md
    ├── DEPLOY.md
    ├── PRODUCT_EXPANSION.md     # Decisão de arquitetura da ficha de produto (descreve 9 campos —
    │                            # o código tem 10, ver "Expansão de conteúdo de produtos")
    ├── README.md
    └── TODO.md
```

Não existem `api/`, `vercel.json`, `db/` nem `src/data/shipping.js` no projeto.

## Fluxo de compra

### `HIDE_BUY_CTA` — o interruptor temporário que oculta o CTA do PagBank

`src/components/product/ProductBuyButton.jsx` define, no topo do arquivo:

```js
const HIDE_BUY_CTA = true;
```

**Essa constante é um estado temporário, não uma decisão de arquitetura.** O fluxo de compra pretendido do projeto é PagBank; o interruptor existe só para esconder o CTA de pagamento enquanto isso. Nada em `products.js` foi removido — os 37 produtos continuam com `buyLink`/`buyLinks` válidos e `Featured`/`ProductCard` mantêm o texto e a estrutura prontos para voltar.

Enquanto a constante estiver `true`, **nenhum link `buyLink`/`buyLinks` é renderizado na interface** — ela esconde apenas o botão "COMPRAR AGORA".

Efeito nos quatro estados do componente:

| Estado do produto | O que é renderizado com `HIDE_BUY_CTA = true` |
|---|---|
| `badge === 'ESGOTADO'` | Botão "ESGOTADO" desabilitado (`opacity: 0.5`) + link "CONSULTAR VIA WHATSAPP" em `styles.waLink` — **o único lugar do projeto que ainda usa essa classe** |
| Tem `buyLinks` | **Só** o CTA "CONSULTAR VIA WHATSAPP" (`btn btn-primary btn-full`) |
| Tem `buyLink` | **Só** o CTA "CONSULTAR VIA WHATSAPP" |
| Sem nenhum link | CTA "CONSULTAR VIA WHATSAPP" |

Mensagem do link: `Olá! Gostaria de mais informações sobre "<product.name>".` — a mesma em todos os produtos.

Ao colocar a constante em `false`, os CTAs "COMPRAR AGORA" voltam a aparecer e os dois WhatsApp dos estados 2 e 3 precisam voltar de `btn btn-primary btn-full` para `styles.waLink` (conforme o comentário no próprio arquivo).

### Propagação para o restante da UI

- **`ProductCard`** — exibe sempre o texto "VIA WHATSAPP" em `<small className={styles.priceVia}>` (`ProductCard.jsx:36-40`). O texto é fixo e não depende de `buyLink`/`buyLinks`.
- **`Featured`** — não usa `buyLink` nem `buyLinks`. Os CTAs são "CONSULTAR VIA WHATSAPP" (mesma mensagem do `ProductBuyButton`) e "VER TODOS OS PRODUTOS" (`btn btn-ghost` apontando para `#produtos`).
- **`useProductBuy` / `ProductSizeSelector`** — continuam calculando a variação selecionada e `activeBuyLink`, mas o valor selecionado só alimenta o texto do preço, nenhum link.
- **`checkout` planejado** — `docs/CHECKOUT_ARCHITECTURE.md` descreve o destino desse fluxo (carrinho, Mercado Pago, Neon, Melhor Envio). Nenhum código dele existe.

### Conteúdo institucional que ainda cita PagBank (consequência do estado temporário)

O interruptor só age na interface — o texto das páginas não foi acompanhado. Estas referências continuam descrevendo o PagBank como gateway ativo, o que é coerente com o fluxo pretendido e só fica errado enquanto `HIDE_BUY_CTA` estiver ligado:

- `src/components/sections/FAQ.jsx:39` — "A compra é segura?" → "os pagamentos são processados pelo PagBank".
- `src/components/layout/Footer.jsx:63-68` — selo "PagBank Pagamento Seguro" no rodapé.
- `src/components/pages/PrivacyPage.jsx:48,58,64,84` — tratamento de dados e processamento pelo PagBank.
- `src/components/pages/ShippingPolicyPage.jsx:60` — "O valor do frete é calculado automaticamente pelo PagBank no momento da compra".
- `src/components/pages/TermsPage.jsx:87` — redirecionamentos para plataformas externas como PagBank.

**Não "conserte" esses textos para WhatsApp** — eles descrevem o fluxo real e voltam a ficar corretos quando o interruptor for desligado. Ajustá-los agora só criaria retrabalho.

## Catálogo de produtos (`src/data/products.js`)

**9 categorias**, **37 produtos** (ids de 1 a 42, sem 2, 5, 7, 11 e 23). **29 visíveis** e **8 ocultos** (`visible: false`: ids 6, 13, 16, 19, 20, 27, 29, 32).

Dos 37: **28 usam `buyLink` único** e **9 usam `buyLinks`** (ids 8, 9, 14, 16, 17, 21, 28, 41, 42). Sete têm `prices` (ids 8, 14, 16, 21, 28, 41, 42); os ids 9 e 17 têm `buyLinks` sem `prices`. Nenhum produto está sem link de compra.

### `CATEGORIES`

Array de `{ id, label, visible }`. Todas as 9 categorias estão com `visible: true`. `visible: false` em uma categoria a remove das pills de filtro e dos carrosséis mesmo que existam produtos nela.

IDs, na ordem declarada: `mais-vendidos`, `couro`, `conforto`, `a-mesa`, `colecao-cozy-luxo`, `brinquedos`, `colecao-passeio`, `sono-refugio`, `viagem-mobilidade`.

Produtos visíveis por categoria: mais-vendidos 2, couro 7, conforto 3, a-mesa 4, colecao-cozy-luxo 3, brinquedos 3, colecao-passeio 3, sono-refugio 8, viagem-mobilidade 3.

### Campos de `PRODUCTS`

| Campo | Tipo | Observação |
|---|---|---|
| `id` | number | Único |
| `name` / `shortName` | string | `shortName` é usado no card/modal quando presente. **Ausente em 3 produtos** (ids 3, 4 e 10), que exibem `name` |
| `subtitle` | string \| null | Opcional. **A chave não existe** nos ids 3, 4 e 10 |
| `description` | string | Texto longo (quick view e ficha) |
| `bullets` | string[] | Lista de destaques |
| `price` | string | Preço formatado; `"a partir de R$ ..."` quando há variação |
| `originalPrice` | string \| null | Exibido riscado quando presente |
| `prices` | `{size, price}[]` | Ids 8, 14, 16, 21, 28, 41, 42 |
| `category` | string[] | Um produto pode estar em várias categorias |
| `order` | number | Não usado na ordenação de exibição |
| `categoryOrder` | `{ [categoryId]: number }` | Peso **por categoria**; maior valor aparece primeiro no carrossel daquela categoria |
| `image` | string | `/images/products/<slug-da-pasta>/principal.webp` — segue a convenção para os 37 produtos |
| `badge` | string \| null | Valores em uso: `MAIS VENDIDOS`, `PREMIUM`, `NOVO`, `Novo`, `Novidade`, `EXCLUSIVO`, `ESGOTADO`. `ESGOTADO` desabilita a compra e mantém só o WhatsApp |
| `buyLink` | string | Link PagBank único (28 produtos) |
| `buyLinks` | `{size, link, color?}[]` | Variação (9 produtos). `size` é a chave de seleção |
| `variationType` | string | `'cor'` só no id 17; ausente = seleção por tamanho |
| `tags` | string[] | Usado na busca textual |
| `supplierLink` | string | Referência interna do fornecedor; não é exibido na UI |
| `visible` | boolean | `false` remove o produto de grids, carrosséis, busca e da rota `/produto/:id` |
| `featured` | boolean | Só o id 8 tem `featured: true`. Os ids 13, 37, 38, 39 e 40 têm `featured: false` explícito; os demais não têm o campo |

### Inventário

| id | shortName | categorias | vis. | badge | compra | prices | originalPrice | featured |
|---|---|---|---|---|---|---|---|---|
| 1 | Brinquedo Interativo | brinquedos | visível | ESGOTADO | buyLink | — | sim | — |
| 3 | Garrafa Portátil Premium | viagem-mobilidade | visível | — | buyLink | — | sim | — |
| 4 | Comedouro Elevado | a-mesa | visível | — | buyLink | — | — | — |
| 6 | Refúgio Cozy | mais-vendidos, conforto, sono-refugio | oculto | MAIS VENDIDOS | buyLink | — | — | — |
| 8 | Bolsa Transporte | mais-vendidos, couro | visível | MAIS VENDIDOS | buyLinks(2) | prices(2) | — | **true** |
| 9 | Élan Couro | couro | visível | — | buyLinks(3) | — | — | — |
| 10 | Porta Saquinhos | couro | visível | — | buyLink | — | — | — |
| 12 | Sofá Essence | conforto, sono-refugio | visível | — | buyLink | — | — | — |
| 13 | Sofá Lounge PetLuxo™ | conforto, sono-refugio | oculto | — | buyLink | — | — | false |
| 14 | Cama CloudNest™ | sono-refugio | visível | — | buyLinks(3) | prices(3) | — | — |
| 15 | Coleira Atena™ | couro | visível | — | buyLink | — | — | — |
| 16 | Comedouro Maison Élevé | mais-vendidos, a-mesa | oculto | MAIS VENDIDOS | buyLinks(3) | prices(3) | — | — |
| 17 | Bolsa Voyage Signature | colecao-passeio | visível | — | buyLinks(2) | — | — | — |
| 18 | Cama Suspensa Élysée | conforto, sono-refugio | visível | — | buyLink | — | — | — |
| 19 | Arranhador Sisal | brinquedos | oculto | — | buyLink | — | — | — |
| 20 | Cama Suspensa Aura | mais-vendidos, conforto, sono-refugio | oculto | MAIS VENDIDOS | buyLink | — | — | — |
| 21 | Executive Bed™ | couro, sono-refugio | visível | — | buyLinks(2) | prices(2) | — | — |
| 22 | Bowl Cerâmica Spoiled | a-mesa | visível | — | buyLink | — | — | — |
| 24 | Fonte Automática Elegance | a-mesa | visível | — | buyLink | — | — | — |
| 25 | Mesa Gourmet Nordic™ | a-mesa | visível | — | buyLink | — | — | — |
| 26 | Roma Walk Set | colecao-passeio | visível | — | buyLink | — | — | — |
| 27 | Ursinho Interativo Kong | brinquedos | oculto | — | buyLink | — | — | — |
| 28 | Cabana Teepee Luxo | sono-refugio | visível | — | buyLinks(3) | prices(3) | — | — |
| 29 | Tapete Elegance | a-mesa | oculto | — | buyLink | — | — | — |
| 30 | Cesto Organizador Cozy | colecao-cozy-luxo | visível | — | buyLink | — | — | — |
| 31 | Estação de Passeio PetLuxo™ | colecao-cozy-luxo | visível | — | buyLink | — | — | — |
| 32 | Quadro Pet Personalizado | colecao-cozy-luxo | oculto | — | buyLink | — | — | — |
| 33 | Reservatório Hermético Cozy | colecao-cozy-luxo | visível | PREMIUM | buyLink | — | — | — |
| 34 | Bolsa Térmica Metalassê | colecao-passeio | visível | NOVO | buyLink | — | — | — |
| 35 | Manta Serenity™ | sono-refugio | visível | — | buyLink | — | — | — |
| 36 | Comedouro Nômade Premium | viagem-mobilidade | visível | PREMIUM | buyLink | — | — | — |
| 37 | Chaise Féline | viagem-mobilidade, sono-refugio | visível | EXCLUSIVO | buyLink | — | — | false |
| 38 | Refúgio Majesté | sono-refugio, conforto | visível | Novidade | buyLink | — | — | false |
| 39 | Brinquedo PetLuxo | brinquedos, mais-vendidos | visível | Novo | buyLink | — | — | false |
| 40 | Polvo Mimo™ Interativo | brinquedos | visível | — | buyLink | — | sim | false |
| 41 | Auréa Voyage | couro | visível | — | buyLinks(2) | prices(2) | — | — |
| 42 | Majestic Travel | couro | visível | — | buyLinks(2) | prices(2) | — | — |

### Quirks conhecidos do catálogo

- **id 31**: `buyLink` tem um espaço no fim — `'https://pag.ae/81QtMgE9m '`.
- **id 17**: `supplierLink` aponta para a página de um comedouro dobrável na Magalu — não corresponde ao produto. Nunca exibido na UI.
- **id 9**: `supplierLink` aponta para `.../kit-milano-camelo`, nome anterior do produto. Nunca exibido na UI.
- **Ordenação do grid de resultados**: `filteredProducts` em `Products.jsx` ordena pelo **maior** valor de `categoryOrder` entre todas as categorias do produto (`Math.max(...Object.values(categoryOrder))`), não pela categoria ativa.

Não há build step, CMS ou banco por trás deste arquivo. As edições são feitas direto no código-fonte, inclusive por um painel administrativo externo ao repositório, que escreve neste mesmo arquivo.

## Expansão de conteúdo de produtos (`src/data/productDetails.js`)

Conteúdo opcional de ficha completa, **em arquivo separado** de `products.js` — isolamento deliberado, já que o painel administrativo externo reescreve `products.js` e não conhece estes dados.

### `PRODUCT_DETAILS`

Objeto indexado por `id` de produto. **17 produtos têm entrada**: 6, 8, 9, 10, 12, 16, 17, 21, 34, 35, 36, 37, 38, 39, 40, 41 e 42.

### Schema (10 campos, todos opcionais)

| Campo | Tipo | Renderizado como |
|---|---|---|
| `gallery` | `string[]` | Alimenta o `ProductGallery` (fora do acordeão) |
| `specs` | `{ [chave]: valor }` | `AccordionItem` "Especificações técnicas" |
| `sizeChart` | `{size, height, length, width, weight}[]` | `AccordionItem` "Tabela de medidas" |
| `howToChooseSize` | `string` | `AccordionItem` "Como escolher o tamanho ideal" |
| `sizeGuideNote` | `string` | `AccordionItem` "Guia de medidas" |
| `whatsIncluded` | `string[]` | `AccordionItem` "O que acompanha" |
| `careInstructions` | `string` | `AccordionItem` "Limpeza e conservação" |
| `airTravelNote` | `string` | `AccordionItem` "Uso em viagens aéreas" |
| `warranty` | `string` | `AccordionItem` "Garantia" |
| `faq` | `{question, answer}[]` | `AccordionItem` "Perguntas frequentes" |

`docs/PRODUCT_EXPANSION.md` descreve apenas **9 campos** — não lista `sizeGuideNote`, que existe, é renderizado e está em uso. O schema efetivo do código tem 10.

A ordem dos `AccordionItem` é fixa no JSX de `ProductPage.jsx` (specs → sizeChart → howToChooseSize → sizeGuideNote → whatsIncluded → careInstructions → airTravelNote → warranty → faq), não no arquivo de dados. Todos começam fechados (nenhum usa `defaultOpen`).

### Estado por produto

15 das 17 entradas têm `gallery`. As exceções são os ids **6** e **34**.

| id | Produto | Campos presentes |
|---|---|---|
| 6 | Refúgio Cozy | `specs` (5), `whatsIncluded` (6), `careInstructions` |
| 8 | Bolsa Transporte | `gallery` (4), `specs` (8), `sizeChart` (3), `howToChooseSize`, `whatsIncluded` (4), `careInstructions`, `airTravelNote`, `warranty`, `faq` (6) |
| 9 | Élan Couro | `gallery` (4), `specs` (4), `whatsIncluded` (3), `sizeGuideNote` |
| 10 | Porta Saquinhos | `gallery` (1), `specs` (6), `whatsIncluded` (2), `careInstructions`, `warranty`, `faq` (6) |
| 12 | Sofá Essence | `gallery` (2), `specs` (9) |
| 16 | Comedouro Maison Élevé | `gallery` (4), `specs` (12), `sizeChart` (3) |
| 17 | Bolsa Voyage Signature | `gallery` (5) — nada mais |
| 21 | Executive Bed™ | `gallery` (5), `specs` (5), `sizeChart` (2), `whatsIncluded` (2), `careInstructions` |
| 34 | Bolsa Térmica Metalassé | `specs` (10), `whatsIncluded` (1), `sizeGuideNote` |
| 35 | Manta Serenity™ | `gallery` (3), `specs` (9), `whatsIncluded` (1), `careInstructions`, `faq` (6) |
| 36 | Comedouro Nômade Premium | `gallery` (3), `specs` (5) |
| 37 | Chaise Féline | `gallery` (7), `specs` (7) |
| 38 | Refúgio Majesté | `gallery` (2), `specs` (9), `whatsIncluded` (4), `careInstructions` |
| 39 | Brinquedo PetLuxo | `gallery` (2), `specs` (5) |
| 40 | Polvo Mimo™ Interativo | `gallery` (2), `specs` (5) |
| 41 | Auréa Voyage | schema completo: `gallery` (3), `specs` (10), `sizeChart` (2), `howToChooseSize`, `sizeGuideNote`, `whatsIncluded` (2), `careInstructions`, `airTravelNote`, `warranty`, `faq` (8) |
| 42 | Majestic Travel | schema completo: `gallery` (4), `specs` (10), `sizeChart` (2), `howToChooseSize`, `sizeGuideNote`, `whatsIncluded` (2), `careInstructions`, `airTravelNote`, `warranty`, `faq` (8) |

`sizeGuideNote` está em uso nos ids 9, 34, 41 e 42.

Produto sem entrada em `PRODUCT_DETAILS` funciona normalmente: a `ProductPage` mostra apenas o bloco principal, o `BrandSeal` e a imagem única.

### `SPEC_LABELS` — labels das chaves de `specs`

Mapa fixo no topo de `ProductPage.jsx` (`SPEC_LABELS`, ~50 entradas) que traduz as chaves de `specs` para o texto exibido no `<dt>`. Chave sem entrada no mapa cai no fallback da chave crua — e como o CSS aplica `text-transform: uppercase` sem inserir espaços, uma chave camelCase aparece grudada.

**Ao introduzir uma chave nova de `specs` em `productDetails.js`, a label correspondente precisa ser adicionada ao mapa.**

**Pendência atual:** o id 12 usa quatro chaves que **não** estão no `SPEC_LABELS` — `fonteEnergia`, `comprimentoTotal`, `larguraTotal` e `areaInterna`. Elas renderizam hoje com o fallback cru em uppercase.

### `sizeChart` parcial

`ProductPage.jsx` renderiza `row.length`, `row.width` e `row.weight` **incondicionalmente**, então toda linha precisa das 4 chaves. Quando a dimensão não se aplica ao produto, o padrão é manter a chave com o valor `'—'` em vez de omitir. O id 16 usa esse padrão (`length` e `weight` como `'—'`, já que o produto é variado por capacidade em ml). Outra forma de sinalizar dado desconhecido em uso é o texto "Consulte disponibilidade" (ids 8 e 21).

Observação para testes automatizados: como o colapso do acordeão usa `grid-template-rows: 0fr` + `overflow: hidden`, `boundingBox()`/`isVisible()` em cima de um elemento dentro do painel fechado pode retornar retângulo não vazio. Para confirmar que a seção está fechada, checar o `clientHeight` do `.panelInner`.

### Observações gerais dentro de campos existentes

O schema não tem campo dedicado a observações gerais (variação de tonalidade entre lotes, lembrete de conferir medidas, uso sazonal). Onde aparece hoje, a observação é incorporada ao final de `careInstructions` (aviso de aparência/manuseio) ou de `howToChooseSize` (lembrete de medidas).

### Link "Ver ficha completa" no `ProductModal`

`ProductModal.jsx` renderiza um link "Ver ficha completa →" só quando `PRODUCT_DETAILS[product.id]` existe, apontando para `/produto/:id`. Na prática ele quase não aparece, porque produtos com ficha completa não abrem mais o modal a partir do card (ver `ProductCard`).

## `ProductPage` (`src/components/pages/ProductPage.jsx`, rota `/produto/:id`)

Busca o produto em `PRODUCTS` pelo `id` da URL. Se não existir ou tiver `visible === false`, renderiza `Navbar` + `NotFound` + `Footer`. Quando existe, usa `MinimalNavbar` no lugar do `Navbar` padrão.

Estrutura renderizada:

1. Link "← Voltar para a loja"
2. `ProductGallery` com `images={details?.gallery?.length > 0 ? details.gallery : [product.image]}`
3. Bloco de informações: nome (`product.name`), `subtitle`, `originalPrice` riscado, preço, `ProductSizeSelector` (se houver `buyLinks`), descrição, `bullets`, `ProductBuyButton` + `TrustBadges`
4. `BrandSeal`
5. `Accordion` com as seções condicionais de `PRODUCT_DETAILS[product.id]`

**Bloco de preço:** quando o produto tem `prices`, renderiza apenas a linha da variação selecionada (`activePrice.size — activePrice.price`) se houver `buyLinks` e `selectedSize`; sem `buyLinks`, lista todas as linhas de `prices`. Sem `prices`, renderiza o `product.price` único.

## Navegação a partir do `ProductCard` (`src/components/product/ProductCard.jsx`)

O `ProductCard` decide sozinho o destino do clique, usando `Boolean(PRODUCT_DETAILS[product.id])`:

- **Com entrada em `PRODUCT_DETAILS`:** navega direto para `/produto/:id` via `useNavigate()`. O `ProductModal` não abre.
- **Sem entrada:** chama a prop `onQuick(product)`, que continua fluindo de `Products.jsx` (estado `quick` do `HomePage`, em `src/app/page.jsx`) → `ProductGrid` → `ProductCard`, abrindo o `ProductModal`.

Conteúdo do card: botão de "visualizar" (ícone `Plus`), imagem (`loading="lazy"`), badge, `shortName || name`, `originalPrice` riscado quando houver, `price`, e o texto fixo "VIA WHATSAPP".

O `ProductModal` não foi removido: continua sendo o quick view de todo produto **sem** ficha completa.

## `ProductBuyButton` (`src/components/product/ProductBuyButton.jsx`)

Componente compartilhado por `ProductModal` e `ProductPage`. Centraliza os 4 estados de compra (ver tabela em [Fluxo de compra](#fluxo-de-compra)). Recebe `{ product, activeBuyLink }`. Usa `wa()` para montar o link e importa `../../styles/buttons.css`.

Com `HIDE_BUY_CTA = true`, `activeBuyLink` é recebido mas não determina nenhum link renderizado — só o texto do preço na página/modal.

## `ProductSizeSelector` e variação por cor (`src/components/product/ProductSizeSelector.jsx`)

Componente único para tamanho e cor, usado em `ProductPage` e `ProductModal` com a mesma lista de `product.buyLinks` e o mesmo `onSelect`. Props: `buyLinks`, `selectedSize`, `onSelect`, `variationType`.

- `variationType === 'cor'` → rótulo "Selecione a cor:" e cada botão ganha um `<span className={styles.swatch}>` com `background` = campo `color` da entrada.
- Ausente ou outro valor → rótulo "Selecione o tamanho:", sem swatch. É o caso de 8 dos 9 produtos com `buyLinks`.
- Único produto com `variationType: 'cor'`: **id 17** (`buyLinks` com `size` = 'Cinza' e 'Rosa', e `color` = `#A9A49C` / `#B08A81`).
- Cada botão tem `aria-pressed` refletindo o estado ativo; a chave continua sendo `buyLink.size`, com cruzamento por igualdade de string no `useProductBuy`.

### `useProductBuy` (`src/hooks/useProductBuy.js`)

Mantém `selectedSize` (inicializado com o primeiro `buyLinks[0].size` num `useEffect` dependente de `product`) e deriva `activeBuyLink` (`buyLinks.find(bl => bl.size === selectedSize)`) e `activePrice` (`prices.find(p => p.size === selectedSize)`). Não distingue tamanho de cor.

## `ProductGrid` (carrossel)

Carrossel próprio, sem biblioteca externa. Paginação por `perView` (1 item abaixo de 640px, 2 abaixo de 1024px, 3 acima), setas, dots e swipe touch com limiar de 50px e detecção de direção. Props: `products`, `onQuick`, `resetKey`, `title`.

## `ProductGallery` (`src/components/product/ProductGallery.jsx`)

Recebe `images` (array de caminhos, com a capa sempre como **primeiro** item) e `alt`. Três branches:

- **`images.length <= 1`:** só a imagem, sem miniaturas, setas, dots nem lupa. Em touch, tocar abre o `ProductLightbox`.
- **Desktop/tablet (≥ 640px, mais de 1 imagem):** miniaturas clicáveis em coluna à **esquerda** (`<button>` por miniatura, `aria-current` na ativa) + par de setas circulares (`.navArrow`) sobre a imagem principal, desabilitadas nas extremidades (sem looping).
- **Mobile (< 640px, mais de 1 imagem):** carrossel arrastável de 1 imagem por vez, com swipe por `touchstart`/`touchmove`/`touchend` (limiar de 50px) e fileira de dots clicáveis.

Dois hooks locais: `useIsMobile(640)` decide **layout**; `usePointerCoarse()` (`window.matchMedia('(pointer: coarse)')`) decide o **gate do lightbox**. São independentes — um tablet touch em paisagem tem `isMobile=false` e `isTouch=true`. A troca de layout é decidida em JS com listener de `resize`, então desktop e mobile renderizam estruturas de DOM diferentes.

**Zoom com lupa:** botão `.zoomBadge` (um `<button>` real com `aria-pressed`) que **alterna** `zoomEnabled` (inicia `false`). Com zoom ativo, `onMouseMouseMove` sobre `.mainImageWrap` atualiza `backgroundPosition` do `.zoomOverlay` (`background-size: 200% 200%`). O badge só existe em telas ≥ 640px **sem touch** — em touch ele é substituído pelo toque que abre o lightbox. `zoomEnabled` é estado independente de `activeIndex`: trocar de foto não reseta o zoom.

## `ProductLightbox` (`src/components/product/ProductLightbox.jsx`)

Visualizador em tela cheia para dispositivos touch. Importado com `React.lazy` em `ProductGallery.jsx` e renderizado só dentro de `{isTouch && <Suspense>}` — o gate está no render condicional, não numa prop `open={false}`, então quem não tem touch nunca baixa o chunk da biblioteca.

- Pinch-to-zoom, double-tap, pan e swipe vêm do plugin `Zoom` do `yet-another-react-lightbox`; setas, fechar e o scroll lock do body vêm do core.
- `maxZoomPixelRatio: 2` (prop `zoom`) — calibrado para a resolução real das fotos do catálogo (~830px a ~1536px no lado maior).
- Theming por CSS custom properties `--yarl__*` em `ProductLightbox.module.css`, aplicados via prop `className`. `--yarl__portal_zindex` usa `var(--z-above-modal)`.
- **`--yarl__color_backdrop` é opaco (`var(--ink)`, alpha 1) por decisão conscious** — com backdrop translúcido o fundo vazava em alguns cenários de teste automatizado, apesar de todos os estilos computados estarem corretos. Se precisar de transparência no futuro, validar visualmente.
- Abre pelo `onClick` na `.mainImageWrap` nos branches de imagem única e desktop/tablet. No branch mobile, o `onTouchEnd` já existente foi estendido: sem swipe e com deslocamento `< 10px` em ambos os eixos, trata como toque real e abre o lightbox — evita abrir quando o usuário só rolava a página sobre a imagem.

**Ressalva de acessibilidade (consciente):** o pinch-zoom fora do lightbox é bloqueado via `touch-action` e listener de gesto, o que reduz a capacidade de zoom da página para quem depende de pinch-zoom por baixa visão. Não afeta o zoom de acessibilidade em nível de sistema operacional (ex.: "Zoom" do iOS), que é independente do `touch-action`.

## `Accordion` (`src/components/ui/Accordion.jsx`)

Genérico e sem conhecimento de produto. `Accordion` é só o wrapper visual (`<div>` com as bordas entre itens); `AccordionItem` (`title`, `defaultOpen`, `children`) controla seu próprio estado `open` — não há estado compartilhado no pai, então vários itens podem ficar abertos ao mesmo tempo.

Usado hoje só em `ProductPage.jsx`. O bloco principal do produto e o `BrandSeal` ficam **fora** do acordeão.

Cabeçalho é um `<button>` real dentro de `<h3>` (`aria-expanded`, `aria-controls`, navegável por teclado), com `Icon.Chevron` girando 180° via CSS. A transição usa CSS Grid `grid-template-rows: 0fr → 1fr` na `.panel`, sem medir altura em JS.

**Pegadinha de layout:** o padding do conteúdo não pode ficar no elemento com `overflow: hidden` dentro do grid item (`.panelInner`), porque padding conta para a altura mínima mesmo com a track em `0fr` e vaza alguns pixels de conteúdo. O padding fica num filho adicional (`.panelContent`), deixando `.panelInner` só com `overflow: hidden` e `min-height: 0`.

## `MinimalNavbar` (`src/components/layout/MinimalNavbar.jsx`)

Header fixo reduzido, usado **somente** na `ProductPage` de um produto existente e visível: só a marca (disco do logo + "PETLUXO"), sem links de seção, sem botão de WhatsApp e sem hambúrguer/drawer, em qualquer resolução. A marca é link para `/`.

Existe porque o `Navbar` padrão foi feito para navegar âncoras da home (`#produtos`, `#sobre`, `#faq`, `#contato`), o que não faz sentido numa ficha de produto — e porque a altura real do `Navbar` no mobile (~80px) era maior que o `padding-top` reservado pela `ProductPage`, deixando o header sobrepor o link "← Voltar para a loja".

Reaproveita `Navbar.module.css` (`.nav`, `.navScrolled`, `.brandMark`, `.logoDisc`) — **não existe** `MinimalNavbar.module.css`. O `padding-top` do `.page` em `ProductPage.module.css` é um valor fixo de `96px`, sem escala em `vw`.

O branch de produto não encontrado (id inválido ou `visible === false`) usa o `Navbar` padrão + `NotFound`, igual ao 404 global.

## `BrandSeal` (`src/components/ui/BrandSeal.jsx`)

Componente estático e global, sem props de produto (mesmo padrão de `TrustBadges`): renderiza sempre os mesmos 6 diferenciais fixos, cada um com emoji + texto curto. Aparece em toda ficha de produto, independente de haver entrada em `PRODUCT_DETAILS`.

Distinto de `Differentials.jsx` (seção da home, título "POR QUE ESCOLHER A PETLUXO" com 4 itens em formato editorial). Não compartilham código nem conteúdo.

## Seções da home (`src/app/page.jsx`)

Ordem: `Navbar` → `Hero` → `Featured` → `Products` → `Story` → `Differentials` → `CTA` → `FAQ` → `Footer`, mais `ProductModal` (quick view global) e, em desenvolvimento, `DevTweaks`. `ScrollToTop` é montado como irmão de `<Routes>` dentro de `App()`.

Rotas fora da home: `/produto/:id`, `/politica-de-privacidade`, `/politica-de-troca-e-devolucao`, `/politica-de-frete-e-entrega`, `/termos-de-uso`, e um catch-all `*` com `NotFound` dentro do layout padrão.

### `Featured` (`src/components/sections/Featured.jsx`)

Busca em `PRODUCTS` o **primeiro** produto com `featured === true && visible !== false` (hoje: id 8, Bolsa Transporte) e renderiza a seção "Produto em Destaque". Se nenhum produto tiver `featured: true`, a seção não renderiza nada.

Conteúdo: tag "DESTAQUE" sobre a imagem, "A PARTIR DE" + o **menor** valor de `prices` quando o produto tem `prices` (senão o `price` único), nome com `PetLuxo™` estilizado em itálico/dourado quando presente no `name` (função `renderName`), `subtitle`, `description` e **dois CTAs**:

- "CONSULTAR VIA WHATSAPP" (`btn btn-primary`, `wa()` com a mensagem `Olá! Gostaria de mais informações sobre "<name>".`)
- "VER TODOS OS PRODUTOS" (`btn btn-ghost`, `href="#produtos"`)

Não há nenhum `buyLink`/`buyLinks` neste componente.

### `Products` (`src/components/sections/Products.jsx`)

Dois modos de exibição:

- **Padrão** (sem busca/filtro ativo): carrossel "Mais Vendidos" sempre visível (hoje 2 produtos: ids 39 e 8, ordenados por `categoryOrder['mais-vendidos']` decrescente) + botão "Ver mais produtos" que expande um `ProductGrid` por categoria com `visible !== false` que tenha ao menos um produto visível.
- **Filtro** (busca digitada e/ou categoria selecionada): grid flat (`resultsGrid`) com os produtos que combinam, e estado vazio com link para WhatsApp quando nada é encontrado.

**Busca:** casa por palavras (todas as palavras digitadas precisam aparecer) em `name`, `shortName`, label das categorias do produto e `tags`. Produtos com `visible: false` nunca aparecem.

**Ordenação do grid de resultados:** por `Math.max(...Object.values(categoryOrder))` decrescente — o maior peso entre todas as categorias do produto, não o da categoria ativa. Já os carrosséis por categoria ordenam pela `categoryOrder` da categoria específica.

**Filtro de categoria — dois componentes:**
- Desktop (≥ 641px): pills horizontais em `styles.pillsScroll`, com "Todos" + uma pill por categoria que tenha produto visível (`categoriesWithProducts`).
- Mobile (≤ 640px): `CategorySelector` (`src/components/ui/CategorySelector.jsx`) — botão fechado que mostra a categoria selecionada (ou "Todos") e abre um **bottom sheet** com todas as opções. Fecha com `Escape` e devolve o foco ao botão gatilho; enquanto aberto, congela a página com `body { position: fixed; top: -scrollY }` (técnica necessária porque `overflow: hidden` não basta com `scroll-behavior: smooth`).

Há também um botão `searchClear` (ícone ×) que aparece quando há texto na busca, limpando o campo e devolvendo o foco ao input.

**Encerramento da categoria — "FIM DESTA SELEÇÃO":** bloco editorial entre o último produto da categoria filtrada e a seção "Sobre Nós" (`Story`). Aparece dentro do branch de filtro, logo após o `resultsGrid`, com a condição `activeCategory !== null && query.trim() === ''` — não aparece na busca textual pura nem na busca+categoria (o texto "fim desta categoria" mentiria). Conteúdo: label "FIM DESTA SELEÇÃO" (`.section-tag`), a linha "Você chegou ao fim desta categoria." em `.serif`, e o CTA "Explorar categorias" (`btn btn-ghost` + `Icon.ArrowR`), que faz `setActiveCategory(null)` + `scrollIntoView({ behavior: 'smooth', block: 'start' })` — mesmo padrão de `handleCollapse`. Animação por `resultFadeIn` (CSS puro), não por `.reveal`.

**Observador local de reveal:** `Products.jsx` tem um `IntersectionObserver` próprio que reobserva `.reveal:not(.in)` a cada mudança de `isFiltering`/`filteredProducts`/`expanded`, porque o `useScrollEffects` global roda só uma vez no mount e não enxerga elementos montados depois pelo React.

**Input de busca:** `.searchInput` usa `font-size: 16px` — abaixo de 16px o iOS Safari dá zoom automático na página ao focar o campo (ver [Bloqueio de pinch-zoom](#bloqueio-de-pinch-zoom-e-reset-de-escala)). `padding: 10px 0` e `line-height` explícito mantêm a altura da barra próxima à original com 13px.

## `ScrollToTop` (`src/app/ScrollToTop.jsx`)

Componente sem renderização (`return null`), montado uma única vez em `App()`, dentro do `<BrowserRouter>`, como irmão de `<Routes>`. Usa `useLocation()` e um `useEffect` em toda mudança de `pathname` para rolar ao topo.

- **Chamada dupla (imediato + `requestAnimationFrame`):** chama `window.scrollTo({ top: 0, left: 0, behavior: 'instant' })` de imediato e agenda uma segunda chamada idêntica no frame seguinte. O reforço é necessário porque, com `scroll-behavior: smooth` global, uma rolagem suave ainda em andamento no momento da navegação continuava assentando por cima do reset.
- **`overflow-anchor: none` global:** desativa o scroll anchoring nativo, que num cliente-side routing só competia com o reset (o conteúdo da rota anterior não existe mais).
- Vale para todas as rotas, não só `ProductPage`.

## Bloqueio de pinch-zoom e reset de escala

### `globals.css`

`html, body` define:

- `scroll-behavior: smooth` — rolagem suave para links âncora.
- `overflow-anchor: none` — desativa o scroll anchoring nativo (ver `ScrollToTop`).
- `touch-action: pan-x pan-y` — bloqueia pinch-zoom e double-tap-zoom do navegador no site inteiro, mantendo a rolagem normal. É por elemento: o container do `ProductLightbox` declara `touch-action: none` internamente e, pela spec, o valor efetivo é a interseção com os ancestrais — o mais restritivo vence — então o pinch-zoom funciona normalmente dentro dele.

`user-scalable=no` na meta viewport **não** é usado (falha de acessibilidade documentada, WCAG 1.4.4/1.4.10).

Também há um override de espaçamento da seção de produtos: `#produtos.section-pad { padding: clamp(36px, 4vh, 56px) 0 }`.

### `main.jsx` — camada específica do WebKit

`touch-action` sozinho não basta no Safari/iOS: o pinch-zoom de página no WebKit é disparado pelos eventos `gesturestart`/`gesturechange`/`gestureend`, uma `GestureEvent` proprietária que o `touch-action` não cobre. `src/main.jsx` instala, fora do React e no mesmo padrão de inicialização do arquivo:

**1. Bloqueio dos gestos** — `blockPinchZoomGesture` com `preventDefault()`, registrado nos três eventos com `{ passive: false }` (obrigatório, senão o navegador pode ignorar o `preventDefault`). Como só o WebKit dispara esses eventos (Chromium e Gecko tratam pinça como `wheel` com `ctrlKey`), é no-op garantido nos demais navegadores, sem checar `navigator.userAgent`. Exceção: `isInsideLightbox(target)` faz `closest('[class*="yarl__portal"]')` e pula o `preventDefault` dentro do lightbox.

**2. Reset da escala (`resetPageZoomToNormal`)** — rede de segurança para quando o `preventDefault` perde a corrida com o reconhecimento nativo de gesto e a página fica ampliada. Não existe método padronizado de reset (`VisualViewport.resetScale()` foi discutido no CSSWG e nunca implementado; `scale` também não é animável por CSS), então a técnica é alternar o `content` da `<meta name="viewport">` para `maximum-scale=1.0`, o que faz o WebKit encaixar a escala de volta em 1x num reflow. Safeguards:
- guarda `isResettingPageZoom` para evitar reentrância;
- `void document.documentElement.offsetHeight` força um reflow síncrono entre as duas escritas do atributo (sem isso o navegador pode agrupá-las e nunca aplicar o reset);
- dois `requestAnimationFrame` em sequência antes de restaurar o `content` original;
- skip se existir `.yarl__portal` (lightbox aberto).

**3. Gatilhos do reset:**
- `gestureend` (com `{ passive: true }`), pulando o alvo dentro do lightbox e ignorando repetições dentro de 100ms — alguns builds do WebKit disparam `gestureend` duas vezes para o mesmo gesto;
- `visualViewport.addEventListener('resize')` com debounce de 150ms: `resize` dispara durante e depois do gesto, e o debounce detecta quando a escala parou de mudar, cobrindo o caso em que `gestureend` não chega. Também pula se houver lightbox aberto.

**Limite conhecido:** pinch-to-zoom real de dois dedos não é simulável de forma confiável em automação — a validação disso exige aparelho físico.

## WhatsApp (`src/lib/whatsapp.js`)

Número lido de `import.meta.env.VITE_WHATSAPP_PHONE`, com fallback hardcoded `5561994063917`. `wa(texto)` monta a URL `wa.me` com a mensagem pré-codificada. É o destino de compra de todo o site (ver [Fluxo de compra](#fluxo-de-compra)) e aparece no FAB flutuante (inicializado em `main.jsx` a partir de `#waFab`), na Navbar, no Footer, na Featured, no estado vazio da busca e no `FAQ`.

`MinimalNavbar` é a única tela **sem** botão de WhatsApp — a `ProductPage` já tem dois caminhos (o `ProductBuyButton` e o `Footer`).

`.env.local` e `.env.example` definem `VITE_WHATSAPP_PHONE` (prefixo `VITE_` para o Vite expor a variável).

## Estilos

Sem framework de UI. Cada componente com estilo próprio tem um `.module.css`. Estilos globais em `src/styles/`: tokens (`variables.css`), reset/utilitárias (`globals.css`), `@keyframes` (`animations.css`) e `.btn` + variantes (`buttons.css`, importado explicitamente por quem usa botões).

Utilitárias globais relevantes: `.wrap` (max-width + padding lateral), `.section-pad`, `.section-tag` (com `.num` e `.line`), `.serif`, `.italic`, `.gold-text` (gradiente com `-webkit-background-clip: text`), `.hairline`, `.reveal` + `.in` + `.d1`..`.d5`, `.grain` (overlay de textura em `position: fixed`, z-index 200), `::selection`.

Fontes via Google Fonts: Cormorant Garamond (serif), Inter (texto) e JetBrains Mono (mono).

## `DevTweaks` (apenas desenvolvimento)

`src/app/DevTweaks.jsx` é carregado via `React.lazy` só quando `import.meta.env.DEV` — o Vite elimina o import do bundle de produção por dead-code elimination. Usa os componentes genéricos de `src/tweaks-panel.jsx` para expor em runtime: tom de acento (dourado/vinho/grafite), visibilidade do FAB do WhatsApp e da textura de grão de fundo. Nenhum `<input>` de produção existe no site além do campo de busca da seção `Products`.

## SEO / Analytics

`index.html` define meta tags (description, Open Graph, Twitter Card, `theme-color`), favicon e Google Analytics (GA4 via `gtag.js`, `G-KKMV5VHR48`). `public/robots.txt` e `public/sitemap.xml` completam o SEO. `public/404.html` guarda o pathname em `sessionStorage` e redireciona para `/`; `main.jsx` restaura o pathname com `history.replaceState`.

As meta tags são únicas e globais — não há gerenciamento de `<head>` por rota, então `/produto/:id` herda as mesmas tags da home (limitação registrada em `docs/PRODUCT_EXPANSION.md`).

## Deploy e variáveis de ambiente

Hospedagem na Vercel (plano Hobby, exige repositório público). Deploy automático a cada push em `main`: a Vercel roda `npm run build` e publica `dist/`. Projeto vinculado localmente via `.vercel/project.json`. Não há `vercel.json` — o roteamento de SPA depende do `public/404.html`.

Única variável de ambiente do projeto: `VITE_WHATSAPP_PHONE`. Sem API própria, sem banco, sem autenticação. As variáveis do checkout planejado estão listadas em `docs/CHECKOUT_ARCHITECTURE.md` e **não** existem.