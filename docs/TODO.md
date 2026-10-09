# PetLuxo — TODO

Lista consolidada de melhorias. **Não mexer** (decisões intencionais, não pendências):

- `HIDE_BUY_CTA` em `ProductBuyButton.jsx`: o CTA do PagBank fica oculto de propósito, para o dinheiro cair na hora e o pedido ser feito ao fornecedor. O checkout próprio é um plano futuro.
- Os textos que citam o PagBank (FAQ, Footer, políticas): descrevem o fluxo pretendido e voltam a ficar corretos quando o CTA for religado.

Legenda de esforço: 🟢 minutos · 🟡 algumas horas · 🔴 projeto maior

---

## Quick wins e correções imediatas

- [ ] **4. Conferir o plano da Vercel** 🟢 **(urgente)**
      O projeto é uma loja, ou seja, uso comercial. Verificar nos termos e na documentação atuais da Vercel se o plano Hobby permite isso; pelas condições vigentes, uso comercial é direcionado aos planos Pro ou Enterprise. Decidir o plano antes de qualquer outra mudança de infraestrutura.

- [x] **15. Corrigir `buyLink` do id 31** 🟢
      Tem espaço no final: `'https://pag.ae/81QtMgE9m '`.

- [x] **16. Padronizar badges** 🟢
      `NOVO`, `Novo` e `Novidade` → um único valor.

- [x] **17. Completar `SPEC_LABELS` do id 12** 🟢
      Adicionar `fonteEnergia`, `comprimentoTotal`, `larguraTotal` e `areaInterna` em `ProductPage.jsx`. Hoje aparecem cruas e grudadas em maiúsculas.

- [ ] **19. Atualizar `docs/PRODUCT_EXPANSION.md`** 🟢
      O documento descreve 9 campos; o código tem 10 (falta `sizeGuideNote`).

- [ ] **20. Decidir sobre o campo `order`** 🟢
      Não é usado na ordenação (a exibição usa `categoryOrder`). Antes de remover, confirmar que o painel administrativo externo não depende dele.

- [ ] **9. Melhorar título e descrição da home** 🟢
      Título mais específico, com palavras-chave (ex.: "camas de luxo para cachorro", "coleiras de couro"). Descrição concisa, idealmente entre 150 e 160 caracteres, com a mensagem principal no início (hoje ~170). Esse tamanho é referência editorial: o Google pode gerar outro snippet conforme a busca.

- [ ] **11. Padronizar o nome da marca** 🟢
      Domínio "petluxostory" vs. marca "PetLuxo". Decidir o nome canônico e alinhar título, Open Graph e textos.

- [ ] **14. Criar a validação do catálogo no build** 🟡
      Script que falhe o build para evitar regressões, já que o push em `main` vai direto para produção e o painel externo reescreve `products.js`. Verificar:
  - links vazios, com espaço ou malformados;
  - IDs duplicados e categorias inexistentes em `CATEGORIES`;
  - `buyLinks` inconsistentes com `prices` (mesmos tamanhos);
  - badges fora do padrão;
  - imagens referenciadas que não existem em `public/images/products/`.

  Respeitar as exceções legítimas do catálogo (ex.: ids 9 e 17 têm `buyLinks` sem `prices`; ids 3, 4 e 10 não têm `shortName`/`subtitle`). A validação não deve exigir que todos os produtos tenham os mesmos campos.

---

## Próximas entregas

- [ ] **5. Mensagem do WhatsApp por produto** 🟡
      Hoje a mensagem é idêntica em todos os produtos. Incluir variação selecionada (tamanho/cor), preço e link `/produto/:id`. O `useProductBuy` já calcula `selectedSize`, `activeBuyLink` e `activePrice`; falta passar para o `wa()` em `ProductBuyButton`.

- [ ] **13. Privacidade e consentimento do GA4 (LGPD)** 🟡
      Definir a base legal e o mecanismo de consentimento aplicável ao GA4; impedir o carregamento do `gtag.js` antes da autorização quando exigida pela estratégia adotada; revisar a política de privacidade. A implementação (banner ou outro mecanismo) decorre dessa análise.

