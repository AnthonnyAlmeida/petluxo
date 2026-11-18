/* PetLuxo — Products
 * Múltiplos carrosséis por categoria com expansão suave.
 * Busca + filtro por categoria: quando ativo, troca carrosséis por grid flat.
 */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { CATEGORIES } from '../../data/products.js';
import { BEST_SELLERS as featuredProducts, CATEGORIES_WITH_PRODUCTS as categoriesWithProducts, productsInCategory, searchProducts } from '../../lib/catalog.js';
import { WA_MESSAGES } from '../../data/siteContent.js';
import { ProductGrid } from '../product/ProductGrid.jsx';
import { ProductCard } from '../product/ProductCard.jsx';
import { CategorySelector } from '../ui/CategorySelector.jsx';
import { wa } from '../../lib/whatsapp.js';
import '../../styles/buttons.css';
import styles from './Products.module.css';

const extraCategories = CATEGORIES.filter(c => c.id !== 'mais-vendidos' && c.visible !== false);

export function Products({ asPage = false }) {
  const Heading = asPage ? 'h1' : 'h2';
  const [expanded, setExpanded] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState(null);
  const sectionRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const isFiltering = query.trim() !== '' || activeCategory !== null;

  const filteredProducts = React.useMemo(
    () => searchProducts(query.trim(), activeCategory),
    [query, activeCategory]
  );

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

  /* Mesmo padrão de handleCollapse: limpar a categoria troca `isFiltering`
   * para false e desmonta o grid de resultados, montando os carrosséis por
   * categoria. Sem o scroll o usuário ficaria numa posição arbitrária. */
  function handleExploreCategories() {
    setActiveCategory(null);
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
            <Heading className="serif reveal d1">
              Tudo que o seu <i className="italic gold-text">pet</i><br/>precisa.
            </Heading>
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

        {/* Desktop (≥ 641px): pills de categoria como estão */}
        <div className={styles.categoryFilterDesktop}>
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
        </div>

        {/* Mobile (≤ 640px): seletor fechado + bottom sheet */}
        <div className={styles.categoryFilterMobile}>
          <CategorySelector
            categories={categoriesWithProducts}
            value={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        {/* Modo filtro: grid flat de resultados */}
        {isFiltering ? (
          filteredProducts.length > 0 ? (
            <>
            <div className={styles.resultsGrid}>
              {filteredProducts.map((product, i) => (
                <div
                  key={product.id}
                  className={styles.resultCard}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Encerramento editorial — ponto final da seleção.
             * Só aparece na navegação por categoria (pill ou seletor mobile)
             * sem busca textual: com query ativa o texto "fim desta categoria"
             * mentiria, já que a categoria tem mais produtos fora do filtro.
             * A condição de `filteredProducts.length > 0` é garantida por este
             * branch — não é preciso repetir o teste. */}
            {activeCategory !== null && query.trim() === '' && (
              <div className={styles.endNotice}>
                <div className="section-tag">
                  <span className="line"></span><span>FIM DESTA SELEÇÃO</span>
                </div>
                <p className={[styles.endNoticeTitle, 'serif'].filter(Boolean).join(' ')}>
                  Você chegou ao fim desta categoria.
                </p>
                <button className="btn btn-ghost" onClick={handleExploreCategories}>
                  Explorar categorias <Icon.ArrowR/>
                </button>
              </div>
            )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyDot} aria-hidden="true">◆</span>
              <p className={[styles.emptyTitle, 'serif'].filter(Boolean).join(' ')}>Nenhum produto encontrado.</p>
              <p className={styles.emptySubtitle}>
                Tente outro termo ou{' '}
                <a
                  href={wa(WA_MESSAGES.searching)}
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
            <ProductGrid products={featuredProducts} title="Mais Vendidos" />

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
                  const catProducts = productsInCategory(cat.id);
                  if (!catProducts.length) return null;
                  return (
                    <div key={cat.id} className={styles.productsCategoryBlock}>
                      <ProductGrid
                        products={catProducts}
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
