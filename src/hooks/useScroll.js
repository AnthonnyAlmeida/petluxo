/* PetLuxo — Hook de efeitos de scroll (home desktop)
 * Scroll reveal via IntersectionObserver: os elementos .reveal ganham .in
 * ao entrar na tela. A Hero não usa .reveal (fica visível de saída). */

import React from 'react';

export function useScrollEffects() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}
