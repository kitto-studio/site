/**
 * @file Navigation (U2): header nav, footer, logo, breadcrumb and in-page links move between pages
 * as SPA navigations inside a locale, keep the orange current mark (`aria-current`) in sync, update
 * the title and `<html lang>`, and survive Back and Forward. Skip link reaches the content.
 */
import { clickUntil, expect, isPhone, test, visit } from "./_fixtures";

/**
 * Mark the window so a later full reload is detectable.
 *
 * @param page - The page.
 */
async function mark(page: import("@playwright/test").Page): Promise<void> {
  await page.evaluate(() => {
    (globalThis as unknown as { spaMarker: number }).spaMarker = 1;
  });
}

/**
 * Whether the window is still the one {@link mark} marked (no full reload happened).
 *
 * @param page - The page.
 * @returns True when no full reload happened.
 */
function sameWindow(page: import("@playwright/test").Page): Promise<boolean> {
  return page.evaluate(() => (globalThis as unknown as { spaMarker?: number }).spaMarker === 1);
}

test("header nav swaps pages in place and moves the current mark", async ({ page }) => {
  test.skip(isPhone(test.info().project.name), "the phone header shows the Menu button");
  await visit(page, "/en/");
  await mark(page);
  const nav = page.locator('[data-component="header"] [data-nav]');
  await expect(nav.locator("a")).toHaveText(["Games", "About", "Support"]);
  await expect(page.locator("[data-brand]")).toHaveAttribute("aria-current", "page");

  await nav.getByRole("link", { name: "About" }).click();
  await page.waitForURL(url => url.pathname === "/en/about/");
  await expect(page.locator("h1")).toHaveText("A small family studio");
  await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
  await expect(page.locator("[data-brand]")).not.toHaveAttribute("aria-current", /.*/);
  await expect(page).toHaveTitle("About — Kitto Studio");

  await nav.getByRole("link", { name: "Games" }).click();
  await page.waitForURL(url => url.pathname === "/en/games/");
  await page.getByRole("link", { name: "About the game" }).click();
  await page.waitForURL(url => url.pathname === "/en/games/memory-missing/");
  // The game page is inside the Games section: the nav item keeps a section mark.
  await expect(nav.getByRole("link", { name: "Games" })).toHaveAttribute("aria-current", "true");
  expect(await sameWindow(page)).toBe(true);

  await page.goBack();
  await page.waitForURL(url => url.pathname === "/en/games/");
  await expect(page.locator("h1")).toHaveText("Our games");
  await page.goForward();
  await page.waitForURL(url => url.pathname === "/en/games/memory-missing/");
  await expect(page.locator("h1")).toHaveText("A Memory Missing: Merge Game");
  expect(await sameWindow(page)).toBe(true);
});

test("breadcrumb, logo and footer links navigate inside the locale", async ({ page }) => {
  await visit(page, "/de/games/memory-missing/");
  await mark(page);
  await page.locator('[data-component="breadcrumb"] a').click();
  await page.waitForURL(url => url.pathname === "/de/games/");
  await expect(page.locator("html")).toHaveAttribute("lang", "de");

  await page.locator('footer a[href="/de/privacy/"]').click();
  await page.waitForURL(url => url.pathname === "/de/privacy/");
  await expect(page.locator('footer a[href="/de/privacy/"]')).toHaveAttribute(
    "aria-current",
    "page"
  );

  await page.locator("[data-brand]").click();
  await page.waitForURL(url => url.pathname === "/de/");
  await expect(page.locator('footer a[aria-current="page"]')).toHaveCount(0);
  expect(await sameWindow(page)).toBe(true);
});

test("home sheets lead to the game, about and mail", async ({ page }) => {
  await visit(page, "/en/");
  await expect(page.locator("[data-home-game]")).toHaveAttribute(
    "href",
    "/en/games/memory-missing/"
  );
  await expect(page.locator("main a[data-more]")).toHaveAttribute("href", "/en/about/");
  const write = page.locator('main [data-component="button"][data-variant="primary"]');
  await expect(write).toHaveCount(1);
  await expect(write).toHaveAttribute("href", "mailto:support@kitto.studio");
  await page.locator("[data-home-game]").click();
  await page.waitForURL(url => url.pathname === "/en/games/memory-missing/");
});

test("the logo on its own page stays and replays", async ({ page }) => {
  await visit(page, "/en/");
  await mark(page);
  await page.locator("[data-brand]").click();
  await expect(page).toHaveURL(/\/en\/$/);
  expect(await sameWindow(page)).toBe(true);
});

