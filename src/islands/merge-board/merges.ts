/**
 * @file What a merge sets off on the merge board: the pop and confetti, the refill, a finished clue
 * flying to its slot of the case list, and the win when the last clue lands. Every step after the
 * merge itself waits a moment, and a board that was reset meanwhile skips it. The rules come from
 * `src/lib/merge.ts`; this module applies their results to the page and times them.
 */
import {
  collect,
  fillSlots,
  type Item,
  isMovable,
  isWon,
  keepPlayable,
  refill
} from "../../lib/merge";
import { prefersReducedMotion } from "../motion-pref";
import { burst } from "./confetti";
import { drop, flyTo, pop } from "./motion";
import { deselect } from "./selection";
import type { BoardSession } from "./session";
import {
  announce,
  itemElement,
  markTwins,
  nameOf,
  paintCell,
  paintProgress,
  setFlag
} from "./view";

/** Wait after a merge before the new item drops in, ms (none with reduced motion). */
const REFILL_DELAY = 300;

/** Wait after a merge before a finished clue flies to its slot, ms. */
const COLLECT_DELAY = 820;

/** Wait after a merge before a finished clue lands in its slot with reduced motion, ms. */
const COLLECT_DELAY_REDUCED = 300;

/** Wait after the last clue lands before the memory rises, ms (none with reduced motion). */
const WIN_DELAY = 380;

/** Confetti bits of a merge, of a finished clue, of the win. */
const BITS = { merge: 10, clue: 16, win: 34 };

/**
 * Run a step later, unless the board was reset or removed in the meantime.
 *
 * @param session - The board session.
 * @param delay - Wait, ms.
 * @param step - The step.
 * @returns {void} Nothing; the step is scheduled.
 */
function later(session: BoardSession, delay: number, step: () => void): void {
  const round = session.round;
  const timer = setTimeout(() => {
    session.timers.delete(timer);
    if (session.round === round) step();
  }, delay);
  session.timers.add(timer);
}

/**
 * Apply a refill: paint and drop each new item, and refresh the rings of an item in hand.
 *
 * @param session - The board session.
 * @param game - The game after the refill.
 * @param dropped - The cells that received an item.
 * @returns {void} Nothing; the new items drop into their cells.
 */
function showDrops(
  session: BoardSession,
  game: BoardSession["game"],
  dropped: readonly number[]
): void {
  session.game = game;
  for (const index of dropped) drop(paintCell(session, index), 0);
  if (session.selected !== undefined) markTwins(session, session.selected);
}

/**
 * Drop new tier-1 items into the board after a merge, so a pair always exists.
 *
 * @param session - The board session.
 * @returns {void} Nothing; the new items drop in.
 */
function spawn(session: BoardSession): void {
  if (session.won) return;
  const { game, dropped } = refill(session.game, Math.random);
  showDrops(session, game, dropped);
}

/**
 * The memory rises: the win overlay, the orb, confetti, the announcement. A keyboard player lands on
 * Play again; a pointer player keeps the focus where it was.
 *
 * @param session - The board session.
 * @returns {void} Nothing; the win shows and the board is locked.
 */
function win(session: BoardSession): void {
  // Note whether a keyboard player is on the board, before the grid locks.
  const { view } = session;
  const fromKeyboard = view.grid.contains(document.activeElement);

  // Lock the board: no item in hand, no input.
  session.won = true;
  deselect(session);
  view.grid.inert = true;

  // The memory rises over the board, with the case list complete.
  view.win.hidden = false;
  setFlag(view.orb, "on", true);
  paintProgress(session);
  pop(view.orb, true);
  burst(view.fx, view.orb, BITS.win, true);

  // Say it; a keyboard player lands on Play again.
  announce(session, `${session.board.winTitle} ${session.board.winText}`);
  if (fromKeyboard) view.again.focus({ preventScroll: true });
}

/**
 * Land a finished clue in its slot: the cell empties, the slot is marked found, and either the
 * memory rises or the board is kept playable.
 *
 * @param session - The board session.
 * @param index - The cell of the finished clue.
 * @param clue - The finished clue.
 * @param round - The board the clue was finished on.
 * @returns {void} Nothing; the clue is collected, unless the board moved on.
 */
function landClue(session: BoardSession, index: number, clue: Item, round: number): void {
  // Guard: the same board, and the cell still holds a finished clue.
  const collected = collect(session.game, index);
  if (session.round !== round || collected === undefined) return;

  // Mark the slot found and show it; name the clue the first time its chain is found.
  const isFirstFind = !session.game.found[clue.chain];
  session.game = collected;
  paintCell(session, index);
  paintProgress(session);
  pop(session.view.goals[clue.chain].querySelector("img"), false);
  if (isFirstFind) {
    announce(session, fillSlots(session.board.found, { item: nameOf(session, clue) }));
  }

  // The last clue brings the memory; any other keeps a pair on the board.
  if (isWon(session.game)) {
    later(session, prefersReducedMotion() ? 0 : WIN_DELAY, () => win(session));
    return;
  }
  const { game, dropped } = keepPlayable(session.game, Math.random);
  showDrops(session, game, dropped);
}

/**
 * Collect the finished clue of a cell: it flies to its slot and lands there. With reduced motion,
 * or without its item element, it lands at once.
 *
 * @param session - The board session.
 * @param index - The cell of the finished clue.
 * @returns {void} Nothing; the clue is on its way to its slot.
 */
function collectAt(session: BoardSession, index: number): void {
  // Guard: only a finished clue is collected.
  const clue = session.game.cells[index];
  if (clue === undefined || isMovable(clue)) return;

  // Fly it to its slot; the landing waits for the flight and is skipped if the board moves on.
  const round = session.round;
  const element = itemElement(session, index);
  const onLanded = (flight: HTMLElement): void => {
    session.floating.delete(flight);
    landClue(session, index, clue, round);
  };
  const flight =
    element === undefined ? undefined : flyTo(element, session.view.goals[clue.chain], onLanded);

  // Nothing flies: land it now. Otherwise keep the copy, so a reset can remove it.
  if (flight === undefined) {
    landClue(session, index, clue, round);
    return;
  }
  session.floating.add(flight);
}

/**
 * Merge the item of `from` onto its twin in `to`, then schedule the refill and, for a finished clue,
 * its flight to the case list.
 *
 * @param session - The board session.
 * @param game - The game after the merge.
 * @param from - The emptied cell.
 * @param to - The cell with the merged item.
 * @returns {void} Nothing; the merge shows and its next steps are scheduled.
 */
export function showMerge(
  session: BoardSession,
  game: BoardSession["game"],
  from: number,
  to: number
): void {
  // Paint both cells from the merged game.
  session.game = game;
  paintCell(session, from);
  const element = paintCell(session, to);

  // Guard: the target cell holds the new item.
  const made = game.cells[to];
  const cell = session.view.cells[to];
  if (made === undefined || cell === undefined) return;

  // Celebrate it: a pop, confetti and its name; a finished clue gets more of both.
  const isFinished = !isMovable(made);
  pop(element, isFinished);
  burst(session.view.fx, cell, isFinished ? BITS.clue : BITS.merge, false);
  announce(session, fillSlots(session.board.merged, { item: nameOf(session, made) }));

  // Schedule the clue's flight and the refill.
  const reduced = prefersReducedMotion();
  const collectDelay = reduced ? COLLECT_DELAY_REDUCED : COLLECT_DELAY;
  if (isFinished) later(session, collectDelay, () => collectAt(session, to));
  later(session, reduced ? 0 : REFILL_DELAY, () => spawn(session));
}
