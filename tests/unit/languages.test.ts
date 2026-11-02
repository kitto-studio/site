import { describe, expect, it } from "vitest";
import { asLocale, isLocale } from "../../src/i18n/languages";

// Catches: a route locale outside the 11 reaching t() and rendering undefined strings, or a
// supported locale being folded into English.
describe("asLocale", () => {
  it("keeps every supported locale and falls back to en for anything else", () => {
    expect(asLocale("ja")).toBe("ja");
    expect(asLocale("zh")).toBe("zh");
    expect(asLocale("pl")).toBe("en");
    expect(asLocale("")).toBe("en");
  });

  it("matches codes exactly, so a region tag is not a locale", () => {
    expect(isLocale("pt")).toBe(true);
    expect(isLocale("pt-BR")).toBe(false);
  });
});
