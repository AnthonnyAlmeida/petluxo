# PetLuxo — Contexto do Projeto

E-commerce institucional (site estático, sem backend/banco de dados) para produtos premium de pets. Catálogo, busca/filtro e checkout são resolvidos inteiramente no front-end; a "compra" é um redirecionamento para um link de pagamento PagBank (ou, na ausência dele, para o WhatsApp).

- **Produção:** https://petluxostory.com.br
- **Repositório:** GitHub → deploy automático via Vercel a cada push em `main`
- **Instagram:** @petluxostory

## Stack

- **React 18.3.1** (componentes funcionais + hooks, sem gerenciador de estado externo)
- **React Router DOM 7** (`BrowserRouter`, rotas declaradas em `src/app/page.jsx`)
- **Vite 6** como bundler/dev server
- **CSS Modules** por componente — não há framework de UI (Tailwind, MUI etc.)
- Sem TypeScript — projeto 100% JavaScript (`.jsx`/`.js`)

Scripts (`package.json`): `npm run dev` (porta 5173, `--host` liberado em `vite.config.js`), `npm run build`, `npm run preview`.

## Estrutura de pastas

```
petluxo/
├── index.html                  # Shell HTML: meta tags, Open Graph, Twitter Card, Google Analytics (gtag)
├── public/
│   ├── favicon.ico / favicon.svg
│   ├── og-image.png
│   ├── robots.txt / sitemap.xml
│   ├── 404.html                # Redireciona para index.html preservando o path (suporte a SPA na Vercel)
│   └── images/
│       ├── brand/
│       └── products/            # Uma pasta por produto (slug kebab-case) — ver seção própria abaixo
├── src/
│   ├── main.jsx                 # Entry point: monta <App/>, inicializa link do FAB do WhatsApp, restaura path do 404.html
│   ├── app/
│   │   ├── page.jsx             # Componente raiz — define as <Routes> e monta a home (todas as seções)
│   │   └── DevTweaks.jsx        # Painel de ajustes visuais, carregado só em dev (ver seção própria abaixo)
│   ├── components/
│   │   ├── layout/              # Navbar (com drawer mobile), MinimalNavbar (header reduzido, só ProductPage) e Footer
│   │   ├── product/              # ProductCard, ProductGrid (carrossel), ProductModal (quick view),
│   │   │                         # ProductSizeSelector, ProductBuyButton (compartilhados entre modal e ProductPage)
│   │   ├── sections/              # Hero, Featured, Products, Story, Differentials, CTA, FAQ, NotFound
│   │   ├── pages/                # PrivacyPage, ReturnPolicyPage, ShippingPolicyPage, TermsPage (rotas de política),
│   │   │                         # ProductPage (ficha completa de produto, rota /produto/:id)
│   │   └── ui/                  # Button, Container, Section, TrustBadges, Accordion (Accordion + AccordionItem),
│   │                             # BrandSeal (selo global "Por que escolher a PetLuxo?")
│   ├── data/
│   │   ├── products.js          # Fonte de verdade do catálogo (CATEGORIES + PRODUCTS)
│   │   └── productDetails.js    # Conteúdo expandido de produtos (ficha completa), opcional, indexado por id — ver seção própria abaixo
│   ├── hooks/
│   │   ├── useScroll.js         # useScrollEffects: scroll-reveal via IntersectionObserver + paralaxe do logo na Hero
│   │   └── useProductBuy.js     # Estado de tamanho selecionado + link/preço ativos, compartilhado entre ProductModal e ProductPage
│   ├── lib/
│   │   └── whatsapp.js          # Geração de links wa.me
│   ├── icons.jsx                 # Conjunto de ícones SVG inline usados nos componentes
│   ├── tweaks-panel.jsx          # Componentes genéricos do painel de dev (TweaksPanel, TweakSection, TweakRadio, TweakToggle, useTweaks)
│   └── styles/
│       ├── variables.css        # Design tokens (cores, tipografia, espaçamentos)
│       ├── globals.css          # Reset + utilitárias globais
│       ├── animations.css       # @keyframes globais
│       └── buttons.css          # Estilos de `.btn` e variantes, importado por quem usa botões
└── docs/                        # CSS_MIGRATION.md, DECISIONS.md, DEPLOY.md, PRODUCT_EXPANSION.md, README.md, TODO.md
```

## Catálogo de produtos (`src/data/products.js`)

