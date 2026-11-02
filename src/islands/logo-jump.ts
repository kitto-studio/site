/**
 * @file The `logo-jump` island: the logo «Прыжок» (Jump) on every page view.
 *
 * Mounted on the header's logo link. The Jump plays after the first paint of a page load, again on
 * every client navigation and on a page restored from the back/forward cache; a click on the logo
 * replays it when the logo links to the page already shown (home). Under reduced motion the logo
 * stays still. The physics are `src/lib/jump.ts`; this file only paints them.
 */
import { createIsland } from "@moku-labs/web/browser";
import {
  isJumpPart,
  JUMP_TIMEOUT_MS,
  type JumpPart,
  type PartState,
  partState,
  partTransform
} from "../lib/jump";
import { prefersReducedMotion } from "./motion-pref";

/** One animated part of the wordmark: its `<g>` and which part it is. */
type Part = {
  /** The part's group in the SVG. */
  element: SVGGraphicsElement;
  /** Which part of the wordmark it is. */
  name: JumpPart;
};

/** The pending animation frame of each logo, to cancel a Jump that is replaced or unmounted. */
const frames = new WeakMap<Element, number>();

/**
 * The animated parts of a logo, in wordmark order.
 *
 * @param root - The logo link.
 * @returns Every `data-part` group with a known part name.
 */
function partsOf(root: Element): Part[] {
  const parts: Part[] = [];
  for (const element of root.querySelectorAll<SVGGraphicsElement>("[data-part]")) {
    const name = element.dataset.part;
    if (isJumpPart(name)) parts.push({ element, name });
  }
  return parts;
}

/**
 * Draw a part in a state.
 *
 * @param part - The part.
 * @param state - Its state at this frame.
 * @returns {void} Nothing; the part shows the state.
 */
function paint(part: Part, state: PartState): void {
  part.element.setAttribute("transform", partTransform(part.name, state));
  part.element.style.opacity = state.opacity.toFixed(3);
}

/**
 * Paint every part as it is at a moment of the Jump.
 *
 * @param parts - The logo's parts.
 * @param elapsed - Time since the Jump started, in ms; a negative time is before the drop.
 * @returns True while at least one part is still moving.
 */
function paintFrame(parts: readonly Part[], elapsed: number): boolean {
  let isMoving = false;
  for (const part of parts) {
    const state = partState(elapsed, part.name);
    paint(part, state);
    if (!state.done) isMoving = true;
  }
  return isMoving;
}

/**
 * Put every part back at rest, with no transform or opacity of its own.
 *
 * @param parts - The logo's parts.
 * @returns {void} Nothing; every part is at rest.
 */
function rest(parts: readonly Part[]): void {
  for (const part of parts) {
    part.element.removeAttribute("transform");
    part.element.style.removeProperty("opacity");
  }
}

/**
 * Cancel the logo's pending frame, if any.
 *
 * @param root - The logo link.
 * @returns {void} Nothing; no frame of the logo is pending.
 */
function stopJump(root: Element): void {
  const frame = frames.get(root);
  if (frame !== undefined) cancelAnimationFrame(frame);
  frames.delete(root);
}

/**
 * Play the Jump now: every part starts hidden above its place and drops in, frame by frame, until
 * all rest (or the time cap is reached). A Jump already running starts over.
 *
 * @param root - The logo link.
 * @returns {void} Nothing; the Jump plays.
 */
function playJump(root: Element): void {
  // Guard: start over; under reduced motion the parts only go to rest.
  stopJump(root);
  const parts = partsOf(root);
  if (prefersReducedMotion()) {
    rest(parts);
    return;
  }

  // Each frame paints the parts at the time since the start, until all rest or time runs out.
  const start = performance.now();
  const step = (): void => {
    const elapsed = performance.now() - start;
    const isRunning = paintFrame(parts, elapsed) && elapsed < JUMP_TIMEOUT_MS;
    if (isRunning) {
      frames.set(root, requestAnimationFrame(step));
      return;
    }
    frames.delete(root);
    rest(parts);
  };

  // Hide every part above its place, then drop them in from the next frame on.
  paintFrame(parts, -1);
  frames.set(root, requestAnimationFrame(step));
}

/**
 * Play the Jump after the next paint, so it is seen even while the page is still loading.
 *
 * @param root - The logo link.
 * @returns {void} Nothing; the Jump starts after the next paint.
 */
function playAfterPaint(root: Element): void {
  stopJump(root);
  const afterPaint = (): void => {
    frames.set(
      root,
      requestAnimationFrame(() => playJump(root))
    );
  };
  frames.set(root, requestAnimationFrame(afterPaint));
}

/**
 * A click on the logo: on the page it links to (home), replay the Jump instead of navigating;
 * anywhere else, or with a modifier key (new tab, new window), let the link work.
 *
 * @param root - The logo link.
 * @param event - The click.
 * @returns {void} Nothing; the Jump replays at home, the link works elsewhere.
 */
function replayOnOwnPage(root: Element, event: Event): void {
  const href = root.getAttribute("href");
  if (href === null || !(event instanceof MouseEvent)) return;
  const hasModifier = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  if (hasModifier) return;
  if (new URL(href, location.href).pathname !== location.pathname) return;
  event.preventDefault();
  playJump(root);
}

/** The logo's Jump: on page view, after client navigation, on a bfcache restore, and on click at home. */
export const logoJumpIsland = createIsland("logo-jump", {
  events: {
    click: (ctx, event) => replayOnOwnPage(ctx.el, event)
  },
  /**
   * Play the Jump after the first paint, and again whenever the page comes back from the
   * back/forward cache.
   *
   * @param ctx - The island context.
   * @returns {void} Nothing; the Jump plays now and on every bfcache restore.
   */
  onMount(ctx) {
    const onPageShow = (event: PageTransitionEvent): void => {
      if (event.persisted) playAfterPaint(ctx.el);
    };
    addEventListener("pageshow", onPageShow);
    ctx.cleanup(() => removeEventListener("pageshow", onPageShow));
    playAfterPaint(ctx.el);
  },
  /**
   * Play the Jump for the page a client navigation brought in.
   *
   * @param ctx - The island context.
   * @param ctx.el - The logo link.
   * @returns {void} Nothing; the Jump plays after the next paint.
   */
  onNavEnd({ el }) {
    playAfterPaint(el);
  },
  /**
   * Stop a Jump still running.
   *
   * @param ctx - The island context.
   * @param ctx.el - The logo link.
   * @returns {void} Nothing; no frame of the logo is pending.
   */
  onDestroy({ el }) {
    stopJump(el);
  }
});
