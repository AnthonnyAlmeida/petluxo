/* PetLuxo — ProductPage (ficha de produto)
 * Abaixo de 768px: ficha mobile (com ficha em productDetails.js ou simples).
 * Desktop: galeria + informações (preço, variação, abas Descrição/Destaques,
 * WhatsApp, aviso de entrega, garantias), faixa "Por que escolher a
 * PetLuxo?" e, quando há ficha, "Detalhes da peça" em acordeão na ordem fixa:
 * specs → sizeChart → howToChooseSize → sizeGuideNote → whatsIncluded →
 * careInstructions → airTravelNote → warranty → faq. */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MinimalNavbar } from '../layout/MinimalNavbar.jsx';
import { Footer } from '../layout/Footer.jsx';
import { NotFoundPage } from '../sections/NotFound.jsx';
import { TrustBadges } from '../ui/TrustBadges.jsx';
import { BrandSeal } from '../ui/BrandSeal.jsx';
import { Accordion, AccordionItem } from '../ui/Accordion.jsx';
import { Icon } from '../../icons.jsx';
import { PRODUCTS } from '../../data/products.js';
import { PRODUCT_DETAILS } from '../../data/productDetails.js';
import { DELIVERY_NOTE, PRODUCT_PAGE_TEXT } from '../../data/siteContent.js';
import { SPEC_LABELS } from '../../data/specLabels.js';
import { useProductBuy } from '../../hooks/useProductBuy.js';
import { ProductSizeSelector } from '../product/ProductSizeSelector.jsx';
import { ProductBuyButton } from '../product/ProductBuyButton.jsx';
import { ProductGallery } from '../product/ProductGallery.jsx';
import { useIsMobile } from '../../hooks/useMediaQuery.js';
import MobileProductFull from '../mobile/product/MobileProductFull.jsx';
import MobileProductSimple from '../mobile/product/MobileProductSimple.jsx';
import styles from './ProductPage.module.css';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';
import { buildProductMeta } from '../../../worker/seo.js';

const cx = (...c) => c.filter(Boolean).join(' ');

export default function ProductPage() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === Number(id));
  const isMobile = useIsMobile();
  const visible = product && product.visible !== false;
  const meta = visible ? buildProductMeta(product) : null;
  // Navegação interna: o Worker só reescreve o HTML inicial.
  useDocumentHead({
    title: meta?.title,
    description: meta?.description,
    path: visible ? `/produto/${product.id}` : undefined,
  });

  if (!product || product.visible === false) {
    return <NotFoundPage/>;
  }

  /* Abaixo de 768px: ficha mobile (com ficha em productDetails.js ou simples). */
  if (isMobile) return <MobileProductPage product={product} />;

  return (
    <>
      <MinimalNavbar/>
      <ProductPageContent product={product} />
      <Footer/>
    </>
  );
}

function MobileProductPage({ product }) {
  const buy = useProductBuy(product);
  const details = PRODUCT_DETAILS[product.id];
  return details
    ? <MobileProductFull product={product} details={details} buy={buy} />
    : <MobileProductSimple product={product} buy={buy} />;
}

/* Abas Descrição / Destaques (padrão WAI-ARIA de abas: setas alternam).
 * Sem bullets, só a descrição; os dois painéis ficam no DOM. */
