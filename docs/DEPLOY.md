# Deploy na Vercel

O PetLuxo é um site 100% estático — não tem backend, banco de dados nem servidor. O deploy é simples: a Vercel executa `npm run build` e serve os arquivos da pasta `dist/`.

## Pré-requisitos

- Conta na [Vercel](https://vercel.com) (gratuita para projetos pessoais)
- Node.js instalado na sua máquina
- Repositório no GitHub (já criado: `github.com/AnthonnyAlmeida/petluxo`)

---

## Opção 1 — Deploy pela interface da Vercel (mais fácil)

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Selecione o repositório `petluxo` do GitHub
4. Confirme as configurações:
   - **Framework Preset:** Vite (detectado automaticamente)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Clique em **Deploy**

Pronto. A Vercel vai gerar uma URL pública como `petluxo.vercel.app`.

A partir daí, toda vez que você fizer `git push` para a branch `main`, o site atualiza automaticamente.

---

## Opção 2 — Deploy pela linha de comando (Vercel CLI)

```bash
# 1. Instale a Vercel CLI globalmente
npm install -g vercel

# 2. Faça login na sua conta Vercel
vercel login

# 3. Na raiz do projeto, rode o deploy
cd /home/anthonnyalmeida/petluxo
vercel

# Siga as perguntas:
# - Set up and deploy? Yes
# - Which scope? (sua conta)
# - Link to existing project? No (primeira vez)
# - Project name? petluxo
# - Directory? ./
# - Override settings? No
```

Para deploys seguintes, basta rodar `vercel --prod` para ir direto para produção.

---

## Variáveis de ambiente na Vercel

Se você definiu um número de WhatsApp personalizado no `.env.local`, precisa configurar a variável também na Vercel:

1. No painel da Vercel, entre no projeto
2. Vá em **Settings → Environment Variables**
3. Adicione:
   - **Name:** `VITE_WHATSAPP_PHONE`
   - **Value:** seu número (ex: `5511999999999`)
   - **Environment:** Production, Preview, Development

---

## Domínio customizado

Após o deploy, para usar um domínio próprio (ex: `petluxo.com.br`):

1. No painel da Vercel, entre no projeto
2. Vá em **Settings → Domains**
3. Clique em **Add Domain** e digite seu domínio
4. A Vercel vai mostrar os registros DNS para configurar no seu provedor de domínio (ex: Registro.br, GoDaddy, Cloudflare)
5. Após configurar o DNS, o HTTPS é ativado automaticamente pela Vercel (certificado gratuito via Let's Encrypt)

Depois de configurar o domínio, lembre de atualizar as 4 ocorrências de `SEU-DOMINIO-AQUI.com.br` no projeto (ver `docs/TODO.md`).

---

## Verificar se o deploy está correto

Após o deploy, cheque:

- [ ] Site carrega sem erros no navegador
- [ ] Botões de WhatsApp funcionam (abrem conversa correta)
- [ ] Menu hambúrguer funciona no celular
- [ ] Imagens carregam (hero, logo, produtos)
- [ ] Favicon aparece na aba do navegador
- [ ] Acessar `/robots.txt` e `/sitemap.xml` retorna os arquivos corretos
