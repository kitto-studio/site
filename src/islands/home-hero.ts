/**
 * @file The `home-hero` island: the four-plane paper parallax of the home page (design-context §6
 * A1).
 *
 * It measures the hero whenever its size or the headline's size changes (fonts, language, window)
 * and writes the frame placement: `--frame-under` keeps the hills below the lead, `--sun-drop`
 * keeps the sun or moon below the header, `--sun-shift` keeps it right of a long phone headline.
 * On scroll, and with a mouse on desktop, it writes one
 * transform per plane and one for the headline, which sinks behind the rising hills. All numbers
 * come from `lib/parallax`. Reduced motion: it measures, nothing moves.
 */
import { createIsland } from "@moku-labs/web/browser";
import {
  clamp,
  framePlacement,
  headlineMotion,
  heroProgress,
  type PlaneName,
  type Pointer,
  planeTransform,
  sunOpacity,
  sunShift
} from "../lib/parallax";
import { isTouchScreen } from "./motion-pref";

/** How much of the remaining pointer distance the planes catch up per frame. */
const POINTER_EASE = 0.08;

/** Pointer distance under which the easing stops. */
const POINTER_SETTLED = 0.001;

/** The pointer at rest: touch screens, phones, a mouse outside the window. */
const STILL: Pointer = { x: 0, y: 0 };

/** The phone layout (the same width as in the CSS). */
const PHONE_QUERY = "(max-width: 760px)";

/** A mouse or trackpad that hovers: the only pointer that steers the planes. */
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

/** The reader asked for less motion. */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** The elements the hero moves. */
type HeroParts = {
  /** The headline block. */
  text: HTMLElement;
  /** The far plane: its height is the frame height. */
  far: HTMLElement;
  /** Every plane by name. */
  planes: ReadonlyMap<PlaneName, HTMLElement>;
};

/** The media queries the hero follows. */
type HeroMedia = {
  /** Phone layout. */
  phone: MediaQueryList;
  /** A mouse or trackpad that hovers. */
  finePointer: MediaQueryList;
};

/**
 * Narrow a `data-plane` value to a plane name.
 *
 * @param value - The attribute value.
 * @returns True for a known plane.
 */
function isPlaneName(value: string | undefined): value is PlaneName {
  return (
    value === "sun" || value === "far" || value === "mid" || value === "near" || value === "front"
  );
}

/**
 * Find the planes and the headline inside the hero.
 *
 * @param root - The hero element.
 * @returns The parts, or undefined when the markup is incomplete.
 */
function findParts(root: Element): HeroParts | undefined {
  const planes = new Map<PlaneName, HTMLElement>();
  for (const plane of root.querySelectorAll<HTMLElement>("[data-plane]")) {
    const name = plane.dataset.plane;
    if (isPlaneName(name)) {
      planes.set(name, plane);
    }
  }
  const text = root.querySelector<HTMLElement>("[data-hero-text]");
  const far = planes.get("far");
  return text && far ? { text, far, planes } : undefined;
}

/**
 * Format a length in px for a style.
 *
 * @param value - Length in px.
 * @returns The CSS length.
 */
function px(value: number): string {
  return `${value.toFixed(2)}px`;
}

/**
 * Measure how far the sun or moon must move right to stay clear of the headline's longest line.
 * Text rects only: the headline's box is wider than its words.
 *
 * @param root - The hero element.
 * @param parts - The planes and the headline.
 * @param media - The layout queries.
 * @returns The shift in px, 0 when nothing overlaps or off a phone.
 */
function clearOfHeadline(root: HTMLElement, parts: HeroParts, media: HeroMedia): number {
  const heroLeft = root.getBoundingClientRect().left;
  let textRight = 0;
  const words = document.createTreeWalker(parts.text, NodeFilter.SHOW_TEXT);
  for (let node = words.nextNode(); node; node = words.nextNode()) {
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const rect of range.getClientRects()) {
      textRight = Math.max(textRight, rect.right - heroLeft);
    }
  }
  return sunShift({
    frameLeft: parts.far.offsetLeft,
    frameWidth: parts.far.offsetWidth,
    textRight,
    phone: media.phone.matches
  });
}

