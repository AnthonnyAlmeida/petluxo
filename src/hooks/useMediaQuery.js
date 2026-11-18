/* PetLuxo — useMediaQuery / useIsMobile / usePrefersReducedMotion
 * Lê uma media query de forma síncrona no primeiro render (sem "piscar" o
 * layout errado) e acompanha mudanças com useSyncExternalStore.
 *
 * MOBILE_QUERY define o breakpoint do redesign mobile: abaixo de 768px
 * entram os componentes de src/components/mobile/; de 768px para cima,
 * o layout desktop. */

import { useSyncExternalStore } from 'react';

export const MOBILE_QUERY = '(max-width: 767.98px)';
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function useMediaQuery(query) {
  const subscribe = (onChange) => {
    if (typeof window === 'undefined' || !window.matchMedia) return () => {};
    const mql = window.matchMedia(query);
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  };
  const getSnapshot = () =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false;
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function useIsMobile() {
  return useMediaQuery(MOBILE_QUERY);
}

export function usePrefersReducedMotion() {
  return useMediaQuery(REDUCED_MOTION_QUERY);
}
