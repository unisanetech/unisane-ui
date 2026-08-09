import { expect, test } from '@playwright/test';

const AXES = ['axis-standard', 'axis-high-contrast-comfortable', 'axis-compact-flat'] as const;
const SECTIONS = [
  'surface-hierarchy',
  'leaf-icon-typography',
  'border-semantics',
  'button-variants',
  'field-variants',
  'completed-public-fleet',
  'date-family',
  'carousel-composite',
  'scroll-area-boundary',
  'pagination-boundary',
  'stepper-boundary',
  'navigation-presentations',
  'sidebar-recipe',
  'selection-controls',
  'data-display',
  'persistent-communication',
  'toast-feedback',
  'dialog-decisions',
] as const;

test.describe('visual regression fixtures', () => {
  for (const axisTestId of AXES) {
    test(`${axisTestId} matches the baseline`, async ({ page }) => {
      await page.goto('/test-fixtures/visual-regression');
      const axisCard = page.locator(`[data-testid='${axisTestId}']`);
      await axisCard.waitFor();
      await axisCard.locator("[data-testid='surface-hierarchy']").waitFor();
      await page.addStyleTag({
        content: `
          nextjs-portal {
            display: none !important;
          }

          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
            caret-color: transparent !important;
            scroll-behavior: auto !important;
          }
        `,
      });

      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );

      for (const [index, sectionTestId] of SECTIONS.entries()) {
        await page.evaluate(
          ({ activeAxisTestId, activeSectionTestId }) => {
            const activeAxis = document.querySelector<HTMLElement>(
              `[data-testid='${activeAxisTestId}']`,
            );
            if (!activeAxis) return;

            document.querySelectorAll<HTMLElement>("[data-testid^='axis-']").forEach((axis) => {
              axis.hidden = axis !== activeAxis;
            });
            activeAxis.querySelectorAll<HTMLElement>('section[data-testid]').forEach((section) => {
              section.hidden = section.dataset.testid !== activeSectionTestId;
            });
          },
          { activeAxisTestId: axisTestId, activeSectionTestId: sectionTestId },
        );
        await page.evaluate(
          () =>
            new Promise<void>((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
            ),
        );
        const section = axisCard.locator(`[data-testid='${sectionTestId}']`);
        await expect(section).toBeVisible();
        const snapshotName =
          index === 0 ? `${axisTestId}.png` : `${axisTestId}-${sectionTestId}.png`;
        await expect(section).toHaveScreenshot(snapshotName);
      }
    });
  }
});
