/**
 * @file The item in hand on the merge board (tap-tap and the keyboard): picking it up, with its
 * twins ringed and its name announced, and putting it back.
 */
import { fillSlots } from "../../lib/merge";
import { wiggle } from "./motion";
import type { BoardSession } from "./session";
import { announce, itemElement, labelCell, markTwins, nameOf } from "./view";

/**
 * Pick up the item of a cell: it lifts, its twins get a ring, the live region names it.
 *
 * @param session - The board session.
 * @param index - The cell.
 * @returns {void} Nothing; the cell's item is in hand.
 */
export function select(session: BoardSession, index: number): void {
  // Guard: only a cell with an item.
  const previous = session.selected;
  const item = session.game.cells[index];
  if (item === undefined) return;

  // Move the pressed state from the previous cell to this one.
  session.selected = index;
  if (previous !== undefined) labelCell(session, previous);
  labelCell(session, index);

  // Show it: rings on its twins, a wiggle, its name in the live region.
  markTwins(session, index);
  wiggle(itemElement(session, index));
  announce(session, fillSlots(session.board.picked, { item: nameOf(session, item) }));
}

/**
 * Put the picked-up item back.
 *
 * @param session - The board session.
 * @returns {void} Nothing; no cell is pressed and no twin is ringed.
 */
export function deselect(session: BoardSession): void {
  const previous = session.selected;
  session.selected = undefined;
  if (previous !== undefined) labelCell(session, previous);
  markTwins(session);
}
