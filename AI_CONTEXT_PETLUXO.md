# AI_CONTEXT.md — PetLuxo

> Este arquivo existe para que uma IA (Claude ou outra) possa entender o projeto completamente ao iniciar uma nova conversa, sem precisar de contexto anterior. Reflete o estado atual do código — não contém histórico de mudanças.

---

## 1. Visão Geral

**PetLuxo** é um site institucional de e-commerce de produtos premium para pets (cães e gatos). O público-alvo são tutores que valorizam sofisticação, design e qualidade nos produtos para seus animais. O objetivo do site é apresentar o catálogo, contar a história da marca e converter visitantes em compradores via PagBank (link de pagamento direto) ou WhatsApp.

O site **não tem carrinho de compras nem backend** — é 100% estático. Produtos com `buyLink` ou `buyLinks` abrem o link do PagBank. Produtos sem link de pagamento redirecionam para WhatsApp.

**Stack técnica:**

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18.3.1 | Interface declarativa com componentes e hooks |
| Vite | 6.4.2 | Bundler e dev server |
| react-router-dom | 7.x | Roteamento client-side (BrowserRouter + Routes) |
| CSS puro | — | Estilização completa sem framework de UI |
| Google Fonts | — | Cormorant Garamond + Inter + JetBrains Mono |
| Google Analytics | G-KKMV5VHR48 | Rastreamento via gtag.js no `index.html` |

**URLs importantes:**
- Produção: https://petluxostory.com.br
- Repositório: https://github.com/AnthonnyAlmeida/petluxo
- Deploy: Vercel (automático a cada `git push` na branch `main`)
- WhatsApp: 5561994063917 (configurado em `src/lib/whatsapp.js`)

> ⚠️ O repositório **deve permanecer público**. O Vercel Hobby Plan não faz deploy de repositórios privados.

---

## 2. Arquitetura e Estrutura

### Estrutura de pastas

```
petluxo/
├── index.html               # Shell HTML com todas as meta tags (OG, Twitter, GA)
├── vite.config.js           # Configuração mínima do Vite
├── package.json             # React 18 + Vite + react-router-dom
├── AI_CONTEXT_PETLUXO.md    # Este arquivo
├── public/                  # Copiados diretamente para dist/
│   ├── favicon.ico          # Logo convertida (48×48px)
│   ├── favicon.svg          # Placeholder SVG (mantido para compatibilidade, não referenciado)
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── 404.html             # Redirect SPA via sessionStorage
│   ├── og-image.png         # 1200×630px para redes sociais
│   └── images/
│       ├── brand/           # Vazia (apenas .gitkeep) — nenhum asset de marca atualmente
│       └── products/        # Fotos dos produtos (todas em WebP, todas no git)
├── assets/                  # Assets importados pelo Vite (logo, hero, sobre nós)
├── src/
│   ├── main.jsx             # Entry point — monta React no #app
│   ├── icons.jsx            # Ícones SVG inline (sem biblioteca)
│   ├── tweaks-panel.jsx     # Painel de ajustes (apenas dev)
│   ├── app/
│   │   ├── page.jsx         # Componente raiz App — renderiza todas as seções e as rotas
│   │   └── DevTweaks.jsx    # Carregado via React.lazy apenas em DEV
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx   # Navbar com menu hambúrguer mobile; links: Produtos, Sobre, FAQ (#faq), Contato
│   │   │   └── Footer.jsx   # 5 colunas: Logo + tagline, Produtos (Ver todos), Sobre (Sobre nós/Diferenciais/FAQ), Políticas (4 links internos), Contato (WhatsApp/e-mail); seção de redes sociais com Instagram @petluxostory e PagBank; rodapé com CNPJ
│   │   ├── product/
│   │   │   ├── ProductCard.jsx   # Card no carrossel: imagem, badge, nome, preço, CTA
│   │   │   ├── ProductGrid.jsx   # Carrossel com setas laterais e swipe touch
│   │   │   └── ProductModal.jsx  # Modal de detalhes com seletor de tamanho
│   │   ├── pages/
│   │   │   ├── PrivacyPage.jsx        # /politica-de-privacidade
│   │   │   ├── ReturnPolicyPage.jsx   # /politica-de-troca-e-devolucao
│   │   │   ├── ShippingPolicyPage.jsx # /politica-de-frete-e-entrega
│   │   │   └── TermsPage.jsx          # /termos-de-uso
│   │   ├── sections/
│   │   │   ├── Hero.jsx          # Seção hero com headline, métricas e stage com anéis + logo card
│   │   │   ├── Featured.jsx      # Produto destaque dinâmico — busca `PRODUCTS.find(p => p.featured === true && p.visible !== false)`; some da seção se nenhum produto elegível
│   │   │   ├── Products.jsx      # Múltiplos carrosséis por categoria + busca/filtro
│   │   │   ├── Story.jsx         # Seção Sobre Nós
│   │   │   ├── Differentials.jsx # Diferenciais da marca
│   │   │   ├── CTA.jsx           # Chamada para ação final
│   │   │   ├── FAQ.jsx           # Perguntas frequentes (grid 2 col, accordion), entre CTA e Footer
│   │   │   └── NotFound.jsx      # Página 404
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Container.jsx
│   │       ├── Section.jsx
│   │       └── TrustBadges.jsx  # Selos de confiança reutilizável (variant: banner | modal)
│   ├── data/
│   │   └── products.js      # FONTE DE VERDADE do catálogo — editar aqui
│   ├── hooks/
│   │   └── useScroll.js     # IntersectionObserver + parallax para animações
│   ├── lib/
│   │   └── whatsapp.js      # Gera links wa.me com mensagem pré-preenchida
│   └── styles/
│       ├── variables.css    # Design tokens: cores, fontes, espaçamentos, z-index
│       ├── animations.css   # @keyframes globais
│       └── globals.css      # Reset, utilitárias, tipografia base
└── docs/                    # Documentação do projeto
    ├── README.md
    ├── DECISIONS.md
    ├── DEPLOY.md
    ├── TODO.md
    └── CSS_MIGRATION.md      # Checklist e convenções da migração para CSS Modules
```

