/* PetLuxo — Products
 * Usa ProductGrid e os dados de PRODUCTS (src/data/products.js).
 */

import React from 'react';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';
import { PRODUCTS } from '../../data/products.js';
import { ProductGrid } from '../product/ProductGrid.jsx';

export function Products({ onQuick }) {
  const [active, setActive] = React.useState("Tudo");
  const cats = ["Tudo", "Coleiras", "Mesa", "Repouso", "Banho"];
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
          <div className="right reveal d2">
            {cats.map(c => (
              <button key={c} className={`cat-chip ${active === c ? "active" : ""}`} onClick={() => setActive(c)}>{c}</button>
            ))}
          </div>
        </div>

        <ProductGrid products={PRODUCTS} onQuick={onQuick} resetKey={active}/>

        <div className="reveal" style={{textAlign:"center", marginTop:80}}>
          <a className="btn btn-ghost" href={wa("Olá! Gostaria de ver mais produtos PetLuxo.")} target="_blank" rel="noopener">Ver mais produtos <Icon.ArrowR/></a>
        </div>
      </div>
    </section>
  );
}