function ProductTabs({ description, bullets }) {
  const [tab, setTab] = React.useState('desc');
  const baseId = React.useId().replace(/:/g, '');
  const tabRefs = React.useRef({});
  const hasBullets = bullets?.length > 0;

  const bulletList = hasBullets && (
    <ul className={styles.bullets}>
      {bullets.map((b, i) => <li key={i}>{b}</li>)}
    </ul>
  );
  const descText = description && <p className={styles.description}>{description}</p>;

  if (!hasBullets || !description) return descText || bulletList || null;

  const tabs = [
    { id: 'desc', label: PRODUCT_PAGE_TEXT.tabDescription, panel: descText },
    { id: 'dest', label: PRODUCT_PAGE_TEXT.tabHighlights, panel: bulletList },
  ];

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = tab === 'desc' ? 'dest' : 'desc';
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className={styles.tabs}>
      <div role="tablist" aria-label={PRODUCT_PAGE_TEXT.tabsLabel} className={styles.tabList}>
        {tabs.map((t) => (
          <button
            key={t.id}
            ref={(el) => { tabRefs.current[t.id] = el; }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`${baseId}-panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            className={cx(styles.tab, tab === t.id && styles.tabOn)}
            onClick={() => setTab(t.id)}
            onKeyDown={onKeyDown}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${baseId}-panel-${t.id}`}
          aria-labelledby={`${baseId}-tab-${t.id}`}
          hidden={tab !== t.id}
          className={styles.tabPanel}
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}

/* "Como escolher o tamanho ideal": no Refúgio Cozy (id 2) o texto tem
 * introdução, lista e parágrafos separados por linha em branco. */
function HowToChooseSize({ product, details }) {
  const text = details.howToChooseSize;
  const isCozy = (product?.id === 2 || details?.id === 2);
  if (!isCozy) return <p className={styles.sectionText}>{text}</p>;

  const parts = text.split('\n\n');
  const intro = parts[0] || '';
  const listPart = parts[1] || '';
  const rest = parts.slice(2, 5).filter(Boolean);
  const listItems = listPart
    .split('\n')
    .map((l) => l.replace(/^[-•]\s*/, '').trim())
    .filter((l) => l);

  return (
    <div className={styles.sectionText}>
      <p>{intro}</p>
      {listItems.length > 0 && (
        <ul className={styles.sizeList}>
          {listItems.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}
      {rest.map((p) => <p key={p} className={styles.sizePara}>{p}</p>)}
    </div>
  );
}

function detailSections(product, details) {
  if (!details) return [];
  return [
    details.specs && Object.keys(details.specs).length > 0 && {
      id: 'specs',
      title: 'Especificações técnicas',
      body: (
        <dl className={styles.specsList}>
          {Object.entries(details.specs).map(([key, value]) => (
            <React.Fragment key={key}>
              <dt>{SPEC_LABELS[key] || key}</dt>
              <dd>{value}</dd>
            </React.Fragment>
          ))}
        </dl>
      ),
    },
    details.sizeChart?.length > 0 && {
      id: 'sizeChart',
      title: 'Tabela de medidas',
      body: (
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
      ),
    },
    details.howToChooseSize && {
      id: 'howToChooseSize',
      title: 'Como escolher o tamanho ideal',
      body: <HowToChooseSize product={product} details={details}/>,
    },
    details.sizeGuideNote && {
      id: 'sizeGuideNote',
      title: 'Guia de medidas',
      body: <p className={styles.sectionText}>{details.sizeGuideNote}</p>,
    },
    details.whatsIncluded?.length > 0 && {
      id: 'whatsIncluded',
      title: 'O que acompanha',
      body: (
        <ul className={styles.plainList}>
          {details.whatsIncluded.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      ),
    },
    details.careInstructions && {
      id: 'careInstructions',
      title: 'Limpeza e conservação',
      body: <p className={styles.sectionText}>{details.careInstructions}</p>,
    },
    details.airTravelNote && {
      id: 'airTravelNote',
      title: 'Uso em viagens aéreas',
      body: <p className={styles.sectionText}>{details.airTravelNote}</p>,
    },
    details.warranty && {
      id: 'warranty',
      title: 'Garantia',
      body: <p className={styles.sectionText}>{details.warranty}</p>,
    },
    details.faq?.length > 0 && {
      id: 'faq',
      title: 'Perguntas frequentes',
      body: (
        <div className={styles.faqList}>
          {details.faq.map((item, i) => (
            <div key={i} className={styles.faqItem}>
              <h4>{item.question}</h4>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      ),
    },
  ].filter(Boolean);
}

function ProductPageContent({ product }) {
  const { selectedSize, setSelectedSize, activeBuyLink, activePrice } = useProductBuy(product);
  const details = PRODUCT_DETAILS[product.id];
  const sections = detailSections(product, details);

  return (
    <main className={styles.page}>
      <div className={cx('wrap', styles.top)}>
        <Link to="/" className={styles.backLink}>
          <Icon.ArrowL/>
          {PRODUCT_PAGE_TEXT.back}
        </Link>

        <div className={styles.layout}>
          <div className={styles.galleryCol}>
            <ProductGallery
              key={product.id}
              images={details?.gallery?.length > 0 ? details.gallery : [product.image]}
              alt={product.name}
            />
          </div>

          <div className={styles.info}>
            <div className={styles.titleBlock}>
              <h1 className={styles.name}>{product.name}</h1>
              {product.subtitle && <p className={styles.subtitle}>{product.subtitle}</p>}
            </div>

            <div className={styles.priceBlock}>
              {product.originalPrice && (
                <s className={styles.priceOriginal}>{product.originalPrice}</s>
              )}
              {product.prices ? (
                <div className={styles.price}>
                  {product.buyLinks && selectedSize
                    ? activePrice
                      ? <div>{activePrice.size} — {activePrice.price}</div>
                      : null
                    : product.prices.map((p, i) => <div key={i}>{p.size} — {p.price}</div>)
                  }
                </div>
              ) : (
                <div className={styles.price}>{product.price}</div>
              )}
            </div>

            {product.buyLinks && (
              <ProductSizeSelector buyLinks={product.buyLinks} selectedSize={selectedSize} onSelect={setSelectedSize} variationType={product.variationType}/>
            )}

            <ProductTabs description={product.description} bullets={product.bullets}/>

            <div className={styles.buyStack}>
              <ProductBuyButton
                product={product}
                activeBuyLink={activeBuyLink}
                selectedSize={selectedSize}
                activePrice={activePrice}
              />
              <p className={styles.deliveryNote}>{DELIVERY_NOTE}</p>
              <TrustBadges/>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.sealBand}>
        <div className="wrap">
          <BrandSeal />
        </div>
      </section>

      {sections.length > 0 && (
        <section className={cx('wrap', styles.details)} aria-labelledby="details-title">
          <h2 id="details-title" className={styles.detailsTitle}>
            {PRODUCT_PAGE_TEXT.detailsStart} <em>{PRODUCT_PAGE_TEXT.detailsAccent}</em>
          </h2>
          <div className={styles.detailsBody}>
            <Accordion>
              {sections.map((s, i) => (
                <AccordionItem key={s.id} title={s.title} defaultOpen={i === 0}>
                  {s.body}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </main>
  );
}
