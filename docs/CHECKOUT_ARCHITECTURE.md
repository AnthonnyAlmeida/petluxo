# Arquitetura do Checkout Completo

Carrinho de compras, pagamento embutido no site, cálculo real de frete e gestão de pedidos — substituindo o modelo atual de links avulsos de pagamento PagBank por produto.

**Status:** plano aprovado, implementação não iniciada. Nenhum código deste documento existe ainda.

## Contexto

O site é hoje 100% estático (React + Vite, sem backend, sem banco, hospedado na Vercel). Cada produto aponta para um link de pagamento PagBank pré-gerado (`buyLink`/`buyLinks` em `src/data/products.js`). O cliente sai do site, preenche tudo no PagBank, e nós só sabemos que entrou dinheiro.

Isso já causou um prejuízo real: numa venda recente o cliente preencheu o endereço no checkout do PagBank e **esse endereço nunca chegou à dona do negócio**. Não foi um bug — foi consequência estrutural da arquitetura: nenhum dado do pedido passa pelo nosso site, então não temos controle sobre o que é coletado nem sobre o que é repassado. Também não existe carrinho: cada produto é uma compra separada, um link por vez, o que impede vender dois itens numa transação só.

O objetivo é inverter a ordem dos fatos: **o pedido nasce e é gravado no nosso banco ANTES de qualquer cobrança**, e o pagamento acontece dentro do site. A partir daí, endereço, itens e status ficam sob nosso controle, independentemente do que o gateway devolve.

**Fora de escopo:** automatizar a compra no fornecedor e o envio físico. Os dois continuam manuais, feitos pela dona do negócio. O painel apenas organiza a informação — não automatiza fulfillment.

## Decisões validadas

| Área | Decisão | Justificativa |
|---|---|---|
| **Gateway** | **Mercado Pago** | Único do grupo pesquisado com SDK oficial Node (`mercadopago`) **e** SDK React oficial (`@mercadopago/sdk-react`). O **Payment Brick** embute cartão e PIX na própria página, tokenizando o cartão no navegador — dado de cartão nunca toca nosso servidor, o que mantém o escopo PCI no mínimo (SAQ-A). Webhook com assinatura HMAC (`x-signature`). Conta pessoa física (CPF) é aceita. |
| **Banco** | **Neon Postgres** (Marketplace Vercel) | Postgres serverless provisionado por `vercel integration add neon`, com env vars injetadas automaticamente e billing unificado. Escala a zero. SQL comum, sem infra para um dev solo manter. |
| **E-mail** | **Resend** (Marketplace Vercel) | Integração nativa (`resend/resend-email`), 3.000 e-mails/mês no free tier, API trivial em Vercel Functions. Exige verificar `petluxostory.com.br` por DNS. |
| **Frete** | **Melhor Envio — cotação automática por CEP** | Ver "Por que Melhor Envio" abaixo. |
| **Consulta de pedido** | Número do pedido + e-mail, **sem conta/login** | Decisão do negócio. Cadastro com senha é atrito desproporcional para um catálogo desse porte. |
| **Hospedagem** | **Vercel Functions**, mesmo projeto | Qualquer arquivo em `/api/` na raiz vira uma função automaticamente, sem framework e sem servidor separado. Nada muda no fluxo de deploy. |

### Por que Mercado Pago, e não PagBank

O PagBank tem as menores taxas do grupo (PIX ~0,35%, crédito à vista ~2,92%, contra ~0,99% de PIX no Mercado Pago) e a dona **já tem conta aprovada** — zero burocracia nova. Ainda assim ficou em segundo lugar: o PagBank não publica SDK oficial para Node (só PHP), o que joga a integração inteira para REST na mão, com documentação reconhecidamente mais fraca. Num projeto tocado por um dev solo, cuja stack é JavaScript de ponta a ponta, a diferença de qualidade de integração e de suporte a erro pesa mais que a diferença de taxa no volume atual.

O Asaas foi a terceira opção: API enxuta e pensada para pequeno negócio/PF, mas o modelo de cobrança por transação (R$ 0,99–1,99 no PIX, R$ 0,49 + percentual no cartão) fica proporcionalmente caro em ticket baixo, o cartão exige aprovação prévia da conta e também não há SDK Node oficial.

