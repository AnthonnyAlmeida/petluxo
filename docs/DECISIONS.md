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

## 3. Responsividade com breakpoints 980px / 768px / 480px

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
