/* PetLuxo — Section
 * Wrapper reutilizável para seções com padding padrão .section-pad.
 */

import React from 'react';

export function Section({ children, className, ...props }) {
  return (
    <section className={`section-pad${className ? ` ${className}` : ""}`} {...props}>
      {children}
    </section>
  );
}
