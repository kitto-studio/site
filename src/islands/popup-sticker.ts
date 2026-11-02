/**
 * @file The `popup-sticker` island: the paper hinge of a pop-up sticker (design-context §6 F9).
 *
 * A sticker stands by default. With `data-trigger="view"` (inner pages) it springs up as the last
 * beat of the entrance when it is in view at load; once the reader scrolls, a sticker still below
 * the fold lies flat, unseen, and springs up when it comes into view. With `data-trigger="sheet"`
 * (the home stack) the `sheet-stack` island calls {@link popUp} and {@link foldFlat} as its sheet
 * lands and leaves. A click folds it down and springs it up again. Reduced motion: it just stands.
 *
 * The motion functions are exported for the `sheet-stack` island: shared module functions, not
 * events, coordinate the two islands.
 */
import { createIsland } from "@moku-labs/web/browser";
import { FOLD_SECONDS, foldAngle, hingeAngle, paperLight, SPRING_SECONDS } from "../lib/parallax";
import { prefersReducedMotion } from "./motion-pref";
import { isBelowFold, revealOnView } from "./reveal";

/** A sticker lying flat on its sheet, degrees. */
const FLAT = 90;

/** Delay before a sticker in view at load springs up: after the logo's dot has landed, ms. */
const ENTRANCE_DELAY = 650;

/** Delay before a sticker that scrolled into view springs up, ms. */
const VIEW_DELAY = 120;

/** Delay between the fold-down and the spring-up of a replay, ms. */
const REPLAY_DELAY = 40;

/** If frames are throttled (a background tab), land the upright pose this long after the start, ms. */
const SAFETY_DELAY = 2600;

/** Part of the sticker that must be in view before it springs up. */
const VIEW_THRESHOLD = 0.55;

/** Motion state of one sticker. */
type StickerMotion = {
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
  const created: StickerMotion = { angle: 0, frame: 0, safety: undefined };
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
 * Pose a sticker at a hinge angle: rotate the stand, shade the tab, light the paper.
 *
 * @param sticker - The sticker root element.
 * @param motion - Its motion state.
 * @param angle - Hinge angle, degrees: 0 upright, 90 flat.
 * @returns {void} Nothing; the sticker shows the angle.
 */
function pose(sticker: HTMLElement, motion: StickerMotion, angle: number): void {
  motion.angle = angle;
  const stand = sticker.querySelector<HTMLElement>("[data-sticker-stand]");
  if (stand) {
    stand.style.transform = `rotateX(${angle.toFixed(2)}deg)`;
  }
  const light = paperLight(angle);
  sticker.style.setProperty("--sticker-up", light.up.toFixed(3));
  sticker.style.setProperty("--sticker-light", light.light.toFixed(3));
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
  pose(sticker, motion, FLAT);
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
  pose(sticker, motion, 0);
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
    pose(sticker, motion, hingeAngle(seconds));
    motion.frame = seconds < SPRING_SECONDS ? requestAnimationFrame(step) : 0;
  };
  motion.frame = requestAnimationFrame(step);
  motion.safety = setTimeout(() => standUp(sticker), delay + SAFETY_DELAY);
}

/**
 * Replay a sticker: fold it down fast from where it stands, then spring it up again.
 *
 * @param sticker - The sticker root element.
 * @returns {void} Nothing; the sticker folds down and springs up again.
 */
export function replay(sticker: HTMLElement): void {
  // Guard: under reduced motion the sticker just stands.
  if (prefersReducedMotion()) {
    return;
  }

  // Stop any motion still running on it.
  const motion = motionOf(sticker);
  halt(motion);

  // Fold down from the angle it has now, frame by frame, then spring up again.
  const from = motion.angle;
  const start = performance.now();
  const step = (now: number): void => {
    const seconds = (now - start) / 1000;
    pose(sticker, motion, foldAngle(from, seconds));
    if (seconds < FOLD_SECONDS) {
      motion.frame = requestAnimationFrame(step);
    } else {
      popUp(sticker, REPLAY_DELAY);
    }
  };
  motion.frame = requestAnimationFrame(step);
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

/** Pop-up sticker folding up on its paper tab when it comes into view; a click replays it. */
export const popupStickerIsland = createIsland("popup-sticker", {
  /**
   * Wire the click replay and, outside the home stack, the view trigger.
   *
   * @param ctx - The island context: the sticker element.
   * @returns {void} Nothing; the sticker replays on a click until the page leaves.
   */
  onMount(ctx) {
    const sticker = ctx.el;
    if (!(sticker instanceof HTMLElement) || prefersReducedMotion()) {
      return;
    }
    const onClick = (): void => replay(sticker);
    sticker.addEventListener("click", onClick);
    const stopWatching = sticker.dataset.trigger === "sheet" ? undefined : watchView(sticker);
    ctx.cleanup(() => {
      sticker.removeEventListener("click", onClick);
      stopWatching?.();
      halt(motionOf(sticker));
    });
  }
});
