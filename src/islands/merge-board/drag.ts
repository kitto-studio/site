/**
 * @file Pointer input on the merge board (mouse, touch and pen). A press that stays put is a tap; one
 * that moves a few pixels lifts the item into a ghost that follows the pointer. Dropped on its twin
 * or an empty cell it lands there; anywhere else it floats back. Only items stop the page from
 * scrolling (`touch-action: none` in the CSS), so a finger on an empty cell still scrolls.
 */
import { isMovable } from "../../lib/merge";
import { floatBack, floatingCopy } from "./motion";
import { act, canTake, refuse, tap } from "./play";
import { deselect } from "./selection";
import type { BoardSession, Drag, Press } from "./session";
import { cellIndex, focusCell, itemElement, markTwins, setFlag } from "./view";

/** Distance a mouse moves before a press becomes a drag, px. */
const MOUSE_DRAG_DISTANCE = 5;

/** Distance a finger or pen moves before a press becomes a drag, px. */
const TOUCH_DRAG_DISTANCE = 8;

/**
 * The cell under a point of the viewport.
 *
 * @param session - The board session.
 * @param x - Viewport x, px.
 * @param y - Viewport y, px.
 * @returns The cell index, or `undefined` off the board.
 */
function cellUnder(session: BoardSession, x: number, y: number): number | undefined {
  const index = cellIndex(session, document.elementFromPoint(x, y)?.closest("[data-cell]"));
  return index === -1 ? undefined : index;
}

/**
 * Move the ghost so the pointer keeps its grip on the item.
 *
 * @param drag - The drag.
 * @param x - Pointer x, px.
 * @param y - Pointer y, px.
 * @returns {void} Nothing; the ghost moves.
 */
function placeGhost(drag: Drag, x: number, y: number): void {
  drag.ghost.style.transform = `translate(${x - drag.offsetX}px, ${y - drag.offsetY}px)`;
}

/**
 * Lift the pressed item into a ghost on `<body>` and ring its twins.
 *
 * @param session - The board session.
 * @param press - The press that became a drag.
 * @returns The drag, or `undefined` when the cell has no item any more.
 */
function startDrag(session: BoardSession, press: Press): Drag | undefined {
  const item = itemElement(session, press.index);
  if (item === undefined) return undefined;
  deselect(session);
  const box = item.getBoundingClientRect();
  const ghost = floatingCopy(item, "ghost");
  ghost.style.width = `${box.width}px`;
  ghost.style.height = `${box.height}px`;
  document.body.append(ghost);
  session.floating.add(ghost);
  setFlag(item, "lifted", true);
  document.documentElement.dataset.boardDragging = "";
  markTwins(session, press.index);
  return { item, ghost, offsetX: press.x - box.left, offsetY: press.y - box.top, over: undefined };
}

/**
 * Warm the cell under the dragged item when it can take it.
 *
 * @param session - The board session.
 * @param press - The press of the drag.
 * @param drag - The drag.
 * @param index - The cell under the pointer, if any.
 * @returns {void} Nothing; only a cell that can take the item is marked.
 */
function hover(session: BoardSession, press: Press, drag: Drag, index: number | undefined): void {
  if (drag.over === index) return;
  const { cells } = session.view;
  if (drag.over !== undefined) setFlag(cells[drag.over], "over", false);
  drag.over = index;
  if (index !== undefined && canTake(session, press.index, index)) {
    setFlag(cells[index], "over", true);
  }
}

/**
 * Remove a drag's ghost and show the item in its cell again.
 *
 * @param session - The board session.
 * @param drag - The drag.
 * @returns {void} Nothing; the ghost is gone and the item shows again.
 */
function dropGhost(session: BoardSession, drag: Drag): void {
  drag.ghost.remove();
  session.floating.delete(drag.ghost);
  setFlag(drag.item, "lifted", false);
}

/**
 * End a drag over a cell, or over nothing: land on a twin or an empty cell, otherwise float back.
 *
 * @param session - The board session.
 * @param press - The press of the drag.
 * @param drag - The drag.
 * @param target - The cell under the pointer; none when the browser took the pointer away.
 * @returns {void} Nothing; the item lands or floats back.
 */
