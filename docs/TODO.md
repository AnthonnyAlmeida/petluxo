# PetLuxo — TODO

Lista consolidada de melhorias. **Não mexer** (decisões intencionais, não pendências):

- `HIDE_BUY_CTA` em `ProductBuyButton.jsx`: o CTA "COMPRAR AGORA" fica oculto de propósito; o atendimento é só por WhatsApp. O checkout próprio é um plano futuro.

Legenda de esforço: 🟢 minutos · 🟡 algumas horas · 🔴 projeto maior

---

## Quick wins e correções imediatas

- [x] **4. Conferir o plano da Vercel** 🟢
      Resolvido para o SITE: migrado para a Cloudflare em 2026-10-28 (`docs/DECISIONS.md` §13). A questão do plano da Vercel para o PAINEL ADMIN ficou no item 32.

- [x] **15. Corrigir `buyLink` do id 31** 🟢
      Tem espaço no final: `'https://pag.ae/81QtMgE9m '`.

- [x] **16. Padronizar badges** 🟢
      `NOVO`, `Novo` e `Novidade` → um único valor.

- [x] **17. Completar `SPEC_LABELS` do id 12** 🟢
      Adicionar `fonteEnergia`, `comprimentoTotal`, `larguraTotal` e `areaInterna` em `src/data/specLabels.js`. Hoje aparecem cruas e grudadas em maiúsculas.

- [x] **19. Atualizar `docs/PRODUCT_EXPANSION.md`** 🟢
      O documento descreve 9 campos; o código tem 10 (falta `sizeGuideNote`).

- [x] **20. Campo `order` mantido no catálogo** 🟢
      O painel administrativo externo (`petluxo-admin`) usa `order` para ordenar a listagem de produtos (`ProductsPage.jsx`) e calcular o próximo valor a partir do maior existente (`AdminPage.jsx`). O serializador preserva o campo ao publicar `products.js`. O frontend não o usa (a ordenação de exibição é via `categoryOrder`), mas a remoção quebraria o fluxo do painel. Decisão: manter enquanto o painel depender dele.

- [x] **9. Melhorar título e descrição da home** 🟢
      Título: "PetLuxo — Camas, coleiras de couro e acessórios premium" (55 chars). Meta description: "PetLuxo: camas de luxo, coleiras de couro e acessórios premium para cães e gatos. Design sofisticado, materiais nobres. Compre via WhatsApp." (140 chars). Open Graph e Twitter Card atualizados consistentemente.

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
      Desbloqueado: o item 13 está concluído. O evento deve identificar produto e origem do clique (Navbar, Featured, CTA, FAQ, Footer, busca sem resultado em `Products.jsx` e no mobile, ficha de produto via `ProductBuyButton` e o botão do mobile), sem enviar dados pessoais em parâmetros ou URL, e respeitar o consentimento adotado.

- [ ] **1. Rotas de produto e tratamento de 404** 🟡
      As rotas dependem do fallback de SPA do Worker (`public/404.html` e a restauração em `main.jsx` foram removidos). Verificar e documentar o comportamento real de `/produto/:id` em acesso direto (status HTTP recebido, e como Google e apps de mensagem tratam) antes de presumir a causa.

  O fallback de SPA do Worker (`not_found_handling`) resolve o carregamento direto, mas também faz URLs inexistentes devolverem o app com status 200 (soft 404).

  Estado atual: `/produto/*` passa pelo Worker (`worker/index.js`): produto inexistente, oculto ou formato inválido devolve o shell com HTTP 404 e `noindex`; produto visível carrega a ficha (200). Falta: o soft 404 continua fora de `/produto/*` (qualquer outra URL inexistente devolve 200 com o `NotFound` do app, sem `noindex`), porque o fallback de SPA do Worker de assets responde antes. Status validado no domínio real em 2026-11-17 por `curl` (item 2).

  Critérios de conclusão:
  - acesso direto a `/produto/:id` de produto visível carrega a ficha;
  - produto inexistente ou `visible: false` e rotas inválidas são tratados como inexistentes, com o status adequado;
  - o status HTTP foi validado no deploy de preview.

