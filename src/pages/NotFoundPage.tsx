/**
 * @file The 404 page: the dot, a short heading, one sentence and the way back home, in the page's
 * locale. Rendered inside the site chrome; U10 writes one per locale.
 */
import type { VNode } from "preact";
import { DotMark } from "../components/DotMark";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import { urls } from "../routes";

/** NotFoundPage props. */
type NotFoundPageProps = {
  /** Page locale. */
  locale: Locale;
};

/**
 * Render the 404 page content.
 *
 * @param props - NotFoundPage props.
 * @param props.locale - Page locale; the home link stays in it.
 * @returns The page content for the `[data-page]` region.
 * @example
 * ```tsx
 * <SiteLayout locale="en" page="notFound"><NotFoundPage locale="en" /></SiteLayout>
 * ```
 */
export function NotFoundPage({ locale }: NotFoundPageProps): VNode {
  const strings = t(locale).notFound;
  return (
    <div data-component="not-found" data-container>
      <DotMark />
      <h1>{strings.title}</h1>
      <p data-lead>{strings.text}</p>
      <p>
        <a href={urls.toUrl("home", { lang: locale })} data-link-alone>
          {strings.home}
        </a>
      </p>
    </div>
  );
}
