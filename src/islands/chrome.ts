/**
 * @file The `chrome` island: behaviour of the header and the footer.
 *
 * Mounted on both (`data-island="chrome"`), outside the swap region, so each instance persists
 * across client navigations. On the header it runs the language menu, the theme switches and the
 * phone menu; on both it moves `aria-current` to the new page after a navigation.
 */
import { createIsland, type Spa } from "@moku-labs/web/browser";
import { syncCurrentLinks } from "./chrome/current";
import {
  chooseLanguage,
  closeLanguageMenu,
  isInsidePicker,
  isLanguageMenuOpen,
  onLanguageMenuKey,
  onLanguageToggleKey,
  toggleLanguageMenu
} from "./chrome/language";
import {
  closeMenu,
  closeMenuForWideScreen,
  isMenuOpen,
  toggleMenu,
  trapFocus
} from "./chrome/menu";
import { applyTheme, chooseTheme, initialTheme } from "./chrome/theme";

/** From this width the header shows its full nav, so an open phone menu closes (Header.css). */
const WIDE_HEADER = "(min-width: 901px)";

/** Scroll distance after which the header plate casts its shadow. */
const SCROLLED_PX = 4;

/**
 * Drop the from-below mark: Back and Forward, and links followed from the top, keep the crossfade
 * from the old page.
 *
 * @returns {void} Nothing; `data-nav-from-below` is gone from `<html>`.
 */
function forgetNavFromBelow(): void {
  delete document.documentElement.dataset.navFromBelow;
}

/**
 * Whether a click landed on a link or inside one.
 *
 * @param target - The click target.
 * @returns True for a click on an `a[href]`.
 */
function isLinkClick(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest("a[href]") !== null;
}

/** An event handler that works on the island root as an HTML element. */
type RootHandler = (root: HTMLElement, event: Event, target: Element) => void;

/** A key handler that works on the island root as an HTML element. */
type KeyHandler = (root: HTMLElement, event: KeyboardEvent, target: Element) => void;

/**
 * Adapt a root handler to the island's delegated event map.
 *
 * @param handler - The handler, given the root as an HTML element.
 * @returns A delegated event handler.
 */
function onRoot(handler: RootHandler): Spa.IslandEventHandler<object> {
  return (ctx, event, target) => {
    if (ctx.el instanceof HTMLElement) handler(ctx.el, event, target);
  };
}

/**
 * Adapt a key handler to the island's delegated event map.
 *
 * @param handler - The handler, given the root and the key press.
 * @returns A delegated event handler that ignores anything but keyboard events.
 */
function onKey(handler: KeyHandler): Spa.IslandEventHandler<object> {
  return onRoot((root, event, target) => {
    if (event instanceof KeyboardEvent) handler(root, event, target);
  });
}

/**
 * Esc closes what is open: the phone menu first, else the language menu; focus returns to the
 * button that opened it.
 *
 * @param root - The header.
 * @param event - The Esc key press.
 * @returns {void} Nothing; the open menu closes.
 */
function closeOnEscape(root: HTMLElement, event: KeyboardEvent): void {
  if (isMenuOpen(root)) {
    event.preventDefault();
    closeMenu(root, true);
  } else if (isLanguageMenuOpen(root)) {
    event.preventDefault();
    closeLanguageMenu(root, true);
  }
}

/**
 * Keys anywhere on the page: Esc closes the open menu, Tab stays inside the open phone menu.
 *
 * @param root - The header.
 * @param event - The key press.
 * @returns {void} Nothing; Esc or Tab is handled.
 */
function onDocumentKey(root: HTMLElement, event: KeyboardEvent): void {
  if (event.key === "Escape") closeOnEscape(root, event);
  else if (event.key === "Tab" && isMenuOpen(root)) trapFocus(root, event);
}

/**
 * Listen beyond the header for as long as it is mounted: keys and outside clicks on the document,
 * the width at which the phone menu gives way to the full header, and the scroll shadow.
 *
 * @param ctx - The island context, for cleanup.
 * @param root - The header.
 * @returns {void} Nothing; the listeners run until the island is torn down.
 */
