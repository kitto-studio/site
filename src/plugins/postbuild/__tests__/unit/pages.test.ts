import { describe, expect, it } from "vitest";
import { barePath, localize, pagePatterns } from "../../pages";

describe("page patterns", () => {
  // Catches: a route without `{lang}` (the root language page) taken for a page, so the sitemap
  // lists "/" once per locale and `_redirects` gets a rule for it; or a localized page dropped, so
  // it is missing from both lists; or the table order lost, so the sitemap order shifts per build.
  it("keeps every route with {lang}, in table order, and drops the others", () => {
    const routes = {
      root: { pattern: "/" },
      home: { pattern: "/{lang}/" },
      feed: { pattern: "/feed.xml" },
      about: { pattern: "/{lang}/about/" }
    };

    expect(pagePatterns(routes)).toEqual(["/{lang}/", "/{lang}/about/"]);
  });

  // Catches: the locale segment replaced with its slash left behind ("//about/") or not replaced at
  // all, which gives broken sitemap urls and redirect sources; and home's bare path not being "/",
  // which `buildRedirects` reads to leave the root language page alone.
  it("turns a pattern into its page in a locale and its bare path", () => {
    expect(localize("/{lang}/games/memory-missing/", "ja")).toBe("/ja/games/memory-missing/");
    expect(barePath("/{lang}/games/memory-missing/")).toBe("/games/memory-missing/");
    expect(localize("/{lang}/", "en")).toBe("/en/");
    expect(barePath("/{lang}/")).toBe("/");
  });
});
