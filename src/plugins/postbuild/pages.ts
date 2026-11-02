/**
 * @file The site's pages as URL patterns, read from a route table by the app for the `pages` config,
 * and the two paths each pattern gives: the page in a locale and the bare path without the locale.
 */

/** A route as the page list reads it. */
type PatternedRoute = {
  /** URL pattern, such as `/{lang}/about/`. */
  readonly pattern: string;
};

/** The locale segment of a page pattern. */
const LOCALE_SEGMENT = "{lang}";

/**
 * The patterns of every localized page in a route table; the root language page has none. The app
 * passes the result as the plugin's `pages` config.
 *
 * @param routes - The route table.
 * @returns The patterns that carry `{lang}`, in route table order.
 * @example
 * ```ts
 * pagePatterns({ root: { pattern: "/" }, about: { pattern: "/{lang}/about/" } }); // ["/{lang}/about/"]
 * ```
 */
export function pagePatterns(routes: Readonly<Record<string, PatternedRoute>>): string[] {
  return Object.values(routes)
    .map(route => route.pattern)
    .filter(pattern => pattern.includes(LOCALE_SEGMENT));
}

/**
 * The path of a page in one locale.
 *
 * @param pattern - The page pattern.
 * @param locale - The locale.
 * @returns The page path.
 * @example
 * ```ts
 * localize("/{lang}/delete-data/", "uk"); // "/uk/delete-data/"
 * ```
 */
export function localize(pattern: string, locale: string): string {
  return pattern.replace(LOCALE_SEGMENT, locale);
}

/**
 * The bare path of a page: its pattern without the locale segment.
 *
 * @param pattern - The page pattern.
 * @returns The path a visitor may type without a locale.
 * @example
 * ```ts
 * barePath("/{lang}/games/memory-missing/"); // "/games/memory-missing/"
 * barePath("/{lang}/"); // "/"
 * ```
 */
export function barePath(pattern: string): string {
  return pattern.replace(`/${LOCALE_SEGMENT}`, "");
}
