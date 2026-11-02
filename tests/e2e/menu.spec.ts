/**
 * @file Phone menu (U2, design context §4, §6 C1): the Menu button opens a paper sheet under the
 * header with the nav words, the language grid and the theme plate; the page goes inert, focus is
 * trapped, Esc and the scrim close it, a nav word navigates and closes it. Desktop hides the button.
 */
import { clickUntil, expect, onlyForm, settle, test, visit } from "./_fixtures";

test.describe("phone", () => {
  onlyForm("phone");

  test("Menu opens a modal sheet, traps focus, Esc closes", async ({ page }) => {
    await visit(page, "/en/about/");
    const toggle = page.locator("[data-menu-toggle]");
    const sheet = page.locator("#site-menu");
    await expect(page.locator('[data-component="header"] [data-nav]')).toBeHidden();
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveText(/Menu/);
    await expect(sheet).toHaveAttribute("inert", "");

    await clickUntil(toggle, () =>
      expect(toggle).toHaveAttribute("aria-expanded", "true", { timeout: 800 })
    );
    await expect(sheet).not.toHaveAttribute("inert", "");
    await expect(page.locator("main")).toHaveAttribute("inert", "");
    await expect(page.locator("footer")).toHaveAttribute("inert", "");
    await expect(toggle).toHaveText(/Close/);
    await expect(sheet.locator("nav a")).toHaveText(["Games", "About", "Support"]);
    await expect(sheet.locator('nav a[href="/en/about/"]')).toHaveAttribute("aria-current", "page");
    await expect(sheet.locator("nav a").first()).toBeFocused();
    await settle(page);
    await expect(page).toHaveScreenshot("menu-open.png");

    // Tab never leaves the header.
    for (let step = 0; step < 25; step += 1) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(
        () => document.activeElement?.closest('[data-component="header"]') !== null
      );
      expect(inside, `focus after ${step + 1} tabs`).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
    await expect(page.locator("main")).not.toHaveAttribute("inert", "");
    await expect(sheet).toHaveAttribute("inert", "");
  });

  test("the scrim closes the sheet; a nav word navigates and closes it", async ({ page }) => {
    await visit(page, "/en/");
    const toggle = page.locator("[data-menu-toggle]");
    await clickUntil(toggle, () =>
      expect(toggle).toHaveAttribute("aria-expanded", "true", { timeout: 800 })
    );
    await page.locator("[data-menu-scrim]").click({ position: { x: 195, y: 830 }, force: true });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.locator('#site-menu nav a[href="/en/games/"]').click();
    await page.waitForURL(url => url.pathname === "/en/games/");
    await expect(page.locator("h1")).toHaveText("Our games");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("main")).not.toHaveAttribute("inert", "");
    await expect(page.locator('#site-menu nav a[href="/en/games/"]')).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("widening the screen with the menu open leaves focus on a visible header control", async ({
    page
  }) => {
    await visit(page, "/en/about/");
    const toggle = page.locator("[data-menu-toggle]");
    await clickUntil(toggle, () =>
      expect(toggle).toHaveAttribute("aria-expanded", "true", { timeout: 800 })
    );
    await expect(page.locator("#site-menu nav a").first()).toBeFocused();

    // The sheet closes at the wide width; the focus it held must not fall back to <body>.
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(
      page.locator('[data-component="header"] [data-nav] a[aria-current="page"]')
    ).toBeFocused();
    await expect(page.locator(":focus")).toBeVisible();
  });

  test("the toggle button closes the open sheet", async ({ page }) => {
    await visit(page, "/ru/");
    const toggle = page.locator("[data-menu-toggle]");
    await clickUntil(toggle, () =>
      expect(toggle).toHaveAttribute("aria-expanded", "true", { timeout: 800 })
    );
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("desktop", () => {
  onlyForm("desktop");

  test("the Menu button is hidden and the nav is shown", async ({ page }) => {
    await visit(page, "/en/");
    await expect(page.locator("[data-menu-toggle]")).toBeHidden();
    await expect(page.locator('[data-component="header"] [data-nav]')).toBeVisible();
  });
});
