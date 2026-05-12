# Decisões Técnicas

## 1. Migração de Babel CDN para Vite

**Situação original:**
O projeto começou como um protótipo em um único arquivo HTML, usando React e Babel carregados via CDN diretamente no navegador. O Babel convertia JSX em tempo real no browser.

**Por que mudar:**
- O Babel Standalone pesa ~3MB e bloqueia o carregamento da página
- Sem bundler, não há tree-shaking, minificação nem cache de assets
- Importar componentes entre arquivos era impossível sem um servidor
- Não havia suporte a variáveis de ambiente (`.env`)

**Como foi feito:**
- Criado `package.json` com React 18 e Vite como dependências
- Criado `vite.config.js` com o plugin `@vitejs/plugin-react`
- Todos os arquivos convertidos para ES modules com `import/export`
- O `index.html` foi limpo: saíram todas as tags `<script src="cdn...">` e `<script type="text/babel">`
- Criado `src/main.jsx` como entry point

**Resultado:**
| | Antes (CDN) | Depois (Vite) |
|---|---|---|
| Tamanho do bundle | ~4MB (CDN, sem cache útil) | 174KB (55KB gzip) |
| Build | Nenhum | `npm run build` em ~5s |
| Módulos transformados | — | 45 |
| Hot reload | Nenhum | Instantâneo |

---

## 2. Carrossel em vez de grade de produtos

**Situação original:**
Os produtos eram exibidos em uma grade CSS com 3 colunas fixas (`grid-template-columns: repeat(3, 1fr)`).

**Por que mudar:**
- Em mobile, 3 colunas ficam pequenas demais para tocar
- Não havia navegação, todos os produtos ficavam visíveis de uma vez
- A experiência em telas menores era ruim

**Como foi implementado:**
- `ProductGrid.jsx` reescrito como carrossel usando apenas React state e CSS `transform: translateX`
- Hook `usePerView` detecta o tamanho da tela via `resize` event e retorna 3 (desktop), 2 (tablet) ou 1 (mobile)
- Navegação por setas (anterior/próximo) com estado `disabled` automático nas bordas
- Dots de paginação clicáveis com animação de largura no dot ativo
- Transição suave com `cubic-bezier(0.16, 1, 0.3, 1)`
- Ao trocar o filtro de categoria, o carrossel reinicia automaticamente no primeiro item via prop `resetKey`

**Por que sem biblioteca:**
Evitar dependências externas mantém o bundle pequeno e o código sob controle total. A implementação é simples o suficiente para não precisar de uma lib.

---

## 6. Sistema de múltiplos carrosséis por categoria (substituiu filtros de chips)

**Situação anterior:**
A seção de produtos tinha botões de filtro por categoria (chips) que filtravam um único `ProductGrid`. Clicar num chip atualizava os produtos exibidos.

**Por que mudar:**
- A UX de filtrar ocultava produtos: o usuário via apenas a categoria selecionada, perdendo a visão do catálogo completo
- Com produtos reais em 6 categorias distintas, a navegação por chips fragmentava a experiência
- Queria garantir que "Mais Vendidos" ficasse sempre visível como âncora principal

**Como foi implementado:**
- `CATEGORIES` define a ordem de exibição das categorias em `src/data/products.js`
- Carrossel "Mais Vendidos" sempre visível com título próprio via prop `title`
- Botão "Ver mais produtos" expande os demais carrosséis com animação `grid-template-rows: 0fr → 1fr`
- Botão "Ver menos" recolhe e rola suavemente de volta ao topo da seção via `scrollIntoView`
- Cada `ProductGrid` recebe `title` e oculta setas/dots automaticamente quando `totalPages <= 1`
- Carrossel com menos produtos que `perView` recebe classe `carousel--single` que centraliza o card via flexbox

