import { expect, test } from "@playwright/test";

function trackCount(gridTemplateColumns: string) {
  return gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length;
}

test.describe("docs layout regressions", () => {
  test("components catalog expands beyond a single column on desktop", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop-only container-query layout check");

    await page.goto("/docs/components");

    const columns = await page.evaluate(() => {
      const grid = Array.from(document.querySelectorAll("div")).find((element) =>
        (element.className || "").includes("@lg:grid-cols-2 @4xl:grid-cols-3"),
      ) as HTMLDivElement | undefined;

      return grid ? getComputedStyle(grid).gridTemplateColumns : null;
    });

    expect(columns).not.toBeNull();
    expect(trackCount(columns ?? "")).toBe(3);
  });

  test("component detail layouts promote to multi-column grids on desktop", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop-only container-query layout check");

    await page.goto("/docs/components/card");

    const layout = await page.evaluate(() => {
      const heroGrid = Array.from(document.querySelectorAll<HTMLElement>("*")).find((element) =>
        String(element.className || "").includes("@3xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"),
      );

      const examplesGrid = Array.from(document.querySelectorAll<HTMLElement>("*")).find((element) =>
        String(element.className || "").includes("@lg:grid-cols-2 @2xl:grid-cols-3"),
      );

      return {
        heroColumns: heroGrid ? getComputedStyle(heroGrid).gridTemplateColumns : null,
        examplesColumns: examplesGrid ? getComputedStyle(examplesGrid).gridTemplateColumns : null,
      };
    });

    expect(layout.heroColumns).not.toBeNull();
    expect(trackCount(layout.heroColumns ?? "")).toBe(2);
    expect(layout.examplesColumns).not.toBeNull();
    expect(trackCount(layout.examplesColumns ?? "")).toBe(3);
  });
});
