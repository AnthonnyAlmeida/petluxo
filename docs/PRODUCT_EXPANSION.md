# Expansão de Conteúdo de Produtos

## Contexto

A ficha de produto atual (imagem única, descrição, bullets) é considerada rasa demais e pode estar prejudicando a conversão. O pedido é expandir cada ficha com:

- Galeria com múltiplas fotos (hoje é 1 imagem por produto)
- Especificações técnicas estruturadas (material externo, forração interna, estrutura, ventilação, segurança, tipo de alças, fechamento, indicação de uso)
- Tabela de medidas por tamanho (altura, comprimento, largura, peso indicado — produtos com variação P/M/G)
- Texto de orientação "como escolher o tamanho ideal"
- Lista "o que acompanha" o produto
- Instruções de limpeza e conservação
- Observação sobre uso em viagens aéreas (quando aplicável)
- Garantia
- FAQ específico do produto

Além disso, foi pedido um selo fixo "Por que escolher a PetLuxo?" com 6 diferenciais — esse **não é conteúdo por produto**, é um componente global reutilizável.

Ponto central do pedido: o negócio ainda está levantando esse nível de detalhe produto por produto (32 produtos no catálogo). A estrutura precisa suportar produtos com dados completos e produtos com dados parciais/ausentes ao mesmo tempo, sem quebrar nada.

## Decisão de arquitetura

### Página própria por produto, não o modal

O conteúdo expandido vive em uma página própria, rota `/produto/:id` — usando o `id` numérico que já é a chave única e estável de cada produto em `products.js`, sem precisar de campo novo.

O `ProductModal` (quick view) continua exatamente como está hoje. A única mudança nele é um link condicional "Ver ficha completa", que só aparece quando o produto tem dados expandidos, apontando para `/produto/:id`.

Motivo: o volume de conteúdo pedido é de leitura, não de "olhar rápido e comprar". Empurrar isso para dentro do modal (que já tem scroll interno apertado no mobile) degradaria a experiência de todo o catálogo, inclusive dos produtos que não vão ter esse conteúdo tão cedo. Uma rota própria também dá URL compartilhável, o que importa porque o negócio vende bastante via link direto no WhatsApp.

`ProductPage.jsx` segue o mesmo padrão já usado pelas páginas de política (`PrivacyPage.jsx` etc.): se autocompõe com `<Navbar/><main>...</main><Footer/>`, então a nova rota entra em `src/app/page.jsx` sem alterar o layout da home.

### Dados expandidos em arquivo separado, não em `products.js`

Os dados novos vivem em `src/data/productDetails.js`, indexado por `id` de produto — **não** como campo dentro dos objetos de `PRODUCTS` em `products.js`.

Motivo: `products.js` é escrito diretamente por um painel administrativo externo ao repositório (fora deste código-fonte, sem visibilidade de como ele serializa o arquivo). Se o conteúdo expandido (FAQ, specs, galeria) vivesse aninhado dentro dos objetos de produto, qualquer reescrita feita pelo painel (ex.: editar um preço ou badge) correria o risco de apagar ou corromper esse conteúdo sem ninguém perceber na hora. Separando em arquivo próprio:

- O painel admin continua escrevendo em `products.js` exatamente como escreve hoje — nunca toca no conteúdo rico.
- O conteúdo expandido pode ser preenchido um produto por vez, em commits isolados, sem depender do fluxo do painel nem risco de conflito de merge no mesmo arquivo.
- Fica mais fácil, no futuro, fazer code-splitting do conteúdo rico se ele crescer muito (import dinâmico por produto), sem reestruturar nada.

### Tudo opcional, sem seções vazias

Cada campo em `productDetails.js` é opcional. Cada seção da `ProductPage` só renderiza se os dados daquele produto existirem (mesmo padrão de opcionalidade que `products.js` já usa para `subtitle`, `originalPrice`, `prices`, `buyLinks`, `badge`, `featured`). Produto sem entrada em `productDetails.js` continua funcionando exatamente como hoje — sem seções quebradas, tituladas ou vazias aparecendo.

### Produto oculto ou inexistente

Acesso a `/produto/:id` de um produto com `visible: false` ou de um `id` que não existe em `PRODUCTS` renderiza o componente `NotFound` já existente (mesmo tratamento do catch-all `*`), em vez de vazar um produto que deveria estar oculto do site.

A página reutiliza a mesma lógica de 3 estados do botão de compra que já existe em `ProductModal.jsx` (badge `ESGOTADO` → botão desabilitado + WhatsApp; `buyLinks` → seletor de tamanho; `buyLink` único → botão direto; nenhum dos dois → só WhatsApp), em vez de duplicar essa regra.

### Selo "Por que escolher a PetLuxo?"

Componente novo e estático em `src/components/ui/` — mesmo padrão de `TrustBadges.jsx` (componente pequeno, reutilizável, conteúdo hardcoded, sem props de produto). Os 6 diferenciais são fixos e iguais em todo lugar onde o selo for usado.

Importante: **não é o mesmo componente que `Differentials.jsx`**, apesar do título "POR QUE ESCOLHER A PETLUXO" já existir lá. `Differentials.jsx` é uma seção editorial da home com 4 itens em formato de seção completa; o selo novo é um bloco compacto com 6 itens fixos, pensado para caber na `ProductPage`. São conteúdos e propósitos diferentes — o nome do componente novo deve deixar isso claro (ex.: `BrandSeal.jsx` ou `WhyPetLuxo.jsx`), sem renomear ou reaproveitar `Differentials.jsx`.

## Schema de dados (`src/data/productDetails.js`)

