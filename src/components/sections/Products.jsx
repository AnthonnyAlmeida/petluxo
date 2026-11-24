/* PetLuxo — Products (layout desktop, ≥ 768px)
 * Carrossel "Mais Vendidos" + expansão com um carrossel por categoria.
 * Busca + filtro por categoria: quando ativos, os carrosséis dão lugar a um
 * grid de resultados. Na rota /produtos (`asPage`) o título vira h1.
 * O botão "Ver mais produtos / Ver menos" fica na linha dos filtros, como
 * no desenho; ao recolher, a seção volta ao topo. */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { CATEGORIES } from '../../data/products.js';
import { BEST_SELLERS as featuredProducts, CATEGORIES_WITH_PRODUCTS as categoriesWithProducts, productsInCategory, searchProducts } from '../../lib/catalog.js';
import { WA_MESSAGES } from '../../data/siteContent.js';
import { ProductGrid } from '../product/ProductGrid.jsx';
import { ProductCard } from '../product/ProductCard.jsx';
import { CategorySelector } from '../ui/CategorySelector.jsx';
import { SectionTag } from '../ui/SectionTag.jsx';
import { wa } from '../../lib/whatsapp.js';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery.js';
import '../../styles/buttons.css';
import styles from './Products.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

const extraCategories = CATEGORIES.filter(c => c.id !== 'mais-vendidos' && c.visible !== false);

export function Products({ asPage = false }) {
  const Heading = asPage ? 'h1' : 'h2';
  const SubHeading = asPage ? 'h2' : 'h3'; // títulos dos carrosséis, um nível abaixo
  const [expanded, setExpanded] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState(null);
  const sectionRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  const scrollBehavior = reduceMotion ? 'auto' : 'smooth';

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
      sectionRef.current.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
    }
  }

  /* Mesmo padrão de handleCollapse: limpar a categoria troca `isFiltering`
   * para false e desmonta o grid de resultados, montando os carrosséis por
   * categoria. Sem o scroll o usuário ficaria numa posição arbitrária. */
  function handleExploreCategories() {
    setActiveCategory(null);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
    }
  }

  function clearSearch() {
    setQuery('');
    inputRef.current?.focus();
  }

  return (
    <section className={styles.products} id="produtos" ref={sectionRef}>
      <div className={cx('wrap', styles.inner)}>
        <div className={styles.head}>
          <div className={styles.headText}>
            <SectionTag num="02" className="reveal">NOSSOS PRODUTOS</SectionTag>
            <Heading className={cx(styles.title, 'reveal', 'd1')}>
              Tudo que o seu <em>pet</em> precisa.
            </Heading>
          </div>

          {/* Busca */}
          <div className={styles.search}>
            <Icon.Search className={styles.searchIcon}/>
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
              <button type="button" className={styles.searchClear} onClick={clearSearch} aria-label="Limpar busca">
                <Icon.Close/>
              </button>
            )}
          </div>
        </div>

        <div className={styles.filterRow}>
          {/* ≥ 641px: pills de categoria (quebram linha quando não cabem) */}
          <div className={styles.categoryFilterDesktop}>
            <div className={styles.pills}>
              <button
                type="button"
                className={cx(styles.pill, activeCategory === null && styles.pillActive)}
                onClick={() => setActiveCategory(null)}
                aria-pressed={activeCategory === null}
              >
                Todos
              </button>
              {categoriesWithProducts.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  className={cx(styles.pill, activeCategory === cat.id && styles.pillActive)}
                  onClick={() => setActiveCategory(prev => prev === cat.id ? null : cat.id)}
                  aria-pressed={activeCategory === cat.id}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ≤ 640px: seletor fechado + bottom sheet */}
          <div className={styles.categoryFilterMobile}>
            <CategorySelector
              categories={categoriesWithProducts}
              value={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>

          {!isFiltering && (
            <button
              type="button"
              className={cx('btn', 'btn-ghost', styles.moreBtn)}
              onClick={expanded ? handleCollapse : () => setExpanded(true)}
              aria-expanded={expanded}
              aria-controls="produtos-mais"
            >
              {expanded ? 'Ver menos' : 'Ver mais produtos'}
              <Icon.ArrowDown className={cx(styles.moreIcon, expanded && styles.moreIconUp)}/>
            </button>
          )}
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
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>

            {/* Encerramento editorial — ponto final da seleção.
             * Só aparece na navegação por categoria (pill ou seletor mobile)
             * sem busca textual: com query ativa o texto "fim desta categoria"
             * mentiria, já que a categoria tem mais produtos fora do filtro. */}
            {activeCategory !== null && query.trim() === '' && (
              <div className={styles.endNotice}>
                <SectionTag>FIM DESTA SELEÇÃO</SectionTag>
                <p className={styles.endNoticeTitle}>
                  Você chegou ao fim desta categoria.
                </p>
                <button type="button" className="btn btn-ghost" onClick={handleExploreCategories}>
                  Explorar categorias <Icon.ArrowR/>
                </button>
              </div>
            )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyDot} aria-hidden="true">◆</span>
              <p className={styles.emptyTitle}>Nenhum produto encontrado.</p>
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
          <div>
            <ProductGrid products={featuredProducts} title="Mais Vendidos" titleAs={SubHeading} />

            <div
              id="produtos-mais"
              className={cx(styles.expand, expanded && styles.expandOpen)}
            >
              <div className={styles.expandInner}>
                {extraCategories.map(cat => {
                  const catProducts = productsInCategory(cat.id);
                  if (!catProducts.length) return null;
                  return (
                    <div key={cat.id} className={styles.categoryBlock}>
                      <ProductGrid
                        products={catProducts}
                        title={cat.label}
                        titleAs={SubHeading}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