- [ ] **2. Meta tags por produto** 🟡
      Feito e validado em produção em 2026-11-17 por `curl`: `/produto/44` devolve título, canonical e `og:image` próprios; produto oculto ou inexistente devolve 404 + `noindex`; formatos alternativos da URL recebem 301; o sitemap tem 29 URLs. A prévia do WhatsApp de `/produto/44` foi validada (foto, título e descrição), então o `og:image` em WebP vertical funciona e o JPG 1200×630 por produto não é mais pendência. A descrição é o início de `description`, cortado no fim de frase dentro de 155 caracteres (se o trecho tiver ao menos 60 caracteres; senão, corte por palavra com "…"). Pendências: (a) soft 404 fora de `/produto/*` (item 1); (b) em navegação interna (clique de card) o `<title>` não muda, porque só o HTML inicial é reescrito; (c) as políticas herdam title/description da home. `/produtos` tem título, descrição e canonical próprios e `/buscar` tem `noindex`, ambos definidos no cliente (`useDocumentHead`); como o Worker não reescreve essas rotas, só quem executa JavaScript os vê.

  Critérios de aceite:
  - cada produto gera título, descrição, URL canônica e imagem próprios;
  - o HTML inicial contém os metadados (crawlers sociais não executam JavaScript);
  - produtos inexistentes ou ocultos são tratados como inexistentes, não como fichas válidas;
  - a solução não exige backend permanente se a pré-renderização atender ao catálogo.

- [ ] **3 e 18. Remover e corrigir `supplierLink`** 🟡
      Parte do campo feita (2026-11-11): `supplierLink` saiu do catálogo público (`src/data/products.js`) e não vai mais ao navegador. Resta só a correção dos ids 9 e 17.
  - [x] Remover `supplierLink` do catálogo público (feito em 2026-11-11). Os links ficam numa fonte privada mantida pelo painel admin (repositório privado, ligado ao produto pelo id).
  - [x] Ajustar o painel administrativo externo para ler e gravar os links da fonte privada (feito pelo dono).
  - Decisão: só remover o campo por ora. O histórico do git deste repositório público ainda contém os links antigos; tratá-los como já expostos. Reescrever o histórico fica como decisão futura e aberta.
  - [ ] Corrigir os ids 9 (aponta para `kit-milano-camelo`, nome antigo) e 17 (aponta para um comedouro dobrável que não corresponde ao produto): a mãe corrige pelo painel.

---

## Conteúdo e vendas

- [ ] **7. Prazo estimado de entrega nas fichas** 🟡
      Informar com clareza as condições de entrega (fornecedor + frete), parte de apresentar a oferta com informação clara ao consumidor. O schema de `productDetails.js` não tem campo dedicado: criar `deliveryNote` (e renderizar no `ProductPage`) ou, provisoriamente, usar `faq`/`warranty`. O campo é uma decisão de implementação, não a obrigação em si.

- [ ] **8. Completar fichas dos produtos sem `PRODUCT_DETAILS`** 🔴
      16 dos 40 produtos não têm entrada em `PRODUCT_DETAILS` (ids 1, 3, 4, 13, 14, 15, 18, 19, 22, 24, 25, 27, 29, 30, 31, 32). Dos 29 visíveis, 6 estão sem ficha e abrem a ficha simples: ids 14, 18, 24, 25, 30, 31 (os outros 10 sem ficha estão ocultos). Priorizar os mais vendidos e de ticket mais alto. Medidas, cuidados e FAQ são as dúvidas que mais travam a compra.
      O id 45 (Porta-Saquinhos Premium Élan) entrou em 2026-11-17 com ficha sem garantia e sem medidas (nenhum dos dois dados foi informado); aguarda esses dados e o parecer jurídico sobre a garantia.
      Estado do id 44: ficha de 6 campos; falta a medida do tamanho M para `sizeChart`/`howToChooseSize` e falta definir a garantia. O fornecedor não informa nenhuma das duas e a dona do negócio não conseguiu obter. A garantia precisa de UM texto único da loja antes do preenchimento em lote (eram 4 textos diferentes nas fichas; restam 2 após a retirada abaixo).
      Em 2026-11-17, as linhas de garantia de 2 e 3 meses dos ids 20, 41 e 42 foram retiradas temporariamente (campo `warranty` removido) por recomendação do advogado. O texto padronizado de garantia legal (90 dias para produto durável) entra depois do parecer, previsto para 24 a 25/11/2026.