Estado atual: **9 categorias**, **32 produtos** (3 deles com `visible: false`, portanto ocultos no site).

### `CATEGORIES`
Array de `{ id, label, visible }`. `visible: false` remove a categoria das pills de filtro e dos carrosséis, mesmo que existam produtos nela.

IDs atuais, na ordem declarada: `mais-vendidos`, `couro`, `conforto`, `a-mesa`, `colecao-cozy-luxo`, `brinquedos`, `colecao-passeio`, `sono-refugio`, `viagem-mobilidade`.

### `PRODUCTS`
Array de objetos de produto. Campos:

| Campo | Tipo | Observação |
|---|---|---|
| `id` | number | Único |
| `name` / `shortName` | string | `shortName` é usado no card/modal quando presente |
| `subtitle` | string \| null | Subtítulo opcional exibido no modal |
| `description` | string | Texto longo do quick view |
| `bullets` | string[] | Lista de destaques no modal |
| `price` | string | Preço formatado (ex.: `"R$ 149,90"` ou `"a partir de R$ 329,90"` quando há variações) |
| `originalPrice` | string \| null | Preço "de", exibido riscado quando presente |
| `prices` | `{size, price}[]` (opcional) | Usado junto com `buyLinks` para produtos com variação de tamanho |
| `category` | string[] | Um produto pode pertencer a múltiplas categorias simultaneamente |
| `order` | number | Não usado atualmente na ordenação de exibição (a ordenação real é por `categoryOrder`) |
| `categoryOrder` | `{ [categoryId]: number }` | Peso de ordenação **por categoria** — cada categoria em que o produto aparece tem seu próprio peso; maior valor aparece primeiro nos carrosséis/grid daquela categoria |
| `image` | string | `/images/products/<slug-do-produto>/principal.webp` — todos os 32 produtos seguem essa convenção de pasta própria (ver seção "Convenção de pastas de imagem" abaixo) |
| `badge` | string \| null | Selo exibido no card (ex.: `"MAIS VENDIDOS"`, `"NOVO"`, `"PREMIUM"`, `"EXCLUSIVO"`, ou `"ESGOTADO"` — este último desabilita a compra e mostra apenas o link de WhatsApp) |
| `buyLink` | string (opcional) | Link único de pagamento PagBank |
| `buyLinks` | `{size, link}[]` (opcional) | Alternativa a `buyLink` quando o produto tem variações — o modal exibe seletor de tamanho |
| `tags` | string[] | Usado na busca textual |
| `supplierLink` | string (opcional) | Link/nota interna do fornecedor (não é exibido na UI) |
| `visible` | boolean (opcional) | Quando `false`, o produto some do site (grids, carrosséis, busca) mesmo com dados completos |
| `featured` | boolean (opcional) | Quando `true`, marca o produto exibido na seção `Featured` ("Produto em Destaque"). Deve haver no máximo um produto com `featured: true` visível por vez — a seção usa o primeiro encontrado |

Não há build step, CMS ou banco por trás deste arquivo — edições são feitas diretamente no código-fonte (inclusive por um painel administrativo externo ao repositório, que também commita direto neste arquivo).

## Expansão de conteúdo de produtos (`src/data/productDetails.js`)

Ficha completa de produto, com conteúdo opcional além do que já existe em `products.js`: galeria de fotos adicionais, especificações técnicas estruturadas, tabela de medidas por tamanho, texto de "como escolher o tamanho", "o que acompanha", cuidados/conservação, nota de viagem aérea, garantia e FAQ por produto. Decisão de arquitetura completa e plano de fases em [`docs/PRODUCT_EXPANSION.md`](docs/PRODUCT_EXPANSION.md).

