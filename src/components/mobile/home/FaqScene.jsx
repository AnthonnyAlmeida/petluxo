/* PetLuxo — FaqScene
 * As 7 perguntas do FAQ do site (src/data/siteContent.js). Cada pergunta abre
 * a resposta numa folha inferior (BottomSheet: role="dialog", aria-modal,
 * foco preso, Esc e toque no fundo fecham). As respostas também ficam no DOM
 * com hidden="until-found". */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MIcon } from '../MobileIcons.jsx';
import { BottomSheet } from '../ui/BottomSheet.jsx';
import { useHiddenUntilFound } from '../../../hooks/useHiddenUntilFound.js';
import { wa } from '../../../lib/whatsapp.js';
import { FAQS, FAQ_TEXT, FOOTER, TROCA_ANSWER, WA_MESSAGES } from '../../../data/siteContent.js';
import ui from '../ui/MobileUI.module.css';
import styles from './FaqScene.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

function Answer({ item, onNavigate }) {
  if (item.a !== null) return item.a;
  return (
    <>
      {TROCA_ANSWER.before}
      <Link to={TROCA_ANSWER.to} className={styles.mFaqLink} onClick={onNavigate}>{TROCA_ANSWER.linkText}</Link>
      {TROCA_ANSWER.after}
    </>
  );
}

function FaqItem({ item, index, onOpen }) {
  const hiddenRef = useHiddenUntilFound(true, () => onOpen(index));
  return (
    <li>
      <button type="button" className={styles.mFaqQ} aria-haspopup="dialog" onClick={() => onOpen(index)}>
        <span>{item.q}</span>
        <MIcon.ChevronRight/>
      </button>
      <p ref={hiddenRef} className={styles.mFaqHiddenA}><Answer item={item}/></p>
    </li>
  );
}

export function FaqScene() {
  const [sel, setSel] = useState(null);
  const item = sel === null ? null : FAQS[sel];
  const close = () => setSel(null);

  return (
    <section className={styles.mFaq} aria-labelledby="m-faq-title">
      <p className={ui.mEyebrow}><span className={ui.mEyebrowDot} aria-hidden="true"></span>{FAQ_TEXT.label}</p>
      <h2 id="m-faq-title" className={styles.mFaqTitle}>{FAQ_TEXT.title}</h2>
      <p className={styles.mFaqSub}>{FAQ_TEXT.subtitle}</p>

      <ul className={styles.mFaqList}>
        {FAQS.map((f, i) => <FaqItem key={f.q} item={f} index={i} onOpen={setSel}/>)}
      </ul>

      <div className={styles.mFaqMore}>
        <p className={styles.mFaqMoreTitle}>{FAQ_TEXT.moreTitle}</p>
        <p className={styles.mFaqMoreText}>
          Fale pelo WhatsApp ou pelo e-mail{' '}
          <a className={styles.mFaqLink} href={`mailto:${FOOTER.email}`}>{FOOTER.email}</a>
        </p>
        <a
          className={cx(ui.mBtn, ui.mBtnPrimary, ui.mBtnLs12, styles.mFaqMoreBtn)}
          href={wa(WA_MESSAGES.question)} data-wa-origin="faq"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MIcon.Wa/>
          Falar via WhatsApp
        </a>
      </div>

      <BottomSheet open={item !== null} onClose={close} labelledBy="m-faq-sheet-q">
        {item && (
          <>
            <h2 id="m-faq-sheet-q" className={styles.mFaqSheetQ}>{item.q}</h2>
            <p className={styles.mFaqSheetA}><Answer item={item} onNavigate={close}/></p>
            <a
              className={cx(ui.mBtn, ui.mBtnPrimary, ui.mBtnLs12, styles.mFaqSheetWa)}
              href={wa(WA_MESSAGES.question)} data-wa-origin="faq"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MIcon.Wa/>
              Falar via WhatsApp
            </a>
            <button type="button" className={styles.mFaqSheetClose} onClick={close}>Fechar</button>
          </>
        )}
      </BottomSheet>
    </section>
  );
}
