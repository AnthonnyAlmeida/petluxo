# PetLuxo — Contexto do Projeto

Snapshot técnico do código, verificado por auditoria em 2026-10-26. Em qualquer divergência, o código é a verdade.

Site estático (sem backend, sem banco, sem API) de produtos premium para pets. Catálogo, busca, filtro, ficha de produto e consentimento de analytics são resolvidos no front-end. Todo o contato de compra hoje é por WhatsApp.

- **Produção:** https://petluxostory.com.br
- **Instagram:** @petluxostory
- **Hospedagem:** Vercel (Hobby), deploy a cada push em `main`. Estado atual do deploy: não verificado.
- **Repositório:** público. `main` == `origin/main` em `cf76540` na data da auditoria; há alterações staged não commitadas (Playwright: `playwright.config.js`, `tests/analytics-consent.spec.js`, `package*.json`, `.gitignore`, `docs/TODO.md`) e alterações de limpeza de dados/código morto na working tree, também não commitadas.

## Estado por área (LIVE × EM DESENVOLVIMENTO × PLANEJADO)

| Área | Estado |
|---|---|
| Catálogo, busca, filtro por categoria, carrosséis, ficha `/produto/:id`, galeria, lightbox | LIVE |
| CTA "CONSULTAR VIA WHATSAPP" com mensagem dinâmica (nome, variação, preço, link da ficha) | LIVE |
| Consentimento GA4 (LGPD) e `page_view` por rota | No código em `main`; confirmar deploy |
| Validação de catálogo no build (`scripts/validate-catalog.js`) | LIVE no build |
| Testes Playwright de consentimento GA4 | Staged, não commitado |
| CTA "COMPRAR AGORA" (links PagBank) | Oculto por `HIDE_BUY_CTA = true` (`ProductBuyButton.jsx:19`); links seguem em `products.js` |
| Carrinho, checkout, Pix/débito/crédito, Mercado Pago, banco, e-mail transacional, frete, Melhor Envio | APENAS PLANEJADO (`docs/CHECKOUT_ARCHITECTURE.md`). Nenhum código existe |

Não existem `api/`, `functions/`, `db/`, `vercel.json` nem `src/data/shipping.js`.

## Stack e scripts

- React ^18.3.1, React Router DOM ^7.15.0 (`BrowserRouter` em `main.jsx`, rotas em `src/app/page.jsx`), Vite ^6.3.3 (instalado 6.4.2), `@vitejs/plugin-react` ^4.3.4.
- CSS Modules por componente, sem framework de UI. JavaScript puro (sem TypeScript).
- `yet-another-react-lightbox` ^3.32.2 com plugin `Zoom`, carregado via `React.lazy` só em dispositivo touch.
- devDependencies de teste (staged): `@playwright/test` e `playwright` ^1.49.0.
- Scripts: `dev`, `build` (`node scripts/validate-catalog.js && vite build`), `preview`, `validate:catalog`. Não há script de lint nem de teste.
- Último `npm run build`: ok, 107 módulos, JS principal ~342 kB (~105 kB gzip), chunk do lightbox ~42 kB; validador de catálogo com 0 avisos.
- `vite.config.js`: `react()`, host `0.0.0.0`, porta 5173.

## Estrutura

