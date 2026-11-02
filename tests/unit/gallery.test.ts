import { describe, expect, it } from "vitest";
import {
  centredOffset,
  clampIndex,
  dragOffset,
  edgesOf,
  hasControls,
  isSwipe,
  loopFocus,
  restingSlide,
  swipeStep
} from "../../src/lib/gallery";

describe("gallery index", () => {
  // Catches: the gallery wrapping from the last picture to the first (or the other way round).
  it("stays on the last picture past the end and on the first before the start", () => {
    expect(clampIndex(2, 2)).toBe(1);
    expect(clampIndex(-1, 2)).toBe(0);
    expect(clampIndex(1, 3)).toBe(1);
  });

  // Catches: an arrow left visible at an end, or hidden in the middle of the gallery.
  it("marks only the ends as the first and the last picture", () => {
    expect(edgesOf(0, 3)).toEqual({ atStart: true, atEnd: false });
    expect(edgesOf(1, 3)).toEqual({ atStart: false, atEnd: false });
    expect(edgesOf(2, 3)).toEqual({ atStart: false, atEnd: true });
  });

  // Catches: arrows and thumbnails shown for a gallery of one picture.
  it("offers arrows and thumbnails only when there is more than one picture", () => {
    expect(hasControls(1)).toBe(false);
    expect(hasControls(2)).toBe(true);
  });
});

/** One of seven thumbnails, 120 px wide and 12 px apart, in a 400 px strip. */
const thumb = (index: number): { start: number; size: number } => ({
  start: index * 132,
  size: 120
});

describe("thumbnail strip", () => {
  const content = 7 * 120 + 6 * 12;

  // Catches: the active thumbnail scrolled to the edge of the strip, or out of it.
  it("keeps the active thumbnail centred among seven", () => {
    const offset = centredOffset(thumb(3), 400, content);
    const centre = thumb(3).start + 60 - offset;
    expect(centre).toBe(200);
  });

  // Catches: the strip scrolled before its start or past its end at the first and last thumbnail.
  it("stops at both ends of the strip", () => {
    expect(centredOffset(thumb(0), 400, content)).toBe(0);
    expect(centredOffset(thumb(6), 400, content)).toBe(content - 400);
  });

  // Catches: a strip that fits its row being scrolled anyway.
  it("does not scroll a strip that fits", () => {
    expect(centredOffset(thumb(1), 400, 252)).toBe(0);
  });
});

describe("swipe of the main view", () => {
  // Catches: a swipe that rests near a picture making its neighbour the current one.
  it("takes the nearest picture where the strip comes to rest", () => {
    expect(restingSlide(840, 600, 3)).toBe(1);
    expect(restingSlide(960, 600, 3)).toBe(2);
  });

  // Catches: an overscroll past either end naming a picture that does not exist.
  it("stays within the pictures when the strip overscrolls", () => {
    expect(restingSlide(-40, 600, 3)).toBe(0);
    expect(restingSlide(1500, 600, 3)).toBe(2);
  });

  // Catches: a hidden gallery (no width yet) jumping back to the first picture.
  it("names no picture while the strip has no width", () => {
    expect(restingSlide(600, 0, 3)).toBeUndefined();
  });
});

describe("swipe in the lightbox", () => {
  // Catches: a tap, a small wobble or a vertical scroll treated as a sideways swipe.
  it("starts a swipe only for a clear sideways move", () => {
    expect(isSwipe(9, 0)).toBe(false);
    expect(isSwipe(-10, 0)).toBe(true);
    expect(isSwipe(12, 11)).toBe(false);
  });

  // Catches: a swipe to the left going back instead of forward, or a short drag changing the picture.
  it("goes forward on a swipe to the left and back on a swipe to the right, past 50 px", () => {
    expect(swipeStep(-51)).toBe(1);
    expect(swipeStep(51)).toBe(-1);
    expect(swipeStep(-50)).toBe(0);
    expect(swipeStep(50)).toBe(0);
  });

  // Catches: the picture following the finger freely past the first or the last picture.
  it("resists a drag past either end and follows it in between", () => {
    expect(dragOffset(100, 1, 3)).toBe(60);
    expect(dragOffset(100, 0, 3)).toBe(25);
    expect(dragOffset(-100, 0, 3)).toBe(-60);
    expect(dragOffset(-100, 2, 3)).toBe(-25);
  });
});

describe("focus loop", () => {
  const buttons = ["close", "previous", "next"] as const;

  // Catches: Tab leaving the open lightbox for the page behind it.
  it("wraps from the last control to the first and back", () => {
    expect(loopFocus(buttons, "next", false)).toBe("close");
    expect(loopFocus(buttons, "close", true)).toBe("next");
  });

  // Catches: focus stranded outside the lightbox, or the loop fighting a normal Tab step.
  it("pulls an outside focus in and leaves steps inside the loop alone", () => {
    expect(loopFocus(buttons, undefined, false)).toBe("close");
    expect(loopFocus(buttons, "previous", false)).toBeUndefined();
    expect(loopFocus(buttons, "previous", true)).toBeUndefined();
  });
});
