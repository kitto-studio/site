// @vitest-environment happy-dom
import { type IslandHandle, mountIsland } from "@moku-labs/web/testing";
import { renderToString } from "preact-render-to-string";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { KittoMeaning } from "../../../src/components/KittoMeaning";
import { kanaDropIsland } from "../../../src/islands/kana-drop";

let handle: IslandHandle | undefined;

/** The callback of the one IntersectionObserver the island creates, once it creates it. */
let reportView: ((entries: { isIntersecting: boolean }[]) => void) | undefined;

/** Stand in for IntersectionObserver: keep the callback so a test can report the kana in view. */
class FakeObserver {
  /** @param callback - The island's view callback. */
  constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
    reportView = callback;
  }

  /** Nothing to watch in happy-dom. */
  observe(): void {}

  /** Nothing to stop. */
  disconnect(): void {}
}

/** Answer `prefers-reduced-motion` as asked. */
function stubReducedMotion(reduce: boolean): void {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query.includes("reduce"),
    media: query
  }));
}

/**
 * Mount the island on the rendered kana block of the About page, placed `top` px down the window.
 * The harness builds its own host, so the block's rendered content is carried over.
 */
function mountKana(top: number): HTMLElement {
  const template = document.createElement("template");
  template.innerHTML = renderToString(<KittoMeaning locale="en" headingId="about-name" />);
  const rendered = template.content.querySelector('[data-island="kana-drop"]');
  if (rendered === null) throw new Error("missing the kana-drop island in KittoMeaning");
  handle = mountIsland(kanaDropIsland, { html: rendered.innerHTML });
  handle.el.getBoundingClientRect = () => ({ top }) as DOMRect;
  return handle.el;
}

/** The reader's first scroll. */
function scroll(): void {
  globalThis.dispatchEvent(new Event("scroll"));
}

beforeEach(() => {
  reportView = undefined;
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  stubReducedMotion(false);
});

afterEach(() => {
  handle?.unmount();
  handle = undefined;
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

describe("kana-drop island", () => {
  // Catches: kana that stay hidden after the reader scrolls them into view.
  it("hides kana below the fold on the first scroll and drops them when they come into view", () => {
    const kana = mountKana(2000);

    scroll();
    expect(kana.dataset.kana).toBe("wait");

    reportView?.([{ isIntersecting: true }]);
    expect(kana.dataset.kana).toBe("drop");
  });

  // Catches: kana the reader is already looking at blinking out on the first scroll.
  it("leaves kana that are already in view standing", () => {
    const kana = mountKana(100);

    scroll();

    expect(kana.dataset.kana).toBeUndefined();
    expect(reportView).toBeUndefined();
  });

  // Catches: kana hidden for a reader who asked for less motion, so the page is not complete.
  it("does nothing with reduced motion: the kana stay as rendered", () => {
    stubReducedMotion(true);
    const kana = mountKana(2000);

    scroll();
    kana.click();

    expect(kana.dataset.kana).toBeUndefined();
  });

  // Catches: a click that does not replay the drop.
  it("drops the kana again on a click", () => {
    const kana = mountKana(100);

    kana.click();

    expect(kana.dataset.kana).toBe("drop");
  });
});
