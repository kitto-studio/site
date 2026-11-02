/**
 * @file OG cards (`bun run og`): thin passthrough to the assets plugin. Draws the cards in
 * `public/og/**` whose inputs changed since `assets/og-manifest.json` (see `src/plugins/assets`).
 */
import { app } from "../src/app";

await app.assets.og();
