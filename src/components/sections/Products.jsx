/* PetLuxo — Products
 * Múltiplos carrosséis por categoria com expansão suave.
 */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { CATEGORIES, PRODUCTS } from '../../data/products.js';
import { ProductGrid } from '../product/ProductGrid.jsx';

const featuredProducts = PRODUCTS.filter(p => p.category.includes('mais-vendidos'));
const extraCategories  = CATEGORIES.filter(c => c.id !== 'mais-vendidos');

export function Products({ onQuick }) {
  const [expanded, setExpanded] = React.useState(false);
  const sectionRef = React.useRef(null);

  function handleCollapse() {
    setExpanded(false);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <section className="section-pad" id="produtos" ref={sectionRef}>
      <div className="wrap">
        <div className="products-head">
          <div>
            <div className="section-tag reveal">
              <span className="num">02</span><span className="line"></span><span>NOSSOS PRODUTOS</span>
            </div>
            <h2 className="serif reveal d1">
              Tudo que o seu <i className="italic gold-text">pet</i><br/>precisa.
            </h2>
          </div>
        </div>

        <ProductGrid products={featuredProducts} onQuick={onQuick} title="Mais Vendidos" />

        {!expanded && (
          <div style={{textAlign:"center", marginTop:32}}>
            <button className="btn btn-ghost" onClick={() => setExpanded(true)}>
              Ver mais produtos <Icon.ArrowR/>
            </button>
          </div>
        )}

        <div className={`products-expand${expanded ? ' open' : ''}`}>
          <div className="products-expand-inner">
            {extraCategories.map(cat => {
              const catProducts = PRODUCTS.filter(p => p.category.includes(cat.id));
              if (!catProducts.length) return null;
              return (
                <div key={cat.id} className="products-category-block">
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
      </div>
    </section>
  );
}
