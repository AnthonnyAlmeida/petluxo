/* PetLuxo — id único para <defs> de SVG (gradientes, clipPath).
 * O useId do React traz ":" (ex.: ":r3:"), que quebra url(#…): tira. */

import { useId } from 'react';

export function useSvgId(prefix) {
  return `${prefix}${useId().replace(/:/g, '')}`;
}
