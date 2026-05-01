import { test, expect } from '@playwright/test';

test('page loads and renders', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/chroma feels/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('button').first()).toBeVisible();
});
