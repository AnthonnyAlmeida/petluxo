import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/page.jsx';
import './styles/variables.css';
import './styles/globals.css';
import { wa } from './lib/whatsapp.js';

// Inicializa link do botão flutuante WhatsApp
const fab = document.getElementById('waFab');
if (fab) {
  fab.href = wa('Olá! Vim do site PetLuxo e gostaria de mais informações.');
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
