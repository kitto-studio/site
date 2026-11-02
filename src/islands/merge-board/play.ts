/**
 * @file Playing the merge board: dropping the item in hand (tap-tap, the keyboard and the end of a
 * drag) onto its twin or into an empty cell, a refused drop, and the board's rounds (stop, a new
 * board, Play again). The item in hand is `selection.ts`; what a merge sets off is `merges.ts`. Every
 * rule comes from `src/lib/merge.ts`; this module applies the result to the page.
 */
import { canMerge, isMovable, merge, move, newGame, nextCell } from "../../lib/merge";
import { showMerge } from "./merges";
import { drop, nudge, slideFrom } from "./motion";
import { deselect, select } from "./selection";
import type { BoardSession } from "./session";
import {
  cellIndex,
  focusCell,
  itemElement,
  markTwins,
  paintCell,
  paintProgress,
  setFlag
} from "./view";

/** Gap between the drops of a new board's items, ms. */
const DEAL_GAP = 40;

/**
 * Drop the item of `from` on cell `to`: onto its twin it merges, into an empty cell it moves.
 *
 * @param session - The board session.
 * @param from - The cell of the item.
 * @param to - The cell it is dropped on.
 * @param slide - Slide the item across when it moves (tap-tap and keyboard; a drag already carried it).
 * @returns True when the drop did something.
 */
export function act(session: BoardSession, from: number, to: number, slide: boolean): boolean {
  // Onto its twin: merge.
  const merged = merge(session.game, from, to);
  if (merged !== undefined) {
    showMerge(session, merged, from, to);
    return true;
  }

  // Guard: anything else but an empty cell refuses it.
  const moved = move(session.game, from, to);
  if (moved === undefined) return false;

  // Into an empty cell: move it, sliding across from its old cell.
  const start = session.view.cells[from]?.getBoundingClientRect();
  session.game = moved;
  paintCell(session, from);
  const element = paintCell(session, to);
  if (slide && start !== undefined) slideFrom(element, start);
  return true;
}

/**
 * Whether cell `to` can take the item of cell `from`: it is empty or holds its twin.
 *
 * @param session - The board session.
 * @param from - The cell of the item.
 * @param to - The other cell.
 * @returns True when a drop there would do something.
 */
export function canTake(session: BoardSession, from: number, to: number): boolean {
  const { cells } = session.game;
  return from !== to && (cells[to] === undefined || canMerge(cells[from], cells[to]));
}

/**
 * Tap-tap, Enter and Space: the first tap picks an item up, a tap on its twin or an empty cell drops
 * it there, a tap on itself puts it back, a tap on another item picks that one instead.
 *
 * @param session - The board session.
 * @param index - The tapped cell.
 * @returns {void} Nothing; the item in hand is picked up, dropped or put back.
 */
export function tap(session: BoardSession, index: number): void {
  // Guard: a won board and a finished clue take no taps.
  const item = session.game.cells[index];
  const from = session.selected;
  const isFinishedClue = item !== undefined && !isMovable(item);
  if (session.won || isFinishedClue) return;

  // Pick up, put back, drop, or pick up another item instead.
  if (from === undefined) {
    select(session, index);
  } else if (from === index) {
    deselect(session);
  } else if (canTake(session, from, index)) {
    deselect(session);
    act(session, from, index, true);
  } else {
    select(session, index);
  }
}

/**
 * Keys on a cell: arrows, Home and End move the focus, Enter and Space pick up and drop, Escape puts
 * the item back.
 *
 * @param session - The board session.
 * @param event - The key press.
 * @param cell - The focused cell.
 * @returns {void} Nothing; the focus moves or the item in hand changes.
 */
export function onCellKey(session: BoardSession, event: KeyboardEvent, cell: Element): void {
  // Guard: a cell of a board still in play.
  const index = cellIndex(session, cell);
  if (session.won || index === -1) return;

  // Name what the key asks for.
  const next = nextCell(index, event.key);
  const isPressKey = event.key === "Enter" || event.key === " ";
  const isPutBack = event.key === "Escape" && session.selected !== undefined;

  // Move the focus, tap the cell, or put the item back.
  if (next !== undefined) {
    event.preventDefault();
    focusCell(session, next, true);
  } else if (isPressKey) {
    event.preventDefault();
    tap(session, index);
  } else if (isPutBack) {
    event.preventDefault();
    deselect(session);
  }
}

/**
 * Escape anywhere on the page puts back the item in hand, also one picked with the mouse while the
 * focus is outside the grid. A key a cell or another island already handled is left alone.
 *
 * @param session - The board session.
 * @param event - A key press on the document.
 * @returns {void} Nothing; the item in hand, if any, is put back.
 */
export function putBackOnEscape(session: BoardSession, event: KeyboardEvent): void {
  const isPutBack = event.key === "Escape" && session.selected !== undefined && !session.won;
  if (!isPutBack || event.defaultPrevented) return;
  event.preventDefault();
  deselect(session);
}

/**
 * Stop everything in flight: pending steps, ghosts and flying clues, a drag.
 *
 * @param session - The board session.
 * @returns {void} Nothing; nothing of this board runs or floats any more.
 */
export function stopBoard(session: BoardSession): void {
  // Make every pending step stale, then clear the timers, the floating copies and the press.
  session.round += 1;
  for (const timer of session.timers) clearTimeout(timer);
  session.timers.clear();
  for (const element of session.floating) element.remove();
  session.floating.clear();
  session.press = undefined;
  delete document.documentElement.dataset.boardDragging;
}

/**
 * Deal a new board: nothing found, ten new tier-1 items dropping in one by one.
 *
 * @param session - The board session.
 * @returns {void} Nothing; a fresh board drops in.
 */
export function newBoard(session: BoardSession): void {
  // Stop the old board and deal a fresh game.
  const { view } = session;
  stopBoard(session);
  session.won = false;
  session.selected = undefined;
  session.game = newGame(Math.random);

  // Unlock the grid and put the win and the first-view intro away.
  view.grid.inert = false;
  view.win.hidden = true;
  setFlag(view.orb, "on", false);
  delete view.root.dataset.boardIntro;
  markTwins(session);

  // Drop the new items in one by one and empty the case list.
  for (const index of session.game.cells.keys()) drop(paintCell(session, index), DEAL_GAP * index);
  paintProgress(session);
}

/**
 * Play again after the win: a new board, the tab stop back on the first cell, and focus there when
 * it was on the button.
 *
 * @param session - The board session.
 * @returns {void} Nothing; a fresh board drops in.
 */
export function playAgain(session: BoardSession): void {
  const hadFocus = document.activeElement === session.view.again;
  newBoard(session);
  focusCell(session, 0, false);
  if (hadFocus) session.view.cells[0]?.focus({ preventScroll: true });
}

/**
 * A refused drop: the item it landed on shakes.
 *
 * @param session - The board session.
 * @param index - The cell that refused it.
 * @returns {void} Nothing; the item shakes.
 */
export function refuse(session: BoardSession, index: number): void {
  nudge(itemElement(session, index));
}
