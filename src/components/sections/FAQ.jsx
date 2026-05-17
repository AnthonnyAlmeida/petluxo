/* PetLuxo — FAQ (grid 2 colunas, accordion premium) */

import React from 'react';
import { Link } from 'react-router-dom';
import { wa } from '../../lib/whatsapp.js';
import styles from './FAQ.module.css';

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
    <Link to="/politica-de-troca-e-devolucao" className={styles.faqLink}>
      Política de Troca e Devolução
    </Link>{' '}
    para mais detalhes.
  </>
);

export function FAQ() {
  const [open, setOpen] = React.useState(null);

  const toggle = (i) => setOpen(prev => prev === i ? null : i);

  return (
    <section className={[styles.faq, 'section-pad'].filter(Boolean).join(' ')} id="faq">
      <div className="wrap">
        <div className={[styles.faqHeader, 'reveal'].filter(Boolean).join(' ')}>
          <p className={styles.faqLabel}>06 — DÚVIDAS FREQUENTES</p>
          <h2 className={['serif', styles.faqTitle].filter(Boolean).join(' ')}>
            Perguntas Frequentes
          </h2>
          <p className={styles.faqSubtitle}><i className="italic" style={{color: 'var(--caramelo)'}}>Tire suas dúvidas antes de comprar</i></p>
        </div>

        <div className={[styles.faqGrid, 'reveal d1'].filter(Boolean).join(' ')}>
          {FAQS.map((item, i) => (
            <div
              key={i}
              className={[styles.faqItem, open === i && styles.faqItemOpen].filter(Boolean).join(' ')}
              onClick={() => toggle(i)}
              role="button"
              tabIndex={0}
              aria-expanded={open === i}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle(i)}
            >
              <div className={styles.faqQuestion}>
                <span>{item.q}</span>
                <span className={styles.faqIcon} aria-hidden="true">+</span>
              </div>
              <div className={styles.faqAnswer}>
                <p className={styles.faqAnswerText}>
                  {item.a !== null ? item.a : TROCA_ANSWER}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={[styles.faqFooter, 'reveal d2'].filter(Boolean).join(' ')}>
          <p>
            Tem outra dúvida? Fale pelo{' '}
            <a
              href={wa('Olá! Tenho uma dúvida sobre os produtos PetLuxo.')}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.faqLink}
            >
              WhatsApp
            </a>
            {' '}ou pelo e-mail{' '}
            <a href="mailto:petluxo.service@gmail.com" className={styles.faqLink}>
              petluxo.service@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
