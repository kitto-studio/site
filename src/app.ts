/**
 * @file SSG composition (Node side): `@moku-labs/web`'s isomorphic defaults plus the Node-only
 * build, deploy and cli plugins and the site's own `postbuild` and `assets` plugins. Driven by the
 * thin `scripts/*.ts` entries via `app.cli.*` and `app.assets.*`. The browser entry
 * (`src/spa.tsx`) composes none of them; both share the head and SPA options of `src/config.ts`.
 */
import {
  buildPlugin,
  cliPlugin,
  createApp,
  deployPlugin,
  dotenv,
  processEnv
} from "@moku-labs/web";
import { HEAD, SITE, SPA } from "./config";
import { I18N_CONFIG } from "./i18n/languages";
import { notFoundBody } from "./lib/not-found";
import { attachPages } from "./pages";
import { assetsPlugin } from "./plugins/assets";
import { pagePatterns, postbuildPlugin } from "./plugins/postbuild";
import { routes } from "./routes";

/** The page shell: the build renders every page into it, the postbuild 404 pages too. */
const TEMPLATE = "src/index.html";

/**
 * The site's Node SSG app.
 *
 * @example
 * ```ts
 * import { app } from "./app";
 * await app.cli.build();
 * ```
 */
export const app = createApp({
  plugins: [buildPlugin, deployPlugin, cliPlugin, postbuildPlugin, assetsPlugin],
  config: { mode: "hybrid" },
  pluginConfigs: {
    site: SITE,
    i18n: I18N_CONFIG,
    // The SPA's table plus each page's layout, body and head, which only the build runs.
    router: { routes: attachPages(routes) },
    head: HEAD,
    build: {
      outDir: "dist",
      publicDir: "public",
      template: TEMPLATE,
      clientEntry: "src/spa.tsx",
      // Replaced by the site's own steps (postbuild plugin, U10): hreflang sitemap, per-locale 404s.
      sitemap: false,
      feeds: false,
      images: false,
      localeRedirects: false,
      notFound: { body: notFoundBody("en") }
    },
    spa: SPA,
    postbuild: { template: TEMPLATE, pages: pagePatterns(routes) },
    deploy: { target: "cloudflare-pages", outDir: "dist", productionBranch: "main", ci: true },
    cli: { outDir: "dist", port: 4173 },
    // web's Node defaults register no env provider, so the deploy plugin's
    // CLOUDFLARE_API_TOKEN read needs these: process env first (CI secrets), then a local .env.
    env: { providers: [processEnv(), dotenv(".env")] }
  }
});
