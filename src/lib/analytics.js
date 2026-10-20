/* PetLuxo — Consentimento e rastreamento GA4 (LGPD)
 *
 * Gerencia a preferência do usuário sobre analytics e carrega o gtag.js
 * apenas quando houver autorização explícita. Não depende de bibliotecas
 * externas; persiste a escolha em localStorage.
 *
 * IDs de medição: o measurement ID GA4 (G-KKMV5VHR48) não é um segredo e
 * permanece hardcoded aqui (sem justificativa para mover a variável de
 * ambiente). Ele só é enviado ao navegador depois do consentimento.
 */

const GA4_MEASUREMENT_ID = 'G-KKMV5VHR48';
const CONSENT_KEY = 'petluxo_analytics_consent';
const GRANTED = 'granted';
const DENIED = 'denied';

let gtagLoaded = false;
let gtagReady = false;
const pendingPageViews = [];

export const ANALYTICS_ID = GA4_MEASUREMENT_ID;

/* Lê a preferência salva. Retorna 'granted', 'denied' ou null (não decidido). */
export function getConsent() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(CONSENT_KEY);
  if (raw === GRANTED || raw === DENIED) return raw;
  return null;
}

/* Salva a preferência. value: 'granted' | 'denied' */
export function setConsent(value) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, value);
}

/* Verifica se o consentimento foi concedido. */
export function isConsentGranted() {
  return getConsent() === GRANTED;
}

/* Revoga o consentimento: nega analytics, impede novos eventos e trata
 * cookies de analytics já existentes quando tecnicamente possível. */
export function revokeConsent() {
  setConsent(DENIED);
  gtagLoaded = false;
  gtagReady = false;

  try {
    document.cookie.split('; ').forEach((cookie) => {
      const name = cookie.split('=')[0];
      if (name.startsWith('_ga') || name.startsWith('_gid')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.petluxostory.com.br`;
      }
    });
  } catch (e) {
    /* cookies inacessíveis: ignora */
  }
}

/* Carrega o script gtag.js dinamicamente e retorna uma Promise. */
function loadGtagScript() {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}"]`
    );
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Falha ao carregar gtag.js (${GA4_MEASUREMENT_ID})`));
    document.head.appendChild(script);
  });
}

/* Inicializa o GA4: configura dataLayer/gtag, carrega o script e envia o
 * config inicial. Só deve ser chamado quando o consentimento for granted. */
export function initGA4() {
  if (gtagLoaded || !isConsentGranted()) return;
  gtagLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());

  loadGtagScript()
    .then(() => {
      gtagReady = true;
      window.gtag('config', GA4_MEASUREMENT_ID);
      pendingPageViews.forEach((path) => {
        window.gtag('config', GA4_MEASUREMENT_ID, { page_path: path });
      });
      pendingPageViews.length = 0;
    })
    .catch(() => {
      gtagReady = false;
    });
}

/* Envia um page_view para o caminho informado. Se o gtag ainda não estiver
 * pronto, enfileira para executar após a inicialização. Não faz nada se o
 * consentimento não for granted. */
export function trackPageView(path) {
  if (!isConsentGranted()) return;
  if (!gtagReady) {
    pendingPageViews.push(path);
    initGA4();
    return;
  }
  window.gtag('config', GA4_MEASUREMENT_ID, { page_path: path });
}

/* Limpa page views enfileirados (útil em testes ou reinicialização). */
export function clearPendingPageViews() {
  pendingPageViews.length = 0;
}
