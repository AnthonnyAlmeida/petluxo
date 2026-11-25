<div align="center">

# PetLuxo

### Plataforma de e-commerce premium para pets — identidade sofisticada, performance moderna.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.4.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS Modules](https://img.shields.io/badge/CSS-Modules-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

**[→ Ver em produção](https://www.petluxostory.com.br)**

</div>

---

## Preview

> Screenshots e demo em: **[www.petluxostory.com.br](https://www.petluxostory.com.br)**

O PetLuxo é um site institucional de e-commerce construído com foco em identidade visual premium, experiência de compra fluida e performance. A estética remete ao universo de marcas de luxo — tipografia serifada, paleta em tons terrosos (vinho, dourado, caramelo) e layout minimalista com atenção a cada detalhe.

---

## Sobre o Projeto

PetLuxo apresenta um catálogo de produtos premium para pets com foco em camas, sofás, acessórios de couro, coleiras e comedouros sofisticados. O objetivo é converter visitantes em compradores através de uma experiência visual diferenciada e de atendimento e fechamento por WhatsApp (os links de pagamento PagBank estão cadastrados, mas o botão "Comprar Agora" está oculto).

**Destaques:**
- Site 100% estático — zero backend, zero banco de dados
- Deploy automático via GitHub + Cloudflare Workers (static assets)
- Performance otimizada: bundle JS ~342KB (105KB gzip), CSS ~55KB (11KB gzip)
- Arquitetura baseada em componentes React com CSS puro e design system próprio

---

## Funcionalidades

| Recurso | Descrição |
|---|---|
| 🛍️ **Catálogo dinâmico** | 41 produtos em 9 categorias (29 visíveis), carregados de um arquivo `products.js` centralizado |
| 🎠 **Carrosséis por categoria** | Um carrossel por categoria com setas laterais, dots de paginação e swipe touch |
| 📱 **Layout mobile próprio** | Abaixo de 768px o site usa componentes próprios (home em cenas, catálogo, busca, ficha); a partir de 768px o layout desktop novo (home, `/produtos`, ficha, políticas, 404 e banner de cookies; descrição em `docs/DESIGN_SYSTEM.md` §15) |
| 💳 **Links PagBank** | Cada produto mantém `buyLink` / `buyLinks`, mas o botão "Comprar Agora" está oculto por `HIDE_BUY_CTA` em `ProductBuyButton.jsx` |
| 💬 **Consulta via WhatsApp** | CTA ativo "Consultar via WhatsApp", com mensagem pré-preenchida (nome, variação, preço e link da ficha) |
| 📱 **Totalmente responsivo** | Dois layouts: desktop a partir de 768px (do iPad retrato a 2560px; Navbar com gaveta abaixo de 1024px) e mobile abaixo de 768px (componentes próprios) |
| ✨ **Animações de scroll** | Reveal de elementos com `IntersectionObserver` (sem parallax); arte animada em SVG com CSS (hover, foco e toque), parada com `prefers-reduced-motion` |
| 🔎 **SEO básico** | Open Graph completo, Twitter Card, sitemap.xml gerado no build, meta tags por produto via Worker, robots.txt, GA4 com consentimento |
| ⚡ **Performance** | Build em ~5s, hot reload instantâneo, DevTweaks excluído do bundle de produção |

---

## Tecnologias

| Tecnologia | Versão | Função |
|---|---|---|
| **React** | 18.3.1 | Interface declarativa com hooks e componentes |
| **Vite** | 6.4.2 | Bundler ultrarrápido e servidor de desenvolvimento |
| **JavaScript** | ES2022 | Lógica de negócio, estado e interatividade |
| **CSS Modules** | — | Design system proprietário, sem frameworks de UI; estilos scoped por componente |
| **@fontsource** | ^5.3.0 | Cormorant Garamond · Inter · JetBrains Mono hospedadas no próprio site (subset latin, importadas em `src/main.jsx`); sem requisição ao Google Fonts |
| **React Router** | ^7.15.0 | Rotas da home, fichas `/produto/:id` e páginas de política |
| **yet-another-react-lightbox** | ^3.32.2 | Lightbox com zoom, carregado sob demanda em dispositivos touch |
| **Google Analytics** | GA4 | `gtag.js` carregado por `src/lib/analytics.js` somente depois do consentimento do visitante |
| **Playwright** | ^1.49.0 (devDependency) | Testes de consentimento do GA4 em `tests/` |
| **Cloudflare Workers** | Free | Hospedagem estática e deploy automático via Git (Workers Builds) |

---

## Arquitetura

```
petluxo/
├── index.html               # Shell HTML — meta tags e OG (GA4 não fica aqui: carrega por src/lib/analytics.js)
├── public/
│   ├── og-image.jpg         # Capa 1200×630 usada nas meta tags (og:image / twitter:image)
│   ├── og-image.png         # Arte original 1536×1024, mantida (links e prévias antigas)
│   ├── robots.txt (o sitemap.xml é gerado pelo build em dist/)
│   └── images/products/     # Fotos dos produtos
├── src/
│   ├── app/
│   │   ├── page.jsx         # Rotas + HomePage
│   │   ├── ScrollToTop.jsx
│   │   └── DevTweaks.jsx    # Painel de ajustes (só em dev)
│   ├── components/
│   │   ├── layout/          # Navbar (hambúrguer mobile) · MinimalNavbar · Footer
│   │   ├── product/         # ProductCard · ProductGrid · ProductGallery · ProductLightbox · ProductSizeSelector · ProductBuyButton
│   │   ├── sections/        # Hero · TrustStrip · Featured · Products · Story · Differentials · CTA · FAQ · NotFound
│   │   ├── pages/           # ProductPage · PrivacyPage · ReturnPolicyPage · ShippingPolicyPage · TermsPage
│   │   └── ui/              # Accordion · AnalyticsConsent · BrandMark · BrandSeal · CategorySelector · SectionTag · TrustBadges · art/ (arte SVG do desktop)
│   ├── data/
│   │   ├── products.js      # ← Fonte de verdade do catálogo
│   │   └── productDetails.js # Fichas expandidas por id
│   ├── hooks/               # useScroll.js (reveal com IntersectionObserver) · useHoverState.js · useProductBuy.js
│   ├── lib/
│   │   ├── whatsapp.js      # Gerador de links wa.me
│   │   └── analytics.js     # GA4 com consentimento
│   └── styles/
│       ├── variables.css    # Design tokens (cores, tipografia, espaçamentos)
│       ├── globals.css      # Reset, utilitárias globais, tipografia e .reveal (166 linhas)
│       └── buttons.css      # Estilos globais de botões (.btn e variantes)
├── worker/                      # Worker de SEO e 404 real (index.js, seo.js)
├── scripts/validate-catalog.js  # Validador do catálogo (roda antes do build)
├── scripts/generate-sitemap.js  # Gera dist/sitemap.xml (roda depois do vite build)
├── scripts/check-seo.js         # Checagens de SEO (npm run test:seo, depois do build)
├── tests/analytics-consent.spec.js  # Testes Playwright (9 testes)
├── playwright.config.js
└── docs/                    # Documentação técnica detalhada
```

---

## Decisões Técnicas

**CSS Modules sem framework**
Controle total sobre o design, bundle enxuto e identidade visual 100% proprietária. Os componentes têm `.module.css` próprio com estilos scoped (44 módulos: 28 do desktop e 16 do mobile). Estilos globais divididos em: `variables.css` (tokens), `globals.css` (101 linhas: reset, `.wrap`, `.reveal`, foco visível do desktop) e `buttons.css` (`.btn` e variantes, importado explicitamente por cada componente que usa botões). Os `@keyframes` ficam nos próprios módulos (por exemplo `Hero.module.css`, `Products.module.css` e `ui/art/art.module.css`).

**Carrossel sem biblioteca externa**
Implementado com React state + `transform: translateX`. Setas laterais usam flexbox (não `position: absolute`) para evitar clipping em containers com `overflow: hidden`. Suporte a swipe touch com detecção de direção e limiar de 50px.

**Folhas e visualizador mobile acessíveis**
A folha de resposta do FAQ e o visualizador de imagem usam `useModalFocus` (`#app` inerte, foco preso, Esc, foco devolvido), sem manipular o body.

**Campo `category` como array**
Cada produto pode pertencer a múltiplas categorias — os filtros usam `.includes(id)`. Isso permite que um produto apareça em "Mais Vendidos" e "Conforto & Estilo" simultaneamente.

**DevTweaks tree-shaken em produção**
O painel de ajustes de design é carregado via `React.lazy` condicionado a `import.meta.env.DEV`. O Vite elimina o import via dead-code elimination no build — zero impacto em produção.

---

## Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/AnthonnyAlmeida/petluxo.git
cd petluxo

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
# → http://localhost:5173

# Para acessar pelo celular na mesma rede
npm run dev -- --host
```

```bash
# Build de produção (validador de catálogo, vite build e geração do sitemap)
npm run build

# Checagens de SEO (exigem o build feito)
npm run test:seo

# Só validar o catálogo
npm run validate:catalog

# Preview local do build
npm run preview
```

**Testes:** `tests/analytics-consent.spec.js` (9 testes Playwright do consentimento GA4) e `playwright.config.js`. Não há script npm para executá-los.

---

## Deploy

O deploy é automático a cada `git push` para a branch `main`:

1. Push para `main` no GitHub
2. A Cloudflare (Workers Builds) detecta o push e executa `npm run build`
3. Arquivos da pasta `dist/` são publicados
4. Site atualizado em ~1 minuto em **[www.petluxostory.com.br](https://www.petluxostory.com.br)**

> O repositório continua **público** porque as miniaturas do painel usam `raw.githubusercontent.com`.

---

## Melhorias Futuras

- [ ] SEO avançado com meta tags dinâmicas por produto
- [ ] CMS headless para gerenciamento do catálogo sem código
- [ ] Animações de entrada mais refinadas (Framer Motion ou GSAP)
- [ ] Painel administrativo para atualização de estoque e preços
- [ ] Favicon com a logo oficial da marca

---

<div align="center">

Desenvolvido por **[Anthonny Almeida](https://github.com/AnthonnyAlmeida)**

</div>