function endDrag(session: BoardSession, press: Press, drag: Drag, target?: number): void {
  if (drag.over !== undefined) setFlag(session.view.cells[drag.over], "over", false);
  delete document.documentElement.dataset.boardDragging;
  markTwins(session);
  if (target !== undefined && canTake(session, press.index, target)) {
    dropGhost(session, drag);
    act(session, press.index, target, false);
    focusCell(session, target, false);
    return;
  }
  if (target !== undefined && target !== press.index) refuse(session, target);
  floatBack(drag.ghost, drag.item, () => dropGhost(session, drag));
}

/**
 * A pointer goes down on a cell. On an item it is captured, so the drag keeps its events when it
 * leaves the cell.
 *
 * @param session - The board session.
 * @param event - The pointer event.
 * @param cell - The pressed cell.
 * @returns {void} Nothing; the press is noted and the cell gets the tab stop.
 */
export function pressCell(session: BoardSession, event: PointerEvent, cell: Element): void {
  // Guard: a board still in play, no drag running, the main button, a cell of this board.
  const index = cellIndex(session, cell);
  const busy = session.press?.drag !== undefined;
  const otherButton = event.pointerType === "mouse" && event.button !== 0;
  if (session.won || busy || otherButton || index === -1) return;

  // Note the press; on an item, capture the pointer so a drag keeps its events off the cell.
  const movable = isMovable(session.game.cells[index]);
  session.press = {
    id: event.pointerId,
    index,
    x: event.clientX,
    y: event.clientY,
    movable,
    mouse: event.pointerType === "mouse",
    drag: undefined
  };
  if (movable) {
    event.preventDefault();
    try {
      cell.setPointerCapture(event.pointerId);
    } catch {
      // The pointer is already gone: the press still ends as a tap.
    }
  }

  // The pressed cell takes the tab stop.
  focusCell(session, index, false);
}

/**
 * The pointer moves: past a few pixels the press becomes a drag, then the ghost follows it.
 *
 * @param session - The board session.
 * @param event - The pointer event.
 * @returns {void} Nothing; the drag starts or its ghost follows.
 */
export function movePointer(session: BoardSession, event: PointerEvent): void {
  const press = session.press;
  if (press === undefined || event.pointerId !== press.id || !press.movable) return;

  // Start the drag once the pointer has moved far enough for this kind of pointer.
  if (press.drag === undefined) {
    const distance = Math.hypot(event.clientX - press.x, event.clientY - press.y);
    const threshold = press.mouse ? MOUSE_DRAG_DISTANCE : TOUCH_DRAG_DISTANCE;
    if (distance < threshold) return;
    press.drag = startDrag(session, press);
  }
  if (press.drag === undefined) return;

  // Follow the pointer with the ghost and mark the cell under it.
  placeGhost(press.drag, event.clientX, event.clientY);
  hover(session, press, press.drag, cellUnder(session, event.clientX, event.clientY));
}

/**
 * The pointer comes up: the end of a drag, or a tap.
 *
 * @param session - The board session.
 * @param event - The pointer event.
 * @returns {void} Nothing; the drag ends or the cell is tapped.
 */
export function releasePointer(session: BoardSession, event: PointerEvent): void {
  const press = session.press;
  if (press === undefined || event.pointerId !== press.id) return;
  session.press = undefined;
  if (press.drag === undefined) tap(session, press.index);
  else endDrag(session, press, press.drag, cellUnder(session, event.clientX, event.clientY));
}

/**
 * The browser takes the pointer away (a scroll, a system gesture): a drag floats back.
 *
 * @param session - The board session.
 * @param event - The pointer event.
 * @returns {void} Nothing; a drag floats back.
 */
export function cancelPointer(session: BoardSession, event: PointerEvent): void {
  const press = session.press;
  if (press === undefined || event.pointerId !== press.id) return;
  session.press = undefined;
  if (press.drag !== undefined) endDrag(session, press, press.drag);
}
