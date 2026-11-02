/**
 * @file The `gallery` island: the game page gallery (design-context §4, §6 E1, §7). It drives the
 * gallery the page was built with: the arrows, the thumbnails, ← → (Home / End on a thumbnail), a
 * swipe of the scroll-snap strip, and the lightbox, a modal `<dialog>` with arrows, ← →, swipe,
 * Escape / close / a click on the scrim, a focus loop and the focus returned on close. Reduced
 * motion: the strip jumps and nothing slides or fades.
 *
 * The parts live in `gallery/`: `view` (the session and motion), `strip` (the main view),
 * `lightbox`, `swipe`. The gallery sits inside the swap region, so a navigation removes it with
 * every listener.
 */
import { createIsland, type Spa } from "@moku-labs/web/browser";
import {
  closeLightbox,
  onLightboxClosed,
  onLightboxKey,
  onScrimClick,
  openLightbox,
  stepLightbox
} from "./gallery/lightbox";
import { go, keepInPlace, onStripKey, settleAfterScroll } from "./gallery/strip";
import { endSwipe, moveSwipe, startSwipe } from "./gallery/swipe";
import { type GallerySession, openSession } from "./gallery/view";

/** Per-instance state: the session, or `undefined` when the markup is not a whole gallery. */
type GalleryState = {
  /** The gallery session. */
  session: GallerySession | undefined;
};

/** A handler of a delegated event, given the session, the event and the matched element. */
type SessionHandler<E extends Event> = (session: GallerySession, event: E, target: Element) => void;

/** Narrow an event to the kind a handler expects. */
type EventGuard<E extends Event> = (event: Event) => event is E;

/**
 * Accept any event (a click).
 *
 * @param _event - The event.
 * @returns Always true.
 */
const anyEvent: EventGuard<Event> = (_event): _event is Event => true;

/**
 * Accept key presses only.
 *
 * @param event - The event.
 * @returns True for a keyboard event.
 */
const keyEvent: EventGuard<KeyboardEvent> = (event): event is KeyboardEvent =>
  event instanceof KeyboardEvent;

/**
 * Accept pointer events only.
 *
 * @param event - The event.
 * @returns True for a pointer event.
 */
const pointerEvent: EventGuard<PointerEvent> = (event): event is PointerEvent =>
  event instanceof PointerEvent;

/**
 * Adapt a session handler to a delegated event of one kind. The event classes are looked up only
 * when an event arrives, so this module also loads where there is no DOM (the build).
 *
 * @param guard - Accepts the events the handler expects; others are ignored.
 * @param handler - The handler.
 * @returns A delegated event handler.
 */
function on<E extends Event>(
  guard: EventGuard<E>,
  handler: SessionHandler<E>
): Spa.IslandEventHandler<GalleryState> {
  return (ctx, event, target) => {
    if (ctx.state.session && guard(event)) handler(ctx.state.session, event, target);
  };
}

/**
 * The step of an arrow button.
 *
 * @param arrow - An arrow with `data-gallery-step` or `data-lightbox-step`.
 * @returns `-1` for previous, `1` for next.
 */
function stepOf(arrow: Element): -1 | 1 {
  if (!(arrow instanceof HTMLElement)) return 1;
  const direction = arrow.dataset.galleryStep ?? arrow.dataset.lightboxStep;
  return direction === "previous" ? -1 : 1;
}

/**
 * The position of an element in a list of the gallery's parts.
 *
 * @param parts - The thumbnails or the slide buttons.
 * @param element - The element clicked.
 * @returns Its index, or `-1` when it is not one of them.
 */
const indexIn = (parts: readonly Element[], element: Element): number => parts.indexOf(element);

/**
 * Route a key press: inside the open lightbox it belongs to the lightbox, elsewhere to the main view.
 * The key listener sits on the island root, so the element pressed is the event's own target.
 *
 * @param session - The gallery session.
 * @param event - The key press inside the gallery.
 * @returns {void} Nothing; the lightbox or the main view handles the key.
 */
function onKey(session: GallerySession, event: KeyboardEvent): void {
  const pressed = event.target;
  if (!(pressed instanceof Element)) return;
  const { lightbox } = session.view;
  if (lightbox.contains(pressed)) {
    if (lightbox.open) onLightboxKey(session, event);
    return;
  }
  onStripKey(session, event, pressed);
}

/**
 * Add a listener and return the function that removes it.
 *
 * @param target - The element to listen on.
 * @param type - The event type.
 * @param listener - The listener.
 * @param options - Listener options.
 * @returns A function that removes the listener.
 */
function listen<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  type: K,
  listener: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
}

/**
 * Keep the current picture in place while the main view changes width.
 *
 * @param session - The gallery session.
 * @returns A function that stops watching.
 */
function watchWidth(session: GallerySession): () => void {
  if (!("ResizeObserver" in globalThis)) return () => {};
  const observer = new ResizeObserver(() => keepInPlace(session));
  observer.observe(session.view.track);
  return () => observer.disconnect();
}

/** Game page gallery: arrows, thumbnails, keys, swipe and the lightbox. */
export const galleryIsland = createIsland("gallery", {
  state: (ctx): GalleryState => ({ session: openSession(ctx.el) }),
  events: {
    "click [data-gallery-step]": on(anyEvent, (session, _event, arrow) => {
      go(session, session.index + stepOf(arrow));
    }),
    "click [data-gallery-thumb]": on(anyEvent, (session, _event, thumb) => {
      go(session, indexIn(session.view.thumbs, thumb));
    }),
    "click [data-gallery-open]": on(anyEvent, (session, _event, opener) => {
      openLightbox(session, indexIn(session.view.openers, opener));
    }),
    keydown: on(keyEvent, onKey),
    "click [data-lightbox-close]": on(anyEvent, session => closeLightbox(session)),
    "click [data-lightbox-step]": on(anyEvent, (session, _event, arrow) => {
      stepLightbox(session, stepOf(arrow));
    }),
    "click [data-gallery-lightbox]": on(anyEvent, onScrimClick),
    "pointerdown [data-gallery-lightbox]": on(pointerEvent, startSwipe),
    "pointermove [data-gallery-lightbox]": on(pointerEvent, moveSwipe),
    "pointerup [data-gallery-lightbox]": on(pointerEvent, (session, event) => {
      endSwipe(session, event, false);
    }),
    "pointercancel [data-gallery-lightbox]": on(pointerEvent, (session, event) => {
      endSwipe(session, event, true);
    })
  },
  /**
   * Show the controls, follow the strip's scrolling and width, tidy up after the lightbox closes,
   * and register the cleanup.
   *
   * @param ctx - The island context.
   * @returns {void} Nothing; the gallery is live until the page leaves.
   */
  onMount(ctx) {
    const { session } = ctx.state;
    if (session === undefined) return;
    const { root, track, lightbox } = session.view;
    root.dataset.ready = "";
    ctx.cleanup(listen(track, "scroll", () => settleAfterScroll(session), { passive: true }));
    ctx.cleanup(listen(lightbox, "close", () => onLightboxClosed(session)));
    ctx.cleanup(
      listen(lightbox, "cancel", event => {
        event.preventDefault();
        closeLightbox(session);
      })
    );
    ctx.cleanup(watchWidth(session));
    ctx.cleanup(() => clearTimeout(session.settleTimer));
  }
});
