# Design System do PetLuxo

> **Este documento descreve o site COMO ELE É, não como deveria ser.** Todo valor foi extraído do código (CSS Modules, `src/styles/`, JSX); a origem é citada pelo nome do arquivo ou da seção. Onde não existe regra, está escrito "não consta"; onde dois pontos do código divergem, está escrito "inconsistente: A em X, B em Y". Quando o código e este documento divergirem, o código vale.
>
> Há dois layouts no mesmo app: **abaixo de 768px** o mobile (seção 14, componentes em `src/components/mobile/`) e **a partir de 768px** o desktop (seções 2 a 13 descrevem o desktop e os tokens comuns). A diferença entre **regra** (padrão repetido e intencional) e **acidente** (valor solto, duplicado ou contraditório) está marcada ao longo do texto e consolidada na seção 11.

## Sumário

1. Visão geral
2. Tokens de cor
3. Tipografia
4. Espaçamento, grid e layout
5. Breakpoints e responsividade
6. Forma e profundidade
7. Componentes
8. Imagens
9. Acessibilidade observada
10. Tom de voz e conteúdo
11. Inconsistências e dívidas de design
12. Restrições para o redesign
13. Apêndice: arquivos lidos
14. Layout mobile (< 768px)

---

## 1. Visão geral

**O que é.** O PetLuxo é uma vitrine estática de produtos premium para pets (camas, coleiras e peitorais de couro, bolsas de transporte, comedouros, brinquedos). Não há carrinho nem checkout: o visitante escolhe o produto e fala com a loja pelo WhatsApp. Catálogo de 40 produtos (29 visíveis) em 9 categorias (`AI_CONTEXT_PETLUXO.md`, seção Catálogo).

**Tom visual percebido no código** (o que sustenta a leitura):

