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
├── package.json             # React 18 + Vite, sem outras dependências
├── AI_CONTEXT.md            # Este arquivo
├── public/                  # Copiados diretamente para dist/
│   ├── favicon.svg
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
│   │   │   ├── Navbar.jsx   # Navbar com menu hambúrguer mobile
│   │   │   └── Footer.jsx   # CNPJ, email, Instagram
│   │   ├── product/
│   │   │   ├── ProductCard.jsx   # Card no carrossel: imagem, badge, nome, preço, CTA
│   │   │   ├── ProductGrid.jsx   # Carrossel com setas laterais e swipe touch
│   │   │   └── ProductModal.jsx  # Modal de detalhes com seletor de tamanho
│   │   ├── sections/
│   │   │   ├── Hero.jsx          # Seção hero com headline e métricas
│   │   │   ├── Featured.jsx      # Produto destaque (id 13)
│   │   │   ├── Products.jsx      # Múltiplos carrosséis por categoria
│   │   │   ├── Story.jsx         # Seção Sobre Nós
│   │   │   ├── Differentials.jsx # Diferenciais da marca
│   │   │   ├── CTA.jsx           # Chamada para ação final
│   │   │   └── NotFound.jsx      # Página 404
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Container.jsx
│   │       └── Section.jsx
│   ├── data/
│   │   └── products.js      # FONTE DE VERDADE do catálogo — editar aqui
│   ├── hooks/
│   │   └── useScroll.js     # IntersectionObserver + parallax para animações
│   ├── lib/
│   │   └── whatsapp.js      # Gera links wa.me com mensagem pré-preenchida
│   └── styles/
│       ├── variables.css    # Design tokens: cores, fontes, espaçamentos
│       └── globals.css      # Todos os estilos (~1500 linhas), sem framework
└── docs/                    # Documentação do projeto
    ├── README.md
    ├── DECISIONS.md
    ├── DEPLOY.md
    └── TODO.md
