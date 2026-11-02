/**
 * @file The root language page (U1): `/` sends the reader to the saved language, else the first
 * supported entry of the browser's languages (base tag match), else English. Without JavaScript it
 * is the list of the 11 languages.
 */
import type { Browser } from "@playwright/test";
import { expect, expectNoErrors, test, watchErrors } from "./_fixtures";
import { LOCALES, NATIVE_NAMES } from "./_site";

/** Browser languages and the locale the root must open for them. */
const CASES = [
  { languages: "ru-RU", expected: "ru" },
  { languages: "zh-TW", expected: "zh" },
  { languages: "pt-BR", expected: "pt" },
  { languages: "de-AT", expected: "de" },
  { languages: "ja", expected: "ja" },
  { languages: "pl-PL", expected: "en" },
  { languages: "en-US", expected: "en" }
] as const;

/**
 * Open `/` in a fresh context with a browser locale and an optional saved language.
 *
 * @param browser - The browser.
 * @param baseURL - The suite's origin.
 * @param locale - The context locale (drives navigator.languages).
 * @param saved - A `kitto-lang` value to seed.
 * @returns The pathname the root page sent the reader to.
 */
async function landing(
  browser: Browser,
  baseURL: string,
  locale: string,
  saved?: string
): Promise<string> {
  const context = await browser.newContext({ baseURL, locale });
  if (saved !== undefined) {
    await context.addInitScript(value => localStorage.setItem("kitto-lang", value), saved);
  }
  const page = await context.newPage();
  const errors = watchErrors(page);
  await page.goto("/");
  await page.waitForURL(url => url.pathname !== "/");
  await page.waitForLoadState("networkidle");
  const { pathname } = new URL(page.url());
  expectNoErrors(errors);
  await context.close();
  return pathname;
}

test.describe("root redirect", () => {
  for (const { languages, expected } of CASES) {
    test(`${languages} opens /${expected}/`, async ({ browser, baseURL }) => {
      expect(await landing(browser, baseURL ?? "", languages)).toBe(`/${expected}/`);
    });
  }

  test("a saved language wins over the browser language", async ({ browser, baseURL }) => {
    expect(await landing(browser, baseURL ?? "", "en-US", "ja")).toBe("/ja/");
  });

  test("an unsupported saved value is ignored", async ({ browser, baseURL }) => {
    expect(await landing(browser, baseURL ?? "", "de-DE", "xx")).toBe("/de/");
  });

  test("the redirect keeps the query and the hash", async ({ page }) => {
    await page.goto("/?theme=dark#top");
    await page.waitForURL(url => url.pathname === "/en/");
    const url = new URL(page.url());
    expect(url.search).toBe("?theme=dark");
    expect(url.hash).toBe("#top");
  });

  test("the redirect replaces history: Back does not return to /", async ({ page }) => {
    await page.goto("/en/about/");
    await page.goto("/");
    await page.waitForURL(url => url.pathname === "/en/");
    await page.goBack();
    await page.waitForLoadState("load");
    expect(new URL(page.url()).pathname).toBe("/en/about/");
  });
});

test.describe("root page without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("lists every language as a link to its home", async ({ page, issues }) => {
    issues.allow(
      /requestfailed: .*\/assets\/chunk-[\w-]+\.js csp/,
      "with JavaScript off, Chromium reports the modulepreload of the SPA chunk as a CSP block"
    );
    await page.goto("/");
    const links = page.locator('[data-component="root-page"] [data-languages] a');
    await expect(links).toHaveCount(LOCALES.length);
    for (const [index, locale] of LOCALES.entries()) {
      await expect(links.nth(index)).toHaveAttribute("href", `/${locale}/`);
      await expect(links.nth(index)).toHaveText(NATIVE_NAMES[locale]);
    }
    await links.nth(1).click();
    await page.waitForURL(url => url.pathname === "/ru/");
  });
});
