import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { t } from "../../src/i18n";
import { notFoundBody, notFoundDocument } from "../../src/lib/not-found";

const shell = readFileSync("src/index.html", "utf8");
const assets =
  '<link rel="stylesheet" href="/assets/main-1a2b.css"><script type="module" src="/assets/spa-3c4d.js"></script>';

// Catches: the root 404 shipping unstyled (the framework's 404 shell has no asset links, only the
// placeholder in the body brings the stylesheet), or without the chrome and its way back home.
describe("notFoundBody", () => {
  it("starts with the stylesheet placeholder and renders the page inside the chrome", () => {
    const html = notFoundBody("en");

    expect(html.startsWith("<!--moku:assets:css-->")).toBe(true);
    expect(html).toContain("<h1>Page not found</h1>");
    expect(html).toContain('<main id="main"><div data-page');
    expect(html).toContain('href="/en/"');
    expect(html).toContain('href="/en/privacy/"');
  });

  // Catches: a 404 without the client script, where the header menus and the theme switch are dead.
  it("ends with the client script placeholder", () => {
    expect(notFoundBody("en").endsWith("<!--moku:assets:js-->")).toBe(true);
  });
});

// Catches: per-locale 404s in the wrong language or html lang, indexed by search engines, without
// the no-flash theme script or the bundle, or Japanese pages without their font.
describe("notFoundDocument", () => {
  it("fills every slot of the page shell for the locale", () => {
    const html = notFoundDocument(shell, "ja", assets);

    expect(html).toContain('<html lang="ja">');
    expect(html).toContain(`<title>${t("ja").meta.notFound.title} — Kitto Studio</title>`);
    expect(html).toContain('<meta name="robots" content="noindex"/>');
    expect(html).toContain('<link rel="stylesheet" href="/css/fonts-ja.css"/>');
    expect(html).toContain('localStorage.getItem("kitto-theme")');
    expect(html).toContain(assets);
    expect(html).toContain('href="/ja/"');
    expect(html).not.toContain("<!--moku:");
  });

  it("links no CJK font on other locales", () => {
    expect(notFoundDocument(shell, "uk", assets)).not.toContain("/css/fonts-");
  });
});
