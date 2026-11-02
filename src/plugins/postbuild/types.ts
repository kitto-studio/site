/**
 * @file Shared types of the postbuild plugin: config, state, the public API, the context slice the
 * domain files read, and the shapes the sitemap and 404 steps pass around. The OG card types live
 * in `og/types.ts`.
 */
import type { Log } from "@moku-labs/web";
import type { Locale } from "../../i18n/languages";
import type { Alternate } from "../../lib/head";
import type { CardCache } from "./og/types";

/**
 * Postbuild config.
 *
 * @example
 * ```ts
 * createApp({ pluginConfigs: { postbuild: { template: "src/index.html", pages: ["/{lang}/", "/{lang}/about/"] } } });
 * ```
 */
export type Config = {
  /** Output directory `run()` writes into when it gets none. */
  outDir: string;
  /** The page shell of the build (`build.template`); the 404 pages are composed from it. */
  template: string;
  /**
   * URL pattern of every localized page (`/{lang}/about/`), in route table order: the sitemap and
   * `_redirects` list these. The app passes `pagePatterns(routes)`.
   */
  pages: readonly string[];
};

/** What one run wrote. */
export type PostbuildResult = {
  /** Every file written, relative to the output directory, in write order. */
  files: readonly string[];
};

/**
 * Mutable plugin state, kept for the life of the process.
 *
 * - `runs` holds the run in progress per output directory, so the `build:complete` run and a
 *   caller's `run()` share one run instead of writing the same files at the same time.
 * - `cards` holds every OG card drawn so far, so a dev rebuild writes the cards again without
 *   drawing them again (some 9 s per rebuild).
 */
export type State = {
  /** Runs in progress, keyed by absolute output directory. A finished run leaves the map. */
  runs: Map<string, Promise<PostbuildResult>>;
  /** Drawn OG card PNGs, keyed `{kind}/{locale}`. */
  cards: CardCache;
};

/** The part of the plugin context the domain files read. */
export type PostbuildContext = {
  /** Resolved plugin config. */
  readonly config: Config;
  /** Plugin state. */
  readonly state: State;
  /** The framework logger. */
  readonly log: Pick<Log.LogApi, "info" | "error">;
};

/** Public API, mounted as `app.postbuild`. */
export type Api = {
  /**
   * Write the site's post-build files into a built output directory: `sitemap.xml` and
   * `robots.txt`, `_redirects`, the root and per-locale `404.html`, and the OG cards. The build
   * already runs it on `build:complete`; while that run is in progress for the same directory,
   * `run` returns it instead of starting a second one. Rejects when a step fails.
   *
   * @param outputDirectory - The built output directory. Defaults to the configured `outDir`.
   * @returns Every file written, relative to `outputDirectory`.
   * @example
   * ```ts
   * // A preview build: wait for the post-build files the build started writing.
   * await app.build.run({ outDir: "preview" });
   * const { files } = await app.postbuild.run("preview");
   * files.includes("ru/404.html"); // true
   * ```
   */
  run(outputDirectory?: string): Promise<PostbuildResult>;
};

/** One `<url>` of the sitemap. */
export type SitemapEntry = {
  /** Absolute URL of the page. */
  loc: string;
  /** The page in every locale, then `x-default`. */
  alternates: readonly Alternate[];
};

/** One 404 page to write. */
export type NotFoundFile = {
  /** Locale of the page text and links. */
  locale: Locale;
  /** Path relative to the output directory. */
  file: string;
};