test("skip link appears on focus and moves to the content", async ({ page }) => {
  test.skip(isPhone(test.info().project.name), "keyboard path");
  await visit(page, "/en/about/");
  const skip = page.locator("[data-skip-link]");
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("a hard load of a deep page works and the chrome mounts", async ({ page }) => {
  test.skip(isPhone(test.info().project.name), "desktop picker");
  await visit(page, "/zh/delete-data/");
  const toggle = page.locator("[data-lang-toggle]");
  await clickUntil(toggle, () =>
    expect(toggle).toHaveAttribute("aria-expanded", "true", { timeout: 800 })
  );
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

/**
 * Record, for the next view transition, whether the old page's snapshot is drawn.
 *
 * @param page - The page.
 * @returns Resolves once the hook is installed.
 */
async function watchOldSnapshot(page: import("@playwright/test").Page): Promise<void> {
  await page.evaluate(() => {
    const own = globalThis as unknown as { oldSnapshotShown?: boolean };
    const start = document.startViewTransition.bind(document);
    document.startViewTransition = (update => {
      const transition = start(update);
      void transition.ready.then(() => {
        const old = getComputedStyle(document.documentElement, "::view-transition-old(root)");
        own.oldSnapshotShown = old.display !== "none";
      });
      return transition;
    }) as typeof document.startViewTransition;
  });
}

/**
 * Whether the last view transition drew the old page's snapshot.
 *
 * @param page - The page.
 * @returns True when it did, `undefined` while no transition ran.
 */
function oldSnapshotShown(page: import("@playwright/test").Page): Promise<boolean | undefined> {
  return page.evaluate(
    () => (globalThis as unknown as { oldSnapshotShown?: boolean }).oldSnapshotShown
  );
}

test.describe("with motion", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("a link low on the page fades in the new page, not the top of the old one", async ({
    page
  }) => {
    // The kernel scrolls to the top before the old snapshot is taken: from the footer the crossfade
    // started from the home hero, a page the reader never saw there.
    await visit(page, "/en/");
    test.skip(
      await page.evaluate(() => typeof document.startViewTransition !== "function"),
      "no view transitions in this engine"
    );
    await watchOldSnapshot(page);
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    expect(await page.evaluate(() => scrollY), "the click is made below the top").toBeGreaterThan(
      0
    );
    await page.locator('[data-component="footer"] a[href="/en/privacy/"]').click();
    await page.waitForURL(url => url.pathname === "/en/privacy/");
    await expect.poll(() => oldSnapshotShown(page)).toBe(false);
  });

  test("a link at the top of the page keeps the crossfade from the old page", async ({ page }) => {
    await visit(page, "/en/");
    test.skip(
      await page.evaluate(() => typeof document.startViewTransition !== "function"),
      "no view transitions in this engine"
    );
    await watchOldSnapshot(page);
    await page.locator('[data-component="footer"] a[href="/en/privacy/"]').focus();
    await page.evaluate(() => scrollTo(0, 0));
    expect(await page.evaluate(() => scrollY), "the click is made at the top").toBe(0);
    await page.keyboard.press("Enter");
    await page.waitForURL(url => url.pathname === "/en/privacy/");
    await expect.poll(() => oldSnapshotShown(page)).toBe(true);
  });

  test("Forward returns to where the reader left a long page", async ({ page }) => {
    // Known defect of @moku-labs/web 2.4.11 (SPA kernel): with the crossfade on, Back takes the
    // position of the page being left after the shorter page is swapped in, so Forward lands at most
    // at the bottom of the shorter page. Chromium, Firefox and WebKit alike; reduced motion is fine.
    // Remove `fail` once the framework is fixed.
    test.fail(true, "@moku-labs/web: traverse saves the outgoing scroll after the swap");
    await visit(page, "/en/games/");
    const gamesBottom = await page.evaluate(
      () => document.documentElement.scrollHeight - innerHeight
    );
    await page.getByRole("link", { name: "About the game" }).click();
    await page.waitForURL(url => url.pathname === "/en/games/memory-missing/");
    await expect(page.locator("h1")).toHaveText("A Memory Missing: Merge Game");
    const deep = await page.evaluate(() => {
      const bottom = document.documentElement.scrollHeight - innerHeight;
      scrollTo(0, bottom);
      return Math.round(scrollY);
    });
    expect(deep, "the game page reaches past the bottom of the games page").toBeGreaterThan(
      gamesBottom + 100
    );

    await page.goBack();
    await page.waitForURL(url => url.pathname === "/en/games/");
    await expect(page.locator("h1")).toHaveText("Our games");
    await page.goForward();
    await page.waitForURL(url => url.pathname === "/en/games/memory-missing/");
    await expect(page.locator("h1")).toHaveText("A Memory Missing: Merge Game");
    await expect
      .poll(() => page.evaluate(() => Math.round(scrollY)), { timeout: 3000 })
      .toBeGreaterThanOrEqual(deep - 2);
  });
});
