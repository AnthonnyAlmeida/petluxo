/* PetLuxo — App (página principal) */

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ScrollToTop } from './ScrollToTop.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Hero } from '../components/sections/Hero.jsx';
import { Featured } from '../components/sections/Featured.jsx';
import { Products } from '../components/sections/Products.jsx';
import { Story } from '../components/sections/Story.jsx';
import { Differentials } from '../components/sections/Differentials.jsx';
import { CTA } from '../components/sections/CTA.jsx';
import { FAQ } from '../components/sections/FAQ.jsx';
import { NotFoundPage } from '../components/sections/NotFound.jsx';
import ProductPage from '../components/pages/ProductPage.jsx';
import PrivacyPage from '../components/pages/PrivacyPage.jsx';
import ReturnPolicyPage from '../components/pages/ReturnPolicyPage.jsx';
import ShippingPolicyPage from '../components/pages/ShippingPolicyPage.jsx';
import TermsPage from '../components/pages/TermsPage.jsx';
import { useScrollEffects } from '../hooks/useScroll.js';
import { useIsMobile } from '../hooks/useMediaQuery.js';
import { useDocumentHead } from '../hooks/useDocumentHead.js';
import { trackPageView, isConsentGranted } from '../lib/analytics.js';
import AnalyticsConsent from '../components/ui/AnalyticsConsent.jsx';
import MobileHome from '../components/mobile/home/MobileHome.jsx';
import MobileCatalog from '../components/mobile/catalog/MobileCatalog.jsx';
import MobileSearch from '../components/mobile/search/MobileSearch.jsx';
import styles from './page.module.css';

/* TweaksPanel — carregado apenas em desenvolvimento.
 * O Vite elimina este import do bundle de produção via dead-code elimination
 * porque import.meta.env.DEV é uma constante false em build. */
const DevTweaks = import.meta.env.DEV
  ? React.lazy(() => import('./DevTweaks.jsx'))
  : null;

function DesktopHome() {
  /* Reveal dos elementos ao entrar na tela */
  useScrollEffects();

  return (
    <>
      <Navbar/>
      <main>
        <Hero/>
        <Featured/>
        <Products/>
        <Story/>
        <Differentials/>
        <CTA/>
        <FAQ/>
      </main>
      <Footer/>

      {import.meta.env.DEV && DevTweaks && (
        <React.Suspense fallback={null}>
          <DevTweaks/>
        </React.Suspense>
      )}
    </>
  );
}

function HomePage() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileHome/> : <DesktopHome/>;
}

const CATALOG_TITLE = 'Produtos | PetLuxo — Camas, coleiras de couro e acessórios premium';
const CATALOG_DESCRIPTION =
  'Catálogo PetLuxo: camas de luxo, coleiras de couro, comedouros e acessórios premium para cães e gatos. Escolha pela categoria e compre via WhatsApp.';

/* Catálogo em rota própria. Abaixo de 768px: catálogo mobile (chips e grade
 * de 2 colunas). Acima: a seção de produtos da home (busca, filtros e
 * carrosséis) com Navbar e Footer. */
function CatalogPage() {
  const isMobile = useIsMobile();
  useDocumentHead({
    title: CATALOG_TITLE,
    description: CATALOG_DESCRIPTION,
    path: '/produtos',
  });
  if (isMobile) return <MobileCatalog/>;
  return (
    <>
      <Navbar/>
      <main className={styles.catalogMain}>
        <Products asPage/>
      </main>
      <Footer/>
    </>
  );
}

/* Busca: só no mobile (o desktop tem a busca dentro de /produtos). */
function SearchPage() {
  const isMobile = useIsMobile();
  useDocumentHead({ robots: 'noindex, follow' });
  return isMobile ? <MobileSearch/> : <Navigate to="/produtos" replace/>;
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (isConsentGranted()) {
      trackPageView(location.pathname);
    }
  }, [location.pathname]);

  return (
    <>
    <ScrollToTop/>
    <AnalyticsConsent />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/produtos" element={<CatalogPage />} />
      <Route path="/buscar" element={<SearchPage />} />
      <Route path="/produto/:id" element={<ProductPage />} />
      <Route path="/politica-de-privacidade" element={<PrivacyPage />} />
      <Route path="/politica-de-troca-e-devolucao" element={<ReturnPolicyPage />} />
      <Route path="/politica-de-frete-e-entrega" element={<ShippingPolicyPage />} />
      <Route path="/termos-de-uso" element={<TermsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  );
}

