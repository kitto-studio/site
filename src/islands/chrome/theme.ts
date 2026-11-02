/**
 * @file Theme switch: light, system or dark. Light and dark set `data-theme` on `<html>`; system
 * removes it, so the colours follow `prefers-color-scheme` live through CSS. A choice is saved as
 * `kitto-theme`; `?theme=` previews a theme without saving it.
 */
import { readChoice, saveChoice } from "./storage";

/** One theme choice. */
type Theme = "light" | "system" | "dark";

/** Every choice, in the order of the switch. */
const THEMES: readonly Theme[] = ["light", "system", "dark"];

/** Where the choice is saved (also read by the no-flash script in `src/index.html`). */
const STORAGE_KEY = "kitto-theme";

/** The radio inputs of every theme switch. */
const RADIO = "input[data-theme-choice]";

/**
 * Narrow a string to a theme.
 *
 * @param value - A query, storage or attribute value.
 * @returns The theme it names, or undefined.
 */
function asTheme(value: string | null | undefined): Theme | undefined {
  return THEMES.find(theme => theme === value);
}

/**
 * The theme to show on load: a `?theme=` preview first, then the saved choice, then system.
 *
 * @param search - The page URL's query string.
 * @returns The theme to apply.
 * @example
 * ```ts
 * initialTheme("?theme=dark"); // "dark", whatever is saved
 * ```
 */
export function initialTheme(search: string): Theme {
  const preview = asTheme(new URLSearchParams(search).get("theme"));
  return preview ?? asTheme(readChoice(STORAGE_KEY)) ?? "system";
}

/**
 * Show a theme: on `<html>` and as the checked stop of every switch inside `root`.
 *
 * @param root - The header.
 * @param theme - The theme to show.
 * @returns {void} Nothing; `<html>` and every switch show the theme.
 */
export function applyTheme(root: Element, theme: Theme): void {
  const html = document.documentElement;
  if (theme === "system") delete html.dataset.theme;
  else html.dataset.theme = theme;
  for (const radio of root.querySelectorAll<HTMLInputElement>(RADIO)) {
    radio.checked = radio.value === theme;
  }
}

/**
 * Choose the theme of the stop the reader checked (click, tap or arrow key): show it in both
 * switches and save it.
 *
 * @param root - The header.
 * @param radio - The radio input that changed.
 * @returns {void} Nothing; the theme is shown and saved.
 */
export function chooseTheme(root: Element, radio: Element): void {
  const theme = radio instanceof HTMLInputElement ? asTheme(radio.value) : undefined;
  if (theme === undefined) return;
  applyTheme(root, theme);
  saveChoice(STORAGE_KEY, theme);
}
