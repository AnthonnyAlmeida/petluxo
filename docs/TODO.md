# Status do Projeto PetLuxo

**Site em produção:** https://petluxostory.com.br
**Deploy:** automático via Vercel a cada `git push` para `main`

> ⚠️ O repositório deve permanecer **público**. O Vercel Hobby Plan não faz deploy de repositórios privados.

---

## Pendente

### Alta prioridade

- [ ] **Favicon com logo real** — substituir o favicon atual pela logo oficial da PetLuxo em SVG com as cores corretas da marca

### Média prioridade

- [ ] **Sitemap automático** — o `public/sitemap.xml` é manual. Quando o site crescer com mais páginas, considerar geração automática
- [ ] **og:image — limpar cache** — imagem atualizada recentemente. Usar LinkedIn Post Inspector (linkedin.com/post-inspector) e Facebook Sharing Debugger para forçar re-scrape

---

## Padrões do Catálogo

### Campos obrigatórios em cada produto (`products.js`)

| Campo | Descrição |
|---|---|
| `id` | Número único. Próximo disponível: **21** |
| `name` | Nome completo (usado no modal) |
| `shortName` | Nome curto (usado no card do carrossel) |
| `subtitle` | Frase curta de impacto |
| `description` | Descrição completa para o modal |
| `bullets` | Array de destaques/características |
| `price` | Preço exibido no card. Para produtos com tamanhos: `"a partir de R$ X"` |
| `prices` | Array `{ size, price }` para produtos com múltiplos tamanhos (opcional) |
| `badge` | Texto do selo: `"MAIS VENDIDOS"` ou `null` |
| `image` | Caminho ex: `"/images/products/nome-do-arquivo.jpeg"` |
| `category` | Array de categorias ex: `["mais-vendidos", "conforto"]` |
| `buyLink` | URL PagBank para produto único (omitir se usar buyLinks) |
| `buyLinks` | Array `{ size, link }` para produtos com múltiplos tamanhos (opcional) |

### Categorias disponíveis

| ID | Label |
|---|---|
| `mais-vendidos` | Mais Vendidos (sempre visível sem expandir) |
| `conforto` | Conforto & Estilo |
| `couro` | Essenciais em Couro |
| `colecao-casa` | Coleção Casa |
| `brinquedos` | Brinquedos |
| `colecao-passeio` | Coleção Passeio |

### Imagens de produtos

- Salvar em: `public/images/products/`
- Formato: `.jpeg` ou `.png`
- As imagens **vão para o git** (apenas `public/images/image-hero.png` está no `.gitignore`)

---

## Concluído ✓

### Infraestrutura e deploy
- [x] **Site em produção na Vercel** — https://petluxostory.com.br, deploy automático a cada push
- [x] **Domínio customizado** — `petluxostory.com.br` configurado via Registro.br com NS Vercel (`ns1/ns2.vercel-dns.com`)
- [x] **Domínio configurado nas meta tags** — `og:url`, `og:image`, `twitter:image`, `robots.txt`, `sitemap.xml` todos com domínio real
- [x] **Google Analytics** — script gtag.js com ID `G-KKMV5VHR48` configurado em `index.html`
- [x] **og:image atualizada** — `public/og-image.png` configurado em `og:image` e `twitter:image`
- [x] **Meta description atualizada** — copy com palavras-chave reais do negócio
- [x] **Migração de Babel CDN para Vite** — bundle ~183KB (57KB gzip), build em ~5s, hot reload instantâneo
- [x] **DevTweaks excluído do bundle de produção** — `DevTweaks` só carrega quando `import.meta.env.DEV` é verdadeiro
- [x] **Página 404 customizada** — `NotFound.jsx` + `public/404.html` com redirect para `/` via sessionStorage
- [x] **robots.txt e sitemap.xml** — configurados com domínio real em `public/`

### Catálogo e produtos
- [x] **20 produtos reais** — fotos, descrições, preços e links PagBank em `src/data/products.js`
- [x] **6 categorias** — `mais-vendidos`, `conforto`, `couro`, `colecao-casa`, `brinquedos`, `colecao-passeio`
- [x] **Produto destaque** — `Featured.jsx` com Sofá Ortopédico Lounge PetLuxo™ (id 13)
- [x] **Produtos com múltiplos tamanhos** — `prices: [{ size, price }]` + `buyLinks: [{ size, link }]` (ids 14 e 16)
- [x] **PagBank integrado** — todos os 20 produtos têm `buyLink` ou `buyLinks`
- [x] **CTA dinâmico no card** — "COMPRAR AGORA" se tem buyLink/buyLinks, "VIA WHATSAPP" se não tem
- [x] **Badges padronizados** — todos no plural: `"MAIS VENDIDOS"`
- [x] **Imagens de produtos no git** — `public/images/products/` não está no `.gitignore`

### Layout e componentes
- [x] **Modal com scroll interno no mobile** — `.modal-scroll` com `overflow-y: auto`, `min-height: 0`, `overscroll-behavior: contain`
- [x] **Modal com seletor de tamanho** — `useState(selectedSize)` + botões por tamanho; preço e link COMPRAR AGORA são dinâmicos
- [x] **Responsividade completa** — breakpoints 980px (tablet), 768px (mobile), 480px (mobile pequeno)
- [x] **Menu hambúrguer mobile** — drawer animado com links e botão WhatsApp
- [x] **Carrossel com setas laterais e swipe touch** — setas via flexbox (desktop), swipe 50px threshold (mobile)
- [x] **Múltiplos carrosséis por categoria** — "Mais Vendidos" sempre visível; demais expandem com animação

### Conteúdo real
- [x] **Hero com textos reais** — supertítulo, headline, subtítulo e 3 métricas da marca
- [x] **Seção Sobre Nós** — foto real, headline e copy da marca
- [x] **Footer com dados reais** — CNPJ `23.833.930/0001-21`, email `petluxo.service@gmail.com`, Instagram `@petluxo_produtospremium`

### SEO
- [x] **Open Graph completo** — `og:url`, `og:image`, `og:title`, `og:description`, `og:type`, `og:site_name`, `og:locale`
- [x] **Twitter Card** — `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

### Documentação
- [x] **AI_CONTEXT.md** — contexto completo do projeto para IAs na raiz do projeto
- [x] **docs/README.md** — visão geral, stack, estrutura de pastas, catálogo atual
- [x] **docs/DECISIONS.md** — decisões técnicas documentadas
- [x] **docs/DEPLOY.md** — fluxo de deploy na Vercel com domínio customizado
- [x] **docs/TODO.md** — este arquivo

