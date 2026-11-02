/**
 * @file Route head builder: title and description from i18n, the locale's OG card, `og:type` and
 * `og:site_name`, the language alternates with `x-default` on the English page, and the CJK font
 * stylesheet. The framework composes canonical and `og:locale`; the keyed elements here replace
 * its alternates, they never add a second set.
 */
import { type Head, hreflang, og } from "@moku-labs/web/browser";
import { SITE } from "../config";
import { t } from "../i18n";
import { asLocale, CJK, DEFAULT_LOCALE, LOCALES, type Locale } from "../i18n/languages";
import type { PageId } from "../i18n/types";

/** A page that has a route (every page but the 404). */
export type RoutePage = Exclude<PageId, "notFound">;

/** The two OG cards per locale: `home` for every page, `game` for the game page. */
export type OgCardKind = "home" | "game";

/** One language alternate of a page. */
export type Alternate = {
  /** Locale code, or `x-default`. */
  hreflang: string;
  /** Absolute URL of the page in that language. */
  href: string;
};

/** The part of a route context the head builder reads. */
type HeadContext = {
  /** Active locale of the rendered page. */
  locale: string;
  /** Link builder over the route table (route name and params to a path). */
  url: (name: string, params?: Record<string, string>) => string;
};

/**
 * The URL path of an OG card, the same path the postbuild plugin writes the PNG to.
 *
 * @param kind - The card.
 * @param locale - The card's locale.
 * @returns The root-relative path of the PNG.
 * @example
 * ```ts
 * ogImagePath("game", "ja"); // "/og/ja/game.png"
 * ```
 */
export function ogImagePath(kind: OgCardKind, locale: Locale): string {
  return `/og/${locale}/${kind}.png`;
}

/**
 * The language alternates of one page: the page in every locale, then `x-default` on the
 * default-locale URL. Bare paths only redirect (302), so `x-default` names the real page.
 *
 * @param pathFor - The page's path in a locale.
 * @returns Eleven locale alternates and `x-default`, as absolute URLs.
 * @example
 * ```ts
 * languageAlternates(locale => `/${locale}/about/`).at(-1);
 * // { hreflang: "x-default", href: "https://kitto.studio/en/about/" }
 * ```
 */
export function languageAlternates(pathFor: (locale: Locale) => string): Alternate[] {
  const alternates = LOCALES.map(locale => ({
    hreflang: locale,
    href: SITE.url + pathFor(locale)
  }));
  return [...alternates, { hreflang: "x-default", href: SITE.url + pathFor(DEFAULT_LOCALE) }];
}

/**
 * The CJK font stylesheet of a locale (`public/css/fonts-<locale>.css`), so the CJK faces
 * download only on that locale's pages.
 *
 * @param locale - The page locale.
 * @returns The stylesheet path for ja, ko and zh; `undefined` for the other locales.
 * @example
 * ```ts
 * cjkFontHref("ko"); // "/css/fonts-ko.css"
 * cjkFontHref("de"); // undefined
 * ```
 */
export function cjkFontHref(locale: Locale): string | undefined {
  return CJK.has(locale) ? `/css/fonts-${locale}.css` : undefined;
}

/**
 * The `<link>` to a CJK locale's font stylesheet.
 *
 * @param locale - The page locale.
 * @returns One stylesheet link for ja, ko and zh; none for the other locales.
 */
function cjkFontLinks(locale: Locale): Head.HeadElement[] {
  const href = cjkFontHref(locale);
  if (href === undefined) return [];
  return [{ tag: "link", attrs: { rel: "stylesheet", href }, key: "font:cjk" }];
}

/**
 * The `hreflang` links of a page, keyed like the framework's own so they replace them. The root
 * language page has no locale of its own: it carries the alternates of the home page.
 *
 * @param page - The rendered page.
 * @param ctx - The route context.
 * @returns Eleven locale links and `x-default` on the English page.
 */
function hreflangLinks(page: RoutePage, ctx: HeadContext): Head.HeadElement[] {
  const route = page === "root" ? "home" : page;
  const alternates = languageAlternates(locale => ctx.url(route, { lang: locale }));
  return alternates.map(alternate => hreflang(alternate.hreflang, alternate.href));
}

/**
 * Build the `.head()` handler of one page.
 *
 * @param page - The page whose head copy to use.
 * @returns A route head handler: title, description and OG card in the route's locale, the
 *   `og:type` / `og:site_name` tags, the language links and, on CJK pages, the font stylesheet.
 * @example
 * ```ts
 * route("/{lang}/about/").head(pageHead("about"));
 * ```
 */
export function pageHead(page: RoutePage): (ctx: HeadContext) => Head.HeadConfig {
  return ctx => {
    const locale = asLocale(ctx.locale);
    const { title, description } = t(locale).meta[page];
    return {
      title,
      description,
      image: ogImagePath(page === "memoryMissing" ? "game" : "home", locale),
      elements: [
        og("og:type", "website"),
        og("og:site_name", SITE.name),
        ...hreflangLinks(page, ctx),
        ...cjkFontLinks(locale)
      ]
    };
  };
}