**Trade-off aceito e registrado:** pagamos mais caro no PIX em troca de uma integração significativamente mais simples e segura de manter.

### Por que Melhor Envio, e não taxa fixa

Uma decisão anterior previa duas taxas fixas (R$ 19,90 para produtos pequenos, R$ 34,90 para volumosos). **Foi revertida** por dois motivos:

1. **Carrinho misto não tinha resposta boa.** Um pedido com um item pequeno e um volumoso obrigaria a inventar uma regra arbitrária ("a maior faixa vence", "soma os dois", "cobra por faixa") — todas com casos em que o cliente paga a mais sem entender por quê.
2. **Risco de parecer injusto.** Frete fixo diverge muito do custo real nos extremos (item leve para região próxima paga demais; item volumoso para o Norte paga de menos, e a margem some).

A cotação real resolve os dois problemas de uma vez: a API do Melhor Envio recebe o **conjunto real de itens** do carrinho, com peso e dimensões, e devolve o preço que o transportador de fato cobra para aquele par de CEPs. Carrinho misto deixa de ser um caso especial — vira aritmética do transportador.

Os **Correios não são uma alternativa viável**: as APIs abertas foram encerradas em 30/09/2023 e hoje exigem contrato ativo e conta pessoa jurídica. O Melhor Envio funciona como agregador (Correios, Jadlog e outros) com cotação gratuita e ambiente sandbox.

**Custo do caminho escolhido:** é preciso cadastrar peso e dimensões dos 32 produtos — dado que hoje não existe em lugar nenhum do projeto. Ver "Peso e dimensões dos produtos" abaixo para como isso é feito gradualmente, sem bloquear o desenvolvimento.

## Arquitetura

### Fluxo principal — o pedido nasce antes da cobrança

```
1. Cliente monta o carrinho                     (localStorage, sem backend)
              ↓
2. Digita o CEP no checkout
              ↓
   POST /api/shipping/quote  ──────────────→  Melhor Envio (shipment/calculate)
              ↓                                        ↓
   Opções de frete (PAC / SEDEX / Jadlog) com preço e prazo — cliente escolhe uma
              ↓
3. Preenche endereço e dados pessoais
              ↓
   POST /api/checkout/create-order
        · recalcula TODOS os preços a partir de products.js
        · REcotação do frete no servidor (não confia no valor que veio do front)
        · grava o pedido no Neon com status "pending"     ←── AQUI O BUG DO ENDEREÇO MORRE
        · devolve orderNumber + total
              ↓
4. Payment Brick (cartão ou PIX) tokeniza no navegador
              ↓
   POST /api/checkout/pay  ────────────────→  Mercado Pago
              ↓
5. POST /api/webhooks/mercadopago            ←── FONTE DA VERDADE do pagamento
        · valida assinatura HMAC (x-signature)
        · refaz GET no Mercado Pago pelo payment_id
        · atualiza status → "paid"
        · dispara e-mail para o cliente e para a dona
```

O ponto 3 é o coração da correção: **o pedido existe no banco antes de qualquer tentativa de cobrança**. Se o pagamento falhar, for abandonado ou o cliente fechar o navegador, o pedido fica `pending` — e a dona ainda enxerga no painel quem tentou comprar o quê e para onde ia. O endereço nunca mais depende de o gateway repassá-lo.

### Nada de valor vem do cliente

Dois valores compõem o total, e **nenhum dos dois é aceito do front-end**:

**Preço dos produtos.** O carrinho envia apenas `{ productId, size, qty }`. O servidor importa o mesmo `src/data/products.js` que o site usa (verificado: é ESM puro, sem imports, exportando `CATEGORIES` e `PRODUCTS` — uma Vercel Function importa direto via caminho relativo) e recalcula tudo. Fonte de verdade única, impossível forjar preço.

Como `price` é string formatada (`"R$ 149,90"`, `"a partir de R$ 289,90"`), entra um utilitário `src/lib/price.js` com `parsePriceBRL()` → centavos, usado pelos dois lados. **Não será adicionado campo `priceCents` aos produtos**: `products.js` é escrito por um painel administrativo externo ao repositório, e exigir campo novo lá quebraria esse fluxo.

