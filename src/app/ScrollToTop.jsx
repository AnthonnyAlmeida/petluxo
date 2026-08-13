/* PetLuxo — ScrollToTop: reinicia o scroll ao topo a cada troca de rota */

import React from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    const scrollTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    scrollTop();
    /* Reafirma no próximo frame: uma rolagem suave (scroll-behavior: smooth)
     * ainda em andamento no momento da navegação (ex.: inércia de scroll do
     * usuário) pode continuar assentando por cima do reset acima. */
    const raf = requestAnimationFrame(scrollTop);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