- [ ] **6. Eventos do GA4 para clique no WhatsApp** 🟡
      **Depende do item 13.** O evento deve identificar produto e origem do clique (FAB, Navbar, Featured, Footer, ficha), sem enviar dados pessoais em parâmetros ou URL, e respeitar o consentimento adotado.

- [ ] **1. Rotas de produto e tratamento de 404** 🟡
      Hoje as rotas dependem de `public/404.html` (redireciona via JavaScript) e de `main.jsx`. Verificar e documentar o comportamento real de `/produto/:id` em acesso direto (status HTTP recebido, e como Google e apps de mensagem tratam) antes de presumir a causa.

  Um _rewrite_ para `/index.html` no `vercel.json` pode resolver o carregamento direto, mas também faz URLs inexistentes devolverem a home com status 200 (soft 404).

  Critérios de conclusão:
  - acesso direto a `/produto/:id` de produto visível carrega a ficha;
  - produto inexistente ou `visible: false` e rotas inválidas são tratados como inexistentes, com o status adequado;
  - o status HTTP foi validado no deploy de preview.

  Não remover `public/404.html` nem a restauração de path em `main.jsx` antes de validar a nova configuração.

- [ ] **2. Meta tags por produto** 🔴
      `/produto/:id` herda título, descrição e imagem da home. Resolver com pré-renderização das rotas de produto ou com uma função na Vercel; escolher pelo resultado real, não pela sofisticação.

  Critérios de aceite:
  - cada produto gera título, descrição, URL canônica e imagem próprios;
  - o HTML inicial contém os metadados (crawlers sociais não executam JavaScript);
  - produtos inexistentes ou ocultos são tratados como inexistentes, não como fichas válidas;
  - a solução não exige backend permanente se a pré-renderização atender ao catálogo.

- [ ] **3 e 18. Remover e corrigir `supplierLink`** 🟡
      O `products.js` inteiro vai para o navegador, então a origem dos produtos fica legível nas ferramentas de desenvolvedor. Esses links não são necessários para o cliente comprar.
  - Remover `supplierLink` do catálogo público e mantê-lo apenas em fonte administrativa privada, com acesso restrito (mover para um arquivo fora do Git não basta se o painel ou o navegador continuar recebendo o conteúdo).
  - Ajustar o painel administrativo externo, que reescreve `products.js`.
  - Ao migrar, corrigir os ids 9 (aponta para `kit-milano-camelo`, nome antigo) e 17 (aponta para um comedouro dobrável que não corresponde ao produto).

---

## Conteúdo e vendas

- [ ] **7. Prazo estimado de entrega nas fichas** 🟡
      Informar com clareza as condições de entrega (fornecedor + frete), parte de apresentar a oferta com informação clara ao consumidor. O schema de `productDetails.js` não tem campo dedicado: criar `deliveryNote` (e renderizar no `ProductPage`) ou, provisoriamente, usar `faq`/`warranty`. O campo é uma decisão de implementação, não a obrigação em si.

- [ ] **8. Completar fichas dos produtos sem `PRODUCT_DETAILS`** 🔴
      17 dos 37 produtos abrem só o modal rápido. Priorizar os mais vendidos e de ticket mais alto. Medidas, cuidados e FAQ são as dúvidas que mais travam a compra.

- [ ] **10. Dados estruturados e sitemap** 🟡
      JSON-LD `Product` nas fichas e URLs dos produtos visíveis em `public/sitemap.xml`. Faz mais sentido depois do item 2.

---

## Acessibilidade

- [ ] **12. Corrigir o bloqueio de pinch-zoom** 🟡
      Correção de acessibilidade, não ajuste visual. `touch-action: pan-x pan-y` + eventos `gesture*` + reset do viewport impedem o redimensionamento que a WCAG 1.4.4 prevê (texto até 200% sem perda de conteúdo ou funcionalidade). O `font-size: 16px` nos inputs já evita o zoom automático do iOS; avaliar se o bloqueio total ainda se justifica.

---

## Quando for implementar o checkout próprio

- [ ] **21. Conferir regras de liberação de saldo do gateway** 🟢
      Verificar prazo de recebimento por forma de pagamento antes de escolher o gateway (`docs/CHECKOUT_ARCHITECTURE.md` cita Mercado Pago), para não repetir o problema de caixa do modelo de compra sob encomenda ao fornecedor.
