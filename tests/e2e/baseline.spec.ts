/**
 * @file Visual goldens of every English page, the 404 page and the root language page, light and
 * dark, on chromium desktop (1440) and chromium phone (390). Webkit and firefox keep the boot guard
 * (`no-js-errors.spec.ts`) but no goldens. Size budget (~20 MB for every golden of the suite):
 * - light pages are full length, dark pages the first screen: dark is a token swap of the same layout;
 * - pages are taken without the paper grain (`golden.css`), incompressible noise of 1-3 MB a page;
 *   the 404 and root goldens keep it, so the grain still has a golden.
 * The root page is captured without JavaScript, the state its redirect never lets a reader see.
 */
import { fileURLToPath } from "node:url";
import { expect, settle, test, visit } from "./_fixtures";
import { PAGES, pageUrl } from "./_site";

/** Frozen clock of every golden. */
const FROZEN = new Date("2026-11-02T10:00:00Z");

/** Both colour schemes; "system" theme follows them. */
const THEMES = ["light", "dark"] as const;

/** Screenshot-only style of the page goldens: no paper grain. */
const NO_GRAIN = fileURLToPath(new URL("golden.css", import.meta.url));

for (const theme of THEMES) {
  test.describe(`${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.clock.setFixedTime(FROZEN);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    });

    for (const sitePage of PAGES) {
      test(`${sitePage.id} golden`, async ({ page }) => {
        await visit(page, pageUrl("en", sitePage));
        await settle(page);
        await expect(page).toHaveScreenshot(`${sitePage.id}-${theme}.png`, {
          fullPage: theme === "light",
          stylePath: NO_GRAIN
        });
      });
    }

    test("404 golden", async ({ page, issues }) => {
      issues.allow(
        /(HTTP 404|status of 404).*\/no-such-page\/$/,
        "the 404 page answers 404 by design"
      );
      await page.goto("/en/no-such-page/");
      await page.waitForLoadState("networkidle");
      await settle(page);
      await expect(page).toHaveScreenshot(`not-found-${theme}.png`);
    });
  });

  test.describe(`${theme} root page without JavaScript`, () => {
    test.use({ javaScriptEnabled: false, colorScheme: theme });

    test("root golden", async ({ page, issues }) => {
      issues.allow(
        /nunito-latin-900\.woff2.*preload.*not used/,
        "the root page preloads the heading font for the locale page its redirect opens next"
      );
      await page.goto("/");
      // No settle(): nothing on this page is lazy.
      await page.waitForLoadState("networkidle");
      await expect(page.locator('[data-component="root-page"]')).toBeVisible();
      await expect(page).toHaveScreenshot(`root-${theme}.png`);
    });
  });
}
