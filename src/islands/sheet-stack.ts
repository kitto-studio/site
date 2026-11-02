/**
 * @file The `sheet-stack` island: the home sheets enter as a stack of paper (the Stack effect).
 *
 * On scroll it writes two custom properties per sheet: `--lift` (1 entering at the window bottom,
 * 0 landed in its sticky place) and `--cover` (how far the next sheet lies over it); the sheet's
 * CSS turns them into the slide, tilt and sink. A sheet's sticker springs up once the sheet is
 * nearly in place. Stickers stand until the reader scrolls; then a sticker whose sheet is back at
 * the window bottom lies flat, unseen. Reduced motion: only the cover shade follows the scroll.
 */
import { createIsland } from "@moku-labs/web/browser";
import { FOLD_AT, POP_AT, sheetCover, sheetLift } from "../lib/parallax";
import { isTouchScreen, prefersReducedMotion } from "./motion-pref";
import { foldFlat, popUp, standUp } from "./popup-sticker";

/** Delay before a landing sheet's sticker springs up, ms. */
const LAND_DELAY = 60;

/** Delay before the sticker of a sheet peeking in at load springs up: the entrance's last beat, ms. */
const ENTRANCE_DELAY = 1250;

/** A sheet peeking in at load: its top is above the window bottom by this much, px. */
const PEEK_MARGIN = 40;

/** ...and below this part of the window. */
const PEEK_FLOOR = 0.25;

/** Room kept under a sheet taller than the window when it sticks by its bottom, px. */
const PIN_MARGIN = 16;

/** One sheet of the stack and what moves with it. */
type StackSheet = {
  /** The sheet root. */
  sheet: HTMLElement;
  /** Its zero-height marker: the sheet's natural top, untouched by its transform. */
  mark: HTMLElement | undefined;
  /** Its pop-up sticker, if any. */
  sticker: HTMLElement | undefined;
  /** Whether the sticker stands (or is springing up). */
  standing: boolean;
};

/**
 * Collect the sheets of the stack with their markers and stickers.
 *
 * @param root - The stack element.
 * @returns The sheets, top first, every sticker standing.
 */
function collectSheets(root: Element): StackSheet[] {
  const marks = [...root.querySelectorAll<HTMLElement>("[data-stack-mark]")];
  return [...root.querySelectorAll<HTMLElement>("[data-stack]")].map((sheet, index) => ({
    sheet,
    mark: marks[index],
    sticker: sheet.querySelector<HTMLElement>('[data-component="popup-sticker"]') ?? undefined,
    standing: true
  }));
}

/**
 * Spring a sheet's sticker up as the sheet lands, or lay it flat once the sheet is back at the
 * window bottom.
 *
 * @param item - The sheet.
 * @param lift - Its lift, 0..1.
 * @param state - Whether the reader has scrolled, and whether the update is instant (a resize).
 * @param state.armed - The reader has scrolled at least once.
 * @param state.instant - Stand at once instead of springing.
 * @returns {void} Nothing; the sticker stands, springs up or lies flat.
 */
function updateSticker(
  item: StackSheet,
  lift: number,
  state: { armed: boolean; instant: boolean }
): void {
  const { sticker } = item;
  if (!sticker) {
    return;
  }
  if (lift < POP_AT && !item.standing) {
    item.standing = true;
    if (state.instant) {
      standUp(sticker);
    } else {
      popUp(sticker, LAND_DELAY);
    }
  } else if (state.armed && lift > FOLD_AT && item.standing) {
    item.standing = false;
    foldFlat(sticker);
  }
}

/**
 * Read how far the next sheet lies over a sheet. Layout reads only.
 *
 * @param item - The sheet.
 * @param next - The sheet after it, if any.
 * @returns The sheet's cover, 0..1; 0 for the last sheet.
 */
function measureCover(item: StackSheet, next: StackSheet | undefined): number {
  if (!next) {
    return 0;
  }
  return sheetCover({
    bottom: item.sheet.getBoundingClientRect().bottom,
    nextTop: next.sheet.getBoundingClientRect().top,
    height: item.sheet.offsetHeight
  });
}

/**
 * Read how far a sheet still has to travel to its sticky place. Layout reads only.
 *
 * @param item - The sheet.
 * @param reduced - Reduced motion: the lift is not followed.
 * @returns The sheet's lift, 0..1, or undefined when it is not followed.
 */
function measureLift(item: StackSheet, reduced: boolean): number | undefined {
  const { sheet, mark } = item;
  if (reduced || !mark) {
    return undefined;
  }
  return sheetLift({
    markTop: mark.getBoundingClientRect().top,
    viewportHeight: globalThis.innerHeight,
    stickTop: Number.parseFloat(getComputedStyle(sheet).top) || 0
  });
}

