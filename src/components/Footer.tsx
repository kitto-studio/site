/**
 * @file Site footer (design-context §6 B2): the small wordmark and the copyright on the left, the
 * links every store page needs on the right (Privacy Policy, Terms of Use, Delete your data,
 * Support), the current page marked with the dot.
 *
 * Outside the swap region, so the `chrome` island (on this footer) moves the current mark after
 * client navigation.
 */
import type { VNode } from "preact";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import type { PageId } from "../i18n/types";
import { urls } from "../routes";
import { DotMark } from "./DotMark";
import { Logo } from "./Logo";

/** Footer props. */
type FooterProps = {
  /** The page's locale; every link stays in it. */
  locale: Locale;
  /** The rendered page, marks the current link. */
  page: PageId;
};

/** Routes linked from the footer, in display order; each is also its label key in `chrome.footer`. */
const FOOTER_ROUTES = ["privacy", "terms", "deleteData", "support"] as const;

/**
 * Render the site footer.
 *
 * @param props - Footer props.
 * @param props.locale - The page's locale.
 * @param props.page - The rendered page.
 * @returns The footer row: mark and copyright, and the legal and support links.
 * @example
 * ```tsx
 * <Footer locale="en" page="privacy" />
 * ```
 */
export function Footer({ locale, page }: FooterProps): VNode {
  const { footer } = t(locale).chrome;
  return (
    <footer data-component="footer" data-island="chrome">
      <div data-container data-row>
        <div data-mark>
          <span data-mini>
            <Logo />
          </span>
          <span>{footer.copyright}</span>
        </div>
        <nav aria-label={footer.label}>
          <ul>
            {FOOTER_ROUTES.map(route => (
              <li key={route}>
                <a
                  href={urls.toUrl(route, { lang: locale })}
                  data-chrome-link
                  aria-current={route === page ? "page" : undefined}
                >
                  <DotMark />
                  <span>{footer[route]}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
