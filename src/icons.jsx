import React from 'react';

export const Icon = {
  Search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="16" height="16" {...p}>
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
  ),
  Bag: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="16" height="16" {...p}>
      <path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>
    </svg>
  ),
  Wa: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...p}>
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.46 0 .12 5.34.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.27-1.65a11.9 11.9 0 0 0 5.77 1.47h.01c6.58 0 11.92-5.34 11.92-11.92 0-3.18-1.24-6.18-3.45-8.42ZM12.05 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.97 1-3.62-.24-.37a9.87 9.87 0 0 1-1.51-5.27c0-5.46 4.45-9.91 9.92-9.91a9.85 9.85 0 0 1 7.01 2.9 9.84 9.84 0 0 1 2.9 7.01c0 5.46-4.45 9.91-9.95 9.91Zm5.45-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.18-.24-.58-.49-.5-.66-.51l-.56-.01c-.2 0-.51.07-.78.37-.27.3-1.02 1-1.02 2.43 0 1.43 1.05 2.82 1.2 3.02.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.62.7.22 1.35.19 1.85.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.34Z"/>
    </svg>
  ),
  ArrowR: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="14" height="14" {...p}>
      <path d="M5 12h14M13 5l7 7-7 7"/>
    </svg>
  ),
  ArrowUp: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="14" height="14" {...p}>
      <path d="m7 17 10-10M9 7h8v8"/>
    </svg>
  ),
  Plus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="14" height="14" {...p}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Box: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5M12 13v8"/>
    </svg>
  ),
  Bone: (p) => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" {...p}>
      <path d="M8 12c-2 0-4-1.5-4-4s2-4 4-4 3 1.5 3 3.5c1.5-.5 3-.5 4 0 0-2 1.5-3.5 3-3.5s4 1.5 4 4-2 4-4 4l-1 .5L11 28l-3-2 4-13Z" opacity=".6"/>
    </svg>
  ),
  Paw: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <ellipse cx="6" cy="9" rx="2" ry="2.6"/><ellipse cx="18" cy="9" rx="2" ry="2.6"/>
      <ellipse cx="9" cy="5" rx="1.6" ry="2.2"/><ellipse cx="15" cy="5" rx="1.6" ry="2.2"/>
      <path d="M12 11c-3.5 0-6 2.5-6 5.5 0 2 1.5 3.5 3.5 3.5.8 0 1.5-.3 2.5-.8 1 .5 1.7.8 2.5.8 2 0 3.5-1.5 3.5-3.5 0-3-2.5-5.5-6-5.5Z"/>
    </svg>
  ),
};

export const PlaceholderArt = {
  collar: (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6">
      <circle cx="50" cy="50" r="32" stroke="#B08968"/>
      <circle cx="50" cy="50" r="22" stroke="#B08968" strokeDasharray="1 2"/>
      <circle cx="50" cy="82" r="4" fill="#C6A96B" stroke="none"/>
    </svg>
  ),
  bowl: (
    <svg viewBox="0 0 100 100" fill="none" stroke="#B08968" strokeWidth="0.6">
      <ellipse cx="50" cy="55" rx="34" ry="10"/>
      <path d="M16 55c0 14 15 24 34 24s34-10 34-24"/>
      <ellipse cx="50" cy="55" rx="24" ry="6" strokeDasharray="1 2"/>
    </svg>
  ),
  toy: (
    <svg viewBox="0 0 100 100" fill="none" stroke="#B08968" strokeWidth="0.6">
      <circle cx="32" cy="50" r="14"/><circle cx="68" cy="50" r="14"/>
      <rect x="32" y="44" width="36" height="12"/>
    </svg>
  ),
  bed: (
    <svg viewBox="0 0 100 100" fill="none" stroke="#B08968" strokeWidth="0.6">
      <path d="M14 70c0-12 16-22 36-22s36 10 36 22v6H14v-6Z"/>
      <ellipse cx="50" cy="68" rx="22" ry="6" strokeDasharray="1 2"/>
    </svg>
  ),
  perfume: (
    <svg viewBox="0 0 100 100" fill="none" stroke="#B08968" strokeWidth="0.6">
      <rect x="38" y="40" width="24" height="44" rx="2"/>
      <rect x="42" y="30" width="16" height="10"/>
      <line x1="46" y1="50" x2="54" y2="50"/>
      <line x1="46" y1="56" x2="54" y2="56"/>
    </svg>
  ),
  leash: (
    <svg viewBox="0 0 100 100" fill="none" stroke="#B08968" strokeWidth="0.6">
      <path d="M20 30c10 4 20 4 30 0s20-4 30 0c-6 14-20 22-30 22s-24-8-30-22Z"/>
      <path d="M50 52c0 10-2 20-6 30M50 52c0 10 2 20 6 30" strokeDasharray="2 3"/>
    </svg>
  ),
};
