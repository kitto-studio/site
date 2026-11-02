/**
 * @file Link integrity over HTTP, every page of every locale: each page answers 200, the header nav
 * and the footer legal links stay in the page's locale and resolve 200, every internal link on the
 * page resolves, and each locale's unknown URL answers its own 404 page.
 */
import { expect, onlyOn, test } from "./_fixtures";
import { FOOTER_PATHS, LOCALES, NAV_PATHS, PAGES, pageUrl } from "./_site";

onlyOn("chromium-desktop");

/** Status of every internal URL already fetched. */
const statuses = new Map<string, number>();

/**
 * The hrefs of the anchors inside the first match of a tag.
 *
 * @param html - The page HTML.
 * @param tag - `header`, `footer` or `main`.
 * @returns The href values in document order.
 */
function hrefsIn(html: string, tag: string): string[] {
  const start = html.indexOf(`<${tag} `);
  const end = html.indexOf(`</${tag}>`, start);
  const part = start === -1 ? "" : html.slice(start, end);
  return [...part.matchAll(/<a [^>]*href="([^"]+)"/g)].map(match => match[1] ?? "");
}

for (const locale of LOCALES) {
  test(`every ${locale} page links within ${locale} and every link resolves`, async ({
    request
  }) => {
    for (const page of PAGES) {
      const url = pageUrl(locale, page);
      const response = await request.get(url);
      expect(response.status(), url).toBe(200);
      const html = await response.text();

      const footer = hrefsIn(html, "footer");
      expect(footer, `footer of ${url}`).toEqual(FOOTER_PATHS.map(path => pageUrl(locale, path)));

      const header = hrefsIn(html, "header").filter(href => !href.startsWith("#"));
      for (const path of NAV_PATHS)
        expect(header, `header of ${url}`).toContain(pageUrl(locale, path));
      expect(header, `logo of ${url}`).toContain(`/${locale}/`);

      const internal = [...html.matchAll(/<a [^>]*href="(\/[^"#]*)"/g)].map(
        match => match[1] ?? ""
      );
      for (const href of new Set(internal)) {
        expect(href.startsWith(`/${locale}/`), `${href} on ${url} leaves ${locale}`).toBe(true);
        if (!statuses.has(href)) {
          const linked = await request.get(href);
          statuses.set(href, linked.status());
        }
        expect(statuses.get(href), `${href} on ${url}`).toBe(200);
      }
    }
  });

  test(`/${locale}/ unknown URL answers the ${locale} 404 page`, async ({ request }) => {
    const response = await request.get(`/${locale}/no-such-page/`);
    expect(response.status()).toBe(404);
    const html = await response.text();
    expect(html).toContain(`<html lang="${locale}"`);
    expect(html).toContain('data-component="not-found"');
    expect(html).toContain('name="robots" content="noindex"');
    expect(hrefsIn(html, "footer")).toEqual(FOOTER_PATHS.map(path => pageUrl(locale, path)));
  });
}

test("the root page lists every locale home", async ({ request }) => {
  const root = await request.get("/");
  const html = await root.text();
  for (const locale of LOCALES) expect(html).toContain(`href="/${locale}/"`);
});
