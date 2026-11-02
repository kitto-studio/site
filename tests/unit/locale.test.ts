import { describe, expect, it } from "vitest";
import { LOCALES } from "../../src/i18n/languages";
import { pickLocale, ROOT_REDIRECT_SCRIPT } from "../../src/lib/locale";
import { urls } from "../../src/routes";

describe("pickLocale", () => {
  // Catches: the browser language checked before the reader's own saved choice.
  it("prefers a saved supported choice over the browser languages", () => {
    expect(pickLocale("ja", ["de-DE", "de"], LOCALES)).toBe("ja");
  });

  // Catches: an unknown saved value used as is, which sends the reader to a 404 like /pl/.
  it("ignores a saved value that is not a supported locale", () => {
    expect(pickLocale("pl", ["de-DE"], LOCALES)).toBe("de");
  });

  // Catches: exact-only matching, which sends every pt-BR or uk-UA browser to English.
  it("maps a region tag to its base language", () => {
    expect(pickLocale(undefined, ["pt-BR"], LOCALES)).toBe("pt");
    expect(pickLocale(undefined, ["uk-UA"], LOCALES)).toBe("uk");
  });

  // Catches: Traditional Chinese browsers falling to English although only Simplified is offered.
  it("sends every Chinese variant to zh", () => {
    expect(pickLocale(undefined, ["zh-TW"], LOCALES)).toBe("zh");
    expect(pickLocale(undefined, ["zh-Hant-HK"], LOCALES)).toBe("zh");
  });

  // Catches: a later exact match beating the reader's first preference.
  it("keeps the order of the browser languages", () => {
    expect(pickLocale(undefined, ["pl-PL", "fr-CA", "en"], LOCALES)).toBe("fr");
  });

  // Catches: an unsupported list or an empty one ending without a locale.
  it("falls back to English", () => {
    expect(pickLocale(undefined, ["pl-PL", "nl"], LOCALES)).toBe("en");
    expect(pickLocale(undefined, [], LOCALES)).toBe("en");
  });
});

/** The browser the inline script sees. */
type Browser = {
  /** The saved `kitto-lang`; `"throws"` makes storage throw like a blocked private mode. */
  saved: string | undefined | "throws";
  /** `navigator.languages`. */
  languages: string[];
  /** `location.search` of the root URL, "" by default. */
  search?: string;
  /** `location.hash` of the root URL, "" by default. */
  hash?: string;
};

/** Run the root page's inline script in a fake browser; returns the path it redirects to. */
function runScript({ saved, languages, search = "", hash = "" }: Browser): string {
  const replaced: string[] = [];
  const storage = {
    getItem: (): string | undefined => {
      if (saved === "throws") throw new Error("blocked");
      return saved;
    }
  };
  const location = { search, hash, replace: (path: string) => replaced.push(path) };
  // Runs the shipped inline script as the browser would, with these three globals.
  new Function("localStorage", "navigator", "location", ROOT_REDIRECT_SCRIPT)(
    storage,
    { languages },
    location
  );
  expect(replaced).toHaveLength(1);
  return replaced[0] ?? "";
}

describe("root redirect script", () => {
  const cases: Browser[] = [
    { saved: "ko", languages: ["en-US"] },
    { saved: "pl", languages: ["it-IT"] },
    { saved: "throws", languages: ["ru-RU", "en"] },
    { saved: undefined, languages: ["pt-BR", "en"] },
    { saved: undefined, languages: ["zh-TW"] },
    { saved: undefined, languages: ["pl-PL", "es-419"] },
    { saved: undefined, languages: ["nl-NL"] },
    { saved: undefined, languages: [] }
  ];

  // Catches: the inline script and pickLocale drifting apart (a rule, the list, the key or the
  // default edited in one place only), a storage error stopping the redirect, and a home URL that is
  // not the route table's.
  it.each(cases)("redirects where pickLocale points: $saved, $languages", browser => {
    const saved = browser.saved === "throws" ? undefined : browser.saved;
    const lang = pickLocale(saved, browser.languages, LOCALES);
    expect(runScript(browser)).toBe(urls.toUrl("home", { lang }));
  });

  // Catches: a redirect that drops what the root URL carried (a `?theme=` preview, a campaign
  // query, an anchor), so `/?theme=dark#top` lands on a bare home page.
  it("keeps the query and the hash of the root URL", () => {
    const browser: Browser = { saved: "de", languages: [], search: "?theme=dark", hash: "#top" };
    expect(runScript(browser)).toBe(`${urls.toUrl("home", { lang: "de" })}?theme=dark#top`);
  });
});
