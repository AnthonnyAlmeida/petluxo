/* PetLuxo — Pegada de pata em traço cheio (arte em código, usada no 404). */

export function Paw({ x, y, rotate = 0, className, style }) {
  return (
    <g className={className} style={style}>
      <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
        <path d="M0 2 C-5 2 -8 7 -4 10 C-2 11 2 11 4 10 C8 7 5 2 0 2 Z"/>
        <circle cx="-7" cy="-2" r="2.2"/>
        <circle cx="-2.6" cy="-6" r="2.2"/>
        <circle cx="2.6" cy="-6" r="2.2"/>
        <circle cx="7" cy="-2" r="2.2"/>
      </g>
    </g>
  );
}
