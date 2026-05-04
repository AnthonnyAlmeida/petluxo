/* PetLuxo — Container
 * Wrapper reutilizável para o contêiner .wrap com largura máxima e padding.
 */

import React from 'react';

export function Container({ children, className, ...props }) {
  return (
    <div className={`wrap${className ? ` ${className}` : ""}`} {...props}>
      {children}
    </div>
  );
}
