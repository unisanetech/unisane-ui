import { expect, test } from '@playwright/test';

for (const theme of ['light', 'dark']) {
  for (const presentation of ['dialog', 'fullscreen', 'right', 'bottom']) {
    test(`${theme} ${presentation}: modal picker accessibility, placement and keyboard`, async ({
      page,
    }) => {
      await page.goto('/test-fixtures/modal-pickers');
      await page
        .locator('html')
        .evaluate((element, mode) => element.setAttribute('data-theme-mode', mode), theme);
      await page.getByRole('button', { name: `Open ${presentation}`, exact: true }).click();
      const modal = page.getByRole('dialog', { name: 'Review old payment' });
      const input = modal.getByRole('combobox', { name: 'Invoice' });
      await input.click();
      const option = modal.getByRole('option', { name: 'Old invoice 1', exact: true });
      await expect(option).toBeVisible();
      // Accessible descendants, not only pixels or an ARIA reference to an
      // inaccessible sibling. Chromium's snapshot must expose actual choices.
      expect(await modal.ariaSnapshot()).toContain('option "Old invoice 1"');
      await expect
        .poll(async () => {
          const anchor = await modal.getByTestId('invoice-field').boundingBox();
          const popup = await modal.getByRole('listbox').evaluate((element) => {
            const rect = element.parentElement!.getBoundingClientRect();
            return { x: rect.x, width: rect.width };
          });
          return Boolean(
            anchor &&
            popup &&
            Math.abs(anchor.x - popup.x) < 2 &&
            Math.abs(anchor.width - popup.width) < 2,
          );
        })
        .toBe(true);
      await expect
        .poll(() =>
          option.evaluate((element) => {
            const rect = element.getBoundingClientRect();
            return element.contains(
              document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2),
            );
          }),
        )
        .toBe(true);
      await input.press('ArrowDown');
      await input.press('Enter');
      await expect(modal).toContainText('Selected: invoice-1');
      await input.click();
      await input.press('Escape');
      await expect(input).toHaveAttribute('aria-expanded', 'false');
      await expect(modal).toBeVisible();
      const status = modal.getByRole('combobox', { name: 'Status' });
      await status.click();
      await expect(modal.getByRole('option', { name: 'Open', exact: true })).toBeVisible();
      await status.press('Escape');
      await modal.getByRole('button', { name: 'Done', exact: true }).focus();
      await page.keyboard.press('Tab');
      await expect(modal.getByRole('button', { name: /Close/ })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
      await expect(
        page.getByRole('button', { name: `Open ${presentation}`, exact: true }),
      ).toBeFocused();
    });
  }
}
