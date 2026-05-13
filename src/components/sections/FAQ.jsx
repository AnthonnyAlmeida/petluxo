/* PetLuxo — FAQ (grid 2 colunas, accordion premium) */

import React from 'react';
import { Link } from 'react-router-dom';
import { wa } from '../../lib/whatsapp.js';

const FAQS = [
  {
    q: 'Os produtos são confortáveis para pets sensíveis?',
    a: 'Sim! Todos os produtos são selecionados pensando em conforto, segurança e bem-estar, com materiais de qualidade para uso diário.',
  },
  {
    q: 'Como acompanho meu pedido?',
    a: 'Quando disponível, enviaremos o código de rastreamento por e-mail após o despacho. Em caso de dúvida, entre em contato pelo WhatsApp.',
  },
  {
    q: 'Os produtos podem ser lavados?',
    a: 'Sim. Os produtos PetLuxo são feitos com materiais de fácil limpeza e higienização. Dúvidas específicas? Fale com a gente pelo WhatsApp.',
  },
  {
    q: 'Quanto tempo leva a entrega?',
    a: 'O pedido é processado em até 5 dias úteis. Após o despacho, o prazo estimado é de 7 a 15 dias úteis conforme a região.',
  },
  {
    q: 'Posso trocar o produto?',
    a: null, // renderizado via JSX abaixo
  },
  {
    q: 'Os produtos são iguais às fotos?',
    a: 'Sim. Trabalhamos para apresentar imagens fiéis aos produtos, garantindo que o que você vê é o que você recebe.',
  },
  {
    q: 'Como escolher o tamanho ideal?',
    a: 'Produtos com tamanhos disponíveis têm as opções descritas na página. Em dúvida, nossa equipe te ajuda pelo WhatsApp.',
  },
  {
    q: 'A compra é segura?',
    a: 'Sim! Os pagamentos são processados pelo PagBank, plataforma segura e certificada. Não armazenamos nenhuma informação de pagamento.',
  },
];

const TROCA_ANSWER = (
  <>
    Sim! Aceitamos trocas em até 7 dias corridos após o recebimento (produto sem uso, embalagem
    original). Em caso de defeito de fabricação, o prazo é de 90 dias. Consulte nossa{' '}
    <Link to="/politica-de-troca-e-devolucao" className="faq-link">
      Política de Troca e Devolução
    </Link>{' '}
    para mais detalhes.
  </>
);

export function FAQ() {
  const [open, setOpen] = React.useState(null);

  const toggle = (i) => setOpen(prev => prev === i ? null : i);

  return (
    <section className="faq section-pad" id="faq">
      <div className="wrap">
        <div className="faq-header reveal">
          <p className="faq-label">06 — DÚVIDAS FREQUENTES</p>
          <h2 className="serif faq-title">
            Perguntas Frequentes
          </h2>
          <p className="faq-subtitle"><i className="italic" style={{color: 'var(--caramelo)'}}>Tire suas dúvidas antes de comprar</i></p>
        </div>

        <div className="faq-grid reveal d1">
          {FAQS.map((item, i) => (
            <div
              key={i}
              className={`faq-item${open === i ? ' open' : ''}`}
              onClick={() => toggle(i)}
              role="button"
              tabIndex={0}
              aria-expanded={open === i}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle(i)}
            >
              <div className="faq-question">
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden="true">+</span>
              </div>
              <div className="faq-answer">
                <p className="faq-answer-text">
                  {item.a !== null ? item.a : TROCA_ANSWER}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-footer reveal d2">
          <p>
            Tem outra dúvida? Fale pelo{' '}
            <a
              href={wa('Olá! Tenho uma dúvida sobre os produtos PetLuxo.')}
              target="_blank"
              rel="noopener noreferrer"
              className="faq-link"
            >
              WhatsApp
            </a>
            {' '}ou pelo e-mail{' '}
            <a href="mailto:petluxo.service@gmail.com" className="faq-link">
              petluxo.service@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
