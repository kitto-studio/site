/**
 * @file SiteLayout: the persistent chrome around every page.
 *
 * Applied by `.layout()` at build time only. On client navigation the SPA swaps the `[data-page]`
 * region (`spa.swapSelector`); the skip link, the header and the footer stay, and their islands
 * (`chrome`, `logo-jump`) keep them in step with the new page.
 */
import type { ComponentChildren, VNode } from "preact";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { t } from "../i18n";
import { asLocale, type Locale } from "../i18n/languages";
import type { PageId } from "../i18n/types";

/** Site layout props. */
type SiteLayoutProps = {
  /** Page locale. */
  locale: Locale;
  /** The rendered page, marks the current link. */
  page: PageId;
  /** The page content, rendered inside the swap region. */
  children: ComponentChildren;
};

/**
 * Frame a page in the site chrome.
 *
 * @param props - Site layout props.
 * @param props.locale - Page locale; every link stays in it.
 * @param props.page - The rendered page.
 * @param props.children - The page content.
 * @returns Skip link, header, the `main > [data-page]` swap region and footer.
 * @example
 * ```tsx
 * <SiteLayout locale="en" page="about"><AboutPage locale="en" /></SiteLayout>
 * ```
 */
export function SiteLayout({ locale, page, children }: SiteLayoutProps): VNode {
  return (
    <div data-layout="site">
      <a href="#main" data-skip-link>
        {t(locale).chrome.skip}
      </a>
      <Header locale={locale} page={page} />
      <main id="main">
        <div data-page>{children}</div>
      </main>
      <Footer locale={locale} page={page} />
    </div>
  );
}

/** The part of a route context the layout reads. */
type LayoutContext = {
  /** Active locale of the rendered page. */
  locale: string;
};

/**
 * Build the `.layout()` handler of one page.
 *
 * @param page - The page the layout frames.
 * @returns A route layout: the rendered page inside {@link SiteLayout}, in the route's locale.
 * @example
 * ```tsx
 * route("/{lang}/about/").layout(siteLayout("about"));
 * ```
 */
export function siteLayout(
  page: PageId
): (ctx: LayoutContext, children: ComponentChildren) => VNode {
  return (ctx, children) => (
    <SiteLayout locale={asLocale(ctx.locale)} page={page}>
      {children}
    </SiteLayout>
  );
}
