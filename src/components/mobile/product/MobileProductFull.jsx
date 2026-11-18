/* PetLuxo — MobileProductFull
 * Ficha completa (produto com entrada em productDetails.js): galeria com
 * snap + pontos + visualizador, preço por tamanho, destaques, acordeões
 * (Descrição, Especificações, Como escolher o tamanho, O que vem na compra,
 * Cuidados e garantia, Perguntas frequentes) e barra fixa de compra.
 * Dados de products.js e productDetails.js. Acordeão com um item aberto por
 * vez; o conteúdo dos fechados fica no DOM (hidden="until-found"). */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MIcon } from '../MobileIcons.jsx';
import { ProductBadge } from '../ui/ProductBadge.jsx';
import { MobileFooter } from '../layout/MobileFooter.jsx';
import { ImageViewer } from './ImageViewer.jsx';
import { BackButton, BuyBar, FreightNote, RichText, VariantPicker, priceView } from './MobileProductParts.jsx';
import { useHiddenUntilFound } from '../../../hooks/useHiddenUntilFound.js';
import { primaryCategoryLabel } from '../../../lib/catalog.js';
import { SPEC_LABELS } from '../../../data/specLabels.js';
import ui from '../ui/MobileUI.module.css';
import styles from './MobileProduct.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

function Accordion({ id, title, open, onOpen, onToggle, children }) {
  const panelRef = useHiddenUntilFound(!open, onOpen);
  return (
    <>
      <h2 className={styles.mAccHead}>
        <button type="button" id={`m-acc-${id}`} className={styles.mAccBtn} aria-expanded={open} aria-controls={`m-acc-panel-${id}`} onClick={onToggle}>
          {title}
          <MIcon.Plus className={cx(styles.mAccIcon, open && styles.mAccIconOpen)}/>
        </button>
      </h2>
      <div ref={panelRef} id={`m-acc-panel-${id}`} role="region" aria-labelledby={`m-acc-${id}`} className={styles.mAccPanel}>
        {children}
      </div>
    </>
  );
}

