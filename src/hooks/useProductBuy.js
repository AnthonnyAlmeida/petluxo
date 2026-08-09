/* PetLuxo — useProductBuy
 * Estado do tamanho selecionado e valores derivados (link e preço ativos)
 * para produtos com variação de tamanho (buyLinks/prices). Compartilhado
 * entre ProductModal e ProductPage.
 */

import { useState, useEffect } from 'react';

export function useProductBuy(product) {
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (product?.buyLinks?.length) {
      setSelectedSize(product.buyLinks[0].size);
    } else {
      setSelectedSize(null);
    }
  }, [product]);

  const activeBuyLink = product?.buyLinks?.find((bl) => bl.size === selectedSize);
  const activePrice = product?.prices?.find((p) => p.size === selectedSize);

  return { selectedSize, setSelectedSize, activeBuyLink, activePrice };
}
