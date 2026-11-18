/* PetLuxo — ProductBadge: selo do produto (NOVO, MAIS VENDIDOS, PREMIUM…).
 * Posicionamento fica por conta de quem usa (className). */

import ui from './MobileUI.module.css';

export function ProductBadge({ badge, className }) {
  if (!badge) return null;
  return (
    <span className={[ui.mBadge, badge === 'NOVO' && ui.mBadgeNovo, className].filter(Boolean).join(' ')}>
      {badge}
    </span>
  );
}
