# Migração do site: Vercel (Hobby) → Cloudflare Workers com static assets

> **Status:** planejamento, com a fase F1 já aplicada no código e commitada (seção "Estado atual"). O restante não foi aplicado. Levantamento feito em 2026-10-27 (curl, dig, `npm run build` e painel da Vercel; documentação oficial da Cloudflare consultada na mesma data). Tudo que não foi confirmado está em "NÃO VERIFICADO" (seção 8).
> Convenção: **[Dono]** = só a pessoa dona do negócio consegue (contas, painéis, Registro.br). **[Claude Code]** = mudança no repositório.

Revisão de 2026-10-27: 3 ajustes combinados (.nvmrc com a versão principal; _headers só com segurança; ensaio F3a.6).

Revisão de 2026-10-27: DNS real incorporado (ALIAS em vez de A; curinga; sem MX/TXT); F0.1, F0.2 e F0.5 concluídas; F1 aplicada e commitada; F3 aguarda acesso ao Registro.br.

## 1. Objetivo e escopo

- **Migra:** a hospedagem do site `petluxo` (build `npm run build` → `dist/`, 99 arquivos, 14 MB) para um Worker da Cloudflare com static assets, servido em `www.petluxostory.com.br`, com a raiz redirecionando para o `www`.
- **Não migra:** o painel `petluxo-admin`, que continua na Vercel (seção 5 lista só os impactos).
- **Fora do escopo desta migração:** venda direta (carrinho, endereço, pagamento), meta tags por produto (TODO 2), privatizar o repositório (TODO 23). A seção 6 só registra requisitos para quando a venda direta vier.
- **Natureza do site:** 100% estático, sem `api/`, sem `vercel.json`, sem `.github/` (verificado). Não há função a portar. A migração é: arquivos estáticos + roteamento de SPA + cabeçalhos + DNS.

## Estado atual (2026-10-27)

| Fase | Estado | O que bloqueia / observação |
|---|---|---|
| F0 | **em andamento** | F0.1, F0.2 e F0.5 prontas. F0.3 (DNSSEC) **bloqueada** pelo acesso ao Registro.br. F0.4 será feita dentro da F2.1. F0.6 (GA4) pendente. |
| F1 | **pronta** | F1.1 a F1.9 aplicadas e commitadas (`abc65e9` código; `6b80883` docs). `git status`: limpo e "up to date" com `origin/main` pela referência local; push e deploy confirmados em 2026-10-27 (robots.txt de produção com www). F1.10 e F1.11 seguem como estão. |
| F2 | **pendente (pode andar já)** | Não depende do Registro.br: Worker de teste em `*.workers.dev`. |
| F3 | **bloqueada** | Depende do acesso ao Registro.br (hoje com outra pessoa da família do dono): troca de nameservers (F3a.4), ensaio F3a.6 e virada F3b. |
| F4 | **pendente** | Depende de F3. |
| F5 | **pendente (parcial pode andar)** | Texto final de DEPLOY/README só depois da virada. |

## 2. Decisões pendentes

| # | Decisão | Recomendação | Impacto |
|---|---|---|---|
| D1 | Domínio canônico | **Manter o `www`** (é o que responde hoje: `www` dá 200 e a raiz dá 307 → `www`, conferido por curl em 2026-10-27). Raiz → `www` com 301. Metadados alinhados ao `www`. | Muda `index.html:13,14,29`, `public/sitemap.xml:4`, `public/robots.txt:4` e a doc. Prévias já compartilhadas apontam para a raiz e seguem funcionando pelo redirecionamento. |
| D2 | Modo 404 do Worker | **`single-page-application`**: `/produto/2` e `/politica-de-privacidade` em acesso direto passam a dar 200 e abrir o app. | Hoje dão 404 (corpo do `404.html`). Contrapartida: URLs inexistentes (inclusive `/xyz.png` e `/assets/qualquer.js`) também devolvem o `index.html` com 200 (soft 404). O app já tem rota `*` com `NotFound` (`src/app/page.jsx:83`), mas o status HTTP continua 200 (TODO 1). |
| D3 | Privatizar o repositório | **Não agora.** | Miniaturas do painel dependem de `raw.githubusercontent.com` público; a documentação consultada não afirma suporte a repositório privado no Workers Builds (seção 8, item 2). |
| D4 | `canonical` | **Não colocar `<link rel="canonical">` estático no `index.html`.** | Como `/produto/:id` herda o `index.html` da home (TODO 2), um canonical fixo na home diria ao Google que todas as fichas são cópias da home. Fazer só junto com meta tags por rota. |
| D5 | Fixar `wrangler` em `devDependencies` | Recomendado (fixa a versão usada no deploy e permite `wrangler dev` local). | A doc do Workers Builds diz que usa o Wrangler do `package.json`; sem ele usa o padrão do build. Não instalar nesta tarefa. |
| D6 | Deploy por Workers Builds (Git) ou GitHub Actions | **Workers Builds** (mais simples; o painel continua só dando commit). | Limite grátis: 3.000 min/mês, 1 build simultâneo, timeout 20 min (https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/). Build local levou ~22 s. |
| D7 | Aposentar `public/404.html` e a restauração em `main.jsx:8-13` | **Depois** de validar D2 em produção (o TODO 1 manda não remover antes de validar). | Com SPA mode ficam inertes. |
| D8 | DNSSEC | **Não ativar** na Cloudflare por ora. | Hoje não há DS/DNSKEY visível (seção 3). Ativar depois complica o rollback (seção 7). |

