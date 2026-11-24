/* PetLuxo — gato em traço espiando por trás da foto do Destaque. */

export function PeekingCat({ className, label }) {
  return (
    <svg
      className={className}
      width="120"
      height="96"
      viewBox="0 0 120 96"
      fill="none"
      stroke="#2A2522"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
    >
      <path d="M10 96V52c0-8 4-14 10-18l-2-24 20 12c6-2 14-2 20 0l20-12-2 24c6 4 10 10 10 18v44"/>
      <circle cx="42" cy="56" r="3" fill="#2A2522"/>
      <circle cx="78" cy="56" r="3" fill="#2A2522"/>
      <path d="M56 66l4 4 4-4"/>
    </svg>
  );
}
