/* PetLuxo — MobileProductSimple
 * Produto sem entrada em productDetails.js: foto, nome, subtítulo, preço,
 * variações, descrição e destaques, tudo de products.js. Sem acordeões. */

import { MobileFooter } from '../layout/MobileFooter.jsx';
import { ProductBadge } from '../ui/ProductBadge.jsx';
import { BackButton, BuyBar, FreightNote, RichText, VariantPicker, priceView } from './MobileProductParts.jsx';
import { primaryCategoryLabel } from '../../../lib/catalog.js';
import ui from '../ui/MobileUI.module.css';
import styles from './MobileProduct.module.css';

export default function MobileProductSimple({ product, buy }) {
  const { selectedSize, setSelectedSize, activePrice } = buy;
  const { value } = priceView(product, selectedSize, activePrice);

  return (
    <div className={styles.mProd}>
      <BackButton/>
      <div className={styles.mSimpleHero}>
        <img className={styles.mSlideImg} src={product.image} alt={product.name} decoding="async"/>
      </div>

      <main className={styles.mSimpleSheet}>
        <p className={ui.mEyebrow}>
          <span className={ui.mEyebrowDot} aria-hidden="true"></span>
          {primaryCategoryLabel(product)}
        </p>
        <h1 className={`${styles.mName} ${styles.mSimpleName}`}>{product.name}</h1>
        {product.subtitle && <p className={styles.mSubtitle}>{product.subtitle}</p>}
        <svg className={styles.mSimpleRule} viewBox="0 0 120 8" fill="none" aria-hidden="true" focusable="false">
          <path className={styles.mSimpleRulePath} d="M0 4 H112" stroke="#C6A96B" strokeWidth="1.2"/>
          <circle cx="116" cy="4" r="3" fill="#C6A96B"/>
        </svg>
        {product.badge && <div style={{ marginTop: 16 }}><ProductBadge badge={product.badge}/></div>}

        <div className={styles.mSimplePrice}>
          {product.originalPrice && <div className={styles.mPriceWas}>{product.originalPrice}</div>}
          {value}
        </div>
        <FreightNote simple/>

        <VariantPicker product={product} selectedSize={selectedSize} onSelect={setSelectedSize} simple/>

        {product.description && <div className={styles.mSimpleDesc}><RichText text={product.description}/></div>}

        {product.bullets?.length > 0 && (
          <ul className={`${styles.mBullets} ${styles.mSimpleBullets}`}>
            {product.bullets.map((b) => (
              <li key={b}><span className={styles.mBulletMark} aria-hidden="true"></span><span>{b}</span></li>
            ))}
          </ul>
        )}
      </main>

      <MobileFooter/>
      <BuyBar product={product} selectedSize={selectedSize} activePrice={activePrice}/>
    </div>
  );
}
