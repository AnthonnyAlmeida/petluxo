/* PetLuxo — Accordion
 * Componente genérico de acordeão: cada AccordionItem controla seu próprio
 * estado aberto/fechado, então múltiplos itens podem ficar abertos ao mesmo
 * tempo (nenhum estado compartilhado no Accordion pai).
 */

import React, { useId, useState } from 'react';
import { Icon } from '../../icons.jsx';
import styles from './Accordion.module.css';

export function Accordion({ children }) {
  return <div className={styles.accordion}>{children}</div>;
}

export function AccordionItem({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const reactId = useId();
  const triggerId = `accordion-trigger-${reactId}`;
  const panelId = `accordion-panel-${reactId}`;

  return (
    <div className={styles.item}>
      <h3 className={styles.heading}>
        <button
          type="button"
          id={triggerId}
          className={styles.trigger}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
        >
          <span>{title}</span>
          <Icon.Chevron className={[styles.chevron, open ? styles.chevronOpen : ''].join(' ')} aria-hidden="true" />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={styles.panel}
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className={styles.panelInner}>
          <div className={styles.panelContent}>{children}</div>
        </div>
      </div>
    </div>
  );
}