**Frete.** O front envia apenas o **identificador do serviço escolhido** (ex.: `id` do PAC). O servidor refaz a cotação no Melhor Envio com os itens reais do carrinho e usa o preço que ele mesmo recebeu. Se o valor recotado divergir do que o cliente viu (tabela do transportador mudou entre a cotação e o fechamento), o servidor devolve o total atualizado e o checkout pede confirmação antes de cobrar — nunca cobra silenciosamente um valor diferente do exibido.

### Regras de elegibilidade do carrinho

Derivadas do que `ProductBuyButton` já faz hoje:

- `badge === 'ESGOTADO'` → não entra no carrinho (segue só WhatsApp).
- Produto com `prices[]` → o preço vem do tamanho selecionado; `price` com "a partir de" nunca é usado como valor de item.
- Produto sem `buyLink`/`buyLinks`/`prices` → não entra no carrinho (segue "CONSULTAR VIA WHATSAPP").

### Integração com o Melhor Envio

**Endpoint de cotação:**

```
POST https://melhorenvio.com.br/api/v2/me/shipment/calculate          (produção)
POST https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate  (sandbox)
```

**Headers obrigatórios:** `Accept: application/json`, `Content-Type: application/json`, `Authorization: Bearer <token>` e `User-Agent` identificando a aplicação com e-mail de contato (ex.: `PetLuxo (contato@petluxostory.com.br)`) — o `User-Agent` é exigido pela API, não é opcional.

**Corpo** (dimensões em **cm**, peso em **kg**, valores em reais):

```json
{
  "from": { "postal_code": "<CEP de origem, env var>" },
  "to":   { "postal_code": "<CEP do cliente>" },
  "products": [
    { "id": "8", "width": 30, "height": 20, "length": 40,
      "weight": 1.8, "insurance_value": 289.90, "quantity": 1 }
  ]
}
```

Todos os itens do carrinho vão no mesmo array `products` — **é o Melhor Envio que faz a matemática de empacotamento**, e é exatamente por isso que carrinho misto deixa de exigir regra especial. A resposta é um array de serviços com `id`, `name`, `company.name`, `price`, `delivery_time` e, quando o serviço não atende aquele trecho, um campo `error` (esses são filtrados antes de chegar ao cliente).

**Autenticação — decisão pendente de verificação na Fase 2.** O Melhor Envio oferece dois caminhos:

- **Token gerado no painel** (Gerenciar → Tokens): simples, uma env var, sem fluxo de autorização. É o caminho preferido, já que temos **uma única conta de vendedor** e não somos uma plataforma multi-lojista.
- **OAuth 2.0 completo** (authorization code): `access_token` válido por **30 dias**, `refresh_token` por **45 dias**, exigindo rotina de renovação.

A pesquisa não confirmou de forma conclusiva se o token de painel também expira em 30 dias. **Plano de contingência já desenhado:** se expirar, os tokens passam a viver numa tabela `settings` no Neon e uma **Vercel Cron** semanal executa a renovação pelo `refresh_token`. Isso está previsto no schema e no plano de fases, então não é retrabalho — é um caminho que pode simplesmente não ser necessário.

**Sandbox:** ambiente completo e gratuito, com cadastro simplificado e R$ 10.000 de saldo fictício. Suporta Correios e Jadlog. Toda a Fase 2 é desenvolvida contra ele.

**Escopo da integração: apenas cotação.** Não compramos etiqueta nem geramos envio pela API — o envio continua manual. Consequência operacional: para o valor cobrado bater com o custo real, a dona deve comprar a etiqueta no painel do Melhor Envio (mesma cotação, mesmo preço). Se ela postar por outro caminho, o valor cotado vira uma estimativa.

**Fallback de indisponibilidade.** Se a API estiver fora do ar ou devolver erro em todos os serviços, o checkout **não trava**: cai num valor único de `SHIPPING_FALLBACK_CENTS`, com aviso de que o frete será confirmado por WhatsApp. Vender com estimativa é melhor que perder a venda.

### Peso e dimensões dos produtos

Nenhum dos 32 produtos tem esse dado hoje. Ele passa a viver em **`src/data/shipping.js`**, indexado por `id` de produto — **arquivo separado de `products.js`**, pelo mesmo motivo já estabelecido para `productDetails.js`: o painel admin externo escreve em `products.js` e qualquer reescrita dele poderia apagar dados que nós controlamos.

