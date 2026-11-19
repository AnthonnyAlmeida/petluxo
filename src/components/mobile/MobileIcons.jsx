/* PetLuxo — Ícones de traço do redesign mobile (desenhados em código).
 * Todos herdam a cor por `currentColor` e são decorativos (aria-hidden);
 * o nome acessível fica no botão ou link que os contém. */

const base = (size, strokeWidth) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
});

export const MIcon = {
  Home: ({ size = 24, ...p }) => (
    <svg {...base(size, 1.6)} {...p}><path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/></svg>
  ),
  Grid: ({ size = 24, ...p }) => (
    <svg {...base(size, 1.6)} {...p}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/>
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>
    </svg>
  ),
  Search: ({ size = 24, ...p }) => (
    <svg {...base(size, 1.6)} {...p}><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>
  ),
  ZoomIn: ({ size = 20, ...p }) => (
    <svg {...base(size, 1.7)} {...p}><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/><path d="M11 8.5v5"/><path d="M8.5 11h5"/></svg>
  ),
  Wa: ({ size = 18, strokeWidth = 1.7, ...p }) => (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5z"/>
      <path d="M9 9.2c.3 2.6 2.4 4.8 5.2 5.5l1.2-1.3-1.9-1-.9.7c-.9-.4-1.6-1.1-2-2l.7-.9-1-1.9z"/>
    </svg>
  ),
  ArrowRight: ({ size = 18, ...p }) => (
    <svg {...base(size, 1.8)} {...p}><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
  ),
  ArrowLeft: ({ size = 18, strokeWidth = 1.8, ...p }) => (
    <svg {...base(size, strokeWidth)} {...p}><path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></svg>
  ),
  ChevronRight: ({ size = 18, ...p }) => (
    <svg {...base(size, 1.8)} {...p}><path d="M9 6l6 6-6 6"/></svg>
  ),
  ChevronUp: ({ size = 18, ...p }) => (
    <svg {...base(size, 1.8)} {...p}><path d="M6 15l6-6 6 6"/></svg>
  ),
  Plus: ({ size = 20, ...p }) => (
    <svg {...base(size, 1.8)} {...p}><path d="M12 5v14"/><path d="M5 12h14"/></svg>
  ),
  Close: ({ size = 18, ...p }) => (
    <svg {...base(size, 1.8)} {...p}><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>
  ),
  Mail: ({ size = 20, ...p }) => (
    <svg {...base(size, 1.6)} {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4 7.5l8 6 8-6"/></svg>
  ),
  Instagram: ({ size = 20, ...p }) => (
    <svg {...base(size, 1.6)} {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/>
      <circle cx="17" cy="7" r="0.8" fill="currentColor"/>
    </svg>
  ),
  Truck: ({ size = 16, ...p }) => (
    <svg {...base(size, 1.6)} {...p}>
      <path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>
    </svg>
  ),
  Tap: ({ size = 14, ...p }) => (
    <svg {...base(size, 1.6)} {...p}>
      <path d="M9 11V5a2 2 0 0 1 4 0v6"/><path d="M13 10a2 2 0 0 1 4 0v3a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-2-3a1.6 1.6 0 0 1 2.4-2L9 14"/>
    </svg>
  ),
};
