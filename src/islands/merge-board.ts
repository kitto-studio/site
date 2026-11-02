/**
 * @file The `merge-board` island: plays the merge board of the game page (design-context §4, §6 F7,
 * F8). It picks up the board the page was built with and drives it: pointer drag (mouse, touch,
 * pen), tap-tap, keyboard roving focus (arrows, Home/End, Enter/Space, Escape) with live-region
 * announcements, merges with a pop and paper confetti, the refill after every merge, finished clues
 * flying to the case list, the memory win, New board and Play again. The first time the board comes
 * into view its items drop into their recesses. Reduced motion: every step is instant.
 *
 * The board lives inside the swap region, so a navigation removes it; the cleanup stops pending
 * steps and removes anything floating on `<body>`.
 */
import { createIsland, type Spa } from "@moku-labs/web/browser";
import { cancelPointer, movePointer, pressCell, releasePointer } from "./merge-board/drag";
import { drop } from "./merge-board/motion";
import { newBoard, onCellKey, playAgain, putBackOnEscape, stopBoard } from "./merge-board/play";
import { type BoardSession, readSession } from "./merge-board/session";
import { itemElement } from "./merge-board/view";
import { prefersReducedMotion } from "./motion-pref";

/** Part of the sheet in view before the first board drops in. */
const INTRO_THRESHOLD = 0.4;

/** Wait before the first item drops in, and the gap between items, ms. */
const INTRO_TIMING = { start: 120, gap: 45 };

/** Per-instance state: the session, or `undefined` when the markup is not a whole board. */
type BoardState = {
  /** The board session. */
  session: BoardSession | undefined;
};

/**
 * Adapt a session handler to a delegated pointer event.
 *
 * @param handler - The handler, given the session, the pointer event and the matched element.
 * @returns A delegated event handler that ignores anything but pointer events.
 */
function onPointer(
  handler: (session: BoardSession, event: PointerEvent, target: Element) => void
): Spa.IslandEventHandler<BoardState> {
  return (ctx, event, target) => {
    if (ctx.state.session && event instanceof PointerEvent) {
      handler(ctx.state.session, event, target);
    }
  };
}

/**
 * Adapt a session handler to a delegated key event.
 *
 * @param handler - The handler, given the session, the key press and the matched element.
 * @returns A delegated event handler that ignores anything but keyboard events.
 */
function onKey(
  handler: (session: BoardSession, event: KeyboardEvent, target: Element) => void
): Spa.IslandEventHandler<BoardState> {
  return (ctx, event, target) => {
    if (ctx.state.session && event instanceof KeyboardEvent) {
      handler(ctx.state.session, event, target);
    }
  };
}

/**
 * Adapt a session action to a delegated click.
 *
 * @param action - The action.
 * @returns A delegated event handler.
 */
function onClick(action: (session: BoardSession) => void): Spa.IslandEventHandler<BoardState> {
  return ctx => {
    if (ctx.state.session) action(ctx.state.session);
  };
}

/**
 * Hide the items until the board first comes into view, then drop them in one by one.
 *
 * @param session - The board session.
 * @returns A function that stops watching.
 */
function watchIntro(session: BoardSession): () => void {
  const { root, sheet } = session.view;
  if (prefersReducedMotion() || !("IntersectionObserver" in globalThis)) return () => {};
  root.dataset.boardIntro = "";
  const observer = new IntersectionObserver(
    entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      if (root.dataset.boardIntro === undefined) return;
      delete root.dataset.boardIntro;
      for (const index of session.view.cells.keys()) {
        drop(itemElement(session, index), INTRO_TIMING.start + INTRO_TIMING.gap * index);
      }
    },
    { threshold: INTRO_THRESHOLD }
  );
  observer.observe(sheet);
  return () => observer.disconnect();
}

/** Game page merge board: drag, tap-tap and keyboard play. */
export const mergeBoardIsland = createIsland("merge-board", {
  state: (ctx): BoardState => ({ session: readSession(ctx.el) }),
  events: {
    "pointerdown [data-cell]": onPointer(pressCell),
    pointermove: onPointer(movePointer),
    pointerup: onPointer(releasePointer),
    pointercancel: onPointer(cancelPointer),
    "dragstart [data-board-grid]": (_ctx, event) => event.preventDefault(),
    "keydown [data-cell]": onKey(onCellKey),
    "click [data-board-new]": onClick(newBoard),
    "click [data-board-again]": onClick(playAgain)
  },
  /**
   * Start the first-view drop, listen for Escape on the whole page and register the cleanup.
   *
   * @param ctx - The island context.
   * @returns {void} Nothing; the board waits for its first view and is stopped on teardown.
   */
  onMount(ctx) {
    const { session } = ctx.state;
    if (session === undefined) return;
    const onDocumentKey = (event: KeyboardEvent): void => putBackOnEscape(session, event);
    document.addEventListener("keydown", onDocumentKey);
    ctx.cleanup(() => document.removeEventListener("keydown", onDocumentKey));
    ctx.cleanup(watchIntro(session));
    ctx.cleanup(() => stopBoard(session));
  }
});
