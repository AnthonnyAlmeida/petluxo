/* PetLuxo — Peças compartilhadas das páginas de produto mobile:
 * Voltar, preço/rótulo, seletor de variação, barra fixa de compra e texto. */

import { Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MIcon } from '../MobileIcons.jsx';
import { useReserveBottomBar } from '../../../hooks/useReserveBottomBar.js';
import { DELIVERY_NOTE } from '../../../data/siteContent.js';
import { splitPricePrefix } from '../../../lib/catalog.js';
import { productWaLink } from '../../../lib/productMessage.js';
import ui from '../ui/MobileUI.module.css';
import styles from './MobileProduct.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

/* Voltar: página anterior do histórico; se a ficha foi o primeiro endereço
 * aberto (link direto), vai para o catálogo. */
export function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const back = () => {
    if (location.key !== 'default') navigate(-1);
    else navigate('/produtos');
  };
  return (
    <button type="button" className={styles.mBack} aria-label="Voltar" onClick={back}>
      <MIcon.ArrowLeft size={22}/>
    </button>
  );
}

/* Rótulo e valor do preço para a variação ativa:
 *  - preço da variação (prices) com rótulo "Tamanho P"/"Cor Rosa";
 *  - senão o `price` do produto, com "a partir de" quando o texto o traz. */
export function priceView(product, selectedSize, activePrice) {
  const { prefix, value } = splitPricePrefix(product.price);
  if (activePrice) {
    const isColor = product.variationType === 'cor';
    const size = String(activePrice.size);
    return { label: isColor ? size : `Tamanho ${size.replace(/^Tam\.?\s*/i, '')}`, value: activePrice.price };
  }
  return { label: prefix, value };
}

export function VariantPicker({ product, selectedSize, onSelect, weights = {}, simple = false }) {
  if (!product.buyLinks?.length) return null;
  const isColor = product.variationType === 'cor';
  const head = isColor ? 'Cor' : 'Tamanho';
  return (
    <div className={styles.mVariants}>
      <div className={styles.mVariantsHead} id="m-variant-head">{head}</div>
      <div className={styles.mVariantsGrid} role="group" aria-labelledby="m-variant-head">
        {product.buyLinks.map((bl) => {
          const on = selectedSize === bl.size;
          const sub = weights[bl.size];
          return (
            <button
              key={bl.size}
              type="button"
              className={cx(styles.mVariant, simple && styles.mVariantSimple, on && styles.mVariantOn)}
              aria-pressed={on}
              onClick={() => onSelect(bl.size)}
            >
              <span className={styles.mVariantName}>
                {isColor && bl.color && <span className={styles.mSwatch} style={{ background: bl.color }} aria-hidden="true"></span>}
                {bl.size}
              </span>
              {sub && <span className={styles.mVariantSub}>{sub}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FreightNote({ simple = false }) {
  if (simple) return <p className={styles.mSimpleFreight}>{DELIVERY_NOTE}</p>;
  return (
    <p className={styles.mFreight}>
      <MIcon.Truck/>
      {DELIVERY_NOTE}
    </p>
  );
}

/* Barra fixa de compra: preço atual e "Consultar via WhatsApp" (a compra
 * direta continua oculta: HIDE_BUY_CTA em ProductBuyButton). */
export function BuyBar({ product, selectedSize, activePrice }) {
  useReserveBottomBar();
  const { label, value } = priceView(product, selectedSize, activePrice);
  return (
    <div className={styles.mBar}>
      <div className={styles.mBarPrice}>
        {label && <div className={styles.mBarLabel}>{label}</div>}
        <div className={styles.mBarValue}>{value}</div>
      </div>
      <a
        className={cx(ui.mBtn, ui.mBtnPrimary, styles.mBarBtn)}
        href={productWaLink(product, selectedSize, activePrice)} data-wa-origin="ficha-produto-barra" data-wa-product-id={product.id} data-wa-product-name={product.name}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MIcon.Wa/>
        Consultar via WhatsApp
      </a>
    </div>
  );
}

/* Texto com parágrafos separados por linha em branco; um parágrafo em que
 * toda linha começa com "- " vira lista. */
export function RichText({ text }) {
  return String(text)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, i) => {
      const lines = block.split('\n');
      if (lines.every((l) => /^\s*[-•]\s+/.test(l))) {
        return <ul key={i}>{lines.map((l, j) => <li key={j}>{l.replace(/^\s*[-•]\s+/, '')}</li>)}</ul>;
      }
      return (
        <p key={i}>
          {lines.map((l, j) => <Fragment key={j}>{j > 0 && <br/>}{l}</Fragment>)}
        </p>
      );
    });
}
