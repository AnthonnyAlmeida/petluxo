# Status do Projeto PetLuxo

---

## Pendente

### Alta prioridade

- [ ] **Novos produtos** — quando sua mãe enviar os dados (nome, descrição, preço, categoria, foto), adicionar em `src/data/products.js` e colocar a imagem em `public/images/products/`
- [ ] **og:image 1200×630px** — criar uma imagem de capa do site nessa proporção e atualizar `og:image` e `twitter:image` no `index.html` (atualmente aponta para a foto do produto destaque, que não está na proporção ideal)

### Pós-domínio

- [ ] **Substituir domínio placeholder** — quando o domínio for definido, substituir `SEU-DOMINIO-AQUI.com.br` em 4 lugares (ver comando abaixo)
- [ ] **Deploy na Vercel** — ver `docs/DEPLOY.md` para o passo a passo completo

### Opcional

- [ ] **Google Analytics** — adicionar script de rastreamento após o deploy e definição do domínio
- [ ] **Favicon com logo real** — substituir o favicon genérico pela logo oficial da PetLuxo em SVG

---

## Concluído ✓

### Base técnica
- [x] **Migração de Babel CDN para Vite** — bundle 168 KB (53 KB gzip), build em ~3s, hot reload instantâneo
- [x] **tweaks-panel excluído do bundle de produção** — `DevTweaks` só carrega quando `import.meta.env.DEV` é verdadeiro
- [x] **CSS limpo** — código morto removido (~164 linhas), arquivo com 1381 linhas sem regras não utilizadas

### Layout e componentes
- [x] **Responsividade completa** — breakpoints 980px (tablet), 768px (mobile), 480px (mobile pequeno)
- [x] **Menu hambúrguer mobile** — drawer animado com links e botão WhatsApp; fecha ao clicar em qualquer link
- [x] **Página 404 customizada** — `NotFound.jsx` + `public/404.html` com redirect para `/` via sessionStorage

### Produtos e catálogo
- [x] **8 produtos reais** — fotos, descrições e preços em `src/data/products.js` (gitignored)
- [x] **3 categorias** — `mais-vendidos`, `conforto`, `couro`
- [x] **Carrossel com setas laterais e swipe touch** — setas via flexbox (desktop), swipe 50px threshold (mobile), estado isolado por instância
- [x] **Múltiplos carrosséis por categoria** — "Mais Vendidos" sempre visível; demais categorias expandem com animação `grid-template-rows`
- [x] **Produto em destaque** — Sofá PetLuxo Essence com foto e preço reais em `Featured.jsx`

### Conteúdo real
- [x] **Hero com textos reais** — supertítulo, headline em 3 linhas, subtítulo e 3 métricas da marca
- [x] **Seção Sobre Nós** — foto real, headline e copy da marca
- [x] **Footer com dados reais** — CNPJ `23.833.930/0001-21`, email `petluxo.service@gmail.com`, Instagram `@petluxo_produtospremium`

### SEO e infraestrutura
- [x] **SEO básico** — meta description atualizada, Open Graph completo, Twitter Card, favicon linkado
- [x] **robots.txt e sitemap.xml** — existem em `public/` (domínio placeholder a trocar após deploy)
- [x] **wa-fab removido** — botão flutuante sem destino real removido do `index.html`
- [x] **Auditoria pré-deploy** — todos os itens críticos resolvidos (links mortos, imagens, placeholders, og:image)

### Documentação
- [x] **docs/README.md** — visão geral, stack, estrutura de pastas e comandos
- [x] **docs/DECISIONS.md** — 7 decisões técnicas documentadas
- [x] **docs/DEPLOY.md** — passo a passo para Vercel (interface e CLI)
- [x] **docs/TODO.md** — este arquivo

---

## Quando o domínio for definido

Substituir `SEU-DOMINIO-AQUI.com.br` em **4 lugares**:

| Arquivo | Campo |
|---|---|
| `index.html` | `og:url` |
| `index.html` | `og:image` e `twitter:image` |
| `public/robots.txt` | `Sitemap:` |
| `public/sitemap.xml` | `<loc>` |

```bash
grep -r "SEU-DOMINIO-AQUI" --include="*.html" --include="*.txt" --include="*.xml" .
```

## Alta prioridade

Essas tarefas são necessárias antes de publicar o site.

- [ ] **Meta description específica** — reescrever a `<meta name="description">` no `index.html` com palavras-chave reais do negócio
- [ ] **og:image real 1200×630** — criar imagem de capa do site nessa proporção, colocar em `public/` e atualizar a URL no `index.html`

## Média prioridade

Melhorias importantes mas que não bloqueiam o lançamento.

- [ ] **Google Analytics ou similar** — adicionar script de rastreamento após definir o domínio
- [ ] **Favicon com logo real** — substituir o favicon atual pela logo oficial da PetLuxo em SVG
- [ ] **Sitemap automático** — o `public/sitemap.xml` é manual. Quando o site crescer com mais páginas, considerar geração automática

## Baixa prioridade

- [ ] **Domínio e deploy** — ver `docs/DEPLOY.md` para o passo a passo

---

## Concluído ✓

- [x] **Footer real** — CNPJ `23.833.930/0001-21`, email `petluxo.service@gmail.com` (mailto), Instagram `@petluxo_produtospremium` (link real). Links mortos sem destino removidos
- [x] **Seção "Sobre"** — Story.jsx preenchida com imagem real, título e copy da marca, sobreposição de contraste e moldura editorial dupla
- [x] **Hero copy real** — supertítulo, headline em 3 linhas, subtítulo e bloco de 3 métricas atualizados com textos reais da marca
- [x] **Produtos reais** — `src/data/products.js` com 8 produtos ativos, 3 categorias (`mais-vendidos`, `conforto`, `couro`). Arquivo gitignored
- [x] **Imagens dos produtos** — fotos reais em `public/images/products/`. Pasta gitignored
- [x] **Produto em destaque** — Featured.jsx preenchido com produto real (Sofá PetLuxo Essence, id 12)
- [x] **Sistema de carrosséis por categoria** — carrossel "Mais Vendidos" sempre visível + botão "Ver mais produtos" que expande os demais com animação suave
- [x] **Carrossel: setas laterais e swipe** — setas absolutas posicionadas via flexbox no `.carousel-outer` (desktop), ocultas em ≤768px. Swipe touch com detecção de direção (50px threshold) sem interferir no scroll vertical
- [x] **Carrossel: estado isolado por instância** — correção de bug onde setas de outros carrosséis eram clipadas pelo `overflow:hidden` do container de expansão. Solução: flex em vez de `position:absolute` nas setas laterais
- [x] **Limpeza de CSS** — removidos ~164 linhas de regras mortas (`.icon-btn`, `.cat-chip`, `.product-grid`, `.toast`, `.wa-fab` etc.)
- [x] **Remover tweaks-panel do build** — `DevTweaks` só é carregado quando `import.meta.env.DEV` é verdadeiro
- [x] **Página 404** — componente `NotFound.jsx` + `public/404.html` configurados
- [x] **Hero com imagem real** — `assets/hero/image-hero.png` importado via Vite

---

## Quando o domínio for definido

Substituir `SEU-DOMINIO-AQUI.com.br` em **4 lugares**:

| Arquivo | Campo |
|---|---|
| `index.html` | `og:url` |
| `index.html` | `og:image` e `twitter:image` |
| `public/robots.txt` | `Sitemap:` |
| `public/sitemap.xml` | `<loc>` |

```bash
grep -r "SEU-DOMINIO-AQUI" --include="*.html" --include="*.txt" --include="*.xml" .
```
