import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/page.jsx';
import './styles/variables.css';
import './styles/globals.css';
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

ReactDOM.createRoot(document.getElementById('app')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
