# O que ainda falta fazer

## Alta prioridade

Essas tarefas são necessárias antes de mostrar o site para qualquer cliente.

- [ ] **Produtos reais** — atualizar `src/data/products.js` com nome, descrição, preço, categoria e imagem reais de cada produto. Adicionar campo `category` compatível com os filtros ("Coleiras", "Mesa", "Repouso", "Banho")
- [ ] **Imagens dos produtos** — substituir os placeholders SVG por fotos reais. Colocar as imagens em `public/images/products/` e referenciar nos dados
- [ ] **Footer real** — substituir dados fictícios por e-mail real, link do Instagram, e CNPJ correto
- [ ] **Produto em destaque** — preencher a seção Featured (`src/components/sections/Featured.jsx`) com um produto real
- [ ] **Meta description específica** — quando o site tiver conteúdo real, reescrever a description do SEO com palavras-chave do negócio
- [ ] **og:image real 1200×630** — criar ou exportar uma imagem de capa do site nessa proporção, colocar em `public/` e atualizar a URL no `index.html`

## Média prioridade

Melhorias importantes mas que não bloqueiam o lançamento.

- [ ] **Filtros de categoria funcionando** — os botões de filtro (Coleiras, Mesa, Repouso, Banho) ainda não filtram nada porque os produtos não têm campo `category`. Depois de preencher os produtos reais, o filtro passa a funcionar sem alteração de código
- [ ] **Remover tweaks-panel do build de produção** — o painel de tweaks de design (`src/tweaks-panel.jsx`) está incluído no bundle de produção. Para remover, basta apagar a importação e uso em `src/app/page.jsx`
- [ ] **Página 404** — criar um componente de página não encontrada e configurar no Vite ou no servidor de hospedagem
- [ ] **Seção "Sobre"** — a seção Story (`src/components/sections/Story.jsx`) tem conteúdo genérico. Substituir pela história real da PetLuxo

## Baixa prioridade

Melhorias para depois do lançamento.

- [ ] **Google Analytics ou similar** — adicionar script de rastreamento após definir o domínio
- [ ] **Domínio e deploy** — ver `docs/DEPLOY.md` para o passo a passo
- [ ] **Favicon com logo real** — substituir o favicon atual (letra "P" genérica) pela logo oficial da PetLuxo em SVG
- [ ] **Sitemap automático** — o `public/sitemap.xml` é manual. Quando o site crescer com mais páginas, considerar geração automática

---

## Quando o domínio for definido

Substituir `SEU-DOMINIO-AQUI.com.br` em **4 lugares**:

| Arquivo | Linha | Campo |
|---|---|---|
| `index.html` | `og:url` | URL canônica do site |
| `index.html` | `og:image` e `twitter:image` | URL absoluta da imagem de capa |
| `public/robots.txt` | `Sitemap:` | URL do sitemap |
| `public/sitemap.xml` | `<loc>` | URL raiz do site |

Dica rápida para encontrar todos de uma vez:
```bash
grep -r "SEU-DOMINIO-AQUI" --include="*.html" --include="*.txt" --include="*.xml" .
```