- **`PRODUCT_DETAILS`**: objeto indexado por `id` de produto, definido em `src/data/productDetails.js` — arquivo **separado** de `products.js` de propósito, para isolar completamente do painel admin externo (que só escreve em `products.js`). **Fase 3 (piloto) concluída:** a Bolsa Transporte PetLuxo (`id: 8`) é o primeiro e único produto com entrada populada até o momento — serviu de piloto para validar o schema na prática (specs, sizeChart, howToChooseSize, whatsIncluded, careInstructions, airTravelNote, warranty, faq; sem `gallery`, ainda sem fotos adicionais para esse produto). Os demais 31 produtos continuam sem entrada e seguem exibindo a ficha padrão, sem nenhuma seção nova. O preenchimento dos demais produtos entra na Fase 4, um de cada vez.
- Todo campo dentro de uma entrada é opcional (`gallery`, `specs`, `sizeChart`, `howToChooseSize`, `whatsIncluded`, `careInstructions`, `airTravelNote`, `warranty`, `faq`). Produto sem entrada em `PRODUCT_DETAILS` continua funcionando exatamente como hoje, sem nenhuma seção nova aparecendo.
- **`ProductPage`** (`src/components/pages/ProductPage.jsx`, rota `/produto/:id`): busca o produto em `PRODUCTS` pelo `id` da URL; se não existir ou tiver `visible === false`, renderiza `NotFound` com o `Navbar` padrão. Quando o produto existe, usa `MinimalNavbar` (ver seção própria abaixo) em vez do `Navbar` padrão. Exibe os dados que já existem em `products.js` (imagem, nome, subtitle, description, bullets, preço), o selo `BrandSeal` (ver abaixo) e, condicionalmente, cada seção de `PRODUCT_DETAILS[product.id]` — só a que tiver dados, dentro de um `Accordion` (ver abaixo).
- O `ProductModal` (quick view) ganhou um link condicional "Ver ficha completa", que só aparece quando `PRODUCT_DETAILS[product.id]` existe, apontando para `/produto/:id`. O modal em si não mudou de comportamento. Validado no piloto: o modal da Bolsa Transporte PetLuxo (id 8) exibe o link; os demais produtos, sem entrada em `PRODUCT_DETAILS`, não exibem.
- A lógica de 3 estados do botão de compra (ESGOTADO / `buyLinks` com seletor de tamanho / `buyLink` único / fallback WhatsApp) e o estado de tamanho selecionado foram extraídos para componentes/hook compartilhados entre `ProductModal` e `ProductPage`, em vez de duplicados: `useProductBuy` (`src/hooks/useProductBuy.js`), `ProductBuyButton` e `ProductSizeSelector` (`src/components/product/`).
- **Nota de padronização do piloto:** o schema não tem campo dedicado a observações gerais (variação de tonalidade entre lotes/telas, lembrete de conferir medidas antes da compra). No piloto da Bolsa Transporte, a observação sobre variação de tonalidade foi incorporada ao final de `careInstructions` (por ser um aviso geral de aparência do produto, mais próximo de "cuidados" do que de qualquer outro campo existente) e o lembrete de conferir medidas foi incorporado ao final de `howToChooseSize` (por já tratar diretamente de medidas). Nenhum campo novo foi criado — se esse padrão se repetir em outros produtos na Fase 4, vale reavaliar se compensa formalizar um campo próprio no schema.

### `Accordion` — acordeão genérico (`src/components/ui/Accordion.jsx`)

Componente genérico e reutilizável, sem conhecimento de produto: `Accordion` é só um wrapper visual (`<div>` com as bordas entre itens); `AccordionItem` (`title`, `defaultOpen`, `children`) controla seu próprio estado `open` internamente via `useState` — não há estado compartilhado no `Accordion` pai, então múltiplos itens podem ficar abertos ao mesmo tempo por padrão.

Usado hoje só em `ProductPage.jsx`, envolvendo exclusivamente as seções de conteúdo expandido de `PRODUCT_DETAILS` (specs, sizeChart, howToChooseSize, whatsIncluded, careInstructions, airTravelNote, warranty, faq) — o bloco principal do produto (imagem/nome/preço/descrição/bullets/botão de compra) e o `BrandSeal` continuam fora do acordeão, renderizados normalmente. Cada `AccordionItem` só é renderizado quando aquele campo tem dado (mesma renderização condicional que já existia antes do acordeão) — produto sem aquele campo não gera item vazio. Todas as seções começam fechadas por padrão (nenhum `AccordionItem` usa `defaultOpen` em `ProductPage.jsx`) e só abrem ao clique do usuário.

