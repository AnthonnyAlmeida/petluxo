/* PetLuxo — App (página principal) */

import React from 'react';
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
import { useScrollEffects } from '../hooks/useScroll.js';

/* TweaksPanel — carregado apenas em desenvolvimento.
 * O Vite elimina este import do bundle de produção via dead-code elimination
 * porque import.meta.env.DEV é uma constante false em build. */
const DevTweaks = import.meta.env.DEV
  ? React.lazy(() => import('./DevTweaks.jsx'))
  : null;

/* Roteamento simples via pathname.
 * O public/404.html grava o pathname no sessionStorage e redireciona para /,
 * onde este hook restaura a rota correta. */
function useRoute() {
  const [path, setPath] = React.useState(() => {
    const redirected = sessionStorage.getItem('redirect');
    if (redirected) {
      sessionStorage.removeItem('redirect');
      return redirected;
    }
    return window.location.pathname;
  });
  React.useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

export default function App() {
  const [quick, setQuick] = React.useState(null);
  const route = useRoute();

  /* Efeitos de scroll e paralaxe */
  useScrollEffects();

  /* O site é single-page: só "/" é uma rota válida */
  const isHome = route === '/' || route === '';

  return (
    <>
      <Navbar/>
      {isHome ? (
        <main>
          <Hero/>
          <Featured/>
          <Products onQuick={setQuick}/>
          <Story/>
          <Differentials/>
          <CTA/>
        </main>
      ) : (
        <main>
          <NotFound/>
        </main>
      )}
      <Footer/>
      {isHome && <ProductModal product={quick} onClose={() => setQuick(null)}/>}

      {import.meta.env.DEV && DevTweaks && (
        <React.Suspense fallback={null}>
          <DevTweaks/>
        </React.Suspense>
      )}
    </>
  );
}

