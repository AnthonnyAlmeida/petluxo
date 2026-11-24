/* PetLuxo — ProductCard (layout desktop)
 * Link para a página do produto (/produto/:id), com ou sem ficha em
 * productDetails.js: a ProductPage trata os dois casos. Abre em nova aba
 * com Ctrl/Cmd+clique como qualquer link. */

import { Link } from 'react-router-dom';
import { Icon } from '../../icons.jsx';
import styles from './ProductCard.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

export function ProductCard({ product, index = 0 }) {
  return (
    <Link
      to={`/produto/${product.id}`}
      className={cx(styles.card, 'reveal', `d${(index % 5) + 1}`)}
    >
      <div className={styles.stage}>
        <img src={product.image} alt={product.name} className={styles.img} loading="lazy" />
        <span className={styles.qa} aria-hidden="true"><Icon.Plus/></span>
        {product.badge && (
          <span className={styles.badge}>{product.badge}</span>
        )}
      </div>
      <div className={styles.meta}>
        <p className={styles.name}>{product.shortName || product.name}</p>
        {product.cardNote && (
          <small className={styles.cardNote}>{product.cardNote}</small>
        )}
        <div className={styles.priceRow}>
          {product.originalPrice && (
            <s className={styles.priceOriginal}>{product.originalPrice}</s>
          )}
          <span className={styles.price}>{product.price}</span>
          {/* Legenda TEMPORÁRIA: enquanto o PagBank estiver desativado
              (HIDE_BUY_CTA em ProductBuyButton.jsx), todo o fluxo é WhatsApp. */}
          <span className={styles.priceVia}>VIA WHATSAPP</span>
        </div>
      </div>
    </Link>
  );
}