## 3. Caminho crítico (ordem mínima até a virada)

1. **[Dono] F0 (parte já feita)** – conta Cloudflare com 2FA (**feito**), exportação do DNS da Vercel (**feito**), `VITE_WHATSAPP_PHONE` (**feito**: não há variável no projeto Vercel).
2. **[Claude Code] F1** – **feito e commitado** (`wrangler.jsonc`, `_headers` e `.nvmrc` são ignorados pela Vercel; metadados com `www` já estão corretos na Vercel).
3. **Pode andar agora, sem o Registro.br:**
   - **[Dono] F2** – criar o Worker `petluxo` a partir do repositório (Workers Builds; o app do GitHub da F0.4 é instalado aqui), obter a URL `*.workers.dev` e rodar os testes de aceitação com Claude Code.
   - **[Dono] F0.6** – conferir o domínio do stream do GA4 e filtros de hostname.
   - **[Claude Code] F5 parcial** – o que não depende da virada.
4. **Dependência externa: acesso ao Registro.br.** Hoje quem tem o acesso é outra pessoa da família do dono. Tudo abaixo espera por isso.
5. **[Dono] F0.3** – conferir DNSSEC no painel do Registro.br.
6. **[Dono] F3a** – adicionar a zona na Cloudflare **com os registros equivalentes aos da Vercel, todos DNS only (nuvem cinza)**; trocar os nameservers no Registro.br. Os passos F3a.1 e F3a.2 não exigem o Registro.br, mas só passam a valer depois da troca de NS (F3a.4). **Espera:** propagação (NÃO VERIFICADO quanto tempo; acompanhar por `dig NS`). O site continua na Vercel durante toda essa etapa.
   - **Espera de DNSSEC:** só se o Registro.br mostrar DNSSEC ativo. Nesse caso remover o DS e aguardar o TTL (a doc diz "comumente 24–48 horas") **antes** de trocar os nameservers. Hoje `dig DS` e `dig DNSKEY` voltam vazios, então provavelmente não se aplica (confirmar no painel do Registro.br).
7. **[Dono] F3a.6** – ensaio com `teste1` e `teste2` (curinga e CNAME próprio): exige a zona **ativa**, portanto **não pode ser feito antes de F3a.4**.
8. **[Dono] F3b** – com a zona ativa e o ensaio concluído: criar os Custom Domains `www` e raiz no Worker e a regra de redirecionamento raiz → `www`. Horário recomendado: madrugada de dia útil, fora de campanha.
9. **[Dono + Claude Code] F4** – monitorar, manter a Vercel viva 7 a 14 dias, depois remover.
10. **[Claude Code] F5** – documentação final (texto de DEPLOY/README só depois da virada).

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
  - Os IPs vistos por `dig` em 2026-10-27 (`64.29.17.1`, `216.198.79.1`, `64.29.17.65`) são o **resultado de resolver os ALIAS**, não registros existentes. SOA: `ns1.vercel-dns.com` / `hostmaster.nsone.net`.
  - No projeto Vercel do site estão ligados a raiz (que redireciona para o `www`) e o `www`. Nenhum outro projeto aparece ligado a este domínio; o painel `petluxo-admin` provavelmente está num `*.vercel.app` (NÃO VERIFICADO).
  - Certificados da Vercel: wildcard + raiz e `www`, renovação automática, expiram em 2026-12-10 (relevante só se o rollback para a Vercel for necessário depois dessa data).
