/* PetLuxo — useReserveBottomBar
 * Marca <html> com a classe `m-bottom-bar` enquanto uma barra inferior fixa
 * do layout mobile estiver montada (globals.css reserva a altura dela). */

import { useEffect } from 'react';

let mounted = 0;

export function useReserveBottomBar() {
  useEffect(() => {
    mounted += 1;
    document.documentElement.classList.add('m-bottom-bar');
    return () => {
      mounted -= 1;
      if (mounted === 0) document.documentElement.classList.remove('m-bottom-bar');
    };
  }, []);
}
