# Deploy na Vercel

O PetLuxo é um site 100% estático — não tem backend, banco de dados nem servidor. O deploy é automático: a cada `git push` para a branch `main`, a Vercel executa `npm run build` e publica os arquivos da pasta `dist/`.

**Site em produção:** https://petluxostory.com.br

> ⚠️ O repositório deve permanecer **público**. O Vercel Hobby Plan não faz deploy de repositórios privados. Se o deploy parar de funcionar, verifique a visibilidade do repositório no GitHub primeiro.

## Como funciona

O repositório `github.com/AnthonnyAlmeida/petluxo` está conectado à Vercel. O fluxo é:

1. Editar arquivos localmente
2. `npm run build` (verificar que compila sem erros)
3. `git add -A && git commit -m "..." && git push`
4. A Vercel detecta o push e faz o deploy automaticamente em ~1 minuto

## Pré-requisitos para um novo ambiente

- Conta na [Vercel](https://vercel.com) (gratuita para projetos pessoais)
- Node.js instalado na sua máquina
- Acesso ao repositório: `github.com/AnthonnyAlmeida/petluxo`

---

## Setup inicial (já feito — documentação para referência)

### Pela interface da Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Selecione o repositório `petluxo` do GitHub
4. Confirme as configurações:
   - **Framework Preset:** Vite (detectado automaticamente)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Clique em **Deploy**

### Pela linha de comando (Vercel CLI)

```bash
npm install -g vercel
vercel login
cd /home/anthonnyalmeida/petluxo
vercel --prod
```

---

## Domínio customizado (já configurado)

O site usa o domínio próprio `petluxostory.com.br`, registrado no Registro.br.

**Como foi configurado:**
1. No painel da Vercel → projeto → **Settings → Domains** → adicionado `petluxostory.com.br`
2. No Registro.br → configurados os nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
3. A Vercel gerencia automaticamente os registros DNS e o HTTPS via Let's Encrypt

**Arquivos atualizados com o domínio real:**
- `index.html` — `og:url`, `og:image`, `twitter:image`
- `public/robots.txt` — `Sitemap:` e `Host:`
- `public/sitemap.xml` — todas as URLs

**Para trocar o domínio no futuro:**
Atualizar as URLs em todos os arquivos acima e no painel da Vercel.

---

## Verificar se o deploy está correto

Após cada deploy, cheque:

- [ ] Site carrega sem erros no navegador
- [ ] Botões "COMPRAR AGORA" abrem o link PagBank correto em nova aba
- [ ] Botões WhatsApp funcionam (abrem conversa correta)
- [ ] Menu hambúrguer funciona no celular
- [ ] Imagens carregam (hero, logo, produtos)
- [ ] Favicon aparece na aba do navegador
- [ ] Acessar `/robots.txt` e `/sitemap.xml` retorna os arquivos corretos
- [ ] Google Analytics recebe eventos (verificar em GA4 → Tempo Real)

---

---

## Se o deploy parar de funcionar

Verificar nesta ordem:

1. **Repositório privado?** — O Vercel Hobby Plan não faz deploy de repos privados. Tornar público no GitHub e forçar redeploy:
   ```bash
   git commit --allow-empty -m "fix: force redeploy after repo visibility change"
   git push
   ```

2. **Build com erros?** — Rodar `npm run build` localmente e corrigir antes do push

3. **Vercel desconectado do GitHub?** — Reconectar no painel: Settings → Git → Reconnect