```
petluxo/
├── index.html                 # meta tags, OG, Twitter; sem gtag (GA4 carrega por src/lib/analytics.js)
├── assets/                    # logo.webp, hero/image-hero.webp, sobre_nos/*.webp (importados pelo Vite)
├── public/                    # favicon, og-image.png, robots.txt, sitemap.xml (só a home), 404.html, images/products/<slug>/
├── scripts/validate-catalog.js
├── tests/analytics-consent.spec.js   # staged
├── playwright.config.js              # staged
├── docs/                      # CHECKOUT_ARCHITECTURE, CSS_MIGRATION, DECISIONS, DEPLOY, PRODUCT_EXPANSION, README, TODO
└── src/
    ├── main.jsx               # monta <App/>, restaura path do 404.html, bloqueio/reset de pinch-zoom (WebKit)
    ├── app/                   # page.jsx (rotas + HomePage), ScrollToTop.jsx, DevTweaks.jsx (só dev)
    ├── components/
    │   ├── layout/            # Navbar, MinimalNavbar, Footer
    │   ├── product/           # ProductCard, ProductGrid, ProductModal, ProductGallery, ProductLightbox,
    │   │                      # ProductSizeSelector, ProductBuyButton
    │   ├── sections/          # Hero, Featured, Products, Story, Differentials, CTA, FAQ, NotFound
    │   ├── pages/             # ProductPage, PrivacyPage, ReturnPolicyPage, ShippingPolicyPage, TermsPage
    │   └── ui/                # Accordion, AnalyticsConsent, BrandSeal, CategorySelector, TrustBadges
    ├── data/                  # products.js, productDetails.js
    ├── hooks/                 # useScroll.js, useProductBuy.js
    ├── lib/                   # whatsapp.js, analytics.js
    ├── styles/                # variables.css, globals.css, buttons.css
    ├── icons.jsx
    └── tweaks-panel.jsx
```

Pastas/arquivos locais ignorados ou não tracked: `.kilo/` (só um `.gitignore`), `_incoming/` (vazia), `dist/`, `test-results/`, `.vercel/`, `.env.local`.

## Rotas

`/` (Navbar, Hero, Featured, Products, Story, Differentials, CTA, FAQ, Footer, ProductModal), `/produto/:id`, `/politica-de-privacidade`, `/politica-de-troca-e-devolucao`, `/politica-de-frete-e-entrega`, `/termos-de-uso` e `*` (NotFound no layout padrão). `ScrollToTop` e `AnalyticsConsent` ficam fora do `<Routes>`.

`/produto/:id` com id inexistente ou `visible === false` renderiza Navbar + NotFound + Footer. Produto existente usa `MinimalNavbar` (só a marca, link para `/`).

Sem `vercel.json`: o acesso direto a rotas depende de `public/404.html` (grava o pathname em `sessionStorage`) e da restauração em `main.jsx`. Meta tags são únicas (as de `index.html`); `/produto/:id` herda as da home. `public/sitemap.xml` lista apenas a home.

## Compra: `HIDE_BUY_CTA`

`ProductBuyButton.jsx` define `const HIDE_BUY_CTA = true`. Com `true`, nenhum `buyLink`/`buyLinks` é renderizado: aparece só "CONSULTAR VIA WHATSAPP" (mensagem: nome, variação "Tamanho: X"/"Cor: X" quando há `buyLinks`, preço ativo ou `price`, link absoluto `/produto/:id`).

- `badge === 'ESGOTADO'`: botão "ESGOTADO" desabilitado + link WhatsApp com `styles.waLink`.
- Com `buyLinks` ou `buyLink`: só o WhatsApp (`btn btn-primary btn-full`); com a constante `false` voltaria "COMPRAR AGORA" e o WhatsApp deveria voltar para `styles.waLink`.
- Sem link: WhatsApp.
- `ProductCard` mostra sempre o texto fixo "VIA WHATSAPP" sob o preço. `Featured` não usa `buyLink`/`buyLinks` (CTAs: WhatsApp e "VER TODOS OS PRODUTOS").
- Textos que ainda citam o PagBank como gateway ativo: `FAQ.jsx:39`, `Footer.jsx:63-68`, `PrivacyPage.jsx` (linhas 48, 58, 64, 84), `ShippingPolicyPage.jsx:60` (frete "calculado pelo PagBank"), `TermsPage.jsx:87`. São decisão consciente (descrevem o fluxo pretendido); não alterar sem decisão do dono.

