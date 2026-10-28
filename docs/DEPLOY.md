# Deploy na Cloudflare

O PetLuxo é um site 100% estático — não tem backend, banco de dados nem servidor. O deploy é automático: a cada `git push` para a branch `main`, o Workers Builds (Cloudflare) roda `npm run build` e `npx wrangler deploy`, que publica a pasta `dist/` no Worker `petluxo`.

**Site em produção:** https://www.petluxostory.com.br

Os commits do painel admin (`petluxo-admin`, outro repositório, hospedado na Vercel) também vão para `main` e disparam o build.

## Fluxo

1. Editar arquivos localmente
2. `npm run build` (verificar que compila sem erros; o validador de catálogo roda antes do Vite)
3. `git add -A && git commit -m "..." && git push`
4. O Workers Builds detecta o push em `main`, executa `npm run build` e `npx wrangler deploy` e publica `dist/` (cerca de 40 s)

## Configuração

- **`wrangler.jsonc`:** `name` `petluxo`, `assets.directory` `./dist`, `assets.not_found_handling` `single-page-application`. Sem script de Worker (só assets). O nome precisa ser o do Worker no dashboard.
- **`.nvmrc`:** `22` (Node usado no build; sem ele o padrão do Workers Builds seria outra versão).
- **`public/_headers`:** `Strict-Transport-Security: max-age=63072000`, `X-Content-Type-Options: nosniff` e `Referrer-Policy: strict-origin-when-cross-origin` para `/*`. Sem CSP e sem regras de cache (o padrão dos assets é `public, max-age=0, must-revalidate`).
- **Modo SPA:** acesso direto a `/produto/2`, às políticas e a qualquer URL inexistente devolve HTTP 200 com o `index.html` (soft 404); o app mostra o `NotFound`. `public/404.html` e a restauração de path em `src/main.jsx` ficam inertes.
- **Variáveis de ambiente:** nenhuma. `VITE_WHATSAPP_PHONE` é opcional; sem ela vale o número padrão do código.
- O `wrangler` não está no `package.json`: o `npx` baixa a versão do momento. `workers.dev` e as Preview URLs continuam ligados.

## Domínio

O domínio `petluxostory.com.br` é registrado no Registro.br e usa os dois nameservers atribuídos pela Cloudflare; o DNS é gerenciado na Cloudflare (plano Free).

- **`www` é o canônico:** Custom Domain do Worker.
- **A raiz** também é Custom Domain do Worker e redireciona com 301 para o `www`, preservando caminho e query (regra "raiz para www").
- **HTTP → HTTPS:** regra "http para https" (301). A Cloudflare não faz esse redirecionamento por padrão.
- **Zona:** 3 CAA (`pki.goog`, `sectigo.com`, `letsencrypt.org`), `_domainconnect` (DNS only), CNAME `*` → Vercel (DNS only; subdomínios que não sejam `www` caem na Vercel com 404) e as linhas "Worker" do `www` e da raiz. Sem MX nem TXT. DNSSEC desativado.

**Criar um Custom Domain:** Worker → aba Domains → Add domain, com o subdomínio na frente de `.petluxostory.com.br`.

- Campo de subdomínio **vazio** liga a **raiz**.
- Para uma raiz (ou outro hostname) que tem CNAME próprio, apagar o CNAME em DNS → Records antes; do contrário a Cloudflare recusa.
- Um hostname coberto só pelo CNAME `*` é aceito direto.

## Arquivos que carregam o domínio

- `index.html` — `og:url`, `og:image`, `twitter:image` (todos com `https://www.petluxostory.com.br`; sem `canonical`)
- `public/robots.txt` — 4 linhas, com `Sitemap:`; não tem `Host:`
- `public/sitemap.xml` — só a home

Para trocar o domínio, atualizar esses arquivos e os Custom Domains do Worker.

## Verificar se o deploy está correto

Após cada deploy, cheque:

- [ ] Site carrega sem erros no navegador
- [ ] O botão "COMPRAR AGORA" não aparece (oculto por `HIDE_BUY_CTA` em `ProductBuyButton.jsx`); o CTA ativo é "CONSULTAR VIA WHATSAPP"
- [ ] Botões WhatsApp funcionam (abrem conversa correta)
- [ ] Menu hambúrguer funciona no celular
- [ ] Imagens carregam (hero, logo, produtos)
- [ ] Favicon aparece na aba do navegador
- [ ] Acessar `/robots.txt` e `/sitemap.xml` retorna os arquivos corretos
- [ ] Google Analytics recebe eventos (GA4 → Tempo Real) — só depois de o visitante aceitar o consentimento no banner
- [ ] Abrir `/produto/2` direto e uma URL inexistente: ambas dão 200 (modo SPA)
- [ ] `curl -sI https://www.petluxostory.com.br/` e `curl -sI https://petluxostory.com.br/`: o `www` dá 200 e a raiz dá 301 para o `www`, ambos com `server: cloudflare`
- [ ] `curl -sI http://www.petluxostory.com.br/`: 301 para `https://`

---

## Se o deploy parar de funcionar

Verificar nesta ordem:

1. **Build com erros?** — Ver os Deployments/Builds do Worker `petluxo` no dashboard da Cloudflare e rodar `npm run build` localmente.
2. **App do GitHub desconectado?** — Reconectar o app "Cloudflare Workers and Pages" ao repositório `petluxo`.
3. **Build na fila?** — O plano Free roda um build por vez; builds seguidos (por exemplo, vários commits do painel) esperam na fila.

## Rollback e histórico

Rollback para a Vercel, decisões e registro da migração: `docs/CLOUDFLARE_MIGRATION.md` (seção 7).
