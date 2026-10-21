/* PetLuxo — Consentimento e rastreamento GA4 (LGPD)
 *
 * Gerencia a preferência do usuário sobre analytics e carrega o gtag.js
 * apenas quando houver autorização explícita. Não depende de bibliotecas
 * externas; persiste a escolha em localStorage.
 *
 * IDs de medição: o measurement ID GA4 (G-KKMV5VHR48) não é um segredo e
 * permanece hardcoded aqui (sem justificativa para mover a variável de
 * ambiente). Ele só é enviado ao navegador depois do consentimento.
 *
 * Limitações conhecidas (documentadas, não corrigidas aqui):
 * - Revogar o consentimento não remove o script gtag.js já executado no
 *   navegador. Uma vez carregado, o GA4 pode continuar operando por conta
 *   própria (ex.: Enhanced Measurement configurado na propriedade). Todas as
 *   funções de rastreamento deste módulo verificam isConsentGranted() antes
 *   de enviar qualquer evento.
 * - O Enhanced Measurement do GA4 pode enviar eventos independentemente do
 *   código do site. Isso exige Consent Mode ou ajuste direto na propriedade
 *   GA4; não é implementado automaticamente neste arquivo.
 */

const GA4_MEASUREMENT_ID = 'G-KKMV5VHR48';
const CONSENT_KEY = 'petluxo_analytics_consent';
const GRANTED = 'granted';
const DENIED = 'denied';

let gtagLoaded = false;
let gtagReady = false;
let gtagLoadError = false;
let gtagLoadPromise = null;
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

/* Revoga o consentimento: nega analytics e impede novos eventos via nossas
 * funções de rastreamento. Não remove o script gtag.js já executado — uma
 * vez carregado, o GA4 pode continuar operando por conta própria. Todas as
 * funções de rastreamento deste módulo verificam isConsentGranted() antes
 * de agir. Cookies _ga/_gid são expirados quando sob controle do site.
 */
export function revokeConsent() {
  setConsent(DENIED);
  gtagLoaded = false;
  gtagReady = false;
  gtagLoadError = false;

  try {
    document.cookie.split('; ').forEach((cookie) => {
      const name = cookie.split('=')[0];
      if (name.startsWith('_ga') || name.startsWith('_gid')) {
        removeAnalyticsCookie(name);
      }
    });
  } catch (e) {
    /* cookies inacessíveis: ignora */
  }
}

/* Expira um cookie de analytics tentando combinações de path/domain. Não
 * alega remover cookies que não estejam sob controle do site. Preserva o
 * domínio de produção (.petluxostory.com.br) e tenta o domínio atual. */
function removeAnalyticsCookie(name) {
  const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  const paths = ['path=/', 'path=/' ];
  const domains = [
    '', // sem atributo domain: corresponde ao host atual
    `; domain=${window.location.hostname || ''}`, // domínio atual explícito
    '; domain=.petluxostory.com.br', // domínio de produção
  ];
  domains.forEach((domain) => {
    try {
      document.cookie = `${name}=; ${expires}; ${paths[0]}${domain}`;
    } catch (e) {
      /* ignorar combinações inválidas */
    }
  });
}

/* Carrega o script gtag.js dinamicamente e retorna uma Promise.
 * Reusa o mesmo carregamento se já houver um em andamento e remove a tag
 * do DOM em caso de falha, permitindo uma nova tentativa real. */
function loadGtagScript() {
  if (gtagLoadPromise) return gtagLoadPromise;

  gtagLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}"]`
    );
    if (existing) {
      gtagLoadPromise = null;
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    script.onload = () => {
      gtagLoadPromise = null;
      resolve();
    };
    script.onerror = () => {
      gtagLoadPromise = null;
      script.remove(); // remove tag falha do DOM para permitir retry real
      reject(new Error(`Falha ao carregar gtag.js (${GA4_MEASUREMENT_ID})`));
    };
    document.head.appendChild(script);
  });

  return gtagLoadPromise;
}

/* Inicializa o GA4: configura dataLayer/gtag, carrega o script e envia o
 * config inicial com send_page_view: false para evitar o page_view automático
 * do GA4. O page_view é enviado explicitamente por trackPageView, garantindo
 * exatamente um page_view por carregamento/rota. Só deve ser chamado quando
 * o consentimento for granted.
 */
export function initGA4() {
  if (gtagLoaded || !isConsentGranted()) return;
  gtagLoaded = true;
  gtagLoadError = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());

  loadGtagScript()
    .then(() => {
      gtagReady = true;
      gtagLoadError = false;
      // Inicializa a propriedade sem disparar page_view automático
      window.gtag('config', GA4_MEASUREMENT_ID, { send_page_view: false });
      // Enfileira page views pendentes (navegação durante o carregamento)
      pendingPageViews.forEach((path) => {
  window.gtag('event', 'page_view', { page_path: path });
      });
      pendingPageViews.length = 0;
    })
    .catch(() => {
      gtagReady = false;
      gtagLoadError = true;
      gtagLoaded = false; // permite nova tentativa segura
    });
}

/* Envia um page_view para o caminho informado. Se o gtag ainda não estiver
 * pronto, enfileira para executar após a inicialização. Não faz nada se o
 * consentimento não for granted.
 */
export function trackPageView(path) {
  if (!isConsentGranted()) return;
  if (!gtagReady) {
    pendingPageViews.push(path);
    initGA4();
    return;
  }
  window.gtag('event', 'page_view', { page_path: path });
}

/* Limpa page views enfileirados (útil em testes ou reinicialização). */
export function clearPendingPageViews() {
  pendingPageViews.length = 0;
}

/* Retorna se houve falha no carregamento do gtag.js. */
export function isGtagLoadError() {
  return gtagLoadError;
}