### Rotas disponíveis

O roteamento usa `react-router-dom` com `BrowserRouter` + `Routes`. O `public/404.html` grava o pathname no `sessionStorage` e redireciona para `/`; o `src/main.jsx` restaura o pathname antes de renderizar.

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `HomePage` (em `page.jsx`) | Site principal com todas as seções |
| `/politica-de-privacidade` | `PrivacyPage` | Política de Privacidade |
| `/politica-de-troca-e-devolucao` | `ReturnPolicyPage` | Política de Troca e Devolução |
| `/politica-de-frete-e-entrega` | `ShippingPolicyPage` | Política de Frete e Entrega |
| `/termos-de-uso` | `TermsPage` | Termos de Uso |
| `*` | `NotFound` (inline em `page.jsx`) | Página 404 com Navbar e Footer |

Ao adicionar novas páginas: criar em `src/components/pages/`, importar em `src/app/page.jsx` e adicionar `<Route>` dentro de `<Routes>`.

### Componentes principais

**`ProductCard.jsx`**
Card exibido no carrossel. Mostra: imagem, badge (se houver), `shortName` (ou `name`), preço original (se houver), preço, e CTA dinâmico:
- `"COMPRAR AGORA"` se o produto tem `buyLink` ou `buyLinks`
- `"VIA WHATSAPP"` se o produto não tem link de pagamento
- Imagem com `loading="lazy"`

**`ProductGrid.jsx`**
Carrossel com navegação por setas e swipe touch. Hook interno `usePerView` detecta breakpoints via `window.innerWidth`: 1 card (`< 640px`), 2 cards (`< 1024px`), 3 cards (`≥ 1024px`). Recebe props `products`, `title`, `resetKey`. Setas laterais via flexbox (não `position:absolute`, evita clipping em containers `overflow:hidden`).

**`ProductModal.jsx`**
Modal de detalhes aberto ao clicar em qualquer card. Exibe `shortName` (ou `name` se não houver), preço, seletor de tamanho (quando `buyLinks` existe), descrição e bullets. Footer do modal verifica o status do produto:
- Se `product.badge === 'ESGOTADO'` → botão desabilitado "ESGOTADO" (opacidade 50%, cursor not-allowed, sem link) + botão WhatsApp
- Caso contrário, tem 3 estados normais:
  1. Produto com `buyLinks` → botão "COMPRAR AGORA" (link do tamanho selecionado) + botão WhatsApp
  2. Produto com `buyLink` → botão "COMPRAR AGORA" + botão WhatsApp
  3. Produto sem link → apenas botão WhatsApp

Abaixo dos botões exibe `<TrustBadges variant="modal" />` (3 selos: Compra Segura, Troca em 7 dias, Entrega Rastreada).

**`Hero.jsx`**
Seção hero com headline animada, métricas (Qualidade, Entrega, Compra) e stage com logo card em destaque. A imagem hero (`image-hero.webp`) é importada como módulo ES e exibida no card central. Stage composto por 3 anéis decorativos concêntricos, floatCards laterais com labels. Após o fechamento da `<section>` renderiza `<TrustBadges variant="banner" />` — faixa com 4 selos de confiança. Mobile em grid 2×2.

**`Featured.jsx`**
Seção de produto em destaque, 100% dinâmica. Busca `PRODUCTS.find(p => p.featured === true && p.visible !== false)` — se nenhum produto elegível for encontrado, retorna `null` e a seção desaparece do site. Renderiza `product.name` (com `PetLuxo™` automaticamente destacado em itálico dourado via `renderName()`, se a substring existir no nome), `product.image`, `product.subtitle`, `product.description` e o link de compra (`product.buyLink` ou, na ausência, o primeiro item de `product.buyLinks`). Preço: se o produto tiver `prices` (múltiplos tamanhos), exibe o menor valor (comparação numérica via `parsePriceValue()`) com o rótulo "A PARTIR DE"; caso contrário exibe `product.price` direto, sem rótulo. Não exibe `product.bullets`. Apenas **um** produto deve ter `featured: true` por vez (campo ausente equivale a `false`); hoje é o id 8 (Bolsa Transporte PetLuxo).