WhatsApp (`src/lib/whatsapp.js`): número de `VITE_WHATSAPP_PHONE` com fallback hardcoded; único export é `wa(texto)`, que monta `wa.me`. O número também está hardcoded em `products.js` (id 2) e nas 3 páginas de política. Não existe botão flutuante (FAB) de WhatsApp no projeto.

## Analytics (GA4 + consentimento)

- `src/lib/analytics.js`: ID `G-KKMV5VHR48` hardcoded (não é segredo); consentimento em `localStorage` (`petluxo_analytics_consent`: `granted`/`denied`); `gtag.js` só é injetado depois de `granted`; `config` com `send_page_view: false`; `page_view` explícito por rota via `trackPageView` (fila de page_views pendentes e retry após falha de carregamento).
- `AnalyticsConsent.jsx`: banner com aceitar/recusar e revogação. Revogar não remove o `gtag.js` já carregado (limitação documentada no arquivo); apaga cookies `_ga*`/`_gid` quando possível.
- `PrivacyPage.jsx` tem seção "Cookies e Google Analytics"; linha ~134 diz que a base legal "depende de confirmação jurídica".
- `tests/analytics-consent.spec.js`: 9 testes Playwright (staged); `test-results/.last-run.json` marca `passed`.
- Não há eventos de clique no WhatsApp (pendência).

## Catálogo (`src/data/products.js`)

**9 categorias** (todas `visible: true`): `mais-vendidos`, `couro`, `conforto`, `a-mesa`, `colecao-cozy-luxo`, `brinquedos`, `colecao-passeio`, `sono-refugio`, `viagem-mobilidade`.

**37 produtos**, ids de 1 a 42 (faltam 5, 6, 7, 11, 23), sem duplicados. **28 visíveis** (25 sem o campo `visible`, 3 com `true`) e **9 `visible: false`**: 3, 4, 13, 16, 19, 22, 27, 29, 32. 11 produtos estão em 2 ou mais categorias.

Visíveis por categoria (ordem por `categoryOrder` da categoria): mais-vendidos 4 (39, 8, 20, 28); couro 7 (42, 41, 8, 9, 15, 10, 21); conforto 4 (38, 20, 12, 18); a-mesa 2 (24, 25); colecao-cozy-luxo 3 (31, 30, 33); brinquedos 3 (40, 39, 1); colecao-passeio 3 (34, 17, 26); sono-refugio 10 (2, 38, 18, 12, 37, 21, 20, 35, 28, 14); viagem-mobilidade 2 (37, 36).

**Links:** 27 produtos com `buyLink` único e 10 com `buyLinks` (ids 2, 8, 9, 14, 16, 17, 21, 28, 41, 42). `prices` em 2, 8, 14, 16, 21, 28, 41, 42; os ids 9 e 17 têm `buyLinks` sem `prices`. Nenhum produto sem link; multi-size com um link por tamanho. Os 4 links do id 2 são `wa.me` (os demais são `pag.ae`). `variationType: 'cor'` só no id 17.

**Próximos valores livres (do arquivo):** `id` 43; `order` 58 (máximo atual 57, id 2; sem `order` duplicado); `categoryOrder` — maior peso atual por categoria: brinquedos 500, sono-refugio 1500, viagem-mobilidade 300, a-mesa 1200, mais-vendidos 1700, conforto 1600, couro 1700, colecao-passeio 500, colecao-cozy-luxo 800 (convenção observada: pesos em múltiplos de 100, maior aparece primeiro). Pesos de `mais-vendidos`: id 39 = 1700, id 8 = 1600, id 16 = 1400 (oculto), id 20 = 1300, id 28 = 1200.

