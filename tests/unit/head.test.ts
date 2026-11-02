import { createUrls, hreflang, type Router } from "@moku-labs/web/browser";
import { describe, expect, it } from "vitest";
import { t } from "../../src/i18n";
import { pageHead, type RoutePage } from "../../src/lib/head";
import { OG_CARDS } from "../../src/og/cards";
import { routes } from "../../src/routes";

const links = createUrls<Router.RouteMap>(routes);

/** The head of a page as the build renders it: real locale, real link builder. */
const headOf = (page: RoutePage, locale: string) =>
  pageHead(page)({ locale, url: (name, params) => links.toUrl(name, params) });

const stylesheetHrefs = (locale: string): string[] =>
  (headOf("home", locale).elements ?? [])
    .filter(element => element.attrs?.rel === "stylesheet")
    .map(element => element.attrs?.href ?? "");

const elementByKey = (page: RoutePage, locale: string, key: string) =>
  (headOf(page, locale).elements ?? []).find(element => element.key === key);

const alternateHrefs = (page: RoutePage, locale: string): string[] =>
  (headOf(page, locale).elements ?? [])
    .filter(element => element.attrs?.rel === "alternate")
    .map(element => `${element.attrs?.hreflang} ${element.attrs?.href}`);

// Catches: a page wired to another page's head copy, and CJK fonts loaded on the wrong locales
// (missing on ja/ko/zh, or a heavy CJK stylesheet on every other page).
describe("pageHead", () => {
  it("returns the page's own title and description", () => {
    const head = headOf("privacy", "en");

    expect(head.title).toBe(t("en").meta.privacy.title);
    expect(head.description).toBe(t("en").meta.privacy.description);
  });

  it("links the CJK font stylesheet only on ja, ko and zh pages", () => {
    expect(stylesheetHrefs("ja")).toEqual(["/css/fonts-ja.css"]);
    expect(stylesheetHrefs("ko")).toEqual(["/css/fonts-ko.css"]);
    expect(stylesheetHrefs("zh")).toEqual(["/css/fonts-zh.css"]);
    expect(stylesheetHrefs("en")).toEqual([]);
    expect(stylesheetHrefs("ru")).toEqual([]);
  });

  // Catches: a page linking another page's card, a share preview in the wrong language, and a page
  // linking a PNG the build never wrote (a page without a row, the root page).
  it("links each page's own card, and the home card where a page has none", () => {
    for (const [name, card] of Object.entries(OG_CARDS)) {
      expect(headOf(card.page, "de").image, name).toBe(`/og/de/${name}.png`);
    }
    expect(headOf("root", "en").image).toBe("/og/en/home.png");

    const carded = new Set<string>(Object.values(OG_CARDS).map(card => card.page));
    const uncarded = (Object.keys(routes) as RoutePage[]).filter(
      page => page !== "root" && !carded.has(page)
    );
    for (const page of uncarded) expect(headOf(page, "ja").image, page).toBe("/og/ja/home.png");
  });

  // Catches: share previews without the site name or the object type the spec asks for.
  it("marks every page as a website of Kitto Studio", () => {
    expect(elementByKey("about", "fr", "meta:og:type")?.attrs?.content).toBe("website");
    expect(elementByKey("about", "fr", "meta:og:site_name")?.attrs?.content).toBe("Kitto Studio");
  });

  // Catches: x-default on the bare path (a 302, not a page), or an element keyed differently from
  // the framework's, which would print a second x-default instead of replacing the first.
  it("points x-default at the English page, keyed to replace the framework's link", () => {
    const xDefault = elementByKey("privacy", "ru", "link:alternate:x-default");

    expect(xDefault).toEqual(hreflang("x-default", "https://kitto.studio/en/privacy/"));
  });

  // Catches: link previews of kitto.studio (bots never run the redirect) titled "Choose your
  // language" instead of the studio's own title and description.
  it("gives the root page the home page's title and description", () => {
    const root = headOf("root", "en");
    const home = headOf("home", "en");

    expect(root.title).toBe(home.title);
    expect(root.description).toBe(home.description);
  });

  // Catches: the root language page listing "/" as every language, instead of the home pages.
  it("gives the root page the home page's alternates", () => {
    const hrefs = alternateHrefs("root", "en");

    expect(hrefs).toHaveLength(12);
    expect(hrefs).toContain("ru https://kitto.studio/ru/");
    expect(hrefs).toContain("zh https://kitto.studio/zh/");
    expect(hrefs.at(-1)).toBe("x-default https://kitto.studio/en/");
  });
});
