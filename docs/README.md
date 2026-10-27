# PetLuxo — Visão Geral do Projeto

## O que é

PetLuxo é um site institucional de e-commerce de produtos premium para pets (cães e gatos). O site apresenta o catálogo, conta a história da marca e direciona os clientes para consulta via WhatsApp (os links de pagamento PagBank estão cadastrados em cada produto, mas o botão "COMPRAR AGORA" está oculto). Não há carrinho de compras nem backend — é um site 100% estático.

## URLs

- **Produção:** https://petluxostory.com.br
- **Repositório:** https://github.com/AnthonnyAlmeida/petluxo

## Stack

| Tecnologia                 | Versão       | Para que serve                                                                                                             |
| -------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| React                      | 18.3.1       | Interface declarativa com componentes e hooks                                                                              |
| Vite                       | 6.4.2        | Bundler e servidor de desenvolvimento                                                                                      |
| React Router               | ^7.15.0      | Rotas: home, `/produto/:id` e páginas de política                                                                          |
| yet-another-react-lightbox | ^3.32.2      | Lightbox com zoom, carregado sob demanda em dispositivos touch                                                             |
| CSS Modules                | —            | Estilização por componente, sem frameworks de UI; globais em `src/styles/`                                                 |
| Google Fonts               | —            | Cormorant Garamond (serif) + Inter (sans) + JetBrains Mono                                                                 |
| Google Analytics           | G-KKMV5VHR48 | GA4: `gtag.js` só é carregado por `src/lib/analytics.js` depois do consentimento do visitante (`AnalyticsConsent`)         |
| PagBank                    | —            | Links de pagamento cadastrados em `buyLink` / `buyLinks`; o botão está oculto por `HIDE_BUY_CTA` em `ProductBuyButton.jsx` |
| Playwright                 | ^1.49.0      | devDependency; testes de consentimento do GA4 em `tests/`                                                                  |

## Estrutura de pastas

```
petluxo/
├── public/              # Arquivos copiados diretamente para o build
│   ├── favicon.svg      # Ícone da aba do navegador
│   ├── robots.txt       # Instruções para robôs de busca
│   ├── sitemap.xml      # Mapa do site para SEO
│   ├── 404.html         # Página de erro para SPAs (redirect para /)
│   ├── og-image.jpg     # Imagem de capa 1200×630 usada nas meta tags (og:image / twitter:image)
│   ├── og-image.png     # Arte original 1536×1024, mantida (links e prévias antigas)
│   ├── favicon.ico
│   └── images/
│       ├── brand/       # Logo e assets de marca
│       └── products/    # Fotos dos produtos (vão para o git)
├── assets/              # Assets importados pelo Vite (logo, hero)
├── src/
│   ├── app/
│   │   ├── page.jsx     # Rotas e HomePage
│   │   ├── ScrollToTop.jsx
│   │   └── DevTweaks.jsx # Painel de design — carregado apenas em dev
│   ├── components/
│   │   ├── layout/      # Navbar (com menu hambúrguer), MinimalNavbar e Footer
│   │   ├── product/     # ProductCard, ProductGrid (carrossel), ProductModal, ProductGallery, ProductLightbox, ProductSizeSelector, ProductBuyButton
│   │   ├── sections/    # Hero, Featured, Products, Story, Differentials, CTA, FAQ, NotFound
│   │   ├── pages/       # ProductPage e páginas de política (privacidade, troca, frete, termos)
│   │   └── ui/          # Accordion, AnalyticsConsent, BrandSeal, CategorySelector, TrustBadges
│   ├── data/
│   │   ├── products.js  # Catálogo de produtos — fonte de verdade
│   │   └── productDetails.js # Fichas expandidas, indexadas por id
│   ├── hooks/
│   │   ├── useScroll.js # Animações de scroll (IntersectionObserver + parallax)
│   │   └── useProductBuy.js # Tamanho selecionado, link e preço ativos
│   ├── lib/
│   │   ├── whatsapp.js  # Gera links de WhatsApp com mensagem pré-preenchida
│   │   └── analytics.js # GA4 com consentimento (carrega gtag.js só após aceite)
│   ├── styles/
│   │   ├── variables.css  # Design tokens: cores, fontes, espaçamentos
│   │   ├── globals.css    # Reset, utilitárias, tipografia e .reveal (166 linhas)
│   │   └── buttons.css    # .btn e variantes
│   ├── icons.jsx          # Ícones SVG inline (sem biblioteca externa)
│   ├── tweaks-panel.jsx   # Painel de ajustes de design (apenas em dev)
│   └── main.jsx           # Entry point: monta o React no DOM
├── index.html           # Shell HTML principal com as meta tags (sem gtag fixo)
├── scripts/
│   └── validate-catalog.js # Validador do catálogo, roda antes do build
├── tests/
│   └── analytics-consent.spec.js # 9 testes Playwright do consentimento GA4
├── playwright.config.js
├── vite.config.js       # Configuração mínima do Vite
└── docs/                # Esta pasta — documentação do projeto
```

