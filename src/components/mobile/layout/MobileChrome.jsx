/* PetLuxo — MobileChrome: cabeçalho mobile + barra inferior, para as telas
 * que usam o Navbar desktop acima de 768px. */

import { useNavigate } from 'react-router-dom';
import { MobileHeader } from './MobileHeader.jsx';
import { MobileTabBar } from './MobileTabBar.jsx';

export function MobileChrome() {
  const navigate = useNavigate();
  return (
    <>
      <MobileHeader padded/>
      <MobileTabBar onSearch={() => navigate('/produtos')}/>
    </>
  );
}
