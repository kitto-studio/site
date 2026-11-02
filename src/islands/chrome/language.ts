/**
 * @file Language picker: the header's popover menu of the 11 languages and the choice itself.
 *
 * A choice is saved as `kitto-lang` and loads the same page in that language as a real page load
 * (the persistent header and footer are in the old language, so an SPA swap cannot change them).
 */
import { hardNavigate } from "@moku-labs/web/browser";
import type { routes } from "../../routes";
import { normalizePath } from "./current";
import { saveChoice } from "./storage";

/** A route that renders a page in every locale (everything but the root language page). */
type PageRoute = Exclude<keyof typeof routes, "root">;

/** The island's link builder (`ctx.url`, backed by the route table). */
type UrlBuilder = (name: string, params?: Record<string, string>) => string;

/**
 * Every page route. A record, so the compiler fails when a page is added to the route table and
 * not here (the language switch would otherwise drop the reader on the home page).
 */
const PAGE_ROUTES: Readonly<Record<PageRoute, true>> = {
  home: true,
  about: true,
  games: true,
  memoryMissing: true,
  support: true,
  privacy: true,
  terms: true,
  deleteData: true
};

/** The page route names, in table order. */
const PAGE_ROUTE_NAMES = Object.keys(PAGE_ROUTES) as PageRoute[];

/** Where the choice is saved (also read by the root language page). */
const STORAGE_KEY = "kitto-lang";

/** Columns of the popover's language list. */
const COLUMNS = 2;

/**
 * The URL of the page at `pathname` in another locale: the same route, found in the route table.
 * A path no route has (a 404) leads to the new locale's home.
 *
 * @param pathname - The current page path.
 * @param current - The current locale.
 * @param next - The chosen locale.
 * @param url - The route table's link builder.
 * @returns The target URL.
 * @example
 * ```ts
 * languageUrl("/en/games/memory-missing/", "en", "ru", ctx.url); // "/ru/games/memory-missing/"
 * ```
 */
function languageUrl(pathname: string, current: string, next: string, url: UrlBuilder): string {
  const pagePath = normalizePath(pathname);
  const route = PAGE_ROUTE_NAMES.find(name => url(name, { lang: current }) === pagePath);
  return url(route ?? "home", { lang: next });
}

/**
 * The picker's button and menu inside the header.
 *
 * @param root - The header.
 * @returns The toggle button and the menu, when the header has a picker.
 */
function pickerOf(root: Element): { toggle: HTMLElement; menu: HTMLElement } | undefined {
  const toggle = root.querySelector<HTMLElement>("[data-lang-toggle]");
  const menu = root.querySelector<HTMLElement>("[data-lang-menu]");
  return toggle && menu ? { toggle, menu } : undefined;
}

/**
 * Whether the language menu is open.
 *
 * @param root - The header.
 * @returns True while the popover shows.
 */
export function isLanguageMenuOpen(root: Element): boolean {
  const picker = pickerOf(root);
  return picker !== undefined && !picker.menu.hidden;
}

/**
 * Whether an event target lies inside the picker (its button or its menu).
 *
 * @param root - The header.
 * @param target - The event target.
 * @returns True for a target inside the picker.
 */
export function isInsidePicker(root: Element, target: EventTarget | null): boolean {
  const picker = pickerOf(root);
  if (picker === undefined || !(target instanceof Node)) return false;
  return picker.toggle.contains(target) || picker.menu.contains(target);
}

/**
 * Open the language menu and focus the current language.
 *
 * @param root - The header.
 * @returns {void} Nothing; the menu is open, the focus on the current language.
 */
function openLanguageMenu(root: Element): void {
  const picker = pickerOf(root);
  if (picker === undefined) return;
  picker.menu.hidden = false;
  picker.toggle.setAttribute("aria-expanded", "true");
  const current = picker.menu.querySelector<HTMLElement>('[aria-checked="true"]');
  (current ?? picker.menu.querySelector<HTMLElement>("[data-lang]"))?.focus();
}

/**
 * Close the language menu.
 *
 * @param root - The header.
 * @param returnFocus - Move focus back to the picker button (Esc, a choice of the same language).
 * @returns {void} Nothing; the menu is closed.
 */
