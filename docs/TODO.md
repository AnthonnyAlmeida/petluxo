# O que ainda falta fazer

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
