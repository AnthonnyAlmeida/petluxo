# Status do Projeto PetLuxo

**Site em produção:** https://petluxo.vercel.app
**Deploy:** automático via Vercel a cada `git push` para `main`

---

## Pendente

### Alta prioridade

- [ ] **Novos produtos** — quando houver novos itens, adicionar em `src/data/products.js` com todos os campos obrigatórios e colocar a imagem em `public/images/products/`
- [ ] **Favicon com logo real** — substituir o favicon atual pela logo oficial da PetLuxo em SVG

### Média prioridade

- [ ] **Sitemap automático** — o `public/sitemap.xml` é manual. Quando o site crescer com mais páginas, considerar geração automática
- [ ] **og:image com dimensões corretas** — a imagem atual (`og-image.png`) deve estar em 1200×630px para otimização correta nas redes sociais

---

## Padrões do Catálogo

### Campos obrigatórios em cada produto (`products.js`)

| Campo | Descrição |
|---|---|
| `id` | Número único sequencial |
| `name` | Nome completo (usado no modal) |
| `shortName` | Nome curto (usado no card do carrossel) |
| `subtitle` | Frase curta de impacto |
| `description` | Descrição completa para o modal |
| `bullets` | Array de destaques/características |
| `price` | Preço exibido no card. Para produtos com tamanhos: `"a partir de R$ X"` |
| `prices` | Array `{ size, price }` para produtos com múltiplos tamanhos (opcional) |
| `badge` | Texto do selo ex: `"MAIS VENDIDO"`, `"BEST SELLER"`, ou `null` |
| `image` | Caminho ex: `"/images/products/nome-do-arquivo.jpeg"` |
| `category` | Array de categorias ex: `["mais-vendidos", "conforto"]` |

### Categorias disponíveis

| ID | Label |
|---|---|
| `mais-vendidos` | Mais Vendidos (sempre visível sem expandir) |
| `conforto` | Conforto & Estilo |
| `couro` | Essenciais em Couro |
| `dining-collection` | Dining Collection |
| `brinquedos` | Brinquedos |

### Imagens de produtos

- Salvar em: `public/images/products/`
- Formato: `.jpeg` ou `.png`
- As imagens **vão para o git** (apenas `public/images/image-hero.png` está no `.gitignore`)

---

## Concluído ✓

### Infraestrutura e deploy
- [x] **Site em produção na Vercel** — https://petluxo.vercel.app, deploy automático a cada push
- [x] **Domínio configurado** — `petluxo.vercel.app` em `og:url`, `og:image`, `twitter:image`, `robots.txt`, `sitemap.xml`
- [x] **Google Analytics** — script gtag.js com ID `G-KKMV5VHR48` configurado em `index.html`
- [x] **og:image real** — `public/og-image.png` configurado em `og:image` e `twitter:image`
- [x] **Meta description atualizada** — copy com palavras-chave reais do negócio
- [x] **Migração de Babel CDN para Vite** — bundle 171KB (54KB gzip), build em ~3s, hot reload instantâneo
- [x] **tweaks-panel excluído do bundle de produção** — `DevTweaks` só carrega quando `import.meta.env.DEV` é verdadeiro
- [x] **Página 404 customizada** — `NotFound.jsx` + `public/404.html` com redirect para `/` via sessionStorage
- [x] **robots.txt e sitemap.xml** — configurados com domínio real em `public/`

### Catálogo e produtos
- [x] **12 produtos reais** — fotos, descrições e preços em `src/data/products.js`
- [x] **5 categorias** — `mais-vendidos`, `conforto`, `couro`, `dining-collection`, `brinquedos`
- [x] **Produto destaque atualizado** — Featured.jsx com Sofá Ortopédico Lounge PetLuxo™ (id 13)
- [x] **Produtos com múltiplos tamanhos** — campo `prices: [{ size, price }]` + `price: "a partir de R$ X"` (ids 14 e 16)
- [x] **Layout do card em coluna** — `shortName` → preço → "VIA WHATSAPP" (flex-direction: column, alinhamento à esquerda)
- [x] **Imagens de produtos no git** — `public/images/products/` não está mais no `.gitignore`

### Layout e componentes
- [x] **Modal com scroll interno no mobile** — `.modal-scroll` com `overflow-y: auto`, `min-height: 0`, `overscroll-behavior: contain`. Cabeçalho (título/preço) e botões ficam fixos, apenas descrição/bullets rolam
- [x] **Responsividade completa** — breakpoints 980px (tablet), 768px (mobile), 480px (mobile pequeno)
- [x] **Menu hambúrguer mobile** — drawer animado com links e botão WhatsApp; fecha ao clicar em qualquer link
- [x] **Carrossel com setas laterais e swipe touch** — setas via flexbox (desktop), swipe 50px threshold (mobile), estado isolado por instância
- [x] **Múltiplos carrosséis por categoria** — "Mais Vendidos" sempre visível; demais categorias expandem com animação `grid-template-rows`

### Conteúdo real
- [x] **Hero com textos reais** — supertítulo, headline em 3 linhas, subtítulo e 3 métricas da marca
- [x] **Seção Sobre Nós** — foto real, headline e copy da marca
- [x] **Footer com dados reais** — CNPJ `23.833.930/0001-21`, email `petluxo.service@gmail.com`, Instagram `@petluxo_produtospremium`

### SEO
- [x] **Open Graph completo** — `og:url`, `og:image`, `og:title`, `og:description`, `og:type`, `og:site_name`, `og:locale`
- [x] **Twitter Card** — `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

### Documentação
- [x] **docs/README.md** — visão geral, stack, estrutura de pastas, catálogo atual
- [x] **docs/DECISIONS.md** — decisões técnicas documentadas
- [x] **docs/DEPLOY.md** — fluxo de deploy na Vercel
- [x] **docs/TODO.md** — este arquivo