```js
// src/data/shipping.js
export const DEFAULT_PACKAGE = {
  weight: 2.5,   // kg
  height: 25,    // cm
  width:  30,    // cm
  length: 35,    // cm
};

export const PRODUCT_SHIPPING = {
  // [productId]: { weight, height, width, length }
  // preenchido gradualmente, um produto por vez
};
```

**Fallback conservador.** Produto sem entrada em `PRODUCT_SHIPPING` usa `DEFAULT_PACKAGE`. Os valores são deliberadamente generosos: uma estimativa alta cobra frete a mais e pode custar uma conversão; uma estimativa baixa tira dinheiro da dona em silêncio, a cada venda, sem ninguém perceber. Errar para o lado caro é o erro reversível. Os números acima são ponto de partida e devem ser revisados assim que uma dúzia de produtos estiver medida.

**Cadastro gradual, sem bloquear nada.** Exatamente como `productDetails.js` vem sendo preenchido produto a produto desde 2026-08-10, o cadastro de peso/dimensão é trabalho manual incremental. Graças ao fallback, o checkout funciona com o catálogo parcialmente preenchido desde o primeiro dia — cada produto medido só torna a cotação mais exata. **Isso não é pré-requisito bloqueante da Fase 2**, mas é dívida a quitar: enquanto o mapa estiver vazio, todo frete é uma estimativa conservadora.

Medida prática recomendada: medir a **embalagem** (caixa fechada, como vai ser postada), não o produto nu; e usar o peso real na balança, não o peso do fornecedor. Atenção ao mínimo dos Correios (16 × 11 × 2 cm) — nenhum produto pode ser cotado abaixo disso.

### Convivência entre site estático e backend

**Não muda nada na hospedagem.** Mesmo projeto Vercel, mesmo `git push` em `main`, mesmo `npm run build` publicando `dist/`. A Vercel passa a servir os arquivos estáticos **e** as funções de `/api/` no mesmo domínio, sem configuração especial.

A única mudança é criar um `vercel.json` (o projeto hoje não tem nenhum) com a rewrite de SPA **excluindo `/api/`**:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

Sem a negação `(?!api/)`, a rewrite engoliria as chamadas de API e devolveria o HTML da SPA. O hack atual do `public/404.html` (que guarda o pathname em `sessionStorage` e é restaurado em `main.jsx`) continua funcionando e pode ser mantido — a rewrite apenas o torna desnecessário.

## Estrutura de arquivos a criar

```
vercel.json                          # rewrite SPA excluindo /api/
db/schema.sql                        # DDL versionada no repositório

api/
├── _lib/
│   ├── db.js                        # cliente Neon (@neondatabase/serverless) + queries
│   ├── catalog.js                   # importa PRODUCTS, resolve item → preço em centavos
│   ├── shipping.js                  # cotação Melhor Envio + fallback + montagem do payload
│   ├── orders.js                    # criar pedido, gerar número, transições de status
│   ├── mercadopago.js               # client MP + validação de x-signature (HMAC SHA256)
│   ├── email.js                     # templates + envio via Resend
│   └── auth.js                      # verificação do token do painel admin
├── shipping/
│   └── quote.js                     # POST — CEP + itens → opções de frete
├── checkout/
│   ├── create-order.js              # POST — grava pedido "pending", devolve número + total
│   └── pay.js                       # POST — token do Brick + orderId → cobrança no MP
├── webhooks/
│   └── mercadopago.js               # POST — valida assinatura, refaz GET, atualiza, dispara e-mails
├── orders/
│   └── lookup.js                    # GET — número do pedido + e-mail (consulta do cliente)
├── admin/
│   ├── orders.js                    # GET — lista pedidos (protegido)
│   └── order-status.js              # POST — muda status / grava rastreio (protegido)
└── cron/
    └── refresh-melhorenvio-token.js # só se o token do painel expirar (contingência)

src/
├── data/
│   └── shipping.js                  # DEFAULT_PACKAGE + PRODUCT_SHIPPING (peso/dimensões)
├── cart/
│   ├── CartContext.jsx              # Context + useReducer + persistência em localStorage
│   ├── CartDrawer.jsx (+ .module.css)
│   └── useCart.js
├── lib/
│   ├── price.js                     # parsePriceBRL / formatBRL — compartilhado front+back
│   └── api.js                       # wrapper fetch das rotas /api
└── components/pages/
    ├── CartPage.jsx                 # /carrinho
    ├── CheckoutPage.jsx             # /checkout (endereço + frete + Payment Brick)
    ├── OrderConfirmationPage.jsx    # /pedido/:orderNumber
    ├── OrderLookupPage.jsx          # /meu-pedido
    └── AdminOrdersPage.jsx          # /admin
```

