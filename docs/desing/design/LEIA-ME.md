# Design mobile PetLuxo (referência para o Claude Code)

Cada `.dc.html` é uma tela de 390x844. Abrir como código: HTML + CSS + SVG, com um bloco `<script type="text/x-dc">` com a lógica (estado e eventos).
O runtime `support.js` (DCLogic) NÃO deve ir para o site: portar a lógica para React.

## Telas
- Main = Home, hero (medalha de coleira dourada que balança ao toque)
- Cenas = Home abaixo do hero (Mais vendidos, Destaque com gato, Sobre nós com rosácea, Diferenciais em stories, Dúvidas, Rodapé) + trilha dourada ligada à rolagem
- Catalogo, Produto (com ficha), ProdutoSimples (sem ficha, ex.: id 14), Busca, Cookies, Politicas, NotFound
- canvas.json = posição das telas no canvas (ignorar no site)

## Imagens: `/_blob/<id>` nos arquivos são provisórias. Trocar pelas imagens reais do repo (public/images/products/...)
- 8b7b16bad70f92f91fda7b25a9f31789 = Bolsa Transporte (id 8)   -> assets/p8.webp
- 296f42dddb10aff87902717fbc78b0eb = Refúgio Suspenso (id 20)  -> assets/p20.webp
- 9f9c76c914d508ffe458d7962f52417d = Brinquedo PetLuxo (id 39) -> assets/p39.webp
- effd1d4db3a543e3a6720ea208a1744f = Refúgio Cozy, miniatura (id 2) -> assets/p2.webp
- 9392d7949c65d3aff1c784c726e6f8bc = Refúgio Cozy, galeria 1 -> assets/cozy-principal.webp (conferir)
- 4ffe2326ca26c822fd32a5fb3aaf880a = Refúgio Cozy, galeria 2 -> assets/cozy-refugio-cozy-2.webp (conferir)
- 8fc0b6de849832a845ceae1ab223bef2 = Kit Élan Rosa (id 43)    -> assets/p43.webp
- 6df49dde21c2eb9036dc48fa7e764e8a = Porta Saquinhos (id 10)  -> assets/p10.webp
- 4bafad6a81afaef4b7f4e6f50776b271 = Bolsa Térmica (id 34)    -> assets/p34.webp
- fdf70a61ed24f643497b6a678c912eb6 = Sofá Essence (id 12)     -> assets/p12.webp
- a219856f3dc0c65e19d3c4b5d2f2df1e = Cama CloudNest (id 14)   -> assets/cloudnest.jpg
- ea85c591f985fe7ee19cab96e384c5a7 = logo (recorte circular)  -> assets/logo-p.webp (conferir)
As miniaturas em assets/ são reduzidas: usar os originais do repo no site.