- **Editorial / joalheria, não varejo de pet shop.** Títulos em serifa de alto contraste (Cormorant Garamond) com palavras em itálico dourado em degradê (`.gold-text` em `globals.css`: "ele merece,", "pet", "encontrada."); rótulos em monoespaçada em caixa alta com espaçamento largo (JetBrains Mono, `letter-spacing` de 0.15em a 0.22em, `.eyebrow` e `.section-tag`); texto corrido em Inter.
- **Paleta quente e contida:** fundo off-white (`--offwhite` #F8F6F3), bege, caramelo e dourado como detalhes, vinho (#6B1E2B) como única cor de ação, tinta quase preta (#2A2522) para texto. Uma seção escura (`Differentials`, fundo `--ink`) faz contraste.
- **Acabamento "luxo discreto":** filetes de 1px em dourado translúcido, anéis concêntricos decorativos (Hero, CTA), textura de grão sobre a página (`.grain` em `globals.css`, opacidade 0.035), sombras longas e suaves, animações lentas com easing `cubic-bezier(0.16, 1, 0.3, 1)` (16 usos).
- **Copy** reforça o posicionamento: "CURADORIA EXCLUSIVA · PARA QUEM EXIGE O MELHOR", "O luxo que ele merece, a elegância que você aprecia." (`Hero.jsx`), "Sofisticação e conforto para quem ama seus pets." (`Footer.jsx`). Ver seção 10.

**Stack de estilo.** CSS Modules por componente mais 3 folhas globais em `src/styles/` (`variables.css`, `globals.css`, `buttons.css`). Sem Tailwind, sem biblioteca de UI, sem CSS-in-JS. Tokens são variáveis CSS em `:root` (`variables.css`). Estilos inline existem em 27 pontos de `style={{…}}` de uma linha no JSX, mais os blocos multilinha das páginas de política do desktop (em `PolicyLayout`; o mobile usa módulo CSS). Fontes self-hosted via `@fontsource` importado em `src/main.jsx`. `DevTweaks.jsx` e `tweaks-panel.jsx` (acento e grão) só carregam em dev.

**Base de medida:** `html, body` têm `font-size: 15px` (`globals.css`). Portanto **1rem = 15px** em todo o site, e valores em `rem` não equivalem aos 16px usuais (ver seção 3).

---

## 2. Tokens de cor

Fonte: `src/styles/variables.css` (12 cores nomeadas). Contagens = ocorrências em `src/**/*.css` excluindo o próprio `variables.css`, por grep em 2026-11-18. As contagens de `var(--x)` não incluem os usos inline em JSX (poucos: `FAQ.jsx`, `Footer.jsx`, `Differentials.jsx` e as 4 páginas de política).

### 2.1 Cores dominantes (tokens)

| Token / uso | Valor | Onde aparece (principais) | `var()` no CSS |
| --- | --- | --- | --- |
| `--ink-soft` · texto secundário, rótulos mono | #5C5550 | quase todos os módulos (subtítulos, descrições, `small`, placeholders) | 51 |
| `--caramelo` · acento de linha, `.gold`, hover de link, `cardNote` | #B08968 | Navbar (sublinhado do link), cards, selos, setas, `.section-tag .num` | 38 |
| `--ink` · texto principal, fundo da seção escura | #2A2522 | corpo, `Differentials` (fundo), preço do card | 33 |
| `--vinho` · cor de ação e **preço** | #6B1E2B | `.btn-primary`, badge, pill ativa, `.price` da ficha (`ProductPage.module.css`), título do banner de cookies, `theme-color` do `index.html` | 32 |
| `--offwhite` · fundo da página e superfícies | #F8F6F3 | `html/body`, cards flutuantes, modal, banner, texto sobre vinho | 29 |
| `--dourado` · acento decorativo | #C6A96B | `::selection`, pontos `.eyebrow .dot`, números de `Differentials`, rótulo do FAQ | 19 |
| `--bege` · superfície e bordas | #E8DED2 | `Featured` (fundo), bordas de acordeão/tabela, `.thumb` | 14 |
| `--bege-soft` · superfície clara | #EFE7DC | placeholder de imagem do card, campo de busca, `BrandSeal`, `TrustBadges` | 6 |
| `--vinho-soft` · hover do vinho | #7A2A38 | `.btn-primary:hover`, `.zoomBadgeActive:hover`, opção ativa do `CategorySelector` | 5 |
| `--cinza` · separadores | #D9D9D9 | `TrustBadges` | 2 |
| `--cinza-soft` · linha fina | #ECEAE6 | `TrustBadges` (modal) | 1 |
| `--dourado-soft` | #D4BC85 | **0 usos via `var()`**; o mesmo valor aparece em hex literal em `buttons.css` (`.btn-gold`) | 0 |

**O vinho do preço:** `--vinho` #6B1E2B colore o preço na ficha (30px, `ProductPage.module.css`). **Inconsistente:** o preço do **card** da grade é `--ink` (17px, `ProductCard.module.css`) e o preço do destaque (`Featured`) também é `--ink` (28px). O vinho vale para "preço de decisão" (modal/ficha), não para preço de listagem.

### 2.2 Transparências (famílias de rgba)

As cores-base reaparecem como `rgba()` sem token. Ocorrências por família em `src/**/*.css`:

| Família | Equivale a | Ocorrências | Usos típicos |
| --- | --- | --- | --- |
| rgba(42, 37, 34, α) | `--ink` | 20 | bordas 0.06–0.18, sombras 0.18–0.30, backdrops 0.5–0.6 |
| rgba(198, 169, 107, α) | `--dourado` | 24 | filetes e bordas 0.18–0.5, anéis decorativos 0.06–0.3 |
| rgba(176, 137, 104, α) | `--caramelo` | 13 | bordas de pill/seletor 0.18–0.3, sombras |
| rgba(255, 255, 255, α) | branco | 10 | realce interno (`inset 0 1px 0`) |
| rgba(248, 246, 243, α) | `--offwhite` | 8 | Navbar com blur (0, 0.78, 0.97), texto sobre fundo escuro |
| rgba(107, 30, 43, α) | `--vinho` | 7 | sombra do botão primário e do botão do banner |
| rgba(0, 0, 0, α) | preto | 6 | sombras do modal e do selo de destaque |
| rgba(28, 21, 16, α) / rgba(20, 15, 10, α) | marrons escuros | 2 / 2 | só em `Story` (sombra e véu da foto) |
| rgba(232, 222, 210, α) | `--bege` | 1 | hover do `.btn-ghost` |

### 2.3 Cores soltas e duplicadas (acidentes)

| Valor | Ocorrências | Onde | Observação |
| --- | --- | --- | --- |
| #EFE7DC | 5 | `Story`, `ProductGallery` (degradê de placeholder de imagem) | Duplica `--bege-soft`, em literal |
| #D6C4AB | 4 | mesmos 3 módulos (fim do degradê `160deg, #EFE7DC → #D6C4AB`) | **Sem token**; o `ProductCard` usa outro degradê (`--bege-soft → --bege`) |
| #C6A96B | 5 | `globals.css` (`.gold-text`, `.hairline`), `buttons.css` (`.btn-gold`), `NotFound` | Duplica `--dourado` |
| #B08968 | 4 | `globals.css`, `buttons.css`, `NotFound` (degradês) | Duplica `--caramelo` |
| #E0C896 | 2 | `globals.css` (`.gold-text`), `NotFound` | Sem token (meio do degradê dourado) |
| #D4BC85 | 2 | `buttons.css` (`.btn-gold`) | Duplica `--dourado-soft`, que ninguém usa via `var()` |
| #FFF | 3 | `buttons.css` (`.btn-gold` texto), `Products` (pill ativa) | Branco puro; o resto do site usa `--offwhite` |
| #FBF8F3, #F0E7D9 | 1 cada | `Hero` (`.logoCard`) | Degradê próprio do cartão do logo |
| #F2EADD, #DCCDB6 | 1 cada | `Featured` (`.featuredStage`) | Degradê próprio |

Em JSX, hex literais só existem em `DevTweaks.jsx` e `tweaks-panel.jsx` (dev). Nenhum hex literal em componente de produção.

**Regra vs. acidente:** os 12 tokens e o uso de `--vinho` para ação são regra. Os três degradês de placeholder de imagem (`bege-soft→bege`, `#EFE7DC→#D6C4AB`, `#F2EADD→#DCCDB6`), o `#FFF` e o `--dourado-soft` órfão são acidente.

`ProductSizeSelector.jsx` aplica `background: bl.color` (valor vindo de `products.js`) no swatch de cor; hoje só o id 17 usa `variationType: 'cor'`.

---

## 3. Tipografia

### 3.1 Famílias (de `variables.css`) e onde são realmente usadas

| Token | Pilha | Declarações `font-family` | Uso real |
| --- | --- | --- | --- |
| `--serif` | "Cormorant Garamond", "Times New Roman", serif | 19 (+ classe `.serif`) | Títulos de seção, nome do produto, preço, itens de acordeão, títulos das políticas, marca "PETLUXO", números do Hero, drawer do menu |
| `--sans` | "Inter", -apple-system, system-ui, sans-serif | 9 (+ herdado do `body`) | Texto corrido, botões (`.btn`), banner de cookies, FAQ, campo de busca, perguntas do FAQ da ficha |
| `--mono` | "JetBrains Mono", ui-monospace, monospace | **29** (a mais declarada) | Eyebrows, `.section-tag`, badges, pills, "VIA WHATSAPP", `small` dos cards, rodapé, `TrustBadges`, `Differentials .num`, rótulos do Hero |

Confirmado: as três famílias são usadas. A mono tem mais declarações e quase sempre em 9–12px, caixa alta, espaçamento largo: é a voz de "rótulo" do site.

Verificado na produção (390×844, `document.fonts`): na home e em `/produto/43` foram carregadas Cormorant 400, 500 e 400 itálico, Inter 400 e 600, JetBrains Mono 400.

### 3.2 Pesos carregados (`src/main.jsx`, `@fontsource`, subset latin)

| Família | Pesos importados |
| --- | --- |
| Cormorant Garamond | 400, 500, 400 itálico, 500 itálico |
| Inter | 300, 400, 500, 600 |
| JetBrains Mono | 400, 500 |

Pesos declarados no CSS: 500 ×6, 400 ×6, 600 ×3, 300 ×1; no JSX, 600 ×8 (títulos das políticas).

**Problemas de peso (acidentes):**

- **Cormorant Garamond não tem 600/700 carregado**, mas é pedido: `<h1>`/`<h2>` das 4 páginas de política com `fontWeight: 600`, e o `.trigger` do `Accordion` (`all: unset`) herda o negrito padrão do `<h3>` que o envolve. Medido na produção: título de acordeão = Cormorant **w700**; h2 de política = Cormorant **w600**. Como só 400/500 existem, o navegador sintetiza negrito (faux bold), de aparência diferente do resto do site.
- `FAQ.module.css` `.faqTitle` pede `font-weight: 300` em Cormorant (só 400/500 carregados): renderiza como 400.
- Inter 300 está importado e **não há** declaração de Inter 300 no CSS (o único `font-weight: 300` é o `.faqTitle`, que é serifa). JetBrains Mono 500: **não consta** uso confirmado (nenhum `font-weight: 500` em bloco com `var(--mono)` encontrado por grep).

### 3.3 Escala de tamanhos realmente usada

Declarações `font-size` em `src/**/*.css` (lembrando 1rem = 15px):

| Tamanho | Declarações | Onde (principais) |
| --- | --- | --- |
| **8px** | 1 | `Hero .heroMeta .v` (≤768px) |
| **9px** | 8 | `ProductCard` (`small` do nome, "VIA WHATSAPP", badge, `cardNote`), `Featured .small`, `Hero .floatCard .label`, `Hero .heroMeta .v` (≤480px) |
| **10px** | 16 | rodapé (títulos de coluna, social, base), `TrustBadges` (modal e mobile), `Differentials .num`, rótulos do Hero, `ProductCard .priceOriginal`, pills, `Story .manifesto`, `CTA .ctaMeta` |
| **11px** | 10 | `.eyebrow`, `.section-tag`, `ProductSizeSelector` rótulo, `specsList dt`, `sizeTable th`, `BrandSeal .title`, `TrustBadges` banner, botão WhatsApp da Navbar (inline), `.faqLabel` (0.6875rem) |
| **12px** | 10 | `.modalPriceOriginal`, `.fullDetailsLink`, `.backLink`, `.btn` ≤480px, `.waLink`, trigger e opções do `CategorySelector`, botões do banner de cookies, `ProductPage .priceOriginal` |
| **13px** | 10 | `.btn` (padrão), links da Navbar, `.footTag`, `Story p`, `Differentials p`, `.modalBullets li`, `BrandSeal .label`, `.sizeBtn`, `AnalyticsConsent .desc` (≤640px) |
| **14px** | 12 | `ProductPage` (bullets, `dd`, tabela, `plainList`), links do rodapé, `.emptySubtitle`, `Hero .heroSub` ≤480px |
| **15px** | 7 | `ProductPage` (subtítulo, descrição, texto de seção), `Hero .heroSub`, `html/body` |
| **16px** | 5 | `searchInput` (de propósito, contra zoom do iOS), `NotFound .notfoundSub`, parágrafo de `Featured`, `Hero .cornerTag b`, emoji do `BrandSeal` |
| **17–18px** | 4 + 5 | 17: preço do card, `Story .lead`, `CTA p`, `Featured .featuredPrice .v` (≤480px); 18: nome do card, `.floatCard .val`, `.heroMeta .k` (≤768px), `.modalClose`, `.brandMark` (≤480px) |
| **20–32px** | pontuais | drawer 20, `.heroMeta .k` 20/24, `Differentials h3` 26, preço da ficha/modal 30, `.footBrand` 32 |
| `clamp()` | 21 | todos os títulos de seção (ver 3.4) e alguns textos (`FAQ`, banner de cookies) |
| `rem` puro | 3 | 0.6875rem (10,3px), 0.875rem (13,1px), 0.9375rem (14,1px) |

Medido na produção, home 390px: **58 elementos de texto com 9px**, 26 com 10px, 8 com 11px, 13 com 13px (+14 com 13,1px), 19 com 14px, 38 com 17px e 38 com 18px (estes dois são nomes e preços dos cards repetidos nos carrosséis).

### 3.4 Títulos fluidos (`clamp`)

| Elemento | `font-size` | Arquivo |
| --- | --- | --- |
| Título do Hero | `clamp(46px, 4.6vw, 72px)`; ≤768px `clamp(32px, 5.5vw, 46px)`; ≤480px **28px fixo** | `Hero.module.css` |
| Título do `CTA` | `clamp(56px, 7vw, 110px)` (sem regra mobile) | `CTA.module.css` |
| Título de `Featured` | `clamp(44px, 5vw, 72px)` (sem regra mobile) | `Featured.module.css` |
| Título de `Differentials` | `clamp(44px, 5vw, 80px)` (sem regra mobile) | `Differentials.module.css` |
| Título de `Products` | `clamp(32px, 3.5vw, 52px)` | `Products.module.css` |
| Título de `Story` | `clamp(28px, 3vw, 48px)` | `Story.module.css` |
| Nome do produto (ficha) | `clamp(1.75rem, 3.5vw, 2.5rem)` = 26,25px a 390px (medido) | `ProductPage.module.css` |
| Título do acordeão | `clamp(1.2rem, 2.2vw, 1.6rem)` = 18px a 390px (medido) | `Accordion.module.css` |
| Título de política | `clamp(2rem, 4vw, 3rem)` (inline) | `PrivacyPage.jsx` e as outras 3 |
| 404 | número `clamp(100px, 20vw, 180px)`, título `clamp(36px, 6vw, 64px)` | `NotFound.module.css` |

**Inconsistência:** a 390px o termo em `vw` é sempre menor que o piso do `clamp`, então vale o piso. Derivado dos pisos, os títulos de seção a 390px são: Hero 28, Story 28, Products 32, **Featured 44, Differentials 44, CTA 56** (os três últimos sem regra mobile; o CTA tem `max-width: 18ch` e quebra em várias linhas).

### 3.5 Line-height, letter-spacing, text-transform

- **line-height** (16 valores distintos): base do body **1.6** (`globals.css`); corpo longo 1.65–1.75 (descrições; FAQ 1.75; políticas 1.8 inline); títulos 0.96–1.25 (`.serif` 1.05, Hero e CTA 0.96); mais usados: `1` (7×), `1.7` (6×), `1.5` (5×), `1.15` (4×).
- **letter-spacing** (21 valores distintos): rótulos mono em caixa alta usam 0.22em (8×), 0.18em (7×), 0.2em (5×), 0.15em (3×), 0.16em (2×), 0.14em, 0.12em, 0.3em; botões 0.08em; texto corrido 0.04em ou nenhum; títulos grandes negativos (-0.02em ×3, -0.04em). **Inconsistente:** valores em `px` (1px, 1.5px, 2px em `ProductPage` e `ProductSizeSelector`) convivem com `em`; e há 6 valores entre 0.12em e 0.22em sem escala.
- **text-transform:** `uppercase` em 33 pontos (rótulos mono, botões, "voltar", "ver ficha"); `none` em 1. Não há `capitalize`.
- **Itálico:** `.italic`/`<i>` para ênfase editorial em dourado; campo de busca em itálico.

### 3.6 Texto abaixo de 14px em texto corrido (risco no mobile)

Texto de leitura (não rótulo) com tamanho < 14px, a 390px:

| Texto | Tamanho | Arquivo |
| --- | --- | --- |
| Parágrafos da seção "Sobre" (`.storyText p`) | **13px** | `Story.module.css` |
| Descrição dos diferenciais (`.diffItem p`) | **13px** | `Differentials.module.css` |
| Tagline do rodapé (`.footTag`) | **13px** | `Footer.module.css` |
| Rótulos do `BrandSeal` | **13px** | `BrandSeal.module.css` |
| Descrição do banner de cookies | **13px** (≤640px; 12–13px acima) | `AnalyticsConsent.module.css` |
| Resposta do FAQ (`.faqAnswerText`) | **13,1px** (0.875rem) | `FAQ.module.css` |
| Pergunta do FAQ | 13,1px a 390px (`clamp(0.875rem, 1.4vw, 0.9375rem)`) | `FAQ.module.css` |
| Botões de tamanho (P/M/G) | 13px | `ProductSizeSelector.module.css` |

E informação comercial em **8–10px** (rótulos mono): "VIA WHATSAPP" e `cardNote` do card (9px), badge de produto (9px), `Featured .small` (9px), `Hero .heroMeta .v` (8–9px), rodapé e `TrustBadges` (10px). Esses rótulos carregam a forma de compra e o selo de promoção.

`ProductPage` usa 14–15px no corpo da ficha: é o ponto de leitura mais confortável do site.

---

## 4. Espaçamento, grid e layout

### 4.1 Container e gutters

| Item | Valor | Origem |
| --- | --- | --- |
| Largura máxima do container (`.wrap`) | `--max` = **1320px** | `variables.css`, `globals.css` |
| Padding lateral (`--pad`) | `clamp(24px, 4vw, 64px)`; a 390px = **24px** (o piso vale até 600px de largura) | `variables.css` |
| Políticas | `max-width: 800px`, padding `clamp(48px, 8vw, 96px) var(--pad)` (inline) | `PrivacyPage.jsx` e as outras 3 |
| Campo de busca | `max-width: 480px` | `Products.module.css` |
| Botões da ficha (`.buyStack`) | `max-width: 420px` (a 390px ocupa os 342px) | `ProductPage.module.css` |

### 4.2 Espaçamento vertical entre seções

- `.section-pad`: `clamp(80px, 12vh, 140px) 0`; ≤480px `clamp(52px, 8vh, 80px) 0` (`globals.css`). Está em `vh`: o espaçamento muda com a altura do aparelho, não com a largura.
- `#produtos.section-pad`: `clamp(36px, 4vh, 56px) 0` (exceção para a vitrine).
- `Story`: `clamp(40px, 5vh, 70px)` em cima e embaixo (não usa `.section-pad`).
- Ficha: `.page` `padding: 96px 0 clamp(80px, 12vh, 120px)` (96px fixos no topo por causa da Navbar fixa).
- Cabeçalho de seção: `.section-tag` com `margin-bottom: 28px`; `.productsHead` `margin-bottom: 36px` (40px ≤768px).

### 4.3 Escala de espaçamento realmente usada

**Não há escala declarada** (não existem tokens de espaçamento; `variables.css` tem só `--max` e `--pad`). Valores recorrentes de `gap`/`padding`/`margin`: **8, 12, 16, 24** (dominantes: pontos, botões, grades, itens de lista), **28 e 36** (cabeçalhos), **40, 44, 48, 64** (blocos). Valores soltos fora de qualquer ritmo: 14, 18, 22, 26, 80, 90 (`Featured .featuredGrid` gap 90px; `Hero .heroGrid` gap 80px; ambos caem para 40px ≤980px).

Padrões de card e controle:

| Elemento | Padding / gap |
| --- | --- |
| `.btn` | `16px 28px`, gap 12px; ≤480px `14px 22px` |
| Card de produto (`.meta`) | `14px 4px 0`, gap 6px; badge a 16px da borda |
| Carrossel (`.carouselItem`) | `0 12px` (calha de 24px entre cards); `.carouselOuter` com margem -12px |
| Banner de cookies | `clamp(14px, 3vw, 20px)`; ≤640px `clamp(12px, 4vw, 16px)`; encostado a 28px (16px ≤640px) das bordas |
| Acordeão (`.trigger`) | `22px 2px` |
| FAQ (`.faqItem`) | `1.25rem 1.5rem` (18,75px 22,5px) |
| Navbar | `18px 0` (12px rolada); drawer da Navbar `0 var(--pad) 28px` |

### 4.4 Colunas da grade de produtos, por largura

Há **dois mecanismos diferentes**, com limites diferentes:

| Largura | Carrossel (`ProductGrid.jsx`, **JS**: `window.innerWidth`) | Grade de resultados de busca/filtro (`Products.module.css`, **CSS**) |
| --- | --- | --- |
| < 640px | 1 card por página | 1 coluna (≤640px) |
| 641–979px | 2 cards (<1024px) | 2 colunas (≤980px) |
| 980–1023px | 2 cards | **3 colunas** (inconsistente: A = 2 no carrossel, B = 3 na grade) |
| ≥ 1024px | 3 cards | 3 colunas |

Medido na produção a 390px: cada card tem **342 × 426px** (imagem 342 × 342 + ~84px de texto); ou seja, no celular aparece **um produto por vez**, e o carrossel pagina de 1 em 1 (dots e setas) em vez de rolar. Por isso a home tem 36 `<article>` (os mesmos produtos se repetem nos carrosséis de categoria).

Outras grades: Footer 5 colunas (1.4fr 1fr 1fr 1fr 1fr, gap 40px) com colapso 980/860/540 (ver 5); `Differentials` 4 → 2 (≤980) → 1 (≤768); FAQ 2 → 1 (≤768); `BrandSeal` 2 → 1 (≤640); `TrustBadges` linha → grade 2×2 (≤640); `Hero` 2 colunas (1.05fr 0.95fr) → 1 (≤980); `Featured` e `Story` 2 → 1 (≤980); ficha `1fr 1fr` → 1 coluna (≤900).

---

## 5. Breakpoints e responsividade

### 5.1 Meta viewport e zoom

- `index.html`: `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>` e `<meta name="theme-color" content="#6B1E2B"/>`. Não há `user-scalable=no` nem `maximum-scale`.
- **O pinch-zoom é livre** (WCAG 1.4.4): não há `touch-action: pan-x pan-y` nem bloqueio de `gesture*`. Carrosséis e galeria usam `touch-action: pan-y pinch-zoom`.
- O layout mobile usa `env(safe-area-inset-*)` (`--m-safe-top` e `--m-safe-bottom`, seção 14); o desktop não.

### 5.2 Todos os `@media` encontrados

Abordagem: **desktop-first** (quase todos `max-width`); a única exceção é `min-width: 641px` em `Products.module.css`.

| Breakpoint | Blocos | O que muda |
| --- | --- | --- |
| `max-width: 980px` | 17 | Navbar vira hambúrguer; Hero/Featured/Story/ficha-modal em 1 coluna; Hero reduz palco (500px) e `logoCard` (300×384); `Differentials` 4→2 col; Footer vira 1 col; grade de resultados 3→2; `.carouselSingle` 50% |
| `max-width: 900px` | 1 | `ProductPage .layout` 2→1 coluna |
| `max-width: 860px` | 2 | Footer volta para 2 colunas (**inconsistente**: ver 5.4) |
| `max-width: 768px` | 20 | Hero: título `clamp(32px, 5.5vw, 46px)`, anéis e cartões flutuantes `display: none`, palco 370px, botões 100%, `heroMeta` com `.v` em 8px; `Differentials` 1 col; FAQ 1 col; `Products` cabeçalho em coluna; `CTA` botões em coluna (max 360px); Modal: padding 16, imagem com `max-height: 220px`, botão fechar 44px; carrossel: setas 44px e setas laterais ocultas; `Featured` palco 280px; `Story` foto `max-height: 360px`; Footer `footBottom` em coluna; `globals.css` quebra de palavra em `.eyebrow` |
| `max-width: 640px` | 6 | Grade de resultados em 1 col; regras de rolagem horizontal das pills (**código morto**: nesta largura o contêiner das pills está `display: none`); `BrandSeal` 1 col; `TrustBadges` 2×2; banner de cookies em largura total com margem 16px |
| `min-width: 641px` | 2 | Mostra pills (desktop) e esconde o `CategorySelector` (mobile; é o padrão sem media query) |
| `max-width: 540px` | 2 | Footer em 1 coluna |
| `max-width: 480px` | 16 | `.btn` 14/22px e 12px; Hero título 28px, palco 288px, `logoCard` 192×247, `heroMeta` 1 coluna, `.v` 9px; Navbar marca 18px/logo 32px; **Modal esconde a foto** (`.modalArt { display: none }`); carrossel `.carouselSingle` 100%; `Featured` preço 17px; `Differentials` título `margin-bottom: 40px`; Footer marca 26px; `.section-pad` menor |

Total: **66 blocos** (768: 20, 980: 17, 480: 16, 640: 6, 641 min: 2, 860: 2, 540: 2, 900: 1). Os breakpoints em **JS** são outros: `ProductGrid.jsx` usa 640 e 1024; `ProductGallery.jsx` usa `useIsMobile(640)` e `matchMedia('(pointer: coarse)')`.

### 5.3 O que NÃO tem tratamento mobile (ou tem tratamento fraco)

1. **Ficha de produto desktop (`ProductPage.module.css`):** só existe o breakpoint de 900px (o mobile tem ficha própria, seção 14).
2. **Estados de hover sem equivalente touch:** 38 regras `:hover` e **0** `@media (hover: hover)`. O botão "Visualizar" do card (`.qaBtn`, 36×36) só aparece em `:hover` (opacidade 0 por padrão): medido na produção em celular, `opacity: 0`, ou seja, **nunca visível no toque**. O hover do card (`translateY(-6px)` + sombra) e dos botões (`translateY(-2px)`) "gruda" após o toque.
3. **Páginas de política (desktop):** estilos inline sem nenhum `@media` e sem módulo CSS (o mobile tem layout próprio, seção 14).
4. **`Featured`, `Differentials`, `CTA`:** títulos `clamp` com piso de 44–56px sem regra mobile (ver 3.4); `CTA` tem anéis decorativos de 600/800/1000px fixos (cortados por `overflow: hidden`).
5. **Unidades de viewport (desktop):** `NotFound` usa `100vh`; só `Hero` (`100svh`) e `CategorySelector` (`100dvh`) tratam a barra de endereço dinâmica. O mobile usa `100dvh` (seção 14).
6. **Safe area:** só o layout mobile e o banner de cookies mobile usam `env(safe-area-inset-*)`.
7. **Footer em cascata errada** (ver 5.4).
8. **`prefers-reduced-motion` no desktop:** não consta; o layout mobile e o banner de cookies mobile respeitam (seção 14.8).

### 5.4 Cascata do Footer (acidente)

`Footer.module.css` declara, nesta ordem: `≤980px → 1 coluna`, `≤860px → 2 colunas`, `≤540px → 1 coluna`. Como `max-width` mais estreito vem depois e vence, o resultado é: 981px+ → 5 colunas; **861–980px → 1 coluna**; **541–860px → 2 colunas**; ≤540px → 1 coluna. Ou seja, a coluna única "reaparece" depois de uma de 2 colunas ao estreitar. O comentário do `980px` diz "desktop compacto", o que indica ordem acidental.

---

## 6. Forma e profundidade

### 6.1 `border-radius` (contagem em `src/**/*.css`)

| Valor | Ocorrências | Uso |
| --- | --- | --- |
| `50%` | 16 | círculos: botões redondos (setas, fechar, qaBtn), dots, discos do logo, anéis |
| `999px` | 8 | pílulas: `.btn`, badge do card, pills, trigger/opções do `CategorySelector`, dot ativo |
| `6px` | 7 | modal, `.mainImageWrap`, `.mobileViewport`, `.floatCard`, `.featuredPrice`, `BrandSeal` |
| `4px` | 7 | placeholder do card (`.stage`), `.thumb`, `.sizeBtn`, `.storyArt`, `.faqGrid` |
| `2px` | 3 | campo de busca, handle do `CategorySelector`, foco do acordeão |
| `8px` | 2 | `.navBurger`, `.logoCard` (Hero) |
| `10px` | 2 | **botões do banner de cookies** |
| `12px` | 1 | **banner de cookies** |
| `0` | 1 | `.sheet` do `CategorySelector` |

**Regra:** pílula (999px) para ação/seleção, círculo para ícone, 4–6px para superfícies e imagens. **Acidente:** os botões do banner de cookies (radius 10px, fonte 12–13px em peso 600) são um segundo sistema de botão paralelo ao `.btn` global (radius 999px, 500).

### 6.2 Bordas

Dominante: `1px solid` com cor translúcida (`rgba(42,37,34,0.06–0.18)`, `rgba(198,169,107,0.18–0.5)`, `rgba(176,137,104,0.18–0.3)`) ou `var(--bege)`. Exceções: `1.5px solid var(--vinho)` (`.btn-outline`, `.btnDeny`), `2px` em `.thumbActive` e nos anéis de foco (`outline: 2px solid`), `0.5px` em `FAQ` (grade e ícone).

### 6.3 Sombras (`box-shadow`)

Não há token. 16 declarações distintas de uma linha, nenhuma repetida mais de 2 vezes, mais 3 multilinha (`Hero .logoCard`, `Featured .featuredStage`, `Story .storyArt`). Famílias:

- **Realce interno** `0 1px 0 rgba(255,255,255,0.6–0.9) inset` (cards e botões).
- **Botão primário:** `0 10px 30px -12px rgba(107,30,43,0.5)` + inset; hover `0 16px 40px -12px rgba(107,30,43,0.55)`.
- **Botões flutuantes pequenos** (setas, zoom): `0 4px 14px -4px rgba(42,37,34,0.25)` (2×) e `0 4px 16px -4px rgba(42,37,34,0.18)`.
- **Card em hover:** `0 30px 60px -25px rgba(42,37,34,0.25)`.
- **Modal:** `0 50px 100px -30px rgba(0,0,0,0.4)`; banner de cookies: `0 10px 34px -10px rgba(42,37,34,0.30)`.

Padrão: offset-y grande, blur largo e spread negativo (sombra "longa e suave"). É regra de estilo, mas com ~19 valores distintos.

### 6.4 Transições e animações

- **48 declarações `transition`**; 13 usam `transition: all` (inclui `.btn`, `ProductCard .stage`, `Navbar .nav`). Durações mais frequentes (por termo de tempo): **0.2s ×18, 0.3s ×16, 0.4s ×8, 0.25s ×5**; 0.35, 0.45, 0.5, 0.55, 0.6, 0.7 e 1s aparecem 1–3 vezes cada.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (16 vezes; "expo-out", é a assinatura do site) em movimentos grandes (`.btn`, card, `.reveal` 1s, drawer, carrossel 0.55s); `ease` em 12 pontos (microinterações, acordeão 0.35s, FAQ 0.3s); o resto sem easing explícito.
- **`.reveal`** (`globals.css`): `opacity: 0` + `translateY(28px)`, transição de 1s, atrasos `.d1–.d5` de 0.08s a 0.40s; ativado por `IntersectionObserver`. Se o JS não marcar `.in`, o conteúdo fica invisível.
- **Animações `@keyframes`:** `heroRise` 1.2s (título), `heroFade` 1s com atrasos 0.6/0.8/1s, `heroFloaty` 7s/9s `infinite` (cartões flutuantes, ocultos ≤768px), `stageRotate` 80s `linear infinite` (anel decorativo, oculto ≤768px), `scrollCueLine` 2.4s `infinite`, `resultFadeIn` 0.4/0.5s.
- **`prefers-reduced-motion`: não consta** (0 ocorrências). As animações infinitas, o `.reveal` e `scroll-behavior: smooth` não têm versão reduzida.

### 6.5 `z-index`

Tokens (`variables.css`): `--z-base` 1, `--z-dropdown` 10, `--z-navbar` 100, `--z-overlay` 900 (**0 usos**), `--z-modal` 1000, `--z-above-modal` 1100.

| Valor | Elemento |
| --- | --- |
| 1100 (`--z-above-modal`) | banner de cookies; portal do lightbox (`--yarl__portal_zindex`) |
| 1000 (`--z-modal`) | backdrop do `CategorySelector` |
| 200 (**literal**) | `.grain` (textura global, `pointer-events: none`; fica acima da Navbar de 100) |
| 100 (`--z-navbar`) | Navbar e drawer |
| 10 (`--z-dropdown`) | setas e botão de zoom da galeria |
| 2 / 1 / 0 (**literais e `--z-base`**) | `Featured` (tag/preço 2), `Hero` (2), `.modalClose` (2), conteúdos sobre fundos decorativos |

Inconsistência: `--z-overlay` não é usado, e a ordem do arquivo (overlay 900, modal 1000, navbar 100) não segue a ordem numérica.

---

## 7. Componentes

Medidas de toque marcadas "(medido)" vêm do navegador (Chromium, 390×844, produção, 2026-11-18); as demais saem do CSS.

### 7.1 Navbar (`layout/Navbar.jsx`, `Navbar.module.css`)

- **Estrutura:** `<header>` fixo (z 100) → `.wrap.navInner` em grade `1fr auto 1fr`: links âncora à esquerda ("Produtos", "Sobre", "FAQ", "Contato", 13px), marca no centro (disco do logo 38px + "PETLUXO" serif 22px, `letter-spacing` 0.16em), botão WhatsApp à direita (`.btn.btn-primary` com `padding: 10px 18px; fontSize: 11` **inline**). ≤980px: links e botão somem; fica a marca e o **hambúrguer 44×44** (medido; radius 8px, 3 linhas de 1px).
- **Drawer** (≤980px): painel absoluto abaixo do header, links serif 20px com `padding: 18px 0` (≈68px de altura cada) e filete de 1px; abre com `translateY` + opacidade 0.4s.
- **Estados:** rolagem > 24px troca fundo transparente por `rgba(248,246,243,0.78)` com `blur(18px)`, borda inferior dourada e padding 18→12px. Links têm sublinhado animado no `:hover`. Hambúrguer vira "X" (`navBurgerOpen`). **Não há** `:focus-visible`, `:active` nem estado de link ativo.
- **Problemas visíveis no código:** (a) o CSS define `.navDrawerCta`, mas o JSX do drawer **não renderiza o botão de WhatsApp**: no celular o único acesso ao WhatsApp pela Navbar não existe; (b) o drawer usa `aria-hidden={!open}`, mas os links continuam no DOM e, pelo CSS (só `opacity: 0` e `pointer-events: none`), provavelmente focáveis com o menu fechado (não testado em runtime); (c) não há fechamento por Escape nem por clique fora; (d) nas páginas de política a Navbar usa `href="#produtos"`, `#sobre`, `#faq`, `#contato`, âncoras que só existem na home; (e) o logo nas subpáginas é `<a href="/">` (recarrega) em `MinimalNavbar`.

### 7.2 MinimalNavbar (`layout/MinimalNavbar.jsx`, reusa `Navbar.module.css`)

Só a marca (disco + "PETLUXO") dentro de `.wrap`; mesmo comportamento de rolagem. Sem menu, sem WhatsApp, sem link "Voltar" (esse fica no corpo da ficha). Usada só em `/produto/:id` com produto existente. O `<a href="/">` ocupa a largura inteira do container (342×32, medido). Recarrega a página ao clicar (`<a>` em vez de `Link`).

### 7.3 Card de produto (`product/ProductCard.jsx`, `ProductCard.module.css`)

- **Estrutura:** `<article class="reveal dN">` → `.stage` (quadrado `aspect-ratio: 1/1`, radius 4px, fundo degradê `--bege-soft → --bege`) com `<img>` `object-fit: contain` (estado atual: o card mostra a foto inteira em quadro fixo 1:1 sobre o fundo bege; faixas aparecem em fotos não quadradas), botão `.qaBtn` 36×36 (canto superior direito) e badge (canto inferior direito, pílula vinho, mono 9px, caixa alta, padding 6/12); abaixo `.meta`: nome serif 18px/1.15, `cardNote` (9px caramelo, só o id 20), `originalPrice` (10px mono riscado), preço serif 17px `--ink`, e "VIA WHATSAPP" mono 9px.
- **Estados:** `:hover` levanta o `.stage` 6px + sombra; `.qaBtn` aparece em hover. Não há `:focus-visible`, `:active` nem estado indisponível (o badge "ESGOTADO" é só rótulo).
- **Tamanho de toque:** o card inteiro é a área de toque (342×426, medido); o `.qaBtn` (36px) não é alcançável no toque.
- **Navegação:** o card sempre leva a `/produto/:id` (sem modal). **Problemas:** o clique está num `<article onClick>`, sem `<a>`, `role`, `tabIndex` nem `onKeyDown` (`ProductCard.jsx`): **não é acessível por teclado nem abre em nova aba**; `.badge:global(.gold)` e `.name small` são estilos sem uso no JSX; o `.qaBtn` tem `aria-label="Visualizar"` mas nenhum handler próprio.

### 7.4 Grade e carrossel (`product/ProductGrid.jsx`, `ProductGrid.module.css`)

Carrossel próprio: trilha com `translateX` (0.55s), item `perView` 1/2/3 (640/1024, JS). Swipe com limiar de 50px; `.carouselViewport` com `touch-action: pan-y`. Controles: setas 48px (44px ≤768px, medido 44×44) abaixo do carrossel, **setas laterais só em desktop** (ocultas ≤768px), dots 6×6 (ativo 24×6; **medido 24×6 e 6×6**: área de toque minúscula). Estados: seta `:hover` (caramelo) e `:disabled` (opacidade 0.25). `.carouselSingle` (poucos produtos) força `width: calc(100%/3) !important` e mais 4 `!important`. Título do carrossel serif `clamp(20px, 2vw, 28px)`.

### 7.5 Busca, filtro por categoria e pills (`sections/Products.jsx`, `ui/CategorySelector.jsx`)

- **Busca:** `.searchBox` bege-soft radius 2px, `<input>` Inter itálico **16px** (de propósito, para o iOS não dar zoom), altura ≈39px; foco só troca a borda para `--dourado` (`outline: none`).
- **Mobile (≤640px):** `CategorySelector`: trigger 44px de altura (pílula, mono 12px, 0.15em), abre painel **tela cheia** (100dvh), lista com opções `min-height: 44px`, fecha com Escape e devolve o foco; botão X 36×36 (abaixo de 44px); `aria-haspopup="dialog"`, `role="dialog"`, `aria-modal`.
- **≥641px:** pills mono 10px, padding 6/14 (≈28px de altura, só desktop), ativa em vinho com texto `#FFF`.

### 7.6 Produto sem ficha

Não existe modal de produto: todo card leva a `/produto/:id`. Produto visível sem entrada em `PRODUCT_DETAILS` (ids 14, 18, 24, 25, 30, 31) abre a página normalmente, sem os acordeões (mobile: `MobileProductSimple`).

### 7.7 Ficha de produto (`pages/ProductPage.jsx`, `ProductPage.module.css`)

- **Estrutura (≤900px, 1 coluna):** `MinimalNavbar` → link "← VOLTAR PARA A LOJA" (12px caixa alta, **19px de altura**, medido) → galeria → nome (h1 serif 26,25px) → subtítulo 15px → preço 30px vinho (por tamanho) → descrição 15px/1.75 → bullets 14px (marcador "—" caramelo) → seletor de tamanho → botão de compra + `DELIVERY_NOTE` (classe `.deliveryNote`, 0.8125rem, `--ink-soft`) + `TrustBadges` → `BrandSeal` → acordeões (`.details`, `border-top` bege).
- **Acordeões na ordem fixa:** specs, tabela de medidas, como escolher o tamanho, nota do guia, o que acompanha, cuidados, viagem aérea, garantia, FAQ. Specs em `dl` de duas colunas (`max-content 1fr`, gap 10/24px, `dt` 11px caixa alta); tabela de medidas com `white-space: nowrap` dentro de `.tableWrap { overflow-x: auto }` (rola na horizontal no celular).
- **Problemas:** 4 pontos de estilo inline em `ProductPage.jsx` (margens das listas de garantia e FAQ); sem tratamento ≤480px (ver 5.3); a classe `price` vem com `serif` e cor vinho, mas o tamanho de 30px é fixo.

### 7.8 Galeria, carrossel e zoom (`product/ProductGallery.jsx`, `ProductLightbox.jsx`)

- **< 640px (JS `useIsMobile(640)`):** carrossel arrastável (trilha `translateX` 0.4s, swipe 50px, `touch-action: pan-y`); cada slide `aspect-ratio: 1/1` com `<img> object-fit: contain` sobre degradê `#EFE7DC → #D6C4AB` (**as fotos não-quadradas ficam com faixas de bege**; visível no print do id 45, foto 4:5 em quadro quadrado); setas 36×36 sobrepostas (esq./dir. 10px, fundo offwhite 0.9) **também no celular**; dots 6×6 (ativo 20×6, medido) abaixo.
- **≥ 640px:** coluna de miniaturas 72×72 à esquerda (radius 4, borda 1px bege; ativa 2px vinho) + imagem principal 1:1 com `contain`; botão de lupa 30×30 (ativo em vinho); em `pointer: fine` o zoom é hover (`background-size: 200%` seguindo o mouse); em `pointer: coarse` tocar na foto abre o lightbox.
- **Lightbox (`yet-another-react-lightbox` + plugin Zoom, carregado sob demanda):** fundo `--ink` opaco, botões offwhite, ativo dourado, ícones 26px, `maxZoomPixelRatio: 2`, `scrollToZoom: false`; único lugar onde o pinch-zoom é permitido.
- **Problemas:** alvos de toque pequenos nos dots (6px) e na lupa (30px); sem `:focus-visible` próprio nas setas, miniaturas e dots; no mobile as miniaturas não existem (só dots).

### 7.9 Seletor de tamanho / cor (`product/ProductSizeSelector.jsx`)

Rótulo Inter 11px, caixa alta, `letter-spacing: 2px`; botões `.sizeBtn` padding 6/16, 13px, borda 1px vinho, radius 4px, ativo preenchido de vinho; `aria-pressed`. **Medido: 44–50 × 35px** (altura abaixo de 44px). Sem `:hover`, `:focus-visible` nem `:disabled`. Variante de cor mostra um swatch de 12px (`background` vindo do catálogo).

### 7.10 Botão de compra (`product/ProductBuyButton.jsx`, `ProductBuyButton.module.css`, `styles/buttons.css`)

- **Estado atual (`HIDE_BUY_CTA = true`):** só "CONSULTAR VIA WHATSAPP", `.btn.btn-primary.btn-full`: pílula vinho, 13px (12px ≤480px), caixa alta, `letter-spacing` 0.08em, padding 16/28 (14/22 ≤480px), ícone de WhatsApp 16px; **342×47px medido**.
- **Estados do CSS:** `:hover` (sobe 2px, sombra maior, `--vinho-soft`). `:active`, `:focus-visible` e `:disabled` **não constam** em `.btn`.
- **Variantes em `buttons.css`:** `.btn-primary`, `.btn-ghost` (borda 1px ink 0.18), `.btn-outline` (borda 1.5px vinho), `.btn-gold` (degradê dourado, texto `#fff`), `.btn-full`. O arquivo diz "evolução futura: Button.jsx quando variantes > 6".
- **ESGOTADO:** botão `disabled` com `style={{ opacity: 0.5, cursor: 'not-allowed' }}` inline + link de WhatsApp em texto (`.waLink`: 12px, ink-soft, `padding: 8px 0`, ≈36px).
- **Se `HIDE_BUY_CTA` virar `false`:** aparece "COMPRAR AGORA" como botão primário e o WhatsApp volta a ser o link de texto `.waLink` (menor, abaixo de 44px de altura). O redesign deve prever os dois estados.
- Mensagem do WhatsApp: ver seção 10.

### 7.11 Acordeões (`ui/Accordion.jsx`, `Accordion.module.css`; e `sections/FAQ.jsx`)

- **`Accordion` (ficha):** `<h3>` > botão com `all: unset`, flex entre título e chevron caramelo (gira 180°), `padding: 22px 2px` (**342×73 medido**), título Cormorant 18px (renderiza em **w700**, ver 3.2); painel por `grid-template-rows 0fr → 1fr` em 0.35s; `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby`. Estados: `:hover` e `:focus-visible` mudam o título para vinho; foco com `outline: 2px solid var(--vinho)` (`offset 4px`). Cada item tem estado próprio (vários abertos).
- **`FAQ` (home):** outro padrão: `<div role="button" tabIndex=0>` com `onKeyDown` Enter/Espaço, `aria-expanded`, ícone "+" 20px que gira 45°, **só um item aberto por vez**, resposta com `max-height: 200px` (**pode cortar respostas longas em coluna estreita**), pergunta Inter 13,1px/500. Grade de 2 colunas com divisórias de 1px (1 coluna ≤768px). Foco `outline: 2px solid var(--dourado)` (cor diferente do acordeão da ficha).
- **Inconsistência:** dois componentes de acordeão com visual, comportamento e cor de foco diferentes.

### 7.12 Badges e selos

- **Badge de produto:** 5 valores permitidos (`MAIS VENDIDOS`, `PREMIUM`, `NOVO`, `EXCLUSIVO`, `ESGOTADO`), todos renderizados no card igual (pílula vinho, mono 9px). A variante `.gold` existe só no CSS.
- **`TrustBadges`:** variante `banner` (faixa bege-soft logo abaixo do Hero; 4 itens mono 11px com ícone dourado; ≤640px grade 2×2 com 10px) e variante `modal` (ficha, 10px, opacidade 0.75). Conteúdo: "Compra Segura", "Troca em 7 dias", "Entrega Rastreada", "Atendimento Humanizado".
- **`BrandSeal`:** cartão bege-soft radius 6px com 6 itens (emoji + frase 13px), 2 colunas (1 ≤640px). Usa **emojis** (🤎 🚚 🛡️ 💬 🐾 ✨) como ícones, enquanto o resto do site usa SVG linear.
- Os ícones dourados (`--dourado`) dos selos ficam sobre bege-soft: contraste baixo (ver 9).

### 7.13 Banner de cookies (`ui/AnalyticsConsent.jsx`, `AnalyticsConsent.module.css`)

**Desktop (≥768px):** fixo no canto (28px do canto inferior direito, até 400px), z 1100, radius 12px, borda 1px bege, `max-height: 84vh` com scroll. Título Inter 600 vinho (16px), texto 13px, dois botões empilhados 100% de largura ("Aceitar analytics" preenchido vinho, "Recusar analytics" com borda 1.5px vinho; padding 11/16, 13px, 600, radius 10px). **Mobile (<768px):** folha inferior (seção 14.6). `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby/aria-describedby`; foco programático no banner (no desktop desenha o contorno preto padrão do navegador). Estados: `:active`, `:focus-visible` (2px vinho), `:hover`. Reabre por "Preferências de cookies" no rodapé.

### 7.14 Rodapé (`layout/Footer.jsx`, `Footer.module.css`)

Fundo offwhite com `border-top`; 5 colunas (marca, Produtos, Sobre, Políticas, Contato); títulos mono 10px caixa alta; links 14px com gap de 12px (≈22px de altura de linha, calculado do CSS, **abaixo de 44px**); "Preferências de cookies" é `<button class="linkButton">`; marca "PetLuxo" serif 32px (26px ≤480px) com "Pet" em itálico dourado; faixa social (Instagram, mono 10px + ícone 16px) e base mono 10px "© 2026 PETLUXO · CNPJ …". Cascata de breakpoints errada (5.4). `.footBottom .links` está reservado e sem uso.

### 7.15 NotFound (`sections/NotFound.jsx`, `NotFound.module.css`)

`min-height: 100vh`, centrado, fundo offwhite com radial dourado 0.12 em baixo; "404" serif com degradê dourado `clamp(100px, 20vw, 180px)`, título h1 serif `clamp(36px, 6vw, 64px)` com "encontrada." em itálico dourado, texto 16px, botão `.btn.btn-primary` "Voltar para a home" (`Link` para `/`). Renderizado dentro de Navbar + Footer por `NotFoundPage` (mobile: `MobileNotFound`, seção 14.7). O Worker responde 404 + `noindex` só em `/produto/*`; no resto das rotas inexistentes o status é 200 (soft 404; `AI_CONTEXT_PETLUXO.md`).

### 7.16 Páginas de política (`pages/PrivacyPage.jsx`, `ReturnPolicyPage.jsx`, `ShippingPolicyPage.jsx`, `TermsPage.jsx`)

Layout de texto (`PolicyLayout`; mobile: `MobilePolicyLayout`, seção 14.7; textos finais do advogado aplicados em 2026-11-20, a lista de direitos da Privacidade usa `<ul>` sem marcadores porque os itens trazem os algarismos romanos I a X) 100% inline no desktop: coluna de 800px, Inter herdado (15px/1.8), h1 serif `clamp(2rem, 4vw, 3rem)` em vinho peso 600, h2 `clamp(1.25rem, 2.5vw, 1.6rem)` em vinho peso 600, "Última atualização" 13,1px com filete bege. O bloco de estilos inline e o `Section` ficam em `PolicyLayout.jsx`. Usam `Navbar` completa e `Footer`. Sem `@media`. Problemas: negrito sintético (3.2), âncoras de menu que não existem nessas rotas (7.1).

### 7.17 Seções de marketing da home (resumo)

`Hero` (100svh, título em 3 linhas com animação de subida, 1 CTA "Ver produtos", 3 métricas, cartão do logo 192×247 a 390px), `TrustBadges` banner, `Featured` (fundo bege, só o produto `featured: true`), `Products` (vitrine), `Story` (foto 4:5 com moldura `outline` deslocada 10px), `Differentials` (fundo escuro, 4 itens), `CTA` (título gigante + 2 botões), `FAQ`. Todas usam `.reveal` com atrasos escalonados.

---

## 8. Imagens

### 8.1 Padrão de nomes e caminhos

- Produtos: `public/images/products/<slug>/principal.webp` (obrigatório, usado em card, modal, destaque e `og:image`) + `<slug>-2.webp`, `<slug>-3.webp`… (galeria da ficha, listada em `PRODUCT_DETAILS[id].gallery`). Servidas como `/images/products/<slug>/…`.
- O `slug` é o nome da pasta, em geral derivado do nome do produto (`kit-elan-rosa`, `porta-saquinhos-premium-elan`). Há pastas legadas fora do padrão (`cama-suspensa-rattan-aura/` com `01.webp…`, `manta-serenity-petluxo-premium/` com prefixo `manta-serenity-`).
- Marca e hero (importados pelo Vite, em `assets/`): `logo.webp`, `hero/image-hero.webp`, `sobre_nos/*.webp`. Compartilhamento: `public/og-image.jpg` (1200×630) e `og-image.png` (1536×1024).
- Formato: todas as fotos de produto são WebP (97 arquivos `.webp` em `public/images/products`; conferido com `file`: "Web/P image"). O limite combinado de ~150 KB não é validado: 23 dos 97 passam disso.

### 8.2 Proporções reais (40 fotos principais, `identify`)

Amostra pedida (ids 43, 44, 45) e mais 5 produtos variados:

| id | Pasta | Dimensões | Proporção (L/A) | Fotos na pasta |
| --- | --- | --- | --- | --- |
| 43 | `kit-elan-rosa` | 1536 × 1024 | 1,50 (paisagem 3:2) | 5 (galeria: 1,50 ×3, 1,499, **0,914** na foto 5) |
| 44 | `peitoral-elan-signature` | 1312 × 1199 | 1,09 (quase quadrada) | 5 (1,09 ×4, 1,00 ×1) |
| 45 | `porta-saquinhos-premium-elan` | 1122 × 1402 | 0,80 (retrato 4:5) | 4 (todas 0,80) |
| 40 | `polvo-mimo` | 1064 × 1620 | **0,66** (a mais vertical) | 2 |
| 21 | `executive-bed` | 1086 × 1448 | 0,75 (retrato 3:4) | 5 |
| 2 | `refugio-cozy` | 1168 × 1346 | 0,87 (retrato leve) | 2 (0,87 e 0,80) |
| 33 | `reservatorio-cozy` | 1254 × 1254 | 1,00 (quadrada) | 2 |
| 36 | `comedouro-nomade-premium` | 1152 × 918 | 1,25 (paisagem 5:4) | 3 |

Panorama das 40 fotos principais:

- **Faixa:** de **0,66** (`polvo-mimo`) a **1,57** (`bolsa-termica-signature-matelasse`, 1278 × 816).
- **28 proporções distintas** em duas casas decimais; as repetidas: 0,75 (3 fotos), 0,80 (3), 1,00 (3), 1,33 (2), 1,50 (2), 1,02 (2), 1,03 (2), 1,09 (2), 1,25 (2).
- **Por grupo:** 13 retrato (< 0,90), 16 quase quadradas (0,90–1,10), 11 paisagem (> 1,10).
- Dentro da mesma galeria a proporção também varia (id 43: paisagem 3:2 e uma retrato; id 44: quase quadrada e quadrada; id 2: 0,87 e 0,80).
- O padrão de proporção **não é uma regra do projeto**: as fotos entram como o fornecedor ou o gerador de imagem entregou (fluxo de `_incoming/` converte sem redimensionar: `AI_CONTEXT_PETLUXO.md`, seção Imagens).

### 8.3 Como cada componente trata a proporção

| Componente | Tratamento | Efeito |
| --- | --- | --- |
| Card (`ProductCard.module.css`) | Quadro `aspect-ratio: 1/1`, `<img>` `position: absolute; object-fit: cover` | **Recorta** fotos retrato e paisagem (um retrato 0,66 perde ~34% da altura; uma paisagem 1,57 perde ~36% da largura) |
| Galeria da ficha (`ProductGallery.module.css`) | Quadro `aspect-ratio: 1/1`, `object-fit: contain`, fundo degradê bege | **Letterbox**: faixas bege nas laterais (retrato) ou em cima/baixo (paisagem); sem recorte |
| Destaque (`Featured.module.css`) | `object-fit: contain; object-position: center bottom`, `min-height: 420px` (280px ≤768px) | Sem recorte, alinhada à base |
| Hero (`Hero.module.css`) | `.logoCard img` `object-fit: cover`, `mix-blend-mode: multiply`, cartão fixo 360×468 (192×247 a 390px) | Proporção fixa do cartão |
| Story (`Story.jsx`) | `object-fit: cover` (inline) em quadro `aspect-ratio: 4/5` | Recorte para 4:5 |
| Lightbox | Imagem inteira, zoom até 2× o pixel ratio | Sem recorte |

Resumo: o site usa **três tratamentos diferentes** (cover 1:1 no card, contain 1:1 na ficha, cover+scale no modal) para as mesmas fotos; **nenhum** componente usa altura fixa em px para imagens de produto, e só o card e a galeria usam `aspect-ratio`. As miniaturas da galeria (72×72) usam `cover`. Nenhuma `<img>` de produto declara `width`/`height` (risco de salto de layout; as caixas com `aspect-ratio` o mitigam).

O Worker de SEO usa a foto principal em `og:image`, que pode ser vertical (`AI_CONTEXT_PETLUXO.md`).

---

## 9. Acessibilidade observada

### 9.1 Foco visível

Estilo de foco próprio em **4 componentes** apenas: `Accordion .trigger`, `AnalyticsConsent .btn` e `FAQ .faqItem` (por `:focus-visible`, 4 declarações no total) e o campo de busca (borda dourada via `:focus-within`, com `outline: none`). **Não têm foco estilizado:** `.btn` global (CTAs de compra e WhatsApp), links da Navbar e do rodapé, hambúrguer, card de produto, botões de tamanho, setas, dots, miniaturas, pills, `CategorySelector` (trigger e opções), botão fechar do modal. `outline: none` aparece em 3 lugares (busca ×2, `.faqItem`; os dois primeiros têm substituto, o terceiro tem `:focus-visible` dourado). Sem `outline: none` global, o foco desses elementos cai no anel padrão do navegador.

### 9.2 Contraste (razão WCAG 2.1 calculada com script em `/tmp`)

Pares texto/fundo principais. Limite: 4,5:1 (texto normal), 3:1 (texto grande ≥ 24px, ou ≥ 18,66px em negrito, e elementos gráficos):

| Par (texto em fundo) | Razão | Resultado |
| --- | --- | --- |
| `--ink` #2A2522 em `--offwhite` #F8F6F3 (corpo) | 14,04:1 | OK |
| `--ink` em `--bege-soft` #EFE7DC | 12,36:1 | OK |
| `--ink-soft` #5C5550 em `--offwhite` (texto secundário, rótulos) | 6,78:1 | OK |
| `--ink-soft` em `--bege-soft` (pills, busca, selo) | 5,97:1 | OK |
| `--ink-soft` em `--bege` #E8DED2 (hover FAQ) | 5,51:1 | OK |
| `--vinho` #6B1E2B em `--offwhite` (preço, título do banner) | 10,55:1 | OK |
| `--offwhite` em `--vinho` (botão primário, badge) | 10,55:1 | OK |
| `#fff` em `--vinho` (pill ativa) | 11,38:1 | OK |
| `--vinho` em `--bege-soft` (título do `BrandSeal`) | 9,28:1 | OK |
| `--vinho` em `--bege` | 8,57:1 | OK |
| `--dourado` #C6A96B em `--ink` (`Differentials .num`) | 6,70:1 | OK |
| `--offwhite` a 65% em `--ink` (`Differentials p`) | 6,78:1 | OK |
| `--offwhite` a 50% em `--ink` (`.section-tag` na seção escura) | 4,65:1 | OK |
| **`--caramelo` #B08968 em `--offwhite`** (`cardNote` 9px, `.gold`, `.emptyLink` do estado vazio, `.section-tag .num`) | **2,94:1** | **ABAIXO** de 4,5:1 (e de 3:1) |
| **`--caramelo` em `--bege-soft`** | **2,59:1** | **ABAIXO** |
| **`--offwhite` em `--caramelo`** (badge `.gold`, sem uso no JSX) | **2,94:1** | **ABAIXO** |
| **`#fff` em `--caramelo`** (`.btn-gold`, "WhatsApp" do CTA final) | **3,17:1** | **ABAIXO** de 4,5:1 (texto 13px caixa alta) |
| **`--dourado` em `--offwhite`** (rótulo do FAQ 10,3px, `.emptyDot`) | **2,10:1** | **ABAIXO** |
| **`--offwhite` em `--dourado`** (`::selection`) | **2,10:1** | **ABAIXO** (seleção de texto) |

Leitura: o par escuro-sobre-claro (ink, ink-soft, vinho) é sólido. O **caramelo e o dourado sobre fundos claros são decorativos que passaram a carregar texto**: `cardNote` do card (9px), o rótulo do FAQ, os números das tags de seção e o botão `.btn-gold` ficam abaixo do mínimo. Os ícones dourados dos selos sobre bege-soft (`TrustBadges`) ficam em **1,84:1** (dourado em `--bege-soft`), e o caramelo em `--bege` (hover do FAQ) em 2,39:1.

### 9.3 Imagens e texto alternativo

- Cards, modal, destaque e galeria: `alt={product.name}` (galeria: `"<nome> — foto N"`). Hero `alt="PetLuxo"`, Story `alt="Sobre a PetLuxo"`.
- Miniaturas da galeria: `alt=""` dentro de botão com `aria-label="Ver foto N"` (correto).
- Ícones decorativos (`TrustBadges`, setas, emojis do `BrandSeal`, "+"/"◆") com `aria-hidden="true"`.
- O disco do logo na Navbar é `<span>` com `background-image` (sem texto alternativo; o texto "PETLUXO" ao lado cobre o nome do link).
- `<img>` de produto sem `width`/`height` (8.3).

### 9.4 ARIA e teclado

| Componente | Observado |
| --- | --- |
| Menu hambúrguer | `aria-label` "Abrir/Fechar menu" e `aria-expanded`; **sem** `aria-controls`, **sem** Escape/clique fora; drawer `aria-hidden` sem tirar os links do foco |
| Acordeão da ficha | Completo: `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby`; foco visível |
| FAQ da home | `role="button"`, `tabIndex=0`, Enter/Espaço, `aria-expanded` |
| `CategorySelector` | `aria-haspopup="dialog"`, `aria-expanded`, `role="dialog"`, `aria-modal`, Escape, devolve o foco |
| Banner de cookies | `role="alertdialog"`, `aria-modal`, `aria-labelledby/describedby`, foco programático |
| Card de produto | **Nada** de teclado: `<article onClick>` |
| Seletor de tamanho | `aria-pressed` |
| Galeria | `aria-label` e `aria-current` em miniaturas e dots; setas com rótulo; lupa com `aria-pressed` |
| Landmarks | `<header>`, `<main>` (ficha e políticas), `<footer>`, `<nav>`; a home tem `<main>` (`page.jsx`) |

Idioma: `<html lang="pt-BR">` (`index.html`).

### 9.5 Movimento e zoom

- `prefers-reduced-motion`: não consta no desktop; o mobile respeita (seção 14.8).
- Pinch-zoom livre (5.1).
- `scroll-behavior: smooth` global.
- O conteúdo `.reveal` fica `opacity: 0` até o `IntersectionObserver` marcá-lo, sem versão para `prefers-reduced-motion`.

### 9.6 Alvos de toque (resumo, medido na produção a 390px)

| Elemento | Tamanho | Mínimo comum (44px) |
| --- | --- | --- |
| Hambúrguer | 44 × 44 | atende |
| Setas do carrossel (controles) | 44 × 44 | atende |
| Fechar do modal (≤768px) | 44 × 44 | atende |
| Trigger do `CategorySelector` | 342 × 44 | atende |
| Botão WhatsApp (`.btn-full`) | 342 × 47 | atende |
| Botões do banner de cookies | ≈ 342 × 43 | no limite |
| Botões de tamanho | 44–50 × **35** | abaixo |
| Link "← Voltar para a loja" | 154 × **19** | abaixo |
| Link da marca (MinimalNavbar) | 342 × **32** | abaixo |
| Links do rodapé | ≈ 22 de altura (CSS) | abaixo |
| Dots do carrossel e da galeria | **6 × 6** (ativo 20–24 × 6) | muito abaixo |
| Botão de lupa / zoom da galeria | 30 × 30 (≥640px) | abaixo |
| Setas da galeria no celular | 36 × 36 | abaixo |
| Botão fechar do `CategorySelector` | 36 × 36 | abaixo |
| `.qaBtn` do card | 36 × 36, invisível no toque | n/a |

---

## 10. Tom de voz e conteúdo

1. **Posicionamento editorial** em caixa alta mono nos rótulos: "CURADORIA EXCLUSIVA · PARA QUEM EXIGE O MELHOR" (`Hero.jsx`); manchete: "O luxo que *ele merece,* a elegância que você aprecia."
2. **Títulos com ênfase em itálico dourado:** "Tudo que o seu *pet* precisa." (`Products.jsx`), "Página não *encontrada.*" (`NotFound.jsx`).
3. **Botões:** verbos diretos em caixa alta ("VER PRODUTOS", "CONSULTAR VIA WHATSAPP", "COMPRAR AGORA" quando ativo, "ACEITAR/RECUSAR ANALYTICS").
4. **Badges (5):** `MAIS VENDIDOS`, `PREMIUM`, `NOVO`, `EXCLUSIVO`, `ESGOTADO`; legenda fixa do card: "VIA WHATSAPP".
5. **Selos de confiança:** "Compra Segura", "Troca em 7 dias", "Entrega Rastreada", "Atendimento Humanizado" (`TrustBadges.jsx`); "Curadoria de produtos premium", "Envio para todo o Brasil" (`BrandSeal.jsx`).
6. **Mensagens do WhatsApp** começam com "Olá!": produto: `Olá! Gostaria de mais informações sobre "<nome>".` + linha em branco + `Tamanho: X`/`Cor: X` + `Preço: …` + `Link: <url da ficha>` (`ProductBuyButton.jsx`); genéricas: "Olá! Vim do site PetLuxo e gostaria de mais informações." (Navbar e rodapé), "Olá! Gostaria de tirar uma dúvida sobre os produtos PetLuxo." (CTA).
7. **Voz:** português do Brasil, tratamento por "você", frases curtas e aspiracionais ("Sofisticação e conforto para quem ama seus pets."); copy longa de produto em tom de catálogo premium.
8. **Atendimento por WhatsApp** é o fio condutor de "Atendimento via WhatsApp" (`Differentials.jsx`), do FAQ e das políticas; **o site não promete checkout** (a copy "Compra 100% online" do Hero, `heroMeta`, convive com a venda por WhatsApp: tensão a revisar no redesign).

---

## 11. Inconsistências e dívidas de design

Ordenadas por impacto no mobile (maior primeiro). Em cada item: o que é, onde está.

1. **Alvos de toque pequenos em controles centrais:** dots do carrossel e da galeria 6px de altura, botões de tamanho 35px, "Voltar para a loja" 19px, links do rodapé ≈22px, setas da galeria 36px, lupa 30px, X do `CategorySelector` 36px (9.6).
2. **Texto pequeno que carrega informação:** 58 elementos de 9px e 26 de 10px só na home; "VIA WHATSAPP", `cardNote`, badge e métricas do Hero em 8–9px; texto corrido de 13px (Story, Differentials, bullets do modal, FAQ, cookies) (3.6).
3. **Hover sem equivalente de toque:** 38 `:hover` e nenhum `@media (hover: hover)`; `.qaBtn` invisível no toque; elevação do card e dos botões "gruda" (5.3).
4. **Ficha de produto sem tratamento ≤480px** e **fotos em letterbox** na galeria (cover 1:1 no card, contain 1:1 na ficha, cover+scale no modal: três regras para as mesmas fotos; 28 proporções distintas entre 0,66 e 1,57) (7.7, 7.8, 8.3).
5. **Páginas de política (desktop):** negrito sintético, estilos 100% inline, âncoras do menu (`#produtos`, `#sobre`…) que não existem fora da home (7.1, 7.16).
6. **Drawer do menu sem WhatsApp** (o `.navDrawerCta` existe no CSS e não no JSX), links focáveis com `aria-hidden`, sem Escape/clique fora (7.1).
7. **Card clicável sem `<a>`/teclado** (`<article onClick>`): sem nova aba, sem foco por teclado (7.3).
8. **Cascata do Footer:** 5 → 1 → 2 → 1 colunas conforme a largura (5.4).
9. **Foco visível só em 4 componentes (acordeão, banner, FAQ, busca)**; `.btn` global sem `:focus-visible`, `:active` nem `:disabled` (9.1, 7.10).
10. **Contraste abaixo de 4,5:1** em caramelo e dourado sobre claro (2,10 a 3,17:1), incluindo `cardNote`, rótulo do FAQ e `.btn-gold` (9.2).
11. **Dois sistemas de acordeão** (ficha e FAQ) com visual, comportamento e foco diferentes; `max-height: 200px` no FAQ pode cortar respostas (7.11).
12. **Três breakpoints para a mesma grade:** carrossel em JS (640/1024) e grade de resultados em CSS (640/980) divergem entre 980 e 1023px; breakpoints de CSS espalhados em 8 valores (480, 540, 640, 641, 768, 860, 900, 980) (4.4, 5.2).
13. **Títulos sem regra mobile** (Featured/Differentials 44px, CTA 56px) e escala de títulos desordenada (3.4).
14. **Peso tipográfico fora do carregado:** Cormorant 600/700 pedido (acordeão, políticas) e 300 (FAQ), Inter 300 importado sem uso (3.2).
15. **`transition: all` em 13 pontos** e animações infinitas do desktop sem `prefers-reduced-motion`; `.reveal` começa invisível e depende do observer (6.4).
16. **Sem escala de espaçamento, sombras, raios e z-index completos:** tokens só para cor, fonte, container e z-index; `--z-overlay` e `--dourado-soft` órfãos; `.grain` com z-index literal 200 acima da Navbar (2.1, 4.3, 6.3, 6.5).
17. **Cores duplicadas em literal** (3 degradês de placeholder, `#EFE7DC`, `#D6C4AB`, `#FFF`) e duas famílias de botão (`.btn` global × `.btn` do banner) (2.3, 6.1).
18. **Código de estilo morto:** `.navDrawerCta`, `.badge:global(.gold)`, `.name small`, `.footBottom .links`, regras ≤640px de `.pillsScroll` (nunca visíveis), `.carouselSingle` com 5 `!important`.
19. **Emojis como ícones** no `BrandSeal` convivendo com SVG linear no resto; copy "Compra 100% online" no Hero em um site de venda por WhatsApp (7.12, 10).

---

## 12. Restrições para o redesign

Fatos do projeto que o design **não pode quebrar** (fontes: `AI_CONTEXT_PETLUXO.md`, `docs/DECISIONS.md`, código):

1. **Um único app.** O mesmo React atende todas as larguras; abaixo de 768px o `useIsMobile()` escolhe os componentes mobile e a partir de 768px o desktop (`docs/DECISIONS.md` §14). Dados e regras vêm dos mesmos módulos.
2. **O catálogo é reescrito pelo painel da mãe** (`src/data/products.js`, painel admin em outro repositório, commits "via painel admin"). Campos, ordem e nomes de campo de `products.js` não podem depender do layout; textos, nomes e preços têm comprimento arbitrário (nomes longos como "Kit Élan Rosa | Elegância em Cada Passeio"); `badge` só aceita os 5 valores do validador; `buyLinks` define os tamanhos (P/M/G/GG, 800ml, cor…).
3. **Imagens com proporções variadas** (0,66 a 1,57, 28 proporções distintas entre 40 fotos), entregues como WebP sem recorte padronizado; fotos novas chegam por `_incoming/` sem redimensionar. O design precisa funcionar com qualquer proporção (sem assumir 1:1 nem 4:5).
4. **Venda por WhatsApp, sem checkout ainda.** O CTA é "CONSULTAR VIA WHATSAPP" com mensagem dinâmica (nome, variação, preço, link da ficha). O botão "COMPRAR AGORA" (links PagBank) está oculto por `HIDE_BUY_CTA = true` e pode voltar: o design deve prever os dois estados, mais o estado ESGOTADO. Carrinho/checkout é apenas planejado (`docs/CHECKOUT_ARCHITECTURE.md`).
5. **Fontes self-hosted** (`@fontsource`, subset latin, sem Google Fonts em runtime): qualquer fonte nova precisa ser empacotada; cada peso/estilo adicional soma ao peso inicial.
6. **Consentimento de cookies e GA4 (LGPD):** o banner de consentimento é obrigatório antes do `gtag.js`, reabrível pelo botão "Preferências de cookies" do rodapé; os textos das políticas são os finais do advogado (2026-11-19) e ainda restam pendências da dona do negócio (`docs/TODO.md` item 37). O redesign não pode remover o banner nem o ponto de reabertura.
7. **Máquina de desenvolvimento lenta:** evitar dependências pesadas, builds longos e telas que exijam muitos ciclos de teste; preferir mudanças em CSS Modules a bibliotecas novas.
8. **Escala do catálogo:** 41 produtos (29 visíveis) em 9 categorias, com 8 produtos em 2+ categorias; busca por palavras e filtro por categoria; 6 produtos visíveis não têm ficha (abrem a ficha simples); 12 ocultos por `visible: false`.
9. **Rotas e SEO:** `/produto/:id` é reescrita por um Worker (título, descrição, `og:*`); `ProductPage` usa `MinimalNavbar`; id inexistente cai em `NotFoundPage` (HTTP 404 só em `/produto/*`). Manter URLs e a estrutura de rotas.
10. **Hospedagem estática (Cloudflare Workers com assets):** sem backend, sem banco; qualquer conteúdo dinâmico precisa vir do front-end.

---

## 13. Apêndice: arquivos lidos

**Estilos globais:** `src/styles/variables.css`, `src/styles/globals.css`, `src/styles/buttons.css`.

**CSS Modules do desktop:** `layout/Navbar`, `layout/Footer`; `product/ProductCard`, `ProductGrid`, `ProductGallery`, `ProductLightbox`, `ProductSizeSelector`, `ProductBuyButton`; `sections/Hero`, `Featured`, `Products`, `Story`, `Differentials`, `CTA`, `FAQ`, `NotFound`; `pages/ProductPage`; `ui/Accordion`, `AnalyticsConsent`, `BrandSeal`, `CategorySelector`, `TrustBadges` (todos em `src/components/<pasta>/<Nome>.module.css`).

**Componentes e entradas:** `index.html`, `src/main.jsx`, `src/app/page.jsx`, `src/app/DevTweaks.jsx`; `layout/Navbar.jsx`, `MinimalNavbar.jsx`, `Footer.jsx`; `product/ProductCard.jsx`, `ProductGrid.jsx`, `ProductGallery.jsx`, `ProductSizeSelector.jsx`, `ProductBuyButton.jsx`; `sections/Hero.jsx`, `Featured.jsx`, `Products.jsx`, `Story.jsx`, `Differentials.jsx`, `CTA.jsx`, `FAQ.jsx`, `NotFound.jsx`; `pages/ProductPage.jsx`, `PrivacyPage.jsx` (e, por grep, `ReturnPolicyPage.jsx`, `ShippingPolicyPage.jsx`, `TermsPage.jsx`); `ui/Accordion.jsx`, `AnalyticsConsent.jsx`, `BrandSeal.jsx`, `CategorySelector.jsx`, `TrustBadges.jsx`.

**Dados e imagens:** `src/data/products.js` (campo `image`), `public/images/products/*` (40 principais + amostras de galeria, `identify` e `file`).

**Medições e prints:** Chromium (Playwright) a 390×844, `deviceScaleFactor` 2, contra https://www.petluxostory.com.br em 2026-11-18, scripts em `/tmp` (prints em `_incoming/design-prints/`, pasta ignorada pelo git); cálculo de contraste em `/tmp/contrast.py`.

**Contexto:** `AI_CONTEXT_PETLUXO.md`.

**Limites desta análise:** não foram executados leitores de tela nem testes de teclado reais; as afirmações de foco/ARIA vêm da leitura do código (e de medições de tamanho em navegador); "não consta" indica ausência no código lido, não ausência comprovada em runtime.

---

## 14. Layout mobile (< 768px)

Componentes em `src/components/mobile/`; `useIsMobile()` (`(max-width: 767.98px)`, `useSyncExternalStore`) escolhe o layout na mesma rota. A origem visual é a referência em `docs/desing/design/` (o nome da pasta é esse mesmo).

### 14.1 Tokens (`variables.css`)

| Token | Valor | Uso |
| --- | --- | --- |
| `--m-gutter` | 24px | margem lateral |
| `--m-safe-top` | `max(8px, env(safe-area-inset-top))` | distância do topo |
| `--m-safe-bottom` | `max(20px, env(safe-area-inset-bottom))` | distância da base |
| `--m-bar-h` | `64px + --m-safe-bottom` | altura da barra inferior |
| `--m-scene-h` | `100vh − --m-bar-h` (`100dvh` onde há suporte) | altura de cada cena da home |
| `--bege-line` | #D9CFC2 | borda de chip, ponto inativo, alça de folha |
| `--ink-on-dark` / `--ink-on-dark-soft` | #CFC6BB / #A89F94 | texto sobre `--ink` |
| `--line-on-dark`, `--ink-deep`, `--scrim`, `--ease-out-expo` | ver `variables.css` | fios e fundos escuros, fundo de modal, easing |

Os artboards 390×844 do design viram `100dvh` + safe area. Caramelo e dourado não servem para texto pequeno sobre fundo claro (contraste).

### 14.2 Primitivas (`ui/MobileUI.module.css`)

`mEyebrow` (mono 11px, caixa alta, ponto dourado), `mBtn` (pílula 52px; `mBtnPrimary` vinho, `mBtnOutline`), `mBadge` (`mBadgeNovo` vinho), `mSrOnly`, `mNoScrollbar`. Alvos de toque ≥44px e `:focus-visible` com contorno vinho. `BottomSheet` (folha inferior acessível), `ProductBadge`, `Paw` (pegada) e `MobileIcons` (ícones de traço, `aria-hidden`).

### 14.3 Navegação

- `MobileHeader`: marca no topo (na home, o clique na marca volta ao início da rolagem).
- `MobileTabBar` (fixa, `--m-bar-h`): Início, Produtos e Buscar (`Link`), mais o WhatsApp como pílula. Ausente em `/buscar`. As barras fixas reservam espaço pelo hook `useReserveBottomBar` (classe `m-bottom-bar` no `<html>` → `body { padding-bottom: var(--m-bar-h) }`).
- `MobileFooter`: rodapé escuro com o texto de `data/siteContent.js` (FOOTER, POLICY_LINKS) e o botão de preferências de cookies.

### 14.4 Home em cenas (`home/`)

Ordem: Hero (medalha com o P, que se inclina ao toque) → Destaque (gatinho; o título é link ao produto) → Sobre nós (cachorro com guilhoché e olhar) → Diferenciais (histórias de 5s com barra de progresso) → Dúvidas (FAQ em folha) → Rodapé. Um único contêiner rola (`mPager`, `scroll-snap-type: y proximity`, cada cena com `--m-scene-h`). A **trilha dourada** é um SVG cujo `stroke-dashoffset` e marcador são atualizados direto no DOM a cada rolagem (progresso de 0 a 1, sem salto). Os textos vêm de `data/siteContent.js`, o destaque de `getFeaturedProduct()`.

### 14.5 Catálogo, busca e produto

- `MobileCatalog` (`/produtos`): chips de categoria (as categorias visíveis com produtos, na ordem de `CATEGORIES`, mais "Todos"; categoria na URL, `?categoria=<id>`) e grade de 2 colunas na ordem de `catalogList()`. Cartões são `Link` para `/produto/:id`. A imagem do cartão (`.mCatImg`) usa `object-fit: contain` em quadro fixo 1:1 sobre `--bege-soft`: mostra a foto inteira; faixas aparecem em fotos não quadradas. Um único h1.
- `MobileSearch` (`/buscar`): campo, estado vazio, resultados e "sem resultado" com WhatsApp; usa `searchProducts()`. `noindex`.
- Produto: `MobileProductFull` (com ficha: galeria com `scroll-snap` horizontal e `touch-action: pan-y pinch-zoom`, seletor de tamanho/cor, nota de entrega (`FreightNote`, texto de `DELIVERY_NOTE`; `.mFreight` e `.mSimpleFreight` sem `nowrap`, então o texto longo quebra de linha), acordeões com `hidden="until-found"`, tabela de medidas; a galeria mobile mostra a foto inteira (`.mSlideImg` com `object-fit: contain`, quadro fixo `aspect-ratio: 390 / 488` sobre fundo `--bege-soft`), e o card da grade também mostra a foto inteira em quadro 1:1 (`contain`)) e `MobileProductSimple` (sem ficha). `ImageViewer` (tela cheia, pinch). Barra inferior com o botão de WhatsApp (mensagem de `lib/productMessage.js`); `HIDE_BUY_CTA` continua valendo; ESGOTADO vira selo e o botão de WhatsApp permanece. O botão de voltar é fixo.

### 14.6 Cookies

Folha inferior sem fundo escurecido (o banner não bloqueia a navegação), alça, fio dourado que se desenha, rótulo "Privacidade", título serifado 30px, botões em pílula de 52px lado a lado. A ordem visual é a ordem do código (Aceitar à esquerda, Recusar à direita; o Tab segue a ordem visual, sem `order` no CSS). Só CSS: a lógica do GA4 e do consentimento é a mesma do desktop.

### 14.7 Políticas e 404

`MobilePolicyLayout`: botão voltar, chips entre as 4 políticas (`nav aria-label="Políticas"`, `aria-current="page"`), eyebrow "Documento", h1 serif, fio dourado, "Última atualização", cartões opcionais (Troca e Devolução: 7 e 90 dias, constante `HIGHLIGHTS`, conferidos com o texto do advogado em 2026-11-20), corpo do texto, cartão "Ficou alguma dúvida?" com WhatsApp, rodapé e barra inferior. `MobileNotFound`: trilha de pegadas com "?" que balança, h1 "Esta página se perdeu pelo caminho.", botões "Voltar ao início" e "Ver produtos" (`Link`).

### 14.8 Movimento e acessibilidade

- `prefers-reduced-motion: reduce` desliga as animações infinitas (halo da trilha, gatinho, pegadas, desenho do fio) e o avanço automático das histórias.
- O avanço das histórias é guiado pelo `animationend` da barra de 5s e pausa fora da tela (`IntersectionObserver`), com a aba oculta (`visibilitychange`) e com movimento reduzido. Todo timer e listener é removido na desmontagem.
- Interações por ponteiro usam `getBoundingClientRect` e `touch-action: pan-y pinch-zoom`; não bloqueiam a rolagem vertical nem o pinch-zoom.
- Modais (`BottomSheet`, `ImageViewer`) usam `useModalFocus`: `#app` inerte e `aria-hidden`, foco preso, Esc fecha, foco volta ao gatilho.
- Um h1 por página, h2 por seção, landmarks, `alt` nas fotos e `aria-label` nos botões de ícone. O conteúdo escondido (FAQ, acordeões) continua no DOM (`hidden="until-found"`), para buscadores e para a busca do navegador.
- Todas as animações são CSS; não há biblioteca de animação.