- [ ] **10. Dados estruturados e sitemap** 🟡
      Sitemap feito: `scripts/generate-sitemap.js` gera `dist/sitemap.xml` no build (home, `/produtos` e produtos visíveis, sem `lastmod`). `public/sitemap.xml` não existe mais no repositório. Pendente: JSON-LD `Product` nas fichas (o preço é texto livre, como `'R$ 379,90'`, e precisaria de conversão).

---

## Quando for implementar o checkout próprio

- [ ] **21. Conferir regras de liberação de saldo do gateway** 🟢
      Verificar prazo de recebimento por forma de pagamento antes de escolher o gateway (a intenção é a InfinitePay; `docs/CHECKOUT_ARCHITECTURE.md` ainda cita Mercado Pago), para não repetir o problema de caixa do modelo de compra sob encomenda ao fornecedor.
      A confirmar com a InfinitePay: se o checkout integrado aceita débito; taxas do cartão à vista e parcelado; custo e condições do recebimento na hora (há relatos de plano com permanência mínima); prazo de liberação por forma de pagamento.

- [ ] **22. Alinhar os textos que citam o PagBank ao atendimento por WhatsApp** 🟡
      Feito (2026-11-01): removidos o selo "PagBank" do rodapé e o item "A compra é segura?" do FAQ; Privacidade, Frete e Entrega e Termos de Uso reescritos sem o PagBank como pagamento ativo, com redação neutra (pedido, dados e frete combinados pelo WhatsApp). O PagBank só resta em comentários de código sobre `HIDE_BUY_CTA` e nos links `pag.ae` de `products.js`.
      Feito (2026-11-04): Privacidade cita o PagBank como operador do link de cartão e o pagamento por Pix ou link; Frete e Entrega, Termos de Uso e FAQ sem prazos fixos (prazo variável por produto e fornecedor, informado no atendimento) e sem "no momento da compra".
      Resta: o dono decidir a redação definitiva (como o pagamento e o frete são feitos hoje, prazos, quem despacha) e a revisão jurídica (item 37), inclusive do PagBank como operador na Privacidade. `ReturnPolicyPage.jsx` não foi alterada.

- [ ] **23. Decidir sobre privatizar o repositório** 🟡
      Pré-requisitos: corrigir as miniaturas do painel `petluxo-admin` que usam `raw.githubusercontent.com` (`ProductsPage.jsx:351` e `CategoriesPage.jsx:399` e, no modo edição, `Step3Photo.jsx:21`); testar um commit do painel com o repositório privado (autor do commit e o build na Cloudflare) e se o Workers Builds consegue clonar repositório privado (NÃO VERIFICADO); conferir o escopo do token. A documentação do projeto (`README.md`, `docs/DEPLOY.md`, `docs/DECISIONS.md` §8) afirma que o repositório deve ser público; isso não foi verificado na conta.

- [ ] **24. Conferir PNG com extensão `.webp` nas fotos de galeria** 🟢
      Checagem no repositório do site em 2026-11-17: `file public/images/products/*/*.webp | grep -v "Web/P"` não listou nenhum arquivo (todos os `.webp` de produto são WebP de verdade). Pendente: verificar no painel (`petluxo-admin/src/lib/imageConverter.js`, outro repositório, não tocado) como as fotos são convertidas, para evitar que o problema volte a cada produto novo. Causa do caso antigo não verificada.

- [ ] **25. Rotacionar periodicamente o token de acesso do painel ao GitHub** 🟢
      O token atual (`petluxo-admin-v2`, fine-grained) cobre dois repositórios, `petluxo` e `petluxo-admin`, com as permissões Contents em leitura e escrita e Metadata em leitura. Foi criado em 2026-10-26 e não tem vencimento. Ação planejada: trocar o token entre 2027-04-26 e 2027-10-26 (6 a 12 meses após a criação), já definindo data de validade na nova versão. Não registrar o valor do token em nenhum arquivo.

