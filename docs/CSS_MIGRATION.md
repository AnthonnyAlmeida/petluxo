# Migração CSS → CSS Modules — PetLuxo

## Contexto
O `globals.css` atingiu 1.730 linhas misturando estilos globais com estilos de componentes específicos.
O objetivo é migrar para CSS Modules mantendo o visual 100% idêntico — nova estrutura, mesmo resultado.

**Regra absoluta de toda a migração: nenhuma alteração visual. Se algo mudar visualmente, reverter e investigar.**

---

## Arquitetura final esperada
```
src/styles/
  globals.css         # reset, utilitárias, tipografia, .reveal
  animations.css      # apenas @keyframes, nomeados por componente
  variables.css       # tokens de cor, tipografia, espaçamento, z-index
  buttons.css         # global controlado — apenas .btn e variantes

src/components/
  layout/
    Navbar.module.css
    Footer.module.css
  sections/
    Hero.module.css
    Featured.module.css
    Products.module.css
    Story.module.css
    Differentials.module.css
    CTA.module.css
    FAQ.module.css
    NotFound.module.css
  product/
    ProductCard.module.css
    ProductGrid.module.css
    ProductModal.module.css
  ui/
    TrustBadges.module.css
  pages/
    PrivacyPage.module.css
    ReturnPolicyPage.module.css
    ShippingPolicyPage.module.css
    TermsPage.module.css
```

---

## Convenções obrigatórias

### Nomenclatura
- **camelCase:** `heroGrid`, `modalCard`, `footerBrand`
- **Estado como classe própria:** `navScrolled`, `faqItemOpen`, `sizeBtnActive`
- **Variante:** `btnPrimary`, `btnGhost`, `btnGold`
- **Proibido:** `.open`, `.active`, `.title`, `.label`, `.val` soltos
- **Proibido:** compartilhar nomes entre módulos — use `.heroTitle`, `.faqTitle`, `.modalTitle`

### Nesting
- Máximo 2 níveis de descendência
- ✅ `.heroGrid .heroTitle {}`
- ❌ `.hero .content .title .label {}`
- Elementos HTML só para reset/contexto simples; estilos principais sempre em classes explícitas

### Media queries
Sempre no final do arquivo, nessa ordem:
```css
/* base */

/* @media (max-width: 768px) — tablet */

/* @media (max-width: 480px) — mobile */
```

### Uso de :global()
Permitido APENAS para:
- `.reveal` e `.reveal.d1`–`.d5`
- Utilitárias globais: `.serif`, `.italic`, `.gold`, `.gold-text`, `.eyebrow`, `.wrap`, `.section-tag`
- Classes de bibliotecas third-party

### Mistura de classes no JSX
```jsx
// ✅ Correto
className={[styles.hero, 'reveal'].filter(Boolean).join(' ')}
className={[styles.faqItem, isOpen && styles.faqItemOpen].filter(Boolean).join(' ')}

// ❌ Proibido
className={`${styles.hero} reveal`}
```

### Ordem de imports CSS
```js
import '../../styles/buttons.css'   // se necessário
import styles from './Hero.module.css'
```

### Z-Index
Sempre variáveis — nunca valores hardcoded:
```css
--z-navbar: 100;
--z-modal: 1000;
--z-overlay: 900;
--z-above-modal: 1100;
```

### Regra anti-gambiarra
Durante a migração, NUNCA corrigir comportamento inesperado com:
- `margin-top: -13px`
- `width: calc(100% + 2px)`
- `overflow-x: hidden` sem causa raiz clara

Se algo quebrar visivelmente → reverter e investigar antes de avançar.

---

## Checklist de execução

### Passo 0 — Preparação da base ✅ Concluído
- [x] Criar `src/styles/animations.css` com todos os @keyframes renomeados
  - `rise` → `heroRise`
  - `fade` → `heroFade`
  - `rotate` → `stageRotate`
  - `floaty` → `heroFloaty`
  - `scroll-line` → `scrollCueLine`
- [x] Atualizar referências dos keyframes em todos os JSX e globals.css
- [x] Adicionar z-index tokens em `variables.css`
- [x] Substituir z-index hardcoded no globals.css pelas variáveis
- [x] Remover classes órfãs: `.grain` (mantida — usada em index.html), `.diff-item .icon`, `.modal-info .row`, `.cat-chip`, `.product-grid`
- [x] Importar `animations.css` em `main.jsx`
- [x] Adicionar seção `## Convenções CSS` no `AI_CONTEXT.md`
- [x] ✅ Revisão visual: desktop + mobile + tablet
- [x] ✅ Commits: `refactor: passo 0a` e `refactor: passo 0b`

