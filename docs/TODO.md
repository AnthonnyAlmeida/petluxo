# PetLuxo — TODO

Lista consolidada de melhorias. **Não mexer** (decisões intencionais, não pendências):

- `HIDE_BUY_CTA` em `ProductBuyButton.jsx`: o CTA "COMPRAR AGORA" fica oculto de propósito; o atendimento é só por WhatsApp. O checkout próprio é um plano futuro.

Legenda de esforço: 🟢 minutos · 🟡 algumas horas · 🔴 projeto maior

---

## Quick wins e correções imediatas

- [ ] **4. Conferir o plano da Vercel** 🟢 **(urgente)**
      O projeto é uma loja, ou seja, uso comercial. Verificar nos termos e na documentação atuais da Vercel se o plano Hobby permite isso; pelas condições vigentes, uso comercial é direcionado aos planos Pro ou Enterprise. Decidir o plano antes de qualquer outra mudança de infraestrutura. Depende deste item: privatizar o repositório (item 23) e o checkout próprio.

- [x] **15. Corrigir `buyLink` do id 31** 🟢
      Tem espaço no final: `'https://pag.ae/81QtMgE9m '`.

- [x] **16. Padronizar badges** 🟢
      `NOVO`, `Novo` e `Novidade` → um único valor.

- [x] **17. Completar `SPEC_LABELS` do id 12** 🟢
      Adicionar `fonteEnergia`, `comprimentoTotal`, `larguraTotal` e `areaInterna` em `ProductPage.jsx`. Hoje aparecem cruas e grudadas em maiúsculas.

- [x] **19. Atualizar `docs/PRODUCT_EXPANSION.md`** 🟢
      O documento descreve 9 campos; o código tem 10 (falta `sizeGuideNote`).

- [x] **20. Campo `order` mantido no catálogo** 🟢
      O painel administrativo externo (`petluxo-admin`) usa `order` para ordenar a listagem de produtos (`ProductsPage.jsx`) e calcular o próximo valor a partir do maior existente (`AdminPage.jsx`). O serializador preserva o campo ao publicar `products.js`. O frontend não o usa (a ordenação de exibição é via `categoryOrder`), mas a remoção quebraria o fluxo do painel. Decisão: manter enquanto o painel depender dele.

- [x] **9. Melhorar título e descrição da home** 🟢
      Título: "PetLuxo — Camas de luxo, coleiras de couro e acessórios premium" (63 chars). Meta description: "PetLuxo: camas de luxo, coleiras de couro e acessórios premium para cães e gatos. Design sofisticado, materiais nobres. Compre via WhatsApp." (140 chars). Open Graph e Twitter Card atualizados consistentemente.

- [x] **11. Padronizar o nome da marca** 🟢
      Decisão: marca oficial é **PetLuxo**; domínio permanece **petluxostory.com.br**. Não há necessidade de alinhar domínio ao nome comercial. Configuração atual mantida sem alterações no site, metadados, textos, URLs ou domínio.

- [x] **14. Criar a validação do catálogo no build** 🟡
      Script `scripts/validate-catalog.js` integrado ao `npm run build`. Valida: links (vazios, espaços, malformados), IDs duplicados, categorias inválidas, consistência prices/buyLinks (respeitando exceções IDs 9 e 17), badges contra padrão oficial (MAIS VENDIDOS, PREMIUM, NOVO, EXCLUSIVO, ESGOTADO), existência de imagens em `public/images/products/`. Exceções legítimas preservadas (IDs 3, 4, 10 sem shortName obrigatório). Build falha com código != 0 se houver erros.

---

## Próximas entregas

- [x] **5. Mensagem do WhatsApp por produto** 🟢
      Mensagem dinâmica que inclui nome do produto, variação selecionada (tamanho/cor) quando aplicável, preço correspondente à seleção atual (usando preço ativo e fallback para preço padrão do produto) e link absoluto para a página do produto (/produto/:id). Implementado em `ProductBuyButton.jsx` recebendo `selectedSize` e `activePrice` do hook `useProductBuy` via props, evitando recálculo desnecessário e formatando variação sem duplicação (ex: "Tamanho: M").

- [x] **13. Privacidade e consentimento do GA4 (LGPD)** 🟡
      Definir a base legal e o mecanismo de consentimento aplicável ao GA4; impedir o carregamento do `gtag.js` antes da autorização quando exigida pela estratégia adotada; revisar a política de privacidade. A implementação (banner ou outro mecanismo) decorre dessa análise.

- [ ] **6. Eventos do GA4 para clique no WhatsApp** 🟡
      Desbloqueado: o item 13 está concluído. O evento deve identificar produto e origem do clique (Navbar, Featured, CTA, FAQ, Footer, busca sem resultado em `Products.jsx`, ficha e modal de produto via `ProductBuyButton`), sem enviar dados pessoais em parâmetros ou URL, e respeitar o consentimento adotado.

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
      17 dos 37 produtos não têm entrada em `PRODUCT_DETAILS` (ids 1, 3, 4, 13, 14, 15, 18, 19, 22, 24, 25, 27, 29, 30, 31, 32, 33). Dos 28 visíveis, 9 estão sem ficha e abrem só o modal rápido: ids 1, 14, 15, 18, 24, 25, 30, 31, 33 (os outros 8 sem ficha estão ocultos). Priorizar os mais vendidos e de ticket mais alto. Medidas, cuidados e FAQ são as dúvidas que mais travam a compra.