/**
 * The stickers of the sheets already peeking in at load (a phone). Layout reads only.
 *
 * @param sheets - The sheets of the stack.
 * @returns The stickers to pop as the last beat of the entrance.
 */
function peekingStickers(sheets: readonly StackSheet[]): HTMLElement[] {
  const viewportHeight = globalThis.innerHeight;
  return sheets.flatMap(({ sheet, sticker }) => {
    const top = sheet.getBoundingClientRect().top;
    const peeks = top < viewportHeight - PEEK_MARGIN && top > viewportHeight * PEEK_FLOOR;
    return sticker && peeks ? [sticker] : [];
  });
}

/**
 * Stick each sheet taller than the room under its sticky top by its bottom instead, so no part of
 * it hides under the next sheet. Runs at load, on resize and whenever a sheet changes size (Safari
 * lays the sheets out after the island starts), never per scrolled frame.
 *
 * @param sheets - The sheets of the stack.
 * @returns {void} Nothing; a tall sheet has its `--stick-top`, every other sheet its CSS top.
 */
function pinTallSheets(sheets: readonly StackSheet[]): void {
  for (const { sheet } of sheets) {
    sheet.style.removeProperty("--stick-top");
  }
  const tall = sheets.flatMap(({ sheet }) => {
    // Only a sticky sheet sticks: on a touch screen the sheets are a plain list, and a top there
    // would shift them.
    if (getComputedStyle(sheet).position !== "sticky") return [];
    const stickTop = Number.parseFloat(getComputedStyle(sheet).top) || 0;
    const height = sheet.offsetHeight;
    const room = globalThis.innerHeight - stickTop - PIN_MARGIN;
    return height > room ? [{ sheet, top: globalThis.innerHeight - height - PIN_MARGIN }] : [];
  });
  for (const { sheet, top } of tall) {
    sheet.style.setProperty("--stick-top", `${String(Math.round(top))}px`);
  }
}

/**
 * Start the stack: follow the scroll and the window size until stopped.
 *
 * @param root - The stack element.
 * @returns A function that stops every listener.
 */
function startStack(root: Element): () => void {
  const sheets = collectSheets(root);
  // A touch screen keeps the sheets still, as under reduced motion: following the lift and the
  // cover restyled every sheet on every scrolled frame. The sheets still stack (CSS sticky).
  const touch = isTouchScreen();
  const reduced = prefersReducedMotion() || touch;
  let armed = false;
  let frame = 0;

  // Every layout read of the frame first, then every style write: no write forces a layout.
  const render = (instant: boolean): void => {
    const measured = sheets.map((item, index) => ({
      item,
      cover: measureCover(item, sheets[index + 1]),
      lift: measureLift(item, reduced)
    }));
    for (const { item, cover, lift } of measured) {
      item.sheet.style.setProperty("--cover", cover.toFixed(3));
      if (lift !== undefined) {
        item.sheet.style.setProperty("--lift", lift.toFixed(3));
        updateSticker(item, lift, { armed, instant });
      }
    }
  };
  const onScroll = (): void => {
    armed = true;
    if (frame === 0) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        render(false);
      });
    }
  };
  const onResize = (): void => {
    pinTallSheets(sheets);
    render(true);
  };
  // A sheet measured before its fonts and art settled is pinned from a wrong height: pin again
  // whenever a sheet changes size, at most once a frame.
  let resizeFrame = 0;
  const sheetsResized = new ResizeObserver(() => {
    if (resizeFrame !== 0) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      onResize();
    });
  });
  for (const { sheet } of sheets) sheetsResized.observe(sheet);

  pinTallSheets(sheets);
  render(true);
  if (!reduced) {
    // A sheet already peeking in at load (a phone) pops as the last beat of the entrance.
    for (const sticker of peekingStickers(sheets)) {
      foldFlat(sticker);
      popUp(sticker, ENTRANCE_DELAY);
    }
  }
  if (!touch) globalThis.addEventListener("scroll", onScroll, { passive: true });
  globalThis.addEventListener("resize", onResize);
  return () => {
    cancelAnimationFrame(frame);
    cancelAnimationFrame(resizeFrame);
    sheetsResized.disconnect();
    globalThis.removeEventListener("scroll", onScroll);
    globalThis.removeEventListener("resize", onResize);
  };
}

/** Home sheets entering as a stack of paper. */
export const sheetStackIsland = createIsland("sheet-stack", {
  /**
   * Start the stack, and stop it when the page leaves.
   *
   * @param ctx - The island context: the stack element.
   * @returns {void} Nothing; the stack follows the scroll until the page leaves.
   */
  onMount(ctx) {
    ctx.cleanup(startStack(ctx.el));
  }
});
