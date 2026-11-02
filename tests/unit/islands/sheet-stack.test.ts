// @vitest-environment happy-dom
import { type IslandHandle, mountIsland } from "@moku-labs/web/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sheetStackIsland } from "../../../src/islands/sheet-stack";

/** Three sheets of the stack, each after its zero-height marker, as the home page renders them. */
const STACK = "<span data-stack-mark></span><section data-stack></section>".repeat(3);

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
});
