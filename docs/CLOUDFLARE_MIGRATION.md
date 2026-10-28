# Migração do site: Vercel (Hobby) → Cloudflare Workers com static assets

> **Status (2026-10-28):** **F3b CONCLUÍDA: a produção é servida pelo Worker `petluxo` na Cloudflare** (`www` canônico; raiz → `www` 301; HTTP → HTTPS 301). **F4 EM ANDAMENTO** (janela de rollback de 7 a 14 dias; o projeto Vercel do site fica intacto como plano B). Restam F0.6, F4 e F5. F1, F2 e F3a/F3a.6 foram executadas em 2026-10-27; a virada (F3b) em 2026-10-28. Levantamento feito em 2026-10-27 (curl, dig, `npm run build`, painéis da Vercel e da Cloudflare; documentação oficial consultada na mesma data). Tudo que não foi confirmado está em "NÃO VERIFICADO" (seção 8).
> Convenção: **[Dono]** = só a pessoa dona do negócio consegue (contas, painéis, Registro.br). **[Claude Code]** = mudança no repositório.

Revisão de 2026-10-27: 3 ajustes combinados (.nvmrc com a versão principal; _headers só com segurança; ensaio F3a.6).

Revisão de 2026-10-27: DNS real incorporado (ALIAS em vez de A; curinga; sem MX/TXT); F0.1, F0.2 e F0.5 concluídas; F1 aplicada e commitada; F3 aguarda acesso ao Registro.br.

Revisão de 2026-10-27: F2 executada (Worker de teste); `_headers` confirmado no fallback de SPA.

Revisão de 2026-10-27: F2 e F3a/F3a.6 executadas; nameservers na Cloudflare; ensaio concluído; F3b pronta.

Revisão de 2026-10-28: virada executada (F3b concluída; produção na Cloudflare); nova F3b.5 (regra HTTP → HTTPS); F0.5, F2.5 e F2.8 fechadas; rollback (seção 7) reescrito para o estado atual; os alvos da Vercel não aparecem mais no painel dela; F4 em andamento.

## 1. Objetivo e escopo

- **Migra:** a hospedagem do site `petluxo` (build `npm run build` → `dist/`, 99 arquivos, 14 MB) para um Worker da Cloudflare com static assets, servido em `www.petluxostory.com.br`, com a raiz redirecionando para o `www`.
- **Não migra:** o painel `petluxo-admin`, que continua na Vercel (seção 5 lista só os impactos).
- **Fora do escopo desta migração:** venda direta (carrinho, endereço, pagamento), meta tags por produto (TODO 2), privatizar o repositório (TODO 23). A seção 6 só registra requisitos para quando a venda direta vier.
- **Natureza do site:** 100% estático, sem `api/`, sem `vercel.json`, sem `.github/` (verificado). Não há função a portar. A migração é: arquivos estáticos + roteamento de SPA + cabeçalhos + DNS.

## Estado atual (2026-10-28)

| Fase | Estado | O que bloqueia / observação |
|---|---|---|
| F0 | **praticamente concluída** | F0.1 a F0.5 prontas (F0.3: DNSSEC não está ativo; F0.5 fechada em 2026-10-28). Pendente: F0.6 (GA4). |
| F1 | **pronta** | F1.1 a F1.9 aplicadas e commitadas (`abc65e9` código; `6b80883` docs); push e deploy confirmados em 2026-10-27. F1.10 e F1.11 seguem como estão. |
| F2 | **concluída, com pendências menores** | F2.1 a F2.3, F2.5 e F2.8 ok; F2.4 e F2.7 relatados pelo dono sem detalhe; pendências: hit do GA4 em Tempo Real (F0.6) e F2.6 (Playwright). Modo SPA confirmado pelo dono em 2026-10-28. |
| F3a e F3a.6 | **concluídas (2026-10-27)** | Zona `Free` na Cloudflare; nameservers trocados no Registro.br; ensaio com `teste1`/`teste2` feito e limpo. |
| F3b | **CONCLUÍDA (2026-10-28)** | Custom Domains `www` e raiz no Worker; regras "raiz para www" e "http para https" (301). Produção na Cloudflare. |
| F4 | **EM ANDAMENTO** | Janela de 2026-10-28 → 2026-11-04 a 2026-11-11. Projeto Vercel do site intacto (não mexer). Ver F4.1 a F4.9. |
| F5 | **pendente (pode andar agora)** | Texto final de DEPLOY/README/DECISIONS/TODO; a virada já ocorreu. `AI_CONTEXT_PETLUXO.md` reescrito em 2026-10-28. |

## 2. Decisões pendentes

| # | Decisão | Recomendação | Impacto |
|---|---|---|---|
| D1 | Domínio canônico | **Manter o `www`** (é o que responde hoje: `www` dá 200 e a raiz dá 307 → `www`, conferido por curl em 2026-10-27). Raiz → `www` com 301. Metadados alinhados ao `www`. | Muda `index.html:13,14,29`, `public/sitemap.xml:4`, `public/robots.txt:4` e a doc. Prévias já compartilhadas apontam para a raiz e seguem funcionando pelo redirecionamento. |
| D2 | Modo 404 do Worker | **`single-page-application`**: `/produto/2` e `/politica-de-privacidade` em acesso direto passam a dar 200 e abrir o app. | Hoje dão 404 (corpo do `404.html`). Contrapartida: URLs inexistentes (inclusive `/xyz.png` e `/assets/qualquer.js`) também devolvem o `index.html` com 200 (soft 404). O app já tem rota `*` com `NotFound` (`src/app/page.jsx:83`), mas o status HTTP continua 200 (TODO 1). **Validado em workers.dev em 2026-10-27** (links diretos = 200; soft 404 observado); decisão de manter o modo SPA **confirmada pelo dono em 2026-10-28** ao concluir a virada. |
| D3 | Privatizar o repositório | **Não agora.** | Miniaturas do painel dependem de `raw.githubusercontent.com` público; a documentação consultada não afirma suporte a repositório privado no Workers Builds (seção 8, item 2). |
| D4 | `canonical` | **Não colocar `<link rel="canonical">` estático no `index.html`.** | Como `/produto/:id` herda o `index.html` da home (TODO 2), um canonical fixo na home diria ao Google que todas as fichas são cópias da home. Fazer só junto com meta tags por rota. |
| D5 | Fixar `wrangler` em `devDependencies` | Recomendado (fixa a versão usada no deploy e permite `wrangler dev` local). | A doc do Workers Builds diz que usa o Wrangler do `package.json`; sem ele usa o padrão do build. Não instalar nesta tarefa. |
| D6 | Deploy por Workers Builds (Git) ou GitHub Actions | **Workers Builds** (mais simples; o painel continua só dando commit). | Limite grátis: 3.000 min/mês, 1 build simultâneo, timeout 20 min (https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/). Build local levou ~22 s. |
| D7 | Aposentar `public/404.html` e a restauração em `main.jsx:8-13` | **Depois** de validar D2 em produção (o TODO 1 manda não remover antes de validar). | Com SPA mode ficam inertes. |
| D8 | DNSSEC | **Não ativar** na Cloudflare por ora. | Hoje não há DS/DNSKEY visível (seção 3). Ativar depois complica o rollback (seção 7). |

## 3. Caminho crítico (ordem mínima até a virada)

1. **Já feito:** F0.1 a F0.5; F1 (commitada); F2; F3a e F3a.6 (2026-10-27); **F3b, a virada (2026-10-28): CONCLUÍDA**. A produção é servida pelo Worker `petluxo` na Cloudflare.
2. **Pendente, sem dependências externas:**
   - **[Dono] F0.6** – conferir o domínio do stream do GA4 e filtros de hostname (e o hit em Tempo Real; ver F2.4).
   - **[Claude Code] F5** – documentação final (DEPLOY/README/DECISIONS/TODO); a virada já ocorreu.
3. **[Dono + Claude Code] F4 (EM ANDAMENTO)** – prévias, monitorar 7 a 14 dias (2026-11-04 a 2026-11-11), manter o projeto Vercel do site intacto (plano B), depois removê-lo. Ver F4.1 a F4.9.
4. **[Claude Code] F5** – documentação final.
5. **O acesso ao Registro.br** só será necessário para um rollback extremo (devolver os nameservers à Vercel; exige o titular do domínio).

## 4. Checklist por fase

Formato de cada item: descrição · **Resp.** · arquivo:linha · **Dep.** · **Verificar** · **Risco** · **Rollback**.

### F0 – Levantamentos do dono

