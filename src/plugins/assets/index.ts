/**
 * Assets plugin — Complex tier: the OG cards are a sub-domain in `og/`. Node only, composed into
 * `src/app.ts` alone.
 *
 * The site's committed media: `app.assets.images()` turns the Astra masters into the served webp
 * files, `app.assets.icons()` draws the PNG icons from the favicon, `app.assets.og()` draws the
 * OG cards that changed. Run by `bun run images`, `bun run icons` and `bun run og`, never by the
 * build. Emits no events.
 *
 * @see README.md
 */
import { createPlugin } from "@moku-labs/web";
import { createAssetsApi } from "./api";
import type { Config } from "./types";

/** Default config: the masters and outputs, the webp settings, the icons and the OG cards. */
const defaultConfig: Config = {
  sourceDir: "assets/site-art",
  outDir: "public/media",
  quality: 82,
  maxSize: 1600,
  thumbSize: 256,
  thumbFolders: ["clues", "game"],
  icons: [
    { output: "public/apple-touch-icon.png", size: 180 },
    { output: "public/icon-512.png", size: 512 }
  ],
  ogDir: "public/og",
  ogManifest: "assets/og-manifest.json"
};

/** Media pipeline plugin, exposed as `app.assets`. */
export const assetsPlugin = createPlugin("assets", { config: defaultConfig, api: createAssetsApi });
