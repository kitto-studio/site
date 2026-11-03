// @vitest-environment happy-dom
import { hardNavigate } from "@moku-labs/web/browser";
import { type IslandHandle, mountIsland } from "@moku-labs/web/testing";
import type { VNode } from "preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Footer } from "../../../src/components/Footer";
import { Header } from "../../../src/components/Header";
import type { PageId } from "../../../src/i18n/types";
import { chromeIsland } from "../../../src/islands/chrome";
import { urls } from "../../../src/routes";

vi.mock("@moku-labs/web/browser", async importOriginal => ({
  ...(await importOriginal<typeof import("@moku-labs/web/browser")>()),
  hardNavigate: vi.fn()
}));

/** A route name of the site's route table. */
type RouteName = Parameters<typeof urls.toUrl>[0];

/** The island's link builder, backed by the real route table (what `ctx.url` does in the app). */
const url = (name: string, params?: Record<string, string>): string =>
  urls.toUrl(name as RouteName, params);

let handle: IslandHandle | undefined;

/** The inner markup of a server-rendered chrome region: what the island's host enhances. */
function innerHtml(vnode: VNode): string {
  const template = document.createElement("template");
  template.innerHTML = renderToString(vnode);
  return template.content.firstElementChild?.innerHTML ?? "";
}

/** Mount the chrome island on the header of `page`, served at `path`. */
function mountHeader(page: PageId, path: string): IslandHandle {
  history.replaceState({}, "", path);
  handle = mountIsland(chromeIsland, {
    html: innerHtml(<Header locale="en" page={page} />),
    persistent: true,
    locale: "en",
    url
  });
  return handle;
}

/** Mount the chrome island on the footer of `page`, served at `path`. */
function mountFooter(page: PageId, path: string): IslandHandle {
  history.replaceState({}, "", path);
  handle = mountIsland(chromeIsland, {
    html: innerHtml(<Footer locale="en" page={page} />),
    persistent: true,
    locale: "en",
    url
  });
  return handle;
}

/** The element matching `selector` inside `root`; fails the test when it is missing. */
function find(root: ParentNode, selector: string): HTMLElement {
  const element = root.querySelector(selector);
  if (!(element instanceof HTMLElement)) throw new Error(`missing ${selector}`);
  return element;
}

/** Press a key on whatever has focus (the event bubbles like a real key press). */
function press(key: string, shiftKey = false): void {
  const target = document.activeElement ?? document.body;
  target.dispatchEvent(new KeyboardEvent("keydown", { key, shiftKey, bubbles: true }));
}

/** The `data-lang` of the focused element. */
function focusedLanguage(): string | undefined {
  const focused = document.activeElement;
  return focused instanceof HTMLElement ? focused.dataset.lang : undefined;
}

/** The part of `localStorage` the island uses, kept in memory. */
type MemoryStorage = {
  getItem(key: string): string | undefined;
  setItem(key: string, value: string): void;
};

/**
 * An in-memory `localStorage`. Node 26 defines its own `localStorage` global (undefined without a
 * storage file), which shadows happy-dom's, so the tests bring one.
 */
function memoryStorage(): MemoryStorage {
  const items = new Map<string, string>();
  return {
    getItem: key => items.get(key),
    setItem: (key, value) => {
      items.set(key, value);
    }
  };
}

/** The checked theme of each switch inside the header, in markup order (disc, then plate). */
function checkedThemes(root: Element): string[] {
  return [...root.querySelectorAll<HTMLInputElement>("input[data-theme-choice]:checked")].map(
    radio => radio.value
  );
}

beforeEach(() => {
  vi.stubGlobal("localStorage", memoryStorage());
  delete document.documentElement.dataset.theme;
  vi.mocked(hardNavigate).mockClear();
});

afterEach(() => {
  handle?.unmount();
  handle = undefined;
  vi.unstubAllGlobals();
});

