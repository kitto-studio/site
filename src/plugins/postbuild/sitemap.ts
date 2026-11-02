/**
 * @file `sitemap.xml` with `hreflang` alternates and `robots.txt`. Every page in every locale is a
 * `<url>`; the root language page is one more, with the home page's alternates. The alternates
 * come from {@link languageAlternates}, the same list the page heads carry.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { SITE } from "../../config";
import { LOCALES } from "../../i18n/languages";
import { languageAlternates } from "../../lib/head";
import { localize } from "./pages";
import type { SitemapEntry } from "./types";

/** The home page pattern, whose alternates the root page shares. */
const HOME_PATTERN = "/{lang}/";

/**
 * Escape the XML special characters of an attribute or text value.
 *
 * @param value - Raw value.
 * @returns The escaped value.
 * @example
 * ```ts
 * escapeXml("a&b"); // "a&amp;b"
 * ```
 */
function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * The sitemap entries of the site: the root page, then every page in every locale.
 *
 * @param pages - The localized page patterns.
 * @returns One entry per URL, each with its twelve alternates.
 * @example
 * ```ts
 * sitemapEntries(["/{lang}/"]).length; // 12: the root and the home page in 11 locales
 * ```
 */
export function sitemapEntries(pages: readonly string[]): SitemapEntry[] {
  const root = {
    loc: `${SITE.url}/`,
    alternates: languageAlternates(locale => localize(HOME_PATTERN, locale))
  };
  const localized = pages.flatMap(pattern => {
    const alternates = languageAlternates(locale => localize(pattern, locale));
    return LOCALES.map(locale => ({ loc: SITE.url + localize(pattern, locale), alternates }));
  });
  return [root, ...localized];
}

/**
 * Render one sitemap entry.
 *
 * @param entry - The entry.
 * @returns The `<url>` element with its `xhtml:link` alternates.
 */
function renderEntry(entry: SitemapEntry): string {
  const links = entry.alternates.map(
    alternate =>
      `    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}"/>`
  );
  return ["  <url>", `    <loc>${escapeXml(entry.loc)}</loc>`, ...links, "  </url>"].join("\n");
}

/**
 * Render the sitemap of the site.
 *
 * @param pages - The localized page patterns.
 * @returns The `sitemap.xml` document.
 * @example
 * ```ts
 * buildSitemap(["/{lang}/about/"]).includes("<loc>https://kitto.studio/ru/about/</loc>"); // true
 * ```
 */
export function buildSitemap(pages: readonly string[]): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...sitemapEntries(pages).map(entry => renderEntry(entry)),
    "</urlset>",
    ""
  ].join("\n");
}

/**
 * Render `robots.txt`: everything may be crawled, and the sitemap is named.
 *
 * @returns The `robots.txt` content.
 * @example
 * ```ts
 * buildRobots().endsWith("Sitemap: https://kitto.studio/sitemap.xml\n"); // true
 * ```
 */
export function buildRobots(): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${SITE.url}/sitemap.xml`, ""].join("\n");
}

/**
 * Write `sitemap.xml` and `robots.txt` into a built output directory.
 *
 * @param outputDirectory - The output directory.
 * @param pages - The localized page patterns.
 * @returns The written files, relative to `outputDirectory`.
 */
export async function writeSitemap(
  outputDirectory: string,
  pages: readonly string[]
): Promise<string[]> {
  await writeFile(path.join(outputDirectory, "sitemap.xml"), buildSitemap(pages), "utf8");
  await writeFile(path.join(outputDirectory, "robots.txt"), buildRobots(), "utf8");
  return ["sitemap.xml", "robots.txt"];
}
