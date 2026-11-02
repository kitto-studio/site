/**
 * @file Site header (design-context §6 B1): the logo (with its Jump), the nav Games / About /
 * Support with the orange outline on the current page, the language picker and the theme disc, on
 * a paper plate with a hairline. Below 900 px the nav and tools give way to the Menu button and the
 * phone menu sheet.
 *
 * Rendered at build time by the layout and never re-rendered: it lives outside the swap region, so
 * the `chrome` island (on this header) keeps `aria-current` right after client navigation and runs
 * the menus, and the `logo-jump` island (on the logo link) plays the Jump.
 */
import type { VNode } from "preact";
import { t } from "../i18n";
import type { Locale } from "../i18n/languages";
import type { PageId } from "../i18n/types";
import { urls } from "../routes";
import { LangPicker } from "./LangPicker";
import { Logo } from "./Logo";
import { MenuSheet, type NavItem } from "./MenuSheet";
import { ThemeSwitch } from "./ThemeSwitch";

/** Header props. */
type HeaderProps = {
  /** The page's locale; every link stays in it. */
  locale: Locale;
  /** The rendered page, marks the current link. */
  page: PageId;
};

/** Routes of the main navigation. */
type NavRoute = "games" | "about" | "support";

/** One nav link: its route, and the pages inside its section (current, but not the linked page). */
type NavLink = {
  /** Route name, also the key of its label in `chrome.nav`. */
  route: NavRoute;
  /** Pages under this link's section. */
  section: readonly PageId[];
};

/** The main navigation, in display order. The game page belongs to Games. */
const NAV_LINKS: readonly NavLink[] = [
  { route: "games", section: ["memoryMissing"] },
  { route: "about", section: [] },
  { route: "support", section: [] }
];

/**
 * The `aria-current` of a nav link on a page.
 *
 * @param link - The nav link.
 * @param page - The rendered page.
 * @returns `page` on the linked page, `true` inside its section, otherwise undefined.
 */
function navCurrent(link: NavLink, page: PageId): NavItem["current"] {
  if (link.route === page) return "page";
  return link.section.includes(page) ? "true" : undefined;
}

/**
 * Render the site header.
 *
 * @param props - Header props.
 * @param props.locale - The page's locale.
 * @param props.page - The rendered page.
 * @returns The sticky header with its bar, menus and phone sheet.
 * @example
 * ```tsx
 * <Header locale="en" page="about" />
 * ```
 */
export function Header({ locale, page }: HeaderProps): VNode {
  const { chrome } = t(locale);
  const nav: NavItem[] = NAV_LINKS.map(link => ({
    route: link.route,
    href: urls.toUrl(link.route, { lang: locale }),
    label: chrome.nav[link.route],
    current: navCurrent(link, page)
  }));

  return (
    <header data-component="header" data-island="chrome">
      <div data-bar>
        <div data-container data-row>
          <a
            href={urls.toUrl("home", { lang: locale })}
            data-brand
            data-island="logo-jump"
            data-chrome-link
            aria-label={chrome.homeLabel}
            aria-current={page === "home" ? "page" : undefined}
          >
            <Logo />
          </a>
          <nav aria-label={chrome.navLabel} data-nav>
            {nav.map(item => (
              <a key={item.route} href={item.href} data-chrome-link aria-current={item.current}>
                {item.label}
              </a>
            ))}
          </nav>
          <div data-tools>
            <LangPicker locale={locale} label={chrome.language.label} />
            <ThemeSwitch strings={chrome.theme} variant="disc" />
          </div>
          <button type="button" data-menu-toggle aria-expanded="false" aria-controls="site-menu">
            <span data-burger aria-hidden="true">
              <span />
              <span />
            </span>
            <span data-when="closed">{chrome.menu.open}</span>
            <span data-when="open">{chrome.menu.close}</span>
          </button>
        </div>
      </div>
      <MenuSheet locale={locale} nav={nav} strings={chrome} />
    </header>
  );
}
