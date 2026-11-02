/**
 * @file `aria-current` of the chrome links after a client navigation. The header and the footer are
 * not re-rendered, so their marks are moved here from the new path.
 */

/** The links whose current state the chrome keeps in step with the page. */
const CHROME_LINK = "a[data-chrome-link]";

/**
 * Give a path a trailing slash, the form every page URL of the route table has.
 *
 * @param path - A URL path.
 * @returns The path ending in `/`.
 * @example
 * ```ts
 * normalizePath("/en/about"); // "/en/about/"
 * ```
 */
export function normalizePath(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

/**
 * The `aria-current` of a link on a page. A link deeper than the locale home also stays current on
 * the pages under it (Games on the game page); the locale home is nobody's section.
 *
 * @param linkPath - The link's path, normalized.
 * @param pagePath - The page's path, normalized.
 * @returns `page` on the linked page, `true` on a page under it, otherwise undefined.
 */
function currentState(linkPath: string, pagePath: string): "page" | "true" | undefined {
  if (linkPath === pagePath) return "page";
  const isSection = linkPath.split("/").filter(Boolean).length > 1;
  return isSection && pagePath.startsWith(linkPath) ? "true" : undefined;
}

/**
 * Move `aria-current` on every chrome link inside `root` to the page at `pathname`.
 *
 * @param root - The header or the footer.
 * @param pathname - The path of the page now shown.
 * @returns {void} Nothing; `aria-current` marks the links of that page.
 */
export function syncCurrentLinks(root: Element, pathname: string): void {
  const pagePath = normalizePath(pathname);
  for (const link of root.querySelectorAll(CHROME_LINK)) {
    const state = currentState(normalizePath(link.getAttribute("href") ?? ""), pagePath);
    if (state === undefined) link.removeAttribute("aria-current");
    else link.setAttribute("aria-current", state);
  }
}
