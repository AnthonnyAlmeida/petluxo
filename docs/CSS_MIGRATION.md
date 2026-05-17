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
- [ ] Criar `src/components/sections/Story.module.css`
- [ ] Migrar classes do globals.css → module
- [ ] Usar `:global(.reveal)` para `.story-grid > .reveal::before`
- [ ] Atualizar `Story.jsx`
- [ ] Build sem erros

- [ ] ✅ Revisão visual: desktop + mobile + tablet
- [ ] ✅ Commit: `refactor: fase 1a — TrustBadges, NotFound, Story`

#### Featured
- [ ] Criar `src/components/sections/Featured.module.css`
- [ ] Migrar classes do globals.css → module
- [ ] Atualizar `Featured.jsx`
- [ ] Build sem erros

#### CTA
- [ ] Criar `src/components/sections/CTA.module.css`
- [ ] Migrar classes do globals.css → module
- [ ] Usar `:global(.reveal)` onde necessário
- [ ] Atualizar `CTA.jsx`
- [ ] Build sem erros

#### FAQ
- [ ] Criar `src/components/sections/FAQ.module.css`
- [ ] Migrar classes do globals.css → module
- [ ] Renomear estado: `.faq-item.open` → `.faqItem` + `.faqItemOpen`
- [ ] Atualizar `FAQ.jsx`
- [ ] Build sem erros

- [ ] ✅ Revisão visual: desktop + mobile + tablet
- [ ] ✅ Commit: `refactor: fase 1b — Featured, CTA, FAQ`

#### Footer
- [ ] Criar `src/components/layout/Footer.module.css`
- [ ] Migrar classes do globals.css → module
- [ ] Atualizar `Footer.jsx`
- [ ] Build sem erros

- [ ] ✅ Revisão visual: desktop + mobile + tablet
- [ ] ✅ Commit: `refactor: fase 1c — Footer`

#### Páginas de política (PrivacyPage, ReturnPolicyPage, ShippingPolicyPage, TermsPage)
- [ ] Criar module.css para cada página
- [ ] Migrar classes do globals.css → modules
- [ ] Atualizar cada JSX
- [ ] Build sem erros

- [ ] ✅ Revisão visual: desktop + mobile
- [ ] ✅ Commit: `refactor: fase 1d — páginas de política`

---

### Fase 2 — Componentes de produto

#### ProductCard
- [ ] Criar `src/components/product/ProductCard.module.css`
- [ ] Migrar classes do globals.css → module
- [ ] Tratar `.product .badge.gold` com `:global(.gold)`
- [ ] Atualizar `ProductCard.jsx`
- [ ] Build sem erros
- [ ] ✅ Revisão visual: desktop + mobile
- [ ] ✅ Commit: `refactor: fase 2a — ProductCard`

#### ProductGrid
- [ ] Criar `src/components/product/ProductGrid.module.css`
- [ ] Migrar classes do globals.css → module
- [ ] Renomear `.carousel--single` → `carouselSingle`
- [ ] Atualizar `ProductGrid.jsx`
- [ ] Build sem erros
- [ ] ✅ Revisão visual: desktop + mobile (testar scroll do carrossel)
- [ ] ✅ Commit: `refactor: fase 2b — ProductGrid`

#### Products
- [ ] Criar `src/components/sections/Products.module.css`
- [ ] Migrar classes do globals.css → module
- [ ] Atualizar `Products.jsx`
- [ ] Build sem erros
- [ ] ✅ Revisão visual: desktop + mobile
- [ ] ✅ Commit: `refactor: fase 2c — Products`

#### Differentials
- [ ] Criar `src/components/sections/Differentials.module.css`
- [ ] Migrar classes do globals.css → module
- [ ] Usar `:global(.section-tag)` para `.diffs .section-tag`
- [ ] Atualizar `Differentials.jsx`
- [ ] Build sem erros
- [ ] ✅ Revisão visual: desktop + mobile
- [ ] ✅ Commit: `refactor: fase 2d — Differentials`

---

### Fase 3 — Componentes críticos

#### 3a — ProductModal
> ⚠️ Tirar prints ANTES de começar: desktop, mobile, landscape, com e sem size selector

- [ ] Criar `src/components/product/ProductModal.module.css`
- [ ] Migrar classes do globals.css → module
- [ ] Renomear `.size-btn.--active` → `sizeBtnActive`
- [ ] Atualizar `ProductModal.jsx`
- [ ] Build sem erros
- [ ] ✅ Checklist completo do modal:
  - [ ] Abre e fecha corretamente
  - [ ] Scroll interno funciona
  - [ ] Botões visíveis sem scroll
  - [ ] iOS Safari — modal não quebra viewport
  - [ ] Landscape mobile — modal não corta conteúdo
  - [ ] Backdrop fecha o modal
  - [ ] Animação de entrada/saída preservada
- [ ] ✅ Commit: `refactor: fase 3a — ProductModal`

#### 3b — Navbar
- [ ] Criar `src/components/layout/Navbar.module.css`
- [ ] Migrar classes do globals.css → module
- [ ] Renomear `.nav.scrolled` → `navScrolled`
- [ ] Tratar `.nav-drawer-cta` combinado com `.btn .btn-primary` globais
- [ ] Atualizar `Navbar.jsx`
- [ ] Build sem erros
- [ ] ✅ Revisão visual: desktop + mobile (testar menu hamburger)
- [ ] ✅ Commit: `refactor: fase 3b — Navbar`

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
| Fase 1a — TrustBadges, NotFound, Story | ⬜ Pendente |
| Fase 1b — Featured, CTA, FAQ | ⬜ Pendente |
| Fase 1c — Footer | ⬜ Pendente |
| Fase 1d — Páginas de política | ⬜ Pendente |
| Fase 2a — ProductCard | ⬜ Pendente |
| Fase 2b — ProductGrid | ⬜ Pendente |
| Fase 2c — Products | ⬜ Pendente |
| Fase 2d — Differentials | ⬜ Pendente |
| Fase 3a — ProductModal | ⬜ Pendente |
| Fase 3b — Navbar | ⬜ Pendente |
| Fase 3c — Hero | ⬜ Pendente |
| Passo Final | ⬜ Pendente |

---

*Documento criado em maio de 2026. Atualizar status conforme progresso.*
