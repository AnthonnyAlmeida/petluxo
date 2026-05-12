<div align="center">

# PetLuxo

### Plataforma de e-commerce premium para pets — identidade sofisticada, performance moderna.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.4.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS](https://img.shields.io/badge/CSS-Pure-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

**[→ Ver em produção](https://petluxostory.com.br)**

</div>

---

## Preview

> Screenshots e demo em: **[petluxostory.com.br](https://petluxostory.com.br)**

O PetLuxo é um site institucional de e-commerce construído com foco em identidade visual premium, experiência de compra fluida e performance. A estética remete ao universo de marcas de luxo — tipografia serifada, paleta em tons terrosos (vinho, dourado, caramelo) e layout minimalista com atenção a cada detalhe.

---

## Sobre o Projeto

PetLuxo apresenta um catálogo de produtos premium para pets com foco em camas, sofás, acessórios de couro, coleiras e comedouros sofisticados. O objetivo é converter visitantes em compradores através de uma experiência visual diferenciada e fluxo de compra direto via PagBank.

**Destaques:**
- Site 100% estático — zero backend, zero banco de dados
- Deploy automático via GitHub + Vercel
- Performance otimizada: bundle JS ~183KB (57KB gzip), CSS ~30KB (6.7KB gzip)
- Arquitetura baseada em componentes React com CSS puro e design system próprio

---

## Funcionalidades

| Recurso | Descrição |
|---|---|
| 🛍️ **Catálogo dinâmico** | 20 produtos em 6 categorias, carregados de um arquivo `products.js` centralizado |
| 🎠 **Carrosséis por categoria** | Um carrossel por categoria com setas laterais, dots de paginação e swipe touch |
| 🔍 **Modal interativo** | Quick view com seletor de tamanho, preço dinâmico e link de compra por variação |
| 💳 **Integração PagBank** | Botão "Comprar Agora" abre link de pagamento direto (`buyLink` / `buyLinks`) |
| 💬 **Fallback WhatsApp** | Produtos sem link de pagamento redirecionam para WhatsApp com mensagem pré-preenchida |
| 📱 **Totalmente responsivo** | Layout adaptado para desktop (≥980px), tablet (≤980px) e mobile (≤768px / ≤480px) |
| ✨ **Animações de scroll** | Reveal de elementos com `IntersectionObserver` e efeito parallax no logo da navbar |
| 🔎 **SEO básico** | Open Graph completo, Twitter Card, sitemap.xml, robots.txt, Google Analytics |
| ⚡ **Performance** | Build em ~5s, hot reload instantâneo, DevTweaks excluído do bundle de produção |

---

## Tecnologias

| Tecnologia | Versão | Função |
|---|---|---|
| **React** | 18.3.1 | Interface declarativa com hooks e componentes |
| **Vite** | 6.4.2 | Bundler ultrarrápido e servidor de desenvolvimento |
| **JavaScript** | ES2022 | Lógica de negócio, estado e interatividade |
| **CSS puro** | — | Design system proprietário, sem frameworks de UI |
| **Google Fonts** | — | Cormorant Garamond · Inter · JetBrains Mono |
| **Google Analytics** | GA4 | Rastreamento de visitas via gtag.js |
| **Vercel** | Hobby | Hospedagem e deploy automático via Git |

---

## Arquitetura

```
petluxo/
├── index.html               # Shell HTML — meta tags, OG, Analytics
├── public/
│   ├── og-image.png         # Capa 1200×630 para redes sociais
│   ├── robots.txt / sitemap.xml
│   └── images/products/     # Fotos dos produtos
├── src/
│   ├── app/
│   │   └── page.jsx         # Componente raiz — orquestra todas as seções
│   ├── components/
│   │   ├── layout/          # Navbar (hambúrguer mobile) + Footer
│   │   ├── product/         # ProductCard · ProductGrid · ProductModal
│   │   ├── sections/        # Hero · Featured · Products · Story · CTA · 404
│   │   └── ui/              # Button · Container · Section (primitivos)
│   ├── data/
│   │   └── products.js      # ← Fonte de verdade do catálogo
│   ├── hooks/useScroll.js   # IntersectionObserver + parallax
│   ├── lib/whatsapp.js      # Gerador de links wa.me
│   └── styles/
│       ├── variables.css    # Design tokens (cores, tipografia, espaçamentos)
│       └── globals.css      # Estilos completos (~1500 linhas)
└── docs/                    # Documentação técnica detalhada
```

---

## Decisões Técnicas

**CSS puro sem framework**
Controle total sobre o design, bundle enxuto e identidade visual 100% proprietária. Toda a estilização vive em `globals.css` com design tokens em `variables.css`.

**Carrossel sem biblioteca externa**
Implementado com React state + `transform: translateX`. Setas laterais usam flexbox (não `position: absolute`) para evitar clipping em containers com `overflow: hidden`. Suporte a swipe touch com detecção de direção e limiar de 50px.

**Modal mobile sem manipular o body**
Scroll interno via `min-height: 0` + `overflow-y: auto` + `overscroll-behavior: contain`. Cabeçalho e botões fixos, apenas o conteúdo rola. Evita bugs de scroll em iOS.

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
# Build de produção
npm run build

# Preview local do build
npm run preview
```

---

## Deploy

O deploy é automático a cada `git push` para a branch `main`:

1. Push para `main` no GitHub
2. Vercel detecta o push e executa `npm run build`
3. Arquivos da pasta `dist/` são publicados
4. Site atualizado em ~1 minuto em **[petluxostory.com.br](https://petluxostory.com.br)**

> O repositório deve permanecer **público** — o Vercel Hobby Plan não faz deploy de repositórios privados.

---

## Melhorias Futuras

- [ ] Páginas individuais de produto com URLs amigáveis
- [ ] SEO avançado com meta tags dinâmicas por produto
- [ ] CMS headless para gerenciamento do catálogo sem código
- [ ] Animações de entrada mais refinadas (Framer Motion ou GSAP)
- [ ] Painel administrativo para atualização de estoque e preços
- [ ] Favicon com a logo oficial da marca

---

<div align="center">

Desenvolvido por **[Anthonny Almeida](https://github.com/AnthonnyAlmeida)**

</div>

