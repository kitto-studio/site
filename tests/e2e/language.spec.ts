/**
 * @file Language picker (U2, design context §4 and §6 D1): a paper popover of 11 native names with
 * the current one checked; arrow keys, Esc and outside click; a choice is a hard navigation to the
 * same page in the other locale, saved as `kitto-lang`. On the phone the grid lives in the menu.
 */
import { clickUntil, expect, onlyForm, test, visit } from "./_fixtures";
import { LOCALES, NATIVE_NAMES } from "./_site";

test.describe("desktop popover", () => {
  onlyForm("desktop");

  test("opens with the current language focused, arrows move, Esc closes", async ({ page }) => {
    await visit(page, "/en/about/");
    const toggle = page.locator("[data-lang-toggle]");
    const menu = page.locator("#lang-menu");
    await expect(toggle).toHaveAccessibleName("Language EN");
    await expect(menu).toBeHidden();
    await clickUntil(toggle, () => expect(menu).toBeVisible({ timeout: 800 }));
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    const items = menu.getByRole("menuitemradio");
    await expect(items).toHaveText(LOCALES.map(locale => NATIVE_NAMES[locale]));
    await expect(items.first()).toHaveAttribute("aria-checked", "true");
    await expect(items.first()).toBeFocused();
    await expect(page.locator("[data-component='lang-picker']")).toHaveScreenshot(
      "lang-popover.png"
    );

    await page.keyboard.press("ArrowDown");
    await expect(items.nth(2)).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(items.nth(3)).toBeFocused();
    await page.keyboard.press("End");
    await expect(items.last()).toBeFocused();
    await page.keyboard.press("Home");
    await expect(items.first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    // Keyboard open from the toggle, then an outside click closes.
    await page.keyboard.press("ArrowDown");
    await expect(menu).toBeVisible();
    await page.mouse.click(700, 600);
    await expect(menu).toBeHidden();
  });

  test("choosing a language keeps the route and is saved", async ({ page }) => {
    await visit(page, "/en/about/");
    const toggle = page.locator("[data-lang-toggle]");
    await clickUntil(toggle, () =>
      expect(page.locator("#lang-menu")).toBeVisible({ timeout: 800 })
    );
    await page.locator('#lang-menu [data-lang="ru"]').click();
    await page.waitForURL(url => url.pathname === "/ru/about/");
    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
    expect(await page.evaluate(() => localStorage.getItem("kitto-lang"))).toBe("ru");
    await expect(page.locator('#lang-menu [data-lang="ru"]')).toHaveAttribute(
      "aria-checked",
      "true"
    );
    await expect(page.locator("[data-lang-toggle]")).toHaveAccessibleName("Язык RU");

    // The game page maps to the game page, and the root now opens the saved language.
    await visit(page, "/ru/games/memory-missing/");
    await clickUntil(toggle, () =>
      expect(page.locator("#lang-menu")).toBeVisible({ timeout: 800 })
    );
    await page.locator('#lang-menu [data-lang="de"]').click();
    await page.waitForURL(url => url.pathname === "/de/games/memory-missing/");
    await page.goto("/");
    await page.waitForURL(url => url.pathname === "/de/");
  });

  test("choosing the current language just closes the popover", async ({ page }) => {
    await visit(page, "/ja/terms/");
    const toggle = page.locator("[data-lang-toggle]");
    await clickUntil(toggle, () =>
      expect(page.locator("#lang-menu")).toBeVisible({ timeout: 800 })
    );
    await page.locator('#lang-menu [data-lang="ja"]').click();
    await expect(page.locator("#lang-menu")).toBeHidden();
    await expect(page).toHaveURL(/\/ja\/terms\/$/);
  });

  test("the language switch keeps the route on every page", async ({ page }) => {
    for (const path of ["/", "/games/", "/support/", "/privacy/", "/delete-data/"]) {
      await visit(page, `/en${path}`);
      const toggle = page.locator("[data-lang-toggle]");
      await clickUntil(toggle, () =>
        expect(page.locator("#lang-menu")).toBeVisible({ timeout: 800 })
      );
      await page.locator('#lang-menu [data-lang="zh"]').click();
      await page.waitForURL(url => url.pathname === `/zh${path}`);
    }
  });
});

test.describe("phone menu grid", () => {
  onlyForm("phone");

  test("the menu's language grid switches and keeps the route", async ({ page }) => {
    await visit(page, "/en/support/");
    const toggle = page.locator("[data-menu-toggle]");
    await clickUntil(toggle, () =>
      expect(toggle).toHaveAttribute("aria-expanded", "true", { timeout: 800 })
    );
    const grid = page.locator("#site-menu [data-lang-grid] button");
    await expect(grid).toHaveCount(LOCALES.length);
    await expect(page.locator('#site-menu [data-lang="en"]')).toHaveAttribute(
      "aria-current",
      "true"
    );
    await page.locator('#site-menu [data-lang="ja"]').click();
    await page.waitForURL(url => url.pathname === "/ja/support/");
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    expect(await page.evaluate(() => localStorage.getItem("kitto-lang"))).toBe("ja");
  });
});
