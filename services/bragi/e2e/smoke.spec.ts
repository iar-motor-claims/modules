import { test, expect } from '@playwright/test';

/**
 * Smoke test — the minimal "the site renders" behavioral check.
 * This is the seed of the agent verification loop: extend it as bragi grows.
 */
test('homepage responds and renders', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.ok(), 'homepage should return a 2xx').toBeTruthy();

  // A document with a non-empty <body> is the baseline "it rendered" signal.
  await expect(page.locator('body')).not.toBeEmpty();
});