**`TrustBadges.jsx`** (`src/components/ui/`)
Componente reutilizável de selos de confiança. Props:
- `variant="banner"` — faixa horizontal com fundo `--bege-soft`, 4 selos, separadores verticais, ícones SVG 18px dourados, texto 11px mono maiúsculo; mobile 2×2 grid.
- `variant="modal"` — linha discreta com 3 selos (sem Atendimento Humanizado), ícones 14px, texto 10px, separador ponto. Aparece abaixo dos botões de compra no `ProductModal`.

**`Products.jsx`**
Renderiza múltiplos `ProductGrid`, um por categoria. "Mais Vendidos" fica sempre visível. Demais categorias ficam ocultas atrás de botão "Ver mais produtos" que expande com animação `grid-template-rows: 0fr → 1fr`.

Todos os filtros de produtos por categoria nesse componente — carrossel "Mais Vendidos", carrosséis de categorias expandidas, lista de pills com produtos e grid de busca/filtro — excluem produtos com `visible: false` (`p.visible !== false`), além de respeitar `category.visible !== false` nas categorias. Produtos ocultos nunca aparecem em nenhum carrossel, pill ou resultado de busca.

**Busca e filtro por categoria:**
- Barra de busca com `Icon.Search`, input `var(--bege-soft)`, placeholder itálico, botão X para limpar
- Pills de categoria: "Todos" + uma pill por categoria visível com pelo menos um produto visível
- `isFiltering = query.trim() !== '' || activeCategory !== null`
- Quando `isFiltering`: substitui carrosséis por grid flat (3 col / 2 tablet / 1 mobile) com animação de entrada
- Quando sem resultados: mensagem em serif + link WhatsApp via `wa()`
- Busca filtra por `name`, `shortName`, `label` da categoria e `tags` do produto, excluindo sempre produtos com `visible: false`
- Campo combinado de busca: `[p.name, p.shortName, catLabel, ...(p.tags || [])].join(' ').toLowerCase()`
- Cada **palavra** do termo de busca deve aparecer no campo combinado (busca AND por palavras)
- Filtro de categoria e busca de texto funcionam em conjunto
- Quando não filtrando: layout original de carrosséis inalterado
- **⚠️ Detalhe crítico:** `Products.jsx` mantém um `useEffect` local que re-cria o `IntersectionObserver` para `.reveal:not(.in)` dentro da seção toda vez que `isFiltering`, `filteredProducts` ou `expanded` mudam. Isso é necessário porque o `useScrollEffects` global roda apenas uma vez no mount — elementos `.reveal` montados/remontados pelo React não seriam observados e permaneceriam invisíveis.

### Sistema de carrosséis por categoria

`CATEGORIES` em `products.js` define a ordem, os labels e a visibilidade das categorias. Cada entrada tem `{ id, label, visible }` — quando `visible: false`, a categoria é ocultada de carrosséis e pills sem precisar remover produtos. `Products.jsx` mapeia cada categoria visível, filtra `PRODUCTS.filter(p => p.category.includes(cat.id) && p.visible !== false)` e ordena os resultados por `categoryOrder[cat.id]` decrescente (maior valor = exibido primeiro). O resultado é passado para `ProductGrid`. O campo `category` de cada produto é um **array**, permitindo que um produto apareça em múltiplas categorias. O campo `tags` (array de strings) existe na maioria dos produtos e é usado como campo de busca adicional.

**Campo `visible` (por produto):**
Campo opcional, booleano, em cada item de `PRODUCTS`. Campo ausente equivale a `true` (o filtro sempre usa `!== false`). Quando `visible: false`, o produto é removido de todos os carrosséis, das pills de categoria, da busca/filtro e também não pode ser o produto em destaque de `Featured.jsx`. Útil para ocultar um produto temporariamente (ex: fora de estoque por tempo indeterminado) sem apagar seus dados do catálogo. Nenhum produto atualmente tem esse campo definido — todos os 32 produtos ficam visíveis por padrão.

**Campos de ordenação:**
- `categoryOrder` — objeto onde cada chave é um `category.id` e o valor é a posição do produto naquela categoria (múltiplos de 100, maior = primeiro). Usado por `Products.jsx` para todas as três lógicas de ordenação (carrossel mais-vendidos, carrosséis de categorias expandidas, grid de busca/filtro).
- `order` — número global mantido por compatibilidade. Não é mais usado pela lógica de exibição.

**Lógica de ordenação no modo busca/filtro:** como o filtro não tem categoria específica ativa, usa `Math.max(...Object.values(categoryOrder))` do produto como critério de ordenação decrescente.