### Rotas novas no front

`/carrinho`, `/checkout`, `/pedido/:orderNumber`, `/meu-pedido`, `/admin` — adicionadas em `src/app/page.jsx`, seguindo o padrão já existente das páginas de política. O `MinimalNavbar` é reaproveitado no `/checkout`: um header sem links de seção nem distração é exatamente o que uma tela de pagamento quer.

### Reaproveitamento do que já existe

- **`ProductBuyButton`** e **`useProductBuy`** já centralizam a lógica de 3 estados e o tamanho selecionado, e já são compartilhados entre `ProductModal` e `ProductPage`. O botão "ADICIONAR AO CARRINHO" entra **dentro deles** — as duas telas ganham carrinho de graça, sem duplicação.
- `ProductSizeSelector` já resolve a escolha de tamanho; o carrinho só consome `selectedSize`.
- `Accordion` serve para o resumo do pedido recolhível no mobile.
- Padrão de CSS Modules por componente e tokens de `variables.css` — nenhum framework de UI novo.
- O Payment Brick entra por `React.lazy`, mesmo padrão do `ProductLightbox`: quem só navega no catálogo não baixa o SDK de pagamento.

## Schema do banco de dados

```sql
CREATE TABLE orders (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number              text UNIQUE NOT NULL,        -- ex. "PL-2026-0001"
  status                    text NOT NULL DEFAULT 'pending',
    -- pending | paid | shipped | delivered | cancelled | failed

  -- cliente
  customer_name             text NOT NULL,
  customer_email            text NOT NULL,
  customer_phone            text,
  customer_doc              text,                        -- CPF

  -- endereço de entrega
  ship_cep                  text NOT NULL,
  ship_street               text NOT NULL,
  ship_number               text NOT NULL,
  ship_complement           text,
  ship_district             text NOT NULL,
  ship_city                 text NOT NULL,
  ship_state                text NOT NULL,

  -- valores (sempre em centavos, sempre calculados no servidor)
  items_subtotal_cents      integer NOT NULL,
  shipping_cents            integer NOT NULL,            -- vindo da cotação real
  total_cents               integer NOT NULL,

  -- frete cotado
  shipping_carrier          text,                        -- "Correios", "Jadlog"
  shipping_service_name     text,                        -- "PAC", "SEDEX", ".Package"
  shipping_service_id       text,                        -- id do serviço no Melhor Envio
  shipping_delivery_days    integer,
  shipping_quoted_at        timestamptz,
  shipping_quote_raw        jsonb,                       -- resposta bruta, para auditoria
  shipping_is_fallback      boolean NOT NULL DEFAULT false,

  -- pagamento
  payment_provider          text,                        -- "mercadopago"
  payment_id                text,
  payment_method            text,                        -- "pix" | "credit_card"
  payment_status            text,

  -- operação (preenchido manualmente pela dona)
  tracking_code             text,
  notes                     text,

  confirmation_email_sent_at timestamptz,                -- trava de idempotência
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now(),
  paid_at                   timestamptz
);

CREATE TABLE order_items (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id        integer NOT NULL,
  product_name      text NOT NULL,        -- SNAPSHOT
  size              text,                 -- SNAPSHOT
  unit_price_cents  integer NOT NULL,     -- SNAPSHOT
  qty               integer NOT NULL,
  line_total_cents  integer NOT NULL
);

-- só se o token do Melhor Envio exigir rotação (contingência)
CREATE TABLE settings (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_email      ON orders(lower(customer_email));
CREATE INDEX idx_orders_payment_id ON orders(payment_id);
```

