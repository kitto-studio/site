/**
 * @file Client entry (`build.clientEntry`): the browser composition. Island hydration and
 * same-locale HTML-fetch navigation. `dataPlugin` is not composed, so every navigation fetches the
 * page HTML and syncs `<html lang>`, title, description, canonical, hreflang and Open Graph.
 * Node-only plugins are never imported, so the bundle stays node-free. The route table it matches
 * holds patterns only: the pages, string tables and legal text are attached in `src/app.ts`.
 */
import { createApp } from "@moku-labs/web/browser";
import { HEAD, SITE, SPA } from "./config";
import { I18N_CONFIG } from "./i18n/languages";
import { routes } from "./routes";

const app = createApp({
  config: { mode: "hybrid" },
  pluginConfigs: {
    site: SITE,
    i18n: I18N_CONFIG,
    router: { routes },
    head: HEAD,
    spa: SPA
  }
});

// Errors surfaced, not swallowed.
try {
  await app.start();
} catch (error) {
  console.error("[kitto] SPA boot failed", error); // @log-sink pre-boot, no ctx.log yet
}