### Como o modal com seletor de tamanho funciona

Produtos com múltiplos tamanhos têm dois campos extras:
- `prices: [{ size, price }]` — para exibir preço por tamanho
- `buyLinks: [{ size, link }]` — para o link de compra por tamanho

No modal (`ProductModal.jsx`), um `useState(selectedSize)` controla qual tamanho está ativo. O preço exibido e o link do botão "COMPRAR AGORA" são derivados do tamanho selecionado via `.find()`.

---

## 3. Catálogo Completo de Produtos

**32 produtos em 9 categorias.** IDs não são contíguos (alguns foram removidos). Próximo ID disponível: **38**.

| ID | Nome (shortName) | Preço | Categorias | buyLink | buyLinks | Badge | Imagem | categoryOrder |
|---|---|---|---|---|---|---|---|---|
| 1 | Brinquedo Interativo | R$ 149,90 | brinquedos | pag.ae/81K6Dbu-q | — | ESGOTADO | brinquedo_interativo.webp | brinquedos:100 |
| 3 | Garrafa Portátil Premium | R$ 189,90 | viagem-mobilidade | pag.ae/81J8xDn2N | — | null | garrafa.webp | viagem-mobilidade:100 |
| 4 | Comedouro Elevado | R$ 249,90 | a-mesa | pag.ae/81LGWC7X4 | — | null | comedouro_elevado.webp | a-mesa:700 |
| 6 | Refúgio Cozy | R$ 297,00 | mais-vendidos, conforto, sono-refugio | pag.ae/81J8cPYS6 | — | MAIS VENDIDOS | cozy.webp | mais-vendidos:1500, conforto:1500, sono-refugio:600 |
| 8 | Bolsa Transporte | R$ 797,00 | mais-vendidos, couro | pag.ae/81K3S7Am5 | — | MAIS VENDIDOS | bolsa_transporte.webp | mais-vendidos:1600, couro:1500 |
| 9 | Kit Milano | R$ 847,00 | couro | pag.ae/81K3Zv1ga | — | null | kit_milano.webp | couro:1400 |
| 10 | Porta Saquinhos | R$ 227,00 | couro | pag.ae/81K3Kjy9v | — | null | porta_saquinho.webp | couro:1200 |
| 12 | Sofá Essence | R$ 497,00 | conforto, sono-refugio | pag.ae/81J1KU12M | — | null | produtodestaquepetluxo.webp | conforto:1200, sono-refugio:900 |
| 13 | Sofá Lounge PetLuxo™ | R$ 469,00 | conforto, sono-refugio | pag.ae/81VR7uoS1 | — | null | sofa-ortopedico.webp | conforto:1300, sono-refugio:800 |
| 14 | Cama CloudNest™ | a partir de R$ 329,90 | sono-refugio | — | P/M/G (3 links) | null | cama_petluxo.webp | sono-refugio:100 |
| 15 | Coleira Atena™ | R$ 197,90 | couro | pag.ae/81LHbyHKp | — | null | coleira_petluxo.webp | couro:1300 |
| 16 | Comedouro Maison Élevé | a partir de R$ 289,90 | mais-vendidos, a-mesa | — | 800ml/1200ml/1800ml (3 links) | MAIS VENDIDOS | comedouro_maison.webp | mais-vendidos:1400, a-mesa:1200 |
| 17 | Bolsa Voyage Signature | R$ 429,00 | colecao-passeio | pag.ae/81LHebDYP | — | null | bolsa_voyage.webp | colecao-passeio:400 |
| 18 | Cama Suspensa Élysée | R$ 397,90 | conforto, sono-refugio | pag.ae/81MuixsTN | — | null | cama_suspensa_elysee.webp | conforto:1100, sono-refugio:1000 |
| 19 | Arranhador Sisal | R$ 197,90 | brinquedos | pag.ae/81MunByX6 | — | null | arranhador_bola.webp | brinquedos:200 |
| 20 | Cama Suspensa Aura | R$ 389,00 | mais-vendidos, conforto, sono-refugio | pag.ae/81MurBvHN | — | MAIS VENDIDOS | cama_suspensa_rattan.webp | mais-vendidos:1300, conforto:1400, sono-refugio:400 |
| 21 | Executive Bed™ | a partir de R$ 597,00 | couro, sono-refugio | — | M/G (2 links) | null | executive_bed.webp | couro:1100, sono-refugio:500 |
| 22 | Bowl Cerâmica Spoiled | R$ 167,00 | a-mesa | pag.ae/81NMeTc16 | — | null | bowl_ceramica.webp | a-mesa:1000 |
| 24 | Fonte Automática Elegance | R$ 547,00 | a-mesa | pag.ae/81NQzRaB6 | — | null | fonte_automatica.webp | a-mesa:1100 |
| 25 | Mesa Gourmet Nordic™ | R$ 397,00 | a-mesa | pag.ae/81P7aH2YR | — | null | mesa_nordic.webp | a-mesa:900 |
| 26 | Roma Walk Set | R$ 1.090,00 | colecao-passeio | pag.ae/81P8FJPxM | — | null | roma_walk.webp | colecao-passeio:300 |
| 27 | Ursinho Interativo Kong | R$ 229,00 | brinquedos | pag.ae/81Pa5nMYM | — | null | ursinho-interativo-premium-kong-brasil-edition.webp | brinquedos:300 |
| 28 | Cabana Teepee Luxo | a partir de R$ 1.190,00 | sono-refugio | — | Tam. P/M/G (3 links) | null | cabana_teepee.webp | sono-refugio:200 |
| 29 | Tapete Elegance | R$ 97,00 | a-mesa | pag.ae/81Q6FKrYN | — | null | tapete_elegance.webp | a-mesa:800 |
| 30 | Cesto Organizador Cozy | R$ 247,00 | colecao-cozy-luxo | pag.ae/81Qf8S5Ks | — | null | cesto_organizador.webp | colecao-cozy-luxo:600 |
| 31 | Estação de Passeio PetLuxo™ | R$ 497,00 | colecao-cozy-luxo | pag.ae/81QtMgE9m | — | null | estacao-de-passeio-petluxo-em-madeira-premium.webp | colecao-cozy-luxo:700 |
| 32 | Quadro Pet Personalizado | R$ 297,00 | colecao-cozy-luxo | pag.ae/81QuxvZm1 | — | null | quadro-pet-personalizado-minimalista-petluxo.webp | colecao-cozy-luxo:800 |
| 33 | Reservatório Hermético Cozy | R$ 297,00 | colecao-cozy-luxo | pag.ae/81QDtorTN | — | PREMIUM | reservatorio-hermetico-cozy-para-racao-pet.webp | colecao-cozy-luxo:500 |
| 34 | Bolsa Térmica Matelassê | R$ 349,00 | colecao-passeio | pag.ae/81QSpn4pr | — | NOVO | bolsa-termica-signature-matelasse.webp | colecao-passeio:500 |
| 35 | Manta Serenity™ | R$ 259,00 | sono-refugio | pag.ae/81QSF8Xw6 | — | null | manta-serenity-petluxo-premium.webp | sono-refugio:300 |
| 36 | Comedouro Nômade Premium | R$ 119,00 | viagem-mobilidade | pag.ae/81Rpy249r | — | PREMIUM | comedouro-nomade-premium-dobravel-e-portatil.webp | viagem-mobilidade:200 |
| 37 | Espreguiçadeira Madeira Dobrável | R$ 219,00 | viagem-mobilidade, sono-refugio | pag.ae/81SERKLKu | — | EXCLUSIVO | espreguicadeira-felina-portatil-e-arranhador-sisal.webp | viagem-mobilidade:300, sono-refugio:700 |

