# PetLuxo — Contexto do Projeto

Este arquivo descreve o estado ATUAL do projeto para orientar o Claude Code. Não é histórico: a migração para a Cloudflare, rollback e resultados de testes ficam em `docs/CLOUDFLARE_MIGRATION.md`. Em qualquer divergência, o código é a verdade.

Última atualização: 2026-10-28

Site estático (sem backend, sem banco, sem API) de produtos premium para pets. Catálogo, busca, filtro, ficha de produto e consentimento de analytics são resolvidos no front-end. Todo o contato de compra é por WhatsApp.

- **Produção:** https://www.petluxostory.com.br (canônico). **Instagram:** @petluxostory (o `Footer.jsx:51` aponta para outro perfil: `docs/TODO.md` item 28).
- **Repositório:** público. `AI_CONTEXT_PETLUXO.md` está no `.gitignore`, mas continua tracked.

## Hospedagem, deploy e domínio

- **Hospedagem:** Cloudflare Workers com static assets (plano Free). Worker `petluxo`, configurado em `wrangler.jsonc` (`assets.directory` `./dist`, `not_found_handling` `single-page-application`). Versão do Node em `.nvmrc` (`22`). Cabeçalhos de segurança em `public/_headers` (HSTS `max-age=63072000`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`; sem CSP, sem regras de cache).
- **Deploy:** Workers Builds a cada push em `main` (`npm run build`, depois `npx wrangler deploy`); o `wrangler` não está no `package.json`. Os commits do painel admin também vão para `main` e disparam o build. `workers.dev` e as Preview URLs continuam ligados (desligar é a pendência F4.8).
- **Modo SPA:** acesso direto a rotas (`/produto/2`, políticas) e URLs inexistentes (inclusive `/xyz.png`) devolvem HTTP 200 com o `index.html` (soft 404); a rota `*` do app mostra o `NotFound`. `public/404.html` e a restauração de path em `src/main.jsx` ficam inertes (remoção é a pendência F4.5).
- **Domínio e DNS:** `petluxostory.com.br`, registrado no Registro.br (vence em 2027-05-07). Nameservers: os dois atribuídos pela Cloudflare. `www` é o canônico (Custom Domain do Worker); a raiz também é Custom Domain do Worker e redireciona para o `www` com 301 (regra "raiz para www"); HTTP redireciona para HTTPS com 301 (regra "http para https"); as duas regras preservam caminho e query. Zona: 3 CAA (`pki.goog`, `sectigo.com`, `letsencrypt.org`), `_domainconnect` (DNS only), CNAME `*` → Vercel (DNS only; subdomínios que não sejam `www` caem na Vercel com 404) e as linhas "Worker" do `www` e da raiz. Sem MX, TXT nem AAAA. DNSSEC não está ativo (não ativar por ora).
- **Vercel:** o painel admin (`petluxo-admin`, fora deste repositório) continua na Vercel. O projeto Vercel do site existe, intacto, como plano B até o prazo de 2026-11-11 (`docs/TODO.md` item 35): não mexer. Rollback e histórico: ver `docs/CLOUDFLARE_MIGRATION.md` (seção 7).
- **Build:** `npm run build` gera `dist/` (validador de catálogo + Vite). `docs/DEPLOY.md` descreve o deploy, a configuração, o domínio e o checklist pós-deploy na Cloudflare; `README.md` e `docs/README.md` seguem a mesma hospedagem.
- **Metadados:** `index.html` (og:url, og:image, twitter:image), `public/sitemap.xml` (só a home) e `public/robots.txt` (4 linhas, sem `Host:`) usam `https://www.petluxostory.com.br`. Não há `<link rel="canonical">` (decisão D4 do documento de migração: só junto com meta tags por rota). Meta tags são únicas; `/produto/:id` herda as da home.

## Estado por área (LIVE × EM DESENVOLVIMENTO × PLANEJADO)

| Área                                                                                                  | Estado                                                                                      |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Catálogo, busca, filtro por categoria, carrosséis, ficha `/produto/:id`, galeria, lightbox            | LIVE                                                                                        |
| CTA "CONSULTAR VIA WHATSAPP" com mensagem dinâmica (nome, variação, preço, link da ficha)             | LIVE                                                                                        |
| Consentimento GA4 (LGPD) e `page_view` por rota                                                       | LIVE                                                                                        |
| Validação de catálogo no build (`scripts/validate-catalog.js`)                                        | LIVE no build                                                                               |
| Testes Playwright de consentimento GA4                                                                | No código (`tests/`, `playwright.config.js`); sem script npm para executar                  |
| CTA "COMPRAR AGORA" (links PagBank)                                                                   | Oculto por `HIDE_BUY_CTA = true` (`ProductBuyButton.jsx`); links seguem em `products.js`    |
| Carrinho, checkout, Pix/débito/crédito, Mercado Pago, banco, e-mail transacional, frete, Melhor Envio | APENAS PLANEJADO (`docs/CHECKOUT_ARCHITECTURE.md`). Nenhum código existe                    |

Não existem `api/`, `functions/`, `db/`, `vercel.json` nem `src/data/shipping.js`.

## Stack e scripts

- React ^18.3.1, React Router DOM ^7.15.0 (`BrowserRouter` em `main.jsx`, rotas em `src/app/page.jsx`), Vite ^6.3.3, `@vitejs/plugin-react` ^4.3.4.
- CSS Modules por componente, sem framework de UI. JavaScript puro (sem TypeScript).
- `yet-another-react-lightbox` ^3.32.2 com plugin `Zoom`, carregado via `React.lazy` só em dispositivo touch.
- devDependencies de teste: `@playwright/test` e `playwright` ^1.49.0.
- Scripts: `dev`, `build` (`node scripts/validate-catalog.js && vite build`), `preview`, `validate:catalog`. Não há script de lint nem de teste.
- `vite.config.js`: `react()`, host `0.0.0.0`, porta 5173.

## Estrutura

```
petluxo/
├── index.html                 # meta tags, OG, Twitter; sem gtag (GA4 carrega por src/lib/analytics.js)
├── wrangler.jsonc, .nvmrc     # Worker "petluxo" (assets de ./dist, modo SPA) e Node 22
├── assets/                    # logo.webp, hero/image-hero.webp, sobre_nos/*.webp (importados pelo Vite)
├── public/                    # favicon, og-image.png, og-image.jpg, robots.txt, sitemap.xml (só a home), 404.html, _headers, images/products/<slug>/
├── scripts/validate-catalog.js
├── tests/analytics-consent.spec.js
├── playwright.config.js
├── docs/                      # CHECKOUT_ARCHITECTURE, CLOUDFLARE_MIGRATION, CSS_MIGRATION, DECISIONS, DEPLOY, PRODUCT_EXPANSION, README, TODO
└── src/
    ├── main.jsx               # monta <App/>, restaura path do 404.html (inerte), bloqueio/reset de pinch-zoom (WebKit)
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

Pastas/arquivos locais ignorados ou não tracked: `.kilo/` (só um `.gitignore`), `_incoming/` (vazia), `dist/`, `test-results/`, `.vercel/`, `.wrangler/`, `.dev.vars`, `.env.local`.

## Rotas

`/` (Navbar, Hero, Featured, Products, Story, Differentials, CTA, FAQ, Footer, ProductModal), `/produto/:id`, `/politica-de-privacidade`, `/politica-de-troca-e-devolucao`, `/politica-de-frete-e-entrega`, `/termos-de-uso` e `*` (NotFound no layout padrão). `ScrollToTop` e `AnalyticsConsent` ficam fora do `<Routes>`.

`/produto/:id` com id inexistente ou `visible === false` renderiza Navbar + NotFound + Footer (com HTTP 200, ver "Modo SPA"). Produto existente usa `MinimalNavbar` (só a marca, link para `/`).

## Compra: `HIDE_BUY_CTA`

`ProductBuyButton.jsx` define `const HIDE_BUY_CTA = true`. Com `true`, nenhum `buyLink`/`buyLinks` é renderizado: aparece só "CONSULTAR VIA WHATSAPP" (mensagem: nome, variação "Tamanho: X"/"Cor: X" quando há `buyLinks`, preço ativo ou `price`, link absoluto `/produto/:id`).

- `badge === 'ESGOTADO'`: botão "ESGOTADO" desabilitado + link WhatsApp com `styles.waLink`.
- Com `buyLinks` ou `buyLink`: só o WhatsApp (`btn btn-primary btn-full`); com a constante `false` voltaria "COMPRAR AGORA" e o WhatsApp deveria voltar para `styles.waLink`.
- Sem link: WhatsApp.
- `ProductCard` mostra sempre o texto fixo "VIA WHATSAPP" sob o preço. `Featured` não usa `buyLink`/`buyLinks` (CTAs: WhatsApp e "VER TODOS OS PRODUTOS").
- Textos que ainda citam o PagBank como gateway ativo: `FAQ.jsx:39`, `Footer.jsx:63-68`, `PrivacyPage.jsx` (linhas 48, 58, 64, 84), `ShippingPolicyPage.jsx:60`, `TermsPage.jsx:87`. Não alterar sem decisão do dono (`docs/TODO.md` item 22).

WhatsApp (`src/lib/whatsapp.js`): número de `VITE_WHATSAPP_PHONE` com fallback hardcoded (é o que a produção usa); único export é `wa(texto)`, que monta `wa.me`. O número também está hardcoded em `products.js` (id 2) e nas 3 páginas de política. Não existe botão flutuante (FAB) de WhatsApp.

## Analytics (GA4 + consentimento)

- `src/lib/analytics.js`: ID `G-KKMV5VHR48` hardcoded (não é segredo); consentimento em `localStorage` (`petluxo_analytics_consent`: `granted`/`denied`); `gtag.js` só é injetado depois de `granted`; `config` com `send_page_view: false`; `page_view` explícito por rota via `trackPageView` (fila de page_views pendentes e retry após falha de carregamento).
- `AnalyticsConsent.jsx`: banner com aceitar/recusar e revogação. Revogar não remove o `gtag.js` já carregado (limitação documentada no arquivo); apaga cookies `_ga*`/`_gid` quando possível. O domínio `.petluxostory.com.br` cobre raiz e `www`.
- `PrivacyPage.jsx` tem seção "Cookies e Google Analytics"; linha ~134 diz que a base legal "depende de confirmação jurídica".
- `tests/analytics-consent.spec.js` testa o código local (`BASE_URL` `http://localhost:5173`; o config sobe `npm run dev`).

## Catálogo (`src/data/products.js`)

**9 categorias** (todas `visible: true`): `mais-vendidos`, `couro`, `conforto`, `a-mesa`, `colecao-cozy-luxo`, `brinquedos`, `colecao-passeio`, `sono-refugio`, `viagem-mobilidade`.

**37 produtos**, ids de 1 a 42 (faltam 5, 6, 7, 11, 23), sem duplicados. **28 visíveis** (25 sem o campo `visible`, 3 com `true`) e **9 `visible: false`**: 3, 4, 13, 16, 19, 22, 27, 29, 32. 11 produtos estão em 2 ou mais categorias.

Visíveis por categoria (ordem por `categoryOrder` da categoria): mais-vendidos 4 (39, 8, 20, 28); couro 7 (42, 41, 8, 9, 15, 10, 21); conforto 4 (38, 20, 12, 18); a-mesa 2 (24, 25); colecao-cozy-luxo 3 (31, 30, 33); brinquedos 3 (40, 39, 1); colecao-passeio 3 (34, 17, 26); sono-refugio 10 (2, 38, 18, 12, 37, 21, 20, 35, 28, 14); viagem-mobilidade 2 (37, 36).

**Links:** 27 produtos com `buyLink` único e 10 com `buyLinks` (ids 2, 8, 9, 14, 16, 17, 21, 28, 41, 42). `prices` em 2, 8, 14, 16, 21, 28, 41, 42; os ids 9 e 17 têm `buyLinks` sem `prices`. Nenhum produto sem link; multi-size com um link por tamanho. Os 4 links do id 2 são `wa.me` (os demais são `pag.ae`). `variationType: 'cor'` só no id 17.

**Próximos valores livres (do arquivo):** `id` 43; `order` 58 (máximo atual 57, id 2; sem `order` duplicado); `categoryOrder` — maior peso atual por categoria: brinquedos 500, sono-refugio 1500, viagem-mobilidade 300, a-mesa 1200, mais-vendidos 1700, conforto 1600, couro 1700, colecao-passeio 500, colecao-cozy-luxo 800 (convenção: pesos em múltiplos de 100, maior aparece primeiro). Pesos de `mais-vendidos`: id 39 = 1700, id 8 = 1600, id 16 = 1400 (oculto), id 20 = 1300, id 28 = 1200.

**Campos** em uso: `id`, `name`, `shortName`, `subtitle`, `description`, `bullets`, `price`, `originalPrice`, `prices`, `category[]`, `order`, `categoryOrder{}`, `image`, `badge`, `buyLink`, `buyLinks`, `variationType`, `tags`, `supplierLink`, `visible`, `featured`, `cardNote`.

- Todos têm `shortName`; só os ids 3, 4 e 10 não têm `subtitle`. Todos têm `tags`. `supplierLink` falta em 16 produtos e é enviado ao navegador.
- `badge` em uso: `MAIS VENDIDOS`, `PREMIUM`, `NOVO`, `EXCLUSIVO`, `ESGOTADO` (o validador aceita só esses).
- `featured: true` só no id 2 (Refúgio Cozy). `Featured.jsx` mostra o primeiro produto com `featured === true` e visível. `featured: false` explícito nos ids 13, 37, 38, 39, 40.
- `cardNote` só no id 20. `originalPrice` nos ids 1, 3, 40.
- `order` não é usado na exibição (o frontend usa `categoryOrder`); mantido porque o painel admin externo depende dele (`docs/TODO.md` item 20).
- `products.js` é reescrito pelo painel admin externo (commits "via painel admin" mexem só nele).
- Busca em `Products.jsx`: todas as palavras em `name`, `shortName`, rótulos de categoria e `tags`. Grid filtrado ordena pelo maior `categoryOrder` entre as categorias do produto; carrosséis por categoria usam o peso daquela categoria.
- Id 16 está oculto mas tem ficha pronta.

**Validador (`scripts/validate-catalog.js`)** roda antes do `vite build` e falha o build em: id duplicado, campo obrigatório ausente, URL de link inválida ou com espaço, link/size ausente, categoria inválida, badge fora do padrão, imagem inexistente em `public/`, `categoryOrder` inválido, divergência de tamanhos entre `prices` e `buyLinks` (exceção: ids 9 e 17). Mantém exceção de `shortName` para ids 3, 4, 10 (desnecessária hoje: `docs/TODO.md` item 27).

## Fichas (`src/data/productDetails.js`)

`PRODUCT_DETAILS`, indexado por id, isolado de `products.js` (o painel admin não o toca). 20 chaves, todas com produto correspondente: 2, 8, 9, 10, 12, 16, 17, 20, 21, 26, 28, 34, 35, 36, 37, 38, 39, 40, 41, 42.

Sem ficha: 17 produtos (1, 3, 4, 13, 14, 15, 18, 19, 22, 24, 25, 27, 29, 30, 31, 32, 33); 9 deles visíveis (1, 14, 15, 18, 24, 25, 30, 31, 33) e abrem só o modal rápido (`docs/TODO.md` item 8). Sem `gallery`: só o id 34.

Schema (10 campos, todos opcionais): `gallery`, `specs{}`, `sizeChart[{size,height,length,width,weight}]`, `howToChooseSize`, `sizeGuideNote`, `whatsIncluded[]`, `careInstructions`, `airTravelNote`, `warranty`, `faq[{question,answer}]`. `sizeGuideNote` em uso nos ids 2, 9, 28, 34, 41, 42. `docs/PRODUCT_EXPANSION.md` documenta o schema.

- `ProductPage.jsx` define `SPEC_LABELS` (72 entradas); toda chave nova de `specs` exige label (hoje nenhuma está sem).
- Toda linha de `sizeChart` precisa das 5 chaves (usar `'—'` quando não se aplica); hoje todas estão completas.
- Fichas completas (10 campos): ids 41 e 42. Id 2 tem ficha com `sizeChart` vazio e orientação por peso.
- Ordem dos `AccordionItem` fixa no JSX: specs → sizeChart → howToChooseSize → sizeGuideNote → whatsIncluded → careInstructions → airTravelNote → warranty → faq (todos fechados por padrão).

Produtos citados:

- **Élan Couro (9):** `buyLinks` PP/M/G, sem `prices`, galeria de 4 fotos; ficha com `specs` 4, `whatsIncluded` 3, `sizeGuideNote`; sem `sizeChart`.
- **Refúgio Majestá (38)** (nome com "á"): R$ 999,90, `buyLink` único, badge `NOVO`, 2 fotos; ficha com `specs` 9, `whatsIncluded` 4, `careInstructions`.
- **Refúgio Cozy (id 2):** P/M/G/GG de R$ 394 a R$ 697, links `wa.me`, `featured: true`, 2 fotos, ficha de 9 campos.
- **Comedouro Maison Élevé (16):** `visible: false`; 800ml/1200ml/1800ml com preço e link; 4 fotos; ficha com `specs` 12 e `sizeChart` 3.

## Imagens

Convenção: `public/images/products/<slug>/principal.webp` + `<slug>-2.webp`, `-3`, ... Todos os 37 produtos usam `principal.webp`; todos os arquivos referenciados existem. `.gitkeep` em `products/` e `brand/` (`brand/` vazia). Fotos de produto devem ser WebP de verdade (não PNG com extensão `.webp`) e abaixo de ~150 KB; nenhum arquivo em `public/images` ou `assets` passa de 500 KB, exceto `public/og-image.png` (1,8 MB, PNG 1536×1024, mantido para links e prévias antigas). A prévia de compartilhamento usa `public/og-image.jpg` (JPEG sRGB 1200×630, 73 KB); `index.html` aponta `og:image` e `twitter:image` para `https://www.petluxostory.com.br/og-image.jpg` e tem `og:image:type`, `og:image:width`, `og:image:height` e `og:image:alt`. A pasta `arranhador-felino-sisal-ajustavel-4-niveis-portatil/` não é referenciada por nenhum produto (`docs/TODO.md` item 29). Como o painel converte as fotos: `docs/TODO.md` item 24.

## Componentes

- **`ProductCard`:** com `PRODUCT_DETAILS[id]` navega para `/produto/:id` (`useNavigate`); sem ficha chama `onQuick` e abre `ProductModal`.
- **`ProductGrid`:** carrossel próprio; `perView` 1 (<640px), 2 (<1024px), 3; swipe com limiar de 50px.
- **`ProductGallery`:** `useIsMobile(640)` define o layout; `usePointerCoarse` define o lightbox; `ProductLightbox` via `React.lazy`; lupa (`zoomEnabled`) alternável; swipe mobile com limiar de 50px.
- **`ProductLightbox`:** `yet-another-react-lightbox` + plugin `Zoom`, `maxZoomPixelRatio: 2`, `scrollToZoom: false`.
- **`useProductBuy`:** `selectedSize` inicial = primeiro `buyLinks[].size`; deriva `activeBuyLink` e `activePrice` por igualdade de `size`.
- **`ProductSizeSelector`:** tamanho ou cor (`variationType === 'cor'`, swatch via `color`).
- **`Products.jsx`:** carrossel "Mais Vendidos" + expansão por categoria; modo filtro com grid; `IntersectionObserver` local para `.reveal`; `CategorySelector` (bottom sheet mobile, `Escape`, congela o body com `position: fixed`).
- **`Accordion`:** `aria-expanded`, cada item com estado próprio.
- **`ScrollToTop`:** `scrollTo` instantâneo imediato + `requestAnimationFrame`.
- **`globals.css`:** `scroll-behavior: smooth`, `overflow-anchor: none`, `touch-action: pan-x pan-y` (bloqueia pinch-zoom; ressalva de acessibilidade, WCAG 1.4.4, `docs/TODO.md` item 12).
- **`main.jsx`:** bloqueio de `gesture*` do WebKit (exceto `.yarl__portal`) e reset de escala por `maximum-scale=1.0` temporário em `gestureend`/`visualViewport resize`.
- **`icons.jsx`:** só exporta `Icon` com `Search`, `Wa`, `ArrowR`, `ArrowUp`, `Plus`, `Chevron` (todos em uso; sem acesso dinâmico `Icon[...]`).
- **`DevTweaks`:** `React.lazy` só em `import.meta.env.DEV`; controla tom de acento e textura de grão.
- Páginas de política usam estilos inline (sem `.module.css`).
- Tokens z-index em `variables.css`: `--z-base`, `--z-dropdown`, `--z-navbar`, `--z-overlay`, `--z-modal`, `--z-above-modal`. Cor: `--vinho` #6B1E2B, `--caramelo` #B08968, `--ink` #2A2522. Fontes: Cormorant Garamond, Inter, JetBrains Mono.

## Convenções CSS (de `docs/CSS_MIGRATION.md`)

CSS Modules em camelCase; todos os `.module.css` são importados; nenhum bloco passa de 2 níveis. `@keyframes` usados por módulo estão declarados no próprio módulo (`Hero.module.css`, `Products.module.css`); não existe arquivo global de keyframes. `.btn` e variantes ficam em `buttons.css` (importado por quem usa botões). `:global()` aparece em 11 pontos; `ProductModal.module.css:66` usa `:global(.price)` e vários usam `:global(.btn)`, `:global(.reveal)`, `:global(.section-tag)`.

## Segurança

Nenhum segredo no repositório. `.env`, `.env.local`, `dist`, `test-results/`, `.vercel`, `.wrangler/` e `.dev.vars` estão no `.gitignore`; só `.env.example` (nome da variável) é tracked. Dados públicos intencionais: ID do GA4, telefone do WhatsApp, CNPJ no Footer. `supplierLink` (21 produtos) é exposto no bundle (`docs/TODO.md` item 3/18). O repositório é público porque as miniaturas do painel usam `raw.githubusercontent.com` (`docs/TODO.md` item 23).

## Variáveis de ambiente

Única: `VITE_WHATSAPP_PHONE` (opcional; `.env.local`, `.env.example`; fallback hardcoded em `whatsapp.js`). A produção não define variáveis de ambiente: usa o número padrão do código.

## Documentação do repositório

`docs/CHECKOUT_ARCHITECTURE.md` (plano, não iniciado; precisa ser reescrito para InfinitePay com frete grátis: TODO 26), `docs/CLOUDFLARE_MIGRATION.md` (migração, estado por fase, rollback, registro de execução), `docs/CSS_MIGRATION.md`, `docs/DEPLOY.md` (deploy e domínio na Cloudflare), `docs/PRODUCT_EXPANSION.md`, `docs/README.md` e `README.md`, `docs/DECISIONS.md` (seções 10 e 11 superadas pela 12: atendimento só por WhatsApp, PagBank provavelmente não volta, intenção de checkout próprio com InfinitePay e frete grátis, ainda não definitivo; seção 8 superada pela 13: hospedagem na Cloudflare, repositório público por causa das miniaturas do painel, cartão só por checkout hospedado), `docs/TODO.md` (lista de pendências).

## Dívidas e pendências abertas

- Sem script de lint; sem script npm para os testes Playwright (`docs/CLOUDFLARE_MIGRATION.md` F2.6).
- Migração: restam o GA4 em Tempo Real (F0.6, `docs/TODO.md` item 36), a troca de foto pelo painel (item 31), meta tags por produto (item 2, não prioritário) e, até 2026-11-11, o desligamento de `workers.dev`/Preview URLs, a remoção do `404.html` e a exclusão do projeto Vercel do site (item 35). Documentação (F5) concluída. Ver `docs/CLOUDFLARE_MIGRATION.md`.
- Textos do site que citam o PagBank como gateway ativo: `docs/TODO.md` item 22.
- Checkout próprio (InfinitePay, frete grátis) e reescrita de `docs/CHECKOUT_ARCHITECTURE.md`: `docs/TODO.md` itens 21 e 26.
- Eventos GA4 de clique no WhatsApp: `docs/TODO.md` item 6.
- Meta tags por produto, status 404 real, sitemap com produtos, JSON-LD: `docs/TODO.md` itens 1, 2 e 10.
- `supplierLink` no catálogo público e ids 9 e 17 incorretos: `docs/TODO.md` item 3/18.
- Fichas dos 9 produtos visíveis sem ficha e campo de prazo de entrega: `docs/TODO.md` itens 7 e 8.
- Privatizar o repositório e rotacionar o token do painel: `docs/TODO.md` itens 23 e 25.
- PNG com extensão `.webp` nas galerias: `docs/TODO.md` item 24.
- Bloqueio de pinch-zoom (acessibilidade): `docs/TODO.md` item 12.
- Resíduos: exceção de `shortName` (ids 3, 4, 10) no validador, `:global(.price)` em `ProductModal.module.css:66`, `<a href="/">` na Navbar (`Navbar.jsx:30`), `Footer.jsx:63` com `<a>` sem `href`, `import React` não usado em vários arquivos: `docs/TODO.md` item 27.
- Instagram do rodapé e pasta de imagem órfã: `docs/TODO.md` itens 28 e 29.
- Plano da Vercel para o painel admin (item 32), renovação do domínio (item 33) e achados da auditoria do painel (item 34): `docs/TODO.md`.
