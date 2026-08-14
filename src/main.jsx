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

ReactDOM.createRoot(document.getElementById('app')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