**Campo `category` virou array:**
Para permitir que um produto apareça em mais de uma categoria (ex: "Mais Vendidos" + "Couro"), o campo `category` de cada produto é agora um array de strings. Os filtros usam `.includes(id)` em vez de `=== id`.

**Estado atual do catálogo:** 12 produtos em 5 categorias — `mais-vendidos`, `conforto`, `couro`, `dining-collection`, `brinquedos`.

---

## 7. Carrossel: setas laterais e navegação por swipe

**Motivação:**
A navegação original dependia apenas das setas e dots na barra inferior do carrossel. Em desktop, as setas estavam longe do conteúdo; em mobile, não havia suporte a swipe.

**Setas laterais (desktop):**
- Dois `<button>` com classes `.carousel-arrow.carousel-arrow-side.--prev/next` inseridos dentro do `.carousel-outer`, como irmãos do `.carousel-viewport`
- `.carousel-outer` é `display: flex; align-items: center` — as setas ficam alinhadas verticalmente ao centro dos cards sem `position: absolute`
- Mesma aparência das setas inferiores (`.carousel-arrow`): círculo 48px, borda suave, hover dourado
- Ocultas em `≤ 768px` via `display: none`

**Por que flexbox em vez de `position: absolute`:**
O container de expansão de categorias usa `overflow: hidden` para a animação `grid-template-rows`. Setas com `left/right: -24px` (fora do `.carousel-outer`) eram clipadas dentro desse container. Com flexbox, as setas nunca ultrapassam os limites — o bug não existe.

**Swipe touch (mobile):**
- `onTouchStart/Move/End` no `.carousel-viewport`
- Três refs: `touchStartX`, `touchStartY`, `dragging`
- `onTouchMove` só chama `e.preventDefault()` (bloqueando o scroll da página) quando o deslocamento horizontal é maior que o vertical e ultrapassa 8px — scroll vertical normal não é afetado
- Limiar de 50px horizontal para avançar/voltar página
- `.carousel-viewport { touch-action: pan-y }` reforça ao browser que scroll vertical é permitido

---

## 4. Imagens de produtos vão para o Git

**Situação anterior:**
`src/data/products.js` e `public/images/products/` estavam no `.gitignore` por conterem dados sensíveis de negócio.

**Mudança:**
- `public/images/products/` foi removido do `.gitignore` — as imagens de produtos agora vão para o repositório
- `src/data/products.js` também não está mais no `.gitignore`
- Apenas `public/images/image-hero.png` permanece gitignored (imagem de 2,1MB processada pelo Vite via `assets/`)

**Motivação:**
Com o site em produção na Vercel, as imagens precisam estar no repositório para o deploy funcionar automaticamente a cada `git push`.

---

## 5. Hero image movida de `assets/` para `public/`

**Situação anterior:**
A imagem do hero (`hero-pet.png`) era importada via `import heroPet from '../../../assets/hero/hero-pet.png'` e incluída no bundle pelo Vite (2,1 MB processados no build).

**Por que mudar:**
- A imagem real é servida diretamente de `public/`, sem bundling
- Elimina 2,1 MB do bundle e reduz o tempo de build
- Consistente com a abordagem já usada para as imagens de produtos

**Como foi feito:**
- Imagem colocada em `assets/hero/image-hero.png` e importada via `import heroImg from '../../../assets/hero/image-hero.png'` em `Hero.jsx`
- Vite processa e faz hash do arquivo no build (`image-hero-[hash].png`)
- Adicionado `assets/hero/image-hero.png` ao `.gitignore` (ativo sensível)

---

## 6. Responsividade com breakpoints 980px / 768px / 480px

**Situação original:**
O CSS tinha um único breakpoint em 980px que apenas escondia a navbar e reorganizava algumas grades. Mobile era inacessível.

**Abordagem adotada:**
Três breakpoints progressivos, do maior para o menor (desktop-first, compatível com o CSS existente):