> **Imagens:** as de produtos (`public/images/products/`) e `og-image.png` / `og-image.jpg` vão para o git. A imagem do hero fica em `assets/hero/image-hero.webp` (importada pelo Vite).

## Como rodar localmente

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em **http://localhost:5173**

Para ver no celular (mesmo Wi-Fi):

```bash
npm run dev -- --host
# O terminal vai exibir o IP, ex: http://192.168.x.x:5173
```

## Como fazer o build

```bash
npm run build
```

O build roda antes o validador de catálogo (`scripts/validate-catalog.js`); se houver erro no catálogo, o build falha. Para rodar só o validador: `npm run validate:catalog`. Os arquivos finais são gerados na pasta `dist/`. Tamanho atual: JS principal ~342 kB (~105 kB gzip) e CSS ~55 kB (~11 kB gzip). Para visualizar o build localmente antes de subir:

```bash
npm run preview
```

## Catálogo de produtos

**37 produtos em 9 categorias. A tabela abaixo lista os 28 visíveis; os 9 com `visible: false` não aparecem no site:**

| ID  | Nome                                                          | Categorias                            |
| --- | ------------------------------------------------------------- | ------------------------------------- |
| 1   | Brinquedo Interativo de Pelúcia                               | brinquedos                            |
| 2   | Refúgio Cozy — Cabana Personalizada PetLuxo                   | sono-refugio                          |
| 8   | Bolsa Transporte PetLuxo                                      | mais-vendidos, couro                  |
| 9   | Élan Couro \| Elegância em Cada Passeio                       | couro                                 |
| 10  | Porta Saquinhos em Couro                                      | couro                                 |
| 12  | Sofá PetLuxo Essence                                          | conforto, sono-refugio                |
| 14  | Cama PetLuxo CloudNest™                                       | sono-refugio                          |
| 15  | Coleira PetLuxo Atena™                                        | couro                                 |
| 17  | Bolsa Voyage Signature™️ \| Transporte Luxury para Pets       | colecao-passeio                       |
| 18  | Cama Suspensa Rattan Élysée                                   | conforto, sono-refugio                |
| 20  | Refúgio Suspenso                                              | mais-vendidos, conforto, sono-refugio |
| 21  | Cama Executive Bed™ \| Couro Soft Premium                     | couro, sono-refugio                   |
| 24  | Fonte Automática Elegance \| Design Minimalista Premium       | a-mesa                                |
| 25  | Mesa Gourmet Nordic™ \| Design Escandinavo com Slow Feeder    | a-mesa                                |
| 26  | Kit Solenne                                                   | colecao-passeio                       |
| 28  | Cabana Lumière                                                | sono-refugio, mais-vendidos           |
| 30  | Cesto Organizador Personalizado para Pets — Coleção Cozy Luxo | colecao-cozy-luxo                     |
| 31  | Estação de Passeio PetLuxo™ em Madeira Premium                | colecao-cozy-luxo                     |
| 33  | Reservatório Hermético Cozy para Ração Pet                    | colecao-cozy-luxo                     |
| 34  | Bolsa Térmica Signature Metalassê                             | colecao-passeio                       |
| 35  | Manta Serenity™ PetLuxo Premium                               | sono-refugio                          |
| 36  | Comedouro Nômade Premium™ Dobrável e Portátil                 | viagem-mobilidade                     |
| 37  | Chaise Féline                                                 | viagem-mobilidade, sono-refugio       |
| 38  | Refúgio Majestá - Caminha Premium em Madeira com Cortinas     | sono-refugio, conforto                |
| 39  | Brinquedo PetLuxo Companhia para Brincar                      | brinquedos, mais-vendidos             |
| 40  | Polvo Mimo™ Brinquedo Interativo com Som para Cães            | brinquedos                            |
| 41  | Bolsa Auréa Voyage                                            | couro                                 |
| 42  | Bolsa Majestic Travel                                         | couro                                 |

**Categorias disponíveis:**

| ID                  | Label               |
| ------------------- | ------------------- |
| `mais-vendidos`     | Mais Vendidos       |
| `couro`             | Essenciais em Couro |
| `conforto`          | Conforto & Estilo   |
| `a-mesa`            | À Mesa              |
| `colecao-cozy-luxo` | Coleção Cozy Luxo   |
| `brinquedos`        | Brinquedos & Estilo |
| `colecao-passeio`   | Coleção Passeio     |
| `sono-refugio`      | Sono & Refúgio      |
| `viagem-mobilidade` | Viagem & Mobilidade |

## Testes

`tests/analytics-consent.spec.js` (9 testes Playwright do consentimento GA4) e `playwright.config.js`. Não há script npm para executá-los.

## Variáveis de ambiente

O número de WhatsApp é configurado em `src/lib/whatsapp.js` como fallback: `5561994063917`. Pode ser sobrescrito via variável de ambiente `VITE_WHATSAPP_PHONE` (não configurada na Vercel atualmente — usa o padrão hardcoded).

> Para detalhes completos de arquitetura, catálogo e decisões técnicas, ver `AI_CONTEXT_PETLUXO.md` na raiz do projeto.
