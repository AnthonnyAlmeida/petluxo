/* PetLuxo — Footer */

import React from 'react';
import { Link } from 'react-router-dom';
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
              <li><a href="#produtos">Explorar coleção</a></li>
            </ul>
          </div>
          <div>
            <h4>Sobre</h4>
            <ul>
              <li><a href="#sobre">Sobre nós</a></li>
              <li><a href="#diferenciais">Diferenciais</a></li>
              <li><Link to="/politica-de-privacidade">Política de Privacidade</Link></li>
              <li><Link to="/politica-de-troca-e-devolucao">Troca e Devolução</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contato</h4>
            <ul>
              <li><a href={wa("Olá!")} target="_blank" rel="noopener">WhatsApp</a></li>
              <li><a href="mailto:petluxo.service@gmail.com">petluxo.service@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 PETLUXO · CNPJ 23.833.930/0001-21</span>
          <div className="links">
            <a href="https://www.instagram.com/petluxo_produtospremium" target="_blank" rel="noopener">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