Detalhes de implementação:
- Cabeçalho é um `<button>` real dentro de um `<h3>` (`aria-expanded`, `aria-controls` apontando para o painel, navegável por teclado/Enter/Espaço nativamente por ser um `button`), com um `Icon.Chevron` (`src/icons.jsx`) que gira 180° via CSS quando aberto.
- A transição de abrir/fechar usa a técnica de CSS Grid `grid-template-rows: 0fr → 1fr` (`Accordion.module.css`, classe `.panel`) em vez de medir altura via JS — mais simples e sem layout thrashing. Pegadinha encontrada e corrigida durante a implementação: o padding do conteúdo **não pode** ficar no elemento que tem `overflow: hidden` direto dentro do grid item (`.panelInner`), porque padding conta para a altura mínima da caixa mesmo com a track em `0fr`, causando um vazamento visual de alguns pixels de conteúdo mesmo com o item "fechado". A correção foi mover o padding para um `<div>` filho adicional (`.panelContent`), deixando `.panelInner` (o grid item de fato) sem padding — só `overflow: hidden` e `min-height: 0`.
- Estilizado com os tokens de `variables.css` (título em `var(--serif)`, chevron em `var(--caramelo)`, bordas em `var(--bege)`, hover/foco em `var(--vinho)`), sem aparência de componente genérico "cru".

### `MinimalNavbar` — header reduzido, exclusivo da `ProductPage` (`src/components/layout/MinimalNavbar.jsx`)

Header fixo simplificado, usado **somente** quando `ProductPage` renderiza a ficha de um produto existente e visível — mostra apenas a marca (disco do logo + "PETLUXO"), sem os links de seção (Produtos/Sobre/FAQ/Contato), sem botão de WhatsApp e sem hambúrguer/drawer, em qualquer resolução. A marca continua sendo um link para `/`.

- **Por que existe:** o `Navbar` padrão foi construído para navegar entre seções da home (âncoras `#produtos`, `#sobre`, `#faq`, `#contato`) — isso não faz sentido dentro de uma ficha de produto específica, onde o cliente já chegou ao destino. Além disso, a altura real do `Navbar` padrão no mobile (~80px, definida pelo botão hambúrguer de 44px) era maior que o `padding-top` reservado pela `ProductPage` (que usava um `clamp()` baseado em `vw`, encolhendo para perto do piso de 48px em telas estreitas) — o header ficava sobrepondo o link "← Voltar para a loja". No desktop o mesmo `clamp` calculava um valor coincidentemente maior que a altura real do Navbar, por isso o problema só era visível no mobile.
- **Reaproveitamento de estilos:** em vez de duplicar CSS, `MinimalNavbar.jsx` importa `Navbar.module.css` e usa diretamente as classes `.nav`/`.navScrolled` (fixed no topo, mesmo `z-index: var(--z-navbar)`, mesmo efeito de blur ao rolar a página) e `.brandMark`/`.logoDisc` (mesma tipografia/ícone da marca). Não existe `MinimalNavbar.module.css` — não há nada específico o suficiente para justificar um arquivo próprio.
- **Onde é usado:** exclusivamente dentro de `ProductPage.jsx`, no branch em que o produto existe e está visível. O branch de "produto não encontrado" (`id` inválido ou `visible === false`) continua usando o `Navbar` padrão + `NotFound`, para manter a mesma experiência do 404 global do site (rota catch-all `*` em `src/app/page.jsx`), com navegação completa para o usuário se orientar. **Nenhuma outra página** (home, políticas, 404 global) foi alterada — todas continuam com `Navbar` padrão.
- **Botão de WhatsApp:** decisão consciente de **não** incluir no `MinimalNavbar`, por dois motivos: (1) já existe precedente no projeto de remover CTAs de WhatsApp redundantes de contextos de navegação (commit `refactor: remove botão WhatsApp do drawer mobile da Navbar`); (2) a `ProductPage` já oferece WhatsApp de sobra — via `ProductBuyButton` (link secundário/fallback de compra) e via `Footer` — então repetí-lo no header só adicionaria ruído a um header pensado para ser mínimo.
- **`padding-top` da `ProductPage`:** ajustado em `ProductPage.module.css` (`.page`) de `clamp(48px, 8vw, 96px)` para um valor fixo de `96px` (sem escala em `vw`), já que a causa raiz do bug de sobreposição no mobile era justamente esse `clamp` encolher abaixo da altura real do header em telas estreitas. `96px` cobre com folga a altura real do `MinimalNavbar` em qualquer largura (~68px no mobile mais estreito, sem o hambúrguer; ~74px no desktop).

### `BrandSeal` — selo "Por que escolher a PetLuxo?" (`src/components/ui/BrandSeal.jsx`)

