/* PetLuxo — App (página principal) */

import React from 'react';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Hero } from '../components/sections/Hero.jsx';
import { Featured } from '../components/sections/Featured.jsx';
import { Products } from '../components/sections/Products.jsx';
import { Story } from '../components/sections/Story.jsx';
import { Differentials } from '../components/sections/Differentials.jsx';
import { CTA } from '../components/sections/CTA.jsx';
import { ProductModal } from '../components/product/ProductModal.jsx';
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle } from '../tweaks-panel.jsx';
import { useScrollEffects } from '../hooks/useScroll.js';

const TWEAK_DEFAULTS = {
  accent: "dourado",
  showFab: true,
  showGrain: true,
  headerStyle: "discreto",
};

export default function App() {
  const [quick, setQuick] = React.useState(null);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  /* Efeitos de scroll e paralaxe */
  useScrollEffects();

  /* Aplica tweaks de tema */
  React.useEffect(() => {
    const root = document.documentElement;
    const accents = {
      dourado: { caramelo: "#B08968", dourado: "#C6A96B" },
      vinho:   { caramelo: "#6B1E2B", dourado: "#8B3344" },
      grafite: { caramelo: "#3F3A36", dourado: "#6B655F" },
    };
    const a = accents[tweaks.accent] || accents.dourado;
    root.style.setProperty("--caramelo", a.caramelo);
    root.style.setProperty("--dourado", a.dourado);

    document.getElementById("waFab").style.display = tweaks.showFab ? "" : "none";
    document.querySelector(".grain").style.display = tweaks.showGrain ? "" : "none";
  }, [tweaks]);

  return (
    <>
      <Navbar/>
      <main>
        <Hero/>
        <Featured/>
        <Products onQuick={setQuick}/>
        <Story/>
        <Differentials/>
        <CTA/>
      </main>
      <Footer/>
      <ProductModal product={quick} onClose={() => setQuick(null)}/>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Identidade">
          <TweakRadio
            label="Tom de acento"
            value={tweaks.accent}
            options={[
              { value: "dourado", label: "Dourado" },
              { value: "vinho",   label: "Vinho"   },
              { value: "grafite", label: "Grafite" },
            ]}
            onChange={v => setTweak("accent", v)}
          />
        </TweakSection>
        <TweakSection title="Atmosfera">
          <TweakToggle label="Botão WhatsApp flutuante" value={tweaks.showFab}   onChange={v => setTweak("showFab", v)}/>
          <TweakToggle label="Textura de papel (grão)"  value={tweaks.showGrain} onChange={v => setTweak("showGrain", v)}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

