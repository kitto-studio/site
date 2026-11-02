/**
 * @file The build side of the route table: every page's layout, body and head.
 *
 * {@link attachPages} records them on the routes of `src/routes.tsx` with the route builder, so the
 * build renders from the same table the SPA matches. Only the Node composition (`src/app.ts`)
 * imports this file: the SPA swaps fetched page HTML and never runs these handlers, so the pages,
 * the string tables and the legal text stay out of the client bundle.
 */
import { SITE } from "../config";
import { asLocale } from "../i18n/languages";
import { siteLayout } from "../layouts/SiteLayout";
import { pageHead } from "../lib/head";
import type { routes as siteRoutes } from "../routes";
import { AboutPage } from "./AboutPage";
import { DeleteDataPage } from "./DeleteDataPage";
import { GamesPage } from "./GamesPage";
import { HomePage } from "./HomePage";
import { MemoryMissingPage } from "./MemoryMissingPage";
import { PrivacyPage } from "./PrivacyPage";
import { RootPage } from "./RootPage";
import { SupportPage } from "./SupportPage";
import { TermsPage } from "./TermsPage";

/** The site's route table. */
type SiteRoutes = typeof siteRoutes;

/**
 * Give every route of the table its layout, body and head. The handlers go onto the same route
 * objects, so calling it again only sets them again.
 *
 * @param routes - The site's route table.
 * @returns The same table, ready for the build.
 * @example
 * ```ts
 * createApp({ pluginConfigs: { router: { routes: attachPages(routes) } } });
 * ```
 */
export function attachPages(routes: SiteRoutes): SiteRoutes {
  routes.root
    .render(() => <RootPage />)
    .head(ctx => ({ ...pageHead("root")(ctx), canonical: `${SITE.url}/en/` }));
  routes.home
    .layout(siteLayout("home"))
    .render(ctx => <HomePage locale={asLocale(ctx.locale)} />)
    .head(pageHead("home"));
  routes.about
    .layout(siteLayout("about"))
    .render(ctx => <AboutPage locale={asLocale(ctx.locale)} />)
    .head(pageHead("about"));
  routes.games
    .layout(siteLayout("games"))
    .render(ctx => <GamesPage locale={asLocale(ctx.locale)} />)
    .head(pageHead("games"));
  routes.memoryMissing
    .layout(siteLayout("memoryMissing"))
    .render(ctx => <MemoryMissingPage locale={asLocale(ctx.locale)} />)
    .head(pageHead("memoryMissing"));
  routes.support
    .layout(siteLayout("support"))
    .render(ctx => <SupportPage locale={asLocale(ctx.locale)} />)
    .head(pageHead("support"));
  routes.privacy
    .layout(siteLayout("privacy"))
    .render(ctx => <PrivacyPage locale={asLocale(ctx.locale)} />)
    .head(pageHead("privacy"));
  routes.terms
    .layout(siteLayout("terms"))
    .render(ctx => <TermsPage locale={asLocale(ctx.locale)} />)
    .head(pageHead("terms"));
  routes.deleteData
    .layout(siteLayout("deleteData"))
    .render(ctx => <DeleteDataPage locale={asLocale(ctx.locale)} />)
    .head(pageHead("deleteData"));
  return routes;
}
