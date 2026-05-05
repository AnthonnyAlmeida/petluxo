# O que ainda falta fazer

## Alta prioridade

Essas tarefas são necessárias antes de publicar o site.

- [ ] **Footer real** — substituir dados fictícios por e-mail real, link do Instagram e CNPJ correto em `src/components/layout/Footer.jsx`
- [ ] **Meta description específica** — reescrever a `<meta name="description">` no `index.html` com palavras-chave reais do negócio
- [ ] **og:image real 1200×630** — criar imagem de capa do site nessa proporção, colocar em `public/` e atualizar a URL no `index.html`
- [ ] **Seção "Sobre"** — a seção Story (`src/components/sections/Story.jsx`) tem conteúdo genérico. Substituir pela história real da PetLuxo

## Média prioridade

Melhorias importantes mas que não bloqueiam o lançamento.

- [ ] **Google Analytics ou similar** — adicionar script de rastreamento após definir o domínio
- [ ] **Favicon com logo real** — substituir o favicon atual pela logo oficial da PetLuxo em SVG
- [ ] **Sitemap automático** — o `public/sitemap.xml` é manual. Quando o site crescer com mais páginas, considerar geração automática

## Baixa prioridade

- [ ] **Domínio e deploy** — ver `docs/DEPLOY.md` para o passo a passo

---

## Concluído ✓

- [x] **Produtos reais** — `src/data/products.js` reescrito com 11 produtos reais (nome, descrição, preço, originalPrice, bullets, categoria, imagem, badge). Arquivo gitignored por conter dados sensíveis
- [x] **Imagens dos produtos** — fotos reais em `public/images/products/`. Pasta gitignored
- [x] **Produto em destaque** — Featured.jsx preenchido com produto real (Sofá PetLuxo Essence)
- [x] **Sistema de carrosséis por categoria** — substituiu os filtros de chips. Carrossel "Mais Vendidos" sempre visível + botão "Ver mais produtos" que expande os demais com animação suave
- [x] **Remover tweaks-panel do build** — `DevTweaks` só é carregado quando `import.meta.env.DEV` é verdadeiro; não entra no bundle de produção
- [x] **Página 404** — componente `NotFound.jsx` + `public/404.html` configurados
- [x] **Hero com imagem real** — `public/images/image-hero.png` substituiu o placeholder

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
