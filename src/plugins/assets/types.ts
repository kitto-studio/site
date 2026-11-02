/**
 * @file Shared types of the assets plugin: config, the public API and its results, the context
 * slice the API reads, and the jobs the image pipeline plans.
 */

/** One PNG icon drawn from the favicon. */
export type Icon = {
  /** Output file, relative to the project. */
  output: string;
  /** Side of the square icon, px. */
  size: number;
};

/**
 * Assets config. Paths are relative to the project root, where `bun run images` runs.
 *
 * @example
 * ```ts
 * createApp({ plugins: [assetsPlugin], pluginConfigs: { assets: { quality: 90 } } });
 * ```
 */
export type Config = {
  /** Folder of the Astra PNG masters and the game's own webp art. */
  sourceDir: string;
  /** Folder the served files are written to, with the folders of `sourceDir`. */
  outDir: string;
  /** webp quality of every output, 1 to 100. */
  quality: number;
  /** Longer side of a full-size output, px. A smaller master is never enlarged. */
  maxSize: number;
  /** Longer side of a thumbnail, px; also its file name suffix (`<name>-256.webp`). */
  thumbSize: number;
  /** Top-level folders of `sourceDir` whose images also get a thumbnail. */
  thumbFolders: readonly string[];
  /** The PNG icons drawn from `public/favicon.svg`. */
  icons: readonly Icon[];
};

/** What one `images()` run did. */
export type ImagesResult = {
  /** Every output written, relative to the project, in source order. */
  written: readonly string[];
  /** How many outputs were newer than their source and skipped. */
  upToDate: number;
};

/** What one `icons()` run did. */
export type IconsResult = {
  /** Every icon written, relative to the project, in config order. */
  files: readonly string[];
};

/** The part of the plugin context the API reads. */
export type AssetsContext = {
  /** Resolved plugin config. */
  readonly config: Config;
};

/** Public API, mounted as `app.assets`. Both methods print one line per result. */
export type Api = {
  /**
   * Turn the masters in `sourceDir` into the served files in `outDir`. Every PNG becomes a webp at
   * `quality`, fitted into `maxSize` and never enlarged; a webp is copied unchanged; an image in
   * one of `thumbFolders` also gets a `<name>-<thumbSize>.webp`. An output newer than its source
   * is skipped, and the encoder is deterministic, so a rerun writes the same bytes. Rejects when a
   * master cannot be read.
   *
   * @returns The files written and the count of outputs that were up to date.
   * @example
   * ```ts
   * // A new clue master was saved as assets/site-art/clues/key-4-brass-key.png:
   * const { written, upToDate } = await app.assets.images();
   * written; // ["public/media/clues/key-4-brass-key.webp", "public/media/clues/key-4-brass-key-256.webp"]
   * upToDate; // 42
   * ```
   */
  images(): Promise<ImagesResult>;
  /**
   * Draw the PNG icons from `public/favicon.svg`: the light favicon centred on the paper colour,
   * with room around it for the rounded mask iOS and Android draw over home-screen icons. The
   * output is deterministic. Rejects when the favicon cannot be read.
   *
   * @returns The icon files written.
   * @example
   * ```ts
   * // After an edit of public/favicon.svg:
   * const { files } = await app.assets.icons();
   * files; // ["public/apple-touch-icon.png", "public/icon-512.png"]
   * ```
   */
  icons(): Promise<IconsResult>;
};

/** One file an `images()` run produces. */
export type ImageJob = {
  /** Source file, relative to the project. */
  source: string;
  /** Output file, relative to the project. */
  output: string;
  /** Longer side to fit into, px; absent for a byte copy. */
  size?: number;
};