**Por que snapshot em `order_items`:** nome e preço são **copiados**, não referenciados. O `products.js` muda com frequência (inclusive por um painel externo), e um pedido de três meses atrás tem que continuar contando a verdade do dia da compra. Mesma lógica vale para `shipping_quote_raw`: guardar a resposta bruta do Melhor Envio é o que permite, meses depois, explicar por que aquele pedido cobrou aquele valor.

Não existe campo `shipping_tier` nem qualquer resquício de faixa fixa de frete — a decisão de duas taxas foi revertida antes de qualquer implementação.

## Dependências novas

| Pacote | Lado | Para quê |
|---|---|---|
| `mercadopago` | backend | SDK oficial Node — pagamentos e consulta |
| `@mercadopago/sdk-react` | frontend | Payment Brick (cartão + PIX embutidos) |
| `@neondatabase/serverless` | backend | driver Postgres para ambiente serverless |
| `resend` | backend | e-mail transacional |

O Melhor Envio **não ganha dependência**: a integração é uma chamada `fetch` para um endpoint REST, e as SDKs JavaScript existentes são não-oficiais. Não vale adicionar dependência de terceiros para montar um JSON e fazer um POST.

## Serviços externos a contratar/configurar

1. **Mercado Pago** — conta (CPF serve), credenciais de teste **e** de produção, webhook apontando para `https://petluxostory.com.br/api/webhooks/mercadopago`, e o *secret* de assinatura.
2. **Melhor Envio** — conta sandbox (cadastro simplificado, para desenvolvimento) e conta real (produção). Token gerado no painel em Gerenciar → Tokens.
3. **Neon** — `vercel integration add neon` (env vars entram sozinhas).
4. **Resend** — `vercel integration add resend/resend-email` + verificação DNS do domínio.
5. **Vercel Pro** — apenas na Fase 6, ver Riscos.

## Variáveis de ambiente

| Variável | Escopo | Observação |
|---|---|---|
| `MP_ACCESS_TOKEN` | **servidor** | **jamais** com prefixo `VITE_` — autoriza cobranças |
| `MP_WEBHOOK_SECRET` | servidor | validação do `x-signature` |
| `VITE_MP_PUBLIC_KEY` | cliente | pública por natureza, só tokeniza cartão |
| `DATABASE_URL` | servidor | injetada pela integração Neon |
| `RESEND_API_KEY` | servidor | injetada pela integração Resend |
| `MELHORENVIO_TOKEN` | servidor | token do painel do Melhor Envio |
| `MELHORENVIO_BASE_URL` | servidor | alterna sandbox ↔ produção sem mudar código |
| `MELHORENVIO_USER_AGENT` | servidor | ex. `PetLuxo (contato@petluxostory.com.br)` — exigido pela API |
| `SHIP_FROM_CEP` | servidor | CEP de origem das postagens |
| `SHIPPING_FALLBACK_CENTS` | servidor | frete usado se a cotação falhar |
| `OWNER_EMAIL` | servidor | destino do e-mail de aviso da dona |
| `ADMIN_TOKEN` | servidor | senha do painel `/admin` |

`VITE_WHATSAPP_PHONE` (já existente) permanece inalterada.

## Riscos e trade-offs

**Cadastro de peso e dimensões é dívida aberta.** Enquanto `PRODUCT_SHIPPING` estiver vazio, todo frete sai do `DEFAULT_PACKAGE` — conservador, portanto provavelmente mais caro que o real. Não bloqueia nada, mas cada produto não medido é uma conversão potencialmente perdida. Trabalho manual, gradual, produto a produto, sem prazo bloqueante.

**Plano Hobby da Vercel proíbe uso comercial — mas isso não bloqueia o início.** Desenvolvimento local, credenciais *sandbox* do Mercado Pago e do Melhor Envio, e preview deployments não constituem site comercial processando pagamento real. A migração para o **Pro (~US$ 20/mês)** é dependência da **Fase 6**, a ser feita pouco antes de trocar as credenciais de teste pelas de produção. Nada a fazer a respeito nas Fases 0 a 5.

**Expiração do token do Melhor Envio.** Se o token de painel expirar em 30 dias como o de OAuth, o frete para de funcionar silenciosamente numa madrugada qualquer. Mitigações previstas: verificar isso explicitamente na Fase 2; o fallback de indisponibilidade garante que o checkout continua vendendo mesmo com o token morto; e a tabela `settings` + Vercel Cron já estão desenhadas caso a rotação seja necessária.

