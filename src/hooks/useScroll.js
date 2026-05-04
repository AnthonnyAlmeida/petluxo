/* PetLuxo — Hook de efeitos de scroll
 * Encapsula:
 *   1. Scroll reveal via IntersectionObserver (elementos .reveal)
 *   2. Paralaxe sutil no logo card da hero
 */

import React from 'react';

export function useScrollEffects() {
  /* Scroll reveal */
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

  /* Paralaxe no logo card */
  React.useEffect(() => {
    const card = document.getElementById("logoCard");
    if (!card) return;
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      card.style.transform = `perspective(1200px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) translateZ(0)`;
    };
    const onLeave = () => { card.style.transform = ""; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);
}
