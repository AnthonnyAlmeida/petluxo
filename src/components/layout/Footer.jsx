/* PetLuxo — Footer (layout desktop, ≥ 768px)
 * Faixa escura: marca, frase, WhatsApp; colunas Políticas (com o botão
 * "Preferências de cookies", que reabre o banner de consentimento) e
 * Contato (e-mail e Instagram); linha legal com o CNPJ.
 * Abaixo de 768px: MobileFooter. */

import { Link } from 'react-router-dom';
import { Icon } from '../../icons.jsx';
import { wa } from '../../lib/whatsapp.js';
import { FOOTER, FOOTER_DESKTOP, POLICY_LINKS, WA_MESSAGES, openConsentPreferences } from '../../data/siteContent.js';
import { useIsMobile } from '../../hooks/useMediaQuery.js';
import { MobileFooter } from '../mobile/layout/MobileFooter.jsx';
import { BrandMark } from '../ui/BrandMark.jsx';
import styles from './Footer.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <rect x="3" y="3" width="18" height="18" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"/>
  </svg>
);

export function Footer() {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileFooter/>;

  return (
    <footer className={styles.foot}>
      <div className={cx('wrap', styles.inner)}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <BrandMark size="lg" seal={false}/>
            <p className={styles.tagline}>{FOOTER.tagline}</p>
            <a
              className={styles.waBtn}
              href={wa(WA_MESSAGES.general)} data-wa-origin="footer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon.Wa/>
              {FOOTER_DESKTOP.whatsapp}
            </a>
          </div>

          <div className={styles.cols}>
            <nav aria-label={FOOTER.policiesTitle} className={styles.col}>
              <p className={styles.colTitle}>{FOOTER.policiesTitle}</p>
              <ul className={styles.list}>
                {POLICY_LINKS.map((l) => (
                  <li key={l.to}><Link to={l.to} className={styles.link}>{l.label}</Link></li>
                ))}
                <li>
                  <button type="button" className={styles.link} onClick={openConsentPreferences}>
                    {FOOTER.cookiePrefs}
                  </button>
                </li>
              </ul>
            </nav>

            <div className={styles.col}>
              <p className={styles.colTitle}>{FOOTER.contactTitle}</p>
              <ul className={styles.list}>
                <li><a href={`mailto:${FOOTER.email}`} className={styles.link}>{FOOTER.email}</a></li>
                <li>
                  <a href={FOOTER.instagram} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <InstagramIcon/>
                    {FOOTER_DESKTOP.instagram}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className={styles.legal}>{FOOTER.legal}</p>
      </div>
    </footer>
  );
}
