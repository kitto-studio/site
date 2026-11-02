/**
 * @file The gallery session: the parts of the server-rendered gallery the island drives, read once,
 * and the little state that moves with the reader (the current picture, the lightbox, a swipe).
 * Also the motion helper every part uses, which does nothing when motion is reduced.
 */
import { prefersReducedMotion } from "../motion-pref";

/** The picture node of a slide: the image of `art`, the phone frame of `phone`. */
export const PICTURE_SELECTOR = "[data-gallery-picture], [data-gallery-phone]";

/** Easing of a picture sliding into place. */
export const EASE_OUT = "cubic-bezier(.22,1,.36,1)";

/** The parts of the gallery, from the markup `Gallery` renders. */
export type GalleryView = {
  /** The island root. */
  root: HTMLElement;
  /** The scroll-snap strip of the main view. */
  track: HTMLElement;
  /** One slide per picture, in order. */
  slides: HTMLElement[];
  /** The button over each slide that opens the lightbox. */
  openers: HTMLElement[];
  /** The main view's previous arrow. */
  previous: HTMLElement;
  /** The main view's next arrow. */
  next: HTMLElement;
  /** The scrolling row of thumbnails. */
  thumbStrip: HTMLElement;
  /** One thumbnail per picture. */
  thumbs: HTMLElement[];
  /** Caption of the current picture. */
  label: HTMLElement;
  /** «1 / 2» under the main view. */
  number: HTMLElement;
  /** Polite live region for the announcement of a new picture. */
  live: HTMLElement;
  /** The lightbox dialog. */
  lightbox: HTMLDialogElement;
  /** Where the lightbox shows the picture. */
  stage: HTMLElement;
  /** The lightbox caption. */
  lightboxLabel: HTMLElement;
  /** The lightbox count. */
  lightboxNumber: HTMLElement;
  /** The lightbox close button. */
  close: HTMLElement;
  /** The lightbox previous arrow. */
  lightboxPrevious: HTMLElement;
  /** The lightbox next arrow. */
  lightboxNext: HTMLElement;
};

/** A pointer press in the lightbox that may become a swipe. */
export type Swipe = {
  /** The pointer that pressed. */
  pointerId: number;
  /** Where it pressed, px. */
  x: number;
  /** Where it pressed, px. */
  y: number;
  /** Horizontal travel so far, px. */
  dx: number;
  /** True once the move is a sideways swipe. */
  active: boolean;
};

/** One gallery on the page and where the reader is in it. */
export type GallerySession = {
  /** Its parts. */
  view: GalleryView;
  /** Index of the current picture of the main view. */
  index: number;
  /** Index of the picture the lightbox shows. */
  shown: number;
  /** The element that had the focus when the lightbox opened. */
  opener: HTMLElement | undefined;
  /** The pending check of where a swiped strip came to rest. */
  settleTimer: ReturnType<typeof setTimeout> | undefined;
  /** The press or swipe in progress in the lightbox. */
  swipe: Swipe | undefined;
  /** Ignore the click that ends a swipe, so it does not close the lightbox. */
  swallowClick: boolean;
  /** True while the lightbox fades out. */
  closing: boolean;
};

/** Every part of a view, each possibly missing until checked. */
type MaybeParts<T> = { [K in keyof T]: T[K] | undefined };

/**
 * Check that every part was found.
 *
 * @param parts - The parts, each possibly missing.
 * @returns True when none is missing.
 */
function isComplete<T extends object>(parts: MaybeParts<T>): parts is T {
  return Object.values(parts).every(part => part !== undefined);
}

/**
 * The element matching `selector` inside `root`.
 *
 * @param root - Where to look.
 * @param selector - A CSS selector.
 * @returns The element, or `undefined` when it is missing or not an HTML element.
 */
function one(root: Element, selector: string): HTMLElement | undefined {
  const element = root.querySelector(selector);
  return element instanceof HTMLElement ? element : undefined;
}

/**
 * Every element matching `selector` inside `root`, in document order.
 *
 * @param root - Where to look.
 * @param selector - A CSS selector.
 * @returns The HTML elements.
 */
function many(root: Element, selector: string): HTMLElement[] {
  return [...root.querySelectorAll(selector)].filter(element => element instanceof HTMLElement);
}

/**
 * Read the parts of a gallery from its markup.
 *
 * @param root - The island root.
 * @returns The parts, or `undefined` when the markup is not a whole gallery.
 */
function readView(root: Element): GalleryView | undefined {
  const dialog = root.querySelector("[data-gallery-lightbox]");
  const parts: MaybeParts<GalleryView> = {
    root: root instanceof HTMLElement ? root : undefined,
    track: one(root, "[data-gallery-track]"),
    slides: many(root, "[data-gallery-slide]"),
    openers: many(root, "[data-gallery-open]"),
    previous: one(root, "[data-gallery-step='previous']"),
    next: one(root, "[data-gallery-step='next']"),
    thumbStrip: one(root, "[data-gallery-thumbs]"),
    thumbs: many(root, "[data-gallery-thumb]"),
    label: one(root, "[data-gallery-label]"),
    number: one(root, "[data-gallery-number]"),
    live: one(root, "[data-gallery-live]"),
    lightbox: dialog instanceof HTMLDialogElement ? dialog : undefined,
    stage: one(root, "[data-lightbox-stage]"),
    lightboxLabel: one(root, "[data-lightbox-label]"),
    lightboxNumber: one(root, "[data-lightbox-number]"),
    close: one(root, "[data-lightbox-close]"),
    lightboxPrevious: one(root, "[data-lightbox-step='previous']"),
    lightboxNext: one(root, "[data-lightbox-step='next']")
  };
  if (!isComplete(parts) || parts.slides.length === 0) return undefined;
  return parts;
}

/**
 * Start the session of a gallery, on its first picture as the page was built.
 *
 * @param root - The island root.
 * @returns The session, or `undefined` when the markup is not a whole gallery.
 */
export function openSession(root: Element): GallerySession | undefined {
  const view = readView(root);
  if (view === undefined) return undefined;
  return {
    view,
    index: 0,
    shown: 0,
    opener: undefined,
    settleTimer: undefined,
    swipe: undefined,
    swallowClick: false,
    closing: false
  };
}

/**
 * The number of pictures.
 *
 * @param session - The gallery session.
 * @returns How many slides the gallery has.
 */
export function countOf(session: GallerySession): number {
  return session.view.slides.length;
}

/**
 * Run a keyframe animation, unless motion is reduced or the browser cannot animate.
 *
 * @param element - The element to animate, if any.
 * @param keyframes - The keyframes.
 * @param options - Duration, easing, fill.
 * @returns The animation, or `undefined` when nothing runs.
 */
export function animate(
  element: Element | null | undefined,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
): Animation | undefined {
  if (!element || typeof element.animate !== "function" || prefersReducedMotion()) return undefined;
  return element.animate(keyframes, options);
}