Componente estático e global, sem props de produto (mesmo padrão de `TrustBadges.jsx`): renderiza sempre os mesmos 6 diferenciais fixos (curadoria premium, envio para todo o Brasil, compra segura, atendimento personalizado, conforto do pet, qualidade/elegância), cada um com emoji + texto curto. Usado dentro de `ProductPage`, entre o bloco principal do produto (imagem/preço/descrição/bullets) e as seções de conteúdo expandido — aparece em toda ficha de produto, independente de o produto ter ou não entrada em `PRODUCT_DETAILS`.

**Distinto de `Differentials.jsx`** (seção da home, também com título "POR QUE ESCOLHER A PETLUXO", mas com 4 itens em formato de seção editorial completa, com números, título grande e call-to-action). `BrandSeal` é um bloco compacto e denso (card com grid 2 colunas, tipografia pequena), pensado para reforçar confiança dentro da ficha de produto sem competir visualmente com o conteúdo. Os dois componentes não compartilham código nem conteúdo e `Differentials.jsx` não foi alterado.

### Convenção de pastas de imagem por produto (`public/images/products/`)

**Todos os 32 produtos** têm sua própria pasta dentro de `public/images/products/`, nomeada com o slug do nome do produto — kebab-case, minúsculo, sem acento, sem espaço (ex.: `bolsa-transporte-petluxo`, `cama-petluxo-cloudnest`). Dentro da pasta: `principal.webp` é sempre a imagem de capa (a referenciada em `product.image`, usada no card, no modal e como imagem principal da `ProductPage`); fotos adicionais entram numeradas sequencialmente (`2.webp`, `3.webp`, ...) conforme forem chegando, para uso futuro em `PRODUCT_DETAILS[id].gallery`. Hoje a maioria das pastas só tem `principal.webp` — a galeria em si ainda não foi populada para nenhum produto, incluindo a Bolsa Transporte PetLuxo (piloto da Fase 3).

A ideia original era migrar produto por produto, só quando ganhasse galeria própria; essa decisão foi revertida em favor de deixar a convenção consistente em todo o catálogo desde já — os 32 produtos foram migrados de uma vez, preservando o histórico do arquivo via `git mv`. Produtos novos que entrarem no catálogo devem seguir a mesma convenção desde o cadastro. Detalhes e o risco aceito (nome da pasta pode ficar desatualizado se o produto for renomeado — inofensivo, é só identificador de arquivo) estão documentados em [`docs/PRODUCT_EXPANSION.md`](docs/PRODUCT_EXPANSION.md).

## Seções da home (`src/app/page.jsx`)

Ordem: `Navbar` → `Hero` → `Featured` → `Products` → `Story` → `Differentials` → `CTA` → `FAQ` → `Footer`, mais `ProductModal` (quick view global) e, em desenvolvimento, `DevTweaks`.

Rotas adicionais (fora da home): `/produto/:id` (ficha completa de produto, ver seção acima), `/politica-de-privacidade`, `/politica-de-troca-e-devolucao`, `/politica-de-frete-e-entrega`, `/termos-de-uso`, e um catch-all `*` que renderiza `NotFound` dentro do layout padrão (Navbar + Footer).

### `Featured` (`src/components/sections/Featured.jsx`)
Seção "Produto em Destaque", logo após a Hero. Busca em `PRODUCTS` o primeiro produto com `featured === true && visible !== false` e renderiza imagem, nome (com `PetLuxo™` estilizado em itálico/dourado quando presente no nome), subtítulo, descrição completa e botão "COMPRAR AGORA" (`buyLink` ou o primeiro item de `buyLinks`). Se o produto tiver `prices`, mostra o menor valor precedido de "A PARTIR DE". Se nenhum produto tiver `featured: true`, a seção não renderiza nada.

### `Products` (`src/components/sections/Products.jsx`)
Seção central do catálogo. Dois modos de exibição:

- **Modo padrão** (sem busca/filtro ativo): carrossel "Mais Vendidos" sempre visível + botão "Ver mais produtos" que expande um carrossel por categoria (uma `ProductGrid` para cada categoria com `visible !== false` que tenha ao menos um produto visível).
- **Modo filtro** (busca digitada e/ou pill de categoria selecionada): substitui os carrosséis por um grid flat (`resultsGrid`) com todos os produtos que combinam o filtro; exibe estado vazio com link para WhatsApp quando nada é encontrado.

A busca casa por palavras (todas as palavras digitadas precisam aparecer) em `name`, `shortName`, `label` das categorias do produto e `tags`. Produtos com `visible: false` nunca aparecem em busca, filtro ou carrosséis.