describe("chrome island: language menu", () => {
  // Catches: Esc leaving the popover open, or dropping keyboard focus on the page body.
  it("Esc closes the language menu and returns focus to its button", () => {
    const header = mountHeader("about", "/en/about/");
    const toggle = find(header.el, "[data-lang-toggle]");
    const menu = find(header.el, "[data-lang-menu]");

    toggle.click();
    expect(menu.hidden).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(focusedLanguage()).toBe("en");

    press("Escape");
    expect(menu.hidden).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
  });

  // Catches: wrong index math in the two-column list (skipping a row, leaving the list, no wrap).
  it("arrow keys walk the two columns and wrap inside a column; Home and End jump to the ends", () => {
    const header = mountHeader("about", "/en/about/");
    find(header.el, "[data-lang-toggle]").click();

    press("ArrowDown");
    expect(focusedLanguage()).toBe("uk");
    press("ArrowRight");
    expect(focusedLanguage()).toBe("es");
    press("ArrowUp");
    expect(focusedLanguage()).toBe("ru");
    press("End");
    expect(focusedLanguage()).toBe("zh");
    press("ArrowDown");
    expect(focusedLanguage()).toBe("en");
    press("ArrowUp");
    expect(focusedLanguage()).toBe("zh");
    press("Home");
    expect(focusedLanguage()).toBe("en");
    press("ArrowRight");
    expect(focusedLanguage()).toBe("ru");
    press("ArrowUp");
    expect(focusedLanguage()).toBe("ko");
    press("ArrowDown");
    expect(focusedLanguage()).toBe("ru");
  });

  // Catches: an SPA swap instead of a page load, a target in the wrong route, or an unsaved choice.
  it("choosing a language saves it and hard-navigates to the same page in that locale", () => {
    const header = mountHeader("memoryMissing", "/en/games/memory-missing/");
    find(header.el, "[data-lang-toggle]").click();
    find(header.el, '[data-lang-menu] [data-lang="ru"]').click();

    expect(localStorage.getItem("kitto-lang")).toBe("ru");
    expect(hardNavigate).toHaveBeenCalledExactlyOnceWith("/ru/games/memory-missing/");
  });

  // Catches: a language switch on a 404 building a URL from a path no route has.
  it("on a page outside the route table the phone menu choice goes to that locale's home", () => {
    const header = mountHeader("notFound", "/en/no-such-page/");
    find(header.el, '[data-menu-sheet] [data-lang="ja"]').click();

    expect(hardNavigate).toHaveBeenCalledExactlyOnceWith("/ja/");
  });

  // Catches: a full page reload when the reader picks the language they are already reading.
  it("choosing the current language closes the menu without navigating", () => {
    const header = mountHeader("about", "/en/about/");
    const toggle = find(header.el, "[data-lang-toggle]");
    toggle.click();
    find(header.el, '[data-lang-menu] [data-lang="en"]').click();

    expect(hardNavigate).not.toHaveBeenCalled();
    expect(find(header.el, "[data-lang-menu]").hidden).toBe(true);
    expect(document.activeElement).toBe(toggle);
  });
});

describe("chrome island: current page after navigation", () => {
  // Catches: the outline staying on the page the reader left, or Games losing it on the game page.
  it("onNavEnd moves aria-current in the header to the new page", () => {
    const header = mountHeader("about", "/en/about/");
    const navLink = (route: RouteName): HTMLElement =>
      find(header.el, `[data-nav] a[href="${url(route, { lang: "en" })}"]`);

    history.pushState({}, "", "/en/games/memory-missing/");
    header.navEnd({ locale: "en" });
    expect(navLink("games").getAttribute("aria-current")).toBe("true");
    expect(navLink("about").hasAttribute("aria-current")).toBe(false);
    expect(find(header.el, "[data-brand]").hasAttribute("aria-current")).toBe(false);

    history.pushState({}, "", "/en/");
    header.navEnd({ locale: "en" });
    expect(find(header.el, "[data-brand]").getAttribute("aria-current")).toBe("page");
    expect(navLink("games").hasAttribute("aria-current")).toBe(false);
  });

  // Catches: the footer dot staying on the legal page the reader left.
  it("onNavEnd moves the footer's current mark", () => {
    const footer = mountFooter("privacy", "/en/privacy/");

    history.pushState({}, "", "/en/terms/");
    footer.navEnd({ locale: "en" });
    expect(find(footer.el, 'a[href="/en/terms/"]').getAttribute("aria-current")).toBe("page");
    expect(find(footer.el, 'a[href="/en/privacy/"]').hasAttribute("aria-current")).toBe(false);
  });
});

