import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for bragi (the website).
 *
 * Agents: `mise run e2e bragi` runs these. First time on a machine, install the
 * browser once: `pnpm exec playwright install chromium`.
 *
 * The config boots the Astro dev server itself (webServer) and reuses an already
 * running one, so the behavioral check is a single self-contained command.
 */
const PORT = Number(process.env.BRAGI_E2E_PORT ?? 4321);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `astro dev --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