```

> **Imagem no .gitignore:** apenas `public/images/image-hero.png` (arquivo grande da hero). Todas as demais imagens, incluindo produtos e og-image.png, vão para o git normalmente.

### Componentes principais

**`ProductCard.jsx`**
Card exibido no carrossel. Mostra: imagem, badge (se houver), `shortName` (ou `name`), preço original (se houver), preço, e CTA dinâmico:
- `"COMPRAR AGORA"` se o produto tem `buyLink` ou `buyLinks`
- `"VIA WHATSAPP"` se o produto não tem link de pagamento

**`ProductGrid.jsx`**
Carrossel com navegação por setas e swipe touch. Hook interno `usePerView` detecta breakpoints: 3 cards (desktop ≥980px), 2 (tablet ≤980px), 1 (mobile ≤768px). Recebe props `products`, `title`, `resetKey`. Setas laterais via flexbox (não position:absolute, evita clipping em containers overflow:hidden).

**`ProductModal.jsx`**
Modal de detalhes aberto ao clicar em qualquer card. Exibe nome completo, preço, seletor de tamanho (quando `buyLinks` existe), descrição e bullets. Footer do modal tem 3 estados:
1. Produto com `buyLinks` → botão "COMPRAR AGORA" (link do tamanho selecionado) + botão WhatsApp
2. Produto com `buyLink` → botão "COMPRAR AGORA" + botão WhatsApp
3. Produto sem link → apenas botão WhatsApp

**`Products.jsx`**
Renderiza múltiplos `ProductGrid`, um por categoria. "Mais Vendidos" fica sempre visível. Demais categorias ficam ocultas atrás de botão "Ver mais produtos" que expande com animação `grid-template-rows: 0fr → 1fr`.

### Sistema de carrosséis por categoria

`CATEGORIES` em `products.js` define a ordem e os labels das categorias. `Products.jsx` mapeia cada categoria, filtra `PRODUCTS.filter(p => p.category.includes(cat.id))` e passa o resultado para um `ProductGrid`. O campo `category` de cada produto é um **array**, permitindo que um produto apareça em múltiplas categorias.

### Como o modal com seletor de tamanho funciona

Produtos com múltiplos tamanhos têm dois campos extras:
- `prices: [{ size, price }]` — para exibir preço por tamanho
- `buyLinks: [{ size, link }]` — para o link de compra por tamanho

No modal (`ProductModal.jsx`), um `useState(selectedSize)` controla qual tamanho está ativo. O preço exibido e o link do botão "COMPRAR AGORA" são derivados do tamanho selecionado via `.find()`.

---

## 3. Catálogo Completo de Produtos

**20 produtos em 6 categorias.** IDs não são contíguos (alguns foram removidos). Próximo ID disponível: **21**.

| ID | Nome (shortName) | Preço | Categorias | buyLink | buyLinks | Badge | Imagem |
|---|---|---|---|---|---|---|---|
| 1 | Brinquedo Interativo de Pelúcia | R$ 149,90 | mais-vendidos, brinquedos | pag.ae/81K6Dbu-q | — | MAIS VENDIDOS | brinquedo_interativo.jpeg |
| 3 | Garrafa Portátil Premium para Pets | R$ 189,90 | colecao-casa | pag.ae/81J8xDn2N | — | null | garrafa.jpeg |
| 4 | Comedouro Elevado Premium | R$ 249,90 | colecao-casa, conforto | pag.ae/81LGWC7X4 | — | null | comedouro_elevado.jpeg |
| 6 | Refúgio PetLuxo Cozy | R$ 297,00 | conforto | pag.ae/81J8cPYS6 | — | null | cozy.jpeg |
| 8 | Bolsa Transporte PetLuxo | R$ 797,00 | couro | pag.ae/81K3S7Am5 | — | null | bolsa_transporte.jpeg |
| 9 | Kit Milano Camelo | R$ 847,00 | couro | pag.ae/81K3Zv1ga | — | null | kit_milano.jpeg |
| 10 | Porta Saquinhos em Couro | R$ 227,00 | couro | pag.ae/81K3Kjy9v | — | null | porta_saquinho.jpeg |
| 12 | Sofá PetLuxo Essence | R$ 497,00 | conforto | pag.ae/81J1KU12M | — | null | produtodestaquepetluxo.jpeg |
| 13 | Sofá Lounge PetLuxo™ | R$ 349,90 | mais-vendidos, conforto | pag.ae/81LH1xxX4 | — | MAIS VENDIDOS | sofa-ortopedico.jpeg |
| 14 | Cama CloudNest™ | a partir de R$ 329,90 | conforto | — | P/M/G (3 links) | null | cama_petluxo.jpeg |
| 15 | Coleira Atena™ | R$ 197,90 | couro | pag.ae/81LHbyHKp | — | null | coleira_petluxo.jpeg |
| 16 | Comedouro Maison Élevé | a partir de R$ 289,90 | mais-vendidos, colecao-casa | — | 800ml/1200ml/1800ml (3 links) | MAIS VENDIDOS | comedouro_maison.jpeg |
| 17 | Bolsa Voyage Signature | R$ 429,00 | colecao-passeio | pag.ae/81LHebDYP | — | null | bolsa_voyage.jpeg |
| 18 | Cama Suspensa Élysée | R$ 397,90 | conforto | pag.ae/81MuixsTN | — | null | cama_suspensa_elysee.jpeg |
| 19 | Arranhador Sisal Maison | R$ 197,90 | brinquedos | pag.ae/81MunByX6 | — | null | arranhador_bola.jpeg |
| 20 | Cama Suspensa Aura | R$ 389,00 | mais-vendidos, conforto | pag.ae/81MurBvHN | — | MAIS VENDIDOS | cama_suspensa_rattan.jpeg |

**Detalhes dos buyLinks (produtos com seletor de tamanho):**

*id 14 — Cama CloudNest™:*
- Tam. P → R$ 329,90 → pag.ae/81LH8SGzp
- Tam. M → R$ 397,90 → pag.ae/81LHw9Qb8
- Tam. G → R$ 459,90 → pag.ae/81LHxFzTK

*id 16 — Comedouro Maison Élevé:*
- 800ml → R$ 289,90 → pag.ae/81LGZCXsP
- 1200ml → R$ 329,90 → pag.ae/81LHgsgcP
- 1800ml → R$ 389,90 → pag.ae/81LHi4Ret

**Categorias disponíveis (conforme `CATEGORIES` em `products.js`):**

| ID | Label exibido no site |
|---|---|
| `mais-vendidos` | Mais Vendidos |
| `conforto` | Conforto & Estilo |
| `couro` | Essenciais em Couro |
| `colecao-casa` | Coleção Casa |
| `brinquedos` | Brinquedos |
| `colecao-passeio` | Coleção Passeio |

**Ordem dos produtos por categoria conforto** (reflete a ordem no array `PRODUCTS`):
id 4 → id 20 → id 6 → id 18 → id 12 → id 13 → id 14

---

## 4. Padrões e Convenções

### Campos obrigatórios ao adicionar produto

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number | Próximo disponível após 20 é **21** |
| `name` | string | Nome completo (exibido no modal) |
| `shortName` | string | Nome curto (exibido no card do carrossel) |
| `subtitle` | string | Frase curta de impacto (exibida no modal) |
| `description` | string | Texto completo para o modal |
| `bullets` | string[] | Array de diferenciais/características |
| `price` | string | `"R$ X,XX"` ou `"a partir de R$ X,XX"` |
| `badge` | string \| null | `"MAIS VENDIDOS"` ou `null` |
| `image` | string | `"/images/products/nome.jpeg"` |
| `category` | string[] | Ex: `["mais-vendidos", "conforto"]` |
| `buyLink` | string \| omitido | URL PagBank para produto único |

**Para produtos com múltiplos tamanhos**, adicionar também:
- `prices: [{ size, price }]` — array de tamanhos e preços
- `buyLinks: [{ size, link }]` — array de tamanhos e links PagBank
- Nesse caso, omitir `buyLink` (usar apenas `buyLinks`)

### Imagens de produtos

- Salvar em: `public/images/products/`
- Formato preferido: `.jpeg`
- **Fazer commit normalmente** — apenas `public/images/image-hero.png` está no `.gitignore`

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

## 6. Decisões Técnicas Importantes

### CSS puro sem framework
Bundle pequeno (~29KB CSS gzip 6.7KB) e controle total sobre o design. Todo o estilo está em `src/styles/globals.css` (~1500 linhas) e `src/styles/variables.css` (design tokens).

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

## 7. Workflow de Trabalho

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

## 8. Pendências Conhecidas

### Produtos sem buyLink (exibem "VIA WHATSAPP" no card)
Nenhum produto atualmente sem link de pagamento — todos os 20 produtos têm `buyLink` ou `buyLinks`.

### Favicon
O favicon atual (`public/favicon.svg`) é um placeholder. Pendente: substituir pela logo oficial da PetLuxo em SVG com as cores corretas da marca.

### og:image
A imagem `public/og-image.png` foi atualizada recentemente. Para limpar o cache do LinkedIn e forçar re-scrape, usar:
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/

### Sitemap
`public/sitemap.xml` é manual. Quando o site crescer com mais rotas, considerar geração automática.
