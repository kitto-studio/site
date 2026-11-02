// @vitest-environment happy-dom
import { type IslandHandle, mountIsland } from "@moku-labs/web/testing";
import { renderToString } from "preact-render-to-string";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Gallery } from "../../../src/components/Gallery";
import { galleryIsland } from "../../../src/islands/gallery";
import { GALLERY, type GalleryItem } from "../../../src/lib/game";

/** Longer than the wait after the strip stops scrolling. */
const SCROLL_SETTLE = 200;

/** One frame of the fake clock: the live region writes its message on the next frame. */
const FRAME = 20;

let handle: IslandHandle | undefined;

/**
 * Mount the island on the server-rendered English gallery. The harness builds its own host, so the
 * rendered root's attributes (`data-single`) are carried over.
 */
function mountGallery(items: readonly GalleryItem[] = GALLERY): HTMLElement {
  const template = document.createElement("template");
  template.innerHTML = renderToString(<Gallery locale="en" items={items} headingId="g" />);
  const rendered = template.content.querySelector<HTMLElement>('[data-island="gallery"]');
  if (rendered === null) throw new Error("missing the gallery island in Gallery");
  handle = mountIsland(galleryIsland, { html: rendered.innerHTML, locale: "en" });
  for (const { name, value } of rendered.attributes) handle.el.setAttribute(name, value);
  return handle.el;
}

/** The element matching `selector` inside the gallery; fails the test when it is missing. */
function find<E extends HTMLElement = HTMLElement>(selector: string): E {
  const element = handle?.el.querySelector(selector);
  if (!(element instanceof HTMLElement)) throw new Error(`missing ${selector}`);
  return element as E;
}

/** Every element matching `selector` inside the gallery. */
const all = (selector: string): HTMLElement[] => [
  ...(handle?.el.querySelectorAll<HTMLElement>(selector) ?? [])
];

/** The thumbnail marked current. */
const currentThumb = (): number =>
  all("[data-gallery-thumb]").findIndex(thumb => thumb.getAttribute("aria-current") === "true");

/** Press a key on an element inside the gallery. */
function press(target: HTMLElement, key: string, init: KeyboardEventInit = {}): void {
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init })
  );
}

/** Send a pointer event to the lightbox. */
function pointer(type: string, clientX: number, target: HTMLElement): void {
  target.dispatchEvent(
    new PointerEvent(type, { bubbles: true, isPrimary: true, pointerId: 1, clientX, clientY: 200 })
  );
}

const lightbox = (): HTMLDialogElement => find<HTMLDialogElement>("[data-gallery-lightbox]");

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = "";
});

afterEach(() => {
  handle?.unmount();
  handle = undefined;
  document.body.replaceChildren();
  vi.useRealTimers();
});

describe("gallery island: the main view", () => {
  // Catches: the next arrow moving the strip while the thumbnails, caption, arrows, focusable slide
  // or the screen-reader announcement stay on the first picture.
  it("shows the next picture everywhere at once", async () => {
    mountGallery();
    find("[data-gallery-step='next']").click();

    expect(currentThumb()).toBe(1);
    expect(find("[data-gallery-label]").textContent).toBe("Loading screen");
    expect(find("[data-gallery-number]").textContent).toBe("2 / 2");
    const [previous, next] = all("[data-gallery-step]");
    expect(next?.getAttribute("aria-disabled")).toBe("true");
    expect(next?.tabIndex).toBe(-1);
    expect(previous?.getAttribute("aria-disabled")).toBe("false");
    expect(previous?.tabIndex).toBe(0);
    const [first, second] = all("[data-gallery-slide]");
    expect(first?.inert).toBe(true);
    expect(second?.inert).toBe(false);

    await vi.advanceTimersByTimeAsync(FRAME);
    expect(find("[data-gallery-live]").textContent).toBe("Loading screen, 2 of 2");
  });

  // Catches: the focus dropped on the page when the arrow in focus steps away at an end.
  it("hands the focus to the other arrow when the focused one steps away", () => {
    mountGallery();
    const next = find("[data-gallery-step='next']");
    next.focus();
    next.click();
    expect(document.activeElement).toBe(find("[data-gallery-step='previous']"));
  });

  // Catches: ← → ignored, wrapping past an end, or a shortcut such as Alt+→ taken from the browser.
  it("moves with the arrow keys and stops at the ends", () => {
    mountGallery();
    const open = all("[data-gallery-open]")[0] as HTMLElement;

    press(open, "ArrowRight", { altKey: true });
    expect(currentThumb()).toBe(0);
    press(open, "ArrowLeft");
    expect(currentThumb()).toBe(0);
    press(open, "ArrowRight");
    expect(currentThumb()).toBe(1);
    press(open, "ArrowRight");
    expect(currentThumb()).toBe(1);
  });

  // Catches: Home / End on a thumbnail doing nothing, or the focus left on the old thumbnail.
  it("jumps to the ends with Home and End on a thumbnail and keeps the focus on it", () => {
    mountGallery([...GALLERY, GALLERY[0] as GalleryItem]);
    const thumbs = all("[data-gallery-thumb]");

    press(thumbs[0] as HTMLElement, "End");
    expect(currentThumb()).toBe(2);
    expect(document.activeElement).toBe(thumbs[2]);
    press(thumbs[2] as HTMLElement, "Home");
    expect(currentThumb()).toBe(0);
  });

  // Catches: a thumbnail that does not show its picture.
  it("shows the picture of a clicked thumbnail", () => {
    mountGallery();
    all("[data-gallery-thumb]")[1]?.click();
    expect(currentThumb()).toBe(1);
    expect(find("[data-gallery-label]").textContent).toBe("Loading screen");
  });

  // Catches: a phone swipe of the strip leaving the thumbnails and caption on the old picture.
  it("makes the picture a swipe came to rest on the current one", async () => {
    mountGallery();
    const track = find("[data-gallery-track]");
    Object.defineProperty(track, "clientWidth", { value: 600, configurable: true });
    track.scrollLeft = 600;
    track.dispatchEvent(new Event("scroll"));

    expect(currentThumb()).toBe(0);
    await vi.advanceTimersByTimeAsync(SCROLL_SETTLE);
    expect(currentThumb()).toBe(1);
  });
});