**Campos** em uso: `id`, `name`, `shortName`, `subtitle`, `description`, `bullets`, `price`, `originalPrice`, `prices`, `category[]`, `order`, `categoryOrder{}`, `image`, `badge`, `buyLink`, `buyLinks`, `variationType`, `tags`, `supplierLink`, `visible`, `featured`, `cardNote`.
- Todos têm `shortName`; só os ids 3, 4 e 10 não têm `subtitle`. Todos têm `tags`. `supplierLink` falta em 16 produtos e é enviado ao navegador.
- `badge` em uso: `MAIS VENDIDOS`, `PREMIUM`, `NOVO`, `EXCLUSIVO`, `ESGOTADO` (o validador aceita só esses).
- `featured: true` só no id 2 (Refúgio Cozy). `Featured.jsx` mostra o primeiro produto com `featured === true` e visível. `featured: false` explícito nos ids 13, 37, 38, 39, 40.
- `cardNote` só no id 20. `originalPrice` nos ids 1, 3, 40.
- `order` não é usado na exibição (frontend usa `categoryOrder`); mantido porque o painel admin externo (`petluxo-admin`) depende dele (conforme `docs/TODO.md` item 20; painel fora do repositório, não verificado aqui).
- `products.js` é reescrito por esse painel admin externo (commits "via painel admin" mexem só nele).
- Busca em `Products.jsx`: todas as palavras em `name`, `shortName`, rótulos de categoria e `tags`. Grid filtrado ordena pelo maior `categoryOrder` entre as categorias do produto; carrosséis por categoria usam o peso daquela categoria.
- Inconsistências conhecidas: ids 9 e 17 têm `supplierLink` incorreto; id 16 oculto mas com ficha pronta.

**Validador (`scripts/validate-catalog.js`)** roda antes do `vite build` e falha o build em: id duplicado, campo obrigatório ausente, URL de link inválida ou com espaço, link/size ausente, categoria inválida, badge fora do padrão, imagem inexistente em `public/`, `categoryOrder` inválido, divergência de tamanhos entre `prices` e `buyLinks` (exceção: ids 9 e 17). Mantém exceção de `shortName` para ids 3, 4, 10 (hoje desnecessária). Estado atual: 0 erros, 0 avisos.

## Fichas (`src/data/productDetails.js`)

`PRODUCT_DETAILS`, indexado por id, isolado de `products.js` (o painel admin não o toca). 20 chaves, todas com produto correspondente: 2, 8, 9, 10, 12, 16, 17, 20, 21, 26, 28, 34, 35, 36, 37, 38, 39, 40, 41, 42.

Sem ficha: 17 produtos (1, 3, 4, 13, 14, 15, 18, 19, 22, 24, 25, 27, 29, 30, 31, 32, 33); 9 deles visíveis (1, 14, 15, 18, 24, 25, 30, 31, 33). Sem `gallery`: só o id 34.

Schema (10 campos, todos opcionais): `gallery`, `specs{}`, `sizeChart[{size,height,length,width,weight}]`, `howToChooseSize`, `sizeGuideNote`, `whatsIncluded[]`, `careInstructions`, `airTravelNote`, `warranty`, `faq[{question,answer}]`. `sizeGuideNote` em uso nos ids 2, 9, 28, 34, 41, 42. `docs/PRODUCT_EXPANSION.md` já documenta o campo.

- `ProductPage.jsx` define `SPEC_LABELS` (72 entradas); hoje nenhuma chave de `specs` está sem label. Chave nova exige label.
- Toda linha de `sizeChart` precisa das 5 chaves (usar `'—'` quando não se aplica); estado atual: todas completas.
- Fichas completas (10 campos): ids 41 e 42. Id 2 tem ficha com `sizeChart` vazio e orientação por peso.
- Ordem dos `AccordionItem` fixa no JSX: specs → sizeChart → howToChooseSize → sizeGuideNote → whatsIncluded → careInstructions → airTravelNote → warranty → faq (todos fechados por padrão).

