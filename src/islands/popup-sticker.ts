/**
 * @file The `popup-sticker` island: the paper hinge of a pop-up sticker (design-context §6 F9).
 *
 * A sticker stands by default. With `data-trigger="view"` (inner pages) it springs up as the last
 * beat of the entrance when it is in view at load; once the reader scrolls, a sticker still below
 * the fold lies flat, unseen, and springs up when it comes into view. With `data-trigger="sheet"`
 * (the home stack) the `sheet-stack` island calls {@link popUp} and {@link foldFlat} as its sheet
 * lands and leaves. A tap pushes it back and it springs upright at once. Reduced motion: it just stands.
 *
 * The motion functions are exported for the `sheet-stack` island: shared module functions, not
 * events, coordinate the two islands.
 */
import { createIsland } from "@moku-labs/web/browser";
import { hingeAngle, kickAngle, paperLight, SPRING_SECONDS } from "../lib/parallax";
import { prefersReducedMotion } from "./motion-pref";
import { isBelowFold, revealOnView } from "./reveal";

/** A sticker lying flat on its sheet, degrees. */
const FLAT = 90;

/** Delay before a sticker in view at load springs up: after the logo's dot has landed, ms. */
const ENTRANCE_DELAY = 650;

/** Delay before a sticker that scrolled into view springs up, ms. */
const VIEW_DELAY = 120;

/** If frames are throttled (a background tab), land the upright pose this long after the start, ms. */
const SAFETY_DELAY = 2600;

/** Part of the sticker that must be in view before it springs up. */
const VIEW_THRESHOLD = 0.55;

/** How much white the sheen lays over the paper per unit of extra light. */
const SHEEN = 1.5;

/** The cast shadow laid back on the sheet: its slant (degrees) and its height flat and standing. */
const CAST = { skew: -42, flat: 0.04, grow: 0.3 };

/** The parts of a sticker that move. */
type StickerParts = {
  /** The piece rotating on its hinge. */
  stand: HTMLElement | null;
  /** The silhouette laid back on the sheet. */
  cast: HTMLElement | null;
  /** The fold's shade on the tab. */
  fold: HTMLElement | null;
  /** The white sheen of the tipped paper. */
  light: HTMLElement | null;
};

/** Motion state of one sticker. */
type StickerMotion = {
  /** Its moving parts, found once. */
  parts: StickerParts;
  /** Current hinge angle, degrees. */
  angle: number;
  /** Pending animation frame, 0 when none. */
  frame: number;
  /** Pending safety timer. */
  safety: ReturnType<typeof setTimeout> | undefined;
};

/** Motion state per sticker element, created on first use. */
const motions = new WeakMap<HTMLElement, StickerMotion>();

/**
 * The motion state of a sticker.
 *
 * @param sticker - The sticker root element.
 * @returns Its state, created upright on first use.
 */
function motionOf(sticker: HTMLElement): StickerMotion {
  const known = motions.get(sticker);
  if (known) {
    return known;
  }
  const find = (selector: string): HTMLElement | null =>
    sticker.querySelector<HTMLElement>(selector);
  const parts: StickerParts = {
    stand: find("[data-sticker-stand]"),
    cast: find("[data-sticker-cast]"),
    fold: find("[data-sticker-fold]"),
    light: find("[data-sticker-light]")
  };
  const created: StickerMotion = { parts, angle: 0, frame: 0, safety: undefined };
  motions.set(sticker, created);
  return created;
}

/**
 * Cancel a sticker's pending frame and safety timer.
 *
 * @param motion - The sticker's motion state.
 * @returns {void} Nothing; no frame or timer of the sticker is pending.
 */
function halt(motion: StickerMotion): void {
  cancelAnimationFrame(motion.frame);
  clearTimeout(motion.safety);
  motion.frame = 0;
  motion.safety = undefined;
}

/**
 * Pose a sticker at a hinge angle: rotate the stand, grow the cast, shade the tab, light the paper.
 * Only opacity and transform change, each on the part itself.
 *
 * @param motion - The sticker's motion state.
 * @param angle - Hinge angle, degrees: 0 upright, 90 flat.
 * @returns {void} Nothing; the sticker shows the angle.
 */
function pose(motion: StickerMotion, angle: number): void {
  motion.angle = angle;
  const { stand, cast, fold, light } = motion.parts;
  const paper = paperLight(angle);

  if (stand) stand.style.transform = `rotateX(${angle.toFixed(2)}deg)`;
  if (cast) {
    cast.style.opacity = paper.up.toFixed(3);
    cast.style.transform = `skewX(${CAST.skew}deg) scaleY(${(CAST.flat + paper.up * CAST.grow).toFixed(4)})`;
  }
  if (fold) fold.style.opacity = paper.up.toFixed(3);
  if (light) light.style.opacity = ((paper.light - 1) * SHEEN).toFixed(3);
}

