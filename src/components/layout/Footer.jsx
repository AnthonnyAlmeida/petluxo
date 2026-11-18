/* PetLuxo — Footer */

import { Link } from 'react-router-dom';
import { wa } from '../../lib/whatsapp.js';
import { FOOTER, POLICY_LINKS, WA_MESSAGES, openConsentPreferences } from '../../data/siteContent.js';
import { useIsMobile } from '../../hooks/useMediaQuery.js';
import { MobileFooter } from '../mobile/layout/MobileFooter.jsx';
import styles from './Footer.module.css';

export function Footer() {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileFooter/>;

  return (
    <footer className={styles.foot}>
      <div className="wrap">
        <div className={styles.footGrid}>
          <div>
            <div className={styles.footBrand}><i className="italic gold-text">Pet</i>Luxo</div>
            <p className={styles.footTag}>{FOOTER.tagline}</p>
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
            <h4>{FOOTER.policiesTitle}</h4>
            <ul>
              {POLICY_LINKS.map((l) => (
                <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
              ))}
              <li>
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={openConsentPreferences}
                >
                  {FOOTER.cookiePrefs}
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4>{FOOTER.contactTitle}</h4>
            <ul>
              <li><a href={wa(WA_MESSAGES.general)} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href={`mailto:${FOOTER.email}`}>{FOOTER.email}</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footSocial}>
          <a
            href={FOOTER.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footSocialLink}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" width="16" height="16" aria-hidden="true" style={{color: 'var(--vinho)'}}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
            Instagram
          </a>
        </div>

        <div className={styles.footBottom}>
          <span>{FOOTER.legal}</span>
        </div>
      </div>
    </footer>
  );
}