**Cotação não é compra de etiqueta.** Só usamos o endpoint de cotação; o envio continua manual. Se a dona postar por um canal diferente do cotado, o valor cobrado do cliente vira estimativa. Mitigação operacional: comprar a etiqueta no próprio painel do Melhor Envio.

**Corrida entre a resposta de `/api/checkout/pay` e o webhook.** Os dois podem tentar marcar `paid`. Mitigação: transições idempotentes (`UPDATE ... WHERE status <> 'paid'`) e `confirmation_email_sent_at` como trava do envio de e-mail.

**Webhook não é confiável por si só.** Nunca acreditar no corpo da notificação: validar o HMAC e **refazer um GET no Mercado Pago** pelo `payment_id` antes de mudar qualquer status.

**PIX é assíncrono.** O cliente pode fechar o site depois de ver o QR Code. O pedido fica `pending` e só o webhook confirma — por isso o e-mail de confirmação sai do webhook, e não da resposta HTTP.

**PCI.** Com o Payment Brick, cartão nunca passa pelo nosso servidor (escopo SAQ-A). Isso só se mantém se **nada** de dado de cartão for logado — regra a respeitar em todas as funções.

**LGPD.** Passamos a armazenar dados pessoais (nome, CPF, endereço, e-mail, telefone). A `PrivacyPage` precisa ser atualizada. A `ShippingPolicyPage` hoje afirma que "o valor do frete é calculado automaticamente pelo PagBank" — passa a estar errada.

**Nota fiscal e obrigações fiscais** estão fora do escopo desta arquitetura, mas viram tema real quando o site cobra direto.

**Convivência com os `buyLink` antigos.** Durante a transição os dois caminhos coexistem. Só ao final da Fase 3 o carrinho vira o fluxo principal — e aí `buyLink`/`buyLinks` viram legado: continuam em `products.js` (o painel admin externo os escreve), mas deixam de ser usados no checkout.

## Plano de fases

Cada fase é deployável e reversível sozinha. **Nada quebra o site atual até a Fase 3.**

### Fase 0 — Fundação (sem mudança visível)
- `src/lib/price.js` com `parsePriceBRL()` / `formatBRL()`.
- `vercel.json` com a rewrite de SPA excluindo `/api/`.
- `api/health.js` — função mínima só para provar a convivência estático + backend.

**Validação:** `npm run build` passa; `/api/health` responde em um deployment de preview; todas as rotas existentes continuam funcionando (deep link em `/produto/8`, páginas de política, 404).

### Fase 1 — Carrinho front-end puro (sem backend, sem pagamento)
- `CartContext` + `useCart` + persistência em `localStorage`.
- `CartDrawer` e página `/carrinho`, com badge de contagem na `Navbar`.
- "ADICIONAR AO CARRINHO" dentro de `ProductBuyButton` — chega junto em `ProductModal` e `ProductPage`.
- "COMPRAR AGORA" continua indo para o PagBank: **nenhuma venda é interrompida**.

**Validação:** adicionar tamanhos diferentes do mesmo produto e recarregar a página (carrinho sobrevive); confirmar que ESGOTADO e produtos só-WhatsApp não entram; `npm run build` sem inchar o bundle principal; Playwright cobrindo `ProductPage` e `ProductModal`, que passam pelo mesmo botão.

### Fase 2 — Banco, pedido persistido e frete real
Fase mais pesada do plano; feita em duas etapas.

**2A — Persistência**
- Provisionar Neon, aplicar `db/schema.sql`.
- `/checkout` com formulário de endereço e dados do cliente.
- `POST /api/checkout/create-order` grava o pedido `pending`.

**2B — Frete**
- Conta sandbox do Melhor Envio, token, `POST /api/shipping/quote`.
- `src/data/shipping.js` com `DEFAULT_PACKAGE`; início do cadastro real, produto a produto.
- Seleção de serviço na `CheckoutPage` (preço + prazo) e recotação server-side no `create-order`.
- Verificar se o token do painel expira; se sim, implementar `settings` + Vercel Cron.