> Badges em uso no catálogo: `ESGOTADO`, `MAIS VENDIDOS`, `PREMIUM`, `NOVO`, `EXCLUSIVO`, ou `null`.
>
> Produto em destaque (campo `featured: true`, ver Seção 4): id 8 — Bolsa Transporte PetLuxo.
>
> Todos os 32 produtos têm `buyLink` ou `buyLinks` (nenhum depende exclusivamente do fallback "VIA WHATSAPP").
>
> Nenhum produto tem atualmente `visible: false` — todos ficam visíveis por padrão (ver campo `visible` na Seção 2).

**Detalhes dos buyLinks (produtos com seletor de tamanho):**

*id 14 — Cama CloudNest™:*
- Tam. P → R$ 329,90 → pag.ae/81LH8SGzp
- Tam. M → R$ 397,90 → pag.ae/81LHw9Qb8
- Tam. G → R$ 459,90 → pag.ae/81LHxFzTK

*id 16 — Comedouro Maison Élevé:*
- 800ml → R$ 289,90 → pag.ae/81LGZCXsP
- 1200ml → R$ 329,90 → pag.ae/81LHgsgcP
- 1800ml → R$ 389,90 → pag.ae/81LHi4Ret

*id 21 — Cama Executive Bed™:*
- Tam. M → R$ 597,00 → pag.ae/81M-Zz4cL
- Tam. G → R$ 697,00 → pag.ae/81M-QYczq

*id 28 — Cabana Teepee Luxo Personalizada:*
- Tam. P (até 5kg) → R$ 1.190,00 → pag.ae/81Phf6B9r
- Tam. M (até 12kg) → R$ 1.390,00 → pag.ae/81Phkp8ba
- Tam. G (até 20kg) → R$ 1.590,00 → pag.ae/81Phm65YM

**Categorias disponíveis (conforme `CATEGORIES` em `products.js`):**

