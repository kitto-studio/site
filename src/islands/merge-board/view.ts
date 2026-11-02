/**
 * @file Painting the merge board from its session: cells and their names, the twin marks, the case
 * list and progress line, the live region and the grid's roving tab stop. State shows as attributes
 * only (`aria-pressed`, `data-twin`, `data-found`…), never classes.
 */
import {
  CHAINS,
  canMerge,
  clueArt,
  fillSlots,
  foundCount,
  type Item,
  itemCode,
  itemKey
} from "../../lib/merge";
import type { BoardSession } from "./session";

/** Size of the clue thumbnails, px. */
const THUMB_SIZE = 256;

/** The boolean state attributes the island sets (`data-<name>`). */
export type Flag = "twin" | "over" | "lifted" | "found" | "on";

/**
 * Set or clear a boolean `data-*` state attribute.
 *
 * @param element - The element, if any.
 * @param flag - The attribute name without `data-`.
 * @param on - Set when true, remove when false.
 * @returns {void} Nothing; the attribute is set or removed.
 */
export function setFlag(element: HTMLElement | undefined, flag: Flag, on: boolean): void {
  if (element === undefined) return;
  if (on) element.dataset[flag] = "";
  else element.removeAttribute(`data-${flag}`);
}

/**
 * The name of an item in the page locale.
 *
 * @param session - The board session.
 * @param item - The item.
 * @returns Its translated name.
 */
export function nameOf(session: BoardSession, item: Item): string {
  return session.items[itemKey(item)];
}

/**
 * The item element in a cell.
 *
 * @param session - The board session.
 * @param index - The cell.
 * @returns The item element, or `undefined` for an empty cell.
 */
export function itemElement(session: BoardSession, index: number): HTMLElement | undefined {
  return session.view.cells[index]?.querySelector<HTMLElement>("[data-item]") ?? undefined;
}

/**
 * The index of a cell element.
 *
 * @param session - The board session.
 * @param element - A cell element, or anything else.
 * @returns Its index, or -1 when it is not a cell of this board.
 */
export function cellIndex(session: BoardSession, element: Element | null | undefined): number {
  return element instanceof HTMLElement ? session.view.cells.indexOf(element) : -1;
}

/**
 * Give a cell its accessible name and its pressed state (pressed while its item is picked up).
 *
 * @param session - The board session.
 * @param index - The cell.
 * @returns {void} Nothing; the cell's `aria-label` and `aria-pressed` are up to date.
 */
export function labelCell(session: BoardSession, index: number): void {
  const cell = session.view.cells[index];
  const item = session.game.cells[index];
  if (cell === undefined) return;
  cell.setAttribute("aria-label", item === undefined ? session.board.empty : nameOf(session, item));
  cell.setAttribute("aria-pressed", String(index === session.selected));
}

/**
 * Draw a cell from the game: its item's art, or nothing.
 *
 * @param session - The board session.
 * @param index - The cell.
 * @returns The new item element, or `undefined` when the cell is empty.
 */
export function paintCell(session: BoardSession, index: number): HTMLElement | undefined {
  // Clear the cell and name it anew; an empty cell stops here.
  const cell = session.view.cells[index];
  const item = session.game.cells[index];
  itemElement(session, index)?.remove();
  labelCell(session, index);
  if (cell === undefined || item === undefined) return undefined;

  // Build the item: its code and its art, which never drags as an image.
  const element = document.createElement("span");
  element.dataset.item = itemCode(item);
  const image = document.createElement("img");
  image.src = clueArt(item);
  image.alt = "";
  image.width = THUMB_SIZE;
  image.height = THUMB_SIZE;
  image.draggable = false;
  image.decoding = "async";
  element.append(image);

  // Put it in the cell.
  cell.append(element);
  return element;
}

/**
 * Mark the cells that can take the item of cell `from` with a dashed ring; clear every mark without
 * one.
 *
 * @param session - The board session.
 * @param from - The cell of the item in hand; without one every mark is cleared.
 * @returns {void} Nothing; `data-twin` marks exactly the twins.
 */
export function markTwins(session: BoardSession, from?: number): void {
  const { cells } = session.game;
  for (const [index, cell] of session.view.cells.entries()) {
    const twin = from !== undefined && index !== from && canMerge(cells[from], cells[index]);
    setFlag(cell, "twin", twin);
  }
}

/**
 * Update the case list: found slots, their names, the memory and the progress line.
 *
 * @param session - The board session.
 * @returns {void} Nothing; the case list and the progress line show the game.
 */
export function paintProgress(session: BoardSession): void {
  // The count of clues found.
  const { board, items, game, view } = session;
  view.progress.textContent = fillSlots(board.progress, { n: foundCount(game) });

  // One slot per chain: found or not, and named for screen readers.
  for (const chain of CHAINS) {
    const found = game.found[chain];
    const name = nameOf(session, { chain, tier: 3 });
    setFlag(view.goals[chain], "found", found);
    view.goals[chain].setAttribute(
      "aria-label",
      fillSlots(found ? board.found : board.missing, { item: name })
    );
  }

  // The memory's slot fills when the board is won.
  setFlag(view.goals.memory, "found", session.won);
  view.goals.memory.setAttribute(
    "aria-label",
    session.won ? board.winTitle : fillSlots(board.missing, { item: items.memory })
  );
}

/**
 * Say something in the live region. It is emptied first and filled on the next frame, so the same
 * message twice is read twice.
 *
 * @param session - The board session.
 * @param message - The message.
 * @returns {void} Nothing; the message is read out on the next frame.
 */
export function announce(session: BoardSession, message: string): void {
  const { live } = session.view;
  live.textContent = "";
  requestAnimationFrame(() => {
    live.textContent = message;
  });
}

/**
 * Move the grid's tab stop to a cell (roving focus). The keyboard moves real focus with it; a pointer
 * only moves the tab stop, so a click shows no focus ring.
 *
 * @param session - The board session.
 * @param index - The cell.
 * @param moveFocus - True for the keyboard: focus the cell.
 * @returns {void} Nothing; the cell is the tab stop, focused when asked.
 */
export function focusCell(session: BoardSession, index: number, moveFocus: boolean): void {
  const { cells, grid } = session.view;
  const previous = cells[session.focus];
  const next = cells[index];
  if (next === undefined) return;
  if (previous !== undefined) previous.tabIndex = -1;
  session.focus = index;
  next.tabIndex = 0;
  if (moveFocus) next.focus();
  else if (grid.contains(document.activeElement) && document.activeElement !== next) {
    next.focus({ preventScroll: true });
  }
}
