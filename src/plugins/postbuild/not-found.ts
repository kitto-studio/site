/**
 * @file The 404 pages: the root `404.html` (English) and `{lang}/404.html` for every locale, each a
 * complete document from the site's page shell. Cloudflare Pages serves the nearest `404.html` up
 * the path, so `/ru/anything` gets the Russian page. The asset tags come from the root 404 the
 * framework already wrote with the fingerprinted bundle names.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_LOCALE, LOCALES } from "../../i18n/languages";
import { notFoundDocument } from "../../lib/not-found";
import type { NotFoundFile } from "./types";

/** The stylesheet and client script tags the build injects (`/assets/` holds only bundles). */
const ASSET_TAG =
  /<link rel="stylesheet" href="\/assets\/[^"]+">|<script type="module" src="\/assets\/[^"]+"><\/script>/g;

/**
 * The 404 pages to write: the root one in the default locale, then one per locale.
 *
 * @returns Twelve files, each with its locale.
 * @example
 * ```ts
 * notFoundFiles()[1]; // { locale: "en", file: "en/404.html" }
 * ```
 */
export function notFoundFiles(): NotFoundFile[] {
  return [
    { locale: DEFAULT_LOCALE, file: "404.html" },
    ...LOCALES.map(locale => ({ locale, file: `${locale}/404.html` }))
  ];
}

/**
 * The fingerprinted asset tags of a built document.
 *
 * @param document - A page the build wrote, with its asset placeholders substituted.
 * @returns The stylesheet and script tags, in document order.
 * @throws {Error} When the document has none: the 404 pages would ship unstyled and without the
 *   client script.
 * @example
 * ```ts
 * assetTags('<body><link rel="stylesheet" href="/assets/main-1a2b.css"></body>');
 * // '<link rel="stylesheet" href="/assets/main-1a2b.css">'
 * ```
 */
export function assetTags(document: string): string {
  const tags = document.match(ASSET_TAG) ?? [];
  if (tags.length === 0) {
    throw new Error(
      "[kitto] postbuild: the built 404.html has no asset tags to copy into the 404 pages.\n  Keep the <!--moku:assets:css--> and <!--moku:assets:js--> placeholders in notFoundBody (src/lib/not-found.tsx)."
    );
  }
  return tags.join("");
}

/**
 * Write the root and per-locale 404 pages into a built output directory.
 *
 * @param outputDirectory - The output directory, holding the framework's root `404.html`.
 * @param template - Path of the page shell (`build.template`).
 * @returns The written files, relative to `outputDirectory`.
 */
export async function writeNotFoundPages(
  outputDirectory: string,
  template: string
): Promise<string[]> {
  const [built, shell] = await Promise.all([
    readFile(path.join(outputDirectory, "404.html"), "utf8"),
    readFile(template, "utf8")
  ]);
  const assets = assetTags(built);
  const files = notFoundFiles();
  for (const { locale, file } of files) {
    const target = path.join(outputDirectory, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, notFoundDocument(shell, locale, assets), "utf8");
  }
  return files.map(entry => entry.file);
}
