/* PetLuxo — Button
 * Wrapper reutilizável para botões e links com estilo .btn.
 * Uso futuro — componentes existentes continuam usando HTML diretamente.
 */

import React from 'react';

export function Button({ variant = "primary", href, children, ...props }) {
  const cls = `btn btn-${variant}`;
  if (href) {
    return <a className={cls} href={href} {...props}>{children}</a>;
  }
  return <button className={cls} {...props}>{children}</button>;
}
