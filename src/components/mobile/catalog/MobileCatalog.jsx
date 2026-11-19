/* PetLuxo — MobileCatalog (/produtos, abaixo de 768px)
 * Chips de categoria com filtro real (a categoria fica na URL:
 * /produtos?categoria=<id>), busca por nome/tags/categoria, grade de 2
 * colunas na ordem do site e "Ver mais produtos" (8 por vez). Os dados vêm
 * de lib/catalog.js: só produtos visíveis, 9 categorias, mesma ordenação do
 * desktop. Todo card leva à página do produto. */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MobileHeader } from '../layout/MobileHeader.jsx';
import { MobileTabBar } from '../layout/MobileTabBar.jsx';
import { MobileFooter } from '../layout/MobileFooter.jsx';
import { MIcon } from '../MobileIcons.jsx';
import { ProductBadge } from '../ui/ProductBadge.jsx';
import { CATEGORIES_WITH_PRODUCTS, catalogList, primaryCategoryLabel, splitPricePrefix } from '../../../lib/catalog.js';
import { wa } from '../../../lib/whatsapp.js';
import { WA_MESSAGES } from '../../../data/siteContent.js';
import ui from '../ui/MobileUI.module.css';
import styles from './MobileCatalog.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');
const PAGE = 8;

function ProductCardM({ product }) {
  const { prefix, value } = splitPricePrefix(product.price);
  return (
    <Link to={`/produto/${product.id}`} className={styles.mCatCard}>
      <div className={styles.mCatMedia}>
        <img className={styles.mCatImg} src={product.image} alt={product.name} loading="lazy" decoding="async"/>
        <ProductBadge badge={product.badge} className={styles.mCatBadge}/>
      </div>
      <div className={styles.mCatLabel}>{primaryCategoryLabel(product)}</div>
      <h3 className={styles.mCatName}>{product.shortName || product.name}</h3>
      {prefix && <div className={styles.mCatFrom}>{prefix}</div>}
      {product.originalPrice && <div className={styles.mCatWas}>{product.originalPrice}</div>}
      <div className={styles.mCatPrice}>{value}</div>
    </Link>
  );
}

export default function MobileCatalog() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('categoria');
  const category = CATEGORIES_WITH_PRODUCTS.some((c) => c.id === requested) ? requested : null;
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PAGE);
  const chipsRef = useRef(null);

  const list = useMemo(() => catalogList(query, category), [query, category]);
  const visible = list.slice(0, shown);

  useEffect(() => setShown(PAGE), [query, category]);

  /* mantém o chip ativo à vista (categoria vinda da URL ou da busca) */
  useEffect(() => {
    chipsRef.current?.querySelector('[aria-pressed="true"]')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [category]);

  const pick = (id) => {
    const next = new URLSearchParams(params);
    if (id) next.set('categoria', id);
    else next.delete('categoria');
    setParams(next, { replace: true });
  };

  return (
    <>
      <MobileHeader padded/>
      <main className={styles.mCat}>
        <div className={styles.mCatIntro}>
          <p className={ui.mEyebrow}><span className={ui.mEyebrowDot} aria-hidden="true"></span>Nossos produtos</p>
          <h1 className={styles.mCatTitle}>Tudo que o seu <em>pet</em> precisa.</h1>

          <label className={styles.mCatSearch}>
            <MIcon.Search size={20}/>
            <input
              className={styles.mCatInput}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar produtos"
              placeholder="Buscar produtos…"
              enterKeyHint="search"
              autoComplete="off"
            />
            {query && (
              <button type="button" className={styles.mCatClear} aria-label="Limpar busca" onClick={() => setQuery('')}>
                <MIcon.Close/>
              </button>
            )}
          </label>
        </div>

        <div className={styles.mCatChipsBar}>
          <div ref={chipsRef} className={cx(styles.mCatChips, ui.mNoScrollbar)} role="group" aria-label="Categorias">
            <button type="button" className={cx(styles.mCatChip, !category && styles.mCatChipOn)} aria-pressed={!category} onClick={() => pick(null)}>
              Todos
            </button>
            {CATEGORIES_WITH_PRODUCTS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={cx(styles.mCatChip, category === c.id && styles.mCatChipOn)}
                aria-pressed={category === c.id}
                onClick={() => pick(category === c.id ? null : c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <p className={ui.mSrOnly} role="status" aria-live="polite">
          {list.length === 1 ? '1 produto' : `${list.length} produtos`}
        </p>

        {list.length > 0 ? (
          <>
            <ul className={styles.mCatGrid}>
              {visible.map((p) => <li key={p.id}><ProductCardM product={p}/></li>)}
            </ul>
            {shown < list.length && (
              <button type="button" className={cx(ui.mBtn, ui.mBtnOutline, styles.mCatMore)} onClick={() => setShown((n) => n + PAGE)}>
                Ver mais produtos
                <MIcon.ArrowRight/>
              </button>
            )}
          </>
        ) : (
          <div className={styles.mCatEmpty}>
            <p className={styles.mCatEmptyTitle}>Nenhum produto encontrado.</p>
            <p className={styles.mCatEmptyText}>Tente outro termo ou fale com a gente pelo WhatsApp. Adoramos ajudar.</p>
            <a
              className={cx(ui.mBtn, ui.mBtnPrimary, styles.mCatEmptyBtn)}
              href={wa(WA_MESSAGES.searching)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MIcon.Wa/>
              Falar via WhatsApp
            </a>
          </div>
        )}
      </main>
      <MobileFooter/>
      <MobileTabBar/>
    </>
  );
}