```js
export const PRODUCT_DETAILS = {
  [productId]: {
    gallery: [],           // string[] opcional — caminhos adicionais de imagem; se ausente, a página usa só product.image
    specs: {},              // objeto chave:valor opcional — specs técnicas estruturadas
    sizeChart: [],          // { size, height, length, width, weight }[] opcional
    howToChooseSize: '',    // string opcional — texto de orientação "como escolher o tamanho ideal"
    whatsIncluded: [],      // string[] opcional — "o que acompanha o produto"
    careInstructions: '',   // string opcional — limpeza e conservação
    airTravelNote: '',      // string opcional — só produtos aplicáveis a viagens aéreas
    warranty: '',           // string opcional — garantia
    faq: [],                // { question, answer }[] opcional — FAQ específico do produto
  },
};
```

| Campo | Tipo | Observação |
|---|---|---|
| `gallery` | string[] (opcional) | Caminhos adicionais em `/public/images/products/`; ausência não afeta `product.image`, que continua sendo a imagem principal em todo o site |
| `specs` | objeto (opcional) | Chave:valor livre — ex.: `materialExterno`, `forracaoInterna`, `estrutura`, `ventilacao`, `seguranca`, `tipoAlcas`, `fechamento`, `indicacaoUso` |
| `sizeChart` | `{size, height, length, width, weight}[]` (opcional) | Só faz sentido para produtos com variação de tamanho |
| `howToChooseSize` | string (opcional) | Texto livre |
| `whatsIncluded` | string[] (opcional) | Lista simples |
| `careInstructions` | string (opcional) | Texto livre |
| `airTravelNote` | string (opcional) | Omitir em produtos sem aplicação a viagem aérea |
| `warranty` | string (opcional) | Texto livre |
| `faq` | `{question, answer}[]` (opcional) | FAQ do produto — não confundir com o `FAQ` global da home |

Produto sem entrada em `PRODUCT_DETAILS[id]`: `ProductPage` renderiza apenas o que já existe em `products.js` (imagem, nome, descrição, bullets, preço, compra) — nenhuma seção nova aparece.

## Convenção de pastas de imagem por produto (`public/images/products/`)

Todo produto tem sua própria pasta dentro de `public/images/products/`, nomeada com o slug do nome do produto — kebab-case, minúsculo, sem acento, sem espaço (ex.: `bolsa-transporte-petluxo`).

Dentro da pasta:

- `principal.webp` — imagem de capa, a mesma referenciada em `product.image` (usada no card, no modal e como imagem principal da `ProductPage`)
- `<slug-da-pasta>-2.webp`, `<slug-da-pasta>-3.webp`, ... — fotos adicionais, com o slug da pasta como prefixo seguido de número sequencial (ex.: `bolsa-transporte-petluxo-2.webp`, `bolsa-transporte-petluxo-3.webp`), referenciadas em `PRODUCT_DETAILS[id].gallery`. Numeração começa em `2` (o `1` conceitual é o próprio `principal.webp`), ordenada pela ordem cronológica em que as fotos foram tiradas/recebidas. Substitui a convenção anterior de numeração simples sem prefixo (`2.webp`, `3.webp`), abandonada por ficar ambígua fora do contexto da pasta (ex.: ao arrastar o arquivo para fora, ou em qualquer listagem que misture arquivos de produtos diferentes).

**Migração completa, não mais gradual.** A ideia original era migrar produto por produto, só quando cada um ganhasse galeria própria (decisão registrada na primeira versão deste documento). Essa decisão foi revertida: os **32 produtos do catálogo** foram migrados de uma vez para a pasta própria, para manter o padrão consistente em todo o site desde já, independentemente de já terem ou não fotos adicionais — a maioria ainda tem só `principal.webp` na pasta, aguardando galeria. Produtos novos que entrarem no catálogo devem seguir a mesma convenção desde o cadastro.

**Risco aceito:** o nome da pasta (slug) é gerado a partir do nome do produto no momento da migração e não é atualizado automaticamente se o produto for renomeado depois. Isso não é grave — é só um identificador de arquivo interno, não precisa acompanhar o nome exibido no site. Uma pasta com nome "desatualizado" continua funcionando normalmente; só fica um pouco menos autoexplicativa para quem for editar o catálogo no futuro.

## Riscos documentados

| Risco | Mitigação / status |
|---|---|
| Painel admin externo escreve direto em `products.js` e não tem como preencher os campos novos | Conteúdo expandido isolado em `productDetails.js`, arquivo que o painel nunca toca |
| SEO / preview de link (WhatsApp, redes sociais) por produto | Site é CSR puro, sem gerenciamento de `<head>` por rota — `/produto/:id` herda as meta tags genéricas de `index.html`. Aceitável nesta fase; requer solução server-side (prerender/edge) para ter OG por produto, fora de escopo agora |
| `public/sitemap.xml` é manual | Novas páginas de produto não entram automaticamente no sitemap por ora — já era uma pendência pré-existente (ver `docs/TODO.md`) |

## Plano de implementação

- [ ] **Fase 1 — Fundação:** criar `productDetails.js` vazio, `ProductPage.jsx`, rota `/produto/:id` em `src/app/page.jsx`, link condicional "Ver ficha completa" no `ProductModal`, tratamento 404 (produto oculto ou `id` inexistente)
- [ ] **Fase 2 — Selo global:** implementar `BrandSeal`/`WhyPetLuxo` em `src/components/ui/`, plugar na `ProductPage`
- [ ] **Fase 3 — Piloto:** popular a Bolsa Transporte PetLuxo com o conteúdo real já recebido, validando o schema na prática
- [ ] **Fase 4 — Rollout gradual:** adicionar entrada em `productDetails.js` um produto por vez, conforme os dados forem levantados — sem tocar em `products.js` nem no painel admin

**Fora de escopo por ora:** meta tags dinâmicas por produto e geração automática de sitemap.
