/* PetLuxo — Footer */

import React from 'react';
import { wa } from '../../lib/whatsapp.js';

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-brand"><i className="italic gold-text">Pet</i>Luxo</div>
            <p className="foot-tag">Produtos de qualidade para a vida com pets.</p>
          </div>
          <div>
            <h4>Produtos</h4>
            <ul>
              <li><a href="#produtos">Ver todos</a></li>
              <li><a href={wa("Olá! Gostaria de ver os produtos PetLuxo.")} target="_blank" rel="noopener">Pedir via WhatsApp</a></li>
            </ul>
          </div>
          <div>
            <h4>Sobre</h4>
            <ul>
              <li><a href="#sobre">Sobre nós</a></li>
              <li><a href="#diferenciais">Diferenciais</a></li>
            </ul>
          </div>
          <div>
            <h4>Contato</h4>
            <ul>
              <li><a href={wa("Olá!")} target="_blank" rel="noopener">WhatsApp</a></li>
              <li><a href="#">contato@petluxo.com</a></li>
              <li><a href="#">Entregas</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 PETLUXO · CNPJ 00.000.000/0001-00</span>
          <div className="links">
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
