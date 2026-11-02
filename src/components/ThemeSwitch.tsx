/**
 * @file Theme switch: a radio group of light, system and dark (design-context §4, D2).
 *
 * Two looks of one control. `disc` (header): a paper disc rolls along a slot cut into the plate,
 * with a small label under the stop on hover or focus. `plate` (phone menu): a raised paper plate
 * slides under the chosen stop, each stop shows its word. The stops are native radio inputs, so
 * the arrow keys and the tab order are the browser's. The `chrome` island applies a choice; the
 * knob's position comes from `<html data-theme>` in CSS, so it is right from the first paint.
 */
import type { VNode } from "preact";
import type { ChromeStrings } from "../i18n/types";

/** The three choices, left to right: sun, system, moon. */
const THEMES = ["light", "system", "dark"] as const;

/** One theme choice. */
type Theme = (typeof THEMES)[number];

/** ThemeSwitch props. */
type ThemeSwitchProps = {
  /** The switch's words: group name and one label per choice. */
  strings: ChromeStrings["theme"];
  /** `disc` in the header, `plate` in the phone menu. */
  variant: "disc" | "plate";
};

/** ThemeIcon props. */
type ThemeIconProps = {
  /** The choice the icon stands for. */
  theme: Theme;
};

/**
 * Draw the icon of one choice: a sun, a half-filled circle (system) or a moon.
 *
 * @param props - ThemeIcon props.
 * @param props.theme - The choice.
 * @returns The icon SVG, hidden from assistive technology.
 */
function ThemeIcon({ theme }: ThemeIconProps): VNode {
  if (theme === "light") {
    return (
      <svg viewBox="0 0 24 24" data-icon="light" aria-hidden="true">
        <circle cx="12" cy="12" r="4.4" fill="currentColor" />
        <path
          d="M12 2.6v2.3M12 19.1v2.3M2.6 12h2.3M19.1 12h2.3M5.4 5.4l1.6 1.6M17 17l1.6 1.6M5.4 18.6 7 17M17 7l1.6-1.6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    );
  }
  if (theme === "system") {
    return (
      <svg viewBox="0 0 24 24" data-icon="system" aria-hidden="true">
        <circle cx="12" cy="12" r="7.8" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="M12 4.2a7.8 7.8 0 0 0 0 15.6z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" data-icon="dark" aria-hidden="true">
      <path d="M19.6 14.7A8 8 0 0 1 9.3 4.4a8 8 0 1 0 10.3 10.3z" fill="currentColor" />
    </svg>
  );
}

/**
 * Render the theme switch. System is checked in the markup; the island checks the saved or
 * previewed choice on mount.
 *
 * @param props - ThemeSwitch props.
 * @param props.strings - Group name and choice labels.
 * @param props.variant - `disc` (header) or `plate` (phone menu).
 * @returns A radio group of three choices.
 * @example
 * ```tsx
 * <ThemeSwitch strings={t(locale).chrome.theme} variant="disc" />
 * ```
 */
export function ThemeSwitch({ strings, variant }: ThemeSwitchProps): VNode {
  const isDisc = variant === "disc";
  return (
    <div
      data-component="theme-switch"
      data-variant={variant}
      role="radiogroup"
      aria-label={strings.label}
    >
      <span data-knob aria-hidden="true">
        {isDisc && THEMES.map(theme => <ThemeIcon key={theme} theme={theme} />)}
      </span>
      {THEMES.map(theme => (
        <label key={theme} data-theme-stop={theme}>
          <input
            type="radio"
            name={`theme-${variant}`}
            value={theme}
            data-theme-choice={theme}
            checked={theme === "system"}
          />
          <ThemeIcon theme={theme} />
          <span data-tip={isDisc ? "" : undefined}>{strings[theme]}</span>
        </label>
      ))}
    </div>
  );
}