describe("gallery island: the lightbox", () => {
  // Catches: the lightbox opening empty, on the wrong picture, or without the focus inside it.
  it("opens on the picture clicked, with its caption and the focus on Close", () => {
    mountGallery();
    all("[data-gallery-open]")[0]?.click();

    expect(lightbox().open).toBe(true);
    const shown = find("[data-lightbox-stage]").firstElementChild;
    expect(shown?.getAttribute("alt")).toContain("Key art: a hospital room at night");
    expect(find("[data-lightbox-label]").textContent).toBe("Key art");
    expect(find("[data-lightbox-number]").textContent).toBe("1 / 2");
    expect(find("[data-lightbox-step='previous']").getAttribute("aria-disabled")).toBe("true");
    expect(document.activeElement).toBe(find("[data-lightbox-close]"));
  });

  // Catches: Escape leaving the page behind it on the old picture, or the focus lost on close.
  it("closes on Escape, brings the main view to its picture and returns the focus", () => {
    mountGallery();
    const opener = all("[data-gallery-open]")[0] as HTMLElement;
    opener.focus();
    opener.click();
    press(lightbox(), "ArrowRight");
    expect(find("[data-lightbox-number]").textContent).toBe("2 / 2");
    expect(find("[data-lightbox-stage] [data-gallery-phone]")).toBeTruthy();

    lightbox().dispatchEvent(new Event("cancel", { cancelable: true }));

    expect(lightbox().open).toBe(false);
    expect(currentThumb()).toBe(1);
    expect(document.activeElement).toBe(all("[data-gallery-open]")[1]);
    expect(find("[data-lightbox-stage]").childElementCount).toBe(0);
  });

  // Catches: the lightbox arrows wrapping past an end, or not moving at all.
  it("steps with its arrows and stops at the ends", () => {
    mountGallery();
    all("[data-gallery-open]")[0]?.click();
    find("[data-lightbox-step='previous']").click();
    expect(find("[data-lightbox-number]").textContent).toBe("1 / 2");
    find("[data-lightbox-step='next']").click();
    find("[data-lightbox-step='next']").click();
    expect(find("[data-lightbox-number]").textContent).toBe("2 / 2");
    expect(find("[data-lightbox-label]").textContent).toBe("Loading screen");
    expect(find("[data-lightbox-step='next']").getAttribute("aria-disabled")).toBe("true");
  });

  // Catches: a click on the picture closing it, or a click on the scrim leaving it open.
  it("closes on a click on the scrim, not on the picture", () => {
    mountGallery();
    all("[data-gallery-open]")[0]?.click();
    find("[data-lightbox-stage] [data-gallery-picture]").click();
    expect(lightbox().open).toBe(true);
    lightbox().click();
    expect(lightbox().open).toBe(false);
  });

  // Catches: Tab walking out of the open lightbox into the page behind it.
  it("loops the focus between its controls", () => {
    mountGallery();
    all("[data-gallery-open]")[0]?.click();
    const close = find("[data-lightbox-close]");
    const next = find("[data-lightbox-step='next']");

    next.focus();
    press(next, "Tab");
    expect(document.activeElement).toBe(close);
    press(close, "Tab", { shiftKey: true });
    expect(document.activeElement).toBe(next);
  });

  // Catches: a swipe to the left going back, a short drag changing the picture, or the click that
  // ends a swipe closing the lightbox.
  it("changes the picture on a swipe past 50 px and stays open after it", () => {
    mountGallery();
    all("[data-gallery-open]")[0]?.click();
    const stage = find("[data-lightbox-stage]");

    pointer("pointerdown", 300, stage);
    pointer("pointermove", 270, stage);
    pointer("pointerup", 270, stage);
    lightbox().click();
    expect(lightbox().open).toBe(true);
    expect(find("[data-lightbox-number]").textContent).toBe("1 / 2");

    pointer("pointerdown", 300, stage);
    pointer("pointermove", 220, stage);
    pointer("pointerup", 220, stage);
    lightbox().click();
    expect(lightbox().open).toBe(true);
    expect(find("[data-lightbox-number]").textContent).toBe("2 / 2");
  });
});

describe("gallery island: one picture", () => {
  // Catches: arrows, thumbnails or lightbox arrows offered when there is nowhere to go.
  it("hides every control but Close and keeps the focus on it", () => {
    const root = mountGallery([GALLERY[0] as GalleryItem]);
    expect(root.dataset.single).toBe("");

    press(all("[data-gallery-open]")[0] as HTMLElement, "ArrowRight");
    expect(find("[data-gallery-number]").textContent).toBe("1 / 1");

    all("[data-gallery-open]")[0]?.click();
    const close = find("[data-lightbox-close]");
    press(close, "Tab");
    expect(document.activeElement).toBe(close);
  });
});
