/* PetLuxo — Featured (layout desktop, ≥ 768px)
 * Produto em destaque: o primeiro visível com `featured: true`
 * (getFeaturedProduct). Foto quadrada com o gato espiando, nome com a
 * palavra de destaque em itálico ("PetLuxo™" quando houver; senão a última
 * palavra), subtítulo, descrição (limitada por line-clamp; o texto completo fica na ficha), WhatsApp com a mensagem do produto e o menor preço
 * ("A PARTIR DE" quando há `prices`).
 * Clicável: título e foto levam à ficha (dois Links; o da foto é aria-hidden
 * e fora do Tab). O WhatsApp é um link externo independente.
 * CTA TEMPORÁRIO: com o PagBank desativado (HIDE_BUY_CTA em
 * ProductBuyButton.jsx), o destaque aponta para o WhatsApp. */

import { Link } from 'react-router-dom';
import { Icon } from '../../icons.jsx';
import { getFeaturedProduct, lowestPrice as getLowestPrice } from '../../lib/catalog.js';
import { FEATURED_TEXT, WA_MESSAGES } from '../../data/siteContent.js';
import { wa } from '../../lib/whatsapp.js';
import { splitLastWord } from '../../lib/text.js';
import { SectionTag } from '../ui/SectionTag.jsx';
import { PeekingCat } from '../ui/art/PeekingCat.jsx';
import '../../styles/buttons.css';
import styles from './Featured.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');
const TRADEMARK = 'PetLuxo™';

function renderName(name) {
  const idx = name.indexOf(TRADEMARK);
  if (idx !== -1) {
    return (
      <>
        {name.slice(0, idx)}<em>{TRADEMARK}</em>{name.slice(idx + TRADEMARK.length)}
      </>
    );
  }
  const [rest, last] = splitLastWord(name);
  return (
    <>
      {rest && `${rest} `}<em>{last}</em>
    </>
  );
}

export function Featured() {
  const product = getFeaturedProduct();
  if (!product) return null;

  const price = getLowestPrice(product);
  const productPath = `/produto/${product.id}`;
  const waHref = wa(WA_MESSAGES.product(product.name));

  return (
    <section className={styles.featured} aria-labelledby="featured-title">
      <div className={cx('wrap', styles.grid)}>
        <div className={cx(styles.media, 'reveal')}>
          <div className={styles.photo}>
            <Link to={productPath} className={styles.photoLink} aria-hidden="true" tabIndex={-1}>
              <img src={product.image} alt="" loading="lazy"/>
            </Link>
          </div>
          <PeekingCat className={styles.peek} label={FEATURED_TEXT.peekLabel}/>
        </div>

        <div className={styles.info}>
          <SectionTag line={false} className="reveal d1">{FEATURED_TEXT.tag}</SectionTag>
          <h2 id="featured-title" className={cx(styles.name, 'reveal', 'd2')}><Link to={productPath} className={styles.nameLink}>{renderName(product.name)}</Link></h2>
          {product.subtitle && <p className={cx(styles.subtitle, 'reveal', 'd3')}>{product.subtitle}</p>}
          {product.description && <p className={cx(styles.description, 'reveal', 'd3')}>{product.description}</p>}
          <div className={cx(styles.buyRow, 'reveal', 'd4')}>
            <a className="btn btn-primary" href={waHref} target="_blank" rel="noopener noreferrer">
              <Icon.Wa className="wa-icon"/>
              {FEATURED_TEXT.cta}
            </a>
            <p className={styles.price}>
              {product.prices && <span className={styles.from}>{FEATURED_TEXT.from}</span>}
              <span>{price}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
