/* PetLuxo — ProductCard */

import { useNavigate } from 'react-router-dom';
import { Icon } from '../../icons.jsx';
import styles from './ProductCard.module.css';

/* O card sempre leva à página do produto (/produto/:id), com ou sem ficha
 * em productDetails.js: a ProductPage trata os dois casos. */
export function ProductCard({ product, index }) {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/produto/${product.id}`);

  return (
    <article className={[styles.product, 'reveal', `d${(index % 5) + 1}`].filter(Boolean).join(' ')} onClick={handleClick}>
      <div className={styles.stage}>
        <button className={styles.qaBtn} aria-label="Visualizar"><Icon.Plus/></button>
        <img src={product.image} alt={product.name} className={styles.productImg} loading="lazy" />
        {product.badge && (
          <span className={styles.badge}>{product.badge}</span>
        )}
      </div>
      <div className={styles.meta}>
        <div className={styles.name}>{product.shortName || product.name}</div>
        {product.cardNote && (
          <small className={styles.cardNote}>{product.cardNote}</small>
        )}
        <div className={styles.priceCol}>
          {product.originalPrice && (
            <span className={styles.priceOriginal}>{product.originalPrice}</span>
          )}
          <div className={styles.price}>{product.price}</div>
          {/* Legenda TEMPORÁRIA: enquanto o PagBank estiver desativado
              (HIDE_BUY_CTA em ProductBuyButton.jsx), todo o fluxo é WhatsApp. */}
          <small className={styles.priceVia}>
            VIA WHATSAPP
          </small>
        </div>
      </div>
    </article>
  );
}
