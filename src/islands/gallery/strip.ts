/**
 * @file The main view of the gallery: the strip of pictures, its arrows, the thumbnails, the caption
 * and the keyboard. Every way of moving (arrow, thumbnail, ← →, a swipe that comes to rest) ends in
 * {@link setActive}, so the thumbnails, the caption, the arrows, the focusable slide and the
 * announcement always agree with the picture in view.
 */
import {
  centredOffset,
  clampIndex,
  counter,
  edgesOf,
  hasControls,
  restingSlide
} from "../../lib/gallery";
import { prefersReducedMotion } from "../motion-pref";
import { countOf, type GallerySession, type GalleryView } from "./view";

/** Quiet time after the last scroll event before the strip counts as at rest, ms. */
const SETTLE_DELAY = 110;

/**
 * Show an arrow, or let it step away at an end (it also leaves the Tab order).
 *
 * @param arrow - The arrow button.
 * @param isOff - True at the end the arrow points to.
 * @returns {void} Nothing; the arrow is shown or stepped away.
 */
function setArrow(arrow: HTMLElement, isOff: boolean): void {
  arrow.setAttribute("aria-disabled", String(isOff));
  arrow.tabIndex = isOff ? -1 : 0;
}

/**
 * Keep the focus on an arrow: when the arrow in focus steps away at an end, the other one takes it.
 *
 * @param view - The gallery parts.
 * @param focused - The element in focus before the change.
 * @param index - The new current picture.
 * @returns {void} Nothing; the focus stays on an arrow that still steps.
 */
function handOverArrowFocus(view: GalleryView, focused: Element | null, index: number): void {
  const count = view.slides.length;
  if (!hasControls(count)) return;
  const { atStart, atEnd } = edgesOf(index, count);
  if (focused === view.previous && atStart) view.next.focus({ preventScroll: true });
  if (focused === view.next && atEnd) view.previous.focus({ preventScroll: true });
}

/**
 * Let the pictures next to the current one load now: a lazy image in a sideways strip can wait too
 * long to start.
 *
 * @param view - The gallery parts.
 * @param index - The current picture.
 * @returns {void} Nothing; the neighbours' images load eagerly.
 */
function warmNeighbours(view: GalleryView, index: number): void {
  for (const slide of view.slides.slice(Math.max(0, index - 1), index + 2)) {
    for (const image of slide.querySelectorAll("img")) image.loading = "eager";
  }
}

/**
 * Scroll the thumbnail row so the current thumbnail sits in its middle, when the row overflows.
 *
 * @param view - The gallery parts.
 * @param index - The current picture.
 * @returns {void} Nothing; the thumbnail row scrolls when it overflows.
 */
