/* PetLuxo — Ícones de traço do layout desktop.
 * Decorativos por padrão (aria-hidden): o nome acessível fica no botão ou
 * link que os contém. Herdam a cor por currentColor. */

const line = (size, strokeWidth) => ({
  viewBox: '0 0 24 24',
  width: size,
  height: size,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
});

export const Icon = {
  Search: (p) => (
    <svg {...line(18, 1.5)} {...p}><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
  ),
  /* Balão de conversa (WhatsApp) em traço, como no desenho */
  Wa: (p) => (
    <svg {...line(16, 1.6)} {...p}><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5z"/></svg>
  ),
  ArrowR: (p) => (
    <svg {...line(16, 1.6)} {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  ),
  ArrowL: (p) => (
    <svg {...line(16, 1.5)} {...p}><path d="M19 12H5M11 5l-7 7 7 7"/></svg>
  ),
  ArrowDown: (p) => (
    <svg {...line(16, 1.5)} {...p}><path d="M12 5v14M5 12l7 7 7-7"/></svg>
  ),
  Plus: (p) => (
    <svg {...line(20, 1.6)} {...p}><path d="M12 5v14M5 12h14"/></svg>
  ),
  /* Selos e faixa de confiança (traço 1.5, 20px por padrão) */
  Shield: (p) => (
    <svg {...line(20, 1.5)} {...p}><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/></svg>
  ),
  Truck: (p) => (
    <svg {...line(20, 1.5)} {...p}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a1.5 1.5 0 1 0 0-.01M17 19a1.5 1.5 0 1 0 0-.01"/></svg>
  ),
  Star: (p) => (
    <svg {...line(20, 1.5)} {...p}><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.7 6.7 19.6l1.1-6L3.4 9.4l6-.8z"/></svg>
  ),
  Heart: (p) => (
    <svg {...line(20, 1.5)} {...p}><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z"/></svg>
  ),
  Rays: (p) => (
    <svg {...line(20, 1.5)} {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/></svg>
  ),
  /* Garantias da ficha (traço 1.6, 14px por padrão) */
  Lock: (p) => (
    <svg {...line(14, 1.6)} {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
  ),
  Return: (p) => (
    <svg {...line(14, 1.6)} {...p}><path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/></svg>
  ),
  Box: (p) => (
    <svg {...line(14, 1.6)} {...p}><path d="M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8"/></svg>
  ),
  Chevron: (p) => (
    <svg {...line(16, 1.4)} {...p}><path d="m6 9 6 6 6-6"/></svg>
  ),
  Close: (p) => (
    <svg {...line(14, 1.6)} {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>
  ),
};