- [x] **F0.1 Criar conta Cloudflare com 2FA.** Feito em 2026-10-27 (conta criada, 2FA ativado). Resp.: Dono. Risco: baixo. Rollback: n/a.
- [x] **F0.2 Exportar os registros DNS da Vercel.** Feito em 2026-10-27, lido no painel da Vercel (o registrador é um terceiro; os nameservers são os da Vercel: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`, o que confirma `docs/DEPLOY.md`, seção "Domínio customizado"). Resp.: Dono. Risco que existia: registro esquecido; **resolvido** porque a lista é pequena e completa. Registros reais:

  | Nome | Tipo | Valor | TTL |
  |---|---|---|---|
  | (sem nome = raiz; **assumido**) | ALIAS | `81d99fac47f9cbab.vercel-dns-017.com` | 60 |
  | `*` | ALIAS | `cname.vercel-dns-017.com.` | 60 |
  | raiz | CAA | `0 issue "pki.goog"` | 60 |
  | raiz | CAA | `0 issue "sectigo.com"` | 60 |
  | raiz | CAA | `0 issue "letsencrypt.org"` | 60 |

  - **Não há MX, TXT, AAAA nem registros A.** A ausência de MX e TXT elimina o risco de e-mail e de verificações de domínio, e resolve o antigo NÃO VERIFICADO sobre "registros além dos vistos".
  - A Vercel avisa que os dois ALIAS são gerenciados por ela e "podem mudar sem aviso". O "A 76.76.21.21" do formulário da Vercel é só o valor padrão do formulário, não um registro existente.
  - **`_domainconnect`:** a importação automática da Cloudflare (F3a.1) trouxe também um CNAME `_domainconnect` → `_domainconnect.vercel-dns.com` que **não aparece** na tabela do painel da Vercel acima; ficou na zona como DNS only (seção 8, item 24).
  - Os IPs vistos por `dig` em 2026-10-27 (`64.29.17.1`, `216.198.79.1`, `64.29.17.65`) são o **resultado de resolver os ALIAS**, não registros existentes. SOA: `ns1.vercel-dns.com` / `hostmaster.nsone.net`.
  - No projeto Vercel do site estão ligados a raiz (que redireciona para o `www`) e o `www`. Nenhum outro projeto aparece ligado a este domínio; o painel `petluxo-admin` provavelmente está num `*.vercel.app` (NÃO VERIFICADO).
  - Certificados da Vercel: wildcard + raiz e `www`, renovação automática, expiram em 2026-12-10 (relevante só se o rollback para a Vercel for necessário depois dessa data).
- [x] **F0.3 Verificar DNSSEC no Registro.br.** Concluída em 2026-10-27: `dig DS` e `dig DNSKEY` voltaram vazios e a tela de DNS do Registro.br não mostra nenhuma seção de DNSSEC: **não está ativo**. Resp.: Dono. Risco que existia (SERVFAIL após a troca de NS): não se aplicou. **Registro.br:** o domínio consta como "Publicado" e vence em 2027-05-07. O painel mostra um alerta de segurança da conta recomendando senha mais forte: pendência do titular do domínio, a fazer sem pressa e sem mexer na conta durante a virada.
- [x] **F0.4 Instalar o app do GitHub "Cloudflare Workers and Pages"** apenas no repositório `petluxo`. **Feita dentro da F2.1 em 2026-10-27** (ao importar o repositório). Resp.: Dono. Dep.: F0.1. Verificar: repositório aparece na lista ao criar o Worker. Risco: baixo. Rollback: desinstalar o app no GitHub.
- [x] **F0.5 `VITE_WHATSAPP_PHONE`.** Resolvido em 2026-10-27: o projeto Vercel do site **não tem nenhuma variável de ambiente** (lista vazia no painel); a produção usa o número padrão do código (`src/lib/whatsapp.js:3-4`). Nada a cadastrar na Cloudflare. A aba "Shared" das variáveis não foi conferida (opcional, seção 8). Resp.: Dono. Risco: baixo; para cobrir o resto, **depois da F2.5 conferir que o número que abre nos botões do site de teste é igual ao da produção** (**conferido em 2026-10-28**: produção e Worker serviam o mesmo `assets/index-Ch6Q2MER.js`, código idêntico, logo o mesmo número; ver F3b.0). Rollback: n/a.
- [ ] **F0.6 Conferir o domínio do stream do GA4** (Admin → Data streams) e se há filtro de hostname. **Pendente (2026-10-27).** Resp.: Dono. Risco: baixo. NÃO VERIFICADO no código.

### F1 – Mudanças no repositório (aplicada e commitada em 2026-10-27)

- [x] **F1.1 `.nvmrc` (novo, raiz)** com o conteúdo exato `22` (só a versão principal). Justificativa: a versão principal resolve para a 22.x pré-instalada na imagem de build da Cloudflare (https://developers.cloudflare.com/workers/ci-cd/builds/build-image/) e não quebra se o patch mudar; o Node local do dono (22.23.4) pertence à mesma linha 22. Resp.: Claude Code. Dep.: nenhuma. Verificar: o log do build mostra Node 22.x. Risco: baixo. Rollback: remover o arquivo. *Correção:* o padrão do Workers Builds hoje é **24.22.1** (não 24.18.0); por isso o arquivo é necessário: sem `.nvmrc` o build rodaria em Node 24 em vez de 22. Alternativa equivalente: variável de build `NODE_VERSION` com o valor `22`. (F1.1 com 22 por ajuste combinado)
- [x] **F1.2 `wrangler.jsonc` (novo, raiz)** — conteúdo exato:
  ```jsonc
  {
    "name": "petluxo",
    "compatibility_date": "2026-10-27",
    "assets": {
      "directory": "./dist",
      "not_found_handling": "single-page-application"
    }
  }
  ```
  Sem `main` (Worker só de assets, sem script). Sem `routes` de propósito: os Custom Domains são criados no dashboard na F3b, porque exigem zona ativa. O nome tem que ser o mesmo do Worker criado no dashboard (NÃO VERIFICADO o efeito exato de nomes diferentes no Workers Builds). Se D2 virar `404-page`, trocar o valor para `"404-page"`. Resp.: Claude Code. Verificar: `npx wrangler deploy --dry-run` seria o teste local, mas exige instalar o pacote — fica para o deploy de teste (F2). Risco: baixo. Rollback: remover o arquivo (a Vercel ignora).
  Fonte: https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/
- [x] **F1.3 `public/_headers` (novo)** — conteúdo exato: (F1.3 só segurança, por ajuste combinado)
  ```
  /*
    Strict-Transport-Security: max-age=63072000
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
  ```
  Sem regras de cache de propósito: a Vercel hoje serve tudo sem cache longo, então não há perda. Isso elimina o risco de o fallback de SPA devolver `index.html` com `immutable` por 1 ano para um chunk antigo de `/assets/*`. Justificativas: (a) HSTS com o mesmo valor que a Vercel serve hoje (`max-age=63072000`), **sem** `includeSubDomains`/`preload` (não é decisão desta migração); (b) sem CSP: GA4 e Google Fonts exigiriam uma política cuidadosa, tratar à parte. O padrão da Cloudflare para assets é `public, max-age=0, must-revalidate`, igual ao que a Vercel serve hoje (doc: https://developers.cloudflare.com/workers/static-assets/headers/). Limites: 100 regras, 2.000 caracteres por linha. `_headers` **não** vale para respostas geradas por Worker (não há Worker aqui). Resp.: Claude Code. Dep.: F1.2. Verificar: `curl -I` em cada tipo de URL (F2). Risco: **baixo** — a única dúvida é se `_headers` se aplica ao `index.html` servido pelo fallback de SPA; o teste F2.2 resolve conferindo os 3 cabeçalhos de segurança numa rota de SPA (ex.: `/produto/2`). **Resolvido em 2026-10-27 (F2.2): o `_headers` se aplica ao `index.html` servido pelo fallback de SPA.** Rollback: apagar o arquivo.
- [x] **F1.4 Metadados com `www`** (D1) — diffs em texto:
  - `index.html:13`: `<meta property="og:url" content="https://petluxostory.com.br"/>` → `content="https://www.petluxostory.com.br/"`
  - `index.html:14`: `og:image` → `https://www.petluxostory.com.br/og-image.jpg`
  - `index.html:29`: `twitter:image` → `https://www.petluxostory.com.br/og-image.jpg`
  - Sem canonical (D4). Resp.: Claude Code. Verificar: `curl -s https://www.petluxostory.com.br/ | grep og:` e depuradores de prévia (F2.8). Risco: baixo (as URLs antigas passam por 301 → `www`). Rollback: reverter o commit.
- [x] **F1.5 `public/sitemap.xml:4`**: `<loc>https://petluxostory.com.br/</loc>` → `<loc>https://www.petluxostory.com.br/</loc>`; atualizar `lastmod` (linha 5, hoje `2026-05-04`). O sitemap só lista a home (verificado). Resp.: Claude Code. Rollback: reverter.
- [x] **F1.6 `public/robots.txt:4`**: `Sitemap: https://petluxostory.com.br/sitemap.xml` → `Sitemap: https://www.petluxostory.com.br/sitemap.xml`. (O arquivo tem 4 linhas e **não** tem `Host:`, ao contrário do que `docs/DEPLOY.md` afirma.) Resp.: Claude Code. Rollback: reverter.
- [x] **F1.7 `src/lib/analytics.js:80-87` — nenhuma mudança.** O domínio `.petluxostory.com.br` cobre raiz e `www`; os cookies de analytics continuam sendo limpos igual. Resp.: Claude Code (só confirmar). Risco: nenhum.
- [x] **F1.8 `src/main.jsx:8` (comentário) e `public/404.html`** — conforme D2/D7:
  - **Agora (SPA mode):** manter `404.html` e `main.jsx:9-13` como estão (inertes, inofensivos) e só trocar o comentário da linha 8 para `// Restaura pathname gravado pelo 404.html (legado do redirect SPA da Vercel; inerte com o fallback de SPA da Cloudflare)`.
  - **Depois de validado (F4):** remover `public/404.html` e o bloco `main.jsx:9-13`.
  - **Se D2 = `404-page`:** manter `404.html` e o bloco (o `404.html` passa a ser servido com status 404 e o redirect JS continua necessário; https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/).
  Resp.: Claude Code. Risco: baixo. Rollback: reverter.
- [x] **F1.9 `.gitignore`** (hoje `.vercel` na linha 9): **manter** `.vercel` até o projeto Vercel sair; **acrescentar** as linhas `.wrangler/` e `.dev.vars`. Resp.: Claude Code. Risco: nenhum.
- [ ] **F1.10 (D5, opcional) `package.json`:** acrescentar `wrangler` em `devDependencies` e, se quiser, `"engines": { "node": ">=22" }`. O `build` atual (`node scripts/validate-catalog.js && vite build`) funciona sem mudança. Resp.: Claude Code (exige `npm install`, que esta tarefa não faz). Risco: baixo. **Observação (2026-10-27):** o deploy da F2 instalou o `wrangler` 4.154.0 na hora via `npx`, porque ele não está no `package.json`; a versão pode variar entre builds, o que reforça a recomendação (opcional) de fixá-lo.
- [ ] **F1.11 Confirmar que nada mais no repositório depende da Vercel:** `grep -rni vercel src tests scripts index.html` não achou nada (verificado em 2026-10-27); as ocorrências estão só em docs (F5) e em `.gitignore:9`.

### F2 – Deploy de teste em `*.workers.dev` e aceitação

- [x] **F2.1 Criar o Worker** (dashboard → Workers & Pages → Create → Import a repository → `petluxo`). Feito em 2026-10-27. Build command: `npm run build`. Deploy command: padrão `npx wrangler deploy`. Production branch: `main`. Resp.: Dono. Dep.: F0.1 e F1.1–F1.3. Verificar: build verde; URL `https://petluxo.<subdomínio-da-conta>.workers.dev` abre. Risco: baixo; em 2026-10-27 a Vercel ainda era a produção. Rollback: excluir o Worker. **Dados do log do Workers Builds (2026-10-27):**
  - Worker `petluxo` criado por importação do repositório GitHub, com o app do GitHub instalado só no repositório `petluxo` (F0.4). Sem variáveis de build (ver F0.5).
  - Node detectado: **22.23.4** (o `.nvmrc` `22` funcionou); npm 10.9.2; instalação por `npm clean-install` (74 pacotes, ~2 s); `npm run build` ok (validador do catálogo com 0 avisos; Vite 6.4.2 em ~1,8 s).
  - O `wrangler` 4.154.0 foi instalado na hora pelo `npx`, pois não está no `package.json` (ver F1.10/D5: a versão pode variar entre builds).
  - A Cloudflare leu **142 arquivos** de `dist/` e subiu 98 novos (1 já existia). O build local tem 99 arquivos únicos; a diferença (provável: contagem de arquivos × ativos únicos) é **NÃO VERIFICADA**, sem alarme (limite grátis: 20.000).
  - Duração total do build + deploy: ~40 s.
  - **Avisos do deploy:** (1) `workers_dev` não está no `wrangler.jsonc`, então ficou ligado por padrão; (2) `preview_urls` não está no `wrangler.jsonc`, então as Preview URLs ficaram ligadas por padrão. Consequência: depois da virada o site continuaria acessível também pelo endereço `workers.dev` (conteúdo duplicado para buscadores); ver F4.8.
- [x] **F2.2 Testes de aceitação por URL** (usar `curl -sI` e navegador). Executados em 2026-10-27 (`curl -sI` no Worker). Resp.: Claude Code (curl) + Dono (navegador/celular):

  | URL | Esperado (SPA mode) | Hoje na Vercel (conferido) | Resultado em workers.dev (2026-10-27) |
  |---|---|---|---|
  | `/` | 200, home | 200 | 200, `text/html` |
  | `/produto/2` (acesso direto, aba nova) | 200, abre a ficha do produto 2 | 404 + redireciona por JS | 200, `text/html` (`index.html`) |
  | `/produto/9999` | 200 e a tela `NotFound` do app (`page.jsx:83`) | 404 + redireciona | 200, `text/html` (`index.html`) |
  | `/politica-de-privacidade` (direto) | 200, abre a política | 404 + redireciona | 200, `text/html` (`index.html`) |
  | `/politica-de-troca-e-devolucao`, `/politica-de-frete-e-entrega`, `/termos-de-uso` | 200, abrem a página | NÃO VERIFICADO (mesma lógica) | não testadas por `curl` (mesma lógica do fallback) |
  | URL inexistente `/qualquer-coisa` | 200 e `NotFound` do app (soft 404, ver D2) | 404 | 200, `text/html` (`index.html`; soft 404 aceito pelo modo SPA) |
  | `/xyz.png` | **200 com o `index.html`** (soft 404, aceitar ou mudar D2) | 404 (corpo do `404.html`) | 200, `text/html` (`index.html`; soft 404) |
  | `/assets/inexistente.js` | 200 com `index.html`; basta confirmar que **NÃO** vem `immutable` | 404 | 200, `text/html`; **sem** `immutable` |
  | `/404.html` | ~~200~~ **307 → `/404`** (expectativa corrigida: o padrão `auto-trailing-slash` redireciona `/arquivo.html` para `/arquivo`; https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/ mostra esse padrão, sem citar `/404.html`) | 200 | **307**, `location: /404`; `/404` dá 200, `text/html`, título `PetLuxo` (diferente do da home) e contém o script de redirect do `404.html` |
  | `/sitemap.xml` | 200, `application/xml`, `<loc>` com `www` | 200 | 200, `application/xml` (`<loc>` não conferido por `curl` nesta rodada) |
  | `/robots.txt` | 200, `text/plain`, `Sitemap:` com `www` | 200 | 200, `text/plain` (`Sitemap:` não conferido por `curl` nesta rodada) |
  | `/og-image.jpg` | 200, `image/jpeg`, 73.046 B | NÃO VERIFICADO por curl hoje | 200, `image/jpeg` (tamanho não conferido) |
  | `/assets/index-*.js` (nome do build) | 200 com o mesmo cache padrão de hoje, `Cache-Control: public, max-age=0, must-revalidate`, sem `immutable` | `public, max-age=0, must-revalidate` | cache padrão `public, max-age=0, must-revalidate` informado em todas as respostas; esta URL específica não foi detalhada |

  Em **todas** as respostas, inclusive nas de fallback de SPA (`/produto/2` etc.), vieram `strict-transport-security: max-age=63072000`, `x-content-type-options: nosniff` e `referrer-policy: strict-origin-when-cross-origin`. Os metadados do HTML (`og:url`, `og:image`) já apontam para `www.petluxostory.com.br`. Comparar com a Vercel, que também envia `access-control-allow-origin: *` e `content-disposition: inline` nos estáticos (visto em 2026-10-27); o site não depende de CORS (fontes e GA4 são de terceiros), e o dono relatou que nada quebrou no navegador (F2.7). **`_headers` no fallback de SPA: RESOLVIDO em 2026-10-27**: o arquivo se aplica ao `index.html` servido pelo fallback.
- [x] **F2.3 Prévia de compartilhamento no WhatsApp.** A URL `workers.dev` tem `og:image` apontando para `www.petluxostory.com.br` (em 2026-10-27 a produção ainda estava na Vercel); portanto o teste real de prévia é **depois** da F3b (F4.1). Confirmado em 2026-10-27 que os metadados do HTML apontam para o `www`. Resp.: Claude Code.
- [ ] **F2.4 GA4 com consentimento.** Em `<workers.dev>`, abrir a home, aceitar o banner, ver o hit em GA4 → Tempo Real; recusar e confirmar que `gtag.js` não carrega (o fluxo está coberto por `tests/analytics-consent.spec.js`). Atenção: filtro de hostname no GA4 pode descartar hits de `workers.dev` (F0.6). Resp.: Dono. **Relatado pelo dono em 2026-10-27 (consentimento do GA4 "tudo certo"), sem evidência detalhada. Pendente só a conferência explícita do hit em GA4 → Tempo Real (F0.6).**
- [x] **F2.5 Links do WhatsApp.** Clicar nos CTAs da home, do card e da ficha; conferir que abrem `wa.me/<número esperado>` com a mensagem (`src/lib/whatsapp.js:6`). Resp.: Dono. **Relatado pelo dono em 2026-10-27 (botões de WhatsApp "tudo certo"). Fechada em 2026-10-28: antes da virada, a produção (Vercel) e o Worker de teste serviam o mesmo arquivo JS `assets/index-Ch6Q2MER.js` (código idêntico, logo o mesmo número de WhatsApp).**
- [ ] **F2.6 Playwright.** `tests/analytics-consent.spec.js:3` fixa `BASE_URL = 'http://localhost:5173'` e `playwright.config.js` sobe `npm run dev`. Eles testam o código local, não a URL publicada. Rodar o conjunto localmente como regressão; para rodar contra o `workers.dev` seria preciso parametrizar `BASE_URL` (mudança opcional, fora do necessário). Resp.: Claude Code. Risco: baixo. **Segue pendente.**
- [ ] **F2.7 Navegação real no celular/iPad** (menu hambúrguer, galeria, lightbox sob demanda — o chunk `ProductLightbox-*.js` é carregado só em touch). Resp.: Dono. **Relatado pelo dono em 2026-10-27 ("testei e está tudo certo": acesso direto a `/produto/2`, política e URL inexistente, navegação), sem evidência detalhada por item; celular/iPad e lightbox não detalhados.**
- [x] **F2.8 Critério para seguir:** todas as linhas acima conferidas e a decisão D2 fechada. **Fechada em 2026-10-28: o dono confirmou o modo SPA ao concluir a virada** (F2.5 também fechada; o hit do GA4 em Tempo Real de F2.4 segue em F0.6). Rollback: ver seção 7.

### F3 – DNS em duas etapas

**F3a – zona na Cloudflare, tudo ainda apontando para a Vercel (CONCLUÍDA em 2026-10-27)**

- [x] **F3a.1 Adicionar `petluxostory.com.br` à Cloudflare** (plano Free, "Full setup"). Feita em 2026-10-27. Opção "Import DNS records: Automatic"; Bot Preference Sync desligado; todas as opções de bots em "Allow". A importação automática trouxe: 6 registros A (com IPs fixos da Vercel, para `*`, raiz e `www`, todos **proxied**), os 3 CAA e um CNAME `_domainconnect` → `_domainconnect.vercel-dns.com` (proxied) que não está na exportação da Vercel. Resp.: Dono.
- [x] **F3a.2 Recriar na zona os registros exportados em F0.2, todos DNS only (nuvem cinza).** Feita em 2026-10-27. Correção sobre o importado: os 6 A foram **apagados**; criados CNAME raiz → `81d99fac47f9cbab.vercel-dns-017.com` e CNAME `*` → `cname.vercel-dns-017.com`, ambos DNS only; `_domainconnect` passou para DNS only; os 3 CAA ficaram como estavam. **Estado final da zona: 6 registros (3 CAA, `_domainconnect`, `*`, raiz), todos DNS only.** Para qualquer rollback, usar os alvos registrados aqui e conferi-los com `dig` (último: 2026-10-28); a Vercel avisa que os alvos podem mudar sem aviso, e os ALIAS não aparecem mais no painel dela (seção 8, item 29). Resultados dos pontos da documentação:
  - (a) **CNAME na raiz (flattening) no plano Free: RESOLVIDO.** A Cloudflare aceitou o CNAME na raiz no plano Free e mostrou o aviso informativo de que usa CNAME flattening ("CNAME records normally can not be on the zone apex. We use CNAME flattening to make it possible"). Fonte da doc: https://developers.cloudflare.com/dns/cname-flattening/.
  - (b) **CAA × certificados da Cloudflare: RESOLVIDO.** Os 3 CAA existentes (`pki.goog`, `sectigo.com`, `letsencrypt.org`) bastaram para emitir os certificados dos dois hostnames de teste; **não** foi preciso acrescentar `ssl.com`. Doc: https://developers.cloudflare.com/ssl/edge-certificates/caa-records/.
  - (c) **CNAME curinga × Custom Domain de hostname exato: RESOLVIDO** pelo ensaio F3a.6: hostname coberto só pelo curinga é aceito direto; hostname com CNAME próprio é recusado até o CNAME ser apagado.
  - **Conferência pré-troca:** `dig @<ns da Cloudflare>`: `www` → CNAME para `cname.vercel-dns-017.com`; raiz → A `216.198.79.1` e `64.29.17.1` (achatado). O resolver público respondia raiz = `216.198.79.65` e `64.29.17.65`. `curl --resolve` contra `216.198.79.1` e `64.29.17.1`: raiz 307 → `www` e `www` 200, `server: Vercel` nos dois IPs (a zona na Cloudflare entrega o mesmo site que a Vercel).
- [x] **F3a.3 DNSSEC:** não se aplicou (F0.3: não está ativo). Nenhum DS removido.
- [x] **F3a.4 Trocar os nameservers no Registro.br** pelos dois nameservers atribuídos pela Cloudflare. Feita em 2026-10-27 pelo titular do domínio, com o dono ao lado; mensagem de sucesso, sem "Pesquisa recusada". `dig @a.dns.br petluxostory.com.br NS +norecurse` passou a mostrar os nameservers da Cloudflare em poucos minutos (**menos de 5**). Durante todo o processo `www` seguiu 200 e a raiz 307 → `www`, `server: Vercel`. No painel da Vercel o domínio passou a "Nameservers: Third Party", sem erro, ainda ligado ao projeto `petluxo`. **Desvio do plano:** feita no início da noite de um dia útil, e não de madrugada; funcionou porque os registros apontavam para a Vercel e nada mudou para o visitante. **Rollback:** para o rollback comum basta mexer nos registros da zona na Cloudflare, sem o Registro.br; o rollback extremo (devolver `ns1.vercel-dns.com` e `ns2.vercel-dns.com`) exige o titular. **Atenção:** os certificados da Vercel (wildcard e `www`) expiram em 2026-12-10 e o wildcard depende dos nameservers da Vercel para renovar; se o site voltar à Vercel depois dessa data, a Vercel precisa reemitir.
- [x] **F3a.5 Esperar o site estável.** Conferido por `curl -sI` em 2026-10-27 (no registro de execução, seção 9): `www` 200 e raiz 307 → `www`, ambos `server: Vercel`. O ensaio F3a.6 foi feito no mesmo dia (tempo de espera entre F3a.4 e F3a.6: NÃO VERIFICADO).
- [x] **F3a.6 Ensaio com subdomínios descartáveis (CONCLUÍDO e limpo, 2026-10-27).** Resp.: Dono (curl pelo Claude Code). Resultados:
  - **Caso 1, `teste1` (coberto só pelo curinga `*`, equivalente ao `www`):** o Custom Domain foi **ACEITO direto** no Worker, sem registro próprio. Em cerca de 1 a 2 minutos o `dig` mostrou IPs da Cloudflare e `curl -I /produto/2` deu 200, `server: cloudflare`, com os 3 cabeçalhos de segurança (`strict-transport-security`, `x-content-type-options`, `referrer-policy`). Antes do Custom Domain, o `teste1` caía na Vercel com 404 (curinga).
  - **Caso 2, `teste2` (com CNAME próprio, equivalente à raiz):** com o CNAME existente, o Worker **RECUSOU** o Custom Domain com a mensagem exata: "Hostname 'teste2.petluxostory.com.br' already has externally managed DNS records (A, CNAME, etc). Delete them first or try a different hostname." Depois de apagar o CNAME, foi **ACEITO** e funcionou em menos de 1 minuto (200, `server: cloudflare`). **Conclusão: para a raiz, apagar o CNAME antes; o `www` pode ser ligado direto.**
  - **Certificados:** emitidos sem falha nos dois hostnames (1 a 2 minutos); CAA suficientes (ver F3a.2 b).
  - O Custom Domain cria na lista de DNS uma linha do tipo "Worker" (proxied), sem botões Edit/Delete; some quando o Custom Domain é removido do Worker.
  - **Regra de redirecionamento** (Rules → Redirect Rules → Create rule, modelo "Wildcard pattern"): requisição `https://teste2.petluxostory.com.br/*`, destino `https://www.petluxostory.com.br/${1}`, 301, "Preserve query string" marcado. Teste: `curl -sI "https://teste2.petluxostory.com.br/produto/2?x=1"` → 301 e `location: https://www.petluxostory.com.br/produto/2?x=1`. O formulário tem também "Redirect POST requests" (só relevante para POST). O plano Free mostrou "0 of 10" regras antes e depois. O teste (d) do plano foi feito só no `teste2` (hostname com Custom Domain proxied), não no `teste1`.
  - **Limpeza:** regra apagada (0 of 10), Custom Domains `teste1` e `teste2` removidos do Worker, DNS de volta às 6 linhas. `dig @<ns da Cloudflare> teste2...` devolveu o CNAME da Vercel; o resolver local demorou alguns minutos a esquecer (caches), e o painel de DNS ainda mostrou por um tempo a linha "Worker" do `teste1` (resíduo de exibição). Nota: depois da limpeza o CNAME próprio do `teste2` também foi apagado/removido (DNS de volta às 6 linhas).
  - **Não respondido pelo ensaio (NÃO VERIFICADO):** se "Always Use HTTPS" está ligado por padrão na zona e como se comporta o HTTP→HTTPS (respondido na virada: a Cloudflare não redirecionou HTTP→HTTPS por padrão; ver F3b.5). Não foi rodado o subconjunto completo da tabela F2.2 (itens `/404.html`, `/sitemap.xml`, `/robots.txt`) nos hostnames de teste: só `/produto/2` foi registrado.

  Risco: nenhum para produção (hostnames separados). Rollback: apagar os recursos de teste (já feito).

**F3b – hostname para o Worker + redirecionamento raiz/www (CONCLUÍDA em 2026-10-28, ~09:24 a ~09:47, horário de Brasília)**

Ordem confirmada pelo ensaio F3a.6. Duração medida: 1 a 2 minutos por hostname; a raiz ficou sem resposta por ~2 minutos entre apagar o CNAME e o Custom Domain ficar ativo.

- [x] **F3b.0 Pré-checagem (2026-10-28, antes da virada).** O site abria (Vercel); o último deploy do Worker `petluxo` estava Ready; o número do WhatsApp é o mesmo na produção e no Worker de teste (os dois serviam o mesmo arquivo JS `assets/index-Ch6Q2MER.js`: código idêntico; fecha F0.5 e F2.5); os dois alvos da Vercel (`81d99fac47f9cbab.vercel-dns-017.com` e `cname.vercel-dns-017.com`) ainda resolviam (216.198.79.1 e 64.29.17.1). **Descoberta:** no painel de DNS da Vercel, depois da troca de nameservers, só os 3 CAA aparecem; os dois ALIAS sumiram (motivo NÃO VERIFICADO). Logo, "reler os alvos no painel da Vercel antes do rollback" não é mais possível: valem os alvos registrados neste documento, conferidos por `dig` (último: 2026-10-28).
- [x] **F3b.1 Passo 1 (`www`).** Worker → Domains → Add domain, subdomínio `www`; aceito direto (o CNAME `*` e os 3 CAA ficaram). Em menos de 2 minutos `dig @<ns da Cloudflare>` devolveu IPs da Cloudflare; `curl -I /produto/2` deu 200, `server: cloudflare`, com os 3 cabeçalhos de segurança; navegador (aba anônima) ok. Rollback: remover o Custom Domain do Worker (o curinga devolve o `www` à Vercel em 1 a 2 minutos).
- [x] **F3b.2 Passo 2 (raiz).** Em DNS → Records, o CNAME da raiz foi apagado; logo depois Worker → Add domain com subdomínio **VAZIO**; aceito. Em ~2 minutos a raiz respondia pela Cloudflare (200, `server: cloudflare`). A raiz ficou sem resposta ~2 minutos nesse intervalo. O CNAME `*` e os 3 CAA ficaram. Rollback: seção 7.
- [x] **F3b.3 Passo 3 (regra "raiz para www").** Rules → Redirect Rules, modelo "Wildcard pattern": requisição `https://petluxostory.com.br/*`, destino `https://www.petluxostory.com.br/${1}`, **301**, "Preserve query string" marcado. Teste: `https://petluxostory.com.br/produto/2?x=1` → 301 com `location: https://www.petluxostory.com.br/produto/2?x=1`; o `www` segue 200, `server: cloudflare`. `_redirects` **não** serve (https://developers.cloudflare.com/workers/static-assets/redirects/).
- [x] **F3b.4 Passo 4 (verificação final).** `curl -sIL "http://petluxostory.com.br/produto/2?x=1"` → 301 → 301 (`www`, query preservada) → 200, tudo `server: cloudflare`. No `www`: 200 em `/`, `/produto/2`, `/produto/9999`, `/politica-de-privacidade`, `/qualquer-coisa` (soft 404), `/sitemap.xml` (`application/xml`), `/robots.txt` (`text/plain`) e `/og-image.jpg` (`image/jpeg`); HSTS e `x-content-type-options` presentes em todas (o `referrer-policy` não foi repetido no filtro do teste final; seção 8, item 30). Navegador: o dono testou home, raiz → `www` e produtos ("tudo ok, nada de estranho", relatado sem detalhe por item).
- [x] **F3b.5 Regra HTTP → HTTPS.** A Cloudflare **não** redirecionou HTTP→HTTPS por padrão (`http://www...` e `http://` da raiz davam 200; a Vercel fazia 308). "Always Use HTTPS" não foi consultada nem alterada. Solução: regra pelo modelo "Redirect from HTTP to HTTPS" (Wildcard pattern, Request URL `http://*`, Target URL `https://${1}`, 301, Preserve query string, Place at: Last). Testes: `http://www.petluxostory.com.br/produto/2` → 301 para `https://www.petluxostory.com.br/produto/2`; `http://petluxostory.com.br/produto/2?x=1` → 301 para `https://petluxostory.com.br/produto/2?x=1` (que a regra da raiz leva ao `www`). Plano Free: 2 de 10 regras usadas.

**Estado ao fim da virada:** a produção é servida pelo Worker `petluxo`; o projeto Vercel do site fica intacto como plano B (janela de 7 a 14 dias; não mexer); o painel admin continua na Vercel. Zona: 3 CAA, `_domainconnect` (DNS only), CNAME `*` → Vercel (DNS only; subdomínios que não sejam `www` continuam caindo na Vercel com 404), mais as linhas "Worker" do `www` e da raiz. A raiz não tem mais o CNAME para a Vercel. Regras: "raiz para www" e "http para https" (301).

### Notas operacionais (interface da Cloudflare, aprendidas em 2026-10-27)

- **Custom Domain no Worker:** Worker → aba Domains → "Add domain" → campo de subdomínio na frente de `.petluxostory.com.br`; "Leave empty for root domain" (**vazio liga a RAIZ, que é a virada: cuidado**). A caixa de busca só lista zonas, não hostnames.
- A tela "Overview" da zona diz "Your domain is now protected by Cloudflare / proxying": é texto padrão; com os registros em DNS only o tráfego **não** passa pela Cloudflare. A recomendação "Only allow Cloudflare IP addresses at your origin" não se aplica. Os avisos de DNS "Visitors cannot reach..." e de MX são automáticos e podem ser ignorados (o domínio não tem e-mail).
- **Não ativar** Bot Fight Mode, proxy nem DNSSEC por ora.
- **Não alterar o projeto Vercel do site** durante a janela de rollback (seção 7).
- **Modelo "Redirect from HTTP to HTTPS"** (Rules → Redirect Rules): Wildcard pattern, Request URL `http://*`, Target URL `https://${1}`, 301, Preserve query string, Place at: Last. É o que faz HTTP → HTTPS nesta zona (a Cloudflare não redireciona por padrão; F3b.5).
- **Fluxo para uma raiz com CNAME próprio:** primeiro apagar o CNAME em DNS → Records, depois Worker → Add domain com o subdomínio vazio. Com o CNAME existente a Cloudflare recusa ("already has externally managed DNS records"). A raiz fica sem resposta ~2 minutos entre os dois passos.
- **Aviso "Leave empty for root domain"** no campo de subdomínio do Add domain: deixar vazio liga a RAIZ. Com o campo preenchido liga só aquele subdomínio.
- **Os dois ALIAS sumiram do painel de DNS da Vercel** depois da troca de nameservers (só os 3 CAA aparecem; motivo NÃO VERIFICADO). Por isso o rollback usa os alvos registrados neste documento, conferidos por `dig`.

### F4 – Pós-virada (EM ANDAMENTO; janela de 2026-10-28 → 2026-11-04 a 2026-11-11)

- [ ] **F4.1 Prévias:** colar `https://www.petluxostory.com.br/` e `https://petluxostory.com.br/` no WhatsApp e no depurador do Facebook (limpar cache de prévia); conferir imagem `og-image.jpg`. Resp.: Dono.
- [ ] **F4.2 Monitorar por 7 a 14 dias:** build verde a cada push (dashboard → Workers → Builds); GA4 Tempo Real e relatório diário; Search Console (cobertura e sitemap com `www`: reenviar `https://www.petluxostory.com.br/sitemap.xml`); um commit de teste pelo painel e conferir que o build dispara. Resp.: Dono.
- [ ] **F4.3 Manter o projeto Vercel e o domínio configurado** durante a janela, sem deploys novos desnecessários (o push em `main` continuará acionando a Vercel enquanto o app do GitHub estiver conectado; aceitável). Rollback depende disso (seção 7).
- [ ] **F4.4 Fim da janela:** desconectar o repositório do projeto Vercel do site, remover o domínio e excluir o projeto; **não** tocar no projeto do painel. Remover `.vercel` do `.gitignore` e a pasta local `.vercel/` só aqui. Resp.: Dono + Claude Code. Risco: baixo depois de 14 dias estáveis.
- [ ] **F4.5 Limpeza de código (D7):** remover `public/404.html` e `main.jsx:9-13`; reexecutar a tabela de F2.2. Resp.: Claude Code. Rollback: reverter.
- [ ] **F4.6 Plano Vercel (TODO 4):** a migração resolve a pendência de uso comercial no Hobby; verificar se a Cloudflare tem restrição equivalente para uso comercial no plano gratuito além da cláusula 2.2.1(h) (seção 6): NÃO VERIFICADO.
- [ ] **F4.7 Cache longo (opcional):** depois de a virada estar estável, avaliar adicionar `Cache-Control` immutable para `/assets/*` (nomes com hash do Vite) e cache moderado para `/images/*`; só depois de conferir como o fallback de SPA trata `/assets/*` inexistentes. Não fazer antes.
- [ ] **F4.8 (pendente) Desligar o endereço `workers.dev` e as Preview URLs** depois de a virada estar estável: acrescentar `"workers_dev": false` e `"preview_urls": false` ao `wrangler.jsonc` (conforme os avisos do deploy) e fazer novo deploy. Doc oficial: https://developers.cloudflare.com/workers/configuration/routing/workers-dev/ (`"workers_dev": false` desliga a rota `workers.dev` no próximo deploy; diz que isso **não** desliga Version/Preview/Deployment URLs; se a rota for desligada só no dashboard, o `wrangler deploy` a religa) e https://developers.cloudflare.com/workers/configuration/previews/ (`"preview_urls": false` desliga as Version URLs; o padrão acompanha o `workers.dev`; é preciso defini-lo explicitamente). **Efeito sobre o acesso pelo domínio próprio: NÃO VERIFICADO** (nenhuma das páginas diz). Só fazer depois de F3b e dos testes na produção, porque o `workers.dev` é usado nos testes até lá. Resp.: Claude Code. Rollback: reverter o commit e fazer novo deploy.

- [ ] **F4.9 Monitorar 7 a 14 dias** (Worker/Deployments, Analytics, Search Console, um commit real do painel). Inclui conferir que o commit do painel dispara o deploy na Cloudflare e que uma foto trocada com o mesmo nome mostra a nova (seção 8, itens 25 e 28). Janela: 2026-10-28 → 2026-11-04 a 2026-11-11. Resp.: Dono.

### F5 – Documentação (o que mudar, onde, texto sugerido)

Fazer após a virada confirmada, em um commit só.

- [ ] **README.md:9** badge `Deploy-Vercel` → badge Cloudflare, ex.: `[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)`.
- [ ] **README.md:33** "Deploy automático via GitHub + Vercel" → "Deploy automático via GitHub + Cloudflare Workers (static assets)".
- [ ] **README.md:68** linha da tabela `| **Vercel** | Hobby | ... |` → `| **Cloudflare Workers** | Free | Hospedagem estática e deploy automático via Git (Workers Builds) |`.
- [ ] **README.md:169-173** passo 2 "Vercel detecta o push e executa `npm run build`" → "A Cloudflare (Workers Builds) detecta o push e executa `npm run build`"; remover a nota da linha 173 sobre repositório público/Vercel Hobby e substituir por: "O repositório continua público porque as miniaturas do painel usam `raw.githubusercontent.com`."
- [ ] **docs/DEPLOY.md (arquivo inteiro)**: reescrever. Estrutura sugerida: (1) fluxo (`git push` → Workers Builds → `dist/` publicado); (2) configuração (`wrangler.jsonc`, `.nvmrc`, `public/_headers`); (3) domínio: DNS na Cloudflare, `www` canônico, regra 301 da raiz, registrador continua no Registro.br só apontando os nameservers; (4) checklist pós-deploy (manter a lista atual, incluindo `/robots.txt` e `/sitemap.xml`); (5) "Se o deploy parar": ver build no dashboard, rodar `npm run build` local, reconectar o app do GitHub. **Corrigir:** a seção "Arquivos atualizados com o domínio real" diz que `robots.txt` tem `Host:` e que o sitemap tem "todas as URLs" — ambos falsos (robots tem 4 linhas sem `Host:`; sitemap só tem a home). Remover o aviso "repositório deve permanecer público (Vercel Hobby)".
- [ ] **docs/DECISIONS.md:113** "Com o site em produção na Vercel, ..." → "Com o site em produção na Cloudflare, ...".
- [ ] **docs/DECISIONS.md §8 (159-170)**: marcar como **superada** pela nova seção 13. Título sugerido: "## 8. Repositório público obrigatório (Vercel Hobby Plan) — *superada pela seção 13*". Não apagar o histórico.
- [ ] **docs/DECISIONS.md, nova seção 13** (após a §12): "## 13. Hospedagem migrada da Vercel para Cloudflare Workers". Texto sugerido: situação (Hobby da Vercel é de uso não comercial e o site vira loja); decisão (Worker com static assets, `not_found_handling = single-page-application`, DNS na Cloudflare, `www` canônico com raiz em 301, painel permanece na Vercel); consequências (links diretos de produto passam a dar 200; URLs inexistentes também; repositório continua público por causa das miniaturas do painel; pagamento com cartão só por checkout hospedado, cláusula 2.2.1(h)); data da virada.
- [ ] **docs/TODO.md:13 (item 4)**: marcar `[x]` com nota "resolvido pela migração para a Cloudflare em <data>; confirmar condições de uso comercial da Cloudflare (item NÃO VERIFICADO)".
- [ ] **docs/TODO.md:56 (item 1)**: trocar "um rewrite para `/index.html` no `vercel.json`" por "o fallback de SPA do Worker (`not_found_handling`)"; registrar o resultado real dos testes de F2.2 (links diretos = 200; soft 404 aceito ou não).
- [ ] **docs/TODO.md:66 (item 2)**: "uma função na Vercel" → "um Worker com script ou pré-renderização". Lembrar que o canonical depende deste item (D4).
- [ ] **docs/TODO.md:112 (item 23)**: tirar "deploy da Vercel" dos pré-requisitos e acrescentar "e se o Workers Builds consegue clonar repositório privado (NÃO VERIFICADO; relatos de falha no clone em 2026-10-27)". Itens 25 e 26 permanecem; o 26 passa a citar a Cloudflare no lugar de Vercel (abaixo). **Novo item sugerido:** "Instagram do rodapé: `Footer.jsx:51` aponta para `instagram.com/pettluxo_/` e o `AI_CONTEXT_PETLUXO.md:8` cita `@petluxostory`; o dono confirma qual é o correto".
- [ ] **docs/CHECKOUT_ARCHITECTURE.md**: o plano inteiro assume Vercel (linhas 9, 22, 23, 26, 167-173 e 185 `vercel.json`, 339-341, 366, 392, 417, 421, 447, 454). Não editar linha a linha: o TODO 26 já manda reescrever o documento para InfinitePay + frete grátis. Na reescrita, trocar: hospedagem de funções (`/api/` da Vercel) → Worker com script na Cloudflare; banco (Neon via Marketplace Vercel) e e-mail (Resend via Marketplace) → decidir de novo, sem integração de Marketplace da Vercel; cron → Cron Triggers; o `vercel.json` de rewrite deixa de existir (o roteamento passa a ser `run_worker_first` para `/api/*` no `wrangler.jsonc`). Texto de aviso sugerido no topo, já: "**Atenção:** a hospedagem migrou para a Cloudflare; as referências à Vercel abaixo estão desatualizadas até a reescrita (TODO 26)."
- [x] **AI_CONTEXT_PETLUXO.md**: reescrito em 2026-10-28 só com o estado atual (hospedagem na Cloudflare, modo SPA, DNS); histórico e rollback ficam neste documento.
- [ ] **src/main.jsx:8** comentário: ver F1.8.

## 5. Impactos no painel `petluxo-admin` (só listar; não tocar)

- **Textos "Vercel"** no painel: `src/hooks/usePublish.js:11` ("Aguardando Vercel (~1 min)"), `:81` e `:219` ("Vercel deploy disparado") e `src/pages/ProductsPage.jsx:233` ("vercel · deploy ok"). Passam a ser inverídicos (a espera de 3 s é simulada, não consulta deploy nenhum).
- **Commits do painel** continuam indo para `main` do repositório `petluxo` e passarão a disparar o build na Cloudflare. Uma ação com foto gera 2 commits (imagem + `products.js`), logo 2 builds; no plano grátis são 3.000 minutos/mês e 1 build simultâneo (builds seguidos entram em fila).
- **Miniaturas** usam `raw.githubusercontent.com` (`ProductsPage.jsx:351`, `CategoriesPage.jsx:399`, `Step3Photo.jsx:21`): exigem repositório público (D3).
- **`GITHUB_TOKEN` do painel** continua o mesmo; nada muda no painel nem na Vercel dele.
- **Botão "Ver site"** abre `https://petluxostory.com.br` (`Step5Publish.jsx:8`): funciona via o 301 raiz → `www`.
- **Pendência já conhecida e independente:** o painel grava imagens planas em `public/images/products/<slug>.webp`, mas o site usa `/images/products/<slug>/principal.webp`; tratar à parte.

## 6. Requisitos para a venda direta (depois da migração)

- **Cartão:** a cláusula 2.2.1(h) do Self-Serve Subscription Agreement proíbe "process or collect personal or business credit card information on any web property" (e vale para propriedades que usam serviços gratuitos, via Seção 2.6). Fonte: https://www.cloudflare.com/terms/ (sem âncora). Portanto: **só pagamento hospedado (redirecionamento) ou campos tokenizados do provedor**, e **só depois de confirmação por escrito com a Cloudflare**. Nada de formulário próprio de cartão.
- **Webhook idempotente:** o evento de pagamento pode chegar mais de uma vez e fora de ordem; gravar o id do evento/pedido e ignorar repetidos; confirmar o pagamento consultando a API do provedor (retorno ao site e webhook sozinhos não são prova — alinhado ao TODO 26).
- **Preço sempre recalculado no servidor:** o carrinho envia só `{ productId, size, qty }`; o Worker lê o catálogo e calcula total (frete grátis, sem cálculo de frete). Nunca confiar em preço vindo do navegador.
- **Roteamento:** `run_worker_first: ["/api/*"]` no `wrangler.jsonc` quando o primeiro script entrar; lembrar que `_headers` não vale para respostas do Worker (headers dessas rotas vão no código).
- **Limites do plano grátis** (requisições por dia, CPU por invocação, subrequests): conferir na documentação vigente antes do desenho; não calculados aqui.

## 7. Rollback (voltar para a Vercel) — estado ATUAL (2026-10-28)

A produção está no Worker `petluxo`. Enquanto o projeto Vercel do site existir e estiver ligado ao domínio, o rollback é só DNS. Os alvos da Vercel **não aparecem mais no painel dela** (seção 8, item 29): usar os alvos registrados neste documento e conferi-los com `dig` (último: 2026-10-28).

| Fase | Como voltar | Observação |
|---|---|---|
| F3b (o rollback que importa) | 1) **Remover os Custom Domains `www` e raiz** do Worker (o curinga `*` devolve o `www` à Vercel em 1 a 2 minutos); 2) **apagar as duas regras** de redirecionamento ("raiz para www" e "http para https"); 3) **recriar o CNAME da raiz** (`@`) → `81d99fac47f9cbab.vercel-dns-017.com`, DNS only (o `*` → `cname.vercel-dns-017.com` já existe). Conferir com `dig` e `curl -sI`. | Não alterar o projeto Vercel do site durante a janela. Os certificados da Vercel expiram em 2026-12-10 e o wildcard depende dos nameservers da Vercel para renovar: depois dessa data a Vercel precisa reemitir. |
| F3a | **Rollback comum:** mexer nos registros da zona na Cloudflare (sem o Registro.br). **Extremo:** no Registro.br, devolver os nameservers para `ns1.vercel-dns.com` e `ns2.vercel-dns.com` (exige o titular do domínio). | Só funciona se o domínio ainda estiver configurado no projeto Vercel. Mesma observação dos certificados (2026-12-10). |
| F2 | **Não excluir o Worker isoladamente:** ele é a produção. Só depois do rollback F3b completo. | Antes da virada bastava excluir o Worker. |
| F1 | Reverter o commit (ou apagar `wrangler.jsonc`, `public/_headers`, `.nvmrc`); a Vercel ignora esses arquivos. | Só depois do rollback F3b: sem esses arquivos o deploy do Worker deixa de funcionar. |
| F4 | Até excluir o projeto Vercel, o rollback F3b vale. Depois de excluído, é preciso recriar o projeto e o domínio na Vercel (≈ o setup descrito no `docs/DEPLOY.md` atual). | Por isso a janela de 7 a 14 dias. |
| DNSSEC | Se for ativado na Cloudflare (D8), voltar os NS exige antes remover o DS no Registro.br e esperar o TTL. | Motivo para não ativar agora. |

## 8. NÃO VERIFICADO

1. ~~Se o `_headers` se aplica ao `index.html` devolvido pelo fallback de SPA~~ **RESOLVIDO em 2026-10-27 (F2.2):** aplica-se; os 3 cabeçalhos de segurança vieram em `/produto/2` e nas demais respostas de fallback.
2. **Se o Workers Builds aceita repositório GitHub privado.** As páginas consultadas (`/workers/ci-cd/builds/` e a de integração com GitHub) não afirmam nem negam; uma busca retornou resumos que dizem que sim, mas com relatos de usuários de falha no clone de repositórios privados em 2026-10-27 (posts de comunidade, não aviso oficial). Tratar como não confirmado (por isso D3 = não privatizar).
3. **Limite de arquivos e tamanho por arquivo em Workers assets:** confirmado na página de limites (https://developers.cloudflare.com/workers/platform/limits/): **20.000 arquivos por versão no Free** (100.000 no Paid; requer Wrangler ≥ 4.34.0 para os limites maiores) e **25 MiB por arquivo**. O site tem 99 arquivos e o maior é `og-image.png` (1.837.059 B): folga ampla. *Não verificado:* se as requisições de assets contam na cota diária do plano grátis; a página de billing diz só que são "free and unlimited".
4. ~~Prazo de propagação da troca de NS no Registro.br~~ **RESOLVIDO em 2026-10-27:** os nameservers da Cloudflare apareceram no servidor do `.br` em menos de 5 minutos. **TTL do NS:** não medido.
5. ~~Prazo de emissão do certificado e comportamento do Custom Domain com curinga e com CNAME próprio~~ **RESOLVIDO em 2026-10-27 (F3a.6):** domínio/certificado ativos em 1 a 2 minutos, sem falhas de emissão; hostname coberto só pelo curinga é aceito direto; com CNAME próprio é recusado até o CNAME ser apagado.
6. ~~"Always Use HTTPS" / HTTP→HTTPS~~ **RESOLVIDO em 2026-10-28 (F3b.5):** a Cloudflare não redirecionou HTTP→HTTPS por padrão; resolvido com a regra "http para https" (301). A opção "Always Use HTTPS" não foi consultada nem alterada.
7. ~~CNAME na raiz (flattening) no plano Free~~ **RESOLVIDO em 2026-10-27:** a Cloudflare aceitou o CNAME na raiz no plano Free e avisou que usa CNAME flattening.
8. ~~Se os 3 CAA atuais bastam~~ **RESOLVIDO em 2026-10-27:** bastaram para os certificados dos dois hostnames de teste; `ssl.com` não foi necessário.
9. ~~Como um CNAME curinga interage com um Custom Domain de hostname exato~~ **RESOLVIDO em 2026-10-27 (F3a.6):** ver F3a.6.
10. ~~DNSSEC no Registro.br~~ **RESOLVIDO em 2026-10-27 (F0.3):** `dig DS`/`dig DNSKEY` vazios e o painel do Registro.br sem seção de DNSSEC: não está ativo.
11. **Domínio do painel `petluxo-admin`:** provavelmente um `*.vercel.app`, NÃO VERIFICADO.
12. **Aba "Shared" das variáveis de ambiente da Vercel:** não conferida (opcional; o projeto não tem variáveis próprias).
13. **Domínio configurado no stream do GA4** e eventuais filtros de hostname (F0.6).
14. **Condições de uso comercial do plano gratuito da Cloudflare** além da cláusula 2.2.1(h) (TODO 4 equivalente).
15. **Nome do Worker vs. `name` do `wrangler.jsonc`** (efeito de divergência no Workers Builds) e **se `npx wrangler deploy` dispensa `wrangler` em `devDependencies`**.
16. **Suporte a `Host:` e a hostnames no Playwright contra `workers.dev`:** não testado; os testes atuais apontam para `localhost:5173`.
17. **Prévia no WhatsApp/Facebook após a virada**, comportamento de `/politica-de-troca-e-devolucao`, `/politica-de-frete-e-entrega` e `/termos-de-uso` em acesso direto na Vercel hoje e `og-image.jpg` por curl: só testáveis nas fases F2/F4.
18. **Instagram correto:** `Footer.jsx:51` aponta para `pettluxo_` e o `AI_CONTEXT_PETLUXO.md` cita `@petluxostory`; decisão do dono, ainda não resolvida.
19. **Push e deploy da F1:** confirmados em 2026-10-27 (o robots.txt de produção já mostra o www).
20. **Diferença 142 × 99 arquivos:** o log do Workers Builds leu 142 arquivos de `dist/` (98 novos subidos, 1 já existente) e o build local tem 99 arquivos únicos; provável diferença de contagem de arquivos × ativos únicos, NÃO VERIFICADO, sem alarme (limite grátis: 20.000).
21. ~~Número do WhatsApp do site de teste × produção~~ **RESOLVIDO em 2026-10-28 (F3b.0):** os dois serviam o mesmo `assets/index-Ch6Q2MER.js` (código idêntico).
22. **Hit do GA4 em Tempo Real a partir do `workers.dev`:** o dono relatou que o consentimento funciona, mas o hit explícito (e possível filtro de hostname, F0.6) não foi conferido.
23. **Efeito de `workers_dev: false` e `preview_urls: false` sobre o acesso pelo domínio próprio:** as páginas oficiais consultadas não dizem (F4.8).
24. **Registro `_domainconnect`:** a importação automática da Cloudflare trouxe um CNAME `_domainconnect` → `_domainconnect.vercel-dns.com` que não aparece na tabela de DNS do painel da Vercel; ficou na zona como DNS only. Para que serve e se pode ser removido: NÃO VERIFICADO.
25. **Fotos trocadas pelo painel** (mesmo nome de arquivo) **e cache após a virada:** se uma foto substituída com o mesmo nome continua aparecendo antiga por causa do cache da Cloudflare/navegador (o padrão é `public, max-age=0, must-revalidate`): NÃO VERIFICADO; conferir em F4.9.
26. **Alerta de segurança da conta no Registro.br** (recomendação de senha mais forte): pendência do titular do domínio, não bloqueia a migração.

27. **Prévia no WhatsApp/Facebook após a virada:** não testada (F4.1).
28. **Um commit real do painel dispara o deploy na Cloudflare:** não testado (F4.9). Junto com o item 25 (foto trocada com o mesmo nome mostra a nova).
29. **Alvos da Vercel não aparecem mais no painel de DNS da Vercel** (só os 3 CAA; os dois ALIAS sumiram depois da troca de nameservers): motivo NÃO VERIFICADO. O rollback usa os alvos registrados aqui (seção 7).
30. **`referrer-policy` na verificação final:** não foi repetido no filtro do teste final (F3b.4); foi visto em F2.2 e F3a.6.
31. **F4.8 (desligar `workers_dev` e `preview_urls`) segue pendente** (ver item 23 para o efeito sobre o domínio próprio).
### Correções ao que já se sabia (conferido nesta data)

- Node padrão do Workers Builds: a doc atual diz **24.22.1**, com **22.23.4** também pré-instalado (não 24.18.0).
- `docs/DEPLOY.md` diz que `robots.txt` tem `Host:` e que o sitemap lista "todas as URLs": falso nos dois.
- Vercel também envia `access-control-allow-origin: *` e `content-disposition: inline` nos estáticos (visto por curl).
- Build: `npm run build` levou ~22 s no total (Vite 6.4.2 em ~7,9 s, após `scripts/validate-catalog.js`), 99 arquivos, 14 MB, maior arquivo `public/og-image.png` com 1.837.059 B (confirmado).
- Fontes da documentação consultada: https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/ · https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/ · https://developers.cloudflare.com/workers/static-assets/headers/ · https://developers.cloudflare.com/workers/static-assets/redirects/ · https://developers.cloudflare.com/workers/configuration/routing/custom-domains/ · https://developers.cloudflare.com/dns/dnssec/ · https://developers.cloudflare.com/workers/ci-cd/builds/build-image/ · https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/ · https://developers.cloudflare.com/workers/platform/limits/ · https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ · https://developers.cloudflare.com/rules/url-forwarding/ · https://www.cloudflare.com/terms/


## 9. Registro de execução (horário de Brasília)

### 2026-10-27

- Conta Cloudflare criada com 2FA (F0.1).
- DNS da Vercel exportado (F0.2) e DNSSEC conferido: não ativo (F0.3).
- F1 commitada e em produção na Vercel (robots.txt com `www`).
- Worker `petluxo` criado por importação do repositório (F2); build ~40 s, Node 22.23.4; testes `curl` e relato do dono (navegador).
- Zona adicionada à Cloudflare (Free, Full setup); importação automática corrigida: 6 A apagados, CNAME raiz e `*` criados, tudo DNS only (F3a.1/F3a.2).
- Conferência pré-troca por `dig @<ns da Cloudflare>` e `curl --resolve`: mesmo site da Vercel.
- Nameservers trocados no Registro.br pelo titular do domínio; no servidor do `.br` em menos de 5 minutos (F3a.4). Site sem alteração visível.
- Ensaio com `teste1` e `teste2` e regra de redirecionamento de teste (F3a.6), depois limpeza completa.
- Estado ao fim do dia: `www` 200 e raiz 307 → `www`, ambos `server: Vercel`; **a produção ainda é servida pela Vercel**; F3b pronta.

### 2026-10-28

- Pré-checagem (F3b.0): site abria (Vercel); último deploy do Worker Ready; mesmo `assets/index-Ch6Q2MER.js` na produção e no Worker (WhatsApp igual: fecha F0.5 e F2.5); alvos da Vercel ainda resolviam; no painel da Vercel só os 3 CAA (ALIAS sumiram).
- ~09:24 a ~09:47, a virada: `www` como Custom Domain (< 2 min); CNAME da raiz apagado e Custom Domain da raiz (~2 min sem resposta); regra "raiz para www" (301); descoberta de que o HTTP não redirecionava para HTTPS e regra "http para https" (301).
- Verificação final: `curl -sIL` HTTP da raiz com query → 301 → 301 → 200 (`server: cloudflare`); rotas, sitemap, robots e og-image ok no `www`; navegador testado pelo dono sem problemas.
- Estado ao fim: a produção é servida pelo Worker `petluxo` na Cloudflare; projeto Vercel do site intacto como plano B; painel admin segue na Vercel; F4 em andamento.