- [ ] **26. Reescrever `docs/CHECKOUT_ARCHITECTURE.md` para InfinitePay com frete grátis** 🟡
      Saem Mercado Pago e Melhor Envio. Continuam servidor (funções, agora Worker com script na Cloudflare) e banco. Pagamento por redirecionamento para checkout hospedado. Confirmação de pagamento pela API (retorno ao site e webhook não bastam como prova). Débito a confirmar.

---

## Adicionados em 2026-10-28

- [x] **28. Conferir o Instagram correto** 🟢
      Concluído em 2026-11-17. Perfil oficial do Instagram: pettluxo_; rodapé e docs alinhados.

- [x] **29. Pasta de imagem órfã** 🟢
      Concluído em 2026-11-17: `public/images/products/arranhador-felino-sisal-ajustavel-4-niveis-portatil/` (só `principal.webp`) não tinha nenhuma referência em `src/`, `worker/`, `scripts/`, catálogo ou docs (além deste item e do contexto do projeto) e foi removida com `git rm -r`; o build passa.

- [x] **30. Prévia do link no WhatsApp/Facebook após a virada** 🟢
      Fechada em 2026-10-28 para a home e a raiz: `https://www.petluxostory.com.br/?teste=1` mostrou logo, título e descrição, acima da caixa de texto e na mensagem enviada, e `https://petluxostory.com.br/?teste=2` (raiz) mostrou a mesma prévia (o WhatsApp seguiu o 301 para o `www`). Com o user-agent do WhatsApp, o HTML traz `og:url`, `og:image` (+ type, width 1200, height 630, alt), `og:title` e `og:description`, todos com `www`; `/og-image.jpg` responde 200, `image/jpeg`. Um link de produto (`/produto/8`) mostra a prévia da home: limitação conhecida (todas as rotas servem o mesmo `index.html`; item 2).
      Prévia por produto resolvida pelo Worker de SEO e validada em 2026-11-17 (prévia do WhatsApp de `/produto/44`). Pendente (opcional): link limpo (cache do WhatsApp) e depurador do Facebook.

- [ ] **31. Teste de foto trocada pelo painel com o mesmo nome (cache)** 🟢
      Parte A feita (2026-10-28): `/images/products/refugio-cozy/principal.webp` responde 200, `image/webp`, `cache-control: public, max-age=0, must-revalidate` e tem `etag`; isso indica que uma foto nova com o mesmo nome deveria aparecer.
      Parte B(i) respondida pela auditoria do painel de 2026-11-10: na edição, o painel sobrescreve o mesmo arquivo `<pasta>/<arquivo>.webp` e o site serve com `max-age=0, must-revalidate`.
      Parte B(ii) pendente: o teste real de troca de foto em um produto de baixo risco, conferindo em aba anônima. Não é prioridade.

- [ ] **32. Conferir o plano da Vercel para o painel admin** 🟢
      O painel admin (`petluxo-admin`, outro repositório) continua na Vercel (Hobby). Decisão do dono: manter lá, por considerar que o painel não é de uso comercial (afirmação do dono; NÃO VERIFICADO nos termos da Vercel, e o painel edita o catálogo da loja). Decidir se mantém, paga ou migra o painel (3 funções em `api/`: auth, github e ai). Ver `docs/CLOUDFLARE_MIGRATION.md` seção 5.

- [ ] **33. Renovar o domínio no Registro.br** 🟢
      O domínio `petluxostory.com.br` vence em 2027-05-07. Renovar antes dessa data (a ação é do titular do domínio).

- [ ] **34. Painel admin: achados da auditoria** 🟡
      A auditoria do painel de 2026-10-27 está no `AI_CONTEXT.md` do repositório `petluxo-admin` (fora deste repositório). Inclui: textos "Vercel" na interface (`usePublish.js`, `ProductsPage.jsx`), polling de 5 s na listagem, validação de `path` em `api/github.js` e imagem plana (`public/images/products/<slug>.webp`) × pasta por produto (`<slug>/principal.webp`). Tratar a partir desse arquivo.