| ID | Label exibido no site | visible | Produtos | Ordem no site |
|---|---|---|---|---|
| `mais-vendidos` | Mais Vendidos | true | 4 | 1º (sempre visível) |
| `couro` | Essenciais em Couro | true | 5 | 2º |
| `conforto` | Conforto & Estilo | true | 5 | 3º |
| `a-mesa` | À Mesa | true | 6 | 4º |
| `colecao-cozy-luxo` | Coleção Cozy Luxo | true | 4 | 5º |
| `brinquedos` | Brinquedos & Estilo | true | 3 | 6º |
| `colecao-passeio` | Coleção Passeio | true | 3 | 7º |
| `sono-refugio` | Sono & Refúgio | true | 10 | 8º |
| `viagem-mobilidade` | Viagem & Mobilidade | true | 3 | 9º |

> Para ocultar uma categoria do site sem remover produtos, setar `visible: false` em `CATEGORIES`. O filtro usa `!== false` — categorias sem o campo também ficam visíveis. Para ocultar um produto individual independentemente da categoria, setar `visible: false` no próprio produto em `PRODUCTS`.
>
> Muitos produtos pertencem a `sono-refugio` além da categoria principal (ex: `conforto`) — é a categoria com mais produtos do catálogo.

**Ordem de exibição por categoria** (categoryOrder decrescente = primeiro → último):
- mais-vendidos: id8 → id6 → id16 → id20
- couro: id8 → id9 → id15 → id10 → id21
- conforto: id6 → id20 → id13 → id12 → id18
- a-mesa: id16 → id24 → id22 → id25 → id29 → id4
- colecao-passeio: id34 → id17 → id26
- sono-refugio: id18 → id12 → id13 → id37 → id6 → id21 → id20 → id35 → id28 → id14
- brinquedos: id27 → id19 → id1
- colecao-cozy-luxo: id32 → id31 → id30 → id33
- viagem-mobilidade: id37 → id36 → id3

---

## 4. Padrões e Convenções

### Campos obrigatórios ao adicionar produto

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number | Próximo disponível é **38** |
| `name` | string | Nome completo (usável para SEO e fallback) |
| `shortName` | string | Nome curto (exibido no carrossel e no modal) — obrigatório |
| `subtitle` | string | Frase curta de impacto (exibida no modal) |
| `description` | string | Texto completo para o modal |
| `bullets` | string[] | Array de diferenciais/características |
| `price` | string | `"R$ X,XX"` ou `"a partir de R$ X,XX"` |
| `badge` | string \| null | `"MAIS VENDIDOS"` ou `null` |
| `image` | string | `"/images/products/nome.webp"` |
| `category` | string[] | Ex: `["mais-vendidos", "conforto"]` |
| `buyLink` | string \| omitido | URL PagBank para produto único |

**Para produtos com múltiplos tamanhos**, adicionar também:
- `prices: [{ size, price }]` — array de tamanhos e preços
- `buyLinks: [{ size, link }]` — array de tamanhos e links PagBank
- Nesse caso, omitir `buyLink` (usar apenas `buyLinks`)

**Campos opcionais:**
- `featured: boolean` — ver Seção 2 (produto em destaque)
- `visible: boolean` — ver Seção 2 (oculta o produto de carrosséis, pills e busca; ausente equivale a `true`)
- `tags: string[]` — campo de busca adicional
- `supplierLink: string` — link interno/administrativo do fornecedor, não exibido no site

### Campo `featured` (produto em destaque)

Campo opcional, booleano. `featured: true` marca o produto exibido na seção `Featured.jsx` (ver Seção 2, componentes principais). Campo ausente equivale a `false`. Apenas **um** produto deve ter `featured: true` por vez — se mais de um tiver, `.find()` usa o primeiro encontrado no array; se nenhum tiver (ou o único marcado estiver com `visible: false`), a seção desaparece do site. Atualmente: id 8 (Bolsa Transporte PetLuxo).

### Imagens do projeto

Todas as imagens do projeto estão em formato WebP.

**Formatos e localização:**
- `assets/hero/image-hero.webp` — imagem hero principal, importada como módulo ES em `Hero.jsx`
- `assets/logo.webp` — logo da marca, referenciado via `background-image` em `Navbar.module.css`
- `assets/sobre_nos/sobre_nos.webp` — foto da seção Sobre Nós, importada como módulo ES em `Story.jsx`
- `assets/sobre_nos/foto_sobre_nos.webp` — asset de reserva no mesmo diretório; não referenciado em nenhum componente atualmente
- `public/images/products/*.webp` — uma imagem por produto ativo, mais um arquivo órfão não referenciado em nenhum componente (`arranhador-felino-sisal-ajustavel-4-niveis-portatil.webp`)
- `public/og-image.png` — compartilhada em redes sociais (formato PNG; meta tag social, não convertida)
- `public/images/brand/` — reservado para assets de marca (vazio, apenas `.gitkeep`)

**Referências no código:**
- Hero.jsx: `import heroImg from '../../../assets/hero/image-hero.webp'`
- Navbar.module.css: `background-image: url("../../../assets/logo.webp")`
- Story.jsx: `import sobreImg from '../../../assets/sobre_nos/sobre_nos.webp'`
- ProductCard.jsx e ProductModal.jsx: carregam via `src/data/products.js` (campo `image` com caminho `/images/products/*.webp`)
- Featured.jsx: carrega `product.image` dinamicamente, do produto elegível com `featured: true`