function Gallery({ images, alt, index, onIndex, onZoom }) {
  const trackRef = useRef(null);
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  /* o visualizador pode trocar a foto: leva a galeria para ela */
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    if (Math.round(el.scrollLeft / el.clientWidth) !== index) el.scrollTo({ left: index * el.clientWidth, behavior: 'auto' });
  }, [index]);

  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = trackRef.current;
      if (!el || !el.clientWidth) return;
      onIndex(Math.max(0, Math.min(images.length - 1, Math.round(el.scrollLeft / el.clientWidth))));
    });
  };

  return (
    <div className={styles.mGallery}>
      <div
        ref={trackRef}
        className={styles.mGalleryTrack}
        onScroll={onScroll}
        role="region"
        aria-label={`Fotos de ${alt}`}
        tabIndex={images.length > 1 ? 0 : undefined}
      >
        {images.map((src, i) => (
          <div key={src} className={styles.mSlide}>
            <img
              className={styles.mSlideImg}
              src={src}
              alt={`${alt}, foto ${i + 1} de ${images.length}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className={styles.mDots} aria-hidden="true">
          {images.map((src, i) => <span key={src} className={cx(styles.mDot, i === index && styles.mDotOn)}></span>)}
        </div>
      )}
      <button type="button" className={styles.mZoomBtn} aria-label="Ampliar foto" onClick={onZoom}>
        <MIcon.ZoomIn/>
      </button>
    </div>
  );
}

export default function MobileProductFull({ product, details, buy }) {
  const { selectedSize, setSelectedSize, activePrice } = buy;
  const [open, setOpen] = useState(null);
  const [index, setIndex] = useState(0);
  const [viewer, setViewer] = useState(false);

  const images = details.gallery?.length > 0 ? details.gallery : [product.image];
  const { label, value } = priceView(product, selectedSize, activePrice);

  /* peso indicado de cada tamanho, quando a ficha tem sizeChart */
  const weights = {};
  (details.sizeChart || []).forEach((row) => {
    if (row.weight && row.weight !== '—') weights[row.size] = row.weight;
  });

  const specs = details.specs ? Object.entries(details.specs) : [];
  const hasSize = details.howToChooseSize || details.sizeChart?.length > 0 || details.sizeGuideNote;
  const hasCare = details.careInstructions || details.airTravelNote || details.warranty;

  const sections = [
    { id: 'desc', title: 'Descrição', show: Boolean(product.description), body: <RichText text={product.description}/> },
    {
      id: 'specs', title: 'Especificações', show: specs.length > 0,
      body: (
        <dl className={styles.mSpecs}>
          {specs.map(([k, v]) => (
            <div key={k} style={{ display: 'contents' }}>
              <dt>{SPEC_LABELS[k] || k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: 'size', title: 'Como escolher o tamanho', show: Boolean(hasSize),
      body: (
        <>
          {details.howToChooseSize && <RichText text={details.howToChooseSize}/>}
          {details.sizeChart?.length > 0 && (
            <div className={styles.mTableWrap}>
              <table className={styles.mTable}>
                <thead>
                  <tr><th scope="col">Tamanho</th><th scope="col">Altura</th><th scope="col">Comprimento</th><th scope="col">Largura</th><th scope="col">Peso indicado</th></tr>
                </thead>
                <tbody>
                  {details.sizeChart.map((row) => (
                    <tr key={row.size}><td>{row.size}</td><td>{row.height}</td><td>{row.length}</td><td>{row.width}</td><td>{row.weight}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {details.sizeGuideNote && <RichText text={details.sizeGuideNote}/>}
        </>
      ),
    },
    {
      id: 'incl', title: 'O que vem na compra', show: details.whatsIncluded?.length > 0,
      body: <ul>{details.whatsIncluded?.map((item) => <li key={item}>{item}</li>)}</ul>,
    },
    {
      id: 'care', title: 'Cuidados e garantia', show: Boolean(hasCare),
      body: (
        <>
          {details.careInstructions && <RichText text={details.careInstructions}/>}
          {details.airTravelNote && <RichText text={details.airTravelNote}/>}
          {details.warranty && <RichText text={details.warranty}/>}
        </>
      ),
    },
    {
      id: 'faq', title: 'Perguntas frequentes', show: details.faq?.length > 0,
      body: details.faq?.map((f) => (
        <div key={f.question}>
          <h3 className={styles.mFaqQ}>{f.question}</h3>
          <p className={styles.mFaqA}>{f.answer}</p>
        </div>
      )),
    },
  ].filter((s) => s.show);

  return (
    <div className={styles.mProd}>
      <BackButton/>
      <Gallery images={images} alt={product.name} index={index} onIndex={setIndex} onZoom={() => setViewer(true)}/>

      <main>
        <div className={styles.mInfo}>
          <div className={styles.mMetaRow}>
            <ProductBadge badge={product.badge}/>
            <span className={styles.mMetaCat}>{primaryCategoryLabel(product)}</span>
          </div>

          <h1 className={styles.mName}>{product.name}</h1>
          {product.subtitle && <p className={styles.mSubtitle}>{product.subtitle}</p>}

          <div className={styles.mPriceBlock}>
            {label && <div className={styles.mPriceLabel}>{label}</div>}
            {product.originalPrice && <div className={styles.mPriceWas}>{product.originalPrice}</div>}
            <div className={styles.mPriceValue}>{value}</div>
            <FreightNote/>
          </div>

          <VariantPicker product={product} selectedSize={selectedSize} onSelect={setSelectedSize} weights={weights}/>

          {product.bullets?.length > 0 && (
            <ul className={styles.mBullets}>
              {product.bullets.map((b) => (
                <li key={b}><span className={styles.mBulletMark} aria-hidden="true"></span><span>{b}</span></li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.mAccs}>
          {sections.map((s) => (
            <Accordion key={s.id} id={s.id} title={s.title} open={open === s.id} onOpen={() => setOpen(s.id)} onToggle={() => setOpen(open === s.id ? null : s.id)}>
              {s.body}
            </Accordion>
          ))}
        </div>

        <Link to="/produtos" className={cx(ui.mBtn, ui.mBtnOutline, styles.mBackShop)}>
          <MIcon.ArrowLeft/>
          Voltar para a loja
        </Link>
      </main>

      <MobileFooter/>
      <BuyBar product={product} selectedSize={selectedSize} activePrice={activePrice}/>
      {viewer && <ImageViewer images={images} index={index} onIndex={setIndex} onClose={() => setViewer(false)} alt={product.name}/>}
    </div>
  );
}
