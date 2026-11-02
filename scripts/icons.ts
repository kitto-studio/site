/**
 * @file Icon pipeline (`bun run icons`): thin passthrough to the assets plugin. Draws
 * `public/apple-touch-icon.png` and `public/icon-512.png` from `public/favicon.svg`.
 */
import { app } from "../src/app";

await app.assets.icons();