### Padrão de commits

```
feat: descrição de nova funcionalidade
fix: correção de bug
config: ajustes de configuração
docs: atualização de documentação
update: atualização de conteúdo/dados
```

### Repositório obrigatoriamente público

O Vercel Hobby Plan não faz deploy de repositórios privados. O repositório `github.com/AnthonnyAlmeida/petluxo` **deve permanecer público** para o deploy automático funcionar.

---

## 5. Integrações

### PagBank
- Produtos com compra única: campo `buyLink: "https://pag.ae/..."` (string)
- Produtos com múltiplos tamanhos: campo `buyLinks: [{ size, link }]` (array)
- O botão "COMPRAR AGORA" abre o link em `_blank`

### WhatsApp
- Número: `5561994063917` (configurado em `src/lib/whatsapp.js`)
- Fallback via variável de ambiente `VITE_WHATSAPP_PHONE` (não configurada na Vercel, usa o padrão)
- Função utilitária: `wa(texto)` gera `https://wa.me/5561994063917?text=...` com encode

### Google Analytics
- ID: `G-KKMV5VHR48`
- Configurado no `index.html` via script gtag.js
- Rastreia pageviews automaticamente

### Vercel
- Plano: Hobby (gratuito)
- Deploy automático a cada push na branch `main`
- Build command: `npm run build` → output: `dist/`
- Domínio customizado: `petluxostory.com.br` (configurado via Vercel DNS)

### Domínio
- Registrado no Registro.br
- DNS configurado com `ns1.vercel-dns.com` e `ns2.vercel-dns.com`
- HTTPS automático via Let's Encrypt (gerenciado pela Vercel)
- Configurado em: `og:url`, `og:image`, `twitter:image`, `robots.txt`, `sitemap.xml`

---

## 6. Convenções CSS

### Arquitetura
- `globals.css` — reset, utilitárias, tipografia, layout, sistema `.reveal`. Não contém `@keyframes` nem z-index hardcoded.
- `animations.css` — apenas `@keyframes`, nomeados por componente de origem. ⚠️ Keyframes aqui não são resolvidos dentro de `.module.css` (CSS Modules no Vite processa keyframes como identificadores locais) — declarar keyframes localmente em cada módulo que precisar.
- `variables.css` — design tokens: cores, fontes, espaçamentos, z-index (`--z-base`, `--z-navbar`, `--z-modal`, `--z-overlay`, `--z-above-modal`)
- `buttons.css` — global controlado para `.btn` e variantes (`.btn-primary`, `.btn-ghost`, `.btn-outline`, `.btn-full`, `.btn-gold`, `.wa-icon`). Importado explicitamente pelos componentes que usam botões: Featured, CTA, ProductModal, Hero, NotFound, Navbar, Products, Button.
- `[Componente].module.css` — estilos scoped por componente; todos os componentes da árvore já usam CSS Modules (migração 100% concluída — ver [docs/CSS_MIGRATION.md](docs/CSS_MIGRATION.md))

### Nomenclatura (CSS Modules)
- Base: camelCase — `heroGrid`, `modalCard`, `footerBrand`
- Estado: `navScrolled`, `faqItemOpen`, `sizeBtnActive`
- Variante: `btnPrimary`, `btnGhost`, `btnGold`
- Proibido: `.open`, `.active`, `.title`, `.label`, `.val` soltos
- Proibido: compartilhar nomes entre módulos

### Regras de módulo
- Máximo 2 níveis de descendência
- Media queries sempre no final: base → tablet (768px) → mobile (480px)
- Nunca depender de ordem de classes no JSX

### `:global()`
Permitido apenas para: `.reveal`, utilitárias globais (`.serif`, `.italic`, `.gold`, `.wrap`, `.section-tag`), third-party.
Proibido para qualquer coisa que deveria ser scoped.

### Mistura de classes no JSX
✅ `className={[styles.hero, 'reveal'].filter(Boolean).join(' ')}`
❌ `className={\`${styles.hero} reveal\`}`

### Z-Index
Sempre via variáveis — nunca hardcoded:
`--z-navbar: 100 | --z-modal: 1000 | --z-overlay: 900 | --z-above-modal: 1100`

### Regra anti-gambiarra
Nunca corrigir bugs visuais com `margin-top: -13px`, `calc(100% + 2px)` ou `overflow-x: hidden` sem causa raiz clara.

---

## 7. Decisões Técnicas Importantes

### Modal mobile: scroll interno sem tocar no body
`min-height: 0` + `overflow-y: auto` + `overscroll-behavior: contain` na div `.modal-scroll`. Cabeçalho (nome/preço) e footer (botões) ficam fixos; apenas descrição e bullets rolam. **Nunca manipular `document.body.style.overflow`** — causava bugs no iOS.

