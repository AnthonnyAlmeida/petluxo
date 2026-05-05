# PetLuxo — Visão Geral do Projeto

## O que é

PetLuxo é um site institucional de e-commerce de produtos premium para pets. O site apresenta os produtos da loja, conta a história da marca e direciona os clientes para o WhatsApp para fechar pedidos. Não há carrinho de compras nem backend — é um site 100% estático.

## Stack

| Tecnologia | Versão | Para que serve |
|---|---|---|
| React | 18.3.1 | Interface declarativa com componentes e hooks |
| Vite | 6.4.2 | Bundler e servidor de desenvolvimento |
| CSS puro | — | Estilização completa sem frameworks de UI |
| Google Fonts | — | Cormorant Garamond (serif) + Inter (sans) + JetBrains Mono |

## Estrutura de pastas

```
petluxo/
├── public/              # Arquivos copiados diretamente para o build
│   ├── favicon.svg      # Ícone da aba do navegador
│   ├── robots.txt       # Instruções para robôs de busca
│   ├── sitemap.xml      # Mapa do site para SEO
│   ├── 404.html         # Página de erro para SPAs (redirect para /)
│   └── images/
│       ├── brand/       # Logo e assets de marca
│       ├── image-hero.png        # Imagem principal do hero
│       └── products/    # Fotos dos produtos (gitignored — não estão no repo)
├── assets/              # Assets importados pelo Vite (logo)
├── src/
│   ├── app/
│   │   ├── page.jsx     # Componente raiz (App), renderiza todas as seções
│   │   └── DevTweaks.jsx # Painel de design — carregado apenas em dev
│   ├── components/
│   │   ├── layout/      # Navbar (com menu hambúrguer) e Footer
│   │   ├── product/     # ProductCard, ProductGrid (carrossel), ProductModal
│   │   ├── sections/    # Hero, Featured, Products, Story, Differentials, CTA, NotFound
│   │   └── ui/          # Button, Container, Section (primitivos reutilizáveis)
│   ├── data/
│   │   └── products.js  # Catálogo de produtos (gitignored — contém dados sensíveis)
│   ├── hooks/
│   │   └── useScroll.js # Animações de scroll (IntersectionObserver + parallax)
│   ├── lib/
│   │   └── whatsapp.js  # Gera links de WhatsApp com mensagem pré-preenchida
│   ├── styles/
│   │   ├── variables.css  # Design tokens: cores, fontes, espaçamentos
│   │   └── globals.css    # Todos os estilos do site (~1500 linhas)
│   ├── icons.jsx          # Ícones SVG inline (sem biblioteca externa)
│   ├── tweaks-panel.jsx   # Painel de ajustes de design (apenas em dev)
│   └── main.jsx           # Entry point: monta o React no DOM
├── index.html           # Shell HTML principal com todas as meta tags
├── vite.config.js       # Configuração mínima do Vite
├── .env.example         # Modelo das variáveis de ambiente
└── docs/                # Esta pasta — documentação do projeto
```

> **Atenção:** `src/data/products.js` e `public/images/products/` estão no `.gitignore` — não existem no repositório, apenas localmente e no servidor de produção. Para configurar em um novo ambiente, crie o arquivo manualmente a partir do modelo em `src/data/products.example.js` (se disponível).

## Como rodar localmente

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em **http://localhost:5173**

Para ver no celular (mesmo Wi-Fi):
```bash
npm run dev -- --host
# O terminal vai exibir o IP, ex: http://192.168.x.x:5173
```

## Como fazer o build

```bash
npm run build
```

Os arquivos finais são gerados na pasta `dist/`. Para visualizar o build localmente antes de subir:

```bash
npm run preview
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e ajuste conforme necessário:

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_WHATSAPP_PHONE` | Número de WhatsApp com DDD e código do país | `5561994063917` |
