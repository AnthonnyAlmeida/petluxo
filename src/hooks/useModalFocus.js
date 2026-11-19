/* PetLuxo — useModalFocus
 * Comportamento comum dos diálogos modais do layout mobile: enquanto
 * `open`, o app (#app) fica `inert` e oculto aos leitores de tela, o foco
 * começa no painel e fica preso nele (Tab/Shift+Tab circulam), Esc chama
 * onClose e, ao fechar, o foco volta ao elemento que tinha o foco antes. */

import { useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function useModalFocus(open, onClose) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const app = document.getElementById('app');
    app?.setAttribute('inert', '');
    app?.setAttribute('aria-hidden', 'true');

    const panel = panelRef.current;
    // o foco começa no próprio painel: o leitor de tela anuncia o título e
    // o Tab segue para o primeiro controle
    panel?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll(FOCUSABLE));
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (!panel.contains(document.activeElement)) {
        e.preventDefault();
        firstItem.focus();
      } else if (e.shiftKey && (document.activeElement === firstItem || document.activeElement === panel)) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      app?.removeAttribute('inert');
      app?.removeAttribute('aria-hidden');
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [open]);

  return panelRef;
}
