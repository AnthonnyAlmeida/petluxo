/* PetLuxo — Banner de consentimento para analytics (GA4/LGPD)
 *
 * Aviso discreto e acessível, apresentando opções equivalentes de aceitar
 * ou recusar analytics. Não condiciona navegação nem compra. Permite
 * revisar e revogar a escolha a qualquer momento.
 */

import { useEffect, useRef, useState } from 'react';
import {
  getConsent,
  setConsent,
  revokeConsent,
  initGA4,
  trackPageView,
} from '../../lib/analytics.js';
import styles from './AnalyticsConsent.module.css';

export default function AnalyticsConsent() {
  const [show, setShow] = useState(() => getConsent() === null);
  const bannerRef = useRef(null);

  useEffect(() => {
    if (getConsent() !== null) {
      setShow(false);
    }
  }, []);

  // Quando o banner aparece, move o foco para dentro dele (alertdialog)
  useEffect(() => {
    if (show && bannerRef.current) {
      bannerRef.current.focus();
    }
  }, [show]);

  // Permite reabrir o banner por fora (link "Preferências de cookies" no rodapé)
  useEffect(() => {
    const open = () => setShow(true);
    window.addEventListener('petluxo:open-consent', open);
    return () => window.removeEventListener('petluxo:open-consent', open);
  }, []);

  const handleAccept = () => {
    setConsent('granted');
    setShow(false);
    if (document.body) document.body.focus();
    initGA4();
    trackPageView(typeof window !== 'undefined' ? window.location.pathname : '/');
  };

  const handleDeny = () => {
    if (getConsent() === 'granted') {
      // O gtag.js já está em execução na página: só recarregar o encerra.
      revokeConsent();
      window.location.reload();
      return;
    }
    setConsent('denied');
    setShow(false);
    if (document.body) document.body.focus();
  };

  if (!show) return null;

  return (
    <div
      ref={bannerRef}
      className={styles.banner}
      tabIndex={-1}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="analytics-consent-title"
      aria-describedby="analytics-consent-desc"
    >
      <span className={styles.grip} aria-hidden="true"></span>
      <svg className={styles.rule} viewBox="0 0 342 8" preserveAspectRatio="xMinYMid meet" fill="none" aria-hidden="true" focusable="false">
        <path className={styles.rulePath} d="M0 4 H342" stroke="#C6A96B" strokeWidth="1.2"/>
        <circle cx="3" cy="4" r="3" fill="#C6A96B"/>
      </svg>
      <div className={styles.content}>
        <p className={styles.eyebrow} aria-hidden="true"><span className={styles.eyebrowDot}></span>Privacidade</p>
        <h3 id="analytics-consent-title" className={styles.title}>
          Sua privacidade importa
        </h3>
        <p id="analytics-consent-desc" className={styles.desc}>
          Usamos o Google Analytics para entender como o site é utilizado e
          melhorar sua experiência. Você pode aceitar ou recusar; sua escolha
          não afeta a navegação nem a compra.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnAccept}`}
            onClick={handleAccept}
          >
            Aceitar analytics
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDeny}`}
            onClick={handleDeny}
          >
            Recusar analytics
          </button>
        </div>
      </div>
    </div>
  );
}
