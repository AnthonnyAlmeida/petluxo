# PetLuxo — Visão Geral do Projeto

## O que é

PetLuxo é um site institucional de e-commerce de produtos premium para pets. O site apresenta os produtos da loja, conta a história da marca e direciona os clientes para o WhatsApp para fechar pedidos. Não há carrinho de compras nem backend — é um site 100% estático.

## URLs

- **Produção:** https://petluxo.vercel.app
- **Repositório:** https://github.com/AnthonnyAlmeida/petluxo

## Stack

| Tecnologia | Versão | Para que serve |
|---|---|---|
| React | 18.3.1 | Interface declarativa com componentes e hooks |
| Vite | 6.4.2 | Bundler e servidor de desenvolvimento |
| CSS puro | — | Estilização completa sem frameworks de UI |
| Google Fonts | — | Cormorant Garamond (serif) + Inter (sans) + JetBrains Mono |
| Google Analytics | G-KKMV5VHR48 | Rastreamento de visitas via gtag.js |

## Estrutura de pastas

```
petluxo/
├── public/              # Arquivos copiados diretamente para o build
│   ├── favicon.svg      # Ícone da aba do navegador
│   ├── robots.txt       # Instruções para robôs de busca
│   ├── sitemap.xml      # Mapa do site para SEO
│   ├── 404.html         # Página de erro para SPAs (redirect para /)
│   ├── og-image.png     # Imagem de capa 1200×630 para redes sociais
│   └── images/
│       ├── brand/       # Logo e assets de marca
│       └── products/    # Fotos dos produtos (vão para o git)
├── assets/              # Assets importados pelo Vite (logo, hero)
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
│   │   └── products.js  # Catálogo de produtos — fonte de verdade
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
└── docs/                # Esta pasta — documentação do projeto
```

> **Imagens:** `public/images/image-hero.png` está no `.gitignore`. Todas as demais imagens (products/, brand/, og-image.png) vão para o git normalmente.

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

## Catálogo de produtos

**11 produtos em 5 categorias:**

| ID | Nome | Categorias |
|---|---|---|
| 1 | Brinquedo Interativo de Pelúcia | mais-vendidos, brinquedos |
| 3 | Garrafa Portátil Premium para Pets | mais-vendidos, dining-collection |
| 4 | Comedouro Elevado Premium | dining-collection |
| 6 | Refúgio PetLuxo Cozy | conforto |
| 8 | Bolsa Transporte PetLuxo | couro |
| 9 | Kit Milano Camelo | couro |
| 10 | Porta Saquinhos em Couro | couro |
| 12 | Sofá PetLuxo Essence | conforto |
| 13 | Sofá Ortopédico Lounge PetLuxo™ | mais-vendidos, conforto |
| 14 | Cama PetLuxo CloudNest™ | conforto |
| 15 | Coleira PetLuxo Atena™ | couro |
| 16 | Comedouro Maison Élevé™ | mais-vendidos, dining-collection |

**Categorias disponíveis:**

| ID | Label |
|---|---|
| `mais-vendidos` | Mais Vendidos |
| `conforto` | Conforto & Estilo |
| `couro` | Essenciais em Couro |
| `dining-collection` | Dining Collection |
| `brinquedos` | Brinquedos |

## Variáveis de ambiente

O número de WhatsApp é configurado em `src/lib/whatsapp.js` diretamente. Não há variáveis de ambiente em uso no momento.

