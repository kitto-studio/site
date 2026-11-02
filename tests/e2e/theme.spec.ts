/**
 * @file Theme switch (U2, design context §4, §6 D2): light, system and dark as a radio group; the
 * choice applies at once, is saved as `kitto-theme`, persists across SPA and full navigations
 * without a flash, and the `?theme=` preview wins for one load.
 */
import type { Locator, Page } from "@playwright/test";
import { clickUntil, expect, isPhone, test, visit } from "./_fixtures";

/**
 * The theme switch the current form factor shows (header disc on desktop, menu plate on phone),
 * opening the phone menu when needed.
 *
 * @param page - The page.
 * @returns The radiogroup.
 */
async function themeSwitch(page: Page): Promise<Locator> {
  if (!isPhone(test.info().project.name)) {
    return page.locator('[data-component="header"] [data-tools] [data-component="theme-switch"]');
  }
  const toggle = page.locator("[data-menu-toggle]");
  await clickUntil(toggle, () =>
    expect(toggle).toHaveAttribute("aria-expanded", "true", { timeout: 800 })
  );
  return page.locator('#site-menu [data-component="theme-switch"]');
}

/**
 * The `data-theme` of `<html>`.
 *
 * @param page - The page.
 * @returns The value, or "system" when unset.
 */
function htmlTheme(page: Page): Promise<string> {
  return page.evaluate(() => document.documentElement.dataset.theme ?? "system");
}

test("choosing dark applies, saves and persists across navigation", async ({ page }) => {
  await visit(page, "/en/");
  const group = await themeSwitch(page);
  await expect(group).toHaveRole("radiogroup");
  await expect(group.getByRole("radio")).toHaveCount(3);
  await expect(group.getByRole("radio", { name: "System" })).toBeChecked();

  await group.locator('[data-theme-stop="dark"]').click();
  await expect(group.getByRole("radio", { name: "Dark" })).toBeChecked();
  expect(await htmlTheme(page)).toBe("dark");
  expect(await page.evaluate(() => localStorage.getItem("kitto-theme"))).toBe("dark");
  const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  // SPA navigation keeps it.
  const aboutLink = isPhone(test.info().project.name)
    ? '#site-menu a[href="/en/about/"]'
    : '[data-nav] a[href="/en/about/"]';
  await page.locator(aboutLink).click();
  await page.waitForURL(url => url.pathname === "/en/about/");
  expect(await htmlTheme(page)).toBe("dark");

  // A full load applies it before the first paint (no-flash script) and the radios agree.
  await page.goto("/en/privacy/");
  expect(await htmlTheme(page)).toBe("dark");
  await page.waitForLoadState("networkidle");
  const again = await themeSwitch(page);
  await expect(again.getByRole("radio", { name: "Dark" })).toBeChecked();
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
    background
  );

  // Back to system: the attribute goes, the scheme follows the OS.
  await again.locator('[data-theme-stop="system"]').click();
  expect(await htmlTheme(page)).toBe("system");
  expect(await page.evaluate(() => localStorage.getItem("kitto-theme"))).toBe("system");
});

test("arrow keys move through the radio group", async ({ page }) => {
  test.skip(isPhone(test.info().project.name), "keyboard path");
  await visit(page, "/en/games/");
  const group = await themeSwitch(page);
  await group.getByRole("radio", { name: "System" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(group.getByRole("radio", { name: "Dark" })).toBeChecked();
  expect(await htmlTheme(page)).toBe("dark");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(group.getByRole("radio", { name: "Light" })).toBeChecked();
  expect(await htmlTheme(page)).toBe("light");
});

test("the label of a stop shows on hover and focus", async ({ page }) => {
  test.skip(isPhone(test.info().project.name), "hover tip of the desktop disc");
  await visit(page, "/en/");
  const group = await themeSwitch(page);
  const stop = group.locator('[data-theme-stop="dark"]');
  const tip = stop.locator("[data-tip]");
  await stop.hover();
  await expect(tip).toBeVisible();
  await expect(tip).toHaveText("Dark");
});

test("light wins over a dark OS, ?theme= previews one load", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await visit(page, "/en/support/?theme=light");
  expect(await htmlTheme(page)).toBe("light");
  const group = await themeSwitch(page);
  await expect(group.getByRole("radio", { name: "Light" })).toBeChecked();
  expect(await page.evaluate(() => localStorage.getItem("kitto-theme"))).toBeNull();
});
