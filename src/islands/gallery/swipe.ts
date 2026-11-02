/**
 * @file Swipe in the gallery lightbox: the picture follows the finger (or a mouse drag), less past
 * the first or the last picture; a swipe longer than 50 px changes the picture, a shorter one lets it
 * spring back. The click that ends a swipe is swallowed, so it never closes the lightbox.
 */
import { clampIndex, dragOffset, isSwipe, swipeStep } from "../../lib/gallery";
import { prefersReducedMotion } from "../motion-pref";
import { showShot } from "./lightbox";
import { animate, countOf, EASE_OUT, type GallerySession, type Swipe } from "./view";

/** Time the picture takes to spring back after a short drag, ms. */
const SPRING_BACK = 220;

/**
 * Send the rest of a swipe to the lightbox, so it keeps following outside the picture.
 *
 * @param lightbox - The lightbox.
 * @param pointerId - The swiping pointer.
 * @returns {void} Nothing; the lightbox holds the pointer, when it still can.
 */
function capture(lightbox: HTMLElement, pointerId: number): void {
  try {
    lightbox.setPointerCapture(pointerId);
  } catch {
    // The pointer is already gone; the swipe still ends on its pointerup.
  }
}

/**
 * Let the dragged picture spring back to the middle.
 *
 * @param session - The gallery session.
 * @returns {void} Nothing; the picture is back in the middle.
 */
function springBack(session: GallerySession): void {
  const { stage } = session.view;
  const offset = stage.style.getPropertyValue("--gallery-swipe");
  stage.style.removeProperty("--gallery-swipe");
  if (offset === "") return;
  animate(stage.firstElementChild, [{ translate: `${offset} 0` }, { translate: "0px 0" }], {
    duration: SPRING_BACK,
    easing: EASE_OUT
  });
}

/**
 * Note a press that may become a swipe: the main button, not on a button.
 *
 * @param session - The gallery session.
 * @param event - The pointer press in the lightbox.
 * @param target - The element pressed.
 * @returns {void} Nothing; a press that may swipe is noted.
 */
export function startSwipe(session: GallerySession, event: PointerEvent, target: Element): void {
  session.swallowClick = false;
  const isOtherButton = event.pointerType === "mouse" && event.button !== 0;
  if (!event.isPrimary || isOtherButton || target.closest("button")) return;
  session.swipe = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    dx: 0,
    active: false
  };
}

/**
 * Turn a press into a swipe once its move is clearly sideways; from then on the lightbox holds the
 * pointer.
 *
 * @param swipe - The press in progress.
 * @param event - The pointer move.
 * @param lightbox - The lightbox.
 * @returns True when the press is a swipe, now or already.
 */
function activateSwipe(swipe: Swipe, event: PointerEvent, lightbox: HTMLElement): boolean {
  if (swipe.active) return true;
  if (!isSwipe(event.clientX - swipe.x, event.clientY - swipe.y)) return false;
  swipe.active = true;
  capture(lightbox, event.pointerId);
  return true;
}

/**
 * Follow a swipe: once the move is clearly sideways the picture moves with it.
 *
 * @param session - The gallery session.
 * @param event - The pointer move in the lightbox.
 * @returns {void} Nothing; the travel is noted and the picture follows it.
 */
export function moveSwipe(session: GallerySession, event: PointerEvent): void {
  // Guard: the swiping pointer, once its move is a swipe.
  const { swipe } = session;
  if (swipe === undefined || event.pointerId !== swipe.pointerId) return;
  if (!activateSwipe(swipe, event, session.view.lightbox)) return;

  // Note the travel; the picture follows it unless motion is reduced.
  const dx = event.clientX - swipe.x;
  swipe.dx = dx;
  if (prefersReducedMotion()) return;
  const offset = dragOffset(dx, session.shown, countOf(session));
  session.view.stage.style.setProperty("--gallery-swipe", `${offset.toFixed(1)}px`);
}

/**
 * End a swipe: past 50 px show the next or the previous picture, otherwise spring back.
 *
 * @param session - The gallery session.
 * @param event - The pointer release or cancel.
 * @param isCancelled - True when the browser took the pointer away.
 * @returns {void} Nothing; the next picture shows or this one springs back.
 */
export function endSwipe(session: GallerySession, event: PointerEvent, isCancelled: boolean): void {
  // Guard: the swiping pointer ends the swipe; a press that never became a swipe stops here.
  const { swipe } = session;
  if (swipe === undefined || event.pointerId !== swipe.pointerId) return;
  session.swipe = undefined;
  if (!swipe.active) return;

  // A real swipe eats the click that follows the release; read where it lands.
  session.swallowClick = true;
  const step = isCancelled ? 0 : swipeStep(swipe.dx);
  const target = clampIndex(session.shown + step, countOf(session));

  // Show the picture it lands on, or spring back when it stays on this one.
  const isChange = step !== 0 && target !== session.shown;
  if (isChange) {
    showShot(session, target, step);
    return;
  }
  springBack(session);
}
