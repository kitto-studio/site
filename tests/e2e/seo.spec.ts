/**
 * @file Head metadata per page and locale: title pattern, description, canonical, the 11 hreflang
 * alternates plus x-default, Open Graph and the `og:locale` of the locale.
 */
import { expect, onlyOn, test } from "./_fixtures";
import { LOCALES, OG_LOCALE, ORIGIN, PAGES, pageUrl, SAMPLE_LOCALES } from "./_site";

onlyOn("chromium-desktop");

/**
 * Read one attribute of the first tag matching a selector-like pattern.
 *
 * @param html - The page HTML.
 * @param pattern - Matches the whole tag; group 1 is the value.
 * @returns The value, or undefined.
 */
function first(html: string, pattern: RegExp): string | undefined {
  return pattern.exec(html)?.[1];
}

for (const locale of SAMPLE_LOCALES) {
  test(`${locale} pages carry complete head metadata`, async ({ request }) => {
    for (const page of PAGES) {
      const url = pageUrl(locale, page);
      const response = await request.get(url);
      const html = await response.text();
      const title = first(html, /<title>([^<]+)<\/title>/);
      expect(title, `title of ${url}`).toMatch(/^.+ — Kitto Studio$/);
      expect(first(html, /<meta name="description" content="([^"]+)"/), url).toBeTruthy();
      expect(first(html, /<link rel="canonical" href="([^"]+)"/), url).toBe(`${ORIGIN}${url}`);
      for (const other of LOCALES) {
        expect(html, `hreflang ${other} on ${url}`).toContain(
          `<link rel="alternate" hreflang="${other}" href="${ORIGIN}${pageUrl(other, page)}">`
        );
      }
      expect(html).toContain(
        `<link rel="alternate" hreflang="x-default" href="${ORIGIN}${pageUrl("en", page)}">`
      );
      expect(first(html, /<meta property="og:locale" content="([^"]+)"/), url).toBe(
        OG_LOCALE[locale]
      );
      expect(first(html, /<meta property="og:url" content="([^"]+)"/), url).toBe(`${ORIGIN}${url}`);
      expect(first(html, /<meta property="og:image" content="([^"]+)"/), url).toMatch(
        new RegExp(`^${ORIGIN}/og/${locale}/`)
      );
      expect(first(html, /<meta property="og:title" content="([^"]+)"/), url).toBeTruthy();
    }
  });
}

test("OG card images answer 200", async ({ request }) => {
  const page = await request.get("/ja/games/memory-missing/");
  const html = await page.text();
  const image = first(html, /<meta property="og:image" content="([^"]+)"/) ?? "";
  const response = await request.get(image.replace(ORIGIN, ""));
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
});

test("root page canonical points at /en/", async ({ request }) => {
  const root = await request.get("/");
  const html = await root.text();
  expect(first(html, /<link rel="canonical" href="([^"]+)"/)).toBe(`${ORIGIN}/en/`);
});
