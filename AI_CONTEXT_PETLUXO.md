# AI_CONTEXT.md — PetLuxo

> Este arquivo existe para que uma IA (Claude ou outra) possa entender o projeto completamente ao iniciar uma nova conversa, sem precisar de contexto anterior.

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
├── AI_CONTEXT.md            # Este arquivo
├── public/                  # Copiados diretamente para dist/
│   ├── favicon.ico          # Logo convertida (48×48px, gerada em 20/05/2026)
│   ├── favicon.svg          # Placeholder SVG (mantido para compatibilidade)
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── 404.html             # Redirect SPA via sessionStorage
│   ├── og-image.png         # 1200×630px para redes sociais
│   └── images/
│       ├── brand/           # Logo e assets de marca
│       └── products/        # Fotos dos produtos (todas no git)
├── assets/                  # Assets importados pelo Vite (logo, hero)
├── src/
│   ├── main.jsx             # Entry point — monta React no #app
│   ├── icons.jsx            # Ícones SVG inline (sem biblioteca)
│   ├── tweaks-panel.jsx     # Painel de ajustes (apenas dev)
│   ├── app/
│   │   ├── page.jsx         # Componente raiz App — renderiza todas as seções
│   │   └── DevTweaks.jsx    # Carregado via React.lazy apenas em DEV
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx   # Navbar com menu hambúrguer mobile; links: Produtos, Sobre, FAQ (#faq), Contato
│   │   │   └── Footer.jsx   # 5 colunas: Logo + tagline \"Sofisticação e conforto...\", Produtos (Ver todos), Sobre (Sobre nós/Diferenciais/FAQ), Políticas (4 links internos), Contato (WhatsApp/e-mail); seção de redes sociais com Instagram @petluxostory (ícone vinho, esquerda) e PagBank (direita, ícone cadeado); rodapé com CNPJ
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
│   │   │   ├── Hero.jsx          # Seção hero com headline, métricas e stage com anéis + logo card (sem textos sobrepostos)
│   │   │   ├── Featured.jsx      # Produto destaque (id 13)
│   │   │   ├── Products.jsx      # Múltiplos carrosséis por categoria
│   │   │   ├── Story.jsx         # Seção Sobre Nós — 5 parágrafos: manifesto (mono, dourado), h2, lead, 2 blocos descritivos, assinatura itálica
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
│       ├── variables.css    # Design tokens: cores, fontes, espaçamentos, z-index (--z-base/--z-navbar/--z-modal/--z-overlay/--z-above-modal)
│       ├── animations.css   # @keyframes globais (extraídos do globals.css): heroRise, heroFade, heroFloaty, stageRotate, scrollCueLine
│       └── globals.css      # Todos os estilos (~1690 linhas), sem framework; não contém @keyframes; z-index todos tokenizados; classes órfãs removidas
└── docs/                    # Documentação do projeto
    ├── README.md
    ├── DECISIONS.md
    ├── DEPLOY.md
    ├── TODO.md
    └── CSS_MIGRATION.md      # Checklist e convenções da migração para CSS Modules
