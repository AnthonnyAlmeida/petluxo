/* PetLuxo — ProductPage (ficha completa de produto) */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../layout/Navbar.jsx';
import { MinimalNavbar } from '../layout/MinimalNavbar.jsx';
import { Footer } from '../layout/Footer.jsx';
import { NotFound } from '../sections/NotFound.jsx';
import { TrustBadges } from '../ui/TrustBadges.jsx';
import { BrandSeal } from '../ui/BrandSeal.jsx';
import { Accordion, AccordionItem } from '../ui/Accordion.jsx';
import { PRODUCTS } from '../../data/products.js';
import { PRODUCT_DETAILS } from '../../data/productDetails.js';
import { useProductBuy } from '../../hooks/useProductBuy.js';
import { ProductSizeSelector } from '../product/ProductSizeSelector.jsx';
import { ProductBuyButton } from '../product/ProductBuyButton.jsx';
import { ProductGallery } from '../product/ProductGallery.jsx';
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
  superficieArranhador: 'Superfície do arranhador',
  capacidade: 'Capacidade',
  montagem: 'Montagem',
  ajusteAltura: 'Ajuste de altura',
  dimensoes: 'Dimensões',
  peso: 'Peso',
  tamanho: 'Tamanho',
  material: 'Material',
  formato: 'Formato',
  tipo: 'Tipo',
  cor: 'Cor',
  modelos: 'Modelos',
  caracteristicas: 'Características',
  estilo: 'Estilo',
  diametroTigela: 'Diâmetro da tigela',
  materialSuporte: 'Material do suporte',
  design: 'Design',
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
      <MinimalNavbar/>
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
          <ProductGallery
            images={details?.gallery?.length > 0 ? details.gallery : [product.image]}
            alt={product.name}
          />

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
            <Accordion>
              {details.specs && Object.keys(details.specs).length > 0 && (
                <AccordionItem title="Especificações técnicas">
                  <dl className={styles.specsList}>
                    {Object.entries(details.specs).map(([key, value]) => (
                      <React.Fragment key={key}>
                        <dt>{SPEC_LABELS[key] || key}</dt>
                        <dd>{value}</dd>
                      </React.Fragment>
                    ))}
                  </dl>
                </AccordionItem>
              )}

              {details.sizeChart?.length > 0 && (
                <AccordionItem title="Tabela de medidas">
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
                </AccordionItem>
              )}

              {details.howToChooseSize && (
                <AccordionItem title="Como escolher o tamanho ideal">
                  <p className={styles.sectionText}>{details.howToChooseSize}</p>
                </AccordionItem>
              )}

              {details.whatsIncluded?.length > 0 && (
                <AccordionItem title="O que acompanha">
                  <ul className={styles.plainList}>
                    {details.whatsIncluded.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </AccordionItem>
              )}

              {details.careInstructions && (
                <AccordionItem title="Limpeza e conservação">
                  <p className={styles.sectionText}>{details.careInstructions}</p>
                </AccordionItem>
              )}

              {details.airTravelNote && (
                <AccordionItem title="Uso em viagens aéreas">
                  <p className={styles.sectionText}>{details.airTravelNote}</p>
                </AccordionItem>
              )}

              {details.warranty && (
                <AccordionItem title="Garantia">
                  <p className={styles.sectionText}>{details.warranty}</p>
                </AccordionItem>
              )}

              {details.faq?.length > 0 && (
                <AccordionItem title="Perguntas frequentes">
                  <div className={styles.faqList}>
                    {details.faq.map((item, i) => (
                      <div key={i} className={styles.faqItem}>
                        <h4>{item.question}</h4>
                        <p>{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        )}
      </div>
    </main>
  );
}
