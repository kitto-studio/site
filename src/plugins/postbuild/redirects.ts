/**
 * @file `_redirects` (Cloudflare Pages): the bare path of every page, with and without its trailing
 * slash, answers 302 with the English page, so a link without a locale never ends on a 404. The
 * bare `/` is the root language page itself and gets no rule.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_LOCALE } from "../../i18n/languages";
import { barePath, localize } from "./pages";

/**
 * The redirect rules of the site.
 *
 * @param pages - The localized page patterns.
 * @returns One `source target 302` line per bare path, both slash forms.
 * @example
 * ```ts
 * buildRedirects(["/{lang}/", "/{lang}/about/"]);
 * // ["/about/ /en/about/ 302", "/about /en/about/ 302"]
 * ```
 */
export function buildRedirects(pages: readonly string[]): string[] {
  return pages
    .filter(pattern => barePath(pattern) !== "/")
    .flatMap(pattern => {
      const source = barePath(pattern);
      const target = localize(pattern, DEFAULT_LOCALE);
      return [`${source} ${target} 302`, `${source.slice(0, -1)} ${target} 302`];
    });
}

/**
 * Write `_redirects` into a built output directory.
 *
 * @param outputDirectory - The output directory.
 * @param pages - The localized page patterns.
 * @returns The written file, relative to `outputDirectory`.
 */
export async function writeRedirects(
  outputDirectory: string,
  pages: readonly string[]
): Promise<string[]> {
  const rules = buildRedirects(pages);
  await writeFile(path.join(outputDirectory, "_redirects"), `${rules.join("\n")}\n`, "utf8");
  return ["_redirects"];
}
