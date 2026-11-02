/**
 * @file Language picker of the header (design-context §4, D1): a globe and the language code on a
 * paper tab button, and a paper popover with the 11 languages in two columns, each in its own
 * script and `lang`, the current one marked with the dot.
 *
 * A menu button: the `chrome` island opens it, moves focus with the arrows, Home and End, closes
 * it on Esc, Tab or a click outside, and turns a choice into a page load of the same page in that
 * language.
 */
import type { VNode } from "preact";
import { HTML_LANG, LOCALES, type Locale, NATIVE_NAMES } from "../i18n/languages";
import { DotMark } from "./DotMark";

/** LangPicker props. */
type LangPickerProps = {
  /** The page's locale: shown on the button and marked in the list. */
  locale: Locale;
  /** Accessible name of the button and the list (`chrome.language.label`). */
  label: string;
};

/**
 * Draw the globe of the picker button.
 *
 * @returns The globe SVG, hidden from assistive technology.
 */
function GlobeIcon(): VNode {
  return (
    <svg viewBox="0 0 24 24" data-globe aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <circle cx="12" cy="12" r="8.6" />
        <path d="M3.6 12h16.8M12 3.4c2.6 2.4 3.8 5.3 3.8 8.6s-1.2 6.2-3.8 8.6c-2.6-2.4-3.8-5.3-3.8-8.6s1.2-6.2 3.8-8.6z" />
      </g>
    </svg>
  );
}

/**
 * Draw the chevron of the picker button; it turns over while the list is open.
 *
 * @returns The chevron SVG, hidden from assistive technology.
 */
function ChevronIcon(): VNode {
  return (
    <svg viewBox="0 0 10 10" data-chevron aria-hidden="true">
      <path
        d="M1.5 3.5 5 7l3.5-3.5"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

/**
 * Render the language picker. The list starts hidden.
 *
 * @param props - LangPicker props.
 * @param props.locale - The page's locale.
 * @param props.label - Accessible name of the button and the list.
 * @returns The picker button and its popover menu.
 * @example
 * ```tsx
 * <LangPicker locale="ru" label={t("ru").chrome.language.label} />
 * ```
 */
export function LangPicker({ locale, label }: LangPickerProps): VNode {
  return (
    <div data-component="lang-picker">
      <button
        type="button"
        data-lang-toggle
        aria-haspopup="menu"
        aria-expanded="false"
        aria-controls="lang-menu"
      >
        <GlobeIcon />
        {/* The visible code is part of the name (WCAG 2.5.3 Label in Name): «Language EN». */}
        <span data-visually-hidden>{`${label} `}</span>
        <span>{locale.toUpperCase()}</span>
        <ChevronIcon />
      </button>
      <div id="lang-menu" role="menu" aria-label={label} data-lang-menu hidden>
        <div data-menu-face>
          <p data-menu-label aria-hidden="true">
            {label}
          </p>
          <div data-lang-grid>
            {LOCALES.map((code, index) => (
              <button
                key={code}
                type="button"
                role="menuitemradio"
                aria-checked={code === locale ? "true" : "false"}
                tabIndex={-1}
                data-lang={code}
                lang={HTML_LANG[code]}
                style={`--n:${index}`}
              >
                <DotMark />
                <span>{NATIVE_NAMES[code]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