- [x] **35. Desativar o projeto Vercel do site (prazo: 2026-11-11)** 🟡
      Concluído em 2026-11-11. Feito:
  1. F4.4: o projeto Vercel do site foi desconectado do GitHub e excluído (o projeto do painel admin, `petluxo-admin`, não foi tocado). `.vercel` removido do `.gitignore` e pasta local `.vercel/` apagada.
  2. Removidos da zona na Cloudflare o CNAME `*` (para a Vercel) e o `_domainconnect`. A zona tem agora 3 CAA e as duas linhas Worker (raiz e `www`).
  3. F4.8: `"workers_dev": false` e `"preview_urls": false` definidos no `wrangler.jsonc`.
  4. F4.5 (feito antes): `public/404.html` e o bloco de restauração de path de `src/main.jsx` removidos (D7).
  Verificado por `curl` em 2026-11-11, depois das remoções: `www` 200, raiz 301 e `/produto/43` 200. `dig` (CNAME e A) de um subdomínio inexistente: sem resposta.
  Subitens:
  - `workers.dev`: verificado desligado por `curl` em 2026-11-10 (o endereço `workers.dev` e o endereço no formato de Preview respondem 404).
  - Preview URLs: SEM confirmação direta por `curl`; só o estado "desligado" visto no painel. O `curl` do endereço no formato de Preview é compatível, mas não prova.
  O rollback para a Vercel deixou de existir (`docs/CLOUDFLARE_MIGRATION.md`, seção 7): para voltar seria preciso recriar o projeto e o domínio na Vercel e refazer o DNS.

- [x] **36. Testar o GA4 em Tempo Real (F0.6)** 🟢
      Roteiro: abrir GA4 → Tempo real; em aba anônima, abrir o site, aceitar o banner de consentimento, navegar em uma ou duas páginas e ver o usuário ativo. Conferir o domínio do stream (pode estar com o domínio antigo, sem `www`) e filtros de hostname. Sem consentimento o `gtag` não carrega (esperado). Testado pelo dono antes (relatado em 2026-11-05) e funcionando; registrado como concluído em 2026-11-11.

- [ ] **37. Revisão jurídica dos textos legais e da base legal do GA4 (Consent Mode, transferência internacional)** 🔴
      Revisar Privacidade, Frete e Entrega e Termos de Uso após a mudança para o atendimento só por WhatsApp; definir a base legal do GA4 (consentimento × legítimo interesse) e se o Consent Mode se aplica; avaliar a transferência internacional de dados (Google, Meta, Cloudflare). Hoje as políticas não tratam de transferência internacional.
      Feito (2026-11-16): Google Fonts substituído por fontes hospedadas no próprio site (@fontsource); revogação do GA4 passou a recarregar a página; parágrafo do Google Fonts removido da Privacidade.
      Pendências levantadas em 2026-11-16 (dependem de advogado e/ou da dona do negócio): (a) identificação do fornecedor no site: razão social e endereço físico (Decreto 7.962/2013, art. 2º), hoje só PETLUXO, CNPJ e e-mail; (b) porte da empresa (MEI/ME/EPP) e canal do titular em vez de encarregado (Res. CD/ANPD 2/2022); (c) frete de devolução no arrependimento está como do cliente na Troca e Devolução (entendimento do STJ/Idec: é do fornecedor); (d) foro de Brasília com renúncia nos Termos, a revisar para relação de consumo; (e) 'exclusão dos dados após o pedido' x obrigações de guarda e ausência de prazo de retenção; (f) transferência internacional (Google, Meta, Cloudflare) e lista de direitos do titular (art. 18 da LGPD) incompletas; (g) papéis do PagBank e do distribuidor; (h) abertura da Privacidade diz 'exclusivamente' pedidos, o que destoa do GA4; (i) Troca e Devolução datada de maio de 2025 e pede 'número do pedido'; (j) base legal do GA4: manter consentimento e retirar a frase 'depende de confirmação jurídica' após confirmação do advogado.