/**
 * Place the frame in the measured hero.
 *
 * @param root - The hero element.
 * @param parts - The planes and the headline.
 * @param media - The layout queries.
 * @returns {void} Nothing; `--frame-under`, `--sun-drop` and `--sun-shift` fit the measured hero.
 */
function placeFrame(root: HTMLElement, parts: HeroParts, media: HeroMedia): void {
  const placement = framePlacement({
    heroHeight: root.clientHeight,
    frameHeight: parts.far.offsetHeight,
    textBottom: parts.text.offsetTop + parts.text.offsetHeight,
    phone: media.phone.matches
  });
  root.style.setProperty("--frame-under", px(placement.under));
  root.style.setProperty("--sun-drop", px(placement.sunDrop));
  root.style.setProperty("--sun-shift", px(clearOfHeadline(root, parts, media)));
}

/**
 * Fade the sun or moon as the hero scrolls, so none of it peeks above the first sheet. A fade is
 * not motion: it also runs with reduced motion.
 *
 * @param parts - The planes and the headline.
 * @param progress - Hero scroll progress, 0..1.
 * @param phone - Phone layout.
 * @returns {void} Nothing; the sun plane has its opacity for this scroll.
 */
function fadeSun(parts: HeroParts, progress: number, phone: boolean): void {
  const sun = parts.planes.get("sun");
  if (sun) sun.style.opacity = sunOpacity(progress, phone).toFixed(3);
}

/**
 * Move every plane and the headline for the current scroll and pointer.
 *
 * @param root - The hero element.
 * @param parts - The planes and the headline.
 * @param media - The layout queries.
 * @param pointer - The eased pointer.
 * @returns {void} Nothing; every plane and the headline have their transform for this frame.
 */
function moveScene(root: HTMLElement, parts: HeroParts, media: HeroMedia, pointer: Pointer): void {
  // Where the reader is: progress through the hero, and the pointer only for a desktop mouse.
  const phone = media.phone.matches;
  const viewportHeight = globalThis.innerHeight;
  const { scrollY } = globalThis;
  const progress = heroProgress({ scrollY, viewportHeight, heroHeight: root.clientHeight, phone });
  const isDesktopMouse = media.finePointer.matches && !phone;
  const steer = isDesktopMouse ? pointer : STILL;

  // One transform per plane.
  const frameHeight = parts.far.offsetHeight;
  for (const [name, plane] of parts.planes) {
    const motion = planeTransform(name, { progress, pointer: steer, frameHeight, phone });
    plane.style.transform = `translate3d(${px(motion.x)}, ${px(motion.y)}, 0) scale(${motion.scale.toFixed(4)})`;
  }
  fadeSun(parts, progress, phone);

  // The headline sinks and fades behind the rising hills.
  const text = headlineMotion({ progress, scrollY, viewportHeight, pointer: steer, phone });
  parts.text.style.transform = `translate3d(${px(text.x)}, ${px(text.y)}, 0)`;
  parts.text.style.opacity = text.opacity.toFixed(3);
}

/**
 * Ease the pointer one frame towards where the mouse is.
 *
 * @param pointer - The eased pointer; moved in place.
 * @param target - Where the mouse is.
 * @returns True while the pointer has not settled on the target.
 */
function easePointer(pointer: Pointer, target: Pointer): boolean {
  pointer.x += (target.x - pointer.x) * POINTER_EASE;
  pointer.y += (target.y - pointer.y) * POINTER_EASE;
  return (
    Math.abs(target.x - pointer.x) > POINTER_SETTLED ||
    Math.abs(target.y - pointer.y) > POINTER_SETTLED
  );
}

/**
 * Follow a desktop mouse over the page: the target pointer follows its place in the window, and
 * goes back to the middle when it leaves.
 *
 * @param media - The layout queries: only a fine pointer steers.
 * @param target - The pointer the planes ease towards; changed in place.
 * @param schedule - Asks for a frame after each change.
 * @returns A function that stops following.
 */
