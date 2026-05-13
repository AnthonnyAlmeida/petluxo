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
            <p className="foot-tag">Sofisticação e conforto para quem ama seus pets.</p>
          </div>
          <div>
            <h4>Produtos</h4>
            <ul>
              <li><a href="#produtos">Ver todos</a></li>
            </ul>
          </div>
          <div>
            <h4>Sobre</h4>
            <ul>
              <li><a href="#sobre">Sobre nós</a></li>
              <li><a href="#diferenciais">Diferenciais</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4>Políticas</h4>
            <ul>
              <li><Link to="/politica-de-privacidade">Política de Privacidade</Link></li>
              <li><Link to="/politica-de-troca-e-devolucao">Troca e Devolução</Link></li>
              <li><Link to="/politica-de-frete-e-entrega">Frete e Entrega</Link></li>
              <li><Link to="/termos-de-uso">Termos de Uso</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contato</h4>
            <ul>
              <li><a href={wa("Olá! Vim do site PetLuxo e gostaria de mais informações.")} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href="mailto:petluxo.service@gmail.com">petluxo.service@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="foot-social">
          <a
            href="https://www.instagram.com/petluxostory/"
            target="_blank"
            rel="noopener noreferrer"
            className="foot-social-link"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="16" height="16" aria-hidden="true" style={{color: 'var(--vinho)'}}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
            Instagram
          </a>
          <a className="foot-social-link" aria-label="PagBank Pagamento Seguro">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="16" height="16" aria-hidden="true">
              <rect x="3" y="10" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 10V7a5 5 0 0 1 10 0v3"/>
            </svg>
            PagBank
          </a>
        </div>

        <div className="foot-bottom">
          <span>© 2026 PETLUXO · CNPJ 23.833.930/0001-21</span>
        </div>
      </div>
    </footer>
  );
}