/**
 * Lay a sticker flat on its sheet at once. Use it while the sticker is out of sight.
 *
 * @param sticker - The sticker root element.
 * @returns {void} Nothing; the sticker lies flat (it stands with reduced motion).
 */
export function foldFlat(sticker: HTMLElement): void {
  if (prefersReducedMotion()) {
    return;
  }
  const motion = motionOf(sticker);
  halt(motion);
  pose(motion, FLAT);
}

/**
 * Stand a sticker upright at once, without the spring.
 *
 * @param sticker - The sticker root element.
 * @returns {void} Nothing; the sticker stands.
 */
export function standUp(sticker: HTMLElement): void {
  const motion = motionOf(sticker);
  halt(motion);
  pose(motion, 0);
}

/**
 * Spring a sticker up from flat with the paper bounce.
 *
 * @param sticker - The sticker root element.
 * @param delay - Wait before the spring starts, ms.
 * @returns {void} Nothing; the sticker springs up after the delay.
 */
export function popUp(sticker: HTMLElement, delay: number): void {
  // Guard: under reduced motion the sticker just stands.
  if (prefersReducedMotion()) {
    return;
  }

  // Stop any motion still running on it.
  const motion = motionOf(sticker);
  halt(motion);

  // Spring up frame by frame after the delay; if frames are throttled, land upright anyway.
  const start = performance.now() + delay;
  const step = (now: number): void => {
    const seconds = (now - start) / 1000;
    pose(motion, hingeAngle(seconds));
    motion.frame = seconds < SPRING_SECONDS ? requestAnimationFrame(step) : 0;
  };
  motion.frame = requestAnimationFrame(step);
  motion.safety = setTimeout(() => standUp(sticker), delay + SAFETY_DELAY);
}

/**
 * Replay a sticker: push it back from where it stands and spring it upright, from this frame on.
 *
 * @param sticker - The sticker root element.
 * @returns {void} Nothing; the sticker bounces and settles upright.
 */
export function replay(sticker: HTMLElement): void {
  // Guard: under reduced motion the sticker just stands.
  if (prefersReducedMotion()) {
    return;
  }

  // Stop any motion still running on it.
  const motion = motionOf(sticker);
  halt(motion);

  // Move now, then frame by frame until the spring settles.
  const from = motion.angle;
  const start = performance.now();
  const step = (now: number): void => {
    const seconds = (now - start) / 1000;
    pose(motion, kickAngle(from, seconds));
    motion.frame = seconds < SPRING_SECONDS ? requestAnimationFrame(step) : 0;
  };
  step(start);
}

/**
 * Whether any part of an element is inside the window.
 *
 * @param element - The element to measure.
 * @returns True when it overlaps the window, top to bottom.
 */
function isOnScreen(element: HTMLElement): boolean {
  const box = element.getBoundingClientRect();
  return box.top < globalThis.innerHeight && box.bottom > 0;
}

/**
 * Spring a sticker up when it comes into view: at load if it is already there, otherwise after
 * the reader's first scroll brings it in.
 *
 * @param sticker - The sticker root element.
 * @returns A function that stops watching.
 */
function watchView(sticker: HTMLElement): () => void {
  // In view at load: spring up as the last beat of the entrance.
  if (isOnScreen(sticker)) {
    foldFlat(sticker);
    popUp(sticker, ENTRANCE_DELAY);
  }

  // Still below the fold at the first scroll: lie flat, unseen, and spring up once in view.
  let stopReveal: (() => void) | undefined;
  const onFirstScroll = (): void => {
    if (!isBelowFold(sticker)) return;
    foldFlat(sticker);
    stopReveal = revealOnView(sticker, VIEW_THRESHOLD, () => popUp(sticker, VIEW_DELAY));
  };

  // Watch until stopped.
  globalThis.addEventListener("scroll", onFirstScroll, { once: true, passive: true });
  return () => {
    globalThis.removeEventListener("scroll", onFirstScroll);
    stopReveal?.();
  };
}

/** Pop-up sticker folding up on its paper tab when it comes into view; a tap replays it. */
export const popupStickerIsland = createIsland("popup-sticker", {
  /**
   * Wire the tap replay and, outside the home stack, the view trigger.
   *
   * @param ctx - The island context: the sticker element.
   * @returns {void} Nothing; the sticker replays on a tap until the page leaves.
   */
  onMount(ctx) {
    const sticker = ctx.el;
    if (!(sticker instanceof HTMLElement) || prefersReducedMotion()) {
      return;
    }
    // The finger landing, not the click after it lifts: the paper moves under the touch.
    const onPress = (): void => replay(sticker);
    sticker.addEventListener("pointerdown", onPress);
    const stopWatching = sticker.dataset.trigger === "sheet" ? undefined : watchView(sticker);
    ctx.cleanup(() => {
      sticker.removeEventListener("pointerdown", onPress);
      stopWatching?.();
      halt(motionOf(sticker));
    });
  }
});
