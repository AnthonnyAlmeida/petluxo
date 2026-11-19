/* PetLuxo — MobileChrome: cabeçalho mobile + barra inferior, para as telas
 * que usam o Navbar desktop acima de 768px. */

import { MobileHeader } from './MobileHeader.jsx';
import { MobileTabBar } from './MobileTabBar.jsx';

export function MobileChrome() {
  return (
    <>
      <MobileHeader padded/>
      <MobileTabBar/>
    </>
  );
}
