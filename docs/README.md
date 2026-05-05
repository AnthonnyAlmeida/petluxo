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
│   └── images/          # Imagens de produtos e branding
├── assets/              # Assets importados pelo Vite (logo, hero)
│   └── hero/
├── src/
│   ├── app/
│   │   └── page.jsx     # Componente raiz (App), renderiza todas as seções
│   ├── components/
│   │   ├── layout/      # Navbar (com menu hambúrguer) e Footer
│   │   ├── product/     # ProductCard, ProductGrid (carrossel), ProductModal
│   │   ├── sections/    # Hero, Featured, Products, Story, Differentials, CTA
│   │   └── ui/          # Button, Container, Section (primitivos reutilizáveis)
│   ├── data/
│   │   └── products.js  # Lista de produtos (fonte de verdade dos dados)
│   ├── hooks/
│   │   └── useScroll.js # Animações de scroll (IntersectionObserver + parallax)
│   ├── lib/
│   │   └── whatsapp.js  # Gera links de WhatsApp com mensagem pré-preenchida
│   ├── styles/
│   │   ├── variables.css  # Design tokens: cores, fontes, espaçamentos
│   │   └── globals.css    # Todos os estilos do site (~1300 linhas)
│   ├── icons.jsx          # Ícones SVG inline (sem biblioteca externa)
│   ├── tweaks-panel.jsx   # Painel de ajustes de design (apenas em dev)
│   └── main.jsx           # Entry point: monta o React no DOM
├── index.html           # Shell HTML principal com todas as meta tags
├── vite.config.js       # Configuração mínima do Vite
├── .env.example         # Modelo das variáveis de ambiente
└── docs/                # Esta pasta — documentação do projeto
```

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