Produtos citados:
- **Élan Couro (9):** `buyLinks` PP/M/G, sem `prices`, galeria de 4 fotos; ficha com `specs` 4, `whatsIncluded` 3, `sizeGuideNote`; sem `sizeChart`.
- **Refúgio Majestá (38)** (nome com "á"): R$ 999,90, `buyLink` único, badge `NOVO`, 2 fotos; ficha com `specs` 9, `whatsIncluded` 4, `careInstructions`.
- **Refúgio Cozy (id 2):** P/M/G/GG de R$ 394 a R$ 697, links `wa.me`, `featured: true`, 2 fotos, ficha de 9 campos.
- **Comedouro Maison Élevé (16):** `visible: false`; 800ml/1200ml/1800ml com preço e link; 4 fotos; ficha com `specs` 12 e `sizeChart` 3.

## Imagens

Convenção: `public/images/products/<slug>/principal.webp` + `<slug>-2.webp`, `-3`, ... Todos os 37 produtos usam `principal.webp`; todos os arquivos referenciados existem; não há galeria apontando para arquivo ausente nem foto órfã dentro das pastas. Exceção solta: `public/images/products/arranhador-felino-sisal-ajustavel-4-niveis-portatil.webp` (1,9 MB, fora de pasta, não referenciado); `.gitkeep` em `products/` e `brand/` (`brand/` vazia).

Fotos principais acima de 1 MB: polvo-mimo, refugio-majesta, brinquedo-petluxo, espreguicadeira-madeira-dobravel, comedouro-nomade-premium, reservatorio-hermetico-cozy, bolsa-termica-signature-matelasse, manta-serenity-petluxo-premium, quadro-pet-personalizado. `public/og-image.png` tem 1,8 MB.

## Componentes (confirmado por leitura/grep)

- **`ProductCard`:** com `PRODUCT_DETAILS[id]` navega para `/produto/:id` (`useNavigate`); sem ficha chama `onQuick` e abre `ProductModal`.
- **`ProductGrid`:** carrossel próprio; `perView` 1 (<640px), 2 (<1024px), 3; swipe com limiar de 50px.
- **`ProductGallery`:** `useIsMobile(640)` define o layout; `usePointerCoarse` define o lightbox; `ProductLightbox` via `React.lazy`; lupa (`zoomEnabled`) alternável; swipe mobile com limiar de 50px.
- **`ProductLightbox`:** `yet-another-react-lightbox` + plugin `Zoom`, `maxZoomPixelRatio: 2`, `scrollToZoom: false`.
- **`useProductBuy`:** `selectedSize` inicial = primeiro `buyLinks[].size`; deriva `activeBuyLink` e `activePrice` por igualdade de `size`.
- **`ProductSizeSelector`:** tamanho ou cor (`variationType === 'cor'`, swatch via `color`).
- **`Products.jsx`:** carrossel "Mais Vendidos" + expansão por categoria; modo filtro com grid; `IntersectionObserver` local para `.reveal`; `CategorySelector` (bottom sheet mobile, `Escape`, congela o body com `position: fixed`).
- **`Accordion`:** `aria-expanded`, cada item com estado próprio.
- **`ScrollToTop`:** `scrollTo` instantâneo imediato + `requestAnimationFrame`.
- **`globals.css`:** `scroll-behavior: smooth`, `overflow-anchor: none`, `touch-action: pan-x pan-y` (bloqueia pinch-zoom; ressalva de acessibilidade, WCAG 1.4.4, item 12 do TODO).
- **`main.jsx`:** bloqueio de `gesture*` do WebKit (exceto `.yarl__portal`) e reset de escala por `maximum-scale=1.0` temporário em `gestureend`/`visualViewport resize`.
- **`icons.jsx`:** só exporta `Icon` com `Search`, `Wa`, `ArrowR`, `ArrowUp`, `Plus`, `Chevron` (todos em uso; sem acesso dinâmico `Icon[...]`).
- **`DevTweaks`:** `React.lazy` só em `import.meta.env.DEV`; controla tom de acento e textura de grão.
- Páginas de política usam estilos inline (sem `.module.css`).
- Tokens z-index em `variables.css`: `--z-base`, `--z-dropdown`, `--z-navbar`, `--z-overlay`, `--z-modal`, `--z-above-modal`. Cor: `--vinho` #6B1E2B, `--caramelo` #B08968, `--ink` #2A2522. Fontes: Cormorant Garamond, Inter, JetBrains Mono.

