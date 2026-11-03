// @vitest-environment happy-dom
import { type IslandHandle, mountIsland } from "@moku-labs/web/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sheetStackIsland } from "../../../src/islands/sheet-stack";

/** Three sheets of the stack, each after its zero-height marker, as the home page renders them. */
const STACK =
  '<span data-stack-mark></span><section data-stack style="position: sticky"></section>'.repeat(3);

let handle: IslandHandle | undefined;

/** Layout reads and style writes, in the order the island makes them. */
let calls: ("read" | "write")[] = [];

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] });
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => {
    calls.push("read");
    return new DOMRect(0, 300, 1000, 600);
  });
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(() => {
    calls.push("read");
    return 600;
  });
  vi.spyOn(CSSStyleDeclaration.prototype, "setProperty").mockImplementation(() => {
    calls.push("write");
  });
});

afterEach(() => {
  handle?.unmount();
  handle = undefined;
  calls = [];
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// Catches: a layout read after a style write in the scroll frame, which forces a synchronous layout
// per sheet on every frame of the scroll.
describe("sheet-stack island", () => {
  it("reads every sheet's layout before it writes any style in a scroll frame", () => {
    handle = mountIsland(sheetStackIsland, { html: STACK });
    calls = [];

    globalThis.dispatchEvent(new Event("scroll"));
    vi.advanceTimersToNextFrame();

    const firstWrite = calls.indexOf("write");
    expect(firstWrite).toBeGreaterThan(0);
    expect(calls.filter(call => call === "write")).toHaveLength(6);
    expect(calls.slice(firstWrite)).not.toContain("read");
  });

  // Catches: a phone that still follows each sheet's lift, restyling every sheet per scrolled frame.
  it("does not follow the lift on a touch screen", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query === "(hover: none)",
      media: query
    }));
    const lifts = vi.fn();
    vi.mocked(CSSStyleDeclaration.prototype.setProperty).mockImplementation(name => {
      if (name === "--lift") lifts();
    });
    handle = mountIsland(sheetStackIsland, { html: STACK });

    globalThis.dispatchEvent(new Event("scroll"));
    vi.advanceTimersToNextFrame();

    expect(lifts).not.toHaveBeenCalled();
  });

  // Catches: a sheet taller than the window pinned by its top, so its lower part hides for good
  // under the next sheet (the phone home, game sheet 805 px in 593 px of room).
  it("sticks a sheet taller than the window by its bottom", () => {
    vi.stubGlobal("innerHeight", 500);
    const tops: string[] = [];
    vi.mocked(CSSStyleDeclaration.prototype.setProperty).mockImplementation((name, value) => {
      if (name === "--stick-top") tops.push(String(value));
    });
    handle = mountIsland(sheetStackIsland, { html: STACK });

    // 600 px sheets in a 500 px window stick 116 px above it: 500 - 600 - 16.
    expect(tops).toEqual(["-116px", "-116px", "-116px"]);
  });

  // Catches: sheets pinned from the height they had before Safari laid them out (a sheet measured
  // at 3282 px stuck 2634 px above the window) and never pinned again.
  it("pins a sheet again when its size changes", () => {
    vi.stubGlobal("innerHeight", 500);
    let resized: (() => void) | undefined;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          resized = callback;
        }
        observe(): void {}
        disconnect(): void {}
      }
    );
    let height = 3000;
    vi.mocked(
      Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight")?.get as () => number
    ).mockImplementation(() => height);
    const tops: string[] = [];
    vi.mocked(CSSStyleDeclaration.prototype.setProperty).mockImplementation((name, value) => {
      if (name === "--stick-top") tops.push(String(value));
    });
    handle = mountIsland(sheetStackIsland, { html: STACK });
    tops.length = 0;

    height = 600;
    resized?.();
    vi.advanceTimersToNextFrame();

    // 600 px sheets in a 500 px window: 500 - 600 - 16.
    expect(tops).toEqual(["-116px", "-116px", "-116px"]);
  });

  // Catches: a sheet the page ends under before it reaches its place (the last sheet in a tall
  // window, lift stuck at 0.42 at the very bottom), whose sticker never springs up.
  it("lands a sheet at the bottom of the page even short of its place", () => {
    vi.stubGlobal("innerHeight", 1000);
    vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockImplementation(
      () => new DOMRect(0, 500, 1000, 600)
    );
    const room = { height: 4000, y: 0 };
    vi.spyOn(document.documentElement, "scrollHeight", "get").mockImplementation(() => room.height);
    vi.stubGlobal("scrollY", 0);
    const lifts: string[] = [];
    vi.mocked(CSSStyleDeclaration.prototype.setProperty).mockImplementation((name, value) => {
      if (name === "--lift") lifts.push(String(value));
    });
    handle = mountIsland(sheetStackIsland, { html: STACK });

    // Far from the end: half the window still to travel.
    expect(lifts.at(-1)).toBe("0.500");

    // 200 px of page left: it can only travel to 300 px, (500 - 300) / (1000 - 300) to go.
    vi.stubGlobal("scrollY", 2800);
    globalThis.dispatchEvent(new Event("scroll"));
    vi.advanceTimersToNextFrame();
    expect(lifts.at(-1)).toBe("0.286");

    // The very bottom of the page: nowhere left to travel, so it has landed.
    vi.stubGlobal("scrollY", 3000);
    globalThis.dispatchEvent(new Event("scroll"));
    vi.advanceTimersToNextFrame();
    expect(lifts.at(-1)).toBe("0.000");
  });

  // Catches: a sheet that sticks before the page ends landing at the page end instead, below its
  // sticky place.
  it("still lands a sheet at its sticky place when the page goes on below it", () => {
    vi.stubGlobal("innerHeight", 1000);
    vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockImplementation(
      () => new DOMRect(0, 500, 1000, 600)
    );
    vi.spyOn(document.documentElement, "scrollHeight", "get").mockImplementation(() => 4000);
    vi.stubGlobal("scrollY", 2800);
    const lifts: string[] = [];
    vi.mocked(CSSStyleDeclaration.prototype.setProperty).mockImplementation((name, value) => {
      if (name === "--lift") lifts.push(String(value));
    });
    handle = mountIsland(sheetStackIsland, {
      html: STACK.replaceAll('style="position: sticky"', 'style="position: sticky; top: 400px"')
    });

    // It sticks at 400 px, lower than the 300 px the page end would allow: (500 - 400) / 600.
    expect(lifts.at(-1)).toBe("0.167");
  });

  // Catches: a top set on a sheet that does not stick (a touch screen's plain list), which shifts
  // the sheet down or up instead of pinning it.
  it("pins no sheet that does not stick", () => {
    vi.stubGlobal("innerHeight", 500);
    const tops: string[] = [];
    vi.mocked(CSSStyleDeclaration.prototype.setProperty).mockImplementation((name, value) => {
      if (name === "--stick-top") tops.push(String(value));
    });
    handle = mountIsland(sheetStackIsland, {
      html: STACK.replaceAll(' style="position: sticky"', "")
    });

    expect(tops).toEqual([]);
  });
});