Ao final, o cliente é mandado para o link PagBank existente. **O bug do endereço já está resolvido aqui** — o endereço passa a estar no nosso banco antes do Mercado Pago sequer entrar em cena.

**Validação:** `vercel dev` roda Vite e funções juntos, com `vercel env pull`. Forjar preço **e** valor de frete no payload e confirmar que o total gravado vem do servidor. Conferir no Neon que o pedido existe com endereço completo **antes** de qualquer pagamento — é o teste que prova a correção do bug original. Cotação com carrinho misto (item pequeno + volumoso) devolve um valor só, coerente. CEP inválido e API fora do ar caem no fallback sem travar o checkout.

### Fase 3 — Pagamento pelo Mercado Pago
- Payment Brick (cartão + PIX) na `CheckoutPage`, carregado por `React.lazy`.
- `POST /api/checkout/pay` e `POST /api/webhooks/mercadopago`.
- `/pedido/:orderNumber` com o estado do pagamento, incluindo tela de QR Code do PIX.
- Os `buyLink` do PagBank deixam de ser o caminho de compra.

**Validação:** cartões de teste do Mercado Pago para aprovado / recusado / pendente; PIX de teste até o QR Code; **simulador de notificações** do painel do Mercado Pago contra um deployment de preview (webhook não chega em `localhost`); assinatura inválida rejeitada com 401; webhook duplicado não regride status nem duplica e-mail.

### Fase 4 — E-mails transacionais
- Resend provisionado, domínio verificado por DNS.
- Dois templates: confirmação para o cliente; aviso para a dona com **endereço completo, itens, frete escolhido e `supplierLink`** de cada produto.
- Disparados pelo webhook na transição para `paid`, com trava de idempotência.

**Validação:** e-mail de teste para os dois destinatários, conferindo que o da dona traz endereço completo e o serviço de frete escolhido; webhook duplicado não envia dois e-mails.

### Fase 5 — Painel da dona e consulta do cliente
- `/admin` protegido por `ADMIN_TOKEN`: lista de pedidos, detalhe, mudança de status e campo de código de rastreio.
- `/meu-pedido`: número do pedido + e-mail, com rate limit e sem enumeração de dados.
- Atualizar `PrivacyPage` (LGPD) e `ShippingPolicyPage` (frete não é mais do PagBank).

**Validação:** `/admin` sem token → 401, com token → lista; `/meu-pedido` com e-mail errado não revela nada do pedido; mudança de status persiste e aparece na consulta do cliente.

### Fase 6 — Virada para produção
Nada aqui bloqueia o início do projeto; é a checklist do dia em que o site passa a cobrar de verdade.
- **Migrar o projeto Vercel de Hobby para Pro** — pré-requisito de uso comercial.
- Trocar as credenciais de teste do Mercado Pago pelas de produção e reapontar o webhook para o domínio de produção.
- Trocar `MELHORENVIO_BASE_URL` e o token para produção; confirmar que os serviços cotados batem com os que a dona realmente usa.
- Primeira compra real de ponta a ponta, com valor baixo, conferindo pedido no banco, e-mails e painel.

## Referências

- [Vercel Functions — quickstart](https://vercel.com/docs/functions/quickstart) · [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [SDK Node do Mercado Pago](https://github.com/mercadopago/sdk-nodejs) · [Payment Bricks — exemplo Node](https://github.com/mercadopago/payment-bricks-sample-node) · [Validação de webhooks (x-signature)](https://www.mercadopago.com.br/developers/en/news/2024/02/27/Ensure-the-validity-of-notifications-sent-by-Mercado-Pago)
- [Melhor Envio — introdução à API](https://docs.melhorenvio.com.br/reference/introducao-api-melhor-envio) · [autenticação](https://docs.melhorenvio.com.br/docs/autenticacao-1) · [cotação de fretes](https://docs.melhorenvio.com.br/docs/cotacao-de-fretes)
- [Correios — manual da API Preço](https://www.correios.com.br/atendimento/developers/manuais/manual-api-preco-1) (contexto do encerramento das APIs abertas)
- Decisões relacionadas neste repositório: [`PRODUCT_EXPANSION.md`](PRODUCT_EXPANSION.md) (precedente de arquivo de dados separado de `products.js`), [`DEPLOY.md`](DEPLOY.md)
