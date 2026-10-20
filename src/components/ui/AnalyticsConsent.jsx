/* PetLuxo — Banner de consentimento para analytics (GA4/LGPD)
 *
 * Aviso discreto e acessível, apresentando opções equivalentes de aceitar
 * ou recusar analytics. Não condiciona navegação nem compra. Permite
 * revisar e revogar a escolha a qualquer momento.
 */

import React, { useEffect, useState } from 'react';
import {
  getConsent,
  setConsent,
  isConsentGranted,
  revokeConsent,
  initGA4,
} from '../../lib/analytics.js';
import styles from './AnalyticsConsent.module.css';

export default function AnalyticsConsent() {
  const [show, setShow] = useState(() => getConsent() === null);

  useEffect(() => {
    if (getConsent() !== null) {
      setShow(false);
    }
  }, []);

  const handleAccept = () => {
    setConsent('granted');
    setShow(false);
    initGA4();
  };

  const handleDeny = () => {
    setConsent('denied');
    setShow(false);
  };

  const handleRevoke = () => {
    revokeConsent();
    setShow(true);
  };

  if (!show) return null;

  return (
    <div
      className={styles.banner}
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
