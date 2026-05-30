/* PetLuxo — Products
 * Múltiplos carrosséis por categoria com expansão suave.
 * Busca + filtro por categoria: quando ativo, troca carrosséis por grid flat.
 */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { CATEGORIES, PRODUCTS } from '../../data/products.js';
import { ProductGrid } from '../product/ProductGrid.jsx';
import { ProductCard } from '../product/ProductCard.jsx';
import { wa } from '../../lib/whatsapp.js';
import '../../styles/buttons.css';
import styles from './Products.module.css';

const featuredProducts = PRODUCTS
  .filter(p => p.category.includes('mais-vendidos'))
  .sort((a, b) => (b.categoryOrder?.['mais-vendidos'] ?? 0) - (a.categoryOrder?.['mais-vendidos'] ?? 0));
const extraCategories  = CATEGORIES.filter(c => c.id !== 'mais-vendidos' && c.visible !== false);

// Categorias que têm pelo menos um produto (para pills de filtro)
const categoriesWithProducts = CATEGORIES.filter(cat =>
  cat.visible !== false && PRODUCTS.some(p => p.category.includes(cat.id))
);

export function Products({ onQuick }) {
  const [expanded, setExpanded] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState(null);
  const sectionRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const isFiltering = query.trim() !== '' || activeCategory !== null;

  const filteredProducts = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS
      .filter(p => {
        // Filtro de categoria
        if (activeCategory && !p.category.includes(activeCategory)) return false;
        // Filtro de busca por nome, label da categoria e tags
        if (q) {
          const catLabel = p.category.map(catId => {
            const cat = CATEGORIES.find(c => c.id === catId);
            return cat ? cat.label : '';
          }).join(' ');
          const searchable = [p.name, p.shortName, catLabel, ...(p.tags || [])].join(' ').toLowerCase();
          const words = q.split(/\s+/).filter(Boolean);
          if (!words.every(w => searchable.includes(w))) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const maxA = Math.max(...Object.values(a.categoryOrder ?? {}), 0);
        const maxB = Math.max(...Object.values(b.categoryOrder ?? {}), 0);
        return maxB - maxA;
      });
  }, [query, activeCategory]);

  // Re-observa elementos .reveal sempre que o estado muda (isFiltering, filteredProducts, expanded).
  // O useScrollEffects global roda apenas uma vez no mount — novos elementos montados pelo
  // React (cards do grid de resultados ou carrosséis remontados) nunca entram no observer global.
  // Este effect local garante que todos os .reveal da seção sejam observados após cada render.
  React.useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    const els = sectionRef.current.querySelectorAll('.reveal:not(.in)');
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [isFiltering, filteredProducts, expanded]);

  function handleCollapse() {
    setExpanded(false);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function clearSearch() {
    setQuery('');
    inputRef.current?.focus();
  }

  return (
    <section className="section-pad" id="produtos" ref={sectionRef}>
      <div className="wrap">
        <div className={styles.productsHead}>
          <div>
            <div className="section-tag reveal">
              <span className="num">02</span><span className="line"></span><span>NOSSOS PRODUTOS</span>
            </div>
            <h2 className="serif reveal d1">
              Tudo que o seu <i className="italic gold-text">pet</i><br/>precisa.
            </h2>
          </div>
        </div>

        {/* Barra de busca */}
        <div className={styles.searchWrap}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}><Icon.Search /></span>
            <input
              ref={inputRef}
              className={styles.searchInput}
              type="text"
              placeholder="Buscar produtos..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Buscar produtos"
            />
            {query && (
              <button className={styles.searchClear} onClick={clearSearch} aria-label="Limpar busca">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Pills de categoria */}
        <div className={styles.pillsWrap}>
          <div className={styles.pillsScroll}>
            <button
              className={[styles.pill, activeCategory === null && styles.pillActive].filter(Boolean).join(' ')}
              onClick={() => setActiveCategory(null)}
            >
              Todos
            </button>
            {categoriesWithProducts.map(cat => (
              <button
                key={cat.id}
                className={[styles.pill, activeCategory === cat.id && styles.pillActive].filter(Boolean).join(' ')}
                onClick={() => setActiveCategory(prev => prev === cat.id ? null : cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modo filtro: grid flat de resultados */}
        {isFiltering ? (
          filteredProducts.length > 0 ? (
            <div className={styles.resultsGrid}>
              {filteredProducts.map((product, i) => (
                <div
                  key={product.id}
                  className={styles.resultCard}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <ProductCard product={product} onQuick={onQuick} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyDot} aria-hidden="true">◆</span>
              <p className={[styles.emptyTitle, 'serif'].filter(Boolean).join(' ')}>Nenhum produto encontrado.</p>
              <p className={styles.emptySubtitle}>
                Tente outro termo ou{' '}
                <a
                  href={wa('Olá! Estou procurando um produto específico na PetLuxo.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.emptyLink}
                >
                  fale com a gente pelo WhatsApp
                </a>
                .
              </p>
            </div>
          )
        ) : (
          /* Modo padrão: carrosséis por categoria */
          <>
            <ProductGrid products={featuredProducts} onQuick={onQuick} title="Mais Vendidos" />

            {!expanded && (
              <div style={{textAlign:"center", marginTop:32}}>
                <button className="btn btn-ghost" onClick={() => setExpanded(true)}>
                  Ver mais produtos <Icon.ArrowR/>
                </button>
              </div>
            )}

            <div className={[styles.productsExpand, expanded && styles.productsExpandOpen].filter(Boolean).join(' ')}>
              <div className={styles.productsExpandInner}>
                {extraCategories.map(cat => {
                  const catProducts = PRODUCTS
                    .filter(p => p.category.includes(cat.id))
                    .sort((a, b) => (b.categoryOrder?.[cat.id] ?? 0) - (a.categoryOrder?.[cat.id] ?? 0));
                  if (!catProducts.length) return null;
                  return (
                    <div key={cat.id} className={styles.productsCategoryBlock}>
                      <ProductGrid
                        products={catProducts}
                        onQuick={onQuick}
                        title={cat.label}
                      />
                    </div>
                  );
                })}
                <div style={{textAlign:"center", marginTop:64, paddingBottom:8}}>
                  <button className="btn btn-ghost" onClick={handleCollapse}>
                    Ver menos <Icon.ArrowUp/>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