---

### Fase 1 — Componentes simples
**Regra: máximo 3 componentes por commit**

#### TrustBadges
- [x] Criar `src/components/ui/TrustBadges.module.css`
- [x] Migrar classes do globals.css → module
- [x] Atualizar `TrustBadges.jsx`
- [x] Build sem erros

#### NotFound
- [x] Criar `src/components/sections/NotFound.module.css`
- [x] Migrar classes do globals.css → module
- [x] Atualizar `NotFound.jsx`
- [x] Build sem erros

#### Story
- [x] Criar `src/components/sections/Story.module.css`
- [x] Migrar classes do globals.css → module
- [x] Usar `:global(.reveal)` para `.storyGrid > .reveal::before`
- [x] Atualizar `Story.jsx`
- [x] Build sem erros
- [x] ✅ Revisão visual: desktop + mobile + tablet
- [x] ✅ Commit: `refactor: fase 1a — TrustBadges, NotFound, Story`

#### Featured
- [x] Criar `src/components/sections/Featured.module.css`
- [x] Migrar classes do globals.css → module
- [x] Atualizar `Featured.jsx`
- [x] Build sem erros

#### CTA
- [x] Criar `src/components/sections/CTA.module.css`
- [x] Migrar classes do globals.css → module
- [x] Usar `:global(.reveal)` onde necessário
- [x] Atualizar `CTA.jsx`
- [x] Build sem erros

#### FAQ
- [x] Criar `src/components/sections/FAQ.module.css`
- [x] Migrar classes do globals.css → module
- [x] Renomear estado: `.faq-item.open` → `.faqItem` + `.faqItemOpen`
- [x] Atualizar `FAQ.jsx`
- [x] Build sem erros

- [x] ✅ Revisão visual: desktop + mobile + tablet
- [x] ✅ Commit: `refactor: fase 1b — Featured, CTA, FAQ`

#### Footer
- [x] Criar `src/components/layout/Footer.module.css`
- [x] Migrar classes do globals.css → module
- [x] Atualizar `Footer.jsx`
- [x] Build sem erros

- [x] ✅ Revisão visual: desktop + mobile + tablet
- [x] ✅ Commit: `refactor: fase 1c — Footer`

#### Páginas de política (PrivacyPage, ReturnPolicyPage, ShippingPolicyPage, TermsPage)
- [x] Criar module.css para cada página (N/A — páginas usam inline styles, nenhum módulo necessário)
- [x] Migrar classes do globals.css → modules (N/A — sem classes CSS a migrar)
- [x] Atualizar cada JSX (N/A — nenhuma alteração necessária)
- [x] Build sem erros (confirmado nas fases anteriores)

- [x] ✅ Revisão visual: desktop + mobile
- [x] ✅ Commit: N/A — nenhuma alteração de código

---

### Fase 2 — Componentes de produto

#### ProductCard
- [x] Criar `src/components/product/ProductCard.module.css`
- [x] Migrar classes do globals.css → module
- [x] Tratar `.product .badge.gold` com `:global(.gold)`
- [x] Atualizar `ProductCard.jsx`
- [x] Build sem erros
- [x] ✅ Revisão visual: desktop + mobile
- [x] ✅ Commit: `refactor: fase 2a — ProductCard`

#### ProductGrid
- [x] Criar `src/components/product/ProductGrid.module.css`
- [x] Migrar classes do globals.css → module
- [x] Renomear `.carousel--single` → `carouselSingle`
- [x] Atualizar `ProductGrid.jsx`
- [x] Build sem erros
- [ ] ✅ Revisão visual: desktop + mobile (testar scroll do carrossel)
- [ ] ✅ Commit: `refactor: fase 2b — ProductGrid`

#### Products
- [x] Criar `src/components/sections/Products.module.css`
- [x] Migrar classes do globals.css → module
- [x] Atualizar `Products.jsx`
- [x] Build sem erros
- [x] ✅ Revisão visual: desktop + mobile
- [x] ✅ Commit: `refactor: fase 2c — Products`