describe("chrome island: theme switch", () => {
  // Catches: a choice that is not saved, not applied, or a System choice that keeps a forced theme.
  it("a theme choice sets data-theme on <html> and saves it; System removes the attribute", () => {
    const header = mountHeader("about", "/en/about/");

    find(header.el, '[data-variant="disc"] [data-theme-choice="dark"]').click();
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("kitto-theme")).toBe("dark");
    expect(checkedThemes(header.el)).toEqual(["dark", "dark"]);

    find(header.el, '[data-variant="plate"] [data-theme-choice="system"]').click();
    expect("theme" in document.documentElement.dataset).toBe(false);
    expect(localStorage.getItem("kitto-theme")).toBe("system");
    expect(checkedThemes(header.el)).toEqual(["system", "system"]);
  });

  // Catches: a ?theme= preview overwriting the reader's saved choice, or being ignored.
  it("?theme= previews a theme without saving it", () => {
    localStorage.setItem("kitto-theme", "light");
    const header = mountHeader("about", "/en/about/?theme=dark");

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("kitto-theme")).toBe("light");
    expect(checkedThemes(header.el)).toEqual(["dark", "dark"]);
  });

  // Catches: the saved choice ignored on the next page load.
  it("shows the saved theme on load", () => {
    localStorage.setItem("kitto-theme", "light");
    const header = mountHeader("about", "/en/about/");

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(checkedThemes(header.el)).toEqual(["light", "light"]);
  });

  // Catches: a theme switch that waits on a crossfade (a quick second tap on the switch was lost
  // while it ran), or colour fades left off for good after the switch.
  it("switches the theme at once, takes a quick second choice, and turns the fades back on", () => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] });
    const startViewTransition = vi.fn();
    Object.assign(document, { startViewTransition });
    const html = document.documentElement;
    try {
      const header = mountHeader("about", "/en/about/");
      find(header.el, '[data-variant="disc"] [data-theme-choice="dark"]').click();
      expect(html.dataset.theme).toBe("dark");
      expect("themeFade" in html.dataset).toBe(true);

      find(header.el, '[data-variant="disc"] [data-theme-choice="light"]').click();
      expect(html.dataset.theme).toBe("light");
      expect(localStorage.getItem("kitto-theme")).toBe("light");

      expect(startViewTransition).not.toHaveBeenCalled();

      // The fades stay off through the frame that draws the new colours, then come back.
      vi.advanceTimersToNextFrame();
      expect("themeFade" in html.dataset).toBe(true);
      vi.advanceTimersToNextFrame();
      expect("themeFade" in html.dataset).toBe(false);
    } finally {
      Reflect.deleteProperty(document, "startViewTransition");
      vi.useRealTimers();
      delete html.dataset.themeFade;
    }
  });
});

describe("chrome island: phone menu", () => {
  // Catches: a menu that leaves the page under it reachable, lets Tab escape, or ignores Esc.
  it("the phone menu makes the page inert, keeps Tab inside and closes on Esc", () => {
    const header = mountHeader("about", "/en/about/");
    const toggle = find(header.el, "[data-menu-toggle]");
    const sheet = find(header.el, "[data-menu-sheet]");
    const main = find(document, "main");

    toggle.click();
    expect("menuOpen" in header.el.dataset).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(main.hasAttribute("inert")).toBe(true);
    expect(sheet.hasAttribute("inert")).toBe(false);
    expect(document.activeElement).toBe(sheet.querySelector("a"));

    const focusables = [...sheet.querySelectorAll<HTMLElement>("a[href], button, input:checked")];
    focusables.at(-1)?.focus();
    press("Tab");
    expect(document.activeElement).toBe(find(header.el, "[data-brand]"));
    press("Tab", true);
    expect(document.activeElement).toBe(focusables.at(-1));

    press("Escape");
    expect("menuOpen" in header.el.dataset).toBe(false);
    expect(main.hasAttribute("inert")).toBe(false);
    expect(sheet.hasAttribute("inert")).toBe(true);
    expect(document.activeElement).toBe(toggle);
  });

  // Catches: the sheet staying open, with the page inert, over the page a menu link navigated to.
  it("a link in the phone menu closes it", () => {
    const header = mountHeader("about", "/en/about/");
    find(header.el, "[data-menu-toggle]").click();
    document.addEventListener("click", event => event.preventDefault(), {
      capture: true,
      once: true
    });

    find(header.el, "[data-menu-sheet] a").click();
    expect("menuOpen" in header.el.dataset).toBe(false);
    expect(find(document, "main").hasAttribute("inert")).toBe(false);
    // Catches: the sheet sliding away over the new page (it blinked on a phone).
    expect("menuInstant" in header.el.dataset).toBe(true);
  });
});