- [ ] **F0.3 Verificar DNSSEC no Registro.br** (painel do domínio → DNSSEC). **BLOQUEADO (2026-10-27):** depende do acesso ao Registro.br, que hoje está com outra pessoa da família do dono (dependência externa). Resp.: Dono. Verificar: `dig DS petluxostory.com.br +short` vazio (já está vazio hoje) e painel sem DS. Risco: se ativo e ignorado, validadores dão SERVFAIL após a troca de NS. Rollback: n/a.
- [ ] **F0.4 Instalar o app do GitHub "Cloudflare Workers and Pages"** apenas no repositório `petluxo`. **Será feito dentro da F2.1** (ao importar o repositório). Resp.: Dono. Dep.: F0.1. Verificar: repositório aparece na lista ao criar o Worker. Risco: baixo. Rollback: desinstalar o app no GitHub.
- [x] **F0.5 `VITE_WHATSAPP_PHONE`.** Resolvido em 2026-10-27: o projeto Vercel do site **não tem nenhuma variável de ambiente** (lista vazia no painel); a produção usa o número padrão do código (`src/lib/whatsapp.js:3-4`). Nada a cadastrar na Cloudflare. A aba "Shared" das variáveis não foi conferida (opcional, seção 8). Resp.: Dono. Risco: baixo; para cobrir o resto, **depois da F2.5 conferir que o número que abre nos botões do site de teste é igual ao da produção**. Rollback: n/a.
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
  Sem regras de cache de propósito: a Vercel hoje serve tudo sem cache longo, então não há perda. Isso elimina o risco de o fallback de SPA devolver `index.html` com `immutable` por 1 ano para um chunk antigo de `/assets/*`. Justificativas: (a) HSTS com o mesmo valor que a Vercel serve hoje (`max-age=63072000`), **sem** `includeSubDomains`/`preload` (não é decisão desta migração); (b) sem CSP: GA4 e Google Fonts exigiriam uma política cuidadosa, tratar à parte. O padrão da Cloudflare para assets é `public, max-age=0, must-revalidate`, igual ao que a Vercel serve hoje (doc: https://developers.cloudflare.com/workers/static-assets/headers/). Limites: 100 regras, 2.000 caracteres por linha. `_headers` **não** vale para respostas geradas por Worker (não há Worker aqui). Resp.: Claude Code. Dep.: F1.2. Verificar: `curl -I` em cada tipo de URL (F2). Risco: **baixo** — a única dúvida é se `_headers` se aplica ao `index.html` servido pelo fallback de SPA; o teste F2.2 resolve conferindo os 3 cabeçalhos de segurança numa rota de SPA (ex.: `/produto/2`). Rollback: apagar o arquivo.
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
- [ ] **F1.10 (D5, opcional) `package.json`:** acrescentar `wrangler` em `devDependencies` e, se quiser, `"engines": { "node": ">=22" }`. O `build` atual (`node scripts/validate-catalog.js && vite build`) funciona sem mudança. Resp.: Claude Code (exige `npm install`, que esta tarefa não faz). Risco: baixo.
- [ ] **F1.11 Confirmar que nada mais no repositório depende da Vercel:** `grep -rni vercel src tests scripts index.html` não achou nada (verificado em 2026-10-27); as ocorrências estão só em docs (F5) e em `.gitignore:9`.

### F2 – Deploy de teste em `*.workers.dev` e aceitação

- [ ] **F2.1 Criar o Worker** (dashboard → Workers & Pages → Create → Import a repository → `petluxo`). Build command: `npm run build`. Deploy command: padrão `npx wrangler deploy`. Production branch: `main`. Resp.: Dono. Dep.: F0.1 e F1.1–F1.3 (o app do GitHub da F0.4 é instalado nesta etapa). Verificar: build verde; URL `https://petluxo.<subdomínio-da-conta>.workers.dev` abre. Risco: baixo; a Vercel continua produção. Rollback: excluir o Worker.
- [ ] **F2.2 Testes de aceitação por URL** (usar `curl -sI` e navegador). Resp.: Claude Code (curl) + Dono (navegador/celular):

  | URL | Esperado (SPA mode) | Hoje na Vercel (conferido) |
  |---|---|---|
  | `/` | 200, home | 200 |
  | `/produto/2` (acesso direto, aba nova) | 200, abre a ficha do produto 2 | 404 + redireciona por JS |
  | `/produto/9999` | 200 e a tela `NotFound` do app (`page.jsx:83`) | 404 + redireciona |
  | `/politica-de-privacidade` (direto) | 200, abre a política | 404 + redireciona |
  | `/politica-de-troca-e-devolucao`, `/politica-de-frete-e-entrega`, `/termos-de-uso` | 200, abrem a página | NÃO VERIFICADO (mesma lógica) |
  | URL inexistente `/qualquer-coisa` | 200 e `NotFound` do app (soft 404, ver D2) | 404 |
  | `/xyz.png` | **200 com o `index.html`** (soft 404, aceitar ou mudar D2) | 404 (corpo do `404.html`) |
  | `/assets/inexistente.js` | 200 com `index.html`; basta confirmar que **NÃO** vem `immutable` | 404 |
  | `/404.html` | 200 | 200 |
  | `/sitemap.xml` | 200, `application/xml`, `<loc>` com `www` | 200 |
  | `/robots.txt` | 200, `text/plain`, `Sitemap:` com `www` | 200 |
  | `/og-image.jpg` | 200, `image/jpeg`, 73.046 B | NÃO VERIFICADO por curl hoje |
  | `/assets/index-*.js` (nome do build) | 200 com o mesmo cache padrão de hoje, `Cache-Control: public, max-age=0, must-revalidate`, sem `immutable` | `public, max-age=0, must-revalidate` |

  Verificar cabeçalhos de cada linha com `curl -sI`: presença de `strict-transport-security`, `x-content-type-options`, `referrer-policy`. Comparar com a Vercel, que também envia `access-control-allow-origin: *` e `content-disposition: inline` nos estáticos (visto em 2026-10-27); o site não depende de CORS (fontes e GA4 são de terceiros), mas confirmar no navegador que nada quebra. **`_headers` no fallback de SPA: NÃO VERIFICADO na doc — este teste decide**, conferindo os 3 cabeçalhos de segurança em `/produto/2`.
- [ ] **F2.3 Prévia de compartilhamento no WhatsApp.** A URL `workers.dev` terá `og:image` apontando para `www.petluxostory.com.br` (produção ainda na Vercel); portanto o teste real de prévia é **depois** da F3b (F4.1). Aqui basta confirmar que `curl -s <workers.dev>/ | grep og:` mostra `www`. Resp.: Claude Code.
- [ ] **F2.4 GA4 com consentimento.** Em `<workers.dev>`, abrir a home, aceitar o banner, ver o hit em GA4 → Tempo Real; recusar e confirmar que `gtag.js` não carrega (o fluxo está coberto por `tests/analytics-consent.spec.js`). Atenção: filtro de hostname no GA4 pode descartar hits de `workers.dev` (F0.6). Resp.: Dono.
- [ ] **F2.5 Links do WhatsApp.** Clicar nos CTAs da home, do card e da ficha; conferir que abrem `wa.me/<número esperado>` com a mensagem (`src/lib/whatsapp.js:6`). Resp.: Dono. Conferir também que o número que abre é o mesmo da produção (F0.5).
- [ ] **F2.6 Playwright.** `tests/analytics-consent.spec.js:3` fixa `BASE_URL = 'http://localhost:5173'` e `playwright.config.js` sobe `npm run dev`. Eles testam o código local, não a URL publicada. Rodar o conjunto localmente como regressão; para rodar contra o `workers.dev` seria preciso parametrizar `BASE_URL` (mudança opcional, fora do necessário). Resp.: Claude Code. Risco: baixo.
- [ ] **F2.7 Navegação real no celular/iPad** (menu hambúrguer, galeria, lightbox sob demanda — o chunk `ProductLightbox-*.js` é carregado só em touch). Resp.: Dono.
- [ ] **F2.8 Critério para seguir:** todas as linhas acima conferidas e a decisão D2 fechada. Rollback: nada mudou em produção.

### F3 – DNS em duas etapas

**F3a – zona na Cloudflare, tudo ainda apontando para a Vercel**

- [ ] **F3a.1 Adicionar `petluxostory.com.br` à Cloudflare** (plano Free). Resp.: Dono. Dep.: F0.2. Risco: baixo. Pode ser preparada sem o Registro.br; a zona só fica ativa depois da F3a.4.
- [ ] **F3a.2 Recriar na zona os registros exportados em F0.2**, todos com **proxy desligado (DNS only, nuvem cinza)**: CNAME na raiz → `81d99fac47f9cbab.vercel-dns-017.com`; CNAME `*` → `cname.vercel-dns-017.com`; os 3 CAA (`pki.goog`, `sectigo.com`, `letsencrypt.org`). Antes de criar, **reler os alvos no painel da Vercel** (a Vercel pode mudá-los sem aviso). A importação automática da Cloudflare pode não trazer tudo: comparar com a exportação. Verificar: `dig @<ns-da-cloudflare> www.petluxostory.com.br +short` devolve o mesmo resultado que a Vercel hoje. Risco: médio (alvo desatualizado). Rollback: F3a.4. Pontos da documentação oficial:
  - (a) **CNAME na raiz (flattening) no plano Free: NÃO VERIFICADO.** A página https://developers.cloudflare.com/dns/cname-flattening/ diz que o recurso "allows you to use a CNAME record at your zone apex" e que "CNAME flattening happens by default in some cases", sem detalhar os casos nem os planos. Resumos de busca dizem que vale para todos os planos, mas não vi isso na página oficial.
  - (b) **CAA × certificados da Cloudflare: NÃO VERIFICADO se os 3 CAA bastam.** https://developers.cloudflare.com/ssl/edge-certificates/caa-records/ diz que os CAA "must permit the certificate authority (CA) that Cloudflare uses" e lista como exemplo `pki.goog`, `letsencrypt.org`, `ssl.com` e `sectigo.com`, avisando que a lista "is not exhaustive". Os CAA da Vercel não incluem `ssl.com`. Referência de valores por CA: https://developers.cloudflare.com/ssl/reference/certificate-authorities/#caa-records. Se o ensaio F3a.6 falhar na emissão, acrescentar as autoridades que faltarem. Ao recriar os CAA na zona, é inofensivo acrescentar também `0 issue "ssl.com"` (a doc de CAA da Cloudflare o cita como autoridade possível e diz que a lista não é exaustiva); se a emissão falhar no ensaio F3a.6, esse é o primeiro candidato. Decidir na hora da F3a.2; não alterar os CAA na Vercel.
  - (c) **CNAME curinga × Custom Domain de hostname exato: NÃO VERIFICADO.** https://developers.cloudflare.com/workers/configuration/routing/custom-domains/ diz que "Custom Domains do not support wildcard DNS records" e que não se cria Custom Domain "on a hostname with an existing CNAME DNS record"; não diz como um curinga convive com um Custom Domain exato. Consequência provável: o CNAME da raiz terá de ser removido antes do Custom Domain da raiz (F3b.1); o ensaio F3a.6 testa os dois casos.
- [ ] **F3a.3 DNSSEC:** se F0.3 mostrou DS ativo, remover o DS no Registro.br e esperar o TTL expirar (`dig DS petluxostory.com.br`; a doc diz "comumente 24–48 horas") **antes** de F3a.4; https://developers.cloudflare.com/dns/dnssec/. Se vazio (situação atual), pular. **Bloqueado pelo acesso ao Registro.br.**
- [ ] **F3a.4 Trocar os nameservers no Registro.br** pelos dois que a Cloudflare indicar. Horário: madrugada de dia útil. Resp.: Dono. **BLOQUEADO: depende do acesso ao Registro.br (dependência externa).** Verificar: `dig NS petluxostory.com.br +short` mostra os da Cloudflare; o painel Cloudflare marca a zona como Ativa; `curl -I https://www.petluxostory.com.br/` continua `server: Vercel` e 200. Risco: médio (janela de propagação). **Rollback:** voltar os NS no Registro.br para `ns1.vercel-dns.com` e `ns2.vercel-dns.com`.
- [ ] **F3a.5 Esperar o site estável** (algumas horas, ideal 1 dia) antes da F3b. Verificar `curl -sI` na raiz (307 → `www`) e no `www` (200).
- [ ] **F3a.6 Ensaio com subdomínios descartáveis.** Resp.: Dono (o `curl` pode ser rodado pelo Claude Code). Dep.: F2.1 (Worker existente), zona **Ativa** (F3a.4) e o curinga `*` já criado (F3a.2). **Não pode ser feito antes do Registro.br** (precisa da zona ativa na Cloudflare). Passos:
  - (a) Testar os dois casos reais, anexando o hostname como Custom Domain do Worker e anotando, para cada um, se foi aceito e a **mensagem exata de erro**: (i) `teste1.petluxostory.com.br`, coberto **só pelo curinga**, sem registro próprio (equivalente ao `www` de hoje); (ii) `teste2.petluxostory.com.br`, com um **CNAME próprio** criado só para o teste, por exemplo para o mesmo alvo do curinga (equivalente à raiz de hoje). Responde ao NÃO VERIFICADO (c) da F3a.2.
  - (b) Medir quanto tempo leva até o certificado/domínio ficar ativo em cada hostname; anotar qualquer falha de emissão (responde ao NÃO VERIFICADO (b) da F3a.2).
  - (c) Rodar em `https://teste1.petluxostory.com.br` e em `https://teste2.petluxostory.com.br` o subconjunto da tabela F2.2 (`/`, `/produto/2`, `/produto/9999`, `/xyz.png`, `/404.html`, `/sitemap.xml`, `/robots.txt`) com `curl -sI`, conferindo os 3 cabeçalhos de segurança.
  - (d) Criar uma Redirect Rule de teste de `https://teste2.petluxostory.com.br/*` e de `https://teste1.petluxostory.com.br/*` para `https://www.petluxostory.com.br/${1}`, 301, preservando query; conferir com `curl -sI` em `/produto/2?x=1` nos dois hostnames.
  - (e) Limpeza: apagar os dois Custom Domains de teste, as regras e o CNAME `teste2`.

  Risco: nenhum para produção (hostnames separados). Rollback: apagar os recursos de teste.

**F3b – hostname para o Worker + redirecionamento raiz/www**

- [ ] **F3b.1 Criar os Custom Domains do `www` e da raiz.** A doc diz que Custom Domain não pode ser criado sobre hostname com CNAME existente, então o CNAME da raiz tem de sair antes; o `www` hoje é coberto só pelo curinga (efeito do curinga sobre o Custom Domain: NÃO VERIFICADO). **A ordem exata (remover o registro antes ou criar o Custom Domain por cima) e o tempo esperado seguem o resultado dos dois casos do ensaio F3a.6.** Fazer **imediatamente** em Worker → Settings → Domains & Routes → Add → Custom Domain: `www.petluxostory.com.br` e `petluxostory.com.br`. A Cloudflare cria o registro e o certificado (https://developers.cloudflare.com/workers/configuration/routing/custom-domains/). Manter o CNAME `*` e os 3 CAA. Verificar: `curl -I https://www.petluxostory.com.br/` agora com os cabeçalhos da Cloudflare (`server: cloudflare`) e 200. Prazo de emissão do certificado: NÃO VERIFICADO (o ensaio mede). Risco: **médio/alto** (alguns segundos a minutos de falha). **Rollback:** excluir os Custom Domains e recriar os CNAME/ALIAS conforme a exportação de F0.2 (reler os alvos no painel da Vercel no momento do rollback, pois a Vercel pode mudá-los).
- [ ] **F3b.2 Redirecionar raiz → `www` com 301**: Rules → Redirect Rules → Create rule → "Wildcard pattern": pedido `https://petluxostory.com.br/*` → destino `https://www.petluxostory.com.br/${1}`, status **301**, manter query string (https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-root-to-www/). Plano Free permite 10 regras de Single Redirect (https://developers.cloudflare.com/rules/url-forwarding/#availability). A doc exige tráfego **proxied** no hostname da regra (https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/); o Custom Domain da raiz cria registro proxied. Verificar: `curl -sI https://petluxostory.com.br/produto/2?x=1` → 301 com `location: https://www.petluxostory.com.br/produto/2?x=1`. Observação: `_redirects` **não** serve (a doc diz que redirecionamento por domínio não é suportado: https://developers.cloudflare.com/workers/static-assets/redirects/). Risco: médio (laço de redirecionamento se mal configurada). Rollback: desativar a regra.
- [ ] **F3b.3 Conferir HTTP→HTTPS:** `curl -sI http://www.petluxostory.com.br/` deve redirecionar para HTTPS (se não, ativar "Always Use HTTPS" em SSL/TLS → Edge Certificates; nome/local da opção: NÃO VERIFICADO na doc consultada). Risco: baixo.
- [ ] **F3b.4 Reexecutar a tabela de F2.2 contra `https://www.petluxostory.com.br`.** Rollback do conjunto: ver seção 7.

### F4 – Pós-virada

- [ ] **F4.1 Prévias:** colar `https://www.petluxostory.com.br/` e `https://petluxostory.com.br/` no WhatsApp e no depurador do Facebook (limpar cache de prévia); conferir imagem `og-image.jpg`. Resp.: Dono.
- [ ] **F4.2 Monitorar por 7 a 14 dias:** build verde a cada push (dashboard → Workers → Builds); GA4 Tempo Real e relatório diário; Search Console (cobertura e sitemap com `www`: reenviar `https://www.petluxostory.com.br/sitemap.xml`); um commit de teste pelo painel e conferir que o build dispara. Resp.: Dono.
- [ ] **F4.3 Manter o projeto Vercel e o domínio configurado** durante a janela, sem deploys novos desnecessários (o push em `main` continuará acionando a Vercel enquanto o app do GitHub estiver conectado; aceitável). Rollback depende disso (seção 7).
- [ ] **F4.4 Fim da janela:** desconectar o repositório do projeto Vercel do site, remover o domínio e excluir o projeto; **não** tocar no projeto do painel. Remover `.vercel` do `.gitignore` e a pasta local `.vercel/` só aqui. Resp.: Dono + Claude Code. Risco: baixo depois de 14 dias estáveis.
- [ ] **F4.5 Limpeza de código (D7):** remover `public/404.html` e `main.jsx:9-13`; reexecutar a tabela de F2.2. Resp.: Claude Code. Rollback: reverter.
- [ ] **F4.6 Plano Vercel (TODO 4):** a migração resolve a pendência de uso comercial no Hobby; verificar se a Cloudflare tem restrição equivalente para uso comercial no plano gratuito além da cláusula 2.2.1(h) (seção 6): NÃO VERIFICADO.
- [ ] **F4.7 Cache longo (opcional):** depois de a virada estar estável, avaliar adicionar `Cache-Control` immutable para `/assets/*` (nomes com hash do Vite) e cache moderado para `/images/*`; só depois de conferir como o fallback de SPA trata `/assets/*` inexistentes. Não fazer antes.

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
- [ ] **AI_CONTEXT_PETLUXO.md** (linhas 9, 24, 65, 73, 178, 198, 201, 205): trocar "Hospedagem: Vercel (Hobby)" por Cloudflare Workers (com a data), remover `vercel.json`/`.vercel` das menções que deixem de valer, atualizar a linha 73 (acesso direto a rotas passa a depender do fallback de SPA), e as pendências 9 e 12. Fazer após a virada.
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

## 7. Rollback (voltar para a Vercel)

| Fase | Como voltar | Observação |
|---|---|---|
| F1 | Reverter o commit (ou apagar `wrangler.jsonc`, `public/_headers`, `.nvmrc`). A Vercel ignora esses arquivos. | Sem efeito em produção. |
| F2 | Excluir o Worker no dashboard. | Produção nunca saiu da Vercel. |
| F3a | No Registro.br, devolver os nameservers para `ns1.vercel-dns.com` e `ns2.vercel-dns.com`. | Os registros da Vercel permanecem intactos. Só funciona se o domínio ainda estiver configurado no projeto Vercel (e o acesso ao Registro.br continuar disponível). |
| F3a.6 (ensaio) | Apagar os Custom Domains de teste, as Redirect Rules de teste e o CNAME `teste2`. | Hostnames separados; produção não é afetada. |
| F3b | Excluir os Custom Domains e a regra de redirecionamento; recriar na zona os CNAME/ALIAS conforme a exportação de F0.2 (reler os alvos no painel da Vercel no momento do rollback, pois a Vercel pode mudá-los), DNS only (ou, mais lento, voltar os NS como em F3a). | Janela de propagação curta se os registros voltarem na própria zona Cloudflare. Os certificados da Vercel expiram em 2026-12-10; depois disso o rollback exige que a Vercel reemita. |
| F4 | Até excluir o projeto Vercel, qualquer rollback acima vale. Depois de excluído, é preciso recriar o projeto e o domínio na Vercel (≈ o setup descrito no `docs/DEPLOY.md` atual). | Por isso a janela de 7 a 14 dias. |
| DNSSEC | Se for ativado na Cloudflare (D8), voltar os NS exige antes remover o DS no Registro.br e esperar o TTL. | Motivo para não ativar agora. |

## 8. NÃO VERIFICADO

1. **Se o `_headers` se aplica ao `index.html` devolvido pelo fallback de SPA** (a doc de `_headers` não diz; a de SPA também não). Teste decisivo: F2.2 (3 cabeçalhos de segurança em `/produto/2`).
2. **Se o Workers Builds aceita repositório GitHub privado.** As páginas consultadas (`/workers/ci-cd/builds/` e a de integração com GitHub) não afirmam nem negam; uma busca retornou resumos que dizem que sim, mas com relatos de usuários de falha no clone de repositórios privados em 2026-10-27 (posts de comunidade, não aviso oficial). Tratar como não confirmado (por isso D3 = não privatizar).
3. **Limite de arquivos e tamanho por arquivo em Workers assets:** confirmado na página de limites (https://developers.cloudflare.com/workers/platform/limits/): **20.000 arquivos por versão no Free** (100.000 no Paid; requer Wrangler ≥ 4.34.0 para os limites maiores) e **25 MiB por arquivo**. O site tem 99 arquivos e o maior é `og-image.png` (1.837.059 B): folga ampla. *Não verificado:* se as requisições de assets contam na cota diária do plano grátis; a página de billing diz só que são "free and unlimited".
4. **Prazo de propagação da troca de NS no Registro.br** e **TTL do NS**: não medidos.
5. **Prazo de emissão do certificado** do Custom Domain e **comportamento da criação de Custom Domain** com curinga `*` e com CNAME próprio (a doc só cita que CNAME existente impede). Será respondido pelo ensaio F3a.6.
6. **Nome/local da opção "Always Use HTTPS"** e se está ligada por padrão numa zona nova. Será respondido pelo ensaio F3a.6.
7. **CNAME na raiz (flattening) no plano Free:** a página oficial não detalha os planos (F3a.2, a).
8. **Se os 3 CAA atuais (`pki.goog`, `sectigo.com`, `letsencrypt.org`) bastam** para a emissão de certificados da Cloudflare para Custom Domains; a doc de CAA cita também `ssl.com` e diz que a lista não é exaustiva (F3a.2, b).
9. **Como um CNAME curinga interage com um Custom Domain de hostname exato** (F3a.2, c; o ensaio responde).
10. **DNSSEC no Registro.br:** `dig DS`/`dig DNSKEY` vazios sugerem que não está ativo; o painel do Registro.br não foi consultado (bloqueado pelo acesso).
11. **Domínio do painel `petluxo-admin`:** provavelmente um `*.vercel.app`, NÃO VERIFICADO.
12. **Aba "Shared" das variáveis de ambiente da Vercel:** não conferida (opcional; o projeto não tem variáveis próprias).
13. **Domínio configurado no stream do GA4** e eventuais filtros de hostname (F0.6).
14. **Condições de uso comercial do plano gratuito da Cloudflare** além da cláusula 2.2.1(h) (TODO 4 equivalente).
15. **Nome do Worker vs. `name` do `wrangler.jsonc`** (efeito de divergência no Workers Builds) e **se `npx wrangler deploy` dispensa `wrangler` em `devDependencies`**.
16. **Suporte a `Host:` e a hostnames no Playwright contra `workers.dev`:** não testado; os testes atuais apontam para `localhost:5173`.
17. **Prévia no WhatsApp/Facebook após a virada**, comportamento de `/politica-de-troca-e-devolucao`, `/politica-de-frete-e-entrega` e `/termos-de-uso` em acesso direto na Vercel hoje e `og-image.jpg` por curl: só testáveis nas fases F2/F4.
18. **Instagram correto:** `Footer.jsx:51` aponta para `pettluxo_` e o `AI_CONTEXT_PETLUXO.md` cita `@petluxostory`; decisão do dono, ainda não resolvida.
19. **Push e deploy da F1:** confirmados em 2026-10-27 (o robots.txt de produção já mostra o www).

### Correções ao que já se sabia (conferido nesta data)

- Node padrão do Workers Builds: a doc atual diz **24.22.1**, com **22.23.4** também pré-instalado (não 24.18.0).
- `docs/DEPLOY.md` diz que `robots.txt` tem `Host:` e que o sitemap lista "todas as URLs": falso nos dois.
- Vercel também envia `access-control-allow-origin: *` e `content-disposition: inline` nos estáticos (visto por curl).
- Build: `npm run build` levou ~22 s no total (Vite 6.4.2 em ~7,9 s, após `scripts/validate-catalog.js`), 99 arquivos, 14 MB, maior arquivo `public/og-image.png` com 1.837.059 B (confirmado).
- Fontes da documentação consultada: https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/ · https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/ · https://developers.cloudflare.com/workers/static-assets/headers/ · https://developers.cloudflare.com/workers/static-assets/redirects/ · https://developers.cloudflare.com/workers/configuration/routing/custom-domains/ · https://developers.cloudflare.com/dns/dnssec/ · https://developers.cloudflare.com/workers/ci-cd/builds/build-image/ · https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/ · https://developers.cloudflare.com/workers/platform/limits/ · https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ · https://developers.cloudflare.com/rules/url-forwarding/ · https://www.cloudflare.com/terms/
