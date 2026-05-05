/* PetLuxo — Products
 * Múltiplos carrosséis por categoria com expansão suave.
 */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { CATEGORIES, PRODUCTS } from '../../data/products.js';
import { ProductGrid } from '../product/ProductGrid.jsx';

const featuredProducts  = PRODUCTS.filter(p => p.category === 'mais-vendidos');
const extraCategories   = CATEGORIES.filter(c => c.id !== 'mais-vendidos');

export function Products({ onQuick }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <section className="section-pad" id="produtos">
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

        <ProductGrid products={featuredProducts} onQuick={onQuick} />

        {!expanded && (
          <div className="reveal" style={{textAlign:"center", marginTop:56}}>
            <button className="btn btn-ghost" onClick={() => setExpanded(true)}>
              Ver mais produtos <Icon.ArrowR/>
            </button>
          </div>
        )}

        <div className={`products-expand${expanded ? ' open' : ''}`}>
          <div className="products-expand-inner">
            {extraCategories.map(cat => {
              const catProducts = PRODUCTS.filter(p => p.category === cat.id);
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
          </div>
        </div>
      </div>
    </section>
  );
}
