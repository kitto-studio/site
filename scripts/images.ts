/**
 * @file Art pipeline (`bun run images`): thin passthrough to the assets plugin. The Astra masters in
 * `assets/site-art/**` become the webp files in `public/media/**` (see `src/plugins/assets`).
 */
import { app } from "../src/app";

await app.assets.images();