| Breakpoint | O que muda |
|---|---|
| `≤ 980px` (tablet) | Navbar oculta links; hambúrguer aparece; hero-stage reduz |
| `≤ 768px` (mobile) | Hero empilhado; float-cards ocultos; filtros em coluna; diferenciais em 1 coluna; footer bottom empilhado; botões full-width |
| `≤ 480px` | Ajustes finos de tamanho de fonte, espaçamento e elementos removidos (imagem do modal) |

**Menu hambúrguer:**
Implementado em `Navbar.jsx` com React state (`open`/`setOpen`). Ao clicar, um drawer desliza a partir do topo com os links de navegação e um botão de WhatsApp. Fecha automaticamente ao clicar em qualquer link. O ícone anima de 3 linhas para X via CSS `transform`.

**Problema de cascata resolvido:**
O bloco `.nav-burger { display: none }` estava posicionado após o `@media (max-width: 980px)` no CSS, então o `none` sempre vencia. A correção foi mover o bloco base para antes das media queries.

**Tap targets:**
Todos os elementos interativos têm área mínima de 44×44px (recomendação de acessibilidade da Apple e Google): chips de filtro, setas do carrossel, hambúrguer, botão fechar modal.

---

## 8. Repositório público obrigatório (Vercel Hobby Plan)

**Situação:**
O repositório foi tornado privado em algum momento, causando falha silenciosa no deploy automático da Vercel.

**Causa:**
O Vercel Hobby Plan (gratuito) só faz deploy de repositórios públicos. Repositórios privados exigem plano Pro.

**Solução:**
Manter o repositório `github.com/AnthonnyAlmeida/petluxo` **sempre público**. Após tornar público novamente, foi necessário forçar redeploy com commit vazio:
```bash
git commit --allow-empty -m "fix: force redeploy after repo visibility change"
git push
```

---

## 9. Modal com seletor de tamanho (buyLinks array)

**Motivação:**
Produtos como Cama CloudNest™ (id 14) e Comedouro Maison Élevé (id 16) têm variações de tamanho com preços e links de compra distintos.

**Como foi implementado:**
- Campo `buyLinks: [{ size, link }]` — array de links por tamanho
- Campo `prices: [{ size, price }]` — array de preços por tamanho
- `price` do produto vira `"a partir de R$ X"` (menor preço)
- Em `ProductModal.jsx`, `useState(selectedSize)` inicializado no primeiro tamanho via `useEffect`
- Preço exibido e link do botão COMPRAR AGORA são derivados via `.find()` do tamanho selecionado
- Produtos com `buyLinks` não têm `buyLink` — campos mutuamente exclusivos

---

## 10. CTA dinâmico no card (COMPRAR AGORA vs VIA WHATSAPP)

**Motivação:**
Com a integração do PagBank, passou a existir distinção clara entre produtos com link de compra direta e produtos que apenas redirecionam para WhatsApp.

**Como foi implementado em `ProductCard.jsx`:**
```jsx
{product.buyLink || product.buyLinks ? 'COMPRAR AGORA' : 'VIA WHATSAPP'}
```

**No modal (`ProductModal.jsx`)**, o footer segue 3 estados:
1. `buyLinks` presente → "COMPRAR AGORA" (tamanho selecionado) + "CONSULTAR VIA WHATSAPP"
2. `buyLink` presente → "COMPRAR AGORA" (link direto) + "CONSULTAR VIA WHATSAPP"
3. Nenhum dos dois → apenas "CONSULTAR VIA WHATSAPP"

---

## 11. Narrativa: WhatsApp → compra direta via PagBank

**Situação original:**
Toda a narrativa do site direcionava para WhatsApp como canal principal de venda.

**O que mudou:**
Com a integração PagBank, o botão principal no modal passou a ser "COMPRAR AGORA". WhatsApp ficou como canal secundário de consulta. Produtos sem link PagBank ainda usam WhatsApp como primário. O CTA no card reflete a mesma hierarquia.

