import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  webServer: {
    command: 'npm run dev',
    port: 5173,
    baseURL: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    viewport: { width: 1280, height: 800 },
    launchOptions: {
      channel: 'chromium',
    },
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
