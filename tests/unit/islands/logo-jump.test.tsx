// @vitest-environment happy-dom
import { type IslandHandle, mountIsland } from "@moku-labs/web/testing";
import { renderToString } from "preact-render-to-string";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Logo } from "../../../src/components/Logo";
import { logoJumpIsland } from "../../../src/islands/logo-jump";

/** One animation frame of the fake clock. */
const FRAME = 16;

/** Longer than any Jump (the dot settles before 2 s, the cap is 4 s). */
const WHOLE_JUMP = 5000;

let handle: IslandHandle | undefined;

/** Mount the island on a logo link pointing at `href`, on a page served at `path`. */
function mountLogo(path: string, href: string): IslandHandle {
  history.replaceState({}, "", path);
  handle = mountIsland(logoJumpIsland, { html: renderToString(<Logo />), persistent: true });
  handle.el.setAttribute("href", href);
  return handle;
}

/** True while any part of the wordmark is moved or faded by the Jump. */
function isMoving(root: Element): boolean {
  return [...root.querySelectorAll("[data-part]")].some(part => part.hasAttribute("transform"));
}

/** A `pageshow` event, from the back/forward cache or not. */
function pageshow(persisted: boolean): Event {
  const event = new Event("pageshow");
  Object.defineProperty(event, "persisted", { value: persisted });
  return event;
}

/** Click the logo link and return the event, to read `defaultPrevented`. */
function click(root: Element): MouseEvent {
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });
  root.dispatchEvent(event);
  return event;
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
});

afterEach(() => {
  handle?.unmount();
  handle = undefined;
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("logo-jump island", () => {
  // Catches: a Jump started before the first paint (never seen) or one that never comes to rest.
  it("plays once after the first paint and comes to rest", () => {
    const logo = mountLogo("/en/about/", "/en/");
    expect(isMoving(logo.el)).toBe(false);

    vi.advanceTimersByTime(3 * FRAME);
    expect(isMoving(logo.el)).toBe(true);

    vi.advanceTimersByTime(WHOLE_JUMP);
    expect(isMoving(logo.el)).toBe(false);
  });

  // Catches: no Jump on client navigation or bfcache restore, or a second Jump on a normal load.
  it("replays on every client navigation and on a back/forward cache restore only", () => {
    const logo = mountLogo("/en/about/", "/en/");
    vi.advanceTimersByTime(WHOLE_JUMP);

    logo.navEnd();
    vi.advanceTimersByTime(3 * FRAME);
    expect(isMoving(logo.el)).toBe(true);
    vi.advanceTimersByTime(WHOLE_JUMP);

    globalThis.dispatchEvent(pageshow(false));
    vi.advanceTimersByTime(3 * FRAME);
    expect(isMoving(logo.el)).toBe(false);

    globalThis.dispatchEvent(pageshow(true));
    vi.advanceTimersByTime(3 * FRAME);
    expect(isMoving(logo.el)).toBe(true);
  });

  // Catches: a logo that cannot take the reader home, or a home click that reloads instead of jumping.
  it("a click replays the Jump on its own page and leaves navigation to other pages alone", () => {
    const logo = mountLogo("/en/", "/en/");
    vi.advanceTimersByTime(WHOLE_JUMP);

    expect(click(logo.el).defaultPrevented).toBe(true);
    expect(isMoving(logo.el)).toBe(true);
    vi.advanceTimersByTime(WHOLE_JUMP);

    history.replaceState({}, "", "/en/about/");
    expect(click(logo.el).defaultPrevented).toBe(false);
    expect(isMoving(logo.el)).toBe(false);
  });

  // Catches: motion for a reader who asked the system for none.
  it("never moves the logo under reduced motion", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("reduce"),
      media: query
    }));
    const logo = mountLogo("/en/about/", "/en/");

    vi.advanceTimersByTime(3 * FRAME);
    expect(isMoving(logo.el)).toBe(false);
    logo.navEnd();
    vi.advanceTimersByTime(3 * FRAME);
    expect(isMoving(logo.el)).toBe(false);
  });
});
