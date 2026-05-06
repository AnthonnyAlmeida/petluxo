# Deploy na Vercel

O PetLuxo é um site 100% estático — não tem backend, banco de dados nem servidor. O deploy é automático: a cada `git push` para a branch `main`, a Vercel executa `npm run build` e publica os arquivos da pasta `dist/`.

**Site em produção:** https://petluxo.vercel.app

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

## Verificar se o deploy está correto

Após cada deploy, cheque:

- [ ] Site carrega sem erros no navegador
- [ ] Botões de WhatsApp funcionam (abrem conversa correta)
- [ ] Menu hambúrguer funciona no celular
- [ ] Imagens carregam (hero, logo, produtos)
- [ ] Favicon aparece na aba do navegador
- [ ] Acessar `/robots.txt` e `/sitemap.xml` retorna os arquivos corretos
- [ ] Google Analytics recebe eventos (verificar em GA4 → Tempo Real)

---

## Domínio

O site usa a URL gratuita da Vercel (`petluxo.vercel.app`). Para adicionar domínio próprio no futuro:

1. No painel da Vercel, entre no projeto
2. Vá em **Settings → Domains**
3. Clique em **Add Domain** e digite o domínio
4. Configure os registros DNS no provedor (Registro.br, GoDaddy, Cloudflare)
5. HTTPS é ativado automaticamente via Let’s Encrypt
6. Após confirmar, atualizar `og:url`, `og:image`, `twitter:image`, `robots.txt` e `sitemap.xml` com o novo domínio

