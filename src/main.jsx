import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/page.jsx';
import './styles/variables.css';
import './styles/globals.css';
import './styles/animations.css'
import { wa } from './lib/whatsapp.js';

// Inicializa link do botão flutuante WhatsApp
const fab = document.getElementById('waFab');
if (fab) {
  fab.href = wa('Olá! Vim do site PetLuxo e gostaria de mais informações.');
}

// Restaura pathname gravado pelo 404.html (redirect SPA para Vercel)
const redirectPath = sessionStorage.getItem('redirect');
if (redirectPath) {
  sessionStorage.removeItem('redirect');
  window.history.replaceState(null, '', redirectPath);
}

// Bloqueia o pinch-zoom nativo do Safari/iOS fora do ProductLightbox.
//
// touch-action: pan-x pan-y (src/styles/globals.css) não é suficiente sozinho
// no Safari/iOS: o pinch-zoom de página aí é disparado pelos eventos
// gesturestart/gesturechange/gestureend, uma API proprietária do WebKit que
// existe fora do modelo de touch-action e não é coberta por ele (confirmado
// em código-fonte de terceiros e na documentação da própria WebKit —
// touch-action controla comportamentos padrão de touch/scroll, não a
// GestureEvent do WebKit). Nenhum outro motor de navegador (Chromium/Blink,
// Gecko) implementa esses três eventos — Chrome, Firefox, Edge e Samsung
// Internet tratam pinça como wheel event com ctrlKey, então este listener
// nunca executa nada ali; é um no-op garantido fora do Safari, sem precisar
// de detecção de navegador.
//
// O ProductLightbox (visualizador de foto em tela cheia) é a única exceção
// onde o zoom deve continuar funcionando — a checagem via closest() usa a
// classe raiz do yet-another-react-lightbox (.yarl__portal), que fica
// montada como portal direto em document.body enquanto o lightbox está
// aberto.
function isInsideLightbox(target) {
  return target instanceof Element && target.closest('[class*="yarl__portal"]') !== null;
}

function blockPinchZoomGesture(e) {
  if (isInsideLightbox(e.target)) return;
  e.preventDefault();
}

document.addEventListener('gesturestart', blockPinchZoomGesture, { passive: false });
document.addEventListener('gesturechange', blockPinchZoomGesture, { passive: false });
document.addEventListener('gestureend', blockPinchZoomGesture, { passive: false });

// Rede de segurança: se o pinch-zoom começar mesmo assim (o preventDefault
// acima compete com o reconhecimento nativo de gesto do WebKit — uma corrida
// que às vezes é perdida, de forma intermitente, deixando a página ampliada),
// a página volta sozinha para escala 1x assim que o usuário solta os dedos —
// sem exigir um double-tap manual para desfazer o zoom.
//
// Pesquisado antes de implementar (2026): não existe um método padronizado
// (tipo VisualViewport.resetScale()) para isso — foi discutido pelo CSSWG em
// 2024 mas nunca chegou a ser implementado por nenhum motor de navegador
// (confirmado na documentação atual do MDN: VisualViewport só expõe as
// propriedades scale/width/height/offsetLeft/offsetTop/pageLeft/pageTop e os
// eventos resize/scroll/scrollend — nenhum método de reset). O próprio grupo
// de trabalho reconhece a tensão de acessibilidade em permitir que um site
// force o zoom do usuário de volta, então a proposta ficou parada.
//
// Também não existe hoje forma de animar essa propriedade via CSS transition
// — scale do visual viewport não é uma propriedade CSS, é estado interno do
// motor de renderização. A técnica que de fato funciona (e é a mais usada em
// produção) é alternar o atributo content da <meta name="viewport"> forçando
// maximum-scale=1.0, o que faz o WebKit encaixar a escala atual de volta em
// 1x — mas isso acontece num único reflow, não como uma transição gradual.
// Não há hoje um jeito de deixar esse "encaixe" suave/gradual sem recorrer a
// truques paralelos (ex.: mascarar com fade de opacidade) que arriscam criar
// exatamente o tipo de "flash"/"flick screen" que se quer evitar — por isso
// a escolha aqui foi um reset direto e confiável, não uma imitação de
// suavidade que poderia piorar a experiência.
const metaViewport = document.querySelector('meta[name="viewport"]');
const originalViewportContent = metaViewport ? metaViewport.getAttribute('content') : null;
let isResettingPageZoom = false;

function resetPageZoomToNormal() {
  if (!metaViewport || isResettingPageZoom) return;
  if (document.querySelector('[class*="yarl__portal"]')) return; // lightbox aberto — nunca resetar aqui
  isResettingPageZoom = true;
  metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0');
  // Força um reflow síncrono antes de reverter — sem isso, o navegador pode
  // agrupar as duas escritas no atributo e nunca aplicar de fato o reset.
  void document.documentElement.offsetHeight;
  // Dois requestAnimationFrame em sequência garantem que o navegador já
  // pintou o quadro com a escala resetada antes de devolver o viewport ao
  // estado original (permitindo pinch-zoom de novo no próximo gesto).
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (originalViewportContent !== null) {
        metaViewport.setAttribute('content', originalViewportContent);
      }
      isResettingPageZoom = false;
    });
  });
}

// Gatilho principal: fim do gesto de pinça. gesturestart/gesturechange são
// exclusivos do WebKit (ver bloqueio acima), então esta chamada também é
// no-op garantido fora do Safari.
let lastGestureEndAt = 0;
document.addEventListener('gestureend', (e) => {
  if (isInsideLightbox(e.target)) return;
  // Alguns builds do WebKit disparam gestureend duas vezes para o mesmo
  // gesto (bug documentado) — ignora repetições dentro de 100ms.
  const now = Date.now();
  if (now - lastGestureEndAt < 100) return;
  lastGestureEndAt = now;
  resetPageZoomToNormal();
}, { passive: true });

// Gatilho de reforço: Visual Viewport API (suportada amplamente, inclusive
// no Safari desde 2021) — cobre o caso raro de gestureend não disparar por
// algum motivo. resize dispara sempre que a escala muda (durante e depois do
// gesto); um debounce de 150ms detecta quando a escala parou de mudar
// ("os dedos soltaram") sem depender só do evento de gesto do WebKit.
if (window.visualViewport) {
  let scaleSettleTimer = null;
  window.visualViewport.addEventListener('resize', () => {
    if (document.querySelector('[class*="yarl__portal"]')) return;
    clearTimeout(scaleSettleTimer);
    scaleSettleTimer = setTimeout(() => {
      if (window.visualViewport.scale !== 1 && !document.querySelector('[class*="yarl__portal"]')) {
        resetPageZoomToNormal();
      }
    }, 150);
  });
}

ReactDOM.createRoot(document.getElementById('app')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