```

> **Imagens:** todas incluídas no git, incluindo `assets/hero/image-hero.webp` (arquivo hero convertido de PNG para WebP quality 85 em 18/05/2026, reduzindo de 2.1MB para 158KB). Removido do .gitignore em 18/05/2026 para permitir deploy no Vercel.

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
- **Otimização:** imagem com `loading="lazy"` para lazy loading (reduz tempo de carregamento inicial)

**`ProductGrid.jsx`**
Carrossel com navegação por setas e swipe touch. Hook interno `usePerView` detecta breakpoints: 3 cards (desktop ≥980px), 2 (tablet ≤980px), 1 (mobile ≤768px). Recebe props `products`, `title`, `resetKey`. Setas laterais via flexbox (não position:absolute, evita clipping em containers overflow:hidden).

**`ProductModal.jsx`**
Modal de detalhes aberto ao clicar em qualquer card. Exibe `shortName` (ou `name` se não houver), preço, seletor de tamanho (quando `buyLinks` existe), descrição e bullets. Footer do modal verifica o status do produto:
- Se `product.badge === 'ESGOTADO'` → botão desabilitado "ESGOTADO" (opacidade 50%, cursor not-allowed, sem link) + botão WhatsApp
- Caso contrário, tem 3 estados normais:
  1. Produto com `buyLinks` → botão "COMPRAR AGORA" (link do tamanho selecionado) + botão WhatsApp
  2. Produto com `buyLink` → botão "COMPRAR AGORA" + botão WhatsApp
  3. Produto sem link → apenas botão WhatsApp

Abaixo dos botões exibe `<TrustBadges variant="modal" />` (3 selos: Compra Segura, Troca em 7 dias, Entrega Rastreada).

**`Hero.jsx`**
Seção hero com headline animada, métricas (Qualidade, Entrega, Compra) e stage com logo card em destaque. A imagem hero (`image-hero.webp`, quality 85) é importada como módulo ES e exibida no card central (sem textos sobrepostos). Stage composto por 3 anéis decorativos concêntricos, floatCards laterais com labels. Após o fechamento da `<section>` renderiza `<TrustBadges variant="banner" />` — faixa com 4 selos de confiança (Compra Segura, Troca em 7 dias, Entrega Rastreada, Atendimento Humanizado). Mobile em grid 2×2.

**`TrustBadges.jsx`** (`src/components/ui/`)
Componente reutilizável de selos de confiança. Props:
- `variant="banner"` — faixa horizontal com fundo `--bege-soft`, 4 selos, separadores verticais, ícones SVG 18px dourados, texto 11px mono maiúsculo; mobile 2×2 grid.
- `variant="modal"` — linha discreta com 3 selos (sem Atendimento Humanizado), ícones 14px, texto 10px, separador ponto. Aparece abaixo dos botões de compra no `ProductModal`.

**`Products.jsx`**
Renderiza múltiplos `ProductGrid`, um por categoria. "Mais Vendidos" fica sempre visível. Demais categorias ficam ocultas atrás de botão "Ver mais produtos" que expande com animação `grid-template-rows: 0fr → 1fr`.

**Busca e filtro por categoria:**
- Barra de busca com `Icon.Search`, input `var(--bege-soft)`, placeholder itálico, botão X para limpar
- Pills de categoria: "Todos" + uma pill por categoria com produtos; pill ativa tem fundo `var(--vinho)`
- `isFiltering = query.trim() !== '' || activeCategory !== null`
- Quando `isFiltering`: substitui carrosséis por grid flat (3 col / 2 tablet / 1 mobile) com animação de entrada
- Quando sem resultados: mensagem em serif + link WhatsApp via `wa()`
- Busca filtra por `name`, `shortName`, `label` da categoria e `tags` do produto
- Campo combinado de busca: `[p.name, p.shortName, catLabel, ...(p.tags || [])].join(' ').toLowerCase()`
- Cada **palavra** do termo de busca deve aparecer no campo combinado (busca AND por palavras)
- Filtro de categoria e busca de texto funcionam em conjunto
- Quando não filtrando: layout original de carrosséis inalterado
- **⚠️ Detalhe crítico:** `Products.jsx` mantém um `useEffect` local que re-cria o `IntersectionObserver` para `.reveal:not(.in)` dentro da seção toda vez que `isFiltering`, `filteredProducts` ou `expanded` mudam. Isso é necessário porque o `useScrollEffects` global roda apenas uma vez no mount — elementos `.reveal` montados/remontados pelo React não seriam observados e permaneceriam invisíveis.

### Sistema de carrosséis por categoria

`CATEGORIES` em `products.js` define a ordem e os labels das categorias. `Products.jsx` mapeia cada categoria, filtra `PRODUCTS.filter(p => p.category.includes(cat.id))` e ordena os resultados: produtos com campo `order` definido aparecem primeiro (ordem crescente), os demais mantêm a ordem original do array. O resultado é passado para `ProductGrid`. O campo `category` de cada produto é um **array**, permitindo que um produto apareça em múltiplas categorias. O campo `tags` (array de strings) existe na maioria dos produtos e é usado como campo de busca adicional.

### Como o modal com seletor de tamanho funciona

Produtos com múltiplos tamanhos têm dois campos extras:
- `prices: [{ size, price }]` — para exibir preço por tamanho
- `buyLinks: [{ size, link }]` — para o link de compra por tamanho

No modal (`ProductModal.jsx`), um `useState(selectedSize)` controla qual tamanho está ativo. O preço exibido e o link do botão "COMPRAR AGORA" são derivados do tamanho selecionado via `.find()`.

---

## 3. Catálogo Completo de Produtos

**26 produtos em 9 categorias.** IDs não são contíguos (alguns foram removidos). Próximo ID disponível: **29**.

> ⚠️ **Status das categorias:** 9 categorias definidas em ordem. Todas com produtos ativos.

| ID | Nome (shortName) | Preço | Categorias | buyLink | buyLinks | Badge | Imagem | order |
|---|---|---|---|---|---|---|---|---|
| 1 | Brinquedo Interativo de Pelúcia | R$ 149,90 | brinquedos | pag.ae/81K6Dbu-q | — | ESGOTADO | brinquedo_interativo.webp | — |
| 3 | Garrafa Portátil Premium para Pets | R$ 189,90 | viagem-mobilidade | pag.ae/81J8xDn2N | — | null | garrafa.webp | — |
| 4 | Comedouro Elevado Premium | R$ 249,90 | a-mesa | pag.ae/81LGWC7X4 | — | null | comedouro_elevado.webp | 4 |
| 6 | Refúgio PetLuxo Cozy | R$ 297,00 | mais-vendidos, conforto | pag.ae/81J8cPYS6 | — | MAIS VENDIDOS | cozy.webp | — |
| 8 | Bolsa Transporte PetLuxo | R$ 797,00 | mais-vendidos, couro | pag.ae/81K3S7Am5 | — | MAIS VENDIDOS | bolsa_transporte.webp | — |
| 9 | Kit Milano Camelo | R$ 847,00 | couro | pag.ae/81K3Zv1ga | — | null | kit_milano.webp | — |
| 10 | Porta Saquinhos em Couro | R$ 227,00 | couro | pag.ae/81K3Kjy9v | — | null | porta_saquinho.webp | — |
| 12 | Sofá PetLuxo Essence | R$ 497,00 | conforto | pag.ae/81J1KU12M | — | null | produtodestaquepetluxo.webp | — |
| 13 | Sofá Lounge PetLuxo™ | R$ 349,90 | conforto | pag.ae/81LH1xxX4 | — | null | sofa-ortopedico.webp | — |
| 14 | Cama CloudNest™ | a partir de R$ 329,90 | sono-refugio | — | P/M/G (3 links) | null | cama_petluxo.webp | — |
| 15 | Coleira Atena™ | R$ 197,90 | couro | pag.ae/81LHbyHKp | — | null | coleira_petluxo.webp | — |
| 16 | Comedouro Maison Élevé | a partir de R$ 289,90 | mais-vendidos, a-mesa | — | 800ml/1200ml/1800ml (3 links) | MAIS VENDIDOS | comedouro_maison.webp | 2 |
| 17 | Bolsa Voyage Signature | R$ 429,00 | colecao-passeio | pag.ae/81LHebDYP | — | null | bolsa_voyage.webp | — |
| 18 | Cama Suspensa Élysée | R$ 397,90 | conforto | pag.ae/81MuixsTN | — | null | cama_suspensa_elysee.webp | — |
| 19 | Arranhador Sisal Maison | R$ 197,90 | brinquedos | pag.ae/81MunByX6 | — | null | arranhador_bola.webp | — |
| 20 | Cama Suspensa Aura | R$ 389,00 | mais-vendidos, conforto | pag.ae/81MurBvHN | — | MAIS VENDIDOS | cama_suspensa_rattan.webp | — |
| 21 | Executive Bed™ | a partir de R$ 597,00 | couro | — | M/G (2 links) | null | executive_bed.webp | — |
| 22 | Bowl Cerâmica Spoiled | R$ 167,00 | a-mesa | pag.ae/81NMeTc16 | — | null | bowl_ceramica.webp | 3 |
| 24 | Fonte Automática Elegance | R$ 547,00 | a-mesa | pag.ae/81NQzRaB6 | — | null | fonte_automatica.webp | 1 |
| 25 | Mesa Gourmet Nordic™ | R$ 397,00 | a-mesa | pag.ae/81P7aH2YR | — | null | mesa_nordic.webp | 5 |
| 26 | Roma Walk Set | R$ 1.090,00 | colecao-passeio | pag.ae/81P8FJPxM | — | null | roma_walk.webp | — |
| 27 | Ursinho Interativo Kong | R$ 229,00 | brinquedos, mais-vendidos | pag.ae/81Pa5nMYM | — | null | ursinho-interativo-premium-kong-brasil-edition.webp | 6 |
| 28 | Cabana Teepee Luxo | a partir de R$ 1.190,00 | sono-refugio | — | Tam. P/M/G (3 links) | null | cabana_teepee.webp | — |

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

| ID | Label exibido no site | Status | Ordem no site |
|---|---|---|---|
| `mais-vendidos` | Mais Vendidos | ✅ Com produtos | 1º (sempre visível) |
| `couro` | Essenciais em Couro | ✅ Com produtos | 2º |
| `conforto` | Conforto & Estilo | ✅ Com produtos | 3º |
| `a-mesa` | À Mesa | ✅ Com 5 produtos (id 24, 16, 22, 4, 25) — ordenados por `order` | 4º |
| `colecao-passeio` | Coleção Passeio | ✅ Com produtos | 5º |
| `viagem-mobilidade` | Viagem & Mobilidade | ✅ Com 1 produto (id 3) | 6º |
| `sono-refugio` | Sono & Refúgio | ✅ Com 2 produtos (id 14, 28) | 7º |
| `brinquedos` | Brinquedos & Estilo | ✅ Com produtos | 8º |
| `colecao-casa` | Coleção Casa | ✅ Com produtos | 9º |

**Ordem dos produtos por categoria conforto** (reflete a ordem no array `PRODUCTS`):
id 6 → id 18 → id 12 → id 20

---

## 4. Padrões e Convenções

### Campos obrigatórios ao adicionar produto

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number | Próximo disponível após 28 é **29** |
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

### Imagens do projeto

**Status: 100% WebP ✓** Todas as imagens do projeto foram convertidas para WebP em 18/05/2026.

**Formatos e localização:**
- `assets/hero/image-hero.webp` — imagem hero principal (quality 85, ~158KB; antigo PNG: 2.1MB). ✅ Incluída no repositório (removida do `.gitignore` em 18/05/2026)
- `assets/logo.webp` — logo marca importado em Navbar.module.css (quality 85, ~35KB; antigo JPEG: 36KB). Referência em background-image CSS
- `assets/sobre_nos/sobre_nos.webp` — foto da seção Sobre Nós (76KB; convertida de PNG em 20/05/2026). Importado como módulo ES em Story.jsx
- `public/images/products/*.webp` — 19 imagens de produto, todas em WebP quality 82; convertidas em 18/05/2026 e posteriores. Mesa Nordic convertida de JPEG em 20/05/2026 (redução de 120KB para 31KB). Cabana Teepee convertida de JPEG para WebP em 21/05/2026. Todas commitadas no git
- `public/og-image.png` — compartilhada em redes sociais (formato original PNG; não convertida pois é meta tag social)
- `public/images/brand/` — logo e assets de marca

**Referências no código:**
- Hero.jsx: `import heroImg from '../../../assets/hero/image-hero.webp'`
- Navbar.module.css: `background-image: url("../../../assets/logo.webp")`
- Story.jsx: `import sobreImg from '../../../assets/sobre_nos/sobre_nos.webp'`
- ProductCard.jsx e ProductModal.jsx: carregam via `src/data/products.js` (campo `image` com caminho `/images/products/*.webp`)
- Featured.jsx: carrega imagem destaque via caminho `/images/products/sofa-ortopedico.webp`

**Resumo de economia de espaço:**
| Imagem | Anterior | WebP | Redução |
|---|---|---|---|
| image-hero | 2.1 MB (PNG) | 158 KB | 92% |
| logo | 36 KB (JPEG) | 35 KB | 3% |
| sobre_nos | ~PNG | 76 KB (WebP, 20/05/2026) | — |
| mesa_nordic | 120 KB (JPEG) | 31 KB (WebP, 20/05/2026) | 74% |
| 17 produtos | ~90 KB cada | ~70 KB cada | 22% avg |
| **Total** | ~3.7 MB | ~1.5 MB | **59%** |

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

## Convenções CSS

### Arquitetura
- `globals.css` — reset, utilitárias, tipografia, layout, sistema `.reveal`
- `animations.css` — apenas @keyframes, nomeados por componente de origem
- `buttons.css` (Passo Final) — global controlado, apenas `.btn` e variantes
- `[Componente].module.css` — estilos scoped por componente

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

### :global()
Permitido apenas para: `.reveal`, utilitárias globais (`.serif`, `.italic`, `.gold`, `.wrap`, `.section-tag`), third-party  
Proibido para qualquer coisa que deveria ser scoped

### Mistura de classes no JSX
✅ `className={[styles.hero, 'reveal'].filter(Boolean).join(' ')}`  
❌ `className={\`${styles.hero} reveal\`}`

### Z-Index
Sempre via variáveis — nunca hardcoded:  
`--z-navbar: 100 | --z-modal: 1000 | --z-overlay: 900 | --z-above-modal: 1100`

### Regra anti-gambiarra
Durante migração: nunca corrigir com `margin-top: -13px`, `calc(100% + 2px)` ou `overflow-x: hidden` sem causa raiz clara

---

## 6. Arquitetura CSS

### Estrutura atual
- `src/styles/globals.css` — reset, utilitárias globais (`.wrap`, `.serif`, `.italic`, `.gold`, `.reveal`), tipografia base. **150 linhas.** Não contém @keyframes, z-index hardcoded nem estilos de botões.
- `src/styles/animations.css` — @keyframes globais: `heroRise`, `heroFade`, `heroFloaty`, `stageRotate`, `scrollCueLine`. ⚠️ **Nota:** Keyframes em `animations.css` não são resolvidos dentro de `.module.css` (CSS Modules no Vite processa keyframes como identificadores locais) — declare keyframes localmente em cada módulo que precisar.
- `src/styles/variables.css` — design tokens: cores, fontes, espaçamentos, z-index (`--z-base`, `--z-navbar`, `--z-modal`, `--z-overlay`, `--z-above-modal`)
- `src/styles/buttons.css` — global controlado para `.btn` e variantes (`.btn-primary`, `.btn-ghost`, `.btn-outline`, `.btn-full`, `.btn-gold`, `.wa-icon`). Importado explicitamente pelos 8 componentes que usam botões: Featured, CTA, ProductModal, Hero, NotFound, Navbar, Products, Button.

### CSS Modules — status da migração
Componentes já migrados para `.module.css` próprio:
- `TrustBadges.module.css` — selos de confiança (variant: banner | modal)
- `NotFound.module.css` — página 404
- `Story.module.css` — seção Sobre Nós (classes: `storyGrid`, `storyArt`, `storyText`, `lead`, `manifesto`, `assinatura`)
- `Featured.module.css` — produto em destaque
- `CTA.module.css` — chamada para ação
- `FAQ.module.css` — perguntas frequentes (accordion com estado `faqItemOpen`)
- `Footer.module.css` — rodapé com 5 colunas
- `ProductCard.module.css` — card de produto no carrossel
- `ProductGrid.module.css` — carrossel com setas e dots
- `Products.module.css` — múltiplos carrosséis por categoria (expansão com `productsExpandOpen`)
- `Differentials.module.css` — diferenciais da marca (usa `:global(.section-tag)` para cor da tag)
- `ProductModal.module.css` — modal de detalhes (estado `modalShow`, seletor de tamanho com `sizeBtnActive`)
- `Navbar.module.css` — navbar fixa com scroll state (`navScrolled`), menu hambúrguer (`navBurgerOpen`) e drawer mobile (`navDrawerOpen`)
- `Hero.module.css` — seção hero com headline animada, stage com anéis e logo card; keyframes declarados localmente no próprio módulo

Componentes ainda no globals.css (pendentes):
- (nenhum — migração 100% concluída)

> Consulte [docs/CSS_MIGRATION.md](docs/CSS_MIGRATION.md) para convenções, checklist completo e detalhes de cada migração.

### Padrões obrigatórios nos módulos
- camelCase: `heroGrid`, `modalCard`, `footerBrand`
- Estado como classe própria: `navScrolled`, `faqItemOpen`, `sizeBtnActive`
- Mistura com globais no JSX: `[styles.hero, 'reveal'].filter(Boolean).join(' ')`
- `:global()` apenas para: `.reveal`, utilitárias globais, third-party
- Media queries sempre no final: base → tablet (768px) → mobile (480px)

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

### Narrativa do site: WhatsApp → compra direta
A narrativa original direcionava todos os produtos para WhatsApp. Com a integração PagBank, produtos com `buyLink`/`buyLinks` exibem "COMPRAR AGORA" no card e no modal, com WhatsApp como canal secundário de consulta.

### Campo `category` é array
Permite que um produto apareça em múltiplas categorias (ex: `["mais-vendidos", "conforto"]`). Os filtros usam `.includes(id)`.

### DevTweaks excluído do bundle de produção
`import.meta.env.DEV` é uma constante `false` no build — o Vite elimina o bloco via dead-code elimination. O painel de ajustes nunca vai para produção.

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

### Limpeza de documentação (completada em 20/05/2026)
✅ Removidos comentários "TROCAR DOMÍNIO" de 3 arquivos:
- `index.html` — comentário removido (domínio já configurado como `petluxostory.com.br`)
- `public/sitemap.xml` — comentário removido
- `public/robots.txt` — comentário removido

### Produtos sem buyLink (exibem "VIA WHATSAPP" no card)
Nenhum produto atualmente sem link de pagamento — todos os 20 produtos têm `buyLink` ou `buyLinks`.

### Favicon
✅ **Favicon.ico gerado em 20/05/2026** a partir de `assets/logo.webp` (48×48px, 7.5KB) via ImageMagick. Referência em `index.html` atualizada de `favicon.svg` para `favicon.ico` (type="image/x-icon"). O `favicon.svg` foi mantido no repositório para compatibilidade, mas não é mais referenciado.

### og:image
A imagem `public/og-image.png` foi atualizada recentemente. Para limpar o cache do LinkedIn e forçar re-scrape, usar:
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/

### Sitemap
`public/sitemap.xml` é manual. Quando o site crescer com mais rotas, considerar geração automática.

---

## 10. Notas de Implementação CSS

### Products — expansão de categorias (Products.module.css)
O `.productsExpandInner` usa `overflow: hidden` + `padding: 0 16px`. Esses dois valores são interdependentes e **não devem ser alterados de forma isolada**:

- **`overflow: hidden`** — necessário para o truque `grid-template-rows: 0fr → 1fr`. Sem ele (ou com qualquer eixo como `overflow: visible`), o item de grid usa seu `min-height` intrínseco e o colapso para 0 não funciona, quebrando o botão "Ver menos".
- **`padding: 0 16px`** — compensa o `margin: 0 -12px` do `.carouselOuter` (que estende as setas 12px além do content box). Com 16px de padding, as setas ficam dentro da *padding box* (16px - 12px = 4px de folga), visíveis, sem serem cortadas pelo `overflow: hidden`.

Se o padding for removido, as setas laterais dos carrosséis nas categorias expandidas serão cortadas. Se o `overflow: hidden` for trocado por `overflow-x: visible`, o botão "Ver menos" para de fechar.

### CTA — ponto de interrogação em itálico (CTA.module.css)
O `?` em "começar a comprar?" usa `<i className="italic gold-text">` — Cormorant Garamond itálico com `background-clip: text`. Dois mecanismos podem cortá-lo:

1. **Overflow da section** — `.cta { overflow: hidden }` (necessário para os anéis decorativos de até 1000px) corta glifos que alcançam a borda. Corrigido com `padding-right: 0.3em` em `.cta h2`.
2. **Gradient coverage** — `background-clip: text` pinta o gradiente apenas dentro do bounding box do `<i>`, que termina no *advance width* do glifo. O overhang óptico do `?` itálico fica fora desse box → transparente → aparece cortado. Corrigido com `padding-right: 0.2em` em `.cta h2 i`.

**Não remover** `overflow: hidden` do `.cta` — os anéis ornamentais `.ctaOrn .ring` (até r3 com 1000px) causariam scroll horizontal sem ele.

### Story — otimização de espaçamento para desktop (Story.module.css)
Em 20/05/2026 foram reduzidos tamanhos e espaçamentos para desktop evitar scroll excessivo da seção:
- `.story` padding-top/bottom: `clamp(60px, 8vh, 100px)` → `clamp(40px, 5vh, 70px)`
- `.storyGrid` gap: `64px` → `40px`
- `.storyText h2` font-size: `clamp(36px, 4vw, 64px)` → `clamp(28px, 3vw, 48px)`
- `.storyText .lead` font-size: `20px` → `17px`
- `.storyText p` font-size: `15px` → `13px`

Mudanças aplicadas apenas no base (desktop). Media queries `@media (max-width: 980px)` preservadas intactas — mobile/tablet sem alterações.

---

## 11. Melhorias de Conteúdo (20/05/2026)

### Diferencial #04 — Atualizado
**Antes:** "Produtos para toda rotina" / "Coleiras, camas, acessórios, higiene e mais. Tudo que o seu pet precisa no dia a dia."  
**Depois:** "Curadoria premium" / "Cada produto é selecionado com um olhar criterioso: design refinado, materiais nobres e aquele toque especial que transforma o dia a dia em uma experiência única."

### FAQ — Pergunta #7 Atualizada
**Antes:** "Como escolher o tamanho ideal?" / "Produtos com tamanhos disponíveis têm as opções descritas na página. Em dúvida, nossa equipe te ajuda pelo WhatsApp."  
**Depois:** "Como sei qual tamanho de cama escolher para o meu pet?" / "Recomendamos medir o comprimento do seu pet de focinho a cauda e adicionar cerca de 20cm para garantir conforto total. Nossos produtos com variação de tamanho indicam as medidas de cada opção. Em caso de dúvida, fale com a gente pelo WhatsApp — adoramos ajudar!"
