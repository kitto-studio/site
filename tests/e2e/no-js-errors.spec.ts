/**
 * @file Boot guard: every page of every locale loads with zero page errors, console errors or
 * warnings and failed requests (the automatic capture), shows its heading, and the SPA is alive.
 * Chromium desktop walks all 11 locales; the other projects walk the sample locales.
 */
import { booted, expect, test, visit } from "./_fixtures";
import { LOCALES, PAGES, pageUrl, SAMPLE_LOCALES } from "./_site";

for (const locale of LOCALES) {
  test.describe(`boot ${locale}`, () => {
    test.beforeEach(() => {
      const isFullWalk = test.info().project.name === "chromium-desktop";
      test.skip(!isFullWalk && !SAMPLE_LOCALES.includes(locale), "sample locales only here");
    });

    for (const page of PAGES) {
      test(`${pageUrl(locale, page)} boots clean`, async ({ page: tab }) => {
        await visit(tab, pageUrl(locale, page));
        await expect(tab.locator("h1").first()).toBeVisible();
        await expect(tab.locator("html")).toHaveAttribute("lang", locale);
        if (locale === "en") await expect(tab.locator("h1").first()).toHaveText(page.heading);
      });
    }

    test(`/${locale}/404 page boots clean`, async ({ page, issues }) => {
      issues.allow(
        /(HTTP 404|status of 404).*\/no-such-page\/$/,
        "the 404 page answers 404 by design"
      );
      const response = await page.goto(`/${locale}/no-such-page/`);
      expect(response?.status()).toBe(404);
      await booted(page);
      await expect(page.locator('[data-component="not-found"] h1')).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });
  });
}

test("the SPA is alive: a footer link swaps the page without a reload", async ({ page }) => {
  await visit(page, "/en/");
  await page.evaluate(() => {
    (globalThis as unknown as { spaMarker: number }).spaMarker = 1;
  });
  // Playwright's webkit does not observe Navigation API URL commits: read the address in page.
  await page.locator('footer a[href="/en/support/"]').click({ noWaitAfter: true });
  await expect.poll(() => page.evaluate(() => location.pathname)).toBe("/en/support/");
  // Same reason: the swapped page is read in page, not through webkit's stale locator context.
  await expect
    .poll(() => page.evaluate(() => document.querySelector("h1")?.textContent))
    .toBe("Need help? Write to us.");
  expect(
    await page.evaluate(() => (globalThis as unknown as { spaMarker?: number }).spaMarker)
  ).toBe(1);
  await expect.poll(() => page.evaluate(() => document.title)).toBe("Support — Kitto Studio");
});