function centreThumb(view: GalleryView, index: number): void {
  const strip = view.thumbStrip;
  const thumb = view.thumbs[index];
  if (thumb === undefined || strip.scrollWidth <= strip.clientWidth + 1) return;
  const left = centredOffset(
    { start: thumb.offsetLeft, size: thumb.offsetWidth },
    strip.clientWidth,
    strip.scrollWidth
  );
  strip.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/**
 * Tell a screen reader which picture is in view, on the next frame so the change is heard.
 *
 * @param view - The gallery parts.
 * @param index - The current picture.
 * @returns {void} Nothing; the live region names the picture on the next frame.
 */
function announce(view: GalleryView, index: number): void {
  view.live.textContent = "";
  requestAnimationFrame(() => {
    view.live.textContent = view.slides[index]?.dataset.announce ?? "";
  });
}

/**
 * Mark a picture current in the strip and the thumbnail row: only its slide stays live, only its
 * thumbnail is current.
 *
 * @param view - The gallery parts.
 * @param index - The current picture.
 * @returns {void} Nothing; `inert` and `aria-current` follow the picture.
 */
function markSlides(view: GalleryView, index: number): void {
  for (const [position, slide] of view.slides.entries()) slide.inert = position !== index;
  for (const [position, thumb] of view.thumbs.entries()) {
    thumb.setAttribute("aria-current", String(position === index));
  }
}

/**
 * Make a picture the current one everywhere: slides, thumbnails, arrows, caption, focus.
 *
 * @param session - The gallery session.
 * @param index - The picture's index.
 * @param isAnnounced - Tell a screen reader about the change.
 * @returns {void} Nothing; every part of the gallery shows the picture.
 */
export function setActive(session: GallerySession, index: number, isAnnounced: boolean): void {
  // Note where the focus is before anything moves.
  const { view } = session;
  const count = countOf(session);
  const focused = document.activeElement;
  const hadSlideFocus = view.track.contains(focused);

  // Make the picture current in the strip and the thumbnail row.
  session.index = index;
  markSlides(view, index);

  // The arrows step away at the ends; an arrow in focus hands it over.
  const { atStart, atEnd } = edgesOf(index, count);
  setArrow(view.previous, atStart);
  setArrow(view.next, atEnd);
  handOverArrowFocus(view, focused, index);

  // The caption and the count follow; the neighbours load and the thumbnail row centres.
  view.label.textContent = view.slides[index]?.dataset.label ?? "";
  view.number.textContent = counter(index, count);
  warmNeighbours(view, index);
  centreThumb(view, index);

  // The focus follows into the new slide, and a screen reader hears the change.
  if (hadSlideFocus) view.openers[index]?.focus({ preventScroll: true });
  if (isAnnounced) announce(view, index);
}

/**
 * Move the main view to a picture. It never wraps: past an end it stays where it is.
 *
 * @param session - The gallery session.
 * @param index - The wanted picture, possibly out of range.
 * @param isInstant - Jump instead of scrolling smoothly.
 * @returns True when the picture changed.
 */
export function go(session: GallerySession, index: number, isInstant = false): boolean {
  const target = clampIndex(index, countOf(session));
  if (target === session.index) return false;
  setActive(session, target, true);
  const { track } = session.view;
  const behavior = isInstant || prefersReducedMotion() ? "auto" : "smooth";
  track.scrollTo({ left: target * track.clientWidth, behavior });
  return true;
}

/**
 * After a swipe or a trackpad scroll of the strip, make the picture it rests on the current one.
 *
 * @param session - The gallery session.
 * @returns {void} Nothing; the check runs once the strip is quiet.
 */
export function settleAfterScroll(session: GallerySession): void {
  clearTimeout(session.settleTimer);
  session.settleTimer = setTimeout(() => {
    const { track } = session.view;
    const resting = restingSlide(track.scrollLeft, track.clientWidth, countOf(session));
    if (resting !== undefined && resting !== session.index) setActive(session, resting, true);
  }, SETTLE_DELAY);
}

/**
 * Keep the current picture in place when the strip changes width.
 *
 * @param session - The gallery session.
 * @returns {void} Nothing; the strip scrolls back to the current picture.
 */
export function keepInPlace(session: GallerySession): void {
  const { track } = session.view;
  track.scrollLeft = session.index * track.clientWidth;
}

/**
 * The picture a key asks for: ← and → anywhere in the gallery, Home and End on a thumbnail.
 *
 * @param key - The key pressed.
 * @param index - The current picture.
 * @param count - Number of pictures.
 * @param isOnThumb - The key was pressed on a thumbnail.
 * @returns The wanted index, or `undefined` for a key the gallery leaves alone.
 */
function keyTarget(
  key: string,
  index: number,
  count: number,
  isOnThumb: boolean
): number | undefined {
  if (key === "ArrowLeft") return index - 1;
  if (key === "ArrowRight") return index + 1;
  if (isOnThumb && key === "Home") return 0;
  if (isOnThumb && key === "End") return count - 1;
  return undefined;
}

/**
 * Move the main view with the keyboard. A thumbnail keeps the focus on the current thumbnail.
 *
 * @param session - The gallery session.
 * @param event - The key press inside the gallery, outside the lightbox.
 * @param target - The element the key was pressed on.
 * @returns {void} Nothing; the main view moves to the picture the key asks for.
 */
export function onStripKey(session: GallerySession, event: KeyboardEvent, target: Element): void {
  const hasModifier = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
  if (hasModifier) return;
  const thumb = target.closest("[data-gallery-thumb]");
  const wanted = keyTarget(event.key, session.index, countOf(session), thumb !== null);
  if (wanted === undefined) return;
  event.preventDefault();
  go(session, wanted);
  if (thumb !== null) session.view.thumbs[session.index]?.focus({ preventScroll: true });
}
