# Deploy na Cloudflare

O PetLuxo é um site estático (sem backend nem banco de dados) com um Worker pequeno só para SEO das rotas `/produto/*`. O deploy é automático: a cada `git push` para a branch `main`, o Workers Builds (Cloudflare) roda `npm run build` e `npx wrangler deploy`, que publica a pasta `dist/` e o script `worker/index.js` no Worker `petluxo`.

**Site em produção:** https://www.petluxostory.com.br

Os commits do painel admin (`petluxo-admin`, outro repositório, hospedado na Vercel) também vão para `main` e disparam o build.

## Fluxo

1. Editar arquivos localmente
2. `npm run build` (verificar que compila sem erros; o validador de catálogo roda antes do Vite e o `sitemap.xml` é gerado depois) e `npm run test:seo` (checagens de SEO; exigem o build feito)
3. `git add -A && git commit -m "..." && git push`
4. O Workers Builds detecta o push em `main`, executa `npm run build` e `npx wrangler deploy` e publica `dist/` (cerca de 40 s)

## Configuração

- **`wrangler.jsonc`:** `name` `petluxo`, `main` `worker/index.js`, `assets.directory` `./dist`, `assets.binding` `ASSETS`, `assets.not_found_handling` `single-page-application` e `assets.run_worker_first` `["/produto/*"]` (só essas rotas passam pelo Worker; o resto é servido direto como asset). O nome precisa ser o do Worker no dashboard.
- **Worker (`worker/index.js`, `worker/seo.js`):** em `/produto/<id>` de produto visível e canônico, reescreve com `HTMLRewriter` o `title`, `description`, `og:*`, `twitter:*` e insere `<link rel="canonical">`; remove `og:image:width/height/type` (valem para a imagem da home, não para a foto do produto). Produto inexistente, oculto ou formato inválido (`/produto/abc`, `/produto/44/x`): shell com HTTP 404, `X-Robots-Tag: noindex` e `<meta name="robots" content="noindex">`. `/produto/044` e `/produto/44/`: 301 para `/produto/44` (query preservada). Só trata GET e HEAD. O catálogo vem de `src/data/products.js` (empacotado pelo Wrangler).
- **`.nvmrc`:** `22` (Node usado no build; sem ele o padrão do Workers Builds seria outra versão).
- **`public/_headers`:** `Strict-Transport-Security: max-age=63072000`, `X-Content-Type-Options: nosniff` e `Referrer-Policy: strict-origin-when-cross-origin` para `/*`. Sem CSP e sem regras de cache (o padrão dos assets é `public, max-age=0, must-revalidate`).
- **`public/_headers` não vale para respostas do Worker:** por isso o Worker repete HSTS, `nosniff`, `Referrer-Policy` e `Cache-Control: public, max-age=0, must-revalidate` em todas as suas respostas.
- **Modo SPA:** fora de `/produto/*`, acesso direto às políticas e a qualquer URL inexistente devolve HTTP 200 com o `index.html` (soft 404); o app mostra o `NotFound`. Não existe `public/404.html` nem restauração de path em `src/main.jsx`.
- **Sitemap:** `scripts/generate-sitemap.js` roda no fim do `npm run build` e grava `dist/sitemap.xml` com a home e os produtos visíveis (`visible !== false`), em ordem de id, sem `lastmod`, `changefreq` nem `priority`; falha o build se `dist/` não existir ou se houver menos de 2 URLs. `public/sitemap.xml` (só a home) é sobrescrito no `dist/` e fica obsoleto.
- **Variáveis de ambiente:** nenhuma. `VITE_WHATSAPP_PHONE` é opcional; sem ela vale o número padrão do código.
- **Wrangler:** está em `devDependencies` (versão resolvida pelo `package-lock.json`); o `npx wrangler deploy` do Workers Builds usa a versão instalada. `workers.dev` está desligado (`"workers_dev": false` no `wrangler.jsonc`) e verificado por `curl` (o endereço responde 404). `"preview_urls": false` está definido no arquivo; as Preview URLs NÃO têm confirmação direta por `curl` (só o estado "desligado" visto no painel). O domínio próprio segue respondendo (`www` 200, raiz 301, `/produto/43` 200).

