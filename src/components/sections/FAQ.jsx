/* PetLuxo — FAQ (grid 2 colunas, accordion premium) */

import React from 'react';
import { Link } from 'react-router-dom';
import { wa } from '../../lib/whatsapp.js';
import { FAQS, TROCA_ANSWER, WA_MESSAGES, FOOTER } from '../../data/siteContent.js';
import styles from './FAQ.module.css';

const TROCA_ANSWER_JSX = (
  <>
    {TROCA_ANSWER.before}
    <Link to={TROCA_ANSWER.to} className={styles.faqLink}>
      {TROCA_ANSWER.linkText}
    </Link>
    {TROCA_ANSWER.after}
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
                  {item.a !== null ? item.a : TROCA_ANSWER_JSX}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={[styles.faqFooter, 'reveal d2'].filter(Boolean).join(' ')}>
          <p>
            Tem outra dúvida? Fale pelo{' '}
            <a
              href={wa(WA_MESSAGES.question)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.faqLink}
            >
              WhatsApp
            </a>
            {' '}ou pelo e-mail{' '}
            <a href={`mailto:${FOOTER.email}`} className={styles.faqLink}>
              {FOOTER.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
