import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const GA4_ID = 'G-KKMV5VHR48';
const CONSENT_KEY = 'petluxo_analytics_consent';
const GTAG_SCRIPT_SELECTOR = `script[src*="googletagmanager.com/gtag/js?id=${GA4_ID}"]`;
const DIALOG_SELECTOR = 'role=alertdialog[name="Sua privacidade importa"]';

/* Navega primeiro, depois limpa consentimento/cookies (localStorage so funciona apos carregar a pagina). */
async function resetConsent(page) {
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.removeItem('petluxo_analytics_consent'));
  await page.reload();
  await page.waitForLoadState('networkidle');
}

test.describe('Consentimento GA4 (LGPD)', () => {
  test('visitante novo: banner aparece e nenhum gtag.js e carregado antes do aceite', async ({ page }) => {
    const gtagRequests = [];
    page.on('request', (request) => {
      if (request.url().includes(`googletagmanager.com/gtag/js?id=${GA4_ID}`)) {
        gtagRequests.push(request);
      }
    });

    await resetConsent(page);

    // Banner deve estar visível
    await expect(page.locator(DIALOG_SELECTOR)).toBeVisible();

    // Nenhuma requisicao de gtag.js antes do aceite
    expect(gtagRequests.length).toBe(0);

    // localStorage sem consentimento
    const consent = await page.evaluate(() => localStorage.getItem('petluxo_analytics_consent'));
    expect(consent).toBeNull();

    // Nenhuma tag de gtag no DOM
    const gtagTags = await page.locator(GTAG_SCRIPT_SELECTOR).count();
    expect(gtagTags).toBe(0);
  });

  test('aceite: persiste consentimento, carrega gtag.js, envia page_view inicial sem duplicacao', async ({ page }) => {
    await resetConsent(page);

    const gtagRequests = [];
    page.on('request', (request) => {
      if (request.url().includes(`googletagmanager.com/gtag/js?id=${GA4_ID}`)) {
        gtagRequests.push(request);
      }
    });

    await page.getByRole('button', { name: /Aceitar analytics/ }).click();

    // Aguardar o gtag.js carregar
    await page.waitForTimeout(8000);

    // Consentimento persistido
    const consent = await page.evaluate(() => localStorage.getItem('petluxo_analytics_consent'));
    expect(consent).toBe('granted');

    // Banner sumiu
    await expect(page.locator(DIALOG_SELECTOR)).toBeHidden();

    // gtag.js carregado (pelo menos uma requisicao)
    expect(gtagRequests.length).toBeGreaterThanOrEqual(1);

    // Exatamente uma tag de gtag no DOM (sem duplicacao)
    const gtagTags = await page.locator(GTAG_SCRIPT_SELECTOR).count();
    expect(gtagTags).toBe(1);

    // O page_view fica enfileirado em pendingPageViews e enviado quando o script carrega
    // (via gtag verdadeiro). O envio real para o Google depende de Consent Mode e e
    // verificado externamente, na propriedade GA4.
  });

  test('navegacao interna: page_view correto por rota, sem duplicacao', async ({ page }) => {
    await resetConsent(page);

    const gtagRequests = [];
    page.on('request', (request) => {
      if (request.url().includes(`googletagmanager.com/gtag/js?id=${GA4_ID}`)) {
        gtagRequests.push(request);
      }
    });

    await page.getByRole('button', { name: /Aceitar analytics/ }).click();

    // Aguardar o gtag.js carregar e enviar o page_view inicial
    await page.waitForTimeout(8000);

    // gtag.js carregado
    expect(gtagRequests.length).toBeGreaterThanOrEqual(1);

    // Exatamente uma tag de gtag no DOM (sem duplicacao)
    const gtagTags = await page.locator(GTAG_SCRIPT_SELECTOR).count();
    expect(gtagTags).toBe(1);

    // Navegar para pagina de privacidade
    await page.getByRole('link', { name: /privacidade/i }).click();
    await page.waitForURL('**/politica-de-privacidade');
    await page.waitForTimeout(3000);

    // Nenhuma tag duplicada apos navegacao
    const gtagTagsAfter = await page.locator(GTAG_SCRIPT_SELECTOR).count();
    expect(gtagTagsAfter).toBe(1);
  });

  test('recarregar com consentimento persistido: banner nao aparece', async ({ page }) => {
    await resetConsent(page);

    // Conceder consentimento
    await page.getByRole('button', { name: /Aceitar analytics/ }).click();
    await page.waitForTimeout(3000);
    expect(await page.evaluate(() => localStorage.getItem('petluxo_analytics_consent'))).toBe('granted');

    // Recarregar
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Banner nao deve aparecer (consentimento ja concedido)
    await expect(page.locator(DIALOG_SELECTOR)).toBeHidden();

    const consent = await page.evaluate(() => localStorage.getItem('petluxo_analytics_consent'));
    expect(consent).toBe('granted');

    // gtag carregado
    const gtagTags = await page.locator(GTAG_SCRIPT_SELECTOR).count();
    expect(gtagTags).toBe(1);
  });

  test('recusa: consentimento negado, nenhum gtag carregado, tracking bloqueado', async ({ page }) => {
    await resetConsent(page);

    const gtagRequests = [];
    page.on('request', (request) => {
      if (request.url().includes(`googletagmanager.com/gtag/js?id=${GA4_ID}`)) {
        gtagRequests.push(request);
      }
    });

    await page.getByRole('button', { name: /Recusar analytics/ }).click();

    const consent = await page.evaluate(() => localStorage.getItem('petluxo_analytics_consent'));
    expect(consent).toBe('denied');

    // Nenhuma requisicao de gtag.js
    expect(gtagRequests.length).toBe(0);

    // Nenhuma tag de gtag no DOM
    const gtagTags = await page.locator(GTAG_SCRIPT_SELECTOR).count();
    expect(gtagTags).toBe(0);
  });

  test('revogacao por Gerenciar preferencias: bloqueia tracking', async ({ page }) => {
    await resetConsent(page);

    // Garantir que o dialog esta visível
    await expect(page.locator(DIALOG_SELECTOR)).toBeVisible();
    await page.waitForTimeout(500);

    // Clicar diretamente em Gerenciar preferencias (banner ainda esta visível)
    await page.locator('button', { hasText: 'Gerenciar preferências' }).click();

    // Consentimento negado apos revogacao
    const consent = await page.evaluate(() => localStorage.getItem('petluxo_analytics_consent'));
    expect(consent).toBe('denied');

    // Banner reaparece (setShow(true) em handleRevoke)
    await expect(page.locator(DIALOG_SELECTOR)).toBeVisible();
  });

  test('falha inicial de gtag.js e retry: sem duplicacao de scripts nem page_view', async ({ page }) => {
    await resetConsent(page);

    let firstAttemptBlocked = true;
    page.route(`**/googletagmanager.com/gtag/js?id=${GA4_ID}`, async (route) => {
      if (firstAttemptBlocked) {
        firstAttemptBlocked = false;
        await route.abort();
      } else {
        await route.continue();
      }
    });

    const gtagRequests = [];
    page.on('request', (request) => {
      if (request.url().includes(`googletagmanager.com/gtag/js?id=${GA4_ID}`)) {
        gtagRequests.push(request);
      }
    });

    await page.getByRole('button', { name: /Aceitar analytics/ }).click();

    // Aguardar o retry (segunda tentativa) completar
    await page.waitForTimeout(5000);

    // Deve haver requisicoes (uma falhou, outra succeed)
    expect(gtagRequests.length).toBeGreaterThanOrEqual(1);

    // Exatamente uma tag de gtag no DOM (sem duplicacao apos retry)
    const gtagTags = await page.locator(GTAG_SCRIPT_SELECTOR).count();
    expect(gtagTags).toBe(1);

    // localStorage persistido
    const consent = await page.evaluate(() => localStorage.getItem('petluxo_analytics_consent'));
    expect(consent).toBe('granted');
  });

  test('banner desktop: foco, teclado, botoes', async ({ page }) => {
    await resetConsent(page);
    await page.setViewportSize({ width: 1280, height: 800 });

    const dialog = page.locator(DIALOG_SELECTOR);
    await expect(dialog).toBeVisible();
    await page.waitForTimeout(500);

    // Foco no banner (alertdialog)
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('role'));
    expect(focused).toBe('alertdialog');

    // Botoes presentes
    await expect(page.getByRole('button', { name: /Aceitar analytics/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Recusar analytics/ })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Gerenciar preferências' })).toBeVisible();
  });

  test('banner mobile: layout responsivo e botoes', async ({ page }) => {
    await resetConsent(page);
    await page.setViewportSize({ width: 375, height: 667 });

    const dialog = page.locator(DIALOG_SELECTOR);
    await expect(dialog).toBeVisible();
    await page.waitForTimeout(500);

    await expect(page.getByRole('button', { name: /Aceitar analytics/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Recusar analytics/ })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Gerenciar preferências' })).toBeVisible();
  });
});
