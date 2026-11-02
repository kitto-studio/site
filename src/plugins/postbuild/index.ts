/**
 * Postbuild plugin — Standard tier. Node only, composed into `src/app.ts` alone.
 *
 * The site's post-build steps, run after every build on the framework's `build:complete` event:
 * `sitemap.xml` with `hreflang` alternates and `robots.txt`, `_redirects` for bare paths, and the
 * root and per-locale `404.html`. The OG cards are drawn ahead by `bun run og` (`app.assets.og()`)
 * and committed in `public/og`. `app.postbuild.run(outDir)` runs the steps on demand.
 * Emits no events.
 *
 * @see README.md
 */
import { buildPlugin, createPlugin } from "@moku-labs/web";
import { createPostbuildApi, handleBuildComplete } from "./api";
import { createPostbuildState } from "./state";
import type { Config } from "./types";

export { pagePatterns } from "./pages";

/** Default config: the build's output directory and page shell; no localized pages. */
const defaultConfig: Config = { outDir: "dist", template: "src/index.html", pages: [] };

/**
 * Post-build steps plugin, exposed as `app.postbuild`. Runs after each build on `build:complete`.
 *
 * @example
 * ```ts
 * createApp({ plugins: [buildPlugin, postbuildPlugin], pluginConfigs: { postbuild: { pages: pagePatterns(routes) } } });
 * ```
 */
export const postbuildPlugin = createPlugin("postbuild", {
  // `build` declares `build:complete`; the edge types the hook below, nothing is required from it.
  depends: [buildPlugin],
  config: defaultConfig,
  createState: createPostbuildState,
  api: createPostbuildApi,
  hooks: ctx => ({
    "build:complete": ({ outDir }) => handleBuildComplete(ctx, outDir)
  })
});
