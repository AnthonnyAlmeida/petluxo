/* PetLuxo — DevTweaks
 * Painel de ajustes de design em tempo real.
 * Este arquivo SÓ é carregado em desenvolvimento (import.meta.env.DEV).
 * Nunca entra no bundle de produção.
 */

import React from 'react';
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle } from '../tweaks-panel.jsx';

const TWEAK_DEFAULTS = {
  accent: "dourado",
  showFab: true,
  showGrain: true,
  headerStyle: "discreto",
};

export default function DevTweaks() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

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

    const fab = document.getElementById("waFab");
    const grain = document.querySelector(".grain");
    if (fab) fab.style.display = tweaks.showFab ? "" : "none";
    if (grain) grain.style.display = tweaks.showGrain ? "" : "none";
  }, [tweaks]);

  return (
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
  );
}
