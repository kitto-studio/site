/**
 * @file Breadcrumb (design-context §4, §6 A4 «‹ Games»): the way back from a page to its parent,
 * drawn as the orange outline the site uses for the current item (`inset 0 0 0 2px` dot, radius
 * 12), with a small chevron before the label. It sits 12 px above the page title.
 */
import type { VNode } from "preact";

/** Breadcrumb props. */
export type BreadcrumbProps = {
  /** URL of the parent page, built from the route table. */
  href: string;
  /** The parent page's name. */
  label: string;
  /** Accessible name of the navigation landmark. */
  navLabel: string;
};

/**
 * Render the breadcrumb back to the parent page.
 *
 * @param props - Breadcrumb props.
 * @param props.href - Parent page URL.
 * @param props.label - Parent page name.
 * @param props.navLabel - Name of the navigation landmark.
 * @returns A navigation landmark with one link.
 * @example
 * ```tsx
 * <Breadcrumb
 *   href={urls.toUrl("games", { lang: locale })}
 *   label={strings.game.breadcrumb.games}
 *   navLabel={strings.game.breadcrumb.label}
 * />
 * ```
 */
export function Breadcrumb({ href, label, navLabel }: BreadcrumbProps): VNode {
  return (
    <nav data-component="breadcrumb" aria-label={navLabel}>
      <a href={href}>{label}</a>
    </nav>
  );
}
