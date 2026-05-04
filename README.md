# PetLuxo

Site institucional de e-commerce de produtos premium para pets, desenvolvido como projeto de portfólio com foco em design sofisticado e experiência do usuário.

<!-- Adicione um screenshot aqui após o deploy:
![PetLuxo Screenshot](./public/images/screenshot.png)
-->

---

## Tecnologias

- **React 18** — Interface declarativa com hooks
- **Vite 6** — Bundler e dev server ultrarrápido
- **CSS puro** — Sem frameworks de UI; design system proprietário com CSS custom properties
- **Google Fonts** — Cormorant Garamond (serif) + Inter (sans) + JetBrains Mono

---

## Funcionalidades

- **Carrossel de produtos responsivo** — Navegação por setas e dots de paginação; 3 cards/desktop, 2/tablet, 1/mobile; transição suave com CSS `transform`
- **Filtro por categoria** — Chips de filtro que reiniciam o carrossel automaticamente
- **Integração com WhatsApp** — Botão flutuante e links diretos nos cards de produto
- **Modal de produto** — Overlay com detalhes e CTA para contato
- **Efeitos de scroll** — Animações de reveal com `IntersectionObserver` e parallax no logo
- **Design system** — Paleta de tons terrosos (vinho, dourado, caramelo, offwhite) via CSS variables

---

## Rodando localmente

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/petluxo.git
cd petluxo

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente (opcional)
cp .env.example .env.local
# Edite .env.local com seu número de WhatsApp

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em **http://localhost:5173**

Para acessar pelo celular na mesma rede:
```bash
npm run dev -- --host
# Acesse pelo IP exibido no terminal (ex: http://192.168.x.x:5173)
```

---

## Build de produção

```bash
npm run build    # Gera a pasta dist/
npm run preview  # Preview local do build gerado
```

---

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_WHATSAPP_PHONE` | Número de WhatsApp com DDD e código do país | `5561994063917` |

---

## Estrutura de pastas

```
petluxo/
├── public/              # Arquivos estáticos públicos
│   └── images/          # Imagens de produtos e branding
├── assets/              # Assets importados via Vite
│   └── hero/            # Imagens da seção hero
├── src/
│   ├── app/
│   │   └── page.jsx     # Componente raiz (App)
│   ├── components/
│   │   ├── layout/      # Navbar e Footer
│   │   ├── product/     # ProductCard, ProductGrid (carrossel), ProductModal
│   │   ├── sections/    # Hero, Featured, Products, Story, Differentials, CTA
│   │   └── ui/          # Button, Container, Section (primitivos de UI)
│   ├── data/
│   │   └── products.js  # Catálogo de produtos (fonte de verdade)
│   ├── hooks/
│   │   └── useScroll.js # IntersectionObserver + parallax
│   ├── lib/
│   │   └── whatsapp.js  # Helper para links de WhatsApp
│   ├── styles/
│   │   ├── variables.css  # Design tokens (cores, fontes, espaçamentos)
│   │   └── globals.css    # Estilos globais e componentes
│   ├── icons.jsx          # Ícones SVG inline
│   ├── tweaks-panel.jsx   # Painel de tweaks de design (dev)
│   └── main.jsx           # Entry point do Vite
├── index.html           # Shell HTML principal
├── vite.config.js       # Configuração do Vite
└── .env.example         # Modelo de variáveis de ambiente
```

---

## Melhorias futuras

- [ ] Substituir dados mockados por integração com CMS (Sanity, Contentful ou Strapi)
- [ ] Adicionar página de produto individual com rota própria (React Router)
- [ ] Implementar carrinho de compras local com `localStorage`
- [ ] Adicionar página de contato com formulário validado
- [ ] Deploy na Vercel ou Netlify com preview automático por PR
- [ ] Testes unitários com Vitest + React Testing Library
- [ ] Internacionalização (i18n) para suporte a múltiplos idiomas

---

## Licença

MIT
