/* PetLuxo — BottomSheet
 * Diálogo modal em forma de folha inferior (role="dialog", aria-modal).
 * O foco, o `inert` do app, o Esc e o retorno do foco vêm de useModalFocus;
 * o toque no fundo também fecha. */

import { createPortal } from 'react-dom';
import { useModalFocus } from '../../../hooks/useModalFocus.js';
import styles from './BottomSheet.module.css';

export function BottomSheet({ open, onClose, labelledBy, label, className, panelClassName, children }) {
  const panelRef = useModalFocus(open, onClose);

  if (!open) return null;

  return createPortal(
    <div className={[styles.mSheetRoot, className].filter(Boolean).join(' ')}>
      <div className={styles.mSheetScrim} onClick={onClose} aria-hidden="true"></div>
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
