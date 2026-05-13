/* PetLuxo — App (página principal) */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Hero } from '../components/sections/Hero.jsx';
import { Featured } from '../components/sections/Featured.jsx';
import { Products } from '../components/sections/Products.jsx';
import { Story } from '../components/sections/Story.jsx';
import { Differentials } from '../components/sections/Differentials.jsx';
import { CTA } from '../components/sections/CTA.jsx';
import { NotFound } from '../components/sections/NotFound.jsx';
import { ProductModal } from '../components/product/ProductModal.jsx';
import PrivacyPage from '../components/pages/PrivacyPage.jsx';
import ReturnPolicyPage from '../components/pages/ReturnPolicyPage.jsx';
import { useScrollEffects } from '../hooks/useScroll.js';

/* TweaksPanel — carregado apenas em desenvolvimento.
 * O Vite elimina este import do bundle de produção via dead-code elimination
 * porque import.meta.env.DEV é uma constante false em build. */
const DevTweaks = import.meta.env.DEV
  ? React.lazy(() => import('./DevTweaks.jsx'))
  : null;

function HomePage() {
  const [quick, setQuick] = React.useState(null);

  /* Efeitos de scroll e paralaxe */
  useScrollEffects();

  return (
    <>
      <Navbar/>
      <main>
        <Hero/>
        <Featured/>
        <Products onQuick={setQuick}/>
        <Story/>
        <Differentials/>
        <CTA/>
      </main>
      <Footer/>
      <ProductModal product={quick} onClose={() => setQuick(null)}/>

      {import.meta.env.DEV && DevTweaks && (
        <React.Suspense fallback={null}>
          <DevTweaks/>
        </React.Suspense>
      )}
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/politica-de-privacidade" element={<PrivacyPage />} />
      <Route path="/politica-de-troca-e-devolucao" element={<ReturnPolicyPage />} />
      <Route path="*" element={
        <>
          <Navbar/>
          <main><NotFound/></main>
          <Footer/>
        </>
      } />
    </Routes>
  );
}