function watchPointer(media: HeroMedia, target: Pointer, schedule: () => void): () => void {
  const onPointerMove = (event: PointerEvent): void => {
    const isMouse = media.finePointer.matches && event.pointerType === "mouse";
    if (!isMouse) return;
    target.x = clamp((event.clientX / globalThis.innerWidth) * 2 - 1, -1, 1);
    target.y = clamp((event.clientY / globalThis.innerHeight) * 2 - 1, -1, 1);
    schedule();
  };
  const onPointerLeave = (): void => {
    target.x = 0;
    target.y = 0;
    schedule();
  };
  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onPointerLeave);
  return () => {
    document.removeEventListener("pointermove", onPointerMove);
    document.documentElement.removeEventListener("pointerleave", onPointerLeave);
  };
}

/**
 * Reduced motion: nothing moves, but the sun or moon still fades out with the scroll.
 *
 * @param root - The hero element.
 * @param parts - The planes and the headline.
 * @param media - The layout queries.
 * @param resizes - The size observer to stop with the fade.
 * @returns A function that stops the fade and the observer.
 */
function followSunFade(
  root: HTMLElement,
  parts: HeroParts,
  media: HeroMedia,
  resizes: ResizeObserver
): () => void {
  const update = (): void => {
    const { scrollY, innerHeight: viewportHeight } = globalThis;
    const phone = media.phone.matches;
    const progress = heroProgress({
      scrollY,
      viewportHeight,
      heroHeight: root.clientHeight,
      phone
    });
    fadeSun(parts, progress, phone);
  };
  update();
  globalThis.addEventListener("scroll", update, { passive: true });
  return () => {
    resizes.disconnect();
    globalThis.removeEventListener("scroll", update);
  };
}

/**
 * Start the hero: measure it, then follow scroll, pointer and size until stopped.
 *
 * @param root - The hero element.
 * @returns A function that stops every listener.
 */
function startHero(root: HTMLElement): () => void {
  // Guard: the hero needs its planes and its headline.
  const parts = findParts(root);
  if (!parts) return () => {};

  // What the hero follows: the layout, reduced motion, and a pointer eased towards the mouse.
  const media: HeroMedia = {
    phone: globalThis.matchMedia(PHONE_QUERY),
    finePointer: globalThis.matchMedia(FINE_POINTER_QUERY)
  };
  // A touch screen gets the still hero too: the parallax redrew four planes per scrolled frame,
  // more than a phone's GPU keeps up with.
  const still = globalThis.matchMedia(REDUCED_MOTION_QUERY).matches || isTouchScreen();
  const pointer: Pointer = { x: 0, y: 0 };
  const target: Pointer = { x: 0, y: 0 };
  let frame = 0;

  // Redraw on the next frame, and keep redrawing while the pointer eases.
  const tick = (): void => {
    frame = 0;
    const isMoving = easePointer(pointer, target);
    moveScene(root, parts, media, pointer);
    if (isMoving) frame = requestAnimationFrame(tick);
  };
  const schedule = (): void => {
    if (still || frame !== 0) return;
    frame = requestAnimationFrame(tick);
  };

  // Measure now and whenever the hero or the headline changes size; with reduced motion that is all.
  const resizes = new ResizeObserver(() => {
    placeFrame(root, parts, media);
    schedule();
  });
  placeFrame(root, parts, media);
  resizes.observe(root);
  resizes.observe(parts.text);
  if (still) return followSunFade(root, parts, media, resizes);

  // Draw the first frame, then follow the scroll and the mouse until stopped.
  moveScene(root, parts, media, pointer);
  globalThis.addEventListener("scroll", schedule, { passive: true });
  const stopPointer = watchPointer(media, target, schedule);
  return () => {
    cancelAnimationFrame(frame);
    resizes.disconnect();
    globalThis.removeEventListener("scroll", schedule);
    stopPointer();
  };
}

/** Home paper hero: four-plane parallax, sun or moon, the headline sinking behind the hills. */
export const homeHeroIsland = createIsland("home-hero", {
  /**
   * Start the hero, and stop it when the page leaves.
   *
   * @param ctx - The island context: the hero element.
   * @returns {void} Nothing; the hero moves until the page leaves.
   */
  onMount(ctx) {
    if (ctx.el instanceof HTMLElement) {
      ctx.cleanup(startHero(ctx.el));
    }
  }
});
