/* PetLuxo — ProductPage (ficha completa de produto) */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../layout/Navbar.jsx';
import { Footer } from '../layout/Footer.jsx';
import { NotFound } from '../sections/NotFound.jsx';
import { TrustBadges } from '../ui/TrustBadges.jsx';
import { BrandSeal } from '../ui/BrandSeal.jsx';
import { PRODUCTS } from '../../data/products.js';
import { PRODUCT_DETAILS } from '../../data/productDetails.js';
import { useProductBuy } from '../../hooks/useProductBuy.js';
import { ProductSizeSelector } from '../product/ProductSizeSelector.jsx';
import { ProductBuyButton } from '../product/ProductBuyButton.jsx';
import styles from './ProductPage.module.css';

const SPEC_LABELS = {
  materialExterno: 'Material externo',
  forracaoInterna: 'Forração interna',
  estrutura: 'Estrutura',
  ventilacao: 'Ventilação',
  seguranca: 'Segurança',
  tipoAlcas: 'Tipo de alças',
  fechamento: 'Fechamento',
  indicacaoUso: 'Indicação de uso',
};

export default function ProductPage() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === Number(id));

  if (!product || product.visible === false) {
    return (
      <>
        <Navbar/>
        <main><NotFound/></main>
        <Footer/>
      </>
    );
  }

  return (
    <>
      <Navbar/>
      <ProductPageContent product={product} />
      <Footer/>
    </>
  );
}

function ProductPageContent({ product }) {
  const { selectedSize, setSelectedSize, activeBuyLink, activePrice } = useProductBuy(product);
  const details = PRODUCT_DETAILS[product.id];

  return (
    <main className={styles.page}>
      <div className="wrap">
        <Link to="/" className={styles.backLink}>← Voltar para a loja</Link>

        <div className={styles.layout}>
          <div className={styles.gallery}>
            <div className={styles.mainImageWrap}>
              <img src={product.image} alt={product.name} className={styles.mainImage} />
            </div>
            {details?.gallery?.length > 0 && (
              <div className={styles.thumbs}>
                {details.gallery.map((src, i) => (
                  <img key={i} src={src} alt={`${product.name} — foto ${i + 2}`} className={styles.thumb} loading="lazy" />
                ))}
              </div>
            )}
          </div>

          <div className={styles.info}>
            <h1 className={['serif', styles.name].join(' ')}>{product.name}</h1>
            {product.subtitle && <p className={styles.subtitle}>{product.subtitle}</p>}

            {product.originalPrice && (
              <div className={styles.priceOriginal}>{product.originalPrice}</div>
            )}
            {product.prices ? (
              <div className={['price', 'serif', styles.price].join(' ')}>
                {product.buyLinks && selectedSize
                  ? activePrice
                    ? <div>{activePrice.size} — {activePrice.price}</div>
                    : null
                  : product.prices.map((p, i) => <div key={i}>{p.size} — {p.price}</div>)
                }
              </div>
            ) : (
              <div className={['price', 'serif', styles.price].join(' ')}>{product.price}</div>
            )}

            {product.buyLinks && (
              <ProductSizeSelector buyLinks={product.buyLinks} selectedSize={selectedSize} onSelect={setSelectedSize} />
            )}

            <p className={styles.description}>{product.description}</p>

            {product.bullets?.length > 0 && (
              <ul className={styles.bullets}>
                {product.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            )}

            <div className={styles.buyStack}>
              <ProductBuyButton product={product} activeBuyLink={activeBuyLink} />
              <TrustBadges variant="modal" />
            </div>
          </div>
        </div>

        <div className={styles.brandSealBlock}>
          <BrandSeal />
        </div>

        {details && (
          <div className={styles.details}>
            {details.specs && Object.keys(details.specs).length > 0 && (
              <section className={styles.section}>
                <h2 className="serif">Especificações técnicas</h2>
                <dl className={styles.specsList}>
                  {Object.entries(details.specs).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <dt>{SPEC_LABELS[key] || key}</dt>
                      <dd>{value}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </section>
            )}

            {details.sizeChart?.length > 0 && (
              <section className={styles.section}>
                <h2 className="serif">Tabela de medidas</h2>
                <div className={styles.tableWrap}>
                  <table className={styles.sizeTable}>
                    <thead>
                      <tr>
                        <th>Tamanho</th>
                        <th>Altura</th>
                        <th>Comprimento</th>
                        <th>Largura</th>
                        <th>Peso indicado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.sizeChart.map((row, i) => (
                        <tr key={i}>
                          <td>{row.size}</td>
                          <td>{row.height}</td>
                          <td>{row.length}</td>
                          <td>{row.width}</td>
                          <td>{row.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {details.howToChooseSize && (
              <section className={styles.section}>
                <h2 className="serif">Como escolher o tamanho ideal</h2>
                <p>{details.howToChooseSize}</p>
              </section>
            )}

            {details.whatsIncluded?.length > 0 && (
              <section className={styles.section}>
                <h2 className="serif">O que acompanha</h2>
                <ul className={styles.plainList}>
                  {details.whatsIncluded.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </section>
            )}

            {details.careInstructions && (
              <section className={styles.section}>
                <h2 className="serif">Limpeza e conservação</h2>
                <p>{details.careInstructions}</p>
              </section>
            )}

            {details.airTravelNote && (
              <section className={styles.section}>
                <h2 className="serif">Uso em viagens aéreas</h2>
                <p>{details.airTravelNote}</p>
              </section>
            )}

            {details.warranty && (
              <section className={styles.section}>
                <h2 className="serif">Garantia</h2>
                <p>{details.warranty}</p>
              </section>
            )}

            {details.faq?.length > 0 && (
              <section className={styles.section}>
                <h2 className="serif">Perguntas frequentes</h2>
                <div className={styles.faqList}>
                  {details.faq.map((item, i) => (
                    <div key={i} className={styles.faqItem}>
                      <h3>{item.question}</h3>
                      <p>{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
