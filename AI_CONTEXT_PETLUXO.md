# PetLuxo — Contexto do Projeto

Este arquivo descreve o estado ATUAL do projeto para orientar o Claude Code. Não é histórico: a migração para a Cloudflare e resultados de testes ficam em `docs/CLOUDFLARE_MIGRATION.md`. Em qualquer divergência, o código é a verdade.

Última atualização: 2026-11-24

Site estático (sem backend, sem banco, sem API) de produtos premium para pets, com um Worker pequeno só para SEO de `/produto/*`. Catálogo, busca, filtro, ficha de produto e consentimento de analytics são resolvidos no front-end. Todo o contato de compra é por WhatsApp.

- **Produção:** https://www.petluxostory.com.br (canônico). **Instagram:** instagram.com/pettluxo_/ (@pettluxo_), o mesmo link de `FOOTER.instagram`.
- **Repositório:** público. `AI_CONTEXT_PETLUXO.md` está no `.gitignore`, mas continua tracked.

## Hospedagem, deploy e domínio

- **Hospedagem:** Cloudflare Workers com static assets e script (plano Free). Worker `petluxo`, configurado em `wrangler.jsonc` (`main` `worker/index.js`, `assets.directory` `./dist`, `assets.binding` `ASSETS`, `not_found_handling` `single-page-application`, `run_worker_first` `["/produto/*"]`). Versão do Node em `.nvmrc` (`22`). Cabeçalhos de segurança em `public/_headers` (HSTS `max-age=63072000`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`; sem CSP, sem regras de cache); o `_headers` NÃO vale para respostas do Worker, que repete esses 3 headers e `Cache-Control: public, max-age=0, must-revalidate` no código.
- **Deploy:** Workers Builds a cada push em `main` (`npm run build`, depois `npx wrangler deploy`); o `wrangler` está em `devDependencies` (versão no `package-lock.json`). Os commits do painel admin também vão para `main` e disparam o build. `workers.dev` está desligado (`"workers_dev": false` no `wrangler.jsonc`) e verificado por `curl` (o endereço e o formato de Preview respondem 404). `"preview_urls": false` também está definido no arquivo; as Preview URLs NÃO têm confirmação direta por `curl` (só o estado "desligado" visto no painel). O domínio próprio responde normalmente (`www` 200, raiz 301, `/produto/43` 200).
- **Modo SPA:** fora de `/produto/*`, acesso direto a rotas (políticas) e URLs inexistentes (inclusive `/xyz.png`) devolvem HTTP 200 com o `index.html` (soft 404, sem `noindex`); a rota `*` do app mostra o `NotFound`. Não existe `public/404.html` nem restauração de path em `src/main.jsx`.
- **Worker de SEO (`worker/index.js`, `worker/seo.js`):** só em `/produto/*` e só GET/HEAD (outros métodos vão para `env.ASSETS.fetch`). Busca o shell (`/` via `env.ASSETS`, sem headers condicionais). Produto visível e canônico: `HTMLRewriter` troca `title`, `meta description`, `og:title/description/url/image/image:alt`, `twitter:title/description/image`, remove `og:image:width/height/type` e insere `<link rel="canonical">`. Produto inexistente, oculto ou formato inválido (`/produto/abc`, `/produto/44/x`, `/produto/`): shell com 404, `X-Robots-Tag: noindex` e `meta robots noindex`. `/produto/044` e `/produto/44/`: 301 para `/produto/44` com a query. `seo.js` são funções puras (`parseProductPath`, `findVisibleProduct`, `buildProductMeta`; `SITE` = domínio `www`) que importam `src/data/products.js`; o Wrangler empacota o catálogo no Worker. A descrição vem de `description` (fallback `subtitle`) truncada em ~155 caracteres (fim de frase quando existe; senão, limite de palavra com "…", sem terminar em artigo, preposição ou conjunção como "e", "de", "com": `scripts/check-seo.js` confere). Validado em produção em 2026-11-17 por `curl` (título, canonical e `og:image` por produto; 404 + `noindex`; 301) e pela prévia do WhatsApp de `/produto/44`.
- **Domínio e DNS:** `petluxostory.com.br`, registrado no Registro.br (vence em 2027-05-07). Nameservers: os dois atribuídos pela Cloudflare. `www` é o canônico (Custom Domain do Worker); a raiz também é Custom Domain do Worker e redireciona para o `www` com 301 (regra "raiz para www"); HTTP redireciona para HTTPS com 301 (regra "http para https"); as duas regras preservam caminho e query. Zona: 3 CAA (`pki.goog`, `sectigo.com`, `letsencrypt.org`) e as duas linhas "Worker" (raiz e `www`); subdomínios inexistentes não resolvem. Mais 1 TXT de verificação do Google Search Console (não apagar; valor não registrado aqui). Sem MX nem AAAA. DNSSEC não está ativo (não ativar por ora).
- **Vercel:** o painel admin (`petluxo-admin`, fora deste repositório) continua na Vercel; é a única coisa do projeto que está lá. O projeto Vercel do site não existe mais, e o rollback para a Vercel não existe (voltar exigiria recriar projeto e domínio na Vercel e refazer o DNS). Histórico: `docs/CLOUDFLARE_MIGRATION.md`.
- **Build:** `npm run build` gera `dist/` (validador de catálogo + Vite). `docs/DEPLOY.md` descreve o deploy, a configuração, o domínio e o checklist pós-deploy na Cloudflare; `README.md` e `docs/README.md` seguem a mesma hospedagem.
- **Metadados:** `index.html` (og:url, og:image, twitter:image), `public/robots.txt` (4 linhas, sem `Host:`) e o Worker/sitemap usam `https://www.petluxostory.com.br`. Título da home: "PetLuxo — Camas, coleiras de couro e acessórios premium" (title, og:title, twitter:title). Não há canonical estático no `index.html` (D4): o canonical de produto vem do Worker; home e políticas seguem sem canonical e com as meta tags do `index.html`. Sem JSON-LD; sem `google-site-verification`.
- **Sitemap:** `scripts/generate-sitemap.js` roda no fim do `npm run build` e grava `dist/sitemap.xml` (home + produtos `visible !== false`, ordem de id, sem `lastmod`/`changefreq`/`priority`; falha se `dist/` não existir ou se houver menos de 2 URLs). `public/sitemap.xml` não existe mais no repositório; o sitemap só existe no `dist/`. **Search Console:** propriedade de domínio verificada em 2026-11-17 por TXT no DNS; sitemap `https://www.petluxostory.com.br/sitemap.xml` enviado.

## Estado por área (LIVE × EM DESENVOLVIMENTO × PLANEJADO)

| Área                                                                                                  | Estado                                                                                      |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Catálogo, busca, filtro por categoria, carrosséis, ficha `/produto/:id`, galeria, lightbox            | LIVE                                                                                        |
| Layout mobile (< 768px): home em cenas, catálogo `/produtos`, busca `/buscar`, ficha, políticas, 404, cookies | No código; abaixo de 768px o site usa componentes próprios (`src/components/mobile/`) |
| Layout desktop novo (≥ 768px): home, `/produtos`, ficha, políticas, 404, cookies (desenho aprovado em 2026-11-23) | LIVE (commitado e publicado em produção em 2026-11-24; ver "Layout desktop") |
| CTA "CONSULTAR VIA WHATSAPP" com mensagem dinâmica (nome, variação, preço, link da ficha)             | LIVE                                                                                        |
| Consentimento GA4 (LGPD) e `page_view` por rota                                                       | LIVE                                                                                        |
| Validação de catálogo no build (`scripts/validate-catalog.js`)                                        | LIVE no build                                                                               |
| Testes Playwright de consentimento GA4                                                                | No código (`tests/`, `playwright.config.js`); sem script npm (`npx playwright test`)        |
| CTA "COMPRAR AGORA" (links PagBank)                                                                   | Oculto por `HIDE_BUY_CTA = true` (`ProductBuyButton.jsx`); links seguem em `products.js`    |
| Carrinho, checkout, Pix/débito/crédito, Mercado Pago, banco, e-mail transacional, frete, Melhor Envio | APENAS PLANEJADO (`docs/CHECKOUT_ARCHITECTURE.md`). Nenhum código existe                    |

Não existem `api/`, `functions/`, `db/`, `vercel.json` nem `src/data/shipping.js`.

## Stack e scripts

- React ^18.3.1, React Router DOM ^7.15.0 (`BrowserRouter` em `main.jsx`, rotas em `src/app/page.jsx`), Vite ^6.3.3, `@vitejs/plugin-react` ^4.3.4.
- CSS Modules por componente, sem framework de UI. JavaScript puro (sem TypeScript). Todas as animações são CSS (sem biblioteca de animação).
- `@fontsource/cormorant-garamond`, `@fontsource/inter` e `@fontsource/jetbrains-mono` ^5.3.0: fontes hospedadas no site (subset latin; imports em `src/main.jsx` antes de `variables.css`; `index.html` não carrega Google Fonts). Pesos: Cormorant 400, 500, 600 e itálicos 400, 500 (o 400 é usado pelo mobile; o 600 entrou com o desktop novo; não há 600 itálico, nenhuma regra o usa); Inter 300, 400, 500, 600; JetBrains Mono 400, 500.
- `yet-another-react-lightbox` ^3.32.2 com plugin `Zoom`, carregado via `React.lazy` só em dispositivo touch.
- devDependencies de teste: `@playwright/test` e `playwright` ^1.49.0.
- Scripts: `dev`, `build` (`node scripts/validate-catalog.js && vite build && node scripts/generate-sitemap.js`), `preview`, `validate:catalog`, `test:seo` (`node scripts/check-seo.js`; exige o build feito; asserts do Node, nome sem `.test.js`/`.spec.js` para o Playwright não pegar). Não há script de lint nem script npm para os testes Playwright. `wrangler` em `devDependencies`.
- **Regra para comandos de build/teste novos:** atualizar `package.json`, `docs/DEPLOY.md`, `README.md`, `docs/README.md` e este arquivo; qualquer passo novo no `build` roda também no Workers Builds, então só pode depender do repositório e do `npm install`.
- `vite.config.js`: `react()`, host `0.0.0.0`, porta 5173.

## Estrutura

```
petluxo/
├── index.html                 # meta tags, OG, Twitter; sem gtag (GA4 carrega por src/lib/analytics.js)
├── wrangler.jsonc, .nvmrc     # Worker "petluxo" (main worker/index.js, assets de ./dist, modo SPA, run_worker_first /produto/*) e Node 22
├── assets/                    # só logo.webp (cabeçalho e rodapé do mobile, importado pelo Vite)
├── public/                    # favicon, og-image.png, og-image.jpg, robots.txt, _headers, images/products/<slug>/
├── worker/                    # index.js (Worker de SEO de /produto/*) e seo.js (funções puras)
├── scripts/                   # validate-catalog.js, generate-sitemap.js, check-seo.js
├── tests/analytics-consent.spec.js
├── playwright.config.js
├── docs/                      # CHECKOUT_ARCHITECTURE, CLOUDFLARE_MIGRATION, CSS_MIGRATION, DECISIONS, DEPLOY, DESIGN_SYSTEM, PRODUCT_EXPANSION, README, TODO (+ desing/, referência do redesign mobile)
└── src/
    ├── main.jsx               # monta <App/>; imports das fontes
    ├── app/                   # page.jsx (rotas, HomePage, CatalogPage, SearchPage), page.module.css, ScrollToTop.jsx, DevTweaks.jsx (só dev)
    ├── components/
    │   ├── layout/            # Navbar, MinimalNavbar (reusa Navbar.module.css), Footer
    │   ├── product/           # ProductCard, ProductGrid, ProductGallery, ProductLightbox,
    │   │                      # ProductSizeSelector, ProductBuyButton
    │   ├── sections/          # Hero, TrustStrip, Featured, Products, Story, Differentials, CTA, FAQ, NotFound
    │   ├── pages/             # ProductPage, PolicyLayout (+ PolicyLayout.module.css), PrivacyPage,
    │   │                      # ReturnPolicyPage, ShippingPolicyPage, TermsPage
    │   ├── ui/                # Accordion, AnalyticsConsent, BrandMark, BrandSeal, CategorySelector,
    │   │   │                  # SectionTag, TrustBadges
    │   │   └── art/           # arte desktop: Dog, Cat, Medal, Sparkle, PeekingCat, svgId.js, art.module.css
    │   └── mobile/            # layout mobile (< 768px): MobileIcons.jsx e
    │       ├── ui/            #   MobileUI.module.css, BottomSheet, ProductBadge, Paw
    │       ├── layout/        #   MobileHeader, MobileTabBar, MobileFooter, MobileChrome
    │       ├── home/          #   MobileHome (trilha dourada), MobileHero, FeaturedScene, AboutScene, DifferentialsScene, FaqScene
    │       ├── catalog/       #   MobileCatalog
    │       ├── search/        #   MobileSearch
    │       ├── product/       #   MobileProductFull, MobileProductSimple, MobileProductParts, ImageViewer
    │       ├── policy/        #   MobilePolicyLayout
    │       └── notfound/      #   MobileNotFound
    ├── data/                  # products.js, productDetails.js, siteContent.js (textos institucionais), specLabels.js
    ├── hooks/                 # useScroll (reveal da home desktop), useHoverState (hover/foco/toque da arte desktop), useProductBuy, useMediaQuery (useIsMobile, usePrefersReducedMotion),
    │                          # useHiddenUntilFound, useReserveBottomBar, useModalFocus, useDocumentHead
    ├── lib/                   # whatsapp.js, analytics.js, catalog.js (consultas ao catálogo), productMessage.js, text.js (splitLastWord)
    ├── styles/                # variables.css, globals.css, buttons.css
    ├── icons.jsx
    └── tweaks-panel.jsx
```

Pastas/arquivos locais ignorados ou não tracked (`_incoming/` está ignorada via `.gitignore`; ver "Imagens"): `.kilo/` (só um `.gitignore`), `dist/`, `test-results/`, `.wrangler/`, `.dev.vars`, `.env.local`. A pasta `.vercel/` não existe e não é mais ignorada. O desenho desktop aprovado (arquivos `.dc.html` do canvas, só referência visual) fica localmente em `_incoming/desktop_desing/desktop-design/`.

## Rotas

`/` (desktop: Navbar, Hero (com a TrustStrip logo abaixo), Featured, Products, Story, Differentials, CTA, FAQ, Footer; mobile: `MobileHome`), `/produtos` (catálogo: desktop = Navbar + a seção Products como página, com h1, + Footer; mobile = `MobileCatalog`, categoria em `?categoria=<id>`), `/buscar` (só mobile, `MobileSearch`; no desktop redireciona para `/produtos`), `/produto/:id`, `/politica-de-privacidade`, `/politica-de-troca-e-devolucao`, `/politica-de-frete-e-entrega`, `/termos-de-uso` e `*` (`NotFoundPage`). `ScrollToTop` e `AnalyticsConsent` ficam fora do `<Routes>`.

**Breakpoint:** `useIsMobile()` (`(max-width: 767.98px)`) escolhe, na mesma rota, o componente mobile ou o desktop. Os componentes que alternam (Navbar, MinimalNavbar, Footer, HomePage/CatalogPage/SearchPage, ProductPage, PolicyLayout e `Section`, NotFoundPage) começam pelo ramo `if (isMobile) return <Mobile…/>`; `AnalyticsConsent` é um só componente com CSS por faixa. Os dados e as regras vêm dos mesmos módulos (`lib/catalog.js`, `lib/productMessage.js`, `data/siteContent.js`, `data/specLabels.js`).

**Cabeçalho desktop por rota:** Navbar completa (âncoras da home) em `/` e `/produtos`; MinimalNavbar (marca + WhatsApp) na ficha, nas políticas e no 404. As âncoras da Navbar (`#produtos`, `#sobre`, `#diferenciais`, `#contato`, `#faq`) só existem na home; em `/produtos` só "Coleção" encontra a seção.

`/produto/:id` com id inexistente ou `visible === false` renderiza `NotFoundPage` (mobile: `MobileNotFound`; desktop: MinimalNavbar + NotFound + Footer); o Worker já responde esse HTML com HTTP 404 + `noindex` (ver "Worker de SEO"). Produto visível sem ficha (ids 13, 14, 24, 25, 30, 31) renderiza a página normalmente (mobile: `MobileProductSimple`; com ficha: `MobileProductFull`), sem os acordeões.

**Meta por rota no cliente (`useDocumentHead`):** `/produtos` define título, meta description, canonical e `og:*` próprios; `/buscar` define `noindex, follow`; os valores anteriores voltam ao sair da rota. Só vale para quem executa JavaScript (o Worker só reescreve `/produto/*`). Fora essas duas rotas, nada no front muda `document.title` nem meta: em navegação interna o `<title>` das demais rotas não muda; só o HTML inicial é reescrito pelo Worker. O sitemap (`scripts/generate-sitemap.js`) tem a home, `/produtos` e os produtos visíveis; `/buscar` fica fora.

## Compra: `HIDE_BUY_CTA`

`ProductBuyButton.jsx` define `const HIDE_BUY_CTA = true`. Com `true`, nenhum `buyLink`/`buyLinks` é renderizado: aparece só "CONSULTAR VIA WHATSAPP" (mensagem: nome, variação "Tamanho: X"/"Cor: X" quando há `buyLinks`, preço ativo ou `price`, link absoluto `/produto/:id`).

- `badge === 'ESGOTADO'`: botão "ESGOTADO" desabilitado (`.btn:disabled`) + link WhatsApp com `styles.waLink`.
- Com `buyLinks` ou `buyLink`: só o WhatsApp (`btn btn-primary btn-full btn-raised`); com a constante `false` voltaria "COMPRAR AGORA" e o WhatsApp deveria voltar para `styles.waLink`.
- Sem link: WhatsApp.
- `ProductCard` mostra sempre o texto fixo "VIA WHATSAPP" sob o preço. `Featured` não usa `buyLink`/`buyLinks` (CTA: WhatsApp com `WA_MESSAGES.product`).
- Os pedidos são feitos só pelo WhatsApp; o pagamento é por Pix ou por link de pagamento do PagBank gerado no atendimento (cartão). A Privacidade cita o PagBank como operador desse link; FAQ, Footer e demais políticas seguem o atendimento por WhatsApp. O PagBank também aparece em comentários de código sobre `HIDE_BUY_CTA` (`ProductBuyButton.jsx`, `Featured.jsx`, `ProductCard.jsx`) e nos links `pag.ae` de `products.js`. Os textos das 4 políticas são os finais do advogado (2026-11-19) e o aviso de entrega é a constante `DELIVERY_NOTE` (`data/siteContent.js`: "Prazo e frete informados no atendimento pelo WhatsApp, antes da confirmação do pedido."), exibida na ficha desktop (`ProductPage.jsx`, em `.buyStack`, entre o botão e os `TrustBadges`) e na mobile (`FreightNote`, variantes normal e `simple`). O que ainda depende da dona do negócio está no item 37 do `docs/TODO.md`.

WhatsApp (`src/lib/whatsapp.js`): número de `VITE_WHATSAPP_PHONE` com fallback hardcoded (é o que a produção usa); único export é `wa(texto)`, que monta `wa.me`. O número também está hardcoded em `products.js` (ids 2, 33, 43 e 44) e nas 3 páginas de política; a forma de exibição "(61) 99406-3917" está em `CONTACT.phoneDisplay` (`siteContent.js`, usada pelo cartão "Ficou com dúvida?" das políticas desktop). Não existe botão flutuante (FAB) de WhatsApp.

## Analytics (GA4 + consentimento)

- `src/lib/analytics.js`: ID `G-KKMV5VHR48` hardcoded (não é segredo); consentimento em `localStorage` (`petluxo_analytics_consent`: `granted`/`denied`); `gtag.js` só é injetado depois de `granted`; `config` com `send_page_view: false`; `page_view` explícito por rota via `trackPageView` (fila de page_views pendentes e retry após falha de carregamento).
- `AnalyticsConsent.jsx`: banner (`role="alertdialog"`, `aria-modal="true"`, nome "Sua privacidade importa", foco no banner ao abrir) com "Aceitar analytics" e "Recusar analytics". Desktop: cartão de 440px no canto inferior esquerdo, régua dourada, botões iguais em contorno vinho (bloco `@media (min-width: 768px)` do módulo); mobile: folha inferior (bloco `max-width: 767.98px`). O consentimento é reabrível pelo botão "Preferências de cookies" do rodapé (desktop: coluna "Políticas" do `Footer.jsx`), que dispara o evento `petluxo:open-consent` (escutado pelo banner). Recusar depois de um `granted` chama `revokeConsent()` (grava `denied` e apaga cookies `_ga*`/`_gid` quando possível) e em seguida `window.location.reload()`, o que encerra o `gtag.js` já carregado; recusar sem consentimento anterior só grava `denied` e fecha o banner. O domínio `.petluxostory.com.br` cobre raiz e `www`. Não há aviso "Preferência salva".
- `PrivacyPage.jsx` tem seção "Cookies e Google Analytics" (manda usar "Preferências de cookies" no rodapé); a seção "Base Legal (LGPD)" diz que a base legal do analytics "depende de confirmação jurídica".
- `tests/analytics-consent.spec.js` testa o código local (`BASE_URL` `http://localhost:5173`; o config sobe `npm run dev`). Depende de: `role=alertdialog[name="Sua privacidade importa"]`, botões /Aceitar analytics/ e /Recusar analytics/, botão "Preferências de cookies" no rodapé e um único link /privacidade/i na home (o do rodapé). 9 testes passando em 2026-11-23.

## Catálogo (`src/data/products.js`)

**9 categorias** (todas `visible: true`): `mais-vendidos`, `couro`, `conforto`, `a-mesa`, `colecao-cozy-luxo`, `brinquedos`, `colecao-passeio`, `sono-refugio`, `viagem-mobilidade`.

**41 produtos**, ids de 1 a 46 (faltam 5, 6, 7, 11, 23), sem duplicados. **29 visíveis** (22 sem o campo `visible`, 7 com `true`: ids 2, 13, 14, 20, 44, 45, 46) e **12 `visible: false`**: 1, 3, 4, 15, 16, 18, 19, 22, 27, 29, 32, 36. 8 produtos estão em 2 ou mais categorias (8, 12, 13, 16, 18, 20, 38, 39).

Visíveis por categoria (ordem por `categoryOrder` da categoria): mais-vendidos 3 (39, 8, 20); couro 6 (46, 45, 44, 43, 9, 10); conforto 4 (38, 20, 13, 12); a-mesa 2 (24, 25); colecao-cozy-luxo 3 (31, 30, 33); brinquedos 2 (40, 39); colecao-passeio 3 (34, 17, 26); sono-refugio 10 (2, 38, 12, 13, 37, 21, 20, 35, 28, 14); viagem-mobilidade 3 (8, 41, 42).

**Links:** 27 produtos com `buyLink` único (o id 45, `wa.me` sem texto, é o único dos novos sem variação de tamanho) e 14 com `buyLinks` (ids 2, 8, 9, 14, 16, 17, 21, 28, 33, 41, 42, 43, 44, 46). `prices` em 2, 8, 14, 16, 21, 28, 33, 41, 42, 43, 44, 46; os ids 9 e 17 têm `buyLinks` sem `prices`. Nenhum produto sem link; multi-size com um link por tamanho. Os `buyLinks` dos ids 2, 33, 43, 44 e 46 são `https://wa.me/5561994063917` sem texto (os demais são `pag.ae`). `variationType: 'cor'` só no id 17. A exigência de link é uma dívida aberta: `docs/TODO.md` item 38.

**Próximos valores livres (calculados do arquivo):** `id` 47 (maior atual 46; os buracos 5, 6, 7, 11 e 23 não são reaproveitados por convenção do doc, que usa máximo + 1); `order` 62 (máximo atual 61, id 46; sem `order` duplicado); `categoryOrder`: maior peso atual por categoria (incluindo ocultos) e próximo livre: mais-vendidos 1700 → 1800; couro 2100 → 2200; conforto 1600 → 1700; sono-refugio 1500 → 1600; a-mesa 1200 → 1300; colecao-cozy-luxo 800 → 900; brinquedos 500 → 600; colecao-passeio 500 → 600; viagem-mobilidade 500 → 600 (convenção: pesos em múltiplos de 100, maior aparece primeiro). Pesos de `mais-vendidos`: id 39 = 1700, id 8 = 1600, id 16 = 1400 (oculto), id 20 = 1300.

**Campos** em uso: `id`, `name`, `shortName`, `subtitle`, `description`, `bullets`, `price`, `originalPrice`, `prices`, `category[]`, `order`, `categoryOrder{}`, `image`, `badge`, `buyLink`, `buyLinks`, `variationType`, `tags`, `visible`, `featured`, `cardNote`.

- Todos têm `shortName`; só os ids 1, 3, 4, 8, 10 e 12 não têm `subtitle` (nos ids 3, 4 e 10 o campo não existe; nos ids 1, 8 e 12 vale `null`). Todos têm `tags`. O campo `supplierLink` não existe mais no catálogo público e não vai ao navegador: os links de fornecedor ficam numa fonte privada mantida pelo painel admin (outro repositório, privado), ligada ao produto pelo id. O histórico do git deste repositório público ainda contém os links antigos (decisão do dono: não reescrever o histórico por ora; tratá-los como já expostos).
- `badge` em uso: `MAIS VENDIDOS`, `PREMIUM`, `NOVO`, `EXCLUSIVO`, `ESGOTADO` (o validador aceita só esses).
- `featured: true` só no id 2 (Refúgio Cozy). `Featured.jsx` (e `FeaturedScene` no mobile) mostra o primeiro produto com `featured === true` e visível (`getFeaturedProduct`). `featured: false` explícito nos ids 13, 37, 38, 39, 40.
- `cardNote` só no id 20. `originalPrice` nos ids 1, 3, 40.
- `order` não é usado na exibição (o frontend usa `categoryOrder`); mantido porque o painel admin externo depende dele (`docs/TODO.md` item 20).
- `products.js` é reescrito pelo painel admin externo (commits "via painel admin" mexem só nele).
- Busca (`searchProducts` em `lib/catalog.js`, usada por `Products.jsx`): todas as palavras em `name`, `shortName`, rótulos de categoria e `tags`. Grid filtrado ordena pelo maior `categoryOrder` entre as categorias do produto; carrosséis por categoria usam o peso daquela categoria.
- Id 16 está oculto mas tem ficha pronta. O id 44 foi adicionado direto no código (não pelo painel), no mesmo layout de bloco do id 33 (`id:` com 4 espaços, fechamento com 2), compatível com o painel.

**Validador (`scripts/validate-catalog.js`)** roda antes do `vite build` e falha o build em: id duplicado, campo obrigatório ausente, URL de link inválida ou com espaço, link/size ausente, categoria inválida, badge fora do padrão, imagem inexistente em `public/`, `categoryOrder` inválido, divergência de tamanhos entre `prices` e `buyLinks` (exceção: ids 9 e 17). Mantém exceção de `shortName` para ids 3, 4, 10 (desnecessária hoje: `docs/TODO.md` item 27).

## Fichas (`src/data/productDetails.js`)

`PRODUCT_DETAILS`, indexado por id, isolado de `products.js` (o painel admin não o toca). 25 chaves, todas com produto correspondente: 2, 8, 9, 10, 12, 16, 17, 20, 21, 26, 28, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46. O id 46 (Guia Élan Trama) tem `gallery` de 5 fotos, `specs` com 7 chaves (incluindo `alcaDeMao`), `careInstructions`, `faq` de 6 perguntas e `warranty`; sem `sizeChart`, `howToChooseSize`, `whatsIncluded` e `sizeGuideNote` por falta de dados.

Sem ficha: 16 produtos (1, 3, 4, 13, 14, 15, 18, 19, 22, 24, 25, 27, 29, 30, 31, 32); 6 deles visíveis (13, 14, 24, 25, 30, 31) e abrem a ficha simples (`docs/TODO.md` item 8). Sem `gallery`: só o id 34.

Schema (10 campos, todos opcionais): `gallery`, `specs{}`, `sizeChart[{size,height,length,width,weight}]`, `howToChooseSize`, `sizeGuideNote`, `whatsIncluded[]`, `careInstructions`, `airTravelNote`, `warranty`, `faq[{question,answer}]`. `sizeGuideNote` em uso nos ids 2, 9, 28, 34, 41, 42, 43. `docs/PRODUCT_EXPANSION.md` documenta o schema.

- `src/data/specLabels.js` define `SPEC_LABELS` (75 entradas, usado pela ficha desktop e pela mobile); toda chave nova de `specs` exige label (hoje nenhuma está sem).
- Toda linha de `sizeChart` precisa das 5 chaves (usar `'—'` quando não se aplica); hoje todas estão completas.
- Fichas completas (10 campos, com `warranty`): ids 41 e 42. O id 43 tem ficha de 6 campos (`gallery` de 5 fotos, trocadas em 2026-11-17; `specs`, `sizeGuideNote`, `whatsIncluded`, `careInstructions`, `faq`; sem `sizeChart`, `howToChooseSize`, `airTravelNote`). O id 33 tem ficha de 6 campos (`gallery`, `specs`, `sizeChart`, `howToChooseSize`, `whatsIncluded`, `faq`; sem `careInstructions`, `airTravelNote`, `sizeGuideNote`). O id 44 (Peitoral Élan Signature) tem ficha de 6 campos (`gallery` de 4 fotos (principal + `-2`, `-3`, `-4`; a principal é a antiga foto `-5`), `specs` com `cor` única (marrom escuro, costuras caramelo), `medidas` (só o G: tórax 70 cm, informado pelo fornecedor) e `ferragens` douradas, `howToChooseSize`, `whatsIncluded`, `careInstructions`, `faq`; sem `sizeChart` por falta da medida do M). Fotos `-2` e `-4` com ferragens douradas (fotos finais). Id 2 tem ficha com `sizeChart` vazio e orientação por peso. O id 45 (Porta-Saquinhos Premium Élan) tem ficha de 5 campos (`gallery` de 4 fotos, `specs` com 7 chaves, incluindo `aberturaDispensadora`, `whatsIncluded` (o rolo de saquinhos das fotos é ilustrativo e não acompanha), `careInstructions`, `faq` de 6 perguntas; sem `sizeChart`, `howToChooseSize`, `airTravelNote` e `sizeGuideNote` por falta de dados).
- Ordem dos acordeões fixa (desktop: array montado por `detailSections` em `ProductPage.jsx`): specs → sizeChart → howToChooseSize → sizeGuideNote → whatsIncluded → careInstructions → airTravelNote → warranty → faq. No desktop o primeiro existente abre por padrão e cada item abre/fecha sozinho; no mobile, todos fechados.
- `warranty` (2026-11-20): as 25 chaves de `PRODUCT_DETAILS` têm a mesma frase padrão do advogado (2026-11-19): "Garantia legal de 90 dias contra defeitos de fabricação, a contar do recebimento, conforme o art. 26 do CDC." A garantia contratual de 6 meses só volta onde o fornecedor confirmar (`docs/TODO.md` item 37). O acordeão "Garantia" aparece quando o campo existe, então hoje aparece em todas as fichas.

Produtos citados:

- **Élan Couro (9):** `buyLinks` PP/M/G, sem `prices`, galeria de 5 fotos; ficha com `specs` 4, `whatsIncluded` 3, `sizeGuideNote`; sem `sizeChart`.
- **Refúgio Majestá (38)** (nome com "á"): R$ 999,90, `buyLink` único, badge `NOVO`, 2 fotos; ficha com `specs` 9, `whatsIncluded` 4, `careInstructions`.
- **Refúgio Cozy (id 2):** P/M/G/GG de R$ 394 a R$ 697, links `wa.me`, `featured: true`, 2 fotos, ficha de 9 campos. "Como escolher o tamanho" tem renderização própria (introdução, lista e parágrafos).
- **Comedouro Maison Élevé (16):** `visible: false`; 800ml/1200ml/1800ml com preço e link; 4 fotos; ficha com `specs` 12 e `sizeChart` 3.

## Imagens

Convenção: `public/images/products/<slug>/principal.webp` + `<slug>-2.webp`, `-3`, ... Todos os 41 produtos usam `principal.webp`; todos os arquivos referenciados existem. O slug é o nome da pasta, normalmente derivado do `name` (ex.: `kit-elan-rosa`, `bolsa-aurea-voyage`); há pastas legadas fora do padrão (`espreguicadeira-madeira-dobravel/`, `cama-suspensa-rattan-aura/` com `01.webp`…, `manta-serenity-petluxo-premium/` com prefixo `manta-serenity-`). `.gitkeep` em `products/` e `brand/` (`brand/` vazia). Fotos de produto devem ser WebP de verdade (não PNG com extensão `.webp`) e ter ~150 KB no máximo, mas esse limite não é validado nem cumprido (24 dos 102 `.webp` de produto passam de 150 KB, contagem de 2026-11-19); nenhum arquivo em `public/images` ou `assets` passa de 500 KB, exceto `public/og-image.png` (1,8 MB, PNG 1536×1024, mantido para links e prévias antigas). A prévia de compartilhamento usa `public/og-image.jpg` (JPEG sRGB 1200×630, 73 KB); `index.html` aponta `og:image` e `twitter:image` para `https://www.petluxostory.com.br/og-image.jpg` e tem `og:image:type`, `og:image:width`, `og:image:height` e `og:image:alt`. Como o painel converte as fotos: `docs/TODO.md` item 24.

`assets/` tem só `logo.webp` (usado pelo `MobileHeader` e pelo `MobileFooter`). As fotos antigas da Hero (`assets/hero/image-hero.webp`) e do Sobre nós (`assets/sobre_nos/*.webp`) foram apagadas em 2026-11-23 (zero referências em `src/`): o desktop novo usa arte em código.

**Entrada de fotos de produto novo:** `_incoming/` (na raiz, ignorada via `.gitignore`; a pasta existe só localmente) é a pasta onde as fotos chegam. Fluxo: criar `public/images/products/<slug>/`; converter com `cwebp -q 82 <entrada> -o <saida>` (sem redimensionar); a foto cujo nome começa com "principal" vira `principal.webp` e as demais viram `<slug>-2.webp`, `<slug>-3.webp`, … em ordem alfabética; conferir com `file` (deve dizer `Web/P image`). Depois da conversão e da conferência com `file`, os originais de `_incoming/` são apagados e a pasta fica vazia, pronta para o próximo produto (exceto `_incoming/desktop_desing/`, referência do desenho desktop). `cwebp` está instalado em `/usr/bin/cwebp`.

## Layout desktop (≥ 768px)

Já está no ar (commitado e publicado em produção em 2026-11-24). Porte do desenho aprovado em 2026-11-23 (`docs/TODO.md` item 40; descrição completa em `docs/DESIGN_SYSTEM.md` §15). O mobile não mudou: comparação com o commit anterior (`09d3b01`) em 375, 390 e 767px (rotas `/`, `/produtos`, `?categoria`, `/buscar`, `/produto/2`, `13`, `34`, políticas e 404, com e sem banner): HTML, estilo computado e geometria idênticos (as capturas diferem só em antialiasing de texto). Nada em `src/components/mobile/` foi editado.

**Regras deste layout:** nada em `src/components/mobile/` é editado para o desktop; arquivos compartilhados (`variables.css`, `globals.css`, `buttons.css`, `main.jsx`, `siteContent.js`, hooks, lib) só recebem adições que não alteram o mobile; textos vêm de `src/data/`; CSS Modules em camelCase com no máximo 2 níveis; `@keyframes` no módulo que os usa; sem `!important` e sem `:global()`; estado em React + classes; timeouts limpos no unmount; `prefers-reduced-motion` zera animações com um bloco no fim de cada módulo; `transform-box: fill-box` (nunca `view-box`).

**Tokens novos (`variables.css`):** `--bege-deep` #D9CBB9, `--dourado-claro` #E3CE96 (parada clara dos degradês das artes, pela classe `.stopLight` de `art.module.css`, e olhos do gato do 404), `--nav-h` 84px (as páginas usam `padding-top: var(--nav-h)`; seções com âncora, `scroll-margin-top`).

**Globais:** `buttons.css` reescrito (o mobile não usa `.btn`): `.btn` pílula de 52px em JetBrains Mono 12px caixa alta, `btn-primary`, `btn-ghost`, `btn-outline`, `btn-gold`, `btn-raised`, `btn-sm`, `btn-full`, `.wa-icon`. `globals.css`: foco visível (2px vinho, offset 3px), `.reveal` sem transição e `scroll-behavior: auto` com movimento reduzido, os três só em `@media (min-width: 768px)` (o mobile não muda); `.reveal.in` solta o `will-change`; as classes globais antigas do desktop (`.eyebrow`, `.serif`, `.italic`, `.gold`, `.gold-text`, `.hairline`, `.section-pad`, `.section-tag`) foram removidas (sem uso; o mobile nunca usou). Restam `.wrap`, `.grain` (o elemento `<div class="grain">` está no `index.html` e aparece em produção; o DevTweaks só o liga/desliga em dev) e `.reveal`.

**Constantes novas em `siteContent.js`** (bloco "Layout desktop" no fim): `BRAND`, `CONTACT`, `NAV_TEXT`, `NAV_LINKS`, `HERO_DESKTOP`, `HERO_META`, `TRUST_STRIP_LABEL`, `FEATURED_TEXT`, `STORY_PILLARS`, `STORY_ART`, `DIFFERENTIALS_TITLE`, `CTA_TEXT` (inclui a mensagem do WhatsApp da CTA), `FAQ_DESKTOP`, `PRODUCT_PAGE_TEXT`, `BRAND_SEAL`, `FOOTER_DESKTOP`, `POLICY_TEXT`, `NOT_FOUND_TEXT`. O desktop também usa `HERO`, `STORY`, `DIFFERENTIALS`, `DIFFERENTIALS_TAG`, `FAQ_TEXT`, `FAQS`, `TROCA_ANSWER`, `FOOTER`, `POLICY_LINKS`, `WA_MESSAGES`, `DELIVERY_NOTE`. Textos ainda fixos no JSX desktop: rótulos de Products ("NOSSOS PRODUTOS", "Tudo que o seu pet precisa.", "Buscar produtos..." e o `aria-label` da busca, "Mais Vendidos", "Ver mais produtos"/"Ver menos", fim de categoria, estado vazio), "VIA WHATSAPP" (`ProductCard.jsx`), "CONSULTAR VIA WHATSAPP" e "ESGOTADO" (`ProductBuyButton.jsx`), os cabeçalhos da tabela de medidas (`ProductPage.jsx`), títulos dos acordeões da ficha, os `aria-label` da galeria ("Foto anterior", "Próxima foto", "Ampliar foto") e do carrossel ("Anterior", "Próximo", "Página N"), "Garantias de compra" e os rótulos das garantias (`TrustBadges.jsx`) e os corpos das 4 políticas.

**Componentes:**

- `ui/BrandMark` (medalha "PL" + "PetLuxo"), `ui/SectionTag` (rótulo "02 —— TEXTO"), `lib/text.js` (`splitLastWord`, para o itálico na última palavra).
- Navbar: fixa, blur depois de 24px; marca, `NAV_LINKS` (Coleção, Sobre nós, Diferenciais, Contato, Dúvidas → `#produtos`, `#sobre`, `#diferenciais`, `#contato`, `#faq`), "Falar no WhatsApp" (`WA_MESSAGES.general`); 1024–1179px compacta; abaixo de 1024px gaveta com hambúrguer (Esc fecha e devolve o foco ao hambúrguer; clicar ou tocar fora da gaveta, ou num link dela, também fecha). MinimalNavbar: marca + WhatsApp. Footer: faixa escura com marca, frase, WhatsApp, Políticas (4 links + "Preferências de cookies"), Contato (e-mail, Instagram) e linha legal.
- Hero: texto de `HERO`, "Ver produtos" (#produtos), "Conheça a PetLuxo" (#sobre), `HERO_META`, arte em arco (medalha, cachorro, gato) com botões transparentes: hover/foco animam, clique reage (a medalha alterna "PL" e patinha; o clique reinicia o tranco e o giro por contador, sem remontar, e a face troca na metade do giro). O hover da Hero, da CTA e da campainha do FAQ vem de `hooks/useHoverState.js`: mouse por `pointerenter`/`pointerleave`, teclado por foco visível e toque como estado temporário de 1,6s (sem hover preso no iPad). `TrustStrip`: faixa com os 4 títulos de `DIFFERENTIALS`.
- Featured: foto quadrada (`cover`) com o gato espiando, rótulo, nome com itálico vinho em "PetLuxo™" ou na última palavra, subtítulo, descrição do produto (`product.description`, `line-clamp` de 4 linhas em ≥ 1024px e 3 em 768–1023px; o texto completo fica na ficha), WhatsApp (`WA_MESSAGES.product`) e menor preço ("A PARTIR DE" quando há `prices`). O destaque é clicável: o título e a foto são dois `Link`s para `/produto/:id` (o da foto com `aria-hidden` e `tabIndex={-1}`; hover discreto: título vinho e leve zoom na foto, desligados com movimento reduzido); o WhatsApp é um link externo independente. Ordem de Tab: título, WhatsApp.
- Products: mesma lógica de antes; "Ver mais produtos / Ver menos" na linha dos filtros (`aria-expanded`; recolher rola ao topo, sem animação com movimento reduzido); busca com contorno vinho no foco; pills com `aria-pressed`, quebram linha e, abaixo de 900px de altura (de 768 a 1023px de largura, até 969px), viram uma linha com rolagem horizontal; abaixo de 760px de altura o padding, o título e o palco dos cards diminuem (`--stage-ratio` 3:2) e abaixo de 680px mais um passo (16:9); `CategorySelector` mantido só para ≤ 640px. ProductGrid: perView 3/2/1, swipe 50px, pontos de 44 × 44px de área no cabeçalho, setas laterais, geometria por variáveis CSS (`--n`, `--pv`, `--i`), poucos produtos centralizados; o foco num card de outra página leva o carrossel a essa página e zera o `scrollLeft` do viewport; os títulos dos carrosséis são h3 sob o h2 da home e h2 sob o h1 de `/produtos` (`titleAs`). ProductCard: `Link` para `/produto/:id`, palco 4:3 `contain` (ou `--stage-ratio`), preço riscado, badge, `cardNote`, "VIA WHATSAPP".
- Story: arte "curadoria" (4 pilares de `STORY_PILLARS` como botões `aria-pressed`, legenda "Curadoria · 0N / 04") + textos de `STORY`. Differentials: seção escura, lista em acordeão (um aberto, o primeiro por padrão) + 4 medalhas num trilho. CTA (`id="contato"`): anéis, `CTA_TEXT`, cachorro e gato reagindo ao hover/foco dos botões. FAQ (`id="faq"`): campainha + gato (clique toca), 7 `FAQS` em acordeão de um item com o primeiro aberto, contato "Tem outra dúvida?".
- Ficha: "Voltar para a loja" (Link para "/"), galeria (`key={product.id}`: trocar de produto reinicia a foto; miniaturas verticais, foto 5:4, setas, contador, zoom 1.35 por hover com origem no cursor; lightbox em toque, que abre também por Enter/Espaço; a lupa alternável saiu), preço, seletor em pílulas, abas Descrição/Destaques (WAI-ARIA), `ProductBuyButton`, `DELIVERY_NOTE`, `TrustBadges` (4 garantias com ícones), faixa `BrandSeal` (textos em `BRAND_SEAL`, ícones SVG no lugar dos emojis), "Detalhes da peça". `Accordion`: ícone "+" que gira; painel fechado fora do Tab.
- Políticas: `PolicyLayout.module.css` (sem estilos inline); coluna lateral fixa ao rolar (`<nav>` "Navegação das políticas"; o rodapé é "Políticas") com as 4 políticas como `NavLink` (`aria-current="page"`) e o cartão "Ficou com dúvida?" (e-mail e WhatsApp com `CONTACT.phoneDisplay`; links com 44px de altura); h1, data, cartões 7 e 90 (`HIGHLIGHTS`, antes do corpo) e o corpo de cada página sem alteração. Abaixo de 1024px a coluna lateral vira faixa no topo.
- 404: "4 [medalha] 4" + gato (clique vira a medalha), "Voltar para a home" e "Ver produtos". Abaixo de 560px de altura (celular deitado) a arte e o botão da medalha saem (`display: none`; título, texto e botões ficam).
- Arte compartilhada em `ui/art/`: `Dog` e `Cat` (coordenadas da Hero, reaproveitados pela CTA), `Medal` (`hover`, `kick`, `flipped`), `Sparkle`, `PeekingCat`, `useSvgId` (ids únicos para gradientes), `art.module.css` (keyframes, inclusive as cópias `swingB`/`flipxB` que reiniciam a medalha, e `.stopLight`). Artes de uso único ficam nas seções.

**Altura (requisito: cada seção da Home cabe na altura útil, viewport − `--nav-h`)**, medida com Playwright no build de produção (tabela completa em `docs/DESIGN_SYSTEM.md` §15.2). Cabem todas as seções em 1920 × 1080, 1440 × 900, 1366 × 800, 1366 × 720, 1440 × 720, 1920 × 720, 2560 × 720, 1280 × 720, 1180 × 820, 1024 × 768, 820 × 1180, 768 × 1024 e 768 × 900 (maiores: Produtos 729px em 1440 × 900, 640px em 1180 × 820 contra 736 úteis, 591px em 1366 × 720 contra 636; Hero 596px sem a Navbar; Destaque 564px em ≥ 1024px e 555px em 768 × 1024). Limites reais: 768 × 720 (Hero 648 e Sobre nós 685 contra 636; tamanho sem aparelho real) e alturas de tela abaixo de ~700px (Sobre nós, Diferenciais e FAQ têm 576–620px; ex.: 1366 × 657, 1093 × 614 = zoom de 125% em 1366 × 768, 960 × 600 = zoom de 150% em 1440 × 900), onde a página rola, sem quebrar o layout (sem rolagem horizontal, sobreposição ou texto cortado).

**Desvios do desenho (conscientes):** Navbar fixa com blur (o desenho é estático) e WhatsApp abrindo o `wa.me` (o desenho aponta âncoras); Hero com "Ver produtos" (texto existente; o desenho diz "Ver a coleção") e com `HERO_META` abaixo dos botões (não está no desenho); Destaque com o rótulo existente "Produto em destaque" e o botão "Consultar via WhatsApp" no lugar de "Ver peça", sem "Ver todos os produtos" (a descrição aparece, o desenho não a tem); itálico de destaque em vinho (o desenho usa vinho; o dourado sobre o off-white não chega a 3:1 de contraste); Produtos com preço riscado e fim de categoria (fora do desenho, mantidos), sem o "Ver menos" no fim da lista e com a regra de altura das pills; ids `#produtos`/`#faq` no lugar de `#colecao`/`#duvidas`; rodapé com Contato e "Preferências de cookies"; ficha com acordeões independentes (o desenho abre um por vez), setas que param nas pontas e zoom que segue o cursor; cartões 7/90 antes da introdução (a introdução faz parte do corpo JSX da política, que não muda); banner a 32px da base, sem aviso "Preferência salva"; em 768–1023px as seções ficam em duas colunas mais estreitas em vez de empilhar.

**Pendências:** conferir em iPad e Safari reais (arte com `transform-box: fill-box`, `svh`, sticky das políticas, hover por toque); aprovação da dona do negócio para os textos novos de marketing vindos do desenho; focus trap do banner de cookies (`aria-modal` sem prender o foco, já era assim); última página dos carrosséis com um card só (fórmula antiga); `#faq` (ou outro hash) que permanece na URL ao clicar no logo; âncoras da Navbar fora da home; circunflexo deslocado da Cormorant no Chromium (desktop e mobile, vem da fonte); `ui/CategorySelector.jsx` e o `useIsMobile(640)` da `ProductGallery` estão mortos na prática (só agem abaixo de 640px, onde o mobile assume) e foram mantidos.

## Componentes (comuns e mobile)

- **`ProductCard`:** sempre navega para `/produto/:id` (desktop e mobile: `Link`); não existe modal de produto.
- **`useProductBuy`:** `selectedSize` inicial = primeiro `buyLinks[].size`; deriva `activeBuyLink` e `activePrice` por igualdade de `size`.
- **`ProductSizeSelector`:** tamanho ou cor (`variationType === 'cor'`, swatch via `color`).
- **`ProductLightbox`:** `yet-another-react-lightbox` + plugin `Zoom`, `maxZoomPixelRatio: 2`, `scrollToZoom: false`.
- **`CategorySelector`:** bottom sheet (`Escape`, congela o body com `position: fixed`), só abaixo de 640px.
- **`ScrollToTop`:** `scrollTo` instantâneo imediato + `requestAnimationFrame`.
- **`globals.css`:** `scroll-behavior: smooth` (`auto` com movimento reduzido a partir de 768px; o `scrollIntoView` e o `scrollTo` do desktop também respeitam `usePrefersReducedMotion`), `overflow-anchor: none`; o pinch-zoom é livre (sem `touch-action: pan-x pan-y` nem bloqueio de `gesture*`; `index.html` usa `viewport-fit=cover`). Carrosséis e galeria usam `touch-action: pan-y pinch-zoom`. `html.m-bottom-bar body` reserva `--m-bar-h` para as barras fixas do mobile.
- **Mobile (`src/components/mobile/`):** ver `docs/DESIGN_SYSTEM.md` §14. Home em um único contêiner com `scroll-snap` e trilha dourada; folhas e visualizador usam `useModalFocus` (`#app` inerte, foco preso, Esc); conteúdo de FAQ/acordeões fica no DOM com `hidden="until-found"` (`useHiddenUntilFound`); `useReserveBottomBar` reserva o espaço da barra inferior; animações infinitas e o avanço automático das histórias param com `prefers-reduced-motion`.
- **`lib/catalog.js`:** regras compartilhadas de visibilidade, ordem (`categoryOrder`), mais vendidos, destaque, busca e preço. **`data/siteContent.js`:** fonte única dos textos institucionais (hero, história, diferenciais, FAQ, rodapé, políticas, constantes do desktop); **`data/specLabels.js`:** `SPEC_LABELS`. **`lib/productMessage.js`:** mensagem do WhatsApp por produto.
- **`icons.jsx`:** só o desktop usa; exporta `Icon` com ícones de traço decorativos (`aria-hidden`): `Search`, `Wa` (balão), `ArrowR`, `ArrowL`, `ArrowDown`, `Plus`, `Shield`, `Truck`, `Star`, `Heart`, `Rays`, `Lock`, `Return`, `Box`, `Chevron` (só `CategorySelector`), `Close`. O mobile usa `mobile/MobileIcons.jsx`.
- **`DevTweaks`:** `React.lazy` só em `import.meta.env.DEV`; controla tom de acento e textura de grão.
- Páginas de política: o corpo de cada texto fica na própria página (`PolicyLayout` + `Section`; mobile: `MobilePolicyLayout` com chips entre as 4 políticas). Em `ReturnPolicyPage.jsx`, a constante `HIGHLIGHTS` (cartões "7" e "90", desktop e mobile) copia prazos do texto e precisa ser atualizada junto com ele após revisão jurídica (`docs/TODO.md` item 39). As 4 políticas têm os textos finais do advogado (2026-11-19; fonte em `_juridico/textos-finais-2026-11-19.md`) e dizem "Última atualização: novembro de 2026". A Privacidade traz a identificação do controlador (razão social, CNPJ, endereço e canal de privacidade), transferência internacional (WhatsApp/Meta, Google, PagBank, Cloudflare, distribuidor parceiro, autoridades), cookies e GA4 com base no consentimento, prazos de retenção, direitos I a X do art. 18 da LGPD, menores de idade e alterações. Frete e Entrega, Termos de Uso e Troca e Devolução seguem o texto do advogado (arrependimento em 7 dias com frete de devolução da PetLuxo; defeito em 90 dias; foro do domicílio do consumidor). No FAQ, `TROCA_ANSWER` não menciona embalagem original.
- `FAQ.jsx` (e `FaqScene` no mobile): 7 itens em `FAQS` (`data/siteContent.js`) (o item "Posso trocar o produto?" usa `a: null` e renderiza `TROCA_ANSWER`).
- Tokens z-index em `variables.css`: `--z-base`, `--z-dropdown`, `--z-navbar`, `--z-overlay`, `--z-modal`, `--z-above-modal`. Cor: `--vinho` #6B1E2B, `--caramelo` #B08968, `--ink` #2A2522, `--dourado` #C6A96B (mais os tokens desktop acima e os `--m-*` do mobile). Fontes: Cormorant Garamond, Inter, JetBrains Mono.

## Convenções CSS (de `docs/CSS_MIGRATION.md`)

CSS Modules em camelCase; todos os `.module.css` são importados; nenhum bloco passa de 2 níveis. `@keyframes` usados por módulo estão declarados no próprio módulo (desktop: `Hero`, `Products`, `Story`, `Differentials`, `CTA`, `FAQ`, `NotFound`, `AnalyticsConsent`, `ui/art/art.module.css`); não existe arquivo global de keyframes. `.btn` e variantes ficam em `buttons.css` (importado por quem usa botões). Não há `:global()` no CSS. Estilos inline no desktop: só valores dinâmicos (atraso de animação, variáveis do carrossel e do zoom, cor do swatch) e os do corpo das páginas de política (parágrafo de introdução e a lista dos direitos da Privacidade), que fazem parte do texto e não mudam.

## Segurança

Nenhum segredo no repositório. `.env`, `.env.local`, `dist`, `test-results/`, `.wrangler/` e `.dev.vars` estão no `.gitignore`; só `.env.example` (nome da variável) é tracked. Dados públicos intencionais: ID do GA4, telefone do WhatsApp, CNPJ no rodapé. Os links de fornecedor não estão no repositório atual nem no bundle (ficam na fonte privada do painel admin), mas o histórico do git ainda os contém e devem ser tratados como já expostos (`docs/TODO.md` item 3/18). O repositório é público porque as miniaturas do painel usam `raw.githubusercontent.com` (`docs/TODO.md` item 23).

## Variáveis de ambiente

Única: `VITE_WHATSAPP_PHONE` (opcional; `.env.local`, `.env.example`; fallback hardcoded em `whatsapp.js`). A produção não define variáveis de ambiente: usa o número padrão do código.

## Documentação do repositório

`docs/DESIGN_SYSTEM.md` (retrato do design: tokens, componentes, §14 layout mobile, §15 layout desktop atual; as seções 2 a 13 retratam o desktop anterior e valem só no que a §15 não cobre; em divergência, o código vale), `docs/CHECKOUT_ARCHITECTURE.md` (plano, não iniciado; precisa ser reescrito para InfinitePay com frete grátis: TODO 26), `docs/CLOUDFLARE_MIGRATION.md` (migração, estado por fase, registro de execução), `docs/CSS_MIGRATION.md`, `docs/DEPLOY.md` (deploy e domínio na Cloudflare), `docs/PRODUCT_EXPANSION.md`, `docs/README.md` e `README.md`, `docs/DECISIONS.md` (seções 10 e 11 superadas pela 12: atendimento só por WhatsApp, PagBank provavelmente não volta, intenção de checkout próprio com InfinitePay e frete grátis, ainda não definitivo; seção 8 superada pela 13: hospedagem na Cloudflare, repositório público por causa das miniaturas do painel, cartão só por checkout hospedado), `docs/TODO.md` (lista de pendências).

## Dívidas e pendências abertas

- Sem script de lint (ESLint não está instalado); sem script npm para os testes Playwright (`docs/CLOUDFLARE_MIGRATION.md` F2.6).
- Migração: resta o teste real de troca de foto pelo painel em aba anônima (`docs/TODO.md` item 31, parte B(ii)). As Preview URLs seguem sem confirmação direta por `curl`. Ver `docs/CLOUDFLARE_MIGRATION.md`.
- Textos legais: os finais do advogado estão aplicados (2026-11-20). Resta o que depende da dona do negócio (frete de devolução, rastreio, eliminação dos dados de entrega, garantia de 6 meses dos ids 10, 2 e 8, conferir CNPJ e razão social, porte da empresa) e a revisão de texto de "Entrega Rastreada" (`TrustBadges.jsx`, ficha desktop), "rastreamento garantido" (corpo de `DIFFERENTIALS[2]`, só na seção Diferenciais; a faixa de confiança mostra apenas os títulos) e "Quando existir…" (`FAQS[1]`): `docs/TODO.md` item 37.
- Checkout próprio (InfinitePay, frete grátis) e reescrita de `docs/CHECKOUT_ARCHITECTURE.md`: `docs/TODO.md` itens 21 e 26.
- Eventos GA4 de clique no WhatsApp: `docs/TODO.md` item 6.
- SEO por produto: Worker validado em produção em 2026-11-17 (`curl` e prévia do WhatsApp; `og:image` WebP vertical funciona). Pendem: soft 404 fora de `/produto/*`, título que não muda na navegação interna, políticas sem meta própria, `/buscar` com `noindex` só no cliente e JSON-LD (`docs/TODO.md` itens 1, 2 e 10).
- Ids 9 e 17 com link de fornecedor errado herdado: a mãe corrige pelo painel; reescrita do histórico do git (links antigos) segue como decisão futura e aberta (`docs/TODO.md` item 3/18).
- Fichas dos 6 produtos visíveis sem ficha (13, 14, 24, 25, 30, 31): `docs/TODO.md` item 8.
- Obrigatoriedade de `buyLink`/`buyLinks` no catálogo (validador, `useProductBuy`, seletor de tamanho, `ProductPage`, painel admin), não iniciada: `docs/TODO.md` item 38.
- Privatizar o repositório e rotacionar o token do painel: `docs/TODO.md` itens 23 e 25.
- PNG com extensão `.webp` nas galerias: `docs/TODO.md` item 24.
- Desktop novo (item 40, commitado e publicado em produção em 2026-11-24, com a revisão de 2026-11-24 aplicada): falta a conferência em iPad e Safari reais; ver as pendências em "Layout desktop". Testar o mobile em aparelhos reais: item 41.
- Plano da Vercel para o painel admin (item 32), renovação do domínio (item 33) e achados da auditoria do painel (item 34): `docs/TODO.md`.
