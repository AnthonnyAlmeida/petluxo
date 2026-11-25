/* PetLuxo — MobileSearch (/buscar, abaixo de 768px)
 * Campo no topo (foco automático). Sem texto: categorias (levam a
 * /produtos?categoria=<id>) e mais vendidos. Com texto: resultados reais
 * (nome, tags e categoria, sem acento) e, sem resultado, o WhatsApp.
 * "Cancelar" volta para a tela anterior (ou para a home se a busca foi o
 * primeiro endereço aberto). Sem barra inferior, como no design. */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MIcon } from '../MobileIcons.jsx';
import { BEST_SELLERS, CATEGORIES_WITH_PRODUCTS, primaryCategoryLabel, searchProducts } from '../../../lib/catalog.js';
import { wa } from '../../../lib/whatsapp.js';
import { WA_MESSAGES } from '../../../data/siteContent.js';
import ui from '../ui/MobileUI.module.css';
import styles from './MobileSearch.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

function Row({ product, large }) {
  return (
    <Link to={`/produto/${product.id}`} className={styles.mSearchRow}>
      <img className={cx(styles.mSearchThumb, large && styles.mSearchThumbLg)} src={product.image} alt="" loading="lazy" decoding="async"/>
      <span className={styles.mSearchInfo}>
        {large && <span className={styles.mSearchCatLabel}>{primaryCategoryLabel(product)}</span>}
        <span className={styles.mSearchName}>{product.shortName || product.name}</span>
        <span className={styles.mSearchPrice}>{product.price}</span>
      </span>
    </Link>
  );
}

export default function MobileSearch() {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => inputRef.current?.focus(), []);

  const results = useMemo(() => (query.trim() ? searchProducts(query) : []), [query]);
  const searching = query.trim().length > 0;

  const cancel = () => {
    // "default" é a chave da primeira entrada do histórico (sem página anterior)
    if (location.key !== 'default') navigate(-1);
    else navigate('/');
  };

  return (
    <div className={styles.mSearch}>
      <h1 className={ui.mSrOnly}>Buscar produtos</h1>
      <div className={styles.mSearchTop}>
        <label className={styles.mSearchBox}>
          <MIcon.Search size={20}/>
          <input
            ref={inputRef}
            className={styles.mSearchInput}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar produtos"
            placeholder="Buscar produtos…"
            enterKeyHint="search"
            autoComplete="off"
          />
          {searching && (
            <button type="button" className={styles.mSearchClear} aria-label="Limpar busca" onClick={() => { setQuery(''); inputRef.current?.focus(); }}>
              <MIcon.Close/>
            </button>
          )}
        </label>
        <button type="button" className={styles.mSearchCancel} onClick={cancel}>Cancelar</button>
      </div>

      <div className={styles.mSearchBody}>
        {!searching && (
          <>
            <h2 className={styles.mSearchLabel}>Categorias</h2>
            <ul className={styles.mSearchCats}>
              {CATEGORIES_WITH_PRODUCTS.map((c) => (
                <li key={c.id}>
                  <Link to={`/produtos?categoria=${c.id}`} className={styles.mSearchCat}>
                    {c.label}
                    <MIcon.ChevronRight/>
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className={cx(styles.mSearchLabel, styles.mSearchLabelPop)}>Mais vendidos</h2>
            <ul className={styles.mSearchList}>
              {BEST_SELLERS.map((p) => <li key={p.id}><Row product={p}/></li>)}
            </ul>
          </>
        )}

        {searching && (
          <>
            <p className={styles.mSearchCount} role="status" aria-live="polite">
              {results.length === 0 ? 'Nenhum produto encontrado' : results.length === 1 ? '1 produto' : `${results.length} produtos`}
            </p>
            <ul className={cx(styles.mSearchList, styles.mSearchListLoose)}>
              {results.map((p) => <li key={p.id}><Row product={p} large/></li>)}
            </ul>
            {results.length === 0 && (
              <div className={styles.mSearchEmpty}>
                <p className={styles.mSearchEmptyTitle}>Não achou o que procura?</p>
                <p className={styles.mSearchEmptyText}>Fale com a gente pelo WhatsApp. Adoramos ajudar.</p>
                <a
                  className={cx(ui.mBtn, ui.mBtnPrimary, styles.mSearchEmptyBtn)}
                  href={wa(WA_MESSAGES.searching)} data-wa-origin="busca-sem-resultado"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MIcon.Wa/>
                  Falar via WhatsApp
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
