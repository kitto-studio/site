// @vitest-environment happy-dom
import { type IslandHandle, mountIsland } from "@moku-labs/web/testing";
import { renderToString } from "preact-render-to-string";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EmailCard } from "../../../src/components/EmailCard";
import { copyEmailIsland } from "../../../src/islands/copy-email";

let handle: IslandHandle | undefined;

/**
 * Mount the island on the server-rendered English card. The harness builds its own host, so the
 * card's translated copy states are carried over from the rendered `[data-island]` element.
 */
function mountCard(): IslandHandle {
  const template = document.createElement("template");
  template.innerHTML = renderToString(<EmailCard locale="en" />);
  const rendered = template.content.querySelector<HTMLElement>('[data-island="copy-email"]');
  if (rendered === null) throw new Error("missing the copy-email island in EmailCard");
  handle = mountIsland(copyEmailIsland, { html: rendered.innerHTML });
  Object.assign(handle.el.dataset, rendered.dataset);
  return handle;
}

/** The element matching `selector` inside the island; fails the test when it is missing. */
function find(selector: string): HTMLElement {
  const element = handle?.el.querySelector(selector);
  if (!(element instanceof HTMLElement)) throw new Error(`missing ${selector}`);
  return element;
}

/** Stand in for the async clipboard. */
function stubClipboard(writeText: (text: string) => Promise<void>): void {
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  handle?.unmount();
  handle = undefined;
  document.body.replaceChildren();
  document.getSelection()?.removeAllRanges();
  vi.useRealTimers();
});

describe("copy-email island", () => {
  // Catches: the copy button left dead or hidden after the island mounts.
  it("reveals the copy button once it can copy", () => {
    const { el } = mountCard();
    expect(el.dataset.ready).toBe("");
  });

  // Catches: the wrong text copied, no «Copied» confirmation, or a confirmation that never resets.
  it("copies the address, says «Copied», then resets", async () => {
    const writeText = vi.fn(async (_text: string) => {});
    stubClipboard(writeText);
    mountCard();

    handle?.fire("click [data-copy-button]");
    await vi.advanceTimersByTimeAsync(0);

    expect(writeText).toHaveBeenCalledWith("support@kitto.studio");
    expect(find("[data-copy-label]").textContent).toBe("Copied");
    expect(find("[data-copy-button]").dataset.state).toBe("done");
    expect(find("[data-copy-note]").textContent).toBe("The address is on your clipboard.");

    await vi.advanceTimersByTimeAsync(2400);

    expect(find("[data-copy-label]").textContent).toBe("Copy address");
    expect(find("[data-copy-button]").dataset.state).toBeUndefined();
    expect(find("[data-copy-note]").textContent).toBe("");
  });

  // Catches: a refused clipboard failing silently, leaving the reader with nothing copied.
  it("selects the address and says how to copy it when the clipboard refuses", async () => {
    stubClipboard(async () => {
      throw new Error("denied");
    });
    mountCard();

    handle?.fire("click [data-copy-button]");
    await vi.advanceTimersByTimeAsync(0);

    expect(document.getSelection()?.toString()).toBe("support@kitto.studio");
    expect(find("[data-copy-note]").textContent).toBe("Select the address above and copy it.");
    expect(find("[data-copy-label]").textContent).toBe("Copy address");
    expect(find("[data-copy-button]").dataset.state).toBeUndefined();
  });
});
