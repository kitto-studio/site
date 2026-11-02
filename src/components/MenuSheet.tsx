/**
 * @file Phone menu sheet (design-context §4, C1): a paper sheet that slides down from under the
 * header with the nav words in large Nunito, the 11 languages in a 3-column grid and the big theme
 * switch.
 *
 * Shown below 900 px. Modal while open: the `chrome` island makes the page inert, keeps focus in the
 * header, closes it on Esc, the scrim, a link or a wide screen. The open state is `data-menu-open`
 * on the header, which this sheet's CSS reads.
 */
import type { VNode } from "preact";
import { HTML_LANG, LOCALES, type Locale, NATIVE_NAMES } from "../i18n/languages";
import type { ChromeStrings } from "../i18n/types";
import { DotMark } from "./DotMark";
import { ThemeSwitch } from "./ThemeSwitch";

/** One link of the main navigation, resolved for the page (shared by the header nav and this sheet). */
export type NavItem = {
  /** Route name, a stable key. */
  route: string;
  /** Link target in the page's locale. */
  href: string;
  /** Link label. */
  label: string;
  /** `page` on the linked page, `true` on a page inside its section, otherwise undefined. */
  current: "page" | "true" | undefined;
};

/** MenuSheet props. */
type MenuSheetProps = {
  /** The page's locale, marked in the language grid. */
  locale: Locale;
  /** The main navigation, in display order. */
  nav: readonly NavItem[];
  /** The chrome strings of the page's locale. */
  strings: ChromeStrings;
};

/**
 * Render the phone menu sheet, closed (inert and off screen).
 *
 * @param props - MenuSheet props.
 * @param props.locale - The page's locale.
 * @param props.nav - The main navigation.
 * @param props.strings - The chrome strings.
 * @returns The scrim and the sheet.
 * @example
 * ```tsx
 * <MenuSheet locale="en" nav={nav} strings={t("en").chrome} />
 * ```
 */
export function MenuSheet({ locale, nav, strings }: MenuSheetProps): VNode {
  return (
    <div data-component="menu-sheet">
      <div data-menu-scrim aria-hidden="true" />
      <div id="site-menu" data-menu-sheet inert>
        <div data-sheet-under aria-hidden="true" />
        <div data-sheet-paper>
          <div data-sheet-inner>
            <nav aria-label={strings.navLabel}>
              {nav.map((item, index) => (
                <a
                  key={item.route}
                  href={item.href}
                  data-chrome-link
                  aria-current={item.current}
                  style={`--n:${index}`}
                >
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
            <div data-sheet-group>
              <p id="site-menu-language" data-sheet-label>
                {strings.language.label}
              </p>
              <ul aria-labelledby="site-menu-language" data-lang-grid>
                {LOCALES.map((code, index) => (
                  <li key={code}>
                    <button
                      type="button"
                      data-lang={code}
                      lang={HTML_LANG[code]}
                      aria-current={code === locale ? "true" : undefined}
                      style={`--n:${index}`}
                    >
                      <DotMark />
                      <span>{NATIVE_NAMES[code]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div data-sheet-group>
              <p data-sheet-label aria-hidden="true">
                {strings.theme.label}
              </p>
              <ThemeSwitch strings={strings.theme} variant="plate" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
