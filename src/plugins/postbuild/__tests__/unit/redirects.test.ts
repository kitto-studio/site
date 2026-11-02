import { describe, expect, it } from "vitest";
import { routes } from "../../../../routes";
import { pagePatterns } from "../../pages";
import { buildRedirects } from "../../redirects";

const rules = buildRedirects(pagePatterns(routes));

// The 8 pages: home's bare path is the root language page, the 7 others redirect.
const BARE_PAGES = [
  "/about/",
  "/games/",
  "/games/memory-missing/",
  "/support/",
  "/privacy/",
  "/terms/",
  "/delete-data/"
];

// Catches: a page whose bare link (`kitto.studio/privacy`) ends on a 404, a redirect to the wrong
// locale or with a permanent code, and a rule that hides the root language page.
describe("redirects", () => {
  it("sends the bare path of every page, with and without the slash, to the English page", () => {
    const expected = BARE_PAGES.flatMap(source => [
      `${source} /en${source} 302`,
      `${source.slice(0, -1)} /en${source} 302`
    ]);

    expect(rules).toEqual(expected);
  });

  it("leaves the root path to the language page", () => {
    expect(rules.some(rule => rule.startsWith("/ ") || rule.startsWith(" "))).toBe(false);
  });
});
