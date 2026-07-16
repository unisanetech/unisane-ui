import { expect, test } from '@playwright/test';

const AXES = ['axis-standard', 'axis-high-contrast-comfortable', 'axis-compact-flat'] as const;

test.describe('visual regression fixtures', () => {
  for (const axisTestId of AXES) {
    test(`${axisTestId} matches the baseline`, async ({ page }) => {
      await page.goto('/docs/internal/visual-regression');
      const axisCard = page.locator(`[data-testid='${axisTestId}']`);
      await axisCard.waitFor();
      await axisCard.locator("[data-testid='surface-hierarchy']").waitFor();
      await page.addStyleTag({
        content: `
          nextjs-portal {
            display: none !important;
          }

          *, *::before, *::after {
            animation-duration: 0s !important;
            transition-duration: 0s !important;
            caret-color: transparent !important;
          }
        `,
      });

      await expect(axisCard).toHaveScreenshot(`${axisTestId}.png`);
    });
  }
});