- [ ] **38. Remover a obrigatoriedade de buyLink/buyLinks no catálogo** 🟢
      Não iniciado; o caminho abaixo é provável, não definitivo.
  - Contexto: com `HIDE_BUY_CTA = true` nenhum link é renderizado e a venda é só por WhatsApp, mas o catálogo ainda exige `buyLink` ou `buyLinks` em todo produto.
  - Onde a exigência vive:
    - `scripts/validate-catalog.js`: falha o build sem `buyLink` nem `buyLinks` ("sem buyLink nem buyLinks"); também exige `size` em cada `buyLinks[]` e compara os tamanhos de `prices` e `buyLinks` (exceção: ids 9 e 17).
    - `src/hooks/useProductBuy.js`: o tamanho inicial vem do primeiro `buyLinks[].size`; `activeBuyLink` sai de `buyLinks` e `activePrice` de `prices`, ambos por igualdade de `size`.
    - `src/components/product/ProductSizeSelector.jsx`: recebe `buyLinks` (lista e rótulos dos tamanhos/cores, `color` de cada item) e não renderiza nada sem ele; `ProductPage.jsx` e a ficha mobile só o montam se houver `product.buyLinks`.
    - `src/components/product/ProductBuyButton.jsx`: a mensagem do WhatsApp usa o tamanho/cor ativo (`selectedSize`, só se houver `product.buyLinks`) e o preço ativo (`activePrice`, com fallback para `product.price`); os ramos do botão também testam `buyLinks`/`buyLink`.
    - `src/components/pages/ProductPage.jsx` (e os componentes `mobile/product/`): usam `product.buyLinks && selectedSize` para escolher entre mostrar só o preço do tamanho ativo e a lista completa de `prices`.
    - Painel admin externo `petluxo-admin`: `usePublish.js` (grava `buyLinks` a partir das variantes ou `buyLink`), `productEdit.js` (decide se o produto tem tamanhos por `prices`/`buyLinks` e lê os links) e `productTemplate.js` (`buyLink: ''`); também aparecem em `Step1Basics.jsx`, `Step4Review.jsx`, `ProductPreview.jsx` e `useProductForm.js`.
  - Paliativo atual: produtos novos usam `buyLinks` com `https://wa.me/5561994063917` por tamanho (ids 2, 33 e 43). O cliente não vê esses links.
  - Caminho provável: o tamanho passa a vir de `prices` em vez de `buyLinks`; o validador deixa de exigir link; o painel é ajustado em paralelo (ordem a decidir, porque o painel reescreve `products.js`).

- [ ] **39. Atualizar os cartões "7" e "90" da Troca e Devolução após a revisão jurídica** 🟢
      O mobile mostra dois cartões (`HIGHLIGHTS` em `ReturnPolicyPage.jsx`): "7" (dias corridos para desistir da compra) e "90" (dias para defeito de fabricação). Os números e frases são uma cópia do texto atual da política e não se atualizam sozinhos: quando o advogado revisar a política (item 37), alterar `HIGHLIGHTS` junto com o texto, ou remover os cartões se os prazos mudarem de forma que não caibam neles. Há um comentário no código avisando.

- [ ] **40. Versão desktop nova** 🔴
      O layout a partir de 768px é o anterior ao redesign mobile (`docs/DECISIONS.md` §14). Falta desenhar e portar a versão desktop com a mesma linguagem do mobile. Inclui decidir se o CTA final (só no desktop hoje) fica, e se o desktop ganha a busca `/buscar` em vez do redirecionamento para `/produtos`.

- [ ] **41. Testar o layout mobile em aparelhos reais** 🟡
      Conferir em iOS Safari e Chrome Android: `scroll-snap` da home e da galeria, `100dvh` e a barra do navegador, safe area, pinch-zoom livre (página, galeria e visualizador de imagem) e o teclado na busca.

---

## Concluídos recentemente

- [x] Limpeza de dados e código morto (2026-10-26)
- [x] Fotos de produto convertidas para WebP de verdade e arquivo solto organizado (2026-10-26)
- [x] og-image em JPEG 1200×630 com tags de tamanho (2026-10-26)
- [x] Troca do token de acesso do painel (2026-10-26)
- [x] Sincronização dos READMEs e docs (2026-10-26)
