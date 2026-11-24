/* PetLuxo — utilidades de texto do layout desktop. */

/* Separa a última palavra (para o itálico de destaque dos títulos).
 * "Perguntas Frequentes" → ['Perguntas', 'Frequentes']. */
export function splitLastWord(text) {
  const t = String(text ?? '').trim();
  const i = t.lastIndexOf(' ');
  if (i === -1) return ['', t];
  return [t.slice(0, i), t.slice(i + 1)];
}
