/**
 * @file The site's one route table, shared by the SSG build, the SPA and every link.
 *
 * Every page has a required `{lang}` segment and is generated once per locale, so all 11 locales
 * are prefixed (`/en/about/`, `/ru/about/`). The bare root `/` is the language page.
 *
 * The table holds what both sides read: each page's pattern (matching, {@link urls}) and its
 * per-locale generation. A page's layout, body and head are build-only: `attachPages`
 * (`src/pages/index.tsx`) records them on these same route objects in the Node composition. The
 * SPA navigates by fetching page HTML (no `dataPlugin`), so it never calls them, and the pages, the
 * string tables and the legal text stay out of the client bundle (`.planning/decisions.md`).
 */
import { createUrls, defineRoutes, route } from "@moku-labs/web/browser";

/**
 * Generate one instance of a page per locale.
 *
 * @param ctx - Generate context of the build.
 * @param ctx.locale - The locale being generated.
 * @returns The single param set of that locale.
 */
const perLocale = (ctx: { locale: string }): { lang: string }[] => [{ lang: ctx.locale }];

/**
 * Every page at its own URL in every locale.
 *
 * @example
 * ```ts
 * createApp({ pluginConfigs: { router: { routes } } });
 * ```
 */
export const routes = defineRoutes({
  root: route("/"),
  home: route("/{lang}/").generate(perLocale),
  about: route("/{lang}/about/").generate(perLocale),
  games: route("/{lang}/games/").generate(perLocale),
  memoryMissing: route("/{lang}/games/memory-missing/").generate(perLocale),
  support: route("/{lang}/support/").generate(perLocale),
  privacy: route("/{lang}/privacy/").generate(perLocale),
  terms: route("/{lang}/terms/").generate(perLocale),
  deleteData: route("/{lang}/delete-data/").generate(perLocale)
});

/**
 * Typed link builder over {@link routes}. No default locale, so every locale stays prefixed.
 *
 * @example
 * ```ts
 * const about = urls.toUrl("about", { lang: "ru" }); // "/ru/about/"
 * ```
 */
export const urls = createUrls(routes);