#### Differentials
- [x] Criar `src/components/sections/Differentials.module.css`
- [x] Migrar classes do globals.css → module
- [x] Usar `:global(.section-tag)` para `.diffs .section-tag`
- [x] Atualizar `Differentials.jsx`
- [x] Build sem erros
- [x] ✅ Revisão visual: desktop + mobile
- [x] ✅ Commit: `refactor: fase 2d — Differentials`

---

### Fase 3 — Componentes críticos

#### 3a — ProductModal
> ⚠️ Tirar prints ANTES de começar: desktop, mobile, landscape, com e sem size selector

- [x] Criar `src/components/product/ProductModal.module.css`
- [x] Migrar classes do globals.css → module
- [x] Renomear `.size-btn.--active` → `sizeBtnActive`
- [x] Atualizar `ProductModal.jsx`
- [x] Build sem erros
- [x] ✅ Checklist completo do modal:
  - [x] Abre e fecha corretamente
  - [x] Scroll interno funciona
  - [x] Botões visíveis sem scroll
  - [x] iOS Safari — modal não quebra viewport
  - [x] Landscape mobile — modal não corta conteúdo
  - [x] Backdrop fecha o modal
  - [x] Animação de entrada/saída preservada
- [x] ✅ Commit: `refactor: fase 3a — ProductModal`

#### 3b — Navbar
- [x] Criar `src/components/layout/Navbar.module.css`
- [x] Migrar classes do globals.css → module
- [x] Renomear `.nav.scrolled` → `navScrolled`
- [x] Tratar `.nav-drawer-cta` combinado com `.btn .btn-primary` globais
- [x] Atualizar `Navbar.jsx`
- [x] Build sem erros
- [x] ✅ Revisão visual: desktop + mobile (testar menu hamburger)
- [x] ✅ Commit: `refactor: fase 3b — Navbar`

#### 3c — Hero
- [ ] Criar `src/components/sections/Hero.module.css`
- [ ] Migrar classes do globals.css → module
- [ ] Referenciar keyframes de `animations.css`
- [ ] Atualizar `Hero.jsx`
- [ ] Build sem erros
- [ ] ✅ Revisão visual: desktop + mobile + tablet (testar animações de entrada)
- [ ] ✅ Commit: `refactor: fase 3c — Hero`

---

### Passo Final — Limpeza

- [ ] Criar `src/styles/buttons.css` com cabeçalho de global controlado
- [ ] Extrair `.btn` e variantes do globals.css → `buttons.css`
- [ ] Importar `buttons.css` nos 7 componentes que usam botões
- [ ] Limpar globals.css — deve conter apenas reset, utilitárias, tipografia, `.reveal`
- [ ] Verificar que globals.css ficou abaixo de 200 linhas
- [ ] Atualizar `AI_CONTEXT.md` com seção `## Arquitetura CSS` final
- [ ] ✅ Revisão visual completa: todos os componentes, desktop + mobile
- [ ] ✅ Commit: `refactor: passo final — buttons.css, limpeza globals.css`

---

## Checklist visual padrão (usar após cada fase)
- [ ] Desktop Chrome 1280px
- [ ] Mobile Chrome 375px
- [ ] Tablet 768px
- [ ] Overflow horizontal: ativar temporariamente `* { outline: 1px solid red }` no globals
- [ ] Hover states no desktop
- [ ] Touch targets no mobile
- [ ] Focus states (navegação por teclado)

---

## Progresso geral

| Etapa | Status |
|---|---|
| Passo 0 | ✅ Concluído |
| Fase 1a — TrustBadges, NotFound, Story | ✅ Concluído |
| Fase 1b — Featured, CTA, FAQ | ✅ Concluído |
| Fase 1c — Footer | ✅ Concluído |
| Fase 1d — Páginas de política | ✅ Concluído |
| Fase 2a — ProductCard | ✅ Concluído |
| Fase 2b — ProductGrid | ⬜ Pendente |
| Fase 2c — Products | ✅ Concluído |
| Fase 2d — Differentials | ✅ Concluído |
| Fase 3a — ProductModal | ✅ Concluído |
| Fase 3b — Navbar | 🟡 Migrado, aguardando revisão visual |
| Fase 3c — Hero | ⬜ Pendente |
| Passo Final | ⬜ Pendente |

---

*Documento criado em maio de 2026. Atualizar status conforme progresso.*
