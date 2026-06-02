import { test, expect } from '@playwright/test';

const mockStorageList = [
  {
    name: 'crocodile-e2e-1.mp4',
    id: 'e2e-file-1',
    updated_at: '2026-01-01T00:00:00.000Z',
    created_at: '2026-01-01T00:00:00.000Z',
    last_accessed_at: '2026-01-01T00:00:00.000Z',
    metadata: {},
  },
];

test.describe('MR WHITEFLIX smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/storage/v1/object/list/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockStorageList),
      })
    );
  });

  test('home → crocodile → modal → close', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Pick an animal' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'MR WHITEFLIX' })).toBeVisible();

    await page.getByRole('link', { name: /Crocodile/i }).click();
    await expect(page).toHaveURL(/\/watch\/crocodile$/);
    await expect(page.getByRole('heading', { name: 'Crocodile' })).toBeVisible();

    const watchButton = page.getByRole('button', { name: /Watch Crocodile/i });
    await expect(watchButton).toBeVisible({ timeout: 15_000 });
    await watchButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: /Crocodile —/ })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('back home from category page', async ({ page }) => {
    await page.goto('/watch/crocodile');
    await page.getByRole('link', { name: 'Back home' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: 'Pick an animal' })).toBeVisible();
  });
});