function watchHeader(ctx: Spa.IslandContext<object>, root: HTMLElement): void {
  // Close the menus that no longer fit the moment, and shade the header once the page scrolls.
  const wide = matchMedia(WIDE_HEADER);
  const onKeydown = (event: KeyboardEvent): void => onDocumentKey(root, event);
  const onPointerdown = (event: PointerEvent): void => {
    if (isLanguageMenuOpen(root) && !isInsidePicker(root, event.target)) {
      closeLanguageMenu(root, false);
    }
  };
  const onWide = (): void => {
    if (wide.matches) closeMenuForWideScreen(root);
  };
  const onScroll = (): void => {
    if (scrollY > SCROLLED_PX) root.dataset.scrolled = "";
    else delete root.dataset.scrolled;
  };
  // The kernel jumps to the top before the crossfade takes its picture of the old page, so a link
  // followed from lower down would fade out of the top of the old page. Mark that case for the CSS.
  const onLinkClick = (event: MouseEvent): void => {
    if (!isLinkClick(event.target)) return;
    if (scrollY > 0) document.documentElement.dataset.navFromBelow = "";
    else forgetNavFromBelow();
  };

  // Listen until the island is torn down; the shadow is set for the current scroll at once.
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("pointerdown", onPointerdown);
  wide.addEventListener("change", onWide);
  addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("click", onLinkClick, { capture: true });
  addEventListener("popstate", forgetNavFromBelow);
  onScroll();
  ctx.cleanup(() => {
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("pointerdown", onPointerdown);
    wide.removeEventListener("change", onWide);
    removeEventListener("scroll", onScroll);
    document.removeEventListener("click", onLinkClick, { capture: true });
    removeEventListener("popstate", forgetNavFromBelow);
  });
}

/** Header and footer behaviour: language menu, theme switch, phone menu, `aria-current` after navigation. */
export const chromeIsland = createIsland("chrome", {
  events: {
    "click [data-lang-toggle]": onRoot(root => toggleLanguageMenu(root)),
    "keydown [data-lang-toggle]": onKey((root, event) => onLanguageToggleKey(root, event)),
    "keydown [data-lang-menu]": onKey((root, event) => onLanguageMenuKey(root, event)),
    "click [data-lang]": (ctx, _event, item) => chooseLanguage(ctx.el, item, ctx.locale, ctx.url),
    "change [data-theme-choice]": onRoot((root, _event, radio) => chooseTheme(root, radio)),
    "click [data-menu-toggle]": onRoot(root => toggleMenu(root)),
    "click [data-menu-scrim]": onRoot(root => closeMenu(root, true)),
    "click [data-menu-sheet] a": onRoot(root => closeMenu(root, false))
  },
  /**
   * On the header: show the saved or previewed theme and start listening beyond the header.
   *
   * @param ctx - The island context.
   * @returns {void} Nothing; the header shows its theme and listens until it is torn down.
   */
  onMount(ctx) {
    const root = ctx.el;
    if (!(root instanceof HTMLElement) || root.querySelector("[data-menu-toggle]") === null) return;
    applyTheme(root, initialTheme(location.search));
    watchHeader(ctx, root);
  },
  /**
   * Close any open menu before the page is swapped.
   *
   * @param ctx - The island context.
   * @param ctx.el - The header or the footer.
   * @returns {void} Nothing; both menus are closed.
   */
  onNavStart({ el }) {
    if (!(el instanceof HTMLElement)) return;
    closeLanguageMenu(el, false);
    closeMenu(el, false);
  },
  /**
   * Move the current marks to the page now shown.
   *
   * @param ctx - The island context.
   * @param ctx.el - The header or the footer.
   * @returns {void} Nothing; `aria-current` marks the page now shown.
   */
  onNavEnd({ el }) {
    syncCurrentLinks(el, location.pathname);
  }
});
