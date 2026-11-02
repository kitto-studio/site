/**
 * @file The gallery lightbox: a modal `<dialog>` showing a copy of the picture as large as fits, with
 * its caption and count, close, arrows and ← → / Home / End. Escape, the close button and a click on
 * the scrim close it; Tab loops between its controls; on close the main view follows to the picture
 * the lightbox ended on and the focus goes back to where it came from.
 */
import { clampIndex, counter, edgesOf, hasControls, loopFocus } from "../../lib/gallery";
import { go } from "./strip";
import { animate, countOf, EASE_OUT, type GallerySession, PICTURE_SELECTOR } from "./view";

/** How far a picture slides in from the side it came from, px. */
const ENTER_DISTANCE = 56;

/** Durations of the lightbox motion, ms. */
const DURATION = { open: 200, grow: 340, slide: 280, close: 160 };

/**
 * A copy of a slide's picture for the lightbox, loading at once.
 *
 * @param slide - The slide.
 * @returns The copy, or `undefined` when the slide has no picture.
 */
function pictureCopy(slide: HTMLElement | undefined): Element | undefined {
  const picture = slide?.querySelector(PICTURE_SELECTOR);
  if (!picture) return undefined;
  const copy = picture.cloneNode(true);
  if (!(copy instanceof Element)) return undefined;
  const images = copy instanceof HTMLImageElement ? [copy] : [...copy.querySelectorAll("img")];
  for (const image of images) image.loading = "eager";
  return copy;
}

/**
 * Show a picture in the lightbox.
 *
 * @param session - The gallery session.
 * @param index - The picture's index.
 * @param direction - `1` when it comes from the right, `-1` from the left, `0` without a slide.
 * @returns {void} Nothing; the stage, caption, count and arrows show the picture.
 */
export function showShot(session: GallerySession, index: number, direction: -1 | 0 | 1): void {
  // Guard: a slide with a picture to copy.
  const { view } = session;
  const slide = view.slides[index];
  const copy = pictureCopy(slide);
  if (copy === undefined) return;

  // Put the copy on the stage, ending any swipe offset.
  session.shown = index;
  view.stage.style.removeProperty("--gallery-swipe");
  view.stage.replaceChildren(copy);

  // The caption, the count and the arrows follow the picture.
  const count = countOf(session);
  const { atStart, atEnd } = edgesOf(index, count);
  view.lightboxLabel.textContent = slide?.dataset.label ?? "";
  view.lightboxNumber.textContent = counter(index, count);
  view.lightboxPrevious.setAttribute("aria-disabled", String(atStart));
  view.lightboxNext.setAttribute("aria-disabled", String(atEnd));

  // Slide it in from the side it came from; a picture that simply opens does not slide.
  if (direction === 0) return;
  animate(
    copy,
    [
      { opacity: 0, transform: `translateX(${direction * ENTER_DISTANCE}px)` },
      { opacity: 1, transform: "none" }
    ],
    { duration: DURATION.slide, easing: EASE_OUT }
  );
}

/**
 * Step to the previous or the next picture in the lightbox. It never wraps.
 *
 * @param session - The gallery session.
 * @param delta - `-1` or `1`.
 * @returns {void} Nothing; the next picture shows, unless the lightbox is at that end.
 */
export function stepLightbox(session: GallerySession, delta: number): void {
  const target = clampIndex(session.shown + delta, countOf(session));
  if (target !== session.shown) showShot(session, target, target > session.shown ? 1 : -1);
}

/**
 * Open the lightbox on a picture and move the focus to its close button.
 *
 * @param session - The gallery session.
 * @param index - The picture's index.
 * @returns {void} Nothing; the lightbox is open on the picture.
 */
export function openLightbox(session: GallerySession, index: number): void {
  // Guard: a closed lightbox and a picture at that index.
  const { view } = session;
  if (view.lightbox.open || view.slides[index] === undefined) return;

  // Remember where the focus goes back to: where it is, or else the picture's own opener.
  const focused = document.activeElement;
  const hasOwnFocus = focused instanceof HTMLElement && focused !== document.body;
  session.opener = hasOwnFocus ? focused : view.openers[index];

  // Show the picture in the open dialog, the focus on its close button.
  showShot(session, index, 0);
  view.lightbox.showModal();
  view.close.focus();

  // Fade the dialog in while the picture grows into place.
  animate(view.lightbox, [{ opacity: 0 }, { opacity: 1 }], {
    duration: DURATION.open,
    easing: "ease-out"
  });
  animate(
    view.stage.firstElementChild,
    [
      { opacity: 0.3, transform: "scale(.94)" },
      { opacity: 1, transform: "none" }
    ],
    { duration: DURATION.grow, easing: EASE_OUT }
  );
}

