import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto(process.env.BASE_URL || '');
  await expect(page).toHaveURL(process.env.BASE_URL || '');
});