export function closeLanguageMenu(root: Element, returnFocus: boolean): void {
  const picker = pickerOf(root);
  if (picker === undefined || picker.menu.hidden) return;
  picker.menu.hidden = true;
  picker.toggle.setAttribute("aria-expanded", "false");
  if (returnFocus) picker.toggle.focus();
}

/**
 * Open or close the language menu from its button.
 *
 * @param root - The header.
 * @returns {void} Nothing; the menu is toggled.
 */
export function toggleLanguageMenu(root: Element): void {
  if (isLanguageMenuOpen(root)) closeLanguageMenu(root, false);
  else openLanguageMenu(root);
}

/**
 * Open the closed menu from its button with the up or down arrow.
 *
 * @param root - The header.
 * @param event - The key press on the button.
 * @returns {void} Nothing; an arrow opens the closed menu.
 */
export function onLanguageToggleKey(root: Element, event: KeyboardEvent): void {
  const isArrowKey = event.key === "ArrowDown" || event.key === "ArrowUp";
  if (!isArrowKey || isLanguageMenuOpen(root)) return;
  event.preventDefault();
  openLanguageMenu(root);
}

/**
 * The item a key moves to in the two-column list. Up and down stay in the column and wrap inside
 * it; left and right step through the reading order and wrap; Home and End go to the ends.
 *
 * @param key - The pressed key.
 * @param index - The focused item.
 * @param count - Number of items.
 * @returns The item to focus, or undefined for a key the list does not handle.
 */
function nextItemIndex(key: string, index: number, count: number): number | undefined {
  const column = index % COLUMNS;
  switch (key) {
    case "ArrowDown": {
      return index + COLUMNS < count ? index + COLUMNS : column;
    }
    case "ArrowUp": {
      const lastInColumn = column + COLUMNS * Math.floor((count - 1 - column) / COLUMNS);
      return index - COLUMNS >= 0 ? index - COLUMNS : lastInColumn;
    }
    case "ArrowRight": {
      return (index + 1) % count;
    }
    case "ArrowLeft": {
      return (index - 1 + count) % count;
    }
    case "Home": {
      return 0;
    }
    case "End": {
      return count - 1;
    }
    default: {
      return undefined;
    }
  }
}

/**
 * Keys inside the open menu: arrows, Home and End move focus; Tab closes the menu and lets focus
 * move on.
 *
 * @param root - The header.
 * @param event - The key press inside the menu.
 * @returns {void} Nothing; the focus moves, or Tab closes the menu.
 */
export function onLanguageMenuKey(root: Element, event: KeyboardEvent): void {
  // Guard: a header with a picker; Tab closes the menu and lets the focus move on.
  const picker = pickerOf(root);
  if (picker === undefined) return;
  if (event.key === "Tab") {
    closeLanguageMenu(root, false);
    return;
  }

  // Find the menu's items and the one that has the focus now.
  const items = [...picker.menu.querySelectorAll<HTMLElement>("[data-lang]")];
  const active = document.activeElement;
  const focused = active instanceof HTMLElement ? Math.max(0, items.indexOf(active)) : 0;

  // Move the focus to the item the key points at; other keys do nothing.
  const next = nextItemIndex(event.key, focused, items.length);
  if (next === undefined) return;
  event.preventDefault();
  items[next]?.focus();
}

/**
 * Choose a language from the menu or the phone sheet: save it, then load the same page in it.
 * The language already shown only closes the menu.
 *
 * @param root - The header.
 * @param item - The chosen language button (`data-lang`).
 * @param current - The page's locale (`ctx.locale`).
 * @param url - The route table's link builder (`ctx.url`).
 * @returns {void} Nothing; the choice is saved and the page loads in that language.
 */
export function chooseLanguage(
  root: Element,
  item: Element,
  current: string,
  url: UrlBuilder
): void {
  const next = item instanceof HTMLElement ? item.dataset.lang : undefined;
  if (next === undefined) return;
  saveChoice(STORAGE_KEY, next);
  if (next === current) {
    closeLanguageMenu(root, true);
    return;
  }
  hardNavigate(languageUrl(location.pathname, current, next, url));
}