/**
 * Close the lightbox, after a short fade unless motion is reduced.
 *
 * @param session - The gallery session.
 * @returns {void} Nothing; the lightbox closes, now or after the fade.
 */
export function closeLightbox(session: GallerySession): void {
  // Guard: only an open lightbox that is not already closing.
  const { lightbox } = session.view;
  if (!lightbox.open || session.closing) return;

  // Fade it out; with no fade (reduced motion, no animation support) it closes at once.
  const fade = animate(lightbox, [{ opacity: 1 }, { opacity: 0 }], {
    duration: DURATION.close,
    easing: "ease-in",
    fill: "forwards"
  });
  if (fade === undefined) {
    lightbox.close();
    return;
  }

  // Close it when the fade ends, however it ends, and drop the fade's held frame.
  session.closing = true;
  const done = (): void => {
    session.closing = false;
    lightbox.close();
    fade.cancel();
  };
  fade.finished.then(done, done);
}

/**
 * Tidy up after the lightbox closed, however it closed: empty the stage, bring the main view to the
 * picture the lightbox ended on, and give the focus back.
 *
 * @param session - The gallery session.
 * @returns {void} Nothing; the main view and the focus are back where the reader left off.
 */
export function onLightboxClosed(session: GallerySession): void {
  const { view, opener } = session;

  // Empty the stage and end any swipe or opener bookkeeping.
  view.stage.replaceChildren();
  view.stage.style.removeProperty("--gallery-swipe");
  session.swipe = undefined;
  session.opener = undefined;

  // Bring the main view to the picture the lightbox ended on.
  if (session.shown !== session.index) go(session, session.shown, true);

  // Opened from the main view: the focus lands on the picture now in view there.
  const isFromView = opener === undefined || opener.closest("[data-gallery-slide]") !== null;
  const back = isFromView ? view.openers[session.index] : opener;
  if (back?.isConnected) back.focus({ preventScroll: true });
}

/**
 * Keep Tab inside the lightbox: past its last control the focus goes back to the first.
 *
 * @param session - The gallery session.
 * @param event - The Tab press.
 * @returns {void} Nothing; the focus wraps around at either end.
 */
function loopTab(session: GallerySession, event: KeyboardEvent): void {
  const { view } = session;
  const controls = hasControls(countOf(session))
    ? [view.close, view.lightboxPrevious, view.lightboxNext]
    : [view.close];
  const current = controls.find(control => control === document.activeElement);
  const target = loopFocus(controls, current, event.shiftKey);
  if (target === undefined) return;
  event.preventDefault();
  target.focus();
}

/**
 * The picture a key asks for in the lightbox.
 *
 * @param key - The key pressed.
 * @param shown - The picture shown.
 * @param count - Number of pictures.
 * @returns The wanted index, or `undefined` for a key the lightbox leaves alone.
 */
function keyTarget(key: string, shown: number, count: number): number | undefined {
  if (key === "ArrowLeft") return shown - 1;
  if (key === "ArrowRight") return shown + 1;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return undefined;
}

/**
 * Keys in the lightbox: Tab loops, ← → step, Home and End jump to the ends.
 *
 * @param session - The gallery session.
 * @param event - The key press inside the lightbox.
 * @returns {void} Nothing; the focus loops or the lightbox steps.
 */
export function onLightboxKey(session: GallerySession, event: KeyboardEvent): void {
  if (event.key === "Tab") {
    loopTab(session, event);
    return;
  }
  const hasModifier = event.altKey || event.ctrlKey || event.metaKey;
  if (hasModifier) return;
  const wanted = keyTarget(event.key, session.shown, countOf(session));
  if (wanted === undefined) return;
  event.preventDefault();
  stepLightbox(session, clampIndex(wanted, countOf(session)) - session.shown);
}

/**
 * Close the lightbox on a click on the scrim: anywhere but the picture and the buttons, and not the
 * click that ends a swipe.
 *
 * @param session - The gallery session.
 * @param event - The click inside the lightbox.
 * @returns {void} Nothing; the lightbox closes on a scrim click.
 */
export function onScrimClick(session: GallerySession, event: Event): void {
  if (session.swallowClick) {
    session.swallowClick = false;
    return;
  }
  const { target } = event;
  if (target instanceof Element && target.closest(`button, ${PICTURE_SELECTOR}`)) return;
  closeLightbox(session);
}
