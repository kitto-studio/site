import { createUrls } from "@moku-labs/web/browser";
import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE } from "../../src/i18n/languages";
import { routes, urls } from "../../src/routes";

// The router and the build resolve URLs and output files with the i18n default locale, so a
// `{lang:?}` segment would serve English at bare paths there even though `urls` keeps the prefix.
const served = createUrls(routes, DEFAULT_LOCALE);

// Catches: a pattern change that moves a URL already given to Apple and Google, or an optional
// `{lang:?}` segment that drops the /en/ prefix from the built site.
describe("route table", () => {
  it("keeps the store URLs stable, as linked and as served", () => {
    for (const builder of [urls, served]) {
      expect(builder.toUrl("privacy", { lang: "en" })).toBe("/en/privacy/");
      expect(builder.toUrl("support", { lang: "en" })).toBe("/en/support/");
      expect(builder.toUrl("deleteData", { lang: "en" })).toBe("/en/delete-data/");
      expect(builder.toUrl("root")).toBe("/");
    }
  });

  it("prefixes every locale, the default one too", () => {
    expect(served.toUrl("home", { lang: "en" })).toBe("/en/");
    expect(served.toUrl("memoryMissing", { lang: "ja" })).toBe("/ja/games/memory-missing/");
  });
});
