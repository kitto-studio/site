/**
 * Assets plugin — Standard tier. Node only, composed into `src/app.ts` alone.
 *
 * The site's committed media: `app.assets.images()` turns the Astra masters into the served webp
 * files, `app.assets.icons()` draws the PNG icons from the favicon. Run by `bun run images` and
 * `bun run icons`, never by the build. Emits no events.
 *
 * @see README.md
 */
import { createPlugin } from "@moku-labs/web";
import { createAssetsApi } from "./api";
import type { Config } from "./types";

/** Default config: the masters and outputs, the webp settings and the icons. */
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
  ]
};

/** Media pipeline plugin, exposed as `app.assets`. */
export const assetsPlugin = createPlugin("assets", { config: defaultConfig, api: createAssetsApi });