### `ProductGrid` (carrossel)
Carrossel próprio (sem biblioteca externa), com paginação por `perView` responsivo (1 item < 640px, 2 < 1024px, 3 acima disso), setas, dots e swipe touch (limiar de 50px, com detecção de direção para não capturar scroll vertical).

### `ProductCard`
Card clicável que abre o `ProductModal` (quick view) via callback `onQuick`. Mostra imagem, badge, nome, preço (com preço original riscado quando houver) e rótulo "COMPRAR AGORA" ou "VIA WHATSAPP" conforme o produto tenha `buyLink`/`buyLinks` ou não.

### `ProductModal` (quick view)
Modal com imagem, descrição, bullets e botão de ação. Regras de exibição do botão principal (via `ProductBuyButton`, compartilhado com `ProductPage` — ver seção "Expansão de conteúdo de produtos"):
1. `badge === 'ESGOTADO'` → botão de compra desabilitado + link "CONSULTAR VIA WHATSAPP"
2. Produto com `buyLinks` → seletor de tamanho (`ProductSizeSelector`) + botão "COMPRAR AGORA" apontando para o link do tamanho selecionado
3. Produto com `buyLink` único → botão "COMPRAR AGORA" direto
4. Nenhum link de compra → botão único "CONSULTAR VIA WHATSAPP"

Em todos os casos com link de compra, também é oferecido um link secundário para WhatsApp. Quando o produto tem ficha completa (`PRODUCT_DETAILS[product.id]` existe), um link "Ver ficha completa" leva para `/produto/:id`.

## WhatsApp (`src/lib/whatsapp.js`)

Número lido de `import.meta.env.VITE_WHATSAPP_PHONE`, com fallback hardcoded `5561994063917` caso a variável não esteja definida. `wa(texto)` monta a URL `wa.me` com a mensagem pré-codificada; usado no botão flutuante (FAB, inicializado em `main.jsx` a partir do elemento `#waFab`), na Navbar, no Footer e nos fallbacks de compra. `MinimalNavbar` é a única exceção — não tem botão de WhatsApp (ver seção própria acima).

`.env.local` e `.env.example` definem `VITE_WHATSAPP_PHONE` (prefixo correto para o Vite expor a variável via `import.meta.env`).

## Estilos

Sem framework de UI. Cada componente com necessidade de estilo próprio tem um `.module.css` (scoped via CSS Modules). Estilos globais ficam em `src/styles/`: tokens de design (`variables.css`), reset/utilitárias (`globals.css`), `@keyframes` (`animations.css`) e estilos de botão (`buttons.css`, importado explicitamente pelos componentes que usam `.btn`). Fontes via Google Fonts: Cormorant Garamond (serifada, títulos), Inter (texto) e JetBrains Mono.

## DevTweaks (apenas desenvolvimento)

`src/app/DevTweaks.jsx` é carregado via `React.lazy` somente quando `import.meta.env.DEV` é verdadeiro — o Vite elimina esse import do bundle de produção por dead-code elimination. Usa os componentes genéricos de `src/tweaks-panel.jsx` para expor, em runtime, um painel que ajusta variáveis CSS ao vivo: tom de acento (dourado/vinho/grafite), visibilidade do FAB do WhatsApp e da textura de grão de fundo.

## SEO / Analytics

`index.html` define meta tags completas (description, Open Graph, Twitter Card), `theme-color`, favicon e Google Analytics (GA4 via `gtag.js`, measurement ID `G-KKMV5VHR48`). `public/robots.txt` e `public/sitemap.xml` complementam o SEO básico. `public/404.html` guarda o pathname em `sessionStorage` e redireciona para `/`; `main.jsx` restaura esse pathname com `history.replaceState`, permitindo deep links funcionarem em uma SPA hospedada como site estático na Vercel. Meta tags são únicas e globais (não há gerenciamento de `<head>` por rota) — `/produto/:id` herda as mesmas meta tags da home; ver limitações em `docs/PRODUCT_EXPANSION.md`.

## Deploy

Hospedagem: Vercel (plano Hobby, exige repositório público). Deploy automático a cada push em `main`: Vercel roda `npm run build` e publica o conteúdo de `dist/`. Projeto Vercel vinculado localmente via `.vercel/project.json`.

## Variáveis de ambiente

Única variável de ambiente do projeto: `VITE_WHATSAPP_PHONE` (ver `.env.example`). Não há outras integrações externas (sem API própria, sem banco de dados, sem serviço de autenticação).