## Convenções CSS (de `docs/CSS_MIGRATION.md`, verificadas no código)

CSS Modules em camelCase; todos os `.module.css` são importados; nenhum bloco passa de 2 níveis. `@keyframes` usados por módulo estão declarados no próprio módulo (`Hero.module.css`, `Products.module.css`); não existe arquivo global de keyframes. `.btn` e variantes ficam em `buttons.css` (importado por quem usa botões). `:global()` aparece em 11 pontos; `ProductModal.module.css:66` usa `:global(.price)` e vários usam `:global(.btn)`, `:global(.reveal)`, `:global(.section-tag)`.

## Qualidade e dívida técnica (estado atual)

- Sem script de lint. Build ok; validador de catálogo sem avisos.
- Sem `TODO`/`FIXME`/`HACK` no código; sem `console.log` em `src` (apenas no script do validador).
- `Navbar` usa `<a href="/">` (recarrega a página) em vez de `Link` (verificado na linha 30).
- `Footer.jsx:63`: `<a>` "PagBank Pagamento Seguro" sem `href`.
- `import React` não usado em vários arquivos (inofensivo com o runtime automático do JSX; mantido).

## Segurança

Auditoria de código e histórico completo do git: nenhum segredo, token, senha ou chave encontrada. `.env`, `.env.local`, `dist`, `test-results/` e `.vercel` estão no `.gitignore`; só `.env.example` (nome da variável) é tracked. Dados públicos intencionais: ID do GA4, telefone do WhatsApp, CNPJ no Footer. `supplierLink` (21 produtos) é exposto no bundle.

## Variáveis de ambiente

Única: `VITE_WHATSAPP_PHONE` (`.env.local`, `.env.example`; fallback hardcoded em `whatsapp.js`).

## Documentação do repositório

`docs/CHECKOUT_ARCHITECTURE.md` (plano, não iniciado; cita "32 produtos" — hoje 37), `docs/CSS_MIGRATION.md` (migração concluída; ainda cita `animations.css` e `Button`/`Container`/`Section`, que não existem mais), `docs/DECISIONS.md`, `docs/DEPLOY.md`, `docs/PRODUCT_EXPANSION.md`, `docs/README.md` e `README.md` (descrevem bundle, `globals.css`, `Button`/`Container`/`Section` e fluxo PagBank desatualizados), `docs/TODO.md` (itens abertos: 1, 2, 3/18, 4, 6, 7, 8, 10, 12, 21).

## Pendências reais (segundo o código)

1. Commitar os arquivos staged (Playwright, testes, `.gitignore`, TODO) e a limpeza da working tree.
2. Decidir `HIDE_BUY_CTA` e alinhar FAQ/Footer/políticas ao fluxo real.
3. Checkout próprio (carrinho, pagamento, frete, e-mail, banco): nada implementado.
4. Eventos GA4 de clique no WhatsApp.
5. Meta tags por produto, tratamento de 404, sitemap com produtos, JSON-LD.
6. Remover `supplierLink` do catálogo público e corrigir ids 9 e 17.
7. Fichas para os 9 produtos visíveis sem ficha; campo de prazo de entrega.
8. Comprimir imagens grandes (e `og-image.png`) e remover o `.webp` solto.
9. Revisar bloqueio de pinch-zoom (acessibilidade) e o plano Vercel Hobby para uso comercial.

## Limites desta verificação

Não verificado: deploy em produção; execução dos testes Playwright; comportamento visual em navegador; leitura integral de `ProductModal`, `Hero`, `Story`, `Differentials`, `CTA`, `NotFound`, `TrustBadges`, `BrandSeal`, `useScroll.js` e dos CSS; painel `petluxo-admin` (externo ao repositório); termos da Vercel; base legal LGPD.
