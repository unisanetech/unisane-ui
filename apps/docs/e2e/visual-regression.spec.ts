import { expect, test } from "@playwright/test";

const AXES = [
  "axis-default-tonal",
  "axis-high-contrast-dark",
  "axis-monochrome-compact",
] as const;

test.describe("visual regression fixtures", () => {
  for (const axisTestId of AXES) {
    test(`${axisTestId} matches the baseline`, async ({ page }) => {
      await page.goto("/docs/internal/visual-regression");
      const axisCard = page.locator(`[data-testid='${axisTestId}']`);
      await axisCard.waitFor();
      await axisCard.locator("[data-testid='surface-hierarchy']").waitFor();
      await page.addStyleTag({
        content: `
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
