/* PetLuxo — MobilePolicyLayout
 * Leitura das políticas abaixo de 768px: voltar + "Políticas", chips para as
 * 4 políticas (rotas atuais), título, "Última atualização", o TEXTO da página
 * (children, sem alteração) e o cartão de contato. A tela de Troca pode
 * receber `highlights` (os prazos que o próprio texto da política traz). */

import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MIcon } from '../MobileIcons.jsx';
import { MobileFooter } from '../layout/MobileFooter.jsx';
import { MobileTabBar } from '../layout/MobileTabBar.jsx';
import { wa } from '../../../lib/whatsapp.js';
import { FOOTER, POLICY_LINKS, WA_MESSAGES } from '../../../data/siteContent.js';
import ui from '../ui/MobileUI.module.css';
import styles from './MobilePolicyLayout.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

export function MobileSection({ title, children }) {
  return (
    <section className={styles.mPolSection}>
      <h2 className={styles.mPolSectionTitle}>{title}</h2>
      <div className={styles.mPolSectionBody}>{children}</div>
    </section>
  );
}

export function MobilePolicyLayout({ title, updated, highlights, children }) {
  const { pathname, key } = useLocation();
  const navigate = useNavigate();
  const chipsRef = useRef(null);

  useEffect(() => {
    chipsRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [pathname]);

  const back = () => (key !== 'default' ? navigate(-1) : navigate('/'));

  return (
    <div className={styles.mPol}>
      <div className={styles.mPolTop}>
        <button type="button" className={styles.mPolBack} aria-label="Voltar" onClick={back}>
          <MIcon.ArrowLeft size={22}/>
        </button>
        <span className={styles.mPolTopLabel}>Políticas</span>
      </div>

      <nav aria-label="Políticas">
        <div ref={chipsRef} className={styles.mPolChips}>
          {POLICY_LINKS.map((l) => {
            const on = l.to === pathname;
            return (
              <Link key={l.to} to={l.to} replace className={cx(styles.mPolChip, on && styles.mPolChipOn)} aria-current={on ? 'page' : undefined}>
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className={styles.mPolArticle}>
        <p className={ui.mEyebrow}><span className={ui.mEyebrowDot} aria-hidden="true"></span>Documento</p>
        <h1 className={styles.mPolTitle}>{title}</h1>
        <svg className={styles.mPolRule} viewBox="0 0 120 8" fill="none" aria-hidden="true" focusable="false">
          <path className={styles.mPolRulePath} d="M0 4 H112" stroke="#C6A96B" strokeWidth="1.2"/>
          <circle cx="116" cy="4" r="3" fill="#C6A96B"/>
        </svg>
        <p className={styles.mPolUpdated}>Última atualização: {updated}</p>

        {highlights && (
          <div className={styles.mPolHighlights}>
            {highlights.map((h) => (
              <div key={h.num} className={styles.mPolHighlight}>
                <div className={styles.mPolHighlightNum}>{h.num}</div>
                <div className={styles.mPolHighlightText}>{h.text}</div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.mPolBody}>{children}</div>

        <div className={styles.mPolMore}>
          <p className={styles.mPolMoreTitle}>Ficou alguma dúvida?</p>
          <p className={styles.mPolMoreText}>
            Fale pelo WhatsApp ou pelo e-mail <a href={`mailto:${FOOTER.email}`}>{FOOTER.email}</a>
          </p>
          <a className={cx(ui.mBtn, ui.mBtnPrimary, ui.mBtnLs12)} href={wa(WA_MESSAGES.question)} data-wa-origin="politica" target="_blank" rel="noopener noreferrer">
            <MIcon.Wa/>
            Falar via WhatsApp
          </a>
        </div>
      </main>

      <div className={styles.mPolFoot}><MobileFooter/></div>
      <MobileTabBar/>
    </div>
  );
}
