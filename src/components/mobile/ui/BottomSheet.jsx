/* PetLuxo — BottomSheet
 * Diálogo modal em forma de folha inferior (role="dialog", aria-modal).
 * Enquanto aberto: o app por trás fica `inert` (sem foco nem toque), o foco
 * fica preso na folha (Tab/Shift+Tab circulam), Esc e toque no fundo fecham
 * e, ao fechar, o foco volta para o elemento que abriu a folha. */

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './BottomSheet.module.css';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function BottomSheet({ open, onClose, labelledBy, label, className, panelClassName, children }) {
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

  if (!open) return null;

  return createPortal(
    <div className={[styles.mSheetRoot, className].filter(Boolean).join(' ')}>
      <div className={styles.mSheetScrim} onClick={() => onCloseRef.current?.()} aria-hidden="true"></div>
      <div
        ref={panelRef}
        className={[styles.mSheetPanel, panelClassName].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : label}
        tabIndex={-1}
      >
        <div className={styles.mSheetGrip} aria-hidden="true"></div>
        {children}
      </div>
    </div>,
    document.body
  );
}