### Carrossel sem biblioteca externa
React state + CSS `transform: translateX`. Evita dependências externas, mantém bundle pequeno. Setas laterais usam flexbox (não `position: absolute`) para não serem cortadas pelo `overflow: hidden` do container de expansão de categorias.

### Repositório público obrigatório
Vercel Hobby Plan bloqueia deploys de repos privados. Tornar o repo privado quebra o deploy automaticamente.

### Produto com múltiplos tamanhos: seletor no modal
`useState(selectedSize)` inicializado no primeiro tamanho via `useEffect`. Preço e link do botão COMPRAR AGORA são derivados do tamanho selecionado via `.find()`. Sem seletor de tamanho, o botão fica desabilitado até a seleção.

### CTA dinâmico no card (ProductCard)
O texto abaixo do preço muda conforme a presença de link de pagamento:
- `product.buyLink || product.buyLinks` → `"COMPRAR AGORA"`
- Nenhum dos dois → `"VIA WHATSAPP"`

### Campo `category` é array
Permite que um produto apareça em múltiplas categorias (ex: `["mais-vendidos", "conforto"]`). Os filtros usam `.includes(id)`.

### Campo `visible` por produto vs. por categoria
São dois mecanismos independentes de ocultação: `CATEGORIES[].visible` oculta a categoria inteira (carrossel some, pill some); `PRODUCTS[].visible` oculta um produto específico de tudo (carrosséis, pills com contagem, busca/filtro, seção `Featured`) sem precisar removê-lo do catálogo. Ambos usam a convenção `!== false` — campo ausente é tratado como visível.

### DevTweaks excluído do bundle de produção
`import.meta.env.DEV` é uma constante `false` no build — o Vite elimina o bloco via dead-code elimination. O painel de ajustes nunca vai para produção.

### Products — expansão de categorias (Products.module.css)
O `.productsExpandInner` usa `overflow: hidden` + `padding: 0 16px`. Esses dois valores são interdependentes e **não devem ser alterados de forma isolada**:
- **`overflow: hidden`** — necessário para o truque `grid-template-rows: 0fr → 1fr`. Sem ele, o item de grid usa seu `min-height` intrínseco e o colapso para 0 não funciona, quebrando o botão "Ver menos".
- **`padding: 0 16px`** — compensa o `margin: 0 -12px` do `.carouselOuter` (que estende as setas 12px além do content box). Com 16px de padding, as setas ficam dentro da *padding box* (16px - 12px = 4px de folga), visíveis, sem serem cortadas pelo `overflow: hidden`.

Se o padding for removido, as setas laterais dos carrosséis nas categorias expandidas serão cortadas. Se o `overflow: hidden` for trocado por `overflow-x: visible`, o botão "Ver menos" para de fechar.

### CTA — ponto de interrogação em itálico (CTA.module.css)
O `?` em "começar a comprar?" usa `<i className="italic gold-text">` — Cormorant Garamond itálico com `background-clip: text`. Dois mecanismos podem cortá-lo:
1. **Overflow da section** — `.cta { overflow: hidden }` (necessário para os anéis decorativos de até 1000px) corta glifos que alcançam a borda. Resolvido com `padding-right: 0.3em` em `.cta h2`.
2. **Gradient coverage** — `background-clip: text` pinta o gradiente apenas dentro do bounding box do `<i>`, que termina no *advance width* do glifo. O overhang óptico do `?` itálico fica fora desse box → transparente → aparece cortado. Resolvido com `padding-right: 0.2em` em `.cta h2 i`.

**Não remover** `overflow: hidden` do `.cta` — os anéis ornamentais `.ctaOrn .ring` (até r3 com 1000px) causariam scroll horizontal sem ele.

---

## 8. Workflow de Trabalho

- **Claude.ai** (`claude.ai`): arquitetura, decisões, construção de prompts, revisão de resultados
- **Claude Code** (terminal VSCode): execução dos prompts no código
- **Modelo Haiku**: tarefas simples — buscas, leitura, alterações de texto/dados, commits
- **Modelo Sonnet**: tarefas complexas — lógica, múltiplos arquivos, bugs difíceis, refatorações

**Fluxo padrão:**
1. Claude.ai monta o prompt detalhado
2. Usuário cola no Claude Code (Haiku ou Sonnet)
3. Claude Code implementa
4. `npm run build` para confirmar
5. `git add -A && git commit -m "..." && git push`
6. Resultado volta para Claude.ai revisar se necessário

---

## 9. Pendências Conhecidas

### Sitemap
`public/sitemap.xml` é manual. Quando o site crescer com mais rotas, considerar geração automática.

### og:image
Ao atualizar `public/og-image.png`, lembrar de limpar o cache dos scrapers de redes sociais para forçar re-scrape:
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/

### Arquivo de imagem órfão
`public/images/products/arranhador-felino-sisal-ajustavel-4-niveis-portatil.webp` não é referenciado por nenhum produto em `products.js`. Avaliar remoção ou associação a um produto futuro.
