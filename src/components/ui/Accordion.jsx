/* PetLuxo — Accordion (detalhes da ficha, layout desktop)
 * Cada AccordionItem controla o próprio estado (vários podem ficar abertos
 * ao mesmo tempo). O painel fechado fica no DOM, recolhido e fora do Tab. */

import { useId, useState } from 'react';
import { Icon } from '../../icons.jsx';
import styles from './Accordion.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

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
          <Icon.Plus className={cx(styles.icon, open && styles.iconOpen)}/>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={cx(styles.panel, open && styles.panelOpen)}
      >
        <div className={styles.panelInner}>
          <div className={styles.panelContent}>{children}</div>
        </div>
      </div>
    </div>
  );
}
