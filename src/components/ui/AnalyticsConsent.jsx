/* PetLuxo — Banner de consentimento para analytics (GA4/LGPD)
 *
 * Aviso discreto e acessível, apresentando opções equivalentes de aceitar
 * ou recusar analytics. Não condiciona navegação nem compra. Permite
 * revisar e revogar a escolha a qualquer momento.
 */

import React, { useEffect, useRef, useState } from 'react';
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

  const handleAccept = () => {
    setConsent('granted');
    setShow(false);
    if (document.body) document.body.focus();
    initGA4();
    trackPageView(typeof window !== 'undefined' ? window.location.pathname : '/');
  };

  const handleDeny = () => {
    setConsent('denied');
    setShow(false);
    if (document.body) document.body.focus();
  };

  const handleRevoke = () => {
    revokeConsent();
    setShow(true);
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
      <div className={styles.content}>
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
          <button
            type="button"
            className={styles.btnRevise}
            onClick={handleRevoke}
          >
            Gerenciar preferências
          </button>
        </div>
      </div>
    </div>
  );
}
