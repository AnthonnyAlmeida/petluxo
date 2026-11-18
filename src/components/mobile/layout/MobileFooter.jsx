/* PetLuxo — MobileFooter: rodapé escuro do layout mobile.
 * Textos e links vêm de src/data/siteContent.js (os mesmos do Footer desktop). */

import { Link } from 'react-router-dom';
import { MIcon } from '../MobileIcons.jsx';
import { wa } from '../../../lib/whatsapp.js';
import { FOOTER, POLICY_LINKS, WA_MESSAGES, openConsentPreferences } from '../../../data/siteContent.js';
import styles from './MobileFooter.module.css';

export function MobileFooter() {
  return (
    <footer className={styles.mFoot}>
      <span className={styles.mFootRule} aria-hidden="true"></span>

      <div className={styles.mFootBrand}>
        <span className={styles.mFootDisc} aria-hidden="true"></span>
        <span className={styles.mFootName}>PETLUXO</span>
      </div>
      <p className={styles.mFootTag}>{FOOTER.tagline}</p>

      <h2 className={styles.mFootLabel}>{FOOTER.policiesTitle}</h2>
      <ul className={styles.mFootList}>
        {POLICY_LINKS.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className={styles.mFootRow}>
              <span>{l.label}</span>
              <MIcon.ChevronRight/>
            </Link>
          </li>
        ))}
        <li>
          <button type="button" className={styles.mFootRow} onClick={openConsentPreferences}>
            <span>{FOOTER.cookiePrefs}</span>
            <MIcon.ChevronRight/>
          </button>
        </li>
      </ul>

      <h2 className={[styles.mFootLabel, styles.mFootLabelContact].join(' ')}>{FOOTER.contactTitle}</h2>
      <div className={styles.mFootContacts}>
        <a className={styles.mFootContact} href={wa(WA_MESSAGES.general)} target="_blank" rel="noopener noreferrer">
          <MIcon.Wa size={20} strokeWidth={1.6}/>WhatsApp
        </a>
        <a className={styles.mFootContact} href={`mailto:${FOOTER.email}`}>
          <MIcon.Mail/>{FOOTER.email}
        </a>
        <a className={styles.mFootContact} href={FOOTER.instagram} target="_blank" rel="noopener noreferrer">
          <MIcon.Instagram/>Instagram
        </a>
      </div>

      <p className={styles.mFootLegal}>{FOOTER.legal}</p>
    </footer>
  );
}
