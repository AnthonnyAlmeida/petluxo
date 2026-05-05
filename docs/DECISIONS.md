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
Para permitir que um produto apareça em mais de uma categoria (ex: "Mais Vendidos" + "Brinquedos"), o campo `category` de cada produto é agora um array de strings. Os filtros usam `.includes(id)` em vez de `=== id`.

---

## 4. `products.js` e imagens de produtos excluídos do Git

**Motivação:**
O arquivo `src/data/products.js` contém descrições detalhadas, preços e estratégia de posicionamento. As imagens de produtos são ativos de negócio sensíveis.

**Como foi feito:**
- Adicionado `src/data/products.js` e `public/images/products/` ao `.gitignore`
- Executado `git rm --cached` para remover do índice sem deletar os arquivos locais
- O arquivo e as imagens existem localmente e no servidor de produção, mas não no repositório público

---

## 5. Hero image movida de `assets/` para `public/`

**Situação anterior:**
A imagem do hero (`hero-pet.png`) era importada via `import heroPet from '../../../assets/hero/hero-pet.png'` e incluída no bundle pelo Vite (2,1 MB processados no build).

**Por que mudar:**
- A imagem real é servida diretamente de `public/`, sem bundling
- Elimina 2,1 MB do bundle e reduz o tempo de build
- Consistente com a abordagem já usada para as imagens de produtos

**Como foi feito:**
- Nova imagem colocada em `public/images/image-hero.png`
- Import removido de `Hero.jsx`; `src` atualizado para o caminho estático `/images/image-hero.png`

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
