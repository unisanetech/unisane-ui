import { expect, test, type Page } from '@playwright/test';

const REGRESSION_ROUTE = '/docs/internal/datatable-regression';

async function getFixture(page: Page, testId: string) {
  const fixture = page.locator(`[data-testid='${testId}']`);
  await fixture.waitFor();
  return fixture;
}

async function getScrollContainer(page: Page, testId = 'datatable-regression-fixture') {
  const fixture = await getFixture(page, testId);
  const scrollContainer = fixture.locator("[data-datatable-scroll='body']");
  await expect(scrollContainer).toBeVisible();
  return scrollContainer;
}

test.describe('datatable regression fixtures', () => {
  test('lets a nested page own vertical scrolling and stacks the toolbar and header', async ({
    page,
    isMobile,
  }) => {
    await page.goto(REGRESSION_ROUTE);

    const fixture = await getFixture(page, 'datatable-page-flow-fixture');
    const pageScrollOwner = page.getByTestId('datatable-page-scroll-owner');
    const tableScrollContainer = await getScrollContainer(page, 'datatable-page-flow-fixture');
    const stickyZone = fixture.locator("[data-datatable-sticky-zone='true']");
    const sourceHeader = fixture.locator("thead[data-page-sticky='true']");
    const stickyOverlay = page.locator("[data-datatable-page-sticky-overlay='true']");

    const tableMetricsBefore = await tableScrollContainer.evaluate((node: HTMLDivElement) => ({
      scrollTop: node.scrollTop,
      scrollHeight: node.scrollHeight,
      clientHeight: node.clientHeight,
      overscrollY: window.getComputedStyle(node).overscrollBehaviorY,
      owner: node.dataset.verticalScrollOwner,
    }));

    expect(tableMetricsBefore.owner).toBe('page');
    expect(tableMetricsBefore.scrollHeight - tableMetricsBefore.clientHeight).toBeLessThanOrEqual(
      1,
    );
    expect(tableMetricsBefore.overscrollY).not.toBe('contain');

    if (!isMobile) {
      const customScrollbar = fixture.locator("[data-datatable-custom-scrollbar='true']");
      const ownerBoxBefore = await pageScrollOwner.boundingBox();
      const customScrollbarBox = await customScrollbar.boundingBox();
      expect(ownerBoxBefore).not.toBeNull();
      expect(customScrollbarBox).not.toBeNull();
      expect(
        Math.abs(
          (customScrollbarBox?.y ?? 0) +
            (customScrollbarBox?.height ?? 0) -
            ((ownerBoxBefore?.y ?? 0) + (ownerBoxBefore?.height ?? 0)),
        ),
      ).toBeLessThanOrEqual(2);
    }

    await tableScrollContainer.hover();
    await page.mouse.wheel(0, 420);

    await expect
      .poll(async () => pageScrollOwner.evaluate((node: HTMLDivElement) => node.scrollTop))
      .toBeGreaterThan(300);
    expect(await tableScrollContainer.evaluate((node: HTMLDivElement) => node.scrollTop)).toBe(0);

    const ownerBox = await pageScrollOwner.boundingBox();
    const stickyZoneBox = await stickyZone.boundingBox();
    const overlayHeaderCell = stickyOverlay.getByRole('columnheader', { name: /SKU/ }).first();
    const headerBox = await overlayHeaderCell.boundingBox();
    const sourceHeaderState = await sourceHeader.evaluate((node: HTMLTableSectionElement) => ({
      ariaHidden: node.getAttribute('aria-hidden'),
      transform: window.getComputedStyle(node).transform,
    }));
    const overlayPosition = await stickyOverlay.evaluate(
      (node: HTMLDivElement) => window.getComputedStyle(node).position,
    );

    expect(ownerBox).not.toBeNull();
    expect(stickyZoneBox).not.toBeNull();
    expect(headerBox).not.toBeNull();
    expect(sourceHeaderState).toEqual({ ariaHidden: 'true', transform: 'none' });
    expect(overlayPosition).toBe('fixed');
    expect(Math.abs((stickyZoneBox?.y ?? 0) - ((ownerBox?.y ?? 0) + 8))).toBeLessThanOrEqual(2);
    expect(
      Math.abs((headerBox?.y ?? 0) - (stickyZoneBox?.y ?? 0) - (stickyZoneBox?.height ?? 0)),
    ).toBeLessThanOrEqual(2);

    const sampledHeaderPositions = [headerBox?.y ?? 0];
    for (let step = 0; step < 4; step += 1) {
      await page.mouse.wheel(0, 48);
      const sampledBox = await overlayHeaderCell.boundingBox();
      sampledHeaderPositions.push(sampledBox?.y ?? 0);
    }
    expect(
      Math.max(...sampledHeaderPositions) - Math.min(...sampledHeaderPositions),
    ).toBeLessThanOrEqual(1);
  });

  test('keeps vertical scrolling, sticky headers, and row virtualization working', async ({
    page,
  }) => {
    await page.goto(REGRESSION_ROUTE);

    const fixture = await getFixture(page, 'datatable-regression-fixture');
    const scrollContainer = await getScrollContainer(page);
    const initialRenderedRows = fixture.locator('tbody tr[data-index]');

    await expect
      .poll(async () => initialRenderedRows.count(), { timeout: 15_000 })
      .toBeGreaterThan(0);
    const initialRenderedRowCount = await initialRenderedRows.count();

    expect(initialRenderedRowCount).toBeGreaterThan(0);
    expect(initialRenderedRowCount).toBeLessThan(80);

    const scrollMetricsBefore = await scrollContainer.evaluate((node: HTMLDivElement) => ({
      scrollTop: node.scrollTop,
      scrollHeight: node.scrollHeight,
      clientHeight: node.clientHeight,
    }));

    expect(scrollMetricsBefore.scrollHeight).toBeGreaterThan(scrollMetricsBefore.clientHeight);
    expect(scrollMetricsBefore.scrollTop).toBe(0);

    const headerCell = fixture.getByRole('columnheader', { name: /SKU/ }).first();
    const containerBox = await scrollContainer.boundingBox();
    const headerBoxBefore = await headerCell.boundingBox();

    expect(containerBox).not.toBeNull();
    expect(headerBoxBefore).not.toBeNull();

    await scrollContainer.evaluate((node: HTMLDivElement) => {
      node.scrollTop = 6400;
      node.dispatchEvent(new Event('scroll'));
    });

    await expect
      .poll(async () => {
        const firstRenderedRow = fixture.locator('tbody tr[data-index]').first();
        const dataIndex = await firstRenderedRow.getAttribute('data-index');
        return Number(dataIndex ?? '0');
      })
      .toBeGreaterThan(100);

    const scrollMetricsAfter = await scrollContainer.evaluate((node: HTMLDivElement) => ({
      scrollTop: node.scrollTop,
      touchAction: window.getComputedStyle(node).touchAction,
    }));
    const headerBoxAfter = await headerCell.boundingBox();

    expect(scrollMetricsAfter.scrollTop).toBeGreaterThan(6000);
    expect(scrollMetricsAfter.touchAction).toContain('pan-x');
    expect(headerBoxAfter).not.toBeNull();
    expect(Math.abs((headerBoxAfter?.y ?? 0) - (containerBox?.y ?? 0))).toBeLessThanOrEqual(2);
  });

  test('keeps pinned columns anchored and the custom scrollbar inside the table shell', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'desktop-only pinned column and scrollbar assertions');

    await page.goto(REGRESSION_ROUTE);

    const fixture = await getFixture(page, 'datatable-regression-fixture');
    const scrollContainer = await getScrollContainer(page);
    const pinnedHeader = fixture.getByRole('columnheader', { name: /SKU/ }).first();
    const scrollHeader = fixture.getByRole('columnheader', { name: /Supplier/ }).first();

    const pinnedHeaderBoxBefore = await pinnedHeader.boundingBox();
    const scrollHeaderBoxBefore = await scrollHeader.boundingBox();

    expect(pinnedHeaderBoxBefore).not.toBeNull();
    expect(scrollHeaderBoxBefore).not.toBeNull();

    const xMetricsBefore = await scrollContainer.evaluate((node: HTMLDivElement) => ({
      scrollLeft: node.scrollLeft,
      scrollWidth: node.scrollWidth,
      clientWidth: node.clientWidth,
    }));

    expect(xMetricsBefore.scrollWidth).toBeGreaterThan(xMetricsBefore.clientWidth);
    expect(xMetricsBefore.scrollLeft).toBe(0);

    await scrollContainer.evaluate((node: HTMLDivElement) => {
      node.scrollLeft = node.scrollWidth - node.clientWidth;
      node.dispatchEvent(new Event('scroll'));
    });

    await expect
      .poll(async () => {
        return scrollContainer.evaluate((node: HTMLDivElement) => node.scrollLeft);
      })
      .toBeGreaterThan(700);

    const pinnedHeaderBoxAfter = await pinnedHeader.boundingBox();
    const scrollHeaderBoxAfter = await scrollHeader.boundingBox();
    const customScrollbar = fixture.locator("[data-datatable-custom-scrollbar='true']");
    const fixtureBox = await fixture.boundingBox();
    const customScrollbarBox = await customScrollbar.boundingBox();

    expect(pinnedHeaderBoxAfter).not.toBeNull();
    expect(scrollHeaderBoxAfter).not.toBeNull();
    expect(customScrollbarBox).not.toBeNull();
    expect(fixtureBox).not.toBeNull();

    expect(
      Math.abs((pinnedHeaderBoxAfter?.x ?? 0) - (pinnedHeaderBoxBefore?.x ?? 0)),
    ).toBeLessThanOrEqual(2);
    expect(scrollHeaderBoxAfter?.x ?? 0).toBeLessThan((scrollHeaderBoxBefore?.x ?? 0) - 500);

    expect(customScrollbarBox?.x ?? 0).toBeGreaterThanOrEqual((fixtureBox?.x ?? 0) - 1);
    expect((customScrollbarBox?.x ?? 0) + (customScrollbarBox?.width ?? 0)).toBeLessThanOrEqual(
      (fixtureBox?.x ?? 0) + (fixtureBox?.width ?? 0) + 1,
    );
  });

  test('keeps dynamic expanded-row heights aligned with the virtualized scroll model', async ({
    page,
  }) => {
    await page.goto(REGRESSION_ROUTE);

    const fixture = await getFixture(page, 'datatable-regression-expanded-fixture');
    const scrollContainer = await getScrollContainer(page, 'datatable-regression-expanded-fixture');
    const expandButton = fixture
      .locator('tbody tr[data-index]')
      .first()
      .getByRole('button', { name: /^expand row$/i });
    const expandedPanel = fixture.getByTestId('datatable-regression-expanded-panel-row-1');

    const scrollHeightBefore = await scrollContainer.evaluate(
      (node: HTMLDivElement) => node.scrollHeight,
    );

    await expandButton.click();
    await expect(expandedPanel).toBeVisible();

    await expect
      .poll(async () => {
        const scrollHeightAfter = await scrollContainer.evaluate(
          (node: HTMLDivElement) => node.scrollHeight,
        );
        return Math.abs(scrollHeightAfter - scrollHeightBefore);
      })
      .toBeGreaterThan(40);

    await scrollContainer.evaluate((node: HTMLDivElement) => {
      node.scrollTop = 7200;
      node.dispatchEvent(new Event('scroll'));
    });

    await expect
      .poll(async () => {
        const firstRenderedRow = fixture.locator('tbody tr[data-index]').first();
        const dataIndex = await firstRenderedRow.getAttribute('data-index');
        return Number(dataIndex ?? '0');
      })
      .toBeGreaterThan(100);

    await scrollContainer.evaluate((node: HTMLDivElement) => {
      node.scrollTop = 0;
      node.dispatchEvent(new Event('scroll'));
    });

    await expect(expandedPanel).toBeVisible();
  });
});