- [ ] **10. Dados estruturados e sitemap** 🟡
      JSON-LD `Product` nas fichas e URLs dos produtos visíveis em `public/sitemap.xml`. Faz mais sentido depois do item 2.

---

## Acessibilidade

- [ ] **12. Corrigir o bloqueio de pinch-zoom** 🟡
      Correção de acessibilidade, não ajuste visual. `touch-action: pan-x pan-y` + eventos `gesture*` + reset do viewport impedem o redimensionamento que a WCAG 1.4.4 prevê (texto até 200% sem perda de conteúdo ou funcionalidade). O `font-size: 16px` nos inputs já evita o zoom automático do iOS; avaliar se o bloqueio total ainda se justifica.

---

## Quando for implementar o checkout próprio

- [ ] **21. Conferir regras de liberação de saldo do gateway** 🟢
      Verificar prazo de recebimento por forma de pagamento antes de escolher o gateway (a intenção é a InfinitePay; `docs/CHECKOUT_ARCHITECTURE.md` ainda cita Mercado Pago), para não repetir o problema de caixa do modelo de compra sob encomenda ao fornecedor.
      A confirmar com a InfinitePay: se o checkout integrado aceita débito; taxas do cartão à vista e parcelado; custo e condições do recebimento na hora (há relatos de plano com permanência mínima); prazo de liberação por forma de pagamento.

- [ ] **22. Alinhar os textos que citam o PagBank ao atendimento por WhatsApp** 🟡
      Os links do PagBank provavelmente não voltam (`docs/DECISIONS.md` §12). Hoje citam o PagBank como gateway ativo: `src/components/sections/FAQ.jsx:39`; `src/components/layout/Footer.jsx:63` e `:68`; `src/components/pages/PrivacyPage.jsx:48`, `:58`, `:64` e `:84`; `src/components/pages/ShippingPolicyPage.jsx:60`; `src/components/pages/TermsPage.jsx:87`. A nova redação depende de decisão do dono; não escrever a redação neste item.

- [ ] **23. Decidir sobre privatizar o repositório** 🟡
      Pré-requisitos: item 4; corrigir as miniaturas do painel `petluxo-admin` que usam `raw.githubusercontent.com` (`ProductsPage.jsx:351` e `CategoriesPage.jsx:399` e, no modo edição, `Step3Photo.jsx:21`); testar um commit do painel com o repositório privado (autor do commit e deploy da Vercel); conferir o escopo do token. A documentação do projeto (`README.md`, `docs/DEPLOY.md`, `docs/DECISIONS.md` §8) afirma que o repositório deve ser público; isso não foi verificado na conta.

- [ ] **24. Conferir PNG com extensão `.webp` nas fotos de galeria** 🟢
      Rodar `file public/images/products/*/*.webp | grep PNG` e verificar no painel (`petluxo-admin/src/lib/imageConverter.js`) como as fotos são convertidas, para evitar que o problema volte a cada produto novo. Causa não verificada.

- [ ] **25. Rotacionar periodicamente o token de acesso do painel ao GitHub** 🟢
      O token atual (fine-grained, só o repositório `petluxo`, permissão Contents em leitura e escrita) não tem vencimento. Definir uma rotina de troca (sugestão: a cada 6 a 12 meses). Última troca: 2026-10-26. Não registrar o valor do token em nenhum arquivo.

- [ ] **26. Reescrever `docs/CHECKOUT_ARCHITECTURE.md` para InfinitePay com frete grátis** 🟡
      Saem Mercado Pago e Melhor Envio. Continuam servidor (funções) e banco. Pagamento por redirecionamento para checkout hospedado. Confirmação de pagamento pela API (retorno ao site e webhook não bastam como prova). Débito a confirmar.

- [ ] **27. Resíduos de código de baixa prioridade** 🟢 - A exceção de `shortName` para os ids 3, 4 e 10 em `scripts/validate-catalog.js` não é mais necessária: todos os 37 produtos têm `shortName`. - `:global(.price)` em `ProductModal.module.css:66` está fora da lista permitida em `docs/CSS_MIGRATION.md`. - `<a href="/">` na Navbar (`Navbar.jsx:30`) recarrega a página; trocar por `Link` mudaria o comportamento do clique no logo na home, então avaliar antes.

---

## Concluídos recentemente

- [x] Limpeza de dados e código morto (2026-10-26)
- [x] Fotos de produto convertidas para WebP de verdade e arquivo solto organizado (2026-10-26)
- [x] og-image em JPEG 1200×630 com tags de tamanho (2026-10-26)
- [x] Troca do token de acesso do painel (2026-10-26)
- [x] Sincronização dos READMEs e docs (2026-10-26)
