/* PetLuxo — estado de "hover" para a arte animada do desktop.
 *
 * Mouse: pointerenter/pointerleave (só pointerType "mouse").
 * Teclado: foco visível liga, blur desliga (clique de mouse ou toque que só
 * focam o botão não contam, senão o estado ficaria preso até o próximo toque).
 * Toque/caneta: não existe hover; o toque liga o estado por TOUCH_MS e ele se
 * desfaz sozinho (timeout limpo no unmount), como no MobileHero.
 *
 * Uso: const [id, bind] = useHoverState(); <button {...bind('dog')}/>;
 * `id` é o valor ativo (ou null). */

import { useCallback, useEffect, useRef, useState } from 'react';

const TOUCH_MS = 1600;

function isKeyboardFocus(el) {
  try { return el.matches(':focus-visible'); } catch { return true; }
}

export function useHoverState() {
  const [active, setActive] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const set = useCallback((value) => {
    clearTimeout(timer.current);
    setActive(value);
  }, []);

  const bind = useCallback((id) => ({
    onPointerEnter: (e) => { if (e.pointerType === 'mouse') set(id); },
    onPointerLeave: (e) => { if (e.pointerType === 'mouse') set(null); },
    onPointerDown: (e) => {
      if (e.pointerType === 'mouse') return;
      set(id);
      timer.current = setTimeout(() => setActive(null), TOUCH_MS);
    },
    onFocus: (e) => { if (isKeyboardFocus(e.currentTarget)) set(id); },
    onBlur: () => set(null),
  }), [set]);

  return [active, bind];
}