## Domínio

O domínio `petluxostory.com.br` é registrado no Registro.br e usa os dois nameservers atribuídos pela Cloudflare; o DNS é gerenciado na Cloudflare (plano Free).

- **`www` é o canônico:** Custom Domain do Worker.
- **A raiz** também é Custom Domain do Worker e redireciona com 301 para o `www`, preservando caminho e query (regra "raiz para www").
- **HTTP → HTTPS:** regra "http para https" (301). A Cloudflare não faz esse redirecionamento por padrão.
- **Zona:** 3 CAA (`pki.goog`, `sectigo.com`, `letsencrypt.org`) e as duas linhas "Worker" (raiz e `www`). Sem MX nem TXT. DNSSEC desativado.

**Criar um Custom Domain:** Worker → aba Domains → Add domain, com o subdomínio na frente de `.petluxostory.com.br`.

- Campo de subdomínio **vazio** liga a **raiz**.
- Para uma raiz (ou outro hostname) que tem CNAME próprio, apagar o CNAME em DNS → Records antes; do contrário a Cloudflare recusa.

## Arquivos que carregam o domínio

- `index.html` — `og:url`, `og:image`, `twitter:image` (todos com `https://www.petluxostory.com.br`; sem `canonical` estático: o canonical de produto vem do Worker)
- `public/robots.txt` — 4 linhas, com `Sitemap:`; não tem `Host:`
- `worker/seo.js` e `scripts/generate-sitemap.js` — constante `SITE` com o domínio
- `public/sitemap.xml` — só a home (obsoleto: o build gera `dist/sitemap.xml`)

Para trocar o domínio, atualizar esses arquivos e os Custom Domains do Worker.

## Verificar se o deploy está correto

Após cada deploy, cheque:

- [ ] Site carrega sem erros no navegador
- [ ] O botão "COMPRAR AGORA" não aparece (oculto por `HIDE_BUY_CTA` em `ProductBuyButton.jsx`); o CTA ativo é "CONSULTAR VIA WHATSAPP"
- [ ] Botões WhatsApp funcionam (abrem conversa correta)
- [ ] Menu hambúrguer funciona no celular
- [ ] Imagens carregam (hero, logo, produtos)
- [ ] Favicon aparece na aba do navegador
- [ ] Acessar `/robots.txt` e `/sitemap.xml` retorna os arquivos corretos (o sitemap tem a home + os produtos visíveis)
- [ ] Google Analytics recebe eventos (GA4 → Tempo Real) — só depois de o visitante aceitar o consentimento no banner
- [ ] `curl -s https://www.petluxostory.com.br/produto/2` traz `<title>` do produto e `<link rel="canonical">`; `/produto/999` e um produto oculto dão 404 com `x-robots-tag: noindex`; `/produto/02` dá 301 para `/produto/2`; uma URL fora de `/produto/*` (ex.: `/xyz`) ainda dá 200 (modo SPA)
- [ ] `curl -sI https://www.petluxostory.com.br/` e `curl -sI https://petluxostory.com.br/`: o `www` dá 200 e a raiz dá 301 para o `www`, ambos com `server: cloudflare`
- [ ] `curl -sI http://www.petluxostory.com.br/`: 301 para `https://`

---

## Se o deploy parar de funcionar

Verificar nesta ordem:

1. **Build com erros?** — Ver os Deployments/Builds do Worker `petluxo` no dashboard da Cloudflare e rodar `npm run build` localmente.
2. **App do GitHub desconectado?** — Reconectar o app "Cloudflare Workers and Pages" ao repositório `petluxo`.
3. **Build na fila?** — O plano Free roda um build por vez; builds seguidos (por exemplo, vários commits do painel) esperam na fila.

## Histórico

Decisões e registro da migração: `docs/CLOUDFLARE_MIGRATION.md`. O rollback para a Vercel não existe mais (seção 7).
