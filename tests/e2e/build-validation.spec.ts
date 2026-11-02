/**
 * @file The build emitted what it should: 88 pages, the root page, a 404 page per locale, the
 * hreflang sitemap, robots.txt, the cache headers and the bare-path redirects to /en/.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { expect, onlyOn, test } from "./_fixtures";
import { LOCALES, ORIGIN, PAGES } from "./_site";

onlyOn("chromium-desktop");

/** Output dir the webServer builds. */
const DIST = "dist";

test("every page of every locale, the root and the 404s are emitted", () => {
  expect(existsSync(path.join(DIST, "index.html"))).toBe(true);
  expect(existsSync(path.join(DIST, "404.html"))).toBe(true);
  for (const locale of LOCALES) {
    expect(existsSync(path.join(DIST, locale, "404.html")), `${locale}/404.html`).toBe(true);
    for (const page of PAGES) {
      const file = path.join(DIST, locale, page.path, "index.html");
      expect(existsSync(file), file).toBe(true);
    }
  }
});

test("the sitemap lists every page with its alternates", () => {
  const sitemap = readFileSync(path.join(DIST, "sitemap.xml"), "utf8");
  for (const locale of LOCALES) {
    for (const page of PAGES)
      expect(sitemap).toContain(`<loc>${ORIGIN}/${locale}${page.path}</loc>`);
  }
  expect(sitemap).not.toContain("404");
  expect(readFileSync(path.join(DIST, "robots.txt"), "utf8")).toContain(
    `Sitemap: ${ORIGIN}/sitemap.xml`
  );
});

test("bare paths redirect to English and bundles are cached immutable", () => {
  const redirects = readFileSync(path.join(DIST, "_redirects"), "utf8");
  for (const page of PAGES.filter(each => each.path !== "/")) {
    expect(redirects).toContain(`${page.path} /en${page.path} 302`);
  }
  const headers = readFileSync(path.join(DIST, "_headers"), "utf8");
  expect(headers).toMatch(
    /\/assets\/spa-[\w-]+\.js\n\s+! Cache-Control\n\s+Cache-Control: public, max-age=31536000, immutable/
  );
});
