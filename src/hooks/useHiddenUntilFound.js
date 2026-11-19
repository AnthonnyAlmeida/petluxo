/* PetLuxo — useHiddenUntilFound
 * Esconde um bloco com hidden="until-found" (continua no DOM: buscadores e a
 * busca da página do navegador o encontram) e chama onReveal quando o
 * navegador o revela por uma busca (evento beforematch). Em navegadores sem
 * suporte o atributo vira um `hidden` comum. O React 18 não aceita o valor
 * "until-found" na prop `hidden`, por isso o atributo é aplicado no DOM. */

import { useEffect, useLayoutEffect, useRef } from 'react';

export function useHiddenUntilFound(hidden, onReveal) {
  const ref = useRef(null);
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (hidden) el.setAttribute('hidden', 'until-found');
    else el.removeAttribute('hidden');
  }, [hidden]);

  const hiddenRef = useRef(hidden);
  hiddenRef.current = hidden;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const handler = () => {
      onRevealRef.current?.();
      // quem chama pode mostrar o conteúdo em outro lugar (ex.: numa folha);
      // se continuar marcado como escondido, volta a esconder o bloco
      requestAnimationFrame(() => {
        if (hiddenRef.current && ref.current) ref.current.setAttribute('hidden', 'until-found');
      });
    };
    el.addEventListener('beforematch', handler);
    return () => el.removeEventListener('beforematch', handler);
  }, []);

  return ref;
}
