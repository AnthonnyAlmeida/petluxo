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
│       └── products/            # Fotos dos produtos (.webp)
├── src/
│   ├── main.jsx                 # Entry point: monta <App/>, inicializa link do FAB do WhatsApp, restaura path do 404.html
│   ├── app/
│   │   ├── page.jsx             # Componente raiz — define as <Routes> e monta a home (todas as seções)
│   │   └── DevTweaks.jsx        # Painel de ajustes visuais, carregado só em dev (ver seção própria abaixo)
│   ├── components/
│   │   ├── layout/              # Navbar (com drawer mobile) e Footer
│   │   ├── product/              # ProductCard, ProductGrid (carrossel), ProductModal (quick view)
│   │   ├── sections/              # Hero, Featured, Products, Story, Differentials, CTA, FAQ, NotFound
│   │   ├── pages/                # PrivacyPage, ReturnPolicyPage, ShippingPolicyPage, TermsPage (rotas de política)
│   │   └── ui/                  # Button, Container, Section, TrustBadges
│   ├── data/
│   │   └── products.js          # Fonte de verdade do catálogo (CATEGORIES + PRODUCTS)
│   ├── hooks/
│   │   └── useScroll.js         # useScrollEffects: scroll-reveal via IntersectionObserver + paralaxe do logo na Hero
│   ├── lib/
│   │   └── whatsapp.js          # Geração de links wa.me
│   ├── icons.jsx                 # Conjunto de ícones SVG inline usados nos componentes
│   ├── tweaks-panel.jsx          # Componentes genéricos do painel de dev (TweaksPanel, TweakSection, TweakRadio, TweakToggle, useTweaks)
│   └── styles/
│       ├── variables.css        # Design tokens (cores, tipografia, espaçamentos)
│       ├── globals.css          # Reset + utilitárias globais
│       ├── animations.css       # @keyframes globais
│       └── buttons.css          # Estilos de `.btn` e variantes, importado por quem usa botões
└── docs/                        # CSS_MIGRATION.md, DECISIONS.md, DEPLOY.md, README.md, TODO.md
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
| `image` | string | Caminho em `/public/images/products/` |
| `badge` | string \| null | Selo exibido no card (ex.: `"MAIS VENDIDOS"`, `"NOVO"`, `"PREMIUM"`, `"EXCLUSIVO"`, ou `"ESGOTADO"` — este último desabilita a compra e mostra apenas o link de WhatsApp) |
| `buyLink` | string (opcional) | Link único de pagamento PagBank |
| `buyLinks` | `{size, link}[]` (opcional) | Alternativa a `buyLink` quando o produto tem variações — o modal exibe seletor de tamanho |
| `tags` | string[] | Usado na busca textual |
| `supplierLink` | string (opcional) | Link/nota interna do fornecedor (não é exibido na UI) |
| `visible` | boolean (opcional) | Quando `false`, o produto some do site (grids, carrosséis, busca) mesmo com dados completos |
| `featured` | boolean (opcional) | Quando `true`, marca o produto exibido na seção `Featured` ("Produto em Destaque"). Deve haver no máximo um produto com `featured: true` visível por vez — a seção usa o primeiro encontrado |

Não há build step, CMS ou banco por trás deste arquivo — edições são feitas diretamente no código-fonte (inclusive por um painel administrativo externo ao repositório, que também commita direto neste arquivo).

## Seções da home (`src/app/page.jsx`)

Ordem: `Navbar` → `Hero` → `Featured` → `Products` → `Story` → `Differentials` → `CTA` → `FAQ` → `Footer`, mais `ProductModal` (quick view global) e, em desenvolvimento, `DevTweaks`.

Rotas adicionais (fora da home): `/politica-de-privacidade`, `/politica-de-troca-e-devolucao`, `/politica-de-frete-e-entrega`, `/termos-de-uso`, e um catch-all `*` que renderiza `NotFound` dentro do layout padrão (Navbar + Footer).

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
Modal com imagem, descrição, bullets e botão de ação. Regras de exibição do botão principal:
1. `badge === 'ESGOTADO'` → botão de compra desabilitado + link "CONSULTAR VIA WHATSAPP"
2. Produto com `buyLinks` → seletor de tamanho + botão "COMPRAR AGORA" apontando para o link do tamanho selecionado
3. Produto com `buyLink` único → botão "COMPRAR AGORA" direto
4. Nenhum link de compra → botão único "CONSULTAR VIA WHATSAPP"

Em todos os casos com link de compra, também é oferecido um link secundário para WhatsApp.

## WhatsApp (`src/lib/whatsapp.js`)

Número lido de `import.meta.env.VITE_WHATSAPP_PHONE`, com fallback hardcoded `5561994063917` caso a variável não esteja definida. `wa(texto)` monta a URL `wa.me` com a mensagem pré-codificada; usado no botão flutuante (FAB, inicializado em `main.jsx` a partir do elemento `#waFab`), na Navbar, no Footer e nos fallbacks de compra.

`.env.local` e `.env.example` definem `VITE_WHATSAPP_PHONE` (prefixo correto para o Vite expor a variável via `import.meta.env`).

## Estilos

Sem framework de UI. Cada componente com necessidade de estilo próprio tem um `.module.css` (scoped via CSS Modules). Estilos globais ficam em `src/styles/`: tokens de design (`variables.css`), reset/utilitárias (`globals.css`), `@keyframes` (`animations.css`) e estilos de botão (`buttons.css`, importado explicitamente pelos componentes que usam `.btn`). Fontes via Google Fonts: Cormorant Garamond (serifada, títulos), Inter (texto) e JetBrains Mono.

## DevTweaks (apenas desenvolvimento)

`src/app/DevTweaks.jsx` é carregado via `React.lazy` somente quando `import.meta.env.DEV` é verdadeiro — o Vite elimina esse import do bundle de produção por dead-code elimination. Usa os componentes genéricos de `src/tweaks-panel.jsx` para expor, em runtime, um painel que ajusta variáveis CSS ao vivo: tom de acento (dourado/vinho/grafite), visibilidade do FAB do WhatsApp e da textura de grão de fundo.

## SEO / Analytics

`index.html` define meta tags completas (description, Open Graph, Twitter Card), `theme-color`, favicon e Google Analytics (GA4 via `gtag.js`, measurement ID `G-KKMV5VHR48`). `public/robots.txt` e `public/sitemap.xml` complementam o SEO básico. `public/404.html` guarda o pathname em `sessionStorage` e redireciona para `/`; `main.jsx` restaura esse pathname com `history.replaceState`, permitindo deep links funcionarem em uma SPA hospedada como site estático na Vercel.

## Deploy

Hospedagem: Vercel (plano Hobby, exige repositório público). Deploy automático a cada push em `main`: Vercel roda `npm run build` e publica o conteúdo de `dist/`. Projeto Vercel vinculado localmente via `.vercel/project.json`.

## Variáveis de ambiente

Única variável de ambiente do projeto: `VITE_WHATSAPP_PHONE` (ver `.env.example`). Não há outras integrações externas (sem API própria, sem banco de dados, sem serviço de autenticação).
