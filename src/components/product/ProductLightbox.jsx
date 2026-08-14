/* PetLuxo — ProductLightbox
 * Visualizador de foto em tela cheia, exclusivo para dispositivos touch.
 * Carregado sob demanda (React.lazy em ProductGallery.jsx) — nunca baixado
 * por usuários sem input touch (pointer: coarse).
 */

import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import styles from './ProductLightbox.module.css';

export default function ProductLightbox({ open, close, images, index, alt, onIndexChange }) {
  const slides = React.useMemo(
    () => images.map((src, i) => ({ src, alt: `${alt} — foto ${i + 1}` })),
    [images, alt]
  );

  return (
    <Lightbox
      open={open}
      close={close}
      index={index}
      slides={slides}
      plugins={[Zoom]}
      className={styles.theme}
      carousel={{ finite: false }}
      controller={{ closeOnBackdropClick: true }}
      zoom={{
        // As fotos do catálogo (PRODUCT_DETAILS[id].gallery) vão de ~830px
        // a ~1536px no lado maior — resolução moderada. maxZoomPixelRatio:3
        // (padrão da lib) deixaria ampliar bem além da resolução nativa da
        // imagem, ficando visivelmente borrado; 2 dá uma ampliação útil sem
        // passar do ponto em que a foto perde nitidez.
        maxZoomPixelRatio: 2,
        zoomInMultiplier: 2,
        doubleTapDelay: 300,
        doubleClickMaxStops: 2,
        scrollToZoom: false,
      }}
      on={{ view: ({ index: i }) => onIndexChange?.(i) }}
    />
  );
}
